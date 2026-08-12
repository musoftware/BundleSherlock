/**
 * 🕵️ BundleSherlock Extracted Module
 * ID: logAttempt
 * Type: Original Application Code
 */

var t="Attempted to pay";return e&&(t+=" with ".concat(e)),this.log.attempts+=1,this.log.history.push({type:"action",message:t,time:this.getTimeSpent()}),this.saveLog()