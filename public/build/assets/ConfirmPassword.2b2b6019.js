import{u as m,d,o as c,e as u,b as e,g as o,w as r,F as p,H as f,a,n as _,m as w,i as b}from"./app.3f5b02a9.js";import{J as g}from"./AuthenticationCard.64005e82.js";import{_ as h}from"./AuthenticationCardLogo.26706621.js";import{_ as x}from"./Button.7189e5a0.js";import{_ as v,a as y}from"./InputError.5a685aeb.js";import{_ as V}from"./Label.0455468e.js";import"./_plugin-vue_export-helper.cdc0426e.js";const C=a("div",{class:"mb-4 text-sm text-gray-600"}," This is a secure area of the application. Please confirm your password before continuing. ",-1),$=["onSubmit"],k={class:"flex justify-end mt-4"},F=b(" Confirm "),j={__name:"ConfirmPassword",setup(B){const s=m({password:""}),t=d(null),n=()=>{s.post(route("password.confirm"),{onFinish:()=>{s.reset(),t.value.focus()}})};return(N,i)=>(c(),u(p,null,[e(o(f),{title:"Secure Area"}),e(g,null,{logo:r(()=>[e(h)]),default:r(()=>[C,a("form",{onSubmit:w(n,["prevent"])},[a("div",null,[e(V,{for:"password",value:"Password"}),e(v,{id:"password",ref_key:"passwordInput",ref:t,modelValue:o(s).password,"onUpdate:modelValue":i[0]||(i[0]=l=>o(s).password=l),type:"password",class:"mt-1 block w-full",required:"",autocomplete:"current-password",autofocus:""},null,8,["modelValue"]),e(y,{class:"mt-2",message:o(s).errors.password},null,8,["message"])]),a("div",k,[e(x,{class:_(["ml-4",{"opacity-25":o(s).processing}]),disabled:o(s).processing},{default:r(()=>[F]),_:1},8,["class","disabled"])])],40,$)]),_:1})],64))}};export{j as default};
