#!/usr/bin/env python3
"""Validate exported PDFs and render every page. Needs pypdf, Pillow, pdftoppm."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import json, os, re, subprocess, hashlib
from pypdf import PdfReader
from PIL import Image, ImageDraw
ROOT = Path(__file__).resolve().parent.parent
QA = ROOT / 'export/qa'
PDFS = sorted((ROOT / 'pdf').glob('[0-9][0-9].pdf'))
manifest = json.loads((QA/'manifest.json').read_text())
assert len(PDFS) == len(manifest)
first_data=json.loads((QA/'01.json').read_text())
assert len(PDFS) == first_data['sceneCount'] + 1
assert manifest[0]['title'] == 'BIRTHDAY ARCHIVE / CASE FILE'
assert [p.name for p in PDFS] == [f'{i:02}.pdf' for i in range(1,len(PDFS)+1)]
normalize = lambda s: re.sub(r'[^a-zA-Z0-9À-ž]', '', s).lower()
results=[]
for path in PDFS:
    reader=PdfReader(path); assert len(reader.pages)==1
    page=reader.pages[0]
    mm=[float(v)*25.4/72 for v in (page.mediabox.width,page.mediabox.height)]
    assert all(abs(a-b)<1e-7 for a,b in zip(mm,[210,125])),mm
    data=json.loads((QA/(path.stem+'.json')).read_text())
    text=normalize(page.extract_text())
    missing=[t['text'] for t in data['textRects'] if len(normalize(t['text']))>2 and normalize(t['text']) not in text]
    assert not missing,(path,missing)
    outside=[t['text'] for t in data['textRects'] if any(r[0]<18 or r[1]<18 or r[0]+r[2]>776 or r[1]+r[3]>454 for r in t['rects'])]
    assert not outside,(path,outside)
    assert data['background']=='rgb(241, 243, 236)'
    for img in data['images']:
        assert img['filter']=='none'
        assert (ROOT/img['src']).read_bytes()==(ROOT.parent/'prototype-3'/img['src']).read_bytes(),img['src']
    fonts=[]
    def visit_fonts(resources):
        for ref in resources.get('/Font',{}).values():
            font=ref.get_object();name=str(font.get('/BaseFont',font.get('/Name','Type3')))
            if font.get('/Subtype')=='/Type3': embedded=bool(font.get('/CharProcs'))
            else:
                base=font.get('/DescendantFonts',[font])[0].get_object()
                descriptor=base.get('/FontDescriptor',{}).get_object() if base.get('/FontDescriptor') else {}
                embedded=any(k in descriptor for k in ['/FontFile','/FontFile2','/FontFile3'])
            assert embedded,(path,name)
            fonts.append(name)
        for ref in resources.get('/XObject',{}).values():
            obj=ref.get_object()
            if obj.get('/Resources'): visit_fonts(obj['/Resources'])
    visit_fonts(page['/Resources'])
    results.append({'file':path.name,'title':data['title'],'mm':mm,'pages':1,'textNodesChecked':len(data['textRects']),'fonts':sorted(set(fonts)),'minPointSize':min(t['pointSize'] for t in data['textRects']),'images':data['images']+data['technicalImages']})
for name in ['content.js','engine.js','scenes.js']:
    assert (ROOT/name).read_bytes()==(ROOT.parent/'prototype-3'/name).read_bytes(),name
assert all(json.loads((QA/(p.stem+'.json')).read_text())['stage']==json.loads((QA/'01.json').read_text())['stage'] for p in PDFS)
def render(path):
    subprocess.run([os.environ.get('PDFTOPPM','pdftoppm'),'-scale-to','1600','-singlefile','-png',str(path),str(QA/path.stem)],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
with ThreadPoolExecutor(max_workers=4) as pool:list(pool.map(render,PDFS))
sheet=Image.new('RGB',(1600,500*((len(PDFS)+1)//2)),'white');draw=ImageDraw.Draw(sheet)
for i,p in enumerate(PDFS):
    im=Image.open(QA/(p.stem+'.png'));im.thumbnail((790,470));x=i%2*800;y=i//2*500
    sheet.paste(im,(x,y+22));draw.text((x+10,y+4),p.stem,fill='black')
sheet.save(QA/'contact.png')
(QA/'validation.json').write_text(json.dumps(results,indent=2))
print('PASS:',len(results),'PDFs; exact sizes, one page, text, margins, fonts, source photos and equal transforms verified.')
for r in results: print(r['file'],'min text %.2f pt'%r['minPointSize'],[(i['src'],round(i['dpi'])) for i in r['images']])
