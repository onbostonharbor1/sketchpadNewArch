const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const p = await b.newPage();
  await p.goto('file:///tmp/guide/guide.html');
  await p.pdf({ path: process.argv[2], format: 'Letter', printBackground: true, displayHeaderFooter: true,
    headerTemplate: '<div style="font-family:&quot;Courier 10 Pitch&quot;,monospace;font-size:7.5pt;width:100%;margin:0 0.85in;display:flex;justify-content:space-between;border-bottom:0.5px solid #000;padding-bottom:2px"><span>SKETCHPAD, THEN AND NEXT</span><span>A guide to Version 2</span></div>',
    footerTemplate: '<div style="font-family:&quot;Courier 10 Pitch&quot;,monospace;font-size:7.5pt;width:100%;margin:0 0.85in;display:flex;justify-content:space-between"><span>1 November 2026</span><span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span></div>',
    margin: { top: '0.9in', bottom: '0.85in', left: '0.85in', right: '0.85in' } });
  await b.close();
})();
