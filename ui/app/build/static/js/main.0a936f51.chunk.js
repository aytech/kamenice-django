(this.webpackJsonpui=this.webpackJsonpui||[]).push([[0],{292:function(e,t,n){},294:function(e,t,n){},312:function(e,t,n){},465:function(e,t,n){},466:function(e,t,n){},497:function(e,t,n){},498:function(e,t,n){},499:function(e,t,n){},504:function(e,t,n){"use strict";n.r(t);var a,r,i,s,c,o,l,u,d,j,b,m,O,h,v,p,f,x=n(32),g=n(40),y=n.n(g),I=(n(292),function(e){if(document.cookie&&""!==document.cookie)for(var t=document.cookie.split(";"),n=0;n<t.length;n++){var a=t[n].trim();if(a.substring(0,e.length+1)===e+"=")return decodeURIComponent(a.substring(e.length+1))}return null}),k=n(35),C=n.n(k),N=(n(293),n(527)),z=n(46),D=n(202),F=n(505),R=n(503),S=n(21),A=n(16),E=n(519),q=n(531),T=n(272),w=n.n(T),G=n(0),P=n(62),M=n(39),H=(n(294),n.p+"static/media/mill.1f872c17.svg"),$=n(540),_=n(539),B=n(538),V=n(537),J=n(211),U=n(4),L=function(e){var t=e.logout;return Object(U.jsxs)(J.a,{mode:"horizontal",children:[Object(U.jsx)(J.a.Item,{icon:Object(U.jsx)($.a,{}),children:Object(U.jsx)(P.b,{to:"/",children:"Rezervace"})},"reservation"),Object(U.jsx)(J.a.Item,{icon:Object(U.jsx)(_.a,{}),children:Object(U.jsx)(P.b,{to:"/guests",children:"Host\xe9"})},"guests"),Object(U.jsx)(J.a.Item,{icon:Object(U.jsx)(B.a,{}),children:Object(U.jsx)(P.b,{to:"/apartma",children:"Apartm\xe1"})},"suites"),Object(U.jsx)(J.a.Item,{icon:Object(U.jsx)(V.a,{}),onClick:t,children:"Odhl\xe1sit"},"logout")]})},Z=n(276),K=n(265),W=n(525),Y=n(544),Q=n(36),X=n(114),ee=Object(X.a)(a||(a=Object(Q.a)(["\n  mutation RetrieveToken($username: String!, $password: String!) {\n    tokenAuth(username: $username, password: $password) {\n      token\n    }\n  } \n"]))),te=Object(X.a)(r||(r=Object(Q.a)(["\n  mutation DeleteToken {\n    deleteToken {\n      deleted\n    }\n  } \n"]))),ne=Object(M.f)((function(e){var t=e.history,n=e.location,a=e.isAuthenticated,r=e.setIsAuthenticated,i=Object(Y.a)(te,{onCompleted:function(){r(!1),t.push("/login?next=".concat(n.pathname))},onError:function(e){console.error(e),Z.b.error("Chyba serveru, kontaktujte spr\xe1vce")}}),s=Object(S.a)(i,2),c=s[0],o=s[1].loading;return Object(U.jsx)(K.a,{spinning:o,tip:"Odhla\u0161uji...",children:Object(U.jsx)(W.a,{className:"app-header",children:Object(U.jsxs)("div",{className:"app-header__container",children:[Object(U.jsx)("div",{className:"app-header__logo",children:Object(U.jsx)(P.b,{to:"/",children:Object(U.jsx)("img",{src:H,alt:"Kamenice logo"})})}),!0===a&&Object(U.jsx)("div",{className:"app-header__menu-section",children:Object(U.jsx)(L,{logout:c})})]})})})})),ae=n(523),re=n(51),ie=n(60),se=n.n(ie),ce=n(543),oe=n(518),le=(Object(X.a)(i||(i=Object(Q.a)(["\n  query Guests {\n    guests {\n      id\n      name\n      surname\n    }\n  }\n"]))),Object(X.a)(s||(s=Object(Q.a)(["\n  query GuestsFull {\n    guests {\n      age\n      addressMunicipality\n      addressPsc\n      addressStreet\n      citizenship\n      email\n      gender\n      identity\n      id\n      name\n      phoneNumber\n      surname\n      visaNumber\n    }\n  }\n"])))),ue=n(522),de=n(530),je=n(517),be=n(526),me=n(141),Oe=n(541),he=n(77),ve={requiredRule:{required:!0,message:"pole je povinn\xe9"},trim:function(e){return void 0===e?e:e.trim()}},pe={ageOptions:[{label:"12+",value:"YOUNG"},{label:"3-12 let",value:"CHILD"},{label:"Do 3 let",value:"INFANT"},{label:"Dosp\u011bl\xfd",value:"ADULT"}],getGuestResponseErrorList:function(e){try{return Array.from(Object.values(JSON.parse(e.replaceAll("'",'"'))),(function(e){return e[0]}))}catch(t){return["Chyba serveru, kontaktujte spr\xe1vce"]}},phoneCodeRequiredRules:[ve.requiredRule,{message:"zadejte k\xf3d ve form\xe1tu 420, +420 nebo (420)",pattern:/^\+?\(?[0-9]*\)?$/,transform:ve.trim}],requiredAlphaRules:[ve.requiredRule,{message:"zadejte pouze text",pattern:/^([A-Za-z\s\xe1\xc1\u010d\u010c\u010f\u010e\xe9\xc9\u011b\u011a\xed\xcd\u0148\u0147\u0159\u0158\u0161\u0160\u0165\u0164\xfa\xda\u016f\u016e\xfd\xdd\u017e\u017d\xf3\xd3])+$/,transform:ve.trim}],requiredNumericRules:[ve.requiredRule,{message:"zadejte pouze \u010d\xedsla",pattern:/^[\d\s]+$/,transform:ve.trim}]},fe=(n(312),Object(X.a)(c||(c=Object(Q.a)(["\n  mutation CreateGuest($data: GuestInput!) {\n    createGuest(data: $data) {\n      guest {\n        addressMunicipality\n        addressPsc\n        addressStreet\n        citizenship\n        email\n        gender\n        identity\n        id\n        name\n        phoneNumber\n        surname\n        visaNumber\n      }\n    }\n  }\n"])))),xe=Object(X.a)(o||(o=Object(Q.a)(["\n  mutation CreateGuestBasic($data: GuestInput!) {\n    createGuest(data: $data) {\n      guest {\n        email\n        name\n        surname\n      }\n    }\n  }\n"]))),ge=Object(X.a)(l||(l=Object(Q.a)(["\n  mutation UpdateGuest($data: GuestInput!) {\n    updateGuest(data: $data) {\n      guest {\n        addressMunicipality\n        addressPsc\n        addressStreet\n        citizenship\n        email\n        gender\n        identity\n        id\n        name\n        phoneNumber\n        surname\n        visaNumber\n      }\n    }\n  }\n"]))),ye=Object(X.a)(u||(u=Object(Q.a)(["\n  mutation DeleteGuest($guestId: ID!) {\n    deleteGuest(guestId: $guestId) {\n      guest {\n        id\n      }\n    }\n  }\n"]))),Ie=function(e){var t=e.close,n=e.guest,a=e.refetch,r=e.visible,i=ue.a.useForm(),s=Object(S.a)(i,1)[0],c=Object(Y.a)(fe,{onCompleted:function(e){var n,r,i,c;Z.b.success("Host ".concat(null===(n=e.createGuest)||void 0===n||null===(r=n.guest)||void 0===r?void 0:r.name," ").concat(null===(i=e.createGuest)||void 0===i||null===(c=i.guest)||void 0===c?void 0:c.surname," byl p\u0159id\xe1n")),void 0!==a&&a(),s.resetFields(),t()},onError:function(e){Z.b.error(e.message)}}),o=Object(S.a)(c,1)[0],l=Object(Y.a)(ge,{onCompleted:function(e){var n,a,r,i;Z.b.success("Host ".concat(null===(n=e.updateGuest)||void 0===n||null===(a=n.guest)||void 0===a?void 0:a.name," ").concat(null===(r=e.updateGuest)||void 0===r||null===(i=r.guest)||void 0===i?void 0:i.surname," byl upraven")),s.resetFields(),t()},onError:function(){Z.b.error("Chyba serveru, kontaktujte spr\xe1vce")}}),u=Object(S.a)(l,1)[0],d=Object(G.useState)(!1),j=Object(S.a)(d,2),b=j[0],m=j[1],O={age:null===n||void 0===n?void 0:n.age,address:{municipality:null===n||void 0===n?void 0:n.addressMunicipality,psc:null===n||void 0===n?void 0:n.addressPsc,street:null===n||void 0===n?void 0:n.addressStreet},citizenship:{selected:null===n||void 0===n?void 0:n.citizenship},email:null===n||void 0===n?void 0:n.email,gender:null===n||void 0===n?void 0:n.gender,identity:null===n||void 0===n?void 0:n.identity,name:null===n||void 0===n?void 0:n.name,phone:null===n||void 0===n?void 0:n.phoneNumber,surname:null===n||void 0===n?void 0:n.surname,visa:null===n||void 0===n?void 0:n.visaNumber},h=Object(U.jsx)(ue.a.Item,{name:"email-prefix",noStyle:!0,children:Object(U.jsx)(Oe.a,{})});return Object(G.useEffect)((function(){!0===r&&s.resetFields()}),[s,r]),Object(U.jsx)(de.a,{closeIcon:Object(U.jsx)(je.a,{onCancel:function(){return m(!1)},onConfirm:function(){m(!1),s.resetFields(),t()},placement:"rightTop",title:"Zav\u0159\xedt formul\xe1\u0159? Data ve formul\xe1\u0159i budou ztracena",visible:b,children:Object(U.jsx)(he.a,{onClick:function(){s.isFieldsTouched()?m(!0):t()}})}),placement:"left",title:"Nov\xfd host",width:500,visible:r,footer:Object(U.jsx)(U.Fragment,{children:Object(U.jsx)(re.a,{onClick:function(){s.validateFields().then((function(){var e,t,a,r,i,c=s.getFieldsValue(!0),l={age:c.age,addressMunicipality:null===(e=c.address)||void 0===e?void 0:e.municipality,addressPsc:null===(t=c.address)||void 0===t?void 0:t.psc,addressStreet:null===(a=c.address)||void 0===a?void 0:a.street,citizenship:void 0===(null===(r=c.citizenship)||void 0===r?void 0:r.selected)?null===(i=c.citizenship)||void 0===i?void 0:i.new:c.citizenship.selected,email:c.email,gender:c.gender,identity:c.identity,name:c.name,phoneNumber:c.phone,surname:c.surname,visaNumber:c.visa};null===n?o({variables:{data:Object(x.a)({},l)}}):u({variables:{data:Object(x.a)({id:n.id},l)}})})).catch((function(){return Z.b.error("Formul\xe1\u0159 nelze odeslat, opravte pros\xedm chyby")}))},type:"primary",children:null===n?"Vytvo\u0159it":"Upravit"})}),footerStyle:{padding:"16px 20px",textAlign:"right"},children:Object(U.jsxs)(ue.a,{form:s,initialValues:O,layout:"vertical",name:"guest",children:[Object(U.jsx)(se.a,{level:5,children:"Osobn\xed \xfadaje"}),Object(U.jsx)(ue.a.Item,{hasFeedback:!0,label:"Jm\xe9no",name:"name",required:!0,rules:pe.requiredAlphaRules,children:Object(U.jsx)(be.a,{placeholder:"Va\u0161e Jm\xe9no"})}),Object(U.jsx)(ue.a.Item,{hasFeedback:!0,label:"P\u0159\xedjmen\xed",name:"surname",required:!0,rules:pe.requiredAlphaRules,children:Object(U.jsx)(be.a,{placeholder:"Va\u0161e P\u0159\xedjmen\xed"})}),Object(U.jsx)(ue.a.Item,{hasFeedback:!0,label:"\u010c\xedslo OP",name:"identity",required:!0,rules:[ve.requiredRule],children:Object(U.jsx)(be.a,{placeholder:"\u010d\xedslo ob\u010dansk\xe9ho pr\u016fkazu"})}),Object(U.jsx)(ue.a.Item,{hasFeedback:!0,label:"Telefonn\xed \u010c\xedslo",name:"phone",required:!0,rules:[ve.requiredRule],children:Object(U.jsx)(be.a,{placeholder:"\u010d\xedslo"})}),Object(U.jsx)(ue.a.Item,{hasFeedback:!0,label:"E-Mail",name:"email",required:!0,rules:[ve.requiredRule],children:Object(U.jsx)(be.a,{addonBefore:h,placeholder:"e-mail",type:"email"})}),Object(U.jsx)(ue.a.Item,{hasFeedback:!0,label:"V\u011bk",name:"age",required:!0,rules:[ve.requiredRule],children:Object(U.jsx)(me.a,{options:pe.ageOptions,placeholder:"vyberte ze seznamu"})}),Object(U.jsx)(ue.a.Item,{label:"Pohlav\xed",name:"gender",children:Object(U.jsxs)(me.a,{placeholder:"vyberte ze seznamu",children:[Object(U.jsx)(me.a.Option,{value:"M",children:"Mu\u017e"}),Object(U.jsx)(me.a.Option,{value:"F",children:"\u017dena"})]})}),Object(U.jsx)(ue.a.Item,{hasFeedback:!0,label:"\u010c\xedslo viza",name:"visa",children:Object(U.jsx)(be.a,{placeholder:"\u010d\xedslo visa"})}),Object(U.jsx)(se.a,{level:5,children:"Trval\xe9 bydli\u0161t\u011b"}),Object(U.jsx)(ue.a.Item,{label:"Ulice",name:["address","street"],children:Object(U.jsx)(be.a,{placeholder:"ulice"})}),Object(U.jsx)(ue.a.Item,{label:"PS\u010c/Obec",children:Object(U.jsxs)(be.a.Group,{compact:!0,children:[Object(U.jsx)(ue.a.Item,{style:{marginBottom:0,width:"50%"},name:["address","psc"],children:Object(U.jsx)(be.a,{placeholder:"PS\u010c"})}),Object(U.jsx)(ue.a.Item,{style:{marginBottom:0,width:"50%"},name:["address","municipality"],children:Object(U.jsx)(be.a,{placeholder:"Obec"})})]})}),Object(U.jsx)(ue.a.Item,{label:"Ob\u010danstv\xed",children:Object(U.jsxs)(be.a.Group,{compact:!0,children:[Object(U.jsx)(ue.a.Item,{style:{width:"50%"},name:["citizenship","selected"],children:Object(U.jsxs)(me.a,{style:{width:"100%"},placeholder:"ze seznamu",children:[Object(U.jsx)(me.a.Option,{value:"cze",children:"CZE"}),Object(U.jsx)(me.a.Option,{value:"sk",children:"SK"})]})}),Object(U.jsx)(ue.a.Item,{style:{width:"50%"},name:["citizenship","new"],children:Object(U.jsx)(be.a,{placeholder:"ru\u010dn\u011b"})})]})})]})})},ke=(n(465),n(534)),Ce=n(275),Ne={colors:["#f5222d","#fa541c","#fa8c16","#faad14","#fadb14","#a0d911","#52c41a","#13c2c2","#1890ff","#2f54eb","#722ed1","#eb2f96"],getRandomColor:function(){return Ne.colors[Math.floor(Math.random()*Ne.colors.length)]}},ze=function(e){var t=e.deleteGuest,n=e.guest,a=e.loading,r=e.openGuestDrawer,i=e.selectGuest;return Object(U.jsx)(ae.b.Item,{actions:[Object(U.jsx)(re.a,{onClick:function(){i(n),r()},type:"link",children:"upravit"},"edit"),Object(U.jsx)(je.a,{cancelText:"Ne",icon:Object(U.jsx)(ke.a,{}),okText:"Ano",onConfirm:function(){return t(n.id)},title:"opravdu odstranit?",children:Object(U.jsx)(re.a,{loading:a,type:"link",children:"odstranit"},"remove")})],children:Object(U.jsx)(ae.b.Item.Meta,{avatar:Object(U.jsx)(Ce.a,{gap:4,size:"large",style:{backgroundColor:Ne.getRandomColor()},children:n.name.substring(0,1).toUpperCase()}),description:n.email,title:"".concat(n.name," ").concat(n.surname)})})},De=Object(M.f)((function(e){var t=e.history,n=e.isAuthenticated,a=Object(G.useState)(!1),r=Object(S.a)(a,2),i=r[0],s=r[1],c=Object(G.useState)([]),o=Object(S.a)(c,2),l=o[0],u=o[1],d=Object(G.useState)(null),j=Object(S.a)(d,2),b=j[0],m=j[1],O=Object(oe.a)(le,{onError:function(){Z.b.error("Chyba serveru, kontaktujte spr\xe1vce")}}),h=Object(S.a)(O,2),v=h[0],p=h[1],f=p.loading,x=p.data,g=p.refetch,y=Object(Y.a)(ye,{onError:function(){Z.b.error("Chyba serveru, kontaktujte spr\xe1vce")}}),I=Object(S.a)(y,2),k=I[0],C=I[1],N=C.loading,z=C.data;return Object(G.useEffect)((function(){!0===n?v():t.push("/login?next=/guests")}),[v,t,n]),Object(G.useEffect)((function(){var e,t=[];null===x||void 0===x||null===(e=x.guests)||void 0===e||e.forEach((function(e){null!==e&&t.push(e)})),u(t)}),[x]),Object(G.useEffect)((function(){void 0!==g&&g()}),[g,z]),Object(U.jsxs)(E.a,{children:[Object(U.jsx)(E.a.Header,{children:Object(U.jsx)(se.a,{level:3,className:"home__listings-title",children:"Host\xe9"})}),Object(U.jsxs)(E.a.Content,{className:"app-content",children:[Object(U.jsx)(ae.b,{bordered:!0,className:"guests-list",dataSource:l,footer:Object(U.jsx)(re.a,{icon:Object(U.jsx)(ce.a,{}),onClick:function(){m(null),s(!0)},type:"primary",children:"P\u0159idat hosta"}),header:Object(U.jsx)("h4",{children:"Seznam host\u016f"}),itemLayout:"horizontal",loading:f,renderItem:function(e){return Object(U.jsx)(ze,{deleteGuest:function(e){return k({variables:{guestId:e}})},guest:e,loading:N,openGuestDrawer:function(){return s(!0)},selectGuest:m})}}),Object(U.jsx)(Ie,{close:function(){return s(!1)},guest:b,refetch:g,visible:i})]})]})})),Fe=n(520),Re=Object(X.a)(d||(d=Object(Q.a)(["\n  query Whoami {\n    whoami {\n      username\n    }\n  }\n"]))),Se=(n(466),{labelCol:{lg:8,md:8,sm:8},wrapperCol:{lg:16,md:16,sm:16}}),Ae={wrapperCol:{lg:{offset:8,span:16},xs:{offset:0,span:24}}},Ee=Object(M.f)((function(e){var t=e.history,n=e.isAuthenticated,a=e.location,r=e.setIsAuthenticated,i=Object(G.useState)("Na\u010d\xedt\xe1m..."),s=Object(S.a)(i,2),c=s[0],o=s[1],l=Object(G.useState)("/"),u=Object(S.a)(l,2),d=u[0],j=u[1];Object(G.useEffect)((function(){var e=a.search.substring(1).split("=");e.length>=2&&void 0!==e[1]&&j(e[1])}),[a]);var b=Object(Y.a)(ee,{onCompleted:function(e){var n;void 0!==(null===(n=e.tokenAuth)||void 0===n?void 0:n.token)&&(r(!0),t.push(d))},onError:function(e){console.error(e),Z.b.error("Nespr\xe1vn\xe9 p\u0159ihla\u0161ovac\xed \xfadaje")}}),m=Object(S.a)(b,2),O=m[0],h=m[1].loading,v=Object(Fe.a)(Re,{onCompleted:function(e){var n;void 0!==(null===e||void 0===e||null===(n=e.whoami)||void 0===n?void 0:n.username)&&(r(!0),t.push(d))},onError:function(e){console.error(e)}}),p=v.loading,f=v.refetch;Object(G.useEffect)((function(){!1===n&&f()}),[n,f]);var g=ue.a.useForm(),y=Object(S.a)(g,1)[0];return Object(U.jsxs)(E.a,{children:[Object(U.jsx)(E.a.Header,{children:Object(U.jsx)(se.a,{level:3,className:"home__listings-title",children:"P\u0159ihl\xe1\u0161en\xed"})}),Object(U.jsx)(E.a.Content,{children:Object(U.jsx)(K.a,{spinning:p||h,tip:c,children:Object(U.jsxs)(ue.a,Object(x.a)(Object(x.a)({},Se),{},{className:"login",form:y,name:"login",onFinish:function(e){o("P\u0159ihla\u0161ov\xe1n\xed..."),O({variables:{password:e.password.trim(),username:e.username.trim()}})},children:[Object(U.jsx)(ue.a.Item,{label:"Jm\xe9no",name:"username",rules:[ve.requiredRule],children:Object(U.jsx)(be.a,{type:"text",placeholder:"u\u017eivatelsk\xe9 jm\xe9no"})}),Object(U.jsx)(ue.a.Item,{label:"Heslo",name:"password",rules:[ve.requiredRule],children:Object(U.jsx)(be.a,{type:"password",placeholder:"heslo"})}),Object(U.jsxs)(ue.a.Item,Object(x.a)(Object(x.a)({},Ae),{},{children:[Object(U.jsx)(re.a,{type:"default",htmlType:"button",onClick:function(){return y.resetFields()},children:"Reset"}),Object(U.jsx)(re.a,{type:"primary",htmlType:"submit",children:"P\u0159ihl\xe1sit"})]}))]}))})})]})})),qe=n(529),Te=Object(M.f)((function(e){var t=e.history;return Object(U.jsx)(E.a,{children:Object(U.jsx)(E.a.Content,{children:Object(U.jsx)(qe.a,{status:"404",title:"Jejda!",subTitle:"hled\xe1me va\u0161\xed str\xe1nku... ale nem\u016f\u017eeme ji naj\xedt...",extra:Object(U.jsx)(re.a,{onClick:function(){return t.push("/")},type:"primary",children:"P\u0159ej\xedt na \xfavod"})})})})})),we=n(271),Ge=n.n(we),Pe=n(105),Me=n.n(Pe),He=n(267),$e=n(128),_e=(n(496),n(497),function(e){switch(e){case"NONBINDING":return"Nez\xe1vazn\xe1 Rezervace";case"ACCOMMODATED":return"Aktu\xe1ln\u011b Ubytov\xe1n\xed";case"INHABITED":return"Obydlen\xfd Term\xedn";case"BINDING":default:return"Z\xe1vazn\xe1 Rezervace"}}),Be=function(e){var t=e.close,n=e.open,a=e.refetch,r=ue.a.useForm(),i=Object(S.a)(r,1)[0],s=Object(G.useState)(!1),c=Object(S.a)(s,2),o=c[0],l=c[1],u=Object(Y.a)(xe,{onCompleted:function(e){var n,r,i,s;Z.b.success("Host ".concat(null===(n=e.createGuest)||void 0===n||null===(r=n.guest)||void 0===r?void 0:r.name," ").concat(null===(i=e.createGuest)||void 0===i||null===(s=i.guest)||void 0===s?void 0:s.surname," byl p\u0159id\xe1n")),void 0!==a&&a(),t()},onError:function(e){Z.b.error(e.message)}}),d=Object(S.a)(u,1)[0];return Object(U.jsx)(de.a,{closeIcon:Object(U.jsx)(je.a,{onCancel:function(){return l(!1)},onConfirm:function(){l(!1),i.resetFields(),t()},placement:"rightTop",title:"Zav\u0159\xedt formul\xe1\u0159? Data ve formul\xe1\u0159i budou ztracena",visible:o,children:Object(U.jsx)(he.a,{onClick:function(){i.isFieldsTouched()?l(!0):t()}})}),footer:Object(U.jsx)(U.Fragment,{children:Object(U.jsx)(re.a,{onClick:function(){i.validateFields().then((function(){var e=i.getFieldsValue(!0),t={email:e.email,name:e.name,surname:e.surname};d({variables:{data:t}})})).catch((function(){return console.error("Formul\xe1\u0159 nelze odeslat")}))},type:"primary",children:"Vytvo\u0159it"})}),footerStyle:{textAlign:"right"},placement:"left",title:"Nov\xfd host",visible:n,width:500,children:Object(U.jsxs)(ue.a,{form:i,layout:"vertical",name:"guest",children:[Object(U.jsx)(se.a,{level:5,children:"Osobn\xed \xfadaje"}),Object(U.jsx)(ue.a.Item,{hasFeedback:!0,label:"Jm\xe9no",name:"name",required:!0,rules:pe.requiredAlphaRules,children:Object(U.jsx)(be.a,{placeholder:"Va\u0161e Jm\xe9no"})}),Object(U.jsx)(ue.a.Item,{hasFeedback:!0,label:"P\u0159\xedjmen\xed",name:"surname",required:!0,rules:pe.requiredAlphaRules,children:Object(U.jsx)(be.a,{placeholder:"Va\u0161e P\u0159\xedjmen\xed"})}),Object(U.jsx)(ue.a.Item,{hasFeedback:!0,label:"E-Mail",name:"email",required:!0,rules:[ve.requiredRule],children:Object(U.jsx)(be.a,{addonBefore:Object(U.jsx)(ue.a.Item,{name:"email-prefix",noStyle:!0,children:Object(U.jsx)(Oe.a,{})}),placeholder:"e-mail",type:"email"})})]})})},Ve=Object(X.a)(j||(j=Object(Q.a)(["\n  query Suites {\n    suites {\n      id\n      title\n      number\n    }\n  }\n"]))),Je=Object(X.a)(b||(b=Object(Q.a)(["\n  query SuitesWithReservations {\n    guests {\n      id\n      name\n      surname\n    }\n    suites {\n      id\n      number\n      title\n    }\n    reservations {\n      fromDate\n      id\n      guest {\n        id\n        name\n        surname\n      }\n      meal\n      notes\n      purpose\n      roommates {\n        id\n        name\n        surname\n      }\n      suite {\n        id\n      }\n      toDate\n      type\n    }\n  }\n"]))),Ue=n(278),Le=n(524),Ze=n(521),Ke=n(542),We=n(183),Ye=n(535),Qe=n(536),Xe=n(532),et=(n(498),{mealOptions:[{label:"Bez Stravy",value:"NOMEAL"},{label:"Jen Sn\xeddan\u011b",value:"BREAKFAST"},{label:"Polopenze",value:"HALFBOARD"}],reservationOptions:[{label:_e("BINDING"),value:"BINDING"},{label:_e("NONBINDING"),value:"NONBINDING"},{label:_e("ACCOMMODATED"),value:"ACCOMMODATED"},{label:_e("INHABITED"),value:"INHABITED"}],getRequiredRule:function(e){return{required:!0,message:e}},guestValidators:function(e){return[{message:"host nem\u016f\u017ee b\xfdt stejn\xfd jako spolubydl\xedc\xed",validator:function(t,n){var a=e.getFieldValue("roommates");if(void 0===a||0===a.length)return Promise.resolve();var r=a.filter((function(e){return void 0!==e&&e.id===n}));return void 0===r||0===r.length?Promise.resolve():Promise.reject(new Error("Fail guest validation, equals to roommate"))}},{message:"vyberte hosta",required:!0}]},roommateValidators:function(e){return[{message:"spolubydl\xedc\xed je ji\u017e vybr\xe1n",validator:function(t,n){var a=e.getFieldValue("roommates").filter((function(e){return void 0!==e&&e.id===n}));return void 0===a||a.length<=1?Promise.resolve():Promise.reject(new Error("Fail roommate validation, duplicate value"))}},{message:"spolubydl\xedc\xed nem\u016f\u017ee b\xfdt stejn\xfd jako host",validator:function(t,n){return e.getFieldValue("guest")!==n?Promise.resolve():Promise.reject(new Error("Fail roommate validation, equals to guest"))}}]}}),tt=Object(X.a)(m||(m=Object(Q.a)(["\n  mutation CreateReservation($data: ReservationInput!) {\n    createReservation(data: $data) {\n      reservation {\n        id\n      }\n    }\n  }\n"]))),nt=Object(X.a)(O||(O=Object(Q.a)(["\n  mutation DeleteReservation($reservationId: ID!) {\n    deleteReservation(reservationId: $reservationId) {\n      reservation {\n        id\n      }\n    }\n  }\n"]))),at=Object(X.a)(h||(h=Object(Q.a)(["\n  mutation UpdateReservation($data: ReservationInput!) {\n    updateReservation(data: $data) {\n      reservation {\n        id\n      }\n    }\n  }\n"]))),rt="YYYY-MM-DD HH:mm",it=["key","name","fieldKey"],st=function(e){var t=e.close,n=e.guests,a=e.isOpen,r=e.openGuestDrawer,i=e.refetch,s=e.reservation,c=Object(Y.a)(tt,{onCompleted:function(){Z.b.success("Rezervace byla vytvo\u0159ena!"),void 0!==i&&i(),t()},onError:function(e){Z.b.error(e.message)}}),o=Object(S.a)(c,1)[0],l=Object(Y.a)(at,{onCompleted:function(){Z.b.success("Rezervace byla aktualizov\xe1na!"),void 0!==i&&i(),t()},onError:function(e){Z.b.error(e.message)}}),u=Object(S.a)(l,1)[0],d=Object(Y.a)(nt,{onCompleted:function(){Z.b.success("Rezervace byla odstran\u011bna!"),void 0!==i&&i(),t()},onError:function(e){Z.b.error(e)}}),j=Object(S.a)(d,1)[0],b=Object(G.useState)(!1),m=Object(S.a)(b,2),O=m[0],h=m[1],v=Object(G.useState)([]),p=Object(S.a)(v,2),f=p[0],g=p[1],y=ue.a.useForm(),I=Object(S.a)(y,1)[0],k=void 0!==s?{dates:[s.fromDate,s.toDate],guest:void 0===s.guest?null:s.guest.id,meal:s.meal,notes:s.notes,purpose:s.purpose,roommates:Array.from(s.roommates,(function(e){return{id:e.id}})),type:s.type}:{type:"NONBINDING"},C=function(){h(!1),setTimeout((function(){t()}))},N=function(){var e=I.getFieldsValue(!0),t=I.getFieldValue("dates"),n=Object(S.a)(t,2),a=n[0],r=n[1],i=void 0===e.roommates?[]:Array.from(e.roommates,(function(e){return e.id})),c={fromDate:a.format(rt),guest:e.guest,meal:e.meal,notes:e.notes,purpose:e.purpose,roommates:i,suite:void 0!==s?+s.suite.id:null,toDate:r.format(rt),type:e.type};void 0!==s&&void 0!==s.id?u({variables:{data:Object(x.a)(Object(x.a)({},c),{},{id:String(s.id)})}}):o({variables:{data:c}})},z=[void 0!==s?Object(U.jsx)(je.a,{cancelText:"Ne",okText:"Ano",onConfirm:function(){j({variables:{reservationId:String(s.id)}})},title:"Odstranit rezervaci?",children:Object(U.jsx)(re.a,{className:"cancel-button",danger:!0,icon:Object(U.jsx)(We.a,{}),children:"Odstranit"})},"remove"):null,Object(U.jsx)(re.a,{onClick:r,children:"P\u0159idat hosta"},"guest"),Object(U.jsx)(re.a,{icon:void 0===s?Object(U.jsx)(ce.a,{}):Object(U.jsx)(Ye.a,{}),onClick:function(){I.validateFields().then(N)},type:"primary",children:void 0!==s&&void 0!==s.id?"Upravit":"Ulo\u017eit"},"create")];return Object(G.useEffect)((function(){void 0!==n&&null!==n&&g(Array.from(n,(function(e){return{label:"".concat(e.name," ").concat(e.surname),value:e.id}})))}),[n]),Object(G.useEffect)((function(){!0===a&&I.resetFields()}),[I,a]),Object(U.jsx)(Le.a,{closeIcon:Object(U.jsx)(je.a,{onCancel:function(){return h(!1)},onConfirm:C,title:"Zav\u0159\xedt formul\xe1\u0159? Data ve formul\xe1\u0159i budou ztracena",visible:O,children:Object(U.jsx)(he.a,{onClick:function(){I.isFieldsTouched()?h(!0):C()}})}),footer:z,title:"Rezerva\u010dn\xed formul\xe1\u0159",visible:a,children:Object(U.jsxs)(ue.a,{form:I,initialValues:k,layout:"vertical",children:[Object(U.jsx)(ue.a.Item,{label:"Datum Rezervace",name:"dates",required:!0,children:Object(U.jsx)(Ze.a.RangePicker,{format:rt,showTime:!0})}),Object(U.jsx)(ue.a.Item,{hasFeedback:!0,label:"Host",name:"guest",required:!0,rules:et.guestValidators(I),children:Object(U.jsx)(me.a,{filterOption:function(e,t){var n,a=null===t||void 0===t||null===(n=t.label)||void 0===n?void 0:n.toString().toLowerCase().indexOf(e.toLowerCase());return void 0!==a&&a>=0},options:f,showSearch:!0})}),Object(U.jsx)(ue.a.List,{name:"roommates",children:function(e,t){var n=t.add,a=t.remove;return Object(U.jsxs)(U.Fragment,{children:[e.map((function(e){var t=e.key,n=e.name,r=e.fieldKey,i=Object(Ue.a)(e,it);return Object(U.jsxs)(Ke.b,{align:"baseline",className:"roommate-list",children:[Object(U.jsx)(ue.a.Item,Object(x.a)(Object(x.a)({hasFeedback:!0},i),{},{fieldKey:[r,"first"],name:[n,"id"],rules:et.roommateValidators(I),children:Object(U.jsx)(me.a,{options:f,showSearch:!0})})),Object(U.jsx)(Qe.a,{onClick:function(){a(n),I.validateFields()}})]},t)})),Object(U.jsx)(ue.a.Item,{children:Object(U.jsx)(re.a,{disabled:e.length>=f.length,type:"dashed",onClick:function(){return n()},block:!0,icon:Object(U.jsx)(Xe.a,{}),children:"P\u0159idat spolubydl\xedc\xedho"})})]})}}),Object(U.jsx)(ue.a.Item,{hasFeedback:!0,label:"Typ Rezervace",name:"type",required:!0,rules:[et.getRequiredRule("vyberte typ rezervace")],children:Object(U.jsx)(me.a,{options:et.reservationOptions})}),Object(U.jsx)(ue.a.Item,{hasFeedback:!0,label:"Strava",name:"meal",required:!0,rules:[ve.requiredRule],children:Object(U.jsx)(me.a,{options:et.mealOptions})}),Object(U.jsx)(ue.a.Item,{label:"\xda\u010del pobytu",name:"purpose",children:Object(U.jsx)(be.a,{placeholder:"\xfa\u010del pobytu"})}),Object(U.jsx)(ue.a.Item,{label:"Pozn\xe1mky",name:"notes",children:Object(U.jsx)(be.a.TextArea,{placeholder:"zadejte text",allowClear:!0})})]})})},ct=Object(M.f)((function(e){var t=e.history,n=e.isAuthenticated,a=function(e){switch(e){case"NONBINDING":return"rgb(254, 223, 3)";case"ACCOMMODATED":return"rgb(0, 133, 182)";case"INHABITED":return"rgb(254, 127, 45)";case"BINDING":default:return"rgb(0, 212, 157)"}},r=Object(oe.a)(Je,{onError:function(e){console.error(e),Z.b.error("Chyba serveru, kontaktujte spr\xe1vce")}}),i=Object(S.a)(r,2),s=i[0],c=i[1],o=c.data,l=c.refetch,u=Object(G.useState)([]),d=Object(S.a)(u,2),j=d[0],b=d[1],m=Object(G.useState)(!1),O=Object(S.a)(m,2),h=O[0],v=O[1],p=Object(G.useState)([]),f=Object(S.a)(p,2),g=f[0],y=f[1],I=Object(G.useState)(!1),k=Object(S.a)(I,2),N=k[0],z=k[1],D=Object(G.useState)(),F=Object(S.a)(D,2),R=F[0],A=F[1];Object(G.useEffect)((function(){!0===n?s():t.push("/login?next=/")}),[s,t,n]),Object(G.useEffect)((function(){var e,t,n=[],r=[];null===o||void 0===o||null===(e=o.suites)||void 0===e||e.forEach((function(e){null!==e&&n.push(Object(x.a)(Object(x.a)({},e),{},{stackItems:!0}))})),null===o||void 0===o||null===(t=o.reservations)||void 0===t||t.forEach((function(e){null!==e&&r.push({color:a(e.type),end_time:C()(e.toDate),group:e.suite.id,id:e.id,itemProps:{className:"reservation-item",style:{background:a(e.type),border:"none"}},start_time:C()(e.fromDate),title:"".concat(e.guest.name," ").concat(e.guest.surname),type:_e(e.type)})})),b(n),y(r)}),[o]);return Object(U.jsxs)(E.a,{children:[Object(U.jsx)(E.a.Header,{children:Object(U.jsx)(se.a,{level:3,className:"home__listings-title",children:"Rezervace / Obsazenost"})}),Object(U.jsxs)(E.a.Content,{className:"app-content timeline",children:[void 0!==o?Object(U.jsxs)(Me.a,{canChangeGroup:!1,canMove:!1,canResize:!1,defaultTimeEnd:C()().add(12,"day"),defaultTimeStart:C()().add(-12,"day"),groupRenderer:function(e){var t=e.group;return Object(U.jsx)(U.Fragment,{children:Object(U.jsx)(se.a,{level:5,children:t.title})})},groups:j,itemRenderer:function(e){var t=e.item,n=e.itemContext,a=e.getItemProps,r=(0,e.getResizeProps)(),i=r.left,s=r.right;return void 0!==t.itemProps?Object(U.jsxs)("div",Object(x.a)(Object(x.a)({},a(t.itemProps)),{},{children:[n.useResizeHandle?Object(U.jsx)("div",Object(x.a)({},i)):"",Object(U.jsx)(He.a,{title:t.title,content:Object(U.jsxs)(U.Fragment,{children:[Object(U.jsx)("div",{style:{color:t.color,fontWeight:700},children:t.type}),Object(U.jsxs)("div",{children:["Od: ",Object(U.jsx)("strong",{children:t.start_time.format("DD MMM HH:mm")})]}),Object(U.jsxs)("div",{children:["Do: ",Object(U.jsx)("strong",{children:t.end_time.format("DD MMM HH:mm")})]})]}),children:Object(U.jsx)("div",{className:"rct-item-content",style:{maxHeight:"".concat(n.dimensions.height)},children:Object(U.jsx)(Ge.a,{strong:!0,children:t.title})})}),n.useResizeHandle?Object(U.jsx)("div",Object(x.a)({},s)):""]})):null},items:g,lineHeight:60,onCanvasClick:function(e,t){var n=j.find((function(t){return t.id===e}));void 0!==n&&(A({fromDate:C()(t),suite:Object(x.a)({},n),roommates:[],toDate:C()(t).add(1,"day"),type:"NONBINDING"}),z(!0))},onItemClick:function(e,t,n){if(void 0!==(null===o||void 0===o?void 0:o.reservations)&&null!==o.reservations){var a=o.reservations.find((function(t){return null!==t&&t.id===String(e)}));void 0!==a&&null!==a&&(A({fromDate:C()(a.fromDate),guest:a.guest,id:+a.id,meal:a.meal,notes:a.notes,purpose:a.purpose,roommates:a.roommates,suite:a.suite,toDate:C()(a.toDate),type:a.type}),z(!0))}},children:[Object(U.jsxs)(Pe.TimelineHeaders,{children:[Object(U.jsx)(Pe.SidebarHeader,{children:function(e){var t=e.getRootProps;return Object(U.jsx)("div",Object(x.a)(Object(x.a)({},t()),{},{className:"side-header"}))}}),Object(U.jsx)(Pe.DateHeader,{unit:"primaryHeader"}),Object(U.jsx)(Pe.DateHeader,{className:"days",unit:"day"})]}),Object(U.jsx)(Pe.CursorMarker,{children:function(e){var t=e.styles,n=e.date;return Object(U.jsx)("div",{style:Object(x.a)(Object(x.a)({},t),{},{backgroundColor:"rgba(136, 136, 136, 0.5)",color:"#888"}),children:Object(U.jsx)("div",{className:"rt-marker__label",children:Object(U.jsx)("div",{className:"rt-marker__content",children:C()(n).format("DD MMM HH:mm")})})})}})]}):Object(U.jsx)($e.a,{}),Object(U.jsx)(st,{close:function(){A(void 0),z(!1)},guests:null===o||void 0===o?void 0:o.guests,isOpen:N,openGuestDrawer:function(){return v(!0)},refetch:l,reservation:R}),Object(U.jsx)(Be,{close:function(){return v(!1)},open:h,refetch:l})]})]})})),ot=n(528),lt=Object(X.a)(v||(v=Object(Q.a)(["\n  mutation CreateSuite($data: SuiteInput!) {\n    createSuite(data: $data) {\n      suite {\n        id\n        number\n        title\n      }\n    }\n  }\n"]))),ut=Object(X.a)(p||(p=Object(Q.a)(["\n  mutation UpdateSuite($data: SuiteInput!) {\n    updateSuite(data: $data) {\n      suite {\n        id\n        number\n        title\n      }\n    }\n  }\n"]))),dt=Object(X.a)(f||(f=Object(Q.a)(["\n  mutation DeleteSuite($suiteId: ID!) {\n    deleteSuite(suiteId: $suiteId) {\n      suite {\n        id\n      }\n    }\n  }\n"]))),jt=function(e){var t=e.close,n=e.suite,a=e.refetch,r=e.visible,i=Object(Y.a)(lt,{onCompleted:function(e){var n,r;Z.b.success("Apartm\xe1 ".concat(null===(n=e.createSuite)||void 0===n||null===(r=n.suite)||void 0===r?void 0:r.title," byla vytvo\u0159ena")),void 0!==a&&a(),t()},onError:function(e){console.error(e)}}),s=Object(S.a)(i,1)[0],c=Object(Y.a)(ut,{onCompleted:function(e){var n,r;Z.b.success("Apartm\xe1 ".concat(null===(n=e.updateSuite)||void 0===n||null===(r=n.suite)||void 0===r?void 0:r.title," byla aktualizov\xe1na")),void 0!==a&&a(),t()},onError:function(e){console.error(e)}}),o=Object(S.a)(c,1)[0],l=ue.a.useForm(),u=Object(S.a)(l,1)[0],d=Object(G.useState)(!1),j=Object(S.a)(d,2),b=j[0],m=j[1],O={number:null===n||void 0===n?void 0:n.number,title:null===n||void 0===n?void 0:n.title};Object(G.useEffect)((function(){!0===r&&u.resetFields()}),[u,r]);return Object(U.jsx)(de.a,{closeIcon:Object(U.jsx)(je.a,{onCancel:function(){return m(!1)},onConfirm:function(){m(!1),t()},placement:"rightTop",title:"Zav\u0159\xedt formul\xe1\u0159? Data ve formul\xe1\u0159i budou ztracena",visible:b,children:Object(U.jsx)(he.a,{onClick:function(){u.isFieldsTouched()?m(!0):t()}})}),footer:Object(U.jsx)(U.Fragment,{children:Object(U.jsx)(re.a,{onClick:function(){u.validateFields().then((function(){var e=u.getFieldsValue(!0),t={data:{number:e.number,title:e.title}};void 0===n?s({variables:t}):u.isFieldsTouched()&&(t.data.id=n.id,o({variables:t}))})).catch((function(){console.error("Form validation failed")}))},type:"primary",children:"Vytvo\u0159it"})}),footerStyle:{textAlign:"right"},placement:"left",title:"Nov\xe9 apartm\xe1",visible:r,width:500,children:Object(U.jsxs)(ue.a,{form:u,initialValues:O,layout:"vertical",name:"suite",children:[Object(U.jsx)(ue.a.Item,{hasFeedback:!0,label:"N\xe1zev",name:"title",required:!0,rules:[ve.requiredRule],children:Object(U.jsx)(be.a,{placeholder:"n\xe1zev apartm\xe1"})}),Object(U.jsx)(ue.a.Item,{hasFeedback:!0,label:"\u010c\xedslo",name:"number",required:!0,rules:[ve.requiredRule,{message:"zadejte \u010d\xedslo",pattern:/^[0-9]+$/}],children:Object(U.jsx)(be.a,{placeholder:"\u010d\xedslo apartm\xe1",type:"number"})})]})})},bt=(n(499),Object(M.f)((function(e){var t=e.history,n=e.isAuthenticated,a=Object(G.useState)(!1),r=Object(S.a)(a,2),i=r[0],s=r[1],c=Object(G.useState)(),o=Object(S.a)(c,2),l=o[0],u=o[1],d=Object(G.useState)([]),j=Object(S.a)(d,2),b=j[0],m=j[1],O=Object(oe.a)(Ve,{onError:function(e){console.error(e),Z.b.error("Chyba serveru, kontaktujte spr\xe1vce")}}),h=Object(S.a)(O,2),v=h[0],p=h[1],f=p.loading,x=p.data,g=p.refetch,y=Object(Y.a)(dt,{onError:function(e){console.error(e)}}),I=Object(S.a)(y,2),k=I[0],C=I[1],N=C.loading,z=C.data;Object(G.useEffect)((function(){!0===n?v():t.push("/login?next=/apartma")}),[v,t,n]),Object(G.useEffect)((function(){var e,t=[];null===x||void 0===x||null===(e=x.suites)||void 0===e||e.forEach((function(e){null!==e&&t.push(e)})),m(t)}),[x]),Object(G.useEffect)((function(){void 0!==g&&g()}),[g,z]);return Object(U.jsxs)(E.a,{children:[Object(U.jsx)(E.a.Header,{children:Object(U.jsx)(se.a,{level:3,className:"home__listings-title",children:"Apartm\xe1"})}),Object(U.jsxs)(E.a.Content,{className:"app-content",children:[Object(U.jsx)(ae.b,{bordered:!0,className:"suites-list",dataSource:b,footer:Object(U.jsx)(re.a,{icon:Object(U.jsx)(ce.a,{}),onClick:function(){u(void 0),s(!0)},type:"primary",children:"P\u0159idat apartm\xe1"}),header:Object(U.jsx)("h4",{children:"Seznam apartm\xe1"}),itemLayout:"horizontal",loading:f,renderItem:function(e){return Object(U.jsx)(ae.b.Item,{actions:[Object(U.jsx)(re.a,{onClick:function(){return function(e){u(e),s(!0)}(e)},type:"link",children:"upravit"},"edit"),Object(U.jsx)(je.a,{cancelText:"Ne",icon:Object(U.jsx)(ke.a,{}),okText:"Ano",onConfirm:function(){return function(e){k({variables:{suiteId:e.id}})}(e)},title:"opravdu odstranit?",children:Object(U.jsx)(re.a,{loading:N,type:"link",children:"odstranit"},"remove")})],children:Object(U.jsx)(ot.a,{title:!1,loading:f,active:!0,children:Object(U.jsx)(ae.b.Item.Meta,{avatar:Object(U.jsx)(Ce.a,{gap:4,size:"large",children:Object(U.jsx)(B.a,{})}),description:"\u010d\xedslo pokoje - ".concat(e.number),title:e.title})})})}}),Object(U.jsx)(jt,{close:function(){return s(!1)},refetch:g,suite:l,visible:i})]})]})}))),mt=function(){var e=Object(G.useState)(!1),t=Object(S.a)(e,2),n=t[0],a=t[1];return Object(U.jsx)(A.a,{locale:w.a,children:Object(U.jsx)(P.a,{children:Object(U.jsxs)(E.a,{id:"app",children:[Object(U.jsx)(q.a,{offsetTop:0,className:"app__affix-header",children:Object(U.jsx)(ne,{isAuthenticated:n,setIsAuthenticated:a})}),Object(U.jsxs)(M.c,{children:[Object(U.jsx)(M.a,{exact:!0,path:"/",children:Object(U.jsx)(ct,{isAuthenticated:n})}),Object(U.jsx)(M.a,{exact:!0,path:"/apartma",children:Object(U.jsx)(bt,{isAuthenticated:n})}),Object(U.jsx)(M.a,{exact:!0,path:"/guests",children:Object(U.jsx)(De,{isAuthenticated:n})}),Object(U.jsx)(M.a,{exact:!0,path:"/login",children:Object(U.jsx)(Ee,{isAuthenticated:n,setIsAuthenticated:a})}),Object(U.jsx)(M.a,{path:"*",children:Object(U.jsx)(Te,{})})]})]})})})};C.a.locale("cs");var Ot=new N.a({uri:"/api"}),ht=new z.ApolloLink((function(e,t){var n=I("JWT"),a=I("csrftoken");return e.setContext((function(e){var t=e.headers,r=void 0===t?{}:t;return{headers:Object(x.a)(Object(x.a)({},r),{},{authorization:null===n?null:"JWT ".concat(n),"X-CSRFToken":null===a?"":a})}})),t(e)})),vt=new D.a({cache:new F.a({typePolicies:{Query:{fields:{guests:{merge:!1},reservations:{merge:!1},suiteReservations:{merge:!1},suites:{merge:!1}}},Reservation:{fields:{roommates:{merge:!1}}}}}),link:Object(z.concat)(ht,Ot)});y.a.render(Object(U.jsx)(R.a,{client:vt,children:Object(U.jsx)(mt,{})}),document.getElementById("root"))}},[[504,1,2]]]);
//# sourceMappingURL=main.0a936f51.chunk.js.map