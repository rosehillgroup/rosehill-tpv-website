var A1=Object.defineProperty;var P1=(t,e,r)=>e in t?A1(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r;var $1=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports);var Jp=(t,e,r)=>P1(t,typeof e!="symbol"?e+"":e,r);var d7=$1((hr,fr)=>{function I1(t,e){for(var r=0;r<e.length;r++){const n=e[r];if(typeof n!="string"&&!Array.isArray(n)){for(const i in n)if(i!=="default"&&!(i in t)){const o=Object.getOwnPropertyDescriptor(n,i);o&&Object.defineProperty(t,i,o.get?o:{enumerable:!0,get:()=>n[i]})}}}return Object.freeze(Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}))}(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function r(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(i){if(i.ep)return;i.ep=!0;const o=r(i);fetch(i.href,o)}})();var Bn=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function zc(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}function M1(t){if(t.__esModule)return t;var e=t.default;if(typeof e=="function"){var r=function n(){return this instanceof n?Reflect.construct(e,arguments,this.constructor):e.apply(this,arguments)};r.prototype=e.prototype}else r={};return Object.defineProperty(r,"__esModule",{value:!0}),Object.keys(t).forEach(function(n){var i=Object.getOwnPropertyDescriptor(t,n);Object.defineProperty(r,n,i.get?i:{enumerable:!0,get:function(){return t[n]}})}),r}var Gv={exports:{}},Fc={},Wv={exports:{}},Be={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var La=Symbol.for("react.element"),D1=Symbol.for("react.portal"),L1=Symbol.for("react.fragment"),z1=Symbol.for("react.strict_mode"),F1=Symbol.for("react.profiler"),B1=Symbol.for("react.provider"),U1=Symbol.for("react.context"),H1=Symbol.for("react.forward_ref"),G1=Symbol.for("react.suspense"),W1=Symbol.for("react.memo"),V1=Symbol.for("react.lazy"),Qp=Symbol.iterator;function q1(t){return t===null||typeof t!="object"?null:(t=Qp&&t[Qp]||t["@@iterator"],typeof t=="function"?t:null)}var Vv={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},qv=Object.assign,Kv={};function ss(t,e,r){this.props=t,this.context=e,this.refs=Kv,this.updater=r||Vv}ss.prototype.isReactComponent={};ss.prototype.setState=function(t,e){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,e,"setState")};ss.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function Yv(){}Yv.prototype=ss.prototype;function qh(t,e,r){this.props=t,this.context=e,this.refs=Kv,this.updater=r||Vv}var Kh=qh.prototype=new Yv;Kh.constructor=qh;qv(Kh,ss.prototype);Kh.isPureReactComponent=!0;var eg=Array.isArray,Xv=Object.prototype.hasOwnProperty,Yh={current:null},Zv={key:!0,ref:!0,__self:!0,__source:!0};function Jv(t,e,r){var n,i={},o=null,s=null;if(e!=null)for(n in e.ref!==void 0&&(s=e.ref),e.key!==void 0&&(o=""+e.key),e)Xv.call(e,n)&&!Zv.hasOwnProperty(n)&&(i[n]=e[n]);var a=arguments.length-2;if(a===1)i.children=r;else if(1<a){for(var l=Array(a),u=0;u<a;u++)l[u]=arguments[u+2];i.children=l}if(t&&t.defaultProps)for(n in a=t.defaultProps,a)i[n]===void 0&&(i[n]=a[n]);return{$$typeof:La,type:t,key:o,ref:s,props:i,_owner:Yh.current}}function K1(t,e){return{$$typeof:La,type:t.type,key:e,ref:t.ref,props:t.props,_owner:t._owner}}function Xh(t){return typeof t=="object"&&t!==null&&t.$$typeof===La}function Y1(t){var e={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(r){return e[r]})}var tg=/\/+/g;function Eu(t,e){return typeof t=="object"&&t!==null&&t.key!=null?Y1(""+t.key):e.toString(36)}function Fl(t,e,r,n,i){var o=typeof t;(o==="undefined"||o==="boolean")&&(t=null);var s=!1;if(t===null)s=!0;else switch(o){case"string":case"number":s=!0;break;case"object":switch(t.$$typeof){case La:case D1:s=!0}}if(s)return s=t,i=i(s),t=n===""?"."+Eu(s,0):n,eg(i)?(r="",t!=null&&(r=t.replace(tg,"$&/")+"/"),Fl(i,e,r,"",function(u){return u})):i!=null&&(Xh(i)&&(i=K1(i,r+(!i.key||s&&s.key===i.key?"":(""+i.key).replace(tg,"$&/")+"/")+t)),e.push(i)),1;if(s=0,n=n===""?".":n+":",eg(t))for(var a=0;a<t.length;a++){o=t[a];var l=n+Eu(o,a);s+=Fl(o,e,r,l,i)}else if(l=q1(t),typeof l=="function")for(t=l.call(t),a=0;!(o=t.next()).done;)o=o.value,l=n+Eu(o,a++),s+=Fl(o,e,r,l,i);else if(o==="object")throw e=String(t),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return s}function sl(t,e,r){if(t==null)return t;var n=[],i=0;return Fl(t,n,"","",function(o){return e.call(r,o,i++)}),n}function X1(t){if(t._status===-1){var e=t._result;e=e(),e.then(function(r){(t._status===0||t._status===-1)&&(t._status=1,t._result=r)},function(r){(t._status===0||t._status===-1)&&(t._status=2,t._result=r)}),t._status===-1&&(t._status=0,t._result=e)}if(t._status===1)return t._result.default;throw t._result}var Xt={current:null},Bl={transition:null},Z1={ReactCurrentDispatcher:Xt,ReactCurrentBatchConfig:Bl,ReactCurrentOwner:Yh};function Qv(){throw Error("act(...) is not supported in production builds of React.")}Be.Children={map:sl,forEach:function(t,e,r){sl(t,function(){e.apply(this,arguments)},r)},count:function(t){var e=0;return sl(t,function(){e++}),e},toArray:function(t){return sl(t,function(e){return e})||[]},only:function(t){if(!Xh(t))throw Error("React.Children.only expected to receive a single React element child.");return t}};Be.Component=ss;Be.Fragment=L1;Be.Profiler=F1;Be.PureComponent=qh;Be.StrictMode=z1;Be.Suspense=G1;Be.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Z1;Be.act=Qv;Be.cloneElement=function(t,e,r){if(t==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+t+".");var n=qv({},t.props),i=t.key,o=t.ref,s=t._owner;if(e!=null){if(e.ref!==void 0&&(o=e.ref,s=Yh.current),e.key!==void 0&&(i=""+e.key),t.type&&t.type.defaultProps)var a=t.type.defaultProps;for(l in e)Xv.call(e,l)&&!Zv.hasOwnProperty(l)&&(n[l]=e[l]===void 0&&a!==void 0?a[l]:e[l])}var l=arguments.length-2;if(l===1)n.children=r;else if(1<l){a=Array(l);for(var u=0;u<l;u++)a[u]=arguments[u+2];n.children=a}return{$$typeof:La,type:t.type,key:i,ref:o,props:n,_owner:s}};Be.createContext=function(t){return t={$$typeof:U1,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},t.Provider={$$typeof:B1,_context:t},t.Consumer=t};Be.createElement=Jv;Be.createFactory=function(t){var e=Jv.bind(null,t);return e.type=t,e};Be.createRef=function(){return{current:null}};Be.forwardRef=function(t){return{$$typeof:H1,render:t}};Be.isValidElement=Xh;Be.lazy=function(t){return{$$typeof:V1,_payload:{_status:-1,_result:t},_init:X1}};Be.memo=function(t,e){return{$$typeof:W1,type:t,compare:e===void 0?null:e}};Be.startTransition=function(t){var e=Bl.transition;Bl.transition={};try{t()}finally{Bl.transition=e}};Be.unstable_act=Qv;Be.useCallback=function(t,e){return Xt.current.useCallback(t,e)};Be.useContext=function(t){return Xt.current.useContext(t)};Be.useDebugValue=function(){};Be.useDeferredValue=function(t){return Xt.current.useDeferredValue(t)};Be.useEffect=function(t,e){return Xt.current.useEffect(t,e)};Be.useId=function(){return Xt.current.useId()};Be.useImperativeHandle=function(t,e,r){return Xt.current.useImperativeHandle(t,e,r)};Be.useInsertionEffect=function(t,e){return Xt.current.useInsertionEffect(t,e)};Be.useLayoutEffect=function(t,e){return Xt.current.useLayoutEffect(t,e)};Be.useMemo=function(t,e){return Xt.current.useMemo(t,e)};Be.useReducer=function(t,e,r){return Xt.current.useReducer(t,e,r)};Be.useRef=function(t){return Xt.current.useRef(t)};Be.useState=function(t){return Xt.current.useState(t)};Be.useSyncExternalStore=function(t,e,r){return Xt.current.useSyncExternalStore(t,e,r)};Be.useTransition=function(){return Xt.current.useTransition()};Be.version="18.3.1";Wv.exports=Be;var $=Wv.exports;const P=zc($);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var J1=$,Q1=Symbol.for("react.element"),e_=Symbol.for("react.fragment"),t_=Object.prototype.hasOwnProperty,r_=J1.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,n_={key:!0,ref:!0,__self:!0,__source:!0};function ey(t,e,r){var n,i={},o=null,s=null;r!==void 0&&(o=""+r),e.key!==void 0&&(o=""+e.key),e.ref!==void 0&&(s=e.ref);for(n in e)t_.call(e,n)&&!n_.hasOwnProperty(n)&&(i[n]=e[n]);if(t&&t.defaultProps)for(n in e=t.defaultProps,e)i[n]===void 0&&(i[n]=e[n]);return{$$typeof:Q1,type:t,key:o,ref:s,props:i,_owner:r_.current}}Fc.Fragment=e_;Fc.jsx=ey;Fc.jsxs=ey;Gv.exports=Fc;var c=Gv.exports,Cd={},ty={exports:{}},vr={},ry={exports:{}},ny={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(t){function e(K,L){var oe=K.length;K.push(L);e:for(;0<oe;){var H=oe-1>>>1,G=K[H];if(0<i(G,L))K[H]=L,K[oe]=G,oe=H;else break e}}function r(K){return K.length===0?null:K[0]}function n(K){if(K.length===0)return null;var L=K[0],oe=K.pop();if(oe!==L){K[0]=oe;e:for(var H=0,G=K.length,pe=G>>>1;H<pe;){var Q=2*(H+1)-1,ae=K[Q],Re=Q+1,Ke=K[Re];if(0>i(ae,oe))Re<G&&0>i(Ke,ae)?(K[H]=Ke,K[Re]=oe,H=Re):(K[H]=ae,K[Q]=oe,H=Q);else if(Re<G&&0>i(Ke,oe))K[H]=Ke,K[Re]=oe,H=Re;else break e}}return L}function i(K,L){var oe=K.sortIndex-L.sortIndex;return oe!==0?oe:K.id-L.id}if(typeof performance=="object"&&typeof performance.now=="function"){var o=performance;t.unstable_now=function(){return o.now()}}else{var s=Date,a=s.now();t.unstable_now=function(){return s.now()-a}}var l=[],u=[],d=1,h=null,f=3,p=!1,v=!1,g=!1,b=typeof setTimeout=="function"?setTimeout:null,m=typeof clearTimeout=="function"?clearTimeout:null,y=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function x(K){for(var L=r(u);L!==null;){if(L.callback===null)n(u);else if(L.startTime<=K)n(u),L.sortIndex=L.expirationTime,e(l,L);else break;L=r(u)}}function w(K){if(g=!1,x(K),!v)if(r(l)!==null)v=!0,ie(j);else{var L=r(u);L!==null&&J(w,L.startTime-K)}}function j(K,L){v=!1,g&&(g=!1,m(N),N=-1),p=!0;var oe=f;try{for(x(L),h=r(l);h!==null&&(!(h.expirationTime>L)||K&&!U());){var H=h.callback;if(typeof H=="function"){h.callback=null,f=h.priorityLevel;var G=H(h.expirationTime<=L);L=t.unstable_now(),typeof G=="function"?h.callback=G:h===r(l)&&n(l),x(L)}else n(l);h=r(l)}if(h!==null)var pe=!0;else{var Q=r(u);Q!==null&&J(w,Q.startTime-L),pe=!1}return pe}finally{h=null,f=oe,p=!1}}var S=!1,C=null,N=-1,E=5,A=-1;function U(){return!(t.unstable_now()-A<E)}function O(){if(C!==null){var K=t.unstable_now();A=K;var L=!0;try{L=C(!0,K)}finally{L?F():(S=!1,C=null)}}else S=!1}var F;if(typeof y=="function")F=function(){y(O)};else if(typeof MessageChannel<"u"){var k=new MessageChannel,W=k.port2;k.port1.onmessage=O,F=function(){W.postMessage(null)}}else F=function(){b(O,0)};function ie(K){C=K,S||(S=!0,F())}function J(K,L){N=b(function(){K(t.unstable_now())},L)}t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(K){K.callback=null},t.unstable_continueExecution=function(){v||p||(v=!0,ie(j))},t.unstable_forceFrameRate=function(K){0>K||125<K?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):E=0<K?Math.floor(1e3/K):5},t.unstable_getCurrentPriorityLevel=function(){return f},t.unstable_getFirstCallbackNode=function(){return r(l)},t.unstable_next=function(K){switch(f){case 1:case 2:case 3:var L=3;break;default:L=f}var oe=f;f=L;try{return K()}finally{f=oe}},t.unstable_pauseExecution=function(){},t.unstable_requestPaint=function(){},t.unstable_runWithPriority=function(K,L){switch(K){case 1:case 2:case 3:case 4:case 5:break;default:K=3}var oe=f;f=K;try{return L()}finally{f=oe}},t.unstable_scheduleCallback=function(K,L,oe){var H=t.unstable_now();switch(typeof oe=="object"&&oe!==null?(oe=oe.delay,oe=typeof oe=="number"&&0<oe?H+oe:H):oe=H,K){case 1:var G=-1;break;case 2:G=250;break;case 5:G=1073741823;break;case 4:G=1e4;break;default:G=5e3}return G=oe+G,K={id:d++,callback:L,priorityLevel:K,startTime:oe,expirationTime:G,sortIndex:-1},oe>H?(K.sortIndex=oe,e(u,K),r(l)===null&&K===r(u)&&(g?(m(N),N=-1):g=!0,J(w,oe-H))):(K.sortIndex=G,e(l,K),v||p||(v=!0,ie(j))),K},t.unstable_shouldYield=U,t.unstable_wrapCallback=function(K){var L=f;return function(){var oe=f;f=L;try{return K.apply(this,arguments)}finally{f=oe}}}})(ny);ry.exports=ny;var i_=ry.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var o_=$,gr=i_;function le(t){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+t,r=1;r<arguments.length;r++)e+="&args[]="+encodeURIComponent(arguments[r]);return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var iy=new Set,ga={};function Ui(t,e){Jo(t,e),Jo(t+"Capture",e)}function Jo(t,e){for(ga[t]=e,t=0;t<e.length;t++)iy.add(e[t])}var bn=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Td=Object.prototype.hasOwnProperty,s_=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,rg={},ng={};function a_(t){return Td.call(ng,t)?!0:Td.call(rg,t)?!1:s_.test(t)?ng[t]=!0:(rg[t]=!0,!1)}function l_(t,e,r,n){if(r!==null&&r.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return n?!1:r!==null?!r.acceptsBooleans:(t=t.toLowerCase().slice(0,5),t!=="data-"&&t!=="aria-");default:return!1}}function c_(t,e,r,n){if(e===null||typeof e>"u"||l_(t,e,r,n))return!0;if(n)return!1;if(r!==null)switch(r.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function Zt(t,e,r,n,i,o,s){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=n,this.attributeNamespace=i,this.mustUseProperty=r,this.propertyName=t,this.type=e,this.sanitizeURL=o,this.removeEmptyString=s}var Lt={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t){Lt[t]=new Zt(t,0,!1,t,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(t){var e=t[0];Lt[e]=new Zt(e,1,!1,t[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(t){Lt[t]=new Zt(t,2,!1,t.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(t){Lt[t]=new Zt(t,2,!1,t,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t){Lt[t]=new Zt(t,3,!1,t.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(t){Lt[t]=new Zt(t,3,!0,t,null,!1,!1)});["capture","download"].forEach(function(t){Lt[t]=new Zt(t,4,!1,t,null,!1,!1)});["cols","rows","size","span"].forEach(function(t){Lt[t]=new Zt(t,6,!1,t,null,!1,!1)});["rowSpan","start"].forEach(function(t){Lt[t]=new Zt(t,5,!1,t.toLowerCase(),null,!1,!1)});var Zh=/[\-:]([a-z])/g;function Jh(t){return t[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t){var e=t.replace(Zh,Jh);Lt[e]=new Zt(e,1,!1,t,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t){var e=t.replace(Zh,Jh);Lt[e]=new Zt(e,1,!1,t,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(t){var e=t.replace(Zh,Jh);Lt[e]=new Zt(e,1,!1,t,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(t){Lt[t]=new Zt(t,1,!1,t.toLowerCase(),null,!1,!1)});Lt.xlinkHref=new Zt("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(t){Lt[t]=new Zt(t,1,!1,t.toLowerCase(),null,!0,!0)});function Qh(t,e,r,n){var i=Lt.hasOwnProperty(e)?Lt[e]:null;(i!==null?i.type!==0:n||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(c_(e,r,i,n)&&(r=null),n||i===null?a_(e)&&(r===null?t.removeAttribute(e):t.setAttribute(e,""+r)):i.mustUseProperty?t[i.propertyName]=r===null?i.type===3?!1:"":r:(e=i.attributeName,n=i.attributeNamespace,r===null?t.removeAttribute(e):(i=i.type,r=i===3||i===4&&r===!0?"":""+r,n?t.setAttributeNS(n,e,r):t.setAttribute(e,r))))}var Sn=o_.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,al=Symbol.for("react.element"),Ao=Symbol.for("react.portal"),Po=Symbol.for("react.fragment"),ef=Symbol.for("react.strict_mode"),Nd=Symbol.for("react.profiler"),oy=Symbol.for("react.provider"),sy=Symbol.for("react.context"),tf=Symbol.for("react.forward_ref"),Od=Symbol.for("react.suspense"),Rd=Symbol.for("react.suspense_list"),rf=Symbol.for("react.memo"),In=Symbol.for("react.lazy"),ay=Symbol.for("react.offscreen"),ig=Symbol.iterator;function $s(t){return t===null||typeof t!="object"?null:(t=ig&&t[ig]||t["@@iterator"],typeof t=="function"?t:null)}var yt=Object.assign,Cu;function Ks(t){if(Cu===void 0)try{throw Error()}catch(r){var e=r.stack.trim().match(/\n( *(at )?)/);Cu=e&&e[1]||""}return`
`+Cu+t}var Tu=!1;function Nu(t,e){if(!t||Tu)return"";Tu=!0;var r=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(u){var n=u}Reflect.construct(t,[],e)}else{try{e.call()}catch(u){n=u}t.call(e.prototype)}else{try{throw Error()}catch(u){n=u}t()}}catch(u){if(u&&n&&typeof u.stack=="string"){for(var i=u.stack.split(`
`),o=n.stack.split(`
`),s=i.length-1,a=o.length-1;1<=s&&0<=a&&i[s]!==o[a];)a--;for(;1<=s&&0<=a;s--,a--)if(i[s]!==o[a]){if(s!==1||a!==1)do if(s--,a--,0>a||i[s]!==o[a]){var l=`
`+i[s].replace(" at new "," at ");return t.displayName&&l.includes("<anonymous>")&&(l=l.replace("<anonymous>",t.displayName)),l}while(1<=s&&0<=a);break}}}finally{Tu=!1,Error.prepareStackTrace=r}return(t=t?t.displayName||t.name:"")?Ks(t):""}function u_(t){switch(t.tag){case 5:return Ks(t.type);case 16:return Ks("Lazy");case 13:return Ks("Suspense");case 19:return Ks("SuspenseList");case 0:case 2:case 15:return t=Nu(t.type,!1),t;case 11:return t=Nu(t.type.render,!1),t;case 1:return t=Nu(t.type,!0),t;default:return""}}function Ad(t){if(t==null)return null;if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case Po:return"Fragment";case Ao:return"Portal";case Nd:return"Profiler";case ef:return"StrictMode";case Od:return"Suspense";case Rd:return"SuspenseList"}if(typeof t=="object")switch(t.$$typeof){case sy:return(t.displayName||"Context")+".Consumer";case oy:return(t._context.displayName||"Context")+".Provider";case tf:var e=t.render;return t=t.displayName,t||(t=e.displayName||e.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case rf:return e=t.displayName||null,e!==null?e:Ad(t.type)||"Memo";case In:e=t._payload,t=t._init;try{return Ad(t(e))}catch{}}return null}function d_(t){var e=t.type;switch(t.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return t=e.render,t=t.displayName||t.name||"",e.displayName||(t!==""?"ForwardRef("+t+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Ad(e);case 8:return e===ef?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function Jn(t){switch(typeof t){case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function ly(t){var e=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function h_(t){var e=ly(t)?"checked":"value",r=Object.getOwnPropertyDescriptor(t.constructor.prototype,e),n=""+t[e];if(!t.hasOwnProperty(e)&&typeof r<"u"&&typeof r.get=="function"&&typeof r.set=="function"){var i=r.get,o=r.set;return Object.defineProperty(t,e,{configurable:!0,get:function(){return i.call(this)},set:function(s){n=""+s,o.call(this,s)}}),Object.defineProperty(t,e,{enumerable:r.enumerable}),{getValue:function(){return n},setValue:function(s){n=""+s},stopTracking:function(){t._valueTracker=null,delete t[e]}}}}function ll(t){t._valueTracker||(t._valueTracker=h_(t))}function cy(t){if(!t)return!1;var e=t._valueTracker;if(!e)return!0;var r=e.getValue(),n="";return t&&(n=ly(t)?t.checked?"true":"false":t.value),t=n,t!==r?(e.setValue(t),!0):!1}function Ql(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}function Pd(t,e){var r=e.checked;return yt({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:r??t._wrapperState.initialChecked})}function og(t,e){var r=e.defaultValue==null?"":e.defaultValue,n=e.checked!=null?e.checked:e.defaultChecked;r=Jn(e.value!=null?e.value:r),t._wrapperState={initialChecked:n,initialValue:r,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function uy(t,e){e=e.checked,e!=null&&Qh(t,"checked",e,!1)}function $d(t,e){uy(t,e);var r=Jn(e.value),n=e.type;if(r!=null)n==="number"?(r===0&&t.value===""||t.value!=r)&&(t.value=""+r):t.value!==""+r&&(t.value=""+r);else if(n==="submit"||n==="reset"){t.removeAttribute("value");return}e.hasOwnProperty("value")?Id(t,e.type,r):e.hasOwnProperty("defaultValue")&&Id(t,e.type,Jn(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(t.defaultChecked=!!e.defaultChecked)}function sg(t,e,r){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var n=e.type;if(!(n!=="submit"&&n!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+t._wrapperState.initialValue,r||e===t.value||(t.value=e),t.defaultValue=e}r=t.name,r!==""&&(t.name=""),t.defaultChecked=!!t._wrapperState.initialChecked,r!==""&&(t.name=r)}function Id(t,e,r){(e!=="number"||Ql(t.ownerDocument)!==t)&&(r==null?t.defaultValue=""+t._wrapperState.initialValue:t.defaultValue!==""+r&&(t.defaultValue=""+r))}var Ys=Array.isArray;function Wo(t,e,r,n){if(t=t.options,e){e={};for(var i=0;i<r.length;i++)e["$"+r[i]]=!0;for(r=0;r<t.length;r++)i=e.hasOwnProperty("$"+t[r].value),t[r].selected!==i&&(t[r].selected=i),i&&n&&(t[r].defaultSelected=!0)}else{for(r=""+Jn(r),e=null,i=0;i<t.length;i++){if(t[i].value===r){t[i].selected=!0,n&&(t[i].defaultSelected=!0);return}e!==null||t[i].disabled||(e=t[i])}e!==null&&(e.selected=!0)}}function Md(t,e){if(e.dangerouslySetInnerHTML!=null)throw Error(le(91));return yt({},e,{value:void 0,defaultValue:void 0,children:""+t._wrapperState.initialValue})}function ag(t,e){var r=e.value;if(r==null){if(r=e.children,e=e.defaultValue,r!=null){if(e!=null)throw Error(le(92));if(Ys(r)){if(1<r.length)throw Error(le(93));r=r[0]}e=r}e==null&&(e=""),r=e}t._wrapperState={initialValue:Jn(r)}}function dy(t,e){var r=Jn(e.value),n=Jn(e.defaultValue);r!=null&&(r=""+r,r!==t.value&&(t.value=r),e.defaultValue==null&&t.defaultValue!==r&&(t.defaultValue=r)),n!=null&&(t.defaultValue=""+n)}function lg(t){var e=t.textContent;e===t._wrapperState.initialValue&&e!==""&&e!==null&&(t.value=e)}function hy(t){switch(t){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Dd(t,e){return t==null||t==="http://www.w3.org/1999/xhtml"?hy(e):t==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":t}var cl,fy=function(t){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,r,n,i){MSApp.execUnsafeLocalFunction(function(){return t(e,r,n,i)})}:t}(function(t,e){if(t.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in t)t.innerHTML=e;else{for(cl=cl||document.createElement("div"),cl.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=cl.firstChild;t.firstChild;)t.removeChild(t.firstChild);for(;e.firstChild;)t.appendChild(e.firstChild)}});function ma(t,e){if(e){var r=t.firstChild;if(r&&r===t.lastChild&&r.nodeType===3){r.nodeValue=e;return}}t.textContent=e}var ra={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},f_=["Webkit","ms","Moz","O"];Object.keys(ra).forEach(function(t){f_.forEach(function(e){e=e+t.charAt(0).toUpperCase()+t.substring(1),ra[e]=ra[t]})});function py(t,e,r){return e==null||typeof e=="boolean"||e===""?"":r||typeof e!="number"||e===0||ra.hasOwnProperty(t)&&ra[t]?(""+e).trim():e+"px"}function gy(t,e){t=t.style;for(var r in e)if(e.hasOwnProperty(r)){var n=r.indexOf("--")===0,i=py(r,e[r],n);r==="float"&&(r="cssFloat"),n?t.setProperty(r,i):t[r]=i}}var p_=yt({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Ld(t,e){if(e){if(p_[t]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(le(137,t));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(le(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(le(61))}if(e.style!=null&&typeof e.style!="object")throw Error(le(62))}}function zd(t,e){if(t.indexOf("-")===-1)return typeof e.is=="string";switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Fd=null;function nf(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var Bd=null,Vo=null,qo=null;function cg(t){if(t=Ba(t)){if(typeof Bd!="function")throw Error(le(280));var e=t.stateNode;e&&(e=Wc(e),Bd(t.stateNode,t.type,e))}}function my(t){Vo?qo?qo.push(t):qo=[t]:Vo=t}function vy(){if(Vo){var t=Vo,e=qo;if(qo=Vo=null,cg(t),e)for(t=0;t<e.length;t++)cg(e[t])}}function yy(t,e){return t(e)}function by(){}var Ou=!1;function xy(t,e,r){if(Ou)return t(e,r);Ou=!0;try{return yy(t,e,r)}finally{Ou=!1,(Vo!==null||qo!==null)&&(by(),vy())}}function va(t,e){var r=t.stateNode;if(r===null)return null;var n=Wc(r);if(n===null)return null;r=n[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(n=!n.disabled)||(t=t.type,n=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!n;break e;default:t=!1}if(t)return null;if(r&&typeof r!="function")throw Error(le(231,e,typeof r));return r}var Ud=!1;if(bn)try{var Is={};Object.defineProperty(Is,"passive",{get:function(){Ud=!0}}),window.addEventListener("test",Is,Is),window.removeEventListener("test",Is,Is)}catch{Ud=!1}function g_(t,e,r,n,i,o,s,a,l){var u=Array.prototype.slice.call(arguments,3);try{e.apply(r,u)}catch(d){this.onError(d)}}var na=!1,ec=null,tc=!1,Hd=null,m_={onError:function(t){na=!0,ec=t}};function v_(t,e,r,n,i,o,s,a,l){na=!1,ec=null,g_.apply(m_,arguments)}function y_(t,e,r,n,i,o,s,a,l){if(v_.apply(this,arguments),na){if(na){var u=ec;na=!1,ec=null}else throw Error(le(198));tc||(tc=!0,Hd=u)}}function Hi(t){var e=t,r=t;if(t.alternate)for(;e.return;)e=e.return;else{t=e;do e=t,e.flags&4098&&(r=e.return),t=e.return;while(t)}return e.tag===3?r:null}function wy(t){if(t.tag===13){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function ug(t){if(Hi(t)!==t)throw Error(le(188))}function b_(t){var e=t.alternate;if(!e){if(e=Hi(t),e===null)throw Error(le(188));return e!==t?null:t}for(var r=t,n=e;;){var i=r.return;if(i===null)break;var o=i.alternate;if(o===null){if(n=i.return,n!==null){r=n;continue}break}if(i.child===o.child){for(o=i.child;o;){if(o===r)return ug(i),t;if(o===n)return ug(i),e;o=o.sibling}throw Error(le(188))}if(r.return!==n.return)r=i,n=o;else{for(var s=!1,a=i.child;a;){if(a===r){s=!0,r=i,n=o;break}if(a===n){s=!0,n=i,r=o;break}a=a.sibling}if(!s){for(a=o.child;a;){if(a===r){s=!0,r=o,n=i;break}if(a===n){s=!0,n=o,r=i;break}a=a.sibling}if(!s)throw Error(le(189))}}if(r.alternate!==n)throw Error(le(190))}if(r.tag!==3)throw Error(le(188));return r.stateNode.current===r?t:e}function _y(t){return t=b_(t),t!==null?Sy(t):null}function Sy(t){if(t.tag===5||t.tag===6)return t;for(t=t.child;t!==null;){var e=Sy(t);if(e!==null)return e;t=t.sibling}return null}var ky=gr.unstable_scheduleCallback,dg=gr.unstable_cancelCallback,x_=gr.unstable_shouldYield,w_=gr.unstable_requestPaint,St=gr.unstable_now,__=gr.unstable_getCurrentPriorityLevel,of=gr.unstable_ImmediatePriority,jy=gr.unstable_UserBlockingPriority,rc=gr.unstable_NormalPriority,S_=gr.unstable_LowPriority,Ey=gr.unstable_IdlePriority,Bc=null,Jr=null;function k_(t){if(Jr&&typeof Jr.onCommitFiberRoot=="function")try{Jr.onCommitFiberRoot(Bc,t,void 0,(t.current.flags&128)===128)}catch{}}var zr=Math.clz32?Math.clz32:C_,j_=Math.log,E_=Math.LN2;function C_(t){return t>>>=0,t===0?32:31-(j_(t)/E_|0)|0}var ul=64,dl=4194304;function Xs(t){switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return t&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return t}}function nc(t,e){var r=t.pendingLanes;if(r===0)return 0;var n=0,i=t.suspendedLanes,o=t.pingedLanes,s=r&268435455;if(s!==0){var a=s&~i;a!==0?n=Xs(a):(o&=s,o!==0&&(n=Xs(o)))}else s=r&~i,s!==0?n=Xs(s):o!==0&&(n=Xs(o));if(n===0)return 0;if(e!==0&&e!==n&&!(e&i)&&(i=n&-n,o=e&-e,i>=o||i===16&&(o&4194240)!==0))return e;if(n&4&&(n|=r&16),e=t.entangledLanes,e!==0)for(t=t.entanglements,e&=n;0<e;)r=31-zr(e),i=1<<r,n|=t[r],e&=~i;return n}function T_(t,e){switch(t){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function N_(t,e){for(var r=t.suspendedLanes,n=t.pingedLanes,i=t.expirationTimes,o=t.pendingLanes;0<o;){var s=31-zr(o),a=1<<s,l=i[s];l===-1?(!(a&r)||a&n)&&(i[s]=T_(a,e)):l<=e&&(t.expiredLanes|=a),o&=~a}}function Gd(t){return t=t.pendingLanes&-1073741825,t!==0?t:t&1073741824?1073741824:0}function Cy(){var t=ul;return ul<<=1,!(ul&4194240)&&(ul=64),t}function Ru(t){for(var e=[],r=0;31>r;r++)e.push(t);return e}function za(t,e,r){t.pendingLanes|=e,e!==536870912&&(t.suspendedLanes=0,t.pingedLanes=0),t=t.eventTimes,e=31-zr(e),t[e]=r}function O_(t,e){var r=t.pendingLanes&~e;t.pendingLanes=e,t.suspendedLanes=0,t.pingedLanes=0,t.expiredLanes&=e,t.mutableReadLanes&=e,t.entangledLanes&=e,e=t.entanglements;var n=t.eventTimes;for(t=t.expirationTimes;0<r;){var i=31-zr(r),o=1<<i;e[i]=0,n[i]=-1,t[i]=-1,r&=~o}}function sf(t,e){var r=t.entangledLanes|=e;for(t=t.entanglements;r;){var n=31-zr(r),i=1<<n;i&e|t[n]&e&&(t[n]|=e),r&=~i}}var Je=0;function Ty(t){return t&=-t,1<t?4<t?t&268435455?16:536870912:4:1}var Ny,af,Oy,Ry,Ay,Wd=!1,hl=[],Gn=null,Wn=null,Vn=null,ya=new Map,ba=new Map,Ln=[],R_="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function hg(t,e){switch(t){case"focusin":case"focusout":Gn=null;break;case"dragenter":case"dragleave":Wn=null;break;case"mouseover":case"mouseout":Vn=null;break;case"pointerover":case"pointerout":ya.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":ba.delete(e.pointerId)}}function Ms(t,e,r,n,i,o){return t===null||t.nativeEvent!==o?(t={blockedOn:e,domEventName:r,eventSystemFlags:n,nativeEvent:o,targetContainers:[i]},e!==null&&(e=Ba(e),e!==null&&af(e)),t):(t.eventSystemFlags|=n,e=t.targetContainers,i!==null&&e.indexOf(i)===-1&&e.push(i),t)}function A_(t,e,r,n,i){switch(e){case"focusin":return Gn=Ms(Gn,t,e,r,n,i),!0;case"dragenter":return Wn=Ms(Wn,t,e,r,n,i),!0;case"mouseover":return Vn=Ms(Vn,t,e,r,n,i),!0;case"pointerover":var o=i.pointerId;return ya.set(o,Ms(ya.get(o)||null,t,e,r,n,i)),!0;case"gotpointercapture":return o=i.pointerId,ba.set(o,Ms(ba.get(o)||null,t,e,r,n,i)),!0}return!1}function Py(t){var e=Ci(t.target);if(e!==null){var r=Hi(e);if(r!==null){if(e=r.tag,e===13){if(e=wy(r),e!==null){t.blockedOn=e,Ay(t.priority,function(){Oy(r)});return}}else if(e===3&&r.stateNode.current.memoizedState.isDehydrated){t.blockedOn=r.tag===3?r.stateNode.containerInfo:null;return}}}t.blockedOn=null}function Ul(t){if(t.blockedOn!==null)return!1;for(var e=t.targetContainers;0<e.length;){var r=Vd(t.domEventName,t.eventSystemFlags,e[0],t.nativeEvent);if(r===null){r=t.nativeEvent;var n=new r.constructor(r.type,r);Fd=n,r.target.dispatchEvent(n),Fd=null}else return e=Ba(r),e!==null&&af(e),t.blockedOn=r,!1;e.shift()}return!0}function fg(t,e,r){Ul(t)&&r.delete(e)}function P_(){Wd=!1,Gn!==null&&Ul(Gn)&&(Gn=null),Wn!==null&&Ul(Wn)&&(Wn=null),Vn!==null&&Ul(Vn)&&(Vn=null),ya.forEach(fg),ba.forEach(fg)}function Ds(t,e){t.blockedOn===e&&(t.blockedOn=null,Wd||(Wd=!0,gr.unstable_scheduleCallback(gr.unstable_NormalPriority,P_)))}function xa(t){function e(i){return Ds(i,t)}if(0<hl.length){Ds(hl[0],t);for(var r=1;r<hl.length;r++){var n=hl[r];n.blockedOn===t&&(n.blockedOn=null)}}for(Gn!==null&&Ds(Gn,t),Wn!==null&&Ds(Wn,t),Vn!==null&&Ds(Vn,t),ya.forEach(e),ba.forEach(e),r=0;r<Ln.length;r++)n=Ln[r],n.blockedOn===t&&(n.blockedOn=null);for(;0<Ln.length&&(r=Ln[0],r.blockedOn===null);)Py(r),r.blockedOn===null&&Ln.shift()}var Ko=Sn.ReactCurrentBatchConfig,ic=!0;function $_(t,e,r,n){var i=Je,o=Ko.transition;Ko.transition=null;try{Je=1,lf(t,e,r,n)}finally{Je=i,Ko.transition=o}}function I_(t,e,r,n){var i=Je,o=Ko.transition;Ko.transition=null;try{Je=4,lf(t,e,r,n)}finally{Je=i,Ko.transition=o}}function lf(t,e,r,n){if(ic){var i=Vd(t,e,r,n);if(i===null)Bu(t,e,n,oc,r),hg(t,n);else if(A_(i,t,e,r,n))n.stopPropagation();else if(hg(t,n),e&4&&-1<R_.indexOf(t)){for(;i!==null;){var o=Ba(i);if(o!==null&&Ny(o),o=Vd(t,e,r,n),o===null&&Bu(t,e,n,oc,r),o===i)break;i=o}i!==null&&n.stopPropagation()}else Bu(t,e,n,null,r)}}var oc=null;function Vd(t,e,r,n){if(oc=null,t=nf(n),t=Ci(t),t!==null)if(e=Hi(t),e===null)t=null;else if(r=e.tag,r===13){if(t=wy(e),t!==null)return t;t=null}else if(r===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;t=null}else e!==t&&(t=null);return oc=t,null}function $y(t){switch(t){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(__()){case of:return 1;case jy:return 4;case rc:case S_:return 16;case Ey:return 536870912;default:return 16}default:return 16}}var Un=null,cf=null,Hl=null;function Iy(){if(Hl)return Hl;var t,e=cf,r=e.length,n,i="value"in Un?Un.value:Un.textContent,o=i.length;for(t=0;t<r&&e[t]===i[t];t++);var s=r-t;for(n=1;n<=s&&e[r-n]===i[o-n];n++);return Hl=i.slice(t,1<n?1-n:void 0)}function Gl(t){var e=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&e===13&&(t=13)):t=e,t===10&&(t=13),32<=t||t===13?t:0}function fl(){return!0}function pg(){return!1}function yr(t){function e(r,n,i,o,s){this._reactName=r,this._targetInst=i,this.type=n,this.nativeEvent=o,this.target=s,this.currentTarget=null;for(var a in t)t.hasOwnProperty(a)&&(r=t[a],this[a]=r?r(o):o[a]);return this.isDefaultPrevented=(o.defaultPrevented!=null?o.defaultPrevented:o.returnValue===!1)?fl:pg,this.isPropagationStopped=pg,this}return yt(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var r=this.nativeEvent;r&&(r.preventDefault?r.preventDefault():typeof r.returnValue!="unknown"&&(r.returnValue=!1),this.isDefaultPrevented=fl)},stopPropagation:function(){var r=this.nativeEvent;r&&(r.stopPropagation?r.stopPropagation():typeof r.cancelBubble!="unknown"&&(r.cancelBubble=!0),this.isPropagationStopped=fl)},persist:function(){},isPersistent:fl}),e}var as={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},uf=yr(as),Fa=yt({},as,{view:0,detail:0}),M_=yr(Fa),Au,Pu,Ls,Uc=yt({},Fa,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:df,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==Ls&&(Ls&&t.type==="mousemove"?(Au=t.screenX-Ls.screenX,Pu=t.screenY-Ls.screenY):Pu=Au=0,Ls=t),Au)},movementY:function(t){return"movementY"in t?t.movementY:Pu}}),gg=yr(Uc),D_=yt({},Uc,{dataTransfer:0}),L_=yr(D_),z_=yt({},Fa,{relatedTarget:0}),$u=yr(z_),F_=yt({},as,{animationName:0,elapsedTime:0,pseudoElement:0}),B_=yr(F_),U_=yt({},as,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),H_=yr(U_),G_=yt({},as,{data:0}),mg=yr(G_),W_={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},V_={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},q_={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function K_(t){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(t):(t=q_[t])?!!e[t]:!1}function df(){return K_}var Y_=yt({},Fa,{key:function(t){if(t.key){var e=W_[t.key]||t.key;if(e!=="Unidentified")return e}return t.type==="keypress"?(t=Gl(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?V_[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:df,charCode:function(t){return t.type==="keypress"?Gl(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?Gl(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),X_=yr(Y_),Z_=yt({},Uc,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),vg=yr(Z_),J_=yt({},Fa,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:df}),Q_=yr(J_),e2=yt({},as,{propertyName:0,elapsedTime:0,pseudoElement:0}),t2=yr(e2),r2=yt({},Uc,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),n2=yr(r2),i2=[9,13,27,32],hf=bn&&"CompositionEvent"in window,ia=null;bn&&"documentMode"in document&&(ia=document.documentMode);var o2=bn&&"TextEvent"in window&&!ia,My=bn&&(!hf||ia&&8<ia&&11>=ia),yg=" ",bg=!1;function Dy(t,e){switch(t){case"keyup":return i2.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Ly(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var $o=!1;function s2(t,e){switch(t){case"compositionend":return Ly(e);case"keypress":return e.which!==32?null:(bg=!0,yg);case"textInput":return t=e.data,t===yg&&bg?null:t;default:return null}}function a2(t,e){if($o)return t==="compositionend"||!hf&&Dy(t,e)?(t=Iy(),Hl=cf=Un=null,$o=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return My&&e.locale!=="ko"?null:e.data;default:return null}}var l2={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function xg(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e==="input"?!!l2[t.type]:e==="textarea"}function zy(t,e,r,n){my(n),e=sc(e,"onChange"),0<e.length&&(r=new uf("onChange","change",null,r,n),t.push({event:r,listeners:e}))}var oa=null,wa=null;function c2(t){Xy(t,0)}function Hc(t){var e=Do(t);if(cy(e))return t}function u2(t,e){if(t==="change")return e}var Fy=!1;if(bn){var Iu;if(bn){var Mu="oninput"in document;if(!Mu){var wg=document.createElement("div");wg.setAttribute("oninput","return;"),Mu=typeof wg.oninput=="function"}Iu=Mu}else Iu=!1;Fy=Iu&&(!document.documentMode||9<document.documentMode)}function _g(){oa&&(oa.detachEvent("onpropertychange",By),wa=oa=null)}function By(t){if(t.propertyName==="value"&&Hc(wa)){var e=[];zy(e,wa,t,nf(t)),xy(c2,e)}}function d2(t,e,r){t==="focusin"?(_g(),oa=e,wa=r,oa.attachEvent("onpropertychange",By)):t==="focusout"&&_g()}function h2(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return Hc(wa)}function f2(t,e){if(t==="click")return Hc(e)}function p2(t,e){if(t==="input"||t==="change")return Hc(e)}function g2(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var Br=typeof Object.is=="function"?Object.is:g2;function _a(t,e){if(Br(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;var r=Object.keys(t),n=Object.keys(e);if(r.length!==n.length)return!1;for(n=0;n<r.length;n++){var i=r[n];if(!Td.call(e,i)||!Br(t[i],e[i]))return!1}return!0}function Sg(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function kg(t,e){var r=Sg(t);t=0;for(var n;r;){if(r.nodeType===3){if(n=t+r.textContent.length,t<=e&&n>=e)return{node:r,offset:e-t};t=n}e:{for(;r;){if(r.nextSibling){r=r.nextSibling;break e}r=r.parentNode}r=void 0}r=Sg(r)}}function Uy(t,e){return t&&e?t===e?!0:t&&t.nodeType===3?!1:e&&e.nodeType===3?Uy(t,e.parentNode):"contains"in t?t.contains(e):t.compareDocumentPosition?!!(t.compareDocumentPosition(e)&16):!1:!1}function Hy(){for(var t=window,e=Ql();e instanceof t.HTMLIFrameElement;){try{var r=typeof e.contentWindow.location.href=="string"}catch{r=!1}if(r)t=e.contentWindow;else break;e=Ql(t.document)}return e}function ff(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e&&(e==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||e==="textarea"||t.contentEditable==="true")}function m2(t){var e=Hy(),r=t.focusedElem,n=t.selectionRange;if(e!==r&&r&&r.ownerDocument&&Uy(r.ownerDocument.documentElement,r)){if(n!==null&&ff(r)){if(e=n.start,t=n.end,t===void 0&&(t=e),"selectionStart"in r)r.selectionStart=e,r.selectionEnd=Math.min(t,r.value.length);else if(t=(e=r.ownerDocument||document)&&e.defaultView||window,t.getSelection){t=t.getSelection();var i=r.textContent.length,o=Math.min(n.start,i);n=n.end===void 0?o:Math.min(n.end,i),!t.extend&&o>n&&(i=n,n=o,o=i),i=kg(r,o);var s=kg(r,n);i&&s&&(t.rangeCount!==1||t.anchorNode!==i.node||t.anchorOffset!==i.offset||t.focusNode!==s.node||t.focusOffset!==s.offset)&&(e=e.createRange(),e.setStart(i.node,i.offset),t.removeAllRanges(),o>n?(t.addRange(e),t.extend(s.node,s.offset)):(e.setEnd(s.node,s.offset),t.addRange(e)))}}for(e=[],t=r;t=t.parentNode;)t.nodeType===1&&e.push({element:t,left:t.scrollLeft,top:t.scrollTop});for(typeof r.focus=="function"&&r.focus(),r=0;r<e.length;r++)t=e[r],t.element.scrollLeft=t.left,t.element.scrollTop=t.top}}var v2=bn&&"documentMode"in document&&11>=document.documentMode,Io=null,qd=null,sa=null,Kd=!1;function jg(t,e,r){var n=r.window===r?r.document:r.nodeType===9?r:r.ownerDocument;Kd||Io==null||Io!==Ql(n)||(n=Io,"selectionStart"in n&&ff(n)?n={start:n.selectionStart,end:n.selectionEnd}:(n=(n.ownerDocument&&n.ownerDocument.defaultView||window).getSelection(),n={anchorNode:n.anchorNode,anchorOffset:n.anchorOffset,focusNode:n.focusNode,focusOffset:n.focusOffset}),sa&&_a(sa,n)||(sa=n,n=sc(qd,"onSelect"),0<n.length&&(e=new uf("onSelect","select",null,e,r),t.push({event:e,listeners:n}),e.target=Io)))}function pl(t,e){var r={};return r[t.toLowerCase()]=e.toLowerCase(),r["Webkit"+t]="webkit"+e,r["Moz"+t]="moz"+e,r}var Mo={animationend:pl("Animation","AnimationEnd"),animationiteration:pl("Animation","AnimationIteration"),animationstart:pl("Animation","AnimationStart"),transitionend:pl("Transition","TransitionEnd")},Du={},Gy={};bn&&(Gy=document.createElement("div").style,"AnimationEvent"in window||(delete Mo.animationend.animation,delete Mo.animationiteration.animation,delete Mo.animationstart.animation),"TransitionEvent"in window||delete Mo.transitionend.transition);function Gc(t){if(Du[t])return Du[t];if(!Mo[t])return t;var e=Mo[t],r;for(r in e)if(e.hasOwnProperty(r)&&r in Gy)return Du[t]=e[r];return t}var Wy=Gc("animationend"),Vy=Gc("animationiteration"),qy=Gc("animationstart"),Ky=Gc("transitionend"),Yy=new Map,Eg="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function ri(t,e){Yy.set(t,e),Ui(e,[t])}for(var Lu=0;Lu<Eg.length;Lu++){var zu=Eg[Lu],y2=zu.toLowerCase(),b2=zu[0].toUpperCase()+zu.slice(1);ri(y2,"on"+b2)}ri(Wy,"onAnimationEnd");ri(Vy,"onAnimationIteration");ri(qy,"onAnimationStart");ri("dblclick","onDoubleClick");ri("focusin","onFocus");ri("focusout","onBlur");ri(Ky,"onTransitionEnd");Jo("onMouseEnter",["mouseout","mouseover"]);Jo("onMouseLeave",["mouseout","mouseover"]);Jo("onPointerEnter",["pointerout","pointerover"]);Jo("onPointerLeave",["pointerout","pointerover"]);Ui("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Ui("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Ui("onBeforeInput",["compositionend","keypress","textInput","paste"]);Ui("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Ui("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Ui("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Zs="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),x2=new Set("cancel close invalid load scroll toggle".split(" ").concat(Zs));function Cg(t,e,r){var n=t.type||"unknown-event";t.currentTarget=r,y_(n,e,void 0,t),t.currentTarget=null}function Xy(t,e){e=(e&4)!==0;for(var r=0;r<t.length;r++){var n=t[r],i=n.event;n=n.listeners;e:{var o=void 0;if(e)for(var s=n.length-1;0<=s;s--){var a=n[s],l=a.instance,u=a.currentTarget;if(a=a.listener,l!==o&&i.isPropagationStopped())break e;Cg(i,a,u),o=l}else for(s=0;s<n.length;s++){if(a=n[s],l=a.instance,u=a.currentTarget,a=a.listener,l!==o&&i.isPropagationStopped())break e;Cg(i,a,u),o=l}}}if(tc)throw t=Hd,tc=!1,Hd=null,t}function ot(t,e){var r=e[Qd];r===void 0&&(r=e[Qd]=new Set);var n=t+"__bubble";r.has(n)||(Zy(e,t,2,!1),r.add(n))}function Fu(t,e,r){var n=0;e&&(n|=4),Zy(r,t,n,e)}var gl="_reactListening"+Math.random().toString(36).slice(2);function Sa(t){if(!t[gl]){t[gl]=!0,iy.forEach(function(r){r!=="selectionchange"&&(x2.has(r)||Fu(r,!1,t),Fu(r,!0,t))});var e=t.nodeType===9?t:t.ownerDocument;e===null||e[gl]||(e[gl]=!0,Fu("selectionchange",!1,e))}}function Zy(t,e,r,n){switch($y(e)){case 1:var i=$_;break;case 4:i=I_;break;default:i=lf}r=i.bind(null,e,r,t),i=void 0,!Ud||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(i=!0),n?i!==void 0?t.addEventListener(e,r,{capture:!0,passive:i}):t.addEventListener(e,r,!0):i!==void 0?t.addEventListener(e,r,{passive:i}):t.addEventListener(e,r,!1)}function Bu(t,e,r,n,i){var o=n;if(!(e&1)&&!(e&2)&&n!==null)e:for(;;){if(n===null)return;var s=n.tag;if(s===3||s===4){var a=n.stateNode.containerInfo;if(a===i||a.nodeType===8&&a.parentNode===i)break;if(s===4)for(s=n.return;s!==null;){var l=s.tag;if((l===3||l===4)&&(l=s.stateNode.containerInfo,l===i||l.nodeType===8&&l.parentNode===i))return;s=s.return}for(;a!==null;){if(s=Ci(a),s===null)return;if(l=s.tag,l===5||l===6){n=o=s;continue e}a=a.parentNode}}n=n.return}xy(function(){var u=o,d=nf(r),h=[];e:{var f=Yy.get(t);if(f!==void 0){var p=uf,v=t;switch(t){case"keypress":if(Gl(r)===0)break e;case"keydown":case"keyup":p=X_;break;case"focusin":v="focus",p=$u;break;case"focusout":v="blur",p=$u;break;case"beforeblur":case"afterblur":p=$u;break;case"click":if(r.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":p=gg;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":p=L_;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":p=Q_;break;case Wy:case Vy:case qy:p=B_;break;case Ky:p=t2;break;case"scroll":p=M_;break;case"wheel":p=n2;break;case"copy":case"cut":case"paste":p=H_;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":p=vg}var g=(e&4)!==0,b=!g&&t==="scroll",m=g?f!==null?f+"Capture":null:f;g=[];for(var y=u,x;y!==null;){x=y;var w=x.stateNode;if(x.tag===5&&w!==null&&(x=w,m!==null&&(w=va(y,m),w!=null&&g.push(ka(y,w,x)))),b)break;y=y.return}0<g.length&&(f=new p(f,v,null,r,d),h.push({event:f,listeners:g}))}}if(!(e&7)){e:{if(f=t==="mouseover"||t==="pointerover",p=t==="mouseout"||t==="pointerout",f&&r!==Fd&&(v=r.relatedTarget||r.fromElement)&&(Ci(v)||v[xn]))break e;if((p||f)&&(f=d.window===d?d:(f=d.ownerDocument)?f.defaultView||f.parentWindow:window,p?(v=r.relatedTarget||r.toElement,p=u,v=v?Ci(v):null,v!==null&&(b=Hi(v),v!==b||v.tag!==5&&v.tag!==6)&&(v=null)):(p=null,v=u),p!==v)){if(g=gg,w="onMouseLeave",m="onMouseEnter",y="mouse",(t==="pointerout"||t==="pointerover")&&(g=vg,w="onPointerLeave",m="onPointerEnter",y="pointer"),b=p==null?f:Do(p),x=v==null?f:Do(v),f=new g(w,y+"leave",p,r,d),f.target=b,f.relatedTarget=x,w=null,Ci(d)===u&&(g=new g(m,y+"enter",v,r,d),g.target=x,g.relatedTarget=b,w=g),b=w,p&&v)t:{for(g=p,m=v,y=0,x=g;x;x=no(x))y++;for(x=0,w=m;w;w=no(w))x++;for(;0<y-x;)g=no(g),y--;for(;0<x-y;)m=no(m),x--;for(;y--;){if(g===m||m!==null&&g===m.alternate)break t;g=no(g),m=no(m)}g=null}else g=null;p!==null&&Tg(h,f,p,g,!1),v!==null&&b!==null&&Tg(h,b,v,g,!0)}}e:{if(f=u?Do(u):window,p=f.nodeName&&f.nodeName.toLowerCase(),p==="select"||p==="input"&&f.type==="file")var j=u2;else if(xg(f))if(Fy)j=p2;else{j=h2;var S=d2}else(p=f.nodeName)&&p.toLowerCase()==="input"&&(f.type==="checkbox"||f.type==="radio")&&(j=f2);if(j&&(j=j(t,u))){zy(h,j,r,d);break e}S&&S(t,f,u),t==="focusout"&&(S=f._wrapperState)&&S.controlled&&f.type==="number"&&Id(f,"number",f.value)}switch(S=u?Do(u):window,t){case"focusin":(xg(S)||S.contentEditable==="true")&&(Io=S,qd=u,sa=null);break;case"focusout":sa=qd=Io=null;break;case"mousedown":Kd=!0;break;case"contextmenu":case"mouseup":case"dragend":Kd=!1,jg(h,r,d);break;case"selectionchange":if(v2)break;case"keydown":case"keyup":jg(h,r,d)}var C;if(hf)e:{switch(t){case"compositionstart":var N="onCompositionStart";break e;case"compositionend":N="onCompositionEnd";break e;case"compositionupdate":N="onCompositionUpdate";break e}N=void 0}else $o?Dy(t,r)&&(N="onCompositionEnd"):t==="keydown"&&r.keyCode===229&&(N="onCompositionStart");N&&(My&&r.locale!=="ko"&&($o||N!=="onCompositionStart"?N==="onCompositionEnd"&&$o&&(C=Iy()):(Un=d,cf="value"in Un?Un.value:Un.textContent,$o=!0)),S=sc(u,N),0<S.length&&(N=new mg(N,t,null,r,d),h.push({event:N,listeners:S}),C?N.data=C:(C=Ly(r),C!==null&&(N.data=C)))),(C=o2?s2(t,r):a2(t,r))&&(u=sc(u,"onBeforeInput"),0<u.length&&(d=new mg("onBeforeInput","beforeinput",null,r,d),h.push({event:d,listeners:u}),d.data=C))}Xy(h,e)})}function ka(t,e,r){return{instance:t,listener:e,currentTarget:r}}function sc(t,e){for(var r=e+"Capture",n=[];t!==null;){var i=t,o=i.stateNode;i.tag===5&&o!==null&&(i=o,o=va(t,r),o!=null&&n.unshift(ka(t,o,i)),o=va(t,e),o!=null&&n.push(ka(t,o,i))),t=t.return}return n}function no(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5);return t||null}function Tg(t,e,r,n,i){for(var o=e._reactName,s=[];r!==null&&r!==n;){var a=r,l=a.alternate,u=a.stateNode;if(l!==null&&l===n)break;a.tag===5&&u!==null&&(a=u,i?(l=va(r,o),l!=null&&s.unshift(ka(r,l,a))):i||(l=va(r,o),l!=null&&s.push(ka(r,l,a)))),r=r.return}s.length!==0&&t.push({event:e,listeners:s})}var w2=/\r\n?/g,_2=/\u0000|\uFFFD/g;function Ng(t){return(typeof t=="string"?t:""+t).replace(w2,`
`).replace(_2,"")}function ml(t,e,r){if(e=Ng(e),Ng(t)!==e&&r)throw Error(le(425))}function ac(){}var Yd=null,Xd=null;function Zd(t,e){return t==="textarea"||t==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var Jd=typeof setTimeout=="function"?setTimeout:void 0,S2=typeof clearTimeout=="function"?clearTimeout:void 0,Og=typeof Promise=="function"?Promise:void 0,k2=typeof queueMicrotask=="function"?queueMicrotask:typeof Og<"u"?function(t){return Og.resolve(null).then(t).catch(j2)}:Jd;function j2(t){setTimeout(function(){throw t})}function Uu(t,e){var r=e,n=0;do{var i=r.nextSibling;if(t.removeChild(r),i&&i.nodeType===8)if(r=i.data,r==="/$"){if(n===0){t.removeChild(i),xa(e);return}n--}else r!=="$"&&r!=="$?"&&r!=="$!"||n++;r=i}while(r);xa(e)}function qn(t){for(;t!=null;t=t.nextSibling){var e=t.nodeType;if(e===1||e===3)break;if(e===8){if(e=t.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return t}function Rg(t){t=t.previousSibling;for(var e=0;t;){if(t.nodeType===8){var r=t.data;if(r==="$"||r==="$!"||r==="$?"){if(e===0)return t;e--}else r==="/$"&&e++}t=t.previousSibling}return null}var ls=Math.random().toString(36).slice(2),Xr="__reactFiber$"+ls,ja="__reactProps$"+ls,xn="__reactContainer$"+ls,Qd="__reactEvents$"+ls,E2="__reactListeners$"+ls,C2="__reactHandles$"+ls;function Ci(t){var e=t[Xr];if(e)return e;for(var r=t.parentNode;r;){if(e=r[xn]||r[Xr]){if(r=e.alternate,e.child!==null||r!==null&&r.child!==null)for(t=Rg(t);t!==null;){if(r=t[Xr])return r;t=Rg(t)}return e}t=r,r=t.parentNode}return null}function Ba(t){return t=t[Xr]||t[xn],!t||t.tag!==5&&t.tag!==6&&t.tag!==13&&t.tag!==3?null:t}function Do(t){if(t.tag===5||t.tag===6)return t.stateNode;throw Error(le(33))}function Wc(t){return t[ja]||null}var eh=[],Lo=-1;function ni(t){return{current:t}}function lt(t){0>Lo||(t.current=eh[Lo],eh[Lo]=null,Lo--)}function it(t,e){Lo++,eh[Lo]=t.current,t.current=e}var Qn={},Wt=ni(Qn),rr=ni(!1),Mi=Qn;function Qo(t,e){var r=t.type.contextTypes;if(!r)return Qn;var n=t.stateNode;if(n&&n.__reactInternalMemoizedUnmaskedChildContext===e)return n.__reactInternalMemoizedMaskedChildContext;var i={},o;for(o in r)i[o]=e[o];return n&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=e,t.__reactInternalMemoizedMaskedChildContext=i),i}function nr(t){return t=t.childContextTypes,t!=null}function lc(){lt(rr),lt(Wt)}function Ag(t,e,r){if(Wt.current!==Qn)throw Error(le(168));it(Wt,e),it(rr,r)}function Jy(t,e,r){var n=t.stateNode;if(e=e.childContextTypes,typeof n.getChildContext!="function")return r;n=n.getChildContext();for(var i in n)if(!(i in e))throw Error(le(108,d_(t)||"Unknown",i));return yt({},r,n)}function cc(t){return t=(t=t.stateNode)&&t.__reactInternalMemoizedMergedChildContext||Qn,Mi=Wt.current,it(Wt,t),it(rr,rr.current),!0}function Pg(t,e,r){var n=t.stateNode;if(!n)throw Error(le(169));r?(t=Jy(t,e,Mi),n.__reactInternalMemoizedMergedChildContext=t,lt(rr),lt(Wt),it(Wt,t)):lt(rr),it(rr,r)}var fn=null,Vc=!1,Hu=!1;function Qy(t){fn===null?fn=[t]:fn.push(t)}function T2(t){Vc=!0,Qy(t)}function ii(){if(!Hu&&fn!==null){Hu=!0;var t=0,e=Je;try{var r=fn;for(Je=1;t<r.length;t++){var n=r[t];do n=n(!0);while(n!==null)}fn=null,Vc=!1}catch(i){throw fn!==null&&(fn=fn.slice(t+1)),ky(of,ii),i}finally{Je=e,Hu=!1}}return null}var zo=[],Fo=0,uc=null,dc=0,br=[],xr=0,Di=null,pn=1,gn="";function wi(t,e){zo[Fo++]=dc,zo[Fo++]=uc,uc=t,dc=e}function eb(t,e,r){br[xr++]=pn,br[xr++]=gn,br[xr++]=Di,Di=t;var n=pn;t=gn;var i=32-zr(n)-1;n&=~(1<<i),r+=1;var o=32-zr(e)+i;if(30<o){var s=i-i%5;o=(n&(1<<s)-1).toString(32),n>>=s,i-=s,pn=1<<32-zr(e)+i|r<<i|n,gn=o+t}else pn=1<<o|r<<i|n,gn=t}function pf(t){t.return!==null&&(wi(t,1),eb(t,1,0))}function gf(t){for(;t===uc;)uc=zo[--Fo],zo[Fo]=null,dc=zo[--Fo],zo[Fo]=null;for(;t===Di;)Di=br[--xr],br[xr]=null,gn=br[--xr],br[xr]=null,pn=br[--xr],br[xr]=null}var pr=null,dr=null,pt=!1,Dr=null;function tb(t,e){var r=_r(5,null,null,0);r.elementType="DELETED",r.stateNode=e,r.return=t,e=t.deletions,e===null?(t.deletions=[r],t.flags|=16):e.push(r)}function $g(t,e){switch(t.tag){case 5:var r=t.type;return e=e.nodeType!==1||r.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(t.stateNode=e,pr=t,dr=qn(e.firstChild),!0):!1;case 6:return e=t.pendingProps===""||e.nodeType!==3?null:e,e!==null?(t.stateNode=e,pr=t,dr=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(r=Di!==null?{id:pn,overflow:gn}:null,t.memoizedState={dehydrated:e,treeContext:r,retryLane:1073741824},r=_r(18,null,null,0),r.stateNode=e,r.return=t,t.child=r,pr=t,dr=null,!0):!1;default:return!1}}function th(t){return(t.mode&1)!==0&&(t.flags&128)===0}function rh(t){if(pt){var e=dr;if(e){var r=e;if(!$g(t,e)){if(th(t))throw Error(le(418));e=qn(r.nextSibling);var n=pr;e&&$g(t,e)?tb(n,r):(t.flags=t.flags&-4097|2,pt=!1,pr=t)}}else{if(th(t))throw Error(le(418));t.flags=t.flags&-4097|2,pt=!1,pr=t}}}function Ig(t){for(t=t.return;t!==null&&t.tag!==5&&t.tag!==3&&t.tag!==13;)t=t.return;pr=t}function vl(t){if(t!==pr)return!1;if(!pt)return Ig(t),pt=!0,!1;var e;if((e=t.tag!==3)&&!(e=t.tag!==5)&&(e=t.type,e=e!=="head"&&e!=="body"&&!Zd(t.type,t.memoizedProps)),e&&(e=dr)){if(th(t))throw rb(),Error(le(418));for(;e;)tb(t,e),e=qn(e.nextSibling)}if(Ig(t),t.tag===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(le(317));e:{for(t=t.nextSibling,e=0;t;){if(t.nodeType===8){var r=t.data;if(r==="/$"){if(e===0){dr=qn(t.nextSibling);break e}e--}else r!=="$"&&r!=="$!"&&r!=="$?"||e++}t=t.nextSibling}dr=null}}else dr=pr?qn(t.stateNode.nextSibling):null;return!0}function rb(){for(var t=dr;t;)t=qn(t.nextSibling)}function es(){dr=pr=null,pt=!1}function mf(t){Dr===null?Dr=[t]:Dr.push(t)}var N2=Sn.ReactCurrentBatchConfig;function zs(t,e,r){if(t=r.ref,t!==null&&typeof t!="function"&&typeof t!="object"){if(r._owner){if(r=r._owner,r){if(r.tag!==1)throw Error(le(309));var n=r.stateNode}if(!n)throw Error(le(147,t));var i=n,o=""+t;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===o?e.ref:(e=function(s){var a=i.refs;s===null?delete a[o]:a[o]=s},e._stringRef=o,e)}if(typeof t!="string")throw Error(le(284));if(!r._owner)throw Error(le(290,t))}return t}function yl(t,e){throw t=Object.prototype.toString.call(e),Error(le(31,t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t))}function Mg(t){var e=t._init;return e(t._payload)}function nb(t){function e(m,y){if(t){var x=m.deletions;x===null?(m.deletions=[y],m.flags|=16):x.push(y)}}function r(m,y){if(!t)return null;for(;y!==null;)e(m,y),y=y.sibling;return null}function n(m,y){for(m=new Map;y!==null;)y.key!==null?m.set(y.key,y):m.set(y.index,y),y=y.sibling;return m}function i(m,y){return m=Zn(m,y),m.index=0,m.sibling=null,m}function o(m,y,x){return m.index=x,t?(x=m.alternate,x!==null?(x=x.index,x<y?(m.flags|=2,y):x):(m.flags|=2,y)):(m.flags|=1048576,y)}function s(m){return t&&m.alternate===null&&(m.flags|=2),m}function a(m,y,x,w){return y===null||y.tag!==6?(y=Xu(x,m.mode,w),y.return=m,y):(y=i(y,x),y.return=m,y)}function l(m,y,x,w){var j=x.type;return j===Po?d(m,y,x.props.children,w,x.key):y!==null&&(y.elementType===j||typeof j=="object"&&j!==null&&j.$$typeof===In&&Mg(j)===y.type)?(w=i(y,x.props),w.ref=zs(m,y,x),w.return=m,w):(w=Zl(x.type,x.key,x.props,null,m.mode,w),w.ref=zs(m,y,x),w.return=m,w)}function u(m,y,x,w){return y===null||y.tag!==4||y.stateNode.containerInfo!==x.containerInfo||y.stateNode.implementation!==x.implementation?(y=Zu(x,m.mode,w),y.return=m,y):(y=i(y,x.children||[]),y.return=m,y)}function d(m,y,x,w,j){return y===null||y.tag!==7?(y=Pi(x,m.mode,w,j),y.return=m,y):(y=i(y,x),y.return=m,y)}function h(m,y,x){if(typeof y=="string"&&y!==""||typeof y=="number")return y=Xu(""+y,m.mode,x),y.return=m,y;if(typeof y=="object"&&y!==null){switch(y.$$typeof){case al:return x=Zl(y.type,y.key,y.props,null,m.mode,x),x.ref=zs(m,null,y),x.return=m,x;case Ao:return y=Zu(y,m.mode,x),y.return=m,y;case In:var w=y._init;return h(m,w(y._payload),x)}if(Ys(y)||$s(y))return y=Pi(y,m.mode,x,null),y.return=m,y;yl(m,y)}return null}function f(m,y,x,w){var j=y!==null?y.key:null;if(typeof x=="string"&&x!==""||typeof x=="number")return j!==null?null:a(m,y,""+x,w);if(typeof x=="object"&&x!==null){switch(x.$$typeof){case al:return x.key===j?l(m,y,x,w):null;case Ao:return x.key===j?u(m,y,x,w):null;case In:return j=x._init,f(m,y,j(x._payload),w)}if(Ys(x)||$s(x))return j!==null?null:d(m,y,x,w,null);yl(m,x)}return null}function p(m,y,x,w,j){if(typeof w=="string"&&w!==""||typeof w=="number")return m=m.get(x)||null,a(y,m,""+w,j);if(typeof w=="object"&&w!==null){switch(w.$$typeof){case al:return m=m.get(w.key===null?x:w.key)||null,l(y,m,w,j);case Ao:return m=m.get(w.key===null?x:w.key)||null,u(y,m,w,j);case In:var S=w._init;return p(m,y,x,S(w._payload),j)}if(Ys(w)||$s(w))return m=m.get(x)||null,d(y,m,w,j,null);yl(y,w)}return null}function v(m,y,x,w){for(var j=null,S=null,C=y,N=y=0,E=null;C!==null&&N<x.length;N++){C.index>N?(E=C,C=null):E=C.sibling;var A=f(m,C,x[N],w);if(A===null){C===null&&(C=E);break}t&&C&&A.alternate===null&&e(m,C),y=o(A,y,N),S===null?j=A:S.sibling=A,S=A,C=E}if(N===x.length)return r(m,C),pt&&wi(m,N),j;if(C===null){for(;N<x.length;N++)C=h(m,x[N],w),C!==null&&(y=o(C,y,N),S===null?j=C:S.sibling=C,S=C);return pt&&wi(m,N),j}for(C=n(m,C);N<x.length;N++)E=p(C,m,N,x[N],w),E!==null&&(t&&E.alternate!==null&&C.delete(E.key===null?N:E.key),y=o(E,y,N),S===null?j=E:S.sibling=E,S=E);return t&&C.forEach(function(U){return e(m,U)}),pt&&wi(m,N),j}function g(m,y,x,w){var j=$s(x);if(typeof j!="function")throw Error(le(150));if(x=j.call(x),x==null)throw Error(le(151));for(var S=j=null,C=y,N=y=0,E=null,A=x.next();C!==null&&!A.done;N++,A=x.next()){C.index>N?(E=C,C=null):E=C.sibling;var U=f(m,C,A.value,w);if(U===null){C===null&&(C=E);break}t&&C&&U.alternate===null&&e(m,C),y=o(U,y,N),S===null?j=U:S.sibling=U,S=U,C=E}if(A.done)return r(m,C),pt&&wi(m,N),j;if(C===null){for(;!A.done;N++,A=x.next())A=h(m,A.value,w),A!==null&&(y=o(A,y,N),S===null?j=A:S.sibling=A,S=A);return pt&&wi(m,N),j}for(C=n(m,C);!A.done;N++,A=x.next())A=p(C,m,N,A.value,w),A!==null&&(t&&A.alternate!==null&&C.delete(A.key===null?N:A.key),y=o(A,y,N),S===null?j=A:S.sibling=A,S=A);return t&&C.forEach(function(O){return e(m,O)}),pt&&wi(m,N),j}function b(m,y,x,w){if(typeof x=="object"&&x!==null&&x.type===Po&&x.key===null&&(x=x.props.children),typeof x=="object"&&x!==null){switch(x.$$typeof){case al:e:{for(var j=x.key,S=y;S!==null;){if(S.key===j){if(j=x.type,j===Po){if(S.tag===7){r(m,S.sibling),y=i(S,x.props.children),y.return=m,m=y;break e}}else if(S.elementType===j||typeof j=="object"&&j!==null&&j.$$typeof===In&&Mg(j)===S.type){r(m,S.sibling),y=i(S,x.props),y.ref=zs(m,S,x),y.return=m,m=y;break e}r(m,S);break}else e(m,S);S=S.sibling}x.type===Po?(y=Pi(x.props.children,m.mode,w,x.key),y.return=m,m=y):(w=Zl(x.type,x.key,x.props,null,m.mode,w),w.ref=zs(m,y,x),w.return=m,m=w)}return s(m);case Ao:e:{for(S=x.key;y!==null;){if(y.key===S)if(y.tag===4&&y.stateNode.containerInfo===x.containerInfo&&y.stateNode.implementation===x.implementation){r(m,y.sibling),y=i(y,x.children||[]),y.return=m,m=y;break e}else{r(m,y);break}else e(m,y);y=y.sibling}y=Zu(x,m.mode,w),y.return=m,m=y}return s(m);case In:return S=x._init,b(m,y,S(x._payload),w)}if(Ys(x))return v(m,y,x,w);if($s(x))return g(m,y,x,w);yl(m,x)}return typeof x=="string"&&x!==""||typeof x=="number"?(x=""+x,y!==null&&y.tag===6?(r(m,y.sibling),y=i(y,x),y.return=m,m=y):(r(m,y),y=Xu(x,m.mode,w),y.return=m,m=y),s(m)):r(m,y)}return b}var ts=nb(!0),ib=nb(!1),hc=ni(null),fc=null,Bo=null,vf=null;function yf(){vf=Bo=fc=null}function bf(t){var e=hc.current;lt(hc),t._currentValue=e}function nh(t,e,r){for(;t!==null;){var n=t.alternate;if((t.childLanes&e)!==e?(t.childLanes|=e,n!==null&&(n.childLanes|=e)):n!==null&&(n.childLanes&e)!==e&&(n.childLanes|=e),t===r)break;t=t.return}}function Yo(t,e){fc=t,vf=Bo=null,t=t.dependencies,t!==null&&t.firstContext!==null&&(t.lanes&e&&(tr=!0),t.firstContext=null)}function kr(t){var e=t._currentValue;if(vf!==t)if(t={context:t,memoizedValue:e,next:null},Bo===null){if(fc===null)throw Error(le(308));Bo=t,fc.dependencies={lanes:0,firstContext:t}}else Bo=Bo.next=t;return e}var Ti=null;function xf(t){Ti===null?Ti=[t]:Ti.push(t)}function ob(t,e,r,n){var i=e.interleaved;return i===null?(r.next=r,xf(e)):(r.next=i.next,i.next=r),e.interleaved=r,wn(t,n)}function wn(t,e){t.lanes|=e;var r=t.alternate;for(r!==null&&(r.lanes|=e),r=t,t=t.return;t!==null;)t.childLanes|=e,r=t.alternate,r!==null&&(r.childLanes|=e),r=t,t=t.return;return r.tag===3?r.stateNode:null}var Mn=!1;function wf(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function sb(t,e){t=t.updateQueue,e.updateQueue===t&&(e.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,effects:t.effects})}function vn(t,e){return{eventTime:t,lane:e,tag:0,payload:null,callback:null,next:null}}function Kn(t,e,r){var n=t.updateQueue;if(n===null)return null;if(n=n.shared,Ve&2){var i=n.pending;return i===null?e.next=e:(e.next=i.next,i.next=e),n.pending=e,wn(t,r)}return i=n.interleaved,i===null?(e.next=e,xf(n)):(e.next=i.next,i.next=e),n.interleaved=e,wn(t,r)}function Wl(t,e,r){if(e=e.updateQueue,e!==null&&(e=e.shared,(r&4194240)!==0)){var n=e.lanes;n&=t.pendingLanes,r|=n,e.lanes=r,sf(t,r)}}function Dg(t,e){var r=t.updateQueue,n=t.alternate;if(n!==null&&(n=n.updateQueue,r===n)){var i=null,o=null;if(r=r.firstBaseUpdate,r!==null){do{var s={eventTime:r.eventTime,lane:r.lane,tag:r.tag,payload:r.payload,callback:r.callback,next:null};o===null?i=o=s:o=o.next=s,r=r.next}while(r!==null);o===null?i=o=e:o=o.next=e}else i=o=e;r={baseState:n.baseState,firstBaseUpdate:i,lastBaseUpdate:o,shared:n.shared,effects:n.effects},t.updateQueue=r;return}t=r.lastBaseUpdate,t===null?r.firstBaseUpdate=e:t.next=e,r.lastBaseUpdate=e}function pc(t,e,r,n){var i=t.updateQueue;Mn=!1;var o=i.firstBaseUpdate,s=i.lastBaseUpdate,a=i.shared.pending;if(a!==null){i.shared.pending=null;var l=a,u=l.next;l.next=null,s===null?o=u:s.next=u,s=l;var d=t.alternate;d!==null&&(d=d.updateQueue,a=d.lastBaseUpdate,a!==s&&(a===null?d.firstBaseUpdate=u:a.next=u,d.lastBaseUpdate=l))}if(o!==null){var h=i.baseState;s=0,d=u=l=null,a=o;do{var f=a.lane,p=a.eventTime;if((n&f)===f){d!==null&&(d=d.next={eventTime:p,lane:0,tag:a.tag,payload:a.payload,callback:a.callback,next:null});e:{var v=t,g=a;switch(f=e,p=r,g.tag){case 1:if(v=g.payload,typeof v=="function"){h=v.call(p,h,f);break e}h=v;break e;case 3:v.flags=v.flags&-65537|128;case 0:if(v=g.payload,f=typeof v=="function"?v.call(p,h,f):v,f==null)break e;h=yt({},h,f);break e;case 2:Mn=!0}}a.callback!==null&&a.lane!==0&&(t.flags|=64,f=i.effects,f===null?i.effects=[a]:f.push(a))}else p={eventTime:p,lane:f,tag:a.tag,payload:a.payload,callback:a.callback,next:null},d===null?(u=d=p,l=h):d=d.next=p,s|=f;if(a=a.next,a===null){if(a=i.shared.pending,a===null)break;f=a,a=f.next,f.next=null,i.lastBaseUpdate=f,i.shared.pending=null}}while(!0);if(d===null&&(l=h),i.baseState=l,i.firstBaseUpdate=u,i.lastBaseUpdate=d,e=i.shared.interleaved,e!==null){i=e;do s|=i.lane,i=i.next;while(i!==e)}else o===null&&(i.shared.lanes=0);zi|=s,t.lanes=s,t.memoizedState=h}}function Lg(t,e,r){if(t=e.effects,e.effects=null,t!==null)for(e=0;e<t.length;e++){var n=t[e],i=n.callback;if(i!==null){if(n.callback=null,n=r,typeof i!="function")throw Error(le(191,i));i.call(n)}}}var Ua={},Qr=ni(Ua),Ea=ni(Ua),Ca=ni(Ua);function Ni(t){if(t===Ua)throw Error(le(174));return t}function _f(t,e){switch(it(Ca,e),it(Ea,t),it(Qr,Ua),t=e.nodeType,t){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:Dd(null,"");break;default:t=t===8?e.parentNode:e,e=t.namespaceURI||null,t=t.tagName,e=Dd(e,t)}lt(Qr),it(Qr,e)}function rs(){lt(Qr),lt(Ea),lt(Ca)}function ab(t){Ni(Ca.current);var e=Ni(Qr.current),r=Dd(e,t.type);e!==r&&(it(Ea,t),it(Qr,r))}function Sf(t){Ea.current===t&&(lt(Qr),lt(Ea))}var mt=ni(0);function gc(t){for(var e=t;e!==null;){if(e.tag===13){var r=e.memoizedState;if(r!==null&&(r=r.dehydrated,r===null||r.data==="$?"||r.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var Gu=[];function kf(){for(var t=0;t<Gu.length;t++)Gu[t]._workInProgressVersionPrimary=null;Gu.length=0}var Vl=Sn.ReactCurrentDispatcher,Wu=Sn.ReactCurrentBatchConfig,Li=0,vt=null,Tt=null,Rt=null,mc=!1,aa=!1,Ta=0,O2=0;function Ft(){throw Error(le(321))}function jf(t,e){if(e===null)return!1;for(var r=0;r<e.length&&r<t.length;r++)if(!Br(t[r],e[r]))return!1;return!0}function Ef(t,e,r,n,i,o){if(Li=o,vt=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,Vl.current=t===null||t.memoizedState===null?$2:I2,t=r(n,i),aa){o=0;do{if(aa=!1,Ta=0,25<=o)throw Error(le(301));o+=1,Rt=Tt=null,e.updateQueue=null,Vl.current=M2,t=r(n,i)}while(aa)}if(Vl.current=vc,e=Tt!==null&&Tt.next!==null,Li=0,Rt=Tt=vt=null,mc=!1,e)throw Error(le(300));return t}function Cf(){var t=Ta!==0;return Ta=0,t}function Kr(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Rt===null?vt.memoizedState=Rt=t:Rt=Rt.next=t,Rt}function jr(){if(Tt===null){var t=vt.alternate;t=t!==null?t.memoizedState:null}else t=Tt.next;var e=Rt===null?vt.memoizedState:Rt.next;if(e!==null)Rt=e,Tt=t;else{if(t===null)throw Error(le(310));Tt=t,t={memoizedState:Tt.memoizedState,baseState:Tt.baseState,baseQueue:Tt.baseQueue,queue:Tt.queue,next:null},Rt===null?vt.memoizedState=Rt=t:Rt=Rt.next=t}return Rt}function Na(t,e){return typeof e=="function"?e(t):e}function Vu(t){var e=jr(),r=e.queue;if(r===null)throw Error(le(311));r.lastRenderedReducer=t;var n=Tt,i=n.baseQueue,o=r.pending;if(o!==null){if(i!==null){var s=i.next;i.next=o.next,o.next=s}n.baseQueue=i=o,r.pending=null}if(i!==null){o=i.next,n=n.baseState;var a=s=null,l=null,u=o;do{var d=u.lane;if((Li&d)===d)l!==null&&(l=l.next={lane:0,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null}),n=u.hasEagerState?u.eagerState:t(n,u.action);else{var h={lane:d,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null};l===null?(a=l=h,s=n):l=l.next=h,vt.lanes|=d,zi|=d}u=u.next}while(u!==null&&u!==o);l===null?s=n:l.next=a,Br(n,e.memoizedState)||(tr=!0),e.memoizedState=n,e.baseState=s,e.baseQueue=l,r.lastRenderedState=n}if(t=r.interleaved,t!==null){i=t;do o=i.lane,vt.lanes|=o,zi|=o,i=i.next;while(i!==t)}else i===null&&(r.lanes=0);return[e.memoizedState,r.dispatch]}function qu(t){var e=jr(),r=e.queue;if(r===null)throw Error(le(311));r.lastRenderedReducer=t;var n=r.dispatch,i=r.pending,o=e.memoizedState;if(i!==null){r.pending=null;var s=i=i.next;do o=t(o,s.action),s=s.next;while(s!==i);Br(o,e.memoizedState)||(tr=!0),e.memoizedState=o,e.baseQueue===null&&(e.baseState=o),r.lastRenderedState=o}return[o,n]}function lb(){}function cb(t,e){var r=vt,n=jr(),i=e(),o=!Br(n.memoizedState,i);if(o&&(n.memoizedState=i,tr=!0),n=n.queue,Tf(hb.bind(null,r,n,t),[t]),n.getSnapshot!==e||o||Rt!==null&&Rt.memoizedState.tag&1){if(r.flags|=2048,Oa(9,db.bind(null,r,n,i,e),void 0,null),At===null)throw Error(le(349));Li&30||ub(r,e,i)}return i}function ub(t,e,r){t.flags|=16384,t={getSnapshot:e,value:r},e=vt.updateQueue,e===null?(e={lastEffect:null,stores:null},vt.updateQueue=e,e.stores=[t]):(r=e.stores,r===null?e.stores=[t]:r.push(t))}function db(t,e,r,n){e.value=r,e.getSnapshot=n,fb(e)&&pb(t)}function hb(t,e,r){return r(function(){fb(e)&&pb(t)})}function fb(t){var e=t.getSnapshot;t=t.value;try{var r=e();return!Br(t,r)}catch{return!0}}function pb(t){var e=wn(t,1);e!==null&&Fr(e,t,1,-1)}function zg(t){var e=Kr();return typeof t=="function"&&(t=t()),e.memoizedState=e.baseState=t,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Na,lastRenderedState:t},e.queue=t,t=t.dispatch=P2.bind(null,vt,t),[e.memoizedState,t]}function Oa(t,e,r,n){return t={tag:t,create:e,destroy:r,deps:n,next:null},e=vt.updateQueue,e===null?(e={lastEffect:null,stores:null},vt.updateQueue=e,e.lastEffect=t.next=t):(r=e.lastEffect,r===null?e.lastEffect=t.next=t:(n=r.next,r.next=t,t.next=n,e.lastEffect=t)),t}function gb(){return jr().memoizedState}function ql(t,e,r,n){var i=Kr();vt.flags|=t,i.memoizedState=Oa(1|e,r,void 0,n===void 0?null:n)}function qc(t,e,r,n){var i=jr();n=n===void 0?null:n;var o=void 0;if(Tt!==null){var s=Tt.memoizedState;if(o=s.destroy,n!==null&&jf(n,s.deps)){i.memoizedState=Oa(e,r,o,n);return}}vt.flags|=t,i.memoizedState=Oa(1|e,r,o,n)}function Fg(t,e){return ql(8390656,8,t,e)}function Tf(t,e){return qc(2048,8,t,e)}function mb(t,e){return qc(4,2,t,e)}function vb(t,e){return qc(4,4,t,e)}function yb(t,e){if(typeof e=="function")return t=t(),e(t),function(){e(null)};if(e!=null)return t=t(),e.current=t,function(){e.current=null}}function bb(t,e,r){return r=r!=null?r.concat([t]):null,qc(4,4,yb.bind(null,e,t),r)}function Nf(){}function xb(t,e){var r=jr();e=e===void 0?null:e;var n=r.memoizedState;return n!==null&&e!==null&&jf(e,n[1])?n[0]:(r.memoizedState=[t,e],t)}function wb(t,e){var r=jr();e=e===void 0?null:e;var n=r.memoizedState;return n!==null&&e!==null&&jf(e,n[1])?n[0]:(t=t(),r.memoizedState=[t,e],t)}function _b(t,e,r){return Li&21?(Br(r,e)||(r=Cy(),vt.lanes|=r,zi|=r,t.baseState=!0),e):(t.baseState&&(t.baseState=!1,tr=!0),t.memoizedState=r)}function R2(t,e){var r=Je;Je=r!==0&&4>r?r:4,t(!0);var n=Wu.transition;Wu.transition={};try{t(!1),e()}finally{Je=r,Wu.transition=n}}function Sb(){return jr().memoizedState}function A2(t,e,r){var n=Xn(t);if(r={lane:n,action:r,hasEagerState:!1,eagerState:null,next:null},kb(t))jb(e,r);else if(r=ob(t,e,r,n),r!==null){var i=Yt();Fr(r,t,n,i),Eb(r,e,n)}}function P2(t,e,r){var n=Xn(t),i={lane:n,action:r,hasEagerState:!1,eagerState:null,next:null};if(kb(t))jb(e,i);else{var o=t.alternate;if(t.lanes===0&&(o===null||o.lanes===0)&&(o=e.lastRenderedReducer,o!==null))try{var s=e.lastRenderedState,a=o(s,r);if(i.hasEagerState=!0,i.eagerState=a,Br(a,s)){var l=e.interleaved;l===null?(i.next=i,xf(e)):(i.next=l.next,l.next=i),e.interleaved=i;return}}catch{}finally{}r=ob(t,e,i,n),r!==null&&(i=Yt(),Fr(r,t,n,i),Eb(r,e,n))}}function kb(t){var e=t.alternate;return t===vt||e!==null&&e===vt}function jb(t,e){aa=mc=!0;var r=t.pending;r===null?e.next=e:(e.next=r.next,r.next=e),t.pending=e}function Eb(t,e,r){if(r&4194240){var n=e.lanes;n&=t.pendingLanes,r|=n,e.lanes=r,sf(t,r)}}var vc={readContext:kr,useCallback:Ft,useContext:Ft,useEffect:Ft,useImperativeHandle:Ft,useInsertionEffect:Ft,useLayoutEffect:Ft,useMemo:Ft,useReducer:Ft,useRef:Ft,useState:Ft,useDebugValue:Ft,useDeferredValue:Ft,useTransition:Ft,useMutableSource:Ft,useSyncExternalStore:Ft,useId:Ft,unstable_isNewReconciler:!1},$2={readContext:kr,useCallback:function(t,e){return Kr().memoizedState=[t,e===void 0?null:e],t},useContext:kr,useEffect:Fg,useImperativeHandle:function(t,e,r){return r=r!=null?r.concat([t]):null,ql(4194308,4,yb.bind(null,e,t),r)},useLayoutEffect:function(t,e){return ql(4194308,4,t,e)},useInsertionEffect:function(t,e){return ql(4,2,t,e)},useMemo:function(t,e){var r=Kr();return e=e===void 0?null:e,t=t(),r.memoizedState=[t,e],t},useReducer:function(t,e,r){var n=Kr();return e=r!==void 0?r(e):e,n.memoizedState=n.baseState=e,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:e},n.queue=t,t=t.dispatch=A2.bind(null,vt,t),[n.memoizedState,t]},useRef:function(t){var e=Kr();return t={current:t},e.memoizedState=t},useState:zg,useDebugValue:Nf,useDeferredValue:function(t){return Kr().memoizedState=t},useTransition:function(){var t=zg(!1),e=t[0];return t=R2.bind(null,t[1]),Kr().memoizedState=t,[e,t]},useMutableSource:function(){},useSyncExternalStore:function(t,e,r){var n=vt,i=Kr();if(pt){if(r===void 0)throw Error(le(407));r=r()}else{if(r=e(),At===null)throw Error(le(349));Li&30||ub(n,e,r)}i.memoizedState=r;var o={value:r,getSnapshot:e};return i.queue=o,Fg(hb.bind(null,n,o,t),[t]),n.flags|=2048,Oa(9,db.bind(null,n,o,r,e),void 0,null),r},useId:function(){var t=Kr(),e=At.identifierPrefix;if(pt){var r=gn,n=pn;r=(n&~(1<<32-zr(n)-1)).toString(32)+r,e=":"+e+"R"+r,r=Ta++,0<r&&(e+="H"+r.toString(32)),e+=":"}else r=O2++,e=":"+e+"r"+r.toString(32)+":";return t.memoizedState=e},unstable_isNewReconciler:!1},I2={readContext:kr,useCallback:xb,useContext:kr,useEffect:Tf,useImperativeHandle:bb,useInsertionEffect:mb,useLayoutEffect:vb,useMemo:wb,useReducer:Vu,useRef:gb,useState:function(){return Vu(Na)},useDebugValue:Nf,useDeferredValue:function(t){var e=jr();return _b(e,Tt.memoizedState,t)},useTransition:function(){var t=Vu(Na)[0],e=jr().memoizedState;return[t,e]},useMutableSource:lb,useSyncExternalStore:cb,useId:Sb,unstable_isNewReconciler:!1},M2={readContext:kr,useCallback:xb,useContext:kr,useEffect:Tf,useImperativeHandle:bb,useInsertionEffect:mb,useLayoutEffect:vb,useMemo:wb,useReducer:qu,useRef:gb,useState:function(){return qu(Na)},useDebugValue:Nf,useDeferredValue:function(t){var e=jr();return Tt===null?e.memoizedState=t:_b(e,Tt.memoizedState,t)},useTransition:function(){var t=qu(Na)[0],e=jr().memoizedState;return[t,e]},useMutableSource:lb,useSyncExternalStore:cb,useId:Sb,unstable_isNewReconciler:!1};function Pr(t,e){if(t&&t.defaultProps){e=yt({},e),t=t.defaultProps;for(var r in t)e[r]===void 0&&(e[r]=t[r]);return e}return e}function ih(t,e,r,n){e=t.memoizedState,r=r(n,e),r=r==null?e:yt({},e,r),t.memoizedState=r,t.lanes===0&&(t.updateQueue.baseState=r)}var Kc={isMounted:function(t){return(t=t._reactInternals)?Hi(t)===t:!1},enqueueSetState:function(t,e,r){t=t._reactInternals;var n=Yt(),i=Xn(t),o=vn(n,i);o.payload=e,r!=null&&(o.callback=r),e=Kn(t,o,i),e!==null&&(Fr(e,t,i,n),Wl(e,t,i))},enqueueReplaceState:function(t,e,r){t=t._reactInternals;var n=Yt(),i=Xn(t),o=vn(n,i);o.tag=1,o.payload=e,r!=null&&(o.callback=r),e=Kn(t,o,i),e!==null&&(Fr(e,t,i,n),Wl(e,t,i))},enqueueForceUpdate:function(t,e){t=t._reactInternals;var r=Yt(),n=Xn(t),i=vn(r,n);i.tag=2,e!=null&&(i.callback=e),e=Kn(t,i,n),e!==null&&(Fr(e,t,n,r),Wl(e,t,n))}};function Bg(t,e,r,n,i,o,s){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(n,o,s):e.prototype&&e.prototype.isPureReactComponent?!_a(r,n)||!_a(i,o):!0}function Cb(t,e,r){var n=!1,i=Qn,o=e.contextType;return typeof o=="object"&&o!==null?o=kr(o):(i=nr(e)?Mi:Wt.current,n=e.contextTypes,o=(n=n!=null)?Qo(t,i):Qn),e=new e(r,o),t.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=Kc,t.stateNode=e,e._reactInternals=t,n&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=i,t.__reactInternalMemoizedMaskedChildContext=o),e}function Ug(t,e,r,n){t=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(r,n),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(r,n),e.state!==t&&Kc.enqueueReplaceState(e,e.state,null)}function oh(t,e,r,n){var i=t.stateNode;i.props=r,i.state=t.memoizedState,i.refs={},wf(t);var o=e.contextType;typeof o=="object"&&o!==null?i.context=kr(o):(o=nr(e)?Mi:Wt.current,i.context=Qo(t,o)),i.state=t.memoizedState,o=e.getDerivedStateFromProps,typeof o=="function"&&(ih(t,e,o,r),i.state=t.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof i.getSnapshotBeforeUpdate=="function"||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(e=i.state,typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount(),e!==i.state&&Kc.enqueueReplaceState(i,i.state,null),pc(t,r,i,n),i.state=t.memoizedState),typeof i.componentDidMount=="function"&&(t.flags|=4194308)}function ns(t,e){try{var r="",n=e;do r+=u_(n),n=n.return;while(n);var i=r}catch(o){i=`
Error generating stack: `+o.message+`
`+o.stack}return{value:t,source:e,stack:i,digest:null}}function Ku(t,e,r){return{value:t,source:null,stack:r??null,digest:e??null}}function sh(t,e){try{console.error(e.value)}catch(r){setTimeout(function(){throw r})}}var D2=typeof WeakMap=="function"?WeakMap:Map;function Tb(t,e,r){r=vn(-1,r),r.tag=3,r.payload={element:null};var n=e.value;return r.callback=function(){bc||(bc=!0,mh=n),sh(t,e)},r}function Nb(t,e,r){r=vn(-1,r),r.tag=3;var n=t.type.getDerivedStateFromError;if(typeof n=="function"){var i=e.value;r.payload=function(){return n(i)},r.callback=function(){sh(t,e)}}var o=t.stateNode;return o!==null&&typeof o.componentDidCatch=="function"&&(r.callback=function(){sh(t,e),typeof n!="function"&&(Yn===null?Yn=new Set([this]):Yn.add(this));var s=e.stack;this.componentDidCatch(e.value,{componentStack:s!==null?s:""})}),r}function Hg(t,e,r){var n=t.pingCache;if(n===null){n=t.pingCache=new D2;var i=new Set;n.set(e,i)}else i=n.get(e),i===void 0&&(i=new Set,n.set(e,i));i.has(r)||(i.add(r),t=Z2.bind(null,t,e,r),e.then(t,t))}function Gg(t){do{var e;if((e=t.tag===13)&&(e=t.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return t;t=t.return}while(t!==null);return null}function Wg(t,e,r,n,i){return t.mode&1?(t.flags|=65536,t.lanes=i,t):(t===e?t.flags|=65536:(t.flags|=128,r.flags|=131072,r.flags&=-52805,r.tag===1&&(r.alternate===null?r.tag=17:(e=vn(-1,1),e.tag=2,Kn(r,e,1))),r.lanes|=1),t)}var L2=Sn.ReactCurrentOwner,tr=!1;function qt(t,e,r,n){e.child=t===null?ib(e,null,r,n):ts(e,t.child,r,n)}function Vg(t,e,r,n,i){r=r.render;var o=e.ref;return Yo(e,i),n=Ef(t,e,r,n,o,i),r=Cf(),t!==null&&!tr?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~i,_n(t,e,i)):(pt&&r&&pf(e),e.flags|=1,qt(t,e,n,i),e.child)}function qg(t,e,r,n,i){if(t===null){var o=r.type;return typeof o=="function"&&!Df(o)&&o.defaultProps===void 0&&r.compare===null&&r.defaultProps===void 0?(e.tag=15,e.type=o,Ob(t,e,o,n,i)):(t=Zl(r.type,null,n,e,e.mode,i),t.ref=e.ref,t.return=e,e.child=t)}if(o=t.child,!(t.lanes&i)){var s=o.memoizedProps;if(r=r.compare,r=r!==null?r:_a,r(s,n)&&t.ref===e.ref)return _n(t,e,i)}return e.flags|=1,t=Zn(o,n),t.ref=e.ref,t.return=e,e.child=t}function Ob(t,e,r,n,i){if(t!==null){var o=t.memoizedProps;if(_a(o,n)&&t.ref===e.ref)if(tr=!1,e.pendingProps=n=o,(t.lanes&i)!==0)t.flags&131072&&(tr=!0);else return e.lanes=t.lanes,_n(t,e,i)}return ah(t,e,r,n,i)}function Rb(t,e,r){var n=e.pendingProps,i=n.children,o=t!==null?t.memoizedState:null;if(n.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},it(Ho,lr),lr|=r;else{if(!(r&1073741824))return t=o!==null?o.baseLanes|r:r,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:t,cachePool:null,transitions:null},e.updateQueue=null,it(Ho,lr),lr|=t,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},n=o!==null?o.baseLanes:r,it(Ho,lr),lr|=n}else o!==null?(n=o.baseLanes|r,e.memoizedState=null):n=r,it(Ho,lr),lr|=n;return qt(t,e,i,r),e.child}function Ab(t,e){var r=e.ref;(t===null&&r!==null||t!==null&&t.ref!==r)&&(e.flags|=512,e.flags|=2097152)}function ah(t,e,r,n,i){var o=nr(r)?Mi:Wt.current;return o=Qo(e,o),Yo(e,i),r=Ef(t,e,r,n,o,i),n=Cf(),t!==null&&!tr?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~i,_n(t,e,i)):(pt&&n&&pf(e),e.flags|=1,qt(t,e,r,i),e.child)}function Kg(t,e,r,n,i){if(nr(r)){var o=!0;cc(e)}else o=!1;if(Yo(e,i),e.stateNode===null)Kl(t,e),Cb(e,r,n),oh(e,r,n,i),n=!0;else if(t===null){var s=e.stateNode,a=e.memoizedProps;s.props=a;var l=s.context,u=r.contextType;typeof u=="object"&&u!==null?u=kr(u):(u=nr(r)?Mi:Wt.current,u=Qo(e,u));var d=r.getDerivedStateFromProps,h=typeof d=="function"||typeof s.getSnapshotBeforeUpdate=="function";h||typeof s.UNSAFE_componentWillReceiveProps!="function"&&typeof s.componentWillReceiveProps!="function"||(a!==n||l!==u)&&Ug(e,s,n,u),Mn=!1;var f=e.memoizedState;s.state=f,pc(e,n,s,i),l=e.memoizedState,a!==n||f!==l||rr.current||Mn?(typeof d=="function"&&(ih(e,r,d,n),l=e.memoizedState),(a=Mn||Bg(e,r,a,n,f,l,u))?(h||typeof s.UNSAFE_componentWillMount!="function"&&typeof s.componentWillMount!="function"||(typeof s.componentWillMount=="function"&&s.componentWillMount(),typeof s.UNSAFE_componentWillMount=="function"&&s.UNSAFE_componentWillMount()),typeof s.componentDidMount=="function"&&(e.flags|=4194308)):(typeof s.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=n,e.memoizedState=l),s.props=n,s.state=l,s.context=u,n=a):(typeof s.componentDidMount=="function"&&(e.flags|=4194308),n=!1)}else{s=e.stateNode,sb(t,e),a=e.memoizedProps,u=e.type===e.elementType?a:Pr(e.type,a),s.props=u,h=e.pendingProps,f=s.context,l=r.contextType,typeof l=="object"&&l!==null?l=kr(l):(l=nr(r)?Mi:Wt.current,l=Qo(e,l));var p=r.getDerivedStateFromProps;(d=typeof p=="function"||typeof s.getSnapshotBeforeUpdate=="function")||typeof s.UNSAFE_componentWillReceiveProps!="function"&&typeof s.componentWillReceiveProps!="function"||(a!==h||f!==l)&&Ug(e,s,n,l),Mn=!1,f=e.memoizedState,s.state=f,pc(e,n,s,i);var v=e.memoizedState;a!==h||f!==v||rr.current||Mn?(typeof p=="function"&&(ih(e,r,p,n),v=e.memoizedState),(u=Mn||Bg(e,r,u,n,f,v,l)||!1)?(d||typeof s.UNSAFE_componentWillUpdate!="function"&&typeof s.componentWillUpdate!="function"||(typeof s.componentWillUpdate=="function"&&s.componentWillUpdate(n,v,l),typeof s.UNSAFE_componentWillUpdate=="function"&&s.UNSAFE_componentWillUpdate(n,v,l)),typeof s.componentDidUpdate=="function"&&(e.flags|=4),typeof s.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof s.componentDidUpdate!="function"||a===t.memoizedProps&&f===t.memoizedState||(e.flags|=4),typeof s.getSnapshotBeforeUpdate!="function"||a===t.memoizedProps&&f===t.memoizedState||(e.flags|=1024),e.memoizedProps=n,e.memoizedState=v),s.props=n,s.state=v,s.context=l,n=u):(typeof s.componentDidUpdate!="function"||a===t.memoizedProps&&f===t.memoizedState||(e.flags|=4),typeof s.getSnapshotBeforeUpdate!="function"||a===t.memoizedProps&&f===t.memoizedState||(e.flags|=1024),n=!1)}return lh(t,e,r,n,o,i)}function lh(t,e,r,n,i,o){Ab(t,e);var s=(e.flags&128)!==0;if(!n&&!s)return i&&Pg(e,r,!1),_n(t,e,o);n=e.stateNode,L2.current=e;var a=s&&typeof r.getDerivedStateFromError!="function"?null:n.render();return e.flags|=1,t!==null&&s?(e.child=ts(e,t.child,null,o),e.child=ts(e,null,a,o)):qt(t,e,a,o),e.memoizedState=n.state,i&&Pg(e,r,!0),e.child}function Pb(t){var e=t.stateNode;e.pendingContext?Ag(t,e.pendingContext,e.pendingContext!==e.context):e.context&&Ag(t,e.context,!1),_f(t,e.containerInfo)}function Yg(t,e,r,n,i){return es(),mf(i),e.flags|=256,qt(t,e,r,n),e.child}var ch={dehydrated:null,treeContext:null,retryLane:0};function uh(t){return{baseLanes:t,cachePool:null,transitions:null}}function $b(t,e,r){var n=e.pendingProps,i=mt.current,o=!1,s=(e.flags&128)!==0,a;if((a=s)||(a=t!==null&&t.memoizedState===null?!1:(i&2)!==0),a?(o=!0,e.flags&=-129):(t===null||t.memoizedState!==null)&&(i|=1),it(mt,i&1),t===null)return rh(e),t=e.memoizedState,t!==null&&(t=t.dehydrated,t!==null)?(e.mode&1?t.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(s=n.children,t=n.fallback,o?(n=e.mode,o=e.child,s={mode:"hidden",children:s},!(n&1)&&o!==null?(o.childLanes=0,o.pendingProps=s):o=Zc(s,n,0,null),t=Pi(t,n,r,null),o.return=e,t.return=e,o.sibling=t,e.child=o,e.child.memoizedState=uh(r),e.memoizedState=ch,t):Of(e,s));if(i=t.memoizedState,i!==null&&(a=i.dehydrated,a!==null))return z2(t,e,s,n,a,i,r);if(o){o=n.fallback,s=e.mode,i=t.child,a=i.sibling;var l={mode:"hidden",children:n.children};return!(s&1)&&e.child!==i?(n=e.child,n.childLanes=0,n.pendingProps=l,e.deletions=null):(n=Zn(i,l),n.subtreeFlags=i.subtreeFlags&14680064),a!==null?o=Zn(a,o):(o=Pi(o,s,r,null),o.flags|=2),o.return=e,n.return=e,n.sibling=o,e.child=n,n=o,o=e.child,s=t.child.memoizedState,s=s===null?uh(r):{baseLanes:s.baseLanes|r,cachePool:null,transitions:s.transitions},o.memoizedState=s,o.childLanes=t.childLanes&~r,e.memoizedState=ch,n}return o=t.child,t=o.sibling,n=Zn(o,{mode:"visible",children:n.children}),!(e.mode&1)&&(n.lanes=r),n.return=e,n.sibling=null,t!==null&&(r=e.deletions,r===null?(e.deletions=[t],e.flags|=16):r.push(t)),e.child=n,e.memoizedState=null,n}function Of(t,e){return e=Zc({mode:"visible",children:e},t.mode,0,null),e.return=t,t.child=e}function bl(t,e,r,n){return n!==null&&mf(n),ts(e,t.child,null,r),t=Of(e,e.pendingProps.children),t.flags|=2,e.memoizedState=null,t}function z2(t,e,r,n,i,o,s){if(r)return e.flags&256?(e.flags&=-257,n=Ku(Error(le(422))),bl(t,e,s,n)):e.memoizedState!==null?(e.child=t.child,e.flags|=128,null):(o=n.fallback,i=e.mode,n=Zc({mode:"visible",children:n.children},i,0,null),o=Pi(o,i,s,null),o.flags|=2,n.return=e,o.return=e,n.sibling=o,e.child=n,e.mode&1&&ts(e,t.child,null,s),e.child.memoizedState=uh(s),e.memoizedState=ch,o);if(!(e.mode&1))return bl(t,e,s,null);if(i.data==="$!"){if(n=i.nextSibling&&i.nextSibling.dataset,n)var a=n.dgst;return n=a,o=Error(le(419)),n=Ku(o,n,void 0),bl(t,e,s,n)}if(a=(s&t.childLanes)!==0,tr||a){if(n=At,n!==null){switch(s&-s){case 4:i=2;break;case 16:i=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:i=32;break;case 536870912:i=268435456;break;default:i=0}i=i&(n.suspendedLanes|s)?0:i,i!==0&&i!==o.retryLane&&(o.retryLane=i,wn(t,i),Fr(n,t,i,-1))}return Mf(),n=Ku(Error(le(421))),bl(t,e,s,n)}return i.data==="$?"?(e.flags|=128,e.child=t.child,e=J2.bind(null,t),i._reactRetry=e,null):(t=o.treeContext,dr=qn(i.nextSibling),pr=e,pt=!0,Dr=null,t!==null&&(br[xr++]=pn,br[xr++]=gn,br[xr++]=Di,pn=t.id,gn=t.overflow,Di=e),e=Of(e,n.children),e.flags|=4096,e)}function Xg(t,e,r){t.lanes|=e;var n=t.alternate;n!==null&&(n.lanes|=e),nh(t.return,e,r)}function Yu(t,e,r,n,i){var o=t.memoizedState;o===null?t.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:n,tail:r,tailMode:i}:(o.isBackwards=e,o.rendering=null,o.renderingStartTime=0,o.last=n,o.tail=r,o.tailMode=i)}function Ib(t,e,r){var n=e.pendingProps,i=n.revealOrder,o=n.tail;if(qt(t,e,n.children,r),n=mt.current,n&2)n=n&1|2,e.flags|=128;else{if(t!==null&&t.flags&128)e:for(t=e.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&Xg(t,r,e);else if(t.tag===19)Xg(t,r,e);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}n&=1}if(it(mt,n),!(e.mode&1))e.memoizedState=null;else switch(i){case"forwards":for(r=e.child,i=null;r!==null;)t=r.alternate,t!==null&&gc(t)===null&&(i=r),r=r.sibling;r=i,r===null?(i=e.child,e.child=null):(i=r.sibling,r.sibling=null),Yu(e,!1,i,r,o);break;case"backwards":for(r=null,i=e.child,e.child=null;i!==null;){if(t=i.alternate,t!==null&&gc(t)===null){e.child=i;break}t=i.sibling,i.sibling=r,r=i,i=t}Yu(e,!0,r,null,o);break;case"together":Yu(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function Kl(t,e){!(e.mode&1)&&t!==null&&(t.alternate=null,e.alternate=null,e.flags|=2)}function _n(t,e,r){if(t!==null&&(e.dependencies=t.dependencies),zi|=e.lanes,!(r&e.childLanes))return null;if(t!==null&&e.child!==t.child)throw Error(le(153));if(e.child!==null){for(t=e.child,r=Zn(t,t.pendingProps),e.child=r,r.return=e;t.sibling!==null;)t=t.sibling,r=r.sibling=Zn(t,t.pendingProps),r.return=e;r.sibling=null}return e.child}function F2(t,e,r){switch(e.tag){case 3:Pb(e),es();break;case 5:ab(e);break;case 1:nr(e.type)&&cc(e);break;case 4:_f(e,e.stateNode.containerInfo);break;case 10:var n=e.type._context,i=e.memoizedProps.value;it(hc,n._currentValue),n._currentValue=i;break;case 13:if(n=e.memoizedState,n!==null)return n.dehydrated!==null?(it(mt,mt.current&1),e.flags|=128,null):r&e.child.childLanes?$b(t,e,r):(it(mt,mt.current&1),t=_n(t,e,r),t!==null?t.sibling:null);it(mt,mt.current&1);break;case 19:if(n=(r&e.childLanes)!==0,t.flags&128){if(n)return Ib(t,e,r);e.flags|=128}if(i=e.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),it(mt,mt.current),n)break;return null;case 22:case 23:return e.lanes=0,Rb(t,e,r)}return _n(t,e,r)}var Mb,dh,Db,Lb;Mb=function(t,e){for(var r=e.child;r!==null;){if(r.tag===5||r.tag===6)t.appendChild(r.stateNode);else if(r.tag!==4&&r.child!==null){r.child.return=r,r=r.child;continue}if(r===e)break;for(;r.sibling===null;){if(r.return===null||r.return===e)return;r=r.return}r.sibling.return=r.return,r=r.sibling}};dh=function(){};Db=function(t,e,r,n){var i=t.memoizedProps;if(i!==n){t=e.stateNode,Ni(Qr.current);var o=null;switch(r){case"input":i=Pd(t,i),n=Pd(t,n),o=[];break;case"select":i=yt({},i,{value:void 0}),n=yt({},n,{value:void 0}),o=[];break;case"textarea":i=Md(t,i),n=Md(t,n),o=[];break;default:typeof i.onClick!="function"&&typeof n.onClick=="function"&&(t.onclick=ac)}Ld(r,n);var s;r=null;for(u in i)if(!n.hasOwnProperty(u)&&i.hasOwnProperty(u)&&i[u]!=null)if(u==="style"){var a=i[u];for(s in a)a.hasOwnProperty(s)&&(r||(r={}),r[s]="")}else u!=="dangerouslySetInnerHTML"&&u!=="children"&&u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&u!=="autoFocus"&&(ga.hasOwnProperty(u)?o||(o=[]):(o=o||[]).push(u,null));for(u in n){var l=n[u];if(a=i!=null?i[u]:void 0,n.hasOwnProperty(u)&&l!==a&&(l!=null||a!=null))if(u==="style")if(a){for(s in a)!a.hasOwnProperty(s)||l&&l.hasOwnProperty(s)||(r||(r={}),r[s]="");for(s in l)l.hasOwnProperty(s)&&a[s]!==l[s]&&(r||(r={}),r[s]=l[s])}else r||(o||(o=[]),o.push(u,r)),r=l;else u==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,a=a?a.__html:void 0,l!=null&&a!==l&&(o=o||[]).push(u,l)):u==="children"?typeof l!="string"&&typeof l!="number"||(o=o||[]).push(u,""+l):u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&(ga.hasOwnProperty(u)?(l!=null&&u==="onScroll"&&ot("scroll",t),o||a===l||(o=[])):(o=o||[]).push(u,l))}r&&(o=o||[]).push("style",r);var u=o;(e.updateQueue=u)&&(e.flags|=4)}};Lb=function(t,e,r,n){r!==n&&(e.flags|=4)};function Fs(t,e){if(!pt)switch(t.tailMode){case"hidden":e=t.tail;for(var r=null;e!==null;)e.alternate!==null&&(r=e),e=e.sibling;r===null?t.tail=null:r.sibling=null;break;case"collapsed":r=t.tail;for(var n=null;r!==null;)r.alternate!==null&&(n=r),r=r.sibling;n===null?e||t.tail===null?t.tail=null:t.tail.sibling=null:n.sibling=null}}function Bt(t){var e=t.alternate!==null&&t.alternate.child===t.child,r=0,n=0;if(e)for(var i=t.child;i!==null;)r|=i.lanes|i.childLanes,n|=i.subtreeFlags&14680064,n|=i.flags&14680064,i.return=t,i=i.sibling;else for(i=t.child;i!==null;)r|=i.lanes|i.childLanes,n|=i.subtreeFlags,n|=i.flags,i.return=t,i=i.sibling;return t.subtreeFlags|=n,t.childLanes=r,e}function B2(t,e,r){var n=e.pendingProps;switch(gf(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Bt(e),null;case 1:return nr(e.type)&&lc(),Bt(e),null;case 3:return n=e.stateNode,rs(),lt(rr),lt(Wt),kf(),n.pendingContext&&(n.context=n.pendingContext,n.pendingContext=null),(t===null||t.child===null)&&(vl(e)?e.flags|=4:t===null||t.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,Dr!==null&&(bh(Dr),Dr=null))),dh(t,e),Bt(e),null;case 5:Sf(e);var i=Ni(Ca.current);if(r=e.type,t!==null&&e.stateNode!=null)Db(t,e,r,n,i),t.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!n){if(e.stateNode===null)throw Error(le(166));return Bt(e),null}if(t=Ni(Qr.current),vl(e)){n=e.stateNode,r=e.type;var o=e.memoizedProps;switch(n[Xr]=e,n[ja]=o,t=(e.mode&1)!==0,r){case"dialog":ot("cancel",n),ot("close",n);break;case"iframe":case"object":case"embed":ot("load",n);break;case"video":case"audio":for(i=0;i<Zs.length;i++)ot(Zs[i],n);break;case"source":ot("error",n);break;case"img":case"image":case"link":ot("error",n),ot("load",n);break;case"details":ot("toggle",n);break;case"input":og(n,o),ot("invalid",n);break;case"select":n._wrapperState={wasMultiple:!!o.multiple},ot("invalid",n);break;case"textarea":ag(n,o),ot("invalid",n)}Ld(r,o),i=null;for(var s in o)if(o.hasOwnProperty(s)){var a=o[s];s==="children"?typeof a=="string"?n.textContent!==a&&(o.suppressHydrationWarning!==!0&&ml(n.textContent,a,t),i=["children",a]):typeof a=="number"&&n.textContent!==""+a&&(o.suppressHydrationWarning!==!0&&ml(n.textContent,a,t),i=["children",""+a]):ga.hasOwnProperty(s)&&a!=null&&s==="onScroll"&&ot("scroll",n)}switch(r){case"input":ll(n),sg(n,o,!0);break;case"textarea":ll(n),lg(n);break;case"select":case"option":break;default:typeof o.onClick=="function"&&(n.onclick=ac)}n=i,e.updateQueue=n,n!==null&&(e.flags|=4)}else{s=i.nodeType===9?i:i.ownerDocument,t==="http://www.w3.org/1999/xhtml"&&(t=hy(r)),t==="http://www.w3.org/1999/xhtml"?r==="script"?(t=s.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild)):typeof n.is=="string"?t=s.createElement(r,{is:n.is}):(t=s.createElement(r),r==="select"&&(s=t,n.multiple?s.multiple=!0:n.size&&(s.size=n.size))):t=s.createElementNS(t,r),t[Xr]=e,t[ja]=n,Mb(t,e,!1,!1),e.stateNode=t;e:{switch(s=zd(r,n),r){case"dialog":ot("cancel",t),ot("close",t),i=n;break;case"iframe":case"object":case"embed":ot("load",t),i=n;break;case"video":case"audio":for(i=0;i<Zs.length;i++)ot(Zs[i],t);i=n;break;case"source":ot("error",t),i=n;break;case"img":case"image":case"link":ot("error",t),ot("load",t),i=n;break;case"details":ot("toggle",t),i=n;break;case"input":og(t,n),i=Pd(t,n),ot("invalid",t);break;case"option":i=n;break;case"select":t._wrapperState={wasMultiple:!!n.multiple},i=yt({},n,{value:void 0}),ot("invalid",t);break;case"textarea":ag(t,n),i=Md(t,n),ot("invalid",t);break;default:i=n}Ld(r,i),a=i;for(o in a)if(a.hasOwnProperty(o)){var l=a[o];o==="style"?gy(t,l):o==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,l!=null&&fy(t,l)):o==="children"?typeof l=="string"?(r!=="textarea"||l!=="")&&ma(t,l):typeof l=="number"&&ma(t,""+l):o!=="suppressContentEditableWarning"&&o!=="suppressHydrationWarning"&&o!=="autoFocus"&&(ga.hasOwnProperty(o)?l!=null&&o==="onScroll"&&ot("scroll",t):l!=null&&Qh(t,o,l,s))}switch(r){case"input":ll(t),sg(t,n,!1);break;case"textarea":ll(t),lg(t);break;case"option":n.value!=null&&t.setAttribute("value",""+Jn(n.value));break;case"select":t.multiple=!!n.multiple,o=n.value,o!=null?Wo(t,!!n.multiple,o,!1):n.defaultValue!=null&&Wo(t,!!n.multiple,n.defaultValue,!0);break;default:typeof i.onClick=="function"&&(t.onclick=ac)}switch(r){case"button":case"input":case"select":case"textarea":n=!!n.autoFocus;break e;case"img":n=!0;break e;default:n=!1}}n&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return Bt(e),null;case 6:if(t&&e.stateNode!=null)Lb(t,e,t.memoizedProps,n);else{if(typeof n!="string"&&e.stateNode===null)throw Error(le(166));if(r=Ni(Ca.current),Ni(Qr.current),vl(e)){if(n=e.stateNode,r=e.memoizedProps,n[Xr]=e,(o=n.nodeValue!==r)&&(t=pr,t!==null))switch(t.tag){case 3:ml(n.nodeValue,r,(t.mode&1)!==0);break;case 5:t.memoizedProps.suppressHydrationWarning!==!0&&ml(n.nodeValue,r,(t.mode&1)!==0)}o&&(e.flags|=4)}else n=(r.nodeType===9?r:r.ownerDocument).createTextNode(n),n[Xr]=e,e.stateNode=n}return Bt(e),null;case 13:if(lt(mt),n=e.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(pt&&dr!==null&&e.mode&1&&!(e.flags&128))rb(),es(),e.flags|=98560,o=!1;else if(o=vl(e),n!==null&&n.dehydrated!==null){if(t===null){if(!o)throw Error(le(318));if(o=e.memoizedState,o=o!==null?o.dehydrated:null,!o)throw Error(le(317));o[Xr]=e}else es(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;Bt(e),o=!1}else Dr!==null&&(bh(Dr),Dr=null),o=!0;if(!o)return e.flags&65536?e:null}return e.flags&128?(e.lanes=r,e):(n=n!==null,n!==(t!==null&&t.memoizedState!==null)&&n&&(e.child.flags|=8192,e.mode&1&&(t===null||mt.current&1?Nt===0&&(Nt=3):Mf())),e.updateQueue!==null&&(e.flags|=4),Bt(e),null);case 4:return rs(),dh(t,e),t===null&&Sa(e.stateNode.containerInfo),Bt(e),null;case 10:return bf(e.type._context),Bt(e),null;case 17:return nr(e.type)&&lc(),Bt(e),null;case 19:if(lt(mt),o=e.memoizedState,o===null)return Bt(e),null;if(n=(e.flags&128)!==0,s=o.rendering,s===null)if(n)Fs(o,!1);else{if(Nt!==0||t!==null&&t.flags&128)for(t=e.child;t!==null;){if(s=gc(t),s!==null){for(e.flags|=128,Fs(o,!1),n=s.updateQueue,n!==null&&(e.updateQueue=n,e.flags|=4),e.subtreeFlags=0,n=r,r=e.child;r!==null;)o=r,t=n,o.flags&=14680066,s=o.alternate,s===null?(o.childLanes=0,o.lanes=t,o.child=null,o.subtreeFlags=0,o.memoizedProps=null,o.memoizedState=null,o.updateQueue=null,o.dependencies=null,o.stateNode=null):(o.childLanes=s.childLanes,o.lanes=s.lanes,o.child=s.child,o.subtreeFlags=0,o.deletions=null,o.memoizedProps=s.memoizedProps,o.memoizedState=s.memoizedState,o.updateQueue=s.updateQueue,o.type=s.type,t=s.dependencies,o.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),r=r.sibling;return it(mt,mt.current&1|2),e.child}t=t.sibling}o.tail!==null&&St()>is&&(e.flags|=128,n=!0,Fs(o,!1),e.lanes=4194304)}else{if(!n)if(t=gc(s),t!==null){if(e.flags|=128,n=!0,r=t.updateQueue,r!==null&&(e.updateQueue=r,e.flags|=4),Fs(o,!0),o.tail===null&&o.tailMode==="hidden"&&!s.alternate&&!pt)return Bt(e),null}else 2*St()-o.renderingStartTime>is&&r!==1073741824&&(e.flags|=128,n=!0,Fs(o,!1),e.lanes=4194304);o.isBackwards?(s.sibling=e.child,e.child=s):(r=o.last,r!==null?r.sibling=s:e.child=s,o.last=s)}return o.tail!==null?(e=o.tail,o.rendering=e,o.tail=e.sibling,o.renderingStartTime=St(),e.sibling=null,r=mt.current,it(mt,n?r&1|2:r&1),e):(Bt(e),null);case 22:case 23:return If(),n=e.memoizedState!==null,t!==null&&t.memoizedState!==null!==n&&(e.flags|=8192),n&&e.mode&1?lr&1073741824&&(Bt(e),e.subtreeFlags&6&&(e.flags|=8192)):Bt(e),null;case 24:return null;case 25:return null}throw Error(le(156,e.tag))}function U2(t,e){switch(gf(e),e.tag){case 1:return nr(e.type)&&lc(),t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 3:return rs(),lt(rr),lt(Wt),kf(),t=e.flags,t&65536&&!(t&128)?(e.flags=t&-65537|128,e):null;case 5:return Sf(e),null;case 13:if(lt(mt),t=e.memoizedState,t!==null&&t.dehydrated!==null){if(e.alternate===null)throw Error(le(340));es()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 19:return lt(mt),null;case 4:return rs(),null;case 10:return bf(e.type._context),null;case 22:case 23:return If(),null;case 24:return null;default:return null}}var xl=!1,Gt=!1,H2=typeof WeakSet=="function"?WeakSet:Set,ve=null;function Uo(t,e){var r=t.ref;if(r!==null)if(typeof r=="function")try{r(null)}catch(n){wt(t,e,n)}else r.current=null}function hh(t,e,r){try{r()}catch(n){wt(t,e,n)}}var Zg=!1;function G2(t,e){if(Yd=ic,t=Hy(),ff(t)){if("selectionStart"in t)var r={start:t.selectionStart,end:t.selectionEnd};else e:{r=(r=t.ownerDocument)&&r.defaultView||window;var n=r.getSelection&&r.getSelection();if(n&&n.rangeCount!==0){r=n.anchorNode;var i=n.anchorOffset,o=n.focusNode;n=n.focusOffset;try{r.nodeType,o.nodeType}catch{r=null;break e}var s=0,a=-1,l=-1,u=0,d=0,h=t,f=null;t:for(;;){for(var p;h!==r||i!==0&&h.nodeType!==3||(a=s+i),h!==o||n!==0&&h.nodeType!==3||(l=s+n),h.nodeType===3&&(s+=h.nodeValue.length),(p=h.firstChild)!==null;)f=h,h=p;for(;;){if(h===t)break t;if(f===r&&++u===i&&(a=s),f===o&&++d===n&&(l=s),(p=h.nextSibling)!==null)break;h=f,f=h.parentNode}h=p}r=a===-1||l===-1?null:{start:a,end:l}}else r=null}r=r||{start:0,end:0}}else r=null;for(Xd={focusedElem:t,selectionRange:r},ic=!1,ve=e;ve!==null;)if(e=ve,t=e.child,(e.subtreeFlags&1028)!==0&&t!==null)t.return=e,ve=t;else for(;ve!==null;){e=ve;try{var v=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(v!==null){var g=v.memoizedProps,b=v.memoizedState,m=e.stateNode,y=m.getSnapshotBeforeUpdate(e.elementType===e.type?g:Pr(e.type,g),b);m.__reactInternalSnapshotBeforeUpdate=y}break;case 3:var x=e.stateNode.containerInfo;x.nodeType===1?x.textContent="":x.nodeType===9&&x.documentElement&&x.removeChild(x.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(le(163))}}catch(w){wt(e,e.return,w)}if(t=e.sibling,t!==null){t.return=e.return,ve=t;break}ve=e.return}return v=Zg,Zg=!1,v}function la(t,e,r){var n=e.updateQueue;if(n=n!==null?n.lastEffect:null,n!==null){var i=n=n.next;do{if((i.tag&t)===t){var o=i.destroy;i.destroy=void 0,o!==void 0&&hh(e,r,o)}i=i.next}while(i!==n)}}function Yc(t,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var r=e=e.next;do{if((r.tag&t)===t){var n=r.create;r.destroy=n()}r=r.next}while(r!==e)}}function fh(t){var e=t.ref;if(e!==null){var r=t.stateNode;switch(t.tag){case 5:t=r;break;default:t=r}typeof e=="function"?e(t):e.current=t}}function zb(t){var e=t.alternate;e!==null&&(t.alternate=null,zb(e)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(e=t.stateNode,e!==null&&(delete e[Xr],delete e[ja],delete e[Qd],delete e[E2],delete e[C2])),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}function Fb(t){return t.tag===5||t.tag===3||t.tag===4}function Jg(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||Fb(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function ph(t,e,r){var n=t.tag;if(n===5||n===6)t=t.stateNode,e?r.nodeType===8?r.parentNode.insertBefore(t,e):r.insertBefore(t,e):(r.nodeType===8?(e=r.parentNode,e.insertBefore(t,r)):(e=r,e.appendChild(t)),r=r._reactRootContainer,r!=null||e.onclick!==null||(e.onclick=ac));else if(n!==4&&(t=t.child,t!==null))for(ph(t,e,r),t=t.sibling;t!==null;)ph(t,e,r),t=t.sibling}function gh(t,e,r){var n=t.tag;if(n===5||n===6)t=t.stateNode,e?r.insertBefore(t,e):r.appendChild(t);else if(n!==4&&(t=t.child,t!==null))for(gh(t,e,r),t=t.sibling;t!==null;)gh(t,e,r),t=t.sibling}var It=null,Ir=!1;function Pn(t,e,r){for(r=r.child;r!==null;)Bb(t,e,r),r=r.sibling}function Bb(t,e,r){if(Jr&&typeof Jr.onCommitFiberUnmount=="function")try{Jr.onCommitFiberUnmount(Bc,r)}catch{}switch(r.tag){case 5:Gt||Uo(r,e);case 6:var n=It,i=Ir;It=null,Pn(t,e,r),It=n,Ir=i,It!==null&&(Ir?(t=It,r=r.stateNode,t.nodeType===8?t.parentNode.removeChild(r):t.removeChild(r)):It.removeChild(r.stateNode));break;case 18:It!==null&&(Ir?(t=It,r=r.stateNode,t.nodeType===8?Uu(t.parentNode,r):t.nodeType===1&&Uu(t,r),xa(t)):Uu(It,r.stateNode));break;case 4:n=It,i=Ir,It=r.stateNode.containerInfo,Ir=!0,Pn(t,e,r),It=n,Ir=i;break;case 0:case 11:case 14:case 15:if(!Gt&&(n=r.updateQueue,n!==null&&(n=n.lastEffect,n!==null))){i=n=n.next;do{var o=i,s=o.destroy;o=o.tag,s!==void 0&&(o&2||o&4)&&hh(r,e,s),i=i.next}while(i!==n)}Pn(t,e,r);break;case 1:if(!Gt&&(Uo(r,e),n=r.stateNode,typeof n.componentWillUnmount=="function"))try{n.props=r.memoizedProps,n.state=r.memoizedState,n.componentWillUnmount()}catch(a){wt(r,e,a)}Pn(t,e,r);break;case 21:Pn(t,e,r);break;case 22:r.mode&1?(Gt=(n=Gt)||r.memoizedState!==null,Pn(t,e,r),Gt=n):Pn(t,e,r);break;default:Pn(t,e,r)}}function Qg(t){var e=t.updateQueue;if(e!==null){t.updateQueue=null;var r=t.stateNode;r===null&&(r=t.stateNode=new H2),e.forEach(function(n){var i=Q2.bind(null,t,n);r.has(n)||(r.add(n),n.then(i,i))})}}function Nr(t,e){var r=e.deletions;if(r!==null)for(var n=0;n<r.length;n++){var i=r[n];try{var o=t,s=e,a=s;e:for(;a!==null;){switch(a.tag){case 5:It=a.stateNode,Ir=!1;break e;case 3:It=a.stateNode.containerInfo,Ir=!0;break e;case 4:It=a.stateNode.containerInfo,Ir=!0;break e}a=a.return}if(It===null)throw Error(le(160));Bb(o,s,i),It=null,Ir=!1;var l=i.alternate;l!==null&&(l.return=null),i.return=null}catch(u){wt(i,e,u)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)Ub(e,t),e=e.sibling}function Ub(t,e){var r=t.alternate,n=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if(Nr(e,t),Vr(t),n&4){try{la(3,t,t.return),Yc(3,t)}catch(g){wt(t,t.return,g)}try{la(5,t,t.return)}catch(g){wt(t,t.return,g)}}break;case 1:Nr(e,t),Vr(t),n&512&&r!==null&&Uo(r,r.return);break;case 5:if(Nr(e,t),Vr(t),n&512&&r!==null&&Uo(r,r.return),t.flags&32){var i=t.stateNode;try{ma(i,"")}catch(g){wt(t,t.return,g)}}if(n&4&&(i=t.stateNode,i!=null)){var o=t.memoizedProps,s=r!==null?r.memoizedProps:o,a=t.type,l=t.updateQueue;if(t.updateQueue=null,l!==null)try{a==="input"&&o.type==="radio"&&o.name!=null&&uy(i,o),zd(a,s);var u=zd(a,o);for(s=0;s<l.length;s+=2){var d=l[s],h=l[s+1];d==="style"?gy(i,h):d==="dangerouslySetInnerHTML"?fy(i,h):d==="children"?ma(i,h):Qh(i,d,h,u)}switch(a){case"input":$d(i,o);break;case"textarea":dy(i,o);break;case"select":var f=i._wrapperState.wasMultiple;i._wrapperState.wasMultiple=!!o.multiple;var p=o.value;p!=null?Wo(i,!!o.multiple,p,!1):f!==!!o.multiple&&(o.defaultValue!=null?Wo(i,!!o.multiple,o.defaultValue,!0):Wo(i,!!o.multiple,o.multiple?[]:"",!1))}i[ja]=o}catch(g){wt(t,t.return,g)}}break;case 6:if(Nr(e,t),Vr(t),n&4){if(t.stateNode===null)throw Error(le(162));i=t.stateNode,o=t.memoizedProps;try{i.nodeValue=o}catch(g){wt(t,t.return,g)}}break;case 3:if(Nr(e,t),Vr(t),n&4&&r!==null&&r.memoizedState.isDehydrated)try{xa(e.containerInfo)}catch(g){wt(t,t.return,g)}break;case 4:Nr(e,t),Vr(t);break;case 13:Nr(e,t),Vr(t),i=t.child,i.flags&8192&&(o=i.memoizedState!==null,i.stateNode.isHidden=o,!o||i.alternate!==null&&i.alternate.memoizedState!==null||(Pf=St())),n&4&&Qg(t);break;case 22:if(d=r!==null&&r.memoizedState!==null,t.mode&1?(Gt=(u=Gt)||d,Nr(e,t),Gt=u):Nr(e,t),Vr(t),n&8192){if(u=t.memoizedState!==null,(t.stateNode.isHidden=u)&&!d&&t.mode&1)for(ve=t,d=t.child;d!==null;){for(h=ve=d;ve!==null;){switch(f=ve,p=f.child,f.tag){case 0:case 11:case 14:case 15:la(4,f,f.return);break;case 1:Uo(f,f.return);var v=f.stateNode;if(typeof v.componentWillUnmount=="function"){n=f,r=f.return;try{e=n,v.props=e.memoizedProps,v.state=e.memoizedState,v.componentWillUnmount()}catch(g){wt(n,r,g)}}break;case 5:Uo(f,f.return);break;case 22:if(f.memoizedState!==null){tm(h);continue}}p!==null?(p.return=f,ve=p):tm(h)}d=d.sibling}e:for(d=null,h=t;;){if(h.tag===5){if(d===null){d=h;try{i=h.stateNode,u?(o=i.style,typeof o.setProperty=="function"?o.setProperty("display","none","important"):o.display="none"):(a=h.stateNode,l=h.memoizedProps.style,s=l!=null&&l.hasOwnProperty("display")?l.display:null,a.style.display=py("display",s))}catch(g){wt(t,t.return,g)}}}else if(h.tag===6){if(d===null)try{h.stateNode.nodeValue=u?"":h.memoizedProps}catch(g){wt(t,t.return,g)}}else if((h.tag!==22&&h.tag!==23||h.memoizedState===null||h===t)&&h.child!==null){h.child.return=h,h=h.child;continue}if(h===t)break e;for(;h.sibling===null;){if(h.return===null||h.return===t)break e;d===h&&(d=null),h=h.return}d===h&&(d=null),h.sibling.return=h.return,h=h.sibling}}break;case 19:Nr(e,t),Vr(t),n&4&&Qg(t);break;case 21:break;default:Nr(e,t),Vr(t)}}function Vr(t){var e=t.flags;if(e&2){try{e:{for(var r=t.return;r!==null;){if(Fb(r)){var n=r;break e}r=r.return}throw Error(le(160))}switch(n.tag){case 5:var i=n.stateNode;n.flags&32&&(ma(i,""),n.flags&=-33);var o=Jg(t);gh(t,o,i);break;case 3:case 4:var s=n.stateNode.containerInfo,a=Jg(t);ph(t,a,s);break;default:throw Error(le(161))}}catch(l){wt(t,t.return,l)}t.flags&=-3}e&4096&&(t.flags&=-4097)}function W2(t,e,r){ve=t,Hb(t)}function Hb(t,e,r){for(var n=(t.mode&1)!==0;ve!==null;){var i=ve,o=i.child;if(i.tag===22&&n){var s=i.memoizedState!==null||xl;if(!s){var a=i.alternate,l=a!==null&&a.memoizedState!==null||Gt;a=xl;var u=Gt;if(xl=s,(Gt=l)&&!u)for(ve=i;ve!==null;)s=ve,l=s.child,s.tag===22&&s.memoizedState!==null?rm(i):l!==null?(l.return=s,ve=l):rm(i);for(;o!==null;)ve=o,Hb(o),o=o.sibling;ve=i,xl=a,Gt=u}em(t)}else i.subtreeFlags&8772&&o!==null?(o.return=i,ve=o):em(t)}}function em(t){for(;ve!==null;){var e=ve;if(e.flags&8772){var r=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:Gt||Yc(5,e);break;case 1:var n=e.stateNode;if(e.flags&4&&!Gt)if(r===null)n.componentDidMount();else{var i=e.elementType===e.type?r.memoizedProps:Pr(e.type,r.memoizedProps);n.componentDidUpdate(i,r.memoizedState,n.__reactInternalSnapshotBeforeUpdate)}var o=e.updateQueue;o!==null&&Lg(e,o,n);break;case 3:var s=e.updateQueue;if(s!==null){if(r=null,e.child!==null)switch(e.child.tag){case 5:r=e.child.stateNode;break;case 1:r=e.child.stateNode}Lg(e,s,r)}break;case 5:var a=e.stateNode;if(r===null&&e.flags&4){r=a;var l=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":l.autoFocus&&r.focus();break;case"img":l.src&&(r.src=l.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var u=e.alternate;if(u!==null){var d=u.memoizedState;if(d!==null){var h=d.dehydrated;h!==null&&xa(h)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(le(163))}Gt||e.flags&512&&fh(e)}catch(f){wt(e,e.return,f)}}if(e===t){ve=null;break}if(r=e.sibling,r!==null){r.return=e.return,ve=r;break}ve=e.return}}function tm(t){for(;ve!==null;){var e=ve;if(e===t){ve=null;break}var r=e.sibling;if(r!==null){r.return=e.return,ve=r;break}ve=e.return}}function rm(t){for(;ve!==null;){var e=ve;try{switch(e.tag){case 0:case 11:case 15:var r=e.return;try{Yc(4,e)}catch(l){wt(e,r,l)}break;case 1:var n=e.stateNode;if(typeof n.componentDidMount=="function"){var i=e.return;try{n.componentDidMount()}catch(l){wt(e,i,l)}}var o=e.return;try{fh(e)}catch(l){wt(e,o,l)}break;case 5:var s=e.return;try{fh(e)}catch(l){wt(e,s,l)}}}catch(l){wt(e,e.return,l)}if(e===t){ve=null;break}var a=e.sibling;if(a!==null){a.return=e.return,ve=a;break}ve=e.return}}var V2=Math.ceil,yc=Sn.ReactCurrentDispatcher,Rf=Sn.ReactCurrentOwner,Sr=Sn.ReactCurrentBatchConfig,Ve=0,At=null,Et=null,Dt=0,lr=0,Ho=ni(0),Nt=0,Ra=null,zi=0,Xc=0,Af=0,ca=null,er=null,Pf=0,is=1/0,dn=null,bc=!1,mh=null,Yn=null,wl=!1,Hn=null,xc=0,ua=0,vh=null,Yl=-1,Xl=0;function Yt(){return Ve&6?St():Yl!==-1?Yl:Yl=St()}function Xn(t){return t.mode&1?Ve&2&&Dt!==0?Dt&-Dt:N2.transition!==null?(Xl===0&&(Xl=Cy()),Xl):(t=Je,t!==0||(t=window.event,t=t===void 0?16:$y(t.type)),t):1}function Fr(t,e,r,n){if(50<ua)throw ua=0,vh=null,Error(le(185));za(t,r,n),(!(Ve&2)||t!==At)&&(t===At&&(!(Ve&2)&&(Xc|=r),Nt===4&&zn(t,Dt)),ir(t,n),r===1&&Ve===0&&!(e.mode&1)&&(is=St()+500,Vc&&ii()))}function ir(t,e){var r=t.callbackNode;N_(t,e);var n=nc(t,t===At?Dt:0);if(n===0)r!==null&&dg(r),t.callbackNode=null,t.callbackPriority=0;else if(e=n&-n,t.callbackPriority!==e){if(r!=null&&dg(r),e===1)t.tag===0?T2(nm.bind(null,t)):Qy(nm.bind(null,t)),k2(function(){!(Ve&6)&&ii()}),r=null;else{switch(Ty(n)){case 1:r=of;break;case 4:r=jy;break;case 16:r=rc;break;case 536870912:r=Ey;break;default:r=rc}r=Zb(r,Gb.bind(null,t))}t.callbackPriority=e,t.callbackNode=r}}function Gb(t,e){if(Yl=-1,Xl=0,Ve&6)throw Error(le(327));var r=t.callbackNode;if(Xo()&&t.callbackNode!==r)return null;var n=nc(t,t===At?Dt:0);if(n===0)return null;if(n&30||n&t.expiredLanes||e)e=wc(t,n);else{e=n;var i=Ve;Ve|=2;var o=Vb();(At!==t||Dt!==e)&&(dn=null,is=St()+500,Ai(t,e));do try{Y2();break}catch(a){Wb(t,a)}while(!0);yf(),yc.current=o,Ve=i,Et!==null?e=0:(At=null,Dt=0,e=Nt)}if(e!==0){if(e===2&&(i=Gd(t),i!==0&&(n=i,e=yh(t,i))),e===1)throw r=Ra,Ai(t,0),zn(t,n),ir(t,St()),r;if(e===6)zn(t,n);else{if(i=t.current.alternate,!(n&30)&&!q2(i)&&(e=wc(t,n),e===2&&(o=Gd(t),o!==0&&(n=o,e=yh(t,o))),e===1))throw r=Ra,Ai(t,0),zn(t,n),ir(t,St()),r;switch(t.finishedWork=i,t.finishedLanes=n,e){case 0:case 1:throw Error(le(345));case 2:_i(t,er,dn);break;case 3:if(zn(t,n),(n&130023424)===n&&(e=Pf+500-St(),10<e)){if(nc(t,0)!==0)break;if(i=t.suspendedLanes,(i&n)!==n){Yt(),t.pingedLanes|=t.suspendedLanes&i;break}t.timeoutHandle=Jd(_i.bind(null,t,er,dn),e);break}_i(t,er,dn);break;case 4:if(zn(t,n),(n&4194240)===n)break;for(e=t.eventTimes,i=-1;0<n;){var s=31-zr(n);o=1<<s,s=e[s],s>i&&(i=s),n&=~o}if(n=i,n=St()-n,n=(120>n?120:480>n?480:1080>n?1080:1920>n?1920:3e3>n?3e3:4320>n?4320:1960*V2(n/1960))-n,10<n){t.timeoutHandle=Jd(_i.bind(null,t,er,dn),n);break}_i(t,er,dn);break;case 5:_i(t,er,dn);break;default:throw Error(le(329))}}}return ir(t,St()),t.callbackNode===r?Gb.bind(null,t):null}function yh(t,e){var r=ca;return t.current.memoizedState.isDehydrated&&(Ai(t,e).flags|=256),t=wc(t,e),t!==2&&(e=er,er=r,e!==null&&bh(e)),t}function bh(t){er===null?er=t:er.push.apply(er,t)}function q2(t){for(var e=t;;){if(e.flags&16384){var r=e.updateQueue;if(r!==null&&(r=r.stores,r!==null))for(var n=0;n<r.length;n++){var i=r[n],o=i.getSnapshot;i=i.value;try{if(!Br(o(),i))return!1}catch{return!1}}}if(r=e.child,e.subtreeFlags&16384&&r!==null)r.return=e,e=r;else{if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function zn(t,e){for(e&=~Af,e&=~Xc,t.suspendedLanes|=e,t.pingedLanes&=~e,t=t.expirationTimes;0<e;){var r=31-zr(e),n=1<<r;t[r]=-1,e&=~n}}function nm(t){if(Ve&6)throw Error(le(327));Xo();var e=nc(t,0);if(!(e&1))return ir(t,St()),null;var r=wc(t,e);if(t.tag!==0&&r===2){var n=Gd(t);n!==0&&(e=n,r=yh(t,n))}if(r===1)throw r=Ra,Ai(t,0),zn(t,e),ir(t,St()),r;if(r===6)throw Error(le(345));return t.finishedWork=t.current.alternate,t.finishedLanes=e,_i(t,er,dn),ir(t,St()),null}function $f(t,e){var r=Ve;Ve|=1;try{return t(e)}finally{Ve=r,Ve===0&&(is=St()+500,Vc&&ii())}}function Fi(t){Hn!==null&&Hn.tag===0&&!(Ve&6)&&Xo();var e=Ve;Ve|=1;var r=Sr.transition,n=Je;try{if(Sr.transition=null,Je=1,t)return t()}finally{Je=n,Sr.transition=r,Ve=e,!(Ve&6)&&ii()}}function If(){lr=Ho.current,lt(Ho)}function Ai(t,e){t.finishedWork=null,t.finishedLanes=0;var r=t.timeoutHandle;if(r!==-1&&(t.timeoutHandle=-1,S2(r)),Et!==null)for(r=Et.return;r!==null;){var n=r;switch(gf(n),n.tag){case 1:n=n.type.childContextTypes,n!=null&&lc();break;case 3:rs(),lt(rr),lt(Wt),kf();break;case 5:Sf(n);break;case 4:rs();break;case 13:lt(mt);break;case 19:lt(mt);break;case 10:bf(n.type._context);break;case 22:case 23:If()}r=r.return}if(At=t,Et=t=Zn(t.current,null),Dt=lr=e,Nt=0,Ra=null,Af=Xc=zi=0,er=ca=null,Ti!==null){for(e=0;e<Ti.length;e++)if(r=Ti[e],n=r.interleaved,n!==null){r.interleaved=null;var i=n.next,o=r.pending;if(o!==null){var s=o.next;o.next=i,n.next=s}r.pending=n}Ti=null}return t}function Wb(t,e){do{var r=Et;try{if(yf(),Vl.current=vc,mc){for(var n=vt.memoizedState;n!==null;){var i=n.queue;i!==null&&(i.pending=null),n=n.next}mc=!1}if(Li=0,Rt=Tt=vt=null,aa=!1,Ta=0,Rf.current=null,r===null||r.return===null){Nt=1,Ra=e,Et=null;break}e:{var o=t,s=r.return,a=r,l=e;if(e=Dt,a.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){var u=l,d=a,h=d.tag;if(!(d.mode&1)&&(h===0||h===11||h===15)){var f=d.alternate;f?(d.updateQueue=f.updateQueue,d.memoizedState=f.memoizedState,d.lanes=f.lanes):(d.updateQueue=null,d.memoizedState=null)}var p=Gg(s);if(p!==null){p.flags&=-257,Wg(p,s,a,o,e),p.mode&1&&Hg(o,u,e),e=p,l=u;var v=e.updateQueue;if(v===null){var g=new Set;g.add(l),e.updateQueue=g}else v.add(l);break e}else{if(!(e&1)){Hg(o,u,e),Mf();break e}l=Error(le(426))}}else if(pt&&a.mode&1){var b=Gg(s);if(b!==null){!(b.flags&65536)&&(b.flags|=256),Wg(b,s,a,o,e),mf(ns(l,a));break e}}o=l=ns(l,a),Nt!==4&&(Nt=2),ca===null?ca=[o]:ca.push(o),o=s;do{switch(o.tag){case 3:o.flags|=65536,e&=-e,o.lanes|=e;var m=Tb(o,l,e);Dg(o,m);break e;case 1:a=l;var y=o.type,x=o.stateNode;if(!(o.flags&128)&&(typeof y.getDerivedStateFromError=="function"||x!==null&&typeof x.componentDidCatch=="function"&&(Yn===null||!Yn.has(x)))){o.flags|=65536,e&=-e,o.lanes|=e;var w=Nb(o,a,e);Dg(o,w);break e}}o=o.return}while(o!==null)}Kb(r)}catch(j){e=j,Et===r&&r!==null&&(Et=r=r.return);continue}break}while(!0)}function Vb(){var t=yc.current;return yc.current=vc,t===null?vc:t}function Mf(){(Nt===0||Nt===3||Nt===2)&&(Nt=4),At===null||!(zi&268435455)&&!(Xc&268435455)||zn(At,Dt)}function wc(t,e){var r=Ve;Ve|=2;var n=Vb();(At!==t||Dt!==e)&&(dn=null,Ai(t,e));do try{K2();break}catch(i){Wb(t,i)}while(!0);if(yf(),Ve=r,yc.current=n,Et!==null)throw Error(le(261));return At=null,Dt=0,Nt}function K2(){for(;Et!==null;)qb(Et)}function Y2(){for(;Et!==null&&!x_();)qb(Et)}function qb(t){var e=Xb(t.alternate,t,lr);t.memoizedProps=t.pendingProps,e===null?Kb(t):Et=e,Rf.current=null}function Kb(t){var e=t;do{var r=e.alternate;if(t=e.return,e.flags&32768){if(r=U2(r,e),r!==null){r.flags&=32767,Et=r;return}if(t!==null)t.flags|=32768,t.subtreeFlags=0,t.deletions=null;else{Nt=6,Et=null;return}}else if(r=B2(r,e,lr),r!==null){Et=r;return}if(e=e.sibling,e!==null){Et=e;return}Et=e=t}while(e!==null);Nt===0&&(Nt=5)}function _i(t,e,r){var n=Je,i=Sr.transition;try{Sr.transition=null,Je=1,X2(t,e,r,n)}finally{Sr.transition=i,Je=n}return null}function X2(t,e,r,n){do Xo();while(Hn!==null);if(Ve&6)throw Error(le(327));r=t.finishedWork;var i=t.finishedLanes;if(r===null)return null;if(t.finishedWork=null,t.finishedLanes=0,r===t.current)throw Error(le(177));t.callbackNode=null,t.callbackPriority=0;var o=r.lanes|r.childLanes;if(O_(t,o),t===At&&(Et=At=null,Dt=0),!(r.subtreeFlags&2064)&&!(r.flags&2064)||wl||(wl=!0,Zb(rc,function(){return Xo(),null})),o=(r.flags&15990)!==0,r.subtreeFlags&15990||o){o=Sr.transition,Sr.transition=null;var s=Je;Je=1;var a=Ve;Ve|=4,Rf.current=null,G2(t,r),Ub(r,t),m2(Xd),ic=!!Yd,Xd=Yd=null,t.current=r,W2(r),w_(),Ve=a,Je=s,Sr.transition=o}else t.current=r;if(wl&&(wl=!1,Hn=t,xc=i),o=t.pendingLanes,o===0&&(Yn=null),k_(r.stateNode),ir(t,St()),e!==null)for(n=t.onRecoverableError,r=0;r<e.length;r++)i=e[r],n(i.value,{componentStack:i.stack,digest:i.digest});if(bc)throw bc=!1,t=mh,mh=null,t;return xc&1&&t.tag!==0&&Xo(),o=t.pendingLanes,o&1?t===vh?ua++:(ua=0,vh=t):ua=0,ii(),null}function Xo(){if(Hn!==null){var t=Ty(xc),e=Sr.transition,r=Je;try{if(Sr.transition=null,Je=16>t?16:t,Hn===null)var n=!1;else{if(t=Hn,Hn=null,xc=0,Ve&6)throw Error(le(331));var i=Ve;for(Ve|=4,ve=t.current;ve!==null;){var o=ve,s=o.child;if(ve.flags&16){var a=o.deletions;if(a!==null){for(var l=0;l<a.length;l++){var u=a[l];for(ve=u;ve!==null;){var d=ve;switch(d.tag){case 0:case 11:case 15:la(8,d,o)}var h=d.child;if(h!==null)h.return=d,ve=h;else for(;ve!==null;){d=ve;var f=d.sibling,p=d.return;if(zb(d),d===u){ve=null;break}if(f!==null){f.return=p,ve=f;break}ve=p}}}var v=o.alternate;if(v!==null){var g=v.child;if(g!==null){v.child=null;do{var b=g.sibling;g.sibling=null,g=b}while(g!==null)}}ve=o}}if(o.subtreeFlags&2064&&s!==null)s.return=o,ve=s;else e:for(;ve!==null;){if(o=ve,o.flags&2048)switch(o.tag){case 0:case 11:case 15:la(9,o,o.return)}var m=o.sibling;if(m!==null){m.return=o.return,ve=m;break e}ve=o.return}}var y=t.current;for(ve=y;ve!==null;){s=ve;var x=s.child;if(s.subtreeFlags&2064&&x!==null)x.return=s,ve=x;else e:for(s=y;ve!==null;){if(a=ve,a.flags&2048)try{switch(a.tag){case 0:case 11:case 15:Yc(9,a)}}catch(j){wt(a,a.return,j)}if(a===s){ve=null;break e}var w=a.sibling;if(w!==null){w.return=a.return,ve=w;break e}ve=a.return}}if(Ve=i,ii(),Jr&&typeof Jr.onPostCommitFiberRoot=="function")try{Jr.onPostCommitFiberRoot(Bc,t)}catch{}n=!0}return n}finally{Je=r,Sr.transition=e}}return!1}function im(t,e,r){e=ns(r,e),e=Tb(t,e,1),t=Kn(t,e,1),e=Yt(),t!==null&&(za(t,1,e),ir(t,e))}function wt(t,e,r){if(t.tag===3)im(t,t,r);else for(;e!==null;){if(e.tag===3){im(e,t,r);break}else if(e.tag===1){var n=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof n.componentDidCatch=="function"&&(Yn===null||!Yn.has(n))){t=ns(r,t),t=Nb(e,t,1),e=Kn(e,t,1),t=Yt(),e!==null&&(za(e,1,t),ir(e,t));break}}e=e.return}}function Z2(t,e,r){var n=t.pingCache;n!==null&&n.delete(e),e=Yt(),t.pingedLanes|=t.suspendedLanes&r,At===t&&(Dt&r)===r&&(Nt===4||Nt===3&&(Dt&130023424)===Dt&&500>St()-Pf?Ai(t,0):Af|=r),ir(t,e)}function Yb(t,e){e===0&&(t.mode&1?(e=dl,dl<<=1,!(dl&130023424)&&(dl=4194304)):e=1);var r=Yt();t=wn(t,e),t!==null&&(za(t,e,r),ir(t,r))}function J2(t){var e=t.memoizedState,r=0;e!==null&&(r=e.retryLane),Yb(t,r)}function Q2(t,e){var r=0;switch(t.tag){case 13:var n=t.stateNode,i=t.memoizedState;i!==null&&(r=i.retryLane);break;case 19:n=t.stateNode;break;default:throw Error(le(314))}n!==null&&n.delete(e),Yb(t,r)}var Xb;Xb=function(t,e,r){if(t!==null)if(t.memoizedProps!==e.pendingProps||rr.current)tr=!0;else{if(!(t.lanes&r)&&!(e.flags&128))return tr=!1,F2(t,e,r);tr=!!(t.flags&131072)}else tr=!1,pt&&e.flags&1048576&&eb(e,dc,e.index);switch(e.lanes=0,e.tag){case 2:var n=e.type;Kl(t,e),t=e.pendingProps;var i=Qo(e,Wt.current);Yo(e,r),i=Ef(null,e,n,t,i,r);var o=Cf();return e.flags|=1,typeof i=="object"&&i!==null&&typeof i.render=="function"&&i.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,nr(n)?(o=!0,cc(e)):o=!1,e.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,wf(e),i.updater=Kc,e.stateNode=i,i._reactInternals=e,oh(e,n,t,r),e=lh(null,e,n,!0,o,r)):(e.tag=0,pt&&o&&pf(e),qt(null,e,i,r),e=e.child),e;case 16:n=e.elementType;e:{switch(Kl(t,e),t=e.pendingProps,i=n._init,n=i(n._payload),e.type=n,i=e.tag=tS(n),t=Pr(n,t),i){case 0:e=ah(null,e,n,t,r);break e;case 1:e=Kg(null,e,n,t,r);break e;case 11:e=Vg(null,e,n,t,r);break e;case 14:e=qg(null,e,n,Pr(n.type,t),r);break e}throw Error(le(306,n,""))}return e;case 0:return n=e.type,i=e.pendingProps,i=e.elementType===n?i:Pr(n,i),ah(t,e,n,i,r);case 1:return n=e.type,i=e.pendingProps,i=e.elementType===n?i:Pr(n,i),Kg(t,e,n,i,r);case 3:e:{if(Pb(e),t===null)throw Error(le(387));n=e.pendingProps,o=e.memoizedState,i=o.element,sb(t,e),pc(e,n,null,r);var s=e.memoizedState;if(n=s.element,o.isDehydrated)if(o={element:n,isDehydrated:!1,cache:s.cache,pendingSuspenseBoundaries:s.pendingSuspenseBoundaries,transitions:s.transitions},e.updateQueue.baseState=o,e.memoizedState=o,e.flags&256){i=ns(Error(le(423)),e),e=Yg(t,e,n,r,i);break e}else if(n!==i){i=ns(Error(le(424)),e),e=Yg(t,e,n,r,i);break e}else for(dr=qn(e.stateNode.containerInfo.firstChild),pr=e,pt=!0,Dr=null,r=ib(e,null,n,r),e.child=r;r;)r.flags=r.flags&-3|4096,r=r.sibling;else{if(es(),n===i){e=_n(t,e,r);break e}qt(t,e,n,r)}e=e.child}return e;case 5:return ab(e),t===null&&rh(e),n=e.type,i=e.pendingProps,o=t!==null?t.memoizedProps:null,s=i.children,Zd(n,i)?s=null:o!==null&&Zd(n,o)&&(e.flags|=32),Ab(t,e),qt(t,e,s,r),e.child;case 6:return t===null&&rh(e),null;case 13:return $b(t,e,r);case 4:return _f(e,e.stateNode.containerInfo),n=e.pendingProps,t===null?e.child=ts(e,null,n,r):qt(t,e,n,r),e.child;case 11:return n=e.type,i=e.pendingProps,i=e.elementType===n?i:Pr(n,i),Vg(t,e,n,i,r);case 7:return qt(t,e,e.pendingProps,r),e.child;case 8:return qt(t,e,e.pendingProps.children,r),e.child;case 12:return qt(t,e,e.pendingProps.children,r),e.child;case 10:e:{if(n=e.type._context,i=e.pendingProps,o=e.memoizedProps,s=i.value,it(hc,n._currentValue),n._currentValue=s,o!==null)if(Br(o.value,s)){if(o.children===i.children&&!rr.current){e=_n(t,e,r);break e}}else for(o=e.child,o!==null&&(o.return=e);o!==null;){var a=o.dependencies;if(a!==null){s=o.child;for(var l=a.firstContext;l!==null;){if(l.context===n){if(o.tag===1){l=vn(-1,r&-r),l.tag=2;var u=o.updateQueue;if(u!==null){u=u.shared;var d=u.pending;d===null?l.next=l:(l.next=d.next,d.next=l),u.pending=l}}o.lanes|=r,l=o.alternate,l!==null&&(l.lanes|=r),nh(o.return,r,e),a.lanes|=r;break}l=l.next}}else if(o.tag===10)s=o.type===e.type?null:o.child;else if(o.tag===18){if(s=o.return,s===null)throw Error(le(341));s.lanes|=r,a=s.alternate,a!==null&&(a.lanes|=r),nh(s,r,e),s=o.sibling}else s=o.child;if(s!==null)s.return=o;else for(s=o;s!==null;){if(s===e){s=null;break}if(o=s.sibling,o!==null){o.return=s.return,s=o;break}s=s.return}o=s}qt(t,e,i.children,r),e=e.child}return e;case 9:return i=e.type,n=e.pendingProps.children,Yo(e,r),i=kr(i),n=n(i),e.flags|=1,qt(t,e,n,r),e.child;case 14:return n=e.type,i=Pr(n,e.pendingProps),i=Pr(n.type,i),qg(t,e,n,i,r);case 15:return Ob(t,e,e.type,e.pendingProps,r);case 17:return n=e.type,i=e.pendingProps,i=e.elementType===n?i:Pr(n,i),Kl(t,e),e.tag=1,nr(n)?(t=!0,cc(e)):t=!1,Yo(e,r),Cb(e,n,i),oh(e,n,i,r),lh(null,e,n,!0,t,r);case 19:return Ib(t,e,r);case 22:return Rb(t,e,r)}throw Error(le(156,e.tag))};function Zb(t,e){return ky(t,e)}function eS(t,e,r,n){this.tag=t,this.key=r,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=n,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function _r(t,e,r,n){return new eS(t,e,r,n)}function Df(t){return t=t.prototype,!(!t||!t.isReactComponent)}function tS(t){if(typeof t=="function")return Df(t)?1:0;if(t!=null){if(t=t.$$typeof,t===tf)return 11;if(t===rf)return 14}return 2}function Zn(t,e){var r=t.alternate;return r===null?(r=_r(t.tag,e,t.key,t.mode),r.elementType=t.elementType,r.type=t.type,r.stateNode=t.stateNode,r.alternate=t,t.alternate=r):(r.pendingProps=e,r.type=t.type,r.flags=0,r.subtreeFlags=0,r.deletions=null),r.flags=t.flags&14680064,r.childLanes=t.childLanes,r.lanes=t.lanes,r.child=t.child,r.memoizedProps=t.memoizedProps,r.memoizedState=t.memoizedState,r.updateQueue=t.updateQueue,e=t.dependencies,r.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},r.sibling=t.sibling,r.index=t.index,r.ref=t.ref,r}function Zl(t,e,r,n,i,o){var s=2;if(n=t,typeof t=="function")Df(t)&&(s=1);else if(typeof t=="string")s=5;else e:switch(t){case Po:return Pi(r.children,i,o,e);case ef:s=8,i|=8;break;case Nd:return t=_r(12,r,e,i|2),t.elementType=Nd,t.lanes=o,t;case Od:return t=_r(13,r,e,i),t.elementType=Od,t.lanes=o,t;case Rd:return t=_r(19,r,e,i),t.elementType=Rd,t.lanes=o,t;case ay:return Zc(r,i,o,e);default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case oy:s=10;break e;case sy:s=9;break e;case tf:s=11;break e;case rf:s=14;break e;case In:s=16,n=null;break e}throw Error(le(130,t==null?t:typeof t,""))}return e=_r(s,r,e,i),e.elementType=t,e.type=n,e.lanes=o,e}function Pi(t,e,r,n){return t=_r(7,t,n,e),t.lanes=r,t}function Zc(t,e,r,n){return t=_r(22,t,n,e),t.elementType=ay,t.lanes=r,t.stateNode={isHidden:!1},t}function Xu(t,e,r){return t=_r(6,t,null,e),t.lanes=r,t}function Zu(t,e,r){return e=_r(4,t.children!==null?t.children:[],t.key,e),e.lanes=r,e.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},e}function rS(t,e,r,n,i){this.tag=e,this.containerInfo=t,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Ru(0),this.expirationTimes=Ru(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Ru(0),this.identifierPrefix=n,this.onRecoverableError=i,this.mutableSourceEagerHydrationData=null}function Lf(t,e,r,n,i,o,s,a,l){return t=new rS(t,e,r,a,l),e===1?(e=1,o===!0&&(e|=8)):e=0,o=_r(3,null,null,e),t.current=o,o.stateNode=t,o.memoizedState={element:n,isDehydrated:r,cache:null,transitions:null,pendingSuspenseBoundaries:null},wf(o),t}function nS(t,e,r){var n=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Ao,key:n==null?null:""+n,children:t,containerInfo:e,implementation:r}}function Jb(t){if(!t)return Qn;t=t._reactInternals;e:{if(Hi(t)!==t||t.tag!==1)throw Error(le(170));var e=t;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(nr(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(le(171))}if(t.tag===1){var r=t.type;if(nr(r))return Jy(t,r,e)}return e}function Qb(t,e,r,n,i,o,s,a,l){return t=Lf(r,n,!0,t,i,o,s,a,l),t.context=Jb(null),r=t.current,n=Yt(),i=Xn(r),o=vn(n,i),o.callback=e??null,Kn(r,o,i),t.current.lanes=i,za(t,i,n),ir(t,n),t}function Jc(t,e,r,n){var i=e.current,o=Yt(),s=Xn(i);return r=Jb(r),e.context===null?e.context=r:e.pendingContext=r,e=vn(o,s),e.payload={element:t},n=n===void 0?null:n,n!==null&&(e.callback=n),t=Kn(i,e,s),t!==null&&(Fr(t,i,s,o),Wl(t,i,s)),s}function _c(t){if(t=t.current,!t.child)return null;switch(t.child.tag){case 5:return t.child.stateNode;default:return t.child.stateNode}}function om(t,e){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var r=t.retryLane;t.retryLane=r!==0&&r<e?r:e}}function zf(t,e){om(t,e),(t=t.alternate)&&om(t,e)}function iS(){return null}var ex=typeof reportError=="function"?reportError:function(t){console.error(t)};function Ff(t){this._internalRoot=t}Qc.prototype.render=Ff.prototype.render=function(t){var e=this._internalRoot;if(e===null)throw Error(le(409));Jc(t,e,null,null)};Qc.prototype.unmount=Ff.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var e=t.containerInfo;Fi(function(){Jc(null,t,null,null)}),e[xn]=null}};function Qc(t){this._internalRoot=t}Qc.prototype.unstable_scheduleHydration=function(t){if(t){var e=Ry();t={blockedOn:null,target:t,priority:e};for(var r=0;r<Ln.length&&e!==0&&e<Ln[r].priority;r++);Ln.splice(r,0,t),r===0&&Py(t)}};function Bf(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function eu(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11&&(t.nodeType!==8||t.nodeValue!==" react-mount-point-unstable "))}function sm(){}function oS(t,e,r,n,i){if(i){if(typeof n=="function"){var o=n;n=function(){var u=_c(s);o.call(u)}}var s=Qb(e,n,t,0,null,!1,!1,"",sm);return t._reactRootContainer=s,t[xn]=s.current,Sa(t.nodeType===8?t.parentNode:t),Fi(),s}for(;i=t.lastChild;)t.removeChild(i);if(typeof n=="function"){var a=n;n=function(){var u=_c(l);a.call(u)}}var l=Lf(t,0,!1,null,null,!1,!1,"",sm);return t._reactRootContainer=l,t[xn]=l.current,Sa(t.nodeType===8?t.parentNode:t),Fi(function(){Jc(e,l,r,n)}),l}function tu(t,e,r,n,i){var o=r._reactRootContainer;if(o){var s=o;if(typeof i=="function"){var a=i;i=function(){var l=_c(s);a.call(l)}}Jc(e,s,t,i)}else s=oS(r,e,t,i,n);return _c(s)}Ny=function(t){switch(t.tag){case 3:var e=t.stateNode;if(e.current.memoizedState.isDehydrated){var r=Xs(e.pendingLanes);r!==0&&(sf(e,r|1),ir(e,St()),!(Ve&6)&&(is=St()+500,ii()))}break;case 13:Fi(function(){var n=wn(t,1);if(n!==null){var i=Yt();Fr(n,t,1,i)}}),zf(t,1)}};af=function(t){if(t.tag===13){var e=wn(t,134217728);if(e!==null){var r=Yt();Fr(e,t,134217728,r)}zf(t,134217728)}};Oy=function(t){if(t.tag===13){var e=Xn(t),r=wn(t,e);if(r!==null){var n=Yt();Fr(r,t,e,n)}zf(t,e)}};Ry=function(){return Je};Ay=function(t,e){var r=Je;try{return Je=t,e()}finally{Je=r}};Bd=function(t,e,r){switch(e){case"input":if($d(t,r),e=r.name,r.type==="radio"&&e!=null){for(r=t;r.parentNode;)r=r.parentNode;for(r=r.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<r.length;e++){var n=r[e];if(n!==t&&n.form===t.form){var i=Wc(n);if(!i)throw Error(le(90));cy(n),$d(n,i)}}}break;case"textarea":dy(t,r);break;case"select":e=r.value,e!=null&&Wo(t,!!r.multiple,e,!1)}};yy=$f;by=Fi;var sS={usingClientEntryPoint:!1,Events:[Ba,Do,Wc,my,vy,$f]},Bs={findFiberByHostInstance:Ci,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},aS={bundleType:Bs.bundleType,version:Bs.version,rendererPackageName:Bs.rendererPackageName,rendererConfig:Bs.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Sn.ReactCurrentDispatcher,findHostInstanceByFiber:function(t){return t=_y(t),t===null?null:t.stateNode},findFiberByHostInstance:Bs.findFiberByHostInstance||iS,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var _l=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!_l.isDisabled&&_l.supportsFiber)try{Bc=_l.inject(aS),Jr=_l}catch{}}vr.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=sS;vr.createPortal=function(t,e){var r=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Bf(e))throw Error(le(200));return nS(t,e,null,r)};vr.createRoot=function(t,e){if(!Bf(t))throw Error(le(299));var r=!1,n="",i=ex;return e!=null&&(e.unstable_strictMode===!0&&(r=!0),e.identifierPrefix!==void 0&&(n=e.identifierPrefix),e.onRecoverableError!==void 0&&(i=e.onRecoverableError)),e=Lf(t,1,!1,null,null,r,!1,n,i),t[xn]=e.current,Sa(t.nodeType===8?t.parentNode:t),new Ff(e)};vr.findDOMNode=function(t){if(t==null)return null;if(t.nodeType===1)return t;var e=t._reactInternals;if(e===void 0)throw typeof t.render=="function"?Error(le(188)):(t=Object.keys(t).join(","),Error(le(268,t)));return t=_y(e),t=t===null?null:t.stateNode,t};vr.flushSync=function(t){return Fi(t)};vr.hydrate=function(t,e,r){if(!eu(e))throw Error(le(200));return tu(null,t,e,!0,r)};vr.hydrateRoot=function(t,e,r){if(!Bf(t))throw Error(le(405));var n=r!=null&&r.hydratedSources||null,i=!1,o="",s=ex;if(r!=null&&(r.unstable_strictMode===!0&&(i=!0),r.identifierPrefix!==void 0&&(o=r.identifierPrefix),r.onRecoverableError!==void 0&&(s=r.onRecoverableError)),e=Qb(e,null,t,1,r??null,i,!1,o,s),t[xn]=e.current,Sa(t),n)for(t=0;t<n.length;t++)r=n[t],i=r._getVersion,i=i(r._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[r,i]:e.mutableSourceEagerHydrationData.push(r,i);return new Qc(e)};vr.render=function(t,e,r){if(!eu(e))throw Error(le(200));return tu(null,t,e,!1,r)};vr.unmountComponentAtNode=function(t){if(!eu(t))throw Error(le(40));return t._reactRootContainer?(Fi(function(){tu(null,null,t,!1,function(){t._reactRootContainer=null,t[xn]=null})}),!0):!1};vr.unstable_batchedUpdates=$f;vr.unstable_renderSubtreeIntoContainer=function(t,e,r,n){if(!eu(r))throw Error(le(200));if(t==null||t._reactInternals===void 0)throw Error(le(38));return tu(t,e,r,!1,n)};vr.version="18.3.1-next-f1338f8080-20240426";function tx(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(tx)}catch(t){console.error(t)}}tx(),ty.exports=vr;var lS=ty.exports,am=lS;Cd.createRoot=am.createRoot,Cd.hydrateRoot=am.hydrateRoot;var xh=function(t,e){return xh=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(r,n){r.__proto__=n}||function(r,n){for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(r[i]=n[i])},xh(t,e)};function rx(t,e){if(typeof e!="function"&&e!==null)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");xh(t,e);function r(){this.constructor=t}t.prototype=e===null?Object.create(e):(r.prototype=e.prototype,new r)}var Sc=function(){return Sc=Object.assign||function(e){for(var r,n=1,i=arguments.length;n<i;n++){r=arguments[n];for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(e[o]=r[o])}return e},Sc.apply(this,arguments)};function cs(t,e){var r={};for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&e.indexOf(n)<0&&(r[n]=t[n]);if(t!=null&&typeof Object.getOwnPropertySymbols=="function")for(var i=0,n=Object.getOwnPropertySymbols(t);i<n.length;i++)e.indexOf(n[i])<0&&Object.prototype.propertyIsEnumerable.call(t,n[i])&&(r[n[i]]=t[n[i]]);return r}function nx(t,e,r,n){var i=arguments.length,o=i<3?e:n===null?n=Object.getOwnPropertyDescriptor(e,r):n,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,r,n);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(i<3?s(o):i>3?s(e,r,o):s(e,r))||o);return i>3&&o&&Object.defineProperty(e,r,o),o}function ix(t,e){return function(r,n){e(r,n,t)}}function ox(t,e,r,n,i,o){function s(m){if(m!==void 0&&typeof m!="function")throw new TypeError("Function expected");return m}for(var a=n.kind,l=a==="getter"?"get":a==="setter"?"set":"value",u=!e&&t?n.static?t:t.prototype:null,d=e||(u?Object.getOwnPropertyDescriptor(u,n.name):{}),h,f=!1,p=r.length-1;p>=0;p--){var v={};for(var g in n)v[g]=g==="access"?{}:n[g];for(var g in n.access)v.access[g]=n.access[g];v.addInitializer=function(m){if(f)throw new TypeError("Cannot add initializers after decoration has completed");o.push(s(m||null))};var b=(0,r[p])(a==="accessor"?{get:d.get,set:d.set}:d[l],v);if(a==="accessor"){if(b===void 0)continue;if(b===null||typeof b!="object")throw new TypeError("Object expected");(h=s(b.get))&&(d.get=h),(h=s(b.set))&&(d.set=h),(h=s(b.init))&&i.unshift(h)}else(h=s(b))&&(a==="field"?i.unshift(h):d[l]=h)}u&&Object.defineProperty(u,n.name,d),f=!0}function sx(t,e,r){for(var n=arguments.length>2,i=0;i<e.length;i++)r=n?e[i].call(t,r):e[i].call(t);return n?r:void 0}function ax(t){return typeof t=="symbol"?t:"".concat(t)}function lx(t,e,r){return typeof e=="symbol"&&(e=e.description?"[".concat(e.description,"]"):""),Object.defineProperty(t,"name",{configurable:!0,value:r?"".concat(r," ",e):e})}function cx(t,e){if(typeof Reflect=="object"&&typeof Reflect.metadata=="function")return Reflect.metadata(t,e)}function we(t,e,r,n){function i(o){return o instanceof r?o:new r(function(s){s(o)})}return new(r||(r=Promise))(function(o,s){function a(d){try{u(n.next(d))}catch(h){s(h)}}function l(d){try{u(n.throw(d))}catch(h){s(h)}}function u(d){d.done?o(d.value):i(d.value).then(a,l)}u((n=n.apply(t,e||[])).next())})}function ux(t,e){var r={label:0,sent:function(){if(o[0]&1)throw o[1];return o[1]},trys:[],ops:[]},n,i,o,s=Object.create((typeof Iterator=="function"?Iterator:Object).prototype);return s.next=a(0),s.throw=a(1),s.return=a(2),typeof Symbol=="function"&&(s[Symbol.iterator]=function(){return this}),s;function a(u){return function(d){return l([u,d])}}function l(u){if(n)throw new TypeError("Generator is already executing.");for(;s&&(s=0,u[0]&&(r=0)),r;)try{if(n=1,i&&(o=u[0]&2?i.return:u[0]?i.throw||((o=i.return)&&o.call(i),0):i.next)&&!(o=o.call(i,u[1])).done)return o;switch(i=0,o&&(u=[u[0]&2,o.value]),u[0]){case 0:case 1:o=u;break;case 4:return r.label++,{value:u[1],done:!1};case 5:r.label++,i=u[1],u=[0];continue;case 7:u=r.ops.pop(),r.trys.pop();continue;default:if(o=r.trys,!(o=o.length>0&&o[o.length-1])&&(u[0]===6||u[0]===2)){r=0;continue}if(u[0]===3&&(!o||u[1]>o[0]&&u[1]<o[3])){r.label=u[1];break}if(u[0]===6&&r.label<o[1]){r.label=o[1],o=u;break}if(o&&r.label<o[2]){r.label=o[2],r.ops.push(u);break}o[2]&&r.ops.pop(),r.trys.pop();continue}u=e.call(t,r)}catch(d){u=[6,d],i=0}finally{n=o=0}if(u[0]&5)throw u[1];return{value:u[0]?u[1]:void 0,done:!0}}}var ru=Object.create?function(t,e,r,n){n===void 0&&(n=r);var i=Object.getOwnPropertyDescriptor(e,r);(!i||("get"in i?!e.__esModule:i.writable||i.configurable))&&(i={enumerable:!0,get:function(){return e[r]}}),Object.defineProperty(t,n,i)}:function(t,e,r,n){n===void 0&&(n=r),t[n]=e[r]};function dx(t,e){for(var r in t)r!=="default"&&!Object.prototype.hasOwnProperty.call(e,r)&&ru(e,t,r)}function kc(t){var e=typeof Symbol=="function"&&Symbol.iterator,r=e&&t[e],n=0;if(r)return r.call(t);if(t&&typeof t.length=="number")return{next:function(){return t&&n>=t.length&&(t=void 0),{value:t&&t[n++],done:!t}}};throw new TypeError(e?"Object is not iterable.":"Symbol.iterator is not defined.")}function Uf(t,e){var r=typeof Symbol=="function"&&t[Symbol.iterator];if(!r)return t;var n=r.call(t),i,o=[],s;try{for(;(e===void 0||e-- >0)&&!(i=n.next()).done;)o.push(i.value)}catch(a){s={error:a}}finally{try{i&&!i.done&&(r=n.return)&&r.call(n)}finally{if(s)throw s.error}}return o}function hx(){for(var t=[],e=0;e<arguments.length;e++)t=t.concat(Uf(arguments[e]));return t}function fx(){for(var t=0,e=0,r=arguments.length;e<r;e++)t+=arguments[e].length;for(var n=Array(t),i=0,e=0;e<r;e++)for(var o=arguments[e],s=0,a=o.length;s<a;s++,i++)n[i]=o[s];return n}function px(t,e,r){if(r||arguments.length===2)for(var n=0,i=e.length,o;n<i;n++)(o||!(n in e))&&(o||(o=Array.prototype.slice.call(e,0,n)),o[n]=e[n]);return t.concat(o||Array.prototype.slice.call(e))}function os(t){return this instanceof os?(this.v=t,this):new os(t)}function gx(t,e,r){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var n=r.apply(t,e||[]),i,o=[];return i=Object.create((typeof AsyncIterator=="function"?AsyncIterator:Object).prototype),a("next"),a("throw"),a("return",s),i[Symbol.asyncIterator]=function(){return this},i;function s(p){return function(v){return Promise.resolve(v).then(p,h)}}function a(p,v){n[p]&&(i[p]=function(g){return new Promise(function(b,m){o.push([p,g,b,m])>1||l(p,g)})},v&&(i[p]=v(i[p])))}function l(p,v){try{u(n[p](v))}catch(g){f(o[0][3],g)}}function u(p){p.value instanceof os?Promise.resolve(p.value.v).then(d,h):f(o[0][2],p)}function d(p){l("next",p)}function h(p){l("throw",p)}function f(p,v){p(v),o.shift(),o.length&&l(o[0][0],o[0][1])}}function mx(t){var e,r;return e={},n("next"),n("throw",function(i){throw i}),n("return"),e[Symbol.iterator]=function(){return this},e;function n(i,o){e[i]=t[i]?function(s){return(r=!r)?{value:os(t[i](s)),done:!1}:o?o(s):s}:o}}function vx(t){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var e=t[Symbol.asyncIterator],r;return e?e.call(t):(t=typeof kc=="function"?kc(t):t[Symbol.iterator](),r={},n("next"),n("throw"),n("return"),r[Symbol.asyncIterator]=function(){return this},r);function n(o){r[o]=t[o]&&function(s){return new Promise(function(a,l){s=t[o](s),i(a,l,s.done,s.value)})}}function i(o,s,a,l){Promise.resolve(l).then(function(u){o({value:u,done:a})},s)}}function yx(t,e){return Object.defineProperty?Object.defineProperty(t,"raw",{value:e}):t.raw=e,t}var cS=Object.create?function(t,e){Object.defineProperty(t,"default",{enumerable:!0,value:e})}:function(t,e){t.default=e},wh=function(t){return wh=Object.getOwnPropertyNames||function(e){var r=[];for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(r[r.length]=n);return r},wh(t)};function bx(t){if(t&&t.__esModule)return t;var e={};if(t!=null)for(var r=wh(t),n=0;n<r.length;n++)r[n]!=="default"&&ru(e,t,r[n]);return cS(e,t),e}function xx(t){return t&&t.__esModule?t:{default:t}}function wx(t,e,r,n){if(r==="a"&&!n)throw new TypeError("Private accessor was defined without a getter");if(typeof e=="function"?t!==e||!n:!e.has(t))throw new TypeError("Cannot read private member from an object whose class did not declare it");return r==="m"?n:r==="a"?n.call(t):n?n.value:e.get(t)}function _x(t,e,r,n,i){if(n==="m")throw new TypeError("Private method is not writable");if(n==="a"&&!i)throw new TypeError("Private accessor was defined without a setter");if(typeof e=="function"?t!==e||!i:!e.has(t))throw new TypeError("Cannot write private member to an object whose class did not declare it");return n==="a"?i.call(t,r):i?i.value=r:e.set(t,r),r}function Sx(t,e){if(e===null||typeof e!="object"&&typeof e!="function")throw new TypeError("Cannot use 'in' operator on non-object");return typeof t=="function"?e===t:t.has(e)}function kx(t,e,r){if(e!=null){if(typeof e!="object"&&typeof e!="function")throw new TypeError("Object expected.");var n,i;if(r){if(!Symbol.asyncDispose)throw new TypeError("Symbol.asyncDispose is not defined.");n=e[Symbol.asyncDispose]}if(n===void 0){if(!Symbol.dispose)throw new TypeError("Symbol.dispose is not defined.");n=e[Symbol.dispose],r&&(i=n)}if(typeof n!="function")throw new TypeError("Object not disposable.");i&&(n=function(){try{i.call(this)}catch(o){return Promise.reject(o)}}),t.stack.push({value:e,dispose:n,async:r})}else r&&t.stack.push({async:!0});return e}var uS=typeof SuppressedError=="function"?SuppressedError:function(t,e,r){var n=new Error(r);return n.name="SuppressedError",n.error=t,n.suppressed=e,n};function jx(t){function e(o){t.error=t.hasError?new uS(o,t.error,"An error was suppressed during disposal."):o,t.hasError=!0}var r,n=0;function i(){for(;r=t.stack.pop();)try{if(!r.async&&n===1)return n=0,t.stack.push(r),Promise.resolve().then(i);if(r.dispose){var o=r.dispose.call(r.value);if(r.async)return n|=2,Promise.resolve(o).then(i,function(s){return e(s),i()})}else n|=1}catch(s){e(s)}if(n===1)return t.hasError?Promise.reject(t.error):Promise.resolve();if(t.hasError)throw t.error}return i()}function Ex(t,e){return typeof t=="string"&&/^\.\.?\//.test(t)?t.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i,function(r,n,i,o,s){return n?e?".jsx":".js":i&&(!o||!s)?r:i+o+"."+s.toLowerCase()+"js"}):t}const dS={__extends:rx,__assign:Sc,__rest:cs,__decorate:nx,__param:ix,__esDecorate:ox,__runInitializers:sx,__propKey:ax,__setFunctionName:lx,__metadata:cx,__awaiter:we,__generator:ux,__createBinding:ru,__exportStar:dx,__values:kc,__read:Uf,__spread:hx,__spreadArrays:fx,__spreadArray:px,__await:os,__asyncGenerator:gx,__asyncDelegator:mx,__asyncValues:vx,__makeTemplateObject:yx,__importStar:bx,__importDefault:xx,__classPrivateFieldGet:wx,__classPrivateFieldSet:_x,__classPrivateFieldIn:Sx,__addDisposableResource:kx,__disposeResources:jx,__rewriteRelativeImportExtension:Ex},hS=Object.freeze(Object.defineProperty({__proto__:null,__addDisposableResource:kx,get __assign(){return Sc},__asyncDelegator:mx,__asyncGenerator:gx,__asyncValues:vx,__await:os,__awaiter:we,__classPrivateFieldGet:wx,__classPrivateFieldIn:Sx,__classPrivateFieldSet:_x,__createBinding:ru,__decorate:nx,__disposeResources:jx,__esDecorate:ox,__exportStar:dx,__extends:rx,__generator:ux,__importDefault:xx,__importStar:bx,__makeTemplateObject:yx,__metadata:cx,__param:ix,__propKey:ax,__read:Uf,__rest:cs,__rewriteRelativeImportExtension:Ex,__runInitializers:sx,__setFunctionName:lx,__spread:hx,__spreadArray:px,__spreadArrays:fx,__values:kc,default:dS},Symbol.toStringTag,{value:"Module"})),fS=t=>t?(...e)=>t(...e):(...e)=>fetch(...e);class Hf extends Error{constructor(e,r="FunctionsError",n){super(e),this.name=r,this.context=n}}class lm extends Hf{constructor(e){super("Failed to send a request to the Edge Function","FunctionsFetchError",e)}}class cm extends Hf{constructor(e){super("Relay Error invoking the Edge Function","FunctionsRelayError",e)}}class um extends Hf{constructor(e){super("Edge Function returned a non-2xx status code","FunctionsHttpError",e)}}var _h;(function(t){t.Any="any",t.ApNortheast1="ap-northeast-1",t.ApNortheast2="ap-northeast-2",t.ApSouth1="ap-south-1",t.ApSoutheast1="ap-southeast-1",t.ApSoutheast2="ap-southeast-2",t.CaCentral1="ca-central-1",t.EuCentral1="eu-central-1",t.EuWest1="eu-west-1",t.EuWest2="eu-west-2",t.EuWest3="eu-west-3",t.SaEast1="sa-east-1",t.UsEast1="us-east-1",t.UsWest1="us-west-1",t.UsWest2="us-west-2"})(_h||(_h={}));class pS{constructor(e,{headers:r={},customFetch:n,region:i=_h.Any}={}){this.url=e,this.headers=r,this.region=i,this.fetch=fS(n)}setAuth(e){this.headers.Authorization=`Bearer ${e}`}invoke(e){return we(this,arguments,void 0,function*(r,n={}){var i;try{const{headers:o,method:s,body:a,signal:l}=n;let u={},{region:d}=n;d||(d=this.region);const h=new URL(`${this.url}/${r}`);d&&d!=="any"&&(u["x-region"]=d,h.searchParams.set("forceFunctionRegion",d));let f;a&&(o&&!Object.prototype.hasOwnProperty.call(o,"Content-Type")||!o)?typeof Blob<"u"&&a instanceof Blob||a instanceof ArrayBuffer?(u["Content-Type"]="application/octet-stream",f=a):typeof a=="string"?(u["Content-Type"]="text/plain",f=a):typeof FormData<"u"&&a instanceof FormData?f=a:(u["Content-Type"]="application/json",f=JSON.stringify(a)):f=a;const p=yield this.fetch(h.toString(),{method:s||"POST",headers:Object.assign(Object.assign(Object.assign({},u),this.headers),o),body:f,signal:l}).catch(m=>{throw m.name==="AbortError"?m:new lm(m)}),v=p.headers.get("x-relay-error");if(v&&v==="true")throw new cm(p);if(!p.ok)throw new um(p);let g=((i=p.headers.get("Content-Type"))!==null&&i!==void 0?i:"text/plain").split(";")[0].trim(),b;return g==="application/json"?b=yield p.json():g==="application/octet-stream"||g==="application/pdf"?b=yield p.blob():g==="text/event-stream"?b=p:g==="multipart/form-data"?b=yield p.formData():b=yield p.text(),{data:b,error:null,response:p}}catch(o){return o instanceof Error&&o.name==="AbortError"?{data:null,error:new lm(o)}:{data:null,error:o,response:o instanceof um||o instanceof cm?o.context:void 0}}})}}var Kt={};const us=M1(hS);var Sl={},kl={},jl={},El={},Cl={},Tl={},dm;function Cx(){if(dm)return Tl;dm=1,Object.defineProperty(Tl,"__esModule",{value:!0});class t extends Error{constructor(r){super(r.message),this.name="PostgrestError",this.details=r.details,this.hint=r.hint,this.code=r.code}}return Tl.default=t,Tl}var hm;function Tx(){if(hm)return Cl;hm=1,Object.defineProperty(Cl,"__esModule",{value:!0});const e=us.__importDefault(Cx());class r{constructor(i){var o,s;this.shouldThrowOnError=!1,this.method=i.method,this.url=i.url,this.headers=new Headers(i.headers),this.schema=i.schema,this.body=i.body,this.shouldThrowOnError=(o=i.shouldThrowOnError)!==null&&o!==void 0?o:!1,this.signal=i.signal,this.isMaybeSingle=(s=i.isMaybeSingle)!==null&&s!==void 0?s:!1,i.fetch?this.fetch=i.fetch:this.fetch=fetch}throwOnError(){return this.shouldThrowOnError=!0,this}setHeader(i,o){return this.headers=new Headers(this.headers),this.headers.set(i,o),this}then(i,o){this.schema===void 0||(["GET","HEAD"].includes(this.method)?this.headers.set("Accept-Profile",this.schema):this.headers.set("Content-Profile",this.schema)),this.method!=="GET"&&this.method!=="HEAD"&&this.headers.set("Content-Type","application/json");const s=this.fetch;let a=s(this.url.toString(),{method:this.method,headers:this.headers,body:JSON.stringify(this.body),signal:this.signal}).then(async l=>{var u,d,h,f;let p=null,v=null,g=null,b=l.status,m=l.statusText;if(l.ok){if(this.method!=="HEAD"){const j=await l.text();j===""||(this.headers.get("Accept")==="text/csv"||this.headers.get("Accept")&&(!((u=this.headers.get("Accept"))===null||u===void 0)&&u.includes("application/vnd.pgrst.plan+text"))?v=j:v=JSON.parse(j))}const x=(d=this.headers.get("Prefer"))===null||d===void 0?void 0:d.match(/count=(exact|planned|estimated)/),w=(h=l.headers.get("content-range"))===null||h===void 0?void 0:h.split("/");x&&w&&w.length>1&&(g=parseInt(w[1])),this.isMaybeSingle&&this.method==="GET"&&Array.isArray(v)&&(v.length>1?(p={code:"PGRST116",details:`Results contain ${v.length} rows, application/vnd.pgrst.object+json requires 1 row`,hint:null,message:"JSON object requested, multiple (or no) rows returned"},v=null,g=null,b=406,m="Not Acceptable"):v.length===1?v=v[0]:v=null)}else{const x=await l.text();try{p=JSON.parse(x),Array.isArray(p)&&l.status===404&&(v=[],p=null,b=200,m="OK")}catch{l.status===404&&x===""?(b=204,m="No Content"):p={message:x}}if(p&&this.isMaybeSingle&&(!((f=p==null?void 0:p.details)===null||f===void 0)&&f.includes("0 rows"))&&(p=null,b=200,m="OK"),p&&this.shouldThrowOnError)throw new e.default(p)}return{error:p,data:v,count:g,status:b,statusText:m}});return this.shouldThrowOnError||(a=a.catch(l=>{var u,d,h;return{error:{message:`${(u=l==null?void 0:l.name)!==null&&u!==void 0?u:"FetchError"}: ${l==null?void 0:l.message}`,details:`${(d=l==null?void 0:l.stack)!==null&&d!==void 0?d:""}`,hint:"",code:`${(h=l==null?void 0:l.code)!==null&&h!==void 0?h:""}`},data:null,count:null,status:0,statusText:""}})),a.then(i,o)}returns(){return this}overrideTypes(){return this}}return Cl.default=r,Cl}var fm;function Nx(){if(fm)return El;fm=1,Object.defineProperty(El,"__esModule",{value:!0});const e=us.__importDefault(Tx());class r extends e.default{select(i){let o=!1;const s=(i??"*").split("").map(a=>/\s/.test(a)&&!o?"":(a==='"'&&(o=!o),a)).join("");return this.url.searchParams.set("select",s),this.headers.append("Prefer","return=representation"),this}order(i,{ascending:o=!0,nullsFirst:s,foreignTable:a,referencedTable:l=a}={}){const u=l?`${l}.order`:"order",d=this.url.searchParams.get(u);return this.url.searchParams.set(u,`${d?`${d},`:""}${i}.${o?"asc":"desc"}${s===void 0?"":s?".nullsfirst":".nullslast"}`),this}limit(i,{foreignTable:o,referencedTable:s=o}={}){const a=typeof s>"u"?"limit":`${s}.limit`;return this.url.searchParams.set(a,`${i}`),this}range(i,o,{foreignTable:s,referencedTable:a=s}={}){const l=typeof a>"u"?"offset":`${a}.offset`,u=typeof a>"u"?"limit":`${a}.limit`;return this.url.searchParams.set(l,`${i}`),this.url.searchParams.set(u,`${o-i+1}`),this}abortSignal(i){return this.signal=i,this}single(){return this.headers.set("Accept","application/vnd.pgrst.object+json"),this}maybeSingle(){return this.method==="GET"?this.headers.set("Accept","application/json"):this.headers.set("Accept","application/vnd.pgrst.object+json"),this.isMaybeSingle=!0,this}csv(){return this.headers.set("Accept","text/csv"),this}geojson(){return this.headers.set("Accept","application/geo+json"),this}explain({analyze:i=!1,verbose:o=!1,settings:s=!1,buffers:a=!1,wal:l=!1,format:u="text"}={}){var d;const h=[i?"analyze":null,o?"verbose":null,s?"settings":null,a?"buffers":null,l?"wal":null].filter(Boolean).join("|"),f=(d=this.headers.get("Accept"))!==null&&d!==void 0?d:"application/json";return this.headers.set("Accept",`application/vnd.pgrst.plan+${u}; for="${f}"; options=${h};`),u==="json"?this:this}rollback(){return this.headers.append("Prefer","tx=rollback"),this}returns(){return this}maxAffected(i){return this.headers.append("Prefer","handling=strict"),this.headers.append("Prefer",`max-affected=${i}`),this}}return El.default=r,El}var pm;function Gf(){if(pm)return jl;pm=1,Object.defineProperty(jl,"__esModule",{value:!0});const e=us.__importDefault(Nx()),r=new RegExp("[,()]");class n extends e.default{eq(o,s){return this.url.searchParams.append(o,`eq.${s}`),this}neq(o,s){return this.url.searchParams.append(o,`neq.${s}`),this}gt(o,s){return this.url.searchParams.append(o,`gt.${s}`),this}gte(o,s){return this.url.searchParams.append(o,`gte.${s}`),this}lt(o,s){return this.url.searchParams.append(o,`lt.${s}`),this}lte(o,s){return this.url.searchParams.append(o,`lte.${s}`),this}like(o,s){return this.url.searchParams.append(o,`like.${s}`),this}likeAllOf(o,s){return this.url.searchParams.append(o,`like(all).{${s.join(",")}}`),this}likeAnyOf(o,s){return this.url.searchParams.append(o,`like(any).{${s.join(",")}}`),this}ilike(o,s){return this.url.searchParams.append(o,`ilike.${s}`),this}ilikeAllOf(o,s){return this.url.searchParams.append(o,`ilike(all).{${s.join(",")}}`),this}ilikeAnyOf(o,s){return this.url.searchParams.append(o,`ilike(any).{${s.join(",")}}`),this}is(o,s){return this.url.searchParams.append(o,`is.${s}`),this}in(o,s){const a=Array.from(new Set(s)).map(l=>typeof l=="string"&&r.test(l)?`"${l}"`:`${l}`).join(",");return this.url.searchParams.append(o,`in.(${a})`),this}contains(o,s){return typeof s=="string"?this.url.searchParams.append(o,`cs.${s}`):Array.isArray(s)?this.url.searchParams.append(o,`cs.{${s.join(",")}}`):this.url.searchParams.append(o,`cs.${JSON.stringify(s)}`),this}containedBy(o,s){return typeof s=="string"?this.url.searchParams.append(o,`cd.${s}`):Array.isArray(s)?this.url.searchParams.append(o,`cd.{${s.join(",")}}`):this.url.searchParams.append(o,`cd.${JSON.stringify(s)}`),this}rangeGt(o,s){return this.url.searchParams.append(o,`sr.${s}`),this}rangeGte(o,s){return this.url.searchParams.append(o,`nxl.${s}`),this}rangeLt(o,s){return this.url.searchParams.append(o,`sl.${s}`),this}rangeLte(o,s){return this.url.searchParams.append(o,`nxr.${s}`),this}rangeAdjacent(o,s){return this.url.searchParams.append(o,`adj.${s}`),this}overlaps(o,s){return typeof s=="string"?this.url.searchParams.append(o,`ov.${s}`):this.url.searchParams.append(o,`ov.{${s.join(",")}}`),this}textSearch(o,s,{config:a,type:l}={}){let u="";l==="plain"?u="pl":l==="phrase"?u="ph":l==="websearch"&&(u="w");const d=a===void 0?"":`(${a})`;return this.url.searchParams.append(o,`${u}fts${d}.${s}`),this}match(o){return Object.entries(o).forEach(([s,a])=>{this.url.searchParams.append(s,`eq.${a}`)}),this}not(o,s,a){return this.url.searchParams.append(o,`not.${s}.${a}`),this}or(o,{foreignTable:s,referencedTable:a=s}={}){const l=a?`${a}.or`:"or";return this.url.searchParams.append(l,`(${o})`),this}filter(o,s,a){return this.url.searchParams.append(o,`${s}.${a}`),this}}return jl.default=n,jl}var gm;function Ox(){if(gm)return kl;gm=1,Object.defineProperty(kl,"__esModule",{value:!0});const e=us.__importDefault(Gf());class r{constructor(i,{headers:o={},schema:s,fetch:a}){this.url=i,this.headers=new Headers(o),this.schema=s,this.fetch=a}select(i,o){const{head:s=!1,count:a}=o??{},l=s?"HEAD":"GET";let u=!1;const d=(i??"*").split("").map(h=>/\s/.test(h)&&!u?"":(h==='"'&&(u=!u),h)).join("");return this.url.searchParams.set("select",d),a&&this.headers.append("Prefer",`count=${a}`),new e.default({method:l,url:this.url,headers:this.headers,schema:this.schema,fetch:this.fetch})}insert(i,{count:o,defaultToNull:s=!0}={}){var a;const l="POST";if(o&&this.headers.append("Prefer",`count=${o}`),s||this.headers.append("Prefer","missing=default"),Array.isArray(i)){const u=i.reduce((d,h)=>d.concat(Object.keys(h)),[]);if(u.length>0){const d=[...new Set(u)].map(h=>`"${h}"`);this.url.searchParams.set("columns",d.join(","))}}return new e.default({method:l,url:this.url,headers:this.headers,schema:this.schema,body:i,fetch:(a=this.fetch)!==null&&a!==void 0?a:fetch})}upsert(i,{onConflict:o,ignoreDuplicates:s=!1,count:a,defaultToNull:l=!0}={}){var u;const d="POST";if(this.headers.append("Prefer",`resolution=${s?"ignore":"merge"}-duplicates`),o!==void 0&&this.url.searchParams.set("on_conflict",o),a&&this.headers.append("Prefer",`count=${a}`),l||this.headers.append("Prefer","missing=default"),Array.isArray(i)){const h=i.reduce((f,p)=>f.concat(Object.keys(p)),[]);if(h.length>0){const f=[...new Set(h)].map(p=>`"${p}"`);this.url.searchParams.set("columns",f.join(","))}}return new e.default({method:d,url:this.url,headers:this.headers,schema:this.schema,body:i,fetch:(u=this.fetch)!==null&&u!==void 0?u:fetch})}update(i,{count:o}={}){var s;const a="PATCH";return o&&this.headers.append("Prefer",`count=${o}`),new e.default({method:a,url:this.url,headers:this.headers,schema:this.schema,body:i,fetch:(s=this.fetch)!==null&&s!==void 0?s:fetch})}delete({count:i}={}){var o;const s="DELETE";return i&&this.headers.append("Prefer",`count=${i}`),new e.default({method:s,url:this.url,headers:this.headers,schema:this.schema,fetch:(o=this.fetch)!==null&&o!==void 0?o:fetch})}}return kl.default=r,kl}var mm;function gS(){if(mm)return Sl;mm=1,Object.defineProperty(Sl,"__esModule",{value:!0});const t=us,e=t.__importDefault(Ox()),r=t.__importDefault(Gf());class n{constructor(o,{headers:s={},schema:a,fetch:l}={}){this.url=o,this.headers=new Headers(s),this.schemaName=a,this.fetch=l}from(o){const s=new URL(`${this.url}/${o}`);return new e.default(s,{headers:new Headers(this.headers),schema:this.schemaName,fetch:this.fetch})}schema(o){return new n(this.url,{headers:this.headers,schema:o,fetch:this.fetch})}rpc(o,s={},{head:a=!1,get:l=!1,count:u}={}){var d;let h;const f=new URL(`${this.url}/rpc/${o}`);let p;a||l?(h=a?"HEAD":"GET",Object.entries(s).filter(([g,b])=>b!==void 0).map(([g,b])=>[g,Array.isArray(b)?`{${b.join(",")}}`:`${b}`]).forEach(([g,b])=>{f.searchParams.append(g,b)})):(h="POST",p=s);const v=new Headers(this.headers);return u&&v.set("Prefer",`count=${u}`),new r.default({method:h,url:f,headers:v,schema:this.schemaName,body:p,fetch:(d=this.fetch)!==null&&d!==void 0?d:fetch})}}return Sl.default=n,Sl}Object.defineProperty(Kt,"__esModule",{value:!0});var Rx=Kt.PostgrestError=Bx=Kt.PostgrestBuilder=zx=Kt.PostgrestTransformBuilder=Dx=Kt.PostgrestFilterBuilder=Ix=Kt.PostgrestQueryBuilder=Px=Kt.PostgrestClient=void 0;const ds=us,Ax=ds.__importDefault(gS());var Px=Kt.PostgrestClient=Ax.default;const $x=ds.__importDefault(Ox());var Ix=Kt.PostgrestQueryBuilder=$x.default;const Mx=ds.__importDefault(Gf());var Dx=Kt.PostgrestFilterBuilder=Mx.default;const Lx=ds.__importDefault(Nx());var zx=Kt.PostgrestTransformBuilder=Lx.default;const Fx=ds.__importDefault(Tx());var Bx=Kt.PostgrestBuilder=Fx.default;const Ux=ds.__importDefault(Cx());Rx=Kt.PostgrestError=Ux.default;var Hx=Kt.default={PostgrestClient:Ax.default,PostgrestQueryBuilder:$x.default,PostgrestFilterBuilder:Mx.default,PostgrestTransformBuilder:Lx.default,PostgrestBuilder:Fx.default,PostgrestError:Ux.default};const mS=I1({__proto__:null,get PostgrestBuilder(){return Bx},get PostgrestClient(){return Px},get PostgrestError(){return Rx},get PostgrestFilterBuilder(){return Dx},get PostgrestQueryBuilder(){return Ix},get PostgrestTransformBuilder(){return zx},default:Hx},[Kt]),{PostgrestClient:vS,PostgrestQueryBuilder:f7,PostgrestFilterBuilder:p7,PostgrestTransformBuilder:g7,PostgrestBuilder:m7,PostgrestError:v7}=Hx||mS;class yS{static detectEnvironment(){var e;if(typeof WebSocket<"u")return{type:"native",constructor:WebSocket};if(typeof globalThis<"u"&&typeof globalThis.WebSocket<"u")return{type:"native",constructor:globalThis.WebSocket};if(typeof global<"u"&&typeof global.WebSocket<"u")return{type:"native",constructor:global.WebSocket};if(typeof globalThis<"u"&&typeof globalThis.WebSocketPair<"u"&&typeof globalThis.WebSocket>"u")return{type:"cloudflare",error:"Cloudflare Workers detected. WebSocket clients are not supported in Cloudflare Workers.",workaround:"Use Cloudflare Workers WebSocket API for server-side WebSocket handling, or deploy to a different runtime."};if(typeof globalThis<"u"&&globalThis.EdgeRuntime||typeof navigator<"u"&&(!((e=navigator.userAgent)===null||e===void 0)&&e.includes("Vercel-Edge")))return{type:"unsupported",error:"Edge runtime detected (Vercel Edge/Netlify Edge). WebSockets are not supported in edge functions.",workaround:"Use serverless functions or a different deployment target for WebSocket functionality."};if(typeof process<"u"){const r=process.versions;if(r&&r.node){const n=r.node,i=parseInt(n.replace(/^v/,"").split(".")[0]);return i>=22?typeof globalThis.WebSocket<"u"?{type:"native",constructor:globalThis.WebSocket}:{type:"unsupported",error:`Node.js ${i} detected but native WebSocket not found.`,workaround:"Provide a WebSocket implementation via the transport option."}:{type:"unsupported",error:`Node.js ${i} detected without native WebSocket support.`,workaround:`For Node.js < 22, install "ws" package and provide it via the transport option:
import ws from "ws"
new RealtimeClient(url, { transport: ws })`}}}return{type:"unsupported",error:"Unknown JavaScript runtime without WebSocket support.",workaround:"Ensure you're running in a supported environment (browser, Node.js, Deno) or provide a custom WebSocket implementation."}}static getWebSocketConstructor(){const e=this.detectEnvironment();if(e.constructor)return e.constructor;let r=e.error||"WebSocket not supported in this environment.";throw e.workaround&&(r+=`

Suggested solution: ${e.workaround}`),new Error(r)}static createWebSocket(e,r){const n=this.getWebSocketConstructor();return new n(e,r)}static isWebSocketSupported(){try{const e=this.detectEnvironment();return e.type==="native"||e.type==="ws"}catch{return!1}}}const bS="2.79.0",xS=`realtime-js/${bS}`,wS="1.0.0",Sh=1e4,_S=1e3,SS=100;var da;(function(t){t[t.connecting=0]="connecting",t[t.open=1]="open",t[t.closing=2]="closing",t[t.closed=3]="closed"})(da||(da={}));var Ct;(function(t){t.closed="closed",t.errored="errored",t.joined="joined",t.joining="joining",t.leaving="leaving"})(Ct||(Ct={}));var Mr;(function(t){t.close="phx_close",t.error="phx_error",t.join="phx_join",t.reply="phx_reply",t.leave="phx_leave",t.access_token="access_token"})(Mr||(Mr={}));var kh;(function(t){t.websocket="websocket"})(kh||(kh={}));var ji;(function(t){t.Connecting="connecting",t.Open="open",t.Closing="closing",t.Closed="closed"})(ji||(ji={}));class kS{constructor(){this.HEADER_LENGTH=1}decode(e,r){return e.constructor===ArrayBuffer?r(this._binaryDecode(e)):r(typeof e=="string"?JSON.parse(e):{})}_binaryDecode(e){const r=new DataView(e),n=new TextDecoder;return this._decodeBroadcast(e,r,n)}_decodeBroadcast(e,r,n){const i=r.getUint8(1),o=r.getUint8(2);let s=this.HEADER_LENGTH+2;const a=n.decode(e.slice(s,s+i));s=s+i;const l=n.decode(e.slice(s,s+o));s=s+o;const u=JSON.parse(n.decode(e.slice(s,e.byteLength)));return{ref:null,topic:a,event:l,payload:u}}}class Gx{constructor(e,r){this.callback=e,this.timerCalc=r,this.timer=void 0,this.tries=0,this.callback=e,this.timerCalc=r}reset(){this.tries=0,clearTimeout(this.timer),this.timer=void 0}scheduleTimeout(){clearTimeout(this.timer),this.timer=setTimeout(()=>{this.tries=this.tries+1,this.callback()},this.timerCalc(this.tries+1))}}var rt;(function(t){t.abstime="abstime",t.bool="bool",t.date="date",t.daterange="daterange",t.float4="float4",t.float8="float8",t.int2="int2",t.int4="int4",t.int4range="int4range",t.int8="int8",t.int8range="int8range",t.json="json",t.jsonb="jsonb",t.money="money",t.numeric="numeric",t.oid="oid",t.reltime="reltime",t.text="text",t.time="time",t.timestamp="timestamp",t.timestamptz="timestamptz",t.timetz="timetz",t.tsrange="tsrange",t.tstzrange="tstzrange"})(rt||(rt={}));const vm=(t,e,r={})=>{var n;const i=(n=r.skipTypes)!==null&&n!==void 0?n:[];return e?Object.keys(e).reduce((o,s)=>(o[s]=jS(s,t,e,i),o),{}):{}},jS=(t,e,r,n)=>{const i=e.find(a=>a.name===t),o=i==null?void 0:i.type,s=r[t];return o&&!n.includes(o)?Wx(o,s):jh(s)},Wx=(t,e)=>{if(t.charAt(0)==="_"){const r=t.slice(1,t.length);return NS(e,r)}switch(t){case rt.bool:return ES(e);case rt.float4:case rt.float8:case rt.int2:case rt.int4:case rt.int8:case rt.numeric:case rt.oid:return CS(e);case rt.json:case rt.jsonb:return TS(e);case rt.timestamp:return OS(e);case rt.abstime:case rt.date:case rt.daterange:case rt.int4range:case rt.int8range:case rt.money:case rt.reltime:case rt.text:case rt.time:case rt.timestamptz:case rt.timetz:case rt.tsrange:case rt.tstzrange:return jh(e);default:return jh(e)}},jh=t=>t,ES=t=>{switch(t){case"t":return!0;case"f":return!1;default:return t}},CS=t=>{if(typeof t=="string"){const e=parseFloat(t);if(!Number.isNaN(e))return e}return t},TS=t=>{if(typeof t=="string")try{return JSON.parse(t)}catch(e){return console.log(`JSON parse error: ${e}`),t}return t},NS=(t,e)=>{if(typeof t!="string")return t;const r=t.length-1,n=t[r];if(t[0]==="{"&&n==="}"){let o;const s=t.slice(1,r);try{o=JSON.parse("["+s+"]")}catch{o=s?s.split(","):[]}return o.map(a=>Wx(e,a))}return t},OS=t=>typeof t=="string"?t.replace(" ","T"):t,Vx=t=>{const e=new URL(t);return e.protocol=e.protocol.replace(/^ws/i,"http"),e.pathname=e.pathname.replace(/\/+$/,"").replace(/\/socket\/websocket$/i,"").replace(/\/socket$/i,"").replace(/\/websocket$/i,""),e.pathname===""||e.pathname==="/"?e.pathname="/api/broadcast":e.pathname=e.pathname+"/api/broadcast",e.href};class Ju{constructor(e,r,n={},i=Sh){this.channel=e,this.event=r,this.payload=n,this.timeout=i,this.sent=!1,this.timeoutTimer=void 0,this.ref="",this.receivedResp=null,this.recHooks=[],this.refEvent=null}resend(e){this.timeout=e,this._cancelRefEvent(),this.ref="",this.refEvent=null,this.receivedResp=null,this.sent=!1,this.send()}send(){this._hasReceived("timeout")||(this.startTimeout(),this.sent=!0,this.channel.socket.push({topic:this.channel.topic,event:this.event,payload:this.payload,ref:this.ref,join_ref:this.channel._joinRef()}))}updatePayload(e){this.payload=Object.assign(Object.assign({},this.payload),e)}receive(e,r){var n;return this._hasReceived(e)&&r((n=this.receivedResp)===null||n===void 0?void 0:n.response),this.recHooks.push({status:e,callback:r}),this}startTimeout(){if(this.timeoutTimer)return;this.ref=this.channel.socket._makeRef(),this.refEvent=this.channel._replyEventName(this.ref);const e=r=>{this._cancelRefEvent(),this._cancelTimeout(),this.receivedResp=r,this._matchReceive(r)};this.channel._on(this.refEvent,{},e),this.timeoutTimer=setTimeout(()=>{this.trigger("timeout",{})},this.timeout)}trigger(e,r){this.refEvent&&this.channel._trigger(this.refEvent,{status:e,response:r})}destroy(){this._cancelRefEvent(),this._cancelTimeout()}_cancelRefEvent(){this.refEvent&&this.channel._off(this.refEvent,{})}_cancelTimeout(){clearTimeout(this.timeoutTimer),this.timeoutTimer=void 0}_matchReceive({status:e,response:r}){this.recHooks.filter(n=>n.status===e).forEach(n=>n.callback(r))}_hasReceived(e){return this.receivedResp&&this.receivedResp.status===e}}var ym;(function(t){t.SYNC="sync",t.JOIN="join",t.LEAVE="leave"})(ym||(ym={}));class ha{constructor(e,r){this.channel=e,this.state={},this.pendingDiffs=[],this.joinRef=null,this.enabled=!1,this.caller={onJoin:()=>{},onLeave:()=>{},onSync:()=>{}};const n=(r==null?void 0:r.events)||{state:"presence_state",diff:"presence_diff"};this.channel._on(n.state,{},i=>{const{onJoin:o,onLeave:s,onSync:a}=this.caller;this.joinRef=this.channel._joinRef(),this.state=ha.syncState(this.state,i,o,s),this.pendingDiffs.forEach(l=>{this.state=ha.syncDiff(this.state,l,o,s)}),this.pendingDiffs=[],a()}),this.channel._on(n.diff,{},i=>{const{onJoin:o,onLeave:s,onSync:a}=this.caller;this.inPendingSyncState()?this.pendingDiffs.push(i):(this.state=ha.syncDiff(this.state,i,o,s),a())}),this.onJoin((i,o,s)=>{this.channel._trigger("presence",{event:"join",key:i,currentPresences:o,newPresences:s})}),this.onLeave((i,o,s)=>{this.channel._trigger("presence",{event:"leave",key:i,currentPresences:o,leftPresences:s})}),this.onSync(()=>{this.channel._trigger("presence",{event:"sync"})})}static syncState(e,r,n,i){const o=this.cloneDeep(e),s=this.transformState(r),a={},l={};return this.map(o,(u,d)=>{s[u]||(l[u]=d)}),this.map(s,(u,d)=>{const h=o[u];if(h){const f=d.map(b=>b.presence_ref),p=h.map(b=>b.presence_ref),v=d.filter(b=>p.indexOf(b.presence_ref)<0),g=h.filter(b=>f.indexOf(b.presence_ref)<0);v.length>0&&(a[u]=v),g.length>0&&(l[u]=g)}else a[u]=d}),this.syncDiff(o,{joins:a,leaves:l},n,i)}static syncDiff(e,r,n,i){const{joins:o,leaves:s}={joins:this.transformState(r.joins),leaves:this.transformState(r.leaves)};return n||(n=()=>{}),i||(i=()=>{}),this.map(o,(a,l)=>{var u;const d=(u=e[a])!==null&&u!==void 0?u:[];if(e[a]=this.cloneDeep(l),d.length>0){const h=e[a].map(p=>p.presence_ref),f=d.filter(p=>h.indexOf(p.presence_ref)<0);e[a].unshift(...f)}n(a,d,l)}),this.map(s,(a,l)=>{let u=e[a];if(!u)return;const d=l.map(h=>h.presence_ref);u=u.filter(h=>d.indexOf(h.presence_ref)<0),e[a]=u,i(a,u,l),u.length===0&&delete e[a]}),e}static map(e,r){return Object.getOwnPropertyNames(e).map(n=>r(n,e[n]))}static transformState(e){return e=this.cloneDeep(e),Object.getOwnPropertyNames(e).reduce((r,n)=>{const i=e[n];return"metas"in i?r[n]=i.metas.map(o=>(o.presence_ref=o.phx_ref,delete o.phx_ref,delete o.phx_ref_prev,o)):r[n]=i,r},{})}static cloneDeep(e){return JSON.parse(JSON.stringify(e))}onJoin(e){this.caller.onJoin=e}onLeave(e){this.caller.onLeave=e}onSync(e){this.caller.onSync=e}inPendingSyncState(){return!this.joinRef||this.joinRef!==this.channel._joinRef()}}var bm;(function(t){t.ALL="*",t.INSERT="INSERT",t.UPDATE="UPDATE",t.DELETE="DELETE"})(bm||(bm={}));var fa;(function(t){t.BROADCAST="broadcast",t.PRESENCE="presence",t.POSTGRES_CHANGES="postgres_changes",t.SYSTEM="system"})(fa||(fa={}));var hn;(function(t){t.SUBSCRIBED="SUBSCRIBED",t.TIMED_OUT="TIMED_OUT",t.CLOSED="CLOSED",t.CHANNEL_ERROR="CHANNEL_ERROR"})(hn||(hn={}));class Wf{constructor(e,r={config:{}},n){var i,o;if(this.topic=e,this.params=r,this.socket=n,this.bindings={},this.state=Ct.closed,this.joinedOnce=!1,this.pushBuffer=[],this.subTopic=e.replace(/^realtime:/i,""),this.params.config=Object.assign({broadcast:{ack:!1,self:!1},presence:{key:"",enabled:!1},private:!1},r.config),this.timeout=this.socket.timeout,this.joinPush=new Ju(this,Mr.join,this.params,this.timeout),this.rejoinTimer=new Gx(()=>this._rejoinUntilConnected(),this.socket.reconnectAfterMs),this.joinPush.receive("ok",()=>{this.state=Ct.joined,this.rejoinTimer.reset(),this.pushBuffer.forEach(s=>s.send()),this.pushBuffer=[]}),this._onClose(()=>{this.rejoinTimer.reset(),this.socket.log("channel",`close ${this.topic} ${this._joinRef()}`),this.state=Ct.closed,this.socket._remove(this)}),this._onError(s=>{this._isLeaving()||this._isClosed()||(this.socket.log("channel",`error ${this.topic}`,s),this.state=Ct.errored,this.rejoinTimer.scheduleTimeout())}),this.joinPush.receive("timeout",()=>{this._isJoining()&&(this.socket.log("channel",`timeout ${this.topic}`,this.joinPush.timeout),this.state=Ct.errored,this.rejoinTimer.scheduleTimeout())}),this.joinPush.receive("error",s=>{this._isLeaving()||this._isClosed()||(this.socket.log("channel",`error ${this.topic}`,s),this.state=Ct.errored,this.rejoinTimer.scheduleTimeout())}),this._on(Mr.reply,{},(s,a)=>{this._trigger(this._replyEventName(a),s)}),this.presence=new ha(this),this.broadcastEndpointURL=Vx(this.socket.endPoint),this.private=this.params.config.private||!1,!this.private&&(!((o=(i=this.params.config)===null||i===void 0?void 0:i.broadcast)===null||o===void 0)&&o.replay))throw`tried to use replay on public channel '${this.topic}'. It must be a private channel.`}subscribe(e,r=this.timeout){var n,i,o;if(this.socket.isConnected()||this.socket.connect(),this.state==Ct.closed){const{config:{broadcast:s,presence:a,private:l}}=this.params,u=(i=(n=this.bindings.postgres_changes)===null||n===void 0?void 0:n.map(p=>p.filter))!==null&&i!==void 0?i:[],d=!!this.bindings[fa.PRESENCE]&&this.bindings[fa.PRESENCE].length>0||((o=this.params.config.presence)===null||o===void 0?void 0:o.enabled)===!0,h={},f={broadcast:s,presence:Object.assign(Object.assign({},a),{enabled:d}),postgres_changes:u,private:l};this.socket.accessTokenValue&&(h.access_token=this.socket.accessTokenValue),this._onError(p=>e==null?void 0:e(hn.CHANNEL_ERROR,p)),this._onClose(()=>e==null?void 0:e(hn.CLOSED)),this.updateJoinPayload(Object.assign({config:f},h)),this.joinedOnce=!0,this._rejoin(r),this.joinPush.receive("ok",async({postgres_changes:p})=>{var v;if(this.socket.setAuth(),p===void 0){e==null||e(hn.SUBSCRIBED);return}else{const g=this.bindings.postgres_changes,b=(v=g==null?void 0:g.length)!==null&&v!==void 0?v:0,m=[];for(let y=0;y<b;y++){const x=g[y],{filter:{event:w,schema:j,table:S,filter:C}}=x,N=p&&p[y];if(N&&N.event===w&&N.schema===j&&N.table===S&&N.filter===C)m.push(Object.assign(Object.assign({},x),{id:N.id}));else{this.unsubscribe(),this.state=Ct.errored,e==null||e(hn.CHANNEL_ERROR,new Error("mismatch between server and client bindings for postgres changes"));return}}this.bindings.postgres_changes=m,e&&e(hn.SUBSCRIBED);return}}).receive("error",p=>{this.state=Ct.errored,e==null||e(hn.CHANNEL_ERROR,new Error(JSON.stringify(Object.values(p).join(", ")||"error")))}).receive("timeout",()=>{e==null||e(hn.TIMED_OUT)})}return this}presenceState(){return this.presence.state}async track(e,r={}){return await this.send({type:"presence",event:"track",payload:e},r.timeout||this.timeout)}async untrack(e={}){return await this.send({type:"presence",event:"untrack"},e)}on(e,r,n){return this.state===Ct.joined&&e===fa.PRESENCE&&(this.socket.log("channel",`resubscribe to ${this.topic} due to change in presence callbacks on joined channel`),this.unsubscribe().then(()=>this.subscribe())),this._on(e,r,n)}async httpSend(e,r,n={}){var i;const o=this.socket.accessTokenValue?`Bearer ${this.socket.accessTokenValue}`:"";if(r==null)return Promise.reject("Payload is required for httpSend()");const s={method:"POST",headers:{Authorization:o,apikey:this.socket.apiKey?this.socket.apiKey:"","Content-Type":"application/json"},body:JSON.stringify({messages:[{topic:this.subTopic,event:e,payload:r,private:this.private}]})},a=await this._fetchWithTimeout(this.broadcastEndpointURL,s,(i=n.timeout)!==null&&i!==void 0?i:this.timeout);if(a.status===202)return{success:!0};let l=a.statusText;try{const u=await a.json();l=u.error||u.message||l}catch{}return Promise.reject(new Error(l))}async send(e,r={}){var n,i;if(!this._canPush()&&e.type==="broadcast"){console.warn("Realtime send() is automatically falling back to REST API. This behavior will be deprecated in the future. Please use httpSend() explicitly for REST delivery.");const{event:o,payload:s}=e,l={method:"POST",headers:{Authorization:this.socket.accessTokenValue?`Bearer ${this.socket.accessTokenValue}`:"",apikey:this.socket.apiKey?this.socket.apiKey:"","Content-Type":"application/json"},body:JSON.stringify({messages:[{topic:this.subTopic,event:o,payload:s,private:this.private}]})};try{const u=await this._fetchWithTimeout(this.broadcastEndpointURL,l,(n=r.timeout)!==null&&n!==void 0?n:this.timeout);return await((i=u.body)===null||i===void 0?void 0:i.cancel()),u.ok?"ok":"error"}catch(u){return u.name==="AbortError"?"timed out":"error"}}else return new Promise(o=>{var s,a,l;const u=this._push(e.type,e,r.timeout||this.timeout);e.type==="broadcast"&&!(!((l=(a=(s=this.params)===null||s===void 0?void 0:s.config)===null||a===void 0?void 0:a.broadcast)===null||l===void 0)&&l.ack)&&o("ok"),u.receive("ok",()=>o("ok")),u.receive("error",()=>o("error")),u.receive("timeout",()=>o("timed out"))})}updateJoinPayload(e){this.joinPush.updatePayload(e)}unsubscribe(e=this.timeout){this.state=Ct.leaving;const r=()=>{this.socket.log("channel",`leave ${this.topic}`),this._trigger(Mr.close,"leave",this._joinRef())};this.joinPush.destroy();let n=null;return new Promise(i=>{n=new Ju(this,Mr.leave,{},e),n.receive("ok",()=>{r(),i("ok")}).receive("timeout",()=>{r(),i("timed out")}).receive("error",()=>{i("error")}),n.send(),this._canPush()||n.trigger("ok",{})}).finally(()=>{n==null||n.destroy()})}teardown(){this.pushBuffer.forEach(e=>e.destroy()),this.pushBuffer=[],this.rejoinTimer.reset(),this.joinPush.destroy(),this.state=Ct.closed,this.bindings={}}async _fetchWithTimeout(e,r,n){const i=new AbortController,o=setTimeout(()=>i.abort(),n),s=await this.socket.fetch(e,Object.assign(Object.assign({},r),{signal:i.signal}));return clearTimeout(o),s}_push(e,r,n=this.timeout){if(!this.joinedOnce)throw`tried to push '${e}' to '${this.topic}' before joining. Use channel.subscribe() before pushing events`;let i=new Ju(this,e,r,n);return this._canPush()?i.send():this._addToPushBuffer(i),i}_addToPushBuffer(e){if(e.startTimeout(),this.pushBuffer.push(e),this.pushBuffer.length>SS){const r=this.pushBuffer.shift();r&&(r.destroy(),this.socket.log("channel",`discarded push due to buffer overflow: ${r.event}`,r.payload))}}_onMessage(e,r,n){return r}_isMember(e){return this.topic===e}_joinRef(){return this.joinPush.ref}_trigger(e,r,n){var i,o;const s=e.toLocaleLowerCase(),{close:a,error:l,leave:u,join:d}=Mr;if(n&&[a,l,u,d].indexOf(s)>=0&&n!==this._joinRef())return;let f=this._onMessage(s,r,n);if(r&&!f)throw"channel onMessage callbacks must return the payload, modified or unmodified";["insert","update","delete"].includes(s)?(i=this.bindings.postgres_changes)===null||i===void 0||i.filter(p=>{var v,g,b;return((v=p.filter)===null||v===void 0?void 0:v.event)==="*"||((b=(g=p.filter)===null||g===void 0?void 0:g.event)===null||b===void 0?void 0:b.toLocaleLowerCase())===s}).map(p=>p.callback(f,n)):(o=this.bindings[s])===null||o===void 0||o.filter(p=>{var v,g,b,m,y,x;if(["broadcast","presence","postgres_changes"].includes(s))if("id"in p){const w=p.id,j=(v=p.filter)===null||v===void 0?void 0:v.event;return w&&((g=r.ids)===null||g===void 0?void 0:g.includes(w))&&(j==="*"||(j==null?void 0:j.toLocaleLowerCase())===((b=r.data)===null||b===void 0?void 0:b.type.toLocaleLowerCase()))}else{const w=(y=(m=p==null?void 0:p.filter)===null||m===void 0?void 0:m.event)===null||y===void 0?void 0:y.toLocaleLowerCase();return w==="*"||w===((x=r==null?void 0:r.event)===null||x===void 0?void 0:x.toLocaleLowerCase())}else return p.type.toLocaleLowerCase()===s}).map(p=>{if(typeof f=="object"&&"ids"in f){const v=f.data,{schema:g,table:b,commit_timestamp:m,type:y,errors:x}=v;f=Object.assign(Object.assign({},{schema:g,table:b,commit_timestamp:m,eventType:y,new:{},old:{},errors:x}),this._getPayloadRecords(v))}p.callback(f,n)})}_isClosed(){return this.state===Ct.closed}_isJoined(){return this.state===Ct.joined}_isJoining(){return this.state===Ct.joining}_isLeaving(){return this.state===Ct.leaving}_replyEventName(e){return`chan_reply_${e}`}_on(e,r,n){const i=e.toLocaleLowerCase(),o={type:i,filter:r,callback:n};return this.bindings[i]?this.bindings[i].push(o):this.bindings[i]=[o],this}_off(e,r){const n=e.toLocaleLowerCase();return this.bindings[n]&&(this.bindings[n]=this.bindings[n].filter(i=>{var o;return!(((o=i.type)===null||o===void 0?void 0:o.toLocaleLowerCase())===n&&Wf.isEqual(i.filter,r))})),this}static isEqual(e,r){if(Object.keys(e).length!==Object.keys(r).length)return!1;for(const n in e)if(e[n]!==r[n])return!1;return!0}_rejoinUntilConnected(){this.rejoinTimer.scheduleTimeout(),this.socket.isConnected()&&this._rejoin()}_onClose(e){this._on(Mr.close,{},e)}_onError(e){this._on(Mr.error,{},r=>e(r))}_canPush(){return this.socket.isConnected()&&this._isJoined()}_rejoin(e=this.timeout){this._isLeaving()||(this.socket._leaveOpenTopic(this.topic),this.state=Ct.joining,this.joinPush.resend(e))}_getPayloadRecords(e){const r={new:{},old:{}};return(e.type==="INSERT"||e.type==="UPDATE")&&(r.new=vm(e.columns,e.record)),(e.type==="UPDATE"||e.type==="DELETE")&&(r.old=vm(e.columns,e.old_record)),r}}const Qu=()=>{},Nl={HEARTBEAT_INTERVAL:25e3,RECONNECT_DELAY:10,HEARTBEAT_TIMEOUT_FALLBACK:100},RS=[1e3,2e3,5e3,1e4],AS=1e4,PS=`
  addEventListener("message", (e) => {
    if (e.data.event === "start") {
      setInterval(() => postMessage({ event: "keepAlive" }), e.data.interval);
    }
  });`;class $S{constructor(e,r){var n;if(this.accessTokenValue=null,this.apiKey=null,this.channels=new Array,this.endPoint="",this.httpEndpoint="",this.headers={},this.params={},this.timeout=Sh,this.transport=null,this.heartbeatIntervalMs=Nl.HEARTBEAT_INTERVAL,this.heartbeatTimer=void 0,this.pendingHeartbeatRef=null,this.heartbeatCallback=Qu,this.ref=0,this.reconnectTimer=null,this.logger=Qu,this.conn=null,this.sendBuffer=[],this.serializer=new kS,this.stateChangeCallbacks={open:[],close:[],error:[],message:[]},this.accessToken=null,this._connectionState="disconnected",this._wasManualDisconnect=!1,this._authPromise=null,this._resolveFetch=i=>i?(...o)=>i(...o):(...o)=>fetch(...o),!(!((n=r==null?void 0:r.params)===null||n===void 0)&&n.apikey))throw new Error("API key is required to connect to Realtime");this.apiKey=r.params.apikey,this.endPoint=`${e}/${kh.websocket}`,this.httpEndpoint=Vx(e),this._initializeOptions(r),this._setupReconnectionTimer(),this.fetch=this._resolveFetch(r==null?void 0:r.fetch)}connect(){if(!(this.isConnecting()||this.isDisconnecting()||this.conn!==null&&this.isConnected())){if(this._setConnectionState("connecting"),this._setAuthSafely("connect"),this.transport)this.conn=new this.transport(this.endpointURL());else try{this.conn=yS.createWebSocket(this.endpointURL())}catch(e){this._setConnectionState("disconnected");const r=e.message;throw r.includes("Node.js")?new Error(`${r}

To use Realtime in Node.js, you need to provide a WebSocket implementation:

Option 1: Use Node.js 22+ which has native WebSocket support
Option 2: Install and provide the "ws" package:

  npm install ws

  import ws from "ws"
  const client = new RealtimeClient(url, {
    ...options,
    transport: ws
  })`):new Error(`WebSocket not available: ${r}`)}this._setupConnectionHandlers()}}endpointURL(){return this._appendParams(this.endPoint,Object.assign({},this.params,{vsn:wS}))}disconnect(e,r){if(!this.isDisconnecting())if(this._setConnectionState("disconnecting",!0),this.conn){const n=setTimeout(()=>{this._setConnectionState("disconnected")},100);this.conn.onclose=()=>{clearTimeout(n),this._setConnectionState("disconnected")},e?this.conn.close(e,r??""):this.conn.close(),this._teardownConnection()}else this._setConnectionState("disconnected")}getChannels(){return this.channels}async removeChannel(e){const r=await e.unsubscribe();return this.channels.length===0&&this.disconnect(),r}async removeAllChannels(){const e=await Promise.all(this.channels.map(r=>r.unsubscribe()));return this.channels=[],this.disconnect(),e}log(e,r,n){this.logger(e,r,n)}connectionState(){switch(this.conn&&this.conn.readyState){case da.connecting:return ji.Connecting;case da.open:return ji.Open;case da.closing:return ji.Closing;default:return ji.Closed}}isConnected(){return this.connectionState()===ji.Open}isConnecting(){return this._connectionState==="connecting"}isDisconnecting(){return this._connectionState==="disconnecting"}channel(e,r={config:{}}){const n=`realtime:${e}`,i=this.getChannels().find(o=>o.topic===n);if(i)return i;{const o=new Wf(`realtime:${e}`,r,this);return this.channels.push(o),o}}push(e){const{topic:r,event:n,payload:i,ref:o}=e,s=()=>{this.encode(e,a=>{var l;(l=this.conn)===null||l===void 0||l.send(a)})};this.log("push",`${r} ${n} (${o})`,i),this.isConnected()?s():this.sendBuffer.push(s)}async setAuth(e=null){this._authPromise=this._performAuth(e);try{await this._authPromise}finally{this._authPromise=null}}async sendHeartbeat(){var e;if(!this.isConnected()){try{this.heartbeatCallback("disconnected")}catch(r){this.log("error","error in heartbeat callback",r)}return}if(this.pendingHeartbeatRef){this.pendingHeartbeatRef=null,this.log("transport","heartbeat timeout. Attempting to re-establish connection");try{this.heartbeatCallback("timeout")}catch(r){this.log("error","error in heartbeat callback",r)}this._wasManualDisconnect=!1,(e=this.conn)===null||e===void 0||e.close(_S,"heartbeat timeout"),setTimeout(()=>{var r;this.isConnected()||(r=this.reconnectTimer)===null||r===void 0||r.scheduleTimeout()},Nl.HEARTBEAT_TIMEOUT_FALLBACK);return}this.pendingHeartbeatRef=this._makeRef(),this.push({topic:"phoenix",event:"heartbeat",payload:{},ref:this.pendingHeartbeatRef});try{this.heartbeatCallback("sent")}catch(r){this.log("error","error in heartbeat callback",r)}this._setAuthSafely("heartbeat")}onHeartbeat(e){this.heartbeatCallback=e}flushSendBuffer(){this.isConnected()&&this.sendBuffer.length>0&&(this.sendBuffer.forEach(e=>e()),this.sendBuffer=[])}_makeRef(){let e=this.ref+1;return e===this.ref?this.ref=0:this.ref=e,this.ref.toString()}_leaveOpenTopic(e){let r=this.channels.find(n=>n.topic===e&&(n._isJoined()||n._isJoining()));r&&(this.log("transport",`leaving duplicate topic "${e}"`),r.unsubscribe())}_remove(e){this.channels=this.channels.filter(r=>r.topic!==e.topic)}_onConnMessage(e){this.decode(e.data,r=>{if(r.topic==="phoenix"&&r.event==="phx_reply")try{this.heartbeatCallback(r.payload.status==="ok"?"ok":"error")}catch(u){this.log("error","error in heartbeat callback",u)}r.ref&&r.ref===this.pendingHeartbeatRef&&(this.pendingHeartbeatRef=null);const{topic:n,event:i,payload:o,ref:s}=r,a=s?`(${s})`:"",l=o.status||"";this.log("receive",`${l} ${n} ${i} ${a}`.trim(),o),this.channels.filter(u=>u._isMember(n)).forEach(u=>u._trigger(i,o,s)),this._triggerStateCallbacks("message",r)})}_clearTimer(e){var r;e==="heartbeat"&&this.heartbeatTimer?(clearInterval(this.heartbeatTimer),this.heartbeatTimer=void 0):e==="reconnect"&&((r=this.reconnectTimer)===null||r===void 0||r.reset())}_clearAllTimers(){this._clearTimer("heartbeat"),this._clearTimer("reconnect")}_setupConnectionHandlers(){this.conn&&("binaryType"in this.conn&&(this.conn.binaryType="arraybuffer"),this.conn.onopen=()=>this._onConnOpen(),this.conn.onerror=e=>this._onConnError(e),this.conn.onmessage=e=>this._onConnMessage(e),this.conn.onclose=e=>this._onConnClose(e))}_teardownConnection(){this.conn&&(this.conn.onopen=null,this.conn.onerror=null,this.conn.onmessage=null,this.conn.onclose=null,this.conn=null),this._clearAllTimers(),this.channels.forEach(e=>e.teardown())}_onConnOpen(){this._setConnectionState("connected"),this.log("transport",`connected to ${this.endpointURL()}`),this.flushSendBuffer(),this._clearTimer("reconnect"),this.worker?this.workerRef||this._startWorkerHeartbeat():this._startHeartbeat(),this._triggerStateCallbacks("open")}_startHeartbeat(){this.heartbeatTimer&&clearInterval(this.heartbeatTimer),this.heartbeatTimer=setInterval(()=>this.sendHeartbeat(),this.heartbeatIntervalMs)}_startWorkerHeartbeat(){this.workerUrl?this.log("worker",`starting worker for from ${this.workerUrl}`):this.log("worker","starting default worker");const e=this._workerObjectUrl(this.workerUrl);this.workerRef=new Worker(e),this.workerRef.onerror=r=>{this.log("worker","worker error",r.message),this.workerRef.terminate()},this.workerRef.onmessage=r=>{r.data.event==="keepAlive"&&this.sendHeartbeat()},this.workerRef.postMessage({event:"start",interval:this.heartbeatIntervalMs})}_onConnClose(e){var r;this._setConnectionState("disconnected"),this.log("transport","close",e),this._triggerChanError(),this._clearTimer("heartbeat"),this._wasManualDisconnect||(r=this.reconnectTimer)===null||r===void 0||r.scheduleTimeout(),this._triggerStateCallbacks("close",e)}_onConnError(e){this._setConnectionState("disconnected"),this.log("transport",`${e}`),this._triggerChanError(),this._triggerStateCallbacks("error",e)}_triggerChanError(){this.channels.forEach(e=>e._trigger(Mr.error))}_appendParams(e,r){if(Object.keys(r).length===0)return e;const n=e.match(/\?/)?"&":"?",i=new URLSearchParams(r);return`${e}${n}${i}`}_workerObjectUrl(e){let r;if(e)r=e;else{const n=new Blob([PS],{type:"application/javascript"});r=URL.createObjectURL(n)}return r}_setConnectionState(e,r=!1){this._connectionState=e,e==="connecting"?this._wasManualDisconnect=!1:e==="disconnecting"&&(this._wasManualDisconnect=r)}async _performAuth(e=null){let r;e?r=e:this.accessToken?r=await this.accessToken():r=this.accessTokenValue,this.accessTokenValue!=r&&(this.accessTokenValue=r,this.channels.forEach(n=>{const i={access_token:r,version:xS};r&&n.updateJoinPayload(i),n.joinedOnce&&n._isJoined()&&n._push(Mr.access_token,{access_token:r})}))}async _waitForAuthIfNeeded(){this._authPromise&&await this._authPromise}_setAuthSafely(e="general"){this.setAuth().catch(r=>{this.log("error",`error setting auth in ${e}`,r)})}_triggerStateCallbacks(e,r){try{this.stateChangeCallbacks[e].forEach(n=>{try{n(r)}catch(i){this.log("error",`error in ${e} callback`,i)}})}catch(n){this.log("error",`error triggering ${e} callbacks`,n)}}_setupReconnectionTimer(){this.reconnectTimer=new Gx(async()=>{setTimeout(async()=>{await this._waitForAuthIfNeeded(),this.isConnected()||this.connect()},Nl.RECONNECT_DELAY)},this.reconnectAfterMs)}_initializeOptions(e){var r,n,i,o,s,a,l,u,d;if(this.transport=(r=e==null?void 0:e.transport)!==null&&r!==void 0?r:null,this.timeout=(n=e==null?void 0:e.timeout)!==null&&n!==void 0?n:Sh,this.heartbeatIntervalMs=(i=e==null?void 0:e.heartbeatIntervalMs)!==null&&i!==void 0?i:Nl.HEARTBEAT_INTERVAL,this.worker=(o=e==null?void 0:e.worker)!==null&&o!==void 0?o:!1,this.accessToken=(s=e==null?void 0:e.accessToken)!==null&&s!==void 0?s:null,this.heartbeatCallback=(a=e==null?void 0:e.heartbeatCallback)!==null&&a!==void 0?a:Qu,e!=null&&e.params&&(this.params=e.params),e!=null&&e.logger&&(this.logger=e.logger),(e!=null&&e.logLevel||e!=null&&e.log_level)&&(this.logLevel=e.logLevel||e.log_level,this.params=Object.assign(Object.assign({},this.params),{log_level:this.logLevel})),this.reconnectAfterMs=(l=e==null?void 0:e.reconnectAfterMs)!==null&&l!==void 0?l:h=>RS[h-1]||AS,this.encode=(u=e==null?void 0:e.encode)!==null&&u!==void 0?u:(h,f)=>f(JSON.stringify(h)),this.decode=(d=e==null?void 0:e.decode)!==null&&d!==void 0?d:this.serializer.decode.bind(this.serializer),this.worker){if(typeof window<"u"&&!window.Worker)throw new Error("Web Worker is not supported");this.workerUrl=e==null?void 0:e.workerUrl}}}class Vf extends Error{constructor(e){super(e),this.__isStorageError=!0,this.name="StorageError"}}function gt(t){return typeof t=="object"&&t!==null&&"__isStorageError"in t}class IS extends Vf{constructor(e,r,n){super(e),this.name="StorageApiError",this.status=r,this.statusCode=n}toJSON(){return{name:this.name,message:this.message,status:this.status,statusCode:this.statusCode}}}class Eh extends Vf{constructor(e,r){super(e),this.name="StorageUnknownError",this.originalError=r}}const qf=t=>t?(...e)=>t(...e):(...e)=>fetch(...e),MS=()=>Response,Ch=t=>{if(Array.isArray(t))return t.map(r=>Ch(r));if(typeof t=="function"||t!==Object(t))return t;const e={};return Object.entries(t).forEach(([r,n])=>{const i=r.replace(/([-_][a-z])/gi,o=>o.toUpperCase().replace(/[-_]/g,""));e[i]=Ch(n)}),e},DS=t=>{if(typeof t!="object"||t===null)return!1;const e=Object.getPrototypeOf(t);return(e===null||e===Object.prototype||Object.getPrototypeOf(e)===null)&&!(Symbol.toStringTag in t)&&!(Symbol.iterator in t)},ed=t=>{var e;return t.msg||t.message||t.error_description||(typeof t.error=="string"?t.error:(e=t.error)===null||e===void 0?void 0:e.message)||JSON.stringify(t)},LS=(t,e,r)=>we(void 0,void 0,void 0,function*(){const n=yield MS();t instanceof n&&!(r!=null&&r.noResolveJson)?t.json().then(i=>{const o=t.status||500,s=(i==null?void 0:i.statusCode)||o+"";e(new IS(ed(i),o,s))}).catch(i=>{e(new Eh(ed(i),i))}):e(new Eh(ed(t),t))}),zS=(t,e,r,n)=>{const i={method:t,headers:(e==null?void 0:e.headers)||{}};return t==="GET"||!n?i:(DS(n)?(i.headers=Object.assign({"Content-Type":"application/json"},e==null?void 0:e.headers),i.body=JSON.stringify(n)):i.body=n,e!=null&&e.duplex&&(i.duplex=e.duplex),Object.assign(Object.assign({},i),r))};function Ha(t,e,r,n,i,o){return we(this,void 0,void 0,function*(){return new Promise((s,a)=>{t(r,zS(e,n,i,o)).then(l=>{if(!l.ok)throw l;return n!=null&&n.noResolveJson?l:l.json()}).then(l=>s(l)).catch(l=>LS(l,a,n))})})}function Aa(t,e,r,n){return we(this,void 0,void 0,function*(){return Ha(t,"GET",e,r,n)})}function $r(t,e,r,n,i){return we(this,void 0,void 0,function*(){return Ha(t,"POST",e,n,i,r)})}function Th(t,e,r,n,i){return we(this,void 0,void 0,function*(){return Ha(t,"PUT",e,n,i,r)})}function FS(t,e,r,n){return we(this,void 0,void 0,function*(){return Ha(t,"HEAD",e,Object.assign(Object.assign({},r),{noResolveJson:!0}),n)})}function Kf(t,e,r,n,i){return we(this,void 0,void 0,function*(){return Ha(t,"DELETE",e,n,i,r)})}class BS{constructor(e,r){this.downloadFn=e,this.shouldThrowOnError=r}then(e,r){return this.execute().then(e,r)}execute(){return we(this,void 0,void 0,function*(){try{return{data:(yield this.downloadFn()).body,error:null}}catch(e){if(this.shouldThrowOnError)throw e;if(gt(e))return{data:null,error:e};throw e}})}}var qx;class US{constructor(e,r){this.downloadFn=e,this.shouldThrowOnError=r,this[qx]="BlobDownloadBuilder",this.promise=null}asStream(){return new BS(this.downloadFn,this.shouldThrowOnError)}then(e,r){return this.getPromise().then(e,r)}catch(e){return this.getPromise().catch(e)}finally(e){return this.getPromise().finally(e)}getPromise(){return this.promise||(this.promise=this.execute()),this.promise}execute(){return we(this,void 0,void 0,function*(){try{return{data:yield(yield this.downloadFn()).blob(),error:null}}catch(e){if(this.shouldThrowOnError)throw e;if(gt(e))return{data:null,error:e};throw e}})}}qx=Symbol.toStringTag;const HS={limit:100,offset:0,sortBy:{column:"name",order:"asc"}},xm={cacheControl:"3600",contentType:"text/plain;charset=UTF-8",upsert:!1};class GS{constructor(e,r={},n,i){this.shouldThrowOnError=!1,this.url=e,this.headers=r,this.bucketId=n,this.fetch=qf(i)}throwOnError(){return this.shouldThrowOnError=!0,this}uploadOrUpdate(e,r,n,i){return we(this,void 0,void 0,function*(){try{let o;const s=Object.assign(Object.assign({},xm),i);let a=Object.assign(Object.assign({},this.headers),e==="POST"&&{"x-upsert":String(s.upsert)});const l=s.metadata;typeof Blob<"u"&&n instanceof Blob?(o=new FormData,o.append("cacheControl",s.cacheControl),l&&o.append("metadata",this.encodeMetadata(l)),o.append("",n)):typeof FormData<"u"&&n instanceof FormData?(o=n,o.has("cacheControl")||o.append("cacheControl",s.cacheControl),l&&!o.has("metadata")&&o.append("metadata",this.encodeMetadata(l))):(o=n,a["cache-control"]=`max-age=${s.cacheControl}`,a["content-type"]=s.contentType,l&&(a["x-metadata"]=this.toBase64(this.encodeMetadata(l))),(typeof ReadableStream<"u"&&o instanceof ReadableStream||o&&typeof o=="object"&&"pipe"in o&&typeof o.pipe=="function")&&!s.duplex&&(s.duplex="half")),i!=null&&i.headers&&(a=Object.assign(Object.assign({},a),i.headers));const u=this._removeEmptyFolders(r),d=this._getFinalPath(u),h=yield(e=="PUT"?Th:$r)(this.fetch,`${this.url}/object/${d}`,o,Object.assign({headers:a},s!=null&&s.duplex?{duplex:s.duplex}:{}));return{data:{path:u,id:h.Id,fullPath:h.Key},error:null}}catch(o){if(this.shouldThrowOnError)throw o;if(gt(o))return{data:null,error:o};throw o}})}upload(e,r,n){return we(this,void 0,void 0,function*(){return this.uploadOrUpdate("POST",e,r,n)})}uploadToSignedUrl(e,r,n,i){return we(this,void 0,void 0,function*(){const o=this._removeEmptyFolders(e),s=this._getFinalPath(o),a=new URL(this.url+`/object/upload/sign/${s}`);a.searchParams.set("token",r);try{let l;const u=Object.assign({upsert:xm.upsert},i),d=Object.assign(Object.assign({},this.headers),{"x-upsert":String(u.upsert)});typeof Blob<"u"&&n instanceof Blob?(l=new FormData,l.append("cacheControl",u.cacheControl),l.append("",n)):typeof FormData<"u"&&n instanceof FormData?(l=n,l.append("cacheControl",u.cacheControl)):(l=n,d["cache-control"]=`max-age=${u.cacheControl}`,d["content-type"]=u.contentType);const h=yield Th(this.fetch,a.toString(),l,{headers:d});return{data:{path:o,fullPath:h.Key},error:null}}catch(l){if(this.shouldThrowOnError)throw l;if(gt(l))return{data:null,error:l};throw l}})}createSignedUploadUrl(e,r){return we(this,void 0,void 0,function*(){try{let n=this._getFinalPath(e);const i=Object.assign({},this.headers);r!=null&&r.upsert&&(i["x-upsert"]="true");const o=yield $r(this.fetch,`${this.url}/object/upload/sign/${n}`,{},{headers:i}),s=new URL(this.url+o.url),a=s.searchParams.get("token");if(!a)throw new Vf("No token returned by API");return{data:{signedUrl:s.toString(),path:e,token:a},error:null}}catch(n){if(this.shouldThrowOnError)throw n;if(gt(n))return{data:null,error:n};throw n}})}update(e,r,n){return we(this,void 0,void 0,function*(){return this.uploadOrUpdate("PUT",e,r,n)})}move(e,r,n){return we(this,void 0,void 0,function*(){try{return{data:yield $r(this.fetch,`${this.url}/object/move`,{bucketId:this.bucketId,sourceKey:e,destinationKey:r,destinationBucket:n==null?void 0:n.destinationBucket},{headers:this.headers}),error:null}}catch(i){if(this.shouldThrowOnError)throw i;if(gt(i))return{data:null,error:i};throw i}})}copy(e,r,n){return we(this,void 0,void 0,function*(){try{return{data:{path:(yield $r(this.fetch,`${this.url}/object/copy`,{bucketId:this.bucketId,sourceKey:e,destinationKey:r,destinationBucket:n==null?void 0:n.destinationBucket},{headers:this.headers})).Key},error:null}}catch(i){if(this.shouldThrowOnError)throw i;if(gt(i))return{data:null,error:i};throw i}})}createSignedUrl(e,r,n){return we(this,void 0,void 0,function*(){try{let i=this._getFinalPath(e),o=yield $r(this.fetch,`${this.url}/object/sign/${i}`,Object.assign({expiresIn:r},n!=null&&n.transform?{transform:n.transform}:{}),{headers:this.headers});const s=n!=null&&n.download?`&download=${n.download===!0?"":n.download}`:"";return o={signedUrl:encodeURI(`${this.url}${o.signedURL}${s}`)},{data:o,error:null}}catch(i){if(this.shouldThrowOnError)throw i;if(gt(i))return{data:null,error:i};throw i}})}createSignedUrls(e,r,n){return we(this,void 0,void 0,function*(){try{const i=yield $r(this.fetch,`${this.url}/object/sign/${this.bucketId}`,{expiresIn:r,paths:e},{headers:this.headers}),o=n!=null&&n.download?`&download=${n.download===!0?"":n.download}`:"";return{data:i.map(s=>Object.assign(Object.assign({},s),{signedUrl:s.signedURL?encodeURI(`${this.url}${s.signedURL}${o}`):null})),error:null}}catch(i){if(this.shouldThrowOnError)throw i;if(gt(i))return{data:null,error:i};throw i}})}download(e,r){const i=typeof(r==null?void 0:r.transform)<"u"?"render/image/authenticated":"object",o=this.transformOptsToQueryString((r==null?void 0:r.transform)||{}),s=o?`?${o}`:"",a=this._getFinalPath(e),l=()=>Aa(this.fetch,`${this.url}/${i}/${a}${s}`,{headers:this.headers,noResolveJson:!0});return new US(l,this.shouldThrowOnError)}info(e){return we(this,void 0,void 0,function*(){const r=this._getFinalPath(e);try{const n=yield Aa(this.fetch,`${this.url}/object/info/${r}`,{headers:this.headers});return{data:Ch(n),error:null}}catch(n){if(this.shouldThrowOnError)throw n;if(gt(n))return{data:null,error:n};throw n}})}exists(e){return we(this,void 0,void 0,function*(){const r=this._getFinalPath(e);try{return yield FS(this.fetch,`${this.url}/object/${r}`,{headers:this.headers}),{data:!0,error:null}}catch(n){if(this.shouldThrowOnError)throw n;if(gt(n)&&n instanceof Eh){const i=n.originalError;if([400,404].includes(i==null?void 0:i.status))return{data:!1,error:n}}throw n}})}getPublicUrl(e,r){const n=this._getFinalPath(e),i=[],o=r!=null&&r.download?`download=${r.download===!0?"":r.download}`:"";o!==""&&i.push(o);const a=typeof(r==null?void 0:r.transform)<"u"?"render/image":"object",l=this.transformOptsToQueryString((r==null?void 0:r.transform)||{});l!==""&&i.push(l);let u=i.join("&");return u!==""&&(u=`?${u}`),{data:{publicUrl:encodeURI(`${this.url}/${a}/public/${n}${u}`)}}}remove(e){return we(this,void 0,void 0,function*(){try{return{data:yield Kf(this.fetch,`${this.url}/object/${this.bucketId}`,{prefixes:e},{headers:this.headers}),error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(gt(r))return{data:null,error:r};throw r}})}list(e,r,n){return we(this,void 0,void 0,function*(){try{const i=Object.assign(Object.assign(Object.assign({},HS),r),{prefix:e||""});return{data:yield $r(this.fetch,`${this.url}/object/list/${this.bucketId}`,i,{headers:this.headers},n),error:null}}catch(i){if(this.shouldThrowOnError)throw i;if(gt(i))return{data:null,error:i};throw i}})}listV2(e,r){return we(this,void 0,void 0,function*(){try{const n=Object.assign({},e);return{data:yield $r(this.fetch,`${this.url}/object/list-v2/${this.bucketId}`,n,{headers:this.headers},r),error:null}}catch(n){if(this.shouldThrowOnError)throw n;if(gt(n))return{data:null,error:n};throw n}})}encodeMetadata(e){return JSON.stringify(e)}toBase64(e){return typeof Buffer<"u"?Buffer.from(e).toString("base64"):btoa(e)}_getFinalPath(e){return`${this.bucketId}/${e.replace(/^\/+/,"")}`}_removeEmptyFolders(e){return e.replace(/^\/|\/$/g,"").replace(/\/+/g,"/")}transformOptsToQueryString(e){const r=[];return e.width&&r.push(`width=${e.width}`),e.height&&r.push(`height=${e.height}`),e.resize&&r.push(`resize=${e.resize}`),e.format&&r.push(`format=${e.format}`),e.quality&&r.push(`quality=${e.quality}`),r.join("&")}}const Kx="2.79.0",Yx={"X-Client-Info":`storage-js/${Kx}`};class WS{constructor(e,r={},n,i){this.shouldThrowOnError=!1;const o=new URL(e);i!=null&&i.useNewHostname&&/supabase\.(co|in|red)$/.test(o.hostname)&&!o.hostname.includes("storage.supabase.")&&(o.hostname=o.hostname.replace("supabase.","storage.supabase.")),this.url=o.href.replace(/\/$/,""),this.headers=Object.assign(Object.assign({},Yx),r),this.fetch=qf(n)}throwOnError(){return this.shouldThrowOnError=!0,this}listBuckets(e){return we(this,void 0,void 0,function*(){try{const r=this.listBucketOptionsToQueryString(e);return{data:yield Aa(this.fetch,`${this.url}/bucket${r}`,{headers:this.headers}),error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(gt(r))return{data:null,error:r};throw r}})}getBucket(e){return we(this,void 0,void 0,function*(){try{return{data:yield Aa(this.fetch,`${this.url}/bucket/${e}`,{headers:this.headers}),error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(gt(r))return{data:null,error:r};throw r}})}createBucket(e){return we(this,arguments,void 0,function*(r,n={public:!1}){try{return{data:yield $r(this.fetch,`${this.url}/bucket`,{id:r,name:r,type:n.type,public:n.public,file_size_limit:n.fileSizeLimit,allowed_mime_types:n.allowedMimeTypes},{headers:this.headers}),error:null}}catch(i){if(this.shouldThrowOnError)throw i;if(gt(i))return{data:null,error:i};throw i}})}updateBucket(e,r){return we(this,void 0,void 0,function*(){try{return{data:yield Th(this.fetch,`${this.url}/bucket/${e}`,{id:e,name:e,public:r.public,file_size_limit:r.fileSizeLimit,allowed_mime_types:r.allowedMimeTypes},{headers:this.headers}),error:null}}catch(n){if(this.shouldThrowOnError)throw n;if(gt(n))return{data:null,error:n};throw n}})}emptyBucket(e){return we(this,void 0,void 0,function*(){try{return{data:yield $r(this.fetch,`${this.url}/bucket/${e}/empty`,{},{headers:this.headers}),error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(gt(r))return{data:null,error:r};throw r}})}deleteBucket(e){return we(this,void 0,void 0,function*(){try{return{data:yield Kf(this.fetch,`${this.url}/bucket/${e}`,{},{headers:this.headers}),error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(gt(r))return{data:null,error:r};throw r}})}listBucketOptionsToQueryString(e){const r={};return e&&("limit"in e&&(r.limit=String(e.limit)),"offset"in e&&(r.offset=String(e.offset)),e.search&&(r.search=e.search),e.sortColumn&&(r.sortColumn=e.sortColumn),e.sortOrder&&(r.sortOrder=e.sortOrder)),Object.keys(r).length>0?"?"+new URLSearchParams(r).toString():""}}class VS{constructor(e,r={},n){this.shouldThrowOnError=!1,this.url=e.replace(/\/$/,""),this.headers=Object.assign(Object.assign({},Yx),r),this.fetch=qf(n)}throwOnError(){return this.shouldThrowOnError=!0,this}createBucket(e){return we(this,void 0,void 0,function*(){try{return{data:yield $r(this.fetch,`${this.url}/bucket`,{name:e},{headers:this.headers}),error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(gt(r))return{data:null,error:r};throw r}})}listBuckets(e){return we(this,void 0,void 0,function*(){try{const r=new URLSearchParams;(e==null?void 0:e.limit)!==void 0&&r.set("limit",e.limit.toString()),(e==null?void 0:e.offset)!==void 0&&r.set("offset",e.offset.toString()),e!=null&&e.sortColumn&&r.set("sortColumn",e.sortColumn),e!=null&&e.sortOrder&&r.set("sortOrder",e.sortOrder),e!=null&&e.search&&r.set("search",e.search);const n=r.toString(),i=n?`${this.url}/bucket?${n}`:`${this.url}/bucket`;return{data:yield Aa(this.fetch,i,{headers:this.headers}),error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(gt(r))return{data:null,error:r};throw r}})}deleteBucket(e){return we(this,void 0,void 0,function*(){try{return{data:yield Kf(this.fetch,`${this.url}/bucket/${e}`,{},{headers:this.headers}),error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(gt(r))return{data:null,error:r};throw r}})}}const Yf={"X-Client-Info":`storage-js/${Kx}`,"Content-Type":"application/json"};class Xx extends Error{constructor(e){super(e),this.__isStorageVectorsError=!0,this.name="StorageVectorsError"}}function cr(t){return typeof t=="object"&&t!==null&&"__isStorageVectorsError"in t}class td extends Xx{constructor(e,r,n){super(e),this.name="StorageVectorsApiError",this.status=r,this.statusCode=n}toJSON(){return{name:this.name,message:this.message,status:this.status,statusCode:this.statusCode}}}class qS extends Xx{constructor(e,r){super(e),this.name="StorageVectorsUnknownError",this.originalError=r}}var wm;(function(t){t.InternalError="InternalError",t.S3VectorConflictException="S3VectorConflictException",t.S3VectorNotFoundException="S3VectorNotFoundException",t.S3VectorBucketNotEmpty="S3VectorBucketNotEmpty",t.S3VectorMaxBucketsExceeded="S3VectorMaxBucketsExceeded",t.S3VectorMaxIndexesExceeded="S3VectorMaxIndexesExceeded"})(wm||(wm={}));const Xf=t=>t?(...e)=>t(...e):(...e)=>fetch(...e),KS=t=>{if(typeof t!="object"||t===null)return!1;const e=Object.getPrototypeOf(t);return(e===null||e===Object.prototype||Object.getPrototypeOf(e)===null)&&!(Symbol.toStringTag in t)&&!(Symbol.iterator in t)},_m=t=>t.msg||t.message||t.error_description||t.error||JSON.stringify(t),YS=(t,e,r)=>we(void 0,void 0,void 0,function*(){if(t&&typeof t=="object"&&"status"in t&&"ok"in t&&typeof t.status=="number"&&!(r!=null&&r.noResolveJson)){const i=t.status||500,o=t;if(typeof o.json=="function")o.json().then(s=>{const a=(s==null?void 0:s.statusCode)||(s==null?void 0:s.code)||i+"";e(new td(_m(s),i,a))}).catch(()=>{const s=i+"",a=o.statusText||`HTTP ${i} error`;e(new td(a,i,s))});else{const s=i+"",a=o.statusText||`HTTP ${i} error`;e(new td(a,i,s))}}else e(new qS(_m(t),t))}),XS=(t,e,r,n)=>{const i={method:t,headers:(e==null?void 0:e.headers)||{}};return n?(KS(n)?(i.headers=Object.assign({"Content-Type":"application/json"},e==null?void 0:e.headers),i.body=JSON.stringify(n)):i.body=n,Object.assign(Object.assign({},i),r)):i};function ZS(t,e,r,n,i,o){return we(this,void 0,void 0,function*(){return new Promise((s,a)=>{t(r,XS(e,n,i,o)).then(l=>{if(!l.ok)throw l;if(n!=null&&n.noResolveJson)return l;const u=l.headers.get("content-type");return!u||!u.includes("application/json")?{}:l.json()}).then(l=>s(l)).catch(l=>YS(l,a,n))})})}function ur(t,e,r,n,i){return we(this,void 0,void 0,function*(){return ZS(t,"POST",e,n,i,r)})}class JS{constructor(e,r={},n){this.shouldThrowOnError=!1,this.url=e.replace(/\/$/,""),this.headers=Object.assign(Object.assign({},Yf),r),this.fetch=Xf(n)}throwOnError(){return this.shouldThrowOnError=!0,this}createIndex(e){return we(this,void 0,void 0,function*(){try{return{data:(yield ur(this.fetch,`${this.url}/CreateIndex`,e,{headers:this.headers}))||{},error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(cr(r))return{data:null,error:r};throw r}})}getIndex(e,r){return we(this,void 0,void 0,function*(){try{return{data:yield ur(this.fetch,`${this.url}/GetIndex`,{vectorBucketName:e,indexName:r},{headers:this.headers}),error:null}}catch(n){if(this.shouldThrowOnError)throw n;if(cr(n))return{data:null,error:n};throw n}})}listIndexes(e){return we(this,void 0,void 0,function*(){try{return{data:yield ur(this.fetch,`${this.url}/ListIndexes`,e,{headers:this.headers}),error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(cr(r))return{data:null,error:r};throw r}})}deleteIndex(e,r){return we(this,void 0,void 0,function*(){try{return{data:(yield ur(this.fetch,`${this.url}/DeleteIndex`,{vectorBucketName:e,indexName:r},{headers:this.headers}))||{},error:null}}catch(n){if(this.shouldThrowOnError)throw n;if(cr(n))return{data:null,error:n};throw n}})}}class QS{constructor(e,r={},n){this.shouldThrowOnError=!1,this.url=e.replace(/\/$/,""),this.headers=Object.assign(Object.assign({},Yf),r),this.fetch=Xf(n)}throwOnError(){return this.shouldThrowOnError=!0,this}putVectors(e){return we(this,void 0,void 0,function*(){try{if(e.vectors.length<1||e.vectors.length>500)throw new Error("Vector batch size must be between 1 and 500 items");return{data:(yield ur(this.fetch,`${this.url}/PutVectors`,e,{headers:this.headers}))||{},error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(cr(r))return{data:null,error:r};throw r}})}getVectors(e){return we(this,void 0,void 0,function*(){try{return{data:yield ur(this.fetch,`${this.url}/GetVectors`,e,{headers:this.headers}),error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(cr(r))return{data:null,error:r};throw r}})}listVectors(e){return we(this,void 0,void 0,function*(){try{if(e.segmentCount!==void 0){if(e.segmentCount<1||e.segmentCount>16)throw new Error("segmentCount must be between 1 and 16");if(e.segmentIndex!==void 0&&(e.segmentIndex<0||e.segmentIndex>=e.segmentCount))throw new Error(`segmentIndex must be between 0 and ${e.segmentCount-1}`)}return{data:yield ur(this.fetch,`${this.url}/ListVectors`,e,{headers:this.headers}),error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(cr(r))return{data:null,error:r};throw r}})}queryVectors(e){return we(this,void 0,void 0,function*(){try{return{data:yield ur(this.fetch,`${this.url}/QueryVectors`,e,{headers:this.headers}),error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(cr(r))return{data:null,error:r};throw r}})}deleteVectors(e){return we(this,void 0,void 0,function*(){try{if(e.keys.length<1||e.keys.length>500)throw new Error("Keys batch size must be between 1 and 500 items");return{data:(yield ur(this.fetch,`${this.url}/DeleteVectors`,e,{headers:this.headers}))||{},error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(cr(r))return{data:null,error:r};throw r}})}}class ek{constructor(e,r={},n){this.shouldThrowOnError=!1,this.url=e.replace(/\/$/,""),this.headers=Object.assign(Object.assign({},Yf),r),this.fetch=Xf(n)}throwOnError(){return this.shouldThrowOnError=!0,this}createBucket(e){return we(this,void 0,void 0,function*(){try{return{data:(yield ur(this.fetch,`${this.url}/CreateVectorBucket`,{vectorBucketName:e},{headers:this.headers}))||{},error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(cr(r))return{data:null,error:r};throw r}})}getBucket(e){return we(this,void 0,void 0,function*(){try{return{data:yield ur(this.fetch,`${this.url}/GetVectorBucket`,{vectorBucketName:e},{headers:this.headers}),error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(cr(r))return{data:null,error:r};throw r}})}listBuckets(){return we(this,arguments,void 0,function*(e={}){try{return{data:yield ur(this.fetch,`${this.url}/ListVectorBuckets`,e,{headers:this.headers}),error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(cr(r))return{data:null,error:r};throw r}})}deleteBucket(e){return we(this,void 0,void 0,function*(){try{return{data:(yield ur(this.fetch,`${this.url}/DeleteVectorBucket`,{vectorBucketName:e},{headers:this.headers}))||{},error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(cr(r))return{data:null,error:r};throw r}})}}class tk extends ek{constructor(e,r={}){super(e,r.headers||{},r.fetch)}from(e){return new rk(this.url,this.headers,e,this.fetch)}}class rk extends JS{constructor(e,r,n,i){super(e,r,i),this.vectorBucketName=n}createIndex(e){const r=Object.create(null,{createIndex:{get:()=>super.createIndex}});return we(this,void 0,void 0,function*(){return r.createIndex.call(this,Object.assign(Object.assign({},e),{vectorBucketName:this.vectorBucketName}))})}listIndexes(){const e=Object.create(null,{listIndexes:{get:()=>super.listIndexes}});return we(this,arguments,void 0,function*(r={}){return e.listIndexes.call(this,Object.assign(Object.assign({},r),{vectorBucketName:this.vectorBucketName}))})}getIndex(e){const r=Object.create(null,{getIndex:{get:()=>super.getIndex}});return we(this,void 0,void 0,function*(){return r.getIndex.call(this,this.vectorBucketName,e)})}deleteIndex(e){const r=Object.create(null,{deleteIndex:{get:()=>super.deleteIndex}});return we(this,void 0,void 0,function*(){return r.deleteIndex.call(this,this.vectorBucketName,e)})}index(e){return new nk(this.url,this.headers,this.vectorBucketName,e,this.fetch)}}class nk extends QS{constructor(e,r,n,i,o){super(e,r,o),this.vectorBucketName=n,this.indexName=i}putVectors(e){const r=Object.create(null,{putVectors:{get:()=>super.putVectors}});return we(this,void 0,void 0,function*(){return r.putVectors.call(this,Object.assign(Object.assign({},e),{vectorBucketName:this.vectorBucketName,indexName:this.indexName}))})}getVectors(e){const r=Object.create(null,{getVectors:{get:()=>super.getVectors}});return we(this,void 0,void 0,function*(){return r.getVectors.call(this,Object.assign(Object.assign({},e),{vectorBucketName:this.vectorBucketName,indexName:this.indexName}))})}listVectors(){const e=Object.create(null,{listVectors:{get:()=>super.listVectors}});return we(this,arguments,void 0,function*(r={}){return e.listVectors.call(this,Object.assign(Object.assign({},r),{vectorBucketName:this.vectorBucketName,indexName:this.indexName}))})}queryVectors(e){const r=Object.create(null,{queryVectors:{get:()=>super.queryVectors}});return we(this,void 0,void 0,function*(){return r.queryVectors.call(this,Object.assign(Object.assign({},e),{vectorBucketName:this.vectorBucketName,indexName:this.indexName}))})}deleteVectors(e){const r=Object.create(null,{deleteVectors:{get:()=>super.deleteVectors}});return we(this,void 0,void 0,function*(){return r.deleteVectors.call(this,Object.assign(Object.assign({},e),{vectorBucketName:this.vectorBucketName,indexName:this.indexName}))})}}class ik extends WS{constructor(e,r={},n,i){super(e,r,n,i)}from(e){return new GS(this.url,this.headers,e,this.fetch)}get vectors(){return new tk(this.url+"/vector",{headers:this.headers,fetch:this.fetch})}get analytics(){return new VS(this.url+"/iceberg",this.headers,this.fetch)}}const ok="2.79.0";let Js="";typeof Deno<"u"?Js="deno":typeof document<"u"?Js="web":typeof navigator<"u"&&navigator.product==="ReactNative"?Js="react-native":Js="node";const sk={"X-Client-Info":`supabase-js-${Js}/${ok}`},ak={headers:sk},lk={schema:"public"},ck={autoRefreshToken:!0,persistSession:!0,detectSessionInUrl:!0,flowType:"implicit"},uk={},dk=t=>t?(...e)=>t(...e):(...e)=>fetch(...e),hk=()=>Headers,fk=(t,e,r)=>{const n=dk(r),i=hk();return async(o,s)=>{var a;const l=(a=await e())!==null&&a!==void 0?a:t;let u=new i(s==null?void 0:s.headers);return u.has("apikey")||u.set("apikey",t),u.has("Authorization")||u.set("Authorization",`Bearer ${l}`),n(o,Object.assign(Object.assign({},s),{headers:u}))}};function pk(t){return t.endsWith("/")?t:t+"/"}function gk(t,e){var r,n;const{db:i,auth:o,realtime:s,global:a}=t,{db:l,auth:u,realtime:d,global:h}=e,f={db:Object.assign(Object.assign({},l),i),auth:Object.assign(Object.assign({},u),o),realtime:Object.assign(Object.assign({},d),s),storage:{},global:Object.assign(Object.assign(Object.assign({},h),a),{headers:Object.assign(Object.assign({},(r=h==null?void 0:h.headers)!==null&&r!==void 0?r:{}),(n=a==null?void 0:a.headers)!==null&&n!==void 0?n:{})}),accessToken:async()=>""};return t.accessToken?f.accessToken=t.accessToken:delete f.accessToken,f}function mk(t){const e=t==null?void 0:t.trim();if(!e)throw new Error("supabaseUrl is required.");if(!e.match(/^https?:\/\//i))throw new Error("Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL.");try{return new URL(pk(e))}catch{throw Error("Invalid supabaseUrl: Provided URL is malformed.")}}const Zx="2.79.0",fo=30*1e3,Nh=3,rd=Nh*fo,vk="http://localhost:9999",yk="supabase.auth.token",bk={"X-Client-Info":`gotrue-js/${Zx}`},Oh="X-Supabase-Api-Version",Jx={"2024-01-01":{timestamp:Date.parse("2024-01-01T00:00:00.0Z"),name:"2024-01-01"}},xk=/^([a-z0-9_-]{4})*($|[a-z0-9_-]{3}$|[a-z0-9_-]{2}$)$/i,wk=10*60*1e3;class Pa extends Error{constructor(e,r,n){super(e),this.__isAuthError=!0,this.name="AuthError",this.status=r,this.code=n}}function Ee(t){return typeof t=="object"&&t!==null&&"__isAuthError"in t}class _k extends Pa{constructor(e,r,n){super(e,r,n),this.name="AuthApiError",this.status=r,this.code=n}}function Sk(t){return Ee(t)&&t.name==="AuthApiError"}class Ei extends Pa{constructor(e,r){super(e),this.name="AuthUnknownError",this.originalError=r}}class oi extends Pa{constructor(e,r,n,i){super(e,n,i),this.name=r,this.status=n}}class Or extends oi{constructor(){super("Auth session missing!","AuthSessionMissingError",400,void 0)}}function kk(t){return Ee(t)&&t.name==="AuthSessionMissingError"}class io extends oi{constructor(){super("Auth session or user missing","AuthInvalidTokenResponseError",500,void 0)}}class Ol extends oi{constructor(e){super(e,"AuthInvalidCredentialsError",400,void 0)}}class Rl extends oi{constructor(e,r=null){super(e,"AuthImplicitGrantRedirectError",500,void 0),this.details=null,this.details=r}toJSON(){return{name:this.name,message:this.message,status:this.status,details:this.details}}}function jk(t){return Ee(t)&&t.name==="AuthImplicitGrantRedirectError"}class Sm extends oi{constructor(e,r=null){super(e,"AuthPKCEGrantCodeExchangeError",500,void 0),this.details=null,this.details=r}toJSON(){return{name:this.name,message:this.message,status:this.status,details:this.details}}}class Rh extends oi{constructor(e,r){super(e,"AuthRetryableFetchError",r,void 0)}}function nd(t){return Ee(t)&&t.name==="AuthRetryableFetchError"}class km extends oi{constructor(e,r,n){super(e,"AuthWeakPasswordError",r,"weak_password"),this.reasons=n}}class Ah extends oi{constructor(e){super(e,"AuthInvalidJwtError",400,"invalid_jwt")}}const jc="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".split(""),jm=` 	
\r=`.split(""),Ek=(()=>{const t=new Array(128);for(let e=0;e<t.length;e+=1)t[e]=-1;for(let e=0;e<jm.length;e+=1)t[jm[e].charCodeAt(0)]=-2;for(let e=0;e<jc.length;e+=1)t[jc[e].charCodeAt(0)]=e;return t})();function Em(t,e,r){if(t!==null)for(e.queue=e.queue<<8|t,e.queuedBits+=8;e.queuedBits>=6;){const n=e.queue>>e.queuedBits-6&63;r(jc[n]),e.queuedBits-=6}else if(e.queuedBits>0)for(e.queue=e.queue<<6-e.queuedBits,e.queuedBits=6;e.queuedBits>=6;){const n=e.queue>>e.queuedBits-6&63;r(jc[n]),e.queuedBits-=6}}function Qx(t,e,r){const n=Ek[t];if(n>-1)for(e.queue=e.queue<<6|n,e.queuedBits+=6;e.queuedBits>=8;)r(e.queue>>e.queuedBits-8&255),e.queuedBits-=8;else{if(n===-2)return;throw new Error(`Invalid Base64-URL character "${String.fromCharCode(t)}"`)}}function Cm(t){const e=[],r=s=>{e.push(String.fromCodePoint(s))},n={utf8seq:0,codepoint:0},i={queue:0,queuedBits:0},o=s=>{Nk(s,n,r)};for(let s=0;s<t.length;s+=1)Qx(t.charCodeAt(s),i,o);return e.join("")}function Ck(t,e){if(t<=127){e(t);return}else if(t<=2047){e(192|t>>6),e(128|t&63);return}else if(t<=65535){e(224|t>>12),e(128|t>>6&63),e(128|t&63);return}else if(t<=1114111){e(240|t>>18),e(128|t>>12&63),e(128|t>>6&63),e(128|t&63);return}throw new Error(`Unrecognized Unicode codepoint: ${t.toString(16)}`)}function Tk(t,e){for(let r=0;r<t.length;r+=1){let n=t.charCodeAt(r);if(n>55295&&n<=56319){const i=(n-55296)*1024&65535;n=(t.charCodeAt(r+1)-56320&65535|i)+65536,r+=1}Ck(n,e)}}function Nk(t,e,r){if(e.utf8seq===0){if(t<=127){r(t);return}for(let n=1;n<6;n+=1)if(!(t>>7-n&1)){e.utf8seq=n;break}if(e.utf8seq===2)e.codepoint=t&31;else if(e.utf8seq===3)e.codepoint=t&15;else if(e.utf8seq===4)e.codepoint=t&7;else throw new Error("Invalid UTF-8 sequence");e.utf8seq-=1}else if(e.utf8seq>0){if(t<=127)throw new Error("Invalid UTF-8 sequence");e.codepoint=e.codepoint<<6|t&63,e.utf8seq-=1,e.utf8seq===0&&r(e.codepoint)}}function Zo(t){const e=[],r={queue:0,queuedBits:0},n=i=>{e.push(i)};for(let i=0;i<t.length;i+=1)Qx(t.charCodeAt(i),r,n);return new Uint8Array(e)}function Ok(t){const e=[];return Tk(t,r=>e.push(r)),new Uint8Array(e)}function Oi(t){const e=[],r={queue:0,queuedBits:0},n=i=>{e.push(i)};return t.forEach(i=>Em(i,r,n)),Em(null,r,n),e.join("")}function Rk(t){return Math.round(Date.now()/1e3)+t}function Ak(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(t){const e=Math.random()*16|0;return(t=="x"?e:e&3|8).toString(16)})}const Ht=()=>typeof window<"u"&&typeof document<"u",yi={tested:!1,writable:!1},ew=()=>{if(!Ht())return!1;try{if(typeof globalThis.localStorage!="object")return!1}catch{return!1}if(yi.tested)return yi.writable;const t=`lswt-${Math.random()}${Math.random()}`;try{globalThis.localStorage.setItem(t,t),globalThis.localStorage.removeItem(t),yi.tested=!0,yi.writable=!0}catch{yi.tested=!0,yi.writable=!1}return yi.writable};function Pk(t){const e={},r=new URL(t);if(r.hash&&r.hash[0]==="#")try{new URLSearchParams(r.hash.substring(1)).forEach((i,o)=>{e[o]=i})}catch{}return r.searchParams.forEach((n,i)=>{e[i]=n}),e}const tw=t=>t?(...e)=>t(...e):(...e)=>fetch(...e),$k=t=>typeof t=="object"&&t!==null&&"status"in t&&"ok"in t&&"json"in t&&typeof t.json=="function",po=async(t,e,r)=>{await t.setItem(e,JSON.stringify(r))},bi=async(t,e)=>{const r=await t.getItem(e);if(!r)return null;try{return JSON.parse(r)}catch{return r}},$n=async(t,e)=>{await t.removeItem(e)};class nu{constructor(){this.promise=new nu.promiseConstructor((e,r)=>{this.resolve=e,this.reject=r})}}nu.promiseConstructor=Promise;function id(t){const e=t.split(".");if(e.length!==3)throw new Ah("Invalid JWT structure");for(let n=0;n<e.length;n++)if(!xk.test(e[n]))throw new Ah("JWT not in base64url format");return{header:JSON.parse(Cm(e[0])),payload:JSON.parse(Cm(e[1])),signature:Zo(e[2]),raw:{header:e[0],payload:e[1]}}}async function Ik(t){return await new Promise(e=>{setTimeout(()=>e(null),t)})}function Mk(t,e){return new Promise((n,i)=>{(async()=>{for(let o=0;o<1/0;o++)try{const s=await t(o);if(!e(o,null,s)){n(s);return}}catch(s){if(!e(o,s)){i(s);return}}})()})}function Dk(t){return("0"+t.toString(16)).substr(-2)}function Lk(){const e=new Uint32Array(56);if(typeof crypto>"u"){const r="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~",n=r.length;let i="";for(let o=0;o<56;o++)i+=r.charAt(Math.floor(Math.random()*n));return i}return crypto.getRandomValues(e),Array.from(e,Dk).join("")}async function zk(t){const r=new TextEncoder().encode(t),n=await crypto.subtle.digest("SHA-256",r),i=new Uint8Array(n);return Array.from(i).map(o=>String.fromCharCode(o)).join("")}async function Fk(t){if(!(typeof crypto<"u"&&typeof crypto.subtle<"u"&&typeof TextEncoder<"u"))return console.warn("WebCrypto API is not supported. Code challenge method will default to use plain instead of sha256."),t;const r=await zk(t);return btoa(r).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}async function oo(t,e,r=!1){const n=Lk();let i=n;r&&(i+="/PASSWORD_RECOVERY"),await po(t,`${e}-code-verifier`,i);const o=await Fk(n);return[o,n===o?"plain":"s256"]}const Bk=/^2[0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/i;function Uk(t){const e=t.headers.get(Oh);if(!e||!e.match(Bk))return null;try{return new Date(`${e}T00:00:00.0Z`)}catch{return null}}function Hk(t){if(!t)throw new Error("Missing exp claim");const e=Math.floor(Date.now()/1e3);if(t<=e)throw new Error("JWT has expired")}function Gk(t){switch(t){case"RS256":return{name:"RSASSA-PKCS1-v1_5",hash:{name:"SHA-256"}};case"ES256":return{name:"ECDSA",namedCurve:"P-256",hash:{name:"SHA-256"}};default:throw new Error("Invalid alg claim")}}const Wk=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;function so(t){if(!Wk.test(t))throw new Error("@supabase/auth-js: Expected parameter to be UUID but is not")}function od(){const t={};return new Proxy(t,{get:(e,r)=>{if(r==="__isUserNotAvailableProxy")return!0;if(typeof r=="symbol"){const n=r.toString();if(n==="Symbol(Symbol.toPrimitive)"||n==="Symbol(Symbol.toStringTag)"||n==="Symbol(util.inspect.custom)")return}throw new Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Accessing the "${r}" property of the session object is not supported. Please use getUser() instead.`)},set:(e,r)=>{throw new Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Setting the "${r}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`)},deleteProperty:(e,r)=>{throw new Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Deleting the "${r}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`)}})}function Vk(t,e){return new Proxy(t,{get:(r,n,i)=>{if(n==="__isInsecureUserWarningProxy")return!0;if(typeof n=="symbol"){const o=n.toString();if(o==="Symbol(Symbol.toPrimitive)"||o==="Symbol(Symbol.toStringTag)"||o==="Symbol(util.inspect.custom)"||o==="Symbol(nodejs.util.inspect.custom)")return Reflect.get(r,n,i)}return!e.value&&typeof n=="string"&&(console.warn("Using the user object as returned from supabase.auth.getSession() or from some supabase.auth.onAuthStateChange() events could be insecure! This value comes directly from the storage medium (usually cookies on the server) and may not be authentic. Use supabase.auth.getUser() instead which authenticates the data by contacting the Supabase Auth server."),e.value=!0),Reflect.get(r,n,i)}})}function Tm(t){return JSON.parse(JSON.stringify(t))}const Si=t=>t.msg||t.message||t.error_description||t.error||JSON.stringify(t),qk=[502,503,504];async function Nm(t){var e;if(!$k(t))throw new Rh(Si(t),0);if(qk.includes(t.status))throw new Rh(Si(t),t.status);let r;try{r=await t.json()}catch(o){throw new Ei(Si(o),o)}let n;const i=Uk(t);if(i&&i.getTime()>=Jx["2024-01-01"].timestamp&&typeof r=="object"&&r&&typeof r.code=="string"?n=r.code:typeof r=="object"&&r&&typeof r.error_code=="string"&&(n=r.error_code),n){if(n==="weak_password")throw new km(Si(r),t.status,((e=r.weak_password)===null||e===void 0?void 0:e.reasons)||[]);if(n==="session_not_found")throw new Or}else if(typeof r=="object"&&r&&typeof r.weak_password=="object"&&r.weak_password&&Array.isArray(r.weak_password.reasons)&&r.weak_password.reasons.length&&r.weak_password.reasons.reduce((o,s)=>o&&typeof s=="string",!0))throw new km(Si(r),t.status,r.weak_password.reasons);throw new _k(Si(r),t.status||500,n)}const Kk=(t,e,r,n)=>{const i={method:t,headers:(e==null?void 0:e.headers)||{}};return t==="GET"?i:(i.headers=Object.assign({"Content-Type":"application/json;charset=UTF-8"},e==null?void 0:e.headers),i.body=JSON.stringify(n),Object.assign(Object.assign({},i),r))};async function Oe(t,e,r,n){var i;const o=Object.assign({},n==null?void 0:n.headers);o[Oh]||(o[Oh]=Jx["2024-01-01"].name),n!=null&&n.jwt&&(o.Authorization=`Bearer ${n.jwt}`);const s=(i=n==null?void 0:n.query)!==null&&i!==void 0?i:{};n!=null&&n.redirectTo&&(s.redirect_to=n.redirectTo);const a=Object.keys(s).length?"?"+new URLSearchParams(s).toString():"",l=await Yk(t,e,r+a,{headers:o,noResolveJson:n==null?void 0:n.noResolveJson},{},n==null?void 0:n.body);return n!=null&&n.xform?n==null?void 0:n.xform(l):{data:Object.assign({},l),error:null}}async function Yk(t,e,r,n,i,o){const s=Kk(e,n,i,o);let a;try{a=await t(r,Object.assign({},s))}catch(l){throw console.error(l),new Rh(Si(l),0)}if(a.ok||await Nm(a),n!=null&&n.noResolveJson)return a;try{return await a.json()}catch(l){await Nm(l)}}function Rr(t){var e;let r=null;Jk(t)&&(r=Object.assign({},t),t.expires_at||(r.expires_at=Rk(t.expires_in)));const n=(e=t.user)!==null&&e!==void 0?e:t;return{data:{session:r,user:n},error:null}}function Om(t){const e=Rr(t);return!e.error&&t.weak_password&&typeof t.weak_password=="object"&&Array.isArray(t.weak_password.reasons)&&t.weak_password.reasons.length&&t.weak_password.message&&typeof t.weak_password.message=="string"&&t.weak_password.reasons.reduce((r,n)=>r&&typeof n=="string",!0)&&(e.data.weak_password=t.weak_password),e}function Fn(t){var e;return{data:{user:(e=t.user)!==null&&e!==void 0?e:t},error:null}}function Xk(t){return{data:t,error:null}}function Zk(t){const{action_link:e,email_otp:r,hashed_token:n,redirect_to:i,verification_type:o}=t,s=cs(t,["action_link","email_otp","hashed_token","redirect_to","verification_type"]),a={action_link:e,email_otp:r,hashed_token:n,redirect_to:i,verification_type:o},l=Object.assign({},s);return{data:{properties:a,user:l},error:null}}function Rm(t){return t}function Jk(t){return t.access_token&&t.refresh_token&&t.expires_in}const sd=["global","local","others"];class Qk{constructor({url:e="",headers:r={},fetch:n}){this.url=e,this.headers=r,this.fetch=tw(n),this.mfa={listFactors:this._listFactors.bind(this),deleteFactor:this._deleteFactor.bind(this)},this.oauth={listClients:this._listOAuthClients.bind(this),createClient:this._createOAuthClient.bind(this),getClient:this._getOAuthClient.bind(this),updateClient:this._updateOAuthClient.bind(this),deleteClient:this._deleteOAuthClient.bind(this),regenerateClientSecret:this._regenerateOAuthClientSecret.bind(this)}}async signOut(e,r=sd[0]){if(sd.indexOf(r)<0)throw new Error(`@supabase/auth-js: Parameter scope must be one of ${sd.join(", ")}`);try{return await Oe(this.fetch,"POST",`${this.url}/logout?scope=${r}`,{headers:this.headers,jwt:e,noResolveJson:!0}),{data:null,error:null}}catch(n){if(Ee(n))return{data:null,error:n};throw n}}async inviteUserByEmail(e,r={}){try{return await Oe(this.fetch,"POST",`${this.url}/invite`,{body:{email:e,data:r.data},headers:this.headers,redirectTo:r.redirectTo,xform:Fn})}catch(n){if(Ee(n))return{data:{user:null},error:n};throw n}}async generateLink(e){try{const{options:r}=e,n=cs(e,["options"]),i=Object.assign(Object.assign({},n),r);return"newEmail"in n&&(i.new_email=n==null?void 0:n.newEmail,delete i.newEmail),await Oe(this.fetch,"POST",`${this.url}/admin/generate_link`,{body:i,headers:this.headers,xform:Zk,redirectTo:r==null?void 0:r.redirectTo})}catch(r){if(Ee(r))return{data:{properties:null,user:null},error:r};throw r}}async createUser(e){try{return await Oe(this.fetch,"POST",`${this.url}/admin/users`,{body:e,headers:this.headers,xform:Fn})}catch(r){if(Ee(r))return{data:{user:null},error:r};throw r}}async listUsers(e){var r,n,i,o,s,a,l;try{const u={nextPage:null,lastPage:0,total:0},d=await Oe(this.fetch,"GET",`${this.url}/admin/users`,{headers:this.headers,noResolveJson:!0,query:{page:(n=(r=e==null?void 0:e.page)===null||r===void 0?void 0:r.toString())!==null&&n!==void 0?n:"",per_page:(o=(i=e==null?void 0:e.perPage)===null||i===void 0?void 0:i.toString())!==null&&o!==void 0?o:""},xform:Rm});if(d.error)throw d.error;const h=await d.json(),f=(s=d.headers.get("x-total-count"))!==null&&s!==void 0?s:0,p=(l=(a=d.headers.get("link"))===null||a===void 0?void 0:a.split(","))!==null&&l!==void 0?l:[];return p.length>0&&(p.forEach(v=>{const g=parseInt(v.split(";")[0].split("=")[1].substring(0,1)),b=JSON.parse(v.split(";")[1].split("=")[1]);u[`${b}Page`]=g}),u.total=parseInt(f)),{data:Object.assign(Object.assign({},h),u),error:null}}catch(u){if(Ee(u))return{data:{users:[]},error:u};throw u}}async getUserById(e){so(e);try{return await Oe(this.fetch,"GET",`${this.url}/admin/users/${e}`,{headers:this.headers,xform:Fn})}catch(r){if(Ee(r))return{data:{user:null},error:r};throw r}}async updateUserById(e,r){so(e);try{return await Oe(this.fetch,"PUT",`${this.url}/admin/users/${e}`,{body:r,headers:this.headers,xform:Fn})}catch(n){if(Ee(n))return{data:{user:null},error:n};throw n}}async deleteUser(e,r=!1){so(e);try{return await Oe(this.fetch,"DELETE",`${this.url}/admin/users/${e}`,{headers:this.headers,body:{should_soft_delete:r},xform:Fn})}catch(n){if(Ee(n))return{data:{user:null},error:n};throw n}}async _listFactors(e){so(e.userId);try{const{data:r,error:n}=await Oe(this.fetch,"GET",`${this.url}/admin/users/${e.userId}/factors`,{headers:this.headers,xform:i=>({data:{factors:i},error:null})});return{data:r,error:n}}catch(r){if(Ee(r))return{data:null,error:r};throw r}}async _deleteFactor(e){so(e.userId),so(e.id);try{return{data:await Oe(this.fetch,"DELETE",`${this.url}/admin/users/${e.userId}/factors/${e.id}`,{headers:this.headers}),error:null}}catch(r){if(Ee(r))return{data:null,error:r};throw r}}async _listOAuthClients(e){var r,n,i,o,s,a,l;try{const u={nextPage:null,lastPage:0,total:0},d=await Oe(this.fetch,"GET",`${this.url}/admin/oauth/clients`,{headers:this.headers,noResolveJson:!0,query:{page:(n=(r=e==null?void 0:e.page)===null||r===void 0?void 0:r.toString())!==null&&n!==void 0?n:"",per_page:(o=(i=e==null?void 0:e.perPage)===null||i===void 0?void 0:i.toString())!==null&&o!==void 0?o:""},xform:Rm});if(d.error)throw d.error;const h=await d.json(),f=(s=d.headers.get("x-total-count"))!==null&&s!==void 0?s:0,p=(l=(a=d.headers.get("link"))===null||a===void 0?void 0:a.split(","))!==null&&l!==void 0?l:[];return p.length>0&&(p.forEach(v=>{const g=parseInt(v.split(";")[0].split("=")[1].substring(0,1)),b=JSON.parse(v.split(";")[1].split("=")[1]);u[`${b}Page`]=g}),u.total=parseInt(f)),{data:Object.assign(Object.assign({},h),u),error:null}}catch(u){if(Ee(u))return{data:{clients:[]},error:u};throw u}}async _createOAuthClient(e){try{return await Oe(this.fetch,"POST",`${this.url}/admin/oauth/clients`,{body:e,headers:this.headers,xform:r=>({data:r,error:null})})}catch(r){if(Ee(r))return{data:null,error:r};throw r}}async _getOAuthClient(e){try{return await Oe(this.fetch,"GET",`${this.url}/admin/oauth/clients/${e}`,{headers:this.headers,xform:r=>({data:r,error:null})})}catch(r){if(Ee(r))return{data:null,error:r};throw r}}async _updateOAuthClient(e,r){try{return await Oe(this.fetch,"PUT",`${this.url}/admin/oauth/clients/${e}`,{body:r,headers:this.headers,xform:n=>({data:n,error:null})})}catch(n){if(Ee(n))return{data:null,error:n};throw n}}async _deleteOAuthClient(e){try{return await Oe(this.fetch,"DELETE",`${this.url}/admin/oauth/clients/${e}`,{headers:this.headers,noResolveJson:!0}),{data:null,error:null}}catch(r){if(Ee(r))return{data:null,error:r};throw r}}async _regenerateOAuthClientSecret(e){try{return await Oe(this.fetch,"POST",`${this.url}/admin/oauth/clients/${e}/regenerate_secret`,{headers:this.headers,xform:r=>({data:r,error:null})})}catch(r){if(Ee(r))return{data:null,error:r};throw r}}}function Am(t={}){return{getItem:e=>t[e]||null,setItem:(e,r)=>{t[e]=r},removeItem:e=>{delete t[e]}}}const ao={debug:!!(globalThis&&ew()&&globalThis.localStorage&&globalThis.localStorage.getItem("supabase.gotrue-js.locks.debug")==="true")};class rw extends Error{constructor(e){super(e),this.isAcquireTimeout=!0}}class ej extends rw{}async function tj(t,e,r){ao.debug&&console.log("@supabase/gotrue-js: navigatorLock: acquire lock",t,e);const n=new globalThis.AbortController;return e>0&&setTimeout(()=>{n.abort(),ao.debug&&console.log("@supabase/gotrue-js: navigatorLock acquire timed out",t)},e),await Promise.resolve().then(()=>globalThis.navigator.locks.request(t,e===0?{mode:"exclusive",ifAvailable:!0}:{mode:"exclusive",signal:n.signal},async i=>{if(i){ao.debug&&console.log("@supabase/gotrue-js: navigatorLock: acquired",t,i.name);try{return await r()}finally{ao.debug&&console.log("@supabase/gotrue-js: navigatorLock: released",t,i.name)}}else{if(e===0)throw ao.debug&&console.log("@supabase/gotrue-js: navigatorLock: not immediately available",t),new ej(`Acquiring an exclusive Navigator LockManager lock "${t}" immediately failed`);if(ao.debug)try{const o=await globalThis.navigator.locks.query();console.log("@supabase/gotrue-js: Navigator LockManager state",JSON.stringify(o,null,"  "))}catch(o){console.warn("@supabase/gotrue-js: Error when querying Navigator LockManager state",o)}return console.warn("@supabase/gotrue-js: Navigator LockManager returned a null lock when using #request without ifAvailable set to true, it appears this browser is not following the LockManager spec https://developer.mozilla.org/en-US/docs/Web/API/LockManager/request"),await r()}}))}function rj(){if(typeof globalThis!="object")try{Object.defineProperty(Object.prototype,"__magic__",{get:function(){return this},configurable:!0}),__magic__.globalThis=__magic__,delete Object.prototype.__magic__}catch{typeof self<"u"&&(self.globalThis=self)}}function nw(t){if(!/^0x[a-fA-F0-9]{40}$/.test(t))throw new Error(`@supabase/auth-js: Address "${t}" is invalid.`);return t.toLowerCase()}function nj(t){return parseInt(t,16)}function ij(t){const e=new TextEncoder().encode(t);return"0x"+Array.from(e,n=>n.toString(16).padStart(2,"0")).join("")}function oj(t){var e;const{chainId:r,domain:n,expirationTime:i,issuedAt:o=new Date,nonce:s,notBefore:a,requestId:l,resources:u,scheme:d,uri:h,version:f}=t;{if(!Number.isInteger(r))throw new Error(`@supabase/auth-js: Invalid SIWE message field "chainId". Chain ID must be a EIP-155 chain ID. Provided value: ${r}`);if(!n)throw new Error('@supabase/auth-js: Invalid SIWE message field "domain". Domain must be provided.');if(s&&s.length<8)throw new Error(`@supabase/auth-js: Invalid SIWE message field "nonce". Nonce must be at least 8 characters. Provided value: ${s}`);if(!h)throw new Error('@supabase/auth-js: Invalid SIWE message field "uri". URI must be provided.');if(f!=="1")throw new Error(`@supabase/auth-js: Invalid SIWE message field "version". Version must be '1'. Provided value: ${f}`);if(!((e=t.statement)===null||e===void 0)&&e.includes(`
`))throw new Error(`@supabase/auth-js: Invalid SIWE message field "statement". Statement must not include '\\n'. Provided value: ${t.statement}`)}const p=nw(t.address),v=d?`${d}://${n}`:n,g=t.statement?`${t.statement}
`:"",b=`${v} wants you to sign in with your Ethereum account:
${p}

${g}`;let m=`URI: ${h}
Version: ${f}
Chain ID: ${r}${s?`
Nonce: ${s}`:""}
Issued At: ${o.toISOString()}`;if(i&&(m+=`
Expiration Time: ${i.toISOString()}`),a&&(m+=`
Not Before: ${a.toISOString()}`),l&&(m+=`
Request ID: ${l}`),u){let y=`
Resources:`;for(const x of u){if(!x||typeof x!="string")throw new Error(`@supabase/auth-js: Invalid SIWE message field "resources". Every resource must be a valid string. Provided value: ${x}`);y+=`
- ${x}`}m+=y}return`${b}
${m}`}class jt extends Error{constructor({message:e,code:r,cause:n,name:i}){var o;super(e,{cause:n}),this.__isWebAuthnError=!0,this.name=(o=i??(n instanceof Error?n.name:void 0))!==null&&o!==void 0?o:"Unknown Error",this.code=r}}class Ec extends jt{constructor(e,r){super({code:"ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",cause:r,message:e}),this.name="WebAuthnUnknownError",this.originalError=r}}function sj({error:t,options:e}){var r,n,i;const{publicKey:o}=e;if(!o)throw Error("options was missing required publicKey property");if(t.name==="AbortError"){if(e.signal instanceof AbortSignal)return new jt({message:"Registration ceremony was sent an abort signal",code:"ERROR_CEREMONY_ABORTED",cause:t})}else if(t.name==="ConstraintError"){if(((r=o.authenticatorSelection)===null||r===void 0?void 0:r.requireResidentKey)===!0)return new jt({message:"Discoverable credentials were required but no available authenticator supported it",code:"ERROR_AUTHENTICATOR_MISSING_DISCOVERABLE_CREDENTIAL_SUPPORT",cause:t});if(e.mediation==="conditional"&&((n=o.authenticatorSelection)===null||n===void 0?void 0:n.userVerification)==="required")return new jt({message:"User verification was required during automatic registration but it could not be performed",code:"ERROR_AUTO_REGISTER_USER_VERIFICATION_FAILURE",cause:t});if(((i=o.authenticatorSelection)===null||i===void 0?void 0:i.userVerification)==="required")return new jt({message:"User verification was required but no available authenticator supported it",code:"ERROR_AUTHENTICATOR_MISSING_USER_VERIFICATION_SUPPORT",cause:t})}else{if(t.name==="InvalidStateError")return new jt({message:"The authenticator was previously registered",code:"ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED",cause:t});if(t.name==="NotAllowedError")return new jt({message:t.message,code:"ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",cause:t});if(t.name==="NotSupportedError")return o.pubKeyCredParams.filter(a=>a.type==="public-key").length===0?new jt({message:'No entry in pubKeyCredParams was of type "public-key"',code:"ERROR_MALFORMED_PUBKEYCREDPARAMS",cause:t}):new jt({message:"No available authenticator supported any of the specified pubKeyCredParams algorithms",code:"ERROR_AUTHENTICATOR_NO_SUPPORTED_PUBKEYCREDPARAMS_ALG",cause:t});if(t.name==="SecurityError"){const s=window.location.hostname;if(iw(s)){if(o.rp.id!==s)return new jt({message:`The RP ID "${o.rp.id}" is invalid for this domain`,code:"ERROR_INVALID_RP_ID",cause:t})}else return new jt({message:`${window.location.hostname} is an invalid domain`,code:"ERROR_INVALID_DOMAIN",cause:t})}else if(t.name==="TypeError"){if(o.user.id.byteLength<1||o.user.id.byteLength>64)return new jt({message:"User ID was not between 1 and 64 characters",code:"ERROR_INVALID_USER_ID_LENGTH",cause:t})}else if(t.name==="UnknownError")return new jt({message:"The authenticator was unable to process the specified options, or could not create a new credential",code:"ERROR_AUTHENTICATOR_GENERAL_ERROR",cause:t})}return new jt({message:"a Non-Webauthn related error has occurred",code:"ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",cause:t})}function aj({error:t,options:e}){const{publicKey:r}=e;if(!r)throw Error("options was missing required publicKey property");if(t.name==="AbortError"){if(e.signal instanceof AbortSignal)return new jt({message:"Authentication ceremony was sent an abort signal",code:"ERROR_CEREMONY_ABORTED",cause:t})}else{if(t.name==="NotAllowedError")return new jt({message:t.message,code:"ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",cause:t});if(t.name==="SecurityError"){const n=window.location.hostname;if(iw(n)){if(r.rpId!==n)return new jt({message:`The RP ID "${r.rpId}" is invalid for this domain`,code:"ERROR_INVALID_RP_ID",cause:t})}else return new jt({message:`${window.location.hostname} is an invalid domain`,code:"ERROR_INVALID_DOMAIN",cause:t})}else if(t.name==="UnknownError")return new jt({message:"The authenticator was unable to process the specified options, or could not create a new assertion signature",code:"ERROR_AUTHENTICATOR_GENERAL_ERROR",cause:t})}return new jt({message:"a Non-Webauthn related error has occurred",code:"ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",cause:t})}class lj{createNewAbortSignal(){if(this.controller){const r=new Error("Cancelling existing WebAuthn API call for new one");r.name="AbortError",this.controller.abort(r)}const e=new AbortController;return this.controller=e,e.signal}cancelCeremony(){if(this.controller){const e=new Error("Manually cancelling existing WebAuthn API call");e.name="AbortError",this.controller.abort(e),this.controller=void 0}}}const cj=new lj;function uj(t){if(!t)throw new Error("Credential creation options are required");if(typeof PublicKeyCredential<"u"&&"parseCreationOptionsFromJSON"in PublicKeyCredential&&typeof PublicKeyCredential.parseCreationOptionsFromJSON=="function")return PublicKeyCredential.parseCreationOptionsFromJSON(t);const{challenge:e,user:r,excludeCredentials:n}=t,i=cs(t,["challenge","user","excludeCredentials"]),o=Zo(e).buffer,s=Object.assign(Object.assign({},r),{id:Zo(r.id).buffer}),a=Object.assign(Object.assign({},i),{challenge:o,user:s});if(n&&n.length>0){a.excludeCredentials=new Array(n.length);for(let l=0;l<n.length;l++){const u=n[l];a.excludeCredentials[l]=Object.assign(Object.assign({},u),{id:Zo(u.id).buffer,type:u.type||"public-key",transports:u.transports})}}return a}function dj(t){if(!t)throw new Error("Credential request options are required");if(typeof PublicKeyCredential<"u"&&"parseRequestOptionsFromJSON"in PublicKeyCredential&&typeof PublicKeyCredential.parseRequestOptionsFromJSON=="function")return PublicKeyCredential.parseRequestOptionsFromJSON(t);const{challenge:e,allowCredentials:r}=t,n=cs(t,["challenge","allowCredentials"]),i=Zo(e).buffer,o=Object.assign(Object.assign({},n),{challenge:i});if(r&&r.length>0){o.allowCredentials=new Array(r.length);for(let s=0;s<r.length;s++){const a=r[s];o.allowCredentials[s]=Object.assign(Object.assign({},a),{id:Zo(a.id).buffer,type:a.type||"public-key",transports:a.transports})}}return o}function hj(t){var e;if("toJSON"in t&&typeof t.toJSON=="function")return t.toJSON();const r=t;return{id:t.id,rawId:t.id,response:{attestationObject:Oi(new Uint8Array(t.response.attestationObject)),clientDataJSON:Oi(new Uint8Array(t.response.clientDataJSON))},type:"public-key",clientExtensionResults:t.getClientExtensionResults(),authenticatorAttachment:(e=r.authenticatorAttachment)!==null&&e!==void 0?e:void 0}}function fj(t){var e;if("toJSON"in t&&typeof t.toJSON=="function")return t.toJSON();const r=t,n=t.getClientExtensionResults(),i=t.response;return{id:t.id,rawId:t.id,response:{authenticatorData:Oi(new Uint8Array(i.authenticatorData)),clientDataJSON:Oi(new Uint8Array(i.clientDataJSON)),signature:Oi(new Uint8Array(i.signature)),userHandle:i.userHandle?Oi(new Uint8Array(i.userHandle)):void 0},type:"public-key",clientExtensionResults:n,authenticatorAttachment:(e=r.authenticatorAttachment)!==null&&e!==void 0?e:void 0}}function iw(t){return t==="localhost"||/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i.test(t)}function Pm(){var t,e;return!!(Ht()&&"PublicKeyCredential"in window&&window.PublicKeyCredential&&"credentials"in navigator&&typeof((t=navigator==null?void 0:navigator.credentials)===null||t===void 0?void 0:t.create)=="function"&&typeof((e=navigator==null?void 0:navigator.credentials)===null||e===void 0?void 0:e.get)=="function")}async function pj(t){try{const e=await navigator.credentials.create(t);return e?e instanceof PublicKeyCredential?{data:e,error:null}:{data:null,error:new Ec("Browser returned unexpected credential type",e)}:{data:null,error:new Ec("Empty credential response",e)}}catch(e){return{data:null,error:sj({error:e,options:t})}}}async function gj(t){try{const e=await navigator.credentials.get(t);return e?e instanceof PublicKeyCredential?{data:e,error:null}:{data:null,error:new Ec("Browser returned unexpected credential type",e)}:{data:null,error:new Ec("Empty credential response",e)}}catch(e){return{data:null,error:aj({error:e,options:t})}}}const mj={hints:["security-key"],authenticatorSelection:{authenticatorAttachment:"cross-platform",requireResidentKey:!1,userVerification:"preferred",residentKey:"discouraged"},attestation:"none"},vj={userVerification:"preferred",hints:["security-key"]};function Cc(...t){const e=i=>i!==null&&typeof i=="object"&&!Array.isArray(i),r=i=>i instanceof ArrayBuffer||ArrayBuffer.isView(i),n={};for(const i of t)if(i)for(const o in i){const s=i[o];if(s!==void 0)if(Array.isArray(s))n[o]=s;else if(r(s))n[o]=s;else if(e(s)){const a=n[o];e(a)?n[o]=Cc(a,s):n[o]=Cc(s)}else n[o]=s}return n}function yj(t,e){return Cc(mj,t,e||{})}function bj(t,e){return Cc(vj,t,e||{})}class xj{constructor(e){this.client=e,this.enroll=this._enroll.bind(this),this.challenge=this._challenge.bind(this),this.verify=this._verify.bind(this),this.authenticate=this._authenticate.bind(this),this.register=this._register.bind(this)}async _enroll(e){return this.client.mfa.enroll(Object.assign(Object.assign({},e),{factorType:"webauthn"}))}async _challenge({factorId:e,webauthn:r,friendlyName:n,signal:i},o){try{const{data:s,error:a}=await this.client.mfa.challenge({factorId:e,webauthn:r});if(!s)return{data:null,error:a};const l=i??cj.createNewAbortSignal();if(s.webauthn.type==="create"){const{user:u}=s.webauthn.credential_options.publicKey;u.name||(u.name=`${u.id}:${n}`),u.displayName||(u.displayName=u.name)}switch(s.webauthn.type){case"create":{const u=yj(s.webauthn.credential_options.publicKey,o==null?void 0:o.create),{data:d,error:h}=await pj({publicKey:u,signal:l});return d?{data:{factorId:e,challengeId:s.id,webauthn:{type:s.webauthn.type,credential_response:d}},error:null}:{data:null,error:h}}case"request":{const u=bj(s.webauthn.credential_options.publicKey,o==null?void 0:o.request),{data:d,error:h}=await gj(Object.assign(Object.assign({},s.webauthn.credential_options),{publicKey:u,signal:l}));return d?{data:{factorId:e,challengeId:s.id,webauthn:{type:s.webauthn.type,credential_response:d}},error:null}:{data:null,error:h}}}}catch(s){return Ee(s)?{data:null,error:s}:{data:null,error:new Ei("Unexpected error in challenge",s)}}}async _verify({challengeId:e,factorId:r,webauthn:n}){return this.client.mfa.verify({factorId:r,challengeId:e,webauthn:n})}async _authenticate({factorId:e,webauthn:{rpId:r=typeof window<"u"?window.location.hostname:void 0,rpOrigins:n=typeof window<"u"?[window.location.origin]:void 0,signal:i}},o){if(!r)return{data:null,error:new Pa("rpId is required for WebAuthn authentication")};try{if(!Pm())return{data:null,error:new Ei("Browser does not support WebAuthn",null)};const{data:s,error:a}=await this.challenge({factorId:e,webauthn:{rpId:r,rpOrigins:n},signal:i},{request:o});if(!s)return{data:null,error:a};const{webauthn:l}=s;return this._verify({factorId:e,challengeId:s.challengeId,webauthn:{type:l.type,rpId:r,rpOrigins:n,credential_response:l.credential_response}})}catch(s){return Ee(s)?{data:null,error:s}:{data:null,error:new Ei("Unexpected error in authenticate",s)}}}async _register({friendlyName:e,rpId:r=typeof window<"u"?window.location.hostname:void 0,rpOrigins:n=typeof window<"u"?[window.location.origin]:void 0,signal:i},o){if(!r)return{data:null,error:new Pa("rpId is required for WebAuthn registration")};try{if(!Pm())return{data:null,error:new Ei("Browser does not support WebAuthn",null)};const{data:s,error:a}=await this._enroll({friendlyName:e});if(!s)return await this.client.mfa.listFactors().then(d=>{var h;return(h=d.data)===null||h===void 0?void 0:h.all.find(f=>f.factor_type==="webauthn"&&f.friendly_name===e&&f.status!=="unverified")}).then(d=>d?this.client.mfa.unenroll({factorId:d==null?void 0:d.id}):void 0),{data:null,error:a};const{data:l,error:u}=await this._challenge({factorId:s.id,friendlyName:s.friendly_name,webauthn:{rpId:r,rpOrigins:n},signal:i},{create:o});return l?this._verify({factorId:s.id,challengeId:l.challengeId,webauthn:{rpId:r,rpOrigins:n,type:l.webauthn.type,credential_response:l.webauthn.credential_response}}):{data:null,error:u}}catch(s){return Ee(s)?{data:null,error:s}:{data:null,error:new Ei("Unexpected error in register",s)}}}}rj();const wj={url:vk,storageKey:yk,autoRefreshToken:!0,persistSession:!0,detectSessionInUrl:!0,headers:bk,flowType:"implicit",debug:!1,hasCustomAuthorizationHeader:!1,throwOnError:!1};async function $m(t,e,r){return await r()}const lo={};class $a{get jwks(){var e,r;return(r=(e=lo[this.storageKey])===null||e===void 0?void 0:e.jwks)!==null&&r!==void 0?r:{keys:[]}}set jwks(e){lo[this.storageKey]=Object.assign(Object.assign({},lo[this.storageKey]),{jwks:e})}get jwks_cached_at(){var e,r;return(r=(e=lo[this.storageKey])===null||e===void 0?void 0:e.cachedAt)!==null&&r!==void 0?r:Number.MIN_SAFE_INTEGER}set jwks_cached_at(e){lo[this.storageKey]=Object.assign(Object.assign({},lo[this.storageKey]),{cachedAt:e})}constructor(e){var r,n;this.userStorage=null,this.memoryStorage=null,this.stateChangeEmitters=new Map,this.autoRefreshTicker=null,this.visibilityChangedCallback=null,this.refreshingDeferred=null,this.initializePromise=null,this.detectSessionInUrl=!0,this.hasCustomAuthorizationHeader=!1,this.suppressGetSessionWarning=!1,this.lockAcquired=!1,this.pendingInLock=[],this.broadcastChannel=null,this.logger=console.log,this.instanceID=$a.nextInstanceID,$a.nextInstanceID+=1,this.instanceID>0&&Ht()&&console.warn("Multiple GoTrueClient instances detected in the same browser context. It is not an error, but this should be avoided as it may produce undefined behavior when used concurrently under the same storage key.");const i=Object.assign(Object.assign({},wj),e);if(this.logDebugMessages=!!i.debug,typeof i.debug=="function"&&(this.logger=i.debug),this.persistSession=i.persistSession,this.storageKey=i.storageKey,this.autoRefreshToken=i.autoRefreshToken,this.admin=new Qk({url:i.url,headers:i.headers,fetch:i.fetch}),this.url=i.url,this.headers=i.headers,this.fetch=tw(i.fetch),this.lock=i.lock||$m,this.detectSessionInUrl=i.detectSessionInUrl,this.flowType=i.flowType,this.hasCustomAuthorizationHeader=i.hasCustomAuthorizationHeader,this.throwOnError=i.throwOnError,i.lock?this.lock=i.lock:Ht()&&(!((r=globalThis==null?void 0:globalThis.navigator)===null||r===void 0)&&r.locks)?this.lock=tj:this.lock=$m,this.jwks||(this.jwks={keys:[]},this.jwks_cached_at=Number.MIN_SAFE_INTEGER),this.mfa={verify:this._verify.bind(this),enroll:this._enroll.bind(this),unenroll:this._unenroll.bind(this),challenge:this._challenge.bind(this),listFactors:this._listFactors.bind(this),challengeAndVerify:this._challengeAndVerify.bind(this),getAuthenticatorAssuranceLevel:this._getAuthenticatorAssuranceLevel.bind(this),webauthn:new xj(this)},this.oauth={getAuthorizationDetails:this._getAuthorizationDetails.bind(this),approveAuthorization:this._approveAuthorization.bind(this),denyAuthorization:this._denyAuthorization.bind(this)},this.persistSession?(i.storage?this.storage=i.storage:ew()?this.storage=globalThis.localStorage:(this.memoryStorage={},this.storage=Am(this.memoryStorage)),i.userStorage&&(this.userStorage=i.userStorage)):(this.memoryStorage={},this.storage=Am(this.memoryStorage)),Ht()&&globalThis.BroadcastChannel&&this.persistSession&&this.storageKey){try{this.broadcastChannel=new globalThis.BroadcastChannel(this.storageKey)}catch(o){console.error("Failed to create a new BroadcastChannel, multi-tab state changes will not be available",o)}(n=this.broadcastChannel)===null||n===void 0||n.addEventListener("message",async o=>{this._debug("received broadcast notification from other tab or client",o),await this._notifyAllSubscribers(o.data.event,o.data.session,!1)})}this.initialize()}isThrowOnErrorEnabled(){return this.throwOnError}_returnResult(e){if(this.throwOnError&&e&&e.error)throw e.error;return e}_debug(...e){return this.logDebugMessages&&this.logger(`GoTrueClient@${this.instanceID} (${Zx}) ${new Date().toISOString()}`,...e),this}async initialize(){return this.initializePromise?await this.initializePromise:(this.initializePromise=(async()=>await this._acquireLock(-1,async()=>await this._initialize()))(),await this.initializePromise)}async _initialize(){var e;try{let r={},n="none";if(Ht()&&(r=Pk(window.location.href),this._isImplicitGrantCallback(r)?n="implicit":await this._isPKCECallback(r)&&(n="pkce")),Ht()&&this.detectSessionInUrl&&n!=="none"){const{data:i,error:o}=await this._getSessionFromURL(r,n);if(o){if(this._debug("#_initialize()","error detecting session from URL",o),jk(o)){const l=(e=o.details)===null||e===void 0?void 0:e.code;if(l==="identity_already_exists"||l==="identity_not_found"||l==="single_identity_not_deletable")return{error:o}}return await this._removeSession(),{error:o}}const{session:s,redirectType:a}=i;return this._debug("#_initialize()","detected session in URL",s,"redirect type",a),await this._saveSession(s),setTimeout(async()=>{a==="recovery"?await this._notifyAllSubscribers("PASSWORD_RECOVERY",s):await this._notifyAllSubscribers("SIGNED_IN",s)},0),{error:null}}return await this._recoverAndRefresh(),{error:null}}catch(r){return Ee(r)?this._returnResult({error:r}):this._returnResult({error:new Ei("Unexpected error during initialization",r)})}finally{await this._handleVisibilityChange(),this._debug("#_initialize()","end")}}async signInAnonymously(e){var r,n,i;try{const o=await Oe(this.fetch,"POST",`${this.url}/signup`,{headers:this.headers,body:{data:(n=(r=e==null?void 0:e.options)===null||r===void 0?void 0:r.data)!==null&&n!==void 0?n:{},gotrue_meta_security:{captcha_token:(i=e==null?void 0:e.options)===null||i===void 0?void 0:i.captchaToken}},xform:Rr}),{data:s,error:a}=o;if(a||!s)return this._returnResult({data:{user:null,session:null},error:a});const l=s.session,u=s.user;return s.session&&(await this._saveSession(s.session),await this._notifyAllSubscribers("SIGNED_IN",l)),this._returnResult({data:{user:u,session:l},error:null})}catch(o){if(Ee(o))return this._returnResult({data:{user:null,session:null},error:o});throw o}}async signUp(e){var r,n,i;try{let o;if("email"in e){const{email:d,password:h,options:f}=e;let p=null,v=null;this.flowType==="pkce"&&([p,v]=await oo(this.storage,this.storageKey)),o=await Oe(this.fetch,"POST",`${this.url}/signup`,{headers:this.headers,redirectTo:f==null?void 0:f.emailRedirectTo,body:{email:d,password:h,data:(r=f==null?void 0:f.data)!==null&&r!==void 0?r:{},gotrue_meta_security:{captcha_token:f==null?void 0:f.captchaToken},code_challenge:p,code_challenge_method:v},xform:Rr})}else if("phone"in e){const{phone:d,password:h,options:f}=e;o=await Oe(this.fetch,"POST",`${this.url}/signup`,{headers:this.headers,body:{phone:d,password:h,data:(n=f==null?void 0:f.data)!==null&&n!==void 0?n:{},channel:(i=f==null?void 0:f.channel)!==null&&i!==void 0?i:"sms",gotrue_meta_security:{captcha_token:f==null?void 0:f.captchaToken}},xform:Rr})}else throw new Ol("You must provide either an email or phone number and a password");const{data:s,error:a}=o;if(a||!s)return this._returnResult({data:{user:null,session:null},error:a});const l=s.session,u=s.user;return s.session&&(await this._saveSession(s.session),await this._notifyAllSubscribers("SIGNED_IN",l)),this._returnResult({data:{user:u,session:l},error:null})}catch(o){if(Ee(o))return this._returnResult({data:{user:null,session:null},error:o});throw o}}async signInWithPassword(e){try{let r;if("email"in e){const{email:o,password:s,options:a}=e;r=await Oe(this.fetch,"POST",`${this.url}/token?grant_type=password`,{headers:this.headers,body:{email:o,password:s,gotrue_meta_security:{captcha_token:a==null?void 0:a.captchaToken}},xform:Om})}else if("phone"in e){const{phone:o,password:s,options:a}=e;r=await Oe(this.fetch,"POST",`${this.url}/token?grant_type=password`,{headers:this.headers,body:{phone:o,password:s,gotrue_meta_security:{captcha_token:a==null?void 0:a.captchaToken}},xform:Om})}else throw new Ol("You must provide either an email or phone number and a password");const{data:n,error:i}=r;if(i)return this._returnResult({data:{user:null,session:null},error:i});if(!n||!n.session||!n.user){const o=new io;return this._returnResult({data:{user:null,session:null},error:o})}return n.session&&(await this._saveSession(n.session),await this._notifyAllSubscribers("SIGNED_IN",n.session)),this._returnResult({data:Object.assign({user:n.user,session:n.session},n.weak_password?{weakPassword:n.weak_password}:null),error:i})}catch(r){if(Ee(r))return this._returnResult({data:{user:null,session:null},error:r});throw r}}async signInWithOAuth(e){var r,n,i,o;return await this._handleProviderSignIn(e.provider,{redirectTo:(r=e.options)===null||r===void 0?void 0:r.redirectTo,scopes:(n=e.options)===null||n===void 0?void 0:n.scopes,queryParams:(i=e.options)===null||i===void 0?void 0:i.queryParams,skipBrowserRedirect:(o=e.options)===null||o===void 0?void 0:o.skipBrowserRedirect})}async exchangeCodeForSession(e){return await this.initializePromise,this._acquireLock(-1,async()=>this._exchangeCodeForSession(e))}async signInWithWeb3(e){const{chain:r}=e;switch(r){case"ethereum":return await this.signInWithEthereum(e);case"solana":return await this.signInWithSolana(e);default:throw new Error(`@supabase/auth-js: Unsupported chain "${r}"`)}}async signInWithEthereum(e){var r,n,i,o,s,a,l,u,d,h,f;let p,v;if("message"in e)p=e.message,v=e.signature;else{const{chain:g,wallet:b,statement:m,options:y}=e;let x;if(Ht())if(typeof b=="object")x=b;else{const E=window;if("ethereum"in E&&typeof E.ethereum=="object"&&"request"in E.ethereum&&typeof E.ethereum.request=="function")x=E.ethereum;else throw new Error("@supabase/auth-js: No compatible Ethereum wallet interface on the window object (window.ethereum) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'ethereum', wallet: resolvedUserWallet }) instead.")}else{if(typeof b!="object"||!(y!=null&&y.url))throw new Error("@supabase/auth-js: Both wallet and url must be specified in non-browser environments.");x=b}const w=new URL((r=y==null?void 0:y.url)!==null&&r!==void 0?r:window.location.href),j=await x.request({method:"eth_requestAccounts"}).then(E=>E).catch(()=>{throw new Error("@supabase/auth-js: Wallet method eth_requestAccounts is missing or invalid")});if(!j||j.length===0)throw new Error("@supabase/auth-js: No accounts available. Please ensure the wallet is connected.");const S=nw(j[0]);let C=(n=y==null?void 0:y.signInWithEthereum)===null||n===void 0?void 0:n.chainId;if(!C){const E=await x.request({method:"eth_chainId"});C=nj(E)}const N={domain:w.host,address:S,statement:m,uri:w.href,version:"1",chainId:C,nonce:(i=y==null?void 0:y.signInWithEthereum)===null||i===void 0?void 0:i.nonce,issuedAt:(s=(o=y==null?void 0:y.signInWithEthereum)===null||o===void 0?void 0:o.issuedAt)!==null&&s!==void 0?s:new Date,expirationTime:(a=y==null?void 0:y.signInWithEthereum)===null||a===void 0?void 0:a.expirationTime,notBefore:(l=y==null?void 0:y.signInWithEthereum)===null||l===void 0?void 0:l.notBefore,requestId:(u=y==null?void 0:y.signInWithEthereum)===null||u===void 0?void 0:u.requestId,resources:(d=y==null?void 0:y.signInWithEthereum)===null||d===void 0?void 0:d.resources};p=oj(N),v=await x.request({method:"personal_sign",params:[ij(p),S]})}try{const{data:g,error:b}=await Oe(this.fetch,"POST",`${this.url}/token?grant_type=web3`,{headers:this.headers,body:Object.assign({chain:"ethereum",message:p,signature:v},!((h=e.options)===null||h===void 0)&&h.captchaToken?{gotrue_meta_security:{captcha_token:(f=e.options)===null||f===void 0?void 0:f.captchaToken}}:null),xform:Rr});if(b)throw b;if(!g||!g.session||!g.user){const m=new io;return this._returnResult({data:{user:null,session:null},error:m})}return g.session&&(await this._saveSession(g.session),await this._notifyAllSubscribers("SIGNED_IN",g.session)),this._returnResult({data:Object.assign({},g),error:b})}catch(g){if(Ee(g))return this._returnResult({data:{user:null,session:null},error:g});throw g}}async signInWithSolana(e){var r,n,i,o,s,a,l,u,d,h,f,p;let v,g;if("message"in e)v=e.message,g=e.signature;else{const{chain:b,wallet:m,statement:y,options:x}=e;let w;if(Ht())if(typeof m=="object")w=m;else{const S=window;if("solana"in S&&typeof S.solana=="object"&&("signIn"in S.solana&&typeof S.solana.signIn=="function"||"signMessage"in S.solana&&typeof S.solana.signMessage=="function"))w=S.solana;else throw new Error("@supabase/auth-js: No compatible Solana wallet interface on the window object (window.solana) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'solana', wallet: resolvedUserWallet }) instead.")}else{if(typeof m!="object"||!(x!=null&&x.url))throw new Error("@supabase/auth-js: Both wallet and url must be specified in non-browser environments.");w=m}const j=new URL((r=x==null?void 0:x.url)!==null&&r!==void 0?r:window.location.href);if("signIn"in w&&w.signIn){const S=await w.signIn(Object.assign(Object.assign(Object.assign({issuedAt:new Date().toISOString()},x==null?void 0:x.signInWithSolana),{version:"1",domain:j.host,uri:j.href}),y?{statement:y}:null));let C;if(Array.isArray(S)&&S[0]&&typeof S[0]=="object")C=S[0];else if(S&&typeof S=="object"&&"signedMessage"in S&&"signature"in S)C=S;else throw new Error("@supabase/auth-js: Wallet method signIn() returned unrecognized value");if("signedMessage"in C&&"signature"in C&&(typeof C.signedMessage=="string"||C.signedMessage instanceof Uint8Array)&&C.signature instanceof Uint8Array)v=typeof C.signedMessage=="string"?C.signedMessage:new TextDecoder().decode(C.signedMessage),g=C.signature;else throw new Error("@supabase/auth-js: Wallet method signIn() API returned object without signedMessage and signature fields")}else{if(!("signMessage"in w)||typeof w.signMessage!="function"||!("publicKey"in w)||typeof w!="object"||!w.publicKey||!("toBase58"in w.publicKey)||typeof w.publicKey.toBase58!="function")throw new Error("@supabase/auth-js: Wallet does not have a compatible signMessage() and publicKey.toBase58() API");v=[`${j.host} wants you to sign in with your Solana account:`,w.publicKey.toBase58(),...y?["",y,""]:[""],"Version: 1",`URI: ${j.href}`,`Issued At: ${(i=(n=x==null?void 0:x.signInWithSolana)===null||n===void 0?void 0:n.issuedAt)!==null&&i!==void 0?i:new Date().toISOString()}`,...!((o=x==null?void 0:x.signInWithSolana)===null||o===void 0)&&o.notBefore?[`Not Before: ${x.signInWithSolana.notBefore}`]:[],...!((s=x==null?void 0:x.signInWithSolana)===null||s===void 0)&&s.expirationTime?[`Expiration Time: ${x.signInWithSolana.expirationTime}`]:[],...!((a=x==null?void 0:x.signInWithSolana)===null||a===void 0)&&a.chainId?[`Chain ID: ${x.signInWithSolana.chainId}`]:[],...!((l=x==null?void 0:x.signInWithSolana)===null||l===void 0)&&l.nonce?[`Nonce: ${x.signInWithSolana.nonce}`]:[],...!((u=x==null?void 0:x.signInWithSolana)===null||u===void 0)&&u.requestId?[`Request ID: ${x.signInWithSolana.requestId}`]:[],...!((h=(d=x==null?void 0:x.signInWithSolana)===null||d===void 0?void 0:d.resources)===null||h===void 0)&&h.length?["Resources",...x.signInWithSolana.resources.map(C=>`- ${C}`)]:[]].join(`
`);const S=await w.signMessage(new TextEncoder().encode(v),"utf8");if(!S||!(S instanceof Uint8Array))throw new Error("@supabase/auth-js: Wallet signMessage() API returned an recognized value");g=S}}try{const{data:b,error:m}=await Oe(this.fetch,"POST",`${this.url}/token?grant_type=web3`,{headers:this.headers,body:Object.assign({chain:"solana",message:v,signature:Oi(g)},!((f=e.options)===null||f===void 0)&&f.captchaToken?{gotrue_meta_security:{captcha_token:(p=e.options)===null||p===void 0?void 0:p.captchaToken}}:null),xform:Rr});if(m)throw m;if(!b||!b.session||!b.user){const y=new io;return this._returnResult({data:{user:null,session:null},error:y})}return b.session&&(await this._saveSession(b.session),await this._notifyAllSubscribers("SIGNED_IN",b.session)),this._returnResult({data:Object.assign({},b),error:m})}catch(b){if(Ee(b))return this._returnResult({data:{user:null,session:null},error:b});throw b}}async _exchangeCodeForSession(e){const r=await bi(this.storage,`${this.storageKey}-code-verifier`),[n,i]=(r??"").split("/");try{const{data:o,error:s}=await Oe(this.fetch,"POST",`${this.url}/token?grant_type=pkce`,{headers:this.headers,body:{auth_code:e,code_verifier:n},xform:Rr});if(await $n(this.storage,`${this.storageKey}-code-verifier`),s)throw s;if(!o||!o.session||!o.user){const a=new io;return this._returnResult({data:{user:null,session:null,redirectType:null},error:a})}return o.session&&(await this._saveSession(o.session),await this._notifyAllSubscribers("SIGNED_IN",o.session)),this._returnResult({data:Object.assign(Object.assign({},o),{redirectType:i??null}),error:s})}catch(o){if(Ee(o))return this._returnResult({data:{user:null,session:null,redirectType:null},error:o});throw o}}async signInWithIdToken(e){try{const{options:r,provider:n,token:i,access_token:o,nonce:s}=e,a=await Oe(this.fetch,"POST",`${this.url}/token?grant_type=id_token`,{headers:this.headers,body:{provider:n,id_token:i,access_token:o,nonce:s,gotrue_meta_security:{captcha_token:r==null?void 0:r.captchaToken}},xform:Rr}),{data:l,error:u}=a;if(u)return this._returnResult({data:{user:null,session:null},error:u});if(!l||!l.session||!l.user){const d=new io;return this._returnResult({data:{user:null,session:null},error:d})}return l.session&&(await this._saveSession(l.session),await this._notifyAllSubscribers("SIGNED_IN",l.session)),this._returnResult({data:l,error:u})}catch(r){if(Ee(r))return this._returnResult({data:{user:null,session:null},error:r});throw r}}async signInWithOtp(e){var r,n,i,o,s;try{if("email"in e){const{email:a,options:l}=e;let u=null,d=null;this.flowType==="pkce"&&([u,d]=await oo(this.storage,this.storageKey));const{error:h}=await Oe(this.fetch,"POST",`${this.url}/otp`,{headers:this.headers,body:{email:a,data:(r=l==null?void 0:l.data)!==null&&r!==void 0?r:{},create_user:(n=l==null?void 0:l.shouldCreateUser)!==null&&n!==void 0?n:!0,gotrue_meta_security:{captcha_token:l==null?void 0:l.captchaToken},code_challenge:u,code_challenge_method:d},redirectTo:l==null?void 0:l.emailRedirectTo});return this._returnResult({data:{user:null,session:null},error:h})}if("phone"in e){const{phone:a,options:l}=e,{data:u,error:d}=await Oe(this.fetch,"POST",`${this.url}/otp`,{headers:this.headers,body:{phone:a,data:(i=l==null?void 0:l.data)!==null&&i!==void 0?i:{},create_user:(o=l==null?void 0:l.shouldCreateUser)!==null&&o!==void 0?o:!0,gotrue_meta_security:{captcha_token:l==null?void 0:l.captchaToken},channel:(s=l==null?void 0:l.channel)!==null&&s!==void 0?s:"sms"}});return this._returnResult({data:{user:null,session:null,messageId:u==null?void 0:u.message_id},error:d})}throw new Ol("You must provide either an email or phone number.")}catch(a){if(Ee(a))return this._returnResult({data:{user:null,session:null},error:a});throw a}}async verifyOtp(e){var r,n;try{let i,o;"options"in e&&(i=(r=e.options)===null||r===void 0?void 0:r.redirectTo,o=(n=e.options)===null||n===void 0?void 0:n.captchaToken);const{data:s,error:a}=await Oe(this.fetch,"POST",`${this.url}/verify`,{headers:this.headers,body:Object.assign(Object.assign({},e),{gotrue_meta_security:{captcha_token:o}}),redirectTo:i,xform:Rr});if(a)throw a;if(!s)throw new Error("An error occurred on token verification.");const l=s.session,u=s.user;return l!=null&&l.access_token&&(await this._saveSession(l),await this._notifyAllSubscribers(e.type=="recovery"?"PASSWORD_RECOVERY":"SIGNED_IN",l)),this._returnResult({data:{user:u,session:l},error:null})}catch(i){if(Ee(i))return this._returnResult({data:{user:null,session:null},error:i});throw i}}async signInWithSSO(e){var r,n,i;try{let o=null,s=null;this.flowType==="pkce"&&([o,s]=await oo(this.storage,this.storageKey));const a=await Oe(this.fetch,"POST",`${this.url}/sso`,{body:Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({},"providerId"in e?{provider_id:e.providerId}:null),"domain"in e?{domain:e.domain}:null),{redirect_to:(n=(r=e.options)===null||r===void 0?void 0:r.redirectTo)!==null&&n!==void 0?n:void 0}),!((i=e==null?void 0:e.options)===null||i===void 0)&&i.captchaToken?{gotrue_meta_security:{captcha_token:e.options.captchaToken}}:null),{skip_http_redirect:!0,code_challenge:o,code_challenge_method:s}),headers:this.headers,xform:Xk});return this._returnResult(a)}catch(o){if(Ee(o))return this._returnResult({data:null,error:o});throw o}}async reauthenticate(){return await this.initializePromise,await this._acquireLock(-1,async()=>await this._reauthenticate())}async _reauthenticate(){try{return await this._useSession(async e=>{const{data:{session:r},error:n}=e;if(n)throw n;if(!r)throw new Or;const{error:i}=await Oe(this.fetch,"GET",`${this.url}/reauthenticate`,{headers:this.headers,jwt:r.access_token});return this._returnResult({data:{user:null,session:null},error:i})})}catch(e){if(Ee(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async resend(e){try{const r=`${this.url}/resend`;if("email"in e){const{email:n,type:i,options:o}=e,{error:s}=await Oe(this.fetch,"POST",r,{headers:this.headers,body:{email:n,type:i,gotrue_meta_security:{captcha_token:o==null?void 0:o.captchaToken}},redirectTo:o==null?void 0:o.emailRedirectTo});return this._returnResult({data:{user:null,session:null},error:s})}else if("phone"in e){const{phone:n,type:i,options:o}=e,{data:s,error:a}=await Oe(this.fetch,"POST",r,{headers:this.headers,body:{phone:n,type:i,gotrue_meta_security:{captcha_token:o==null?void 0:o.captchaToken}}});return this._returnResult({data:{user:null,session:null,messageId:s==null?void 0:s.message_id},error:a})}throw new Ol("You must provide either an email or phone number and a type")}catch(r){if(Ee(r))return this._returnResult({data:{user:null,session:null},error:r});throw r}}async getSession(){return await this.initializePromise,await this._acquireLock(-1,async()=>this._useSession(async r=>r))}async _acquireLock(e,r){this._debug("#_acquireLock","begin",e);try{if(this.lockAcquired){const n=this.pendingInLock.length?this.pendingInLock[this.pendingInLock.length-1]:Promise.resolve(),i=(async()=>(await n,await r()))();return this.pendingInLock.push((async()=>{try{await i}catch{}})()),i}return await this.lock(`lock:${this.storageKey}`,e,async()=>{this._debug("#_acquireLock","lock acquired for storage key",this.storageKey);try{this.lockAcquired=!0;const n=r();for(this.pendingInLock.push((async()=>{try{await n}catch{}})()),await n;this.pendingInLock.length;){const i=[...this.pendingInLock];await Promise.all(i),this.pendingInLock.splice(0,i.length)}return await n}finally{this._debug("#_acquireLock","lock released for storage key",this.storageKey),this.lockAcquired=!1}})}finally{this._debug("#_acquireLock","end")}}async _useSession(e){this._debug("#_useSession","begin");try{const r=await this.__loadSession();return await e(r)}finally{this._debug("#_useSession","end")}}async __loadSession(){this._debug("#__loadSession()","begin"),this.lockAcquired||this._debug("#__loadSession()","used outside of an acquired lock!",new Error().stack);try{let e=null;const r=await bi(this.storage,this.storageKey);if(this._debug("#getSession()","session from storage",r),r!==null&&(this._isValidSession(r)?e=r:(this._debug("#getSession()","session from storage is not valid"),await this._removeSession())),!e)return{data:{session:null},error:null};const n=e.expires_at?e.expires_at*1e3-Date.now()<rd:!1;if(this._debug("#__loadSession()",`session has${n?"":" not"} expired`,"expires_at",e.expires_at),!n){if(this.userStorage){const s=await bi(this.userStorage,this.storageKey+"-user");s!=null&&s.user?e.user=s.user:e.user=od()}if(this.storage.isServer&&e.user&&!e.user.__isUserNotAvailableProxy){const s={value:this.suppressGetSessionWarning};e.user=Vk(e.user,s),s.value&&(this.suppressGetSessionWarning=!0)}return{data:{session:e},error:null}}const{data:i,error:o}=await this._callRefreshToken(e.refresh_token);return o?this._returnResult({data:{session:null},error:o}):this._returnResult({data:{session:i},error:null})}finally{this._debug("#__loadSession()","end")}}async getUser(e){return e?await this._getUser(e):(await this.initializePromise,await this._acquireLock(-1,async()=>await this._getUser()))}async _getUser(e){try{return e?await Oe(this.fetch,"GET",`${this.url}/user`,{headers:this.headers,jwt:e,xform:Fn}):await this._useSession(async r=>{var n,i,o;const{data:s,error:a}=r;if(a)throw a;return!(!((n=s.session)===null||n===void 0)&&n.access_token)&&!this.hasCustomAuthorizationHeader?{data:{user:null},error:new Or}:await Oe(this.fetch,"GET",`${this.url}/user`,{headers:this.headers,jwt:(o=(i=s.session)===null||i===void 0?void 0:i.access_token)!==null&&o!==void 0?o:void 0,xform:Fn})})}catch(r){if(Ee(r))return kk(r)&&(await this._removeSession(),await $n(this.storage,`${this.storageKey}-code-verifier`)),this._returnResult({data:{user:null},error:r});throw r}}async updateUser(e,r={}){return await this.initializePromise,await this._acquireLock(-1,async()=>await this._updateUser(e,r))}async _updateUser(e,r={}){try{return await this._useSession(async n=>{const{data:i,error:o}=n;if(o)throw o;if(!i.session)throw new Or;const s=i.session;let a=null,l=null;this.flowType==="pkce"&&e.email!=null&&([a,l]=await oo(this.storage,this.storageKey));const{data:u,error:d}=await Oe(this.fetch,"PUT",`${this.url}/user`,{headers:this.headers,redirectTo:r==null?void 0:r.emailRedirectTo,body:Object.assign(Object.assign({},e),{code_challenge:a,code_challenge_method:l}),jwt:s.access_token,xform:Fn});if(d)throw d;return s.user=u.user,await this._saveSession(s),await this._notifyAllSubscribers("USER_UPDATED",s),this._returnResult({data:{user:s.user},error:null})})}catch(n){if(Ee(n))return this._returnResult({data:{user:null},error:n});throw n}}async setSession(e){return await this.initializePromise,await this._acquireLock(-1,async()=>await this._setSession(e))}async _setSession(e){try{if(!e.access_token||!e.refresh_token)throw new Or;const r=Date.now()/1e3;let n=r,i=!0,o=null;const{payload:s}=id(e.access_token);if(s.exp&&(n=s.exp,i=n<=r),i){const{data:a,error:l}=await this._callRefreshToken(e.refresh_token);if(l)return this._returnResult({data:{user:null,session:null},error:l});if(!a)return{data:{user:null,session:null},error:null};o=a}else{const{data:a,error:l}=await this._getUser(e.access_token);if(l)throw l;o={access_token:e.access_token,refresh_token:e.refresh_token,user:a.user,token_type:"bearer",expires_in:n-r,expires_at:n},await this._saveSession(o),await this._notifyAllSubscribers("SIGNED_IN",o)}return this._returnResult({data:{user:o.user,session:o},error:null})}catch(r){if(Ee(r))return this._returnResult({data:{session:null,user:null},error:r});throw r}}async refreshSession(e){return await this.initializePromise,await this._acquireLock(-1,async()=>await this._refreshSession(e))}async _refreshSession(e){try{return await this._useSession(async r=>{var n;if(!e){const{data:s,error:a}=r;if(a)throw a;e=(n=s.session)!==null&&n!==void 0?n:void 0}if(!(e!=null&&e.refresh_token))throw new Or;const{data:i,error:o}=await this._callRefreshToken(e.refresh_token);return o?this._returnResult({data:{user:null,session:null},error:o}):i?this._returnResult({data:{user:i.user,session:i},error:null}):this._returnResult({data:{user:null,session:null},error:null})})}catch(r){if(Ee(r))return this._returnResult({data:{user:null,session:null},error:r});throw r}}async _getSessionFromURL(e,r){try{if(!Ht())throw new Rl("No browser detected.");if(e.error||e.error_description||e.error_code)throw new Rl(e.error_description||"Error in URL with unspecified error_description",{error:e.error||"unspecified_error",code:e.error_code||"unspecified_code"});switch(r){case"implicit":if(this.flowType==="pkce")throw new Sm("Not a valid PKCE flow url.");break;case"pkce":if(this.flowType==="implicit")throw new Rl("Not a valid implicit grant flow url.");break;default:}if(r==="pkce"){if(this._debug("#_initialize()","begin","is PKCE flow",!0),!e.code)throw new Sm("No code detected.");const{data:y,error:x}=await this._exchangeCodeForSession(e.code);if(x)throw x;const w=new URL(window.location.href);return w.searchParams.delete("code"),window.history.replaceState(window.history.state,"",w.toString()),{data:{session:y.session,redirectType:null},error:null}}const{provider_token:n,provider_refresh_token:i,access_token:o,refresh_token:s,expires_in:a,expires_at:l,token_type:u}=e;if(!o||!a||!s||!u)throw new Rl("No session defined in URL");const d=Math.round(Date.now()/1e3),h=parseInt(a);let f=d+h;l&&(f=parseInt(l));const p=f-d;p*1e3<=fo&&console.warn(`@supabase/gotrue-js: Session as retrieved from URL expires in ${p}s, should have been closer to ${h}s`);const v=f-h;d-v>=120?console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued over 120s ago, URL could be stale",v,f,d):d-v<0&&console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued in the future? Check the device clock for skew",v,f,d);const{data:g,error:b}=await this._getUser(o);if(b)throw b;const m={provider_token:n,provider_refresh_token:i,access_token:o,expires_in:h,expires_at:f,refresh_token:s,token_type:u,user:g.user};return window.location.hash="",this._debug("#_getSessionFromURL()","clearing window.location.hash"),this._returnResult({data:{session:m,redirectType:e.type},error:null})}catch(n){if(Ee(n))return this._returnResult({data:{session:null,redirectType:null},error:n});throw n}}_isImplicitGrantCallback(e){return!!(e.access_token||e.error_description)}async _isPKCECallback(e){const r=await bi(this.storage,`${this.storageKey}-code-verifier`);return!!(e.code&&r)}async signOut(e={scope:"global"}){return await this.initializePromise,await this._acquireLock(-1,async()=>await this._signOut(e))}async _signOut({scope:e}={scope:"global"}){return await this._useSession(async r=>{var n;const{data:i,error:o}=r;if(o)return this._returnResult({error:o});const s=(n=i.session)===null||n===void 0?void 0:n.access_token;if(s){const{error:a}=await this.admin.signOut(s,e);if(a&&!(Sk(a)&&(a.status===404||a.status===401||a.status===403)))return this._returnResult({error:a})}return e!=="others"&&(await this._removeSession(),await $n(this.storage,`${this.storageKey}-code-verifier`)),this._returnResult({error:null})})}onAuthStateChange(e){const r=Ak(),n={id:r,callback:e,unsubscribe:()=>{this._debug("#unsubscribe()","state change callback with id removed",r),this.stateChangeEmitters.delete(r)}};return this._debug("#onAuthStateChange()","registered callback with id",r),this.stateChangeEmitters.set(r,n),(async()=>(await this.initializePromise,await this._acquireLock(-1,async()=>{this._emitInitialSession(r)})))(),{data:{subscription:n}}}async _emitInitialSession(e){return await this._useSession(async r=>{var n,i;try{const{data:{session:o},error:s}=r;if(s)throw s;await((n=this.stateChangeEmitters.get(e))===null||n===void 0?void 0:n.callback("INITIAL_SESSION",o)),this._debug("INITIAL_SESSION","callback id",e,"session",o)}catch(o){await((i=this.stateChangeEmitters.get(e))===null||i===void 0?void 0:i.callback("INITIAL_SESSION",null)),this._debug("INITIAL_SESSION","callback id",e,"error",o),console.error(o)}})}async resetPasswordForEmail(e,r={}){let n=null,i=null;this.flowType==="pkce"&&([n,i]=await oo(this.storage,this.storageKey,!0));try{return await Oe(this.fetch,"POST",`${this.url}/recover`,{body:{email:e,code_challenge:n,code_challenge_method:i,gotrue_meta_security:{captcha_token:r.captchaToken}},headers:this.headers,redirectTo:r.redirectTo})}catch(o){if(Ee(o))return this._returnResult({data:null,error:o});throw o}}async getUserIdentities(){var e;try{const{data:r,error:n}=await this.getUser();if(n)throw n;return this._returnResult({data:{identities:(e=r.user.identities)!==null&&e!==void 0?e:[]},error:null})}catch(r){if(Ee(r))return this._returnResult({data:null,error:r});throw r}}async linkIdentity(e){return"token"in e?this.linkIdentityIdToken(e):this.linkIdentityOAuth(e)}async linkIdentityOAuth(e){var r;try{const{data:n,error:i}=await this._useSession(async o=>{var s,a,l,u,d;const{data:h,error:f}=o;if(f)throw f;const p=await this._getUrlForProvider(`${this.url}/user/identities/authorize`,e.provider,{redirectTo:(s=e.options)===null||s===void 0?void 0:s.redirectTo,scopes:(a=e.options)===null||a===void 0?void 0:a.scopes,queryParams:(l=e.options)===null||l===void 0?void 0:l.queryParams,skipBrowserRedirect:!0});return await Oe(this.fetch,"GET",p,{headers:this.headers,jwt:(d=(u=h.session)===null||u===void 0?void 0:u.access_token)!==null&&d!==void 0?d:void 0})});if(i)throw i;return Ht()&&!(!((r=e.options)===null||r===void 0)&&r.skipBrowserRedirect)&&window.location.assign(n==null?void 0:n.url),this._returnResult({data:{provider:e.provider,url:n==null?void 0:n.url},error:null})}catch(n){if(Ee(n))return this._returnResult({data:{provider:e.provider,url:null},error:n});throw n}}async linkIdentityIdToken(e){return await this._useSession(async r=>{var n;try{const{error:i,data:{session:o}}=r;if(i)throw i;const{options:s,provider:a,token:l,access_token:u,nonce:d}=e,h=await Oe(this.fetch,"POST",`${this.url}/token?grant_type=id_token`,{headers:this.headers,jwt:(n=o==null?void 0:o.access_token)!==null&&n!==void 0?n:void 0,body:{provider:a,id_token:l,access_token:u,nonce:d,link_identity:!0,gotrue_meta_security:{captcha_token:s==null?void 0:s.captchaToken}},xform:Rr}),{data:f,error:p}=h;return p?this._returnResult({data:{user:null,session:null},error:p}):!f||!f.session||!f.user?this._returnResult({data:{user:null,session:null},error:new io}):(f.session&&(await this._saveSession(f.session),await this._notifyAllSubscribers("USER_UPDATED",f.session)),this._returnResult({data:f,error:p}))}catch(i){if(Ee(i))return this._returnResult({data:{user:null,session:null},error:i});throw i}})}async unlinkIdentity(e){try{return await this._useSession(async r=>{var n,i;const{data:o,error:s}=r;if(s)throw s;return await Oe(this.fetch,"DELETE",`${this.url}/user/identities/${e.identity_id}`,{headers:this.headers,jwt:(i=(n=o.session)===null||n===void 0?void 0:n.access_token)!==null&&i!==void 0?i:void 0})})}catch(r){if(Ee(r))return this._returnResult({data:null,error:r});throw r}}async _refreshAccessToken(e){const r=`#_refreshAccessToken(${e.substring(0,5)}...)`;this._debug(r,"begin");try{const n=Date.now();return await Mk(async i=>(i>0&&await Ik(200*Math.pow(2,i-1)),this._debug(r,"refreshing attempt",i),await Oe(this.fetch,"POST",`${this.url}/token?grant_type=refresh_token`,{body:{refresh_token:e},headers:this.headers,xform:Rr})),(i,o)=>{const s=200*Math.pow(2,i);return o&&nd(o)&&Date.now()+s-n<fo})}catch(n){if(this._debug(r,"error",n),Ee(n))return this._returnResult({data:{session:null,user:null},error:n});throw n}finally{this._debug(r,"end")}}_isValidSession(e){return typeof e=="object"&&e!==null&&"access_token"in e&&"refresh_token"in e&&"expires_at"in e}async _handleProviderSignIn(e,r){const n=await this._getUrlForProvider(`${this.url}/authorize`,e,{redirectTo:r.redirectTo,scopes:r.scopes,queryParams:r.queryParams});return this._debug("#_handleProviderSignIn()","provider",e,"options",r,"url",n),Ht()&&!r.skipBrowserRedirect&&window.location.assign(n),{data:{provider:e,url:n},error:null}}async _recoverAndRefresh(){var e,r;const n="#_recoverAndRefresh()";this._debug(n,"begin");try{const i=await bi(this.storage,this.storageKey);if(i&&this.userStorage){let s=await bi(this.userStorage,this.storageKey+"-user");!this.storage.isServer&&Object.is(this.storage,this.userStorage)&&!s&&(s={user:i.user},await po(this.userStorage,this.storageKey+"-user",s)),i.user=(e=s==null?void 0:s.user)!==null&&e!==void 0?e:od()}else if(i&&!i.user&&!i.user){const s=await bi(this.storage,this.storageKey+"-user");s&&(s!=null&&s.user)?(i.user=s.user,await $n(this.storage,this.storageKey+"-user"),await po(this.storage,this.storageKey,i)):i.user=od()}if(this._debug(n,"session from storage",i),!this._isValidSession(i)){this._debug(n,"session is not valid"),i!==null&&await this._removeSession();return}const o=((r=i.expires_at)!==null&&r!==void 0?r:1/0)*1e3-Date.now()<rd;if(this._debug(n,`session has${o?"":" not"} expired with margin of ${rd}s`),o){if(this.autoRefreshToken&&i.refresh_token){const{error:s}=await this._callRefreshToken(i.refresh_token);s&&(console.error(s),nd(s)||(this._debug(n,"refresh failed with a non-retryable error, removing the session",s),await this._removeSession()))}}else if(i.user&&i.user.__isUserNotAvailableProxy===!0)try{const{data:s,error:a}=await this._getUser(i.access_token);!a&&(s!=null&&s.user)?(i.user=s.user,await this._saveSession(i),await this._notifyAllSubscribers("SIGNED_IN",i)):this._debug(n,"could not get user data, skipping SIGNED_IN notification")}catch(s){console.error("Error getting user data:",s),this._debug(n,"error getting user data, skipping SIGNED_IN notification",s)}else await this._notifyAllSubscribers("SIGNED_IN",i)}catch(i){this._debug(n,"error",i),console.error(i);return}finally{this._debug(n,"end")}}async _callRefreshToken(e){var r,n;if(!e)throw new Or;if(this.refreshingDeferred)return this.refreshingDeferred.promise;const i=`#_callRefreshToken(${e.substring(0,5)}...)`;this._debug(i,"begin");try{this.refreshingDeferred=new nu;const{data:o,error:s}=await this._refreshAccessToken(e);if(s)throw s;if(!o.session)throw new Or;await this._saveSession(o.session),await this._notifyAllSubscribers("TOKEN_REFRESHED",o.session);const a={data:o.session,error:null};return this.refreshingDeferred.resolve(a),a}catch(o){if(this._debug(i,"error",o),Ee(o)){const s={data:null,error:o};return nd(o)||await this._removeSession(),(r=this.refreshingDeferred)===null||r===void 0||r.resolve(s),s}throw(n=this.refreshingDeferred)===null||n===void 0||n.reject(o),o}finally{this.refreshingDeferred=null,this._debug(i,"end")}}async _notifyAllSubscribers(e,r,n=!0){const i=`#_notifyAllSubscribers(${e})`;this._debug(i,"begin",r,`broadcast = ${n}`);try{this.broadcastChannel&&n&&this.broadcastChannel.postMessage({event:e,session:r});const o=[],s=Array.from(this.stateChangeEmitters.values()).map(async a=>{try{await a.callback(e,r)}catch(l){o.push(l)}});if(await Promise.all(s),o.length>0){for(let a=0;a<o.length;a+=1)console.error(o[a]);throw o[0]}}finally{this._debug(i,"end")}}async _saveSession(e){this._debug("#_saveSession()",e),this.suppressGetSessionWarning=!0;const r=Object.assign({},e),n=r.user&&r.user.__isUserNotAvailableProxy===!0;if(this.userStorage){!n&&r.user&&await po(this.userStorage,this.storageKey+"-user",{user:r.user});const i=Object.assign({},r);delete i.user;const o=Tm(i);await po(this.storage,this.storageKey,o)}else{const i=Tm(r);await po(this.storage,this.storageKey,i)}}async _removeSession(){this._debug("#_removeSession()"),await $n(this.storage,this.storageKey),await $n(this.storage,this.storageKey+"-code-verifier"),await $n(this.storage,this.storageKey+"-user"),this.userStorage&&await $n(this.userStorage,this.storageKey+"-user"),await this._notifyAllSubscribers("SIGNED_OUT",null)}_removeVisibilityChangedCallback(){this._debug("#_removeVisibilityChangedCallback()");const e=this.visibilityChangedCallback;this.visibilityChangedCallback=null;try{e&&Ht()&&(window!=null&&window.removeEventListener)&&window.removeEventListener("visibilitychange",e)}catch(r){console.error("removing visibilitychange callback failed",r)}}async _startAutoRefresh(){await this._stopAutoRefresh(),this._debug("#_startAutoRefresh()");const e=setInterval(()=>this._autoRefreshTokenTick(),fo);this.autoRefreshTicker=e,e&&typeof e=="object"&&typeof e.unref=="function"?e.unref():typeof Deno<"u"&&typeof Deno.unrefTimer=="function"&&Deno.unrefTimer(e),setTimeout(async()=>{await this.initializePromise,await this._autoRefreshTokenTick()},0)}async _stopAutoRefresh(){this._debug("#_stopAutoRefresh()");const e=this.autoRefreshTicker;this.autoRefreshTicker=null,e&&clearInterval(e)}async startAutoRefresh(){this._removeVisibilityChangedCallback(),await this._startAutoRefresh()}async stopAutoRefresh(){this._removeVisibilityChangedCallback(),await this._stopAutoRefresh()}async _autoRefreshTokenTick(){this._debug("#_autoRefreshTokenTick()","begin");try{await this._acquireLock(0,async()=>{try{const e=Date.now();try{return await this._useSession(async r=>{const{data:{session:n}}=r;if(!n||!n.refresh_token||!n.expires_at){this._debug("#_autoRefreshTokenTick()","no session");return}const i=Math.floor((n.expires_at*1e3-e)/fo);this._debug("#_autoRefreshTokenTick()",`access token expires in ${i} ticks, a tick lasts ${fo}ms, refresh threshold is ${Nh} ticks`),i<=Nh&&await this._callRefreshToken(n.refresh_token)})}catch(r){console.error("Auto refresh tick failed with error. This is likely a transient error.",r)}}finally{this._debug("#_autoRefreshTokenTick()","end")}})}catch(e){if(e.isAcquireTimeout||e instanceof rw)this._debug("auto refresh token tick lock not available");else throw e}}async _handleVisibilityChange(){if(this._debug("#_handleVisibilityChange()"),!Ht()||!(window!=null&&window.addEventListener))return this.autoRefreshToken&&this.startAutoRefresh(),!1;try{this.visibilityChangedCallback=async()=>await this._onVisibilityChanged(!1),window==null||window.addEventListener("visibilitychange",this.visibilityChangedCallback),await this._onVisibilityChanged(!0)}catch(e){console.error("_handleVisibilityChange",e)}}async _onVisibilityChanged(e){const r=`#_onVisibilityChanged(${e})`;this._debug(r,"visibilityState",document.visibilityState),document.visibilityState==="visible"?(this.autoRefreshToken&&this._startAutoRefresh(),e||(await this.initializePromise,await this._acquireLock(-1,async()=>{if(document.visibilityState!=="visible"){this._debug(r,"acquired the lock to recover the session, but the browser visibilityState is no longer visible, aborting");return}await this._recoverAndRefresh()}))):document.visibilityState==="hidden"&&this.autoRefreshToken&&this._stopAutoRefresh()}async _getUrlForProvider(e,r,n){const i=[`provider=${encodeURIComponent(r)}`];if(n!=null&&n.redirectTo&&i.push(`redirect_to=${encodeURIComponent(n.redirectTo)}`),n!=null&&n.scopes&&i.push(`scopes=${encodeURIComponent(n.scopes)}`),this.flowType==="pkce"){const[o,s]=await oo(this.storage,this.storageKey),a=new URLSearchParams({code_challenge:`${encodeURIComponent(o)}`,code_challenge_method:`${encodeURIComponent(s)}`});i.push(a.toString())}if(n!=null&&n.queryParams){const o=new URLSearchParams(n.queryParams);i.push(o.toString())}return n!=null&&n.skipBrowserRedirect&&i.push(`skip_http_redirect=${n.skipBrowserRedirect}`),`${e}?${i.join("&")}`}async _unenroll(e){try{return await this._useSession(async r=>{var n;const{data:i,error:o}=r;return o?this._returnResult({data:null,error:o}):await Oe(this.fetch,"DELETE",`${this.url}/factors/${e.factorId}`,{headers:this.headers,jwt:(n=i==null?void 0:i.session)===null||n===void 0?void 0:n.access_token})})}catch(r){if(Ee(r))return this._returnResult({data:null,error:r});throw r}}async _enroll(e){try{return await this._useSession(async r=>{var n,i;const{data:o,error:s}=r;if(s)return this._returnResult({data:null,error:s});const a=Object.assign({friendly_name:e.friendlyName,factor_type:e.factorType},e.factorType==="phone"?{phone:e.phone}:e.factorType==="totp"?{issuer:e.issuer}:{}),{data:l,error:u}=await Oe(this.fetch,"POST",`${this.url}/factors`,{body:a,headers:this.headers,jwt:(n=o==null?void 0:o.session)===null||n===void 0?void 0:n.access_token});return u?this._returnResult({data:null,error:u}):(e.factorType==="totp"&&l.type==="totp"&&(!((i=l==null?void 0:l.totp)===null||i===void 0)&&i.qr_code)&&(l.totp.qr_code=`data:image/svg+xml;utf-8,${l.totp.qr_code}`),this._returnResult({data:l,error:null}))})}catch(r){if(Ee(r))return this._returnResult({data:null,error:r});throw r}}async _verify(e){return this._acquireLock(-1,async()=>{try{return await this._useSession(async r=>{var n;const{data:i,error:o}=r;if(o)return this._returnResult({data:null,error:o});const s=Object.assign({challenge_id:e.challengeId},"webauthn"in e?{webauthn:Object.assign(Object.assign({},e.webauthn),{credential_response:e.webauthn.type==="create"?hj(e.webauthn.credential_response):fj(e.webauthn.credential_response)})}:{code:e.code}),{data:a,error:l}=await Oe(this.fetch,"POST",`${this.url}/factors/${e.factorId}/verify`,{body:s,headers:this.headers,jwt:(n=i==null?void 0:i.session)===null||n===void 0?void 0:n.access_token});return l?this._returnResult({data:null,error:l}):(await this._saveSession(Object.assign({expires_at:Math.round(Date.now()/1e3)+a.expires_in},a)),await this._notifyAllSubscribers("MFA_CHALLENGE_VERIFIED",a),this._returnResult({data:a,error:l}))})}catch(r){if(Ee(r))return this._returnResult({data:null,error:r});throw r}})}async _challenge(e){return this._acquireLock(-1,async()=>{try{return await this._useSession(async r=>{var n;const{data:i,error:o}=r;if(o)return this._returnResult({data:null,error:o});const s=await Oe(this.fetch,"POST",`${this.url}/factors/${e.factorId}/challenge`,{body:e,headers:this.headers,jwt:(n=i==null?void 0:i.session)===null||n===void 0?void 0:n.access_token});if(s.error)return s;const{data:a}=s;if(a.type!=="webauthn")return{data:a,error:null};switch(a.webauthn.type){case"create":return{data:Object.assign(Object.assign({},a),{webauthn:Object.assign(Object.assign({},a.webauthn),{credential_options:Object.assign(Object.assign({},a.webauthn.credential_options),{publicKey:uj(a.webauthn.credential_options.publicKey)})})}),error:null};case"request":return{data:Object.assign(Object.assign({},a),{webauthn:Object.assign(Object.assign({},a.webauthn),{credential_options:Object.assign(Object.assign({},a.webauthn.credential_options),{publicKey:dj(a.webauthn.credential_options.publicKey)})})}),error:null}}})}catch(r){if(Ee(r))return this._returnResult({data:null,error:r});throw r}})}async _challengeAndVerify(e){const{data:r,error:n}=await this._challenge({factorId:e.factorId});return n?this._returnResult({data:null,error:n}):await this._verify({factorId:e.factorId,challengeId:r.id,code:e.code})}async _listFactors(){var e;const{data:{user:r},error:n}=await this.getUser();if(n)return{data:null,error:n};const i={all:[],phone:[],totp:[],webauthn:[]};for(const o of(e=r==null?void 0:r.factors)!==null&&e!==void 0?e:[])i.all.push(o),o.status==="verified"&&i[o.factor_type].push(o);return{data:i,error:null}}async _getAuthenticatorAssuranceLevel(){var e,r;const{data:{session:n},error:i}=await this.getSession();if(i)return this._returnResult({data:null,error:i});if(!n)return{data:{currentLevel:null,nextLevel:null,currentAuthenticationMethods:[]},error:null};const{payload:o}=id(n.access_token);let s=null;o.aal&&(s=o.aal);let a=s;((r=(e=n.user.factors)===null||e===void 0?void 0:e.filter(d=>d.status==="verified"))!==null&&r!==void 0?r:[]).length>0&&(a="aal2");const u=o.amr||[];return{data:{currentLevel:s,nextLevel:a,currentAuthenticationMethods:u},error:null}}async _getAuthorizationDetails(e){try{return await this._useSession(async r=>{const{data:{session:n},error:i}=r;return i?this._returnResult({data:null,error:i}):n?await Oe(this.fetch,"GET",`${this.url}/oauth/authorizations/${e}`,{headers:this.headers,jwt:n.access_token,xform:o=>({data:o,error:null})}):this._returnResult({data:null,error:new Or})})}catch(r){if(Ee(r))return this._returnResult({data:null,error:r});throw r}}async _approveAuthorization(e,r){try{return await this._useSession(async n=>{const{data:{session:i},error:o}=n;if(o)return this._returnResult({data:null,error:o});if(!i)return this._returnResult({data:null,error:new Or});const s=await Oe(this.fetch,"POST",`${this.url}/oauth/authorizations/${e}/consent`,{headers:this.headers,jwt:i.access_token,body:{action:"approve"},xform:a=>({data:a,error:null})});return s.data&&s.data.redirect_url&&Ht()&&!(r!=null&&r.skipBrowserRedirect)&&window.location.assign(s.data.redirect_url),s})}catch(n){if(Ee(n))return this._returnResult({data:null,error:n});throw n}}async _denyAuthorization(e,r){try{return await this._useSession(async n=>{const{data:{session:i},error:o}=n;if(o)return this._returnResult({data:null,error:o});if(!i)return this._returnResult({data:null,error:new Or});const s=await Oe(this.fetch,"POST",`${this.url}/oauth/authorizations/${e}/consent`,{headers:this.headers,jwt:i.access_token,body:{action:"deny"},xform:a=>({data:a,error:null})});return s.data&&s.data.redirect_url&&Ht()&&!(r!=null&&r.skipBrowserRedirect)&&window.location.assign(s.data.redirect_url),s})}catch(n){if(Ee(n))return this._returnResult({data:null,error:n});throw n}}async fetchJwk(e,r={keys:[]}){let n=r.keys.find(a=>a.kid===e);if(n)return n;const i=Date.now();if(n=this.jwks.keys.find(a=>a.kid===e),n&&this.jwks_cached_at+wk>i)return n;const{data:o,error:s}=await Oe(this.fetch,"GET",`${this.url}/.well-known/jwks.json`,{headers:this.headers});if(s)throw s;return!o.keys||o.keys.length===0||(this.jwks=o,this.jwks_cached_at=i,n=o.keys.find(a=>a.kid===e),!n)?null:n}async getClaims(e,r={}){try{let n=e;if(!n){const{data:p,error:v}=await this.getSession();if(v||!p.session)return this._returnResult({data:null,error:v});n=p.session.access_token}const{header:i,payload:o,signature:s,raw:{header:a,payload:l}}=id(n);r!=null&&r.allowExpired||Hk(o.exp);const u=!i.alg||i.alg.startsWith("HS")||!i.kid||!("crypto"in globalThis&&"subtle"in globalThis.crypto)?null:await this.fetchJwk(i.kid,r!=null&&r.keys?{keys:r.keys}:r==null?void 0:r.jwks);if(!u){const{error:p}=await this.getUser(n);if(p)throw p;return{data:{claims:o,header:i,signature:s},error:null}}const d=Gk(i.alg),h=await crypto.subtle.importKey("jwk",u,d,!0,["verify"]);if(!await crypto.subtle.verify(d,h,s,Ok(`${a}.${l}`)))throw new Ah("Invalid JWT signature");return{data:{claims:o,header:i,signature:s},error:null}}catch(n){if(Ee(n))return this._returnResult({data:null,error:n});throw n}}}$a.nextInstanceID=0;const _j=$a;class Sj extends _j{constructor(e){super(e)}}class kj{constructor(e,r,n){var i,o,s;this.supabaseUrl=e,this.supabaseKey=r;const a=mk(e);if(!r)throw new Error("supabaseKey is required.");this.realtimeUrl=new URL("realtime/v1",a),this.realtimeUrl.protocol=this.realtimeUrl.protocol.replace("http","ws"),this.authUrl=new URL("auth/v1",a),this.storageUrl=new URL("storage/v1",a),this.functionsUrl=new URL("functions/v1",a);const l=`sb-${a.hostname.split(".")[0]}-auth-token`,u={db:lk,realtime:uk,auth:Object.assign(Object.assign({},ck),{storageKey:l}),global:ak},d=gk(n??{},u);this.storageKey=(i=d.auth.storageKey)!==null&&i!==void 0?i:"",this.headers=(o=d.global.headers)!==null&&o!==void 0?o:{},d.accessToken?(this.accessToken=d.accessToken,this.auth=new Proxy({},{get:(h,f)=>{throw new Error(`@supabase/supabase-js: Supabase Client is configured with the accessToken option, accessing supabase.auth.${String(f)} is not possible`)}})):this.auth=this._initSupabaseAuthClient((s=d.auth)!==null&&s!==void 0?s:{},this.headers,d.global.fetch),this.fetch=fk(r,this._getAccessToken.bind(this),d.global.fetch),this.realtime=this._initRealtimeClient(Object.assign({headers:this.headers,accessToken:this._getAccessToken.bind(this)},d.realtime)),this.rest=new vS(new URL("rest/v1",a).href,{headers:this.headers,schema:d.db.schema,fetch:this.fetch}),this.storage=new ik(this.storageUrl.href,this.headers,this.fetch,n==null?void 0:n.storage),d.accessToken||this._listenForAuthEvents()}get functions(){return new pS(this.functionsUrl.href,{headers:this.headers,customFetch:this.fetch})}from(e){return this.rest.from(e)}schema(e){return this.rest.schema(e)}rpc(e,r={},n={head:!1,get:!1,count:void 0}){return this.rest.rpc(e,r,n)}channel(e,r={config:{}}){return this.realtime.channel(e,r)}getChannels(){return this.realtime.getChannels()}removeChannel(e){return this.realtime.removeChannel(e)}removeAllChannels(){return this.realtime.removeAllChannels()}async _getAccessToken(){var e,r;if(this.accessToken)return await this.accessToken();const{data:n}=await this.auth.getSession();return(r=(e=n.session)===null||e===void 0?void 0:e.access_token)!==null&&r!==void 0?r:this.supabaseKey}_initSupabaseAuthClient({autoRefreshToken:e,persistSession:r,detectSessionInUrl:n,storage:i,userStorage:o,storageKey:s,flowType:a,lock:l,debug:u,throwOnError:d},h,f){const p={Authorization:`Bearer ${this.supabaseKey}`,apikey:`${this.supabaseKey}`};return new Sj({url:this.authUrl.href,headers:Object.assign(Object.assign({},p),h),storageKey:s,autoRefreshToken:e,persistSession:r,detectSessionInUrl:n,storage:i,userStorage:o,flowType:a,lock:l,debug:u,throwOnError:d,fetch:f,hasCustomAuthorizationHeader:Object.keys(this.headers).some(v=>v.toLowerCase()==="authorization")})}_initRealtimeClient(e){return new $S(this.realtimeUrl.href,Object.assign(Object.assign({},e),{params:Object.assign({apikey:this.supabaseKey},e==null?void 0:e.params)}))}_listenForAuthEvents(){return this.auth.onAuthStateChange((r,n)=>{this._handleTokenChanged(r,"CLIENT",n==null?void 0:n.access_token)})}_handleTokenChanged(e,r,n){(e==="TOKEN_REFRESHED"||e==="SIGNED_IN")&&this.changedAccessToken!==n?(this.changedAccessToken=n,this.realtime.setAuth(n)):e==="SIGNED_OUT"&&(this.realtime.setAuth(),r=="STORAGE"&&this.auth.signOut(),this.changedAccessToken=void 0)}}const jj=(t,e,r)=>new kj(t,e,r);function Ej(){if(typeof window<"u"||typeof process>"u")return!1;const t=process.version;if(t==null)return!1;const e=t.match(/^v(\d+)\./);return e?parseInt(e[1],10)<=18:!1}Ej()&&console.warn("⚠️  Node.js 18 and below are deprecated and will no longer be supported in future versions of @supabase/supabase-js. Please upgrade to Node.js 20 or later. For more information, visit: https://github.com/orgs/supabase/discussions/37217");const Im={DRAFTIFY:"/api/studio-draftify",GEOMETRIC_GENERATE:"/api/studio-generate-geometric"},Mm={URL:"https://okakomwfikxmwllvliva.supabase.co",ANON_KEY:""},Dm={AUTH_SESSION:"studio_auth_session"},Mt=jj(Mm.URL,Mm.ANON_KEY),mn={async signIn(t,e){const{data:r,error:n}=await Mt.auth.signInWithPassword({email:t,password:e});if(n)throw n;return localStorage.setItem(Dm.AUTH_SESSION,JSON.stringify(r.session)),r},async signOut(){await Mt.auth.signOut(),localStorage.removeItem(Dm.AUTH_SESSION)},async getSession(){const{data:t}=await Mt.auth.getSession();return t.session},async updatePassword(t){const{data:e,error:r}=await Mt.auth.updateUser({password:t});if(r)throw r;return await Mt.auth.updateUser({data:{password_setup_complete:!0}}),e},onAuthStateChange(t){return Mt.auth.onAuthStateChange(t)}};class Lm extends P.Component{constructor(r){super(r);Jp(this,"handleReset",()=>{this.setState({hasError:!1,error:null,errorInfo:null})});this.state={hasError:!1,error:null,errorInfo:null}}static getDerivedStateFromError(r){return{hasError:!0}}componentDidCatch(r,n){console.error("[ErrorBoundary] Caught error:",r,n),this.setState({error:r,errorInfo:n})}render(){return this.state.hasError?c.jsxs("div",{className:"error-boundary",children:[c.jsxs("div",{className:"error-content",children:[c.jsx("h1",{children:"Something went wrong"}),c.jsx("p",{children:"We're sorry, but something unexpected happened. Please try refreshing the page."}),c.jsxs("div",{className:"error-actions",children:[c.jsx("button",{onClick:this.handleReset,className:"btn-primary",children:"Try Again"}),c.jsx("button",{onClick:()=>window.location.reload(),className:"btn-secondary",children:"Refresh Page"})]}),!1]}),c.jsx("style",{jsx:!0,children:`
            .error-boundary {
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 2rem;
              background: #f9fafb;
            }

            .error-content {
              max-width: 500px;
              text-align: center;
              background: white;
              padding: 3rem;
              border-radius: 12px;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            }

            h1 {
              color: #1e4a7a;
              margin: 0 0 1rem 0;
              font-size: 1.75rem;
            }

            p {
              color: #6b7280;
              margin: 0 0 2rem 0;
              line-height: 1.6;
            }

            .error-actions {
              display: flex;
              gap: 1rem;
              justify-content: center;
            }

            .btn-primary,
            .btn-secondary {
              padding: 0.75rem 1.5rem;
              border-radius: 6px;
              font-weight: 500;
              cursor: pointer;
              transition: all 0.2s;
              border: none;
            }

            .btn-primary {
              background: #ff6b35;
              color: white;
            }

            .btn-primary:hover {
              background: #e55a2b;
              transform: translateY(-1px);
            }

            .btn-secondary {
              background: white;
              color: #374151;
              border: 1px solid #d1d5db;
            }

            .btn-secondary:hover {
              background: #f9fafb;
            }

            .error-details {
              margin-top: 2rem;
              text-align: left;
              font-size: 0.875rem;
            }

            .error-details summary {
              cursor: pointer;
              color: #6b7280;
              margin-bottom: 0.5rem;
            }

            .error-details pre {
              background: #f3f4f6;
              padding: 1rem;
              border-radius: 4px;
              overflow-x: auto;
              font-size: 0.75rem;
              color: #dc2626;
            }
          `})]}):this.props.children}}class Cj{async _getAuthHeaders(){const e=await mn.getSession(),r={"Content-Type":"application/json"};return e!=null&&e.access_token&&(r.Authorization=`Bearer ${e.access_token}`),r}async generateRecraft(e){const r={prompt:e.prompt,width_mm:e.widthMM||5e3,length_mm:e.lengthMM||5e3,max_colours:e.maxColours||6,seed:e.seed||null},n=await this._getAuthHeaders(),i=await fetch("/api/recraft-generate",{method:"POST",headers:n,body:JSON.stringify(r)});if(!i.ok){const o=await i.json();throw new Error(o.error||"Recraft generation failed")}return i.json()}async vectorizeImage(e){const r={image_url:e.image_url,width_mm:e.width_mm||5e3,length_mm:e.length_mm||5e3,seed:e.seed||null},n=await this._getAuthHeaders(),i=await fetch("/api/recraft-vectorize",{method:"POST",headers:n,body:JSON.stringify(r)});if(!i.ok){const o=await i.json();throw new Error(o.error||"Vectorization failed")}return i.json()}async processUploadedSVG(e){const r={svg_url:e.svg_url,width_mm:e.width_mm||5e3,length_mm:e.length_mm||5e3},n=await this._getAuthHeaders(),i=await fetch("/api/process-uploaded-svg",{method:"POST",headers:n,body:JSON.stringify(r)});if(!i.ok){const o=await i.json();throw new Error(o.error||"SVG processing failed")}return i.json()}async getRecraftStatus(e){const r=await fetch(`/api/studio-job-status?jobId=${e}`);if(!r.ok){const n=await r.json();throw new Error(n.error||"Status fetch failed")}return r.json()}async waitForRecraftCompletion(e,r=null,n=2e3){return new Promise((i,o)=>{const s=async()=>{var a,l,u,d;try{const h=await this.getRecraftStatus(e);r&&r(h),h.status==="completed"?((a=h.result)==null?void 0:a.svg_url)?(console.log("[API] Recraft job complete with SVG output"),i(h)):(console.error("[API] Recraft job completed but no SVG output"),o(new Error("Job completed but no output received"))):h.status==="failed"?(l=h.result)!=null&&l.svg_url?(console.warn("[API] Job failed compliance but has output (non-compliant)"),i(h)):o(new Error(h.error||"Job failed")):(h.status==="retrying"&&console.log(`[API] Retrying: ${(u=h.recraft)==null?void 0:u.attempt_current}/${(d=h.recraft)==null?void 0:d.attempt_max}`),setTimeout(s,n))}catch(h){o(h)}};s()})}async matchColor(e,r=2){const n=await fetch("/api/match-color",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({hex:e,max_components:r})});if(!n.ok){const i=await n.json();throw new Error(i.error||"Color matching failed")}return n.json()}async generateDesignName(e){const r={prompt:e.prompt,colors:e.colors||[],dimensions:e.dimensions||{}},n=await this._getAuthHeaders(),i=await fetch("/api/generate-design-name",{method:"POST",headers:n,body:JSON.stringify(r)});if(!i.ok){const o=await i.json();throw new Error(o.error||"Name generation failed")}return i.json()}async inspireSimpleCreateJob(e){const r={prompt:e.prompt,surface:{width_mm:e.lengthMM||5e3,height_mm:e.widthMM||5e3},max_colours:e.maxColours||6,try_simpler:e.trySimpler||!1};e.seed&&(r.seed=e.seed);const n=await fetch("/api/studio-inspire-simple",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)});if(!n.ok){const i=await n.json();throw new Error(i.message||"Job creation failed")}return n.json()}async inspireSimpleGetStatus(e){const r=await fetch(`/api/studio-job-status?jobId=${e}`);if(!r.ok){const n=await r.json();throw new Error(n.message||"Status fetch failed")}return r.json()}async inspireSimpleWaitForCompletion(e,r=null,n=2e3){return new Promise((i,o)=>{const s=async()=>{var a;try{const l=await this.inspireSimpleGetStatus(e);r&&r(l),l.status==="completed"?((a=l.result)==null?void 0:a.final_url)?(console.log("[API] Job complete with JPG output, resolving"),i(l)):(console.log("[API] Job completed but no output received"),o(new Error("Job completed but no output received"))):l.status==="failed"?o(new Error(l.error||"Job failed")):setTimeout(s,n)}catch(l){o(l)}};s()})}async draftify(e){const r=await fetch(Im.DRAFTIFY,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!r.ok){const n=await r.json();throw new Error(n.message||"Vectorization failed")}return r.json()}async generateGeometric(e){const r={brief:e.prompt||e.brief,canvas:{width_mm:e.lengthMM||5e3,height_mm:e.widthMM||5e3},options:{mood:e.mood||"playful",composition:e.composition||"mixed",colorCount:e.maxColours||e.colorCount||5,seed:e.seed},validate:!0},n=await fetch(Im.GEOMETRIC_GENERATE,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)});if(!n.ok){const i=await n.json();throw new Error(i.message||"Geometric generation failed")}return n.json()}}const xi=new Cj;async function iu(){var r,n;const t=await Mt.auth.getSession(),e=(n=(r=t==null?void 0:t.data)==null?void 0:r.session)==null?void 0:n.access_token;if(!e)throw new Error("Not authenticated");return{"Content-Type":"application/json",Authorization:`Bearer ${e}`}}async function Tj(t){const e=await iu(),r=await fetch("/api/designs/save",{method:"POST",headers:e,body:JSON.stringify(t)});if(!r.ok){const n=await r.json();throw new Error(n.error||"Failed to save design")}return r.json()}async function Ph({project_id:t,limit:e=50,offset:r=0,search:n}={}){const i=await iu(),o=new URLSearchParams;t&&o.append("project_id",t),o.append("limit",e),o.append("offset",r),n&&o.append("search",n);const s=await fetch(`/api/designs/list?${o}`,{method:"GET",headers:i});if(!s.ok){const a=await s.json();throw new Error(a.error||"Failed to list designs")}return s.json()}async function Nj(t){const e=await iu(),r=await fetch(`/api/designs/by-id?id=${t}`,{method:"GET",headers:e});if(!r.ok){const n=await r.json();throw new Error(n.error||"Failed to load design")}return r.json()}async function Oj(t){const e=await iu(),r=await fetch(`/api/designs/by-id?id=${t}`,{method:"DELETE",headers:e});if(!r.ok){const n=await r.json();throw new Error(n.error||"Failed to delete design")}return r.json()}function Rj({recipes:t,onClose:e}){return!t||t.length===0?c.jsxs("div",{className:"blend-recipes-empty",children:[c.jsx("p",{children:"No colours extracted from design."}),c.jsx("button",{onClick:e,className:"close-button",children:"Close"})]}):c.jsxs("div",{className:"blend-recipes-display",children:[c.jsxs("div",{className:"recipes-header",children:[c.jsx("h3",{children:"TPV Blend Recipes"}),c.jsx("button",{onClick:e,className:"close-button-icon",children:"×"})]}),c.jsx("div",{className:"recipes-grid",children:t.map((r,n)=>{const i=r.chosenRecipe;return c.jsxs("div",{className:"recipe-card",children:[c.jsxs("div",{className:"card-top",children:[c.jsx("div",{className:"swatch-section",children:c.jsx("div",{className:"color-swatch",style:{backgroundColor:r.blendColor.hex},title:`TPV blend: ${r.blendColor.hex}`})}),c.jsxs("div",{className:"card-meta",children:[c.jsxs("div",{className:"meta-row",children:[c.jsx("span",{className:"meta-label",children:"Hex:"}),c.jsx("span",{className:"hex-value",children:r.blendColor.hex})]}),c.jsxs("div",{className:"meta-row",children:[c.jsx("span",{className:"meta-label",children:"Coverage:"}),c.jsxs("span",{className:"coverage-value",children:[r.targetColor.areaPct.toFixed(1),"%"]})]})]})]}),c.jsxs("div",{className:"card-formula",children:[c.jsx("div",{className:"formula-label",children:i.components.length===1?"Pure TPV Colour":"TPV Blend Formula"}),c.jsx("div",{className:"formula-content",children:i.components.length===1?c.jsxs("span",{className:"formula-component solid",children:[c.jsx("strong",{className:"parts",children:"100%"}),c.jsx("span",{className:"comp-code",children:i.components[0].code}),c.jsxs("span",{className:"comp-name",children:["(",i.components[0].name,")"]})]}):i.components.map((o,s)=>c.jsxs("span",{className:"formula-component",children:[c.jsx("strong",{className:"parts",children:o.parts||(o.weight*100).toFixed(0)+"%"}),c.jsx("span",{className:"comp-code",children:o.code}),c.jsxs("span",{className:"comp-name",children:["(",o.name,")"]}),s<i.components.length-1&&c.jsx("span",{className:"separator",children:"+"})]},s))})]})]},n)})}),c.jsx("style",{jsx:!0,children:`
        .blend-recipes-display {
          background: #fff;
          border-radius: 8px;
          border: 1px solid #ddd;
          padding: 2rem;
          margin-top: 1.5rem;
        }

        .blend-recipes-empty {
          text-align: center;
          padding: 2rem;
          background: #f9f9f9;
          border-radius: 8px;
        }

        .recipes-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #1a365d;
        }

        .recipes-header h3 {
          font-family: 'Space Grotesk', sans-serif;
          margin: 0;
          color: #1e4a7a;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .close-button-icon {
          background: none;
          border: none;
          font-size: 2rem;
          color: #666;
          cursor: pointer;
          padding: 0;
          width: 32px;
          height: 32px;
          line-height: 1;
        }

        .close-button-icon:hover {
          color: #333;
        }

        /* Card Grid Layout */
        .recipes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .recipe-card {
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s;
        }

        .recipe-card:hover {
          border-color: #ff6b35;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(255, 107, 53, 0.15);
        }

        /* Card Top Section */
        .card-top {
          display: flex;
          gap: 1.5rem;
          padding: 1.5rem;
          background: #f9f9f9;
          border-bottom: 2px solid #e8e8e8;
          align-items: center;
        }

        .swatch-section {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .color-swatch {
          width: 80px;
          height: 80px;
          border-radius: 12px;
          border: 3px solid #ff6b35;
          flex-shrink: 0;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .card-meta {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          justify-content: center;
        }

        .meta-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .meta-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #666;
          min-width: 80px;
        }

        .hex-value {
          font-family: 'Courier New', monospace;
          font-size: 1.1rem;
          color: #333;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .coverage-value {
          font-size: 1.1rem;
          color: #1a365d;
          font-weight: 700;
        }

        /* Card Formula Section */
        .card-formula {
          padding: 1.5rem;
          background: white;
        }

        .formula-label {
          font-size: 0.85rem;
          font-weight: 700;
          color: #1a365d;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 1rem;
        }

        .formula-content {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          align-items: center;
          line-height: 1.8;
        }

        .formula-component {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
        }

        .parts {
          color: #333;
          font-size: 1rem;
        }

        .comp-code {
          color: #1a365d;
          font-weight: 700;
          font-size: 1.05rem;
        }

        .comp-name {
          color: #666;
          font-size: 0.9rem;
        }

        .separator {
          color: #ff6b35;
          font-weight: bold;
          font-size: 1rem;
          margin: 0 0.35rem;
        }

        .formula-component.solid {
          background: #fff5f0;
          padding: 0.5rem 0.75rem;
          border-radius: 4px;
          border: 1px solid #ff6b35;
        }

        .close-button {
          padding: 0.75rem 1.5rem;
          background: #e0e0e0;
          color: #333;
          border: none;
          border-radius: 4px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 1rem;
        }

        .close-button:hover {
          background: #d0d0d0;
        }

        @media (max-width: 768px) {
          .blend-recipes-display {
            padding: 1rem;
          }

          .recipes-grid {
            grid-template-columns: 1fr;
          }

          .card-top {
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
          }

          .color-swatch {
            width: 60px;
            height: 60px;
          }

          .card-meta {
            width: 100%;
          }

          .meta-label {
            min-width: 70px;
          }

          .card-formula {
            padding: 1rem;
          }

          .formula-label {
            font-size: 0.75rem;
          }
        }
      `})]})}function Aj({recipes:t,onClose:e}){if(!t||t.length===0)return c.jsxs("div",{className:"solid-summary-empty",children:[c.jsx("p",{children:"No colours in design."}),c.jsx("button",{onClick:e,className:"close-button",children:"Close"})]});const r=t.reduce((n,i)=>n+i.targetColor.areaPct,0);return c.jsxs("div",{className:"solid-color-summary",children:[c.jsxs("div",{className:"summary-header",children:[c.jsx("h3",{children:"TPV Colours Used"}),c.jsx("button",{onClick:e,className:"close-button-icon",children:"×"})]}),c.jsx("div",{className:"summary-info",children:c.jsxs("p",{className:"summary-description",children:["This design uses ",c.jsx("strong",{children:t.length})," pure TPV colour",t.length!==1?"s":""," (no blending required)"]})}),c.jsx("div",{className:"colors-list",children:t.map((n,i)=>{const o=n.chosenRecipe.components[0],s=n.targetColor.areaPct;return c.jsxs("div",{className:"color-item",children:[c.jsx("div",{className:"color-swatch",style:{backgroundColor:n.blendColor.hex},title:`${o.code} - ${o.name}`}),c.jsxs("div",{className:"color-details",children:[c.jsxs("div",{className:"color-primary",children:[c.jsx("span",{className:"color-code",children:o.code}),c.jsx("span",{className:"color-name",children:o.name})]}),c.jsxs("div",{className:"color-secondary",children:[c.jsx("span",{className:"hex-value",children:n.blendColor.hex}),c.jsxs("span",{className:"coverage-badge",children:[s.toFixed(1),"%"]})]})]})]},i)})}),c.jsxs("div",{className:"summary-footer",children:[c.jsxs("div",{className:"footer-stat",children:[c.jsx("span",{className:"stat-label",children:"Total Coverage:"}),c.jsxs("span",{className:"stat-value",children:[r.toFixed(1),"%"]})]}),c.jsxs("div",{className:"footer-stat",children:[c.jsx("span",{className:"stat-label",children:"TPV Colours:"}),c.jsx("span",{className:"stat-value",children:t.length})]})]}),c.jsx("style",{jsx:!0,children:`
        .solid-color-summary {
          background: #fff;
          border-radius: 8px;
          border: 1px solid #ddd;
          padding: 2rem;
          max-width: 800px;
          margin: 2rem auto;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .solid-summary-empty {
          background: #fff;
          border-radius: 8px;
          padding: 2rem;
          text-align: center;
        }

        .summary-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #1a365d;
        }

        .summary-header h3 {
          margin: 0;
          color: #1a365d;
          font-size: 1.8rem;
        }

        .close-button-icon {
          background: none;
          border: none;
          font-size: 2rem;
          color: #666;
          cursor: pointer;
          padding: 0;
          width: 32px;
          height: 32px;
          line-height: 1;
          transition: color 0.2s;
        }

        .close-button-icon:hover {
          color: #333;
        }

        .summary-info {
          background: #f9f9f9;
          padding: 1rem;
          border-radius: 6px;
          margin-bottom: 1.5rem;
        }

        .summary-description {
          margin: 0;
          color: #333;
          font-size: 1rem;
          line-height: 1.5;
        }

        /* Colors List */
        .colors-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .color-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: #f9f9f9;
          border-radius: 6px;
          border: 1px solid #e0e0e0;
          transition: all 0.2s;
        }

        .color-item:hover {
          border-color: #ff6b35;
          box-shadow: 0 2px 8px rgba(255, 107, 53, 0.15);
        }

        .color-swatch {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          border: 2px solid #ddd;
          flex-shrink: 0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .color-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .color-primary {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
        }

        .color-code {
          font-family: 'Courier New', monospace;
          font-weight: 700;
          font-size: 1.2rem;
          color: #1a365d;
        }

        .color-name {
          font-size: 1.1rem;
          color: #333;
          font-weight: 500;
        }

        .color-secondary {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .hex-value {
          font-family: 'Courier New', monospace;
          font-size: 0.9rem;
          color: #666;
        }

        .coverage-badge {
          background: #ff6b35;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.9rem;
        }

        /* Summary Footer */
        .summary-footer {
          display: flex;
          justify-content: space-around;
          padding: 1.5rem;
          background: #f9f9f9;
          border-radius: 6px;
          border: 2px solid #ff6b35;
        }

        .footer-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #666;
          font-weight: 500;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a365d;
        }

        .close-button {
          padding: 0.75rem 1.5rem;
          background: #ff6b35;
          color: white;
          border: none;
          border-radius: 4px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .close-button:hover {
          background: #e55a25;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .solid-color-summary {
            padding: 1rem;
          }

          .summary-header h3 {
            font-size: 1.4rem;
          }

          .color-item {
            flex-direction: column;
            align-items: flex-start;
          }

          .color-swatch {
            width: 100%;
            height: 50px;
          }

          .summary-footer {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `})]})}const $i=[{code:"RH01",name:"Standard Red",hex:"#B71E2D",R:183,G:30,B:45,L:39.4,a:58.5,b:29},{code:"RH02",name:"Bright Red",hex:"#E31D25",R:227,G:29,B:37,L:47.4,a:70.1,b:44},{code:"RH10",name:"Standard Green",hex:"#006B3F",R:0,G:107,B:63,L:40.5,a:-42.2,b:17.9},{code:"RH11",name:"Bright Green",hex:"#4BAA34",R:75,G:170,B:52,L:62.1,a:-47.7,b:47.2},{code:"RH12",name:"Dark Green",hex:"#006747",R:0,G:103,B:71,L:39.6,a:-38.3,b:13.1},{code:"RH20",name:"Standard Blue",hex:"#1B4F9C",R:27,G:79,B:156,L:36.4,a:14.2,b:-46.7},{code:"RH21",name:"Purple",hex:"#662D91",R:102,G:45,B:145,L:31.5,a:41.9,b:-40.9},{code:"RH22",name:"Light Blue",hex:"#0091D7",R:0,G:145,B:215,L:55.3,a:-19.1,b:-37.3},{code:"RH23",name:"Azure",hex:"#0076B6",R:0,G:118,B:182,L:47.7,a:-4.8,b:-34.8},{code:"RH26",name:"Turquoise",hex:"#00A499",R:0,G:164,B:153,L:58.8,a:-38.4,b:-3},{code:"RH30",name:"Standard Beige",hex:"#D4B585",R:212,G:181,B:133,L:75.2,a:3.8,b:24.8},{code:"RH31",name:"Cream",hex:"#F2E6C8",R:242,G:230,B:200,L:91.8,a:-.5,b:12.5},{code:"RH32",name:"Brown",hex:"#754C29",R:117,G:76,B:41,L:40,a:15.9,b:27.1},{code:"RH90",name:"Funky Pink",hex:"#e8457e",R:232,G:69,B:126,L:55,a:66.1,b:4.9},{code:"RH40",name:"Mustard Yellow",hex:"#C6972D",R:198,G:151,B:45,L:66,a:8.4,b:56.3},{code:"RH41",name:"Bright Yellow",hex:"#FFD100",R:255,G:209,B:0,L:86.9,a:-1,b:90.6},{code:"RH50",name:"Orange",hex:"#F47920",R:244,G:121,B:32,L:63.2,a:49.8,b:60.2},{code:"RH60",name:"Dark Grey",hex:"#4D4F53",R:77,G:79,B:83,L:34.1,a:-.4,b:-2.4},{code:"RH61",name:"Light Grey",hex:"#A7A8AA",R:167,G:168,B:170,L:69,a:-.5,b:-1},{code:"RH65",name:"Pale Grey",hex:"#DCDDDE",R:220,G:221,B:222,L:87.6,a:-.2,b:-.7},{code:"RH70",name:"Black",hex:"#101820",R:16,G:24,B:32,L:9.1,a:-.3,b:-6.3}];function Zf({content:t,position:e="top"}){const[r,n]=$.useState(!1);return c.jsxs("div",{className:"help-icon-container",children:[c.jsx("button",{className:"help-icon",onMouseEnter:()=>n(!0),onMouseLeave:()=>n(!1),onClick:i=>{i.preventDefault(),i.stopPropagation(),n(!r)},type:"button","aria-label":"Help",children:"?"}),r&&c.jsx("div",{className:`help-tooltip help-tooltip-${e}`,children:t}),c.jsx("style",{children:`
        .help-icon-container {
          position: relative;
          display: inline-block;
        }

        .help-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #6b7280;
          color: white;
          border: none;
          font-size: 12px;
          font-weight: 600;
          cursor: help;
          transition: all 0.2s;
          padding: 0;
          line-height: 1;
        }

        .help-icon:hover {
          background: #374151;
          transform: scale(1.1);
        }

        .help-tooltip {
          position: absolute;
          z-index: 1000;
          background: #1f2937;
          color: white;
          padding: 0.75rem 1rem;
          border-radius: 6px;
          font-size: 0.875rem;
          line-height: 1.5;
          max-width: 300px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          pointer-events: none;
          white-space: normal;
        }

        .help-tooltip-top {
          bottom: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
        }

        .help-tooltip-top::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 6px solid transparent;
          border-top-color: #1f2937;
        }

        .help-tooltip-bottom {
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
        }

        .help-tooltip-bottom::after {
          content: '';
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 6px solid transparent;
          border-bottom-color: #1f2937;
        }

        .help-tooltip-right {
          left: calc(100% + 8px);
          top: 50%;
          transform: translateY(-50%);
        }

        .help-tooltip-right::after {
          content: '';
          position: absolute;
          right: 100%;
          top: 50%;
          transform: translateY(-50%);
          border: 6px solid transparent;
          border-right-color: #1f2937;
        }

        .help-tooltip-left {
          right: calc(100% + 8px);
          top: 50%;
          transform: translateY(-50%);
        }

        .help-tooltip-left::after {
          content: '';
          position: absolute;
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
          border: 6px solid transparent;
          border-left-color: #1f2937;
        }

        @media (max-width: 768px) {
          .help-tooltip {
            max-width: 250px;
            font-size: 0.8125rem;
            padding: 0.625rem 0.875rem;
          }
        }
      `})]})}function Pj({recipes:t,mode:e="blend",onColorClick:r,selectedColor:n,editedColors:i,onResetAll:o}){if(!t||t.length===0)return null;const s=h=>!i||i.size===0?!1:i.has(h.originalColor.hex.toLowerCase()),a=i&&i.size>0,l=h=>{const f=h.toLowerCase();return $i.find(p=>p.hex.toLowerCase()===f)},u=h=>{if(e==="solid"){const f=l(h.blendColor.hex);if(f)return`${f.code} - ${f.name}`}return h.blendColor.hex},d=h=>{if(!n)return!1;const f=n.blendHex||n.hex;return h.blendColor.hex===f||h.targetColor.hex===f};return c.jsxs("div",{className:"color-legend",children:[c.jsxs("div",{className:"legend-header",children:[c.jsxs("div",{className:"legend-header-left",children:[c.jsx("span",{className:"legend-title",children:"Colours"}),c.jsx(Zf,{content:"Click any colour to edit all instances of that colour across the design. Changes apply to every region using that colour.",position:"right"}),r&&c.jsx("span",{className:"edit-hint",children:"(click to edit)"})]}),a&&o&&c.jsx("button",{onClick:o,className:"reset-all-btn",title:"Reset all colours to original",children:"Reset All"})]}),c.jsx("div",{className:"legend-colors",children:t.map((h,f)=>c.jsxs("div",{className:`color-item ${r?"clickable":""} ${d(h)?"selected":""}`,onClick:()=>{r&&r({hex:h.targetColor.hex,originalHex:h.originalColor.hex,blendHex:h.blendColor.hex,areaPct:h.targetColor.areaPct,recipe:h.chosenRecipe,targetColor:h.targetColor},"palette")},title:r?"Click to edit this colour":"",children:[c.jsxs("div",{className:"color-swatch-wrapper",children:[c.jsx("div",{className:"color-swatch",style:{backgroundColor:h.blendColor.hex}}),s(h)&&c.jsx("span",{className:"edit-indicator",title:"Colour has been modified",children:c.jsx("svg",{viewBox:"0 0 24 24",fill:"currentColor",width:"12",height:"12",children:c.jsx("path",{d:"M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"})})})]}),c.jsxs("div",{className:"color-info",children:[c.jsx("span",{className:e==="solid"?"tpv-label":"hex-value",children:u(h)}),c.jsxs("span",{className:"coverage",children:[h.targetColor.areaPct.toFixed(1),"%"]})]})]},f))}),c.jsx("style",{jsx:!0,children:`
        .color-legend {
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 1rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          width: 100%;
        }

        .legend-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #e0e0e0;
        }

        .legend-header-left {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .legend-title {
          font-weight: 600;
          color: #1a365d;
          font-size: 0.95rem;
        }

        .edit-hint {
          font-size: 0.75rem;
          color: #ff6b35;
          font-weight: normal;
        }

        .reset-all-btn {
          padding: 0.25rem 0.5rem;
          font-size: 0.7rem;
          font-weight: 600;
          color: #ff6b35;
          background: #fff5f0;
          border: 1px solid #ff6b35;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .reset-all-btn:hover {
          background: #ff6b35;
          color: white;
        }

        .legend-colors {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 0.75rem;
        }

        .color-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem;
          border-radius: 4px;
          background: white;
          border: 1px solid #e8e8e8;
          transition: all 0.2s;
        }

        .color-item.clickable {
          cursor: pointer;
        }

        .color-item.clickable:hover {
          border-color: #ff6b35;
          background: #fff9f7;
          box-shadow: 0 2px 4px rgba(255, 107, 53, 0.15);
          transform: translateY(-2px);
        }

        .color-item.selected {
          border-color: #ff6b35;
          border-width: 2px;
          background: #fff9f7;
          box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.2);
          transform: translateY(-2px);
        }

        .color-swatch-wrapper {
          position: relative;
          flex-shrink: 0;
        }

        .color-swatch {
          width: 40px;
          height: 40px;
          border-radius: 4px;
          border: 2px solid #ddd;
        }

        .edit-indicator {
          position: absolute;
          top: -4px;
          right: -4px;
          width: 16px;
          height: 16px;
          background: #ff6b35;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }

        .edit-indicator svg {
          width: 10px;
          height: 10px;
        }

        .color-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.85rem;
        }

        .hex-value {
          font-family: 'Courier New', monospace;
          font-weight: 600;
          color: #333;
        }

        .tpv-label {
          font-weight: 600;
          color: #1a365d;
          font-size: 0.9rem;
        }

        .coverage {
          color: #666;
          font-size: 0.8rem;
        }

        /* Mobile - compact horizontal grid of swatches */
        @media (max-width: 768px) {
          .color-legend {
            padding: 0.75rem;
          }

          .legend-header {
            margin-bottom: 0.5rem;
            padding-bottom: 0.5rem;
          }

          .legend-title {
            font-size: 0.85rem;
          }

          .edit-hint {
            font-size: 0.7rem;
          }

          .reset-all-btn {
            font-size: 0.65rem;
            padding: 0.2rem 0.4rem;
            min-height: 28px;
          }

          /* Horizontal scrolling grid of swatches */
          .legend-colors {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            justify-content: flex-start;
          }

          .color-item {
            flex-direction: column;
            padding: 0.25rem;
            border-radius: 6px;
            width: auto;
            min-width: 44px;
          }

          /* Hide text info on mobile - just show swatches */
          .color-info {
            display: none;
          }

          .color-swatch {
            width: 44px;
            height: 44px;
            border-radius: 6px;
          }

          .color-item.selected {
            transform: none;
            box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.4);
          }

          .color-item.clickable:hover {
            transform: none;
          }

          .edit-indicator {
            top: -2px;
            right: -2px;
            width: 14px;
            height: 14px;
          }

          .edit-indicator svg {
            width: 8px;
            height: 8px;
          }
        }

        @media (max-width: 480px) {
          .color-legend {
            padding: 0.5rem;
          }

          .legend-colors {
            gap: 0.35rem;
          }

          .color-swatch {
            width: 40px;
            height: 40px;
          }

          .color-item {
            min-width: 40px;
          }
        }
      `})]})}/*! @license DOMPurify 3.3.0 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.3.0/LICENSE */var ad,zm;function Fm(){if(zm)return ad;zm=1;const{entries:t,setPrototypeOf:e,isFrozen:r,getPrototypeOf:n,getOwnPropertyDescriptor:i}=Object;let{freeze:o,seal:s,create:a}=Object,{apply:l,construct:u}=typeof Reflect<"u"&&Reflect;o||(o=function(q){return q}),s||(s=function(q){return q}),l||(l=function(q,ne){for(var Y=arguments.length,M=new Array(Y>2?Y-2:0),Z=2;Z<Y;Z++)M[Z-2]=arguments[Z];return q.apply(ne,M)}),u||(u=function(q){for(var ne=arguments.length,Y=new Array(ne>1?ne-1:0),M=1;M<ne;M++)Y[M-1]=arguments[M];return new q(...Y)});const d=N(Array.prototype.forEach),h=N(Array.prototype.lastIndexOf),f=N(Array.prototype.pop),p=N(Array.prototype.push),v=N(Array.prototype.splice),g=N(String.prototype.toLowerCase),b=N(String.prototype.toString),m=N(String.prototype.match),y=N(String.prototype.replace),x=N(String.prototype.indexOf),w=N(String.prototype.trim),j=N(Object.prototype.hasOwnProperty),S=N(RegExp.prototype.test),C=E(TypeError);function N(D){return function(q){q instanceof RegExp&&(q.lastIndex=0);for(var ne=arguments.length,Y=new Array(ne>1?ne-1:0),M=1;M<ne;M++)Y[M-1]=arguments[M];return l(D,q,Y)}}function E(D){return function(){for(var q=arguments.length,ne=new Array(q),Y=0;Y<q;Y++)ne[Y]=arguments[Y];return u(D,ne)}}function A(D,q){let ne=arguments.length>2&&arguments[2]!==void 0?arguments[2]:g;e&&e(D,null);let Y=q.length;for(;Y--;){let M=q[Y];if(typeof M=="string"){const Z=ne(M);Z!==M&&(r(q)||(q[Y]=Z),M=Z)}D[M]=!0}return D}function U(D){for(let q=0;q<D.length;q++)j(D,q)||(D[q]=null);return D}function O(D){const q=a(null);for(const[ne,Y]of t(D))j(D,ne)&&(Array.isArray(Y)?q[ne]=U(Y):Y&&typeof Y=="object"&&Y.constructor===Object?q[ne]=O(Y):q[ne]=Y);return q}function F(D,q){for(;D!==null;){const Y=i(D,q);if(Y){if(Y.get)return N(Y.get);if(typeof Y.value=="function")return N(Y.value)}D=n(D)}function ne(){return null}return ne}const k=o(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),W=o(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","enterkeyhint","exportparts","filter","font","g","glyph","glyphref","hkern","image","inputmode","line","lineargradient","marker","mask","metadata","mpath","part","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),ie=o(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),J=o(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),K=o(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),L=o(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),oe=o(["#text"]),H=o(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","exportparts","face","for","headers","height","hidden","high","href","hreflang","id","inert","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","part","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","slot","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns","slot"]),G=o(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mask-type","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),pe=o(["accent","accentunder","align","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),Q=o(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),ae=s(/\{\{[\w\W]*|[\w\W]*\}\}/gm),Re=s(/<%[\w\W]*|[\w\W]*%>/gm),Ke=s(/\$\{[\w\W]*/gm),ye=s(/^data-[\-\w.\u00B7-\uFFFF]+$/),Ne=s(/^aria-[\-\w]+$/),He=s(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),Ye=s(/^(?:\w+script|data):/i),bt=s(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),et=s(/^html$/i),_=s(/^[a-z][.\w]*(-[.\w]+)+$/i);var ee=Object.freeze({__proto__:null,ARIA_ATTR:Ne,ATTR_WHITESPACE:bt,CUSTOM_ELEMENT:_,DATA_ATTR:ye,DOCTYPE_NAME:et,ERB_EXPR:Re,IS_ALLOWED_URI:He,IS_SCRIPT_OR_DATA:Ye,MUSTACHE_EXPR:ae,TMPLIT_EXPR:Ke});const B={element:1,text:3,progressingInstruction:7,comment:8,document:9},R=function(){return typeof window>"u"?null:window},T=function(q,ne){if(typeof q!="object"||typeof q.createPolicy!="function")return null;let Y=null;const M="data-tt-policy-suffix";ne&&ne.hasAttribute(M)&&(Y=ne.getAttribute(M));const Z="dompurify"+(Y?"#"+Y:"");try{return q.createPolicy(Z,{createHTML(re){return re},createScriptURL(re){return re}})}catch{return console.warn("TrustedTypes policy "+Z+" could not be created."),null}},I=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}};function X(){let D=arguments.length>0&&arguments[0]!==void 0?arguments[0]:R();const q=Ce=>X(Ce);if(q.version="3.3.0",q.removed=[],!D||!D.document||D.document.nodeType!==B.document||!D.Element)return q.isSupported=!1,q;let{document:ne}=D;const Y=ne,M=Y.currentScript,{DocumentFragment:Z,HTMLTemplateElement:re,Node:ue,Element:me,NodeFilter:be,NamedNodeMap:$e=D.NamedNodeMap||D.MozNamedAttrMap,HTMLFormElement:ge,DOMParser:Ae,trustedTypes:Le}=D,Me=me.prototype,ct=F(Me,"cloneNode"),tt=F(Me,"remove"),Ie=F(Me,"nextSibling"),ze=F(Me,"childNodes"),ut=F(Me,"parentNode");if(typeof re=="function"){const Ce=ne.createElement("template");Ce.content&&Ce.content.ownerDocument&&(ne=Ce.content.ownerDocument)}let Ge,xt="";const{implementation:Jt,createNodeIterator:Gr,createDocumentFragment:el,getElementsByTagName:tl}=ne,{importNode:wu}=Y;let Pt=I();q.isSupported=typeof t=="function"&&typeof ut=="function"&&Jt&&Jt.createHTMLDocument!==void 0;const{MUSTACHE_EXPR:_s,ERB_EXPR:Cn,TMPLIT_EXPR:Ss,DATA_ATTR:_u,ARIA_ATTR:Su,IS_SCRIPT_OR_DATA:Cr,ATTR_WHITESPACE:rl,CUSTOM_ELEMENT:Wr}=ee;let{IS_ALLOWED_URI:ai}=ee,Xe=null;const nl=A({},[...k,...W,...ie,...K,...oe]);let _t=null;const li=A({},[...H,...G,...pe,...Q]);let dt=Object.seal(a(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),Tn=null,Zi=null;const rn=Object.seal(a(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}}));let ks=!0,js=!0,il=!1,ci=!0,Nn=!1,ui=!0,nn=!1,Es=!1,Ji=!1,on=!1,Qi=!1,di=!1,ol=!0,Cs=!1;const Ts="user-content-";let eo=!0,hi=!1,sn={},On=null;const Ns=A({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]);let Os=null;const Rs=A({},["audio","video","img","source","image","track"]);let As=null;const Ps=A({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),fi="http://www.w3.org/1998/Math/MathML",pi="http://www.w3.org/2000/svg",Tr="http://www.w3.org/1999/xhtml";let Rn=Tr,an=!1,An=null;const ku=A({},[fi,pi,Tr],b);let to=A({},["mi","mo","mn","ms","mtext"]),gi=A({},["annotation-xml"]);const V=A({},["title","style","font","a","script"]);let se=null;const de=["application/xhtml+xml","text/html"],fe="text/html";let Se=null,Te=null;const je=ne.createElement("form"),ke=function(z){return z instanceof RegExp||z instanceof Function},Fe=function(){let z=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(!(Te&&Te===z)){if((!z||typeof z!="object")&&(z={}),z=O(z),se=de.indexOf(z.PARSER_MEDIA_TYPE)===-1?fe:z.PARSER_MEDIA_TYPE,Se=se==="application/xhtml+xml"?b:g,Xe=j(z,"ALLOWED_TAGS")?A({},z.ALLOWED_TAGS,Se):nl,_t=j(z,"ALLOWED_ATTR")?A({},z.ALLOWED_ATTR,Se):li,An=j(z,"ALLOWED_NAMESPACES")?A({},z.ALLOWED_NAMESPACES,b):ku,As=j(z,"ADD_URI_SAFE_ATTR")?A(O(Ps),z.ADD_URI_SAFE_ATTR,Se):Ps,Os=j(z,"ADD_DATA_URI_TAGS")?A(O(Rs),z.ADD_DATA_URI_TAGS,Se):Rs,On=j(z,"FORBID_CONTENTS")?A({},z.FORBID_CONTENTS,Se):Ns,Tn=j(z,"FORBID_TAGS")?A({},z.FORBID_TAGS,Se):O({}),Zi=j(z,"FORBID_ATTR")?A({},z.FORBID_ATTR,Se):O({}),sn=j(z,"USE_PROFILES")?z.USE_PROFILES:!1,ks=z.ALLOW_ARIA_ATTR!==!1,js=z.ALLOW_DATA_ATTR!==!1,il=z.ALLOW_UNKNOWN_PROTOCOLS||!1,ci=z.ALLOW_SELF_CLOSE_IN_ATTR!==!1,Nn=z.SAFE_FOR_TEMPLATES||!1,ui=z.SAFE_FOR_XML!==!1,nn=z.WHOLE_DOCUMENT||!1,on=z.RETURN_DOM||!1,Qi=z.RETURN_DOM_FRAGMENT||!1,di=z.RETURN_TRUSTED_TYPE||!1,Ji=z.FORCE_BODY||!1,ol=z.SANITIZE_DOM!==!1,Cs=z.SANITIZE_NAMED_PROPS||!1,eo=z.KEEP_CONTENT!==!1,hi=z.IN_PLACE||!1,ai=z.ALLOWED_URI_REGEXP||He,Rn=z.NAMESPACE||Tr,to=z.MATHML_TEXT_INTEGRATION_POINTS||to,gi=z.HTML_INTEGRATION_POINTS||gi,dt=z.CUSTOM_ELEMENT_HANDLING||{},z.CUSTOM_ELEMENT_HANDLING&&ke(z.CUSTOM_ELEMENT_HANDLING.tagNameCheck)&&(dt.tagNameCheck=z.CUSTOM_ELEMENT_HANDLING.tagNameCheck),z.CUSTOM_ELEMENT_HANDLING&&ke(z.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)&&(dt.attributeNameCheck=z.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),z.CUSTOM_ELEMENT_HANDLING&&typeof z.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements=="boolean"&&(dt.allowCustomizedBuiltInElements=z.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),Nn&&(js=!1),Qi&&(on=!0),sn&&(Xe=A({},oe),_t=[],sn.html===!0&&(A(Xe,k),A(_t,H)),sn.svg===!0&&(A(Xe,W),A(_t,G),A(_t,Q)),sn.svgFilters===!0&&(A(Xe,ie),A(_t,G),A(_t,Q)),sn.mathMl===!0&&(A(Xe,K),A(_t,pe),A(_t,Q))),z.ADD_TAGS&&(typeof z.ADD_TAGS=="function"?rn.tagCheck=z.ADD_TAGS:(Xe===nl&&(Xe=O(Xe)),A(Xe,z.ADD_TAGS,Se))),z.ADD_ATTR&&(typeof z.ADD_ATTR=="function"?rn.attributeCheck=z.ADD_ATTR:(_t===li&&(_t=O(_t)),A(_t,z.ADD_ATTR,Se))),z.ADD_URI_SAFE_ATTR&&A(As,z.ADD_URI_SAFE_ATTR,Se),z.FORBID_CONTENTS&&(On===Ns&&(On=O(On)),A(On,z.FORBID_CONTENTS,Se)),eo&&(Xe["#text"]=!0),nn&&A(Xe,["html","head","body"]),Xe.table&&(A(Xe,["tbody"]),delete Tn.tbody),z.TRUSTED_TYPES_POLICY){if(typeof z.TRUSTED_TYPES_POLICY.createHTML!="function")throw C('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof z.TRUSTED_TYPES_POLICY.createScriptURL!="function")throw C('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');Ge=z.TRUSTED_TYPES_POLICY,xt=Ge.createHTML("")}else Ge===void 0&&(Ge=T(Le,M)),Ge!==null&&typeof xt=="string"&&(xt=Ge.createHTML(""));o&&o(z),Te=z}},De=A({},[...W,...ie,...J]),Qe=A({},[...K,...L]),Ot=function(z){let ce=ut(z);(!ce||!ce.tagName)&&(ce={namespaceURI:Rn,tagName:"template"});const xe=g(z.tagName),ht=g(ce.tagName);return An[z.namespaceURI]?z.namespaceURI===pi?ce.namespaceURI===Tr?xe==="svg":ce.namespaceURI===fi?xe==="svg"&&(ht==="annotation-xml"||to[ht]):!!De[xe]:z.namespaceURI===fi?ce.namespaceURI===Tr?xe==="math":ce.namespaceURI===pi?xe==="math"&&gi[ht]:!!Qe[xe]:z.namespaceURI===Tr?ce.namespaceURI===pi&&!gi[ht]||ce.namespaceURI===fi&&!to[ht]?!1:!Qe[xe]&&(V[xe]||!De[xe]):!!(se==="application/xhtml+xml"&&An[z.namespaceURI]):!1},We=function(z){p(q.removed,{element:z});try{ut(z).removeChild(z)}catch{tt(z)}},qe=function(z,ce){try{p(q.removed,{attribute:ce.getAttributeNode(z),from:ce})}catch{p(q.removed,{attribute:null,from:ce})}if(ce.removeAttribute(z),z==="is")if(on||Qi)try{We(ce)}catch{}else try{ce.setAttribute(z,"")}catch{}},Ze=function(z){let ce=null,xe=null;if(Ji)z="<remove></remove>"+z;else{const kt=m(z,/^[\r\n\t ]+/);xe=kt&&kt[0]}se==="application/xhtml+xml"&&Rn===Tr&&(z='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+z+"</body></html>");const ht=Ge?Ge.createHTML(z):z;if(Rn===Tr)try{ce=new Ae().parseFromString(ht,se)}catch{}if(!ce||!ce.documentElement){ce=Jt.createDocument(Rn,"template",null);try{ce.documentElement.innerHTML=an?xt:ht}catch{}}const zt=ce.body||ce.documentElement;return z&&xe&&zt.insertBefore(ne.createTextNode(xe),zt.childNodes[0]||null),Rn===Tr?tl.call(ce,nn?"html":"body")[0]:nn?ce.documentElement:zt},mi=function(z){return Gr.call(z.ownerDocument||z,z,be.SHOW_ELEMENT|be.SHOW_COMMENT|be.SHOW_TEXT|be.SHOW_PROCESSING_INSTRUCTION|be.SHOW_CDATA_SECTION,null)},vi=function(z){return z instanceof ge&&(typeof z.nodeName!="string"||typeof z.textContent!="string"||typeof z.removeChild!="function"||!(z.attributes instanceof $e)||typeof z.removeAttribute!="function"||typeof z.setAttribute!="function"||typeof z.namespaceURI!="string"||typeof z.insertBefore!="function"||typeof z.hasChildNodes!="function")},Wp=function(z){return typeof ue=="function"&&z instanceof ue};function ln(Ce,z,ce){d(Ce,xe=>{xe.call(q,z,ce,Te)})}const Vp=function(z){let ce=null;if(ln(Pt.beforeSanitizeElements,z,null),vi(z))return We(z),!0;const xe=Se(z.nodeName);if(ln(Pt.uponSanitizeElement,z,{tagName:xe,allowedTags:Xe}),ui&&z.hasChildNodes()&&!Wp(z.firstElementChild)&&S(/<[/\w!]/g,z.innerHTML)&&S(/<[/\w!]/g,z.textContent)||z.nodeType===B.progressingInstruction||ui&&z.nodeType===B.comment&&S(/<[/\w]/g,z.data))return We(z),!0;if(!(rn.tagCheck instanceof Function&&rn.tagCheck(xe))&&(!Xe[xe]||Tn[xe])){if(!Tn[xe]&&Kp(xe)&&(dt.tagNameCheck instanceof RegExp&&S(dt.tagNameCheck,xe)||dt.tagNameCheck instanceof Function&&dt.tagNameCheck(xe)))return!1;if(eo&&!On[xe]){const ht=ut(z)||z.parentNode,zt=ze(z)||z.childNodes;if(zt&&ht){const kt=zt.length;for(let Qt=kt-1;Qt>=0;--Qt){const cn=ct(zt[Qt],!0);cn.__removalCount=(z.__removalCount||0)+1,ht.insertBefore(cn,Ie(z))}}}return We(z),!0}return z instanceof me&&!Ot(z)||(xe==="noscript"||xe==="noembed"||xe==="noframes")&&S(/<\/no(script|embed|frames)/i,z.innerHTML)?(We(z),!0):(Nn&&z.nodeType===B.text&&(ce=z.textContent,d([_s,Cn,Ss],ht=>{ce=y(ce,ht," ")}),z.textContent!==ce&&(p(q.removed,{element:z.cloneNode()}),z.textContent=ce)),ln(Pt.afterSanitizeElements,z,null),!1)},qp=function(z,ce,xe){if(ol&&(ce==="id"||ce==="name")&&(xe in ne||xe in je))return!1;if(!(js&&!Zi[ce]&&S(_u,ce))){if(!(ks&&S(Su,ce))){if(!(rn.attributeCheck instanceof Function&&rn.attributeCheck(ce,z))){if(!_t[ce]||Zi[ce]){if(!(Kp(z)&&(dt.tagNameCheck instanceof RegExp&&S(dt.tagNameCheck,z)||dt.tagNameCheck instanceof Function&&dt.tagNameCheck(z))&&(dt.attributeNameCheck instanceof RegExp&&S(dt.attributeNameCheck,ce)||dt.attributeNameCheck instanceof Function&&dt.attributeNameCheck(ce,z))||ce==="is"&&dt.allowCustomizedBuiltInElements&&(dt.tagNameCheck instanceof RegExp&&S(dt.tagNameCheck,xe)||dt.tagNameCheck instanceof Function&&dt.tagNameCheck(xe))))return!1}else if(!As[ce]){if(!S(ai,y(xe,rl,""))){if(!((ce==="src"||ce==="xlink:href"||ce==="href")&&z!=="script"&&x(xe,"data:")===0&&Os[z])){if(!(il&&!S(Cr,y(xe,rl,"")))){if(xe)return!1}}}}}}}return!0},Kp=function(z){return z!=="annotation-xml"&&m(z,Wr)},Yp=function(z){ln(Pt.beforeSanitizeAttributes,z,null);const{attributes:ce}=z;if(!ce||vi(z))return;const xe={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:_t,forceKeepAttr:void 0};let ht=ce.length;for(;ht--;){const zt=ce[ht],{name:kt,namespaceURI:Qt,value:cn}=zt,ro=Se(kt),ju=cn;let $t=kt==="value"?ju:w(ju);if(xe.attrName=ro,xe.attrValue=$t,xe.keepAttr=!0,xe.forceKeepAttr=void 0,ln(Pt.uponSanitizeAttribute,z,xe),$t=xe.attrValue,Cs&&(ro==="id"||ro==="name")&&(qe(kt,z),$t=Ts+$t),ui&&S(/((--!?|])>)|<\/(style|title|textarea)/i,$t)){qe(kt,z);continue}if(ro==="attributename"&&m($t,"href")){qe(kt,z);continue}if(xe.forceKeepAttr)continue;if(!xe.keepAttr){qe(kt,z);continue}if(!ci&&S(/\/>/i,$t)){qe(kt,z);continue}Nn&&d([_s,Cn,Ss],Zp=>{$t=y($t,Zp," ")});const Xp=Se(z.nodeName);if(!qp(Xp,ro,$t)){qe(kt,z);continue}if(Ge&&typeof Le=="object"&&typeof Le.getAttributeType=="function"&&!Qt)switch(Le.getAttributeType(Xp,ro)){case"TrustedHTML":{$t=Ge.createHTML($t);break}case"TrustedScriptURL":{$t=Ge.createScriptURL($t);break}}if($t!==ju)try{Qt?z.setAttributeNS(Qt,kt,$t):z.setAttribute(kt,$t),vi(z)?We(z):f(q.removed)}catch{qe(kt,z)}}ln(Pt.afterSanitizeAttributes,z,null)},R1=function Ce(z){let ce=null;const xe=mi(z);for(ln(Pt.beforeSanitizeShadowDOM,z,null);ce=xe.nextNode();)ln(Pt.uponSanitizeShadowNode,ce,null),Vp(ce),Yp(ce),ce.content instanceof Z&&Ce(ce.content);ln(Pt.afterSanitizeShadowDOM,z,null)};return q.sanitize=function(Ce){let z=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},ce=null,xe=null,ht=null,zt=null;if(an=!Ce,an&&(Ce="<!-->"),typeof Ce!="string"&&!Wp(Ce))if(typeof Ce.toString=="function"){if(Ce=Ce.toString(),typeof Ce!="string")throw C("dirty is not a string, aborting")}else throw C("toString is not a function");if(!q.isSupported)return Ce;if(Es||Fe(z),q.removed=[],typeof Ce=="string"&&(hi=!1),hi){if(Ce.nodeName){const cn=Se(Ce.nodeName);if(!Xe[cn]||Tn[cn])throw C("root node is forbidden and cannot be sanitized in-place")}}else if(Ce instanceof ue)ce=Ze("<!---->"),xe=ce.ownerDocument.importNode(Ce,!0),xe.nodeType===B.element&&xe.nodeName==="BODY"||xe.nodeName==="HTML"?ce=xe:ce.appendChild(xe);else{if(!on&&!Nn&&!nn&&Ce.indexOf("<")===-1)return Ge&&di?Ge.createHTML(Ce):Ce;if(ce=Ze(Ce),!ce)return on?null:di?xt:""}ce&&Ji&&We(ce.firstChild);const kt=mi(hi?Ce:ce);for(;ht=kt.nextNode();)Vp(ht),Yp(ht),ht.content instanceof Z&&R1(ht.content);if(hi)return Ce;if(on){if(Qi)for(zt=el.call(ce.ownerDocument);ce.firstChild;)zt.appendChild(ce.firstChild);else zt=ce;return(_t.shadowroot||_t.shadowrootmode)&&(zt=wu.call(Y,zt,!0)),zt}let Qt=nn?ce.outerHTML:ce.innerHTML;return nn&&Xe["!doctype"]&&ce.ownerDocument&&ce.ownerDocument.doctype&&ce.ownerDocument.doctype.name&&S(et,ce.ownerDocument.doctype.name)&&(Qt="<!DOCTYPE "+ce.ownerDocument.doctype.name+`>
`+Qt),Nn&&d([_s,Cn,Ss],cn=>{Qt=y(Qt,cn," ")}),Ge&&di?Ge.createHTML(Qt):Qt},q.setConfig=function(){let Ce=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};Fe(Ce),Es=!0},q.clearConfig=function(){Te=null,Es=!1},q.isValidAttribute=function(Ce,z,ce){Te||Fe({});const xe=Se(Ce),ht=Se(z);return qp(xe,ht,ce)},q.addHook=function(Ce,z){typeof z=="function"&&p(Pt[Ce],z)},q.removeHook=function(Ce,z){if(z!==void 0){const ce=h(Pt[Ce],z);return ce===-1?void 0:v(Pt[Ce],ce,1)[0]}return f(Pt[Ce])},q.removeHooks=function(Ce){Pt[Ce]=[]},q.removeAllHooks=function(){Pt=I()},q}var te=X();return ad=te,ad}var $j=self.DOMPurify||(self.DOMPurify=Fm().default||Fm());const Ij=zc($j);function ow(t,e={}){if(!t||typeof t!="string")return console.warn("[SVG-SANITIZE] Invalid input:",typeof t),"";const r={USE_PROFILES:{svg:!0,svgFilters:!0},FORBID_TAGS:["script","foreignObject","iframe","embed"],FORBID_ATTR:["onload","onerror","onclick","onmouseover","onmouseout","onmouseenter","onmouseleave","onmousemove","onmousedown","onmouseup","onfocus","onblur","onkeydown","onkeyup","onkeypress","onsubmit","onreset","onselect","onchange","oninput","onanimationstart","onanimationend","onanimationiteration","ontransitionend","ontransitionrun","ontransitionstart","ontransitioncancel","xlink:href",...e.additionalForbiddenAttrs||[]],ALLOW_DATA_ATTR:!0,ALLOW_COMMENTS:!1,RETURN_DOM:!1,RETURN_DOM_FRAGMENT:!1,ALLOWED_URI_REGEXP:/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,HOOKS:{afterSanitizeAttributes:n=>{if(n.hasAttribute("href")){const i=n.getAttribute("href");i&&i.toLowerCase().trim().startsWith("javascript:")&&(n.removeAttribute("href"),console.warn("[SVG-SANITIZE] Removed javascript: href"))}if(n.hasAttribute("xlink:href")){const i=n.getAttribute("xlink:href");i&&(i.toLowerCase().trim().startsWith("javascript:")||i.toLowerCase().trim().startsWith("data:text/html"))&&(n.removeAttribute("xlink:href"),console.warn("[SVG-SANITIZE] Removed dangerous xlink:href"))}}},...e};try{const n=Ij.sanitize(t,r);if(!n||!n.includes("<svg"))return console.error("[SVG-SANITIZE] Sanitization removed SVG content - input may be malicious"),"";const i=t.length,o=n.length,s=(i-o)/i*100;return s>10&&console.warn(`[SVG-SANITIZE] Removed ${s.toFixed(1)}% of content (${i-o} chars) - possible malicious SVG detected`),n}catch(n){return console.error("[SVG-SANITIZE] Sanitization failed:",n),""}}function Bm({blendSvgUrl:t,recipes:e,mode:r="blend",onColorClick:n,onRegionClick:i,onEyedropperCancel:o,selectedColor:s,editedColors:a,onResetAll:l,designName:u="",onNameChange:d,isNameLoading:h=!1,onInSituClick:f,eyedropperActive:p=!1,eyedropperRegion:v=null,onRegionUndo:g,onRegionRedo:b,canUndo:m=!1,canRedo:y=!1,regionOverridesCount:x=0}){const[w,j]=$.useState(null),[S,C]=$.useState(null),N=$.useRef(null),E=$.useRef(null);$.useRef(null);const[A,U]=$.useState(1),[O,F]=$.useState({x:0,y:0}),[k,W]=$.useState(!1),[ie,J]=$.useState({x:0,y:0}),K=$.useRef(null),L=$.useRef(!1),[oe,H]=$.useState(()=>localStorage.getItem("tpv_color_editing_tip_dismissed")!=="true"),G=()=>{H(!1),localStorage.setItem("tpv_color_editing_tip_dismissed","true")};$.useEffect(()=>{if(!t){C(null);return}(async()=>{try{const T=await(await fetch(t)).text();C(T);const I=T.includes("data-region-id"),X=(T.match(/data-region-id/g)||[]).length;console.log("[SVGPreview] Fetched inline SVG content - length:",T.length,"hasRegionTags:",I,"regionCount:",X)}catch(R){console.error("[SVGPreview] Failed to fetch SVG content:",R),C(null)}})()},[t]);const pe=$.useMemo(()=>{if(!S)return null;console.log("[SVGPreview] Sanitizing SVG content...");const B=ow(S);return B?(console.log("[SVGPreview] SVG sanitization complete - length:",B.length),console.log("[SVGPreview] Sanitized content preview:",B.substring(0,200)),B.includes("<svg")?B.replace(/<svg([^>]*)>/i,(T,I)=>(I.includes("width=")||(I+=' width="100%"'),I.includes("height=")||(I+=' height="100%"'),`<svg${I}>`)):(console.error("[SVGPreview] Sanitized SVG does not contain <svg> tag!"),null)):(console.error("[SVGPreview] SVG sanitization failed - content rejected"),null)},[S]);$.useEffect(()=>{if(!s||!t){j(null);return}(async()=>{try{console.log("[SVGPreview] Creating highlight for color:",s);const R=new Image;R.crossOrigin="anonymous";const T=new Promise((ue,me)=>{R.onload=()=>{console.log("[SVGPreview] Image loaded:",R.width,"x",R.height),ue()},R.onerror=be=>{console.error("[SVGPreview] Image load error:",be),me(be)}});R.src=t,await T;const I=document.createElement("canvas");I.width=R.naturalWidth||R.width||1e3,I.height=R.naturalHeight||R.height||1e3;const X=I.getContext("2d");X.drawImage(R,0,0);const D=X.getImageData(0,0,I.width,I.height).data,q=s.hex,ne=Q(q);console.log("[SVGPreview] Target color:",q,ne);const Y=new Set;let M=0;for(let ue=0;ue<I.height;ue++)for(let me=0;me<I.width;me++){const be=(ue*I.width+me)*4,$e=D[be],ge=D[be+1],Ae=D[be+2];D[be+3]>0&&ae($e,ge,Ae,ne)&&(Y.add(`${me},${ue}`),M++)}if(console.log("[SVGPreview] Matched pixels:",M),M===0){console.warn("[SVGPreview] No pixels matched the target color"),j(null);return}const Z=X.createImageData(I.width,I.height);for(let ue=0;ue<I.height;ue++)for(let me=0;me<I.width;me++){const be=(ue*I.width+me)*4;Y.has(`${me},${ue}`)&&(!Y.has(`${me-1},${ue}`)||!Y.has(`${me+1},${ue}`)||!Y.has(`${me},${ue-1}`)||!Y.has(`${me},${ue+1}`))&&(Z.data[be]=255,Z.data[be+1]=0,Z.data[be+2]=255,Z.data[be+3]=255)}X.clearRect(0,0,I.width,I.height),X.putImageData(Z,0,0);const re=I.toDataURL();console.log("[SVGPreview] Highlight mask created"),j(re)}catch(R){console.error("[SVGPreview] Failed to create highlight mask:",R),j(null)}})()},[s,t]);const Q=B=>{const R=B.replace("#","");return{r:parseInt(R.substring(0,2),16),g:parseInt(R.substring(2,4),16),b:parseInt(R.substring(4,6),16)}},ae=(B,R,T,I)=>Math.abs(B-I.r)<=50&&Math.abs(R-I.g)<=50&&Math.abs(T-I.b)<=50,Re=async(B,R)=>{try{if(!N.current||!t)return null;const T=new Image;T.crossOrigin="anonymous";const I=new Promise((ue,me)=>{T.onload=ue,T.onerror=me});T.src=t,await I;const X=document.createElement("canvas");X.width=T.naturalWidth||T.width||1e3,X.height=T.naturalHeight||T.height||1e3;const te=X.getContext("2d");te.drawImage(T,0,0);const D=N.current.getBoundingClientRect(),q=X.width/D.width,ne=X.height/D.height,Y=Math.floor(B*q),M=Math.floor(R*ne),re=te.getImageData(Y,M,1,1).data;return{r:re[0],g:re[1],b:re[2],a:re[3]}}catch(T){return console.error("[SVGPreview] Failed to get color at position:",T),null}},Ke=()=>{U(B=>Math.min(B*1.5,5))},ye=()=>{U(B=>Math.max(B/1.5,.5))},Ne=()=>{U(1),F({x:0,y:0})},He=B=>{B.preventDefault();const R=B.deltaY*-.001;U(T=>Math.min(Math.max(T+R,.5),5))},Ye=B=>{B.button===0&&(W(!0),J({x:B.clientX-O.x,y:B.clientY-O.y}),L.current=!1)},bt=B=>{if(!k)return;const R=Math.abs(B.clientX-(ie.x+O.x)),T=Math.abs(B.clientY-(ie.y+O.y));(R>5||T>5)&&(L.current=!0),F({x:B.clientX-ie.x,y:B.clientY-ie.y})},et=()=>{W(!1)};$.useEffect(()=>{if(k)return document.addEventListener("mousemove",bt),document.addEventListener("mouseup",et),()=>{document.removeEventListener("mousemove",bt),document.removeEventListener("mouseup",et)}},[k,ie,O]);const _=B=>{let R=B;for(;R&&R!==E.current;){if(R.hasAttribute&&R.hasAttribute("data-region-id"))return R;R=R.parentElement}return null},ee=async B=>{var q,ne;if(L.current){console.log("[SVGPreview] Click ignored - was dragging");return}if(console.log("[SVGPreview] Click detected - onRegionClick:",!!i,"inlineSvgContent:",!!S,"target:",B.target.tagName),i&&S){console.log("[SVGPreview] Attempting region detection on target:",B.target);const Y=_(B.target);if(console.log("[SVGPreview] Found region element:",Y),Y){const M=Y.getAttribute("data-region-id"),Z=Y.getAttribute("fill")||((ne=(q=Y.getAttribute("style"))==null?void 0:q.match(/fill:\s*([^;]+)/))==null?void 0:ne[1]);console.log("[SVGPreview] Region clicked:",M,"fill:",Z),i({regionId:M,sourceColor:Z,element:Y});return}else console.log("[SVGPreview] No region element found from target")}else console.log("[SVGPreview] Region detection skipped - onRegionClick:",!!i,"inlineSvgContent:",!!S);if(!n||!e||e.length===0)return;const R=B.currentTarget.getBoundingClientRect(),T=B.clientX-R.left,I=B.clientY-R.top;console.log("[SVGPreview] Clicked at:",T,I);const X=await Re(T,I);if(!X||X.a===0){console.log("[SVGPreview] Clicked on transparent area");return}console.log("[SVGPreview] Clicked color:",X);let te=null,D=1/0;for(const Y of e){const M=Y.targetColor.hex,Z=Q(M);if(ae(X.r,X.g,X.b,Z)){const re=Math.sqrt(Math.pow(X.r-Z.r,2)+Math.pow(X.g-Z.g,2)+Math.pow(X.b-Z.b,2));re<D&&(D=re,te=Y)}}te?(console.log("[SVGPreview] Matched recipe:",te.targetColor.hex),n({hex:te.targetColor.hex,originalHex:te.originalColor.hex,blendHex:te.blendColor.hex,areaPct:te.targetColor.areaPct,recipe:te.chosenRecipe,targetColor:te.targetColor})):console.log("[SVGPreview] No matching recipe found for clicked color")};return t?c.jsxs("div",{className:"svg-preview",children:[c.jsxs("div",{className:"preview-header",children:[c.jsxs("div",{className:"design-name-container",children:[d?c.jsx("input",{type:"text",className:"design-name-input",value:u,onChange:B=>d(B.target.value),placeholder:h?"Generating name...":"Enter project name"}):c.jsx("h3",{children:u||"TPV Blend Design"}),h&&c.jsx("span",{className:"name-loading",children:"Generating..."})]}),s&&c.jsxs("span",{className:"editing-hint",children:["Editing: ",s.hex||s.blendHex]})]}),oe&&n&&c.jsxs("div",{className:"color-editing-tip",children:[c.jsx("div",{className:"tip-icon",children:"💡"}),c.jsxs("div",{className:"tip-content",children:[c.jsx("strong",{children:"Tip:"})," Click colours in the legend below to edit all instances, or click directly on the design to edit individual regions."]}),c.jsx("button",{onClick:G,className:"tip-close",title:"Dismiss tip",children:"×"})]}),c.jsxs("div",{className:"svg-display-container",children:[c.jsxs("div",{className:"svg-panel",children:[c.jsxs("div",{className:"zoom-controls",children:[c.jsx("button",{onClick:Ke,className:"zoom-btn",title:"Zoom In",children:c.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[c.jsx("circle",{cx:"11",cy:"11",r:"8"}),c.jsx("line",{x1:"11",y1:"8",x2:"11",y2:"14"}),c.jsx("line",{x1:"8",y1:"11",x2:"14",y2:"11"}),c.jsx("path",{d:"m21 21-4.35-4.35"})]})}),c.jsx("button",{onClick:ye,className:"zoom-btn",title:"Zoom Out",children:c.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[c.jsx("circle",{cx:"11",cy:"11",r:"8"}),c.jsx("line",{x1:"8",y1:"11",x2:"14",y2:"11"}),c.jsx("path",{d:"m21 21-4.35-4.35"})]})}),c.jsx("button",{onClick:Ne,className:"zoom-btn",title:"Reset View",children:c.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[c.jsx("path",{d:"M1 4v6h6"}),c.jsx("path",{d:"M23 20v-6h-6"}),c.jsx("path",{d:"M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"})]})}),c.jsxs("span",{className:"zoom-level",children:[Math.round(A*100),"%"]})]}),x>0&&c.jsxs("div",{className:"undo-redo-controls",children:[c.jsx("button",{onClick:g,className:"undo-redo-btn",title:"Undo (Ctrl+Z)",disabled:!m,children:c.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[c.jsx("path",{d:"M3 7v6h6"}),c.jsx("path",{d:"M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"})]})}),c.jsx("button",{onClick:b,className:"undo-redo-btn",title:"Redo (Ctrl+Y)",disabled:!y,children:c.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[c.jsx("path",{d:"M21 7v6h-6"}),c.jsx("path",{d:"M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"})]})})]}),f&&c.jsxs("button",{onClick:f,className:"in-situ-btn",title:"Upload a photo of your installation site and see how this design will look in place with realistic perspective",children:[c.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[c.jsx("rect",{x:"3",y:"3",width:"18",height:"18",rx:"2",ry:"2"}),c.jsx("circle",{cx:"8.5",cy:"8.5",r:"1.5"}),c.jsx("path",{d:"m21 15-5-5L5 21"})]}),c.jsx("span",{children:"Preview In-Situ"})]}),c.jsx("div",{ref:K,className:"svg-wrapper",onWheel:He,children:c.jsxs("div",{className:"svg-image-container",onClick:ee,onMouseDown:Ye,style:{transform:`translate(${O.x}px, ${O.y}px) scale(${A})`,cursor:k?"grabbing":A>1?"grab":p?"crosshair":n?"pointer":"default"},children:[pe?c.jsx("div",{ref:E,className:"svg-inline-container",style:{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center"},dangerouslySetInnerHTML:{__html:pe}}):c.jsx("img",{ref:N,src:t,alt:"TPV blend design",className:"svg-image"}),w&&c.jsx("img",{src:w,alt:"Colour highlight",className:"svg-highlight-mask"})]})}),p&&v&&c.jsx("div",{className:"eyedropper-overlay",children:c.jsxs("div",{className:"eyedropper-content",children:[c.jsxs("div",{className:"eyedropper-color-indicator",children:[c.jsx("div",{className:"eyedropper-color-swatch",style:{backgroundColor:v.sourceColor}}),c.jsx("span",{children:"Click another area to copy its colour"})]}),c.jsx("button",{className:"eyedropper-cancel",onClick:B=>{B.stopPropagation(),o&&o()},children:"Cancel (Esc)"})]})})]}),e&&e.length>0&&c.jsx("div",{className:"legend-sidebar",children:c.jsx(Pj,{recipes:e,mode:r,onColorClick:n,selectedColor:s,editedColors:a,onResetAll:l})})]}),c.jsx("style",{jsx:!0,children:`
        .svg-preview {
          background: #fff;
          border-radius: 8px;
          border: 1px solid #ddd;
          padding: 1.5rem;
          margin-top: 1.5rem;
        }

        .preview-header {
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .design-name-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex: 1;
        }

        .preview-header h3 {
          margin: 0;
          color: #1a365d;
          font-size: 1.5rem;
        }

        .design-name-input {
          font-family: var(--font-heading), 'Space Grotesk', sans-serif;
          font-size: 1.5rem;
          font-weight: 600;
          color: #1a365d;
          border: none;
          border-bottom: 2px solid transparent;
          background: transparent;
          padding: 0.25rem 0;
          width: 100%;
          max-width: 400px;
          transition: border-color 0.2s;
        }

        .design-name-input:hover {
          border-bottom-color: #e5e7eb;
        }

        .design-name-input:focus {
          outline: none;
          border-bottom-color: #ff6b35;
        }

        .design-name-input::placeholder {
          color: #9ca3af;
          font-weight: normal;
        }

        .name-loading {
          font-size: 0.75rem;
          color: #9ca3af;
          font-style: italic;
        }

        /* Color Editing Tip Banner */
        .color-editing-tip {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
          background: linear-gradient(to right, #fff7ed, #fffbeb);
          border: 1px solid #fed7aa;
          border-radius: 6px;
          margin-bottom: 1rem;
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .tip-icon {
          font-size: 1.25rem;
          flex-shrink: 0;
        }

        .tip-content {
          flex: 1;
          color: #78350f;
        }

        .tip-content strong {
          color: #92400e;
        }

        .tip-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #92400e;
          cursor: pointer;
          padding: 0;
          line-height: 1;
          opacity: 0.6;
          transition: opacity 0.2s;
          flex-shrink: 0;
        }

        .tip-close:hover {
          opacity: 1;
        }

        /* SVG Display */
        .svg-display-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          align-items: stretch;
        }

        .svg-panel {
          position: relative;
          flex: 1;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          overflow: hidden;
          background: #fafafa;
        }

        /* Zoom Controls */
        .zoom-controls {
          position: absolute;
          top: 1rem;
          right: 1rem;
          display: flex;
          gap: 0.5rem;
          background: white;
          border-radius: 8px;
          padding: 0.5rem;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
          z-index: 10;
          align-items: center;
        }

        .zoom-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          padding: 0;
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          cursor: pointer;
          color: #1a365d;
          transition: all 0.2s ease;
        }

        .zoom-btn:hover {
          background: #f8fafc;
          border-color: #1e4a7a;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .zoom-btn:active {
          transform: translateY(0);
        }

        .zoom-btn svg {
          width: 20px;
          height: 20px;
        }

        .zoom-level {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1a365d;
          min-width: 50px;
          text-align: center;
          padding: 0 0.5rem;
        }

        /* Undo/Redo Controls */
        .undo-redo-controls {
          position: absolute;
          top: 5rem;
          right: 1rem;
          display: flex;
          gap: 0.5rem;
          background: white;
          border-radius: 8px;
          padding: 0.5rem;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
          z-index: 10;
        }

        .undo-redo-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          padding: 0;
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          cursor: pointer;
          color: #1a365d;
          transition: all 0.2s ease;
        }

        .undo-redo-btn:hover:not(:disabled) {
          background: #f8fafc;
          border-color: #1e4a7a;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .undo-redo-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .undo-redo-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .undo-redo-btn svg {
          width: 20px;
          height: 20px;
        }

        .in-situ-btn {
          position: absolute;
          top: 1rem;
          left: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #ff6b35;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          box-shadow: 0 2px 12px rgba(255, 107, 53, 0.3);
          z-index: 10;
          transition: all 0.2s ease;
        }

        .in-situ-btn:hover {
          background: #e55a2b;
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(255, 107, 53, 0.4);
        }

        .in-situ-btn:active {
          transform: translateY(0);
        }

        .in-situ-btn svg {
          width: 18px;
          height: 18px;
        }

        .svg-wrapper {
          padding: 2rem;
          background: white;
          min-height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
        }

        .svg-image-container {
          position: relative;
          display: inline-block;
          user-select: none;
          transition: transform 0.1s ease-out;
          transform-origin: center center;
        }

        .svg-image {
          max-width: 100%;
          height: auto;
          display: block;
          border-radius: 4px;
          pointer-events: ${n?"auto":"none"};
        }

        .svg-inline-container {
          max-width: 100%;
          display: block;
          border-radius: 4px;
        }

        .svg-inline-container svg {
          max-width: 100%;
          height: auto;
          display: block;
        }

        .svg-highlight-mask {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          border-radius: 4px;
          filter: drop-shadow(0 0 3px rgba(255, 0, 255, 0.8)) drop-shadow(0 0 1px rgba(0, 0, 0, 0.6));
          animation: pulse 2s ease-in-out infinite;
        }

        .eyedropper-overlay {
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 100;
        }

        .eyedropper-content {
          background: white;
          border-radius: 12px;
          padding: 16px 20px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          gap: 16px;
          border: 2px solid #3b82f6;
        }

        .eyedropper-color-indicator {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.95rem;
          font-weight: 500;
          color: #111827;
        }

        .eyedropper-color-swatch {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          border: 2px solid #d1d5db;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .eyedropper-cancel {
          padding: 8px 16px;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .eyedropper-cancel:hover {
          background: #dc2626;
          box-shadow: 0 2px 6px rgba(239, 68, 68, 0.3);
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
        }

        .editing-hint {
          font-size: 0.9rem;
          color: #ff6b35;
          font-weight: 500;
          margin-left: 1rem;
        }

        .legend-sidebar {
          width: 100%;
        }

        @media (max-width: 768px) {
          .svg-preview {
            padding: 0.5rem;
            margin-top: 0.75rem;
            border-radius: 6px;
          }

          .preview-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
            margin-bottom: 0.5rem;
          }

          .preview-header h3 {
            font-size: 1.1rem;
          }

          .design-name-input {
            font-size: 1.1rem;
            max-width: 100%;
          }

          .editing-hint {
            margin-left: 0;
            font-size: 0.75rem;
          }

          .svg-panel {
            border: none;
            border-radius: 0;
          }

          .svg-wrapper {
            padding: 0;
            min-height: auto;
          }

          /* Position zoom controls at bottom-right on mobile */
          .zoom-controls {
            position: fixed;
            bottom: 1rem;
            right: 1rem;
            top: auto;
            flex-direction: column;
            gap: 0.25rem;
            padding: 0.25rem;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(8px);
            z-index: 50;
          }

          /* Position undo/redo controls above zoom on mobile */
          .undo-redo-controls {
            position: fixed;
            bottom: 12rem;
            right: 1rem;
            top: auto;
            gap: 0.25rem;
            padding: 0.25rem;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(8px);
            z-index: 50;
          }

          /* Make buttons circular and compact on mobile */
          .zoom-btn,
          .undo-redo-btn {
            width: 44px;
            height: 44px;
            padding: 0;
            border-radius: 50%;
            min-width: unset;
            font-size: 1.1rem;
          }

          /* Hide text labels on mobile */
          .zoom-btn span {
            display: none;
          }

          /* In-situ button - compact on mobile */
          .in-situ-btn {
            padding: 0.4rem;
            font-size: 0;
            top: 0.5rem;
            left: 0.5rem;
            border-radius: 50%;
            width: 36px;
            height: 36px;
          }

          .in-situ-btn span {
            display: none;
          }

          .in-situ-btn svg {
            width: 18px;
            height: 18px;
          }

          .svg-image-container {
            /* Allow zoom on mobile via buttons */
            cursor: default !important;
          }
        }

        /* Extra small screens */
        @media (max-width: 480px) {
          .svg-preview {
            padding: 0.25rem;
            margin-top: 0.5rem;
          }

          .preview-header {
            padding: 0 0.25rem;
          }

          .preview-header h3 {
            font-size: 1rem;
          }

          .design-name-input {
            font-size: 1rem;
          }
        }
      `})]}):null}var wr={},Ga={},Mj=typeof Bn=="object"&&Bn&&Bn.Object===Object&&Bn,sw=Mj,Dj=sw,Lj=typeof self=="object"&&self&&self.Object===Object&&self,zj=Dj||Lj||Function("return this")(),tn=zj,Fj=tn,Bj=Fj.Symbol,Wa=Bj,Um=Wa,aw=Object.prototype,Uj=aw.hasOwnProperty,Hj=aw.toString,Us=Um?Um.toStringTag:void 0;function Gj(t){var e=Uj.call(t,Us),r=t[Us];try{t[Us]=void 0;var n=!0}catch{}var i=Hj.call(t);return n&&(e?t[Us]=r:delete t[Us]),i}var Wj=Gj,Vj=Object.prototype,qj=Vj.toString;function Kj(t){return qj.call(t)}var Yj=Kj,Hm=Wa,Xj=Wj,Zj=Yj,Jj="[object Null]",Qj="[object Undefined]",Gm=Hm?Hm.toStringTag:void 0;function eE(t){return t==null?t===void 0?Qj:Jj:Gm&&Gm in Object(t)?Xj(t):Zj(t)}var Gi=eE,tE=Array.isArray,Ur=tE;function rE(t){return t!=null&&typeof t=="object"}var kn=rE,nE=Gi,iE=Ur,oE=kn,sE="[object String]";function aE(t){return typeof t=="string"||!iE(t)&&oE(t)&&nE(t)==sE}var lE=aE;function cE(t){return function(e,r,n){for(var i=-1,o=Object(e),s=n(e),a=s.length;a--;){var l=s[t?a:++i];if(r(o[l],l,o)===!1)break}return e}}var uE=cE,dE=uE,hE=dE(),fE=hE;function pE(t,e){for(var r=-1,n=Array(t);++r<t;)n[r]=e(r);return n}var gE=pE,mE=Gi,vE=kn,yE="[object Arguments]";function bE(t){return vE(t)&&mE(t)==yE}var xE=bE,Wm=xE,wE=kn,lw=Object.prototype,_E=lw.hasOwnProperty,SE=lw.propertyIsEnumerable,kE=Wm(function(){return arguments}())?Wm:function(t){return wE(t)&&_E.call(t,"callee")&&!SE.call(t,"callee")},cw=kE,Tc={exports:{}};function jE(){return!1}var EE=jE;Tc.exports;(function(t,e){var r=tn,n=EE,i=e&&!e.nodeType&&e,o=i&&!0&&t&&!t.nodeType&&t,s=o&&o.exports===i,a=s?r.Buffer:void 0,l=a?a.isBuffer:void 0,u=l||n;t.exports=u})(Tc,Tc.exports);var Jf=Tc.exports,CE=9007199254740991,TE=/^(?:0|[1-9]\d*)$/;function NE(t,e){var r=typeof t;return e=e??CE,!!e&&(r=="number"||r!="symbol"&&TE.test(t))&&t>-1&&t%1==0&&t<e}var uw=NE,OE=9007199254740991;function RE(t){return typeof t=="number"&&t>-1&&t%1==0&&t<=OE}var Qf=RE,AE=Gi,PE=Qf,$E=kn,IE="[object Arguments]",ME="[object Array]",DE="[object Boolean]",LE="[object Date]",zE="[object Error]",FE="[object Function]",BE="[object Map]",UE="[object Number]",HE="[object Object]",GE="[object RegExp]",WE="[object Set]",VE="[object String]",qE="[object WeakMap]",KE="[object ArrayBuffer]",YE="[object DataView]",XE="[object Float32Array]",ZE="[object Float64Array]",JE="[object Int8Array]",QE="[object Int16Array]",eC="[object Int32Array]",tC="[object Uint8Array]",rC="[object Uint8ClampedArray]",nC="[object Uint16Array]",iC="[object Uint32Array]",st={};st[XE]=st[ZE]=st[JE]=st[QE]=st[eC]=st[tC]=st[rC]=st[nC]=st[iC]=!0;st[IE]=st[ME]=st[KE]=st[DE]=st[YE]=st[LE]=st[zE]=st[FE]=st[BE]=st[UE]=st[HE]=st[GE]=st[WE]=st[VE]=st[qE]=!1;function oC(t){return $E(t)&&PE(t.length)&&!!st[AE(t)]}var sC=oC;function aC(t){return function(e){return t(e)}}var ep=aC,Nc={exports:{}};Nc.exports;(function(t,e){var r=sw,n=e&&!e.nodeType&&e,i=n&&!0&&t&&!t.nodeType&&t,o=i&&i.exports===n,s=o&&r.process,a=function(){try{var l=i&&i.require&&i.require("util").types;return l||s&&s.binding&&s.binding("util")}catch{}}();t.exports=a})(Nc,Nc.exports);var tp=Nc.exports,lC=sC,cC=ep,Vm=tp,qm=Vm&&Vm.isTypedArray,uC=qm?cC(qm):lC,dw=uC,dC=gE,hC=cw,fC=Ur,pC=Jf,gC=uw,mC=dw,vC=Object.prototype,yC=vC.hasOwnProperty;function bC(t,e){var r=fC(t),n=!r&&hC(t),i=!r&&!n&&pC(t),o=!r&&!n&&!i&&mC(t),s=r||n||i||o,a=s?dC(t.length,String):[],l=a.length;for(var u in t)(e||yC.call(t,u))&&!(s&&(u=="length"||i&&(u=="offset"||u=="parent")||o&&(u=="buffer"||u=="byteLength"||u=="byteOffset")||gC(u,l)))&&a.push(u);return a}var hw=bC,xC=Object.prototype;function wC(t){var e=t&&t.constructor,r=typeof e=="function"&&e.prototype||xC;return t===r}var rp=wC;function _C(t,e){return function(r){return t(e(r))}}var fw=_C,SC=fw,kC=SC(Object.keys,Object),jC=kC,EC=rp,CC=jC,TC=Object.prototype,NC=TC.hasOwnProperty;function OC(t){if(!EC(t))return CC(t);var e=[];for(var r in Object(t))NC.call(t,r)&&r!="constructor"&&e.push(r);return e}var RC=OC;function AC(t){var e=typeof t;return t!=null&&(e=="object"||e=="function")}var hs=AC,PC=Gi,$C=hs,IC="[object AsyncFunction]",MC="[object Function]",DC="[object GeneratorFunction]",LC="[object Proxy]";function zC(t){if(!$C(t))return!1;var e=PC(t);return e==MC||e==DC||e==IC||e==LC}var pw=zC,FC=pw,BC=Qf;function UC(t){return t!=null&&BC(t.length)&&!FC(t)}var ou=UC,HC=hw,GC=RC,WC=ou;function VC(t){return WC(t)?HC(t):GC(t)}var Va=VC,qC=fE,KC=Va;function YC(t,e){return t&&qC(t,e,KC)}var gw=YC;function XC(t){return t}var mw=XC,ZC=mw;function JC(t){return typeof t=="function"?t:ZC}var QC=JC,e5=gw,t5=QC;function r5(t,e){return t&&e5(t,t5(e))}var np=r5,n5=fw,i5=n5(Object.getPrototypeOf,Object),ip=i5,o5=Gi,s5=ip,a5=kn,l5="[object Object]",c5=Function.prototype,u5=Object.prototype,vw=c5.toString,d5=u5.hasOwnProperty,h5=vw.call(Object);function f5(t){if(!a5(t)||o5(t)!=l5)return!1;var e=s5(t);if(e===null)return!0;var r=d5.call(e,"constructor")&&e.constructor;return typeof r=="function"&&r instanceof r&&vw.call(r)==h5}var p5=f5;function g5(t,e){for(var r=-1,n=t==null?0:t.length,i=Array(n);++r<n;)i[r]=e(t[r],r,t);return i}var yw=g5;function m5(){this.__data__=[],this.size=0}var v5=m5;function y5(t,e){return t===e||t!==t&&e!==e}var op=y5,b5=op;function x5(t,e){for(var r=t.length;r--;)if(b5(t[r][0],e))return r;return-1}var su=x5,w5=su,_5=Array.prototype,S5=_5.splice;function k5(t){var e=this.__data__,r=w5(e,t);if(r<0)return!1;var n=e.length-1;return r==n?e.pop():S5.call(e,r,1),--this.size,!0}var j5=k5,E5=su;function C5(t){var e=this.__data__,r=E5(e,t);return r<0?void 0:e[r][1]}var T5=C5,N5=su;function O5(t){return N5(this.__data__,t)>-1}var R5=O5,A5=su;function P5(t,e){var r=this.__data__,n=A5(r,t);return n<0?(++this.size,r.push([t,e])):r[n][1]=e,this}var $5=P5,I5=v5,M5=j5,D5=T5,L5=R5,z5=$5;function fs(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}fs.prototype.clear=I5;fs.prototype.delete=M5;fs.prototype.get=D5;fs.prototype.has=L5;fs.prototype.set=z5;var au=fs,F5=au;function B5(){this.__data__=new F5,this.size=0}var U5=B5;function H5(t){var e=this.__data__,r=e.delete(t);return this.size=e.size,r}var G5=H5;function W5(t){return this.__data__.get(t)}var V5=W5;function q5(t){return this.__data__.has(t)}var K5=q5,Y5=tn,X5=Y5["__core-js_shared__"],Z5=X5,ld=Z5,Km=function(){var t=/[^.]+$/.exec(ld&&ld.keys&&ld.keys.IE_PROTO||"");return t?"Symbol(src)_1."+t:""}();function J5(t){return!!Km&&Km in t}var Q5=J5,eT=Function.prototype,tT=eT.toString;function rT(t){if(t!=null){try{return tT.call(t)}catch{}try{return t+""}catch{}}return""}var bw=rT,nT=pw,iT=Q5,oT=hs,sT=bw,aT=/[\\^$.*+?()[\]{}|]/g,lT=/^\[object .+?Constructor\]$/,cT=Function.prototype,uT=Object.prototype,dT=cT.toString,hT=uT.hasOwnProperty,fT=RegExp("^"+dT.call(hT).replace(aT,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");function pT(t){if(!oT(t)||iT(t))return!1;var e=nT(t)?fT:lT;return e.test(sT(t))}var gT=pT;function mT(t,e){return t==null?void 0:t[e]}var vT=mT,yT=gT,bT=vT;function xT(t,e){var r=bT(t,e);return yT(r)?r:void 0}var Wi=xT,wT=Wi,_T=tn,ST=wT(_T,"Map"),sp=ST,kT=Wi,jT=kT(Object,"create"),lu=jT,Ym=lu;function ET(){this.__data__=Ym?Ym(null):{},this.size=0}var CT=ET;function TT(t){var e=this.has(t)&&delete this.__data__[t];return this.size-=e?1:0,e}var NT=TT,OT=lu,RT="__lodash_hash_undefined__",AT=Object.prototype,PT=AT.hasOwnProperty;function $T(t){var e=this.__data__;if(OT){var r=e[t];return r===RT?void 0:r}return PT.call(e,t)?e[t]:void 0}var IT=$T,MT=lu,DT=Object.prototype,LT=DT.hasOwnProperty;function zT(t){var e=this.__data__;return MT?e[t]!==void 0:LT.call(e,t)}var FT=zT,BT=lu,UT="__lodash_hash_undefined__";function HT(t,e){var r=this.__data__;return this.size+=this.has(t)?0:1,r[t]=BT&&e===void 0?UT:e,this}var GT=HT,WT=CT,VT=NT,qT=IT,KT=FT,YT=GT;function ps(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}ps.prototype.clear=WT;ps.prototype.delete=VT;ps.prototype.get=qT;ps.prototype.has=KT;ps.prototype.set=YT;var XT=ps,Xm=XT,ZT=au,JT=sp;function QT(){this.size=0,this.__data__={hash:new Xm,map:new(JT||ZT),string:new Xm}}var e3=QT;function t3(t){var e=typeof t;return e=="string"||e=="number"||e=="symbol"||e=="boolean"?t!=="__proto__":t===null}var r3=t3,n3=r3;function i3(t,e){var r=t.__data__;return n3(e)?r[typeof e=="string"?"string":"hash"]:r.map}var cu=i3,o3=cu;function s3(t){var e=o3(this,t).delete(t);return this.size-=e?1:0,e}var a3=s3,l3=cu;function c3(t){return l3(this,t).get(t)}var u3=c3,d3=cu;function h3(t){return d3(this,t).has(t)}var f3=h3,p3=cu;function g3(t,e){var r=p3(this,t),n=r.size;return r.set(t,e),this.size+=r.size==n?0:1,this}var m3=g3,v3=e3,y3=a3,b3=u3,x3=f3,w3=m3;function gs(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}gs.prototype.clear=v3;gs.prototype.delete=y3;gs.prototype.get=b3;gs.prototype.has=x3;gs.prototype.set=w3;var ap=gs,_3=au,S3=sp,k3=ap,j3=200;function E3(t,e){var r=this.__data__;if(r instanceof _3){var n=r.__data__;if(!S3||n.length<j3-1)return n.push([t,e]),this.size=++r.size,this;r=this.__data__=new k3(n)}return r.set(t,e),this.size=r.size,this}var C3=E3,T3=au,N3=U5,O3=G5,R3=V5,A3=K5,P3=C3;function ms(t){var e=this.__data__=new T3(t);this.size=e.size}ms.prototype.clear=N3;ms.prototype.delete=O3;ms.prototype.get=R3;ms.prototype.has=A3;ms.prototype.set=P3;var lp=ms,$3="__lodash_hash_undefined__";function I3(t){return this.__data__.set(t,$3),this}var M3=I3;function D3(t){return this.__data__.has(t)}var L3=D3,z3=ap,F3=M3,B3=L3;function Oc(t){var e=-1,r=t==null?0:t.length;for(this.__data__=new z3;++e<r;)this.add(t[e])}Oc.prototype.add=Oc.prototype.push=F3;Oc.prototype.has=B3;var U3=Oc;function H3(t,e){for(var r=-1,n=t==null?0:t.length;++r<n;)if(e(t[r],r,t))return!0;return!1}var G3=H3;function W3(t,e){return t.has(e)}var V3=W3,q3=U3,K3=G3,Y3=V3,X3=1,Z3=2;function J3(t,e,r,n,i,o){var s=r&X3,a=t.length,l=e.length;if(a!=l&&!(s&&l>a))return!1;var u=o.get(t),d=o.get(e);if(u&&d)return u==e&&d==t;var h=-1,f=!0,p=r&Z3?new q3:void 0;for(o.set(t,e),o.set(e,t);++h<a;){var v=t[h],g=e[h];if(n)var b=s?n(g,v,h,e,t,o):n(v,g,h,t,e,o);if(b!==void 0){if(b)continue;f=!1;break}if(p){if(!K3(e,function(m,y){if(!Y3(p,y)&&(v===m||i(v,m,r,n,o)))return p.push(y)})){f=!1;break}}else if(!(v===g||i(v,g,r,n,o))){f=!1;break}}return o.delete(t),o.delete(e),f}var xw=J3,Q3=tn,eN=Q3.Uint8Array,ww=eN;function tN(t){var e=-1,r=Array(t.size);return t.forEach(function(n,i){r[++e]=[i,n]}),r}var rN=tN;function nN(t){var e=-1,r=Array(t.size);return t.forEach(function(n){r[++e]=n}),r}var iN=nN,Zm=Wa,Jm=ww,oN=op,sN=xw,aN=rN,lN=iN,cN=1,uN=2,dN="[object Boolean]",hN="[object Date]",fN="[object Error]",pN="[object Map]",gN="[object Number]",mN="[object RegExp]",vN="[object Set]",yN="[object String]",bN="[object Symbol]",xN="[object ArrayBuffer]",wN="[object DataView]",Qm=Zm?Zm.prototype:void 0,cd=Qm?Qm.valueOf:void 0;function _N(t,e,r,n,i,o,s){switch(r){case wN:if(t.byteLength!=e.byteLength||t.byteOffset!=e.byteOffset)return!1;t=t.buffer,e=e.buffer;case xN:return!(t.byteLength!=e.byteLength||!o(new Jm(t),new Jm(e)));case dN:case hN:case gN:return oN(+t,+e);case fN:return t.name==e.name&&t.message==e.message;case mN:case yN:return t==e+"";case pN:var a=aN;case vN:var l=n&cN;if(a||(a=lN),t.size!=e.size&&!l)return!1;var u=s.get(t);if(u)return u==e;n|=uN,s.set(t,e);var d=sN(a(t),a(e),n,i,o,s);return s.delete(t),d;case bN:if(cd)return cd.call(t)==cd.call(e)}return!1}var SN=_N;function kN(t,e){for(var r=-1,n=e.length,i=t.length;++r<n;)t[i+r]=e[r];return t}var _w=kN,jN=_w,EN=Ur;function CN(t,e,r){var n=e(t);return EN(t)?n:jN(n,r(t))}var Sw=CN;function TN(t,e){for(var r=-1,n=t==null?0:t.length,i=0,o=[];++r<n;){var s=t[r];e(s,r,t)&&(o[i++]=s)}return o}var NN=TN;function ON(){return[]}var kw=ON,RN=NN,AN=kw,PN=Object.prototype,$N=PN.propertyIsEnumerable,e0=Object.getOwnPropertySymbols,IN=e0?function(t){return t==null?[]:(t=Object(t),RN(e0(t),function(e){return $N.call(t,e)}))}:AN,cp=IN,MN=Sw,DN=cp,LN=Va;function zN(t){return MN(t,LN,DN)}var jw=zN,t0=jw,FN=1,BN=Object.prototype,UN=BN.hasOwnProperty;function HN(t,e,r,n,i,o){var s=r&FN,a=t0(t),l=a.length,u=t0(e),d=u.length;if(l!=d&&!s)return!1;for(var h=l;h--;){var f=a[h];if(!(s?f in e:UN.call(e,f)))return!1}var p=o.get(t),v=o.get(e);if(p&&v)return p==e&&v==t;var g=!0;o.set(t,e),o.set(e,t);for(var b=s;++h<l;){f=a[h];var m=t[f],y=e[f];if(n)var x=s?n(y,m,f,e,t,o):n(m,y,f,t,e,o);if(!(x===void 0?m===y||i(m,y,r,n,o):x)){g=!1;break}b||(b=f=="constructor")}if(g&&!b){var w=t.constructor,j=e.constructor;w!=j&&"constructor"in t&&"constructor"in e&&!(typeof w=="function"&&w instanceof w&&typeof j=="function"&&j instanceof j)&&(g=!1)}return o.delete(t),o.delete(e),g}var GN=HN,WN=Wi,VN=tn,qN=WN(VN,"DataView"),KN=qN,YN=Wi,XN=tn,ZN=YN(XN,"Promise"),JN=ZN,QN=Wi,eO=tn,tO=QN(eO,"Set"),rO=tO,nO=Wi,iO=tn,oO=nO(iO,"WeakMap"),sO=oO,$h=KN,Ih=sp,Mh=JN,Dh=rO,Lh=sO,Ew=Gi,vs=bw,r0="[object Map]",aO="[object Object]",n0="[object Promise]",i0="[object Set]",o0="[object WeakMap]",s0="[object DataView]",lO=vs($h),cO=vs(Ih),uO=vs(Mh),dO=vs(Dh),hO=vs(Lh),ki=Ew;($h&&ki(new $h(new ArrayBuffer(1)))!=s0||Ih&&ki(new Ih)!=r0||Mh&&ki(Mh.resolve())!=n0||Dh&&ki(new Dh)!=i0||Lh&&ki(new Lh)!=o0)&&(ki=function(t){var e=Ew(t),r=e==aO?t.constructor:void 0,n=r?vs(r):"";if(n)switch(n){case lO:return s0;case cO:return r0;case uO:return n0;case dO:return i0;case hO:return o0}return e});var uu=ki,ud=lp,fO=xw,pO=SN,gO=GN,a0=uu,l0=Ur,c0=Jf,mO=dw,vO=1,u0="[object Arguments]",d0="[object Array]",Al="[object Object]",yO=Object.prototype,h0=yO.hasOwnProperty;function bO(t,e,r,n,i,o){var s=l0(t),a=l0(e),l=s?d0:a0(t),u=a?d0:a0(e);l=l==u0?Al:l,u=u==u0?Al:u;var d=l==Al,h=u==Al,f=l==u;if(f&&c0(t)){if(!c0(e))return!1;s=!0,d=!1}if(f&&!d)return o||(o=new ud),s||mO(t)?fO(t,e,r,n,i,o):pO(t,e,l,r,n,i,o);if(!(r&vO)){var p=d&&h0.call(t,"__wrapped__"),v=h&&h0.call(e,"__wrapped__");if(p||v){var g=p?t.value():t,b=v?e.value():e;return o||(o=new ud),i(g,b,r,n,o)}}return f?(o||(o=new ud),gO(t,e,r,n,i,o)):!1}var xO=bO,wO=xO,f0=kn;function Cw(t,e,r,n,i){return t===e?!0:t==null||e==null||!f0(t)&&!f0(e)?t!==t&&e!==e:wO(t,e,r,n,Cw,i)}var Tw=Cw,_O=lp,SO=Tw,kO=1,jO=2;function EO(t,e,r,n){var i=r.length,o=i,s=!n;if(t==null)return!o;for(t=Object(t);i--;){var a=r[i];if(s&&a[2]?a[1]!==t[a[0]]:!(a[0]in t))return!1}for(;++i<o;){a=r[i];var l=a[0],u=t[l],d=a[1];if(s&&a[2]){if(u===void 0&&!(l in t))return!1}else{var h=new _O;if(n)var f=n(u,d,l,t,e,h);if(!(f===void 0?SO(d,u,kO|jO,n,h):f))return!1}}return!0}var CO=EO,TO=hs;function NO(t){return t===t&&!TO(t)}var Nw=NO,OO=Nw,RO=Va;function AO(t){for(var e=RO(t),r=e.length;r--;){var n=e[r],i=t[n];e[r]=[n,i,OO(i)]}return e}var PO=AO;function $O(t,e){return function(r){return r==null?!1:r[t]===e&&(e!==void 0||t in Object(r))}}var Ow=$O,IO=CO,MO=PO,DO=Ow;function LO(t){var e=MO(t);return e.length==1&&e[0][2]?DO(e[0][0],e[0][1]):function(r){return r===t||IO(r,t,e)}}var zO=LO,FO=Gi,BO=kn,UO="[object Symbol]";function HO(t){return typeof t=="symbol"||BO(t)&&FO(t)==UO}var up=HO,GO=Ur,WO=up,VO=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,qO=/^\w*$/;function KO(t,e){if(GO(t))return!1;var r=typeof t;return r=="number"||r=="symbol"||r=="boolean"||t==null||WO(t)?!0:qO.test(t)||!VO.test(t)||e!=null&&t in Object(e)}var dp=KO,Rw=ap,YO="Expected a function";function hp(t,e){if(typeof t!="function"||e!=null&&typeof e!="function")throw new TypeError(YO);var r=function(){var n=arguments,i=e?e.apply(this,n):n[0],o=r.cache;if(o.has(i))return o.get(i);var s=t.apply(this,n);return r.cache=o.set(i,s)||o,s};return r.cache=new(hp.Cache||Rw),r}hp.Cache=Rw;var XO=hp,ZO=XO,JO=500;function QO(t){var e=ZO(t,function(n){return r.size===JO&&r.clear(),n}),r=e.cache;return e}var eR=QO,tR=eR,rR=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,nR=/\\(\\)?/g,iR=tR(function(t){var e=[];return t.charCodeAt(0)===46&&e.push(""),t.replace(rR,function(r,n,i,o){e.push(i?o.replace(nR,"$1"):n||r)}),e}),oR=iR,p0=Wa,sR=yw,aR=Ur,lR=up,g0=p0?p0.prototype:void 0,m0=g0?g0.toString:void 0;function Aw(t){if(typeof t=="string")return t;if(aR(t))return sR(t,Aw)+"";if(lR(t))return m0?m0.call(t):"";var e=t+"";return e=="0"&&1/t==-1/0?"-0":e}var cR=Aw,uR=cR;function dR(t){return t==null?"":uR(t)}var hR=dR,fR=Ur,pR=dp,gR=oR,mR=hR;function vR(t,e){return fR(t)?t:pR(t,e)?[t]:gR(mR(t))}var Pw=vR,yR=up;function bR(t){if(typeof t=="string"||yR(t))return t;var e=t+"";return e=="0"&&1/t==-1/0?"-0":e}var du=bR,xR=Pw,wR=du;function _R(t,e){e=xR(e,t);for(var r=0,n=e.length;t!=null&&r<n;)t=t[wR(e[r++])];return r&&r==n?t:void 0}var $w=_R,SR=$w;function kR(t,e,r){var n=t==null?void 0:SR(t,e);return n===void 0?r:n}var jR=kR;function ER(t,e){return t!=null&&e in Object(t)}var CR=ER,TR=Pw,NR=cw,OR=Ur,RR=uw,AR=Qf,PR=du;function $R(t,e,r){e=TR(e,t);for(var n=-1,i=e.length,o=!1;++n<i;){var s=PR(e[n]);if(!(o=t!=null&&r(t,s)))break;t=t[s]}return o||++n!=i?o:(i=t==null?0:t.length,!!i&&AR(i)&&RR(s,i)&&(OR(t)||NR(t)))}var IR=$R,MR=CR,DR=IR;function LR(t,e){return t!=null&&DR(t,e,MR)}var zR=LR,FR=Tw,BR=jR,UR=zR,HR=dp,GR=Nw,WR=Ow,VR=du,qR=1,KR=2;function YR(t,e){return HR(t)&&GR(e)?WR(VR(t),e):function(r){var n=BR(r,t);return n===void 0&&n===e?UR(r,t):FR(e,n,qR|KR)}}var XR=YR;function ZR(t){return function(e){return e==null?void 0:e[t]}}var JR=ZR,QR=$w;function eA(t){return function(e){return QR(e,t)}}var tA=eA,rA=JR,nA=tA,iA=dp,oA=du;function sA(t){return iA(t)?rA(oA(t)):nA(t)}var aA=sA,lA=zO,cA=XR,uA=mw,dA=Ur,hA=aA;function fA(t){return typeof t=="function"?t:t==null?uA:typeof t=="object"?dA(t)?cA(t[0],t[1]):lA(t):hA(t)}var pA=fA,gA=ou;function mA(t,e){return function(r,n){if(r==null)return r;if(!gA(r))return t(r,n);for(var i=r.length,o=e?i:-1,s=Object(r);(e?o--:++o<i)&&n(s[o],o,s)!==!1;);return r}}var vA=mA,yA=gw,bA=vA,xA=bA(yA),wA=xA,_A=wA,SA=ou;function kA(t,e){var r=-1,n=SA(t)?Array(t.length):[];return _A(t,function(i,o,s){n[++r]=e(i,o,s)}),n}var jA=kA,EA=yw,CA=pA,TA=jA,NA=Ur;function OA(t,e){var r=NA(t)?EA:TA;return r(t,CA(e))}var RA=OA;Object.defineProperty(Ga,"__esModule",{value:!0});Ga.flattenNames=void 0;var AA=lE,PA=hu(AA),$A=np,IA=hu($A),MA=p5,DA=hu(MA),LA=RA,zA=hu(LA);function hu(t){return t&&t.__esModule?t:{default:t}}var FA=Ga.flattenNames=function t(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:[],r=[];return(0,zA.default)(e,function(n){Array.isArray(n)?t(n).map(function(i){return r.push(i)}):(0,DA.default)(n)?(0,IA.default)(n,function(i,o){i===!0&&r.push(o),r.push(o+"-"+i)}):(0,PA.default)(n)&&r.push(n)}),r};Ga.default=FA;var qa={};function BA(t,e){for(var r=-1,n=t==null?0:t.length;++r<n&&e(t[r],r,t)!==!1;);return t}var UA=BA,HA=Wi,GA=function(){try{var t=HA(Object,"defineProperty");return t({},"",{}),t}catch{}}(),WA=GA,v0=WA;function VA(t,e,r){e=="__proto__"&&v0?v0(t,e,{configurable:!0,enumerable:!0,value:r,writable:!0}):t[e]=r}var Iw=VA,qA=Iw,KA=op,YA=Object.prototype,XA=YA.hasOwnProperty;function ZA(t,e,r){var n=t[e];(!(XA.call(t,e)&&KA(n,r))||r===void 0&&!(e in t))&&qA(t,e,r)}var Mw=ZA,JA=Mw,QA=Iw;function eP(t,e,r,n){var i=!r;r||(r={});for(var o=-1,s=e.length;++o<s;){var a=e[o],l=n?n(r[a],t[a],a,r,t):void 0;l===void 0&&(l=t[a]),i?QA(r,a,l):JA(r,a,l)}return r}var fu=eP,tP=fu,rP=Va;function nP(t,e){return t&&tP(e,rP(e),t)}var iP=nP;function oP(t){var e=[];if(t!=null)for(var r in Object(t))e.push(r);return e}var sP=oP,aP=hs,lP=rp,cP=sP,uP=Object.prototype,dP=uP.hasOwnProperty;function hP(t){if(!aP(t))return cP(t);var e=lP(t),r=[];for(var n in t)n=="constructor"&&(e||!dP.call(t,n))||r.push(n);return r}var fP=hP,pP=hw,gP=fP,mP=ou;function vP(t){return mP(t)?pP(t,!0):gP(t)}var fp=vP,yP=fu,bP=fp;function xP(t,e){return t&&yP(e,bP(e),t)}var wP=xP,Rc={exports:{}};Rc.exports;(function(t,e){var r=tn,n=e&&!e.nodeType&&e,i=n&&!0&&t&&!t.nodeType&&t,o=i&&i.exports===n,s=o?r.Buffer:void 0,a=s?s.allocUnsafe:void 0;function l(u,d){if(d)return u.slice();var h=u.length,f=a?a(h):new u.constructor(h);return u.copy(f),f}t.exports=l})(Rc,Rc.exports);var _P=Rc.exports;function SP(t,e){var r=-1,n=t.length;for(e||(e=Array(n));++r<n;)e[r]=t[r];return e}var kP=SP,jP=fu,EP=cp;function CP(t,e){return jP(t,EP(t),e)}var TP=CP,NP=_w,OP=ip,RP=cp,AP=kw,PP=Object.getOwnPropertySymbols,$P=PP?function(t){for(var e=[];t;)NP(e,RP(t)),t=OP(t);return e}:AP,Dw=$P,IP=fu,MP=Dw;function DP(t,e){return IP(t,MP(t),e)}var LP=DP,zP=Sw,FP=Dw,BP=fp;function UP(t){return zP(t,BP,FP)}var HP=UP,GP=Object.prototype,WP=GP.hasOwnProperty;function VP(t){var e=t.length,r=new t.constructor(e);return e&&typeof t[0]=="string"&&WP.call(t,"index")&&(r.index=t.index,r.input=t.input),r}var qP=VP,y0=ww;function KP(t){var e=new t.constructor(t.byteLength);return new y0(e).set(new y0(t)),e}var pp=KP,YP=pp;function XP(t,e){var r=e?YP(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.byteLength)}var ZP=XP,JP=/\w*$/;function QP(t){var e=new t.constructor(t.source,JP.exec(t));return e.lastIndex=t.lastIndex,e}var e4=QP,b0=Wa,x0=b0?b0.prototype:void 0,w0=x0?x0.valueOf:void 0;function t4(t){return w0?Object(w0.call(t)):{}}var r4=t4,n4=pp;function i4(t,e){var r=e?n4(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.length)}var o4=i4,s4=pp,a4=ZP,l4=e4,c4=r4,u4=o4,d4="[object Boolean]",h4="[object Date]",f4="[object Map]",p4="[object Number]",g4="[object RegExp]",m4="[object Set]",v4="[object String]",y4="[object Symbol]",b4="[object ArrayBuffer]",x4="[object DataView]",w4="[object Float32Array]",_4="[object Float64Array]",S4="[object Int8Array]",k4="[object Int16Array]",j4="[object Int32Array]",E4="[object Uint8Array]",C4="[object Uint8ClampedArray]",T4="[object Uint16Array]",N4="[object Uint32Array]";function O4(t,e,r){var n=t.constructor;switch(e){case b4:return s4(t);case d4:case h4:return new n(+t);case x4:return a4(t,r);case w4:case _4:case S4:case k4:case j4:case E4:case C4:case T4:case N4:return u4(t,r);case f4:return new n;case p4:case v4:return new n(t);case g4:return l4(t);case m4:return new n;case y4:return c4(t)}}var R4=O4,A4=hs,_0=Object.create,P4=function(){function t(){}return function(e){if(!A4(e))return{};if(_0)return _0(e);t.prototype=e;var r=new t;return t.prototype=void 0,r}}(),$4=P4,I4=$4,M4=ip,D4=rp;function L4(t){return typeof t.constructor=="function"&&!D4(t)?I4(M4(t)):{}}var z4=L4,F4=uu,B4=kn,U4="[object Map]";function H4(t){return B4(t)&&F4(t)==U4}var G4=H4,W4=G4,V4=ep,S0=tp,k0=S0&&S0.isMap,q4=k0?V4(k0):W4,K4=q4,Y4=uu,X4=kn,Z4="[object Set]";function J4(t){return X4(t)&&Y4(t)==Z4}var Q4=J4,e$=Q4,t$=ep,j0=tp,E0=j0&&j0.isSet,r$=E0?t$(E0):e$,n$=r$,i$=lp,o$=UA,s$=Mw,a$=iP,l$=wP,c$=_P,u$=kP,d$=TP,h$=LP,f$=jw,p$=HP,g$=uu,m$=qP,v$=R4,y$=z4,b$=Ur,x$=Jf,w$=K4,_$=hs,S$=n$,k$=Va,j$=fp,E$=1,C$=2,T$=4,Lw="[object Arguments]",N$="[object Array]",O$="[object Boolean]",R$="[object Date]",A$="[object Error]",zw="[object Function]",P$="[object GeneratorFunction]",$$="[object Map]",I$="[object Number]",Fw="[object Object]",M$="[object RegExp]",D$="[object Set]",L$="[object String]",z$="[object Symbol]",F$="[object WeakMap]",B$="[object ArrayBuffer]",U$="[object DataView]",H$="[object Float32Array]",G$="[object Float64Array]",W$="[object Int8Array]",V$="[object Int16Array]",q$="[object Int32Array]",K$="[object Uint8Array]",Y$="[object Uint8ClampedArray]",X$="[object Uint16Array]",Z$="[object Uint32Array]",nt={};nt[Lw]=nt[N$]=nt[B$]=nt[U$]=nt[O$]=nt[R$]=nt[H$]=nt[G$]=nt[W$]=nt[V$]=nt[q$]=nt[$$]=nt[I$]=nt[Fw]=nt[M$]=nt[D$]=nt[L$]=nt[z$]=nt[K$]=nt[Y$]=nt[X$]=nt[Z$]=!0;nt[A$]=nt[zw]=nt[F$]=!1;function Jl(t,e,r,n,i,o){var s,a=e&E$,l=e&C$,u=e&T$;if(r&&(s=i?r(t,n,i,o):r(t)),s!==void 0)return s;if(!_$(t))return t;var d=b$(t);if(d){if(s=m$(t),!a)return u$(t,s)}else{var h=g$(t),f=h==zw||h==P$;if(x$(t))return c$(t,a);if(h==Fw||h==Lw||f&&!i){if(s=l||f?{}:y$(t),!a)return l?h$(t,l$(s,t)):d$(t,a$(s,t))}else{if(!nt[h])return i?t:{};s=v$(t,h,a)}}o||(o=new i$);var p=o.get(t);if(p)return p;o.set(t,s),S$(t)?t.forEach(function(b){s.add(Jl(b,e,r,b,t,o))}):w$(t)&&t.forEach(function(b,m){s.set(m,Jl(b,e,r,m,t,o))});var v=u?l?p$:f$:l?j$:k$,g=d?void 0:v(t);return o$(g||t,function(b,m){g&&(m=b,b=t[m]),s$(s,m,Jl(b,e,r,m,t,o))}),s}var J$=Jl,Q$=J$,e6=1,t6=4;function r6(t){return Q$(t,e6|t6)}var n6=r6;Object.defineProperty(qa,"__esModule",{value:!0});qa.mergeClasses=void 0;var i6=np,o6=Bw(i6),s6=n6,a6=Bw(s6),l6=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t};function Bw(t){return t&&t.__esModule?t:{default:t}}var c6=qa.mergeClasses=function(e){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:[],n=e.default&&(0,a6.default)(e.default)||{};return r.map(function(i){var o=e[i];return o&&(0,o6.default)(o,function(s,a){n[a]||(n[a]={}),n[a]=l6({},n[a],o[a])}),i}),n};qa.default=c6;var Ka={};Object.defineProperty(Ka,"__esModule",{value:!0});Ka.autoprefix=void 0;var u6=np,C0=h6(u6),d6=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t};function h6(t){return t&&t.__esModule?t:{default:t}}var f6={borderRadius:function(e){return{msBorderRadius:e,MozBorderRadius:e,OBorderRadius:e,WebkitBorderRadius:e,borderRadius:e}},boxShadow:function(e){return{msBoxShadow:e,MozBoxShadow:e,OBoxShadow:e,WebkitBoxShadow:e,boxShadow:e}},userSelect:function(e){return{WebkitTouchCallout:e,KhtmlUserSelect:e,MozUserSelect:e,msUserSelect:e,WebkitUserSelect:e,userSelect:e}},flex:function(e){return{WebkitBoxFlex:e,MozBoxFlex:e,WebkitFlex:e,msFlex:e,flex:e}},flexBasis:function(e){return{WebkitFlexBasis:e,flexBasis:e}},justifyContent:function(e){return{WebkitJustifyContent:e,justifyContent:e}},transition:function(e){return{msTransition:e,MozTransition:e,OTransition:e,WebkitTransition:e,transition:e}},transform:function(e){return{msTransform:e,MozTransform:e,OTransform:e,WebkitTransform:e,transform:e}},absolute:function(e){var r=e&&e.split(" ");return{position:"absolute",top:r&&r[0],right:r&&r[1],bottom:r&&r[2],left:r&&r[3]}},extend:function(e,r){var n=r[e];return n||{extend:e}}},p6=Ka.autoprefix=function(e){var r={};return(0,C0.default)(e,function(n,i){var o={};(0,C0.default)(n,function(s,a){var l=f6[a];l?o=d6({},o,l(s)):o[a]=s}),r[i]=o}),r};Ka.default=p6;var Ya={};Object.defineProperty(Ya,"__esModule",{value:!0});Ya.hover=void 0;var g6=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},m6=$,dd=v6(m6);function v6(t){return t&&t.__esModule?t:{default:t}}function y6(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function T0(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e&&(typeof e=="object"||typeof e=="function")?e:t}function b6(t,e){if(typeof e!="function"&&e!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}var x6=Ya.hover=function(e){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"span";return function(n){b6(i,n);function i(){var o,s,a,l;y6(this,i);for(var u=arguments.length,d=Array(u),h=0;h<u;h++)d[h]=arguments[h];return l=(s=(a=T0(this,(o=i.__proto__||Object.getPrototypeOf(i)).call.apply(o,[this].concat(d))),a),a.state={hover:!1},a.handleMouseOver=function(){return a.setState({hover:!0})},a.handleMouseOut=function(){return a.setState({hover:!1})},a.render=function(){return dd.default.createElement(r,{onMouseOver:a.handleMouseOver,onMouseOut:a.handleMouseOut},dd.default.createElement(e,g6({},a.props,a.state)))},s),T0(a,l)}return i}(dd.default.Component)};Ya.default=x6;var Xa={};Object.defineProperty(Xa,"__esModule",{value:!0});Xa.active=void 0;var w6=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},_6=$,hd=S6(_6);function S6(t){return t&&t.__esModule?t:{default:t}}function k6(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function N0(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e&&(typeof e=="object"||typeof e=="function")?e:t}function j6(t,e){if(typeof e!="function"&&e!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}var E6=Xa.active=function(e){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"span";return function(n){j6(i,n);function i(){var o,s,a,l;k6(this,i);for(var u=arguments.length,d=Array(u),h=0;h<u;h++)d[h]=arguments[h];return l=(s=(a=N0(this,(o=i.__proto__||Object.getPrototypeOf(i)).call.apply(o,[this].concat(d))),a),a.state={active:!1},a.handleMouseDown=function(){return a.setState({active:!0})},a.handleMouseUp=function(){return a.setState({active:!1})},a.render=function(){return hd.default.createElement(r,{onMouseDown:a.handleMouseDown,onMouseUp:a.handleMouseUp},hd.default.createElement(e,w6({},a.props,a.state)))},s),N0(a,l)}return i}(hd.default.Component)};Xa.default=E6;var gp={};Object.defineProperty(gp,"__esModule",{value:!0});var C6=function(e,r){var n={},i=function(s){var a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;n[s]=a};return e===0&&i("first-child"),e===r-1&&i("last-child"),(e===0||e%2===0)&&i("even"),Math.abs(e%2)===1&&i("odd"),i("nth-child",e),n};gp.default=C6;Object.defineProperty(wr,"__esModule",{value:!0});wr.ReactCSS=wr.loop=wr.handleActive=mp=wr.handleHover=wr.hover=void 0;var T6=Ga,N6=ys(T6),O6=qa,R6=ys(O6),A6=Ka,P6=ys(A6),$6=Ya,Uw=ys($6),I6=Xa,M6=ys(I6),D6=gp,L6=ys(D6);function ys(t){return t&&t.__esModule?t:{default:t}}wr.hover=Uw.default;var mp=wr.handleHover=Uw.default;wr.handleActive=M6.default;wr.loop=L6.default;var z6=wr.ReactCSS=function(e){for(var r=arguments.length,n=Array(r>1?r-1:0),i=1;i<r;i++)n[i-1]=arguments[i];var o=(0,N6.default)(n),s=(0,R6.default)(e,o);return(0,P6.default)(s)},Pe=wr.default=z6,F6=function(e,r,n,i,o){var s=o.clientWidth,a=o.clientHeight,l=typeof e.pageX=="number"?e.pageX:e.touches[0].pageX,u=typeof e.pageY=="number"?e.pageY:e.touches[0].pageY,d=l-(o.getBoundingClientRect().left+window.pageXOffset),h=u-(o.getBoundingClientRect().top+window.pageYOffset);if(n==="vertical"){var f=void 0;if(h<0?f=0:h>a?f=1:f=Math.round(h*100/a)/100,r.a!==f)return{h:r.h,s:r.s,l:r.l,a:f,source:"rgb"}}else{var p=void 0;if(d<0?p=0:d>s?p=1:p=Math.round(d*100/s)/100,i!==p)return{h:r.h,s:r.s,l:r.l,a:p,source:"rgb"}}return null},fd={},B6=function(e,r,n,i){if(typeof document>"u"&&!i)return null;var o=i?new i:document.createElement("canvas");o.width=n*2,o.height=n*2;var s=o.getContext("2d");return s?(s.fillStyle=e,s.fillRect(0,0,o.width,o.height),s.fillStyle=r,s.fillRect(0,0,n,n),s.translate(n,n),s.fillRect(0,0,n,n),o.toDataURL()):null},U6=function(e,r,n,i){var o=e+"-"+r+"-"+n+(i?"-server":"");if(fd[o])return fd[o];var s=B6(e,r,n,i);return fd[o]=s,s},O0=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},bs=function(e){var r=e.white,n=e.grey,i=e.size,o=e.renderers,s=e.borderRadius,a=e.boxShadow,l=e.children,u=Pe({default:{grid:{borderRadius:s,boxShadow:a,absolute:"0px 0px 0px 0px",background:"url("+U6(r,n,i,o.canvas)+") center left"}}});return $.isValidElement(l)?P.cloneElement(l,O0({},l.props,{style:O0({},l.props.style,u.grid)})):P.createElement("div",{style:u.grid})};bs.defaultProps={size:8,white:"transparent",grey:"rgba(0,0,0,.08)",renderers:{}};var H6=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},G6=function(){function t(e,r){for(var n=0;n<r.length;n++){var i=r[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}();function W6(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function R0(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e&&(typeof e=="object"||typeof e=="function")?e:t}function V6(t,e){if(typeof e!="function"&&e!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}var vp=function(t){V6(e,t);function e(){var r,n,i,o;W6(this,e);for(var s=arguments.length,a=Array(s),l=0;l<s;l++)a[l]=arguments[l];return o=(n=(i=R0(this,(r=e.__proto__||Object.getPrototypeOf(e)).call.apply(r,[this].concat(a))),i),i.handleChange=function(u){var d=F6(u,i.props.hsl,i.props.direction,i.props.a,i.container);d&&typeof i.props.onChange=="function"&&i.props.onChange(d,u)},i.handleMouseDown=function(u){i.handleChange(u),window.addEventListener("mousemove",i.handleChange),window.addEventListener("mouseup",i.handleMouseUp)},i.handleMouseUp=function(){i.unbindEventListeners()},i.unbindEventListeners=function(){window.removeEventListener("mousemove",i.handleChange),window.removeEventListener("mouseup",i.handleMouseUp)},n),R0(i,o)}return G6(e,[{key:"componentWillUnmount",value:function(){this.unbindEventListeners()}},{key:"render",value:function(){var n=this,i=this.props.rgb,o=Pe({default:{alpha:{absolute:"0px 0px 0px 0px",borderRadius:this.props.radius},checkboard:{absolute:"0px 0px 0px 0px",overflow:"hidden",borderRadius:this.props.radius},gradient:{absolute:"0px 0px 0px 0px",background:"linear-gradient(to right, rgba("+i.r+","+i.g+","+i.b+`, 0) 0%,
           rgba(`+i.r+","+i.g+","+i.b+", 1) 100%)",boxShadow:this.props.shadow,borderRadius:this.props.radius},container:{position:"relative",height:"100%",margin:"0 3px"},pointer:{position:"absolute",left:i.a*100+"%"},slider:{width:"4px",borderRadius:"1px",height:"8px",boxShadow:"0 0 2px rgba(0, 0, 0, .6)",background:"#fff",marginTop:"1px",transform:"translateX(-2px)"}},vertical:{gradient:{background:"linear-gradient(to bottom, rgba("+i.r+","+i.g+","+i.b+`, 0) 0%,
           rgba(`+i.r+","+i.g+","+i.b+", 1) 100%)"},pointer:{left:0,top:i.a*100+"%"}},overwrite:H6({},this.props.style)},{vertical:this.props.direction==="vertical",overwrite:!0});return P.createElement("div",{style:o.alpha},P.createElement("div",{style:o.checkboard},P.createElement(bs,{renderers:this.props.renderers})),P.createElement("div",{style:o.gradient}),P.createElement("div",{style:o.container,ref:function(a){return n.container=a},onMouseDown:this.handleMouseDown,onTouchMove:this.handleChange,onTouchStart:this.handleChange},P.createElement("div",{style:o.pointer},this.props.pointer?P.createElement(this.props.pointer,this.props):P.createElement("div",{style:o.slider}))))}}]),e}($.PureComponent||$.Component),q6=function(){function t(e,r){for(var n=0;n<r.length;n++){var i=r[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}();function K6(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function Y6(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function X6(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e&&(typeof e=="object"||typeof e=="function")?e:t}function Z6(t,e){if(typeof e!="function"&&e!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}var J6=1,Hw=38,Q6=40,eI=[Hw,Q6],tI=function(e){return eI.indexOf(e)>-1},rI=function(e){return Number(String(e).replace(/%/g,""))},nI=1,Ue=function(t){Z6(e,t);function e(r){Y6(this,e);var n=X6(this,(e.__proto__||Object.getPrototypeOf(e)).call(this));return n.handleBlur=function(){n.state.blurValue&&n.setState({value:n.state.blurValue,blurValue:null})},n.handleChange=function(i){n.setUpdatedValue(i.target.value,i)},n.handleKeyDown=function(i){var o=rI(i.target.value);if(!isNaN(o)&&tI(i.keyCode)){var s=n.getArrowOffset(),a=i.keyCode===Hw?o+s:o-s;n.setUpdatedValue(a,i)}},n.handleDrag=function(i){if(n.props.dragLabel){var o=Math.round(n.props.value+i.movementX);o>=0&&o<=n.props.dragMax&&n.props.onChange&&n.props.onChange(n.getValueObjectWithLabel(o),i)}},n.handleMouseDown=function(i){n.props.dragLabel&&(i.preventDefault(),n.handleDrag(i),window.addEventListener("mousemove",n.handleDrag),window.addEventListener("mouseup",n.handleMouseUp))},n.handleMouseUp=function(){n.unbindEventListeners()},n.unbindEventListeners=function(){window.removeEventListener("mousemove",n.handleDrag),window.removeEventListener("mouseup",n.handleMouseUp)},n.state={value:String(r.value).toUpperCase(),blurValue:String(r.value).toUpperCase()},n.inputId="rc-editable-input-"+nI++,n}return q6(e,[{key:"componentDidUpdate",value:function(n,i){this.props.value!==this.state.value&&(n.value!==this.props.value||i.value!==this.state.value)&&(this.input===document.activeElement?this.setState({blurValue:String(this.props.value).toUpperCase()}):this.setState({value:String(this.props.value).toUpperCase(),blurValue:!this.state.blurValue&&String(this.props.value).toUpperCase()}))}},{key:"componentWillUnmount",value:function(){this.unbindEventListeners()}},{key:"getValueObjectWithLabel",value:function(n){return K6({},this.props.label,n)}},{key:"getArrowOffset",value:function(){return this.props.arrowOffset||J6}},{key:"setUpdatedValue",value:function(n,i){var o=this.props.label?this.getValueObjectWithLabel(n):n;this.props.onChange&&this.props.onChange(o,i),this.setState({value:n})}},{key:"render",value:function(){var n=this,i=Pe({default:{wrap:{position:"relative"}},"user-override":{wrap:this.props.style&&this.props.style.wrap?this.props.style.wrap:{},input:this.props.style&&this.props.style.input?this.props.style.input:{},label:this.props.style&&this.props.style.label?this.props.style.label:{}},"dragLabel-true":{label:{cursor:"ew-resize"}}},{"user-override":!0},this.props);return P.createElement("div",{style:i.wrap},P.createElement("input",{id:this.inputId,style:i.input,ref:function(s){return n.input=s},value:this.state.value,onKeyDown:this.handleKeyDown,onChange:this.handleChange,onBlur:this.handleBlur,placeholder:this.props.placeholder,spellCheck:"false"}),this.props.label&&!this.props.hideLabel?P.createElement("label",{htmlFor:this.inputId,style:i.label,onMouseDown:this.handleMouseDown},this.props.label):null)}}]),e}($.PureComponent||$.Component),iI=function(e,r,n,i){var o=i.clientWidth,s=i.clientHeight,a=typeof e.pageX=="number"?e.pageX:e.touches[0].pageX,l=typeof e.pageY=="number"?e.pageY:e.touches[0].pageY,u=a-(i.getBoundingClientRect().left+window.pageXOffset),d=l-(i.getBoundingClientRect().top+window.pageYOffset);if(r==="vertical"){var h=void 0;if(d<0)h=359;else if(d>s)h=0;else{var f=-(d*100/s)+100;h=360*f/100}if(n.h!==h)return{h,s:n.s,l:n.l,a:n.a,source:"hsl"}}else{var p=void 0;if(u<0)p=0;else if(u>o)p=359;else{var v=u*100/o;p=360*v/100}if(n.h!==p)return{h:p,s:n.s,l:n.l,a:n.a,source:"hsl"}}return null},oI=function(){function t(e,r){for(var n=0;n<r.length;n++){var i=r[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}();function sI(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function A0(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e&&(typeof e=="object"||typeof e=="function")?e:t}function aI(t,e){if(typeof e!="function"&&e!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}var xs=function(t){aI(e,t);function e(){var r,n,i,o;sI(this,e);for(var s=arguments.length,a=Array(s),l=0;l<s;l++)a[l]=arguments[l];return o=(n=(i=A0(this,(r=e.__proto__||Object.getPrototypeOf(e)).call.apply(r,[this].concat(a))),i),i.handleChange=function(u){var d=iI(u,i.props.direction,i.props.hsl,i.container);d&&typeof i.props.onChange=="function"&&i.props.onChange(d,u)},i.handleMouseDown=function(u){i.handleChange(u),window.addEventListener("mousemove",i.handleChange),window.addEventListener("mouseup",i.handleMouseUp)},i.handleMouseUp=function(){i.unbindEventListeners()},n),A0(i,o)}return oI(e,[{key:"componentWillUnmount",value:function(){this.unbindEventListeners()}},{key:"unbindEventListeners",value:function(){window.removeEventListener("mousemove",this.handleChange),window.removeEventListener("mouseup",this.handleMouseUp)}},{key:"render",value:function(){var n=this,i=this.props.direction,o=i===void 0?"horizontal":i,s=Pe({default:{hue:{absolute:"0px 0px 0px 0px",borderRadius:this.props.radius,boxShadow:this.props.shadow},container:{padding:"0 2px",position:"relative",height:"100%",borderRadius:this.props.radius},pointer:{position:"absolute",left:this.props.hsl.h*100/360+"%"},slider:{marginTop:"1px",width:"4px",borderRadius:"1px",height:"8px",boxShadow:"0 0 2px rgba(0, 0, 0, .6)",background:"#fff",transform:"translateX(-2px)"}},vertical:{pointer:{left:"0px",top:-(this.props.hsl.h*100/360)+100+"%"}}},{vertical:o==="vertical"});return P.createElement("div",{style:s.hue},P.createElement("div",{className:"hue-"+o,style:s.container,ref:function(l){return n.container=l},onMouseDown:this.handleMouseDown,onTouchMove:this.handleChange,onTouchStart:this.handleChange},P.createElement("style",null,`
            .hue-horizontal {
              background: linear-gradient(to right, #f00 0%, #ff0 17%, #0f0
                33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
              background: -webkit-linear-gradient(to right, #f00 0%, #ff0
                17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
            }

            .hue-vertical {
              background: linear-gradient(to top, #f00 0%, #ff0 17%, #0f0 33%,
                #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
              background: -webkit-linear-gradient(to top, #f00 0%, #ff0 17%,
                #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
            }
          `),P.createElement("div",{style:s.pointer},this.props.pointer?P.createElement(this.props.pointer,this.props):P.createElement("div",{style:s.slider}))))}}]),e}($.PureComponent||$.Component),Gw={exports:{}},lI="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED",cI=lI,uI=cI;function Ww(){}function Vw(){}Vw.resetWarningCache=Ww;var dI=function(){function t(n,i,o,s,a,l){if(l!==uI){var u=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw u.name="Invariant Violation",u}}t.isRequired=t;function e(){return t}var r={array:t,bigint:t,bool:t,func:t,number:t,object:t,string:t,symbol:t,any:t,arrayOf:e,element:t,elementType:t,instanceOf:e,node:t,objectOf:e,oneOf:e,oneOfType:e,shape:e,exact:e,checkPropTypes:Vw,resetWarningCache:Ww};return r.PropTypes=r,r};Gw.exports=dI();var hI=Gw.exports;const he=zc(hI);function fI(){this.__data__=[],this.size=0}function Za(t,e){return t===e||t!==t&&e!==e}function pu(t,e){for(var r=t.length;r--;)if(Za(t[r][0],e))return r;return-1}var pI=Array.prototype,gI=pI.splice;function mI(t){var e=this.__data__,r=pu(e,t);if(r<0)return!1;var n=e.length-1;return r==n?e.pop():gI.call(e,r,1),--this.size,!0}function vI(t){var e=this.__data__,r=pu(e,t);return r<0?void 0:e[r][1]}function yI(t){return pu(this.__data__,t)>-1}function bI(t,e){var r=this.__data__,n=pu(r,t);return n<0?(++this.size,r.push([t,e])):r[n][1]=e,this}function jn(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}jn.prototype.clear=fI;jn.prototype.delete=mI;jn.prototype.get=vI;jn.prototype.has=yI;jn.prototype.set=bI;function xI(){this.__data__=new jn,this.size=0}function wI(t){var e=this.__data__,r=e.delete(t);return this.size=e.size,r}function _I(t){return this.__data__.get(t)}function SI(t){return this.__data__.has(t)}var qw=typeof global=="object"&&global&&global.Object===Object&&global,kI=typeof self=="object"&&self&&self.Object===Object&&self,Hr=qw||kI||Function("return this")(),ei=Hr.Symbol,Kw=Object.prototype,jI=Kw.hasOwnProperty,EI=Kw.toString,Hs=ei?ei.toStringTag:void 0;function CI(t){var e=jI.call(t,Hs),r=t[Hs];try{t[Hs]=void 0;var n=!0}catch{}var i=EI.call(t);return n&&(e?t[Hs]=r:delete t[Hs]),i}var TI=Object.prototype,NI=TI.toString;function OI(t){return NI.call(t)}var RI="[object Null]",AI="[object Undefined]",P0=ei?ei.toStringTag:void 0;function Vi(t){return t==null?t===void 0?AI:RI:P0&&P0 in Object(t)?CI(t):OI(t)}function Er(t){var e=typeof t;return t!=null&&(e=="object"||e=="function")}var PI="[object AsyncFunction]",$I="[object Function]",II="[object GeneratorFunction]",MI="[object Proxy]";function yp(t){if(!Er(t))return!1;var e=Vi(t);return e==$I||e==II||e==PI||e==MI}var pd=Hr["__core-js_shared__"],$0=function(){var t=/[^.]+$/.exec(pd&&pd.keys&&pd.keys.IE_PROTO||"");return t?"Symbol(src)_1."+t:""}();function DI(t){return!!$0&&$0 in t}var LI=Function.prototype,zI=LI.toString;function qi(t){if(t!=null){try{return zI.call(t)}catch{}try{return t+""}catch{}}return""}var FI=/[\\^$.*+?()[\]{}|]/g,BI=/^\[object .+?Constructor\]$/,UI=Function.prototype,HI=Object.prototype,GI=UI.toString,WI=HI.hasOwnProperty,VI=RegExp("^"+GI.call(WI).replace(FI,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");function qI(t){if(!Er(t)||DI(t))return!1;var e=yp(t)?VI:BI;return e.test(qi(t))}function KI(t,e){return t==null?void 0:t[e]}function Ki(t,e){var r=KI(t,e);return qI(r)?r:void 0}var Ia=Ki(Hr,"Map"),Ma=Ki(Object,"create");function YI(){this.__data__=Ma?Ma(null):{},this.size=0}function XI(t){var e=this.has(t)&&delete this.__data__[t];return this.size-=e?1:0,e}var ZI="__lodash_hash_undefined__",JI=Object.prototype,QI=JI.hasOwnProperty;function e8(t){var e=this.__data__;if(Ma){var r=e[t];return r===ZI?void 0:r}return QI.call(e,t)?e[t]:void 0}var t8=Object.prototype,r8=t8.hasOwnProperty;function n8(t){var e=this.__data__;return Ma?e[t]!==void 0:r8.call(e,t)}var i8="__lodash_hash_undefined__";function o8(t,e){var r=this.__data__;return this.size+=this.has(t)?0:1,r[t]=Ma&&e===void 0?i8:e,this}function Bi(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}Bi.prototype.clear=YI;Bi.prototype.delete=XI;Bi.prototype.get=e8;Bi.prototype.has=n8;Bi.prototype.set=o8;function s8(){this.size=0,this.__data__={hash:new Bi,map:new(Ia||jn),string:new Bi}}function a8(t){var e=typeof t;return e=="string"||e=="number"||e=="symbol"||e=="boolean"?t!=="__proto__":t===null}function gu(t,e){var r=t.__data__;return a8(e)?r[typeof e=="string"?"string":"hash"]:r.map}function l8(t){var e=gu(this,t).delete(t);return this.size-=e?1:0,e}function c8(t){return gu(this,t).get(t)}function u8(t){return gu(this,t).has(t)}function d8(t,e){var r=gu(this,t),n=r.size;return r.set(t,e),this.size+=r.size==n?0:1,this}function En(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}En.prototype.clear=s8;En.prototype.delete=l8;En.prototype.get=c8;En.prototype.has=u8;En.prototype.set=d8;var h8=200;function f8(t,e){var r=this.__data__;if(r instanceof jn){var n=r.__data__;if(!Ia||n.length<h8-1)return n.push([t,e]),this.size=++r.size,this;r=this.__data__=new En(n)}return r.set(t,e),this.size=r.size,this}function en(t){var e=this.__data__=new jn(t);this.size=e.size}en.prototype.clear=xI;en.prototype.delete=wI;en.prototype.get=_I;en.prototype.has=SI;en.prototype.set=f8;var Ac=function(){try{var t=Ki(Object,"defineProperty");return t({},"",{}),t}catch{}}();function bp(t,e,r){e=="__proto__"&&Ac?Ac(t,e,{configurable:!0,enumerable:!0,value:r,writable:!0}):t[e]=r}function zh(t,e,r){(r!==void 0&&!Za(t[e],r)||r===void 0&&!(e in t))&&bp(t,e,r)}function p8(t){return function(e,r,n){for(var i=-1,o=Object(e),s=n(e),a=s.length;a--;){var l=s[++i];if(r(o[l],l,o)===!1)break}return e}}var Yw=p8(),Xw=typeof hr=="object"&&hr&&!hr.nodeType&&hr,I0=Xw&&typeof fr=="object"&&fr&&!fr.nodeType&&fr,g8=I0&&I0.exports===Xw,M0=g8?Hr.Buffer:void 0;M0&&M0.allocUnsafe;function m8(t,e){return t.slice()}var Pc=Hr.Uint8Array;function v8(t){var e=new t.constructor(t.byteLength);return new Pc(e).set(new Pc(t)),e}function y8(t,e){var r=v8(t.buffer);return new t.constructor(r,t.byteOffset,t.length)}function b8(t,e){var r=-1,n=t.length;for(e||(e=Array(n));++r<n;)e[r]=t[r];return e}var D0=Object.create,x8=function(){function t(){}return function(e){if(!Er(e))return{};if(D0)return D0(e);t.prototype=e;var r=new t;return t.prototype=void 0,r}}();function Zw(t,e){return function(r){return t(e(r))}}var Jw=Zw(Object.getPrototypeOf,Object),w8=Object.prototype;function xp(t){var e=t&&t.constructor,r=typeof e=="function"&&e.prototype||w8;return t===r}function _8(t){return typeof t.constructor=="function"&&!xp(t)?x8(Jw(t)):{}}function ti(t){return t!=null&&typeof t=="object"}var S8="[object Arguments]";function L0(t){return ti(t)&&Vi(t)==S8}var Qw=Object.prototype,k8=Qw.hasOwnProperty,j8=Qw.propertyIsEnumerable,$c=L0(function(){return arguments}())?L0:function(t){return ti(t)&&k8.call(t,"callee")&&!j8.call(t,"callee")},mr=Array.isArray,E8=9007199254740991;function wp(t){return typeof t=="number"&&t>-1&&t%1==0&&t<=E8}function ws(t){return t!=null&&wp(t.length)&&!yp(t)}function C8(t){return ti(t)&&ws(t)}function T8(){return!1}var e1=typeof hr=="object"&&hr&&!hr.nodeType&&hr,z0=e1&&typeof fr=="object"&&fr&&!fr.nodeType&&fr,N8=z0&&z0.exports===e1,F0=N8?Hr.Buffer:void 0,O8=F0?F0.isBuffer:void 0,Ic=O8||T8,R8="[object Object]",A8=Function.prototype,P8=Object.prototype,t1=A8.toString,$8=P8.hasOwnProperty,I8=t1.call(Object);function M8(t){if(!ti(t)||Vi(t)!=R8)return!1;var e=Jw(t);if(e===null)return!0;var r=$8.call(e,"constructor")&&e.constructor;return typeof r=="function"&&r instanceof r&&t1.call(r)==I8}var D8="[object Arguments]",L8="[object Array]",z8="[object Boolean]",F8="[object Date]",B8="[object Error]",U8="[object Function]",H8="[object Map]",G8="[object Number]",W8="[object Object]",V8="[object RegExp]",q8="[object Set]",K8="[object String]",Y8="[object WeakMap]",X8="[object ArrayBuffer]",Z8="[object DataView]",J8="[object Float32Array]",Q8="[object Float64Array]",eM="[object Int8Array]",tM="[object Int16Array]",rM="[object Int32Array]",nM="[object Uint8Array]",iM="[object Uint8ClampedArray]",oM="[object Uint16Array]",sM="[object Uint32Array]",at={};at[J8]=at[Q8]=at[eM]=at[tM]=at[rM]=at[nM]=at[iM]=at[oM]=at[sM]=!0;at[D8]=at[L8]=at[X8]=at[z8]=at[Z8]=at[F8]=at[B8]=at[U8]=at[H8]=at[G8]=at[W8]=at[V8]=at[q8]=at[K8]=at[Y8]=!1;function aM(t){return ti(t)&&wp(t.length)&&!!at[Vi(t)]}function lM(t){return function(e){return t(e)}}var r1=typeof hr=="object"&&hr&&!hr.nodeType&&hr,pa=r1&&typeof fr=="object"&&fr&&!fr.nodeType&&fr,cM=pa&&pa.exports===r1,gd=cM&&qw.process,B0=function(){try{var t=pa&&pa.require&&pa.require("util").types;return t||gd&&gd.binding&&gd.binding("util")}catch{}}(),U0=B0&&B0.isTypedArray,_p=U0?lM(U0):aM;function Fh(t,e){if(!(e==="constructor"&&typeof t[e]=="function")&&e!="__proto__")return t[e]}var uM=Object.prototype,dM=uM.hasOwnProperty;function hM(t,e,r){var n=t[e];(!(dM.call(t,e)&&Za(n,r))||r===void 0&&!(e in t))&&bp(t,e,r)}function fM(t,e,r,n){var i=!r;r||(r={});for(var o=-1,s=e.length;++o<s;){var a=e[o],l=void 0;l===void 0&&(l=t[a]),i?bp(r,a,l):hM(r,a,l)}return r}function pM(t,e){for(var r=-1,n=Array(t);++r<t;)n[r]=e(r);return n}var gM=9007199254740991,mM=/^(?:0|[1-9]\d*)$/;function Sp(t,e){var r=typeof t;return e=e??gM,!!e&&(r=="number"||r!="symbol"&&mM.test(t))&&t>-1&&t%1==0&&t<e}var vM=Object.prototype,yM=vM.hasOwnProperty;function n1(t,e){var r=mr(t),n=!r&&$c(t),i=!r&&!n&&Ic(t),o=!r&&!n&&!i&&_p(t),s=r||n||i||o,a=s?pM(t.length,String):[],l=a.length;for(var u in t)(e||yM.call(t,u))&&!(s&&(u=="length"||i&&(u=="offset"||u=="parent")||o&&(u=="buffer"||u=="byteLength"||u=="byteOffset")||Sp(u,l)))&&a.push(u);return a}function bM(t){var e=[];if(t!=null)for(var r in Object(t))e.push(r);return e}var xM=Object.prototype,wM=xM.hasOwnProperty;function _M(t){if(!Er(t))return bM(t);var e=xp(t),r=[];for(var n in t)n=="constructor"&&(e||!wM.call(t,n))||r.push(n);return r}function i1(t){return ws(t)?n1(t,!0):_M(t)}function SM(t){return fM(t,i1(t))}function kM(t,e,r,n,i,o,s){var a=Fh(t,r),l=Fh(e,r),u=s.get(l);if(u){zh(t,r,u);return}var d=o?o(a,l,r+"",t,e,s):void 0,h=d===void 0;if(h){var f=mr(l),p=!f&&Ic(l),v=!f&&!p&&_p(l);d=l,f||p||v?mr(a)?d=a:C8(a)?d=b8(a):p?(h=!1,d=m8(l)):v?(h=!1,d=y8(l)):d=[]:M8(l)||$c(l)?(d=a,$c(a)?d=SM(a):(!Er(a)||yp(a))&&(d=_8(l))):h=!1}h&&(s.set(l,d),i(d,l,n,o,s),s.delete(l)),zh(t,r,d)}function o1(t,e,r,n,i){t!==e&&Yw(e,function(o,s){if(i||(i=new en),Er(o))kM(t,e,s,r,o1,n,i);else{var a=n?n(Fh(t,s),o,s+"",t,e,i):void 0;a===void 0&&(a=o),zh(t,s,a)}},i1)}function mu(t){return t}function jM(t,e,r){switch(r.length){case 0:return t.call(e);case 1:return t.call(e,r[0]);case 2:return t.call(e,r[0],r[1]);case 3:return t.call(e,r[0],r[1],r[2])}return t.apply(e,r)}var H0=Math.max;function EM(t,e,r){return e=H0(e===void 0?t.length-1:e,0),function(){for(var n=arguments,i=-1,o=H0(n.length-e,0),s=Array(o);++i<o;)s[i]=n[e+i];i=-1;for(var a=Array(e+1);++i<e;)a[i]=n[i];return a[e]=r(s),jM(t,this,a)}}function CM(t){return function(){return t}}var TM=Ac?function(t,e){return Ac(t,"toString",{configurable:!0,enumerable:!1,value:CM(e),writable:!0})}:mu,NM=800,OM=16,RM=Date.now;function AM(t){var e=0,r=0;return function(){var n=RM(),i=OM-(n-r);if(r=n,i>0){if(++e>=NM)return arguments[0]}else e=0;return t.apply(void 0,arguments)}}var PM=AM(TM);function $M(t,e){return PM(EM(t,e,mu),t+"")}function IM(t,e,r){if(!Er(r))return!1;var n=typeof e;return(n=="number"?ws(r)&&Sp(e,r.length):n=="string"&&e in r)?Za(r[e],t):!1}function MM(t){return $M(function(e,r){var n=-1,i=r.length,o=i>1?r[i-1]:void 0,s=i>2?r[2]:void 0;for(o=t.length>3&&typeof o=="function"?(i--,o):void 0,s&&IM(r[0],r[1],s)&&(o=i<3?void 0:o,i=1),e=Object(e);++n<i;){var a=r[n];a&&t(e,a,n,o)}return e})}var or=MM(function(t,e,r){o1(t,e,r)}),Ja=function(e){var r=e.zDepth,n=e.radius,i=e.background,o=e.children,s=e.styles,a=s===void 0?{}:s,l=Pe(or({default:{wrap:{position:"relative",display:"inline-block"},content:{position:"relative"},bg:{absolute:"0px 0px 0px 0px",boxShadow:"0 "+r+"px "+r*4+"px rgba(0,0,0,.24)",borderRadius:n,background:i}},"zDepth-0":{bg:{boxShadow:"none"}},"zDepth-1":{bg:{boxShadow:"0 2px 10px rgba(0,0,0,.12), 0 2px 5px rgba(0,0,0,.16)"}},"zDepth-2":{bg:{boxShadow:"0 6px 20px rgba(0,0,0,.19), 0 8px 17px rgba(0,0,0,.2)"}},"zDepth-3":{bg:{boxShadow:"0 17px 50px rgba(0,0,0,.19), 0 12px 15px rgba(0,0,0,.24)"}},"zDepth-4":{bg:{boxShadow:"0 25px 55px rgba(0,0,0,.21), 0 16px 28px rgba(0,0,0,.22)"}},"zDepth-5":{bg:{boxShadow:"0 40px 77px rgba(0,0,0,.22), 0 27px 24px rgba(0,0,0,.2)"}},square:{bg:{borderRadius:"0"}},circle:{bg:{borderRadius:"50%"}}},a),{"zDepth-1":r===1});return P.createElement("div",{style:l.wrap},P.createElement("div",{style:l.bg}),P.createElement("div",{style:l.content},o))};Ja.propTypes={background:he.string,zDepth:he.oneOf([0,1,2,3,4,5]),radius:he.number,styles:he.object};Ja.defaultProps={background:"#fff",zDepth:1,radius:2,styles:{}};var md=function(){return Hr.Date.now()},DM=/\s/;function LM(t){for(var e=t.length;e--&&DM.test(t.charAt(e)););return e}var zM=/^\s+/;function FM(t){return t&&t.slice(0,LM(t)+1).replace(zM,"")}var BM="[object Symbol]";function vu(t){return typeof t=="symbol"||ti(t)&&Vi(t)==BM}var G0=NaN,UM=/^[-+]0x[0-9a-f]+$/i,HM=/^0b[01]+$/i,GM=/^0o[0-7]+$/i,WM=parseInt;function W0(t){if(typeof t=="number")return t;if(vu(t))return G0;if(Er(t)){var e=typeof t.valueOf=="function"?t.valueOf():t;t=Er(e)?e+"":e}if(typeof t!="string")return t===0?t:+t;t=FM(t);var r=HM.test(t);return r||GM.test(t)?WM(t.slice(2),r?2:8):UM.test(t)?G0:+t}var VM="Expected a function",qM=Math.max,KM=Math.min;function s1(t,e,r){var n,i,o,s,a,l,u=0,d=!1,h=!1,f=!0;if(typeof t!="function")throw new TypeError(VM);e=W0(e)||0,Er(r)&&(d=!!r.leading,h="maxWait"in r,o=h?qM(W0(r.maxWait)||0,e):o,f="trailing"in r?!!r.trailing:f);function p(S){var C=n,N=i;return n=i=void 0,u=S,s=t.apply(N,C),s}function v(S){return u=S,a=setTimeout(m,e),d?p(S):s}function g(S){var C=S-l,N=S-u,E=e-C;return h?KM(E,o-N):E}function b(S){var C=S-l,N=S-u;return l===void 0||C>=e||C<0||h&&N>=o}function m(){var S=md();if(b(S))return y(S);a=setTimeout(m,g(S))}function y(S){return a=void 0,f&&n?p(S):(n=i=void 0,s)}function x(){a!==void 0&&clearTimeout(a),u=0,n=l=i=a=void 0}function w(){return a===void 0?s:y(md())}function j(){var S=md(),C=b(S);if(n=arguments,i=this,l=S,C){if(a===void 0)return v(l);if(h)return clearTimeout(a),a=setTimeout(m,e),p(l)}return a===void 0&&(a=setTimeout(m,e)),s}return j.cancel=x,j.flush=w,j}var YM="Expected a function";function XM(t,e,r){var n=!0,i=!0;if(typeof t!="function")throw new TypeError(YM);return Er(r)&&(n="leading"in r?!!r.leading:n,i="trailing"in r?!!r.trailing:i),s1(t,e,{leading:n,maxWait:e,trailing:i})}var ZM=function(e,r,n){var i=n.getBoundingClientRect(),o=i.width,s=i.height,a=typeof e.pageX=="number"?e.pageX:e.touches[0].pageX,l=typeof e.pageY=="number"?e.pageY:e.touches[0].pageY,u=a-(n.getBoundingClientRect().left+window.pageXOffset),d=l-(n.getBoundingClientRect().top+window.pageYOffset);u<0?u=0:u>o&&(u=o),d<0?d=0:d>s&&(d=s);var h=u/o,f=1-d/s;return{h:r.h,s:h,v:f,a:r.a,source:"hsv"}},JM=function(){function t(e,r){for(var n=0;n<r.length;n++){var i=r[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}();function QM(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function eD(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e&&(typeof e=="object"||typeof e=="function")?e:t}function tD(t,e){if(typeof e!="function"&&e!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}var yu=function(t){tD(e,t);function e(r){QM(this,e);var n=eD(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,r));return n.handleChange=function(i){typeof n.props.onChange=="function"&&n.throttle(n.props.onChange,ZM(i,n.props.hsl,n.container),i)},n.handleMouseDown=function(i){n.handleChange(i);var o=n.getContainerRenderWindow();o.addEventListener("mousemove",n.handleChange),o.addEventListener("mouseup",n.handleMouseUp)},n.handleMouseUp=function(){n.unbindEventListeners()},n.throttle=XM(function(i,o,s){i(o,s)},50),n}return JM(e,[{key:"componentWillUnmount",value:function(){this.throttle.cancel(),this.unbindEventListeners()}},{key:"getContainerRenderWindow",value:function(){for(var n=this.container,i=window;!i.document.contains(n)&&i.parent!==i;)i=i.parent;return i}},{key:"unbindEventListeners",value:function(){var n=this.getContainerRenderWindow();n.removeEventListener("mousemove",this.handleChange),n.removeEventListener("mouseup",this.handleMouseUp)}},{key:"render",value:function(){var n=this,i=this.props.style||{},o=i.color,s=i.white,a=i.black,l=i.pointer,u=i.circle,d=Pe({default:{color:{absolute:"0px 0px 0px 0px",background:"hsl("+this.props.hsl.h+",100%, 50%)",borderRadius:this.props.radius},white:{absolute:"0px 0px 0px 0px",borderRadius:this.props.radius},black:{absolute:"0px 0px 0px 0px",boxShadow:this.props.shadow,borderRadius:this.props.radius},pointer:{position:"absolute",top:-(this.props.hsv.v*100)+100+"%",left:this.props.hsv.s*100+"%",cursor:"default"},circle:{width:"4px",height:"4px",boxShadow:`0 0 0 1.5px #fff, inset 0 0 1px 1px rgba(0,0,0,.3),
            0 0 1px 2px rgba(0,0,0,.4)`,borderRadius:"50%",cursor:"hand",transform:"translate(-2px, -2px)"}},custom:{color:o,white:s,black:a,pointer:l,circle:u}},{custom:!!this.props.style});return P.createElement("div",{style:d.color,ref:function(f){return n.container=f},onMouseDown:this.handleMouseDown,onTouchMove:this.handleChange,onTouchStart:this.handleChange},P.createElement("style",null,`
          .saturation-white {
            background: -webkit-linear-gradient(to right, #fff, rgba(255,255,255,0));
            background: linear-gradient(to right, #fff, rgba(255,255,255,0));
          }
          .saturation-black {
            background: -webkit-linear-gradient(to top, #000, rgba(0,0,0,0));
            background: linear-gradient(to top, #000, rgba(0,0,0,0));
          }
        `),P.createElement("div",{style:d.white,className:"saturation-white"},P.createElement("div",{style:d.black,className:"saturation-black"}),P.createElement("div",{style:d.pointer},this.props.pointer?P.createElement(this.props.pointer,this.props):P.createElement("div",{style:d.circle}))))}}]),e}($.PureComponent||$.Component);function rD(t,e){for(var r=-1,n=t==null?0:t.length;++r<n&&e(t[r],r,t)!==!1;);return t}var nD=Zw(Object.keys,Object),iD=Object.prototype,oD=iD.hasOwnProperty;function sD(t){if(!xp(t))return nD(t);var e=[];for(var r in Object(t))oD.call(t,r)&&r!="constructor"&&e.push(r);return e}function kp(t){return ws(t)?n1(t):sD(t)}function aD(t,e){return t&&Yw(t,e,kp)}function lD(t,e){return function(r,n){if(r==null)return r;if(!ws(r))return t(r,n);for(var i=r.length,o=-1,s=Object(r);++o<i&&n(s[o],o,s)!==!1;);return r}}var a1=lD(aD);function cD(t){return typeof t=="function"?t:mu}function uD(t,e){var r=mr(t)?rD:a1;return r(t,cD(e))}function Mc(t){"@babel/helpers - typeof";return Mc=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},Mc(t)}var dD=/^\s+/,hD=/\s+$/;function _e(t,e){if(t=t||"",e=e||{},t instanceof _e)return t;if(!(this instanceof _e))return new _e(t,e);var r=fD(t);this._originalInput=t,this._r=r.r,this._g=r.g,this._b=r.b,this._a=r.a,this._roundA=Math.round(100*this._a)/100,this._format=e.format||r.format,this._gradientType=e.gradientType,this._r<1&&(this._r=Math.round(this._r)),this._g<1&&(this._g=Math.round(this._g)),this._b<1&&(this._b=Math.round(this._b)),this._ok=r.ok}_e.prototype={isDark:function(){return this.getBrightness()<128},isLight:function(){return!this.isDark()},isValid:function(){return this._ok},getOriginalInput:function(){return this._originalInput},getFormat:function(){return this._format},getAlpha:function(){return this._a},getBrightness:function(){var e=this.toRgb();return(e.r*299+e.g*587+e.b*114)/1e3},getLuminance:function(){var e=this.toRgb(),r,n,i,o,s,a;return r=e.r/255,n=e.g/255,i=e.b/255,r<=.03928?o=r/12.92:o=Math.pow((r+.055)/1.055,2.4),n<=.03928?s=n/12.92:s=Math.pow((n+.055)/1.055,2.4),i<=.03928?a=i/12.92:a=Math.pow((i+.055)/1.055,2.4),.2126*o+.7152*s+.0722*a},setAlpha:function(e){return this._a=l1(e),this._roundA=Math.round(100*this._a)/100,this},toHsv:function(){var e=q0(this._r,this._g,this._b);return{h:e.h*360,s:e.s,v:e.v,a:this._a}},toHsvString:function(){var e=q0(this._r,this._g,this._b),r=Math.round(e.h*360),n=Math.round(e.s*100),i=Math.round(e.v*100);return this._a==1?"hsv("+r+", "+n+"%, "+i+"%)":"hsva("+r+", "+n+"%, "+i+"%, "+this._roundA+")"},toHsl:function(){var e=V0(this._r,this._g,this._b);return{h:e.h*360,s:e.s,l:e.l,a:this._a}},toHslString:function(){var e=V0(this._r,this._g,this._b),r=Math.round(e.h*360),n=Math.round(e.s*100),i=Math.round(e.l*100);return this._a==1?"hsl("+r+", "+n+"%, "+i+"%)":"hsla("+r+", "+n+"%, "+i+"%, "+this._roundA+")"},toHex:function(e){return K0(this._r,this._g,this._b,e)},toHexString:function(e){return"#"+this.toHex(e)},toHex8:function(e){return vD(this._r,this._g,this._b,this._a,e)},toHex8String:function(e){return"#"+this.toHex8(e)},toRgb:function(){return{r:Math.round(this._r),g:Math.round(this._g),b:Math.round(this._b),a:this._a}},toRgbString:function(){return this._a==1?"rgb("+Math.round(this._r)+", "+Math.round(this._g)+", "+Math.round(this._b)+")":"rgba("+Math.round(this._r)+", "+Math.round(this._g)+", "+Math.round(this._b)+", "+this._roundA+")"},toPercentageRgb:function(){return{r:Math.round(ft(this._r,255)*100)+"%",g:Math.round(ft(this._g,255)*100)+"%",b:Math.round(ft(this._b,255)*100)+"%",a:this._a}},toPercentageRgbString:function(){return this._a==1?"rgb("+Math.round(ft(this._r,255)*100)+"%, "+Math.round(ft(this._g,255)*100)+"%, "+Math.round(ft(this._b,255)*100)+"%)":"rgba("+Math.round(ft(this._r,255)*100)+"%, "+Math.round(ft(this._g,255)*100)+"%, "+Math.round(ft(this._b,255)*100)+"%, "+this._roundA+")"},toName:function(){return this._a===0?"transparent":this._a<1?!1:ND[K0(this._r,this._g,this._b,!0)]||!1},toFilter:function(e){var r="#"+Y0(this._r,this._g,this._b,this._a),n=r,i=this._gradientType?"GradientType = 1, ":"";if(e){var o=_e(e);n="#"+Y0(o._r,o._g,o._b,o._a)}return"progid:DXImageTransform.Microsoft.gradient("+i+"startColorstr="+r+",endColorstr="+n+")"},toString:function(e){var r=!!e;e=e||this._format;var n=!1,i=this._a<1&&this._a>=0,o=!r&&i&&(e==="hex"||e==="hex6"||e==="hex3"||e==="hex4"||e==="hex8"||e==="name");return o?e==="name"&&this._a===0?this.toName():this.toRgbString():(e==="rgb"&&(n=this.toRgbString()),e==="prgb"&&(n=this.toPercentageRgbString()),(e==="hex"||e==="hex6")&&(n=this.toHexString()),e==="hex3"&&(n=this.toHexString(!0)),e==="hex4"&&(n=this.toHex8String(!0)),e==="hex8"&&(n=this.toHex8String()),e==="name"&&(n=this.toName()),e==="hsl"&&(n=this.toHslString()),e==="hsv"&&(n=this.toHsvString()),n||this.toHexString())},clone:function(){return _e(this.toString())},_applyModification:function(e,r){var n=e.apply(null,[this].concat([].slice.call(r)));return this._r=n._r,this._g=n._g,this._b=n._b,this.setAlpha(n._a),this},lighten:function(){return this._applyModification(wD,arguments)},brighten:function(){return this._applyModification(_D,arguments)},darken:function(){return this._applyModification(SD,arguments)},desaturate:function(){return this._applyModification(yD,arguments)},saturate:function(){return this._applyModification(bD,arguments)},greyscale:function(){return this._applyModification(xD,arguments)},spin:function(){return this._applyModification(kD,arguments)},_applyCombination:function(e,r){return e.apply(null,[this].concat([].slice.call(r)))},analogous:function(){return this._applyCombination(CD,arguments)},complement:function(){return this._applyCombination(jD,arguments)},monochromatic:function(){return this._applyCombination(TD,arguments)},splitcomplement:function(){return this._applyCombination(ED,arguments)},triad:function(){return this._applyCombination(X0,[3])},tetrad:function(){return this._applyCombination(X0,[4])}};_e.fromRatio=function(t,e){if(Mc(t)=="object"){var r={};for(var n in t)t.hasOwnProperty(n)&&(n==="a"?r[n]=t[n]:r[n]=Qs(t[n]));t=r}return _e(t,e)};function fD(t){var e={r:0,g:0,b:0},r=1,n=null,i=null,o=null,s=!1,a=!1;return typeof t=="string"&&(t=PD(t)),Mc(t)=="object"&&(un(t.r)&&un(t.g)&&un(t.b)?(e=pD(t.r,t.g,t.b),s=!0,a=String(t.r).substr(-1)==="%"?"prgb":"rgb"):un(t.h)&&un(t.s)&&un(t.v)?(n=Qs(t.s),i=Qs(t.v),e=mD(t.h,n,i),s=!0,a="hsv"):un(t.h)&&un(t.s)&&un(t.l)&&(n=Qs(t.s),o=Qs(t.l),e=gD(t.h,n,o),s=!0,a="hsl"),t.hasOwnProperty("a")&&(r=t.a)),r=l1(r),{ok:s,format:t.format||a,r:Math.min(255,Math.max(e.r,0)),g:Math.min(255,Math.max(e.g,0)),b:Math.min(255,Math.max(e.b,0)),a:r}}function pD(t,e,r){return{r:ft(t,255)*255,g:ft(e,255)*255,b:ft(r,255)*255}}function V0(t,e,r){t=ft(t,255),e=ft(e,255),r=ft(r,255);var n=Math.max(t,e,r),i=Math.min(t,e,r),o,s,a=(n+i)/2;if(n==i)o=s=0;else{var l=n-i;switch(s=a>.5?l/(2-n-i):l/(n+i),n){case t:o=(e-r)/l+(e<r?6:0);break;case e:o=(r-t)/l+2;break;case r:o=(t-e)/l+4;break}o/=6}return{h:o,s,l:a}}function gD(t,e,r){var n,i,o;t=ft(t,360),e=ft(e,100),r=ft(r,100);function s(u,d,h){return h<0&&(h+=1),h>1&&(h-=1),h<1/6?u+(d-u)*6*h:h<1/2?d:h<2/3?u+(d-u)*(2/3-h)*6:u}if(e===0)n=i=o=r;else{var a=r<.5?r*(1+e):r+e-r*e,l=2*r-a;n=s(l,a,t+1/3),i=s(l,a,t),o=s(l,a,t-1/3)}return{r:n*255,g:i*255,b:o*255}}function q0(t,e,r){t=ft(t,255),e=ft(e,255),r=ft(r,255);var n=Math.max(t,e,r),i=Math.min(t,e,r),o,s,a=n,l=n-i;if(s=n===0?0:l/n,n==i)o=0;else{switch(n){case t:o=(e-r)/l+(e<r?6:0);break;case e:o=(r-t)/l+2;break;case r:o=(t-e)/l+4;break}o/=6}return{h:o,s,v:a}}function mD(t,e,r){t=ft(t,360)*6,e=ft(e,100),r=ft(r,100);var n=Math.floor(t),i=t-n,o=r*(1-e),s=r*(1-i*e),a=r*(1-(1-i)*e),l=n%6,u=[r,s,o,o,a,r][l],d=[a,r,r,s,o,o][l],h=[o,o,a,r,r,s][l];return{r:u*255,g:d*255,b:h*255}}function K0(t,e,r,n){var i=[Lr(Math.round(t).toString(16)),Lr(Math.round(e).toString(16)),Lr(Math.round(r).toString(16))];return n&&i[0].charAt(0)==i[0].charAt(1)&&i[1].charAt(0)==i[1].charAt(1)&&i[2].charAt(0)==i[2].charAt(1)?i[0].charAt(0)+i[1].charAt(0)+i[2].charAt(0):i.join("")}function vD(t,e,r,n,i){var o=[Lr(Math.round(t).toString(16)),Lr(Math.round(e).toString(16)),Lr(Math.round(r).toString(16)),Lr(c1(n))];return i&&o[0].charAt(0)==o[0].charAt(1)&&o[1].charAt(0)==o[1].charAt(1)&&o[2].charAt(0)==o[2].charAt(1)&&o[3].charAt(0)==o[3].charAt(1)?o[0].charAt(0)+o[1].charAt(0)+o[2].charAt(0)+o[3].charAt(0):o.join("")}function Y0(t,e,r,n){var i=[Lr(c1(n)),Lr(Math.round(t).toString(16)),Lr(Math.round(e).toString(16)),Lr(Math.round(r).toString(16))];return i.join("")}_e.equals=function(t,e){return!t||!e?!1:_e(t).toRgbString()==_e(e).toRgbString()};_e.random=function(){return _e.fromRatio({r:Math.random(),g:Math.random(),b:Math.random()})};function yD(t,e){e=e===0?0:e||10;var r=_e(t).toHsl();return r.s-=e/100,r.s=bu(r.s),_e(r)}function bD(t,e){e=e===0?0:e||10;var r=_e(t).toHsl();return r.s+=e/100,r.s=bu(r.s),_e(r)}function xD(t){return _e(t).desaturate(100)}function wD(t,e){e=e===0?0:e||10;var r=_e(t).toHsl();return r.l+=e/100,r.l=bu(r.l),_e(r)}function _D(t,e){e=e===0?0:e||10;var r=_e(t).toRgb();return r.r=Math.max(0,Math.min(255,r.r-Math.round(255*-(e/100)))),r.g=Math.max(0,Math.min(255,r.g-Math.round(255*-(e/100)))),r.b=Math.max(0,Math.min(255,r.b-Math.round(255*-(e/100)))),_e(r)}function SD(t,e){e=e===0?0:e||10;var r=_e(t).toHsl();return r.l-=e/100,r.l=bu(r.l),_e(r)}function kD(t,e){var r=_e(t).toHsl(),n=(r.h+e)%360;return r.h=n<0?360+n:n,_e(r)}function jD(t){var e=_e(t).toHsl();return e.h=(e.h+180)%360,_e(e)}function X0(t,e){if(isNaN(e)||e<=0)throw new Error("Argument to polyad must be a positive number");for(var r=_e(t).toHsl(),n=[_e(t)],i=360/e,o=1;o<e;o++)n.push(_e({h:(r.h+o*i)%360,s:r.s,l:r.l}));return n}function ED(t){var e=_e(t).toHsl(),r=e.h;return[_e(t),_e({h:(r+72)%360,s:e.s,l:e.l}),_e({h:(r+216)%360,s:e.s,l:e.l})]}function CD(t,e,r){e=e||6,r=r||30;var n=_e(t).toHsl(),i=360/r,o=[_e(t)];for(n.h=(n.h-(i*e>>1)+720)%360;--e;)n.h=(n.h+i)%360,o.push(_e(n));return o}function TD(t,e){e=e||6;for(var r=_e(t).toHsv(),n=r.h,i=r.s,o=r.v,s=[],a=1/e;e--;)s.push(_e({h:n,s:i,v:o})),o=(o+a)%1;return s}_e.mix=function(t,e,r){r=r===0?0:r||50;var n=_e(t).toRgb(),i=_e(e).toRgb(),o=r/100,s={r:(i.r-n.r)*o+n.r,g:(i.g-n.g)*o+n.g,b:(i.b-n.b)*o+n.b,a:(i.a-n.a)*o+n.a};return _e(s)};_e.readability=function(t,e){var r=_e(t),n=_e(e);return(Math.max(r.getLuminance(),n.getLuminance())+.05)/(Math.min(r.getLuminance(),n.getLuminance())+.05)};_e.isReadable=function(t,e,r){var n=_e.readability(t,e),i,o;switch(o=!1,i=$D(r),i.level+i.size){case"AAsmall":case"AAAlarge":o=n>=4.5;break;case"AAlarge":o=n>=3;break;case"AAAsmall":o=n>=7;break}return o};_e.mostReadable=function(t,e,r){var n=null,i=0,o,s,a,l;r=r||{},s=r.includeFallbackColors,a=r.level,l=r.size;for(var u=0;u<e.length;u++)o=_e.readability(t,e[u]),o>i&&(i=o,n=_e(e[u]));return _e.isReadable(t,n,{level:a,size:l})||!s?n:(r.includeFallbackColors=!1,_e.mostReadable(t,["#fff","#000"],r))};var Bh=_e.names={aliceblue:"f0f8ff",antiquewhite:"faebd7",aqua:"0ff",aquamarine:"7fffd4",azure:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"000",blanchedalmond:"ffebcd",blue:"00f",blueviolet:"8a2be2",brown:"a52a2a",burlywood:"deb887",burntsienna:"ea7e5d",cadetblue:"5f9ea0",chartreuse:"7fff00",chocolate:"d2691e",coral:"ff7f50",cornflowerblue:"6495ed",cornsilk:"fff8dc",crimson:"dc143c",cyan:"0ff",darkblue:"00008b",darkcyan:"008b8b",darkgoldenrod:"b8860b",darkgray:"a9a9a9",darkgreen:"006400",darkgrey:"a9a9a9",darkkhaki:"bdb76b",darkmagenta:"8b008b",darkolivegreen:"556b2f",darkorange:"ff8c00",darkorchid:"9932cc",darkred:"8b0000",darksalmon:"e9967a",darkseagreen:"8fbc8f",darkslateblue:"483d8b",darkslategray:"2f4f4f",darkslategrey:"2f4f4f",darkturquoise:"00ced1",darkviolet:"9400d3",deeppink:"ff1493",deepskyblue:"00bfff",dimgray:"696969",dimgrey:"696969",dodgerblue:"1e90ff",firebrick:"b22222",floralwhite:"fffaf0",forestgreen:"228b22",fuchsia:"f0f",gainsboro:"dcdcdc",ghostwhite:"f8f8ff",gold:"ffd700",goldenrod:"daa520",gray:"808080",green:"008000",greenyellow:"adff2f",grey:"808080",honeydew:"f0fff0",hotpink:"ff69b4",indianred:"cd5c5c",indigo:"4b0082",ivory:"fffff0",khaki:"f0e68c",lavender:"e6e6fa",lavenderblush:"fff0f5",lawngreen:"7cfc00",lemonchiffon:"fffacd",lightblue:"add8e6",lightcoral:"f08080",lightcyan:"e0ffff",lightgoldenrodyellow:"fafad2",lightgray:"d3d3d3",lightgreen:"90ee90",lightgrey:"d3d3d3",lightpink:"ffb6c1",lightsalmon:"ffa07a",lightseagreen:"20b2aa",lightskyblue:"87cefa",lightslategray:"789",lightslategrey:"789",lightsteelblue:"b0c4de",lightyellow:"ffffe0",lime:"0f0",limegreen:"32cd32",linen:"faf0e6",magenta:"f0f",maroon:"800000",mediumaquamarine:"66cdaa",mediumblue:"0000cd",mediumorchid:"ba55d3",mediumpurple:"9370db",mediumseagreen:"3cb371",mediumslateblue:"7b68ee",mediumspringgreen:"00fa9a",mediumturquoise:"48d1cc",mediumvioletred:"c71585",midnightblue:"191970",mintcream:"f5fffa",mistyrose:"ffe4e1",moccasin:"ffe4b5",navajowhite:"ffdead",navy:"000080",oldlace:"fdf5e6",olive:"808000",olivedrab:"6b8e23",orange:"ffa500",orangered:"ff4500",orchid:"da70d6",palegoldenrod:"eee8aa",palegreen:"98fb98",paleturquoise:"afeeee",palevioletred:"db7093",papayawhip:"ffefd5",peachpuff:"ffdab9",peru:"cd853f",pink:"ffc0cb",plum:"dda0dd",powderblue:"b0e0e6",purple:"800080",rebeccapurple:"663399",red:"f00",rosybrown:"bc8f8f",royalblue:"4169e1",saddlebrown:"8b4513",salmon:"fa8072",sandybrown:"f4a460",seagreen:"2e8b57",seashell:"fff5ee",sienna:"a0522d",silver:"c0c0c0",skyblue:"87ceeb",slateblue:"6a5acd",slategray:"708090",slategrey:"708090",snow:"fffafa",springgreen:"00ff7f",steelblue:"4682b4",tan:"d2b48c",teal:"008080",thistle:"d8bfd8",tomato:"ff6347",turquoise:"40e0d0",violet:"ee82ee",wheat:"f5deb3",white:"fff",whitesmoke:"f5f5f5",yellow:"ff0",yellowgreen:"9acd32"},ND=_e.hexNames=OD(Bh);function OD(t){var e={};for(var r in t)t.hasOwnProperty(r)&&(e[t[r]]=r);return e}function l1(t){return t=parseFloat(t),(isNaN(t)||t<0||t>1)&&(t=1),t}function ft(t,e){RD(t)&&(t="100%");var r=AD(t);return t=Math.min(e,Math.max(0,parseFloat(t))),r&&(t=parseInt(t*e,10)/100),Math.abs(t-e)<1e-6?1:t%e/parseFloat(e)}function bu(t){return Math.min(1,Math.max(0,t))}function ar(t){return parseInt(t,16)}function RD(t){return typeof t=="string"&&t.indexOf(".")!=-1&&parseFloat(t)===1}function AD(t){return typeof t=="string"&&t.indexOf("%")!=-1}function Lr(t){return t.length==1?"0"+t:""+t}function Qs(t){return t<=1&&(t=t*100+"%"),t}function c1(t){return Math.round(parseFloat(t)*255).toString(16)}function Z0(t){return ar(t)/255}var Ar=function(){var t="[-\\+]?\\d+%?",e="[-\\+]?\\d*\\.\\d+%?",r="(?:"+e+")|(?:"+t+")",n="[\\s|\\(]+("+r+")[,|\\s]+("+r+")[,|\\s]+("+r+")\\s*\\)?",i="[\\s|\\(]+("+r+")[,|\\s]+("+r+")[,|\\s]+("+r+")[,|\\s]+("+r+")\\s*\\)?";return{CSS_UNIT:new RegExp(r),rgb:new RegExp("rgb"+n),rgba:new RegExp("rgba"+i),hsl:new RegExp("hsl"+n),hsla:new RegExp("hsla"+i),hsv:new RegExp("hsv"+n),hsva:new RegExp("hsva"+i),hex3:/^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,hex6:/^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,hex4:/^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,hex8:/^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/}}();function un(t){return!!Ar.CSS_UNIT.exec(t)}function PD(t){t=t.replace(dD,"").replace(hD,"").toLowerCase();var e=!1;if(Bh[t])t=Bh[t],e=!0;else if(t=="transparent")return{r:0,g:0,b:0,a:0,format:"name"};var r;return(r=Ar.rgb.exec(t))?{r:r[1],g:r[2],b:r[3]}:(r=Ar.rgba.exec(t))?{r:r[1],g:r[2],b:r[3],a:r[4]}:(r=Ar.hsl.exec(t))?{h:r[1],s:r[2],l:r[3]}:(r=Ar.hsla.exec(t))?{h:r[1],s:r[2],l:r[3],a:r[4]}:(r=Ar.hsv.exec(t))?{h:r[1],s:r[2],v:r[3]}:(r=Ar.hsva.exec(t))?{h:r[1],s:r[2],v:r[3],a:r[4]}:(r=Ar.hex8.exec(t))?{r:ar(r[1]),g:ar(r[2]),b:ar(r[3]),a:Z0(r[4]),format:e?"name":"hex8"}:(r=Ar.hex6.exec(t))?{r:ar(r[1]),g:ar(r[2]),b:ar(r[3]),format:e?"name":"hex"}:(r=Ar.hex4.exec(t))?{r:ar(r[1]+""+r[1]),g:ar(r[2]+""+r[2]),b:ar(r[3]+""+r[3]),a:Z0(r[4]+""+r[4]),format:e?"name":"hex8"}:(r=Ar.hex3.exec(t))?{r:ar(r[1]+""+r[1]),g:ar(r[2]+""+r[2]),b:ar(r[3]+""+r[3]),format:e?"name":"hex"}:!1}function $D(t){var e,r;return t=t||{level:"AA",size:"small"},e=(t.level||"AA").toUpperCase(),r=(t.size||"small").toLowerCase(),e!=="AA"&&e!=="AAA"&&(e="AA"),r!=="small"&&r!=="large"&&(r="small"),{level:e,size:r}}var J0=function(e){var r=["r","g","b","a","h","s","l","v"],n=0,i=0;return uD(r,function(o){if(e[o]&&(n+=1,isNaN(e[o])||(i+=1),o==="s"||o==="l")){var s=/^\d+%$/;s.test(e[o])&&(i+=1)}}),n===i?e:!1},ea=function(e,r){var n=e.hex?_e(e.hex):_e(e),i=n.toHsl(),o=n.toHsv(),s=n.toRgb(),a=n.toHex();i.s===0&&(i.h=r||0,o.h=r||0);var l=a==="000000"&&s.a===0;return{hsl:i,hex:l?"transparent":"#"+a,rgb:s,hsv:o,oldHue:e.h||r||i.h,source:e.source}},si=function(e){if(e==="transparent")return!0;var r=String(e).charAt(0)==="#"?1:0;return e.length!==4+r&&e.length<7+r&&_e(e).isValid()},jp=function(e){if(!e)return"#fff";var r=ea(e);if(r.hex==="transparent")return"rgba(0,0,0,0.4)";var n=(r.rgb.r*299+r.rgb.g*587+r.rgb.b*114)/1e3;return n>=128?"#000":"#fff"},vd=function(e,r){var n=e.replace("°","");return _e(r+" ("+n+")")._ok},Gs=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},ID=function(){function t(e,r){for(var n=0;n<r.length;n++){var i=r[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}();function MD(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function DD(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e&&(typeof e=="object"||typeof e=="function")?e:t}function LD(t,e){if(typeof e!="function"&&e!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}var sr=function(e){var r=function(n){LD(i,n);function i(o){MD(this,i);var s=DD(this,(i.__proto__||Object.getPrototypeOf(i)).call(this));return s.handleChange=function(a,l){var u=J0(a);if(u){var d=ea(a,a.h||s.state.oldHue);s.setState(d),s.props.onChangeComplete&&s.debounce(s.props.onChangeComplete,d,l),s.props.onChange&&s.props.onChange(d,l)}},s.handleSwatchHover=function(a,l){var u=J0(a);if(u){var d=ea(a,a.h||s.state.oldHue);s.props.onSwatchHover&&s.props.onSwatchHover(d,l)}},s.state=Gs({},ea(o.color,0)),s.debounce=s1(function(a,l,u){a(l,u)},100),s}return ID(i,[{key:"render",value:function(){var s={};return this.props.onSwatchHover&&(s.onSwatchHover=this.handleSwatchHover),P.createElement(e,Gs({},this.props,this.state,{onChange:this.handleChange},s))}}],[{key:"getDerivedStateFromProps",value:function(s,a){return Gs({},ea(s.color,a.oldHue))}}]),i}($.PureComponent||$.Component);return r.propTypes=Gs({},e.propTypes),r.defaultProps=Gs({},e.defaultProps,{color:{h:250,s:.5,l:.2,a:1}}),r},zD=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},FD=function(){function t(e,r){for(var n=0;n<r.length;n++){var i=r[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}();function BD(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function Q0(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e&&(typeof e=="object"||typeof e=="function")?e:t}function UD(t,e){if(typeof e!="function"&&e!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}var HD=function(e){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"span";return function(n){UD(i,n);function i(){var o,s,a,l;BD(this,i);for(var u=arguments.length,d=Array(u),h=0;h<u;h++)d[h]=arguments[h];return l=(s=(a=Q0(this,(o=i.__proto__||Object.getPrototypeOf(i)).call.apply(o,[this].concat(d))),a),a.state={focus:!1},a.handleFocus=function(){return a.setState({focus:!0})},a.handleBlur=function(){return a.setState({focus:!1})},s),Q0(a,l)}return FD(i,[{key:"render",value:function(){return P.createElement(r,{onFocus:this.handleFocus,onBlur:this.handleBlur},P.createElement(e,zD({},this.props,this.state)))}}]),i}(P.Component)},ev=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},GD=13,WD=function(e){var r=e.color,n=e.style,i=e.onClick,o=i===void 0?function(){}:i,s=e.onHover,a=e.title,l=a===void 0?r:a,u=e.children,d=e.focus,h=e.focusStyle,f=h===void 0?{}:h,p=r==="transparent",v=Pe({default:{swatch:ev({background:r,height:"100%",width:"100%",cursor:"pointer",position:"relative",outline:"none"},n,d?f:{})}}),g=function(w){return o(r,w)},b=function(w){return w.keyCode===GD&&o(r,w)},m=function(w){return s(r,w)},y={};return s&&(y.onMouseOver=m),P.createElement("div",ev({style:v.swatch,onClick:g,title:l,tabIndex:0,onKeyDown:b},y),u,p&&P.createElement(bs,{borderRadius:v.swatch.borderRadius,boxShadow:"inset 0 0 0 1px rgba(0,0,0,0.1)"}))};const Yi=HD(WD);var VD=function(e){var r=e.direction,n=Pe({default:{picker:{width:"18px",height:"18px",borderRadius:"50%",transform:"translate(-9px, -1px)",backgroundColor:"rgb(248, 248, 248)",boxShadow:"0 1px 4px 0 rgba(0, 0, 0, 0.37)"}},vertical:{picker:{transform:"translate(-3px, -9px)"}}},{vertical:r==="vertical"});return P.createElement("div",{style:n.picker})},qD=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},u1=function(e){var r=e.rgb,n=e.hsl,i=e.width,o=e.height,s=e.onChange,a=e.direction,l=e.style,u=e.renderers,d=e.pointer,h=e.className,f=h===void 0?"":h,p=Pe({default:{picker:{position:"relative",width:i,height:o},alpha:{radius:"2px",style:l}}});return P.createElement("div",{style:p.picker,className:"alpha-picker "+f},P.createElement(vp,qD({},p.alpha,{rgb:r,hsl:n,pointer:d,renderers:u,onChange:s,direction:a})))};u1.defaultProps={width:"316px",height:"16px",direction:"horizontal",pointer:VD};sr(u1);function d1(t,e){for(var r=-1,n=t==null?0:t.length,i=Array(n);++r<n;)i[r]=e(t[r],r,t);return i}var KD="__lodash_hash_undefined__";function YD(t){return this.__data__.set(t,KD),this}function XD(t){return this.__data__.has(t)}function Dc(t){var e=-1,r=t==null?0:t.length;for(this.__data__=new En;++e<r;)this.add(t[e])}Dc.prototype.add=Dc.prototype.push=YD;Dc.prototype.has=XD;function ZD(t,e){for(var r=-1,n=t==null?0:t.length;++r<n;)if(e(t[r],r,t))return!0;return!1}function JD(t,e){return t.has(e)}var QD=1,eL=2;function h1(t,e,r,n,i,o){var s=r&QD,a=t.length,l=e.length;if(a!=l&&!(s&&l>a))return!1;var u=o.get(t),d=o.get(e);if(u&&d)return u==e&&d==t;var h=-1,f=!0,p=r&eL?new Dc:void 0;for(o.set(t,e),o.set(e,t);++h<a;){var v=t[h],g=e[h];if(n)var b=s?n(g,v,h,e,t,o):n(v,g,h,t,e,o);if(b!==void 0){if(b)continue;f=!1;break}if(p){if(!ZD(e,function(m,y){if(!JD(p,y)&&(v===m||i(v,m,r,n,o)))return p.push(y)})){f=!1;break}}else if(!(v===g||i(v,g,r,n,o))){f=!1;break}}return o.delete(t),o.delete(e),f}function tL(t){var e=-1,r=Array(t.size);return t.forEach(function(n,i){r[++e]=[i,n]}),r}function rL(t){var e=-1,r=Array(t.size);return t.forEach(function(n){r[++e]=n}),r}var nL=1,iL=2,oL="[object Boolean]",sL="[object Date]",aL="[object Error]",lL="[object Map]",cL="[object Number]",uL="[object RegExp]",dL="[object Set]",hL="[object String]",fL="[object Symbol]",pL="[object ArrayBuffer]",gL="[object DataView]",tv=ei?ei.prototype:void 0,yd=tv?tv.valueOf:void 0;function mL(t,e,r,n,i,o,s){switch(r){case gL:if(t.byteLength!=e.byteLength||t.byteOffset!=e.byteOffset)return!1;t=t.buffer,e=e.buffer;case pL:return!(t.byteLength!=e.byteLength||!o(new Pc(t),new Pc(e)));case oL:case sL:case cL:return Za(+t,+e);case aL:return t.name==e.name&&t.message==e.message;case uL:case hL:return t==e+"";case lL:var a=tL;case dL:var l=n&nL;if(a||(a=rL),t.size!=e.size&&!l)return!1;var u=s.get(t);if(u)return u==e;n|=iL,s.set(t,e);var d=h1(a(t),a(e),n,i,o,s);return s.delete(t),d;case fL:if(yd)return yd.call(t)==yd.call(e)}return!1}function vL(t,e){for(var r=-1,n=e.length,i=t.length;++r<n;)t[i+r]=e[r];return t}function yL(t,e,r){var n=e(t);return mr(t)?n:vL(n,r(t))}function bL(t,e){for(var r=-1,n=t==null?0:t.length,i=0,o=[];++r<n;){var s=t[r];e(s,r,t)&&(o[i++]=s)}return o}function xL(){return[]}var wL=Object.prototype,_L=wL.propertyIsEnumerable,rv=Object.getOwnPropertySymbols,SL=rv?function(t){return t==null?[]:(t=Object(t),bL(rv(t),function(e){return _L.call(t,e)}))}:xL;function nv(t){return yL(t,kp,SL)}var kL=1,jL=Object.prototype,EL=jL.hasOwnProperty;function CL(t,e,r,n,i,o){var s=r&kL,a=nv(t),l=a.length,u=nv(e),d=u.length;if(l!=d&&!s)return!1;for(var h=l;h--;){var f=a[h];if(!(s?f in e:EL.call(e,f)))return!1}var p=o.get(t),v=o.get(e);if(p&&v)return p==e&&v==t;var g=!0;o.set(t,e),o.set(e,t);for(var b=s;++h<l;){f=a[h];var m=t[f],y=e[f];if(n)var x=s?n(y,m,f,e,t,o):n(m,y,f,t,e,o);if(!(x===void 0?m===y||i(m,y,r,n,o):x)){g=!1;break}b||(b=f=="constructor")}if(g&&!b){var w=t.constructor,j=e.constructor;w!=j&&"constructor"in t&&"constructor"in e&&!(typeof w=="function"&&w instanceof w&&typeof j=="function"&&j instanceof j)&&(g=!1)}return o.delete(t),o.delete(e),g}var Uh=Ki(Hr,"DataView"),Hh=Ki(Hr,"Promise"),Gh=Ki(Hr,"Set"),Wh=Ki(Hr,"WeakMap"),iv="[object Map]",TL="[object Object]",ov="[object Promise]",sv="[object Set]",av="[object WeakMap]",lv="[object DataView]",NL=qi(Uh),OL=qi(Ia),RL=qi(Hh),AL=qi(Gh),PL=qi(Wh),Dn=Vi;(Uh&&Dn(new Uh(new ArrayBuffer(1)))!=lv||Ia&&Dn(new Ia)!=iv||Hh&&Dn(Hh.resolve())!=ov||Gh&&Dn(new Gh)!=sv||Wh&&Dn(new Wh)!=av)&&(Dn=function(t){var e=Vi(t),r=e==TL?t.constructor:void 0,n=r?qi(r):"";if(n)switch(n){case NL:return lv;case OL:return iv;case RL:return ov;case AL:return sv;case PL:return av}return e});var $L=1,cv="[object Arguments]",uv="[object Array]",Pl="[object Object]",IL=Object.prototype,dv=IL.hasOwnProperty;function ML(t,e,r,n,i,o){var s=mr(t),a=mr(e),l=s?uv:Dn(t),u=a?uv:Dn(e);l=l==cv?Pl:l,u=u==cv?Pl:u;var d=l==Pl,h=u==Pl,f=l==u;if(f&&Ic(t)){if(!Ic(e))return!1;s=!0,d=!1}if(f&&!d)return o||(o=new en),s||_p(t)?h1(t,e,r,n,i,o):mL(t,e,l,r,n,i,o);if(!(r&$L)){var p=d&&dv.call(t,"__wrapped__"),v=h&&dv.call(e,"__wrapped__");if(p||v){var g=p?t.value():t,b=v?e.value():e;return o||(o=new en),i(g,b,r,n,o)}}return f?(o||(o=new en),CL(t,e,r,n,i,o)):!1}function Ep(t,e,r,n,i){return t===e?!0:t==null||e==null||!ti(t)&&!ti(e)?t!==t&&e!==e:ML(t,e,r,n,Ep,i)}var DL=1,LL=2;function zL(t,e,r,n){var i=r.length,o=i;if(t==null)return!o;for(t=Object(t);i--;){var s=r[i];if(s[2]?s[1]!==t[s[0]]:!(s[0]in t))return!1}for(;++i<o;){s=r[i];var a=s[0],l=t[a],u=s[1];if(s[2]){if(l===void 0&&!(a in t))return!1}else{var d=new en,h;if(!(h===void 0?Ep(u,l,DL|LL,n,d):h))return!1}}return!0}function f1(t){return t===t&&!Er(t)}function FL(t){for(var e=kp(t),r=e.length;r--;){var n=e[r],i=t[n];e[r]=[n,i,f1(i)]}return e}function p1(t,e){return function(r){return r==null?!1:r[t]===e&&(e!==void 0||t in Object(r))}}function BL(t){var e=FL(t);return e.length==1&&e[0][2]?p1(e[0][0],e[0][1]):function(r){return r===t||zL(r,t,e)}}var UL=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,HL=/^\w*$/;function Cp(t,e){if(mr(t))return!1;var r=typeof t;return r=="number"||r=="symbol"||r=="boolean"||t==null||vu(t)?!0:HL.test(t)||!UL.test(t)||e!=null&&t in Object(e)}var GL="Expected a function";function Tp(t,e){if(typeof t!="function"||e!=null&&typeof e!="function")throw new TypeError(GL);var r=function(){var n=arguments,i=e?e.apply(this,n):n[0],o=r.cache;if(o.has(i))return o.get(i);var s=t.apply(this,n);return r.cache=o.set(i,s)||o,s};return r.cache=new(Tp.Cache||En),r}Tp.Cache=En;var WL=500;function VL(t){var e=Tp(t,function(n){return r.size===WL&&r.clear(),n}),r=e.cache;return e}var qL=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,KL=/\\(\\)?/g,YL=VL(function(t){var e=[];return t.charCodeAt(0)===46&&e.push(""),t.replace(qL,function(r,n,i,o){e.push(i?o.replace(KL,"$1"):n||r)}),e}),hv=ei?ei.prototype:void 0,fv=hv?hv.toString:void 0;function g1(t){if(typeof t=="string")return t;if(mr(t))return d1(t,g1)+"";if(vu(t))return fv?fv.call(t):"";var e=t+"";return e=="0"&&1/t==-1/0?"-0":e}function XL(t){return t==null?"":g1(t)}function m1(t,e){return mr(t)?t:Cp(t,e)?[t]:YL(XL(t))}function xu(t){if(typeof t=="string"||vu(t))return t;var e=t+"";return e=="0"&&1/t==-1/0?"-0":e}function v1(t,e){e=m1(e,t);for(var r=0,n=e.length;t!=null&&r<n;)t=t[xu(e[r++])];return r&&r==n?t:void 0}function ZL(t,e,r){var n=t==null?void 0:v1(t,e);return n===void 0?r:n}function JL(t,e){return t!=null&&e in Object(t)}function QL(t,e,r){e=m1(e,t);for(var n=-1,i=e.length,o=!1;++n<i;){var s=xu(e[n]);if(!(o=t!=null&&r(t,s)))break;t=t[s]}return o||++n!=i?o:(i=t==null?0:t.length,!!i&&wp(i)&&Sp(s,i)&&(mr(t)||$c(t)))}function ez(t,e){return t!=null&&QL(t,e,JL)}var tz=1,rz=2;function nz(t,e){return Cp(t)&&f1(e)?p1(xu(t),e):function(r){var n=ZL(r,t);return n===void 0&&n===e?ez(r,t):Ep(e,n,tz|rz)}}function iz(t){return function(e){return e==null?void 0:e[t]}}function oz(t){return function(e){return v1(e,t)}}function sz(t){return Cp(t)?iz(xu(t)):oz(t)}function az(t){return typeof t=="function"?t:t==null?mu:typeof t=="object"?mr(t)?nz(t[0],t[1]):BL(t):sz(t)}function lz(t,e){var r=-1,n=ws(t)?Array(t.length):[];return a1(t,function(i,o,s){n[++r]=e(i,o,s)}),n}function Xi(t,e){var r=mr(t)?d1:lz;return r(t,az(e))}var cz=function(e){var r=e.colors,n=e.onClick,i=e.onSwatchHover,o=Pe({default:{swatches:{marginRight:"-10px"},swatch:{width:"22px",height:"22px",float:"left",marginRight:"10px",marginBottom:"10px",borderRadius:"4px"},clear:{clear:"both"}}});return P.createElement("div",{style:o.swatches},Xi(r,function(s){return P.createElement(Yi,{key:s,color:s,style:o.swatch,onClick:n,onHover:i,focusStyle:{boxShadow:"0 0 4px "+s}})}),P.createElement("div",{style:o.clear}))},Np=function(e){var r=e.onChange,n=e.onSwatchHover,i=e.hex,o=e.colors,s=e.width,a=e.triangle,l=e.styles,u=l===void 0?{}:l,d=e.className,h=d===void 0?"":d,f=i==="transparent",p=function(b,m){si(b)&&r({hex:b,source:"hex"},m)},v=Pe(or({default:{card:{width:s,background:"#fff",boxShadow:"0 1px rgba(0,0,0,.1)",borderRadius:"6px",position:"relative"},head:{height:"110px",background:i,borderRadius:"6px 6px 0 0",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"},body:{padding:"10px"},label:{fontSize:"18px",color:jp(i),position:"relative"},triangle:{width:"0px",height:"0px",borderStyle:"solid",borderWidth:"0 10px 10px 10px",borderColor:"transparent transparent "+i+" transparent",position:"absolute",top:"-10px",left:"50%",marginLeft:"-10px"},input:{width:"100%",fontSize:"12px",color:"#666",border:"0px",outline:"none",height:"22px",boxShadow:"inset 0 0 0 1px #ddd",borderRadius:"4px",padding:"0 7px",boxSizing:"border-box"}},"hide-triangle":{triangle:{display:"none"}}},u),{"hide-triangle":a==="hide"});return P.createElement("div",{style:v.card,className:"block-picker "+h},P.createElement("div",{style:v.triangle}),P.createElement("div",{style:v.head},f&&P.createElement(bs,{borderRadius:"6px 6px 0 0"}),P.createElement("div",{style:v.label},i)),P.createElement("div",{style:v.body},P.createElement(cz,{colors:o,onClick:p,onSwatchHover:n}),P.createElement(Ue,{style:{input:v.input},value:i,onChange:p})))};Np.propTypes={width:he.oneOfType([he.string,he.number]),colors:he.arrayOf(he.string),triangle:he.oneOf(["top","hide"]),styles:he.object};Np.defaultProps={width:170,colors:["#D9E3F0","#F47373","#697689","#37D67A","#2CCCE4","#555555","#dce775","#ff8a65","#ba68c8"],triangle:"top",styles:{}};sr(Np);var go={100:"#ffcdd2",300:"#e57373",500:"#f44336",700:"#d32f2f",900:"#b71c1c"},mo={100:"#f8bbd0",300:"#f06292",500:"#e91e63",700:"#c2185b",900:"#880e4f"},vo={100:"#e1bee7",300:"#ba68c8",500:"#9c27b0",700:"#7b1fa2",900:"#4a148c"},yo={100:"#d1c4e9",300:"#9575cd",500:"#673ab7",700:"#512da8",900:"#311b92"},bo={100:"#c5cae9",300:"#7986cb",500:"#3f51b5",700:"#303f9f",900:"#1a237e"},xo={100:"#bbdefb",300:"#64b5f6",500:"#2196f3",700:"#1976d2",900:"#0d47a1"},wo={100:"#b3e5fc",300:"#4fc3f7",500:"#03a9f4",700:"#0288d1",900:"#01579b"},_o={100:"#b2ebf2",300:"#4dd0e1",500:"#00bcd4",700:"#0097a7",900:"#006064"},So={100:"#b2dfdb",300:"#4db6ac",500:"#009688",700:"#00796b",900:"#004d40"},ta={100:"#c8e6c9",300:"#81c784",500:"#4caf50",700:"#388e3c"},ko={100:"#dcedc8",300:"#aed581",500:"#8bc34a",700:"#689f38",900:"#33691e"},jo={100:"#f0f4c3",300:"#dce775",500:"#cddc39",700:"#afb42b",900:"#827717"},Eo={100:"#fff9c4",300:"#fff176",500:"#ffeb3b",700:"#fbc02d",900:"#f57f17"},Co={100:"#ffecb3",300:"#ffd54f",500:"#ffc107",700:"#ffa000",900:"#ff6f00"},To={100:"#ffe0b2",300:"#ffb74d",500:"#ff9800",700:"#f57c00",900:"#e65100"},No={100:"#ffccbc",300:"#ff8a65",500:"#ff5722",700:"#e64a19",900:"#bf360c"},Oo={100:"#d7ccc8",300:"#a1887f",500:"#795548",700:"#5d4037",900:"#3e2723"},Ro={100:"#cfd8dc",300:"#90a4ae",500:"#607d8b",700:"#455a64",900:"#263238"},y1=function(e){var r=e.color,n=e.onClick,i=e.onSwatchHover,o=e.hover,s=e.active,a=e.circleSize,l=e.circleSpacing,u=Pe({default:{swatch:{width:a,height:a,marginRight:l,marginBottom:l,transform:"scale(1)",transition:"100ms transform ease"},Swatch:{borderRadius:"50%",background:"transparent",boxShadow:"inset 0 0 0 "+(a/2+1)+"px "+r,transition:"100ms box-shadow ease"}},hover:{swatch:{transform:"scale(1.2)"}},active:{Swatch:{boxShadow:"inset 0 0 0 3px "+r}}},{hover:o,active:s});return P.createElement("div",{style:u.swatch},P.createElement(Yi,{style:u.Swatch,color:r,onClick:n,onHover:i,focusStyle:{boxShadow:u.Swatch.boxShadow+", 0 0 5px "+r}}))};y1.defaultProps={circleSize:28,circleSpacing:14};const uz=mp(y1);var Op=function(e){var r=e.width,n=e.onChange,i=e.onSwatchHover,o=e.colors,s=e.hex,a=e.circleSize,l=e.styles,u=l===void 0?{}:l,d=e.circleSpacing,h=e.className,f=h===void 0?"":h,p=Pe(or({default:{card:{width:r,display:"flex",flexWrap:"wrap",marginRight:-d,marginBottom:-d}}},u)),v=function(b,m){return n({hex:b,source:"hex"},m)};return P.createElement("div",{style:p.card,className:"circle-picker "+f},Xi(o,function(g){return P.createElement(uz,{key:g,color:g,onClick:v,onSwatchHover:i,active:s===g.toLowerCase(),circleSize:a,circleSpacing:d})}))};Op.propTypes={width:he.oneOfType([he.string,he.number]),circleSize:he.number,circleSpacing:he.number,styles:he.object};Op.defaultProps={width:252,circleSize:28,circleSpacing:14,colors:[go[500],mo[500],vo[500],yo[500],bo[500],xo[500],wo[500],_o[500],So[500],ta[500],ko[500],jo[500],Eo[500],Co[500],To[500],No[500],Oo[500],Ro[500]],styles:{}};sr(Op);function pv(t){return t===void 0}var b1={};Object.defineProperty(b1,"__esModule",{value:!0});var gv=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},dz=$,mv=hz(dz);function hz(t){return t&&t.__esModule?t:{default:t}}function fz(t,e){var r={};for(var n in t)e.indexOf(n)>=0||Object.prototype.hasOwnProperty.call(t,n)&&(r[n]=t[n]);return r}var $l=24,pz=b1.default=function(t){var e=t.fill,r=e===void 0?"currentColor":e,n=t.width,i=n===void 0?$l:n,o=t.height,s=o===void 0?$l:o,a=t.style,l=a===void 0?{}:a,u=fz(t,["fill","width","height","style"]);return mv.default.createElement("svg",gv({viewBox:"0 0 "+$l+" "+$l,style:gv({fill:r,width:i,height:s},l)},u),mv.default.createElement("path",{d:"M12,18.17L8.83,15L7.42,16.41L12,21L16.59,16.41L15.17,15M12,5.83L15.17,9L16.58,7.59L12,3L7.41,7.59L8.83,9L12,5.83Z"}))},gz=function(){function t(e,r){for(var n=0;n<r.length;n++){var i=r[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}();function mz(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function vz(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e&&(typeof e=="object"||typeof e=="function")?e:t}function yz(t,e){if(typeof e!="function"&&e!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}var x1=function(t){yz(e,t);function e(r){mz(this,e);var n=vz(this,(e.__proto__||Object.getPrototypeOf(e)).call(this));return n.toggleViews=function(){n.state.view==="hex"?n.setState({view:"rgb"}):n.state.view==="rgb"?n.setState({view:"hsl"}):n.state.view==="hsl"&&(n.props.hsl.a===1?n.setState({view:"hex"}):n.setState({view:"rgb"}))},n.handleChange=function(i,o){i.hex?si(i.hex)&&n.props.onChange({hex:i.hex,source:"hex"},o):i.r||i.g||i.b?n.props.onChange({r:i.r||n.props.rgb.r,g:i.g||n.props.rgb.g,b:i.b||n.props.rgb.b,source:"rgb"},o):i.a?(i.a<0?i.a=0:i.a>1&&(i.a=1),n.props.onChange({h:n.props.hsl.h,s:n.props.hsl.s,l:n.props.hsl.l,a:Math.round(i.a*100)/100,source:"rgb"},o)):(i.h||i.s||i.l)&&(typeof i.s=="string"&&i.s.includes("%")&&(i.s=i.s.replace("%","")),typeof i.l=="string"&&i.l.includes("%")&&(i.l=i.l.replace("%","")),i.s==1?i.s=.01:i.l==1&&(i.l=.01),n.props.onChange({h:i.h||n.props.hsl.h,s:Number(pv(i.s)?n.props.hsl.s:i.s),l:Number(pv(i.l)?n.props.hsl.l:i.l),source:"hsl"},o))},n.showHighlight=function(i){i.currentTarget.style.background="#eee"},n.hideHighlight=function(i){i.currentTarget.style.background="transparent"},r.hsl.a!==1&&r.view==="hex"?n.state={view:"rgb"}:n.state={view:r.view},n}return gz(e,[{key:"render",value:function(){var n=this,i=Pe({default:{wrap:{paddingTop:"16px",display:"flex"},fields:{flex:"1",display:"flex",marginLeft:"-6px"},field:{paddingLeft:"6px",width:"100%"},alpha:{paddingLeft:"6px",width:"100%"},toggle:{width:"32px",textAlign:"right",position:"relative"},icon:{marginRight:"-4px",marginTop:"12px",cursor:"pointer",position:"relative"},iconHighlight:{position:"absolute",width:"24px",height:"28px",background:"#eee",borderRadius:"4px",top:"10px",left:"12px",display:"none"},input:{fontSize:"11px",color:"#333",width:"100%",borderRadius:"2px",border:"none",boxShadow:"inset 0 0 0 1px #dadada",height:"21px",textAlign:"center"},label:{textTransform:"uppercase",fontSize:"11px",lineHeight:"11px",color:"#969696",textAlign:"center",display:"block",marginTop:"12px"},svg:{fill:"#333",width:"24px",height:"24px",border:"1px transparent solid",borderRadius:"5px"}},disableAlpha:{alpha:{display:"none"}}},this.props,this.state),o=void 0;return this.state.view==="hex"?o=P.createElement("div",{style:i.fields,className:"flexbox-fix"},P.createElement("div",{style:i.field},P.createElement(Ue,{style:{input:i.input,label:i.label},label:"hex",value:this.props.hex,onChange:this.handleChange}))):this.state.view==="rgb"?o=P.createElement("div",{style:i.fields,className:"flexbox-fix"},P.createElement("div",{style:i.field},P.createElement(Ue,{style:{input:i.input,label:i.label},label:"r",value:this.props.rgb.r,onChange:this.handleChange})),P.createElement("div",{style:i.field},P.createElement(Ue,{style:{input:i.input,label:i.label},label:"g",value:this.props.rgb.g,onChange:this.handleChange})),P.createElement("div",{style:i.field},P.createElement(Ue,{style:{input:i.input,label:i.label},label:"b",value:this.props.rgb.b,onChange:this.handleChange})),P.createElement("div",{style:i.alpha},P.createElement(Ue,{style:{input:i.input,label:i.label},label:"a",value:this.props.rgb.a,arrowOffset:.01,onChange:this.handleChange}))):this.state.view==="hsl"&&(o=P.createElement("div",{style:i.fields,className:"flexbox-fix"},P.createElement("div",{style:i.field},P.createElement(Ue,{style:{input:i.input,label:i.label},label:"h",value:Math.round(this.props.hsl.h),onChange:this.handleChange})),P.createElement("div",{style:i.field},P.createElement(Ue,{style:{input:i.input,label:i.label},label:"s",value:Math.round(this.props.hsl.s*100)+"%",onChange:this.handleChange})),P.createElement("div",{style:i.field},P.createElement(Ue,{style:{input:i.input,label:i.label},label:"l",value:Math.round(this.props.hsl.l*100)+"%",onChange:this.handleChange})),P.createElement("div",{style:i.alpha},P.createElement(Ue,{style:{input:i.input,label:i.label},label:"a",value:this.props.hsl.a,arrowOffset:.01,onChange:this.handleChange})))),P.createElement("div",{style:i.wrap,className:"flexbox-fix"},o,P.createElement("div",{style:i.toggle},P.createElement("div",{style:i.icon,onClick:this.toggleViews,ref:function(a){return n.icon=a}},P.createElement(pz,{style:i.svg,onMouseOver:this.showHighlight,onMouseEnter:this.showHighlight,onMouseOut:this.hideHighlight}))))}}],[{key:"getDerivedStateFromProps",value:function(n,i){return n.hsl.a!==1&&i.view==="hex"?{view:"rgb"}:null}}]),e}(P.Component);x1.defaultProps={view:"hex"};var vv=function(){var e=Pe({default:{picker:{width:"12px",height:"12px",borderRadius:"6px",transform:"translate(-6px, -1px)",backgroundColor:"rgb(248, 248, 248)",boxShadow:"0 1px 4px 0 rgba(0, 0, 0, 0.37)"}}});return P.createElement("div",{style:e.picker})},bz=function(){var e=Pe({default:{picker:{width:"12px",height:"12px",borderRadius:"6px",boxShadow:"inset 0 0 0 1px #fff",transform:"translate(-6px, -6px)"}}});return P.createElement("div",{style:e.picker})},Rp=function(e){var r=e.width,n=e.onChange,i=e.disableAlpha,o=e.rgb,s=e.hsl,a=e.hsv,l=e.hex,u=e.renderers,d=e.styles,h=d===void 0?{}:d,f=e.className,p=f===void 0?"":f,v=e.defaultView,g=Pe(or({default:{picker:{width:r,background:"#fff",borderRadius:"2px",boxShadow:"0 0 2px rgba(0,0,0,.3), 0 4px 8px rgba(0,0,0,.3)",boxSizing:"initial",fontFamily:"Menlo"},saturation:{width:"100%",paddingBottom:"55%",position:"relative",borderRadius:"2px 2px 0 0",overflow:"hidden"},Saturation:{radius:"2px 2px 0 0"},body:{padding:"16px 16px 12px"},controls:{display:"flex"},color:{width:"32px"},swatch:{marginTop:"6px",width:"16px",height:"16px",borderRadius:"8px",position:"relative",overflow:"hidden"},active:{absolute:"0px 0px 0px 0px",borderRadius:"8px",boxShadow:"inset 0 0 0 1px rgba(0,0,0,.1)",background:"rgba("+o.r+", "+o.g+", "+o.b+", "+o.a+")",zIndex:"2"},toggles:{flex:"1"},hue:{height:"10px",position:"relative",marginBottom:"8px"},Hue:{radius:"2px"},alpha:{height:"10px",position:"relative"},Alpha:{radius:"2px"}},disableAlpha:{color:{width:"22px"},alpha:{display:"none"},hue:{marginBottom:"0px"},swatch:{width:"10px",height:"10px",marginTop:"0px"}}},h),{disableAlpha:i});return P.createElement("div",{style:g.picker,className:"chrome-picker "+p},P.createElement("div",{style:g.saturation},P.createElement(yu,{style:g.Saturation,hsl:s,hsv:a,pointer:bz,onChange:n})),P.createElement("div",{style:g.body},P.createElement("div",{style:g.controls,className:"flexbox-fix"},P.createElement("div",{style:g.color},P.createElement("div",{style:g.swatch},P.createElement("div",{style:g.active}),P.createElement(bs,{renderers:u}))),P.createElement("div",{style:g.toggles},P.createElement("div",{style:g.hue},P.createElement(xs,{style:g.Hue,hsl:s,pointer:vv,onChange:n})),P.createElement("div",{style:g.alpha},P.createElement(vp,{style:g.Alpha,rgb:o,hsl:s,pointer:vv,renderers:u,onChange:n})))),P.createElement(x1,{rgb:o,hsl:s,hex:l,view:v,onChange:n,disableAlpha:i})))};Rp.propTypes={width:he.oneOfType([he.string,he.number]),disableAlpha:he.bool,styles:he.object,defaultView:he.oneOf(["hex","rgb","hsl"])};Rp.defaultProps={width:225,disableAlpha:!1,styles:{}};const xz=sr(Rp);var wz=function(e){var r=e.color,n=e.onClick,i=n===void 0?function(){}:n,o=e.onSwatchHover,s=e.active,a=Pe({default:{color:{background:r,width:"15px",height:"15px",float:"left",marginRight:"5px",marginBottom:"5px",position:"relative",cursor:"pointer"},dot:{absolute:"5px 5px 5px 5px",background:jp(r),borderRadius:"50%",opacity:"0"}},active:{dot:{opacity:"1"}},"color-#FFFFFF":{color:{boxShadow:"inset 0 0 0 1px #ddd"},dot:{background:"#000"}},transparent:{dot:{background:"#000"}}},{active:s,"color-#FFFFFF":r==="#FFFFFF",transparent:r==="transparent"});return P.createElement(Yi,{style:a.color,color:r,onClick:i,onHover:o,focusStyle:{boxShadow:"0 0 4px "+r}},P.createElement("div",{style:a.dot}))},_z=function(e){var r=e.hex,n=e.rgb,i=e.onChange,o=Pe({default:{fields:{display:"flex",paddingBottom:"6px",paddingRight:"5px",position:"relative"},active:{position:"absolute",top:"6px",left:"5px",height:"9px",width:"9px",background:r},HEXwrap:{flex:"6",position:"relative"},HEXinput:{width:"80%",padding:"0px",paddingLeft:"20%",border:"none",outline:"none",background:"none",fontSize:"12px",color:"#333",height:"16px"},HEXlabel:{display:"none"},RGBwrap:{flex:"3",position:"relative"},RGBinput:{width:"70%",padding:"0px",paddingLeft:"30%",border:"none",outline:"none",background:"none",fontSize:"12px",color:"#333",height:"16px"},RGBlabel:{position:"absolute",top:"3px",left:"0px",lineHeight:"16px",textTransform:"uppercase",fontSize:"12px",color:"#999"}}}),s=function(l,u){l.r||l.g||l.b?i({r:l.r||n.r,g:l.g||n.g,b:l.b||n.b,source:"rgb"},u):i({hex:l.hex,source:"hex"},u)};return P.createElement("div",{style:o.fields,className:"flexbox-fix"},P.createElement("div",{style:o.active}),P.createElement(Ue,{style:{wrap:o.HEXwrap,input:o.HEXinput,label:o.HEXlabel},label:"hex",value:r,onChange:s}),P.createElement(Ue,{style:{wrap:o.RGBwrap,input:o.RGBinput,label:o.RGBlabel},label:"r",value:n.r,onChange:s}),P.createElement(Ue,{style:{wrap:o.RGBwrap,input:o.RGBinput,label:o.RGBlabel},label:"g",value:n.g,onChange:s}),P.createElement(Ue,{style:{wrap:o.RGBwrap,input:o.RGBinput,label:o.RGBlabel},label:"b",value:n.b,onChange:s}))},Ap=function(e){var r=e.onChange,n=e.onSwatchHover,i=e.colors,o=e.hex,s=e.rgb,a=e.styles,l=a===void 0?{}:a,u=e.className,d=u===void 0?"":u,h=Pe(or({default:{Compact:{background:"#f6f6f6",radius:"4px"},compact:{paddingTop:"5px",paddingLeft:"5px",boxSizing:"initial",width:"240px"},clear:{clear:"both"}}},l)),f=function(v,g){v.hex?si(v.hex)&&r({hex:v.hex,source:"hex"},g):r(v,g)};return P.createElement(Ja,{style:h.Compact,styles:l},P.createElement("div",{style:h.compact,className:"compact-picker "+d},P.createElement("div",null,Xi(i,function(p){return P.createElement(wz,{key:p,color:p,active:p.toLowerCase()===o,onClick:f,onSwatchHover:n})}),P.createElement("div",{style:h.clear})),P.createElement(_z,{hex:o,rgb:s,onChange:f})))};Ap.propTypes={colors:he.arrayOf(he.string),styles:he.object};Ap.defaultProps={colors:["#4D4D4D","#999999","#FFFFFF","#F44E3B","#FE9200","#FCDC00","#DBDF00","#A4DD00","#68CCCA","#73D8FF","#AEA1FF","#FDA1FF","#333333","#808080","#cccccc","#D33115","#E27300","#FCC400","#B0BC00","#68BC00","#16A5A5","#009CE0","#7B64FF","#FA28FF","#000000","#666666","#B3B3B3","#9F0500","#C45100","#FB9E00","#808900","#194D33","#0C797D","#0062B1","#653294","#AB149E"],styles:{}};sr(Ap);var Sz=function(e){var r=e.hover,n=e.color,i=e.onClick,o=e.onSwatchHover,s={position:"relative",zIndex:"2",outline:"2px solid #fff",boxShadow:"0 0 5px 2px rgba(0,0,0,0.25)"},a=Pe({default:{swatch:{width:"25px",height:"25px",fontSize:"0"}},hover:{swatch:s}},{hover:r});return P.createElement("div",{style:a.swatch},P.createElement(Yi,{color:n,onClick:i,onHover:o,focusStyle:s}))};const kz=mp(Sz);var Pp=function(e){var r=e.width,n=e.colors,i=e.onChange,o=e.onSwatchHover,s=e.triangle,a=e.styles,l=a===void 0?{}:a,u=e.className,d=u===void 0?"":u,h=Pe(or({default:{card:{width:r,background:"#fff",border:"1px solid rgba(0,0,0,0.2)",boxShadow:"0 3px 12px rgba(0,0,0,0.15)",borderRadius:"4px",position:"relative",padding:"5px",display:"flex",flexWrap:"wrap"},triangle:{position:"absolute",border:"7px solid transparent",borderBottomColor:"#fff"},triangleShadow:{position:"absolute",border:"8px solid transparent",borderBottomColor:"rgba(0,0,0,0.15)"}},"hide-triangle":{triangle:{display:"none"},triangleShadow:{display:"none"}},"top-left-triangle":{triangle:{top:"-14px",left:"10px"},triangleShadow:{top:"-16px",left:"9px"}},"top-right-triangle":{triangle:{top:"-14px",right:"10px"},triangleShadow:{top:"-16px",right:"9px"}},"bottom-left-triangle":{triangle:{top:"35px",left:"10px",transform:"rotate(180deg)"},triangleShadow:{top:"37px",left:"9px",transform:"rotate(180deg)"}},"bottom-right-triangle":{triangle:{top:"35px",right:"10px",transform:"rotate(180deg)"},triangleShadow:{top:"37px",right:"9px",transform:"rotate(180deg)"}}},l),{"hide-triangle":s==="hide","top-left-triangle":s==="top-left","top-right-triangle":s==="top-right","bottom-left-triangle":s==="bottom-left","bottom-right-triangle":s==="bottom-right"}),f=function(v,g){return i({hex:v,source:"hex"},g)};return P.createElement("div",{style:h.card,className:"github-picker "+d},P.createElement("div",{style:h.triangleShadow}),P.createElement("div",{style:h.triangle}),Xi(n,function(p){return P.createElement(kz,{color:p,key:p,onClick:f,onSwatchHover:o})}))};Pp.propTypes={width:he.oneOfType([he.string,he.number]),colors:he.arrayOf(he.string),triangle:he.oneOf(["hide","top-left","top-right","bottom-left","bottom-right"]),styles:he.object};Pp.defaultProps={width:200,colors:["#B80000","#DB3E00","#FCCB00","#008B02","#006B76","#1273DE","#004DCF","#5300EB","#EB9694","#FAD0C3","#FEF3BD","#C1E1C5","#BEDADC","#C4DEF6","#BED3F3","#D4C4FB"],triangle:"top-left",styles:{}};sr(Pp);var jz=function(e){var r=e.direction,n=Pe({default:{picker:{width:"18px",height:"18px",borderRadius:"50%",transform:"translate(-9px, -1px)",backgroundColor:"rgb(248, 248, 248)",boxShadow:"0 1px 4px 0 rgba(0, 0, 0, 0.37)"}},vertical:{picker:{transform:"translate(-3px, -9px)"}}},{vertical:r==="vertical"});return P.createElement("div",{style:n.picker})},Ez=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},$p=function(e){var r=e.width,n=e.height,i=e.onChange,o=e.hsl,s=e.direction,a=e.pointer,l=e.styles,u=l===void 0?{}:l,d=e.className,h=d===void 0?"":d,f=Pe(or({default:{picker:{position:"relative",width:r,height:n},hue:{radius:"2px"}}},u)),p=function(g){return i({a:1,h:g.h,l:.5,s:1})};return P.createElement("div",{style:f.picker,className:"hue-picker "+h},P.createElement(xs,Ez({},f.hue,{hsl:o,pointer:a,onChange:p,direction:s})))};$p.propTypes={styles:he.object};$p.defaultProps={width:"316px",height:"16px",direction:"horizontal",pointer:jz,styles:{}};sr($p);var Cz=function(e){var r=e.onChange,n=e.hex,i=e.rgb,o=e.styles,s=o===void 0?{}:o,a=e.className,l=a===void 0?"":a,u=Pe(or({default:{material:{width:"98px",height:"98px",padding:"16px",fontFamily:"Roboto"},HEXwrap:{position:"relative"},HEXinput:{width:"100%",marginTop:"12px",fontSize:"15px",color:"#333",padding:"0px",border:"0px",borderBottom:"2px solid "+n,outline:"none",height:"30px"},HEXlabel:{position:"absolute",top:"0px",left:"0px",fontSize:"11px",color:"#999999",textTransform:"capitalize"},Hex:{style:{}},RGBwrap:{position:"relative"},RGBinput:{width:"100%",marginTop:"12px",fontSize:"15px",color:"#333",padding:"0px",border:"0px",borderBottom:"1px solid #eee",outline:"none",height:"30px"},RGBlabel:{position:"absolute",top:"0px",left:"0px",fontSize:"11px",color:"#999999",textTransform:"capitalize"},split:{display:"flex",marginRight:"-10px",paddingTop:"11px"},third:{flex:"1",paddingRight:"10px"}}},s)),d=function(f,p){f.hex?si(f.hex)&&r({hex:f.hex,source:"hex"},p):(f.r||f.g||f.b)&&r({r:f.r||i.r,g:f.g||i.g,b:f.b||i.b,source:"rgb"},p)};return P.createElement(Ja,{styles:s},P.createElement("div",{style:u.material,className:"material-picker "+l},P.createElement(Ue,{style:{wrap:u.HEXwrap,input:u.HEXinput,label:u.HEXlabel},label:"hex",value:n,onChange:d}),P.createElement("div",{style:u.split,className:"flexbox-fix"},P.createElement("div",{style:u.third},P.createElement(Ue,{style:{wrap:u.RGBwrap,input:u.RGBinput,label:u.RGBlabel},label:"r",value:i.r,onChange:d})),P.createElement("div",{style:u.third},P.createElement(Ue,{style:{wrap:u.RGBwrap,input:u.RGBinput,label:u.RGBlabel},label:"g",value:i.g,onChange:d})),P.createElement("div",{style:u.third},P.createElement(Ue,{style:{wrap:u.RGBwrap,input:u.RGBinput,label:u.RGBlabel},label:"b",value:i.b,onChange:d})))))};sr(Cz);var Tz=function(e){var r=e.onChange,n=e.rgb,i=e.hsv,o=e.hex,s=Pe({default:{fields:{paddingTop:"5px",paddingBottom:"9px",width:"80px",position:"relative"},divider:{height:"5px"},RGBwrap:{position:"relative"},RGBinput:{marginLeft:"40%",width:"40%",height:"18px",border:"1px solid #888888",boxShadow:"inset 0 1px 1px rgba(0,0,0,.1), 0 1px 0 0 #ECECEC",marginBottom:"5px",fontSize:"13px",paddingLeft:"3px",marginRight:"10px"},RGBlabel:{left:"0px",top:"0px",width:"34px",textTransform:"uppercase",fontSize:"13px",height:"18px",lineHeight:"22px",position:"absolute"},HEXwrap:{position:"relative"},HEXinput:{marginLeft:"20%",width:"80%",height:"18px",border:"1px solid #888888",boxShadow:"inset 0 1px 1px rgba(0,0,0,.1), 0 1px 0 0 #ECECEC",marginBottom:"6px",fontSize:"13px",paddingLeft:"3px"},HEXlabel:{position:"absolute",top:"0px",left:"0px",width:"14px",textTransform:"uppercase",fontSize:"13px",height:"18px",lineHeight:"22px"},fieldSymbols:{position:"absolute",top:"5px",right:"-7px",fontSize:"13px"},symbol:{height:"20px",lineHeight:"22px",paddingBottom:"7px"}}}),a=function(u,d){u["#"]?si(u["#"])&&r({hex:u["#"],source:"hex"},d):u.r||u.g||u.b?r({r:u.r||n.r,g:u.g||n.g,b:u.b||n.b,source:"rgb"},d):(u.h||u.s||u.v)&&r({h:u.h||i.h,s:u.s||i.s,v:u.v||i.v,source:"hsv"},d)};return P.createElement("div",{style:s.fields},P.createElement(Ue,{style:{wrap:s.RGBwrap,input:s.RGBinput,label:s.RGBlabel},label:"h",value:Math.round(i.h),onChange:a}),P.createElement(Ue,{style:{wrap:s.RGBwrap,input:s.RGBinput,label:s.RGBlabel},label:"s",value:Math.round(i.s*100),onChange:a}),P.createElement(Ue,{style:{wrap:s.RGBwrap,input:s.RGBinput,label:s.RGBlabel},label:"v",value:Math.round(i.v*100),onChange:a}),P.createElement("div",{style:s.divider}),P.createElement(Ue,{style:{wrap:s.RGBwrap,input:s.RGBinput,label:s.RGBlabel},label:"r",value:n.r,onChange:a}),P.createElement(Ue,{style:{wrap:s.RGBwrap,input:s.RGBinput,label:s.RGBlabel},label:"g",value:n.g,onChange:a}),P.createElement(Ue,{style:{wrap:s.RGBwrap,input:s.RGBinput,label:s.RGBlabel},label:"b",value:n.b,onChange:a}),P.createElement("div",{style:s.divider}),P.createElement(Ue,{style:{wrap:s.HEXwrap,input:s.HEXinput,label:s.HEXlabel},label:"#",value:o.replace("#",""),onChange:a}),P.createElement("div",{style:s.fieldSymbols},P.createElement("div",{style:s.symbol},"°"),P.createElement("div",{style:s.symbol},"%"),P.createElement("div",{style:s.symbol},"%")))},Nz=function(e){var r=e.hsl,n=Pe({default:{picker:{width:"12px",height:"12px",borderRadius:"6px",boxShadow:"inset 0 0 0 1px #fff",transform:"translate(-6px, -6px)"}},"black-outline":{picker:{boxShadow:"inset 0 0 0 1px #000"}}},{"black-outline":r.l>.5});return P.createElement("div",{style:n.picker})},Oz=function(){var e=Pe({default:{triangle:{width:0,height:0,borderStyle:"solid",borderWidth:"4px 0 4px 6px",borderColor:"transparent transparent transparent #fff",position:"absolute",top:"1px",left:"1px"},triangleBorder:{width:0,height:0,borderStyle:"solid",borderWidth:"5px 0 5px 8px",borderColor:"transparent transparent transparent #555"},left:{Extend:"triangleBorder",transform:"translate(-13px, -4px)"},leftInside:{Extend:"triangle",transform:"translate(-8px, -5px)"},right:{Extend:"triangleBorder",transform:"translate(20px, -14px) rotate(180deg)"},rightInside:{Extend:"triangle",transform:"translate(-8px, -5px)"}}});return P.createElement("div",{style:e.pointer},P.createElement("div",{style:e.left},P.createElement("div",{style:e.leftInside})),P.createElement("div",{style:e.right},P.createElement("div",{style:e.rightInside})))},yv=function(e){var r=e.onClick,n=e.label,i=e.children,o=e.active,s=Pe({default:{button:{backgroundImage:"linear-gradient(-180deg, #FFFFFF 0%, #E6E6E6 100%)",border:"1px solid #878787",borderRadius:"2px",height:"20px",boxShadow:"0 1px 0 0 #EAEAEA",fontSize:"14px",color:"#000",lineHeight:"20px",textAlign:"center",marginBottom:"10px",cursor:"pointer"}},active:{button:{boxShadow:"0 0 0 1px #878787"}}},{active:o});return P.createElement("div",{style:s.button,onClick:r},n||i)},Rz=function(e){var r=e.rgb,n=e.currentColor,i=Pe({default:{swatches:{border:"1px solid #B3B3B3",borderBottom:"1px solid #F0F0F0",marginBottom:"2px",marginTop:"1px"},new:{height:"34px",background:"rgb("+r.r+","+r.g+", "+r.b+")",boxShadow:"inset 1px 0 0 #000, inset -1px 0 0 #000, inset 0 1px 0 #000"},current:{height:"34px",background:n,boxShadow:"inset 1px 0 0 #000, inset -1px 0 0 #000, inset 0 -1px 0 #000"},label:{fontSize:"14px",color:"#000",textAlign:"center"}}});return P.createElement("div",null,P.createElement("div",{style:i.label},"new"),P.createElement("div",{style:i.swatches},P.createElement("div",{style:i.new}),P.createElement("div",{style:i.current})),P.createElement("div",{style:i.label},"current"))},Az=function(){function t(e,r){for(var n=0;n<r.length;n++){var i=r[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}();function Pz(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function $z(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e&&(typeof e=="object"||typeof e=="function")?e:t}function Iz(t,e){if(typeof e!="function"&&e!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}var Ip=function(t){Iz(e,t);function e(r){Pz(this,e);var n=$z(this,(e.__proto__||Object.getPrototypeOf(e)).call(this));return n.state={currentColor:r.hex},n}return Az(e,[{key:"render",value:function(){var n=this.props,i=n.styles,o=i===void 0?{}:i,s=n.className,a=s===void 0?"":s,l=Pe(or({default:{picker:{background:"#DCDCDC",borderRadius:"4px",boxShadow:"0 0 0 1px rgba(0,0,0,.25), 0 8px 16px rgba(0,0,0,.15)",boxSizing:"initial",width:"513px"},head:{backgroundImage:"linear-gradient(-180deg, #F0F0F0 0%, #D4D4D4 100%)",borderBottom:"1px solid #B1B1B1",boxShadow:"inset 0 1px 0 0 rgba(255,255,255,.2), inset 0 -1px 0 0 rgba(0,0,0,.02)",height:"23px",lineHeight:"24px",borderRadius:"4px 4px 0 0",fontSize:"13px",color:"#4D4D4D",textAlign:"center"},body:{padding:"15px 15px 0",display:"flex"},saturation:{width:"256px",height:"256px",position:"relative",border:"2px solid #B3B3B3",borderBottom:"2px solid #F0F0F0",overflow:"hidden"},hue:{position:"relative",height:"256px",width:"19px",marginLeft:"10px",border:"2px solid #B3B3B3",borderBottom:"2px solid #F0F0F0"},controls:{width:"180px",marginLeft:"10px"},top:{display:"flex"},previews:{width:"60px"},actions:{flex:"1",marginLeft:"20px"}}},o));return P.createElement("div",{style:l.picker,className:"photoshop-picker "+a},P.createElement("div",{style:l.head},this.props.header),P.createElement("div",{style:l.body,className:"flexbox-fix"},P.createElement("div",{style:l.saturation},P.createElement(yu,{hsl:this.props.hsl,hsv:this.props.hsv,pointer:Nz,onChange:this.props.onChange})),P.createElement("div",{style:l.hue},P.createElement(xs,{direction:"vertical",hsl:this.props.hsl,pointer:Oz,onChange:this.props.onChange})),P.createElement("div",{style:l.controls},P.createElement("div",{style:l.top,className:"flexbox-fix"},P.createElement("div",{style:l.previews},P.createElement(Rz,{rgb:this.props.rgb,currentColor:this.state.currentColor})),P.createElement("div",{style:l.actions},P.createElement(yv,{label:"OK",onClick:this.props.onAccept,active:!0}),P.createElement(yv,{label:"Cancel",onClick:this.props.onCancel}),P.createElement(Tz,{onChange:this.props.onChange,rgb:this.props.rgb,hsv:this.props.hsv,hex:this.props.hex}))))))}}]),e}(P.Component);Ip.propTypes={header:he.string,styles:he.object};Ip.defaultProps={header:"Color Picker",styles:{}};sr(Ip);var Mz=function(e){var r=e.onChange,n=e.rgb,i=e.hsl,o=e.hex,s=e.disableAlpha,a=Pe({default:{fields:{display:"flex",paddingTop:"4px"},single:{flex:"1",paddingLeft:"6px"},alpha:{flex:"1",paddingLeft:"6px"},double:{flex:"2"},input:{width:"80%",padding:"4px 10% 3px",border:"none",boxShadow:"inset 0 0 0 1px #ccc",fontSize:"11px"},label:{display:"block",textAlign:"center",fontSize:"11px",color:"#222",paddingTop:"3px",paddingBottom:"4px",textTransform:"capitalize"}},disableAlpha:{alpha:{display:"none"}}},{disableAlpha:s}),l=function(d,h){d.hex?si(d.hex)&&r({hex:d.hex,source:"hex"},h):d.r||d.g||d.b?r({r:d.r||n.r,g:d.g||n.g,b:d.b||n.b,a:n.a,source:"rgb"},h):d.a&&(d.a<0?d.a=0:d.a>100&&(d.a=100),d.a/=100,r({h:i.h,s:i.s,l:i.l,a:d.a,source:"rgb"},h))};return P.createElement("div",{style:a.fields,className:"flexbox-fix"},P.createElement("div",{style:a.double},P.createElement(Ue,{style:{input:a.input,label:a.label},label:"hex",value:o.replace("#",""),onChange:l})),P.createElement("div",{style:a.single},P.createElement(Ue,{style:{input:a.input,label:a.label},label:"r",value:n.r,onChange:l,dragLabel:"true",dragMax:"255"})),P.createElement("div",{style:a.single},P.createElement(Ue,{style:{input:a.input,label:a.label},label:"g",value:n.g,onChange:l,dragLabel:"true",dragMax:"255"})),P.createElement("div",{style:a.single},P.createElement(Ue,{style:{input:a.input,label:a.label},label:"b",value:n.b,onChange:l,dragLabel:"true",dragMax:"255"})),P.createElement("div",{style:a.alpha},P.createElement(Ue,{style:{input:a.input,label:a.label},label:"a",value:Math.round(n.a*100),onChange:l,dragLabel:"true",dragMax:"100"})))},Dz=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},w1=function(e){var r=e.colors,n=e.onClick,i=n===void 0?function(){}:n,o=e.onSwatchHover,s=Pe({default:{colors:{margin:"0 -10px",padding:"10px 0 0 10px",borderTop:"1px solid #eee",display:"flex",flexWrap:"wrap",position:"relative"},swatchWrap:{width:"16px",height:"16px",margin:"0 10px 10px 0"},swatch:{borderRadius:"3px",boxShadow:"inset 0 0 0 1px rgba(0,0,0,.15)"}},"no-presets":{colors:{display:"none"}}},{"no-presets":!r||!r.length}),a=function(u,d){i({hex:u,source:"hex"},d)};return P.createElement("div",{style:s.colors,className:"flexbox-fix"},r.map(function(l){var u=typeof l=="string"?{color:l}:l,d=""+u.color+(u.title||"");return P.createElement("div",{key:d,style:s.swatchWrap},P.createElement(Yi,Dz({},u,{style:s.swatch,onClick:a,onHover:o,focusStyle:{boxShadow:"inset 0 0 0 1px rgba(0,0,0,.15), 0 0 4px "+u.color}})))}))};w1.propTypes={colors:he.arrayOf(he.oneOfType([he.string,he.shape({color:he.string,title:he.string})])).isRequired};var Lz=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},Mp=function(e){var r=e.width,n=e.rgb,i=e.hex,o=e.hsv,s=e.hsl,a=e.onChange,l=e.onSwatchHover,u=e.disableAlpha,d=e.presetColors,h=e.renderers,f=e.styles,p=f===void 0?{}:f,v=e.className,g=v===void 0?"":v,b=Pe(or({default:Lz({picker:{width:r,padding:"10px 10px 0",boxSizing:"initial",background:"#fff",borderRadius:"4px",boxShadow:"0 0 0 1px rgba(0,0,0,.15), 0 8px 16px rgba(0,0,0,.15)"},saturation:{width:"100%",paddingBottom:"75%",position:"relative",overflow:"hidden"},Saturation:{radius:"3px",shadow:"inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)"},controls:{display:"flex"},sliders:{padding:"4px 0",flex:"1"},color:{width:"24px",height:"24px",position:"relative",marginTop:"4px",marginLeft:"4px",borderRadius:"3px"},activeColor:{absolute:"0px 0px 0px 0px",borderRadius:"2px",background:"rgba("+n.r+","+n.g+","+n.b+","+n.a+")",boxShadow:"inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)"},hue:{position:"relative",height:"10px",overflow:"hidden"},Hue:{radius:"2px",shadow:"inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)"},alpha:{position:"relative",height:"10px",marginTop:"4px",overflow:"hidden"},Alpha:{radius:"2px",shadow:"inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)"}},p),disableAlpha:{color:{height:"10px"},hue:{height:"10px"},alpha:{display:"none"}}},p),{disableAlpha:u});return P.createElement("div",{style:b.picker,className:"sketch-picker "+g},P.createElement("div",{style:b.saturation},P.createElement(yu,{style:b.Saturation,hsl:s,hsv:o,onChange:a})),P.createElement("div",{style:b.controls,className:"flexbox-fix"},P.createElement("div",{style:b.sliders},P.createElement("div",{style:b.hue},P.createElement(xs,{style:b.Hue,hsl:s,onChange:a})),P.createElement("div",{style:b.alpha},P.createElement(vp,{style:b.Alpha,rgb:n,hsl:s,renderers:h,onChange:a}))),P.createElement("div",{style:b.color},P.createElement(bs,null),P.createElement("div",{style:b.activeColor}))),P.createElement(Mz,{rgb:n,hsl:s,hex:i,onChange:a,disableAlpha:u}),P.createElement(w1,{colors:d,onClick:a,onSwatchHover:l}))};Mp.propTypes={disableAlpha:he.bool,width:he.oneOfType([he.string,he.number]),styles:he.object};Mp.defaultProps={disableAlpha:!1,width:200,styles:{},presetColors:["#D0021B","#F5A623","#F8E71C","#8B572A","#7ED321","#417505","#BD10E0","#9013FE","#4A90E2","#50E3C2","#B8E986","#000000","#4A4A4A","#9B9B9B","#FFFFFF"]};sr(Mp);var Ws=function(e){var r=e.hsl,n=e.offset,i=e.onClick,o=i===void 0?function(){}:i,s=e.active,a=e.first,l=e.last,u=Pe({default:{swatch:{height:"12px",background:"hsl("+r.h+", 50%, "+n*100+"%)",cursor:"pointer"}},first:{swatch:{borderRadius:"2px 0 0 2px"}},last:{swatch:{borderRadius:"0 2px 2px 0"}},active:{swatch:{transform:"scaleY(1.8)",borderRadius:"3.6px/2px"}}},{active:s,first:a,last:l}),d=function(f){return o({h:r.h,s:.5,l:n,source:"hsl"},f)};return P.createElement("div",{style:u.swatch,onClick:d})},zz=function(e){var r=e.onClick,n=e.hsl,i=Pe({default:{swatches:{marginTop:"20px"},swatch:{boxSizing:"border-box",width:"20%",paddingRight:"1px",float:"left"},clear:{clear:"both"}}}),o=.1;return P.createElement("div",{style:i.swatches},P.createElement("div",{style:i.swatch},P.createElement(Ws,{hsl:n,offset:".80",active:Math.abs(n.l-.8)<o&&Math.abs(n.s-.5)<o,onClick:r,first:!0})),P.createElement("div",{style:i.swatch},P.createElement(Ws,{hsl:n,offset:".65",active:Math.abs(n.l-.65)<o&&Math.abs(n.s-.5)<o,onClick:r})),P.createElement("div",{style:i.swatch},P.createElement(Ws,{hsl:n,offset:".50",active:Math.abs(n.l-.5)<o&&Math.abs(n.s-.5)<o,onClick:r})),P.createElement("div",{style:i.swatch},P.createElement(Ws,{hsl:n,offset:".35",active:Math.abs(n.l-.35)<o&&Math.abs(n.s-.5)<o,onClick:r})),P.createElement("div",{style:i.swatch},P.createElement(Ws,{hsl:n,offset:".20",active:Math.abs(n.l-.2)<o&&Math.abs(n.s-.5)<o,onClick:r,last:!0})),P.createElement("div",{style:i.clear}))},Fz=function(){var e=Pe({default:{picker:{width:"14px",height:"14px",borderRadius:"6px",transform:"translate(-7px, -1px)",backgroundColor:"rgb(248, 248, 248)",boxShadow:"0 1px 4px 0 rgba(0, 0, 0, 0.37)"}}});return P.createElement("div",{style:e.picker})},Dp=function(e){var r=e.hsl,n=e.onChange,i=e.pointer,o=e.styles,s=o===void 0?{}:o,a=e.className,l=a===void 0?"":a,u=Pe(or({default:{hue:{height:"12px",position:"relative"},Hue:{radius:"2px"}}},s));return P.createElement("div",{style:u.wrap||{},className:"slider-picker "+l},P.createElement("div",{style:u.hue},P.createElement(xs,{style:u.Hue,hsl:r,pointer:i,onChange:n})),P.createElement("div",{style:u.swatches},P.createElement(zz,{hsl:r,onClick:n})))};Dp.propTypes={styles:he.object};Dp.defaultProps={pointer:Fz,styles:{}};sr(Dp);var _1={};Object.defineProperty(_1,"__esModule",{value:!0});var bv=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},Bz=$,xv=Uz(Bz);function Uz(t){return t&&t.__esModule?t:{default:t}}function Hz(t,e){var r={};for(var n in t)e.indexOf(n)>=0||Object.prototype.hasOwnProperty.call(t,n)&&(r[n]=t[n]);return r}var Il=24,Gz=_1.default=function(t){var e=t.fill,r=e===void 0?"currentColor":e,n=t.width,i=n===void 0?Il:n,o=t.height,s=o===void 0?Il:o,a=t.style,l=a===void 0?{}:a,u=Hz(t,["fill","width","height","style"]);return xv.default.createElement("svg",bv({viewBox:"0 0 "+Il+" "+Il,style:bv({fill:r,width:i,height:s},l)},u),xv.default.createElement("path",{d:"M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"}))},Wz=function(e){var r=e.color,n=e.onClick,i=n===void 0?function(){}:n,o=e.onSwatchHover,s=e.first,a=e.last,l=e.active,u=Pe({default:{color:{width:"40px",height:"24px",cursor:"pointer",background:r,marginBottom:"1px"},check:{color:jp(r),marginLeft:"8px",display:"none"}},first:{color:{overflow:"hidden",borderRadius:"2px 2px 0 0"}},last:{color:{overflow:"hidden",borderRadius:"0 0 2px 2px"}},active:{check:{display:"block"}},"color-#FFFFFF":{color:{boxShadow:"inset 0 0 0 1px #ddd"},check:{color:"#333"}},transparent:{check:{color:"#333"}}},{first:s,last:a,active:l,"color-#FFFFFF":r==="#FFFFFF",transparent:r==="transparent"});return P.createElement(Yi,{color:r,style:u.color,onClick:i,onHover:o,focusStyle:{boxShadow:"0 0 4px "+r}},P.createElement("div",{style:u.check},P.createElement(Gz,null)))},Vz=function(e){var r=e.onClick,n=e.onSwatchHover,i=e.group,o=e.active,s=Pe({default:{group:{paddingBottom:"10px",width:"40px",float:"left",marginRight:"10px"}}});return P.createElement("div",{style:s.group},Xi(i,function(a,l){return P.createElement(Wz,{key:a,color:a,active:a.toLowerCase()===o,first:l===0,last:l===i.length-1,onClick:r,onSwatchHover:n})}))},Lp=function(e){var r=e.width,n=e.height,i=e.onChange,o=e.onSwatchHover,s=e.colors,a=e.hex,l=e.styles,u=l===void 0?{}:l,d=e.className,h=d===void 0?"":d,f=Pe(or({default:{picker:{width:r,height:n},overflow:{height:n,overflowY:"scroll"},body:{padding:"16px 0 6px 16px"},clear:{clear:"both"}}},u)),p=function(g,b){return i({hex:g,source:"hex"},b)};return P.createElement("div",{style:f.picker,className:"swatches-picker "+h},P.createElement(Ja,null,P.createElement("div",{style:f.overflow},P.createElement("div",{style:f.body},Xi(s,function(v){return P.createElement(Vz,{key:v.toString(),group:v,active:a,onClick:p,onSwatchHover:o})}),P.createElement("div",{style:f.clear})))))};Lp.propTypes={width:he.oneOfType([he.string,he.number]),height:he.oneOfType([he.string,he.number]),colors:he.arrayOf(he.arrayOf(he.string)),styles:he.object};Lp.defaultProps={width:320,height:240,colors:[[go[900],go[700],go[500],go[300],go[100]],[mo[900],mo[700],mo[500],mo[300],mo[100]],[vo[900],vo[700],vo[500],vo[300],vo[100]],[yo[900],yo[700],yo[500],yo[300],yo[100]],[bo[900],bo[700],bo[500],bo[300],bo[100]],[xo[900],xo[700],xo[500],xo[300],xo[100]],[wo[900],wo[700],wo[500],wo[300],wo[100]],[_o[900],_o[700],_o[500],_o[300],_o[100]],[So[900],So[700],So[500],So[300],So[100]],["#194D33",ta[700],ta[500],ta[300],ta[100]],[ko[900],ko[700],ko[500],ko[300],ko[100]],[jo[900],jo[700],jo[500],jo[300],jo[100]],[Eo[900],Eo[700],Eo[500],Eo[300],Eo[100]],[Co[900],Co[700],Co[500],Co[300],Co[100]],[To[900],To[700],To[500],To[300],To[100]],[No[900],No[700],No[500],No[300],No[100]],[Oo[900],Oo[700],Oo[500],Oo[300],Oo[100]],[Ro[900],Ro[700],Ro[500],Ro[300],Ro[100]],["#000000","#525252","#969696","#D9D9D9","#FFFFFF"]],styles:{}};sr(Lp);var zp=function(e){var r=e.onChange,n=e.onSwatchHover,i=e.hex,o=e.colors,s=e.width,a=e.triangle,l=e.styles,u=l===void 0?{}:l,d=e.className,h=d===void 0?"":d,f=Pe(or({default:{card:{width:s,background:"#fff",border:"0 solid rgba(0,0,0,0.25)",boxShadow:"0 1px 4px rgba(0,0,0,0.25)",borderRadius:"4px",position:"relative"},body:{padding:"15px 9px 9px 15px"},label:{fontSize:"18px",color:"#fff"},triangle:{width:"0px",height:"0px",borderStyle:"solid",borderWidth:"0 9px 10px 9px",borderColor:"transparent transparent #fff transparent",position:"absolute"},triangleShadow:{width:"0px",height:"0px",borderStyle:"solid",borderWidth:"0 9px 10px 9px",borderColor:"transparent transparent rgba(0,0,0,.1) transparent",position:"absolute"},hash:{background:"#F0F0F0",height:"30px",width:"30px",borderRadius:"4px 0 0 4px",float:"left",color:"#98A1A4",display:"flex",alignItems:"center",justifyContent:"center"},input:{width:"100px",fontSize:"14px",color:"#666",border:"0px",outline:"none",height:"28px",boxShadow:"inset 0 0 0 1px #F0F0F0",boxSizing:"content-box",borderRadius:"0 4px 4px 0",float:"left",paddingLeft:"8px"},swatch:{width:"30px",height:"30px",float:"left",borderRadius:"4px",margin:"0 6px 6px 0"},clear:{clear:"both"}},"hide-triangle":{triangle:{display:"none"},triangleShadow:{display:"none"}},"top-left-triangle":{triangle:{top:"-10px",left:"12px"},triangleShadow:{top:"-11px",left:"12px"}},"top-right-triangle":{triangle:{top:"-10px",right:"12px"},triangleShadow:{top:"-11px",right:"12px"}}},u),{"hide-triangle":a==="hide","top-left-triangle":a==="top-left","top-right-triangle":a==="top-right"}),p=function(g,b){si(g)&&r({hex:g,source:"hex"},b)};return P.createElement("div",{style:f.card,className:"twitter-picker "+h},P.createElement("div",{style:f.triangleShadow}),P.createElement("div",{style:f.triangle}),P.createElement("div",{style:f.body},Xi(o,function(v,g){return P.createElement(Yi,{key:g,color:v,hex:v,style:f.swatch,onClick:p,onHover:n,focusStyle:{boxShadow:"0 0 4px "+v}})}),P.createElement("div",{style:f.hash},"#"),P.createElement(Ue,{label:null,style:{input:f.input},value:i.replace("#",""),onChange:p}),P.createElement("div",{style:f.clear})))};zp.propTypes={width:he.oneOfType([he.string,he.number]),triangle:he.oneOf(["hide","top-left","top-right"]),colors:he.arrayOf(he.string),styles:he.object};zp.defaultProps={width:276,colors:["#FF6900","#FCB900","#7BDCB5","#00D084","#8ED1FC","#0693E3","#ABB8C3","#EB144C","#F78DA7","#9900EF"],triangle:"top-left",styles:{}};sr(zp);var Fp=function(e){var r=Pe({default:{picker:{width:"20px",height:"20px",borderRadius:"22px",border:"2px #fff solid",transform:"translate(-12px, -13px)",background:"hsl("+Math.round(e.hsl.h)+", "+Math.round(e.hsl.s*100)+"%, "+Math.round(e.hsl.l*100)+"%)"}}});return P.createElement("div",{style:r.picker})};Fp.propTypes={hsl:he.shape({h:he.number,s:he.number,l:he.number,a:he.number})};Fp.defaultProps={hsl:{a:1,h:249.94,l:.2,s:.5}};var Bp=function(e){var r=Pe({default:{picker:{width:"20px",height:"20px",borderRadius:"22px",transform:"translate(-10px, -7px)",background:"hsl("+Math.round(e.hsl.h)+", 100%, 50%)",border:"2px white solid"}}});return P.createElement("div",{style:r.picker})};Bp.propTypes={hsl:he.shape({h:he.number,s:he.number,l:he.number,a:he.number})};Bp.defaultProps={hsl:{a:1,h:249.94,l:.2,s:.5}};var qz=function(e){var r=e.onChange,n=e.rgb,i=e.hsl,o=e.hex,s=e.hsv,a=function(p,v){if(p.hex)si(p.hex)&&r({hex:p.hex,source:"hex"},v);else if(p.rgb){var g=p.rgb.split(",");vd(p.rgb,"rgb")&&r({r:g[0],g:g[1],b:g[2],a:1,source:"rgb"},v)}else if(p.hsv){var b=p.hsv.split(",");vd(p.hsv,"hsv")&&(b[2]=b[2].replace("%",""),b[1]=b[1].replace("%",""),b[0]=b[0].replace("°",""),b[1]==1?b[1]=.01:b[2]==1&&(b[2]=.01),r({h:Number(b[0]),s:Number(b[1]),v:Number(b[2]),source:"hsv"},v))}else if(p.hsl){var m=p.hsl.split(",");vd(p.hsl,"hsl")&&(m[2]=m[2].replace("%",""),m[1]=m[1].replace("%",""),m[0]=m[0].replace("°",""),h[1]==1?h[1]=.01:h[2]==1&&(h[2]=.01),r({h:Number(m[0]),s:Number(m[1]),v:Number(m[2]),source:"hsl"},v))}},l=Pe({default:{wrap:{display:"flex",height:"100px",marginTop:"4px"},fields:{width:"100%"},column:{paddingTop:"10px",display:"flex",justifyContent:"space-between"},double:{padding:"0px 4.4px",boxSizing:"border-box"},input:{width:"100%",height:"38px",boxSizing:"border-box",padding:"4px 10% 3px",textAlign:"center",border:"1px solid #dadce0",fontSize:"11px",textTransform:"lowercase",borderRadius:"5px",outline:"none",fontFamily:"Roboto,Arial,sans-serif"},input2:{height:"38px",width:"100%",border:"1px solid #dadce0",boxSizing:"border-box",fontSize:"11px",textTransform:"lowercase",borderRadius:"5px",outline:"none",paddingLeft:"10px",fontFamily:"Roboto,Arial,sans-serif"},label:{textAlign:"center",fontSize:"12px",background:"#fff",position:"absolute",textTransform:"uppercase",color:"#3c4043",width:"35px",top:"-6px",left:"0",right:"0",marginLeft:"auto",marginRight:"auto",fontFamily:"Roboto,Arial,sans-serif"},label2:{left:"10px",textAlign:"center",fontSize:"12px",background:"#fff",position:"absolute",textTransform:"uppercase",color:"#3c4043",width:"32px",top:"-6px",fontFamily:"Roboto,Arial,sans-serif"},single:{flexGrow:"1",margin:"0px 4.4px"}}}),u=n.r+", "+n.g+", "+n.b,d=Math.round(i.h)+"°, "+Math.round(i.s*100)+"%, "+Math.round(i.l*100)+"%",h=Math.round(s.h)+"°, "+Math.round(s.s*100)+"%, "+Math.round(s.v*100)+"%";return P.createElement("div",{style:l.wrap,className:"flexbox-fix"},P.createElement("div",{style:l.fields},P.createElement("div",{style:l.double},P.createElement(Ue,{style:{input:l.input,label:l.label},label:"hex",value:o,onChange:a})),P.createElement("div",{style:l.column},P.createElement("div",{style:l.single},P.createElement(Ue,{style:{input:l.input2,label:l.label2},label:"rgb",value:u,onChange:a})),P.createElement("div",{style:l.single},P.createElement(Ue,{style:{input:l.input2,label:l.label2},label:"hsv",value:h,onChange:a})),P.createElement("div",{style:l.single},P.createElement(Ue,{style:{input:l.input2,label:l.label2},label:"hsl",value:d,onChange:a})))))},Up=function(e){var r=e.width,n=e.onChange,i=e.rgb,o=e.hsl,s=e.hsv,a=e.hex,l=e.header,u=e.styles,d=u===void 0?{}:u,h=e.className,f=h===void 0?"":h,p=Pe(or({default:{picker:{width:r,background:"#fff",border:"1px solid #dfe1e5",boxSizing:"initial",display:"flex",flexWrap:"wrap",borderRadius:"8px 8px 0px 0px"},head:{height:"57px",width:"100%",paddingTop:"16px",paddingBottom:"16px",paddingLeft:"16px",fontSize:"20px",boxSizing:"border-box",fontFamily:"Roboto-Regular,HelveticaNeue,Arial,sans-serif"},saturation:{width:"70%",padding:"0px",position:"relative",overflow:"hidden"},swatch:{width:"30%",height:"228px",padding:"0px",background:"rgba("+i.r+", "+i.g+", "+i.b+", 1)",position:"relative",overflow:"hidden"},body:{margin:"auto",width:"95%"},controls:{display:"flex",boxSizing:"border-box",height:"52px",paddingTop:"22px"},color:{width:"32px"},hue:{height:"8px",position:"relative",margin:"0px 16px 0px 16px",width:"100%"},Hue:{radius:"2px"}}},d));return P.createElement("div",{style:p.picker,className:"google-picker "+f},P.createElement("div",{style:p.head},l),P.createElement("div",{style:p.swatch}),P.createElement("div",{style:p.saturation},P.createElement(yu,{hsl:o,hsv:s,pointer:Fp,onChange:n})),P.createElement("div",{style:p.body},P.createElement("div",{style:p.controls,className:"flexbox-fix"},P.createElement("div",{style:p.hue},P.createElement(xs,{style:p.Hue,hsl:o,radius:"4px",pointer:Bp,onChange:n}))),P.createElement(qz,{rgb:i,hsl:o,hex:a,hsv:s,onChange:n})))};Up.propTypes={width:he.oneOfType([he.string,he.number]),styles:he.object,header:he.string};Up.defaultProps={width:652,styles:{},header:"Color picker"};sr(Up);function Kz({color:t,mode:e="blend",onColorChange:r,onClose:n}){var u;const[i,o]=$.useState((t==null?void 0:t.hex)||"#000000");$.useEffect(()=>{t!=null&&t.hex&&o(t.hex)},[t==null?void 0:t.hex]);const s=d=>{const h=d.hex;o(h),r&&r(h)},a=()=>{t!=null&&t.originalHex&&(o(t.originalHex),r&&r(t.originalHex))},l=d=>{const h=d.hex;o(h),r&&r(h)};return t?c.jsxs("div",{className:"color-editor-panel",children:[c.jsxs("div",{className:"editor-header",children:[c.jsx("h3",{children:"Edit Colour"}),c.jsx("button",{onClick:n,className:"close-button",children:"×"})]}),c.jsxs("div",{className:"editor-content",children:[c.jsxs("div",{className:"color-info-section",children:[c.jsx("div",{className:"color-display",children:c.jsxs("div",{className:"swatch-pair",children:[c.jsxs("div",{className:"swatch-group",children:[c.jsx("div",{className:"swatch original",style:{backgroundColor:t.originalHex||t.hex},title:"Original colour"}),c.jsx("span",{className:"swatch-label",children:"Original"})]}),c.jsx("span",{className:"arrow",children:"→"}),c.jsxs("div",{className:"swatch-group",children:[c.jsx("div",{className:"swatch current",style:{backgroundColor:i},title:"Current colour"}),c.jsx("span",{className:"swatch-label",children:"Current"})]})]})}),c.jsxs("div",{className:"color-details",children:[c.jsxs("div",{className:"detail-row",children:[c.jsx("span",{className:"label",children:"Hex:"}),c.jsx("span",{className:"value",children:i})]}),c.jsxs("div",{className:"detail-row",children:[c.jsx("span",{className:"label",children:"Coverage:"}),c.jsxs("span",{className:"value",children:[((u=t.areaPct)==null?void 0:u.toFixed(1))||0,"%"]})]})]})]}),c.jsxs("div",{className:"tpv-palette-section",children:[c.jsx("h4",{children:"Standard TPV Colours"}),c.jsx("p",{className:"palette-description",children:"Select a pure TPV colour (no blending required)"}),c.jsx("div",{className:"tpv-color-grid",children:$i.map(d=>c.jsxs("div",{className:`tpv-color-item ${i.toLowerCase()===d.hex.toLowerCase()?"selected":""}`,onClick:()=>l(d),title:`${d.code} - ${d.name}`,children:[c.jsx("div",{className:"tpv-color-swatch",style:{backgroundColor:d.hex}}),c.jsx("span",{className:"tpv-color-code",children:d.code})]},d.code))})]}),e==="blend"&&c.jsxs("div",{className:"picker-section",children:[c.jsx("h4",{children:"Custom Colour"}),c.jsx("p",{className:"picker-description",children:"Choose any colour (may require blending)"}),c.jsx(xz,{color:i,onChange:s,disableAlpha:!0}),c.jsx("button",{onClick:a,className:"reset-button",children:"Reset to Original Colour"})]}),e==="solid"&&c.jsxs("div",{className:"solid-mode-info",children:[c.jsx("h4",{children:"Solid Mode Editing"}),c.jsx("p",{className:"info-description",children:"In solid mode, you can only select from the standard TPV colours above. Custom colours require blending - switch to Blend Mode for full colour customisation."}),c.jsx("button",{onClick:a,className:"reset-button",children:"Reset to Original Colour"})]})]}),c.jsx("style",{jsx:!0,children:`
        .color-editor-panel {
          position: fixed;
          top: 0;
          right: 0;
          width: 400px;
          height: 100vh;
          background: white;
          box-shadow: -4px 0 12px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 2px solid #1a365d;
          background: #f9f9f9;
        }

        .editor-header h3 {
          font-family: 'Space Grotesk', sans-serif;
          margin: 0;
          color: #1e4a7a;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 2rem;
          color: #666;
          cursor: pointer;
          padding: 0;
          width: 32px;
          height: 32px;
          line-height: 1;
          transition: color 0.2s;
        }

        .close-button:hover {
          color: #333;
        }

        .editor-content {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
        }

        /* Color Info Section */
        .color-info-section {
          margin-bottom: 2rem;
          padding: 1rem;
          background: #f9f9f9;
          border-radius: 6px;
        }

        .color-display {
          margin-bottom: 1rem;
        }

        .swatch-pair {
          display: flex;
          align-items: center;
          gap: 1rem;
          justify-content: center;
        }

        .swatch-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .swatch {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          border: 3px solid #ddd;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .swatch.original {
          border-color: #999;
        }

        .swatch.current {
          border-color: #ff6b35;
        }

        .swatch-label {
          font-size: 0.85rem;
          color: #666;
          font-weight: 500;
        }

        .arrow {
          font-size: 1.5rem;
          color: #666;
          font-weight: bold;
        }

        .color-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.95rem;
        }

        .detail-row .label {
          font-weight: 600;
          color: #666;
        }

        .detail-row .value {
          font-family: 'Courier New', monospace;
          color: #333;
        }

        /* TPV Palette Section */
        .tpv-palette-section {
          margin-bottom: 2rem;
          padding: 1rem;
          background: #f9f9f9;
          border-radius: 6px;
        }

        .tpv-palette-section h4 {
          margin: 0 0 0.5rem 0;
          color: #1a365d;
          font-size: 1rem;
          font-weight: 600;
        }

        .palette-description {
          margin: 0 0 1rem 0;
          font-size: 0.85rem;
          color: #666;
        }

        .tpv-color-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
        }

        .tpv-color-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
          padding: 0.5rem;
          border: 2px solid transparent;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          background: white;
        }

        .tpv-color-item:hover {
          border-color: #ff6b35;
          transform: translateY(-2px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .tpv-color-item.selected {
          border-color: #ff6b35;
          background: #fff5f0;
          box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.2);
        }

        .tpv-color-swatch {
          width: 100%;
          height: 50px;
          border-radius: 4px;
          border: 1px solid rgba(0, 0, 0, 0.1);
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .tpv-color-code {
          font-size: 0.75rem;
          font-weight: 600;
          color: #1a365d;
          font-family: 'Courier New', monospace;
        }

        /* Picker Section */
        .picker-section {
          margin-bottom: 1rem;
          padding: 1rem;
          background: #f9f9f9;
          border-radius: 6px;
        }

        .picker-section h4 {
          margin: 0 0 0.5rem 0;
          color: #1a365d;
          font-size: 1rem;
          font-weight: 600;
        }

        .picker-description {
          margin: 0 0 1rem 0;
          font-size: 0.85rem;
          color: #666;
        }

        .picker-section :global(.chrome-picker) {
          box-shadow: none !important;
          width: 100% !important;
        }

        .reset-button {
          width: 100%;
          padding: 0.75rem;
          margin-top: 1rem;
          background: #e0e0e0;
          color: #333;
          border: none;
          border-radius: 4px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .reset-button:hover {
          background: #d0d0d0;
        }

        /* Solid Mode Info */
        .solid-mode-info {
          margin-bottom: 1rem;
          padding: 1rem;
          background: #fff5f0;
          border: 2px solid #ff6b35;
          border-radius: 6px;
        }

        .solid-mode-info h4 {
          margin: 0 0 0.5rem 0;
          color: #1a365d;
          font-size: 1rem;
          font-weight: 600;
        }

        .info-description {
          margin: 0;
          font-size: 0.85rem;
          color: #666;
          line-height: 1.5;
        }

        /* Mobile Responsive - Fullscreen Modal */
        @media (max-width: 768px) {
          .color-editor-panel {
            width: 100%;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border-radius: 0;
          }

          .editor-header {
            padding: 1rem;
            position: sticky;
            top: 0;
            z-index: 10;
          }

          .editor-header h3 {
            font-size: 1.25rem;
          }

          /* Larger close button for touch */
          .close-button {
            width: 44px;
            height: 44px;
            font-size: 2.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .editor-content {
            padding: 1rem;
          }

          /* Color swatches - larger for touch */
          .swatch {
            width: 50px;
            height: 50px;
          }

          .color-info-section {
            padding: 0.75rem;
            margin-bottom: 1.5rem;
          }

          /* TPV color grid - better touch targets */
          .tpv-color-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 0.5rem;
          }

          .tpv-color-item {
            padding: 0.4rem;
            min-height: 44px;
          }

          .tpv-color-swatch {
            height: 36px;
          }

          .tpv-color-code {
            font-size: 0.65rem;
          }

          .tpv-palette-section {
            padding: 0.75rem;
            margin-bottom: 1.5rem;
          }

          .tpv-palette-section h4 {
            font-size: 0.9rem;
          }

          .palette-description {
            font-size: 0.8rem;
          }

          /* Picker section */
          .picker-section {
            padding: 0.75rem;
          }

          .picker-section h4 {
            font-size: 0.9rem;
          }

          .picker-description {
            font-size: 0.8rem;
          }

          /* Larger reset button for touch */
          .reset-button {
            min-height: 44px;
            font-size: 0.9rem;
          }

          .solid-mode-info {
            padding: 0.75rem;
          }

          .solid-mode-info h4 {
            font-size: 0.9rem;
          }

          .info-description {
            font-size: 0.8rem;
          }
        }

        /* Extra small screens */
        @media (max-width: 400px) {
          .tpv-color-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .tpv-color-swatch {
            height: 44px;
          }

          .swatch {
            width: 44px;
            height: 44px;
          }

          .swatch-pair {
            gap: 0.5rem;
          }

          .arrow {
            font-size: 1.2rem;
          }
        }
      `})]}):null}const yn=11102230246251565e-32,Ut=134217729,Yz=(3+8*yn)*yn;function bd(t,e,r,n,i){let o,s,a,l,u=e[0],d=n[0],h=0,f=0;d>u==d>-u?(o=u,u=e[++h]):(o=d,d=n[++f]);let p=0;if(h<t&&f<r)for(d>u==d>-u?(s=u+o,a=o-(s-u),u=e[++h]):(s=d+o,a=o-(s-d),d=n[++f]),o=s,a!==0&&(i[p++]=a);h<t&&f<r;)d>u==d>-u?(s=o+u,l=s-o,a=o-(s-l)+(u-l),u=e[++h]):(s=o+d,l=s-o,a=o-(s-l)+(d-l),d=n[++f]),o=s,a!==0&&(i[p++]=a);for(;h<t;)s=o+u,l=s-o,a=o-(s-l)+(u-l),u=e[++h],o=s,a!==0&&(i[p++]=a);for(;f<r;)s=o+d,l=s-o,a=o-(s-l)+(d-l),d=n[++f],o=s,a!==0&&(i[p++]=a);return(o!==0||p===0)&&(i[p++]=o),p}function Xz(t,e){let r=e[0];for(let n=1;n<t;n++)r+=e[n];return r}function Qa(t){return new Float64Array(t)}const Zz=(3+16*yn)*yn,Jz=(2+12*yn)*yn,Qz=(9+64*yn)*yn*yn,co=Qa(4),wv=Qa(8),_v=Qa(12),Sv=Qa(16),Vt=Qa(4);function eF(t,e,r,n,i,o,s){let a,l,u,d,h,f,p,v,g,b,m,y,x,w,j,S,C,N;const E=t-i,A=r-i,U=e-o,O=n-o;w=E*O,f=Ut*E,p=f-(f-E),v=E-p,f=Ut*O,g=f-(f-O),b=O-g,j=v*b-(w-p*g-v*g-p*b),S=U*A,f=Ut*U,p=f-(f-U),v=U-p,f=Ut*A,g=f-(f-A),b=A-g,C=v*b-(S-p*g-v*g-p*b),m=j-C,h=j-m,co[0]=j-(m+h)+(h-C),y=w+m,h=y-w,x=w-(y-h)+(m-h),m=x-S,h=x-m,co[1]=x-(m+h)+(h-S),N=y+m,h=N-y,co[2]=y-(N-h)+(m-h),co[3]=N;let F=Xz(4,co),k=Jz*s;if(F>=k||-F>=k||(h=t-E,a=t-(E+h)+(h-i),h=r-A,u=r-(A+h)+(h-i),h=e-U,l=e-(U+h)+(h-o),h=n-O,d=n-(O+h)+(h-o),a===0&&l===0&&u===0&&d===0)||(k=Qz*s+Yz*Math.abs(F),F+=E*d+O*a-(U*u+A*l),F>=k||-F>=k))return F;w=a*O,f=Ut*a,p=f-(f-a),v=a-p,f=Ut*O,g=f-(f-O),b=O-g,j=v*b-(w-p*g-v*g-p*b),S=l*A,f=Ut*l,p=f-(f-l),v=l-p,f=Ut*A,g=f-(f-A),b=A-g,C=v*b-(S-p*g-v*g-p*b),m=j-C,h=j-m,Vt[0]=j-(m+h)+(h-C),y=w+m,h=y-w,x=w-(y-h)+(m-h),m=x-S,h=x-m,Vt[1]=x-(m+h)+(h-S),N=y+m,h=N-y,Vt[2]=y-(N-h)+(m-h),Vt[3]=N;const W=bd(4,co,4,Vt,wv);w=E*d,f=Ut*E,p=f-(f-E),v=E-p,f=Ut*d,g=f-(f-d),b=d-g,j=v*b-(w-p*g-v*g-p*b),S=U*u,f=Ut*U,p=f-(f-U),v=U-p,f=Ut*u,g=f-(f-u),b=u-g,C=v*b-(S-p*g-v*g-p*b),m=j-C,h=j-m,Vt[0]=j-(m+h)+(h-C),y=w+m,h=y-w,x=w-(y-h)+(m-h),m=x-S,h=x-m,Vt[1]=x-(m+h)+(h-S),N=y+m,h=N-y,Vt[2]=y-(N-h)+(m-h),Vt[3]=N;const ie=bd(W,wv,4,Vt,_v);w=a*d,f=Ut*a,p=f-(f-a),v=a-p,f=Ut*d,g=f-(f-d),b=d-g,j=v*b-(w-p*g-v*g-p*b),S=l*u,f=Ut*l,p=f-(f-l),v=l-p,f=Ut*u,g=f-(f-u),b=u-g,C=v*b-(S-p*g-v*g-p*b),m=j-C,h=j-m,Vt[0]=j-(m+h)+(h-C),y=w+m,h=y-w,x=w-(y-h)+(m-h),m=x-S,h=x-m,Vt[1]=x-(m+h)+(h-S),N=y+m,h=N-y,Vt[2]=y-(N-h)+(m-h),Vt[3]=N;const J=bd(ie,_v,4,Vt,Sv);return Sv[J-1]}function Ml(t,e,r,n,i,o){const s=(e-o)*(r-i),a=(t-i)*(n-o),l=s-a,u=Math.abs(s+a);return Math.abs(l)>=Zz*u?l:-eF(t,e,r,n,i,o,u)}const kv=Math.pow(2,-52),Dl=new Uint32Array(512);class Lc{static from(e,r=oF,n=sF){const i=e.length,o=new Float64Array(i*2);for(let s=0;s<i;s++){const a=e[s];o[2*s]=r(a),o[2*s+1]=n(a)}return new Lc(o)}constructor(e){const r=e.length>>1;if(r>0&&typeof e[0]!="number")throw new Error("Expected coords to contain numbers.");this.coords=e;const n=Math.max(2*r-5,0);this._triangles=new Uint32Array(n*3),this._halfedges=new Int32Array(n*3),this._hashSize=Math.ceil(Math.sqrt(r)),this._hullPrev=new Uint32Array(r),this._hullNext=new Uint32Array(r),this._hullTri=new Uint32Array(r),this._hullHash=new Int32Array(this._hashSize),this._ids=new Uint32Array(r),this._dists=new Float64Array(r),this.update()}update(){const{coords:e,_hullPrev:r,_hullNext:n,_hullTri:i,_hullHash:o}=this,s=e.length>>1;let a=1/0,l=1/0,u=-1/0,d=-1/0;for(let E=0;E<s;E++){const A=e[2*E],U=e[2*E+1];A<a&&(a=A),U<l&&(l=U),A>u&&(u=A),U>d&&(d=U),this._ids[E]=E}const h=(a+u)/2,f=(l+d)/2;let p,v,g;for(let E=0,A=1/0;E<s;E++){const U=xd(h,f,e[2*E],e[2*E+1]);U<A&&(p=E,A=U)}const b=e[2*p],m=e[2*p+1];for(let E=0,A=1/0;E<s;E++){if(E===p)continue;const U=xd(b,m,e[2*E],e[2*E+1]);U<A&&U>0&&(v=E,A=U)}let y=e[2*v],x=e[2*v+1],w=1/0;for(let E=0;E<s;E++){if(E===p||E===v)continue;const A=nF(b,m,y,x,e[2*E],e[2*E+1]);A<w&&(g=E,w=A)}let j=e[2*g],S=e[2*g+1];if(w===1/0){for(let U=0;U<s;U++)this._dists[U]=e[2*U]-e[0]||e[2*U+1]-e[1];Go(this._ids,this._dists,0,s-1);const E=new Uint32Array(s);let A=0;for(let U=0,O=-1/0;U<s;U++){const F=this._ids[U],k=this._dists[F];k>O&&(E[A++]=F,O=k)}this.hull=E.subarray(0,A),this.triangles=new Uint32Array(0),this.halfedges=new Uint32Array(0);return}if(Ml(b,m,y,x,j,S)<0){const E=v,A=y,U=x;v=g,y=j,x=S,g=E,j=A,S=U}const C=iF(b,m,y,x,j,S);this._cx=C.x,this._cy=C.y;for(let E=0;E<s;E++)this._dists[E]=xd(e[2*E],e[2*E+1],C.x,C.y);Go(this._ids,this._dists,0,s-1),this._hullStart=p;let N=3;n[p]=r[g]=v,n[v]=r[p]=g,n[g]=r[v]=p,i[p]=0,i[v]=1,i[g]=2,o.fill(-1),o[this._hashKey(b,m)]=p,o[this._hashKey(y,x)]=v,o[this._hashKey(j,S)]=g,this.trianglesLen=0,this._addTriangle(p,v,g,-1,-1,-1);for(let E=0,A,U;E<this._ids.length;E++){const O=this._ids[E],F=e[2*O],k=e[2*O+1];if(E>0&&Math.abs(F-A)<=kv&&Math.abs(k-U)<=kv||(A=F,U=k,O===p||O===v||O===g))continue;let W=0;for(let oe=0,H=this._hashKey(F,k);oe<this._hashSize&&(W=o[(H+oe)%this._hashSize],!(W!==-1&&W!==n[W]));oe++);W=r[W];let ie=W,J;for(;J=n[ie],Ml(F,k,e[2*ie],e[2*ie+1],e[2*J],e[2*J+1])>=0;)if(ie=J,ie===W){ie=-1;break}if(ie===-1)continue;let K=this._addTriangle(ie,O,n[ie],-1,-1,i[ie]);i[O]=this._legalize(K+2),i[ie]=K,N++;let L=n[ie];for(;J=n[L],Ml(F,k,e[2*L],e[2*L+1],e[2*J],e[2*J+1])<0;)K=this._addTriangle(L,O,J,i[O],-1,i[L]),i[O]=this._legalize(K+2),n[L]=L,N--,L=J;if(ie===W)for(;J=r[ie],Ml(F,k,e[2*J],e[2*J+1],e[2*ie],e[2*ie+1])<0;)K=this._addTriangle(J,O,ie,-1,i[ie],i[J]),this._legalize(K+2),i[J]=K,n[ie]=ie,N--,ie=J;this._hullStart=r[O]=ie,n[ie]=r[L]=O,n[O]=L,o[this._hashKey(F,k)]=O,o[this._hashKey(e[2*ie],e[2*ie+1])]=ie}this.hull=new Uint32Array(N);for(let E=0,A=this._hullStart;E<N;E++)this.hull[E]=A,A=n[A];this.triangles=this._triangles.subarray(0,this.trianglesLen),this.halfedges=this._halfedges.subarray(0,this.trianglesLen)}_hashKey(e,r){return Math.floor(tF(e-this._cx,r-this._cy)*this._hashSize)%this._hashSize}_legalize(e){const{_triangles:r,_halfedges:n,coords:i}=this;let o=0,s=0;for(;;){const a=n[e],l=e-e%3;if(s=l+(e+2)%3,a===-1){if(o===0)break;e=Dl[--o];continue}const u=a-a%3,d=l+(e+1)%3,h=u+(a+2)%3,f=r[s],p=r[e],v=r[d],g=r[h];if(rF(i[2*f],i[2*f+1],i[2*p],i[2*p+1],i[2*v],i[2*v+1],i[2*g],i[2*g+1])){r[e]=g,r[a]=f;const m=n[h];if(m===-1){let x=this._hullStart;do{if(this._hullTri[x]===h){this._hullTri[x]=e;break}x=this._hullPrev[x]}while(x!==this._hullStart)}this._link(e,m),this._link(a,n[s]),this._link(s,h);const y=u+(a+1)%3;o<Dl.length&&(Dl[o++]=y)}else{if(o===0)break;e=Dl[--o]}}return s}_link(e,r){this._halfedges[e]=r,r!==-1&&(this._halfedges[r]=e)}_addTriangle(e,r,n,i,o,s){const a=this.trianglesLen;return this._triangles[a]=e,this._triangles[a+1]=r,this._triangles[a+2]=n,this._link(a,i),this._link(a+1,o),this._link(a+2,s),this.trianglesLen+=3,a}}function tF(t,e){const r=t/(Math.abs(t)+Math.abs(e));return(e>0?3-r:1+r)/4}function xd(t,e,r,n){const i=t-r,o=e-n;return i*i+o*o}function rF(t,e,r,n,i,o,s,a){const l=t-s,u=e-a,d=r-s,h=n-a,f=i-s,p=o-a,v=l*l+u*u,g=d*d+h*h,b=f*f+p*p;return l*(h*b-g*p)-u*(d*b-g*f)+v*(d*p-h*f)<0}function nF(t,e,r,n,i,o){const s=r-t,a=n-e,l=i-t,u=o-e,d=s*s+a*a,h=l*l+u*u,f=.5/(s*u-a*l),p=(u*d-a*h)*f,v=(s*h-l*d)*f;return p*p+v*v}function iF(t,e,r,n,i,o){const s=r-t,a=n-e,l=i-t,u=o-e,d=s*s+a*a,h=l*l+u*u,f=.5/(s*u-a*l),p=t+(u*d-a*h)*f,v=e+(s*h-l*d)*f;return{x:p,y:v}}function Go(t,e,r,n){if(n-r<=20)for(let i=r+1;i<=n;i++){const o=t[i],s=e[o];let a=i-1;for(;a>=r&&e[t[a]]>s;)t[a+1]=t[a--];t[a+1]=o}else{const i=r+n>>1;let o=r+1,s=n;Vs(t,i,o),e[t[r]]>e[t[n]]&&Vs(t,r,n),e[t[o]]>e[t[n]]&&Vs(t,o,n),e[t[r]]>e[t[o]]&&Vs(t,r,o);const a=t[o],l=e[a];for(;;){do o++;while(e[t[o]]<l);do s--;while(e[t[s]]>l);if(s<o)break;Vs(t,o,s)}t[r+1]=t[s],t[s]=a,n-o+1>=s-r?(Go(t,e,o,n),Go(t,e,r,s-1)):(Go(t,e,r,s-1),Go(t,e,o,n))}}function Vs(t,e,r){const n=t[e];t[e]=t[r],t[r]=n}function oF(t){return t[0]}function sF(t){return t[1]}const jv=1e-6;class Ri{constructor(){this._x0=this._y0=this._x1=this._y1=null,this._=""}moveTo(e,r){this._+=`M${this._x0=this._x1=+e},${this._y0=this._y1=+r}`}closePath(){this._x1!==null&&(this._x1=this._x0,this._y1=this._y0,this._+="Z")}lineTo(e,r){this._+=`L${this._x1=+e},${this._y1=+r}`}arc(e,r,n){e=+e,r=+r,n=+n;const i=e+n,o=r;if(n<0)throw new Error("negative radius");this._x1===null?this._+=`M${i},${o}`:(Math.abs(this._x1-i)>jv||Math.abs(this._y1-o)>jv)&&(this._+="L"+i+","+o),n&&(this._+=`A${n},${n},0,1,1,${e-n},${r}A${n},${n},0,1,1,${this._x1=i},${this._y1=o}`)}rect(e,r,n,i){this._+=`M${this._x0=this._x1=+e},${this._y0=this._y1=+r}h${+n}v${+i}h${-n}Z`}value(){return this._||null}}class Vh{constructor(){this._=[]}moveTo(e,r){this._.push([e,r])}closePath(){this._.push(this._[0].slice())}lineTo(e,r){this._.push([e,r])}value(){return this._.length?this._:null}}class aF{constructor(e,[r,n,i,o]=[0,0,960,500]){if(!((i=+i)>=(r=+r))||!((o=+o)>=(n=+n)))throw new Error("invalid bounds");this.delaunay=e,this._circumcenters=new Float64Array(e.points.length*2),this.vectors=new Float64Array(e.points.length*2),this.xmax=i,this.xmin=r,this.ymax=o,this.ymin=n,this._init()}update(){return this.delaunay.update(),this._init(),this}_init(){const{delaunay:{points:e,hull:r,triangles:n},vectors:i}=this;let o,s;const a=this.circumcenters=this._circumcenters.subarray(0,n.length/3*2);for(let g=0,b=0,m=n.length,y,x;g<m;g+=3,b+=2){const w=n[g]*2,j=n[g+1]*2,S=n[g+2]*2,C=e[w],N=e[w+1],E=e[j],A=e[j+1],U=e[S],O=e[S+1],F=E-C,k=A-N,W=U-C,ie=O-N,J=(F*ie-k*W)*2;if(Math.abs(J)<1e-9){if(o===void 0){o=s=0;for(const L of r)o+=e[L*2],s+=e[L*2+1];o/=r.length,s/=r.length}const K=1e9*Math.sign((o-C)*ie-(s-N)*W);y=(C+U)/2-K*ie,x=(N+O)/2+K*W}else{const K=1/J,L=F*F+k*k,oe=W*W+ie*ie;y=C+(ie*L-k*oe)*K,x=N+(F*oe-W*L)*K}a[b]=y,a[b+1]=x}let l=r[r.length-1],u,d=l*4,h,f=e[2*l],p,v=e[2*l+1];i.fill(0);for(let g=0;g<r.length;++g)l=r[g],u=d,h=f,p=v,d=l*4,f=e[2*l],v=e[2*l+1],i[u+2]=i[d]=p-v,i[u+3]=i[d+1]=f-h}render(e){const r=e==null?e=new Ri:void 0,{delaunay:{halfedges:n,inedges:i,hull:o},circumcenters:s,vectors:a}=this;if(o.length<=1)return null;for(let d=0,h=n.length;d<h;++d){const f=n[d];if(f<d)continue;const p=Math.floor(d/3)*2,v=Math.floor(f/3)*2,g=s[p],b=s[p+1],m=s[v],y=s[v+1];this._renderSegment(g,b,m,y,e)}let l,u=o[o.length-1];for(let d=0;d<o.length;++d){l=u,u=o[d];const h=Math.floor(i[u]/3)*2,f=s[h],p=s[h+1],v=l*4,g=this._project(f,p,a[v+2],a[v+3]);g&&this._renderSegment(f,p,g[0],g[1],e)}return r&&r.value()}renderBounds(e){const r=e==null?e=new Ri:void 0;return e.rect(this.xmin,this.ymin,this.xmax-this.xmin,this.ymax-this.ymin),r&&r.value()}renderCell(e,r){const n=r==null?r=new Ri:void 0,i=this._clip(e);if(i===null||!i.length)return;r.moveTo(i[0],i[1]);let o=i.length;for(;i[0]===i[o-2]&&i[1]===i[o-1]&&o>1;)o-=2;for(let s=2;s<o;s+=2)(i[s]!==i[s-2]||i[s+1]!==i[s-1])&&r.lineTo(i[s],i[s+1]);return r.closePath(),n&&n.value()}*cellPolygons(){const{delaunay:{points:e}}=this;for(let r=0,n=e.length/2;r<n;++r){const i=this.cellPolygon(r);i&&(i.index=r,yield i)}}cellPolygon(e){const r=new Vh;return this.renderCell(e,r),r.value()}_renderSegment(e,r,n,i,o){let s;const a=this._regioncode(e,r),l=this._regioncode(n,i);a===0&&l===0?(o.moveTo(e,r),o.lineTo(n,i)):(s=this._clipSegment(e,r,n,i,a,l))&&(o.moveTo(s[0],s[1]),o.lineTo(s[2],s[3]))}contains(e,r,n){return r=+r,r!==r||(n=+n,n!==n)?!1:this.delaunay._step(e,r,n)===e}*neighbors(e){const r=this._clip(e);if(r)for(const n of this.delaunay.neighbors(e)){const i=this._clip(n);if(i){e:for(let o=0,s=r.length;o<s;o+=2)for(let a=0,l=i.length;a<l;a+=2)if(r[o]===i[a]&&r[o+1]===i[a+1]&&r[(o+2)%s]===i[(a+l-2)%l]&&r[(o+3)%s]===i[(a+l-1)%l]){yield n;break e}}}}_cell(e){const{circumcenters:r,delaunay:{inedges:n,halfedges:i,triangles:o}}=this,s=n[e];if(s===-1)return null;const a=[];let l=s;do{const u=Math.floor(l/3);if(a.push(r[u*2],r[u*2+1]),l=l%3===2?l-2:l+1,o[l]!==e)break;l=i[l]}while(l!==s&&l!==-1);return a}_clip(e){if(e===0&&this.delaunay.hull.length===1)return[this.xmax,this.ymin,this.xmax,this.ymax,this.xmin,this.ymax,this.xmin,this.ymin];const r=this._cell(e);if(r===null)return null;const{vectors:n}=this,i=e*4;return this._simplify(n[i]||n[i+1]?this._clipInfinite(e,r,n[i],n[i+1],n[i+2],n[i+3]):this._clipFinite(e,r))}_clipFinite(e,r){const n=r.length;let i=null,o,s,a=r[n-2],l=r[n-1],u,d=this._regioncode(a,l),h,f=0;for(let p=0;p<n;p+=2)if(o=a,s=l,a=r[p],l=r[p+1],u=d,d=this._regioncode(a,l),u===0&&d===0)h=f,f=0,i?i.push(a,l):i=[a,l];else{let v,g,b,m,y;if(u===0){if((v=this._clipSegment(o,s,a,l,u,d))===null)continue;[g,b,m,y]=v}else{if((v=this._clipSegment(a,l,o,s,d,u))===null)continue;[m,y,g,b]=v,h=f,f=this._edgecode(g,b),h&&f&&this._edge(e,h,f,i,i.length),i?i.push(g,b):i=[g,b]}h=f,f=this._edgecode(m,y),h&&f&&this._edge(e,h,f,i,i.length),i?i.push(m,y):i=[m,y]}if(i)h=f,f=this._edgecode(i[0],i[1]),h&&f&&this._edge(e,h,f,i,i.length);else if(this.contains(e,(this.xmin+this.xmax)/2,(this.ymin+this.ymax)/2))return[this.xmax,this.ymin,this.xmax,this.ymax,this.xmin,this.ymax,this.xmin,this.ymin];return i}_clipSegment(e,r,n,i,o,s){const a=o<s;for(a&&([e,r,n,i,o,s]=[n,i,e,r,s,o]);;){if(o===0&&s===0)return a?[n,i,e,r]:[e,r,n,i];if(o&s)return null;let l,u,d=o||s;d&8?(l=e+(n-e)*(this.ymax-r)/(i-r),u=this.ymax):d&4?(l=e+(n-e)*(this.ymin-r)/(i-r),u=this.ymin):d&2?(u=r+(i-r)*(this.xmax-e)/(n-e),l=this.xmax):(u=r+(i-r)*(this.xmin-e)/(n-e),l=this.xmin),o?(e=l,r=u,o=this._regioncode(e,r)):(n=l,i=u,s=this._regioncode(n,i))}}_clipInfinite(e,r,n,i,o,s){let a=Array.from(r),l;if((l=this._project(a[0],a[1],n,i))&&a.unshift(l[0],l[1]),(l=this._project(a[a.length-2],a[a.length-1],o,s))&&a.push(l[0],l[1]),a=this._clipFinite(e,a))for(let u=0,d=a.length,h,f=this._edgecode(a[d-2],a[d-1]);u<d;u+=2)h=f,f=this._edgecode(a[u],a[u+1]),h&&f&&(u=this._edge(e,h,f,a,u),d=a.length);else this.contains(e,(this.xmin+this.xmax)/2,(this.ymin+this.ymax)/2)&&(a=[this.xmin,this.ymin,this.xmax,this.ymin,this.xmax,this.ymax,this.xmin,this.ymax]);return a}_edge(e,r,n,i,o){for(;r!==n;){let s,a;switch(r){case 5:r=4;continue;case 4:r=6,s=this.xmax,a=this.ymin;break;case 6:r=2;continue;case 2:r=10,s=this.xmax,a=this.ymax;break;case 10:r=8;continue;case 8:r=9,s=this.xmin,a=this.ymax;break;case 9:r=1;continue;case 1:r=5,s=this.xmin,a=this.ymin;break}(i[o]!==s||i[o+1]!==a)&&this.contains(e,s,a)&&(i.splice(o,0,s,a),o+=2)}return o}_project(e,r,n,i){let o=1/0,s,a,l;if(i<0){if(r<=this.ymin)return null;(s=(this.ymin-r)/i)<o&&(l=this.ymin,a=e+(o=s)*n)}else if(i>0){if(r>=this.ymax)return null;(s=(this.ymax-r)/i)<o&&(l=this.ymax,a=e+(o=s)*n)}if(n>0){if(e>=this.xmax)return null;(s=(this.xmax-e)/n)<o&&(a=this.xmax,l=r+(o=s)*i)}else if(n<0){if(e<=this.xmin)return null;(s=(this.xmin-e)/n)<o&&(a=this.xmin,l=r+(o=s)*i)}return[a,l]}_edgecode(e,r){return(e===this.xmin?1:e===this.xmax?2:0)|(r===this.ymin?4:r===this.ymax?8:0)}_regioncode(e,r){return(e<this.xmin?1:e>this.xmax?2:0)|(r<this.ymin?4:r>this.ymax?8:0)}_simplify(e){if(e&&e.length>4){for(let r=0;r<e.length;r+=2){const n=(r+2)%e.length,i=(r+4)%e.length;(e[r]===e[n]&&e[n]===e[i]||e[r+1]===e[n+1]&&e[n+1]===e[i+1])&&(e.splice(n,2),r-=2)}e.length||(e=null)}return e}}const lF=2*Math.PI,uo=Math.pow;function cF(t){return t[0]}function uF(t){return t[1]}function dF(t){const{triangles:e,coords:r}=t;for(let n=0;n<e.length;n+=3){const i=2*e[n],o=2*e[n+1],s=2*e[n+2];if((r[s]-r[i])*(r[o+1]-r[i+1])-(r[o]-r[i])*(r[s+1]-r[i+1])>1e-10)return!1}return!0}function hF(t,e,r){return[t+Math.sin(t+e)*r,e+Math.cos(t-e)*r]}class Hp{static from(e,r=cF,n=uF,i){return new Hp("length"in e?fF(e,r,n,i):Float64Array.from(pF(e,r,n,i)))}constructor(e){this._delaunator=new Lc(e),this.inedges=new Int32Array(e.length/2),this._hullIndex=new Int32Array(e.length/2),this.points=this._delaunator.coords,this._init()}update(){return this._delaunator.update(),this._init(),this}_init(){const e=this._delaunator,r=this.points;if(e.hull&&e.hull.length>2&&dF(e)){this.collinear=Int32Array.from({length:r.length/2},(f,p)=>p).sort((f,p)=>r[2*f]-r[2*p]||r[2*f+1]-r[2*p+1]);const l=this.collinear[0],u=this.collinear[this.collinear.length-1],d=[r[2*l],r[2*l+1],r[2*u],r[2*u+1]],h=1e-8*Math.hypot(d[3]-d[1],d[2]-d[0]);for(let f=0,p=r.length/2;f<p;++f){const v=hF(r[2*f],r[2*f+1],h);r[2*f]=v[0],r[2*f+1]=v[1]}this._delaunator=new Lc(r)}else delete this.collinear;const n=this.halfedges=this._delaunator.halfedges,i=this.hull=this._delaunator.hull,o=this.triangles=this._delaunator.triangles,s=this.inedges.fill(-1),a=this._hullIndex.fill(-1);for(let l=0,u=n.length;l<u;++l){const d=o[l%3===2?l-2:l+1];(n[l]===-1||s[d]===-1)&&(s[d]=l)}for(let l=0,u=i.length;l<u;++l)a[i[l]]=l;i.length<=2&&i.length>0&&(this.triangles=new Int32Array(3).fill(-1),this.halfedges=new Int32Array(3).fill(-1),this.triangles[0]=i[0],s[i[0]]=1,i.length===2&&(s[i[1]]=0,this.triangles[1]=i[1],this.triangles[2]=i[1]))}voronoi(e){return new aF(this,e)}*neighbors(e){const{inedges:r,hull:n,_hullIndex:i,halfedges:o,triangles:s,collinear:a}=this;if(a){const h=a.indexOf(e);h>0&&(yield a[h-1]),h<a.length-1&&(yield a[h+1]);return}const l=r[e];if(l===-1)return;let u=l,d=-1;do{if(yield d=s[u],u=u%3===2?u-2:u+1,s[u]!==e)return;if(u=o[u],u===-1){const h=n[(i[e]+1)%n.length];h!==d&&(yield h);return}}while(u!==l)}find(e,r,n=0){if(e=+e,e!==e||(r=+r,r!==r))return-1;const i=n;let o;for(;(o=this._step(n,e,r))>=0&&o!==n&&o!==i;)n=o;return o}_step(e,r,n){const{inedges:i,hull:o,_hullIndex:s,halfedges:a,triangles:l,points:u}=this;if(i[e]===-1||!u.length)return(e+1)%(u.length>>1);let d=e,h=uo(r-u[e*2],2)+uo(n-u[e*2+1],2);const f=i[e];let p=f;do{let v=l[p];const g=uo(r-u[v*2],2)+uo(n-u[v*2+1],2);if(g<h&&(h=g,d=v),p=p%3===2?p-2:p+1,l[p]!==e)break;if(p=a[p],p===-1){if(p=o[(s[e]+1)%o.length],p!==v&&uo(r-u[p*2],2)+uo(n-u[p*2+1],2)<h)return p;break}}while(p!==f);return d}render(e){const r=e==null?e=new Ri:void 0,{points:n,halfedges:i,triangles:o}=this;for(let s=0,a=i.length;s<a;++s){const l=i[s];if(l<s)continue;const u=o[s]*2,d=o[l]*2;e.moveTo(n[u],n[u+1]),e.lineTo(n[d],n[d+1])}return this.renderHull(e),r&&r.value()}renderPoints(e,r){r===void 0&&(!e||typeof e.moveTo!="function")&&(r=e,e=null),r=r==null?2:+r;const n=e==null?e=new Ri:void 0,{points:i}=this;for(let o=0,s=i.length;o<s;o+=2){const a=i[o],l=i[o+1];e.moveTo(a+r,l),e.arc(a,l,r,0,lF)}return n&&n.value()}renderHull(e){const r=e==null?e=new Ri:void 0,{hull:n,points:i}=this,o=n[0]*2,s=n.length;e.moveTo(i[o],i[o+1]);for(let a=1;a<s;++a){const l=2*n[a];e.lineTo(i[l],i[l+1])}return e.closePath(),r&&r.value()}hullPolygon(){const e=new Vh;return this.renderHull(e),e.value()}renderTriangle(e,r){const n=r==null?r=new Ri:void 0,{points:i,triangles:o}=this,s=o[e*=3]*2,a=o[e+1]*2,l=o[e+2]*2;return r.moveTo(i[s],i[s+1]),r.lineTo(i[a],i[a+1]),r.lineTo(i[l],i[l+1]),r.closePath(),n&&n.value()}*trianglePolygons(){const{triangles:e}=this;for(let r=0,n=e.length/3;r<n;++r)yield this.trianglePolygon(r)}trianglePolygon(e){const r=new Vh;return this.renderTriangle(e,r),r.value()}}function fF(t,e,r,n){const i=t.length,o=new Float64Array(i*2);for(let s=0;s<i;++s){const a=t[s];o[s*2]=e.call(n,a,s,t),o[s*2+1]=r.call(n,a,s,t)}return o}function*pF(t,e,r,n){let i=0;for(const o of t)yield e.call(n,o,i,t),yield r.call(n,o,i,t),++i}const Ii=[{code:"RH01",name:"Standard Red",hex:"#B71E2D",R:183,G:30,B:45,L:39.4,a:58.5,b:29},{code:"RH02",name:"Bright Red",hex:"#E31D25",R:227,G:29,B:37,L:47.4,a:70.1,b:44},{code:"RH10",name:"Standard Green",hex:"#006B3F",R:0,G:107,B:63,L:40.5,a:-42.2,b:17.9},{code:"RH11",name:"Bright Green",hex:"#4BAA34",R:75,G:170,B:52,L:62.1,a:-47.7,b:47.2},{code:"RH12",name:"Dark Green",hex:"#006747",R:0,G:103,B:71,L:39.6,a:-38.3,b:13.1},{code:"RH20",name:"Standard Blue",hex:"#1B4F9C",R:27,G:79,B:156,L:36.4,a:14.2,b:-46.7},{code:"RH21",name:"Purple",hex:"#662D91",R:102,G:45,B:145,L:31.5,a:41.9,b:-40.9},{code:"RH22",name:"Light Blue",hex:"#0091D7",R:0,G:145,B:215,L:55.3,a:-19.1,b:-37.3},{code:"RH23",name:"Azure",hex:"#0076B6",R:0,G:118,B:182,L:47.7,a:-4.8,b:-34.8},{code:"RH26",name:"Turquoise",hex:"#00A499",R:0,G:164,B:153,L:58.8,a:-38.4,b:-3},{code:"RH30",name:"Standard Beige",hex:"#D4B585",R:212,G:181,B:133,L:75.2,a:3.8,b:24.8},{code:"RH31",name:"Cream",hex:"#F2E6C8",R:242,G:230,B:200,L:91.8,a:-.5,b:12.5},{code:"RH32",name:"Brown",hex:"#754C29",R:117,G:76,B:41,L:40,a:15.9,b:27.1},{code:"RH90",name:"Funky Pink",hex:"#e8457e",R:232,G:69,B:126,L:55,a:66.1,b:4.9},{code:"RH40",name:"Mustard Yellow",hex:"#C6972D",R:198,G:151,B:45,L:66,a:8.4,b:56.3},{code:"RH41",name:"Bright Yellow",hex:"#FFD100",R:255,G:209,B:0,L:86.9,a:-1,b:90.6},{code:"RH50",name:"Orange",hex:"#F47920",R:244,G:121,B:32,L:63.2,a:49.8,b:60.2},{code:"RH60",name:"Dark Grey",hex:"#4D4F53",R:77,G:79,B:83,L:34.1,a:-.4,b:-2.4},{code:"RH61",name:"Light Grey",hex:"#A7A8AA",R:167,G:168,B:170,L:69,a:-.5,b:-1},{code:"RH65",name:"Pale Grey",hex:"#DCDDDE",R:220,G:221,B:222,L:87.6,a:-.2,b:-.7},{code:"RH70",name:"Black",hex:"#101820",R:16,G:24,B:32,L:9.1,a:-.3,b:-6.3}],gF=new Map(Ii.map((t,e)=>[t.code,e]));function S1(t){return function(){let e=t+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function mF(t,e,r,n=30,i=Math.random){const o=r/Math.sqrt(2),s=Math.ceil(t/o),a=Math.ceil(e/o),l=new Array(s*a).fill(-1),u=[],d=[];function h(p,v){const g=[p,v];u.push(g);const b=Math.floor(p/o),m=Math.floor(v/o);return l[m*s+b]=u.length-1,d.push(u.length-1),g}function f(p,v){const g=Math.floor(p/o),b=Math.floor(v/o);for(let m=Math.max(0,g-2);m<=Math.min(s-1,g+2);m++)for(let y=Math.max(0,b-2);y<=Math.min(a-1,b+2);y++){const x=l[y*s+m];if(x!==-1){const w=p-u[x][0],j=v-u[x][1];if(w*w+j*j<r*r)return!0}}return!1}for(h(t*i(),e*i());d.length>0;){const p=Math.floor(i()*d.length),v=d[p],g=u[v];let b=!1;for(let m=0;m<n;m++){const y=2*Math.PI*i(),x=r+r*i(),w=g[0]+x*Math.cos(y),j=g[1]+x*Math.sin(y);if(w>=0&&w<t&&j>=0&&j<e&&!f(w,j)){h(w,j),b=!0;break}}b||d.splice(p,1)}return u}const wd={Xn:.95047,Yn:1,Zn:1.08883},vF=[[3.2404542,-1.5371385,-.4985314],[-.969266,1.8760108,.041556],[.0556434,-.2040259,1.0572252]];function _d(t){return t<=.0031308?t*12.92:1.055*Math.pow(t,1/2.4)-.055}function yF(t){return{R:Math.round(_d(t.R)*255),G:Math.round(_d(t.G)*255),B:Math.round(_d(t.B)*255)}}function bF(t){const[e,r,n]=vF;return{R:e[0]*t.X+e[1]*t.Y+e[2]*t.Z,G:r[0]*t.X+r[1]*t.Y+r[2]*t.Z,B:n[0]*t.X+n[1]*t.Y+n[2]*t.Z}}function Sd(t){const e=.20689655172413793;return t>e?Math.pow(t,3):3*e*e*(t-4/29)}function xF(t){const e=(t.L+16)/116,r=t.a/500+e,n=e-t.b/200;return{X:wd.Xn*Sd(r),Y:wd.Yn*Sd(e),Z:wd.Zn*Sd(n)}}function wF(t){const e=xF(t),r=bF(e);return yF(r)}function _F(t){let e=0;if(t.forEach(l=>e+=l),e===0)return"#FFFFFF";let r=0,n=0,i=0;t.forEach((l,u)=>{const d=Ii[u],h=l/e;r+=d.L*h,n+=d.a*h,i+=d.b*h});const s=wF({L:r,a:n,b:i}),a=l=>Math.round(Math.max(0,Math.min(255,l))).toString(16).padStart(2,"0");return`#${a(s.R)}${a(s.G)}${a(s.B)}`}function SF(t){const e=parseInt(t.slice(1,3),16),r=parseInt(t.slice(3,5),16),n=parseInt(t.slice(5,7),16);return{r:e,g:r,b:n}}function kF(t){const{r:e,g:r,b:n}=SF(t);return(e*299+r*587+n*114)/1e3>128?"#000000":"#FFFFFF"}function jF(t){let e=0;const r={},n=[];return t.forEach((i,o)=>{const s=Ii[o];e+=i,r[s.code]=i,n.push({code:s.code,name:s.name,weight:0,parts:i})}),n.forEach(i=>{i.weight=i.parts/e}),{parts:r,components:n,total:e}}function Ev(t){const e=new Map;return!t||!t.parts||Object.entries(t.parts).forEach(([r,n])=>{const i=gF.get(r);i!==void 0&&e.set(i,n)}),e}function EF(t,e,r,n=12345){const i=S1(n),o=t*e,s=Math.sqrt(o/r)*.8;return mF(t,e,s,30,i)}function CF({parts:t,width:e=400,height:r=400,cellCount:n=1e4,seed:i=12345}){const o=$.useRef(null),[s,a]=$.useState(null),[l,u]=$.useState(!0);return $.useEffect(()=>{(async()=>{u(!0);const h=EF(e,r,n,i),p=Hp.from(h).voronoi([0,0,e,r]);a({points:h,voronoi:p,cellCount:h.length}),u(!1)})()},[i,e,r,n]),$.useEffect(()=>{if(!s||!o.current)return;const d=o.current,h=d.getContext("2d");d.width=e,d.height=r,h.fillStyle="#FAFAFA",h.fillRect(0,0,e,r);let f=0;t.forEach(v=>f+=v);const p=TF(s.cellCount,t,f,i);for(let v=0;v<s.cellCount;v++){const g=p[v],b=g===-1?"#FAFAFA":Ii[g].hex,m=s.voronoi.cellPolygon(v);if(!(!m||m.length<3)){h.beginPath(),h.moveTo(m[0][0],m[0][1]);for(let y=1;y<m.length;y++)h.lineTo(m[y][0],m[y][1]);h.closePath(),h.fillStyle=b,h.fill()}}h.strokeStyle="rgba(0, 0, 0, 0.05)",h.lineWidth=.5;for(let v=0;v<s.cellCount;v++){const g=s.voronoi.cellPolygon(v);if(!(!g||g.length<3)){h.beginPath(),h.moveTo(g[0][0],g[0][1]);for(let b=1;b<g.length;b++)h.lineTo(g[b][0],g[b][1]);h.closePath(),h.stroke()}}},[s,t,i,e,r]),c.jsxs("div",{style:{position:"relative",width:e,height:r},children:[c.jsx("canvas",{ref:o,style:{width:"100%",height:"100%",borderRadius:"8px",boxShadow:"0 2px 8px rgba(0,0,0,0.1)"}}),l&&c.jsx("div",{style:{position:"absolute",top:0,left:0,right:0,bottom:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(255,255,255,0.9)",borderRadius:"8px"},children:c.jsx("div",{style:{textAlign:"center",color:"#666"},children:"Generating granules..."})})]})}function TF(t,e,r,n){const i=new Array(t).fill(-1);if(r===0)return i;const o=n+r,s=S1(o),a=Array.from({length:t},(u,d)=>d);for(let u=a.length-1;u>0;u--){const d=Math.floor(s()*(u+1));[a[u],a[d]]=[a[d],a[u]]}let l=0;return e.forEach((u,d)=>{const h=Math.round(u/r*t);for(let f=0;f<h&&l<t;f++)i[a[l]]=d,l++}),i}function NF({initialRecipe:t=null,onBlendChange:e=null,originalColor:r=null}){const[n,i]=$.useState(new Map);$.useEffect(()=>{if(t){const d=Ev(t);i(d)}},[t]);const o=Array.from(n.values()).reduce((d,h)=>d+h,0),s=_F(n);$.useEffect(()=>{if(e){const d=n.size>0?jF(n):null;e({blendHex:s,parts:n,recipe:d})}},[n,s]);const a=$.useCallback(d=>{i(h=>{const f=h.get(d)||0,p=Array.from(h.values()).reduce((g,b)=>g+b,0);if(f>=4||p>=12)return h;const v=new Map(h);return v.set(d,f+1),v})},[]),l=$.useCallback(d=>{const h=n.get(d)||0;h>0&&i(f=>{const p=new Map(f);return h===1?p.delete(d):p.set(d,h-1),p})},[n]),u=$.useCallback(()=>{i(new Map)},[]);return c.jsxs(c.Fragment,{children:[c.jsxs("div",{className:"mini-mixer-widget",children:[r&&c.jsxs("div",{className:"mixer-header",children:[c.jsx("div",{className:"mixer-title",children:"Customise Blend Recipe"}),c.jsxs("div",{className:"original-color-ref",children:[c.jsx("span",{className:"label",children:"Original:"}),c.jsx("div",{className:"color-swatch",style:{backgroundColor:r,cursor:"pointer"},title:`${r} - Click to reset to original recipe`,onClick:()=>{t&&i(Ev(t))}})]})]}),c.jsx("div",{className:"mixer-canvas-section",children:c.jsx(CF,{parts:n,width:700,height:350,cellCount:5e3,seed:12345})}),c.jsx("div",{className:"mix-proportion-bar",children:o===0?c.jsx("div",{className:"proportion-bar-empty"}):Array.from(n.entries()).map(([d,h])=>{const f=h/o*100;return c.jsx("div",{className:"proportion-segment",style:{backgroundColor:Ii[d].hex,flexBasis:`${f}%`},title:`${Ii[d].name}: ${Math.round(f)}%`},d)})}),c.jsxs("div",{className:"blend-preview",children:[c.jsx("div",{className:"blend-preview-label",children:"Blended Result:"}),c.jsxs("div",{className:"blend-preview-color",children:[c.jsx("div",{className:"blend-swatch",style:{backgroundColor:s,color:kF(s)},children:s}),c.jsxs("div",{className:"blend-parts-count",children:[o," ",o===1?"part":"parts"]})]})]}),c.jsxs("div",{className:"mixer-palette-section",children:[c.jsxs("div",{className:"mixer-palette-header",children:[c.jsx("h3",{children:"TPV Color Palette"}),o>0&&c.jsx("button",{className:"clear-btn",onClick:u,children:"Clear All"})]}),c.jsx("div",{className:"mixer-palette-grid",children:Ii.map((d,h)=>{const f=n.get(h)||0;return c.jsxs("div",{className:"mixer-color-item",children:[c.jsx("button",{className:`mixer-color-swatch ${f>0?"has-parts":""}`,style:{backgroundColor:d.hex},onClick:()=>a(h),title:`${d.name} (${d.code})`}),c.jsxs("div",{className:"mixer-color-info",children:[c.jsx("div",{className:"mixer-color-name",children:d.name}),c.jsx("div",{className:"mixer-color-code",children:d.code})]}),c.jsxs("div",{className:"mixer-parts-controls",children:[c.jsx("button",{className:"mixer-parts-btn",onClick:()=>l(h),disabled:f===0,children:"−"}),c.jsx("div",{className:"mixer-parts-count",children:f}),c.jsx("button",{className:"mixer-parts-btn",onClick:()=>a(h),disabled:f>=4||o>=12,title:f>=4?"Max 4 parts per color":o>=12?"Max 12 total parts":"",children:"+"})]})]},h)})})]}),o===0?c.jsx("div",{className:"mixer-instructions",children:"Click colors above to add parts to your blend. The preview updates in real-time."}):o>=12?c.jsx("div",{className:"mixer-instructions",style:{background:"#fef3c7",borderColor:"#fbbf24"},children:"Maximum of 12 parts reached. Remove parts to adjust your blend."}):null]}),c.jsx("style",{children:`
        .mini-mixer-widget {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-top: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .mixer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 2px solid #e5e7eb;
        }

        .mixer-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
        }

        .original-color-ref {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          color: #6b7280;
        }

        .original-color-ref .color-swatch {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          border: 2px solid #d1d5db;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: all 0.2s;
        }

        .original-color-ref .color-swatch:hover {
          transform: scale(1.1);
          border-color: #3b82f6;
          box-shadow: 0 2px 6px rgba(59, 130, 246, 0.3);
        }

        .mixer-canvas-section {
          margin-bottom: 20px;
          display: flex;
          justify-content: center;
        }

        .mix-proportion-bar {
          height: 24px;
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
          margin: 16px 0;
          background: #e5e7eb;
        }

        .proportion-segment {
          transition: all 0.2s ease;
        }

        .proportion-segment:hover {
          filter: brightness(1.1);
          cursor: pointer;
        }

        .proportion-bar-empty {
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%);
        }

        .blend-preview {
          margin-bottom: 24px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 10px;
          border: 1px solid #e5e7eb;
        }

        .blend-preview-label {
          font-weight: 600;
          color: #374151;
          margin-bottom: 12px;
          font-size: 0.95rem;
        }

        .blend-preview-color {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .blend-swatch {
          flex: 1;
          padding: 16px;
          border-radius: 8px;
          text-align: center;
          font-weight: 600;
          font-family: 'Courier New', monospace;
          font-size: 1.1rem;
          border: 2px solid #d1d5db;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .blend-parts-count {
          font-size: 0.9rem;
          color: #6b7280;
          font-weight: 500;
          white-space: nowrap;
        }

        .mixer-palette-section {
          margin-bottom: 16px;
        }

        .mixer-palette-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .mixer-palette-header h3 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: #111827;
        }

        .clear-btn {
          padding: 6px 12px;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .clear-btn:hover {
          background: #dc2626;
          box-shadow: 0 2px 6px rgba(239, 68, 68, 0.3);
        }

        .mixer-palette-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 12px;
          max-height: 400px;
          overflow-y: auto;
          padding: 4px;
        }

        .mixer-color-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 8px;
          background: #f9fafb;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          transition: all 0.2s;
        }

        .mixer-color-item:hover {
          border-color: #3b82f6;
          box-shadow: 0 2px 6px rgba(59, 130, 246, 0.2);
        }

        .mixer-color-swatch {
          width: 100%;
          height: 48px;
          border-radius: 6px;
          border: 2px solid #d1d5db;
          cursor: pointer;
          transition: all 0.2s;
        }

        .mixer-color-swatch:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .mixer-color-swatch.has-parts {
          border-color: #3b82f6;
          border-width: 3px;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .mixer-color-info {
          text-align: center;
        }

        .mixer-color-name {
          font-size: 0.85rem;
          font-weight: 500;
          color: #374151;
          line-height: 1.2;
        }

        .mixer-color-code {
          font-size: 0.75rem;
          color: #9ca3af;
          font-family: 'Courier New', monospace;
        }

        .mixer-parts-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .mixer-parts-btn {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          border: 1px solid #d1d5db;
          background: white;
          color: #374151;
          font-size: 1.2rem;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .mixer-parts-btn:hover:not(:disabled) {
          background: #f3f4f6;
          border-color: #3b82f6;
          color: #3b82f6;
        }

        .mixer-parts-btn:active:not(:disabled) {
          transform: scale(0.95);
        }

        .mixer-parts-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .mixer-parts-count {
          min-width: 24px;
          text-align: center;
          font-weight: 600;
          color: #111827;
          font-size: 0.9rem;
        }

        .mixer-instructions {
          text-align: center;
          color: #6b7280;
          font-size: 0.9rem;
          padding: 16px;
          background: #fffbeb;
          border-radius: 8px;
          border: 1px solid #fde68a;
        }

        @media (max-width: 768px) {
          .mini-mixer-widget {
            padding: 16px;
          }

          .mixer-canvas-section canvas {
            max-width: 100%;
            height: auto !important;
          }

          .mixer-palette-grid {
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
            gap: 8px;
          }

          .blend-preview-color {
            flex-direction: column;
            gap: 12px;
          }

          .blend-swatch {
            width: 100%;
          }
        }
      `})]})}async function k1(){var r,n;const t=await Mt.auth.getSession(),e=(n=(r=t==null?void 0:t.data)==null?void 0:r.session)==null?void 0:n.access_token;if(!e)throw new Error("Not authenticated");return{"Content-Type":"application/json",Authorization:`Bearer ${e}`}}async function OF(t){const e=await k1(),r=await fetch("/api/projects/create",{method:"POST",headers:e,body:JSON.stringify(t)});if(!r.ok){const n=await r.json();throw new Error(n.error||"Failed to create project")}return r.json()}async function j1(){const t=await k1(),e=await fetch("/api/projects/list",{method:"GET",headers:t});if(!e.ok){const r=await e.json();throw new Error(r.error||"Failed to list projects")}return e.json()}function RF(t){const{inputMode:e,prompt:r,selectedFile:n,lengthMM:i,widthMM:o,result:s,viewMode:a,blendRecipes:l,solidRecipes:u,colorMapping:d,solidColorMapping:h,solidEditedColors:f,blendEditedColors:p,blendSvgUrl:v,solidSvgUrl:g,arMapping:b,jobId:m,inSituData:y}=t;console.log("[SERIALIZE] Serializing design with result:",s),console.log("[SERIALIZE] result.svg_url:",s==null?void 0:s.svg_url),console.log("[SERIALIZE] result.png_url:",s==null?void 0:s.png_url),console.log("[SERIALIZE] result.thumbnail_url:",s==null?void 0:s.thumbnail_url);const x=w=>w?w instanceof Map?Object.fromEntries(w):w:null;return{input_mode:e,prompt:r||null,uploaded_file_url:(n==null?void 0:n.url)||null,dimensions:{widthMM:o,lengthMM:i},original_svg_url:(s==null?void 0:s.svg_url)||null,original_png_url:(s==null?void 0:s.png_url)||null,thumbnail_url:(s==null?void 0:s.thumb_url)||null,blend_recipes:l||null,solid_recipes:u||null,color_mapping:x(d),solid_color_mapping:x(h),solid_color_edits:x(f),blend_color_edits:x(p),final_blend_svg_url:v||null,final_solid_svg_url:g||null,preferred_view_mode:a||"solid",aspect_ratio_mapping:b||null,job_id:m||null,in_situ:y?{room_photo_url:y.room_photo_url||null,mask_url:y.mask_url||null,floor_dimensions_m:y.floor_dimensions_m||null,preview_url:y.preview_url||null,blend_opacity:y.blend_opacity||20,perspective_corners:y.perspective_corners||null}:null}}function AF(t){var r,n;const e=i=>i?i instanceof Map?i:new Map(Object.entries(i)):new Map;return{inputMode:t.input_mode,prompt:t.prompt||"",selectedFile:t.uploaded_file_url?{url:t.uploaded_file_url,name:t.uploaded_file_url.split("/").pop()}:null,lengthMM:((r=t.dimensions)==null?void 0:r.lengthMM)||0,widthMM:((n=t.dimensions)==null?void 0:n.widthMM)||0,result:{svg_url:t.original_svg_url,png_url:t.original_png_url,thumbnail_url:t.thumbnail_url},blendRecipes:t.blend_recipes||null,solidRecipes:t.solid_recipes||null,colorMapping:e(t.color_mapping),solidColorMapping:e(t.solid_color_mapping),solidEditedColors:e(t.solid_color_edits),blendEditedColors:e(t.blend_color_edits),blendSvgUrl:null,solidSvgUrl:null,viewMode:t.preferred_view_mode||"solid",arMapping:t.aspect_ratio_mapping,jobId:t.job_id,inSituData:t.in_situ||null,generating:!1,generatingBlends:!1,showFinalRecipes:!!t.blend_recipes,showSolidSummary:!!t.solid_recipes,colorEditorOpen:!1,selectedColor:null}}function PF(t){var r;const e=[];return t.inputMode||e.push("Input mode is required"),(!t.widthMM||!t.lengthMM)&&e.push("Surface dimensions are required"),(r=t.result)!=null&&r.svg_url||e.push("No design to save - generate a design first"),{valid:e.length===0,errors:e}}function $F({currentState:t,existingDesignId:e=null,initialName:r="",onClose:n,onSaved:i}){const[o,s]=$.useState(r),[a,l]=$.useState(""),[u,d]=$.useState(""),[h,f]=$.useState(""),[p,v]=$.useState(!1),[g,b]=$.useState([]),[m,y]=$.useState(!1),[x,w]=$.useState(""),[j,S]=$.useState("#1a365d"),[C,N]=$.useState(!1),[E,A]=$.useState(!1),[U,O]=$.useState(!1),[F,k]=$.useState(null);$.useEffect(()=>{W()},[]);const W=async()=>{try{const{projects:L}=await j1();b(L)}catch(L){console.error("Failed to load projects:",L),k("Failed to load projects")}},ie=async()=>{if(!x.trim()){k("Project name is required");return}O(!0),k(null);try{const{project:L}=await OF({name:x.trim(),color:j});b([L,...g]),d(L.id),y(!1),w(""),S("#1a365d")}catch(L){console.error("Failed to create project:",L),k(L.message)}finally{O(!1)}},J=async(L=!1)=>{if(!o.trim()){k("Design name is required");return}const oe=PF(t);if(!oe.valid){k(oe.errors.join(", "));return}L?A(!0):N(!0),k(null);try{const H=RF(t);console.log("[SAVE-MODAL] Serialized design data:",H),console.log("[SAVE-MODAL] SVG URL from serialized data:",H.original_svg_url);const G={name:o.trim(),description:a.trim()||null,project_id:u||null,tags:h.split(",").map(Q=>Q.trim()).filter(Q=>Q),is_public:p,design_data:H};console.log("[SAVE-MODAL] Full save payload:",G),e&&!L&&(G.id=e);const pe=await Tj(G);i&&i(pe,o.trim()),n()}catch(H){console.error("Failed to save design:",H),k(H.message)}finally{N(!1),A(!1)}},K=["#1a365d","#ff6b35","#4a90e2","#50c878","#9b59b6","#e74c3c"];return c.jsx("div",{className:"modal-overlay",onClick:n,children:c.jsxs("div",{className:"modal-content save-design-modal",onClick:L=>L.stopPropagation(),children:[c.jsxs("div",{className:"modal-header",children:[c.jsx("h2",{children:e?"Update Design":"Save Design"}),c.jsx("button",{onClick:n,className:"close-button",children:"×"})]}),c.jsxs("div",{className:"modal-body",children:[F&&c.jsx("div",{className:"error-message",children:F}),c.jsxs("div",{className:"form-group",children:[c.jsx("label",{htmlFor:"design-name",children:"Design Name *"}),c.jsx("input",{id:"design-name",type:"text",value:o,onChange:L=>s(L.target.value),placeholder:"e.g., Playground Design A",autoFocus:!0,disabled:C||E})]}),c.jsxs("div",{className:"form-group",children:[c.jsx("label",{htmlFor:"design-description",children:"Description"}),c.jsx("textarea",{id:"design-description",value:a,onChange:L=>l(L.target.value),placeholder:"Optional notes about this design...",rows:3,disabled:C||E})]}),c.jsxs("div",{className:"form-group",children:[c.jsx("label",{htmlFor:"design-project",children:"Project"}),m?c.jsxs("div",{className:"new-project-form",children:[c.jsxs("div",{className:"input-row",children:[c.jsx("input",{type:"text",value:x,onChange:L=>w(L.target.value),placeholder:"Project name...",disabled:U}),c.jsx("div",{className:"color-picker-inline",children:K.map(L=>c.jsx("button",{type:"button",className:`color-swatch ${j===L?"active":""}`,style:{backgroundColor:L},onClick:()=>S(L),disabled:U},L))})]}),c.jsxs("div",{className:"button-row",children:[c.jsx("button",{type:"button",onClick:ie,className:"btn-primary btn-small",disabled:U,children:U?"Creating...":"Create"}),c.jsx("button",{type:"button",onClick:()=>y(!1),className:"btn-secondary btn-small",disabled:U,children:"Cancel"})]})]}):c.jsxs("div",{className:"project-selector",children:[c.jsxs("select",{id:"design-project",value:u,onChange:L=>d(L.target.value),disabled:C||E,children:[c.jsx("option",{value:"",children:"No Project"}),g.map(L=>c.jsxs("option",{value:L.id,children:[L.name," (",L.design_count," designs)"]},L.id))]}),c.jsx("button",{type:"button",onClick:()=>y(!0),className:"btn-secondary btn-small",disabled:C||E,children:"+ New Project"})]})]}),c.jsxs("div",{className:"form-group",children:[c.jsx("label",{htmlFor:"design-tags",children:"Tags"}),c.jsx("input",{id:"design-tags",type:"text",value:h,onChange:L=>f(L.target.value),placeholder:"e.g., playground, vibrant, geometric (comma-separated)",disabled:C||E}),c.jsx("small",{className:"help-text",children:"Separate tags with commas"})]}),c.jsx("div",{className:"form-group checkbox-group",children:c.jsxs("label",{children:[c.jsx("input",{type:"checkbox",checked:p,onChange:L=>v(L.target.checked),disabled:C||E}),c.jsx("span",{children:"Make this design public (shareable link)"})]})})]}),c.jsxs("div",{className:"modal-footer",children:[c.jsx("button",{onClick:n,className:"btn-secondary",disabled:C||E,children:"Cancel"}),e&&c.jsx("button",{onClick:()=>J(!0),className:"btn-secondary",disabled:C||E,children:E?"Saving...":"Save as New"}),c.jsx("button",{onClick:()=>J(!1),className:"btn-primary",disabled:C||E,children:C?"Saving...":e?"Update":"Save Design"})]})]})})}const IF=10*1024*1024,MF=["image/jpeg","image/png","image/jpg"];function DF({onPhotoUploaded:t,disabled:e=!1}){const[r,n]=$.useState(!1),[i,o]=$.useState(!1),[s,a]=$.useState(null),[l,u]=$.useState(null),d=$.useRef(null),h=y=>{y.preventDefault(),e||n(!0)},f=y=>{y.preventDefault(),n(!1)},p=async y=>{if(y.preventDefault(),n(!1),e)return;const x=y.dataTransfer.files;x.length>0&&await b(x[0])},v=()=>{!e&&d.current&&d.current.click()},g=async y=>{y.target.files.length>0&&await b(y.target.files[0])},b=async y=>{if(a(null),!MF.includes(y.type)){a("Please upload a JPG or PNG image");return}if(y.size>IF){a("Image must be under 10MB");return}const x=URL.createObjectURL(y);u(x),console.log("[IN-SITU-UPLOADER] Loading local file to get dimensions...");const w=await new Promise((j,S)=>{const C=new Image;C.onload=()=>{console.log("[IN-SITU-UPLOADER] Local image loaded, dimensions:",C.naturalWidth,"x",C.naturalHeight),j({width:C.naturalWidth,height:C.naturalHeight})},C.onerror=N=>{console.error("[IN-SITU-UPLOADER] Failed to load local image:",N),S(new Error("Failed to read image dimensions"))},C.src=x});o(!0);try{const S=`in-situ-photos/${`${Date.now()}-${Math.random().toString(36).substr(2,9)}.${y.type.split("/")[1]}`}`,{data:C,error:N}=await Mt.storage.from("tpv-studio-uploads").upload(S,y,{cacheControl:"3600",upsert:!1});if(N)throw N;const{data:{publicUrl:E}}=Mt.storage.from("tpv-studio-uploads").getPublicUrl(S);console.log("[IN-SITU-UPLOADER] Photo uploaded:",E),console.log("[IN-SITU-UPLOADER] Using dimensions from local file:",w),console.log("[IN-SITU-UPLOADER] Passing local blob URL for fast preview"),console.log("[IN-SITU-UPLOADER] Calling onPhotoUploaded callback..."),t({url:x,supabaseUrl:E,width:w.width,height:w.height,filename:y.name})}catch(j){console.error("[IN-SITU-UPLOADER] Upload failed:",j),a(j.message||"Upload failed"),URL.revokeObjectURL(x),u(null)}finally{o(!1)}},m=()=>{l&&URL.revokeObjectURL(l),u(null),a(null)};return c.jsxs("div",{className:"in-situ-uploader",children:[l?c.jsxs("div",{className:"preview-container",children:[c.jsx("img",{src:l,alt:"Site preview",className:"preview-image"}),i&&c.jsxs("div",{className:"upload-overlay",children:[c.jsx("div",{className:"upload-spinner"}),c.jsx("p",{children:"Uploading..."})]}),!i&&c.jsx("button",{className:"clear-button",onClick:m,title:"Remove photo",children:c.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[c.jsx("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),c.jsx("line",{x1:"6",y1:"6",x2:"18",y2:"18"})]})})]}):c.jsxs("div",{className:`upload-zone ${r?"dragging":""} ${e?"disabled":""}`,onDragOver:h,onDragLeave:f,onDrop:p,onClick:v,children:[c.jsx("input",{ref:d,type:"file",accept:"image/jpeg,image/png",onChange:g,style:{display:"none"},disabled:e}),c.jsx("div",{className:"upload-icon",children:c.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[c.jsx("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}),c.jsx("polyline",{points:"17 8 12 3 7 8"}),c.jsx("line",{x1:"12",y1:"3",x2:"12",y2:"15"})]})}),c.jsxs("div",{className:"upload-text",children:[c.jsx("p",{className:"primary",children:r?"Drop photo here":"Upload site photo"}),c.jsx("p",{className:"secondary",children:"Drag & drop or click to browse"}),c.jsx("p",{className:"hint",children:"JPG or PNG, max 10MB"})]})]}),s&&c.jsx("div",{className:"error-message",children:s}),c.jsx("style",{children:`
        .in-situ-uploader {
          width: 100%;
        }

        .upload-zone {
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          background: #f9fafb;
        }

        .upload-zone:hover {
          border-color: #ff6b35;
          background: #fff7f5;
        }

        .upload-zone.dragging {
          border-color: #ff6b35;
          background: #fff7f5;
          border-style: solid;
        }

        .upload-zone.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .upload-zone.disabled:hover {
          border-color: #d1d5db;
          background: #f9fafb;
        }

        .upload-icon {
          width: 48px;
          height: 48px;
          margin: 0 auto 1rem;
          color: #9ca3af;
        }

        .upload-zone:hover .upload-icon {
          color: #ff6b35;
        }

        .upload-text .primary {
          font-size: 1rem;
          font-weight: 600;
          color: #374151;
          margin: 0 0 0.25rem;
        }

        .upload-text .secondary {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 0 0 0.5rem;
        }

        .upload-text .hint {
          font-size: 0.75rem;
          color: #9ca3af;
          margin: 0;
        }

        .preview-container {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
        }

        .preview-image {
          width: 100%;
          display: block;
          border-radius: 8px;
        }

        .upload-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .upload-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-bottom: 0.5rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .clear-button {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.6);
          border: none;
          cursor: pointer;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .clear-button:hover {
          background: rgba(0, 0, 0, 0.8);
        }

        .clear-button svg {
          width: 16px;
          height: 16px;
        }

        .error-message {
          margin-top: 0.75rem;
          padding: 0.5rem 0.75rem;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 4px;
          color: #dc2626;
          font-size: 0.875rem;
        }
      `})]})}function LF(t,e){const[r,n,i,o,s,a,l,u]=t,[d,h,f,p,v,g,b,m]=e,y=[[r,n,1,0,0,0,-d*r,-d*n],[0,0,0,r,n,1,-h*r,-h*n],[i,o,1,0,0,0,-f*i,-f*o],[0,0,0,i,o,1,-p*i,-p*o],[s,a,1,0,0,0,-v*s,-v*a],[0,0,0,s,a,1,-g*s,-g*a],[l,u,1,0,0,0,-b*l,-b*u],[0,0,0,l,u,1,-m*l,-m*u]],w=zF(y,[d,h,f,p,v,g,b,m]);return function(S,C){const N=w[6]*S+w[7]*C+1,E=(w[0]*S+w[1]*C+w[2])/N,A=(w[3]*S+w[4]*C+w[5])/N;return[E,A]}}function zF(t,e){const r=t.length,n=t.map((o,s)=>[...o,e[s]]);for(let o=0;o<r;o++){let s=o;for(let a=o+1;a<r;a++)Math.abs(n[a][o])>Math.abs(n[s][o])&&(s=a);[n[o],n[s]]=[n[s],n[o]];for(let a=o+1;a<r;a++){const l=n[a][o]/n[o][o];for(let u=o;u<=r;u++)n[a][u]-=l*n[o][u]}}const i=new Array(r);for(let o=r-1;o>=0;o--){i[o]=n[o][r];for(let s=o+1;s<r;s++)i[o]-=n[o][s]*i[s];i[o]/=n[o][o]}return i}function Gp(t){return new Promise((e,r)=>{const n=new Image;!t.startsWith("blob:")&&!t.startsWith("data:")?(n.crossOrigin="anonymous",console.log("[LOAD-IMAGE] Loading external URL with CORS:",t.substring(0,50))):console.log("[LOAD-IMAGE] Loading local URL (blob/data):",t.substring(0,50)),n.onload=()=>{console.log("[LOAD-IMAGE] Successfully loaded image:",t.substring(0,50)),e(n)},n.onerror=()=>{console.error("[LOAD-IMAGE] Failed to load image:",t),r(new Error(`Failed to load image: ${t}`))},n.src=t})}async function E1(t,e=1536){console.log("[RASTERIZE-SVG] Starting SVG rasterization:",t.substring(0,50),"maxSize:",e);const r=await Gp(t),{naturalWidth:n,naturalHeight:i}=r;console.log("[RASTERIZE-SVG] SVG loaded with dimensions:",n,"x",i);const o=Math.min(1,e/Math.max(n,i)),s=Math.round(n*o),a=Math.round(i*o);console.log("[RASTERIZE-SVG] Scaling to:",s,"x",a,"(scale:",o.toFixed(2),")");const l=document.createElement("canvas");return l.width=s,l.height=a,l.getContext("2d").drawImage(r,0,0,s,a),console.log("[RASTERIZE-SVG] Drew SVG to canvas"),new Promise((d,h)=>{const f=new Image;f.onload=()=>{console.log("[RASTERIZE-SVG] Successfully rasterized SVG to PNG"),d(f)},f.onerror=p=>{console.error("[RASTERIZE-SVG] Failed to convert canvas to image:",p),h(p)},f.src=l.toDataURL("image/png")})}function C1({photoCtx:t,photoImg:e,designImg:r,quad:n,opacity:i,shape:o,lighting:s}){const a=t.canvas;t.clearRect(0,0,a.width,a.height),t.drawImage(e,0,0,a.width,a.height);const l=r.width,u=r.height,d=[0,0,l,0,l,u,0,u],h=[n[0].x,n[0].y,n[1].x,n[1].y,n[2].x,n[2].y,n[3].x,n[3].y],f=LF(d,h),p=10,v=l/p,g=u/p,b=document.createElement("canvas");if(b.width=l,b.height=u,b.getContext("2d").drawImage(r,0,0),t.save(),t.globalAlpha=i,s&&s.enabled){const x=s.strength||.6,w=1+(s.baseBrightness-1)*x,j=1+(s.baseContrast-1)*x;t.filter=`brightness(${w}) contrast(${j})`}const y=o&&o.length>=3?o:n;t.beginPath(),t.moveTo(y[0].x,y[0].y);for(let x=1;x<y.length;x++)t.lineTo(y[x].x,y[x].y);t.closePath(),t.clip();for(let x=0;x<p;x++)for(let w=0;w<p;w++){const j=x*v,S=w*g,C=(x+1)*v,N=(w+1)*g,E=f(j,S),A=f(C,S),U=f(C,N),O=f(j,N);Cv(t,b,j,S,C,S,j,N,E[0],E[1],A[0],A[1],O[0],O[1]),Cv(t,b,C,S,C,N,j,N,A[0],A[1],U[0],U[1],O[0],O[1])}t.restore()}function Cv(t,e,r,n,i,o,s,a,l,u,d,h,f,p){t.save(),t.beginPath(),t.moveTo(l,u),t.lineTo(d,h),t.lineTo(f,p),t.closePath(),t.clip();const v=(r-s)*(o-a)-(i-s)*(n-a);if(Math.abs(v)<.001){t.restore();return}const g=((l-f)*(o-a)-(d-f)*(n-a))/v,b=((u-p)*(o-a)-(h-p)*(n-a))/v,m=((r-s)*(d-f)-(i-s)*(l-f))/v,y=((r-s)*(h-p)-(i-s)*(u-p))/v,x=l-g*r-m*n,w=u-b*r-y*n;t.setTransform(g,b,m,y,x,w),t.drawImage(e,0,0),t.restore()}function FF(t,e="tpv-in-situ-preview.png"){t.toBlob(r=>{const n=URL.createObjectURL(r),i=document.createElement("a");i.href=n,i.download=e,document.body.appendChild(i),i.click(),document.body.removeChild(i),URL.revokeObjectURL(n)},"image/png")}function BF(t,e,r,n){const i=r/n,o=t*.6,s=e*.6;let a,l;i>o/s?(a=o,l=o/i):(l=s,a=s*i);const u=(t-a)/2,d=(e-l)/2;return[{x:u,y:d},{x:u+a,y:d},{x:u+a,y:d+l},{x:u,y:d+l}]}function UF(t,e,r){let n=!1;for(let i=0,o=r.length-1;i<r.length;o=i++){const s=r[i].x,a=r[i].y,l=r[o].x,u=r[o].y;a>e!=u>e&&t<(l-s)*(e-a)/(u-a)+s&&(n=!n)}return n}function HF(t,e,r){t/=255,e/=255,r/=255;const n=Math.max(t,e,r),i=Math.min(t,e,r),o=(n+i)/2;if(n===i)return{h:0,s:0,l:o};const s=n-i,a=o>.5?s/(2-n-i):s/(n+i);let l;switch(n){case t:l=((e-r)/s+(e<r?6:0))/6;break;case e:l=((r-t)/s+2)/6;break;case r:l=((t-e)/s+4)/6;break}return{h:l,s:a,l:o}}function GF(t,e,r=2e3){if(!t||!e||e.length<3)return{avgLightness:.5,avgContrastProxy:.5};const n=Math.floor(Math.min(...e.map(y=>y.x))),i=Math.ceil(Math.max(...e.map(y=>y.x))),o=Math.floor(Math.min(...e.map(y=>y.y))),s=Math.ceil(Math.max(...e.map(y=>y.y))),a=i-n,l=s-o;if(a<=0||l<=0)return{avgLightness:.5,avgContrastProxy:.5};let u;try{u=t.getImageData(n,o,a,l)}catch(y){return console.warn("[LIGHTING] Failed to get image data:",y),{avgLightness:.5,avgContrastProxy:.5}}const d=u.data,h=[];let f=0;const p=r*5;for(;h.length<r&&f<p;){f++;const y=n+Math.random()*a,x=o+Math.random()*l;if(!UF(y,x,e))continue;const w=Math.floor(y-n),S=(Math.floor(x-o)*a+w)*4;if(S<0||S>=d.length-3)continue;const C=d[S],N=d[S+1],E=d[S+2],{l:A}=HF(C,N,E);h.push(A)}if(h.length===0)return{avgLightness:.5,avgContrastProxy:.5};const v=h.reduce((y,x)=>y+x,0)/h.length,g=h.reduce((y,x)=>y+Math.pow(x-v,2),0)/h.length,b=Math.sqrt(g),m=Math.min(1,b/.25);return{avgLightness:v,avgContrastProxy:m}}function WF(t){let e=1,r=1;const i=t.avgLightness-.5;return e+=i*.6,r+=(t.avgContrastProxy-.5)*.4,e=Math.max(.7,Math.min(1.3,e)),r=Math.max(.8,Math.min(1.25,r)),{brightness:e,contrast:r}}const VF=100;function qF({photoUrl:t,svgUrl:e,designSizeMm:r,initialQuad:n,initialShape:i,initialOpacity:o=.8,initialLighting:s,onChange:a}){const[l,u]=$.useState(null),[d,h]=$.useState(null),[f,p]=$.useState(n||null),[v,g]=$.useState(i||null),[b,m]=$.useState(Math.max(.3,Math.min(1,o))),[y,x]=$.useState(s||{enabled:!1,strength:.6,baseBrightness:1,baseContrast:1}),[w,j]=$.useState(!0),[S,C]=$.useState(null),[N,E]=$.useState(1),[A,U]=$.useState("corners"),[O,F]=$.useState(null),[k,W]=$.useState(!1),[ie,J]=$.useState(null),[K,L]=$.useState(null),oe=$.useRef(null),H=$.useRef(null),G=$.useRef(null),[pe,Q]=$.useState([]),ae=20;$.useEffect(()=>{Re()},[t,e]),$.useEffect(()=>{l&&d&&f&&Ke()},[l,d,f,v,b,y,A,O,k,K]),$.useEffect(()=>{if(!l||!f||f.length!==4)return;const M=document.createElement("canvas");M.width=l.naturalWidth,M.height=l.naturalHeight;const Z=M.getContext("2d");Z.drawImage(l,0,0);const re=GF(Z,f),{brightness:ue,contrast:me}=WF(re);x(be=>({...be,baseBrightness:ue,baseContrast:me}))},[l,JSON.stringify(f)]),$.useEffect(()=>{const M=Z=>{if(A==="shape"&&(Z.key==="Delete"||Z.key==="Backspace")&&K!==null&&v&&v.length>3){Z.preventDefault();const re=v.filter((ue,me)=>me!==K);g(re),L(null),Ne(f,b,re)}};return window.addEventListener("keydown",M),()=>window.removeEventListener("keydown",M)},[A,K,v,f,b]);const Re=async()=>{var M;console.log("[FOUR-POINT] Starting to load images - photo:",t==null?void 0:t.substring(0,50),"svg:",e==null?void 0:e.substring(0,50)),j(!0),C(null);try{console.log("[FOUR-POINT] Loading photo and rasterizing SVG...");const[Z,re]=await Promise.all([Gp(t),E1(e,1536)]);console.log("[FOUR-POINT] Both images loaded successfully - photo:",Z.naturalWidth,"x",Z.naturalHeight,"design:",re.naturalWidth,"x",re.naturalHeight),u(Z),h(re);const ue=((M=H.current)==null?void 0:M.clientWidth)||800,me=500,be=ue/Z.naturalWidth,$e=me/Z.naturalHeight,ge=Math.min(1,be,$e);if(E(ge),console.log("[FOUR-POINT] Display scale set to:",ge.toFixed(3)),n)console.log("[FOUR-POINT] Using provided initial quad");else{const Ae=BF(Z.naturalWidth,Z.naturalHeight,r.width_mm,r.length_mm);p(Ae),console.log("[FOUR-POINT] Initialized default quad")}}catch(Z){console.error("[FOUR-POINT] Failed to load images:",Z),C(Z.message)}finally{j(!1),console.log("[FOUR-POINT] Loading complete")}},Ke=()=>{const M=oe.current;if(!M||!l||!d||!f)return;M.width=l.naturalWidth,M.height=l.naturalHeight;const Z=M.getContext("2d");C1({photoCtx:Z,photoImg:l,designImg:d,quad:f,opacity:b,shape:v,lighting:y}),ye(Z)},ye=M=>{if(!f)return;M.setTransform(1,0,0,1,0,0);const Z=Math.max(8,Math.min(15,l.naturalWidth/80));if(A==="corners"){M.strokeStyle="rgba(255, 255, 255, 0.8)",M.lineWidth=2,M.setLineDash([5,5]),M.beginPath(),M.moveTo(f[0].x,f[0].y),M.lineTo(f[1].x,f[1].y),M.lineTo(f[2].x,f[2].y),M.lineTo(f[3].x,f[3].y),M.closePath(),M.stroke(),M.setLineDash([]);const re=["TL","TR","BR","BL"];f.forEach((ue,me)=>{M.beginPath(),M.arc(ue.x,ue.y,Z,0,Math.PI*2),M.fillStyle=O===me?"#ff6b35":"rgba(255, 107, 53, 0.9)",M.fill(),M.strokeStyle="white",M.lineWidth=2,M.stroke(),M.fillStyle="white",M.font="10px sans-serif",M.textAlign="center",M.textBaseline="middle",M.fillText(re[me],ue.x,ue.y)})}else{const re=v||f;M.strokeStyle="rgba(34, 197, 94, 0.8)",M.lineWidth=2,M.setLineDash([]),M.beginPath(),M.moveTo(re[0].x,re[0].y);for(let ue=1;ue<re.length;ue++)M.lineTo(re[ue].x,re[ue].y);M.closePath(),M.stroke(),re.forEach((ue,me)=>{M.beginPath(),M.arc(ue.x,ue.y,Z*.8,0,Math.PI*2),K===me?M.fillStyle="#22c55e":O===me?M.fillStyle="#16a34a":M.fillStyle="rgba(34, 197, 94, 0.9)",M.fill(),M.strokeStyle="white",M.lineWidth=2,M.stroke()}),M.strokeStyle="rgba(255, 107, 53, 0.3)",M.lineWidth=1,M.setLineDash([3,3]),M.beginPath(),M.moveTo(f[0].x,f[0].y),M.lineTo(f[1].x,f[1].y),M.lineTo(f[2].x,f[2].y),M.lineTo(f[3].x,f[3].y),M.closePath(),M.stroke(),M.setLineDash([])}},Ne=$.useCallback((M,Z,re,ue)=>{G.current&&clearTimeout(G.current),G.current=setTimeout(()=>{a&&a({quad:M,opacity:Z,shape:re,lighting:ue||y})},VF)},[a,y]),He=$.useCallback(()=>{Q(M=>{const Z=[...M,{quad:[...f],shape:v?[...v]:null,opacity:b,lighting:{...y}}];return Z.length>ae?Z.slice(-ae):Z})},[f,v,b,y]),Ye=()=>{if(pe.length===0)return;const M=pe[pe.length-1];Q(Z=>Z.slice(0,-1)),p(M.quad),g(M.shape),m(M.opacity),x(M.lighting),Ne(M.quad,M.opacity,M.shape,M.lighting)},bt=(M,Z)=>({x:M/N,y:Z/N}),et=(M,Z,re)=>{if(!re)return-1;const ue=25/N;for(let me=0;me<re.length;me++){const be=re[me].x-M,$e=re[me].y-Z;if(Math.sqrt(be*be+$e*$e)<ue)return me}return-1},_=(M,Z,re)=>{if(!re||re.length<3)return!1;let ue=!1;for(let me=0,be=re.length-1;me<re.length;be=me++){const $e=re[me].x,ge=re[me].y,Ae=re[be].x,Le=re[be].y;ge>Z!=Le>Z&&M<(Ae-$e)*(Z-ge)/(Le-ge)+$e&&(ue=!ue)}return ue},ee=M=>{if(A!=="shape"||!v||v.length<=3)return;const Z=oe.current;if(!Z)return;const re=Z.getBoundingClientRect(),ue=M.clientX-re.left,me=M.clientY-re.top,{x:be,y:$e}=bt(ue,me),ge=et(be,$e,v);if(ge>=0){He();const Ae=v.filter((Me,ct)=>ct!==ge);g(Ae),L(null);const Le=I(f,Ae);Le!==f?(p(Le),Ne(Le,b,Ae)):Ne(f,b,Ae)}},B=M=>{const Z=oe.current;if(!Z)return;const re=Z.getBoundingClientRect(),ue=M.clientX-re.left,me=M.clientY-re.top,{x:be,y:$e}=bt(ue,me);if(A==="corners"){const ge=et(be,$e,f);ge>=0?(He(),F(ge),Z.setPointerCapture(M.pointerId)):_(be,$e,f)&&(He(),W(!0),J({x:be,y:$e}),Z.setPointerCapture(M.pointerId))}else{const ge=v||f,Ae=et(be,$e,ge);if(Ae>=0)He(),F(Ae),L(Ae),Z.setPointerCapture(M.pointerId);else{He();let Le=0,Me=1/0;for(let ze=0;ze<ge.length;ze++){const ut=(ze+1)%ge.length,Ge=te(be,$e,ge[ze].x,ge[ze].y,ge[ut].x,ge[ut].y);Ge<Me&&(Me=Ge,Le=ut)}const ct={x:be,y:$e},tt=[...ge];tt.splice(Le,0,ct),g(tt),L(Le);const Ie=I(f,tt);Ie!==f?(p(Ie),Ne(Ie,b,tt)):Ne(f,b,tt)}}},R=M=>{if(O===null&&!k)return;const Z=oe.current;if(!Z)return;const re=Z.getBoundingClientRect(),ue=M.clientX-re.left,me=M.clientY-re.top,{x:be,y:$e}=bt(ue,me),ge=Math.max(0,Math.min(l.naturalWidth,be)),Ae=Math.max(0,Math.min(l.naturalHeight,$e));if(A==="corners"){if(k&&ie){const Le=ge-ie.x,Me=Ae-ie.y,ct=f.map(Ie=>({x:Math.max(0,Math.min(l.naturalWidth,Ie.x+Le)),y:Math.max(0,Math.min(l.naturalHeight,Ie.y+Me))}));let tt=v;v&&(tt=v.map(Ie=>({x:Math.max(0,Math.min(l.naturalWidth,Ie.x+Le)),y:Math.max(0,Math.min(l.naturalHeight,Ie.y+Me))})),g(tt)),p(ct),J({x:ge,y:Ae}),Ne(ct,b,tt)}else if(O!==null){const Le=[...f];Le[O]={x:ge,y:Ae},p(Le),Ne(Le,b,v)}}else{const Me=[...v||f];Me[O]={x:ge,y:Ae},g(Me),Ne(f,b,Me)}},T=M=>{if(O!==null||k){const Z=oe.current;if(Z&&Z.releasePointerCapture(M.pointerId),A==="shape"&&v&&O!==null){const re=I(f,v);re!==f&&(p(re),Ne(re,b,v))}F(null),W(!1),J(null)}},I=(M,Z)=>{if(!Z||Z.length<3||!M)return M;const re=M.reduce((Ie,ze)=>Ie+ze.x,0)/4,ue=M.reduce((Ie,ze)=>Ie+ze.y,0)/4,me=Z.reduce((Ie,ze)=>Ie+ze.x,0)/Z.length,be=Z.reduce((Ie,ze)=>Ie+ze.y,0)/Z.length;let $e=1;for(const Ie of Z){const ze=Ie.x-re,ut=Ie.y-ue,Ge=Math.sqrt(ze*ze+ut*ut);if(Ge<1)continue;const xt=X(re,ue,ze,ut,M);if(xt>0&&Ge>xt){const Jt=Ge/xt;$e=Math.max($e,Jt)}}let ge=1/0;for(const Ie of Z){const ze=Ie.x-re,ut=Ie.y-ue,Ge=Math.sqrt(ze*ze+ut*ut);if(Ge<1)continue;const xt=X(re,ue,ze,ut,M);if(xt>0){const Jt=Ge/xt;ge=Math.min(ge,Jt)}}let Ae=$e;if($e<=1&&ge<1/0&&(Ae=ge),Math.abs(Ae-1)<.01)return M;const Le=M.map(Ie=>({x:re+(Ie.x-re)*Ae,y:ue+(Ie.y-ue)*Ae})),Me=me-re,ct=be-ue;return Le.map(Ie=>({x:Ie.x+Me,y:Ie.y+ct}))},X=(M,Z,re,ue,me)=>{let be=1/0;for(let $e=0;$e<4;$e++){const ge=me[$e],Ae=me[($e+1)%4],Le=Ae.x-ge.x,Me=Ae.y-ge.y,ct=re*Me-ue*Le;if(Math.abs(ct)<1e-4)continue;const tt=((ge.x-M)*Me-(ge.y-Z)*Le)/ct,Ie=((ge.x-M)*ue-(ge.y-Z)*re)/ct;tt>0&&Ie>=0&&Ie<=1&&(be=Math.min(be,tt*Math.sqrt(re*re+ue*ue)))}return be===1/0?0:be},te=(M,Z,re,ue,me,be)=>{const $e=M-re,ge=Z-ue,Ae=me-re,Le=be-ue,Me=$e*Ae+ge*Le,ct=Ae*Ae+Le*Le;let tt=ct!==0?Me/ct:-1,Ie,ze;return tt<0?(Ie=re,ze=ue):tt>1?(Ie=me,ze=be):(Ie=re+tt*Ae,ze=ue+tt*Le),Math.sqrt((M-Ie)**2+(Z-ze)**2)},D=()=>{A==="corners"?(v||g([...f]),U("shape"),L(null)):(U("corners"),L(null))},q=M=>{const Z=Math.max(.3,Math.min(1,parseFloat(M.target.value)/100));m(Z),Ne(f,Z,v)},ne=M=>{const Z={...y,enabled:M.target.checked};x(Z),Ne(f,b,v,Z)},Y=M=>{const Z={...y,strength:parseFloat(M.target.value)/100};x(Z),Ne(f,b,v,Z)};return w?c.jsxs("div",{className:"four-point-editor loading",children:[c.jsx("div",{className:"spinner"}),c.jsx("p",{children:"Loading preview..."})]}):S?c.jsx("div",{className:"four-point-editor error",children:c.jsxs("p",{children:["Failed to load: ",S]})}):c.jsxs("div",{className:"four-point-editor",ref:H,children:[c.jsxs("div",{className:"editor-header",children:[c.jsxs("div",{className:"header-title",children:[c.jsx("h3",{children:"Position Your Design"}),c.jsx(Zf,{content:c.jsxs("div",{children:[c.jsxs("p",{children:[c.jsx("strong",{children:"Corners Mode:"})," Drag the 4 corner handles (TL, TR, BR, BL) to position your design with perspective. You can also drag inside the design to move all corners at once."]}),c.jsxs("p",{style:{marginTop:"0.5rem"},children:[c.jsx("strong",{children:"Refine Shape Mode:"})," Click anywhere to add new vertices for precise shape control. Drag existing vertices to adjust. Double-click or press Delete/Backspace on a vertex to remove it."]}),c.jsxs("p",{style:{marginTop:"0.5rem"},children:[c.jsx("strong",{children:"Overlay Opacity:"})," Adjust transparency to see how the design blends with your photo."]}),c.jsxs("p",{style:{marginTop:"0.5rem"},children:[c.jsx("strong",{children:"Match Floor Lighting:"})," Automatically adjusts design brightness to match your floor's lighting conditions."]})]}),position:"right"})]}),c.jsx("p",{className:"instructions",children:A==="corners"?"Drag the corner handles (TL, TR, BR, BL) to position the design. Drag inside to move all corners.":"Click to add vertices, drag to move them, double-click or press Delete to remove."})]}),c.jsx("div",{className:"canvas-container",children:c.jsx("canvas",{ref:oe,onPointerDown:B,onPointerMove:R,onPointerUp:T,onPointerLeave:T,onDoubleClick:ee,style:{width:`${((l==null?void 0:l.naturalWidth)||800)*N}px`,height:`${((l==null?void 0:l.naturalHeight)||600)*N}px`,cursor:O!==null||k?"grabbing":A==="shape"?"crosshair":"move",touchAction:"none"}})}),c.jsxs("div",{className:"controls",children:[c.jsxs("div",{className:"mode-toggle",children:[c.jsx("button",{className:`toggle-btn ${A==="corners"?"active":""}`,onClick:()=>U("corners"),children:"Corners"}),c.jsx("button",{className:`toggle-btn ${A==="shape"?"active":""}`,onClick:D,children:"Refine Shape"}),c.jsx("button",{className:"toggle-btn undo-btn",onClick:Ye,disabled:pe.length===0,title:"Undo last change",children:"Undo"})]}),c.jsxs("div",{className:"opacity-control",children:[c.jsxs("label",{children:["Overlay Opacity",c.jsxs("span",{className:"value",children:[Math.round(b*100),"%"]})]}),c.jsx("input",{type:"range",min:"30",max:"100",value:Math.round(b*100),onChange:q})]}),c.jsxs("div",{className:"lighting-control",children:[c.jsxs("label",{className:"checkbox-label",children:[c.jsx("input",{type:"checkbox",checked:y.enabled,onChange:ne}),"Match floor lighting"]}),y.enabled&&c.jsxs("div",{className:"lighting-slider",children:[c.jsxs("label",{children:["Strength",c.jsxs("span",{className:"value",children:[Math.round(y.strength*100),"%"]})]}),c.jsx("input",{type:"range",min:"0",max:"100",value:Math.round(y.strength*100),onChange:Y})]})]})]}),c.jsx("style",{children:`
        .four-point-editor {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .four-point-editor.loading,
        .four-point-editor.error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          color: #6b7280;
        }

        .four-point-editor .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e5e7eb;
          border-top-color: #ff6b35;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .editor-header {
          padding-bottom: 1rem;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 1rem;
        }

        .editor-header .header-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .editor-header h3 {
          margin: 0;
          font-size: 1.125rem;
          color: #1e4a7a;
        }

        .editor-header .instructions {
          margin: 0;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .canvas-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f3f4f6;
          border-radius: 8px;
          overflow: hidden;
          min-height: 400px;
        }

        .canvas-container canvas {
          display: block;
        }

        .controls {
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
          margin-top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .mode-toggle {
          display: flex;
          gap: 0.5rem;
        }

        .toggle-btn {
          padding: 0.5rem 1rem;
          border: 1px solid #d1d5db;
          background: white;
          border-radius: 4px;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .toggle-btn:hover {
          background: #f9fafb;
        }

        .toggle-btn.active {
          background: #ff6b35;
          color: white;
          border-color: #ff6b35;
        }

        .toggle-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .toggle-btn:disabled:hover {
          background: white;
        }

        .opacity-control {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .opacity-control label {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
        }

        .opacity-control .value {
          font-weight: 400;
          color: #6b7280;
        }

        .opacity-control input[type="range"] {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: #e5e7eb;
          outline: none;
          -webkit-appearance: none;
        }

        .opacity-control input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #ff6b35;
          cursor: pointer;
        }

        .lighting-control {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
        }

        .checkbox-label input[type="checkbox"] {
          width: 16px;
          height: 16px;
          cursor: pointer;
        }

        .lighting-slider {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          padding-left: 1.5rem;
        }

        .lighting-slider label {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: #6b7280;
        }

        .lighting-slider .value {
          font-weight: 400;
        }

        .lighting-slider input[type="range"] {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: #e5e7eb;
          outline: none;
          -webkit-appearance: none;
        }

        .lighting-slider input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #22c55e;
          cursor: pointer;
        }
      `})]})}const qr={UPLOAD:"upload",POSITION:"position"};function KF({designUrl:t,designDimensions:e,onClose:r,onSaved:n}){const[i,o]=$.useState(qr.UPLOAD),[s,a]=$.useState(null),[l,u]=$.useState(null),[d,h]=$.useState(null),[f,p]=$.useState(.8),[v,g]=$.useState({enabled:!1,strength:.6,baseBrightness:1,baseContrast:1}),[b,m]=$.useState(!1),y=$.useRef(null);$.useEffect(()=>{if(t){console.log("[IN-SITU-MODAL] Design URL received:",t==null?void 0:t.substring(0,50));const E=new Image;!t.startsWith("blob:")&&!t.startsWith("data:")&&(E.crossOrigin="anonymous"),E.src=t}else console.warn("[IN-SITU-MODAL] No design URL provided")},[t]);const x=E=>{console.log("[IN-SITU-MODAL] Photo uploaded:",E),a(E),console.log("[IN-SITU-MODAL] Advancing to POSITION step, designUrl:",t==null?void 0:t.substring(0,50)),o(qr.POSITION)},w=({quad:E,opacity:A,shape:U,lighting:O})=>{u(E),p(A),h(U),O&&g(O)},j=async()=>{if(!s||!l)return null;try{console.log("[InSitu] Loading design from URL:",t);const[E,A]=await Promise.all([Gp(s.url),E1(t,1536)]);console.log("[InSitu] Successfully loaded design image");const U=document.createElement("canvas");U.width=E.naturalWidth,U.height=E.naturalHeight;const O=U.getContext("2d");return C1({photoCtx:O,photoImg:E,designImg:A,quad:l,opacity:f,shape:d,lighting:v}),U}catch(E){return console.error("[InSitu] Failed to generate canvas:",E),alert(`Failed to load design: ${E.message}`),null}},S=async()=>{const E=await j();E&&FF(E,"tpv-in-situ-preview.png")},C=async()=>{if(!(!l||!s)){m(!0);try{const E=await j();if(!E)throw new Error("Failed to generate preview");const A=await new Promise(W=>E.toBlob(W,"image/png")),O=`in-situ-previews/${`${Date.now()}-${Math.random().toString(36).substr(2,9)}.png`}`,{error:F}=await Mt.storage.from("tpv-studio-uploads").upload(O,A,{contentType:"image/png",cacheControl:"3600"});if(F)throw F;const{data:{publicUrl:k}}=Mt.storage.from("tpv-studio-uploads").getPublicUrl(O);n&&n({photo_url:s.supabaseUrl||s.url,quad:l,shape:d,opacity:f,lighting:v,preview_url:k}),r()}catch(E){console.error("[IN-SITU] Save failed:",E),alert("Failed to save preview: "+E.message)}finally{m(!1)}}},N=()=>{switch(i){case qr.UPLOAD:return"Upload Site Photo";case qr.POSITION:return"Position Your Design";default:return"In-Situ Preview"}};return c.jsxs("div",{className:"modal-overlay in-situ-modal-overlay",onClick:r,children:[c.jsxs("div",{className:"modal-content in-situ-modal",onClick:E=>E.stopPropagation(),children:[c.jsxs("div",{className:"modal-header",children:[c.jsxs("div",{className:"header-left",children:[c.jsx("h2",{children:N()}),c.jsxs("div",{className:"step-indicator",children:[c.jsx("span",{className:i===qr.UPLOAD?"active":"completed",children:"1. Upload"}),c.jsx("span",{className:i===qr.POSITION?"active":"",children:"2. Position"})]})]}),c.jsx("button",{onClick:r,className:"close-button",children:"×"})]}),c.jsxs("div",{className:"modal-body",children:[i===qr.UPLOAD&&c.jsxs("div",{className:"upload-step",children:[c.jsx("p",{className:"step-description",children:"Upload a photo of your site to see how your TPV design will look when installed. For best results, use a photo taken from above or at a slight angle showing the floor area clearly."}),c.jsx(DF,{onPhotoUploaded:x})]}),i===qr.POSITION&&s&&c.jsx(qF,{ref:y,photoUrl:s.url,svgUrl:t,designSizeMm:{width_mm:e.width,length_mm:e.length},initialOpacity:.8,onChange:w})]}),i===qr.POSITION&&c.jsxs("div",{className:"modal-footer",children:[c.jsx("button",{onClick:()=>o(qr.UPLOAD),className:"btn-secondary",children:"Back"}),c.jsxs("div",{className:"footer-actions",children:[c.jsx("button",{onClick:S,disabled:!l,className:"btn-secondary",children:"Download PNG"}),c.jsx("button",{onClick:C,disabled:!l||b,className:"btn-primary",children:b?"Saving...":"Save to Project"})]})]})]}),c.jsx("style",{children:`
        .in-situ-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .in-situ-modal {
          background: white;
          border-radius: 12px;
          width: 100%;
          max-width: 1000px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .in-situ-modal .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .header-left {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .in-situ-modal .modal-header h2 {
          margin: 0;
          font-size: 1.25rem;
          color: #1e4a7a;
        }

        .step-indicator {
          display: flex;
          gap: 1rem;
          font-size: 0.75rem;
        }

        .step-indicator span {
          color: #9ca3af;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
        }

        .step-indicator span.active {
          background: #fff7f5;
          color: #ff6b35;
          font-weight: 500;
        }

        .step-indicator span.completed {
          color: #22c55e;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #9ca3af;
          padding: 0;
          line-height: 1;
        }

        .close-button:hover {
          color: #374151;
        }

        .modal-body {
          flex: 1;
          padding: 1.5rem;
          overflow-y: auto;
          min-height: 500px;
        }

        .upload-step {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .step-description {
          margin: 0;
          font-size: 0.875rem;
          color: #6b7280;
          line-height: 1.6;
        }

        .modal-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-top: 1px solid #e5e7eb;
          background: #f9fafb;
          border-radius: 0 0 12px 12px;
        }

        .footer-actions {
          display: flex;
          gap: 0.5rem;
        }

        .btn-primary,
        .btn-secondary {
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .btn-primary {
          background: #ff6b35;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #e55a2b;
        }

        .btn-primary:disabled {
          background: #d1d5db;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: white;
          color: #374151;
          border: 1px solid #d1d5db;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #f9fafb;
        }

        .btn-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .in-situ-modal {
            max-width: 100%;
            max-height: 100vh;
            border-radius: 0;
          }

          .modal-body {
            padding: 1rem;
          }

          .step-indicator {
            display: none;
          }

          .modal-footer {
            border-radius: 0;
          }
        }
      `})]})}function YF({isOpen:t,onClose:e,onConfirm:r,aspectRatio:n,defaultLongestSide:i=5e3}){const[o,s]=$.useState(i),[a,l]=$.useState(i/1e3),d=(g=>{if(!n||n<=0)return{width:g,length:g};if(n>=1){const b=g,m=Math.round(g/n);return{width:b,length:m}}else{const b=g;return{width:Math.round(g*n),length:b}}})(o),h=n>=1?"landscape":"portrait",f=n>=1?`${n.toFixed(1)}:1`:`1:${(1/n).toFixed(1)}`,p=g=>{const b=parseFloat(g.target.value)||0;l(b),s(Math.round(b*1e3))},v=()=>{r(d.width,d.length),e()};return t?c.jsxs(c.Fragment,{children:[c.jsx("div",{className:"dimension-modal-overlay",onClick:e,children:c.jsxs("div",{className:"dimension-modal",onClick:g=>g.stopPropagation(),children:[c.jsxs("div",{className:"dimension-modal-header",children:[c.jsxs("div",{className:"dimension-modal-title",children:[c.jsx("h2",{children:"Set Installation Size"}),c.jsx(Zf,{content:c.jsxs("div",{children:[c.jsx("p",{children:c.jsx("strong",{children:"Why specify dimensions?"})}),c.jsx("p",{style:{marginTop:"0.5rem"},children:"Accurate dimensions are essential for:"}),c.jsxs("ul",{style:{marginTop:"0.5rem",marginBottom:0,paddingLeft:"1.25rem"},children:[c.jsx("li",{children:"Calculating exact material quantities"}),c.jsx("li",{children:"Generating PDF specifications for manufacturers"}),c.jsx("li",{children:"Slicing designs into 1m×1m installation tiles"})]}),c.jsxs("p",{style:{marginTop:"0.5rem"},children:[c.jsx("strong",{children:"Tip:"})," Typical playground installations range from 3m to 20m on the longest side."]})]}),position:"bottom"})]}),c.jsx("button",{className:"dimension-modal-close",onClick:e,"aria-label":"Close",children:"×"})]}),c.jsxs("div",{className:"dimension-modal-body",children:[c.jsx("div",{className:"dimension-info",children:c.jsxs("p",{className:"dimension-aspect",children:["Your design has a ",c.jsxs("strong",{children:[f," ",h]})," aspect ratio"]})}),c.jsxs("div",{className:"dimension-input-group",children:[c.jsx("label",{htmlFor:"longest-dimension",children:"Installation Size (Longest Side)"}),c.jsxs("div",{className:"dimension-input-wrapper",children:[c.jsx("input",{id:"longest-dimension",type:"number",min:"0.1",max:"50",step:"0.1",value:a,onChange:p,className:"dimension-input"}),c.jsx("span",{className:"dimension-unit",children:"meters"})]}),c.jsx("p",{className:"dimension-help",children:"Enter the measurement of the longest side of your installation area. The other dimension will be calculated automatically based on your design's aspect ratio."})]}),c.jsxs("div",{className:"dimension-preview",children:[c.jsx("div",{className:"dimension-preview-title",children:"Calculated Dimensions:"}),c.jsxs("div",{className:"dimension-preview-values",children:[c.jsxs("div",{className:"dimension-preview-item",children:[c.jsx("span",{className:"dimension-preview-label",children:"Width:"}),c.jsxs("span",{className:"dimension-preview-value",children:[(d.width/1e3).toFixed(2),"m"]})]}),c.jsxs("div",{className:"dimension-preview-item",children:[c.jsx("span",{className:"dimension-preview-label",children:"Length:"}),c.jsxs("span",{className:"dimension-preview-value",children:[(d.length/1e3).toFixed(2),"m"]})]}),c.jsxs("div",{className:"dimension-preview-item",children:[c.jsx("span",{className:"dimension-preview-label",children:"Total Area:"}),c.jsxs("span",{className:"dimension-preview-value",children:[(d.width*d.length/1e6).toFixed(2),"m²"]})]})]})]}),c.jsxs("div",{className:"dimension-note",children:[c.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[c.jsx("circle",{cx:"8",cy:"8",r:"7"}),c.jsx("line",{x1:"8",y1:"11",x2:"8",y2:"8"}),c.jsx("circle",{cx:"8",cy:"5",r:"0.5",fill:"currentColor"})]}),c.jsx("p",{children:"These dimensions will be used to calculate material quantities for your PDF specification and to slice your design into 1m×1m installation tiles."})]})]}),c.jsxs("div",{className:"dimension-modal-footer",children:[c.jsx("button",{className:"dimension-btn dimension-btn-secondary",onClick:e,children:"Cancel"}),c.jsx("button",{className:"dimension-btn dimension-btn-primary",onClick:v,disabled:a<=0,children:"Confirm Size"})]})]})}),c.jsx("style",{children:`
        .dimension-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 20px;
        backdrop-filter: blur(4px);
      }

      .dimension-modal {
        background: white;
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        max-width: 500px;
        width: 100%;
        max-height: 90vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        animation: dimensionModalSlideIn 0.3s ease-out;
      }

      @keyframes dimensionModalSlideIn {
        from {
          opacity: 0;
          transform: translateY(-20px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      .dimension-modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 24px;
        border-bottom: 1px solid #e5e7eb;
      }

      .dimension-modal-title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .dimension-modal-header h2 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 600;
        color: #111827;
      }

      .dimension-modal-close {
        background: none;
        border: none;
        font-size: 2rem;
        line-height: 1;
        color: #9ca3af;
        cursor: pointer;
        padding: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        transition: all 0.2s;
      }

      .dimension-modal-close:hover {
        background: #f3f4f6;
        color: #111827;
      }

      .dimension-modal-body {
        padding: 24px;
        overflow-y: auto;
        flex: 1;
      }

      .dimension-info {
        background: #f0f9ff;
        border: 1px solid #bae6fd;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 24px;
      }

      .dimension-aspect {
        margin: 0;
        color: #0c4a6e;
        font-size: 0.95rem;
        line-height: 1.5;
      }

      .dimension-input-group {
        margin-bottom: 24px;
      }

      .dimension-input-group label {
        display: block;
        font-weight: 600;
        color: #374151;
        margin-bottom: 8px;
        font-size: 0.95rem;
      }

      .dimension-input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
      }

      .dimension-input {
        width: 100%;
        padding: 12px 16px;
        padding-right: 70px;
        font-size: 1.1rem;
        border: 2px solid #d1d5db;
        border-radius: 10px;
        transition: all 0.2s;
        font-family: inherit;
      }

      .dimension-input:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }

      .dimension-unit {
        position: absolute;
        right: 16px;
        color: #6b7280;
        font-weight: 500;
        pointer-events: none;
      }

      .dimension-help {
        margin: 8px 0 0 0;
        font-size: 0.85rem;
        color: #6b7280;
      }

      .dimension-preview {
        background: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 24px;
      }

      .dimension-preview-title {
        font-weight: 600;
        color: #374151;
        margin-bottom: 16px;
        font-size: 0.95rem;
      }

      .dimension-preview-values {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .dimension-preview-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        background: white;
        border-radius: 8px;
      }

      .dimension-preview-label {
        color: #6b7280;
        font-size: 0.9rem;
      }

      .dimension-preview-value {
        font-weight: 600;
        color: #111827;
        font-size: 1.05rem;
      }

      .dimension-note {
        display: flex;
        gap: 12px;
        padding: 16px;
        background: #fffbeb;
        border: 1px solid #fde68a;
        border-radius: 10px;
      }

      .dimension-note svg {
        flex-shrink: 0;
        margin-top: 2px;
        color: #f59e0b;
      }

      .dimension-note p {
        margin: 0;
        font-size: 0.85rem;
        color: #78350f;
        line-height: 1.5;
      }

      .dimension-modal-footer {
        padding: 20px 24px;
        border-top: 1px solid #e5e7eb;
        display: flex;
        gap: 12px;
        justify-content: flex-end;
      }

      .dimension-btn {
        padding: 10px 24px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 0.95rem;
        cursor: pointer;
        transition: all 0.2s;
        border: none;
        font-family: inherit;
      }

      .dimension-btn-secondary {
        background: white;
        border: 1px solid #d1d5db;
        color: #374151;
      }

      .dimension-btn-secondary:hover {
        background: #f9fafb;
        border-color: #9ca3af;
      }

      .dimension-btn-primary {
        background: #3b82f6;
        color: white;
      }

      .dimension-btn-primary:hover {
        background: #2563eb;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
      }

      .dimension-btn-primary:disabled {
        background: #9ca3af;
        cursor: not-allowed;
        box-shadow: none;
      }

      @media (max-width: 640px) {
        .dimension-modal {
          max-width: none;
          width: 100%;
          margin: 0;
          max-height: 100vh;
          border-radius: 0;
        }

        .dimension-modal-header {
          padding: 20px;
        }

        .dimension-modal-header h2 {
          font-size: 1.25rem;
        }

        .dimension-modal-body {
          padding: 20px;
        }

        .dimension-modal-footer {
          flex-direction: column-reverse;
          padding: 16px 20px;
        }

        .dimension-btn {
          width: 100%;
        }
      }
      `})]}):null}function XF(t){const e=new Map;for(const r of t){const n=r.originalColor.hex.toLowerCase(),i=r.targetColor.hex.toLowerCase(),o=r.chosenRecipe.id,s=r.chosenRecipe.deltaE,a=r.targetColor.areaPct;e.set(n,{blendHex:i,recipeId:o,deltaE:s,coverage:a,quality:r.chosenRecipe.quality,components:r.chosenRecipe.components})}return e}function ZF(t){return t.replace("#","").toLowerCase()}async function ho(t,e,r=null){try{let n;if(r)n=r,console.log(`[SVG-RECOLOR] Using provided SVG text (${n.length} chars)`);else{console.log("[SVG-RECOLOR] Fetching SVG from:",t);const v=await fetch(t);if(!v.ok)throw new Error(`Failed to fetch SVG: ${v.status} ${v.statusText}`);n=await v.text(),console.log(`[SVG-RECOLOR] Fetched SVG (${n.length} chars)`)}console.log("[SVG-RECOLOR] Sanitizing SVG...");const i=ow(n);if(!i)throw new Error("SVG sanitization failed - content rejected");const s=new DOMParser().parseFromString(i,"image/svg+xml"),a=s.querySelector("parsererror");if(a)throw new Error(`SVG parse error: ${a.textContent}`);const l=s.documentElement;if(l.tagName!=="svg")throw new Error("Invalid SVG: root element is not <svg>");const u=JF(l,e);console.log("[SVG-RECOLOR] Recoloring complete:",u);const h=new XMLSerializer().serializeToString(s),f=new Blob([h],{type:"image/svg+xml"});return{dataUrl:URL.createObjectURL(f),svgText:h,stats:u}}catch(n){throw console.error("[SVG-RECOLOR] Error:",n),n}}function JF(t,e){const r={totalElements:0,fillsReplaced:0,strokesReplaced:0,stopColorsReplaced:0,stylesProcessed:0,colorsNotMapped:new Set},n=t.querySelectorAll("*");r.totalElements=n.length;for(const s of n){const a=s.getAttribute("fill");if(a&&a!=="none"){const h=Zr(a,e,r.colorsNotMapped);h!==a&&(s.setAttribute("fill",h),r.fillsReplaced++)}const l=s.getAttribute("stroke");if(l&&l!=="none"){const h=Zr(l,e,r.colorsNotMapped);h!==l&&(s.setAttribute("stroke",h),r.strokesReplaced++)}const u=s.getAttribute("stop-color");if(u&&u!=="none"){const h=Zr(u,e,r.colorsNotMapped);h!==u&&(s.setAttribute("stop-color",h),r.stopColorsReplaced++)}const d=s.getAttribute("style");if(d){const h=Ov(d,e,r);h!==d&&(s.setAttribute("style",h),r.stylesProcessed++)}}const i=t.querySelectorAll("style");for(const s of i){const a=s.textContent,l=eB(a,e,r);l!==a&&(s.textContent=l,r.stylesProcessed++)}const o=t.querySelectorAll("stop");for(const s of o){const a=s.getAttribute("stop-color");if(a&&a!=="none"){const u=Zr(a,e,r.colorsNotMapped);u!==a&&(s.setAttribute("stop-color",u),r.stopColorsReplaced++)}const l=s.getAttribute("style");if(l&&l.includes("stop-color")){const u=Ov(l,e,r);u!==l&&(s.setAttribute("style",u),r.stylesProcessed++)}}return r}function Zr(t,e,r){const n=tB(t);if(!n)return t;const i=`#${n}`,o=e.get(i);if(o)return o.blendHex;const s=Tv(n);if(!s)return t;const a=Nv(s);let l=null,u=1/0;for(const[d,h]of e.entries()){const f=Tv(d.replace("#",""));if(!f)continue;const p=Nv(f),v=QF(a,p);if(v<u&&(u=v,l=h),v<=9)return console.log(`[SVG-RECOLOR] Tolerance match: ${i} → ${d} (ΔE=${v.toFixed(2)})`),h.blendHex}return l?(console.log(`[SVG-RECOLOR] Fallback to nearest: ${i} → ${l.blendHex} (ΔE=${u.toFixed(2)})`),r&&r.add(t),l.blendHex):(console.warn(`[SVG-RECOLOR] No mapping found: ${i}`),t)}function Tv(t){if(t.length!==6)return null;const e=parseInt(t.substring(0,2),16),r=parseInt(t.substring(2,4),16),n=parseInt(t.substring(4,6),16);return isNaN(e)||isNaN(r)||isNaN(n)?null:{r:e,g:r,b:n}}function Nv(t){let e=t.r/255,r=t.g/255,n=t.b/255;e=e>.04045?Math.pow((e+.055)/1.055,2.4):e/12.92,r=r>.04045?Math.pow((r+.055)/1.055,2.4):r/12.92,n=n>.04045?Math.pow((n+.055)/1.055,2.4):n/12.92;const i=(e*.4124+r*.3576+n*.1805)*100,o=(e*.2126+r*.7152+n*.0722)*100,s=(e*.0193+r*.1192+n*.9505)*100,a=95.047,l=100,u=108.883;let d=i/a,h=o/l,f=s/u;return d=d>.008856?Math.pow(d,1/3):7.787*d+16/116,h=h>.008856?Math.pow(h,1/3):7.787*h+16/116,f=f>.008856?Math.pow(f,1/3):7.787*f+16/116,{L:116*h-16,a:500*(d-h),b:200*(h-f)}}function QF(t,e){const o=Math.PI*2,s=Math.PI,a=(t.L+e.L)/2,l=Math.sqrt(t.a*t.a+t.b*t.b),u=Math.sqrt(e.a*e.a+e.b*e.b),d=(l+u)/2,h=.5*(1-Math.sqrt(Math.pow(d,7)/(Math.pow(d,7)+Math.pow(25,7)))),f=t.a*(1+h),p=e.a*(1+h),v=Math.sqrt(f*f+t.b*t.b),g=Math.sqrt(p*p+e.b*e.b),b=(v+g)/2;let m=Math.atan2(t.b,f);m<0&&(m+=o);let y=Math.atan2(e.b,p);y<0&&(y+=o);const x=Math.abs(m-y)>s?(m+y+o)/2:(m+y)/2,w=1-.17*Math.cos(x-Math.PI/6)+.24*Math.cos(2*x)+.32*Math.cos(3*x+Math.PI/30)-.2*Math.cos(4*x-63*Math.PI/180);let j=y-m;Math.abs(j)>s&&(j=j>0?j-o:j+o);const S=e.L-t.L,C=g-v,N=2*Math.sqrt(v*g)*Math.sin(j/2),E=1+.015*Math.pow(a-50,2)/Math.sqrt(20+Math.pow(a-50,2)),A=1+.045*b,U=1+.015*b*w,O=30*Math.PI/180*Math.exp(-Math.pow((x-275*Math.PI/180)/(25*Math.PI/180),2)),k=-(2*Math.sqrt(Math.pow(b,7)/(Math.pow(b,7)+Math.pow(25,7))))*Math.sin(2*O);return Math.sqrt(Math.pow(S/(1*E),2)+Math.pow(C/(1*A),2)+Math.pow(N/(1*U),2)+k*(C/(1*A))*(N/(1*U)))}function Ov(t,e,r){let n=t;return n=n.replace(/fill:\s*([^;]+)/gi,(i,o)=>`fill: ${Zr(o.trim(),e,r.colorsNotMapped)}`),n=n.replace(/stroke:\s*([^;]+)/gi,(i,o)=>`stroke: ${Zr(o.trim(),e,r.colorsNotMapped)}`),n=n.replace(/stop-color:\s*([^;]+)/gi,(i,o)=>`stop-color: ${Zr(o.trim(),e,r.colorsNotMapped)}`),n}function eB(t,e,r){let n=t,i=0;return n=n.replace(/fill:\s*([^;}\s]+)/gi,(o,s)=>{const a=s.trim(),l=Zr(a,e,r.colorsNotMapped);return l!==a&&(i++,console.log(`[SVG-RECOLOR-CSS] Replaced fill: ${a} → ${l}`)),`fill: ${l}`}),n=n.replace(/stroke:\s*([^;}\s]+)/gi,(o,s)=>{const a=s.trim(),l=Zr(a,e,r.colorsNotMapped);return l!==a&&(i++,console.log(`[SVG-RECOLOR-CSS] Replaced stroke: ${a} → ${l}`)),`stroke: ${l}`}),n=n.replace(/stop-color:\s*([^;}\s]+)/gi,(o,s)=>{const a=s.trim(),l=Zr(a,e,r.colorsNotMapped);return l!==a&&(i++,console.log(`[SVG-RECOLOR-CSS] Replaced stop-color: ${a} → ${l}`)),`stop-color: ${l}`}),i>0&&console.log(`[SVG-RECOLOR-CSS] Total CSS color replacements: ${i}`),n}function tB(t){const e=t.trim().toLowerCase();if(e.match(/^#?[0-9a-f]{6}$/))return ZF(e);const r=e.match(/^#?([0-9a-f]{3})$/);if(r)return r[1].split("").map(s=>s+s).join("");const n=e.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);if(n){const o=parseInt(n[1],10),s=parseInt(n[2],10),a=parseInt(n[3],10);return rB(o,s,a)}const i={white:"ffffff",black:"000000",red:"ff0000",green:"008000",blue:"0000ff",yellow:"ffff00",cyan:"00ffff",magenta:"ff00ff",gray:"808080",grey:"808080",orange:"ffa500",purple:"800080"};return i[e]?i[e]:null}function rB(t,e,r){const n=i=>Math.max(0,Math.min(255,i)).toString(16).padStart(2,"0");return`${n(t)}${n(e)}${n(r)}`}function Rv(t){const r=new DOMParser().parseFromString(t,"image/svg+xml"),n=r.querySelector("parsererror");if(n)return console.error("[SVG-REGION-TAGGER] Parse error:",n.textContent),t;const i=r.documentElement;if(!i.hasAttribute("viewBox")){const a=i.getAttribute("width"),l=i.getAttribute("height");if(a&&l){const u=parseFloat(a),d=parseFloat(l);!isNaN(u)&&!isNaN(d)&&(i.setAttribute("viewBox",`0 0 ${u} ${d}`),console.log(`[SVG-REGION-TAGGER] Added viewBox from dimensions: 0 0 ${u} ${d}`))}else{const u=nB(r);u&&(i.setAttribute("viewBox",`${u.x} ${u.y} ${u.width} ${u.height}`),console.log(`[SVG-REGION-TAGGER] Added viewBox from content bounds: ${u.x} ${u.y} ${u.width} ${u.height}`))}}let o=0;return r.querySelectorAll("path, rect, circle, ellipse, polygon, polyline, line").forEach(a=>{a.hasAttribute("data-region-id")||a.setAttribute("data-region-id",`region-${o++}`)}),console.log(`[SVG-REGION-TAGGER] Tagged ${o} regions`),new XMLSerializer().serializeToString(r)}function nB(t){try{const e=t.documentElement.cloneNode(!0),r=document.createElement("div");r.style.position="absolute",r.style.visibility="hidden",document.body.appendChild(r),r.appendChild(e);const n=e.getBBox();if(document.body.removeChild(r),n.width>0&&n.height>0)return{x:Math.floor(n.x),y:Math.floor(n.y),width:Math.ceil(n.width),height:Math.ceil(n.height)}}catch(e){console.warn("[SVG-REGION-TAGGER] Could not calculate content bounds:",e)}return null}function Av(t,e){if(!e||e.size===0)return t;const n=new DOMParser().parseFromString(t,"image/svg+xml"),i=n.querySelector("parsererror");if(i)return console.error("[SVG-REGION-OVERRIDES] Parse error:",i.textContent),t;let o=0;return e.forEach((s,a)=>{const l=n.querySelector(`[data-region-id="${a}"]`);if(l){if(l.hasAttribute("fill")&&(l.setAttribute("fill",s),o++),l.hasAttribute("stroke")&&l.getAttribute("stroke")!=="none"){const d=l.getAttribute("stroke");d&&d!=="#000"&&d!=="#000000"&&d!=="#fff"&&d!=="#ffffff"&&l.setAttribute("stroke",s)}const u=l.getAttribute("style");if(u&&u.includes("fill:")){const d=u.replace(/fill:\s*[^;]+/,`fill: ${s}`);l.setAttribute("style",d)}}else console.warn(`[SVG-REGION-OVERRIDES] Region not found: ${a}`)}),console.log(`[SVG-REGION-OVERRIDES] Applied ${o} region overrides`),new XMLSerializer().serializeToString(n)}const Pv={landscape:[{name:"1:1",ratio:1,width:1024,height:1024},{name:"4:3",ratio:4/3,width:1024,height:768},{name:"3:2",ratio:3/2,width:1024,height:683},{name:"16:9",ratio:16/9,width:1024,height:576},{name:"2:1",ratio:2,width:1024,height:512},{name:"3:1",ratio:3,width:1024,height:341}],portrait:[{name:"1:1",ratio:1,width:1024,height:1024},{name:"3:4",ratio:3/4,width:768,height:1024},{name:"2:3",ratio:2/3,width:683,height:1024},{name:"9:16",ratio:9/16,width:576,height:1024},{name:"1:2",ratio:1/2,width:512,height:1024},{name:"1:3",ratio:1/3,width:341,height:1024}]},qs={safeDifference:.3,tilingThreshold:3.5,framingThreshold:2.5};function iB(t,e){return t/e}function oB(t){return t>=.95&&t<=1.05?"square":t>1?"landscape":"portrait"}function sB(t,e){const r=e==="portrait"?Pv.portrait:Pv.landscape;let n=r[0],i=Math.abs(t-n.ratio);for(const o of r){const s=Math.abs(t-o.ratio);s<i&&(i=s,n=o)}return{...n,difference:i}}function aB(t,e,r){return t>=qs.tilingThreshold||t<=1/qs.tilingThreshold?{mode:"tiling",reason:"Extreme aspect ratio - design will repeat along length",warning:!0}:r>=qs.safeDifference||t>=qs.framingThreshold||t<=1/qs.framingThreshold?{mode:"framing",reason:"Design panel centered with base color surround",warning:!1}:{mode:"full",reason:"Design fills entire surface",warning:!1}}function lB(t,e){const r=iB(t,e),n=oB(r),i=sB(r,n),o=aB(r,i.ratio,i.difference);return{user:{widthMM:t,heightMM:e,aspectRatio:r,orientation:n,formatted:`${(t/1e3).toFixed(1)}m × ${(e/1e3).toFixed(1)}m`},canonical:{name:i.name,ratio:i.ratio,width:i.width,height:i.height,difference:i.difference},layout:o,recraft:{width:i.width,height:i.height,metadata:{targetWidthMM:t,targetHeightMM:e,layoutMode:o.mode}}}}function cB(t){const{user:e,canonical:r,layout:n}=t;let i=`Generating ${r.name} design panel`;return n.mode==="full"?i+=` (fills ${e.formatted} surface)`:n.mode==="framing"?i+=` (centered in ${e.formatted} surface with base color surround)`:n.mode==="tiling"&&(i+=` (will repeat along ${e.formatted} surface)`),i}function uB(t){return t.layout.warning||t.layout.mode!=="full"}async function $v(t,e="tpv-studio-uploads"){try{const r=Date.now(),n=Math.random().toString(36).substring(7),i=t.name.split(".").pop(),s=`uploads/${`${r}-${n}.${i}`}`;console.log("[Upload] Uploading file:",t.name,"→",s);const{data:a,error:l}=await Mt.storage.from(e).upload(s,t,{cacheControl:"3600",upsert:!1});if(l)return console.error("[Upload] Error:",l),{success:!1,error:l.message||"Failed to upload file"};const{data:{publicUrl:u}}=Mt.storage.from(e).getPublicUrl(s);return console.log("[Upload] Success:",u),{success:!0,url:u,path:s}}catch(r){return console.error("[Upload] Unexpected error:",r),{success:!1,error:r.message||"Unexpected error during upload"}}}function Iv(t,e={}){const{maxSizeMB:r=10,allowedTypes:n=["image/png","image/jpeg","image/svg+xml"]}=e;if(!t)return{valid:!1,error:"No file selected"};if(!n.includes(t.type))return{valid:!1,error:`Invalid file type. Allowed: ${n.map(s=>s.split("/")[1].toUpperCase()).join(", ")}`};const i=r*1024*1024;return t.size>i?{valid:!1,error:`File too large. Maximum size: ${r}MB`}:{valid:!0}}function Ll(t){throw new Error('Could not dynamically require "'+t+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var T1={exports:{}};/*!

JSZip v3.10.1 - A JavaScript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/main/LICENSE.markdown.

JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/main/LICENSE
*/(function(t,e){(function(r){t.exports=r()})(function(){return function r(n,i,o){function s(u,d){if(!i[u]){if(!n[u]){var h=typeof Ll=="function"&&Ll;if(!d&&h)return h(u,!0);if(a)return a(u,!0);var f=new Error("Cannot find module '"+u+"'");throw f.code="MODULE_NOT_FOUND",f}var p=i[u]={exports:{}};n[u][0].call(p.exports,function(v){var g=n[u][1][v];return s(g||v)},p,p.exports,r,n,i,o)}return i[u].exports}for(var a=typeof Ll=="function"&&Ll,l=0;l<o.length;l++)s(o[l]);return s}({1:[function(r,n,i){var o=r("./utils"),s=r("./support"),a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";i.encode=function(l){for(var u,d,h,f,p,v,g,b=[],m=0,y=l.length,x=y,w=o.getTypeOf(l)!=="string";m<l.length;)x=y-m,h=w?(u=l[m++],d=m<y?l[m++]:0,m<y?l[m++]:0):(u=l.charCodeAt(m++),d=m<y?l.charCodeAt(m++):0,m<y?l.charCodeAt(m++):0),f=u>>2,p=(3&u)<<4|d>>4,v=1<x?(15&d)<<2|h>>6:64,g=2<x?63&h:64,b.push(a.charAt(f)+a.charAt(p)+a.charAt(v)+a.charAt(g));return b.join("")},i.decode=function(l){var u,d,h,f,p,v,g=0,b=0,m="data:";if(l.substr(0,m.length)===m)throw new Error("Invalid base64 input, it looks like a data url.");var y,x=3*(l=l.replace(/[^A-Za-z0-9+/=]/g,"")).length/4;if(l.charAt(l.length-1)===a.charAt(64)&&x--,l.charAt(l.length-2)===a.charAt(64)&&x--,x%1!=0)throw new Error("Invalid base64 input, bad content length.");for(y=s.uint8array?new Uint8Array(0|x):new Array(0|x);g<l.length;)u=a.indexOf(l.charAt(g++))<<2|(f=a.indexOf(l.charAt(g++)))>>4,d=(15&f)<<4|(p=a.indexOf(l.charAt(g++)))>>2,h=(3&p)<<6|(v=a.indexOf(l.charAt(g++))),y[b++]=u,p!==64&&(y[b++]=d),v!==64&&(y[b++]=h);return y}},{"./support":30,"./utils":32}],2:[function(r,n,i){var o=r("./external"),s=r("./stream/DataWorker"),a=r("./stream/Crc32Probe"),l=r("./stream/DataLengthProbe");function u(d,h,f,p,v){this.compressedSize=d,this.uncompressedSize=h,this.crc32=f,this.compression=p,this.compressedContent=v}u.prototype={getContentWorker:function(){var d=new s(o.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new l("data_length")),h=this;return d.on("end",function(){if(this.streamInfo.data_length!==h.uncompressedSize)throw new Error("Bug : uncompressed data size mismatch")}),d},getCompressedWorker:function(){return new s(o.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize",this.compressedSize).withStreamInfo("uncompressedSize",this.uncompressedSize).withStreamInfo("crc32",this.crc32).withStreamInfo("compression",this.compression)}},u.createWorkerFrom=function(d,h,f){return d.pipe(new a).pipe(new l("uncompressedSize")).pipe(h.compressWorker(f)).pipe(new l("compressedSize")).withStreamInfo("compression",h)},n.exports=u},{"./external":6,"./stream/Crc32Probe":25,"./stream/DataLengthProbe":26,"./stream/DataWorker":27}],3:[function(r,n,i){var o=r("./stream/GenericWorker");i.STORE={magic:"\0\0",compressWorker:function(){return new o("STORE compression")},uncompressWorker:function(){return new o("STORE decompression")}},i.DEFLATE=r("./flate")},{"./flate":7,"./stream/GenericWorker":28}],4:[function(r,n,i){var o=r("./utils"),s=function(){for(var a,l=[],u=0;u<256;u++){a=u;for(var d=0;d<8;d++)a=1&a?3988292384^a>>>1:a>>>1;l[u]=a}return l}();n.exports=function(a,l){return a!==void 0&&a.length?o.getTypeOf(a)!=="string"?function(u,d,h,f){var p=s,v=f+h;u^=-1;for(var g=f;g<v;g++)u=u>>>8^p[255&(u^d[g])];return-1^u}(0|l,a,a.length,0):function(u,d,h,f){var p=s,v=f+h;u^=-1;for(var g=f;g<v;g++)u=u>>>8^p[255&(u^d.charCodeAt(g))];return-1^u}(0|l,a,a.length,0):0}},{"./utils":32}],5:[function(r,n,i){i.base64=!1,i.binary=!1,i.dir=!1,i.createFolders=!0,i.date=null,i.compression=null,i.compressionOptions=null,i.comment=null,i.unixPermissions=null,i.dosPermissions=null},{}],6:[function(r,n,i){var o=null;o=typeof Promise<"u"?Promise:r("lie"),n.exports={Promise:o}},{lie:37}],7:[function(r,n,i){var o=typeof Uint8Array<"u"&&typeof Uint16Array<"u"&&typeof Uint32Array<"u",s=r("pako"),a=r("./utils"),l=r("./stream/GenericWorker"),u=o?"uint8array":"array";function d(h,f){l.call(this,"FlateWorker/"+h),this._pako=null,this._pakoAction=h,this._pakoOptions=f,this.meta={}}i.magic="\b\0",a.inherits(d,l),d.prototype.processChunk=function(h){this.meta=h.meta,this._pako===null&&this._createPako(),this._pako.push(a.transformTo(u,h.data),!1)},d.prototype.flush=function(){l.prototype.flush.call(this),this._pako===null&&this._createPako(),this._pako.push([],!0)},d.prototype.cleanUp=function(){l.prototype.cleanUp.call(this),this._pako=null},d.prototype._createPako=function(){this._pako=new s[this._pakoAction]({raw:!0,level:this._pakoOptions.level||-1});var h=this;this._pako.onData=function(f){h.push({data:f,meta:h.meta})}},i.compressWorker=function(h){return new d("Deflate",h)},i.uncompressWorker=function(){return new d("Inflate",{})}},{"./stream/GenericWorker":28,"./utils":32,pako:38}],8:[function(r,n,i){function o(p,v){var g,b="";for(g=0;g<v;g++)b+=String.fromCharCode(255&p),p>>>=8;return b}function s(p,v,g,b,m,y){var x,w,j=p.file,S=p.compression,C=y!==u.utf8encode,N=a.transformTo("string",y(j.name)),E=a.transformTo("string",u.utf8encode(j.name)),A=j.comment,U=a.transformTo("string",y(A)),O=a.transformTo("string",u.utf8encode(A)),F=E.length!==j.name.length,k=O.length!==A.length,W="",ie="",J="",K=j.dir,L=j.date,oe={crc32:0,compressedSize:0,uncompressedSize:0};v&&!g||(oe.crc32=p.crc32,oe.compressedSize=p.compressedSize,oe.uncompressedSize=p.uncompressedSize);var H=0;v&&(H|=8),C||!F&&!k||(H|=2048);var G=0,pe=0;K&&(G|=16),m==="UNIX"?(pe=798,G|=function(ae,Re){var Ke=ae;return ae||(Ke=Re?16893:33204),(65535&Ke)<<16}(j.unixPermissions,K)):(pe=20,G|=function(ae){return 63&(ae||0)}(j.dosPermissions)),x=L.getUTCHours(),x<<=6,x|=L.getUTCMinutes(),x<<=5,x|=L.getUTCSeconds()/2,w=L.getUTCFullYear()-1980,w<<=4,w|=L.getUTCMonth()+1,w<<=5,w|=L.getUTCDate(),F&&(ie=o(1,1)+o(d(N),4)+E,W+="up"+o(ie.length,2)+ie),k&&(J=o(1,1)+o(d(U),4)+O,W+="uc"+o(J.length,2)+J);var Q="";return Q+=`
\0`,Q+=o(H,2),Q+=S.magic,Q+=o(x,2),Q+=o(w,2),Q+=o(oe.crc32,4),Q+=o(oe.compressedSize,4),Q+=o(oe.uncompressedSize,4),Q+=o(N.length,2),Q+=o(W.length,2),{fileRecord:h.LOCAL_FILE_HEADER+Q+N+W,dirRecord:h.CENTRAL_FILE_HEADER+o(pe,2)+Q+o(U.length,2)+"\0\0\0\0"+o(G,4)+o(b,4)+N+W+U}}var a=r("../utils"),l=r("../stream/GenericWorker"),u=r("../utf8"),d=r("../crc32"),h=r("../signature");function f(p,v,g,b){l.call(this,"ZipFileWorker"),this.bytesWritten=0,this.zipComment=v,this.zipPlatform=g,this.encodeFileName=b,this.streamFiles=p,this.accumulate=!1,this.contentBuffer=[],this.dirRecords=[],this.currentSourceOffset=0,this.entriesCount=0,this.currentFile=null,this._sources=[]}a.inherits(f,l),f.prototype.push=function(p){var v=p.meta.percent||0,g=this.entriesCount,b=this._sources.length;this.accumulate?this.contentBuffer.push(p):(this.bytesWritten+=p.data.length,l.prototype.push.call(this,{data:p.data,meta:{currentFile:this.currentFile,percent:g?(v+100*(g-b-1))/g:100}}))},f.prototype.openedSource=function(p){this.currentSourceOffset=this.bytesWritten,this.currentFile=p.file.name;var v=this.streamFiles&&!p.file.dir;if(v){var g=s(p,v,!1,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);this.push({data:g.fileRecord,meta:{percent:0}})}else this.accumulate=!0},f.prototype.closedSource=function(p){this.accumulate=!1;var v=this.streamFiles&&!p.file.dir,g=s(p,v,!0,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);if(this.dirRecords.push(g.dirRecord),v)this.push({data:function(b){return h.DATA_DESCRIPTOR+o(b.crc32,4)+o(b.compressedSize,4)+o(b.uncompressedSize,4)}(p),meta:{percent:100}});else for(this.push({data:g.fileRecord,meta:{percent:0}});this.contentBuffer.length;)this.push(this.contentBuffer.shift());this.currentFile=null},f.prototype.flush=function(){for(var p=this.bytesWritten,v=0;v<this.dirRecords.length;v++)this.push({data:this.dirRecords[v],meta:{percent:100}});var g=this.bytesWritten-p,b=function(m,y,x,w,j){var S=a.transformTo("string",j(w));return h.CENTRAL_DIRECTORY_END+"\0\0\0\0"+o(m,2)+o(m,2)+o(y,4)+o(x,4)+o(S.length,2)+S}(this.dirRecords.length,g,p,this.zipComment,this.encodeFileName);this.push({data:b,meta:{percent:100}})},f.prototype.prepareNextSource=function(){this.previous=this._sources.shift(),this.openedSource(this.previous.streamInfo),this.isPaused?this.previous.pause():this.previous.resume()},f.prototype.registerPrevious=function(p){this._sources.push(p);var v=this;return p.on("data",function(g){v.processChunk(g)}),p.on("end",function(){v.closedSource(v.previous.streamInfo),v._sources.length?v.prepareNextSource():v.end()}),p.on("error",function(g){v.error(g)}),this},f.prototype.resume=function(){return!!l.prototype.resume.call(this)&&(!this.previous&&this._sources.length?(this.prepareNextSource(),!0):this.previous||this._sources.length||this.generatedError?void 0:(this.end(),!0))},f.prototype.error=function(p){var v=this._sources;if(!l.prototype.error.call(this,p))return!1;for(var g=0;g<v.length;g++)try{v[g].error(p)}catch{}return!0},f.prototype.lock=function(){l.prototype.lock.call(this);for(var p=this._sources,v=0;v<p.length;v++)p[v].lock()},n.exports=f},{"../crc32":4,"../signature":23,"../stream/GenericWorker":28,"../utf8":31,"../utils":32}],9:[function(r,n,i){var o=r("../compressions"),s=r("./ZipFileWorker");i.generateWorker=function(a,l,u){var d=new s(l.streamFiles,u,l.platform,l.encodeFileName),h=0;try{a.forEach(function(f,p){h++;var v=function(y,x){var w=y||x,j=o[w];if(!j)throw new Error(w+" is not a valid compression method !");return j}(p.options.compression,l.compression),g=p.options.compressionOptions||l.compressionOptions||{},b=p.dir,m=p.date;p._compressWorker(v,g).withStreamInfo("file",{name:f,dir:b,date:m,comment:p.comment||"",unixPermissions:p.unixPermissions,dosPermissions:p.dosPermissions}).pipe(d)}),d.entriesCount=h}catch(f){d.error(f)}return d}},{"../compressions":3,"./ZipFileWorker":8}],10:[function(r,n,i){function o(){if(!(this instanceof o))return new o;if(arguments.length)throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");this.files=Object.create(null),this.comment=null,this.root="",this.clone=function(){var s=new o;for(var a in this)typeof this[a]!="function"&&(s[a]=this[a]);return s}}(o.prototype=r("./object")).loadAsync=r("./load"),o.support=r("./support"),o.defaults=r("./defaults"),o.version="3.10.1",o.loadAsync=function(s,a){return new o().loadAsync(s,a)},o.external=r("./external"),n.exports=o},{"./defaults":5,"./external":6,"./load":11,"./object":15,"./support":30}],11:[function(r,n,i){var o=r("./utils"),s=r("./external"),a=r("./utf8"),l=r("./zipEntries"),u=r("./stream/Crc32Probe"),d=r("./nodejsUtils");function h(f){return new s.Promise(function(p,v){var g=f.decompressed.getContentWorker().pipe(new u);g.on("error",function(b){v(b)}).on("end",function(){g.streamInfo.crc32!==f.decompressed.crc32?v(new Error("Corrupted zip : CRC32 mismatch")):p()}).resume()})}n.exports=function(f,p){var v=this;return p=o.extend(p||{},{base64:!1,checkCRC32:!1,optimizedBinaryString:!1,createFolders:!1,decodeFileName:a.utf8decode}),d.isNode&&d.isStream(f)?s.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")):o.prepareContent("the loaded zip file",f,!0,p.optimizedBinaryString,p.base64).then(function(g){var b=new l(p);return b.load(g),b}).then(function(g){var b=[s.Promise.resolve(g)],m=g.files;if(p.checkCRC32)for(var y=0;y<m.length;y++)b.push(h(m[y]));return s.Promise.all(b)}).then(function(g){for(var b=g.shift(),m=b.files,y=0;y<m.length;y++){var x=m[y],w=x.fileNameStr,j=o.resolve(x.fileNameStr);v.file(j,x.decompressed,{binary:!0,optimizedBinaryString:!0,date:x.date,dir:x.dir,comment:x.fileCommentStr.length?x.fileCommentStr:null,unixPermissions:x.unixPermissions,dosPermissions:x.dosPermissions,createFolders:p.createFolders}),x.dir||(v.file(j).unsafeOriginalName=w)}return b.zipComment.length&&(v.comment=b.zipComment),v})}},{"./external":6,"./nodejsUtils":14,"./stream/Crc32Probe":25,"./utf8":31,"./utils":32,"./zipEntries":33}],12:[function(r,n,i){var o=r("../utils"),s=r("../stream/GenericWorker");function a(l,u){s.call(this,"Nodejs stream input adapter for "+l),this._upstreamEnded=!1,this._bindStream(u)}o.inherits(a,s),a.prototype._bindStream=function(l){var u=this;(this._stream=l).pause(),l.on("data",function(d){u.push({data:d,meta:{percent:0}})}).on("error",function(d){u.isPaused?this.generatedError=d:u.error(d)}).on("end",function(){u.isPaused?u._upstreamEnded=!0:u.end()})},a.prototype.pause=function(){return!!s.prototype.pause.call(this)&&(this._stream.pause(),!0)},a.prototype.resume=function(){return!!s.prototype.resume.call(this)&&(this._upstreamEnded?this.end():this._stream.resume(),!0)},n.exports=a},{"../stream/GenericWorker":28,"../utils":32}],13:[function(r,n,i){var o=r("readable-stream").Readable;function s(a,l,u){o.call(this,l),this._helper=a;var d=this;a.on("data",function(h,f){d.push(h)||d._helper.pause(),u&&u(f)}).on("error",function(h){d.emit("error",h)}).on("end",function(){d.push(null)})}r("../utils").inherits(s,o),s.prototype._read=function(){this._helper.resume()},n.exports=s},{"../utils":32,"readable-stream":16}],14:[function(r,n,i){n.exports={isNode:typeof Buffer<"u",newBufferFrom:function(o,s){if(Buffer.from&&Buffer.from!==Uint8Array.from)return Buffer.from(o,s);if(typeof o=="number")throw new Error('The "data" argument must not be a number');return new Buffer(o,s)},allocBuffer:function(o){if(Buffer.alloc)return Buffer.alloc(o);var s=new Buffer(o);return s.fill(0),s},isBuffer:function(o){return Buffer.isBuffer(o)},isStream:function(o){return o&&typeof o.on=="function"&&typeof o.pause=="function"&&typeof o.resume=="function"}}},{}],15:[function(r,n,i){function o(j,S,C){var N,E=a.getTypeOf(S),A=a.extend(C||{},d);A.date=A.date||new Date,A.compression!==null&&(A.compression=A.compression.toUpperCase()),typeof A.unixPermissions=="string"&&(A.unixPermissions=parseInt(A.unixPermissions,8)),A.unixPermissions&&16384&A.unixPermissions&&(A.dir=!0),A.dosPermissions&&16&A.dosPermissions&&(A.dir=!0),A.dir&&(j=m(j)),A.createFolders&&(N=b(j))&&y.call(this,N,!0);var U=E==="string"&&A.binary===!1&&A.base64===!1;C&&C.binary!==void 0||(A.binary=!U),(S instanceof h&&S.uncompressedSize===0||A.dir||!S||S.length===0)&&(A.base64=!1,A.binary=!0,S="",A.compression="STORE",E="string");var O=null;O=S instanceof h||S instanceof l?S:v.isNode&&v.isStream(S)?new g(j,S):a.prepareContent(j,S,A.binary,A.optimizedBinaryString,A.base64);var F=new f(j,O,A);this.files[j]=F}var s=r("./utf8"),a=r("./utils"),l=r("./stream/GenericWorker"),u=r("./stream/StreamHelper"),d=r("./defaults"),h=r("./compressedObject"),f=r("./zipObject"),p=r("./generate"),v=r("./nodejsUtils"),g=r("./nodejs/NodejsStreamInputAdapter"),b=function(j){j.slice(-1)==="/"&&(j=j.substring(0,j.length-1));var S=j.lastIndexOf("/");return 0<S?j.substring(0,S):""},m=function(j){return j.slice(-1)!=="/"&&(j+="/"),j},y=function(j,S){return S=S!==void 0?S:d.createFolders,j=m(j),this.files[j]||o.call(this,j,null,{dir:!0,createFolders:S}),this.files[j]};function x(j){return Object.prototype.toString.call(j)==="[object RegExp]"}var w={load:function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},forEach:function(j){var S,C,N;for(S in this.files)N=this.files[S],(C=S.slice(this.root.length,S.length))&&S.slice(0,this.root.length)===this.root&&j(C,N)},filter:function(j){var S=[];return this.forEach(function(C,N){j(C,N)&&S.push(N)}),S},file:function(j,S,C){if(arguments.length!==1)return j=this.root+j,o.call(this,j,S,C),this;if(x(j)){var N=j;return this.filter(function(A,U){return!U.dir&&N.test(A)})}var E=this.files[this.root+j];return E&&!E.dir?E:null},folder:function(j){if(!j)return this;if(x(j))return this.filter(function(E,A){return A.dir&&j.test(E)});var S=this.root+j,C=y.call(this,S),N=this.clone();return N.root=C.name,N},remove:function(j){j=this.root+j;var S=this.files[j];if(S||(j.slice(-1)!=="/"&&(j+="/"),S=this.files[j]),S&&!S.dir)delete this.files[j];else for(var C=this.filter(function(E,A){return A.name.slice(0,j.length)===j}),N=0;N<C.length;N++)delete this.files[C[N].name];return this},generate:function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},generateInternalStream:function(j){var S,C={};try{if((C=a.extend(j||{},{streamFiles:!1,compression:"STORE",compressionOptions:null,type:"",platform:"DOS",comment:null,mimeType:"application/zip",encodeFileName:s.utf8encode})).type=C.type.toLowerCase(),C.compression=C.compression.toUpperCase(),C.type==="binarystring"&&(C.type="string"),!C.type)throw new Error("No output type specified.");a.checkSupport(C.type),C.platform!=="darwin"&&C.platform!=="freebsd"&&C.platform!=="linux"&&C.platform!=="sunos"||(C.platform="UNIX"),C.platform==="win32"&&(C.platform="DOS");var N=C.comment||this.comment||"";S=p.generateWorker(this,C,N)}catch(E){(S=new l("error")).error(E)}return new u(S,C.type||"string",C.mimeType)},generateAsync:function(j,S){return this.generateInternalStream(j).accumulate(S)},generateNodeStream:function(j,S){return(j=j||{}).type||(j.type="nodebuffer"),this.generateInternalStream(j).toNodejsStream(S)}};n.exports=w},{"./compressedObject":2,"./defaults":5,"./generate":9,"./nodejs/NodejsStreamInputAdapter":12,"./nodejsUtils":14,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31,"./utils":32,"./zipObject":35}],16:[function(r,n,i){n.exports=r("stream")},{stream:void 0}],17:[function(r,n,i){var o=r("./DataReader");function s(a){o.call(this,a);for(var l=0;l<this.data.length;l++)a[l]=255&a[l]}r("../utils").inherits(s,o),s.prototype.byteAt=function(a){return this.data[this.zero+a]},s.prototype.lastIndexOfSignature=function(a){for(var l=a.charCodeAt(0),u=a.charCodeAt(1),d=a.charCodeAt(2),h=a.charCodeAt(3),f=this.length-4;0<=f;--f)if(this.data[f]===l&&this.data[f+1]===u&&this.data[f+2]===d&&this.data[f+3]===h)return f-this.zero;return-1},s.prototype.readAndCheckSignature=function(a){var l=a.charCodeAt(0),u=a.charCodeAt(1),d=a.charCodeAt(2),h=a.charCodeAt(3),f=this.readData(4);return l===f[0]&&u===f[1]&&d===f[2]&&h===f[3]},s.prototype.readData=function(a){if(this.checkOffset(a),a===0)return[];var l=this.data.slice(this.zero+this.index,this.zero+this.index+a);return this.index+=a,l},n.exports=s},{"../utils":32,"./DataReader":18}],18:[function(r,n,i){var o=r("../utils");function s(a){this.data=a,this.length=a.length,this.index=0,this.zero=0}s.prototype={checkOffset:function(a){this.checkIndex(this.index+a)},checkIndex:function(a){if(this.length<this.zero+a||a<0)throw new Error("End of data reached (data length = "+this.length+", asked index = "+a+"). Corrupted zip ?")},setIndex:function(a){this.checkIndex(a),this.index=a},skip:function(a){this.setIndex(this.index+a)},byteAt:function(){},readInt:function(a){var l,u=0;for(this.checkOffset(a),l=this.index+a-1;l>=this.index;l--)u=(u<<8)+this.byteAt(l);return this.index+=a,u},readString:function(a){return o.transformTo("string",this.readData(a))},readData:function(){},lastIndexOfSignature:function(){},readAndCheckSignature:function(){},readDate:function(){var a=this.readInt(4);return new Date(Date.UTC(1980+(a>>25&127),(a>>21&15)-1,a>>16&31,a>>11&31,a>>5&63,(31&a)<<1))}},n.exports=s},{"../utils":32}],19:[function(r,n,i){var o=r("./Uint8ArrayReader");function s(a){o.call(this,a)}r("../utils").inherits(s,o),s.prototype.readData=function(a){this.checkOffset(a);var l=this.data.slice(this.zero+this.index,this.zero+this.index+a);return this.index+=a,l},n.exports=s},{"../utils":32,"./Uint8ArrayReader":21}],20:[function(r,n,i){var o=r("./DataReader");function s(a){o.call(this,a)}r("../utils").inherits(s,o),s.prototype.byteAt=function(a){return this.data.charCodeAt(this.zero+a)},s.prototype.lastIndexOfSignature=function(a){return this.data.lastIndexOf(a)-this.zero},s.prototype.readAndCheckSignature=function(a){return a===this.readData(4)},s.prototype.readData=function(a){this.checkOffset(a);var l=this.data.slice(this.zero+this.index,this.zero+this.index+a);return this.index+=a,l},n.exports=s},{"../utils":32,"./DataReader":18}],21:[function(r,n,i){var o=r("./ArrayReader");function s(a){o.call(this,a)}r("../utils").inherits(s,o),s.prototype.readData=function(a){if(this.checkOffset(a),a===0)return new Uint8Array(0);var l=this.data.subarray(this.zero+this.index,this.zero+this.index+a);return this.index+=a,l},n.exports=s},{"../utils":32,"./ArrayReader":17}],22:[function(r,n,i){var o=r("../utils"),s=r("../support"),a=r("./ArrayReader"),l=r("./StringReader"),u=r("./NodeBufferReader"),d=r("./Uint8ArrayReader");n.exports=function(h){var f=o.getTypeOf(h);return o.checkSupport(f),f!=="string"||s.uint8array?f==="nodebuffer"?new u(h):s.uint8array?new d(o.transformTo("uint8array",h)):new a(o.transformTo("array",h)):new l(h)}},{"../support":30,"../utils":32,"./ArrayReader":17,"./NodeBufferReader":19,"./StringReader":20,"./Uint8ArrayReader":21}],23:[function(r,n,i){i.LOCAL_FILE_HEADER="PK",i.CENTRAL_FILE_HEADER="PK",i.CENTRAL_DIRECTORY_END="PK",i.ZIP64_CENTRAL_DIRECTORY_LOCATOR="PK\x07",i.ZIP64_CENTRAL_DIRECTORY_END="PK",i.DATA_DESCRIPTOR="PK\x07\b"},{}],24:[function(r,n,i){var o=r("./GenericWorker"),s=r("../utils");function a(l){o.call(this,"ConvertWorker to "+l),this.destType=l}s.inherits(a,o),a.prototype.processChunk=function(l){this.push({data:s.transformTo(this.destType,l.data),meta:l.meta})},n.exports=a},{"../utils":32,"./GenericWorker":28}],25:[function(r,n,i){var o=r("./GenericWorker"),s=r("../crc32");function a(){o.call(this,"Crc32Probe"),this.withStreamInfo("crc32",0)}r("../utils").inherits(a,o),a.prototype.processChunk=function(l){this.streamInfo.crc32=s(l.data,this.streamInfo.crc32||0),this.push(l)},n.exports=a},{"../crc32":4,"../utils":32,"./GenericWorker":28}],26:[function(r,n,i){var o=r("../utils"),s=r("./GenericWorker");function a(l){s.call(this,"DataLengthProbe for "+l),this.propName=l,this.withStreamInfo(l,0)}o.inherits(a,s),a.prototype.processChunk=function(l){if(l){var u=this.streamInfo[this.propName]||0;this.streamInfo[this.propName]=u+l.data.length}s.prototype.processChunk.call(this,l)},n.exports=a},{"../utils":32,"./GenericWorker":28}],27:[function(r,n,i){var o=r("../utils"),s=r("./GenericWorker");function a(l){s.call(this,"DataWorker");var u=this;this.dataIsReady=!1,this.index=0,this.max=0,this.data=null,this.type="",this._tickScheduled=!1,l.then(function(d){u.dataIsReady=!0,u.data=d,u.max=d&&d.length||0,u.type=o.getTypeOf(d),u.isPaused||u._tickAndRepeat()},function(d){u.error(d)})}o.inherits(a,s),a.prototype.cleanUp=function(){s.prototype.cleanUp.call(this),this.data=null},a.prototype.resume=function(){return!!s.prototype.resume.call(this)&&(!this._tickScheduled&&this.dataIsReady&&(this._tickScheduled=!0,o.delay(this._tickAndRepeat,[],this)),!0)},a.prototype._tickAndRepeat=function(){this._tickScheduled=!1,this.isPaused||this.isFinished||(this._tick(),this.isFinished||(o.delay(this._tickAndRepeat,[],this),this._tickScheduled=!0))},a.prototype._tick=function(){if(this.isPaused||this.isFinished)return!1;var l=null,u=Math.min(this.max,this.index+16384);if(this.index>=this.max)return this.end();switch(this.type){case"string":l=this.data.substring(this.index,u);break;case"uint8array":l=this.data.subarray(this.index,u);break;case"array":case"nodebuffer":l=this.data.slice(this.index,u)}return this.index=u,this.push({data:l,meta:{percent:this.max?this.index/this.max*100:0}})},n.exports=a},{"../utils":32,"./GenericWorker":28}],28:[function(r,n,i){function o(s){this.name=s||"default",this.streamInfo={},this.generatedError=null,this.extraStreamInfo={},this.isPaused=!0,this.isFinished=!1,this.isLocked=!1,this._listeners={data:[],end:[],error:[]},this.previous=null}o.prototype={push:function(s){this.emit("data",s)},end:function(){if(this.isFinished)return!1;this.flush();try{this.emit("end"),this.cleanUp(),this.isFinished=!0}catch(s){this.emit("error",s)}return!0},error:function(s){return!this.isFinished&&(this.isPaused?this.generatedError=s:(this.isFinished=!0,this.emit("error",s),this.previous&&this.previous.error(s),this.cleanUp()),!0)},on:function(s,a){return this._listeners[s].push(a),this},cleanUp:function(){this.streamInfo=this.generatedError=this.extraStreamInfo=null,this._listeners=[]},emit:function(s,a){if(this._listeners[s])for(var l=0;l<this._listeners[s].length;l++)this._listeners[s][l].call(this,a)},pipe:function(s){return s.registerPrevious(this)},registerPrevious:function(s){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.streamInfo=s.streamInfo,this.mergeStreamInfo(),this.previous=s;var a=this;return s.on("data",function(l){a.processChunk(l)}),s.on("end",function(){a.end()}),s.on("error",function(l){a.error(l)}),this},pause:function(){return!this.isPaused&&!this.isFinished&&(this.isPaused=!0,this.previous&&this.previous.pause(),!0)},resume:function(){if(!this.isPaused||this.isFinished)return!1;var s=this.isPaused=!1;return this.generatedError&&(this.error(this.generatedError),s=!0),this.previous&&this.previous.resume(),!s},flush:function(){},processChunk:function(s){this.push(s)},withStreamInfo:function(s,a){return this.extraStreamInfo[s]=a,this.mergeStreamInfo(),this},mergeStreamInfo:function(){for(var s in this.extraStreamInfo)Object.prototype.hasOwnProperty.call(this.extraStreamInfo,s)&&(this.streamInfo[s]=this.extraStreamInfo[s])},lock:function(){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.isLocked=!0,this.previous&&this.previous.lock()},toString:function(){var s="Worker "+this.name;return this.previous?this.previous+" -> "+s:s}},n.exports=o},{}],29:[function(r,n,i){var o=r("../utils"),s=r("./ConvertWorker"),a=r("./GenericWorker"),l=r("../base64"),u=r("../support"),d=r("../external"),h=null;if(u.nodestream)try{h=r("../nodejs/NodejsStreamOutputAdapter")}catch{}function f(v,g){return new d.Promise(function(b,m){var y=[],x=v._internalType,w=v._outputType,j=v._mimeType;v.on("data",function(S,C){y.push(S),g&&g(C)}).on("error",function(S){y=[],m(S)}).on("end",function(){try{var S=function(C,N,E){switch(C){case"blob":return o.newBlob(o.transformTo("arraybuffer",N),E);case"base64":return l.encode(N);default:return o.transformTo(C,N)}}(w,function(C,N){var E,A=0,U=null,O=0;for(E=0;E<N.length;E++)O+=N[E].length;switch(C){case"string":return N.join("");case"array":return Array.prototype.concat.apply([],N);case"uint8array":for(U=new Uint8Array(O),E=0;E<N.length;E++)U.set(N[E],A),A+=N[E].length;return U;case"nodebuffer":return Buffer.concat(N);default:throw new Error("concat : unsupported type '"+C+"'")}}(x,y),j);b(S)}catch(C){m(C)}y=[]}).resume()})}function p(v,g,b){var m=g;switch(g){case"blob":case"arraybuffer":m="uint8array";break;case"base64":m="string"}try{this._internalType=m,this._outputType=g,this._mimeType=b,o.checkSupport(m),this._worker=v.pipe(new s(m)),v.lock()}catch(y){this._worker=new a("error"),this._worker.error(y)}}p.prototype={accumulate:function(v){return f(this,v)},on:function(v,g){var b=this;return v==="data"?this._worker.on(v,function(m){g.call(b,m.data,m.meta)}):this._worker.on(v,function(){o.delay(g,arguments,b)}),this},resume:function(){return o.delay(this._worker.resume,[],this._worker),this},pause:function(){return this._worker.pause(),this},toNodejsStream:function(v){if(o.checkSupport("nodestream"),this._outputType!=="nodebuffer")throw new Error(this._outputType+" is not supported by this method");return new h(this,{objectMode:this._outputType!=="nodebuffer"},v)}},n.exports=p},{"../base64":1,"../external":6,"../nodejs/NodejsStreamOutputAdapter":13,"../support":30,"../utils":32,"./ConvertWorker":24,"./GenericWorker":28}],30:[function(r,n,i){if(i.base64=!0,i.array=!0,i.string=!0,i.arraybuffer=typeof ArrayBuffer<"u"&&typeof Uint8Array<"u",i.nodebuffer=typeof Buffer<"u",i.uint8array=typeof Uint8Array<"u",typeof ArrayBuffer>"u")i.blob=!1;else{var o=new ArrayBuffer(0);try{i.blob=new Blob([o],{type:"application/zip"}).size===0}catch{try{var s=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);s.append(o),i.blob=s.getBlob("application/zip").size===0}catch{i.blob=!1}}}try{i.nodestream=!!r("readable-stream").Readable}catch{i.nodestream=!1}},{"readable-stream":16}],31:[function(r,n,i){for(var o=r("./utils"),s=r("./support"),a=r("./nodejsUtils"),l=r("./stream/GenericWorker"),u=new Array(256),d=0;d<256;d++)u[d]=252<=d?6:248<=d?5:240<=d?4:224<=d?3:192<=d?2:1;u[254]=u[254]=1;function h(){l.call(this,"utf-8 decode"),this.leftOver=null}function f(){l.call(this,"utf-8 encode")}i.utf8encode=function(p){return s.nodebuffer?a.newBufferFrom(p,"utf-8"):function(v){var g,b,m,y,x,w=v.length,j=0;for(y=0;y<w;y++)(64512&(b=v.charCodeAt(y)))==55296&&y+1<w&&(64512&(m=v.charCodeAt(y+1)))==56320&&(b=65536+(b-55296<<10)+(m-56320),y++),j+=b<128?1:b<2048?2:b<65536?3:4;for(g=s.uint8array?new Uint8Array(j):new Array(j),y=x=0;x<j;y++)(64512&(b=v.charCodeAt(y)))==55296&&y+1<w&&(64512&(m=v.charCodeAt(y+1)))==56320&&(b=65536+(b-55296<<10)+(m-56320),y++),b<128?g[x++]=b:(b<2048?g[x++]=192|b>>>6:(b<65536?g[x++]=224|b>>>12:(g[x++]=240|b>>>18,g[x++]=128|b>>>12&63),g[x++]=128|b>>>6&63),g[x++]=128|63&b);return g}(p)},i.utf8decode=function(p){return s.nodebuffer?o.transformTo("nodebuffer",p).toString("utf-8"):function(v){var g,b,m,y,x=v.length,w=new Array(2*x);for(g=b=0;g<x;)if((m=v[g++])<128)w[b++]=m;else if(4<(y=u[m]))w[b++]=65533,g+=y-1;else{for(m&=y===2?31:y===3?15:7;1<y&&g<x;)m=m<<6|63&v[g++],y--;1<y?w[b++]=65533:m<65536?w[b++]=m:(m-=65536,w[b++]=55296|m>>10&1023,w[b++]=56320|1023&m)}return w.length!==b&&(w.subarray?w=w.subarray(0,b):w.length=b),o.applyFromCharCode(w)}(p=o.transformTo(s.uint8array?"uint8array":"array",p))},o.inherits(h,l),h.prototype.processChunk=function(p){var v=o.transformTo(s.uint8array?"uint8array":"array",p.data);if(this.leftOver&&this.leftOver.length){if(s.uint8array){var g=v;(v=new Uint8Array(g.length+this.leftOver.length)).set(this.leftOver,0),v.set(g,this.leftOver.length)}else v=this.leftOver.concat(v);this.leftOver=null}var b=function(y,x){var w;for((x=x||y.length)>y.length&&(x=y.length),w=x-1;0<=w&&(192&y[w])==128;)w--;return w<0||w===0?x:w+u[y[w]]>x?w:x}(v),m=v;b!==v.length&&(s.uint8array?(m=v.subarray(0,b),this.leftOver=v.subarray(b,v.length)):(m=v.slice(0,b),this.leftOver=v.slice(b,v.length))),this.push({data:i.utf8decode(m),meta:p.meta})},h.prototype.flush=function(){this.leftOver&&this.leftOver.length&&(this.push({data:i.utf8decode(this.leftOver),meta:{}}),this.leftOver=null)},i.Utf8DecodeWorker=h,o.inherits(f,l),f.prototype.processChunk=function(p){this.push({data:i.utf8encode(p.data),meta:p.meta})},i.Utf8EncodeWorker=f},{"./nodejsUtils":14,"./stream/GenericWorker":28,"./support":30,"./utils":32}],32:[function(r,n,i){var o=r("./support"),s=r("./base64"),a=r("./nodejsUtils"),l=r("./external");function u(g){return g}function d(g,b){for(var m=0;m<g.length;++m)b[m]=255&g.charCodeAt(m);return b}r("setimmediate"),i.newBlob=function(g,b){i.checkSupport("blob");try{return new Blob([g],{type:b})}catch{try{var m=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);return m.append(g),m.getBlob(b)}catch{throw new Error("Bug : can't construct the Blob.")}}};var h={stringifyByChunk:function(g,b,m){var y=[],x=0,w=g.length;if(w<=m)return String.fromCharCode.apply(null,g);for(;x<w;)b==="array"||b==="nodebuffer"?y.push(String.fromCharCode.apply(null,g.slice(x,Math.min(x+m,w)))):y.push(String.fromCharCode.apply(null,g.subarray(x,Math.min(x+m,w)))),x+=m;return y.join("")},stringifyByChar:function(g){for(var b="",m=0;m<g.length;m++)b+=String.fromCharCode(g[m]);return b},applyCanBeUsed:{uint8array:function(){try{return o.uint8array&&String.fromCharCode.apply(null,new Uint8Array(1)).length===1}catch{return!1}}(),nodebuffer:function(){try{return o.nodebuffer&&String.fromCharCode.apply(null,a.allocBuffer(1)).length===1}catch{return!1}}()}};function f(g){var b=65536,m=i.getTypeOf(g),y=!0;if(m==="uint8array"?y=h.applyCanBeUsed.uint8array:m==="nodebuffer"&&(y=h.applyCanBeUsed.nodebuffer),y)for(;1<b;)try{return h.stringifyByChunk(g,m,b)}catch{b=Math.floor(b/2)}return h.stringifyByChar(g)}function p(g,b){for(var m=0;m<g.length;m++)b[m]=g[m];return b}i.applyFromCharCode=f;var v={};v.string={string:u,array:function(g){return d(g,new Array(g.length))},arraybuffer:function(g){return v.string.uint8array(g).buffer},uint8array:function(g){return d(g,new Uint8Array(g.length))},nodebuffer:function(g){return d(g,a.allocBuffer(g.length))}},v.array={string:f,array:u,arraybuffer:function(g){return new Uint8Array(g).buffer},uint8array:function(g){return new Uint8Array(g)},nodebuffer:function(g){return a.newBufferFrom(g)}},v.arraybuffer={string:function(g){return f(new Uint8Array(g))},array:function(g){return p(new Uint8Array(g),new Array(g.byteLength))},arraybuffer:u,uint8array:function(g){return new Uint8Array(g)},nodebuffer:function(g){return a.newBufferFrom(new Uint8Array(g))}},v.uint8array={string:f,array:function(g){return p(g,new Array(g.length))},arraybuffer:function(g){return g.buffer},uint8array:u,nodebuffer:function(g){return a.newBufferFrom(g)}},v.nodebuffer={string:f,array:function(g){return p(g,new Array(g.length))},arraybuffer:function(g){return v.nodebuffer.uint8array(g).buffer},uint8array:function(g){return p(g,new Uint8Array(g.length))},nodebuffer:u},i.transformTo=function(g,b){if(b=b||"",!g)return b;i.checkSupport(g);var m=i.getTypeOf(b);return v[m][g](b)},i.resolve=function(g){for(var b=g.split("/"),m=[],y=0;y<b.length;y++){var x=b[y];x==="."||x===""&&y!==0&&y!==b.length-1||(x===".."?m.pop():m.push(x))}return m.join("/")},i.getTypeOf=function(g){return typeof g=="string"?"string":Object.prototype.toString.call(g)==="[object Array]"?"array":o.nodebuffer&&a.isBuffer(g)?"nodebuffer":o.uint8array&&g instanceof Uint8Array?"uint8array":o.arraybuffer&&g instanceof ArrayBuffer?"arraybuffer":void 0},i.checkSupport=function(g){if(!o[g.toLowerCase()])throw new Error(g+" is not supported by this platform")},i.MAX_VALUE_16BITS=65535,i.MAX_VALUE_32BITS=-1,i.pretty=function(g){var b,m,y="";for(m=0;m<(g||"").length;m++)y+="\\x"+((b=g.charCodeAt(m))<16?"0":"")+b.toString(16).toUpperCase();return y},i.delay=function(g,b,m){setImmediate(function(){g.apply(m||null,b||[])})},i.inherits=function(g,b){function m(){}m.prototype=b.prototype,g.prototype=new m},i.extend=function(){var g,b,m={};for(g=0;g<arguments.length;g++)for(b in arguments[g])Object.prototype.hasOwnProperty.call(arguments[g],b)&&m[b]===void 0&&(m[b]=arguments[g][b]);return m},i.prepareContent=function(g,b,m,y,x){return l.Promise.resolve(b).then(function(w){return o.blob&&(w instanceof Blob||["[object File]","[object Blob]"].indexOf(Object.prototype.toString.call(w))!==-1)&&typeof FileReader<"u"?new l.Promise(function(j,S){var C=new FileReader;C.onload=function(N){j(N.target.result)},C.onerror=function(N){S(N.target.error)},C.readAsArrayBuffer(w)}):w}).then(function(w){var j=i.getTypeOf(w);return j?(j==="arraybuffer"?w=i.transformTo("uint8array",w):j==="string"&&(x?w=s.decode(w):m&&y!==!0&&(w=function(S){return d(S,o.uint8array?new Uint8Array(S.length):new Array(S.length))}(w))),w):l.Promise.reject(new Error("Can't read the data of '"+g+"'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"))})}},{"./base64":1,"./external":6,"./nodejsUtils":14,"./support":30,setimmediate:54}],33:[function(r,n,i){var o=r("./reader/readerFor"),s=r("./utils"),a=r("./signature"),l=r("./zipEntry"),u=r("./support");function d(h){this.files=[],this.loadOptions=h}d.prototype={checkSignature:function(h){if(!this.reader.readAndCheckSignature(h)){this.reader.index-=4;var f=this.reader.readString(4);throw new Error("Corrupted zip or bug: unexpected signature ("+s.pretty(f)+", expected "+s.pretty(h)+")")}},isSignature:function(h,f){var p=this.reader.index;this.reader.setIndex(h);var v=this.reader.readString(4)===f;return this.reader.setIndex(p),v},readBlockEndOfCentral:function(){this.diskNumber=this.reader.readInt(2),this.diskWithCentralDirStart=this.reader.readInt(2),this.centralDirRecordsOnThisDisk=this.reader.readInt(2),this.centralDirRecords=this.reader.readInt(2),this.centralDirSize=this.reader.readInt(4),this.centralDirOffset=this.reader.readInt(4),this.zipCommentLength=this.reader.readInt(2);var h=this.reader.readData(this.zipCommentLength),f=u.uint8array?"uint8array":"array",p=s.transformTo(f,h);this.zipComment=this.loadOptions.decodeFileName(p)},readBlockZip64EndOfCentral:function(){this.zip64EndOfCentralSize=this.reader.readInt(8),this.reader.skip(4),this.diskNumber=this.reader.readInt(4),this.diskWithCentralDirStart=this.reader.readInt(4),this.centralDirRecordsOnThisDisk=this.reader.readInt(8),this.centralDirRecords=this.reader.readInt(8),this.centralDirSize=this.reader.readInt(8),this.centralDirOffset=this.reader.readInt(8),this.zip64ExtensibleData={};for(var h,f,p,v=this.zip64EndOfCentralSize-44;0<v;)h=this.reader.readInt(2),f=this.reader.readInt(4),p=this.reader.readData(f),this.zip64ExtensibleData[h]={id:h,length:f,value:p}},readBlockZip64EndOfCentralLocator:function(){if(this.diskWithZip64CentralDirStart=this.reader.readInt(4),this.relativeOffsetEndOfZip64CentralDir=this.reader.readInt(8),this.disksCount=this.reader.readInt(4),1<this.disksCount)throw new Error("Multi-volumes zip are not supported")},readLocalFiles:function(){var h,f;for(h=0;h<this.files.length;h++)f=this.files[h],this.reader.setIndex(f.localHeaderOffset),this.checkSignature(a.LOCAL_FILE_HEADER),f.readLocalPart(this.reader),f.handleUTF8(),f.processAttributes()},readCentralDir:function(){var h;for(this.reader.setIndex(this.centralDirOffset);this.reader.readAndCheckSignature(a.CENTRAL_FILE_HEADER);)(h=new l({zip64:this.zip64},this.loadOptions)).readCentralPart(this.reader),this.files.push(h);if(this.centralDirRecords!==this.files.length&&this.centralDirRecords!==0&&this.files.length===0)throw new Error("Corrupted zip or bug: expected "+this.centralDirRecords+" records in central dir, got "+this.files.length)},readEndOfCentral:function(){var h=this.reader.lastIndexOfSignature(a.CENTRAL_DIRECTORY_END);if(h<0)throw this.isSignature(0,a.LOCAL_FILE_HEADER)?new Error("Corrupted zip: can't find end of central directory"):new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");this.reader.setIndex(h);var f=h;if(this.checkSignature(a.CENTRAL_DIRECTORY_END),this.readBlockEndOfCentral(),this.diskNumber===s.MAX_VALUE_16BITS||this.diskWithCentralDirStart===s.MAX_VALUE_16BITS||this.centralDirRecordsOnThisDisk===s.MAX_VALUE_16BITS||this.centralDirRecords===s.MAX_VALUE_16BITS||this.centralDirSize===s.MAX_VALUE_32BITS||this.centralDirOffset===s.MAX_VALUE_32BITS){if(this.zip64=!0,(h=this.reader.lastIndexOfSignature(a.ZIP64_CENTRAL_DIRECTORY_LOCATOR))<0)throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");if(this.reader.setIndex(h),this.checkSignature(a.ZIP64_CENTRAL_DIRECTORY_LOCATOR),this.readBlockZip64EndOfCentralLocator(),!this.isSignature(this.relativeOffsetEndOfZip64CentralDir,a.ZIP64_CENTRAL_DIRECTORY_END)&&(this.relativeOffsetEndOfZip64CentralDir=this.reader.lastIndexOfSignature(a.ZIP64_CENTRAL_DIRECTORY_END),this.relativeOffsetEndOfZip64CentralDir<0))throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir),this.checkSignature(a.ZIP64_CENTRAL_DIRECTORY_END),this.readBlockZip64EndOfCentral()}var p=this.centralDirOffset+this.centralDirSize;this.zip64&&(p+=20,p+=12+this.zip64EndOfCentralSize);var v=f-p;if(0<v)this.isSignature(f,a.CENTRAL_FILE_HEADER)||(this.reader.zero=v);else if(v<0)throw new Error("Corrupted zip: missing "+Math.abs(v)+" bytes.")},prepareReader:function(h){this.reader=o(h)},load:function(h){this.prepareReader(h),this.readEndOfCentral(),this.readCentralDir(),this.readLocalFiles()}},n.exports=d},{"./reader/readerFor":22,"./signature":23,"./support":30,"./utils":32,"./zipEntry":34}],34:[function(r,n,i){var o=r("./reader/readerFor"),s=r("./utils"),a=r("./compressedObject"),l=r("./crc32"),u=r("./utf8"),d=r("./compressions"),h=r("./support");function f(p,v){this.options=p,this.loadOptions=v}f.prototype={isEncrypted:function(){return(1&this.bitFlag)==1},useUTF8:function(){return(2048&this.bitFlag)==2048},readLocalPart:function(p){var v,g;if(p.skip(22),this.fileNameLength=p.readInt(2),g=p.readInt(2),this.fileName=p.readData(this.fileNameLength),p.skip(g),this.compressedSize===-1||this.uncompressedSize===-1)throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");if((v=function(b){for(var m in d)if(Object.prototype.hasOwnProperty.call(d,m)&&d[m].magic===b)return d[m];return null}(this.compressionMethod))===null)throw new Error("Corrupted zip : compression "+s.pretty(this.compressionMethod)+" unknown (inner file : "+s.transformTo("string",this.fileName)+")");this.decompressed=new a(this.compressedSize,this.uncompressedSize,this.crc32,v,p.readData(this.compressedSize))},readCentralPart:function(p){this.versionMadeBy=p.readInt(2),p.skip(2),this.bitFlag=p.readInt(2),this.compressionMethod=p.readString(2),this.date=p.readDate(),this.crc32=p.readInt(4),this.compressedSize=p.readInt(4),this.uncompressedSize=p.readInt(4);var v=p.readInt(2);if(this.extraFieldsLength=p.readInt(2),this.fileCommentLength=p.readInt(2),this.diskNumberStart=p.readInt(2),this.internalFileAttributes=p.readInt(2),this.externalFileAttributes=p.readInt(4),this.localHeaderOffset=p.readInt(4),this.isEncrypted())throw new Error("Encrypted zip are not supported");p.skip(v),this.readExtraFields(p),this.parseZIP64ExtraField(p),this.fileComment=p.readData(this.fileCommentLength)},processAttributes:function(){this.unixPermissions=null,this.dosPermissions=null;var p=this.versionMadeBy>>8;this.dir=!!(16&this.externalFileAttributes),p==0&&(this.dosPermissions=63&this.externalFileAttributes),p==3&&(this.unixPermissions=this.externalFileAttributes>>16&65535),this.dir||this.fileNameStr.slice(-1)!=="/"||(this.dir=!0)},parseZIP64ExtraField:function(){if(this.extraFields[1]){var p=o(this.extraFields[1].value);this.uncompressedSize===s.MAX_VALUE_32BITS&&(this.uncompressedSize=p.readInt(8)),this.compressedSize===s.MAX_VALUE_32BITS&&(this.compressedSize=p.readInt(8)),this.localHeaderOffset===s.MAX_VALUE_32BITS&&(this.localHeaderOffset=p.readInt(8)),this.diskNumberStart===s.MAX_VALUE_32BITS&&(this.diskNumberStart=p.readInt(4))}},readExtraFields:function(p){var v,g,b,m=p.index+this.extraFieldsLength;for(this.extraFields||(this.extraFields={});p.index+4<m;)v=p.readInt(2),g=p.readInt(2),b=p.readData(g),this.extraFields[v]={id:v,length:g,value:b};p.setIndex(m)},handleUTF8:function(){var p=h.uint8array?"uint8array":"array";if(this.useUTF8())this.fileNameStr=u.utf8decode(this.fileName),this.fileCommentStr=u.utf8decode(this.fileComment);else{var v=this.findExtraFieldUnicodePath();if(v!==null)this.fileNameStr=v;else{var g=s.transformTo(p,this.fileName);this.fileNameStr=this.loadOptions.decodeFileName(g)}var b=this.findExtraFieldUnicodeComment();if(b!==null)this.fileCommentStr=b;else{var m=s.transformTo(p,this.fileComment);this.fileCommentStr=this.loadOptions.decodeFileName(m)}}},findExtraFieldUnicodePath:function(){var p=this.extraFields[28789];if(p){var v=o(p.value);return v.readInt(1)!==1||l(this.fileName)!==v.readInt(4)?null:u.utf8decode(v.readData(p.length-5))}return null},findExtraFieldUnicodeComment:function(){var p=this.extraFields[25461];if(p){var v=o(p.value);return v.readInt(1)!==1||l(this.fileComment)!==v.readInt(4)?null:u.utf8decode(v.readData(p.length-5))}return null}},n.exports=f},{"./compressedObject":2,"./compressions":3,"./crc32":4,"./reader/readerFor":22,"./support":30,"./utf8":31,"./utils":32}],35:[function(r,n,i){function o(v,g,b){this.name=v,this.dir=b.dir,this.date=b.date,this.comment=b.comment,this.unixPermissions=b.unixPermissions,this.dosPermissions=b.dosPermissions,this._data=g,this._dataBinary=b.binary,this.options={compression:b.compression,compressionOptions:b.compressionOptions}}var s=r("./stream/StreamHelper"),a=r("./stream/DataWorker"),l=r("./utf8"),u=r("./compressedObject"),d=r("./stream/GenericWorker");o.prototype={internalStream:function(v){var g=null,b="string";try{if(!v)throw new Error("No output type specified.");var m=(b=v.toLowerCase())==="string"||b==="text";b!=="binarystring"&&b!=="text"||(b="string"),g=this._decompressWorker();var y=!this._dataBinary;y&&!m&&(g=g.pipe(new l.Utf8EncodeWorker)),!y&&m&&(g=g.pipe(new l.Utf8DecodeWorker))}catch(x){(g=new d("error")).error(x)}return new s(g,b,"")},async:function(v,g){return this.internalStream(v).accumulate(g)},nodeStream:function(v,g){return this.internalStream(v||"nodebuffer").toNodejsStream(g)},_compressWorker:function(v,g){if(this._data instanceof u&&this._data.compression.magic===v.magic)return this._data.getCompressedWorker();var b=this._decompressWorker();return this._dataBinary||(b=b.pipe(new l.Utf8EncodeWorker)),u.createWorkerFrom(b,v,g)},_decompressWorker:function(){return this._data instanceof u?this._data.getContentWorker():this._data instanceof d?this._data:new a(this._data)}};for(var h=["asText","asBinary","asNodeBuffer","asUint8Array","asArrayBuffer"],f=function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},p=0;p<h.length;p++)o.prototype[h[p]]=f;n.exports=o},{"./compressedObject":2,"./stream/DataWorker":27,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31}],36:[function(r,n,i){(function(o){var s,a,l=o.MutationObserver||o.WebKitMutationObserver;if(l){var u=0,d=new l(v),h=o.document.createTextNode("");d.observe(h,{characterData:!0}),s=function(){h.data=u=++u%2}}else if(o.setImmediate||o.MessageChannel===void 0)s="document"in o&&"onreadystatechange"in o.document.createElement("script")?function(){var g=o.document.createElement("script");g.onreadystatechange=function(){v(),g.onreadystatechange=null,g.parentNode.removeChild(g),g=null},o.document.documentElement.appendChild(g)}:function(){setTimeout(v,0)};else{var f=new o.MessageChannel;f.port1.onmessage=v,s=function(){f.port2.postMessage(0)}}var p=[];function v(){var g,b;a=!0;for(var m=p.length;m;){for(b=p,p=[],g=-1;++g<m;)b[g]();m=p.length}a=!1}n.exports=function(g){p.push(g)!==1||a||s()}}).call(this,typeof Bn<"u"?Bn:typeof self<"u"?self:typeof window<"u"?window:{})},{}],37:[function(r,n,i){var o=r("immediate");function s(){}var a={},l=["REJECTED"],u=["FULFILLED"],d=["PENDING"];function h(m){if(typeof m!="function")throw new TypeError("resolver must be a function");this.state=d,this.queue=[],this.outcome=void 0,m!==s&&g(this,m)}function f(m,y,x){this.promise=m,typeof y=="function"&&(this.onFulfilled=y,this.callFulfilled=this.otherCallFulfilled),typeof x=="function"&&(this.onRejected=x,this.callRejected=this.otherCallRejected)}function p(m,y,x){o(function(){var w;try{w=y(x)}catch(j){return a.reject(m,j)}w===m?a.reject(m,new TypeError("Cannot resolve promise with itself")):a.resolve(m,w)})}function v(m){var y=m&&m.then;if(m&&(typeof m=="object"||typeof m=="function")&&typeof y=="function")return function(){y.apply(m,arguments)}}function g(m,y){var x=!1;function w(C){x||(x=!0,a.reject(m,C))}function j(C){x||(x=!0,a.resolve(m,C))}var S=b(function(){y(j,w)});S.status==="error"&&w(S.value)}function b(m,y){var x={};try{x.value=m(y),x.status="success"}catch(w){x.status="error",x.value=w}return x}(n.exports=h).prototype.finally=function(m){if(typeof m!="function")return this;var y=this.constructor;return this.then(function(x){return y.resolve(m()).then(function(){return x})},function(x){return y.resolve(m()).then(function(){throw x})})},h.prototype.catch=function(m){return this.then(null,m)},h.prototype.then=function(m,y){if(typeof m!="function"&&this.state===u||typeof y!="function"&&this.state===l)return this;var x=new this.constructor(s);return this.state!==d?p(x,this.state===u?m:y,this.outcome):this.queue.push(new f(x,m,y)),x},f.prototype.callFulfilled=function(m){a.resolve(this.promise,m)},f.prototype.otherCallFulfilled=function(m){p(this.promise,this.onFulfilled,m)},f.prototype.callRejected=function(m){a.reject(this.promise,m)},f.prototype.otherCallRejected=function(m){p(this.promise,this.onRejected,m)},a.resolve=function(m,y){var x=b(v,y);if(x.status==="error")return a.reject(m,x.value);var w=x.value;if(w)g(m,w);else{m.state=u,m.outcome=y;for(var j=-1,S=m.queue.length;++j<S;)m.queue[j].callFulfilled(y)}return m},a.reject=function(m,y){m.state=l,m.outcome=y;for(var x=-1,w=m.queue.length;++x<w;)m.queue[x].callRejected(y);return m},h.resolve=function(m){return m instanceof this?m:a.resolve(new this(s),m)},h.reject=function(m){var y=new this(s);return a.reject(y,m)},h.all=function(m){var y=this;if(Object.prototype.toString.call(m)!=="[object Array]")return this.reject(new TypeError("must be an array"));var x=m.length,w=!1;if(!x)return this.resolve([]);for(var j=new Array(x),S=0,C=-1,N=new this(s);++C<x;)E(m[C],C);return N;function E(A,U){y.resolve(A).then(function(O){j[U]=O,++S!==x||w||(w=!0,a.resolve(N,j))},function(O){w||(w=!0,a.reject(N,O))})}},h.race=function(m){var y=this;if(Object.prototype.toString.call(m)!=="[object Array]")return this.reject(new TypeError("must be an array"));var x=m.length,w=!1;if(!x)return this.resolve([]);for(var j=-1,S=new this(s);++j<x;)C=m[j],y.resolve(C).then(function(N){w||(w=!0,a.resolve(S,N))},function(N){w||(w=!0,a.reject(S,N))});var C;return S}},{immediate:36}],38:[function(r,n,i){var o={};(0,r("./lib/utils/common").assign)(o,r("./lib/deflate"),r("./lib/inflate"),r("./lib/zlib/constants")),n.exports=o},{"./lib/deflate":39,"./lib/inflate":40,"./lib/utils/common":41,"./lib/zlib/constants":44}],39:[function(r,n,i){var o=r("./zlib/deflate"),s=r("./utils/common"),a=r("./utils/strings"),l=r("./zlib/messages"),u=r("./zlib/zstream"),d=Object.prototype.toString,h=0,f=-1,p=0,v=8;function g(m){if(!(this instanceof g))return new g(m);this.options=s.assign({level:f,method:v,chunkSize:16384,windowBits:15,memLevel:8,strategy:p,to:""},m||{});var y=this.options;y.raw&&0<y.windowBits?y.windowBits=-y.windowBits:y.gzip&&0<y.windowBits&&y.windowBits<16&&(y.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new u,this.strm.avail_out=0;var x=o.deflateInit2(this.strm,y.level,y.method,y.windowBits,y.memLevel,y.strategy);if(x!==h)throw new Error(l[x]);if(y.header&&o.deflateSetHeader(this.strm,y.header),y.dictionary){var w;if(w=typeof y.dictionary=="string"?a.string2buf(y.dictionary):d.call(y.dictionary)==="[object ArrayBuffer]"?new Uint8Array(y.dictionary):y.dictionary,(x=o.deflateSetDictionary(this.strm,w))!==h)throw new Error(l[x]);this._dict_set=!0}}function b(m,y){var x=new g(y);if(x.push(m,!0),x.err)throw x.msg||l[x.err];return x.result}g.prototype.push=function(m,y){var x,w,j=this.strm,S=this.options.chunkSize;if(this.ended)return!1;w=y===~~y?y:y===!0?4:0,typeof m=="string"?j.input=a.string2buf(m):d.call(m)==="[object ArrayBuffer]"?j.input=new Uint8Array(m):j.input=m,j.next_in=0,j.avail_in=j.input.length;do{if(j.avail_out===0&&(j.output=new s.Buf8(S),j.next_out=0,j.avail_out=S),(x=o.deflate(j,w))!==1&&x!==h)return this.onEnd(x),!(this.ended=!0);j.avail_out!==0&&(j.avail_in!==0||w!==4&&w!==2)||(this.options.to==="string"?this.onData(a.buf2binstring(s.shrinkBuf(j.output,j.next_out))):this.onData(s.shrinkBuf(j.output,j.next_out)))}while((0<j.avail_in||j.avail_out===0)&&x!==1);return w===4?(x=o.deflateEnd(this.strm),this.onEnd(x),this.ended=!0,x===h):w!==2||(this.onEnd(h),!(j.avail_out=0))},g.prototype.onData=function(m){this.chunks.push(m)},g.prototype.onEnd=function(m){m===h&&(this.options.to==="string"?this.result=this.chunks.join(""):this.result=s.flattenChunks(this.chunks)),this.chunks=[],this.err=m,this.msg=this.strm.msg},i.Deflate=g,i.deflate=b,i.deflateRaw=function(m,y){return(y=y||{}).raw=!0,b(m,y)},i.gzip=function(m,y){return(y=y||{}).gzip=!0,b(m,y)}},{"./utils/common":41,"./utils/strings":42,"./zlib/deflate":46,"./zlib/messages":51,"./zlib/zstream":53}],40:[function(r,n,i){var o=r("./zlib/inflate"),s=r("./utils/common"),a=r("./utils/strings"),l=r("./zlib/constants"),u=r("./zlib/messages"),d=r("./zlib/zstream"),h=r("./zlib/gzheader"),f=Object.prototype.toString;function p(g){if(!(this instanceof p))return new p(g);this.options=s.assign({chunkSize:16384,windowBits:0,to:""},g||{});var b=this.options;b.raw&&0<=b.windowBits&&b.windowBits<16&&(b.windowBits=-b.windowBits,b.windowBits===0&&(b.windowBits=-15)),!(0<=b.windowBits&&b.windowBits<16)||g&&g.windowBits||(b.windowBits+=32),15<b.windowBits&&b.windowBits<48&&!(15&b.windowBits)&&(b.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new d,this.strm.avail_out=0;var m=o.inflateInit2(this.strm,b.windowBits);if(m!==l.Z_OK)throw new Error(u[m]);this.header=new h,o.inflateGetHeader(this.strm,this.header)}function v(g,b){var m=new p(b);if(m.push(g,!0),m.err)throw m.msg||u[m.err];return m.result}p.prototype.push=function(g,b){var m,y,x,w,j,S,C=this.strm,N=this.options.chunkSize,E=this.options.dictionary,A=!1;if(this.ended)return!1;y=b===~~b?b:b===!0?l.Z_FINISH:l.Z_NO_FLUSH,typeof g=="string"?C.input=a.binstring2buf(g):f.call(g)==="[object ArrayBuffer]"?C.input=new Uint8Array(g):C.input=g,C.next_in=0,C.avail_in=C.input.length;do{if(C.avail_out===0&&(C.output=new s.Buf8(N),C.next_out=0,C.avail_out=N),(m=o.inflate(C,l.Z_NO_FLUSH))===l.Z_NEED_DICT&&E&&(S=typeof E=="string"?a.string2buf(E):f.call(E)==="[object ArrayBuffer]"?new Uint8Array(E):E,m=o.inflateSetDictionary(this.strm,S)),m===l.Z_BUF_ERROR&&A===!0&&(m=l.Z_OK,A=!1),m!==l.Z_STREAM_END&&m!==l.Z_OK)return this.onEnd(m),!(this.ended=!0);C.next_out&&(C.avail_out!==0&&m!==l.Z_STREAM_END&&(C.avail_in!==0||y!==l.Z_FINISH&&y!==l.Z_SYNC_FLUSH)||(this.options.to==="string"?(x=a.utf8border(C.output,C.next_out),w=C.next_out-x,j=a.buf2string(C.output,x),C.next_out=w,C.avail_out=N-w,w&&s.arraySet(C.output,C.output,x,w,0),this.onData(j)):this.onData(s.shrinkBuf(C.output,C.next_out)))),C.avail_in===0&&C.avail_out===0&&(A=!0)}while((0<C.avail_in||C.avail_out===0)&&m!==l.Z_STREAM_END);return m===l.Z_STREAM_END&&(y=l.Z_FINISH),y===l.Z_FINISH?(m=o.inflateEnd(this.strm),this.onEnd(m),this.ended=!0,m===l.Z_OK):y!==l.Z_SYNC_FLUSH||(this.onEnd(l.Z_OK),!(C.avail_out=0))},p.prototype.onData=function(g){this.chunks.push(g)},p.prototype.onEnd=function(g){g===l.Z_OK&&(this.options.to==="string"?this.result=this.chunks.join(""):this.result=s.flattenChunks(this.chunks)),this.chunks=[],this.err=g,this.msg=this.strm.msg},i.Inflate=p,i.inflate=v,i.inflateRaw=function(g,b){return(b=b||{}).raw=!0,v(g,b)},i.ungzip=v},{"./utils/common":41,"./utils/strings":42,"./zlib/constants":44,"./zlib/gzheader":47,"./zlib/inflate":49,"./zlib/messages":51,"./zlib/zstream":53}],41:[function(r,n,i){var o=typeof Uint8Array<"u"&&typeof Uint16Array<"u"&&typeof Int32Array<"u";i.assign=function(l){for(var u=Array.prototype.slice.call(arguments,1);u.length;){var d=u.shift();if(d){if(typeof d!="object")throw new TypeError(d+"must be non-object");for(var h in d)d.hasOwnProperty(h)&&(l[h]=d[h])}}return l},i.shrinkBuf=function(l,u){return l.length===u?l:l.subarray?l.subarray(0,u):(l.length=u,l)};var s={arraySet:function(l,u,d,h,f){if(u.subarray&&l.subarray)l.set(u.subarray(d,d+h),f);else for(var p=0;p<h;p++)l[f+p]=u[d+p]},flattenChunks:function(l){var u,d,h,f,p,v;for(u=h=0,d=l.length;u<d;u++)h+=l[u].length;for(v=new Uint8Array(h),u=f=0,d=l.length;u<d;u++)p=l[u],v.set(p,f),f+=p.length;return v}},a={arraySet:function(l,u,d,h,f){for(var p=0;p<h;p++)l[f+p]=u[d+p]},flattenChunks:function(l){return[].concat.apply([],l)}};i.setTyped=function(l){l?(i.Buf8=Uint8Array,i.Buf16=Uint16Array,i.Buf32=Int32Array,i.assign(i,s)):(i.Buf8=Array,i.Buf16=Array,i.Buf32=Array,i.assign(i,a))},i.setTyped(o)},{}],42:[function(r,n,i){var o=r("./common"),s=!0,a=!0;try{String.fromCharCode.apply(null,[0])}catch{s=!1}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch{a=!1}for(var l=new o.Buf8(256),u=0;u<256;u++)l[u]=252<=u?6:248<=u?5:240<=u?4:224<=u?3:192<=u?2:1;function d(h,f){if(f<65537&&(h.subarray&&a||!h.subarray&&s))return String.fromCharCode.apply(null,o.shrinkBuf(h,f));for(var p="",v=0;v<f;v++)p+=String.fromCharCode(h[v]);return p}l[254]=l[254]=1,i.string2buf=function(h){var f,p,v,g,b,m=h.length,y=0;for(g=0;g<m;g++)(64512&(p=h.charCodeAt(g)))==55296&&g+1<m&&(64512&(v=h.charCodeAt(g+1)))==56320&&(p=65536+(p-55296<<10)+(v-56320),g++),y+=p<128?1:p<2048?2:p<65536?3:4;for(f=new o.Buf8(y),g=b=0;b<y;g++)(64512&(p=h.charCodeAt(g)))==55296&&g+1<m&&(64512&(v=h.charCodeAt(g+1)))==56320&&(p=65536+(p-55296<<10)+(v-56320),g++),p<128?f[b++]=p:(p<2048?f[b++]=192|p>>>6:(p<65536?f[b++]=224|p>>>12:(f[b++]=240|p>>>18,f[b++]=128|p>>>12&63),f[b++]=128|p>>>6&63),f[b++]=128|63&p);return f},i.buf2binstring=function(h){return d(h,h.length)},i.binstring2buf=function(h){for(var f=new o.Buf8(h.length),p=0,v=f.length;p<v;p++)f[p]=h.charCodeAt(p);return f},i.buf2string=function(h,f){var p,v,g,b,m=f||h.length,y=new Array(2*m);for(p=v=0;p<m;)if((g=h[p++])<128)y[v++]=g;else if(4<(b=l[g]))y[v++]=65533,p+=b-1;else{for(g&=b===2?31:b===3?15:7;1<b&&p<m;)g=g<<6|63&h[p++],b--;1<b?y[v++]=65533:g<65536?y[v++]=g:(g-=65536,y[v++]=55296|g>>10&1023,y[v++]=56320|1023&g)}return d(y,v)},i.utf8border=function(h,f){var p;for((f=f||h.length)>h.length&&(f=h.length),p=f-1;0<=p&&(192&h[p])==128;)p--;return p<0||p===0?f:p+l[h[p]]>f?p:f}},{"./common":41}],43:[function(r,n,i){n.exports=function(o,s,a,l){for(var u=65535&o|0,d=o>>>16&65535|0,h=0;a!==0;){for(a-=h=2e3<a?2e3:a;d=d+(u=u+s[l++]|0)|0,--h;);u%=65521,d%=65521}return u|d<<16|0}},{}],44:[function(r,n,i){n.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}},{}],45:[function(r,n,i){var o=function(){for(var s,a=[],l=0;l<256;l++){s=l;for(var u=0;u<8;u++)s=1&s?3988292384^s>>>1:s>>>1;a[l]=s}return a}();n.exports=function(s,a,l,u){var d=o,h=u+l;s^=-1;for(var f=u;f<h;f++)s=s>>>8^d[255&(s^a[f])];return-1^s}},{}],46:[function(r,n,i){var o,s=r("../utils/common"),a=r("./trees"),l=r("./adler32"),u=r("./crc32"),d=r("./messages"),h=0,f=4,p=0,v=-2,g=-1,b=4,m=2,y=8,x=9,w=286,j=30,S=19,C=2*w+1,N=15,E=3,A=258,U=A+E+1,O=42,F=113,k=1,W=2,ie=3,J=4;function K(_,ee){return _.msg=d[ee],ee}function L(_){return(_<<1)-(4<_?9:0)}function oe(_){for(var ee=_.length;0<=--ee;)_[ee]=0}function H(_){var ee=_.state,B=ee.pending;B>_.avail_out&&(B=_.avail_out),B!==0&&(s.arraySet(_.output,ee.pending_buf,ee.pending_out,B,_.next_out),_.next_out+=B,ee.pending_out+=B,_.total_out+=B,_.avail_out-=B,ee.pending-=B,ee.pending===0&&(ee.pending_out=0))}function G(_,ee){a._tr_flush_block(_,0<=_.block_start?_.block_start:-1,_.strstart-_.block_start,ee),_.block_start=_.strstart,H(_.strm)}function pe(_,ee){_.pending_buf[_.pending++]=ee}function Q(_,ee){_.pending_buf[_.pending++]=ee>>>8&255,_.pending_buf[_.pending++]=255&ee}function ae(_,ee){var B,R,T=_.max_chain_length,I=_.strstart,X=_.prev_length,te=_.nice_match,D=_.strstart>_.w_size-U?_.strstart-(_.w_size-U):0,q=_.window,ne=_.w_mask,Y=_.prev,M=_.strstart+A,Z=q[I+X-1],re=q[I+X];_.prev_length>=_.good_match&&(T>>=2),te>_.lookahead&&(te=_.lookahead);do if(q[(B=ee)+X]===re&&q[B+X-1]===Z&&q[B]===q[I]&&q[++B]===q[I+1]){I+=2,B++;do;while(q[++I]===q[++B]&&q[++I]===q[++B]&&q[++I]===q[++B]&&q[++I]===q[++B]&&q[++I]===q[++B]&&q[++I]===q[++B]&&q[++I]===q[++B]&&q[++I]===q[++B]&&I<M);if(R=A-(M-I),I=M-A,X<R){if(_.match_start=ee,te<=(X=R))break;Z=q[I+X-1],re=q[I+X]}}while((ee=Y[ee&ne])>D&&--T!=0);return X<=_.lookahead?X:_.lookahead}function Re(_){var ee,B,R,T,I,X,te,D,q,ne,Y=_.w_size;do{if(T=_.window_size-_.lookahead-_.strstart,_.strstart>=Y+(Y-U)){for(s.arraySet(_.window,_.window,Y,Y,0),_.match_start-=Y,_.strstart-=Y,_.block_start-=Y,ee=B=_.hash_size;R=_.head[--ee],_.head[ee]=Y<=R?R-Y:0,--B;);for(ee=B=Y;R=_.prev[--ee],_.prev[ee]=Y<=R?R-Y:0,--B;);T+=Y}if(_.strm.avail_in===0)break;if(X=_.strm,te=_.window,D=_.strstart+_.lookahead,q=T,ne=void 0,ne=X.avail_in,q<ne&&(ne=q),B=ne===0?0:(X.avail_in-=ne,s.arraySet(te,X.input,X.next_in,ne,D),X.state.wrap===1?X.adler=l(X.adler,te,ne,D):X.state.wrap===2&&(X.adler=u(X.adler,te,ne,D)),X.next_in+=ne,X.total_in+=ne,ne),_.lookahead+=B,_.lookahead+_.insert>=E)for(I=_.strstart-_.insert,_.ins_h=_.window[I],_.ins_h=(_.ins_h<<_.hash_shift^_.window[I+1])&_.hash_mask;_.insert&&(_.ins_h=(_.ins_h<<_.hash_shift^_.window[I+E-1])&_.hash_mask,_.prev[I&_.w_mask]=_.head[_.ins_h],_.head[_.ins_h]=I,I++,_.insert--,!(_.lookahead+_.insert<E)););}while(_.lookahead<U&&_.strm.avail_in!==0)}function Ke(_,ee){for(var B,R;;){if(_.lookahead<U){if(Re(_),_.lookahead<U&&ee===h)return k;if(_.lookahead===0)break}if(B=0,_.lookahead>=E&&(_.ins_h=(_.ins_h<<_.hash_shift^_.window[_.strstart+E-1])&_.hash_mask,B=_.prev[_.strstart&_.w_mask]=_.head[_.ins_h],_.head[_.ins_h]=_.strstart),B!==0&&_.strstart-B<=_.w_size-U&&(_.match_length=ae(_,B)),_.match_length>=E)if(R=a._tr_tally(_,_.strstart-_.match_start,_.match_length-E),_.lookahead-=_.match_length,_.match_length<=_.max_lazy_match&&_.lookahead>=E){for(_.match_length--;_.strstart++,_.ins_h=(_.ins_h<<_.hash_shift^_.window[_.strstart+E-1])&_.hash_mask,B=_.prev[_.strstart&_.w_mask]=_.head[_.ins_h],_.head[_.ins_h]=_.strstart,--_.match_length!=0;);_.strstart++}else _.strstart+=_.match_length,_.match_length=0,_.ins_h=_.window[_.strstart],_.ins_h=(_.ins_h<<_.hash_shift^_.window[_.strstart+1])&_.hash_mask;else R=a._tr_tally(_,0,_.window[_.strstart]),_.lookahead--,_.strstart++;if(R&&(G(_,!1),_.strm.avail_out===0))return k}return _.insert=_.strstart<E-1?_.strstart:E-1,ee===f?(G(_,!0),_.strm.avail_out===0?ie:J):_.last_lit&&(G(_,!1),_.strm.avail_out===0)?k:W}function ye(_,ee){for(var B,R,T;;){if(_.lookahead<U){if(Re(_),_.lookahead<U&&ee===h)return k;if(_.lookahead===0)break}if(B=0,_.lookahead>=E&&(_.ins_h=(_.ins_h<<_.hash_shift^_.window[_.strstart+E-1])&_.hash_mask,B=_.prev[_.strstart&_.w_mask]=_.head[_.ins_h],_.head[_.ins_h]=_.strstart),_.prev_length=_.match_length,_.prev_match=_.match_start,_.match_length=E-1,B!==0&&_.prev_length<_.max_lazy_match&&_.strstart-B<=_.w_size-U&&(_.match_length=ae(_,B),_.match_length<=5&&(_.strategy===1||_.match_length===E&&4096<_.strstart-_.match_start)&&(_.match_length=E-1)),_.prev_length>=E&&_.match_length<=_.prev_length){for(T=_.strstart+_.lookahead-E,R=a._tr_tally(_,_.strstart-1-_.prev_match,_.prev_length-E),_.lookahead-=_.prev_length-1,_.prev_length-=2;++_.strstart<=T&&(_.ins_h=(_.ins_h<<_.hash_shift^_.window[_.strstart+E-1])&_.hash_mask,B=_.prev[_.strstart&_.w_mask]=_.head[_.ins_h],_.head[_.ins_h]=_.strstart),--_.prev_length!=0;);if(_.match_available=0,_.match_length=E-1,_.strstart++,R&&(G(_,!1),_.strm.avail_out===0))return k}else if(_.match_available){if((R=a._tr_tally(_,0,_.window[_.strstart-1]))&&G(_,!1),_.strstart++,_.lookahead--,_.strm.avail_out===0)return k}else _.match_available=1,_.strstart++,_.lookahead--}return _.match_available&&(R=a._tr_tally(_,0,_.window[_.strstart-1]),_.match_available=0),_.insert=_.strstart<E-1?_.strstart:E-1,ee===f?(G(_,!0),_.strm.avail_out===0?ie:J):_.last_lit&&(G(_,!1),_.strm.avail_out===0)?k:W}function Ne(_,ee,B,R,T){this.good_length=_,this.max_lazy=ee,this.nice_length=B,this.max_chain=R,this.func=T}function He(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=y,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new s.Buf16(2*C),this.dyn_dtree=new s.Buf16(2*(2*j+1)),this.bl_tree=new s.Buf16(2*(2*S+1)),oe(this.dyn_ltree),oe(this.dyn_dtree),oe(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new s.Buf16(N+1),this.heap=new s.Buf16(2*w+1),oe(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new s.Buf16(2*w+1),oe(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}function Ye(_){var ee;return _&&_.state?(_.total_in=_.total_out=0,_.data_type=m,(ee=_.state).pending=0,ee.pending_out=0,ee.wrap<0&&(ee.wrap=-ee.wrap),ee.status=ee.wrap?O:F,_.adler=ee.wrap===2?0:1,ee.last_flush=h,a._tr_init(ee),p):K(_,v)}function bt(_){var ee=Ye(_);return ee===p&&function(B){B.window_size=2*B.w_size,oe(B.head),B.max_lazy_match=o[B.level].max_lazy,B.good_match=o[B.level].good_length,B.nice_match=o[B.level].nice_length,B.max_chain_length=o[B.level].max_chain,B.strstart=0,B.block_start=0,B.lookahead=0,B.insert=0,B.match_length=B.prev_length=E-1,B.match_available=0,B.ins_h=0}(_.state),ee}function et(_,ee,B,R,T,I){if(!_)return v;var X=1;if(ee===g&&(ee=6),R<0?(X=0,R=-R):15<R&&(X=2,R-=16),T<1||x<T||B!==y||R<8||15<R||ee<0||9<ee||I<0||b<I)return K(_,v);R===8&&(R=9);var te=new He;return(_.state=te).strm=_,te.wrap=X,te.gzhead=null,te.w_bits=R,te.w_size=1<<te.w_bits,te.w_mask=te.w_size-1,te.hash_bits=T+7,te.hash_size=1<<te.hash_bits,te.hash_mask=te.hash_size-1,te.hash_shift=~~((te.hash_bits+E-1)/E),te.window=new s.Buf8(2*te.w_size),te.head=new s.Buf16(te.hash_size),te.prev=new s.Buf16(te.w_size),te.lit_bufsize=1<<T+6,te.pending_buf_size=4*te.lit_bufsize,te.pending_buf=new s.Buf8(te.pending_buf_size),te.d_buf=1*te.lit_bufsize,te.l_buf=3*te.lit_bufsize,te.level=ee,te.strategy=I,te.method=B,bt(_)}o=[new Ne(0,0,0,0,function(_,ee){var B=65535;for(B>_.pending_buf_size-5&&(B=_.pending_buf_size-5);;){if(_.lookahead<=1){if(Re(_),_.lookahead===0&&ee===h)return k;if(_.lookahead===0)break}_.strstart+=_.lookahead,_.lookahead=0;var R=_.block_start+B;if((_.strstart===0||_.strstart>=R)&&(_.lookahead=_.strstart-R,_.strstart=R,G(_,!1),_.strm.avail_out===0)||_.strstart-_.block_start>=_.w_size-U&&(G(_,!1),_.strm.avail_out===0))return k}return _.insert=0,ee===f?(G(_,!0),_.strm.avail_out===0?ie:J):(_.strstart>_.block_start&&(G(_,!1),_.strm.avail_out),k)}),new Ne(4,4,8,4,Ke),new Ne(4,5,16,8,Ke),new Ne(4,6,32,32,Ke),new Ne(4,4,16,16,ye),new Ne(8,16,32,32,ye),new Ne(8,16,128,128,ye),new Ne(8,32,128,256,ye),new Ne(32,128,258,1024,ye),new Ne(32,258,258,4096,ye)],i.deflateInit=function(_,ee){return et(_,ee,y,15,8,0)},i.deflateInit2=et,i.deflateReset=bt,i.deflateResetKeep=Ye,i.deflateSetHeader=function(_,ee){return _&&_.state?_.state.wrap!==2?v:(_.state.gzhead=ee,p):v},i.deflate=function(_,ee){var B,R,T,I;if(!_||!_.state||5<ee||ee<0)return _?K(_,v):v;if(R=_.state,!_.output||!_.input&&_.avail_in!==0||R.status===666&&ee!==f)return K(_,_.avail_out===0?-5:v);if(R.strm=_,B=R.last_flush,R.last_flush=ee,R.status===O)if(R.wrap===2)_.adler=0,pe(R,31),pe(R,139),pe(R,8),R.gzhead?(pe(R,(R.gzhead.text?1:0)+(R.gzhead.hcrc?2:0)+(R.gzhead.extra?4:0)+(R.gzhead.name?8:0)+(R.gzhead.comment?16:0)),pe(R,255&R.gzhead.time),pe(R,R.gzhead.time>>8&255),pe(R,R.gzhead.time>>16&255),pe(R,R.gzhead.time>>24&255),pe(R,R.level===9?2:2<=R.strategy||R.level<2?4:0),pe(R,255&R.gzhead.os),R.gzhead.extra&&R.gzhead.extra.length&&(pe(R,255&R.gzhead.extra.length),pe(R,R.gzhead.extra.length>>8&255)),R.gzhead.hcrc&&(_.adler=u(_.adler,R.pending_buf,R.pending,0)),R.gzindex=0,R.status=69):(pe(R,0),pe(R,0),pe(R,0),pe(R,0),pe(R,0),pe(R,R.level===9?2:2<=R.strategy||R.level<2?4:0),pe(R,3),R.status=F);else{var X=y+(R.w_bits-8<<4)<<8;X|=(2<=R.strategy||R.level<2?0:R.level<6?1:R.level===6?2:3)<<6,R.strstart!==0&&(X|=32),X+=31-X%31,R.status=F,Q(R,X),R.strstart!==0&&(Q(R,_.adler>>>16),Q(R,65535&_.adler)),_.adler=1}if(R.status===69)if(R.gzhead.extra){for(T=R.pending;R.gzindex<(65535&R.gzhead.extra.length)&&(R.pending!==R.pending_buf_size||(R.gzhead.hcrc&&R.pending>T&&(_.adler=u(_.adler,R.pending_buf,R.pending-T,T)),H(_),T=R.pending,R.pending!==R.pending_buf_size));)pe(R,255&R.gzhead.extra[R.gzindex]),R.gzindex++;R.gzhead.hcrc&&R.pending>T&&(_.adler=u(_.adler,R.pending_buf,R.pending-T,T)),R.gzindex===R.gzhead.extra.length&&(R.gzindex=0,R.status=73)}else R.status=73;if(R.status===73)if(R.gzhead.name){T=R.pending;do{if(R.pending===R.pending_buf_size&&(R.gzhead.hcrc&&R.pending>T&&(_.adler=u(_.adler,R.pending_buf,R.pending-T,T)),H(_),T=R.pending,R.pending===R.pending_buf_size)){I=1;break}I=R.gzindex<R.gzhead.name.length?255&R.gzhead.name.charCodeAt(R.gzindex++):0,pe(R,I)}while(I!==0);R.gzhead.hcrc&&R.pending>T&&(_.adler=u(_.adler,R.pending_buf,R.pending-T,T)),I===0&&(R.gzindex=0,R.status=91)}else R.status=91;if(R.status===91)if(R.gzhead.comment){T=R.pending;do{if(R.pending===R.pending_buf_size&&(R.gzhead.hcrc&&R.pending>T&&(_.adler=u(_.adler,R.pending_buf,R.pending-T,T)),H(_),T=R.pending,R.pending===R.pending_buf_size)){I=1;break}I=R.gzindex<R.gzhead.comment.length?255&R.gzhead.comment.charCodeAt(R.gzindex++):0,pe(R,I)}while(I!==0);R.gzhead.hcrc&&R.pending>T&&(_.adler=u(_.adler,R.pending_buf,R.pending-T,T)),I===0&&(R.status=103)}else R.status=103;if(R.status===103&&(R.gzhead.hcrc?(R.pending+2>R.pending_buf_size&&H(_),R.pending+2<=R.pending_buf_size&&(pe(R,255&_.adler),pe(R,_.adler>>8&255),_.adler=0,R.status=F)):R.status=F),R.pending!==0){if(H(_),_.avail_out===0)return R.last_flush=-1,p}else if(_.avail_in===0&&L(ee)<=L(B)&&ee!==f)return K(_,-5);if(R.status===666&&_.avail_in!==0)return K(_,-5);if(_.avail_in!==0||R.lookahead!==0||ee!==h&&R.status!==666){var te=R.strategy===2?function(D,q){for(var ne;;){if(D.lookahead===0&&(Re(D),D.lookahead===0)){if(q===h)return k;break}if(D.match_length=0,ne=a._tr_tally(D,0,D.window[D.strstart]),D.lookahead--,D.strstart++,ne&&(G(D,!1),D.strm.avail_out===0))return k}return D.insert=0,q===f?(G(D,!0),D.strm.avail_out===0?ie:J):D.last_lit&&(G(D,!1),D.strm.avail_out===0)?k:W}(R,ee):R.strategy===3?function(D,q){for(var ne,Y,M,Z,re=D.window;;){if(D.lookahead<=A){if(Re(D),D.lookahead<=A&&q===h)return k;if(D.lookahead===0)break}if(D.match_length=0,D.lookahead>=E&&0<D.strstart&&(Y=re[M=D.strstart-1])===re[++M]&&Y===re[++M]&&Y===re[++M]){Z=D.strstart+A;do;while(Y===re[++M]&&Y===re[++M]&&Y===re[++M]&&Y===re[++M]&&Y===re[++M]&&Y===re[++M]&&Y===re[++M]&&Y===re[++M]&&M<Z);D.match_length=A-(Z-M),D.match_length>D.lookahead&&(D.match_length=D.lookahead)}if(D.match_length>=E?(ne=a._tr_tally(D,1,D.match_length-E),D.lookahead-=D.match_length,D.strstart+=D.match_length,D.match_length=0):(ne=a._tr_tally(D,0,D.window[D.strstart]),D.lookahead--,D.strstart++),ne&&(G(D,!1),D.strm.avail_out===0))return k}return D.insert=0,q===f?(G(D,!0),D.strm.avail_out===0?ie:J):D.last_lit&&(G(D,!1),D.strm.avail_out===0)?k:W}(R,ee):o[R.level].func(R,ee);if(te!==ie&&te!==J||(R.status=666),te===k||te===ie)return _.avail_out===0&&(R.last_flush=-1),p;if(te===W&&(ee===1?a._tr_align(R):ee!==5&&(a._tr_stored_block(R,0,0,!1),ee===3&&(oe(R.head),R.lookahead===0&&(R.strstart=0,R.block_start=0,R.insert=0))),H(_),_.avail_out===0))return R.last_flush=-1,p}return ee!==f?p:R.wrap<=0?1:(R.wrap===2?(pe(R,255&_.adler),pe(R,_.adler>>8&255),pe(R,_.adler>>16&255),pe(R,_.adler>>24&255),pe(R,255&_.total_in),pe(R,_.total_in>>8&255),pe(R,_.total_in>>16&255),pe(R,_.total_in>>24&255)):(Q(R,_.adler>>>16),Q(R,65535&_.adler)),H(_),0<R.wrap&&(R.wrap=-R.wrap),R.pending!==0?p:1)},i.deflateEnd=function(_){var ee;return _&&_.state?(ee=_.state.status)!==O&&ee!==69&&ee!==73&&ee!==91&&ee!==103&&ee!==F&&ee!==666?K(_,v):(_.state=null,ee===F?K(_,-3):p):v},i.deflateSetDictionary=function(_,ee){var B,R,T,I,X,te,D,q,ne=ee.length;if(!_||!_.state||(I=(B=_.state).wrap)===2||I===1&&B.status!==O||B.lookahead)return v;for(I===1&&(_.adler=l(_.adler,ee,ne,0)),B.wrap=0,ne>=B.w_size&&(I===0&&(oe(B.head),B.strstart=0,B.block_start=0,B.insert=0),q=new s.Buf8(B.w_size),s.arraySet(q,ee,ne-B.w_size,B.w_size,0),ee=q,ne=B.w_size),X=_.avail_in,te=_.next_in,D=_.input,_.avail_in=ne,_.next_in=0,_.input=ee,Re(B);B.lookahead>=E;){for(R=B.strstart,T=B.lookahead-(E-1);B.ins_h=(B.ins_h<<B.hash_shift^B.window[R+E-1])&B.hash_mask,B.prev[R&B.w_mask]=B.head[B.ins_h],B.head[B.ins_h]=R,R++,--T;);B.strstart=R,B.lookahead=E-1,Re(B)}return B.strstart+=B.lookahead,B.block_start=B.strstart,B.insert=B.lookahead,B.lookahead=0,B.match_length=B.prev_length=E-1,B.match_available=0,_.next_in=te,_.input=D,_.avail_in=X,B.wrap=I,p},i.deflateInfo="pako deflate (from Nodeca project)"},{"../utils/common":41,"./adler32":43,"./crc32":45,"./messages":51,"./trees":52}],47:[function(r,n,i){n.exports=function(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1}},{}],48:[function(r,n,i){n.exports=function(o,s){var a,l,u,d,h,f,p,v,g,b,m,y,x,w,j,S,C,N,E,A,U,O,F,k,W;a=o.state,l=o.next_in,k=o.input,u=l+(o.avail_in-5),d=o.next_out,W=o.output,h=d-(s-o.avail_out),f=d+(o.avail_out-257),p=a.dmax,v=a.wsize,g=a.whave,b=a.wnext,m=a.window,y=a.hold,x=a.bits,w=a.lencode,j=a.distcode,S=(1<<a.lenbits)-1,C=(1<<a.distbits)-1;e:do{x<15&&(y+=k[l++]<<x,x+=8,y+=k[l++]<<x,x+=8),N=w[y&S];t:for(;;){if(y>>>=E=N>>>24,x-=E,(E=N>>>16&255)===0)W[d++]=65535&N;else{if(!(16&E)){if(!(64&E)){N=w[(65535&N)+(y&(1<<E)-1)];continue t}if(32&E){a.mode=12;break e}o.msg="invalid literal/length code",a.mode=30;break e}A=65535&N,(E&=15)&&(x<E&&(y+=k[l++]<<x,x+=8),A+=y&(1<<E)-1,y>>>=E,x-=E),x<15&&(y+=k[l++]<<x,x+=8,y+=k[l++]<<x,x+=8),N=j[y&C];r:for(;;){if(y>>>=E=N>>>24,x-=E,!(16&(E=N>>>16&255))){if(!(64&E)){N=j[(65535&N)+(y&(1<<E)-1)];continue r}o.msg="invalid distance code",a.mode=30;break e}if(U=65535&N,x<(E&=15)&&(y+=k[l++]<<x,(x+=8)<E&&(y+=k[l++]<<x,x+=8)),p<(U+=y&(1<<E)-1)){o.msg="invalid distance too far back",a.mode=30;break e}if(y>>>=E,x-=E,(E=d-h)<U){if(g<(E=U-E)&&a.sane){o.msg="invalid distance too far back",a.mode=30;break e}if(F=m,(O=0)===b){if(O+=v-E,E<A){for(A-=E;W[d++]=m[O++],--E;);O=d-U,F=W}}else if(b<E){if(O+=v+b-E,(E-=b)<A){for(A-=E;W[d++]=m[O++],--E;);if(O=0,b<A){for(A-=E=b;W[d++]=m[O++],--E;);O=d-U,F=W}}}else if(O+=b-E,E<A){for(A-=E;W[d++]=m[O++],--E;);O=d-U,F=W}for(;2<A;)W[d++]=F[O++],W[d++]=F[O++],W[d++]=F[O++],A-=3;A&&(W[d++]=F[O++],1<A&&(W[d++]=F[O++]))}else{for(O=d-U;W[d++]=W[O++],W[d++]=W[O++],W[d++]=W[O++],2<(A-=3););A&&(W[d++]=W[O++],1<A&&(W[d++]=W[O++]))}break}}break}}while(l<u&&d<f);l-=A=x>>3,y&=(1<<(x-=A<<3))-1,o.next_in=l,o.next_out=d,o.avail_in=l<u?u-l+5:5-(l-u),o.avail_out=d<f?f-d+257:257-(d-f),a.hold=y,a.bits=x}},{}],49:[function(r,n,i){var o=r("../utils/common"),s=r("./adler32"),a=r("./crc32"),l=r("./inffast"),u=r("./inftrees"),d=1,h=2,f=0,p=-2,v=1,g=852,b=592;function m(O){return(O>>>24&255)+(O>>>8&65280)+((65280&O)<<8)+((255&O)<<24)}function y(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new o.Buf16(320),this.work=new o.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function x(O){var F;return O&&O.state?(F=O.state,O.total_in=O.total_out=F.total=0,O.msg="",F.wrap&&(O.adler=1&F.wrap),F.mode=v,F.last=0,F.havedict=0,F.dmax=32768,F.head=null,F.hold=0,F.bits=0,F.lencode=F.lendyn=new o.Buf32(g),F.distcode=F.distdyn=new o.Buf32(b),F.sane=1,F.back=-1,f):p}function w(O){var F;return O&&O.state?((F=O.state).wsize=0,F.whave=0,F.wnext=0,x(O)):p}function j(O,F){var k,W;return O&&O.state?(W=O.state,F<0?(k=0,F=-F):(k=1+(F>>4),F<48&&(F&=15)),F&&(F<8||15<F)?p:(W.window!==null&&W.wbits!==F&&(W.window=null),W.wrap=k,W.wbits=F,w(O))):p}function S(O,F){var k,W;return O?(W=new y,(O.state=W).window=null,(k=j(O,F))!==f&&(O.state=null),k):p}var C,N,E=!0;function A(O){if(E){var F;for(C=new o.Buf32(512),N=new o.Buf32(32),F=0;F<144;)O.lens[F++]=8;for(;F<256;)O.lens[F++]=9;for(;F<280;)O.lens[F++]=7;for(;F<288;)O.lens[F++]=8;for(u(d,O.lens,0,288,C,0,O.work,{bits:9}),F=0;F<32;)O.lens[F++]=5;u(h,O.lens,0,32,N,0,O.work,{bits:5}),E=!1}O.lencode=C,O.lenbits=9,O.distcode=N,O.distbits=5}function U(O,F,k,W){var ie,J=O.state;return J.window===null&&(J.wsize=1<<J.wbits,J.wnext=0,J.whave=0,J.window=new o.Buf8(J.wsize)),W>=J.wsize?(o.arraySet(J.window,F,k-J.wsize,J.wsize,0),J.wnext=0,J.whave=J.wsize):(W<(ie=J.wsize-J.wnext)&&(ie=W),o.arraySet(J.window,F,k-W,ie,J.wnext),(W-=ie)?(o.arraySet(J.window,F,k-W,W,0),J.wnext=W,J.whave=J.wsize):(J.wnext+=ie,J.wnext===J.wsize&&(J.wnext=0),J.whave<J.wsize&&(J.whave+=ie))),0}i.inflateReset=w,i.inflateReset2=j,i.inflateResetKeep=x,i.inflateInit=function(O){return S(O,15)},i.inflateInit2=S,i.inflate=function(O,F){var k,W,ie,J,K,L,oe,H,G,pe,Q,ae,Re,Ke,ye,Ne,He,Ye,bt,et,_,ee,B,R,T=0,I=new o.Buf8(4),X=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!O||!O.state||!O.output||!O.input&&O.avail_in!==0)return p;(k=O.state).mode===12&&(k.mode=13),K=O.next_out,ie=O.output,oe=O.avail_out,J=O.next_in,W=O.input,L=O.avail_in,H=k.hold,G=k.bits,pe=L,Q=oe,ee=f;e:for(;;)switch(k.mode){case v:if(k.wrap===0){k.mode=13;break}for(;G<16;){if(L===0)break e;L--,H+=W[J++]<<G,G+=8}if(2&k.wrap&&H===35615){I[k.check=0]=255&H,I[1]=H>>>8&255,k.check=a(k.check,I,2,0),G=H=0,k.mode=2;break}if(k.flags=0,k.head&&(k.head.done=!1),!(1&k.wrap)||(((255&H)<<8)+(H>>8))%31){O.msg="incorrect header check",k.mode=30;break}if((15&H)!=8){O.msg="unknown compression method",k.mode=30;break}if(G-=4,_=8+(15&(H>>>=4)),k.wbits===0)k.wbits=_;else if(_>k.wbits){O.msg="invalid window size",k.mode=30;break}k.dmax=1<<_,O.adler=k.check=1,k.mode=512&H?10:12,G=H=0;break;case 2:for(;G<16;){if(L===0)break e;L--,H+=W[J++]<<G,G+=8}if(k.flags=H,(255&k.flags)!=8){O.msg="unknown compression method",k.mode=30;break}if(57344&k.flags){O.msg="unknown header flags set",k.mode=30;break}k.head&&(k.head.text=H>>8&1),512&k.flags&&(I[0]=255&H,I[1]=H>>>8&255,k.check=a(k.check,I,2,0)),G=H=0,k.mode=3;case 3:for(;G<32;){if(L===0)break e;L--,H+=W[J++]<<G,G+=8}k.head&&(k.head.time=H),512&k.flags&&(I[0]=255&H,I[1]=H>>>8&255,I[2]=H>>>16&255,I[3]=H>>>24&255,k.check=a(k.check,I,4,0)),G=H=0,k.mode=4;case 4:for(;G<16;){if(L===0)break e;L--,H+=W[J++]<<G,G+=8}k.head&&(k.head.xflags=255&H,k.head.os=H>>8),512&k.flags&&(I[0]=255&H,I[1]=H>>>8&255,k.check=a(k.check,I,2,0)),G=H=0,k.mode=5;case 5:if(1024&k.flags){for(;G<16;){if(L===0)break e;L--,H+=W[J++]<<G,G+=8}k.length=H,k.head&&(k.head.extra_len=H),512&k.flags&&(I[0]=255&H,I[1]=H>>>8&255,k.check=a(k.check,I,2,0)),G=H=0}else k.head&&(k.head.extra=null);k.mode=6;case 6:if(1024&k.flags&&(L<(ae=k.length)&&(ae=L),ae&&(k.head&&(_=k.head.extra_len-k.length,k.head.extra||(k.head.extra=new Array(k.head.extra_len)),o.arraySet(k.head.extra,W,J,ae,_)),512&k.flags&&(k.check=a(k.check,W,ae,J)),L-=ae,J+=ae,k.length-=ae),k.length))break e;k.length=0,k.mode=7;case 7:if(2048&k.flags){if(L===0)break e;for(ae=0;_=W[J+ae++],k.head&&_&&k.length<65536&&(k.head.name+=String.fromCharCode(_)),_&&ae<L;);if(512&k.flags&&(k.check=a(k.check,W,ae,J)),L-=ae,J+=ae,_)break e}else k.head&&(k.head.name=null);k.length=0,k.mode=8;case 8:if(4096&k.flags){if(L===0)break e;for(ae=0;_=W[J+ae++],k.head&&_&&k.length<65536&&(k.head.comment+=String.fromCharCode(_)),_&&ae<L;);if(512&k.flags&&(k.check=a(k.check,W,ae,J)),L-=ae,J+=ae,_)break e}else k.head&&(k.head.comment=null);k.mode=9;case 9:if(512&k.flags){for(;G<16;){if(L===0)break e;L--,H+=W[J++]<<G,G+=8}if(H!==(65535&k.check)){O.msg="header crc mismatch",k.mode=30;break}G=H=0}k.head&&(k.head.hcrc=k.flags>>9&1,k.head.done=!0),O.adler=k.check=0,k.mode=12;break;case 10:for(;G<32;){if(L===0)break e;L--,H+=W[J++]<<G,G+=8}O.adler=k.check=m(H),G=H=0,k.mode=11;case 11:if(k.havedict===0)return O.next_out=K,O.avail_out=oe,O.next_in=J,O.avail_in=L,k.hold=H,k.bits=G,2;O.adler=k.check=1,k.mode=12;case 12:if(F===5||F===6)break e;case 13:if(k.last){H>>>=7&G,G-=7&G,k.mode=27;break}for(;G<3;){if(L===0)break e;L--,H+=W[J++]<<G,G+=8}switch(k.last=1&H,G-=1,3&(H>>>=1)){case 0:k.mode=14;break;case 1:if(A(k),k.mode=20,F!==6)break;H>>>=2,G-=2;break e;case 2:k.mode=17;break;case 3:O.msg="invalid block type",k.mode=30}H>>>=2,G-=2;break;case 14:for(H>>>=7&G,G-=7&G;G<32;){if(L===0)break e;L--,H+=W[J++]<<G,G+=8}if((65535&H)!=(H>>>16^65535)){O.msg="invalid stored block lengths",k.mode=30;break}if(k.length=65535&H,G=H=0,k.mode=15,F===6)break e;case 15:k.mode=16;case 16:if(ae=k.length){if(L<ae&&(ae=L),oe<ae&&(ae=oe),ae===0)break e;o.arraySet(ie,W,J,ae,K),L-=ae,J+=ae,oe-=ae,K+=ae,k.length-=ae;break}k.mode=12;break;case 17:for(;G<14;){if(L===0)break e;L--,H+=W[J++]<<G,G+=8}if(k.nlen=257+(31&H),H>>>=5,G-=5,k.ndist=1+(31&H),H>>>=5,G-=5,k.ncode=4+(15&H),H>>>=4,G-=4,286<k.nlen||30<k.ndist){O.msg="too many length or distance symbols",k.mode=30;break}k.have=0,k.mode=18;case 18:for(;k.have<k.ncode;){for(;G<3;){if(L===0)break e;L--,H+=W[J++]<<G,G+=8}k.lens[X[k.have++]]=7&H,H>>>=3,G-=3}for(;k.have<19;)k.lens[X[k.have++]]=0;if(k.lencode=k.lendyn,k.lenbits=7,B={bits:k.lenbits},ee=u(0,k.lens,0,19,k.lencode,0,k.work,B),k.lenbits=B.bits,ee){O.msg="invalid code lengths set",k.mode=30;break}k.have=0,k.mode=19;case 19:for(;k.have<k.nlen+k.ndist;){for(;Ne=(T=k.lencode[H&(1<<k.lenbits)-1])>>>16&255,He=65535&T,!((ye=T>>>24)<=G);){if(L===0)break e;L--,H+=W[J++]<<G,G+=8}if(He<16)H>>>=ye,G-=ye,k.lens[k.have++]=He;else{if(He===16){for(R=ye+2;G<R;){if(L===0)break e;L--,H+=W[J++]<<G,G+=8}if(H>>>=ye,G-=ye,k.have===0){O.msg="invalid bit length repeat",k.mode=30;break}_=k.lens[k.have-1],ae=3+(3&H),H>>>=2,G-=2}else if(He===17){for(R=ye+3;G<R;){if(L===0)break e;L--,H+=W[J++]<<G,G+=8}G-=ye,_=0,ae=3+(7&(H>>>=ye)),H>>>=3,G-=3}else{for(R=ye+7;G<R;){if(L===0)break e;L--,H+=W[J++]<<G,G+=8}G-=ye,_=0,ae=11+(127&(H>>>=ye)),H>>>=7,G-=7}if(k.have+ae>k.nlen+k.ndist){O.msg="invalid bit length repeat",k.mode=30;break}for(;ae--;)k.lens[k.have++]=_}}if(k.mode===30)break;if(k.lens[256]===0){O.msg="invalid code -- missing end-of-block",k.mode=30;break}if(k.lenbits=9,B={bits:k.lenbits},ee=u(d,k.lens,0,k.nlen,k.lencode,0,k.work,B),k.lenbits=B.bits,ee){O.msg="invalid literal/lengths set",k.mode=30;break}if(k.distbits=6,k.distcode=k.distdyn,B={bits:k.distbits},ee=u(h,k.lens,k.nlen,k.ndist,k.distcode,0,k.work,B),k.distbits=B.bits,ee){O.msg="invalid distances set",k.mode=30;break}if(k.mode=20,F===6)break e;case 20:k.mode=21;case 21:if(6<=L&&258<=oe){O.next_out=K,O.avail_out=oe,O.next_in=J,O.avail_in=L,k.hold=H,k.bits=G,l(O,Q),K=O.next_out,ie=O.output,oe=O.avail_out,J=O.next_in,W=O.input,L=O.avail_in,H=k.hold,G=k.bits,k.mode===12&&(k.back=-1);break}for(k.back=0;Ne=(T=k.lencode[H&(1<<k.lenbits)-1])>>>16&255,He=65535&T,!((ye=T>>>24)<=G);){if(L===0)break e;L--,H+=W[J++]<<G,G+=8}if(Ne&&!(240&Ne)){for(Ye=ye,bt=Ne,et=He;Ne=(T=k.lencode[et+((H&(1<<Ye+bt)-1)>>Ye)])>>>16&255,He=65535&T,!(Ye+(ye=T>>>24)<=G);){if(L===0)break e;L--,H+=W[J++]<<G,G+=8}H>>>=Ye,G-=Ye,k.back+=Ye}if(H>>>=ye,G-=ye,k.back+=ye,k.length=He,Ne===0){k.mode=26;break}if(32&Ne){k.back=-1,k.mode=12;break}if(64&Ne){O.msg="invalid literal/length code",k.mode=30;break}k.extra=15&Ne,k.mode=22;case 22:if(k.extra){for(R=k.extra;G<R;){if(L===0)break e;L--,H+=W[J++]<<G,G+=8}k.length+=H&(1<<k.extra)-1,H>>>=k.extra,G-=k.extra,k.back+=k.extra}k.was=k.length,k.mode=23;case 23:for(;Ne=(T=k.distcode[H&(1<<k.distbits)-1])>>>16&255,He=65535&T,!((ye=T>>>24)<=G);){if(L===0)break e;L--,H+=W[J++]<<G,G+=8}if(!(240&Ne)){for(Ye=ye,bt=Ne,et=He;Ne=(T=k.distcode[et+((H&(1<<Ye+bt)-1)>>Ye)])>>>16&255,He=65535&T,!(Ye+(ye=T>>>24)<=G);){if(L===0)break e;L--,H+=W[J++]<<G,G+=8}H>>>=Ye,G-=Ye,k.back+=Ye}if(H>>>=ye,G-=ye,k.back+=ye,64&Ne){O.msg="invalid distance code",k.mode=30;break}k.offset=He,k.extra=15&Ne,k.mode=24;case 24:if(k.extra){for(R=k.extra;G<R;){if(L===0)break e;L--,H+=W[J++]<<G,G+=8}k.offset+=H&(1<<k.extra)-1,H>>>=k.extra,G-=k.extra,k.back+=k.extra}if(k.offset>k.dmax){O.msg="invalid distance too far back",k.mode=30;break}k.mode=25;case 25:if(oe===0)break e;if(ae=Q-oe,k.offset>ae){if((ae=k.offset-ae)>k.whave&&k.sane){O.msg="invalid distance too far back",k.mode=30;break}Re=ae>k.wnext?(ae-=k.wnext,k.wsize-ae):k.wnext-ae,ae>k.length&&(ae=k.length),Ke=k.window}else Ke=ie,Re=K-k.offset,ae=k.length;for(oe<ae&&(ae=oe),oe-=ae,k.length-=ae;ie[K++]=Ke[Re++],--ae;);k.length===0&&(k.mode=21);break;case 26:if(oe===0)break e;ie[K++]=k.length,oe--,k.mode=21;break;case 27:if(k.wrap){for(;G<32;){if(L===0)break e;L--,H|=W[J++]<<G,G+=8}if(Q-=oe,O.total_out+=Q,k.total+=Q,Q&&(O.adler=k.check=k.flags?a(k.check,ie,Q,K-Q):s(k.check,ie,Q,K-Q)),Q=oe,(k.flags?H:m(H))!==k.check){O.msg="incorrect data check",k.mode=30;break}G=H=0}k.mode=28;case 28:if(k.wrap&&k.flags){for(;G<32;){if(L===0)break e;L--,H+=W[J++]<<G,G+=8}if(H!==(4294967295&k.total)){O.msg="incorrect length check",k.mode=30;break}G=H=0}k.mode=29;case 29:ee=1;break e;case 30:ee=-3;break e;case 31:return-4;case 32:default:return p}return O.next_out=K,O.avail_out=oe,O.next_in=J,O.avail_in=L,k.hold=H,k.bits=G,(k.wsize||Q!==O.avail_out&&k.mode<30&&(k.mode<27||F!==4))&&U(O,O.output,O.next_out,Q-O.avail_out)?(k.mode=31,-4):(pe-=O.avail_in,Q-=O.avail_out,O.total_in+=pe,O.total_out+=Q,k.total+=Q,k.wrap&&Q&&(O.adler=k.check=k.flags?a(k.check,ie,Q,O.next_out-Q):s(k.check,ie,Q,O.next_out-Q)),O.data_type=k.bits+(k.last?64:0)+(k.mode===12?128:0)+(k.mode===20||k.mode===15?256:0),(pe==0&&Q===0||F===4)&&ee===f&&(ee=-5),ee)},i.inflateEnd=function(O){if(!O||!O.state)return p;var F=O.state;return F.window&&(F.window=null),O.state=null,f},i.inflateGetHeader=function(O,F){var k;return O&&O.state&&2&(k=O.state).wrap?((k.head=F).done=!1,f):p},i.inflateSetDictionary=function(O,F){var k,W=F.length;return O&&O.state?(k=O.state).wrap!==0&&k.mode!==11?p:k.mode===11&&s(1,F,W,0)!==k.check?-3:U(O,F,W,W)?(k.mode=31,-4):(k.havedict=1,f):p},i.inflateInfo="pako inflate (from Nodeca project)"},{"../utils/common":41,"./adler32":43,"./crc32":45,"./inffast":48,"./inftrees":50}],50:[function(r,n,i){var o=r("../utils/common"),s=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],a=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],l=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],u=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];n.exports=function(d,h,f,p,v,g,b,m){var y,x,w,j,S,C,N,E,A,U=m.bits,O=0,F=0,k=0,W=0,ie=0,J=0,K=0,L=0,oe=0,H=0,G=null,pe=0,Q=new o.Buf16(16),ae=new o.Buf16(16),Re=null,Ke=0;for(O=0;O<=15;O++)Q[O]=0;for(F=0;F<p;F++)Q[h[f+F]]++;for(ie=U,W=15;1<=W&&Q[W]===0;W--);if(W<ie&&(ie=W),W===0)return v[g++]=20971520,v[g++]=20971520,m.bits=1,0;for(k=1;k<W&&Q[k]===0;k++);for(ie<k&&(ie=k),O=L=1;O<=15;O++)if(L<<=1,(L-=Q[O])<0)return-1;if(0<L&&(d===0||W!==1))return-1;for(ae[1]=0,O=1;O<15;O++)ae[O+1]=ae[O]+Q[O];for(F=0;F<p;F++)h[f+F]!==0&&(b[ae[h[f+F]]++]=F);if(C=d===0?(G=Re=b,19):d===1?(G=s,pe-=257,Re=a,Ke-=257,256):(G=l,Re=u,-1),O=k,S=g,K=F=H=0,w=-1,j=(oe=1<<(J=ie))-1,d===1&&852<oe||d===2&&592<oe)return 1;for(;;){for(N=O-K,A=b[F]<C?(E=0,b[F]):b[F]>C?(E=Re[Ke+b[F]],G[pe+b[F]]):(E=96,0),y=1<<O-K,k=x=1<<J;v[S+(H>>K)+(x-=y)]=N<<24|E<<16|A|0,x!==0;);for(y=1<<O-1;H&y;)y>>=1;if(y!==0?(H&=y-1,H+=y):H=0,F++,--Q[O]==0){if(O===W)break;O=h[f+b[F]]}if(ie<O&&(H&j)!==w){for(K===0&&(K=ie),S+=k,L=1<<(J=O-K);J+K<W&&!((L-=Q[J+K])<=0);)J++,L<<=1;if(oe+=1<<J,d===1&&852<oe||d===2&&592<oe)return 1;v[w=H&j]=ie<<24|J<<16|S-g|0}}return H!==0&&(v[S+H]=O-K<<24|64<<16|0),m.bits=ie,0}},{"../utils/common":41}],51:[function(r,n,i){n.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"}},{}],52:[function(r,n,i){var o=r("../utils/common"),s=0,a=1;function l(T){for(var I=T.length;0<=--I;)T[I]=0}var u=0,d=29,h=256,f=h+1+d,p=30,v=19,g=2*f+1,b=15,m=16,y=7,x=256,w=16,j=17,S=18,C=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],N=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],E=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],A=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],U=new Array(2*(f+2));l(U);var O=new Array(2*p);l(O);var F=new Array(512);l(F);var k=new Array(256);l(k);var W=new Array(d);l(W);var ie,J,K,L=new Array(p);function oe(T,I,X,te,D){this.static_tree=T,this.extra_bits=I,this.extra_base=X,this.elems=te,this.max_length=D,this.has_stree=T&&T.length}function H(T,I){this.dyn_tree=T,this.max_code=0,this.stat_desc=I}function G(T){return T<256?F[T]:F[256+(T>>>7)]}function pe(T,I){T.pending_buf[T.pending++]=255&I,T.pending_buf[T.pending++]=I>>>8&255}function Q(T,I,X){T.bi_valid>m-X?(T.bi_buf|=I<<T.bi_valid&65535,pe(T,T.bi_buf),T.bi_buf=I>>m-T.bi_valid,T.bi_valid+=X-m):(T.bi_buf|=I<<T.bi_valid&65535,T.bi_valid+=X)}function ae(T,I,X){Q(T,X[2*I],X[2*I+1])}function Re(T,I){for(var X=0;X|=1&T,T>>>=1,X<<=1,0<--I;);return X>>>1}function Ke(T,I,X){var te,D,q=new Array(b+1),ne=0;for(te=1;te<=b;te++)q[te]=ne=ne+X[te-1]<<1;for(D=0;D<=I;D++){var Y=T[2*D+1];Y!==0&&(T[2*D]=Re(q[Y]++,Y))}}function ye(T){var I;for(I=0;I<f;I++)T.dyn_ltree[2*I]=0;for(I=0;I<p;I++)T.dyn_dtree[2*I]=0;for(I=0;I<v;I++)T.bl_tree[2*I]=0;T.dyn_ltree[2*x]=1,T.opt_len=T.static_len=0,T.last_lit=T.matches=0}function Ne(T){8<T.bi_valid?pe(T,T.bi_buf):0<T.bi_valid&&(T.pending_buf[T.pending++]=T.bi_buf),T.bi_buf=0,T.bi_valid=0}function He(T,I,X,te){var D=2*I,q=2*X;return T[D]<T[q]||T[D]===T[q]&&te[I]<=te[X]}function Ye(T,I,X){for(var te=T.heap[X],D=X<<1;D<=T.heap_len&&(D<T.heap_len&&He(I,T.heap[D+1],T.heap[D],T.depth)&&D++,!He(I,te,T.heap[D],T.depth));)T.heap[X]=T.heap[D],X=D,D<<=1;T.heap[X]=te}function bt(T,I,X){var te,D,q,ne,Y=0;if(T.last_lit!==0)for(;te=T.pending_buf[T.d_buf+2*Y]<<8|T.pending_buf[T.d_buf+2*Y+1],D=T.pending_buf[T.l_buf+Y],Y++,te===0?ae(T,D,I):(ae(T,(q=k[D])+h+1,I),(ne=C[q])!==0&&Q(T,D-=W[q],ne),ae(T,q=G(--te),X),(ne=N[q])!==0&&Q(T,te-=L[q],ne)),Y<T.last_lit;);ae(T,x,I)}function et(T,I){var X,te,D,q=I.dyn_tree,ne=I.stat_desc.static_tree,Y=I.stat_desc.has_stree,M=I.stat_desc.elems,Z=-1;for(T.heap_len=0,T.heap_max=g,X=0;X<M;X++)q[2*X]!==0?(T.heap[++T.heap_len]=Z=X,T.depth[X]=0):q[2*X+1]=0;for(;T.heap_len<2;)q[2*(D=T.heap[++T.heap_len]=Z<2?++Z:0)]=1,T.depth[D]=0,T.opt_len--,Y&&(T.static_len-=ne[2*D+1]);for(I.max_code=Z,X=T.heap_len>>1;1<=X;X--)Ye(T,q,X);for(D=M;X=T.heap[1],T.heap[1]=T.heap[T.heap_len--],Ye(T,q,1),te=T.heap[1],T.heap[--T.heap_max]=X,T.heap[--T.heap_max]=te,q[2*D]=q[2*X]+q[2*te],T.depth[D]=(T.depth[X]>=T.depth[te]?T.depth[X]:T.depth[te])+1,q[2*X+1]=q[2*te+1]=D,T.heap[1]=D++,Ye(T,q,1),2<=T.heap_len;);T.heap[--T.heap_max]=T.heap[1],function(re,ue){var me,be,$e,ge,Ae,Le,Me=ue.dyn_tree,ct=ue.max_code,tt=ue.stat_desc.static_tree,Ie=ue.stat_desc.has_stree,ze=ue.stat_desc.extra_bits,ut=ue.stat_desc.extra_base,Ge=ue.stat_desc.max_length,xt=0;for(ge=0;ge<=b;ge++)re.bl_count[ge]=0;for(Me[2*re.heap[re.heap_max]+1]=0,me=re.heap_max+1;me<g;me++)Ge<(ge=Me[2*Me[2*(be=re.heap[me])+1]+1]+1)&&(ge=Ge,xt++),Me[2*be+1]=ge,ct<be||(re.bl_count[ge]++,Ae=0,ut<=be&&(Ae=ze[be-ut]),Le=Me[2*be],re.opt_len+=Le*(ge+Ae),Ie&&(re.static_len+=Le*(tt[2*be+1]+Ae)));if(xt!==0){do{for(ge=Ge-1;re.bl_count[ge]===0;)ge--;re.bl_count[ge]--,re.bl_count[ge+1]+=2,re.bl_count[Ge]--,xt-=2}while(0<xt);for(ge=Ge;ge!==0;ge--)for(be=re.bl_count[ge];be!==0;)ct<($e=re.heap[--me])||(Me[2*$e+1]!==ge&&(re.opt_len+=(ge-Me[2*$e+1])*Me[2*$e],Me[2*$e+1]=ge),be--)}}(T,I),Ke(q,Z,T.bl_count)}function _(T,I,X){var te,D,q=-1,ne=I[1],Y=0,M=7,Z=4;for(ne===0&&(M=138,Z=3),I[2*(X+1)+1]=65535,te=0;te<=X;te++)D=ne,ne=I[2*(te+1)+1],++Y<M&&D===ne||(Y<Z?T.bl_tree[2*D]+=Y:D!==0?(D!==q&&T.bl_tree[2*D]++,T.bl_tree[2*w]++):Y<=10?T.bl_tree[2*j]++:T.bl_tree[2*S]++,q=D,Z=(Y=0)===ne?(M=138,3):D===ne?(M=6,3):(M=7,4))}function ee(T,I,X){var te,D,q=-1,ne=I[1],Y=0,M=7,Z=4;for(ne===0&&(M=138,Z=3),te=0;te<=X;te++)if(D=ne,ne=I[2*(te+1)+1],!(++Y<M&&D===ne)){if(Y<Z)for(;ae(T,D,T.bl_tree),--Y!=0;);else D!==0?(D!==q&&(ae(T,D,T.bl_tree),Y--),ae(T,w,T.bl_tree),Q(T,Y-3,2)):Y<=10?(ae(T,j,T.bl_tree),Q(T,Y-3,3)):(ae(T,S,T.bl_tree),Q(T,Y-11,7));q=D,Z=(Y=0)===ne?(M=138,3):D===ne?(M=6,3):(M=7,4)}}l(L);var B=!1;function R(T,I,X,te){Q(T,(u<<1)+(te?1:0),3),function(D,q,ne,Y){Ne(D),pe(D,ne),pe(D,~ne),o.arraySet(D.pending_buf,D.window,q,ne,D.pending),D.pending+=ne}(T,I,X)}i._tr_init=function(T){B||(function(){var I,X,te,D,q,ne=new Array(b+1);for(D=te=0;D<d-1;D++)for(W[D]=te,I=0;I<1<<C[D];I++)k[te++]=D;for(k[te-1]=D,D=q=0;D<16;D++)for(L[D]=q,I=0;I<1<<N[D];I++)F[q++]=D;for(q>>=7;D<p;D++)for(L[D]=q<<7,I=0;I<1<<N[D]-7;I++)F[256+q++]=D;for(X=0;X<=b;X++)ne[X]=0;for(I=0;I<=143;)U[2*I+1]=8,I++,ne[8]++;for(;I<=255;)U[2*I+1]=9,I++,ne[9]++;for(;I<=279;)U[2*I+1]=7,I++,ne[7]++;for(;I<=287;)U[2*I+1]=8,I++,ne[8]++;for(Ke(U,f+1,ne),I=0;I<p;I++)O[2*I+1]=5,O[2*I]=Re(I,5);ie=new oe(U,C,h+1,f,b),J=new oe(O,N,0,p,b),K=new oe(new Array(0),E,0,v,y)}(),B=!0),T.l_desc=new H(T.dyn_ltree,ie),T.d_desc=new H(T.dyn_dtree,J),T.bl_desc=new H(T.bl_tree,K),T.bi_buf=0,T.bi_valid=0,ye(T)},i._tr_stored_block=R,i._tr_flush_block=function(T,I,X,te){var D,q,ne=0;0<T.level?(T.strm.data_type===2&&(T.strm.data_type=function(Y){var M,Z=4093624447;for(M=0;M<=31;M++,Z>>>=1)if(1&Z&&Y.dyn_ltree[2*M]!==0)return s;if(Y.dyn_ltree[18]!==0||Y.dyn_ltree[20]!==0||Y.dyn_ltree[26]!==0)return a;for(M=32;M<h;M++)if(Y.dyn_ltree[2*M]!==0)return a;return s}(T)),et(T,T.l_desc),et(T,T.d_desc),ne=function(Y){var M;for(_(Y,Y.dyn_ltree,Y.l_desc.max_code),_(Y,Y.dyn_dtree,Y.d_desc.max_code),et(Y,Y.bl_desc),M=v-1;3<=M&&Y.bl_tree[2*A[M]+1]===0;M--);return Y.opt_len+=3*(M+1)+5+5+4,M}(T),D=T.opt_len+3+7>>>3,(q=T.static_len+3+7>>>3)<=D&&(D=q)):D=q=X+5,X+4<=D&&I!==-1?R(T,I,X,te):T.strategy===4||q===D?(Q(T,2+(te?1:0),3),bt(T,U,O)):(Q(T,4+(te?1:0),3),function(Y,M,Z,re){var ue;for(Q(Y,M-257,5),Q(Y,Z-1,5),Q(Y,re-4,4),ue=0;ue<re;ue++)Q(Y,Y.bl_tree[2*A[ue]+1],3);ee(Y,Y.dyn_ltree,M-1),ee(Y,Y.dyn_dtree,Z-1)}(T,T.l_desc.max_code+1,T.d_desc.max_code+1,ne+1),bt(T,T.dyn_ltree,T.dyn_dtree)),ye(T),te&&Ne(T)},i._tr_tally=function(T,I,X){return T.pending_buf[T.d_buf+2*T.last_lit]=I>>>8&255,T.pending_buf[T.d_buf+2*T.last_lit+1]=255&I,T.pending_buf[T.l_buf+T.last_lit]=255&X,T.last_lit++,I===0?T.dyn_ltree[2*X]++:(T.matches++,I--,T.dyn_ltree[2*(k[X]+h+1)]++,T.dyn_dtree[2*G(I)]++),T.last_lit===T.lit_bufsize-1},i._tr_align=function(T){Q(T,2,3),ae(T,x,U),function(I){I.bi_valid===16?(pe(I,I.bi_buf),I.bi_buf=0,I.bi_valid=0):8<=I.bi_valid&&(I.pending_buf[I.pending++]=255&I.bi_buf,I.bi_buf>>=8,I.bi_valid-=8)}(T)}},{"../utils/common":41}],53:[function(r,n,i){n.exports=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}},{}],54:[function(r,n,i){(function(o){(function(s,a){if(!s.setImmediate){var l,u,d,h,f=1,p={},v=!1,g=s.document,b=Object.getPrototypeOf&&Object.getPrototypeOf(s);b=b&&b.setTimeout?b:s,l={}.toString.call(s.process)==="[object process]"?function(w){process.nextTick(function(){y(w)})}:function(){if(s.postMessage&&!s.importScripts){var w=!0,j=s.onmessage;return s.onmessage=function(){w=!1},s.postMessage("","*"),s.onmessage=j,w}}()?(h="setImmediate$"+Math.random()+"$",s.addEventListener?s.addEventListener("message",x,!1):s.attachEvent("onmessage",x),function(w){s.postMessage(h+w,"*")}):s.MessageChannel?((d=new MessageChannel).port1.onmessage=function(w){y(w.data)},function(w){d.port2.postMessage(w)}):g&&"onreadystatechange"in g.createElement("script")?(u=g.documentElement,function(w){var j=g.createElement("script");j.onreadystatechange=function(){y(w),j.onreadystatechange=null,u.removeChild(j),j=null},u.appendChild(j)}):function(w){setTimeout(y,0,w)},b.setImmediate=function(w){typeof w!="function"&&(w=new Function(""+w));for(var j=new Array(arguments.length-1),S=0;S<j.length;S++)j[S]=arguments[S+1];var C={callback:w,args:j};return p[f]=C,l(f),f++},b.clearImmediate=m}function m(w){delete p[w]}function y(w){if(v)setTimeout(y,0,w);else{var j=p[w];if(j){v=!0;try{(function(S){var C=S.callback,N=S.args;switch(N.length){case 0:C();break;case 1:C(N[0]);break;case 2:C(N[0],N[1]);break;case 3:C(N[0],N[1],N[2]);break;default:C.apply(a,N)}})(j)}finally{m(w),v=!1}}}}function x(w){w.source===s&&typeof w.data=="string"&&w.data.indexOf(h)===0&&y(+w.data.slice(h.length))}})(typeof self>"u"?o===void 0?this:o:self)}).call(this,typeof Bn<"u"?Bn:typeof self<"u"?self:typeof window<"u"?window:{})},{}]},{},[10])(10)})})(T1);var dB=T1.exports;const hB=zc(dB);function fB(t){let e="",r=t;for(;r>=0;)e=String.fromCharCode(r%26+65)+e,r=Math.floor(r/26)-1;return e}function pB(t,e){return`${fB(t)}${e+1}`}async function gB(t,e,r="design"){const i=Math.ceil(e.width/1e3),o=Math.ceil(e.length/1e3);console.log(`[SLICER] Creating ${i}×${o} grid (${i*o} tiles) for ${e.width}mm × ${e.length}mm design`);const l=new DOMParser().parseFromString(t,"image/svg+xml").querySelector("svg");if(!l)throw new Error("Invalid SVG content");const u=l.getAttribute("viewBox");let d,h;if(u){const C=u.split(/\s+/).map(Number);d=C[2],h=C[3]}else d=parseFloat(l.getAttribute("width"))||1024,h=parseFloat(l.getAttribute("height"))||1024;console.log(`[SLICER] SVG internal dimensions: ${d} × ${h}`);const f=d/e.width,p=h/e.length,v=1e3*f,g=1e3*p;console.log(`[SLICER] Tile size in SVG units: ${v} × ${g}`);const b=l.innerHTML,m=l.getAttribute("xmlns")||"http://www.w3.org/2000/svg",y=new hB,x=y.folder("tiles"),w=[];for(let C=0;C<o;C++){const N=[];for(let E=0;E<i;E++){const A=pB(E,C);N.push(A);const U=E*v,O=C*g,F=`${U} ${O} ${v} ${g}`,k=`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="${m}" viewBox="${F}" width="1000mm" height="1000mm">
  <defs>
    <clipPath id="tile-clip">
      <rect x="${U}" y="${O}" width="${v}" height="${g}"/>
    </clipPath>
  </defs>
  <g clip-path="url(#tile-clip)">
${b}
  </g>
</svg>`,W=`${N1(r)}_${A}.svg`;x.file(W,k)}w.push(N)}const j=mB(w,e,r);y.file("layout-guide.txt",j);const S=await y.generateAsync({type:"blob"});return console.log(`[SLICER] Created ZIP with ${i*o} tiles`),S}function mB(t,e,r){const n=t.length,i=t[0].length;let o=`TPV Studio - Tile Layout Guide
================================

Design: ${r}
Total Size: ${e.width}mm × ${e.length}mm (${e.width/1e3}m × ${e.length/1e3}m)
Tile Size: 1000mm × 1000mm (1m × 1m)
Grid: ${i} columns × ${n} rows (${i*n} tiles)

Layout (view from above):
-------------------------

`;const s=6;o+="┌"+("─".repeat(s)+"┬").repeat(i-1)+"─".repeat(s)+`┐
`;for(let a=0;a<n;a++){o+="│";for(let l=0;l<i;l++){const u=t[a][l],d=s-u.length,h=Math.floor(d/2),f=d-h;o+=" ".repeat(h)+u+" ".repeat(f)+"│"}o+=`
`,a<n-1?o+="├"+("─".repeat(s)+"┼").repeat(i-1)+"─".repeat(s)+`┤
`:o+="└"+("─".repeat(s)+"┴").repeat(i-1)+"─".repeat(s)+`┘
`}return o+=`
Installation Notes:
-------------------
- Each tile is exactly 1m × 1m
- Tiles are named by column (A-Z) and row (1-${n})
- Start from top-left corner (A1) when laying out
- Tiles align perfectly when placed edge-to-edge
- Edge tiles may contain partial content if design isn't exactly divisible by 1m

Generated by TPV Studio
`,o}function N1(t){return t.replace(/[<>:"/\\|?*]/g,"_").replace(/\s+/g,"-").substring(0,50)}function vB(t,e){const r=URL.createObjectURL(t),n=document.createElement("a");n.href=r,n.download=e,document.body.appendChild(n),n.click(),document.body.removeChild(n),URL.revokeObjectURL(r)}async function yB(t,e,r="design"){try{const n=await fetch(t);if(!n.ok)throw new Error(`Failed to fetch SVG: ${n.statusText}`);const i=await n.text(),o=await gB(i,e,r),s=`${N1(r)}-tiles-1mx1m.zip`;return vB(o,s),console.log(`[SLICER] Downloaded ${s}`),!0}catch(n){throw console.error("[SLICER] Failed to download tiles:",n),n}}function bB({loadedDesign:t,onDesignSaved:e}){var gi;const[r,n]=$.useState("prompt"),[i,o]=$.useState(""),[s,a]=$.useState(5e3),[l,u]=$.useState(5e3),[d,h]=$.useState(null),[f,p]=$.useState(null),[v,g]=$.useState(!1),[b,m]=$.useState(null),[y,x]=$.useState(!1),[w,j]=$.useState(null),[S,C]=$.useState(null),[N,E]=$.useState(null),[A,U]=$.useState(null),[O,F]=$.useState(""),[k,W]=$.useState(null),[ie,J]=$.useState(null),[K,L]=$.useState(null),[oe,H]=$.useState(null),[G,pe]=$.useState(!1),[Q,ae]=$.useState("solid"),[Re,Ke]=$.useState(null),[ye,Ne]=$.useState(null),[He,Ye]=$.useState(null),[bt,et]=$.useState(!1),[_,ee]=$.useState(!1),[B,R]=$.useState(null),[T,I]=$.useState(new Map),[X,te]=$.useState(new Map),[D,q]=$.useState(new Map),[ne,Y]=$.useState(!1),[M,Z]=$.useState(null),[re,ue]=$.useState(null),[me,be]=$.useState([]),[$e,ge]=$.useState(!1),[Ae,Le]=$.useState([new Map]),[Me,ct]=$.useState(0),[tt,Ie]=$.useState(!1),[ze,ut]=$.useState(null),[Ge,xt]=$.useState(!1),[Jt,Gr]=$.useState(""),[el,tl]=$.useState(!1),[wu,Pt]=$.useState(null),[_s,Cn]=$.useState(!1),[Ss,_u]=$.useState(null),[Su,Cr]=$.useState(!1),[rl,Wr]=$.useState(null),[ai,Xe]=$.useState(null),[nl,_t]=$.useState(null),li=$.useRef(null);$.useEffect(()=>{(ye||K)&&li.current&&!tt&&!_&&setTimeout(()=>{var V;(V=li.current)==null||V.scrollIntoView({behavior:"smooth",block:"start"})},300)},[ye,K,tt,_]),$.useEffect(()=>{(async()=>{try{const se=await Ph({limit:1,offset:0});_t(se.designs.length>0),console.log("[INSPIRE] Existing designs check:",se.designs.length>0?"User has designs":"No designs found")}catch(se){console.error("[INSPIRE] Failed to check for existing designs:",se),_t(!0)}})()},[]),$.useEffect(()=>{r==="image"||r==="svg"?(u(null),a(null),console.log("[DIMENSION] Reset dimensions for upload mode:",r)):r==="prompt"&&(l===null||s===null)&&(u(5e3),a(5e3),console.log("[DIMENSION] Restored default dimensions for prompt mode"))},[r]),$.useEffect(()=>()=>{K&&K.startsWith("blob:")&&URL.revokeObjectURL(K),ye&&ye.startsWith("blob:")&&URL.revokeObjectURL(ye)},[]),$.useEffect(()=>{const V=se=>{se.key==="Escape"&&ne&&(Y(!1),Z(null))};return window.addEventListener("keydown",V),()=>window.removeEventListener("keydown",V)},[ne]),$.useEffect(()=>{me.length>0&&!$e&&As()},[me,$e]),$.useEffect(()=>{if(t){console.log("[INSPIRE] Loading design data:",t);const V=AF(t);console.log("[INSPIRE] Restored state:",V),n(V.inputMode),o(V.prompt),h(V.selectedFile),a(V.lengthMM),u(V.widthMM),E(V.result),J(V.blendRecipes),Ke(V.solidRecipes),H(V.colorMapping),Ye(V.solidColorMapping),I(V.solidEditedColors),te(V.blendEditedColors),L(V.blendSvgUrl),Ne(V.solidSvgUrl),ae(V.viewMode),m(V.arMapping),j(V.jobId),pe(V.showFinalRecipes),et(V.showSolidSummary),console.log("[INSPIRE] Loaded design:",t.name),t.name&&Gr(t.name),t.id&&Pt(t.id),setTimeout(async()=>{var se;if((se=V.result)!=null&&se.svg_url){console.log("[INSPIRE] Regenerating SVGs from loaded design");let de=null;try{const Se=await(await fetch(V.result.svg_url)).text();de=Rv(Se),ue(de),console.log("[INSPIRE] Tagged SVG with region IDs for loaded design")}catch(fe){console.error("[INSPIRE] Failed to tag SVG regions:",fe)}try{V.blendRecipes&&V.colorMapping&&await ku(V.result.svg_url,V.colorMapping,V.blendRecipes,V.blendEditedColors,de),V.solidRecipes&&V.solidColorMapping&&await to(V.result.svg_url,V.solidColorMapping,V.solidRecipes,V.solidEditedColors,de)}catch(fe){console.error("[INSPIRE] Failed to regenerate SVGs:",fe),U("Failed to restore design preview. Please try reloading.")}}},100)}},[t]);const dt=V=>{var Se;const se=(Se=V.target.files)==null?void 0:Se[0];if(!se){h(null);return}const fe=Iv(se,{maxSizeMB:10,allowedTypes:r==="image"?["image/png","image/jpeg"]:["image/svg+xml"]});if(!fe.valid){U(fe.error),h(null);return}h(se),U(null)},Tn=V=>{V.preventDefault(),V.stopPropagation(),g(!0)},Zi=V=>{V.preventDefault(),V.stopPropagation(),V.currentTarget===V.target&&g(!1)},rn=V=>{V.preventDefault(),V.stopPropagation()},ks=V=>{V.preventDefault(),V.stopPropagation(),g(!1);const se=V.dataTransfer.files;if(se&&se.length>0){const de=se[0],Se=Iv(de,{maxSizeMB:10,allowedTypes:r==="image"?["image/png","image/jpeg"]:["image/svg+xml"]});if(!Se.valid){U(Se.error),h(null);return}h(de),U(null)}},js=async()=>{var V,se;if(r==="prompt"&&!i.trim()){U("Please enter a design description");return}if((r==="image"||r==="svg")&&!d){U("Please select a file to upload");return}U(null),x(!0),C(null),E(null),j(null),F("Initialising..."),W(null);try{let de;if(r==="svg"){F("Uploading SVG file..."),p("Uploading...");const je=await $v(d);if(!je.success)throw new Error(je.error||"Failed to upload file");if(F("Processing SVG..."),p(null),de=await xi.processUploadedSVG({svg_url:je.url}),!de.success)throw new Error(de.error||"Failed to process SVG");j(de.jobId),F("✓ SVG uploaded successfully!"),x(!1);const ke=await xi.getRecraftStatus(de.jobId);C(ke),E(ke.result),(V=ke.result)!=null&&V.svg_url&&await Ts(ke.result.svg_url,de.jobId);return}if(r==="image"){F("Uploading image..."),p("Uploading...");const je=await $v(d);if(!je.success)throw new Error(je.error||"Failed to upload file");if(F("Starting vectorisation..."),p(null),de=await xi.vectorizeImage({image_url:je.url}),!de.success)throw new Error(de.error||"Failed to start vectorisation");F("🎨 AI is vectorising your image...")}else{const je=lB(s,l);if(m(je),console.log("[TPV-STUDIO] AR Mapping:",je),console.log("[TPV-STUDIO] Layout:",cB(je)),uB(je)?F(`Generating ${je.canonical.name} design panel...`):F("Initialising..."),de=await xi.generateRecraft({prompt:i.trim(),lengthMM:je.recraft.height,widthMM:je.recraft.width}),!de.success)throw new Error(de.error||"Failed to start generation");F("🎨 AI is creating your design...")}j(de.jobId),F("Request submitted, waiting for processing...");let fe=null,Se=Date.now();await xi.waitForRecraftCompletion(de.jobId,je=>{var Fe,De;C(je);const ke=Math.floor((Date.now()-Se)/1e3);if(je.status==="queued"){const Qe=[`🎨 Preparing your canvas... (${ke}s)`,`✨ Warming up the AI brushes... (${ke}s)`,`🎯 Queueing your masterpiece... (${ke}s)`,`🖌️ Mixing digital paints... (${ke}s)`,`💭 AI is contemplating your vision... (${ke}s)`,`🌈 Selecting the perfect colours... (${ke}s)`,`📐 Calculating vector paths... (${ke}s)`,`⚡ Almost ready to create... (${ke}s)`],Ot=Math.floor(ke/4)%Qe.length;F(Qe[Ot])}else if(je.status==="running")if(fe!=="running")F("🎨 AI is creating your design..."),fe="running";else{const Qe=[`🎨 Creating vector shapes... (${ke}s)`,`🖌️ Applying colours and patterns... (${ke}s)`,`✨ Refining design details... (${ke}s)`,`🎯 Finalising artwork... (${ke}s)`],Ot=Math.floor(ke/5)%Qe.length;F(Qe[Ot])}else if(je.status==="retrying"){const Qe=((Fe=je.recraft)==null?void 0:Fe.attempt_current)||0,Ot=((De=je.recraft)==null?void 0:De.attempt_max)||3;F(`⚡ Retrying generation (attempt ${Qe}/${Ot})...`)}});const Te=await xi.getRecraftStatus(de.jobId);C(Te),E(Te.result),Te.status==="completed"&&(F("✓ Design ready!"),x(!1),(se=Te.result)!=null&&se.svg_url&&await Ts(Te.result.svg_url,de.jobId))}catch(de){console.error("Generation failed:",de),U(de.message),F(""),x(!1)}},il=()=>{const V=Q==="solid"?ye:K,se=Q==="solid"?"tpv-solid":"tpv-blend";if(V){const de=document.createElement("a");de.href=V,de.download=`${se}-${Date.now()}.svg`,document.body.appendChild(de),de.click(),document.body.removeChild(de)}},ci=async V=>{try{const de=await(await fetch(V)).text(),Te=new DOMParser().parseFromString(de,"image/svg+xml").querySelector("svg");if(!Te)return null;let je,ke;const Fe=Te.getAttribute("viewBox");if(Fe){const Qe=Fe.split(/\s+/).map(Number);je=Qe[2],ke=Qe[3]}else je=parseFloat(Te.getAttribute("width"))||1024,ke=parseFloat(Te.getAttribute("height"))||1024;const De=je/ke;return console.log(`[DIMENSION] Detected aspect ratio: ${De.toFixed(2)} (${je}×${ke})`),De}catch(se){return console.error("[DIMENSION] Failed to detect aspect ratio:",se),null}},Nn=(V,se)=>{console.log(`[DIMENSION] User confirmed dimensions: ${V}mm × ${se}mm`),u(V),a(se),ai==="pdf"?setTimeout(()=>di(V,se),100):ai==="tiles"?setTimeout(()=>Cs(V,se),100):ai==="insitu"?setTimeout(()=>Cn(!0),100):ai==="save"&&setTimeout(()=>xt(!0),100),Xe(null)},ui=async()=>{const V=Q==="solid"?ye:K;if((r==="image"||r==="svg")&&(!l||!s)){console.log("[DIMENSION] No dimensions set for image/SVG upload, showing modal...");const se=await ci(V);if(se){Wr(se),Xe("insitu"),Cr(!0);return}else{Wr(1),Xe("insitu"),Cr(!0);return}}Cn(!0)},nn=()=>{const V=Q==="solid"?ye:K,se=Q==="solid"?"tpv-solid":"tpv-blend";if(V){const de=new Image;de.onload=()=>{const fe=document.createElement("canvas");fe.width=de.naturalWidth||1e3,fe.height=de.naturalHeight||1e3,fe.getContext("2d").drawImage(de,0,0),fe.toBlob(Te=>{const je=URL.createObjectURL(Te),ke=document.createElement("a");ke.href=je,ke.download=`${se}-${Date.now()}.png`,document.body.appendChild(ke),ke.click(),document.body.removeChild(ke),URL.revokeObjectURL(je)})},de.src=V}},Es=async()=>{const V=Q==="solid"?ye:K;if((r==="image"||r==="svg")&&(!l||!s)){console.log("[DIMENSION] No dimensions set for image/SVG upload, showing modal before save...");const se=await ci(V);if(se){Wr(se),Xe("save"),Cr(!0);return}else{Wr(1),Xe("save"),Cr(!0);return}}xt(!0)},[Ji,on]=$.useState(!1),Qi=async()=>{const V=Q==="solid"?ye:K;if((r==="image"||r==="svg")&&(!l||!s)){console.log("[DIMENSION] No dimensions set for image/SVG upload, showing modal...");const se=await ci(V);if(se){Wr(se),Xe("pdf"),Cr(!0);return}else{Wr(1),Xe("pdf"),Cr(!0);return}}await di(l,s)},di=async(V,se)=>{const de=Q==="solid"?ye:K,fe=Q==="solid"?Re:ie,Se=Q==="solid"?"tpv-solid":"tpv-blend";if(!de||!fe){U("Cannot generate PDF: missing SVG or recipes");return}on(!0),U(null);try{const je=await(await fetch(de)).text(),ke=new AbortController,Fe=setTimeout(()=>ke.abort(),3e4),De=await mn.getSession(),Qe={"Content-Type":"application/json"};De!=null&&De.access_token&&(Qe.Authorization=`Bearer ${De.access_token}`);const Ot=await fetch("/api/export-pdf",{method:"POST",headers:Qe,signal:ke.signal,body:JSON.stringify({svgString:je,designName:Jt||i||"TPV Design",projectName:"TPV Studio",dimensions:{widthMM:V,lengthMM:se},recipes:fe,mode:Q,designId:w||""})});if(clearTimeout(Fe),!Ot.ok){const mi=Ot.headers.get("content-type");if(mi&&mi.includes("application/json")){const vi=await Ot.json();throw new Error(vi.message||"PDF generation failed")}else{const vi=await Ot.text();throw console.error("PDF API error response:",vi),new Error(`Server error: ${Ot.status}`)}}const We=await Ot.blob(),qe=URL.createObjectURL(We),Ze=document.createElement("a");Ze.href=qe,Ze.download=`${Se}-${Date.now()}.pdf`,document.body.appendChild(Ze),Ze.click(),document.body.removeChild(Ze),URL.revokeObjectURL(qe)}catch(Te){console.error("PDF download error:",Te),Te.name==="AbortError"?U("PDF generation timed out. Please try again."):U(`PDF generation failed: ${Te.message}`)}finally{on(!1)}},ol=async()=>{const V=Q==="solid"?ye:K;if(!V){U("No SVG available to slice");return}if((r==="image"||r==="svg")&&(!l||!s)){console.log("[DIMENSION] No dimensions set for image/SVG upload, showing modal...");const se=await ci(V);if(se){Wr(se),Xe("tiles"),Cr(!0);return}else{Wr(1),Xe("tiles"),Cr(!0);return}}await Cs(l,s)},Cs=async(V,se)=>{const de=Q==="solid"?ye:K;try{await yB(de,{width:V,length:se},Jt||"tpv-design")}catch(fe){console.error("Tile download error:",fe),U(`Failed to download tiles: ${fe.message}`)}},Ts=async(V=null,se=null)=>{const de=V||(N==null?void 0:N.svg_url),fe=se||w;if(!de){U("No SVG available to analyse");return}L(null),J(null),H(null),console.log("[TPV-STUDIO] Cleared old blend state, starting new blend generation"),U(null),F("🎨 Extracting colours from design..."),await new Promise(Se=>setTimeout(Se,100));try{const Se=await fetch("/api/blend-recipes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({svg_url:de,job_id:fe,max_colors:15,max_components:2})}),Te=await Se.json();if(!Se.ok)throw new Error(Te.error||"Failed to generate blend recipes");if(Te.success){F("🔍 Matching TPV granule colours..."),await new Promise(Fe=>setTimeout(Fe,300)),J(Te.recipes);const je=XF(Te.recipes);console.log("[TPV-STUDIO] Color mapping built with",je.size,"entries:"),Array.from(je.entries()).forEach(([Fe,De])=>{console.log(`  ${Fe} -> ${De.blendHex}`)}),H(je);let ke=null;try{const De=await(await fetch(de)).text();ke=Rv(De),ue(ke),console.log("[TPV-STUDIO] Tagged SVG with region IDs for per-element editing")}catch(Fe){console.error("[TPV-STUDIO] Failed to tag SVG regions:",Fe)}try{F("✨ Generating TPV blend preview..."),await new Promise(Qe=>setTimeout(Qe,200)),console.log("[TPV-STUDIO] Generating recoloured SVG from:",de),console.log("[TPV-STUDIO] Using mapping with",je.size,"colors");const{dataUrl:Fe,stats:De}=await ho(de,je,ke);L(Fe),F("✓ TPV blend ready!"),console.log("[TPV-STUDIO] Recolour stats:",{totalColors:De.totalColors,colorsReplaced:De.colorsReplaced,colorsNotMapped:Array.from(De.colorsNotMapped)}),De.colorsNotMapped.size>0&&console.warn("[TPV-STUDIO] Some colors were not mapped:",Array.from(De.colorsNotMapped)),On(de,fe,ke)}catch(Fe){console.error("[TPV-STUDIO] Failed to generate recoloured SVG:",Fe),U(`Recipes generated successfully, but SVG recolouring failed: ${Fe.message}`)}}else throw new Error(Te.error||"Unknown error generating recipes")}catch(Se){console.error("Blend generation failed:",Se),U(Se.message),F("")}},eo=async()=>{ee(!1),R(null),Ie(!1),ut(null),Q==="solid"?I(new Map):te(new Map),N!=null&&N.svg_url&&await Ts(N.svg_url,w)},hi=async V=>{var se;if(!Jt){if(!i||r!=="prompt"){d&&Gr(`TPV Design – ${d.name.replace(/\.[^/.]+$/,"")}`);return}tl(!0);try{const de=(V==null?void 0:V.slice(0,6).map(Se=>{var je,ke;const Te=(ke=(je=Se.chosenRecipe)==null?void 0:je.components)==null?void 0:ke[0];return(Te==null?void 0:Te.name)||null}).filter(Boolean))||[],fe=await xi.generateDesignName({prompt:i,colors:de,dimensions:{widthMM:l,lengthMM:s}});fe.success&&((se=fe.names)==null?void 0:se.length)>0?Gr(fe.names[0]):Gr(sn(i))}catch(de){console.error("[TPV-STUDIO] Name generation failed:",de),Gr(sn(i))}finally{tl(!1)}}},sn=V=>V?`TPV Design – ${V.split(/[,.]/)[0].trim().slice(0,40)}`:"TPV Playground Design",On=async(V=null,se=null,de=null)=>{const fe=V||(N==null?void 0:N.svg_url),Se=se||w,Te=de||re;if(fe)try{console.log("[TPV-STUDIO] Generating solid color version...");const je=await fetch("/api/solid-recipes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({svg_url:fe,job_id:Se,max_colors:15})}),ke=await je.json();if(!je.ok)throw new Error(ke.error||"Failed to generate solid recipes");if(ke.success){Ke(ke.recipes);const Fe=new Map(Object.entries(ke.colorMapping||{}));console.log("[TPV-STUDIO] Using API colorMapping with",Fe.size,"entries"),Ye(Fe);try{const{dataUrl:De,stats:Qe}=await ho(fe,Fe,Te);Ne(De),console.log("[TPV-STUDIO] Solid color SVG generated:",Qe),Qe.colorsNotMapped&&Qe.colorsNotMapped.size>0&&console.warn("[TPV-STUDIO] Unmapped colors in solid mode:",Array.from(Qe.colorsNotMapped)),hi(ke.recipes)}catch(De){console.error("[TPV-STUDIO] Failed to generate solid SVG:",De)}}}catch(je){console.error("[TPV-STUDIO] Solid generation failed:",je)}},Ns=(V,se="palette")=>{if(console.log("[TPV-STUDIO] Color clicked:",V,"source:",se,"in mode:",Q),ne&&M&&se==="palette"){Rs(M.regionId,V.hex),Y(!1),Z(null);return}se==="palette"&&(Q==="blend"?(ut(V),Ie(!0),pe(!1)):(R(V),ee(!0),et(!1)))},Os=V=>{console.log("[TPV-STUDIO] Region clicked:",V),ne?(Rs(M.regionId,V.sourceColor),Y(!1),Z(null)):(Y(!0),Z(V))},Rs=(V,se)=>{console.log("[TPV-STUDIO] Queuing region recolor:",V,"->",se),be(de=>[...de,{regionId:V,newHex:se.toLowerCase(),viewMode:Q}])},As=async()=>{if($e||me.length===0)return;ge(!0);const V=me[0];console.log("[TPV-STUDIO] Processing queued region recolor:",V.regionId,"->",V.newHex);try{const se=new Map(D);se.set(V.regionId,V.newHex),V.viewMode==="blend"?await an(null,null,se):await An(null,null,se),q(se),Le(de=>{const fe=de.slice(0,Me+1);return fe.push(new Map(se)),fe.length>50&&fe.shift(),fe}),ct(de=>{const fe=Ae.slice(0,de+1);return fe.push(new Map(se)),Math.min(fe.length-1,49)}),console.log("[TPV-STUDIO] Completed region recolor for:",V.regionId)}catch(se){console.error("[TPV-STUDIO] Failed to process region recolor:",se)}finally{be(se=>se.slice(1)),ge(!1)}},Ps=()=>{console.log("[TPV-STUDIO] Eyedropper cancelled"),Y(!1),Z(null)},fi=async()=>{if(Me<=0)return;const V=Me-1,se=Ae[V];console.log("[TPV-STUDIO] Undoing region override to index:",V),q(new Map(se)),ct(V),Q==="blend"?await an(null,null,se):await An(null,null,se)},pi=async()=>{if(Me>=Ae.length-1)return;const V=Me+1,se=Ae[V];console.log("[TPV-STUDIO] Redoing region override to index:",V),q(new Map(se)),ct(V),Q==="blend"?await an(null,null,se):await An(null,null,se)},Tr=async V=>{if(B)if(console.log("[TPV-STUDIO] Color changed:",B.hex,"->",V,"in mode:",Q),Q==="solid"){const se=new Map(T),de=Re.find(Se=>Se.targetColor.hex.toLowerCase()===B.hex.toLowerCase()),fe=(de==null?void 0:de.mergedOriginalColors)||[B.originalHex.toLowerCase()];console.log("[TPV-STUDIO] Updating",fe.length,"merged colors:",fe),fe.forEach(Se=>{se.set(Se,{newHex:V.toLowerCase()})}),I(se),R({...B,hex:V,blendHex:V}),await An(se,V)}else{const se=new Map(X);se.set(B.originalHex.toLowerCase(),{newHex:V.toLowerCase()}),te(se),R({...B,hex:V,blendHex:V}),await an(se,V)}},Rn=$.useCallback(async({blendHex:V,parts:se,recipe:de})=>{if(!ze)return;console.log("[TPV-STUDIO] Mixer blend changed:",ze.originalHex,"->",V,"recipe:",de);const fe=new Map(X);fe.set(ze.originalHex.toLowerCase(),{newHex:V.toLowerCase(),recipe:de,parts:se}),te(fe),ut({...ze,hex:V,blendHex:V}),await an(fe,V)},[ze,X,N,oe]),an=async(V=null,se=null,de=null)=>{if(!(!(N!=null&&N.svg_url)||!oe||!ie))try{const fe=new Map(oe),Se=V||X;Se.forEach((We,qe)=>{if(We.newHex){const Ze=qe.toLowerCase();fe.set(Ze,{...fe.get(Ze),blendHex:We.newHex})}});const Te=ie.map(We=>{const qe=Se.get(We.originalColor.hex.toLowerCase());if(qe!=null&&qe.newHex){const Ze={...We,targetColor:{...We.targetColor,hex:qe.newHex},blendColor:{...We.blendColor,hex:qe.newHex}};return qe.recipe&&qe.recipe.components&&(Ze.chosenRecipe={...We.chosenRecipe,components:qe.recipe.components,deltaE:0,quality:"Excellent"}),Ze}return We}),{svgText:je,stats:ke}=await ho(N.svg_url,fe,re),Fe=de!==null?de:D,De=Av(je,Fe);K&&K.startsWith("blob:")&&(URL.revokeObjectURL(K),console.log("[TPV-STUDIO] Revoked old blend blob URL"));const Qe=new Blob([De],{type:"image/svg+xml"}),Ot=URL.createObjectURL(Qe);console.log("[TPV-STUDIO] Created new blend blob URL, SVG length:",De.length),L(Ot),H(fe),J(Te),console.log("[TPV-STUDIO] Blend SVG regenerated with edits:",ke),Fe.size>0&&console.log("[TPV-STUDIO] Applied",Fe.size,"region overrides")}catch(fe){console.error("[TPV-STUDIO] Failed to regenerate blend SVG:",fe)}},An=async(V=null,se=null,de=null)=>{if(!(!(N!=null&&N.svg_url)||!He||!Re))try{const fe=new Map(He),Se=V||T;Se.forEach((We,qe)=>{if(We.newHex){const Ze=qe.toLowerCase();fe.set(Ze,{...fe.get(Ze),blendHex:We.newHex})}});const Te=Re.map(We=>{const qe=Se.get(We.originalColor.hex.toLowerCase());if(qe!=null&&qe.newHex){const Ze=$i.find(mi=>mi.hex.toLowerCase()===qe.newHex.toLowerCase());return Ze?{...We,targetColor:{...We.targetColor,hex:qe.newHex},blendColor:{hex:qe.newHex,rgb:Ze.rgb,lab:Ze.lab},chosenRecipe:{components:[{code:Ze.code,name:Ze.name,hex:Ze.hex,rgb:Ze.rgb,lab:Ze.lab,ratio:1}],blendColor:{hex:Ze.hex,rgb:Ze.rgb,lab:Ze.lab},deltaE:0,quality:"Perfect"}}:{...We,targetColor:{...We.targetColor,hex:qe.newHex},blendColor:{...We.blendColor,hex:qe.newHex}}}return We}),{svgText:je,stats:ke}=await ho(N.svg_url,fe,re),Fe=de!==null?de:D,De=Av(je,Fe);ye&&ye.startsWith("blob:")&&(URL.revokeObjectURL(ye),console.log("[TPV-STUDIO] Revoked old solid blob URL"));const Qe=new Blob([De],{type:"image/svg+xml"}),Ot=URL.createObjectURL(Qe);console.log("[TPV-STUDIO] Created new solid blob URL, SVG length:",De.length),Ne(Ot),Ye(fe),Ke(Te),console.log("[TPV-STUDIO] Solid SVG regenerated with edits:",ke),Fe.size>0&&console.log("[TPV-STUDIO] Applied",Fe.size,"region overrides")}catch(fe){console.error("[TPV-STUDIO] Failed to regenerate solid SVG:",fe)}},ku=async(V,se,de,fe,Se=null)=>{try{console.log("[INSPIRE] Regenerating blend SVG from state");const Te=new Map(se);fe&&fe.size>0&&fe.forEach((ke,Fe)=>{const De=Fe.toLowerCase();Te.has(De)&&Te.set(De,{...Te.get(De),blendHex:ke.newHex})});const{dataUrl:je}=await ho(V,Te,Se);L(je),console.log("[INSPIRE] Blend SVG regenerated")}catch(Te){console.error("[INSPIRE] Failed to regenerate blend SVG:",Te)}},to=async(V,se,de,fe,Se=null)=>{try{console.log("[INSPIRE] Regenerating solid SVG from state");const Te=new Map(se);fe&&fe.size>0&&fe.forEach((ke,Fe)=>{const De=Fe.toLowerCase();Te.has(De)&&Te.set(De,{...Te.get(De),blendHex:ke.newHex})});const{dataUrl:je}=await ho(V,Te,Se);Ne(je),console.log("[INSPIRE] Solid SVG regenerated")}catch(Te){console.error("[INSPIRE] Failed to regenerate solid SVG:",Te)}};return c.jsxs("div",{className:"inspire-panel-recraft",children:[c.jsxs("div",{className:"panel-header",children:[c.jsx("h2",{children:"TPV Studio - Vector AI"}),c.jsx("p",{className:"subtitle",children:"AI-powered vector designs for playground surfacing"})]}),!N&&!y&&nl===!1&&c.jsxs("div",{className:"welcome-guidance",children:[c.jsx("div",{className:"welcome-icon",children:"✨"}),c.jsx("h3",{children:"Create Your First Design"}),c.jsx("p",{children:"Choose how you'd like to create your TPV design below. You can describe what you want, upload an image to convert, or process an existing SVG file. Once generated, you'll be able to edit colours, export PDFs with specifications, and preview designs on-site."})]}),c.jsxs("div",{className:"input-mode-tabs",children:[c.jsxs("button",{className:`input-mode-tab ${r==="prompt"?"active":""}`,onClick:()=>{n("prompt"),h(null),U(null)},disabled:y,children:[c.jsxs("svg",{className:"mode-icon",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[c.jsx("path",{d:"M12 3l1.545 4.635L18.18 9.18l-4.635 1.545L12 15.36l-1.545-4.635L5.82 9.18l4.635-1.545L12 3z"}),c.jsx("path",{d:"M5 21l1.5-4.5L2 15l4.5-1.5L8 9l1.5 4.5L14 15l-4.5 1.5L8 21z",opacity:"0.5"})]}),c.jsx("span",{className:"mode-title",children:"Text Prompt"}),c.jsx("span",{className:"mode-description",children:"Describe your design"})]}),c.jsxs("button",{className:`input-mode-tab ${r==="image"?"active":""}`,onClick:()=>{n("image"),o(""),U(null)},disabled:y,children:[c.jsxs("svg",{className:"mode-icon",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[c.jsx("rect",{x:"3",y:"3",width:"18",height:"18",rx:"2",ry:"2"}),c.jsx("circle",{cx:"8.5",cy:"8.5",r:"1.5"}),c.jsx("path",{d:"M21 15l-5-5L5 21"})]}),c.jsx("span",{className:"mode-title",children:"Upload Image"}),c.jsx("span",{className:"mode-description",children:"Vectorise PNG/JPG"})]}),c.jsxs("button",{className:`input-mode-tab ${r==="svg"?"active":""}`,onClick:()=>{n("svg"),o(""),U(null)},disabled:y,children:[c.jsx("svg",{className:"mode-icon",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:c.jsx("path",{d:"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"})}),c.jsx("span",{className:"mode-title",children:"Upload SVG"}),c.jsx("span",{className:"mode-description",children:"Process existing vector"})]})]}),c.jsxs("div",{className:"form-section",children:[r==="prompt"&&c.jsxs("div",{className:"form-group",children:[c.jsx("label",{htmlFor:"prompt",children:"Design Description"}),c.jsx("textarea",{id:"prompt",value:i,onChange:V=>o(V.target.value),placeholder:"e.g., calm ocean theme with big fish silhouettes and waves",rows:4,disabled:y,className:"prompt-input"}),c.jsx("p",{className:"helper-text",children:"Describe the design you want to generate. The AI will create a vector illustration based on your description. Perfect for creating completely new designs from scratch - just describe colors, themes, and elements you want."})]}),r==="image"&&c.jsxs("div",{className:"form-group",children:[c.jsx("label",{htmlFor:"image-upload",children:"Upload Image (PNG/JPG)"}),c.jsxs("div",{className:`drop-zone ${v?"dragging":""} ${d?"has-file":""}`,onDragEnter:Tn,onDragLeave:Zi,onDragOver:rn,onDrop:ks,children:[c.jsx("input",{id:"image-upload",type:"file",accept:"image/png,image/jpeg",onChange:dt,disabled:y,className:"file-input-hidden"}),c.jsx("label",{htmlFor:"image-upload",className:"drop-zone-content",children:d?c.jsxs(c.Fragment,{children:[c.jsxs("svg",{className:"upload-icon success",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[c.jsx("path",{d:"M22 11.08V12a10 10 0 1 1-5.93-9.14"}),c.jsx("polyline",{points:"22 4 12 14.01 9 11.01"})]}),c.jsx("span",{className:"file-name",children:d.name}),c.jsx("span",{className:"drop-hint",children:"Click to change file"})]}):c.jsxs(c.Fragment,{children:[c.jsxs("svg",{className:"upload-icon",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[c.jsx("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}),c.jsx("polyline",{points:"17 8 12 3 7 8"}),c.jsx("line",{x1:"12",y1:"3",x2:"12",y2:"15"})]}),c.jsx("span",{className:"drop-text",children:"Drag & drop your image here"}),c.jsx("span",{className:"drop-hint",children:"or click to browse"})]})})]}),c.jsx("p",{className:"helper-text",children:"Upload a raster image (PNG or JPG). The AI will convert it to vector format (SVG) suitable for TPV surfacing. Best for converting photos, logos, or artwork into clean vectors that can be manufactured with TPV granules."})]}),r==="svg"&&c.jsxs("div",{className:"form-group",children:[c.jsx("label",{htmlFor:"svg-upload",children:"Upload SVG File"}),c.jsxs("div",{className:`drop-zone ${v?"dragging":""} ${d?"has-file":""}`,onDragEnter:Tn,onDragLeave:Zi,onDragOver:rn,onDrop:ks,children:[c.jsx("input",{id:"svg-upload",type:"file",accept:"image/svg+xml",onChange:dt,disabled:y,className:"file-input-hidden"}),c.jsx("label",{htmlFor:"svg-upload",className:"drop-zone-content",children:d?c.jsxs(c.Fragment,{children:[c.jsxs("svg",{className:"upload-icon success",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[c.jsx("path",{d:"M22 11.08V12a10 10 0 1 1-5.93-9.14"}),c.jsx("polyline",{points:"22 4 12 14.01 9 11.01"})]}),c.jsx("span",{className:"file-name",children:d.name}),c.jsx("span",{className:"drop-hint",children:"Click to change file"})]}):c.jsxs(c.Fragment,{children:[c.jsxs("svg",{className:"upload-icon",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[c.jsx("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}),c.jsx("polyline",{points:"17 8 12 3 7 8"}),c.jsx("line",{x1:"12",y1:"3",x2:"12",y2:"15"})]}),c.jsx("span",{className:"drop-text",children:"Drag & drop your SVG here"}),c.jsx("span",{className:"drop-hint",children:"or click to browse"})]})})]}),c.jsx("p",{className:"helper-text",children:"Upload an existing SVG vector file. It will be processed immediately for TPV colour matching - no AI generation needed. Ideal when you already have a vector design and just need to match colors to available TPV granules."})]}),r==="prompt"&&c.jsxs("div",{className:"form-row",children:[c.jsxs("div",{className:"form-group",children:[c.jsx("label",{htmlFor:"length",children:"Length (mm)"}),c.jsx("input",{id:"length",type:"number",value:s,onChange:V=>a(parseInt(V.target.value,10)),min:1e3,max:2e4,step:100,disabled:y})]}),c.jsxs("div",{className:"form-group",children:[c.jsx("label",{htmlFor:"width",children:"Width (mm)"}),c.jsx("input",{id:"width",type:"number",value:l,onChange:V=>u(parseInt(V.target.value,10)),min:1e3,max:2e4,step:100,disabled:y})]})]}),A&&c.jsxs("div",{className:"error-message",children:[c.jsx("strong",{children:"Error:"})," ",A]}),f&&c.jsx("div",{className:"upload-progress",children:c.jsx("p",{children:f})}),c.jsx("button",{onClick:js,disabled:y||r==="prompt"&&!i.trim()||(r==="image"||r==="svg")&&!d,className:"generate-button",children:y?r==="svg"?"Processing...":"Generating...":r==="prompt"?"Generate Vector Design":r==="image"?"Vectorise & Process":"Process SVG"})]}),y&&c.jsxs("div",{className:"progress-section",children:[c.jsx("div",{className:"progress-bar",children:c.jsx("div",{className:"progress-bar-fill"})}),c.jsx("p",{className:"progress-message",children:O})]}),N&&!y&&c.jsxs("div",{className:"results-section",children:[b&&c.jsxs("div",{className:`ar-info ${b.layout.mode}`,children:[c.jsxs("div",{className:"ar-info-header",children:[c.jsx("strong",{children:"Layout:"})," ",b.layout.reason]}),c.jsxs("div",{className:"ar-info-details",children:[c.jsxs("span",{children:["Requested: ",b.user.formatted]}),c.jsx("span",{children:"•"}),c.jsxs("span",{children:["Generated: ",b.canonical.name," panel"]}),b.layout.mode==="framing"&&c.jsxs(c.Fragment,{children:[c.jsx("span",{children:"•"}),c.jsx("span",{className:"layout-note",children:"Panel centred with base colour surround"})]}),b.layout.mode==="tiling"&&c.jsxs(c.Fragment,{children:[c.jsx("span",{children:"•"}),c.jsx("span",{className:"layout-note",children:"Pattern will repeat along length"})]})]})]}),K&&ie&&c.jsxs("div",{className:"mode-tabs",children:[c.jsxs("button",{className:`mode-tab ${Q==="solid"?"active":""}`,onClick:()=>ae("solid"),disabled:!ye,children:[c.jsx("span",{className:"mode-title",children:"Solid Mode"}),c.jsx("span",{className:"mode-description",children:ye?"Single TPV colours only":"Generating..."})]}),c.jsxs("button",{className:`mode-tab ${Q==="blend"?"active":""}`,onClick:()=>ae("blend"),children:[c.jsx("span",{className:"mode-title",children:"Blend Mode"}),c.jsx("span",{className:"mode-description",children:"Advanced: Mixed granules"})]})]}),Q==="blend"&&K&&ie&&c.jsx("div",{ref:li,children:c.jsx(Bm,{blendSvgUrl:K,recipes:ie,mode:"blend",onColorClick:Ns,onRegionClick:Os,onEyedropperCancel:Ps,selectedColor:B,editedColors:X,onResetAll:eo,designName:Jt,onNameChange:Gr,isNameLoading:el,onInSituClick:ui,eyedropperActive:ne,eyedropperRegion:M,onRegionUndo:fi,onRegionRedo:pi,canUndo:Me>0,canRedo:Me<Ae.length-1,regionOverridesCount:D.size})}),Q==="solid"&&ye&&Re&&c.jsx("div",{ref:li,children:c.jsx(Bm,{blendSvgUrl:ye,recipes:Re,mode:"solid",onColorClick:Ns,onRegionClick:Os,onEyedropperCancel:Ps,selectedColor:B,editedColors:T,onResetAll:eo,designName:Jt,onNameChange:Gr,isNameLoading:el,onInSituClick:ui,eyedropperActive:ne,eyedropperRegion:M,onRegionUndo:fi,onRegionRedo:pi,canUndo:Me>0,canRedo:Me<Ae.length-1,regionOverridesCount:D.size})}),tt&&ze&&c.jsxs("div",{className:"mixer-widget-container",children:[c.jsx("div",{className:"mixer-widget-header",children:c.jsx("button",{className:"mixer-close-btn",onClick:()=>{Ie(!1),ut(null)},children:"Close Mixer"})}),c.jsx(NF,{initialRecipe:((gi=X.get(ze.originalHex.toLowerCase()))==null?void 0:gi.recipe)||ze.recipe||null,onBlendChange:Rn,originalColor:ze.originalHex})]}),K&&c.jsxs("div",{className:"action-buttons",children:[c.jsx("button",{onClick:Es,className:"save-button",title:"Save this design to your gallery for later access",children:"💾 Save Design"}),c.jsx("button",{onClick:il,className:"download-button svg",title:"Download as scalable vector file (SVG) for further editing or printing",children:Q==="solid"?"Download Solid TPV SVG":"Download TPV Blend SVG"}),c.jsx("button",{onClick:nn,className:"download-button png",title:"Download as high-resolution image file (PNG) for presentations or sharing",children:Q==="solid"?"Download Solid TPV PNG":"Download TPV Blend PNG"}),c.jsx("button",{onClick:Qi,className:"download-button pdf",disabled:Ji||!(Q==="solid"?Re:ie),title:Q==="solid"?"Export comprehensive PDF with design, TPV colour specifications, and installation instructions":"Export comprehensive PDF with design, granule blend recipes, and mixing instructions",children:Ji?"Generating PDF...":Q==="solid"?"Export Solid PDF":"Export Blend PDF"}),c.jsx("button",{onClick:ol,className:"download-button tiles",title:l&&s?`Download ${Math.ceil(l/1e3)*Math.ceil(s/1e3)} tiles (1m×1m each) as separate SVG files. Perfect for large installations where each section needs to be manufactured separately.`:"Download design sliced into 1m×1m tiles as separate SVG files. Perfect for large installations.",children:"Download Tiles ZIP"})]})]}),Q==="blend"&&K&&ie&&!G&&c.jsxs("div",{className:"finalize-section",children:[c.jsx("button",{onClick:()=>pe(!0),className:"finalize-button",children:"View Recipe Details"}),c.jsx("p",{className:"finalize-hint",children:"Click to see detailed blend formulas and quality metrics"})]}),Q==="solid"&&ye&&Re&&!bt&&c.jsxs("div",{className:"finalize-section",children:[c.jsx("button",{onClick:()=>et(!0),className:"finalize-button",children:"View TPV Colours Used"}),c.jsx("p",{className:"finalize-hint",children:"See which pure TPV colours are used in this design"})]}),G&&ie&&c.jsx(Rj,{recipes:ie,onClose:()=>{pe(!1)}}),bt&&Re&&c.jsx(Aj,{recipes:Re,onClose:()=>{et(!1)}}),_&&B&&c.jsx(Kz,{color:B,mode:Q,onColorChange:Tr,onClose:()=>{ee(!1),R(null)}}),Ge&&c.jsx($F,{currentState:{inputMode:r,prompt:i,selectedFile:d,lengthMM:s,widthMM:l,result:N,viewMode:Q,blendRecipes:ie,solidRecipes:Re,colorMapping:oe,solidColorMapping:He,solidEditedColors:T,blendEditedColors:X,blendSvgUrl:K,solidSvgUrl:ye,arMapping:b,jobId:w,inSituData:Ss},existingDesignId:wu,initialName:Jt,onClose:()=>xt(!1),onSaved:(V,se)=>{xt(!1),_t(!0),se&&Gr(se),e&&e(se),console.log("[INSPIRE] Design saved:",V)}}),_s&&c.jsx(KF,{designUrl:Q==="solid"?ye:K,designDimensions:{width:l,length:s},onClose:()=>Cn(!1),onSaved:V=>{console.log("[INSPIRE] In-situ preview saved:",V),_u(V),Cn(!1)}}),c.jsx(YF,{isOpen:Su,onClose:()=>{Cr(!1),Xe(null)},onConfirm:Nn,aspectRatio:rl,defaultLongestSide:5e3}),c.jsx("style",{jsx:!0,children:`
        .inspire-panel-recraft {
          max-width: var(--max-width-xl);
          margin: 0 auto;
          padding: var(--space-4);
        }

        .panel-header {
          text-align: center;
          margin-bottom: var(--space-6);
        }

        .panel-header h2 {
          font-family: var(--font-heading);
          font-size: var(--text-3xl);
          margin: 0 0 var(--space-2) 0;
          color: var(--color-primary);
          font-weight: var(--font-bold);
          letter-spacing: var(--tracking-tight);
        }

        .subtitle {
          color: var(--color-text-secondary);
          font-size: var(--text-base);
          line-height: var(--leading-relaxed);
        }

        /* Welcome Guidance */
        .welcome-guidance {
          background: linear-gradient(135deg, #fff5f0 0%, #fff9f7 100%);
          border: 2px solid #ff6b35;
          border-radius: var(--radius-lg);
          padding: var(--space-6);
          margin-bottom: var(--space-6);
          text-align: center;
        }

        .welcome-icon {
          font-size: 3rem;
          margin-bottom: var(--space-2);
        }

        .welcome-guidance h3 {
          margin: 0 0 var(--space-3);
          font-size: var(--text-xl);
          font-weight: var(--font-bold);
          color: var(--color-primary);
        }

        .welcome-guidance p {
          margin: 0;
          color: var(--color-text-secondary);
          font-size: var(--text-base);
          line-height: var(--leading-relaxed);
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        /* Input Mode Tabs - Enhanced cards */
        .input-mode-tabs {
          display: flex;
          gap: var(--space-2);
          margin-bottom: var(--space-4);
          background: var(--color-bg-subtle);
          padding: var(--space-1);
          border-radius: var(--radius-lg);
        }

        .input-mode-tab {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-4);
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-base);
        }

        .input-mode-tab:hover:not(:disabled) {
          border-color: var(--color-primary);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .input-mode-tab.active {
          background: linear-gradient(135deg, var(--color-bg-subtle) 0%, var(--color-bg-card) 100%);
          border-color: var(--color-primary);
          box-shadow: var(--shadow-glow);
        }

        .input-mode-tab:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .mode-icon {
          width: 32px;
          height: 32px;
          color: var(--color-text-secondary);
          transition: all var(--transition-base);
        }

        .input-mode-tab:hover:not(:disabled) .mode-icon {
          color: var(--color-primary);
          transform: scale(1.1);
        }

        .input-mode-tab.active .mode-icon {
          color: var(--color-primary);
        }

        .input-mode-tab .mode-title {
          font-family: var(--font-heading);
          font-size: var(--text-base);
          font-weight: var(--font-semibold);
          color: var(--color-text-primary);
          margin-top: var(--space-1);
        }

        .input-mode-tab .mode-description {
          font-size: var(--text-sm);
          color: var(--color-text-secondary);
          text-align: center;
          line-height: var(--leading-snug);
        }

        .input-mode-tab.active .mode-title {
          color: var(--color-primary);
          font-weight: var(--font-bold);
        }

        /* Helper text */
        .helper-text {
          margin-top: var(--space-1);
          font-size: var(--text-sm);
          color: var(--color-text-tertiary);
          font-style: normal;
          line-height: var(--leading-snug);
        }

        /* Drag & Drop File Upload */
        .file-input-hidden {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        .drop-zone {
          position: relative;
          width: 100%;
          min-height: 180px;
          border: 2px dashed var(--color-border);
          border-radius: var(--radius-lg);
          background: var(--color-bg-subtle);
          transition: all var(--transition-base);
        }

        .drop-zone.dragging {
          border-color: var(--color-primary);
          background: var(--color-primary-light);
          background: linear-gradient(135deg, rgba(30, 74, 122, 0.05) 0%, rgba(30, 74, 122, 0.1) 100%);
          box-shadow: var(--shadow-glow);
        }

        .drop-zone.has-file {
          border-color: var(--color-success);
          background: var(--color-success-light);
        }

        .drop-zone-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          padding: var(--space-6);
          cursor: pointer;
          min-height: 180px;
        }

        .upload-icon {
          width: 48px;
          height: 48px;
          color: var(--color-text-secondary);
          transition: all var(--transition-base);
        }

        .upload-icon.success {
          color: var(--color-success);
        }

        .drop-zone:hover .upload-icon {
          color: var(--color-primary);
          transform: scale(1.1);
        }

        .drop-zone.has-file:hover .upload-icon.success {
          color: var(--color-success);
        }

        .drop-text {
          font-size: var(--text-base);
          font-weight: var(--font-semibold);
          color: var(--color-text-primary);
        }

        .file-name {
          font-size: var(--text-base);
          font-weight: var(--font-semibold);
          color: var(--color-success);
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .drop-hint {
          font-size: var(--text-sm);
          color: var(--color-text-tertiary);
        }

        .drop-zone.dragging .drop-text,
        .drop-zone.dragging .drop-hint {
          color: var(--color-primary);
        }

        .upload-progress {
          padding: var(--space-2);
          background: var(--color-info-light);
          border: 1px solid var(--color-info);
          border-radius: var(--radius-md);
          color: var(--color-info);
          margin-bottom: var(--space-2);
          text-align: center;
          font-size: var(--text-sm);
        }

        .form-section {
          background: var(--color-bg-card);
          padding: var(--space-4);
          border-radius: var(--radius-lg);
          margin-bottom: var(--space-4);
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-xs);
        }

        .form-group {
          margin-bottom: var(--space-4);
        }

        .form-group label {
          display: block;
          margin-bottom: var(--space-2);
          font-weight: var(--font-semibold);
          color: var(--color-text-primary);
          font-size: var(--text-sm);
        }

        .prompt-input {
          width: 100%;
          padding: var(--space-3);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          font-family: inherit;
          font-size: var(--text-base);
          background: var(--color-bg-card);
          color: var(--color-text-primary);
          transition: border-color var(--transition-base);
        }

        .prompt-input:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: var(--shadow-glow);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-3);
        }

        input[type="number"] {
          width: 100%;
          padding: var(--space-2);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-bg-card);
          color: var(--color-text-primary);
          font-size: var(--text-base);
          transition: border-color var(--transition-base);
        }

        input[type="number"]:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: var(--shadow-glow);
        }

        .error-message {
          padding: var(--space-3);
          background: var(--color-error-light);
          border: 1px solid var(--color-error);
          border-radius: var(--radius-md);
          color: var(--color-error);
          margin-bottom: var(--space-4);
          font-size: var(--text-sm);
        }

        .generate-button {
          width: 100%;
          padding: var(--space-4);
          background: var(--color-accent);
          color: white;
          border: none;
          border-radius: var(--radius-md);
          font-size: var(--text-lg);
          font-weight: var(--font-semibold);
          cursor: pointer;
          transition: all var(--transition-base);
          box-shadow: var(--shadow-sm);
        }

        .generate-button:hover:not(:disabled) {
          background: var(--color-accent-hover);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(255, 107, 53, 0.3);
        }

        .generate-button:disabled {
          background: var(--color-bg-subtle);
          color: var(--color-text-tertiary);
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .progress-section {
          padding: var(--space-4);
          background: var(--color-info-light);
          border-radius: var(--radius-lg);
          margin-bottom: var(--space-4);
          border: 1px solid var(--color-info);
        }

        .progress-bar {
          height: 4px;
          background: var(--color-border);
          border-radius: var(--radius-full);
          overflow: hidden;
          margin-bottom: var(--space-3);
        }

        .progress-bar-fill {
          height: 100%;
          background: var(--color-accent);
          animation: progress 2s ease-in-out infinite;
        }

        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .progress-message {
          text-align: center;
          color: var(--color-text-secondary);
          font-weight: var(--font-medium);
          font-size: var(--text-base);
        }

        .results-section {
          background: var(--color-bg-card);
          padding: var(--space-4);
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-sm);
        }

        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-3);
        }

        .results-header h3 {
          font-family: var(--font-heading);
          margin: 0;
          color: var(--color-primary);
          font-size: var(--text-xl);
          font-weight: var(--font-bold);
        }

        /* Aspect Ratio Info */
        .ar-info {
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-md);
          margin-bottom: var(--space-3);
          font-size: var(--text-sm);
        }

        .ar-info.full {
          background: var(--color-success-light);
          border: 1px solid var(--color-success);
        }

        .ar-info.framing {
          background: var(--color-warning-light);
          border: 1px solid var(--color-warning);
        }

        .ar-info.tiling {
          background: var(--color-info-light);
          border: 1px solid var(--color-info);
        }

        .ar-info-header {
          color: var(--color-text-primary);
          margin-bottom: var(--space-2);
          font-weight: var(--font-semibold);
        }

        .ar-info-details {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
          align-items: center;
          color: var(--color-text-secondary);
          font-size: var(--text-sm);
        }

        .ar-info-details span {
          white-space: nowrap;
        }

        .layout-note {
          color: var(--color-accent);
          font-weight: var(--font-medium);
        }

        /* Mode Toggle Tabs */
        .mode-tabs {
          display: flex;
          gap: var(--space-2);
          margin-bottom: var(--space-4);
          background: var(--color-bg-subtle);
          padding: var(--space-1);
          border-radius: var(--radius-lg);
        }

        .mode-tab {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-1);
          padding: var(--space-3);
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-base);
        }

        .mode-tab:hover:not(:disabled) {
          border-color: var(--color-accent);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .mode-tab.active {
          background: var(--color-accent);
          border-color: var(--color-accent);
          box-shadow: var(--shadow-glow-accent);
        }

        .mode-tab:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .mode-title {
          font-family: var(--font-heading);
          font-size: var(--text-base);
          font-weight: var(--font-semibold);
          color: var(--color-primary);
        }

        .mode-description {
          font-size: var(--text-sm);
          color: var(--color-text-secondary);
          text-align: center;
        }

        .mode-tab.active .mode-title {
          color: white;
          font-weight: var(--font-bold);
        }

        .mode-tab.active .mode-description {
          color: rgba(255, 255, 255, 0.9);
        }

        .svg-preview {
          margin: var(--space-3) 0;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-bg-subtle);
          padding: var(--space-3);
        }

        .design-preview {
          width: 100%;
          height: auto;
          display: block;
        }

        .action-buttons {
          display: flex;
          gap: var(--space-2);
          margin-top: var(--space-4);
        }

        .download-button,
        .blend-button,
        .new-generation-button,
        .save-button {
          flex: 1;
          padding: var(--space-3);
          border: none;
          border-radius: var(--radius-md);
          font-weight: var(--font-semibold);
          font-size: var(--text-base);
          cursor: pointer;
          transition: all var(--transition-base);
          box-shadow: var(--shadow-sm);
        }

        .download-button.svg {
          background: var(--color-primary);
          color: white;
        }

        .download-button.svg:hover {
          background: var(--color-primary-hover);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        .download-button.png {
          background: var(--color-success);
          color: white;
        }

        .download-button.png:hover {
          background: var(--color-success-hover);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        .download-button.pdf {
          background: var(--color-info);
          color: white;
        }

        .download-button.pdf:hover:not(:disabled) {
          background: #2563eb;
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        .download-button.pdf:disabled {
          background: var(--color-text-tertiary);
          cursor: not-allowed;
          transform: none;
        }

        .download-button.tiles {
          background: #8b5cf6;
          color: white;
        }

        .download-button.tiles:hover {
          background: #7c3aed;
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        .blend-button {
          background: var(--color-accent);
          color: white;
        }

        .blend-button:hover:not(:disabled) {
          background: var(--color-accent-hover);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(255, 107, 53, 0.3);
        }

        .blend-button:disabled {
          background: var(--color-bg-subtle);
          color: var(--color-text-tertiary);
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .new-generation-button {
          background: var(--color-bg-subtle);
          color: var(--color-text-primary);
          border: 1px solid var(--color-border);
        }

        .new-generation-button:hover {
          background: var(--color-border);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        .save-button {
          background: #10b981;
          color: white;
        }

        .save-button:hover {
          background: #059669;
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        /* Finalize Section */
        .finalize-section {
          background: var(--color-accent-light);
          border: 2px solid var(--color-accent);
          border-radius: var(--radius-lg);
          padding: var(--space-4);
          margin-top: var(--space-4);
          text-align: center;
        }

        .finalize-button {
          width: 100%;
          max-width: 400px;
          padding: var(--space-4);
          background: var(--color-accent);
          color: white;
          border: none;
          border-radius: var(--radius-md);
          font-size: var(--text-lg);
          font-weight: var(--font-semibold);
          cursor: pointer;
          transition: all var(--transition-base);
          box-shadow: var(--shadow-sm);
        }

        .finalize-button:hover {
          background: var(--color-accent-hover);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        .finalize-hint {
          margin: var(--space-3) 0 0 0;
          color: var(--color-text-secondary);
          font-size: var(--text-sm);
        }

        /* Mixer Widget Container Styles */
        .mixer-widget-container {
          margin-top: var(--space-4);
          background: white;
          border-radius: 12px;
          padding: var(--space-4);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .mixer-widget-header {
          display: flex;
          justify-content: flex-end;
          margin-bottom: var(--space-3);
          padding-bottom: var(--space-3);
          border-bottom: 2px solid var(--color-border);
        }

        .mixer-close-btn {
          padding: var(--space-2) var(--space-4);
          background: var(--color-primary);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: var(--text-sm);
          cursor: pointer;
          transition: all 0.2s;
        }

        .mixer-close-btn:hover {
          background: #2563eb;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
          transform: translateY(-1px);
        }

        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
          .inspire-panel-recraft {
            padding: var(--space-2);
          }

          .panel-header {
            margin-bottom: var(--space-4);
          }

          .panel-header h2 {
            font-size: var(--text-xl);
          }

          .subtitle {
            font-size: var(--text-sm);
          }

          .welcome-guidance {
            padding: var(--space-4);
            margin-bottom: var(--space-4);
          }

          .welcome-icon {
            font-size: 2rem;
          }

          .welcome-guidance h3 {
            font-size: var(--text-lg);
          }

          .welcome-guidance p {
            font-size: var(--text-sm);
          }

          /* Stack input mode tabs vertically on mobile */
          .input-mode-tabs {
            flex-direction: column;
            gap: var(--space-1);
          }

          .input-mode-tab {
            flex-direction: row;
            justify-content: flex-start;
            padding: var(--space-3);
            min-height: 44px;
          }

          .mode-icon {
            width: 24px;
            height: 24px;
            flex-shrink: 0;
          }

          .input-mode-tab .mode-title {
            font-size: var(--text-sm);
            margin-top: 0;
          }

          .input-mode-tab .mode-description {
            display: none;
          }

          /* Form sections */
          .form-section {
            padding: var(--space-3);
          }

          .form-group label {
            font-size: var(--text-xs);
          }

          /* Stack form rows on mobile */
          .form-row {
            grid-template-columns: 1fr;
            gap: var(--space-2);
          }

          /* Drop zone adjustments */
          .drop-zone {
            min-height: 140px;
          }

          .drop-zone-content {
            padding: var(--space-4);
            min-height: 140px;
          }

          .upload-icon {
            width: 36px;
            height: 36px;
          }

          .drop-text {
            font-size: var(--text-sm);
          }

          /* Generate button */
          .generate-button {
            padding: var(--space-3);
            font-size: var(--text-base);
            min-height: 44px;
          }

          /* Results section - minimal padding for max image width */
          .results-section {
            padding: var(--space-2);
            border-radius: var(--radius-md);
          }

          .results-header h3 {
            font-size: var(--text-lg);
          }

          /* Mode tabs */
          .mode-tabs {
            flex-direction: column;
            gap: var(--space-1);
          }

          .mode-tab {
            flex-direction: row;
            justify-content: flex-start;
            padding: var(--space-3);
            min-height: 44px;
          }

          .mode-title {
            font-size: var(--text-sm);
          }

          .mode-description {
            display: none;
          }

          /* Action buttons - 2x2 grid on mobile */
          .action-buttons {
            flex-wrap: wrap;
            gap: var(--space-2);
          }

          .download-button,
          .blend-button,
          .new-generation-button,
          .save-button {
            flex: 1 1 calc(50% - var(--space-1));
            min-width: calc(50% - var(--space-1));
            padding: var(--space-2);
            font-size: var(--text-sm);
            min-height: 44px;
          }

          /* AR info */
          .ar-info {
            padding: var(--space-2) var(--space-3);
          }

          .ar-info-details {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--space-1);
          }

          /* Finalize section */
          .finalize-section {
            padding: var(--space-3);
          }

          .finalize-button {
            padding: var(--space-3);
            font-size: var(--text-base);
          }
        }

        /* Extra small screens */
        @media (max-width: 480px) {
          .inspire-panel-recraft {
            padding: var(--space-1);
          }

          .panel-header h2 {
            font-size: var(--text-lg);
          }

          /* Results section - even less padding */
          .results-section {
            padding: var(--space-1);
            margin: 0 calc(-1 * var(--space-1));
            border-radius: 0;
          }

          /* Stack all action buttons vertically */
          .action-buttons {
            flex-direction: column;
          }

          .download-button,
          .blend-button,
          .new-generation-button,
          .save-button {
            flex: 1 1 100%;
            min-width: 100%;
          }

          .input-mode-tab {
            padding: var(--space-2);
          }

          .mode-tab {
            padding: var(--space-2);
          }
        }
      `})]})}const Mv=t=>{let e;const r=new Set,n=(u,d)=>{const h=typeof u=="function"?u(e):u;if(!Object.is(h,e)){const f=e;e=d??(typeof h!="object"||h===null)?h:Object.assign({},e,h),r.forEach(p=>p(e,f))}},i=()=>e,a={setState:n,getState:i,getInitialState:()=>l,subscribe:u=>(r.add(u),()=>r.delete(u))},l=e=t(n,i,a);return a},xB=t=>t?Mv(t):Mv,wB=t=>t;function _B(t,e=wB){const r=P.useSyncExternalStore(t.subscribe,P.useCallback(()=>e(t.getState()),[t,e]),P.useCallback(()=>e(t.getInitialState()),[t,e]));return P.useDebugValue(r),r}const Dv=t=>{const e=xB(t),r=n=>_B(e,n);return Object.assign(r,e),r},SB=t=>t?Dv(t):Dv,Lv={BASE_URL:"/",DEV:!1,MODE:"production",PROD:!0,SSR:!1},Da=new Map,zl=t=>{const e=Da.get(t);return e?Object.fromEntries(Object.entries(e.stores).map(([r,n])=>[r,n.getState()])):{}},kB=(t,e,r)=>{if(t===void 0)return{type:"untracked",connection:e.connect(r)};const n=Da.get(r.name);if(n)return{type:"tracked",store:t,...n};const i={connection:e.connect(r),stores:{}};return Da.set(r.name,i),{type:"tracked",store:t,...i}},jB=(t,e)=>{if(e===void 0)return;const r=Da.get(t);r&&(delete r.stores[e],Object.keys(r.stores).length===0&&Da.delete(t))},EB=t=>{var e,r;if(!t)return;const n=t.split(`
`),i=n.findIndex(s=>s.includes("api.setState"));if(i<0)return;const o=((e=n[i+1])==null?void 0:e.trim())||"";return(r=/.+ (.+) .+/.exec(o))==null?void 0:r[1]},CB=(t,e={})=>(r,n,i)=>{const{enabled:o,anonymousActionType:s,store:a,...l}=e;let u;try{u=(o??(Lv?"production":void 0)!=="production")&&window.__REDUX_DEVTOOLS_EXTENSION__}catch{}if(!u)return t(r,n,i);const{connection:d,...h}=kB(a,u,l);let f=!0;i.setState=(g,b,m)=>{const y=r(g,b);if(!f)return y;const x=m===void 0?{type:s||EB(new Error().stack)||"anonymous"}:typeof m=="string"?{type:m}:m;return a===void 0?(d==null||d.send(x,n()),y):(d==null||d.send({...x,type:`${a}/${x.type}`},{...zl(l.name),[a]:i.getState()}),y)},i.devtools={cleanup:()=>{d&&typeof d.unsubscribe=="function"&&d.unsubscribe(),jB(l.name,a)}};const p=(...g)=>{const b=f;f=!1,r(...g),f=b},v=t(i.setState,n,i);if(h.type==="untracked"?d==null||d.init(v):(h.stores[h.store]=i,d==null||d.init(Object.fromEntries(Object.entries(h.stores).map(([g,b])=>[g,g===h.store?v:b.getState()])))),i.dispatchFromDevtools&&typeof i.dispatch=="function"){let g=!1;const b=i.dispatch;i.dispatch=(...m)=>{(Lv?"production":void 0)!=="production"&&m[0].type==="__setState"&&!g&&(console.warn('[zustand devtools middleware] "__setState" action type is reserved to set state from the devtools. Avoid using it.'),g=!0),b(...m)}}return d.subscribe(g=>{var b;switch(g.type){case"ACTION":if(typeof g.payload!="string"){console.error("[zustand devtools middleware] Unsupported action format");return}return kd(g.payload,m=>{if(m.type==="__setState"){if(a===void 0){p(m.state);return}Object.keys(m.state).length!==1&&console.error(`
                    [zustand devtools middleware] Unsupported __setState action format.
                    When using 'store' option in devtools(), the 'state' should have only one key, which is a value of 'store' that was passed in devtools(),
                    and value of this only key should be a state object. Example: { "type": "__setState", "state": { "abc123Store": { "foo": "bar" } } }
                    `);const y=m.state[a];if(y==null)return;JSON.stringify(i.getState())!==JSON.stringify(y)&&p(y);return}i.dispatchFromDevtools&&typeof i.dispatch=="function"&&i.dispatch(m)});case"DISPATCH":switch(g.payload.type){case"RESET":return p(v),a===void 0?d==null?void 0:d.init(i.getState()):d==null?void 0:d.init(zl(l.name));case"COMMIT":if(a===void 0){d==null||d.init(i.getState());return}return d==null?void 0:d.init(zl(l.name));case"ROLLBACK":return kd(g.state,m=>{if(a===void 0){p(m),d==null||d.init(i.getState());return}p(m[a]),d==null||d.init(zl(l.name))});case"JUMP_TO_STATE":case"JUMP_TO_ACTION":return kd(g.state,m=>{if(a===void 0){p(m);return}JSON.stringify(i.getState())!==JSON.stringify(m[a])&&p(m[a])});case"IMPORT_STATE":{const{nextLiftedState:m}=g.payload,y=(b=m.computedStates.slice(-1)[0])==null?void 0:b.state;if(!y)return;p(a===void 0?y:y[a]),d==null||d.send(null,m);return}case"PAUSE_RECORDING":return f=!f}return}}),v},TB=CB,kd=(t,e)=>{let r;try{r=JSON.parse(t)}catch(n){console.error("[zustand devtools middleware] Could not parse the received json",n)}r!==void 0&&e(r)},jd={surface:{width_mm:28e3,length_mm:15e3,color:{tpv_code:"RH12",hex:"#006C55",name:"Dark Green"}},courts:{},courtOrder:[],selectedCourtId:null,customMarkings:[],backgroundZones:[],designName:"Untitled Sports Surface",designDescription:"",designTags:[],history:[],historyIndex:-1,maxHistory:50,showCourtLibrary:!0,showPropertiesPanel:!0,showColorEditor:!1,snapToGrid:!0,gridSize_mm:100,isSaving:!1,lastSaved:null},Yr=SB(TB((t,e)=>({...jd,setSurfaceDimensions:(r,n)=>{t(i=>({surface:{...i.surface,width_mm:r,length_mm:n}})),e().addToHistory()},setSurfaceColor:r=>{t(n=>({surface:{...n.surface,color:r}})),e().addToHistory()},addCourt:(r,n)=>{const i=`court-${Date.now()}`,o={id:i,templateId:r,template:n,position:{x:e().surface.width_mm/2-n.dimensions.width_mm/2,y:e().surface.length_mm/2-n.dimensions.length_mm/2},rotation:0,scale:1,lineColorOverrides:{},zoneColorOverrides:{}};t(s=>({courts:{...s.courts,[i]:o},courtOrder:[...s.courtOrder,i],selectedCourtId:i})),e().addToHistory()},removeCourt:r=>{const{[r]:n,...i}=e().courts;t(o=>({courts:i,courtOrder:o.courtOrder.filter(s=>s!==r),selectedCourtId:o.selectedCourtId===r?null:o.selectedCourtId})),e().addToHistory()},updateCourtPosition:(r,n)=>{t(i=>({courts:{...i.courts,[r]:{...i.courts[r],position:n}}}))},updateCourtRotation:(r,n)=>{t(i=>({courts:{...i.courts,[r]:{...i.courts[r],rotation:n}}}))},updateCourtScale:(r,n)=>{t(i=>({courts:{...i.courts,[r]:{...i.courts[r],scale:n}}}))},duplicateCourt:r=>{const n=e().courts[r];if(!n)return;const i=`court-${Date.now()}`,o={...n,id:i,position:{x:n.position.x+500,y:n.position.y+500}};t(s=>({courts:{...s.courts,[i]:o},courtOrder:[...s.courtOrder,i],selectedCourtId:i})),e().addToHistory()},setLineColor:(r,n,i)=>{t(o=>({courts:{...o.courts,[r]:{...o.courts[r],lineColorOverrides:{...o.courts[r].lineColorOverrides,[n]:i}}}})),e().addToHistory()},setZoneColor:(r,n,i)=>{t(o=>({courts:{...o.courts,[r]:{...o.courts[r],zoneColorOverrides:{...o.courts[r].zoneColorOverrides,[n]:i}}}})),e().addToHistory()},resetCourtColors:r=>{t(n=>({courts:{...n.courts,[r]:{...n.courts[r],lineColorOverrides:{},zoneColorOverrides:{}}}})),e().addToHistory()},selectCourt:r=>{t({selectedCourtId:r})},deselectCourt:()=>{t({selectedCourtId:null})},setCourtOrder:r=>{t({courtOrder:r})},addCustomMarking:r=>{t(n=>({customMarkings:[...n.customMarkings,{...r,id:`custom-${Date.now()}`}]})),e().addToHistory()},removeCustomMarking:r=>{t(n=>({customMarkings:n.customMarkings.filter(i=>i.id!==r)})),e().addToHistory()},addBackgroundZone:r=>{t(n=>({backgroundZones:[...n.backgroundZones,{...r,id:`zone-${Date.now()}`}]})),e().addToHistory()},removeBackgroundZone:r=>{t(n=>({backgroundZones:n.backgroundZones.filter(i=>i.id!==r)})),e().addToHistory()},setDesignName:r=>{t({designName:r})},setDesignDescription:r=>{t({designDescription:r})},setDesignTags:r=>{t({designTags:r})},addToHistory:()=>{const r=e(),n={surface:r.surface,courts:r.courts,courtOrder:r.courtOrder,customMarkings:r.customMarkings,backgroundZones:r.backgroundZones};t(i=>{const o=i.history.slice(0,i.historyIndex+1);return o.push(n),o.length>i.maxHistory&&o.shift(),{history:o,historyIndex:o.length-1}})},undo:()=>{const{history:r,historyIndex:n}=e();if(n>0){const i=r[n-1];t({...i,historyIndex:n-1})}},redo:()=>{const{history:r,historyIndex:n}=e();if(n<r.length-1){const i=r[n+1];t({...i,historyIndex:n+1})}},canUndo:()=>e().historyIndex>0,canRedo:()=>e().historyIndex<e().history.length-1,toggleCourtLibrary:()=>{t(r=>({showCourtLibrary:!r.showCourtLibrary}))},togglePropertiesPanel:()=>{t(r=>({showPropertiesPanel:!r.showPropertiesPanel}))},toggleColorEditor:()=>{t(r=>({showColorEditor:!r.showColorEditor}))},toggleSnapToGrid:()=>{t(r=>({snapToGrid:!r.snapToGrid}))},setGridSize:r=>{t({gridSize_mm:r})},setSaving:r=>{t({isSaving:r})},setLastSaved:r=>{t({lastSaved:r})},loadDesign:r=>{t({surface:r.surface||jd.surface,courts:r.courts||{},courtOrder:r.courtOrder||[],customMarkings:r.customMarkings||[],backgroundZones:r.backgroundZones||[],designName:r.name||"Untitled Sports Surface",designDescription:r.description||"",designTags:r.tags||[],selectedCourtId:null,history:[],historyIndex:-1}),e().addToHistory()},exportDesignData:()=>{const r=e();return{surface:r.surface,courts:r.courts,courtOrder:r.courtOrder,customMarkings:r.customMarkings,backgroundZones:r.backgroundZones,name:r.designName,description:r.designDescription,tags:r.designTags}},resetDesign:()=>{t(jd)}}),{name:"SportsDesignStore"})),O1={"basketball-full":{id:"basketball-full",name:"Basketball (Full Court)",sport:"basketball",standard:"FIBA 2020",category:"court",description:"Official FIBA standard full basketball court with all markings",dimensions:{length_mm:28e3,width_mm:15e3,min_surround_mm:2e3},defaultLineColor:"RH31",defaultLineWidth_mm:50,markings:[{id:"boundary",name:"Boundary Lines",type:"rectangle",params:{x:0,y:0,width:15e3,height:28e3},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"boundary"},{id:"center-line",name:"Center Line",type:"line",params:{x1:0,y1:14e3,x2:15e3,y2:14e3},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"center-circle",name:"Center Circle",type:"circle",params:{cx:7500,cy:14e3,radius:1800},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"three-point-arc-top",name:"Three-Point Arc (Top)",type:"arc",params:{cx:7500,cy:26425,radius:6750,startAngle:192,endAngle:348},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"three-point-arc-bottom",name:"Three-Point Arc (Bottom)",type:"arc",params:{cx:7500,cy:1575,radius:6750,startAngle:12,endAngle:168},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"three-point-line-bottom-left",name:"Three-Point Line Bottom Left",type:"line",params:{x1:900,y1:0,x2:900,y2:2990},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"three-point-line-bottom-right",name:"Three-Point Line Bottom Right",type:"line",params:{x1:14100,y1:0,x2:14100,y2:2990},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"three-point-line-top-left",name:"Three-Point Line Top Left",type:"line",params:{x1:900,y1:25010,x2:900,y2:28e3},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"three-point-line-top-right",name:"Three-Point Line Top Right",type:"line",params:{x1:14100,y1:25010,x2:14100,y2:28e3},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"free-throw-line-top",name:"Free Throw Line (Top)",type:"line",params:{x1:5050,y1:22200,x2:9950,y2:22200},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"free-throw-line-bottom",name:"Free Throw Line (Bottom)",type:"line",params:{x1:5050,y1:5800,x2:9950,y2:5800},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"free-throw-circle-top",name:"Free Throw Circle (Top)",type:"circle",params:{cx:7500,cy:22200,radius:1800},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"free-throw-circle-bottom",name:"Free Throw Circle (Bottom)",type:"circle",params:{cx:7500,cy:5800,radius:1800},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"key-lane-top",name:"Key Lane (Top)",type:"rectangle",params:{x:5050,y:22200,width:4900,height:5800},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"key-lane-bottom",name:"Key Lane (Bottom)",type:"rectangle",params:{x:5050,y:0,width:4900,height:5800},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"restricted-area-top",name:"Restricted Area (Top)",type:"arc",params:{cx:7500,cy:28e3,radius:1250,startAngle:180,endAngle:360},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"restricted-area-bottom",name:"Restricted Area (Bottom)",type:"arc",params:{cx:7500,cy:0,radius:1250,startAngle:0,endAngle:180},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"}],zones:[{id:"key-area-top",name:"Key Area (Top)",type:"rectangle",params:{x:5050,y:22200,width:4900,height:5800},defaultColor:"RH20",paintable:!0,area_m2:28.42},{id:"key-area-bottom",name:"Key Area (Bottom)",type:"rectangle",params:{x:5050,y:0,width:4900,height:5800},defaultColor:"RH20",paintable:!0,area_m2:28.42}]},"netball-full":{id:"netball-full",name:"Netball (Full Court)",sport:"netball",standard:"World Netball 2020",category:"court",description:"Official World Netball standard court with goal circles and thirds",dimensions:{length_mm:30500,width_mm:15250,min_surround_mm:3050},defaultLineColor:"RH31",defaultLineWidth_mm:50,markings:[{id:"boundary",name:"Boundary Lines",type:"rectangle",params:{x:0,y:0,width:15250,height:30500},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"boundary"},{id:"transverse-line-1",name:"Transverse Line 1",type:"line",params:{x1:0,y1:10167,x2:15250,y2:10167},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"transverse-line-2",name:"Transverse Line 2",type:"line",params:{x1:0,y1:20333,x2:15250,y2:20333},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"center-circle",name:"Center Circle",type:"circle",params:{cx:7625,cy:15250,radius:450},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"goal-circle-bottom",name:"Goal Circle (Bottom)",type:"arc",params:{cx:7625,cy:0,radius:4900,startAngle:0,endAngle:180},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"goal-circle-top",name:"Goal Circle (Top)",type:"arc",params:{cx:7625,cy:30500,radius:4900,startAngle:180,endAngle:360},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"}],zones:[]},"tennis-doubles":{id:"tennis-doubles",name:"Tennis (Doubles)",sport:"tennis",standard:"ITF 2020",category:"court",description:"Official ITF standard doubles tennis court with all service boxes",dimensions:{length_mm:23770,width_mm:10970,min_surround_mm:3660},defaultLineColor:"RH31",defaultLineWidth_mm:50,markings:[{id:"boundary",name:"Boundary Lines",type:"rectangle",params:{x:0,y:0,width:10970,height:23770},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"boundary"},{id:"singles-sideline-left",name:"Singles Sideline (Left)",type:"line",params:{x1:1370,y1:0,x2:1370,y2:23770},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"singles-sideline-right",name:"Singles Sideline (Right)",type:"line",params:{x1:9600,y1:0,x2:9600,y2:23770},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"service-line-bottom",name:"Service Line (Bottom)",type:"line",params:{x1:0,y1:6400,x2:10970,y2:6400},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"service-line-top",name:"Service Line (Top)",type:"line",params:{x1:0,y1:17370,x2:10970,y2:17370},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"center-service-line",name:"Center Service Line",type:"line",params:{x1:5485,y1:6400,x2:5485,y2:17370},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"center-mark-bottom",name:"Center Mark (Bottom)",type:"line",params:{x1:5485,y1:0,x2:5485,y2:100},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"center-mark-top",name:"Center Mark (Top)",type:"line",params:{x1:5485,y1:23670,x2:5485,y2:23770},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"}],zones:[]},"futsal-standard":{id:"futsal-standard",name:"Futsal (5-a-side)",sport:"futsal",standard:"FIFA 2020",category:"court",description:"Official FIFA standard futsal court for international matches",dimensions:{length_mm:4e4,width_mm:2e4,min_surround_mm:1e3},defaultLineColor:"RH31",defaultLineWidth_mm:80,markings:[{id:"boundary",name:"Boundary Lines",type:"rectangle",params:{x:0,y:0,width:2e4,height:4e4},defaultColor:"RH31",lineWidth_mm:80,required:!0,category:"boundary"},{id:"center-line",name:"Center Line",type:"line",params:{x1:0,y1:2e4,x2:2e4,y2:2e4},defaultColor:"RH31",lineWidth_mm:80,required:!0,category:"court-marking"},{id:"center-circle",name:"Center Circle",type:"circle",params:{cx:1e4,cy:2e4,radius:3e3},defaultColor:"RH31",lineWidth_mm:80,required:!0,category:"court-marking"},{id:"center-spot",name:"Center Spot",type:"circle",params:{cx:1e4,cy:2e4,radius:100},defaultColor:"RH31",lineWidth_mm:80,required:!0,category:"court-marking"},{id:"penalty-area-bottom",name:"Penalty Area (Bottom)",type:"arc",params:{cx:1e4,cy:0,radius:6e3,startAngle:0,endAngle:180},defaultColor:"RH31",lineWidth_mm:80,required:!0,category:"court-marking"},{id:"penalty-area-top",name:"Penalty Area (Top)",type:"arc",params:{cx:1e4,cy:4e4,radius:6e3,startAngle:180,endAngle:360},defaultColor:"RH31",lineWidth_mm:80,required:!0,category:"court-marking"},{id:"penalty-mark-bottom",name:"Penalty Mark (Bottom)",type:"circle",params:{cx:1e4,cy:6e3,radius:100},defaultColor:"RH31",lineWidth_mm:80,required:!0,category:"court-marking"},{id:"penalty-mark-top",name:"Penalty Mark (Top)",type:"circle",params:{cx:1e4,cy:34e3,radius:100},defaultColor:"RH31",lineWidth_mm:80,required:!0,category:"court-marking"},{id:"second-penalty-mark-bottom",name:"Second Penalty Mark (Bottom)",type:"circle",params:{cx:1e4,cy:1e4,radius:100},defaultColor:"RH31",lineWidth_mm:80,required:!0,category:"court-marking"},{id:"second-penalty-mark-top",name:"Second Penalty Mark (Top)",type:"circle",params:{cx:1e4,cy:3e4,radius:100},defaultColor:"RH31",lineWidth_mm:80,required:!0,category:"court-marking"},{id:"corner-arc-bl",name:"Corner Arc (Bottom Left)",type:"arc",params:{cx:0,cy:0,radius:250,startAngle:0,endAngle:90},defaultColor:"RH31",lineWidth_mm:80,required:!0,category:"court-marking"},{id:"corner-arc-br",name:"Corner Arc (Bottom Right)",type:"arc",params:{cx:2e4,cy:0,radius:250,startAngle:90,endAngle:180},defaultColor:"RH31",lineWidth_mm:80,required:!0,category:"court-marking"},{id:"corner-arc-tl",name:"Corner Arc (Top Left)",type:"arc",params:{cx:0,cy:4e4,radius:250,startAngle:270,endAngle:360},defaultColor:"RH31",lineWidth_mm:80,required:!0,category:"court-marking"},{id:"corner-arc-tr",name:"Corner Arc (Top Right)",type:"arc",params:{cx:2e4,cy:4e4,radius:250,startAngle:180,endAngle:270},defaultColor:"RH31",lineWidth_mm:80,required:!0,category:"court-marking"}],zones:[]}};function NB(){return Object.values(O1)}function OB(t){return O1[t]||null}function RB(t,e,r){const{type:n,params:i}=t;switch(n){case"line":return PB(i,e,r);case"rectangle":return $B(i,e,r);case"circle":return IB(i,e,r);case"arc":return MB(i,e,r);case"polyline":return DB(i,e,r);default:return console.warn(`Unknown marking type: ${n}`),null}}function AB(t,e){const{type:r,params:n}=t;switch(r){case"rectangle":return{type:"rect",x:n.x,y:n.y,width:n.width,height:n.height,fill:e};case"circle":return{type:"circle",cx:n.cx,cy:n.cy,r:n.radius,fill:e};case"polygon":return{type:"polygon",points:n.points,fill:e};default:return console.warn(`Unknown zone type: ${r}`),null}}function PB(t,e,r){return{type:"line",x1:t.x1,y1:t.y1,x2:t.x2,y2:t.y2,stroke:e,strokeWidth:r}}function $B(t,e,r){return{type:"rect",x:t.x,y:t.y,width:t.width,height:t.height,stroke:e,strokeWidth:r,fill:"none"}}function IB(t,e,r){return{type:"circle",cx:t.cx,cy:t.cy,r:t.radius,stroke:e,strokeWidth:r,fill:"none"}}function MB(t,e,r){const{cx:n,cy:i,radius:o,startAngle:s,endAngle:a}=t,l=s*Math.PI/180,u=a*Math.PI/180,d=n+o*Math.cos(l),h=i+o*Math.sin(l),f=n+o*Math.cos(u),p=i+o*Math.sin(u),v=a-s>180?1:0;return{type:"path",d:`M ${d} ${h} A ${o} ${o} 0 ${v} 1 ${f} ${p}`,stroke:e,strokeWidth:r,fill:"none"}}function DB(t,e,r){return{type:"polyline",points:t.points.map(i=>`${i[0]},${i[1]}`).join(" "),stroke:e,strokeWidth:r,fill:"none"}}function zv(t){if(t&&t.startsWith("#"))return t;const e=$i.find(r=>r.code===t);return e?e.hex:"#000000"}function LB(t){var s;const{template:e,lineColorOverrides:r,zoneColorOverrides:n}=t;if(!e)return console.error("No template provided for court"),{markings:[],zones:[]};const i=e.markings.map(a=>{var h;const l=((h=r[a.id])==null?void 0:h.hex)||e.defaultLineColor,u=zv(l),d=a.lineWidth_mm||e.defaultLineWidth_mm;return{id:a.id,name:a.name,...RB(a,u,d)}}).filter(Boolean),o=((s=e.zones)==null?void 0:s.map(a=>{var d;const l=((d=n[a.id])==null?void 0:d.hex)||a.defaultColor,u=zv(l);return{id:a.id,name:a.name,...AB(a,u)}}).filter(Boolean))||[];return{markings:i,zones:o}}function Fv(t,e){return Math.round(t/e)*e}function zB(t,e){return{x:Fv(t.x,e),y:Fv(t.y,e)}}function FB(t,e,r){const{width_mm:n,length_mm:i}=e,{width_mm:o,length_mm:s}=r;return{x:Math.max(0,Math.min(t.x,o-n)),y:Math.max(0,Math.min(t.y,s-i))}}function BB(t){const{position:e,rotation:r,scale:n,template:i}=t,o=i.dimensions.width_mm/2,s=i.dimensions.length_mm/2;return`translate(${e.x}, ${e.y}) rotate(${r}, ${o}, ${s}) scale(${n})`}function UB(){const t=$.useRef(null),[e,r]=$.useState(!1),[n,i]=$.useState(null),[o,s]=$.useState(null),{surface:a,courts:l,courtOrder:u,selectedCourtId:d,snapToGrid:h,gridSize_mm:f,selectCourt:p,deselectCourt:v,updateCourtPosition:g}=Yr(),b=(x,w)=>{const j=t.current,S=j.createSVGPoint();S.x=x,S.y=w;const C=S.matrixTransform(j.getScreenCTM().inverse());return{x:C.x,y:C.y}},m=(x,w)=>{x.stopPropagation(),p(w);const j=b(x.clientX,x.clientY),S=l[w];i({x:j.x-S.position.x,y:j.y-S.position.y}),s(w),r(!0)};$.useEffect(()=>{r(!1),s(null),i(null)},[a.width_mm,a.length_mm]),$.useEffect(()=>{if(!e||!o)return;const x=j=>{const S=b(j.clientX,j.clientY);let C={x:S.x-n.x,y:S.y-n.y};h&&(C=zB(C,f));const N=l[o],E={width_mm:N.template.dimensions.width_mm*N.scale,length_mm:N.template.dimensions.length_mm*N.scale};C=FB(C,E,a),g(o,C)},w=()=>{if(o){const{addToHistory:j}=Yr.getState();j()}r(!1),s(null),i(null)};return window.addEventListener("mousemove",x),window.addEventListener("mouseup",w),()=>{window.removeEventListener("mousemove",x),window.removeEventListener("mouseup",w)}},[e,o,n,l,h,f,a,g]);const y=x=>{x.target===x.currentTarget&&v()};return c.jsxs("div",{className:"court-canvas",onClick:y,children:[c.jsxs("svg",{ref:t,className:"court-canvas__svg",viewBox:`0 0 ${a.width_mm} ${a.length_mm}`,preserveAspectRatio:"xMidYMid meet",children:[c.jsx("rect",{x:"0",y:"0",width:a.width_mm,height:a.length_mm,fill:a.color.hex,className:"court-canvas__surface"}),u.map(x=>{const w=l[x];return w?c.jsx(HB,{court:w,isSelected:x===d,onMouseDown:j=>m(j,x)},x):null})]}),c.jsxs("div",{className:"court-canvas__info",children:[c.jsxs("span",{children:[(a.width_mm/1e3).toFixed(1),"m × ",(a.length_mm/1e3).toFixed(1),"m"]}),h&&c.jsxs("span",{className:"court-canvas__grid-indicator",children:["Grid: ",f,"mm"]})]})]})}function HB({court:t,isSelected:e,onMouseDown:r}){const{markings:n,zones:i}=LB(t);return c.jsxs("g",{className:`court-canvas__court ${e?"court-canvas__court--selected":""}`,transform:BB(t),style:{cursor:"move"},children:[c.jsx("rect",{x:"0",y:"0",width:t.template.dimensions.width_mm,height:t.template.dimensions.length_mm,fill:"transparent",onMouseDown:r,style:{cursor:"move"}}),i.map(o=>c.jsx(GB,{zone:o},o.id)),n.map(o=>c.jsx(WB,{marking:o},o.id)),e&&c.jsx("rect",{x:"0",y:"0",width:t.template.dimensions.width_mm,height:t.template.dimensions.length_mm,fill:"none",stroke:"#007bff",strokeWidth:"50",strokeDasharray:"200 200",className:"court-canvas__selection-outline"})]})}function GB({zone:t}){switch(t.type){case"rect":return c.jsx("rect",{x:t.x,y:t.y,width:t.width,height:t.height,fill:t.fill});case"circle":return c.jsx("circle",{cx:t.cx,cy:t.cy,r:t.r,fill:t.fill});case"polygon":return c.jsx("polygon",{points:t.points,fill:t.fill});default:return null}}function WB({marking:t}){switch(t.type){case"line":return c.jsx("line",{x1:t.x1,y1:t.y1,x2:t.x2,y2:t.y2,stroke:t.stroke,strokeWidth:t.strokeWidth});case"rect":return c.jsx("rect",{x:t.x,y:t.y,width:t.width,height:t.height,stroke:t.stroke,strokeWidth:t.strokeWidth,fill:t.fill});case"circle":return c.jsx("circle",{cx:t.cx,cy:t.cy,r:t.r,stroke:t.stroke,strokeWidth:t.strokeWidth,fill:t.fill});case"path":return c.jsx("path",{d:t.d,stroke:t.stroke,strokeWidth:t.strokeWidth,fill:t.fill});case"polyline":return c.jsx("polyline",{points:t.points,stroke:t.stroke,strokeWidth:t.strokeWidth,fill:t.fill});default:return null}}function VB(){const[t,e]=$.useState(null),{addCourt:r}=Yr(),n=NB(),i=o=>{const s=OB(o);s&&r(o,s)};return c.jsxs("div",{className:"court-library",children:[c.jsxs("div",{className:"court-library__header",children:[c.jsx("h2",{children:"Court Library"}),c.jsx("p",{children:"Select a court to add to your surface"})]}),c.jsx("div",{className:"court-library__list",children:n.map(o=>c.jsxs("div",{className:`court-library__item ${t===o.id?"court-library__item--selected":""}`,onClick:()=>e(o.id),onDoubleClick:()=>i(o.id),children:[c.jsx("div",{className:"court-library__preview",children:c.jsx(qB,{template:o})}),c.jsxs("div",{className:"court-library__info",children:[c.jsx("h3",{className:"court-library__name",children:o.name}),c.jsxs("p",{className:"court-library__dimensions",children:[(o.dimensions.width_mm/1e3).toFixed(1),"m × ",(o.dimensions.length_mm/1e3).toFixed(1),"m"]}),c.jsx("p",{className:"court-library__standard",children:o.standard})]}),t===o.id&&c.jsx("button",{className:"court-library__add-btn",onClick:s=>{s.stopPropagation(),i(o.id)},children:"+ Add to Surface"})]},o.id))}),c.jsx("div",{className:"court-library__footer",children:c.jsx("p",{className:"court-library__hint",children:"💡 Double-click a court to add it instantly"})})]})}function qB({template:t}){const e=t.dimensions.width_mm,r=t.dimensions.length_mm,n=Math.min(110/e,110/r),i=e*n,o=r*n;return c.jsxs("svg",{width:"120",height:"120",viewBox:"0 0 120 120",className:"court-library__svg-preview",children:[c.jsx("rect",{x:(120-i)/2,y:(120-o)/2,width:i,height:o,fill:"#e8f5e9",stroke:"#006C55",strokeWidth:"1"}),t.markings.slice(0,5).map((s,a)=>c.jsx(KB,{marking:s,scale:n,offsetX:(120-i)/2,offsetY:(120-o)/2},a))]})}function KB({marking:t,scale:e,offsetX:r,offsetY:n}){const{type:i,params:o}=t;switch(i){case"line":return c.jsx("line",{x1:o.x1*e+r,y1:o.y1*e+n,x2:o.x2*e+r,y2:o.y2*e+n,stroke:"#fff",strokeWidth:"1"});case"rectangle":return c.jsx("rect",{x:o.x*e+r,y:o.y*e+n,width:o.width*e,height:o.height*e,stroke:"#fff",strokeWidth:"1",fill:"none"});case"circle":return c.jsx("circle",{cx:o.cx*e+r,cy:o.cy*e+n,r:o.radius*e,stroke:"#fff",strokeWidth:"1",fill:"none"});case"arc":{const{cx:s,cy:a,radius:l,startAngle:u,endAngle:d}=o,h=u*Math.PI/180,f=d*Math.PI/180,p=(s+l*Math.cos(h))*e+r,v=(a+l*Math.sin(h))*e+n,g=(s+l*Math.cos(f))*e+r,b=(a+l*Math.sin(f))*e+n,m=d-u>180?1:0,y=`M ${p} ${v} A ${l*e} ${l*e} 0 ${m} 1 ${g} ${b}`;return c.jsx("path",{d:y,stroke:"#fff",strokeWidth:"1",fill:"none"})}default:return null}}function YB(){const{courts:t,selectedCourtId:e,updateCourtPosition:r,updateCourtRotation:n,updateCourtScale:i,setLineColor:o,setZoneColor:s,resetCourtColors:a}=Yr(),[l,u]=$.useState("transform"),[d,h]=$.useState(null);if(!e)return c.jsx("div",{className:"properties-panel properties-panel--empty",children:c.jsxs("div",{className:"properties-panel__empty-state",children:[c.jsx("p",{children:"No court selected"}),c.jsx("span",{className:"properties-panel__hint",children:"Click on a court to view and edit its properties"})]})});const f=t[e];if(!f)return null;const{position:p,rotation:v,scale:g,template:b,lineColorOverrides:m,zoneColorOverrides:y}=f,x=(E,A)=>{const U=parseFloat(A);isNaN(U)||r(e,{...p,[E]:U})},w=E=>{const A=parseFloat(E);isNaN(A)||n(e,A)},j=E=>{const A=parseFloat(E);isNaN(A)||A<=0||i(e,A)},S=E=>{d&&(d.type==="line"?o(e,d.id,{tpv_code:E.code,hex:E.hex,name:E.name}):d.type==="zone"&&s(e,d.id,{tpv_code:E.code,hex:E.hex,name:E.name}),h(null))},C=E=>{const A=m[E.id];if(A)return{code:A.tpv_code,hex:A.hex,name:A.name};const U=$i.find(O=>O.code===b.defaultLineColor);return U?{code:U.code,hex:U.hex,name:U.name}:null},N=E=>{const A=y[E.id];if(A)return{code:A.tpv_code,hex:A.hex,name:A.name};const U=$i.find(O=>O.code===E.defaultColor);return U?{code:U.code,hex:U.hex,name:U.name}:null};return c.jsxs("div",{className:"properties-panel",children:[c.jsxs("div",{className:"properties-panel__header",children:[c.jsx("h3",{children:"Properties"}),c.jsxs("div",{className:"properties-panel__court-info",children:[c.jsx("span",{className:"court-name",children:b.name}),c.jsx("span",{className:"court-standard",children:b.standard})]})]}),c.jsxs("div",{className:"properties-panel__tabs",children:[c.jsx("button",{className:`tab ${l==="transform"?"tab--active":""}`,onClick:()=>u("transform"),children:"Transform"}),c.jsx("button",{className:`tab ${l==="lines"?"tab--active":""}`,onClick:()=>u("lines"),children:"Lines"}),c.jsx("button",{className:`tab ${l==="zones"?"tab--active":""}`,onClick:()=>u("zones"),children:"Zones"})]}),c.jsxs("div",{className:"properties-panel__content",children:[l==="transform"&&c.jsxs("div",{className:"properties-section",children:[c.jsx("div",{className:"properties-section__header",children:c.jsx("h4",{children:"Transform"})}),c.jsxs("div",{className:"property-group",children:[c.jsx("label",{children:"Position"}),c.jsxs("div",{className:"property-input-row",children:[c.jsxs("div",{className:"property-input-group",children:[c.jsx("span",{className:"property-label",children:"X"}),c.jsx("input",{type:"number",value:Math.round(p.x),onChange:E=>x("x",E.target.value),step:"100"}),c.jsx("span",{className:"property-unit",children:"mm"})]}),c.jsxs("div",{className:"property-input-group",children:[c.jsx("span",{className:"property-label",children:"Y"}),c.jsx("input",{type:"number",value:Math.round(p.y),onChange:E=>x("y",E.target.value),step:"100"}),c.jsx("span",{className:"property-unit",children:"mm"})]})]})]}),c.jsxs("div",{className:"property-group",children:[c.jsx("label",{children:"Rotation"}),c.jsxs("div",{className:"property-input-row",children:[c.jsx("input",{type:"range",min:"0",max:"360",value:v,onChange:E=>w(E.target.value),className:"property-slider"}),c.jsxs("div",{className:"property-input-group property-input-group--compact",children:[c.jsx("input",{type:"number",value:Math.round(v),onChange:E=>w(E.target.value),min:"0",max:"360"}),c.jsx("span",{className:"property-unit",children:"°"})]})]})]}),c.jsxs("div",{className:"property-group",children:[c.jsx("label",{children:"Scale"}),c.jsxs("div",{className:"property-input-row",children:[c.jsx("input",{type:"range",min:"0.5",max:"2.0",step:"0.1",value:g,onChange:E=>j(E.target.value),className:"property-slider"}),c.jsxs("div",{className:"property-input-group property-input-group--compact",children:[c.jsx("input",{type:"number",value:g.toFixed(2),onChange:E=>j(E.target.value),min:"0.5",max:"2.0",step:"0.1"}),c.jsx("span",{className:"property-unit",children:"×"})]})]})]}),c.jsxs("div",{className:"property-group property-group--info",children:[c.jsx("label",{children:"Dimensions"}),c.jsx("div",{className:"property-info",children:c.jsxs("span",{children:[(b.dimensions.width_mm*g/1e3).toFixed(1),"m × ",(b.dimensions.length_mm*g/1e3).toFixed(1),"m"]})})]})]}),l==="lines"&&c.jsxs("div",{className:"properties-section",children:[c.jsxs("div",{className:"properties-section__header",children:[c.jsx("h4",{children:"Line Markings"}),c.jsx("button",{className:"btn-reset",onClick:()=>a(e),title:"Reset all colors to defaults",children:"Reset"})]}),c.jsx("div",{className:"color-list",children:b.markings.map(E=>{const A=C(E);return c.jsxs("div",{className:"color-item",children:[c.jsxs("div",{className:"color-item__info",children:[c.jsx("span",{className:"color-item__name",children:E.name}),A&&c.jsx("span",{className:"color-item__code",children:A.code})]}),c.jsx("button",{className:"color-item__swatch",style:{backgroundColor:(A==null?void 0:A.hex)||"#000"},onClick:()=>h({type:"line",id:E.id}),title:(A==null?void 0:A.name)||"Select color"})]},E.id)})})]}),l==="zones"&&c.jsxs("div",{className:"properties-section",children:[c.jsx("div",{className:"properties-section__header",children:c.jsx("h4",{children:"Paint Zones"})}),b.zones&&b.zones.length>0?c.jsx("div",{className:"color-list",children:b.zones.map(E=>{var U;const A=N(E);return c.jsxs("div",{className:"color-item",children:[c.jsxs("div",{className:"color-item__info",children:[c.jsx("span",{className:"color-item__name",children:E.name}),c.jsxs("span",{className:"color-item__area",children:[((U=E.area_m2)==null?void 0:U.toFixed(1))||0," m²"]}),A&&c.jsx("span",{className:"color-item__code",children:A.code})]}),c.jsx("button",{className:"color-item__swatch",style:{backgroundColor:(A==null?void 0:A.hex)||"#000"},onClick:()=>h({type:"zone",id:E.id}),title:(A==null?void 0:A.name)||"Select color"})]},E.id)})}):c.jsx("div",{className:"properties-section__empty",children:c.jsx("p",{children:"This court has no paintable zones"})})]})]}),d&&c.jsx("div",{className:"color-picker-modal",onClick:()=>h(null),children:c.jsxs("div",{className:"color-picker-modal__content",onClick:E=>E.stopPropagation(),children:[c.jsxs("div",{className:"color-picker-modal__header",children:[c.jsx("h4",{children:"Select TPV Colour"}),c.jsx("button",{onClick:()=>h(null),children:"×"})]}),c.jsx("div",{className:"color-picker-grid",children:$i.map(E=>c.jsx("button",{className:"color-picker-swatch",style:{backgroundColor:E.hex},onClick:()=>S(E),title:`${E.code} - ${E.name}`,children:c.jsx("span",{className:"color-picker-swatch__code",children:E.code})},E.code))})]})})]})}function XB(){const[t,e]=$.useState(!0),[r,n]=$.useState("28"),[i,o]=$.useState("15"),{surface:s,courts:a,selectedCourtId:l,showCourtLibrary:u,toggleCourtLibrary:d,setSurfaceDimensions:h,setSurfaceColor:f}=Yr(),p=v=>{v.preventDefault();const g=parseFloat(r)*1e3,b=parseFloat(i)*1e3;g>0&&b>0&&(h(g,b),e(!1))};return $.useEffect(()=>{const v=g=>{const{removeCourt:b,deselectCourt:m,undo:y,redo:x,canUndo:w,canRedo:j,duplicateCourt:S,updateCourtPosition:C,courts:N,courtOrder:E,setCourtOrder:A,toggleSnapToGrid:U,snapToGrid:O,addToHistory:F}=Yr.getState();if(g.key==="Delete"&&l&&(g.preventDefault(),b(l)),g.key==="Escape"&&l&&m(),(g.ctrlKey||g.metaKey)&&g.key==="z"&&!g.shiftKey&&(g.preventDefault(),w()&&y()),(g.ctrlKey||g.metaKey)&&g.key==="z"&&g.shiftKey&&(g.preventDefault(),j()&&x()),(g.ctrlKey||g.metaKey)&&g.key==="d"&&l&&(g.preventDefault(),S(l)),l&&["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(g.key)){g.preventDefault();const k=N[l];if(!k)return;const W=g.shiftKey?10:100;let ie=0,J=0;g.key==="ArrowLeft"&&(ie=-W),g.key==="ArrowRight"&&(ie=W),g.key==="ArrowUp"&&(J=-W),g.key==="ArrowDown"&&(J=W),C(l,{x:k.position.x+ie,y:k.position.y+J}),F()}if(l&&(g.key==="["||g.key==="]")){g.preventDefault();const k=E.indexOf(l);if(k===-1)return;const W=[...E];g.key==="["&&k>0?([W[k],W[k-1]]=[W[k-1],W[k]],A(W),F()):g.key==="]"&&k<E.length-1&&([W[k],W[k+1]]=[W[k+1],W[k]],A(W),F())}(g.key==="g"||g.key==="G")&&(g.preventDefault(),U())};return window.addEventListener("keydown",v),()=>window.removeEventListener("keydown",v)},[l]),c.jsxs("div",{className:"sports-designer",children:[t&&c.jsx("div",{className:"sports-designer__modal-overlay",children:c.jsxs("div",{className:"sports-designer__modal",children:[c.jsx("h2",{children:"Create Sports Surface"}),c.jsx("p",{children:"Enter the dimensions of your sports surface"}),c.jsxs("form",{onSubmit:p,children:[c.jsxs("div",{className:"sports-designer__dimension-inputs",children:[c.jsxs("div",{className:"sports-designer__input-group",children:[c.jsx("label",{htmlFor:"width",children:"Width (metres)"}),c.jsx("input",{id:"width",type:"number",min:"5",max:"100",step:"0.5",value:r,onChange:v=>n(v.target.value),required:!0,autoFocus:!0})]}),c.jsx("span",{className:"sports-designer__dimension-separator",children:"×"}),c.jsxs("div",{className:"sports-designer__input-group",children:[c.jsx("label",{htmlFor:"length",children:"Length (metres)"}),c.jsx("input",{id:"length",type:"number",min:"5",max:"100",step:"0.5",value:i,onChange:v=>o(v.target.value),required:!0})]})]}),c.jsx("p",{className:"sports-designer__dimension-hint",children:"Common MUGA size: 28m × 15m (basketball) or 40m × 20m (futsal)"}),c.jsx("button",{type:"submit",className:"sports-designer__btn-primary",children:"Create Surface"})]})]})}),!t&&c.jsxs(c.Fragment,{children:[c.jsxs("div",{className:"sports-designer__toolbar",children:[c.jsxs("div",{className:"sports-designer__toolbar-left",children:[c.jsxs("button",{className:"sports-designer__toolbar-btn",onClick:d,title:"Toggle Court Library",children:[c.jsx("span",{className:"sports-designer__icon",children:"📚"}),u?"Hide":"Show"," Courts"]}),c.jsxs("div",{className:"sports-designer__surface-info",children:[c.jsx("span",{className:"sports-designer__label",children:"Surface:"}),c.jsxs("span",{className:"sports-designer__value",children:[(s.width_mm/1e3).toFixed(1),"m × ",(s.length_mm/1e3).toFixed(1),"m"]})]}),c.jsxs("div",{className:"sports-designer__court-count",children:[c.jsx("span",{className:"sports-designer__label",children:"Courts:"}),c.jsx("span",{className:"sports-designer__value",children:Object.keys(a).length})]})]}),c.jsxs("div",{className:"sports-designer__toolbar-right",children:[c.jsxs("button",{className:"sports-designer__toolbar-btn",onClick:()=>e(!0),title:"Change Surface Dimensions",children:[c.jsx("span",{className:"sports-designer__icon",children:"📏"}),"Resize"]}),c.jsxs("button",{className:"sports-designer__toolbar-btn",disabled:!Yr.getState().canUndo(),onClick:()=>Yr.getState().undo(),title:"Undo (Ctrl+Z)",children:[c.jsx("span",{className:"sports-designer__icon",children:"↶"}),"Undo"]}),c.jsxs("button",{className:"sports-designer__toolbar-btn",disabled:!Yr.getState().canRedo(),onClick:()=>Yr.getState().redo(),title:"Redo (Ctrl+Shift+Z)",children:[c.jsx("span",{className:"sports-designer__icon",children:"↷"}),"Redo"]})]})]}),c.jsxs("div",{className:"sports-designer__content",children:[u&&c.jsx("aside",{className:"sports-designer__sidebar",children:c.jsx(VB,{})}),c.jsx("main",{className:"sports-designer__canvas-container",children:c.jsx(UB,{})}),l&&c.jsx("aside",{className:"sports-designer__properties",children:c.jsx(YB,{})})]}),Object.keys(a).length===0&&c.jsx("div",{className:"sports-designer__empty-state",children:c.jsxs("div",{className:"sports-designer__empty-content",children:[c.jsx("h3",{children:"Add Your First Court"}),c.jsxs("p",{children:["Select a court from the library on the left to place it on your surface.",c.jsx("br",{}),"You can then move, rotate, and colour the court markings."]})]})})]})]})}function ZB({onSelectTool:t}){return c.jsx("div",{className:"tool-selection",children:c.jsxs("div",{className:"tool-selection__container",children:[c.jsxs("header",{className:"tool-selection__header",children:[c.jsx("h1",{children:"Welcome to TPV Studio"}),c.jsx("p",{children:"Choose a design tool to get started"})]}),c.jsxs("div",{className:"tool-selection__tools",children:[c.jsxs("div",{className:"tool-selection__card",onClick:()=>t("playground"),children:[c.jsx("div",{className:"tool-selection__icon",children:"🎨"}),c.jsx("h2",{children:"Playground Designer"}),c.jsx("p",{children:"AI-powered playground surface design with custom patterns and colours"}),c.jsxs("ul",{className:"tool-selection__features",children:[c.jsx("li",{children:"Generate designs from text prompts"}),c.jsx("li",{children:"Upload and vectorise your own artwork"}),c.jsx("li",{children:"21 TPV colours with blend options"}),c.jsx("li",{children:"Material quantity calculations"}),c.jsx("li",{children:"Professional PDF specifications"})]}),c.jsx("button",{className:"tool-selection__btn tool-selection__btn--primary",children:"Open Playground Designer"})]}),c.jsxs("div",{className:"tool-selection__card",onClick:()=>t("sports"),children:[c.jsx("div",{className:"tool-selection__icon",children:"⚽"}),c.jsx("h2",{children:"Sports Surface Designer"}),c.jsx("p",{children:"Professional MUGA and sports court layout with precise markings"}),c.jsxs("ul",{className:"tool-selection__features",children:[c.jsx("li",{children:"Standard court templates (Basketball, Netball, Tennis, Futsal)"}),c.jsx("li",{children:"Multi-court layouts with positioning"}),c.jsx("li",{children:"Customisable line colours and zones"}),c.jsx("li",{children:"Official dimensions from governing bodies"}),c.jsx("li",{children:"Material specifications and line marking plans"})]}),c.jsx("button",{className:"tool-selection__btn tool-selection__btn--secondary",children:"Open Sports Designer"})]})]}),c.jsx("footer",{className:"tool-selection__footer",children:c.jsxs("p",{children:["Need help deciding? ",c.jsx("a",{href:"mailto:support@rosehill.group",children:"Contact our team"})]})})]})})}function Bv({onShowDesigns:t,onShowAdmin:e,isAdmin:r,currentDesignName:n,onBackToTools:i}){const[o,s]=$.useState(!1),a=async()=>{confirm("Sign out?")&&(await mn.signOut(),window.location.reload())};return c.jsx("header",{className:"studio-header",children:c.jsxs("div",{className:"header-content",children:[c.jsxs("div",{className:"header-left",children:[c.jsx("h1",{className:"studio-title",children:"TPV Studio"}),n&&c.jsxs("span",{className:"current-design-indicator",children:[c.jsx("svg",{width:"4",height:"4",viewBox:"0 0 4 4",children:c.jsx("circle",{cx:"2",cy:"2",r:"2",fill:"currentColor"})}),n]})]}),c.jsxs("div",{className:"header-right",children:[i&&c.jsxs("button",{onClick:i,className:"btn-back-tools",children:[c.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:c.jsx("path",{d:"M19 12H5M12 19l-7-7 7-7"})}),"Back to Tools"]}),c.jsxs("button",{onClick:t,className:"btn-my-designs",children:[c.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[c.jsx("path",{d:"M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"}),c.jsx("path",{d:"M9 22V12h6v10"})]}),"My Designs"]}),r&&c.jsxs("button",{onClick:e,className:"btn-admin",children:[c.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[c.jsx("path",{d:"M12 15a3 3 0 100-6 3 3 0 000 6z"}),c.jsx("path",{d:"M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"})]}),"Admin"]}),c.jsxs("div",{className:"user-menu",children:[c.jsx("button",{onClick:()=>s(!o),className:"user-menu-button",children:c.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[c.jsx("path",{d:"M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"}),c.jsx("circle",{cx:"12",cy:"7",r:"4"})]})}),o&&c.jsxs(c.Fragment,{children:[c.jsx("div",{className:"user-menu-backdrop",onClick:()=>s(!1)}),c.jsx("div",{className:"user-menu-dropdown",children:c.jsxs("button",{onClick:a,className:"menu-item sign-out",children:[c.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:c.jsx("path",{d:"M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"})}),"Sign Out"]})})]})]})]})]})})}function JB({design:t,onLoad:e,onDelete:r,onUpdateMetadata:n}){const[i,o]=$.useState(!1),[s,a]=$.useState(!1),l=async()=>{if(confirm(`Delete "${t.name}"? This cannot be undone.`)){a(!0);try{await r(t.id)}catch(h){console.error("Failed to delete design:",h),alert(`Failed to delete: ${h.message}`),a(!1)}}},u=h=>{const f=new Date(h),p=new Date,v=p-f,g=Math.floor(v/(1e3*60*60*24));return g===0?"Today":g===1?"Yesterday":g<7?`${g} days ago`:g<30?`${Math.floor(g/7)} weeks ago`:f.toLocaleDateString("en-GB",{day:"numeric",month:"short",year:f.getFullYear()!==p.getFullYear()?"numeric":void 0})},d=t.thumbnail_url||t.original_png_url||t.original_svg_url;return c.jsxs("div",{className:`design-card ${s?"deleting":""}`,onMouseEnter:()=>o(!0),onMouseLeave:()=>o(!1),children:[c.jsxs("div",{className:"card-thumbnail",onClick:()=>e(t.id),children:[d?c.jsx("img",{src:d,alt:t.name}):c.jsx("div",{className:"no-thumbnail",children:c.jsxs("svg",{width:"48",height:"48",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[c.jsx("rect",{x:"3",y:"3",width:"18",height:"18",rx:"2",ry:"2"}),c.jsx("circle",{cx:"8.5",cy:"8.5",r:"1.5"}),c.jsx("polyline",{points:"21 15 16 10 5 21"})]})}),i&&c.jsx("div",{className:"thumbnail-overlay",children:c.jsx("button",{className:"btn-load",children:"Open Design"})})]}),c.jsxs("div",{className:"card-info",children:[c.jsx("h3",{className:"design-name",title:t.name,children:t.name}),t.description&&c.jsx("p",{className:"design-description",title:t.description,children:t.description}),c.jsxs("div",{className:"card-meta",children:[t.projects&&c.jsx("span",{className:"project-badge",style:{backgroundColor:t.projects.color||"#1a365d"},title:t.projects.name,children:t.projects.name}),c.jsx("span",{className:"design-date",title:new Date(t.updated_at).toLocaleString(),children:u(t.updated_at)})]}),t.tags&&t.tags.length>0&&c.jsxs("div",{className:"design-tags",children:[t.tags.slice(0,3).map((h,f)=>c.jsx("span",{className:"tag",children:h},f)),t.tags.length>3&&c.jsxs("span",{className:"tag more",children:["+",t.tags.length-3]})]})]}),i&&!s&&c.jsxs("div",{className:"card-actions",children:[c.jsx("button",{onClick:()=>e(t.id),className:"action-btn load-btn",title:"Load design",children:c.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[c.jsx("path",{d:"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"}),c.jsx("circle",{cx:"12",cy:"12",r:"3"})]})}),c.jsx("button",{onClick:l,className:"action-btn delete-btn",title:"Delete design",children:c.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:c.jsx("path",{d:"M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"})})})]}),s&&c.jsx("div",{className:"deleting-overlay",children:c.jsx("div",{className:"spinner"})})]})}function Uv({onClose:t,onLoadDesign:e}){const[r,n]=$.useState([]),[i,o]=$.useState([]),[s,a]=$.useState(!0),[l,u]=$.useState(null),[d,h]=$.useState(""),[f,p]=$.useState(""),[v,g]=$.useState(!1),[b,m]=$.useState(!1);$.useEffect(()=>{y()},[d,f]);const y=async()=>{a(!0),u(null);try{const[S,C]=await Promise.all([j1(),Ph({project_id:d||void 0,search:f||void 0,limit:12,offset:0})]);o(S.projects),n(C.designs),g(C.pagination.has_more)}catch(S){console.error("Failed to load designs:",S),u(S.message)}finally{a(!1)}},x=async()=>{if(!(b||!v)){m(!0);try{const S=await Ph({project_id:d||void 0,search:f||void 0,limit:12,offset:r.length});n([...r,...S.designs]),g(S.pagination.has_more)}catch(S){console.error("Failed to load more designs:",S),u(S.message)}finally{m(!1)}}},w=async S=>{try{const{design:C}=await Nj(S);e(C),t()}catch(C){console.error("Failed to load design:",C),alert(`Failed to load design: ${C.message}`)}},j=async S=>{try{await Oj(S),n(r.filter(C=>C.id!==S))}catch(C){throw console.error("Failed to delete design:",C),C}};return c.jsx("div",{className:"modal-overlay",onClick:t,children:c.jsxs("div",{className:"modal-content design-gallery-modal",onClick:S=>S.stopPropagation(),children:[c.jsxs("div",{className:"modal-header",children:[c.jsx("h2",{children:"My Designs"}),c.jsx("button",{onClick:t,className:"close-button",children:"×"})]}),c.jsxs("div",{className:"gallery-filters",children:[c.jsx("div",{className:"filter-group",children:c.jsx("input",{type:"text",placeholder:"Search designs...",value:f,onChange:S=>p(S.target.value),className:"search-input"})}),c.jsx("div",{className:"filter-group",children:c.jsxs("select",{value:d,onChange:S=>h(S.target.value),className:"project-filter",children:[c.jsx("option",{value:"",children:"All Projects"}),i.map(S=>c.jsxs("option",{value:S.id,children:[S.name," (",S.design_count,")"]},S.id))]})})]}),c.jsxs("div",{className:"modal-body",children:[l&&c.jsxs("div",{className:"error-message",children:[l,c.jsx("button",{onClick:y,className:"btn-retry",children:"Retry"})]}),s?c.jsxs("div",{className:"loading-state",children:[c.jsx("div",{className:"spinner-large"}),c.jsx("p",{children:"Loading your designs..."})]}):r.length===0?c.jsxs("div",{className:"empty-state",children:[c.jsxs("svg",{width:"64",height:"64",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[c.jsx("path",{d:"M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"}),c.jsx("path",{d:"M17 21v-8H7v8M7 3v5h8"})]}),c.jsx("h3",{children:"No designs yet"}),c.jsx("p",{children:f||d?"No designs match your filters. Try adjusting your search.":"Create your first design to see it here!"})]}):c.jsxs(c.Fragment,{children:[c.jsx("div",{className:"designs-grid",children:r.map(S=>c.jsx(JB,{design:S,onLoad:w,onDelete:j},S.id))}),v&&c.jsx("div",{className:"load-more-section",children:c.jsx("button",{onClick:x,className:"btn-load-more",disabled:b,children:b?"Loading...":"Load More"})})]})]})]})})}function QB(){const[t,e]=$.useState([]),[r,n]=$.useState(0),[i,o]=$.useState(!1),[s,a]=$.useState(null),[l,u]=$.useState("all"),[d,h]=$.useState("all"),[f,p]=$.useState(""),[v,g]=$.useState(0),b=50,m=async()=>{var N,E;const S=await Mt.auth.getSession();return{"Content-Type":"application/json",Authorization:`Bearer ${(E=(N=S==null?void 0:S.data)==null?void 0:N.session)==null?void 0:E.access_token}`}},y=async()=>{o(!0),a(null);try{const S=await m(),C=new URLSearchParams({limit:b.toString(),offset:v.toString()});l!=="all"&&C.append("status",l),d!=="all"&&C.append("saved_status",d),f&&C.append("search",f);const N=await fetch(`/api/admin/jobs?${C.toString()}`,{headers:S}),E=await N.json();if(!N.ok)throw new Error(E.error||"Failed to fetch jobs");e(E.jobs),n(E.total)}catch(S){console.error("Failed to fetch jobs:",S),a(S.message)}finally{o(!1)}};$.useEffect(()=>{y()},[l,d,f,v]);const x=t.filter(S=>S.status==="completed").length,w=t.filter(S=>!S.is_saved&&S.status==="completed").length,j=t.filter(S=>S.is_saved).length;return c.jsxs("div",{className:"generations-tab",children:[c.jsxs("div",{className:"admin-stats-grid",children:[c.jsxs("div",{className:"admin-stat-card",children:[c.jsx("h3",{children:"Total Generations"}),c.jsx("p",{className:"stat-value",children:r}),c.jsx("span",{className:"stat-label",children:"All time"})]}),c.jsxs("div",{className:"admin-stat-card",children:[c.jsx("h3",{children:"Completed"}),c.jsx("p",{className:"stat-value",children:x}),c.jsx("span",{className:"stat-label",children:"Current page"})]}),c.jsxs("div",{className:"admin-stat-card success",children:[c.jsx("h3",{children:"Saved"}),c.jsx("p",{className:"stat-value",children:j}),c.jsx("span",{className:"stat-label",children:"✓ Linked to designs"})]}),c.jsxs("div",{className:"admin-stat-card warning",children:[c.jsx("h3",{children:"Orphaned"}),c.jsx("p",{className:"stat-value",children:w}),c.jsx("span",{className:"stat-label",children:"⚠ Not saved"})]})]}),c.jsxs("div",{className:"admin-filters",children:[c.jsxs("div",{className:"filter-group",children:[c.jsx("label",{children:"Status:"}),c.jsxs("select",{value:l,onChange:S=>u(S.target.value),children:[c.jsx("option",{value:"all",children:"All"}),c.jsx("option",{value:"completed",children:"Completed"}),c.jsx("option",{value:"failed",children:"Failed"}),c.jsx("option",{value:"running",children:"Running"}),c.jsx("option",{value:"queued",children:"Queued"})]})]}),c.jsxs("div",{className:"filter-group",children:[c.jsx("label",{children:"Saved:"}),c.jsxs("select",{value:d,onChange:S=>h(S.target.value),children:[c.jsx("option",{value:"all",children:"All"}),c.jsx("option",{value:"saved",children:"Saved only"}),c.jsx("option",{value:"orphaned",children:"Orphaned only"})]})]}),c.jsxs("div",{className:"filter-group search",children:[c.jsx("label",{children:"Search prompt:"}),c.jsx("input",{type:"text",placeholder:"Search in prompts...",value:f,onChange:S=>p(S.target.value)})]})]}),i&&c.jsxs("div",{className:"admin-loading",children:[c.jsx("div",{className:"spinner"}),c.jsx("p",{children:"Loading jobs..."})]}),s&&c.jsx("div",{className:"admin-error",children:c.jsxs("p",{children:["Error: ",s]})}),!i&&t.length>0&&c.jsx("div",{className:"jobs-table-container",children:c.jsxs("table",{className:"jobs-table",children:[c.jsx("thead",{children:c.jsxs("tr",{children:[c.jsx("th",{children:"Thumbnail"}),c.jsx("th",{children:"Prompt"}),c.jsx("th",{children:"Dimensions"}),c.jsx("th",{children:"Status"}),c.jsx("th",{children:"Saved"}),c.jsx("th",{children:"User"}),c.jsx("th",{children:"Created"})]})}),c.jsx("tbody",{children:t.map(S=>c.jsxs("tr",{className:`job-row ${S.is_saved?"saved":"orphaned"} ${S.status}`,children:[c.jsx("td",{className:"thumbnail-cell",children:S.thumbnail_url?c.jsx("img",{src:S.thumbnail_url,alt:"Design",className:"job-thumbnail"}):c.jsx("div",{className:"thumbnail-placeholder",children:"No image"})}),c.jsx("td",{className:"prompt-cell",children:c.jsx("div",{className:"prompt-text",title:S.prompt,children:S.prompt||c.jsx("em",{children:"No prompt"})})}),c.jsx("td",{className:"dimensions-cell",children:S.width_mm&&S.length_mm?c.jsxs("span",{children:[S.width_mm," × ",S.length_mm," mm"]}):c.jsx("em",{children:"N/A"})}),c.jsx("td",{className:"status-cell",children:c.jsx("span",{className:`status-badge ${S.status}`,children:S.status})}),c.jsx("td",{className:"saved-cell",children:S.is_saved?c.jsx("span",{className:"saved-badge",children:"✓ Saved"}):c.jsx("span",{className:"orphaned-badge",children:"⚠ Orphaned"})}),c.jsx("td",{className:"user-cell",children:S.user_email}),c.jsx("td",{className:"date-cell",children:new Date(S.created_at).toLocaleDateString()})]},S.id))})]})}),!i&&t.length===0&&c.jsx("div",{className:"admin-empty",children:c.jsx("p",{children:"No jobs found matching your filters."})}),r>b&&c.jsxs("div",{className:"admin-pagination",children:[c.jsx("button",{onClick:()=>g(Math.max(0,v-b)),disabled:v===0,children:"Previous"}),c.jsxs("span",{children:["Showing ",v+1," to ",Math.min(v+b,r)," of ",r]}),c.jsx("button",{onClick:()=>g(v+b),disabled:v+b>=r,children:"Next"})]}),c.jsx("style",{children:`
        .jobs-table-container {
          overflow-x: auto;
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .jobs-table {
          width: 100%;
          border-collapse: collapse;
        }

        .jobs-table th {
          background: #f9fafb;
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          font-size: 0.875rem;
          color: #374151;
          border-bottom: 1px solid #e5e7eb;
        }

        .jobs-table td {
          padding: 1rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .job-row.saved {
          background: rgba(16, 185, 129, 0.03);
        }

        .job-row.orphaned {
          background: rgba(245, 158, 11, 0.03);
        }

        .thumbnail-cell {
          width: 80px;
        }

        .job-thumbnail {
          width: 64px;
          height: 64px;
          object-fit: cover;
          border-radius: 4px;
        }

        .thumbnail-placeholder {
          width: 64px;
          height: 64px;
          background: #f3f4f6;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .prompt-cell {
          max-width: 300px;
        }

        .prompt-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .status-badge.completed {
          background: #d1fae5;
          color: #065f46;
        }

        .status-badge.failed {
          background: #fee2e2;
          color: #991b1b;
        }

        .status-badge.running {
          background: #dbeafe;
          color: #1e40af;
        }

        .status-badge.queued {
          background: #e0e7ff;
          color: #3730a3;
        }

        .saved-badge {
          color: #059669;
          font-weight: 500;
        }

        .orphaned-badge {
          color: #d97706;
          font-weight: 500;
        }

        .user-cell {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .date-cell {
          font-size: 0.875rem;
          color: #6b7280;
          white-space: nowrap;
        }

        .admin-stat-card.success {
          border-left: 4px solid #10b981;
        }

        .admin-stat-card.warning {
          border-left: 4px solid #f59e0b;
        }
      `})]})}function e7(){const[t,e]=$.useState([]),[r,n]=$.useState(null),[i,o]=$.useState(!1),[s,a]=$.useState(null),[l,u]=$.useState(!1),[d,h]=$.useState(new Set),[f,p]=$.useState("all"),v=async()=>{var S,C;const w=await Mt.auth.getSession();return{"Content-Type":"application/json",Authorization:`Bearer ${(C=(S=w==null?void 0:w.data)==null?void 0:S.session)==null?void 0:C.access_token}`}},g=async()=>{o(!0),a(null);try{const w=await v(),j=new URLSearchParams;f!=="all"&&j.append("age_filter",f);const S=await fetch(`/api/admin/recovery/orphaned?${j.toString()}`,{headers:w}),C=await S.json();if(!S.ok)throw new Error(C.error||"Failed to fetch orphaned jobs");e(C.orphaned_jobs),n(C.age_buckets)}catch(w){console.error("Failed to fetch orphaned jobs:",w),a(w.message)}finally{o(!1)}};$.useEffect(()=>{g()},[f]);const b=w=>{const j=new Set(d);j.has(w)?j.delete(w):j.add(w),h(j)},m=()=>{h(new Set(t.map(w=>w.id)))},y=()=>{h(new Set)},x=async()=>{if(d.size===0){alert("Please select at least one job to recover");return}if(confirm(`Recover ${d.size} orphaned ${d.size===1?"design":"designs"}?`)){u(!0),a(null);try{const w=await v(),j=await fetch("/api/admin/recovery/create",{method:"POST",headers:w,body:JSON.stringify({job_ids:Array.from(d)})}),S=await j.json();if(!j.ok)throw new Error(S.error||"Failed to recover designs");alert(`Successfully recovered ${S.recovered_count} ${S.recovered_count===1?"design":"designs"}!`),y(),await g()}catch(w){console.error("Failed to recover designs:",w),a(w.message),alert(`Recovery failed: ${w.message}`)}finally{u(!1)}}};return c.jsxs("div",{className:"recovery-tab",children:[c.jsxs("div",{className:"admin-stats-grid",children:[c.jsxs("div",{className:"admin-stat-card warning",children:[c.jsx("h3",{children:"Total Orphaned"}),c.jsx("p",{className:"stat-value",children:t.length}),c.jsx("span",{className:"stat-label",children:"Designs not saved"})]}),r&&c.jsxs(c.Fragment,{children:[c.jsxs("div",{className:"admin-stat-card",children:[c.jsx("h3",{children:"<24 hours"}),c.jsx("p",{className:"stat-value",children:r["<24h"]}),c.jsx("span",{className:"stat-label",children:"Recent"})]}),c.jsxs("div",{className:"admin-stat-card",children:[c.jsx("h3",{children:"1-7 days"}),c.jsx("p",{className:"stat-value",children:r["1-7d"]}),c.jsx("span",{className:"stat-label",children:"This week"})]}),c.jsxs("div",{className:"admin-stat-card",children:[c.jsx("h3",{children:">7 days"}),c.jsx("p",{className:"stat-value",children:r["7-30d"]+r[">30d"]}),c.jsx("span",{className:"stat-label",children:"Older"})]})]})]}),c.jsxs("div",{className:"recovery-controls",children:[c.jsx("div",{className:"admin-filters",children:c.jsxs("div",{className:"filter-group",children:[c.jsx("label",{children:"Age:"}),c.jsxs("select",{value:f,onChange:w=>p(w.target.value),children:[c.jsx("option",{value:"all",children:"All"}),c.jsx("option",{value:"24h",children:"<24 hours"}),c.jsx("option",{value:"7d",children:"<7 days"}),c.jsx("option",{value:"30d",children:"<30 days"})]})]})}),c.jsxs("div",{className:"bulk-actions",children:[c.jsx("button",{onClick:m,className:"btn-secondary",children:"Select All"}),c.jsxs("button",{onClick:y,className:"btn-secondary",children:["Clear (",d.size,")"]}),c.jsx("button",{onClick:x,disabled:d.size===0||l,className:"btn-primary",children:l?"Recovering...":`Recover Selected (${d.size})`})]})]}),i&&c.jsxs("div",{className:"admin-loading",children:[c.jsx("div",{className:"spinner"}),c.jsx("p",{children:"Loading orphaned jobs..."})]}),s&&c.jsx("div",{className:"admin-error",children:c.jsxs("p",{children:["Error: ",s]})}),!i&&t.length>0&&c.jsx("div",{className:"recovery-table-container",children:c.jsxs("table",{className:"recovery-table",children:[c.jsx("thead",{children:c.jsxs("tr",{children:[c.jsx("th",{style:{width:"40px"},children:c.jsx("input",{type:"checkbox",checked:d.size===t.length,onChange:w=>w.target.checked?m():y()})}),c.jsx("th",{children:"Thumbnail"}),c.jsx("th",{children:"Prompt / Auto-name"}),c.jsx("th",{children:"Dimensions"}),c.jsx("th",{children:"Age"}),c.jsx("th",{children:"User"})]})}),c.jsx("tbody",{children:t.map(w=>c.jsxs("tr",{className:d.has(w.id)?"selected":"",onClick:()=>b(w.id),children:[c.jsx("td",{onClick:j=>j.stopPropagation(),children:c.jsx("input",{type:"checkbox",checked:d.has(w.id),onChange:()=>b(w.id)})}),c.jsx("td",{className:"thumbnail-cell",children:w.thumbnail_url?c.jsx("img",{src:w.thumbnail_url,alt:"Design",className:"job-thumbnail"}):c.jsx("div",{className:"thumbnail-placeholder",children:"No image"})}),c.jsxs("td",{className:"prompt-cell",children:[c.jsx("div",{className:"prompt-text",title:w.prompt,children:w.auto_name}),w.prompt&&w.prompt.length>50&&c.jsx("div",{className:"prompt-full",children:w.prompt})]}),c.jsx("td",{className:"dimensions-cell",children:w.width_mm&&w.length_mm?c.jsxs("span",{children:[w.width_mm," × ",w.length_mm," mm"]}):c.jsx("em",{children:"N/A"})}),c.jsx("td",{className:"age-cell",children:c.jsxs("span",{className:`age-badge ${w.age_bucket.replace(/[<>]/g,"")}`,children:[w.age_days," ",w.age_days===1?"day":"days"]})}),c.jsx("td",{className:"user-cell",children:w.user_email})]},w.id))})]})}),!i&&t.length===0&&c.jsx("div",{className:"admin-empty",children:c.jsx("p",{children:"No orphaned jobs found. All designs have been saved!"})}),c.jsx("style",{children:`
        .recovery-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .bulk-actions {
          display: flex;
          gap: 0.5rem;
        }

        .btn-primary {
          padding: 0.5rem 1rem;
          background: #ff6b35;
          color: white;
          border: none;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
        }

        .btn-primary:hover:not(:disabled) {
          background: #e55a2b;
        }

        .btn-primary:disabled {
          background: #d1d5db;
          cursor: not-allowed;
        }

        .btn-secondary {
          padding: 0.5rem 1rem;
          background: white;
          color: #374151;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
        }

        .btn-secondary:hover {
          background: #f9fafb;
        }

        .recovery-table-container {
          overflow-x: auto;
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .recovery-table {
          width: 100%;
          border-collapse: collapse;
        }

        .recovery-table th {
          background: #f9fafb;
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          font-size: 0.875rem;
          color: #374151;
          border-bottom: 1px solid #e5e7eb;
        }

        .recovery-table td {
          padding: 1rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .recovery-table tbody tr {
          cursor: pointer;
          transition: background 0.15s;
        }

        .recovery-table tbody tr:hover {
          background: #f9fafb;
        }

        .recovery-table tbody tr.selected {
          background: #eff6ff;
        }

        .age-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .age-badge.24h {
          background: #fee2e2;
          color: #991b1b;
        }

        .age-badge.1-7d {
          background: #fed7aa;
          color: #92400e;
        }

        .age-badge.7-30d {
          background: #fef3c7;
          color: #78350f;
        }

        .age-badge.30d {
          background: #e5e7eb;
          color: #374151;
        }

        .prompt-full {
          font-size: 0.75rem;
          color: #6b7280;
          margin-top: 0.25rem;
          display: none;
        }

        .recovery-table tbody tr:hover .prompt-full {
          display: block;
        }
      `})]})}function t7({onClose:t}){const[e,r]=$.useState("overview"),[n,i]=$.useState(!0),[o,s]=$.useState(null),[a,l]=$.useState(null),[u,d]=$.useState([]),[h,f]=$.useState([]),[p,v]=$.useState(0),[g,b]=$.useState(null),m=async()=>{var N,E;const S=await Mt.auth.getSession();return{"Content-Type":"application/json",Authorization:`Bearer ${(E=(N=S==null?void 0:S.data)==null?void 0:N.session)==null?void 0:E.access_token}`}},y=async()=>{try{const S=await m(),C=await fetch("/api/admin/analytics/overview",{headers:S}),N=await C.json();if(!C.ok)throw new Error(N.error||"Failed to fetch overview");l(N.stats)}catch(S){console.error("Failed to fetch overview:",S),s(S.message)}},x=async()=>{try{const S=await m(),C=await fetch("/api/admin/users",{headers:S}),N=await C.json();if(!C.ok)throw new Error(N.error||"Failed to fetch users");d(N.users)}catch(S){console.error("Failed to fetch users:",S),s(S.message)}},w=async()=>{try{const S=await m(),C=await fetch("/api/admin/designs?limit=50",{headers:S}),N=await C.json();if(!C.ok)throw new Error(N.error||"Failed to fetch designs");f(N.designs),v(N.total)}catch(S){console.error("Failed to fetch designs:",S),s(S.message)}},j=async()=>{try{const S=await m(),C=await fetch("/api/admin/analytics/colours",{headers:S}),N=await C.json();if(!C.ok)throw new Error(N.error||"Failed to fetch colour analytics");b(N.analytics)}catch(S){console.error("Failed to fetch colours:",S),s(S.message)}};return $.useEffect(()=>{(async()=>{i(!0),await y(),i(!1)})()},[]),$.useEffect(()=>{e==="users"&&u.length===0?x():e==="designs"&&h.length===0?w():e==="colours"&&!g&&j()},[e]),n?c.jsxs("div",{className:"admin-loading",children:[c.jsx("div",{className:"spinner"}),c.jsx("p",{children:"Loading admin dashboard..."})]}):o?c.jsxs("div",{className:"admin-error",children:[c.jsx("h2",{children:"Access Denied"}),c.jsx("p",{children:o}),c.jsx("p",{children:"You need admin privileges to view this page."})]}):c.jsxs("div",{className:"admin-dashboard",children:[c.jsxs("header",{className:"admin-header",children:[c.jsxs("div",{className:"admin-header-left",children:[c.jsxs("button",{onClick:t,className:"btn-back",children:[c.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:c.jsx("path",{d:"M19 12H5M12 19l-7-7 7-7"})}),"Back to Studio"]}),c.jsx("h1",{children:"TPV Studio Admin"})]}),c.jsxs("nav",{className:"admin-nav",children:[c.jsx("button",{className:e==="overview"?"active":"",onClick:()=>r("overview"),children:"Overview"}),c.jsx("button",{className:e==="generations"?"active":"",onClick:()=>r("generations"),children:"Generations"}),c.jsx("button",{className:e==="recovery"?"active":"",onClick:()=>r("recovery"),children:"Recovery"}),c.jsx("button",{className:e==="users"?"active":"",onClick:()=>r("users"),children:"Users"}),c.jsx("button",{className:e==="designs"?"active":"",onClick:()=>r("designs"),children:"Designs"}),c.jsx("button",{className:e==="colours"?"active":"",onClick:()=>r("colours"),children:"Colour Analytics"})]})]}),c.jsxs("main",{className:"admin-content",children:[e==="overview"&&a&&c.jsx(r7,{stats:a}),e==="generations"&&c.jsx(QB,{}),e==="recovery"&&c.jsx(e7,{}),e==="users"&&c.jsx(n7,{users:u}),e==="designs"&&c.jsx(i7,{designs:h,total:p}),e==="colours"&&g&&c.jsx(o7,{analytics:g})]}),c.jsx("style",{jsx:!0,children:`
        .admin-dashboard {
          min-height: 100vh;
          background: #f8fafc;
        }

        .admin-header {
          background: white;
          border-bottom: 1px solid #e5e7eb;
          padding: 20px 40px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .admin-header-left {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .btn-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          font-size: 13px;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s;
          width: fit-content;
        }

        .btn-back:hover {
          background: #e5e7eb;
          color: #374151;
        }

        .admin-header h1 {
          margin: 0;
          font-size: 24px;
          color: #1e4a7a;
        }

        .admin-nav {
          display: flex;
          gap: 8px;
        }

        .admin-nav button {
          padding: 8px 16px;
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          color: #64748b;
          transition: all 0.2s;
        }

        .admin-nav button:hover {
          background: #f8fafc;
          color: #1e4a7a;
        }

        .admin-nav button.active {
          background: #1e4a7a;
          color: white;
          border-color: #1e4a7a;
        }

        .admin-content {
          padding: 24px 40px;
        }

        .admin-loading,
        .admin-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
          text-align: center;
        }

        .admin-error h2 {
          color: #dc2626;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e5e7eb;
          border-top-color: #1e4a7a;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-bottom: 16px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `})]})}function r7({stats:t}){return c.jsxs("div",{className:"overview-panel",children:[c.jsx("h2",{children:"Dashboard Overview"}),c.jsxs("div",{className:"stats-grid",children:[c.jsxs("div",{className:"stat-card",children:[c.jsx("div",{className:"stat-value",children:t.totals.users}),c.jsx("div",{className:"stat-label",children:"Total Users"})]}),c.jsxs("div",{className:"stat-card",children:[c.jsx("div",{className:"stat-value",children:t.totals.designs}),c.jsx("div",{className:"stat-label",children:"Total Designs"})]}),c.jsxs("div",{className:"stat-card",children:[c.jsx("div",{className:"stat-value",children:t.totals.projects}),c.jsx("div",{className:"stat-label",children:"Total Projects"})]}),c.jsxs("div",{className:"stat-card",children:[c.jsx("div",{className:"stat-value",children:t.totals.jobs}),c.jsx("div",{className:"stat-label",children:"AI Jobs Run"})]})]}),c.jsxs("div",{className:"stats-grid",children:[c.jsxs("div",{className:"stat-card highlight",children:[c.jsx("div",{className:"stat-value",children:t.activity.active_users_30d}),c.jsx("div",{className:"stat-label",children:"Active Users (30d)"})]}),c.jsxs("div",{className:"stat-card highlight",children:[c.jsx("div",{className:"stat-value",children:t.activity.designs_7d}),c.jsx("div",{className:"stat-label",children:"Designs This Week"})]}),c.jsxs("div",{className:"stat-card highlight",children:[c.jsx("div",{className:"stat-value",children:t.activity.designs_30d}),c.jsx("div",{className:"stat-label",children:"Designs This Month"})]}),c.jsxs("div",{className:"stat-card highlight",children:[c.jsxs("div",{className:"stat-value",children:[t.activity.job_success_rate,"%"]}),c.jsx("div",{className:"stat-label",children:"Job Success Rate"})]})]}),c.jsx("h3",{children:"Activity Timeline (14 Days)"}),c.jsx("div",{className:"activity-chart",children:t.timeline.map((e,r)=>c.jsxs("div",{className:"bar-container",children:[c.jsx("div",{className:"bar",style:{height:`${Math.max(4,e.count*20)}px`},title:`${e.date}: ${e.count} designs`}),c.jsx("div",{className:"bar-label",children:e.date.split("-")[2]})]},r))}),c.jsxs("div",{className:"breakdowns",children:[c.jsxs("div",{className:"breakdown-card",children:[c.jsx("h4",{children:"Input Mode"}),c.jsxs("div",{className:"breakdown-items",children:[c.jsxs("div",{className:"breakdown-item",children:[c.jsx("span",{children:"Prompt"}),c.jsx("strong",{children:t.breakdowns.input_mode.prompt})]}),c.jsxs("div",{className:"breakdown-item",children:[c.jsx("span",{children:"Image Upload"}),c.jsx("strong",{children:t.breakdowns.input_mode.image})]}),c.jsxs("div",{className:"breakdown-item",children:[c.jsx("span",{children:"SVG Upload"}),c.jsx("strong",{children:t.breakdowns.input_mode.svg})]})]})]}),c.jsxs("div",{className:"breakdown-card",children:[c.jsx("h4",{children:"View Mode Preference"}),c.jsxs("div",{className:"breakdown-items",children:[c.jsxs("div",{className:"breakdown-item",children:[c.jsx("span",{children:"Solid TPV"}),c.jsx("strong",{children:t.breakdowns.view_mode.solid})]}),c.jsxs("div",{className:"breakdown-item",children:[c.jsx("span",{children:"Blend TPV"}),c.jsx("strong",{children:t.breakdowns.view_mode.blend})]})]})]})]}),c.jsx("style",{jsx:!0,children:`
        .overview-panel h2 {
          margin: 0 0 24px 0;
          color: #1a202c;
        }

        .overview-panel h3 {
          margin: 32px 0 16px 0;
          color: #1a202c;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 16px;
        }

        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .stat-card.highlight {
          border-color: #1e4a7a;
          border-width: 2px;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 700;
          color: #1e4a7a;
        }

        .stat-label {
          font-size: 14px;
          color: #64748b;
          margin-top: 4px;
        }

        .activity-chart {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          height: 120px;
          padding: 16px;
          background: white;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .bar-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .bar {
          width: 100%;
          background: #1e4a7a;
          border-radius: 4px 4px 0 0;
          min-height: 4px;
        }

        .bar-label {
          font-size: 10px;
          color: #64748b;
          margin-top: 4px;
        }

        .breakdowns {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-top: 24px;
        }

        .breakdown-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .breakdown-card h4 {
          margin: 0 0 12px 0;
          color: #1a202c;
        }

        .breakdown-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #f3f4f6;
        }

        .breakdown-item:last-child {
          border-bottom: none;
        }

        .breakdown-item span {
          color: #64748b;
        }

        .breakdown-item strong {
          color: #1a202c;
        }
      `})]})}function n7({users:t}){return c.jsxs("div",{className:"users-panel",children:[c.jsxs("h2",{children:["User Management (",t.length," users)"]}),c.jsxs("table",{className:"users-table",children:[c.jsx("thead",{children:c.jsxs("tr",{children:[c.jsx("th",{children:"Email"}),c.jsx("th",{children:"Role"}),c.jsx("th",{children:"Designs"}),c.jsx("th",{children:"Projects"}),c.jsx("th",{children:"Jobs"}),c.jsx("th",{children:"Last Design"}),c.jsx("th",{children:"Joined"})]})}),c.jsx("tbody",{children:t.map(e=>c.jsxs("tr",{children:[c.jsx("td",{children:e.email}),c.jsx("td",{children:c.jsx("span",{className:`role-badge ${e.role}`,children:e.role})}),c.jsx("td",{children:e.design_count}),c.jsx("td",{children:e.project_count}),c.jsx("td",{children:e.job_count}),c.jsx("td",{children:e.last_design_at?new Date(e.last_design_at).toLocaleDateString():"-"}),c.jsx("td",{children:new Date(e.created_at).toLocaleDateString()})]},e.id))})]}),c.jsx("style",{jsx:!0,children:`
        .users-panel h2 {
          margin: 0 0 24px 0;
          color: #1a202c;
        }

        .users-table {
          width: 100%;
          background: white;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          border-collapse: collapse;
        }

        .users-table th,
        .users-table td {
          padding: 12px 16px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }

        .users-table th {
          background: #f8fafc;
          font-weight: 600;
          color: #64748b;
          font-size: 12px;
          text-transform: uppercase;
        }

        .users-table td {
          font-size: 14px;
          color: #1a202c;
        }

        .role-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }

        .role-badge.user {
          background: #f3f4f6;
          color: #64748b;
        }

        .role-badge.admin {
          background: #dbeafe;
          color: #1e40af;
        }

        .role-badge.superadmin {
          background: #fef3c7;
          color: #92400e;
        }
      `})]})}function i7({designs:t,total:e}){return c.jsxs("div",{className:"designs-panel",children:[c.jsxs("h2",{children:["All Designs (",e," total)"]}),c.jsx("div",{className:"designs-grid",children:t.map(r=>c.jsxs("div",{className:"design-card",children:[c.jsx("div",{className:"design-thumbnail",children:r.thumbnail_url||r.original_png_url?c.jsx("img",{src:r.thumbnail_url||r.original_png_url,alt:r.name}):c.jsx("div",{className:"no-image",children:"No preview"})}),c.jsxs("div",{className:"design-info",children:[c.jsx("h4",{children:r.name}),c.jsx("p",{className:"design-user",children:r.user_email}),c.jsx("p",{className:"design-date",children:new Date(r.created_at).toLocaleDateString()}),r.project&&c.jsx("span",{className:"project-badge",style:{backgroundColor:r.project.color||"#64748b"},children:r.project.name})]})]},r.id))}),c.jsx("style",{jsx:!0,children:`
        .designs-panel h2 {
          margin: 0 0 24px 0;
          color: #1a202c;
        }

        .designs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 16px;
        }

        .design-card {
          background: white;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }

        .design-thumbnail {
          aspect-ratio: 1;
          background: #f3f4f6;
          overflow: hidden;
        }

        .design-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .no-image {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
          font-size: 14px;
        }

        .design-info {
          padding: 12px;
        }

        .design-info h4 {
          margin: 0 0 4px 0;
          font-size: 14px;
          color: #1a202c;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .design-user {
          margin: 0;
          font-size: 12px;
          color: #64748b;
        }

        .design-date {
          margin: 4px 0;
          font-size: 12px;
          color: #9ca3af;
        }

        .project-badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 10px;
          color: white;
        }
      `})]})}function o7({analytics:t}){return c.jsxs("div",{className:"colours-panel",children:[c.jsx("h2",{children:"Colour Usage Analytics"}),c.jsxs("div",{className:"colour-stats",children:[c.jsxs("div",{className:"stat-card",children:[c.jsx("div",{className:"stat-value",children:t.totals.designs_analysed}),c.jsx("div",{className:"stat-label",children:"Designs Analysed"})]}),c.jsxs("div",{className:"stat-card",children:[c.jsx("div",{className:"stat-value",children:t.totals.colour_usages}),c.jsx("div",{className:"stat-label",children:"Total Colour Uses"})]})]}),c.jsx("h3",{children:"Top 10 TPV Colours"}),c.jsx("div",{className:"colour-list",children:t.top_colours.map((e,r)=>c.jsxs("div",{className:"colour-item",children:[c.jsxs("span",{className:"colour-rank",children:["#",r+1]}),c.jsx("div",{className:"colour-swatch",style:{backgroundColor:e.hex}}),c.jsxs("div",{className:"colour-info",children:[c.jsx("strong",{children:e.code}),c.jsx("span",{children:e.name})]}),c.jsxs("div",{className:"colour-count",children:[e.count," uses"]})]},e.code))}),c.jsx("h3",{children:"Colour Family Breakdown"}),c.jsx("div",{className:"family-bars",children:Object.entries(t.families).map(([e,r])=>c.jsxs("div",{className:"family-bar",children:[c.jsx("span",{className:"family-name",children:e}),c.jsx("div",{className:"bar-bg",children:c.jsx("div",{className:"bar-fill",style:{width:`${r/t.totals.colour_usages*100}%`,backgroundColor:s7(e)}})}),c.jsx("span",{className:"family-count",children:r})]},e))}),t.top_blends.length>0&&c.jsxs(c.Fragment,{children:[c.jsx("h3",{children:"Top Blend Combinations"}),c.jsx("div",{className:"blend-list",children:t.top_blends.map((e,r)=>c.jsxs("div",{className:"blend-item",children:[c.jsx("div",{className:"blend-swatches",children:e.components.map((n,i)=>c.jsx("div",{className:"blend-swatch",style:{backgroundColor:n.hex},title:`${n.code} - ${n.name}`},i))}),c.jsx("div",{className:"blend-codes",children:e.components.map(n=>n.code).join(" + ")}),c.jsxs("div",{className:"blend-count",children:[e.count," uses"]})]},r))})]}),c.jsx("style",{jsx:!0,children:`
        .colours-panel h2 {
          margin: 0 0 24px 0;
          color: #1a202c;
        }

        .colours-panel h3 {
          margin: 32px 0 16px 0;
          color: #1a202c;
        }

        .colour-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 700;
          color: #1e4a7a;
        }

        .stat-label {
          font-size: 14px;
          color: #64748b;
          margin-top: 4px;
        }

        .colour-list {
          background: white;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }

        .colour-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-bottom: 1px solid #f3f4f6;
        }

        .colour-item:last-child {
          border-bottom: none;
        }

        .colour-rank {
          width: 30px;
          font-size: 12px;
          color: #9ca3af;
        }

        .colour-swatch {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
        }

        .colour-info {
          flex: 1;
        }

        .colour-info strong {
          display: block;
          color: #1a202c;
        }

        .colour-info span {
          font-size: 12px;
          color: #64748b;
        }

        .colour-count {
          font-weight: 600;
          color: #1e4a7a;
        }

        .family-bars {
          background: white;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          padding: 16px;
        }

        .family-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .family-bar:last-child {
          margin-bottom: 0;
        }

        .family-name {
          width: 80px;
          font-size: 14px;
          color: #64748b;
          text-transform: capitalize;
        }

        .bar-bg {
          flex: 1;
          height: 20px;
          background: #f3f4f6;
          border-radius: 4px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          border-radius: 4px;
        }

        .family-count {
          width: 50px;
          text-align: right;
          font-weight: 600;
          color: #1a202c;
        }

        .blend-list {
          background: white;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }

        .blend-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-bottom: 1px solid #f3f4f6;
        }

        .blend-item:last-child {
          border-bottom: none;
        }

        .blend-swatches {
          display: flex;
          gap: 4px;
        }

        .blend-swatch {
          width: 24px;
          height: 24px;
          border-radius: 4px;
          border: 1px solid #e5e7eb;
        }

        .blend-codes {
          flex: 1;
          font-size: 14px;
          color: #1a202c;
        }

        .blend-count {
          font-weight: 600;
          color: #1e4a7a;
        }
      `})]})}function s7(t){return{reds:"#dc2626",greens:"#16a34a",blues:"#2563eb",yellows:"#ca8a04",neutrals:"#6b7280"}[t]||"#6b7280"}const Ed=[{code:"RH60",name:"Beige",hex:"#C8B88A"},{code:"RH61",name:"Cream",hex:"#F5F0D5"},{code:"RH40",name:"Bright Yellow",hex:"#FFD700"},{code:"RH41",name:"Mustard",hex:"#D4A017"},{code:"RH50",name:"Orange",hex:"#FF8C00"},{code:"RH01",name:"Standard Red",hex:"#C41E3A"},{code:"RH02",name:"Bright Red",hex:"#FF2400"},{code:"RH90",name:"Funky Pink",hex:"#FF69B4"},{code:"RH23",name:"Purple",hex:"#6A0DAD"},{code:"RH20",name:"Standard Blue",hex:"#1E3A8A"},{code:"RH21",name:"Light Blue",hex:"#6CB4EE"},{code:"RH26",name:"Azure",hex:"#007FFF"},{code:"RH22",name:"Turquoise",hex:"#30D5C8"},{code:"RH10",name:"Dark Green",hex:"#013220"},{code:"RH11",name:"Standard Green",hex:"#228B22"},{code:"RH12",name:"Bright Green",hex:"#32CD32"},{code:"RH65",name:"Brown",hex:"#5C4033"},{code:"RH30",name:"Pale Grey",hex:"#D3D3D3"},{code:"RH31",name:"Light Grey",hex:"#A9A9A9"},{code:"RH32",name:"Dark Grey",hex:"#505050"},{code:"RH70",name:"Black",hex:"#1A1A1A"}],Hv=["ocean theme with dolphins and waves","jungle adventure with parrots","solar system with planets","garden with butterflies and flowers","racing track with cars","underwater coral reef scene","dinosaur footprints trail","rainbow with clouds"],a7=[...Array(60)].map(t=>({delay:`${Math.random()*3}s`,x:`${Math.random()*100}%`,y:`${Math.random()*100}%`,size:`${8+Math.random()*12}px`}));function l7(){const[t,e]=$.useState(""),[r,n]=$.useState(""),[i,o]=$.useState(""),[s,a]=$.useState(!1),[l,u]=$.useState(!1),[d,h]=$.useState(0);$.useEffect(()=>{const v=setInterval(()=>{h(g=>(g+1)%Hv.length)},5e3);return()=>clearInterval(v)},[]);const f=async v=>{v.preventDefault(),o(""),a(!0);try{await mn.signIn(t,r)}catch(g){o(g.message||"Sign in failed")}finally{a(!1)}},p=v=>{var g;(g=document.getElementById(v))==null||g.scrollIntoView({behavior:"smooth"})};return c.jsxs("div",{className:"landing-page",children:[c.jsxs("nav",{className:"landing-nav",children:[c.jsxs("div",{className:"nav-logo",children:[c.jsx("span",{className:"logo-text",children:"TPV"}),c.jsx("span",{className:"logo-accent",children:"Studio"})]}),c.jsxs("div",{className:"nav-links",children:[c.jsx("button",{onClick:()=>p("features"),children:"Features"}),c.jsx("button",{onClick:()=>p("palette"),children:"Colours"}),c.jsx("button",{onClick:()=>u(!0),className:"nav-cta",children:"Sign In"})]})]}),c.jsxs("section",{className:"hero",children:[c.jsx("div",{className:"hero-background",children:c.jsx("div",{className:"granule-field",children:a7.map((v,g)=>c.jsx("div",{className:"granule",style:{"--delay":v.delay,"--x":v.x,"--y":v.y,"--color":Ed[g%Ed.length].hex,"--size":v.size}},g))})}),c.jsxs("div",{className:"hero-content",children:[c.jsx("div",{className:"hero-badge",children:"AI-Powered Design Tool"}),c.jsxs("h1",{children:[c.jsx("span",{className:"hero-line-1",children:"Transform Ideas Into"}),c.jsx("span",{className:"hero-line-2",children:"Playground Surfaces"})]}),c.jsx("p",{className:"hero-subtitle",children:"Describe your vision or upload an image. Get production-ready TPV colour specifications in minutes, not hours."}),c.jsxs("div",{className:"hero-ctas",children:[c.jsxs("button",{onClick:()=>u(!0),className:"cta-primary",children:["Start Designing",c.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:c.jsx("path",{d:"M5 12h14M12 5l7 7-7 7"})})]}),c.jsx("button",{onClick:()=>p("how-it-works"),className:"cta-secondary",children:"See How It Works"})]})]}),c.jsx("div",{className:"hero-visual",children:c.jsx("div",{className:"mockup-container",children:c.jsxs("div",{className:"mockup-screen",children:[c.jsx("div",{className:"mockup-header",children:c.jsxs("div",{className:"mockup-dots",children:[c.jsx("span",{}),c.jsx("span",{}),c.jsx("span",{})]})}),c.jsxs("div",{className:"mockup-content",children:[c.jsx("div",{className:"mockup-input",children:c.jsx("span",{className:"typing-text",children:Hv[d]},d)}),c.jsxs("div",{className:"mockup-preview",children:[c.jsx("div",{className:"preview-shape shape-1"}),c.jsx("div",{className:"preview-shape shape-2"}),c.jsx("div",{className:"preview-shape shape-3"})]})]})]})})})]}),c.jsxs("section",{id:"how-it-works",className:"how-it-works",children:[c.jsxs("div",{className:"section-header",children:[c.jsx("span",{className:"section-tag",children:"Process"}),c.jsx("h2",{children:"Three Steps to Production-Ready Designs"})]}),c.jsxs("div",{className:"steps-container",children:[c.jsxs("div",{className:"step",children:[c.jsx("div",{className:"step-number",children:"01"}),c.jsx("div",{className:"step-icon",children:c.jsx("svg",{width:"32",height:"32",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:c.jsx("path",{d:"M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"})})}),c.jsx("h3",{children:"Describe or Upload"}),c.jsx("p",{children:'Type a description like "tropical jungle with parrots" or upload an existing image or SVG file.'})]}),c.jsx("div",{className:"step-connector",children:c.jsx("svg",{viewBox:"0 0 100 20",preserveAspectRatio:"none",children:c.jsx("path",{d:"M0 10 Q50 10 100 10",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeDasharray:"4 4"})})}),c.jsxs("div",{className:"step",children:[c.jsx("div",{className:"step-number",children:"02"}),c.jsx("div",{className:"step-icon",children:c.jsx("svg",{width:"32",height:"32",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:c.jsx("path",{d:"M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"})})}),c.jsx("h3",{children:"AI Generates Vector"}),c.jsx("p",{children:"Our AI creates a clean vector design optimized for TPV surface production with colour regions."})]}),c.jsx("div",{className:"step-connector",children:c.jsx("svg",{viewBox:"0 0 100 20",preserveAspectRatio:"none",children:c.jsx("path",{d:"M0 10 Q50 10 100 10",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeDasharray:"4 4"})})}),c.jsxs("div",{className:"step",children:[c.jsx("div",{className:"step-number",children:"03"}),c.jsx("div",{className:"step-icon",children:c.jsxs("svg",{width:"32",height:"32",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[c.jsx("path",{d:"M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"}),c.jsx("path",{d:"M14 2v6h6M16 13H8M16 17H8M10 9H8"})]})}),c.jsx("h3",{children:"Get TPV Recipes"}),c.jsx("p",{children:"Receive precise granule blend specifications with component ratios, ready for production."})]})]})]}),c.jsxs("section",{id:"features",className:"features",children:[c.jsxs("div",{className:"section-header",children:[c.jsx("span",{className:"section-tag",children:"Capabilities"}),c.jsx("h2",{children:"Everything You Need to Design TPV Surfaces"})]}),c.jsxs("div",{className:"features-grid",children:[c.jsxs("div",{className:"feature-card feature-highlight",children:[c.jsx("div",{className:"feature-icon",children:c.jsxs("svg",{width:"28",height:"28",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[c.jsx("path",{d:"M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"}),c.jsx("path",{d:"M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"})]})}),c.jsx("h3",{children:"AI Text-to-Vector"}),c.jsx("p",{children:"Describe any concept in natural language. Our AI transforms your words into production-ready vector designs."}),c.jsx("div",{className:"feature-example",children:'"vibrant underwater scene with coral reef"'})]}),c.jsxs("div",{className:"feature-card",children:[c.jsx("div",{className:"feature-icon",children:c.jsxs("svg",{width:"28",height:"28",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[c.jsx("rect",{x:"3",y:"3",width:"18",height:"18",rx:"2",ry:"2"}),c.jsx("circle",{cx:"8.5",cy:"8.5",r:"1.5"}),c.jsx("path",{d:"M21 15l-5-5L5 21"})]})}),c.jsx("h3",{children:"Image Vectorisation"}),c.jsx("p",{children:"Upload any PNG or JPG image and convert it to clean SVG vectors optimised for TPV production."})]}),c.jsxs("div",{className:"feature-card",children:[c.jsx("div",{className:"feature-icon",children:c.jsxs("svg",{width:"28",height:"28",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[c.jsx("circle",{cx:"13.5",cy:"6.5",r:"2.5"}),c.jsx("circle",{cx:"17.5",cy:"10.5",r:"2.5"}),c.jsx("circle",{cx:"8.5",cy:"7.5",r:"2.5"}),c.jsx("circle",{cx:"6.5",cy:"12.5",r:"2.5"}),c.jsx("path",{d:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"})]})}),c.jsx("h3",{children:"Auto Colour Matching"}),c.jsx("p",{children:"Automatic extraction and matching to the 21-colour TPV palette with optimal blend recipes."})]}),c.jsxs("div",{className:"feature-card",children:[c.jsx("div",{className:"feature-icon",children:c.jsxs("svg",{width:"28",height:"28",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[c.jsx("path",{d:"M12 3v18M3 12h18"}),c.jsx("circle",{cx:"12",cy:"12",r:"9"})]})}),c.jsx("h3",{children:"Solid & Blend Modes"}),c.jsx("p",{children:"Choose between single-colour purity or multi-granule blends for precise colour accuracy."})]}),c.jsxs("div",{className:"feature-card",children:[c.jsx("div",{className:"feature-icon",children:c.jsxs("svg",{width:"28",height:"28",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[c.jsx("path",{d:"M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"}),c.jsx("path",{d:"M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"})]})}),c.jsx("h3",{children:"Interactive Editor"}),c.jsx("p",{children:"Click any colour region to customise. Real-time preview updates as you design."})]}),c.jsxs("div",{className:"feature-card",children:[c.jsx("div",{className:"feature-icon",children:c.jsxs("svg",{width:"28",height:"28",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[c.jsx("path",{d:"M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"}),c.jsx("path",{d:"M14 2v6h6M12 18v-6M9 15l3 3 3-3"})]})}),c.jsx("h3",{children:"PDF Specifications"}),c.jsx("p",{children:"Export professional specification sheets with design preview, dimensions, and all recipes."})]}),c.jsxs("div",{className:"feature-card",children:[c.jsx("div",{className:"feature-icon",children:c.jsxs("svg",{width:"28",height:"28",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[c.jsx("rect",{x:"3",y:"3",width:"18",height:"18",rx:"2",ry:"2"}),c.jsx("circle",{cx:"8.5",cy:"8.5",r:"1.5"}),c.jsx("path",{d:"M21 15l-5-5L5 21"})]})}),c.jsx("h3",{children:"In-Situ Preview"}),c.jsx("p",{children:"Upload a site photo and see your design in context. Adjust perspective and lighting to visualise the finished installation."})]}),c.jsxs("div",{className:"feature-card",children:[c.jsx("div",{className:"feature-icon",children:c.jsxs("svg",{width:"28",height:"28",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[c.jsx("rect",{x:"3",y:"3",width:"7",height:"7"}),c.jsx("rect",{x:"14",y:"3",width:"7",height:"7"}),c.jsx("rect",{x:"3",y:"14",width:"7",height:"7"}),c.jsx("rect",{x:"14",y:"14",width:"7",height:"7"})]})}),c.jsx("h3",{children:"Installation Tiles"}),c.jsx("p",{children:"Download your design as 1m×1m tiles in a ZIP file. Named like a chessboard (A1, B2...) for easy on-site layout."})]})]})]}),c.jsxs("section",{id:"palette",className:"palette-section",children:[c.jsxs("div",{className:"section-header light",children:[c.jsx("span",{className:"section-tag",children:"Palette"}),c.jsx("h2",{children:"21 Standard TPV Colours"}),c.jsx("p",{className:"section-subtitle",children:"The complete Rosehill TPV granule palette at your fingertips"})]}),c.jsx("div",{className:"palette-grid",children:Ed.map((v,g)=>c.jsxs("div",{className:"palette-swatch",style:{"--swatch-color":v.hex,"--delay":`${g*.03}s`},children:[c.jsx("div",{className:"swatch-color"}),c.jsxs("div",{className:"swatch-info",children:[c.jsx("span",{className:"swatch-name",children:v.name}),c.jsx("span",{className:"swatch-code",children:v.code})]})]},v.code))})]}),c.jsx("section",{className:"benefits",children:c.jsxs("div",{className:"benefits-grid",children:[c.jsxs("div",{className:"benefit",children:[c.jsx("div",{className:"benefit-metric",children:"10x"}),c.jsx("div",{className:"benefit-label",children:"Faster Design Process"}),c.jsx("p",{children:"What took hours of manual colour matching now takes minutes with AI automation."})]}),c.jsxs("div",{className:"benefit",children:[c.jsx("div",{className:"benefit-metric",children:"100%"}),c.jsx("div",{className:"benefit-label",children:"Production Accurate"}),c.jsx("p",{children:"Recipes use exact TPV granule components with precise ratio specifications."})]}),c.jsxs("div",{className:"benefit",children:[c.jsx("div",{className:"benefit-metric",children:"21"}),c.jsx("div",{className:"benefit-label",children:"Standard Colours"}),c.jsx("p",{children:"Full access to the complete Rosehill TPV palette with blend combinations."})]})]})}),c.jsx("section",{className:"cta-footer",children:c.jsxs("div",{className:"cta-content",children:[c.jsx("h2",{children:"Ready to Transform Your Workflow?"}),c.jsx("p",{children:"Start designing playground surfaces with AI-powered precision."}),c.jsxs("button",{onClick:()=>u(!0),className:"cta-primary large",children:["Sign In to TPV Studio",c.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:c.jsx("path",{d:"M5 12h14M12 5l7 7-7 7"})})]}),c.jsxs("p",{className:"cta-note",children:["Need an account? Contact ",c.jsx("a",{href:"mailto:info@rosehill.group",children:"info@rosehill.group"})]})]})}),l&&c.jsx("div",{className:"modal-overlay",onClick:()=>u(!1),children:c.jsxs("div",{className:"sign-in-modal",onClick:v=>v.stopPropagation(),children:[c.jsx("button",{className:"modal-close",onClick:()=>u(!1),children:c.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:c.jsx("path",{d:"M18 6L6 18M6 6l12 12"})})}),c.jsxs("div",{className:"modal-header",children:[c.jsx("h2",{children:"Sign In"}),c.jsx("p",{children:"Access your TPV Studio account"})]}),i&&c.jsx("div",{className:"form-error",children:i}),c.jsxs("form",{onSubmit:f,children:[c.jsxs("div",{className:"form-group",children:[c.jsx("label",{children:"Email"}),c.jsx("input",{type:"email",value:t,onChange:v=>e(v.target.value),placeholder:"your.email@company.com",required:!0})]}),c.jsxs("div",{className:"form-group",children:[c.jsx("label",{children:"Password"}),c.jsx("input",{type:"password",value:r,onChange:v=>n(v.target.value),required:!0})]}),c.jsx("button",{type:"submit",disabled:s,className:"submit-btn",children:s?"Signing in...":"Sign In"})]}),c.jsx("p",{className:"modal-footer-text",children:"Don't have an account? Contact your administrator."})]})}),c.jsx("style",{jsx:!0,children:`
        /* ============================================
           TPV STUDIO LANDING PAGE
           Aesthetic: Sophisticated Industrial-Creative
           ============================================ */

        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap');

        .landing-page {
          --primary: #1e4a7a;
          --primary-light: #2a5a8e;
          --accent: #ff6b35;
          --accent-hover: #e55a2a;
          --text: #1a202c;
          --text-secondary: #64748b;
          --text-light: #94a3b8;
          --bg: #fafbfc;
          --bg-dark: #0f172a;
          --card: #ffffff;
          --border: #e2e8f0;

          font-family: 'DM Sans', sans-serif;
          background: var(--bg);
          color: var(--text);
          overflow-x: hidden;
        }

        /* Navigation */
        .landing-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 3rem;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
        }

        .nav-logo {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .logo-text {
          color: var(--primary);
        }

        .logo-accent {
          color: var(--accent);
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .nav-links button {
          background: none;
          border: none;
          font-family: inherit;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary);
          cursor: pointer;
          transition: color 0.2s;
        }

        .nav-links button:hover {
          color: var(--text);
        }

        .nav-cta {
          background: var(--primary) !important;
          color: white !important;
          padding: 0.5rem 1.25rem !important;
          border-radius: 6px !important;
        }

        .nav-cta:hover {
          background: var(--primary-light) !important;
        }

        /* Hero Section */
        .hero {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          padding: 8rem 4rem 4rem;
          position: relative;
          overflow: hidden;
        }

        .hero-background {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .granule-field {
          position: absolute;
          inset: 0;
        }

        .granule {
          position: absolute;
          left: var(--x);
          top: var(--y);
          width: var(--size);
          height: var(--size);
          background: var(--color);
          border-radius: 50%;
          opacity: 0.15;
          animation: float 8s ease-in-out infinite;
          animation-delay: var(--delay);
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.1); }
        }

        .hero-content {
          position: relative;
          z-index: 10;
        }

        .hero-badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          background: rgba(30, 74, 122, 0.1);
          color: var(--primary);
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          border-radius: 50px;
          margin-bottom: 1.5rem;
        }

        .hero h1 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 3.5rem;
          font-weight: 700;
          line-height: 1.1;
          margin: 0 0 1.5rem;
        }

        .hero-line-1 {
          display: block;
          color: var(--text-secondary);
        }

        .hero-line-2 {
          display: block;
          color: var(--primary);
        }

        .hero-subtitle {
          font-size: 1.125rem;
          color: var(--text-secondary);
          line-height: 1.7;
          max-width: 480px;
          margin-bottom: 2rem;
        }

        .hero-ctas {
          display: flex;
          gap: 1rem;
        }

        .cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          background: var(--accent);
          color: white;
          border: none;
          border-radius: 8px;
          font-family: inherit;
          font-size: 0.9375rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cta-primary:hover {
          background: var(--accent-hover);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(255, 107, 53, 0.3);
        }

        .cta-primary.large {
          padding: 1rem 2rem;
          font-size: 1rem;
        }

        .cta-secondary {
          padding: 0.875rem 1.5rem;
          background: white;
          color: var(--text);
          border: 2px solid var(--border);
          border-radius: 8px;
          font-family: inherit;
          font-size: 0.9375rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cta-secondary:hover {
          border-color: var(--primary);
          color: var(--primary);
        }

        /* Hero Visual / Mockup */
        .hero-visual {
          position: relative;
          z-index: 10;
          display: flex;
          justify-content: center;
        }

        .mockup-container {
          perspective: 1000px;
        }

        .mockup-screen {
          width: 400px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.15);
          overflow: hidden;
          transform: rotateY(-5deg) rotateX(2deg);
          animation: mockupFloat 6s ease-in-out infinite;
        }

        @keyframes mockupFloat {
          0%, 100% { transform: rotateY(-5deg) rotateX(2deg) translateY(0); }
          50% { transform: rotateY(-5deg) rotateX(2deg) translateY(-10px); }
        }

        .mockup-header {
          padding: 0.75rem 1rem;
          background: #f8f8f8;
          border-bottom: 1px solid #eee;
        }

        .mockup-dots {
          display: flex;
          gap: 6px;
        }

        .mockup-dots span {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #ddd;
        }

        .mockup-dots span:nth-child(1) { background: #ff5f56; }
        .mockup-dots span:nth-child(2) { background: #ffbd2e; }
        .mockup-dots span:nth-child(3) { background: #27ca41; }

        .mockup-content {
          padding: 1.5rem;
        }

        .mockup-input {
          background: #f5f5f5;
          padding: 1rem;
          border-radius: 8px;
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
        }

        .typing-text {
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          border-right: 2px solid var(--primary);
          animation: typing 5s steps(40, end) forwards, blink 0.7s step-end infinite;
        }

        @keyframes typing {
          0% { max-width: 0; }
          35% { max-width: 500px; }
          65% { max-width: 500px; }
          100% { max-width: 0; }
        }

        @keyframes blink {
          50% { border-color: transparent; }
        }

        .mockup-preview {
          height: 180px;
          background: linear-gradient(135deg, #e8f4f8, #f0f4ff);
          border-radius: 8px;
          position: relative;
          overflow: hidden;
        }

        .preview-shape {
          position: absolute;
          border-radius: 50%;
          animation: shapeReveal 4s ease-out infinite;
        }

        .shape-1 {
          width: 80px;
          height: 80px;
          background: var(--accent);
          opacity: 0.8;
          top: 20%;
          left: 15%;
          animation-delay: 0s;
        }

        .shape-2 {
          width: 60px;
          height: 60px;
          background: #30D5C8;
          opacity: 0.8;
          top: 40%;
          left: 50%;
          animation-delay: 0.3s;
        }

        .shape-3 {
          width: 100px;
          height: 100px;
          background: var(--primary);
          opacity: 0.8;
          top: 50%;
          right: 10%;
          animation-delay: 0.6s;
        }

        @keyframes shapeReveal {
          0%, 100% { transform: scale(0.8); opacity: 0.4; }
          50% { transform: scale(1); opacity: 0.8; }
        }

        /* Section Headers */
        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .section-header.light h2,
        .section-header.light .section-subtitle {
          color: white;
        }

        .section-header.light .section-tag {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.9);
        }

        .section-tag {
          display: inline-block;
          padding: 0.375rem 0.875rem;
          background: rgba(30, 74, 122, 0.1);
          color: var(--primary);
          font-size: 0.6875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          border-radius: 50px;
          margin-bottom: 1rem;
        }

        .section-header h2 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--text);
          margin: 0;
        }

        .section-subtitle {
          margin-top: 1rem;
          font-size: 1.125rem;
          color: var(--text-secondary);
        }

        /* How It Works */
        .how-it-works {
          padding: 6rem 4rem;
          background: white;
        }

        .steps-container {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          gap: 1rem;
        }

        .step {
          flex: 1;
          max-width: 280px;
          text-align: center;
          padding: 2rem 1.5rem;
        }

        .step-number {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 3rem;
          font-weight: 700;
          color: rgba(30, 74, 122, 0.1);
          margin-bottom: 1rem;
        }

        .step-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 107, 53, 0.1);
          border-radius: 16px;
          color: var(--accent);
        }

        .step h3 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0 0 0.75rem;
          color: var(--text);
        }

        .step p {
          font-size: 0.9375rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        .step-connector {
          width: 100px;
          padding-top: 5rem;
          color: var(--border);
        }

        /* Features */
        .features {
          padding: 6rem 4rem;
          background: var(--bg);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .feature-card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          border: 1px solid var(--border);
          transition: all 0.3s;
        }

        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
        }

        .feature-highlight {
          grid-column: span 2;
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          color: white;
          border: none;
        }

        .feature-highlight .feature-icon {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .feature-highlight h3 {
          color: white;
        }

        .feature-highlight p {
          color: rgba(255, 255, 255, 0.9);
        }

        .feature-icon {
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(30, 74, 122, 0.1);
          border-radius: 12px;
          color: var(--primary);
          margin-bottom: 1.25rem;
        }

        .feature-card h3 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.125rem;
          font-weight: 600;
          margin: 0 0 0.5rem;
        }

        .feature-card p {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        .feature-example {
          margin-top: 1.5rem;
          padding: 0.875rem 1rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          font-size: 0.8125rem;
          font-style: italic;
          opacity: 0.9;
        }

        /* Palette Section */
        .palette-section {
          padding: 6rem 4rem;
          background: var(--bg-dark);
        }

        .palette-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 1rem;
          max-width: 1000px;
          margin: 0 auto;
        }

        .palette-swatch {
          animation: swatchReveal 0.5s ease-out forwards;
          animation-delay: var(--delay);
          opacity: 0;
          transform: translateY(20px);
        }

        @keyframes swatchReveal {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .swatch-color {
          aspect-ratio: 1;
          background: var(--swatch-color);
          border-radius: 8px;
          margin-bottom: 0.5rem;
          transition: transform 0.2s;
        }

        .palette-swatch:hover .swatch-color {
          transform: scale(1.1);
        }

        .swatch-info {
          text-align: center;
        }

        .swatch-name {
          display: block;
          font-size: 0.6875rem;
          font-weight: 500;
          color: white;
        }

        .swatch-code {
          display: block;
          font-size: 0.625rem;
          color: rgba(255, 255, 255, 0.5);
        }

        /* Benefits */
        .benefits {
          padding: 6rem 4rem;
          background: white;
        }

        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 3rem;
          max-width: 1000px;
          margin: 0 auto;
          text-align: center;
        }

        .benefit-metric {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 4rem;
          font-weight: 700;
          color: var(--accent);
          line-height: 1;
        }

        .benefit-label {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text);
          margin: 0.5rem 0 1rem;
        }

        .benefit p {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }

        /* CTA Footer */
        .cta-footer {
          padding: 6rem 4rem;
          background: var(--bg);
          text-align: center;
        }

        .cta-content h2 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--text);
          margin: 0 0 1rem;
        }

        .cta-content > p {
          font-size: 1.125rem;
          color: var(--text-secondary);
          margin-bottom: 2rem;
        }

        .cta-note {
          margin-top: 1.5rem;
          font-size: 0.875rem;
          color: var(--text-light);
        }

        .cta-note a {
          color: var(--primary);
          text-decoration: none;
        }

        .cta-note a:hover {
          text-decoration: underline;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 2rem;
        }

        .sign-in-modal {
          background: white;
          border-radius: 16px;
          padding: 2.5rem;
          width: 100%;
          max-width: 400px;
          position: relative;
          animation: modalSlide 0.3s ease-out;
        }

        @keyframes modalSlide {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
        }

        .modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          color: var(--text-light);
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .modal-close:hover {
          background: var(--bg);
          color: var(--text);
        }

        .modal-header {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .modal-header h2 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0 0 0.25rem;
        }

        .modal-header p {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin: 0;
        }

        .form-error {
          padding: 0.75rem 1rem;
          background: #fef2f2;
          color: #dc2626;
          border-radius: 8px;
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .form-group input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid var(--border);
          border-radius: 8px;
          font-family: inherit;
          font-size: 0.9375rem;
          transition: all 0.2s;
        }

        .form-group input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(30, 74, 122, 0.1);
        }

        .submit-btn {
          width: 100%;
          padding: 0.875rem;
          background: var(--accent);
          color: white;
          border: none;
          border-radius: 8px;
          font-family: inherit;
          font-size: 0.9375rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .submit-btn:hover:not(:disabled) {
          background: var(--accent-hover);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .modal-footer-text {
          text-align: center;
          font-size: 0.8125rem;
          color: var(--text-light);
          margin: 1.5rem 0 0;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .hero {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .hero-content {
            max-width: 600px;
            margin: 0 auto;
          }

          .hero-subtitle {
            margin-left: auto;
            margin-right: auto;
          }

          .hero-ctas {
            justify-content: center;
          }

          .hero-visual {
            display: none;
          }

          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .feature-highlight {
            grid-column: span 2;
          }

          .palette-grid {
            grid-template-columns: repeat(5, 1fr);
          }
        }

        @media (max-width: 768px) {
          .landing-nav {
            padding: 1rem 1.5rem;
          }

          .nav-links {
            gap: 1rem;
          }

          .hero {
            padding: 6rem 1.5rem 3rem;
          }

          .hero h1 {
            font-size: 2.5rem;
          }

          .steps-container {
            flex-direction: column;
            gap: 0;
          }

          .step-connector {
            display: none;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .feature-highlight {
            grid-column: span 1;
          }

          .section-header h2 {
            font-size: 2rem;
          }

          .how-it-works,
          .features,
          .palette-section,
          .benefits,
          .cta-footer {
            padding: 4rem 1.5rem;
          }

          .benefits-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .palette-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        @media (max-width: 480px) {
          .nav-links button:not(.nav-cta) {
            display: none;
          }

          .hero h1 {
            font-size: 2rem;
          }

          .cta-content h2 {
            font-size: 1.75rem;
          }

          .palette-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `})]})}function c7({user:t,onPasswordSet:e}){const[r,n]=$.useState(""),[i,o]=$.useState(""),[s,a]=$.useState(!1),[l,u]=$.useState(""),d=async h=>{if(h.preventDefault(),u(""),r.length<8){u("Password must be at least 8 characters long");return}if(r!==i){u("Passwords do not match");return}a(!0);try{await mn.updatePassword(r),console.log("[SET-PASSWORD] Password set successfully"),e()}catch(f){console.error("[SET-PASSWORD] Failed to set password:",f),u(f.message||"Failed to set password. Please try again.")}finally{a(!1)}};return c.jsx("div",{className:"tpv-studio",children:c.jsx("div",{className:"tpv-studio__container",style:{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh"},children:c.jsxs("div",{style:{maxWidth:"400px",width:"100%",padding:"2rem",background:"#fff",borderRadius:"8px",boxShadow:"0 2px 8px rgba(0,0,0,0.1)"},children:[c.jsx("h2",{style:{marginBottom:"0.5rem",fontSize:"1.5rem"},children:"Welcome to TPV Studio"}),c.jsxs("p",{style:{marginBottom:"1.5rem",color:"#666",fontSize:"0.9rem"},children:["Please set a password for your account: ",c.jsx("strong",{children:t.email})]}),c.jsxs("form",{onSubmit:d,children:[c.jsxs("div",{style:{marginBottom:"1rem"},children:[c.jsx("label",{style:{display:"block",marginBottom:"0.5rem",fontSize:"0.9rem",fontWeight:"500"},children:"New Password"}),c.jsx("input",{type:"password",value:r,onChange:h=>n(h.target.value),placeholder:"Enter your password",required:!0,minLength:8,style:{width:"100%",padding:"0.75rem",border:"1px solid #ddd",borderRadius:"4px",fontSize:"1rem"}}),c.jsx("small",{style:{display:"block",marginTop:"0.25rem",color:"#666"},children:"At least 8 characters"})]}),c.jsxs("div",{style:{marginBottom:"1.5rem"},children:[c.jsx("label",{style:{display:"block",marginBottom:"0.5rem",fontSize:"0.9rem",fontWeight:"500"},children:"Confirm Password"}),c.jsx("input",{type:"password",value:i,onChange:h=>o(h.target.value),placeholder:"Confirm your password",required:!0,minLength:8,style:{width:"100%",padding:"0.75rem",border:"1px solid #ddd",borderRadius:"4px",fontSize:"1rem"}})]}),l&&c.jsx("div",{style:{padding:"0.75rem",marginBottom:"1rem",background:"#fee",border:"1px solid #fcc",borderRadius:"4px",color:"#c00",fontSize:"0.9rem"},children:l}),c.jsx("button",{type:"submit",disabled:s,style:{width:"100%",padding:"0.75rem",background:s?"#ccc":"#007bff",color:"#fff",border:"none",borderRadius:"4px",fontSize:"1rem",fontWeight:"500",cursor:s?"not-allowed":"pointer"},children:s?"Setting Password...":"Set Password"})]})]})})})}function u7(){const[t,e]=$.useState(null),[r,n]=$.useState(!0),[i,o]=$.useState(!1),[s,a]=$.useState(!1),[l,u]=$.useState(!1),[d,h]=$.useState(null),[f,p]=$.useState(null),[v,g]=$.useState(!1),[b,m]=$.useState(null),y=async()=>{try{const S=await mn.getSession();if(console.log("[APP] Session object:",S),console.log("[APP] Access token:",S==null?void 0:S.access_token),!(S!=null&&S.access_token)){console.warn("[APP] No access token found in session"),u(!1);return}const C=await fetch("/api/admin/users",{headers:{Authorization:`Bearer ${S.access_token}`}});console.log("[APP] Admin check response:",C.status,C.ok),u(C.ok)}catch(S){console.error("[APP] Admin check failed:",S),u(!1)}};$.useEffect(()=>{mn.getSession().then(C=>{var E;const N=(C==null?void 0:C.user)||null;if(e(N),n(!1),N){const A=(E=N.user_metadata)==null?void 0:E.password_setup_complete;g(!A),y()}});const{data:S}=mn.onAuthStateChange((C,N)=>{var A;const E=(N==null?void 0:N.user)||null;if(e(E),E){const U=(A=E.user_metadata)==null?void 0:A.password_setup_complete;g(!U),y()}else u(!1),g(!1)});return()=>S==null?void 0:S.unsubscribe()},[]);const x=S=>{console.log("[APP] Loading design:",S),console.log("[APP] Design original_svg_url:",S.original_svg_url),console.log("[APP] Design ID:",S.id),h(S),p(S.name),console.log("[INSPIRE] Loaded design:",S.name)},w=S=>{p(S)},j=async()=>{console.log("[APP] Password set successfully"),g(!1);const S=await mn.getSession();e((S==null?void 0:S.user)||null)};return r?c.jsx("div",{className:"tpv-studio",children:c.jsx("div",{className:"tpv-studio__container",children:c.jsxs("div",{className:"tpv-studio__empty",children:[c.jsx("div",{className:"tpv-studio__spinner"}),c.jsx("p",{children:"Loading..."})]})})}):t?v?c.jsx(c7,{user:t,onPasswordSet:j}):s?c.jsx("div",{className:"tpv-studio",children:c.jsx(t7,{onClose:()=>a(!1)})}):b?b==="sports"?c.jsx(Lm,{children:c.jsxs("div",{className:"tpv-studio",children:[c.jsx(Bv,{onShowDesigns:()=>o(!0),onShowAdmin:()=>a(!0),isAdmin:l,currentDesignName:"Sports Surface",onBackToTools:()=>m(null)}),c.jsx("main",{className:"tpv-studio__container",children:c.jsx(XB,{})}),i&&c.jsx(Uv,{onClose:()=>o(!1),onLoadDesign:x})]})}):c.jsx(Lm,{children:c.jsxs("div",{className:"tpv-studio",children:[c.jsx(Bv,{onShowDesigns:()=>o(!0),onShowAdmin:()=>a(!0),isAdmin:l,currentDesignName:f,onBackToTools:()=>m(null)}),c.jsx("main",{className:"tpv-studio__container",children:c.jsx(bB,{loadedDesign:d,onDesignSaved:w})}),i&&c.jsx(Uv,{onClose:()=>o(!1),onLoadDesign:x})]})}):c.jsx("div",{className:"tpv-studio",children:c.jsx(ZB,{onSelectTool:m})}):c.jsx(l7,{})}Cd.createRoot(document.getElementById("root")).render(c.jsx(P.StrictMode,{children:c.jsx(u7,{})}))});export default d7();
//# sourceMappingURL=index-XgKXK7VS.js.map
