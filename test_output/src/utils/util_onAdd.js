/**
 * 🕵️ BundleSherlock Extracted Module
 * ID: onAdd
 * Type: Original Application Code
 */

const t=function(e){const t={_id:Date.now()+Math.random(),type:e.type,label:e.label,name:e.label.toLowerCase().replace(/\s+/g,"_")+"_"+Math.floor(100*Math.random()),required:!0,placeholder:"",inputType:e.inputType};return["Dropdown","RadioButtonsGroup","CheckboxGroup"].includes(e.type)&&(t.options=["Option 1","Option 2"]),t}(e);b((e=>[...e,t])),h(t._id)