/**
 * 🕵️ BundleSherlock Extracted Module
 * ID: requestInline
 * Type: Original Application Code
 */

var e=this,t=this.urlParameters,n=t.language,o=t.connect_account,a=Sze(t,nxe),r=zze({"Content-Type":"application/json"},n&&{"Accept-Language":n});return(this.accessCode?fetch(new URL("transaction/verify_access_code/".concat(this.accessCode),qze.paystackApiUrl).toString(),{headers:r}):fetch(new URL("/checkout/request_inline",qze.paystackApiUrl).toString(),{method:"POST",body:JSON.stringify(a),headers:zze(zze({},r),o&&{"x-connect-account":o})})).then((function(e){return e.json()})).then((function(t){if(!1===t.status)throw new Error(t.message);return e.response=t.data,e.id=t.data.id,e.status=t.data.transaction_status,e.accessCode=t.data.access_code,e.log=null,Object.assign(e,txe),e.initializeLog(t.data.log),e.saveIpAddress(),t.data}))