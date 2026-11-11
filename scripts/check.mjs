import {readFileSync,existsSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const files=['index.html','manifest.webmanifest','sw.js','assets/app.mjs','assets/core.mjs','assets/store.mjs','assets/config.js','assets/icons.mjs','assets/base.css','assets/stock.css','assets/legal.css','assets/icon.svg','assets/icon-192.png','assets/icon-512.png','privacy.html','help.html','delete-data.html','about.html','terms.html','contact.html','README.md','ANDROID-NOTES.md'];
for(const f of files){if(!existsSync(resolve(root,f)))throw new Error(`Missing ${f}`);}
const app=readFileSync(resolve(root,'assets/app.mjs'),'utf8');
for(const word of ['saveProduct','saveMovement','productsCSV','movementsCSV','restore','productQty'])if(!app.includes(word))throw new Error(`Missing feature: ${word}`);
const manifest=JSON.parse(readFileSync(resolve(root,'manifest.webmanifest'),'utf8'));
if(!manifest.name.includes('StockBanao'))throw new Error('Wrong app name');
const homepage=readFileSync(resolve(root,'index.html'),'utf8');
for(const link of ['./assets/app.mjs','./assets/base.css','./assets/stock.css'])if(!homepage.includes(link))throw new Error(`Broken homepage link: ${link}`);
console.log(`OK – ${files.length} required files exist; website references and manifest checked.`);
