#!/usr/bin/env node
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const { PDFDocument } = require('pdf-lib');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'pdf');
const qa = path.join(root, 'export', 'qa');
const target = [210 * 72 / 25.4, 125 * 72 / 25.4];

async function main() {
  fs.mkdirSync(out, {recursive:true});
  fs.mkdirSync(qa, {recursive:true});
  const browser = await chromium.launch(process.env.CHROME_PATH ? {executablePath:process.env.CHROME_PATH} : {});
  try {
    const page = await browser.newPage({viewport:{width:794,height:473}});
    const errors = [];
    page.on('pageerror', e => errors.push(String(e)));
    page.on('requestfailed', r => errors.push(r.url() + ': ' + r.failure()?.errorText));
    await page.route('https://**/*', route => route.abort());
    const url = pathToFileURL(path.join(root, 'index.html')).href;
    await page.goto(url + '?page=1');
    const count = await page.evaluate(() => PRINT_PAGES.length);
    const report = [];
    for (let i=1; i<=count; i++) {
      const n = String(i).padStart(2,'0');
      await page.goto(url + '?page=' + i);
      await page.waitForFunction(() => document.documentElement.dataset.printReady === 'true', null, {timeout:30000});
      await page.evaluate(async () => {
        await document.fonts.ready;
        const sources = [...document.querySelectorAll('img, svg image')].map(el => el.src || el.getAttribute('href'));
        await Promise.all(sources.map(src => new Promise((resolve,reject) => {
          const img = new Image(); img.onload=resolve; img.onerror=()=>reject(new Error('Missing image: '+src)); img.src=src;
        })));
        await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      });
      const data = await page.evaluate(async () => {
        const stage = document.querySelector('#stage').getBoundingClientRect();
        const imgs = [...document.querySelectorAll('img')].map(img => {
          const r=img.getBoundingClientRect(), s=getComputedStyle(img);
          // Cover/contain uses uniform scaling; include CSS transforms in box dimensions.
          const scale = s.objectFit==='contain' ? Math.min(r.width/img.naturalWidth,r.height/img.naturalHeight) : Math.max(r.width/img.naturalWidth,r.height/img.naturalHeight);
          return {src:img.getAttribute('src'),width:img.naturalWidth,height:img.naturalHeight,box:[r.width,r.height],fit:s.objectFit,dpi:96/scale,filter:s.filter};
        });
        const technicalImages = await Promise.all([...document.querySelectorAll('svg image')].map(async el => {
          const src=el.getAttribute('href'), img=new Image();img.src=src;await img.decode();
          const r=el.getBoundingClientRect();
          return {src,width:img.naturalWidth,height:img.naturalHeight,dpi:Math.min(img.naturalWidth/r.width,img.naturalHeight/r.height)*96};
        }));
        const text=[]; const walker=document.createTreeWalker(document.querySelector('#sceneRoot'),NodeFilter.SHOW_TEXT);
        let node; while(node=walker.nextNode()) {
          if (!node.textContent.trim()) continue;
          const el=node.parentElement, s=getComputedStyle(el);
          if(s.display==='none'||s.visibility==='hidden'||!el.getClientRects().length)continue;
          const range=document.createRange();range.selectNodeContents(node);
          text.push({text:node.textContent,pointSize:parseFloat(s.fontSize)*0.472441*72/96,rects:[...range.getClientRects()].map(r=>[r.x,r.y,r.width,r.height])});
        }
        return {text:document.querySelector('#sceneRoot').innerText,textRects:text,images:imgs,technicalImages,stage:[stage.x,stage.y,stage.width,stage.height],background:getComputedStyle(document.body).backgroundColor,sceneCount:SCENES.length,title:PRINT_PAGES[Number(document.documentElement.dataset.printPage)-1].title};
      });
      if(errors.length) throw new Error(errors.join('\n'));
      const raw=await page.pdf({width:'210mm',height:'125mm',scale:1,printBackground:true,margin:{top:0,right:0,bottom:0,left:0},displayHeaderFooter:false,preferCSSPageSize:true});
      const pdf=await PDFDocument.load(raw);
      if(pdf.getPageCount()!==1)throw new Error('Scene '+i+' is not one page');
      const p=pdf.getPage(0);
      // Chromium rounds its paper box. Normalize only the empty outer edge;
      // preserve vector content, typography and the exact CSS scene scale.
      p.setMediaBox(0,0,...target);p.setCropBox(0,0,...target);p.setTrimBox(0,0,...target);
      fs.writeFileSync(path.join(out,n+'.pdf'),await pdf.save());
      fs.writeFileSync(path.join(qa,n+'.json'),JSON.stringify(data,null,2));
      report.push({file:n+'.pdf',title:data.title,pages:1,mm:[210,125],images:data.images});
      console.log(n+'.pdf: '+data.title+'; '+data.images.length+' photos/images');
    }
    const extras=fs.readdirSync(out).filter(f=>/^\d+\.pdf$/.test(f)&&Number(f.slice(0,-4))>count);
    if(extras.length)throw new Error('Stale PDF files outside scene range: '+extras.join(', '));
    fs.writeFileSync(path.join(qa,'manifest.json'),JSON.stringify(report,null,2));
    console.log('Exported '+count+' single-page PDFs at exact 210 x 125 mm.');
  } finally { await browser.close(); }
}
main().catch(e=>{console.error(e);process.exitCode=1;});
