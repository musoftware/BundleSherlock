/**
 * 🕵️ BundleSherlock Extracted Module
 * ID: 83233
 * Type: Original Application Code
 */

"use strict";var o=n(25901),a=n(57082);function r(e){e.register(o),e.register(a),function(e){var t=e.util.clone(e.languages.typescript);e.languages.tsx=e.languages.extend("jsx",t),delete e.languages.tsx.parameter,delete e.languages.tsx["literal-property"];var n=e.languages.tsx.tag;n.pattern=RegExp(/(^|[^\w$]|(?=<\/))/.source+"(?:"+n.pattern.source+")",n.pattern.flags),n.lookbehind=!0}(e)}e.exports=r,r.displayName="tsx",r.aliases=[]