const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const p = await b.newPage();
  await p.goto('file:///tmp/spec/spec.html');
  await p.pdf({ path: process.argv[2], format: 'Letter', printBackground: true, displayHeaderFooter: true,
    headerTemplate: '<div style="font-family:&quot;Courier 10 Pitch&quot;,monospace;font-size:7.5pt;width:100%;margin:0 0.85in;display:flex;justify-content:space-between;border-bottom:0.5px solid #000;padding-bottom:2px"><span>SKETCHPAD VERSION 2 &mdash; FUNCTIONAL SPECIFICATION</span><span>SPV2-FS-001 Rev A</span></div>',
    footerTemplate: '<div style="font-family:&quot;Courier 10 Pitch&quot;,monospace;font-size:7.5pt;width:100%;margin:0 0.85in;display:flex;justify-content:space-between"><span>DRAFT FOR OWNER REVIEW</span><span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span></div>',
    margin: { top: '0.9in', bottom: '0.85in', left: '0.85in', right: '0.85in' } });
  await b.close();
})();
