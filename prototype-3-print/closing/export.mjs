#!/usr/bin/env node
// Exports ONLY the two closing documents; never reads or rewrites earlier PDFs.
import {createRequire} from 'node:module';
import {fileURLToPath, pathToFileURL} from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
const require=createRequire(new URL('../export/package.json',import.meta.url));
const {chromium}=require('playwright');
const {PDFDocument}=require('pdf-lib');
const here=path.dirname(fileURLToPath(import.meta.url));
const qa=path.resolve(here,'../export/qa/closing');
const entries=[['12','final-assessment.html'],['13','case-closed.html']];
const size=[210*72/25.4,125*72/25.4];
async function main(){
  fs.mkdirSync(qa,{recursive:true});
  const browser=await chromium.launch(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{});
  try{
    const page=await browser.newPage({viewport:{width:794,height:473}});
    const errors=[];page.on('pageerror',e=>errors.push(String(e)));
    page.on('requestfailed',r=>errors.push(r.url()));
    await page.route('https://**/*',r=>r.abort());
    for(const [number,file] of entries){
      await page.goto(pathToFileURL(path.join(here,file)).href);
      await page.evaluate(async()=>{await document.fonts.ready;await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));});
      const audit=await page.evaluate(()=>{
        const root=document.querySelector('#sceneRoot');
        const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let node;const text=[];
        while(node=walker.nextNode()){
          if(!node.textContent.trim())continue;
          const s=getComputedStyle(node.parentElement);if(!node.parentElement.getClientRects().length)continue;
          const range=document.createRange();range.selectNodeContents(node);
          text.push({text:node.textContent.trim(),font:s.fontFamily,color:s.color,rects:[...range.getClientRects()].map(r=>[r.x,r.y,r.width,r.height])});
        }
        const effects=[...document.querySelectorAll('*')].flatMap(el=>['','::before','::after'].map(p=>({tag:el.tagName+p,css:getComputedStyle(el,p||null)}))).filter(({css:s})=>s.display!=='none' && (s.filter!=='none'||s.boxShadow!=='none'||s.textShadow!=='none'||s.animationName!=='none')).map(({tag})=>tag);
        return {title:document.title,text,effects,controls:document.querySelectorAll('button,input,audio,video,img,canvas,a').length,transform:getComputedStyle(document.querySelector('#stage')).transform,background:getComputedStyle(document.body).backgroundColor};
      });
      if(errors.length||audit.effects.length||audit.controls)throw new Error(JSON.stringify({errors,audit}));
      const doc=await PDFDocument.load(await page.pdf({width:'210mm',height:'125mm',scale:1,preferCSSPageSize:true,printBackground:true,displayHeaderFooter:false,margin:{top:0,right:0,bottom:0,left:0}}));
      if(doc.getPageCount()!==1)throw new Error('Expected one page: '+number);
      const p=doc.getPage(0);p.setMediaBox(0,0,...size);p.setCropBox(0,0,...size);p.setTrimBox(0,0,...size);
      fs.writeFileSync(path.resolve(here,'../pdf',number+'.pdf'),await doc.save());
      fs.writeFileSync(path.join(qa,number+'.json'),JSON.stringify(audit,null,2));
      console.log(number+'.pdf: '+audit.title+'; 210 x 125 mm, one page');
    }
  }finally{await browser.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
