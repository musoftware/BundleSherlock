/**
 * 🕵️ BundleSherlock Extracted Module
 * ID: callback
 * Type: Original Application Code
 */

"unknown"!==(null===e||void 0===e?void 0:e.status)&&async function(e,t,n,o){const a=await i({path:"/api/user/login_with_facebook",post:!0,admin:!1,obj:{token:e,userId:t,email:n,name:o}});a.data.success&&(localStorage.setItem("wacrm_user",a.data.token),r.push("/user"))}(e.accessToken,e.userID,e.email,e.name)