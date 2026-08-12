/**
 * 🕵️ BundleSherlock Extracted Module
 * ID: onError
 * Type: Original Application Code
 */

var e=new Error('The script "'.concat(n,'" failed to load.'));return window.fetch?fetch(n).then((function(n){return 200===n.status&&t(e),n.text()})).then((function(e){var n=function(e){var t=e.split("/* Original Error:")[1];return t?t.replace(/\n/g,"").replace("*/","").trim():e}(e);t(new Error(n))})).catch((function(e){t(e)})):t(e)