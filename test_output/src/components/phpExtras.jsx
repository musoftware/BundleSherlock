/**
 * 🕵️ BundleSherlock Extracted Module
 * ID: 29094
 * Type: Original Application Code
 */

"use strict";var o=n(72488);function a(e){e.register(o),e.languages.insertBefore("php","variable",{this:{pattern:/\$this\b/,alias:"keyword"},global:/\$(?:GLOBALS|HTTP_RAW_POST_DATA|_(?:COOKIE|ENV|FILES|GET|POST|REQUEST|SERVER|SESSION)|argc|argv|http_response_header|php_errormsg)\b/,scope:{pattern:/\b[\w\\]+::/,inside:{keyword:/\b(?:parent|self|static)\b/,punctuation:/::|\\/}}})}e.exports=a,a.displayName="phpExtras",a.aliases=[]