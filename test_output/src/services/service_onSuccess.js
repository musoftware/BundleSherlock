/**
 * 🕵️ BundleSherlock Extracted Module
 * ID: onSuccess
 * Type: Original Application Code
 */

e.access_token?async function(e){const t=await i({path:"/api/user/login_with_google",post:!0,admin:!1,obj:{token:e}});t.data.success&&(localStorage.setItem("wacrm_user",t.data.token),r.push("/user"))}(e.access_token):console.error("Google login: no access_token received",e)