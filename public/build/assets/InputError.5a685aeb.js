import{d as i,p as l,o,e as u,v as c,x as d,a as m,t as p}from"./app.3f5b02a9.js";const f=["value"],v={__name:"Input",props:{modelValue:String},emits:["update:modelValue"],setup(s,{expose:t}){const e=i(null);return l(()=>{e.value.hasAttribute("autofocus")&&e.value.focus()}),t({focus:()=>e.value.focus()}),(n,a)=>(o(),u("input",{ref_key:"input",ref:e,class:"border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm",value:s.modelValue,onInput:a[0]||(a[0]=r=>n.$emit("update:modelValue",r.target.value))},null,40,f))}},g={class:"text-sm text-red-600"},h={__name:"InputError",props:{message:String},setup(s){return(t,e)=>c((o(),u("div",null,[m("p",g,p(s.message),1)],512)),[[d,s.message]])}};export{v as _,h as a};
