/**
 * 🕵️ BundleSherlock Extracted Module
 * ID: logApiError
 * Type: Original Application Code
 */

var t="Error";return e&&(t+=": ".concat(e)),this.log.errors+=1,this.log.history.push({type:"error",message:t,time:this.getTimeSpent()}),this.saveLog()