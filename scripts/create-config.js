(()=>{"use strict";var e={147:e=>{e.exports=require("fs")},37:e=>{e.exports=require("os")},17:e=>{e.exports=require("path")}},r={};function i(s){var o=r[s];if(void 0!==o)return o.exports;var t=r[s]={exports:{}};return e[s](t,t.exports,i),t.exports}(()=>{const e=i(147),r=i(17),s=i(37),o=".pmarket-cli",t=(0,s.homedir)()+r.sep+o+r.sep+"config.json";(0,e.existsSync)((0,s.homedir)()+r.sep+o)||(0,e.mkdirSync)((0,s.homedir)()+r.sep+o),(0,e.writeFileSync)(t,JSON.stringify({apiKey:"",apiSecret:"",passphrase:"",rpcProvider:"",privateKey:""},null,4)),console.log("Configuration file created:",t)})()})();