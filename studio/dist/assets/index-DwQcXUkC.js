var z1=Object.defineProperty;var F1=(t,e,r)=>e in t?z1(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r;var B1=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports);var Jp=(t,e,r)=>F1(t,typeof e!="symbol"?e+"":e,r);var OU=B1((fr,pr)=>{function U1(t,e){for(var r=0;r<e.length;r++){const n=e[r];if(typeof n!="string"&&!Array.isArray(n)){for(const i in n)if(i!=="default"&&!(i in t)){const o=Object.getOwnPropertyDescriptor(n,i);o&&Object.defineProperty(t,i,o.get?o:{enumerable:!0,get:()=>n[i]})}}}return Object.freeze(Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}))}(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function r(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(i){if(i.ep)return;i.ep=!0;const o=r(i);fetch(i.href,o)}})();var Un=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function zc(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}function H1(t){if(t.__esModule)return t;var e=t.default;if(typeof e=="function"){var r=function n(){return this instanceof n?Reflect.construct(e,arguments,this.constructor):e.apply(this,arguments)};r.prototype=e.prototype}else r={};return Object.defineProperty(r,"__esModule",{value:!0}),Object.keys(t).forEach(function(n){var i=Object.getOwnPropertyDescriptor(t,n);Object.defineProperty(r,n,i.get?i:{enumerable:!0,get:function(){return t[n]}})}),r}var qv={exports:{}},Fc={},Kv={exports:{}},He={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Da=Symbol.for("react.element"),W1=Symbol.for("react.portal"),G1=Symbol.for("react.fragment"),V1=Symbol.for("react.strict_mode"),q1=Symbol.for("react.profiler"),K1=Symbol.for("react.provider"),Y1=Symbol.for("react.context"),X1=Symbol.for("react.forward_ref"),Z1=Symbol.for("react.suspense"),J1=Symbol.for("react.memo"),Q1=Symbol.for("react.lazy"),Qp=Symbol.iterator;function e_(t){return t===null||typeof t!="object"?null:(t=Qp&&t[Qp]||t["@@iterator"],typeof t=="function"?t:null)}var Yv={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},Xv=Object.assign,Zv={};function ss(t,e,r){this.props=t,this.context=e,this.refs=Zv,this.updater=r||Yv}ss.prototype.isReactComponent={};ss.prototype.setState=function(t,e){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,e,"setState")};ss.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function Jv(){}Jv.prototype=ss.prototype;function qh(t,e,r){this.props=t,this.context=e,this.refs=Zv,this.updater=r||Yv}var Kh=qh.prototype=new Jv;Kh.constructor=qh;Xv(Kh,ss.prototype);Kh.isPureReactComponent=!0;var em=Array.isArray,Qv=Object.prototype.hasOwnProperty,Yh={current:null},ey={key:!0,ref:!0,__self:!0,__source:!0};function ty(t,e,r){var n,i={},o=null,s=null;if(e!=null)for(n in e.ref!==void 0&&(s=e.ref),e.key!==void 0&&(o=""+e.key),e)Qv.call(e,n)&&!ey.hasOwnProperty(n)&&(i[n]=e[n]);var a=arguments.length-2;if(a===1)i.children=r;else if(1<a){for(var c=Array(a),u=0;u<a;u++)c[u]=arguments[u+2];i.children=c}if(t&&t.defaultProps)for(n in a=t.defaultProps,a)i[n]===void 0&&(i[n]=a[n]);return{$$typeof:Da,type:t,key:o,ref:s,props:i,_owner:Yh.current}}function t_(t,e){return{$$typeof:Da,type:t.type,key:e,ref:t.ref,props:t.props,_owner:t._owner}}function Xh(t){return typeof t=="object"&&t!==null&&t.$$typeof===Da}function r_(t){var e={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(r){return e[r]})}var tm=/\/+/g;function Cu(t,e){return typeof t=="object"&&t!==null&&t.key!=null?r_(""+t.key):e.toString(36)}function Fl(t,e,r,n,i){var o=typeof t;(o==="undefined"||o==="boolean")&&(t=null);var s=!1;if(t===null)s=!0;else switch(o){case"string":case"number":s=!0;break;case"object":switch(t.$$typeof){case Da:case W1:s=!0}}if(s)return s=t,i=i(s),t=n===""?"."+Cu(s,0):n,em(i)?(r="",t!=null&&(r=t.replace(tm,"$&/")+"/"),Fl(i,e,r,"",function(u){return u})):i!=null&&(Xh(i)&&(i=t_(i,r+(!i.key||s&&s.key===i.key?"":(""+i.key).replace(tm,"$&/")+"/")+t)),e.push(i)),1;if(s=0,n=n===""?".":n+":",em(t))for(var a=0;a<t.length;a++){o=t[a];var c=n+Cu(o,a);s+=Fl(o,e,r,c,i)}else if(c=e_(t),typeof c=="function")for(t=c.call(t),a=0;!(o=t.next()).done;)o=o.value,c=n+Cu(o,a++),s+=Fl(o,e,r,c,i);else if(o==="object")throw e=String(t),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return s}function sl(t,e,r){if(t==null)return t;var n=[],i=0;return Fl(t,n,"","",function(o){return e.call(r,o,i++)}),n}function n_(t){if(t._status===-1){var e=t._result;e=e(),e.then(function(r){(t._status===0||t._status===-1)&&(t._status=1,t._result=r)},function(r){(t._status===0||t._status===-1)&&(t._status=2,t._result=r)}),t._status===-1&&(t._status=0,t._result=e)}if(t._status===1)return t._result.default;throw t._result}var Zt={current:null},Bl={transition:null},i_={ReactCurrentDispatcher:Zt,ReactCurrentBatchConfig:Bl,ReactCurrentOwner:Yh};function ry(){throw Error("act(...) is not supported in production builds of React.")}He.Children={map:sl,forEach:function(t,e,r){sl(t,function(){e.apply(this,arguments)},r)},count:function(t){var e=0;return sl(t,function(){e++}),e},toArray:function(t){return sl(t,function(e){return e})||[]},only:function(t){if(!Xh(t))throw Error("React.Children.only expected to receive a single React element child.");return t}};He.Component=ss;He.Fragment=G1;He.Profiler=q1;He.PureComponent=qh;He.StrictMode=V1;He.Suspense=Z1;He.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=i_;He.act=ry;He.cloneElement=function(t,e,r){if(t==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+t+".");var n=Xv({},t.props),i=t.key,o=t.ref,s=t._owner;if(e!=null){if(e.ref!==void 0&&(o=e.ref,s=Yh.current),e.key!==void 0&&(i=""+e.key),t.type&&t.type.defaultProps)var a=t.type.defaultProps;for(c in e)Qv.call(e,c)&&!ey.hasOwnProperty(c)&&(n[c]=e[c]===void 0&&a!==void 0?a[c]:e[c])}var c=arguments.length-2;if(c===1)n.children=r;else if(1<c){a=Array(c);for(var u=0;u<c;u++)a[u]=arguments[u+2];n.children=a}return{$$typeof:Da,type:t.type,key:i,ref:o,props:n,_owner:s}};He.createContext=function(t){return t={$$typeof:Y1,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},t.Provider={$$typeof:K1,_context:t},t.Consumer=t};He.createElement=ty;He.createFactory=function(t){var e=ty.bind(null,t);return e.type=t,e};He.createRef=function(){return{current:null}};He.forwardRef=function(t){return{$$typeof:X1,render:t}};He.isValidElement=Xh;He.lazy=function(t){return{$$typeof:Q1,_payload:{_status:-1,_result:t},_init:n_}};He.memo=function(t,e){return{$$typeof:J1,type:t,compare:e===void 0?null:e}};He.startTransition=function(t){var e=Bl.transition;Bl.transition={};try{t()}finally{Bl.transition=e}};He.unstable_act=ry;He.useCallback=function(t,e){return Zt.current.useCallback(t,e)};He.useContext=function(t){return Zt.current.useContext(t)};He.useDebugValue=function(){};He.useDeferredValue=function(t){return Zt.current.useDeferredValue(t)};He.useEffect=function(t,e){return Zt.current.useEffect(t,e)};He.useId=function(){return Zt.current.useId()};He.useImperativeHandle=function(t,e,r){return Zt.current.useImperativeHandle(t,e,r)};He.useInsertionEffect=function(t,e){return Zt.current.useInsertionEffect(t,e)};He.useLayoutEffect=function(t,e){return Zt.current.useLayoutEffect(t,e)};He.useMemo=function(t,e){return Zt.current.useMemo(t,e)};He.useReducer=function(t,e,r){return Zt.current.useReducer(t,e,r)};He.useRef=function(t){return Zt.current.useRef(t)};He.useState=function(t){return Zt.current.useState(t)};He.useSyncExternalStore=function(t,e,r){return Zt.current.useSyncExternalStore(t,e,r)};He.useTransition=function(){return Zt.current.useTransition()};He.version="18.3.1";Kv.exports=He;var M=Kv.exports;const $=zc(M);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var o_=M,s_=Symbol.for("react.element"),a_=Symbol.for("react.fragment"),l_=Object.prototype.hasOwnProperty,c_=o_.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,u_={key:!0,ref:!0,__self:!0,__source:!0};function ny(t,e,r){var n,i={},o=null,s=null;r!==void 0&&(o=""+r),e.key!==void 0&&(o=""+e.key),e.ref!==void 0&&(s=e.ref);for(n in e)l_.call(e,n)&&!u_.hasOwnProperty(n)&&(i[n]=e[n]);if(t&&t.defaultProps)for(n in e=t.defaultProps,e)i[n]===void 0&&(i[n]=e[n]);return{$$typeof:s_,type:t,key:o,ref:s,props:i,_owner:c_.current}}Fc.Fragment=a_;Fc.jsx=ny;Fc.jsxs=ny;qv.exports=Fc;var l=qv.exports,Ed={},iy={exports:{}},yr={},oy={exports:{}},sy={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(t){function e(V,A){var K=V.length;V.push(A);e:for(;0<K;){var L=K-1>>>1,B=V[L];if(0<i(B,A))V[L]=A,V[K]=B,K=L;else break e}}function r(V){return V.length===0?null:V[0]}function n(V){if(V.length===0)return null;var A=V[0],K=V.pop();if(K!==A){V[0]=K;e:for(var L=0,B=V.length,fe=B>>>1;L<fe;){var te=2*(L+1)-1,ae=V[te],ge=te+1,je=V[ge];if(0>i(ae,K))ge<B&&0>i(je,ae)?(V[L]=je,V[ge]=K,L=ge):(V[L]=ae,V[te]=K,L=te);else if(ge<B&&0>i(je,K))V[L]=je,V[ge]=K,L=ge;else break e}}return A}function i(V,A){var K=V.sortIndex-A.sortIndex;return K!==0?K:V.id-A.id}if(typeof performance=="object"&&typeof performance.now=="function"){var o=performance;t.unstable_now=function(){return o.now()}}else{var s=Date,a=s.now();t.unstable_now=function(){return s.now()-a}}var c=[],u=[],d=1,h=null,f=3,p=!1,g=!1,m=!1,b=typeof setTimeout=="function"?setTimeout:null,v=typeof clearTimeout=="function"?clearTimeout:null,y=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function x(V){for(var A=r(u);A!==null;){if(A.callback===null)n(u);else if(A.startTime<=V)n(u),A.sortIndex=A.expirationTime,e(c,A);else break;A=r(u)}}function S(V){if(m=!1,x(V),!g)if(r(c)!==null)g=!0,Z(j);else{var A=r(u);A!==null&&q(S,A.startTime-V)}}function j(V,A){g=!1,m&&(m=!1,v(R),R=-1),p=!0;var K=f;try{for(x(A),h=r(c);h!==null&&(!(h.expirationTime>A)||V&&!H());){var L=h.callback;if(typeof L=="function"){h.callback=null,f=h.priorityLevel;var B=L(h.expirationTime<=A);A=t.unstable_now(),typeof B=="function"?h.callback=B:h===r(c)&&n(c),x(A)}else n(c);h=r(c)}if(h!==null)var fe=!0;else{var te=r(u);te!==null&&q(S,te.startTime-A),fe=!1}return fe}finally{h=null,f=K,p=!1}}var _=!1,C=null,R=-1,T=5,P=-1;function H(){return!(t.unstable_now()-P<T)}function E(){if(C!==null){var V=t.unstable_now();P=V;var A=!0;try{A=C(!0,V)}finally{A?I():(_=!1,C=null)}}else _=!1}var I;if(typeof y=="function")I=function(){y(E)};else if(typeof MessageChannel<"u"){var w=new MessageChannel,z=w.port2;w.port1.onmessage=E,I=function(){z.postMessage(null)}}else I=function(){b(E,0)};function Z(V){C=V,_||(_=!0,I())}function q(V,A){R=b(function(){V(t.unstable_now())},A)}t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(V){V.callback=null},t.unstable_continueExecution=function(){g||p||(g=!0,Z(j))},t.unstable_forceFrameRate=function(V){0>V||125<V?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):T=0<V?Math.floor(1e3/V):5},t.unstable_getCurrentPriorityLevel=function(){return f},t.unstable_getFirstCallbackNode=function(){return r(c)},t.unstable_next=function(V){switch(f){case 1:case 2:case 3:var A=3;break;default:A=f}var K=f;f=A;try{return V()}finally{f=K}},t.unstable_pauseExecution=function(){},t.unstable_requestPaint=function(){},t.unstable_runWithPriority=function(V,A){switch(V){case 1:case 2:case 3:case 4:case 5:break;default:V=3}var K=f;f=V;try{return A()}finally{f=K}},t.unstable_scheduleCallback=function(V,A,K){var L=t.unstable_now();switch(typeof K=="object"&&K!==null?(K=K.delay,K=typeof K=="number"&&0<K?L+K:L):K=L,V){case 1:var B=-1;break;case 2:B=250;break;case 5:B=1073741823;break;case 4:B=1e4;break;default:B=5e3}return B=K+B,V={id:d++,callback:A,priorityLevel:V,startTime:K,expirationTime:B,sortIndex:-1},K>L?(V.sortIndex=K,e(u,V),r(c)===null&&V===r(u)&&(m?(v(R),R=-1):m=!0,q(S,K-L))):(V.sortIndex=B,e(c,V),g||p||(g=!0,Z(j))),V},t.unstable_shouldYield=H,t.unstable_wrapCallback=function(V){var A=f;return function(){var K=f;f=A;try{return V.apply(this,arguments)}finally{f=K}}}})(sy);oy.exports=sy;var d_=oy.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var h_=M,gr=d_;function le(t){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+t,r=1;r<arguments.length;r++)e+="&args[]="+encodeURIComponent(arguments[r]);return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var ay=new Set,ma={};function Ui(t,e){Jo(t,e),Jo(t+"Capture",e)}function Jo(t,e){for(ma[t]=e,t=0;t<e.length;t++)ay.add(e[t])}var xn=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Td=Object.prototype.hasOwnProperty,f_=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,rm={},nm={};function p_(t){return Td.call(nm,t)?!0:Td.call(rm,t)?!1:f_.test(t)?nm[t]=!0:(rm[t]=!0,!1)}function m_(t,e,r,n){if(r!==null&&r.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return n?!1:r!==null?!r.acceptsBooleans:(t=t.toLowerCase().slice(0,5),t!=="data-"&&t!=="aria-");default:return!1}}function g_(t,e,r,n){if(e===null||typeof e>"u"||m_(t,e,r,n))return!0;if(n)return!1;if(r!==null)switch(r.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function Jt(t,e,r,n,i,o,s){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=n,this.attributeNamespace=i,this.mustUseProperty=r,this.propertyName=t,this.type=e,this.sanitizeURL=o,this.removeEmptyString=s}var Dt={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t){Dt[t]=new Jt(t,0,!1,t,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(t){var e=t[0];Dt[e]=new Jt(e,1,!1,t[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(t){Dt[t]=new Jt(t,2,!1,t.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(t){Dt[t]=new Jt(t,2,!1,t,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t){Dt[t]=new Jt(t,3,!1,t.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(t){Dt[t]=new Jt(t,3,!0,t,null,!1,!1)});["capture","download"].forEach(function(t){Dt[t]=new Jt(t,4,!1,t,null,!1,!1)});["cols","rows","size","span"].forEach(function(t){Dt[t]=new Jt(t,6,!1,t,null,!1,!1)});["rowSpan","start"].forEach(function(t){Dt[t]=new Jt(t,5,!1,t.toLowerCase(),null,!1,!1)});var Zh=/[\-:]([a-z])/g;function Jh(t){return t[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t){var e=t.replace(Zh,Jh);Dt[e]=new Jt(e,1,!1,t,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t){var e=t.replace(Zh,Jh);Dt[e]=new Jt(e,1,!1,t,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(t){var e=t.replace(Zh,Jh);Dt[e]=new Jt(e,1,!1,t,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(t){Dt[t]=new Jt(t,1,!1,t.toLowerCase(),null,!1,!1)});Dt.xlinkHref=new Jt("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(t){Dt[t]=new Jt(t,1,!1,t.toLowerCase(),null,!0,!0)});function Qh(t,e,r,n){var i=Dt.hasOwnProperty(e)?Dt[e]:null;(i!==null?i.type!==0:n||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(g_(e,r,i,n)&&(r=null),n||i===null?p_(e)&&(r===null?t.removeAttribute(e):t.setAttribute(e,""+r)):i.mustUseProperty?t[i.propertyName]=r===null?i.type===3?!1:"":r:(e=i.attributeName,n=i.attributeNamespace,r===null?t.removeAttribute(e):(i=i.type,r=i===3||i===4&&r===!0?"":""+r,n?t.setAttributeNS(n,e,r):t.setAttribute(e,r))))}var kn=h_.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,al=Symbol.for("react.element"),Oo=Symbol.for("react.portal"),Ao=Symbol.for("react.fragment"),ef=Symbol.for("react.strict_mode"),Rd=Symbol.for("react.profiler"),ly=Symbol.for("react.provider"),cy=Symbol.for("react.context"),tf=Symbol.for("react.forward_ref"),Nd=Symbol.for("react.suspense"),Pd=Symbol.for("react.suspense_list"),rf=Symbol.for("react.memo"),Mn=Symbol.for("react.lazy"),uy=Symbol.for("react.offscreen"),im=Symbol.iterator;function $s(t){return t===null||typeof t!="object"?null:(t=im&&t[im]||t["@@iterator"],typeof t=="function"?t:null)}var yt=Object.assign,Eu;function Ks(t){if(Eu===void 0)try{throw Error()}catch(r){var e=r.stack.trim().match(/\n( *(at )?)/);Eu=e&&e[1]||""}return`
`+Eu+t}var Tu=!1;function Ru(t,e){if(!t||Tu)return"";Tu=!0;var r=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(u){var n=u}Reflect.construct(t,[],e)}else{try{e.call()}catch(u){n=u}t.call(e.prototype)}else{try{throw Error()}catch(u){n=u}t()}}catch(u){if(u&&n&&typeof u.stack=="string"){for(var i=u.stack.split(`
`),o=n.stack.split(`
`),s=i.length-1,a=o.length-1;1<=s&&0<=a&&i[s]!==o[a];)a--;for(;1<=s&&0<=a;s--,a--)if(i[s]!==o[a]){if(s!==1||a!==1)do if(s--,a--,0>a||i[s]!==o[a]){var c=`
`+i[s].replace(" at new "," at ");return t.displayName&&c.includes("<anonymous>")&&(c=c.replace("<anonymous>",t.displayName)),c}while(1<=s&&0<=a);break}}}finally{Tu=!1,Error.prepareStackTrace=r}return(t=t?t.displayName||t.name:"")?Ks(t):""}function v_(t){switch(t.tag){case 5:return Ks(t.type);case 16:return Ks("Lazy");case 13:return Ks("Suspense");case 19:return Ks("SuspenseList");case 0:case 2:case 15:return t=Ru(t.type,!1),t;case 11:return t=Ru(t.type.render,!1),t;case 1:return t=Ru(t.type,!0),t;default:return""}}function Od(t){if(t==null)return null;if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case Ao:return"Fragment";case Oo:return"Portal";case Rd:return"Profiler";case ef:return"StrictMode";case Nd:return"Suspense";case Pd:return"SuspenseList"}if(typeof t=="object")switch(t.$$typeof){case cy:return(t.displayName||"Context")+".Consumer";case ly:return(t._context.displayName||"Context")+".Provider";case tf:var e=t.render;return t=t.displayName,t||(t=e.displayName||e.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case rf:return e=t.displayName||null,e!==null?e:Od(t.type)||"Memo";case Mn:e=t._payload,t=t._init;try{return Od(t(e))}catch{}}return null}function y_(t){var e=t.type;switch(t.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return t=e.render,t=t.displayName||t.name||"",e.displayName||(t!==""?"ForwardRef("+t+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Od(e);case 8:return e===ef?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function Qn(t){switch(typeof t){case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function dy(t){var e=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function b_(t){var e=dy(t)?"checked":"value",r=Object.getOwnPropertyDescriptor(t.constructor.prototype,e),n=""+t[e];if(!t.hasOwnProperty(e)&&typeof r<"u"&&typeof r.get=="function"&&typeof r.set=="function"){var i=r.get,o=r.set;return Object.defineProperty(t,e,{configurable:!0,get:function(){return i.call(this)},set:function(s){n=""+s,o.call(this,s)}}),Object.defineProperty(t,e,{enumerable:r.enumerable}),{getValue:function(){return n},setValue:function(s){n=""+s},stopTracking:function(){t._valueTracker=null,delete t[e]}}}}function ll(t){t._valueTracker||(t._valueTracker=b_(t))}function hy(t){if(!t)return!1;var e=t._valueTracker;if(!e)return!0;var r=e.getValue(),n="";return t&&(n=dy(t)?t.checked?"true":"false":t.value),t=n,t!==r?(e.setValue(t),!0):!1}function Ql(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}function Ad(t,e){var r=e.checked;return yt({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:r??t._wrapperState.initialChecked})}function om(t,e){var r=e.defaultValue==null?"":e.defaultValue,n=e.checked!=null?e.checked:e.defaultChecked;r=Qn(e.value!=null?e.value:r),t._wrapperState={initialChecked:n,initialValue:r,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function fy(t,e){e=e.checked,e!=null&&Qh(t,"checked",e,!1)}function $d(t,e){fy(t,e);var r=Qn(e.value),n=e.type;if(r!=null)n==="number"?(r===0&&t.value===""||t.value!=r)&&(t.value=""+r):t.value!==""+r&&(t.value=""+r);else if(n==="submit"||n==="reset"){t.removeAttribute("value");return}e.hasOwnProperty("value")?Id(t,e.type,r):e.hasOwnProperty("defaultValue")&&Id(t,e.type,Qn(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(t.defaultChecked=!!e.defaultChecked)}function sm(t,e,r){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var n=e.type;if(!(n!=="submit"&&n!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+t._wrapperState.initialValue,r||e===t.value||(t.value=e),t.defaultValue=e}r=t.name,r!==""&&(t.name=""),t.defaultChecked=!!t._wrapperState.initialChecked,r!==""&&(t.name=r)}function Id(t,e,r){(e!=="number"||Ql(t.ownerDocument)!==t)&&(r==null?t.defaultValue=""+t._wrapperState.initialValue:t.defaultValue!==""+r&&(t.defaultValue=""+r))}var Ys=Array.isArray;function Go(t,e,r,n){if(t=t.options,e){e={};for(var i=0;i<r.length;i++)e["$"+r[i]]=!0;for(r=0;r<t.length;r++)i=e.hasOwnProperty("$"+t[r].value),t[r].selected!==i&&(t[r].selected=i),i&&n&&(t[r].defaultSelected=!0)}else{for(r=""+Qn(r),e=null,i=0;i<t.length;i++){if(t[i].value===r){t[i].selected=!0,n&&(t[i].defaultSelected=!0);return}e!==null||t[i].disabled||(e=t[i])}e!==null&&(e.selected=!0)}}function Md(t,e){if(e.dangerouslySetInnerHTML!=null)throw Error(le(91));return yt({},e,{value:void 0,defaultValue:void 0,children:""+t._wrapperState.initialValue})}function am(t,e){var r=e.value;if(r==null){if(r=e.children,e=e.defaultValue,r!=null){if(e!=null)throw Error(le(92));if(Ys(r)){if(1<r.length)throw Error(le(93));r=r[0]}e=r}e==null&&(e=""),r=e}t._wrapperState={initialValue:Qn(r)}}function py(t,e){var r=Qn(e.value),n=Qn(e.defaultValue);r!=null&&(r=""+r,r!==t.value&&(t.value=r),e.defaultValue==null&&t.defaultValue!==r&&(t.defaultValue=r)),n!=null&&(t.defaultValue=""+n)}function lm(t){var e=t.textContent;e===t._wrapperState.initialValue&&e!==""&&e!==null&&(t.value=e)}function my(t){switch(t){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Ld(t,e){return t==null||t==="http://www.w3.org/1999/xhtml"?my(e):t==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":t}var cl,gy=function(t){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,r,n,i){MSApp.execUnsafeLocalFunction(function(){return t(e,r,n,i)})}:t}(function(t,e){if(t.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in t)t.innerHTML=e;else{for(cl=cl||document.createElement("div"),cl.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=cl.firstChild;t.firstChild;)t.removeChild(t.firstChild);for(;e.firstChild;)t.appendChild(e.firstChild)}});function ga(t,e){if(e){var r=t.firstChild;if(r&&r===t.lastChild&&r.nodeType===3){r.nodeValue=e;return}}t.textContent=e}var ra={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},x_=["Webkit","ms","Moz","O"];Object.keys(ra).forEach(function(t){x_.forEach(function(e){e=e+t.charAt(0).toUpperCase()+t.substring(1),ra[e]=ra[t]})});function vy(t,e,r){return e==null||typeof e=="boolean"||e===""?"":r||typeof e!="number"||e===0||ra.hasOwnProperty(t)&&ra[t]?(""+e).trim():e+"px"}function yy(t,e){t=t.style;for(var r in e)if(e.hasOwnProperty(r)){var n=r.indexOf("--")===0,i=vy(r,e[r],n);r==="float"&&(r="cssFloat"),n?t.setProperty(r,i):t[r]=i}}var w_=yt({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Dd(t,e){if(e){if(w_[t]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(le(137,t));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(le(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(le(61))}if(e.style!=null&&typeof e.style!="object")throw Error(le(62))}}function zd(t,e){if(t.indexOf("-")===-1)return typeof e.is=="string";switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Fd=null;function nf(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var Bd=null,Vo=null,qo=null;function cm(t){if(t=Ba(t)){if(typeof Bd!="function")throw Error(le(280));var e=t.stateNode;e&&(e=Gc(e),Bd(t.stateNode,t.type,e))}}function by(t){Vo?qo?qo.push(t):qo=[t]:Vo=t}function xy(){if(Vo){var t=Vo,e=qo;if(qo=Vo=null,cm(t),e)for(t=0;t<e.length;t++)cm(e[t])}}function wy(t,e){return t(e)}function _y(){}var Nu=!1;function Sy(t,e,r){if(Nu)return t(e,r);Nu=!0;try{return wy(t,e,r)}finally{Nu=!1,(Vo!==null||qo!==null)&&(_y(),xy())}}function va(t,e){var r=t.stateNode;if(r===null)return null;var n=Gc(r);if(n===null)return null;r=n[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(n=!n.disabled)||(t=t.type,n=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!n;break e;default:t=!1}if(t)return null;if(r&&typeof r!="function")throw Error(le(231,e,typeof r));return r}var Ud=!1;if(xn)try{var Is={};Object.defineProperty(Is,"passive",{get:function(){Ud=!0}}),window.addEventListener("test",Is,Is),window.removeEventListener("test",Is,Is)}catch{Ud=!1}function __(t,e,r,n,i,o,s,a,c){var u=Array.prototype.slice.call(arguments,3);try{e.apply(r,u)}catch(d){this.onError(d)}}var na=!1,ec=null,tc=!1,Hd=null,S_={onError:function(t){na=!0,ec=t}};function k_(t,e,r,n,i,o,s,a,c){na=!1,ec=null,__.apply(S_,arguments)}function j_(t,e,r,n,i,o,s,a,c){if(k_.apply(this,arguments),na){if(na){var u=ec;na=!1,ec=null}else throw Error(le(198));tc||(tc=!0,Hd=u)}}function Hi(t){var e=t,r=t;if(t.alternate)for(;e.return;)e=e.return;else{t=e;do e=t,e.flags&4098&&(r=e.return),t=e.return;while(t)}return e.tag===3?r:null}function ky(t){if(t.tag===13){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function um(t){if(Hi(t)!==t)throw Error(le(188))}function C_(t){var e=t.alternate;if(!e){if(e=Hi(t),e===null)throw Error(le(188));return e!==t?null:t}for(var r=t,n=e;;){var i=r.return;if(i===null)break;var o=i.alternate;if(o===null){if(n=i.return,n!==null){r=n;continue}break}if(i.child===o.child){for(o=i.child;o;){if(o===r)return um(i),t;if(o===n)return um(i),e;o=o.sibling}throw Error(le(188))}if(r.return!==n.return)r=i,n=o;else{for(var s=!1,a=i.child;a;){if(a===r){s=!0,r=i,n=o;break}if(a===n){s=!0,n=i,r=o;break}a=a.sibling}if(!s){for(a=o.child;a;){if(a===r){s=!0,r=o,n=i;break}if(a===n){s=!0,n=o,r=i;break}a=a.sibling}if(!s)throw Error(le(189))}}if(r.alternate!==n)throw Error(le(190))}if(r.tag!==3)throw Error(le(188));return r.stateNode.current===r?t:e}function jy(t){return t=C_(t),t!==null?Cy(t):null}function Cy(t){if(t.tag===5||t.tag===6)return t;for(t=t.child;t!==null;){var e=Cy(t);if(e!==null)return e;t=t.sibling}return null}var Ey=gr.unstable_scheduleCallback,dm=gr.unstable_cancelCallback,E_=gr.unstable_shouldYield,T_=gr.unstable_requestPaint,St=gr.unstable_now,R_=gr.unstable_getCurrentPriorityLevel,of=gr.unstable_ImmediatePriority,Ty=gr.unstable_UserBlockingPriority,rc=gr.unstable_NormalPriority,N_=gr.unstable_LowPriority,Ry=gr.unstable_IdlePriority,Bc=null,Jr=null;function P_(t){if(Jr&&typeof Jr.onCommitFiberRoot=="function")try{Jr.onCommitFiberRoot(Bc,t,void 0,(t.current.flags&128)===128)}catch{}}var Fr=Math.clz32?Math.clz32:$_,O_=Math.log,A_=Math.LN2;function $_(t){return t>>>=0,t===0?32:31-(O_(t)/A_|0)|0}var ul=64,dl=4194304;function Xs(t){switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return t&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return t}}function nc(t,e){var r=t.pendingLanes;if(r===0)return 0;var n=0,i=t.suspendedLanes,o=t.pingedLanes,s=r&268435455;if(s!==0){var a=s&~i;a!==0?n=Xs(a):(o&=s,o!==0&&(n=Xs(o)))}else s=r&~i,s!==0?n=Xs(s):o!==0&&(n=Xs(o));if(n===0)return 0;if(e!==0&&e!==n&&!(e&i)&&(i=n&-n,o=e&-e,i>=o||i===16&&(o&4194240)!==0))return e;if(n&4&&(n|=r&16),e=t.entangledLanes,e!==0)for(t=t.entanglements,e&=n;0<e;)r=31-Fr(e),i=1<<r,n|=t[r],e&=~i;return n}function I_(t,e){switch(t){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function M_(t,e){for(var r=t.suspendedLanes,n=t.pingedLanes,i=t.expirationTimes,o=t.pendingLanes;0<o;){var s=31-Fr(o),a=1<<s,c=i[s];c===-1?(!(a&r)||a&n)&&(i[s]=I_(a,e)):c<=e&&(t.expiredLanes|=a),o&=~a}}function Wd(t){return t=t.pendingLanes&-1073741825,t!==0?t:t&1073741824?1073741824:0}function Ny(){var t=ul;return ul<<=1,!(ul&4194240)&&(ul=64),t}function Pu(t){for(var e=[],r=0;31>r;r++)e.push(t);return e}function za(t,e,r){t.pendingLanes|=e,e!==536870912&&(t.suspendedLanes=0,t.pingedLanes=0),t=t.eventTimes,e=31-Fr(e),t[e]=r}function L_(t,e){var r=t.pendingLanes&~e;t.pendingLanes=e,t.suspendedLanes=0,t.pingedLanes=0,t.expiredLanes&=e,t.mutableReadLanes&=e,t.entangledLanes&=e,e=t.entanglements;var n=t.eventTimes;for(t=t.expirationTimes;0<r;){var i=31-Fr(r),o=1<<i;e[i]=0,n[i]=-1,t[i]=-1,r&=~o}}function sf(t,e){var r=t.entangledLanes|=e;for(t=t.entanglements;r;){var n=31-Fr(r),i=1<<n;i&e|t[n]&e&&(t[n]|=e),r&=~i}}var Je=0;function Py(t){return t&=-t,1<t?4<t?t&268435455?16:536870912:4:1}var Oy,af,Ay,$y,Iy,Gd=!1,hl=[],Gn=null,Vn=null,qn=null,ya=new Map,ba=new Map,zn=[],D_="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function hm(t,e){switch(t){case"focusin":case"focusout":Gn=null;break;case"dragenter":case"dragleave":Vn=null;break;case"mouseover":case"mouseout":qn=null;break;case"pointerover":case"pointerout":ya.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":ba.delete(e.pointerId)}}function Ms(t,e,r,n,i,o){return t===null||t.nativeEvent!==o?(t={blockedOn:e,domEventName:r,eventSystemFlags:n,nativeEvent:o,targetContainers:[i]},e!==null&&(e=Ba(e),e!==null&&af(e)),t):(t.eventSystemFlags|=n,e=t.targetContainers,i!==null&&e.indexOf(i)===-1&&e.push(i),t)}function z_(t,e,r,n,i){switch(e){case"focusin":return Gn=Ms(Gn,t,e,r,n,i),!0;case"dragenter":return Vn=Ms(Vn,t,e,r,n,i),!0;case"mouseover":return qn=Ms(qn,t,e,r,n,i),!0;case"pointerover":var o=i.pointerId;return ya.set(o,Ms(ya.get(o)||null,t,e,r,n,i)),!0;case"gotpointercapture":return o=i.pointerId,ba.set(o,Ms(ba.get(o)||null,t,e,r,n,i)),!0}return!1}function My(t){var e=Ti(t.target);if(e!==null){var r=Hi(e);if(r!==null){if(e=r.tag,e===13){if(e=ky(r),e!==null){t.blockedOn=e,Iy(t.priority,function(){Ay(r)});return}}else if(e===3&&r.stateNode.current.memoizedState.isDehydrated){t.blockedOn=r.tag===3?r.stateNode.containerInfo:null;return}}}t.blockedOn=null}function Ul(t){if(t.blockedOn!==null)return!1;for(var e=t.targetContainers;0<e.length;){var r=Vd(t.domEventName,t.eventSystemFlags,e[0],t.nativeEvent);if(r===null){r=t.nativeEvent;var n=new r.constructor(r.type,r);Fd=n,r.target.dispatchEvent(n),Fd=null}else return e=Ba(r),e!==null&&af(e),t.blockedOn=r,!1;e.shift()}return!0}function fm(t,e,r){Ul(t)&&r.delete(e)}function F_(){Gd=!1,Gn!==null&&Ul(Gn)&&(Gn=null),Vn!==null&&Ul(Vn)&&(Vn=null),qn!==null&&Ul(qn)&&(qn=null),ya.forEach(fm),ba.forEach(fm)}function Ls(t,e){t.blockedOn===e&&(t.blockedOn=null,Gd||(Gd=!0,gr.unstable_scheduleCallback(gr.unstable_NormalPriority,F_)))}function xa(t){function e(i){return Ls(i,t)}if(0<hl.length){Ls(hl[0],t);for(var r=1;r<hl.length;r++){var n=hl[r];n.blockedOn===t&&(n.blockedOn=null)}}for(Gn!==null&&Ls(Gn,t),Vn!==null&&Ls(Vn,t),qn!==null&&Ls(qn,t),ya.forEach(e),ba.forEach(e),r=0;r<zn.length;r++)n=zn[r],n.blockedOn===t&&(n.blockedOn=null);for(;0<zn.length&&(r=zn[0],r.blockedOn===null);)My(r),r.blockedOn===null&&zn.shift()}var Ko=kn.ReactCurrentBatchConfig,ic=!0;function B_(t,e,r,n){var i=Je,o=Ko.transition;Ko.transition=null;try{Je=1,lf(t,e,r,n)}finally{Je=i,Ko.transition=o}}function U_(t,e,r,n){var i=Je,o=Ko.transition;Ko.transition=null;try{Je=4,lf(t,e,r,n)}finally{Je=i,Ko.transition=o}}function lf(t,e,r,n){if(ic){var i=Vd(t,e,r,n);if(i===null)Bu(t,e,n,oc,r),hm(t,n);else if(z_(i,t,e,r,n))n.stopPropagation();else if(hm(t,n),e&4&&-1<D_.indexOf(t)){for(;i!==null;){var o=Ba(i);if(o!==null&&Oy(o),o=Vd(t,e,r,n),o===null&&Bu(t,e,n,oc,r),o===i)break;i=o}i!==null&&n.stopPropagation()}else Bu(t,e,n,null,r)}}var oc=null;function Vd(t,e,r,n){if(oc=null,t=nf(n),t=Ti(t),t!==null)if(e=Hi(t),e===null)t=null;else if(r=e.tag,r===13){if(t=ky(e),t!==null)return t;t=null}else if(r===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;t=null}else e!==t&&(t=null);return oc=t,null}function Ly(t){switch(t){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(R_()){case of:return 1;case Ty:return 4;case rc:case N_:return 16;case Ry:return 536870912;default:return 16}default:return 16}}var Hn=null,cf=null,Hl=null;function Dy(){if(Hl)return Hl;var t,e=cf,r=e.length,n,i="value"in Hn?Hn.value:Hn.textContent,o=i.length;for(t=0;t<r&&e[t]===i[t];t++);var s=r-t;for(n=1;n<=s&&e[r-n]===i[o-n];n++);return Hl=i.slice(t,1<n?1-n:void 0)}function Wl(t){var e=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&e===13&&(t=13)):t=e,t===10&&(t=13),32<=t||t===13?t:0}function fl(){return!0}function pm(){return!1}function br(t){function e(r,n,i,o,s){this._reactName=r,this._targetInst=i,this.type=n,this.nativeEvent=o,this.target=s,this.currentTarget=null;for(var a in t)t.hasOwnProperty(a)&&(r=t[a],this[a]=r?r(o):o[a]);return this.isDefaultPrevented=(o.defaultPrevented!=null?o.defaultPrevented:o.returnValue===!1)?fl:pm,this.isPropagationStopped=pm,this}return yt(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var r=this.nativeEvent;r&&(r.preventDefault?r.preventDefault():typeof r.returnValue!="unknown"&&(r.returnValue=!1),this.isDefaultPrevented=fl)},stopPropagation:function(){var r=this.nativeEvent;r&&(r.stopPropagation?r.stopPropagation():typeof r.cancelBubble!="unknown"&&(r.cancelBubble=!0),this.isPropagationStopped=fl)},persist:function(){},isPersistent:fl}),e}var as={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},uf=br(as),Fa=yt({},as,{view:0,detail:0}),H_=br(Fa),Ou,Au,Ds,Uc=yt({},Fa,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:df,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==Ds&&(Ds&&t.type==="mousemove"?(Ou=t.screenX-Ds.screenX,Au=t.screenY-Ds.screenY):Au=Ou=0,Ds=t),Ou)},movementY:function(t){return"movementY"in t?t.movementY:Au}}),mm=br(Uc),W_=yt({},Uc,{dataTransfer:0}),G_=br(W_),V_=yt({},Fa,{relatedTarget:0}),$u=br(V_),q_=yt({},as,{animationName:0,elapsedTime:0,pseudoElement:0}),K_=br(q_),Y_=yt({},as,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),X_=br(Y_),Z_=yt({},as,{data:0}),gm=br(Z_),J_={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Q_={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},e2={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function t2(t){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(t):(t=e2[t])?!!e[t]:!1}function df(){return t2}var r2=yt({},Fa,{key:function(t){if(t.key){var e=J_[t.key]||t.key;if(e!=="Unidentified")return e}return t.type==="keypress"?(t=Wl(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?Q_[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:df,charCode:function(t){return t.type==="keypress"?Wl(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?Wl(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),n2=br(r2),i2=yt({},Uc,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),vm=br(i2),o2=yt({},Fa,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:df}),s2=br(o2),a2=yt({},as,{propertyName:0,elapsedTime:0,pseudoElement:0}),l2=br(a2),c2=yt({},Uc,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),u2=br(c2),d2=[9,13,27,32],hf=xn&&"CompositionEvent"in window,ia=null;xn&&"documentMode"in document&&(ia=document.documentMode);var h2=xn&&"TextEvent"in window&&!ia,zy=xn&&(!hf||ia&&8<ia&&11>=ia),ym=" ",bm=!1;function Fy(t,e){switch(t){case"keyup":return d2.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function By(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var $o=!1;function f2(t,e){switch(t){case"compositionend":return By(e);case"keypress":return e.which!==32?null:(bm=!0,ym);case"textInput":return t=e.data,t===ym&&bm?null:t;default:return null}}function p2(t,e){if($o)return t==="compositionend"||!hf&&Fy(t,e)?(t=Dy(),Hl=cf=Hn=null,$o=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return zy&&e.locale!=="ko"?null:e.data;default:return null}}var m2={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function xm(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e==="input"?!!m2[t.type]:e==="textarea"}function Uy(t,e,r,n){by(n),e=sc(e,"onChange"),0<e.length&&(r=new uf("onChange","change",null,r,n),t.push({event:r,listeners:e}))}var oa=null,wa=null;function g2(t){Qy(t,0)}function Hc(t){var e=Lo(t);if(hy(e))return t}function v2(t,e){if(t==="change")return e}var Hy=!1;if(xn){var Iu;if(xn){var Mu="oninput"in document;if(!Mu){var wm=document.createElement("div");wm.setAttribute("oninput","return;"),Mu=typeof wm.oninput=="function"}Iu=Mu}else Iu=!1;Hy=Iu&&(!document.documentMode||9<document.documentMode)}function _m(){oa&&(oa.detachEvent("onpropertychange",Wy),wa=oa=null)}function Wy(t){if(t.propertyName==="value"&&Hc(wa)){var e=[];Uy(e,wa,t,nf(t)),Sy(g2,e)}}function y2(t,e,r){t==="focusin"?(_m(),oa=e,wa=r,oa.attachEvent("onpropertychange",Wy)):t==="focusout"&&_m()}function b2(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return Hc(wa)}function x2(t,e){if(t==="click")return Hc(e)}function w2(t,e){if(t==="input"||t==="change")return Hc(e)}function _2(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var Ur=typeof Object.is=="function"?Object.is:_2;function _a(t,e){if(Ur(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;var r=Object.keys(t),n=Object.keys(e);if(r.length!==n.length)return!1;for(n=0;n<r.length;n++){var i=r[n];if(!Td.call(e,i)||!Ur(t[i],e[i]))return!1}return!0}function Sm(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function km(t,e){var r=Sm(t);t=0;for(var n;r;){if(r.nodeType===3){if(n=t+r.textContent.length,t<=e&&n>=e)return{node:r,offset:e-t};t=n}e:{for(;r;){if(r.nextSibling){r=r.nextSibling;break e}r=r.parentNode}r=void 0}r=Sm(r)}}function Gy(t,e){return t&&e?t===e?!0:t&&t.nodeType===3?!1:e&&e.nodeType===3?Gy(t,e.parentNode):"contains"in t?t.contains(e):t.compareDocumentPosition?!!(t.compareDocumentPosition(e)&16):!1:!1}function Vy(){for(var t=window,e=Ql();e instanceof t.HTMLIFrameElement;){try{var r=typeof e.contentWindow.location.href=="string"}catch{r=!1}if(r)t=e.contentWindow;else break;e=Ql(t.document)}return e}function ff(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e&&(e==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||e==="textarea"||t.contentEditable==="true")}function S2(t){var e=Vy(),r=t.focusedElem,n=t.selectionRange;if(e!==r&&r&&r.ownerDocument&&Gy(r.ownerDocument.documentElement,r)){if(n!==null&&ff(r)){if(e=n.start,t=n.end,t===void 0&&(t=e),"selectionStart"in r)r.selectionStart=e,r.selectionEnd=Math.min(t,r.value.length);else if(t=(e=r.ownerDocument||document)&&e.defaultView||window,t.getSelection){t=t.getSelection();var i=r.textContent.length,o=Math.min(n.start,i);n=n.end===void 0?o:Math.min(n.end,i),!t.extend&&o>n&&(i=n,n=o,o=i),i=km(r,o);var s=km(r,n);i&&s&&(t.rangeCount!==1||t.anchorNode!==i.node||t.anchorOffset!==i.offset||t.focusNode!==s.node||t.focusOffset!==s.offset)&&(e=e.createRange(),e.setStart(i.node,i.offset),t.removeAllRanges(),o>n?(t.addRange(e),t.extend(s.node,s.offset)):(e.setEnd(s.node,s.offset),t.addRange(e)))}}for(e=[],t=r;t=t.parentNode;)t.nodeType===1&&e.push({element:t,left:t.scrollLeft,top:t.scrollTop});for(typeof r.focus=="function"&&r.focus(),r=0;r<e.length;r++)t=e[r],t.element.scrollLeft=t.left,t.element.scrollTop=t.top}}var k2=xn&&"documentMode"in document&&11>=document.documentMode,Io=null,qd=null,sa=null,Kd=!1;function jm(t,e,r){var n=r.window===r?r.document:r.nodeType===9?r:r.ownerDocument;Kd||Io==null||Io!==Ql(n)||(n=Io,"selectionStart"in n&&ff(n)?n={start:n.selectionStart,end:n.selectionEnd}:(n=(n.ownerDocument&&n.ownerDocument.defaultView||window).getSelection(),n={anchorNode:n.anchorNode,anchorOffset:n.anchorOffset,focusNode:n.focusNode,focusOffset:n.focusOffset}),sa&&_a(sa,n)||(sa=n,n=sc(qd,"onSelect"),0<n.length&&(e=new uf("onSelect","select",null,e,r),t.push({event:e,listeners:n}),e.target=Io)))}function pl(t,e){var r={};return r[t.toLowerCase()]=e.toLowerCase(),r["Webkit"+t]="webkit"+e,r["Moz"+t]="moz"+e,r}var Mo={animationend:pl("Animation","AnimationEnd"),animationiteration:pl("Animation","AnimationIteration"),animationstart:pl("Animation","AnimationStart"),transitionend:pl("Transition","TransitionEnd")},Lu={},qy={};xn&&(qy=document.createElement("div").style,"AnimationEvent"in window||(delete Mo.animationend.animation,delete Mo.animationiteration.animation,delete Mo.animationstart.animation),"TransitionEvent"in window||delete Mo.transitionend.transition);function Wc(t){if(Lu[t])return Lu[t];if(!Mo[t])return t;var e=Mo[t],r;for(r in e)if(e.hasOwnProperty(r)&&r in qy)return Lu[t]=e[r];return t}var Ky=Wc("animationend"),Yy=Wc("animationiteration"),Xy=Wc("animationstart"),Zy=Wc("transitionend"),Jy=new Map,Cm="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function ni(t,e){Jy.set(t,e),Ui(e,[t])}for(var Du=0;Du<Cm.length;Du++){var zu=Cm[Du],j2=zu.toLowerCase(),C2=zu[0].toUpperCase()+zu.slice(1);ni(j2,"on"+C2)}ni(Ky,"onAnimationEnd");ni(Yy,"onAnimationIteration");ni(Xy,"onAnimationStart");ni("dblclick","onDoubleClick");ni("focusin","onFocus");ni("focusout","onBlur");ni(Zy,"onTransitionEnd");Jo("onMouseEnter",["mouseout","mouseover"]);Jo("onMouseLeave",["mouseout","mouseover"]);Jo("onPointerEnter",["pointerout","pointerover"]);Jo("onPointerLeave",["pointerout","pointerover"]);Ui("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Ui("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Ui("onBeforeInput",["compositionend","keypress","textInput","paste"]);Ui("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Ui("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Ui("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Zs="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),E2=new Set("cancel close invalid load scroll toggle".split(" ").concat(Zs));function Em(t,e,r){var n=t.type||"unknown-event";t.currentTarget=r,j_(n,e,void 0,t),t.currentTarget=null}function Qy(t,e){e=(e&4)!==0;for(var r=0;r<t.length;r++){var n=t[r],i=n.event;n=n.listeners;e:{var o=void 0;if(e)for(var s=n.length-1;0<=s;s--){var a=n[s],c=a.instance,u=a.currentTarget;if(a=a.listener,c!==o&&i.isPropagationStopped())break e;Em(i,a,u),o=c}else for(s=0;s<n.length;s++){if(a=n[s],c=a.instance,u=a.currentTarget,a=a.listener,c!==o&&i.isPropagationStopped())break e;Em(i,a,u),o=c}}}if(tc)throw t=Hd,tc=!1,Hd=null,t}function ot(t,e){var r=e[Qd];r===void 0&&(r=e[Qd]=new Set);var n=t+"__bubble";r.has(n)||(eb(e,t,2,!1),r.add(n))}function Fu(t,e,r){var n=0;e&&(n|=4),eb(r,t,n,e)}var ml="_reactListening"+Math.random().toString(36).slice(2);function Sa(t){if(!t[ml]){t[ml]=!0,ay.forEach(function(r){r!=="selectionchange"&&(E2.has(r)||Fu(r,!1,t),Fu(r,!0,t))});var e=t.nodeType===9?t:t.ownerDocument;e===null||e[ml]||(e[ml]=!0,Fu("selectionchange",!1,e))}}function eb(t,e,r,n){switch(Ly(e)){case 1:var i=B_;break;case 4:i=U_;break;default:i=lf}r=i.bind(null,e,r,t),i=void 0,!Ud||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(i=!0),n?i!==void 0?t.addEventListener(e,r,{capture:!0,passive:i}):t.addEventListener(e,r,!0):i!==void 0?t.addEventListener(e,r,{passive:i}):t.addEventListener(e,r,!1)}function Bu(t,e,r,n,i){var o=n;if(!(e&1)&&!(e&2)&&n!==null)e:for(;;){if(n===null)return;var s=n.tag;if(s===3||s===4){var a=n.stateNode.containerInfo;if(a===i||a.nodeType===8&&a.parentNode===i)break;if(s===4)for(s=n.return;s!==null;){var c=s.tag;if((c===3||c===4)&&(c=s.stateNode.containerInfo,c===i||c.nodeType===8&&c.parentNode===i))return;s=s.return}for(;a!==null;){if(s=Ti(a),s===null)return;if(c=s.tag,c===5||c===6){n=o=s;continue e}a=a.parentNode}}n=n.return}Sy(function(){var u=o,d=nf(r),h=[];e:{var f=Jy.get(t);if(f!==void 0){var p=uf,g=t;switch(t){case"keypress":if(Wl(r)===0)break e;case"keydown":case"keyup":p=n2;break;case"focusin":g="focus",p=$u;break;case"focusout":g="blur",p=$u;break;case"beforeblur":case"afterblur":p=$u;break;case"click":if(r.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":p=mm;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":p=G_;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":p=s2;break;case Ky:case Yy:case Xy:p=K_;break;case Zy:p=l2;break;case"scroll":p=H_;break;case"wheel":p=u2;break;case"copy":case"cut":case"paste":p=X_;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":p=vm}var m=(e&4)!==0,b=!m&&t==="scroll",v=m?f!==null?f+"Capture":null:f;m=[];for(var y=u,x;y!==null;){x=y;var S=x.stateNode;if(x.tag===5&&S!==null&&(x=S,v!==null&&(S=va(y,v),S!=null&&m.push(ka(y,S,x)))),b)break;y=y.return}0<m.length&&(f=new p(f,g,null,r,d),h.push({event:f,listeners:m}))}}if(!(e&7)){e:{if(f=t==="mouseover"||t==="pointerover",p=t==="mouseout"||t==="pointerout",f&&r!==Fd&&(g=r.relatedTarget||r.fromElement)&&(Ti(g)||g[wn]))break e;if((p||f)&&(f=d.window===d?d:(f=d.ownerDocument)?f.defaultView||f.parentWindow:window,p?(g=r.relatedTarget||r.toElement,p=u,g=g?Ti(g):null,g!==null&&(b=Hi(g),g!==b||g.tag!==5&&g.tag!==6)&&(g=null)):(p=null,g=u),p!==g)){if(m=mm,S="onMouseLeave",v="onMouseEnter",y="mouse",(t==="pointerout"||t==="pointerover")&&(m=vm,S="onPointerLeave",v="onPointerEnter",y="pointer"),b=p==null?f:Lo(p),x=g==null?f:Lo(g),f=new m(S,y+"leave",p,r,d),f.target=b,f.relatedTarget=x,S=null,Ti(d)===u&&(m=new m(v,y+"enter",g,r,d),m.target=x,m.relatedTarget=b,S=m),b=S,p&&g)t:{for(m=p,v=g,y=0,x=m;x;x=no(x))y++;for(x=0,S=v;S;S=no(S))x++;for(;0<y-x;)m=no(m),y--;for(;0<x-y;)v=no(v),x--;for(;y--;){if(m===v||v!==null&&m===v.alternate)break t;m=no(m),v=no(v)}m=null}else m=null;p!==null&&Tm(h,f,p,m,!1),g!==null&&b!==null&&Tm(h,b,g,m,!0)}}e:{if(f=u?Lo(u):window,p=f.nodeName&&f.nodeName.toLowerCase(),p==="select"||p==="input"&&f.type==="file")var j=v2;else if(xm(f))if(Hy)j=w2;else{j=b2;var _=y2}else(p=f.nodeName)&&p.toLowerCase()==="input"&&(f.type==="checkbox"||f.type==="radio")&&(j=x2);if(j&&(j=j(t,u))){Uy(h,j,r,d);break e}_&&_(t,f,u),t==="focusout"&&(_=f._wrapperState)&&_.controlled&&f.type==="number"&&Id(f,"number",f.value)}switch(_=u?Lo(u):window,t){case"focusin":(xm(_)||_.contentEditable==="true")&&(Io=_,qd=u,sa=null);break;case"focusout":sa=qd=Io=null;break;case"mousedown":Kd=!0;break;case"contextmenu":case"mouseup":case"dragend":Kd=!1,jm(h,r,d);break;case"selectionchange":if(k2)break;case"keydown":case"keyup":jm(h,r,d)}var C;if(hf)e:{switch(t){case"compositionstart":var R="onCompositionStart";break e;case"compositionend":R="onCompositionEnd";break e;case"compositionupdate":R="onCompositionUpdate";break e}R=void 0}else $o?Fy(t,r)&&(R="onCompositionEnd"):t==="keydown"&&r.keyCode===229&&(R="onCompositionStart");R&&(zy&&r.locale!=="ko"&&($o||R!=="onCompositionStart"?R==="onCompositionEnd"&&$o&&(C=Dy()):(Hn=d,cf="value"in Hn?Hn.value:Hn.textContent,$o=!0)),_=sc(u,R),0<_.length&&(R=new gm(R,t,null,r,d),h.push({event:R,listeners:_}),C?R.data=C:(C=By(r),C!==null&&(R.data=C)))),(C=h2?f2(t,r):p2(t,r))&&(u=sc(u,"onBeforeInput"),0<u.length&&(d=new gm("onBeforeInput","beforeinput",null,r,d),h.push({event:d,listeners:u}),d.data=C))}Qy(h,e)})}function ka(t,e,r){return{instance:t,listener:e,currentTarget:r}}function sc(t,e){for(var r=e+"Capture",n=[];t!==null;){var i=t,o=i.stateNode;i.tag===5&&o!==null&&(i=o,o=va(t,r),o!=null&&n.unshift(ka(t,o,i)),o=va(t,e),o!=null&&n.push(ka(t,o,i))),t=t.return}return n}function no(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5);return t||null}function Tm(t,e,r,n,i){for(var o=e._reactName,s=[];r!==null&&r!==n;){var a=r,c=a.alternate,u=a.stateNode;if(c!==null&&c===n)break;a.tag===5&&u!==null&&(a=u,i?(c=va(r,o),c!=null&&s.unshift(ka(r,c,a))):i||(c=va(r,o),c!=null&&s.push(ka(r,c,a)))),r=r.return}s.length!==0&&t.push({event:e,listeners:s})}var T2=/\r\n?/g,R2=/\u0000|\uFFFD/g;function Rm(t){return(typeof t=="string"?t:""+t).replace(T2,`
`).replace(R2,"")}function gl(t,e,r){if(e=Rm(e),Rm(t)!==e&&r)throw Error(le(425))}function ac(){}var Yd=null,Xd=null;function Zd(t,e){return t==="textarea"||t==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var Jd=typeof setTimeout=="function"?setTimeout:void 0,N2=typeof clearTimeout=="function"?clearTimeout:void 0,Nm=typeof Promise=="function"?Promise:void 0,P2=typeof queueMicrotask=="function"?queueMicrotask:typeof Nm<"u"?function(t){return Nm.resolve(null).then(t).catch(O2)}:Jd;function O2(t){setTimeout(function(){throw t})}function Uu(t,e){var r=e,n=0;do{var i=r.nextSibling;if(t.removeChild(r),i&&i.nodeType===8)if(r=i.data,r==="/$"){if(n===0){t.removeChild(i),xa(e);return}n--}else r!=="$"&&r!=="$?"&&r!=="$!"||n++;r=i}while(r);xa(e)}function Kn(t){for(;t!=null;t=t.nextSibling){var e=t.nodeType;if(e===1||e===3)break;if(e===8){if(e=t.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return t}function Pm(t){t=t.previousSibling;for(var e=0;t;){if(t.nodeType===8){var r=t.data;if(r==="$"||r==="$!"||r==="$?"){if(e===0)return t;e--}else r==="/$"&&e++}t=t.previousSibling}return null}var ls=Math.random().toString(36).slice(2),Xr="__reactFiber$"+ls,ja="__reactProps$"+ls,wn="__reactContainer$"+ls,Qd="__reactEvents$"+ls,A2="__reactListeners$"+ls,$2="__reactHandles$"+ls;function Ti(t){var e=t[Xr];if(e)return e;for(var r=t.parentNode;r;){if(e=r[wn]||r[Xr]){if(r=e.alternate,e.child!==null||r!==null&&r.child!==null)for(t=Pm(t);t!==null;){if(r=t[Xr])return r;t=Pm(t)}return e}t=r,r=t.parentNode}return null}function Ba(t){return t=t[Xr]||t[wn],!t||t.tag!==5&&t.tag!==6&&t.tag!==13&&t.tag!==3?null:t}function Lo(t){if(t.tag===5||t.tag===6)return t.stateNode;throw Error(le(33))}function Gc(t){return t[ja]||null}var eh=[],Do=-1;function ii(t){return{current:t}}function lt(t){0>Do||(t.current=eh[Do],eh[Do]=null,Do--)}function it(t,e){Do++,eh[Do]=t.current,t.current=e}var ei={},Vt=ii(ei),nr=ii(!1),Mi=ei;function Qo(t,e){var r=t.type.contextTypes;if(!r)return ei;var n=t.stateNode;if(n&&n.__reactInternalMemoizedUnmaskedChildContext===e)return n.__reactInternalMemoizedMaskedChildContext;var i={},o;for(o in r)i[o]=e[o];return n&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=e,t.__reactInternalMemoizedMaskedChildContext=i),i}function ir(t){return t=t.childContextTypes,t!=null}function lc(){lt(nr),lt(Vt)}function Om(t,e,r){if(Vt.current!==ei)throw Error(le(168));it(Vt,e),it(nr,r)}function tb(t,e,r){var n=t.stateNode;if(e=e.childContextTypes,typeof n.getChildContext!="function")return r;n=n.getChildContext();for(var i in n)if(!(i in e))throw Error(le(108,y_(t)||"Unknown",i));return yt({},r,n)}function cc(t){return t=(t=t.stateNode)&&t.__reactInternalMemoizedMergedChildContext||ei,Mi=Vt.current,it(Vt,t),it(nr,nr.current),!0}function Am(t,e,r){var n=t.stateNode;if(!n)throw Error(le(169));r?(t=tb(t,e,Mi),n.__reactInternalMemoizedMergedChildContext=t,lt(nr),lt(Vt),it(Vt,t)):lt(nr),it(nr,r)}var pn=null,Vc=!1,Hu=!1;function rb(t){pn===null?pn=[t]:pn.push(t)}function I2(t){Vc=!0,rb(t)}function oi(){if(!Hu&&pn!==null){Hu=!0;var t=0,e=Je;try{var r=pn;for(Je=1;t<r.length;t++){var n=r[t];do n=n(!0);while(n!==null)}pn=null,Vc=!1}catch(i){throw pn!==null&&(pn=pn.slice(t+1)),Ey(of,oi),i}finally{Je=e,Hu=!1}}return null}var zo=[],Fo=0,uc=null,dc=0,xr=[],wr=0,Li=null,mn=1,gn="";function _i(t,e){zo[Fo++]=dc,zo[Fo++]=uc,uc=t,dc=e}function nb(t,e,r){xr[wr++]=mn,xr[wr++]=gn,xr[wr++]=Li,Li=t;var n=mn;t=gn;var i=32-Fr(n)-1;n&=~(1<<i),r+=1;var o=32-Fr(e)+i;if(30<o){var s=i-i%5;o=(n&(1<<s)-1).toString(32),n>>=s,i-=s,mn=1<<32-Fr(e)+i|r<<i|n,gn=o+t}else mn=1<<o|r<<i|n,gn=t}function pf(t){t.return!==null&&(_i(t,1),nb(t,1,0))}function mf(t){for(;t===uc;)uc=zo[--Fo],zo[Fo]=null,dc=zo[--Fo],zo[Fo]=null;for(;t===Li;)Li=xr[--wr],xr[wr]=null,gn=xr[--wr],xr[wr]=null,mn=xr[--wr],xr[wr]=null}var mr=null,hr=null,pt=!1,Dr=null;function ib(t,e){var r=Sr(5,null,null,0);r.elementType="DELETED",r.stateNode=e,r.return=t,e=t.deletions,e===null?(t.deletions=[r],t.flags|=16):e.push(r)}function $m(t,e){switch(t.tag){case 5:var r=t.type;return e=e.nodeType!==1||r.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(t.stateNode=e,mr=t,hr=Kn(e.firstChild),!0):!1;case 6:return e=t.pendingProps===""||e.nodeType!==3?null:e,e!==null?(t.stateNode=e,mr=t,hr=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(r=Li!==null?{id:mn,overflow:gn}:null,t.memoizedState={dehydrated:e,treeContext:r,retryLane:1073741824},r=Sr(18,null,null,0),r.stateNode=e,r.return=t,t.child=r,mr=t,hr=null,!0):!1;default:return!1}}function th(t){return(t.mode&1)!==0&&(t.flags&128)===0}function rh(t){if(pt){var e=hr;if(e){var r=e;if(!$m(t,e)){if(th(t))throw Error(le(418));e=Kn(r.nextSibling);var n=mr;e&&$m(t,e)?ib(n,r):(t.flags=t.flags&-4097|2,pt=!1,mr=t)}}else{if(th(t))throw Error(le(418));t.flags=t.flags&-4097|2,pt=!1,mr=t}}}function Im(t){for(t=t.return;t!==null&&t.tag!==5&&t.tag!==3&&t.tag!==13;)t=t.return;mr=t}function vl(t){if(t!==mr)return!1;if(!pt)return Im(t),pt=!0,!1;var e;if((e=t.tag!==3)&&!(e=t.tag!==5)&&(e=t.type,e=e!=="head"&&e!=="body"&&!Zd(t.type,t.memoizedProps)),e&&(e=hr)){if(th(t))throw ob(),Error(le(418));for(;e;)ib(t,e),e=Kn(e.nextSibling)}if(Im(t),t.tag===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(le(317));e:{for(t=t.nextSibling,e=0;t;){if(t.nodeType===8){var r=t.data;if(r==="/$"){if(e===0){hr=Kn(t.nextSibling);break e}e--}else r!=="$"&&r!=="$!"&&r!=="$?"||e++}t=t.nextSibling}hr=null}}else hr=mr?Kn(t.stateNode.nextSibling):null;return!0}function ob(){for(var t=hr;t;)t=Kn(t.nextSibling)}function es(){hr=mr=null,pt=!1}function gf(t){Dr===null?Dr=[t]:Dr.push(t)}var M2=kn.ReactCurrentBatchConfig;function zs(t,e,r){if(t=r.ref,t!==null&&typeof t!="function"&&typeof t!="object"){if(r._owner){if(r=r._owner,r){if(r.tag!==1)throw Error(le(309));var n=r.stateNode}if(!n)throw Error(le(147,t));var i=n,o=""+t;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===o?e.ref:(e=function(s){var a=i.refs;s===null?delete a[o]:a[o]=s},e._stringRef=o,e)}if(typeof t!="string")throw Error(le(284));if(!r._owner)throw Error(le(290,t))}return t}function yl(t,e){throw t=Object.prototype.toString.call(e),Error(le(31,t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t))}function Mm(t){var e=t._init;return e(t._payload)}function sb(t){function e(v,y){if(t){var x=v.deletions;x===null?(v.deletions=[y],v.flags|=16):x.push(y)}}function r(v,y){if(!t)return null;for(;y!==null;)e(v,y),y=y.sibling;return null}function n(v,y){for(v=new Map;y!==null;)y.key!==null?v.set(y.key,y):v.set(y.index,y),y=y.sibling;return v}function i(v,y){return v=Jn(v,y),v.index=0,v.sibling=null,v}function o(v,y,x){return v.index=x,t?(x=v.alternate,x!==null?(x=x.index,x<y?(v.flags|=2,y):x):(v.flags|=2,y)):(v.flags|=1048576,y)}function s(v){return t&&v.alternate===null&&(v.flags|=2),v}function a(v,y,x,S){return y===null||y.tag!==6?(y=Xu(x,v.mode,S),y.return=v,y):(y=i(y,x),y.return=v,y)}function c(v,y,x,S){var j=x.type;return j===Ao?d(v,y,x.props.children,S,x.key):y!==null&&(y.elementType===j||typeof j=="object"&&j!==null&&j.$$typeof===Mn&&Mm(j)===y.type)?(S=i(y,x.props),S.ref=zs(v,y,x),S.return=v,S):(S=Zl(x.type,x.key,x.props,null,v.mode,S),S.ref=zs(v,y,x),S.return=v,S)}function u(v,y,x,S){return y===null||y.tag!==4||y.stateNode.containerInfo!==x.containerInfo||y.stateNode.implementation!==x.implementation?(y=Zu(x,v.mode,S),y.return=v,y):(y=i(y,x.children||[]),y.return=v,y)}function d(v,y,x,S,j){return y===null||y.tag!==7?(y=$i(x,v.mode,S,j),y.return=v,y):(y=i(y,x),y.return=v,y)}function h(v,y,x){if(typeof y=="string"&&y!==""||typeof y=="number")return y=Xu(""+y,v.mode,x),y.return=v,y;if(typeof y=="object"&&y!==null){switch(y.$$typeof){case al:return x=Zl(y.type,y.key,y.props,null,v.mode,x),x.ref=zs(v,null,y),x.return=v,x;case Oo:return y=Zu(y,v.mode,x),y.return=v,y;case Mn:var S=y._init;return h(v,S(y._payload),x)}if(Ys(y)||$s(y))return y=$i(y,v.mode,x,null),y.return=v,y;yl(v,y)}return null}function f(v,y,x,S){var j=y!==null?y.key:null;if(typeof x=="string"&&x!==""||typeof x=="number")return j!==null?null:a(v,y,""+x,S);if(typeof x=="object"&&x!==null){switch(x.$$typeof){case al:return x.key===j?c(v,y,x,S):null;case Oo:return x.key===j?u(v,y,x,S):null;case Mn:return j=x._init,f(v,y,j(x._payload),S)}if(Ys(x)||$s(x))return j!==null?null:d(v,y,x,S,null);yl(v,x)}return null}function p(v,y,x,S,j){if(typeof S=="string"&&S!==""||typeof S=="number")return v=v.get(x)||null,a(y,v,""+S,j);if(typeof S=="object"&&S!==null){switch(S.$$typeof){case al:return v=v.get(S.key===null?x:S.key)||null,c(y,v,S,j);case Oo:return v=v.get(S.key===null?x:S.key)||null,u(y,v,S,j);case Mn:var _=S._init;return p(v,y,x,_(S._payload),j)}if(Ys(S)||$s(S))return v=v.get(x)||null,d(y,v,S,j,null);yl(y,S)}return null}function g(v,y,x,S){for(var j=null,_=null,C=y,R=y=0,T=null;C!==null&&R<x.length;R++){C.index>R?(T=C,C=null):T=C.sibling;var P=f(v,C,x[R],S);if(P===null){C===null&&(C=T);break}t&&C&&P.alternate===null&&e(v,C),y=o(P,y,R),_===null?j=P:_.sibling=P,_=P,C=T}if(R===x.length)return r(v,C),pt&&_i(v,R),j;if(C===null){for(;R<x.length;R++)C=h(v,x[R],S),C!==null&&(y=o(C,y,R),_===null?j=C:_.sibling=C,_=C);return pt&&_i(v,R),j}for(C=n(v,C);R<x.length;R++)T=p(C,v,R,x[R],S),T!==null&&(t&&T.alternate!==null&&C.delete(T.key===null?R:T.key),y=o(T,y,R),_===null?j=T:_.sibling=T,_=T);return t&&C.forEach(function(H){return e(v,H)}),pt&&_i(v,R),j}function m(v,y,x,S){var j=$s(x);if(typeof j!="function")throw Error(le(150));if(x=j.call(x),x==null)throw Error(le(151));for(var _=j=null,C=y,R=y=0,T=null,P=x.next();C!==null&&!P.done;R++,P=x.next()){C.index>R?(T=C,C=null):T=C.sibling;var H=f(v,C,P.value,S);if(H===null){C===null&&(C=T);break}t&&C&&H.alternate===null&&e(v,C),y=o(H,y,R),_===null?j=H:_.sibling=H,_=H,C=T}if(P.done)return r(v,C),pt&&_i(v,R),j;if(C===null){for(;!P.done;R++,P=x.next())P=h(v,P.value,S),P!==null&&(y=o(P,y,R),_===null?j=P:_.sibling=P,_=P);return pt&&_i(v,R),j}for(C=n(v,C);!P.done;R++,P=x.next())P=p(C,v,R,P.value,S),P!==null&&(t&&P.alternate!==null&&C.delete(P.key===null?R:P.key),y=o(P,y,R),_===null?j=P:_.sibling=P,_=P);return t&&C.forEach(function(E){return e(v,E)}),pt&&_i(v,R),j}function b(v,y,x,S){if(typeof x=="object"&&x!==null&&x.type===Ao&&x.key===null&&(x=x.props.children),typeof x=="object"&&x!==null){switch(x.$$typeof){case al:e:{for(var j=x.key,_=y;_!==null;){if(_.key===j){if(j=x.type,j===Ao){if(_.tag===7){r(v,_.sibling),y=i(_,x.props.children),y.return=v,v=y;break e}}else if(_.elementType===j||typeof j=="object"&&j!==null&&j.$$typeof===Mn&&Mm(j)===_.type){r(v,_.sibling),y=i(_,x.props),y.ref=zs(v,_,x),y.return=v,v=y;break e}r(v,_);break}else e(v,_);_=_.sibling}x.type===Ao?(y=$i(x.props.children,v.mode,S,x.key),y.return=v,v=y):(S=Zl(x.type,x.key,x.props,null,v.mode,S),S.ref=zs(v,y,x),S.return=v,v=S)}return s(v);case Oo:e:{for(_=x.key;y!==null;){if(y.key===_)if(y.tag===4&&y.stateNode.containerInfo===x.containerInfo&&y.stateNode.implementation===x.implementation){r(v,y.sibling),y=i(y,x.children||[]),y.return=v,v=y;break e}else{r(v,y);break}else e(v,y);y=y.sibling}y=Zu(x,v.mode,S),y.return=v,v=y}return s(v);case Mn:return _=x._init,b(v,y,_(x._payload),S)}if(Ys(x))return g(v,y,x,S);if($s(x))return m(v,y,x,S);yl(v,x)}return typeof x=="string"&&x!==""||typeof x=="number"?(x=""+x,y!==null&&y.tag===6?(r(v,y.sibling),y=i(y,x),y.return=v,v=y):(r(v,y),y=Xu(x,v.mode,S),y.return=v,v=y),s(v)):r(v,y)}return b}var ts=sb(!0),ab=sb(!1),hc=ii(null),fc=null,Bo=null,vf=null;function yf(){vf=Bo=fc=null}function bf(t){var e=hc.current;lt(hc),t._currentValue=e}function nh(t,e,r){for(;t!==null;){var n=t.alternate;if((t.childLanes&e)!==e?(t.childLanes|=e,n!==null&&(n.childLanes|=e)):n!==null&&(n.childLanes&e)!==e&&(n.childLanes|=e),t===r)break;t=t.return}}function Yo(t,e){fc=t,vf=Bo=null,t=t.dependencies,t!==null&&t.firstContext!==null&&(t.lanes&e&&(rr=!0),t.firstContext=null)}function jr(t){var e=t._currentValue;if(vf!==t)if(t={context:t,memoizedValue:e,next:null},Bo===null){if(fc===null)throw Error(le(308));Bo=t,fc.dependencies={lanes:0,firstContext:t}}else Bo=Bo.next=t;return e}var Ri=null;function xf(t){Ri===null?Ri=[t]:Ri.push(t)}function lb(t,e,r,n){var i=e.interleaved;return i===null?(r.next=r,xf(e)):(r.next=i.next,i.next=r),e.interleaved=r,_n(t,n)}function _n(t,e){t.lanes|=e;var r=t.alternate;for(r!==null&&(r.lanes|=e),r=t,t=t.return;t!==null;)t.childLanes|=e,r=t.alternate,r!==null&&(r.childLanes|=e),r=t,t=t.return;return r.tag===3?r.stateNode:null}var Ln=!1;function wf(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function cb(t,e){t=t.updateQueue,e.updateQueue===t&&(e.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,effects:t.effects})}function yn(t,e){return{eventTime:t,lane:e,tag:0,payload:null,callback:null,next:null}}function Yn(t,e,r){var n=t.updateQueue;if(n===null)return null;if(n=n.shared,Ke&2){var i=n.pending;return i===null?e.next=e:(e.next=i.next,i.next=e),n.pending=e,_n(t,r)}return i=n.interleaved,i===null?(e.next=e,xf(n)):(e.next=i.next,i.next=e),n.interleaved=e,_n(t,r)}function Gl(t,e,r){if(e=e.updateQueue,e!==null&&(e=e.shared,(r&4194240)!==0)){var n=e.lanes;n&=t.pendingLanes,r|=n,e.lanes=r,sf(t,r)}}function Lm(t,e){var r=t.updateQueue,n=t.alternate;if(n!==null&&(n=n.updateQueue,r===n)){var i=null,o=null;if(r=r.firstBaseUpdate,r!==null){do{var s={eventTime:r.eventTime,lane:r.lane,tag:r.tag,payload:r.payload,callback:r.callback,next:null};o===null?i=o=s:o=o.next=s,r=r.next}while(r!==null);o===null?i=o=e:o=o.next=e}else i=o=e;r={baseState:n.baseState,firstBaseUpdate:i,lastBaseUpdate:o,shared:n.shared,effects:n.effects},t.updateQueue=r;return}t=r.lastBaseUpdate,t===null?r.firstBaseUpdate=e:t.next=e,r.lastBaseUpdate=e}function pc(t,e,r,n){var i=t.updateQueue;Ln=!1;var o=i.firstBaseUpdate,s=i.lastBaseUpdate,a=i.shared.pending;if(a!==null){i.shared.pending=null;var c=a,u=c.next;c.next=null,s===null?o=u:s.next=u,s=c;var d=t.alternate;d!==null&&(d=d.updateQueue,a=d.lastBaseUpdate,a!==s&&(a===null?d.firstBaseUpdate=u:a.next=u,d.lastBaseUpdate=c))}if(o!==null){var h=i.baseState;s=0,d=u=c=null,a=o;do{var f=a.lane,p=a.eventTime;if((n&f)===f){d!==null&&(d=d.next={eventTime:p,lane:0,tag:a.tag,payload:a.payload,callback:a.callback,next:null});e:{var g=t,m=a;switch(f=e,p=r,m.tag){case 1:if(g=m.payload,typeof g=="function"){h=g.call(p,h,f);break e}h=g;break e;case 3:g.flags=g.flags&-65537|128;case 0:if(g=m.payload,f=typeof g=="function"?g.call(p,h,f):g,f==null)break e;h=yt({},h,f);break e;case 2:Ln=!0}}a.callback!==null&&a.lane!==0&&(t.flags|=64,f=i.effects,f===null?i.effects=[a]:f.push(a))}else p={eventTime:p,lane:f,tag:a.tag,payload:a.payload,callback:a.callback,next:null},d===null?(u=d=p,c=h):d=d.next=p,s|=f;if(a=a.next,a===null){if(a=i.shared.pending,a===null)break;f=a,a=f.next,f.next=null,i.lastBaseUpdate=f,i.shared.pending=null}}while(!0);if(d===null&&(c=h),i.baseState=c,i.firstBaseUpdate=u,i.lastBaseUpdate=d,e=i.shared.interleaved,e!==null){i=e;do s|=i.lane,i=i.next;while(i!==e)}else o===null&&(i.shared.lanes=0);zi|=s,t.lanes=s,t.memoizedState=h}}function Dm(t,e,r){if(t=e.effects,e.effects=null,t!==null)for(e=0;e<t.length;e++){var n=t[e],i=n.callback;if(i!==null){if(n.callback=null,n=r,typeof i!="function")throw Error(le(191,i));i.call(n)}}}var Ua={},Qr=ii(Ua),Ca=ii(Ua),Ea=ii(Ua);function Ni(t){if(t===Ua)throw Error(le(174));return t}function _f(t,e){switch(it(Ea,e),it(Ca,t),it(Qr,Ua),t=e.nodeType,t){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:Ld(null,"");break;default:t=t===8?e.parentNode:e,e=t.namespaceURI||null,t=t.tagName,e=Ld(e,t)}lt(Qr),it(Qr,e)}function rs(){lt(Qr),lt(Ca),lt(Ea)}function ub(t){Ni(Ea.current);var e=Ni(Qr.current),r=Ld(e,t.type);e!==r&&(it(Ca,t),it(Qr,r))}function Sf(t){Ca.current===t&&(lt(Qr),lt(Ca))}var gt=ii(0);function mc(t){for(var e=t;e!==null;){if(e.tag===13){var r=e.memoizedState;if(r!==null&&(r=r.dehydrated,r===null||r.data==="$?"||r.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var Wu=[];function kf(){for(var t=0;t<Wu.length;t++)Wu[t]._workInProgressVersionPrimary=null;Wu.length=0}var Vl=kn.ReactCurrentDispatcher,Gu=kn.ReactCurrentBatchConfig,Di=0,vt=null,Tt=null,Pt=null,gc=!1,aa=!1,Ta=0,L2=0;function Ft(){throw Error(le(321))}function jf(t,e){if(e===null)return!1;for(var r=0;r<e.length&&r<t.length;r++)if(!Ur(t[r],e[r]))return!1;return!0}function Cf(t,e,r,n,i,o){if(Di=o,vt=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,Vl.current=t===null||t.memoizedState===null?B2:U2,t=r(n,i),aa){o=0;do{if(aa=!1,Ta=0,25<=o)throw Error(le(301));o+=1,Pt=Tt=null,e.updateQueue=null,Vl.current=H2,t=r(n,i)}while(aa)}if(Vl.current=vc,e=Tt!==null&&Tt.next!==null,Di=0,Pt=Tt=vt=null,gc=!1,e)throw Error(le(300));return t}function Ef(){var t=Ta!==0;return Ta=0,t}function Yr(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Pt===null?vt.memoizedState=Pt=t:Pt=Pt.next=t,Pt}function Cr(){if(Tt===null){var t=vt.alternate;t=t!==null?t.memoizedState:null}else t=Tt.next;var e=Pt===null?vt.memoizedState:Pt.next;if(e!==null)Pt=e,Tt=t;else{if(t===null)throw Error(le(310));Tt=t,t={memoizedState:Tt.memoizedState,baseState:Tt.baseState,baseQueue:Tt.baseQueue,queue:Tt.queue,next:null},Pt===null?vt.memoizedState=Pt=t:Pt=Pt.next=t}return Pt}function Ra(t,e){return typeof e=="function"?e(t):e}function Vu(t){var e=Cr(),r=e.queue;if(r===null)throw Error(le(311));r.lastRenderedReducer=t;var n=Tt,i=n.baseQueue,o=r.pending;if(o!==null){if(i!==null){var s=i.next;i.next=o.next,o.next=s}n.baseQueue=i=o,r.pending=null}if(i!==null){o=i.next,n=n.baseState;var a=s=null,c=null,u=o;do{var d=u.lane;if((Di&d)===d)c!==null&&(c=c.next={lane:0,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null}),n=u.hasEagerState?u.eagerState:t(n,u.action);else{var h={lane:d,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null};c===null?(a=c=h,s=n):c=c.next=h,vt.lanes|=d,zi|=d}u=u.next}while(u!==null&&u!==o);c===null?s=n:c.next=a,Ur(n,e.memoizedState)||(rr=!0),e.memoizedState=n,e.baseState=s,e.baseQueue=c,r.lastRenderedState=n}if(t=r.interleaved,t!==null){i=t;do o=i.lane,vt.lanes|=o,zi|=o,i=i.next;while(i!==t)}else i===null&&(r.lanes=0);return[e.memoizedState,r.dispatch]}function qu(t){var e=Cr(),r=e.queue;if(r===null)throw Error(le(311));r.lastRenderedReducer=t;var n=r.dispatch,i=r.pending,o=e.memoizedState;if(i!==null){r.pending=null;var s=i=i.next;do o=t(o,s.action),s=s.next;while(s!==i);Ur(o,e.memoizedState)||(rr=!0),e.memoizedState=o,e.baseQueue===null&&(e.baseState=o),r.lastRenderedState=o}return[o,n]}function db(){}function hb(t,e){var r=vt,n=Cr(),i=e(),o=!Ur(n.memoizedState,i);if(o&&(n.memoizedState=i,rr=!0),n=n.queue,Tf(mb.bind(null,r,n,t),[t]),n.getSnapshot!==e||o||Pt!==null&&Pt.memoizedState.tag&1){if(r.flags|=2048,Na(9,pb.bind(null,r,n,i,e),void 0,null),Ot===null)throw Error(le(349));Di&30||fb(r,e,i)}return i}function fb(t,e,r){t.flags|=16384,t={getSnapshot:e,value:r},e=vt.updateQueue,e===null?(e={lastEffect:null,stores:null},vt.updateQueue=e,e.stores=[t]):(r=e.stores,r===null?e.stores=[t]:r.push(t))}function pb(t,e,r,n){e.value=r,e.getSnapshot=n,gb(e)&&vb(t)}function mb(t,e,r){return r(function(){gb(e)&&vb(t)})}function gb(t){var e=t.getSnapshot;t=t.value;try{var r=e();return!Ur(t,r)}catch{return!0}}function vb(t){var e=_n(t,1);e!==null&&Br(e,t,1,-1)}function zm(t){var e=Yr();return typeof t=="function"&&(t=t()),e.memoizedState=e.baseState=t,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Ra,lastRenderedState:t},e.queue=t,t=t.dispatch=F2.bind(null,vt,t),[e.memoizedState,t]}function Na(t,e,r,n){return t={tag:t,create:e,destroy:r,deps:n,next:null},e=vt.updateQueue,e===null?(e={lastEffect:null,stores:null},vt.updateQueue=e,e.lastEffect=t.next=t):(r=e.lastEffect,r===null?e.lastEffect=t.next=t:(n=r.next,r.next=t,t.next=n,e.lastEffect=t)),t}function yb(){return Cr().memoizedState}function ql(t,e,r,n){var i=Yr();vt.flags|=t,i.memoizedState=Na(1|e,r,void 0,n===void 0?null:n)}function qc(t,e,r,n){var i=Cr();n=n===void 0?null:n;var o=void 0;if(Tt!==null){var s=Tt.memoizedState;if(o=s.destroy,n!==null&&jf(n,s.deps)){i.memoizedState=Na(e,r,o,n);return}}vt.flags|=t,i.memoizedState=Na(1|e,r,o,n)}function Fm(t,e){return ql(8390656,8,t,e)}function Tf(t,e){return qc(2048,8,t,e)}function bb(t,e){return qc(4,2,t,e)}function xb(t,e){return qc(4,4,t,e)}function wb(t,e){if(typeof e=="function")return t=t(),e(t),function(){e(null)};if(e!=null)return t=t(),e.current=t,function(){e.current=null}}function _b(t,e,r){return r=r!=null?r.concat([t]):null,qc(4,4,wb.bind(null,e,t),r)}function Rf(){}function Sb(t,e){var r=Cr();e=e===void 0?null:e;var n=r.memoizedState;return n!==null&&e!==null&&jf(e,n[1])?n[0]:(r.memoizedState=[t,e],t)}function kb(t,e){var r=Cr();e=e===void 0?null:e;var n=r.memoizedState;return n!==null&&e!==null&&jf(e,n[1])?n[0]:(t=t(),r.memoizedState=[t,e],t)}function jb(t,e,r){return Di&21?(Ur(r,e)||(r=Ny(),vt.lanes|=r,zi|=r,t.baseState=!0),e):(t.baseState&&(t.baseState=!1,rr=!0),t.memoizedState=r)}function D2(t,e){var r=Je;Je=r!==0&&4>r?r:4,t(!0);var n=Gu.transition;Gu.transition={};try{t(!1),e()}finally{Je=r,Gu.transition=n}}function Cb(){return Cr().memoizedState}function z2(t,e,r){var n=Zn(t);if(r={lane:n,action:r,hasEagerState:!1,eagerState:null,next:null},Eb(t))Tb(e,r);else if(r=lb(t,e,r,n),r!==null){var i=Xt();Br(r,t,n,i),Rb(r,e,n)}}function F2(t,e,r){var n=Zn(t),i={lane:n,action:r,hasEagerState:!1,eagerState:null,next:null};if(Eb(t))Tb(e,i);else{var o=t.alternate;if(t.lanes===0&&(o===null||o.lanes===0)&&(o=e.lastRenderedReducer,o!==null))try{var s=e.lastRenderedState,a=o(s,r);if(i.hasEagerState=!0,i.eagerState=a,Ur(a,s)){var c=e.interleaved;c===null?(i.next=i,xf(e)):(i.next=c.next,c.next=i),e.interleaved=i;return}}catch{}finally{}r=lb(t,e,i,n),r!==null&&(i=Xt(),Br(r,t,n,i),Rb(r,e,n))}}function Eb(t){var e=t.alternate;return t===vt||e!==null&&e===vt}function Tb(t,e){aa=gc=!0;var r=t.pending;r===null?e.next=e:(e.next=r.next,r.next=e),t.pending=e}function Rb(t,e,r){if(r&4194240){var n=e.lanes;n&=t.pendingLanes,r|=n,e.lanes=r,sf(t,r)}}var vc={readContext:jr,useCallback:Ft,useContext:Ft,useEffect:Ft,useImperativeHandle:Ft,useInsertionEffect:Ft,useLayoutEffect:Ft,useMemo:Ft,useReducer:Ft,useRef:Ft,useState:Ft,useDebugValue:Ft,useDeferredValue:Ft,useTransition:Ft,useMutableSource:Ft,useSyncExternalStore:Ft,useId:Ft,unstable_isNewReconciler:!1},B2={readContext:jr,useCallback:function(t,e){return Yr().memoizedState=[t,e===void 0?null:e],t},useContext:jr,useEffect:Fm,useImperativeHandle:function(t,e,r){return r=r!=null?r.concat([t]):null,ql(4194308,4,wb.bind(null,e,t),r)},useLayoutEffect:function(t,e){return ql(4194308,4,t,e)},useInsertionEffect:function(t,e){return ql(4,2,t,e)},useMemo:function(t,e){var r=Yr();return e=e===void 0?null:e,t=t(),r.memoizedState=[t,e],t},useReducer:function(t,e,r){var n=Yr();return e=r!==void 0?r(e):e,n.memoizedState=n.baseState=e,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:e},n.queue=t,t=t.dispatch=z2.bind(null,vt,t),[n.memoizedState,t]},useRef:function(t){var e=Yr();return t={current:t},e.memoizedState=t},useState:zm,useDebugValue:Rf,useDeferredValue:function(t){return Yr().memoizedState=t},useTransition:function(){var t=zm(!1),e=t[0];return t=D2.bind(null,t[1]),Yr().memoizedState=t,[e,t]},useMutableSource:function(){},useSyncExternalStore:function(t,e,r){var n=vt,i=Yr();if(pt){if(r===void 0)throw Error(le(407));r=r()}else{if(r=e(),Ot===null)throw Error(le(349));Di&30||fb(n,e,r)}i.memoizedState=r;var o={value:r,getSnapshot:e};return i.queue=o,Fm(mb.bind(null,n,o,t),[t]),n.flags|=2048,Na(9,pb.bind(null,n,o,r,e),void 0,null),r},useId:function(){var t=Yr(),e=Ot.identifierPrefix;if(pt){var r=gn,n=mn;r=(n&~(1<<32-Fr(n)-1)).toString(32)+r,e=":"+e+"R"+r,r=Ta++,0<r&&(e+="H"+r.toString(32)),e+=":"}else r=L2++,e=":"+e+"r"+r.toString(32)+":";return t.memoizedState=e},unstable_isNewReconciler:!1},U2={readContext:jr,useCallback:Sb,useContext:jr,useEffect:Tf,useImperativeHandle:_b,useInsertionEffect:bb,useLayoutEffect:xb,useMemo:kb,useReducer:Vu,useRef:yb,useState:function(){return Vu(Ra)},useDebugValue:Rf,useDeferredValue:function(t){var e=Cr();return jb(e,Tt.memoizedState,t)},useTransition:function(){var t=Vu(Ra)[0],e=Cr().memoizedState;return[t,e]},useMutableSource:db,useSyncExternalStore:hb,useId:Cb,unstable_isNewReconciler:!1},H2={readContext:jr,useCallback:Sb,useContext:jr,useEffect:Tf,useImperativeHandle:_b,useInsertionEffect:bb,useLayoutEffect:xb,useMemo:kb,useReducer:qu,useRef:yb,useState:function(){return qu(Ra)},useDebugValue:Rf,useDeferredValue:function(t){var e=Cr();return Tt===null?e.memoizedState=t:jb(e,Tt.memoizedState,t)},useTransition:function(){var t=qu(Ra)[0],e=Cr().memoizedState;return[t,e]},useMutableSource:db,useSyncExternalStore:hb,useId:Cb,unstable_isNewReconciler:!1};function $r(t,e){if(t&&t.defaultProps){e=yt({},e),t=t.defaultProps;for(var r in t)e[r]===void 0&&(e[r]=t[r]);return e}return e}function ih(t,e,r,n){e=t.memoizedState,r=r(n,e),r=r==null?e:yt({},e,r),t.memoizedState=r,t.lanes===0&&(t.updateQueue.baseState=r)}var Kc={isMounted:function(t){return(t=t._reactInternals)?Hi(t)===t:!1},enqueueSetState:function(t,e,r){t=t._reactInternals;var n=Xt(),i=Zn(t),o=yn(n,i);o.payload=e,r!=null&&(o.callback=r),e=Yn(t,o,i),e!==null&&(Br(e,t,i,n),Gl(e,t,i))},enqueueReplaceState:function(t,e,r){t=t._reactInternals;var n=Xt(),i=Zn(t),o=yn(n,i);o.tag=1,o.payload=e,r!=null&&(o.callback=r),e=Yn(t,o,i),e!==null&&(Br(e,t,i,n),Gl(e,t,i))},enqueueForceUpdate:function(t,e){t=t._reactInternals;var r=Xt(),n=Zn(t),i=yn(r,n);i.tag=2,e!=null&&(i.callback=e),e=Yn(t,i,n),e!==null&&(Br(e,t,n,r),Gl(e,t,n))}};function Bm(t,e,r,n,i,o,s){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(n,o,s):e.prototype&&e.prototype.isPureReactComponent?!_a(r,n)||!_a(i,o):!0}function Nb(t,e,r){var n=!1,i=ei,o=e.contextType;return typeof o=="object"&&o!==null?o=jr(o):(i=ir(e)?Mi:Vt.current,n=e.contextTypes,o=(n=n!=null)?Qo(t,i):ei),e=new e(r,o),t.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=Kc,t.stateNode=e,e._reactInternals=t,n&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=i,t.__reactInternalMemoizedMaskedChildContext=o),e}function Um(t,e,r,n){t=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(r,n),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(r,n),e.state!==t&&Kc.enqueueReplaceState(e,e.state,null)}function oh(t,e,r,n){var i=t.stateNode;i.props=r,i.state=t.memoizedState,i.refs={},wf(t);var o=e.contextType;typeof o=="object"&&o!==null?i.context=jr(o):(o=ir(e)?Mi:Vt.current,i.context=Qo(t,o)),i.state=t.memoizedState,o=e.getDerivedStateFromProps,typeof o=="function"&&(ih(t,e,o,r),i.state=t.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof i.getSnapshotBeforeUpdate=="function"||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(e=i.state,typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount(),e!==i.state&&Kc.enqueueReplaceState(i,i.state,null),pc(t,r,i,n),i.state=t.memoizedState),typeof i.componentDidMount=="function"&&(t.flags|=4194308)}function ns(t,e){try{var r="",n=e;do r+=v_(n),n=n.return;while(n);var i=r}catch(o){i=`
Error generating stack: `+o.message+`
`+o.stack}return{value:t,source:e,stack:i,digest:null}}function Ku(t,e,r){return{value:t,source:null,stack:r??null,digest:e??null}}function sh(t,e){try{console.error(e.value)}catch(r){setTimeout(function(){throw r})}}var W2=typeof WeakMap=="function"?WeakMap:Map;function Pb(t,e,r){r=yn(-1,r),r.tag=3,r.payload={element:null};var n=e.value;return r.callback=function(){bc||(bc=!0,gh=n),sh(t,e)},r}function Ob(t,e,r){r=yn(-1,r),r.tag=3;var n=t.type.getDerivedStateFromError;if(typeof n=="function"){var i=e.value;r.payload=function(){return n(i)},r.callback=function(){sh(t,e)}}var o=t.stateNode;return o!==null&&typeof o.componentDidCatch=="function"&&(r.callback=function(){sh(t,e),typeof n!="function"&&(Xn===null?Xn=new Set([this]):Xn.add(this));var s=e.stack;this.componentDidCatch(e.value,{componentStack:s!==null?s:""})}),r}function Hm(t,e,r){var n=t.pingCache;if(n===null){n=t.pingCache=new W2;var i=new Set;n.set(e,i)}else i=n.get(e),i===void 0&&(i=new Set,n.set(e,i));i.has(r)||(i.add(r),t=iS.bind(null,t,e,r),e.then(t,t))}function Wm(t){do{var e;if((e=t.tag===13)&&(e=t.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return t;t=t.return}while(t!==null);return null}function Gm(t,e,r,n,i){return t.mode&1?(t.flags|=65536,t.lanes=i,t):(t===e?t.flags|=65536:(t.flags|=128,r.flags|=131072,r.flags&=-52805,r.tag===1&&(r.alternate===null?r.tag=17:(e=yn(-1,1),e.tag=2,Yn(r,e,1))),r.lanes|=1),t)}var G2=kn.ReactCurrentOwner,rr=!1;function Kt(t,e,r,n){e.child=t===null?ab(e,null,r,n):ts(e,t.child,r,n)}function Vm(t,e,r,n,i){r=r.render;var o=e.ref;return Yo(e,i),n=Cf(t,e,r,n,o,i),r=Ef(),t!==null&&!rr?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~i,Sn(t,e,i)):(pt&&r&&pf(e),e.flags|=1,Kt(t,e,n,i),e.child)}function qm(t,e,r,n,i){if(t===null){var o=r.type;return typeof o=="function"&&!Lf(o)&&o.defaultProps===void 0&&r.compare===null&&r.defaultProps===void 0?(e.tag=15,e.type=o,Ab(t,e,o,n,i)):(t=Zl(r.type,null,n,e,e.mode,i),t.ref=e.ref,t.return=e,e.child=t)}if(o=t.child,!(t.lanes&i)){var s=o.memoizedProps;if(r=r.compare,r=r!==null?r:_a,r(s,n)&&t.ref===e.ref)return Sn(t,e,i)}return e.flags|=1,t=Jn(o,n),t.ref=e.ref,t.return=e,e.child=t}function Ab(t,e,r,n,i){if(t!==null){var o=t.memoizedProps;if(_a(o,n)&&t.ref===e.ref)if(rr=!1,e.pendingProps=n=o,(t.lanes&i)!==0)t.flags&131072&&(rr=!0);else return e.lanes=t.lanes,Sn(t,e,i)}return ah(t,e,r,n,i)}function $b(t,e,r){var n=e.pendingProps,i=n.children,o=t!==null?t.memoizedState:null;if(n.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},it(Ho,cr),cr|=r;else{if(!(r&1073741824))return t=o!==null?o.baseLanes|r:r,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:t,cachePool:null,transitions:null},e.updateQueue=null,it(Ho,cr),cr|=t,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},n=o!==null?o.baseLanes:r,it(Ho,cr),cr|=n}else o!==null?(n=o.baseLanes|r,e.memoizedState=null):n=r,it(Ho,cr),cr|=n;return Kt(t,e,i,r),e.child}function Ib(t,e){var r=e.ref;(t===null&&r!==null||t!==null&&t.ref!==r)&&(e.flags|=512,e.flags|=2097152)}function ah(t,e,r,n,i){var o=ir(r)?Mi:Vt.current;return o=Qo(e,o),Yo(e,i),r=Cf(t,e,r,n,o,i),n=Ef(),t!==null&&!rr?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~i,Sn(t,e,i)):(pt&&n&&pf(e),e.flags|=1,Kt(t,e,r,i),e.child)}function Km(t,e,r,n,i){if(ir(r)){var o=!0;cc(e)}else o=!1;if(Yo(e,i),e.stateNode===null)Kl(t,e),Nb(e,r,n),oh(e,r,n,i),n=!0;else if(t===null){var s=e.stateNode,a=e.memoizedProps;s.props=a;var c=s.context,u=r.contextType;typeof u=="object"&&u!==null?u=jr(u):(u=ir(r)?Mi:Vt.current,u=Qo(e,u));var d=r.getDerivedStateFromProps,h=typeof d=="function"||typeof s.getSnapshotBeforeUpdate=="function";h||typeof s.UNSAFE_componentWillReceiveProps!="function"&&typeof s.componentWillReceiveProps!="function"||(a!==n||c!==u)&&Um(e,s,n,u),Ln=!1;var f=e.memoizedState;s.state=f,pc(e,n,s,i),c=e.memoizedState,a!==n||f!==c||nr.current||Ln?(typeof d=="function"&&(ih(e,r,d,n),c=e.memoizedState),(a=Ln||Bm(e,r,a,n,f,c,u))?(h||typeof s.UNSAFE_componentWillMount!="function"&&typeof s.componentWillMount!="function"||(typeof s.componentWillMount=="function"&&s.componentWillMount(),typeof s.UNSAFE_componentWillMount=="function"&&s.UNSAFE_componentWillMount()),typeof s.componentDidMount=="function"&&(e.flags|=4194308)):(typeof s.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=n,e.memoizedState=c),s.props=n,s.state=c,s.context=u,n=a):(typeof s.componentDidMount=="function"&&(e.flags|=4194308),n=!1)}else{s=e.stateNode,cb(t,e),a=e.memoizedProps,u=e.type===e.elementType?a:$r(e.type,a),s.props=u,h=e.pendingProps,f=s.context,c=r.contextType,typeof c=="object"&&c!==null?c=jr(c):(c=ir(r)?Mi:Vt.current,c=Qo(e,c));var p=r.getDerivedStateFromProps;(d=typeof p=="function"||typeof s.getSnapshotBeforeUpdate=="function")||typeof s.UNSAFE_componentWillReceiveProps!="function"&&typeof s.componentWillReceiveProps!="function"||(a!==h||f!==c)&&Um(e,s,n,c),Ln=!1,f=e.memoizedState,s.state=f,pc(e,n,s,i);var g=e.memoizedState;a!==h||f!==g||nr.current||Ln?(typeof p=="function"&&(ih(e,r,p,n),g=e.memoizedState),(u=Ln||Bm(e,r,u,n,f,g,c)||!1)?(d||typeof s.UNSAFE_componentWillUpdate!="function"&&typeof s.componentWillUpdate!="function"||(typeof s.componentWillUpdate=="function"&&s.componentWillUpdate(n,g,c),typeof s.UNSAFE_componentWillUpdate=="function"&&s.UNSAFE_componentWillUpdate(n,g,c)),typeof s.componentDidUpdate=="function"&&(e.flags|=4),typeof s.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof s.componentDidUpdate!="function"||a===t.memoizedProps&&f===t.memoizedState||(e.flags|=4),typeof s.getSnapshotBeforeUpdate!="function"||a===t.memoizedProps&&f===t.memoizedState||(e.flags|=1024),e.memoizedProps=n,e.memoizedState=g),s.props=n,s.state=g,s.context=c,n=u):(typeof s.componentDidUpdate!="function"||a===t.memoizedProps&&f===t.memoizedState||(e.flags|=4),typeof s.getSnapshotBeforeUpdate!="function"||a===t.memoizedProps&&f===t.memoizedState||(e.flags|=1024),n=!1)}return lh(t,e,r,n,o,i)}function lh(t,e,r,n,i,o){Ib(t,e);var s=(e.flags&128)!==0;if(!n&&!s)return i&&Am(e,r,!1),Sn(t,e,o);n=e.stateNode,G2.current=e;var a=s&&typeof r.getDerivedStateFromError!="function"?null:n.render();return e.flags|=1,t!==null&&s?(e.child=ts(e,t.child,null,o),e.child=ts(e,null,a,o)):Kt(t,e,a,o),e.memoizedState=n.state,i&&Am(e,r,!0),e.child}function Mb(t){var e=t.stateNode;e.pendingContext?Om(t,e.pendingContext,e.pendingContext!==e.context):e.context&&Om(t,e.context,!1),_f(t,e.containerInfo)}function Ym(t,e,r,n,i){return es(),gf(i),e.flags|=256,Kt(t,e,r,n),e.child}var ch={dehydrated:null,treeContext:null,retryLane:0};function uh(t){return{baseLanes:t,cachePool:null,transitions:null}}function Lb(t,e,r){var n=e.pendingProps,i=gt.current,o=!1,s=(e.flags&128)!==0,a;if((a=s)||(a=t!==null&&t.memoizedState===null?!1:(i&2)!==0),a?(o=!0,e.flags&=-129):(t===null||t.memoizedState!==null)&&(i|=1),it(gt,i&1),t===null)return rh(e),t=e.memoizedState,t!==null&&(t=t.dehydrated,t!==null)?(e.mode&1?t.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(s=n.children,t=n.fallback,o?(n=e.mode,o=e.child,s={mode:"hidden",children:s},!(n&1)&&o!==null?(o.childLanes=0,o.pendingProps=s):o=Zc(s,n,0,null),t=$i(t,n,r,null),o.return=e,t.return=e,o.sibling=t,e.child=o,e.child.memoizedState=uh(r),e.memoizedState=ch,t):Nf(e,s));if(i=t.memoizedState,i!==null&&(a=i.dehydrated,a!==null))return V2(t,e,s,n,a,i,r);if(o){o=n.fallback,s=e.mode,i=t.child,a=i.sibling;var c={mode:"hidden",children:n.children};return!(s&1)&&e.child!==i?(n=e.child,n.childLanes=0,n.pendingProps=c,e.deletions=null):(n=Jn(i,c),n.subtreeFlags=i.subtreeFlags&14680064),a!==null?o=Jn(a,o):(o=$i(o,s,r,null),o.flags|=2),o.return=e,n.return=e,n.sibling=o,e.child=n,n=o,o=e.child,s=t.child.memoizedState,s=s===null?uh(r):{baseLanes:s.baseLanes|r,cachePool:null,transitions:s.transitions},o.memoizedState=s,o.childLanes=t.childLanes&~r,e.memoizedState=ch,n}return o=t.child,t=o.sibling,n=Jn(o,{mode:"visible",children:n.children}),!(e.mode&1)&&(n.lanes=r),n.return=e,n.sibling=null,t!==null&&(r=e.deletions,r===null?(e.deletions=[t],e.flags|=16):r.push(t)),e.child=n,e.memoizedState=null,n}function Nf(t,e){return e=Zc({mode:"visible",children:e},t.mode,0,null),e.return=t,t.child=e}function bl(t,e,r,n){return n!==null&&gf(n),ts(e,t.child,null,r),t=Nf(e,e.pendingProps.children),t.flags|=2,e.memoizedState=null,t}function V2(t,e,r,n,i,o,s){if(r)return e.flags&256?(e.flags&=-257,n=Ku(Error(le(422))),bl(t,e,s,n)):e.memoizedState!==null?(e.child=t.child,e.flags|=128,null):(o=n.fallback,i=e.mode,n=Zc({mode:"visible",children:n.children},i,0,null),o=$i(o,i,s,null),o.flags|=2,n.return=e,o.return=e,n.sibling=o,e.child=n,e.mode&1&&ts(e,t.child,null,s),e.child.memoizedState=uh(s),e.memoizedState=ch,o);if(!(e.mode&1))return bl(t,e,s,null);if(i.data==="$!"){if(n=i.nextSibling&&i.nextSibling.dataset,n)var a=n.dgst;return n=a,o=Error(le(419)),n=Ku(o,n,void 0),bl(t,e,s,n)}if(a=(s&t.childLanes)!==0,rr||a){if(n=Ot,n!==null){switch(s&-s){case 4:i=2;break;case 16:i=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:i=32;break;case 536870912:i=268435456;break;default:i=0}i=i&(n.suspendedLanes|s)?0:i,i!==0&&i!==o.retryLane&&(o.retryLane=i,_n(t,i),Br(n,t,i,-1))}return Mf(),n=Ku(Error(le(421))),bl(t,e,s,n)}return i.data==="$?"?(e.flags|=128,e.child=t.child,e=oS.bind(null,t),i._reactRetry=e,null):(t=o.treeContext,hr=Kn(i.nextSibling),mr=e,pt=!0,Dr=null,t!==null&&(xr[wr++]=mn,xr[wr++]=gn,xr[wr++]=Li,mn=t.id,gn=t.overflow,Li=e),e=Nf(e,n.children),e.flags|=4096,e)}function Xm(t,e,r){t.lanes|=e;var n=t.alternate;n!==null&&(n.lanes|=e),nh(t.return,e,r)}function Yu(t,e,r,n,i){var o=t.memoizedState;o===null?t.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:n,tail:r,tailMode:i}:(o.isBackwards=e,o.rendering=null,o.renderingStartTime=0,o.last=n,o.tail=r,o.tailMode=i)}function Db(t,e,r){var n=e.pendingProps,i=n.revealOrder,o=n.tail;if(Kt(t,e,n.children,r),n=gt.current,n&2)n=n&1|2,e.flags|=128;else{if(t!==null&&t.flags&128)e:for(t=e.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&Xm(t,r,e);else if(t.tag===19)Xm(t,r,e);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}n&=1}if(it(gt,n),!(e.mode&1))e.memoizedState=null;else switch(i){case"forwards":for(r=e.child,i=null;r!==null;)t=r.alternate,t!==null&&mc(t)===null&&(i=r),r=r.sibling;r=i,r===null?(i=e.child,e.child=null):(i=r.sibling,r.sibling=null),Yu(e,!1,i,r,o);break;case"backwards":for(r=null,i=e.child,e.child=null;i!==null;){if(t=i.alternate,t!==null&&mc(t)===null){e.child=i;break}t=i.sibling,i.sibling=r,r=i,i=t}Yu(e,!0,r,null,o);break;case"together":Yu(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function Kl(t,e){!(e.mode&1)&&t!==null&&(t.alternate=null,e.alternate=null,e.flags|=2)}function Sn(t,e,r){if(t!==null&&(e.dependencies=t.dependencies),zi|=e.lanes,!(r&e.childLanes))return null;if(t!==null&&e.child!==t.child)throw Error(le(153));if(e.child!==null){for(t=e.child,r=Jn(t,t.pendingProps),e.child=r,r.return=e;t.sibling!==null;)t=t.sibling,r=r.sibling=Jn(t,t.pendingProps),r.return=e;r.sibling=null}return e.child}function q2(t,e,r){switch(e.tag){case 3:Mb(e),es();break;case 5:ub(e);break;case 1:ir(e.type)&&cc(e);break;case 4:_f(e,e.stateNode.containerInfo);break;case 10:var n=e.type._context,i=e.memoizedProps.value;it(hc,n._currentValue),n._currentValue=i;break;case 13:if(n=e.memoizedState,n!==null)return n.dehydrated!==null?(it(gt,gt.current&1),e.flags|=128,null):r&e.child.childLanes?Lb(t,e,r):(it(gt,gt.current&1),t=Sn(t,e,r),t!==null?t.sibling:null);it(gt,gt.current&1);break;case 19:if(n=(r&e.childLanes)!==0,t.flags&128){if(n)return Db(t,e,r);e.flags|=128}if(i=e.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),it(gt,gt.current),n)break;return null;case 22:case 23:return e.lanes=0,$b(t,e,r)}return Sn(t,e,r)}var zb,dh,Fb,Bb;zb=function(t,e){for(var r=e.child;r!==null;){if(r.tag===5||r.tag===6)t.appendChild(r.stateNode);else if(r.tag!==4&&r.child!==null){r.child.return=r,r=r.child;continue}if(r===e)break;for(;r.sibling===null;){if(r.return===null||r.return===e)return;r=r.return}r.sibling.return=r.return,r=r.sibling}};dh=function(){};Fb=function(t,e,r,n){var i=t.memoizedProps;if(i!==n){t=e.stateNode,Ni(Qr.current);var o=null;switch(r){case"input":i=Ad(t,i),n=Ad(t,n),o=[];break;case"select":i=yt({},i,{value:void 0}),n=yt({},n,{value:void 0}),o=[];break;case"textarea":i=Md(t,i),n=Md(t,n),o=[];break;default:typeof i.onClick!="function"&&typeof n.onClick=="function"&&(t.onclick=ac)}Dd(r,n);var s;r=null;for(u in i)if(!n.hasOwnProperty(u)&&i.hasOwnProperty(u)&&i[u]!=null)if(u==="style"){var a=i[u];for(s in a)a.hasOwnProperty(s)&&(r||(r={}),r[s]="")}else u!=="dangerouslySetInnerHTML"&&u!=="children"&&u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&u!=="autoFocus"&&(ma.hasOwnProperty(u)?o||(o=[]):(o=o||[]).push(u,null));for(u in n){var c=n[u];if(a=i!=null?i[u]:void 0,n.hasOwnProperty(u)&&c!==a&&(c!=null||a!=null))if(u==="style")if(a){for(s in a)!a.hasOwnProperty(s)||c&&c.hasOwnProperty(s)||(r||(r={}),r[s]="");for(s in c)c.hasOwnProperty(s)&&a[s]!==c[s]&&(r||(r={}),r[s]=c[s])}else r||(o||(o=[]),o.push(u,r)),r=c;else u==="dangerouslySetInnerHTML"?(c=c?c.__html:void 0,a=a?a.__html:void 0,c!=null&&a!==c&&(o=o||[]).push(u,c)):u==="children"?typeof c!="string"&&typeof c!="number"||(o=o||[]).push(u,""+c):u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&(ma.hasOwnProperty(u)?(c!=null&&u==="onScroll"&&ot("scroll",t),o||a===c||(o=[])):(o=o||[]).push(u,c))}r&&(o=o||[]).push("style",r);var u=o;(e.updateQueue=u)&&(e.flags|=4)}};Bb=function(t,e,r,n){r!==n&&(e.flags|=4)};function Fs(t,e){if(!pt)switch(t.tailMode){case"hidden":e=t.tail;for(var r=null;e!==null;)e.alternate!==null&&(r=e),e=e.sibling;r===null?t.tail=null:r.sibling=null;break;case"collapsed":r=t.tail;for(var n=null;r!==null;)r.alternate!==null&&(n=r),r=r.sibling;n===null?e||t.tail===null?t.tail=null:t.tail.sibling=null:n.sibling=null}}function Bt(t){var e=t.alternate!==null&&t.alternate.child===t.child,r=0,n=0;if(e)for(var i=t.child;i!==null;)r|=i.lanes|i.childLanes,n|=i.subtreeFlags&14680064,n|=i.flags&14680064,i.return=t,i=i.sibling;else for(i=t.child;i!==null;)r|=i.lanes|i.childLanes,n|=i.subtreeFlags,n|=i.flags,i.return=t,i=i.sibling;return t.subtreeFlags|=n,t.childLanes=r,e}function K2(t,e,r){var n=e.pendingProps;switch(mf(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Bt(e),null;case 1:return ir(e.type)&&lc(),Bt(e),null;case 3:return n=e.stateNode,rs(),lt(nr),lt(Vt),kf(),n.pendingContext&&(n.context=n.pendingContext,n.pendingContext=null),(t===null||t.child===null)&&(vl(e)?e.flags|=4:t===null||t.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,Dr!==null&&(bh(Dr),Dr=null))),dh(t,e),Bt(e),null;case 5:Sf(e);var i=Ni(Ea.current);if(r=e.type,t!==null&&e.stateNode!=null)Fb(t,e,r,n,i),t.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!n){if(e.stateNode===null)throw Error(le(166));return Bt(e),null}if(t=Ni(Qr.current),vl(e)){n=e.stateNode,r=e.type;var o=e.memoizedProps;switch(n[Xr]=e,n[ja]=o,t=(e.mode&1)!==0,r){case"dialog":ot("cancel",n),ot("close",n);break;case"iframe":case"object":case"embed":ot("load",n);break;case"video":case"audio":for(i=0;i<Zs.length;i++)ot(Zs[i],n);break;case"source":ot("error",n);break;case"img":case"image":case"link":ot("error",n),ot("load",n);break;case"details":ot("toggle",n);break;case"input":om(n,o),ot("invalid",n);break;case"select":n._wrapperState={wasMultiple:!!o.multiple},ot("invalid",n);break;case"textarea":am(n,o),ot("invalid",n)}Dd(r,o),i=null;for(var s in o)if(o.hasOwnProperty(s)){var a=o[s];s==="children"?typeof a=="string"?n.textContent!==a&&(o.suppressHydrationWarning!==!0&&gl(n.textContent,a,t),i=["children",a]):typeof a=="number"&&n.textContent!==""+a&&(o.suppressHydrationWarning!==!0&&gl(n.textContent,a,t),i=["children",""+a]):ma.hasOwnProperty(s)&&a!=null&&s==="onScroll"&&ot("scroll",n)}switch(r){case"input":ll(n),sm(n,o,!0);break;case"textarea":ll(n),lm(n);break;case"select":case"option":break;default:typeof o.onClick=="function"&&(n.onclick=ac)}n=i,e.updateQueue=n,n!==null&&(e.flags|=4)}else{s=i.nodeType===9?i:i.ownerDocument,t==="http://www.w3.org/1999/xhtml"&&(t=my(r)),t==="http://www.w3.org/1999/xhtml"?r==="script"?(t=s.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild)):typeof n.is=="string"?t=s.createElement(r,{is:n.is}):(t=s.createElement(r),r==="select"&&(s=t,n.multiple?s.multiple=!0:n.size&&(s.size=n.size))):t=s.createElementNS(t,r),t[Xr]=e,t[ja]=n,zb(t,e,!1,!1),e.stateNode=t;e:{switch(s=zd(r,n),r){case"dialog":ot("cancel",t),ot("close",t),i=n;break;case"iframe":case"object":case"embed":ot("load",t),i=n;break;case"video":case"audio":for(i=0;i<Zs.length;i++)ot(Zs[i],t);i=n;break;case"source":ot("error",t),i=n;break;case"img":case"image":case"link":ot("error",t),ot("load",t),i=n;break;case"details":ot("toggle",t),i=n;break;case"input":om(t,n),i=Ad(t,n),ot("invalid",t);break;case"option":i=n;break;case"select":t._wrapperState={wasMultiple:!!n.multiple},i=yt({},n,{value:void 0}),ot("invalid",t);break;case"textarea":am(t,n),i=Md(t,n),ot("invalid",t);break;default:i=n}Dd(r,i),a=i;for(o in a)if(a.hasOwnProperty(o)){var c=a[o];o==="style"?yy(t,c):o==="dangerouslySetInnerHTML"?(c=c?c.__html:void 0,c!=null&&gy(t,c)):o==="children"?typeof c=="string"?(r!=="textarea"||c!=="")&&ga(t,c):typeof c=="number"&&ga(t,""+c):o!=="suppressContentEditableWarning"&&o!=="suppressHydrationWarning"&&o!=="autoFocus"&&(ma.hasOwnProperty(o)?c!=null&&o==="onScroll"&&ot("scroll",t):c!=null&&Qh(t,o,c,s))}switch(r){case"input":ll(t),sm(t,n,!1);break;case"textarea":ll(t),lm(t);break;case"option":n.value!=null&&t.setAttribute("value",""+Qn(n.value));break;case"select":t.multiple=!!n.multiple,o=n.value,o!=null?Go(t,!!n.multiple,o,!1):n.defaultValue!=null&&Go(t,!!n.multiple,n.defaultValue,!0);break;default:typeof i.onClick=="function"&&(t.onclick=ac)}switch(r){case"button":case"input":case"select":case"textarea":n=!!n.autoFocus;break e;case"img":n=!0;break e;default:n=!1}}n&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return Bt(e),null;case 6:if(t&&e.stateNode!=null)Bb(t,e,t.memoizedProps,n);else{if(typeof n!="string"&&e.stateNode===null)throw Error(le(166));if(r=Ni(Ea.current),Ni(Qr.current),vl(e)){if(n=e.stateNode,r=e.memoizedProps,n[Xr]=e,(o=n.nodeValue!==r)&&(t=mr,t!==null))switch(t.tag){case 3:gl(n.nodeValue,r,(t.mode&1)!==0);break;case 5:t.memoizedProps.suppressHydrationWarning!==!0&&gl(n.nodeValue,r,(t.mode&1)!==0)}o&&(e.flags|=4)}else n=(r.nodeType===9?r:r.ownerDocument).createTextNode(n),n[Xr]=e,e.stateNode=n}return Bt(e),null;case 13:if(lt(gt),n=e.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(pt&&hr!==null&&e.mode&1&&!(e.flags&128))ob(),es(),e.flags|=98560,o=!1;else if(o=vl(e),n!==null&&n.dehydrated!==null){if(t===null){if(!o)throw Error(le(318));if(o=e.memoizedState,o=o!==null?o.dehydrated:null,!o)throw Error(le(317));o[Xr]=e}else es(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;Bt(e),o=!1}else Dr!==null&&(bh(Dr),Dr=null),o=!0;if(!o)return e.flags&65536?e:null}return e.flags&128?(e.lanes=r,e):(n=n!==null,n!==(t!==null&&t.memoizedState!==null)&&n&&(e.child.flags|=8192,e.mode&1&&(t===null||gt.current&1?Rt===0&&(Rt=3):Mf())),e.updateQueue!==null&&(e.flags|=4),Bt(e),null);case 4:return rs(),dh(t,e),t===null&&Sa(e.stateNode.containerInfo),Bt(e),null;case 10:return bf(e.type._context),Bt(e),null;case 17:return ir(e.type)&&lc(),Bt(e),null;case 19:if(lt(gt),o=e.memoizedState,o===null)return Bt(e),null;if(n=(e.flags&128)!==0,s=o.rendering,s===null)if(n)Fs(o,!1);else{if(Rt!==0||t!==null&&t.flags&128)for(t=e.child;t!==null;){if(s=mc(t),s!==null){for(e.flags|=128,Fs(o,!1),n=s.updateQueue,n!==null&&(e.updateQueue=n,e.flags|=4),e.subtreeFlags=0,n=r,r=e.child;r!==null;)o=r,t=n,o.flags&=14680066,s=o.alternate,s===null?(o.childLanes=0,o.lanes=t,o.child=null,o.subtreeFlags=0,o.memoizedProps=null,o.memoizedState=null,o.updateQueue=null,o.dependencies=null,o.stateNode=null):(o.childLanes=s.childLanes,o.lanes=s.lanes,o.child=s.child,o.subtreeFlags=0,o.deletions=null,o.memoizedProps=s.memoizedProps,o.memoizedState=s.memoizedState,o.updateQueue=s.updateQueue,o.type=s.type,t=s.dependencies,o.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),r=r.sibling;return it(gt,gt.current&1|2),e.child}t=t.sibling}o.tail!==null&&St()>is&&(e.flags|=128,n=!0,Fs(o,!1),e.lanes=4194304)}else{if(!n)if(t=mc(s),t!==null){if(e.flags|=128,n=!0,r=t.updateQueue,r!==null&&(e.updateQueue=r,e.flags|=4),Fs(o,!0),o.tail===null&&o.tailMode==="hidden"&&!s.alternate&&!pt)return Bt(e),null}else 2*St()-o.renderingStartTime>is&&r!==1073741824&&(e.flags|=128,n=!0,Fs(o,!1),e.lanes=4194304);o.isBackwards?(s.sibling=e.child,e.child=s):(r=o.last,r!==null?r.sibling=s:e.child=s,o.last=s)}return o.tail!==null?(e=o.tail,o.rendering=e,o.tail=e.sibling,o.renderingStartTime=St(),e.sibling=null,r=gt.current,it(gt,n?r&1|2:r&1),e):(Bt(e),null);case 22:case 23:return If(),n=e.memoizedState!==null,t!==null&&t.memoizedState!==null!==n&&(e.flags|=8192),n&&e.mode&1?cr&1073741824&&(Bt(e),e.subtreeFlags&6&&(e.flags|=8192)):Bt(e),null;case 24:return null;case 25:return null}throw Error(le(156,e.tag))}function Y2(t,e){switch(mf(e),e.tag){case 1:return ir(e.type)&&lc(),t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 3:return rs(),lt(nr),lt(Vt),kf(),t=e.flags,t&65536&&!(t&128)?(e.flags=t&-65537|128,e):null;case 5:return Sf(e),null;case 13:if(lt(gt),t=e.memoizedState,t!==null&&t.dehydrated!==null){if(e.alternate===null)throw Error(le(340));es()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 19:return lt(gt),null;case 4:return rs(),null;case 10:return bf(e.type._context),null;case 22:case 23:return If(),null;case 24:return null;default:return null}}var xl=!1,Wt=!1,X2=typeof WeakSet=="function"?WeakSet:Set,xe=null;function Uo(t,e){var r=t.ref;if(r!==null)if(typeof r=="function")try{r(null)}catch(n){wt(t,e,n)}else r.current=null}function hh(t,e,r){try{r()}catch(n){wt(t,e,n)}}var Zm=!1;function Z2(t,e){if(Yd=ic,t=Vy(),ff(t)){if("selectionStart"in t)var r={start:t.selectionStart,end:t.selectionEnd};else e:{r=(r=t.ownerDocument)&&r.defaultView||window;var n=r.getSelection&&r.getSelection();if(n&&n.rangeCount!==0){r=n.anchorNode;var i=n.anchorOffset,o=n.focusNode;n=n.focusOffset;try{r.nodeType,o.nodeType}catch{r=null;break e}var s=0,a=-1,c=-1,u=0,d=0,h=t,f=null;t:for(;;){for(var p;h!==r||i!==0&&h.nodeType!==3||(a=s+i),h!==o||n!==0&&h.nodeType!==3||(c=s+n),h.nodeType===3&&(s+=h.nodeValue.length),(p=h.firstChild)!==null;)f=h,h=p;for(;;){if(h===t)break t;if(f===r&&++u===i&&(a=s),f===o&&++d===n&&(c=s),(p=h.nextSibling)!==null)break;h=f,f=h.parentNode}h=p}r=a===-1||c===-1?null:{start:a,end:c}}else r=null}r=r||{start:0,end:0}}else r=null;for(Xd={focusedElem:t,selectionRange:r},ic=!1,xe=e;xe!==null;)if(e=xe,t=e.child,(e.subtreeFlags&1028)!==0&&t!==null)t.return=e,xe=t;else for(;xe!==null;){e=xe;try{var g=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(g!==null){var m=g.memoizedProps,b=g.memoizedState,v=e.stateNode,y=v.getSnapshotBeforeUpdate(e.elementType===e.type?m:$r(e.type,m),b);v.__reactInternalSnapshotBeforeUpdate=y}break;case 3:var x=e.stateNode.containerInfo;x.nodeType===1?x.textContent="":x.nodeType===9&&x.documentElement&&x.removeChild(x.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(le(163))}}catch(S){wt(e,e.return,S)}if(t=e.sibling,t!==null){t.return=e.return,xe=t;break}xe=e.return}return g=Zm,Zm=!1,g}function la(t,e,r){var n=e.updateQueue;if(n=n!==null?n.lastEffect:null,n!==null){var i=n=n.next;do{if((i.tag&t)===t){var o=i.destroy;i.destroy=void 0,o!==void 0&&hh(e,r,o)}i=i.next}while(i!==n)}}function Yc(t,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var r=e=e.next;do{if((r.tag&t)===t){var n=r.create;r.destroy=n()}r=r.next}while(r!==e)}}function fh(t){var e=t.ref;if(e!==null){var r=t.stateNode;switch(t.tag){case 5:t=r;break;default:t=r}typeof e=="function"?e(t):e.current=t}}function Ub(t){var e=t.alternate;e!==null&&(t.alternate=null,Ub(e)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(e=t.stateNode,e!==null&&(delete e[Xr],delete e[ja],delete e[Qd],delete e[A2],delete e[$2])),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}function Hb(t){return t.tag===5||t.tag===3||t.tag===4}function Jm(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||Hb(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function ph(t,e,r){var n=t.tag;if(n===5||n===6)t=t.stateNode,e?r.nodeType===8?r.parentNode.insertBefore(t,e):r.insertBefore(t,e):(r.nodeType===8?(e=r.parentNode,e.insertBefore(t,r)):(e=r,e.appendChild(t)),r=r._reactRootContainer,r!=null||e.onclick!==null||(e.onclick=ac));else if(n!==4&&(t=t.child,t!==null))for(ph(t,e,r),t=t.sibling;t!==null;)ph(t,e,r),t=t.sibling}function mh(t,e,r){var n=t.tag;if(n===5||n===6)t=t.stateNode,e?r.insertBefore(t,e):r.appendChild(t);else if(n!==4&&(t=t.child,t!==null))for(mh(t,e,r),t=t.sibling;t!==null;)mh(t,e,r),t=t.sibling}var It=null,Mr=!1;function $n(t,e,r){for(r=r.child;r!==null;)Wb(t,e,r),r=r.sibling}function Wb(t,e,r){if(Jr&&typeof Jr.onCommitFiberUnmount=="function")try{Jr.onCommitFiberUnmount(Bc,r)}catch{}switch(r.tag){case 5:Wt||Uo(r,e);case 6:var n=It,i=Mr;It=null,$n(t,e,r),It=n,Mr=i,It!==null&&(Mr?(t=It,r=r.stateNode,t.nodeType===8?t.parentNode.removeChild(r):t.removeChild(r)):It.removeChild(r.stateNode));break;case 18:It!==null&&(Mr?(t=It,r=r.stateNode,t.nodeType===8?Uu(t.parentNode,r):t.nodeType===1&&Uu(t,r),xa(t)):Uu(It,r.stateNode));break;case 4:n=It,i=Mr,It=r.stateNode.containerInfo,Mr=!0,$n(t,e,r),It=n,Mr=i;break;case 0:case 11:case 14:case 15:if(!Wt&&(n=r.updateQueue,n!==null&&(n=n.lastEffect,n!==null))){i=n=n.next;do{var o=i,s=o.destroy;o=o.tag,s!==void 0&&(o&2||o&4)&&hh(r,e,s),i=i.next}while(i!==n)}$n(t,e,r);break;case 1:if(!Wt&&(Uo(r,e),n=r.stateNode,typeof n.componentWillUnmount=="function"))try{n.props=r.memoizedProps,n.state=r.memoizedState,n.componentWillUnmount()}catch(a){wt(r,e,a)}$n(t,e,r);break;case 21:$n(t,e,r);break;case 22:r.mode&1?(Wt=(n=Wt)||r.memoizedState!==null,$n(t,e,r),Wt=n):$n(t,e,r);break;default:$n(t,e,r)}}function Qm(t){var e=t.updateQueue;if(e!==null){t.updateQueue=null;var r=t.stateNode;r===null&&(r=t.stateNode=new X2),e.forEach(function(n){var i=sS.bind(null,t,n);r.has(n)||(r.add(n),n.then(i,i))})}}function Nr(t,e){var r=e.deletions;if(r!==null)for(var n=0;n<r.length;n++){var i=r[n];try{var o=t,s=e,a=s;e:for(;a!==null;){switch(a.tag){case 5:It=a.stateNode,Mr=!1;break e;case 3:It=a.stateNode.containerInfo,Mr=!0;break e;case 4:It=a.stateNode.containerInfo,Mr=!0;break e}a=a.return}if(It===null)throw Error(le(160));Wb(o,s,i),It=null,Mr=!1;var c=i.alternate;c!==null&&(c.return=null),i.return=null}catch(u){wt(i,e,u)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)Gb(e,t),e=e.sibling}function Gb(t,e){var r=t.alternate,n=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if(Nr(e,t),qr(t),n&4){try{la(3,t,t.return),Yc(3,t)}catch(m){wt(t,t.return,m)}try{la(5,t,t.return)}catch(m){wt(t,t.return,m)}}break;case 1:Nr(e,t),qr(t),n&512&&r!==null&&Uo(r,r.return);break;case 5:if(Nr(e,t),qr(t),n&512&&r!==null&&Uo(r,r.return),t.flags&32){var i=t.stateNode;try{ga(i,"")}catch(m){wt(t,t.return,m)}}if(n&4&&(i=t.stateNode,i!=null)){var o=t.memoizedProps,s=r!==null?r.memoizedProps:o,a=t.type,c=t.updateQueue;if(t.updateQueue=null,c!==null)try{a==="input"&&o.type==="radio"&&o.name!=null&&fy(i,o),zd(a,s);var u=zd(a,o);for(s=0;s<c.length;s+=2){var d=c[s],h=c[s+1];d==="style"?yy(i,h):d==="dangerouslySetInnerHTML"?gy(i,h):d==="children"?ga(i,h):Qh(i,d,h,u)}switch(a){case"input":$d(i,o);break;case"textarea":py(i,o);break;case"select":var f=i._wrapperState.wasMultiple;i._wrapperState.wasMultiple=!!o.multiple;var p=o.value;p!=null?Go(i,!!o.multiple,p,!1):f!==!!o.multiple&&(o.defaultValue!=null?Go(i,!!o.multiple,o.defaultValue,!0):Go(i,!!o.multiple,o.multiple?[]:"",!1))}i[ja]=o}catch(m){wt(t,t.return,m)}}break;case 6:if(Nr(e,t),qr(t),n&4){if(t.stateNode===null)throw Error(le(162));i=t.stateNode,o=t.memoizedProps;try{i.nodeValue=o}catch(m){wt(t,t.return,m)}}break;case 3:if(Nr(e,t),qr(t),n&4&&r!==null&&r.memoizedState.isDehydrated)try{xa(e.containerInfo)}catch(m){wt(t,t.return,m)}break;case 4:Nr(e,t),qr(t);break;case 13:Nr(e,t),qr(t),i=t.child,i.flags&8192&&(o=i.memoizedState!==null,i.stateNode.isHidden=o,!o||i.alternate!==null&&i.alternate.memoizedState!==null||(Af=St())),n&4&&Qm(t);break;case 22:if(d=r!==null&&r.memoizedState!==null,t.mode&1?(Wt=(u=Wt)||d,Nr(e,t),Wt=u):Nr(e,t),qr(t),n&8192){if(u=t.memoizedState!==null,(t.stateNode.isHidden=u)&&!d&&t.mode&1)for(xe=t,d=t.child;d!==null;){for(h=xe=d;xe!==null;){switch(f=xe,p=f.child,f.tag){case 0:case 11:case 14:case 15:la(4,f,f.return);break;case 1:Uo(f,f.return);var g=f.stateNode;if(typeof g.componentWillUnmount=="function"){n=f,r=f.return;try{e=n,g.props=e.memoizedProps,g.state=e.memoizedState,g.componentWillUnmount()}catch(m){wt(n,r,m)}}break;case 5:Uo(f,f.return);break;case 22:if(f.memoizedState!==null){tg(h);continue}}p!==null?(p.return=f,xe=p):tg(h)}d=d.sibling}e:for(d=null,h=t;;){if(h.tag===5){if(d===null){d=h;try{i=h.stateNode,u?(o=i.style,typeof o.setProperty=="function"?o.setProperty("display","none","important"):o.display="none"):(a=h.stateNode,c=h.memoizedProps.style,s=c!=null&&c.hasOwnProperty("display")?c.display:null,a.style.display=vy("display",s))}catch(m){wt(t,t.return,m)}}}else if(h.tag===6){if(d===null)try{h.stateNode.nodeValue=u?"":h.memoizedProps}catch(m){wt(t,t.return,m)}}else if((h.tag!==22&&h.tag!==23||h.memoizedState===null||h===t)&&h.child!==null){h.child.return=h,h=h.child;continue}if(h===t)break e;for(;h.sibling===null;){if(h.return===null||h.return===t)break e;d===h&&(d=null),h=h.return}d===h&&(d=null),h.sibling.return=h.return,h=h.sibling}}break;case 19:Nr(e,t),qr(t),n&4&&Qm(t);break;case 21:break;default:Nr(e,t),qr(t)}}function qr(t){var e=t.flags;if(e&2){try{e:{for(var r=t.return;r!==null;){if(Hb(r)){var n=r;break e}r=r.return}throw Error(le(160))}switch(n.tag){case 5:var i=n.stateNode;n.flags&32&&(ga(i,""),n.flags&=-33);var o=Jm(t);mh(t,o,i);break;case 3:case 4:var s=n.stateNode.containerInfo,a=Jm(t);ph(t,a,s);break;default:throw Error(le(161))}}catch(c){wt(t,t.return,c)}t.flags&=-3}e&4096&&(t.flags&=-4097)}function J2(t,e,r){xe=t,Vb(t)}function Vb(t,e,r){for(var n=(t.mode&1)!==0;xe!==null;){var i=xe,o=i.child;if(i.tag===22&&n){var s=i.memoizedState!==null||xl;if(!s){var a=i.alternate,c=a!==null&&a.memoizedState!==null||Wt;a=xl;var u=Wt;if(xl=s,(Wt=c)&&!u)for(xe=i;xe!==null;)s=xe,c=s.child,s.tag===22&&s.memoizedState!==null?rg(i):c!==null?(c.return=s,xe=c):rg(i);for(;o!==null;)xe=o,Vb(o),o=o.sibling;xe=i,xl=a,Wt=u}eg(t)}else i.subtreeFlags&8772&&o!==null?(o.return=i,xe=o):eg(t)}}function eg(t){for(;xe!==null;){var e=xe;if(e.flags&8772){var r=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:Wt||Yc(5,e);break;case 1:var n=e.stateNode;if(e.flags&4&&!Wt)if(r===null)n.componentDidMount();else{var i=e.elementType===e.type?r.memoizedProps:$r(e.type,r.memoizedProps);n.componentDidUpdate(i,r.memoizedState,n.__reactInternalSnapshotBeforeUpdate)}var o=e.updateQueue;o!==null&&Dm(e,o,n);break;case 3:var s=e.updateQueue;if(s!==null){if(r=null,e.child!==null)switch(e.child.tag){case 5:r=e.child.stateNode;break;case 1:r=e.child.stateNode}Dm(e,s,r)}break;case 5:var a=e.stateNode;if(r===null&&e.flags&4){r=a;var c=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":c.autoFocus&&r.focus();break;case"img":c.src&&(r.src=c.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var u=e.alternate;if(u!==null){var d=u.memoizedState;if(d!==null){var h=d.dehydrated;h!==null&&xa(h)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(le(163))}Wt||e.flags&512&&fh(e)}catch(f){wt(e,e.return,f)}}if(e===t){xe=null;break}if(r=e.sibling,r!==null){r.return=e.return,xe=r;break}xe=e.return}}function tg(t){for(;xe!==null;){var e=xe;if(e===t){xe=null;break}var r=e.sibling;if(r!==null){r.return=e.return,xe=r;break}xe=e.return}}function rg(t){for(;xe!==null;){var e=xe;try{switch(e.tag){case 0:case 11:case 15:var r=e.return;try{Yc(4,e)}catch(c){wt(e,r,c)}break;case 1:var n=e.stateNode;if(typeof n.componentDidMount=="function"){var i=e.return;try{n.componentDidMount()}catch(c){wt(e,i,c)}}var o=e.return;try{fh(e)}catch(c){wt(e,o,c)}break;case 5:var s=e.return;try{fh(e)}catch(c){wt(e,s,c)}}}catch(c){wt(e,e.return,c)}if(e===t){xe=null;break}var a=e.sibling;if(a!==null){a.return=e.return,xe=a;break}xe=e.return}}var Q2=Math.ceil,yc=kn.ReactCurrentDispatcher,Pf=kn.ReactCurrentOwner,kr=kn.ReactCurrentBatchConfig,Ke=0,Ot=null,Ct=null,Lt=0,cr=0,Ho=ii(0),Rt=0,Pa=null,zi=0,Xc=0,Of=0,ca=null,tr=null,Af=0,is=1/0,hn=null,bc=!1,gh=null,Xn=null,wl=!1,Wn=null,xc=0,ua=0,vh=null,Yl=-1,Xl=0;function Xt(){return Ke&6?St():Yl!==-1?Yl:Yl=St()}function Zn(t){return t.mode&1?Ke&2&&Lt!==0?Lt&-Lt:M2.transition!==null?(Xl===0&&(Xl=Ny()),Xl):(t=Je,t!==0||(t=window.event,t=t===void 0?16:Ly(t.type)),t):1}function Br(t,e,r,n){if(50<ua)throw ua=0,vh=null,Error(le(185));za(t,r,n),(!(Ke&2)||t!==Ot)&&(t===Ot&&(!(Ke&2)&&(Xc|=r),Rt===4&&Fn(t,Lt)),or(t,n),r===1&&Ke===0&&!(e.mode&1)&&(is=St()+500,Vc&&oi()))}function or(t,e){var r=t.callbackNode;M_(t,e);var n=nc(t,t===Ot?Lt:0);if(n===0)r!==null&&dm(r),t.callbackNode=null,t.callbackPriority=0;else if(e=n&-n,t.callbackPriority!==e){if(r!=null&&dm(r),e===1)t.tag===0?I2(ng.bind(null,t)):rb(ng.bind(null,t)),P2(function(){!(Ke&6)&&oi()}),r=null;else{switch(Py(n)){case 1:r=of;break;case 4:r=Ty;break;case 16:r=rc;break;case 536870912:r=Ry;break;default:r=rc}r=ex(r,qb.bind(null,t))}t.callbackPriority=e,t.callbackNode=r}}function qb(t,e){if(Yl=-1,Xl=0,Ke&6)throw Error(le(327));var r=t.callbackNode;if(Xo()&&t.callbackNode!==r)return null;var n=nc(t,t===Ot?Lt:0);if(n===0)return null;if(n&30||n&t.expiredLanes||e)e=wc(t,n);else{e=n;var i=Ke;Ke|=2;var o=Yb();(Ot!==t||Lt!==e)&&(hn=null,is=St()+500,Ai(t,e));do try{rS();break}catch(a){Kb(t,a)}while(!0);yf(),yc.current=o,Ke=i,Ct!==null?e=0:(Ot=null,Lt=0,e=Rt)}if(e!==0){if(e===2&&(i=Wd(t),i!==0&&(n=i,e=yh(t,i))),e===1)throw r=Pa,Ai(t,0),Fn(t,n),or(t,St()),r;if(e===6)Fn(t,n);else{if(i=t.current.alternate,!(n&30)&&!eS(i)&&(e=wc(t,n),e===2&&(o=Wd(t),o!==0&&(n=o,e=yh(t,o))),e===1))throw r=Pa,Ai(t,0),Fn(t,n),or(t,St()),r;switch(t.finishedWork=i,t.finishedLanes=n,e){case 0:case 1:throw Error(le(345));case 2:Si(t,tr,hn);break;case 3:if(Fn(t,n),(n&130023424)===n&&(e=Af+500-St(),10<e)){if(nc(t,0)!==0)break;if(i=t.suspendedLanes,(i&n)!==n){Xt(),t.pingedLanes|=t.suspendedLanes&i;break}t.timeoutHandle=Jd(Si.bind(null,t,tr,hn),e);break}Si(t,tr,hn);break;case 4:if(Fn(t,n),(n&4194240)===n)break;for(e=t.eventTimes,i=-1;0<n;){var s=31-Fr(n);o=1<<s,s=e[s],s>i&&(i=s),n&=~o}if(n=i,n=St()-n,n=(120>n?120:480>n?480:1080>n?1080:1920>n?1920:3e3>n?3e3:4320>n?4320:1960*Q2(n/1960))-n,10<n){t.timeoutHandle=Jd(Si.bind(null,t,tr,hn),n);break}Si(t,tr,hn);break;case 5:Si(t,tr,hn);break;default:throw Error(le(329))}}}return or(t,St()),t.callbackNode===r?qb.bind(null,t):null}function yh(t,e){var r=ca;return t.current.memoizedState.isDehydrated&&(Ai(t,e).flags|=256),t=wc(t,e),t!==2&&(e=tr,tr=r,e!==null&&bh(e)),t}function bh(t){tr===null?tr=t:tr.push.apply(tr,t)}function eS(t){for(var e=t;;){if(e.flags&16384){var r=e.updateQueue;if(r!==null&&(r=r.stores,r!==null))for(var n=0;n<r.length;n++){var i=r[n],o=i.getSnapshot;i=i.value;try{if(!Ur(o(),i))return!1}catch{return!1}}}if(r=e.child,e.subtreeFlags&16384&&r!==null)r.return=e,e=r;else{if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function Fn(t,e){for(e&=~Of,e&=~Xc,t.suspendedLanes|=e,t.pingedLanes&=~e,t=t.expirationTimes;0<e;){var r=31-Fr(e),n=1<<r;t[r]=-1,e&=~n}}function ng(t){if(Ke&6)throw Error(le(327));Xo();var e=nc(t,0);if(!(e&1))return or(t,St()),null;var r=wc(t,e);if(t.tag!==0&&r===2){var n=Wd(t);n!==0&&(e=n,r=yh(t,n))}if(r===1)throw r=Pa,Ai(t,0),Fn(t,e),or(t,St()),r;if(r===6)throw Error(le(345));return t.finishedWork=t.current.alternate,t.finishedLanes=e,Si(t,tr,hn),or(t,St()),null}function $f(t,e){var r=Ke;Ke|=1;try{return t(e)}finally{Ke=r,Ke===0&&(is=St()+500,Vc&&oi())}}function Fi(t){Wn!==null&&Wn.tag===0&&!(Ke&6)&&Xo();var e=Ke;Ke|=1;var r=kr.transition,n=Je;try{if(kr.transition=null,Je=1,t)return t()}finally{Je=n,kr.transition=r,Ke=e,!(Ke&6)&&oi()}}function If(){cr=Ho.current,lt(Ho)}function Ai(t,e){t.finishedWork=null,t.finishedLanes=0;var r=t.timeoutHandle;if(r!==-1&&(t.timeoutHandle=-1,N2(r)),Ct!==null)for(r=Ct.return;r!==null;){var n=r;switch(mf(n),n.tag){case 1:n=n.type.childContextTypes,n!=null&&lc();break;case 3:rs(),lt(nr),lt(Vt),kf();break;case 5:Sf(n);break;case 4:rs();break;case 13:lt(gt);break;case 19:lt(gt);break;case 10:bf(n.type._context);break;case 22:case 23:If()}r=r.return}if(Ot=t,Ct=t=Jn(t.current,null),Lt=cr=e,Rt=0,Pa=null,Of=Xc=zi=0,tr=ca=null,Ri!==null){for(e=0;e<Ri.length;e++)if(r=Ri[e],n=r.interleaved,n!==null){r.interleaved=null;var i=n.next,o=r.pending;if(o!==null){var s=o.next;o.next=i,n.next=s}r.pending=n}Ri=null}return t}function Kb(t,e){do{var r=Ct;try{if(yf(),Vl.current=vc,gc){for(var n=vt.memoizedState;n!==null;){var i=n.queue;i!==null&&(i.pending=null),n=n.next}gc=!1}if(Di=0,Pt=Tt=vt=null,aa=!1,Ta=0,Pf.current=null,r===null||r.return===null){Rt=1,Pa=e,Ct=null;break}e:{var o=t,s=r.return,a=r,c=e;if(e=Lt,a.flags|=32768,c!==null&&typeof c=="object"&&typeof c.then=="function"){var u=c,d=a,h=d.tag;if(!(d.mode&1)&&(h===0||h===11||h===15)){var f=d.alternate;f?(d.updateQueue=f.updateQueue,d.memoizedState=f.memoizedState,d.lanes=f.lanes):(d.updateQueue=null,d.memoizedState=null)}var p=Wm(s);if(p!==null){p.flags&=-257,Gm(p,s,a,o,e),p.mode&1&&Hm(o,u,e),e=p,c=u;var g=e.updateQueue;if(g===null){var m=new Set;m.add(c),e.updateQueue=m}else g.add(c);break e}else{if(!(e&1)){Hm(o,u,e),Mf();break e}c=Error(le(426))}}else if(pt&&a.mode&1){var b=Wm(s);if(b!==null){!(b.flags&65536)&&(b.flags|=256),Gm(b,s,a,o,e),gf(ns(c,a));break e}}o=c=ns(c,a),Rt!==4&&(Rt=2),ca===null?ca=[o]:ca.push(o),o=s;do{switch(o.tag){case 3:o.flags|=65536,e&=-e,o.lanes|=e;var v=Pb(o,c,e);Lm(o,v);break e;case 1:a=c;var y=o.type,x=o.stateNode;if(!(o.flags&128)&&(typeof y.getDerivedStateFromError=="function"||x!==null&&typeof x.componentDidCatch=="function"&&(Xn===null||!Xn.has(x)))){o.flags|=65536,e&=-e,o.lanes|=e;var S=Ob(o,a,e);Lm(o,S);break e}}o=o.return}while(o!==null)}Zb(r)}catch(j){e=j,Ct===r&&r!==null&&(Ct=r=r.return);continue}break}while(!0)}function Yb(){var t=yc.current;return yc.current=vc,t===null?vc:t}function Mf(){(Rt===0||Rt===3||Rt===2)&&(Rt=4),Ot===null||!(zi&268435455)&&!(Xc&268435455)||Fn(Ot,Lt)}function wc(t,e){var r=Ke;Ke|=2;var n=Yb();(Ot!==t||Lt!==e)&&(hn=null,Ai(t,e));do try{tS();break}catch(i){Kb(t,i)}while(!0);if(yf(),Ke=r,yc.current=n,Ct!==null)throw Error(le(261));return Ot=null,Lt=0,Rt}function tS(){for(;Ct!==null;)Xb(Ct)}function rS(){for(;Ct!==null&&!E_();)Xb(Ct)}function Xb(t){var e=Qb(t.alternate,t,cr);t.memoizedProps=t.pendingProps,e===null?Zb(t):Ct=e,Pf.current=null}function Zb(t){var e=t;do{var r=e.alternate;if(t=e.return,e.flags&32768){if(r=Y2(r,e),r!==null){r.flags&=32767,Ct=r;return}if(t!==null)t.flags|=32768,t.subtreeFlags=0,t.deletions=null;else{Rt=6,Ct=null;return}}else if(r=K2(r,e,cr),r!==null){Ct=r;return}if(e=e.sibling,e!==null){Ct=e;return}Ct=e=t}while(e!==null);Rt===0&&(Rt=5)}function Si(t,e,r){var n=Je,i=kr.transition;try{kr.transition=null,Je=1,nS(t,e,r,n)}finally{kr.transition=i,Je=n}return null}function nS(t,e,r,n){do Xo();while(Wn!==null);if(Ke&6)throw Error(le(327));r=t.finishedWork;var i=t.finishedLanes;if(r===null)return null;if(t.finishedWork=null,t.finishedLanes=0,r===t.current)throw Error(le(177));t.callbackNode=null,t.callbackPriority=0;var o=r.lanes|r.childLanes;if(L_(t,o),t===Ot&&(Ct=Ot=null,Lt=0),!(r.subtreeFlags&2064)&&!(r.flags&2064)||wl||(wl=!0,ex(rc,function(){return Xo(),null})),o=(r.flags&15990)!==0,r.subtreeFlags&15990||o){o=kr.transition,kr.transition=null;var s=Je;Je=1;var a=Ke;Ke|=4,Pf.current=null,Z2(t,r),Gb(r,t),S2(Xd),ic=!!Yd,Xd=Yd=null,t.current=r,J2(r),T_(),Ke=a,Je=s,kr.transition=o}else t.current=r;if(wl&&(wl=!1,Wn=t,xc=i),o=t.pendingLanes,o===0&&(Xn=null),P_(r.stateNode),or(t,St()),e!==null)for(n=t.onRecoverableError,r=0;r<e.length;r++)i=e[r],n(i.value,{componentStack:i.stack,digest:i.digest});if(bc)throw bc=!1,t=gh,gh=null,t;return xc&1&&t.tag!==0&&Xo(),o=t.pendingLanes,o&1?t===vh?ua++:(ua=0,vh=t):ua=0,oi(),null}function Xo(){if(Wn!==null){var t=Py(xc),e=kr.transition,r=Je;try{if(kr.transition=null,Je=16>t?16:t,Wn===null)var n=!1;else{if(t=Wn,Wn=null,xc=0,Ke&6)throw Error(le(331));var i=Ke;for(Ke|=4,xe=t.current;xe!==null;){var o=xe,s=o.child;if(xe.flags&16){var a=o.deletions;if(a!==null){for(var c=0;c<a.length;c++){var u=a[c];for(xe=u;xe!==null;){var d=xe;switch(d.tag){case 0:case 11:case 15:la(8,d,o)}var h=d.child;if(h!==null)h.return=d,xe=h;else for(;xe!==null;){d=xe;var f=d.sibling,p=d.return;if(Ub(d),d===u){xe=null;break}if(f!==null){f.return=p,xe=f;break}xe=p}}}var g=o.alternate;if(g!==null){var m=g.child;if(m!==null){g.child=null;do{var b=m.sibling;m.sibling=null,m=b}while(m!==null)}}xe=o}}if(o.subtreeFlags&2064&&s!==null)s.return=o,xe=s;else e:for(;xe!==null;){if(o=xe,o.flags&2048)switch(o.tag){case 0:case 11:case 15:la(9,o,o.return)}var v=o.sibling;if(v!==null){v.return=o.return,xe=v;break e}xe=o.return}}var y=t.current;for(xe=y;xe!==null;){s=xe;var x=s.child;if(s.subtreeFlags&2064&&x!==null)x.return=s,xe=x;else e:for(s=y;xe!==null;){if(a=xe,a.flags&2048)try{switch(a.tag){case 0:case 11:case 15:Yc(9,a)}}catch(j){wt(a,a.return,j)}if(a===s){xe=null;break e}var S=a.sibling;if(S!==null){S.return=a.return,xe=S;break e}xe=a.return}}if(Ke=i,oi(),Jr&&typeof Jr.onPostCommitFiberRoot=="function")try{Jr.onPostCommitFiberRoot(Bc,t)}catch{}n=!0}return n}finally{Je=r,kr.transition=e}}return!1}function ig(t,e,r){e=ns(r,e),e=Pb(t,e,1),t=Yn(t,e,1),e=Xt(),t!==null&&(za(t,1,e),or(t,e))}function wt(t,e,r){if(t.tag===3)ig(t,t,r);else for(;e!==null;){if(e.tag===3){ig(e,t,r);break}else if(e.tag===1){var n=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof n.componentDidCatch=="function"&&(Xn===null||!Xn.has(n))){t=ns(r,t),t=Ob(e,t,1),e=Yn(e,t,1),t=Xt(),e!==null&&(za(e,1,t),or(e,t));break}}e=e.return}}function iS(t,e,r){var n=t.pingCache;n!==null&&n.delete(e),e=Xt(),t.pingedLanes|=t.suspendedLanes&r,Ot===t&&(Lt&r)===r&&(Rt===4||Rt===3&&(Lt&130023424)===Lt&&500>St()-Af?Ai(t,0):Of|=r),or(t,e)}function Jb(t,e){e===0&&(t.mode&1?(e=dl,dl<<=1,!(dl&130023424)&&(dl=4194304)):e=1);var r=Xt();t=_n(t,e),t!==null&&(za(t,e,r),or(t,r))}function oS(t){var e=t.memoizedState,r=0;e!==null&&(r=e.retryLane),Jb(t,r)}function sS(t,e){var r=0;switch(t.tag){case 13:var n=t.stateNode,i=t.memoizedState;i!==null&&(r=i.retryLane);break;case 19:n=t.stateNode;break;default:throw Error(le(314))}n!==null&&n.delete(e),Jb(t,r)}var Qb;Qb=function(t,e,r){if(t!==null)if(t.memoizedProps!==e.pendingProps||nr.current)rr=!0;else{if(!(t.lanes&r)&&!(e.flags&128))return rr=!1,q2(t,e,r);rr=!!(t.flags&131072)}else rr=!1,pt&&e.flags&1048576&&nb(e,dc,e.index);switch(e.lanes=0,e.tag){case 2:var n=e.type;Kl(t,e),t=e.pendingProps;var i=Qo(e,Vt.current);Yo(e,r),i=Cf(null,e,n,t,i,r);var o=Ef();return e.flags|=1,typeof i=="object"&&i!==null&&typeof i.render=="function"&&i.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,ir(n)?(o=!0,cc(e)):o=!1,e.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,wf(e),i.updater=Kc,e.stateNode=i,i._reactInternals=e,oh(e,n,t,r),e=lh(null,e,n,!0,o,r)):(e.tag=0,pt&&o&&pf(e),Kt(null,e,i,r),e=e.child),e;case 16:n=e.elementType;e:{switch(Kl(t,e),t=e.pendingProps,i=n._init,n=i(n._payload),e.type=n,i=e.tag=lS(n),t=$r(n,t),i){case 0:e=ah(null,e,n,t,r);break e;case 1:e=Km(null,e,n,t,r);break e;case 11:e=Vm(null,e,n,t,r);break e;case 14:e=qm(null,e,n,$r(n.type,t),r);break e}throw Error(le(306,n,""))}return e;case 0:return n=e.type,i=e.pendingProps,i=e.elementType===n?i:$r(n,i),ah(t,e,n,i,r);case 1:return n=e.type,i=e.pendingProps,i=e.elementType===n?i:$r(n,i),Km(t,e,n,i,r);case 3:e:{if(Mb(e),t===null)throw Error(le(387));n=e.pendingProps,o=e.memoizedState,i=o.element,cb(t,e),pc(e,n,null,r);var s=e.memoizedState;if(n=s.element,o.isDehydrated)if(o={element:n,isDehydrated:!1,cache:s.cache,pendingSuspenseBoundaries:s.pendingSuspenseBoundaries,transitions:s.transitions},e.updateQueue.baseState=o,e.memoizedState=o,e.flags&256){i=ns(Error(le(423)),e),e=Ym(t,e,n,r,i);break e}else if(n!==i){i=ns(Error(le(424)),e),e=Ym(t,e,n,r,i);break e}else for(hr=Kn(e.stateNode.containerInfo.firstChild),mr=e,pt=!0,Dr=null,r=ab(e,null,n,r),e.child=r;r;)r.flags=r.flags&-3|4096,r=r.sibling;else{if(es(),n===i){e=Sn(t,e,r);break e}Kt(t,e,n,r)}e=e.child}return e;case 5:return ub(e),t===null&&rh(e),n=e.type,i=e.pendingProps,o=t!==null?t.memoizedProps:null,s=i.children,Zd(n,i)?s=null:o!==null&&Zd(n,o)&&(e.flags|=32),Ib(t,e),Kt(t,e,s,r),e.child;case 6:return t===null&&rh(e),null;case 13:return Lb(t,e,r);case 4:return _f(e,e.stateNode.containerInfo),n=e.pendingProps,t===null?e.child=ts(e,null,n,r):Kt(t,e,n,r),e.child;case 11:return n=e.type,i=e.pendingProps,i=e.elementType===n?i:$r(n,i),Vm(t,e,n,i,r);case 7:return Kt(t,e,e.pendingProps,r),e.child;case 8:return Kt(t,e,e.pendingProps.children,r),e.child;case 12:return Kt(t,e,e.pendingProps.children,r),e.child;case 10:e:{if(n=e.type._context,i=e.pendingProps,o=e.memoizedProps,s=i.value,it(hc,n._currentValue),n._currentValue=s,o!==null)if(Ur(o.value,s)){if(o.children===i.children&&!nr.current){e=Sn(t,e,r);break e}}else for(o=e.child,o!==null&&(o.return=e);o!==null;){var a=o.dependencies;if(a!==null){s=o.child;for(var c=a.firstContext;c!==null;){if(c.context===n){if(o.tag===1){c=yn(-1,r&-r),c.tag=2;var u=o.updateQueue;if(u!==null){u=u.shared;var d=u.pending;d===null?c.next=c:(c.next=d.next,d.next=c),u.pending=c}}o.lanes|=r,c=o.alternate,c!==null&&(c.lanes|=r),nh(o.return,r,e),a.lanes|=r;break}c=c.next}}else if(o.tag===10)s=o.type===e.type?null:o.child;else if(o.tag===18){if(s=o.return,s===null)throw Error(le(341));s.lanes|=r,a=s.alternate,a!==null&&(a.lanes|=r),nh(s,r,e),s=o.sibling}else s=o.child;if(s!==null)s.return=o;else for(s=o;s!==null;){if(s===e){s=null;break}if(o=s.sibling,o!==null){o.return=s.return,s=o;break}s=s.return}o=s}Kt(t,e,i.children,r),e=e.child}return e;case 9:return i=e.type,n=e.pendingProps.children,Yo(e,r),i=jr(i),n=n(i),e.flags|=1,Kt(t,e,n,r),e.child;case 14:return n=e.type,i=$r(n,e.pendingProps),i=$r(n.type,i),qm(t,e,n,i,r);case 15:return Ab(t,e,e.type,e.pendingProps,r);case 17:return n=e.type,i=e.pendingProps,i=e.elementType===n?i:$r(n,i),Kl(t,e),e.tag=1,ir(n)?(t=!0,cc(e)):t=!1,Yo(e,r),Nb(e,n,i),oh(e,n,i,r),lh(null,e,n,!0,t,r);case 19:return Db(t,e,r);case 22:return $b(t,e,r)}throw Error(le(156,e.tag))};function ex(t,e){return Ey(t,e)}function aS(t,e,r,n){this.tag=t,this.key=r,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=n,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Sr(t,e,r,n){return new aS(t,e,r,n)}function Lf(t){return t=t.prototype,!(!t||!t.isReactComponent)}function lS(t){if(typeof t=="function")return Lf(t)?1:0;if(t!=null){if(t=t.$$typeof,t===tf)return 11;if(t===rf)return 14}return 2}function Jn(t,e){var r=t.alternate;return r===null?(r=Sr(t.tag,e,t.key,t.mode),r.elementType=t.elementType,r.type=t.type,r.stateNode=t.stateNode,r.alternate=t,t.alternate=r):(r.pendingProps=e,r.type=t.type,r.flags=0,r.subtreeFlags=0,r.deletions=null),r.flags=t.flags&14680064,r.childLanes=t.childLanes,r.lanes=t.lanes,r.child=t.child,r.memoizedProps=t.memoizedProps,r.memoizedState=t.memoizedState,r.updateQueue=t.updateQueue,e=t.dependencies,r.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},r.sibling=t.sibling,r.index=t.index,r.ref=t.ref,r}function Zl(t,e,r,n,i,o){var s=2;if(n=t,typeof t=="function")Lf(t)&&(s=1);else if(typeof t=="string")s=5;else e:switch(t){case Ao:return $i(r.children,i,o,e);case ef:s=8,i|=8;break;case Rd:return t=Sr(12,r,e,i|2),t.elementType=Rd,t.lanes=o,t;case Nd:return t=Sr(13,r,e,i),t.elementType=Nd,t.lanes=o,t;case Pd:return t=Sr(19,r,e,i),t.elementType=Pd,t.lanes=o,t;case uy:return Zc(r,i,o,e);default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case ly:s=10;break e;case cy:s=9;break e;case tf:s=11;break e;case rf:s=14;break e;case Mn:s=16,n=null;break e}throw Error(le(130,t==null?t:typeof t,""))}return e=Sr(s,r,e,i),e.elementType=t,e.type=n,e.lanes=o,e}function $i(t,e,r,n){return t=Sr(7,t,n,e),t.lanes=r,t}function Zc(t,e,r,n){return t=Sr(22,t,n,e),t.elementType=uy,t.lanes=r,t.stateNode={isHidden:!1},t}function Xu(t,e,r){return t=Sr(6,t,null,e),t.lanes=r,t}function Zu(t,e,r){return e=Sr(4,t.children!==null?t.children:[],t.key,e),e.lanes=r,e.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},e}function cS(t,e,r,n,i){this.tag=e,this.containerInfo=t,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Pu(0),this.expirationTimes=Pu(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Pu(0),this.identifierPrefix=n,this.onRecoverableError=i,this.mutableSourceEagerHydrationData=null}function Df(t,e,r,n,i,o,s,a,c){return t=new cS(t,e,r,a,c),e===1?(e=1,o===!0&&(e|=8)):e=0,o=Sr(3,null,null,e),t.current=o,o.stateNode=t,o.memoizedState={element:n,isDehydrated:r,cache:null,transitions:null,pendingSuspenseBoundaries:null},wf(o),t}function uS(t,e,r){var n=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Oo,key:n==null?null:""+n,children:t,containerInfo:e,implementation:r}}function tx(t){if(!t)return ei;t=t._reactInternals;e:{if(Hi(t)!==t||t.tag!==1)throw Error(le(170));var e=t;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(ir(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(le(171))}if(t.tag===1){var r=t.type;if(ir(r))return tb(t,r,e)}return e}function rx(t,e,r,n,i,o,s,a,c){return t=Df(r,n,!0,t,i,o,s,a,c),t.context=tx(null),r=t.current,n=Xt(),i=Zn(r),o=yn(n,i),o.callback=e??null,Yn(r,o,i),t.current.lanes=i,za(t,i,n),or(t,n),t}function Jc(t,e,r,n){var i=e.current,o=Xt(),s=Zn(i);return r=tx(r),e.context===null?e.context=r:e.pendingContext=r,e=yn(o,s),e.payload={element:t},n=n===void 0?null:n,n!==null&&(e.callback=n),t=Yn(i,e,s),t!==null&&(Br(t,i,s,o),Gl(t,i,s)),s}function _c(t){if(t=t.current,!t.child)return null;switch(t.child.tag){case 5:return t.child.stateNode;default:return t.child.stateNode}}function og(t,e){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var r=t.retryLane;t.retryLane=r!==0&&r<e?r:e}}function zf(t,e){og(t,e),(t=t.alternate)&&og(t,e)}function dS(){return null}var nx=typeof reportError=="function"?reportError:function(t){console.error(t)};function Ff(t){this._internalRoot=t}Qc.prototype.render=Ff.prototype.render=function(t){var e=this._internalRoot;if(e===null)throw Error(le(409));Jc(t,e,null,null)};Qc.prototype.unmount=Ff.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var e=t.containerInfo;Fi(function(){Jc(null,t,null,null)}),e[wn]=null}};function Qc(t){this._internalRoot=t}Qc.prototype.unstable_scheduleHydration=function(t){if(t){var e=$y();t={blockedOn:null,target:t,priority:e};for(var r=0;r<zn.length&&e!==0&&e<zn[r].priority;r++);zn.splice(r,0,t),r===0&&My(t)}};function Bf(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function eu(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11&&(t.nodeType!==8||t.nodeValue!==" react-mount-point-unstable "))}function sg(){}function hS(t,e,r,n,i){if(i){if(typeof n=="function"){var o=n;n=function(){var u=_c(s);o.call(u)}}var s=rx(e,n,t,0,null,!1,!1,"",sg);return t._reactRootContainer=s,t[wn]=s.current,Sa(t.nodeType===8?t.parentNode:t),Fi(),s}for(;i=t.lastChild;)t.removeChild(i);if(typeof n=="function"){var a=n;n=function(){var u=_c(c);a.call(u)}}var c=Df(t,0,!1,null,null,!1,!1,"",sg);return t._reactRootContainer=c,t[wn]=c.current,Sa(t.nodeType===8?t.parentNode:t),Fi(function(){Jc(e,c,r,n)}),c}function tu(t,e,r,n,i){var o=r._reactRootContainer;if(o){var s=o;if(typeof i=="function"){var a=i;i=function(){var c=_c(s);a.call(c)}}Jc(e,s,t,i)}else s=hS(r,e,t,i,n);return _c(s)}Oy=function(t){switch(t.tag){case 3:var e=t.stateNode;if(e.current.memoizedState.isDehydrated){var r=Xs(e.pendingLanes);r!==0&&(sf(e,r|1),or(e,St()),!(Ke&6)&&(is=St()+500,oi()))}break;case 13:Fi(function(){var n=_n(t,1);if(n!==null){var i=Xt();Br(n,t,1,i)}}),zf(t,1)}};af=function(t){if(t.tag===13){var e=_n(t,134217728);if(e!==null){var r=Xt();Br(e,t,134217728,r)}zf(t,134217728)}};Ay=function(t){if(t.tag===13){var e=Zn(t),r=_n(t,e);if(r!==null){var n=Xt();Br(r,t,e,n)}zf(t,e)}};$y=function(){return Je};Iy=function(t,e){var r=Je;try{return Je=t,e()}finally{Je=r}};Bd=function(t,e,r){switch(e){case"input":if($d(t,r),e=r.name,r.type==="radio"&&e!=null){for(r=t;r.parentNode;)r=r.parentNode;for(r=r.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<r.length;e++){var n=r[e];if(n!==t&&n.form===t.form){var i=Gc(n);if(!i)throw Error(le(90));hy(n),$d(n,i)}}}break;case"textarea":py(t,r);break;case"select":e=r.value,e!=null&&Go(t,!!r.multiple,e,!1)}};wy=$f;_y=Fi;var fS={usingClientEntryPoint:!1,Events:[Ba,Lo,Gc,by,xy,$f]},Bs={findFiberByHostInstance:Ti,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},pS={bundleType:Bs.bundleType,version:Bs.version,rendererPackageName:Bs.rendererPackageName,rendererConfig:Bs.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:kn.ReactCurrentDispatcher,findHostInstanceByFiber:function(t){return t=jy(t),t===null?null:t.stateNode},findFiberByHostInstance:Bs.findFiberByHostInstance||dS,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var _l=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!_l.isDisabled&&_l.supportsFiber)try{Bc=_l.inject(pS),Jr=_l}catch{}}yr.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=fS;yr.createPortal=function(t,e){var r=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Bf(e))throw Error(le(200));return uS(t,e,null,r)};yr.createRoot=function(t,e){if(!Bf(t))throw Error(le(299));var r=!1,n="",i=nx;return e!=null&&(e.unstable_strictMode===!0&&(r=!0),e.identifierPrefix!==void 0&&(n=e.identifierPrefix),e.onRecoverableError!==void 0&&(i=e.onRecoverableError)),e=Df(t,1,!1,null,null,r,!1,n,i),t[wn]=e.current,Sa(t.nodeType===8?t.parentNode:t),new Ff(e)};yr.findDOMNode=function(t){if(t==null)return null;if(t.nodeType===1)return t;var e=t._reactInternals;if(e===void 0)throw typeof t.render=="function"?Error(le(188)):(t=Object.keys(t).join(","),Error(le(268,t)));return t=jy(e),t=t===null?null:t.stateNode,t};yr.flushSync=function(t){return Fi(t)};yr.hydrate=function(t,e,r){if(!eu(e))throw Error(le(200));return tu(null,t,e,!0,r)};yr.hydrateRoot=function(t,e,r){if(!Bf(t))throw Error(le(405));var n=r!=null&&r.hydratedSources||null,i=!1,o="",s=nx;if(r!=null&&(r.unstable_strictMode===!0&&(i=!0),r.identifierPrefix!==void 0&&(o=r.identifierPrefix),r.onRecoverableError!==void 0&&(s=r.onRecoverableError)),e=rx(e,null,t,1,r??null,i,!1,o,s),t[wn]=e.current,Sa(t),n)for(t=0;t<n.length;t++)r=n[t],i=r._getVersion,i=i(r._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[r,i]:e.mutableSourceEagerHydrationData.push(r,i);return new Qc(e)};yr.render=function(t,e,r){if(!eu(e))throw Error(le(200));return tu(null,t,e,!1,r)};yr.unmountComponentAtNode=function(t){if(!eu(t))throw Error(le(40));return t._reactRootContainer?(Fi(function(){tu(null,null,t,!1,function(){t._reactRootContainer=null,t[wn]=null})}),!0):!1};yr.unstable_batchedUpdates=$f;yr.unstable_renderSubtreeIntoContainer=function(t,e,r,n){if(!eu(r))throw Error(le(200));if(t==null||t._reactInternals===void 0)throw Error(le(38));return tu(t,e,r,!1,n)};yr.version="18.3.1-next-f1338f8080-20240426";function ix(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(ix)}catch(t){console.error(t)}}ix(),iy.exports=yr;var mS=iy.exports,ag=mS;Ed.createRoot=ag.createRoot,Ed.hydrateRoot=ag.hydrateRoot;var xh=function(t,e){return xh=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(r,n){r.__proto__=n}||function(r,n){for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(r[i]=n[i])},xh(t,e)};function ox(t,e){if(typeof e!="function"&&e!==null)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");xh(t,e);function r(){this.constructor=t}t.prototype=e===null?Object.create(e):(r.prototype=e.prototype,new r)}var Sc=function(){return Sc=Object.assign||function(e){for(var r,n=1,i=arguments.length;n<i;n++){r=arguments[n];for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(e[o]=r[o])}return e},Sc.apply(this,arguments)};function cs(t,e){var r={};for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&e.indexOf(n)<0&&(r[n]=t[n]);if(t!=null&&typeof Object.getOwnPropertySymbols=="function")for(var i=0,n=Object.getOwnPropertySymbols(t);i<n.length;i++)e.indexOf(n[i])<0&&Object.prototype.propertyIsEnumerable.call(t,n[i])&&(r[n[i]]=t[n[i]]);return r}function sx(t,e,r,n){var i=arguments.length,o=i<3?e:n===null?n=Object.getOwnPropertyDescriptor(e,r):n,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(t,e,r,n);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(o=(i<3?s(o):i>3?s(e,r,o):s(e,r))||o);return i>3&&o&&Object.defineProperty(e,r,o),o}function ax(t,e){return function(r,n){e(r,n,t)}}function lx(t,e,r,n,i,o){function s(v){if(v!==void 0&&typeof v!="function")throw new TypeError("Function expected");return v}for(var a=n.kind,c=a==="getter"?"get":a==="setter"?"set":"value",u=!e&&t?n.static?t:t.prototype:null,d=e||(u?Object.getOwnPropertyDescriptor(u,n.name):{}),h,f=!1,p=r.length-1;p>=0;p--){var g={};for(var m in n)g[m]=m==="access"?{}:n[m];for(var m in n.access)g.access[m]=n.access[m];g.addInitializer=function(v){if(f)throw new TypeError("Cannot add initializers after decoration has completed");o.push(s(v||null))};var b=(0,r[p])(a==="accessor"?{get:d.get,set:d.set}:d[c],g);if(a==="accessor"){if(b===void 0)continue;if(b===null||typeof b!="object")throw new TypeError("Object expected");(h=s(b.get))&&(d.get=h),(h=s(b.set))&&(d.set=h),(h=s(b.init))&&i.unshift(h)}else(h=s(b))&&(a==="field"?i.unshift(h):d[c]=h)}u&&Object.defineProperty(u,n.name,d),f=!0}function cx(t,e,r){for(var n=arguments.length>2,i=0;i<e.length;i++)r=n?e[i].call(t,r):e[i].call(t);return n?r:void 0}function ux(t){return typeof t=="symbol"?t:"".concat(t)}function dx(t,e,r){return typeof e=="symbol"&&(e=e.description?"[".concat(e.description,"]"):""),Object.defineProperty(t,"name",{configurable:!0,value:r?"".concat(r," ",e):e})}function hx(t,e){if(typeof Reflect=="object"&&typeof Reflect.metadata=="function")return Reflect.metadata(t,e)}function Se(t,e,r,n){function i(o){return o instanceof r?o:new r(function(s){s(o)})}return new(r||(r=Promise))(function(o,s){function a(d){try{u(n.next(d))}catch(h){s(h)}}function c(d){try{u(n.throw(d))}catch(h){s(h)}}function u(d){d.done?o(d.value):i(d.value).then(a,c)}u((n=n.apply(t,e||[])).next())})}function fx(t,e){var r={label:0,sent:function(){if(o[0]&1)throw o[1];return o[1]},trys:[],ops:[]},n,i,o,s=Object.create((typeof Iterator=="function"?Iterator:Object).prototype);return s.next=a(0),s.throw=a(1),s.return=a(2),typeof Symbol=="function"&&(s[Symbol.iterator]=function(){return this}),s;function a(u){return function(d){return c([u,d])}}function c(u){if(n)throw new TypeError("Generator is already executing.");for(;s&&(s=0,u[0]&&(r=0)),r;)try{if(n=1,i&&(o=u[0]&2?i.return:u[0]?i.throw||((o=i.return)&&o.call(i),0):i.next)&&!(o=o.call(i,u[1])).done)return o;switch(i=0,o&&(u=[u[0]&2,o.value]),u[0]){case 0:case 1:o=u;break;case 4:return r.label++,{value:u[1],done:!1};case 5:r.label++,i=u[1],u=[0];continue;case 7:u=r.ops.pop(),r.trys.pop();continue;default:if(o=r.trys,!(o=o.length>0&&o[o.length-1])&&(u[0]===6||u[0]===2)){r=0;continue}if(u[0]===3&&(!o||u[1]>o[0]&&u[1]<o[3])){r.label=u[1];break}if(u[0]===6&&r.label<o[1]){r.label=o[1],o=u;break}if(o&&r.label<o[2]){r.label=o[2],r.ops.push(u);break}o[2]&&r.ops.pop(),r.trys.pop();continue}u=e.call(t,r)}catch(d){u=[6,d],i=0}finally{n=o=0}if(u[0]&5)throw u[1];return{value:u[0]?u[1]:void 0,done:!0}}}var ru=Object.create?function(t,e,r,n){n===void 0&&(n=r);var i=Object.getOwnPropertyDescriptor(e,r);(!i||("get"in i?!e.__esModule:i.writable||i.configurable))&&(i={enumerable:!0,get:function(){return e[r]}}),Object.defineProperty(t,n,i)}:function(t,e,r,n){n===void 0&&(n=r),t[n]=e[r]};function px(t,e){for(var r in t)r!=="default"&&!Object.prototype.hasOwnProperty.call(e,r)&&ru(e,t,r)}function kc(t){var e=typeof Symbol=="function"&&Symbol.iterator,r=e&&t[e],n=0;if(r)return r.call(t);if(t&&typeof t.length=="number")return{next:function(){return t&&n>=t.length&&(t=void 0),{value:t&&t[n++],done:!t}}};throw new TypeError(e?"Object is not iterable.":"Symbol.iterator is not defined.")}function Uf(t,e){var r=typeof Symbol=="function"&&t[Symbol.iterator];if(!r)return t;var n=r.call(t),i,o=[],s;try{for(;(e===void 0||e-- >0)&&!(i=n.next()).done;)o.push(i.value)}catch(a){s={error:a}}finally{try{i&&!i.done&&(r=n.return)&&r.call(n)}finally{if(s)throw s.error}}return o}function mx(){for(var t=[],e=0;e<arguments.length;e++)t=t.concat(Uf(arguments[e]));return t}function gx(){for(var t=0,e=0,r=arguments.length;e<r;e++)t+=arguments[e].length;for(var n=Array(t),i=0,e=0;e<r;e++)for(var o=arguments[e],s=0,a=o.length;s<a;s++,i++)n[i]=o[s];return n}function vx(t,e,r){if(r||arguments.length===2)for(var n=0,i=e.length,o;n<i;n++)(o||!(n in e))&&(o||(o=Array.prototype.slice.call(e,0,n)),o[n]=e[n]);return t.concat(o||Array.prototype.slice.call(e))}function os(t){return this instanceof os?(this.v=t,this):new os(t)}function yx(t,e,r){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var n=r.apply(t,e||[]),i,o=[];return i=Object.create((typeof AsyncIterator=="function"?AsyncIterator:Object).prototype),a("next"),a("throw"),a("return",s),i[Symbol.asyncIterator]=function(){return this},i;function s(p){return function(g){return Promise.resolve(g).then(p,h)}}function a(p,g){n[p]&&(i[p]=function(m){return new Promise(function(b,v){o.push([p,m,b,v])>1||c(p,m)})},g&&(i[p]=g(i[p])))}function c(p,g){try{u(n[p](g))}catch(m){f(o[0][3],m)}}function u(p){p.value instanceof os?Promise.resolve(p.value.v).then(d,h):f(o[0][2],p)}function d(p){c("next",p)}function h(p){c("throw",p)}function f(p,g){p(g),o.shift(),o.length&&c(o[0][0],o[0][1])}}function bx(t){var e,r;return e={},n("next"),n("throw",function(i){throw i}),n("return"),e[Symbol.iterator]=function(){return this},e;function n(i,o){e[i]=t[i]?function(s){return(r=!r)?{value:os(t[i](s)),done:!1}:o?o(s):s}:o}}function xx(t){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var e=t[Symbol.asyncIterator],r;return e?e.call(t):(t=typeof kc=="function"?kc(t):t[Symbol.iterator](),r={},n("next"),n("throw"),n("return"),r[Symbol.asyncIterator]=function(){return this},r);function n(o){r[o]=t[o]&&function(s){return new Promise(function(a,c){s=t[o](s),i(a,c,s.done,s.value)})}}function i(o,s,a,c){Promise.resolve(c).then(function(u){o({value:u,done:a})},s)}}function wx(t,e){return Object.defineProperty?Object.defineProperty(t,"raw",{value:e}):t.raw=e,t}var gS=Object.create?function(t,e){Object.defineProperty(t,"default",{enumerable:!0,value:e})}:function(t,e){t.default=e},wh=function(t){return wh=Object.getOwnPropertyNames||function(e){var r=[];for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(r[r.length]=n);return r},wh(t)};function _x(t){if(t&&t.__esModule)return t;var e={};if(t!=null)for(var r=wh(t),n=0;n<r.length;n++)r[n]!=="default"&&ru(e,t,r[n]);return gS(e,t),e}function Sx(t){return t&&t.__esModule?t:{default:t}}function kx(t,e,r,n){if(r==="a"&&!n)throw new TypeError("Private accessor was defined without a getter");if(typeof e=="function"?t!==e||!n:!e.has(t))throw new TypeError("Cannot read private member from an object whose class did not declare it");return r==="m"?n:r==="a"?n.call(t):n?n.value:e.get(t)}function jx(t,e,r,n,i){if(n==="m")throw new TypeError("Private method is not writable");if(n==="a"&&!i)throw new TypeError("Private accessor was defined without a setter");if(typeof e=="function"?t!==e||!i:!e.has(t))throw new TypeError("Cannot write private member to an object whose class did not declare it");return n==="a"?i.call(t,r):i?i.value=r:e.set(t,r),r}function Cx(t,e){if(e===null||typeof e!="object"&&typeof e!="function")throw new TypeError("Cannot use 'in' operator on non-object");return typeof t=="function"?e===t:t.has(e)}function Ex(t,e,r){if(e!=null){if(typeof e!="object"&&typeof e!="function")throw new TypeError("Object expected.");var n,i;if(r){if(!Symbol.asyncDispose)throw new TypeError("Symbol.asyncDispose is not defined.");n=e[Symbol.asyncDispose]}if(n===void 0){if(!Symbol.dispose)throw new TypeError("Symbol.dispose is not defined.");n=e[Symbol.dispose],r&&(i=n)}if(typeof n!="function")throw new TypeError("Object not disposable.");i&&(n=function(){try{i.call(this)}catch(o){return Promise.reject(o)}}),t.stack.push({value:e,dispose:n,async:r})}else r&&t.stack.push({async:!0});return e}var vS=typeof SuppressedError=="function"?SuppressedError:function(t,e,r){var n=new Error(r);return n.name="SuppressedError",n.error=t,n.suppressed=e,n};function Tx(t){function e(o){t.error=t.hasError?new vS(o,t.error,"An error was suppressed during disposal."):o,t.hasError=!0}var r,n=0;function i(){for(;r=t.stack.pop();)try{if(!r.async&&n===1)return n=0,t.stack.push(r),Promise.resolve().then(i);if(r.dispose){var o=r.dispose.call(r.value);if(r.async)return n|=2,Promise.resolve(o).then(i,function(s){return e(s),i()})}else n|=1}catch(s){e(s)}if(n===1)return t.hasError?Promise.reject(t.error):Promise.resolve();if(t.hasError)throw t.error}return i()}function Rx(t,e){return typeof t=="string"&&/^\.\.?\//.test(t)?t.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i,function(r,n,i,o,s){return n?e?".jsx":".js":i&&(!o||!s)?r:i+o+"."+s.toLowerCase()+"js"}):t}const yS={__extends:ox,__assign:Sc,__rest:cs,__decorate:sx,__param:ax,__esDecorate:lx,__runInitializers:cx,__propKey:ux,__setFunctionName:dx,__metadata:hx,__awaiter:Se,__generator:fx,__createBinding:ru,__exportStar:px,__values:kc,__read:Uf,__spread:mx,__spreadArrays:gx,__spreadArray:vx,__await:os,__asyncGenerator:yx,__asyncDelegator:bx,__asyncValues:xx,__makeTemplateObject:wx,__importStar:_x,__importDefault:Sx,__classPrivateFieldGet:kx,__classPrivateFieldSet:jx,__classPrivateFieldIn:Cx,__addDisposableResource:Ex,__disposeResources:Tx,__rewriteRelativeImportExtension:Rx},bS=Object.freeze(Object.defineProperty({__proto__:null,__addDisposableResource:Ex,get __assign(){return Sc},__asyncDelegator:bx,__asyncGenerator:yx,__asyncValues:xx,__await:os,__awaiter:Se,__classPrivateFieldGet:kx,__classPrivateFieldIn:Cx,__classPrivateFieldSet:jx,__createBinding:ru,__decorate:sx,__disposeResources:Tx,__esDecorate:lx,__exportStar:px,__extends:ox,__generator:fx,__importDefault:Sx,__importStar:_x,__makeTemplateObject:wx,__metadata:hx,__param:ax,__propKey:ux,__read:Uf,__rest:cs,__rewriteRelativeImportExtension:Rx,__runInitializers:cx,__setFunctionName:dx,__spread:mx,__spreadArray:vx,__spreadArrays:gx,__values:kc,default:yS},Symbol.toStringTag,{value:"Module"})),xS=t=>t?(...e)=>t(...e):(...e)=>fetch(...e);class Hf extends Error{constructor(e,r="FunctionsError",n){super(e),this.name=r,this.context=n}}class lg extends Hf{constructor(e){super("Failed to send a request to the Edge Function","FunctionsFetchError",e)}}class cg extends Hf{constructor(e){super("Relay Error invoking the Edge Function","FunctionsRelayError",e)}}class ug extends Hf{constructor(e){super("Edge Function returned a non-2xx status code","FunctionsHttpError",e)}}var _h;(function(t){t.Any="any",t.ApNortheast1="ap-northeast-1",t.ApNortheast2="ap-northeast-2",t.ApSouth1="ap-south-1",t.ApSoutheast1="ap-southeast-1",t.ApSoutheast2="ap-southeast-2",t.CaCentral1="ca-central-1",t.EuCentral1="eu-central-1",t.EuWest1="eu-west-1",t.EuWest2="eu-west-2",t.EuWest3="eu-west-3",t.SaEast1="sa-east-1",t.UsEast1="us-east-1",t.UsWest1="us-west-1",t.UsWest2="us-west-2"})(_h||(_h={}));class wS{constructor(e,{headers:r={},customFetch:n,region:i=_h.Any}={}){this.url=e,this.headers=r,this.region=i,this.fetch=xS(n)}setAuth(e){this.headers.Authorization=`Bearer ${e}`}invoke(e){return Se(this,arguments,void 0,function*(r,n={}){var i;try{const{headers:o,method:s,body:a,signal:c}=n;let u={},{region:d}=n;d||(d=this.region);const h=new URL(`${this.url}/${r}`);d&&d!=="any"&&(u["x-region"]=d,h.searchParams.set("forceFunctionRegion",d));let f;a&&(o&&!Object.prototype.hasOwnProperty.call(o,"Content-Type")||!o)?typeof Blob<"u"&&a instanceof Blob||a instanceof ArrayBuffer?(u["Content-Type"]="application/octet-stream",f=a):typeof a=="string"?(u["Content-Type"]="text/plain",f=a):typeof FormData<"u"&&a instanceof FormData?f=a:(u["Content-Type"]="application/json",f=JSON.stringify(a)):f=a;const p=yield this.fetch(h.toString(),{method:s||"POST",headers:Object.assign(Object.assign(Object.assign({},u),this.headers),o),body:f,signal:c}).catch(v=>{throw v.name==="AbortError"?v:new lg(v)}),g=p.headers.get("x-relay-error");if(g&&g==="true")throw new cg(p);if(!p.ok)throw new ug(p);let m=((i=p.headers.get("Content-Type"))!==null&&i!==void 0?i:"text/plain").split(";")[0].trim(),b;return m==="application/json"?b=yield p.json():m==="application/octet-stream"||m==="application/pdf"?b=yield p.blob():m==="text/event-stream"?b=p:m==="multipart/form-data"?b=yield p.formData():b=yield p.text(),{data:b,error:null,response:p}}catch(o){return o instanceof Error&&o.name==="AbortError"?{data:null,error:new lg(o)}:{data:null,error:o,response:o instanceof ug||o instanceof cg?o.context:void 0}}})}}var Yt={};const us=H1(bS);var Sl={},kl={},jl={},Cl={},El={},Tl={},dg;function Nx(){if(dg)return Tl;dg=1,Object.defineProperty(Tl,"__esModule",{value:!0});class t extends Error{constructor(r){super(r.message),this.name="PostgrestError",this.details=r.details,this.hint=r.hint,this.code=r.code}}return Tl.default=t,Tl}var hg;function Px(){if(hg)return El;hg=1,Object.defineProperty(El,"__esModule",{value:!0});const e=us.__importDefault(Nx());class r{constructor(i){var o,s;this.shouldThrowOnError=!1,this.method=i.method,this.url=i.url,this.headers=new Headers(i.headers),this.schema=i.schema,this.body=i.body,this.shouldThrowOnError=(o=i.shouldThrowOnError)!==null&&o!==void 0?o:!1,this.signal=i.signal,this.isMaybeSingle=(s=i.isMaybeSingle)!==null&&s!==void 0?s:!1,i.fetch?this.fetch=i.fetch:this.fetch=fetch}throwOnError(){return this.shouldThrowOnError=!0,this}setHeader(i,o){return this.headers=new Headers(this.headers),this.headers.set(i,o),this}then(i,o){this.schema===void 0||(["GET","HEAD"].includes(this.method)?this.headers.set("Accept-Profile",this.schema):this.headers.set("Content-Profile",this.schema)),this.method!=="GET"&&this.method!=="HEAD"&&this.headers.set("Content-Type","application/json");const s=this.fetch;let a=s(this.url.toString(),{method:this.method,headers:this.headers,body:JSON.stringify(this.body),signal:this.signal}).then(async c=>{var u,d,h,f;let p=null,g=null,m=null,b=c.status,v=c.statusText;if(c.ok){if(this.method!=="HEAD"){const j=await c.text();j===""||(this.headers.get("Accept")==="text/csv"||this.headers.get("Accept")&&(!((u=this.headers.get("Accept"))===null||u===void 0)&&u.includes("application/vnd.pgrst.plan+text"))?g=j:g=JSON.parse(j))}const x=(d=this.headers.get("Prefer"))===null||d===void 0?void 0:d.match(/count=(exact|planned|estimated)/),S=(h=c.headers.get("content-range"))===null||h===void 0?void 0:h.split("/");x&&S&&S.length>1&&(m=parseInt(S[1])),this.isMaybeSingle&&this.method==="GET"&&Array.isArray(g)&&(g.length>1?(p={code:"PGRST116",details:`Results contain ${g.length} rows, application/vnd.pgrst.object+json requires 1 row`,hint:null,message:"JSON object requested, multiple (or no) rows returned"},g=null,m=null,b=406,v="Not Acceptable"):g.length===1?g=g[0]:g=null)}else{const x=await c.text();try{p=JSON.parse(x),Array.isArray(p)&&c.status===404&&(g=[],p=null,b=200,v="OK")}catch{c.status===404&&x===""?(b=204,v="No Content"):p={message:x}}if(p&&this.isMaybeSingle&&(!((f=p==null?void 0:p.details)===null||f===void 0)&&f.includes("0 rows"))&&(p=null,b=200,v="OK"),p&&this.shouldThrowOnError)throw new e.default(p)}return{error:p,data:g,count:m,status:b,statusText:v}});return this.shouldThrowOnError||(a=a.catch(c=>{var u,d,h;return{error:{message:`${(u=c==null?void 0:c.name)!==null&&u!==void 0?u:"FetchError"}: ${c==null?void 0:c.message}`,details:`${(d=c==null?void 0:c.stack)!==null&&d!==void 0?d:""}`,hint:"",code:`${(h=c==null?void 0:c.code)!==null&&h!==void 0?h:""}`},data:null,count:null,status:0,statusText:""}})),a.then(i,o)}returns(){return this}overrideTypes(){return this}}return El.default=r,El}var fg;function Ox(){if(fg)return Cl;fg=1,Object.defineProperty(Cl,"__esModule",{value:!0});const e=us.__importDefault(Px());class r extends e.default{select(i){let o=!1;const s=(i??"*").split("").map(a=>/\s/.test(a)&&!o?"":(a==='"'&&(o=!o),a)).join("");return this.url.searchParams.set("select",s),this.headers.append("Prefer","return=representation"),this}order(i,{ascending:o=!0,nullsFirst:s,foreignTable:a,referencedTable:c=a}={}){const u=c?`${c}.order`:"order",d=this.url.searchParams.get(u);return this.url.searchParams.set(u,`${d?`${d},`:""}${i}.${o?"asc":"desc"}${s===void 0?"":s?".nullsfirst":".nullslast"}`),this}limit(i,{foreignTable:o,referencedTable:s=o}={}){const a=typeof s>"u"?"limit":`${s}.limit`;return this.url.searchParams.set(a,`${i}`),this}range(i,o,{foreignTable:s,referencedTable:a=s}={}){const c=typeof a>"u"?"offset":`${a}.offset`,u=typeof a>"u"?"limit":`${a}.limit`;return this.url.searchParams.set(c,`${i}`),this.url.searchParams.set(u,`${o-i+1}`),this}abortSignal(i){return this.signal=i,this}single(){return this.headers.set("Accept","application/vnd.pgrst.object+json"),this}maybeSingle(){return this.method==="GET"?this.headers.set("Accept","application/json"):this.headers.set("Accept","application/vnd.pgrst.object+json"),this.isMaybeSingle=!0,this}csv(){return this.headers.set("Accept","text/csv"),this}geojson(){return this.headers.set("Accept","application/geo+json"),this}explain({analyze:i=!1,verbose:o=!1,settings:s=!1,buffers:a=!1,wal:c=!1,format:u="text"}={}){var d;const h=[i?"analyze":null,o?"verbose":null,s?"settings":null,a?"buffers":null,c?"wal":null].filter(Boolean).join("|"),f=(d=this.headers.get("Accept"))!==null&&d!==void 0?d:"application/json";return this.headers.set("Accept",`application/vnd.pgrst.plan+${u}; for="${f}"; options=${h};`),u==="json"?this:this}rollback(){return this.headers.append("Prefer","tx=rollback"),this}returns(){return this}maxAffected(i){return this.headers.append("Prefer","handling=strict"),this.headers.append("Prefer",`max-affected=${i}`),this}}return Cl.default=r,Cl}var pg;function Wf(){if(pg)return jl;pg=1,Object.defineProperty(jl,"__esModule",{value:!0});const e=us.__importDefault(Ox()),r=new RegExp("[,()]");class n extends e.default{eq(o,s){return this.url.searchParams.append(o,`eq.${s}`),this}neq(o,s){return this.url.searchParams.append(o,`neq.${s}`),this}gt(o,s){return this.url.searchParams.append(o,`gt.${s}`),this}gte(o,s){return this.url.searchParams.append(o,`gte.${s}`),this}lt(o,s){return this.url.searchParams.append(o,`lt.${s}`),this}lte(o,s){return this.url.searchParams.append(o,`lte.${s}`),this}like(o,s){return this.url.searchParams.append(o,`like.${s}`),this}likeAllOf(o,s){return this.url.searchParams.append(o,`like(all).{${s.join(",")}}`),this}likeAnyOf(o,s){return this.url.searchParams.append(o,`like(any).{${s.join(",")}}`),this}ilike(o,s){return this.url.searchParams.append(o,`ilike.${s}`),this}ilikeAllOf(o,s){return this.url.searchParams.append(o,`ilike(all).{${s.join(",")}}`),this}ilikeAnyOf(o,s){return this.url.searchParams.append(o,`ilike(any).{${s.join(",")}}`),this}is(o,s){return this.url.searchParams.append(o,`is.${s}`),this}in(o,s){const a=Array.from(new Set(s)).map(c=>typeof c=="string"&&r.test(c)?`"${c}"`:`${c}`).join(",");return this.url.searchParams.append(o,`in.(${a})`),this}contains(o,s){return typeof s=="string"?this.url.searchParams.append(o,`cs.${s}`):Array.isArray(s)?this.url.searchParams.append(o,`cs.{${s.join(",")}}`):this.url.searchParams.append(o,`cs.${JSON.stringify(s)}`),this}containedBy(o,s){return typeof s=="string"?this.url.searchParams.append(o,`cd.${s}`):Array.isArray(s)?this.url.searchParams.append(o,`cd.{${s.join(",")}}`):this.url.searchParams.append(o,`cd.${JSON.stringify(s)}`),this}rangeGt(o,s){return this.url.searchParams.append(o,`sr.${s}`),this}rangeGte(o,s){return this.url.searchParams.append(o,`nxl.${s}`),this}rangeLt(o,s){return this.url.searchParams.append(o,`sl.${s}`),this}rangeLte(o,s){return this.url.searchParams.append(o,`nxr.${s}`),this}rangeAdjacent(o,s){return this.url.searchParams.append(o,`adj.${s}`),this}overlaps(o,s){return typeof s=="string"?this.url.searchParams.append(o,`ov.${s}`):this.url.searchParams.append(o,`ov.{${s.join(",")}}`),this}textSearch(o,s,{config:a,type:c}={}){let u="";c==="plain"?u="pl":c==="phrase"?u="ph":c==="websearch"&&(u="w");const d=a===void 0?"":`(${a})`;return this.url.searchParams.append(o,`${u}fts${d}.${s}`),this}match(o){return Object.entries(o).forEach(([s,a])=>{this.url.searchParams.append(s,`eq.${a}`)}),this}not(o,s,a){return this.url.searchParams.append(o,`not.${s}.${a}`),this}or(o,{foreignTable:s,referencedTable:a=s}={}){const c=a?`${a}.or`:"or";return this.url.searchParams.append(c,`(${o})`),this}filter(o,s,a){return this.url.searchParams.append(o,`${s}.${a}`),this}}return jl.default=n,jl}var mg;function Ax(){if(mg)return kl;mg=1,Object.defineProperty(kl,"__esModule",{value:!0});const e=us.__importDefault(Wf());class r{constructor(i,{headers:o={},schema:s,fetch:a}){this.url=i,this.headers=new Headers(o),this.schema=s,this.fetch=a}select(i,o){const{head:s=!1,count:a}=o??{},c=s?"HEAD":"GET";let u=!1;const d=(i??"*").split("").map(h=>/\s/.test(h)&&!u?"":(h==='"'&&(u=!u),h)).join("");return this.url.searchParams.set("select",d),a&&this.headers.append("Prefer",`count=${a}`),new e.default({method:c,url:this.url,headers:this.headers,schema:this.schema,fetch:this.fetch})}insert(i,{count:o,defaultToNull:s=!0}={}){var a;const c="POST";if(o&&this.headers.append("Prefer",`count=${o}`),s||this.headers.append("Prefer","missing=default"),Array.isArray(i)){const u=i.reduce((d,h)=>d.concat(Object.keys(h)),[]);if(u.length>0){const d=[...new Set(u)].map(h=>`"${h}"`);this.url.searchParams.set("columns",d.join(","))}}return new e.default({method:c,url:this.url,headers:this.headers,schema:this.schema,body:i,fetch:(a=this.fetch)!==null&&a!==void 0?a:fetch})}upsert(i,{onConflict:o,ignoreDuplicates:s=!1,count:a,defaultToNull:c=!0}={}){var u;const d="POST";if(this.headers.append("Prefer",`resolution=${s?"ignore":"merge"}-duplicates`),o!==void 0&&this.url.searchParams.set("on_conflict",o),a&&this.headers.append("Prefer",`count=${a}`),c||this.headers.append("Prefer","missing=default"),Array.isArray(i)){const h=i.reduce((f,p)=>f.concat(Object.keys(p)),[]);if(h.length>0){const f=[...new Set(h)].map(p=>`"${p}"`);this.url.searchParams.set("columns",f.join(","))}}return new e.default({method:d,url:this.url,headers:this.headers,schema:this.schema,body:i,fetch:(u=this.fetch)!==null&&u!==void 0?u:fetch})}update(i,{count:o}={}){var s;const a="PATCH";return o&&this.headers.append("Prefer",`count=${o}`),new e.default({method:a,url:this.url,headers:this.headers,schema:this.schema,body:i,fetch:(s=this.fetch)!==null&&s!==void 0?s:fetch})}delete({count:i}={}){var o;const s="DELETE";return i&&this.headers.append("Prefer",`count=${i}`),new e.default({method:s,url:this.url,headers:this.headers,schema:this.schema,fetch:(o=this.fetch)!==null&&o!==void 0?o:fetch})}}return kl.default=r,kl}var gg;function _S(){if(gg)return Sl;gg=1,Object.defineProperty(Sl,"__esModule",{value:!0});const t=us,e=t.__importDefault(Ax()),r=t.__importDefault(Wf());class n{constructor(o,{headers:s={},schema:a,fetch:c}={}){this.url=o,this.headers=new Headers(s),this.schemaName=a,this.fetch=c}from(o){const s=new URL(`${this.url}/${o}`);return new e.default(s,{headers:new Headers(this.headers),schema:this.schemaName,fetch:this.fetch})}schema(o){return new n(this.url,{headers:this.headers,schema:o,fetch:this.fetch})}rpc(o,s={},{head:a=!1,get:c=!1,count:u}={}){var d;let h;const f=new URL(`${this.url}/rpc/${o}`);let p;a||c?(h=a?"HEAD":"GET",Object.entries(s).filter(([m,b])=>b!==void 0).map(([m,b])=>[m,Array.isArray(b)?`{${b.join(",")}}`:`${b}`]).forEach(([m,b])=>{f.searchParams.append(m,b)})):(h="POST",p=s);const g=new Headers(this.headers);return u&&g.set("Prefer",`count=${u}`),new r.default({method:h,url:f,headers:g,schema:this.schemaName,body:p,fetch:(d=this.fetch)!==null&&d!==void 0?d:fetch})}}return Sl.default=n,Sl}Object.defineProperty(Yt,"__esModule",{value:!0});var $x=Yt.PostgrestError=Wx=Yt.PostgrestBuilder=Ux=Yt.PostgrestTransformBuilder=Fx=Yt.PostgrestFilterBuilder=Dx=Yt.PostgrestQueryBuilder=Mx=Yt.PostgrestClient=void 0;const ds=us,Ix=ds.__importDefault(_S());var Mx=Yt.PostgrestClient=Ix.default;const Lx=ds.__importDefault(Ax());var Dx=Yt.PostgrestQueryBuilder=Lx.default;const zx=ds.__importDefault(Wf());var Fx=Yt.PostgrestFilterBuilder=zx.default;const Bx=ds.__importDefault(Ox());var Ux=Yt.PostgrestTransformBuilder=Bx.default;const Hx=ds.__importDefault(Px());var Wx=Yt.PostgrestBuilder=Hx.default;const Gx=ds.__importDefault(Nx());$x=Yt.PostgrestError=Gx.default;var Vx=Yt.default={PostgrestClient:Ix.default,PostgrestQueryBuilder:Lx.default,PostgrestFilterBuilder:zx.default,PostgrestTransformBuilder:Bx.default,PostgrestBuilder:Hx.default,PostgrestError:Gx.default};const SS=U1({__proto__:null,get PostgrestBuilder(){return Wx},get PostgrestClient(){return Mx},get PostgrestError(){return $x},get PostgrestFilterBuilder(){return Fx},get PostgrestQueryBuilder(){return Dx},get PostgrestTransformBuilder(){return Ux},default:Vx},[Yt]),{PostgrestClient:kS,PostgrestQueryBuilder:$U,PostgrestFilterBuilder:IU,PostgrestTransformBuilder:MU,PostgrestBuilder:LU,PostgrestError:DU}=Vx||SS;class jS{static detectEnvironment(){var e;if(typeof WebSocket<"u")return{type:"native",constructor:WebSocket};if(typeof globalThis<"u"&&typeof globalThis.WebSocket<"u")return{type:"native",constructor:globalThis.WebSocket};if(typeof global<"u"&&typeof global.WebSocket<"u")return{type:"native",constructor:global.WebSocket};if(typeof globalThis<"u"&&typeof globalThis.WebSocketPair<"u"&&typeof globalThis.WebSocket>"u")return{type:"cloudflare",error:"Cloudflare Workers detected. WebSocket clients are not supported in Cloudflare Workers.",workaround:"Use Cloudflare Workers WebSocket API for server-side WebSocket handling, or deploy to a different runtime."};if(typeof globalThis<"u"&&globalThis.EdgeRuntime||typeof navigator<"u"&&(!((e=navigator.userAgent)===null||e===void 0)&&e.includes("Vercel-Edge")))return{type:"unsupported",error:"Edge runtime detected (Vercel Edge/Netlify Edge). WebSockets are not supported in edge functions.",workaround:"Use serverless functions or a different deployment target for WebSocket functionality."};if(typeof process<"u"){const r=process.versions;if(r&&r.node){const n=r.node,i=parseInt(n.replace(/^v/,"").split(".")[0]);return i>=22?typeof globalThis.WebSocket<"u"?{type:"native",constructor:globalThis.WebSocket}:{type:"unsupported",error:`Node.js ${i} detected but native WebSocket not found.`,workaround:"Provide a WebSocket implementation via the transport option."}:{type:"unsupported",error:`Node.js ${i} detected without native WebSocket support.`,workaround:`For Node.js < 22, install "ws" package and provide it via the transport option:
import ws from "ws"
new RealtimeClient(url, { transport: ws })`}}}return{type:"unsupported",error:"Unknown JavaScript runtime without WebSocket support.",workaround:"Ensure you're running in a supported environment (browser, Node.js, Deno) or provide a custom WebSocket implementation."}}static getWebSocketConstructor(){const e=this.detectEnvironment();if(e.constructor)return e.constructor;let r=e.error||"WebSocket not supported in this environment.";throw e.workaround&&(r+=`

Suggested solution: ${e.workaround}`),new Error(r)}static createWebSocket(e,r){const n=this.getWebSocketConstructor();return new n(e,r)}static isWebSocketSupported(){try{const e=this.detectEnvironment();return e.type==="native"||e.type==="ws"}catch{return!1}}}const CS="2.79.0",ES=`realtime-js/${CS}`,TS="1.0.0",Sh=1e4,RS=1e3,NS=100;var da;(function(t){t[t.connecting=0]="connecting",t[t.open=1]="open",t[t.closing=2]="closing",t[t.closed=3]="closed"})(da||(da={}));var Et;(function(t){t.closed="closed",t.errored="errored",t.joined="joined",t.joining="joining",t.leaving="leaving"})(Et||(Et={}));var Lr;(function(t){t.close="phx_close",t.error="phx_error",t.join="phx_join",t.reply="phx_reply",t.leave="phx_leave",t.access_token="access_token"})(Lr||(Lr={}));var kh;(function(t){t.websocket="websocket"})(kh||(kh={}));var Ci;(function(t){t.Connecting="connecting",t.Open="open",t.Closing="closing",t.Closed="closed"})(Ci||(Ci={}));class PS{constructor(){this.HEADER_LENGTH=1}decode(e,r){return e.constructor===ArrayBuffer?r(this._binaryDecode(e)):r(typeof e=="string"?JSON.parse(e):{})}_binaryDecode(e){const r=new DataView(e),n=new TextDecoder;return this._decodeBroadcast(e,r,n)}_decodeBroadcast(e,r,n){const i=r.getUint8(1),o=r.getUint8(2);let s=this.HEADER_LENGTH+2;const a=n.decode(e.slice(s,s+i));s=s+i;const c=n.decode(e.slice(s,s+o));s=s+o;const u=JSON.parse(n.decode(e.slice(s,e.byteLength)));return{ref:null,topic:a,event:c,payload:u}}}class qx{constructor(e,r){this.callback=e,this.timerCalc=r,this.timer=void 0,this.tries=0,this.callback=e,this.timerCalc=r}reset(){this.tries=0,clearTimeout(this.timer),this.timer=void 0}scheduleTimeout(){clearTimeout(this.timer),this.timer=setTimeout(()=>{this.tries=this.tries+1,this.callback()},this.timerCalc(this.tries+1))}}var rt;(function(t){t.abstime="abstime",t.bool="bool",t.date="date",t.daterange="daterange",t.float4="float4",t.float8="float8",t.int2="int2",t.int4="int4",t.int4range="int4range",t.int8="int8",t.int8range="int8range",t.json="json",t.jsonb="jsonb",t.money="money",t.numeric="numeric",t.oid="oid",t.reltime="reltime",t.text="text",t.time="time",t.timestamp="timestamp",t.timestamptz="timestamptz",t.timetz="timetz",t.tsrange="tsrange",t.tstzrange="tstzrange"})(rt||(rt={}));const vg=(t,e,r={})=>{var n;const i=(n=r.skipTypes)!==null&&n!==void 0?n:[];return e?Object.keys(e).reduce((o,s)=>(o[s]=OS(s,t,e,i),o),{}):{}},OS=(t,e,r,n)=>{const i=e.find(a=>a.name===t),o=i==null?void 0:i.type,s=r[t];return o&&!n.includes(o)?Kx(o,s):jh(s)},Kx=(t,e)=>{if(t.charAt(0)==="_"){const r=t.slice(1,t.length);return MS(e,r)}switch(t){case rt.bool:return AS(e);case rt.float4:case rt.float8:case rt.int2:case rt.int4:case rt.int8:case rt.numeric:case rt.oid:return $S(e);case rt.json:case rt.jsonb:return IS(e);case rt.timestamp:return LS(e);case rt.abstime:case rt.date:case rt.daterange:case rt.int4range:case rt.int8range:case rt.money:case rt.reltime:case rt.text:case rt.time:case rt.timestamptz:case rt.timetz:case rt.tsrange:case rt.tstzrange:return jh(e);default:return jh(e)}},jh=t=>t,AS=t=>{switch(t){case"t":return!0;case"f":return!1;default:return t}},$S=t=>{if(typeof t=="string"){const e=parseFloat(t);if(!Number.isNaN(e))return e}return t},IS=t=>{if(typeof t=="string")try{return JSON.parse(t)}catch(e){return console.log(`JSON parse error: ${e}`),t}return t},MS=(t,e)=>{if(typeof t!="string")return t;const r=t.length-1,n=t[r];if(t[0]==="{"&&n==="}"){let o;const s=t.slice(1,r);try{o=JSON.parse("["+s+"]")}catch{o=s?s.split(","):[]}return o.map(a=>Kx(e,a))}return t},LS=t=>typeof t=="string"?t.replace(" ","T"):t,Yx=t=>{const e=new URL(t);return e.protocol=e.protocol.replace(/^ws/i,"http"),e.pathname=e.pathname.replace(/\/+$/,"").replace(/\/socket\/websocket$/i,"").replace(/\/socket$/i,"").replace(/\/websocket$/i,""),e.pathname===""||e.pathname==="/"?e.pathname="/api/broadcast":e.pathname=e.pathname+"/api/broadcast",e.href};class Ju{constructor(e,r,n={},i=Sh){this.channel=e,this.event=r,this.payload=n,this.timeout=i,this.sent=!1,this.timeoutTimer=void 0,this.ref="",this.receivedResp=null,this.recHooks=[],this.refEvent=null}resend(e){this.timeout=e,this._cancelRefEvent(),this.ref="",this.refEvent=null,this.receivedResp=null,this.sent=!1,this.send()}send(){this._hasReceived("timeout")||(this.startTimeout(),this.sent=!0,this.channel.socket.push({topic:this.channel.topic,event:this.event,payload:this.payload,ref:this.ref,join_ref:this.channel._joinRef()}))}updatePayload(e){this.payload=Object.assign(Object.assign({},this.payload),e)}receive(e,r){var n;return this._hasReceived(e)&&r((n=this.receivedResp)===null||n===void 0?void 0:n.response),this.recHooks.push({status:e,callback:r}),this}startTimeout(){if(this.timeoutTimer)return;this.ref=this.channel.socket._makeRef(),this.refEvent=this.channel._replyEventName(this.ref);const e=r=>{this._cancelRefEvent(),this._cancelTimeout(),this.receivedResp=r,this._matchReceive(r)};this.channel._on(this.refEvent,{},e),this.timeoutTimer=setTimeout(()=>{this.trigger("timeout",{})},this.timeout)}trigger(e,r){this.refEvent&&this.channel._trigger(this.refEvent,{status:e,response:r})}destroy(){this._cancelRefEvent(),this._cancelTimeout()}_cancelRefEvent(){this.refEvent&&this.channel._off(this.refEvent,{})}_cancelTimeout(){clearTimeout(this.timeoutTimer),this.timeoutTimer=void 0}_matchReceive({status:e,response:r}){this.recHooks.filter(n=>n.status===e).forEach(n=>n.callback(r))}_hasReceived(e){return this.receivedResp&&this.receivedResp.status===e}}var yg;(function(t){t.SYNC="sync",t.JOIN="join",t.LEAVE="leave"})(yg||(yg={}));class ha{constructor(e,r){this.channel=e,this.state={},this.pendingDiffs=[],this.joinRef=null,this.enabled=!1,this.caller={onJoin:()=>{},onLeave:()=>{},onSync:()=>{}};const n=(r==null?void 0:r.events)||{state:"presence_state",diff:"presence_diff"};this.channel._on(n.state,{},i=>{const{onJoin:o,onLeave:s,onSync:a}=this.caller;this.joinRef=this.channel._joinRef(),this.state=ha.syncState(this.state,i,o,s),this.pendingDiffs.forEach(c=>{this.state=ha.syncDiff(this.state,c,o,s)}),this.pendingDiffs=[],a()}),this.channel._on(n.diff,{},i=>{const{onJoin:o,onLeave:s,onSync:a}=this.caller;this.inPendingSyncState()?this.pendingDiffs.push(i):(this.state=ha.syncDiff(this.state,i,o,s),a())}),this.onJoin((i,o,s)=>{this.channel._trigger("presence",{event:"join",key:i,currentPresences:o,newPresences:s})}),this.onLeave((i,o,s)=>{this.channel._trigger("presence",{event:"leave",key:i,currentPresences:o,leftPresences:s})}),this.onSync(()=>{this.channel._trigger("presence",{event:"sync"})})}static syncState(e,r,n,i){const o=this.cloneDeep(e),s=this.transformState(r),a={},c={};return this.map(o,(u,d)=>{s[u]||(c[u]=d)}),this.map(s,(u,d)=>{const h=o[u];if(h){const f=d.map(b=>b.presence_ref),p=h.map(b=>b.presence_ref),g=d.filter(b=>p.indexOf(b.presence_ref)<0),m=h.filter(b=>f.indexOf(b.presence_ref)<0);g.length>0&&(a[u]=g),m.length>0&&(c[u]=m)}else a[u]=d}),this.syncDiff(o,{joins:a,leaves:c},n,i)}static syncDiff(e,r,n,i){const{joins:o,leaves:s}={joins:this.transformState(r.joins),leaves:this.transformState(r.leaves)};return n||(n=()=>{}),i||(i=()=>{}),this.map(o,(a,c)=>{var u;const d=(u=e[a])!==null&&u!==void 0?u:[];if(e[a]=this.cloneDeep(c),d.length>0){const h=e[a].map(p=>p.presence_ref),f=d.filter(p=>h.indexOf(p.presence_ref)<0);e[a].unshift(...f)}n(a,d,c)}),this.map(s,(a,c)=>{let u=e[a];if(!u)return;const d=c.map(h=>h.presence_ref);u=u.filter(h=>d.indexOf(h.presence_ref)<0),e[a]=u,i(a,u,c),u.length===0&&delete e[a]}),e}static map(e,r){return Object.getOwnPropertyNames(e).map(n=>r(n,e[n]))}static transformState(e){return e=this.cloneDeep(e),Object.getOwnPropertyNames(e).reduce((r,n)=>{const i=e[n];return"metas"in i?r[n]=i.metas.map(o=>(o.presence_ref=o.phx_ref,delete o.phx_ref,delete o.phx_ref_prev,o)):r[n]=i,r},{})}static cloneDeep(e){return JSON.parse(JSON.stringify(e))}onJoin(e){this.caller.onJoin=e}onLeave(e){this.caller.onLeave=e}onSync(e){this.caller.onSync=e}inPendingSyncState(){return!this.joinRef||this.joinRef!==this.channel._joinRef()}}var bg;(function(t){t.ALL="*",t.INSERT="INSERT",t.UPDATE="UPDATE",t.DELETE="DELETE"})(bg||(bg={}));var fa;(function(t){t.BROADCAST="broadcast",t.PRESENCE="presence",t.POSTGRES_CHANGES="postgres_changes",t.SYSTEM="system"})(fa||(fa={}));var fn;(function(t){t.SUBSCRIBED="SUBSCRIBED",t.TIMED_OUT="TIMED_OUT",t.CLOSED="CLOSED",t.CHANNEL_ERROR="CHANNEL_ERROR"})(fn||(fn={}));class Gf{constructor(e,r={config:{}},n){var i,o;if(this.topic=e,this.params=r,this.socket=n,this.bindings={},this.state=Et.closed,this.joinedOnce=!1,this.pushBuffer=[],this.subTopic=e.replace(/^realtime:/i,""),this.params.config=Object.assign({broadcast:{ack:!1,self:!1},presence:{key:"",enabled:!1},private:!1},r.config),this.timeout=this.socket.timeout,this.joinPush=new Ju(this,Lr.join,this.params,this.timeout),this.rejoinTimer=new qx(()=>this._rejoinUntilConnected(),this.socket.reconnectAfterMs),this.joinPush.receive("ok",()=>{this.state=Et.joined,this.rejoinTimer.reset(),this.pushBuffer.forEach(s=>s.send()),this.pushBuffer=[]}),this._onClose(()=>{this.rejoinTimer.reset(),this.socket.log("channel",`close ${this.topic} ${this._joinRef()}`),this.state=Et.closed,this.socket._remove(this)}),this._onError(s=>{this._isLeaving()||this._isClosed()||(this.socket.log("channel",`error ${this.topic}`,s),this.state=Et.errored,this.rejoinTimer.scheduleTimeout())}),this.joinPush.receive("timeout",()=>{this._isJoining()&&(this.socket.log("channel",`timeout ${this.topic}`,this.joinPush.timeout),this.state=Et.errored,this.rejoinTimer.scheduleTimeout())}),this.joinPush.receive("error",s=>{this._isLeaving()||this._isClosed()||(this.socket.log("channel",`error ${this.topic}`,s),this.state=Et.errored,this.rejoinTimer.scheduleTimeout())}),this._on(Lr.reply,{},(s,a)=>{this._trigger(this._replyEventName(a),s)}),this.presence=new ha(this),this.broadcastEndpointURL=Yx(this.socket.endPoint),this.private=this.params.config.private||!1,!this.private&&(!((o=(i=this.params.config)===null||i===void 0?void 0:i.broadcast)===null||o===void 0)&&o.replay))throw`tried to use replay on public channel '${this.topic}'. It must be a private channel.`}subscribe(e,r=this.timeout){var n,i,o;if(this.socket.isConnected()||this.socket.connect(),this.state==Et.closed){const{config:{broadcast:s,presence:a,private:c}}=this.params,u=(i=(n=this.bindings.postgres_changes)===null||n===void 0?void 0:n.map(p=>p.filter))!==null&&i!==void 0?i:[],d=!!this.bindings[fa.PRESENCE]&&this.bindings[fa.PRESENCE].length>0||((o=this.params.config.presence)===null||o===void 0?void 0:o.enabled)===!0,h={},f={broadcast:s,presence:Object.assign(Object.assign({},a),{enabled:d}),postgres_changes:u,private:c};this.socket.accessTokenValue&&(h.access_token=this.socket.accessTokenValue),this._onError(p=>e==null?void 0:e(fn.CHANNEL_ERROR,p)),this._onClose(()=>e==null?void 0:e(fn.CLOSED)),this.updateJoinPayload(Object.assign({config:f},h)),this.joinedOnce=!0,this._rejoin(r),this.joinPush.receive("ok",async({postgres_changes:p})=>{var g;if(this.socket.setAuth(),p===void 0){e==null||e(fn.SUBSCRIBED);return}else{const m=this.bindings.postgres_changes,b=(g=m==null?void 0:m.length)!==null&&g!==void 0?g:0,v=[];for(let y=0;y<b;y++){const x=m[y],{filter:{event:S,schema:j,table:_,filter:C}}=x,R=p&&p[y];if(R&&R.event===S&&R.schema===j&&R.table===_&&R.filter===C)v.push(Object.assign(Object.assign({},x),{id:R.id}));else{this.unsubscribe(),this.state=Et.errored,e==null||e(fn.CHANNEL_ERROR,new Error("mismatch between server and client bindings for postgres changes"));return}}this.bindings.postgres_changes=v,e&&e(fn.SUBSCRIBED);return}}).receive("error",p=>{this.state=Et.errored,e==null||e(fn.CHANNEL_ERROR,new Error(JSON.stringify(Object.values(p).join(", ")||"error")))}).receive("timeout",()=>{e==null||e(fn.TIMED_OUT)})}return this}presenceState(){return this.presence.state}async track(e,r={}){return await this.send({type:"presence",event:"track",payload:e},r.timeout||this.timeout)}async untrack(e={}){return await this.send({type:"presence",event:"untrack"},e)}on(e,r,n){return this.state===Et.joined&&e===fa.PRESENCE&&(this.socket.log("channel",`resubscribe to ${this.topic} due to change in presence callbacks on joined channel`),this.unsubscribe().then(()=>this.subscribe())),this._on(e,r,n)}async httpSend(e,r,n={}){var i;const o=this.socket.accessTokenValue?`Bearer ${this.socket.accessTokenValue}`:"";if(r==null)return Promise.reject("Payload is required for httpSend()");const s={method:"POST",headers:{Authorization:o,apikey:this.socket.apiKey?this.socket.apiKey:"","Content-Type":"application/json"},body:JSON.stringify({messages:[{topic:this.subTopic,event:e,payload:r,private:this.private}]})},a=await this._fetchWithTimeout(this.broadcastEndpointURL,s,(i=n.timeout)!==null&&i!==void 0?i:this.timeout);if(a.status===202)return{success:!0};let c=a.statusText;try{const u=await a.json();c=u.error||u.message||c}catch{}return Promise.reject(new Error(c))}async send(e,r={}){var n,i;if(!this._canPush()&&e.type==="broadcast"){console.warn("Realtime send() is automatically falling back to REST API. This behavior will be deprecated in the future. Please use httpSend() explicitly for REST delivery.");const{event:o,payload:s}=e,c={method:"POST",headers:{Authorization:this.socket.accessTokenValue?`Bearer ${this.socket.accessTokenValue}`:"",apikey:this.socket.apiKey?this.socket.apiKey:"","Content-Type":"application/json"},body:JSON.stringify({messages:[{topic:this.subTopic,event:o,payload:s,private:this.private}]})};try{const u=await this._fetchWithTimeout(this.broadcastEndpointURL,c,(n=r.timeout)!==null&&n!==void 0?n:this.timeout);return await((i=u.body)===null||i===void 0?void 0:i.cancel()),u.ok?"ok":"error"}catch(u){return u.name==="AbortError"?"timed out":"error"}}else return new Promise(o=>{var s,a,c;const u=this._push(e.type,e,r.timeout||this.timeout);e.type==="broadcast"&&!(!((c=(a=(s=this.params)===null||s===void 0?void 0:s.config)===null||a===void 0?void 0:a.broadcast)===null||c===void 0)&&c.ack)&&o("ok"),u.receive("ok",()=>o("ok")),u.receive("error",()=>o("error")),u.receive("timeout",()=>o("timed out"))})}updateJoinPayload(e){this.joinPush.updatePayload(e)}unsubscribe(e=this.timeout){this.state=Et.leaving;const r=()=>{this.socket.log("channel",`leave ${this.topic}`),this._trigger(Lr.close,"leave",this._joinRef())};this.joinPush.destroy();let n=null;return new Promise(i=>{n=new Ju(this,Lr.leave,{},e),n.receive("ok",()=>{r(),i("ok")}).receive("timeout",()=>{r(),i("timed out")}).receive("error",()=>{i("error")}),n.send(),this._canPush()||n.trigger("ok",{})}).finally(()=>{n==null||n.destroy()})}teardown(){this.pushBuffer.forEach(e=>e.destroy()),this.pushBuffer=[],this.rejoinTimer.reset(),this.joinPush.destroy(),this.state=Et.closed,this.bindings={}}async _fetchWithTimeout(e,r,n){const i=new AbortController,o=setTimeout(()=>i.abort(),n),s=await this.socket.fetch(e,Object.assign(Object.assign({},r),{signal:i.signal}));return clearTimeout(o),s}_push(e,r,n=this.timeout){if(!this.joinedOnce)throw`tried to push '${e}' to '${this.topic}' before joining. Use channel.subscribe() before pushing events`;let i=new Ju(this,e,r,n);return this._canPush()?i.send():this._addToPushBuffer(i),i}_addToPushBuffer(e){if(e.startTimeout(),this.pushBuffer.push(e),this.pushBuffer.length>NS){const r=this.pushBuffer.shift();r&&(r.destroy(),this.socket.log("channel",`discarded push due to buffer overflow: ${r.event}`,r.payload))}}_onMessage(e,r,n){return r}_isMember(e){return this.topic===e}_joinRef(){return this.joinPush.ref}_trigger(e,r,n){var i,o;const s=e.toLocaleLowerCase(),{close:a,error:c,leave:u,join:d}=Lr;if(n&&[a,c,u,d].indexOf(s)>=0&&n!==this._joinRef())return;let f=this._onMessage(s,r,n);if(r&&!f)throw"channel onMessage callbacks must return the payload, modified or unmodified";["insert","update","delete"].includes(s)?(i=this.bindings.postgres_changes)===null||i===void 0||i.filter(p=>{var g,m,b;return((g=p.filter)===null||g===void 0?void 0:g.event)==="*"||((b=(m=p.filter)===null||m===void 0?void 0:m.event)===null||b===void 0?void 0:b.toLocaleLowerCase())===s}).map(p=>p.callback(f,n)):(o=this.bindings[s])===null||o===void 0||o.filter(p=>{var g,m,b,v,y,x;if(["broadcast","presence","postgres_changes"].includes(s))if("id"in p){const S=p.id,j=(g=p.filter)===null||g===void 0?void 0:g.event;return S&&((m=r.ids)===null||m===void 0?void 0:m.includes(S))&&(j==="*"||(j==null?void 0:j.toLocaleLowerCase())===((b=r.data)===null||b===void 0?void 0:b.type.toLocaleLowerCase()))}else{const S=(y=(v=p==null?void 0:p.filter)===null||v===void 0?void 0:v.event)===null||y===void 0?void 0:y.toLocaleLowerCase();return S==="*"||S===((x=r==null?void 0:r.event)===null||x===void 0?void 0:x.toLocaleLowerCase())}else return p.type.toLocaleLowerCase()===s}).map(p=>{if(typeof f=="object"&&"ids"in f){const g=f.data,{schema:m,table:b,commit_timestamp:v,type:y,errors:x}=g;f=Object.assign(Object.assign({},{schema:m,table:b,commit_timestamp:v,eventType:y,new:{},old:{},errors:x}),this._getPayloadRecords(g))}p.callback(f,n)})}_isClosed(){return this.state===Et.closed}_isJoined(){return this.state===Et.joined}_isJoining(){return this.state===Et.joining}_isLeaving(){return this.state===Et.leaving}_replyEventName(e){return`chan_reply_${e}`}_on(e,r,n){const i=e.toLocaleLowerCase(),o={type:i,filter:r,callback:n};return this.bindings[i]?this.bindings[i].push(o):this.bindings[i]=[o],this}_off(e,r){const n=e.toLocaleLowerCase();return this.bindings[n]&&(this.bindings[n]=this.bindings[n].filter(i=>{var o;return!(((o=i.type)===null||o===void 0?void 0:o.toLocaleLowerCase())===n&&Gf.isEqual(i.filter,r))})),this}static isEqual(e,r){if(Object.keys(e).length!==Object.keys(r).length)return!1;for(const n in e)if(e[n]!==r[n])return!1;return!0}_rejoinUntilConnected(){this.rejoinTimer.scheduleTimeout(),this.socket.isConnected()&&this._rejoin()}_onClose(e){this._on(Lr.close,{},e)}_onError(e){this._on(Lr.error,{},r=>e(r))}_canPush(){return this.socket.isConnected()&&this._isJoined()}_rejoin(e=this.timeout){this._isLeaving()||(this.socket._leaveOpenTopic(this.topic),this.state=Et.joining,this.joinPush.resend(e))}_getPayloadRecords(e){const r={new:{},old:{}};return(e.type==="INSERT"||e.type==="UPDATE")&&(r.new=vg(e.columns,e.record)),(e.type==="UPDATE"||e.type==="DELETE")&&(r.old=vg(e.columns,e.old_record)),r}}const Qu=()=>{},Rl={HEARTBEAT_INTERVAL:25e3,RECONNECT_DELAY:10,HEARTBEAT_TIMEOUT_FALLBACK:100},DS=[1e3,2e3,5e3,1e4],zS=1e4,FS=`
  addEventListener("message", (e) => {
    if (e.data.event === "start") {
      setInterval(() => postMessage({ event: "keepAlive" }), e.data.interval);
    }
  });`;class BS{constructor(e,r){var n;if(this.accessTokenValue=null,this.apiKey=null,this.channels=new Array,this.endPoint="",this.httpEndpoint="",this.headers={},this.params={},this.timeout=Sh,this.transport=null,this.heartbeatIntervalMs=Rl.HEARTBEAT_INTERVAL,this.heartbeatTimer=void 0,this.pendingHeartbeatRef=null,this.heartbeatCallback=Qu,this.ref=0,this.reconnectTimer=null,this.logger=Qu,this.conn=null,this.sendBuffer=[],this.serializer=new PS,this.stateChangeCallbacks={open:[],close:[],error:[],message:[]},this.accessToken=null,this._connectionState="disconnected",this._wasManualDisconnect=!1,this._authPromise=null,this._resolveFetch=i=>i?(...o)=>i(...o):(...o)=>fetch(...o),!(!((n=r==null?void 0:r.params)===null||n===void 0)&&n.apikey))throw new Error("API key is required to connect to Realtime");this.apiKey=r.params.apikey,this.endPoint=`${e}/${kh.websocket}`,this.httpEndpoint=Yx(e),this._initializeOptions(r),this._setupReconnectionTimer(),this.fetch=this._resolveFetch(r==null?void 0:r.fetch)}connect(){if(!(this.isConnecting()||this.isDisconnecting()||this.conn!==null&&this.isConnected())){if(this._setConnectionState("connecting"),this._setAuthSafely("connect"),this.transport)this.conn=new this.transport(this.endpointURL());else try{this.conn=jS.createWebSocket(this.endpointURL())}catch(e){this._setConnectionState("disconnected");const r=e.message;throw r.includes("Node.js")?new Error(`${r}

To use Realtime in Node.js, you need to provide a WebSocket implementation:

Option 1: Use Node.js 22+ which has native WebSocket support
Option 2: Install and provide the "ws" package:

  npm install ws

  import ws from "ws"
  const client = new RealtimeClient(url, {
    ...options,
    transport: ws
  })`):new Error(`WebSocket not available: ${r}`)}this._setupConnectionHandlers()}}endpointURL(){return this._appendParams(this.endPoint,Object.assign({},this.params,{vsn:TS}))}disconnect(e,r){if(!this.isDisconnecting())if(this._setConnectionState("disconnecting",!0),this.conn){const n=setTimeout(()=>{this._setConnectionState("disconnected")},100);this.conn.onclose=()=>{clearTimeout(n),this._setConnectionState("disconnected")},e?this.conn.close(e,r??""):this.conn.close(),this._teardownConnection()}else this._setConnectionState("disconnected")}getChannels(){return this.channels}async removeChannel(e){const r=await e.unsubscribe();return this.channels.length===0&&this.disconnect(),r}async removeAllChannels(){const e=await Promise.all(this.channels.map(r=>r.unsubscribe()));return this.channels=[],this.disconnect(),e}log(e,r,n){this.logger(e,r,n)}connectionState(){switch(this.conn&&this.conn.readyState){case da.connecting:return Ci.Connecting;case da.open:return Ci.Open;case da.closing:return Ci.Closing;default:return Ci.Closed}}isConnected(){return this.connectionState()===Ci.Open}isConnecting(){return this._connectionState==="connecting"}isDisconnecting(){return this._connectionState==="disconnecting"}channel(e,r={config:{}}){const n=`realtime:${e}`,i=this.getChannels().find(o=>o.topic===n);if(i)return i;{const o=new Gf(`realtime:${e}`,r,this);return this.channels.push(o),o}}push(e){const{topic:r,event:n,payload:i,ref:o}=e,s=()=>{this.encode(e,a=>{var c;(c=this.conn)===null||c===void 0||c.send(a)})};this.log("push",`${r} ${n} (${o})`,i),this.isConnected()?s():this.sendBuffer.push(s)}async setAuth(e=null){this._authPromise=this._performAuth(e);try{await this._authPromise}finally{this._authPromise=null}}async sendHeartbeat(){var e;if(!this.isConnected()){try{this.heartbeatCallback("disconnected")}catch(r){this.log("error","error in heartbeat callback",r)}return}if(this.pendingHeartbeatRef){this.pendingHeartbeatRef=null,this.log("transport","heartbeat timeout. Attempting to re-establish connection");try{this.heartbeatCallback("timeout")}catch(r){this.log("error","error in heartbeat callback",r)}this._wasManualDisconnect=!1,(e=this.conn)===null||e===void 0||e.close(RS,"heartbeat timeout"),setTimeout(()=>{var r;this.isConnected()||(r=this.reconnectTimer)===null||r===void 0||r.scheduleTimeout()},Rl.HEARTBEAT_TIMEOUT_FALLBACK);return}this.pendingHeartbeatRef=this._makeRef(),this.push({topic:"phoenix",event:"heartbeat",payload:{},ref:this.pendingHeartbeatRef});try{this.heartbeatCallback("sent")}catch(r){this.log("error","error in heartbeat callback",r)}this._setAuthSafely("heartbeat")}onHeartbeat(e){this.heartbeatCallback=e}flushSendBuffer(){this.isConnected()&&this.sendBuffer.length>0&&(this.sendBuffer.forEach(e=>e()),this.sendBuffer=[])}_makeRef(){let e=this.ref+1;return e===this.ref?this.ref=0:this.ref=e,this.ref.toString()}_leaveOpenTopic(e){let r=this.channels.find(n=>n.topic===e&&(n._isJoined()||n._isJoining()));r&&(this.log("transport",`leaving duplicate topic "${e}"`),r.unsubscribe())}_remove(e){this.channels=this.channels.filter(r=>r.topic!==e.topic)}_onConnMessage(e){this.decode(e.data,r=>{if(r.topic==="phoenix"&&r.event==="phx_reply")try{this.heartbeatCallback(r.payload.status==="ok"?"ok":"error")}catch(u){this.log("error","error in heartbeat callback",u)}r.ref&&r.ref===this.pendingHeartbeatRef&&(this.pendingHeartbeatRef=null);const{topic:n,event:i,payload:o,ref:s}=r,a=s?`(${s})`:"",c=o.status||"";this.log("receive",`${c} ${n} ${i} ${a}`.trim(),o),this.channels.filter(u=>u._isMember(n)).forEach(u=>u._trigger(i,o,s)),this._triggerStateCallbacks("message",r)})}_clearTimer(e){var r;e==="heartbeat"&&this.heartbeatTimer?(clearInterval(this.heartbeatTimer),this.heartbeatTimer=void 0):e==="reconnect"&&((r=this.reconnectTimer)===null||r===void 0||r.reset())}_clearAllTimers(){this._clearTimer("heartbeat"),this._clearTimer("reconnect")}_setupConnectionHandlers(){this.conn&&("binaryType"in this.conn&&(this.conn.binaryType="arraybuffer"),this.conn.onopen=()=>this._onConnOpen(),this.conn.onerror=e=>this._onConnError(e),this.conn.onmessage=e=>this._onConnMessage(e),this.conn.onclose=e=>this._onConnClose(e))}_teardownConnection(){this.conn&&(this.conn.onopen=null,this.conn.onerror=null,this.conn.onmessage=null,this.conn.onclose=null,this.conn=null),this._clearAllTimers(),this.channels.forEach(e=>e.teardown())}_onConnOpen(){this._setConnectionState("connected"),this.log("transport",`connected to ${this.endpointURL()}`),this.flushSendBuffer(),this._clearTimer("reconnect"),this.worker?this.workerRef||this._startWorkerHeartbeat():this._startHeartbeat(),this._triggerStateCallbacks("open")}_startHeartbeat(){this.heartbeatTimer&&clearInterval(this.heartbeatTimer),this.heartbeatTimer=setInterval(()=>this.sendHeartbeat(),this.heartbeatIntervalMs)}_startWorkerHeartbeat(){this.workerUrl?this.log("worker",`starting worker for from ${this.workerUrl}`):this.log("worker","starting default worker");const e=this._workerObjectUrl(this.workerUrl);this.workerRef=new Worker(e),this.workerRef.onerror=r=>{this.log("worker","worker error",r.message),this.workerRef.terminate()},this.workerRef.onmessage=r=>{r.data.event==="keepAlive"&&this.sendHeartbeat()},this.workerRef.postMessage({event:"start",interval:this.heartbeatIntervalMs})}_onConnClose(e){var r;this._setConnectionState("disconnected"),this.log("transport","close",e),this._triggerChanError(),this._clearTimer("heartbeat"),this._wasManualDisconnect||(r=this.reconnectTimer)===null||r===void 0||r.scheduleTimeout(),this._triggerStateCallbacks("close",e)}_onConnError(e){this._setConnectionState("disconnected"),this.log("transport",`${e}`),this._triggerChanError(),this._triggerStateCallbacks("error",e)}_triggerChanError(){this.channels.forEach(e=>e._trigger(Lr.error))}_appendParams(e,r){if(Object.keys(r).length===0)return e;const n=e.match(/\?/)?"&":"?",i=new URLSearchParams(r);return`${e}${n}${i}`}_workerObjectUrl(e){let r;if(e)r=e;else{const n=new Blob([FS],{type:"application/javascript"});r=URL.createObjectURL(n)}return r}_setConnectionState(e,r=!1){this._connectionState=e,e==="connecting"?this._wasManualDisconnect=!1:e==="disconnecting"&&(this._wasManualDisconnect=r)}async _performAuth(e=null){let r;e?r=e:this.accessToken?r=await this.accessToken():r=this.accessTokenValue,this.accessTokenValue!=r&&(this.accessTokenValue=r,this.channels.forEach(n=>{const i={access_token:r,version:ES};r&&n.updateJoinPayload(i),n.joinedOnce&&n._isJoined()&&n._push(Lr.access_token,{access_token:r})}))}async _waitForAuthIfNeeded(){this._authPromise&&await this._authPromise}_setAuthSafely(e="general"){this.setAuth().catch(r=>{this.log("error",`error setting auth in ${e}`,r)})}_triggerStateCallbacks(e,r){try{this.stateChangeCallbacks[e].forEach(n=>{try{n(r)}catch(i){this.log("error",`error in ${e} callback`,i)}})}catch(n){this.log("error",`error triggering ${e} callbacks`,n)}}_setupReconnectionTimer(){this.reconnectTimer=new qx(async()=>{setTimeout(async()=>{await this._waitForAuthIfNeeded(),this.isConnected()||this.connect()},Rl.RECONNECT_DELAY)},this.reconnectAfterMs)}_initializeOptions(e){var r,n,i,o,s,a,c,u,d;if(this.transport=(r=e==null?void 0:e.transport)!==null&&r!==void 0?r:null,this.timeout=(n=e==null?void 0:e.timeout)!==null&&n!==void 0?n:Sh,this.heartbeatIntervalMs=(i=e==null?void 0:e.heartbeatIntervalMs)!==null&&i!==void 0?i:Rl.HEARTBEAT_INTERVAL,this.worker=(o=e==null?void 0:e.worker)!==null&&o!==void 0?o:!1,this.accessToken=(s=e==null?void 0:e.accessToken)!==null&&s!==void 0?s:null,this.heartbeatCallback=(a=e==null?void 0:e.heartbeatCallback)!==null&&a!==void 0?a:Qu,e!=null&&e.params&&(this.params=e.params),e!=null&&e.logger&&(this.logger=e.logger),(e!=null&&e.logLevel||e!=null&&e.log_level)&&(this.logLevel=e.logLevel||e.log_level,this.params=Object.assign(Object.assign({},this.params),{log_level:this.logLevel})),this.reconnectAfterMs=(c=e==null?void 0:e.reconnectAfterMs)!==null&&c!==void 0?c:h=>DS[h-1]||zS,this.encode=(u=e==null?void 0:e.encode)!==null&&u!==void 0?u:(h,f)=>f(JSON.stringify(h)),this.decode=(d=e==null?void 0:e.decode)!==null&&d!==void 0?d:this.serializer.decode.bind(this.serializer),this.worker){if(typeof window<"u"&&!window.Worker)throw new Error("Web Worker is not supported");this.workerUrl=e==null?void 0:e.workerUrl}}}class Vf extends Error{constructor(e){super(e),this.__isStorageError=!0,this.name="StorageError"}}function mt(t){return typeof t=="object"&&t!==null&&"__isStorageError"in t}class US extends Vf{constructor(e,r,n){super(e),this.name="StorageApiError",this.status=r,this.statusCode=n}toJSON(){return{name:this.name,message:this.message,status:this.status,statusCode:this.statusCode}}}class Ch extends Vf{constructor(e,r){super(e),this.name="StorageUnknownError",this.originalError=r}}const qf=t=>t?(...e)=>t(...e):(...e)=>fetch(...e),HS=()=>Response,Eh=t=>{if(Array.isArray(t))return t.map(r=>Eh(r));if(typeof t=="function"||t!==Object(t))return t;const e={};return Object.entries(t).forEach(([r,n])=>{const i=r.replace(/([-_][a-z])/gi,o=>o.toUpperCase().replace(/[-_]/g,""));e[i]=Eh(n)}),e},WS=t=>{if(typeof t!="object"||t===null)return!1;const e=Object.getPrototypeOf(t);return(e===null||e===Object.prototype||Object.getPrototypeOf(e)===null)&&!(Symbol.toStringTag in t)&&!(Symbol.iterator in t)},ed=t=>{var e;return t.msg||t.message||t.error_description||(typeof t.error=="string"?t.error:(e=t.error)===null||e===void 0?void 0:e.message)||JSON.stringify(t)},GS=(t,e,r)=>Se(void 0,void 0,void 0,function*(){const n=yield HS();t instanceof n&&!(r!=null&&r.noResolveJson)?t.json().then(i=>{const o=t.status||500,s=(i==null?void 0:i.statusCode)||o+"";e(new US(ed(i),o,s))}).catch(i=>{e(new Ch(ed(i),i))}):e(new Ch(ed(t),t))}),VS=(t,e,r,n)=>{const i={method:t,headers:(e==null?void 0:e.headers)||{}};return t==="GET"||!n?i:(WS(n)?(i.headers=Object.assign({"Content-Type":"application/json"},e==null?void 0:e.headers),i.body=JSON.stringify(n)):i.body=n,e!=null&&e.duplex&&(i.duplex=e.duplex),Object.assign(Object.assign({},i),r))};function Ha(t,e,r,n,i,o){return Se(this,void 0,void 0,function*(){return new Promise((s,a)=>{t(r,VS(e,n,i,o)).then(c=>{if(!c.ok)throw c;return n!=null&&n.noResolveJson?c:c.json()}).then(c=>s(c)).catch(c=>GS(c,a,n))})})}function Oa(t,e,r,n){return Se(this,void 0,void 0,function*(){return Ha(t,"GET",e,r,n)})}function Ir(t,e,r,n,i){return Se(this,void 0,void 0,function*(){return Ha(t,"POST",e,n,i,r)})}function Th(t,e,r,n,i){return Se(this,void 0,void 0,function*(){return Ha(t,"PUT",e,n,i,r)})}function qS(t,e,r,n){return Se(this,void 0,void 0,function*(){return Ha(t,"HEAD",e,Object.assign(Object.assign({},r),{noResolveJson:!0}),n)})}function Kf(t,e,r,n,i){return Se(this,void 0,void 0,function*(){return Ha(t,"DELETE",e,n,i,r)})}class KS{constructor(e,r){this.downloadFn=e,this.shouldThrowOnError=r}then(e,r){return this.execute().then(e,r)}execute(){return Se(this,void 0,void 0,function*(){try{return{data:(yield this.downloadFn()).body,error:null}}catch(e){if(this.shouldThrowOnError)throw e;if(mt(e))return{data:null,error:e};throw e}})}}var Xx;class YS{constructor(e,r){this.downloadFn=e,this.shouldThrowOnError=r,this[Xx]="BlobDownloadBuilder",this.promise=null}asStream(){return new KS(this.downloadFn,this.shouldThrowOnError)}then(e,r){return this.getPromise().then(e,r)}catch(e){return this.getPromise().catch(e)}finally(e){return this.getPromise().finally(e)}getPromise(){return this.promise||(this.promise=this.execute()),this.promise}execute(){return Se(this,void 0,void 0,function*(){try{return{data:yield(yield this.downloadFn()).blob(),error:null}}catch(e){if(this.shouldThrowOnError)throw e;if(mt(e))return{data:null,error:e};throw e}})}}Xx=Symbol.toStringTag;const XS={limit:100,offset:0,sortBy:{column:"name",order:"asc"}},xg={cacheControl:"3600",contentType:"text/plain;charset=UTF-8",upsert:!1};class ZS{constructor(e,r={},n,i){this.shouldThrowOnError=!1,this.url=e,this.headers=r,this.bucketId=n,this.fetch=qf(i)}throwOnError(){return this.shouldThrowOnError=!0,this}uploadOrUpdate(e,r,n,i){return Se(this,void 0,void 0,function*(){try{let o;const s=Object.assign(Object.assign({},xg),i);let a=Object.assign(Object.assign({},this.headers),e==="POST"&&{"x-upsert":String(s.upsert)});const c=s.metadata;typeof Blob<"u"&&n instanceof Blob?(o=new FormData,o.append("cacheControl",s.cacheControl),c&&o.append("metadata",this.encodeMetadata(c)),o.append("",n)):typeof FormData<"u"&&n instanceof FormData?(o=n,o.has("cacheControl")||o.append("cacheControl",s.cacheControl),c&&!o.has("metadata")&&o.append("metadata",this.encodeMetadata(c))):(o=n,a["cache-control"]=`max-age=${s.cacheControl}`,a["content-type"]=s.contentType,c&&(a["x-metadata"]=this.toBase64(this.encodeMetadata(c))),(typeof ReadableStream<"u"&&o instanceof ReadableStream||o&&typeof o=="object"&&"pipe"in o&&typeof o.pipe=="function")&&!s.duplex&&(s.duplex="half")),i!=null&&i.headers&&(a=Object.assign(Object.assign({},a),i.headers));const u=this._removeEmptyFolders(r),d=this._getFinalPath(u),h=yield(e=="PUT"?Th:Ir)(this.fetch,`${this.url}/object/${d}`,o,Object.assign({headers:a},s!=null&&s.duplex?{duplex:s.duplex}:{}));return{data:{path:u,id:h.Id,fullPath:h.Key},error:null}}catch(o){if(this.shouldThrowOnError)throw o;if(mt(o))return{data:null,error:o};throw o}})}upload(e,r,n){return Se(this,void 0,void 0,function*(){return this.uploadOrUpdate("POST",e,r,n)})}uploadToSignedUrl(e,r,n,i){return Se(this,void 0,void 0,function*(){const o=this._removeEmptyFolders(e),s=this._getFinalPath(o),a=new URL(this.url+`/object/upload/sign/${s}`);a.searchParams.set("token",r);try{let c;const u=Object.assign({upsert:xg.upsert},i),d=Object.assign(Object.assign({},this.headers),{"x-upsert":String(u.upsert)});typeof Blob<"u"&&n instanceof Blob?(c=new FormData,c.append("cacheControl",u.cacheControl),c.append("",n)):typeof FormData<"u"&&n instanceof FormData?(c=n,c.append("cacheControl",u.cacheControl)):(c=n,d["cache-control"]=`max-age=${u.cacheControl}`,d["content-type"]=u.contentType);const h=yield Th(this.fetch,a.toString(),c,{headers:d});return{data:{path:o,fullPath:h.Key},error:null}}catch(c){if(this.shouldThrowOnError)throw c;if(mt(c))return{data:null,error:c};throw c}})}createSignedUploadUrl(e,r){return Se(this,void 0,void 0,function*(){try{let n=this._getFinalPath(e);const i=Object.assign({},this.headers);r!=null&&r.upsert&&(i["x-upsert"]="true");const o=yield Ir(this.fetch,`${this.url}/object/upload/sign/${n}`,{},{headers:i}),s=new URL(this.url+o.url),a=s.searchParams.get("token");if(!a)throw new Vf("No token returned by API");return{data:{signedUrl:s.toString(),path:e,token:a},error:null}}catch(n){if(this.shouldThrowOnError)throw n;if(mt(n))return{data:null,error:n};throw n}})}update(e,r,n){return Se(this,void 0,void 0,function*(){return this.uploadOrUpdate("PUT",e,r,n)})}move(e,r,n){return Se(this,void 0,void 0,function*(){try{return{data:yield Ir(this.fetch,`${this.url}/object/move`,{bucketId:this.bucketId,sourceKey:e,destinationKey:r,destinationBucket:n==null?void 0:n.destinationBucket},{headers:this.headers}),error:null}}catch(i){if(this.shouldThrowOnError)throw i;if(mt(i))return{data:null,error:i};throw i}})}copy(e,r,n){return Se(this,void 0,void 0,function*(){try{return{data:{path:(yield Ir(this.fetch,`${this.url}/object/copy`,{bucketId:this.bucketId,sourceKey:e,destinationKey:r,destinationBucket:n==null?void 0:n.destinationBucket},{headers:this.headers})).Key},error:null}}catch(i){if(this.shouldThrowOnError)throw i;if(mt(i))return{data:null,error:i};throw i}})}createSignedUrl(e,r,n){return Se(this,void 0,void 0,function*(){try{let i=this._getFinalPath(e),o=yield Ir(this.fetch,`${this.url}/object/sign/${i}`,Object.assign({expiresIn:r},n!=null&&n.transform?{transform:n.transform}:{}),{headers:this.headers});const s=n!=null&&n.download?`&download=${n.download===!0?"":n.download}`:"";return o={signedUrl:encodeURI(`${this.url}${o.signedURL}${s}`)},{data:o,error:null}}catch(i){if(this.shouldThrowOnError)throw i;if(mt(i))return{data:null,error:i};throw i}})}createSignedUrls(e,r,n){return Se(this,void 0,void 0,function*(){try{const i=yield Ir(this.fetch,`${this.url}/object/sign/${this.bucketId}`,{expiresIn:r,paths:e},{headers:this.headers}),o=n!=null&&n.download?`&download=${n.download===!0?"":n.download}`:"";return{data:i.map(s=>Object.assign(Object.assign({},s),{signedUrl:s.signedURL?encodeURI(`${this.url}${s.signedURL}${o}`):null})),error:null}}catch(i){if(this.shouldThrowOnError)throw i;if(mt(i))return{data:null,error:i};throw i}})}download(e,r){const i=typeof(r==null?void 0:r.transform)<"u"?"render/image/authenticated":"object",o=this.transformOptsToQueryString((r==null?void 0:r.transform)||{}),s=o?`?${o}`:"",a=this._getFinalPath(e),c=()=>Oa(this.fetch,`${this.url}/${i}/${a}${s}`,{headers:this.headers,noResolveJson:!0});return new YS(c,this.shouldThrowOnError)}info(e){return Se(this,void 0,void 0,function*(){const r=this._getFinalPath(e);try{const n=yield Oa(this.fetch,`${this.url}/object/info/${r}`,{headers:this.headers});return{data:Eh(n),error:null}}catch(n){if(this.shouldThrowOnError)throw n;if(mt(n))return{data:null,error:n};throw n}})}exists(e){return Se(this,void 0,void 0,function*(){const r=this._getFinalPath(e);try{return yield qS(this.fetch,`${this.url}/object/${r}`,{headers:this.headers}),{data:!0,error:null}}catch(n){if(this.shouldThrowOnError)throw n;if(mt(n)&&n instanceof Ch){const i=n.originalError;if([400,404].includes(i==null?void 0:i.status))return{data:!1,error:n}}throw n}})}getPublicUrl(e,r){const n=this._getFinalPath(e),i=[],o=r!=null&&r.download?`download=${r.download===!0?"":r.download}`:"";o!==""&&i.push(o);const a=typeof(r==null?void 0:r.transform)<"u"?"render/image":"object",c=this.transformOptsToQueryString((r==null?void 0:r.transform)||{});c!==""&&i.push(c);let u=i.join("&");return u!==""&&(u=`?${u}`),{data:{publicUrl:encodeURI(`${this.url}/${a}/public/${n}${u}`)}}}remove(e){return Se(this,void 0,void 0,function*(){try{return{data:yield Kf(this.fetch,`${this.url}/object/${this.bucketId}`,{prefixes:e},{headers:this.headers}),error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(mt(r))return{data:null,error:r};throw r}})}list(e,r,n){return Se(this,void 0,void 0,function*(){try{const i=Object.assign(Object.assign(Object.assign({},XS),r),{prefix:e||""});return{data:yield Ir(this.fetch,`${this.url}/object/list/${this.bucketId}`,i,{headers:this.headers},n),error:null}}catch(i){if(this.shouldThrowOnError)throw i;if(mt(i))return{data:null,error:i};throw i}})}listV2(e,r){return Se(this,void 0,void 0,function*(){try{const n=Object.assign({},e);return{data:yield Ir(this.fetch,`${this.url}/object/list-v2/${this.bucketId}`,n,{headers:this.headers},r),error:null}}catch(n){if(this.shouldThrowOnError)throw n;if(mt(n))return{data:null,error:n};throw n}})}encodeMetadata(e){return JSON.stringify(e)}toBase64(e){return typeof Buffer<"u"?Buffer.from(e).toString("base64"):btoa(e)}_getFinalPath(e){return`${this.bucketId}/${e.replace(/^\/+/,"")}`}_removeEmptyFolders(e){return e.replace(/^\/|\/$/g,"").replace(/\/+/g,"/")}transformOptsToQueryString(e){const r=[];return e.width&&r.push(`width=${e.width}`),e.height&&r.push(`height=${e.height}`),e.resize&&r.push(`resize=${e.resize}`),e.format&&r.push(`format=${e.format}`),e.quality&&r.push(`quality=${e.quality}`),r.join("&")}}const Zx="2.79.0",Jx={"X-Client-Info":`storage-js/${Zx}`};class JS{constructor(e,r={},n,i){this.shouldThrowOnError=!1;const o=new URL(e);i!=null&&i.useNewHostname&&/supabase\.(co|in|red)$/.test(o.hostname)&&!o.hostname.includes("storage.supabase.")&&(o.hostname=o.hostname.replace("supabase.","storage.supabase.")),this.url=o.href.replace(/\/$/,""),this.headers=Object.assign(Object.assign({},Jx),r),this.fetch=qf(n)}throwOnError(){return this.shouldThrowOnError=!0,this}listBuckets(e){return Se(this,void 0,void 0,function*(){try{const r=this.listBucketOptionsToQueryString(e);return{data:yield Oa(this.fetch,`${this.url}/bucket${r}`,{headers:this.headers}),error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(mt(r))return{data:null,error:r};throw r}})}getBucket(e){return Se(this,void 0,void 0,function*(){try{return{data:yield Oa(this.fetch,`${this.url}/bucket/${e}`,{headers:this.headers}),error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(mt(r))return{data:null,error:r};throw r}})}createBucket(e){return Se(this,arguments,void 0,function*(r,n={public:!1}){try{return{data:yield Ir(this.fetch,`${this.url}/bucket`,{id:r,name:r,type:n.type,public:n.public,file_size_limit:n.fileSizeLimit,allowed_mime_types:n.allowedMimeTypes},{headers:this.headers}),error:null}}catch(i){if(this.shouldThrowOnError)throw i;if(mt(i))return{data:null,error:i};throw i}})}updateBucket(e,r){return Se(this,void 0,void 0,function*(){try{return{data:yield Th(this.fetch,`${this.url}/bucket/${e}`,{id:e,name:e,public:r.public,file_size_limit:r.fileSizeLimit,allowed_mime_types:r.allowedMimeTypes},{headers:this.headers}),error:null}}catch(n){if(this.shouldThrowOnError)throw n;if(mt(n))return{data:null,error:n};throw n}})}emptyBucket(e){return Se(this,void 0,void 0,function*(){try{return{data:yield Ir(this.fetch,`${this.url}/bucket/${e}/empty`,{},{headers:this.headers}),error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(mt(r))return{data:null,error:r};throw r}})}deleteBucket(e){return Se(this,void 0,void 0,function*(){try{return{data:yield Kf(this.fetch,`${this.url}/bucket/${e}`,{},{headers:this.headers}),error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(mt(r))return{data:null,error:r};throw r}})}listBucketOptionsToQueryString(e){const r={};return e&&("limit"in e&&(r.limit=String(e.limit)),"offset"in e&&(r.offset=String(e.offset)),e.search&&(r.search=e.search),e.sortColumn&&(r.sortColumn=e.sortColumn),e.sortOrder&&(r.sortOrder=e.sortOrder)),Object.keys(r).length>0?"?"+new URLSearchParams(r).toString():""}}class QS{constructor(e,r={},n){this.shouldThrowOnError=!1,this.url=e.replace(/\/$/,""),this.headers=Object.assign(Object.assign({},Jx),r),this.fetch=qf(n)}throwOnError(){return this.shouldThrowOnError=!0,this}createBucket(e){return Se(this,void 0,void 0,function*(){try{return{data:yield Ir(this.fetch,`${this.url}/bucket`,{name:e},{headers:this.headers}),error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(mt(r))return{data:null,error:r};throw r}})}listBuckets(e){return Se(this,void 0,void 0,function*(){try{const r=new URLSearchParams;(e==null?void 0:e.limit)!==void 0&&r.set("limit",e.limit.toString()),(e==null?void 0:e.offset)!==void 0&&r.set("offset",e.offset.toString()),e!=null&&e.sortColumn&&r.set("sortColumn",e.sortColumn),e!=null&&e.sortOrder&&r.set("sortOrder",e.sortOrder),e!=null&&e.search&&r.set("search",e.search);const n=r.toString(),i=n?`${this.url}/bucket?${n}`:`${this.url}/bucket`;return{data:yield Oa(this.fetch,i,{headers:this.headers}),error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(mt(r))return{data:null,error:r};throw r}})}deleteBucket(e){return Se(this,void 0,void 0,function*(){try{return{data:yield Kf(this.fetch,`${this.url}/bucket/${e}`,{},{headers:this.headers}),error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(mt(r))return{data:null,error:r};throw r}})}}const Yf={"X-Client-Info":`storage-js/${Zx}`,"Content-Type":"application/json"};class Qx extends Error{constructor(e){super(e),this.__isStorageVectorsError=!0,this.name="StorageVectorsError"}}function ur(t){return typeof t=="object"&&t!==null&&"__isStorageVectorsError"in t}class td extends Qx{constructor(e,r,n){super(e),this.name="StorageVectorsApiError",this.status=r,this.statusCode=n}toJSON(){return{name:this.name,message:this.message,status:this.status,statusCode:this.statusCode}}}class ek extends Qx{constructor(e,r){super(e),this.name="StorageVectorsUnknownError",this.originalError=r}}var wg;(function(t){t.InternalError="InternalError",t.S3VectorConflictException="S3VectorConflictException",t.S3VectorNotFoundException="S3VectorNotFoundException",t.S3VectorBucketNotEmpty="S3VectorBucketNotEmpty",t.S3VectorMaxBucketsExceeded="S3VectorMaxBucketsExceeded",t.S3VectorMaxIndexesExceeded="S3VectorMaxIndexesExceeded"})(wg||(wg={}));const Xf=t=>t?(...e)=>t(...e):(...e)=>fetch(...e),tk=t=>{if(typeof t!="object"||t===null)return!1;const e=Object.getPrototypeOf(t);return(e===null||e===Object.prototype||Object.getPrototypeOf(e)===null)&&!(Symbol.toStringTag in t)&&!(Symbol.iterator in t)},_g=t=>t.msg||t.message||t.error_description||t.error||JSON.stringify(t),rk=(t,e,r)=>Se(void 0,void 0,void 0,function*(){if(t&&typeof t=="object"&&"status"in t&&"ok"in t&&typeof t.status=="number"&&!(r!=null&&r.noResolveJson)){const i=t.status||500,o=t;if(typeof o.json=="function")o.json().then(s=>{const a=(s==null?void 0:s.statusCode)||(s==null?void 0:s.code)||i+"";e(new td(_g(s),i,a))}).catch(()=>{const s=i+"",a=o.statusText||`HTTP ${i} error`;e(new td(a,i,s))});else{const s=i+"",a=o.statusText||`HTTP ${i} error`;e(new td(a,i,s))}}else e(new ek(_g(t),t))}),nk=(t,e,r,n)=>{const i={method:t,headers:(e==null?void 0:e.headers)||{}};return n?(tk(n)?(i.headers=Object.assign({"Content-Type":"application/json"},e==null?void 0:e.headers),i.body=JSON.stringify(n)):i.body=n,Object.assign(Object.assign({},i),r)):i};function ik(t,e,r,n,i,o){return Se(this,void 0,void 0,function*(){return new Promise((s,a)=>{t(r,nk(e,n,i,o)).then(c=>{if(!c.ok)throw c;if(n!=null&&n.noResolveJson)return c;const u=c.headers.get("content-type");return!u||!u.includes("application/json")?{}:c.json()}).then(c=>s(c)).catch(c=>rk(c,a,n))})})}function dr(t,e,r,n,i){return Se(this,void 0,void 0,function*(){return ik(t,"POST",e,n,i,r)})}class ok{constructor(e,r={},n){this.shouldThrowOnError=!1,this.url=e.replace(/\/$/,""),this.headers=Object.assign(Object.assign({},Yf),r),this.fetch=Xf(n)}throwOnError(){return this.shouldThrowOnError=!0,this}createIndex(e){return Se(this,void 0,void 0,function*(){try{return{data:(yield dr(this.fetch,`${this.url}/CreateIndex`,e,{headers:this.headers}))||{},error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(ur(r))return{data:null,error:r};throw r}})}getIndex(e,r){return Se(this,void 0,void 0,function*(){try{return{data:yield dr(this.fetch,`${this.url}/GetIndex`,{vectorBucketName:e,indexName:r},{headers:this.headers}),error:null}}catch(n){if(this.shouldThrowOnError)throw n;if(ur(n))return{data:null,error:n};throw n}})}listIndexes(e){return Se(this,void 0,void 0,function*(){try{return{data:yield dr(this.fetch,`${this.url}/ListIndexes`,e,{headers:this.headers}),error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(ur(r))return{data:null,error:r};throw r}})}deleteIndex(e,r){return Se(this,void 0,void 0,function*(){try{return{data:(yield dr(this.fetch,`${this.url}/DeleteIndex`,{vectorBucketName:e,indexName:r},{headers:this.headers}))||{},error:null}}catch(n){if(this.shouldThrowOnError)throw n;if(ur(n))return{data:null,error:n};throw n}})}}class sk{constructor(e,r={},n){this.shouldThrowOnError=!1,this.url=e.replace(/\/$/,""),this.headers=Object.assign(Object.assign({},Yf),r),this.fetch=Xf(n)}throwOnError(){return this.shouldThrowOnError=!0,this}putVectors(e){return Se(this,void 0,void 0,function*(){try{if(e.vectors.length<1||e.vectors.length>500)throw new Error("Vector batch size must be between 1 and 500 items");return{data:(yield dr(this.fetch,`${this.url}/PutVectors`,e,{headers:this.headers}))||{},error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(ur(r))return{data:null,error:r};throw r}})}getVectors(e){return Se(this,void 0,void 0,function*(){try{return{data:yield dr(this.fetch,`${this.url}/GetVectors`,e,{headers:this.headers}),error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(ur(r))return{data:null,error:r};throw r}})}listVectors(e){return Se(this,void 0,void 0,function*(){try{if(e.segmentCount!==void 0){if(e.segmentCount<1||e.segmentCount>16)throw new Error("segmentCount must be between 1 and 16");if(e.segmentIndex!==void 0&&(e.segmentIndex<0||e.segmentIndex>=e.segmentCount))throw new Error(`segmentIndex must be between 0 and ${e.segmentCount-1}`)}return{data:yield dr(this.fetch,`${this.url}/ListVectors`,e,{headers:this.headers}),error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(ur(r))return{data:null,error:r};throw r}})}queryVectors(e){return Se(this,void 0,void 0,function*(){try{return{data:yield dr(this.fetch,`${this.url}/QueryVectors`,e,{headers:this.headers}),error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(ur(r))return{data:null,error:r};throw r}})}deleteVectors(e){return Se(this,void 0,void 0,function*(){try{if(e.keys.length<1||e.keys.length>500)throw new Error("Keys batch size must be between 1 and 500 items");return{data:(yield dr(this.fetch,`${this.url}/DeleteVectors`,e,{headers:this.headers}))||{},error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(ur(r))return{data:null,error:r};throw r}})}}class ak{constructor(e,r={},n){this.shouldThrowOnError=!1,this.url=e.replace(/\/$/,""),this.headers=Object.assign(Object.assign({},Yf),r),this.fetch=Xf(n)}throwOnError(){return this.shouldThrowOnError=!0,this}createBucket(e){return Se(this,void 0,void 0,function*(){try{return{data:(yield dr(this.fetch,`${this.url}/CreateVectorBucket`,{vectorBucketName:e},{headers:this.headers}))||{},error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(ur(r))return{data:null,error:r};throw r}})}getBucket(e){return Se(this,void 0,void 0,function*(){try{return{data:yield dr(this.fetch,`${this.url}/GetVectorBucket`,{vectorBucketName:e},{headers:this.headers}),error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(ur(r))return{data:null,error:r};throw r}})}listBuckets(){return Se(this,arguments,void 0,function*(e={}){try{return{data:yield dr(this.fetch,`${this.url}/ListVectorBuckets`,e,{headers:this.headers}),error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(ur(r))return{data:null,error:r};throw r}})}deleteBucket(e){return Se(this,void 0,void 0,function*(){try{return{data:(yield dr(this.fetch,`${this.url}/DeleteVectorBucket`,{vectorBucketName:e},{headers:this.headers}))||{},error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(ur(r))return{data:null,error:r};throw r}})}}class lk extends ak{constructor(e,r={}){super(e,r.headers||{},r.fetch)}from(e){return new ck(this.url,this.headers,e,this.fetch)}}class ck extends ok{constructor(e,r,n,i){super(e,r,i),this.vectorBucketName=n}createIndex(e){const r=Object.create(null,{createIndex:{get:()=>super.createIndex}});return Se(this,void 0,void 0,function*(){return r.createIndex.call(this,Object.assign(Object.assign({},e),{vectorBucketName:this.vectorBucketName}))})}listIndexes(){const e=Object.create(null,{listIndexes:{get:()=>super.listIndexes}});return Se(this,arguments,void 0,function*(r={}){return e.listIndexes.call(this,Object.assign(Object.assign({},r),{vectorBucketName:this.vectorBucketName}))})}getIndex(e){const r=Object.create(null,{getIndex:{get:()=>super.getIndex}});return Se(this,void 0,void 0,function*(){return r.getIndex.call(this,this.vectorBucketName,e)})}deleteIndex(e){const r=Object.create(null,{deleteIndex:{get:()=>super.deleteIndex}});return Se(this,void 0,void 0,function*(){return r.deleteIndex.call(this,this.vectorBucketName,e)})}index(e){return new uk(this.url,this.headers,this.vectorBucketName,e,this.fetch)}}class uk extends sk{constructor(e,r,n,i,o){super(e,r,o),this.vectorBucketName=n,this.indexName=i}putVectors(e){const r=Object.create(null,{putVectors:{get:()=>super.putVectors}});return Se(this,void 0,void 0,function*(){return r.putVectors.call(this,Object.assign(Object.assign({},e),{vectorBucketName:this.vectorBucketName,indexName:this.indexName}))})}getVectors(e){const r=Object.create(null,{getVectors:{get:()=>super.getVectors}});return Se(this,void 0,void 0,function*(){return r.getVectors.call(this,Object.assign(Object.assign({},e),{vectorBucketName:this.vectorBucketName,indexName:this.indexName}))})}listVectors(){const e=Object.create(null,{listVectors:{get:()=>super.listVectors}});return Se(this,arguments,void 0,function*(r={}){return e.listVectors.call(this,Object.assign(Object.assign({},r),{vectorBucketName:this.vectorBucketName,indexName:this.indexName}))})}queryVectors(e){const r=Object.create(null,{queryVectors:{get:()=>super.queryVectors}});return Se(this,void 0,void 0,function*(){return r.queryVectors.call(this,Object.assign(Object.assign({},e),{vectorBucketName:this.vectorBucketName,indexName:this.indexName}))})}deleteVectors(e){const r=Object.create(null,{deleteVectors:{get:()=>super.deleteVectors}});return Se(this,void 0,void 0,function*(){return r.deleteVectors.call(this,Object.assign(Object.assign({},e),{vectorBucketName:this.vectorBucketName,indexName:this.indexName}))})}}class dk extends JS{constructor(e,r={},n,i){super(e,r,n,i)}from(e){return new ZS(this.url,this.headers,e,this.fetch)}get vectors(){return new lk(this.url+"/vector",{headers:this.headers,fetch:this.fetch})}get analytics(){return new QS(this.url+"/iceberg",this.headers,this.fetch)}}const hk="2.79.0";let Js="";typeof Deno<"u"?Js="deno":typeof document<"u"?Js="web":typeof navigator<"u"&&navigator.product==="ReactNative"?Js="react-native":Js="node";const fk={"X-Client-Info":`supabase-js-${Js}/${hk}`},pk={headers:fk},mk={schema:"public"},gk={autoRefreshToken:!0,persistSession:!0,detectSessionInUrl:!0,flowType:"implicit"},vk={},yk=t=>t?(...e)=>t(...e):(...e)=>fetch(...e),bk=()=>Headers,xk=(t,e,r)=>{const n=yk(r),i=bk();return async(o,s)=>{var a;const c=(a=await e())!==null&&a!==void 0?a:t;let u=new i(s==null?void 0:s.headers);return u.has("apikey")||u.set("apikey",t),u.has("Authorization")||u.set("Authorization",`Bearer ${c}`),n(o,Object.assign(Object.assign({},s),{headers:u}))}};function wk(t){return t.endsWith("/")?t:t+"/"}function _k(t,e){var r,n;const{db:i,auth:o,realtime:s,global:a}=t,{db:c,auth:u,realtime:d,global:h}=e,f={db:Object.assign(Object.assign({},c),i),auth:Object.assign(Object.assign({},u),o),realtime:Object.assign(Object.assign({},d),s),storage:{},global:Object.assign(Object.assign(Object.assign({},h),a),{headers:Object.assign(Object.assign({},(r=h==null?void 0:h.headers)!==null&&r!==void 0?r:{}),(n=a==null?void 0:a.headers)!==null&&n!==void 0?n:{})}),accessToken:async()=>""};return t.accessToken?f.accessToken=t.accessToken:delete f.accessToken,f}function Sk(t){const e=t==null?void 0:t.trim();if(!e)throw new Error("supabaseUrl is required.");if(!e.match(/^https?:\/\//i))throw new Error("Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL.");try{return new URL(wk(e))}catch{throw Error("Invalid supabaseUrl: Provided URL is malformed.")}}const ew="2.79.0",fo=30*1e3,Rh=3,rd=Rh*fo,kk="http://localhost:9999",jk="supabase.auth.token",Ck={"X-Client-Info":`gotrue-js/${ew}`},Nh="X-Supabase-Api-Version",tw={"2024-01-01":{timestamp:Date.parse("2024-01-01T00:00:00.0Z"),name:"2024-01-01"}},Ek=/^([a-z0-9_-]{4})*($|[a-z0-9_-]{3}$|[a-z0-9_-]{2}$)$/i,Tk=10*60*1e3;class Aa extends Error{constructor(e,r,n){super(e),this.__isAuthError=!0,this.name="AuthError",this.status=r,this.code=n}}function Re(t){return typeof t=="object"&&t!==null&&"__isAuthError"in t}class Rk extends Aa{constructor(e,r,n){super(e,r,n),this.name="AuthApiError",this.status=r,this.code=n}}function Nk(t){return Re(t)&&t.name==="AuthApiError"}class Ei extends Aa{constructor(e,r){super(e),this.name="AuthUnknownError",this.originalError=r}}class si extends Aa{constructor(e,r,n,i){super(e,n,i),this.name=r,this.status=n}}class Pr extends si{constructor(){super("Auth session missing!","AuthSessionMissingError",400,void 0)}}function Pk(t){return Re(t)&&t.name==="AuthSessionMissingError"}class io extends si{constructor(){super("Auth session or user missing","AuthInvalidTokenResponseError",500,void 0)}}class Nl extends si{constructor(e){super(e,"AuthInvalidCredentialsError",400,void 0)}}class Pl extends si{constructor(e,r=null){super(e,"AuthImplicitGrantRedirectError",500,void 0),this.details=null,this.details=r}toJSON(){return{name:this.name,message:this.message,status:this.status,details:this.details}}}function Ok(t){return Re(t)&&t.name==="AuthImplicitGrantRedirectError"}class Sg extends si{constructor(e,r=null){super(e,"AuthPKCEGrantCodeExchangeError",500,void 0),this.details=null,this.details=r}toJSON(){return{name:this.name,message:this.message,status:this.status,details:this.details}}}class Ph extends si{constructor(e,r){super(e,"AuthRetryableFetchError",r,void 0)}}function nd(t){return Re(t)&&t.name==="AuthRetryableFetchError"}class kg extends si{constructor(e,r,n){super(e,"AuthWeakPasswordError",r,"weak_password"),this.reasons=n}}class Oh extends si{constructor(e){super(e,"AuthInvalidJwtError",400,"invalid_jwt")}}const jc="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".split(""),jg=` 	
\r=`.split(""),Ak=(()=>{const t=new Array(128);for(let e=0;e<t.length;e+=1)t[e]=-1;for(let e=0;e<jg.length;e+=1)t[jg[e].charCodeAt(0)]=-2;for(let e=0;e<jc.length;e+=1)t[jc[e].charCodeAt(0)]=e;return t})();function Cg(t,e,r){if(t!==null)for(e.queue=e.queue<<8|t,e.queuedBits+=8;e.queuedBits>=6;){const n=e.queue>>e.queuedBits-6&63;r(jc[n]),e.queuedBits-=6}else if(e.queuedBits>0)for(e.queue=e.queue<<6-e.queuedBits,e.queuedBits=6;e.queuedBits>=6;){const n=e.queue>>e.queuedBits-6&63;r(jc[n]),e.queuedBits-=6}}function rw(t,e,r){const n=Ak[t];if(n>-1)for(e.queue=e.queue<<6|n,e.queuedBits+=6;e.queuedBits>=8;)r(e.queue>>e.queuedBits-8&255),e.queuedBits-=8;else{if(n===-2)return;throw new Error(`Invalid Base64-URL character "${String.fromCharCode(t)}"`)}}function Eg(t){const e=[],r=s=>{e.push(String.fromCodePoint(s))},n={utf8seq:0,codepoint:0},i={queue:0,queuedBits:0},o=s=>{Mk(s,n,r)};for(let s=0;s<t.length;s+=1)rw(t.charCodeAt(s),i,o);return e.join("")}function $k(t,e){if(t<=127){e(t);return}else if(t<=2047){e(192|t>>6),e(128|t&63);return}else if(t<=65535){e(224|t>>12),e(128|t>>6&63),e(128|t&63);return}else if(t<=1114111){e(240|t>>18),e(128|t>>12&63),e(128|t>>6&63),e(128|t&63);return}throw new Error(`Unrecognized Unicode codepoint: ${t.toString(16)}`)}function Ik(t,e){for(let r=0;r<t.length;r+=1){let n=t.charCodeAt(r);if(n>55295&&n<=56319){const i=(n-55296)*1024&65535;n=(t.charCodeAt(r+1)-56320&65535|i)+65536,r+=1}$k(n,e)}}function Mk(t,e,r){if(e.utf8seq===0){if(t<=127){r(t);return}for(let n=1;n<6;n+=1)if(!(t>>7-n&1)){e.utf8seq=n;break}if(e.utf8seq===2)e.codepoint=t&31;else if(e.utf8seq===3)e.codepoint=t&15;else if(e.utf8seq===4)e.codepoint=t&7;else throw new Error("Invalid UTF-8 sequence");e.utf8seq-=1}else if(e.utf8seq>0){if(t<=127)throw new Error("Invalid UTF-8 sequence");e.codepoint=e.codepoint<<6|t&63,e.utf8seq-=1,e.utf8seq===0&&r(e.codepoint)}}function Zo(t){const e=[],r={queue:0,queuedBits:0},n=i=>{e.push(i)};for(let i=0;i<t.length;i+=1)rw(t.charCodeAt(i),r,n);return new Uint8Array(e)}function Lk(t){const e=[];return Ik(t,r=>e.push(r)),new Uint8Array(e)}function Pi(t){const e=[],r={queue:0,queuedBits:0},n=i=>{e.push(i)};return t.forEach(i=>Cg(i,r,n)),Cg(null,r,n),e.join("")}function Dk(t){return Math.round(Date.now()/1e3)+t}function zk(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(t){const e=Math.random()*16|0;return(t=="x"?e:e&3|8).toString(16)})}const Ht=()=>typeof window<"u"&&typeof document<"u",bi={tested:!1,writable:!1},nw=()=>{if(!Ht())return!1;try{if(typeof globalThis.localStorage!="object")return!1}catch{return!1}if(bi.tested)return bi.writable;const t=`lswt-${Math.random()}${Math.random()}`;try{globalThis.localStorage.setItem(t,t),globalThis.localStorage.removeItem(t),bi.tested=!0,bi.writable=!0}catch{bi.tested=!0,bi.writable=!1}return bi.writable};function Fk(t){const e={},r=new URL(t);if(r.hash&&r.hash[0]==="#")try{new URLSearchParams(r.hash.substring(1)).forEach((i,o)=>{e[o]=i})}catch{}return r.searchParams.forEach((n,i)=>{e[i]=n}),e}const iw=t=>t?(...e)=>t(...e):(...e)=>fetch(...e),Bk=t=>typeof t=="object"&&t!==null&&"status"in t&&"ok"in t&&"json"in t&&typeof t.json=="function",po=async(t,e,r)=>{await t.setItem(e,JSON.stringify(r))},xi=async(t,e)=>{const r=await t.getItem(e);if(!r)return null;try{return JSON.parse(r)}catch{return r}},In=async(t,e)=>{await t.removeItem(e)};class nu{constructor(){this.promise=new nu.promiseConstructor((e,r)=>{this.resolve=e,this.reject=r})}}nu.promiseConstructor=Promise;function id(t){const e=t.split(".");if(e.length!==3)throw new Oh("Invalid JWT structure");for(let n=0;n<e.length;n++)if(!Ek.test(e[n]))throw new Oh("JWT not in base64url format");return{header:JSON.parse(Eg(e[0])),payload:JSON.parse(Eg(e[1])),signature:Zo(e[2]),raw:{header:e[0],payload:e[1]}}}async function Uk(t){return await new Promise(e=>{setTimeout(()=>e(null),t)})}function Hk(t,e){return new Promise((n,i)=>{(async()=>{for(let o=0;o<1/0;o++)try{const s=await t(o);if(!e(o,null,s)){n(s);return}}catch(s){if(!e(o,s)){i(s);return}}})()})}function Wk(t){return("0"+t.toString(16)).substr(-2)}function Gk(){const e=new Uint32Array(56);if(typeof crypto>"u"){const r="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~",n=r.length;let i="";for(let o=0;o<56;o++)i+=r.charAt(Math.floor(Math.random()*n));return i}return crypto.getRandomValues(e),Array.from(e,Wk).join("")}async function Vk(t){const r=new TextEncoder().encode(t),n=await crypto.subtle.digest("SHA-256",r),i=new Uint8Array(n);return Array.from(i).map(o=>String.fromCharCode(o)).join("")}async function qk(t){if(!(typeof crypto<"u"&&typeof crypto.subtle<"u"&&typeof TextEncoder<"u"))return console.warn("WebCrypto API is not supported. Code challenge method will default to use plain instead of sha256."),t;const r=await Vk(t);return btoa(r).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}async function oo(t,e,r=!1){const n=Gk();let i=n;r&&(i+="/PASSWORD_RECOVERY"),await po(t,`${e}-code-verifier`,i);const o=await qk(n);return[o,n===o?"plain":"s256"]}const Kk=/^2[0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/i;function Yk(t){const e=t.headers.get(Nh);if(!e||!e.match(Kk))return null;try{return new Date(`${e}T00:00:00.0Z`)}catch{return null}}function Xk(t){if(!t)throw new Error("Missing exp claim");const e=Math.floor(Date.now()/1e3);if(t<=e)throw new Error("JWT has expired")}function Zk(t){switch(t){case"RS256":return{name:"RSASSA-PKCS1-v1_5",hash:{name:"SHA-256"}};case"ES256":return{name:"ECDSA",namedCurve:"P-256",hash:{name:"SHA-256"}};default:throw new Error("Invalid alg claim")}}const Jk=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;function so(t){if(!Jk.test(t))throw new Error("@supabase/auth-js: Expected parameter to be UUID but is not")}function od(){const t={};return new Proxy(t,{get:(e,r)=>{if(r==="__isUserNotAvailableProxy")return!0;if(typeof r=="symbol"){const n=r.toString();if(n==="Symbol(Symbol.toPrimitive)"||n==="Symbol(Symbol.toStringTag)"||n==="Symbol(util.inspect.custom)")return}throw new Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Accessing the "${r}" property of the session object is not supported. Please use getUser() instead.`)},set:(e,r)=>{throw new Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Setting the "${r}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`)},deleteProperty:(e,r)=>{throw new Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Deleting the "${r}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`)}})}function Qk(t,e){return new Proxy(t,{get:(r,n,i)=>{if(n==="__isInsecureUserWarningProxy")return!0;if(typeof n=="symbol"){const o=n.toString();if(o==="Symbol(Symbol.toPrimitive)"||o==="Symbol(Symbol.toStringTag)"||o==="Symbol(util.inspect.custom)"||o==="Symbol(nodejs.util.inspect.custom)")return Reflect.get(r,n,i)}return!e.value&&typeof n=="string"&&(console.warn("Using the user object as returned from supabase.auth.getSession() or from some supabase.auth.onAuthStateChange() events could be insecure! This value comes directly from the storage medium (usually cookies on the server) and may not be authentic. Use supabase.auth.getUser() instead which authenticates the data by contacting the Supabase Auth server."),e.value=!0),Reflect.get(r,n,i)}})}function Tg(t){return JSON.parse(JSON.stringify(t))}const ki=t=>t.msg||t.message||t.error_description||t.error||JSON.stringify(t),ej=[502,503,504];async function Rg(t){var e;if(!Bk(t))throw new Ph(ki(t),0);if(ej.includes(t.status))throw new Ph(ki(t),t.status);let r;try{r=await t.json()}catch(o){throw new Ei(ki(o),o)}let n;const i=Yk(t);if(i&&i.getTime()>=tw["2024-01-01"].timestamp&&typeof r=="object"&&r&&typeof r.code=="string"?n=r.code:typeof r=="object"&&r&&typeof r.error_code=="string"&&(n=r.error_code),n){if(n==="weak_password")throw new kg(ki(r),t.status,((e=r.weak_password)===null||e===void 0?void 0:e.reasons)||[]);if(n==="session_not_found")throw new Pr}else if(typeof r=="object"&&r&&typeof r.weak_password=="object"&&r.weak_password&&Array.isArray(r.weak_password.reasons)&&r.weak_password.reasons.length&&r.weak_password.reasons.reduce((o,s)=>o&&typeof s=="string",!0))throw new kg(ki(r),t.status,r.weak_password.reasons);throw new Rk(ki(r),t.status||500,n)}const tj=(t,e,r,n)=>{const i={method:t,headers:(e==null?void 0:e.headers)||{}};return t==="GET"?i:(i.headers=Object.assign({"Content-Type":"application/json;charset=UTF-8"},e==null?void 0:e.headers),i.body=JSON.stringify(n),Object.assign(Object.assign({},i),r))};async function Oe(t,e,r,n){var i;const o=Object.assign({},n==null?void 0:n.headers);o[Nh]||(o[Nh]=tw["2024-01-01"].name),n!=null&&n.jwt&&(o.Authorization=`Bearer ${n.jwt}`);const s=(i=n==null?void 0:n.query)!==null&&i!==void 0?i:{};n!=null&&n.redirectTo&&(s.redirect_to=n.redirectTo);const a=Object.keys(s).length?"?"+new URLSearchParams(s).toString():"",c=await rj(t,e,r+a,{headers:o,noResolveJson:n==null?void 0:n.noResolveJson},{},n==null?void 0:n.body);return n!=null&&n.xform?n==null?void 0:n.xform(c):{data:Object.assign({},c),error:null}}async function rj(t,e,r,n,i,o){const s=tj(e,n,i,o);let a;try{a=await t(r,Object.assign({},s))}catch(c){throw console.error(c),new Ph(ki(c),0)}if(a.ok||await Rg(a),n!=null&&n.noResolveJson)return a;try{return await a.json()}catch(c){await Rg(c)}}function Or(t){var e;let r=null;oj(t)&&(r=Object.assign({},t),t.expires_at||(r.expires_at=Dk(t.expires_in)));const n=(e=t.user)!==null&&e!==void 0?e:t;return{data:{session:r,user:n},error:null}}function Ng(t){const e=Or(t);return!e.error&&t.weak_password&&typeof t.weak_password=="object"&&Array.isArray(t.weak_password.reasons)&&t.weak_password.reasons.length&&t.weak_password.message&&typeof t.weak_password.message=="string"&&t.weak_password.reasons.reduce((r,n)=>r&&typeof n=="string",!0)&&(e.data.weak_password=t.weak_password),e}function Bn(t){var e;return{data:{user:(e=t.user)!==null&&e!==void 0?e:t},error:null}}function nj(t){return{data:t,error:null}}function ij(t){const{action_link:e,email_otp:r,hashed_token:n,redirect_to:i,verification_type:o}=t,s=cs(t,["action_link","email_otp","hashed_token","redirect_to","verification_type"]),a={action_link:e,email_otp:r,hashed_token:n,redirect_to:i,verification_type:o},c=Object.assign({},s);return{data:{properties:a,user:c},error:null}}function Pg(t){return t}function oj(t){return t.access_token&&t.refresh_token&&t.expires_in}const sd=["global","local","others"];class sj{constructor({url:e="",headers:r={},fetch:n}){this.url=e,this.headers=r,this.fetch=iw(n),this.mfa={listFactors:this._listFactors.bind(this),deleteFactor:this._deleteFactor.bind(this)},this.oauth={listClients:this._listOAuthClients.bind(this),createClient:this._createOAuthClient.bind(this),getClient:this._getOAuthClient.bind(this),updateClient:this._updateOAuthClient.bind(this),deleteClient:this._deleteOAuthClient.bind(this),regenerateClientSecret:this._regenerateOAuthClientSecret.bind(this)}}async signOut(e,r=sd[0]){if(sd.indexOf(r)<0)throw new Error(`@supabase/auth-js: Parameter scope must be one of ${sd.join(", ")}`);try{return await Oe(this.fetch,"POST",`${this.url}/logout?scope=${r}`,{headers:this.headers,jwt:e,noResolveJson:!0}),{data:null,error:null}}catch(n){if(Re(n))return{data:null,error:n};throw n}}async inviteUserByEmail(e,r={}){try{return await Oe(this.fetch,"POST",`${this.url}/invite`,{body:{email:e,data:r.data},headers:this.headers,redirectTo:r.redirectTo,xform:Bn})}catch(n){if(Re(n))return{data:{user:null},error:n};throw n}}async generateLink(e){try{const{options:r}=e,n=cs(e,["options"]),i=Object.assign(Object.assign({},n),r);return"newEmail"in n&&(i.new_email=n==null?void 0:n.newEmail,delete i.newEmail),await Oe(this.fetch,"POST",`${this.url}/admin/generate_link`,{body:i,headers:this.headers,xform:ij,redirectTo:r==null?void 0:r.redirectTo})}catch(r){if(Re(r))return{data:{properties:null,user:null},error:r};throw r}}async createUser(e){try{return await Oe(this.fetch,"POST",`${this.url}/admin/users`,{body:e,headers:this.headers,xform:Bn})}catch(r){if(Re(r))return{data:{user:null},error:r};throw r}}async listUsers(e){var r,n,i,o,s,a,c;try{const u={nextPage:null,lastPage:0,total:0},d=await Oe(this.fetch,"GET",`${this.url}/admin/users`,{headers:this.headers,noResolveJson:!0,query:{page:(n=(r=e==null?void 0:e.page)===null||r===void 0?void 0:r.toString())!==null&&n!==void 0?n:"",per_page:(o=(i=e==null?void 0:e.perPage)===null||i===void 0?void 0:i.toString())!==null&&o!==void 0?o:""},xform:Pg});if(d.error)throw d.error;const h=await d.json(),f=(s=d.headers.get("x-total-count"))!==null&&s!==void 0?s:0,p=(c=(a=d.headers.get("link"))===null||a===void 0?void 0:a.split(","))!==null&&c!==void 0?c:[];return p.length>0&&(p.forEach(g=>{const m=parseInt(g.split(";")[0].split("=")[1].substring(0,1)),b=JSON.parse(g.split(";")[1].split("=")[1]);u[`${b}Page`]=m}),u.total=parseInt(f)),{data:Object.assign(Object.assign({},h),u),error:null}}catch(u){if(Re(u))return{data:{users:[]},error:u};throw u}}async getUserById(e){so(e);try{return await Oe(this.fetch,"GET",`${this.url}/admin/users/${e}`,{headers:this.headers,xform:Bn})}catch(r){if(Re(r))return{data:{user:null},error:r};throw r}}async updateUserById(e,r){so(e);try{return await Oe(this.fetch,"PUT",`${this.url}/admin/users/${e}`,{body:r,headers:this.headers,xform:Bn})}catch(n){if(Re(n))return{data:{user:null},error:n};throw n}}async deleteUser(e,r=!1){so(e);try{return await Oe(this.fetch,"DELETE",`${this.url}/admin/users/${e}`,{headers:this.headers,body:{should_soft_delete:r},xform:Bn})}catch(n){if(Re(n))return{data:{user:null},error:n};throw n}}async _listFactors(e){so(e.userId);try{const{data:r,error:n}=await Oe(this.fetch,"GET",`${this.url}/admin/users/${e.userId}/factors`,{headers:this.headers,xform:i=>({data:{factors:i},error:null})});return{data:r,error:n}}catch(r){if(Re(r))return{data:null,error:r};throw r}}async _deleteFactor(e){so(e.userId),so(e.id);try{return{data:await Oe(this.fetch,"DELETE",`${this.url}/admin/users/${e.userId}/factors/${e.id}`,{headers:this.headers}),error:null}}catch(r){if(Re(r))return{data:null,error:r};throw r}}async _listOAuthClients(e){var r,n,i,o,s,a,c;try{const u={nextPage:null,lastPage:0,total:0},d=await Oe(this.fetch,"GET",`${this.url}/admin/oauth/clients`,{headers:this.headers,noResolveJson:!0,query:{page:(n=(r=e==null?void 0:e.page)===null||r===void 0?void 0:r.toString())!==null&&n!==void 0?n:"",per_page:(o=(i=e==null?void 0:e.perPage)===null||i===void 0?void 0:i.toString())!==null&&o!==void 0?o:""},xform:Pg});if(d.error)throw d.error;const h=await d.json(),f=(s=d.headers.get("x-total-count"))!==null&&s!==void 0?s:0,p=(c=(a=d.headers.get("link"))===null||a===void 0?void 0:a.split(","))!==null&&c!==void 0?c:[];return p.length>0&&(p.forEach(g=>{const m=parseInt(g.split(";")[0].split("=")[1].substring(0,1)),b=JSON.parse(g.split(";")[1].split("=")[1]);u[`${b}Page`]=m}),u.total=parseInt(f)),{data:Object.assign(Object.assign({},h),u),error:null}}catch(u){if(Re(u))return{data:{clients:[]},error:u};throw u}}async _createOAuthClient(e){try{return await Oe(this.fetch,"POST",`${this.url}/admin/oauth/clients`,{body:e,headers:this.headers,xform:r=>({data:r,error:null})})}catch(r){if(Re(r))return{data:null,error:r};throw r}}async _getOAuthClient(e){try{return await Oe(this.fetch,"GET",`${this.url}/admin/oauth/clients/${e}`,{headers:this.headers,xform:r=>({data:r,error:null})})}catch(r){if(Re(r))return{data:null,error:r};throw r}}async _updateOAuthClient(e,r){try{return await Oe(this.fetch,"PUT",`${this.url}/admin/oauth/clients/${e}`,{body:r,headers:this.headers,xform:n=>({data:n,error:null})})}catch(n){if(Re(n))return{data:null,error:n};throw n}}async _deleteOAuthClient(e){try{return await Oe(this.fetch,"DELETE",`${this.url}/admin/oauth/clients/${e}`,{headers:this.headers,noResolveJson:!0}),{data:null,error:null}}catch(r){if(Re(r))return{data:null,error:r};throw r}}async _regenerateOAuthClientSecret(e){try{return await Oe(this.fetch,"POST",`${this.url}/admin/oauth/clients/${e}/regenerate_secret`,{headers:this.headers,xform:r=>({data:r,error:null})})}catch(r){if(Re(r))return{data:null,error:r};throw r}}}function Og(t={}){return{getItem:e=>t[e]||null,setItem:(e,r)=>{t[e]=r},removeItem:e=>{delete t[e]}}}const ao={debug:!!(globalThis&&nw()&&globalThis.localStorage&&globalThis.localStorage.getItem("supabase.gotrue-js.locks.debug")==="true")};class ow extends Error{constructor(e){super(e),this.isAcquireTimeout=!0}}class aj extends ow{}async function lj(t,e,r){ao.debug&&console.log("@supabase/gotrue-js: navigatorLock: acquire lock",t,e);const n=new globalThis.AbortController;return e>0&&setTimeout(()=>{n.abort(),ao.debug&&console.log("@supabase/gotrue-js: navigatorLock acquire timed out",t)},e),await Promise.resolve().then(()=>globalThis.navigator.locks.request(t,e===0?{mode:"exclusive",ifAvailable:!0}:{mode:"exclusive",signal:n.signal},async i=>{if(i){ao.debug&&console.log("@supabase/gotrue-js: navigatorLock: acquired",t,i.name);try{return await r()}finally{ao.debug&&console.log("@supabase/gotrue-js: navigatorLock: released",t,i.name)}}else{if(e===0)throw ao.debug&&console.log("@supabase/gotrue-js: navigatorLock: not immediately available",t),new aj(`Acquiring an exclusive Navigator LockManager lock "${t}" immediately failed`);if(ao.debug)try{const o=await globalThis.navigator.locks.query();console.log("@supabase/gotrue-js: Navigator LockManager state",JSON.stringify(o,null,"  "))}catch(o){console.warn("@supabase/gotrue-js: Error when querying Navigator LockManager state",o)}return console.warn("@supabase/gotrue-js: Navigator LockManager returned a null lock when using #request without ifAvailable set to true, it appears this browser is not following the LockManager spec https://developer.mozilla.org/en-US/docs/Web/API/LockManager/request"),await r()}}))}function cj(){if(typeof globalThis!="object")try{Object.defineProperty(Object.prototype,"__magic__",{get:function(){return this},configurable:!0}),__magic__.globalThis=__magic__,delete Object.prototype.__magic__}catch{typeof self<"u"&&(self.globalThis=self)}}function sw(t){if(!/^0x[a-fA-F0-9]{40}$/.test(t))throw new Error(`@supabase/auth-js: Address "${t}" is invalid.`);return t.toLowerCase()}function uj(t){return parseInt(t,16)}function dj(t){const e=new TextEncoder().encode(t);return"0x"+Array.from(e,n=>n.toString(16).padStart(2,"0")).join("")}function hj(t){var e;const{chainId:r,domain:n,expirationTime:i,issuedAt:o=new Date,nonce:s,notBefore:a,requestId:c,resources:u,scheme:d,uri:h,version:f}=t;{if(!Number.isInteger(r))throw new Error(`@supabase/auth-js: Invalid SIWE message field "chainId". Chain ID must be a EIP-155 chain ID. Provided value: ${r}`);if(!n)throw new Error('@supabase/auth-js: Invalid SIWE message field "domain". Domain must be provided.');if(s&&s.length<8)throw new Error(`@supabase/auth-js: Invalid SIWE message field "nonce". Nonce must be at least 8 characters. Provided value: ${s}`);if(!h)throw new Error('@supabase/auth-js: Invalid SIWE message field "uri". URI must be provided.');if(f!=="1")throw new Error(`@supabase/auth-js: Invalid SIWE message field "version". Version must be '1'. Provided value: ${f}`);if(!((e=t.statement)===null||e===void 0)&&e.includes(`
`))throw new Error(`@supabase/auth-js: Invalid SIWE message field "statement". Statement must not include '\\n'. Provided value: ${t.statement}`)}const p=sw(t.address),g=d?`${d}://${n}`:n,m=t.statement?`${t.statement}
`:"",b=`${g} wants you to sign in with your Ethereum account:
${p}

${m}`;let v=`URI: ${h}
Version: ${f}
Chain ID: ${r}${s?`
Nonce: ${s}`:""}
Issued At: ${o.toISOString()}`;if(i&&(v+=`
Expiration Time: ${i.toISOString()}`),a&&(v+=`
Not Before: ${a.toISOString()}`),c&&(v+=`
Request ID: ${c}`),u){let y=`
Resources:`;for(const x of u){if(!x||typeof x!="string")throw new Error(`@supabase/auth-js: Invalid SIWE message field "resources". Every resource must be a valid string. Provided value: ${x}`);y+=`
- ${x}`}v+=y}return`${b}
${v}`}class jt extends Error{constructor({message:e,code:r,cause:n,name:i}){var o;super(e,{cause:n}),this.__isWebAuthnError=!0,this.name=(o=i??(n instanceof Error?n.name:void 0))!==null&&o!==void 0?o:"Unknown Error",this.code=r}}class Cc extends jt{constructor(e,r){super({code:"ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",cause:r,message:e}),this.name="WebAuthnUnknownError",this.originalError=r}}function fj({error:t,options:e}){var r,n,i;const{publicKey:o}=e;if(!o)throw Error("options was missing required publicKey property");if(t.name==="AbortError"){if(e.signal instanceof AbortSignal)return new jt({message:"Registration ceremony was sent an abort signal",code:"ERROR_CEREMONY_ABORTED",cause:t})}else if(t.name==="ConstraintError"){if(((r=o.authenticatorSelection)===null||r===void 0?void 0:r.requireResidentKey)===!0)return new jt({message:"Discoverable credentials were required but no available authenticator supported it",code:"ERROR_AUTHENTICATOR_MISSING_DISCOVERABLE_CREDENTIAL_SUPPORT",cause:t});if(e.mediation==="conditional"&&((n=o.authenticatorSelection)===null||n===void 0?void 0:n.userVerification)==="required")return new jt({message:"User verification was required during automatic registration but it could not be performed",code:"ERROR_AUTO_REGISTER_USER_VERIFICATION_FAILURE",cause:t});if(((i=o.authenticatorSelection)===null||i===void 0?void 0:i.userVerification)==="required")return new jt({message:"User verification was required but no available authenticator supported it",code:"ERROR_AUTHENTICATOR_MISSING_USER_VERIFICATION_SUPPORT",cause:t})}else{if(t.name==="InvalidStateError")return new jt({message:"The authenticator was previously registered",code:"ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED",cause:t});if(t.name==="NotAllowedError")return new jt({message:t.message,code:"ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",cause:t});if(t.name==="NotSupportedError")return o.pubKeyCredParams.filter(a=>a.type==="public-key").length===0?new jt({message:'No entry in pubKeyCredParams was of type "public-key"',code:"ERROR_MALFORMED_PUBKEYCREDPARAMS",cause:t}):new jt({message:"No available authenticator supported any of the specified pubKeyCredParams algorithms",code:"ERROR_AUTHENTICATOR_NO_SUPPORTED_PUBKEYCREDPARAMS_ALG",cause:t});if(t.name==="SecurityError"){const s=window.location.hostname;if(aw(s)){if(o.rp.id!==s)return new jt({message:`The RP ID "${o.rp.id}" is invalid for this domain`,code:"ERROR_INVALID_RP_ID",cause:t})}else return new jt({message:`${window.location.hostname} is an invalid domain`,code:"ERROR_INVALID_DOMAIN",cause:t})}else if(t.name==="TypeError"){if(o.user.id.byteLength<1||o.user.id.byteLength>64)return new jt({message:"User ID was not between 1 and 64 characters",code:"ERROR_INVALID_USER_ID_LENGTH",cause:t})}else if(t.name==="UnknownError")return new jt({message:"The authenticator was unable to process the specified options, or could not create a new credential",code:"ERROR_AUTHENTICATOR_GENERAL_ERROR",cause:t})}return new jt({message:"a Non-Webauthn related error has occurred",code:"ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",cause:t})}function pj({error:t,options:e}){const{publicKey:r}=e;if(!r)throw Error("options was missing required publicKey property");if(t.name==="AbortError"){if(e.signal instanceof AbortSignal)return new jt({message:"Authentication ceremony was sent an abort signal",code:"ERROR_CEREMONY_ABORTED",cause:t})}else{if(t.name==="NotAllowedError")return new jt({message:t.message,code:"ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",cause:t});if(t.name==="SecurityError"){const n=window.location.hostname;if(aw(n)){if(r.rpId!==n)return new jt({message:`The RP ID "${r.rpId}" is invalid for this domain`,code:"ERROR_INVALID_RP_ID",cause:t})}else return new jt({message:`${window.location.hostname} is an invalid domain`,code:"ERROR_INVALID_DOMAIN",cause:t})}else if(t.name==="UnknownError")return new jt({message:"The authenticator was unable to process the specified options, or could not create a new assertion signature",code:"ERROR_AUTHENTICATOR_GENERAL_ERROR",cause:t})}return new jt({message:"a Non-Webauthn related error has occurred",code:"ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",cause:t})}class mj{createNewAbortSignal(){if(this.controller){const r=new Error("Cancelling existing WebAuthn API call for new one");r.name="AbortError",this.controller.abort(r)}const e=new AbortController;return this.controller=e,e.signal}cancelCeremony(){if(this.controller){const e=new Error("Manually cancelling existing WebAuthn API call");e.name="AbortError",this.controller.abort(e),this.controller=void 0}}}const gj=new mj;function vj(t){if(!t)throw new Error("Credential creation options are required");if(typeof PublicKeyCredential<"u"&&"parseCreationOptionsFromJSON"in PublicKeyCredential&&typeof PublicKeyCredential.parseCreationOptionsFromJSON=="function")return PublicKeyCredential.parseCreationOptionsFromJSON(t);const{challenge:e,user:r,excludeCredentials:n}=t,i=cs(t,["challenge","user","excludeCredentials"]),o=Zo(e).buffer,s=Object.assign(Object.assign({},r),{id:Zo(r.id).buffer}),a=Object.assign(Object.assign({},i),{challenge:o,user:s});if(n&&n.length>0){a.excludeCredentials=new Array(n.length);for(let c=0;c<n.length;c++){const u=n[c];a.excludeCredentials[c]=Object.assign(Object.assign({},u),{id:Zo(u.id).buffer,type:u.type||"public-key",transports:u.transports})}}return a}function yj(t){if(!t)throw new Error("Credential request options are required");if(typeof PublicKeyCredential<"u"&&"parseRequestOptionsFromJSON"in PublicKeyCredential&&typeof PublicKeyCredential.parseRequestOptionsFromJSON=="function")return PublicKeyCredential.parseRequestOptionsFromJSON(t);const{challenge:e,allowCredentials:r}=t,n=cs(t,["challenge","allowCredentials"]),i=Zo(e).buffer,o=Object.assign(Object.assign({},n),{challenge:i});if(r&&r.length>0){o.allowCredentials=new Array(r.length);for(let s=0;s<r.length;s++){const a=r[s];o.allowCredentials[s]=Object.assign(Object.assign({},a),{id:Zo(a.id).buffer,type:a.type||"public-key",transports:a.transports})}}return o}function bj(t){var e;if("toJSON"in t&&typeof t.toJSON=="function")return t.toJSON();const r=t;return{id:t.id,rawId:t.id,response:{attestationObject:Pi(new Uint8Array(t.response.attestationObject)),clientDataJSON:Pi(new Uint8Array(t.response.clientDataJSON))},type:"public-key",clientExtensionResults:t.getClientExtensionResults(),authenticatorAttachment:(e=r.authenticatorAttachment)!==null&&e!==void 0?e:void 0}}function xj(t){var e;if("toJSON"in t&&typeof t.toJSON=="function")return t.toJSON();const r=t,n=t.getClientExtensionResults(),i=t.response;return{id:t.id,rawId:t.id,response:{authenticatorData:Pi(new Uint8Array(i.authenticatorData)),clientDataJSON:Pi(new Uint8Array(i.clientDataJSON)),signature:Pi(new Uint8Array(i.signature)),userHandle:i.userHandle?Pi(new Uint8Array(i.userHandle)):void 0},type:"public-key",clientExtensionResults:n,authenticatorAttachment:(e=r.authenticatorAttachment)!==null&&e!==void 0?e:void 0}}function aw(t){return t==="localhost"||/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i.test(t)}function Ag(){var t,e;return!!(Ht()&&"PublicKeyCredential"in window&&window.PublicKeyCredential&&"credentials"in navigator&&typeof((t=navigator==null?void 0:navigator.credentials)===null||t===void 0?void 0:t.create)=="function"&&typeof((e=navigator==null?void 0:navigator.credentials)===null||e===void 0?void 0:e.get)=="function")}async function wj(t){try{const e=await navigator.credentials.create(t);return e?e instanceof PublicKeyCredential?{data:e,error:null}:{data:null,error:new Cc("Browser returned unexpected credential type",e)}:{data:null,error:new Cc("Empty credential response",e)}}catch(e){return{data:null,error:fj({error:e,options:t})}}}async function _j(t){try{const e=await navigator.credentials.get(t);return e?e instanceof PublicKeyCredential?{data:e,error:null}:{data:null,error:new Cc("Browser returned unexpected credential type",e)}:{data:null,error:new Cc("Empty credential response",e)}}catch(e){return{data:null,error:pj({error:e,options:t})}}}const Sj={hints:["security-key"],authenticatorSelection:{authenticatorAttachment:"cross-platform",requireResidentKey:!1,userVerification:"preferred",residentKey:"discouraged"},attestation:"none"},kj={userVerification:"preferred",hints:["security-key"]};function Ec(...t){const e=i=>i!==null&&typeof i=="object"&&!Array.isArray(i),r=i=>i instanceof ArrayBuffer||ArrayBuffer.isView(i),n={};for(const i of t)if(i)for(const o in i){const s=i[o];if(s!==void 0)if(Array.isArray(s))n[o]=s;else if(r(s))n[o]=s;else if(e(s)){const a=n[o];e(a)?n[o]=Ec(a,s):n[o]=Ec(s)}else n[o]=s}return n}function jj(t,e){return Ec(Sj,t,e||{})}function Cj(t,e){return Ec(kj,t,e||{})}class Ej{constructor(e){this.client=e,this.enroll=this._enroll.bind(this),this.challenge=this._challenge.bind(this),this.verify=this._verify.bind(this),this.authenticate=this._authenticate.bind(this),this.register=this._register.bind(this)}async _enroll(e){return this.client.mfa.enroll(Object.assign(Object.assign({},e),{factorType:"webauthn"}))}async _challenge({factorId:e,webauthn:r,friendlyName:n,signal:i},o){try{const{data:s,error:a}=await this.client.mfa.challenge({factorId:e,webauthn:r});if(!s)return{data:null,error:a};const c=i??gj.createNewAbortSignal();if(s.webauthn.type==="create"){const{user:u}=s.webauthn.credential_options.publicKey;u.name||(u.name=`${u.id}:${n}`),u.displayName||(u.displayName=u.name)}switch(s.webauthn.type){case"create":{const u=jj(s.webauthn.credential_options.publicKey,o==null?void 0:o.create),{data:d,error:h}=await wj({publicKey:u,signal:c});return d?{data:{factorId:e,challengeId:s.id,webauthn:{type:s.webauthn.type,credential_response:d}},error:null}:{data:null,error:h}}case"request":{const u=Cj(s.webauthn.credential_options.publicKey,o==null?void 0:o.request),{data:d,error:h}=await _j(Object.assign(Object.assign({},s.webauthn.credential_options),{publicKey:u,signal:c}));return d?{data:{factorId:e,challengeId:s.id,webauthn:{type:s.webauthn.type,credential_response:d}},error:null}:{data:null,error:h}}}}catch(s){return Re(s)?{data:null,error:s}:{data:null,error:new Ei("Unexpected error in challenge",s)}}}async _verify({challengeId:e,factorId:r,webauthn:n}){return this.client.mfa.verify({factorId:r,challengeId:e,webauthn:n})}async _authenticate({factorId:e,webauthn:{rpId:r=typeof window<"u"?window.location.hostname:void 0,rpOrigins:n=typeof window<"u"?[window.location.origin]:void 0,signal:i}},o){if(!r)return{data:null,error:new Aa("rpId is required for WebAuthn authentication")};try{if(!Ag())return{data:null,error:new Ei("Browser does not support WebAuthn",null)};const{data:s,error:a}=await this.challenge({factorId:e,webauthn:{rpId:r,rpOrigins:n},signal:i},{request:o});if(!s)return{data:null,error:a};const{webauthn:c}=s;return this._verify({factorId:e,challengeId:s.challengeId,webauthn:{type:c.type,rpId:r,rpOrigins:n,credential_response:c.credential_response}})}catch(s){return Re(s)?{data:null,error:s}:{data:null,error:new Ei("Unexpected error in authenticate",s)}}}async _register({friendlyName:e,rpId:r=typeof window<"u"?window.location.hostname:void 0,rpOrigins:n=typeof window<"u"?[window.location.origin]:void 0,signal:i},o){if(!r)return{data:null,error:new Aa("rpId is required for WebAuthn registration")};try{if(!Ag())return{data:null,error:new Ei("Browser does not support WebAuthn",null)};const{data:s,error:a}=await this._enroll({friendlyName:e});if(!s)return await this.client.mfa.listFactors().then(d=>{var h;return(h=d.data)===null||h===void 0?void 0:h.all.find(f=>f.factor_type==="webauthn"&&f.friendly_name===e&&f.status!=="unverified")}).then(d=>d?this.client.mfa.unenroll({factorId:d==null?void 0:d.id}):void 0),{data:null,error:a};const{data:c,error:u}=await this._challenge({factorId:s.id,friendlyName:s.friendly_name,webauthn:{rpId:r,rpOrigins:n},signal:i},{create:o});return c?this._verify({factorId:s.id,challengeId:c.challengeId,webauthn:{rpId:r,rpOrigins:n,type:c.webauthn.type,credential_response:c.webauthn.credential_response}}):{data:null,error:u}}catch(s){return Re(s)?{data:null,error:s}:{data:null,error:new Ei("Unexpected error in register",s)}}}}cj();const Tj={url:kk,storageKey:jk,autoRefreshToken:!0,persistSession:!0,detectSessionInUrl:!0,headers:Ck,flowType:"implicit",debug:!1,hasCustomAuthorizationHeader:!1,throwOnError:!1};async function $g(t,e,r){return await r()}const lo={};class $a{get jwks(){var e,r;return(r=(e=lo[this.storageKey])===null||e===void 0?void 0:e.jwks)!==null&&r!==void 0?r:{keys:[]}}set jwks(e){lo[this.storageKey]=Object.assign(Object.assign({},lo[this.storageKey]),{jwks:e})}get jwks_cached_at(){var e,r;return(r=(e=lo[this.storageKey])===null||e===void 0?void 0:e.cachedAt)!==null&&r!==void 0?r:Number.MIN_SAFE_INTEGER}set jwks_cached_at(e){lo[this.storageKey]=Object.assign(Object.assign({},lo[this.storageKey]),{cachedAt:e})}constructor(e){var r,n;this.userStorage=null,this.memoryStorage=null,this.stateChangeEmitters=new Map,this.autoRefreshTicker=null,this.visibilityChangedCallback=null,this.refreshingDeferred=null,this.initializePromise=null,this.detectSessionInUrl=!0,this.hasCustomAuthorizationHeader=!1,this.suppressGetSessionWarning=!1,this.lockAcquired=!1,this.pendingInLock=[],this.broadcastChannel=null,this.logger=console.log,this.instanceID=$a.nextInstanceID,$a.nextInstanceID+=1,this.instanceID>0&&Ht()&&console.warn("Multiple GoTrueClient instances detected in the same browser context. It is not an error, but this should be avoided as it may produce undefined behavior when used concurrently under the same storage key.");const i=Object.assign(Object.assign({},Tj),e);if(this.logDebugMessages=!!i.debug,typeof i.debug=="function"&&(this.logger=i.debug),this.persistSession=i.persistSession,this.storageKey=i.storageKey,this.autoRefreshToken=i.autoRefreshToken,this.admin=new sj({url:i.url,headers:i.headers,fetch:i.fetch}),this.url=i.url,this.headers=i.headers,this.fetch=iw(i.fetch),this.lock=i.lock||$g,this.detectSessionInUrl=i.detectSessionInUrl,this.flowType=i.flowType,this.hasCustomAuthorizationHeader=i.hasCustomAuthorizationHeader,this.throwOnError=i.throwOnError,i.lock?this.lock=i.lock:Ht()&&(!((r=globalThis==null?void 0:globalThis.navigator)===null||r===void 0)&&r.locks)?this.lock=lj:this.lock=$g,this.jwks||(this.jwks={keys:[]},this.jwks_cached_at=Number.MIN_SAFE_INTEGER),this.mfa={verify:this._verify.bind(this),enroll:this._enroll.bind(this),unenroll:this._unenroll.bind(this),challenge:this._challenge.bind(this),listFactors:this._listFactors.bind(this),challengeAndVerify:this._challengeAndVerify.bind(this),getAuthenticatorAssuranceLevel:this._getAuthenticatorAssuranceLevel.bind(this),webauthn:new Ej(this)},this.oauth={getAuthorizationDetails:this._getAuthorizationDetails.bind(this),approveAuthorization:this._approveAuthorization.bind(this),denyAuthorization:this._denyAuthorization.bind(this)},this.persistSession?(i.storage?this.storage=i.storage:nw()?this.storage=globalThis.localStorage:(this.memoryStorage={},this.storage=Og(this.memoryStorage)),i.userStorage&&(this.userStorage=i.userStorage)):(this.memoryStorage={},this.storage=Og(this.memoryStorage)),Ht()&&globalThis.BroadcastChannel&&this.persistSession&&this.storageKey){try{this.broadcastChannel=new globalThis.BroadcastChannel(this.storageKey)}catch(o){console.error("Failed to create a new BroadcastChannel, multi-tab state changes will not be available",o)}(n=this.broadcastChannel)===null||n===void 0||n.addEventListener("message",async o=>{this._debug("received broadcast notification from other tab or client",o),await this._notifyAllSubscribers(o.data.event,o.data.session,!1)})}this.initialize()}isThrowOnErrorEnabled(){return this.throwOnError}_returnResult(e){if(this.throwOnError&&e&&e.error)throw e.error;return e}_debug(...e){return this.logDebugMessages&&this.logger(`GoTrueClient@${this.instanceID} (${ew}) ${new Date().toISOString()}`,...e),this}async initialize(){return this.initializePromise?await this.initializePromise:(this.initializePromise=(async()=>await this._acquireLock(-1,async()=>await this._initialize()))(),await this.initializePromise)}async _initialize(){var e;try{let r={},n="none";if(Ht()&&(r=Fk(window.location.href),this._isImplicitGrantCallback(r)?n="implicit":await this._isPKCECallback(r)&&(n="pkce")),Ht()&&this.detectSessionInUrl&&n!=="none"){const{data:i,error:o}=await this._getSessionFromURL(r,n);if(o){if(this._debug("#_initialize()","error detecting session from URL",o),Ok(o)){const c=(e=o.details)===null||e===void 0?void 0:e.code;if(c==="identity_already_exists"||c==="identity_not_found"||c==="single_identity_not_deletable")return{error:o}}return await this._removeSession(),{error:o}}const{session:s,redirectType:a}=i;return this._debug("#_initialize()","detected session in URL",s,"redirect type",a),await this._saveSession(s),setTimeout(async()=>{a==="recovery"?await this._notifyAllSubscribers("PASSWORD_RECOVERY",s):await this._notifyAllSubscribers("SIGNED_IN",s)},0),{error:null}}return await this._recoverAndRefresh(),{error:null}}catch(r){return Re(r)?this._returnResult({error:r}):this._returnResult({error:new Ei("Unexpected error during initialization",r)})}finally{await this._handleVisibilityChange(),this._debug("#_initialize()","end")}}async signInAnonymously(e){var r,n,i;try{const o=await Oe(this.fetch,"POST",`${this.url}/signup`,{headers:this.headers,body:{data:(n=(r=e==null?void 0:e.options)===null||r===void 0?void 0:r.data)!==null&&n!==void 0?n:{},gotrue_meta_security:{captcha_token:(i=e==null?void 0:e.options)===null||i===void 0?void 0:i.captchaToken}},xform:Or}),{data:s,error:a}=o;if(a||!s)return this._returnResult({data:{user:null,session:null},error:a});const c=s.session,u=s.user;return s.session&&(await this._saveSession(s.session),await this._notifyAllSubscribers("SIGNED_IN",c)),this._returnResult({data:{user:u,session:c},error:null})}catch(o){if(Re(o))return this._returnResult({data:{user:null,session:null},error:o});throw o}}async signUp(e){var r,n,i;try{let o;if("email"in e){const{email:d,password:h,options:f}=e;let p=null,g=null;this.flowType==="pkce"&&([p,g]=await oo(this.storage,this.storageKey)),o=await Oe(this.fetch,"POST",`${this.url}/signup`,{headers:this.headers,redirectTo:f==null?void 0:f.emailRedirectTo,body:{email:d,password:h,data:(r=f==null?void 0:f.data)!==null&&r!==void 0?r:{},gotrue_meta_security:{captcha_token:f==null?void 0:f.captchaToken},code_challenge:p,code_challenge_method:g},xform:Or})}else if("phone"in e){const{phone:d,password:h,options:f}=e;o=await Oe(this.fetch,"POST",`${this.url}/signup`,{headers:this.headers,body:{phone:d,password:h,data:(n=f==null?void 0:f.data)!==null&&n!==void 0?n:{},channel:(i=f==null?void 0:f.channel)!==null&&i!==void 0?i:"sms",gotrue_meta_security:{captcha_token:f==null?void 0:f.captchaToken}},xform:Or})}else throw new Nl("You must provide either an email or phone number and a password");const{data:s,error:a}=o;if(a||!s)return this._returnResult({data:{user:null,session:null},error:a});const c=s.session,u=s.user;return s.session&&(await this._saveSession(s.session),await this._notifyAllSubscribers("SIGNED_IN",c)),this._returnResult({data:{user:u,session:c},error:null})}catch(o){if(Re(o))return this._returnResult({data:{user:null,session:null},error:o});throw o}}async signInWithPassword(e){try{let r;if("email"in e){const{email:o,password:s,options:a}=e;r=await Oe(this.fetch,"POST",`${this.url}/token?grant_type=password`,{headers:this.headers,body:{email:o,password:s,gotrue_meta_security:{captcha_token:a==null?void 0:a.captchaToken}},xform:Ng})}else if("phone"in e){const{phone:o,password:s,options:a}=e;r=await Oe(this.fetch,"POST",`${this.url}/token?grant_type=password`,{headers:this.headers,body:{phone:o,password:s,gotrue_meta_security:{captcha_token:a==null?void 0:a.captchaToken}},xform:Ng})}else throw new Nl("You must provide either an email or phone number and a password");const{data:n,error:i}=r;if(i)return this._returnResult({data:{user:null,session:null},error:i});if(!n||!n.session||!n.user){const o=new io;return this._returnResult({data:{user:null,session:null},error:o})}return n.session&&(await this._saveSession(n.session),await this._notifyAllSubscribers("SIGNED_IN",n.session)),this._returnResult({data:Object.assign({user:n.user,session:n.session},n.weak_password?{weakPassword:n.weak_password}:null),error:i})}catch(r){if(Re(r))return this._returnResult({data:{user:null,session:null},error:r});throw r}}async signInWithOAuth(e){var r,n,i,o;return await this._handleProviderSignIn(e.provider,{redirectTo:(r=e.options)===null||r===void 0?void 0:r.redirectTo,scopes:(n=e.options)===null||n===void 0?void 0:n.scopes,queryParams:(i=e.options)===null||i===void 0?void 0:i.queryParams,skipBrowserRedirect:(o=e.options)===null||o===void 0?void 0:o.skipBrowserRedirect})}async exchangeCodeForSession(e){return await this.initializePromise,this._acquireLock(-1,async()=>this._exchangeCodeForSession(e))}async signInWithWeb3(e){const{chain:r}=e;switch(r){case"ethereum":return await this.signInWithEthereum(e);case"solana":return await this.signInWithSolana(e);default:throw new Error(`@supabase/auth-js: Unsupported chain "${r}"`)}}async signInWithEthereum(e){var r,n,i,o,s,a,c,u,d,h,f;let p,g;if("message"in e)p=e.message,g=e.signature;else{const{chain:m,wallet:b,statement:v,options:y}=e;let x;if(Ht())if(typeof b=="object")x=b;else{const T=window;if("ethereum"in T&&typeof T.ethereum=="object"&&"request"in T.ethereum&&typeof T.ethereum.request=="function")x=T.ethereum;else throw new Error("@supabase/auth-js: No compatible Ethereum wallet interface on the window object (window.ethereum) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'ethereum', wallet: resolvedUserWallet }) instead.")}else{if(typeof b!="object"||!(y!=null&&y.url))throw new Error("@supabase/auth-js: Both wallet and url must be specified in non-browser environments.");x=b}const S=new URL((r=y==null?void 0:y.url)!==null&&r!==void 0?r:window.location.href),j=await x.request({method:"eth_requestAccounts"}).then(T=>T).catch(()=>{throw new Error("@supabase/auth-js: Wallet method eth_requestAccounts is missing or invalid")});if(!j||j.length===0)throw new Error("@supabase/auth-js: No accounts available. Please ensure the wallet is connected.");const _=sw(j[0]);let C=(n=y==null?void 0:y.signInWithEthereum)===null||n===void 0?void 0:n.chainId;if(!C){const T=await x.request({method:"eth_chainId"});C=uj(T)}const R={domain:S.host,address:_,statement:v,uri:S.href,version:"1",chainId:C,nonce:(i=y==null?void 0:y.signInWithEthereum)===null||i===void 0?void 0:i.nonce,issuedAt:(s=(o=y==null?void 0:y.signInWithEthereum)===null||o===void 0?void 0:o.issuedAt)!==null&&s!==void 0?s:new Date,expirationTime:(a=y==null?void 0:y.signInWithEthereum)===null||a===void 0?void 0:a.expirationTime,notBefore:(c=y==null?void 0:y.signInWithEthereum)===null||c===void 0?void 0:c.notBefore,requestId:(u=y==null?void 0:y.signInWithEthereum)===null||u===void 0?void 0:u.requestId,resources:(d=y==null?void 0:y.signInWithEthereum)===null||d===void 0?void 0:d.resources};p=hj(R),g=await x.request({method:"personal_sign",params:[dj(p),_]})}try{const{data:m,error:b}=await Oe(this.fetch,"POST",`${this.url}/token?grant_type=web3`,{headers:this.headers,body:Object.assign({chain:"ethereum",message:p,signature:g},!((h=e.options)===null||h===void 0)&&h.captchaToken?{gotrue_meta_security:{captcha_token:(f=e.options)===null||f===void 0?void 0:f.captchaToken}}:null),xform:Or});if(b)throw b;if(!m||!m.session||!m.user){const v=new io;return this._returnResult({data:{user:null,session:null},error:v})}return m.session&&(await this._saveSession(m.session),await this._notifyAllSubscribers("SIGNED_IN",m.session)),this._returnResult({data:Object.assign({},m),error:b})}catch(m){if(Re(m))return this._returnResult({data:{user:null,session:null},error:m});throw m}}async signInWithSolana(e){var r,n,i,o,s,a,c,u,d,h,f,p;let g,m;if("message"in e)g=e.message,m=e.signature;else{const{chain:b,wallet:v,statement:y,options:x}=e;let S;if(Ht())if(typeof v=="object")S=v;else{const _=window;if("solana"in _&&typeof _.solana=="object"&&("signIn"in _.solana&&typeof _.solana.signIn=="function"||"signMessage"in _.solana&&typeof _.solana.signMessage=="function"))S=_.solana;else throw new Error("@supabase/auth-js: No compatible Solana wallet interface on the window object (window.solana) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'solana', wallet: resolvedUserWallet }) instead.")}else{if(typeof v!="object"||!(x!=null&&x.url))throw new Error("@supabase/auth-js: Both wallet and url must be specified in non-browser environments.");S=v}const j=new URL((r=x==null?void 0:x.url)!==null&&r!==void 0?r:window.location.href);if("signIn"in S&&S.signIn){const _=await S.signIn(Object.assign(Object.assign(Object.assign({issuedAt:new Date().toISOString()},x==null?void 0:x.signInWithSolana),{version:"1",domain:j.host,uri:j.href}),y?{statement:y}:null));let C;if(Array.isArray(_)&&_[0]&&typeof _[0]=="object")C=_[0];else if(_&&typeof _=="object"&&"signedMessage"in _&&"signature"in _)C=_;else throw new Error("@supabase/auth-js: Wallet method signIn() returned unrecognized value");if("signedMessage"in C&&"signature"in C&&(typeof C.signedMessage=="string"||C.signedMessage instanceof Uint8Array)&&C.signature instanceof Uint8Array)g=typeof C.signedMessage=="string"?C.signedMessage:new TextDecoder().decode(C.signedMessage),m=C.signature;else throw new Error("@supabase/auth-js: Wallet method signIn() API returned object without signedMessage and signature fields")}else{if(!("signMessage"in S)||typeof S.signMessage!="function"||!("publicKey"in S)||typeof S!="object"||!S.publicKey||!("toBase58"in S.publicKey)||typeof S.publicKey.toBase58!="function")throw new Error("@supabase/auth-js: Wallet does not have a compatible signMessage() and publicKey.toBase58() API");g=[`${j.host} wants you to sign in with your Solana account:`,S.publicKey.toBase58(),...y?["",y,""]:[""],"Version: 1",`URI: ${j.href}`,`Issued At: ${(i=(n=x==null?void 0:x.signInWithSolana)===null||n===void 0?void 0:n.issuedAt)!==null&&i!==void 0?i:new Date().toISOString()}`,...!((o=x==null?void 0:x.signInWithSolana)===null||o===void 0)&&o.notBefore?[`Not Before: ${x.signInWithSolana.notBefore}`]:[],...!((s=x==null?void 0:x.signInWithSolana)===null||s===void 0)&&s.expirationTime?[`Expiration Time: ${x.signInWithSolana.expirationTime}`]:[],...!((a=x==null?void 0:x.signInWithSolana)===null||a===void 0)&&a.chainId?[`Chain ID: ${x.signInWithSolana.chainId}`]:[],...!((c=x==null?void 0:x.signInWithSolana)===null||c===void 0)&&c.nonce?[`Nonce: ${x.signInWithSolana.nonce}`]:[],...!((u=x==null?void 0:x.signInWithSolana)===null||u===void 0)&&u.requestId?[`Request ID: ${x.signInWithSolana.requestId}`]:[],...!((h=(d=x==null?void 0:x.signInWithSolana)===null||d===void 0?void 0:d.resources)===null||h===void 0)&&h.length?["Resources",...x.signInWithSolana.resources.map(C=>`- ${C}`)]:[]].join(`
`);const _=await S.signMessage(new TextEncoder().encode(g),"utf8");if(!_||!(_ instanceof Uint8Array))throw new Error("@supabase/auth-js: Wallet signMessage() API returned an recognized value");m=_}}try{const{data:b,error:v}=await Oe(this.fetch,"POST",`${this.url}/token?grant_type=web3`,{headers:this.headers,body:Object.assign({chain:"solana",message:g,signature:Pi(m)},!((f=e.options)===null||f===void 0)&&f.captchaToken?{gotrue_meta_security:{captcha_token:(p=e.options)===null||p===void 0?void 0:p.captchaToken}}:null),xform:Or});if(v)throw v;if(!b||!b.session||!b.user){const y=new io;return this._returnResult({data:{user:null,session:null},error:y})}return b.session&&(await this._saveSession(b.session),await this._notifyAllSubscribers("SIGNED_IN",b.session)),this._returnResult({data:Object.assign({},b),error:v})}catch(b){if(Re(b))return this._returnResult({data:{user:null,session:null},error:b});throw b}}async _exchangeCodeForSession(e){const r=await xi(this.storage,`${this.storageKey}-code-verifier`),[n,i]=(r??"").split("/");try{const{data:o,error:s}=await Oe(this.fetch,"POST",`${this.url}/token?grant_type=pkce`,{headers:this.headers,body:{auth_code:e,code_verifier:n},xform:Or});if(await In(this.storage,`${this.storageKey}-code-verifier`),s)throw s;if(!o||!o.session||!o.user){const a=new io;return this._returnResult({data:{user:null,session:null,redirectType:null},error:a})}return o.session&&(await this._saveSession(o.session),await this._notifyAllSubscribers("SIGNED_IN",o.session)),this._returnResult({data:Object.assign(Object.assign({},o),{redirectType:i??null}),error:s})}catch(o){if(Re(o))return this._returnResult({data:{user:null,session:null,redirectType:null},error:o});throw o}}async signInWithIdToken(e){try{const{options:r,provider:n,token:i,access_token:o,nonce:s}=e,a=await Oe(this.fetch,"POST",`${this.url}/token?grant_type=id_token`,{headers:this.headers,body:{provider:n,id_token:i,access_token:o,nonce:s,gotrue_meta_security:{captcha_token:r==null?void 0:r.captchaToken}},xform:Or}),{data:c,error:u}=a;if(u)return this._returnResult({data:{user:null,session:null},error:u});if(!c||!c.session||!c.user){const d=new io;return this._returnResult({data:{user:null,session:null},error:d})}return c.session&&(await this._saveSession(c.session),await this._notifyAllSubscribers("SIGNED_IN",c.session)),this._returnResult({data:c,error:u})}catch(r){if(Re(r))return this._returnResult({data:{user:null,session:null},error:r});throw r}}async signInWithOtp(e){var r,n,i,o,s;try{if("email"in e){const{email:a,options:c}=e;let u=null,d=null;this.flowType==="pkce"&&([u,d]=await oo(this.storage,this.storageKey));const{error:h}=await Oe(this.fetch,"POST",`${this.url}/otp`,{headers:this.headers,body:{email:a,data:(r=c==null?void 0:c.data)!==null&&r!==void 0?r:{},create_user:(n=c==null?void 0:c.shouldCreateUser)!==null&&n!==void 0?n:!0,gotrue_meta_security:{captcha_token:c==null?void 0:c.captchaToken},code_challenge:u,code_challenge_method:d},redirectTo:c==null?void 0:c.emailRedirectTo});return this._returnResult({data:{user:null,session:null},error:h})}if("phone"in e){const{phone:a,options:c}=e,{data:u,error:d}=await Oe(this.fetch,"POST",`${this.url}/otp`,{headers:this.headers,body:{phone:a,data:(i=c==null?void 0:c.data)!==null&&i!==void 0?i:{},create_user:(o=c==null?void 0:c.shouldCreateUser)!==null&&o!==void 0?o:!0,gotrue_meta_security:{captcha_token:c==null?void 0:c.captchaToken},channel:(s=c==null?void 0:c.channel)!==null&&s!==void 0?s:"sms"}});return this._returnResult({data:{user:null,session:null,messageId:u==null?void 0:u.message_id},error:d})}throw new Nl("You must provide either an email or phone number.")}catch(a){if(Re(a))return this._returnResult({data:{user:null,session:null},error:a});throw a}}async verifyOtp(e){var r,n;try{let i,o;"options"in e&&(i=(r=e.options)===null||r===void 0?void 0:r.redirectTo,o=(n=e.options)===null||n===void 0?void 0:n.captchaToken);const{data:s,error:a}=await Oe(this.fetch,"POST",`${this.url}/verify`,{headers:this.headers,body:Object.assign(Object.assign({},e),{gotrue_meta_security:{captcha_token:o}}),redirectTo:i,xform:Or});if(a)throw a;if(!s)throw new Error("An error occurred on token verification.");const c=s.session,u=s.user;return c!=null&&c.access_token&&(await this._saveSession(c),await this._notifyAllSubscribers(e.type=="recovery"?"PASSWORD_RECOVERY":"SIGNED_IN",c)),this._returnResult({data:{user:u,session:c},error:null})}catch(i){if(Re(i))return this._returnResult({data:{user:null,session:null},error:i});throw i}}async signInWithSSO(e){var r,n,i;try{let o=null,s=null;this.flowType==="pkce"&&([o,s]=await oo(this.storage,this.storageKey));const a=await Oe(this.fetch,"POST",`${this.url}/sso`,{body:Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({},"providerId"in e?{provider_id:e.providerId}:null),"domain"in e?{domain:e.domain}:null),{redirect_to:(n=(r=e.options)===null||r===void 0?void 0:r.redirectTo)!==null&&n!==void 0?n:void 0}),!((i=e==null?void 0:e.options)===null||i===void 0)&&i.captchaToken?{gotrue_meta_security:{captcha_token:e.options.captchaToken}}:null),{skip_http_redirect:!0,code_challenge:o,code_challenge_method:s}),headers:this.headers,xform:nj});return this._returnResult(a)}catch(o){if(Re(o))return this._returnResult({data:null,error:o});throw o}}async reauthenticate(){return await this.initializePromise,await this._acquireLock(-1,async()=>await this._reauthenticate())}async _reauthenticate(){try{return await this._useSession(async e=>{const{data:{session:r},error:n}=e;if(n)throw n;if(!r)throw new Pr;const{error:i}=await Oe(this.fetch,"GET",`${this.url}/reauthenticate`,{headers:this.headers,jwt:r.access_token});return this._returnResult({data:{user:null,session:null},error:i})})}catch(e){if(Re(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async resend(e){try{const r=`${this.url}/resend`;if("email"in e){const{email:n,type:i,options:o}=e,{error:s}=await Oe(this.fetch,"POST",r,{headers:this.headers,body:{email:n,type:i,gotrue_meta_security:{captcha_token:o==null?void 0:o.captchaToken}},redirectTo:o==null?void 0:o.emailRedirectTo});return this._returnResult({data:{user:null,session:null},error:s})}else if("phone"in e){const{phone:n,type:i,options:o}=e,{data:s,error:a}=await Oe(this.fetch,"POST",r,{headers:this.headers,body:{phone:n,type:i,gotrue_meta_security:{captcha_token:o==null?void 0:o.captchaToken}}});return this._returnResult({data:{user:null,session:null,messageId:s==null?void 0:s.message_id},error:a})}throw new Nl("You must provide either an email or phone number and a type")}catch(r){if(Re(r))return this._returnResult({data:{user:null,session:null},error:r});throw r}}async getSession(){return await this.initializePromise,await this._acquireLock(-1,async()=>this._useSession(async r=>r))}async _acquireLock(e,r){this._debug("#_acquireLock","begin",e);try{if(this.lockAcquired){const n=this.pendingInLock.length?this.pendingInLock[this.pendingInLock.length-1]:Promise.resolve(),i=(async()=>(await n,await r()))();return this.pendingInLock.push((async()=>{try{await i}catch{}})()),i}return await this.lock(`lock:${this.storageKey}`,e,async()=>{this._debug("#_acquireLock","lock acquired for storage key",this.storageKey);try{this.lockAcquired=!0;const n=r();for(this.pendingInLock.push((async()=>{try{await n}catch{}})()),await n;this.pendingInLock.length;){const i=[...this.pendingInLock];await Promise.all(i),this.pendingInLock.splice(0,i.length)}return await n}finally{this._debug("#_acquireLock","lock released for storage key",this.storageKey),this.lockAcquired=!1}})}finally{this._debug("#_acquireLock","end")}}async _useSession(e){this._debug("#_useSession","begin");try{const r=await this.__loadSession();return await e(r)}finally{this._debug("#_useSession","end")}}async __loadSession(){this._debug("#__loadSession()","begin"),this.lockAcquired||this._debug("#__loadSession()","used outside of an acquired lock!",new Error().stack);try{let e=null;const r=await xi(this.storage,this.storageKey);if(this._debug("#getSession()","session from storage",r),r!==null&&(this._isValidSession(r)?e=r:(this._debug("#getSession()","session from storage is not valid"),await this._removeSession())),!e)return{data:{session:null},error:null};const n=e.expires_at?e.expires_at*1e3-Date.now()<rd:!1;if(this._debug("#__loadSession()",`session has${n?"":" not"} expired`,"expires_at",e.expires_at),!n){if(this.userStorage){const s=await xi(this.userStorage,this.storageKey+"-user");s!=null&&s.user?e.user=s.user:e.user=od()}if(this.storage.isServer&&e.user&&!e.user.__isUserNotAvailableProxy){const s={value:this.suppressGetSessionWarning};e.user=Qk(e.user,s),s.value&&(this.suppressGetSessionWarning=!0)}return{data:{session:e},error:null}}const{data:i,error:o}=await this._callRefreshToken(e.refresh_token);return o?this._returnResult({data:{session:null},error:o}):this._returnResult({data:{session:i},error:null})}finally{this._debug("#__loadSession()","end")}}async getUser(e){return e?await this._getUser(e):(await this.initializePromise,await this._acquireLock(-1,async()=>await this._getUser()))}async _getUser(e){try{return e?await Oe(this.fetch,"GET",`${this.url}/user`,{headers:this.headers,jwt:e,xform:Bn}):await this._useSession(async r=>{var n,i,o;const{data:s,error:a}=r;if(a)throw a;return!(!((n=s.session)===null||n===void 0)&&n.access_token)&&!this.hasCustomAuthorizationHeader?{data:{user:null},error:new Pr}:await Oe(this.fetch,"GET",`${this.url}/user`,{headers:this.headers,jwt:(o=(i=s.session)===null||i===void 0?void 0:i.access_token)!==null&&o!==void 0?o:void 0,xform:Bn})})}catch(r){if(Re(r))return Pk(r)&&(await this._removeSession(),await In(this.storage,`${this.storageKey}-code-verifier`)),this._returnResult({data:{user:null},error:r});throw r}}async updateUser(e,r={}){return await this.initializePromise,await this._acquireLock(-1,async()=>await this._updateUser(e,r))}async _updateUser(e,r={}){try{return await this._useSession(async n=>{const{data:i,error:o}=n;if(o)throw o;if(!i.session)throw new Pr;const s=i.session;let a=null,c=null;this.flowType==="pkce"&&e.email!=null&&([a,c]=await oo(this.storage,this.storageKey));const{data:u,error:d}=await Oe(this.fetch,"PUT",`${this.url}/user`,{headers:this.headers,redirectTo:r==null?void 0:r.emailRedirectTo,body:Object.assign(Object.assign({},e),{code_challenge:a,code_challenge_method:c}),jwt:s.access_token,xform:Bn});if(d)throw d;return s.user=u.user,await this._saveSession(s),await this._notifyAllSubscribers("USER_UPDATED",s),this._returnResult({data:{user:s.user},error:null})})}catch(n){if(Re(n))return this._returnResult({data:{user:null},error:n});throw n}}async setSession(e){return await this.initializePromise,await this._acquireLock(-1,async()=>await this._setSession(e))}async _setSession(e){try{if(!e.access_token||!e.refresh_token)throw new Pr;const r=Date.now()/1e3;let n=r,i=!0,o=null;const{payload:s}=id(e.access_token);if(s.exp&&(n=s.exp,i=n<=r),i){const{data:a,error:c}=await this._callRefreshToken(e.refresh_token);if(c)return this._returnResult({data:{user:null,session:null},error:c});if(!a)return{data:{user:null,session:null},error:null};o=a}else{const{data:a,error:c}=await this._getUser(e.access_token);if(c)throw c;o={access_token:e.access_token,refresh_token:e.refresh_token,user:a.user,token_type:"bearer",expires_in:n-r,expires_at:n},await this._saveSession(o),await this._notifyAllSubscribers("SIGNED_IN",o)}return this._returnResult({data:{user:o.user,session:o},error:null})}catch(r){if(Re(r))return this._returnResult({data:{session:null,user:null},error:r});throw r}}async refreshSession(e){return await this.initializePromise,await this._acquireLock(-1,async()=>await this._refreshSession(e))}async _refreshSession(e){try{return await this._useSession(async r=>{var n;if(!e){const{data:s,error:a}=r;if(a)throw a;e=(n=s.session)!==null&&n!==void 0?n:void 0}if(!(e!=null&&e.refresh_token))throw new Pr;const{data:i,error:o}=await this._callRefreshToken(e.refresh_token);return o?this._returnResult({data:{user:null,session:null},error:o}):i?this._returnResult({data:{user:i.user,session:i},error:null}):this._returnResult({data:{user:null,session:null},error:null})})}catch(r){if(Re(r))return this._returnResult({data:{user:null,session:null},error:r});throw r}}async _getSessionFromURL(e,r){try{if(!Ht())throw new Pl("No browser detected.");if(e.error||e.error_description||e.error_code)throw new Pl(e.error_description||"Error in URL with unspecified error_description",{error:e.error||"unspecified_error",code:e.error_code||"unspecified_code"});switch(r){case"implicit":if(this.flowType==="pkce")throw new Sg("Not a valid PKCE flow url.");break;case"pkce":if(this.flowType==="implicit")throw new Pl("Not a valid implicit grant flow url.");break;default:}if(r==="pkce"){if(this._debug("#_initialize()","begin","is PKCE flow",!0),!e.code)throw new Sg("No code detected.");const{data:y,error:x}=await this._exchangeCodeForSession(e.code);if(x)throw x;const S=new URL(window.location.href);return S.searchParams.delete("code"),window.history.replaceState(window.history.state,"",S.toString()),{data:{session:y.session,redirectType:null},error:null}}const{provider_token:n,provider_refresh_token:i,access_token:o,refresh_token:s,expires_in:a,expires_at:c,token_type:u}=e;if(!o||!a||!s||!u)throw new Pl("No session defined in URL");const d=Math.round(Date.now()/1e3),h=parseInt(a);let f=d+h;c&&(f=parseInt(c));const p=f-d;p*1e3<=fo&&console.warn(`@supabase/gotrue-js: Session as retrieved from URL expires in ${p}s, should have been closer to ${h}s`);const g=f-h;d-g>=120?console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued over 120s ago, URL could be stale",g,f,d):d-g<0&&console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued in the future? Check the device clock for skew",g,f,d);const{data:m,error:b}=await this._getUser(o);if(b)throw b;const v={provider_token:n,provider_refresh_token:i,access_token:o,expires_in:h,expires_at:f,refresh_token:s,token_type:u,user:m.user};return window.location.hash="",this._debug("#_getSessionFromURL()","clearing window.location.hash"),this._returnResult({data:{session:v,redirectType:e.type},error:null})}catch(n){if(Re(n))return this._returnResult({data:{session:null,redirectType:null},error:n});throw n}}_isImplicitGrantCallback(e){return!!(e.access_token||e.error_description)}async _isPKCECallback(e){const r=await xi(this.storage,`${this.storageKey}-code-verifier`);return!!(e.code&&r)}async signOut(e={scope:"global"}){return await this.initializePromise,await this._acquireLock(-1,async()=>await this._signOut(e))}async _signOut({scope:e}={scope:"global"}){return await this._useSession(async r=>{var n;const{data:i,error:o}=r;if(o)return this._returnResult({error:o});const s=(n=i.session)===null||n===void 0?void 0:n.access_token;if(s){const{error:a}=await this.admin.signOut(s,e);if(a&&!(Nk(a)&&(a.status===404||a.status===401||a.status===403)))return this._returnResult({error:a})}return e!=="others"&&(await this._removeSession(),await In(this.storage,`${this.storageKey}-code-verifier`)),this._returnResult({error:null})})}onAuthStateChange(e){const r=zk(),n={id:r,callback:e,unsubscribe:()=>{this._debug("#unsubscribe()","state change callback with id removed",r),this.stateChangeEmitters.delete(r)}};return this._debug("#onAuthStateChange()","registered callback with id",r),this.stateChangeEmitters.set(r,n),(async()=>(await this.initializePromise,await this._acquireLock(-1,async()=>{this._emitInitialSession(r)})))(),{data:{subscription:n}}}async _emitInitialSession(e){return await this._useSession(async r=>{var n,i;try{const{data:{session:o},error:s}=r;if(s)throw s;await((n=this.stateChangeEmitters.get(e))===null||n===void 0?void 0:n.callback("INITIAL_SESSION",o)),this._debug("INITIAL_SESSION","callback id",e,"session",o)}catch(o){await((i=this.stateChangeEmitters.get(e))===null||i===void 0?void 0:i.callback("INITIAL_SESSION",null)),this._debug("INITIAL_SESSION","callback id",e,"error",o),console.error(o)}})}async resetPasswordForEmail(e,r={}){let n=null,i=null;this.flowType==="pkce"&&([n,i]=await oo(this.storage,this.storageKey,!0));try{return await Oe(this.fetch,"POST",`${this.url}/recover`,{body:{email:e,code_challenge:n,code_challenge_method:i,gotrue_meta_security:{captcha_token:r.captchaToken}},headers:this.headers,redirectTo:r.redirectTo})}catch(o){if(Re(o))return this._returnResult({data:null,error:o});throw o}}async getUserIdentities(){var e;try{const{data:r,error:n}=await this.getUser();if(n)throw n;return this._returnResult({data:{identities:(e=r.user.identities)!==null&&e!==void 0?e:[]},error:null})}catch(r){if(Re(r))return this._returnResult({data:null,error:r});throw r}}async linkIdentity(e){return"token"in e?this.linkIdentityIdToken(e):this.linkIdentityOAuth(e)}async linkIdentityOAuth(e){var r;try{const{data:n,error:i}=await this._useSession(async o=>{var s,a,c,u,d;const{data:h,error:f}=o;if(f)throw f;const p=await this._getUrlForProvider(`${this.url}/user/identities/authorize`,e.provider,{redirectTo:(s=e.options)===null||s===void 0?void 0:s.redirectTo,scopes:(a=e.options)===null||a===void 0?void 0:a.scopes,queryParams:(c=e.options)===null||c===void 0?void 0:c.queryParams,skipBrowserRedirect:!0});return await Oe(this.fetch,"GET",p,{headers:this.headers,jwt:(d=(u=h.session)===null||u===void 0?void 0:u.access_token)!==null&&d!==void 0?d:void 0})});if(i)throw i;return Ht()&&!(!((r=e.options)===null||r===void 0)&&r.skipBrowserRedirect)&&window.location.assign(n==null?void 0:n.url),this._returnResult({data:{provider:e.provider,url:n==null?void 0:n.url},error:null})}catch(n){if(Re(n))return this._returnResult({data:{provider:e.provider,url:null},error:n});throw n}}async linkIdentityIdToken(e){return await this._useSession(async r=>{var n;try{const{error:i,data:{session:o}}=r;if(i)throw i;const{options:s,provider:a,token:c,access_token:u,nonce:d}=e,h=await Oe(this.fetch,"POST",`${this.url}/token?grant_type=id_token`,{headers:this.headers,jwt:(n=o==null?void 0:o.access_token)!==null&&n!==void 0?n:void 0,body:{provider:a,id_token:c,access_token:u,nonce:d,link_identity:!0,gotrue_meta_security:{captcha_token:s==null?void 0:s.captchaToken}},xform:Or}),{data:f,error:p}=h;return p?this._returnResult({data:{user:null,session:null},error:p}):!f||!f.session||!f.user?this._returnResult({data:{user:null,session:null},error:new io}):(f.session&&(await this._saveSession(f.session),await this._notifyAllSubscribers("USER_UPDATED",f.session)),this._returnResult({data:f,error:p}))}catch(i){if(Re(i))return this._returnResult({data:{user:null,session:null},error:i});throw i}})}async unlinkIdentity(e){try{return await this._useSession(async r=>{var n,i;const{data:o,error:s}=r;if(s)throw s;return await Oe(this.fetch,"DELETE",`${this.url}/user/identities/${e.identity_id}`,{headers:this.headers,jwt:(i=(n=o.session)===null||n===void 0?void 0:n.access_token)!==null&&i!==void 0?i:void 0})})}catch(r){if(Re(r))return this._returnResult({data:null,error:r});throw r}}async _refreshAccessToken(e){const r=`#_refreshAccessToken(${e.substring(0,5)}...)`;this._debug(r,"begin");try{const n=Date.now();return await Hk(async i=>(i>0&&await Uk(200*Math.pow(2,i-1)),this._debug(r,"refreshing attempt",i),await Oe(this.fetch,"POST",`${this.url}/token?grant_type=refresh_token`,{body:{refresh_token:e},headers:this.headers,xform:Or})),(i,o)=>{const s=200*Math.pow(2,i);return o&&nd(o)&&Date.now()+s-n<fo})}catch(n){if(this._debug(r,"error",n),Re(n))return this._returnResult({data:{session:null,user:null},error:n});throw n}finally{this._debug(r,"end")}}_isValidSession(e){return typeof e=="object"&&e!==null&&"access_token"in e&&"refresh_token"in e&&"expires_at"in e}async _handleProviderSignIn(e,r){const n=await this._getUrlForProvider(`${this.url}/authorize`,e,{redirectTo:r.redirectTo,scopes:r.scopes,queryParams:r.queryParams});return this._debug("#_handleProviderSignIn()","provider",e,"options",r,"url",n),Ht()&&!r.skipBrowserRedirect&&window.location.assign(n),{data:{provider:e,url:n},error:null}}async _recoverAndRefresh(){var e,r;const n="#_recoverAndRefresh()";this._debug(n,"begin");try{const i=await xi(this.storage,this.storageKey);if(i&&this.userStorage){let s=await xi(this.userStorage,this.storageKey+"-user");!this.storage.isServer&&Object.is(this.storage,this.userStorage)&&!s&&(s={user:i.user},await po(this.userStorage,this.storageKey+"-user",s)),i.user=(e=s==null?void 0:s.user)!==null&&e!==void 0?e:od()}else if(i&&!i.user&&!i.user){const s=await xi(this.storage,this.storageKey+"-user");s&&(s!=null&&s.user)?(i.user=s.user,await In(this.storage,this.storageKey+"-user"),await po(this.storage,this.storageKey,i)):i.user=od()}if(this._debug(n,"session from storage",i),!this._isValidSession(i)){this._debug(n,"session is not valid"),i!==null&&await this._removeSession();return}const o=((r=i.expires_at)!==null&&r!==void 0?r:1/0)*1e3-Date.now()<rd;if(this._debug(n,`session has${o?"":" not"} expired with margin of ${rd}s`),o){if(this.autoRefreshToken&&i.refresh_token){const{error:s}=await this._callRefreshToken(i.refresh_token);s&&(console.error(s),nd(s)||(this._debug(n,"refresh failed with a non-retryable error, removing the session",s),await this._removeSession()))}}else if(i.user&&i.user.__isUserNotAvailableProxy===!0)try{const{data:s,error:a}=await this._getUser(i.access_token);!a&&(s!=null&&s.user)?(i.user=s.user,await this._saveSession(i),await this._notifyAllSubscribers("SIGNED_IN",i)):this._debug(n,"could not get user data, skipping SIGNED_IN notification")}catch(s){console.error("Error getting user data:",s),this._debug(n,"error getting user data, skipping SIGNED_IN notification",s)}else await this._notifyAllSubscribers("SIGNED_IN",i)}catch(i){this._debug(n,"error",i),console.error(i);return}finally{this._debug(n,"end")}}async _callRefreshToken(e){var r,n;if(!e)throw new Pr;if(this.refreshingDeferred)return this.refreshingDeferred.promise;const i=`#_callRefreshToken(${e.substring(0,5)}...)`;this._debug(i,"begin");try{this.refreshingDeferred=new nu;const{data:o,error:s}=await this._refreshAccessToken(e);if(s)throw s;if(!o.session)throw new Pr;await this._saveSession(o.session),await this._notifyAllSubscribers("TOKEN_REFRESHED",o.session);const a={data:o.session,error:null};return this.refreshingDeferred.resolve(a),a}catch(o){if(this._debug(i,"error",o),Re(o)){const s={data:null,error:o};return nd(o)||await this._removeSession(),(r=this.refreshingDeferred)===null||r===void 0||r.resolve(s),s}throw(n=this.refreshingDeferred)===null||n===void 0||n.reject(o),o}finally{this.refreshingDeferred=null,this._debug(i,"end")}}async _notifyAllSubscribers(e,r,n=!0){const i=`#_notifyAllSubscribers(${e})`;this._debug(i,"begin",r,`broadcast = ${n}`);try{this.broadcastChannel&&n&&this.broadcastChannel.postMessage({event:e,session:r});const o=[],s=Array.from(this.stateChangeEmitters.values()).map(async a=>{try{await a.callback(e,r)}catch(c){o.push(c)}});if(await Promise.all(s),o.length>0){for(let a=0;a<o.length;a+=1)console.error(o[a]);throw o[0]}}finally{this._debug(i,"end")}}async _saveSession(e){this._debug("#_saveSession()",e),this.suppressGetSessionWarning=!0;const r=Object.assign({},e),n=r.user&&r.user.__isUserNotAvailableProxy===!0;if(this.userStorage){!n&&r.user&&await po(this.userStorage,this.storageKey+"-user",{user:r.user});const i=Object.assign({},r);delete i.user;const o=Tg(i);await po(this.storage,this.storageKey,o)}else{const i=Tg(r);await po(this.storage,this.storageKey,i)}}async _removeSession(){this._debug("#_removeSession()"),await In(this.storage,this.storageKey),await In(this.storage,this.storageKey+"-code-verifier"),await In(this.storage,this.storageKey+"-user"),this.userStorage&&await In(this.userStorage,this.storageKey+"-user"),await this._notifyAllSubscribers("SIGNED_OUT",null)}_removeVisibilityChangedCallback(){this._debug("#_removeVisibilityChangedCallback()");const e=this.visibilityChangedCallback;this.visibilityChangedCallback=null;try{e&&Ht()&&(window!=null&&window.removeEventListener)&&window.removeEventListener("visibilitychange",e)}catch(r){console.error("removing visibilitychange callback failed",r)}}async _startAutoRefresh(){await this._stopAutoRefresh(),this._debug("#_startAutoRefresh()");const e=setInterval(()=>this._autoRefreshTokenTick(),fo);this.autoRefreshTicker=e,e&&typeof e=="object"&&typeof e.unref=="function"?e.unref():typeof Deno<"u"&&typeof Deno.unrefTimer=="function"&&Deno.unrefTimer(e),setTimeout(async()=>{await this.initializePromise,await this._autoRefreshTokenTick()},0)}async _stopAutoRefresh(){this._debug("#_stopAutoRefresh()");const e=this.autoRefreshTicker;this.autoRefreshTicker=null,e&&clearInterval(e)}async startAutoRefresh(){this._removeVisibilityChangedCallback(),await this._startAutoRefresh()}async stopAutoRefresh(){this._removeVisibilityChangedCallback(),await this._stopAutoRefresh()}async _autoRefreshTokenTick(){this._debug("#_autoRefreshTokenTick()","begin");try{await this._acquireLock(0,async()=>{try{const e=Date.now();try{return await this._useSession(async r=>{const{data:{session:n}}=r;if(!n||!n.refresh_token||!n.expires_at){this._debug("#_autoRefreshTokenTick()","no session");return}const i=Math.floor((n.expires_at*1e3-e)/fo);this._debug("#_autoRefreshTokenTick()",`access token expires in ${i} ticks, a tick lasts ${fo}ms, refresh threshold is ${Rh} ticks`),i<=Rh&&await this._callRefreshToken(n.refresh_token)})}catch(r){console.error("Auto refresh tick failed with error. This is likely a transient error.",r)}}finally{this._debug("#_autoRefreshTokenTick()","end")}})}catch(e){if(e.isAcquireTimeout||e instanceof ow)this._debug("auto refresh token tick lock not available");else throw e}}async _handleVisibilityChange(){if(this._debug("#_handleVisibilityChange()"),!Ht()||!(window!=null&&window.addEventListener))return this.autoRefreshToken&&this.startAutoRefresh(),!1;try{this.visibilityChangedCallback=async()=>await this._onVisibilityChanged(!1),window==null||window.addEventListener("visibilitychange",this.visibilityChangedCallback),await this._onVisibilityChanged(!0)}catch(e){console.error("_handleVisibilityChange",e)}}async _onVisibilityChanged(e){const r=`#_onVisibilityChanged(${e})`;this._debug(r,"visibilityState",document.visibilityState),document.visibilityState==="visible"?(this.autoRefreshToken&&this._startAutoRefresh(),e||(await this.initializePromise,await this._acquireLock(-1,async()=>{if(document.visibilityState!=="visible"){this._debug(r,"acquired the lock to recover the session, but the browser visibilityState is no longer visible, aborting");return}await this._recoverAndRefresh()}))):document.visibilityState==="hidden"&&this.autoRefreshToken&&this._stopAutoRefresh()}async _getUrlForProvider(e,r,n){const i=[`provider=${encodeURIComponent(r)}`];if(n!=null&&n.redirectTo&&i.push(`redirect_to=${encodeURIComponent(n.redirectTo)}`),n!=null&&n.scopes&&i.push(`scopes=${encodeURIComponent(n.scopes)}`),this.flowType==="pkce"){const[o,s]=await oo(this.storage,this.storageKey),a=new URLSearchParams({code_challenge:`${encodeURIComponent(o)}`,code_challenge_method:`${encodeURIComponent(s)}`});i.push(a.toString())}if(n!=null&&n.queryParams){const o=new URLSearchParams(n.queryParams);i.push(o.toString())}return n!=null&&n.skipBrowserRedirect&&i.push(`skip_http_redirect=${n.skipBrowserRedirect}`),`${e}?${i.join("&")}`}async _unenroll(e){try{return await this._useSession(async r=>{var n;const{data:i,error:o}=r;return o?this._returnResult({data:null,error:o}):await Oe(this.fetch,"DELETE",`${this.url}/factors/${e.factorId}`,{headers:this.headers,jwt:(n=i==null?void 0:i.session)===null||n===void 0?void 0:n.access_token})})}catch(r){if(Re(r))return this._returnResult({data:null,error:r});throw r}}async _enroll(e){try{return await this._useSession(async r=>{var n,i;const{data:o,error:s}=r;if(s)return this._returnResult({data:null,error:s});const a=Object.assign({friendly_name:e.friendlyName,factor_type:e.factorType},e.factorType==="phone"?{phone:e.phone}:e.factorType==="totp"?{issuer:e.issuer}:{}),{data:c,error:u}=await Oe(this.fetch,"POST",`${this.url}/factors`,{body:a,headers:this.headers,jwt:(n=o==null?void 0:o.session)===null||n===void 0?void 0:n.access_token});return u?this._returnResult({data:null,error:u}):(e.factorType==="totp"&&c.type==="totp"&&(!((i=c==null?void 0:c.totp)===null||i===void 0)&&i.qr_code)&&(c.totp.qr_code=`data:image/svg+xml;utf-8,${c.totp.qr_code}`),this._returnResult({data:c,error:null}))})}catch(r){if(Re(r))return this._returnResult({data:null,error:r});throw r}}async _verify(e){return this._acquireLock(-1,async()=>{try{return await this._useSession(async r=>{var n;const{data:i,error:o}=r;if(o)return this._returnResult({data:null,error:o});const s=Object.assign({challenge_id:e.challengeId},"webauthn"in e?{webauthn:Object.assign(Object.assign({},e.webauthn),{credential_response:e.webauthn.type==="create"?bj(e.webauthn.credential_response):xj(e.webauthn.credential_response)})}:{code:e.code}),{data:a,error:c}=await Oe(this.fetch,"POST",`${this.url}/factors/${e.factorId}/verify`,{body:s,headers:this.headers,jwt:(n=i==null?void 0:i.session)===null||n===void 0?void 0:n.access_token});return c?this._returnResult({data:null,error:c}):(await this._saveSession(Object.assign({expires_at:Math.round(Date.now()/1e3)+a.expires_in},a)),await this._notifyAllSubscribers("MFA_CHALLENGE_VERIFIED",a),this._returnResult({data:a,error:c}))})}catch(r){if(Re(r))return this._returnResult({data:null,error:r});throw r}})}async _challenge(e){return this._acquireLock(-1,async()=>{try{return await this._useSession(async r=>{var n;const{data:i,error:o}=r;if(o)return this._returnResult({data:null,error:o});const s=await Oe(this.fetch,"POST",`${this.url}/factors/${e.factorId}/challenge`,{body:e,headers:this.headers,jwt:(n=i==null?void 0:i.session)===null||n===void 0?void 0:n.access_token});if(s.error)return s;const{data:a}=s;if(a.type!=="webauthn")return{data:a,error:null};switch(a.webauthn.type){case"create":return{data:Object.assign(Object.assign({},a),{webauthn:Object.assign(Object.assign({},a.webauthn),{credential_options:Object.assign(Object.assign({},a.webauthn.credential_options),{publicKey:vj(a.webauthn.credential_options.publicKey)})})}),error:null};case"request":return{data:Object.assign(Object.assign({},a),{webauthn:Object.assign(Object.assign({},a.webauthn),{credential_options:Object.assign(Object.assign({},a.webauthn.credential_options),{publicKey:yj(a.webauthn.credential_options.publicKey)})})}),error:null}}})}catch(r){if(Re(r))return this._returnResult({data:null,error:r});throw r}})}async _challengeAndVerify(e){const{data:r,error:n}=await this._challenge({factorId:e.factorId});return n?this._returnResult({data:null,error:n}):await this._verify({factorId:e.factorId,challengeId:r.id,code:e.code})}async _listFactors(){var e;const{data:{user:r},error:n}=await this.getUser();if(n)return{data:null,error:n};const i={all:[],phone:[],totp:[],webauthn:[]};for(const o of(e=r==null?void 0:r.factors)!==null&&e!==void 0?e:[])i.all.push(o),o.status==="verified"&&i[o.factor_type].push(o);return{data:i,error:null}}async _getAuthenticatorAssuranceLevel(){var e,r;const{data:{session:n},error:i}=await this.getSession();if(i)return this._returnResult({data:null,error:i});if(!n)return{data:{currentLevel:null,nextLevel:null,currentAuthenticationMethods:[]},error:null};const{payload:o}=id(n.access_token);let s=null;o.aal&&(s=o.aal);let a=s;((r=(e=n.user.factors)===null||e===void 0?void 0:e.filter(d=>d.status==="verified"))!==null&&r!==void 0?r:[]).length>0&&(a="aal2");const u=o.amr||[];return{data:{currentLevel:s,nextLevel:a,currentAuthenticationMethods:u},error:null}}async _getAuthorizationDetails(e){try{return await this._useSession(async r=>{const{data:{session:n},error:i}=r;return i?this._returnResult({data:null,error:i}):n?await Oe(this.fetch,"GET",`${this.url}/oauth/authorizations/${e}`,{headers:this.headers,jwt:n.access_token,xform:o=>({data:o,error:null})}):this._returnResult({data:null,error:new Pr})})}catch(r){if(Re(r))return this._returnResult({data:null,error:r});throw r}}async _approveAuthorization(e,r){try{return await this._useSession(async n=>{const{data:{session:i},error:o}=n;if(o)return this._returnResult({data:null,error:o});if(!i)return this._returnResult({data:null,error:new Pr});const s=await Oe(this.fetch,"POST",`${this.url}/oauth/authorizations/${e}/consent`,{headers:this.headers,jwt:i.access_token,body:{action:"approve"},xform:a=>({data:a,error:null})});return s.data&&s.data.redirect_url&&Ht()&&!(r!=null&&r.skipBrowserRedirect)&&window.location.assign(s.data.redirect_url),s})}catch(n){if(Re(n))return this._returnResult({data:null,error:n});throw n}}async _denyAuthorization(e,r){try{return await this._useSession(async n=>{const{data:{session:i},error:o}=n;if(o)return this._returnResult({data:null,error:o});if(!i)return this._returnResult({data:null,error:new Pr});const s=await Oe(this.fetch,"POST",`${this.url}/oauth/authorizations/${e}/consent`,{headers:this.headers,jwt:i.access_token,body:{action:"deny"},xform:a=>({data:a,error:null})});return s.data&&s.data.redirect_url&&Ht()&&!(r!=null&&r.skipBrowserRedirect)&&window.location.assign(s.data.redirect_url),s})}catch(n){if(Re(n))return this._returnResult({data:null,error:n});throw n}}async fetchJwk(e,r={keys:[]}){let n=r.keys.find(a=>a.kid===e);if(n)return n;const i=Date.now();if(n=this.jwks.keys.find(a=>a.kid===e),n&&this.jwks_cached_at+Tk>i)return n;const{data:o,error:s}=await Oe(this.fetch,"GET",`${this.url}/.well-known/jwks.json`,{headers:this.headers});if(s)throw s;return!o.keys||o.keys.length===0||(this.jwks=o,this.jwks_cached_at=i,n=o.keys.find(a=>a.kid===e),!n)?null:n}async getClaims(e,r={}){try{let n=e;if(!n){const{data:p,error:g}=await this.getSession();if(g||!p.session)return this._returnResult({data:null,error:g});n=p.session.access_token}const{header:i,payload:o,signature:s,raw:{header:a,payload:c}}=id(n);r!=null&&r.allowExpired||Xk(o.exp);const u=!i.alg||i.alg.startsWith("HS")||!i.kid||!("crypto"in globalThis&&"subtle"in globalThis.crypto)?null:await this.fetchJwk(i.kid,r!=null&&r.keys?{keys:r.keys}:r==null?void 0:r.jwks);if(!u){const{error:p}=await this.getUser(n);if(p)throw p;return{data:{claims:o,header:i,signature:s},error:null}}const d=Zk(i.alg),h=await crypto.subtle.importKey("jwk",u,d,!0,["verify"]);if(!await crypto.subtle.verify(d,h,s,Lk(`${a}.${c}`)))throw new Oh("Invalid JWT signature");return{data:{claims:o,header:i,signature:s},error:null}}catch(n){if(Re(n))return this._returnResult({data:null,error:n});throw n}}}$a.nextInstanceID=0;const Rj=$a;class Nj extends Rj{constructor(e){super(e)}}class Pj{constructor(e,r,n){var i,o,s;this.supabaseUrl=e,this.supabaseKey=r;const a=Sk(e);if(!r)throw new Error("supabaseKey is required.");this.realtimeUrl=new URL("realtime/v1",a),this.realtimeUrl.protocol=this.realtimeUrl.protocol.replace("http","ws"),this.authUrl=new URL("auth/v1",a),this.storageUrl=new URL("storage/v1",a),this.functionsUrl=new URL("functions/v1",a);const c=`sb-${a.hostname.split(".")[0]}-auth-token`,u={db:mk,realtime:vk,auth:Object.assign(Object.assign({},gk),{storageKey:c}),global:pk},d=_k(n??{},u);this.storageKey=(i=d.auth.storageKey)!==null&&i!==void 0?i:"",this.headers=(o=d.global.headers)!==null&&o!==void 0?o:{},d.accessToken?(this.accessToken=d.accessToken,this.auth=new Proxy({},{get:(h,f)=>{throw new Error(`@supabase/supabase-js: Supabase Client is configured with the accessToken option, accessing supabase.auth.${String(f)} is not possible`)}})):this.auth=this._initSupabaseAuthClient((s=d.auth)!==null&&s!==void 0?s:{},this.headers,d.global.fetch),this.fetch=xk(r,this._getAccessToken.bind(this),d.global.fetch),this.realtime=this._initRealtimeClient(Object.assign({headers:this.headers,accessToken:this._getAccessToken.bind(this)},d.realtime)),this.rest=new kS(new URL("rest/v1",a).href,{headers:this.headers,schema:d.db.schema,fetch:this.fetch}),this.storage=new dk(this.storageUrl.href,this.headers,this.fetch,n==null?void 0:n.storage),d.accessToken||this._listenForAuthEvents()}get functions(){return new wS(this.functionsUrl.href,{headers:this.headers,customFetch:this.fetch})}from(e){return this.rest.from(e)}schema(e){return this.rest.schema(e)}rpc(e,r={},n={head:!1,get:!1,count:void 0}){return this.rest.rpc(e,r,n)}channel(e,r={config:{}}){return this.realtime.channel(e,r)}getChannels(){return this.realtime.getChannels()}removeChannel(e){return this.realtime.removeChannel(e)}removeAllChannels(){return this.realtime.removeAllChannels()}async _getAccessToken(){var e,r;if(this.accessToken)return await this.accessToken();const{data:n}=await this.auth.getSession();return(r=(e=n.session)===null||e===void 0?void 0:e.access_token)!==null&&r!==void 0?r:this.supabaseKey}_initSupabaseAuthClient({autoRefreshToken:e,persistSession:r,detectSessionInUrl:n,storage:i,userStorage:o,storageKey:s,flowType:a,lock:c,debug:u,throwOnError:d},h,f){const p={Authorization:`Bearer ${this.supabaseKey}`,apikey:`${this.supabaseKey}`};return new Nj({url:this.authUrl.href,headers:Object.assign(Object.assign({},p),h),storageKey:s,autoRefreshToken:e,persistSession:r,detectSessionInUrl:n,storage:i,userStorage:o,flowType:a,lock:c,debug:u,throwOnError:d,fetch:f,hasCustomAuthorizationHeader:Object.keys(this.headers).some(g=>g.toLowerCase()==="authorization")})}_initRealtimeClient(e){return new BS(this.realtimeUrl.href,Object.assign(Object.assign({},e),{params:Object.assign({apikey:this.supabaseKey},e==null?void 0:e.params)}))}_listenForAuthEvents(){return this.auth.onAuthStateChange((r,n)=>{this._handleTokenChanged(r,"CLIENT",n==null?void 0:n.access_token)})}_handleTokenChanged(e,r,n){(e==="TOKEN_REFRESHED"||e==="SIGNED_IN")&&this.changedAccessToken!==n?(this.changedAccessToken=n,this.realtime.setAuth(n)):e==="SIGNED_OUT"&&(this.realtime.setAuth(),r=="STORAGE"&&this.auth.signOut(),this.changedAccessToken=void 0)}}const Oj=(t,e,r)=>new Pj(t,e,r);function Aj(){if(typeof window<"u"||typeof process>"u")return!1;const t=process.version;if(t==null)return!1;const e=t.match(/^v(\d+)\./);return e?parseInt(e[1],10)<=18:!1}Aj()&&console.warn("⚠️  Node.js 18 and below are deprecated and will no longer be supported in future versions of @supabase/supabase-js. Please upgrade to Node.js 20 or later. For more information, visit: https://github.com/orgs/supabase/discussions/37217");const Ig={DRAFTIFY:"/api/studio-draftify",GEOMETRIC_GENERATE:"/api/studio-generate-geometric"},Mg={URL:"https://okakomwfikxmwllvliva.supabase.co",ANON_KEY:""},Lg={AUTH_SESSION:"studio_auth_session"},Mt=Oj(Mg.URL,Mg.ANON_KEY),vn={async signIn(t,e){const{data:r,error:n}=await Mt.auth.signInWithPassword({email:t,password:e});if(n)throw n;return localStorage.setItem(Lg.AUTH_SESSION,JSON.stringify(r.session)),r},async signOut(){await Mt.auth.signOut(),localStorage.removeItem(Lg.AUTH_SESSION)},async getSession(){const{data:t}=await Mt.auth.getSession();return t.session},async updatePassword(t){const{data:e,error:r}=await Mt.auth.updateUser({password:t});if(r)throw r;return await Mt.auth.updateUser({data:{password_setup_complete:!0}}),e},onAuthStateChange(t){return Mt.auth.onAuthStateChange(t)}};class Dg extends $.Component{constructor(r){super(r);Jp(this,"handleReset",()=>{this.setState({hasError:!1,error:null,errorInfo:null})});this.state={hasError:!1,error:null,errorInfo:null}}static getDerivedStateFromError(r){return{hasError:!0}}componentDidCatch(r,n){console.error("[ErrorBoundary] Caught error:",r,n),this.setState({error:r,errorInfo:n})}render(){return this.state.hasError?l.jsxs("div",{className:"error-boundary",children:[l.jsxs("div",{className:"error-content",children:[l.jsx("h1",{children:"Something went wrong"}),l.jsx("p",{children:"We're sorry, but something unexpected happened. Please try refreshing the page."}),l.jsxs("div",{className:"error-actions",children:[l.jsx("button",{onClick:this.handleReset,className:"btn-primary",children:"Try Again"}),l.jsx("button",{onClick:()=>window.location.reload(),className:"btn-secondary",children:"Refresh Page"})]}),!1]}),l.jsx("style",{jsx:!0,children:`
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
          `})]}):this.props.children}}class $j{async _getAuthHeaders(){const e=await vn.getSession(),r={"Content-Type":"application/json"};return e!=null&&e.access_token&&(r.Authorization=`Bearer ${e.access_token}`),r}async generateRecraft(e){const r={prompt:e.prompt,width_mm:e.widthMM||5e3,length_mm:e.lengthMM||5e3,max_colours:e.maxColours||6,seed:e.seed||null},n=await this._getAuthHeaders(),i=await fetch("/api/recraft-generate",{method:"POST",headers:n,body:JSON.stringify(r)});if(!i.ok){const o=await i.json();throw new Error(o.error||"Recraft generation failed")}return i.json()}async vectorizeImage(e){const r={image_url:e.image_url,width_mm:e.width_mm||5e3,length_mm:e.length_mm||5e3,seed:e.seed||null},n=await this._getAuthHeaders(),i=await fetch("/api/recraft-vectorize",{method:"POST",headers:n,body:JSON.stringify(r)});if(!i.ok){const o=await i.json();throw new Error(o.error||"Vectorization failed")}return i.json()}async processUploadedSVG(e){const r={svg_url:e.svg_url,width_mm:e.width_mm||5e3,length_mm:e.length_mm||5e3},n=await this._getAuthHeaders(),i=await fetch("/api/process-uploaded-svg",{method:"POST",headers:n,body:JSON.stringify(r)});if(!i.ok){const o=await i.json();throw new Error(o.error||"SVG processing failed")}return i.json()}async getRecraftStatus(e){const r=await fetch(`/api/studio-job-status?jobId=${e}`);if(!r.ok){const n=await r.json();throw new Error(n.error||"Status fetch failed")}return r.json()}async waitForRecraftCompletion(e,r=null,n=2e3){return new Promise((i,o)=>{const s=async()=>{var a,c,u,d;try{const h=await this.getRecraftStatus(e);r&&r(h),h.status==="completed"?((a=h.result)==null?void 0:a.svg_url)?(console.log("[API] Recraft job complete with SVG output"),i(h)):(console.error("[API] Recraft job completed but no SVG output"),o(new Error("Job completed but no output received"))):h.status==="failed"?(c=h.result)!=null&&c.svg_url?(console.warn("[API] Job failed compliance but has output (non-compliant)"),i(h)):o(new Error(h.error||"Job failed")):(h.status==="retrying"&&console.log(`[API] Retrying: ${(u=h.recraft)==null?void 0:u.attempt_current}/${(d=h.recraft)==null?void 0:d.attempt_max}`),setTimeout(s,n))}catch(h){o(h)}};s()})}async matchColor(e,r=2){const n=await fetch("/api/match-color",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({hex:e,max_components:r})});if(!n.ok){const i=await n.json();throw new Error(i.error||"Color matching failed")}return n.json()}async generateDesignName(e){const r={prompt:e.prompt,colors:e.colors||[],dimensions:e.dimensions||{}},n=await this._getAuthHeaders(),i=await fetch("/api/generate-design-name",{method:"POST",headers:n,body:JSON.stringify(r)});if(!i.ok){const o=await i.json();throw new Error(o.error||"Name generation failed")}return i.json()}async inspireSimpleCreateJob(e){const r={prompt:e.prompt,surface:{width_mm:e.lengthMM||5e3,height_mm:e.widthMM||5e3},max_colours:e.maxColours||6,try_simpler:e.trySimpler||!1};e.seed&&(r.seed=e.seed);const n=await fetch("/api/studio-inspire-simple",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)});if(!n.ok){const i=await n.json();throw new Error(i.message||"Job creation failed")}return n.json()}async inspireSimpleGetStatus(e){const r=await fetch(`/api/studio-job-status?jobId=${e}`);if(!r.ok){const n=await r.json();throw new Error(n.message||"Status fetch failed")}return r.json()}async inspireSimpleWaitForCompletion(e,r=null,n=2e3){return new Promise((i,o)=>{const s=async()=>{var a;try{const c=await this.inspireSimpleGetStatus(e);r&&r(c),c.status==="completed"?((a=c.result)==null?void 0:a.final_url)?(console.log("[API] Job complete with JPG output, resolving"),i(c)):(console.log("[API] Job completed but no output received"),o(new Error("Job completed but no output received"))):c.status==="failed"?o(new Error(c.error||"Job failed")):setTimeout(s,n)}catch(c){o(c)}};s()})}async draftify(e){const r=await fetch(Ig.DRAFTIFY,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!r.ok){const n=await r.json();throw new Error(n.message||"Vectorization failed")}return r.json()}async generateGeometric(e){const r={brief:e.prompt||e.brief,canvas:{width_mm:e.lengthMM||5e3,height_mm:e.widthMM||5e3},options:{mood:e.mood||"playful",composition:e.composition||"mixed",colorCount:e.maxColours||e.colorCount||5,seed:e.seed},validate:!0},n=await fetch(Ig.GEOMETRIC_GENERATE,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)});if(!n.ok){const i=await n.json();throw new Error(i.message||"Geometric generation failed")}return n.json()}}const wi=new $j;async function iu(){var r,n;const t=await Mt.auth.getSession(),e=(n=(r=t==null?void 0:t.data)==null?void 0:r.session)==null?void 0:n.access_token;if(!e)throw new Error("Not authenticated");return{"Content-Type":"application/json",Authorization:`Bearer ${e}`}}async function Ij(t){const e=await iu(),r=await fetch("/api/designs/save",{method:"POST",headers:e,body:JSON.stringify(t)});if(!r.ok){const n=await r.json();throw new Error(n.error||"Failed to save design")}return r.json()}async function Ah({project_id:t,limit:e=50,offset:r=0,search:n}={}){const i=await iu(),o=new URLSearchParams;t&&o.append("project_id",t),o.append("limit",e),o.append("offset",r),n&&o.append("search",n);const s=await fetch(`/api/designs/list?${o}`,{method:"GET",headers:i});if(!s.ok){const a=await s.json();throw new Error(a.error||"Failed to list designs")}return s.json()}async function Mj(t){const e=await iu(),r=await fetch(`/api/designs/by-id?id=${t}`,{method:"GET",headers:e});if(!r.ok){const n=await r.json();throw new Error(n.error||"Failed to load design")}return r.json()}async function Lj(t){const e=await iu(),r=await fetch(`/api/designs/by-id?id=${t}`,{method:"DELETE",headers:e});if(!r.ok){const n=await r.json();throw new Error(n.error||"Failed to delete design")}return r.json()}function Dj({recipes:t,onClose:e}){return!t||t.length===0?l.jsxs("div",{className:"blend-recipes-empty",children:[l.jsx("p",{children:"No colours extracted from design."}),l.jsx("button",{onClick:e,className:"close-button",children:"Close"})]}):l.jsxs("div",{className:"blend-recipes-display",children:[l.jsxs("div",{className:"recipes-header",children:[l.jsx("h3",{children:"TPV Blend Recipes"}),l.jsx("button",{onClick:e,className:"close-button-icon",children:"×"})]}),l.jsx("div",{className:"recipes-grid",children:t.map((r,n)=>{const i=r.chosenRecipe;return l.jsxs("div",{className:"recipe-card",children:[l.jsxs("div",{className:"card-top",children:[l.jsx("div",{className:"swatch-section",children:l.jsx("div",{className:"color-swatch",style:{backgroundColor:r.blendColor.hex},title:`TPV blend: ${r.blendColor.hex}`})}),l.jsxs("div",{className:"card-meta",children:[l.jsxs("div",{className:"meta-row",children:[l.jsx("span",{className:"meta-label",children:"Hex:"}),l.jsx("span",{className:"hex-value",children:r.blendColor.hex})]}),l.jsxs("div",{className:"meta-row",children:[l.jsx("span",{className:"meta-label",children:"Coverage:"}),l.jsxs("span",{className:"coverage-value",children:[r.targetColor.areaPct.toFixed(1),"%"]})]})]})]}),l.jsxs("div",{className:"card-formula",children:[l.jsx("div",{className:"formula-label",children:i.components.length===1?"Pure TPV Colour":"TPV Blend Formula"}),l.jsx("div",{className:"formula-content",children:i.components.length===1?l.jsxs("span",{className:"formula-component solid",children:[l.jsx("strong",{className:"parts",children:"100%"}),l.jsx("span",{className:"comp-code",children:i.components[0].code}),l.jsxs("span",{className:"comp-name",children:["(",i.components[0].name,")"]})]}):i.components.map((o,s)=>l.jsxs("span",{className:"formula-component",children:[l.jsx("strong",{className:"parts",children:o.parts||(o.weight*100).toFixed(0)+"%"}),l.jsx("span",{className:"comp-code",children:o.code}),l.jsxs("span",{className:"comp-name",children:["(",o.name,")"]}),s<i.components.length-1&&l.jsx("span",{className:"separator",children:"+"})]},s))})]})]},n)})}),l.jsx("style",{jsx:!0,children:`
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
      `})]})}function zj({recipes:t,onClose:e}){if(!t||t.length===0)return l.jsxs("div",{className:"solid-summary-empty",children:[l.jsx("p",{children:"No colours in design."}),l.jsx("button",{onClick:e,className:"close-button",children:"Close"})]});const r=t.reduce((n,i)=>n+i.targetColor.areaPct,0);return l.jsxs("div",{className:"solid-color-summary",children:[l.jsxs("div",{className:"summary-header",children:[l.jsx("h3",{children:"TPV Colours Used"}),l.jsx("button",{onClick:e,className:"close-button-icon",children:"×"})]}),l.jsx("div",{className:"summary-info",children:l.jsxs("p",{className:"summary-description",children:["This design uses ",l.jsx("strong",{children:t.length})," pure TPV colour",t.length!==1?"s":""," (no blending required)"]})}),l.jsx("div",{className:"colors-list",children:t.map((n,i)=>{const o=n.chosenRecipe.components[0],s=n.targetColor.areaPct;return l.jsxs("div",{className:"color-item",children:[l.jsx("div",{className:"color-swatch",style:{backgroundColor:n.blendColor.hex},title:`${o.code} - ${o.name}`}),l.jsxs("div",{className:"color-details",children:[l.jsxs("div",{className:"color-primary",children:[l.jsx("span",{className:"color-code",children:o.code}),l.jsx("span",{className:"color-name",children:o.name})]}),l.jsxs("div",{className:"color-secondary",children:[l.jsx("span",{className:"hex-value",children:n.blendColor.hex}),l.jsxs("span",{className:"coverage-badge",children:[s.toFixed(1),"%"]})]})]})]},i)})}),l.jsxs("div",{className:"summary-footer",children:[l.jsxs("div",{className:"footer-stat",children:[l.jsx("span",{className:"stat-label",children:"Total Coverage:"}),l.jsxs("span",{className:"stat-value",children:[r.toFixed(1),"%"]})]}),l.jsxs("div",{className:"footer-stat",children:[l.jsx("span",{className:"stat-label",children:"TPV Colours:"}),l.jsx("span",{className:"stat-value",children:t.length})]})]}),l.jsx("style",{jsx:!0,children:`
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
      `})]})}const en=[{code:"RH01",name:"Standard Red",hex:"#A5362F",R:165,G:54,B:47,L:39.4,a:58.5,b:29},{code:"RH02",name:"Bright Red",hex:"#E21F2F",R:226,G:31,B:47,L:47.4,a:70.1,b:44},{code:"RH10",name:"Standard Green",hex:"#609B63",R:96,G:155,B:99,L:40.5,a:-42.2,b:17.9},{code:"RH11",name:"Bright Green",hex:"#3BB44A",R:59,G:180,B:74,L:62.1,a:-47.7,b:47.2},{code:"RH12",name:"Dark Green",hex:"#006C55",R:0,G:108,B:85,L:39.6,a:-38.3,b:13.1},{code:"RH20",name:"Standard Blue",hex:"#0075BC",R:0,G:117,B:188,L:36.4,a:14.2,b:-46.7},{code:"RH21",name:"Purple",hex:"#493D8C",R:73,G:61,B:140,L:31.5,a:41.9,b:-40.9},{code:"RH22",name:"Light Blue",hex:"#47AFE3",R:71,G:175,B:227,L:55.3,a:-19.1,b:-37.3},{code:"RH23",name:"Azure",hex:"#039DC4",R:3,G:157,B:196,L:47.7,a:-4.8,b:-34.8},{code:"RH26",name:"Turquoise",hex:"#00A6A3",R:0,G:166,B:163,L:58.8,a:-38.4,b:-3},{code:"RH30",name:"Standard Beige",hex:"#E4C4AA",R:228,G:196,B:170,L:75.2,a:3.8,b:24.8},{code:"RH31",name:"Cream",hex:"#E8E3D8",R:232,G:227,B:216,L:91.8,a:-.5,b:12.5},{code:"RH32",name:"Brown",hex:"#8B5F3C",R:139,G:95,B:60,L:40,a:15.9,b:27.1},{code:"RH90",name:"Funky Pink",hex:"#E8457E",R:232,G:69,B:126,L:55,a:66.1,b:4.9},{code:"RH40",name:"Mustard Yellow",hex:"#E5A144",R:229,G:161,B:68,L:66,a:8.4,b:56.3},{code:"RH41",name:"Bright Yellow",hex:"#FFD833",R:255,G:216,B:51,L:86.9,a:-1,b:90.6},{code:"RH50",name:"Orange",hex:"#F15B32",R:241,G:91,B:50,L:63.2,a:49.8,b:60.2},{code:"RH60",name:"Dark Grey",hex:"#59595B",R:89,G:89,B:91,L:34.1,a:-.4,b:-2.4},{code:"RH61",name:"Light Grey",hex:"#939598",R:147,G:149,B:152,L:69,a:-.5,b:-1},{code:"RH65",name:"Pale Grey",hex:"#D9D9D6",R:217,G:217,B:214,L:87.6,a:-.2,b:-.7},{code:"RH70",name:"Black",hex:"#231F20",R:35,G:31,B:32,L:9.1,a:-.3,b:-6.3}];function Zf({content:t,position:e="top"}){const[r,n]=M.useState(!1);return l.jsxs("div",{className:"help-icon-container",children:[l.jsx("button",{className:"help-icon",onMouseEnter:()=>n(!0),onMouseLeave:()=>n(!1),onClick:i=>{i.preventDefault(),i.stopPropagation(),n(!r)},type:"button","aria-label":"Help",children:"?"}),r&&l.jsx("div",{className:`help-tooltip help-tooltip-${e}`,children:t}),l.jsx("style",{children:`
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
      `})]})}function Fj({recipes:t,mode:e="blend",onColorClick:r,selectedColor:n,editedColors:i,onResetAll:o}){if(!t||t.length===0)return null;const s=h=>!i||i.size===0?!1:i.has(h.originalColor.hex.toLowerCase()),a=i&&i.size>0,c=h=>{const f=h.toLowerCase();return en.find(p=>p.hex.toLowerCase()===f)},u=h=>{if(e==="solid"){const f=c(h.blendColor.hex);if(f)return`${f.code} - ${f.name}`}return h.blendColor.hex},d=h=>{if(!n)return!1;const f=n.blendHex||n.hex;return h.blendColor.hex===f||h.targetColor.hex===f};return l.jsxs("div",{className:"color-legend",children:[l.jsxs("div",{className:"legend-header",children:[l.jsxs("div",{className:"legend-header-left",children:[l.jsx("span",{className:"legend-title",children:"Colours"}),l.jsx(Zf,{content:"Click any colour to edit all instances of that colour across the design. Changes apply to every region using that colour.",position:"right"}),r&&l.jsx("span",{className:"edit-hint",children:"(click to edit)"})]}),a&&o&&l.jsx("button",{onClick:o,className:"reset-all-btn",title:"Reset all colours to original",children:"Reset All"})]}),l.jsx("div",{className:"legend-colors",children:t.map((h,f)=>l.jsxs("div",{className:`color-item ${r?"clickable":""} ${d(h)?"selected":""}`,onClick:()=>{r&&r({hex:h.targetColor.hex,originalHex:h.originalColor.hex,blendHex:h.blendColor.hex,areaPct:h.targetColor.areaPct,recipe:h.chosenRecipe,targetColor:h.targetColor},"palette")},title:r?"Click to edit this colour":"",children:[l.jsxs("div",{className:"color-swatch-wrapper",children:[l.jsx("div",{className:"color-swatch",style:{backgroundColor:h.blendColor.hex}}),s(h)&&l.jsx("span",{className:"edit-indicator",title:"Colour has been modified",children:l.jsx("svg",{viewBox:"0 0 24 24",fill:"currentColor",width:"12",height:"12",children:l.jsx("path",{d:"M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"})})})]}),l.jsxs("div",{className:"color-info",children:[l.jsx("span",{className:e==="solid"?"tpv-label":"hex-value",children:u(h)}),l.jsxs("span",{className:"coverage",children:[h.targetColor.areaPct.toFixed(1),"%"]})]})]},f))}),l.jsx("style",{jsx:!0,children:`
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
      `})]})}/*! @license DOMPurify 3.3.0 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.3.0/LICENSE */var ad,zg;function Fg(){if(zg)return ad;zg=1;const{entries:t,setPrototypeOf:e,isFrozen:r,getPrototypeOf:n,getOwnPropertyDescriptor:i}=Object;let{freeze:o,seal:s,create:a}=Object,{apply:c,construct:u}=typeof Reflect<"u"&&Reflect;o||(o=function(X){return X}),s||(s=function(X){return X}),c||(c=function(X,oe){for(var J=arguments.length,F=new Array(J>2?J-2:0),ee=2;ee<J;ee++)F[ee-2]=arguments[ee];return X.apply(oe,F)}),u||(u=function(X){for(var oe=arguments.length,J=new Array(oe>1?oe-1:0),F=1;F<oe;F++)J[F-1]=arguments[F];return new X(...J)});const d=R(Array.prototype.forEach),h=R(Array.prototype.lastIndexOf),f=R(Array.prototype.pop),p=R(Array.prototype.push),g=R(Array.prototype.splice),m=R(String.prototype.toLowerCase),b=R(String.prototype.toString),v=R(String.prototype.match),y=R(String.prototype.replace),x=R(String.prototype.indexOf),S=R(String.prototype.trim),j=R(Object.prototype.hasOwnProperty),_=R(RegExp.prototype.test),C=T(TypeError);function R(U){return function(X){X instanceof RegExp&&(X.lastIndex=0);for(var oe=arguments.length,J=new Array(oe>1?oe-1:0),F=1;F<oe;F++)J[F-1]=arguments[F];return c(U,X,J)}}function T(U){return function(){for(var X=arguments.length,oe=new Array(X),J=0;J<X;J++)oe[J]=arguments[J];return u(U,oe)}}function P(U,X){let oe=arguments.length>2&&arguments[2]!==void 0?arguments[2]:m;e&&e(U,null);let J=X.length;for(;J--;){let F=X[J];if(typeof F=="string"){const ee=oe(F);ee!==F&&(r(X)||(X[J]=ee),F=ee)}U[F]=!0}return U}function H(U){for(let X=0;X<U.length;X++)j(U,X)||(U[X]=null);return U}function E(U){const X=a(null);for(const[oe,J]of t(U))j(U,oe)&&(Array.isArray(J)?X[oe]=H(J):J&&typeof J=="object"&&J.constructor===Object?X[oe]=E(J):X[oe]=J);return X}function I(U,X){for(;U!==null;){const J=i(U,X);if(J){if(J.get)return R(J.get);if(typeof J.value=="function")return R(J.value)}U=n(U)}function oe(){return null}return oe}const w=o(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),z=o(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","enterkeyhint","exportparts","filter","font","g","glyph","glyphref","hkern","image","inputmode","line","lineargradient","marker","mask","metadata","mpath","part","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),Z=o(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),q=o(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),V=o(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),A=o(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),K=o(["#text"]),L=o(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","exportparts","face","for","headers","height","hidden","high","href","hreflang","id","inert","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","part","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","slot","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns","slot"]),B=o(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mask-type","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),fe=o(["accent","accentunder","align","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),te=o(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),ae=s(/\{\{[\w\W]*|[\w\W]*\}\}/gm),ge=s(/<%[\w\W]*|[\w\W]*%>/gm),je=s(/\$\{[\w\W]*/gm),me=s(/^data-[\-\w.\u00B7-\uFFFF]+$/),be=s(/^aria-[\-\w]+$/),Ue=s(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),We=s(/^(?:\w+script|data):/i),bt=s(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),et=s(/^html$/i),k=s(/^[a-z][.\w]*(-[.\w]+)+$/i);var re=Object.freeze({__proto__:null,ARIA_ATTR:be,ATTR_WHITESPACE:bt,CUSTOM_ELEMENT:k,DATA_ATTR:me,DOCTYPE_NAME:et,ERB_EXPR:ge,IS_ALLOWED_URI:Ue,IS_SCRIPT_OR_DATA:We,MUSTACHE_EXPR:ae,TMPLIT_EXPR:je});const G={element:1,text:3,progressingInstruction:7,comment:8,document:9},O=function(){return typeof window>"u"?null:window},N=function(X,oe){if(typeof X!="object"||typeof X.createPolicy!="function")return null;let J=null;const F="data-tt-policy-suffix";oe&&oe.hasAttribute(F)&&(J=oe.getAttribute(F));const ee="dompurify"+(J?"#"+J:"");try{return X.createPolicy(ee,{createHTML(ie){return ie},createScriptURL(ie){return ie}})}catch{return console.warn("TrustedTypes policy "+ee+" could not be created."),null}},D=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}};function Q(){let U=arguments.length>0&&arguments[0]!==void 0?arguments[0]:O();const X=Ne=>Q(Ne);if(X.version="3.3.0",X.removed=[],!U||!U.document||U.document.nodeType!==G.document||!U.Element)return X.isSupported=!1,X;let{document:oe}=U;const J=oe,F=J.currentScript,{DocumentFragment:ee,HTMLTemplateElement:ie,Node:ue,Element:ye,NodeFilter:we,NamedNodeMap:Ie=U.NamedNodeMap||U.MozNamedAttrMap,HTMLFormElement:ve,DOMParser:Ae,trustedTypes:ze}=U,Le=ye.prototype,ct=I(Le,"cloneNode"),tt=I(Le,"remove"),Me=I(Le,"nextSibling"),Fe=I(Le,"childNodes"),ut=I(Le,"parentNode");if(typeof ie=="function"){const Ne=oe.createElement("template");Ne.content&&Ne.content.ownerDocument&&(oe=Ne.content.ownerDocument)}let Ve,xt="";const{implementation:Qt,createNodeIterator:Gr,createDocumentFragment:el,getElementsByTagName:tl}=oe,{importNode:wu}=J;let At=D();X.isSupported=typeof t=="function"&&typeof ut=="function"&&Qt&&Qt.createHTMLDocument!==void 0;const{MUSTACHE_EXPR:_s,ERB_EXPR:Tn,TMPLIT_EXPR:Ss,DATA_ATTR:_u,ARIA_ATTR:Su,IS_SCRIPT_OR_DATA:Tr,ATTR_WHITESPACE:rl,CUSTOM_ELEMENT:Vr}=re;let{IS_ALLOWED_URI:li}=re,Xe=null;const nl=P({},[...w,...z,...Z,...V,...K]);let _t=null;const ci=P({},[...L,...B,...fe,...te]);let dt=Object.seal(a(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),Rn=null,Zi=null;const nn=Object.seal(a(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}}));let ks=!0,js=!0,il=!1,ui=!0,Nn=!1,di=!0,on=!1,Cs=!1,Ji=!1,sn=!1,Qi=!1,hi=!1,ol=!0,Es=!1;const Ts="user-content-";let eo=!0,fi=!1,an={},Pn=null;const Rs=P({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]);let Ns=null;const Ps=P({},["audio","video","img","source","image","track"]);let Os=null;const As=P({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),pi="http://www.w3.org/1998/Math/MathML",mi="http://www.w3.org/2000/svg",Rr="http://www.w3.org/1999/xhtml";let On=Rr,ln=!1,An=null;const ku=P({},[pi,mi,Rr],b);let to=P({},["mi","mo","mn","ms","mtext"]),gi=P({},["annotation-xml"]);const Y=P({},["title","style","font","a","script"]);let se=null;const de=["application/xhtml+xml","text/html"],pe="text/html";let Ce=null,Pe=null;const Te=oe.createElement("form"),Ee=function(W){return W instanceof RegExp||W instanceof Function},Be=function(){let W=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(!(Pe&&Pe===W)){if((!W||typeof W!="object")&&(W={}),W=E(W),se=de.indexOf(W.PARSER_MEDIA_TYPE)===-1?pe:W.PARSER_MEDIA_TYPE,Ce=se==="application/xhtml+xml"?b:m,Xe=j(W,"ALLOWED_TAGS")?P({},W.ALLOWED_TAGS,Ce):nl,_t=j(W,"ALLOWED_ATTR")?P({},W.ALLOWED_ATTR,Ce):ci,An=j(W,"ALLOWED_NAMESPACES")?P({},W.ALLOWED_NAMESPACES,b):ku,Os=j(W,"ADD_URI_SAFE_ATTR")?P(E(As),W.ADD_URI_SAFE_ATTR,Ce):As,Ns=j(W,"ADD_DATA_URI_TAGS")?P(E(Ps),W.ADD_DATA_URI_TAGS,Ce):Ps,Pn=j(W,"FORBID_CONTENTS")?P({},W.FORBID_CONTENTS,Ce):Rs,Rn=j(W,"FORBID_TAGS")?P({},W.FORBID_TAGS,Ce):E({}),Zi=j(W,"FORBID_ATTR")?P({},W.FORBID_ATTR,Ce):E({}),an=j(W,"USE_PROFILES")?W.USE_PROFILES:!1,ks=W.ALLOW_ARIA_ATTR!==!1,js=W.ALLOW_DATA_ATTR!==!1,il=W.ALLOW_UNKNOWN_PROTOCOLS||!1,ui=W.ALLOW_SELF_CLOSE_IN_ATTR!==!1,Nn=W.SAFE_FOR_TEMPLATES||!1,di=W.SAFE_FOR_XML!==!1,on=W.WHOLE_DOCUMENT||!1,sn=W.RETURN_DOM||!1,Qi=W.RETURN_DOM_FRAGMENT||!1,hi=W.RETURN_TRUSTED_TYPE||!1,Ji=W.FORCE_BODY||!1,ol=W.SANITIZE_DOM!==!1,Es=W.SANITIZE_NAMED_PROPS||!1,eo=W.KEEP_CONTENT!==!1,fi=W.IN_PLACE||!1,li=W.ALLOWED_URI_REGEXP||Ue,On=W.NAMESPACE||Rr,to=W.MATHML_TEXT_INTEGRATION_POINTS||to,gi=W.HTML_INTEGRATION_POINTS||gi,dt=W.CUSTOM_ELEMENT_HANDLING||{},W.CUSTOM_ELEMENT_HANDLING&&Ee(W.CUSTOM_ELEMENT_HANDLING.tagNameCheck)&&(dt.tagNameCheck=W.CUSTOM_ELEMENT_HANDLING.tagNameCheck),W.CUSTOM_ELEMENT_HANDLING&&Ee(W.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)&&(dt.attributeNameCheck=W.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),W.CUSTOM_ELEMENT_HANDLING&&typeof W.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements=="boolean"&&(dt.allowCustomizedBuiltInElements=W.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),Nn&&(js=!1),Qi&&(sn=!0),an&&(Xe=P({},K),_t=[],an.html===!0&&(P(Xe,w),P(_t,L)),an.svg===!0&&(P(Xe,z),P(_t,B),P(_t,te)),an.svgFilters===!0&&(P(Xe,Z),P(_t,B),P(_t,te)),an.mathMl===!0&&(P(Xe,V),P(_t,fe),P(_t,te))),W.ADD_TAGS&&(typeof W.ADD_TAGS=="function"?nn.tagCheck=W.ADD_TAGS:(Xe===nl&&(Xe=E(Xe)),P(Xe,W.ADD_TAGS,Ce))),W.ADD_ATTR&&(typeof W.ADD_ATTR=="function"?nn.attributeCheck=W.ADD_ATTR:(_t===ci&&(_t=E(_t)),P(_t,W.ADD_ATTR,Ce))),W.ADD_URI_SAFE_ATTR&&P(Os,W.ADD_URI_SAFE_ATTR,Ce),W.FORBID_CONTENTS&&(Pn===Rs&&(Pn=E(Pn)),P(Pn,W.FORBID_CONTENTS,Ce)),eo&&(Xe["#text"]=!0),on&&P(Xe,["html","head","body"]),Xe.table&&(P(Xe,["tbody"]),delete Rn.tbody),W.TRUSTED_TYPES_POLICY){if(typeof W.TRUSTED_TYPES_POLICY.createHTML!="function")throw C('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof W.TRUSTED_TYPES_POLICY.createScriptURL!="function")throw C('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');Ve=W.TRUSTED_TYPES_POLICY,xt=Ve.createHTML("")}else Ve===void 0&&(Ve=N(ze,F)),Ve!==null&&typeof xt=="string"&&(xt=Ve.createHTML(""));o&&o(W),Pe=W}},De=P({},[...z,...Z,...q]),Qe=P({},[...V,...A]),Nt=function(W){let ce=ut(W);(!ce||!ce.tagName)&&(ce={namespaceURI:On,tagName:"template"});const _e=m(W.tagName),ht=m(ce.tagName);return An[W.namespaceURI]?W.namespaceURI===mi?ce.namespaceURI===Rr?_e==="svg":ce.namespaceURI===pi?_e==="svg"&&(ht==="annotation-xml"||to[ht]):!!De[_e]:W.namespaceURI===pi?ce.namespaceURI===Rr?_e==="math":ce.namespaceURI===mi?_e==="math"&&gi[ht]:!!Qe[_e]:W.namespaceURI===Rr?ce.namespaceURI===mi&&!gi[ht]||ce.namespaceURI===pi&&!to[ht]?!1:!Qe[_e]&&(Y[_e]||!De[_e]):!!(se==="application/xhtml+xml"&&An[W.namespaceURI]):!1},qe=function(W){p(X.removed,{element:W});try{ut(W).removeChild(W)}catch{tt(W)}},Ye=function(W,ce){try{p(X.removed,{attribute:ce.getAttributeNode(W),from:ce})}catch{p(X.removed,{attribute:null,from:ce})}if(ce.removeAttribute(W),W==="is")if(sn||Qi)try{qe(ce)}catch{}else try{ce.setAttribute(W,"")}catch{}},Ze=function(W){let ce=null,_e=null;if(Ji)W="<remove></remove>"+W;else{const kt=v(W,/^[\r\n\t ]+/);_e=kt&&kt[0]}se==="application/xhtml+xml"&&On===Rr&&(W='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+W+"</body></html>");const ht=Ve?Ve.createHTML(W):W;if(On===Rr)try{ce=new Ae().parseFromString(ht,se)}catch{}if(!ce||!ce.documentElement){ce=Qt.createDocument(On,"template",null);try{ce.documentElement.innerHTML=ln?xt:ht}catch{}}const zt=ce.body||ce.documentElement;return W&&_e&&zt.insertBefore(oe.createTextNode(_e),zt.childNodes[0]||null),On===Rr?tl.call(ce,on?"html":"body")[0]:on?ce.documentElement:zt},vi=function(W){return Gr.call(W.ownerDocument||W,W,we.SHOW_ELEMENT|we.SHOW_COMMENT|we.SHOW_TEXT|we.SHOW_PROCESSING_INSTRUCTION|we.SHOW_CDATA_SECTION,null)},yi=function(W){return W instanceof ve&&(typeof W.nodeName!="string"||typeof W.textContent!="string"||typeof W.removeChild!="function"||!(W.attributes instanceof Ie)||typeof W.removeAttribute!="function"||typeof W.setAttribute!="function"||typeof W.namespaceURI!="string"||typeof W.insertBefore!="function"||typeof W.hasChildNodes!="function")},Gp=function(W){return typeof ue=="function"&&W instanceof ue};function cn(Ne,W,ce){d(Ne,_e=>{_e.call(X,W,ce,Pe)})}const Vp=function(W){let ce=null;if(cn(At.beforeSanitizeElements,W,null),yi(W))return qe(W),!0;const _e=Ce(W.nodeName);if(cn(At.uponSanitizeElement,W,{tagName:_e,allowedTags:Xe}),di&&W.hasChildNodes()&&!Gp(W.firstElementChild)&&_(/<[/\w!]/g,W.innerHTML)&&_(/<[/\w!]/g,W.textContent)||W.nodeType===G.progressingInstruction||di&&W.nodeType===G.comment&&_(/<[/\w]/g,W.data))return qe(W),!0;if(!(nn.tagCheck instanceof Function&&nn.tagCheck(_e))&&(!Xe[_e]||Rn[_e])){if(!Rn[_e]&&Kp(_e)&&(dt.tagNameCheck instanceof RegExp&&_(dt.tagNameCheck,_e)||dt.tagNameCheck instanceof Function&&dt.tagNameCheck(_e)))return!1;if(eo&&!Pn[_e]){const ht=ut(W)||W.parentNode,zt=Fe(W)||W.childNodes;if(zt&&ht){const kt=zt.length;for(let er=kt-1;er>=0;--er){const un=ct(zt[er],!0);un.__removalCount=(W.__removalCount||0)+1,ht.insertBefore(un,Me(W))}}}return qe(W),!0}return W instanceof ye&&!Nt(W)||(_e==="noscript"||_e==="noembed"||_e==="noframes")&&_(/<\/no(script|embed|frames)/i,W.innerHTML)?(qe(W),!0):(Nn&&W.nodeType===G.text&&(ce=W.textContent,d([_s,Tn,Ss],ht=>{ce=y(ce,ht," ")}),W.textContent!==ce&&(p(X.removed,{element:W.cloneNode()}),W.textContent=ce)),cn(At.afterSanitizeElements,W,null),!1)},qp=function(W,ce,_e){if(ol&&(ce==="id"||ce==="name")&&(_e in oe||_e in Te))return!1;if(!(js&&!Zi[ce]&&_(_u,ce))){if(!(ks&&_(Su,ce))){if(!(nn.attributeCheck instanceof Function&&nn.attributeCheck(ce,W))){if(!_t[ce]||Zi[ce]){if(!(Kp(W)&&(dt.tagNameCheck instanceof RegExp&&_(dt.tagNameCheck,W)||dt.tagNameCheck instanceof Function&&dt.tagNameCheck(W))&&(dt.attributeNameCheck instanceof RegExp&&_(dt.attributeNameCheck,ce)||dt.attributeNameCheck instanceof Function&&dt.attributeNameCheck(ce,W))||ce==="is"&&dt.allowCustomizedBuiltInElements&&(dt.tagNameCheck instanceof RegExp&&_(dt.tagNameCheck,_e)||dt.tagNameCheck instanceof Function&&dt.tagNameCheck(_e))))return!1}else if(!Os[ce]){if(!_(li,y(_e,rl,""))){if(!((ce==="src"||ce==="xlink:href"||ce==="href")&&W!=="script"&&x(_e,"data:")===0&&Ns[W])){if(!(il&&!_(Tr,y(_e,rl,"")))){if(_e)return!1}}}}}}}return!0},Kp=function(W){return W!=="annotation-xml"&&v(W,Vr)},Yp=function(W){cn(At.beforeSanitizeAttributes,W,null);const{attributes:ce}=W;if(!ce||yi(W))return;const _e={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:_t,forceKeepAttr:void 0};let ht=ce.length;for(;ht--;){const zt=ce[ht],{name:kt,namespaceURI:er,value:un}=zt,ro=Ce(kt),ju=un;let $t=kt==="value"?ju:S(ju);if(_e.attrName=ro,_e.attrValue=$t,_e.keepAttr=!0,_e.forceKeepAttr=void 0,cn(At.uponSanitizeAttribute,W,_e),$t=_e.attrValue,Es&&(ro==="id"||ro==="name")&&(Ye(kt,W),$t=Ts+$t),di&&_(/((--!?|])>)|<\/(style|title|textarea)/i,$t)){Ye(kt,W);continue}if(ro==="attributename"&&v($t,"href")){Ye(kt,W);continue}if(_e.forceKeepAttr)continue;if(!_e.keepAttr){Ye(kt,W);continue}if(!ui&&_(/\/>/i,$t)){Ye(kt,W);continue}Nn&&d([_s,Tn,Ss],Zp=>{$t=y($t,Zp," ")});const Xp=Ce(W.nodeName);if(!qp(Xp,ro,$t)){Ye(kt,W);continue}if(Ve&&typeof ze=="object"&&typeof ze.getAttributeType=="function"&&!er)switch(ze.getAttributeType(Xp,ro)){case"TrustedHTML":{$t=Ve.createHTML($t);break}case"TrustedScriptURL":{$t=Ve.createScriptURL($t);break}}if($t!==ju)try{er?W.setAttributeNS(er,kt,$t):W.setAttribute(kt,$t),yi(W)?qe(W):f(X.removed)}catch{Ye(kt,W)}}cn(At.afterSanitizeAttributes,W,null)},D1=function Ne(W){let ce=null;const _e=vi(W);for(cn(At.beforeSanitizeShadowDOM,W,null);ce=_e.nextNode();)cn(At.uponSanitizeShadowNode,ce,null),Vp(ce),Yp(ce),ce.content instanceof ee&&Ne(ce.content);cn(At.afterSanitizeShadowDOM,W,null)};return X.sanitize=function(Ne){let W=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},ce=null,_e=null,ht=null,zt=null;if(ln=!Ne,ln&&(Ne="<!-->"),typeof Ne!="string"&&!Gp(Ne))if(typeof Ne.toString=="function"){if(Ne=Ne.toString(),typeof Ne!="string")throw C("dirty is not a string, aborting")}else throw C("toString is not a function");if(!X.isSupported)return Ne;if(Cs||Be(W),X.removed=[],typeof Ne=="string"&&(fi=!1),fi){if(Ne.nodeName){const un=Ce(Ne.nodeName);if(!Xe[un]||Rn[un])throw C("root node is forbidden and cannot be sanitized in-place")}}else if(Ne instanceof ue)ce=Ze("<!---->"),_e=ce.ownerDocument.importNode(Ne,!0),_e.nodeType===G.element&&_e.nodeName==="BODY"||_e.nodeName==="HTML"?ce=_e:ce.appendChild(_e);else{if(!sn&&!Nn&&!on&&Ne.indexOf("<")===-1)return Ve&&hi?Ve.createHTML(Ne):Ne;if(ce=Ze(Ne),!ce)return sn?null:hi?xt:""}ce&&Ji&&qe(ce.firstChild);const kt=vi(fi?Ne:ce);for(;ht=kt.nextNode();)Vp(ht),Yp(ht),ht.content instanceof ee&&D1(ht.content);if(fi)return Ne;if(sn){if(Qi)for(zt=el.call(ce.ownerDocument);ce.firstChild;)zt.appendChild(ce.firstChild);else zt=ce;return(_t.shadowroot||_t.shadowrootmode)&&(zt=wu.call(J,zt,!0)),zt}let er=on?ce.outerHTML:ce.innerHTML;return on&&Xe["!doctype"]&&ce.ownerDocument&&ce.ownerDocument.doctype&&ce.ownerDocument.doctype.name&&_(et,ce.ownerDocument.doctype.name)&&(er="<!DOCTYPE "+ce.ownerDocument.doctype.name+`>
`+er),Nn&&d([_s,Tn,Ss],un=>{er=y(er,un," ")}),Ve&&hi?Ve.createHTML(er):er},X.setConfig=function(){let Ne=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};Be(Ne),Cs=!0},X.clearConfig=function(){Pe=null,Cs=!1},X.isValidAttribute=function(Ne,W,ce){Pe||Be({});const _e=Ce(Ne),ht=Ce(W);return qp(_e,ht,ce)},X.addHook=function(Ne,W){typeof W=="function"&&p(At[Ne],W)},X.removeHook=function(Ne,W){if(W!==void 0){const ce=h(At[Ne],W);return ce===-1?void 0:g(At[Ne],ce,1)[0]}return f(At[Ne])},X.removeHooks=function(Ne){At[Ne]=[]},X.removeAllHooks=function(){At=D()},X}var ne=Q();return ad=ne,ad}var Bj=self.DOMPurify||(self.DOMPurify=Fg().default||Fg());const Uj=zc(Bj);function lw(t,e={}){if(!t||typeof t!="string")return console.warn("[SVG-SANITIZE] Invalid input:",typeof t),"";const r={USE_PROFILES:{svg:!0,svgFilters:!0},FORBID_TAGS:["script","foreignObject","iframe","embed"],FORBID_ATTR:["onload","onerror","onclick","onmouseover","onmouseout","onmouseenter","onmouseleave","onmousemove","onmousedown","onmouseup","onfocus","onblur","onkeydown","onkeyup","onkeypress","onsubmit","onreset","onselect","onchange","oninput","onanimationstart","onanimationend","onanimationiteration","ontransitionend","ontransitionrun","ontransitionstart","ontransitioncancel","xlink:href",...e.additionalForbiddenAttrs||[]],ALLOW_DATA_ATTR:!0,ALLOW_COMMENTS:!1,RETURN_DOM:!1,RETURN_DOM_FRAGMENT:!1,ALLOWED_URI_REGEXP:/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,HOOKS:{afterSanitizeAttributes:n=>{if(n.hasAttribute("href")){const i=n.getAttribute("href");i&&i.toLowerCase().trim().startsWith("javascript:")&&(n.removeAttribute("href"),console.warn("[SVG-SANITIZE] Removed javascript: href"))}if(n.hasAttribute("xlink:href")){const i=n.getAttribute("xlink:href");i&&(i.toLowerCase().trim().startsWith("javascript:")||i.toLowerCase().trim().startsWith("data:text/html"))&&(n.removeAttribute("xlink:href"),console.warn("[SVG-SANITIZE] Removed dangerous xlink:href"))}}},...e};try{const n=Uj.sanitize(t,r);if(!n||!n.includes("<svg"))return console.error("[SVG-SANITIZE] Sanitization removed SVG content - input may be malicious"),"";const i=t.length,o=n.length,s=(i-o)/i*100;return s>10&&console.warn(`[SVG-SANITIZE] Removed ${s.toFixed(1)}% of content (${i-o} chars) - possible malicious SVG detected`),n}catch(n){return console.error("[SVG-SANITIZE] Sanitization failed:",n),""}}function Bg({blendSvgUrl:t,recipes:e,mode:r="blend",onColorClick:n,onRegionClick:i,onEyedropperCancel:o,selectedColor:s,editedColors:a,onResetAll:c,designName:u="",onNameChange:d,isNameLoading:h=!1,onInSituClick:f,eyedropperActive:p=!1,eyedropperRegion:g=null,onRegionUndo:m,onRegionRedo:b,canUndo:v=!1,canRedo:y=!1,regionOverridesCount:x=0}){const[S,j]=M.useState(null),[_,C]=M.useState(null),R=M.useRef(null),T=M.useRef(null);M.useRef(null);const[P,H]=M.useState(1),[E,I]=M.useState({x:0,y:0}),[w,z]=M.useState(!1),[Z,q]=M.useState({x:0,y:0}),V=M.useRef(null),A=M.useRef(!1),[K,L]=M.useState(()=>localStorage.getItem("tpv_color_editing_tip_dismissed")!=="true"),B=()=>{L(!1),localStorage.setItem("tpv_color_editing_tip_dismissed","true")};M.useEffect(()=>{if(!t){C(null);return}(async()=>{try{const N=await(await fetch(t)).text();C(N);const D=N.includes("data-region-id"),Q=(N.match(/data-region-id/g)||[]).length;console.log("[SVGPreview] Fetched inline SVG content - length:",N.length,"hasRegionTags:",D,"regionCount:",Q)}catch(O){console.error("[SVGPreview] Failed to fetch SVG content:",O),C(null)}})()},[t]);const fe=M.useMemo(()=>{if(!_)return null;console.log("[SVGPreview] Sanitizing SVG content...");const G=lw(_);return G?(console.log("[SVGPreview] SVG sanitization complete - length:",G.length),console.log("[SVGPreview] Sanitized content preview:",G.substring(0,200)),G.includes("<svg")?G.replace(/<svg([^>]*)>/i,(N,D)=>(D.includes("width=")||(D+=' width="100%"'),D.includes("height=")||(D+=' height="100%"'),`<svg${D}>`)):(console.error("[SVGPreview] Sanitized SVG does not contain <svg> tag!"),null)):(console.error("[SVGPreview] SVG sanitization failed - content rejected"),null)},[_]);M.useEffect(()=>{if(!s||!t){j(null);return}(async()=>{try{console.log("[SVGPreview] Creating highlight for color:",s);const O=new Image;O.crossOrigin="anonymous";const N=new Promise((ue,ye)=>{O.onload=()=>{console.log("[SVGPreview] Image loaded:",O.width,"x",O.height),ue()},O.onerror=we=>{console.error("[SVGPreview] Image load error:",we),ye(we)}});O.src=t,await N;const D=document.createElement("canvas");D.width=O.naturalWidth||O.width||1e3,D.height=O.naturalHeight||O.height||1e3;const Q=D.getContext("2d");Q.drawImage(O,0,0);const U=Q.getImageData(0,0,D.width,D.height).data,X=s.hex,oe=te(X);console.log("[SVGPreview] Target color:",X,oe);const J=new Set;let F=0;for(let ue=0;ue<D.height;ue++)for(let ye=0;ye<D.width;ye++){const we=(ue*D.width+ye)*4,Ie=U[we],ve=U[we+1],Ae=U[we+2];U[we+3]>0&&ae(Ie,ve,Ae,oe)&&(J.add(`${ye},${ue}`),F++)}if(console.log("[SVGPreview] Matched pixels:",F),F===0){console.warn("[SVGPreview] No pixels matched the target color"),j(null);return}const ee=Q.createImageData(D.width,D.height);for(let ue=0;ue<D.height;ue++)for(let ye=0;ye<D.width;ye++){const we=(ue*D.width+ye)*4;J.has(`${ye},${ue}`)&&(!J.has(`${ye-1},${ue}`)||!J.has(`${ye+1},${ue}`)||!J.has(`${ye},${ue-1}`)||!J.has(`${ye},${ue+1}`))&&(ee.data[we]=255,ee.data[we+1]=0,ee.data[we+2]=255,ee.data[we+3]=255)}Q.clearRect(0,0,D.width,D.height),Q.putImageData(ee,0,0);const ie=D.toDataURL();console.log("[SVGPreview] Highlight mask created"),j(ie)}catch(O){console.error("[SVGPreview] Failed to create highlight mask:",O),j(null)}})()},[s,t]);const te=G=>{const O=G.replace("#","");return{r:parseInt(O.substring(0,2),16),g:parseInt(O.substring(2,4),16),b:parseInt(O.substring(4,6),16)}},ae=(G,O,N,D)=>Math.abs(G-D.r)<=50&&Math.abs(O-D.g)<=50&&Math.abs(N-D.b)<=50,ge=async(G,O)=>{try{if(!R.current||!t)return null;const N=new Image;N.crossOrigin="anonymous";const D=new Promise((ue,ye)=>{N.onload=ue,N.onerror=ye});N.src=t,await D;const Q=document.createElement("canvas");Q.width=N.naturalWidth||N.width||1e3,Q.height=N.naturalHeight||N.height||1e3;const ne=Q.getContext("2d");ne.drawImage(N,0,0);const U=R.current.getBoundingClientRect(),X=Q.width/U.width,oe=Q.height/U.height,J=Math.floor(G*X),F=Math.floor(O*oe),ie=ne.getImageData(J,F,1,1).data;return{r:ie[0],g:ie[1],b:ie[2],a:ie[3]}}catch(N){return console.error("[SVGPreview] Failed to get color at position:",N),null}},je=()=>{H(G=>Math.min(G*1.5,5))},me=()=>{H(G=>Math.max(G/1.5,.5))},be=()=>{H(1),I({x:0,y:0})},Ue=G=>{G.preventDefault();const O=G.deltaY*-.001;H(N=>Math.min(Math.max(N+O,.5),5))},We=G=>{G.button===0&&(z(!0),q({x:G.clientX-E.x,y:G.clientY-E.y}),A.current=!1)},bt=G=>{if(!w)return;const O=Math.abs(G.clientX-(Z.x+E.x)),N=Math.abs(G.clientY-(Z.y+E.y));(O>5||N>5)&&(A.current=!0),I({x:G.clientX-Z.x,y:G.clientY-Z.y})},et=()=>{z(!1)};M.useEffect(()=>{if(w)return document.addEventListener("mousemove",bt),document.addEventListener("mouseup",et),()=>{document.removeEventListener("mousemove",bt),document.removeEventListener("mouseup",et)}},[w,Z,E]);const k=G=>{let O=G;for(;O&&O!==T.current;){if(O.hasAttribute&&O.hasAttribute("data-region-id"))return O;O=O.parentElement}return null},re=async G=>{var X,oe;if(A.current){console.log("[SVGPreview] Click ignored - was dragging");return}if(console.log("[SVGPreview] Click detected - onRegionClick:",!!i,"inlineSvgContent:",!!_,"target:",G.target.tagName),i&&_){console.log("[SVGPreview] Attempting region detection on target:",G.target);const J=k(G.target);if(console.log("[SVGPreview] Found region element:",J),J){const F=J.getAttribute("data-region-id"),ee=J.getAttribute("fill")||((oe=(X=J.getAttribute("style"))==null?void 0:X.match(/fill:\s*([^;]+)/))==null?void 0:oe[1]);console.log("[SVGPreview] Region clicked:",F,"fill:",ee),i({regionId:F,sourceColor:ee,element:J});return}else console.log("[SVGPreview] No region element found from target")}else console.log("[SVGPreview] Region detection skipped - onRegionClick:",!!i,"inlineSvgContent:",!!_);if(!n||!e||e.length===0)return;const O=G.currentTarget.getBoundingClientRect(),N=G.clientX-O.left,D=G.clientY-O.top;console.log("[SVGPreview] Clicked at:",N,D);const Q=await ge(N,D);if(!Q||Q.a===0){console.log("[SVGPreview] Clicked on transparent area");return}console.log("[SVGPreview] Clicked color:",Q);let ne=null,U=1/0;for(const J of e){const F=J.targetColor.hex,ee=te(F);if(ae(Q.r,Q.g,Q.b,ee)){const ie=Math.sqrt(Math.pow(Q.r-ee.r,2)+Math.pow(Q.g-ee.g,2)+Math.pow(Q.b-ee.b,2));ie<U&&(U=ie,ne=J)}}ne?(console.log("[SVGPreview] Matched recipe:",ne.targetColor.hex),n({hex:ne.targetColor.hex,originalHex:ne.originalColor.hex,blendHex:ne.blendColor.hex,areaPct:ne.targetColor.areaPct,recipe:ne.chosenRecipe,targetColor:ne.targetColor})):console.log("[SVGPreview] No matching recipe found for clicked color")};return t?l.jsxs("div",{className:"svg-preview",children:[l.jsxs("div",{className:"preview-header",children:[l.jsxs("div",{className:"design-name-container",children:[d?l.jsx("input",{type:"text",className:"design-name-input",value:u,onChange:G=>d(G.target.value),placeholder:h?"Generating name...":"Enter project name"}):l.jsx("h3",{children:u||"TPV Blend Design"}),h&&l.jsx("span",{className:"name-loading",children:"Generating..."})]}),s&&l.jsxs("span",{className:"editing-hint",children:["Editing: ",s.hex||s.blendHex]})]}),K&&n&&l.jsxs("div",{className:"color-editing-tip",children:[l.jsx("div",{className:"tip-icon",children:"💡"}),l.jsxs("div",{className:"tip-content",children:[l.jsx("strong",{children:"Tip:"})," Click colours in the legend below to edit all instances, or click directly on the design to edit individual regions."]}),l.jsx("button",{onClick:B,className:"tip-close",title:"Dismiss tip",children:"×"})]}),l.jsxs("div",{className:"svg-display-container",children:[l.jsxs("div",{className:"svg-panel",children:[l.jsxs("div",{className:"zoom-controls",children:[l.jsx("button",{onClick:je,className:"zoom-btn",title:"Zoom In",children:l.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[l.jsx("circle",{cx:"11",cy:"11",r:"8"}),l.jsx("line",{x1:"11",y1:"8",x2:"11",y2:"14"}),l.jsx("line",{x1:"8",y1:"11",x2:"14",y2:"11"}),l.jsx("path",{d:"m21 21-4.35-4.35"})]})}),l.jsx("button",{onClick:me,className:"zoom-btn",title:"Zoom Out",children:l.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[l.jsx("circle",{cx:"11",cy:"11",r:"8"}),l.jsx("line",{x1:"8",y1:"11",x2:"14",y2:"11"}),l.jsx("path",{d:"m21 21-4.35-4.35"})]})}),l.jsx("button",{onClick:be,className:"zoom-btn",title:"Reset View",children:l.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[l.jsx("path",{d:"M1 4v6h6"}),l.jsx("path",{d:"M23 20v-6h-6"}),l.jsx("path",{d:"M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"})]})}),l.jsxs("span",{className:"zoom-level",children:[Math.round(P*100),"%"]})]}),x>0&&l.jsxs("div",{className:"undo-redo-controls",children:[l.jsx("button",{onClick:m,className:"undo-redo-btn",title:"Undo (Ctrl+Z)",disabled:!v,children:l.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[l.jsx("path",{d:"M3 7v6h6"}),l.jsx("path",{d:"M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"})]})}),l.jsx("button",{onClick:b,className:"undo-redo-btn",title:"Redo (Ctrl+Y)",disabled:!y,children:l.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[l.jsx("path",{d:"M21 7v6h-6"}),l.jsx("path",{d:"M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"})]})})]}),f&&l.jsxs("button",{onClick:f,className:"in-situ-btn",title:"Upload a photo of your installation site and see how this design will look in place with realistic perspective",children:[l.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[l.jsx("rect",{x:"3",y:"3",width:"18",height:"18",rx:"2",ry:"2"}),l.jsx("circle",{cx:"8.5",cy:"8.5",r:"1.5"}),l.jsx("path",{d:"m21 15-5-5L5 21"})]}),l.jsx("span",{children:"Preview In-Situ"})]}),l.jsx("div",{ref:V,className:"svg-wrapper",onWheel:Ue,children:l.jsxs("div",{className:"svg-image-container",onClick:re,onMouseDown:We,style:{transform:`translate(${E.x}px, ${E.y}px) scale(${P})`,cursor:w?"grabbing":P>1?"grab":p?"crosshair":n?"pointer":"default"},children:[fe?l.jsx("div",{ref:T,className:"svg-inline-container",style:{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center"},dangerouslySetInnerHTML:{__html:fe}}):l.jsx("img",{ref:R,src:t,alt:"TPV blend design",className:"svg-image"}),S&&l.jsx("img",{src:S,alt:"Colour highlight",className:"svg-highlight-mask"})]})}),p&&g&&l.jsx("div",{className:"eyedropper-overlay",children:l.jsxs("div",{className:"eyedropper-content",children:[l.jsxs("div",{className:"eyedropper-color-indicator",children:[l.jsx("div",{className:"eyedropper-color-swatch",style:{backgroundColor:g.sourceColor}}),l.jsx("span",{children:"Click another area to copy its colour"})]}),l.jsx("button",{className:"eyedropper-cancel",onClick:G=>{G.stopPropagation(),o&&o()},children:"Cancel (Esc)"})]})})]}),e&&e.length>0&&l.jsx("div",{className:"legend-sidebar",children:l.jsx(Fj,{recipes:e,mode:r,onColorClick:n,selectedColor:s,editedColors:a,onResetAll:c})})]}),l.jsx("style",{jsx:!0,children:`
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
      `})]}):null}var _r={},Wa={},Hj=typeof Un=="object"&&Un&&Un.Object===Object&&Un,cw=Hj,Wj=cw,Gj=typeof self=="object"&&self&&self.Object===Object&&self,Vj=Wj||Gj||Function("return this")(),rn=Vj,qj=rn,Kj=qj.Symbol,Ga=Kj,Ug=Ga,uw=Object.prototype,Yj=uw.hasOwnProperty,Xj=uw.toString,Us=Ug?Ug.toStringTag:void 0;function Zj(t){var e=Yj.call(t,Us),r=t[Us];try{t[Us]=void 0;var n=!0}catch{}var i=Xj.call(t);return n&&(e?t[Us]=r:delete t[Us]),i}var Jj=Zj,Qj=Object.prototype,eC=Qj.toString;function tC(t){return eC.call(t)}var rC=tC,Hg=Ga,nC=Jj,iC=rC,oC="[object Null]",sC="[object Undefined]",Wg=Hg?Hg.toStringTag:void 0;function aC(t){return t==null?t===void 0?sC:oC:Wg&&Wg in Object(t)?nC(t):iC(t)}var Wi=aC,lC=Array.isArray,Hr=lC;function cC(t){return t!=null&&typeof t=="object"}var jn=cC,uC=Wi,dC=Hr,hC=jn,fC="[object String]";function pC(t){return typeof t=="string"||!dC(t)&&hC(t)&&uC(t)==fC}var mC=pC;function gC(t){return function(e,r,n){for(var i=-1,o=Object(e),s=n(e),a=s.length;a--;){var c=s[t?a:++i];if(r(o[c],c,o)===!1)break}return e}}var vC=gC,yC=vC,bC=yC(),xC=bC;function wC(t,e){for(var r=-1,n=Array(t);++r<t;)n[r]=e(r);return n}var _C=wC,SC=Wi,kC=jn,jC="[object Arguments]";function CC(t){return kC(t)&&SC(t)==jC}var EC=CC,Gg=EC,TC=jn,dw=Object.prototype,RC=dw.hasOwnProperty,NC=dw.propertyIsEnumerable,PC=Gg(function(){return arguments}())?Gg:function(t){return TC(t)&&RC.call(t,"callee")&&!NC.call(t,"callee")},hw=PC,Tc={exports:{}};function OC(){return!1}var AC=OC;Tc.exports;(function(t,e){var r=rn,n=AC,i=e&&!e.nodeType&&e,o=i&&!0&&t&&!t.nodeType&&t,s=o&&o.exports===i,a=s?r.Buffer:void 0,c=a?a.isBuffer:void 0,u=c||n;t.exports=u})(Tc,Tc.exports);var Jf=Tc.exports,$C=9007199254740991,IC=/^(?:0|[1-9]\d*)$/;function MC(t,e){var r=typeof t;return e=e??$C,!!e&&(r=="number"||r!="symbol"&&IC.test(t))&&t>-1&&t%1==0&&t<e}var fw=MC,LC=9007199254740991;function DC(t){return typeof t=="number"&&t>-1&&t%1==0&&t<=LC}var Qf=DC,zC=Wi,FC=Qf,BC=jn,UC="[object Arguments]",HC="[object Array]",WC="[object Boolean]",GC="[object Date]",VC="[object Error]",qC="[object Function]",KC="[object Map]",YC="[object Number]",XC="[object Object]",ZC="[object RegExp]",JC="[object Set]",QC="[object String]",eE="[object WeakMap]",tE="[object ArrayBuffer]",rE="[object DataView]",nE="[object Float32Array]",iE="[object Float64Array]",oE="[object Int8Array]",sE="[object Int16Array]",aE="[object Int32Array]",lE="[object Uint8Array]",cE="[object Uint8ClampedArray]",uE="[object Uint16Array]",dE="[object Uint32Array]",st={};st[nE]=st[iE]=st[oE]=st[sE]=st[aE]=st[lE]=st[cE]=st[uE]=st[dE]=!0;st[UC]=st[HC]=st[tE]=st[WC]=st[rE]=st[GC]=st[VC]=st[qC]=st[KC]=st[YC]=st[XC]=st[ZC]=st[JC]=st[QC]=st[eE]=!1;function hE(t){return BC(t)&&FC(t.length)&&!!st[zC(t)]}var fE=hE;function pE(t){return function(e){return t(e)}}var ep=pE,Rc={exports:{}};Rc.exports;(function(t,e){var r=cw,n=e&&!e.nodeType&&e,i=n&&!0&&t&&!t.nodeType&&t,o=i&&i.exports===n,s=o&&r.process,a=function(){try{var c=i&&i.require&&i.require("util").types;return c||s&&s.binding&&s.binding("util")}catch{}}();t.exports=a})(Rc,Rc.exports);var tp=Rc.exports,mE=fE,gE=ep,Vg=tp,qg=Vg&&Vg.isTypedArray,vE=qg?gE(qg):mE,pw=vE,yE=_C,bE=hw,xE=Hr,wE=Jf,_E=fw,SE=pw,kE=Object.prototype,jE=kE.hasOwnProperty;function CE(t,e){var r=xE(t),n=!r&&bE(t),i=!r&&!n&&wE(t),o=!r&&!n&&!i&&SE(t),s=r||n||i||o,a=s?yE(t.length,String):[],c=a.length;for(var u in t)(e||jE.call(t,u))&&!(s&&(u=="length"||i&&(u=="offset"||u=="parent")||o&&(u=="buffer"||u=="byteLength"||u=="byteOffset")||_E(u,c)))&&a.push(u);return a}var mw=CE,EE=Object.prototype;function TE(t){var e=t&&t.constructor,r=typeof e=="function"&&e.prototype||EE;return t===r}var rp=TE;function RE(t,e){return function(r){return t(e(r))}}var gw=RE,NE=gw,PE=NE(Object.keys,Object),OE=PE,AE=rp,$E=OE,IE=Object.prototype,ME=IE.hasOwnProperty;function LE(t){if(!AE(t))return $E(t);var e=[];for(var r in Object(t))ME.call(t,r)&&r!="constructor"&&e.push(r);return e}var DE=LE;function zE(t){var e=typeof t;return t!=null&&(e=="object"||e=="function")}var hs=zE,FE=Wi,BE=hs,UE="[object AsyncFunction]",HE="[object Function]",WE="[object GeneratorFunction]",GE="[object Proxy]";function VE(t){if(!BE(t))return!1;var e=FE(t);return e==HE||e==WE||e==UE||e==GE}var vw=VE,qE=vw,KE=Qf;function YE(t){return t!=null&&KE(t.length)&&!qE(t)}var ou=YE,XE=mw,ZE=DE,JE=ou;function QE(t){return JE(t)?XE(t):ZE(t)}var Va=QE,e5=xC,t5=Va;function r5(t,e){return t&&e5(t,e,t5)}var yw=r5;function n5(t){return t}var bw=n5,i5=bw;function o5(t){return typeof t=="function"?t:i5}var s5=o5,a5=yw,l5=s5;function c5(t,e){return t&&a5(t,l5(e))}var np=c5,u5=gw,d5=u5(Object.getPrototypeOf,Object),ip=d5,h5=Wi,f5=ip,p5=jn,m5="[object Object]",g5=Function.prototype,v5=Object.prototype,xw=g5.toString,y5=v5.hasOwnProperty,b5=xw.call(Object);function x5(t){if(!p5(t)||h5(t)!=m5)return!1;var e=f5(t);if(e===null)return!0;var r=y5.call(e,"constructor")&&e.constructor;return typeof r=="function"&&r instanceof r&&xw.call(r)==b5}var w5=x5;function _5(t,e){for(var r=-1,n=t==null?0:t.length,i=Array(n);++r<n;)i[r]=e(t[r],r,t);return i}var ww=_5;function S5(){this.__data__=[],this.size=0}var k5=S5;function j5(t,e){return t===e||t!==t&&e!==e}var op=j5,C5=op;function E5(t,e){for(var r=t.length;r--;)if(C5(t[r][0],e))return r;return-1}var su=E5,T5=su,R5=Array.prototype,N5=R5.splice;function P5(t){var e=this.__data__,r=T5(e,t);if(r<0)return!1;var n=e.length-1;return r==n?e.pop():N5.call(e,r,1),--this.size,!0}var O5=P5,A5=su;function $5(t){var e=this.__data__,r=A5(e,t);return r<0?void 0:e[r][1]}var I5=$5,M5=su;function L5(t){return M5(this.__data__,t)>-1}var D5=L5,z5=su;function F5(t,e){var r=this.__data__,n=z5(r,t);return n<0?(++this.size,r.push([t,e])):r[n][1]=e,this}var B5=F5,U5=k5,H5=O5,W5=I5,G5=D5,V5=B5;function fs(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}fs.prototype.clear=U5;fs.prototype.delete=H5;fs.prototype.get=W5;fs.prototype.has=G5;fs.prototype.set=V5;var au=fs,q5=au;function K5(){this.__data__=new q5,this.size=0}var Y5=K5;function X5(t){var e=this.__data__,r=e.delete(t);return this.size=e.size,r}var Z5=X5;function J5(t){return this.__data__.get(t)}var Q5=J5;function eT(t){return this.__data__.has(t)}var tT=eT,rT=rn,nT=rT["__core-js_shared__"],iT=nT,ld=iT,Kg=function(){var t=/[^.]+$/.exec(ld&&ld.keys&&ld.keys.IE_PROTO||"");return t?"Symbol(src)_1."+t:""}();function oT(t){return!!Kg&&Kg in t}var sT=oT,aT=Function.prototype,lT=aT.toString;function cT(t){if(t!=null){try{return lT.call(t)}catch{}try{return t+""}catch{}}return""}var _w=cT,uT=vw,dT=sT,hT=hs,fT=_w,pT=/[\\^$.*+?()[\]{}|]/g,mT=/^\[object .+?Constructor\]$/,gT=Function.prototype,vT=Object.prototype,yT=gT.toString,bT=vT.hasOwnProperty,xT=RegExp("^"+yT.call(bT).replace(pT,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");function wT(t){if(!hT(t)||dT(t))return!1;var e=uT(t)?xT:mT;return e.test(fT(t))}var _T=wT;function ST(t,e){return t==null?void 0:t[e]}var kT=ST,jT=_T,CT=kT;function ET(t,e){var r=CT(t,e);return jT(r)?r:void 0}var Gi=ET,TT=Gi,RT=rn,NT=TT(RT,"Map"),sp=NT,PT=Gi,OT=PT(Object,"create"),lu=OT,Yg=lu;function AT(){this.__data__=Yg?Yg(null):{},this.size=0}var $T=AT;function IT(t){var e=this.has(t)&&delete this.__data__[t];return this.size-=e?1:0,e}var MT=IT,LT=lu,DT="__lodash_hash_undefined__",zT=Object.prototype,FT=zT.hasOwnProperty;function BT(t){var e=this.__data__;if(LT){var r=e[t];return r===DT?void 0:r}return FT.call(e,t)?e[t]:void 0}var UT=BT,HT=lu,WT=Object.prototype,GT=WT.hasOwnProperty;function VT(t){var e=this.__data__;return HT?e[t]!==void 0:GT.call(e,t)}var qT=VT,KT=lu,YT="__lodash_hash_undefined__";function XT(t,e){var r=this.__data__;return this.size+=this.has(t)?0:1,r[t]=KT&&e===void 0?YT:e,this}var ZT=XT,JT=$T,QT=MT,e3=UT,t3=qT,r3=ZT;function ps(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}ps.prototype.clear=JT;ps.prototype.delete=QT;ps.prototype.get=e3;ps.prototype.has=t3;ps.prototype.set=r3;var n3=ps,Xg=n3,i3=au,o3=sp;function s3(){this.size=0,this.__data__={hash:new Xg,map:new(o3||i3),string:new Xg}}var a3=s3;function l3(t){var e=typeof t;return e=="string"||e=="number"||e=="symbol"||e=="boolean"?t!=="__proto__":t===null}var c3=l3,u3=c3;function d3(t,e){var r=t.__data__;return u3(e)?r[typeof e=="string"?"string":"hash"]:r.map}var cu=d3,h3=cu;function f3(t){var e=h3(this,t).delete(t);return this.size-=e?1:0,e}var p3=f3,m3=cu;function g3(t){return m3(this,t).get(t)}var v3=g3,y3=cu;function b3(t){return y3(this,t).has(t)}var x3=b3,w3=cu;function _3(t,e){var r=w3(this,t),n=r.size;return r.set(t,e),this.size+=r.size==n?0:1,this}var S3=_3,k3=a3,j3=p3,C3=v3,E3=x3,T3=S3;function ms(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}ms.prototype.clear=k3;ms.prototype.delete=j3;ms.prototype.get=C3;ms.prototype.has=E3;ms.prototype.set=T3;var ap=ms,R3=au,N3=sp,P3=ap,O3=200;function A3(t,e){var r=this.__data__;if(r instanceof R3){var n=r.__data__;if(!N3||n.length<O3-1)return n.push([t,e]),this.size=++r.size,this;r=this.__data__=new P3(n)}return r.set(t,e),this.size=r.size,this}var $3=A3,I3=au,M3=Y5,L3=Z5,D3=Q5,z3=tT,F3=$3;function gs(t){var e=this.__data__=new I3(t);this.size=e.size}gs.prototype.clear=M3;gs.prototype.delete=L3;gs.prototype.get=D3;gs.prototype.has=z3;gs.prototype.set=F3;var lp=gs,B3="__lodash_hash_undefined__";function U3(t){return this.__data__.set(t,B3),this}var H3=U3;function W3(t){return this.__data__.has(t)}var G3=W3,V3=ap,q3=H3,K3=G3;function Nc(t){var e=-1,r=t==null?0:t.length;for(this.__data__=new V3;++e<r;)this.add(t[e])}Nc.prototype.add=Nc.prototype.push=q3;Nc.prototype.has=K3;var Y3=Nc;function X3(t,e){for(var r=-1,n=t==null?0:t.length;++r<n;)if(e(t[r],r,t))return!0;return!1}var Z3=X3;function J3(t,e){return t.has(e)}var Q3=J3,eR=Y3,tR=Z3,rR=Q3,nR=1,iR=2;function oR(t,e,r,n,i,o){var s=r&nR,a=t.length,c=e.length;if(a!=c&&!(s&&c>a))return!1;var u=o.get(t),d=o.get(e);if(u&&d)return u==e&&d==t;var h=-1,f=!0,p=r&iR?new eR:void 0;for(o.set(t,e),o.set(e,t);++h<a;){var g=t[h],m=e[h];if(n)var b=s?n(m,g,h,e,t,o):n(g,m,h,t,e,o);if(b!==void 0){if(b)continue;f=!1;break}if(p){if(!tR(e,function(v,y){if(!rR(p,y)&&(g===v||i(g,v,r,n,o)))return p.push(y)})){f=!1;break}}else if(!(g===m||i(g,m,r,n,o))){f=!1;break}}return o.delete(t),o.delete(e),f}var Sw=oR,sR=rn,aR=sR.Uint8Array,kw=aR;function lR(t){var e=-1,r=Array(t.size);return t.forEach(function(n,i){r[++e]=[i,n]}),r}var cR=lR;function uR(t){var e=-1,r=Array(t.size);return t.forEach(function(n){r[++e]=n}),r}var dR=uR,Zg=Ga,Jg=kw,hR=op,fR=Sw,pR=cR,mR=dR,gR=1,vR=2,yR="[object Boolean]",bR="[object Date]",xR="[object Error]",wR="[object Map]",_R="[object Number]",SR="[object RegExp]",kR="[object Set]",jR="[object String]",CR="[object Symbol]",ER="[object ArrayBuffer]",TR="[object DataView]",Qg=Zg?Zg.prototype:void 0,cd=Qg?Qg.valueOf:void 0;function RR(t,e,r,n,i,o,s){switch(r){case TR:if(t.byteLength!=e.byteLength||t.byteOffset!=e.byteOffset)return!1;t=t.buffer,e=e.buffer;case ER:return!(t.byteLength!=e.byteLength||!o(new Jg(t),new Jg(e)));case yR:case bR:case _R:return hR(+t,+e);case xR:return t.name==e.name&&t.message==e.message;case SR:case jR:return t==e+"";case wR:var a=pR;case kR:var c=n&gR;if(a||(a=mR),t.size!=e.size&&!c)return!1;var u=s.get(t);if(u)return u==e;n|=vR,s.set(t,e);var d=fR(a(t),a(e),n,i,o,s);return s.delete(t),d;case CR:if(cd)return cd.call(t)==cd.call(e)}return!1}var NR=RR;function PR(t,e){for(var r=-1,n=e.length,i=t.length;++r<n;)t[i+r]=e[r];return t}var jw=PR,OR=jw,AR=Hr;function $R(t,e,r){var n=e(t);return AR(t)?n:OR(n,r(t))}var Cw=$R;function IR(t,e){for(var r=-1,n=t==null?0:t.length,i=0,o=[];++r<n;){var s=t[r];e(s,r,t)&&(o[i++]=s)}return o}var MR=IR;function LR(){return[]}var Ew=LR,DR=MR,zR=Ew,FR=Object.prototype,BR=FR.propertyIsEnumerable,e0=Object.getOwnPropertySymbols,UR=e0?function(t){return t==null?[]:(t=Object(t),DR(e0(t),function(e){return BR.call(t,e)}))}:zR,cp=UR,HR=Cw,WR=cp,GR=Va;function VR(t){return HR(t,GR,WR)}var Tw=VR,t0=Tw,qR=1,KR=Object.prototype,YR=KR.hasOwnProperty;function XR(t,e,r,n,i,o){var s=r&qR,a=t0(t),c=a.length,u=t0(e),d=u.length;if(c!=d&&!s)return!1;for(var h=c;h--;){var f=a[h];if(!(s?f in e:YR.call(e,f)))return!1}var p=o.get(t),g=o.get(e);if(p&&g)return p==e&&g==t;var m=!0;o.set(t,e),o.set(e,t);for(var b=s;++h<c;){f=a[h];var v=t[f],y=e[f];if(n)var x=s?n(y,v,f,e,t,o):n(v,y,f,t,e,o);if(!(x===void 0?v===y||i(v,y,r,n,o):x)){m=!1;break}b||(b=f=="constructor")}if(m&&!b){var S=t.constructor,j=e.constructor;S!=j&&"constructor"in t&&"constructor"in e&&!(typeof S=="function"&&S instanceof S&&typeof j=="function"&&j instanceof j)&&(m=!1)}return o.delete(t),o.delete(e),m}var ZR=XR,JR=Gi,QR=rn,eN=JR(QR,"DataView"),tN=eN,rN=Gi,nN=rn,iN=rN(nN,"Promise"),oN=iN,sN=Gi,aN=rn,lN=sN(aN,"Set"),cN=lN,uN=Gi,dN=rn,hN=uN(dN,"WeakMap"),fN=hN,$h=tN,Ih=sp,Mh=oN,Lh=cN,Dh=fN,Rw=Wi,vs=_w,r0="[object Map]",pN="[object Object]",n0="[object Promise]",i0="[object Set]",o0="[object WeakMap]",s0="[object DataView]",mN=vs($h),gN=vs(Ih),vN=vs(Mh),yN=vs(Lh),bN=vs(Dh),ji=Rw;($h&&ji(new $h(new ArrayBuffer(1)))!=s0||Ih&&ji(new Ih)!=r0||Mh&&ji(Mh.resolve())!=n0||Lh&&ji(new Lh)!=i0||Dh&&ji(new Dh)!=o0)&&(ji=function(t){var e=Rw(t),r=e==pN?t.constructor:void 0,n=r?vs(r):"";if(n)switch(n){case mN:return s0;case gN:return r0;case vN:return n0;case yN:return i0;case bN:return o0}return e});var uu=ji,ud=lp,xN=Sw,wN=NR,_N=ZR,a0=uu,l0=Hr,c0=Jf,SN=pw,kN=1,u0="[object Arguments]",d0="[object Array]",Ol="[object Object]",jN=Object.prototype,h0=jN.hasOwnProperty;function CN(t,e,r,n,i,o){var s=l0(t),a=l0(e),c=s?d0:a0(t),u=a?d0:a0(e);c=c==u0?Ol:c,u=u==u0?Ol:u;var d=c==Ol,h=u==Ol,f=c==u;if(f&&c0(t)){if(!c0(e))return!1;s=!0,d=!1}if(f&&!d)return o||(o=new ud),s||SN(t)?xN(t,e,r,n,i,o):wN(t,e,c,r,n,i,o);if(!(r&kN)){var p=d&&h0.call(t,"__wrapped__"),g=h&&h0.call(e,"__wrapped__");if(p||g){var m=p?t.value():t,b=g?e.value():e;return o||(o=new ud),i(m,b,r,n,o)}}return f?(o||(o=new ud),_N(t,e,r,n,i,o)):!1}var EN=CN,TN=EN,f0=jn;function Nw(t,e,r,n,i){return t===e?!0:t==null||e==null||!f0(t)&&!f0(e)?t!==t&&e!==e:TN(t,e,r,n,Nw,i)}var Pw=Nw,RN=lp,NN=Pw,PN=1,ON=2;function AN(t,e,r,n){var i=r.length,o=i,s=!n;if(t==null)return!o;for(t=Object(t);i--;){var a=r[i];if(s&&a[2]?a[1]!==t[a[0]]:!(a[0]in t))return!1}for(;++i<o;){a=r[i];var c=a[0],u=t[c],d=a[1];if(s&&a[2]){if(u===void 0&&!(c in t))return!1}else{var h=new RN;if(n)var f=n(u,d,c,t,e,h);if(!(f===void 0?NN(d,u,PN|ON,n,h):f))return!1}}return!0}var $N=AN,IN=hs;function MN(t){return t===t&&!IN(t)}var Ow=MN,LN=Ow,DN=Va;function zN(t){for(var e=DN(t),r=e.length;r--;){var n=e[r],i=t[n];e[r]=[n,i,LN(i)]}return e}var FN=zN;function BN(t,e){return function(r){return r==null?!1:r[t]===e&&(e!==void 0||t in Object(r))}}var Aw=BN,UN=$N,HN=FN,WN=Aw;function GN(t){var e=HN(t);return e.length==1&&e[0][2]?WN(e[0][0],e[0][1]):function(r){return r===t||UN(r,t,e)}}var VN=GN,qN=Wi,KN=jn,YN="[object Symbol]";function XN(t){return typeof t=="symbol"||KN(t)&&qN(t)==YN}var up=XN,ZN=Hr,JN=up,QN=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,eP=/^\w*$/;function tP(t,e){if(ZN(t))return!1;var r=typeof t;return r=="number"||r=="symbol"||r=="boolean"||t==null||JN(t)?!0:eP.test(t)||!QN.test(t)||e!=null&&t in Object(e)}var dp=tP,$w=ap,rP="Expected a function";function hp(t,e){if(typeof t!="function"||e!=null&&typeof e!="function")throw new TypeError(rP);var r=function(){var n=arguments,i=e?e.apply(this,n):n[0],o=r.cache;if(o.has(i))return o.get(i);var s=t.apply(this,n);return r.cache=o.set(i,s)||o,s};return r.cache=new(hp.Cache||$w),r}hp.Cache=$w;var nP=hp,iP=nP,oP=500;function sP(t){var e=iP(t,function(n){return r.size===oP&&r.clear(),n}),r=e.cache;return e}var aP=sP,lP=aP,cP=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,uP=/\\(\\)?/g,dP=lP(function(t){var e=[];return t.charCodeAt(0)===46&&e.push(""),t.replace(cP,function(r,n,i,o){e.push(i?o.replace(uP,"$1"):n||r)}),e}),hP=dP,p0=Ga,fP=ww,pP=Hr,mP=up,m0=p0?p0.prototype:void 0,g0=m0?m0.toString:void 0;function Iw(t){if(typeof t=="string")return t;if(pP(t))return fP(t,Iw)+"";if(mP(t))return g0?g0.call(t):"";var e=t+"";return e=="0"&&1/t==-1/0?"-0":e}var gP=Iw,vP=gP;function yP(t){return t==null?"":vP(t)}var bP=yP,xP=Hr,wP=dp,_P=hP,SP=bP;function kP(t,e){return xP(t)?t:wP(t,e)?[t]:_P(SP(t))}var Mw=kP,jP=up;function CP(t){if(typeof t=="string"||jP(t))return t;var e=t+"";return e=="0"&&1/t==-1/0?"-0":e}var du=CP,EP=Mw,TP=du;function RP(t,e){e=EP(e,t);for(var r=0,n=e.length;t!=null&&r<n;)t=t[TP(e[r++])];return r&&r==n?t:void 0}var Lw=RP,NP=Lw;function PP(t,e,r){var n=t==null?void 0:NP(t,e);return n===void 0?r:n}var OP=PP;function AP(t,e){return t!=null&&e in Object(t)}var $P=AP,IP=Mw,MP=hw,LP=Hr,DP=fw,zP=Qf,FP=du;function BP(t,e,r){e=IP(e,t);for(var n=-1,i=e.length,o=!1;++n<i;){var s=FP(e[n]);if(!(o=t!=null&&r(t,s)))break;t=t[s]}return o||++n!=i?o:(i=t==null?0:t.length,!!i&&zP(i)&&DP(s,i)&&(LP(t)||MP(t)))}var UP=BP,HP=$P,WP=UP;function GP(t,e){return t!=null&&WP(t,e,HP)}var VP=GP,qP=Pw,KP=OP,YP=VP,XP=dp,ZP=Ow,JP=Aw,QP=du,eO=1,tO=2;function rO(t,e){return XP(t)&&ZP(e)?JP(QP(t),e):function(r){var n=KP(r,t);return n===void 0&&n===e?YP(r,t):qP(e,n,eO|tO)}}var nO=rO;function iO(t){return function(e){return e==null?void 0:e[t]}}var oO=iO,sO=Lw;function aO(t){return function(e){return sO(e,t)}}var lO=aO,cO=oO,uO=lO,dO=dp,hO=du;function fO(t){return dO(t)?cO(hO(t)):uO(t)}var pO=fO,mO=VN,gO=nO,vO=bw,yO=Hr,bO=pO;function xO(t){return typeof t=="function"?t:t==null?vO:typeof t=="object"?yO(t)?gO(t[0],t[1]):mO(t):bO(t)}var wO=xO,_O=ou;function SO(t,e){return function(r,n){if(r==null)return r;if(!_O(r))return t(r,n);for(var i=r.length,o=e?i:-1,s=Object(r);(e?o--:++o<i)&&n(s[o],o,s)!==!1;);return r}}var kO=SO,jO=yw,CO=kO,EO=CO(jO),TO=EO,RO=TO,NO=ou;function PO(t,e){var r=-1,n=NO(t)?Array(t.length):[];return RO(t,function(i,o,s){n[++r]=e(i,o,s)}),n}var OO=PO,AO=ww,$O=wO,IO=OO,MO=Hr;function LO(t,e){var r=MO(t)?AO:IO;return r(t,$O(e))}var DO=LO;Object.defineProperty(Wa,"__esModule",{value:!0});Wa.flattenNames=void 0;var zO=mC,FO=hu(zO),BO=np,UO=hu(BO),HO=w5,WO=hu(HO),GO=DO,VO=hu(GO);function hu(t){return t&&t.__esModule?t:{default:t}}var qO=Wa.flattenNames=function t(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:[],r=[];return(0,VO.default)(e,function(n){Array.isArray(n)?t(n).map(function(i){return r.push(i)}):(0,WO.default)(n)?(0,UO.default)(n,function(i,o){i===!0&&r.push(o),r.push(o+"-"+i)}):(0,FO.default)(n)&&r.push(n)}),r};Wa.default=qO;var qa={};function KO(t,e){for(var r=-1,n=t==null?0:t.length;++r<n&&e(t[r],r,t)!==!1;);return t}var YO=KO,XO=Gi,ZO=function(){try{var t=XO(Object,"defineProperty");return t({},"",{}),t}catch{}}(),JO=ZO,v0=JO;function QO(t,e,r){e=="__proto__"&&v0?v0(t,e,{configurable:!0,enumerable:!0,value:r,writable:!0}):t[e]=r}var Dw=QO,eA=Dw,tA=op,rA=Object.prototype,nA=rA.hasOwnProperty;function iA(t,e,r){var n=t[e];(!(nA.call(t,e)&&tA(n,r))||r===void 0&&!(e in t))&&eA(t,e,r)}var zw=iA,oA=zw,sA=Dw;function aA(t,e,r,n){var i=!r;r||(r={});for(var o=-1,s=e.length;++o<s;){var a=e[o],c=n?n(r[a],t[a],a,r,t):void 0;c===void 0&&(c=t[a]),i?sA(r,a,c):oA(r,a,c)}return r}var fu=aA,lA=fu,cA=Va;function uA(t,e){return t&&lA(e,cA(e),t)}var dA=uA;function hA(t){var e=[];if(t!=null)for(var r in Object(t))e.push(r);return e}var fA=hA,pA=hs,mA=rp,gA=fA,vA=Object.prototype,yA=vA.hasOwnProperty;function bA(t){if(!pA(t))return gA(t);var e=mA(t),r=[];for(var n in t)n=="constructor"&&(e||!yA.call(t,n))||r.push(n);return r}var xA=bA,wA=mw,_A=xA,SA=ou;function kA(t){return SA(t)?wA(t,!0):_A(t)}var fp=kA,jA=fu,CA=fp;function EA(t,e){return t&&jA(e,CA(e),t)}var TA=EA,Pc={exports:{}};Pc.exports;(function(t,e){var r=rn,n=e&&!e.nodeType&&e,i=n&&!0&&t&&!t.nodeType&&t,o=i&&i.exports===n,s=o?r.Buffer:void 0,a=s?s.allocUnsafe:void 0;function c(u,d){if(d)return u.slice();var h=u.length,f=a?a(h):new u.constructor(h);return u.copy(f),f}t.exports=c})(Pc,Pc.exports);var RA=Pc.exports;function NA(t,e){var r=-1,n=t.length;for(e||(e=Array(n));++r<n;)e[r]=t[r];return e}var PA=NA,OA=fu,AA=cp;function $A(t,e){return OA(t,AA(t),e)}var IA=$A,MA=jw,LA=ip,DA=cp,zA=Ew,FA=Object.getOwnPropertySymbols,BA=FA?function(t){for(var e=[];t;)MA(e,DA(t)),t=LA(t);return e}:zA,Fw=BA,UA=fu,HA=Fw;function WA(t,e){return UA(t,HA(t),e)}var GA=WA,VA=Cw,qA=Fw,KA=fp;function YA(t){return VA(t,KA,qA)}var XA=YA,ZA=Object.prototype,JA=ZA.hasOwnProperty;function QA(t){var e=t.length,r=new t.constructor(e);return e&&typeof t[0]=="string"&&JA.call(t,"index")&&(r.index=t.index,r.input=t.input),r}var e4=QA,y0=kw;function t4(t){var e=new t.constructor(t.byteLength);return new y0(e).set(new y0(t)),e}var pp=t4,r4=pp;function n4(t,e){var r=e?r4(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.byteLength)}var i4=n4,o4=/\w*$/;function s4(t){var e=new t.constructor(t.source,o4.exec(t));return e.lastIndex=t.lastIndex,e}var a4=s4,b0=Ga,x0=b0?b0.prototype:void 0,w0=x0?x0.valueOf:void 0;function l4(t){return w0?Object(w0.call(t)):{}}var c4=l4,u4=pp;function d4(t,e){var r=e?u4(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.length)}var h4=d4,f4=pp,p4=i4,m4=a4,g4=c4,v4=h4,y4="[object Boolean]",b4="[object Date]",x4="[object Map]",w4="[object Number]",_4="[object RegExp]",S4="[object Set]",k4="[object String]",j4="[object Symbol]",C4="[object ArrayBuffer]",E4="[object DataView]",T4="[object Float32Array]",R4="[object Float64Array]",N4="[object Int8Array]",P4="[object Int16Array]",O4="[object Int32Array]",A4="[object Uint8Array]",$4="[object Uint8ClampedArray]",I4="[object Uint16Array]",M4="[object Uint32Array]";function L4(t,e,r){var n=t.constructor;switch(e){case C4:return f4(t);case y4:case b4:return new n(+t);case E4:return p4(t,r);case T4:case R4:case N4:case P4:case O4:case A4:case $4:case I4:case M4:return v4(t,r);case x4:return new n;case w4:case k4:return new n(t);case _4:return m4(t);case S4:return new n;case j4:return g4(t)}}var D4=L4,z4=hs,_0=Object.create,F4=function(){function t(){}return function(e){if(!z4(e))return{};if(_0)return _0(e);t.prototype=e;var r=new t;return t.prototype=void 0,r}}(),B4=F4,U4=B4,H4=ip,W4=rp;function G4(t){return typeof t.constructor=="function"&&!W4(t)?U4(H4(t)):{}}var V4=G4,q4=uu,K4=jn,Y4="[object Map]";function X4(t){return K4(t)&&q4(t)==Y4}var Z4=X4,J4=Z4,Q4=ep,S0=tp,k0=S0&&S0.isMap,e$=k0?Q4(k0):J4,t$=e$,r$=uu,n$=jn,i$="[object Set]";function o$(t){return n$(t)&&r$(t)==i$}var s$=o$,a$=s$,l$=ep,j0=tp,C0=j0&&j0.isSet,c$=C0?l$(C0):a$,u$=c$,d$=lp,h$=YO,f$=zw,p$=dA,m$=TA,g$=RA,v$=PA,y$=IA,b$=GA,x$=Tw,w$=XA,_$=uu,S$=e4,k$=D4,j$=V4,C$=Hr,E$=Jf,T$=t$,R$=hs,N$=u$,P$=Va,O$=fp,A$=1,$$=2,I$=4,Bw="[object Arguments]",M$="[object Array]",L$="[object Boolean]",D$="[object Date]",z$="[object Error]",Uw="[object Function]",F$="[object GeneratorFunction]",B$="[object Map]",U$="[object Number]",Hw="[object Object]",H$="[object RegExp]",W$="[object Set]",G$="[object String]",V$="[object Symbol]",q$="[object WeakMap]",K$="[object ArrayBuffer]",Y$="[object DataView]",X$="[object Float32Array]",Z$="[object Float64Array]",J$="[object Int8Array]",Q$="[object Int16Array]",e6="[object Int32Array]",t6="[object Uint8Array]",r6="[object Uint8ClampedArray]",n6="[object Uint16Array]",i6="[object Uint32Array]",nt={};nt[Bw]=nt[M$]=nt[K$]=nt[Y$]=nt[L$]=nt[D$]=nt[X$]=nt[Z$]=nt[J$]=nt[Q$]=nt[e6]=nt[B$]=nt[U$]=nt[Hw]=nt[H$]=nt[W$]=nt[G$]=nt[V$]=nt[t6]=nt[r6]=nt[n6]=nt[i6]=!0;nt[z$]=nt[Uw]=nt[q$]=!1;function Jl(t,e,r,n,i,o){var s,a=e&A$,c=e&$$,u=e&I$;if(r&&(s=i?r(t,n,i,o):r(t)),s!==void 0)return s;if(!R$(t))return t;var d=C$(t);if(d){if(s=S$(t),!a)return v$(t,s)}else{var h=_$(t),f=h==Uw||h==F$;if(E$(t))return g$(t,a);if(h==Hw||h==Bw||f&&!i){if(s=c||f?{}:j$(t),!a)return c?b$(t,m$(s,t)):y$(t,p$(s,t))}else{if(!nt[h])return i?t:{};s=k$(t,h,a)}}o||(o=new d$);var p=o.get(t);if(p)return p;o.set(t,s),N$(t)?t.forEach(function(b){s.add(Jl(b,e,r,b,t,o))}):T$(t)&&t.forEach(function(b,v){s.set(v,Jl(b,e,r,v,t,o))});var g=u?c?w$:x$:c?O$:P$,m=d?void 0:g(t);return h$(m||t,function(b,v){m&&(v=b,b=t[v]),f$(s,v,Jl(b,e,r,v,t,o))}),s}var o6=Jl,s6=o6,a6=1,l6=4;function c6(t){return s6(t,a6|l6)}var u6=c6;Object.defineProperty(qa,"__esModule",{value:!0});qa.mergeClasses=void 0;var d6=np,h6=Ww(d6),f6=u6,p6=Ww(f6),m6=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t};function Ww(t){return t&&t.__esModule?t:{default:t}}var g6=qa.mergeClasses=function(e){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:[],n=e.default&&(0,p6.default)(e.default)||{};return r.map(function(i){var o=e[i];return o&&(0,h6.default)(o,function(s,a){n[a]||(n[a]={}),n[a]=m6({},n[a],o[a])}),i}),n};qa.default=g6;var Ka={};Object.defineProperty(Ka,"__esModule",{value:!0});Ka.autoprefix=void 0;var v6=np,E0=b6(v6),y6=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t};function b6(t){return t&&t.__esModule?t:{default:t}}var x6={borderRadius:function(e){return{msBorderRadius:e,MozBorderRadius:e,OBorderRadius:e,WebkitBorderRadius:e,borderRadius:e}},boxShadow:function(e){return{msBoxShadow:e,MozBoxShadow:e,OBoxShadow:e,WebkitBoxShadow:e,boxShadow:e}},userSelect:function(e){return{WebkitTouchCallout:e,KhtmlUserSelect:e,MozUserSelect:e,msUserSelect:e,WebkitUserSelect:e,userSelect:e}},flex:function(e){return{WebkitBoxFlex:e,MozBoxFlex:e,WebkitFlex:e,msFlex:e,flex:e}},flexBasis:function(e){return{WebkitFlexBasis:e,flexBasis:e}},justifyContent:function(e){return{WebkitJustifyContent:e,justifyContent:e}},transition:function(e){return{msTransition:e,MozTransition:e,OTransition:e,WebkitTransition:e,transition:e}},transform:function(e){return{msTransform:e,MozTransform:e,OTransform:e,WebkitTransform:e,transform:e}},absolute:function(e){var r=e&&e.split(" ");return{position:"absolute",top:r&&r[0],right:r&&r[1],bottom:r&&r[2],left:r&&r[3]}},extend:function(e,r){var n=r[e];return n||{extend:e}}},w6=Ka.autoprefix=function(e){var r={};return(0,E0.default)(e,function(n,i){var o={};(0,E0.default)(n,function(s,a){var c=x6[a];c?o=y6({},o,c(s)):o[a]=s}),r[i]=o}),r};Ka.default=w6;var Ya={};Object.defineProperty(Ya,"__esModule",{value:!0});Ya.hover=void 0;var _6=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},S6=M,dd=k6(S6);function k6(t){return t&&t.__esModule?t:{default:t}}function j6(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function T0(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e&&(typeof e=="object"||typeof e=="function")?e:t}function C6(t,e){if(typeof e!="function"&&e!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}var E6=Ya.hover=function(e){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"span";return function(n){C6(i,n);function i(){var o,s,a,c;j6(this,i);for(var u=arguments.length,d=Array(u),h=0;h<u;h++)d[h]=arguments[h];return c=(s=(a=T0(this,(o=i.__proto__||Object.getPrototypeOf(i)).call.apply(o,[this].concat(d))),a),a.state={hover:!1},a.handleMouseOver=function(){return a.setState({hover:!0})},a.handleMouseOut=function(){return a.setState({hover:!1})},a.render=function(){return dd.default.createElement(r,{onMouseOver:a.handleMouseOver,onMouseOut:a.handleMouseOut},dd.default.createElement(e,_6({},a.props,a.state)))},s),T0(a,c)}return i}(dd.default.Component)};Ya.default=E6;var Xa={};Object.defineProperty(Xa,"__esModule",{value:!0});Xa.active=void 0;var T6=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},R6=M,hd=N6(R6);function N6(t){return t&&t.__esModule?t:{default:t}}function P6(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function R0(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e&&(typeof e=="object"||typeof e=="function")?e:t}function O6(t,e){if(typeof e!="function"&&e!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}var A6=Xa.active=function(e){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"span";return function(n){O6(i,n);function i(){var o,s,a,c;P6(this,i);for(var u=arguments.length,d=Array(u),h=0;h<u;h++)d[h]=arguments[h];return c=(s=(a=R0(this,(o=i.__proto__||Object.getPrototypeOf(i)).call.apply(o,[this].concat(d))),a),a.state={active:!1},a.handleMouseDown=function(){return a.setState({active:!0})},a.handleMouseUp=function(){return a.setState({active:!1})},a.render=function(){return hd.default.createElement(r,{onMouseDown:a.handleMouseDown,onMouseUp:a.handleMouseUp},hd.default.createElement(e,T6({},a.props,a.state)))},s),R0(a,c)}return i}(hd.default.Component)};Xa.default=A6;var mp={};Object.defineProperty(mp,"__esModule",{value:!0});var $6=function(e,r){var n={},i=function(s){var a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;n[s]=a};return e===0&&i("first-child"),e===r-1&&i("last-child"),(e===0||e%2===0)&&i("even"),Math.abs(e%2)===1&&i("odd"),i("nth-child",e),n};mp.default=$6;Object.defineProperty(_r,"__esModule",{value:!0});_r.ReactCSS=_r.loop=_r.handleActive=gp=_r.handleHover=_r.hover=void 0;var I6=Wa,M6=ys(I6),L6=qa,D6=ys(L6),z6=Ka,F6=ys(z6),B6=Ya,Gw=ys(B6),U6=Xa,H6=ys(U6),W6=mp,G6=ys(W6);function ys(t){return t&&t.__esModule?t:{default:t}}_r.hover=Gw.default;var gp=_r.handleHover=Gw.default;_r.handleActive=H6.default;_r.loop=G6.default;var V6=_r.ReactCSS=function(e){for(var r=arguments.length,n=Array(r>1?r-1:0),i=1;i<r;i++)n[i-1]=arguments[i];var o=(0,M6.default)(n),s=(0,D6.default)(e,o);return(0,F6.default)(s)},$e=_r.default=V6,q6=function(e,r,n,i,o){var s=o.clientWidth,a=o.clientHeight,c=typeof e.pageX=="number"?e.pageX:e.touches[0].pageX,u=typeof e.pageY=="number"?e.pageY:e.touches[0].pageY,d=c-(o.getBoundingClientRect().left+window.pageXOffset),h=u-(o.getBoundingClientRect().top+window.pageYOffset);if(n==="vertical"){var f=void 0;if(h<0?f=0:h>a?f=1:f=Math.round(h*100/a)/100,r.a!==f)return{h:r.h,s:r.s,l:r.l,a:f,source:"rgb"}}else{var p=void 0;if(d<0?p=0:d>s?p=1:p=Math.round(d*100/s)/100,i!==p)return{h:r.h,s:r.s,l:r.l,a:p,source:"rgb"}}return null},fd={},K6=function(e,r,n,i){if(typeof document>"u"&&!i)return null;var o=i?new i:document.createElement("canvas");o.width=n*2,o.height=n*2;var s=o.getContext("2d");return s?(s.fillStyle=e,s.fillRect(0,0,o.width,o.height),s.fillStyle=r,s.fillRect(0,0,n,n),s.translate(n,n),s.fillRect(0,0,n,n),o.toDataURL()):null},Y6=function(e,r,n,i){var o=e+"-"+r+"-"+n+(i?"-server":"");if(fd[o])return fd[o];var s=K6(e,r,n,i);return fd[o]=s,s},N0=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},bs=function(e){var r=e.white,n=e.grey,i=e.size,o=e.renderers,s=e.borderRadius,a=e.boxShadow,c=e.children,u=$e({default:{grid:{borderRadius:s,boxShadow:a,absolute:"0px 0px 0px 0px",background:"url("+Y6(r,n,i,o.canvas)+") center left"}}});return M.isValidElement(c)?$.cloneElement(c,N0({},c.props,{style:N0({},c.props.style,u.grid)})):$.createElement("div",{style:u.grid})};bs.defaultProps={size:8,white:"transparent",grey:"rgba(0,0,0,.08)",renderers:{}};var X6=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},Z6=function(){function t(e,r){for(var n=0;n<r.length;n++){var i=r[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}();function J6(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function P0(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e&&(typeof e=="object"||typeof e=="function")?e:t}function Q6(t,e){if(typeof e!="function"&&e!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}var vp=function(t){Q6(e,t);function e(){var r,n,i,o;J6(this,e);for(var s=arguments.length,a=Array(s),c=0;c<s;c++)a[c]=arguments[c];return o=(n=(i=P0(this,(r=e.__proto__||Object.getPrototypeOf(e)).call.apply(r,[this].concat(a))),i),i.handleChange=function(u){var d=q6(u,i.props.hsl,i.props.direction,i.props.a,i.container);d&&typeof i.props.onChange=="function"&&i.props.onChange(d,u)},i.handleMouseDown=function(u){i.handleChange(u),window.addEventListener("mousemove",i.handleChange),window.addEventListener("mouseup",i.handleMouseUp)},i.handleMouseUp=function(){i.unbindEventListeners()},i.unbindEventListeners=function(){window.removeEventListener("mousemove",i.handleChange),window.removeEventListener("mouseup",i.handleMouseUp)},n),P0(i,o)}return Z6(e,[{key:"componentWillUnmount",value:function(){this.unbindEventListeners()}},{key:"render",value:function(){var n=this,i=this.props.rgb,o=$e({default:{alpha:{absolute:"0px 0px 0px 0px",borderRadius:this.props.radius},checkboard:{absolute:"0px 0px 0px 0px",overflow:"hidden",borderRadius:this.props.radius},gradient:{absolute:"0px 0px 0px 0px",background:"linear-gradient(to right, rgba("+i.r+","+i.g+","+i.b+`, 0) 0%,
           rgba(`+i.r+","+i.g+","+i.b+", 1) 100%)",boxShadow:this.props.shadow,borderRadius:this.props.radius},container:{position:"relative",height:"100%",margin:"0 3px"},pointer:{position:"absolute",left:i.a*100+"%"},slider:{width:"4px",borderRadius:"1px",height:"8px",boxShadow:"0 0 2px rgba(0, 0, 0, .6)",background:"#fff",marginTop:"1px",transform:"translateX(-2px)"}},vertical:{gradient:{background:"linear-gradient(to bottom, rgba("+i.r+","+i.g+","+i.b+`, 0) 0%,
           rgba(`+i.r+","+i.g+","+i.b+", 1) 100%)"},pointer:{left:0,top:i.a*100+"%"}},overwrite:X6({},this.props.style)},{vertical:this.props.direction==="vertical",overwrite:!0});return $.createElement("div",{style:o.alpha},$.createElement("div",{style:o.checkboard},$.createElement(bs,{renderers:this.props.renderers})),$.createElement("div",{style:o.gradient}),$.createElement("div",{style:o.container,ref:function(a){return n.container=a},onMouseDown:this.handleMouseDown,onTouchMove:this.handleChange,onTouchStart:this.handleChange},$.createElement("div",{style:o.pointer},this.props.pointer?$.createElement(this.props.pointer,this.props):$.createElement("div",{style:o.slider}))))}}]),e}(M.PureComponent||M.Component),eI=function(){function t(e,r){for(var n=0;n<r.length;n++){var i=r[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}();function tI(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function rI(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function nI(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e&&(typeof e=="object"||typeof e=="function")?e:t}function iI(t,e){if(typeof e!="function"&&e!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}var oI=1,Vw=38,sI=40,aI=[Vw,sI],lI=function(e){return aI.indexOf(e)>-1},cI=function(e){return Number(String(e).replace(/%/g,""))},uI=1,Ge=function(t){iI(e,t);function e(r){rI(this,e);var n=nI(this,(e.__proto__||Object.getPrototypeOf(e)).call(this));return n.handleBlur=function(){n.state.blurValue&&n.setState({value:n.state.blurValue,blurValue:null})},n.handleChange=function(i){n.setUpdatedValue(i.target.value,i)},n.handleKeyDown=function(i){var o=cI(i.target.value);if(!isNaN(o)&&lI(i.keyCode)){var s=n.getArrowOffset(),a=i.keyCode===Vw?o+s:o-s;n.setUpdatedValue(a,i)}},n.handleDrag=function(i){if(n.props.dragLabel){var o=Math.round(n.props.value+i.movementX);o>=0&&o<=n.props.dragMax&&n.props.onChange&&n.props.onChange(n.getValueObjectWithLabel(o),i)}},n.handleMouseDown=function(i){n.props.dragLabel&&(i.preventDefault(),n.handleDrag(i),window.addEventListener("mousemove",n.handleDrag),window.addEventListener("mouseup",n.handleMouseUp))},n.handleMouseUp=function(){n.unbindEventListeners()},n.unbindEventListeners=function(){window.removeEventListener("mousemove",n.handleDrag),window.removeEventListener("mouseup",n.handleMouseUp)},n.state={value:String(r.value).toUpperCase(),blurValue:String(r.value).toUpperCase()},n.inputId="rc-editable-input-"+uI++,n}return eI(e,[{key:"componentDidUpdate",value:function(n,i){this.props.value!==this.state.value&&(n.value!==this.props.value||i.value!==this.state.value)&&(this.input===document.activeElement?this.setState({blurValue:String(this.props.value).toUpperCase()}):this.setState({value:String(this.props.value).toUpperCase(),blurValue:!this.state.blurValue&&String(this.props.value).toUpperCase()}))}},{key:"componentWillUnmount",value:function(){this.unbindEventListeners()}},{key:"getValueObjectWithLabel",value:function(n){return tI({},this.props.label,n)}},{key:"getArrowOffset",value:function(){return this.props.arrowOffset||oI}},{key:"setUpdatedValue",value:function(n,i){var o=this.props.label?this.getValueObjectWithLabel(n):n;this.props.onChange&&this.props.onChange(o,i),this.setState({value:n})}},{key:"render",value:function(){var n=this,i=$e({default:{wrap:{position:"relative"}},"user-override":{wrap:this.props.style&&this.props.style.wrap?this.props.style.wrap:{},input:this.props.style&&this.props.style.input?this.props.style.input:{},label:this.props.style&&this.props.style.label?this.props.style.label:{}},"dragLabel-true":{label:{cursor:"ew-resize"}}},{"user-override":!0},this.props);return $.createElement("div",{style:i.wrap},$.createElement("input",{id:this.inputId,style:i.input,ref:function(s){return n.input=s},value:this.state.value,onKeyDown:this.handleKeyDown,onChange:this.handleChange,onBlur:this.handleBlur,placeholder:this.props.placeholder,spellCheck:"false"}),this.props.label&&!this.props.hideLabel?$.createElement("label",{htmlFor:this.inputId,style:i.label,onMouseDown:this.handleMouseDown},this.props.label):null)}}]),e}(M.PureComponent||M.Component),dI=function(e,r,n,i){var o=i.clientWidth,s=i.clientHeight,a=typeof e.pageX=="number"?e.pageX:e.touches[0].pageX,c=typeof e.pageY=="number"?e.pageY:e.touches[0].pageY,u=a-(i.getBoundingClientRect().left+window.pageXOffset),d=c-(i.getBoundingClientRect().top+window.pageYOffset);if(r==="vertical"){var h=void 0;if(d<0)h=359;else if(d>s)h=0;else{var f=-(d*100/s)+100;h=360*f/100}if(n.h!==h)return{h,s:n.s,l:n.l,a:n.a,source:"hsl"}}else{var p=void 0;if(u<0)p=0;else if(u>o)p=359;else{var g=u*100/o;p=360*g/100}if(n.h!==p)return{h:p,s:n.s,l:n.l,a:n.a,source:"hsl"}}return null},hI=function(){function t(e,r){for(var n=0;n<r.length;n++){var i=r[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}();function fI(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function O0(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e&&(typeof e=="object"||typeof e=="function")?e:t}function pI(t,e){if(typeof e!="function"&&e!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}var xs=function(t){pI(e,t);function e(){var r,n,i,o;fI(this,e);for(var s=arguments.length,a=Array(s),c=0;c<s;c++)a[c]=arguments[c];return o=(n=(i=O0(this,(r=e.__proto__||Object.getPrototypeOf(e)).call.apply(r,[this].concat(a))),i),i.handleChange=function(u){var d=dI(u,i.props.direction,i.props.hsl,i.container);d&&typeof i.props.onChange=="function"&&i.props.onChange(d,u)},i.handleMouseDown=function(u){i.handleChange(u),window.addEventListener("mousemove",i.handleChange),window.addEventListener("mouseup",i.handleMouseUp)},i.handleMouseUp=function(){i.unbindEventListeners()},n),O0(i,o)}return hI(e,[{key:"componentWillUnmount",value:function(){this.unbindEventListeners()}},{key:"unbindEventListeners",value:function(){window.removeEventListener("mousemove",this.handleChange),window.removeEventListener("mouseup",this.handleMouseUp)}},{key:"render",value:function(){var n=this,i=this.props.direction,o=i===void 0?"horizontal":i,s=$e({default:{hue:{absolute:"0px 0px 0px 0px",borderRadius:this.props.radius,boxShadow:this.props.shadow},container:{padding:"0 2px",position:"relative",height:"100%",borderRadius:this.props.radius},pointer:{position:"absolute",left:this.props.hsl.h*100/360+"%"},slider:{marginTop:"1px",width:"4px",borderRadius:"1px",height:"8px",boxShadow:"0 0 2px rgba(0, 0, 0, .6)",background:"#fff",transform:"translateX(-2px)"}},vertical:{pointer:{left:"0px",top:-(this.props.hsl.h*100/360)+100+"%"}}},{vertical:o==="vertical"});return $.createElement("div",{style:s.hue},$.createElement("div",{className:"hue-"+o,style:s.container,ref:function(c){return n.container=c},onMouseDown:this.handleMouseDown,onTouchMove:this.handleChange,onTouchStart:this.handleChange},$.createElement("style",null,`
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
          `),$.createElement("div",{style:s.pointer},this.props.pointer?$.createElement(this.props.pointer,this.props):$.createElement("div",{style:s.slider}))))}}]),e}(M.PureComponent||M.Component),qw={exports:{}},mI="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED",gI=mI,vI=gI;function Kw(){}function Yw(){}Yw.resetWarningCache=Kw;var yI=function(){function t(n,i,o,s,a,c){if(c!==vI){var u=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw u.name="Invariant Violation",u}}t.isRequired=t;function e(){return t}var r={array:t,bigint:t,bool:t,func:t,number:t,object:t,string:t,symbol:t,any:t,arrayOf:e,element:t,elementType:t,instanceOf:e,node:t,objectOf:e,oneOf:e,oneOfType:e,shape:e,exact:e,checkPropTypes:Yw,resetWarningCache:Kw};return r.PropTypes=r,r};qw.exports=yI();var bI=qw.exports;const he=zc(bI);function xI(){this.__data__=[],this.size=0}function Za(t,e){return t===e||t!==t&&e!==e}function pu(t,e){for(var r=t.length;r--;)if(Za(t[r][0],e))return r;return-1}var wI=Array.prototype,_I=wI.splice;function SI(t){var e=this.__data__,r=pu(e,t);if(r<0)return!1;var n=e.length-1;return r==n?e.pop():_I.call(e,r,1),--this.size,!0}function kI(t){var e=this.__data__,r=pu(e,t);return r<0?void 0:e[r][1]}function jI(t){return pu(this.__data__,t)>-1}function CI(t,e){var r=this.__data__,n=pu(r,t);return n<0?(++this.size,r.push([t,e])):r[n][1]=e,this}function Cn(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}Cn.prototype.clear=xI;Cn.prototype.delete=SI;Cn.prototype.get=kI;Cn.prototype.has=jI;Cn.prototype.set=CI;function EI(){this.__data__=new Cn,this.size=0}function TI(t){var e=this.__data__,r=e.delete(t);return this.size=e.size,r}function RI(t){return this.__data__.get(t)}function NI(t){return this.__data__.has(t)}var Xw=typeof global=="object"&&global&&global.Object===Object&&global,PI=typeof self=="object"&&self&&self.Object===Object&&self,Wr=Xw||PI||Function("return this")(),ti=Wr.Symbol,Zw=Object.prototype,OI=Zw.hasOwnProperty,AI=Zw.toString,Hs=ti?ti.toStringTag:void 0;function $I(t){var e=OI.call(t,Hs),r=t[Hs];try{t[Hs]=void 0;var n=!0}catch{}var i=AI.call(t);return n&&(e?t[Hs]=r:delete t[Hs]),i}var II=Object.prototype,MI=II.toString;function LI(t){return MI.call(t)}var DI="[object Null]",zI="[object Undefined]",A0=ti?ti.toStringTag:void 0;function Vi(t){return t==null?t===void 0?zI:DI:A0&&A0 in Object(t)?$I(t):LI(t)}function Er(t){var e=typeof t;return t!=null&&(e=="object"||e=="function")}var FI="[object AsyncFunction]",BI="[object Function]",UI="[object GeneratorFunction]",HI="[object Proxy]";function yp(t){if(!Er(t))return!1;var e=Vi(t);return e==BI||e==UI||e==FI||e==HI}var pd=Wr["__core-js_shared__"],$0=function(){var t=/[^.]+$/.exec(pd&&pd.keys&&pd.keys.IE_PROTO||"");return t?"Symbol(src)_1."+t:""}();function WI(t){return!!$0&&$0 in t}var GI=Function.prototype,VI=GI.toString;function qi(t){if(t!=null){try{return VI.call(t)}catch{}try{return t+""}catch{}}return""}var qI=/[\\^$.*+?()[\]{}|]/g,KI=/^\[object .+?Constructor\]$/,YI=Function.prototype,XI=Object.prototype,ZI=YI.toString,JI=XI.hasOwnProperty,QI=RegExp("^"+ZI.call(JI).replace(qI,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");function eM(t){if(!Er(t)||WI(t))return!1;var e=yp(t)?QI:KI;return e.test(qi(t))}function tM(t,e){return t==null?void 0:t[e]}function Ki(t,e){var r=tM(t,e);return eM(r)?r:void 0}var Ia=Ki(Wr,"Map"),Ma=Ki(Object,"create");function rM(){this.__data__=Ma?Ma(null):{},this.size=0}function nM(t){var e=this.has(t)&&delete this.__data__[t];return this.size-=e?1:0,e}var iM="__lodash_hash_undefined__",oM=Object.prototype,sM=oM.hasOwnProperty;function aM(t){var e=this.__data__;if(Ma){var r=e[t];return r===iM?void 0:r}return sM.call(e,t)?e[t]:void 0}var lM=Object.prototype,cM=lM.hasOwnProperty;function uM(t){var e=this.__data__;return Ma?e[t]!==void 0:cM.call(e,t)}var dM="__lodash_hash_undefined__";function hM(t,e){var r=this.__data__;return this.size+=this.has(t)?0:1,r[t]=Ma&&e===void 0?dM:e,this}function Bi(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}Bi.prototype.clear=rM;Bi.prototype.delete=nM;Bi.prototype.get=aM;Bi.prototype.has=uM;Bi.prototype.set=hM;function fM(){this.size=0,this.__data__={hash:new Bi,map:new(Ia||Cn),string:new Bi}}function pM(t){var e=typeof t;return e=="string"||e=="number"||e=="symbol"||e=="boolean"?t!=="__proto__":t===null}function mu(t,e){var r=t.__data__;return pM(e)?r[typeof e=="string"?"string":"hash"]:r.map}function mM(t){var e=mu(this,t).delete(t);return this.size-=e?1:0,e}function gM(t){return mu(this,t).get(t)}function vM(t){return mu(this,t).has(t)}function yM(t,e){var r=mu(this,t),n=r.size;return r.set(t,e),this.size+=r.size==n?0:1,this}function En(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}En.prototype.clear=fM;En.prototype.delete=mM;En.prototype.get=gM;En.prototype.has=vM;En.prototype.set=yM;var bM=200;function xM(t,e){var r=this.__data__;if(r instanceof Cn){var n=r.__data__;if(!Ia||n.length<bM-1)return n.push([t,e]),this.size=++r.size,this;r=this.__data__=new En(n)}return r.set(t,e),this.size=r.size,this}function tn(t){var e=this.__data__=new Cn(t);this.size=e.size}tn.prototype.clear=EI;tn.prototype.delete=TI;tn.prototype.get=RI;tn.prototype.has=NI;tn.prototype.set=xM;var Oc=function(){try{var t=Ki(Object,"defineProperty");return t({},"",{}),t}catch{}}();function bp(t,e,r){e=="__proto__"&&Oc?Oc(t,e,{configurable:!0,enumerable:!0,value:r,writable:!0}):t[e]=r}function zh(t,e,r){(r!==void 0&&!Za(t[e],r)||r===void 0&&!(e in t))&&bp(t,e,r)}function wM(t){return function(e,r,n){for(var i=-1,o=Object(e),s=n(e),a=s.length;a--;){var c=s[++i];if(r(o[c],c,o)===!1)break}return e}}var Jw=wM(),Qw=typeof fr=="object"&&fr&&!fr.nodeType&&fr,I0=Qw&&typeof pr=="object"&&pr&&!pr.nodeType&&pr,_M=I0&&I0.exports===Qw,M0=_M?Wr.Buffer:void 0;M0&&M0.allocUnsafe;function SM(t,e){return t.slice()}var Ac=Wr.Uint8Array;function kM(t){var e=new t.constructor(t.byteLength);return new Ac(e).set(new Ac(t)),e}function jM(t,e){var r=kM(t.buffer);return new t.constructor(r,t.byteOffset,t.length)}function CM(t,e){var r=-1,n=t.length;for(e||(e=Array(n));++r<n;)e[r]=t[r];return e}var L0=Object.create,EM=function(){function t(){}return function(e){if(!Er(e))return{};if(L0)return L0(e);t.prototype=e;var r=new t;return t.prototype=void 0,r}}();function e1(t,e){return function(r){return t(e(r))}}var t1=e1(Object.getPrototypeOf,Object),TM=Object.prototype;function xp(t){var e=t&&t.constructor,r=typeof e=="function"&&e.prototype||TM;return t===r}function RM(t){return typeof t.constructor=="function"&&!xp(t)?EM(t1(t)):{}}function ri(t){return t!=null&&typeof t=="object"}var NM="[object Arguments]";function D0(t){return ri(t)&&Vi(t)==NM}var r1=Object.prototype,PM=r1.hasOwnProperty,OM=r1.propertyIsEnumerable,$c=D0(function(){return arguments}())?D0:function(t){return ri(t)&&PM.call(t,"callee")&&!OM.call(t,"callee")},vr=Array.isArray,AM=9007199254740991;function wp(t){return typeof t=="number"&&t>-1&&t%1==0&&t<=AM}function ws(t){return t!=null&&wp(t.length)&&!yp(t)}function $M(t){return ri(t)&&ws(t)}function IM(){return!1}var n1=typeof fr=="object"&&fr&&!fr.nodeType&&fr,z0=n1&&typeof pr=="object"&&pr&&!pr.nodeType&&pr,MM=z0&&z0.exports===n1,F0=MM?Wr.Buffer:void 0,LM=F0?F0.isBuffer:void 0,Ic=LM||IM,DM="[object Object]",zM=Function.prototype,FM=Object.prototype,i1=zM.toString,BM=FM.hasOwnProperty,UM=i1.call(Object);function HM(t){if(!ri(t)||Vi(t)!=DM)return!1;var e=t1(t);if(e===null)return!0;var r=BM.call(e,"constructor")&&e.constructor;return typeof r=="function"&&r instanceof r&&i1.call(r)==UM}var WM="[object Arguments]",GM="[object Array]",VM="[object Boolean]",qM="[object Date]",KM="[object Error]",YM="[object Function]",XM="[object Map]",ZM="[object Number]",JM="[object Object]",QM="[object RegExp]",eL="[object Set]",tL="[object String]",rL="[object WeakMap]",nL="[object ArrayBuffer]",iL="[object DataView]",oL="[object Float32Array]",sL="[object Float64Array]",aL="[object Int8Array]",lL="[object Int16Array]",cL="[object Int32Array]",uL="[object Uint8Array]",dL="[object Uint8ClampedArray]",hL="[object Uint16Array]",fL="[object Uint32Array]",at={};at[oL]=at[sL]=at[aL]=at[lL]=at[cL]=at[uL]=at[dL]=at[hL]=at[fL]=!0;at[WM]=at[GM]=at[nL]=at[VM]=at[iL]=at[qM]=at[KM]=at[YM]=at[XM]=at[ZM]=at[JM]=at[QM]=at[eL]=at[tL]=at[rL]=!1;function pL(t){return ri(t)&&wp(t.length)&&!!at[Vi(t)]}function mL(t){return function(e){return t(e)}}var o1=typeof fr=="object"&&fr&&!fr.nodeType&&fr,pa=o1&&typeof pr=="object"&&pr&&!pr.nodeType&&pr,gL=pa&&pa.exports===o1,md=gL&&Xw.process,B0=function(){try{var t=pa&&pa.require&&pa.require("util").types;return t||md&&md.binding&&md.binding("util")}catch{}}(),U0=B0&&B0.isTypedArray,_p=U0?mL(U0):pL;function Fh(t,e){if(!(e==="constructor"&&typeof t[e]=="function")&&e!="__proto__")return t[e]}var vL=Object.prototype,yL=vL.hasOwnProperty;function bL(t,e,r){var n=t[e];(!(yL.call(t,e)&&Za(n,r))||r===void 0&&!(e in t))&&bp(t,e,r)}function xL(t,e,r,n){var i=!r;r||(r={});for(var o=-1,s=e.length;++o<s;){var a=e[o],c=void 0;c===void 0&&(c=t[a]),i?bp(r,a,c):bL(r,a,c)}return r}function wL(t,e){for(var r=-1,n=Array(t);++r<t;)n[r]=e(r);return n}var _L=9007199254740991,SL=/^(?:0|[1-9]\d*)$/;function Sp(t,e){var r=typeof t;return e=e??_L,!!e&&(r=="number"||r!="symbol"&&SL.test(t))&&t>-1&&t%1==0&&t<e}var kL=Object.prototype,jL=kL.hasOwnProperty;function s1(t,e){var r=vr(t),n=!r&&$c(t),i=!r&&!n&&Ic(t),o=!r&&!n&&!i&&_p(t),s=r||n||i||o,a=s?wL(t.length,String):[],c=a.length;for(var u in t)(e||jL.call(t,u))&&!(s&&(u=="length"||i&&(u=="offset"||u=="parent")||o&&(u=="buffer"||u=="byteLength"||u=="byteOffset")||Sp(u,c)))&&a.push(u);return a}function CL(t){var e=[];if(t!=null)for(var r in Object(t))e.push(r);return e}var EL=Object.prototype,TL=EL.hasOwnProperty;function RL(t){if(!Er(t))return CL(t);var e=xp(t),r=[];for(var n in t)n=="constructor"&&(e||!TL.call(t,n))||r.push(n);return r}function a1(t){return ws(t)?s1(t,!0):RL(t)}function NL(t){return xL(t,a1(t))}function PL(t,e,r,n,i,o,s){var a=Fh(t,r),c=Fh(e,r),u=s.get(c);if(u){zh(t,r,u);return}var d=o?o(a,c,r+"",t,e,s):void 0,h=d===void 0;if(h){var f=vr(c),p=!f&&Ic(c),g=!f&&!p&&_p(c);d=c,f||p||g?vr(a)?d=a:$M(a)?d=CM(a):p?(h=!1,d=SM(c)):g?(h=!1,d=jM(c)):d=[]:HM(c)||$c(c)?(d=a,$c(a)?d=NL(a):(!Er(a)||yp(a))&&(d=RM(c))):h=!1}h&&(s.set(c,d),i(d,c,n,o,s),s.delete(c)),zh(t,r,d)}function l1(t,e,r,n,i){t!==e&&Jw(e,function(o,s){if(i||(i=new tn),Er(o))PL(t,e,s,r,l1,n,i);else{var a=n?n(Fh(t,s),o,s+"",t,e,i):void 0;a===void 0&&(a=o),zh(t,s,a)}},a1)}function gu(t){return t}function OL(t,e,r){switch(r.length){case 0:return t.call(e);case 1:return t.call(e,r[0]);case 2:return t.call(e,r[0],r[1]);case 3:return t.call(e,r[0],r[1],r[2])}return t.apply(e,r)}var H0=Math.max;function AL(t,e,r){return e=H0(e===void 0?t.length-1:e,0),function(){for(var n=arguments,i=-1,o=H0(n.length-e,0),s=Array(o);++i<o;)s[i]=n[e+i];i=-1;for(var a=Array(e+1);++i<e;)a[i]=n[i];return a[e]=r(s),OL(t,this,a)}}function $L(t){return function(){return t}}var IL=Oc?function(t,e){return Oc(t,"toString",{configurable:!0,enumerable:!1,value:$L(e),writable:!0})}:gu,ML=800,LL=16,DL=Date.now;function zL(t){var e=0,r=0;return function(){var n=DL(),i=LL-(n-r);if(r=n,i>0){if(++e>=ML)return arguments[0]}else e=0;return t.apply(void 0,arguments)}}var FL=zL(IL);function BL(t,e){return FL(AL(t,e,gu),t+"")}function UL(t,e,r){if(!Er(r))return!1;var n=typeof e;return(n=="number"?ws(r)&&Sp(e,r.length):n=="string"&&e in r)?Za(r[e],t):!1}function HL(t){return BL(function(e,r){var n=-1,i=r.length,o=i>1?r[i-1]:void 0,s=i>2?r[2]:void 0;for(o=t.length>3&&typeof o=="function"?(i--,o):void 0,s&&UL(r[0],r[1],s)&&(o=i<3?void 0:o,i=1),e=Object(e);++n<i;){var a=r[n];a&&t(e,a,n,o)}return e})}var sr=HL(function(t,e,r){l1(t,e,r)}),Ja=function(e){var r=e.zDepth,n=e.radius,i=e.background,o=e.children,s=e.styles,a=s===void 0?{}:s,c=$e(sr({default:{wrap:{position:"relative",display:"inline-block"},content:{position:"relative"},bg:{absolute:"0px 0px 0px 0px",boxShadow:"0 "+r+"px "+r*4+"px rgba(0,0,0,.24)",borderRadius:n,background:i}},"zDepth-0":{bg:{boxShadow:"none"}},"zDepth-1":{bg:{boxShadow:"0 2px 10px rgba(0,0,0,.12), 0 2px 5px rgba(0,0,0,.16)"}},"zDepth-2":{bg:{boxShadow:"0 6px 20px rgba(0,0,0,.19), 0 8px 17px rgba(0,0,0,.2)"}},"zDepth-3":{bg:{boxShadow:"0 17px 50px rgba(0,0,0,.19), 0 12px 15px rgba(0,0,0,.24)"}},"zDepth-4":{bg:{boxShadow:"0 25px 55px rgba(0,0,0,.21), 0 16px 28px rgba(0,0,0,.22)"}},"zDepth-5":{bg:{boxShadow:"0 40px 77px rgba(0,0,0,.22), 0 27px 24px rgba(0,0,0,.2)"}},square:{bg:{borderRadius:"0"}},circle:{bg:{borderRadius:"50%"}}},a),{"zDepth-1":r===1});return $.createElement("div",{style:c.wrap},$.createElement("div",{style:c.bg}),$.createElement("div",{style:c.content},o))};Ja.propTypes={background:he.string,zDepth:he.oneOf([0,1,2,3,4,5]),radius:he.number,styles:he.object};Ja.defaultProps={background:"#fff",zDepth:1,radius:2,styles:{}};var gd=function(){return Wr.Date.now()},WL=/\s/;function GL(t){for(var e=t.length;e--&&WL.test(t.charAt(e)););return e}var VL=/^\s+/;function qL(t){return t&&t.slice(0,GL(t)+1).replace(VL,"")}var KL="[object Symbol]";function vu(t){return typeof t=="symbol"||ri(t)&&Vi(t)==KL}var W0=NaN,YL=/^[-+]0x[0-9a-f]+$/i,XL=/^0b[01]+$/i,ZL=/^0o[0-7]+$/i,JL=parseInt;function G0(t){if(typeof t=="number")return t;if(vu(t))return W0;if(Er(t)){var e=typeof t.valueOf=="function"?t.valueOf():t;t=Er(e)?e+"":e}if(typeof t!="string")return t===0?t:+t;t=qL(t);var r=XL.test(t);return r||ZL.test(t)?JL(t.slice(2),r?2:8):YL.test(t)?W0:+t}var QL="Expected a function",e8=Math.max,t8=Math.min;function c1(t,e,r){var n,i,o,s,a,c,u=0,d=!1,h=!1,f=!0;if(typeof t!="function")throw new TypeError(QL);e=G0(e)||0,Er(r)&&(d=!!r.leading,h="maxWait"in r,o=h?e8(G0(r.maxWait)||0,e):o,f="trailing"in r?!!r.trailing:f);function p(_){var C=n,R=i;return n=i=void 0,u=_,s=t.apply(R,C),s}function g(_){return u=_,a=setTimeout(v,e),d?p(_):s}function m(_){var C=_-c,R=_-u,T=e-C;return h?t8(T,o-R):T}function b(_){var C=_-c,R=_-u;return c===void 0||C>=e||C<0||h&&R>=o}function v(){var _=gd();if(b(_))return y(_);a=setTimeout(v,m(_))}function y(_){return a=void 0,f&&n?p(_):(n=i=void 0,s)}function x(){a!==void 0&&clearTimeout(a),u=0,n=c=i=a=void 0}function S(){return a===void 0?s:y(gd())}function j(){var _=gd(),C=b(_);if(n=arguments,i=this,c=_,C){if(a===void 0)return g(c);if(h)return clearTimeout(a),a=setTimeout(v,e),p(c)}return a===void 0&&(a=setTimeout(v,e)),s}return j.cancel=x,j.flush=S,j}var r8="Expected a function";function n8(t,e,r){var n=!0,i=!0;if(typeof t!="function")throw new TypeError(r8);return Er(r)&&(n="leading"in r?!!r.leading:n,i="trailing"in r?!!r.trailing:i),c1(t,e,{leading:n,maxWait:e,trailing:i})}var i8=function(e,r,n){var i=n.getBoundingClientRect(),o=i.width,s=i.height,a=typeof e.pageX=="number"?e.pageX:e.touches[0].pageX,c=typeof e.pageY=="number"?e.pageY:e.touches[0].pageY,u=a-(n.getBoundingClientRect().left+window.pageXOffset),d=c-(n.getBoundingClientRect().top+window.pageYOffset);u<0?u=0:u>o&&(u=o),d<0?d=0:d>s&&(d=s);var h=u/o,f=1-d/s;return{h:r.h,s:h,v:f,a:r.a,source:"hsv"}},o8=function(){function t(e,r){for(var n=0;n<r.length;n++){var i=r[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}();function s8(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function a8(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e&&(typeof e=="object"||typeof e=="function")?e:t}function l8(t,e){if(typeof e!="function"&&e!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}var yu=function(t){l8(e,t);function e(r){s8(this,e);var n=a8(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,r));return n.handleChange=function(i){typeof n.props.onChange=="function"&&n.throttle(n.props.onChange,i8(i,n.props.hsl,n.container),i)},n.handleMouseDown=function(i){n.handleChange(i);var o=n.getContainerRenderWindow();o.addEventListener("mousemove",n.handleChange),o.addEventListener("mouseup",n.handleMouseUp)},n.handleMouseUp=function(){n.unbindEventListeners()},n.throttle=n8(function(i,o,s){i(o,s)},50),n}return o8(e,[{key:"componentWillUnmount",value:function(){this.throttle.cancel(),this.unbindEventListeners()}},{key:"getContainerRenderWindow",value:function(){for(var n=this.container,i=window;!i.document.contains(n)&&i.parent!==i;)i=i.parent;return i}},{key:"unbindEventListeners",value:function(){var n=this.getContainerRenderWindow();n.removeEventListener("mousemove",this.handleChange),n.removeEventListener("mouseup",this.handleMouseUp)}},{key:"render",value:function(){var n=this,i=this.props.style||{},o=i.color,s=i.white,a=i.black,c=i.pointer,u=i.circle,d=$e({default:{color:{absolute:"0px 0px 0px 0px",background:"hsl("+this.props.hsl.h+",100%, 50%)",borderRadius:this.props.radius},white:{absolute:"0px 0px 0px 0px",borderRadius:this.props.radius},black:{absolute:"0px 0px 0px 0px",boxShadow:this.props.shadow,borderRadius:this.props.radius},pointer:{position:"absolute",top:-(this.props.hsv.v*100)+100+"%",left:this.props.hsv.s*100+"%",cursor:"default"},circle:{width:"4px",height:"4px",boxShadow:`0 0 0 1.5px #fff, inset 0 0 1px 1px rgba(0,0,0,.3),
            0 0 1px 2px rgba(0,0,0,.4)`,borderRadius:"50%",cursor:"hand",transform:"translate(-2px, -2px)"}},custom:{color:o,white:s,black:a,pointer:c,circle:u}},{custom:!!this.props.style});return $.createElement("div",{style:d.color,ref:function(f){return n.container=f},onMouseDown:this.handleMouseDown,onTouchMove:this.handleChange,onTouchStart:this.handleChange},$.createElement("style",null,`
          .saturation-white {
            background: -webkit-linear-gradient(to right, #fff, rgba(255,255,255,0));
            background: linear-gradient(to right, #fff, rgba(255,255,255,0));
          }
          .saturation-black {
            background: -webkit-linear-gradient(to top, #000, rgba(0,0,0,0));
            background: linear-gradient(to top, #000, rgba(0,0,0,0));
          }
        `),$.createElement("div",{style:d.white,className:"saturation-white"},$.createElement("div",{style:d.black,className:"saturation-black"}),$.createElement("div",{style:d.pointer},this.props.pointer?$.createElement(this.props.pointer,this.props):$.createElement("div",{style:d.circle}))))}}]),e}(M.PureComponent||M.Component);function c8(t,e){for(var r=-1,n=t==null?0:t.length;++r<n&&e(t[r],r,t)!==!1;);return t}var u8=e1(Object.keys,Object),d8=Object.prototype,h8=d8.hasOwnProperty;function f8(t){if(!xp(t))return u8(t);var e=[];for(var r in Object(t))h8.call(t,r)&&r!="constructor"&&e.push(r);return e}function kp(t){return ws(t)?s1(t):f8(t)}function p8(t,e){return t&&Jw(t,e,kp)}function m8(t,e){return function(r,n){if(r==null)return r;if(!ws(r))return t(r,n);for(var i=r.length,o=-1,s=Object(r);++o<i&&n(s[o],o,s)!==!1;);return r}}var u1=m8(p8);function g8(t){return typeof t=="function"?t:gu}function v8(t,e){var r=vr(t)?c8:u1;return r(t,g8(e))}function Mc(t){"@babel/helpers - typeof";return Mc=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},Mc(t)}var y8=/^\s+/,b8=/\s+$/;function ke(t,e){if(t=t||"",e=e||{},t instanceof ke)return t;if(!(this instanceof ke))return new ke(t,e);var r=x8(t);this._originalInput=t,this._r=r.r,this._g=r.g,this._b=r.b,this._a=r.a,this._roundA=Math.round(100*this._a)/100,this._format=e.format||r.format,this._gradientType=e.gradientType,this._r<1&&(this._r=Math.round(this._r)),this._g<1&&(this._g=Math.round(this._g)),this._b<1&&(this._b=Math.round(this._b)),this._ok=r.ok}ke.prototype={isDark:function(){return this.getBrightness()<128},isLight:function(){return!this.isDark()},isValid:function(){return this._ok},getOriginalInput:function(){return this._originalInput},getFormat:function(){return this._format},getAlpha:function(){return this._a},getBrightness:function(){var e=this.toRgb();return(e.r*299+e.g*587+e.b*114)/1e3},getLuminance:function(){var e=this.toRgb(),r,n,i,o,s,a;return r=e.r/255,n=e.g/255,i=e.b/255,r<=.03928?o=r/12.92:o=Math.pow((r+.055)/1.055,2.4),n<=.03928?s=n/12.92:s=Math.pow((n+.055)/1.055,2.4),i<=.03928?a=i/12.92:a=Math.pow((i+.055)/1.055,2.4),.2126*o+.7152*s+.0722*a},setAlpha:function(e){return this._a=d1(e),this._roundA=Math.round(100*this._a)/100,this},toHsv:function(){var e=q0(this._r,this._g,this._b);return{h:e.h*360,s:e.s,v:e.v,a:this._a}},toHsvString:function(){var e=q0(this._r,this._g,this._b),r=Math.round(e.h*360),n=Math.round(e.s*100),i=Math.round(e.v*100);return this._a==1?"hsv("+r+", "+n+"%, "+i+"%)":"hsva("+r+", "+n+"%, "+i+"%, "+this._roundA+")"},toHsl:function(){var e=V0(this._r,this._g,this._b);return{h:e.h*360,s:e.s,l:e.l,a:this._a}},toHslString:function(){var e=V0(this._r,this._g,this._b),r=Math.round(e.h*360),n=Math.round(e.s*100),i=Math.round(e.l*100);return this._a==1?"hsl("+r+", "+n+"%, "+i+"%)":"hsla("+r+", "+n+"%, "+i+"%, "+this._roundA+")"},toHex:function(e){return K0(this._r,this._g,this._b,e)},toHexString:function(e){return"#"+this.toHex(e)},toHex8:function(e){return k8(this._r,this._g,this._b,this._a,e)},toHex8String:function(e){return"#"+this.toHex8(e)},toRgb:function(){return{r:Math.round(this._r),g:Math.round(this._g),b:Math.round(this._b),a:this._a}},toRgbString:function(){return this._a==1?"rgb("+Math.round(this._r)+", "+Math.round(this._g)+", "+Math.round(this._b)+")":"rgba("+Math.round(this._r)+", "+Math.round(this._g)+", "+Math.round(this._b)+", "+this._roundA+")"},toPercentageRgb:function(){return{r:Math.round(ft(this._r,255)*100)+"%",g:Math.round(ft(this._g,255)*100)+"%",b:Math.round(ft(this._b,255)*100)+"%",a:this._a}},toPercentageRgbString:function(){return this._a==1?"rgb("+Math.round(ft(this._r,255)*100)+"%, "+Math.round(ft(this._g,255)*100)+"%, "+Math.round(ft(this._b,255)*100)+"%)":"rgba("+Math.round(ft(this._r,255)*100)+"%, "+Math.round(ft(this._g,255)*100)+"%, "+Math.round(ft(this._b,255)*100)+"%, "+this._roundA+")"},toName:function(){return this._a===0?"transparent":this._a<1?!1:M8[K0(this._r,this._g,this._b,!0)]||!1},toFilter:function(e){var r="#"+Y0(this._r,this._g,this._b,this._a),n=r,i=this._gradientType?"GradientType = 1, ":"";if(e){var o=ke(e);n="#"+Y0(o._r,o._g,o._b,o._a)}return"progid:DXImageTransform.Microsoft.gradient("+i+"startColorstr="+r+",endColorstr="+n+")"},toString:function(e){var r=!!e;e=e||this._format;var n=!1,i=this._a<1&&this._a>=0,o=!r&&i&&(e==="hex"||e==="hex6"||e==="hex3"||e==="hex4"||e==="hex8"||e==="name");return o?e==="name"&&this._a===0?this.toName():this.toRgbString():(e==="rgb"&&(n=this.toRgbString()),e==="prgb"&&(n=this.toPercentageRgbString()),(e==="hex"||e==="hex6")&&(n=this.toHexString()),e==="hex3"&&(n=this.toHexString(!0)),e==="hex4"&&(n=this.toHex8String(!0)),e==="hex8"&&(n=this.toHex8String()),e==="name"&&(n=this.toName()),e==="hsl"&&(n=this.toHslString()),e==="hsv"&&(n=this.toHsvString()),n||this.toHexString())},clone:function(){return ke(this.toString())},_applyModification:function(e,r){var n=e.apply(null,[this].concat([].slice.call(r)));return this._r=n._r,this._g=n._g,this._b=n._b,this.setAlpha(n._a),this},lighten:function(){return this._applyModification(T8,arguments)},brighten:function(){return this._applyModification(R8,arguments)},darken:function(){return this._applyModification(N8,arguments)},desaturate:function(){return this._applyModification(j8,arguments)},saturate:function(){return this._applyModification(C8,arguments)},greyscale:function(){return this._applyModification(E8,arguments)},spin:function(){return this._applyModification(P8,arguments)},_applyCombination:function(e,r){return e.apply(null,[this].concat([].slice.call(r)))},analogous:function(){return this._applyCombination($8,arguments)},complement:function(){return this._applyCombination(O8,arguments)},monochromatic:function(){return this._applyCombination(I8,arguments)},splitcomplement:function(){return this._applyCombination(A8,arguments)},triad:function(){return this._applyCombination(X0,[3])},tetrad:function(){return this._applyCombination(X0,[4])}};ke.fromRatio=function(t,e){if(Mc(t)=="object"){var r={};for(var n in t)t.hasOwnProperty(n)&&(n==="a"?r[n]=t[n]:r[n]=Qs(t[n]));t=r}return ke(t,e)};function x8(t){var e={r:0,g:0,b:0},r=1,n=null,i=null,o=null,s=!1,a=!1;return typeof t=="string"&&(t=F8(t)),Mc(t)=="object"&&(dn(t.r)&&dn(t.g)&&dn(t.b)?(e=w8(t.r,t.g,t.b),s=!0,a=String(t.r).substr(-1)==="%"?"prgb":"rgb"):dn(t.h)&&dn(t.s)&&dn(t.v)?(n=Qs(t.s),i=Qs(t.v),e=S8(t.h,n,i),s=!0,a="hsv"):dn(t.h)&&dn(t.s)&&dn(t.l)&&(n=Qs(t.s),o=Qs(t.l),e=_8(t.h,n,o),s=!0,a="hsl"),t.hasOwnProperty("a")&&(r=t.a)),r=d1(r),{ok:s,format:t.format||a,r:Math.min(255,Math.max(e.r,0)),g:Math.min(255,Math.max(e.g,0)),b:Math.min(255,Math.max(e.b,0)),a:r}}function w8(t,e,r){return{r:ft(t,255)*255,g:ft(e,255)*255,b:ft(r,255)*255}}function V0(t,e,r){t=ft(t,255),e=ft(e,255),r=ft(r,255);var n=Math.max(t,e,r),i=Math.min(t,e,r),o,s,a=(n+i)/2;if(n==i)o=s=0;else{var c=n-i;switch(s=a>.5?c/(2-n-i):c/(n+i),n){case t:o=(e-r)/c+(e<r?6:0);break;case e:o=(r-t)/c+2;break;case r:o=(t-e)/c+4;break}o/=6}return{h:o,s,l:a}}function _8(t,e,r){var n,i,o;t=ft(t,360),e=ft(e,100),r=ft(r,100);function s(u,d,h){return h<0&&(h+=1),h>1&&(h-=1),h<1/6?u+(d-u)*6*h:h<1/2?d:h<2/3?u+(d-u)*(2/3-h)*6:u}if(e===0)n=i=o=r;else{var a=r<.5?r*(1+e):r+e-r*e,c=2*r-a;n=s(c,a,t+1/3),i=s(c,a,t),o=s(c,a,t-1/3)}return{r:n*255,g:i*255,b:o*255}}function q0(t,e,r){t=ft(t,255),e=ft(e,255),r=ft(r,255);var n=Math.max(t,e,r),i=Math.min(t,e,r),o,s,a=n,c=n-i;if(s=n===0?0:c/n,n==i)o=0;else{switch(n){case t:o=(e-r)/c+(e<r?6:0);break;case e:o=(r-t)/c+2;break;case r:o=(t-e)/c+4;break}o/=6}return{h:o,s,v:a}}function S8(t,e,r){t=ft(t,360)*6,e=ft(e,100),r=ft(r,100);var n=Math.floor(t),i=t-n,o=r*(1-e),s=r*(1-i*e),a=r*(1-(1-i)*e),c=n%6,u=[r,s,o,o,a,r][c],d=[a,r,r,s,o,o][c],h=[o,o,a,r,r,s][c];return{r:u*255,g:d*255,b:h*255}}function K0(t,e,r,n){var i=[zr(Math.round(t).toString(16)),zr(Math.round(e).toString(16)),zr(Math.round(r).toString(16))];return n&&i[0].charAt(0)==i[0].charAt(1)&&i[1].charAt(0)==i[1].charAt(1)&&i[2].charAt(0)==i[2].charAt(1)?i[0].charAt(0)+i[1].charAt(0)+i[2].charAt(0):i.join("")}function k8(t,e,r,n,i){var o=[zr(Math.round(t).toString(16)),zr(Math.round(e).toString(16)),zr(Math.round(r).toString(16)),zr(h1(n))];return i&&o[0].charAt(0)==o[0].charAt(1)&&o[1].charAt(0)==o[1].charAt(1)&&o[2].charAt(0)==o[2].charAt(1)&&o[3].charAt(0)==o[3].charAt(1)?o[0].charAt(0)+o[1].charAt(0)+o[2].charAt(0)+o[3].charAt(0):o.join("")}function Y0(t,e,r,n){var i=[zr(h1(n)),zr(Math.round(t).toString(16)),zr(Math.round(e).toString(16)),zr(Math.round(r).toString(16))];return i.join("")}ke.equals=function(t,e){return!t||!e?!1:ke(t).toRgbString()==ke(e).toRgbString()};ke.random=function(){return ke.fromRatio({r:Math.random(),g:Math.random(),b:Math.random()})};function j8(t,e){e=e===0?0:e||10;var r=ke(t).toHsl();return r.s-=e/100,r.s=bu(r.s),ke(r)}function C8(t,e){e=e===0?0:e||10;var r=ke(t).toHsl();return r.s+=e/100,r.s=bu(r.s),ke(r)}function E8(t){return ke(t).desaturate(100)}function T8(t,e){e=e===0?0:e||10;var r=ke(t).toHsl();return r.l+=e/100,r.l=bu(r.l),ke(r)}function R8(t,e){e=e===0?0:e||10;var r=ke(t).toRgb();return r.r=Math.max(0,Math.min(255,r.r-Math.round(255*-(e/100)))),r.g=Math.max(0,Math.min(255,r.g-Math.round(255*-(e/100)))),r.b=Math.max(0,Math.min(255,r.b-Math.round(255*-(e/100)))),ke(r)}function N8(t,e){e=e===0?0:e||10;var r=ke(t).toHsl();return r.l-=e/100,r.l=bu(r.l),ke(r)}function P8(t,e){var r=ke(t).toHsl(),n=(r.h+e)%360;return r.h=n<0?360+n:n,ke(r)}function O8(t){var e=ke(t).toHsl();return e.h=(e.h+180)%360,ke(e)}function X0(t,e){if(isNaN(e)||e<=0)throw new Error("Argument to polyad must be a positive number");for(var r=ke(t).toHsl(),n=[ke(t)],i=360/e,o=1;o<e;o++)n.push(ke({h:(r.h+o*i)%360,s:r.s,l:r.l}));return n}function A8(t){var e=ke(t).toHsl(),r=e.h;return[ke(t),ke({h:(r+72)%360,s:e.s,l:e.l}),ke({h:(r+216)%360,s:e.s,l:e.l})]}function $8(t,e,r){e=e||6,r=r||30;var n=ke(t).toHsl(),i=360/r,o=[ke(t)];for(n.h=(n.h-(i*e>>1)+720)%360;--e;)n.h=(n.h+i)%360,o.push(ke(n));return o}function I8(t,e){e=e||6;for(var r=ke(t).toHsv(),n=r.h,i=r.s,o=r.v,s=[],a=1/e;e--;)s.push(ke({h:n,s:i,v:o})),o=(o+a)%1;return s}ke.mix=function(t,e,r){r=r===0?0:r||50;var n=ke(t).toRgb(),i=ke(e).toRgb(),o=r/100,s={r:(i.r-n.r)*o+n.r,g:(i.g-n.g)*o+n.g,b:(i.b-n.b)*o+n.b,a:(i.a-n.a)*o+n.a};return ke(s)};ke.readability=function(t,e){var r=ke(t),n=ke(e);return(Math.max(r.getLuminance(),n.getLuminance())+.05)/(Math.min(r.getLuminance(),n.getLuminance())+.05)};ke.isReadable=function(t,e,r){var n=ke.readability(t,e),i,o;switch(o=!1,i=B8(r),i.level+i.size){case"AAsmall":case"AAAlarge":o=n>=4.5;break;case"AAlarge":o=n>=3;break;case"AAAsmall":o=n>=7;break}return o};ke.mostReadable=function(t,e,r){var n=null,i=0,o,s,a,c;r=r||{},s=r.includeFallbackColors,a=r.level,c=r.size;for(var u=0;u<e.length;u++)o=ke.readability(t,e[u]),o>i&&(i=o,n=ke(e[u]));return ke.isReadable(t,n,{level:a,size:c})||!s?n:(r.includeFallbackColors=!1,ke.mostReadable(t,["#fff","#000"],r))};var Bh=ke.names={aliceblue:"f0f8ff",antiquewhite:"faebd7",aqua:"0ff",aquamarine:"7fffd4",azure:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"000",blanchedalmond:"ffebcd",blue:"00f",blueviolet:"8a2be2",brown:"a52a2a",burlywood:"deb887",burntsienna:"ea7e5d",cadetblue:"5f9ea0",chartreuse:"7fff00",chocolate:"d2691e",coral:"ff7f50",cornflowerblue:"6495ed",cornsilk:"fff8dc",crimson:"dc143c",cyan:"0ff",darkblue:"00008b",darkcyan:"008b8b",darkgoldenrod:"b8860b",darkgray:"a9a9a9",darkgreen:"006400",darkgrey:"a9a9a9",darkkhaki:"bdb76b",darkmagenta:"8b008b",darkolivegreen:"556b2f",darkorange:"ff8c00",darkorchid:"9932cc",darkred:"8b0000",darksalmon:"e9967a",darkseagreen:"8fbc8f",darkslateblue:"483d8b",darkslategray:"2f4f4f",darkslategrey:"2f4f4f",darkturquoise:"00ced1",darkviolet:"9400d3",deeppink:"ff1493",deepskyblue:"00bfff",dimgray:"696969",dimgrey:"696969",dodgerblue:"1e90ff",firebrick:"b22222",floralwhite:"fffaf0",forestgreen:"228b22",fuchsia:"f0f",gainsboro:"dcdcdc",ghostwhite:"f8f8ff",gold:"ffd700",goldenrod:"daa520",gray:"808080",green:"008000",greenyellow:"adff2f",grey:"808080",honeydew:"f0fff0",hotpink:"ff69b4",indianred:"cd5c5c",indigo:"4b0082",ivory:"fffff0",khaki:"f0e68c",lavender:"e6e6fa",lavenderblush:"fff0f5",lawngreen:"7cfc00",lemonchiffon:"fffacd",lightblue:"add8e6",lightcoral:"f08080",lightcyan:"e0ffff",lightgoldenrodyellow:"fafad2",lightgray:"d3d3d3",lightgreen:"90ee90",lightgrey:"d3d3d3",lightpink:"ffb6c1",lightsalmon:"ffa07a",lightseagreen:"20b2aa",lightskyblue:"87cefa",lightslategray:"789",lightslategrey:"789",lightsteelblue:"b0c4de",lightyellow:"ffffe0",lime:"0f0",limegreen:"32cd32",linen:"faf0e6",magenta:"f0f",maroon:"800000",mediumaquamarine:"66cdaa",mediumblue:"0000cd",mediumorchid:"ba55d3",mediumpurple:"9370db",mediumseagreen:"3cb371",mediumslateblue:"7b68ee",mediumspringgreen:"00fa9a",mediumturquoise:"48d1cc",mediumvioletred:"c71585",midnightblue:"191970",mintcream:"f5fffa",mistyrose:"ffe4e1",moccasin:"ffe4b5",navajowhite:"ffdead",navy:"000080",oldlace:"fdf5e6",olive:"808000",olivedrab:"6b8e23",orange:"ffa500",orangered:"ff4500",orchid:"da70d6",palegoldenrod:"eee8aa",palegreen:"98fb98",paleturquoise:"afeeee",palevioletred:"db7093",papayawhip:"ffefd5",peachpuff:"ffdab9",peru:"cd853f",pink:"ffc0cb",plum:"dda0dd",powderblue:"b0e0e6",purple:"800080",rebeccapurple:"663399",red:"f00",rosybrown:"bc8f8f",royalblue:"4169e1",saddlebrown:"8b4513",salmon:"fa8072",sandybrown:"f4a460",seagreen:"2e8b57",seashell:"fff5ee",sienna:"a0522d",silver:"c0c0c0",skyblue:"87ceeb",slateblue:"6a5acd",slategray:"708090",slategrey:"708090",snow:"fffafa",springgreen:"00ff7f",steelblue:"4682b4",tan:"d2b48c",teal:"008080",thistle:"d8bfd8",tomato:"ff6347",turquoise:"40e0d0",violet:"ee82ee",wheat:"f5deb3",white:"fff",whitesmoke:"f5f5f5",yellow:"ff0",yellowgreen:"9acd32"},M8=ke.hexNames=L8(Bh);function L8(t){var e={};for(var r in t)t.hasOwnProperty(r)&&(e[t[r]]=r);return e}function d1(t){return t=parseFloat(t),(isNaN(t)||t<0||t>1)&&(t=1),t}function ft(t,e){D8(t)&&(t="100%");var r=z8(t);return t=Math.min(e,Math.max(0,parseFloat(t))),r&&(t=parseInt(t*e,10)/100),Math.abs(t-e)<1e-6?1:t%e/parseFloat(e)}function bu(t){return Math.min(1,Math.max(0,t))}function lr(t){return parseInt(t,16)}function D8(t){return typeof t=="string"&&t.indexOf(".")!=-1&&parseFloat(t)===1}function z8(t){return typeof t=="string"&&t.indexOf("%")!=-1}function zr(t){return t.length==1?"0"+t:""+t}function Qs(t){return t<=1&&(t=t*100+"%"),t}function h1(t){return Math.round(parseFloat(t)*255).toString(16)}function Z0(t){return lr(t)/255}var Ar=function(){var t="[-\\+]?\\d+%?",e="[-\\+]?\\d*\\.\\d+%?",r="(?:"+e+")|(?:"+t+")",n="[\\s|\\(]+("+r+")[,|\\s]+("+r+")[,|\\s]+("+r+")\\s*\\)?",i="[\\s|\\(]+("+r+")[,|\\s]+("+r+")[,|\\s]+("+r+")[,|\\s]+("+r+")\\s*\\)?";return{CSS_UNIT:new RegExp(r),rgb:new RegExp("rgb"+n),rgba:new RegExp("rgba"+i),hsl:new RegExp("hsl"+n),hsla:new RegExp("hsla"+i),hsv:new RegExp("hsv"+n),hsva:new RegExp("hsva"+i),hex3:/^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,hex6:/^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,hex4:/^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,hex8:/^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/}}();function dn(t){return!!Ar.CSS_UNIT.exec(t)}function F8(t){t=t.replace(y8,"").replace(b8,"").toLowerCase();var e=!1;if(Bh[t])t=Bh[t],e=!0;else if(t=="transparent")return{r:0,g:0,b:0,a:0,format:"name"};var r;return(r=Ar.rgb.exec(t))?{r:r[1],g:r[2],b:r[3]}:(r=Ar.rgba.exec(t))?{r:r[1],g:r[2],b:r[3],a:r[4]}:(r=Ar.hsl.exec(t))?{h:r[1],s:r[2],l:r[3]}:(r=Ar.hsla.exec(t))?{h:r[1],s:r[2],l:r[3],a:r[4]}:(r=Ar.hsv.exec(t))?{h:r[1],s:r[2],v:r[3]}:(r=Ar.hsva.exec(t))?{h:r[1],s:r[2],v:r[3],a:r[4]}:(r=Ar.hex8.exec(t))?{r:lr(r[1]),g:lr(r[2]),b:lr(r[3]),a:Z0(r[4]),format:e?"name":"hex8"}:(r=Ar.hex6.exec(t))?{r:lr(r[1]),g:lr(r[2]),b:lr(r[3]),format:e?"name":"hex"}:(r=Ar.hex4.exec(t))?{r:lr(r[1]+""+r[1]),g:lr(r[2]+""+r[2]),b:lr(r[3]+""+r[3]),a:Z0(r[4]+""+r[4]),format:e?"name":"hex8"}:(r=Ar.hex3.exec(t))?{r:lr(r[1]+""+r[1]),g:lr(r[2]+""+r[2]),b:lr(r[3]+""+r[3]),format:e?"name":"hex"}:!1}function B8(t){var e,r;return t=t||{level:"AA",size:"small"},e=(t.level||"AA").toUpperCase(),r=(t.size||"small").toLowerCase(),e!=="AA"&&e!=="AAA"&&(e="AA"),r!=="small"&&r!=="large"&&(r="small"),{level:e,size:r}}var J0=function(e){var r=["r","g","b","a","h","s","l","v"],n=0,i=0;return v8(r,function(o){if(e[o]&&(n+=1,isNaN(e[o])||(i+=1),o==="s"||o==="l")){var s=/^\d+%$/;s.test(e[o])&&(i+=1)}}),n===i?e:!1},ea=function(e,r){var n=e.hex?ke(e.hex):ke(e),i=n.toHsl(),o=n.toHsv(),s=n.toRgb(),a=n.toHex();i.s===0&&(i.h=r||0,o.h=r||0);var c=a==="000000"&&s.a===0;return{hsl:i,hex:c?"transparent":"#"+a,rgb:s,hsv:o,oldHue:e.h||r||i.h,source:e.source}},ai=function(e){if(e==="transparent")return!0;var r=String(e).charAt(0)==="#"?1:0;return e.length!==4+r&&e.length<7+r&&ke(e).isValid()},jp=function(e){if(!e)return"#fff";var r=ea(e);if(r.hex==="transparent")return"rgba(0,0,0,0.4)";var n=(r.rgb.r*299+r.rgb.g*587+r.rgb.b*114)/1e3;return n>=128?"#000":"#fff"},vd=function(e,r){var n=e.replace("°","");return ke(r+" ("+n+")")._ok},Ws=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},U8=function(){function t(e,r){for(var n=0;n<r.length;n++){var i=r[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}();function H8(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function W8(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e&&(typeof e=="object"||typeof e=="function")?e:t}function G8(t,e){if(typeof e!="function"&&e!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}var ar=function(e){var r=function(n){G8(i,n);function i(o){H8(this,i);var s=W8(this,(i.__proto__||Object.getPrototypeOf(i)).call(this));return s.handleChange=function(a,c){var u=J0(a);if(u){var d=ea(a,a.h||s.state.oldHue);s.setState(d),s.props.onChangeComplete&&s.debounce(s.props.onChangeComplete,d,c),s.props.onChange&&s.props.onChange(d,c)}},s.handleSwatchHover=function(a,c){var u=J0(a);if(u){var d=ea(a,a.h||s.state.oldHue);s.props.onSwatchHover&&s.props.onSwatchHover(d,c)}},s.state=Ws({},ea(o.color,0)),s.debounce=c1(function(a,c,u){a(c,u)},100),s}return U8(i,[{key:"render",value:function(){var s={};return this.props.onSwatchHover&&(s.onSwatchHover=this.handleSwatchHover),$.createElement(e,Ws({},this.props,this.state,{onChange:this.handleChange},s))}}],[{key:"getDerivedStateFromProps",value:function(s,a){return Ws({},ea(s.color,a.oldHue))}}]),i}(M.PureComponent||M.Component);return r.propTypes=Ws({},e.propTypes),r.defaultProps=Ws({},e.defaultProps,{color:{h:250,s:.5,l:.2,a:1}}),r},V8=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},q8=function(){function t(e,r){for(var n=0;n<r.length;n++){var i=r[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}();function K8(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function Q0(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e&&(typeof e=="object"||typeof e=="function")?e:t}function Y8(t,e){if(typeof e!="function"&&e!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}var X8=function(e){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"span";return function(n){Y8(i,n);function i(){var o,s,a,c;K8(this,i);for(var u=arguments.length,d=Array(u),h=0;h<u;h++)d[h]=arguments[h];return c=(s=(a=Q0(this,(o=i.__proto__||Object.getPrototypeOf(i)).call.apply(o,[this].concat(d))),a),a.state={focus:!1},a.handleFocus=function(){return a.setState({focus:!0})},a.handleBlur=function(){return a.setState({focus:!1})},s),Q0(a,c)}return q8(i,[{key:"render",value:function(){return $.createElement(r,{onFocus:this.handleFocus,onBlur:this.handleBlur},$.createElement(e,V8({},this.props,this.state)))}}]),i}($.Component)},ev=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},Z8=13,J8=function(e){var r=e.color,n=e.style,i=e.onClick,o=i===void 0?function(){}:i,s=e.onHover,a=e.title,c=a===void 0?r:a,u=e.children,d=e.focus,h=e.focusStyle,f=h===void 0?{}:h,p=r==="transparent",g=$e({default:{swatch:ev({background:r,height:"100%",width:"100%",cursor:"pointer",position:"relative",outline:"none"},n,d?f:{})}}),m=function(S){return o(r,S)},b=function(S){return S.keyCode===Z8&&o(r,S)},v=function(S){return s(r,S)},y={};return s&&(y.onMouseOver=v),$.createElement("div",ev({style:g.swatch,onClick:m,title:c,tabIndex:0,onKeyDown:b},y),u,p&&$.createElement(bs,{borderRadius:g.swatch.borderRadius,boxShadow:"inset 0 0 0 1px rgba(0,0,0,0.1)"}))};const Yi=X8(J8);var Q8=function(e){var r=e.direction,n=$e({default:{picker:{width:"18px",height:"18px",borderRadius:"50%",transform:"translate(-9px, -1px)",backgroundColor:"rgb(248, 248, 248)",boxShadow:"0 1px 4px 0 rgba(0, 0, 0, 0.37)"}},vertical:{picker:{transform:"translate(-3px, -9px)"}}},{vertical:r==="vertical"});return $.createElement("div",{style:n.picker})},eD=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},f1=function(e){var r=e.rgb,n=e.hsl,i=e.width,o=e.height,s=e.onChange,a=e.direction,c=e.style,u=e.renderers,d=e.pointer,h=e.className,f=h===void 0?"":h,p=$e({default:{picker:{position:"relative",width:i,height:o},alpha:{radius:"2px",style:c}}});return $.createElement("div",{style:p.picker,className:"alpha-picker "+f},$.createElement(vp,eD({},p.alpha,{rgb:r,hsl:n,pointer:d,renderers:u,onChange:s,direction:a})))};f1.defaultProps={width:"316px",height:"16px",direction:"horizontal",pointer:Q8};ar(f1);function p1(t,e){for(var r=-1,n=t==null?0:t.length,i=Array(n);++r<n;)i[r]=e(t[r],r,t);return i}var tD="__lodash_hash_undefined__";function rD(t){return this.__data__.set(t,tD),this}function nD(t){return this.__data__.has(t)}function Lc(t){var e=-1,r=t==null?0:t.length;for(this.__data__=new En;++e<r;)this.add(t[e])}Lc.prototype.add=Lc.prototype.push=rD;Lc.prototype.has=nD;function iD(t,e){for(var r=-1,n=t==null?0:t.length;++r<n;)if(e(t[r],r,t))return!0;return!1}function oD(t,e){return t.has(e)}var sD=1,aD=2;function m1(t,e,r,n,i,o){var s=r&sD,a=t.length,c=e.length;if(a!=c&&!(s&&c>a))return!1;var u=o.get(t),d=o.get(e);if(u&&d)return u==e&&d==t;var h=-1,f=!0,p=r&aD?new Lc:void 0;for(o.set(t,e),o.set(e,t);++h<a;){var g=t[h],m=e[h];if(n)var b=s?n(m,g,h,e,t,o):n(g,m,h,t,e,o);if(b!==void 0){if(b)continue;f=!1;break}if(p){if(!iD(e,function(v,y){if(!oD(p,y)&&(g===v||i(g,v,r,n,o)))return p.push(y)})){f=!1;break}}else if(!(g===m||i(g,m,r,n,o))){f=!1;break}}return o.delete(t),o.delete(e),f}function lD(t){var e=-1,r=Array(t.size);return t.forEach(function(n,i){r[++e]=[i,n]}),r}function cD(t){var e=-1,r=Array(t.size);return t.forEach(function(n){r[++e]=n}),r}var uD=1,dD=2,hD="[object Boolean]",fD="[object Date]",pD="[object Error]",mD="[object Map]",gD="[object Number]",vD="[object RegExp]",yD="[object Set]",bD="[object String]",xD="[object Symbol]",wD="[object ArrayBuffer]",_D="[object DataView]",tv=ti?ti.prototype:void 0,yd=tv?tv.valueOf:void 0;function SD(t,e,r,n,i,o,s){switch(r){case _D:if(t.byteLength!=e.byteLength||t.byteOffset!=e.byteOffset)return!1;t=t.buffer,e=e.buffer;case wD:return!(t.byteLength!=e.byteLength||!o(new Ac(t),new Ac(e)));case hD:case fD:case gD:return Za(+t,+e);case pD:return t.name==e.name&&t.message==e.message;case vD:case bD:return t==e+"";case mD:var a=lD;case yD:var c=n&uD;if(a||(a=cD),t.size!=e.size&&!c)return!1;var u=s.get(t);if(u)return u==e;n|=dD,s.set(t,e);var d=m1(a(t),a(e),n,i,o,s);return s.delete(t),d;case xD:if(yd)return yd.call(t)==yd.call(e)}return!1}function kD(t,e){for(var r=-1,n=e.length,i=t.length;++r<n;)t[i+r]=e[r];return t}function jD(t,e,r){var n=e(t);return vr(t)?n:kD(n,r(t))}function CD(t,e){for(var r=-1,n=t==null?0:t.length,i=0,o=[];++r<n;){var s=t[r];e(s,r,t)&&(o[i++]=s)}return o}function ED(){return[]}var TD=Object.prototype,RD=TD.propertyIsEnumerable,rv=Object.getOwnPropertySymbols,ND=rv?function(t){return t==null?[]:(t=Object(t),CD(rv(t),function(e){return RD.call(t,e)}))}:ED;function nv(t){return jD(t,kp,ND)}var PD=1,OD=Object.prototype,AD=OD.hasOwnProperty;function $D(t,e,r,n,i,o){var s=r&PD,a=nv(t),c=a.length,u=nv(e),d=u.length;if(c!=d&&!s)return!1;for(var h=c;h--;){var f=a[h];if(!(s?f in e:AD.call(e,f)))return!1}var p=o.get(t),g=o.get(e);if(p&&g)return p==e&&g==t;var m=!0;o.set(t,e),o.set(e,t);for(var b=s;++h<c;){f=a[h];var v=t[f],y=e[f];if(n)var x=s?n(y,v,f,e,t,o):n(v,y,f,t,e,o);if(!(x===void 0?v===y||i(v,y,r,n,o):x)){m=!1;break}b||(b=f=="constructor")}if(m&&!b){var S=t.constructor,j=e.constructor;S!=j&&"constructor"in t&&"constructor"in e&&!(typeof S=="function"&&S instanceof S&&typeof j=="function"&&j instanceof j)&&(m=!1)}return o.delete(t),o.delete(e),m}var Uh=Ki(Wr,"DataView"),Hh=Ki(Wr,"Promise"),Wh=Ki(Wr,"Set"),Gh=Ki(Wr,"WeakMap"),iv="[object Map]",ID="[object Object]",ov="[object Promise]",sv="[object Set]",av="[object WeakMap]",lv="[object DataView]",MD=qi(Uh),LD=qi(Ia),DD=qi(Hh),zD=qi(Wh),FD=qi(Gh),Dn=Vi;(Uh&&Dn(new Uh(new ArrayBuffer(1)))!=lv||Ia&&Dn(new Ia)!=iv||Hh&&Dn(Hh.resolve())!=ov||Wh&&Dn(new Wh)!=sv||Gh&&Dn(new Gh)!=av)&&(Dn=function(t){var e=Vi(t),r=e==ID?t.constructor:void 0,n=r?qi(r):"";if(n)switch(n){case MD:return lv;case LD:return iv;case DD:return ov;case zD:return sv;case FD:return av}return e});var BD=1,cv="[object Arguments]",uv="[object Array]",Al="[object Object]",UD=Object.prototype,dv=UD.hasOwnProperty;function HD(t,e,r,n,i,o){var s=vr(t),a=vr(e),c=s?uv:Dn(t),u=a?uv:Dn(e);c=c==cv?Al:c,u=u==cv?Al:u;var d=c==Al,h=u==Al,f=c==u;if(f&&Ic(t)){if(!Ic(e))return!1;s=!0,d=!1}if(f&&!d)return o||(o=new tn),s||_p(t)?m1(t,e,r,n,i,o):SD(t,e,c,r,n,i,o);if(!(r&BD)){var p=d&&dv.call(t,"__wrapped__"),g=h&&dv.call(e,"__wrapped__");if(p||g){var m=p?t.value():t,b=g?e.value():e;return o||(o=new tn),i(m,b,r,n,o)}}return f?(o||(o=new tn),$D(t,e,r,n,i,o)):!1}function Cp(t,e,r,n,i){return t===e?!0:t==null||e==null||!ri(t)&&!ri(e)?t!==t&&e!==e:HD(t,e,r,n,Cp,i)}var WD=1,GD=2;function VD(t,e,r,n){var i=r.length,o=i;if(t==null)return!o;for(t=Object(t);i--;){var s=r[i];if(s[2]?s[1]!==t[s[0]]:!(s[0]in t))return!1}for(;++i<o;){s=r[i];var a=s[0],c=t[a],u=s[1];if(s[2]){if(c===void 0&&!(a in t))return!1}else{var d=new tn,h;if(!(h===void 0?Cp(u,c,WD|GD,n,d):h))return!1}}return!0}function g1(t){return t===t&&!Er(t)}function qD(t){for(var e=kp(t),r=e.length;r--;){var n=e[r],i=t[n];e[r]=[n,i,g1(i)]}return e}function v1(t,e){return function(r){return r==null?!1:r[t]===e&&(e!==void 0||t in Object(r))}}function KD(t){var e=qD(t);return e.length==1&&e[0][2]?v1(e[0][0],e[0][1]):function(r){return r===t||VD(r,t,e)}}var YD=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,XD=/^\w*$/;function Ep(t,e){if(vr(t))return!1;var r=typeof t;return r=="number"||r=="symbol"||r=="boolean"||t==null||vu(t)?!0:XD.test(t)||!YD.test(t)||e!=null&&t in Object(e)}var ZD="Expected a function";function Tp(t,e){if(typeof t!="function"||e!=null&&typeof e!="function")throw new TypeError(ZD);var r=function(){var n=arguments,i=e?e.apply(this,n):n[0],o=r.cache;if(o.has(i))return o.get(i);var s=t.apply(this,n);return r.cache=o.set(i,s)||o,s};return r.cache=new(Tp.Cache||En),r}Tp.Cache=En;var JD=500;function QD(t){var e=Tp(t,function(n){return r.size===JD&&r.clear(),n}),r=e.cache;return e}var ez=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,tz=/\\(\\)?/g,rz=QD(function(t){var e=[];return t.charCodeAt(0)===46&&e.push(""),t.replace(ez,function(r,n,i,o){e.push(i?o.replace(tz,"$1"):n||r)}),e}),hv=ti?ti.prototype:void 0,fv=hv?hv.toString:void 0;function y1(t){if(typeof t=="string")return t;if(vr(t))return p1(t,y1)+"";if(vu(t))return fv?fv.call(t):"";var e=t+"";return e=="0"&&1/t==-1/0?"-0":e}function nz(t){return t==null?"":y1(t)}function b1(t,e){return vr(t)?t:Ep(t,e)?[t]:rz(nz(t))}function xu(t){if(typeof t=="string"||vu(t))return t;var e=t+"";return e=="0"&&1/t==-1/0?"-0":e}function x1(t,e){e=b1(e,t);for(var r=0,n=e.length;t!=null&&r<n;)t=t[xu(e[r++])];return r&&r==n?t:void 0}function iz(t,e,r){var n=t==null?void 0:x1(t,e);return n===void 0?r:n}function oz(t,e){return t!=null&&e in Object(t)}function sz(t,e,r){e=b1(e,t);for(var n=-1,i=e.length,o=!1;++n<i;){var s=xu(e[n]);if(!(o=t!=null&&r(t,s)))break;t=t[s]}return o||++n!=i?o:(i=t==null?0:t.length,!!i&&wp(i)&&Sp(s,i)&&(vr(t)||$c(t)))}function az(t,e){return t!=null&&sz(t,e,oz)}var lz=1,cz=2;function uz(t,e){return Ep(t)&&g1(e)?v1(xu(t),e):function(r){var n=iz(r,t);return n===void 0&&n===e?az(r,t):Cp(e,n,lz|cz)}}function dz(t){return function(e){return e==null?void 0:e[t]}}function hz(t){return function(e){return x1(e,t)}}function fz(t){return Ep(t)?dz(xu(t)):hz(t)}function pz(t){return typeof t=="function"?t:t==null?gu:typeof t=="object"?vr(t)?uz(t[0],t[1]):KD(t):fz(t)}function mz(t,e){var r=-1,n=ws(t)?Array(t.length):[];return u1(t,function(i,o,s){n[++r]=e(i,o,s)}),n}function Xi(t,e){var r=vr(t)?p1:mz;return r(t,pz(e))}var gz=function(e){var r=e.colors,n=e.onClick,i=e.onSwatchHover,o=$e({default:{swatches:{marginRight:"-10px"},swatch:{width:"22px",height:"22px",float:"left",marginRight:"10px",marginBottom:"10px",borderRadius:"4px"},clear:{clear:"both"}}});return $.createElement("div",{style:o.swatches},Xi(r,function(s){return $.createElement(Yi,{key:s,color:s,style:o.swatch,onClick:n,onHover:i,focusStyle:{boxShadow:"0 0 4px "+s}})}),$.createElement("div",{style:o.clear}))},Rp=function(e){var r=e.onChange,n=e.onSwatchHover,i=e.hex,o=e.colors,s=e.width,a=e.triangle,c=e.styles,u=c===void 0?{}:c,d=e.className,h=d===void 0?"":d,f=i==="transparent",p=function(b,v){ai(b)&&r({hex:b,source:"hex"},v)},g=$e(sr({default:{card:{width:s,background:"#fff",boxShadow:"0 1px rgba(0,0,0,.1)",borderRadius:"6px",position:"relative"},head:{height:"110px",background:i,borderRadius:"6px 6px 0 0",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"},body:{padding:"10px"},label:{fontSize:"18px",color:jp(i),position:"relative"},triangle:{width:"0px",height:"0px",borderStyle:"solid",borderWidth:"0 10px 10px 10px",borderColor:"transparent transparent "+i+" transparent",position:"absolute",top:"-10px",left:"50%",marginLeft:"-10px"},input:{width:"100%",fontSize:"12px",color:"#666",border:"0px",outline:"none",height:"22px",boxShadow:"inset 0 0 0 1px #ddd",borderRadius:"4px",padding:"0 7px",boxSizing:"border-box"}},"hide-triangle":{triangle:{display:"none"}}},u),{"hide-triangle":a==="hide"});return $.createElement("div",{style:g.card,className:"block-picker "+h},$.createElement("div",{style:g.triangle}),$.createElement("div",{style:g.head},f&&$.createElement(bs,{borderRadius:"6px 6px 0 0"}),$.createElement("div",{style:g.label},i)),$.createElement("div",{style:g.body},$.createElement(gz,{colors:o,onClick:p,onSwatchHover:n}),$.createElement(Ge,{style:{input:g.input},value:i,onChange:p})))};Rp.propTypes={width:he.oneOfType([he.string,he.number]),colors:he.arrayOf(he.string),triangle:he.oneOf(["top","hide"]),styles:he.object};Rp.defaultProps={width:170,colors:["#D9E3F0","#F47373","#697689","#37D67A","#2CCCE4","#555555","#dce775","#ff8a65","#ba68c8"],triangle:"top",styles:{}};ar(Rp);var mo={100:"#ffcdd2",300:"#e57373",500:"#f44336",700:"#d32f2f",900:"#b71c1c"},go={100:"#f8bbd0",300:"#f06292",500:"#e91e63",700:"#c2185b",900:"#880e4f"},vo={100:"#e1bee7",300:"#ba68c8",500:"#9c27b0",700:"#7b1fa2",900:"#4a148c"},yo={100:"#d1c4e9",300:"#9575cd",500:"#673ab7",700:"#512da8",900:"#311b92"},bo={100:"#c5cae9",300:"#7986cb",500:"#3f51b5",700:"#303f9f",900:"#1a237e"},xo={100:"#bbdefb",300:"#64b5f6",500:"#2196f3",700:"#1976d2",900:"#0d47a1"},wo={100:"#b3e5fc",300:"#4fc3f7",500:"#03a9f4",700:"#0288d1",900:"#01579b"},_o={100:"#b2ebf2",300:"#4dd0e1",500:"#00bcd4",700:"#0097a7",900:"#006064"},So={100:"#b2dfdb",300:"#4db6ac",500:"#009688",700:"#00796b",900:"#004d40"},ta={100:"#c8e6c9",300:"#81c784",500:"#4caf50",700:"#388e3c"},ko={100:"#dcedc8",300:"#aed581",500:"#8bc34a",700:"#689f38",900:"#33691e"},jo={100:"#f0f4c3",300:"#dce775",500:"#cddc39",700:"#afb42b",900:"#827717"},Co={100:"#fff9c4",300:"#fff176",500:"#ffeb3b",700:"#fbc02d",900:"#f57f17"},Eo={100:"#ffecb3",300:"#ffd54f",500:"#ffc107",700:"#ffa000",900:"#ff6f00"},To={100:"#ffe0b2",300:"#ffb74d",500:"#ff9800",700:"#f57c00",900:"#e65100"},Ro={100:"#ffccbc",300:"#ff8a65",500:"#ff5722",700:"#e64a19",900:"#bf360c"},No={100:"#d7ccc8",300:"#a1887f",500:"#795548",700:"#5d4037",900:"#3e2723"},Po={100:"#cfd8dc",300:"#90a4ae",500:"#607d8b",700:"#455a64",900:"#263238"},w1=function(e){var r=e.color,n=e.onClick,i=e.onSwatchHover,o=e.hover,s=e.active,a=e.circleSize,c=e.circleSpacing,u=$e({default:{swatch:{width:a,height:a,marginRight:c,marginBottom:c,transform:"scale(1)",transition:"100ms transform ease"},Swatch:{borderRadius:"50%",background:"transparent",boxShadow:"inset 0 0 0 "+(a/2+1)+"px "+r,transition:"100ms box-shadow ease"}},hover:{swatch:{transform:"scale(1.2)"}},active:{Swatch:{boxShadow:"inset 0 0 0 3px "+r}}},{hover:o,active:s});return $.createElement("div",{style:u.swatch},$.createElement(Yi,{style:u.Swatch,color:r,onClick:n,onHover:i,focusStyle:{boxShadow:u.Swatch.boxShadow+", 0 0 5px "+r}}))};w1.defaultProps={circleSize:28,circleSpacing:14};const vz=gp(w1);var Np=function(e){var r=e.width,n=e.onChange,i=e.onSwatchHover,o=e.colors,s=e.hex,a=e.circleSize,c=e.styles,u=c===void 0?{}:c,d=e.circleSpacing,h=e.className,f=h===void 0?"":h,p=$e(sr({default:{card:{width:r,display:"flex",flexWrap:"wrap",marginRight:-d,marginBottom:-d}}},u)),g=function(b,v){return n({hex:b,source:"hex"},v)};return $.createElement("div",{style:p.card,className:"circle-picker "+f},Xi(o,function(m){return $.createElement(vz,{key:m,color:m,onClick:g,onSwatchHover:i,active:s===m.toLowerCase(),circleSize:a,circleSpacing:d})}))};Np.propTypes={width:he.oneOfType([he.string,he.number]),circleSize:he.number,circleSpacing:he.number,styles:he.object};Np.defaultProps={width:252,circleSize:28,circleSpacing:14,colors:[mo[500],go[500],vo[500],yo[500],bo[500],xo[500],wo[500],_o[500],So[500],ta[500],ko[500],jo[500],Co[500],Eo[500],To[500],Ro[500],No[500],Po[500]],styles:{}};ar(Np);function pv(t){return t===void 0}var _1={};Object.defineProperty(_1,"__esModule",{value:!0});var mv=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},yz=M,gv=bz(yz);function bz(t){return t&&t.__esModule?t:{default:t}}function xz(t,e){var r={};for(var n in t)e.indexOf(n)>=0||Object.prototype.hasOwnProperty.call(t,n)&&(r[n]=t[n]);return r}var $l=24,wz=_1.default=function(t){var e=t.fill,r=e===void 0?"currentColor":e,n=t.width,i=n===void 0?$l:n,o=t.height,s=o===void 0?$l:o,a=t.style,c=a===void 0?{}:a,u=xz(t,["fill","width","height","style"]);return gv.default.createElement("svg",mv({viewBox:"0 0 "+$l+" "+$l,style:mv({fill:r,width:i,height:s},c)},u),gv.default.createElement("path",{d:"M12,18.17L8.83,15L7.42,16.41L12,21L16.59,16.41L15.17,15M12,5.83L15.17,9L16.58,7.59L12,3L7.41,7.59L8.83,9L12,5.83Z"}))},_z=function(){function t(e,r){for(var n=0;n<r.length;n++){var i=r[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}();function Sz(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function kz(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e&&(typeof e=="object"||typeof e=="function")?e:t}function jz(t,e){if(typeof e!="function"&&e!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}var S1=function(t){jz(e,t);function e(r){Sz(this,e);var n=kz(this,(e.__proto__||Object.getPrototypeOf(e)).call(this));return n.toggleViews=function(){n.state.view==="hex"?n.setState({view:"rgb"}):n.state.view==="rgb"?n.setState({view:"hsl"}):n.state.view==="hsl"&&(n.props.hsl.a===1?n.setState({view:"hex"}):n.setState({view:"rgb"}))},n.handleChange=function(i,o){i.hex?ai(i.hex)&&n.props.onChange({hex:i.hex,source:"hex"},o):i.r||i.g||i.b?n.props.onChange({r:i.r||n.props.rgb.r,g:i.g||n.props.rgb.g,b:i.b||n.props.rgb.b,source:"rgb"},o):i.a?(i.a<0?i.a=0:i.a>1&&(i.a=1),n.props.onChange({h:n.props.hsl.h,s:n.props.hsl.s,l:n.props.hsl.l,a:Math.round(i.a*100)/100,source:"rgb"},o)):(i.h||i.s||i.l)&&(typeof i.s=="string"&&i.s.includes("%")&&(i.s=i.s.replace("%","")),typeof i.l=="string"&&i.l.includes("%")&&(i.l=i.l.replace("%","")),i.s==1?i.s=.01:i.l==1&&(i.l=.01),n.props.onChange({h:i.h||n.props.hsl.h,s:Number(pv(i.s)?n.props.hsl.s:i.s),l:Number(pv(i.l)?n.props.hsl.l:i.l),source:"hsl"},o))},n.showHighlight=function(i){i.currentTarget.style.background="#eee"},n.hideHighlight=function(i){i.currentTarget.style.background="transparent"},r.hsl.a!==1&&r.view==="hex"?n.state={view:"rgb"}:n.state={view:r.view},n}return _z(e,[{key:"render",value:function(){var n=this,i=$e({default:{wrap:{paddingTop:"16px",display:"flex"},fields:{flex:"1",display:"flex",marginLeft:"-6px"},field:{paddingLeft:"6px",width:"100%"},alpha:{paddingLeft:"6px",width:"100%"},toggle:{width:"32px",textAlign:"right",position:"relative"},icon:{marginRight:"-4px",marginTop:"12px",cursor:"pointer",position:"relative"},iconHighlight:{position:"absolute",width:"24px",height:"28px",background:"#eee",borderRadius:"4px",top:"10px",left:"12px",display:"none"},input:{fontSize:"11px",color:"#333",width:"100%",borderRadius:"2px",border:"none",boxShadow:"inset 0 0 0 1px #dadada",height:"21px",textAlign:"center"},label:{textTransform:"uppercase",fontSize:"11px",lineHeight:"11px",color:"#969696",textAlign:"center",display:"block",marginTop:"12px"},svg:{fill:"#333",width:"24px",height:"24px",border:"1px transparent solid",borderRadius:"5px"}},disableAlpha:{alpha:{display:"none"}}},this.props,this.state),o=void 0;return this.state.view==="hex"?o=$.createElement("div",{style:i.fields,className:"flexbox-fix"},$.createElement("div",{style:i.field},$.createElement(Ge,{style:{input:i.input,label:i.label},label:"hex",value:this.props.hex,onChange:this.handleChange}))):this.state.view==="rgb"?o=$.createElement("div",{style:i.fields,className:"flexbox-fix"},$.createElement("div",{style:i.field},$.createElement(Ge,{style:{input:i.input,label:i.label},label:"r",value:this.props.rgb.r,onChange:this.handleChange})),$.createElement("div",{style:i.field},$.createElement(Ge,{style:{input:i.input,label:i.label},label:"g",value:this.props.rgb.g,onChange:this.handleChange})),$.createElement("div",{style:i.field},$.createElement(Ge,{style:{input:i.input,label:i.label},label:"b",value:this.props.rgb.b,onChange:this.handleChange})),$.createElement("div",{style:i.alpha},$.createElement(Ge,{style:{input:i.input,label:i.label},label:"a",value:this.props.rgb.a,arrowOffset:.01,onChange:this.handleChange}))):this.state.view==="hsl"&&(o=$.createElement("div",{style:i.fields,className:"flexbox-fix"},$.createElement("div",{style:i.field},$.createElement(Ge,{style:{input:i.input,label:i.label},label:"h",value:Math.round(this.props.hsl.h),onChange:this.handleChange})),$.createElement("div",{style:i.field},$.createElement(Ge,{style:{input:i.input,label:i.label},label:"s",value:Math.round(this.props.hsl.s*100)+"%",onChange:this.handleChange})),$.createElement("div",{style:i.field},$.createElement(Ge,{style:{input:i.input,label:i.label},label:"l",value:Math.round(this.props.hsl.l*100)+"%",onChange:this.handleChange})),$.createElement("div",{style:i.alpha},$.createElement(Ge,{style:{input:i.input,label:i.label},label:"a",value:this.props.hsl.a,arrowOffset:.01,onChange:this.handleChange})))),$.createElement("div",{style:i.wrap,className:"flexbox-fix"},o,$.createElement("div",{style:i.toggle},$.createElement("div",{style:i.icon,onClick:this.toggleViews,ref:function(a){return n.icon=a}},$.createElement(wz,{style:i.svg,onMouseOver:this.showHighlight,onMouseEnter:this.showHighlight,onMouseOut:this.hideHighlight}))))}}],[{key:"getDerivedStateFromProps",value:function(n,i){return n.hsl.a!==1&&i.view==="hex"?{view:"rgb"}:null}}]),e}($.Component);S1.defaultProps={view:"hex"};var vv=function(){var e=$e({default:{picker:{width:"12px",height:"12px",borderRadius:"6px",transform:"translate(-6px, -1px)",backgroundColor:"rgb(248, 248, 248)",boxShadow:"0 1px 4px 0 rgba(0, 0, 0, 0.37)"}}});return $.createElement("div",{style:e.picker})},Cz=function(){var e=$e({default:{picker:{width:"12px",height:"12px",borderRadius:"6px",boxShadow:"inset 0 0 0 1px #fff",transform:"translate(-6px, -6px)"}}});return $.createElement("div",{style:e.picker})},Pp=function(e){var r=e.width,n=e.onChange,i=e.disableAlpha,o=e.rgb,s=e.hsl,a=e.hsv,c=e.hex,u=e.renderers,d=e.styles,h=d===void 0?{}:d,f=e.className,p=f===void 0?"":f,g=e.defaultView,m=$e(sr({default:{picker:{width:r,background:"#fff",borderRadius:"2px",boxShadow:"0 0 2px rgba(0,0,0,.3), 0 4px 8px rgba(0,0,0,.3)",boxSizing:"initial",fontFamily:"Menlo"},saturation:{width:"100%",paddingBottom:"55%",position:"relative",borderRadius:"2px 2px 0 0",overflow:"hidden"},Saturation:{radius:"2px 2px 0 0"},body:{padding:"16px 16px 12px"},controls:{display:"flex"},color:{width:"32px"},swatch:{marginTop:"6px",width:"16px",height:"16px",borderRadius:"8px",position:"relative",overflow:"hidden"},active:{absolute:"0px 0px 0px 0px",borderRadius:"8px",boxShadow:"inset 0 0 0 1px rgba(0,0,0,.1)",background:"rgba("+o.r+", "+o.g+", "+o.b+", "+o.a+")",zIndex:"2"},toggles:{flex:"1"},hue:{height:"10px",position:"relative",marginBottom:"8px"},Hue:{radius:"2px"},alpha:{height:"10px",position:"relative"},Alpha:{radius:"2px"}},disableAlpha:{color:{width:"22px"},alpha:{display:"none"},hue:{marginBottom:"0px"},swatch:{width:"10px",height:"10px",marginTop:"0px"}}},h),{disableAlpha:i});return $.createElement("div",{style:m.picker,className:"chrome-picker "+p},$.createElement("div",{style:m.saturation},$.createElement(yu,{style:m.Saturation,hsl:s,hsv:a,pointer:Cz,onChange:n})),$.createElement("div",{style:m.body},$.createElement("div",{style:m.controls,className:"flexbox-fix"},$.createElement("div",{style:m.color},$.createElement("div",{style:m.swatch},$.createElement("div",{style:m.active}),$.createElement(bs,{renderers:u}))),$.createElement("div",{style:m.toggles},$.createElement("div",{style:m.hue},$.createElement(xs,{style:m.Hue,hsl:s,pointer:vv,onChange:n})),$.createElement("div",{style:m.alpha},$.createElement(vp,{style:m.Alpha,rgb:o,hsl:s,pointer:vv,renderers:u,onChange:n})))),$.createElement(S1,{rgb:o,hsl:s,hex:c,view:g,onChange:n,disableAlpha:i})))};Pp.propTypes={width:he.oneOfType([he.string,he.number]),disableAlpha:he.bool,styles:he.object,defaultView:he.oneOf(["hex","rgb","hsl"])};Pp.defaultProps={width:225,disableAlpha:!1,styles:{}};const Ez=ar(Pp);var Tz=function(e){var r=e.color,n=e.onClick,i=n===void 0?function(){}:n,o=e.onSwatchHover,s=e.active,a=$e({default:{color:{background:r,width:"15px",height:"15px",float:"left",marginRight:"5px",marginBottom:"5px",position:"relative",cursor:"pointer"},dot:{absolute:"5px 5px 5px 5px",background:jp(r),borderRadius:"50%",opacity:"0"}},active:{dot:{opacity:"1"}},"color-#FFFFFF":{color:{boxShadow:"inset 0 0 0 1px #ddd"},dot:{background:"#000"}},transparent:{dot:{background:"#000"}}},{active:s,"color-#FFFFFF":r==="#FFFFFF",transparent:r==="transparent"});return $.createElement(Yi,{style:a.color,color:r,onClick:i,onHover:o,focusStyle:{boxShadow:"0 0 4px "+r}},$.createElement("div",{style:a.dot}))},Rz=function(e){var r=e.hex,n=e.rgb,i=e.onChange,o=$e({default:{fields:{display:"flex",paddingBottom:"6px",paddingRight:"5px",position:"relative"},active:{position:"absolute",top:"6px",left:"5px",height:"9px",width:"9px",background:r},HEXwrap:{flex:"6",position:"relative"},HEXinput:{width:"80%",padding:"0px",paddingLeft:"20%",border:"none",outline:"none",background:"none",fontSize:"12px",color:"#333",height:"16px"},HEXlabel:{display:"none"},RGBwrap:{flex:"3",position:"relative"},RGBinput:{width:"70%",padding:"0px",paddingLeft:"30%",border:"none",outline:"none",background:"none",fontSize:"12px",color:"#333",height:"16px"},RGBlabel:{position:"absolute",top:"3px",left:"0px",lineHeight:"16px",textTransform:"uppercase",fontSize:"12px",color:"#999"}}}),s=function(c,u){c.r||c.g||c.b?i({r:c.r||n.r,g:c.g||n.g,b:c.b||n.b,source:"rgb"},u):i({hex:c.hex,source:"hex"},u)};return $.createElement("div",{style:o.fields,className:"flexbox-fix"},$.createElement("div",{style:o.active}),$.createElement(Ge,{style:{wrap:o.HEXwrap,input:o.HEXinput,label:o.HEXlabel},label:"hex",value:r,onChange:s}),$.createElement(Ge,{style:{wrap:o.RGBwrap,input:o.RGBinput,label:o.RGBlabel},label:"r",value:n.r,onChange:s}),$.createElement(Ge,{style:{wrap:o.RGBwrap,input:o.RGBinput,label:o.RGBlabel},label:"g",value:n.g,onChange:s}),$.createElement(Ge,{style:{wrap:o.RGBwrap,input:o.RGBinput,label:o.RGBlabel},label:"b",value:n.b,onChange:s}))},Op=function(e){var r=e.onChange,n=e.onSwatchHover,i=e.colors,o=e.hex,s=e.rgb,a=e.styles,c=a===void 0?{}:a,u=e.className,d=u===void 0?"":u,h=$e(sr({default:{Compact:{background:"#f6f6f6",radius:"4px"},compact:{paddingTop:"5px",paddingLeft:"5px",boxSizing:"initial",width:"240px"},clear:{clear:"both"}}},c)),f=function(g,m){g.hex?ai(g.hex)&&r({hex:g.hex,source:"hex"},m):r(g,m)};return $.createElement(Ja,{style:h.Compact,styles:c},$.createElement("div",{style:h.compact,className:"compact-picker "+d},$.createElement("div",null,Xi(i,function(p){return $.createElement(Tz,{key:p,color:p,active:p.toLowerCase()===o,onClick:f,onSwatchHover:n})}),$.createElement("div",{style:h.clear})),$.createElement(Rz,{hex:o,rgb:s,onChange:f})))};Op.propTypes={colors:he.arrayOf(he.string),styles:he.object};Op.defaultProps={colors:["#4D4D4D","#999999","#FFFFFF","#F44E3B","#FE9200","#FCDC00","#DBDF00","#A4DD00","#68CCCA","#73D8FF","#AEA1FF","#FDA1FF","#333333","#808080","#cccccc","#D33115","#E27300","#FCC400","#B0BC00","#68BC00","#16A5A5","#009CE0","#7B64FF","#FA28FF","#000000","#666666","#B3B3B3","#9F0500","#C45100","#FB9E00","#808900","#194D33","#0C797D","#0062B1","#653294","#AB149E"],styles:{}};ar(Op);var Nz=function(e){var r=e.hover,n=e.color,i=e.onClick,o=e.onSwatchHover,s={position:"relative",zIndex:"2",outline:"2px solid #fff",boxShadow:"0 0 5px 2px rgba(0,0,0,0.25)"},a=$e({default:{swatch:{width:"25px",height:"25px",fontSize:"0"}},hover:{swatch:s}},{hover:r});return $.createElement("div",{style:a.swatch},$.createElement(Yi,{color:n,onClick:i,onHover:o,focusStyle:s}))};const Pz=gp(Nz);var Ap=function(e){var r=e.width,n=e.colors,i=e.onChange,o=e.onSwatchHover,s=e.triangle,a=e.styles,c=a===void 0?{}:a,u=e.className,d=u===void 0?"":u,h=$e(sr({default:{card:{width:r,background:"#fff",border:"1px solid rgba(0,0,0,0.2)",boxShadow:"0 3px 12px rgba(0,0,0,0.15)",borderRadius:"4px",position:"relative",padding:"5px",display:"flex",flexWrap:"wrap"},triangle:{position:"absolute",border:"7px solid transparent",borderBottomColor:"#fff"},triangleShadow:{position:"absolute",border:"8px solid transparent",borderBottomColor:"rgba(0,0,0,0.15)"}},"hide-triangle":{triangle:{display:"none"},triangleShadow:{display:"none"}},"top-left-triangle":{triangle:{top:"-14px",left:"10px"},triangleShadow:{top:"-16px",left:"9px"}},"top-right-triangle":{triangle:{top:"-14px",right:"10px"},triangleShadow:{top:"-16px",right:"9px"}},"bottom-left-triangle":{triangle:{top:"35px",left:"10px",transform:"rotate(180deg)"},triangleShadow:{top:"37px",left:"9px",transform:"rotate(180deg)"}},"bottom-right-triangle":{triangle:{top:"35px",right:"10px",transform:"rotate(180deg)"},triangleShadow:{top:"37px",right:"9px",transform:"rotate(180deg)"}}},c),{"hide-triangle":s==="hide","top-left-triangle":s==="top-left","top-right-triangle":s==="top-right","bottom-left-triangle":s==="bottom-left","bottom-right-triangle":s==="bottom-right"}),f=function(g,m){return i({hex:g,source:"hex"},m)};return $.createElement("div",{style:h.card,className:"github-picker "+d},$.createElement("div",{style:h.triangleShadow}),$.createElement("div",{style:h.triangle}),Xi(n,function(p){return $.createElement(Pz,{color:p,key:p,onClick:f,onSwatchHover:o})}))};Ap.propTypes={width:he.oneOfType([he.string,he.number]),colors:he.arrayOf(he.string),triangle:he.oneOf(["hide","top-left","top-right","bottom-left","bottom-right"]),styles:he.object};Ap.defaultProps={width:200,colors:["#B80000","#DB3E00","#FCCB00","#008B02","#006B76","#1273DE","#004DCF","#5300EB","#EB9694","#FAD0C3","#FEF3BD","#C1E1C5","#BEDADC","#C4DEF6","#BED3F3","#D4C4FB"],triangle:"top-left",styles:{}};ar(Ap);var Oz=function(e){var r=e.direction,n=$e({default:{picker:{width:"18px",height:"18px",borderRadius:"50%",transform:"translate(-9px, -1px)",backgroundColor:"rgb(248, 248, 248)",boxShadow:"0 1px 4px 0 rgba(0, 0, 0, 0.37)"}},vertical:{picker:{transform:"translate(-3px, -9px)"}}},{vertical:r==="vertical"});return $.createElement("div",{style:n.picker})},Az=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},$p=function(e){var r=e.width,n=e.height,i=e.onChange,o=e.hsl,s=e.direction,a=e.pointer,c=e.styles,u=c===void 0?{}:c,d=e.className,h=d===void 0?"":d,f=$e(sr({default:{picker:{position:"relative",width:r,height:n},hue:{radius:"2px"}}},u)),p=function(m){return i({a:1,h:m.h,l:.5,s:1})};return $.createElement("div",{style:f.picker,className:"hue-picker "+h},$.createElement(xs,Az({},f.hue,{hsl:o,pointer:a,onChange:p,direction:s})))};$p.propTypes={styles:he.object};$p.defaultProps={width:"316px",height:"16px",direction:"horizontal",pointer:Oz,styles:{}};ar($p);var $z=function(e){var r=e.onChange,n=e.hex,i=e.rgb,o=e.styles,s=o===void 0?{}:o,a=e.className,c=a===void 0?"":a,u=$e(sr({default:{material:{width:"98px",height:"98px",padding:"16px",fontFamily:"Roboto"},HEXwrap:{position:"relative"},HEXinput:{width:"100%",marginTop:"12px",fontSize:"15px",color:"#333",padding:"0px",border:"0px",borderBottom:"2px solid "+n,outline:"none",height:"30px"},HEXlabel:{position:"absolute",top:"0px",left:"0px",fontSize:"11px",color:"#999999",textTransform:"capitalize"},Hex:{style:{}},RGBwrap:{position:"relative"},RGBinput:{width:"100%",marginTop:"12px",fontSize:"15px",color:"#333",padding:"0px",border:"0px",borderBottom:"1px solid #eee",outline:"none",height:"30px"},RGBlabel:{position:"absolute",top:"0px",left:"0px",fontSize:"11px",color:"#999999",textTransform:"capitalize"},split:{display:"flex",marginRight:"-10px",paddingTop:"11px"},third:{flex:"1",paddingRight:"10px"}}},s)),d=function(f,p){f.hex?ai(f.hex)&&r({hex:f.hex,source:"hex"},p):(f.r||f.g||f.b)&&r({r:f.r||i.r,g:f.g||i.g,b:f.b||i.b,source:"rgb"},p)};return $.createElement(Ja,{styles:s},$.createElement("div",{style:u.material,className:"material-picker "+c},$.createElement(Ge,{style:{wrap:u.HEXwrap,input:u.HEXinput,label:u.HEXlabel},label:"hex",value:n,onChange:d}),$.createElement("div",{style:u.split,className:"flexbox-fix"},$.createElement("div",{style:u.third},$.createElement(Ge,{style:{wrap:u.RGBwrap,input:u.RGBinput,label:u.RGBlabel},label:"r",value:i.r,onChange:d})),$.createElement("div",{style:u.third},$.createElement(Ge,{style:{wrap:u.RGBwrap,input:u.RGBinput,label:u.RGBlabel},label:"g",value:i.g,onChange:d})),$.createElement("div",{style:u.third},$.createElement(Ge,{style:{wrap:u.RGBwrap,input:u.RGBinput,label:u.RGBlabel},label:"b",value:i.b,onChange:d})))))};ar($z);var Iz=function(e){var r=e.onChange,n=e.rgb,i=e.hsv,o=e.hex,s=$e({default:{fields:{paddingTop:"5px",paddingBottom:"9px",width:"80px",position:"relative"},divider:{height:"5px"},RGBwrap:{position:"relative"},RGBinput:{marginLeft:"40%",width:"40%",height:"18px",border:"1px solid #888888",boxShadow:"inset 0 1px 1px rgba(0,0,0,.1), 0 1px 0 0 #ECECEC",marginBottom:"5px",fontSize:"13px",paddingLeft:"3px",marginRight:"10px"},RGBlabel:{left:"0px",top:"0px",width:"34px",textTransform:"uppercase",fontSize:"13px",height:"18px",lineHeight:"22px",position:"absolute"},HEXwrap:{position:"relative"},HEXinput:{marginLeft:"20%",width:"80%",height:"18px",border:"1px solid #888888",boxShadow:"inset 0 1px 1px rgba(0,0,0,.1), 0 1px 0 0 #ECECEC",marginBottom:"6px",fontSize:"13px",paddingLeft:"3px"},HEXlabel:{position:"absolute",top:"0px",left:"0px",width:"14px",textTransform:"uppercase",fontSize:"13px",height:"18px",lineHeight:"22px"},fieldSymbols:{position:"absolute",top:"5px",right:"-7px",fontSize:"13px"},symbol:{height:"20px",lineHeight:"22px",paddingBottom:"7px"}}}),a=function(u,d){u["#"]?ai(u["#"])&&r({hex:u["#"],source:"hex"},d):u.r||u.g||u.b?r({r:u.r||n.r,g:u.g||n.g,b:u.b||n.b,source:"rgb"},d):(u.h||u.s||u.v)&&r({h:u.h||i.h,s:u.s||i.s,v:u.v||i.v,source:"hsv"},d)};return $.createElement("div",{style:s.fields},$.createElement(Ge,{style:{wrap:s.RGBwrap,input:s.RGBinput,label:s.RGBlabel},label:"h",value:Math.round(i.h),onChange:a}),$.createElement(Ge,{style:{wrap:s.RGBwrap,input:s.RGBinput,label:s.RGBlabel},label:"s",value:Math.round(i.s*100),onChange:a}),$.createElement(Ge,{style:{wrap:s.RGBwrap,input:s.RGBinput,label:s.RGBlabel},label:"v",value:Math.round(i.v*100),onChange:a}),$.createElement("div",{style:s.divider}),$.createElement(Ge,{style:{wrap:s.RGBwrap,input:s.RGBinput,label:s.RGBlabel},label:"r",value:n.r,onChange:a}),$.createElement(Ge,{style:{wrap:s.RGBwrap,input:s.RGBinput,label:s.RGBlabel},label:"g",value:n.g,onChange:a}),$.createElement(Ge,{style:{wrap:s.RGBwrap,input:s.RGBinput,label:s.RGBlabel},label:"b",value:n.b,onChange:a}),$.createElement("div",{style:s.divider}),$.createElement(Ge,{style:{wrap:s.HEXwrap,input:s.HEXinput,label:s.HEXlabel},label:"#",value:o.replace("#",""),onChange:a}),$.createElement("div",{style:s.fieldSymbols},$.createElement("div",{style:s.symbol},"°"),$.createElement("div",{style:s.symbol},"%"),$.createElement("div",{style:s.symbol},"%")))},Mz=function(e){var r=e.hsl,n=$e({default:{picker:{width:"12px",height:"12px",borderRadius:"6px",boxShadow:"inset 0 0 0 1px #fff",transform:"translate(-6px, -6px)"}},"black-outline":{picker:{boxShadow:"inset 0 0 0 1px #000"}}},{"black-outline":r.l>.5});return $.createElement("div",{style:n.picker})},Lz=function(){var e=$e({default:{triangle:{width:0,height:0,borderStyle:"solid",borderWidth:"4px 0 4px 6px",borderColor:"transparent transparent transparent #fff",position:"absolute",top:"1px",left:"1px"},triangleBorder:{width:0,height:0,borderStyle:"solid",borderWidth:"5px 0 5px 8px",borderColor:"transparent transparent transparent #555"},left:{Extend:"triangleBorder",transform:"translate(-13px, -4px)"},leftInside:{Extend:"triangle",transform:"translate(-8px, -5px)"},right:{Extend:"triangleBorder",transform:"translate(20px, -14px) rotate(180deg)"},rightInside:{Extend:"triangle",transform:"translate(-8px, -5px)"}}});return $.createElement("div",{style:e.pointer},$.createElement("div",{style:e.left},$.createElement("div",{style:e.leftInside})),$.createElement("div",{style:e.right},$.createElement("div",{style:e.rightInside})))},yv=function(e){var r=e.onClick,n=e.label,i=e.children,o=e.active,s=$e({default:{button:{backgroundImage:"linear-gradient(-180deg, #FFFFFF 0%, #E6E6E6 100%)",border:"1px solid #878787",borderRadius:"2px",height:"20px",boxShadow:"0 1px 0 0 #EAEAEA",fontSize:"14px",color:"#000",lineHeight:"20px",textAlign:"center",marginBottom:"10px",cursor:"pointer"}},active:{button:{boxShadow:"0 0 0 1px #878787"}}},{active:o});return $.createElement("div",{style:s.button,onClick:r},n||i)},Dz=function(e){var r=e.rgb,n=e.currentColor,i=$e({default:{swatches:{border:"1px solid #B3B3B3",borderBottom:"1px solid #F0F0F0",marginBottom:"2px",marginTop:"1px"},new:{height:"34px",background:"rgb("+r.r+","+r.g+", "+r.b+")",boxShadow:"inset 1px 0 0 #000, inset -1px 0 0 #000, inset 0 1px 0 #000"},current:{height:"34px",background:n,boxShadow:"inset 1px 0 0 #000, inset -1px 0 0 #000, inset 0 -1px 0 #000"},label:{fontSize:"14px",color:"#000",textAlign:"center"}}});return $.createElement("div",null,$.createElement("div",{style:i.label},"new"),$.createElement("div",{style:i.swatches},$.createElement("div",{style:i.new}),$.createElement("div",{style:i.current})),$.createElement("div",{style:i.label},"current"))},zz=function(){function t(e,r){for(var n=0;n<r.length;n++){var i=r[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}();function Fz(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function Bz(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e&&(typeof e=="object"||typeof e=="function")?e:t}function Uz(t,e){if(typeof e!="function"&&e!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}var Ip=function(t){Uz(e,t);function e(r){Fz(this,e);var n=Bz(this,(e.__proto__||Object.getPrototypeOf(e)).call(this));return n.state={currentColor:r.hex},n}return zz(e,[{key:"render",value:function(){var n=this.props,i=n.styles,o=i===void 0?{}:i,s=n.className,a=s===void 0?"":s,c=$e(sr({default:{picker:{background:"#DCDCDC",borderRadius:"4px",boxShadow:"0 0 0 1px rgba(0,0,0,.25), 0 8px 16px rgba(0,0,0,.15)",boxSizing:"initial",width:"513px"},head:{backgroundImage:"linear-gradient(-180deg, #F0F0F0 0%, #D4D4D4 100%)",borderBottom:"1px solid #B1B1B1",boxShadow:"inset 0 1px 0 0 rgba(255,255,255,.2), inset 0 -1px 0 0 rgba(0,0,0,.02)",height:"23px",lineHeight:"24px",borderRadius:"4px 4px 0 0",fontSize:"13px",color:"#4D4D4D",textAlign:"center"},body:{padding:"15px 15px 0",display:"flex"},saturation:{width:"256px",height:"256px",position:"relative",border:"2px solid #B3B3B3",borderBottom:"2px solid #F0F0F0",overflow:"hidden"},hue:{position:"relative",height:"256px",width:"19px",marginLeft:"10px",border:"2px solid #B3B3B3",borderBottom:"2px solid #F0F0F0"},controls:{width:"180px",marginLeft:"10px"},top:{display:"flex"},previews:{width:"60px"},actions:{flex:"1",marginLeft:"20px"}}},o));return $.createElement("div",{style:c.picker,className:"photoshop-picker "+a},$.createElement("div",{style:c.head},this.props.header),$.createElement("div",{style:c.body,className:"flexbox-fix"},$.createElement("div",{style:c.saturation},$.createElement(yu,{hsl:this.props.hsl,hsv:this.props.hsv,pointer:Mz,onChange:this.props.onChange})),$.createElement("div",{style:c.hue},$.createElement(xs,{direction:"vertical",hsl:this.props.hsl,pointer:Lz,onChange:this.props.onChange})),$.createElement("div",{style:c.controls},$.createElement("div",{style:c.top,className:"flexbox-fix"},$.createElement("div",{style:c.previews},$.createElement(Dz,{rgb:this.props.rgb,currentColor:this.state.currentColor})),$.createElement("div",{style:c.actions},$.createElement(yv,{label:"OK",onClick:this.props.onAccept,active:!0}),$.createElement(yv,{label:"Cancel",onClick:this.props.onCancel}),$.createElement(Iz,{onChange:this.props.onChange,rgb:this.props.rgb,hsv:this.props.hsv,hex:this.props.hex}))))))}}]),e}($.Component);Ip.propTypes={header:he.string,styles:he.object};Ip.defaultProps={header:"Color Picker",styles:{}};ar(Ip);var Hz=function(e){var r=e.onChange,n=e.rgb,i=e.hsl,o=e.hex,s=e.disableAlpha,a=$e({default:{fields:{display:"flex",paddingTop:"4px"},single:{flex:"1",paddingLeft:"6px"},alpha:{flex:"1",paddingLeft:"6px"},double:{flex:"2"},input:{width:"80%",padding:"4px 10% 3px",border:"none",boxShadow:"inset 0 0 0 1px #ccc",fontSize:"11px"},label:{display:"block",textAlign:"center",fontSize:"11px",color:"#222",paddingTop:"3px",paddingBottom:"4px",textTransform:"capitalize"}},disableAlpha:{alpha:{display:"none"}}},{disableAlpha:s}),c=function(d,h){d.hex?ai(d.hex)&&r({hex:d.hex,source:"hex"},h):d.r||d.g||d.b?r({r:d.r||n.r,g:d.g||n.g,b:d.b||n.b,a:n.a,source:"rgb"},h):d.a&&(d.a<0?d.a=0:d.a>100&&(d.a=100),d.a/=100,r({h:i.h,s:i.s,l:i.l,a:d.a,source:"rgb"},h))};return $.createElement("div",{style:a.fields,className:"flexbox-fix"},$.createElement("div",{style:a.double},$.createElement(Ge,{style:{input:a.input,label:a.label},label:"hex",value:o.replace("#",""),onChange:c})),$.createElement("div",{style:a.single},$.createElement(Ge,{style:{input:a.input,label:a.label},label:"r",value:n.r,onChange:c,dragLabel:"true",dragMax:"255"})),$.createElement("div",{style:a.single},$.createElement(Ge,{style:{input:a.input,label:a.label},label:"g",value:n.g,onChange:c,dragLabel:"true",dragMax:"255"})),$.createElement("div",{style:a.single},$.createElement(Ge,{style:{input:a.input,label:a.label},label:"b",value:n.b,onChange:c,dragLabel:"true",dragMax:"255"})),$.createElement("div",{style:a.alpha},$.createElement(Ge,{style:{input:a.input,label:a.label},label:"a",value:Math.round(n.a*100),onChange:c,dragLabel:"true",dragMax:"100"})))},Wz=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},k1=function(e){var r=e.colors,n=e.onClick,i=n===void 0?function(){}:n,o=e.onSwatchHover,s=$e({default:{colors:{margin:"0 -10px",padding:"10px 0 0 10px",borderTop:"1px solid #eee",display:"flex",flexWrap:"wrap",position:"relative"},swatchWrap:{width:"16px",height:"16px",margin:"0 10px 10px 0"},swatch:{borderRadius:"3px",boxShadow:"inset 0 0 0 1px rgba(0,0,0,.15)"}},"no-presets":{colors:{display:"none"}}},{"no-presets":!r||!r.length}),a=function(u,d){i({hex:u,source:"hex"},d)};return $.createElement("div",{style:s.colors,className:"flexbox-fix"},r.map(function(c){var u=typeof c=="string"?{color:c}:c,d=""+u.color+(u.title||"");return $.createElement("div",{key:d,style:s.swatchWrap},$.createElement(Yi,Wz({},u,{style:s.swatch,onClick:a,onHover:o,focusStyle:{boxShadow:"inset 0 0 0 1px rgba(0,0,0,.15), 0 0 4px "+u.color}})))}))};k1.propTypes={colors:he.arrayOf(he.oneOfType([he.string,he.shape({color:he.string,title:he.string})])).isRequired};var Gz=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},Mp=function(e){var r=e.width,n=e.rgb,i=e.hex,o=e.hsv,s=e.hsl,a=e.onChange,c=e.onSwatchHover,u=e.disableAlpha,d=e.presetColors,h=e.renderers,f=e.styles,p=f===void 0?{}:f,g=e.className,m=g===void 0?"":g,b=$e(sr({default:Gz({picker:{width:r,padding:"10px 10px 0",boxSizing:"initial",background:"#fff",borderRadius:"4px",boxShadow:"0 0 0 1px rgba(0,0,0,.15), 0 8px 16px rgba(0,0,0,.15)"},saturation:{width:"100%",paddingBottom:"75%",position:"relative",overflow:"hidden"},Saturation:{radius:"3px",shadow:"inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)"},controls:{display:"flex"},sliders:{padding:"4px 0",flex:"1"},color:{width:"24px",height:"24px",position:"relative",marginTop:"4px",marginLeft:"4px",borderRadius:"3px"},activeColor:{absolute:"0px 0px 0px 0px",borderRadius:"2px",background:"rgba("+n.r+","+n.g+","+n.b+","+n.a+")",boxShadow:"inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)"},hue:{position:"relative",height:"10px",overflow:"hidden"},Hue:{radius:"2px",shadow:"inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)"},alpha:{position:"relative",height:"10px",marginTop:"4px",overflow:"hidden"},Alpha:{radius:"2px",shadow:"inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)"}},p),disableAlpha:{color:{height:"10px"},hue:{height:"10px"},alpha:{display:"none"}}},p),{disableAlpha:u});return $.createElement("div",{style:b.picker,className:"sketch-picker "+m},$.createElement("div",{style:b.saturation},$.createElement(yu,{style:b.Saturation,hsl:s,hsv:o,onChange:a})),$.createElement("div",{style:b.controls,className:"flexbox-fix"},$.createElement("div",{style:b.sliders},$.createElement("div",{style:b.hue},$.createElement(xs,{style:b.Hue,hsl:s,onChange:a})),$.createElement("div",{style:b.alpha},$.createElement(vp,{style:b.Alpha,rgb:n,hsl:s,renderers:h,onChange:a}))),$.createElement("div",{style:b.color},$.createElement(bs,null),$.createElement("div",{style:b.activeColor}))),$.createElement(Hz,{rgb:n,hsl:s,hex:i,onChange:a,disableAlpha:u}),$.createElement(k1,{colors:d,onClick:a,onSwatchHover:c}))};Mp.propTypes={disableAlpha:he.bool,width:he.oneOfType([he.string,he.number]),styles:he.object};Mp.defaultProps={disableAlpha:!1,width:200,styles:{},presetColors:["#D0021B","#F5A623","#F8E71C","#8B572A","#7ED321","#417505","#BD10E0","#9013FE","#4A90E2","#50E3C2","#B8E986","#000000","#4A4A4A","#9B9B9B","#FFFFFF"]};ar(Mp);var Gs=function(e){var r=e.hsl,n=e.offset,i=e.onClick,o=i===void 0?function(){}:i,s=e.active,a=e.first,c=e.last,u=$e({default:{swatch:{height:"12px",background:"hsl("+r.h+", 50%, "+n*100+"%)",cursor:"pointer"}},first:{swatch:{borderRadius:"2px 0 0 2px"}},last:{swatch:{borderRadius:"0 2px 2px 0"}},active:{swatch:{transform:"scaleY(1.8)",borderRadius:"3.6px/2px"}}},{active:s,first:a,last:c}),d=function(f){return o({h:r.h,s:.5,l:n,source:"hsl"},f)};return $.createElement("div",{style:u.swatch,onClick:d})},Vz=function(e){var r=e.onClick,n=e.hsl,i=$e({default:{swatches:{marginTop:"20px"},swatch:{boxSizing:"border-box",width:"20%",paddingRight:"1px",float:"left"},clear:{clear:"both"}}}),o=.1;return $.createElement("div",{style:i.swatches},$.createElement("div",{style:i.swatch},$.createElement(Gs,{hsl:n,offset:".80",active:Math.abs(n.l-.8)<o&&Math.abs(n.s-.5)<o,onClick:r,first:!0})),$.createElement("div",{style:i.swatch},$.createElement(Gs,{hsl:n,offset:".65",active:Math.abs(n.l-.65)<o&&Math.abs(n.s-.5)<o,onClick:r})),$.createElement("div",{style:i.swatch},$.createElement(Gs,{hsl:n,offset:".50",active:Math.abs(n.l-.5)<o&&Math.abs(n.s-.5)<o,onClick:r})),$.createElement("div",{style:i.swatch},$.createElement(Gs,{hsl:n,offset:".35",active:Math.abs(n.l-.35)<o&&Math.abs(n.s-.5)<o,onClick:r})),$.createElement("div",{style:i.swatch},$.createElement(Gs,{hsl:n,offset:".20",active:Math.abs(n.l-.2)<o&&Math.abs(n.s-.5)<o,onClick:r,last:!0})),$.createElement("div",{style:i.clear}))},qz=function(){var e=$e({default:{picker:{width:"14px",height:"14px",borderRadius:"6px",transform:"translate(-7px, -1px)",backgroundColor:"rgb(248, 248, 248)",boxShadow:"0 1px 4px 0 rgba(0, 0, 0, 0.37)"}}});return $.createElement("div",{style:e.picker})},Lp=function(e){var r=e.hsl,n=e.onChange,i=e.pointer,o=e.styles,s=o===void 0?{}:o,a=e.className,c=a===void 0?"":a,u=$e(sr({default:{hue:{height:"12px",position:"relative"},Hue:{radius:"2px"}}},s));return $.createElement("div",{style:u.wrap||{},className:"slider-picker "+c},$.createElement("div",{style:u.hue},$.createElement(xs,{style:u.Hue,hsl:r,pointer:i,onChange:n})),$.createElement("div",{style:u.swatches},$.createElement(Vz,{hsl:r,onClick:n})))};Lp.propTypes={styles:he.object};Lp.defaultProps={pointer:qz,styles:{}};ar(Lp);var j1={};Object.defineProperty(j1,"__esModule",{value:!0});var bv=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},Kz=M,xv=Yz(Kz);function Yz(t){return t&&t.__esModule?t:{default:t}}function Xz(t,e){var r={};for(var n in t)e.indexOf(n)>=0||Object.prototype.hasOwnProperty.call(t,n)&&(r[n]=t[n]);return r}var Il=24,Zz=j1.default=function(t){var e=t.fill,r=e===void 0?"currentColor":e,n=t.width,i=n===void 0?Il:n,o=t.height,s=o===void 0?Il:o,a=t.style,c=a===void 0?{}:a,u=Xz(t,["fill","width","height","style"]);return xv.default.createElement("svg",bv({viewBox:"0 0 "+Il+" "+Il,style:bv({fill:r,width:i,height:s},c)},u),xv.default.createElement("path",{d:"M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"}))},Jz=function(e){var r=e.color,n=e.onClick,i=n===void 0?function(){}:n,o=e.onSwatchHover,s=e.first,a=e.last,c=e.active,u=$e({default:{color:{width:"40px",height:"24px",cursor:"pointer",background:r,marginBottom:"1px"},check:{color:jp(r),marginLeft:"8px",display:"none"}},first:{color:{overflow:"hidden",borderRadius:"2px 2px 0 0"}},last:{color:{overflow:"hidden",borderRadius:"0 0 2px 2px"}},active:{check:{display:"block"}},"color-#FFFFFF":{color:{boxShadow:"inset 0 0 0 1px #ddd"},check:{color:"#333"}},transparent:{check:{color:"#333"}}},{first:s,last:a,active:c,"color-#FFFFFF":r==="#FFFFFF",transparent:r==="transparent"});return $.createElement(Yi,{color:r,style:u.color,onClick:i,onHover:o,focusStyle:{boxShadow:"0 0 4px "+r}},$.createElement("div",{style:u.check},$.createElement(Zz,null)))},Qz=function(e){var r=e.onClick,n=e.onSwatchHover,i=e.group,o=e.active,s=$e({default:{group:{paddingBottom:"10px",width:"40px",float:"left",marginRight:"10px"}}});return $.createElement("div",{style:s.group},Xi(i,function(a,c){return $.createElement(Jz,{key:a,color:a,active:a.toLowerCase()===o,first:c===0,last:c===i.length-1,onClick:r,onSwatchHover:n})}))},Dp=function(e){var r=e.width,n=e.height,i=e.onChange,o=e.onSwatchHover,s=e.colors,a=e.hex,c=e.styles,u=c===void 0?{}:c,d=e.className,h=d===void 0?"":d,f=$e(sr({default:{picker:{width:r,height:n},overflow:{height:n,overflowY:"scroll"},body:{padding:"16px 0 6px 16px"},clear:{clear:"both"}}},u)),p=function(m,b){return i({hex:m,source:"hex"},b)};return $.createElement("div",{style:f.picker,className:"swatches-picker "+h},$.createElement(Ja,null,$.createElement("div",{style:f.overflow},$.createElement("div",{style:f.body},Xi(s,function(g){return $.createElement(Qz,{key:g.toString(),group:g,active:a,onClick:p,onSwatchHover:o})}),$.createElement("div",{style:f.clear})))))};Dp.propTypes={width:he.oneOfType([he.string,he.number]),height:he.oneOfType([he.string,he.number]),colors:he.arrayOf(he.arrayOf(he.string)),styles:he.object};Dp.defaultProps={width:320,height:240,colors:[[mo[900],mo[700],mo[500],mo[300],mo[100]],[go[900],go[700],go[500],go[300],go[100]],[vo[900],vo[700],vo[500],vo[300],vo[100]],[yo[900],yo[700],yo[500],yo[300],yo[100]],[bo[900],bo[700],bo[500],bo[300],bo[100]],[xo[900],xo[700],xo[500],xo[300],xo[100]],[wo[900],wo[700],wo[500],wo[300],wo[100]],[_o[900],_o[700],_o[500],_o[300],_o[100]],[So[900],So[700],So[500],So[300],So[100]],["#194D33",ta[700],ta[500],ta[300],ta[100]],[ko[900],ko[700],ko[500],ko[300],ko[100]],[jo[900],jo[700],jo[500],jo[300],jo[100]],[Co[900],Co[700],Co[500],Co[300],Co[100]],[Eo[900],Eo[700],Eo[500],Eo[300],Eo[100]],[To[900],To[700],To[500],To[300],To[100]],[Ro[900],Ro[700],Ro[500],Ro[300],Ro[100]],[No[900],No[700],No[500],No[300],No[100]],[Po[900],Po[700],Po[500],Po[300],Po[100]],["#000000","#525252","#969696","#D9D9D9","#FFFFFF"]],styles:{}};ar(Dp);var zp=function(e){var r=e.onChange,n=e.onSwatchHover,i=e.hex,o=e.colors,s=e.width,a=e.triangle,c=e.styles,u=c===void 0?{}:c,d=e.className,h=d===void 0?"":d,f=$e(sr({default:{card:{width:s,background:"#fff",border:"0 solid rgba(0,0,0,0.25)",boxShadow:"0 1px 4px rgba(0,0,0,0.25)",borderRadius:"4px",position:"relative"},body:{padding:"15px 9px 9px 15px"},label:{fontSize:"18px",color:"#fff"},triangle:{width:"0px",height:"0px",borderStyle:"solid",borderWidth:"0 9px 10px 9px",borderColor:"transparent transparent #fff transparent",position:"absolute"},triangleShadow:{width:"0px",height:"0px",borderStyle:"solid",borderWidth:"0 9px 10px 9px",borderColor:"transparent transparent rgba(0,0,0,.1) transparent",position:"absolute"},hash:{background:"#F0F0F0",height:"30px",width:"30px",borderRadius:"4px 0 0 4px",float:"left",color:"#98A1A4",display:"flex",alignItems:"center",justifyContent:"center"},input:{width:"100px",fontSize:"14px",color:"#666",border:"0px",outline:"none",height:"28px",boxShadow:"inset 0 0 0 1px #F0F0F0",boxSizing:"content-box",borderRadius:"0 4px 4px 0",float:"left",paddingLeft:"8px"},swatch:{width:"30px",height:"30px",float:"left",borderRadius:"4px",margin:"0 6px 6px 0"},clear:{clear:"both"}},"hide-triangle":{triangle:{display:"none"},triangleShadow:{display:"none"}},"top-left-triangle":{triangle:{top:"-10px",left:"12px"},triangleShadow:{top:"-11px",left:"12px"}},"top-right-triangle":{triangle:{top:"-10px",right:"12px"},triangleShadow:{top:"-11px",right:"12px"}}},u),{"hide-triangle":a==="hide","top-left-triangle":a==="top-left","top-right-triangle":a==="top-right"}),p=function(m,b){ai(m)&&r({hex:m,source:"hex"},b)};return $.createElement("div",{style:f.card,className:"twitter-picker "+h},$.createElement("div",{style:f.triangleShadow}),$.createElement("div",{style:f.triangle}),$.createElement("div",{style:f.body},Xi(o,function(g,m){return $.createElement(Yi,{key:m,color:g,hex:g,style:f.swatch,onClick:p,onHover:n,focusStyle:{boxShadow:"0 0 4px "+g}})}),$.createElement("div",{style:f.hash},"#"),$.createElement(Ge,{label:null,style:{input:f.input},value:i.replace("#",""),onChange:p}),$.createElement("div",{style:f.clear})))};zp.propTypes={width:he.oneOfType([he.string,he.number]),triangle:he.oneOf(["hide","top-left","top-right"]),colors:he.arrayOf(he.string),styles:he.object};zp.defaultProps={width:276,colors:["#FF6900","#FCB900","#7BDCB5","#00D084","#8ED1FC","#0693E3","#ABB8C3","#EB144C","#F78DA7","#9900EF"],triangle:"top-left",styles:{}};ar(zp);var Fp=function(e){var r=$e({default:{picker:{width:"20px",height:"20px",borderRadius:"22px",border:"2px #fff solid",transform:"translate(-12px, -13px)",background:"hsl("+Math.round(e.hsl.h)+", "+Math.round(e.hsl.s*100)+"%, "+Math.round(e.hsl.l*100)+"%)"}}});return $.createElement("div",{style:r.picker})};Fp.propTypes={hsl:he.shape({h:he.number,s:he.number,l:he.number,a:he.number})};Fp.defaultProps={hsl:{a:1,h:249.94,l:.2,s:.5}};var Bp=function(e){var r=$e({default:{picker:{width:"20px",height:"20px",borderRadius:"22px",transform:"translate(-10px, -7px)",background:"hsl("+Math.round(e.hsl.h)+", 100%, 50%)",border:"2px white solid"}}});return $.createElement("div",{style:r.picker})};Bp.propTypes={hsl:he.shape({h:he.number,s:he.number,l:he.number,a:he.number})};Bp.defaultProps={hsl:{a:1,h:249.94,l:.2,s:.5}};var eF=function(e){var r=e.onChange,n=e.rgb,i=e.hsl,o=e.hex,s=e.hsv,a=function(p,g){if(p.hex)ai(p.hex)&&r({hex:p.hex,source:"hex"},g);else if(p.rgb){var m=p.rgb.split(",");vd(p.rgb,"rgb")&&r({r:m[0],g:m[1],b:m[2],a:1,source:"rgb"},g)}else if(p.hsv){var b=p.hsv.split(",");vd(p.hsv,"hsv")&&(b[2]=b[2].replace("%",""),b[1]=b[1].replace("%",""),b[0]=b[0].replace("°",""),b[1]==1?b[1]=.01:b[2]==1&&(b[2]=.01),r({h:Number(b[0]),s:Number(b[1]),v:Number(b[2]),source:"hsv"},g))}else if(p.hsl){var v=p.hsl.split(",");vd(p.hsl,"hsl")&&(v[2]=v[2].replace("%",""),v[1]=v[1].replace("%",""),v[0]=v[0].replace("°",""),h[1]==1?h[1]=.01:h[2]==1&&(h[2]=.01),r({h:Number(v[0]),s:Number(v[1]),v:Number(v[2]),source:"hsl"},g))}},c=$e({default:{wrap:{display:"flex",height:"100px",marginTop:"4px"},fields:{width:"100%"},column:{paddingTop:"10px",display:"flex",justifyContent:"space-between"},double:{padding:"0px 4.4px",boxSizing:"border-box"},input:{width:"100%",height:"38px",boxSizing:"border-box",padding:"4px 10% 3px",textAlign:"center",border:"1px solid #dadce0",fontSize:"11px",textTransform:"lowercase",borderRadius:"5px",outline:"none",fontFamily:"Roboto,Arial,sans-serif"},input2:{height:"38px",width:"100%",border:"1px solid #dadce0",boxSizing:"border-box",fontSize:"11px",textTransform:"lowercase",borderRadius:"5px",outline:"none",paddingLeft:"10px",fontFamily:"Roboto,Arial,sans-serif"},label:{textAlign:"center",fontSize:"12px",background:"#fff",position:"absolute",textTransform:"uppercase",color:"#3c4043",width:"35px",top:"-6px",left:"0",right:"0",marginLeft:"auto",marginRight:"auto",fontFamily:"Roboto,Arial,sans-serif"},label2:{left:"10px",textAlign:"center",fontSize:"12px",background:"#fff",position:"absolute",textTransform:"uppercase",color:"#3c4043",width:"32px",top:"-6px",fontFamily:"Roboto,Arial,sans-serif"},single:{flexGrow:"1",margin:"0px 4.4px"}}}),u=n.r+", "+n.g+", "+n.b,d=Math.round(i.h)+"°, "+Math.round(i.s*100)+"%, "+Math.round(i.l*100)+"%",h=Math.round(s.h)+"°, "+Math.round(s.s*100)+"%, "+Math.round(s.v*100)+"%";return $.createElement("div",{style:c.wrap,className:"flexbox-fix"},$.createElement("div",{style:c.fields},$.createElement("div",{style:c.double},$.createElement(Ge,{style:{input:c.input,label:c.label},label:"hex",value:o,onChange:a})),$.createElement("div",{style:c.column},$.createElement("div",{style:c.single},$.createElement(Ge,{style:{input:c.input2,label:c.label2},label:"rgb",value:u,onChange:a})),$.createElement("div",{style:c.single},$.createElement(Ge,{style:{input:c.input2,label:c.label2},label:"hsv",value:h,onChange:a})),$.createElement("div",{style:c.single},$.createElement(Ge,{style:{input:c.input2,label:c.label2},label:"hsl",value:d,onChange:a})))))},Up=function(e){var r=e.width,n=e.onChange,i=e.rgb,o=e.hsl,s=e.hsv,a=e.hex,c=e.header,u=e.styles,d=u===void 0?{}:u,h=e.className,f=h===void 0?"":h,p=$e(sr({default:{picker:{width:r,background:"#fff",border:"1px solid #dfe1e5",boxSizing:"initial",display:"flex",flexWrap:"wrap",borderRadius:"8px 8px 0px 0px"},head:{height:"57px",width:"100%",paddingTop:"16px",paddingBottom:"16px",paddingLeft:"16px",fontSize:"20px",boxSizing:"border-box",fontFamily:"Roboto-Regular,HelveticaNeue,Arial,sans-serif"},saturation:{width:"70%",padding:"0px",position:"relative",overflow:"hidden"},swatch:{width:"30%",height:"228px",padding:"0px",background:"rgba("+i.r+", "+i.g+", "+i.b+", 1)",position:"relative",overflow:"hidden"},body:{margin:"auto",width:"95%"},controls:{display:"flex",boxSizing:"border-box",height:"52px",paddingTop:"22px"},color:{width:"32px"},hue:{height:"8px",position:"relative",margin:"0px 16px 0px 16px",width:"100%"},Hue:{radius:"2px"}}},d));return $.createElement("div",{style:p.picker,className:"google-picker "+f},$.createElement("div",{style:p.head},c),$.createElement("div",{style:p.swatch}),$.createElement("div",{style:p.saturation},$.createElement(yu,{hsl:o,hsv:s,pointer:Fp,onChange:n})),$.createElement("div",{style:p.body},$.createElement("div",{style:p.controls,className:"flexbox-fix"},$.createElement("div",{style:p.hue},$.createElement(xs,{style:p.Hue,hsl:o,radius:"4px",pointer:Bp,onChange:n}))),$.createElement(eF,{rgb:i,hsl:o,hex:a,hsv:s,onChange:n})))};Up.propTypes={width:he.oneOfType([he.string,he.number]),styles:he.object,header:he.string};Up.defaultProps={width:652,styles:{},header:"Color picker"};ar(Up);function tF({color:t,mode:e="blend",onColorChange:r,onClose:n}){var u;const[i,o]=M.useState((t==null?void 0:t.hex)||"#000000");M.useEffect(()=>{t!=null&&t.hex&&o(t.hex)},[t==null?void 0:t.hex]);const s=d=>{const h=d.hex;o(h),r&&r(h)},a=()=>{t!=null&&t.originalHex&&(o(t.originalHex),r&&r(t.originalHex))},c=d=>{const h=d.hex;o(h),r&&r(h)};return t?l.jsxs("div",{className:"color-editor-panel",children:[l.jsxs("div",{className:"editor-header",children:[l.jsx("h3",{children:"Edit Colour"}),l.jsx("button",{onClick:n,className:"close-button",children:"×"})]}),l.jsxs("div",{className:"editor-content",children:[l.jsxs("div",{className:"color-info-section",children:[l.jsx("div",{className:"color-display",children:l.jsxs("div",{className:"swatch-pair",children:[l.jsxs("div",{className:"swatch-group",children:[l.jsx("div",{className:"swatch original",style:{backgroundColor:t.originalHex||t.hex},title:"Original colour"}),l.jsx("span",{className:"swatch-label",children:"Original"})]}),l.jsx("span",{className:"arrow",children:"→"}),l.jsxs("div",{className:"swatch-group",children:[l.jsx("div",{className:"swatch current",style:{backgroundColor:i},title:"Current colour"}),l.jsx("span",{className:"swatch-label",children:"Current"})]})]})}),l.jsxs("div",{className:"color-details",children:[l.jsxs("div",{className:"detail-row",children:[l.jsx("span",{className:"label",children:"Hex:"}),l.jsx("span",{className:"value",children:i})]}),l.jsxs("div",{className:"detail-row",children:[l.jsx("span",{className:"label",children:"Coverage:"}),l.jsxs("span",{className:"value",children:[((u=t.areaPct)==null?void 0:u.toFixed(1))||0,"%"]})]})]})]}),l.jsxs("div",{className:"tpv-palette-section",children:[l.jsx("h4",{children:"Standard TPV Colours"}),l.jsx("p",{className:"palette-description",children:"Select a pure TPV colour (no blending required)"}),l.jsx("div",{className:"tpv-color-grid",children:en.map(d=>l.jsxs("div",{className:`tpv-color-item ${i.toLowerCase()===d.hex.toLowerCase()?"selected":""}`,onClick:()=>c(d),title:`${d.code} - ${d.name}`,children:[l.jsx("div",{className:"tpv-color-swatch",style:{backgroundColor:d.hex}}),l.jsx("span",{className:"tpv-color-code",children:d.code})]},d.code))})]}),e==="blend"&&l.jsxs("div",{className:"picker-section",children:[l.jsx("h4",{children:"Custom Colour"}),l.jsx("p",{className:"picker-description",children:"Choose any colour (may require blending)"}),l.jsx(Ez,{color:i,onChange:s,disableAlpha:!0}),l.jsx("button",{onClick:a,className:"reset-button",children:"Reset to Original Colour"})]}),e==="solid"&&l.jsxs("div",{className:"solid-mode-info",children:[l.jsx("h4",{children:"Solid Mode Editing"}),l.jsx("p",{className:"info-description",children:"In solid mode, you can only select from the standard TPV colours above. Custom colours require blending - switch to Blend Mode for full colour customisation."}),l.jsx("button",{onClick:a,className:"reset-button",children:"Reset to Original Colour"})]})]}),l.jsx("style",{jsx:!0,children:`
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
      `})]}):null}const bn=11102230246251565e-32,Ut=134217729,rF=(3+8*bn)*bn;function bd(t,e,r,n,i){let o,s,a,c,u=e[0],d=n[0],h=0,f=0;d>u==d>-u?(o=u,u=e[++h]):(o=d,d=n[++f]);let p=0;if(h<t&&f<r)for(d>u==d>-u?(s=u+o,a=o-(s-u),u=e[++h]):(s=d+o,a=o-(s-d),d=n[++f]),o=s,a!==0&&(i[p++]=a);h<t&&f<r;)d>u==d>-u?(s=o+u,c=s-o,a=o-(s-c)+(u-c),u=e[++h]):(s=o+d,c=s-o,a=o-(s-c)+(d-c),d=n[++f]),o=s,a!==0&&(i[p++]=a);for(;h<t;)s=o+u,c=s-o,a=o-(s-c)+(u-c),u=e[++h],o=s,a!==0&&(i[p++]=a);for(;f<r;)s=o+d,c=s-o,a=o-(s-c)+(d-c),d=n[++f],o=s,a!==0&&(i[p++]=a);return(o!==0||p===0)&&(i[p++]=o),p}function nF(t,e){let r=e[0];for(let n=1;n<t;n++)r+=e[n];return r}function Qa(t){return new Float64Array(t)}const iF=(3+16*bn)*bn,oF=(2+12*bn)*bn,sF=(9+64*bn)*bn*bn,co=Qa(4),wv=Qa(8),_v=Qa(12),Sv=Qa(16),qt=Qa(4);function aF(t,e,r,n,i,o,s){let a,c,u,d,h,f,p,g,m,b,v,y,x,S,j,_,C,R;const T=t-i,P=r-i,H=e-o,E=n-o;S=T*E,f=Ut*T,p=f-(f-T),g=T-p,f=Ut*E,m=f-(f-E),b=E-m,j=g*b-(S-p*m-g*m-p*b),_=H*P,f=Ut*H,p=f-(f-H),g=H-p,f=Ut*P,m=f-(f-P),b=P-m,C=g*b-(_-p*m-g*m-p*b),v=j-C,h=j-v,co[0]=j-(v+h)+(h-C),y=S+v,h=y-S,x=S-(y-h)+(v-h),v=x-_,h=x-v,co[1]=x-(v+h)+(h-_),R=y+v,h=R-y,co[2]=y-(R-h)+(v-h),co[3]=R;let I=nF(4,co),w=oF*s;if(I>=w||-I>=w||(h=t-T,a=t-(T+h)+(h-i),h=r-P,u=r-(P+h)+(h-i),h=e-H,c=e-(H+h)+(h-o),h=n-E,d=n-(E+h)+(h-o),a===0&&c===0&&u===0&&d===0)||(w=sF*s+rF*Math.abs(I),I+=T*d+E*a-(H*u+P*c),I>=w||-I>=w))return I;S=a*E,f=Ut*a,p=f-(f-a),g=a-p,f=Ut*E,m=f-(f-E),b=E-m,j=g*b-(S-p*m-g*m-p*b),_=c*P,f=Ut*c,p=f-(f-c),g=c-p,f=Ut*P,m=f-(f-P),b=P-m,C=g*b-(_-p*m-g*m-p*b),v=j-C,h=j-v,qt[0]=j-(v+h)+(h-C),y=S+v,h=y-S,x=S-(y-h)+(v-h),v=x-_,h=x-v,qt[1]=x-(v+h)+(h-_),R=y+v,h=R-y,qt[2]=y-(R-h)+(v-h),qt[3]=R;const z=bd(4,co,4,qt,wv);S=T*d,f=Ut*T,p=f-(f-T),g=T-p,f=Ut*d,m=f-(f-d),b=d-m,j=g*b-(S-p*m-g*m-p*b),_=H*u,f=Ut*H,p=f-(f-H),g=H-p,f=Ut*u,m=f-(f-u),b=u-m,C=g*b-(_-p*m-g*m-p*b),v=j-C,h=j-v,qt[0]=j-(v+h)+(h-C),y=S+v,h=y-S,x=S-(y-h)+(v-h),v=x-_,h=x-v,qt[1]=x-(v+h)+(h-_),R=y+v,h=R-y,qt[2]=y-(R-h)+(v-h),qt[3]=R;const Z=bd(z,wv,4,qt,_v);S=a*d,f=Ut*a,p=f-(f-a),g=a-p,f=Ut*d,m=f-(f-d),b=d-m,j=g*b-(S-p*m-g*m-p*b),_=c*u,f=Ut*c,p=f-(f-c),g=c-p,f=Ut*u,m=f-(f-u),b=u-m,C=g*b-(_-p*m-g*m-p*b),v=j-C,h=j-v,qt[0]=j-(v+h)+(h-C),y=S+v,h=y-S,x=S-(y-h)+(v-h),v=x-_,h=x-v,qt[1]=x-(v+h)+(h-_),R=y+v,h=R-y,qt[2]=y-(R-h)+(v-h),qt[3]=R;const q=bd(Z,_v,4,qt,Sv);return Sv[q-1]}function Ml(t,e,r,n,i,o){const s=(e-o)*(r-i),a=(t-i)*(n-o),c=s-a,u=Math.abs(s+a);return Math.abs(c)>=iF*u?c:-aF(t,e,r,n,i,o,u)}const kv=Math.pow(2,-52),Ll=new Uint32Array(512);class Dc{static from(e,r=hF,n=fF){const i=e.length,o=new Float64Array(i*2);for(let s=0;s<i;s++){const a=e[s];o[2*s]=r(a),o[2*s+1]=n(a)}return new Dc(o)}constructor(e){const r=e.length>>1;if(r>0&&typeof e[0]!="number")throw new Error("Expected coords to contain numbers.");this.coords=e;const n=Math.max(2*r-5,0);this._triangles=new Uint32Array(n*3),this._halfedges=new Int32Array(n*3),this._hashSize=Math.ceil(Math.sqrt(r)),this._hullPrev=new Uint32Array(r),this._hullNext=new Uint32Array(r),this._hullTri=new Uint32Array(r),this._hullHash=new Int32Array(this._hashSize),this._ids=new Uint32Array(r),this._dists=new Float64Array(r),this.update()}update(){const{coords:e,_hullPrev:r,_hullNext:n,_hullTri:i,_hullHash:o}=this,s=e.length>>1;let a=1/0,c=1/0,u=-1/0,d=-1/0;for(let T=0;T<s;T++){const P=e[2*T],H=e[2*T+1];P<a&&(a=P),H<c&&(c=H),P>u&&(u=P),H>d&&(d=H),this._ids[T]=T}const h=(a+u)/2,f=(c+d)/2;let p,g,m;for(let T=0,P=1/0;T<s;T++){const H=xd(h,f,e[2*T],e[2*T+1]);H<P&&(p=T,P=H)}const b=e[2*p],v=e[2*p+1];for(let T=0,P=1/0;T<s;T++){if(T===p)continue;const H=xd(b,v,e[2*T],e[2*T+1]);H<P&&H>0&&(g=T,P=H)}let y=e[2*g],x=e[2*g+1],S=1/0;for(let T=0;T<s;T++){if(T===p||T===g)continue;const P=uF(b,v,y,x,e[2*T],e[2*T+1]);P<S&&(m=T,S=P)}let j=e[2*m],_=e[2*m+1];if(S===1/0){for(let H=0;H<s;H++)this._dists[H]=e[2*H]-e[0]||e[2*H+1]-e[1];Wo(this._ids,this._dists,0,s-1);const T=new Uint32Array(s);let P=0;for(let H=0,E=-1/0;H<s;H++){const I=this._ids[H],w=this._dists[I];w>E&&(T[P++]=I,E=w)}this.hull=T.subarray(0,P),this.triangles=new Uint32Array(0),this.halfedges=new Uint32Array(0);return}if(Ml(b,v,y,x,j,_)<0){const T=g,P=y,H=x;g=m,y=j,x=_,m=T,j=P,_=H}const C=dF(b,v,y,x,j,_);this._cx=C.x,this._cy=C.y;for(let T=0;T<s;T++)this._dists[T]=xd(e[2*T],e[2*T+1],C.x,C.y);Wo(this._ids,this._dists,0,s-1),this._hullStart=p;let R=3;n[p]=r[m]=g,n[g]=r[p]=m,n[m]=r[g]=p,i[p]=0,i[g]=1,i[m]=2,o.fill(-1),o[this._hashKey(b,v)]=p,o[this._hashKey(y,x)]=g,o[this._hashKey(j,_)]=m,this.trianglesLen=0,this._addTriangle(p,g,m,-1,-1,-1);for(let T=0,P,H;T<this._ids.length;T++){const E=this._ids[T],I=e[2*E],w=e[2*E+1];if(T>0&&Math.abs(I-P)<=kv&&Math.abs(w-H)<=kv||(P=I,H=w,E===p||E===g||E===m))continue;let z=0;for(let K=0,L=this._hashKey(I,w);K<this._hashSize&&(z=o[(L+K)%this._hashSize],!(z!==-1&&z!==n[z]));K++);z=r[z];let Z=z,q;for(;q=n[Z],Ml(I,w,e[2*Z],e[2*Z+1],e[2*q],e[2*q+1])>=0;)if(Z=q,Z===z){Z=-1;break}if(Z===-1)continue;let V=this._addTriangle(Z,E,n[Z],-1,-1,i[Z]);i[E]=this._legalize(V+2),i[Z]=V,R++;let A=n[Z];for(;q=n[A],Ml(I,w,e[2*A],e[2*A+1],e[2*q],e[2*q+1])<0;)V=this._addTriangle(A,E,q,i[E],-1,i[A]),i[E]=this._legalize(V+2),n[A]=A,R--,A=q;if(Z===z)for(;q=r[Z],Ml(I,w,e[2*q],e[2*q+1],e[2*Z],e[2*Z+1])<0;)V=this._addTriangle(q,E,Z,-1,i[Z],i[q]),this._legalize(V+2),i[q]=V,n[Z]=Z,R--,Z=q;this._hullStart=r[E]=Z,n[Z]=r[A]=E,n[E]=A,o[this._hashKey(I,w)]=E,o[this._hashKey(e[2*Z],e[2*Z+1])]=Z}this.hull=new Uint32Array(R);for(let T=0,P=this._hullStart;T<R;T++)this.hull[T]=P,P=n[P];this.triangles=this._triangles.subarray(0,this.trianglesLen),this.halfedges=this._halfedges.subarray(0,this.trianglesLen)}_hashKey(e,r){return Math.floor(lF(e-this._cx,r-this._cy)*this._hashSize)%this._hashSize}_legalize(e){const{_triangles:r,_halfedges:n,coords:i}=this;let o=0,s=0;for(;;){const a=n[e],c=e-e%3;if(s=c+(e+2)%3,a===-1){if(o===0)break;e=Ll[--o];continue}const u=a-a%3,d=c+(e+1)%3,h=u+(a+2)%3,f=r[s],p=r[e],g=r[d],m=r[h];if(cF(i[2*f],i[2*f+1],i[2*p],i[2*p+1],i[2*g],i[2*g+1],i[2*m],i[2*m+1])){r[e]=m,r[a]=f;const v=n[h];if(v===-1){let x=this._hullStart;do{if(this._hullTri[x]===h){this._hullTri[x]=e;break}x=this._hullPrev[x]}while(x!==this._hullStart)}this._link(e,v),this._link(a,n[s]),this._link(s,h);const y=u+(a+1)%3;o<Ll.length&&(Ll[o++]=y)}else{if(o===0)break;e=Ll[--o]}}return s}_link(e,r){this._halfedges[e]=r,r!==-1&&(this._halfedges[r]=e)}_addTriangle(e,r,n,i,o,s){const a=this.trianglesLen;return this._triangles[a]=e,this._triangles[a+1]=r,this._triangles[a+2]=n,this._link(a,i),this._link(a+1,o),this._link(a+2,s),this.trianglesLen+=3,a}}function lF(t,e){const r=t/(Math.abs(t)+Math.abs(e));return(e>0?3-r:1+r)/4}function xd(t,e,r,n){const i=t-r,o=e-n;return i*i+o*o}function cF(t,e,r,n,i,o,s,a){const c=t-s,u=e-a,d=r-s,h=n-a,f=i-s,p=o-a,g=c*c+u*u,m=d*d+h*h,b=f*f+p*p;return c*(h*b-m*p)-u*(d*b-m*f)+g*(d*p-h*f)<0}function uF(t,e,r,n,i,o){const s=r-t,a=n-e,c=i-t,u=o-e,d=s*s+a*a,h=c*c+u*u,f=.5/(s*u-a*c),p=(u*d-a*h)*f,g=(s*h-c*d)*f;return p*p+g*g}function dF(t,e,r,n,i,o){const s=r-t,a=n-e,c=i-t,u=o-e,d=s*s+a*a,h=c*c+u*u,f=.5/(s*u-a*c),p=t+(u*d-a*h)*f,g=e+(s*h-c*d)*f;return{x:p,y:g}}function Wo(t,e,r,n){if(n-r<=20)for(let i=r+1;i<=n;i++){const o=t[i],s=e[o];let a=i-1;for(;a>=r&&e[t[a]]>s;)t[a+1]=t[a--];t[a+1]=o}else{const i=r+n>>1;let o=r+1,s=n;Vs(t,i,o),e[t[r]]>e[t[n]]&&Vs(t,r,n),e[t[o]]>e[t[n]]&&Vs(t,o,n),e[t[r]]>e[t[o]]&&Vs(t,r,o);const a=t[o],c=e[a];for(;;){do o++;while(e[t[o]]<c);do s--;while(e[t[s]]>c);if(s<o)break;Vs(t,o,s)}t[r+1]=t[s],t[s]=a,n-o+1>=s-r?(Wo(t,e,o,n),Wo(t,e,r,s-1)):(Wo(t,e,r,s-1),Wo(t,e,o,n))}}function Vs(t,e,r){const n=t[e];t[e]=t[r],t[r]=n}function hF(t){return t[0]}function fF(t){return t[1]}const jv=1e-6;class Oi{constructor(){this._x0=this._y0=this._x1=this._y1=null,this._=""}moveTo(e,r){this._+=`M${this._x0=this._x1=+e},${this._y0=this._y1=+r}`}closePath(){this._x1!==null&&(this._x1=this._x0,this._y1=this._y0,this._+="Z")}lineTo(e,r){this._+=`L${this._x1=+e},${this._y1=+r}`}arc(e,r,n){e=+e,r=+r,n=+n;const i=e+n,o=r;if(n<0)throw new Error("negative radius");this._x1===null?this._+=`M${i},${o}`:(Math.abs(this._x1-i)>jv||Math.abs(this._y1-o)>jv)&&(this._+="L"+i+","+o),n&&(this._+=`A${n},${n},0,1,1,${e-n},${r}A${n},${n},0,1,1,${this._x1=i},${this._y1=o}`)}rect(e,r,n,i){this._+=`M${this._x0=this._x1=+e},${this._y0=this._y1=+r}h${+n}v${+i}h${-n}Z`}value(){return this._||null}}class Vh{constructor(){this._=[]}moveTo(e,r){this._.push([e,r])}closePath(){this._.push(this._[0].slice())}lineTo(e,r){this._.push([e,r])}value(){return this._.length?this._:null}}class pF{constructor(e,[r,n,i,o]=[0,0,960,500]){if(!((i=+i)>=(r=+r))||!((o=+o)>=(n=+n)))throw new Error("invalid bounds");this.delaunay=e,this._circumcenters=new Float64Array(e.points.length*2),this.vectors=new Float64Array(e.points.length*2),this.xmax=i,this.xmin=r,this.ymax=o,this.ymin=n,this._init()}update(){return this.delaunay.update(),this._init(),this}_init(){const{delaunay:{points:e,hull:r,triangles:n},vectors:i}=this;let o,s;const a=this.circumcenters=this._circumcenters.subarray(0,n.length/3*2);for(let m=0,b=0,v=n.length,y,x;m<v;m+=3,b+=2){const S=n[m]*2,j=n[m+1]*2,_=n[m+2]*2,C=e[S],R=e[S+1],T=e[j],P=e[j+1],H=e[_],E=e[_+1],I=T-C,w=P-R,z=H-C,Z=E-R,q=(I*Z-w*z)*2;if(Math.abs(q)<1e-9){if(o===void 0){o=s=0;for(const A of r)o+=e[A*2],s+=e[A*2+1];o/=r.length,s/=r.length}const V=1e9*Math.sign((o-C)*Z-(s-R)*z);y=(C+H)/2-V*Z,x=(R+E)/2+V*z}else{const V=1/q,A=I*I+w*w,K=z*z+Z*Z;y=C+(Z*A-w*K)*V,x=R+(I*K-z*A)*V}a[b]=y,a[b+1]=x}let c=r[r.length-1],u,d=c*4,h,f=e[2*c],p,g=e[2*c+1];i.fill(0);for(let m=0;m<r.length;++m)c=r[m],u=d,h=f,p=g,d=c*4,f=e[2*c],g=e[2*c+1],i[u+2]=i[d]=p-g,i[u+3]=i[d+1]=f-h}render(e){const r=e==null?e=new Oi:void 0,{delaunay:{halfedges:n,inedges:i,hull:o},circumcenters:s,vectors:a}=this;if(o.length<=1)return null;for(let d=0,h=n.length;d<h;++d){const f=n[d];if(f<d)continue;const p=Math.floor(d/3)*2,g=Math.floor(f/3)*2,m=s[p],b=s[p+1],v=s[g],y=s[g+1];this._renderSegment(m,b,v,y,e)}let c,u=o[o.length-1];for(let d=0;d<o.length;++d){c=u,u=o[d];const h=Math.floor(i[u]/3)*2,f=s[h],p=s[h+1],g=c*4,m=this._project(f,p,a[g+2],a[g+3]);m&&this._renderSegment(f,p,m[0],m[1],e)}return r&&r.value()}renderBounds(e){const r=e==null?e=new Oi:void 0;return e.rect(this.xmin,this.ymin,this.xmax-this.xmin,this.ymax-this.ymin),r&&r.value()}renderCell(e,r){const n=r==null?r=new Oi:void 0,i=this._clip(e);if(i===null||!i.length)return;r.moveTo(i[0],i[1]);let o=i.length;for(;i[0]===i[o-2]&&i[1]===i[o-1]&&o>1;)o-=2;for(let s=2;s<o;s+=2)(i[s]!==i[s-2]||i[s+1]!==i[s-1])&&r.lineTo(i[s],i[s+1]);return r.closePath(),n&&n.value()}*cellPolygons(){const{delaunay:{points:e}}=this;for(let r=0,n=e.length/2;r<n;++r){const i=this.cellPolygon(r);i&&(i.index=r,yield i)}}cellPolygon(e){const r=new Vh;return this.renderCell(e,r),r.value()}_renderSegment(e,r,n,i,o){let s;const a=this._regioncode(e,r),c=this._regioncode(n,i);a===0&&c===0?(o.moveTo(e,r),o.lineTo(n,i)):(s=this._clipSegment(e,r,n,i,a,c))&&(o.moveTo(s[0],s[1]),o.lineTo(s[2],s[3]))}contains(e,r,n){return r=+r,r!==r||(n=+n,n!==n)?!1:this.delaunay._step(e,r,n)===e}*neighbors(e){const r=this._clip(e);if(r)for(const n of this.delaunay.neighbors(e)){const i=this._clip(n);if(i){e:for(let o=0,s=r.length;o<s;o+=2)for(let a=0,c=i.length;a<c;a+=2)if(r[o]===i[a]&&r[o+1]===i[a+1]&&r[(o+2)%s]===i[(a+c-2)%c]&&r[(o+3)%s]===i[(a+c-1)%c]){yield n;break e}}}}_cell(e){const{circumcenters:r,delaunay:{inedges:n,halfedges:i,triangles:o}}=this,s=n[e];if(s===-1)return null;const a=[];let c=s;do{const u=Math.floor(c/3);if(a.push(r[u*2],r[u*2+1]),c=c%3===2?c-2:c+1,o[c]!==e)break;c=i[c]}while(c!==s&&c!==-1);return a}_clip(e){if(e===0&&this.delaunay.hull.length===1)return[this.xmax,this.ymin,this.xmax,this.ymax,this.xmin,this.ymax,this.xmin,this.ymin];const r=this._cell(e);if(r===null)return null;const{vectors:n}=this,i=e*4;return this._simplify(n[i]||n[i+1]?this._clipInfinite(e,r,n[i],n[i+1],n[i+2],n[i+3]):this._clipFinite(e,r))}_clipFinite(e,r){const n=r.length;let i=null,o,s,a=r[n-2],c=r[n-1],u,d=this._regioncode(a,c),h,f=0;for(let p=0;p<n;p+=2)if(o=a,s=c,a=r[p],c=r[p+1],u=d,d=this._regioncode(a,c),u===0&&d===0)h=f,f=0,i?i.push(a,c):i=[a,c];else{let g,m,b,v,y;if(u===0){if((g=this._clipSegment(o,s,a,c,u,d))===null)continue;[m,b,v,y]=g}else{if((g=this._clipSegment(a,c,o,s,d,u))===null)continue;[v,y,m,b]=g,h=f,f=this._edgecode(m,b),h&&f&&this._edge(e,h,f,i,i.length),i?i.push(m,b):i=[m,b]}h=f,f=this._edgecode(v,y),h&&f&&this._edge(e,h,f,i,i.length),i?i.push(v,y):i=[v,y]}if(i)h=f,f=this._edgecode(i[0],i[1]),h&&f&&this._edge(e,h,f,i,i.length);else if(this.contains(e,(this.xmin+this.xmax)/2,(this.ymin+this.ymax)/2))return[this.xmax,this.ymin,this.xmax,this.ymax,this.xmin,this.ymax,this.xmin,this.ymin];return i}_clipSegment(e,r,n,i,o,s){const a=o<s;for(a&&([e,r,n,i,o,s]=[n,i,e,r,s,o]);;){if(o===0&&s===0)return a?[n,i,e,r]:[e,r,n,i];if(o&s)return null;let c,u,d=o||s;d&8?(c=e+(n-e)*(this.ymax-r)/(i-r),u=this.ymax):d&4?(c=e+(n-e)*(this.ymin-r)/(i-r),u=this.ymin):d&2?(u=r+(i-r)*(this.xmax-e)/(n-e),c=this.xmax):(u=r+(i-r)*(this.xmin-e)/(n-e),c=this.xmin),o?(e=c,r=u,o=this._regioncode(e,r)):(n=c,i=u,s=this._regioncode(n,i))}}_clipInfinite(e,r,n,i,o,s){let a=Array.from(r),c;if((c=this._project(a[0],a[1],n,i))&&a.unshift(c[0],c[1]),(c=this._project(a[a.length-2],a[a.length-1],o,s))&&a.push(c[0],c[1]),a=this._clipFinite(e,a))for(let u=0,d=a.length,h,f=this._edgecode(a[d-2],a[d-1]);u<d;u+=2)h=f,f=this._edgecode(a[u],a[u+1]),h&&f&&(u=this._edge(e,h,f,a,u),d=a.length);else this.contains(e,(this.xmin+this.xmax)/2,(this.ymin+this.ymax)/2)&&(a=[this.xmin,this.ymin,this.xmax,this.ymin,this.xmax,this.ymax,this.xmin,this.ymax]);return a}_edge(e,r,n,i,o){for(;r!==n;){let s,a;switch(r){case 5:r=4;continue;case 4:r=6,s=this.xmax,a=this.ymin;break;case 6:r=2;continue;case 2:r=10,s=this.xmax,a=this.ymax;break;case 10:r=8;continue;case 8:r=9,s=this.xmin,a=this.ymax;break;case 9:r=1;continue;case 1:r=5,s=this.xmin,a=this.ymin;break}(i[o]!==s||i[o+1]!==a)&&this.contains(e,s,a)&&(i.splice(o,0,s,a),o+=2)}return o}_project(e,r,n,i){let o=1/0,s,a,c;if(i<0){if(r<=this.ymin)return null;(s=(this.ymin-r)/i)<o&&(c=this.ymin,a=e+(o=s)*n)}else if(i>0){if(r>=this.ymax)return null;(s=(this.ymax-r)/i)<o&&(c=this.ymax,a=e+(o=s)*n)}if(n>0){if(e>=this.xmax)return null;(s=(this.xmax-e)/n)<o&&(a=this.xmax,c=r+(o=s)*i)}else if(n<0){if(e<=this.xmin)return null;(s=(this.xmin-e)/n)<o&&(a=this.xmin,c=r+(o=s)*i)}return[a,c]}_edgecode(e,r){return(e===this.xmin?1:e===this.xmax?2:0)|(r===this.ymin?4:r===this.ymax?8:0)}_regioncode(e,r){return(e<this.xmin?1:e>this.xmax?2:0)|(r<this.ymin?4:r>this.ymax?8:0)}_simplify(e){if(e&&e.length>4){for(let r=0;r<e.length;r+=2){const n=(r+2)%e.length,i=(r+4)%e.length;(e[r]===e[n]&&e[n]===e[i]||e[r+1]===e[n+1]&&e[n+1]===e[i+1])&&(e.splice(n,2),r-=2)}e.length||(e=null)}return e}}const mF=2*Math.PI,uo=Math.pow;function gF(t){return t[0]}function vF(t){return t[1]}function yF(t){const{triangles:e,coords:r}=t;for(let n=0;n<e.length;n+=3){const i=2*e[n],o=2*e[n+1],s=2*e[n+2];if((r[s]-r[i])*(r[o+1]-r[i+1])-(r[o]-r[i])*(r[s+1]-r[i+1])>1e-10)return!1}return!0}function bF(t,e,r){return[t+Math.sin(t+e)*r,e+Math.cos(t-e)*r]}class Hp{static from(e,r=gF,n=vF,i){return new Hp("length"in e?xF(e,r,n,i):Float64Array.from(wF(e,r,n,i)))}constructor(e){this._delaunator=new Dc(e),this.inedges=new Int32Array(e.length/2),this._hullIndex=new Int32Array(e.length/2),this.points=this._delaunator.coords,this._init()}update(){return this._delaunator.update(),this._init(),this}_init(){const e=this._delaunator,r=this.points;if(e.hull&&e.hull.length>2&&yF(e)){this.collinear=Int32Array.from({length:r.length/2},(f,p)=>p).sort((f,p)=>r[2*f]-r[2*p]||r[2*f+1]-r[2*p+1]);const c=this.collinear[0],u=this.collinear[this.collinear.length-1],d=[r[2*c],r[2*c+1],r[2*u],r[2*u+1]],h=1e-8*Math.hypot(d[3]-d[1],d[2]-d[0]);for(let f=0,p=r.length/2;f<p;++f){const g=bF(r[2*f],r[2*f+1],h);r[2*f]=g[0],r[2*f+1]=g[1]}this._delaunator=new Dc(r)}else delete this.collinear;const n=this.halfedges=this._delaunator.halfedges,i=this.hull=this._delaunator.hull,o=this.triangles=this._delaunator.triangles,s=this.inedges.fill(-1),a=this._hullIndex.fill(-1);for(let c=0,u=n.length;c<u;++c){const d=o[c%3===2?c-2:c+1];(n[c]===-1||s[d]===-1)&&(s[d]=c)}for(let c=0,u=i.length;c<u;++c)a[i[c]]=c;i.length<=2&&i.length>0&&(this.triangles=new Int32Array(3).fill(-1),this.halfedges=new Int32Array(3).fill(-1),this.triangles[0]=i[0],s[i[0]]=1,i.length===2&&(s[i[1]]=0,this.triangles[1]=i[1],this.triangles[2]=i[1]))}voronoi(e){return new pF(this,e)}*neighbors(e){const{inedges:r,hull:n,_hullIndex:i,halfedges:o,triangles:s,collinear:a}=this;if(a){const h=a.indexOf(e);h>0&&(yield a[h-1]),h<a.length-1&&(yield a[h+1]);return}const c=r[e];if(c===-1)return;let u=c,d=-1;do{if(yield d=s[u],u=u%3===2?u-2:u+1,s[u]!==e)return;if(u=o[u],u===-1){const h=n[(i[e]+1)%n.length];h!==d&&(yield h);return}}while(u!==c)}find(e,r,n=0){if(e=+e,e!==e||(r=+r,r!==r))return-1;const i=n;let o;for(;(o=this._step(n,e,r))>=0&&o!==n&&o!==i;)n=o;return o}_step(e,r,n){const{inedges:i,hull:o,_hullIndex:s,halfedges:a,triangles:c,points:u}=this;if(i[e]===-1||!u.length)return(e+1)%(u.length>>1);let d=e,h=uo(r-u[e*2],2)+uo(n-u[e*2+1],2);const f=i[e];let p=f;do{let g=c[p];const m=uo(r-u[g*2],2)+uo(n-u[g*2+1],2);if(m<h&&(h=m,d=g),p=p%3===2?p-2:p+1,c[p]!==e)break;if(p=a[p],p===-1){if(p=o[(s[e]+1)%o.length],p!==g&&uo(r-u[p*2],2)+uo(n-u[p*2+1],2)<h)return p;break}}while(p!==f);return d}render(e){const r=e==null?e=new Oi:void 0,{points:n,halfedges:i,triangles:o}=this;for(let s=0,a=i.length;s<a;++s){const c=i[s];if(c<s)continue;const u=o[s]*2,d=o[c]*2;e.moveTo(n[u],n[u+1]),e.lineTo(n[d],n[d+1])}return this.renderHull(e),r&&r.value()}renderPoints(e,r){r===void 0&&(!e||typeof e.moveTo!="function")&&(r=e,e=null),r=r==null?2:+r;const n=e==null?e=new Oi:void 0,{points:i}=this;for(let o=0,s=i.length;o<s;o+=2){const a=i[o],c=i[o+1];e.moveTo(a+r,c),e.arc(a,c,r,0,mF)}return n&&n.value()}renderHull(e){const r=e==null?e=new Oi:void 0,{hull:n,points:i}=this,o=n[0]*2,s=n.length;e.moveTo(i[o],i[o+1]);for(let a=1;a<s;++a){const c=2*n[a];e.lineTo(i[c],i[c+1])}return e.closePath(),r&&r.value()}hullPolygon(){const e=new Vh;return this.renderHull(e),e.value()}renderTriangle(e,r){const n=r==null?r=new Oi:void 0,{points:i,triangles:o}=this,s=o[e*=3]*2,a=o[e+1]*2,c=o[e+2]*2;return r.moveTo(i[s],i[s+1]),r.lineTo(i[a],i[a+1]),r.lineTo(i[c],i[c+1]),r.closePath(),n&&n.value()}*trianglePolygons(){const{triangles:e}=this;for(let r=0,n=e.length/3;r<n;++r)yield this.trianglePolygon(r)}trianglePolygon(e){const r=new Vh;return this.renderTriangle(e,r),r.value()}}function xF(t,e,r,n){const i=t.length,o=new Float64Array(i*2);for(let s=0;s<i;++s){const a=t[s];o[s*2]=e.call(n,a,s,t),o[s*2+1]=r.call(n,a,s,t)}return o}function*wF(t,e,r,n){let i=0;for(const o of t)yield e.call(n,o,i,t),yield r.call(n,o,i,t),++i}const Ii=en,_F=new Map(Ii.map((t,e)=>[t.code,e]));function C1(t){return function(){let e=t+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function SF(t,e,r,n=30,i=Math.random){const o=r/Math.sqrt(2),s=Math.ceil(t/o),a=Math.ceil(e/o),c=new Array(s*a).fill(-1),u=[],d=[];function h(p,g){const m=[p,g];u.push(m);const b=Math.floor(p/o),v=Math.floor(g/o);return c[v*s+b]=u.length-1,d.push(u.length-1),m}function f(p,g){const m=Math.floor(p/o),b=Math.floor(g/o);for(let v=Math.max(0,m-2);v<=Math.min(s-1,m+2);v++)for(let y=Math.max(0,b-2);y<=Math.min(a-1,b+2);y++){const x=c[y*s+v];if(x!==-1){const S=p-u[x][0],j=g-u[x][1];if(S*S+j*j<r*r)return!0}}return!1}for(h(t*i(),e*i());d.length>0;){const p=Math.floor(i()*d.length),g=d[p],m=u[g];let b=!1;for(let v=0;v<n;v++){const y=2*Math.PI*i(),x=r+r*i(),S=m[0]+x*Math.cos(y),j=m[1]+x*Math.sin(y);if(S>=0&&S<t&&j>=0&&j<e&&!f(S,j)){h(S,j),b=!0;break}}b||d.splice(p,1)}return u}const wd={Xn:.95047,Yn:1,Zn:1.08883},kF=[[3.2404542,-1.5371385,-.4985314],[-.969266,1.8760108,.041556],[.0556434,-.2040259,1.0572252]];function _d(t){return t<=.0031308?t*12.92:1.055*Math.pow(t,1/2.4)-.055}function jF(t){return{R:Math.round(_d(t.R)*255),G:Math.round(_d(t.G)*255),B:Math.round(_d(t.B)*255)}}function CF(t){const[e,r,n]=kF;return{R:e[0]*t.X+e[1]*t.Y+e[2]*t.Z,G:r[0]*t.X+r[1]*t.Y+r[2]*t.Z,B:n[0]*t.X+n[1]*t.Y+n[2]*t.Z}}function Sd(t){const e=.20689655172413793;return t>e?Math.pow(t,3):3*e*e*(t-4/29)}function EF(t){const e=(t.L+16)/116,r=t.a/500+e,n=e-t.b/200;return{X:wd.Xn*Sd(r),Y:wd.Yn*Sd(e),Z:wd.Zn*Sd(n)}}function TF(t){const e=EF(t),r=CF(e);return jF(r)}function RF(t){let e=0;if(t.forEach(c=>e+=c),e===0)return"#FFFFFF";let r=0,n=0,i=0;t.forEach((c,u)=>{const d=Ii[u],h=c/e;r+=d.L*h,n+=d.a*h,i+=d.b*h});const s=TF({L:r,a:n,b:i}),a=c=>Math.round(Math.max(0,Math.min(255,c))).toString(16).padStart(2,"0");return`#${a(s.R)}${a(s.G)}${a(s.B)}`}function NF(t){const e=parseInt(t.slice(1,3),16),r=parseInt(t.slice(3,5),16),n=parseInt(t.slice(5,7),16);return{r:e,g:r,b:n}}function PF(t){const{r:e,g:r,b:n}=NF(t);return(e*299+r*587+n*114)/1e3>128?"#000000":"#FFFFFF"}function OF(t){let e=0;const r={},n=[];return t.forEach((i,o)=>{const s=Ii[o];e+=i,r[s.code]=i,n.push({code:s.code,name:s.name,weight:0,parts:i})}),n.forEach(i=>{i.weight=i.parts/e}),{parts:r,components:n,total:e}}function Cv(t){const e=new Map;return!t||!t.parts||Object.entries(t.parts).forEach(([r,n])=>{const i=_F.get(r);i!==void 0&&e.set(i,n)}),e}function AF(t,e,r,n=12345){const i=C1(n),o=t*e,s=Math.sqrt(o/r)*.8;return SF(t,e,s,30,i)}function $F({parts:t,width:e=400,height:r=400,cellCount:n=1e4,seed:i=12345}){const o=M.useRef(null),[s,a]=M.useState(null),[c,u]=M.useState(!0);return M.useEffect(()=>{(async()=>{u(!0);const h=AF(e,r,n,i),p=Hp.from(h).voronoi([0,0,e,r]);a({points:h,voronoi:p,cellCount:h.length}),u(!1)})()},[i,e,r,n]),M.useEffect(()=>{if(!s||!o.current)return;const d=o.current,h=d.getContext("2d");d.width=e,d.height=r,h.fillStyle="#FAFAFA",h.fillRect(0,0,e,r);let f=0;t.forEach(g=>f+=g);const p=IF(s.cellCount,t,f,i);for(let g=0;g<s.cellCount;g++){const m=p[g],b=m===-1?"#FAFAFA":Ii[m].hex,v=s.voronoi.cellPolygon(g);if(!(!v||v.length<3)){h.beginPath(),h.moveTo(v[0][0],v[0][1]);for(let y=1;y<v.length;y++)h.lineTo(v[y][0],v[y][1]);h.closePath(),h.fillStyle=b,h.fill()}}h.strokeStyle="rgba(0, 0, 0, 0.05)",h.lineWidth=.5;for(let g=0;g<s.cellCount;g++){const m=s.voronoi.cellPolygon(g);if(!(!m||m.length<3)){h.beginPath(),h.moveTo(m[0][0],m[0][1]);for(let b=1;b<m.length;b++)h.lineTo(m[b][0],m[b][1]);h.closePath(),h.stroke()}}},[s,t,i,e,r]),l.jsxs("div",{style:{position:"relative",width:e,height:r},children:[l.jsx("canvas",{ref:o,style:{width:"100%",height:"100%",borderRadius:"8px",boxShadow:"0 2px 8px rgba(0,0,0,0.1)"}}),c&&l.jsx("div",{style:{position:"absolute",top:0,left:0,right:0,bottom:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(255,255,255,0.9)",borderRadius:"8px"},children:l.jsx("div",{style:{textAlign:"center",color:"#666"},children:"Generating granules..."})})]})}function IF(t,e,r,n){const i=new Array(t).fill(-1);if(r===0)return i;const o=n+r,s=C1(o),a=Array.from({length:t},(u,d)=>d);for(let u=a.length-1;u>0;u--){const d=Math.floor(s()*(u+1));[a[u],a[d]]=[a[d],a[u]]}let c=0;return e.forEach((u,d)=>{const h=Math.round(u/r*t);for(let f=0;f<h&&c<t;f++)i[a[c]]=d,c++}),i}function MF({initialRecipe:t=null,onBlendChange:e=null,originalColor:r=null}){const[n,i]=M.useState(new Map);M.useEffect(()=>{if(t){const d=Cv(t);i(d)}},[t]);const o=Array.from(n.values()).reduce((d,h)=>d+h,0),s=RF(n);M.useEffect(()=>{if(e){const d=n.size>0?OF(n):null;e({blendHex:s,parts:n,recipe:d})}},[n,s]);const a=M.useCallback(d=>{i(h=>{const f=h.get(d)||0,p=Array.from(h.values()).reduce((m,b)=>m+b,0);if(f>=4||p>=12)return h;const g=new Map(h);return g.set(d,f+1),g})},[]),c=M.useCallback(d=>{const h=n.get(d)||0;h>0&&i(f=>{const p=new Map(f);return h===1?p.delete(d):p.set(d,h-1),p})},[n]),u=M.useCallback(()=>{i(new Map)},[]);return l.jsxs(l.Fragment,{children:[l.jsxs("div",{className:"mini-mixer-widget",children:[r&&l.jsxs("div",{className:"mixer-header",children:[l.jsx("div",{className:"mixer-title",children:"Customise Blend Recipe"}),l.jsxs("div",{className:"original-color-ref",children:[l.jsx("span",{className:"label",children:"Original:"}),l.jsx("div",{className:"color-swatch",style:{backgroundColor:r,cursor:"pointer"},title:`${r} - Click to reset to original recipe`,onClick:()=>{t&&i(Cv(t))}})]})]}),l.jsx("div",{className:"mixer-canvas-section",children:l.jsx($F,{parts:n,width:700,height:350,cellCount:5e3,seed:12345})}),l.jsx("div",{className:"mix-proportion-bar",children:o===0?l.jsx("div",{className:"proportion-bar-empty"}):Array.from(n.entries()).map(([d,h])=>{const f=h/o*100;return l.jsx("div",{className:"proportion-segment",style:{backgroundColor:Ii[d].hex,flexBasis:`${f}%`},title:`${Ii[d].name}: ${Math.round(f)}%`},d)})}),l.jsxs("div",{className:"blend-preview",children:[l.jsx("div",{className:"blend-preview-label",children:"Blended Result:"}),l.jsxs("div",{className:"blend-preview-color",children:[l.jsx("div",{className:"blend-swatch",style:{backgroundColor:s,color:PF(s)},children:s}),l.jsxs("div",{className:"blend-parts-count",children:[o," ",o===1?"part":"parts"]})]})]}),l.jsxs("div",{className:"mixer-palette-section",children:[l.jsxs("div",{className:"mixer-palette-header",children:[l.jsx("h3",{children:"TPV Color Palette"}),o>0&&l.jsx("button",{className:"clear-btn",onClick:u,children:"Clear All"})]}),l.jsx("div",{className:"mixer-palette-grid",children:Ii.map((d,h)=>{const f=n.get(h)||0;return l.jsxs("div",{className:"mixer-color-item",children:[l.jsx("button",{className:`mixer-color-swatch ${f>0?"has-parts":""}`,style:{backgroundColor:d.hex},onClick:()=>a(h),title:`${d.name} (${d.code})`}),l.jsxs("div",{className:"mixer-color-info",children:[l.jsx("div",{className:"mixer-color-name",children:d.name}),l.jsx("div",{className:"mixer-color-code",children:d.code})]}),l.jsxs("div",{className:"mixer-parts-controls",children:[l.jsx("button",{className:"mixer-parts-btn",onClick:()=>c(h),disabled:f===0,children:"−"}),l.jsx("div",{className:"mixer-parts-count",children:f}),l.jsx("button",{className:"mixer-parts-btn",onClick:()=>a(h),disabled:f>=4||o>=12,title:f>=4?"Max 4 parts per color":o>=12?"Max 12 total parts":"",children:"+"})]})]},h)})})]}),o===0?l.jsx("div",{className:"mixer-instructions",children:"Click colors above to add parts to your blend. The preview updates in real-time."}):o>=12?l.jsx("div",{className:"mixer-instructions",style:{background:"#fef3c7",borderColor:"#fbbf24"},children:"Maximum of 12 parts reached. Remove parts to adjust your blend."}):null]}),l.jsx("style",{children:`
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
      `})]})}async function E1(){var r,n;const t=await Mt.auth.getSession(),e=(n=(r=t==null?void 0:t.data)==null?void 0:r.session)==null?void 0:n.access_token;if(!e)throw new Error("Not authenticated");return{"Content-Type":"application/json",Authorization:`Bearer ${e}`}}async function LF(t){const e=await E1(),r=await fetch("/api/projects/create",{method:"POST",headers:e,body:JSON.stringify(t)});if(!r.ok){const n=await r.json();throw new Error(n.error||"Failed to create project")}return r.json()}async function T1(){const t=await E1(),e=await fetch("/api/projects/list",{method:"GET",headers:t});if(!e.ok){const r=await e.json();throw new Error(r.error||"Failed to list projects")}return e.json()}function DF(t){const{inputMode:e,prompt:r,selectedFile:n,lengthMM:i,widthMM:o,result:s,viewMode:a,blendRecipes:c,solidRecipes:u,colorMapping:d,solidColorMapping:h,solidEditedColors:f,blendEditedColors:p,blendSvgUrl:g,solidSvgUrl:m,arMapping:b,jobId:v,inSituData:y}=t;console.log("[SERIALIZE] Serializing design with result:",s),console.log("[SERIALIZE] result.svg_url:",s==null?void 0:s.svg_url),console.log("[SERIALIZE] result.png_url:",s==null?void 0:s.png_url),console.log("[SERIALIZE] result.thumbnail_url:",s==null?void 0:s.thumbnail_url);const x=S=>S?S instanceof Map?Object.fromEntries(S):S:null;return{input_mode:e,prompt:r||null,uploaded_file_url:(n==null?void 0:n.url)||null,dimensions:{widthMM:o,lengthMM:i},original_svg_url:(s==null?void 0:s.svg_url)||null,original_png_url:(s==null?void 0:s.png_url)||null,thumbnail_url:(s==null?void 0:s.thumb_url)||null,blend_recipes:c||null,solid_recipes:u||null,color_mapping:x(d),solid_color_mapping:x(h),solid_color_edits:x(f),blend_color_edits:x(p),final_blend_svg_url:g||null,final_solid_svg_url:m||null,preferred_view_mode:a||"solid",aspect_ratio_mapping:b||null,job_id:v||null,in_situ:y?{room_photo_url:y.room_photo_url||null,mask_url:y.mask_url||null,floor_dimensions_m:y.floor_dimensions_m||null,preview_url:y.preview_url||null,blend_opacity:y.blend_opacity||20,perspective_corners:y.perspective_corners||null}:null}}function zF(t){var r,n;const e=i=>i?i instanceof Map?i:new Map(Object.entries(i)):new Map;return{inputMode:t.input_mode,prompt:t.prompt||"",selectedFile:t.uploaded_file_url?{url:t.uploaded_file_url,name:t.uploaded_file_url.split("/").pop()}:null,lengthMM:((r=t.dimensions)==null?void 0:r.lengthMM)||0,widthMM:((n=t.dimensions)==null?void 0:n.widthMM)||0,result:{svg_url:t.original_svg_url,png_url:t.original_png_url,thumbnail_url:t.thumbnail_url},blendRecipes:t.blend_recipes||null,solidRecipes:t.solid_recipes||null,colorMapping:e(t.color_mapping),solidColorMapping:e(t.solid_color_mapping),solidEditedColors:e(t.solid_color_edits),blendEditedColors:e(t.blend_color_edits),blendSvgUrl:null,solidSvgUrl:null,viewMode:t.preferred_view_mode||"solid",arMapping:t.aspect_ratio_mapping,jobId:t.job_id,inSituData:t.in_situ||null,generating:!1,generatingBlends:!1,showFinalRecipes:!!t.blend_recipes,showSolidSummary:!!t.solid_recipes,colorEditorOpen:!1,selectedColor:null}}function FF(t){var r;const e=[];return t.inputMode||e.push("Input mode is required"),(!t.widthMM||!t.lengthMM)&&e.push("Surface dimensions are required"),(r=t.result)!=null&&r.svg_url||e.push("No design to save - generate a design first"),{valid:e.length===0,errors:e}}function BF({currentState:t,existingDesignId:e=null,initialName:r="",onClose:n,onSaved:i}){const[o,s]=M.useState(r),[a,c]=M.useState(""),[u,d]=M.useState(""),[h,f]=M.useState(""),[p,g]=M.useState(!1),[m,b]=M.useState([]),[v,y]=M.useState(!1),[x,S]=M.useState(""),[j,_]=M.useState("#1a365d"),[C,R]=M.useState(!1),[T,P]=M.useState(!1),[H,E]=M.useState(!1),[I,w]=M.useState(null);M.useEffect(()=>{z()},[]);const z=async()=>{try{const{projects:A}=await T1();b(A)}catch(A){console.error("Failed to load projects:",A),w("Failed to load projects")}},Z=async()=>{if(!x.trim()){w("Project name is required");return}E(!0),w(null);try{const{project:A}=await LF({name:x.trim(),color:j});b([A,...m]),d(A.id),y(!1),S(""),_("#1a365d")}catch(A){console.error("Failed to create project:",A),w(A.message)}finally{E(!1)}},q=async(A=!1)=>{if(!o.trim()){w("Design name is required");return}const K=FF(t);if(!K.valid){w(K.errors.join(", "));return}A?P(!0):R(!0),w(null);try{const L=DF(t);console.log("[SAVE-MODAL] Serialized design data:",L),console.log("[SAVE-MODAL] SVG URL from serialized data:",L.original_svg_url);const B={name:o.trim(),description:a.trim()||null,project_id:u||null,tags:h.split(",").map(te=>te.trim()).filter(te=>te),is_public:p,design_data:L};console.log("[SAVE-MODAL] Full save payload:",B),e&&!A&&(B.id=e);const fe=await Ij(B);i&&i(fe,o.trim()),n()}catch(L){console.error("Failed to save design:",L),w(L.message)}finally{R(!1),P(!1)}},V=["#1a365d","#ff6b35","#4a90e2","#50c878","#9b59b6","#e74c3c"];return l.jsx("div",{className:"modal-overlay",onClick:n,children:l.jsxs("div",{className:"modal-content save-design-modal",onClick:A=>A.stopPropagation(),children:[l.jsxs("div",{className:"modal-header",children:[l.jsx("h2",{children:e?"Update Design":"Save Design"}),l.jsx("button",{onClick:n,className:"close-button",children:"×"})]}),l.jsxs("div",{className:"modal-body",children:[I&&l.jsx("div",{className:"error-message",children:I}),l.jsxs("div",{className:"form-group",children:[l.jsx("label",{htmlFor:"design-name",children:"Design Name *"}),l.jsx("input",{id:"design-name",type:"text",value:o,onChange:A=>s(A.target.value),placeholder:"e.g., Playground Design A",autoFocus:!0,disabled:C||T})]}),l.jsxs("div",{className:"form-group",children:[l.jsx("label",{htmlFor:"design-description",children:"Description"}),l.jsx("textarea",{id:"design-description",value:a,onChange:A=>c(A.target.value),placeholder:"Optional notes about this design...",rows:3,disabled:C||T})]}),l.jsxs("div",{className:"form-group",children:[l.jsx("label",{htmlFor:"design-project",children:"Project"}),v?l.jsxs("div",{className:"new-project-form",children:[l.jsxs("div",{className:"input-row",children:[l.jsx("input",{type:"text",value:x,onChange:A=>S(A.target.value),placeholder:"Project name...",disabled:H}),l.jsx("div",{className:"color-picker-inline",children:V.map(A=>l.jsx("button",{type:"button",className:`color-swatch ${j===A?"active":""}`,style:{backgroundColor:A},onClick:()=>_(A),disabled:H},A))})]}),l.jsxs("div",{className:"button-row",children:[l.jsx("button",{type:"button",onClick:Z,className:"btn-primary btn-small",disabled:H,children:H?"Creating...":"Create"}),l.jsx("button",{type:"button",onClick:()=>y(!1),className:"btn-secondary btn-small",disabled:H,children:"Cancel"})]})]}):l.jsxs("div",{className:"project-selector",children:[l.jsxs("select",{id:"design-project",value:u,onChange:A=>d(A.target.value),disabled:C||T,children:[l.jsx("option",{value:"",children:"No Project"}),m.map(A=>l.jsxs("option",{value:A.id,children:[A.name," (",A.design_count," designs)"]},A.id))]}),l.jsx("button",{type:"button",onClick:()=>y(!0),className:"btn-secondary btn-small",disabled:C||T,children:"+ New Project"})]})]}),l.jsxs("div",{className:"form-group",children:[l.jsx("label",{htmlFor:"design-tags",children:"Tags"}),l.jsx("input",{id:"design-tags",type:"text",value:h,onChange:A=>f(A.target.value),placeholder:"e.g., playground, vibrant, geometric (comma-separated)",disabled:C||T}),l.jsx("small",{className:"help-text",children:"Separate tags with commas"})]}),l.jsx("div",{className:"form-group checkbox-group",children:l.jsxs("label",{children:[l.jsx("input",{type:"checkbox",checked:p,onChange:A=>g(A.target.checked),disabled:C||T}),l.jsx("span",{children:"Make this design public (shareable link)"})]})})]}),l.jsxs("div",{className:"modal-footer",children:[l.jsx("button",{onClick:n,className:"btn-secondary",disabled:C||T,children:"Cancel"}),e&&l.jsx("button",{onClick:()=>q(!0),className:"btn-secondary",disabled:C||T,children:T?"Saving...":"Save as New"}),l.jsx("button",{onClick:()=>q(!1),className:"btn-primary",disabled:C||T,children:C?"Saving...":e?"Update":"Save Design"})]})]})})}const UF=10*1024*1024,HF=["image/jpeg","image/png","image/jpg"];function WF({onPhotoUploaded:t,disabled:e=!1}){const[r,n]=M.useState(!1),[i,o]=M.useState(!1),[s,a]=M.useState(null),[c,u]=M.useState(null),d=M.useRef(null),h=y=>{y.preventDefault(),e||n(!0)},f=y=>{y.preventDefault(),n(!1)},p=async y=>{if(y.preventDefault(),n(!1),e)return;const x=y.dataTransfer.files;x.length>0&&await b(x[0])},g=()=>{!e&&d.current&&d.current.click()},m=async y=>{y.target.files.length>0&&await b(y.target.files[0])},b=async y=>{if(a(null),!HF.includes(y.type)){a("Please upload a JPG or PNG image");return}if(y.size>UF){a("Image must be under 10MB");return}const x=URL.createObjectURL(y);u(x),console.log("[IN-SITU-UPLOADER] Loading local file to get dimensions...");const S=await new Promise((j,_)=>{const C=new Image;C.onload=()=>{console.log("[IN-SITU-UPLOADER] Local image loaded, dimensions:",C.naturalWidth,"x",C.naturalHeight),j({width:C.naturalWidth,height:C.naturalHeight})},C.onerror=R=>{console.error("[IN-SITU-UPLOADER] Failed to load local image:",R),_(new Error("Failed to read image dimensions"))},C.src=x});o(!0);try{const _=`in-situ-photos/${`${Date.now()}-${Math.random().toString(36).substr(2,9)}.${y.type.split("/")[1]}`}`,{data:C,error:R}=await Mt.storage.from("tpv-studio-uploads").upload(_,y,{cacheControl:"3600",upsert:!1});if(R)throw R;const{data:{publicUrl:T}}=Mt.storage.from("tpv-studio-uploads").getPublicUrl(_);console.log("[IN-SITU-UPLOADER] Photo uploaded:",T),console.log("[IN-SITU-UPLOADER] Using dimensions from local file:",S),console.log("[IN-SITU-UPLOADER] Passing local blob URL for fast preview"),console.log("[IN-SITU-UPLOADER] Calling onPhotoUploaded callback..."),t({url:x,supabaseUrl:T,width:S.width,height:S.height,filename:y.name})}catch(j){console.error("[IN-SITU-UPLOADER] Upload failed:",j),a(j.message||"Upload failed"),URL.revokeObjectURL(x),u(null)}finally{o(!1)}},v=()=>{c&&URL.revokeObjectURL(c),u(null),a(null)};return l.jsxs("div",{className:"in-situ-uploader",children:[c?l.jsxs("div",{className:"preview-container",children:[l.jsx("img",{src:c,alt:"Site preview",className:"preview-image"}),i&&l.jsxs("div",{className:"upload-overlay",children:[l.jsx("div",{className:"upload-spinner"}),l.jsx("p",{children:"Uploading..."})]}),!i&&l.jsx("button",{className:"clear-button",onClick:v,title:"Remove photo",children:l.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[l.jsx("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),l.jsx("line",{x1:"6",y1:"6",x2:"18",y2:"18"})]})})]}):l.jsxs("div",{className:`upload-zone ${r?"dragging":""} ${e?"disabled":""}`,onDragOver:h,onDragLeave:f,onDrop:p,onClick:g,children:[l.jsx("input",{ref:d,type:"file",accept:"image/jpeg,image/png",onChange:m,style:{display:"none"},disabled:e}),l.jsx("div",{className:"upload-icon",children:l.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[l.jsx("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}),l.jsx("polyline",{points:"17 8 12 3 7 8"}),l.jsx("line",{x1:"12",y1:"3",x2:"12",y2:"15"})]})}),l.jsxs("div",{className:"upload-text",children:[l.jsx("p",{className:"primary",children:r?"Drop photo here":"Upload site photo"}),l.jsx("p",{className:"secondary",children:"Drag & drop or click to browse"}),l.jsx("p",{className:"hint",children:"JPG or PNG, max 10MB"})]})]}),s&&l.jsx("div",{className:"error-message",children:s}),l.jsx("style",{children:`
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
      `})]})}function GF(t,e){const[r,n,i,o,s,a,c,u]=t,[d,h,f,p,g,m,b,v]=e,y=[[r,n,1,0,0,0,-d*r,-d*n],[0,0,0,r,n,1,-h*r,-h*n],[i,o,1,0,0,0,-f*i,-f*o],[0,0,0,i,o,1,-p*i,-p*o],[s,a,1,0,0,0,-g*s,-g*a],[0,0,0,s,a,1,-m*s,-m*a],[c,u,1,0,0,0,-b*c,-b*u],[0,0,0,c,u,1,-v*c,-v*u]],S=VF(y,[d,h,f,p,g,m,b,v]);return function(_,C){const R=S[6]*_+S[7]*C+1,T=(S[0]*_+S[1]*C+S[2])/R,P=(S[3]*_+S[4]*C+S[5])/R;return[T,P]}}function VF(t,e){const r=t.length,n=t.map((o,s)=>[...o,e[s]]);for(let o=0;o<r;o++){let s=o;for(let a=o+1;a<r;a++)Math.abs(n[a][o])>Math.abs(n[s][o])&&(s=a);[n[o],n[s]]=[n[s],n[o]];for(let a=o+1;a<r;a++){const c=n[a][o]/n[o][o];for(let u=o;u<=r;u++)n[a][u]-=c*n[o][u]}}const i=new Array(r);for(let o=r-1;o>=0;o--){i[o]=n[o][r];for(let s=o+1;s<r;s++)i[o]-=n[o][s]*i[s];i[o]/=n[o][o]}return i}function Wp(t){return new Promise((e,r)=>{const n=new Image;!t.startsWith("blob:")&&!t.startsWith("data:")?(n.crossOrigin="anonymous",console.log("[LOAD-IMAGE] Loading external URL with CORS:",t.substring(0,50))):console.log("[LOAD-IMAGE] Loading local URL (blob/data):",t.substring(0,50)),n.onload=()=>{console.log("[LOAD-IMAGE] Successfully loaded image:",t.substring(0,50)),e(n)},n.onerror=()=>{console.error("[LOAD-IMAGE] Failed to load image:",t),r(new Error(`Failed to load image: ${t}`))},n.src=t})}async function R1(t,e=1536){console.log("[RASTERIZE-SVG] Starting SVG rasterization:",t.substring(0,50),"maxSize:",e);const r=await Wp(t),{naturalWidth:n,naturalHeight:i}=r;console.log("[RASTERIZE-SVG] SVG loaded with dimensions:",n,"x",i);const o=Math.min(1,e/Math.max(n,i)),s=Math.round(n*o),a=Math.round(i*o);console.log("[RASTERIZE-SVG] Scaling to:",s,"x",a,"(scale:",o.toFixed(2),")");const c=document.createElement("canvas");return c.width=s,c.height=a,c.getContext("2d").drawImage(r,0,0,s,a),console.log("[RASTERIZE-SVG] Drew SVG to canvas"),new Promise((d,h)=>{const f=new Image;f.onload=()=>{console.log("[RASTERIZE-SVG] Successfully rasterized SVG to PNG"),d(f)},f.onerror=p=>{console.error("[RASTERIZE-SVG] Failed to convert canvas to image:",p),h(p)},f.src=c.toDataURL("image/png")})}function N1({photoCtx:t,photoImg:e,designImg:r,quad:n,opacity:i,shape:o,lighting:s}){const a=t.canvas;t.clearRect(0,0,a.width,a.height),t.drawImage(e,0,0,a.width,a.height);const c=r.width,u=r.height,d=[0,0,c,0,c,u,0,u],h=[n[0].x,n[0].y,n[1].x,n[1].y,n[2].x,n[2].y,n[3].x,n[3].y],f=GF(d,h),p=10,g=c/p,m=u/p,b=document.createElement("canvas");if(b.width=c,b.height=u,b.getContext("2d").drawImage(r,0,0),t.save(),t.globalAlpha=i,s&&s.enabled){const x=s.strength||.6,S=1+(s.baseBrightness-1)*x,j=1+(s.baseContrast-1)*x;t.filter=`brightness(${S}) contrast(${j})`}const y=o&&o.length>=3?o:n;t.beginPath(),t.moveTo(y[0].x,y[0].y);for(let x=1;x<y.length;x++)t.lineTo(y[x].x,y[x].y);t.closePath(),t.clip();for(let x=0;x<p;x++)for(let S=0;S<p;S++){const j=x*g,_=S*m,C=(x+1)*g,R=(S+1)*m,T=f(j,_),P=f(C,_),H=f(C,R),E=f(j,R);Ev(t,b,j,_,C,_,j,R,T[0],T[1],P[0],P[1],E[0],E[1]),Ev(t,b,C,_,C,R,j,R,P[0],P[1],H[0],H[1],E[0],E[1])}t.restore()}function Ev(t,e,r,n,i,o,s,a,c,u,d,h,f,p){t.save(),t.beginPath(),t.moveTo(c,u),t.lineTo(d,h),t.lineTo(f,p),t.closePath(),t.clip();const g=(r-s)*(o-a)-(i-s)*(n-a);if(Math.abs(g)<.001){t.restore();return}const m=((c-f)*(o-a)-(d-f)*(n-a))/g,b=((u-p)*(o-a)-(h-p)*(n-a))/g,v=((r-s)*(d-f)-(i-s)*(c-f))/g,y=((r-s)*(h-p)-(i-s)*(u-p))/g,x=c-m*r-v*n,S=u-b*r-y*n;t.setTransform(m,b,v,y,x,S),t.drawImage(e,0,0),t.restore()}function qF(t,e="tpv-in-situ-preview.png"){t.toBlob(r=>{const n=URL.createObjectURL(r),i=document.createElement("a");i.href=n,i.download=e,document.body.appendChild(i),i.click(),document.body.removeChild(i),URL.revokeObjectURL(n)},"image/png")}function KF(t,e,r,n){const i=r/n,o=t*.6,s=e*.6;let a,c;i>o/s?(a=o,c=o/i):(c=s,a=s*i);const u=(t-a)/2,d=(e-c)/2;return[{x:u,y:d},{x:u+a,y:d},{x:u+a,y:d+c},{x:u,y:d+c}]}function YF(t,e,r){let n=!1;for(let i=0,o=r.length-1;i<r.length;o=i++){const s=r[i].x,a=r[i].y,c=r[o].x,u=r[o].y;a>e!=u>e&&t<(c-s)*(e-a)/(u-a)+s&&(n=!n)}return n}function XF(t,e,r){t/=255,e/=255,r/=255;const n=Math.max(t,e,r),i=Math.min(t,e,r),o=(n+i)/2;if(n===i)return{h:0,s:0,l:o};const s=n-i,a=o>.5?s/(2-n-i):s/(n+i);let c;switch(n){case t:c=((e-r)/s+(e<r?6:0))/6;break;case e:c=((r-t)/s+2)/6;break;case r:c=((t-e)/s+4)/6;break}return{h:c,s:a,l:o}}function ZF(t,e,r=2e3){if(!t||!e||e.length<3)return{avgLightness:.5,avgContrastProxy:.5};const n=Math.floor(Math.min(...e.map(y=>y.x))),i=Math.ceil(Math.max(...e.map(y=>y.x))),o=Math.floor(Math.min(...e.map(y=>y.y))),s=Math.ceil(Math.max(...e.map(y=>y.y))),a=i-n,c=s-o;if(a<=0||c<=0)return{avgLightness:.5,avgContrastProxy:.5};let u;try{u=t.getImageData(n,o,a,c)}catch(y){return console.warn("[LIGHTING] Failed to get image data:",y),{avgLightness:.5,avgContrastProxy:.5}}const d=u.data,h=[];let f=0;const p=r*5;for(;h.length<r&&f<p;){f++;const y=n+Math.random()*a,x=o+Math.random()*c;if(!YF(y,x,e))continue;const S=Math.floor(y-n),_=(Math.floor(x-o)*a+S)*4;if(_<0||_>=d.length-3)continue;const C=d[_],R=d[_+1],T=d[_+2],{l:P}=XF(C,R,T);h.push(P)}if(h.length===0)return{avgLightness:.5,avgContrastProxy:.5};const g=h.reduce((y,x)=>y+x,0)/h.length,m=h.reduce((y,x)=>y+Math.pow(x-g,2),0)/h.length,b=Math.sqrt(m),v=Math.min(1,b/.25);return{avgLightness:g,avgContrastProxy:v}}function JF(t){let e=1,r=1;const i=t.avgLightness-.5;return e+=i*.6,r+=(t.avgContrastProxy-.5)*.4,e=Math.max(.7,Math.min(1.3,e)),r=Math.max(.8,Math.min(1.25,r)),{brightness:e,contrast:r}}const QF=100;function eB({photoUrl:t,svgUrl:e,designSizeMm:r,initialQuad:n,initialShape:i,initialOpacity:o=.8,initialLighting:s,onChange:a}){const[c,u]=M.useState(null),[d,h]=M.useState(null),[f,p]=M.useState(n||null),[g,m]=M.useState(i||null),[b,v]=M.useState(Math.max(.3,Math.min(1,o))),[y,x]=M.useState(s||{enabled:!1,strength:.6,baseBrightness:1,baseContrast:1}),[S,j]=M.useState(!0),[_,C]=M.useState(null),[R,T]=M.useState(1),[P,H]=M.useState("corners"),[E,I]=M.useState(null),[w,z]=M.useState(!1),[Z,q]=M.useState(null),[V,A]=M.useState(null),K=M.useRef(null),L=M.useRef(null),B=M.useRef(null),[fe,te]=M.useState([]),ae=20;M.useEffect(()=>{ge()},[t,e]),M.useEffect(()=>{c&&d&&f&&je()},[c,d,f,g,b,y,P,E,w,V]),M.useEffect(()=>{if(!c||!f||f.length!==4)return;const F=document.createElement("canvas");F.width=c.naturalWidth,F.height=c.naturalHeight;const ee=F.getContext("2d");ee.drawImage(c,0,0);const ie=ZF(ee,f),{brightness:ue,contrast:ye}=JF(ie);x(we=>({...we,baseBrightness:ue,baseContrast:ye}))},[c,JSON.stringify(f)]),M.useEffect(()=>{const F=ee=>{if(P==="shape"&&(ee.key==="Delete"||ee.key==="Backspace")&&V!==null&&g&&g.length>3){ee.preventDefault();const ie=g.filter((ue,ye)=>ye!==V);m(ie),A(null),be(f,b,ie)}};return window.addEventListener("keydown",F),()=>window.removeEventListener("keydown",F)},[P,V,g,f,b]);const ge=async()=>{var F;console.log("[FOUR-POINT] Starting to load images - photo:",t==null?void 0:t.substring(0,50),"svg:",e==null?void 0:e.substring(0,50)),j(!0),C(null);try{console.log("[FOUR-POINT] Loading photo and rasterizing SVG...");const[ee,ie]=await Promise.all([Wp(t),R1(e,1536)]);console.log("[FOUR-POINT] Both images loaded successfully - photo:",ee.naturalWidth,"x",ee.naturalHeight,"design:",ie.naturalWidth,"x",ie.naturalHeight),u(ee),h(ie);const ue=((F=L.current)==null?void 0:F.clientWidth)||800,ye=500,we=ue/ee.naturalWidth,Ie=ye/ee.naturalHeight,ve=Math.min(1,we,Ie);if(T(ve),console.log("[FOUR-POINT] Display scale set to:",ve.toFixed(3)),n)console.log("[FOUR-POINT] Using provided initial quad");else{const Ae=KF(ee.naturalWidth,ee.naturalHeight,r.width_mm,r.length_mm);p(Ae),console.log("[FOUR-POINT] Initialized default quad")}}catch(ee){console.error("[FOUR-POINT] Failed to load images:",ee),C(ee.message)}finally{j(!1),console.log("[FOUR-POINT] Loading complete")}},je=()=>{const F=K.current;if(!F||!c||!d||!f)return;F.width=c.naturalWidth,F.height=c.naturalHeight;const ee=F.getContext("2d");N1({photoCtx:ee,photoImg:c,designImg:d,quad:f,opacity:b,shape:g,lighting:y}),me(ee)},me=F=>{if(!f)return;F.setTransform(1,0,0,1,0,0);const ee=Math.max(8,Math.min(15,c.naturalWidth/80));if(P==="corners"){F.strokeStyle="rgba(255, 255, 255, 0.8)",F.lineWidth=2,F.setLineDash([5,5]),F.beginPath(),F.moveTo(f[0].x,f[0].y),F.lineTo(f[1].x,f[1].y),F.lineTo(f[2].x,f[2].y),F.lineTo(f[3].x,f[3].y),F.closePath(),F.stroke(),F.setLineDash([]);const ie=["TL","TR","BR","BL"];f.forEach((ue,ye)=>{F.beginPath(),F.arc(ue.x,ue.y,ee,0,Math.PI*2),F.fillStyle=E===ye?"#ff6b35":"rgba(255, 107, 53, 0.9)",F.fill(),F.strokeStyle="white",F.lineWidth=2,F.stroke(),F.fillStyle="white",F.font="10px sans-serif",F.textAlign="center",F.textBaseline="middle",F.fillText(ie[ye],ue.x,ue.y)})}else{const ie=g||f;F.strokeStyle="rgba(34, 197, 94, 0.8)",F.lineWidth=2,F.setLineDash([]),F.beginPath(),F.moveTo(ie[0].x,ie[0].y);for(let ue=1;ue<ie.length;ue++)F.lineTo(ie[ue].x,ie[ue].y);F.closePath(),F.stroke(),ie.forEach((ue,ye)=>{F.beginPath(),F.arc(ue.x,ue.y,ee*.8,0,Math.PI*2),V===ye?F.fillStyle="#22c55e":E===ye?F.fillStyle="#16a34a":F.fillStyle="rgba(34, 197, 94, 0.9)",F.fill(),F.strokeStyle="white",F.lineWidth=2,F.stroke()}),F.strokeStyle="rgba(255, 107, 53, 0.3)",F.lineWidth=1,F.setLineDash([3,3]),F.beginPath(),F.moveTo(f[0].x,f[0].y),F.lineTo(f[1].x,f[1].y),F.lineTo(f[2].x,f[2].y),F.lineTo(f[3].x,f[3].y),F.closePath(),F.stroke(),F.setLineDash([])}},be=M.useCallback((F,ee,ie,ue)=>{B.current&&clearTimeout(B.current),B.current=setTimeout(()=>{a&&a({quad:F,opacity:ee,shape:ie,lighting:ue||y})},QF)},[a,y]),Ue=M.useCallback(()=>{te(F=>{const ee=[...F,{quad:[...f],shape:g?[...g]:null,opacity:b,lighting:{...y}}];return ee.length>ae?ee.slice(-ae):ee})},[f,g,b,y]),We=()=>{if(fe.length===0)return;const F=fe[fe.length-1];te(ee=>ee.slice(0,-1)),p(F.quad),m(F.shape),v(F.opacity),x(F.lighting),be(F.quad,F.opacity,F.shape,F.lighting)},bt=(F,ee)=>({x:F/R,y:ee/R}),et=(F,ee,ie)=>{if(!ie)return-1;const ue=25/R;for(let ye=0;ye<ie.length;ye++){const we=ie[ye].x-F,Ie=ie[ye].y-ee;if(Math.sqrt(we*we+Ie*Ie)<ue)return ye}return-1},k=(F,ee,ie)=>{if(!ie||ie.length<3)return!1;let ue=!1;for(let ye=0,we=ie.length-1;ye<ie.length;we=ye++){const Ie=ie[ye].x,ve=ie[ye].y,Ae=ie[we].x,ze=ie[we].y;ve>ee!=ze>ee&&F<(Ae-Ie)*(ee-ve)/(ze-ve)+Ie&&(ue=!ue)}return ue},re=F=>{if(P!=="shape"||!g||g.length<=3)return;const ee=K.current;if(!ee)return;const ie=ee.getBoundingClientRect(),ue=F.clientX-ie.left,ye=F.clientY-ie.top,{x:we,y:Ie}=bt(ue,ye),ve=et(we,Ie,g);if(ve>=0){Ue();const Ae=g.filter((Le,ct)=>ct!==ve);m(Ae),A(null);const ze=D(f,Ae);ze!==f?(p(ze),be(ze,b,Ae)):be(f,b,Ae)}},G=F=>{const ee=K.current;if(!ee)return;const ie=ee.getBoundingClientRect(),ue=F.clientX-ie.left,ye=F.clientY-ie.top,{x:we,y:Ie}=bt(ue,ye);if(P==="corners"){const ve=et(we,Ie,f);ve>=0?(Ue(),I(ve),ee.setPointerCapture(F.pointerId)):k(we,Ie,f)&&(Ue(),z(!0),q({x:we,y:Ie}),ee.setPointerCapture(F.pointerId))}else{const ve=g||f,Ae=et(we,Ie,ve);if(Ae>=0)Ue(),I(Ae),A(Ae),ee.setPointerCapture(F.pointerId);else{Ue();let ze=0,Le=1/0;for(let Fe=0;Fe<ve.length;Fe++){const ut=(Fe+1)%ve.length,Ve=ne(we,Ie,ve[Fe].x,ve[Fe].y,ve[ut].x,ve[ut].y);Ve<Le&&(Le=Ve,ze=ut)}const ct={x:we,y:Ie},tt=[...ve];tt.splice(ze,0,ct),m(tt),A(ze);const Me=D(f,tt);Me!==f?(p(Me),be(Me,b,tt)):be(f,b,tt)}}},O=F=>{if(E===null&&!w)return;const ee=K.current;if(!ee)return;const ie=ee.getBoundingClientRect(),ue=F.clientX-ie.left,ye=F.clientY-ie.top,{x:we,y:Ie}=bt(ue,ye),ve=Math.max(0,Math.min(c.naturalWidth,we)),Ae=Math.max(0,Math.min(c.naturalHeight,Ie));if(P==="corners"){if(w&&Z){const ze=ve-Z.x,Le=Ae-Z.y,ct=f.map(Me=>({x:Math.max(0,Math.min(c.naturalWidth,Me.x+ze)),y:Math.max(0,Math.min(c.naturalHeight,Me.y+Le))}));let tt=g;g&&(tt=g.map(Me=>({x:Math.max(0,Math.min(c.naturalWidth,Me.x+ze)),y:Math.max(0,Math.min(c.naturalHeight,Me.y+Le))})),m(tt)),p(ct),q({x:ve,y:Ae}),be(ct,b,tt)}else if(E!==null){const ze=[...f];ze[E]={x:ve,y:Ae},p(ze),be(ze,b,g)}}else{const Le=[...g||f];Le[E]={x:ve,y:Ae},m(Le),be(f,b,Le)}},N=F=>{if(E!==null||w){const ee=K.current;if(ee&&ee.releasePointerCapture(F.pointerId),P==="shape"&&g&&E!==null){const ie=D(f,g);ie!==f&&(p(ie),be(ie,b,g))}I(null),z(!1),q(null)}},D=(F,ee)=>{if(!ee||ee.length<3||!F)return F;const ie=F.reduce((Me,Fe)=>Me+Fe.x,0)/4,ue=F.reduce((Me,Fe)=>Me+Fe.y,0)/4,ye=ee.reduce((Me,Fe)=>Me+Fe.x,0)/ee.length,we=ee.reduce((Me,Fe)=>Me+Fe.y,0)/ee.length;let Ie=1;for(const Me of ee){const Fe=Me.x-ie,ut=Me.y-ue,Ve=Math.sqrt(Fe*Fe+ut*ut);if(Ve<1)continue;const xt=Q(ie,ue,Fe,ut,F);if(xt>0&&Ve>xt){const Qt=Ve/xt;Ie=Math.max(Ie,Qt)}}let ve=1/0;for(const Me of ee){const Fe=Me.x-ie,ut=Me.y-ue,Ve=Math.sqrt(Fe*Fe+ut*ut);if(Ve<1)continue;const xt=Q(ie,ue,Fe,ut,F);if(xt>0){const Qt=Ve/xt;ve=Math.min(ve,Qt)}}let Ae=Ie;if(Ie<=1&&ve<1/0&&(Ae=ve),Math.abs(Ae-1)<.01)return F;const ze=F.map(Me=>({x:ie+(Me.x-ie)*Ae,y:ue+(Me.y-ue)*Ae})),Le=ye-ie,ct=we-ue;return ze.map(Me=>({x:Me.x+Le,y:Me.y+ct}))},Q=(F,ee,ie,ue,ye)=>{let we=1/0;for(let Ie=0;Ie<4;Ie++){const ve=ye[Ie],Ae=ye[(Ie+1)%4],ze=Ae.x-ve.x,Le=Ae.y-ve.y,ct=ie*Le-ue*ze;if(Math.abs(ct)<1e-4)continue;const tt=((ve.x-F)*Le-(ve.y-ee)*ze)/ct,Me=((ve.x-F)*ue-(ve.y-ee)*ie)/ct;tt>0&&Me>=0&&Me<=1&&(we=Math.min(we,tt*Math.sqrt(ie*ie+ue*ue)))}return we===1/0?0:we},ne=(F,ee,ie,ue,ye,we)=>{const Ie=F-ie,ve=ee-ue,Ae=ye-ie,ze=we-ue,Le=Ie*Ae+ve*ze,ct=Ae*Ae+ze*ze;let tt=ct!==0?Le/ct:-1,Me,Fe;return tt<0?(Me=ie,Fe=ue):tt>1?(Me=ye,Fe=we):(Me=ie+tt*Ae,Fe=ue+tt*ze),Math.sqrt((F-Me)**2+(ee-Fe)**2)},U=()=>{P==="corners"?(g||m([...f]),H("shape"),A(null)):(H("corners"),A(null))},X=F=>{const ee=Math.max(.3,Math.min(1,parseFloat(F.target.value)/100));v(ee),be(f,ee,g)},oe=F=>{const ee={...y,enabled:F.target.checked};x(ee),be(f,b,g,ee)},J=F=>{const ee={...y,strength:parseFloat(F.target.value)/100};x(ee),be(f,b,g,ee)};return S?l.jsxs("div",{className:"four-point-editor loading",children:[l.jsx("div",{className:"spinner"}),l.jsx("p",{children:"Loading preview..."})]}):_?l.jsx("div",{className:"four-point-editor error",children:l.jsxs("p",{children:["Failed to load: ",_]})}):l.jsxs("div",{className:"four-point-editor",ref:L,children:[l.jsxs("div",{className:"editor-header",children:[l.jsxs("div",{className:"header-title",children:[l.jsx("h3",{children:"Position Your Design"}),l.jsx(Zf,{content:l.jsxs("div",{children:[l.jsxs("p",{children:[l.jsx("strong",{children:"Corners Mode:"})," Drag the 4 corner handles (TL, TR, BR, BL) to position your design with perspective. You can also drag inside the design to move all corners at once."]}),l.jsxs("p",{style:{marginTop:"0.5rem"},children:[l.jsx("strong",{children:"Refine Shape Mode:"})," Click anywhere to add new vertices for precise shape control. Drag existing vertices to adjust. Double-click or press Delete/Backspace on a vertex to remove it."]}),l.jsxs("p",{style:{marginTop:"0.5rem"},children:[l.jsx("strong",{children:"Overlay Opacity:"})," Adjust transparency to see how the design blends with your photo."]}),l.jsxs("p",{style:{marginTop:"0.5rem"},children:[l.jsx("strong",{children:"Match Floor Lighting:"})," Automatically adjusts design brightness to match your floor's lighting conditions."]})]}),position:"right"})]}),l.jsx("p",{className:"instructions",children:P==="corners"?"Drag the corner handles (TL, TR, BR, BL) to position the design. Drag inside to move all corners.":"Click to add vertices, drag to move them, double-click or press Delete to remove."})]}),l.jsx("div",{className:"canvas-container",children:l.jsx("canvas",{ref:K,onPointerDown:G,onPointerMove:O,onPointerUp:N,onPointerLeave:N,onDoubleClick:re,style:{width:`${((c==null?void 0:c.naturalWidth)||800)*R}px`,height:`${((c==null?void 0:c.naturalHeight)||600)*R}px`,cursor:E!==null||w?"grabbing":P==="shape"?"crosshair":"move",touchAction:"none"}})}),l.jsxs("div",{className:"controls",children:[l.jsxs("div",{className:"mode-toggle",children:[l.jsx("button",{className:`toggle-btn ${P==="corners"?"active":""}`,onClick:()=>H("corners"),children:"Corners"}),l.jsx("button",{className:`toggle-btn ${P==="shape"?"active":""}`,onClick:U,children:"Refine Shape"}),l.jsx("button",{className:"toggle-btn undo-btn",onClick:We,disabled:fe.length===0,title:"Undo last change",children:"Undo"})]}),l.jsxs("div",{className:"opacity-control",children:[l.jsxs("label",{children:["Overlay Opacity",l.jsxs("span",{className:"value",children:[Math.round(b*100),"%"]})]}),l.jsx("input",{type:"range",min:"30",max:"100",value:Math.round(b*100),onChange:X})]}),l.jsxs("div",{className:"lighting-control",children:[l.jsxs("label",{className:"checkbox-label",children:[l.jsx("input",{type:"checkbox",checked:y.enabled,onChange:oe}),"Match floor lighting"]}),y.enabled&&l.jsxs("div",{className:"lighting-slider",children:[l.jsxs("label",{children:["Strength",l.jsxs("span",{className:"value",children:[Math.round(y.strength*100),"%"]})]}),l.jsx("input",{type:"range",min:"0",max:"100",value:Math.round(y.strength*100),onChange:J})]})]})]}),l.jsx("style",{children:`
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
      `})]})}const Kr={UPLOAD:"upload",POSITION:"position"};function tB({designUrl:t,designDimensions:e,onClose:r,onSaved:n}){const[i,o]=M.useState(Kr.UPLOAD),[s,a]=M.useState(null),[c,u]=M.useState(null),[d,h]=M.useState(null),[f,p]=M.useState(.8),[g,m]=M.useState({enabled:!1,strength:.6,baseBrightness:1,baseContrast:1}),[b,v]=M.useState(!1),y=M.useRef(null);M.useEffect(()=>{if(t){console.log("[IN-SITU-MODAL] Design URL received:",t==null?void 0:t.substring(0,50));const T=new Image;!t.startsWith("blob:")&&!t.startsWith("data:")&&(T.crossOrigin="anonymous"),T.src=t}else console.warn("[IN-SITU-MODAL] No design URL provided")},[t]);const x=T=>{console.log("[IN-SITU-MODAL] Photo uploaded:",T),a(T),console.log("[IN-SITU-MODAL] Advancing to POSITION step, designUrl:",t==null?void 0:t.substring(0,50)),o(Kr.POSITION)},S=({quad:T,opacity:P,shape:H,lighting:E})=>{u(T),p(P),h(H),E&&m(E)},j=async()=>{if(!s||!c)return null;try{console.log("[InSitu] Loading design from URL:",t);const[T,P]=await Promise.all([Wp(s.url),R1(t,1536)]);console.log("[InSitu] Successfully loaded design image");const H=document.createElement("canvas");H.width=T.naturalWidth,H.height=T.naturalHeight;const E=H.getContext("2d");return N1({photoCtx:E,photoImg:T,designImg:P,quad:c,opacity:f,shape:d,lighting:g}),H}catch(T){return console.error("[InSitu] Failed to generate canvas:",T),alert(`Failed to load design: ${T.message}`),null}},_=async()=>{const T=await j();T&&qF(T,"tpv-in-situ-preview.png")},C=async()=>{if(!(!c||!s)){v(!0);try{const T=await j();if(!T)throw new Error("Failed to generate preview");const P=await new Promise(z=>T.toBlob(z,"image/png")),E=`in-situ-previews/${`${Date.now()}-${Math.random().toString(36).substr(2,9)}.png`}`,{error:I}=await Mt.storage.from("tpv-studio-uploads").upload(E,P,{contentType:"image/png",cacheControl:"3600"});if(I)throw I;const{data:{publicUrl:w}}=Mt.storage.from("tpv-studio-uploads").getPublicUrl(E);n&&n({photo_url:s.supabaseUrl||s.url,quad:c,shape:d,opacity:f,lighting:g,preview_url:w}),r()}catch(T){console.error("[IN-SITU] Save failed:",T),alert("Failed to save preview: "+T.message)}finally{v(!1)}}},R=()=>{switch(i){case Kr.UPLOAD:return"Upload Site Photo";case Kr.POSITION:return"Position Your Design";default:return"In-Situ Preview"}};return l.jsxs("div",{className:"modal-overlay in-situ-modal-overlay",onClick:r,children:[l.jsxs("div",{className:"modal-content in-situ-modal",onClick:T=>T.stopPropagation(),children:[l.jsxs("div",{className:"modal-header",children:[l.jsxs("div",{className:"header-left",children:[l.jsx("h2",{children:R()}),l.jsxs("div",{className:"step-indicator",children:[l.jsx("span",{className:i===Kr.UPLOAD?"active":"completed",children:"1. Upload"}),l.jsx("span",{className:i===Kr.POSITION?"active":"",children:"2. Position"})]})]}),l.jsx("button",{onClick:r,className:"close-button",children:"×"})]}),l.jsxs("div",{className:"modal-body",children:[i===Kr.UPLOAD&&l.jsxs("div",{className:"upload-step",children:[l.jsx("p",{className:"step-description",children:"Upload a photo of your site to see how your TPV design will look when installed. For best results, use a photo taken from above or at a slight angle showing the floor area clearly."}),l.jsx(WF,{onPhotoUploaded:x})]}),i===Kr.POSITION&&s&&l.jsx(eB,{ref:y,photoUrl:s.url,svgUrl:t,designSizeMm:{width_mm:e.width,length_mm:e.length},initialOpacity:.8,onChange:S})]}),i===Kr.POSITION&&l.jsxs("div",{className:"modal-footer",children:[l.jsx("button",{onClick:()=>o(Kr.UPLOAD),className:"btn-secondary",children:"Back"}),l.jsxs("div",{className:"footer-actions",children:[l.jsx("button",{onClick:_,disabled:!c,className:"btn-secondary",children:"Download PNG"}),l.jsx("button",{onClick:C,disabled:!c||b,className:"btn-primary",children:b?"Saving...":"Save to Project"})]})]})]}),l.jsx("style",{children:`
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
      `})]})}function rB({isOpen:t,onClose:e,onConfirm:r,aspectRatio:n,defaultLongestSide:i=5e3}){const[o,s]=M.useState(i),[a,c]=M.useState(i/1e3),d=(m=>{if(!n||n<=0)return{width:m,length:m};if(n>=1){const b=m,v=Math.round(m/n);return{width:b,length:v}}else{const b=m;return{width:Math.round(m*n),length:b}}})(o),h=n>=1?"landscape":"portrait",f=n>=1?`${n.toFixed(1)}:1`:`1:${(1/n).toFixed(1)}`,p=m=>{const b=parseFloat(m.target.value)||0;c(b),s(Math.round(b*1e3))},g=()=>{r(d.width,d.length),e()};return t?l.jsxs(l.Fragment,{children:[l.jsx("div",{className:"dimension-modal-overlay",onClick:e,children:l.jsxs("div",{className:"dimension-modal",onClick:m=>m.stopPropagation(),children:[l.jsxs("div",{className:"dimension-modal-header",children:[l.jsxs("div",{className:"dimension-modal-title",children:[l.jsx("h2",{children:"Set Installation Size"}),l.jsx(Zf,{content:l.jsxs("div",{children:[l.jsx("p",{children:l.jsx("strong",{children:"Why specify dimensions?"})}),l.jsx("p",{style:{marginTop:"0.5rem"},children:"Accurate dimensions are essential for:"}),l.jsxs("ul",{style:{marginTop:"0.5rem",marginBottom:0,paddingLeft:"1.25rem"},children:[l.jsx("li",{children:"Calculating exact material quantities"}),l.jsx("li",{children:"Generating PDF specifications for manufacturers"}),l.jsx("li",{children:"Slicing designs into 1m×1m installation tiles"})]}),l.jsxs("p",{style:{marginTop:"0.5rem"},children:[l.jsx("strong",{children:"Tip:"})," Typical playground installations range from 3m to 20m on the longest side."]})]}),position:"bottom"})]}),l.jsx("button",{className:"dimension-modal-close",onClick:e,"aria-label":"Close",children:"×"})]}),l.jsxs("div",{className:"dimension-modal-body",children:[l.jsx("div",{className:"dimension-info",children:l.jsxs("p",{className:"dimension-aspect",children:["Your design has a ",l.jsxs("strong",{children:[f," ",h]})," aspect ratio"]})}),l.jsxs("div",{className:"dimension-input-group",children:[l.jsx("label",{htmlFor:"longest-dimension",children:"Installation Size (Longest Side)"}),l.jsxs("div",{className:"dimension-input-wrapper",children:[l.jsx("input",{id:"longest-dimension",type:"number",min:"0.1",max:"50",step:"0.1",value:a,onChange:p,className:"dimension-input"}),l.jsx("span",{className:"dimension-unit",children:"meters"})]}),l.jsx("p",{className:"dimension-help",children:"Enter the measurement of the longest side of your installation area. The other dimension will be calculated automatically based on your design's aspect ratio."})]}),l.jsxs("div",{className:"dimension-preview",children:[l.jsx("div",{className:"dimension-preview-title",children:"Calculated Dimensions:"}),l.jsxs("div",{className:"dimension-preview-values",children:[l.jsxs("div",{className:"dimension-preview-item",children:[l.jsx("span",{className:"dimension-preview-label",children:"Width:"}),l.jsxs("span",{className:"dimension-preview-value",children:[(d.width/1e3).toFixed(2),"m"]})]}),l.jsxs("div",{className:"dimension-preview-item",children:[l.jsx("span",{className:"dimension-preview-label",children:"Length:"}),l.jsxs("span",{className:"dimension-preview-value",children:[(d.length/1e3).toFixed(2),"m"]})]}),l.jsxs("div",{className:"dimension-preview-item",children:[l.jsx("span",{className:"dimension-preview-label",children:"Total Area:"}),l.jsxs("span",{className:"dimension-preview-value",children:[(d.width*d.length/1e6).toFixed(2),"m²"]})]})]})]}),l.jsxs("div",{className:"dimension-note",children:[l.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[l.jsx("circle",{cx:"8",cy:"8",r:"7"}),l.jsx("line",{x1:"8",y1:"11",x2:"8",y2:"8"}),l.jsx("circle",{cx:"8",cy:"5",r:"0.5",fill:"currentColor"})]}),l.jsx("p",{children:"These dimensions will be used to calculate material quantities for your PDF specification and to slice your design into 1m×1m installation tiles."})]})]}),l.jsxs("div",{className:"dimension-modal-footer",children:[l.jsx("button",{className:"dimension-btn dimension-btn-secondary",onClick:e,children:"Cancel"}),l.jsx("button",{className:"dimension-btn dimension-btn-primary",onClick:g,disabled:a<=0,children:"Confirm Size"})]})]})}),l.jsx("style",{children:`
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
      `})]}):null}function nB(t){const e=new Map;for(const r of t){const n=r.originalColor.hex.toLowerCase(),i=r.targetColor.hex.toLowerCase(),o=r.chosenRecipe.id,s=r.chosenRecipe.deltaE,a=r.targetColor.areaPct;e.set(n,{blendHex:i,recipeId:o,deltaE:s,coverage:a,quality:r.chosenRecipe.quality,components:r.chosenRecipe.components})}return e}function iB(t){return t.replace("#","").toLowerCase()}async function ho(t,e,r=null){try{let n;if(r)n=r,console.log(`[SVG-RECOLOR] Using provided SVG text (${n.length} chars)`);else{console.log("[SVG-RECOLOR] Fetching SVG from:",t);const g=await fetch(t);if(!g.ok)throw new Error(`Failed to fetch SVG: ${g.status} ${g.statusText}`);n=await g.text(),console.log(`[SVG-RECOLOR] Fetched SVG (${n.length} chars)`)}console.log("[SVG-RECOLOR] Sanitizing SVG...");const i=lw(n);if(!i)throw new Error("SVG sanitization failed - content rejected");const s=new DOMParser().parseFromString(i,"image/svg+xml"),a=s.querySelector("parsererror");if(a)throw new Error(`SVG parse error: ${a.textContent}`);const c=s.documentElement;if(c.tagName!=="svg")throw new Error("Invalid SVG: root element is not <svg>");const u=oB(c,e);console.log("[SVG-RECOLOR] Recoloring complete:",u);const h=new XMLSerializer().serializeToString(s),f=new Blob([h],{type:"image/svg+xml"});return{dataUrl:URL.createObjectURL(f),svgText:h,stats:u}}catch(n){throw console.error("[SVG-RECOLOR] Error:",n),n}}function oB(t,e){const r={totalElements:0,fillsReplaced:0,strokesReplaced:0,stopColorsReplaced:0,stylesProcessed:0,colorsNotMapped:new Set},n=t.querySelectorAll("*");r.totalElements=n.length;for(const s of n){const a=s.getAttribute("fill");if(a&&a!=="none"){const h=Zr(a,e,r.colorsNotMapped);h!==a&&(s.setAttribute("fill",h),r.fillsReplaced++)}const c=s.getAttribute("stroke");if(c&&c!=="none"){const h=Zr(c,e,r.colorsNotMapped);h!==c&&(s.setAttribute("stroke",h),r.strokesReplaced++)}const u=s.getAttribute("stop-color");if(u&&u!=="none"){const h=Zr(u,e,r.colorsNotMapped);h!==u&&(s.setAttribute("stop-color",h),r.stopColorsReplaced++)}const d=s.getAttribute("style");if(d){const h=Nv(d,e,r);h!==d&&(s.setAttribute("style",h),r.stylesProcessed++)}}const i=t.querySelectorAll("style");for(const s of i){const a=s.textContent,c=aB(a,e,r);c!==a&&(s.textContent=c,r.stylesProcessed++)}const o=t.querySelectorAll("stop");for(const s of o){const a=s.getAttribute("stop-color");if(a&&a!=="none"){const u=Zr(a,e,r.colorsNotMapped);u!==a&&(s.setAttribute("stop-color",u),r.stopColorsReplaced++)}const c=s.getAttribute("style");if(c&&c.includes("stop-color")){const u=Nv(c,e,r);u!==c&&(s.setAttribute("style",u),r.stylesProcessed++)}}return r}function Zr(t,e,r){const n=lB(t);if(!n)return t;const i=`#${n}`,o=e.get(i);if(o)return o.blendHex;const s=Tv(n);if(!s)return t;const a=Rv(s);let c=null,u=1/0;for(const[d,h]of e.entries()){const f=Tv(d.replace("#",""));if(!f)continue;const p=Rv(f),g=sB(a,p);if(g<u&&(u=g,c=h),g<=9)return console.log(`[SVG-RECOLOR] Tolerance match: ${i} → ${d} (ΔE=${g.toFixed(2)})`),h.blendHex}return c?(console.log(`[SVG-RECOLOR] Fallback to nearest: ${i} → ${c.blendHex} (ΔE=${u.toFixed(2)})`),r&&r.add(t),c.blendHex):(console.warn(`[SVG-RECOLOR] No mapping found: ${i}`),t)}function Tv(t){if(t.length!==6)return null;const e=parseInt(t.substring(0,2),16),r=parseInt(t.substring(2,4),16),n=parseInt(t.substring(4,6),16);return isNaN(e)||isNaN(r)||isNaN(n)?null:{r:e,g:r,b:n}}function Rv(t){let e=t.r/255,r=t.g/255,n=t.b/255;e=e>.04045?Math.pow((e+.055)/1.055,2.4):e/12.92,r=r>.04045?Math.pow((r+.055)/1.055,2.4):r/12.92,n=n>.04045?Math.pow((n+.055)/1.055,2.4):n/12.92;const i=(e*.4124+r*.3576+n*.1805)*100,o=(e*.2126+r*.7152+n*.0722)*100,s=(e*.0193+r*.1192+n*.9505)*100,a=95.047,c=100,u=108.883;let d=i/a,h=o/c,f=s/u;return d=d>.008856?Math.pow(d,1/3):7.787*d+16/116,h=h>.008856?Math.pow(h,1/3):7.787*h+16/116,f=f>.008856?Math.pow(f,1/3):7.787*f+16/116,{L:116*h-16,a:500*(d-h),b:200*(h-f)}}function sB(t,e){const o=Math.PI*2,s=Math.PI,a=(t.L+e.L)/2,c=Math.sqrt(t.a*t.a+t.b*t.b),u=Math.sqrt(e.a*e.a+e.b*e.b),d=(c+u)/2,h=.5*(1-Math.sqrt(Math.pow(d,7)/(Math.pow(d,7)+Math.pow(25,7)))),f=t.a*(1+h),p=e.a*(1+h),g=Math.sqrt(f*f+t.b*t.b),m=Math.sqrt(p*p+e.b*e.b),b=(g+m)/2;let v=Math.atan2(t.b,f);v<0&&(v+=o);let y=Math.atan2(e.b,p);y<0&&(y+=o);const x=Math.abs(v-y)>s?(v+y+o)/2:(v+y)/2,S=1-.17*Math.cos(x-Math.PI/6)+.24*Math.cos(2*x)+.32*Math.cos(3*x+Math.PI/30)-.2*Math.cos(4*x-63*Math.PI/180);let j=y-v;Math.abs(j)>s&&(j=j>0?j-o:j+o);const _=e.L-t.L,C=m-g,R=2*Math.sqrt(g*m)*Math.sin(j/2),T=1+.015*Math.pow(a-50,2)/Math.sqrt(20+Math.pow(a-50,2)),P=1+.045*b,H=1+.015*b*S,E=30*Math.PI/180*Math.exp(-Math.pow((x-275*Math.PI/180)/(25*Math.PI/180),2)),w=-(2*Math.sqrt(Math.pow(b,7)/(Math.pow(b,7)+Math.pow(25,7))))*Math.sin(2*E);return Math.sqrt(Math.pow(_/(1*T),2)+Math.pow(C/(1*P),2)+Math.pow(R/(1*H),2)+w*(C/(1*P))*(R/(1*H)))}function Nv(t,e,r){let n=t;return n=n.replace(/fill:\s*([^;]+)/gi,(i,o)=>`fill: ${Zr(o.trim(),e,r.colorsNotMapped)}`),n=n.replace(/stroke:\s*([^;]+)/gi,(i,o)=>`stroke: ${Zr(o.trim(),e,r.colorsNotMapped)}`),n=n.replace(/stop-color:\s*([^;]+)/gi,(i,o)=>`stop-color: ${Zr(o.trim(),e,r.colorsNotMapped)}`),n}function aB(t,e,r){let n=t,i=0;return n=n.replace(/fill:\s*([^;}\s]+)/gi,(o,s)=>{const a=s.trim(),c=Zr(a,e,r.colorsNotMapped);return c!==a&&(i++,console.log(`[SVG-RECOLOR-CSS] Replaced fill: ${a} → ${c}`)),`fill: ${c}`}),n=n.replace(/stroke:\s*([^;}\s]+)/gi,(o,s)=>{const a=s.trim(),c=Zr(a,e,r.colorsNotMapped);return c!==a&&(i++,console.log(`[SVG-RECOLOR-CSS] Replaced stroke: ${a} → ${c}`)),`stroke: ${c}`}),n=n.replace(/stop-color:\s*([^;}\s]+)/gi,(o,s)=>{const a=s.trim(),c=Zr(a,e,r.colorsNotMapped);return c!==a&&(i++,console.log(`[SVG-RECOLOR-CSS] Replaced stop-color: ${a} → ${c}`)),`stop-color: ${c}`}),i>0&&console.log(`[SVG-RECOLOR-CSS] Total CSS color replacements: ${i}`),n}function lB(t){const e=t.trim().toLowerCase();if(e.match(/^#?[0-9a-f]{6}$/))return iB(e);const r=e.match(/^#?([0-9a-f]{3})$/);if(r)return r[1].split("").map(s=>s+s).join("");const n=e.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);if(n){const o=parseInt(n[1],10),s=parseInt(n[2],10),a=parseInt(n[3],10);return cB(o,s,a)}const i={white:"ffffff",black:"000000",red:"ff0000",green:"008000",blue:"0000ff",yellow:"ffff00",cyan:"00ffff",magenta:"ff00ff",gray:"808080",grey:"808080",orange:"ffa500",purple:"800080"};return i[e]?i[e]:null}function cB(t,e,r){const n=i=>Math.max(0,Math.min(255,i)).toString(16).padStart(2,"0");return`${n(t)}${n(e)}${n(r)}`}function Pv(t){const r=new DOMParser().parseFromString(t,"image/svg+xml"),n=r.querySelector("parsererror");if(n)return console.error("[SVG-REGION-TAGGER] Parse error:",n.textContent),t;const i=r.documentElement;if(!i.hasAttribute("viewBox")){const a=i.getAttribute("width"),c=i.getAttribute("height");if(a&&c){const u=parseFloat(a),d=parseFloat(c);!isNaN(u)&&!isNaN(d)&&(i.setAttribute("viewBox",`0 0 ${u} ${d}`),console.log(`[SVG-REGION-TAGGER] Added viewBox from dimensions: 0 0 ${u} ${d}`))}else{const u=uB(r);u&&(i.setAttribute("viewBox",`${u.x} ${u.y} ${u.width} ${u.height}`),console.log(`[SVG-REGION-TAGGER] Added viewBox from content bounds: ${u.x} ${u.y} ${u.width} ${u.height}`))}}let o=0;return r.querySelectorAll("path, rect, circle, ellipse, polygon, polyline, line").forEach(a=>{a.hasAttribute("data-region-id")||a.setAttribute("data-region-id",`region-${o++}`)}),console.log(`[SVG-REGION-TAGGER] Tagged ${o} regions`),new XMLSerializer().serializeToString(r)}function uB(t){try{const e=t.documentElement.cloneNode(!0),r=document.createElement("div");r.style.position="absolute",r.style.visibility="hidden",document.body.appendChild(r),r.appendChild(e);const n=e.getBBox();if(document.body.removeChild(r),n.width>0&&n.height>0)return{x:Math.floor(n.x),y:Math.floor(n.y),width:Math.ceil(n.width),height:Math.ceil(n.height)}}catch(e){console.warn("[SVG-REGION-TAGGER] Could not calculate content bounds:",e)}return null}function Ov(t,e){if(!e||e.size===0)return t;const n=new DOMParser().parseFromString(t,"image/svg+xml"),i=n.querySelector("parsererror");if(i)return console.error("[SVG-REGION-OVERRIDES] Parse error:",i.textContent),t;let o=0;return e.forEach((s,a)=>{const c=n.querySelector(`[data-region-id="${a}"]`);if(c){if(c.hasAttribute("fill")&&(c.setAttribute("fill",s),o++),c.hasAttribute("stroke")&&c.getAttribute("stroke")!=="none"){const d=c.getAttribute("stroke");d&&d!=="#000"&&d!=="#000000"&&d!=="#fff"&&d!=="#ffffff"&&c.setAttribute("stroke",s)}const u=c.getAttribute("style");if(u&&u.includes("fill:")){const d=u.replace(/fill:\s*[^;]+/,`fill: ${s}`);c.setAttribute("style",d)}}else console.warn(`[SVG-REGION-OVERRIDES] Region not found: ${a}`)}),console.log(`[SVG-REGION-OVERRIDES] Applied ${o} region overrides`),new XMLSerializer().serializeToString(n)}const Av={landscape:[{name:"1:1",ratio:1,width:1024,height:1024},{name:"4:3",ratio:4/3,width:1024,height:768},{name:"3:2",ratio:3/2,width:1024,height:683},{name:"16:9",ratio:16/9,width:1024,height:576},{name:"2:1",ratio:2,width:1024,height:512},{name:"3:1",ratio:3,width:1024,height:341}],portrait:[{name:"1:1",ratio:1,width:1024,height:1024},{name:"3:4",ratio:3/4,width:768,height:1024},{name:"2:3",ratio:2/3,width:683,height:1024},{name:"9:16",ratio:9/16,width:576,height:1024},{name:"1:2",ratio:1/2,width:512,height:1024},{name:"1:3",ratio:1/3,width:341,height:1024}]},qs={safeDifference:.3,tilingThreshold:3.5,framingThreshold:2.5};function dB(t,e){return t/e}function hB(t){return t>=.95&&t<=1.05?"square":t>1?"landscape":"portrait"}function fB(t,e){const r=e==="portrait"?Av.portrait:Av.landscape;let n=r[0],i=Math.abs(t-n.ratio);for(const o of r){const s=Math.abs(t-o.ratio);s<i&&(i=s,n=o)}return{...n,difference:i}}function pB(t,e,r){return t>=qs.tilingThreshold||t<=1/qs.tilingThreshold?{mode:"tiling",reason:"Extreme aspect ratio - design will repeat along length",warning:!0}:r>=qs.safeDifference||t>=qs.framingThreshold||t<=1/qs.framingThreshold?{mode:"framing",reason:"Design panel centered with base color surround",warning:!1}:{mode:"full",reason:"Design fills entire surface",warning:!1}}function mB(t,e){const r=dB(t,e),n=hB(r),i=fB(r,n),o=pB(r,i.ratio,i.difference);return{user:{widthMM:t,heightMM:e,aspectRatio:r,orientation:n,formatted:`${(t/1e3).toFixed(1)}m × ${(e/1e3).toFixed(1)}m`},canonical:{name:i.name,ratio:i.ratio,width:i.width,height:i.height,difference:i.difference},layout:o,recraft:{width:i.width,height:i.height,metadata:{targetWidthMM:t,targetHeightMM:e,layoutMode:o.mode}}}}function gB(t){const{user:e,canonical:r,layout:n}=t;let i=`Generating ${r.name} design panel`;return n.mode==="full"?i+=` (fills ${e.formatted} surface)`:n.mode==="framing"?i+=` (centered in ${e.formatted} surface with base color surround)`:n.mode==="tiling"&&(i+=` (will repeat along ${e.formatted} surface)`),i}function vB(t){return t.layout.warning||t.layout.mode!=="full"}async function $v(t,e="tpv-studio-uploads"){try{const r=Date.now(),n=Math.random().toString(36).substring(7),i=t.name.split(".").pop(),s=`uploads/${`${r}-${n}.${i}`}`;console.log("[Upload] Uploading file:",t.name,"→",s);const{data:a,error:c}=await Mt.storage.from(e).upload(s,t,{cacheControl:"3600",upsert:!1});if(c)return console.error("[Upload] Error:",c),{success:!1,error:c.message||"Failed to upload file"};const{data:{publicUrl:u}}=Mt.storage.from(e).getPublicUrl(s);return console.log("[Upload] Success:",u),{success:!0,url:u,path:s}}catch(r){return console.error("[Upload] Unexpected error:",r),{success:!1,error:r.message||"Unexpected error during upload"}}}function Iv(t,e={}){const{maxSizeMB:r=10,allowedTypes:n=["image/png","image/jpeg","image/svg+xml"]}=e;if(!t)return{valid:!1,error:"No file selected"};if(!n.includes(t.type))return{valid:!1,error:`Invalid file type. Allowed: ${n.map(s=>s.split("/")[1].toUpperCase()).join(", ")}`};const i=r*1024*1024;return t.size>i?{valid:!1,error:`File too large. Maximum size: ${r}MB`}:{valid:!0}}function Dl(t){throw new Error('Could not dynamically require "'+t+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var P1={exports:{}};/*!

JSZip v3.10.1 - A JavaScript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/main/LICENSE.markdown.

JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/main/LICENSE
*/(function(t,e){(function(r){t.exports=r()})(function(){return function r(n,i,o){function s(u,d){if(!i[u]){if(!n[u]){var h=typeof Dl=="function"&&Dl;if(!d&&h)return h(u,!0);if(a)return a(u,!0);var f=new Error("Cannot find module '"+u+"'");throw f.code="MODULE_NOT_FOUND",f}var p=i[u]={exports:{}};n[u][0].call(p.exports,function(g){var m=n[u][1][g];return s(m||g)},p,p.exports,r,n,i,o)}return i[u].exports}for(var a=typeof Dl=="function"&&Dl,c=0;c<o.length;c++)s(o[c]);return s}({1:[function(r,n,i){var o=r("./utils"),s=r("./support"),a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";i.encode=function(c){for(var u,d,h,f,p,g,m,b=[],v=0,y=c.length,x=y,S=o.getTypeOf(c)!=="string";v<c.length;)x=y-v,h=S?(u=c[v++],d=v<y?c[v++]:0,v<y?c[v++]:0):(u=c.charCodeAt(v++),d=v<y?c.charCodeAt(v++):0,v<y?c.charCodeAt(v++):0),f=u>>2,p=(3&u)<<4|d>>4,g=1<x?(15&d)<<2|h>>6:64,m=2<x?63&h:64,b.push(a.charAt(f)+a.charAt(p)+a.charAt(g)+a.charAt(m));return b.join("")},i.decode=function(c){var u,d,h,f,p,g,m=0,b=0,v="data:";if(c.substr(0,v.length)===v)throw new Error("Invalid base64 input, it looks like a data url.");var y,x=3*(c=c.replace(/[^A-Za-z0-9+/=]/g,"")).length/4;if(c.charAt(c.length-1)===a.charAt(64)&&x--,c.charAt(c.length-2)===a.charAt(64)&&x--,x%1!=0)throw new Error("Invalid base64 input, bad content length.");for(y=s.uint8array?new Uint8Array(0|x):new Array(0|x);m<c.length;)u=a.indexOf(c.charAt(m++))<<2|(f=a.indexOf(c.charAt(m++)))>>4,d=(15&f)<<4|(p=a.indexOf(c.charAt(m++)))>>2,h=(3&p)<<6|(g=a.indexOf(c.charAt(m++))),y[b++]=u,p!==64&&(y[b++]=d),g!==64&&(y[b++]=h);return y}},{"./support":30,"./utils":32}],2:[function(r,n,i){var o=r("./external"),s=r("./stream/DataWorker"),a=r("./stream/Crc32Probe"),c=r("./stream/DataLengthProbe");function u(d,h,f,p,g){this.compressedSize=d,this.uncompressedSize=h,this.crc32=f,this.compression=p,this.compressedContent=g}u.prototype={getContentWorker:function(){var d=new s(o.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new c("data_length")),h=this;return d.on("end",function(){if(this.streamInfo.data_length!==h.uncompressedSize)throw new Error("Bug : uncompressed data size mismatch")}),d},getCompressedWorker:function(){return new s(o.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize",this.compressedSize).withStreamInfo("uncompressedSize",this.uncompressedSize).withStreamInfo("crc32",this.crc32).withStreamInfo("compression",this.compression)}},u.createWorkerFrom=function(d,h,f){return d.pipe(new a).pipe(new c("uncompressedSize")).pipe(h.compressWorker(f)).pipe(new c("compressedSize")).withStreamInfo("compression",h)},n.exports=u},{"./external":6,"./stream/Crc32Probe":25,"./stream/DataLengthProbe":26,"./stream/DataWorker":27}],3:[function(r,n,i){var o=r("./stream/GenericWorker");i.STORE={magic:"\0\0",compressWorker:function(){return new o("STORE compression")},uncompressWorker:function(){return new o("STORE decompression")}},i.DEFLATE=r("./flate")},{"./flate":7,"./stream/GenericWorker":28}],4:[function(r,n,i){var o=r("./utils"),s=function(){for(var a,c=[],u=0;u<256;u++){a=u;for(var d=0;d<8;d++)a=1&a?3988292384^a>>>1:a>>>1;c[u]=a}return c}();n.exports=function(a,c){return a!==void 0&&a.length?o.getTypeOf(a)!=="string"?function(u,d,h,f){var p=s,g=f+h;u^=-1;for(var m=f;m<g;m++)u=u>>>8^p[255&(u^d[m])];return-1^u}(0|c,a,a.length,0):function(u,d,h,f){var p=s,g=f+h;u^=-1;for(var m=f;m<g;m++)u=u>>>8^p[255&(u^d.charCodeAt(m))];return-1^u}(0|c,a,a.length,0):0}},{"./utils":32}],5:[function(r,n,i){i.base64=!1,i.binary=!1,i.dir=!1,i.createFolders=!0,i.date=null,i.compression=null,i.compressionOptions=null,i.comment=null,i.unixPermissions=null,i.dosPermissions=null},{}],6:[function(r,n,i){var o=null;o=typeof Promise<"u"?Promise:r("lie"),n.exports={Promise:o}},{lie:37}],7:[function(r,n,i){var o=typeof Uint8Array<"u"&&typeof Uint16Array<"u"&&typeof Uint32Array<"u",s=r("pako"),a=r("./utils"),c=r("./stream/GenericWorker"),u=o?"uint8array":"array";function d(h,f){c.call(this,"FlateWorker/"+h),this._pako=null,this._pakoAction=h,this._pakoOptions=f,this.meta={}}i.magic="\b\0",a.inherits(d,c),d.prototype.processChunk=function(h){this.meta=h.meta,this._pako===null&&this._createPako(),this._pako.push(a.transformTo(u,h.data),!1)},d.prototype.flush=function(){c.prototype.flush.call(this),this._pako===null&&this._createPako(),this._pako.push([],!0)},d.prototype.cleanUp=function(){c.prototype.cleanUp.call(this),this._pako=null},d.prototype._createPako=function(){this._pako=new s[this._pakoAction]({raw:!0,level:this._pakoOptions.level||-1});var h=this;this._pako.onData=function(f){h.push({data:f,meta:h.meta})}},i.compressWorker=function(h){return new d("Deflate",h)},i.uncompressWorker=function(){return new d("Inflate",{})}},{"./stream/GenericWorker":28,"./utils":32,pako:38}],8:[function(r,n,i){function o(p,g){var m,b="";for(m=0;m<g;m++)b+=String.fromCharCode(255&p),p>>>=8;return b}function s(p,g,m,b,v,y){var x,S,j=p.file,_=p.compression,C=y!==u.utf8encode,R=a.transformTo("string",y(j.name)),T=a.transformTo("string",u.utf8encode(j.name)),P=j.comment,H=a.transformTo("string",y(P)),E=a.transformTo("string",u.utf8encode(P)),I=T.length!==j.name.length,w=E.length!==P.length,z="",Z="",q="",V=j.dir,A=j.date,K={crc32:0,compressedSize:0,uncompressedSize:0};g&&!m||(K.crc32=p.crc32,K.compressedSize=p.compressedSize,K.uncompressedSize=p.uncompressedSize);var L=0;g&&(L|=8),C||!I&&!w||(L|=2048);var B=0,fe=0;V&&(B|=16),v==="UNIX"?(fe=798,B|=function(ae,ge){var je=ae;return ae||(je=ge?16893:33204),(65535&je)<<16}(j.unixPermissions,V)):(fe=20,B|=function(ae){return 63&(ae||0)}(j.dosPermissions)),x=A.getUTCHours(),x<<=6,x|=A.getUTCMinutes(),x<<=5,x|=A.getUTCSeconds()/2,S=A.getUTCFullYear()-1980,S<<=4,S|=A.getUTCMonth()+1,S<<=5,S|=A.getUTCDate(),I&&(Z=o(1,1)+o(d(R),4)+T,z+="up"+o(Z.length,2)+Z),w&&(q=o(1,1)+o(d(H),4)+E,z+="uc"+o(q.length,2)+q);var te="";return te+=`
\0`,te+=o(L,2),te+=_.magic,te+=o(x,2),te+=o(S,2),te+=o(K.crc32,4),te+=o(K.compressedSize,4),te+=o(K.uncompressedSize,4),te+=o(R.length,2),te+=o(z.length,2),{fileRecord:h.LOCAL_FILE_HEADER+te+R+z,dirRecord:h.CENTRAL_FILE_HEADER+o(fe,2)+te+o(H.length,2)+"\0\0\0\0"+o(B,4)+o(b,4)+R+z+H}}var a=r("../utils"),c=r("../stream/GenericWorker"),u=r("../utf8"),d=r("../crc32"),h=r("../signature");function f(p,g,m,b){c.call(this,"ZipFileWorker"),this.bytesWritten=0,this.zipComment=g,this.zipPlatform=m,this.encodeFileName=b,this.streamFiles=p,this.accumulate=!1,this.contentBuffer=[],this.dirRecords=[],this.currentSourceOffset=0,this.entriesCount=0,this.currentFile=null,this._sources=[]}a.inherits(f,c),f.prototype.push=function(p){var g=p.meta.percent||0,m=this.entriesCount,b=this._sources.length;this.accumulate?this.contentBuffer.push(p):(this.bytesWritten+=p.data.length,c.prototype.push.call(this,{data:p.data,meta:{currentFile:this.currentFile,percent:m?(g+100*(m-b-1))/m:100}}))},f.prototype.openedSource=function(p){this.currentSourceOffset=this.bytesWritten,this.currentFile=p.file.name;var g=this.streamFiles&&!p.file.dir;if(g){var m=s(p,g,!1,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);this.push({data:m.fileRecord,meta:{percent:0}})}else this.accumulate=!0},f.prototype.closedSource=function(p){this.accumulate=!1;var g=this.streamFiles&&!p.file.dir,m=s(p,g,!0,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);if(this.dirRecords.push(m.dirRecord),g)this.push({data:function(b){return h.DATA_DESCRIPTOR+o(b.crc32,4)+o(b.compressedSize,4)+o(b.uncompressedSize,4)}(p),meta:{percent:100}});else for(this.push({data:m.fileRecord,meta:{percent:0}});this.contentBuffer.length;)this.push(this.contentBuffer.shift());this.currentFile=null},f.prototype.flush=function(){for(var p=this.bytesWritten,g=0;g<this.dirRecords.length;g++)this.push({data:this.dirRecords[g],meta:{percent:100}});var m=this.bytesWritten-p,b=function(v,y,x,S,j){var _=a.transformTo("string",j(S));return h.CENTRAL_DIRECTORY_END+"\0\0\0\0"+o(v,2)+o(v,2)+o(y,4)+o(x,4)+o(_.length,2)+_}(this.dirRecords.length,m,p,this.zipComment,this.encodeFileName);this.push({data:b,meta:{percent:100}})},f.prototype.prepareNextSource=function(){this.previous=this._sources.shift(),this.openedSource(this.previous.streamInfo),this.isPaused?this.previous.pause():this.previous.resume()},f.prototype.registerPrevious=function(p){this._sources.push(p);var g=this;return p.on("data",function(m){g.processChunk(m)}),p.on("end",function(){g.closedSource(g.previous.streamInfo),g._sources.length?g.prepareNextSource():g.end()}),p.on("error",function(m){g.error(m)}),this},f.prototype.resume=function(){return!!c.prototype.resume.call(this)&&(!this.previous&&this._sources.length?(this.prepareNextSource(),!0):this.previous||this._sources.length||this.generatedError?void 0:(this.end(),!0))},f.prototype.error=function(p){var g=this._sources;if(!c.prototype.error.call(this,p))return!1;for(var m=0;m<g.length;m++)try{g[m].error(p)}catch{}return!0},f.prototype.lock=function(){c.prototype.lock.call(this);for(var p=this._sources,g=0;g<p.length;g++)p[g].lock()},n.exports=f},{"../crc32":4,"../signature":23,"../stream/GenericWorker":28,"../utf8":31,"../utils":32}],9:[function(r,n,i){var o=r("../compressions"),s=r("./ZipFileWorker");i.generateWorker=function(a,c,u){var d=new s(c.streamFiles,u,c.platform,c.encodeFileName),h=0;try{a.forEach(function(f,p){h++;var g=function(y,x){var S=y||x,j=o[S];if(!j)throw new Error(S+" is not a valid compression method !");return j}(p.options.compression,c.compression),m=p.options.compressionOptions||c.compressionOptions||{},b=p.dir,v=p.date;p._compressWorker(g,m).withStreamInfo("file",{name:f,dir:b,date:v,comment:p.comment||"",unixPermissions:p.unixPermissions,dosPermissions:p.dosPermissions}).pipe(d)}),d.entriesCount=h}catch(f){d.error(f)}return d}},{"../compressions":3,"./ZipFileWorker":8}],10:[function(r,n,i){function o(){if(!(this instanceof o))return new o;if(arguments.length)throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");this.files=Object.create(null),this.comment=null,this.root="",this.clone=function(){var s=new o;for(var a in this)typeof this[a]!="function"&&(s[a]=this[a]);return s}}(o.prototype=r("./object")).loadAsync=r("./load"),o.support=r("./support"),o.defaults=r("./defaults"),o.version="3.10.1",o.loadAsync=function(s,a){return new o().loadAsync(s,a)},o.external=r("./external"),n.exports=o},{"./defaults":5,"./external":6,"./load":11,"./object":15,"./support":30}],11:[function(r,n,i){var o=r("./utils"),s=r("./external"),a=r("./utf8"),c=r("./zipEntries"),u=r("./stream/Crc32Probe"),d=r("./nodejsUtils");function h(f){return new s.Promise(function(p,g){var m=f.decompressed.getContentWorker().pipe(new u);m.on("error",function(b){g(b)}).on("end",function(){m.streamInfo.crc32!==f.decompressed.crc32?g(new Error("Corrupted zip : CRC32 mismatch")):p()}).resume()})}n.exports=function(f,p){var g=this;return p=o.extend(p||{},{base64:!1,checkCRC32:!1,optimizedBinaryString:!1,createFolders:!1,decodeFileName:a.utf8decode}),d.isNode&&d.isStream(f)?s.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")):o.prepareContent("the loaded zip file",f,!0,p.optimizedBinaryString,p.base64).then(function(m){var b=new c(p);return b.load(m),b}).then(function(m){var b=[s.Promise.resolve(m)],v=m.files;if(p.checkCRC32)for(var y=0;y<v.length;y++)b.push(h(v[y]));return s.Promise.all(b)}).then(function(m){for(var b=m.shift(),v=b.files,y=0;y<v.length;y++){var x=v[y],S=x.fileNameStr,j=o.resolve(x.fileNameStr);g.file(j,x.decompressed,{binary:!0,optimizedBinaryString:!0,date:x.date,dir:x.dir,comment:x.fileCommentStr.length?x.fileCommentStr:null,unixPermissions:x.unixPermissions,dosPermissions:x.dosPermissions,createFolders:p.createFolders}),x.dir||(g.file(j).unsafeOriginalName=S)}return b.zipComment.length&&(g.comment=b.zipComment),g})}},{"./external":6,"./nodejsUtils":14,"./stream/Crc32Probe":25,"./utf8":31,"./utils":32,"./zipEntries":33}],12:[function(r,n,i){var o=r("../utils"),s=r("../stream/GenericWorker");function a(c,u){s.call(this,"Nodejs stream input adapter for "+c),this._upstreamEnded=!1,this._bindStream(u)}o.inherits(a,s),a.prototype._bindStream=function(c){var u=this;(this._stream=c).pause(),c.on("data",function(d){u.push({data:d,meta:{percent:0}})}).on("error",function(d){u.isPaused?this.generatedError=d:u.error(d)}).on("end",function(){u.isPaused?u._upstreamEnded=!0:u.end()})},a.prototype.pause=function(){return!!s.prototype.pause.call(this)&&(this._stream.pause(),!0)},a.prototype.resume=function(){return!!s.prototype.resume.call(this)&&(this._upstreamEnded?this.end():this._stream.resume(),!0)},n.exports=a},{"../stream/GenericWorker":28,"../utils":32}],13:[function(r,n,i){var o=r("readable-stream").Readable;function s(a,c,u){o.call(this,c),this._helper=a;var d=this;a.on("data",function(h,f){d.push(h)||d._helper.pause(),u&&u(f)}).on("error",function(h){d.emit("error",h)}).on("end",function(){d.push(null)})}r("../utils").inherits(s,o),s.prototype._read=function(){this._helper.resume()},n.exports=s},{"../utils":32,"readable-stream":16}],14:[function(r,n,i){n.exports={isNode:typeof Buffer<"u",newBufferFrom:function(o,s){if(Buffer.from&&Buffer.from!==Uint8Array.from)return Buffer.from(o,s);if(typeof o=="number")throw new Error('The "data" argument must not be a number');return new Buffer(o,s)},allocBuffer:function(o){if(Buffer.alloc)return Buffer.alloc(o);var s=new Buffer(o);return s.fill(0),s},isBuffer:function(o){return Buffer.isBuffer(o)},isStream:function(o){return o&&typeof o.on=="function"&&typeof o.pause=="function"&&typeof o.resume=="function"}}},{}],15:[function(r,n,i){function o(j,_,C){var R,T=a.getTypeOf(_),P=a.extend(C||{},d);P.date=P.date||new Date,P.compression!==null&&(P.compression=P.compression.toUpperCase()),typeof P.unixPermissions=="string"&&(P.unixPermissions=parseInt(P.unixPermissions,8)),P.unixPermissions&&16384&P.unixPermissions&&(P.dir=!0),P.dosPermissions&&16&P.dosPermissions&&(P.dir=!0),P.dir&&(j=v(j)),P.createFolders&&(R=b(j))&&y.call(this,R,!0);var H=T==="string"&&P.binary===!1&&P.base64===!1;C&&C.binary!==void 0||(P.binary=!H),(_ instanceof h&&_.uncompressedSize===0||P.dir||!_||_.length===0)&&(P.base64=!1,P.binary=!0,_="",P.compression="STORE",T="string");var E=null;E=_ instanceof h||_ instanceof c?_:g.isNode&&g.isStream(_)?new m(j,_):a.prepareContent(j,_,P.binary,P.optimizedBinaryString,P.base64);var I=new f(j,E,P);this.files[j]=I}var s=r("./utf8"),a=r("./utils"),c=r("./stream/GenericWorker"),u=r("./stream/StreamHelper"),d=r("./defaults"),h=r("./compressedObject"),f=r("./zipObject"),p=r("./generate"),g=r("./nodejsUtils"),m=r("./nodejs/NodejsStreamInputAdapter"),b=function(j){j.slice(-1)==="/"&&(j=j.substring(0,j.length-1));var _=j.lastIndexOf("/");return 0<_?j.substring(0,_):""},v=function(j){return j.slice(-1)!=="/"&&(j+="/"),j},y=function(j,_){return _=_!==void 0?_:d.createFolders,j=v(j),this.files[j]||o.call(this,j,null,{dir:!0,createFolders:_}),this.files[j]};function x(j){return Object.prototype.toString.call(j)==="[object RegExp]"}var S={load:function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},forEach:function(j){var _,C,R;for(_ in this.files)R=this.files[_],(C=_.slice(this.root.length,_.length))&&_.slice(0,this.root.length)===this.root&&j(C,R)},filter:function(j){var _=[];return this.forEach(function(C,R){j(C,R)&&_.push(R)}),_},file:function(j,_,C){if(arguments.length!==1)return j=this.root+j,o.call(this,j,_,C),this;if(x(j)){var R=j;return this.filter(function(P,H){return!H.dir&&R.test(P)})}var T=this.files[this.root+j];return T&&!T.dir?T:null},folder:function(j){if(!j)return this;if(x(j))return this.filter(function(T,P){return P.dir&&j.test(T)});var _=this.root+j,C=y.call(this,_),R=this.clone();return R.root=C.name,R},remove:function(j){j=this.root+j;var _=this.files[j];if(_||(j.slice(-1)!=="/"&&(j+="/"),_=this.files[j]),_&&!_.dir)delete this.files[j];else for(var C=this.filter(function(T,P){return P.name.slice(0,j.length)===j}),R=0;R<C.length;R++)delete this.files[C[R].name];return this},generate:function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},generateInternalStream:function(j){var _,C={};try{if((C=a.extend(j||{},{streamFiles:!1,compression:"STORE",compressionOptions:null,type:"",platform:"DOS",comment:null,mimeType:"application/zip",encodeFileName:s.utf8encode})).type=C.type.toLowerCase(),C.compression=C.compression.toUpperCase(),C.type==="binarystring"&&(C.type="string"),!C.type)throw new Error("No output type specified.");a.checkSupport(C.type),C.platform!=="darwin"&&C.platform!=="freebsd"&&C.platform!=="linux"&&C.platform!=="sunos"||(C.platform="UNIX"),C.platform==="win32"&&(C.platform="DOS");var R=C.comment||this.comment||"";_=p.generateWorker(this,C,R)}catch(T){(_=new c("error")).error(T)}return new u(_,C.type||"string",C.mimeType)},generateAsync:function(j,_){return this.generateInternalStream(j).accumulate(_)},generateNodeStream:function(j,_){return(j=j||{}).type||(j.type="nodebuffer"),this.generateInternalStream(j).toNodejsStream(_)}};n.exports=S},{"./compressedObject":2,"./defaults":5,"./generate":9,"./nodejs/NodejsStreamInputAdapter":12,"./nodejsUtils":14,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31,"./utils":32,"./zipObject":35}],16:[function(r,n,i){n.exports=r("stream")},{stream:void 0}],17:[function(r,n,i){var o=r("./DataReader");function s(a){o.call(this,a);for(var c=0;c<this.data.length;c++)a[c]=255&a[c]}r("../utils").inherits(s,o),s.prototype.byteAt=function(a){return this.data[this.zero+a]},s.prototype.lastIndexOfSignature=function(a){for(var c=a.charCodeAt(0),u=a.charCodeAt(1),d=a.charCodeAt(2),h=a.charCodeAt(3),f=this.length-4;0<=f;--f)if(this.data[f]===c&&this.data[f+1]===u&&this.data[f+2]===d&&this.data[f+3]===h)return f-this.zero;return-1},s.prototype.readAndCheckSignature=function(a){var c=a.charCodeAt(0),u=a.charCodeAt(1),d=a.charCodeAt(2),h=a.charCodeAt(3),f=this.readData(4);return c===f[0]&&u===f[1]&&d===f[2]&&h===f[3]},s.prototype.readData=function(a){if(this.checkOffset(a),a===0)return[];var c=this.data.slice(this.zero+this.index,this.zero+this.index+a);return this.index+=a,c},n.exports=s},{"../utils":32,"./DataReader":18}],18:[function(r,n,i){var o=r("../utils");function s(a){this.data=a,this.length=a.length,this.index=0,this.zero=0}s.prototype={checkOffset:function(a){this.checkIndex(this.index+a)},checkIndex:function(a){if(this.length<this.zero+a||a<0)throw new Error("End of data reached (data length = "+this.length+", asked index = "+a+"). Corrupted zip ?")},setIndex:function(a){this.checkIndex(a),this.index=a},skip:function(a){this.setIndex(this.index+a)},byteAt:function(){},readInt:function(a){var c,u=0;for(this.checkOffset(a),c=this.index+a-1;c>=this.index;c--)u=(u<<8)+this.byteAt(c);return this.index+=a,u},readString:function(a){return o.transformTo("string",this.readData(a))},readData:function(){},lastIndexOfSignature:function(){},readAndCheckSignature:function(){},readDate:function(){var a=this.readInt(4);return new Date(Date.UTC(1980+(a>>25&127),(a>>21&15)-1,a>>16&31,a>>11&31,a>>5&63,(31&a)<<1))}},n.exports=s},{"../utils":32}],19:[function(r,n,i){var o=r("./Uint8ArrayReader");function s(a){o.call(this,a)}r("../utils").inherits(s,o),s.prototype.readData=function(a){this.checkOffset(a);var c=this.data.slice(this.zero+this.index,this.zero+this.index+a);return this.index+=a,c},n.exports=s},{"../utils":32,"./Uint8ArrayReader":21}],20:[function(r,n,i){var o=r("./DataReader");function s(a){o.call(this,a)}r("../utils").inherits(s,o),s.prototype.byteAt=function(a){return this.data.charCodeAt(this.zero+a)},s.prototype.lastIndexOfSignature=function(a){return this.data.lastIndexOf(a)-this.zero},s.prototype.readAndCheckSignature=function(a){return a===this.readData(4)},s.prototype.readData=function(a){this.checkOffset(a);var c=this.data.slice(this.zero+this.index,this.zero+this.index+a);return this.index+=a,c},n.exports=s},{"../utils":32,"./DataReader":18}],21:[function(r,n,i){var o=r("./ArrayReader");function s(a){o.call(this,a)}r("../utils").inherits(s,o),s.prototype.readData=function(a){if(this.checkOffset(a),a===0)return new Uint8Array(0);var c=this.data.subarray(this.zero+this.index,this.zero+this.index+a);return this.index+=a,c},n.exports=s},{"../utils":32,"./ArrayReader":17}],22:[function(r,n,i){var o=r("../utils"),s=r("../support"),a=r("./ArrayReader"),c=r("./StringReader"),u=r("./NodeBufferReader"),d=r("./Uint8ArrayReader");n.exports=function(h){var f=o.getTypeOf(h);return o.checkSupport(f),f!=="string"||s.uint8array?f==="nodebuffer"?new u(h):s.uint8array?new d(o.transformTo("uint8array",h)):new a(o.transformTo("array",h)):new c(h)}},{"../support":30,"../utils":32,"./ArrayReader":17,"./NodeBufferReader":19,"./StringReader":20,"./Uint8ArrayReader":21}],23:[function(r,n,i){i.LOCAL_FILE_HEADER="PK",i.CENTRAL_FILE_HEADER="PK",i.CENTRAL_DIRECTORY_END="PK",i.ZIP64_CENTRAL_DIRECTORY_LOCATOR="PK\x07",i.ZIP64_CENTRAL_DIRECTORY_END="PK",i.DATA_DESCRIPTOR="PK\x07\b"},{}],24:[function(r,n,i){var o=r("./GenericWorker"),s=r("../utils");function a(c){o.call(this,"ConvertWorker to "+c),this.destType=c}s.inherits(a,o),a.prototype.processChunk=function(c){this.push({data:s.transformTo(this.destType,c.data),meta:c.meta})},n.exports=a},{"../utils":32,"./GenericWorker":28}],25:[function(r,n,i){var o=r("./GenericWorker"),s=r("../crc32");function a(){o.call(this,"Crc32Probe"),this.withStreamInfo("crc32",0)}r("../utils").inherits(a,o),a.prototype.processChunk=function(c){this.streamInfo.crc32=s(c.data,this.streamInfo.crc32||0),this.push(c)},n.exports=a},{"../crc32":4,"../utils":32,"./GenericWorker":28}],26:[function(r,n,i){var o=r("../utils"),s=r("./GenericWorker");function a(c){s.call(this,"DataLengthProbe for "+c),this.propName=c,this.withStreamInfo(c,0)}o.inherits(a,s),a.prototype.processChunk=function(c){if(c){var u=this.streamInfo[this.propName]||0;this.streamInfo[this.propName]=u+c.data.length}s.prototype.processChunk.call(this,c)},n.exports=a},{"../utils":32,"./GenericWorker":28}],27:[function(r,n,i){var o=r("../utils"),s=r("./GenericWorker");function a(c){s.call(this,"DataWorker");var u=this;this.dataIsReady=!1,this.index=0,this.max=0,this.data=null,this.type="",this._tickScheduled=!1,c.then(function(d){u.dataIsReady=!0,u.data=d,u.max=d&&d.length||0,u.type=o.getTypeOf(d),u.isPaused||u._tickAndRepeat()},function(d){u.error(d)})}o.inherits(a,s),a.prototype.cleanUp=function(){s.prototype.cleanUp.call(this),this.data=null},a.prototype.resume=function(){return!!s.prototype.resume.call(this)&&(!this._tickScheduled&&this.dataIsReady&&(this._tickScheduled=!0,o.delay(this._tickAndRepeat,[],this)),!0)},a.prototype._tickAndRepeat=function(){this._tickScheduled=!1,this.isPaused||this.isFinished||(this._tick(),this.isFinished||(o.delay(this._tickAndRepeat,[],this),this._tickScheduled=!0))},a.prototype._tick=function(){if(this.isPaused||this.isFinished)return!1;var c=null,u=Math.min(this.max,this.index+16384);if(this.index>=this.max)return this.end();switch(this.type){case"string":c=this.data.substring(this.index,u);break;case"uint8array":c=this.data.subarray(this.index,u);break;case"array":case"nodebuffer":c=this.data.slice(this.index,u)}return this.index=u,this.push({data:c,meta:{percent:this.max?this.index/this.max*100:0}})},n.exports=a},{"../utils":32,"./GenericWorker":28}],28:[function(r,n,i){function o(s){this.name=s||"default",this.streamInfo={},this.generatedError=null,this.extraStreamInfo={},this.isPaused=!0,this.isFinished=!1,this.isLocked=!1,this._listeners={data:[],end:[],error:[]},this.previous=null}o.prototype={push:function(s){this.emit("data",s)},end:function(){if(this.isFinished)return!1;this.flush();try{this.emit("end"),this.cleanUp(),this.isFinished=!0}catch(s){this.emit("error",s)}return!0},error:function(s){return!this.isFinished&&(this.isPaused?this.generatedError=s:(this.isFinished=!0,this.emit("error",s),this.previous&&this.previous.error(s),this.cleanUp()),!0)},on:function(s,a){return this._listeners[s].push(a),this},cleanUp:function(){this.streamInfo=this.generatedError=this.extraStreamInfo=null,this._listeners=[]},emit:function(s,a){if(this._listeners[s])for(var c=0;c<this._listeners[s].length;c++)this._listeners[s][c].call(this,a)},pipe:function(s){return s.registerPrevious(this)},registerPrevious:function(s){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.streamInfo=s.streamInfo,this.mergeStreamInfo(),this.previous=s;var a=this;return s.on("data",function(c){a.processChunk(c)}),s.on("end",function(){a.end()}),s.on("error",function(c){a.error(c)}),this},pause:function(){return!this.isPaused&&!this.isFinished&&(this.isPaused=!0,this.previous&&this.previous.pause(),!0)},resume:function(){if(!this.isPaused||this.isFinished)return!1;var s=this.isPaused=!1;return this.generatedError&&(this.error(this.generatedError),s=!0),this.previous&&this.previous.resume(),!s},flush:function(){},processChunk:function(s){this.push(s)},withStreamInfo:function(s,a){return this.extraStreamInfo[s]=a,this.mergeStreamInfo(),this},mergeStreamInfo:function(){for(var s in this.extraStreamInfo)Object.prototype.hasOwnProperty.call(this.extraStreamInfo,s)&&(this.streamInfo[s]=this.extraStreamInfo[s])},lock:function(){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.isLocked=!0,this.previous&&this.previous.lock()},toString:function(){var s="Worker "+this.name;return this.previous?this.previous+" -> "+s:s}},n.exports=o},{}],29:[function(r,n,i){var o=r("../utils"),s=r("./ConvertWorker"),a=r("./GenericWorker"),c=r("../base64"),u=r("../support"),d=r("../external"),h=null;if(u.nodestream)try{h=r("../nodejs/NodejsStreamOutputAdapter")}catch{}function f(g,m){return new d.Promise(function(b,v){var y=[],x=g._internalType,S=g._outputType,j=g._mimeType;g.on("data",function(_,C){y.push(_),m&&m(C)}).on("error",function(_){y=[],v(_)}).on("end",function(){try{var _=function(C,R,T){switch(C){case"blob":return o.newBlob(o.transformTo("arraybuffer",R),T);case"base64":return c.encode(R);default:return o.transformTo(C,R)}}(S,function(C,R){var T,P=0,H=null,E=0;for(T=0;T<R.length;T++)E+=R[T].length;switch(C){case"string":return R.join("");case"array":return Array.prototype.concat.apply([],R);case"uint8array":for(H=new Uint8Array(E),T=0;T<R.length;T++)H.set(R[T],P),P+=R[T].length;return H;case"nodebuffer":return Buffer.concat(R);default:throw new Error("concat : unsupported type '"+C+"'")}}(x,y),j);b(_)}catch(C){v(C)}y=[]}).resume()})}function p(g,m,b){var v=m;switch(m){case"blob":case"arraybuffer":v="uint8array";break;case"base64":v="string"}try{this._internalType=v,this._outputType=m,this._mimeType=b,o.checkSupport(v),this._worker=g.pipe(new s(v)),g.lock()}catch(y){this._worker=new a("error"),this._worker.error(y)}}p.prototype={accumulate:function(g){return f(this,g)},on:function(g,m){var b=this;return g==="data"?this._worker.on(g,function(v){m.call(b,v.data,v.meta)}):this._worker.on(g,function(){o.delay(m,arguments,b)}),this},resume:function(){return o.delay(this._worker.resume,[],this._worker),this},pause:function(){return this._worker.pause(),this},toNodejsStream:function(g){if(o.checkSupport("nodestream"),this._outputType!=="nodebuffer")throw new Error(this._outputType+" is not supported by this method");return new h(this,{objectMode:this._outputType!=="nodebuffer"},g)}},n.exports=p},{"../base64":1,"../external":6,"../nodejs/NodejsStreamOutputAdapter":13,"../support":30,"../utils":32,"./ConvertWorker":24,"./GenericWorker":28}],30:[function(r,n,i){if(i.base64=!0,i.array=!0,i.string=!0,i.arraybuffer=typeof ArrayBuffer<"u"&&typeof Uint8Array<"u",i.nodebuffer=typeof Buffer<"u",i.uint8array=typeof Uint8Array<"u",typeof ArrayBuffer>"u")i.blob=!1;else{var o=new ArrayBuffer(0);try{i.blob=new Blob([o],{type:"application/zip"}).size===0}catch{try{var s=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);s.append(o),i.blob=s.getBlob("application/zip").size===0}catch{i.blob=!1}}}try{i.nodestream=!!r("readable-stream").Readable}catch{i.nodestream=!1}},{"readable-stream":16}],31:[function(r,n,i){for(var o=r("./utils"),s=r("./support"),a=r("./nodejsUtils"),c=r("./stream/GenericWorker"),u=new Array(256),d=0;d<256;d++)u[d]=252<=d?6:248<=d?5:240<=d?4:224<=d?3:192<=d?2:1;u[254]=u[254]=1;function h(){c.call(this,"utf-8 decode"),this.leftOver=null}function f(){c.call(this,"utf-8 encode")}i.utf8encode=function(p){return s.nodebuffer?a.newBufferFrom(p,"utf-8"):function(g){var m,b,v,y,x,S=g.length,j=0;for(y=0;y<S;y++)(64512&(b=g.charCodeAt(y)))==55296&&y+1<S&&(64512&(v=g.charCodeAt(y+1)))==56320&&(b=65536+(b-55296<<10)+(v-56320),y++),j+=b<128?1:b<2048?2:b<65536?3:4;for(m=s.uint8array?new Uint8Array(j):new Array(j),y=x=0;x<j;y++)(64512&(b=g.charCodeAt(y)))==55296&&y+1<S&&(64512&(v=g.charCodeAt(y+1)))==56320&&(b=65536+(b-55296<<10)+(v-56320),y++),b<128?m[x++]=b:(b<2048?m[x++]=192|b>>>6:(b<65536?m[x++]=224|b>>>12:(m[x++]=240|b>>>18,m[x++]=128|b>>>12&63),m[x++]=128|b>>>6&63),m[x++]=128|63&b);return m}(p)},i.utf8decode=function(p){return s.nodebuffer?o.transformTo("nodebuffer",p).toString("utf-8"):function(g){var m,b,v,y,x=g.length,S=new Array(2*x);for(m=b=0;m<x;)if((v=g[m++])<128)S[b++]=v;else if(4<(y=u[v]))S[b++]=65533,m+=y-1;else{for(v&=y===2?31:y===3?15:7;1<y&&m<x;)v=v<<6|63&g[m++],y--;1<y?S[b++]=65533:v<65536?S[b++]=v:(v-=65536,S[b++]=55296|v>>10&1023,S[b++]=56320|1023&v)}return S.length!==b&&(S.subarray?S=S.subarray(0,b):S.length=b),o.applyFromCharCode(S)}(p=o.transformTo(s.uint8array?"uint8array":"array",p))},o.inherits(h,c),h.prototype.processChunk=function(p){var g=o.transformTo(s.uint8array?"uint8array":"array",p.data);if(this.leftOver&&this.leftOver.length){if(s.uint8array){var m=g;(g=new Uint8Array(m.length+this.leftOver.length)).set(this.leftOver,0),g.set(m,this.leftOver.length)}else g=this.leftOver.concat(g);this.leftOver=null}var b=function(y,x){var S;for((x=x||y.length)>y.length&&(x=y.length),S=x-1;0<=S&&(192&y[S])==128;)S--;return S<0||S===0?x:S+u[y[S]]>x?S:x}(g),v=g;b!==g.length&&(s.uint8array?(v=g.subarray(0,b),this.leftOver=g.subarray(b,g.length)):(v=g.slice(0,b),this.leftOver=g.slice(b,g.length))),this.push({data:i.utf8decode(v),meta:p.meta})},h.prototype.flush=function(){this.leftOver&&this.leftOver.length&&(this.push({data:i.utf8decode(this.leftOver),meta:{}}),this.leftOver=null)},i.Utf8DecodeWorker=h,o.inherits(f,c),f.prototype.processChunk=function(p){this.push({data:i.utf8encode(p.data),meta:p.meta})},i.Utf8EncodeWorker=f},{"./nodejsUtils":14,"./stream/GenericWorker":28,"./support":30,"./utils":32}],32:[function(r,n,i){var o=r("./support"),s=r("./base64"),a=r("./nodejsUtils"),c=r("./external");function u(m){return m}function d(m,b){for(var v=0;v<m.length;++v)b[v]=255&m.charCodeAt(v);return b}r("setimmediate"),i.newBlob=function(m,b){i.checkSupport("blob");try{return new Blob([m],{type:b})}catch{try{var v=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);return v.append(m),v.getBlob(b)}catch{throw new Error("Bug : can't construct the Blob.")}}};var h={stringifyByChunk:function(m,b,v){var y=[],x=0,S=m.length;if(S<=v)return String.fromCharCode.apply(null,m);for(;x<S;)b==="array"||b==="nodebuffer"?y.push(String.fromCharCode.apply(null,m.slice(x,Math.min(x+v,S)))):y.push(String.fromCharCode.apply(null,m.subarray(x,Math.min(x+v,S)))),x+=v;return y.join("")},stringifyByChar:function(m){for(var b="",v=0;v<m.length;v++)b+=String.fromCharCode(m[v]);return b},applyCanBeUsed:{uint8array:function(){try{return o.uint8array&&String.fromCharCode.apply(null,new Uint8Array(1)).length===1}catch{return!1}}(),nodebuffer:function(){try{return o.nodebuffer&&String.fromCharCode.apply(null,a.allocBuffer(1)).length===1}catch{return!1}}()}};function f(m){var b=65536,v=i.getTypeOf(m),y=!0;if(v==="uint8array"?y=h.applyCanBeUsed.uint8array:v==="nodebuffer"&&(y=h.applyCanBeUsed.nodebuffer),y)for(;1<b;)try{return h.stringifyByChunk(m,v,b)}catch{b=Math.floor(b/2)}return h.stringifyByChar(m)}function p(m,b){for(var v=0;v<m.length;v++)b[v]=m[v];return b}i.applyFromCharCode=f;var g={};g.string={string:u,array:function(m){return d(m,new Array(m.length))},arraybuffer:function(m){return g.string.uint8array(m).buffer},uint8array:function(m){return d(m,new Uint8Array(m.length))},nodebuffer:function(m){return d(m,a.allocBuffer(m.length))}},g.array={string:f,array:u,arraybuffer:function(m){return new Uint8Array(m).buffer},uint8array:function(m){return new Uint8Array(m)},nodebuffer:function(m){return a.newBufferFrom(m)}},g.arraybuffer={string:function(m){return f(new Uint8Array(m))},array:function(m){return p(new Uint8Array(m),new Array(m.byteLength))},arraybuffer:u,uint8array:function(m){return new Uint8Array(m)},nodebuffer:function(m){return a.newBufferFrom(new Uint8Array(m))}},g.uint8array={string:f,array:function(m){return p(m,new Array(m.length))},arraybuffer:function(m){return m.buffer},uint8array:u,nodebuffer:function(m){return a.newBufferFrom(m)}},g.nodebuffer={string:f,array:function(m){return p(m,new Array(m.length))},arraybuffer:function(m){return g.nodebuffer.uint8array(m).buffer},uint8array:function(m){return p(m,new Uint8Array(m.length))},nodebuffer:u},i.transformTo=function(m,b){if(b=b||"",!m)return b;i.checkSupport(m);var v=i.getTypeOf(b);return g[v][m](b)},i.resolve=function(m){for(var b=m.split("/"),v=[],y=0;y<b.length;y++){var x=b[y];x==="."||x===""&&y!==0&&y!==b.length-1||(x===".."?v.pop():v.push(x))}return v.join("/")},i.getTypeOf=function(m){return typeof m=="string"?"string":Object.prototype.toString.call(m)==="[object Array]"?"array":o.nodebuffer&&a.isBuffer(m)?"nodebuffer":o.uint8array&&m instanceof Uint8Array?"uint8array":o.arraybuffer&&m instanceof ArrayBuffer?"arraybuffer":void 0},i.checkSupport=function(m){if(!o[m.toLowerCase()])throw new Error(m+" is not supported by this platform")},i.MAX_VALUE_16BITS=65535,i.MAX_VALUE_32BITS=-1,i.pretty=function(m){var b,v,y="";for(v=0;v<(m||"").length;v++)y+="\\x"+((b=m.charCodeAt(v))<16?"0":"")+b.toString(16).toUpperCase();return y},i.delay=function(m,b,v){setImmediate(function(){m.apply(v||null,b||[])})},i.inherits=function(m,b){function v(){}v.prototype=b.prototype,m.prototype=new v},i.extend=function(){var m,b,v={};for(m=0;m<arguments.length;m++)for(b in arguments[m])Object.prototype.hasOwnProperty.call(arguments[m],b)&&v[b]===void 0&&(v[b]=arguments[m][b]);return v},i.prepareContent=function(m,b,v,y,x){return c.Promise.resolve(b).then(function(S){return o.blob&&(S instanceof Blob||["[object File]","[object Blob]"].indexOf(Object.prototype.toString.call(S))!==-1)&&typeof FileReader<"u"?new c.Promise(function(j,_){var C=new FileReader;C.onload=function(R){j(R.target.result)},C.onerror=function(R){_(R.target.error)},C.readAsArrayBuffer(S)}):S}).then(function(S){var j=i.getTypeOf(S);return j?(j==="arraybuffer"?S=i.transformTo("uint8array",S):j==="string"&&(x?S=s.decode(S):v&&y!==!0&&(S=function(_){return d(_,o.uint8array?new Uint8Array(_.length):new Array(_.length))}(S))),S):c.Promise.reject(new Error("Can't read the data of '"+m+"'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"))})}},{"./base64":1,"./external":6,"./nodejsUtils":14,"./support":30,setimmediate:54}],33:[function(r,n,i){var o=r("./reader/readerFor"),s=r("./utils"),a=r("./signature"),c=r("./zipEntry"),u=r("./support");function d(h){this.files=[],this.loadOptions=h}d.prototype={checkSignature:function(h){if(!this.reader.readAndCheckSignature(h)){this.reader.index-=4;var f=this.reader.readString(4);throw new Error("Corrupted zip or bug: unexpected signature ("+s.pretty(f)+", expected "+s.pretty(h)+")")}},isSignature:function(h,f){var p=this.reader.index;this.reader.setIndex(h);var g=this.reader.readString(4)===f;return this.reader.setIndex(p),g},readBlockEndOfCentral:function(){this.diskNumber=this.reader.readInt(2),this.diskWithCentralDirStart=this.reader.readInt(2),this.centralDirRecordsOnThisDisk=this.reader.readInt(2),this.centralDirRecords=this.reader.readInt(2),this.centralDirSize=this.reader.readInt(4),this.centralDirOffset=this.reader.readInt(4),this.zipCommentLength=this.reader.readInt(2);var h=this.reader.readData(this.zipCommentLength),f=u.uint8array?"uint8array":"array",p=s.transformTo(f,h);this.zipComment=this.loadOptions.decodeFileName(p)},readBlockZip64EndOfCentral:function(){this.zip64EndOfCentralSize=this.reader.readInt(8),this.reader.skip(4),this.diskNumber=this.reader.readInt(4),this.diskWithCentralDirStart=this.reader.readInt(4),this.centralDirRecordsOnThisDisk=this.reader.readInt(8),this.centralDirRecords=this.reader.readInt(8),this.centralDirSize=this.reader.readInt(8),this.centralDirOffset=this.reader.readInt(8),this.zip64ExtensibleData={};for(var h,f,p,g=this.zip64EndOfCentralSize-44;0<g;)h=this.reader.readInt(2),f=this.reader.readInt(4),p=this.reader.readData(f),this.zip64ExtensibleData[h]={id:h,length:f,value:p}},readBlockZip64EndOfCentralLocator:function(){if(this.diskWithZip64CentralDirStart=this.reader.readInt(4),this.relativeOffsetEndOfZip64CentralDir=this.reader.readInt(8),this.disksCount=this.reader.readInt(4),1<this.disksCount)throw new Error("Multi-volumes zip are not supported")},readLocalFiles:function(){var h,f;for(h=0;h<this.files.length;h++)f=this.files[h],this.reader.setIndex(f.localHeaderOffset),this.checkSignature(a.LOCAL_FILE_HEADER),f.readLocalPart(this.reader),f.handleUTF8(),f.processAttributes()},readCentralDir:function(){var h;for(this.reader.setIndex(this.centralDirOffset);this.reader.readAndCheckSignature(a.CENTRAL_FILE_HEADER);)(h=new c({zip64:this.zip64},this.loadOptions)).readCentralPart(this.reader),this.files.push(h);if(this.centralDirRecords!==this.files.length&&this.centralDirRecords!==0&&this.files.length===0)throw new Error("Corrupted zip or bug: expected "+this.centralDirRecords+" records in central dir, got "+this.files.length)},readEndOfCentral:function(){var h=this.reader.lastIndexOfSignature(a.CENTRAL_DIRECTORY_END);if(h<0)throw this.isSignature(0,a.LOCAL_FILE_HEADER)?new Error("Corrupted zip: can't find end of central directory"):new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");this.reader.setIndex(h);var f=h;if(this.checkSignature(a.CENTRAL_DIRECTORY_END),this.readBlockEndOfCentral(),this.diskNumber===s.MAX_VALUE_16BITS||this.diskWithCentralDirStart===s.MAX_VALUE_16BITS||this.centralDirRecordsOnThisDisk===s.MAX_VALUE_16BITS||this.centralDirRecords===s.MAX_VALUE_16BITS||this.centralDirSize===s.MAX_VALUE_32BITS||this.centralDirOffset===s.MAX_VALUE_32BITS){if(this.zip64=!0,(h=this.reader.lastIndexOfSignature(a.ZIP64_CENTRAL_DIRECTORY_LOCATOR))<0)throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");if(this.reader.setIndex(h),this.checkSignature(a.ZIP64_CENTRAL_DIRECTORY_LOCATOR),this.readBlockZip64EndOfCentralLocator(),!this.isSignature(this.relativeOffsetEndOfZip64CentralDir,a.ZIP64_CENTRAL_DIRECTORY_END)&&(this.relativeOffsetEndOfZip64CentralDir=this.reader.lastIndexOfSignature(a.ZIP64_CENTRAL_DIRECTORY_END),this.relativeOffsetEndOfZip64CentralDir<0))throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir),this.checkSignature(a.ZIP64_CENTRAL_DIRECTORY_END),this.readBlockZip64EndOfCentral()}var p=this.centralDirOffset+this.centralDirSize;this.zip64&&(p+=20,p+=12+this.zip64EndOfCentralSize);var g=f-p;if(0<g)this.isSignature(f,a.CENTRAL_FILE_HEADER)||(this.reader.zero=g);else if(g<0)throw new Error("Corrupted zip: missing "+Math.abs(g)+" bytes.")},prepareReader:function(h){this.reader=o(h)},load:function(h){this.prepareReader(h),this.readEndOfCentral(),this.readCentralDir(),this.readLocalFiles()}},n.exports=d},{"./reader/readerFor":22,"./signature":23,"./support":30,"./utils":32,"./zipEntry":34}],34:[function(r,n,i){var o=r("./reader/readerFor"),s=r("./utils"),a=r("./compressedObject"),c=r("./crc32"),u=r("./utf8"),d=r("./compressions"),h=r("./support");function f(p,g){this.options=p,this.loadOptions=g}f.prototype={isEncrypted:function(){return(1&this.bitFlag)==1},useUTF8:function(){return(2048&this.bitFlag)==2048},readLocalPart:function(p){var g,m;if(p.skip(22),this.fileNameLength=p.readInt(2),m=p.readInt(2),this.fileName=p.readData(this.fileNameLength),p.skip(m),this.compressedSize===-1||this.uncompressedSize===-1)throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");if((g=function(b){for(var v in d)if(Object.prototype.hasOwnProperty.call(d,v)&&d[v].magic===b)return d[v];return null}(this.compressionMethod))===null)throw new Error("Corrupted zip : compression "+s.pretty(this.compressionMethod)+" unknown (inner file : "+s.transformTo("string",this.fileName)+")");this.decompressed=new a(this.compressedSize,this.uncompressedSize,this.crc32,g,p.readData(this.compressedSize))},readCentralPart:function(p){this.versionMadeBy=p.readInt(2),p.skip(2),this.bitFlag=p.readInt(2),this.compressionMethod=p.readString(2),this.date=p.readDate(),this.crc32=p.readInt(4),this.compressedSize=p.readInt(4),this.uncompressedSize=p.readInt(4);var g=p.readInt(2);if(this.extraFieldsLength=p.readInt(2),this.fileCommentLength=p.readInt(2),this.diskNumberStart=p.readInt(2),this.internalFileAttributes=p.readInt(2),this.externalFileAttributes=p.readInt(4),this.localHeaderOffset=p.readInt(4),this.isEncrypted())throw new Error("Encrypted zip are not supported");p.skip(g),this.readExtraFields(p),this.parseZIP64ExtraField(p),this.fileComment=p.readData(this.fileCommentLength)},processAttributes:function(){this.unixPermissions=null,this.dosPermissions=null;var p=this.versionMadeBy>>8;this.dir=!!(16&this.externalFileAttributes),p==0&&(this.dosPermissions=63&this.externalFileAttributes),p==3&&(this.unixPermissions=this.externalFileAttributes>>16&65535),this.dir||this.fileNameStr.slice(-1)!=="/"||(this.dir=!0)},parseZIP64ExtraField:function(){if(this.extraFields[1]){var p=o(this.extraFields[1].value);this.uncompressedSize===s.MAX_VALUE_32BITS&&(this.uncompressedSize=p.readInt(8)),this.compressedSize===s.MAX_VALUE_32BITS&&(this.compressedSize=p.readInt(8)),this.localHeaderOffset===s.MAX_VALUE_32BITS&&(this.localHeaderOffset=p.readInt(8)),this.diskNumberStart===s.MAX_VALUE_32BITS&&(this.diskNumberStart=p.readInt(4))}},readExtraFields:function(p){var g,m,b,v=p.index+this.extraFieldsLength;for(this.extraFields||(this.extraFields={});p.index+4<v;)g=p.readInt(2),m=p.readInt(2),b=p.readData(m),this.extraFields[g]={id:g,length:m,value:b};p.setIndex(v)},handleUTF8:function(){var p=h.uint8array?"uint8array":"array";if(this.useUTF8())this.fileNameStr=u.utf8decode(this.fileName),this.fileCommentStr=u.utf8decode(this.fileComment);else{var g=this.findExtraFieldUnicodePath();if(g!==null)this.fileNameStr=g;else{var m=s.transformTo(p,this.fileName);this.fileNameStr=this.loadOptions.decodeFileName(m)}var b=this.findExtraFieldUnicodeComment();if(b!==null)this.fileCommentStr=b;else{var v=s.transformTo(p,this.fileComment);this.fileCommentStr=this.loadOptions.decodeFileName(v)}}},findExtraFieldUnicodePath:function(){var p=this.extraFields[28789];if(p){var g=o(p.value);return g.readInt(1)!==1||c(this.fileName)!==g.readInt(4)?null:u.utf8decode(g.readData(p.length-5))}return null},findExtraFieldUnicodeComment:function(){var p=this.extraFields[25461];if(p){var g=o(p.value);return g.readInt(1)!==1||c(this.fileComment)!==g.readInt(4)?null:u.utf8decode(g.readData(p.length-5))}return null}},n.exports=f},{"./compressedObject":2,"./compressions":3,"./crc32":4,"./reader/readerFor":22,"./support":30,"./utf8":31,"./utils":32}],35:[function(r,n,i){function o(g,m,b){this.name=g,this.dir=b.dir,this.date=b.date,this.comment=b.comment,this.unixPermissions=b.unixPermissions,this.dosPermissions=b.dosPermissions,this._data=m,this._dataBinary=b.binary,this.options={compression:b.compression,compressionOptions:b.compressionOptions}}var s=r("./stream/StreamHelper"),a=r("./stream/DataWorker"),c=r("./utf8"),u=r("./compressedObject"),d=r("./stream/GenericWorker");o.prototype={internalStream:function(g){var m=null,b="string";try{if(!g)throw new Error("No output type specified.");var v=(b=g.toLowerCase())==="string"||b==="text";b!=="binarystring"&&b!=="text"||(b="string"),m=this._decompressWorker();var y=!this._dataBinary;y&&!v&&(m=m.pipe(new c.Utf8EncodeWorker)),!y&&v&&(m=m.pipe(new c.Utf8DecodeWorker))}catch(x){(m=new d("error")).error(x)}return new s(m,b,"")},async:function(g,m){return this.internalStream(g).accumulate(m)},nodeStream:function(g,m){return this.internalStream(g||"nodebuffer").toNodejsStream(m)},_compressWorker:function(g,m){if(this._data instanceof u&&this._data.compression.magic===g.magic)return this._data.getCompressedWorker();var b=this._decompressWorker();return this._dataBinary||(b=b.pipe(new c.Utf8EncodeWorker)),u.createWorkerFrom(b,g,m)},_decompressWorker:function(){return this._data instanceof u?this._data.getContentWorker():this._data instanceof d?this._data:new a(this._data)}};for(var h=["asText","asBinary","asNodeBuffer","asUint8Array","asArrayBuffer"],f=function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},p=0;p<h.length;p++)o.prototype[h[p]]=f;n.exports=o},{"./compressedObject":2,"./stream/DataWorker":27,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31}],36:[function(r,n,i){(function(o){var s,a,c=o.MutationObserver||o.WebKitMutationObserver;if(c){var u=0,d=new c(g),h=o.document.createTextNode("");d.observe(h,{characterData:!0}),s=function(){h.data=u=++u%2}}else if(o.setImmediate||o.MessageChannel===void 0)s="document"in o&&"onreadystatechange"in o.document.createElement("script")?function(){var m=o.document.createElement("script");m.onreadystatechange=function(){g(),m.onreadystatechange=null,m.parentNode.removeChild(m),m=null},o.document.documentElement.appendChild(m)}:function(){setTimeout(g,0)};else{var f=new o.MessageChannel;f.port1.onmessage=g,s=function(){f.port2.postMessage(0)}}var p=[];function g(){var m,b;a=!0;for(var v=p.length;v;){for(b=p,p=[],m=-1;++m<v;)b[m]();v=p.length}a=!1}n.exports=function(m){p.push(m)!==1||a||s()}}).call(this,typeof Un<"u"?Un:typeof self<"u"?self:typeof window<"u"?window:{})},{}],37:[function(r,n,i){var o=r("immediate");function s(){}var a={},c=["REJECTED"],u=["FULFILLED"],d=["PENDING"];function h(v){if(typeof v!="function")throw new TypeError("resolver must be a function");this.state=d,this.queue=[],this.outcome=void 0,v!==s&&m(this,v)}function f(v,y,x){this.promise=v,typeof y=="function"&&(this.onFulfilled=y,this.callFulfilled=this.otherCallFulfilled),typeof x=="function"&&(this.onRejected=x,this.callRejected=this.otherCallRejected)}function p(v,y,x){o(function(){var S;try{S=y(x)}catch(j){return a.reject(v,j)}S===v?a.reject(v,new TypeError("Cannot resolve promise with itself")):a.resolve(v,S)})}function g(v){var y=v&&v.then;if(v&&(typeof v=="object"||typeof v=="function")&&typeof y=="function")return function(){y.apply(v,arguments)}}function m(v,y){var x=!1;function S(C){x||(x=!0,a.reject(v,C))}function j(C){x||(x=!0,a.resolve(v,C))}var _=b(function(){y(j,S)});_.status==="error"&&S(_.value)}function b(v,y){var x={};try{x.value=v(y),x.status="success"}catch(S){x.status="error",x.value=S}return x}(n.exports=h).prototype.finally=function(v){if(typeof v!="function")return this;var y=this.constructor;return this.then(function(x){return y.resolve(v()).then(function(){return x})},function(x){return y.resolve(v()).then(function(){throw x})})},h.prototype.catch=function(v){return this.then(null,v)},h.prototype.then=function(v,y){if(typeof v!="function"&&this.state===u||typeof y!="function"&&this.state===c)return this;var x=new this.constructor(s);return this.state!==d?p(x,this.state===u?v:y,this.outcome):this.queue.push(new f(x,v,y)),x},f.prototype.callFulfilled=function(v){a.resolve(this.promise,v)},f.prototype.otherCallFulfilled=function(v){p(this.promise,this.onFulfilled,v)},f.prototype.callRejected=function(v){a.reject(this.promise,v)},f.prototype.otherCallRejected=function(v){p(this.promise,this.onRejected,v)},a.resolve=function(v,y){var x=b(g,y);if(x.status==="error")return a.reject(v,x.value);var S=x.value;if(S)m(v,S);else{v.state=u,v.outcome=y;for(var j=-1,_=v.queue.length;++j<_;)v.queue[j].callFulfilled(y)}return v},a.reject=function(v,y){v.state=c,v.outcome=y;for(var x=-1,S=v.queue.length;++x<S;)v.queue[x].callRejected(y);return v},h.resolve=function(v){return v instanceof this?v:a.resolve(new this(s),v)},h.reject=function(v){var y=new this(s);return a.reject(y,v)},h.all=function(v){var y=this;if(Object.prototype.toString.call(v)!=="[object Array]")return this.reject(new TypeError("must be an array"));var x=v.length,S=!1;if(!x)return this.resolve([]);for(var j=new Array(x),_=0,C=-1,R=new this(s);++C<x;)T(v[C],C);return R;function T(P,H){y.resolve(P).then(function(E){j[H]=E,++_!==x||S||(S=!0,a.resolve(R,j))},function(E){S||(S=!0,a.reject(R,E))})}},h.race=function(v){var y=this;if(Object.prototype.toString.call(v)!=="[object Array]")return this.reject(new TypeError("must be an array"));var x=v.length,S=!1;if(!x)return this.resolve([]);for(var j=-1,_=new this(s);++j<x;)C=v[j],y.resolve(C).then(function(R){S||(S=!0,a.resolve(_,R))},function(R){S||(S=!0,a.reject(_,R))});var C;return _}},{immediate:36}],38:[function(r,n,i){var o={};(0,r("./lib/utils/common").assign)(o,r("./lib/deflate"),r("./lib/inflate"),r("./lib/zlib/constants")),n.exports=o},{"./lib/deflate":39,"./lib/inflate":40,"./lib/utils/common":41,"./lib/zlib/constants":44}],39:[function(r,n,i){var o=r("./zlib/deflate"),s=r("./utils/common"),a=r("./utils/strings"),c=r("./zlib/messages"),u=r("./zlib/zstream"),d=Object.prototype.toString,h=0,f=-1,p=0,g=8;function m(v){if(!(this instanceof m))return new m(v);this.options=s.assign({level:f,method:g,chunkSize:16384,windowBits:15,memLevel:8,strategy:p,to:""},v||{});var y=this.options;y.raw&&0<y.windowBits?y.windowBits=-y.windowBits:y.gzip&&0<y.windowBits&&y.windowBits<16&&(y.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new u,this.strm.avail_out=0;var x=o.deflateInit2(this.strm,y.level,y.method,y.windowBits,y.memLevel,y.strategy);if(x!==h)throw new Error(c[x]);if(y.header&&o.deflateSetHeader(this.strm,y.header),y.dictionary){var S;if(S=typeof y.dictionary=="string"?a.string2buf(y.dictionary):d.call(y.dictionary)==="[object ArrayBuffer]"?new Uint8Array(y.dictionary):y.dictionary,(x=o.deflateSetDictionary(this.strm,S))!==h)throw new Error(c[x]);this._dict_set=!0}}function b(v,y){var x=new m(y);if(x.push(v,!0),x.err)throw x.msg||c[x.err];return x.result}m.prototype.push=function(v,y){var x,S,j=this.strm,_=this.options.chunkSize;if(this.ended)return!1;S=y===~~y?y:y===!0?4:0,typeof v=="string"?j.input=a.string2buf(v):d.call(v)==="[object ArrayBuffer]"?j.input=new Uint8Array(v):j.input=v,j.next_in=0,j.avail_in=j.input.length;do{if(j.avail_out===0&&(j.output=new s.Buf8(_),j.next_out=0,j.avail_out=_),(x=o.deflate(j,S))!==1&&x!==h)return this.onEnd(x),!(this.ended=!0);j.avail_out!==0&&(j.avail_in!==0||S!==4&&S!==2)||(this.options.to==="string"?this.onData(a.buf2binstring(s.shrinkBuf(j.output,j.next_out))):this.onData(s.shrinkBuf(j.output,j.next_out)))}while((0<j.avail_in||j.avail_out===0)&&x!==1);return S===4?(x=o.deflateEnd(this.strm),this.onEnd(x),this.ended=!0,x===h):S!==2||(this.onEnd(h),!(j.avail_out=0))},m.prototype.onData=function(v){this.chunks.push(v)},m.prototype.onEnd=function(v){v===h&&(this.options.to==="string"?this.result=this.chunks.join(""):this.result=s.flattenChunks(this.chunks)),this.chunks=[],this.err=v,this.msg=this.strm.msg},i.Deflate=m,i.deflate=b,i.deflateRaw=function(v,y){return(y=y||{}).raw=!0,b(v,y)},i.gzip=function(v,y){return(y=y||{}).gzip=!0,b(v,y)}},{"./utils/common":41,"./utils/strings":42,"./zlib/deflate":46,"./zlib/messages":51,"./zlib/zstream":53}],40:[function(r,n,i){var o=r("./zlib/inflate"),s=r("./utils/common"),a=r("./utils/strings"),c=r("./zlib/constants"),u=r("./zlib/messages"),d=r("./zlib/zstream"),h=r("./zlib/gzheader"),f=Object.prototype.toString;function p(m){if(!(this instanceof p))return new p(m);this.options=s.assign({chunkSize:16384,windowBits:0,to:""},m||{});var b=this.options;b.raw&&0<=b.windowBits&&b.windowBits<16&&(b.windowBits=-b.windowBits,b.windowBits===0&&(b.windowBits=-15)),!(0<=b.windowBits&&b.windowBits<16)||m&&m.windowBits||(b.windowBits+=32),15<b.windowBits&&b.windowBits<48&&!(15&b.windowBits)&&(b.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new d,this.strm.avail_out=0;var v=o.inflateInit2(this.strm,b.windowBits);if(v!==c.Z_OK)throw new Error(u[v]);this.header=new h,o.inflateGetHeader(this.strm,this.header)}function g(m,b){var v=new p(b);if(v.push(m,!0),v.err)throw v.msg||u[v.err];return v.result}p.prototype.push=function(m,b){var v,y,x,S,j,_,C=this.strm,R=this.options.chunkSize,T=this.options.dictionary,P=!1;if(this.ended)return!1;y=b===~~b?b:b===!0?c.Z_FINISH:c.Z_NO_FLUSH,typeof m=="string"?C.input=a.binstring2buf(m):f.call(m)==="[object ArrayBuffer]"?C.input=new Uint8Array(m):C.input=m,C.next_in=0,C.avail_in=C.input.length;do{if(C.avail_out===0&&(C.output=new s.Buf8(R),C.next_out=0,C.avail_out=R),(v=o.inflate(C,c.Z_NO_FLUSH))===c.Z_NEED_DICT&&T&&(_=typeof T=="string"?a.string2buf(T):f.call(T)==="[object ArrayBuffer]"?new Uint8Array(T):T,v=o.inflateSetDictionary(this.strm,_)),v===c.Z_BUF_ERROR&&P===!0&&(v=c.Z_OK,P=!1),v!==c.Z_STREAM_END&&v!==c.Z_OK)return this.onEnd(v),!(this.ended=!0);C.next_out&&(C.avail_out!==0&&v!==c.Z_STREAM_END&&(C.avail_in!==0||y!==c.Z_FINISH&&y!==c.Z_SYNC_FLUSH)||(this.options.to==="string"?(x=a.utf8border(C.output,C.next_out),S=C.next_out-x,j=a.buf2string(C.output,x),C.next_out=S,C.avail_out=R-S,S&&s.arraySet(C.output,C.output,x,S,0),this.onData(j)):this.onData(s.shrinkBuf(C.output,C.next_out)))),C.avail_in===0&&C.avail_out===0&&(P=!0)}while((0<C.avail_in||C.avail_out===0)&&v!==c.Z_STREAM_END);return v===c.Z_STREAM_END&&(y=c.Z_FINISH),y===c.Z_FINISH?(v=o.inflateEnd(this.strm),this.onEnd(v),this.ended=!0,v===c.Z_OK):y!==c.Z_SYNC_FLUSH||(this.onEnd(c.Z_OK),!(C.avail_out=0))},p.prototype.onData=function(m){this.chunks.push(m)},p.prototype.onEnd=function(m){m===c.Z_OK&&(this.options.to==="string"?this.result=this.chunks.join(""):this.result=s.flattenChunks(this.chunks)),this.chunks=[],this.err=m,this.msg=this.strm.msg},i.Inflate=p,i.inflate=g,i.inflateRaw=function(m,b){return(b=b||{}).raw=!0,g(m,b)},i.ungzip=g},{"./utils/common":41,"./utils/strings":42,"./zlib/constants":44,"./zlib/gzheader":47,"./zlib/inflate":49,"./zlib/messages":51,"./zlib/zstream":53}],41:[function(r,n,i){var o=typeof Uint8Array<"u"&&typeof Uint16Array<"u"&&typeof Int32Array<"u";i.assign=function(c){for(var u=Array.prototype.slice.call(arguments,1);u.length;){var d=u.shift();if(d){if(typeof d!="object")throw new TypeError(d+"must be non-object");for(var h in d)d.hasOwnProperty(h)&&(c[h]=d[h])}}return c},i.shrinkBuf=function(c,u){return c.length===u?c:c.subarray?c.subarray(0,u):(c.length=u,c)};var s={arraySet:function(c,u,d,h,f){if(u.subarray&&c.subarray)c.set(u.subarray(d,d+h),f);else for(var p=0;p<h;p++)c[f+p]=u[d+p]},flattenChunks:function(c){var u,d,h,f,p,g;for(u=h=0,d=c.length;u<d;u++)h+=c[u].length;for(g=new Uint8Array(h),u=f=0,d=c.length;u<d;u++)p=c[u],g.set(p,f),f+=p.length;return g}},a={arraySet:function(c,u,d,h,f){for(var p=0;p<h;p++)c[f+p]=u[d+p]},flattenChunks:function(c){return[].concat.apply([],c)}};i.setTyped=function(c){c?(i.Buf8=Uint8Array,i.Buf16=Uint16Array,i.Buf32=Int32Array,i.assign(i,s)):(i.Buf8=Array,i.Buf16=Array,i.Buf32=Array,i.assign(i,a))},i.setTyped(o)},{}],42:[function(r,n,i){var o=r("./common"),s=!0,a=!0;try{String.fromCharCode.apply(null,[0])}catch{s=!1}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch{a=!1}for(var c=new o.Buf8(256),u=0;u<256;u++)c[u]=252<=u?6:248<=u?5:240<=u?4:224<=u?3:192<=u?2:1;function d(h,f){if(f<65537&&(h.subarray&&a||!h.subarray&&s))return String.fromCharCode.apply(null,o.shrinkBuf(h,f));for(var p="",g=0;g<f;g++)p+=String.fromCharCode(h[g]);return p}c[254]=c[254]=1,i.string2buf=function(h){var f,p,g,m,b,v=h.length,y=0;for(m=0;m<v;m++)(64512&(p=h.charCodeAt(m)))==55296&&m+1<v&&(64512&(g=h.charCodeAt(m+1)))==56320&&(p=65536+(p-55296<<10)+(g-56320),m++),y+=p<128?1:p<2048?2:p<65536?3:4;for(f=new o.Buf8(y),m=b=0;b<y;m++)(64512&(p=h.charCodeAt(m)))==55296&&m+1<v&&(64512&(g=h.charCodeAt(m+1)))==56320&&(p=65536+(p-55296<<10)+(g-56320),m++),p<128?f[b++]=p:(p<2048?f[b++]=192|p>>>6:(p<65536?f[b++]=224|p>>>12:(f[b++]=240|p>>>18,f[b++]=128|p>>>12&63),f[b++]=128|p>>>6&63),f[b++]=128|63&p);return f},i.buf2binstring=function(h){return d(h,h.length)},i.binstring2buf=function(h){for(var f=new o.Buf8(h.length),p=0,g=f.length;p<g;p++)f[p]=h.charCodeAt(p);return f},i.buf2string=function(h,f){var p,g,m,b,v=f||h.length,y=new Array(2*v);for(p=g=0;p<v;)if((m=h[p++])<128)y[g++]=m;else if(4<(b=c[m]))y[g++]=65533,p+=b-1;else{for(m&=b===2?31:b===3?15:7;1<b&&p<v;)m=m<<6|63&h[p++],b--;1<b?y[g++]=65533:m<65536?y[g++]=m:(m-=65536,y[g++]=55296|m>>10&1023,y[g++]=56320|1023&m)}return d(y,g)},i.utf8border=function(h,f){var p;for((f=f||h.length)>h.length&&(f=h.length),p=f-1;0<=p&&(192&h[p])==128;)p--;return p<0||p===0?f:p+c[h[p]]>f?p:f}},{"./common":41}],43:[function(r,n,i){n.exports=function(o,s,a,c){for(var u=65535&o|0,d=o>>>16&65535|0,h=0;a!==0;){for(a-=h=2e3<a?2e3:a;d=d+(u=u+s[c++]|0)|0,--h;);u%=65521,d%=65521}return u|d<<16|0}},{}],44:[function(r,n,i){n.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}},{}],45:[function(r,n,i){var o=function(){for(var s,a=[],c=0;c<256;c++){s=c;for(var u=0;u<8;u++)s=1&s?3988292384^s>>>1:s>>>1;a[c]=s}return a}();n.exports=function(s,a,c,u){var d=o,h=u+c;s^=-1;for(var f=u;f<h;f++)s=s>>>8^d[255&(s^a[f])];return-1^s}},{}],46:[function(r,n,i){var o,s=r("../utils/common"),a=r("./trees"),c=r("./adler32"),u=r("./crc32"),d=r("./messages"),h=0,f=4,p=0,g=-2,m=-1,b=4,v=2,y=8,x=9,S=286,j=30,_=19,C=2*S+1,R=15,T=3,P=258,H=P+T+1,E=42,I=113,w=1,z=2,Z=3,q=4;function V(k,re){return k.msg=d[re],re}function A(k){return(k<<1)-(4<k?9:0)}function K(k){for(var re=k.length;0<=--re;)k[re]=0}function L(k){var re=k.state,G=re.pending;G>k.avail_out&&(G=k.avail_out),G!==0&&(s.arraySet(k.output,re.pending_buf,re.pending_out,G,k.next_out),k.next_out+=G,re.pending_out+=G,k.total_out+=G,k.avail_out-=G,re.pending-=G,re.pending===0&&(re.pending_out=0))}function B(k,re){a._tr_flush_block(k,0<=k.block_start?k.block_start:-1,k.strstart-k.block_start,re),k.block_start=k.strstart,L(k.strm)}function fe(k,re){k.pending_buf[k.pending++]=re}function te(k,re){k.pending_buf[k.pending++]=re>>>8&255,k.pending_buf[k.pending++]=255&re}function ae(k,re){var G,O,N=k.max_chain_length,D=k.strstart,Q=k.prev_length,ne=k.nice_match,U=k.strstart>k.w_size-H?k.strstart-(k.w_size-H):0,X=k.window,oe=k.w_mask,J=k.prev,F=k.strstart+P,ee=X[D+Q-1],ie=X[D+Q];k.prev_length>=k.good_match&&(N>>=2),ne>k.lookahead&&(ne=k.lookahead);do if(X[(G=re)+Q]===ie&&X[G+Q-1]===ee&&X[G]===X[D]&&X[++G]===X[D+1]){D+=2,G++;do;while(X[++D]===X[++G]&&X[++D]===X[++G]&&X[++D]===X[++G]&&X[++D]===X[++G]&&X[++D]===X[++G]&&X[++D]===X[++G]&&X[++D]===X[++G]&&X[++D]===X[++G]&&D<F);if(O=P-(F-D),D=F-P,Q<O){if(k.match_start=re,ne<=(Q=O))break;ee=X[D+Q-1],ie=X[D+Q]}}while((re=J[re&oe])>U&&--N!=0);return Q<=k.lookahead?Q:k.lookahead}function ge(k){var re,G,O,N,D,Q,ne,U,X,oe,J=k.w_size;do{if(N=k.window_size-k.lookahead-k.strstart,k.strstart>=J+(J-H)){for(s.arraySet(k.window,k.window,J,J,0),k.match_start-=J,k.strstart-=J,k.block_start-=J,re=G=k.hash_size;O=k.head[--re],k.head[re]=J<=O?O-J:0,--G;);for(re=G=J;O=k.prev[--re],k.prev[re]=J<=O?O-J:0,--G;);N+=J}if(k.strm.avail_in===0)break;if(Q=k.strm,ne=k.window,U=k.strstart+k.lookahead,X=N,oe=void 0,oe=Q.avail_in,X<oe&&(oe=X),G=oe===0?0:(Q.avail_in-=oe,s.arraySet(ne,Q.input,Q.next_in,oe,U),Q.state.wrap===1?Q.adler=c(Q.adler,ne,oe,U):Q.state.wrap===2&&(Q.adler=u(Q.adler,ne,oe,U)),Q.next_in+=oe,Q.total_in+=oe,oe),k.lookahead+=G,k.lookahead+k.insert>=T)for(D=k.strstart-k.insert,k.ins_h=k.window[D],k.ins_h=(k.ins_h<<k.hash_shift^k.window[D+1])&k.hash_mask;k.insert&&(k.ins_h=(k.ins_h<<k.hash_shift^k.window[D+T-1])&k.hash_mask,k.prev[D&k.w_mask]=k.head[k.ins_h],k.head[k.ins_h]=D,D++,k.insert--,!(k.lookahead+k.insert<T)););}while(k.lookahead<H&&k.strm.avail_in!==0)}function je(k,re){for(var G,O;;){if(k.lookahead<H){if(ge(k),k.lookahead<H&&re===h)return w;if(k.lookahead===0)break}if(G=0,k.lookahead>=T&&(k.ins_h=(k.ins_h<<k.hash_shift^k.window[k.strstart+T-1])&k.hash_mask,G=k.prev[k.strstart&k.w_mask]=k.head[k.ins_h],k.head[k.ins_h]=k.strstart),G!==0&&k.strstart-G<=k.w_size-H&&(k.match_length=ae(k,G)),k.match_length>=T)if(O=a._tr_tally(k,k.strstart-k.match_start,k.match_length-T),k.lookahead-=k.match_length,k.match_length<=k.max_lazy_match&&k.lookahead>=T){for(k.match_length--;k.strstart++,k.ins_h=(k.ins_h<<k.hash_shift^k.window[k.strstart+T-1])&k.hash_mask,G=k.prev[k.strstart&k.w_mask]=k.head[k.ins_h],k.head[k.ins_h]=k.strstart,--k.match_length!=0;);k.strstart++}else k.strstart+=k.match_length,k.match_length=0,k.ins_h=k.window[k.strstart],k.ins_h=(k.ins_h<<k.hash_shift^k.window[k.strstart+1])&k.hash_mask;else O=a._tr_tally(k,0,k.window[k.strstart]),k.lookahead--,k.strstart++;if(O&&(B(k,!1),k.strm.avail_out===0))return w}return k.insert=k.strstart<T-1?k.strstart:T-1,re===f?(B(k,!0),k.strm.avail_out===0?Z:q):k.last_lit&&(B(k,!1),k.strm.avail_out===0)?w:z}function me(k,re){for(var G,O,N;;){if(k.lookahead<H){if(ge(k),k.lookahead<H&&re===h)return w;if(k.lookahead===0)break}if(G=0,k.lookahead>=T&&(k.ins_h=(k.ins_h<<k.hash_shift^k.window[k.strstart+T-1])&k.hash_mask,G=k.prev[k.strstart&k.w_mask]=k.head[k.ins_h],k.head[k.ins_h]=k.strstart),k.prev_length=k.match_length,k.prev_match=k.match_start,k.match_length=T-1,G!==0&&k.prev_length<k.max_lazy_match&&k.strstart-G<=k.w_size-H&&(k.match_length=ae(k,G),k.match_length<=5&&(k.strategy===1||k.match_length===T&&4096<k.strstart-k.match_start)&&(k.match_length=T-1)),k.prev_length>=T&&k.match_length<=k.prev_length){for(N=k.strstart+k.lookahead-T,O=a._tr_tally(k,k.strstart-1-k.prev_match,k.prev_length-T),k.lookahead-=k.prev_length-1,k.prev_length-=2;++k.strstart<=N&&(k.ins_h=(k.ins_h<<k.hash_shift^k.window[k.strstart+T-1])&k.hash_mask,G=k.prev[k.strstart&k.w_mask]=k.head[k.ins_h],k.head[k.ins_h]=k.strstart),--k.prev_length!=0;);if(k.match_available=0,k.match_length=T-1,k.strstart++,O&&(B(k,!1),k.strm.avail_out===0))return w}else if(k.match_available){if((O=a._tr_tally(k,0,k.window[k.strstart-1]))&&B(k,!1),k.strstart++,k.lookahead--,k.strm.avail_out===0)return w}else k.match_available=1,k.strstart++,k.lookahead--}return k.match_available&&(O=a._tr_tally(k,0,k.window[k.strstart-1]),k.match_available=0),k.insert=k.strstart<T-1?k.strstart:T-1,re===f?(B(k,!0),k.strm.avail_out===0?Z:q):k.last_lit&&(B(k,!1),k.strm.avail_out===0)?w:z}function be(k,re,G,O,N){this.good_length=k,this.max_lazy=re,this.nice_length=G,this.max_chain=O,this.func=N}function Ue(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=y,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new s.Buf16(2*C),this.dyn_dtree=new s.Buf16(2*(2*j+1)),this.bl_tree=new s.Buf16(2*(2*_+1)),K(this.dyn_ltree),K(this.dyn_dtree),K(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new s.Buf16(R+1),this.heap=new s.Buf16(2*S+1),K(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new s.Buf16(2*S+1),K(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}function We(k){var re;return k&&k.state?(k.total_in=k.total_out=0,k.data_type=v,(re=k.state).pending=0,re.pending_out=0,re.wrap<0&&(re.wrap=-re.wrap),re.status=re.wrap?E:I,k.adler=re.wrap===2?0:1,re.last_flush=h,a._tr_init(re),p):V(k,g)}function bt(k){var re=We(k);return re===p&&function(G){G.window_size=2*G.w_size,K(G.head),G.max_lazy_match=o[G.level].max_lazy,G.good_match=o[G.level].good_length,G.nice_match=o[G.level].nice_length,G.max_chain_length=o[G.level].max_chain,G.strstart=0,G.block_start=0,G.lookahead=0,G.insert=0,G.match_length=G.prev_length=T-1,G.match_available=0,G.ins_h=0}(k.state),re}function et(k,re,G,O,N,D){if(!k)return g;var Q=1;if(re===m&&(re=6),O<0?(Q=0,O=-O):15<O&&(Q=2,O-=16),N<1||x<N||G!==y||O<8||15<O||re<0||9<re||D<0||b<D)return V(k,g);O===8&&(O=9);var ne=new Ue;return(k.state=ne).strm=k,ne.wrap=Q,ne.gzhead=null,ne.w_bits=O,ne.w_size=1<<ne.w_bits,ne.w_mask=ne.w_size-1,ne.hash_bits=N+7,ne.hash_size=1<<ne.hash_bits,ne.hash_mask=ne.hash_size-1,ne.hash_shift=~~((ne.hash_bits+T-1)/T),ne.window=new s.Buf8(2*ne.w_size),ne.head=new s.Buf16(ne.hash_size),ne.prev=new s.Buf16(ne.w_size),ne.lit_bufsize=1<<N+6,ne.pending_buf_size=4*ne.lit_bufsize,ne.pending_buf=new s.Buf8(ne.pending_buf_size),ne.d_buf=1*ne.lit_bufsize,ne.l_buf=3*ne.lit_bufsize,ne.level=re,ne.strategy=D,ne.method=G,bt(k)}o=[new be(0,0,0,0,function(k,re){var G=65535;for(G>k.pending_buf_size-5&&(G=k.pending_buf_size-5);;){if(k.lookahead<=1){if(ge(k),k.lookahead===0&&re===h)return w;if(k.lookahead===0)break}k.strstart+=k.lookahead,k.lookahead=0;var O=k.block_start+G;if((k.strstart===0||k.strstart>=O)&&(k.lookahead=k.strstart-O,k.strstart=O,B(k,!1),k.strm.avail_out===0)||k.strstart-k.block_start>=k.w_size-H&&(B(k,!1),k.strm.avail_out===0))return w}return k.insert=0,re===f?(B(k,!0),k.strm.avail_out===0?Z:q):(k.strstart>k.block_start&&(B(k,!1),k.strm.avail_out),w)}),new be(4,4,8,4,je),new be(4,5,16,8,je),new be(4,6,32,32,je),new be(4,4,16,16,me),new be(8,16,32,32,me),new be(8,16,128,128,me),new be(8,32,128,256,me),new be(32,128,258,1024,me),new be(32,258,258,4096,me)],i.deflateInit=function(k,re){return et(k,re,y,15,8,0)},i.deflateInit2=et,i.deflateReset=bt,i.deflateResetKeep=We,i.deflateSetHeader=function(k,re){return k&&k.state?k.state.wrap!==2?g:(k.state.gzhead=re,p):g},i.deflate=function(k,re){var G,O,N,D;if(!k||!k.state||5<re||re<0)return k?V(k,g):g;if(O=k.state,!k.output||!k.input&&k.avail_in!==0||O.status===666&&re!==f)return V(k,k.avail_out===0?-5:g);if(O.strm=k,G=O.last_flush,O.last_flush=re,O.status===E)if(O.wrap===2)k.adler=0,fe(O,31),fe(O,139),fe(O,8),O.gzhead?(fe(O,(O.gzhead.text?1:0)+(O.gzhead.hcrc?2:0)+(O.gzhead.extra?4:0)+(O.gzhead.name?8:0)+(O.gzhead.comment?16:0)),fe(O,255&O.gzhead.time),fe(O,O.gzhead.time>>8&255),fe(O,O.gzhead.time>>16&255),fe(O,O.gzhead.time>>24&255),fe(O,O.level===9?2:2<=O.strategy||O.level<2?4:0),fe(O,255&O.gzhead.os),O.gzhead.extra&&O.gzhead.extra.length&&(fe(O,255&O.gzhead.extra.length),fe(O,O.gzhead.extra.length>>8&255)),O.gzhead.hcrc&&(k.adler=u(k.adler,O.pending_buf,O.pending,0)),O.gzindex=0,O.status=69):(fe(O,0),fe(O,0),fe(O,0),fe(O,0),fe(O,0),fe(O,O.level===9?2:2<=O.strategy||O.level<2?4:0),fe(O,3),O.status=I);else{var Q=y+(O.w_bits-8<<4)<<8;Q|=(2<=O.strategy||O.level<2?0:O.level<6?1:O.level===6?2:3)<<6,O.strstart!==0&&(Q|=32),Q+=31-Q%31,O.status=I,te(O,Q),O.strstart!==0&&(te(O,k.adler>>>16),te(O,65535&k.adler)),k.adler=1}if(O.status===69)if(O.gzhead.extra){for(N=O.pending;O.gzindex<(65535&O.gzhead.extra.length)&&(O.pending!==O.pending_buf_size||(O.gzhead.hcrc&&O.pending>N&&(k.adler=u(k.adler,O.pending_buf,O.pending-N,N)),L(k),N=O.pending,O.pending!==O.pending_buf_size));)fe(O,255&O.gzhead.extra[O.gzindex]),O.gzindex++;O.gzhead.hcrc&&O.pending>N&&(k.adler=u(k.adler,O.pending_buf,O.pending-N,N)),O.gzindex===O.gzhead.extra.length&&(O.gzindex=0,O.status=73)}else O.status=73;if(O.status===73)if(O.gzhead.name){N=O.pending;do{if(O.pending===O.pending_buf_size&&(O.gzhead.hcrc&&O.pending>N&&(k.adler=u(k.adler,O.pending_buf,O.pending-N,N)),L(k),N=O.pending,O.pending===O.pending_buf_size)){D=1;break}D=O.gzindex<O.gzhead.name.length?255&O.gzhead.name.charCodeAt(O.gzindex++):0,fe(O,D)}while(D!==0);O.gzhead.hcrc&&O.pending>N&&(k.adler=u(k.adler,O.pending_buf,O.pending-N,N)),D===0&&(O.gzindex=0,O.status=91)}else O.status=91;if(O.status===91)if(O.gzhead.comment){N=O.pending;do{if(O.pending===O.pending_buf_size&&(O.gzhead.hcrc&&O.pending>N&&(k.adler=u(k.adler,O.pending_buf,O.pending-N,N)),L(k),N=O.pending,O.pending===O.pending_buf_size)){D=1;break}D=O.gzindex<O.gzhead.comment.length?255&O.gzhead.comment.charCodeAt(O.gzindex++):0,fe(O,D)}while(D!==0);O.gzhead.hcrc&&O.pending>N&&(k.adler=u(k.adler,O.pending_buf,O.pending-N,N)),D===0&&(O.status=103)}else O.status=103;if(O.status===103&&(O.gzhead.hcrc?(O.pending+2>O.pending_buf_size&&L(k),O.pending+2<=O.pending_buf_size&&(fe(O,255&k.adler),fe(O,k.adler>>8&255),k.adler=0,O.status=I)):O.status=I),O.pending!==0){if(L(k),k.avail_out===0)return O.last_flush=-1,p}else if(k.avail_in===0&&A(re)<=A(G)&&re!==f)return V(k,-5);if(O.status===666&&k.avail_in!==0)return V(k,-5);if(k.avail_in!==0||O.lookahead!==0||re!==h&&O.status!==666){var ne=O.strategy===2?function(U,X){for(var oe;;){if(U.lookahead===0&&(ge(U),U.lookahead===0)){if(X===h)return w;break}if(U.match_length=0,oe=a._tr_tally(U,0,U.window[U.strstart]),U.lookahead--,U.strstart++,oe&&(B(U,!1),U.strm.avail_out===0))return w}return U.insert=0,X===f?(B(U,!0),U.strm.avail_out===0?Z:q):U.last_lit&&(B(U,!1),U.strm.avail_out===0)?w:z}(O,re):O.strategy===3?function(U,X){for(var oe,J,F,ee,ie=U.window;;){if(U.lookahead<=P){if(ge(U),U.lookahead<=P&&X===h)return w;if(U.lookahead===0)break}if(U.match_length=0,U.lookahead>=T&&0<U.strstart&&(J=ie[F=U.strstart-1])===ie[++F]&&J===ie[++F]&&J===ie[++F]){ee=U.strstart+P;do;while(J===ie[++F]&&J===ie[++F]&&J===ie[++F]&&J===ie[++F]&&J===ie[++F]&&J===ie[++F]&&J===ie[++F]&&J===ie[++F]&&F<ee);U.match_length=P-(ee-F),U.match_length>U.lookahead&&(U.match_length=U.lookahead)}if(U.match_length>=T?(oe=a._tr_tally(U,1,U.match_length-T),U.lookahead-=U.match_length,U.strstart+=U.match_length,U.match_length=0):(oe=a._tr_tally(U,0,U.window[U.strstart]),U.lookahead--,U.strstart++),oe&&(B(U,!1),U.strm.avail_out===0))return w}return U.insert=0,X===f?(B(U,!0),U.strm.avail_out===0?Z:q):U.last_lit&&(B(U,!1),U.strm.avail_out===0)?w:z}(O,re):o[O.level].func(O,re);if(ne!==Z&&ne!==q||(O.status=666),ne===w||ne===Z)return k.avail_out===0&&(O.last_flush=-1),p;if(ne===z&&(re===1?a._tr_align(O):re!==5&&(a._tr_stored_block(O,0,0,!1),re===3&&(K(O.head),O.lookahead===0&&(O.strstart=0,O.block_start=0,O.insert=0))),L(k),k.avail_out===0))return O.last_flush=-1,p}return re!==f?p:O.wrap<=0?1:(O.wrap===2?(fe(O,255&k.adler),fe(O,k.adler>>8&255),fe(O,k.adler>>16&255),fe(O,k.adler>>24&255),fe(O,255&k.total_in),fe(O,k.total_in>>8&255),fe(O,k.total_in>>16&255),fe(O,k.total_in>>24&255)):(te(O,k.adler>>>16),te(O,65535&k.adler)),L(k),0<O.wrap&&(O.wrap=-O.wrap),O.pending!==0?p:1)},i.deflateEnd=function(k){var re;return k&&k.state?(re=k.state.status)!==E&&re!==69&&re!==73&&re!==91&&re!==103&&re!==I&&re!==666?V(k,g):(k.state=null,re===I?V(k,-3):p):g},i.deflateSetDictionary=function(k,re){var G,O,N,D,Q,ne,U,X,oe=re.length;if(!k||!k.state||(D=(G=k.state).wrap)===2||D===1&&G.status!==E||G.lookahead)return g;for(D===1&&(k.adler=c(k.adler,re,oe,0)),G.wrap=0,oe>=G.w_size&&(D===0&&(K(G.head),G.strstart=0,G.block_start=0,G.insert=0),X=new s.Buf8(G.w_size),s.arraySet(X,re,oe-G.w_size,G.w_size,0),re=X,oe=G.w_size),Q=k.avail_in,ne=k.next_in,U=k.input,k.avail_in=oe,k.next_in=0,k.input=re,ge(G);G.lookahead>=T;){for(O=G.strstart,N=G.lookahead-(T-1);G.ins_h=(G.ins_h<<G.hash_shift^G.window[O+T-1])&G.hash_mask,G.prev[O&G.w_mask]=G.head[G.ins_h],G.head[G.ins_h]=O,O++,--N;);G.strstart=O,G.lookahead=T-1,ge(G)}return G.strstart+=G.lookahead,G.block_start=G.strstart,G.insert=G.lookahead,G.lookahead=0,G.match_length=G.prev_length=T-1,G.match_available=0,k.next_in=ne,k.input=U,k.avail_in=Q,G.wrap=D,p},i.deflateInfo="pako deflate (from Nodeca project)"},{"../utils/common":41,"./adler32":43,"./crc32":45,"./messages":51,"./trees":52}],47:[function(r,n,i){n.exports=function(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1}},{}],48:[function(r,n,i){n.exports=function(o,s){var a,c,u,d,h,f,p,g,m,b,v,y,x,S,j,_,C,R,T,P,H,E,I,w,z;a=o.state,c=o.next_in,w=o.input,u=c+(o.avail_in-5),d=o.next_out,z=o.output,h=d-(s-o.avail_out),f=d+(o.avail_out-257),p=a.dmax,g=a.wsize,m=a.whave,b=a.wnext,v=a.window,y=a.hold,x=a.bits,S=a.lencode,j=a.distcode,_=(1<<a.lenbits)-1,C=(1<<a.distbits)-1;e:do{x<15&&(y+=w[c++]<<x,x+=8,y+=w[c++]<<x,x+=8),R=S[y&_];t:for(;;){if(y>>>=T=R>>>24,x-=T,(T=R>>>16&255)===0)z[d++]=65535&R;else{if(!(16&T)){if(!(64&T)){R=S[(65535&R)+(y&(1<<T)-1)];continue t}if(32&T){a.mode=12;break e}o.msg="invalid literal/length code",a.mode=30;break e}P=65535&R,(T&=15)&&(x<T&&(y+=w[c++]<<x,x+=8),P+=y&(1<<T)-1,y>>>=T,x-=T),x<15&&(y+=w[c++]<<x,x+=8,y+=w[c++]<<x,x+=8),R=j[y&C];r:for(;;){if(y>>>=T=R>>>24,x-=T,!(16&(T=R>>>16&255))){if(!(64&T)){R=j[(65535&R)+(y&(1<<T)-1)];continue r}o.msg="invalid distance code",a.mode=30;break e}if(H=65535&R,x<(T&=15)&&(y+=w[c++]<<x,(x+=8)<T&&(y+=w[c++]<<x,x+=8)),p<(H+=y&(1<<T)-1)){o.msg="invalid distance too far back",a.mode=30;break e}if(y>>>=T,x-=T,(T=d-h)<H){if(m<(T=H-T)&&a.sane){o.msg="invalid distance too far back",a.mode=30;break e}if(I=v,(E=0)===b){if(E+=g-T,T<P){for(P-=T;z[d++]=v[E++],--T;);E=d-H,I=z}}else if(b<T){if(E+=g+b-T,(T-=b)<P){for(P-=T;z[d++]=v[E++],--T;);if(E=0,b<P){for(P-=T=b;z[d++]=v[E++],--T;);E=d-H,I=z}}}else if(E+=b-T,T<P){for(P-=T;z[d++]=v[E++],--T;);E=d-H,I=z}for(;2<P;)z[d++]=I[E++],z[d++]=I[E++],z[d++]=I[E++],P-=3;P&&(z[d++]=I[E++],1<P&&(z[d++]=I[E++]))}else{for(E=d-H;z[d++]=z[E++],z[d++]=z[E++],z[d++]=z[E++],2<(P-=3););P&&(z[d++]=z[E++],1<P&&(z[d++]=z[E++]))}break}}break}}while(c<u&&d<f);c-=P=x>>3,y&=(1<<(x-=P<<3))-1,o.next_in=c,o.next_out=d,o.avail_in=c<u?u-c+5:5-(c-u),o.avail_out=d<f?f-d+257:257-(d-f),a.hold=y,a.bits=x}},{}],49:[function(r,n,i){var o=r("../utils/common"),s=r("./adler32"),a=r("./crc32"),c=r("./inffast"),u=r("./inftrees"),d=1,h=2,f=0,p=-2,g=1,m=852,b=592;function v(E){return(E>>>24&255)+(E>>>8&65280)+((65280&E)<<8)+((255&E)<<24)}function y(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new o.Buf16(320),this.work=new o.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function x(E){var I;return E&&E.state?(I=E.state,E.total_in=E.total_out=I.total=0,E.msg="",I.wrap&&(E.adler=1&I.wrap),I.mode=g,I.last=0,I.havedict=0,I.dmax=32768,I.head=null,I.hold=0,I.bits=0,I.lencode=I.lendyn=new o.Buf32(m),I.distcode=I.distdyn=new o.Buf32(b),I.sane=1,I.back=-1,f):p}function S(E){var I;return E&&E.state?((I=E.state).wsize=0,I.whave=0,I.wnext=0,x(E)):p}function j(E,I){var w,z;return E&&E.state?(z=E.state,I<0?(w=0,I=-I):(w=1+(I>>4),I<48&&(I&=15)),I&&(I<8||15<I)?p:(z.window!==null&&z.wbits!==I&&(z.window=null),z.wrap=w,z.wbits=I,S(E))):p}function _(E,I){var w,z;return E?(z=new y,(E.state=z).window=null,(w=j(E,I))!==f&&(E.state=null),w):p}var C,R,T=!0;function P(E){if(T){var I;for(C=new o.Buf32(512),R=new o.Buf32(32),I=0;I<144;)E.lens[I++]=8;for(;I<256;)E.lens[I++]=9;for(;I<280;)E.lens[I++]=7;for(;I<288;)E.lens[I++]=8;for(u(d,E.lens,0,288,C,0,E.work,{bits:9}),I=0;I<32;)E.lens[I++]=5;u(h,E.lens,0,32,R,0,E.work,{bits:5}),T=!1}E.lencode=C,E.lenbits=9,E.distcode=R,E.distbits=5}function H(E,I,w,z){var Z,q=E.state;return q.window===null&&(q.wsize=1<<q.wbits,q.wnext=0,q.whave=0,q.window=new o.Buf8(q.wsize)),z>=q.wsize?(o.arraySet(q.window,I,w-q.wsize,q.wsize,0),q.wnext=0,q.whave=q.wsize):(z<(Z=q.wsize-q.wnext)&&(Z=z),o.arraySet(q.window,I,w-z,Z,q.wnext),(z-=Z)?(o.arraySet(q.window,I,w-z,z,0),q.wnext=z,q.whave=q.wsize):(q.wnext+=Z,q.wnext===q.wsize&&(q.wnext=0),q.whave<q.wsize&&(q.whave+=Z))),0}i.inflateReset=S,i.inflateReset2=j,i.inflateResetKeep=x,i.inflateInit=function(E){return _(E,15)},i.inflateInit2=_,i.inflate=function(E,I){var w,z,Z,q,V,A,K,L,B,fe,te,ae,ge,je,me,be,Ue,We,bt,et,k,re,G,O,N=0,D=new o.Buf8(4),Q=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!E||!E.state||!E.output||!E.input&&E.avail_in!==0)return p;(w=E.state).mode===12&&(w.mode=13),V=E.next_out,Z=E.output,K=E.avail_out,q=E.next_in,z=E.input,A=E.avail_in,L=w.hold,B=w.bits,fe=A,te=K,re=f;e:for(;;)switch(w.mode){case g:if(w.wrap===0){w.mode=13;break}for(;B<16;){if(A===0)break e;A--,L+=z[q++]<<B,B+=8}if(2&w.wrap&&L===35615){D[w.check=0]=255&L,D[1]=L>>>8&255,w.check=a(w.check,D,2,0),B=L=0,w.mode=2;break}if(w.flags=0,w.head&&(w.head.done=!1),!(1&w.wrap)||(((255&L)<<8)+(L>>8))%31){E.msg="incorrect header check",w.mode=30;break}if((15&L)!=8){E.msg="unknown compression method",w.mode=30;break}if(B-=4,k=8+(15&(L>>>=4)),w.wbits===0)w.wbits=k;else if(k>w.wbits){E.msg="invalid window size",w.mode=30;break}w.dmax=1<<k,E.adler=w.check=1,w.mode=512&L?10:12,B=L=0;break;case 2:for(;B<16;){if(A===0)break e;A--,L+=z[q++]<<B,B+=8}if(w.flags=L,(255&w.flags)!=8){E.msg="unknown compression method",w.mode=30;break}if(57344&w.flags){E.msg="unknown header flags set",w.mode=30;break}w.head&&(w.head.text=L>>8&1),512&w.flags&&(D[0]=255&L,D[1]=L>>>8&255,w.check=a(w.check,D,2,0)),B=L=0,w.mode=3;case 3:for(;B<32;){if(A===0)break e;A--,L+=z[q++]<<B,B+=8}w.head&&(w.head.time=L),512&w.flags&&(D[0]=255&L,D[1]=L>>>8&255,D[2]=L>>>16&255,D[3]=L>>>24&255,w.check=a(w.check,D,4,0)),B=L=0,w.mode=4;case 4:for(;B<16;){if(A===0)break e;A--,L+=z[q++]<<B,B+=8}w.head&&(w.head.xflags=255&L,w.head.os=L>>8),512&w.flags&&(D[0]=255&L,D[1]=L>>>8&255,w.check=a(w.check,D,2,0)),B=L=0,w.mode=5;case 5:if(1024&w.flags){for(;B<16;){if(A===0)break e;A--,L+=z[q++]<<B,B+=8}w.length=L,w.head&&(w.head.extra_len=L),512&w.flags&&(D[0]=255&L,D[1]=L>>>8&255,w.check=a(w.check,D,2,0)),B=L=0}else w.head&&(w.head.extra=null);w.mode=6;case 6:if(1024&w.flags&&(A<(ae=w.length)&&(ae=A),ae&&(w.head&&(k=w.head.extra_len-w.length,w.head.extra||(w.head.extra=new Array(w.head.extra_len)),o.arraySet(w.head.extra,z,q,ae,k)),512&w.flags&&(w.check=a(w.check,z,ae,q)),A-=ae,q+=ae,w.length-=ae),w.length))break e;w.length=0,w.mode=7;case 7:if(2048&w.flags){if(A===0)break e;for(ae=0;k=z[q+ae++],w.head&&k&&w.length<65536&&(w.head.name+=String.fromCharCode(k)),k&&ae<A;);if(512&w.flags&&(w.check=a(w.check,z,ae,q)),A-=ae,q+=ae,k)break e}else w.head&&(w.head.name=null);w.length=0,w.mode=8;case 8:if(4096&w.flags){if(A===0)break e;for(ae=0;k=z[q+ae++],w.head&&k&&w.length<65536&&(w.head.comment+=String.fromCharCode(k)),k&&ae<A;);if(512&w.flags&&(w.check=a(w.check,z,ae,q)),A-=ae,q+=ae,k)break e}else w.head&&(w.head.comment=null);w.mode=9;case 9:if(512&w.flags){for(;B<16;){if(A===0)break e;A--,L+=z[q++]<<B,B+=8}if(L!==(65535&w.check)){E.msg="header crc mismatch",w.mode=30;break}B=L=0}w.head&&(w.head.hcrc=w.flags>>9&1,w.head.done=!0),E.adler=w.check=0,w.mode=12;break;case 10:for(;B<32;){if(A===0)break e;A--,L+=z[q++]<<B,B+=8}E.adler=w.check=v(L),B=L=0,w.mode=11;case 11:if(w.havedict===0)return E.next_out=V,E.avail_out=K,E.next_in=q,E.avail_in=A,w.hold=L,w.bits=B,2;E.adler=w.check=1,w.mode=12;case 12:if(I===5||I===6)break e;case 13:if(w.last){L>>>=7&B,B-=7&B,w.mode=27;break}for(;B<3;){if(A===0)break e;A--,L+=z[q++]<<B,B+=8}switch(w.last=1&L,B-=1,3&(L>>>=1)){case 0:w.mode=14;break;case 1:if(P(w),w.mode=20,I!==6)break;L>>>=2,B-=2;break e;case 2:w.mode=17;break;case 3:E.msg="invalid block type",w.mode=30}L>>>=2,B-=2;break;case 14:for(L>>>=7&B,B-=7&B;B<32;){if(A===0)break e;A--,L+=z[q++]<<B,B+=8}if((65535&L)!=(L>>>16^65535)){E.msg="invalid stored block lengths",w.mode=30;break}if(w.length=65535&L,B=L=0,w.mode=15,I===6)break e;case 15:w.mode=16;case 16:if(ae=w.length){if(A<ae&&(ae=A),K<ae&&(ae=K),ae===0)break e;o.arraySet(Z,z,q,ae,V),A-=ae,q+=ae,K-=ae,V+=ae,w.length-=ae;break}w.mode=12;break;case 17:for(;B<14;){if(A===0)break e;A--,L+=z[q++]<<B,B+=8}if(w.nlen=257+(31&L),L>>>=5,B-=5,w.ndist=1+(31&L),L>>>=5,B-=5,w.ncode=4+(15&L),L>>>=4,B-=4,286<w.nlen||30<w.ndist){E.msg="too many length or distance symbols",w.mode=30;break}w.have=0,w.mode=18;case 18:for(;w.have<w.ncode;){for(;B<3;){if(A===0)break e;A--,L+=z[q++]<<B,B+=8}w.lens[Q[w.have++]]=7&L,L>>>=3,B-=3}for(;w.have<19;)w.lens[Q[w.have++]]=0;if(w.lencode=w.lendyn,w.lenbits=7,G={bits:w.lenbits},re=u(0,w.lens,0,19,w.lencode,0,w.work,G),w.lenbits=G.bits,re){E.msg="invalid code lengths set",w.mode=30;break}w.have=0,w.mode=19;case 19:for(;w.have<w.nlen+w.ndist;){for(;be=(N=w.lencode[L&(1<<w.lenbits)-1])>>>16&255,Ue=65535&N,!((me=N>>>24)<=B);){if(A===0)break e;A--,L+=z[q++]<<B,B+=8}if(Ue<16)L>>>=me,B-=me,w.lens[w.have++]=Ue;else{if(Ue===16){for(O=me+2;B<O;){if(A===0)break e;A--,L+=z[q++]<<B,B+=8}if(L>>>=me,B-=me,w.have===0){E.msg="invalid bit length repeat",w.mode=30;break}k=w.lens[w.have-1],ae=3+(3&L),L>>>=2,B-=2}else if(Ue===17){for(O=me+3;B<O;){if(A===0)break e;A--,L+=z[q++]<<B,B+=8}B-=me,k=0,ae=3+(7&(L>>>=me)),L>>>=3,B-=3}else{for(O=me+7;B<O;){if(A===0)break e;A--,L+=z[q++]<<B,B+=8}B-=me,k=0,ae=11+(127&(L>>>=me)),L>>>=7,B-=7}if(w.have+ae>w.nlen+w.ndist){E.msg="invalid bit length repeat",w.mode=30;break}for(;ae--;)w.lens[w.have++]=k}}if(w.mode===30)break;if(w.lens[256]===0){E.msg="invalid code -- missing end-of-block",w.mode=30;break}if(w.lenbits=9,G={bits:w.lenbits},re=u(d,w.lens,0,w.nlen,w.lencode,0,w.work,G),w.lenbits=G.bits,re){E.msg="invalid literal/lengths set",w.mode=30;break}if(w.distbits=6,w.distcode=w.distdyn,G={bits:w.distbits},re=u(h,w.lens,w.nlen,w.ndist,w.distcode,0,w.work,G),w.distbits=G.bits,re){E.msg="invalid distances set",w.mode=30;break}if(w.mode=20,I===6)break e;case 20:w.mode=21;case 21:if(6<=A&&258<=K){E.next_out=V,E.avail_out=K,E.next_in=q,E.avail_in=A,w.hold=L,w.bits=B,c(E,te),V=E.next_out,Z=E.output,K=E.avail_out,q=E.next_in,z=E.input,A=E.avail_in,L=w.hold,B=w.bits,w.mode===12&&(w.back=-1);break}for(w.back=0;be=(N=w.lencode[L&(1<<w.lenbits)-1])>>>16&255,Ue=65535&N,!((me=N>>>24)<=B);){if(A===0)break e;A--,L+=z[q++]<<B,B+=8}if(be&&!(240&be)){for(We=me,bt=be,et=Ue;be=(N=w.lencode[et+((L&(1<<We+bt)-1)>>We)])>>>16&255,Ue=65535&N,!(We+(me=N>>>24)<=B);){if(A===0)break e;A--,L+=z[q++]<<B,B+=8}L>>>=We,B-=We,w.back+=We}if(L>>>=me,B-=me,w.back+=me,w.length=Ue,be===0){w.mode=26;break}if(32&be){w.back=-1,w.mode=12;break}if(64&be){E.msg="invalid literal/length code",w.mode=30;break}w.extra=15&be,w.mode=22;case 22:if(w.extra){for(O=w.extra;B<O;){if(A===0)break e;A--,L+=z[q++]<<B,B+=8}w.length+=L&(1<<w.extra)-1,L>>>=w.extra,B-=w.extra,w.back+=w.extra}w.was=w.length,w.mode=23;case 23:for(;be=(N=w.distcode[L&(1<<w.distbits)-1])>>>16&255,Ue=65535&N,!((me=N>>>24)<=B);){if(A===0)break e;A--,L+=z[q++]<<B,B+=8}if(!(240&be)){for(We=me,bt=be,et=Ue;be=(N=w.distcode[et+((L&(1<<We+bt)-1)>>We)])>>>16&255,Ue=65535&N,!(We+(me=N>>>24)<=B);){if(A===0)break e;A--,L+=z[q++]<<B,B+=8}L>>>=We,B-=We,w.back+=We}if(L>>>=me,B-=me,w.back+=me,64&be){E.msg="invalid distance code",w.mode=30;break}w.offset=Ue,w.extra=15&be,w.mode=24;case 24:if(w.extra){for(O=w.extra;B<O;){if(A===0)break e;A--,L+=z[q++]<<B,B+=8}w.offset+=L&(1<<w.extra)-1,L>>>=w.extra,B-=w.extra,w.back+=w.extra}if(w.offset>w.dmax){E.msg="invalid distance too far back",w.mode=30;break}w.mode=25;case 25:if(K===0)break e;if(ae=te-K,w.offset>ae){if((ae=w.offset-ae)>w.whave&&w.sane){E.msg="invalid distance too far back",w.mode=30;break}ge=ae>w.wnext?(ae-=w.wnext,w.wsize-ae):w.wnext-ae,ae>w.length&&(ae=w.length),je=w.window}else je=Z,ge=V-w.offset,ae=w.length;for(K<ae&&(ae=K),K-=ae,w.length-=ae;Z[V++]=je[ge++],--ae;);w.length===0&&(w.mode=21);break;case 26:if(K===0)break e;Z[V++]=w.length,K--,w.mode=21;break;case 27:if(w.wrap){for(;B<32;){if(A===0)break e;A--,L|=z[q++]<<B,B+=8}if(te-=K,E.total_out+=te,w.total+=te,te&&(E.adler=w.check=w.flags?a(w.check,Z,te,V-te):s(w.check,Z,te,V-te)),te=K,(w.flags?L:v(L))!==w.check){E.msg="incorrect data check",w.mode=30;break}B=L=0}w.mode=28;case 28:if(w.wrap&&w.flags){for(;B<32;){if(A===0)break e;A--,L+=z[q++]<<B,B+=8}if(L!==(4294967295&w.total)){E.msg="incorrect length check",w.mode=30;break}B=L=0}w.mode=29;case 29:re=1;break e;case 30:re=-3;break e;case 31:return-4;case 32:default:return p}return E.next_out=V,E.avail_out=K,E.next_in=q,E.avail_in=A,w.hold=L,w.bits=B,(w.wsize||te!==E.avail_out&&w.mode<30&&(w.mode<27||I!==4))&&H(E,E.output,E.next_out,te-E.avail_out)?(w.mode=31,-4):(fe-=E.avail_in,te-=E.avail_out,E.total_in+=fe,E.total_out+=te,w.total+=te,w.wrap&&te&&(E.adler=w.check=w.flags?a(w.check,Z,te,E.next_out-te):s(w.check,Z,te,E.next_out-te)),E.data_type=w.bits+(w.last?64:0)+(w.mode===12?128:0)+(w.mode===20||w.mode===15?256:0),(fe==0&&te===0||I===4)&&re===f&&(re=-5),re)},i.inflateEnd=function(E){if(!E||!E.state)return p;var I=E.state;return I.window&&(I.window=null),E.state=null,f},i.inflateGetHeader=function(E,I){var w;return E&&E.state&&2&(w=E.state).wrap?((w.head=I).done=!1,f):p},i.inflateSetDictionary=function(E,I){var w,z=I.length;return E&&E.state?(w=E.state).wrap!==0&&w.mode!==11?p:w.mode===11&&s(1,I,z,0)!==w.check?-3:H(E,I,z,z)?(w.mode=31,-4):(w.havedict=1,f):p},i.inflateInfo="pako inflate (from Nodeca project)"},{"../utils/common":41,"./adler32":43,"./crc32":45,"./inffast":48,"./inftrees":50}],50:[function(r,n,i){var o=r("../utils/common"),s=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],a=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],c=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],u=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];n.exports=function(d,h,f,p,g,m,b,v){var y,x,S,j,_,C,R,T,P,H=v.bits,E=0,I=0,w=0,z=0,Z=0,q=0,V=0,A=0,K=0,L=0,B=null,fe=0,te=new o.Buf16(16),ae=new o.Buf16(16),ge=null,je=0;for(E=0;E<=15;E++)te[E]=0;for(I=0;I<p;I++)te[h[f+I]]++;for(Z=H,z=15;1<=z&&te[z]===0;z--);if(z<Z&&(Z=z),z===0)return g[m++]=20971520,g[m++]=20971520,v.bits=1,0;for(w=1;w<z&&te[w]===0;w++);for(Z<w&&(Z=w),E=A=1;E<=15;E++)if(A<<=1,(A-=te[E])<0)return-1;if(0<A&&(d===0||z!==1))return-1;for(ae[1]=0,E=1;E<15;E++)ae[E+1]=ae[E]+te[E];for(I=0;I<p;I++)h[f+I]!==0&&(b[ae[h[f+I]]++]=I);if(C=d===0?(B=ge=b,19):d===1?(B=s,fe-=257,ge=a,je-=257,256):(B=c,ge=u,-1),E=w,_=m,V=I=L=0,S=-1,j=(K=1<<(q=Z))-1,d===1&&852<K||d===2&&592<K)return 1;for(;;){for(R=E-V,P=b[I]<C?(T=0,b[I]):b[I]>C?(T=ge[je+b[I]],B[fe+b[I]]):(T=96,0),y=1<<E-V,w=x=1<<q;g[_+(L>>V)+(x-=y)]=R<<24|T<<16|P|0,x!==0;);for(y=1<<E-1;L&y;)y>>=1;if(y!==0?(L&=y-1,L+=y):L=0,I++,--te[E]==0){if(E===z)break;E=h[f+b[I]]}if(Z<E&&(L&j)!==S){for(V===0&&(V=Z),_+=w,A=1<<(q=E-V);q+V<z&&!((A-=te[q+V])<=0);)q++,A<<=1;if(K+=1<<q,d===1&&852<K||d===2&&592<K)return 1;g[S=L&j]=Z<<24|q<<16|_-m|0}}return L!==0&&(g[_+L]=E-V<<24|64<<16|0),v.bits=Z,0}},{"../utils/common":41}],51:[function(r,n,i){n.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"}},{}],52:[function(r,n,i){var o=r("../utils/common"),s=0,a=1;function c(N){for(var D=N.length;0<=--D;)N[D]=0}var u=0,d=29,h=256,f=h+1+d,p=30,g=19,m=2*f+1,b=15,v=16,y=7,x=256,S=16,j=17,_=18,C=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],R=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],T=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],P=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],H=new Array(2*(f+2));c(H);var E=new Array(2*p);c(E);var I=new Array(512);c(I);var w=new Array(256);c(w);var z=new Array(d);c(z);var Z,q,V,A=new Array(p);function K(N,D,Q,ne,U){this.static_tree=N,this.extra_bits=D,this.extra_base=Q,this.elems=ne,this.max_length=U,this.has_stree=N&&N.length}function L(N,D){this.dyn_tree=N,this.max_code=0,this.stat_desc=D}function B(N){return N<256?I[N]:I[256+(N>>>7)]}function fe(N,D){N.pending_buf[N.pending++]=255&D,N.pending_buf[N.pending++]=D>>>8&255}function te(N,D,Q){N.bi_valid>v-Q?(N.bi_buf|=D<<N.bi_valid&65535,fe(N,N.bi_buf),N.bi_buf=D>>v-N.bi_valid,N.bi_valid+=Q-v):(N.bi_buf|=D<<N.bi_valid&65535,N.bi_valid+=Q)}function ae(N,D,Q){te(N,Q[2*D],Q[2*D+1])}function ge(N,D){for(var Q=0;Q|=1&N,N>>>=1,Q<<=1,0<--D;);return Q>>>1}function je(N,D,Q){var ne,U,X=new Array(b+1),oe=0;for(ne=1;ne<=b;ne++)X[ne]=oe=oe+Q[ne-1]<<1;for(U=0;U<=D;U++){var J=N[2*U+1];J!==0&&(N[2*U]=ge(X[J]++,J))}}function me(N){var D;for(D=0;D<f;D++)N.dyn_ltree[2*D]=0;for(D=0;D<p;D++)N.dyn_dtree[2*D]=0;for(D=0;D<g;D++)N.bl_tree[2*D]=0;N.dyn_ltree[2*x]=1,N.opt_len=N.static_len=0,N.last_lit=N.matches=0}function be(N){8<N.bi_valid?fe(N,N.bi_buf):0<N.bi_valid&&(N.pending_buf[N.pending++]=N.bi_buf),N.bi_buf=0,N.bi_valid=0}function Ue(N,D,Q,ne){var U=2*D,X=2*Q;return N[U]<N[X]||N[U]===N[X]&&ne[D]<=ne[Q]}function We(N,D,Q){for(var ne=N.heap[Q],U=Q<<1;U<=N.heap_len&&(U<N.heap_len&&Ue(D,N.heap[U+1],N.heap[U],N.depth)&&U++,!Ue(D,ne,N.heap[U],N.depth));)N.heap[Q]=N.heap[U],Q=U,U<<=1;N.heap[Q]=ne}function bt(N,D,Q){var ne,U,X,oe,J=0;if(N.last_lit!==0)for(;ne=N.pending_buf[N.d_buf+2*J]<<8|N.pending_buf[N.d_buf+2*J+1],U=N.pending_buf[N.l_buf+J],J++,ne===0?ae(N,U,D):(ae(N,(X=w[U])+h+1,D),(oe=C[X])!==0&&te(N,U-=z[X],oe),ae(N,X=B(--ne),Q),(oe=R[X])!==0&&te(N,ne-=A[X],oe)),J<N.last_lit;);ae(N,x,D)}function et(N,D){var Q,ne,U,X=D.dyn_tree,oe=D.stat_desc.static_tree,J=D.stat_desc.has_stree,F=D.stat_desc.elems,ee=-1;for(N.heap_len=0,N.heap_max=m,Q=0;Q<F;Q++)X[2*Q]!==0?(N.heap[++N.heap_len]=ee=Q,N.depth[Q]=0):X[2*Q+1]=0;for(;N.heap_len<2;)X[2*(U=N.heap[++N.heap_len]=ee<2?++ee:0)]=1,N.depth[U]=0,N.opt_len--,J&&(N.static_len-=oe[2*U+1]);for(D.max_code=ee,Q=N.heap_len>>1;1<=Q;Q--)We(N,X,Q);for(U=F;Q=N.heap[1],N.heap[1]=N.heap[N.heap_len--],We(N,X,1),ne=N.heap[1],N.heap[--N.heap_max]=Q,N.heap[--N.heap_max]=ne,X[2*U]=X[2*Q]+X[2*ne],N.depth[U]=(N.depth[Q]>=N.depth[ne]?N.depth[Q]:N.depth[ne])+1,X[2*Q+1]=X[2*ne+1]=U,N.heap[1]=U++,We(N,X,1),2<=N.heap_len;);N.heap[--N.heap_max]=N.heap[1],function(ie,ue){var ye,we,Ie,ve,Ae,ze,Le=ue.dyn_tree,ct=ue.max_code,tt=ue.stat_desc.static_tree,Me=ue.stat_desc.has_stree,Fe=ue.stat_desc.extra_bits,ut=ue.stat_desc.extra_base,Ve=ue.stat_desc.max_length,xt=0;for(ve=0;ve<=b;ve++)ie.bl_count[ve]=0;for(Le[2*ie.heap[ie.heap_max]+1]=0,ye=ie.heap_max+1;ye<m;ye++)Ve<(ve=Le[2*Le[2*(we=ie.heap[ye])+1]+1]+1)&&(ve=Ve,xt++),Le[2*we+1]=ve,ct<we||(ie.bl_count[ve]++,Ae=0,ut<=we&&(Ae=Fe[we-ut]),ze=Le[2*we],ie.opt_len+=ze*(ve+Ae),Me&&(ie.static_len+=ze*(tt[2*we+1]+Ae)));if(xt!==0){do{for(ve=Ve-1;ie.bl_count[ve]===0;)ve--;ie.bl_count[ve]--,ie.bl_count[ve+1]+=2,ie.bl_count[Ve]--,xt-=2}while(0<xt);for(ve=Ve;ve!==0;ve--)for(we=ie.bl_count[ve];we!==0;)ct<(Ie=ie.heap[--ye])||(Le[2*Ie+1]!==ve&&(ie.opt_len+=(ve-Le[2*Ie+1])*Le[2*Ie],Le[2*Ie+1]=ve),we--)}}(N,D),je(X,ee,N.bl_count)}function k(N,D,Q){var ne,U,X=-1,oe=D[1],J=0,F=7,ee=4;for(oe===0&&(F=138,ee=3),D[2*(Q+1)+1]=65535,ne=0;ne<=Q;ne++)U=oe,oe=D[2*(ne+1)+1],++J<F&&U===oe||(J<ee?N.bl_tree[2*U]+=J:U!==0?(U!==X&&N.bl_tree[2*U]++,N.bl_tree[2*S]++):J<=10?N.bl_tree[2*j]++:N.bl_tree[2*_]++,X=U,ee=(J=0)===oe?(F=138,3):U===oe?(F=6,3):(F=7,4))}function re(N,D,Q){var ne,U,X=-1,oe=D[1],J=0,F=7,ee=4;for(oe===0&&(F=138,ee=3),ne=0;ne<=Q;ne++)if(U=oe,oe=D[2*(ne+1)+1],!(++J<F&&U===oe)){if(J<ee)for(;ae(N,U,N.bl_tree),--J!=0;);else U!==0?(U!==X&&(ae(N,U,N.bl_tree),J--),ae(N,S,N.bl_tree),te(N,J-3,2)):J<=10?(ae(N,j,N.bl_tree),te(N,J-3,3)):(ae(N,_,N.bl_tree),te(N,J-11,7));X=U,ee=(J=0)===oe?(F=138,3):U===oe?(F=6,3):(F=7,4)}}c(A);var G=!1;function O(N,D,Q,ne){te(N,(u<<1)+(ne?1:0),3),function(U,X,oe,J){be(U),fe(U,oe),fe(U,~oe),o.arraySet(U.pending_buf,U.window,X,oe,U.pending),U.pending+=oe}(N,D,Q)}i._tr_init=function(N){G||(function(){var D,Q,ne,U,X,oe=new Array(b+1);for(U=ne=0;U<d-1;U++)for(z[U]=ne,D=0;D<1<<C[U];D++)w[ne++]=U;for(w[ne-1]=U,U=X=0;U<16;U++)for(A[U]=X,D=0;D<1<<R[U];D++)I[X++]=U;for(X>>=7;U<p;U++)for(A[U]=X<<7,D=0;D<1<<R[U]-7;D++)I[256+X++]=U;for(Q=0;Q<=b;Q++)oe[Q]=0;for(D=0;D<=143;)H[2*D+1]=8,D++,oe[8]++;for(;D<=255;)H[2*D+1]=9,D++,oe[9]++;for(;D<=279;)H[2*D+1]=7,D++,oe[7]++;for(;D<=287;)H[2*D+1]=8,D++,oe[8]++;for(je(H,f+1,oe),D=0;D<p;D++)E[2*D+1]=5,E[2*D]=ge(D,5);Z=new K(H,C,h+1,f,b),q=new K(E,R,0,p,b),V=new K(new Array(0),T,0,g,y)}(),G=!0),N.l_desc=new L(N.dyn_ltree,Z),N.d_desc=new L(N.dyn_dtree,q),N.bl_desc=new L(N.bl_tree,V),N.bi_buf=0,N.bi_valid=0,me(N)},i._tr_stored_block=O,i._tr_flush_block=function(N,D,Q,ne){var U,X,oe=0;0<N.level?(N.strm.data_type===2&&(N.strm.data_type=function(J){var F,ee=4093624447;for(F=0;F<=31;F++,ee>>>=1)if(1&ee&&J.dyn_ltree[2*F]!==0)return s;if(J.dyn_ltree[18]!==0||J.dyn_ltree[20]!==0||J.dyn_ltree[26]!==0)return a;for(F=32;F<h;F++)if(J.dyn_ltree[2*F]!==0)return a;return s}(N)),et(N,N.l_desc),et(N,N.d_desc),oe=function(J){var F;for(k(J,J.dyn_ltree,J.l_desc.max_code),k(J,J.dyn_dtree,J.d_desc.max_code),et(J,J.bl_desc),F=g-1;3<=F&&J.bl_tree[2*P[F]+1]===0;F--);return J.opt_len+=3*(F+1)+5+5+4,F}(N),U=N.opt_len+3+7>>>3,(X=N.static_len+3+7>>>3)<=U&&(U=X)):U=X=Q+5,Q+4<=U&&D!==-1?O(N,D,Q,ne):N.strategy===4||X===U?(te(N,2+(ne?1:0),3),bt(N,H,E)):(te(N,4+(ne?1:0),3),function(J,F,ee,ie){var ue;for(te(J,F-257,5),te(J,ee-1,5),te(J,ie-4,4),ue=0;ue<ie;ue++)te(J,J.bl_tree[2*P[ue]+1],3);re(J,J.dyn_ltree,F-1),re(J,J.dyn_dtree,ee-1)}(N,N.l_desc.max_code+1,N.d_desc.max_code+1,oe+1),bt(N,N.dyn_ltree,N.dyn_dtree)),me(N),ne&&be(N)},i._tr_tally=function(N,D,Q){return N.pending_buf[N.d_buf+2*N.last_lit]=D>>>8&255,N.pending_buf[N.d_buf+2*N.last_lit+1]=255&D,N.pending_buf[N.l_buf+N.last_lit]=255&Q,N.last_lit++,D===0?N.dyn_ltree[2*Q]++:(N.matches++,D--,N.dyn_ltree[2*(w[Q]+h+1)]++,N.dyn_dtree[2*B(D)]++),N.last_lit===N.lit_bufsize-1},i._tr_align=function(N){te(N,2,3),ae(N,x,H),function(D){D.bi_valid===16?(fe(D,D.bi_buf),D.bi_buf=0,D.bi_valid=0):8<=D.bi_valid&&(D.pending_buf[D.pending++]=255&D.bi_buf,D.bi_buf>>=8,D.bi_valid-=8)}(N)}},{"../utils/common":41}],53:[function(r,n,i){n.exports=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}},{}],54:[function(r,n,i){(function(o){(function(s,a){if(!s.setImmediate){var c,u,d,h,f=1,p={},g=!1,m=s.document,b=Object.getPrototypeOf&&Object.getPrototypeOf(s);b=b&&b.setTimeout?b:s,c={}.toString.call(s.process)==="[object process]"?function(S){process.nextTick(function(){y(S)})}:function(){if(s.postMessage&&!s.importScripts){var S=!0,j=s.onmessage;return s.onmessage=function(){S=!1},s.postMessage("","*"),s.onmessage=j,S}}()?(h="setImmediate$"+Math.random()+"$",s.addEventListener?s.addEventListener("message",x,!1):s.attachEvent("onmessage",x),function(S){s.postMessage(h+S,"*")}):s.MessageChannel?((d=new MessageChannel).port1.onmessage=function(S){y(S.data)},function(S){d.port2.postMessage(S)}):m&&"onreadystatechange"in m.createElement("script")?(u=m.documentElement,function(S){var j=m.createElement("script");j.onreadystatechange=function(){y(S),j.onreadystatechange=null,u.removeChild(j),j=null},u.appendChild(j)}):function(S){setTimeout(y,0,S)},b.setImmediate=function(S){typeof S!="function"&&(S=new Function(""+S));for(var j=new Array(arguments.length-1),_=0;_<j.length;_++)j[_]=arguments[_+1];var C={callback:S,args:j};return p[f]=C,c(f),f++},b.clearImmediate=v}function v(S){delete p[S]}function y(S){if(g)setTimeout(y,0,S);else{var j=p[S];if(j){g=!0;try{(function(_){var C=_.callback,R=_.args;switch(R.length){case 0:C();break;case 1:C(R[0]);break;case 2:C(R[0],R[1]);break;case 3:C(R[0],R[1],R[2]);break;default:C.apply(a,R)}})(j)}finally{v(S),g=!1}}}}function x(S){S.source===s&&typeof S.data=="string"&&S.data.indexOf(h)===0&&y(+S.data.slice(h.length))}})(typeof self>"u"?o===void 0?this:o:self)}).call(this,typeof Un<"u"?Un:typeof self<"u"?self:typeof window<"u"?window:{})},{}]},{},[10])(10)})})(P1);var yB=P1.exports;const bB=zc(yB);function xB(t){let e="",r=t;for(;r>=0;)e=String.fromCharCode(r%26+65)+e,r=Math.floor(r/26)-1;return e}function wB(t,e){return`${xB(t)}${e+1}`}async function _B(t,e,r="design"){const i=Math.ceil(e.width/1e3),o=Math.ceil(e.length/1e3);console.log(`[SLICER] Creating ${i}×${o} grid (${i*o} tiles) for ${e.width}mm × ${e.length}mm design`);const c=new DOMParser().parseFromString(t,"image/svg+xml").querySelector("svg");if(!c)throw new Error("Invalid SVG content");const u=c.getAttribute("viewBox");let d,h;if(u){const C=u.split(/\s+/).map(Number);d=C[2],h=C[3]}else d=parseFloat(c.getAttribute("width"))||1024,h=parseFloat(c.getAttribute("height"))||1024;console.log(`[SLICER] SVG internal dimensions: ${d} × ${h}`);const f=d/e.width,p=h/e.length,g=1e3*f,m=1e3*p;console.log(`[SLICER] Tile size in SVG units: ${g} × ${m}`);const b=c.innerHTML,v=c.getAttribute("xmlns")||"http://www.w3.org/2000/svg",y=new bB,x=y.folder("tiles"),S=[];for(let C=0;C<o;C++){const R=[];for(let T=0;T<i;T++){const P=wB(T,C);R.push(P);const H=T*g,E=C*m,I=`${H} ${E} ${g} ${m}`,w=`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="${v}" viewBox="${I}" width="1000mm" height="1000mm">
  <defs>
    <clipPath id="tile-clip">
      <rect x="${H}" y="${E}" width="${g}" height="${m}"/>
    </clipPath>
  </defs>
  <g clip-path="url(#tile-clip)">
${b}
  </g>
</svg>`,z=`${O1(r)}_${P}.svg`;x.file(z,w)}S.push(R)}const j=SB(S,e,r);y.file("layout-guide.txt",j);const _=await y.generateAsync({type:"blob"});return console.log(`[SLICER] Created ZIP with ${i*o} tiles`),_}function SB(t,e,r){const n=t.length,i=t[0].length;let o=`TPV Studio - Tile Layout Guide
================================

Design: ${r}
Total Size: ${e.width}mm × ${e.length}mm (${e.width/1e3}m × ${e.length/1e3}m)
Tile Size: 1000mm × 1000mm (1m × 1m)
Grid: ${i} columns × ${n} rows (${i*n} tiles)

Layout (view from above):
-------------------------

`;const s=6;o+="┌"+("─".repeat(s)+"┬").repeat(i-1)+"─".repeat(s)+`┐
`;for(let a=0;a<n;a++){o+="│";for(let c=0;c<i;c++){const u=t[a][c],d=s-u.length,h=Math.floor(d/2),f=d-h;o+=" ".repeat(h)+u+" ".repeat(f)+"│"}o+=`
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
`,o}function O1(t){return t.replace(/[<>:"/\\|?*]/g,"_").replace(/\s+/g,"-").substring(0,50)}function kB(t,e){const r=URL.createObjectURL(t),n=document.createElement("a");n.href=r,n.download=e,document.body.appendChild(n),n.click(),document.body.removeChild(n),URL.revokeObjectURL(r)}async function jB(t,e,r="design"){try{const n=await fetch(t);if(!n.ok)throw new Error(`Failed to fetch SVG: ${n.statusText}`);const i=await n.text(),o=await _B(i,e,r),s=`${O1(r)}-tiles-1mx1m.zip`;return kB(o,s),console.log(`[SLICER] Downloaded ${s}`),!0}catch(n){throw console.error("[SLICER] Failed to download tiles:",n),n}}function CB({loadedDesign:t,onDesignSaved:e}){var gi;const[r,n]=M.useState("prompt"),[i,o]=M.useState(""),[s,a]=M.useState(5e3),[c,u]=M.useState(5e3),[d,h]=M.useState(null),[f,p]=M.useState(null),[g,m]=M.useState(!1),[b,v]=M.useState(null),[y,x]=M.useState(!1),[S,j]=M.useState(null),[_,C]=M.useState(null),[R,T]=M.useState(null),[P,H]=M.useState(null),[E,I]=M.useState(""),[w,z]=M.useState(null),[Z,q]=M.useState(null),[V,A]=M.useState(null),[K,L]=M.useState(null),[B,fe]=M.useState(!1),[te,ae]=M.useState("solid"),[ge,je]=M.useState(null),[me,be]=M.useState(null),[Ue,We]=M.useState(null),[bt,et]=M.useState(!1),[k,re]=M.useState(!1),[G,O]=M.useState(null),[N,D]=M.useState(new Map),[Q,ne]=M.useState(new Map),[U,X]=M.useState(new Map),[oe,J]=M.useState(!1),[F,ee]=M.useState(null),[ie,ue]=M.useState(null),[ye,we]=M.useState([]),[Ie,ve]=M.useState(!1),[Ae,ze]=M.useState([new Map]),[Le,ct]=M.useState(0),[tt,Me]=M.useState(!1),[Fe,ut]=M.useState(null),[Ve,xt]=M.useState(!1),[Qt,Gr]=M.useState(""),[el,tl]=M.useState(!1),[wu,At]=M.useState(null),[_s,Tn]=M.useState(!1),[Ss,_u]=M.useState(null),[Su,Tr]=M.useState(!1),[rl,Vr]=M.useState(null),[li,Xe]=M.useState(null),[nl,_t]=M.useState(null),ci=M.useRef(null);M.useEffect(()=>{(me||V)&&ci.current&&!tt&&!k&&setTimeout(()=>{var Y;(Y=ci.current)==null||Y.scrollIntoView({behavior:"smooth",block:"start"})},300)},[me,V,tt,k]),M.useEffect(()=>{(async()=>{try{const se=await Ah({limit:1,offset:0});_t(se.designs.length>0),console.log("[INSPIRE] Existing designs check:",se.designs.length>0?"User has designs":"No designs found")}catch(se){console.error("[INSPIRE] Failed to check for existing designs:",se),_t(!0)}})()},[]),M.useEffect(()=>{r==="image"||r==="svg"?(u(null),a(null),console.log("[DIMENSION] Reset dimensions for upload mode:",r)):r==="prompt"&&(c===null||s===null)&&(u(5e3),a(5e3),console.log("[DIMENSION] Restored default dimensions for prompt mode"))},[r]),M.useEffect(()=>()=>{V&&V.startsWith("blob:")&&URL.revokeObjectURL(V),me&&me.startsWith("blob:")&&URL.revokeObjectURL(me)},[]),M.useEffect(()=>{const Y=se=>{se.key==="Escape"&&oe&&(J(!1),ee(null))};return window.addEventListener("keydown",Y),()=>window.removeEventListener("keydown",Y)},[oe]),M.useEffect(()=>{ye.length>0&&!Ie&&Os()},[ye,Ie]),M.useEffect(()=>{if(t){console.log("[INSPIRE] Loading design data:",t);const Y=zF(t);console.log("[INSPIRE] Restored state:",Y),n(Y.inputMode),o(Y.prompt),h(Y.selectedFile),a(Y.lengthMM),u(Y.widthMM),T(Y.result),q(Y.blendRecipes),je(Y.solidRecipes),L(Y.colorMapping),We(Y.solidColorMapping),D(Y.solidEditedColors),ne(Y.blendEditedColors),A(Y.blendSvgUrl),be(Y.solidSvgUrl),ae(Y.viewMode),v(Y.arMapping),j(Y.jobId),fe(Y.showFinalRecipes),et(Y.showSolidSummary),console.log("[INSPIRE] Loaded design:",t.name),t.name&&Gr(t.name),t.id&&At(t.id),setTimeout(async()=>{var se;if((se=Y.result)!=null&&se.svg_url){console.log("[INSPIRE] Regenerating SVGs from loaded design");let de=null;try{const Ce=await(await fetch(Y.result.svg_url)).text();de=Pv(Ce),ue(de),console.log("[INSPIRE] Tagged SVG with region IDs for loaded design")}catch(pe){console.error("[INSPIRE] Failed to tag SVG regions:",pe)}try{Y.blendRecipes&&Y.colorMapping&&await ku(Y.result.svg_url,Y.colorMapping,Y.blendRecipes,Y.blendEditedColors,de),Y.solidRecipes&&Y.solidColorMapping&&await to(Y.result.svg_url,Y.solidColorMapping,Y.solidRecipes,Y.solidEditedColors,de)}catch(pe){console.error("[INSPIRE] Failed to regenerate SVGs:",pe),H("Failed to restore design preview. Please try reloading.")}}},100)}},[t]);const dt=Y=>{var Ce;const se=(Ce=Y.target.files)==null?void 0:Ce[0];if(!se){h(null);return}const pe=Iv(se,{maxSizeMB:10,allowedTypes:r==="image"?["image/png","image/jpeg"]:["image/svg+xml"]});if(!pe.valid){H(pe.error),h(null);return}h(se),H(null)},Rn=Y=>{Y.preventDefault(),Y.stopPropagation(),m(!0)},Zi=Y=>{Y.preventDefault(),Y.stopPropagation(),Y.currentTarget===Y.target&&m(!1)},nn=Y=>{Y.preventDefault(),Y.stopPropagation()},ks=Y=>{Y.preventDefault(),Y.stopPropagation(),m(!1);const se=Y.dataTransfer.files;if(se&&se.length>0){const de=se[0],Ce=Iv(de,{maxSizeMB:10,allowedTypes:r==="image"?["image/png","image/jpeg"]:["image/svg+xml"]});if(!Ce.valid){H(Ce.error),h(null);return}h(de),H(null)}},js=async()=>{var Y,se;if(r==="prompt"&&!i.trim()){H("Please enter a design description");return}if((r==="image"||r==="svg")&&!d){H("Please select a file to upload");return}H(null),x(!0),C(null),T(null),j(null),I("Initialising..."),z(null);try{let de;if(r==="svg"){I("Uploading SVG file..."),p("Uploading...");const Te=await $v(d);if(!Te.success)throw new Error(Te.error||"Failed to upload file");if(I("Processing SVG..."),p(null),de=await wi.processUploadedSVG({svg_url:Te.url}),!de.success)throw new Error(de.error||"Failed to process SVG");j(de.jobId),I("✓ SVG uploaded successfully!"),x(!1);const Ee=await wi.getRecraftStatus(de.jobId);C(Ee),T(Ee.result),(Y=Ee.result)!=null&&Y.svg_url&&await Ts(Ee.result.svg_url,de.jobId);return}if(r==="image"){I("Uploading image..."),p("Uploading...");const Te=await $v(d);if(!Te.success)throw new Error(Te.error||"Failed to upload file");if(I("Starting vectorisation..."),p(null),de=await wi.vectorizeImage({image_url:Te.url}),!de.success)throw new Error(de.error||"Failed to start vectorisation");I("🎨 AI is vectorising your image...")}else{const Te=mB(s,c);if(v(Te),console.log("[TPV-STUDIO] AR Mapping:",Te),console.log("[TPV-STUDIO] Layout:",gB(Te)),vB(Te)?I(`Generating ${Te.canonical.name} design panel...`):I("Initialising..."),de=await wi.generateRecraft({prompt:i.trim(),lengthMM:Te.recraft.height,widthMM:Te.recraft.width}),!de.success)throw new Error(de.error||"Failed to start generation");I("🎨 AI is creating your design...")}j(de.jobId),I("Request submitted, waiting for processing...");let pe=null,Ce=Date.now();await wi.waitForRecraftCompletion(de.jobId,Te=>{var Be,De;C(Te);const Ee=Math.floor((Date.now()-Ce)/1e3);if(Te.status==="queued"){const Qe=[`🎨 Preparing your canvas... (${Ee}s)`,`✨ Warming up the AI brushes... (${Ee}s)`,`🎯 Queueing your masterpiece... (${Ee}s)`,`🖌️ Mixing digital paints... (${Ee}s)`,`💭 AI is contemplating your vision... (${Ee}s)`,`🌈 Selecting the perfect colours... (${Ee}s)`,`📐 Calculating vector paths... (${Ee}s)`,`⚡ Almost ready to create... (${Ee}s)`],Nt=Math.floor(Ee/4)%Qe.length;I(Qe[Nt])}else if(Te.status==="running")if(pe!=="running")I("🎨 AI is creating your design..."),pe="running";else{const Qe=[`🎨 Creating vector shapes... (${Ee}s)`,`🖌️ Applying colours and patterns... (${Ee}s)`,`✨ Refining design details... (${Ee}s)`,`🎯 Finalising artwork... (${Ee}s)`],Nt=Math.floor(Ee/5)%Qe.length;I(Qe[Nt])}else if(Te.status==="retrying"){const Qe=((Be=Te.recraft)==null?void 0:Be.attempt_current)||0,Nt=((De=Te.recraft)==null?void 0:De.attempt_max)||3;I(`⚡ Retrying generation (attempt ${Qe}/${Nt})...`)}});const Pe=await wi.getRecraftStatus(de.jobId);C(Pe),T(Pe.result),Pe.status==="completed"&&(I("✓ Design ready!"),x(!1),(se=Pe.result)!=null&&se.svg_url&&await Ts(Pe.result.svg_url,de.jobId))}catch(de){console.error("Generation failed:",de),H(de.message),I(""),x(!1)}},il=()=>{const Y=te==="solid"?me:V,se=te==="solid"?"tpv-solid":"tpv-blend";if(Y){const de=document.createElement("a");de.href=Y,de.download=`${se}-${Date.now()}.svg`,document.body.appendChild(de),de.click(),document.body.removeChild(de)}},ui=async Y=>{try{const de=await(await fetch(Y)).text(),Pe=new DOMParser().parseFromString(de,"image/svg+xml").querySelector("svg");if(!Pe)return null;let Te,Ee;const Be=Pe.getAttribute("viewBox");if(Be){const Qe=Be.split(/\s+/).map(Number);Te=Qe[2],Ee=Qe[3]}else Te=parseFloat(Pe.getAttribute("width"))||1024,Ee=parseFloat(Pe.getAttribute("height"))||1024;const De=Te/Ee;return console.log(`[DIMENSION] Detected aspect ratio: ${De.toFixed(2)} (${Te}×${Ee})`),De}catch(se){return console.error("[DIMENSION] Failed to detect aspect ratio:",se),null}},Nn=(Y,se)=>{console.log(`[DIMENSION] User confirmed dimensions: ${Y}mm × ${se}mm`),u(Y),a(se),li==="pdf"?setTimeout(()=>hi(Y,se),100):li==="tiles"?setTimeout(()=>Es(Y,se),100):li==="insitu"?setTimeout(()=>Tn(!0),100):li==="save"&&setTimeout(()=>xt(!0),100),Xe(null)},di=async()=>{const Y=te==="solid"?me:V;if((r==="image"||r==="svg")&&(!c||!s)){console.log("[DIMENSION] No dimensions set for image/SVG upload, showing modal...");const se=await ui(Y);if(se){Vr(se),Xe("insitu"),Tr(!0);return}else{Vr(1),Xe("insitu"),Tr(!0);return}}Tn(!0)},on=()=>{const Y=te==="solid"?me:V,se=te==="solid"?"tpv-solid":"tpv-blend";if(Y){const de=new Image;de.onload=()=>{const pe=document.createElement("canvas");pe.width=de.naturalWidth||1e3,pe.height=de.naturalHeight||1e3,pe.getContext("2d").drawImage(de,0,0),pe.toBlob(Pe=>{const Te=URL.createObjectURL(Pe),Ee=document.createElement("a");Ee.href=Te,Ee.download=`${se}-${Date.now()}.png`,document.body.appendChild(Ee),Ee.click(),document.body.removeChild(Ee),URL.revokeObjectURL(Te)})},de.src=Y}},Cs=async()=>{const Y=te==="solid"?me:V;if((r==="image"||r==="svg")&&(!c||!s)){console.log("[DIMENSION] No dimensions set for image/SVG upload, showing modal before save...");const se=await ui(Y);if(se){Vr(se),Xe("save"),Tr(!0);return}else{Vr(1),Xe("save"),Tr(!0);return}}xt(!0)},[Ji,sn]=M.useState(!1),Qi=async()=>{const Y=te==="solid"?me:V;if((r==="image"||r==="svg")&&(!c||!s)){console.log("[DIMENSION] No dimensions set for image/SVG upload, showing modal...");const se=await ui(Y);if(se){Vr(se),Xe("pdf"),Tr(!0);return}else{Vr(1),Xe("pdf"),Tr(!0);return}}await hi(c,s)},hi=async(Y,se)=>{const de=te==="solid"?me:V,pe=te==="solid"?ge:Z,Ce=te==="solid"?"tpv-solid":"tpv-blend";if(!de||!pe){H("Cannot generate PDF: missing SVG or recipes");return}sn(!0),H(null);try{const Te=await(await fetch(de)).text(),Ee=new AbortController,Be=setTimeout(()=>Ee.abort(),3e4),De=await vn.getSession(),Qe={"Content-Type":"application/json"};De!=null&&De.access_token&&(Qe.Authorization=`Bearer ${De.access_token}`);const Nt=await fetch("/api/export-pdf",{method:"POST",headers:Qe,signal:Ee.signal,body:JSON.stringify({svgString:Te,designName:Qt||i||"TPV Design",projectName:"TPV Studio",dimensions:{widthMM:Y,lengthMM:se},recipes:pe,mode:te,designId:S||""})});if(clearTimeout(Be),!Nt.ok){const vi=Nt.headers.get("content-type");if(vi&&vi.includes("application/json")){const yi=await Nt.json();throw new Error(yi.message||"PDF generation failed")}else{const yi=await Nt.text();throw console.error("PDF API error response:",yi),new Error(`Server error: ${Nt.status}`)}}const qe=await Nt.blob(),Ye=URL.createObjectURL(qe),Ze=document.createElement("a");Ze.href=Ye,Ze.download=`${Ce}-${Date.now()}.pdf`,document.body.appendChild(Ze),Ze.click(),document.body.removeChild(Ze),URL.revokeObjectURL(Ye)}catch(Pe){console.error("PDF download error:",Pe),Pe.name==="AbortError"?H("PDF generation timed out. Please try again."):H(`PDF generation failed: ${Pe.message}`)}finally{sn(!1)}},ol=async()=>{const Y=te==="solid"?me:V;if(!Y){H("No SVG available to slice");return}if((r==="image"||r==="svg")&&(!c||!s)){console.log("[DIMENSION] No dimensions set for image/SVG upload, showing modal...");const se=await ui(Y);if(se){Vr(se),Xe("tiles"),Tr(!0);return}else{Vr(1),Xe("tiles"),Tr(!0);return}}await Es(c,s)},Es=async(Y,se)=>{const de=te==="solid"?me:V;try{await jB(de,{width:Y,length:se},Qt||"tpv-design")}catch(pe){console.error("Tile download error:",pe),H(`Failed to download tiles: ${pe.message}`)}},Ts=async(Y=null,se=null)=>{const de=Y||(R==null?void 0:R.svg_url),pe=se||S;if(!de){H("No SVG available to analyse");return}A(null),q(null),L(null),console.log("[TPV-STUDIO] Cleared old blend state, starting new blend generation"),H(null),I("🎨 Extracting colours from design..."),await new Promise(Ce=>setTimeout(Ce,100));try{const Ce=await fetch("/api/blend-recipes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({svg_url:de,job_id:pe,max_colors:15,max_components:2})}),Pe=await Ce.json();if(!Ce.ok)throw new Error(Pe.error||"Failed to generate blend recipes");if(Pe.success){I("🔍 Matching TPV granule colours..."),await new Promise(Be=>setTimeout(Be,300)),q(Pe.recipes);const Te=nB(Pe.recipes);console.log("[TPV-STUDIO] Color mapping built with",Te.size,"entries:"),Array.from(Te.entries()).forEach(([Be,De])=>{console.log(`  ${Be} -> ${De.blendHex}`)}),L(Te);let Ee=null;try{const De=await(await fetch(de)).text();Ee=Pv(De),ue(Ee),console.log("[TPV-STUDIO] Tagged SVG with region IDs for per-element editing")}catch(Be){console.error("[TPV-STUDIO] Failed to tag SVG regions:",Be)}try{I("✨ Generating TPV blend preview..."),await new Promise(Qe=>setTimeout(Qe,200)),console.log("[TPV-STUDIO] Generating recoloured SVG from:",de),console.log("[TPV-STUDIO] Using mapping with",Te.size,"colors");const{dataUrl:Be,stats:De}=await ho(de,Te,Ee);A(Be),I("✓ TPV blend ready!"),console.log("[TPV-STUDIO] Recolour stats:",{totalColors:De.totalColors,colorsReplaced:De.colorsReplaced,colorsNotMapped:Array.from(De.colorsNotMapped)}),De.colorsNotMapped.size>0&&console.warn("[TPV-STUDIO] Some colors were not mapped:",Array.from(De.colorsNotMapped)),Pn(de,pe,Ee)}catch(Be){console.error("[TPV-STUDIO] Failed to generate recoloured SVG:",Be),H(`Recipes generated successfully, but SVG recolouring failed: ${Be.message}`)}}else throw new Error(Pe.error||"Unknown error generating recipes")}catch(Ce){console.error("Blend generation failed:",Ce),H(Ce.message),I("")}},eo=async()=>{re(!1),O(null),Me(!1),ut(null),te==="solid"?D(new Map):ne(new Map),R!=null&&R.svg_url&&await Ts(R.svg_url,S)},fi=async Y=>{var se;if(!Qt){if(!i||r!=="prompt"){d&&Gr(`TPV Design – ${d.name.replace(/\.[^/.]+$/,"")}`);return}tl(!0);try{const de=(Y==null?void 0:Y.slice(0,6).map(Ce=>{var Te,Ee;const Pe=(Ee=(Te=Ce.chosenRecipe)==null?void 0:Te.components)==null?void 0:Ee[0];return(Pe==null?void 0:Pe.name)||null}).filter(Boolean))||[],pe=await wi.generateDesignName({prompt:i,colors:de,dimensions:{widthMM:c,lengthMM:s}});pe.success&&((se=pe.names)==null?void 0:se.length)>0?Gr(pe.names[0]):Gr(an(i))}catch(de){console.error("[TPV-STUDIO] Name generation failed:",de),Gr(an(i))}finally{tl(!1)}}},an=Y=>Y?`TPV Design – ${Y.split(/[,.]/)[0].trim().slice(0,40)}`:"TPV Playground Design",Pn=async(Y=null,se=null,de=null)=>{const pe=Y||(R==null?void 0:R.svg_url),Ce=se||S,Pe=de||ie;if(pe)try{console.log("[TPV-STUDIO] Generating solid color version...");const Te=await fetch("/api/solid-recipes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({svg_url:pe,job_id:Ce,max_colors:15})}),Ee=await Te.json();if(!Te.ok)throw new Error(Ee.error||"Failed to generate solid recipes");if(Ee.success){je(Ee.recipes);const Be=new Map(Object.entries(Ee.colorMapping||{}));console.log("[TPV-STUDIO] Using API colorMapping with",Be.size,"entries"),We(Be);try{const{dataUrl:De,stats:Qe}=await ho(pe,Be,Pe);be(De),console.log("[TPV-STUDIO] Solid color SVG generated:",Qe),Qe.colorsNotMapped&&Qe.colorsNotMapped.size>0&&console.warn("[TPV-STUDIO] Unmapped colors in solid mode:",Array.from(Qe.colorsNotMapped)),fi(Ee.recipes)}catch(De){console.error("[TPV-STUDIO] Failed to generate solid SVG:",De)}}}catch(Te){console.error("[TPV-STUDIO] Solid generation failed:",Te)}},Rs=(Y,se="palette")=>{if(console.log("[TPV-STUDIO] Color clicked:",Y,"source:",se,"in mode:",te),oe&&F&&se==="palette"){Ps(F.regionId,Y.hex),J(!1),ee(null);return}se==="palette"&&(te==="blend"?(ut(Y),Me(!0),fe(!1)):(O(Y),re(!0),et(!1)))},Ns=Y=>{console.log("[TPV-STUDIO] Region clicked:",Y),oe?(Ps(F.regionId,Y.sourceColor),J(!1),ee(null)):(J(!0),ee(Y))},Ps=(Y,se)=>{console.log("[TPV-STUDIO] Queuing region recolor:",Y,"->",se),we(de=>[...de,{regionId:Y,newHex:se.toLowerCase(),viewMode:te}])},Os=async()=>{if(Ie||ye.length===0)return;ve(!0);const Y=ye[0];console.log("[TPV-STUDIO] Processing queued region recolor:",Y.regionId,"->",Y.newHex);try{const se=new Map(U);se.set(Y.regionId,Y.newHex),Y.viewMode==="blend"?await ln(null,null,se):await An(null,null,se),X(se),ze(de=>{const pe=de.slice(0,Le+1);return pe.push(new Map(se)),pe.length>50&&pe.shift(),pe}),ct(de=>{const pe=Ae.slice(0,de+1);return pe.push(new Map(se)),Math.min(pe.length-1,49)}),console.log("[TPV-STUDIO] Completed region recolor for:",Y.regionId)}catch(se){console.error("[TPV-STUDIO] Failed to process region recolor:",se)}finally{we(se=>se.slice(1)),ve(!1)}},As=()=>{console.log("[TPV-STUDIO] Eyedropper cancelled"),J(!1),ee(null)},pi=async()=>{if(Le<=0)return;const Y=Le-1,se=Ae[Y];console.log("[TPV-STUDIO] Undoing region override to index:",Y),X(new Map(se)),ct(Y),te==="blend"?await ln(null,null,se):await An(null,null,se)},mi=async()=>{if(Le>=Ae.length-1)return;const Y=Le+1,se=Ae[Y];console.log("[TPV-STUDIO] Redoing region override to index:",Y),X(new Map(se)),ct(Y),te==="blend"?await ln(null,null,se):await An(null,null,se)},Rr=async Y=>{if(G)if(console.log("[TPV-STUDIO] Color changed:",G.hex,"->",Y,"in mode:",te),te==="solid"){const se=new Map(N),de=ge.find(Ce=>Ce.targetColor.hex.toLowerCase()===G.hex.toLowerCase()),pe=(de==null?void 0:de.mergedOriginalColors)||[G.originalHex.toLowerCase()];console.log("[TPV-STUDIO] Updating",pe.length,"merged colors:",pe),pe.forEach(Ce=>{se.set(Ce,{newHex:Y.toLowerCase()})}),D(se),O({...G,hex:Y,blendHex:Y}),await An(se,Y)}else{const se=new Map(Q);se.set(G.originalHex.toLowerCase(),{newHex:Y.toLowerCase()}),ne(se),O({...G,hex:Y,blendHex:Y}),await ln(se,Y)}},On=M.useCallback(async({blendHex:Y,parts:se,recipe:de})=>{if(!Fe)return;console.log("[TPV-STUDIO] Mixer blend changed:",Fe.originalHex,"->",Y,"recipe:",de);const pe=new Map(Q);pe.set(Fe.originalHex.toLowerCase(),{newHex:Y.toLowerCase(),recipe:de,parts:se}),ne(pe),ut({...Fe,hex:Y,blendHex:Y}),await ln(pe,Y)},[Fe,Q,R,K]),ln=async(Y=null,se=null,de=null)=>{if(!(!(R!=null&&R.svg_url)||!K||!Z))try{const pe=new Map(K),Ce=Y||Q;Ce.forEach((qe,Ye)=>{if(qe.newHex){const Ze=Ye.toLowerCase();pe.set(Ze,{...pe.get(Ze),blendHex:qe.newHex})}});const Pe=Z.map(qe=>{const Ye=Ce.get(qe.originalColor.hex.toLowerCase());if(Ye!=null&&Ye.newHex){const Ze={...qe,targetColor:{...qe.targetColor,hex:Ye.newHex},blendColor:{...qe.blendColor,hex:Ye.newHex}};return Ye.recipe&&Ye.recipe.components&&(Ze.chosenRecipe={...qe.chosenRecipe,components:Ye.recipe.components,deltaE:0,quality:"Excellent"}),Ze}return qe}),{svgText:Te,stats:Ee}=await ho(R.svg_url,pe,ie),Be=de!==null?de:U,De=Ov(Te,Be);V&&V.startsWith("blob:")&&(URL.revokeObjectURL(V),console.log("[TPV-STUDIO] Revoked old blend blob URL"));const Qe=new Blob([De],{type:"image/svg+xml"}),Nt=URL.createObjectURL(Qe);console.log("[TPV-STUDIO] Created new blend blob URL, SVG length:",De.length),A(Nt),L(pe),q(Pe),console.log("[TPV-STUDIO] Blend SVG regenerated with edits:",Ee),Be.size>0&&console.log("[TPV-STUDIO] Applied",Be.size,"region overrides")}catch(pe){console.error("[TPV-STUDIO] Failed to regenerate blend SVG:",pe)}},An=async(Y=null,se=null,de=null)=>{if(!(!(R!=null&&R.svg_url)||!Ue||!ge))try{const pe=new Map(Ue),Ce=Y||N;Ce.forEach((qe,Ye)=>{if(qe.newHex){const Ze=Ye.toLowerCase();pe.set(Ze,{...pe.get(Ze),blendHex:qe.newHex})}});const Pe=ge.map(qe=>{const Ye=Ce.get(qe.originalColor.hex.toLowerCase());if(Ye!=null&&Ye.newHex){const Ze=en.find(vi=>vi.hex.toLowerCase()===Ye.newHex.toLowerCase());return Ze?{...qe,targetColor:{...qe.targetColor,hex:Ye.newHex},blendColor:{hex:Ye.newHex,rgb:Ze.rgb,lab:Ze.lab},chosenRecipe:{components:[{code:Ze.code,name:Ze.name,hex:Ze.hex,rgb:Ze.rgb,lab:Ze.lab,ratio:1}],blendColor:{hex:Ze.hex,rgb:Ze.rgb,lab:Ze.lab},deltaE:0,quality:"Perfect"}}:{...qe,targetColor:{...qe.targetColor,hex:Ye.newHex},blendColor:{...qe.blendColor,hex:Ye.newHex}}}return qe}),{svgText:Te,stats:Ee}=await ho(R.svg_url,pe,ie),Be=de!==null?de:U,De=Ov(Te,Be);me&&me.startsWith("blob:")&&(URL.revokeObjectURL(me),console.log("[TPV-STUDIO] Revoked old solid blob URL"));const Qe=new Blob([De],{type:"image/svg+xml"}),Nt=URL.createObjectURL(Qe);console.log("[TPV-STUDIO] Created new solid blob URL, SVG length:",De.length),be(Nt),We(pe),je(Pe),console.log("[TPV-STUDIO] Solid SVG regenerated with edits:",Ee),Be.size>0&&console.log("[TPV-STUDIO] Applied",Be.size,"region overrides")}catch(pe){console.error("[TPV-STUDIO] Failed to regenerate solid SVG:",pe)}},ku=async(Y,se,de,pe,Ce=null)=>{try{console.log("[INSPIRE] Regenerating blend SVG from state");const Pe=new Map(se);pe&&pe.size>0&&pe.forEach((Ee,Be)=>{const De=Be.toLowerCase();Pe.has(De)&&Pe.set(De,{...Pe.get(De),blendHex:Ee.newHex})});const{dataUrl:Te}=await ho(Y,Pe,Ce);A(Te),console.log("[INSPIRE] Blend SVG regenerated")}catch(Pe){console.error("[INSPIRE] Failed to regenerate blend SVG:",Pe)}},to=async(Y,se,de,pe,Ce=null)=>{try{console.log("[INSPIRE] Regenerating solid SVG from state");const Pe=new Map(se);pe&&pe.size>0&&pe.forEach((Ee,Be)=>{const De=Be.toLowerCase();Pe.has(De)&&Pe.set(De,{...Pe.get(De),blendHex:Ee.newHex})});const{dataUrl:Te}=await ho(Y,Pe,Ce);be(Te),console.log("[INSPIRE] Solid SVG regenerated")}catch(Pe){console.error("[INSPIRE] Failed to regenerate solid SVG:",Pe)}};return l.jsxs("div",{className:"inspire-panel-recraft",children:[l.jsxs("div",{className:"panel-header",children:[l.jsx("h2",{children:"TPV Studio - Vector AI"}),l.jsx("p",{className:"subtitle",children:"AI-powered vector designs for playground surfacing"})]}),!R&&!y&&nl===!1&&l.jsxs("div",{className:"welcome-guidance",children:[l.jsx("div",{className:"welcome-icon",children:"✨"}),l.jsx("h3",{children:"Create Your First Design"}),l.jsx("p",{children:"Choose how you'd like to create your TPV design below. You can describe what you want, upload an image to convert, or process an existing SVG file. Once generated, you'll be able to edit colours, export PDFs with specifications, and preview designs on-site."})]}),l.jsxs("div",{className:"input-mode-tabs",children:[l.jsxs("button",{className:`input-mode-tab ${r==="prompt"?"active":""}`,onClick:()=>{n("prompt"),h(null),H(null)},disabled:y,children:[l.jsxs("svg",{className:"mode-icon",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[l.jsx("path",{d:"M12 3l1.545 4.635L18.18 9.18l-4.635 1.545L12 15.36l-1.545-4.635L5.82 9.18l4.635-1.545L12 3z"}),l.jsx("path",{d:"M5 21l1.5-4.5L2 15l4.5-1.5L8 9l1.5 4.5L14 15l-4.5 1.5L8 21z",opacity:"0.5"})]}),l.jsx("span",{className:"mode-title",children:"Text Prompt"}),l.jsx("span",{className:"mode-description",children:"Describe your design"})]}),l.jsxs("button",{className:`input-mode-tab ${r==="image"?"active":""}`,onClick:()=>{n("image"),o(""),H(null)},disabled:y,children:[l.jsxs("svg",{className:"mode-icon",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[l.jsx("rect",{x:"3",y:"3",width:"18",height:"18",rx:"2",ry:"2"}),l.jsx("circle",{cx:"8.5",cy:"8.5",r:"1.5"}),l.jsx("path",{d:"M21 15l-5-5L5 21"})]}),l.jsx("span",{className:"mode-title",children:"Upload Image"}),l.jsx("span",{className:"mode-description",children:"Vectorise PNG/JPG"})]}),l.jsxs("button",{className:`input-mode-tab ${r==="svg"?"active":""}`,onClick:()=>{n("svg"),o(""),H(null)},disabled:y,children:[l.jsx("svg",{className:"mode-icon",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:l.jsx("path",{d:"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"})}),l.jsx("span",{className:"mode-title",children:"Upload SVG"}),l.jsx("span",{className:"mode-description",children:"Process existing vector"})]})]}),l.jsxs("div",{className:"form-section",children:[r==="prompt"&&l.jsxs("div",{className:"form-group",children:[l.jsx("label",{htmlFor:"prompt",children:"Design Description"}),l.jsx("textarea",{id:"prompt",value:i,onChange:Y=>o(Y.target.value),placeholder:"e.g., calm ocean theme with big fish silhouettes and waves",rows:4,disabled:y,className:"prompt-input"}),l.jsx("p",{className:"helper-text",children:"Describe the design you want to generate. The AI will create a vector illustration based on your description. Perfect for creating completely new designs from scratch - just describe colors, themes, and elements you want."})]}),r==="image"&&l.jsxs("div",{className:"form-group",children:[l.jsx("label",{htmlFor:"image-upload",children:"Upload Image (PNG/JPG)"}),l.jsxs("div",{className:`drop-zone ${g?"dragging":""} ${d?"has-file":""}`,onDragEnter:Rn,onDragLeave:Zi,onDragOver:nn,onDrop:ks,children:[l.jsx("input",{id:"image-upload",type:"file",accept:"image/png,image/jpeg",onChange:dt,disabled:y,className:"file-input-hidden"}),l.jsx("label",{htmlFor:"image-upload",className:"drop-zone-content",children:d?l.jsxs(l.Fragment,{children:[l.jsxs("svg",{className:"upload-icon success",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[l.jsx("path",{d:"M22 11.08V12a10 10 0 1 1-5.93-9.14"}),l.jsx("polyline",{points:"22 4 12 14.01 9 11.01"})]}),l.jsx("span",{className:"file-name",children:d.name}),l.jsx("span",{className:"drop-hint",children:"Click to change file"})]}):l.jsxs(l.Fragment,{children:[l.jsxs("svg",{className:"upload-icon",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[l.jsx("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}),l.jsx("polyline",{points:"17 8 12 3 7 8"}),l.jsx("line",{x1:"12",y1:"3",x2:"12",y2:"15"})]}),l.jsx("span",{className:"drop-text",children:"Drag & drop your image here"}),l.jsx("span",{className:"drop-hint",children:"or click to browse"})]})})]}),l.jsx("p",{className:"helper-text",children:"Upload a raster image (PNG or JPG). The AI will convert it to vector format (SVG) suitable for TPV surfacing. Best for converting photos, logos, or artwork into clean vectors that can be manufactured with TPV granules."})]}),r==="svg"&&l.jsxs("div",{className:"form-group",children:[l.jsx("label",{htmlFor:"svg-upload",children:"Upload SVG File"}),l.jsxs("div",{className:`drop-zone ${g?"dragging":""} ${d?"has-file":""}`,onDragEnter:Rn,onDragLeave:Zi,onDragOver:nn,onDrop:ks,children:[l.jsx("input",{id:"svg-upload",type:"file",accept:"image/svg+xml",onChange:dt,disabled:y,className:"file-input-hidden"}),l.jsx("label",{htmlFor:"svg-upload",className:"drop-zone-content",children:d?l.jsxs(l.Fragment,{children:[l.jsxs("svg",{className:"upload-icon success",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[l.jsx("path",{d:"M22 11.08V12a10 10 0 1 1-5.93-9.14"}),l.jsx("polyline",{points:"22 4 12 14.01 9 11.01"})]}),l.jsx("span",{className:"file-name",children:d.name}),l.jsx("span",{className:"drop-hint",children:"Click to change file"})]}):l.jsxs(l.Fragment,{children:[l.jsxs("svg",{className:"upload-icon",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[l.jsx("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}),l.jsx("polyline",{points:"17 8 12 3 7 8"}),l.jsx("line",{x1:"12",y1:"3",x2:"12",y2:"15"})]}),l.jsx("span",{className:"drop-text",children:"Drag & drop your SVG here"}),l.jsx("span",{className:"drop-hint",children:"or click to browse"})]})})]}),l.jsx("p",{className:"helper-text",children:"Upload an existing SVG vector file. It will be processed immediately for TPV colour matching - no AI generation needed. Ideal when you already have a vector design and just need to match colors to available TPV granules."})]}),r==="prompt"&&l.jsxs("div",{className:"form-row",children:[l.jsxs("div",{className:"form-group",children:[l.jsx("label",{htmlFor:"length",children:"Length (mm)"}),l.jsx("input",{id:"length",type:"number",value:s,onChange:Y=>a(parseInt(Y.target.value,10)),min:1e3,max:2e4,step:100,disabled:y})]}),l.jsxs("div",{className:"form-group",children:[l.jsx("label",{htmlFor:"width",children:"Width (mm)"}),l.jsx("input",{id:"width",type:"number",value:c,onChange:Y=>u(parseInt(Y.target.value,10)),min:1e3,max:2e4,step:100,disabled:y})]})]}),P&&l.jsxs("div",{className:"error-message",children:[l.jsx("strong",{children:"Error:"})," ",P]}),f&&l.jsx("div",{className:"upload-progress",children:l.jsx("p",{children:f})}),l.jsx("button",{onClick:js,disabled:y||r==="prompt"&&!i.trim()||(r==="image"||r==="svg")&&!d,className:"generate-button",children:y?r==="svg"?"Processing...":"Generating...":r==="prompt"?"Generate Vector Design":r==="image"?"Vectorise & Process":"Process SVG"})]}),y&&l.jsxs("div",{className:"progress-section",children:[l.jsx("div",{className:"progress-bar",children:l.jsx("div",{className:"progress-bar-fill"})}),l.jsx("p",{className:"progress-message",children:E})]}),R&&!y&&l.jsxs("div",{className:"results-section",children:[b&&l.jsxs("div",{className:`ar-info ${b.layout.mode}`,children:[l.jsxs("div",{className:"ar-info-header",children:[l.jsx("strong",{children:"Layout:"})," ",b.layout.reason]}),l.jsxs("div",{className:"ar-info-details",children:[l.jsxs("span",{children:["Requested: ",b.user.formatted]}),l.jsx("span",{children:"•"}),l.jsxs("span",{children:["Generated: ",b.canonical.name," panel"]}),b.layout.mode==="framing"&&l.jsxs(l.Fragment,{children:[l.jsx("span",{children:"•"}),l.jsx("span",{className:"layout-note",children:"Panel centred with base colour surround"})]}),b.layout.mode==="tiling"&&l.jsxs(l.Fragment,{children:[l.jsx("span",{children:"•"}),l.jsx("span",{className:"layout-note",children:"Pattern will repeat along length"})]})]})]}),V&&Z&&l.jsxs("div",{className:"mode-tabs",children:[l.jsxs("button",{className:`mode-tab ${te==="solid"?"active":""}`,onClick:()=>ae("solid"),disabled:!me,children:[l.jsx("span",{className:"mode-title",children:"Solid Mode"}),l.jsx("span",{className:"mode-description",children:me?"Single TPV colours only":"Generating..."})]}),l.jsxs("button",{className:`mode-tab ${te==="blend"?"active":""}`,onClick:()=>ae("blend"),children:[l.jsx("span",{className:"mode-title",children:"Blend Mode"}),l.jsx("span",{className:"mode-description",children:"Advanced: Mixed granules"})]})]}),te==="blend"&&V&&Z&&l.jsx("div",{ref:ci,children:l.jsx(Bg,{blendSvgUrl:V,recipes:Z,mode:"blend",onColorClick:Rs,onRegionClick:Ns,onEyedropperCancel:As,selectedColor:G,editedColors:Q,onResetAll:eo,designName:Qt,onNameChange:Gr,isNameLoading:el,onInSituClick:di,eyedropperActive:oe,eyedropperRegion:F,onRegionUndo:pi,onRegionRedo:mi,canUndo:Le>0,canRedo:Le<Ae.length-1,regionOverridesCount:U.size})}),te==="solid"&&me&&ge&&l.jsx("div",{ref:ci,children:l.jsx(Bg,{blendSvgUrl:me,recipes:ge,mode:"solid",onColorClick:Rs,onRegionClick:Ns,onEyedropperCancel:As,selectedColor:G,editedColors:N,onResetAll:eo,designName:Qt,onNameChange:Gr,isNameLoading:el,onInSituClick:di,eyedropperActive:oe,eyedropperRegion:F,onRegionUndo:pi,onRegionRedo:mi,canUndo:Le>0,canRedo:Le<Ae.length-1,regionOverridesCount:U.size})}),tt&&Fe&&l.jsxs("div",{className:"mixer-widget-container",children:[l.jsx("div",{className:"mixer-widget-header",children:l.jsx("button",{className:"mixer-close-btn",onClick:()=>{Me(!1),ut(null)},children:"Close Mixer"})}),l.jsx(MF,{initialRecipe:((gi=Q.get(Fe.originalHex.toLowerCase()))==null?void 0:gi.recipe)||Fe.recipe||null,onBlendChange:On,originalColor:Fe.originalHex})]}),V&&l.jsxs("div",{className:"action-buttons",children:[l.jsx("button",{onClick:Cs,className:"save-button",title:"Save this design to your gallery for later access",children:"💾 Save Design"}),l.jsx("button",{onClick:il,className:"download-button svg",title:"Download as scalable vector file (SVG) for further editing or printing",children:te==="solid"?"Download Solid TPV SVG":"Download TPV Blend SVG"}),l.jsx("button",{onClick:on,className:"download-button png",title:"Download as high-resolution image file (PNG) for presentations or sharing",children:te==="solid"?"Download Solid TPV PNG":"Download TPV Blend PNG"}),l.jsx("button",{onClick:Qi,className:"download-button pdf",disabled:Ji||!(te==="solid"?ge:Z),title:te==="solid"?"Export comprehensive PDF with design, TPV colour specifications, and installation instructions":"Export comprehensive PDF with design, granule blend recipes, and mixing instructions",children:Ji?"Generating PDF...":te==="solid"?"Export Solid PDF":"Export Blend PDF"}),l.jsx("button",{onClick:ol,className:"download-button tiles",title:c&&s?`Download ${Math.ceil(c/1e3)*Math.ceil(s/1e3)} tiles (1m×1m each) as separate SVG files. Perfect for large installations where each section needs to be manufactured separately.`:"Download design sliced into 1m×1m tiles as separate SVG files. Perfect for large installations.",children:"Download Tiles ZIP"})]})]}),te==="blend"&&V&&Z&&!B&&l.jsxs("div",{className:"finalize-section",children:[l.jsx("button",{onClick:()=>fe(!0),className:"finalize-button",children:"View Recipe Details"}),l.jsx("p",{className:"finalize-hint",children:"Click to see detailed blend formulas and quality metrics"})]}),te==="solid"&&me&&ge&&!bt&&l.jsxs("div",{className:"finalize-section",children:[l.jsx("button",{onClick:()=>et(!0),className:"finalize-button",children:"View TPV Colours Used"}),l.jsx("p",{className:"finalize-hint",children:"See which pure TPV colours are used in this design"})]}),B&&Z&&l.jsx(Dj,{recipes:Z,onClose:()=>{fe(!1)}}),bt&&ge&&l.jsx(zj,{recipes:ge,onClose:()=>{et(!1)}}),k&&G&&l.jsx(tF,{color:G,mode:te,onColorChange:Rr,onClose:()=>{re(!1),O(null)}}),Ve&&l.jsx(BF,{currentState:{inputMode:r,prompt:i,selectedFile:d,lengthMM:s,widthMM:c,result:R,viewMode:te,blendRecipes:Z,solidRecipes:ge,colorMapping:K,solidColorMapping:Ue,solidEditedColors:N,blendEditedColors:Q,blendSvgUrl:V,solidSvgUrl:me,arMapping:b,jobId:S,inSituData:Ss},existingDesignId:wu,initialName:Qt,onClose:()=>xt(!1),onSaved:(Y,se)=>{xt(!1),_t(!0),se&&Gr(se),e&&e(se),console.log("[INSPIRE] Design saved:",Y)}}),_s&&l.jsx(tB,{designUrl:te==="solid"?me:V,designDimensions:{width:c,length:s},onClose:()=>Tn(!1),onSaved:Y=>{console.log("[INSPIRE] In-situ preview saved:",Y),_u(Y),Tn(!1)}}),l.jsx(rB,{isOpen:Su,onClose:()=>{Tr(!1),Xe(null)},onConfirm:Nn,aspectRatio:rl,defaultLongestSide:5e3}),l.jsx("style",{jsx:!0,children:`
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
      `})]})}const Mv=t=>{let e;const r=new Set,n=(u,d)=>{const h=typeof u=="function"?u(e):u;if(!Object.is(h,e)){const f=e;e=d??(typeof h!="object"||h===null)?h:Object.assign({},e,h),r.forEach(p=>p(e,f))}},i=()=>e,a={setState:n,getState:i,getInitialState:()=>c,subscribe:u=>(r.add(u),()=>r.delete(u))},c=e=t(n,i,a);return a},EB=t=>t?Mv(t):Mv,TB=t=>t;function RB(t,e=TB){const r=$.useSyncExternalStore(t.subscribe,$.useCallback(()=>e(t.getState()),[t,e]),$.useCallback(()=>e(t.getInitialState()),[t,e]));return $.useDebugValue(r),r}const Lv=t=>{const e=EB(t),r=n=>RB(e,n);return Object.assign(r,e),r},NB=t=>t?Lv(t):Lv,Dv={BASE_URL:"/",DEV:!1,MODE:"production",PROD:!0,SSR:!1},La=new Map,zl=t=>{const e=La.get(t);return e?Object.fromEntries(Object.entries(e.stores).map(([r,n])=>[r,n.getState()])):{}},PB=(t,e,r)=>{if(t===void 0)return{type:"untracked",connection:e.connect(r)};const n=La.get(r.name);if(n)return{type:"tracked",store:t,...n};const i={connection:e.connect(r),stores:{}};return La.set(r.name,i),{type:"tracked",store:t,...i}},OB=(t,e)=>{if(e===void 0)return;const r=La.get(t);r&&(delete r.stores[e],Object.keys(r.stores).length===0&&La.delete(t))},AB=t=>{var e,r;if(!t)return;const n=t.split(`
`),i=n.findIndex(s=>s.includes("api.setState"));if(i<0)return;const o=((e=n[i+1])==null?void 0:e.trim())||"";return(r=/.+ (.+) .+/.exec(o))==null?void 0:r[1]},$B=(t,e={})=>(r,n,i)=>{const{enabled:o,anonymousActionType:s,store:a,...c}=e;let u;try{u=(o??(Dv?"production":void 0)!=="production")&&window.__REDUX_DEVTOOLS_EXTENSION__}catch{}if(!u)return t(r,n,i);const{connection:d,...h}=PB(a,u,c);let f=!0;i.setState=(m,b,v)=>{const y=r(m,b);if(!f)return y;const x=v===void 0?{type:s||AB(new Error().stack)||"anonymous"}:typeof v=="string"?{type:v}:v;return a===void 0?(d==null||d.send(x,n()),y):(d==null||d.send({...x,type:`${a}/${x.type}`},{...zl(c.name),[a]:i.getState()}),y)},i.devtools={cleanup:()=>{d&&typeof d.unsubscribe=="function"&&d.unsubscribe(),OB(c.name,a)}};const p=(...m)=>{const b=f;f=!1,r(...m),f=b},g=t(i.setState,n,i);if(h.type==="untracked"?d==null||d.init(g):(h.stores[h.store]=i,d==null||d.init(Object.fromEntries(Object.entries(h.stores).map(([m,b])=>[m,m===h.store?g:b.getState()])))),i.dispatchFromDevtools&&typeof i.dispatch=="function"){let m=!1;const b=i.dispatch;i.dispatch=(...v)=>{(Dv?"production":void 0)!=="production"&&v[0].type==="__setState"&&!m&&(console.warn('[zustand devtools middleware] "__setState" action type is reserved to set state from the devtools. Avoid using it.'),m=!0),b(...v)}}return d.subscribe(m=>{var b;switch(m.type){case"ACTION":if(typeof m.payload!="string"){console.error("[zustand devtools middleware] Unsupported action format");return}return kd(m.payload,v=>{if(v.type==="__setState"){if(a===void 0){p(v.state);return}Object.keys(v.state).length!==1&&console.error(`
                    [zustand devtools middleware] Unsupported __setState action format.
                    When using 'store' option in devtools(), the 'state' should have only one key, which is a value of 'store' that was passed in devtools(),
                    and value of this only key should be a state object. Example: { "type": "__setState", "state": { "abc123Store": { "foo": "bar" } } }
                    `);const y=v.state[a];if(y==null)return;JSON.stringify(i.getState())!==JSON.stringify(y)&&p(y);return}i.dispatchFromDevtools&&typeof i.dispatch=="function"&&i.dispatch(v)});case"DISPATCH":switch(m.payload.type){case"RESET":return p(g),a===void 0?d==null?void 0:d.init(i.getState()):d==null?void 0:d.init(zl(c.name));case"COMMIT":if(a===void 0){d==null||d.init(i.getState());return}return d==null?void 0:d.init(zl(c.name));case"ROLLBACK":return kd(m.state,v=>{if(a===void 0){p(v),d==null||d.init(i.getState());return}p(v[a]),d==null||d.init(zl(c.name))});case"JUMP_TO_STATE":case"JUMP_TO_ACTION":return kd(m.state,v=>{if(a===void 0){p(v);return}JSON.stringify(i.getState())!==JSON.stringify(v[a])&&p(v[a])});case"IMPORT_STATE":{const{nextLiftedState:v}=m.payload,y=(b=v.computedStates.slice(-1)[0])==null?void 0:b.state;if(!y)return;p(a===void 0?y:y[a]),d==null||d.send(null,v);return}case"PAUSE_RECORDING":return f=!f}return}}),g},IB=$B,kd=(t,e)=>{let r;try{r=JSON.parse(t)}catch(n){console.error("[zustand devtools middleware] Could not parse the received json",n)}r!==void 0&&e(r)},jd={surface:{width_mm:28e3,length_mm:15e3,color:{tpv_code:"RH12",hex:"#006C55",name:"Dark Green"}},courts:{},selectedCourtId:null,tracks:{},selectedTrackId:null,elementOrder:[],customMarkings:[],backgroundZones:[],designName:"Untitled Sports Surface",designDescription:"",designTags:[],history:[],historyIndex:-1,maxHistory:50,showCourtLibrary:!0,showPropertiesPanel:!0,propertiesPanelUserClosed:!1,showColorEditor:!1,snapToGrid:!0,gridSize_mm:100,isSaving:!1,lastSaved:null},Gt=NB(IB((t,e)=>({...jd,setSurfaceDimensions:(r,n)=>{t(i=>({surface:{...i.surface,width_mm:r,length_mm:n}})),e().addToHistory()},setSurfaceColor:r=>{t(n=>({surface:{...n.surface,color:r}})),e().addToHistory()},addCourt:(r,n)=>{const i=`court-${Date.now()}`,o=d=>({RH01:{tpv_code:"RH01",hex:"#A5362F",name:"Standard Red"},RH02:{tpv_code:"RH02",hex:"#E21F2F",name:"Bright Red"},RH10:{tpv_code:"RH10",hex:"#609B63",name:"Standard Green"},RH11:{tpv_code:"RH11",hex:"#3BB44A",name:"Bright Green"},RH12:{tpv_code:"RH12",hex:"#006C55",name:"Dark Green"},RH20:{tpv_code:"RH20",hex:"#0075BC",name:"Standard Blue"},RH21:{tpv_code:"RH21",hex:"#493D8C",name:"Purple"},RH22:{tpv_code:"RH22",hex:"#47AFE3",name:"Light Blue"},RH23:{tpv_code:"RH23",hex:"#039DC4",name:"Azure"},RH26:{tpv_code:"RH26",hex:"#00A6A3",name:"Turquoise"},RH30:{tpv_code:"RH30",hex:"#E4C4AA",name:"Standard Beige"},RH31:{tpv_code:"RH31",hex:"#E8E3D8",name:"Cream"},RH32:{tpv_code:"RH32",hex:"#8B5F3C",name:"Brown"},RH40:{tpv_code:"RH40",hex:"#E5A144",name:"Mustard Yellow"},RH41:{tpv_code:"RH41",hex:"#FFD833",name:"Bright Yellow"},RH50:{tpv_code:"RH50",hex:"#F15B32",name:"Orange"},RH60:{tpv_code:"RH60",hex:"#59595B",name:"Dark Grey"},RH61:{tpv_code:"RH61",hex:"#939598",name:"Light Grey"},RH65:{tpv_code:"RH65",hex:"#D9D9D6",name:"Pale Grey"},RH70:{tpv_code:"RH70",hex:"#231F20",name:"Black"},RH90:{tpv_code:"RH90",hex:"#E8457E",name:"Funky Pink"}})[d]||{tpv_code:"RH31",hex:"#E8E3D8",name:"Cream"},s={};if(n.defaultLineColor){const d=o(n.defaultLineColor);n.markings.forEach(h=>{s[h.id]=d})}const a={};if(n.defaultLineColor&&n.zones){const d=o(n.defaultLineColor);n.zones.forEach(h=>{a[h.id]=d})}const c=n.defaultSurfaceColor?o(n.defaultSurfaceColor):null,u={id:i,templateId:r,template:n,position:{x:e().surface.width_mm/2-n.dimensions.width_mm/2,y:e().surface.length_mm/2-n.dimensions.length_mm/2},rotation:0,scale:1,lineColorOverrides:s,zoneColorOverrides:a,courtSurfaceColor:c};t(d=>({courts:{...d.courts,[i]:u},elementOrder:[...d.elementOrder,i],selectedCourtId:i,selectedTrackId:null})),e().addToHistory()},removeCourt:r=>{const{[r]:n,...i}=e().courts;t(o=>({courts:i,elementOrder:o.elementOrder.filter(s=>s!==r),selectedCourtId:o.selectedCourtId===r?null:o.selectedCourtId})),e().addToHistory()},updateCourtPosition:(r,n)=>{t(i=>({courts:{...i.courts,[r]:{...i.courts[r],position:n}}}))},updateCourtRotation:(r,n)=>{t(i=>({courts:{...i.courts,[r]:{...i.courts[r],rotation:n}}}))},updateCourtScale:(r,n)=>{t(i=>({courts:{...i.courts,[r]:{...i.courts[r],scale:n}}}))},duplicateCourt:r=>{const n=e().courts[r];if(!n)return;const i=`court-${Date.now()}`,o={...n,id:i,position:{x:n.position.x+500,y:n.position.y+500}};t(s=>({courts:{...s.courts,[i]:o},elementOrder:[...s.elementOrder,i],selectedCourtId:i,selectedTrackId:null})),e().addToHistory()},setLineColor:(r,n,i)=>{t(o=>({courts:{...o.courts,[r]:{...o.courts[r],lineColorOverrides:{...o.courts[r].lineColorOverrides,[n]:i}}}})),e().addToHistory()},setZoneColor:(r,n,i)=>{t(o=>({courts:{...o.courts,[r]:{...o.courts[r],zoneColorOverrides:{...o.courts[r].zoneColorOverrides,[n]:i}}}})),e().addToHistory()},resetCourtColors:r=>{t(n=>({courts:{...n.courts,[r]:{...n.courts[r],lineColorOverrides:{},zoneColorOverrides:{}}}})),e().addToHistory()},setCourtSurfaceColor:(r,n)=>{t(i=>({courts:{...i.courts,[r]:{...i.courts[r],courtSurfaceColor:n}}})),e().addToHistory()},selectCourt:r=>{const{propertiesPanelUserClosed:n}=e();t(n?{selectedCourtId:r,selectedTrackId:null}:{selectedCourtId:r,selectedTrackId:null,showPropertiesPanel:!0})},deselectCourt:()=>{t({selectedCourtId:null,showPropertiesPanel:!1,propertiesPanelUserClosed:!0})},setElementOrder:r=>{t({elementOrder:r})},moveElementUp:r=>{const{elementOrder:n}=e(),i=n.indexOf(r);if(i<n.length-1){const o=[...n];[o[i],o[i+1]]=[o[i+1],o[i]],t({elementOrder:o}),e().addToHistory()}},moveElementDown:r=>{const{elementOrder:n}=e(),i=n.indexOf(r);if(i>0){const o=[...n];[o[i],o[i-1]]=[o[i-1],o[i]],t({elementOrder:o}),e().addToHistory()}},bringToFront:r=>{const{elementOrder:n}=e(),i=n.filter(o=>o!==r);i.push(r),t({elementOrder:i}),e().addToHistory()},sendToBack:r=>{const{elementOrder:n}=e(),i=n.filter(o=>o!==r);i.unshift(r),t({elementOrder:i}),e().addToHistory()},addTrack:(r,n)=>{const i=`track-${Date.now()}`,o=e().surface,s=o.width_mm,a=o.length_mm,c=m=>({RH01:{tpv_code:"RH01",hex:"#A5362F",name:"Standard Red"},RH31:{tpv_code:"RH31",hex:"#E8E3D8",name:"Cream"},RH30:{tpv_code:"RH30",hex:"#E4C4AA",name:"Standard Beige"},RH20:{tpv_code:"RH20",hex:"#0075BC",name:"Standard Blue"},RH12:{tpv_code:"RH12",hex:"#006C55",name:"Dark Green"}})[m]||{tpv_code:m,hex:"#A5362F",name:"Standard Red"},u=n.defaultTrackSurfaceColor?c(n.defaultTrackSurfaceColor):c("RH01"),d=n.trackType==="straight";let h,f,p;if(d){const m=n.parameters.numLanes,b=n.parameters.laneWidth_mm,v=m*b,y=Math.max(s,a)*.9,x=n.parameters.height_mm||1e5,S=Math.min(x,y);h={...n.parameters,width_mm:v,height_mm:S,cornerRadius:{topLeft:0,topRight:0,bottomLeft:0,bottomRight:0},laneWidth_mm:b},p=90,f={x:s/2-v/2,y:a/2-S/2}}else{const m=s*.9,b=a*.9,v=n.parameters.width_mm||25e3,y=n.parameters.height_mm||15e3,x=m/v,S=b/y,j=Math.min(x,S),_=n.parameters.cornerRadius||{topLeft:3e3,topRight:3e3,bottomLeft:3e3,bottomRight:3e3},C={topLeft:_.topLeft*j,topRight:_.topRight*j,bottomLeft:_.bottomLeft*j,bottomRight:_.bottomRight*j};h={...n.parameters,width_mm:m,height_mm:b,cornerRadius:C,laneWidth_mm:n.parameters.laneWidth_mm},p=0,f={x:s/2-m/2,y:a/2-b/2}}const g={id:i,templateId:r,template:n,position:f,rotation:p,parameters:h,trackSurfaceColor:u};t(m=>({tracks:{...m.tracks,[i]:g},elementOrder:[...m.elementOrder,i],selectedTrackId:i,selectedCourtId:null})),e().addToHistory()},removeTrack:r=>{const{[r]:n,...i}=e().tracks;t(o=>({tracks:i,elementOrder:o.elementOrder.filter(s=>s!==r),selectedTrackId:o.selectedTrackId===r?null:o.selectedTrackId})),e().addToHistory()},updateTrackParameters:(r,n)=>{t(i=>{var d;const o=i.tracks[r];if(!o)return i;const s=o.parameters,a={...s,...n},c=((d=o.template)==null?void 0:d.trackType)==="straight";let u=o.position;if(c&&n.numLanes!==void 0&&n.numLanes!==s.numLanes){const h=s.laneWidth_mm,f=s.numLanes*h,p=n.numLanes*h;a.width_mm=p;const g=o.position.x+f/2,m=o.position.y+s.height_mm/2;u={x:g-p/2,y:m-a.height_mm/2}}return{tracks:{...i.tracks,[r]:{...o,parameters:a,position:u}}}}),e().addToHistory()},updateTrackPosition:(r,n)=>{t(i=>({tracks:{...i.tracks,[r]:{...i.tracks[r],position:n}}}))},updateTrackRotation:(r,n)=>{t(i=>({tracks:{...i.tracks,[r]:{...i.tracks[r],rotation:n}}}))},setTrackSurfaceColor:(r,n)=>{t(i=>({tracks:{...i.tracks,[r]:{...i.tracks[r],trackSurfaceColor:n}}})),e().addToHistory()},selectTrack:r=>{const{propertiesPanelUserClosed:n}=e();t(n?{selectedTrackId:r,selectedCourtId:null}:{selectedTrackId:r,selectedCourtId:null,showPropertiesPanel:!0})},deselectTrack:()=>{t({selectedTrackId:null,showPropertiesPanel:!1,propertiesPanelUserClosed:!0})},addCustomMarking:r=>{t(n=>({customMarkings:[...n.customMarkings,{...r,id:`custom-${Date.now()}`}]})),e().addToHistory()},removeCustomMarking:r=>{t(n=>({customMarkings:n.customMarkings.filter(i=>i.id!==r)})),e().addToHistory()},addBackgroundZone:r=>{t(n=>({backgroundZones:[...n.backgroundZones,{...r,id:`zone-${Date.now()}`}]})),e().addToHistory()},removeBackgroundZone:r=>{t(n=>({backgroundZones:n.backgroundZones.filter(i=>i.id!==r)})),e().addToHistory()},setDesignName:r=>{t({designName:r})},setDesignDescription:r=>{t({designDescription:r})},setDesignTags:r=>{t({designTags:r})},addToHistory:()=>{const r=e(),n={surface:r.surface,courts:r.courts,tracks:r.tracks,elementOrder:r.elementOrder,customMarkings:r.customMarkings,backgroundZones:r.backgroundZones};t(i=>{const o=i.history.slice(0,i.historyIndex+1);return o.push(n),o.length>i.maxHistory&&o.shift(),{history:o,historyIndex:o.length-1}})},undo:()=>{const{history:r,historyIndex:n}=e();if(n>0){const i=r[n-1];t({...i,historyIndex:n-1})}},redo:()=>{const{history:r,historyIndex:n}=e();if(n<r.length-1){const i=r[n+1];t({...i,historyIndex:n+1})}},canUndo:()=>e().historyIndex>0,canRedo:()=>e().historyIndex<e().history.length-1,toggleCourtLibrary:()=>{t(r=>({showCourtLibrary:!r.showCourtLibrary}))},togglePropertiesPanel:()=>{t(r=>({showPropertiesPanel:!r.showPropertiesPanel,propertiesPanelUserClosed:!!r.showPropertiesPanel}))},toggleColorEditor:()=>{t(r=>({showColorEditor:!r.showColorEditor}))},toggleSnapToGrid:()=>{t(r=>({snapToGrid:!r.snapToGrid}))},setGridSize:r=>{t({gridSize_mm:r})},setSaving:r=>{t({isSaving:r})},setLastSaved:r=>{t({lastSaved:r})},loadDesign:r=>{let n=r.elementOrder;!n&&(r.courtOrder||r.trackOrder)&&(n=[...r.trackOrder||[],...r.courtOrder||[]]),t({surface:r.surface||jd.surface,courts:r.courts||{},tracks:r.tracks||{},elementOrder:n||[],customMarkings:r.customMarkings||[],backgroundZones:r.backgroundZones||[],designName:r.name||"Untitled Sports Surface",designDescription:r.description||"",designTags:r.tags||[],selectedCourtId:null,selectedTrackId:null,history:[],historyIndex:-1}),e().addToHistory()},exportDesignData:()=>{const r=e();return{surface:r.surface,courts:r.courts,tracks:r.tracks,elementOrder:r.elementOrder,customMarkings:r.customMarkings,backgroundZones:r.backgroundZones,name:r.designName,description:r.designDescription,tags:r.designTags}},resetDesign:()=>{t(jd)}}),{name:"SportsDesignStore"})),A1={"basketball-full":{id:"basketball-full",name:"Basketball (Full Court)",sport:"basketball",standard:"FIBA 2020",category:"court",description:"Official FIBA standard full basketball court with all markings",dimensions:{length_mm:28e3,width_mm:15e3,min_surround_mm:2e3},defaultSurfaceColor:"RH20",defaultLineColor:"RH31",defaultLineWidth_mm:50,markings:[{id:"boundary",name:"Boundary Lines",type:"rectangle",params:{x:0,y:0,width:15e3,height:28e3},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"boundary"},{id:"center-line",name:"Center Line",type:"line",params:{x1:0,y1:14e3,x2:15e3,y2:14e3},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"center-circle",name:"Center Circle",type:"circle",params:{cx:7500,cy:14e3,radius:1800},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"three-point-arc-top",name:"Three-Point Arc (Top)",type:"arc",params:{cx:7500,cy:26425,radius:6750,startAngle:192,endAngle:348},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"three-point-arc-bottom",name:"Three-Point Arc (Bottom)",type:"arc",params:{cx:7500,cy:1575,radius:6750,startAngle:12,endAngle:168},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"three-point-line-bottom-left",name:"Three-Point Line Bottom Left",type:"line",params:{x1:900,y1:0,x2:900,y2:2990},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"three-point-line-bottom-right",name:"Three-Point Line Bottom Right",type:"line",params:{x1:14100,y1:0,x2:14100,y2:2990},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"three-point-line-top-left",name:"Three-Point Line Top Left",type:"line",params:{x1:900,y1:25010,x2:900,y2:28e3},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"three-point-line-top-right",name:"Three-Point Line Top Right",type:"line",params:{x1:14100,y1:25010,x2:14100,y2:28e3},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"free-throw-line-top",name:"Free Throw Line (Top)",type:"line",params:{x1:5050,y1:22200,x2:9950,y2:22200},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"free-throw-line-bottom",name:"Free Throw Line (Bottom)",type:"line",params:{x1:5050,y1:5800,x2:9950,y2:5800},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"free-throw-circle-top",name:"Free Throw Circle (Top)",type:"circle",params:{cx:7500,cy:22200,radius:1800},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"free-throw-circle-bottom",name:"Free Throw Circle (Bottom)",type:"circle",params:{cx:7500,cy:5800,radius:1800},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"key-lane-top",name:"Key Lane (Top)",type:"rectangle",params:{x:5050,y:22200,width:4900,height:5800},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"key-lane-bottom",name:"Key Lane (Bottom)",type:"rectangle",params:{x:5050,y:0,width:4900,height:5800},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"restricted-area-top",name:"Restricted Area (Top)",type:"arc",params:{cx:7500,cy:28e3,radius:1250,startAngle:180,endAngle:360},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"restricted-area-bottom",name:"Restricted Area (Bottom)",type:"arc",params:{cx:7500,cy:0,radius:1250,startAngle:0,endAngle:180},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"}],zones:[{id:"key-area-top",name:"Key Area (Top)",type:"rectangle",params:{x:5050,y:22200,width:4900,height:5800},defaultColor:"RH20",paintable:!0,area_m2:28.42},{id:"key-area-bottom",name:"Key Area (Bottom)",type:"rectangle",params:{x:5050,y:0,width:4900,height:5800},defaultColor:"RH20",paintable:!0,area_m2:28.42}]},"netball-full":{id:"netball-full",name:"Netball (Full Court)",sport:"netball",standard:"World Netball 2020",category:"court",description:"Official World Netball standard court with goal circles and thirds",dimensions:{length_mm:30500,width_mm:15250,min_surround_mm:3050},defaultSurfaceColor:"RH01",defaultLineColor:"RH31",defaultLineWidth_mm:50,markings:[{id:"boundary",name:"Boundary Lines",type:"rectangle",params:{x:0,y:0,width:15250,height:30500},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"boundary"},{id:"transverse-line-1",name:"Transverse Line 1",type:"line",params:{x1:0,y1:10167,x2:15250,y2:10167},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"transverse-line-2",name:"Transverse Line 2",type:"line",params:{x1:0,y1:20333,x2:15250,y2:20333},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"center-circle",name:"Center Circle",type:"circle",params:{cx:7625,cy:15250,radius:450},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"goal-circle-bottom",name:"Goal Circle (Bottom)",type:"arc",params:{cx:7625,cy:0,radius:4900,startAngle:0,endAngle:180},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"goal-circle-top",name:"Goal Circle (Top)",type:"arc",params:{cx:7625,cy:30500,radius:4900,startAngle:180,endAngle:360},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"}],zones:[]},"tennis-doubles":{id:"tennis-doubles",name:"Tennis (Doubles)",sport:"tennis",standard:"ITF 2020",category:"court",description:"Official ITF standard doubles tennis court with all service boxes",dimensions:{length_mm:23770,width_mm:10970,min_surround_mm:3660},defaultSurfaceColor:"RH22",defaultLineColor:"RH29",defaultLineWidth_mm:50,markings:[{id:"boundary",name:"Boundary Lines",type:"rectangle",params:{x:0,y:0,width:10970,height:23770},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"boundary"},{id:"singles-sideline-left",name:"Singles Sideline (Left)",type:"line",params:{x1:1370,y1:0,x2:1370,y2:23770},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"singles-sideline-right",name:"Singles Sideline (Right)",type:"line",params:{x1:9600,y1:0,x2:9600,y2:23770},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"service-line-bottom",name:"Service Line (Bottom)",type:"line",params:{x1:0,y1:6400,x2:10970,y2:6400},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"service-line-top",name:"Service Line (Top)",type:"line",params:{x1:0,y1:17370,x2:10970,y2:17370},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"center-service-line",name:"Center Service Line",type:"line",params:{x1:5485,y1:6400,x2:5485,y2:17370},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"center-mark-bottom",name:"Center Mark (Bottom)",type:"line",params:{x1:5485,y1:0,x2:5485,y2:100},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"center-mark-top",name:"Center Mark (Top)",type:"line",params:{x1:5485,y1:23670,x2:5485,y2:23770},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"}],zones:[]},"futsal-standard":{id:"futsal-standard",name:"Futsal (5-a-side)",sport:"futsal",standard:"FIFA 2020",category:"court",description:"Official FIFA standard futsal court for international matches",dimensions:{length_mm:4e4,width_mm:2e4,min_surround_mm:1e3},defaultSurfaceColor:"RH50",defaultLineColor:"RH30",defaultLineWidth_mm:80,markings:[{id:"boundary",name:"Boundary Lines",type:"rectangle",params:{x:0,y:0,width:2e4,height:4e4},defaultColor:"RH31",lineWidth_mm:80,required:!0,category:"boundary"},{id:"center-line",name:"Center Line",type:"line",params:{x1:0,y1:2e4,x2:2e4,y2:2e4},defaultColor:"RH31",lineWidth_mm:80,required:!0,category:"court-marking"},{id:"center-circle",name:"Center Circle",type:"circle",params:{cx:1e4,cy:2e4,radius:3e3},defaultColor:"RH31",lineWidth_mm:80,required:!0,category:"court-marking"},{id:"center-spot",name:"Center Spot",type:"circle",params:{cx:1e4,cy:2e4,radius:100},defaultColor:"RH31",lineWidth_mm:80,required:!0,category:"court-marking"},{id:"penalty-area-bottom",name:"Penalty Area (Bottom)",type:"arc",params:{cx:1e4,cy:0,radius:6e3,startAngle:0,endAngle:180},defaultColor:"RH31",lineWidth_mm:80,required:!0,category:"court-marking"},{id:"penalty-area-top",name:"Penalty Area (Top)",type:"arc",params:{cx:1e4,cy:4e4,radius:6e3,startAngle:180,endAngle:360},defaultColor:"RH31",lineWidth_mm:80,required:!0,category:"court-marking"},{id:"penalty-mark-bottom",name:"Penalty Mark (Bottom)",type:"circle",params:{cx:1e4,cy:6e3,radius:100},defaultColor:"RH31",lineWidth_mm:80,required:!0,category:"court-marking"},{id:"penalty-mark-top",name:"Penalty Mark (Top)",type:"circle",params:{cx:1e4,cy:34e3,radius:100},defaultColor:"RH31",lineWidth_mm:80,required:!0,category:"court-marking"},{id:"second-penalty-mark-bottom",name:"Second Penalty Mark (Bottom)",type:"circle",params:{cx:1e4,cy:1e4,radius:100},defaultColor:"RH31",lineWidth_mm:80,required:!0,category:"court-marking"},{id:"second-penalty-mark-top",name:"Second Penalty Mark (Top)",type:"circle",params:{cx:1e4,cy:3e4,radius:100},defaultColor:"RH31",lineWidth_mm:80,required:!0,category:"court-marking"},{id:"corner-arc-bl",name:"Corner Arc (Bottom Left)",type:"arc",params:{cx:0,cy:0,radius:250,startAngle:0,endAngle:90},defaultColor:"RH31",lineWidth_mm:80,required:!0,category:"court-marking"},{id:"corner-arc-br",name:"Corner Arc (Bottom Right)",type:"arc",params:{cx:2e4,cy:0,radius:250,startAngle:90,endAngle:180},defaultColor:"RH31",lineWidth_mm:80,required:!0,category:"court-marking"},{id:"corner-arc-tl",name:"Corner Arc (Top Left)",type:"arc",params:{cx:0,cy:4e4,radius:250,startAngle:270,endAngle:360},defaultColor:"RH31",lineWidth_mm:80,required:!0,category:"court-marking"},{id:"corner-arc-tr",name:"Corner Arc (Top Right)",type:"arc",params:{cx:2e4,cy:4e4,radius:250,startAngle:180,endAngle:270},defaultColor:"RH31",lineWidth_mm:80,required:!0,category:"court-marking"}],zones:[]},"volleyball-indoor":{id:"volleyball-indoor",name:"Volleyball (Indoor)",sport:"volleyball",standard:"FIVB",category:"court",description:"Official FIVB standard indoor volleyball court with attack lines",dimensions:{length_mm:18e3,width_mm:9e3,min_surround_mm:3e3},defaultSurfaceColor:"RH40",defaultLineColor:"RH29",defaultLineWidth_mm:50,markings:[{id:"boundary",name:"Boundary Lines",type:"rectangle",params:{x:0,y:0,width:9e3,height:18e3},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"boundary"},{id:"center-line",name:"Center Line",type:"line",params:{x1:0,y1:9e3,x2:9e3,y2:9e3},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"attack-line-bottom",name:"Attack Line (Bottom)",type:"line",params:{x1:0,y1:6e3,x2:9e3,y2:6e3},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"attack-line-top",name:"Attack Line (Top)",type:"line",params:{x1:0,y1:12e3,x2:9e3,y2:12e3},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"}],zones:[]},"badminton-full":{id:"badminton-full",name:"Badminton (Full Court)",sport:"badminton",standard:"BWF",category:"court",description:"Official BWF standard full badminton court with singles and doubles lines",dimensions:{length_mm:13400,width_mm:6100,min_surround_mm:1e3},defaultSurfaceColor:"RH26",defaultLineColor:"RH12",defaultLineWidth_mm:40,markings:[{id:"boundary",name:"Boundary Lines (Doubles)",type:"rectangle",params:{x:0,y:0,width:6100,height:13400},defaultColor:"RH31",lineWidth_mm:40,required:!0,category:"boundary"},{id:"singles-sideline-left",name:"Singles Sideline (Left)",type:"line",params:{x1:460,y1:0,x2:460,y2:13400},defaultColor:"RH31",lineWidth_mm:40,required:!0,category:"court-marking"},{id:"singles-sideline-right",name:"Singles Sideline (Right)",type:"line",params:{x1:5640,y1:0,x2:5640,y2:13400},defaultColor:"RH31",lineWidth_mm:40,required:!0,category:"court-marking"},{id:"short-service-line-bottom",name:"Short Service Line (Bottom)",type:"line",params:{x1:0,y1:1980,x2:6100,y2:1980},defaultColor:"RH31",lineWidth_mm:40,required:!0,category:"court-marking"},{id:"short-service-line-top",name:"Short Service Line (Top)",type:"line",params:{x1:0,y1:11420,x2:6100,y2:11420},defaultColor:"RH31",lineWidth_mm:40,required:!0,category:"court-marking"},{id:"doubles-long-service-line-bottom",name:"Doubles Long Service Line (Bottom)",type:"line",params:{x1:0,y1:760,x2:6100,y2:760},defaultColor:"RH31",lineWidth_mm:40,required:!0,category:"court-marking"},{id:"doubles-long-service-line-top",name:"Doubles Long Service Line (Top)",type:"line",params:{x1:0,y1:12640,x2:6100,y2:12640},defaultColor:"RH31",lineWidth_mm:40,required:!0,category:"court-marking"},{id:"center-service-line",name:"Center Service Line",type:"line",params:{x1:3050,y1:1980,x2:3050,y2:11420},defaultColor:"RH31",lineWidth_mm:40,required:!0,category:"court-marking"}],zones:[]},"pickleball-standard":{id:"pickleball-standard",name:"Pickleball",sport:"pickleball",standard:"USA Pickleball",category:"court",description:"Official USA Pickleball standard court with non-volley zone (kitchen)",dimensions:{length_mm:13410,width_mm:6100,min_surround_mm:1e3},defaultSurfaceColor:"RH11",defaultLineColor:"RH31",defaultLineWidth_mm:50,markings:[{id:"boundary",name:"Boundary Lines",type:"rectangle",params:{x:0,y:0,width:6100,height:13410},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"boundary"},{id:"non-volley-zone-line-bottom",name:"Non-Volley Zone Line (Bottom)",type:"line",params:{x1:0,y1:2130,x2:6100,y2:2130},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"non-volley-zone-line-top",name:"Non-Volley Zone Line (Top)",type:"line",params:{x1:0,y1:11280,x2:6100,y2:11280},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"center-line",name:"Center Line (Net)",type:"line",params:{x1:0,y1:6705,x2:6100,y2:6705},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"},{id:"center-service-line",name:"Center Service Line",type:"line",params:{x1:3050,y1:0,x2:3050,y2:13410},defaultColor:"RH31",lineWidth_mm:50,required:!0,category:"court-marking"}],zones:[]}};function MB(){return Object.values(A1)}function LB(t){return A1[t]||null}function DB(t,e,r){const{type:n,params:i}=t;switch(n){case"line":return FB(i,e,r);case"rectangle":return BB(i,e,r);case"circle":return UB(i,e,r);case"arc":return HB(i,e,r);case"polyline":return WB(i,e,r);default:return console.warn(`Unknown marking type: ${n}`),null}}function zB(t,e){const{type:r,params:n}=t;switch(r){case"rectangle":return{type:"rect",x:n.x,y:n.y,width:n.width,height:n.height,fill:e};case"circle":return{type:"circle",cx:n.cx,cy:n.cy,r:n.radius,fill:e};case"polygon":return{type:"polygon",points:n.points,fill:e};default:return console.warn(`Unknown zone type: ${r}`),null}}function FB(t,e,r){return{type:"line",x1:t.x1,y1:t.y1,x2:t.x2,y2:t.y2,stroke:e,strokeWidth:r}}function BB(t,e,r){return{type:"rect",x:t.x,y:t.y,width:t.width,height:t.height,stroke:e,strokeWidth:r,fill:"none"}}function UB(t,e,r){return{type:"circle",cx:t.cx,cy:t.cy,r:t.radius,stroke:e,strokeWidth:r,fill:"none"}}function HB(t,e,r){const{cx:n,cy:i,radius:o,startAngle:s,endAngle:a}=t,c=s*Math.PI/180,u=a*Math.PI/180,d=n+o*Math.cos(c),h=i+o*Math.sin(c),f=n+o*Math.cos(u),p=i+o*Math.sin(u),g=a-s>180?1:0;return{type:"path",d:`M ${d} ${h} A ${o} ${o} 0 ${g} 1 ${f} ${p}`,stroke:e,strokeWidth:r,fill:"none"}}function WB(t,e,r){return{type:"polyline",points:t.points.map(i=>`${i[0]},${i[1]}`).join(" "),stroke:e,strokeWidth:r,fill:"none"}}function zv(t){if(t&&t.startsWith("#"))return t;const e=en.find(r=>r.code===t);return e?e.hex:"#000000"}function GB(t){var s;const{template:e,lineColorOverrides:r,zoneColorOverrides:n}=t;if(!e)return console.error("No template provided for court"),{markings:[],zones:[]};const i=e.markings.map(a=>{var h;const c=((h=r[a.id])==null?void 0:h.hex)||e.defaultLineColor,u=zv(c),d=a.lineWidth_mm||e.defaultLineWidth_mm;return{id:a.id,name:a.name,...DB(a,u,d)}}).filter(Boolean),o=((s=e.zones)==null?void 0:s.map(a=>{var d;const c=((d=n[a.id])==null?void 0:d.hex)||a.defaultColor,u=zv(c);return{id:a.id,name:a.name,...zB(a,u)}}).filter(Boolean))||[];return{markings:i,zones:o}}function Fv(t,e){return Math.round(t/e)*e}function VB(t,e){return{x:Fv(t.x,e),y:Fv(t.y,e)}}function $1(t){let e=t%360;return e<0&&(e+=360),e}function qB(t,e,r){const{width_mm:n,length_mm:i}=e,{width_mm:o,length_mm:s}=r,a=500,c=-(n-a),u=o-a,d=-(i-a),h=s-a;return{x:Math.max(c,Math.min(t.x,u)),y:Math.max(d,Math.min(t.y,h))}}function KB(t){const{position:e,rotation:r,scale:n,template:i}=t,o=i.dimensions.width_mm/2,s=i.dimensions.length_mm/2;return`translate(${e.x}, ${e.y}) scale(${n}) rotate(${r}, ${o}, ${s})`}function YB({court:t,svgRef:e}){const{updateCourtRotation:r,updateCourtScale:n,updateCourtPosition:i,addToHistory:o}=Gt(),[s,a]=M.useState(!1),[c,u]=M.useState(!1),[d,h]=M.useState(null),[f,p]=M.useState(null),{template:g,position:m,rotation:b,scale:v}=t,y=g.dimensions.width_mm*v,x=g.dimensions.length_mm*v,S=m.x+g.dimensions.width_mm*v/2,j=m.y+g.dimensions.length_mm*v/2,_=g.dimensions.width_mm/2,C=-1e3,R=(w,z)=>{if(!e.current)return{x:0,y:0};const Z=e.current.createSVGPoint();Z.x=w,Z.y=z;const q=Z.matrixTransform(e.current.getScreenCTM().inverse());return{x:q.x,y:q.y}},T=w=>{w.stopPropagation(),a(!0),p({x:w.clientX,y:w.clientY})},P=(w,z)=>{w.stopPropagation(),u(!0),h(z),p({x:w.clientX,y:w.clientY,initialScale:v,initialWidth:y,initialHeight:x,initialPosition:{...m}})};M.useEffect(()=>{if(!s&&!c)return;const w=Z=>{if(s){const q=R(Z.clientX,Z.clientY),V=q.x-S,A=q.y-j;let K=Math.atan2(A,V)*(180/Math.PI)+90;K=$1(K),Z.shiftKey&&(K=Math.round(K/15)*15),r(t.id,K)}else if(c&&f){const q=R(Z.clientX,Z.clientY),V=R(f.x,f.y),A=q.x-V.x,K=q.y-V.y;let L=f.initialScale,B={...m};switch(d){case"se":L=Math.max(.3,f.initialScale+A/g.dimensions.width_mm);break;case"nw":L=Math.max(.3,f.initialScale-A/g.dimensions.width_mm),B.x=f.initialPosition.x+(f.initialWidth-g.dimensions.width_mm*L),B.y=f.initialPosition.y+(f.initialHeight-g.dimensions.length_mm*L);break;case"ne":L=Math.max(.3,f.initialScale+A/g.dimensions.width_mm),B.y=f.initialPosition.y+(f.initialHeight-g.dimensions.length_mm*L);break;case"sw":L=Math.max(.3,f.initialScale-A/g.dimensions.width_mm),B.x=f.initialPosition.x+(f.initialWidth-g.dimensions.width_mm*L);break;case"e":L=Math.max(.3,f.initialScale+A/g.dimensions.width_mm);break;case"w":L=Math.max(.3,f.initialScale-A/g.dimensions.width_mm),B.x=f.initialPosition.x+(f.initialWidth-g.dimensions.width_mm*L);break;case"n":L=Math.max(.3,f.initialScale-K/g.dimensions.length_mm),B.y=f.initialPosition.y+(f.initialHeight-g.dimensions.length_mm*L);break;case"s":L=Math.max(.3,f.initialScale+K/g.dimensions.length_mm);break}L=Math.min(3,Math.max(.3,L)),n(t.id,L),(B.x!==m.x||B.y!==m.y)&&i(t.id,B)}},z=()=>{(s||c)&&o(),a(!1),u(!1),h(null),p(null)};return window.addEventListener("mousemove",w),window.addEventListener("mouseup",z),()=>{window.removeEventListener("mousemove",w),window.removeEventListener("mouseup",z)}},[s,c,f,S,j,t.id,m,v,d]);const H=[{type:"nw",x:0,y:0,cursor:"nwse-resize"},{type:"n",x:g.dimensions.width_mm/2,y:0,cursor:"ns-resize"},{type:"ne",x:g.dimensions.width_mm,y:0,cursor:"nesw-resize"},{type:"e",x:g.dimensions.width_mm,y:g.dimensions.length_mm/2,cursor:"ew-resize"},{type:"se",x:g.dimensions.width_mm,y:g.dimensions.length_mm,cursor:"nwse-resize"},{type:"s",x:g.dimensions.width_mm/2,y:g.dimensions.length_mm,cursor:"ns-resize"},{type:"sw",x:0,y:g.dimensions.length_mm,cursor:"nesw-resize"},{type:"w",x:0,y:g.dimensions.length_mm/2,cursor:"ew-resize"}],E=300,I=250;return l.jsxs("g",{className:"transform-handles",children:[l.jsxs("g",{className:"rotation-handle",onMouseDown:T,style:{cursor:s?"grabbing":"grab"},children:[l.jsx("line",{x1:_,y1:0,x2:_,y2:C+I,stroke:"#007bff",strokeWidth:30,strokeDasharray:"100 50"}),l.jsx("circle",{cx:_,cy:C,r:I,fill:"white",stroke:"#007bff",strokeWidth:40}),l.jsx("path",{d:`M ${_-I*.4} ${C}
              A ${I*.5} ${I*.5} 0 1 1 ${_+I*.4} ${C}`,fill:"none",stroke:"#007bff",strokeWidth:30,strokeLinecap:"round"}),l.jsx("path",{d:`M ${_+I*.4} ${C}
              L ${_+I*.6} ${C-I*.2}
              M ${_+I*.4} ${C}
              L ${_+I*.6} ${C+I*.2}`,fill:"none",stroke:"#007bff",strokeWidth:30,strokeLinecap:"round"})]}),H.map(w=>l.jsx("rect",{className:`scale-handle scale-handle--${w.type}`,x:w.x-E/2,y:w.y-E/2,width:E,height:E,fill:"white",stroke:"#007bff",strokeWidth:40,rx:30,ry:30,style:{cursor:c&&d===w.type?"grabbing":w.cursor,pointerEvents:"all"},onMouseDown:z=>P(z,w.type)},w.type)),s&&l.jsxs("text",{x:g.dimensions.width_mm/2,y:-1e3-I-200,textAnchor:"middle",fontSize:400,fill:"#007bff",fontWeight:"bold",style:{pointerEvents:"none"},children:[Math.round(b),"°"]}),c&&l.jsxs("text",{x:g.dimensions.width_mm/2,y:g.dimensions.length_mm+600,textAnchor:"middle",fontSize:400,fill:"#007bff",fontWeight:"bold",style:{pointerEvents:"none"},children:[(v*100).toFixed(0),"%"]})]})}function I1(t){const{width_mm:e,height_mm:r,numLanes:n,laneWidth_mm:i,cornerRadius:o={topLeft:3e3,topRight:3e3,bottomLeft:3e3,bottomRight:3e3},lineWidth_mm:s=50}=t,a=[];if(o.topLeft===0&&o.topRight===0&&o.bottomLeft===0&&o.bottomRight===0){const u=n*i;for(let d=0;d<n;d++){const h=d*i;a.push({laneNumber:d+1,innerPath:null,outerPath:XB(i,r,d),perimeter:2*r/1e3,isParallel:!0,laneX:h,laneWidth:i})}return{lanes:a,totalWidth:u,totalLength:r,usableWidth:u,usableHeight:r,isStraightTrack:!0}}else for(let u=0;u<n;u++){const d=u*i,h=(u+1)*i,f=Math.max(0,e-h*2),p=Math.max(0,r-h*2),g=Math.max(0,e-d*2),m=Math.max(0,r-d*2),b={topLeft:Math.max(0,o.topLeft-h),topRight:Math.max(0,o.topRight-h),bottomLeft:Math.max(0,o.bottomLeft-h),bottomRight:Math.max(0,o.bottomRight-h)},v={topLeft:Math.max(0,o.topLeft-d),topRight:Math.max(0,o.topRight-d),bottomLeft:Math.max(0,o.bottomLeft-d),bottomRight:Math.max(0,o.bottomRight-d)};a.push({laneNumber:u+1,innerPath:Bv(f,p,b,h),outerPath:Bv(g,m,v,d),perimeter:ZB(g,m,v),isParallel:!1})}return{lanes:a,totalWidth:e,totalLength:r,usableWidth:e-n*i*2,usableHeight:r-n*i*2}}function Bv(t,e,r,n=0){if(t<=0||e<=0)return`M ${n} ${n} L ${n} ${n}`;const i=Math.min(t/2,e/2),o=Math.min(r.topLeft,i),s=Math.min(r.topRight,i),a=Math.min(r.bottomRight,i),c=Math.min(r.bottomLeft,i),u=n,d=n+t,h=n,f=n+e;return`
    M ${u+o} ${h}
    L ${d-s} ${h}
    ${s>0?`A ${s} ${s} 0 0 1 ${d} ${h+s}`:""}
    L ${d} ${f-a}
    ${a>0?`A ${a} ${a} 0 0 1 ${d-a} ${f}`:""}
    L ${u+c} ${f}
    ${c>0?`A ${c} ${c} 0 0 1 ${u} ${f-c}`:""}
    L ${u} ${h+o}
    ${o>0?`A ${o} ${o} 0 0 1 ${u+o} ${h}`:""}
    Z
  `.trim().replace(/\s+/g," ")}function XB(t,e,r){const n=r*t;return`M ${n} 0 L ${n+t} 0 L ${n+t} ${e} L ${n} ${e} Z`}function ZB(t,e,r){if(t<=0||e<=0)return 0;const n=Math.min(t/2,e/2),i=Math.min(r.topLeft,n),o=Math.min(r.topRight,n),s=Math.min(r.bottomRight,n),a=Math.min(r.bottomLeft,n),c=t-i-o,u=e-o-s,d=t-s-a,h=e-a-i,f=Math.PI*i/2,p=Math.PI*o/2,g=Math.PI*s/2,m=Math.PI*a/2;return(c+u+d+h+f+p+g+m)/1e3}function M1(t){if(!t||!t.lanes||t.lanes.length===0)return[];const e=t.lanes.length-1,r=t.lanes[e].perimeter;return t.lanes.map((n,i)=>n.perimeter-r)}function Uv(t,e,r){const{width_mm:n,height_mm:i,laneWidth_mm:o,cornerRadius:s={topLeft:3e3,topRight:3e3,bottomLeft:3e3,bottomRight:3e3}}=r,a=t*o,c=Math.max(0,n-a*2),u=Math.max(0,i-a*2),d=Math.min(c/2,u/2),h=Math.min(Math.max(0,s.topLeft-a),d),f=Math.min(Math.max(0,s.topRight-a),d),p=Math.min(Math.max(0,s.bottomRight-a),d),g=Math.min(Math.max(0,s.bottomLeft-a),d),m=a,b=a+c,v=a,y=a+u,x=[{type:"arc",length:Math.PI*g/2,radius:g,corner:"bottomLeft"},{type:"straight",length:u-g-h,dir:"up"},{type:"arc",length:Math.PI*h/2,radius:h,corner:"topLeft"},{type:"straight",length:c-h-f,dir:"right"},{type:"arc",length:Math.PI*f/2,radius:f,corner:"topRight"},{type:"straight",length:u-f-p,dir:"down"},{type:"arc",length:Math.PI*p/2,radius:p,corner:"bottomRight"},{type:"straight",length:c-p-g,dir:"left"}];let S=e;const j=x.reduce((C,R)=>C+R.length,0);for(;S<0;)S+=j;for(;S>=j;)S-=j;let _=0;for(const C of x){if(S<=_+C.length){const R=S-_,T=C.length>0?R/C.length:0;return C.type==="arc"?JB(C,T,{left:m,right:b,top:v,bottom:y,tl:h,tr:f,br:p,bl:g}):QB(C,T,{left:m,right:b,top:v,bottom:y,tl:h,tr:f,br:p,bl:g})}_+=C.length}return{x:m,y:y-g,angle:-Math.PI/2}}function JB(t,e,r){const{left:n,right:i,top:o,bottom:s,tl:a,tr:c,br:u,bl:d}=r,h=e*(Math.PI/2);switch(t.corner){case"bottomLeft":{const f=n+d,p=s-d,m=Math.PI/2+h;return{x:f+d*Math.cos(m),y:p+d*Math.sin(m),angle:m+Math.PI/2}}case"topLeft":{const f=n+a,p=o+a,m=Math.PI+h;return{x:f+a*Math.cos(m),y:p+a*Math.sin(m),angle:m+Math.PI/2}}case"topRight":{const f=i-c,p=o+c,m=-Math.PI/2+h;return{x:f+c*Math.cos(m),y:p+c*Math.sin(m),angle:m+Math.PI/2}}case"bottomRight":{const f=i-u,p=s-u,m=0+h;return{x:f+u*Math.cos(m),y:p+u*Math.sin(m),angle:m+Math.PI/2}}default:return{x:n,y:o,angle:0}}}function QB(t,e,r){const{left:n,right:i,top:o,bottom:s,tl:a,tr:c,br:u,bl:d}=r;switch(t.dir){case"up":{const h=s-d,f=o+a;return{x:n,y:h+e*(f-h),angle:-Math.PI/2}}case"right":{const h=n+a,f=i-c;return{x:h+e*(f-h),y:o,angle:0}}case"down":{const h=o+c,f=s-u;return{x:i,y:h+e*(f-h),angle:Math.PI/2}}case"left":{const h=i-u,f=n+d;return{x:h+e*(f-h),y:s,angle:Math.PI}}default:return{x:n,y:o,angle:0}}}function Hv(t,e,r){const n=Uv(t,e,r),i=Uv(t+1,e,r);return{x:(n.x+i.x)/2,y:(n.y+i.y)/2,angle:n.angle,innerX:i.x,innerY:i.y,outerX:n.x,outerY:n.y}}function eU({track:t,svgRef:e}){const{updateTrackParameters:r,updateTrackPosition:n,updateTrackRotation:i,addToHistory:o}=Gt(),[s,a]=M.useState(!1),[c,u]=M.useState(!1),[d,h]=M.useState(null),[f,p]=M.useState(null),{parameters:g,position:m,rotation:b}=t,v=g.width_mm,y=g.height_mm,x=m.x+v/2,S=m.y+y/2,j=v/2,_=-1e3,C=(E,I)=>{if(!e.current)return{x:0,y:0};const w=e.current.createSVGPoint();w.x=E,w.y=I;const z=w.matrixTransform(e.current.getScreenCTM().inverse());return{x:z.x,y:z.y}},R=E=>{E.stopPropagation(),u(!0),p({x:E.clientX,y:E.clientY})},T=(E,I)=>{E.stopPropagation(),a(!0),h(I);const w=C(E.clientX,E.clientY);p({screenX:E.clientX,screenY:E.clientY,svgX:w.x,svgY:w.y,initialWidth:v,initialHeight:y,initialPosition:{...m},initialCornerRadius:{...g.cornerRadius}})};M.useEffect(()=>{if(!s&&!c)return;const E=w=>{if(c){const te=C(w.clientX,w.clientY),ae=te.x-x,ge=te.y-S;let je=Math.atan2(ge,ae)*(180/Math.PI)+90;je=$1(je),w.shiftKey&&(je=Math.round(je/15)*15),i(t.id,je);return}if(!f)return;const z=C(w.clientX,w.clientY),Z=z.x-f.svgX,q=z.y-f.svgY;let V=f.initialWidth,A=f.initialHeight,K={...m},L={...f.initialCornerRadius};const B=3e3;switch(d){case"se":V=Math.max(B,f.initialWidth+Z),A=Math.max(B,f.initialHeight+q);const te=Math.min(V/f.initialWidth,A/f.initialHeight);L={topLeft:f.initialCornerRadius.topLeft*te,topRight:f.initialCornerRadius.topRight*te,bottomLeft:f.initialCornerRadius.bottomLeft*te,bottomRight:f.initialCornerRadius.bottomRight*te};break;case"nw":V=Math.max(B,f.initialWidth-Z),A=Math.max(B,f.initialHeight-q),K.x=f.initialPosition.x+(f.initialWidth-V),K.y=f.initialPosition.y+(f.initialHeight-A);const ae=Math.min(V/f.initialWidth,A/f.initialHeight);L={topLeft:f.initialCornerRadius.topLeft*ae,topRight:f.initialCornerRadius.topRight*ae,bottomLeft:f.initialCornerRadius.bottomLeft*ae,bottomRight:f.initialCornerRadius.bottomRight*ae};break;case"ne":V=Math.max(B,f.initialWidth+Z),A=Math.max(B,f.initialHeight-q),K.y=f.initialPosition.y+(f.initialHeight-A);const ge=Math.min(V/f.initialWidth,A/f.initialHeight);L={topLeft:f.initialCornerRadius.topLeft*ge,topRight:f.initialCornerRadius.topRight*ge,bottomLeft:f.initialCornerRadius.bottomLeft*ge,bottomRight:f.initialCornerRadius.bottomRight*ge};break;case"sw":V=Math.max(B,f.initialWidth-Z),A=Math.max(B,f.initialHeight+q),K.x=f.initialPosition.x+(f.initialWidth-V);const je=Math.min(V/f.initialWidth,A/f.initialHeight);L={topLeft:f.initialCornerRadius.topLeft*je,topRight:f.initialCornerRadius.topRight*je,bottomLeft:f.initialCornerRadius.bottomLeft*je,bottomRight:f.initialCornerRadius.bottomRight*je};break;case"e":V=Math.max(B,f.initialWidth+Z);const me=V/f.initialWidth;L={topLeft:f.initialCornerRadius.topLeft*me,topRight:f.initialCornerRadius.topRight*me,bottomLeft:f.initialCornerRadius.bottomLeft*me,bottomRight:f.initialCornerRadius.bottomRight*me};break;case"w":V=Math.max(B,f.initialWidth-Z),K.x=f.initialPosition.x+(f.initialWidth-V);const be=V/f.initialWidth;L={topLeft:f.initialCornerRadius.topLeft*be,topRight:f.initialCornerRadius.topRight*be,bottomLeft:f.initialCornerRadius.bottomLeft*be,bottomRight:f.initialCornerRadius.bottomRight*be};break;case"n":A=Math.max(B,f.initialHeight-q),K.y=f.initialPosition.y+(f.initialHeight-A);const Ue=A/f.initialHeight;L={topLeft:f.initialCornerRadius.topLeft*Ue,topRight:f.initialCornerRadius.topRight*Ue,bottomLeft:f.initialCornerRadius.bottomLeft*Ue,bottomRight:f.initialCornerRadius.bottomRight*Ue};break;case"s":A=Math.max(B,f.initialHeight+q);const We=A/f.initialHeight;L={topLeft:f.initialCornerRadius.topLeft*We,topRight:f.initialCornerRadius.topRight*We,bottomLeft:f.initialCornerRadius.bottomLeft*We,bottomRight:f.initialCornerRadius.bottomRight*We};break}const fe=Math.min(V,A)/2;L={topLeft:Math.min(L.topLeft,fe),topRight:Math.min(L.topRight,fe),bottomLeft:Math.min(L.bottomLeft,fe),bottomRight:Math.min(L.bottomRight,fe)},r(t.id,{width_mm:V,height_mm:A,cornerRadius:L}),(K.x!==m.x||K.y!==m.y)&&n(t.id,K)},I=()=>{(s||c)&&o(),a(!1),u(!1),h(null),p(null)};return window.addEventListener("mousemove",E),window.addEventListener("mouseup",I),()=>{window.removeEventListener("mousemove",E),window.removeEventListener("mouseup",I)}},[s,f,d,t.id,m,g,r,n,o]);const P=[{type:"nw",x:0,y:0,cursor:"nwse-resize"},{type:"n",x:v/2,y:0,cursor:"ns-resize"},{type:"ne",x:v,y:0,cursor:"nesw-resize"},{type:"e",x:v,y:y/2,cursor:"ew-resize"},{type:"se",x:v,y,cursor:"nwse-resize"},{type:"s",x:v/2,y,cursor:"ns-resize"},{type:"sw",x:0,y,cursor:"nesw-resize"},{type:"w",x:0,y:y/2,cursor:"ew-resize"}],H=400;return l.jsxs("g",{className:"track-resize-handles",children:[l.jsxs("g",{className:"rotation-handle-group",children:[l.jsx("line",{x1:j,y1:0,x2:j,y2:_,stroke:"#0066CC",strokeWidth:30,strokeDasharray:"100 100",opacity:.5,style:{pointerEvents:"none"}}),l.jsx("circle",{className:"rotation-handle",cx:j,cy:_,r:H/2,fill:"white",stroke:"#0066CC",strokeWidth:50,style:{cursor:c?"grabbing":"grab",pointerEvents:"all"},onMouseDown:R}),l.jsx("path",{d:`M ${j-100} ${_-50}
              A 100 100 0 1 1 ${j+100} ${_-50}`,fill:"none",stroke:"#0066CC",strokeWidth:40,strokeLinecap:"round",style:{pointerEvents:"none"}}),l.jsx("path",{d:`M ${j+100} ${_-50}
              L ${j+80} ${_-120}
              L ${j+150} ${_-80}
              Z`,fill:"#0066CC",style:{pointerEvents:"none"}})]}),P.map(E=>l.jsx("rect",{className:`resize-handle resize-handle--${E.type}`,x:E.x-H/2,y:E.y-H/2,width:H,height:H,fill:"white",stroke:"#0066CC",strokeWidth:50,rx:40,ry:40,style:{cursor:s&&d===E.type?"grabbing":E.cursor,pointerEvents:"all"},onMouseDown:I=>T(I,E.type)},E.type)),s&&l.jsxs("text",{x:v/2,y:y+800,textAnchor:"middle",fontSize:400,fill:"#0066CC",fontWeight:"bold",style:{pointerEvents:"none"},children:[(v/1e3).toFixed(1),"m × ",(y/1e3).toFixed(1),"m"]}),c&&l.jsxs("text",{x:v/2,y:-1500,textAnchor:"middle",fontSize:400,fill:"#0066CC",fontWeight:"bold",style:{pointerEvents:"none"},children:[b.toFixed(0),"°"]})]})}function tU({geometry:t,parameters:e,boxConfig:r,surfaceColor:n,isStraightTrack:i}){if(!r||!r.enabled)return null;const{depth_mm:o=400,lineWidth_mm:s=50,perLaneOffsets:a=[]}=r,c=n||"#A5362F",u="#FFFFFF";return l.jsx("g",{className:"starting-boxes",children:t.lanes.map((d,h)=>{const f=h+1;if(i){const p=h*e.laneWidth_mm,g=e.laneWidth_mm,m=0;return l.jsxs("g",{children:[l.jsx("rect",{x:p,y:m,width:g,height:o,fill:c,stroke:"none",pointerEvents:"none"}),l.jsx("line",{x1:p,y1:m,x2:p+g,y2:m,stroke:u,strokeWidth:s,strokeLinecap:"butt",pointerEvents:"none"}),l.jsx("text",{x:p+g/2,y:m+o/2,fontSize:Math.min(g*.4,e.laneWidth_mm*.5),fill:u,textAnchor:"middle",dominantBaseline:"middle",fontWeight:"bold",pointerEvents:"none",opacity:"0.8",children:f})]},`start-box-${f}`)}else{const p=(a[h]||0)*1e3,g=Hv(h,p,e),m=g.angle+Math.PI/2,b=e.laneWidth_mm/2,v=g.x+Math.cos(m)*b,y=g.y+Math.sin(m)*b,x=g.x-Math.cos(m)*b,S=g.y-Math.sin(m)*b,j=Hv(h,p+o,e),_=j.angle+Math.PI/2,C=j.x+Math.cos(_)*b,R=j.y+Math.sin(_)*b,T=j.x-Math.cos(_)*b,P=j.y-Math.sin(_)*b,H=`
            M ${v} ${y}
            L ${x} ${S}
            L ${T} ${P}
            L ${C} ${R}
            Z
          `.trim().replace(/\s+/g," ");return l.jsxs("g",{children:[l.jsx("path",{d:H,fill:c,stroke:"none",pointerEvents:"none"}),l.jsx("line",{x1:v,y1:y,x2:x,y2:S,stroke:u,strokeWidth:s,strokeLinecap:"butt",pointerEvents:"none"}),l.jsx("text",{x:g.x,y:g.y,fontSize:e.laneWidth_mm*.5,fill:u,textAnchor:"middle",dominantBaseline:"middle",fontWeight:"bold",pointerEvents:"none",opacity:"0.8",transform:`rotate(${g.angle*180/Math.PI+90}, ${g.x}, ${g.y})`,children:f})]},`start-box-${f}`)}})})}function rU({track:t,isSelected:e,onMouseDown:r,onDoubleClick:n,svgRef:i}){var x,S,j;const{parameters:o,position:s,rotation:a,trackSurfaceColor:c}=t,u=I1(o),d=u.lanes.length>0&&u.lanes[0].isParallel===!0,h=u.totalWidth,f=u.totalLength,p=h/2,g=f/2,m=`translate(${s.x}, ${s.y}) rotate(${a}, ${p}, ${g})`,b=(c==null?void 0:c.hex)||"#A5362F",v="#FFFFFF",y=o.lineWidth_mm||50;return console.log("TrackRenderer - trackSurfaceColor:",c),console.log("TrackRenderer - surfaceColor:",b),console.log("TrackRenderer - geometry.lanes.length:",u.lanes.length),l.jsxs("g",{className:`track-element ${e?"track-element--selected":""}`,transform:m,style:{cursor:"move"},children:[l.jsx("rect",{x:"0",y:"0",width:h,height:f,fill:"transparent",onMouseDown:r,onDoubleClick:n,style:{cursor:"move"}}),d?u.lanes.map(_=>l.jsx("path",{d:_.outerPath,fill:b,stroke:"none",pointerEvents:"none"},`lane-fill-${_.laneNumber}`)):l.jsx("path",{d:`${u.lanes[0].outerPath} ${u.lanes[u.lanes.length-1].innerPath}`,fill:b,fillRule:"evenodd",stroke:"none",pointerEvents:"none"}),u.lanes.map((_,C)=>l.jsx(nU,{lane:_,lineColor:v,lineWidth:y,isLastLane:C===u.lanes.length-1,isStraightTrack:d,geometry:u},`stroke-${_.laneNumber}`)),((x=o.startingBoxes)==null?void 0:x.enabled)&&l.jsx(tU,{geometry:u,parameters:o,boxConfig:{...o.startingBoxes,perLaneOffsets:((S=t.template)==null?void 0:S.trackType)==="curved"?M1(u):[]},surfaceColor:b,isStraightTrack:((j=t.template)==null?void 0:j.trackType)==="straight"}),e&&l.jsxs(l.Fragment,{children:[l.jsx("rect",{x:"-10",y:"-10",width:h+20,height:f+20,fill:"none",stroke:"#0066CC",strokeWidth:"80",strokeDasharray:"400 400",opacity:"0.5",pointerEvents:"none"}),l.jsx(eU,{track:t,svgRef:i})]})]})}function nU({lane:t,lineColor:e,lineWidth:r,isLastLane:n,isStraightTrack:i,geometry:o}){const{innerPath:s,outerPath:a}=t,c=50;return i?l.jsxs("g",{className:"track-lane-stroke",children:[t.laneNumber===1&&l.jsx("line",{x1:t.laneX,y1:0,x2:t.laneX,y2:o.totalLength,stroke:e,strokeWidth:c,pointerEvents:"none"}),l.jsx("line",{x1:t.laneX+t.laneWidth,y1:0,x2:t.laneX+t.laneWidth,y2:o.totalLength,stroke:e,strokeWidth:c,pointerEvents:"none"})]}):l.jsxs("g",{className:"track-lane-stroke",children:[l.jsx("path",{d:a,fill:"none",stroke:e,strokeWidth:c,pointerEvents:"none"}),n&&l.jsx("path",{d:s,fill:"none",stroke:e,strokeWidth:c,pointerEvents:"none"})]})}function iU(){const t=M.useRef(null),[e,r]=M.useState(!1),[n,i]=M.useState(null),[o,s]=M.useState(null),[a,c]=M.useState(null),{surface:u,courts:d,tracks:h,elementOrder:f,selectedCourtId:p,selectedTrackId:g,snapToGrid:m,gridSize_mm:b,selectCourt:v,deselectCourt:y,selectTrack:x,deselectTrack:S,updateCourtPosition:j,updateTrackPosition:_}=Gt(),C=(I,w)=>{const z=t.current,Z=z.createSVGPoint();Z.x=I,Z.y=w;const q=Z.matrixTransform(z.getScreenCTM().inverse());return{x:q.x,y:q.y}},R=(I,w)=>{I.stopPropagation(),v(w);const z=C(I.clientX,I.clientY),Z=d[w];i({x:z.x-Z.position.x,y:z.y-Z.position.y}),s(w),r(!0)},T=(I,w)=>{I.stopPropagation(),v(w),Gt.setState({showPropertiesPanel:!0,propertiesPanelUserClosed:!1})},P=(I,w)=>{I.stopPropagation(),x(w);const z=C(I.clientX,I.clientY),Z=h[w];i({x:z.x-Z.position.x,y:z.y-Z.position.y}),c(w),r(!0)},H=(I,w)=>{I.stopPropagation(),x(w),Gt.setState({showPropertiesPanel:!0,propertiesPanelUserClosed:!1})};M.useEffect(()=>{r(!1),s(null),c(null),i(null)},[u.width_mm,u.length_mm]),M.useEffect(()=>{if(!e||!o&&!a)return;const I=z=>{const Z=C(z.clientX,z.clientY);let q={x:Z.x-n.x,y:Z.y-n.y};if(m&&(q=VB(q,b)),o){const V=d[o],A={width_mm:V.template.dimensions.width_mm*V.scale,length_mm:V.template.dimensions.length_mm*V.scale};q=qB(q,A,u),j(o,q)}else a&&_(a,q)},w=()=>{if(o||a){const{addToHistory:z}=Gt.getState();z()}r(!1),s(null),c(null),i(null)};return window.addEventListener("mousemove",I),window.addEventListener("mouseup",w),()=>{window.removeEventListener("mousemove",I),window.removeEventListener("mouseup",w)}},[e,o,a,n,d,h,m,b,u,j,_]);const E=I=>{I.target===I.currentTarget&&(y(),S())};return l.jsxs("div",{className:"court-canvas",onClick:E,children:[l.jsxs("svg",{ref:t,className:"court-canvas__svg",viewBox:`0 0 ${u.width_mm} ${u.length_mm}`,preserveAspectRatio:"xMidYMid meet",children:[l.jsx("rect",{x:"0",y:"0",width:u.width_mm,height:u.length_mm,fill:u.color.hex,className:"court-canvas__surface"}),f.map(I=>{if(I.startsWith("court-")){const w=d[I];return w?l.jsx(oU,{court:w,isSelected:I===p,onMouseDown:z=>R(z,I),onDoubleClick:z=>T(z,I),svgRef:t},I):null}if(I.startsWith("track-")){const w=h[I];return w?l.jsx(rU,{track:w,isSelected:I===g,onMouseDown:z=>P(z,I),onDoubleClick:z=>H(z,I),svgRef:t},I):null}return null})]}),l.jsxs("div",{className:"court-canvas__info",children:[l.jsxs("span",{children:[(u.width_mm/1e3).toFixed(1),"m × ",(u.length_mm/1e3).toFixed(1),"m"]}),m&&l.jsxs("span",{className:"court-canvas__grid-indicator",children:["Grid: ",b,"mm"]})]})]})}function oU({court:t,isSelected:e,onMouseDown:r,onDoubleClick:n,svgRef:i}){var c;const{markings:o,zones:s}=GB(t),a=((c=t.courtSurfaceColor)==null?void 0:c.hex)||null;return l.jsxs("g",{className:`court-canvas__court ${e?"court-canvas__court--selected":""}`,transform:KB(t),style:{cursor:"move"},children:[a&&l.jsx("rect",{x:"0",y:"0",width:t.template.dimensions.width_mm,height:t.template.dimensions.length_mm,fill:a,className:"court-canvas__court-surface"}),l.jsx("rect",{x:"0",y:"0",width:t.template.dimensions.width_mm,height:t.template.dimensions.length_mm,fill:"transparent",onMouseDown:r,onDoubleClick:n,style:{cursor:"move"}}),s.map(u=>l.jsx(sU,{zone:u},u.id)),o.map(u=>l.jsx(aU,{marking:u},u.id)),e&&l.jsxs(l.Fragment,{children:[l.jsx("rect",{x:"0",y:"0",width:t.template.dimensions.width_mm,height:t.template.dimensions.length_mm,fill:"none",stroke:"#007bff",strokeWidth:"100",strokeDasharray:"400 400",className:"court-canvas__selection-outline"}),l.jsx(YB,{court:t,svgRef:i})]})]})}function sU({zone:t}){switch(t.type){case"rect":return l.jsx("rect",{x:t.x,y:t.y,width:t.width,height:t.height,fill:t.fill});case"circle":return l.jsx("circle",{cx:t.cx,cy:t.cy,r:t.r,fill:t.fill});case"polygon":return l.jsx("polygon",{points:t.points,fill:t.fill});default:return null}}function aU({marking:t}){switch(t.type){case"line":return l.jsx("line",{x1:t.x1,y1:t.y1,x2:t.x2,y2:t.y2,stroke:t.stroke,strokeWidth:t.strokeWidth});case"rect":return l.jsx("rect",{x:t.x,y:t.y,width:t.width,height:t.height,stroke:t.stroke,strokeWidth:t.strokeWidth,fill:t.fill});case"circle":return l.jsx("circle",{cx:t.cx,cy:t.cy,r:t.r,stroke:t.stroke,strokeWidth:t.strokeWidth,fill:t.fill});case"path":return l.jsx("path",{d:t.d,stroke:t.stroke,strokeWidth:t.strokeWidth,fill:t.fill});case"polyline":return l.jsx("polyline",{points:t.points,stroke:t.stroke,strokeWidth:t.strokeWidth,fill:t.fill});default:return null}}const L1={"track-flexible":{id:"track-flexible",name:"Running Track",type:"running-track",trackType:"curved",standard:"Flexible Design",category:"track",description:"Flexible running track - adjust size, lanes, and corner radius to fit your surface",parameters:{numLanes:4,laneWidth_mm:1220,width_mm:25e3,height_mm:15e3,cornerRadius:{topLeft:3e3,topRight:3e3,bottomLeft:3e3,bottomRight:3e3},lineWidth_mm:50,startingBoxes:{enabled:!1,depth_mm:400,lineWidth_mm:50}},defaultLineColor:"RH31",defaultTrackSurfaceColor:"RH01",calculatedDimensions:{totalWidth_mm:25e3,totalLength_mm:15e3}},"track-straight":{id:"track-straight",name:"Straight Track",type:"running-track",trackType:"straight",standard:"Sprint Track",category:"track",description:"Straight sprint track - perfect for 60m, 100m, or custom length sprints",parameters:{numLanes:6,laneWidth_mm:1220,width_mm:7320,height_mm:1e5,cornerRadius:{topLeft:0,topRight:0,bottomLeft:0,bottomRight:0},lineWidth_mm:50,startingBoxes:{enabled:!1,depth_mm:400,lineWidth_mm:50}},defaultLineColor:"RH31",defaultTrackSurfaceColor:"RH01",calculatedDimensions:{totalWidth_mm:7320,totalLength_mm:1e5}}};function lU(){return Object.values(L1)}function cU(t){return L1[t]||null}function uU(){const[t,e]=M.useState(null),[r,n]=M.useState("courts"),{addCourt:i,addTrack:o}=Gt(),s=MB(),a=lU(),c=d=>{const h=LB(d);h&&i(d,h)},u=d=>{const h=cU(d);h&&o(d,h)};return l.jsxs("div",{className:"court-library",children:[l.jsxs("div",{className:"court-library__header",children:[l.jsx("h2",{children:r==="courts"?"Court Library":"Track Library"}),l.jsx("p",{children:r==="courts"?"Select a court to add to your surface":"Select a running track to add to your surface"})]}),l.jsxs("div",{className:"court-library__tabs",children:[l.jsx("button",{className:`court-library__tab ${r==="courts"?"court-library__tab--active":""}`,onClick:()=>{n("courts"),e(null)},children:"Courts"}),l.jsx("button",{className:`court-library__tab ${r==="tracks"?"court-library__tab--active":""}`,onClick:()=>{n("tracks"),e(null)},children:"Tracks"})]}),l.jsxs("div",{className:"court-library__list",children:[r==="courts"&&s.map(d=>l.jsxs("div",{className:`court-library__item ${t===d.id?"court-library__item--selected":""}`,onClick:()=>e(d.id),onDoubleClick:()=>c(d.id),children:[l.jsx("div",{className:"court-library__preview",children:l.jsx(dU,{template:d})}),l.jsxs("div",{className:"court-library__info",children:[l.jsx("div",{className:"court-library__name",children:d.name}),l.jsxs("div",{className:"court-library__dimensions",children:[(d.dimensions.width_mm/1e3).toFixed(1),"m × ",(d.dimensions.length_mm/1e3).toFixed(1),"m"]}),l.jsx("div",{className:"court-library__standard",children:d.standard})]}),t===d.id&&l.jsx("button",{className:"court-library__add-btn",onClick:h=>{h.stopPropagation(),c(d.id)},children:"+ ADD"})]},d.id)),r==="tracks"&&a.map(d=>l.jsxs("div",{className:`court-library__item ${t===d.id?"court-library__item--selected":""}`,onClick:()=>e(d.id),onDoubleClick:()=>u(d.id),children:[l.jsx("div",{className:"court-library__preview",children:l.jsx(fU,{template:d})}),l.jsxs("div",{className:"court-library__info",children:[l.jsx("div",{className:"court-library__name",children:d.name}),l.jsxs("div",{className:"court-library__dimensions",children:[(d.calculatedDimensions.totalWidth_mm/1e3).toFixed(1),"m × ",(d.calculatedDimensions.totalLength_mm/1e3).toFixed(1),"m"]}),l.jsxs("div",{className:"court-library__standard",children:[d.parameters.numLanes," Lanes • ",d.standard]})]}),t===d.id&&l.jsx("button",{className:"court-library__add-btn",onClick:h=>{h.stopPropagation(),u(d.id)},children:"+ ADD"})]},d.id))]}),l.jsx("div",{className:"court-library__footer",children:l.jsxs("p",{className:"court-library__hint",children:["💡 ",r==="courts"?"Double-click a court to add it instantly":"Double-click a track to add it instantly"]})})]})}function dU({template:t}){const e=t.dimensions.width_mm,r=t.dimensions.length_mm,n=Math.min(62/e,62/r),i=e*n,o=r*n;return l.jsxs("svg",{width:"62",height:"62",viewBox:"0 0 62 62",className:"court-library__svg-preview",children:[l.jsx("rect",{x:(62-i)/2,y:(62-o)/2,width:i,height:o,fill:"#e5e7eb",stroke:"#9ca3af",strokeWidth:"1.5"}),t.markings.map((s,a)=>l.jsx(hU,{marking:s,scale:n,offsetX:(62-i)/2,offsetY:(62-o)/2},a))]})}function hU({marking:t,scale:e,offsetX:r,offsetY:n}){const{type:i,params:o}=t;switch(i){case"line":return l.jsx("line",{x1:o.x1*e+r,y1:o.y1*e+n,x2:o.x2*e+r,y2:o.y2*e+n,stroke:"#1e293b",strokeWidth:"1.5"});case"rectangle":return l.jsx("rect",{x:o.x*e+r,y:o.y*e+n,width:o.width*e,height:o.height*e,stroke:"#1e293b",strokeWidth:"1.5",fill:"none"});case"circle":return l.jsx("circle",{cx:o.cx*e+r,cy:o.cy*e+n,r:o.radius*e,stroke:"#1e293b",strokeWidth:"1.5",fill:"none"});case"arc":{const{cx:s,cy:a,radius:c,startAngle:u,endAngle:d}=o,h=u*Math.PI/180,f=d*Math.PI/180,p=(s+c*Math.cos(h))*e+r,g=(a+c*Math.sin(h))*e+n,m=(s+c*Math.cos(f))*e+r,b=(a+c*Math.sin(f))*e+n,v=d-u>180?1:0,y=`M ${p} ${g} A ${c*e} ${c*e} 0 ${v} 1 ${m} ${b}`;return l.jsx("path",{d:y,stroke:"#1e293b",strokeWidth:"1.5",fill:"none"})}default:return null}}function fU({template:t}){const{parameters:e}=t,r=e.width_mm,n=e.height_mm,i=Math.min(58/r,58/n),o=r*i,s=n*i,a=e.numLanes,c=e.laneWidth_mm*i,u=e.cornerRadius,h=(u.topLeft+u.topRight+u.bottomLeft+u.bottomRight)/4*i,f=(62-o)/2,p=(62-s)/2;return l.jsxs("svg",{width:"62",height:"62",viewBox:"0 0 62 62",className:"court-library__svg-preview",children:[l.jsx("rect",{x:f,y:p,width:o,height:s,rx:h,fill:"#e5e7eb"}),Array.from({length:a}).map((g,m)=>{const b=m*c,v=Math.max(0,h-b);return l.jsx("rect",{x:f+b,y:p+b,width:Math.max(0,o-b*2),height:Math.max(0,s-b*2),rx:v,stroke:"#1e293b",strokeWidth:"1",fill:"none"},m)})]})}function pU(){const{courts:t,tracks:e,elementOrder:r,selectedCourtId:n,selectedTrackId:i,setElementOrder:o,selectCourt:s,selectTrack:a,bringToFront:c,sendToBack:u,addToHistory:d}=Gt(),[h,f]=M.useState(null),[p,g]=M.useState(null),m=[...r].reverse(),b=P=>{var H,E,I;if(P.startsWith("court-")){const w=t[P];return{type:"court",name:((H=w==null?void 0:w.template)==null?void 0:H.name)||"Unknown Court",icon:"🏀",sport:((E=w==null?void 0:w.template)==null?void 0:E.sport)||""}}else if(P.startsWith("track-")){const w=e[P];return{type:"track",name:((I=w==null?void 0:w.template)==null?void 0:I.name)||"Unknown Track",icon:"🏃",sport:"athletics"}}return{type:"unknown",name:"Unknown",icon:"❓",sport:""}},v=P=>P===n||P===i,y=P=>{P.startsWith("court-")?s(P):P.startsWith("track-")&&a(P)},x=(P,H)=>{f(H),P.dataTransfer.effectAllowed="move",P.dataTransfer.setData("text/plain",H),setTimeout(()=>{P.target.classList.add("layer-item--dragging")},0)},S=P=>{P.target.classList.remove("layer-item--dragging"),f(null),g(null)},j=(P,H)=>{P.preventDefault(),P.dataTransfer.dropEffect="move",H!==h&&g(H)},_=()=>{g(null)},C=(P,H)=>{if(P.preventDefault(),!h||h===H){f(null),g(null);return}const E=[...r],I=E.indexOf(h),w=E.indexOf(H);if(I===-1||w===-1)return;E.splice(I,1);const z=m.indexOf(h),Z=m.indexOf(H);z<Z,E.splice(w,0,h),o(E),d(),f(null),g(null)},R=(P,H)=>{P.stopPropagation(),c(H)},T=(P,H)=>{P.stopPropagation(),u(H)};return r.length===0?l.jsx("div",{className:"layers-panel layers-panel--empty",children:l.jsxs("div",{className:"layers-panel__empty-state",children:[l.jsx("span",{className:"layers-panel__empty-icon",children:"📑"}),l.jsx("p",{children:"No elements yet"}),l.jsx("span",{className:"layers-panel__empty-hint",children:"Add courts or tracks from the library"})]})}):l.jsxs("div",{className:"layers-panel",children:[l.jsxs("div",{className:"layers-panel__header",children:[l.jsx("h4",{children:"Layers"}),l.jsx("span",{className:"layers-panel__count",children:r.length})]}),l.jsx("div",{className:"layers-panel__hint",children:"Drag to reorder layers. Top = front, bottom = back."}),l.jsx("div",{className:"layers-panel__list",children:m.map((P,H)=>{const E=b(P),I=v(P),w=P===p,z=H===0,Z=H===m.length-1;return l.jsxs("div",{className:`layer-item ${I?"layer-item--selected":""} ${w?"layer-item--drag-over":""}`,draggable:!0,onDragStart:q=>x(q,P),onDragEnd:S,onDragOver:q=>j(q,P),onDragLeave:_,onDrop:q=>C(q,P),onClick:()=>y(P),children:[l.jsx("span",{className:"layer-item__handle",title:"Drag to reorder",children:"≡"}),l.jsx("span",{className:"layer-item__icon",children:E.icon}),l.jsxs("div",{className:"layer-item__info",children:[l.jsx("span",{className:"layer-item__name",children:E.name}),l.jsx("span",{className:"layer-item__type",children:E.type==="court"?"Court":"Track"})]}),l.jsxs("div",{className:"layer-item__actions",children:[l.jsx("button",{className:"layer-item__action",onClick:q=>R(q,P),disabled:z,title:"Bring to Front",children:"⬆"}),l.jsx("button",{className:"layer-item__action",onClick:q=>T(q,P),disabled:Z,title:"Send to Back",children:"⬇"})]})]},P)})}),l.jsx("div",{className:"layers-panel__footer",children:l.jsx("span",{className:"layers-panel__shortcut-hint",children:"Tip: Use [ and ] keys to reorder selected element"})})]})}function mU(){var q,V;const{courts:t,tracks:e,selectedCourtId:r,selectedTrackId:n,updateCourtPosition:i,updateCourtRotation:o,updateCourtScale:s,setLineColor:a,setZoneColor:c,setCourtSurfaceColor:u,resetCourtColors:d,removeCourt:h,removeTrack:f,updateTrackParameters:p,addToHistory:g}=Gt(),[m,b]=M.useState("transform"),[v,y]=M.useState(null);if(n){const A=e[n];return A?l.jsx(gU,{track:A,trackId:n}):null}if(!r)return l.jsx("div",{className:"properties-panel properties-panel--empty",children:l.jsxs("div",{className:"properties-panel__empty-state",children:[l.jsx("p",{children:"No element selected"}),l.jsx("span",{className:"properties-panel__hint",children:"Click on a court or track to view and edit its properties"})]})});const x=t[r];if(!x)return null;const{position:S,rotation:j,scale:_,template:C,lineColorOverrides:R,zoneColorOverrides:T}=x,P=(A,K)=>{const L=parseFloat(K);isNaN(L)||i(r,{...S,[A]:L})},H=A=>{const K=parseFloat(A);isNaN(K)||o(r,K)},E=A=>{const K=parseFloat(A);isNaN(K)||K<=0||s(r,K)},I=()=>{window.confirm(`Delete ${C.name}? This action cannot be undone.`)&&h(r)},w=A=>{if(!v)return;if(v.type==="courtSurface"&&A===null){u(r,null),y(null);return}if(!A)return;const K={tpv_code:A.code,hex:A.hex,name:A.name};v.type==="line"?a(r,v.id,K):v.type==="zone"?c(r,v.id,K):v.type==="courtSurface"?u(r,K):v.type==="allLines"&&C.markings.forEach(L=>{a(r,L.id,K)}),y(null)},z=A=>{const K=R[A.id];if(K)return{code:K.tpv_code,hex:K.hex,name:K.name};const L=en.find(B=>B.code===C.defaultLineColor);return L?{code:L.code,hex:L.hex,name:L.name}:null},Z=A=>{const K=T[A.id];if(K)return{code:K.tpv_code,hex:K.hex,name:K.name};const L=en.find(B=>B.code===A.defaultColor);return L?{code:L.code,hex:L.hex,name:L.name}:null};return l.jsxs("div",{className:"properties-panel",children:[l.jsxs("div",{className:"properties-panel__header",children:[l.jsx("h3",{children:"Properties"}),l.jsxs("div",{className:"properties-panel__court-info",children:[l.jsx("span",{className:"court-name",children:C.name}),l.jsx("span",{className:"court-standard",children:C.standard})]})]}),l.jsxs("div",{className:"properties-panel__tabs",children:[l.jsx("button",{className:`tab ${m==="transform"?"tab--active":""}`,onClick:()=>b("transform"),children:"Transform"}),l.jsx("button",{className:`tab ${m==="lines"?"tab--active":""}`,onClick:()=>b("lines"),children:"Lines"}),l.jsx("button",{className:`tab ${m==="zones"?"tab--active":""}`,onClick:()=>b("zones"),children:"Zones"}),l.jsx("button",{className:`tab ${m==="layers"?"tab--active":""}`,onClick:()=>b("layers"),children:"Layers"})]}),l.jsxs("div",{className:"properties-panel__content",children:[m==="transform"&&l.jsxs("div",{className:"properties-section",children:[l.jsx("div",{className:"properties-section__header",children:l.jsx("h4",{children:"Transform"})}),l.jsxs("div",{className:"property-group",children:[l.jsx("label",{children:"Position"}),l.jsxs("div",{className:"property-input-row",children:[l.jsxs("div",{className:"property-input-group",children:[l.jsx("span",{className:"property-label",children:"X"}),l.jsx("input",{type:"number",value:Math.round(S.x),onChange:A=>P("x",A.target.value),step:"100"}),l.jsx("span",{className:"property-unit",children:"mm"})]}),l.jsxs("div",{className:"property-input-group",children:[l.jsx("span",{className:"property-label",children:"Y"}),l.jsx("input",{type:"number",value:Math.round(S.y),onChange:A=>P("y",A.target.value),step:"100"}),l.jsx("span",{className:"property-unit",children:"mm"})]})]})]}),l.jsxs("div",{className:"property-group",children:[l.jsx("label",{children:"Rotation"}),l.jsxs("div",{className:"property-input-row",children:[l.jsx("input",{type:"range",min:"0",max:"360",value:j,onChange:A=>H(A.target.value),className:"property-slider"}),l.jsxs("div",{className:"property-input-group property-input-group--compact",children:[l.jsx("input",{type:"number",value:Math.round(j),onChange:A=>H(A.target.value),min:"0",max:"360"}),l.jsx("span",{className:"property-unit",children:"°"})]})]})]}),l.jsxs("div",{className:"property-group",children:[l.jsx("label",{children:"Scale"}),l.jsxs("div",{className:"property-input-row",children:[l.jsx("input",{type:"range",min:"0.5",max:"2.0",step:"0.1",value:_,onChange:A=>E(A.target.value),className:"property-slider"}),l.jsxs("div",{className:"property-input-group property-input-group--compact",children:[l.jsx("input",{type:"number",value:_.toFixed(2),onChange:A=>E(A.target.value),min:"0.5",max:"2.0",step:"0.1"}),l.jsx("span",{className:"property-unit",children:"×"})]})]})]}),l.jsxs("div",{className:"property-group property-group--info",children:[l.jsx("label",{children:"Dimensions"}),l.jsx("div",{className:"property-info",children:l.jsxs("span",{children:[(C.dimensions.width_mm*_/1e3).toFixed(1),"m × ",(C.dimensions.length_mm*_/1e3).toFixed(1),"m"]})})]}),l.jsx("div",{className:"property-group property-group--actions",children:l.jsx("button",{className:"btn-delete",onClick:I,title:"Delete court (Delete key)",children:"🗑️ Delete Court"})})]}),m==="lines"&&l.jsxs("div",{className:"properties-section",children:[l.jsxs("div",{className:"properties-section__header",children:[l.jsx("h4",{children:"Line Markings"}),l.jsx("button",{className:"btn-reset",onClick:()=>d(r),title:"Reset all colors to defaults",children:"Reset"})]}),l.jsxs("div",{className:"color-item color-item--all-lines",children:[l.jsxs("div",{className:"color-item__info",children:[l.jsx("span",{className:"color-item__name",children:"Change All Lines"}),l.jsx("span",{className:"color-item__hint",children:"Set all lines to same colour"})]}),l.jsx("button",{className:"color-item__swatch color-item__swatch--all",onClick:()=>y({type:"allLines"}),title:"Change all line colours at once",children:l.jsx("span",{style:{fontSize:"1rem"},children:"🎨"})})]}),l.jsx("div",{className:"color-list",children:C.markings.map(A=>{const K=z(A);return l.jsxs("div",{className:"color-item",children:[l.jsxs("div",{className:"color-item__info",children:[l.jsx("span",{className:"color-item__name",children:A.name}),K&&l.jsx("span",{className:"color-item__code",children:K.code})]}),l.jsx("button",{className:"color-item__swatch",style:{backgroundColor:(K==null?void 0:K.hex)||"#000"},onClick:()=>y({type:"line",id:A.id}),title:(K==null?void 0:K.name)||"Select color"})]},A.id)})})]}),m==="zones"&&l.jsxs("div",{className:"properties-section",children:[l.jsx("div",{className:"properties-section__header",children:l.jsx("h4",{children:"Fill Colours"})}),l.jsxs("div",{className:"color-item color-item--surface-fill",children:[l.jsxs("div",{className:"color-item__info",children:[l.jsx("span",{className:"color-item__name",children:"Court Surface"}),l.jsx("span",{className:"color-item__hint",children:x.courtSurfaceColor?x.courtSurfaceColor.name:"No Fill (transparent)"}),x.courtSurfaceColor&&l.jsx("span",{className:"color-item__code",children:x.courtSurfaceColor.tpv_code})]}),l.jsx("button",{className:`color-item__swatch ${x.courtSurfaceColor?"":"color-item__swatch--no-fill"}`,style:{backgroundColor:((q=x.courtSurfaceColor)==null?void 0:q.hex)||"transparent"},onClick:()=>y({type:"courtSurface"}),title:((V=x.courtSurfaceColor)==null?void 0:V.name)||"No Fill - Click to select colour"})]}),C.zones&&C.zones.length>0&&l.jsx("div",{className:"properties-section__divider",children:l.jsx("span",{children:"Paint Zones"})}),C.zones&&C.zones.length>0&&l.jsx("div",{className:"color-list",children:C.zones.map(A=>{var L;const K=Z(A);return l.jsxs("div",{className:"color-item",children:[l.jsxs("div",{className:"color-item__info",children:[l.jsx("span",{className:"color-item__name",children:A.name}),l.jsxs("span",{className:"color-item__area",children:[((L=A.area_m2)==null?void 0:L.toFixed(1))||0," m²"]}),K&&l.jsx("span",{className:"color-item__code",children:K.code})]}),l.jsx("button",{className:"color-item__swatch",style:{backgroundColor:(K==null?void 0:K.hex)||"#000"},onClick:()=>y({type:"zone",id:A.id}),title:(K==null?void 0:K.name)||"Select color"})]},A.id)})})]}),m==="layers"&&l.jsx(pU,{})]}),v&&l.jsx("div",{className:"color-picker-modal",onClick:()=>y(null),children:l.jsxs("div",{className:"color-picker-modal__content",onClick:A=>A.stopPropagation(),children:[l.jsxs("div",{className:"color-picker-modal__header",children:[l.jsx("h4",{children:v.type==="allLines"?"Change All Line Colours":v.type==="courtSurface"?"Select Court Fill Colour":"Select TPV Colour"}),l.jsx("button",{onClick:()=>y(null),children:"×"})]}),l.jsxs("div",{className:"color-picker-grid",children:[v.type==="courtSurface"&&l.jsx("button",{className:"color-picker-swatch color-picker-swatch--no-fill",onClick:()=>w(null),title:"No Fill (transparent)",children:l.jsx("span",{className:"color-picker-swatch__code",children:"None"})}),en.map(A=>l.jsx("button",{className:"color-picker-swatch",style:{backgroundColor:A.hex},onClick:()=>w(A),title:`${A.code} - ${A.name}`,children:l.jsx("span",{className:"color-picker-swatch__code",children:A.code})},A.code))]})]})})]})}function gU({track:t,trackId:e}){var H,E,I;const{updateTrackParameters:r,removeTrack:n,setTrackSurfaceColor:i}=Gt(),{parameters:o,template:s,trackSurfaceColor:a}=t,[c,u]=$.useState(!0),[d,h]=$.useState(!1),f=s.trackType==="straight",p=I1(o),g=((H=p.lanes[0])==null?void 0:H.perimeter)||0,m=p.lanes[p.lanes.length-1],b=(m==null?void 0:m.perimeter)||0,v=f?[]:M1(p),y=w=>{const z=parseInt(w);if(!(isNaN(z)||z<1||z>8))if(f){const Z=z*o.laneWidth_mm;r(e,{numLanes:z,width_mm:Z})}else r(e,{numLanes:z})},x=w=>{const z=parseFloat(w)*1e3;isNaN(z)||z<3e3||r(e,{width_mm:z})},S=w=>{const z=parseFloat(w)*1e3;isNaN(z)||z<3e3||r(e,{height_mm:z})},j=(w,z)=>{const Z=parseFloat(z)*1e3;if(isNaN(Z)||Z<0)return;const q=Math.min(o.width_mm,o.height_mm)/2,V=Math.min(Z,q);c?r(e,{cornerRadius:{topLeft:V,topRight:V,bottomLeft:V,bottomRight:V}}):r(e,{cornerRadius:{...o.cornerRadius,[w]:V}})},_=()=>{window.confirm(`Delete ${s.name}? This action cannot be undone.`)&&n(e)},C=w=>{i(e,{tpv_code:w.code,hex:w.hex,name:w.name}),h(!1)},R=w=>{r(e,{startingBoxes:{...o.startingBoxes,enabled:w}})},T=w=>{const z=parseFloat(w)*1e3;isNaN(z)||z<100||r(e,{startingBoxes:{...o.startingBoxes,depth_mm:z}})},P=(o.cornerRadius.topLeft+o.cornerRadius.topRight+o.cornerRadius.bottomLeft+o.cornerRadius.bottomRight)/4;return l.jsxs("div",{className:"properties-panel",children:[l.jsxs("div",{className:"properties-panel__header",children:[l.jsx("h3",{children:"Track Properties"}),l.jsxs("div",{className:"properties-panel__court-info",children:[l.jsx("span",{className:"court-name",children:s.name}),l.jsx("span",{className:"court-standard",children:s.standard})]})]}),l.jsx("div",{className:"properties-panel__content",children:l.jsxs("div",{className:"properties-section",children:[l.jsx("div",{className:"properties-section__header",children:l.jsx("h4",{children:"Track Parameters"})}),l.jsxs("div",{className:"property-group",children:[l.jsx("label",{children:"Number of Lanes"}),l.jsxs("div",{className:"property-input-row",children:[l.jsx("input",{type:"range",min:"1",max:"8",value:o.numLanes,onChange:w=>y(w.target.value),className:"property-slider"}),l.jsxs("div",{className:"property-input-group property-input-group--compact",children:[l.jsx("input",{type:"number",value:o.numLanes,onChange:w=>y(w.target.value),min:"1",max:"8"}),l.jsx("span",{className:"property-unit",children:"lanes"})]})]})]}),f?l.jsxs("div",{className:"property-group property-group--info",children:[l.jsx("label",{children:"Track Width"}),l.jsx("div",{className:"property-info",children:l.jsxs("span",{children:[(o.width_mm/1e3).toFixed(1),"m (Auto-calculated from lanes)"]})})]}):l.jsxs("div",{className:"property-group",children:[l.jsx("label",{children:"Track Width"}),l.jsxs("div",{className:"property-input-group",children:[l.jsx("input",{type:"number",value:(o.width_mm/1e3).toFixed(1),onChange:w=>x(w.target.value),min:"3",max:"100",step:"0.5"}),l.jsx("span",{className:"property-unit",children:"m"})]})]}),l.jsxs("div",{className:"property-group",children:[l.jsx("label",{children:f?"Track Length":"Track Height"}),l.jsxs("div",{className:"property-input-group",children:[l.jsx("input",{type:"number",value:(o.height_mm/1e3).toFixed(1),onChange:w=>S(w.target.value),min:"3",max:"100",step:"0.5"}),l.jsx("span",{className:"property-unit",children:"m"})]})]}),!f&&l.jsxs("div",{className:"property-group",children:[l.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.5rem"},children:[l.jsx("label",{children:"Corner Radius"}),l.jsx("button",{className:"btn-toggle",onClick:()=>u(!c),style:{padding:"0.25rem 0.5rem",fontSize:"0.75rem",background:c?"#0066CC":"#6b7280",color:"white",border:"none",borderRadius:"4px",cursor:"pointer"},title:c?"Click to edit corners independently":"Click to lock all corners together",children:c?"🔒 Locked":"🔓 Independent"})]}),c?l.jsxs("div",{className:"property-input-group",children:[l.jsx("input",{type:"number",value:(P/1e3).toFixed(2),onChange:w=>j("topLeft",w.target.value),min:"0",max:(Math.min(o.width_mm,o.height_mm)/2e3).toFixed(2),step:"0.1"}),l.jsx("span",{className:"property-unit",children:"m"})]}):l.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.5rem"},children:[l.jsxs("div",{children:[l.jsx("label",{style:{fontSize:"0.75rem",color:"#64748b"},children:"Top Left"}),l.jsxs("div",{className:"property-input-group",children:[l.jsx("input",{type:"number",value:(o.cornerRadius.topLeft/1e3).toFixed(2),onChange:w=>j("topLeft",w.target.value),min:"0",max:(Math.min(o.width_mm,o.height_mm)/2e3).toFixed(2),step:"0.1"}),l.jsx("span",{className:"property-unit",children:"m"})]})]}),l.jsxs("div",{children:[l.jsx("label",{style:{fontSize:"0.75rem",color:"#64748b"},children:"Top Right"}),l.jsxs("div",{className:"property-input-group",children:[l.jsx("input",{type:"number",value:(o.cornerRadius.topRight/1e3).toFixed(2),onChange:w=>j("topRight",w.target.value),min:"0",max:(Math.min(o.width_mm,o.height_mm)/2e3).toFixed(2),step:"0.1"}),l.jsx("span",{className:"property-unit",children:"m"})]})]}),l.jsxs("div",{children:[l.jsx("label",{style:{fontSize:"0.75rem",color:"#64748b"},children:"Bottom Left"}),l.jsxs("div",{className:"property-input-group",children:[l.jsx("input",{type:"number",value:(o.cornerRadius.bottomLeft/1e3).toFixed(2),onChange:w=>j("bottomLeft",w.target.value),min:"0",max:(Math.min(o.width_mm,o.height_mm)/2e3).toFixed(2),step:"0.1"}),l.jsx("span",{className:"property-unit",children:"m"})]})]}),l.jsxs("div",{children:[l.jsx("label",{style:{fontSize:"0.75rem",color:"#64748b"},children:"Bottom Right"}),l.jsxs("div",{className:"property-input-group",children:[l.jsx("input",{type:"number",value:(o.cornerRadius.bottomRight/1e3).toFixed(2),onChange:w=>j("bottomRight",w.target.value),min:"0",max:(Math.min(o.width_mm,o.height_mm)/2e3).toFixed(2),step:"0.1"}),l.jsx("span",{className:"property-unit",children:"m"})]})]})]})]}),l.jsxs("div",{className:"property-group property-group--info",children:[l.jsx("label",{children:"Lane Width"}),l.jsx("div",{className:"property-info",children:l.jsxs("span",{children:[(o.laneWidth_mm/1e3).toFixed(2),"m (Fixed)"]})})]}),l.jsxs("div",{className:"property-group",children:[l.jsx("label",{children:"Track Surface Color"}),l.jsxs("div",{className:"color-item",children:[l.jsxs("div",{className:"color-item__info",children:[l.jsx("span",{className:"color-item__name",children:(a==null?void 0:a.name)||"Select Color"}),a&&l.jsx("span",{className:"color-item__code",children:a.tpv_code})]}),l.jsx("button",{className:"color-item__swatch",style:{backgroundColor:(a==null?void 0:a.hex)||"#A5362F"},onClick:()=>h(!0),title:(a==null?void 0:a.name)||"Select color"})]})]}),l.jsxs("div",{className:"property-group",children:[l.jsxs("label",{style:{display:"flex",alignItems:"center",gap:"0.5rem"},children:[l.jsx("input",{type:"checkbox",checked:((E=o.startingBoxes)==null?void 0:E.enabled)||!1,onChange:w=>R(w.target.checked)}),"Show Starting Boxes"]}),((I=o.startingBoxes)==null?void 0:I.enabled)&&l.jsxs("div",{style:{marginTop:"0.75rem"},children:[l.jsxs("div",{className:"property-input-group",style:{marginBottom:"0.5rem"},children:[l.jsx("span",{className:"property-label",style:{fontSize:"0.875rem"},children:"Depth"}),l.jsx("input",{type:"number",value:(o.startingBoxes.depth_mm/1e3).toFixed(2),onChange:w=>T(w.target.value),min:"0.1",max:"1.0",step:"0.05"}),l.jsx("span",{className:"property-unit",children:"m"})]}),l.jsx("div",{className:"property-info",style:{fontSize:"0.75rem",color:"#64748b",marginTop:"0.5rem"},children:"Boxes use track surface color with white starting line and lane numbers"}),!f&&v.length>0&&l.jsxs("div",{style:{marginTop:"0.75rem",padding:"0.5rem",background:"#f8fafc",borderRadius:"4px"},children:[l.jsx("div",{style:{fontSize:"0.75rem",fontWeight:"600",color:"#1e293b",marginBottom:"0.25rem"},children:"Auto-Calculated Staggers:"}),l.jsx("div",{style:{fontSize:"0.7rem",color:"#64748b",lineHeight:"1.4"},children:v.map((w,z)=>l.jsxs("div",{children:["Lane ",z+1,": ",(w/1e3).toFixed(2),"m"]},z))}),l.jsx("div",{style:{fontSize:"0.65rem",color:"#64748b",marginTop:"0.25rem",fontStyle:"italic"},children:"Outer lanes start ahead to equalize distance"})]})]})]}),l.jsx("div",{className:"property-divider"}),l.jsx("div",{className:"properties-section__header",children:l.jsx("h4",{children:"Calculated Dimensions"})}),l.jsxs("div",{className:"property-group property-group--info",children:[l.jsx("label",{children:"Usable Infield"}),l.jsx("div",{className:"property-info",children:l.jsxs("span",{children:[(p.usableWidth/1e3).toFixed(1),"m × ",(p.usableHeight/1e3).toFixed(1),"m"]})})]}),l.jsxs("div",{className:"property-group property-group--info",children:[l.jsx("label",{children:"Lane 1 Perimeter"}),l.jsx("div",{className:"property-info",children:l.jsxs("span",{children:[g.toFixed(2),"m"]})})]}),o.numLanes>1&&l.jsxs("div",{className:"property-group property-group--info",children:[l.jsxs("label",{children:["Lane ",o.numLanes," Perimeter"]}),l.jsx("div",{className:"property-info",children:l.jsxs("span",{children:[b.toFixed(2),"m"]})})]}),l.jsx("div",{className:"property-group",children:l.jsx("div",{className:"property-hint",style:{fontStyle:"normal",color:"#64748b",fontSize:"0.75rem",marginTop:"1rem"},children:"💡 Tip: Use drag handles on the canvas or edit values here. Corner radius auto-adjusts when locked."})}),l.jsx("div",{className:"property-group property-group--actions",children:l.jsx("button",{className:"btn-delete",onClick:_,title:"Delete track (Delete key)",children:"🗑️ Delete Track"})})]})}),d&&l.jsx("div",{className:"color-picker-modal",onClick:()=>h(!1),children:l.jsxs("div",{className:"color-picker-modal__content",onClick:w=>w.stopPropagation(),children:[l.jsxs("div",{className:"color-picker-modal__header",children:[l.jsx("h4",{children:"Select Track Surface Color"}),l.jsx("button",{onClick:()=>h(!1),children:"×"})]}),l.jsx("div",{className:"color-picker-grid",children:en.map(w=>l.jsx("button",{className:"color-picker-swatch",style:{backgroundColor:w.hex},onClick:()=>C(w),title:`${w.code} - ${w.name}`,children:l.jsx("span",{className:"color-picker-swatch__code",children:w.code})},w.code))})]})})]})}function vU(){const[t,e]=M.useState(!0),[r,n]=M.useState("28"),[i,o]=M.useState("15"),[s,a]=M.useState(!1),{surface:c,courts:u,tracks:d,selectedCourtId:h,selectedTrackId:f,showCourtLibrary:p,showPropertiesPanel:g,toggleCourtLibrary:m,togglePropertiesPanel:b,setSurfaceDimensions:v,setSurfaceColor:y}=Gt(),x=j=>{j.preventDefault();const _=parseFloat(r)*1e3,C=parseFloat(i)*1e3;_>0&&C>0&&(v(_,C),e(!1))},S=j=>{y({tpv_code:j.code,hex:j.hex,name:j.name}),a(!1)};return M.useEffect(()=>{const j=_=>{const{removeCourt:C,removeTrack:R,deselectCourt:T,deselectTrack:P,undo:H,redo:E,canUndo:I,canRedo:w,duplicateCourt:z,updateCourtPosition:Z,updateTrackPosition:q,courts:V,tracks:A,elementOrder:K,setElementOrder:L,toggleSnapToGrid:B,snapToGrid:fe,addToHistory:te}=Gt.getState(),ae=h||f;if(_.key==="Delete"&&ae&&(_.preventDefault(),h?C(h):f&&R(f)),_.key==="Escape"&&ae&&(h?T():f&&P()),(_.ctrlKey||_.metaKey)&&_.key==="z"&&!_.shiftKey&&(_.preventDefault(),I()&&H()),(_.ctrlKey||_.metaKey)&&_.key==="z"&&_.shiftKey&&(_.preventDefault(),w()&&E()),(_.ctrlKey||_.metaKey)&&_.key==="d"&&h&&(_.preventDefault(),z(h)),ae&&["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(_.key)){_.preventDefault();const ge=_.shiftKey?10:100;let je=0,me=0;if(_.key==="ArrowLeft"&&(je=-ge),_.key==="ArrowRight"&&(je=ge),_.key==="ArrowUp"&&(me=-ge),_.key==="ArrowDown"&&(me=ge),h){const be=V[h];be&&(Z(h,{x:be.position.x+je,y:be.position.y+me}),te())}else if(f){const be=A[f];be&&(q(f,{x:be.position.x+je,y:be.position.y+me}),te())}}if(ae&&(_.key==="["||_.key==="]")){_.preventDefault();const ge=K.indexOf(ae);if(ge===-1)return;const je=[...K];_.key==="["&&ge>0?([je[ge],je[ge-1]]=[je[ge-1],je[ge]],L(je),te()):_.key==="]"&&ge<K.length-1&&([je[ge],je[ge+1]]=[je[ge+1],je[ge]],L(je),te())}(_.key==="g"||_.key==="G")&&(_.preventDefault(),B())};return window.addEventListener("keydown",j),()=>window.removeEventListener("keydown",j)},[h,f]),l.jsxs("div",{className:"sports-designer",children:[t&&l.jsx("div",{className:"sports-designer__modal-overlay",children:l.jsxs("div",{className:"sports-designer__modal",children:[l.jsx("h2",{children:"Create Sports Surface"}),l.jsx("p",{children:"Enter the dimensions of your sports surface"}),l.jsxs("form",{onSubmit:x,children:[l.jsxs("div",{className:"sports-designer__dimension-inputs",children:[l.jsxs("div",{className:"sports-designer__input-group",children:[l.jsx("label",{htmlFor:"width",children:"Width (metres)"}),l.jsx("input",{id:"width",type:"number",min:"5",max:"100",step:"0.5",value:r,onChange:j=>n(j.target.value),required:!0,autoFocus:!0})]}),l.jsx("span",{className:"sports-designer__dimension-separator",children:"×"}),l.jsxs("div",{className:"sports-designer__input-group",children:[l.jsx("label",{htmlFor:"length",children:"Length (metres)"}),l.jsx("input",{id:"length",type:"number",min:"5",max:"100",step:"0.5",value:i,onChange:j=>o(j.target.value),required:!0})]})]}),l.jsx("p",{className:"sports-designer__dimension-hint",children:"Common MUGA size: 28m × 15m (basketball) or 40m × 20m (futsal)"}),l.jsx("button",{type:"submit",className:"sports-designer__btn-primary",children:"Create Surface"})]})]})}),!t&&l.jsxs(l.Fragment,{children:[l.jsxs("div",{className:"sports-designer__toolbar",children:[l.jsxs("div",{className:"sports-designer__toolbar-left",children:[l.jsxs("button",{className:"sports-designer__toolbar-btn",onClick:m,title:"Toggle Court Library",children:[l.jsx("span",{className:"sports-designer__icon",children:"📚"}),p?"Hide":"Show"," Courts"]}),l.jsxs("button",{className:"sports-designer__toolbar-btn",onClick:b,title:"Toggle Properties Panel",disabled:!h&&!f,children:[l.jsx("span",{className:"sports-designer__icon",children:"⚙️"}),g?"Hide":"Show"," Properties"]}),l.jsxs("div",{className:"sports-designer__surface-info",children:[l.jsx("span",{className:"sports-designer__label",children:"Surface:"}),l.jsxs("span",{className:"sports-designer__value",children:[(c.width_mm/1e3).toFixed(1),"m × ",(c.length_mm/1e3).toFixed(1),"m"]}),l.jsx("button",{className:"sports-designer__surface-color-btn",style:{backgroundColor:c.color.hex},onClick:()=>a(!0),title:`Surface Color: ${c.color.name} (${c.color.tpv_code}) - Click to change`})]}),l.jsxs("div",{className:"sports-designer__court-count",children:[l.jsx("span",{className:"sports-designer__label",children:"Courts:"}),l.jsx("span",{className:"sports-designer__value",children:Object.keys(u).length})]})]}),l.jsxs("div",{className:"sports-designer__toolbar-right",children:[l.jsxs("button",{className:"sports-designer__toolbar-btn",onClick:()=>e(!0),title:"Change Surface Dimensions",children:[l.jsx("span",{className:"sports-designer__icon",children:"📏"}),"Resize"]}),l.jsxs("button",{className:"sports-designer__toolbar-btn",disabled:!Gt.getState().canUndo(),onClick:()=>Gt.getState().undo(),title:"Undo (Ctrl+Z)",children:[l.jsx("span",{className:"sports-designer__icon",children:"↶"}),"Undo"]}),l.jsxs("button",{className:"sports-designer__toolbar-btn",disabled:!Gt.getState().canRedo(),onClick:()=>Gt.getState().redo(),title:"Redo (Ctrl+Shift+Z)",children:[l.jsx("span",{className:"sports-designer__icon",children:"↷"}),"Redo"]})]})]}),l.jsxs("div",{className:"sports-designer__content",children:[p&&l.jsx("aside",{className:"sports-designer__sidebar",children:l.jsx(uU,{})}),l.jsx("main",{className:"sports-designer__canvas-container",children:l.jsx(iU,{})}),(h||f)&&g&&l.jsx("aside",{className:"sports-designer__properties",children:l.jsx(mU,{})})]}),Object.keys(u).length===0&&Object.keys(d).length===0&&l.jsx("div",{className:"sports-designer__empty-state",children:l.jsxs("div",{className:"sports-designer__empty-content",children:[l.jsx("h3",{children:"Add Your First Element"}),l.jsxs("p",{children:["Select a court or track from the library on the left to place it on your surface.",l.jsx("br",{}),"You can then move, rotate, scale, and customize your design."]})]})}),s&&l.jsx("div",{className:"sports-designer__color-modal-overlay",onClick:()=>a(!1),children:l.jsxs("div",{className:"sports-designer__color-modal",onClick:j=>j.stopPropagation(),children:[l.jsxs("div",{className:"sports-designer__color-modal-header",children:[l.jsx("h4",{children:"Select Surface Colour"}),l.jsx("button",{onClick:()=>a(!1),children:"×"})]}),l.jsx("div",{className:"sports-designer__color-grid",children:en.map(j=>l.jsx("button",{className:`sports-designer__color-swatch ${c.color.tpv_code===j.code?"sports-designer__color-swatch--selected":""}`,style:{backgroundColor:j.hex},onClick:()=>S(j),title:`${j.code} - ${j.name}`,children:l.jsx("span",{className:"sports-designer__color-code",children:j.code})},j.code))})]})})]})]})}function yU({onSelectTool:t}){return l.jsx("div",{className:"tool-selection",children:l.jsxs("div",{className:"tool-selection__container",children:[l.jsxs("header",{className:"tool-selection__header",children:[l.jsx("h1",{children:"Welcome to TPV Studio"}),l.jsx("p",{children:"Choose a design tool to get started"})]}),l.jsxs("div",{className:"tool-selection__tools",children:[l.jsxs("div",{className:"tool-selection__card",onClick:()=>t("playground"),children:[l.jsx("div",{className:"tool-selection__icon",children:"🎨"}),l.jsx("h2",{children:"Playground Designer"}),l.jsx("p",{children:"AI-powered playground surface design with custom patterns and colours"}),l.jsxs("ul",{className:"tool-selection__features",children:[l.jsx("li",{children:"Generate designs from text prompts"}),l.jsx("li",{children:"Upload and vectorise your own artwork"}),l.jsx("li",{children:"21 TPV colours with blend options"}),l.jsx("li",{children:"Material quantity calculations"}),l.jsx("li",{children:"Professional PDF specifications"})]}),l.jsx("button",{className:"tool-selection__btn tool-selection__btn--primary",children:"Open Playground Designer"})]}),l.jsxs("div",{className:"tool-selection__card",onClick:()=>t("sports"),children:[l.jsx("div",{className:"tool-selection__icon",children:"⚽"}),l.jsx("h2",{children:"Sports Surface Designer"}),l.jsx("p",{children:"Professional MUGA and sports court layout with precise markings"}),l.jsxs("ul",{className:"tool-selection__features",children:[l.jsx("li",{children:"Standard court templates (Basketball, Netball, Tennis, Futsal)"}),l.jsx("li",{children:"Multi-court layouts with positioning"}),l.jsx("li",{children:"Customisable line colours and zones"}),l.jsx("li",{children:"Official dimensions from governing bodies"}),l.jsx("li",{children:"Material specifications and line marking plans"})]}),l.jsx("button",{className:"tool-selection__btn tool-selection__btn--secondary",children:"Open Sports Designer"})]})]}),l.jsx("footer",{className:"tool-selection__footer",children:l.jsxs("p",{children:["Need help deciding? ",l.jsx("a",{href:"mailto:support@rosehill.group",children:"Contact our team"})]})})]})})}function Wv({onShowDesigns:t,onShowAdmin:e,isAdmin:r,currentDesignName:n,onBackToTools:i}){const[o,s]=M.useState(!1),a=async()=>{confirm("Sign out?")&&(await vn.signOut(),window.location.reload())};return l.jsx("header",{className:"studio-header",children:l.jsxs("div",{className:"header-content",children:[l.jsxs("div",{className:"header-left",children:[l.jsx("h1",{className:"studio-title",children:"TPV Studio"}),n&&l.jsxs("span",{className:"current-design-indicator",children:[l.jsx("svg",{width:"4",height:"4",viewBox:"0 0 4 4",children:l.jsx("circle",{cx:"2",cy:"2",r:"2",fill:"currentColor"})}),n]})]}),l.jsxs("div",{className:"header-right",children:[i&&l.jsxs("button",{onClick:i,className:"btn-back-tools",children:[l.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:l.jsx("path",{d:"M19 12H5M12 19l-7-7 7-7"})}),"Back to Tools"]}),l.jsxs("button",{onClick:t,className:"btn-my-designs",children:[l.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[l.jsx("path",{d:"M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"}),l.jsx("path",{d:"M9 22V12h6v10"})]}),"My Designs"]}),r&&l.jsxs("button",{onClick:e,className:"btn-admin",children:[l.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[l.jsx("path",{d:"M12 15a3 3 0 100-6 3 3 0 000 6z"}),l.jsx("path",{d:"M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"})]}),"Admin"]}),l.jsxs("div",{className:"user-menu",children:[l.jsx("button",{onClick:()=>s(!o),className:"user-menu-button",children:l.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[l.jsx("path",{d:"M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"}),l.jsx("circle",{cx:"12",cy:"7",r:"4"})]})}),o&&l.jsxs(l.Fragment,{children:[l.jsx("div",{className:"user-menu-backdrop",onClick:()=>s(!1)}),l.jsx("div",{className:"user-menu-dropdown",children:l.jsxs("button",{onClick:a,className:"menu-item sign-out",children:[l.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:l.jsx("path",{d:"M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"})}),"Sign Out"]})})]})]})]})]})})}function bU({design:t,onLoad:e,onDelete:r,onUpdateMetadata:n}){const[i,o]=M.useState(!1),[s,a]=M.useState(!1),c=async()=>{if(confirm(`Delete "${t.name}"? This cannot be undone.`)){a(!0);try{await r(t.id)}catch(h){console.error("Failed to delete design:",h),alert(`Failed to delete: ${h.message}`),a(!1)}}},u=h=>{const f=new Date(h),p=new Date,g=p-f,m=Math.floor(g/(1e3*60*60*24));return m===0?"Today":m===1?"Yesterday":m<7?`${m} days ago`:m<30?`${Math.floor(m/7)} weeks ago`:f.toLocaleDateString("en-GB",{day:"numeric",month:"short",year:f.getFullYear()!==p.getFullYear()?"numeric":void 0})},d=t.thumbnail_url||t.original_png_url||t.original_svg_url;return l.jsxs("div",{className:`design-card ${s?"deleting":""}`,onMouseEnter:()=>o(!0),onMouseLeave:()=>o(!1),children:[l.jsxs("div",{className:"card-thumbnail",onClick:()=>e(t.id),children:[d?l.jsx("img",{src:d,alt:t.name}):l.jsx("div",{className:"no-thumbnail",children:l.jsxs("svg",{width:"48",height:"48",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[l.jsx("rect",{x:"3",y:"3",width:"18",height:"18",rx:"2",ry:"2"}),l.jsx("circle",{cx:"8.5",cy:"8.5",r:"1.5"}),l.jsx("polyline",{points:"21 15 16 10 5 21"})]})}),i&&l.jsx("div",{className:"thumbnail-overlay",children:l.jsx("button",{className:"btn-load",children:"Open Design"})})]}),l.jsxs("div",{className:"card-info",children:[l.jsx("h3",{className:"design-name",title:t.name,children:t.name}),t.description&&l.jsx("p",{className:"design-description",title:t.description,children:t.description}),l.jsxs("div",{className:"card-meta",children:[t.projects&&l.jsx("span",{className:"project-badge",style:{backgroundColor:t.projects.color||"#1a365d"},title:t.projects.name,children:t.projects.name}),l.jsx("span",{className:"design-date",title:new Date(t.updated_at).toLocaleString(),children:u(t.updated_at)})]}),t.tags&&t.tags.length>0&&l.jsxs("div",{className:"design-tags",children:[t.tags.slice(0,3).map((h,f)=>l.jsx("span",{className:"tag",children:h},f)),t.tags.length>3&&l.jsxs("span",{className:"tag more",children:["+",t.tags.length-3]})]})]}),i&&!s&&l.jsxs("div",{className:"card-actions",children:[l.jsx("button",{onClick:()=>e(t.id),className:"action-btn load-btn",title:"Load design",children:l.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[l.jsx("path",{d:"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"}),l.jsx("circle",{cx:"12",cy:"12",r:"3"})]})}),l.jsx("button",{onClick:c,className:"action-btn delete-btn",title:"Delete design",children:l.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:l.jsx("path",{d:"M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"})})})]}),s&&l.jsx("div",{className:"deleting-overlay",children:l.jsx("div",{className:"spinner"})})]})}function Gv({onClose:t,onLoadDesign:e}){const[r,n]=M.useState([]),[i,o]=M.useState([]),[s,a]=M.useState(!0),[c,u]=M.useState(null),[d,h]=M.useState(""),[f,p]=M.useState(""),[g,m]=M.useState(!1),[b,v]=M.useState(!1);M.useEffect(()=>{y()},[d,f]);const y=async()=>{a(!0),u(null);try{const[_,C]=await Promise.all([T1(),Ah({project_id:d||void 0,search:f||void 0,limit:12,offset:0})]);o(_.projects),n(C.designs),m(C.pagination.has_more)}catch(_){console.error("Failed to load designs:",_),u(_.message)}finally{a(!1)}},x=async()=>{if(!(b||!g)){v(!0);try{const _=await Ah({project_id:d||void 0,search:f||void 0,limit:12,offset:r.length});n([...r,..._.designs]),m(_.pagination.has_more)}catch(_){console.error("Failed to load more designs:",_),u(_.message)}finally{v(!1)}}},S=async _=>{try{const{design:C}=await Mj(_);e(C),t()}catch(C){console.error("Failed to load design:",C),alert(`Failed to load design: ${C.message}`)}},j=async _=>{try{await Lj(_),n(r.filter(C=>C.id!==_))}catch(C){throw console.error("Failed to delete design:",C),C}};return l.jsx("div",{className:"modal-overlay",onClick:t,children:l.jsxs("div",{className:"modal-content design-gallery-modal",onClick:_=>_.stopPropagation(),children:[l.jsxs("div",{className:"modal-header",children:[l.jsx("h2",{children:"My Designs"}),l.jsx("button",{onClick:t,className:"close-button",children:"×"})]}),l.jsxs("div",{className:"gallery-filters",children:[l.jsx("div",{className:"filter-group",children:l.jsx("input",{type:"text",placeholder:"Search designs...",value:f,onChange:_=>p(_.target.value),className:"search-input"})}),l.jsx("div",{className:"filter-group",children:l.jsxs("select",{value:d,onChange:_=>h(_.target.value),className:"project-filter",children:[l.jsx("option",{value:"",children:"All Projects"}),i.map(_=>l.jsxs("option",{value:_.id,children:[_.name," (",_.design_count,")"]},_.id))]})})]}),l.jsxs("div",{className:"modal-body",children:[c&&l.jsxs("div",{className:"error-message",children:[c,l.jsx("button",{onClick:y,className:"btn-retry",children:"Retry"})]}),s?l.jsxs("div",{className:"loading-state",children:[l.jsx("div",{className:"spinner-large"}),l.jsx("p",{children:"Loading your designs..."})]}):r.length===0?l.jsxs("div",{className:"empty-state",children:[l.jsxs("svg",{width:"64",height:"64",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[l.jsx("path",{d:"M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"}),l.jsx("path",{d:"M17 21v-8H7v8M7 3v5h8"})]}),l.jsx("h3",{children:"No designs yet"}),l.jsx("p",{children:f||d?"No designs match your filters. Try adjusting your search.":"Create your first design to see it here!"})]}):l.jsxs(l.Fragment,{children:[l.jsx("div",{className:"designs-grid",children:r.map(_=>l.jsx(bU,{design:_,onLoad:S,onDelete:j},_.id))}),g&&l.jsx("div",{className:"load-more-section",children:l.jsx("button",{onClick:x,className:"btn-load-more",disabled:b,children:b?"Loading...":"Load More"})})]})]})]})})}function xU(){const[t,e]=M.useState([]),[r,n]=M.useState(0),[i,o]=M.useState(!1),[s,a]=M.useState(null),[c,u]=M.useState("all"),[d,h]=M.useState("all"),[f,p]=M.useState(""),[g,m]=M.useState(0),b=50,v=async()=>{var R,T;const _=await Mt.auth.getSession();return{"Content-Type":"application/json",Authorization:`Bearer ${(T=(R=_==null?void 0:_.data)==null?void 0:R.session)==null?void 0:T.access_token}`}},y=async()=>{o(!0),a(null);try{const _=await v(),C=new URLSearchParams({limit:b.toString(),offset:g.toString()});c!=="all"&&C.append("status",c),d!=="all"&&C.append("saved_status",d),f&&C.append("search",f);const R=await fetch(`/api/admin/jobs?${C.toString()}`,{headers:_}),T=await R.json();if(!R.ok)throw new Error(T.error||"Failed to fetch jobs");e(T.jobs),n(T.total)}catch(_){console.error("Failed to fetch jobs:",_),a(_.message)}finally{o(!1)}};M.useEffect(()=>{y()},[c,d,f,g]);const x=t.filter(_=>_.status==="completed").length,S=t.filter(_=>!_.is_saved&&_.status==="completed").length,j=t.filter(_=>_.is_saved).length;return l.jsxs("div",{className:"generations-tab",children:[l.jsxs("div",{className:"admin-stats-grid",children:[l.jsxs("div",{className:"admin-stat-card",children:[l.jsx("h3",{children:"Total Generations"}),l.jsx("p",{className:"stat-value",children:r}),l.jsx("span",{className:"stat-label",children:"All time"})]}),l.jsxs("div",{className:"admin-stat-card",children:[l.jsx("h3",{children:"Completed"}),l.jsx("p",{className:"stat-value",children:x}),l.jsx("span",{className:"stat-label",children:"Current page"})]}),l.jsxs("div",{className:"admin-stat-card success",children:[l.jsx("h3",{children:"Saved"}),l.jsx("p",{className:"stat-value",children:j}),l.jsx("span",{className:"stat-label",children:"✓ Linked to designs"})]}),l.jsxs("div",{className:"admin-stat-card warning",children:[l.jsx("h3",{children:"Orphaned"}),l.jsx("p",{className:"stat-value",children:S}),l.jsx("span",{className:"stat-label",children:"⚠ Not saved"})]})]}),l.jsxs("div",{className:"admin-filters",children:[l.jsxs("div",{className:"filter-group",children:[l.jsx("label",{children:"Status:"}),l.jsxs("select",{value:c,onChange:_=>u(_.target.value),children:[l.jsx("option",{value:"all",children:"All"}),l.jsx("option",{value:"completed",children:"Completed"}),l.jsx("option",{value:"failed",children:"Failed"}),l.jsx("option",{value:"running",children:"Running"}),l.jsx("option",{value:"queued",children:"Queued"})]})]}),l.jsxs("div",{className:"filter-group",children:[l.jsx("label",{children:"Saved:"}),l.jsxs("select",{value:d,onChange:_=>h(_.target.value),children:[l.jsx("option",{value:"all",children:"All"}),l.jsx("option",{value:"saved",children:"Saved only"}),l.jsx("option",{value:"orphaned",children:"Orphaned only"})]})]}),l.jsxs("div",{className:"filter-group search",children:[l.jsx("label",{children:"Search prompt:"}),l.jsx("input",{type:"text",placeholder:"Search in prompts...",value:f,onChange:_=>p(_.target.value)})]})]}),i&&l.jsxs("div",{className:"admin-loading",children:[l.jsx("div",{className:"spinner"}),l.jsx("p",{children:"Loading jobs..."})]}),s&&l.jsx("div",{className:"admin-error",children:l.jsxs("p",{children:["Error: ",s]})}),!i&&t.length>0&&l.jsx("div",{className:"jobs-table-container",children:l.jsxs("table",{className:"jobs-table",children:[l.jsx("thead",{children:l.jsxs("tr",{children:[l.jsx("th",{children:"Thumbnail"}),l.jsx("th",{children:"Prompt"}),l.jsx("th",{children:"Dimensions"}),l.jsx("th",{children:"Status"}),l.jsx("th",{children:"Saved"}),l.jsx("th",{children:"User"}),l.jsx("th",{children:"Created"})]})}),l.jsx("tbody",{children:t.map(_=>l.jsxs("tr",{className:`job-row ${_.is_saved?"saved":"orphaned"} ${_.status}`,children:[l.jsx("td",{className:"thumbnail-cell",children:_.thumbnail_url?l.jsx("img",{src:_.thumbnail_url,alt:"Design",className:"job-thumbnail"}):l.jsx("div",{className:"thumbnail-placeholder",children:"No image"})}),l.jsx("td",{className:"prompt-cell",children:l.jsx("div",{className:"prompt-text",title:_.prompt,children:_.prompt||l.jsx("em",{children:"No prompt"})})}),l.jsx("td",{className:"dimensions-cell",children:_.width_mm&&_.length_mm?l.jsxs("span",{children:[_.width_mm," × ",_.length_mm," mm"]}):l.jsx("em",{children:"N/A"})}),l.jsx("td",{className:"status-cell",children:l.jsx("span",{className:`status-badge ${_.status}`,children:_.status})}),l.jsx("td",{className:"saved-cell",children:_.is_saved?l.jsx("span",{className:"saved-badge",children:"✓ Saved"}):l.jsx("span",{className:"orphaned-badge",children:"⚠ Orphaned"})}),l.jsx("td",{className:"user-cell",children:_.user_email}),l.jsx("td",{className:"date-cell",children:new Date(_.created_at).toLocaleDateString()})]},_.id))})]})}),!i&&t.length===0&&l.jsx("div",{className:"admin-empty",children:l.jsx("p",{children:"No jobs found matching your filters."})}),r>b&&l.jsxs("div",{className:"admin-pagination",children:[l.jsx("button",{onClick:()=>m(Math.max(0,g-b)),disabled:g===0,children:"Previous"}),l.jsxs("span",{children:["Showing ",g+1," to ",Math.min(g+b,r)," of ",r]}),l.jsx("button",{onClick:()=>m(g+b),disabled:g+b>=r,children:"Next"})]}),l.jsx("style",{children:`
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
      `})]})}function wU(){const[t,e]=M.useState([]),[r,n]=M.useState(null),[i,o]=M.useState(!1),[s,a]=M.useState(null),[c,u]=M.useState(!1),[d,h]=M.useState(new Set),[f,p]=M.useState("all"),g=async()=>{var _,C;const S=await Mt.auth.getSession();return{"Content-Type":"application/json",Authorization:`Bearer ${(C=(_=S==null?void 0:S.data)==null?void 0:_.session)==null?void 0:C.access_token}`}},m=async()=>{o(!0),a(null);try{const S=await g(),j=new URLSearchParams;f!=="all"&&j.append("age_filter",f);const _=await fetch(`/api/admin/recovery/orphaned?${j.toString()}`,{headers:S}),C=await _.json();if(!_.ok)throw new Error(C.error||"Failed to fetch orphaned jobs");e(C.orphaned_jobs),n(C.age_buckets)}catch(S){console.error("Failed to fetch orphaned jobs:",S),a(S.message)}finally{o(!1)}};M.useEffect(()=>{m()},[f]);const b=S=>{const j=new Set(d);j.has(S)?j.delete(S):j.add(S),h(j)},v=()=>{h(new Set(t.map(S=>S.id)))},y=()=>{h(new Set)},x=async()=>{if(d.size===0){alert("Please select at least one job to recover");return}if(confirm(`Recover ${d.size} orphaned ${d.size===1?"design":"designs"}?`)){u(!0),a(null);try{const S=await g(),j=await fetch("/api/admin/recovery/create",{method:"POST",headers:S,body:JSON.stringify({job_ids:Array.from(d)})}),_=await j.json();if(!j.ok)throw new Error(_.error||"Failed to recover designs");alert(`Successfully recovered ${_.recovered_count} ${_.recovered_count===1?"design":"designs"}!`),y(),await m()}catch(S){console.error("Failed to recover designs:",S),a(S.message),alert(`Recovery failed: ${S.message}`)}finally{u(!1)}}};return l.jsxs("div",{className:"recovery-tab",children:[l.jsxs("div",{className:"admin-stats-grid",children:[l.jsxs("div",{className:"admin-stat-card warning",children:[l.jsx("h3",{children:"Total Orphaned"}),l.jsx("p",{className:"stat-value",children:t.length}),l.jsx("span",{className:"stat-label",children:"Designs not saved"})]}),r&&l.jsxs(l.Fragment,{children:[l.jsxs("div",{className:"admin-stat-card",children:[l.jsx("h3",{children:"<24 hours"}),l.jsx("p",{className:"stat-value",children:r["<24h"]}),l.jsx("span",{className:"stat-label",children:"Recent"})]}),l.jsxs("div",{className:"admin-stat-card",children:[l.jsx("h3",{children:"1-7 days"}),l.jsx("p",{className:"stat-value",children:r["1-7d"]}),l.jsx("span",{className:"stat-label",children:"This week"})]}),l.jsxs("div",{className:"admin-stat-card",children:[l.jsx("h3",{children:">7 days"}),l.jsx("p",{className:"stat-value",children:r["7-30d"]+r[">30d"]}),l.jsx("span",{className:"stat-label",children:"Older"})]})]})]}),l.jsxs("div",{className:"recovery-controls",children:[l.jsx("div",{className:"admin-filters",children:l.jsxs("div",{className:"filter-group",children:[l.jsx("label",{children:"Age:"}),l.jsxs("select",{value:f,onChange:S=>p(S.target.value),children:[l.jsx("option",{value:"all",children:"All"}),l.jsx("option",{value:"24h",children:"<24 hours"}),l.jsx("option",{value:"7d",children:"<7 days"}),l.jsx("option",{value:"30d",children:"<30 days"})]})]})}),l.jsxs("div",{className:"bulk-actions",children:[l.jsx("button",{onClick:v,className:"btn-secondary",children:"Select All"}),l.jsxs("button",{onClick:y,className:"btn-secondary",children:["Clear (",d.size,")"]}),l.jsx("button",{onClick:x,disabled:d.size===0||c,className:"btn-primary",children:c?"Recovering...":`Recover Selected (${d.size})`})]})]}),i&&l.jsxs("div",{className:"admin-loading",children:[l.jsx("div",{className:"spinner"}),l.jsx("p",{children:"Loading orphaned jobs..."})]}),s&&l.jsx("div",{className:"admin-error",children:l.jsxs("p",{children:["Error: ",s]})}),!i&&t.length>0&&l.jsx("div",{className:"recovery-table-container",children:l.jsxs("table",{className:"recovery-table",children:[l.jsx("thead",{children:l.jsxs("tr",{children:[l.jsx("th",{style:{width:"40px"},children:l.jsx("input",{type:"checkbox",checked:d.size===t.length,onChange:S=>S.target.checked?v():y()})}),l.jsx("th",{children:"Thumbnail"}),l.jsx("th",{children:"Prompt / Auto-name"}),l.jsx("th",{children:"Dimensions"}),l.jsx("th",{children:"Age"}),l.jsx("th",{children:"User"})]})}),l.jsx("tbody",{children:t.map(S=>l.jsxs("tr",{className:d.has(S.id)?"selected":"",onClick:()=>b(S.id),children:[l.jsx("td",{onClick:j=>j.stopPropagation(),children:l.jsx("input",{type:"checkbox",checked:d.has(S.id),onChange:()=>b(S.id)})}),l.jsx("td",{className:"thumbnail-cell",children:S.thumbnail_url?l.jsx("img",{src:S.thumbnail_url,alt:"Design",className:"job-thumbnail"}):l.jsx("div",{className:"thumbnail-placeholder",children:"No image"})}),l.jsxs("td",{className:"prompt-cell",children:[l.jsx("div",{className:"prompt-text",title:S.prompt,children:S.auto_name}),S.prompt&&S.prompt.length>50&&l.jsx("div",{className:"prompt-full",children:S.prompt})]}),l.jsx("td",{className:"dimensions-cell",children:S.width_mm&&S.length_mm?l.jsxs("span",{children:[S.width_mm," × ",S.length_mm," mm"]}):l.jsx("em",{children:"N/A"})}),l.jsx("td",{className:"age-cell",children:l.jsxs("span",{className:`age-badge ${S.age_bucket.replace(/[<>]/g,"")}`,children:[S.age_days," ",S.age_days===1?"day":"days"]})}),l.jsx("td",{className:"user-cell",children:S.user_email})]},S.id))})]})}),!i&&t.length===0&&l.jsx("div",{className:"admin-empty",children:l.jsx("p",{children:"No orphaned jobs found. All designs have been saved!"})}),l.jsx("style",{children:`
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
      `})]})}function _U({onClose:t}){const[e,r]=M.useState("overview"),[n,i]=M.useState(!0),[o,s]=M.useState(null),[a,c]=M.useState(null),[u,d]=M.useState([]),[h,f]=M.useState([]),[p,g]=M.useState(0),[m,b]=M.useState(null),v=async()=>{var R,T;const _=await Mt.auth.getSession();return{"Content-Type":"application/json",Authorization:`Bearer ${(T=(R=_==null?void 0:_.data)==null?void 0:R.session)==null?void 0:T.access_token}`}},y=async()=>{try{const _=await v(),C=await fetch("/api/admin/analytics/overview",{headers:_}),R=await C.json();if(!C.ok)throw new Error(R.error||"Failed to fetch overview");c(R.stats)}catch(_){console.error("Failed to fetch overview:",_),s(_.message)}},x=async()=>{try{const _=await v(),C=await fetch("/api/admin/users",{headers:_}),R=await C.json();if(!C.ok)throw new Error(R.error||"Failed to fetch users");d(R.users)}catch(_){console.error("Failed to fetch users:",_),s(_.message)}},S=async()=>{try{const _=await v(),C=await fetch("/api/admin/designs?limit=50",{headers:_}),R=await C.json();if(!C.ok)throw new Error(R.error||"Failed to fetch designs");f(R.designs),g(R.total)}catch(_){console.error("Failed to fetch designs:",_),s(_.message)}},j=async()=>{try{const _=await v(),C=await fetch("/api/admin/analytics/colours",{headers:_}),R=await C.json();if(!C.ok)throw new Error(R.error||"Failed to fetch colour analytics");b(R.analytics)}catch(_){console.error("Failed to fetch colours:",_),s(_.message)}};return M.useEffect(()=>{(async()=>{i(!0),await y(),i(!1)})()},[]),M.useEffect(()=>{e==="users"&&u.length===0?x():e==="designs"&&h.length===0?S():e==="colours"&&!m&&j()},[e]),n?l.jsxs("div",{className:"admin-loading",children:[l.jsx("div",{className:"spinner"}),l.jsx("p",{children:"Loading admin dashboard..."})]}):o?l.jsxs("div",{className:"admin-error",children:[l.jsx("h2",{children:"Access Denied"}),l.jsx("p",{children:o}),l.jsx("p",{children:"You need admin privileges to view this page."})]}):l.jsxs("div",{className:"admin-dashboard",children:[l.jsxs("header",{className:"admin-header",children:[l.jsxs("div",{className:"admin-header-left",children:[l.jsxs("button",{onClick:t,className:"btn-back",children:[l.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:l.jsx("path",{d:"M19 12H5M12 19l-7-7 7-7"})}),"Back to Studio"]}),l.jsx("h1",{children:"TPV Studio Admin"})]}),l.jsxs("nav",{className:"admin-nav",children:[l.jsx("button",{className:e==="overview"?"active":"",onClick:()=>r("overview"),children:"Overview"}),l.jsx("button",{className:e==="generations"?"active":"",onClick:()=>r("generations"),children:"Generations"}),l.jsx("button",{className:e==="recovery"?"active":"",onClick:()=>r("recovery"),children:"Recovery"}),l.jsx("button",{className:e==="users"?"active":"",onClick:()=>r("users"),children:"Users"}),l.jsx("button",{className:e==="designs"?"active":"",onClick:()=>r("designs"),children:"Designs"}),l.jsx("button",{className:e==="colours"?"active":"",onClick:()=>r("colours"),children:"Colour Analytics"})]})]}),l.jsxs("main",{className:"admin-content",children:[e==="overview"&&a&&l.jsx(SU,{stats:a}),e==="generations"&&l.jsx(xU,{}),e==="recovery"&&l.jsx(wU,{}),e==="users"&&l.jsx(kU,{users:u}),e==="designs"&&l.jsx(jU,{designs:h,total:p}),e==="colours"&&m&&l.jsx(CU,{analytics:m})]}),l.jsx("style",{jsx:!0,children:`
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
      `})]})}function SU({stats:t}){return l.jsxs("div",{className:"overview-panel",children:[l.jsx("h2",{children:"Dashboard Overview"}),l.jsxs("div",{className:"stats-grid",children:[l.jsxs("div",{className:"stat-card",children:[l.jsx("div",{className:"stat-value",children:t.totals.users}),l.jsx("div",{className:"stat-label",children:"Total Users"})]}),l.jsxs("div",{className:"stat-card",children:[l.jsx("div",{className:"stat-value",children:t.totals.designs}),l.jsx("div",{className:"stat-label",children:"Total Designs"})]}),l.jsxs("div",{className:"stat-card",children:[l.jsx("div",{className:"stat-value",children:t.totals.projects}),l.jsx("div",{className:"stat-label",children:"Total Projects"})]}),l.jsxs("div",{className:"stat-card",children:[l.jsx("div",{className:"stat-value",children:t.totals.jobs}),l.jsx("div",{className:"stat-label",children:"AI Jobs Run"})]})]}),l.jsxs("div",{className:"stats-grid",children:[l.jsxs("div",{className:"stat-card highlight",children:[l.jsx("div",{className:"stat-value",children:t.activity.active_users_30d}),l.jsx("div",{className:"stat-label",children:"Active Users (30d)"})]}),l.jsxs("div",{className:"stat-card highlight",children:[l.jsx("div",{className:"stat-value",children:t.activity.designs_7d}),l.jsx("div",{className:"stat-label",children:"Designs This Week"})]}),l.jsxs("div",{className:"stat-card highlight",children:[l.jsx("div",{className:"stat-value",children:t.activity.designs_30d}),l.jsx("div",{className:"stat-label",children:"Designs This Month"})]}),l.jsxs("div",{className:"stat-card highlight",children:[l.jsxs("div",{className:"stat-value",children:[t.activity.job_success_rate,"%"]}),l.jsx("div",{className:"stat-label",children:"Job Success Rate"})]})]}),l.jsx("h3",{children:"Activity Timeline (14 Days)"}),l.jsx("div",{className:"activity-chart",children:t.timeline.map((e,r)=>l.jsxs("div",{className:"bar-container",children:[l.jsx("div",{className:"bar",style:{height:`${Math.max(4,e.count*20)}px`},title:`${e.date}: ${e.count} designs`}),l.jsx("div",{className:"bar-label",children:e.date.split("-")[2]})]},r))}),l.jsxs("div",{className:"breakdowns",children:[l.jsxs("div",{className:"breakdown-card",children:[l.jsx("h4",{children:"Input Mode"}),l.jsxs("div",{className:"breakdown-items",children:[l.jsxs("div",{className:"breakdown-item",children:[l.jsx("span",{children:"Prompt"}),l.jsx("strong",{children:t.breakdowns.input_mode.prompt})]}),l.jsxs("div",{className:"breakdown-item",children:[l.jsx("span",{children:"Image Upload"}),l.jsx("strong",{children:t.breakdowns.input_mode.image})]}),l.jsxs("div",{className:"breakdown-item",children:[l.jsx("span",{children:"SVG Upload"}),l.jsx("strong",{children:t.breakdowns.input_mode.svg})]})]})]}),l.jsxs("div",{className:"breakdown-card",children:[l.jsx("h4",{children:"View Mode Preference"}),l.jsxs("div",{className:"breakdown-items",children:[l.jsxs("div",{className:"breakdown-item",children:[l.jsx("span",{children:"Solid TPV"}),l.jsx("strong",{children:t.breakdowns.view_mode.solid})]}),l.jsxs("div",{className:"breakdown-item",children:[l.jsx("span",{children:"Blend TPV"}),l.jsx("strong",{children:t.breakdowns.view_mode.blend})]})]})]})]}),l.jsx("style",{jsx:!0,children:`
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
      `})]})}function kU({users:t}){return l.jsxs("div",{className:"users-panel",children:[l.jsxs("h2",{children:["User Management (",t.length," users)"]}),l.jsxs("table",{className:"users-table",children:[l.jsx("thead",{children:l.jsxs("tr",{children:[l.jsx("th",{children:"Email"}),l.jsx("th",{children:"Role"}),l.jsx("th",{children:"Designs"}),l.jsx("th",{children:"Projects"}),l.jsx("th",{children:"Jobs"}),l.jsx("th",{children:"Last Design"}),l.jsx("th",{children:"Joined"})]})}),l.jsx("tbody",{children:t.map(e=>l.jsxs("tr",{children:[l.jsx("td",{children:e.email}),l.jsx("td",{children:l.jsx("span",{className:`role-badge ${e.role}`,children:e.role})}),l.jsx("td",{children:e.design_count}),l.jsx("td",{children:e.project_count}),l.jsx("td",{children:e.job_count}),l.jsx("td",{children:e.last_design_at?new Date(e.last_design_at).toLocaleDateString():"-"}),l.jsx("td",{children:new Date(e.created_at).toLocaleDateString()})]},e.id))})]}),l.jsx("style",{jsx:!0,children:`
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
      `})]})}function jU({designs:t,total:e}){return l.jsxs("div",{className:"designs-panel",children:[l.jsxs("h2",{children:["All Designs (",e," total)"]}),l.jsx("div",{className:"designs-grid",children:t.map(r=>l.jsxs("div",{className:"design-card",children:[l.jsx("div",{className:"design-thumbnail",children:r.thumbnail_url||r.original_png_url?l.jsx("img",{src:r.thumbnail_url||r.original_png_url,alt:r.name}):l.jsx("div",{className:"no-image",children:"No preview"})}),l.jsxs("div",{className:"design-info",children:[l.jsx("h4",{children:r.name}),l.jsx("p",{className:"design-user",children:r.user_email}),l.jsx("p",{className:"design-date",children:new Date(r.created_at).toLocaleDateString()}),r.project&&l.jsx("span",{className:"project-badge",style:{backgroundColor:r.project.color||"#64748b"},children:r.project.name})]})]},r.id))}),l.jsx("style",{jsx:!0,children:`
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
      `})]})}function CU({analytics:t}){return l.jsxs("div",{className:"colours-panel",children:[l.jsx("h2",{children:"Colour Usage Analytics"}),l.jsxs("div",{className:"colour-stats",children:[l.jsxs("div",{className:"stat-card",children:[l.jsx("div",{className:"stat-value",children:t.totals.designs_analysed}),l.jsx("div",{className:"stat-label",children:"Designs Analysed"})]}),l.jsxs("div",{className:"stat-card",children:[l.jsx("div",{className:"stat-value",children:t.totals.colour_usages}),l.jsx("div",{className:"stat-label",children:"Total Colour Uses"})]})]}),l.jsx("h3",{children:"Top 10 TPV Colours"}),l.jsx("div",{className:"colour-list",children:t.top_colours.map((e,r)=>l.jsxs("div",{className:"colour-item",children:[l.jsxs("span",{className:"colour-rank",children:["#",r+1]}),l.jsx("div",{className:"colour-swatch",style:{backgroundColor:e.hex}}),l.jsxs("div",{className:"colour-info",children:[l.jsx("strong",{children:e.code}),l.jsx("span",{children:e.name})]}),l.jsxs("div",{className:"colour-count",children:[e.count," uses"]})]},e.code))}),l.jsx("h3",{children:"Colour Family Breakdown"}),l.jsx("div",{className:"family-bars",children:Object.entries(t.families).map(([e,r])=>l.jsxs("div",{className:"family-bar",children:[l.jsx("span",{className:"family-name",children:e}),l.jsx("div",{className:"bar-bg",children:l.jsx("div",{className:"bar-fill",style:{width:`${r/t.totals.colour_usages*100}%`,backgroundColor:EU(e)}})}),l.jsx("span",{className:"family-count",children:r})]},e))}),t.top_blends.length>0&&l.jsxs(l.Fragment,{children:[l.jsx("h3",{children:"Top Blend Combinations"}),l.jsx("div",{className:"blend-list",children:t.top_blends.map((e,r)=>l.jsxs("div",{className:"blend-item",children:[l.jsx("div",{className:"blend-swatches",children:e.components.map((n,i)=>l.jsx("div",{className:"blend-swatch",style:{backgroundColor:n.hex},title:`${n.code} - ${n.name}`},i))}),l.jsx("div",{className:"blend-codes",children:e.components.map(n=>n.code).join(" + ")}),l.jsxs("div",{className:"blend-count",children:[e.count," uses"]})]},r))})]}),l.jsx("style",{jsx:!0,children:`
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
      `})]})}function EU(t){return{reds:"#dc2626",greens:"#16a34a",blues:"#2563eb",yellows:"#ca8a04",neutrals:"#6b7280"}[t]||"#6b7280"}const Cd=[{code:"RH30",name:"Beige",hex:"#E4C4AA"},{code:"RH31",name:"Cream",hex:"#E8E3D8"},{code:"RH41",name:"Bright Yellow",hex:"#FFD833"},{code:"RH40",name:"Mustard",hex:"#E5A144"},{code:"RH50",name:"Orange",hex:"#F15B32"},{code:"RH01",name:"Standard Red",hex:"#A5362F"},{code:"RH02",name:"Bright Red",hex:"#E21F2F"},{code:"RH90",name:"Funky Pink",hex:"#E8457E"},{code:"RH21",name:"Purple",hex:"#493D8C"},{code:"RH20",name:"Standard Blue",hex:"#0075BC"},{code:"RH22",name:"Light Blue",hex:"#47AFE3"},{code:"RH23",name:"Azure",hex:"#039DC4"},{code:"RH26",name:"Turquoise",hex:"#00A6A3"},{code:"RH12",name:"Dark Green",hex:"#006C55"},{code:"RH10",name:"Standard Green",hex:"#609B63"},{code:"RH11",name:"Bright Green",hex:"#3BB44A"},{code:"RH32",name:"Brown",hex:"#8B5F3C"},{code:"RH65",name:"Pale Grey",hex:"#D9D9D6"},{code:"RH61",name:"Light Grey",hex:"#939598"},{code:"RH60",name:"Dark Grey",hex:"#59595B"},{code:"RH70",name:"Black",hex:"#231F20"}],Vv=["ocean theme with dolphins and waves","jungle adventure with parrots","solar system with planets","garden with butterflies and flowers","racing track with cars","underwater coral reef scene","dinosaur footprints trail","rainbow with clouds"],TU=[...Array(60)].map(t=>({delay:`${Math.random()*3}s`,x:`${Math.random()*100}%`,y:`${Math.random()*100}%`,size:`${8+Math.random()*12}px`}));function RU(){const[t,e]=M.useState(""),[r,n]=M.useState(""),[i,o]=M.useState(""),[s,a]=M.useState(!1),[c,u]=M.useState(!1),[d,h]=M.useState(0);M.useEffect(()=>{const g=setInterval(()=>{h(m=>(m+1)%Vv.length)},5e3);return()=>clearInterval(g)},[]);const f=async g=>{g.preventDefault(),o(""),a(!0);try{await vn.signIn(t,r)}catch(m){o(m.message||"Sign in failed")}finally{a(!1)}},p=g=>{var m;(m=document.getElementById(g))==null||m.scrollIntoView({behavior:"smooth"})};return l.jsxs("div",{className:"landing-page",children:[l.jsxs("nav",{className:"landing-nav",children:[l.jsxs("div",{className:"nav-logo",children:[l.jsx("span",{className:"logo-text",children:"TPV"}),l.jsx("span",{className:"logo-accent",children:"Studio"})]}),l.jsxs("div",{className:"nav-links",children:[l.jsx("button",{onClick:()=>p("features"),children:"Features"}),l.jsx("button",{onClick:()=>p("palette"),children:"Colours"}),l.jsx("button",{onClick:()=>u(!0),className:"nav-cta",children:"Sign In"})]})]}),l.jsxs("section",{className:"hero",children:[l.jsx("div",{className:"hero-background",children:l.jsx("div",{className:"granule-field",children:TU.map((g,m)=>l.jsx("div",{className:"granule",style:{"--delay":g.delay,"--x":g.x,"--y":g.y,"--color":Cd[m%Cd.length].hex,"--size":g.size}},m))})}),l.jsxs("div",{className:"hero-content",children:[l.jsx("div",{className:"hero-badge",children:"AI-Powered Design Tool"}),l.jsxs("h1",{children:[l.jsx("span",{className:"hero-line-1",children:"Transform Ideas Into"}),l.jsx("span",{className:"hero-line-2",children:"Playground Surfaces"})]}),l.jsx("p",{className:"hero-subtitle",children:"Describe your vision or upload an image. Get production-ready TPV colour specifications in minutes, not hours."}),l.jsxs("div",{className:"hero-ctas",children:[l.jsxs("button",{onClick:()=>u(!0),className:"cta-primary",children:["Start Designing",l.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:l.jsx("path",{d:"M5 12h14M12 5l7 7-7 7"})})]}),l.jsx("button",{onClick:()=>p("how-it-works"),className:"cta-secondary",children:"See How It Works"})]})]}),l.jsx("div",{className:"hero-visual",children:l.jsx("div",{className:"mockup-container",children:l.jsxs("div",{className:"mockup-screen",children:[l.jsx("div",{className:"mockup-header",children:l.jsxs("div",{className:"mockup-dots",children:[l.jsx("span",{}),l.jsx("span",{}),l.jsx("span",{})]})}),l.jsxs("div",{className:"mockup-content",children:[l.jsx("div",{className:"mockup-input",children:l.jsx("span",{className:"typing-text",children:Vv[d]},d)}),l.jsxs("div",{className:"mockup-preview",children:[l.jsx("div",{className:"preview-shape shape-1"}),l.jsx("div",{className:"preview-shape shape-2"}),l.jsx("div",{className:"preview-shape shape-3"})]})]})]})})})]}),l.jsxs("section",{id:"how-it-works",className:"how-it-works",children:[l.jsxs("div",{className:"section-header",children:[l.jsx("span",{className:"section-tag",children:"Process"}),l.jsx("h2",{children:"Three Steps to Production-Ready Designs"})]}),l.jsxs("div",{className:"steps-container",children:[l.jsxs("div",{className:"step",children:[l.jsx("div",{className:"step-number",children:"01"}),l.jsx("div",{className:"step-icon",children:l.jsx("svg",{width:"32",height:"32",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:l.jsx("path",{d:"M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"})})}),l.jsx("h3",{children:"Describe or Upload"}),l.jsx("p",{children:'Type a description like "tropical jungle with parrots" or upload an existing image or SVG file.'})]}),l.jsx("div",{className:"step-connector",children:l.jsx("svg",{viewBox:"0 0 100 20",preserveAspectRatio:"none",children:l.jsx("path",{d:"M0 10 Q50 10 100 10",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeDasharray:"4 4"})})}),l.jsxs("div",{className:"step",children:[l.jsx("div",{className:"step-number",children:"02"}),l.jsx("div",{className:"step-icon",children:l.jsx("svg",{width:"32",height:"32",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:l.jsx("path",{d:"M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"})})}),l.jsx("h3",{children:"AI Generates Vector"}),l.jsx("p",{children:"Our AI creates a clean vector design optimized for TPV surface production with colour regions."})]}),l.jsx("div",{className:"step-connector",children:l.jsx("svg",{viewBox:"0 0 100 20",preserveAspectRatio:"none",children:l.jsx("path",{d:"M0 10 Q50 10 100 10",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeDasharray:"4 4"})})}),l.jsxs("div",{className:"step",children:[l.jsx("div",{className:"step-number",children:"03"}),l.jsx("div",{className:"step-icon",children:l.jsxs("svg",{width:"32",height:"32",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[l.jsx("path",{d:"M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"}),l.jsx("path",{d:"M14 2v6h6M16 13H8M16 17H8M10 9H8"})]})}),l.jsx("h3",{children:"Get TPV Recipes"}),l.jsx("p",{children:"Receive precise granule blend specifications with component ratios, ready for production."})]})]})]}),l.jsxs("section",{id:"features",className:"features",children:[l.jsxs("div",{className:"section-header",children:[l.jsx("span",{className:"section-tag",children:"Capabilities"}),l.jsx("h2",{children:"Everything You Need to Design TPV Surfaces"})]}),l.jsxs("div",{className:"features-grid",children:[l.jsxs("div",{className:"feature-card feature-highlight",children:[l.jsx("div",{className:"feature-icon",children:l.jsxs("svg",{width:"28",height:"28",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[l.jsx("path",{d:"M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"}),l.jsx("path",{d:"M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"})]})}),l.jsx("h3",{children:"AI Text-to-Vector"}),l.jsx("p",{children:"Describe any concept in natural language. Our AI transforms your words into production-ready vector designs."}),l.jsx("div",{className:"feature-example",children:'"vibrant underwater scene with coral reef"'})]}),l.jsxs("div",{className:"feature-card",children:[l.jsx("div",{className:"feature-icon",children:l.jsxs("svg",{width:"28",height:"28",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[l.jsx("rect",{x:"3",y:"3",width:"18",height:"18",rx:"2",ry:"2"}),l.jsx("circle",{cx:"8.5",cy:"8.5",r:"1.5"}),l.jsx("path",{d:"M21 15l-5-5L5 21"})]})}),l.jsx("h3",{children:"Image Vectorisation"}),l.jsx("p",{children:"Upload any PNG or JPG image and convert it to clean SVG vectors optimised for TPV production."})]}),l.jsxs("div",{className:"feature-card",children:[l.jsx("div",{className:"feature-icon",children:l.jsxs("svg",{width:"28",height:"28",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[l.jsx("circle",{cx:"13.5",cy:"6.5",r:"2.5"}),l.jsx("circle",{cx:"17.5",cy:"10.5",r:"2.5"}),l.jsx("circle",{cx:"8.5",cy:"7.5",r:"2.5"}),l.jsx("circle",{cx:"6.5",cy:"12.5",r:"2.5"}),l.jsx("path",{d:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"})]})}),l.jsx("h3",{children:"Auto Colour Matching"}),l.jsx("p",{children:"Automatic extraction and matching to the 21-colour TPV palette with optimal blend recipes."})]}),l.jsxs("div",{className:"feature-card",children:[l.jsx("div",{className:"feature-icon",children:l.jsxs("svg",{width:"28",height:"28",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[l.jsx("path",{d:"M12 3v18M3 12h18"}),l.jsx("circle",{cx:"12",cy:"12",r:"9"})]})}),l.jsx("h3",{children:"Solid & Blend Modes"}),l.jsx("p",{children:"Choose between single-colour purity or multi-granule blends for precise colour accuracy."})]}),l.jsxs("div",{className:"feature-card",children:[l.jsx("div",{className:"feature-icon",children:l.jsxs("svg",{width:"28",height:"28",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[l.jsx("path",{d:"M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"}),l.jsx("path",{d:"M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"})]})}),l.jsx("h3",{children:"Interactive Editor"}),l.jsx("p",{children:"Click any colour region to customise. Real-time preview updates as you design."})]}),l.jsxs("div",{className:"feature-card",children:[l.jsx("div",{className:"feature-icon",children:l.jsxs("svg",{width:"28",height:"28",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[l.jsx("path",{d:"M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"}),l.jsx("path",{d:"M14 2v6h6M12 18v-6M9 15l3 3 3-3"})]})}),l.jsx("h3",{children:"PDF Specifications"}),l.jsx("p",{children:"Export professional specification sheets with design preview, dimensions, and all recipes."})]}),l.jsxs("div",{className:"feature-card",children:[l.jsx("div",{className:"feature-icon",children:l.jsxs("svg",{width:"28",height:"28",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[l.jsx("rect",{x:"3",y:"3",width:"18",height:"18",rx:"2",ry:"2"}),l.jsx("circle",{cx:"8.5",cy:"8.5",r:"1.5"}),l.jsx("path",{d:"M21 15l-5-5L5 21"})]})}),l.jsx("h3",{children:"In-Situ Preview"}),l.jsx("p",{children:"Upload a site photo and see your design in context. Adjust perspective and lighting to visualise the finished installation."})]}),l.jsxs("div",{className:"feature-card",children:[l.jsx("div",{className:"feature-icon",children:l.jsxs("svg",{width:"28",height:"28",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[l.jsx("rect",{x:"3",y:"3",width:"7",height:"7"}),l.jsx("rect",{x:"14",y:"3",width:"7",height:"7"}),l.jsx("rect",{x:"3",y:"14",width:"7",height:"7"}),l.jsx("rect",{x:"14",y:"14",width:"7",height:"7"})]})}),l.jsx("h3",{children:"Installation Tiles"}),l.jsx("p",{children:"Download your design as 1m×1m tiles in a ZIP file. Named like a chessboard (A1, B2...) for easy on-site layout."})]})]})]}),l.jsxs("section",{id:"palette",className:"palette-section",children:[l.jsxs("div",{className:"section-header light",children:[l.jsx("span",{className:"section-tag",children:"Palette"}),l.jsx("h2",{children:"21 Standard TPV Colours"}),l.jsx("p",{className:"section-subtitle",children:"The complete Rosehill TPV granule palette at your fingertips"})]}),l.jsx("div",{className:"palette-grid",children:Cd.map((g,m)=>l.jsxs("div",{className:"palette-swatch",style:{"--swatch-color":g.hex,"--delay":`${m*.03}s`},children:[l.jsx("div",{className:"swatch-color"}),l.jsxs("div",{className:"swatch-info",children:[l.jsx("span",{className:"swatch-name",children:g.name}),l.jsx("span",{className:"swatch-code",children:g.code})]})]},g.code))})]}),l.jsx("section",{className:"benefits",children:l.jsxs("div",{className:"benefits-grid",children:[l.jsxs("div",{className:"benefit",children:[l.jsx("div",{className:"benefit-metric",children:"10x"}),l.jsx("div",{className:"benefit-label",children:"Faster Design Process"}),l.jsx("p",{children:"What took hours of manual colour matching now takes minutes with AI automation."})]}),l.jsxs("div",{className:"benefit",children:[l.jsx("div",{className:"benefit-metric",children:"100%"}),l.jsx("div",{className:"benefit-label",children:"Production Accurate"}),l.jsx("p",{children:"Recipes use exact TPV granule components with precise ratio specifications."})]}),l.jsxs("div",{className:"benefit",children:[l.jsx("div",{className:"benefit-metric",children:"21"}),l.jsx("div",{className:"benefit-label",children:"Standard Colours"}),l.jsx("p",{children:"Full access to the complete Rosehill TPV palette with blend combinations."})]})]})}),l.jsx("section",{className:"cta-footer",children:l.jsxs("div",{className:"cta-content",children:[l.jsx("h2",{children:"Ready to Transform Your Workflow?"}),l.jsx("p",{children:"Start designing playground surfaces with AI-powered precision."}),l.jsxs("button",{onClick:()=>u(!0),className:"cta-primary large",children:["Sign In to TPV Studio",l.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:l.jsx("path",{d:"M5 12h14M12 5l7 7-7 7"})})]}),l.jsxs("p",{className:"cta-note",children:["Need an account? Contact ",l.jsx("a",{href:"mailto:info@rosehill.group",children:"info@rosehill.group"})]})]})}),c&&l.jsx("div",{className:"modal-overlay",onClick:()=>u(!1),children:l.jsxs("div",{className:"sign-in-modal",onClick:g=>g.stopPropagation(),children:[l.jsx("button",{className:"modal-close",onClick:()=>u(!1),children:l.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:l.jsx("path",{d:"M18 6L6 18M6 6l12 12"})})}),l.jsxs("div",{className:"modal-header",children:[l.jsx("h2",{children:"Sign In"}),l.jsx("p",{children:"Access your TPV Studio account"})]}),i&&l.jsx("div",{className:"form-error",children:i}),l.jsxs("form",{onSubmit:f,children:[l.jsxs("div",{className:"form-group",children:[l.jsx("label",{children:"Email"}),l.jsx("input",{type:"email",value:t,onChange:g=>e(g.target.value),placeholder:"your.email@company.com",required:!0})]}),l.jsxs("div",{className:"form-group",children:[l.jsx("label",{children:"Password"}),l.jsx("input",{type:"password",value:r,onChange:g=>n(g.target.value),required:!0})]}),l.jsx("button",{type:"submit",disabled:s,className:"submit-btn",children:s?"Signing in...":"Sign In"})]}),l.jsx("p",{className:"modal-footer-text",children:"Don't have an account? Contact your administrator."})]})}),l.jsx("style",{jsx:!0,children:`
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
      `})]})}function NU({user:t,onPasswordSet:e}){const[r,n]=M.useState(""),[i,o]=M.useState(""),[s,a]=M.useState(!1),[c,u]=M.useState(""),d=async h=>{if(h.preventDefault(),u(""),r.length<8){u("Password must be at least 8 characters long");return}if(r!==i){u("Passwords do not match");return}a(!0);try{await vn.updatePassword(r),console.log("[SET-PASSWORD] Password set successfully"),e()}catch(f){console.error("[SET-PASSWORD] Failed to set password:",f),u(f.message||"Failed to set password. Please try again.")}finally{a(!1)}};return l.jsx("div",{className:"tpv-studio",children:l.jsx("div",{className:"tpv-studio__container",style:{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh"},children:l.jsxs("div",{style:{maxWidth:"400px",width:"100%",padding:"2rem",background:"#fff",borderRadius:"8px",boxShadow:"0 2px 8px rgba(0,0,0,0.1)"},children:[l.jsx("h2",{style:{marginBottom:"0.5rem",fontSize:"1.5rem"},children:"Welcome to TPV Studio"}),l.jsxs("p",{style:{marginBottom:"1.5rem",color:"#666",fontSize:"0.9rem"},children:["Please set a password for your account: ",l.jsx("strong",{children:t.email})]}),l.jsxs("form",{onSubmit:d,children:[l.jsxs("div",{style:{marginBottom:"1rem"},children:[l.jsx("label",{style:{display:"block",marginBottom:"0.5rem",fontSize:"0.9rem",fontWeight:"500"},children:"New Password"}),l.jsx("input",{type:"password",value:r,onChange:h=>n(h.target.value),placeholder:"Enter your password",required:!0,minLength:8,style:{width:"100%",padding:"0.75rem",border:"1px solid #ddd",borderRadius:"4px",fontSize:"1rem"}}),l.jsx("small",{style:{display:"block",marginTop:"0.25rem",color:"#666"},children:"At least 8 characters"})]}),l.jsxs("div",{style:{marginBottom:"1.5rem"},children:[l.jsx("label",{style:{display:"block",marginBottom:"0.5rem",fontSize:"0.9rem",fontWeight:"500"},children:"Confirm Password"}),l.jsx("input",{type:"password",value:i,onChange:h=>o(h.target.value),placeholder:"Confirm your password",required:!0,minLength:8,style:{width:"100%",padding:"0.75rem",border:"1px solid #ddd",borderRadius:"4px",fontSize:"1rem"}})]}),c&&l.jsx("div",{style:{padding:"0.75rem",marginBottom:"1rem",background:"#fee",border:"1px solid #fcc",borderRadius:"4px",color:"#c00",fontSize:"0.9rem"},children:c}),l.jsx("button",{type:"submit",disabled:s,style:{width:"100%",padding:"0.75rem",background:s?"#ccc":"#007bff",color:"#fff",border:"none",borderRadius:"4px",fontSize:"1rem",fontWeight:"500",cursor:s?"not-allowed":"pointer"},children:s?"Setting Password...":"Set Password"})]})]})})})}function PU(){const[t,e]=M.useState(null),[r,n]=M.useState(!0),[i,o]=M.useState(!1),[s,a]=M.useState(!1),[c,u]=M.useState(!1),[d,h]=M.useState(null),[f,p]=M.useState(null),[g,m]=M.useState(!1),[b,v]=M.useState(null),y=async()=>{try{const _=await vn.getSession();if(console.log("[APP] Session object:",_),console.log("[APP] Access token:",_==null?void 0:_.access_token),!(_!=null&&_.access_token)){console.warn("[APP] No access token found in session"),u(!1);return}const C=await fetch("/api/admin/users",{headers:{Authorization:`Bearer ${_.access_token}`}});console.log("[APP] Admin check response:",C.status,C.ok),u(C.ok)}catch(_){console.error("[APP] Admin check failed:",_),u(!1)}};M.useEffect(()=>{vn.getSession().then(C=>{var T;const R=(C==null?void 0:C.user)||null;if(e(R),n(!1),R){const P=(T=R.user_metadata)==null?void 0:T.password_setup_complete;m(!P),y()}});const{data:_}=vn.onAuthStateChange((C,R)=>{var P;const T=(R==null?void 0:R.user)||null;if(e(T),T){const H=(P=T.user_metadata)==null?void 0:P.password_setup_complete;m(!H),y()}else u(!1),m(!1)});return()=>_==null?void 0:_.unsubscribe()},[]);const x=_=>{console.log("[APP] Loading design:",_),console.log("[APP] Design original_svg_url:",_.original_svg_url),console.log("[APP] Design ID:",_.id),h(_),p(_.name),console.log("[INSPIRE] Loaded design:",_.name)},S=_=>{p(_)},j=async()=>{console.log("[APP] Password set successfully"),m(!1);const _=await vn.getSession();e((_==null?void 0:_.user)||null)};return r?l.jsx("div",{className:"tpv-studio",children:l.jsx("div",{className:"tpv-studio__container",children:l.jsxs("div",{className:"tpv-studio__empty",children:[l.jsx("div",{className:"tpv-studio__spinner"}),l.jsx("p",{children:"Loading..."})]})})}):t?g?l.jsx(NU,{user:t,onPasswordSet:j}):s?l.jsx("div",{className:"tpv-studio",children:l.jsx(_U,{onClose:()=>a(!1)})}):b?b==="sports"?l.jsx(Dg,{children:l.jsxs("div",{className:"tpv-studio",children:[l.jsx(Wv,{onShowDesigns:()=>o(!0),onShowAdmin:()=>a(!0),isAdmin:c,currentDesignName:"Sports Surface",onBackToTools:()=>v(null)}),l.jsx("main",{className:"tpv-studio__container",children:l.jsx(vU,{})}),i&&l.jsx(Gv,{onClose:()=>o(!1),onLoadDesign:x})]})}):l.jsx(Dg,{children:l.jsxs("div",{className:"tpv-studio",children:[l.jsx(Wv,{onShowDesigns:()=>o(!0),onShowAdmin:()=>a(!0),isAdmin:c,currentDesignName:f,onBackToTools:()=>v(null)}),l.jsx("main",{className:"tpv-studio__container",children:l.jsx(CB,{loadedDesign:d,onDesignSaved:S})}),i&&l.jsx(Gv,{onClose:()=>o(!1),onLoadDesign:x})]})}):l.jsx("div",{className:"tpv-studio",children:l.jsx(yU,{onSelectTool:v})}):l.jsx(RU,{})}Ed.createRoot(document.getElementById("root")).render(l.jsx($.StrictMode,{children:l.jsx(PU,{})}))});export default OU();
//# sourceMappingURL=index-DwQcXUkC.js.map
