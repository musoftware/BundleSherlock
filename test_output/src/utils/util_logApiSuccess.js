/**
 * 🕵️ BundleSherlock Extracted Module
 * ID: logApiSuccess
 * Type: Original Application Code
 */

var t="Successfully paid";return e&&(t+=" with ".concat(e)),this.log.success=!0,this.log.history.push({type:"success",message:t,time:this.getTimeSpent()}),this.saveLog()