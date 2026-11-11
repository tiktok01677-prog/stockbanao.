import {freshState,validateState,STORAGE_KEY} from './core.mjs';
export class Store{
 constructor(storage=localStorage){this.storage=storage;}
 read(){const raw=this.storage.getItem(STORAGE_KEY);if(!raw)return freshState();try{return validateState(JSON.parse(raw));}catch{throw new Error('Local stock data cannot be read. Do not clear your browser data until you have a backup.');}}
 write(s){const good=validateState(s);this.storage.setItem(STORAGE_KEY,JSON.stringify(good));return good;}
 update(change){const current=this.read(),draft=JSON.parse(JSON.stringify(current));change(draft);draft.revision=current.revision+1;return this.write(draft);}
 restore(s){return this.write(validateState(s));}
}
