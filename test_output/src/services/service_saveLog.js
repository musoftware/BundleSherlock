/**
 * 🕵️ BundleSherlock Extracted Module
 * ID: saveLog
 * Type: Original Application Code
 */

try{if(this.response)return function(e,t,n){var o="".concat(qze.paystackApiUrl,"transaction/update_log/").concat(e),a={Authorization:"Bearer ".concat(t)};return fetch(o,{method:"POST",body:JSON.stringify({payload:JSON.stringify(n)}),headers:a})}(this.id,this.response.merchant_key,this.log)}catch(vze){}