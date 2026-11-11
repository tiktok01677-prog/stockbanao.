// StockBanao: business calculations and strict import validation. Monetary values use integer minor units.
export const STORAGE_KEY='stockbanao:v1';
export const MAX_PRODUCTS=3000;
export const MAX_MOVEMENTS=12000;
export const MAX_BACKUP_BYTES=5*1024*1024;
export const CURRENCIES=['PKR','INR','BDT','AED','USD'];
export const uid=()=>globalThis.crypto?.randomUUID?.()||`s${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
export const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
export const esc=(v='')=>String(v).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
export const validId=v=>typeof v==='string'&&/^[a-zA-Z0-9_-]{1,80}$/.test(v);
export const validDate=v=>{if(typeof v!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(v))return false;const d=new Date(v+'T12:00:00Z');return !Number.isNaN(d.valueOf())&&d.toISOString().slice(0,10)===v&&v>='2000-01-01'&&v<='2100-12-31';};
const str=(v,max)=>typeof v==='string'&&v.length<=max;
export const parsePrice=v=>{const s=String(v??'').trim();if(!/^(?:0|[1-9]\d{0,8})(?:\.\d{1,2})?$/.test(s))throw new Error('Enter a valid price (maximum 2 decimals).');const [major,minor='']=s.split('.');const n=Number(major)*100+Number((minor+'00').slice(0,2));if(!Number.isSafeInteger(n)||n>99999999999)throw new Error('Price is too high.');return n;};
export const displayPrice=n=>(n/100).toFixed(2);
export const parseQty=(v,allowZero=false)=>{const s=String(v??'').trim();if(!/^(0|[1-9]\d{0,6})$/.test(s))throw new Error('Quantity must be a whole number up to 9,999,999.');const n=Number(s);if(!allowZero&&n===0)throw new Error('Quantity must be greater than zero.');return n;};
export function money(n,currency='PKR'){const sym={PKR:'Rs',INR:'₹',BDT:'৳',AED:'AED',USD:'$'}[currency]||currency;return `${sym} ${new Intl.NumberFormat('en-PK',{minimumFractionDigits:2,maximumFractionDigits:2}).format(n/100)}`;}
export const number=n=>new Intl.NumberFormat('en-PK').format(n);
export const freshState=()=>({version:1,revision:0,settings:{business:'My Shop',currency:'PKR',theme:'light'},products:[],movements:[]});
export const productQty=(state,id)=>{const p=state.products.find(p=>p.id===id);if(!p)return 0;return p.openingQty+state.movements.reduce((sum,m)=>m.productId===id?sum+(m.type==='in'?m.qty:-m.qty):sum,0);};
export const lowStock=(state,p)=>productQty(state,p.id)<=p.minQty;
export const sortedMovements=rows=>rows.slice().sort((a,b)=>b.date.localeCompare(a.date)||b.id.localeCompare(a.id));
export function metrics(state){let units=0,cost=0,retail=0,low=0,out=0;for(const p of state.products){const q=productQty(state,p.id);units+=q;cost+=q*p.purchasePrice;retail+=q*p.salePrice;if(q<=p.minQty)low++;if(q===0)out++;}return {products:state.products.length,units,cost,retail,low,out,movements:state.movements.length};}
export function validateState(x){
 if(!x||typeof x!=='object'||Array.isArray(x)||x.version!==1||!Number.isSafeInteger(x.revision)||x.revision<0)throw new Error('Unsupported or damaged backup.');
 if(!x.settings||!str(x.settings.business,100)||!x.settings.business.trim()||!CURRENCIES.includes(x.settings.currency)||!['light','dark'].includes(x.settings.theme))throw new Error('Invalid settings.');
 if(!Array.isArray(x.products)||x.products.length>MAX_PRODUCTS||!Array.isArray(x.movements)||x.movements.length>MAX_MOVEMENTS)throw new Error('Too many records.');
 const ids=new Set(),skus=new Set();
 for(const p of x.products){
  if(!p||!validId(p.id)||ids.has(p.id)||!str(p.name,100)||!p.name.trim()||!str(p.sku,50)||!str(p.category,60)||!str(p.note,500)||!Number.isInteger(p.openingQty)||p.openingQty<0||p.openingQty>9999999||!Number.isInteger(p.minQty)||p.minQty<0||p.minQty>9999999||!Number.isSafeInteger(p.purchasePrice)||p.purchasePrice<0||p.purchasePrice>99999999999||!Number.isSafeInteger(p.salePrice)||p.salePrice<0||p.salePrice>99999999999)throw new Error('Invalid product record.');
  const sku=p.sku.trim().toLowerCase();if(sku&&skus.has(sku))throw new Error('Duplicate SKU.');if(sku)skus.add(sku);ids.add(p.id);
 }
 const mids=new Set();for(const m of x.movements){if(!m||!validId(m.id)||mids.has(m.id)||!ids.has(m.productId)||!['in','out'].includes(m.type)||!Number.isInteger(m.qty)||m.qty<=0||m.qty>9999999||!validDate(m.date)||!str(m.note,500))throw new Error('Invalid stock movement.');mids.add(m.id);}
 const quantities=new Map(x.products.map(p=>[p.id,p.openingQty]));for(const m of x.movements)quantities.set(m.productId,quantities.get(m.productId)+(m.type==='in'?m.qty:-m.qty));for(const q of quantities.values())if(q<0||q>9999999)throw new Error('Stock cannot be negative or exceed the maximum.');
 return {version:1,revision:x.revision,settings:{business:x.settings.business.trim(),currency:x.settings.currency,theme:x.settings.theme},products:x.products.map(p=>({id:p.id,name:p.name.trim(),sku:p.sku.trim(),category:p.category.trim(),note:p.note,openingQty:p.openingQty,minQty:p.minQty,purchasePrice:p.purchasePrice,salePrice:p.salePrice})),movements:x.movements.map(m=>({id:m.id,productId:m.productId,type:m.type,qty:m.qty,date:m.date,note:m.note}))};
}
function csvCell(v){let s=String(v??'');if(/^\s*[=+@-]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}
export function csv(rows){return '\uFEFF'+rows.map(r=>r.map(csvCell).join(',')).join('\r\n');}
export function productsCSV(s){return csv([['Product','SKU','Category','Quantity','Minimum Stock','Purchase Price','Selling Price','Inventory Cost Value','Currency','Notes'],...s.products.map(p=>{const q=productQty(s,p.id);return [p.name,p.sku,p.category,q,p.minQty,displayPrice(p.purchasePrice),displayPrice(p.salePrice),displayPrice(q*p.purchasePrice),s.settings.currency,p.note];})]);}
export function movementsCSV(s){const names=new Map(s.products.map(p=>[p.id,p.name]));return csv([['Date','Product','Movement','Quantity','Note'],...sortedMovements(s.movements).map(m=>[m.date,names.get(m.productId)||'',m.type==='in'?'Stock In':'Stock Out',m.qty,m.note])]);}
