(()=>{var e={603:e=>{const t=e=>{document.getElementById("errorMessage").textContent=e,document.getElementById("domoMessage").classList.remove("hidden")};e.exports={handleError:t,sendPost:async(e,a,o)=>{const n=await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)}),m=await n.json();document.getElementById("domoMessage").classList.add("hidden"),m.redirect&&(window.location=m.redirect),m.error&&t(m.error),o&&o(m)},hideError:()=>{document.getElementById("domoMessage").classList.add("hidden")}}}},t={};function a(o){var n=t[o];if(void 0!==n)return n.exports;var m=t[o]={exports:{}};return e[o](m,m.exports,a),m.exports}(()=>{const e=a(603),t=async e=>{e.preventDefault();const t=await fetch("/upload",{method:"POST",body:new FormData(e.target)}),a=await t.text();document.getElementById("messages").innerText=a},o=t=>{t.preventDefault(),e.hideError();const a=t.target.querySelector("#imgID").value,o=t.target.querySelector("#_csrf").value;return e.sendPost(t.target.action,{imgID:a,_csrf:o},r),!1},n=e=>React.createElement("form",{ref:"uploadForm",id:"uploadForm",action:"/upload",onSubmit:t,method:"post",encType:"multipart/form-data"},React.createElement("input",{type:"file",name:"sampleFile"}),React.createElement("input",{type:"submit",value:"Upload!"})),m=e=>{if(0===e.moodImages.length)return React.createElement("div",{className:"moodImageList"},React.createElement("h3",{className:"emptyList"},"No Mood Images Yet!"));const t=e.moodImages.map((t=>React.createElement("div",{key:t._id,className:"moodImage",id:t._id},React.createElement("h3",null,t.name),React.createElement("form",{id:"deleteMoodImage",name:"deleteMoodImage",onSubmit:o,action:"/deleteMoodImage",method:"POST",className:"deleteMoodImage"},React.createElement("input",{id:"_csrf",type:"hidden",name:"_csrf",value:e.csrf}),React.createElement("input",{id:"imgID",type:"hidden",name:"imgID",value:t._id}),React.createElement("input",{className:"deleteMoodImageSubmit",type:"submit",value:"X"})))));return React.createElement("div",{className:"moodImagesList"},t)},r=async()=>{const e=await fetch("/getImages"),t=await e.json(),a=await fetch("/getToken"),o=await a.json();ReactDOM.render(React.createElement(m,{csrf:o.csrfToken,moodImages:t.moodImages}),document.getElementById("moodImages"))};window.onload=async()=>{const e=await fetch("/getToken"),t=await e.json();ReactDOM.render(React.createElement(n,{csrf:t.csrfToken}),document.getElementById("uploadForm")),ReactDOM.render(React.createElement(m,{csrf:t.csrfToken,moodImages:[]}),document.getElementById("moodImages")),r()}})()})();