var Hw=Object.defineProperty;var Gw=(t,e,r)=>e in t?Hw(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r;var Vw=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports);var gf=(t,e,r)=>Gw(t,typeof e!="symbol"?e+"":e,r);var sL=Vw((Vt,Wt)=>{function Ww(t,e){for(var r=0;r<e.length;r++){const n=e[r];if(typeof n!="string"&&!Array.isArray(n)){for(const i in n)if(i!=="default"&&!(i in t)){const a=Object.getOwnPropertyDescriptor(n,i);a&&Object.defineProperty(t,i,a.get?a:{enumerable:!0,get:()=>n[i]})}}}return Object.freeze(Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}))}(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function r(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(i){if(i.ep)return;i.ep=!0;const a=r(i);fetch(i.href,a)}})();var tn=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function ad(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}function Kw(t){if(t.__esModule)return t;var e=t.default;if(typeof e=="function"){var r=function n(){return this instanceof n?Reflect.construct(e,arguments,this.constructor):e.apply(this,arguments)};r.prototype=e.prototype}else r={};return Object.defineProperty(r,"__esModule",{value:!0}),Object.keys(t).forEach(function(n){var i=Object.getOwnPropertyDescriptor(t,n);Object.defineProperty(r,n,i.get?i:{enumerable:!0,get:function(){return t[n]}})}),r}var Gm={exports:{}},ul={},Vm={exports:{}},De={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var bs=Symbol.for("react.element"),qw=Symbol.for("react.portal"),Yw=Symbol.for("react.fragment"),Jw=Symbol.for("react.strict_mode"),Xw=Symbol.for("react.profiler"),Zw=Symbol.for("react.provider"),Qw=Symbol.for("react.context"),ex=Symbol.for("react.forward_ref"),tx=Symbol.for("react.suspense"),rx=Symbol.for("react.memo"),nx=Symbol.for("react.lazy"),mf=Symbol.iterator;function ix(t){return t===null||typeof t!="object"?null:(t=mf&&t[mf]||t["@@iterator"],typeof t=="function"?t:null)}var Wm={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},Km=Object.assign,qm={};function Qi(t,e,r){this.props=t,this.context=e,this.refs=qm,this.updater=r||Wm}Qi.prototype.isReactComponent={};Qi.prototype.setState=function(t,e){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,e,"setState")};Qi.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function Ym(){}Ym.prototype=Qi.prototype;function sd(t,e,r){this.props=t,this.context=e,this.refs=qm,this.updater=r||Wm}var od=sd.prototype=new Ym;od.constructor=sd;Km(od,Qi.prototype);od.isPureReactComponent=!0;var vf=Array.isArray,Jm=Object.prototype.hasOwnProperty,ld={current:null},Xm={key:!0,ref:!0,__self:!0,__source:!0};function Zm(t,e,r){var n,i={},a=null,s=null;if(e!=null)for(n in e.ref!==void 0&&(s=e.ref),e.key!==void 0&&(a=""+e.key),e)Jm.call(e,n)&&!Xm.hasOwnProperty(n)&&(i[n]=e[n]);var o=arguments.length-2;if(o===1)i.children=r;else if(1<o){for(var l=Array(o),c=0;c<o;c++)l[c]=arguments[c+2];i.children=l}if(t&&t.defaultProps)for(n in o=t.defaultProps,o)i[n]===void 0&&(i[n]=o[n]);return{$$typeof:bs,type:t,key:a,ref:s,props:i,_owner:ld.current}}function ax(t,e){return{$$typeof:bs,type:t.type,key:e,ref:t.ref,props:t.props,_owner:t._owner}}function cd(t){return typeof t=="object"&&t!==null&&t.$$typeof===bs}function sx(t){var e={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(r){return e[r]})}var yf=/\/+/g;function ql(t,e){return typeof t=="object"&&t!==null&&t.key!=null?sx(""+t.key):e.toString(36)}function ho(t,e,r,n,i){var a=typeof t;(a==="undefined"||a==="boolean")&&(t=null);var s=!1;if(t===null)s=!0;else switch(a){case"string":case"number":s=!0;break;case"object":switch(t.$$typeof){case bs:case qw:s=!0}}if(s)return s=t,i=i(s),t=n===""?"."+ql(s,0):n,vf(i)?(r="",t!=null&&(r=t.replace(yf,"$&/")+"/"),ho(i,e,r,"",function(c){return c})):i!=null&&(cd(i)&&(i=ax(i,r+(!i.key||s&&s.key===i.key?"":(""+i.key).replace(yf,"$&/")+"/")+t)),e.push(i)),1;if(s=0,n=n===""?".":n+":",vf(t))for(var o=0;o<t.length;o++){a=t[o];var l=n+ql(a,o);s+=ho(a,e,r,l,i)}else if(l=ix(t),typeof l=="function")for(t=l.call(t),o=0;!(a=t.next()).done;)a=a.value,l=n+ql(a,o++),s+=ho(a,e,r,l,i);else if(a==="object")throw e=String(t),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return s}function As(t,e,r){if(t==null)return t;var n=[],i=0;return ho(t,n,"","",function(a){return e.call(r,a,i++)}),n}function ox(t){if(t._status===-1){var e=t._result;e=e(),e.then(function(r){(t._status===0||t._status===-1)&&(t._status=1,t._result=r)},function(r){(t._status===0||t._status===-1)&&(t._status=2,t._result=r)}),t._status===-1&&(t._status=0,t._result=e)}if(t._status===1)return t._result.default;throw t._result}var Ot={current:null},fo={transition:null},lx={ReactCurrentDispatcher:Ot,ReactCurrentBatchConfig:fo,ReactCurrentOwner:ld};function Qm(){throw Error("act(...) is not supported in production builds of React.")}De.Children={map:As,forEach:function(t,e,r){As(t,function(){e.apply(this,arguments)},r)},count:function(t){var e=0;return As(t,function(){e++}),e},toArray:function(t){return As(t,function(e){return e})||[]},only:function(t){if(!cd(t))throw Error("React.Children.only expected to receive a single React element child.");return t}};De.Component=Qi;De.Fragment=Yw;De.Profiler=Xw;De.PureComponent=sd;De.StrictMode=Jw;De.Suspense=tx;De.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=lx;De.act=Qm;De.cloneElement=function(t,e,r){if(t==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+t+".");var n=Km({},t.props),i=t.key,a=t.ref,s=t._owner;if(e!=null){if(e.ref!==void 0&&(a=e.ref,s=ld.current),e.key!==void 0&&(i=""+e.key),t.type&&t.type.defaultProps)var o=t.type.defaultProps;for(l in e)Jm.call(e,l)&&!Xm.hasOwnProperty(l)&&(n[l]=e[l]===void 0&&o!==void 0?o[l]:e[l])}var l=arguments.length-2;if(l===1)n.children=r;else if(1<l){o=Array(l);for(var c=0;c<l;c++)o[c]=arguments[c+2];n.children=o}return{$$typeof:bs,type:t.type,key:i,ref:a,props:n,_owner:s}};De.createContext=function(t){return t={$$typeof:Qw,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},t.Provider={$$typeof:Zw,_context:t},t.Consumer=t};De.createElement=Zm;De.createFactory=function(t){var e=Zm.bind(null,t);return e.type=t,e};De.createRef=function(){return{current:null}};De.forwardRef=function(t){return{$$typeof:ex,render:t}};De.isValidElement=cd;De.lazy=function(t){return{$$typeof:nx,_payload:{_status:-1,_result:t},_init:ox}};De.memo=function(t,e){return{$$typeof:rx,type:t,compare:e===void 0?null:e}};De.startTransition=function(t){var e=fo.transition;fo.transition={};try{t()}finally{fo.transition=e}};De.unstable_act=Qm;De.useCallback=function(t,e){return Ot.current.useCallback(t,e)};De.useContext=function(t){return Ot.current.useContext(t)};De.useDebugValue=function(){};De.useDeferredValue=function(t){return Ot.current.useDeferredValue(t)};De.useEffect=function(t,e){return Ot.current.useEffect(t,e)};De.useId=function(){return Ot.current.useId()};De.useImperativeHandle=function(t,e,r){return Ot.current.useImperativeHandle(t,e,r)};De.useInsertionEffect=function(t,e){return Ot.current.useInsertionEffect(t,e)};De.useLayoutEffect=function(t,e){return Ot.current.useLayoutEffect(t,e)};De.useMemo=function(t,e){return Ot.current.useMemo(t,e)};De.useReducer=function(t,e,r){return Ot.current.useReducer(t,e,r)};De.useRef=function(t){return Ot.current.useRef(t)};De.useState=function(t){return Ot.current.useState(t)};De.useSyncExternalStore=function(t,e,r){return Ot.current.useSyncExternalStore(t,e,r)};De.useTransition=function(){return Ot.current.useTransition()};De.version="18.3.1";Vm.exports=De;var z=Vm.exports;const T=ad(z);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var cx=z,ux=Symbol.for("react.element"),dx=Symbol.for("react.fragment"),hx=Object.prototype.hasOwnProperty,fx=cx.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,px={key:!0,ref:!0,__self:!0,__source:!0};function e0(t,e,r){var n,i={},a=null,s=null;r!==void 0&&(a=""+r),e.key!==void 0&&(a=""+e.key),e.ref!==void 0&&(s=e.ref);for(n in e)hx.call(e,n)&&!px.hasOwnProperty(n)&&(i[n]=e[n]);if(t&&t.defaultProps)for(n in e=t.defaultProps,e)i[n]===void 0&&(i[n]=e[n]);return{$$typeof:ux,type:t,key:a,ref:s,props:i,_owner:fx.current}}ul.Fragment=dx;ul.jsx=e0;ul.jsxs=e0;Gm.exports=ul;var u=Gm.exports,Bc={},t0={exports:{}},Jt={},r0={exports:{}},n0={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(t){function e(U,R){var G=U.length;U.push(R);e:for(;0<G;){var A=G-1>>>1,I=U[A];if(0<i(I,R))U[A]=R,U[G]=I,G=A;else break e}}function r(U){return U.length===0?null:U[0]}function n(U){if(U.length===0)return null;var R=U[0],G=U.pop();if(G!==R){U[0]=G;e:for(var A=0,I=U.length,ae=I>>>1;A<ae;){var te=2*(A+1)-1,ee=U[te],he=te+1,$e=U[he];if(0>i(ee,G))he<I&&0>i($e,ee)?(U[A]=$e,U[he]=G,A=he):(U[A]=ee,U[te]=G,A=te);else if(he<I&&0>i($e,G))U[A]=$e,U[he]=G,A=he;else break e}}return R}function i(U,R){var G=U.sortIndex-R.sortIndex;return G!==0?G:U.id-R.id}if(typeof performance=="object"&&typeof performance.now=="function"){var a=performance;t.unstable_now=function(){return a.now()}}else{var s=Date,o=s.now();t.unstable_now=function(){return s.now()-o}}var l=[],c=[],d=1,h=null,f=3,p=!1,y=!1,m=!1,b=typeof setTimeout=="function"?setTimeout:null,v=typeof clearTimeout=="function"?clearTimeout:null,g=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function w(U){for(var R=r(c);R!==null;){if(R.callback===null)n(c);else if(R.startTime<=U)n(c),R.sortIndex=R.expirationTime,e(l,R);else break;R=r(c)}}function S(U){if(m=!1,w(U),!y)if(r(l)!==null)y=!0,ue(E);else{var R=r(c);R!==null&&X(S,R.startTime-U)}}function E(U,R){y=!1,m&&(m=!1,v(N),N=-1),p=!0;var G=f;try{for(w(R),h=r(l);h!==null&&(!(h.expirationTime>R)||U&&!q());){var A=h.callback;if(typeof A=="function"){h.callback=null,f=h.priorityLevel;var I=A(h.expirationTime<=R);R=t.unstable_now(),typeof I=="function"?h.callback=I:h===r(l)&&n(l),w(R)}else n(l);h=r(l)}if(h!==null)var ae=!0;else{var te=r(c);te!==null&&X(S,te.startTime-R),ae=!1}return ae}finally{h=null,f=G,p=!1}}var k=!1,C=null,N=-1,$=5,B=-1;function q(){return!(t.unstable_now()-B<$)}function P(){if(C!==null){var U=t.unstable_now();B=U;var R=!0;try{R=C(!0,U)}finally{R?L():(k=!1,C=null)}}else k=!1}var L;if(typeof g=="function")L=function(){g(P)};else if(typeof MessageChannel<"u"){var _=new MessageChannel,W=_.port2;_.port1.onmessage=P,L=function(){W.postMessage(null)}}else L=function(){b(P,0)};function ue(U){C=U,k||(k=!0,L())}function X(U,R){N=b(function(){U(t.unstable_now())},R)}t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(U){U.callback=null},t.unstable_continueExecution=function(){y||p||(y=!0,ue(E))},t.unstable_forceFrameRate=function(U){0>U||125<U?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):$=0<U?Math.floor(1e3/U):5},t.unstable_getCurrentPriorityLevel=function(){return f},t.unstable_getFirstCallbackNode=function(){return r(l)},t.unstable_next=function(U){switch(f){case 1:case 2:case 3:var R=3;break;default:R=f}var G=f;f=R;try{return U()}finally{f=G}},t.unstable_pauseExecution=function(){},t.unstable_requestPaint=function(){},t.unstable_runWithPriority=function(U,R){switch(U){case 1:case 2:case 3:case 4:case 5:break;default:U=3}var G=f;f=U;try{return R()}finally{f=G}},t.unstable_scheduleCallback=function(U,R,G){var A=t.unstable_now();switch(typeof G=="object"&&G!==null?(G=G.delay,G=typeof G=="number"&&0<G?A+G:A):G=A,U){case 1:var I=-1;break;case 2:I=250;break;case 5:I=1073741823;break;case 4:I=1e4;break;default:I=5e3}return I=G+I,U={id:d++,callback:R,priorityLevel:U,startTime:G,expirationTime:I,sortIndex:-1},G>A?(U.sortIndex=G,e(c,U),r(l)===null&&U===r(c)&&(m?(v(N),N=-1):m=!0,X(S,G-A))):(U.sortIndex=I,e(l,U),y||p||(y=!0,ue(E))),U},t.unstable_shouldYield=q,t.unstable_wrapCallback=function(U){var R=f;return function(){var G=f;f=R;try{return U.apply(this,arguments)}finally{f=G}}}})(n0);r0.exports=n0;var gx=r0.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var mx=z,qt=gx;function re(t){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+t,r=1;r<arguments.length;r++)e+="&args[]="+encodeURIComponent(arguments[r]);return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var i0=new Set,Xa={};function Hn(t,e){Gi(t,e),Gi(t+"Capture",e)}function Gi(t,e){for(Xa[t]=e,t=0;t<e.length;t++)i0.add(e[t])}var Mr=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Uc=Object.prototype.hasOwnProperty,vx=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,bf={},wf={};function yx(t){return Uc.call(wf,t)?!0:Uc.call(bf,t)?!1:vx.test(t)?wf[t]=!0:(bf[t]=!0,!1)}function bx(t,e,r,n){if(r!==null&&r.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return n?!1:r!==null?!r.acceptsBooleans:(t=t.toLowerCase().slice(0,5),t!=="data-"&&t!=="aria-");default:return!1}}function wx(t,e,r,n){if(e===null||typeof e>"u"||bx(t,e,r,n))return!0;if(n)return!1;if(r!==null)switch(r.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function Pt(t,e,r,n,i,a,s){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=n,this.attributeNamespace=i,this.mustUseProperty=r,this.propertyName=t,this.type=e,this.sanitizeURL=a,this.removeEmptyString=s}var wt={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t){wt[t]=new Pt(t,0,!1,t,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(t){var e=t[0];wt[e]=new Pt(e,1,!1,t[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(t){wt[t]=new Pt(t,2,!1,t.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(t){wt[t]=new Pt(t,2,!1,t,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t){wt[t]=new Pt(t,3,!1,t.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(t){wt[t]=new Pt(t,3,!0,t,null,!1,!1)});["capture","download"].forEach(function(t){wt[t]=new Pt(t,4,!1,t,null,!1,!1)});["cols","rows","size","span"].forEach(function(t){wt[t]=new Pt(t,6,!1,t,null,!1,!1)});["rowSpan","start"].forEach(function(t){wt[t]=new Pt(t,5,!1,t.toLowerCase(),null,!1,!1)});var ud=/[\-:]([a-z])/g;function dd(t){return t[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t){var e=t.replace(ud,dd);wt[e]=new Pt(e,1,!1,t,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t){var e=t.replace(ud,dd);wt[e]=new Pt(e,1,!1,t,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(t){var e=t.replace(ud,dd);wt[e]=new Pt(e,1,!1,t,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(t){wt[t]=new Pt(t,1,!1,t.toLowerCase(),null,!1,!1)});wt.xlinkHref=new Pt("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(t){wt[t]=new Pt(t,1,!1,t.toLowerCase(),null,!0,!0)});function hd(t,e,r,n){var i=wt.hasOwnProperty(e)?wt[e]:null;(i!==null?i.type!==0:n||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(wx(e,r,i,n)&&(r=null),n||i===null?yx(e)&&(r===null?t.removeAttribute(e):t.setAttribute(e,""+r)):i.mustUseProperty?t[i.propertyName]=r===null?i.type===3?!1:"":r:(e=i.attributeName,n=i.attributeNamespace,r===null?t.removeAttribute(e):(i=i.type,r=i===3||i===4&&r===!0?"":""+r,n?t.setAttributeNS(n,e,r):t.setAttribute(e,r))))}var Br=mx.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Is=Symbol.for("react.element"),Ei=Symbol.for("react.portal"),ji=Symbol.for("react.fragment"),fd=Symbol.for("react.strict_mode"),Hc=Symbol.for("react.profiler"),a0=Symbol.for("react.provider"),s0=Symbol.for("react.context"),pd=Symbol.for("react.forward_ref"),Gc=Symbol.for("react.suspense"),Vc=Symbol.for("react.suspense_list"),gd=Symbol.for("react.memo"),qr=Symbol.for("react.lazy"),o0=Symbol.for("react.offscreen"),xf=Symbol.iterator;function ma(t){return t===null||typeof t!="object"?null:(t=xf&&t[xf]||t["@@iterator"],typeof t=="function"?t:null)}var st=Object.assign,Yl;function Oa(t){if(Yl===void 0)try{throw Error()}catch(r){var e=r.stack.trim().match(/\n( *(at )?)/);Yl=e&&e[1]||""}return`
`+Yl+t}var Jl=!1;function Xl(t,e){if(!t||Jl)return"";Jl=!0;var r=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(c){var n=c}Reflect.construct(t,[],e)}else{try{e.call()}catch(c){n=c}t.call(e.prototype)}else{try{throw Error()}catch(c){n=c}t()}}catch(c){if(c&&n&&typeof c.stack=="string"){for(var i=c.stack.split(`
`),a=n.stack.split(`
`),s=i.length-1,o=a.length-1;1<=s&&0<=o&&i[s]!==a[o];)o--;for(;1<=s&&0<=o;s--,o--)if(i[s]!==a[o]){if(s!==1||o!==1)do if(s--,o--,0>o||i[s]!==a[o]){var l=`
`+i[s].replace(" at new "," at ");return t.displayName&&l.includes("<anonymous>")&&(l=l.replace("<anonymous>",t.displayName)),l}while(1<=s&&0<=o);break}}}finally{Jl=!1,Error.prepareStackTrace=r}return(t=t?t.displayName||t.name:"")?Oa(t):""}function xx(t){switch(t.tag){case 5:return Oa(t.type);case 16:return Oa("Lazy");case 13:return Oa("Suspense");case 19:return Oa("SuspenseList");case 0:case 2:case 15:return t=Xl(t.type,!1),t;case 11:return t=Xl(t.type.render,!1),t;case 1:return t=Xl(t.type,!0),t;default:return""}}function Wc(t){if(t==null)return null;if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case ji:return"Fragment";case Ei:return"Portal";case Hc:return"Profiler";case fd:return"StrictMode";case Gc:return"Suspense";case Vc:return"SuspenseList"}if(typeof t=="object")switch(t.$$typeof){case s0:return(t.displayName||"Context")+".Consumer";case a0:return(t._context.displayName||"Context")+".Provider";case pd:var e=t.render;return t=t.displayName,t||(t=e.displayName||e.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case gd:return e=t.displayName||null,e!==null?e:Wc(t.type)||"Memo";case qr:e=t._payload,t=t._init;try{return Wc(t(e))}catch{}}return null}function _x(t){var e=t.type;switch(t.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return t=e.render,t=t.displayName||t.name||"",e.displayName||(t!==""?"ForwardRef("+t+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Wc(e);case 8:return e===fd?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function fn(t){switch(typeof t){case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function l0(t){var e=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function Sx(t){var e=l0(t)?"checked":"value",r=Object.getOwnPropertyDescriptor(t.constructor.prototype,e),n=""+t[e];if(!t.hasOwnProperty(e)&&typeof r<"u"&&typeof r.get=="function"&&typeof r.set=="function"){var i=r.get,a=r.set;return Object.defineProperty(t,e,{configurable:!0,get:function(){return i.call(this)},set:function(s){n=""+s,a.call(this,s)}}),Object.defineProperty(t,e,{enumerable:r.enumerable}),{getValue:function(){return n},setValue:function(s){n=""+s},stopTracking:function(){t._valueTracker=null,delete t[e]}}}}function Ds(t){t._valueTracker||(t._valueTracker=Sx(t))}function c0(t){if(!t)return!1;var e=t._valueTracker;if(!e)return!0;var r=e.getValue(),n="";return t&&(n=l0(t)?t.checked?"true":"false":t.value),t=n,t!==r?(e.setValue(t),!0):!1}function Eo(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}function Kc(t,e){var r=e.checked;return st({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:r??t._wrapperState.initialChecked})}function _f(t,e){var r=e.defaultValue==null?"":e.defaultValue,n=e.checked!=null?e.checked:e.defaultChecked;r=fn(e.value!=null?e.value:r),t._wrapperState={initialChecked:n,initialValue:r,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function u0(t,e){e=e.checked,e!=null&&hd(t,"checked",e,!1)}function qc(t,e){u0(t,e);var r=fn(e.value),n=e.type;if(r!=null)n==="number"?(r===0&&t.value===""||t.value!=r)&&(t.value=""+r):t.value!==""+r&&(t.value=""+r);else if(n==="submit"||n==="reset"){t.removeAttribute("value");return}e.hasOwnProperty("value")?Yc(t,e.type,r):e.hasOwnProperty("defaultValue")&&Yc(t,e.type,fn(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(t.defaultChecked=!!e.defaultChecked)}function Sf(t,e,r){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var n=e.type;if(!(n!=="submit"&&n!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+t._wrapperState.initialValue,r||e===t.value||(t.value=e),t.defaultValue=e}r=t.name,r!==""&&(t.name=""),t.defaultChecked=!!t._wrapperState.initialChecked,r!==""&&(t.name=r)}function Yc(t,e,r){(e!=="number"||Eo(t.ownerDocument)!==t)&&(r==null?t.defaultValue=""+t._wrapperState.initialValue:t.defaultValue!==""+r&&(t.defaultValue=""+r))}var Pa=Array.isArray;function Mi(t,e,r,n){if(t=t.options,e){e={};for(var i=0;i<r.length;i++)e["$"+r[i]]=!0;for(r=0;r<t.length;r++)i=e.hasOwnProperty("$"+t[r].value),t[r].selected!==i&&(t[r].selected=i),i&&n&&(t[r].defaultSelected=!0)}else{for(r=""+fn(r),e=null,i=0;i<t.length;i++){if(t[i].value===r){t[i].selected=!0,n&&(t[i].defaultSelected=!0);return}e!==null||t[i].disabled||(e=t[i])}e!==null&&(e.selected=!0)}}function Jc(t,e){if(e.dangerouslySetInnerHTML!=null)throw Error(re(91));return st({},e,{value:void 0,defaultValue:void 0,children:""+t._wrapperState.initialValue})}function kf(t,e){var r=e.value;if(r==null){if(r=e.children,e=e.defaultValue,r!=null){if(e!=null)throw Error(re(92));if(Pa(r)){if(1<r.length)throw Error(re(93));r=r[0]}e=r}e==null&&(e=""),r=e}t._wrapperState={initialValue:fn(r)}}function d0(t,e){var r=fn(e.value),n=fn(e.defaultValue);r!=null&&(r=""+r,r!==t.value&&(t.value=r),e.defaultValue==null&&t.defaultValue!==r&&(t.defaultValue=r)),n!=null&&(t.defaultValue=""+n)}function Ef(t){var e=t.textContent;e===t._wrapperState.initialValue&&e!==""&&e!==null&&(t.value=e)}function h0(t){switch(t){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Xc(t,e){return t==null||t==="http://www.w3.org/1999/xhtml"?h0(e):t==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":t}var Ms,f0=function(t){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,r,n,i){MSApp.execUnsafeLocalFunction(function(){return t(e,r,n,i)})}:t}(function(t,e){if(t.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in t)t.innerHTML=e;else{for(Ms=Ms||document.createElement("div"),Ms.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=Ms.firstChild;t.firstChild;)t.removeChild(t.firstChild);for(;e.firstChild;)t.appendChild(e.firstChild)}});function Za(t,e){if(e){var r=t.firstChild;if(r&&r===t.lastChild&&r.nodeType===3){r.nodeValue=e;return}}t.textContent=e}var Ma={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},kx=["Webkit","ms","Moz","O"];Object.keys(Ma).forEach(function(t){kx.forEach(function(e){e=e+t.charAt(0).toUpperCase()+t.substring(1),Ma[e]=Ma[t]})});function p0(t,e,r){return e==null||typeof e=="boolean"||e===""?"":r||typeof e!="number"||e===0||Ma.hasOwnProperty(t)&&Ma[t]?(""+e).trim():e+"px"}function g0(t,e){t=t.style;for(var r in e)if(e.hasOwnProperty(r)){var n=r.indexOf("--")===0,i=p0(r,e[r],n);r==="float"&&(r="cssFloat"),n?t.setProperty(r,i):t[r]=i}}var Ex=st({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Zc(t,e){if(e){if(Ex[t]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(re(137,t));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(re(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(re(61))}if(e.style!=null&&typeof e.style!="object")throw Error(re(62))}}function Qc(t,e){if(t.indexOf("-")===-1)return typeof e.is=="string";switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var eu=null;function md(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var tu=null,zi=null,Li=null;function jf(t){if(t=_s(t)){if(typeof tu!="function")throw Error(re(280));var e=t.stateNode;e&&(e=gl(e),tu(t.stateNode,t.type,e))}}function m0(t){zi?Li?Li.push(t):Li=[t]:zi=t}function v0(){if(zi){var t=zi,e=Li;if(Li=zi=null,jf(t),e)for(t=0;t<e.length;t++)jf(e[t])}}function y0(t,e){return t(e)}function b0(){}var Zl=!1;function w0(t,e,r){if(Zl)return t(e,r);Zl=!0;try{return y0(t,e,r)}finally{Zl=!1,(zi!==null||Li!==null)&&(b0(),v0())}}function Qa(t,e){var r=t.stateNode;if(r===null)return null;var n=gl(r);if(n===null)return null;r=n[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(n=!n.disabled)||(t=t.type,n=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!n;break e;default:t=!1}if(t)return null;if(r&&typeof r!="function")throw Error(re(231,e,typeof r));return r}var ru=!1;if(Mr)try{var va={};Object.defineProperty(va,"passive",{get:function(){ru=!0}}),window.addEventListener("test",va,va),window.removeEventListener("test",va,va)}catch{ru=!1}function jx(t,e,r,n,i,a,s,o,l){var c=Array.prototype.slice.call(arguments,3);try{e.apply(r,c)}catch(d){this.onError(d)}}var za=!1,jo=null,Co=!1,nu=null,Cx={onError:function(t){za=!0,jo=t}};function Tx(t,e,r,n,i,a,s,o,l){za=!1,jo=null,jx.apply(Cx,arguments)}function Ox(t,e,r,n,i,a,s,o,l){if(Tx.apply(this,arguments),za){if(za){var c=jo;za=!1,jo=null}else throw Error(re(198));Co||(Co=!0,nu=c)}}function Gn(t){var e=t,r=t;if(t.alternate)for(;e.return;)e=e.return;else{t=e;do e=t,e.flags&4098&&(r=e.return),t=e.return;while(t)}return e.tag===3?r:null}function x0(t){if(t.tag===13){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function Cf(t){if(Gn(t)!==t)throw Error(re(188))}function Px(t){var e=t.alternate;if(!e){if(e=Gn(t),e===null)throw Error(re(188));return e!==t?null:t}for(var r=t,n=e;;){var i=r.return;if(i===null)break;var a=i.alternate;if(a===null){if(n=i.return,n!==null){r=n;continue}break}if(i.child===a.child){for(a=i.child;a;){if(a===r)return Cf(i),t;if(a===n)return Cf(i),e;a=a.sibling}throw Error(re(188))}if(r.return!==n.return)r=i,n=a;else{for(var s=!1,o=i.child;o;){if(o===r){s=!0,r=i,n=a;break}if(o===n){s=!0,n=i,r=a;break}o=o.sibling}if(!s){for(o=a.child;o;){if(o===r){s=!0,r=a,n=i;break}if(o===n){s=!0,n=a,r=i;break}o=o.sibling}if(!s)throw Error(re(189))}}if(r.alternate!==n)throw Error(re(190))}if(r.tag!==3)throw Error(re(188));return r.stateNode.current===r?t:e}function _0(t){return t=Px(t),t!==null?S0(t):null}function S0(t){if(t.tag===5||t.tag===6)return t;for(t=t.child;t!==null;){var e=S0(t);if(e!==null)return e;t=t.sibling}return null}var k0=qt.unstable_scheduleCallback,Tf=qt.unstable_cancelCallback,Nx=qt.unstable_shouldYield,$x=qt.unstable_requestPaint,ct=qt.unstable_now,Rx=qt.unstable_getCurrentPriorityLevel,vd=qt.unstable_ImmediatePriority,E0=qt.unstable_UserBlockingPriority,To=qt.unstable_NormalPriority,Ax=qt.unstable_LowPriority,j0=qt.unstable_IdlePriority,dl=null,jr=null;function Ix(t){if(jr&&typeof jr.onCommitFiberRoot=="function")try{jr.onCommitFiberRoot(dl,t,void 0,(t.current.flags&128)===128)}catch{}}var mr=Math.clz32?Math.clz32:zx,Dx=Math.log,Mx=Math.LN2;function zx(t){return t>>>=0,t===0?32:31-(Dx(t)/Mx|0)|0}var zs=64,Ls=4194304;function Na(t){switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return t&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return t}}function Oo(t,e){var r=t.pendingLanes;if(r===0)return 0;var n=0,i=t.suspendedLanes,a=t.pingedLanes,s=r&268435455;if(s!==0){var o=s&~i;o!==0?n=Na(o):(a&=s,a!==0&&(n=Na(a)))}else s=r&~i,s!==0?n=Na(s):a!==0&&(n=Na(a));if(n===0)return 0;if(e!==0&&e!==n&&!(e&i)&&(i=n&-n,a=e&-e,i>=a||i===16&&(a&4194240)!==0))return e;if(n&4&&(n|=r&16),e=t.entangledLanes,e!==0)for(t=t.entanglements,e&=n;0<e;)r=31-mr(e),i=1<<r,n|=t[r],e&=~i;return n}function Lx(t,e){switch(t){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Fx(t,e){for(var r=t.suspendedLanes,n=t.pingedLanes,i=t.expirationTimes,a=t.pendingLanes;0<a;){var s=31-mr(a),o=1<<s,l=i[s];l===-1?(!(o&r)||o&n)&&(i[s]=Lx(o,e)):l<=e&&(t.expiredLanes|=o),a&=~o}}function iu(t){return t=t.pendingLanes&-1073741825,t!==0?t:t&1073741824?1073741824:0}function C0(){var t=zs;return zs<<=1,!(zs&4194240)&&(zs=64),t}function Ql(t){for(var e=[],r=0;31>r;r++)e.push(t);return e}function ws(t,e,r){t.pendingLanes|=e,e!==536870912&&(t.suspendedLanes=0,t.pingedLanes=0),t=t.eventTimes,e=31-mr(e),t[e]=r}function Bx(t,e){var r=t.pendingLanes&~e;t.pendingLanes=e,t.suspendedLanes=0,t.pingedLanes=0,t.expiredLanes&=e,t.mutableReadLanes&=e,t.entangledLanes&=e,e=t.entanglements;var n=t.eventTimes;for(t=t.expirationTimes;0<r;){var i=31-mr(r),a=1<<i;e[i]=0,n[i]=-1,t[i]=-1,r&=~a}}function yd(t,e){var r=t.entangledLanes|=e;for(t=t.entanglements;r;){var n=31-mr(r),i=1<<n;i&e|t[n]&e&&(t[n]|=e),r&=~i}}var Ve=0;function T0(t){return t&=-t,1<t?4<t?t&268435455?16:536870912:4:1}var O0,bd,P0,N0,$0,au=!1,Fs=[],an=null,sn=null,on=null,es=new Map,ts=new Map,Xr=[],Ux="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Of(t,e){switch(t){case"focusin":case"focusout":an=null;break;case"dragenter":case"dragleave":sn=null;break;case"mouseover":case"mouseout":on=null;break;case"pointerover":case"pointerout":es.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":ts.delete(e.pointerId)}}function ya(t,e,r,n,i,a){return t===null||t.nativeEvent!==a?(t={blockedOn:e,domEventName:r,eventSystemFlags:n,nativeEvent:a,targetContainers:[i]},e!==null&&(e=_s(e),e!==null&&bd(e)),t):(t.eventSystemFlags|=n,e=t.targetContainers,i!==null&&e.indexOf(i)===-1&&e.push(i),t)}function Hx(t,e,r,n,i){switch(e){case"focusin":return an=ya(an,t,e,r,n,i),!0;case"dragenter":return sn=ya(sn,t,e,r,n,i),!0;case"mouseover":return on=ya(on,t,e,r,n,i),!0;case"pointerover":var a=i.pointerId;return es.set(a,ya(es.get(a)||null,t,e,r,n,i)),!0;case"gotpointercapture":return a=i.pointerId,ts.set(a,ya(ts.get(a)||null,t,e,r,n,i)),!0}return!1}function R0(t){var e=Nn(t.target);if(e!==null){var r=Gn(e);if(r!==null){if(e=r.tag,e===13){if(e=x0(r),e!==null){t.blockedOn=e,$0(t.priority,function(){P0(r)});return}}else if(e===3&&r.stateNode.current.memoizedState.isDehydrated){t.blockedOn=r.tag===3?r.stateNode.containerInfo:null;return}}}t.blockedOn=null}function po(t){if(t.blockedOn!==null)return!1;for(var e=t.targetContainers;0<e.length;){var r=su(t.domEventName,t.eventSystemFlags,e[0],t.nativeEvent);if(r===null){r=t.nativeEvent;var n=new r.constructor(r.type,r);eu=n,r.target.dispatchEvent(n),eu=null}else return e=_s(r),e!==null&&bd(e),t.blockedOn=r,!1;e.shift()}return!0}function Pf(t,e,r){po(t)&&r.delete(e)}function Gx(){au=!1,an!==null&&po(an)&&(an=null),sn!==null&&po(sn)&&(sn=null),on!==null&&po(on)&&(on=null),es.forEach(Pf),ts.forEach(Pf)}function ba(t,e){t.blockedOn===e&&(t.blockedOn=null,au||(au=!0,qt.unstable_scheduleCallback(qt.unstable_NormalPriority,Gx)))}function rs(t){function e(i){return ba(i,t)}if(0<Fs.length){ba(Fs[0],t);for(var r=1;r<Fs.length;r++){var n=Fs[r];n.blockedOn===t&&(n.blockedOn=null)}}for(an!==null&&ba(an,t),sn!==null&&ba(sn,t),on!==null&&ba(on,t),es.forEach(e),ts.forEach(e),r=0;r<Xr.length;r++)n=Xr[r],n.blockedOn===t&&(n.blockedOn=null);for(;0<Xr.length&&(r=Xr[0],r.blockedOn===null);)R0(r),r.blockedOn===null&&Xr.shift()}var Fi=Br.ReactCurrentBatchConfig,Po=!0;function Vx(t,e,r,n){var i=Ve,a=Fi.transition;Fi.transition=null;try{Ve=1,wd(t,e,r,n)}finally{Ve=i,Fi.transition=a}}function Wx(t,e,r,n){var i=Ve,a=Fi.transition;Fi.transition=null;try{Ve=4,wd(t,e,r,n)}finally{Ve=i,Fi.transition=a}}function wd(t,e,r,n){if(Po){var i=su(t,e,r,n);if(i===null)cc(t,e,n,No,r),Of(t,n);else if(Hx(i,t,e,r,n))n.stopPropagation();else if(Of(t,n),e&4&&-1<Ux.indexOf(t)){for(;i!==null;){var a=_s(i);if(a!==null&&O0(a),a=su(t,e,r,n),a===null&&cc(t,e,n,No,r),a===i)break;i=a}i!==null&&n.stopPropagation()}else cc(t,e,n,null,r)}}var No=null;function su(t,e,r,n){if(No=null,t=md(n),t=Nn(t),t!==null)if(e=Gn(t),e===null)t=null;else if(r=e.tag,r===13){if(t=x0(e),t!==null)return t;t=null}else if(r===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;t=null}else e!==t&&(t=null);return No=t,null}function A0(t){switch(t){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(Rx()){case vd:return 1;case E0:return 4;case To:case Ax:return 16;case j0:return 536870912;default:return 16}default:return 16}}var rn=null,xd=null,go=null;function I0(){if(go)return go;var t,e=xd,r=e.length,n,i="value"in rn?rn.value:rn.textContent,a=i.length;for(t=0;t<r&&e[t]===i[t];t++);var s=r-t;for(n=1;n<=s&&e[r-n]===i[a-n];n++);return go=i.slice(t,1<n?1-n:void 0)}function mo(t){var e=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&e===13&&(t=13)):t=e,t===10&&(t=13),32<=t||t===13?t:0}function Bs(){return!0}function Nf(){return!1}function Xt(t){function e(r,n,i,a,s){this._reactName=r,this._targetInst=i,this.type=n,this.nativeEvent=a,this.target=s,this.currentTarget=null;for(var o in t)t.hasOwnProperty(o)&&(r=t[o],this[o]=r?r(a):a[o]);return this.isDefaultPrevented=(a.defaultPrevented!=null?a.defaultPrevented:a.returnValue===!1)?Bs:Nf,this.isPropagationStopped=Nf,this}return st(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var r=this.nativeEvent;r&&(r.preventDefault?r.preventDefault():typeof r.returnValue!="unknown"&&(r.returnValue=!1),this.isDefaultPrevented=Bs)},stopPropagation:function(){var r=this.nativeEvent;r&&(r.stopPropagation?r.stopPropagation():typeof r.cancelBubble!="unknown"&&(r.cancelBubble=!0),this.isPropagationStopped=Bs)},persist:function(){},isPersistent:Bs}),e}var ea={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},_d=Xt(ea),xs=st({},ea,{view:0,detail:0}),Kx=Xt(xs),ec,tc,wa,hl=st({},xs,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Sd,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==wa&&(wa&&t.type==="mousemove"?(ec=t.screenX-wa.screenX,tc=t.screenY-wa.screenY):tc=ec=0,wa=t),ec)},movementY:function(t){return"movementY"in t?t.movementY:tc}}),$f=Xt(hl),qx=st({},hl,{dataTransfer:0}),Yx=Xt(qx),Jx=st({},xs,{relatedTarget:0}),rc=Xt(Jx),Xx=st({},ea,{animationName:0,elapsedTime:0,pseudoElement:0}),Zx=Xt(Xx),Qx=st({},ea,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),e1=Xt(Qx),t1=st({},ea,{data:0}),Rf=Xt(t1),r1={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},n1={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},i1={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function a1(t){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(t):(t=i1[t])?!!e[t]:!1}function Sd(){return a1}var s1=st({},xs,{key:function(t){if(t.key){var e=r1[t.key]||t.key;if(e!=="Unidentified")return e}return t.type==="keypress"?(t=mo(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?n1[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Sd,charCode:function(t){return t.type==="keypress"?mo(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?mo(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),o1=Xt(s1),l1=st({},hl,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Af=Xt(l1),c1=st({},xs,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Sd}),u1=Xt(c1),d1=st({},ea,{propertyName:0,elapsedTime:0,pseudoElement:0}),h1=Xt(d1),f1=st({},hl,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),p1=Xt(f1),g1=[9,13,27,32],kd=Mr&&"CompositionEvent"in window,La=null;Mr&&"documentMode"in document&&(La=document.documentMode);var m1=Mr&&"TextEvent"in window&&!La,D0=Mr&&(!kd||La&&8<La&&11>=La),If=" ",Df=!1;function M0(t,e){switch(t){case"keyup":return g1.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function z0(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var Ci=!1;function v1(t,e){switch(t){case"compositionend":return z0(e);case"keypress":return e.which!==32?null:(Df=!0,If);case"textInput":return t=e.data,t===If&&Df?null:t;default:return null}}function y1(t,e){if(Ci)return t==="compositionend"||!kd&&M0(t,e)?(t=I0(),go=xd=rn=null,Ci=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return D0&&e.locale!=="ko"?null:e.data;default:return null}}var b1={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Mf(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e==="input"?!!b1[t.type]:e==="textarea"}function L0(t,e,r,n){m0(n),e=$o(e,"onChange"),0<e.length&&(r=new _d("onChange","change",null,r,n),t.push({event:r,listeners:e}))}var Fa=null,ns=null;function w1(t){J0(t,0)}function fl(t){var e=Pi(t);if(c0(e))return t}function x1(t,e){if(t==="change")return e}var F0=!1;if(Mr){var nc;if(Mr){var ic="oninput"in document;if(!ic){var zf=document.createElement("div");zf.setAttribute("oninput","return;"),ic=typeof zf.oninput=="function"}nc=ic}else nc=!1;F0=nc&&(!document.documentMode||9<document.documentMode)}function Lf(){Fa&&(Fa.detachEvent("onpropertychange",B0),ns=Fa=null)}function B0(t){if(t.propertyName==="value"&&fl(ns)){var e=[];L0(e,ns,t,md(t)),w0(w1,e)}}function _1(t,e,r){t==="focusin"?(Lf(),Fa=e,ns=r,Fa.attachEvent("onpropertychange",B0)):t==="focusout"&&Lf()}function S1(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return fl(ns)}function k1(t,e){if(t==="click")return fl(e)}function E1(t,e){if(t==="input"||t==="change")return fl(e)}function j1(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var yr=typeof Object.is=="function"?Object.is:j1;function is(t,e){if(yr(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;var r=Object.keys(t),n=Object.keys(e);if(r.length!==n.length)return!1;for(n=0;n<r.length;n++){var i=r[n];if(!Uc.call(e,i)||!yr(t[i],e[i]))return!1}return!0}function Ff(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function Bf(t,e){var r=Ff(t);t=0;for(var n;r;){if(r.nodeType===3){if(n=t+r.textContent.length,t<=e&&n>=e)return{node:r,offset:e-t};t=n}e:{for(;r;){if(r.nextSibling){r=r.nextSibling;break e}r=r.parentNode}r=void 0}r=Ff(r)}}function U0(t,e){return t&&e?t===e?!0:t&&t.nodeType===3?!1:e&&e.nodeType===3?U0(t,e.parentNode):"contains"in t?t.contains(e):t.compareDocumentPosition?!!(t.compareDocumentPosition(e)&16):!1:!1}function H0(){for(var t=window,e=Eo();e instanceof t.HTMLIFrameElement;){try{var r=typeof e.contentWindow.location.href=="string"}catch{r=!1}if(r)t=e.contentWindow;else break;e=Eo(t.document)}return e}function Ed(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e&&(e==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||e==="textarea"||t.contentEditable==="true")}function C1(t){var e=H0(),r=t.focusedElem,n=t.selectionRange;if(e!==r&&r&&r.ownerDocument&&U0(r.ownerDocument.documentElement,r)){if(n!==null&&Ed(r)){if(e=n.start,t=n.end,t===void 0&&(t=e),"selectionStart"in r)r.selectionStart=e,r.selectionEnd=Math.min(t,r.value.length);else if(t=(e=r.ownerDocument||document)&&e.defaultView||window,t.getSelection){t=t.getSelection();var i=r.textContent.length,a=Math.min(n.start,i);n=n.end===void 0?a:Math.min(n.end,i),!t.extend&&a>n&&(i=n,n=a,a=i),i=Bf(r,a);var s=Bf(r,n);i&&s&&(t.rangeCount!==1||t.anchorNode!==i.node||t.anchorOffset!==i.offset||t.focusNode!==s.node||t.focusOffset!==s.offset)&&(e=e.createRange(),e.setStart(i.node,i.offset),t.removeAllRanges(),a>n?(t.addRange(e),t.extend(s.node,s.offset)):(e.setEnd(s.node,s.offset),t.addRange(e)))}}for(e=[],t=r;t=t.parentNode;)t.nodeType===1&&e.push({element:t,left:t.scrollLeft,top:t.scrollTop});for(typeof r.focus=="function"&&r.focus(),r=0;r<e.length;r++)t=e[r],t.element.scrollLeft=t.left,t.element.scrollTop=t.top}}var T1=Mr&&"documentMode"in document&&11>=document.documentMode,Ti=null,ou=null,Ba=null,lu=!1;function Uf(t,e,r){var n=r.window===r?r.document:r.nodeType===9?r:r.ownerDocument;lu||Ti==null||Ti!==Eo(n)||(n=Ti,"selectionStart"in n&&Ed(n)?n={start:n.selectionStart,end:n.selectionEnd}:(n=(n.ownerDocument&&n.ownerDocument.defaultView||window).getSelection(),n={anchorNode:n.anchorNode,anchorOffset:n.anchorOffset,focusNode:n.focusNode,focusOffset:n.focusOffset}),Ba&&is(Ba,n)||(Ba=n,n=$o(ou,"onSelect"),0<n.length&&(e=new _d("onSelect","select",null,e,r),t.push({event:e,listeners:n}),e.target=Ti)))}function Us(t,e){var r={};return r[t.toLowerCase()]=e.toLowerCase(),r["Webkit"+t]="webkit"+e,r["Moz"+t]="moz"+e,r}var Oi={animationend:Us("Animation","AnimationEnd"),animationiteration:Us("Animation","AnimationIteration"),animationstart:Us("Animation","AnimationStart"),transitionend:Us("Transition","TransitionEnd")},ac={},G0={};Mr&&(G0=document.createElement("div").style,"AnimationEvent"in window||(delete Oi.animationend.animation,delete Oi.animationiteration.animation,delete Oi.animationstart.animation),"TransitionEvent"in window||delete Oi.transitionend.transition);function pl(t){if(ac[t])return ac[t];if(!Oi[t])return t;var e=Oi[t],r;for(r in e)if(e.hasOwnProperty(r)&&r in G0)return ac[t]=e[r];return t}var V0=pl("animationend"),W0=pl("animationiteration"),K0=pl("animationstart"),q0=pl("transitionend"),Y0=new Map,Hf="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function vn(t,e){Y0.set(t,e),Hn(e,[t])}for(var sc=0;sc<Hf.length;sc++){var oc=Hf[sc],O1=oc.toLowerCase(),P1=oc[0].toUpperCase()+oc.slice(1);vn(O1,"on"+P1)}vn(V0,"onAnimationEnd");vn(W0,"onAnimationIteration");vn(K0,"onAnimationStart");vn("dblclick","onDoubleClick");vn("focusin","onFocus");vn("focusout","onBlur");vn(q0,"onTransitionEnd");Gi("onMouseEnter",["mouseout","mouseover"]);Gi("onMouseLeave",["mouseout","mouseover"]);Gi("onPointerEnter",["pointerout","pointerover"]);Gi("onPointerLeave",["pointerout","pointerover"]);Hn("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Hn("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Hn("onBeforeInput",["compositionend","keypress","textInput","paste"]);Hn("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Hn("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Hn("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var $a="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),N1=new Set("cancel close invalid load scroll toggle".split(" ").concat($a));function Gf(t,e,r){var n=t.type||"unknown-event";t.currentTarget=r,Ox(n,e,void 0,t),t.currentTarget=null}function J0(t,e){e=(e&4)!==0;for(var r=0;r<t.length;r++){var n=t[r],i=n.event;n=n.listeners;e:{var a=void 0;if(e)for(var s=n.length-1;0<=s;s--){var o=n[s],l=o.instance,c=o.currentTarget;if(o=o.listener,l!==a&&i.isPropagationStopped())break e;Gf(i,o,c),a=l}else for(s=0;s<n.length;s++){if(o=n[s],l=o.instance,c=o.currentTarget,o=o.listener,l!==a&&i.isPropagationStopped())break e;Gf(i,o,c),a=l}}}if(Co)throw t=nu,Co=!1,nu=null,t}function Je(t,e){var r=e[fu];r===void 0&&(r=e[fu]=new Set);var n=t+"__bubble";r.has(n)||(X0(e,t,2,!1),r.add(n))}function lc(t,e,r){var n=0;e&&(n|=4),X0(r,t,n,e)}var Hs="_reactListening"+Math.random().toString(36).slice(2);function as(t){if(!t[Hs]){t[Hs]=!0,i0.forEach(function(r){r!=="selectionchange"&&(N1.has(r)||lc(r,!1,t),lc(r,!0,t))});var e=t.nodeType===9?t:t.ownerDocument;e===null||e[Hs]||(e[Hs]=!0,lc("selectionchange",!1,e))}}function X0(t,e,r,n){switch(A0(e)){case 1:var i=Vx;break;case 4:i=Wx;break;default:i=wd}r=i.bind(null,e,r,t),i=void 0,!ru||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(i=!0),n?i!==void 0?t.addEventListener(e,r,{capture:!0,passive:i}):t.addEventListener(e,r,!0):i!==void 0?t.addEventListener(e,r,{passive:i}):t.addEventListener(e,r,!1)}function cc(t,e,r,n,i){var a=n;if(!(e&1)&&!(e&2)&&n!==null)e:for(;;){if(n===null)return;var s=n.tag;if(s===3||s===4){var o=n.stateNode.containerInfo;if(o===i||o.nodeType===8&&o.parentNode===i)break;if(s===4)for(s=n.return;s!==null;){var l=s.tag;if((l===3||l===4)&&(l=s.stateNode.containerInfo,l===i||l.nodeType===8&&l.parentNode===i))return;s=s.return}for(;o!==null;){if(s=Nn(o),s===null)return;if(l=s.tag,l===5||l===6){n=a=s;continue e}o=o.parentNode}}n=n.return}w0(function(){var c=a,d=md(r),h=[];e:{var f=Y0.get(t);if(f!==void 0){var p=_d,y=t;switch(t){case"keypress":if(mo(r)===0)break e;case"keydown":case"keyup":p=o1;break;case"focusin":y="focus",p=rc;break;case"focusout":y="blur",p=rc;break;case"beforeblur":case"afterblur":p=rc;break;case"click":if(r.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":p=$f;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":p=Yx;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":p=u1;break;case V0:case W0:case K0:p=Zx;break;case q0:p=h1;break;case"scroll":p=Kx;break;case"wheel":p=p1;break;case"copy":case"cut":case"paste":p=e1;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":p=Af}var m=(e&4)!==0,b=!m&&t==="scroll",v=m?f!==null?f+"Capture":null:f;m=[];for(var g=c,w;g!==null;){w=g;var S=w.stateNode;if(w.tag===5&&S!==null&&(w=S,v!==null&&(S=Qa(g,v),S!=null&&m.push(ss(g,S,w)))),b)break;g=g.return}0<m.length&&(f=new p(f,y,null,r,d),h.push({event:f,listeners:m}))}}if(!(e&7)){e:{if(f=t==="mouseover"||t==="pointerover",p=t==="mouseout"||t==="pointerout",f&&r!==eu&&(y=r.relatedTarget||r.fromElement)&&(Nn(y)||y[zr]))break e;if((p||f)&&(f=d.window===d?d:(f=d.ownerDocument)?f.defaultView||f.parentWindow:window,p?(y=r.relatedTarget||r.toElement,p=c,y=y?Nn(y):null,y!==null&&(b=Gn(y),y!==b||y.tag!==5&&y.tag!==6)&&(y=null)):(p=null,y=c),p!==y)){if(m=$f,S="onMouseLeave",v="onMouseEnter",g="mouse",(t==="pointerout"||t==="pointerover")&&(m=Af,S="onPointerLeave",v="onPointerEnter",g="pointer"),b=p==null?f:Pi(p),w=y==null?f:Pi(y),f=new m(S,g+"leave",p,r,d),f.target=b,f.relatedTarget=w,S=null,Nn(d)===c&&(m=new m(v,g+"enter",y,r,d),m.target=w,m.relatedTarget=b,S=m),b=S,p&&y)t:{for(m=p,v=y,g=0,w=m;w;w=Qn(w))g++;for(w=0,S=v;S;S=Qn(S))w++;for(;0<g-w;)m=Qn(m),g--;for(;0<w-g;)v=Qn(v),w--;for(;g--;){if(m===v||v!==null&&m===v.alternate)break t;m=Qn(m),v=Qn(v)}m=null}else m=null;p!==null&&Vf(h,f,p,m,!1),y!==null&&b!==null&&Vf(h,b,y,m,!0)}}e:{if(f=c?Pi(c):window,p=f.nodeName&&f.nodeName.toLowerCase(),p==="select"||p==="input"&&f.type==="file")var E=x1;else if(Mf(f))if(F0)E=E1;else{E=S1;var k=_1}else(p=f.nodeName)&&p.toLowerCase()==="input"&&(f.type==="checkbox"||f.type==="radio")&&(E=k1);if(E&&(E=E(t,c))){L0(h,E,r,d);break e}k&&k(t,f,c),t==="focusout"&&(k=f._wrapperState)&&k.controlled&&f.type==="number"&&Yc(f,"number",f.value)}switch(k=c?Pi(c):window,t){case"focusin":(Mf(k)||k.contentEditable==="true")&&(Ti=k,ou=c,Ba=null);break;case"focusout":Ba=ou=Ti=null;break;case"mousedown":lu=!0;break;case"contextmenu":case"mouseup":case"dragend":lu=!1,Uf(h,r,d);break;case"selectionchange":if(T1)break;case"keydown":case"keyup":Uf(h,r,d)}var C;if(kd)e:{switch(t){case"compositionstart":var N="onCompositionStart";break e;case"compositionend":N="onCompositionEnd";break e;case"compositionupdate":N="onCompositionUpdate";break e}N=void 0}else Ci?M0(t,r)&&(N="onCompositionEnd"):t==="keydown"&&r.keyCode===229&&(N="onCompositionStart");N&&(D0&&r.locale!=="ko"&&(Ci||N!=="onCompositionStart"?N==="onCompositionEnd"&&Ci&&(C=I0()):(rn=d,xd="value"in rn?rn.value:rn.textContent,Ci=!0)),k=$o(c,N),0<k.length&&(N=new Rf(N,t,null,r,d),h.push({event:N,listeners:k}),C?N.data=C:(C=z0(r),C!==null&&(N.data=C)))),(C=m1?v1(t,r):y1(t,r))&&(c=$o(c,"onBeforeInput"),0<c.length&&(d=new Rf("onBeforeInput","beforeinput",null,r,d),h.push({event:d,listeners:c}),d.data=C))}J0(h,e)})}function ss(t,e,r){return{instance:t,listener:e,currentTarget:r}}function $o(t,e){for(var r=e+"Capture",n=[];t!==null;){var i=t,a=i.stateNode;i.tag===5&&a!==null&&(i=a,a=Qa(t,r),a!=null&&n.unshift(ss(t,a,i)),a=Qa(t,e),a!=null&&n.push(ss(t,a,i))),t=t.return}return n}function Qn(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5);return t||null}function Vf(t,e,r,n,i){for(var a=e._reactName,s=[];r!==null&&r!==n;){var o=r,l=o.alternate,c=o.stateNode;if(l!==null&&l===n)break;o.tag===5&&c!==null&&(o=c,i?(l=Qa(r,a),l!=null&&s.unshift(ss(r,l,o))):i||(l=Qa(r,a),l!=null&&s.push(ss(r,l,o)))),r=r.return}s.length!==0&&t.push({event:e,listeners:s})}var $1=/\r\n?/g,R1=/\u0000|\uFFFD/g;function Wf(t){return(typeof t=="string"?t:""+t).replace($1,`
`).replace(R1,"")}function Gs(t,e,r){if(e=Wf(e),Wf(t)!==e&&r)throw Error(re(425))}function Ro(){}var cu=null,uu=null;function du(t,e){return t==="textarea"||t==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var hu=typeof setTimeout=="function"?setTimeout:void 0,A1=typeof clearTimeout=="function"?clearTimeout:void 0,Kf=typeof Promise=="function"?Promise:void 0,I1=typeof queueMicrotask=="function"?queueMicrotask:typeof Kf<"u"?function(t){return Kf.resolve(null).then(t).catch(D1)}:hu;function D1(t){setTimeout(function(){throw t})}function uc(t,e){var r=e,n=0;do{var i=r.nextSibling;if(t.removeChild(r),i&&i.nodeType===8)if(r=i.data,r==="/$"){if(n===0){t.removeChild(i),rs(e);return}n--}else r!=="$"&&r!=="$?"&&r!=="$!"||n++;r=i}while(r);rs(e)}function ln(t){for(;t!=null;t=t.nextSibling){var e=t.nodeType;if(e===1||e===3)break;if(e===8){if(e=t.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return t}function qf(t){t=t.previousSibling;for(var e=0;t;){if(t.nodeType===8){var r=t.data;if(r==="$"||r==="$!"||r==="$?"){if(e===0)return t;e--}else r==="/$"&&e++}t=t.previousSibling}return null}var ta=Math.random().toString(36).slice(2),kr="__reactFiber$"+ta,os="__reactProps$"+ta,zr="__reactContainer$"+ta,fu="__reactEvents$"+ta,M1="__reactListeners$"+ta,z1="__reactHandles$"+ta;function Nn(t){var e=t[kr];if(e)return e;for(var r=t.parentNode;r;){if(e=r[zr]||r[kr]){if(r=e.alternate,e.child!==null||r!==null&&r.child!==null)for(t=qf(t);t!==null;){if(r=t[kr])return r;t=qf(t)}return e}t=r,r=t.parentNode}return null}function _s(t){return t=t[kr]||t[zr],!t||t.tag!==5&&t.tag!==6&&t.tag!==13&&t.tag!==3?null:t}function Pi(t){if(t.tag===5||t.tag===6)return t.stateNode;throw Error(re(33))}function gl(t){return t[os]||null}var pu=[],Ni=-1;function yn(t){return{current:t}}function Qe(t){0>Ni||(t.current=pu[Ni],pu[Ni]=null,Ni--)}function Ye(t,e){Ni++,pu[Ni]=t.current,t.current=e}var pn={},Et=yn(pn),It=yn(!1),Mn=pn;function Vi(t,e){var r=t.type.contextTypes;if(!r)return pn;var n=t.stateNode;if(n&&n.__reactInternalMemoizedUnmaskedChildContext===e)return n.__reactInternalMemoizedMaskedChildContext;var i={},a;for(a in r)i[a]=e[a];return n&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=e,t.__reactInternalMemoizedMaskedChildContext=i),i}function Dt(t){return t=t.childContextTypes,t!=null}function Ao(){Qe(It),Qe(Et)}function Yf(t,e,r){if(Et.current!==pn)throw Error(re(168));Ye(Et,e),Ye(It,r)}function Z0(t,e,r){var n=t.stateNode;if(e=e.childContextTypes,typeof n.getChildContext!="function")return r;n=n.getChildContext();for(var i in n)if(!(i in e))throw Error(re(108,_x(t)||"Unknown",i));return st({},r,n)}function Io(t){return t=(t=t.stateNode)&&t.__reactInternalMemoizedMergedChildContext||pn,Mn=Et.current,Ye(Et,t),Ye(It,It.current),!0}function Jf(t,e,r){var n=t.stateNode;if(!n)throw Error(re(169));r?(t=Z0(t,e,Mn),n.__reactInternalMemoizedMergedChildContext=t,Qe(It),Qe(Et),Ye(Et,t)):Qe(It),Ye(It,r)}var Rr=null,ml=!1,dc=!1;function Q0(t){Rr===null?Rr=[t]:Rr.push(t)}function L1(t){ml=!0,Q0(t)}function bn(){if(!dc&&Rr!==null){dc=!0;var t=0,e=Ve;try{var r=Rr;for(Ve=1;t<r.length;t++){var n=r[t];do n=n(!0);while(n!==null)}Rr=null,ml=!1}catch(i){throw Rr!==null&&(Rr=Rr.slice(t+1)),k0(vd,bn),i}finally{Ve=e,dc=!1}}return null}var $i=[],Ri=0,Do=null,Mo=0,Zt=[],Qt=0,zn=null,Ar=1,Ir="";function En(t,e){$i[Ri++]=Mo,$i[Ri++]=Do,Do=t,Mo=e}function ev(t,e,r){Zt[Qt++]=Ar,Zt[Qt++]=Ir,Zt[Qt++]=zn,zn=t;var n=Ar;t=Ir;var i=32-mr(n)-1;n&=~(1<<i),r+=1;var a=32-mr(e)+i;if(30<a){var s=i-i%5;a=(n&(1<<s)-1).toString(32),n>>=s,i-=s,Ar=1<<32-mr(e)+i|r<<i|n,Ir=a+t}else Ar=1<<a|r<<i|n,Ir=t}function jd(t){t.return!==null&&(En(t,1),ev(t,1,0))}function Cd(t){for(;t===Do;)Do=$i[--Ri],$i[Ri]=null,Mo=$i[--Ri],$i[Ri]=null;for(;t===zn;)zn=Zt[--Qt],Zt[Qt]=null,Ir=Zt[--Qt],Zt[Qt]=null,Ar=Zt[--Qt],Zt[Qt]=null}var Kt=null,Gt=null,tt=!1,pr=null;function tv(t,e){var r=tr(5,null,null,0);r.elementType="DELETED",r.stateNode=e,r.return=t,e=t.deletions,e===null?(t.deletions=[r],t.flags|=16):e.push(r)}function Xf(t,e){switch(t.tag){case 5:var r=t.type;return e=e.nodeType!==1||r.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(t.stateNode=e,Kt=t,Gt=ln(e.firstChild),!0):!1;case 6:return e=t.pendingProps===""||e.nodeType!==3?null:e,e!==null?(t.stateNode=e,Kt=t,Gt=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(r=zn!==null?{id:Ar,overflow:Ir}:null,t.memoizedState={dehydrated:e,treeContext:r,retryLane:1073741824},r=tr(18,null,null,0),r.stateNode=e,r.return=t,t.child=r,Kt=t,Gt=null,!0):!1;default:return!1}}function gu(t){return(t.mode&1)!==0&&(t.flags&128)===0}function mu(t){if(tt){var e=Gt;if(e){var r=e;if(!Xf(t,e)){if(gu(t))throw Error(re(418));e=ln(r.nextSibling);var n=Kt;e&&Xf(t,e)?tv(n,r):(t.flags=t.flags&-4097|2,tt=!1,Kt=t)}}else{if(gu(t))throw Error(re(418));t.flags=t.flags&-4097|2,tt=!1,Kt=t}}}function Zf(t){for(t=t.return;t!==null&&t.tag!==5&&t.tag!==3&&t.tag!==13;)t=t.return;Kt=t}function Vs(t){if(t!==Kt)return!1;if(!tt)return Zf(t),tt=!0,!1;var e;if((e=t.tag!==3)&&!(e=t.tag!==5)&&(e=t.type,e=e!=="head"&&e!=="body"&&!du(t.type,t.memoizedProps)),e&&(e=Gt)){if(gu(t))throw rv(),Error(re(418));for(;e;)tv(t,e),e=ln(e.nextSibling)}if(Zf(t),t.tag===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(re(317));e:{for(t=t.nextSibling,e=0;t;){if(t.nodeType===8){var r=t.data;if(r==="/$"){if(e===0){Gt=ln(t.nextSibling);break e}e--}else r!=="$"&&r!=="$!"&&r!=="$?"||e++}t=t.nextSibling}Gt=null}}else Gt=Kt?ln(t.stateNode.nextSibling):null;return!0}function rv(){for(var t=Gt;t;)t=ln(t.nextSibling)}function Wi(){Gt=Kt=null,tt=!1}function Td(t){pr===null?pr=[t]:pr.push(t)}var F1=Br.ReactCurrentBatchConfig;function xa(t,e,r){if(t=r.ref,t!==null&&typeof t!="function"&&typeof t!="object"){if(r._owner){if(r=r._owner,r){if(r.tag!==1)throw Error(re(309));var n=r.stateNode}if(!n)throw Error(re(147,t));var i=n,a=""+t;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===a?e.ref:(e=function(s){var o=i.refs;s===null?delete o[a]:o[a]=s},e._stringRef=a,e)}if(typeof t!="string")throw Error(re(284));if(!r._owner)throw Error(re(290,t))}return t}function Ws(t,e){throw t=Object.prototype.toString.call(e),Error(re(31,t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t))}function Qf(t){var e=t._init;return e(t._payload)}function nv(t){function e(v,g){if(t){var w=v.deletions;w===null?(v.deletions=[g],v.flags|=16):w.push(g)}}function r(v,g){if(!t)return null;for(;g!==null;)e(v,g),g=g.sibling;return null}function n(v,g){for(v=new Map;g!==null;)g.key!==null?v.set(g.key,g):v.set(g.index,g),g=g.sibling;return v}function i(v,g){return v=hn(v,g),v.index=0,v.sibling=null,v}function a(v,g,w){return v.index=w,t?(w=v.alternate,w!==null?(w=w.index,w<g?(v.flags|=2,g):w):(v.flags|=2,g)):(v.flags|=1048576,g)}function s(v){return t&&v.alternate===null&&(v.flags|=2),v}function o(v,g,w,S){return g===null||g.tag!==6?(g=yc(w,v.mode,S),g.return=v,g):(g=i(g,w),g.return=v,g)}function l(v,g,w,S){var E=w.type;return E===ji?d(v,g,w.props.children,S,w.key):g!==null&&(g.elementType===E||typeof E=="object"&&E!==null&&E.$$typeof===qr&&Qf(E)===g.type)?(S=i(g,w.props),S.ref=xa(v,g,w),S.return=v,S):(S=So(w.type,w.key,w.props,null,v.mode,S),S.ref=xa(v,g,w),S.return=v,S)}function c(v,g,w,S){return g===null||g.tag!==4||g.stateNode.containerInfo!==w.containerInfo||g.stateNode.implementation!==w.implementation?(g=bc(w,v.mode,S),g.return=v,g):(g=i(g,w.children||[]),g.return=v,g)}function d(v,g,w,S,E){return g===null||g.tag!==7?(g=Dn(w,v.mode,S,E),g.return=v,g):(g=i(g,w),g.return=v,g)}function h(v,g,w){if(typeof g=="string"&&g!==""||typeof g=="number")return g=yc(""+g,v.mode,w),g.return=v,g;if(typeof g=="object"&&g!==null){switch(g.$$typeof){case Is:return w=So(g.type,g.key,g.props,null,v.mode,w),w.ref=xa(v,null,g),w.return=v,w;case Ei:return g=bc(g,v.mode,w),g.return=v,g;case qr:var S=g._init;return h(v,S(g._payload),w)}if(Pa(g)||ma(g))return g=Dn(g,v.mode,w,null),g.return=v,g;Ws(v,g)}return null}function f(v,g,w,S){var E=g!==null?g.key:null;if(typeof w=="string"&&w!==""||typeof w=="number")return E!==null?null:o(v,g,""+w,S);if(typeof w=="object"&&w!==null){switch(w.$$typeof){case Is:return w.key===E?l(v,g,w,S):null;case Ei:return w.key===E?c(v,g,w,S):null;case qr:return E=w._init,f(v,g,E(w._payload),S)}if(Pa(w)||ma(w))return E!==null?null:d(v,g,w,S,null);Ws(v,w)}return null}function p(v,g,w,S,E){if(typeof S=="string"&&S!==""||typeof S=="number")return v=v.get(w)||null,o(g,v,""+S,E);if(typeof S=="object"&&S!==null){switch(S.$$typeof){case Is:return v=v.get(S.key===null?w:S.key)||null,l(g,v,S,E);case Ei:return v=v.get(S.key===null?w:S.key)||null,c(g,v,S,E);case qr:var k=S._init;return p(v,g,w,k(S._payload),E)}if(Pa(S)||ma(S))return v=v.get(w)||null,d(g,v,S,E,null);Ws(g,S)}return null}function y(v,g,w,S){for(var E=null,k=null,C=g,N=g=0,$=null;C!==null&&N<w.length;N++){C.index>N?($=C,C=null):$=C.sibling;var B=f(v,C,w[N],S);if(B===null){C===null&&(C=$);break}t&&C&&B.alternate===null&&e(v,C),g=a(B,g,N),k===null?E=B:k.sibling=B,k=B,C=$}if(N===w.length)return r(v,C),tt&&En(v,N),E;if(C===null){for(;N<w.length;N++)C=h(v,w[N],S),C!==null&&(g=a(C,g,N),k===null?E=C:k.sibling=C,k=C);return tt&&En(v,N),E}for(C=n(v,C);N<w.length;N++)$=p(C,v,N,w[N],S),$!==null&&(t&&$.alternate!==null&&C.delete($.key===null?N:$.key),g=a($,g,N),k===null?E=$:k.sibling=$,k=$);return t&&C.forEach(function(q){return e(v,q)}),tt&&En(v,N),E}function m(v,g,w,S){var E=ma(w);if(typeof E!="function")throw Error(re(150));if(w=E.call(w),w==null)throw Error(re(151));for(var k=E=null,C=g,N=g=0,$=null,B=w.next();C!==null&&!B.done;N++,B=w.next()){C.index>N?($=C,C=null):$=C.sibling;var q=f(v,C,B.value,S);if(q===null){C===null&&(C=$);break}t&&C&&q.alternate===null&&e(v,C),g=a(q,g,N),k===null?E=q:k.sibling=q,k=q,C=$}if(B.done)return r(v,C),tt&&En(v,N),E;if(C===null){for(;!B.done;N++,B=w.next())B=h(v,B.value,S),B!==null&&(g=a(B,g,N),k===null?E=B:k.sibling=B,k=B);return tt&&En(v,N),E}for(C=n(v,C);!B.done;N++,B=w.next())B=p(C,v,N,B.value,S),B!==null&&(t&&B.alternate!==null&&C.delete(B.key===null?N:B.key),g=a(B,g,N),k===null?E=B:k.sibling=B,k=B);return t&&C.forEach(function(P){return e(v,P)}),tt&&En(v,N),E}function b(v,g,w,S){if(typeof w=="object"&&w!==null&&w.type===ji&&w.key===null&&(w=w.props.children),typeof w=="object"&&w!==null){switch(w.$$typeof){case Is:e:{for(var E=w.key,k=g;k!==null;){if(k.key===E){if(E=w.type,E===ji){if(k.tag===7){r(v,k.sibling),g=i(k,w.props.children),g.return=v,v=g;break e}}else if(k.elementType===E||typeof E=="object"&&E!==null&&E.$$typeof===qr&&Qf(E)===k.type){r(v,k.sibling),g=i(k,w.props),g.ref=xa(v,k,w),g.return=v,v=g;break e}r(v,k);break}else e(v,k);k=k.sibling}w.type===ji?(g=Dn(w.props.children,v.mode,S,w.key),g.return=v,v=g):(S=So(w.type,w.key,w.props,null,v.mode,S),S.ref=xa(v,g,w),S.return=v,v=S)}return s(v);case Ei:e:{for(k=w.key;g!==null;){if(g.key===k)if(g.tag===4&&g.stateNode.containerInfo===w.containerInfo&&g.stateNode.implementation===w.implementation){r(v,g.sibling),g=i(g,w.children||[]),g.return=v,v=g;break e}else{r(v,g);break}else e(v,g);g=g.sibling}g=bc(w,v.mode,S),g.return=v,v=g}return s(v);case qr:return k=w._init,b(v,g,k(w._payload),S)}if(Pa(w))return y(v,g,w,S);if(ma(w))return m(v,g,w,S);Ws(v,w)}return typeof w=="string"&&w!==""||typeof w=="number"?(w=""+w,g!==null&&g.tag===6?(r(v,g.sibling),g=i(g,w),g.return=v,v=g):(r(v,g),g=yc(w,v.mode,S),g.return=v,v=g),s(v)):r(v,g)}return b}var Ki=nv(!0),iv=nv(!1),zo=yn(null),Lo=null,Ai=null,Od=null;function Pd(){Od=Ai=Lo=null}function Nd(t){var e=zo.current;Qe(zo),t._currentValue=e}function vu(t,e,r){for(;t!==null;){var n=t.alternate;if((t.childLanes&e)!==e?(t.childLanes|=e,n!==null&&(n.childLanes|=e)):n!==null&&(n.childLanes&e)!==e&&(n.childLanes|=e),t===r)break;t=t.return}}function Bi(t,e){Lo=t,Od=Ai=null,t=t.dependencies,t!==null&&t.firstContext!==null&&(t.lanes&e&&(At=!0),t.firstContext=null)}function nr(t){var e=t._currentValue;if(Od!==t)if(t={context:t,memoizedValue:e,next:null},Ai===null){if(Lo===null)throw Error(re(308));Ai=t,Lo.dependencies={lanes:0,firstContext:t}}else Ai=Ai.next=t;return e}var $n=null;function $d(t){$n===null?$n=[t]:$n.push(t)}function av(t,e,r,n){var i=e.interleaved;return i===null?(r.next=r,$d(e)):(r.next=i.next,i.next=r),e.interleaved=r,Lr(t,n)}function Lr(t,e){t.lanes|=e;var r=t.alternate;for(r!==null&&(r.lanes|=e),r=t,t=t.return;t!==null;)t.childLanes|=e,r=t.alternate,r!==null&&(r.childLanes|=e),r=t,t=t.return;return r.tag===3?r.stateNode:null}var Yr=!1;function Rd(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function sv(t,e){t=t.updateQueue,e.updateQueue===t&&(e.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,effects:t.effects})}function Dr(t,e){return{eventTime:t,lane:e,tag:0,payload:null,callback:null,next:null}}function cn(t,e,r){var n=t.updateQueue;if(n===null)return null;if(n=n.shared,Fe&2){var i=n.pending;return i===null?e.next=e:(e.next=i.next,i.next=e),n.pending=e,Lr(t,r)}return i=n.interleaved,i===null?(e.next=e,$d(n)):(e.next=i.next,i.next=e),n.interleaved=e,Lr(t,r)}function vo(t,e,r){if(e=e.updateQueue,e!==null&&(e=e.shared,(r&4194240)!==0)){var n=e.lanes;n&=t.pendingLanes,r|=n,e.lanes=r,yd(t,r)}}function ep(t,e){var r=t.updateQueue,n=t.alternate;if(n!==null&&(n=n.updateQueue,r===n)){var i=null,a=null;if(r=r.firstBaseUpdate,r!==null){do{var s={eventTime:r.eventTime,lane:r.lane,tag:r.tag,payload:r.payload,callback:r.callback,next:null};a===null?i=a=s:a=a.next=s,r=r.next}while(r!==null);a===null?i=a=e:a=a.next=e}else i=a=e;r={baseState:n.baseState,firstBaseUpdate:i,lastBaseUpdate:a,shared:n.shared,effects:n.effects},t.updateQueue=r;return}t=r.lastBaseUpdate,t===null?r.firstBaseUpdate=e:t.next=e,r.lastBaseUpdate=e}function Fo(t,e,r,n){var i=t.updateQueue;Yr=!1;var a=i.firstBaseUpdate,s=i.lastBaseUpdate,o=i.shared.pending;if(o!==null){i.shared.pending=null;var l=o,c=l.next;l.next=null,s===null?a=c:s.next=c,s=l;var d=t.alternate;d!==null&&(d=d.updateQueue,o=d.lastBaseUpdate,o!==s&&(o===null?d.firstBaseUpdate=c:o.next=c,d.lastBaseUpdate=l))}if(a!==null){var h=i.baseState;s=0,d=c=l=null,o=a;do{var f=o.lane,p=o.eventTime;if((n&f)===f){d!==null&&(d=d.next={eventTime:p,lane:0,tag:o.tag,payload:o.payload,callback:o.callback,next:null});e:{var y=t,m=o;switch(f=e,p=r,m.tag){case 1:if(y=m.payload,typeof y=="function"){h=y.call(p,h,f);break e}h=y;break e;case 3:y.flags=y.flags&-65537|128;case 0:if(y=m.payload,f=typeof y=="function"?y.call(p,h,f):y,f==null)break e;h=st({},h,f);break e;case 2:Yr=!0}}o.callback!==null&&o.lane!==0&&(t.flags|=64,f=i.effects,f===null?i.effects=[o]:f.push(o))}else p={eventTime:p,lane:f,tag:o.tag,payload:o.payload,callback:o.callback,next:null},d===null?(c=d=p,l=h):d=d.next=p,s|=f;if(o=o.next,o===null){if(o=i.shared.pending,o===null)break;f=o,o=f.next,f.next=null,i.lastBaseUpdate=f,i.shared.pending=null}}while(!0);if(d===null&&(l=h),i.baseState=l,i.firstBaseUpdate=c,i.lastBaseUpdate=d,e=i.shared.interleaved,e!==null){i=e;do s|=i.lane,i=i.next;while(i!==e)}else a===null&&(i.shared.lanes=0);Fn|=s,t.lanes=s,t.memoizedState=h}}function tp(t,e,r){if(t=e.effects,e.effects=null,t!==null)for(e=0;e<t.length;e++){var n=t[e],i=n.callback;if(i!==null){if(n.callback=null,n=r,typeof i!="function")throw Error(re(191,i));i.call(n)}}}var Ss={},Cr=yn(Ss),ls=yn(Ss),cs=yn(Ss);function Rn(t){if(t===Ss)throw Error(re(174));return t}function Ad(t,e){switch(Ye(cs,e),Ye(ls,t),Ye(Cr,Ss),t=e.nodeType,t){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:Xc(null,"");break;default:t=t===8?e.parentNode:e,e=t.namespaceURI||null,t=t.tagName,e=Xc(e,t)}Qe(Cr),Ye(Cr,e)}function qi(){Qe(Cr),Qe(ls),Qe(cs)}function ov(t){Rn(cs.current);var e=Rn(Cr.current),r=Xc(e,t.type);e!==r&&(Ye(ls,t),Ye(Cr,r))}function Id(t){ls.current===t&&(Qe(Cr),Qe(ls))}var it=yn(0);function Bo(t){for(var e=t;e!==null;){if(e.tag===13){var r=e.memoizedState;if(r!==null&&(r=r.dehydrated,r===null||r.data==="$?"||r.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var hc=[];function Dd(){for(var t=0;t<hc.length;t++)hc[t]._workInProgressVersionPrimary=null;hc.length=0}var yo=Br.ReactCurrentDispatcher,fc=Br.ReactCurrentBatchConfig,Ln=0,at=null,pt=null,mt=null,Uo=!1,Ua=!1,us=0,B1=0;function xt(){throw Error(re(321))}function Md(t,e){if(e===null)return!1;for(var r=0;r<e.length&&r<t.length;r++)if(!yr(t[r],e[r]))return!1;return!0}function zd(t,e,r,n,i,a){if(Ln=a,at=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,yo.current=t===null||t.memoizedState===null?V1:W1,t=r(n,i),Ua){a=0;do{if(Ua=!1,us=0,25<=a)throw Error(re(301));a+=1,mt=pt=null,e.updateQueue=null,yo.current=K1,t=r(n,i)}while(Ua)}if(yo.current=Ho,e=pt!==null&&pt.next!==null,Ln=0,mt=pt=at=null,Uo=!1,e)throw Error(re(300));return t}function Ld(){var t=us!==0;return us=0,t}function Sr(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return mt===null?at.memoizedState=mt=t:mt=mt.next=t,mt}function ir(){if(pt===null){var t=at.alternate;t=t!==null?t.memoizedState:null}else t=pt.next;var e=mt===null?at.memoizedState:mt.next;if(e!==null)mt=e,pt=t;else{if(t===null)throw Error(re(310));pt=t,t={memoizedState:pt.memoizedState,baseState:pt.baseState,baseQueue:pt.baseQueue,queue:pt.queue,next:null},mt===null?at.memoizedState=mt=t:mt=mt.next=t}return mt}function ds(t,e){return typeof e=="function"?e(t):e}function pc(t){var e=ir(),r=e.queue;if(r===null)throw Error(re(311));r.lastRenderedReducer=t;var n=pt,i=n.baseQueue,a=r.pending;if(a!==null){if(i!==null){var s=i.next;i.next=a.next,a.next=s}n.baseQueue=i=a,r.pending=null}if(i!==null){a=i.next,n=n.baseState;var o=s=null,l=null,c=a;do{var d=c.lane;if((Ln&d)===d)l!==null&&(l=l.next={lane:0,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null}),n=c.hasEagerState?c.eagerState:t(n,c.action);else{var h={lane:d,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null};l===null?(o=l=h,s=n):l=l.next=h,at.lanes|=d,Fn|=d}c=c.next}while(c!==null&&c!==a);l===null?s=n:l.next=o,yr(n,e.memoizedState)||(At=!0),e.memoizedState=n,e.baseState=s,e.baseQueue=l,r.lastRenderedState=n}if(t=r.interleaved,t!==null){i=t;do a=i.lane,at.lanes|=a,Fn|=a,i=i.next;while(i!==t)}else i===null&&(r.lanes=0);return[e.memoizedState,r.dispatch]}function gc(t){var e=ir(),r=e.queue;if(r===null)throw Error(re(311));r.lastRenderedReducer=t;var n=r.dispatch,i=r.pending,a=e.memoizedState;if(i!==null){r.pending=null;var s=i=i.next;do a=t(a,s.action),s=s.next;while(s!==i);yr(a,e.memoizedState)||(At=!0),e.memoizedState=a,e.baseQueue===null&&(e.baseState=a),r.lastRenderedState=a}return[a,n]}function lv(){}function cv(t,e){var r=at,n=ir(),i=e(),a=!yr(n.memoizedState,i);if(a&&(n.memoizedState=i,At=!0),n=n.queue,Fd(hv.bind(null,r,n,t),[t]),n.getSnapshot!==e||a||mt!==null&&mt.memoizedState.tag&1){if(r.flags|=2048,hs(9,dv.bind(null,r,n,i,e),void 0,null),vt===null)throw Error(re(349));Ln&30||uv(r,e,i)}return i}function uv(t,e,r){t.flags|=16384,t={getSnapshot:e,value:r},e=at.updateQueue,e===null?(e={lastEffect:null,stores:null},at.updateQueue=e,e.stores=[t]):(r=e.stores,r===null?e.stores=[t]:r.push(t))}function dv(t,e,r,n){e.value=r,e.getSnapshot=n,fv(e)&&pv(t)}function hv(t,e,r){return r(function(){fv(e)&&pv(t)})}function fv(t){var e=t.getSnapshot;t=t.value;try{var r=e();return!yr(t,r)}catch{return!0}}function pv(t){var e=Lr(t,1);e!==null&&vr(e,t,1,-1)}function rp(t){var e=Sr();return typeof t=="function"&&(t=t()),e.memoizedState=e.baseState=t,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:ds,lastRenderedState:t},e.queue=t,t=t.dispatch=G1.bind(null,at,t),[e.memoizedState,t]}function hs(t,e,r,n){return t={tag:t,create:e,destroy:r,deps:n,next:null},e=at.updateQueue,e===null?(e={lastEffect:null,stores:null},at.updateQueue=e,e.lastEffect=t.next=t):(r=e.lastEffect,r===null?e.lastEffect=t.next=t:(n=r.next,r.next=t,t.next=n,e.lastEffect=t)),t}function gv(){return ir().memoizedState}function bo(t,e,r,n){var i=Sr();at.flags|=t,i.memoizedState=hs(1|e,r,void 0,n===void 0?null:n)}function vl(t,e,r,n){var i=ir();n=n===void 0?null:n;var a=void 0;if(pt!==null){var s=pt.memoizedState;if(a=s.destroy,n!==null&&Md(n,s.deps)){i.memoizedState=hs(e,r,a,n);return}}at.flags|=t,i.memoizedState=hs(1|e,r,a,n)}function np(t,e){return bo(8390656,8,t,e)}function Fd(t,e){return vl(2048,8,t,e)}function mv(t,e){return vl(4,2,t,e)}function vv(t,e){return vl(4,4,t,e)}function yv(t,e){if(typeof e=="function")return t=t(),e(t),function(){e(null)};if(e!=null)return t=t(),e.current=t,function(){e.current=null}}function bv(t,e,r){return r=r!=null?r.concat([t]):null,vl(4,4,yv.bind(null,e,t),r)}function Bd(){}function wv(t,e){var r=ir();e=e===void 0?null:e;var n=r.memoizedState;return n!==null&&e!==null&&Md(e,n[1])?n[0]:(r.memoizedState=[t,e],t)}function xv(t,e){var r=ir();e=e===void 0?null:e;var n=r.memoizedState;return n!==null&&e!==null&&Md(e,n[1])?n[0]:(t=t(),r.memoizedState=[t,e],t)}function _v(t,e,r){return Ln&21?(yr(r,e)||(r=C0(),at.lanes|=r,Fn|=r,t.baseState=!0),e):(t.baseState&&(t.baseState=!1,At=!0),t.memoizedState=r)}function U1(t,e){var r=Ve;Ve=r!==0&&4>r?r:4,t(!0);var n=fc.transition;fc.transition={};try{t(!1),e()}finally{Ve=r,fc.transition=n}}function Sv(){return ir().memoizedState}function H1(t,e,r){var n=dn(t);if(r={lane:n,action:r,hasEagerState:!1,eagerState:null,next:null},kv(t))Ev(e,r);else if(r=av(t,e,r,n),r!==null){var i=Tt();vr(r,t,n,i),jv(r,e,n)}}function G1(t,e,r){var n=dn(t),i={lane:n,action:r,hasEagerState:!1,eagerState:null,next:null};if(kv(t))Ev(e,i);else{var a=t.alternate;if(t.lanes===0&&(a===null||a.lanes===0)&&(a=e.lastRenderedReducer,a!==null))try{var s=e.lastRenderedState,o=a(s,r);if(i.hasEagerState=!0,i.eagerState=o,yr(o,s)){var l=e.interleaved;l===null?(i.next=i,$d(e)):(i.next=l.next,l.next=i),e.interleaved=i;return}}catch{}finally{}r=av(t,e,i,n),r!==null&&(i=Tt(),vr(r,t,n,i),jv(r,e,n))}}function kv(t){var e=t.alternate;return t===at||e!==null&&e===at}function Ev(t,e){Ua=Uo=!0;var r=t.pending;r===null?e.next=e:(e.next=r.next,r.next=e),t.pending=e}function jv(t,e,r){if(r&4194240){var n=e.lanes;n&=t.pendingLanes,r|=n,e.lanes=r,yd(t,r)}}var Ho={readContext:nr,useCallback:xt,useContext:xt,useEffect:xt,useImperativeHandle:xt,useInsertionEffect:xt,useLayoutEffect:xt,useMemo:xt,useReducer:xt,useRef:xt,useState:xt,useDebugValue:xt,useDeferredValue:xt,useTransition:xt,useMutableSource:xt,useSyncExternalStore:xt,useId:xt,unstable_isNewReconciler:!1},V1={readContext:nr,useCallback:function(t,e){return Sr().memoizedState=[t,e===void 0?null:e],t},useContext:nr,useEffect:np,useImperativeHandle:function(t,e,r){return r=r!=null?r.concat([t]):null,bo(4194308,4,yv.bind(null,e,t),r)},useLayoutEffect:function(t,e){return bo(4194308,4,t,e)},useInsertionEffect:function(t,e){return bo(4,2,t,e)},useMemo:function(t,e){var r=Sr();return e=e===void 0?null:e,t=t(),r.memoizedState=[t,e],t},useReducer:function(t,e,r){var n=Sr();return e=r!==void 0?r(e):e,n.memoizedState=n.baseState=e,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:e},n.queue=t,t=t.dispatch=H1.bind(null,at,t),[n.memoizedState,t]},useRef:function(t){var e=Sr();return t={current:t},e.memoizedState=t},useState:rp,useDebugValue:Bd,useDeferredValue:function(t){return Sr().memoizedState=t},useTransition:function(){var t=rp(!1),e=t[0];return t=U1.bind(null,t[1]),Sr().memoizedState=t,[e,t]},useMutableSource:function(){},useSyncExternalStore:function(t,e,r){var n=at,i=Sr();if(tt){if(r===void 0)throw Error(re(407));r=r()}else{if(r=e(),vt===null)throw Error(re(349));Ln&30||uv(n,e,r)}i.memoizedState=r;var a={value:r,getSnapshot:e};return i.queue=a,np(hv.bind(null,n,a,t),[t]),n.flags|=2048,hs(9,dv.bind(null,n,a,r,e),void 0,null),r},useId:function(){var t=Sr(),e=vt.identifierPrefix;if(tt){var r=Ir,n=Ar;r=(n&~(1<<32-mr(n)-1)).toString(32)+r,e=":"+e+"R"+r,r=us++,0<r&&(e+="H"+r.toString(32)),e+=":"}else r=B1++,e=":"+e+"r"+r.toString(32)+":";return t.memoizedState=e},unstable_isNewReconciler:!1},W1={readContext:nr,useCallback:wv,useContext:nr,useEffect:Fd,useImperativeHandle:bv,useInsertionEffect:mv,useLayoutEffect:vv,useMemo:xv,useReducer:pc,useRef:gv,useState:function(){return pc(ds)},useDebugValue:Bd,useDeferredValue:function(t){var e=ir();return _v(e,pt.memoizedState,t)},useTransition:function(){var t=pc(ds)[0],e=ir().memoizedState;return[t,e]},useMutableSource:lv,useSyncExternalStore:cv,useId:Sv,unstable_isNewReconciler:!1},K1={readContext:nr,useCallback:wv,useContext:nr,useEffect:Fd,useImperativeHandle:bv,useInsertionEffect:mv,useLayoutEffect:vv,useMemo:xv,useReducer:gc,useRef:gv,useState:function(){return gc(ds)},useDebugValue:Bd,useDeferredValue:function(t){var e=ir();return pt===null?e.memoizedState=t:_v(e,pt.memoizedState,t)},useTransition:function(){var t=gc(ds)[0],e=ir().memoizedState;return[t,e]},useMutableSource:lv,useSyncExternalStore:cv,useId:Sv,unstable_isNewReconciler:!1};function ur(t,e){if(t&&t.defaultProps){e=st({},e),t=t.defaultProps;for(var r in t)e[r]===void 0&&(e[r]=t[r]);return e}return e}function yu(t,e,r,n){e=t.memoizedState,r=r(n,e),r=r==null?e:st({},e,r),t.memoizedState=r,t.lanes===0&&(t.updateQueue.baseState=r)}var yl={isMounted:function(t){return(t=t._reactInternals)?Gn(t)===t:!1},enqueueSetState:function(t,e,r){t=t._reactInternals;var n=Tt(),i=dn(t),a=Dr(n,i);a.payload=e,r!=null&&(a.callback=r),e=cn(t,a,i),e!==null&&(vr(e,t,i,n),vo(e,t,i))},enqueueReplaceState:function(t,e,r){t=t._reactInternals;var n=Tt(),i=dn(t),a=Dr(n,i);a.tag=1,a.payload=e,r!=null&&(a.callback=r),e=cn(t,a,i),e!==null&&(vr(e,t,i,n),vo(e,t,i))},enqueueForceUpdate:function(t,e){t=t._reactInternals;var r=Tt(),n=dn(t),i=Dr(r,n);i.tag=2,e!=null&&(i.callback=e),e=cn(t,i,n),e!==null&&(vr(e,t,n,r),vo(e,t,n))}};function ip(t,e,r,n,i,a,s){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(n,a,s):e.prototype&&e.prototype.isPureReactComponent?!is(r,n)||!is(i,a):!0}function Cv(t,e,r){var n=!1,i=pn,a=e.contextType;return typeof a=="object"&&a!==null?a=nr(a):(i=Dt(e)?Mn:Et.current,n=e.contextTypes,a=(n=n!=null)?Vi(t,i):pn),e=new e(r,a),t.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=yl,t.stateNode=e,e._reactInternals=t,n&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=i,t.__reactInternalMemoizedMaskedChildContext=a),e}function ap(t,e,r,n){t=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(r,n),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(r,n),e.state!==t&&yl.enqueueReplaceState(e,e.state,null)}function bu(t,e,r,n){var i=t.stateNode;i.props=r,i.state=t.memoizedState,i.refs={},Rd(t);var a=e.contextType;typeof a=="object"&&a!==null?i.context=nr(a):(a=Dt(e)?Mn:Et.current,i.context=Vi(t,a)),i.state=t.memoizedState,a=e.getDerivedStateFromProps,typeof a=="function"&&(yu(t,e,a,r),i.state=t.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof i.getSnapshotBeforeUpdate=="function"||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(e=i.state,typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount(),e!==i.state&&yl.enqueueReplaceState(i,i.state,null),Fo(t,r,i,n),i.state=t.memoizedState),typeof i.componentDidMount=="function"&&(t.flags|=4194308)}function Yi(t,e){try{var r="",n=e;do r+=xx(n),n=n.return;while(n);var i=r}catch(a){i=`
Error generating stack: `+a.message+`
`+a.stack}return{value:t,source:e,stack:i,digest:null}}function mc(t,e,r){return{value:t,source:null,stack:r??null,digest:e??null}}function wu(t,e){try{console.error(e.value)}catch(r){setTimeout(function(){throw r})}}var q1=typeof WeakMap=="function"?WeakMap:Map;function Tv(t,e,r){r=Dr(-1,r),r.tag=3,r.payload={element:null};var n=e.value;return r.callback=function(){Vo||(Vo=!0,Pu=n),wu(t,e)},r}function Ov(t,e,r){r=Dr(-1,r),r.tag=3;var n=t.type.getDerivedStateFromError;if(typeof n=="function"){var i=e.value;r.payload=function(){return n(i)},r.callback=function(){wu(t,e)}}var a=t.stateNode;return a!==null&&typeof a.componentDidCatch=="function"&&(r.callback=function(){wu(t,e),typeof n!="function"&&(un===null?un=new Set([this]):un.add(this));var s=e.stack;this.componentDidCatch(e.value,{componentStack:s!==null?s:""})}),r}function sp(t,e,r){var n=t.pingCache;if(n===null){n=t.pingCache=new q1;var i=new Set;n.set(e,i)}else i=n.get(e),i===void 0&&(i=new Set,n.set(e,i));i.has(r)||(i.add(r),t=l_.bind(null,t,e,r),e.then(t,t))}function op(t){do{var e;if((e=t.tag===13)&&(e=t.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return t;t=t.return}while(t!==null);return null}function lp(t,e,r,n,i){return t.mode&1?(t.flags|=65536,t.lanes=i,t):(t===e?t.flags|=65536:(t.flags|=128,r.flags|=131072,r.flags&=-52805,r.tag===1&&(r.alternate===null?r.tag=17:(e=Dr(-1,1),e.tag=2,cn(r,e,1))),r.lanes|=1),t)}var Y1=Br.ReactCurrentOwner,At=!1;function jt(t,e,r,n){e.child=t===null?iv(e,null,r,n):Ki(e,t.child,r,n)}function cp(t,e,r,n,i){r=r.render;var a=e.ref;return Bi(e,i),n=zd(t,e,r,n,a,i),r=Ld(),t!==null&&!At?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~i,Fr(t,e,i)):(tt&&r&&jd(e),e.flags|=1,jt(t,e,n,i),e.child)}function up(t,e,r,n,i){if(t===null){var a=r.type;return typeof a=="function"&&!Yd(a)&&a.defaultProps===void 0&&r.compare===null&&r.defaultProps===void 0?(e.tag=15,e.type=a,Pv(t,e,a,n,i)):(t=So(r.type,null,n,e,e.mode,i),t.ref=e.ref,t.return=e,e.child=t)}if(a=t.child,!(t.lanes&i)){var s=a.memoizedProps;if(r=r.compare,r=r!==null?r:is,r(s,n)&&t.ref===e.ref)return Fr(t,e,i)}return e.flags|=1,t=hn(a,n),t.ref=e.ref,t.return=e,e.child=t}function Pv(t,e,r,n,i){if(t!==null){var a=t.memoizedProps;if(is(a,n)&&t.ref===e.ref)if(At=!1,e.pendingProps=n=a,(t.lanes&i)!==0)t.flags&131072&&(At=!0);else return e.lanes=t.lanes,Fr(t,e,i)}return xu(t,e,r,n,i)}function Nv(t,e,r){var n=e.pendingProps,i=n.children,a=t!==null?t.memoizedState:null;if(n.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},Ye(Di,Bt),Bt|=r;else{if(!(r&1073741824))return t=a!==null?a.baseLanes|r:r,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:t,cachePool:null,transitions:null},e.updateQueue=null,Ye(Di,Bt),Bt|=t,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},n=a!==null?a.baseLanes:r,Ye(Di,Bt),Bt|=n}else a!==null?(n=a.baseLanes|r,e.memoizedState=null):n=r,Ye(Di,Bt),Bt|=n;return jt(t,e,i,r),e.child}function $v(t,e){var r=e.ref;(t===null&&r!==null||t!==null&&t.ref!==r)&&(e.flags|=512,e.flags|=2097152)}function xu(t,e,r,n,i){var a=Dt(r)?Mn:Et.current;return a=Vi(e,a),Bi(e,i),r=zd(t,e,r,n,a,i),n=Ld(),t!==null&&!At?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~i,Fr(t,e,i)):(tt&&n&&jd(e),e.flags|=1,jt(t,e,r,i),e.child)}function dp(t,e,r,n,i){if(Dt(r)){var a=!0;Io(e)}else a=!1;if(Bi(e,i),e.stateNode===null)wo(t,e),Cv(e,r,n),bu(e,r,n,i),n=!0;else if(t===null){var s=e.stateNode,o=e.memoizedProps;s.props=o;var l=s.context,c=r.contextType;typeof c=="object"&&c!==null?c=nr(c):(c=Dt(r)?Mn:Et.current,c=Vi(e,c));var d=r.getDerivedStateFromProps,h=typeof d=="function"||typeof s.getSnapshotBeforeUpdate=="function";h||typeof s.UNSAFE_componentWillReceiveProps!="function"&&typeof s.componentWillReceiveProps!="function"||(o!==n||l!==c)&&ap(e,s,n,c),Yr=!1;var f=e.memoizedState;s.state=f,Fo(e,n,s,i),l=e.memoizedState,o!==n||f!==l||It.current||Yr?(typeof d=="function"&&(yu(e,r,d,n),l=e.memoizedState),(o=Yr||ip(e,r,o,n,f,l,c))?(h||typeof s.UNSAFE_componentWillMount!="function"&&typeof s.componentWillMount!="function"||(typeof s.componentWillMount=="function"&&s.componentWillMount(),typeof s.UNSAFE_componentWillMount=="function"&&s.UNSAFE_componentWillMount()),typeof s.componentDidMount=="function"&&(e.flags|=4194308)):(typeof s.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=n,e.memoizedState=l),s.props=n,s.state=l,s.context=c,n=o):(typeof s.componentDidMount=="function"&&(e.flags|=4194308),n=!1)}else{s=e.stateNode,sv(t,e),o=e.memoizedProps,c=e.type===e.elementType?o:ur(e.type,o),s.props=c,h=e.pendingProps,f=s.context,l=r.contextType,typeof l=="object"&&l!==null?l=nr(l):(l=Dt(r)?Mn:Et.current,l=Vi(e,l));var p=r.getDerivedStateFromProps;(d=typeof p=="function"||typeof s.getSnapshotBeforeUpdate=="function")||typeof s.UNSAFE_componentWillReceiveProps!="function"&&typeof s.componentWillReceiveProps!="function"||(o!==h||f!==l)&&ap(e,s,n,l),Yr=!1,f=e.memoizedState,s.state=f,Fo(e,n,s,i);var y=e.memoizedState;o!==h||f!==y||It.current||Yr?(typeof p=="function"&&(yu(e,r,p,n),y=e.memoizedState),(c=Yr||ip(e,r,c,n,f,y,l)||!1)?(d||typeof s.UNSAFE_componentWillUpdate!="function"&&typeof s.componentWillUpdate!="function"||(typeof s.componentWillUpdate=="function"&&s.componentWillUpdate(n,y,l),typeof s.UNSAFE_componentWillUpdate=="function"&&s.UNSAFE_componentWillUpdate(n,y,l)),typeof s.componentDidUpdate=="function"&&(e.flags|=4),typeof s.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof s.componentDidUpdate!="function"||o===t.memoizedProps&&f===t.memoizedState||(e.flags|=4),typeof s.getSnapshotBeforeUpdate!="function"||o===t.memoizedProps&&f===t.memoizedState||(e.flags|=1024),e.memoizedProps=n,e.memoizedState=y),s.props=n,s.state=y,s.context=l,n=c):(typeof s.componentDidUpdate!="function"||o===t.memoizedProps&&f===t.memoizedState||(e.flags|=4),typeof s.getSnapshotBeforeUpdate!="function"||o===t.memoizedProps&&f===t.memoizedState||(e.flags|=1024),n=!1)}return _u(t,e,r,n,a,i)}function _u(t,e,r,n,i,a){$v(t,e);var s=(e.flags&128)!==0;if(!n&&!s)return i&&Jf(e,r,!1),Fr(t,e,a);n=e.stateNode,Y1.current=e;var o=s&&typeof r.getDerivedStateFromError!="function"?null:n.render();return e.flags|=1,t!==null&&s?(e.child=Ki(e,t.child,null,a),e.child=Ki(e,null,o,a)):jt(t,e,o,a),e.memoizedState=n.state,i&&Jf(e,r,!0),e.child}function Rv(t){var e=t.stateNode;e.pendingContext?Yf(t,e.pendingContext,e.pendingContext!==e.context):e.context&&Yf(t,e.context,!1),Ad(t,e.containerInfo)}function hp(t,e,r,n,i){return Wi(),Td(i),e.flags|=256,jt(t,e,r,n),e.child}var Su={dehydrated:null,treeContext:null,retryLane:0};function ku(t){return{baseLanes:t,cachePool:null,transitions:null}}function Av(t,e,r){var n=e.pendingProps,i=it.current,a=!1,s=(e.flags&128)!==0,o;if((o=s)||(o=t!==null&&t.memoizedState===null?!1:(i&2)!==0),o?(a=!0,e.flags&=-129):(t===null||t.memoizedState!==null)&&(i|=1),Ye(it,i&1),t===null)return mu(e),t=e.memoizedState,t!==null&&(t=t.dehydrated,t!==null)?(e.mode&1?t.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(s=n.children,t=n.fallback,a?(n=e.mode,a=e.child,s={mode:"hidden",children:s},!(n&1)&&a!==null?(a.childLanes=0,a.pendingProps=s):a=xl(s,n,0,null),t=Dn(t,n,r,null),a.return=e,t.return=e,a.sibling=t,e.child=a,e.child.memoizedState=ku(r),e.memoizedState=Su,t):Ud(e,s));if(i=t.memoizedState,i!==null&&(o=i.dehydrated,o!==null))return J1(t,e,s,n,o,i,r);if(a){a=n.fallback,s=e.mode,i=t.child,o=i.sibling;var l={mode:"hidden",children:n.children};return!(s&1)&&e.child!==i?(n=e.child,n.childLanes=0,n.pendingProps=l,e.deletions=null):(n=hn(i,l),n.subtreeFlags=i.subtreeFlags&14680064),o!==null?a=hn(o,a):(a=Dn(a,s,r,null),a.flags|=2),a.return=e,n.return=e,n.sibling=a,e.child=n,n=a,a=e.child,s=t.child.memoizedState,s=s===null?ku(r):{baseLanes:s.baseLanes|r,cachePool:null,transitions:s.transitions},a.memoizedState=s,a.childLanes=t.childLanes&~r,e.memoizedState=Su,n}return a=t.child,t=a.sibling,n=hn(a,{mode:"visible",children:n.children}),!(e.mode&1)&&(n.lanes=r),n.return=e,n.sibling=null,t!==null&&(r=e.deletions,r===null?(e.deletions=[t],e.flags|=16):r.push(t)),e.child=n,e.memoizedState=null,n}function Ud(t,e){return e=xl({mode:"visible",children:e},t.mode,0,null),e.return=t,t.child=e}function Ks(t,e,r,n){return n!==null&&Td(n),Ki(e,t.child,null,r),t=Ud(e,e.pendingProps.children),t.flags|=2,e.memoizedState=null,t}function J1(t,e,r,n,i,a,s){if(r)return e.flags&256?(e.flags&=-257,n=mc(Error(re(422))),Ks(t,e,s,n)):e.memoizedState!==null?(e.child=t.child,e.flags|=128,null):(a=n.fallback,i=e.mode,n=xl({mode:"visible",children:n.children},i,0,null),a=Dn(a,i,s,null),a.flags|=2,n.return=e,a.return=e,n.sibling=a,e.child=n,e.mode&1&&Ki(e,t.child,null,s),e.child.memoizedState=ku(s),e.memoizedState=Su,a);if(!(e.mode&1))return Ks(t,e,s,null);if(i.data==="$!"){if(n=i.nextSibling&&i.nextSibling.dataset,n)var o=n.dgst;return n=o,a=Error(re(419)),n=mc(a,n,void 0),Ks(t,e,s,n)}if(o=(s&t.childLanes)!==0,At||o){if(n=vt,n!==null){switch(s&-s){case 4:i=2;break;case 16:i=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:i=32;break;case 536870912:i=268435456;break;default:i=0}i=i&(n.suspendedLanes|s)?0:i,i!==0&&i!==a.retryLane&&(a.retryLane=i,Lr(t,i),vr(n,t,i,-1))}return qd(),n=mc(Error(re(421))),Ks(t,e,s,n)}return i.data==="$?"?(e.flags|=128,e.child=t.child,e=c_.bind(null,t),i._reactRetry=e,null):(t=a.treeContext,Gt=ln(i.nextSibling),Kt=e,tt=!0,pr=null,t!==null&&(Zt[Qt++]=Ar,Zt[Qt++]=Ir,Zt[Qt++]=zn,Ar=t.id,Ir=t.overflow,zn=e),e=Ud(e,n.children),e.flags|=4096,e)}function fp(t,e,r){t.lanes|=e;var n=t.alternate;n!==null&&(n.lanes|=e),vu(t.return,e,r)}function vc(t,e,r,n,i){var a=t.memoizedState;a===null?t.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:n,tail:r,tailMode:i}:(a.isBackwards=e,a.rendering=null,a.renderingStartTime=0,a.last=n,a.tail=r,a.tailMode=i)}function Iv(t,e,r){var n=e.pendingProps,i=n.revealOrder,a=n.tail;if(jt(t,e,n.children,r),n=it.current,n&2)n=n&1|2,e.flags|=128;else{if(t!==null&&t.flags&128)e:for(t=e.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&fp(t,r,e);else if(t.tag===19)fp(t,r,e);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}n&=1}if(Ye(it,n),!(e.mode&1))e.memoizedState=null;else switch(i){case"forwards":for(r=e.child,i=null;r!==null;)t=r.alternate,t!==null&&Bo(t)===null&&(i=r),r=r.sibling;r=i,r===null?(i=e.child,e.child=null):(i=r.sibling,r.sibling=null),vc(e,!1,i,r,a);break;case"backwards":for(r=null,i=e.child,e.child=null;i!==null;){if(t=i.alternate,t!==null&&Bo(t)===null){e.child=i;break}t=i.sibling,i.sibling=r,r=i,i=t}vc(e,!0,r,null,a);break;case"together":vc(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function wo(t,e){!(e.mode&1)&&t!==null&&(t.alternate=null,e.alternate=null,e.flags|=2)}function Fr(t,e,r){if(t!==null&&(e.dependencies=t.dependencies),Fn|=e.lanes,!(r&e.childLanes))return null;if(t!==null&&e.child!==t.child)throw Error(re(153));if(e.child!==null){for(t=e.child,r=hn(t,t.pendingProps),e.child=r,r.return=e;t.sibling!==null;)t=t.sibling,r=r.sibling=hn(t,t.pendingProps),r.return=e;r.sibling=null}return e.child}function X1(t,e,r){switch(e.tag){case 3:Rv(e),Wi();break;case 5:ov(e);break;case 1:Dt(e.type)&&Io(e);break;case 4:Ad(e,e.stateNode.containerInfo);break;case 10:var n=e.type._context,i=e.memoizedProps.value;Ye(zo,n._currentValue),n._currentValue=i;break;case 13:if(n=e.memoizedState,n!==null)return n.dehydrated!==null?(Ye(it,it.current&1),e.flags|=128,null):r&e.child.childLanes?Av(t,e,r):(Ye(it,it.current&1),t=Fr(t,e,r),t!==null?t.sibling:null);Ye(it,it.current&1);break;case 19:if(n=(r&e.childLanes)!==0,t.flags&128){if(n)return Iv(t,e,r);e.flags|=128}if(i=e.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),Ye(it,it.current),n)break;return null;case 22:case 23:return e.lanes=0,Nv(t,e,r)}return Fr(t,e,r)}var Dv,Eu,Mv,zv;Dv=function(t,e){for(var r=e.child;r!==null;){if(r.tag===5||r.tag===6)t.appendChild(r.stateNode);else if(r.tag!==4&&r.child!==null){r.child.return=r,r=r.child;continue}if(r===e)break;for(;r.sibling===null;){if(r.return===null||r.return===e)return;r=r.return}r.sibling.return=r.return,r=r.sibling}};Eu=function(){};Mv=function(t,e,r,n){var i=t.memoizedProps;if(i!==n){t=e.stateNode,Rn(Cr.current);var a=null;switch(r){case"input":i=Kc(t,i),n=Kc(t,n),a=[];break;case"select":i=st({},i,{value:void 0}),n=st({},n,{value:void 0}),a=[];break;case"textarea":i=Jc(t,i),n=Jc(t,n),a=[];break;default:typeof i.onClick!="function"&&typeof n.onClick=="function"&&(t.onclick=Ro)}Zc(r,n);var s;r=null;for(c in i)if(!n.hasOwnProperty(c)&&i.hasOwnProperty(c)&&i[c]!=null)if(c==="style"){var o=i[c];for(s in o)o.hasOwnProperty(s)&&(r||(r={}),r[s]="")}else c!=="dangerouslySetInnerHTML"&&c!=="children"&&c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&c!=="autoFocus"&&(Xa.hasOwnProperty(c)?a||(a=[]):(a=a||[]).push(c,null));for(c in n){var l=n[c];if(o=i!=null?i[c]:void 0,n.hasOwnProperty(c)&&l!==o&&(l!=null||o!=null))if(c==="style")if(o){for(s in o)!o.hasOwnProperty(s)||l&&l.hasOwnProperty(s)||(r||(r={}),r[s]="");for(s in l)l.hasOwnProperty(s)&&o[s]!==l[s]&&(r||(r={}),r[s]=l[s])}else r||(a||(a=[]),a.push(c,r)),r=l;else c==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,o=o?o.__html:void 0,l!=null&&o!==l&&(a=a||[]).push(c,l)):c==="children"?typeof l!="string"&&typeof l!="number"||(a=a||[]).push(c,""+l):c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&(Xa.hasOwnProperty(c)?(l!=null&&c==="onScroll"&&Je("scroll",t),a||o===l||(a=[])):(a=a||[]).push(c,l))}r&&(a=a||[]).push("style",r);var c=a;(e.updateQueue=c)&&(e.flags|=4)}};zv=function(t,e,r,n){r!==n&&(e.flags|=4)};function _a(t,e){if(!tt)switch(t.tailMode){case"hidden":e=t.tail;for(var r=null;e!==null;)e.alternate!==null&&(r=e),e=e.sibling;r===null?t.tail=null:r.sibling=null;break;case"collapsed":r=t.tail;for(var n=null;r!==null;)r.alternate!==null&&(n=r),r=r.sibling;n===null?e||t.tail===null?t.tail=null:t.tail.sibling=null:n.sibling=null}}function _t(t){var e=t.alternate!==null&&t.alternate.child===t.child,r=0,n=0;if(e)for(var i=t.child;i!==null;)r|=i.lanes|i.childLanes,n|=i.subtreeFlags&14680064,n|=i.flags&14680064,i.return=t,i=i.sibling;else for(i=t.child;i!==null;)r|=i.lanes|i.childLanes,n|=i.subtreeFlags,n|=i.flags,i.return=t,i=i.sibling;return t.subtreeFlags|=n,t.childLanes=r,e}function Z1(t,e,r){var n=e.pendingProps;switch(Cd(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return _t(e),null;case 1:return Dt(e.type)&&Ao(),_t(e),null;case 3:return n=e.stateNode,qi(),Qe(It),Qe(Et),Dd(),n.pendingContext&&(n.context=n.pendingContext,n.pendingContext=null),(t===null||t.child===null)&&(Vs(e)?e.flags|=4:t===null||t.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,pr!==null&&(Ru(pr),pr=null))),Eu(t,e),_t(e),null;case 5:Id(e);var i=Rn(cs.current);if(r=e.type,t!==null&&e.stateNode!=null)Mv(t,e,r,n,i),t.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!n){if(e.stateNode===null)throw Error(re(166));return _t(e),null}if(t=Rn(Cr.current),Vs(e)){n=e.stateNode,r=e.type;var a=e.memoizedProps;switch(n[kr]=e,n[os]=a,t=(e.mode&1)!==0,r){case"dialog":Je("cancel",n),Je("close",n);break;case"iframe":case"object":case"embed":Je("load",n);break;case"video":case"audio":for(i=0;i<$a.length;i++)Je($a[i],n);break;case"source":Je("error",n);break;case"img":case"image":case"link":Je("error",n),Je("load",n);break;case"details":Je("toggle",n);break;case"input":_f(n,a),Je("invalid",n);break;case"select":n._wrapperState={wasMultiple:!!a.multiple},Je("invalid",n);break;case"textarea":kf(n,a),Je("invalid",n)}Zc(r,a),i=null;for(var s in a)if(a.hasOwnProperty(s)){var o=a[s];s==="children"?typeof o=="string"?n.textContent!==o&&(a.suppressHydrationWarning!==!0&&Gs(n.textContent,o,t),i=["children",o]):typeof o=="number"&&n.textContent!==""+o&&(a.suppressHydrationWarning!==!0&&Gs(n.textContent,o,t),i=["children",""+o]):Xa.hasOwnProperty(s)&&o!=null&&s==="onScroll"&&Je("scroll",n)}switch(r){case"input":Ds(n),Sf(n,a,!0);break;case"textarea":Ds(n),Ef(n);break;case"select":case"option":break;default:typeof a.onClick=="function"&&(n.onclick=Ro)}n=i,e.updateQueue=n,n!==null&&(e.flags|=4)}else{s=i.nodeType===9?i:i.ownerDocument,t==="http://www.w3.org/1999/xhtml"&&(t=h0(r)),t==="http://www.w3.org/1999/xhtml"?r==="script"?(t=s.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild)):typeof n.is=="string"?t=s.createElement(r,{is:n.is}):(t=s.createElement(r),r==="select"&&(s=t,n.multiple?s.multiple=!0:n.size&&(s.size=n.size))):t=s.createElementNS(t,r),t[kr]=e,t[os]=n,Dv(t,e,!1,!1),e.stateNode=t;e:{switch(s=Qc(r,n),r){case"dialog":Je("cancel",t),Je("close",t),i=n;break;case"iframe":case"object":case"embed":Je("load",t),i=n;break;case"video":case"audio":for(i=0;i<$a.length;i++)Je($a[i],t);i=n;break;case"source":Je("error",t),i=n;break;case"img":case"image":case"link":Je("error",t),Je("load",t),i=n;break;case"details":Je("toggle",t),i=n;break;case"input":_f(t,n),i=Kc(t,n),Je("invalid",t);break;case"option":i=n;break;case"select":t._wrapperState={wasMultiple:!!n.multiple},i=st({},n,{value:void 0}),Je("invalid",t);break;case"textarea":kf(t,n),i=Jc(t,n),Je("invalid",t);break;default:i=n}Zc(r,i),o=i;for(a in o)if(o.hasOwnProperty(a)){var l=o[a];a==="style"?g0(t,l):a==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,l!=null&&f0(t,l)):a==="children"?typeof l=="string"?(r!=="textarea"||l!=="")&&Za(t,l):typeof l=="number"&&Za(t,""+l):a!=="suppressContentEditableWarning"&&a!=="suppressHydrationWarning"&&a!=="autoFocus"&&(Xa.hasOwnProperty(a)?l!=null&&a==="onScroll"&&Je("scroll",t):l!=null&&hd(t,a,l,s))}switch(r){case"input":Ds(t),Sf(t,n,!1);break;case"textarea":Ds(t),Ef(t);break;case"option":n.value!=null&&t.setAttribute("value",""+fn(n.value));break;case"select":t.multiple=!!n.multiple,a=n.value,a!=null?Mi(t,!!n.multiple,a,!1):n.defaultValue!=null&&Mi(t,!!n.multiple,n.defaultValue,!0);break;default:typeof i.onClick=="function"&&(t.onclick=Ro)}switch(r){case"button":case"input":case"select":case"textarea":n=!!n.autoFocus;break e;case"img":n=!0;break e;default:n=!1}}n&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return _t(e),null;case 6:if(t&&e.stateNode!=null)zv(t,e,t.memoizedProps,n);else{if(typeof n!="string"&&e.stateNode===null)throw Error(re(166));if(r=Rn(cs.current),Rn(Cr.current),Vs(e)){if(n=e.stateNode,r=e.memoizedProps,n[kr]=e,(a=n.nodeValue!==r)&&(t=Kt,t!==null))switch(t.tag){case 3:Gs(n.nodeValue,r,(t.mode&1)!==0);break;case 5:t.memoizedProps.suppressHydrationWarning!==!0&&Gs(n.nodeValue,r,(t.mode&1)!==0)}a&&(e.flags|=4)}else n=(r.nodeType===9?r:r.ownerDocument).createTextNode(n),n[kr]=e,e.stateNode=n}return _t(e),null;case 13:if(Qe(it),n=e.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(tt&&Gt!==null&&e.mode&1&&!(e.flags&128))rv(),Wi(),e.flags|=98560,a=!1;else if(a=Vs(e),n!==null&&n.dehydrated!==null){if(t===null){if(!a)throw Error(re(318));if(a=e.memoizedState,a=a!==null?a.dehydrated:null,!a)throw Error(re(317));a[kr]=e}else Wi(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;_t(e),a=!1}else pr!==null&&(Ru(pr),pr=null),a=!0;if(!a)return e.flags&65536?e:null}return e.flags&128?(e.lanes=r,e):(n=n!==null,n!==(t!==null&&t.memoizedState!==null)&&n&&(e.child.flags|=8192,e.mode&1&&(t===null||it.current&1?gt===0&&(gt=3):qd())),e.updateQueue!==null&&(e.flags|=4),_t(e),null);case 4:return qi(),Eu(t,e),t===null&&as(e.stateNode.containerInfo),_t(e),null;case 10:return Nd(e.type._context),_t(e),null;case 17:return Dt(e.type)&&Ao(),_t(e),null;case 19:if(Qe(it),a=e.memoizedState,a===null)return _t(e),null;if(n=(e.flags&128)!==0,s=a.rendering,s===null)if(n)_a(a,!1);else{if(gt!==0||t!==null&&t.flags&128)for(t=e.child;t!==null;){if(s=Bo(t),s!==null){for(e.flags|=128,_a(a,!1),n=s.updateQueue,n!==null&&(e.updateQueue=n,e.flags|=4),e.subtreeFlags=0,n=r,r=e.child;r!==null;)a=r,t=n,a.flags&=14680066,s=a.alternate,s===null?(a.childLanes=0,a.lanes=t,a.child=null,a.subtreeFlags=0,a.memoizedProps=null,a.memoizedState=null,a.updateQueue=null,a.dependencies=null,a.stateNode=null):(a.childLanes=s.childLanes,a.lanes=s.lanes,a.child=s.child,a.subtreeFlags=0,a.deletions=null,a.memoizedProps=s.memoizedProps,a.memoizedState=s.memoizedState,a.updateQueue=s.updateQueue,a.type=s.type,t=s.dependencies,a.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),r=r.sibling;return Ye(it,it.current&1|2),e.child}t=t.sibling}a.tail!==null&&ct()>Ji&&(e.flags|=128,n=!0,_a(a,!1),e.lanes=4194304)}else{if(!n)if(t=Bo(s),t!==null){if(e.flags|=128,n=!0,r=t.updateQueue,r!==null&&(e.updateQueue=r,e.flags|=4),_a(a,!0),a.tail===null&&a.tailMode==="hidden"&&!s.alternate&&!tt)return _t(e),null}else 2*ct()-a.renderingStartTime>Ji&&r!==1073741824&&(e.flags|=128,n=!0,_a(a,!1),e.lanes=4194304);a.isBackwards?(s.sibling=e.child,e.child=s):(r=a.last,r!==null?r.sibling=s:e.child=s,a.last=s)}return a.tail!==null?(e=a.tail,a.rendering=e,a.tail=e.sibling,a.renderingStartTime=ct(),e.sibling=null,r=it.current,Ye(it,n?r&1|2:r&1),e):(_t(e),null);case 22:case 23:return Kd(),n=e.memoizedState!==null,t!==null&&t.memoizedState!==null!==n&&(e.flags|=8192),n&&e.mode&1?Bt&1073741824&&(_t(e),e.subtreeFlags&6&&(e.flags|=8192)):_t(e),null;case 24:return null;case 25:return null}throw Error(re(156,e.tag))}function Q1(t,e){switch(Cd(e),e.tag){case 1:return Dt(e.type)&&Ao(),t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 3:return qi(),Qe(It),Qe(Et),Dd(),t=e.flags,t&65536&&!(t&128)?(e.flags=t&-65537|128,e):null;case 5:return Id(e),null;case 13:if(Qe(it),t=e.memoizedState,t!==null&&t.dehydrated!==null){if(e.alternate===null)throw Error(re(340));Wi()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 19:return Qe(it),null;case 4:return qi(),null;case 10:return Nd(e.type._context),null;case 22:case 23:return Kd(),null;case 24:return null;default:return null}}var qs=!1,kt=!1,e_=typeof WeakSet=="function"?WeakSet:Set,pe=null;function Ii(t,e){var r=t.ref;if(r!==null)if(typeof r=="function")try{r(null)}catch(n){lt(t,e,n)}else r.current=null}function ju(t,e,r){try{r()}catch(n){lt(t,e,n)}}var pp=!1;function t_(t,e){if(cu=Po,t=H0(),Ed(t)){if("selectionStart"in t)var r={start:t.selectionStart,end:t.selectionEnd};else e:{r=(r=t.ownerDocument)&&r.defaultView||window;var n=r.getSelection&&r.getSelection();if(n&&n.rangeCount!==0){r=n.anchorNode;var i=n.anchorOffset,a=n.focusNode;n=n.focusOffset;try{r.nodeType,a.nodeType}catch{r=null;break e}var s=0,o=-1,l=-1,c=0,d=0,h=t,f=null;t:for(;;){for(var p;h!==r||i!==0&&h.nodeType!==3||(o=s+i),h!==a||n!==0&&h.nodeType!==3||(l=s+n),h.nodeType===3&&(s+=h.nodeValue.length),(p=h.firstChild)!==null;)f=h,h=p;for(;;){if(h===t)break t;if(f===r&&++c===i&&(o=s),f===a&&++d===n&&(l=s),(p=h.nextSibling)!==null)break;h=f,f=h.parentNode}h=p}r=o===-1||l===-1?null:{start:o,end:l}}else r=null}r=r||{start:0,end:0}}else r=null;for(uu={focusedElem:t,selectionRange:r},Po=!1,pe=e;pe!==null;)if(e=pe,t=e.child,(e.subtreeFlags&1028)!==0&&t!==null)t.return=e,pe=t;else for(;pe!==null;){e=pe;try{var y=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(y!==null){var m=y.memoizedProps,b=y.memoizedState,v=e.stateNode,g=v.getSnapshotBeforeUpdate(e.elementType===e.type?m:ur(e.type,m),b);v.__reactInternalSnapshotBeforeUpdate=g}break;case 3:var w=e.stateNode.containerInfo;w.nodeType===1?w.textContent="":w.nodeType===9&&w.documentElement&&w.removeChild(w.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(re(163))}}catch(S){lt(e,e.return,S)}if(t=e.sibling,t!==null){t.return=e.return,pe=t;break}pe=e.return}return y=pp,pp=!1,y}function Ha(t,e,r){var n=e.updateQueue;if(n=n!==null?n.lastEffect:null,n!==null){var i=n=n.next;do{if((i.tag&t)===t){var a=i.destroy;i.destroy=void 0,a!==void 0&&ju(e,r,a)}i=i.next}while(i!==n)}}function bl(t,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var r=e=e.next;do{if((r.tag&t)===t){var n=r.create;r.destroy=n()}r=r.next}while(r!==e)}}function Cu(t){var e=t.ref;if(e!==null){var r=t.stateNode;switch(t.tag){case 5:t=r;break;default:t=r}typeof e=="function"?e(t):e.current=t}}function Lv(t){var e=t.alternate;e!==null&&(t.alternate=null,Lv(e)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(e=t.stateNode,e!==null&&(delete e[kr],delete e[os],delete e[fu],delete e[M1],delete e[z1])),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}function Fv(t){return t.tag===5||t.tag===3||t.tag===4}function gp(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||Fv(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function Tu(t,e,r){var n=t.tag;if(n===5||n===6)t=t.stateNode,e?r.nodeType===8?r.parentNode.insertBefore(t,e):r.insertBefore(t,e):(r.nodeType===8?(e=r.parentNode,e.insertBefore(t,r)):(e=r,e.appendChild(t)),r=r._reactRootContainer,r!=null||e.onclick!==null||(e.onclick=Ro));else if(n!==4&&(t=t.child,t!==null))for(Tu(t,e,r),t=t.sibling;t!==null;)Tu(t,e,r),t=t.sibling}function Ou(t,e,r){var n=t.tag;if(n===5||n===6)t=t.stateNode,e?r.insertBefore(t,e):r.appendChild(t);else if(n!==4&&(t=t.child,t!==null))for(Ou(t,e,r),t=t.sibling;t!==null;)Ou(t,e,r),t=t.sibling}var yt=null,hr=!1;function Wr(t,e,r){for(r=r.child;r!==null;)Bv(t,e,r),r=r.sibling}function Bv(t,e,r){if(jr&&typeof jr.onCommitFiberUnmount=="function")try{jr.onCommitFiberUnmount(dl,r)}catch{}switch(r.tag){case 5:kt||Ii(r,e);case 6:var n=yt,i=hr;yt=null,Wr(t,e,r),yt=n,hr=i,yt!==null&&(hr?(t=yt,r=r.stateNode,t.nodeType===8?t.parentNode.removeChild(r):t.removeChild(r)):yt.removeChild(r.stateNode));break;case 18:yt!==null&&(hr?(t=yt,r=r.stateNode,t.nodeType===8?uc(t.parentNode,r):t.nodeType===1&&uc(t,r),rs(t)):uc(yt,r.stateNode));break;case 4:n=yt,i=hr,yt=r.stateNode.containerInfo,hr=!0,Wr(t,e,r),yt=n,hr=i;break;case 0:case 11:case 14:case 15:if(!kt&&(n=r.updateQueue,n!==null&&(n=n.lastEffect,n!==null))){i=n=n.next;do{var a=i,s=a.destroy;a=a.tag,s!==void 0&&(a&2||a&4)&&ju(r,e,s),i=i.next}while(i!==n)}Wr(t,e,r);break;case 1:if(!kt&&(Ii(r,e),n=r.stateNode,typeof n.componentWillUnmount=="function"))try{n.props=r.memoizedProps,n.state=r.memoizedState,n.componentWillUnmount()}catch(o){lt(r,e,o)}Wr(t,e,r);break;case 21:Wr(t,e,r);break;case 22:r.mode&1?(kt=(n=kt)||r.memoizedState!==null,Wr(t,e,r),kt=n):Wr(t,e,r);break;default:Wr(t,e,r)}}function mp(t){var e=t.updateQueue;if(e!==null){t.updateQueue=null;var r=t.stateNode;r===null&&(r=t.stateNode=new e_),e.forEach(function(n){var i=u_.bind(null,t,n);r.has(n)||(r.add(n),n.then(i,i))})}}function sr(t,e){var r=e.deletions;if(r!==null)for(var n=0;n<r.length;n++){var i=r[n];try{var a=t,s=e,o=s;e:for(;o!==null;){switch(o.tag){case 5:yt=o.stateNode,hr=!1;break e;case 3:yt=o.stateNode.containerInfo,hr=!0;break e;case 4:yt=o.stateNode.containerInfo,hr=!0;break e}o=o.return}if(yt===null)throw Error(re(160));Bv(a,s,i),yt=null,hr=!1;var l=i.alternate;l!==null&&(l.return=null),i.return=null}catch(c){lt(i,e,c)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)Uv(e,t),e=e.sibling}function Uv(t,e){var r=t.alternate,n=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if(sr(e,t),xr(t),n&4){try{Ha(3,t,t.return),bl(3,t)}catch(m){lt(t,t.return,m)}try{Ha(5,t,t.return)}catch(m){lt(t,t.return,m)}}break;case 1:sr(e,t),xr(t),n&512&&r!==null&&Ii(r,r.return);break;case 5:if(sr(e,t),xr(t),n&512&&r!==null&&Ii(r,r.return),t.flags&32){var i=t.stateNode;try{Za(i,"")}catch(m){lt(t,t.return,m)}}if(n&4&&(i=t.stateNode,i!=null)){var a=t.memoizedProps,s=r!==null?r.memoizedProps:a,o=t.type,l=t.updateQueue;if(t.updateQueue=null,l!==null)try{o==="input"&&a.type==="radio"&&a.name!=null&&u0(i,a),Qc(o,s);var c=Qc(o,a);for(s=0;s<l.length;s+=2){var d=l[s],h=l[s+1];d==="style"?g0(i,h):d==="dangerouslySetInnerHTML"?f0(i,h):d==="children"?Za(i,h):hd(i,d,h,c)}switch(o){case"input":qc(i,a);break;case"textarea":d0(i,a);break;case"select":var f=i._wrapperState.wasMultiple;i._wrapperState.wasMultiple=!!a.multiple;var p=a.value;p!=null?Mi(i,!!a.multiple,p,!1):f!==!!a.multiple&&(a.defaultValue!=null?Mi(i,!!a.multiple,a.defaultValue,!0):Mi(i,!!a.multiple,a.multiple?[]:"",!1))}i[os]=a}catch(m){lt(t,t.return,m)}}break;case 6:if(sr(e,t),xr(t),n&4){if(t.stateNode===null)throw Error(re(162));i=t.stateNode,a=t.memoizedProps;try{i.nodeValue=a}catch(m){lt(t,t.return,m)}}break;case 3:if(sr(e,t),xr(t),n&4&&r!==null&&r.memoizedState.isDehydrated)try{rs(e.containerInfo)}catch(m){lt(t,t.return,m)}break;case 4:sr(e,t),xr(t);break;case 13:sr(e,t),xr(t),i=t.child,i.flags&8192&&(a=i.memoizedState!==null,i.stateNode.isHidden=a,!a||i.alternate!==null&&i.alternate.memoizedState!==null||(Vd=ct())),n&4&&mp(t);break;case 22:if(d=r!==null&&r.memoizedState!==null,t.mode&1?(kt=(c=kt)||d,sr(e,t),kt=c):sr(e,t),xr(t),n&8192){if(c=t.memoizedState!==null,(t.stateNode.isHidden=c)&&!d&&t.mode&1)for(pe=t,d=t.child;d!==null;){for(h=pe=d;pe!==null;){switch(f=pe,p=f.child,f.tag){case 0:case 11:case 14:case 15:Ha(4,f,f.return);break;case 1:Ii(f,f.return);var y=f.stateNode;if(typeof y.componentWillUnmount=="function"){n=f,r=f.return;try{e=n,y.props=e.memoizedProps,y.state=e.memoizedState,y.componentWillUnmount()}catch(m){lt(n,r,m)}}break;case 5:Ii(f,f.return);break;case 22:if(f.memoizedState!==null){yp(h);continue}}p!==null?(p.return=f,pe=p):yp(h)}d=d.sibling}e:for(d=null,h=t;;){if(h.tag===5){if(d===null){d=h;try{i=h.stateNode,c?(a=i.style,typeof a.setProperty=="function"?a.setProperty("display","none","important"):a.display="none"):(o=h.stateNode,l=h.memoizedProps.style,s=l!=null&&l.hasOwnProperty("display")?l.display:null,o.style.display=p0("display",s))}catch(m){lt(t,t.return,m)}}}else if(h.tag===6){if(d===null)try{h.stateNode.nodeValue=c?"":h.memoizedProps}catch(m){lt(t,t.return,m)}}else if((h.tag!==22&&h.tag!==23||h.memoizedState===null||h===t)&&h.child!==null){h.child.return=h,h=h.child;continue}if(h===t)break e;for(;h.sibling===null;){if(h.return===null||h.return===t)break e;d===h&&(d=null),h=h.return}d===h&&(d=null),h.sibling.return=h.return,h=h.sibling}}break;case 19:sr(e,t),xr(t),n&4&&mp(t);break;case 21:break;default:sr(e,t),xr(t)}}function xr(t){var e=t.flags;if(e&2){try{e:{for(var r=t.return;r!==null;){if(Fv(r)){var n=r;break e}r=r.return}throw Error(re(160))}switch(n.tag){case 5:var i=n.stateNode;n.flags&32&&(Za(i,""),n.flags&=-33);var a=gp(t);Ou(t,a,i);break;case 3:case 4:var s=n.stateNode.containerInfo,o=gp(t);Tu(t,o,s);break;default:throw Error(re(161))}}catch(l){lt(t,t.return,l)}t.flags&=-3}e&4096&&(t.flags&=-4097)}function r_(t,e,r){pe=t,Hv(t)}function Hv(t,e,r){for(var n=(t.mode&1)!==0;pe!==null;){var i=pe,a=i.child;if(i.tag===22&&n){var s=i.memoizedState!==null||qs;if(!s){var o=i.alternate,l=o!==null&&o.memoizedState!==null||kt;o=qs;var c=kt;if(qs=s,(kt=l)&&!c)for(pe=i;pe!==null;)s=pe,l=s.child,s.tag===22&&s.memoizedState!==null?bp(i):l!==null?(l.return=s,pe=l):bp(i);for(;a!==null;)pe=a,Hv(a),a=a.sibling;pe=i,qs=o,kt=c}vp(t)}else i.subtreeFlags&8772&&a!==null?(a.return=i,pe=a):vp(t)}}function vp(t){for(;pe!==null;){var e=pe;if(e.flags&8772){var r=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:kt||bl(5,e);break;case 1:var n=e.stateNode;if(e.flags&4&&!kt)if(r===null)n.componentDidMount();else{var i=e.elementType===e.type?r.memoizedProps:ur(e.type,r.memoizedProps);n.componentDidUpdate(i,r.memoizedState,n.__reactInternalSnapshotBeforeUpdate)}var a=e.updateQueue;a!==null&&tp(e,a,n);break;case 3:var s=e.updateQueue;if(s!==null){if(r=null,e.child!==null)switch(e.child.tag){case 5:r=e.child.stateNode;break;case 1:r=e.child.stateNode}tp(e,s,r)}break;case 5:var o=e.stateNode;if(r===null&&e.flags&4){r=o;var l=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":l.autoFocus&&r.focus();break;case"img":l.src&&(r.src=l.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var c=e.alternate;if(c!==null){var d=c.memoizedState;if(d!==null){var h=d.dehydrated;h!==null&&rs(h)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(re(163))}kt||e.flags&512&&Cu(e)}catch(f){lt(e,e.return,f)}}if(e===t){pe=null;break}if(r=e.sibling,r!==null){r.return=e.return,pe=r;break}pe=e.return}}function yp(t){for(;pe!==null;){var e=pe;if(e===t){pe=null;break}var r=e.sibling;if(r!==null){r.return=e.return,pe=r;break}pe=e.return}}function bp(t){for(;pe!==null;){var e=pe;try{switch(e.tag){case 0:case 11:case 15:var r=e.return;try{bl(4,e)}catch(l){lt(e,r,l)}break;case 1:var n=e.stateNode;if(typeof n.componentDidMount=="function"){var i=e.return;try{n.componentDidMount()}catch(l){lt(e,i,l)}}var a=e.return;try{Cu(e)}catch(l){lt(e,a,l)}break;case 5:var s=e.return;try{Cu(e)}catch(l){lt(e,s,l)}}}catch(l){lt(e,e.return,l)}if(e===t){pe=null;break}var o=e.sibling;if(o!==null){o.return=e.return,pe=o;break}pe=e.return}}var n_=Math.ceil,Go=Br.ReactCurrentDispatcher,Hd=Br.ReactCurrentOwner,rr=Br.ReactCurrentBatchConfig,Fe=0,vt=null,ht=null,bt=0,Bt=0,Di=yn(0),gt=0,fs=null,Fn=0,wl=0,Gd=0,Ga=null,Rt=null,Vd=0,Ji=1/0,Nr=null,Vo=!1,Pu=null,un=null,Ys=!1,nn=null,Wo=0,Va=0,Nu=null,xo=-1,_o=0;function Tt(){return Fe&6?ct():xo!==-1?xo:xo=ct()}function dn(t){return t.mode&1?Fe&2&&bt!==0?bt&-bt:F1.transition!==null?(_o===0&&(_o=C0()),_o):(t=Ve,t!==0||(t=window.event,t=t===void 0?16:A0(t.type)),t):1}function vr(t,e,r,n){if(50<Va)throw Va=0,Nu=null,Error(re(185));ws(t,r,n),(!(Fe&2)||t!==vt)&&(t===vt&&(!(Fe&2)&&(wl|=r),gt===4&&Zr(t,bt)),Mt(t,n),r===1&&Fe===0&&!(e.mode&1)&&(Ji=ct()+500,ml&&bn()))}function Mt(t,e){var r=t.callbackNode;Fx(t,e);var n=Oo(t,t===vt?bt:0);if(n===0)r!==null&&Tf(r),t.callbackNode=null,t.callbackPriority=0;else if(e=n&-n,t.callbackPriority!==e){if(r!=null&&Tf(r),e===1)t.tag===0?L1(wp.bind(null,t)):Q0(wp.bind(null,t)),I1(function(){!(Fe&6)&&bn()}),r=null;else{switch(T0(n)){case 1:r=vd;break;case 4:r=E0;break;case 16:r=To;break;case 536870912:r=j0;break;default:r=To}r=Xv(r,Gv.bind(null,t))}t.callbackPriority=e,t.callbackNode=r}}function Gv(t,e){if(xo=-1,_o=0,Fe&6)throw Error(re(327));var r=t.callbackNode;if(Ui()&&t.callbackNode!==r)return null;var n=Oo(t,t===vt?bt:0);if(n===0)return null;if(n&30||n&t.expiredLanes||e)e=Ko(t,n);else{e=n;var i=Fe;Fe|=2;var a=Wv();(vt!==t||bt!==e)&&(Nr=null,Ji=ct()+500,In(t,e));do try{s_();break}catch(o){Vv(t,o)}while(!0);Pd(),Go.current=a,Fe=i,ht!==null?e=0:(vt=null,bt=0,e=gt)}if(e!==0){if(e===2&&(i=iu(t),i!==0&&(n=i,e=$u(t,i))),e===1)throw r=fs,In(t,0),Zr(t,n),Mt(t,ct()),r;if(e===6)Zr(t,n);else{if(i=t.current.alternate,!(n&30)&&!i_(i)&&(e=Ko(t,n),e===2&&(a=iu(t),a!==0&&(n=a,e=$u(t,a))),e===1))throw r=fs,In(t,0),Zr(t,n),Mt(t,ct()),r;switch(t.finishedWork=i,t.finishedLanes=n,e){case 0:case 1:throw Error(re(345));case 2:jn(t,Rt,Nr);break;case 3:if(Zr(t,n),(n&130023424)===n&&(e=Vd+500-ct(),10<e)){if(Oo(t,0)!==0)break;if(i=t.suspendedLanes,(i&n)!==n){Tt(),t.pingedLanes|=t.suspendedLanes&i;break}t.timeoutHandle=hu(jn.bind(null,t,Rt,Nr),e);break}jn(t,Rt,Nr);break;case 4:if(Zr(t,n),(n&4194240)===n)break;for(e=t.eventTimes,i=-1;0<n;){var s=31-mr(n);a=1<<s,s=e[s],s>i&&(i=s),n&=~a}if(n=i,n=ct()-n,n=(120>n?120:480>n?480:1080>n?1080:1920>n?1920:3e3>n?3e3:4320>n?4320:1960*n_(n/1960))-n,10<n){t.timeoutHandle=hu(jn.bind(null,t,Rt,Nr),n);break}jn(t,Rt,Nr);break;case 5:jn(t,Rt,Nr);break;default:throw Error(re(329))}}}return Mt(t,ct()),t.callbackNode===r?Gv.bind(null,t):null}function $u(t,e){var r=Ga;return t.current.memoizedState.isDehydrated&&(In(t,e).flags|=256),t=Ko(t,e),t!==2&&(e=Rt,Rt=r,e!==null&&Ru(e)),t}function Ru(t){Rt===null?Rt=t:Rt.push.apply(Rt,t)}function i_(t){for(var e=t;;){if(e.flags&16384){var r=e.updateQueue;if(r!==null&&(r=r.stores,r!==null))for(var n=0;n<r.length;n++){var i=r[n],a=i.getSnapshot;i=i.value;try{if(!yr(a(),i))return!1}catch{return!1}}}if(r=e.child,e.subtreeFlags&16384&&r!==null)r.return=e,e=r;else{if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function Zr(t,e){for(e&=~Gd,e&=~wl,t.suspendedLanes|=e,t.pingedLanes&=~e,t=t.expirationTimes;0<e;){var r=31-mr(e),n=1<<r;t[r]=-1,e&=~n}}function wp(t){if(Fe&6)throw Error(re(327));Ui();var e=Oo(t,0);if(!(e&1))return Mt(t,ct()),null;var r=Ko(t,e);if(t.tag!==0&&r===2){var n=iu(t);n!==0&&(e=n,r=$u(t,n))}if(r===1)throw r=fs,In(t,0),Zr(t,e),Mt(t,ct()),r;if(r===6)throw Error(re(345));return t.finishedWork=t.current.alternate,t.finishedLanes=e,jn(t,Rt,Nr),Mt(t,ct()),null}function Wd(t,e){var r=Fe;Fe|=1;try{return t(e)}finally{Fe=r,Fe===0&&(Ji=ct()+500,ml&&bn())}}function Bn(t){nn!==null&&nn.tag===0&&!(Fe&6)&&Ui();var e=Fe;Fe|=1;var r=rr.transition,n=Ve;try{if(rr.transition=null,Ve=1,t)return t()}finally{Ve=n,rr.transition=r,Fe=e,!(Fe&6)&&bn()}}function Kd(){Bt=Di.current,Qe(Di)}function In(t,e){t.finishedWork=null,t.finishedLanes=0;var r=t.timeoutHandle;if(r!==-1&&(t.timeoutHandle=-1,A1(r)),ht!==null)for(r=ht.return;r!==null;){var n=r;switch(Cd(n),n.tag){case 1:n=n.type.childContextTypes,n!=null&&Ao();break;case 3:qi(),Qe(It),Qe(Et),Dd();break;case 5:Id(n);break;case 4:qi();break;case 13:Qe(it);break;case 19:Qe(it);break;case 10:Nd(n.type._context);break;case 22:case 23:Kd()}r=r.return}if(vt=t,ht=t=hn(t.current,null),bt=Bt=e,gt=0,fs=null,Gd=wl=Fn=0,Rt=Ga=null,$n!==null){for(e=0;e<$n.length;e++)if(r=$n[e],n=r.interleaved,n!==null){r.interleaved=null;var i=n.next,a=r.pending;if(a!==null){var s=a.next;a.next=i,n.next=s}r.pending=n}$n=null}return t}function Vv(t,e){do{var r=ht;try{if(Pd(),yo.current=Ho,Uo){for(var n=at.memoizedState;n!==null;){var i=n.queue;i!==null&&(i.pending=null),n=n.next}Uo=!1}if(Ln=0,mt=pt=at=null,Ua=!1,us=0,Hd.current=null,r===null||r.return===null){gt=1,fs=e,ht=null;break}e:{var a=t,s=r.return,o=r,l=e;if(e=bt,o.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){var c=l,d=o,h=d.tag;if(!(d.mode&1)&&(h===0||h===11||h===15)){var f=d.alternate;f?(d.updateQueue=f.updateQueue,d.memoizedState=f.memoizedState,d.lanes=f.lanes):(d.updateQueue=null,d.memoizedState=null)}var p=op(s);if(p!==null){p.flags&=-257,lp(p,s,o,a,e),p.mode&1&&sp(a,c,e),e=p,l=c;var y=e.updateQueue;if(y===null){var m=new Set;m.add(l),e.updateQueue=m}else y.add(l);break e}else{if(!(e&1)){sp(a,c,e),qd();break e}l=Error(re(426))}}else if(tt&&o.mode&1){var b=op(s);if(b!==null){!(b.flags&65536)&&(b.flags|=256),lp(b,s,o,a,e),Td(Yi(l,o));break e}}a=l=Yi(l,o),gt!==4&&(gt=2),Ga===null?Ga=[a]:Ga.push(a),a=s;do{switch(a.tag){case 3:a.flags|=65536,e&=-e,a.lanes|=e;var v=Tv(a,l,e);ep(a,v);break e;case 1:o=l;var g=a.type,w=a.stateNode;if(!(a.flags&128)&&(typeof g.getDerivedStateFromError=="function"||w!==null&&typeof w.componentDidCatch=="function"&&(un===null||!un.has(w)))){a.flags|=65536,e&=-e,a.lanes|=e;var S=Ov(a,o,e);ep(a,S);break e}}a=a.return}while(a!==null)}qv(r)}catch(E){e=E,ht===r&&r!==null&&(ht=r=r.return);continue}break}while(!0)}function Wv(){var t=Go.current;return Go.current=Ho,t===null?Ho:t}function qd(){(gt===0||gt===3||gt===2)&&(gt=4),vt===null||!(Fn&268435455)&&!(wl&268435455)||Zr(vt,bt)}function Ko(t,e){var r=Fe;Fe|=2;var n=Wv();(vt!==t||bt!==e)&&(Nr=null,In(t,e));do try{a_();break}catch(i){Vv(t,i)}while(!0);if(Pd(),Fe=r,Go.current=n,ht!==null)throw Error(re(261));return vt=null,bt=0,gt}function a_(){for(;ht!==null;)Kv(ht)}function s_(){for(;ht!==null&&!Nx();)Kv(ht)}function Kv(t){var e=Jv(t.alternate,t,Bt);t.memoizedProps=t.pendingProps,e===null?qv(t):ht=e,Hd.current=null}function qv(t){var e=t;do{var r=e.alternate;if(t=e.return,e.flags&32768){if(r=Q1(r,e),r!==null){r.flags&=32767,ht=r;return}if(t!==null)t.flags|=32768,t.subtreeFlags=0,t.deletions=null;else{gt=6,ht=null;return}}else if(r=Z1(r,e,Bt),r!==null){ht=r;return}if(e=e.sibling,e!==null){ht=e;return}ht=e=t}while(e!==null);gt===0&&(gt=5)}function jn(t,e,r){var n=Ve,i=rr.transition;try{rr.transition=null,Ve=1,o_(t,e,r,n)}finally{rr.transition=i,Ve=n}return null}function o_(t,e,r,n){do Ui();while(nn!==null);if(Fe&6)throw Error(re(327));r=t.finishedWork;var i=t.finishedLanes;if(r===null)return null;if(t.finishedWork=null,t.finishedLanes=0,r===t.current)throw Error(re(177));t.callbackNode=null,t.callbackPriority=0;var a=r.lanes|r.childLanes;if(Bx(t,a),t===vt&&(ht=vt=null,bt=0),!(r.subtreeFlags&2064)&&!(r.flags&2064)||Ys||(Ys=!0,Xv(To,function(){return Ui(),null})),a=(r.flags&15990)!==0,r.subtreeFlags&15990||a){a=rr.transition,rr.transition=null;var s=Ve;Ve=1;var o=Fe;Fe|=4,Hd.current=null,t_(t,r),Uv(r,t),C1(uu),Po=!!cu,uu=cu=null,t.current=r,r_(r),$x(),Fe=o,Ve=s,rr.transition=a}else t.current=r;if(Ys&&(Ys=!1,nn=t,Wo=i),a=t.pendingLanes,a===0&&(un=null),Ix(r.stateNode),Mt(t,ct()),e!==null)for(n=t.onRecoverableError,r=0;r<e.length;r++)i=e[r],n(i.value,{componentStack:i.stack,digest:i.digest});if(Vo)throw Vo=!1,t=Pu,Pu=null,t;return Wo&1&&t.tag!==0&&Ui(),a=t.pendingLanes,a&1?t===Nu?Va++:(Va=0,Nu=t):Va=0,bn(),null}function Ui(){if(nn!==null){var t=T0(Wo),e=rr.transition,r=Ve;try{if(rr.transition=null,Ve=16>t?16:t,nn===null)var n=!1;else{if(t=nn,nn=null,Wo=0,Fe&6)throw Error(re(331));var i=Fe;for(Fe|=4,pe=t.current;pe!==null;){var a=pe,s=a.child;if(pe.flags&16){var o=a.deletions;if(o!==null){for(var l=0;l<o.length;l++){var c=o[l];for(pe=c;pe!==null;){var d=pe;switch(d.tag){case 0:case 11:case 15:Ha(8,d,a)}var h=d.child;if(h!==null)h.return=d,pe=h;else for(;pe!==null;){d=pe;var f=d.sibling,p=d.return;if(Lv(d),d===c){pe=null;break}if(f!==null){f.return=p,pe=f;break}pe=p}}}var y=a.alternate;if(y!==null){var m=y.child;if(m!==null){y.child=null;do{var b=m.sibling;m.sibling=null,m=b}while(m!==null)}}pe=a}}if(a.subtreeFlags&2064&&s!==null)s.return=a,pe=s;else e:for(;pe!==null;){if(a=pe,a.flags&2048)switch(a.tag){case 0:case 11:case 15:Ha(9,a,a.return)}var v=a.sibling;if(v!==null){v.return=a.return,pe=v;break e}pe=a.return}}var g=t.current;for(pe=g;pe!==null;){s=pe;var w=s.child;if(s.subtreeFlags&2064&&w!==null)w.return=s,pe=w;else e:for(s=g;pe!==null;){if(o=pe,o.flags&2048)try{switch(o.tag){case 0:case 11:case 15:bl(9,o)}}catch(E){lt(o,o.return,E)}if(o===s){pe=null;break e}var S=o.sibling;if(S!==null){S.return=o.return,pe=S;break e}pe=o.return}}if(Fe=i,bn(),jr&&typeof jr.onPostCommitFiberRoot=="function")try{jr.onPostCommitFiberRoot(dl,t)}catch{}n=!0}return n}finally{Ve=r,rr.transition=e}}return!1}function xp(t,e,r){e=Yi(r,e),e=Tv(t,e,1),t=cn(t,e,1),e=Tt(),t!==null&&(ws(t,1,e),Mt(t,e))}function lt(t,e,r){if(t.tag===3)xp(t,t,r);else for(;e!==null;){if(e.tag===3){xp(e,t,r);break}else if(e.tag===1){var n=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof n.componentDidCatch=="function"&&(un===null||!un.has(n))){t=Yi(r,t),t=Ov(e,t,1),e=cn(e,t,1),t=Tt(),e!==null&&(ws(e,1,t),Mt(e,t));break}}e=e.return}}function l_(t,e,r){var n=t.pingCache;n!==null&&n.delete(e),e=Tt(),t.pingedLanes|=t.suspendedLanes&r,vt===t&&(bt&r)===r&&(gt===4||gt===3&&(bt&130023424)===bt&&500>ct()-Vd?In(t,0):Gd|=r),Mt(t,e)}function Yv(t,e){e===0&&(t.mode&1?(e=Ls,Ls<<=1,!(Ls&130023424)&&(Ls=4194304)):e=1);var r=Tt();t=Lr(t,e),t!==null&&(ws(t,e,r),Mt(t,r))}function c_(t){var e=t.memoizedState,r=0;e!==null&&(r=e.retryLane),Yv(t,r)}function u_(t,e){var r=0;switch(t.tag){case 13:var n=t.stateNode,i=t.memoizedState;i!==null&&(r=i.retryLane);break;case 19:n=t.stateNode;break;default:throw Error(re(314))}n!==null&&n.delete(e),Yv(t,r)}var Jv;Jv=function(t,e,r){if(t!==null)if(t.memoizedProps!==e.pendingProps||It.current)At=!0;else{if(!(t.lanes&r)&&!(e.flags&128))return At=!1,X1(t,e,r);At=!!(t.flags&131072)}else At=!1,tt&&e.flags&1048576&&ev(e,Mo,e.index);switch(e.lanes=0,e.tag){case 2:var n=e.type;wo(t,e),t=e.pendingProps;var i=Vi(e,Et.current);Bi(e,r),i=zd(null,e,n,t,i,r);var a=Ld();return e.flags|=1,typeof i=="object"&&i!==null&&typeof i.render=="function"&&i.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,Dt(n)?(a=!0,Io(e)):a=!1,e.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,Rd(e),i.updater=yl,e.stateNode=i,i._reactInternals=e,bu(e,n,t,r),e=_u(null,e,n,!0,a,r)):(e.tag=0,tt&&a&&jd(e),jt(null,e,i,r),e=e.child),e;case 16:n=e.elementType;e:{switch(wo(t,e),t=e.pendingProps,i=n._init,n=i(n._payload),e.type=n,i=e.tag=h_(n),t=ur(n,t),i){case 0:e=xu(null,e,n,t,r);break e;case 1:e=dp(null,e,n,t,r);break e;case 11:e=cp(null,e,n,t,r);break e;case 14:e=up(null,e,n,ur(n.type,t),r);break e}throw Error(re(306,n,""))}return e;case 0:return n=e.type,i=e.pendingProps,i=e.elementType===n?i:ur(n,i),xu(t,e,n,i,r);case 1:return n=e.type,i=e.pendingProps,i=e.elementType===n?i:ur(n,i),dp(t,e,n,i,r);case 3:e:{if(Rv(e),t===null)throw Error(re(387));n=e.pendingProps,a=e.memoizedState,i=a.element,sv(t,e),Fo(e,n,null,r);var s=e.memoizedState;if(n=s.element,a.isDehydrated)if(a={element:n,isDehydrated:!1,cache:s.cache,pendingSuspenseBoundaries:s.pendingSuspenseBoundaries,transitions:s.transitions},e.updateQueue.baseState=a,e.memoizedState=a,e.flags&256){i=Yi(Error(re(423)),e),e=hp(t,e,n,r,i);break e}else if(n!==i){i=Yi(Error(re(424)),e),e=hp(t,e,n,r,i);break e}else for(Gt=ln(e.stateNode.containerInfo.firstChild),Kt=e,tt=!0,pr=null,r=iv(e,null,n,r),e.child=r;r;)r.flags=r.flags&-3|4096,r=r.sibling;else{if(Wi(),n===i){e=Fr(t,e,r);break e}jt(t,e,n,r)}e=e.child}return e;case 5:return ov(e),t===null&&mu(e),n=e.type,i=e.pendingProps,a=t!==null?t.memoizedProps:null,s=i.children,du(n,i)?s=null:a!==null&&du(n,a)&&(e.flags|=32),$v(t,e),jt(t,e,s,r),e.child;case 6:return t===null&&mu(e),null;case 13:return Av(t,e,r);case 4:return Ad(e,e.stateNode.containerInfo),n=e.pendingProps,t===null?e.child=Ki(e,null,n,r):jt(t,e,n,r),e.child;case 11:return n=e.type,i=e.pendingProps,i=e.elementType===n?i:ur(n,i),cp(t,e,n,i,r);case 7:return jt(t,e,e.pendingProps,r),e.child;case 8:return jt(t,e,e.pendingProps.children,r),e.child;case 12:return jt(t,e,e.pendingProps.children,r),e.child;case 10:e:{if(n=e.type._context,i=e.pendingProps,a=e.memoizedProps,s=i.value,Ye(zo,n._currentValue),n._currentValue=s,a!==null)if(yr(a.value,s)){if(a.children===i.children&&!It.current){e=Fr(t,e,r);break e}}else for(a=e.child,a!==null&&(a.return=e);a!==null;){var o=a.dependencies;if(o!==null){s=a.child;for(var l=o.firstContext;l!==null;){if(l.context===n){if(a.tag===1){l=Dr(-1,r&-r),l.tag=2;var c=a.updateQueue;if(c!==null){c=c.shared;var d=c.pending;d===null?l.next=l:(l.next=d.next,d.next=l),c.pending=l}}a.lanes|=r,l=a.alternate,l!==null&&(l.lanes|=r),vu(a.return,r,e),o.lanes|=r;break}l=l.next}}else if(a.tag===10)s=a.type===e.type?null:a.child;else if(a.tag===18){if(s=a.return,s===null)throw Error(re(341));s.lanes|=r,o=s.alternate,o!==null&&(o.lanes|=r),vu(s,r,e),s=a.sibling}else s=a.child;if(s!==null)s.return=a;else for(s=a;s!==null;){if(s===e){s=null;break}if(a=s.sibling,a!==null){a.return=s.return,s=a;break}s=s.return}a=s}jt(t,e,i.children,r),e=e.child}return e;case 9:return i=e.type,n=e.pendingProps.children,Bi(e,r),i=nr(i),n=n(i),e.flags|=1,jt(t,e,n,r),e.child;case 14:return n=e.type,i=ur(n,e.pendingProps),i=ur(n.type,i),up(t,e,n,i,r);case 15:return Pv(t,e,e.type,e.pendingProps,r);case 17:return n=e.type,i=e.pendingProps,i=e.elementType===n?i:ur(n,i),wo(t,e),e.tag=1,Dt(n)?(t=!0,Io(e)):t=!1,Bi(e,r),Cv(e,n,i),bu(e,n,i,r),_u(null,e,n,!0,t,r);case 19:return Iv(t,e,r);case 22:return Nv(t,e,r)}throw Error(re(156,e.tag))};function Xv(t,e){return k0(t,e)}function d_(t,e,r,n){this.tag=t,this.key=r,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=n,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function tr(t,e,r,n){return new d_(t,e,r,n)}function Yd(t){return t=t.prototype,!(!t||!t.isReactComponent)}function h_(t){if(typeof t=="function")return Yd(t)?1:0;if(t!=null){if(t=t.$$typeof,t===pd)return 11;if(t===gd)return 14}return 2}function hn(t,e){var r=t.alternate;return r===null?(r=tr(t.tag,e,t.key,t.mode),r.elementType=t.elementType,r.type=t.type,r.stateNode=t.stateNode,r.alternate=t,t.alternate=r):(r.pendingProps=e,r.type=t.type,r.flags=0,r.subtreeFlags=0,r.deletions=null),r.flags=t.flags&14680064,r.childLanes=t.childLanes,r.lanes=t.lanes,r.child=t.child,r.memoizedProps=t.memoizedProps,r.memoizedState=t.memoizedState,r.updateQueue=t.updateQueue,e=t.dependencies,r.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},r.sibling=t.sibling,r.index=t.index,r.ref=t.ref,r}function So(t,e,r,n,i,a){var s=2;if(n=t,typeof t=="function")Yd(t)&&(s=1);else if(typeof t=="string")s=5;else e:switch(t){case ji:return Dn(r.children,i,a,e);case fd:s=8,i|=8;break;case Hc:return t=tr(12,r,e,i|2),t.elementType=Hc,t.lanes=a,t;case Gc:return t=tr(13,r,e,i),t.elementType=Gc,t.lanes=a,t;case Vc:return t=tr(19,r,e,i),t.elementType=Vc,t.lanes=a,t;case o0:return xl(r,i,a,e);default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case a0:s=10;break e;case s0:s=9;break e;case pd:s=11;break e;case gd:s=14;break e;case qr:s=16,n=null;break e}throw Error(re(130,t==null?t:typeof t,""))}return e=tr(s,r,e,i),e.elementType=t,e.type=n,e.lanes=a,e}function Dn(t,e,r,n){return t=tr(7,t,n,e),t.lanes=r,t}function xl(t,e,r,n){return t=tr(22,t,n,e),t.elementType=o0,t.lanes=r,t.stateNode={isHidden:!1},t}function yc(t,e,r){return t=tr(6,t,null,e),t.lanes=r,t}function bc(t,e,r){return e=tr(4,t.children!==null?t.children:[],t.key,e),e.lanes=r,e.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},e}function f_(t,e,r,n,i){this.tag=e,this.containerInfo=t,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Ql(0),this.expirationTimes=Ql(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Ql(0),this.identifierPrefix=n,this.onRecoverableError=i,this.mutableSourceEagerHydrationData=null}function Jd(t,e,r,n,i,a,s,o,l){return t=new f_(t,e,r,o,l),e===1?(e=1,a===!0&&(e|=8)):e=0,a=tr(3,null,null,e),t.current=a,a.stateNode=t,a.memoizedState={element:n,isDehydrated:r,cache:null,transitions:null,pendingSuspenseBoundaries:null},Rd(a),t}function p_(t,e,r){var n=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Ei,key:n==null?null:""+n,children:t,containerInfo:e,implementation:r}}function Zv(t){if(!t)return pn;t=t._reactInternals;e:{if(Gn(t)!==t||t.tag!==1)throw Error(re(170));var e=t;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(Dt(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(re(171))}if(t.tag===1){var r=t.type;if(Dt(r))return Z0(t,r,e)}return e}function Qv(t,e,r,n,i,a,s,o,l){return t=Jd(r,n,!0,t,i,a,s,o,l),t.context=Zv(null),r=t.current,n=Tt(),i=dn(r),a=Dr(n,i),a.callback=e??null,cn(r,a,i),t.current.lanes=i,ws(t,i,n),Mt(t,n),t}function _l(t,e,r,n){var i=e.current,a=Tt(),s=dn(i);return r=Zv(r),e.context===null?e.context=r:e.pendingContext=r,e=Dr(a,s),e.payload={element:t},n=n===void 0?null:n,n!==null&&(e.callback=n),t=cn(i,e,s),t!==null&&(vr(t,i,s,a),vo(t,i,s)),s}function qo(t){if(t=t.current,!t.child)return null;switch(t.child.tag){case 5:return t.child.stateNode;default:return t.child.stateNode}}function _p(t,e){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var r=t.retryLane;t.retryLane=r!==0&&r<e?r:e}}function Xd(t,e){_p(t,e),(t=t.alternate)&&_p(t,e)}function g_(){return null}var ey=typeof reportError=="function"?reportError:function(t){console.error(t)};function Zd(t){this._internalRoot=t}Sl.prototype.render=Zd.prototype.render=function(t){var e=this._internalRoot;if(e===null)throw Error(re(409));_l(t,e,null,null)};Sl.prototype.unmount=Zd.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var e=t.containerInfo;Bn(function(){_l(null,t,null,null)}),e[zr]=null}};function Sl(t){this._internalRoot=t}Sl.prototype.unstable_scheduleHydration=function(t){if(t){var e=N0();t={blockedOn:null,target:t,priority:e};for(var r=0;r<Xr.length&&e!==0&&e<Xr[r].priority;r++);Xr.splice(r,0,t),r===0&&R0(t)}};function Qd(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function kl(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11&&(t.nodeType!==8||t.nodeValue!==" react-mount-point-unstable "))}function Sp(){}function m_(t,e,r,n,i){if(i){if(typeof n=="function"){var a=n;n=function(){var c=qo(s);a.call(c)}}var s=Qv(e,n,t,0,null,!1,!1,"",Sp);return t._reactRootContainer=s,t[zr]=s.current,as(t.nodeType===8?t.parentNode:t),Bn(),s}for(;i=t.lastChild;)t.removeChild(i);if(typeof n=="function"){var o=n;n=function(){var c=qo(l);o.call(c)}}var l=Jd(t,0,!1,null,null,!1,!1,"",Sp);return t._reactRootContainer=l,t[zr]=l.current,as(t.nodeType===8?t.parentNode:t),Bn(function(){_l(e,l,r,n)}),l}function El(t,e,r,n,i){var a=r._reactRootContainer;if(a){var s=a;if(typeof i=="function"){var o=i;i=function(){var l=qo(s);o.call(l)}}_l(e,s,t,i)}else s=m_(r,e,t,i,n);return qo(s)}O0=function(t){switch(t.tag){case 3:var e=t.stateNode;if(e.current.memoizedState.isDehydrated){var r=Na(e.pendingLanes);r!==0&&(yd(e,r|1),Mt(e,ct()),!(Fe&6)&&(Ji=ct()+500,bn()))}break;case 13:Bn(function(){var n=Lr(t,1);if(n!==null){var i=Tt();vr(n,t,1,i)}}),Xd(t,1)}};bd=function(t){if(t.tag===13){var e=Lr(t,134217728);if(e!==null){var r=Tt();vr(e,t,134217728,r)}Xd(t,134217728)}};P0=function(t){if(t.tag===13){var e=dn(t),r=Lr(t,e);if(r!==null){var n=Tt();vr(r,t,e,n)}Xd(t,e)}};N0=function(){return Ve};$0=function(t,e){var r=Ve;try{return Ve=t,e()}finally{Ve=r}};tu=function(t,e,r){switch(e){case"input":if(qc(t,r),e=r.name,r.type==="radio"&&e!=null){for(r=t;r.parentNode;)r=r.parentNode;for(r=r.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<r.length;e++){var n=r[e];if(n!==t&&n.form===t.form){var i=gl(n);if(!i)throw Error(re(90));c0(n),qc(n,i)}}}break;case"textarea":d0(t,r);break;case"select":e=r.value,e!=null&&Mi(t,!!r.multiple,e,!1)}};y0=Wd;b0=Bn;var v_={usingClientEntryPoint:!1,Events:[_s,Pi,gl,m0,v0,Wd]},Sa={findFiberByHostInstance:Nn,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},y_={bundleType:Sa.bundleType,version:Sa.version,rendererPackageName:Sa.rendererPackageName,rendererConfig:Sa.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Br.ReactCurrentDispatcher,findHostInstanceByFiber:function(t){return t=_0(t),t===null?null:t.stateNode},findFiberByHostInstance:Sa.findFiberByHostInstance||g_,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Js=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Js.isDisabled&&Js.supportsFiber)try{dl=Js.inject(y_),jr=Js}catch{}}Jt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=v_;Jt.createPortal=function(t,e){var r=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Qd(e))throw Error(re(200));return p_(t,e,null,r)};Jt.createRoot=function(t,e){if(!Qd(t))throw Error(re(299));var r=!1,n="",i=ey;return e!=null&&(e.unstable_strictMode===!0&&(r=!0),e.identifierPrefix!==void 0&&(n=e.identifierPrefix),e.onRecoverableError!==void 0&&(i=e.onRecoverableError)),e=Jd(t,1,!1,null,null,r,!1,n,i),t[zr]=e.current,as(t.nodeType===8?t.parentNode:t),new Zd(e)};Jt.findDOMNode=function(t){if(t==null)return null;if(t.nodeType===1)return t;var e=t._reactInternals;if(e===void 0)throw typeof t.render=="function"?Error(re(188)):(t=Object.keys(t).join(","),Error(re(268,t)));return t=_0(e),t=t===null?null:t.stateNode,t};Jt.flushSync=function(t){return Bn(t)};Jt.hydrate=function(t,e,r){if(!kl(e))throw Error(re(200));return El(null,t,e,!0,r)};Jt.hydrateRoot=function(t,e,r){if(!Qd(t))throw Error(re(405));var n=r!=null&&r.hydratedSources||null,i=!1,a="",s=ey;if(r!=null&&(r.unstable_strictMode===!0&&(i=!0),r.identifierPrefix!==void 0&&(a=r.identifierPrefix),r.onRecoverableError!==void 0&&(s=r.onRecoverableError)),e=Qv(e,null,t,1,r??null,i,!1,a,s),t[zr]=e.current,as(t),n)for(t=0;t<n.length;t++)r=n[t],i=r._getVersion,i=i(r._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[r,i]:e.mutableSourceEagerHydrationData.push(r,i);return new Sl(e)};Jt.render=function(t,e,r){if(!kl(e))throw Error(re(200));return El(null,t,e,!1,r)};Jt.unmountComponentAtNode=function(t){if(!kl(t))throw Error(re(40));return t._reactRootContainer?(Bn(function(){El(null,null,t,!1,function(){t._reactRootContainer=null,t[zr]=null})}),!0):!1};Jt.unstable_batchedUpdates=Wd;Jt.unstable_renderSubtreeIntoContainer=function(t,e,r,n){if(!kl(r))throw Error(re(200));if(t==null||t._reactInternals===void 0)throw Error(re(38));return El(t,e,r,!1,n)};Jt.version="18.3.1-next-f1338f8080-20240426";function ty(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(ty)}catch(t){console.error(t)}}ty(),t0.exports=Jt;var b_=t0.exports,kp=b_;Bc.createRoot=kp.createRoot,Bc.hydrateRoot=kp.hydrateRoot;var Au=function(t,e){return Au=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(r,n){r.__proto__=n}||function(r,n){for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(r[i]=n[i])},Au(t,e)};function ry(t,e){if(typeof e!="function"&&e!==null)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");Au(t,e);function r(){this.constructor=t}t.prototype=e===null?Object.create(e):(r.prototype=e.prototype,new r)}var Yo=function(){return Yo=Object.assign||function(e){for(var r,n=1,i=arguments.length;n<i;n++){r=arguments[n];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(e[a]=r[a])}return e},Yo.apply(this,arguments)};function ra(t,e){var r={};for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&e.indexOf(n)<0&&(r[n]=t[n]);if(t!=null&&typeof Object.getOwnPropertySymbols=="function")for(var i=0,n=Object.getOwnPropertySymbols(t);i<n.length;i++)e.indexOf(n[i])<0&&Object.prototype.propertyIsEnumerable.call(t,n[i])&&(r[n[i]]=t[n[i]]);return r}function ny(t,e,r,n){var i=arguments.length,a=i<3?e:n===null?n=Object.getOwnPropertyDescriptor(e,r):n,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")a=Reflect.decorate(t,e,r,n);else for(var o=t.length-1;o>=0;o--)(s=t[o])&&(a=(i<3?s(a):i>3?s(e,r,a):s(e,r))||a);return i>3&&a&&Object.defineProperty(e,r,a),a}function iy(t,e){return function(r,n){e(r,n,t)}}function ay(t,e,r,n,i,a){function s(v){if(v!==void 0&&typeof v!="function")throw new TypeError("Function expected");return v}for(var o=n.kind,l=o==="getter"?"get":o==="setter"?"set":"value",c=!e&&t?n.static?t:t.prototype:null,d=e||(c?Object.getOwnPropertyDescriptor(c,n.name):{}),h,f=!1,p=r.length-1;p>=0;p--){var y={};for(var m in n)y[m]=m==="access"?{}:n[m];for(var m in n.access)y.access[m]=n.access[m];y.addInitializer=function(v){if(f)throw new TypeError("Cannot add initializers after decoration has completed");a.push(s(v||null))};var b=(0,r[p])(o==="accessor"?{get:d.get,set:d.set}:d[l],y);if(o==="accessor"){if(b===void 0)continue;if(b===null||typeof b!="object")throw new TypeError("Object expected");(h=s(b.get))&&(d.get=h),(h=s(b.set))&&(d.set=h),(h=s(b.init))&&i.unshift(h)}else(h=s(b))&&(o==="field"?i.unshift(h):d[l]=h)}c&&Object.defineProperty(c,n.name,d),f=!0}function sy(t,e,r){for(var n=arguments.length>2,i=0;i<e.length;i++)r=n?e[i].call(t,r):e[i].call(t);return n?r:void 0}function oy(t){return typeof t=="symbol"?t:"".concat(t)}function ly(t,e,r){return typeof e=="symbol"&&(e=e.description?"[".concat(e.description,"]"):""),Object.defineProperty(t,"name",{configurable:!0,value:r?"".concat(r," ",e):e})}function cy(t,e){if(typeof Reflect=="object"&&typeof Reflect.metadata=="function")return Reflect.metadata(t,e)}function me(t,e,r,n){function i(a){return a instanceof r?a:new r(function(s){s(a)})}return new(r||(r=Promise))(function(a,s){function o(d){try{c(n.next(d))}catch(h){s(h)}}function l(d){try{c(n.throw(d))}catch(h){s(h)}}function c(d){d.done?a(d.value):i(d.value).then(o,l)}c((n=n.apply(t,e||[])).next())})}function uy(t,e){var r={label:0,sent:function(){if(a[0]&1)throw a[1];return a[1]},trys:[],ops:[]},n,i,a,s=Object.create((typeof Iterator=="function"?Iterator:Object).prototype);return s.next=o(0),s.throw=o(1),s.return=o(2),typeof Symbol=="function"&&(s[Symbol.iterator]=function(){return this}),s;function o(c){return function(d){return l([c,d])}}function l(c){if(n)throw new TypeError("Generator is already executing.");for(;s&&(s=0,c[0]&&(r=0)),r;)try{if(n=1,i&&(a=c[0]&2?i.return:c[0]?i.throw||((a=i.return)&&a.call(i),0):i.next)&&!(a=a.call(i,c[1])).done)return a;switch(i=0,a&&(c=[c[0]&2,a.value]),c[0]){case 0:case 1:a=c;break;case 4:return r.label++,{value:c[1],done:!1};case 5:r.label++,i=c[1],c=[0];continue;case 7:c=r.ops.pop(),r.trys.pop();continue;default:if(a=r.trys,!(a=a.length>0&&a[a.length-1])&&(c[0]===6||c[0]===2)){r=0;continue}if(c[0]===3&&(!a||c[1]>a[0]&&c[1]<a[3])){r.label=c[1];break}if(c[0]===6&&r.label<a[1]){r.label=a[1],a=c;break}if(a&&r.label<a[2]){r.label=a[2],r.ops.push(c);break}a[2]&&r.ops.pop(),r.trys.pop();continue}c=e.call(t,r)}catch(d){c=[6,d],i=0}finally{n=a=0}if(c[0]&5)throw c[1];return{value:c[0]?c[1]:void 0,done:!0}}}var jl=Object.create?function(t,e,r,n){n===void 0&&(n=r);var i=Object.getOwnPropertyDescriptor(e,r);(!i||("get"in i?!e.__esModule:i.writable||i.configurable))&&(i={enumerable:!0,get:function(){return e[r]}}),Object.defineProperty(t,n,i)}:function(t,e,r,n){n===void 0&&(n=r),t[n]=e[r]};function dy(t,e){for(var r in t)r!=="default"&&!Object.prototype.hasOwnProperty.call(e,r)&&jl(e,t,r)}function Jo(t){var e=typeof Symbol=="function"&&Symbol.iterator,r=e&&t[e],n=0;if(r)return r.call(t);if(t&&typeof t.length=="number")return{next:function(){return t&&n>=t.length&&(t=void 0),{value:t&&t[n++],done:!t}}};throw new TypeError(e?"Object is not iterable.":"Symbol.iterator is not defined.")}function eh(t,e){var r=typeof Symbol=="function"&&t[Symbol.iterator];if(!r)return t;var n=r.call(t),i,a=[],s;try{for(;(e===void 0||e-- >0)&&!(i=n.next()).done;)a.push(i.value)}catch(o){s={error:o}}finally{try{i&&!i.done&&(r=n.return)&&r.call(n)}finally{if(s)throw s.error}}return a}function hy(){for(var t=[],e=0;e<arguments.length;e++)t=t.concat(eh(arguments[e]));return t}function fy(){for(var t=0,e=0,r=arguments.length;e<r;e++)t+=arguments[e].length;for(var n=Array(t),i=0,e=0;e<r;e++)for(var a=arguments[e],s=0,o=a.length;s<o;s++,i++)n[i]=a[s];return n}function py(t,e,r){if(r||arguments.length===2)for(var n=0,i=e.length,a;n<i;n++)(a||!(n in e))&&(a||(a=Array.prototype.slice.call(e,0,n)),a[n]=e[n]);return t.concat(a||Array.prototype.slice.call(e))}function Xi(t){return this instanceof Xi?(this.v=t,this):new Xi(t)}function gy(t,e,r){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var n=r.apply(t,e||[]),i,a=[];return i=Object.create((typeof AsyncIterator=="function"?AsyncIterator:Object).prototype),o("next"),o("throw"),o("return",s),i[Symbol.asyncIterator]=function(){return this},i;function s(p){return function(y){return Promise.resolve(y).then(p,h)}}function o(p,y){n[p]&&(i[p]=function(m){return new Promise(function(b,v){a.push([p,m,b,v])>1||l(p,m)})},y&&(i[p]=y(i[p])))}function l(p,y){try{c(n[p](y))}catch(m){f(a[0][3],m)}}function c(p){p.value instanceof Xi?Promise.resolve(p.value.v).then(d,h):f(a[0][2],p)}function d(p){l("next",p)}function h(p){l("throw",p)}function f(p,y){p(y),a.shift(),a.length&&l(a[0][0],a[0][1])}}function my(t){var e,r;return e={},n("next"),n("throw",function(i){throw i}),n("return"),e[Symbol.iterator]=function(){return this},e;function n(i,a){e[i]=t[i]?function(s){return(r=!r)?{value:Xi(t[i](s)),done:!1}:a?a(s):s}:a}}function vy(t){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var e=t[Symbol.asyncIterator],r;return e?e.call(t):(t=typeof Jo=="function"?Jo(t):t[Symbol.iterator](),r={},n("next"),n("throw"),n("return"),r[Symbol.asyncIterator]=function(){return this},r);function n(a){r[a]=t[a]&&function(s){return new Promise(function(o,l){s=t[a](s),i(o,l,s.done,s.value)})}}function i(a,s,o,l){Promise.resolve(l).then(function(c){a({value:c,done:o})},s)}}function yy(t,e){return Object.defineProperty?Object.defineProperty(t,"raw",{value:e}):t.raw=e,t}var w_=Object.create?function(t,e){Object.defineProperty(t,"default",{enumerable:!0,value:e})}:function(t,e){t.default=e},Iu=function(t){return Iu=Object.getOwnPropertyNames||function(e){var r=[];for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(r[r.length]=n);return r},Iu(t)};function by(t){if(t&&t.__esModule)return t;var e={};if(t!=null)for(var r=Iu(t),n=0;n<r.length;n++)r[n]!=="default"&&jl(e,t,r[n]);return w_(e,t),e}function wy(t){return t&&t.__esModule?t:{default:t}}function xy(t,e,r,n){if(r==="a"&&!n)throw new TypeError("Private accessor was defined without a getter");if(typeof e=="function"?t!==e||!n:!e.has(t))throw new TypeError("Cannot read private member from an object whose class did not declare it");return r==="m"?n:r==="a"?n.call(t):n?n.value:e.get(t)}function _y(t,e,r,n,i){if(n==="m")throw new TypeError("Private method is not writable");if(n==="a"&&!i)throw new TypeError("Private accessor was defined without a setter");if(typeof e=="function"?t!==e||!i:!e.has(t))throw new TypeError("Cannot write private member to an object whose class did not declare it");return n==="a"?i.call(t,r):i?i.value=r:e.set(t,r),r}function Sy(t,e){if(e===null||typeof e!="object"&&typeof e!="function")throw new TypeError("Cannot use 'in' operator on non-object");return typeof t=="function"?e===t:t.has(e)}function ky(t,e,r){if(e!=null){if(typeof e!="object"&&typeof e!="function")throw new TypeError("Object expected.");var n,i;if(r){if(!Symbol.asyncDispose)throw new TypeError("Symbol.asyncDispose is not defined.");n=e[Symbol.asyncDispose]}if(n===void 0){if(!Symbol.dispose)throw new TypeError("Symbol.dispose is not defined.");n=e[Symbol.dispose],r&&(i=n)}if(typeof n!="function")throw new TypeError("Object not disposable.");i&&(n=function(){try{i.call(this)}catch(a){return Promise.reject(a)}}),t.stack.push({value:e,dispose:n,async:r})}else r&&t.stack.push({async:!0});return e}var x_=typeof SuppressedError=="function"?SuppressedError:function(t,e,r){var n=new Error(r);return n.name="SuppressedError",n.error=t,n.suppressed=e,n};function Ey(t){function e(a){t.error=t.hasError?new x_(a,t.error,"An error was suppressed during disposal."):a,t.hasError=!0}var r,n=0;function i(){for(;r=t.stack.pop();)try{if(!r.async&&n===1)return n=0,t.stack.push(r),Promise.resolve().then(i);if(r.dispose){var a=r.dispose.call(r.value);if(r.async)return n|=2,Promise.resolve(a).then(i,function(s){return e(s),i()})}else n|=1}catch(s){e(s)}if(n===1)return t.hasError?Promise.reject(t.error):Promise.resolve();if(t.hasError)throw t.error}return i()}function jy(t,e){return typeof t=="string"&&/^\.\.?\//.test(t)?t.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i,function(r,n,i,a,s){return n?e?".jsx":".js":i&&(!a||!s)?r:i+a+"."+s.toLowerCase()+"js"}):t}const __={__extends:ry,__assign:Yo,__rest:ra,__decorate:ny,__param:iy,__esDecorate:ay,__runInitializers:sy,__propKey:oy,__setFunctionName:ly,__metadata:cy,__awaiter:me,__generator:uy,__createBinding:jl,__exportStar:dy,__values:Jo,__read:eh,__spread:hy,__spreadArrays:fy,__spreadArray:py,__await:Xi,__asyncGenerator:gy,__asyncDelegator:my,__asyncValues:vy,__makeTemplateObject:yy,__importStar:by,__importDefault:wy,__classPrivateFieldGet:xy,__classPrivateFieldSet:_y,__classPrivateFieldIn:Sy,__addDisposableResource:ky,__disposeResources:Ey,__rewriteRelativeImportExtension:jy},S_=Object.freeze(Object.defineProperty({__proto__:null,__addDisposableResource:ky,get __assign(){return Yo},__asyncDelegator:my,__asyncGenerator:gy,__asyncValues:vy,__await:Xi,__awaiter:me,__classPrivateFieldGet:xy,__classPrivateFieldIn:Sy,__classPrivateFieldSet:_y,__createBinding:jl,__decorate:ny,__disposeResources:Ey,__esDecorate:ay,__exportStar:dy,__extends:ry,__generator:uy,__importDefault:wy,__importStar:by,__makeTemplateObject:yy,__metadata:cy,__param:iy,__propKey:oy,__read:eh,__rest:ra,__rewriteRelativeImportExtension:jy,__runInitializers:sy,__setFunctionName:ly,__spread:hy,__spreadArray:py,__spreadArrays:fy,__values:Jo,default:__},Symbol.toStringTag,{value:"Module"})),k_=t=>t?(...e)=>t(...e):(...e)=>fetch(...e);class th extends Error{constructor(e,r="FunctionsError",n){super(e),this.name=r,this.context=n}}class Ep extends th{constructor(e){super("Failed to send a request to the Edge Function","FunctionsFetchError",e)}}class jp extends th{constructor(e){super("Relay Error invoking the Edge Function","FunctionsRelayError",e)}}class Cp extends th{constructor(e){super("Edge Function returned a non-2xx status code","FunctionsHttpError",e)}}var Du;(function(t){t.Any="any",t.ApNortheast1="ap-northeast-1",t.ApNortheast2="ap-northeast-2",t.ApSouth1="ap-south-1",t.ApSoutheast1="ap-southeast-1",t.ApSoutheast2="ap-southeast-2",t.CaCentral1="ca-central-1",t.EuCentral1="eu-central-1",t.EuWest1="eu-west-1",t.EuWest2="eu-west-2",t.EuWest3="eu-west-3",t.SaEast1="sa-east-1",t.UsEast1="us-east-1",t.UsWest1="us-west-1",t.UsWest2="us-west-2"})(Du||(Du={}));class E_{constructor(e,{headers:r={},customFetch:n,region:i=Du.Any}={}){this.url=e,this.headers=r,this.region=i,this.fetch=k_(n)}setAuth(e){this.headers.Authorization=`Bearer ${e}`}invoke(e){return me(this,arguments,void 0,function*(r,n={}){var i;try{const{headers:a,method:s,body:o,signal:l}=n;let c={},{region:d}=n;d||(d=this.region);const h=new URL(`${this.url}/${r}`);d&&d!=="any"&&(c["x-region"]=d,h.searchParams.set("forceFunctionRegion",d));let f;o&&(a&&!Object.prototype.hasOwnProperty.call(a,"Content-Type")||!a)?typeof Blob<"u"&&o instanceof Blob||o instanceof ArrayBuffer?(c["Content-Type"]="application/octet-stream",f=o):typeof o=="string"?(c["Content-Type"]="text/plain",f=o):typeof FormData<"u"&&o instanceof FormData?f=o:(c["Content-Type"]="application/json",f=JSON.stringify(o)):f=o;const p=yield this.fetch(h.toString(),{method:s||"POST",headers:Object.assign(Object.assign(Object.assign({},c),this.headers),a),body:f,signal:l}).catch(v=>{throw v.name==="AbortError"?v:new Ep(v)}),y=p.headers.get("x-relay-error");if(y&&y==="true")throw new jp(p);if(!p.ok)throw new Cp(p);let m=((i=p.headers.get("Content-Type"))!==null&&i!==void 0?i:"text/plain").split(";")[0].trim(),b;return m==="application/json"?b=yield p.json():m==="application/octet-stream"||m==="application/pdf"?b=yield p.blob():m==="text/event-stream"?b=p:m==="multipart/form-data"?b=yield p.formData():b=yield p.text(),{data:b,error:null,response:p}}catch(a){return a instanceof Error&&a.name==="AbortError"?{data:null,error:new Ep(a)}:{data:null,error:a,response:a instanceof Cp||a instanceof jp?a.context:void 0}}})}}var Ct={};const na=Kw(S_);var Xs={},Zs={},Qs={},eo={},to={},ro={},Tp;function Cy(){if(Tp)return ro;Tp=1,Object.defineProperty(ro,"__esModule",{value:!0});class t extends Error{constructor(r){super(r.message),this.name="PostgrestError",this.details=r.details,this.hint=r.hint,this.code=r.code}}return ro.default=t,ro}var Op;function Ty(){if(Op)return to;Op=1,Object.defineProperty(to,"__esModule",{value:!0});const e=na.__importDefault(Cy());class r{constructor(i){var a,s;this.shouldThrowOnError=!1,this.method=i.method,this.url=i.url,this.headers=new Headers(i.headers),this.schema=i.schema,this.body=i.body,this.shouldThrowOnError=(a=i.shouldThrowOnError)!==null&&a!==void 0?a:!1,this.signal=i.signal,this.isMaybeSingle=(s=i.isMaybeSingle)!==null&&s!==void 0?s:!1,i.fetch?this.fetch=i.fetch:this.fetch=fetch}throwOnError(){return this.shouldThrowOnError=!0,this}setHeader(i,a){return this.headers=new Headers(this.headers),this.headers.set(i,a),this}then(i,a){this.schema===void 0||(["GET","HEAD"].includes(this.method)?this.headers.set("Accept-Profile",this.schema):this.headers.set("Content-Profile",this.schema)),this.method!=="GET"&&this.method!=="HEAD"&&this.headers.set("Content-Type","application/json");const s=this.fetch;let o=s(this.url.toString(),{method:this.method,headers:this.headers,body:JSON.stringify(this.body),signal:this.signal}).then(async l=>{var c,d,h,f;let p=null,y=null,m=null,b=l.status,v=l.statusText;if(l.ok){if(this.method!=="HEAD"){const E=await l.text();E===""||(this.headers.get("Accept")==="text/csv"||this.headers.get("Accept")&&(!((c=this.headers.get("Accept"))===null||c===void 0)&&c.includes("application/vnd.pgrst.plan+text"))?y=E:y=JSON.parse(E))}const w=(d=this.headers.get("Prefer"))===null||d===void 0?void 0:d.match(/count=(exact|planned|estimated)/),S=(h=l.headers.get("content-range"))===null||h===void 0?void 0:h.split("/");w&&S&&S.length>1&&(m=parseInt(S[1])),this.isMaybeSingle&&this.method==="GET"&&Array.isArray(y)&&(y.length>1?(p={code:"PGRST116",details:`Results contain ${y.length} rows, application/vnd.pgrst.object+json requires 1 row`,hint:null,message:"JSON object requested, multiple (or no) rows returned"},y=null,m=null,b=406,v="Not Acceptable"):y.length===1?y=y[0]:y=null)}else{const w=await l.text();try{p=JSON.parse(w),Array.isArray(p)&&l.status===404&&(y=[],p=null,b=200,v="OK")}catch{l.status===404&&w===""?(b=204,v="No Content"):p={message:w}}if(p&&this.isMaybeSingle&&(!((f=p==null?void 0:p.details)===null||f===void 0)&&f.includes("0 rows"))&&(p=null,b=200,v="OK"),p&&this.shouldThrowOnError)throw new e.default(p)}return{error:p,data:y,count:m,status:b,statusText:v}});return this.shouldThrowOnError||(o=o.catch(l=>{var c,d,h;return{error:{message:`${(c=l==null?void 0:l.name)!==null&&c!==void 0?c:"FetchError"}: ${l==null?void 0:l.message}`,details:`${(d=l==null?void 0:l.stack)!==null&&d!==void 0?d:""}`,hint:"",code:`${(h=l==null?void 0:l.code)!==null&&h!==void 0?h:""}`},data:null,count:null,status:0,statusText:""}})),o.then(i,a)}returns(){return this}overrideTypes(){return this}}return to.default=r,to}var Pp;function Oy(){if(Pp)return eo;Pp=1,Object.defineProperty(eo,"__esModule",{value:!0});const e=na.__importDefault(Ty());class r extends e.default{select(i){let a=!1;const s=(i??"*").split("").map(o=>/\s/.test(o)&&!a?"":(o==='"'&&(a=!a),o)).join("");return this.url.searchParams.set("select",s),this.headers.append("Prefer","return=representation"),this}order(i,{ascending:a=!0,nullsFirst:s,foreignTable:o,referencedTable:l=o}={}){const c=l?`${l}.order`:"order",d=this.url.searchParams.get(c);return this.url.searchParams.set(c,`${d?`${d},`:""}${i}.${a?"asc":"desc"}${s===void 0?"":s?".nullsfirst":".nullslast"}`),this}limit(i,{foreignTable:a,referencedTable:s=a}={}){const o=typeof s>"u"?"limit":`${s}.limit`;return this.url.searchParams.set(o,`${i}`),this}range(i,a,{foreignTable:s,referencedTable:o=s}={}){const l=typeof o>"u"?"offset":`${o}.offset`,c=typeof o>"u"?"limit":`${o}.limit`;return this.url.searchParams.set(l,`${i}`),this.url.searchParams.set(c,`${a-i+1}`),this}abortSignal(i){return this.signal=i,this}single(){return this.headers.set("Accept","application/vnd.pgrst.object+json"),this}maybeSingle(){return this.method==="GET"?this.headers.set("Accept","application/json"):this.headers.set("Accept","application/vnd.pgrst.object+json"),this.isMaybeSingle=!0,this}csv(){return this.headers.set("Accept","text/csv"),this}geojson(){return this.headers.set("Accept","application/geo+json"),this}explain({analyze:i=!1,verbose:a=!1,settings:s=!1,buffers:o=!1,wal:l=!1,format:c="text"}={}){var d;const h=[i?"analyze":null,a?"verbose":null,s?"settings":null,o?"buffers":null,l?"wal":null].filter(Boolean).join("|"),f=(d=this.headers.get("Accept"))!==null&&d!==void 0?d:"application/json";return this.headers.set("Accept",`application/vnd.pgrst.plan+${c}; for="${f}"; options=${h};`),c==="json"?this:this}rollback(){return this.headers.append("Prefer","tx=rollback"),this}returns(){return this}maxAffected(i){return this.headers.append("Prefer","handling=strict"),this.headers.append("Prefer",`max-affected=${i}`),this}}return eo.default=r,eo}var Np;function rh(){if(Np)return Qs;Np=1,Object.defineProperty(Qs,"__esModule",{value:!0});const e=na.__importDefault(Oy()),r=new RegExp("[,()]");class n extends e.default{eq(a,s){return this.url.searchParams.append(a,`eq.${s}`),this}neq(a,s){return this.url.searchParams.append(a,`neq.${s}`),this}gt(a,s){return this.url.searchParams.append(a,`gt.${s}`),this}gte(a,s){return this.url.searchParams.append(a,`gte.${s}`),this}lt(a,s){return this.url.searchParams.append(a,`lt.${s}`),this}lte(a,s){return this.url.searchParams.append(a,`lte.${s}`),this}like(a,s){return this.url.searchParams.append(a,`like.${s}`),this}likeAllOf(a,s){return this.url.searchParams.append(a,`like(all).{${s.join(",")}}`),this}likeAnyOf(a,s){return this.url.searchParams.append(a,`like(any).{${s.join(",")}}`),this}ilike(a,s){return this.url.searchParams.append(a,`ilike.${s}`),this}ilikeAllOf(a,s){return this.url.searchParams.append(a,`ilike(all).{${s.join(",")}}`),this}ilikeAnyOf(a,s){return this.url.searchParams.append(a,`ilike(any).{${s.join(",")}}`),this}is(a,s){return this.url.searchParams.append(a,`is.${s}`),this}in(a,s){const o=Array.from(new Set(s)).map(l=>typeof l=="string"&&r.test(l)?`"${l}"`:`${l}`).join(",");return this.url.searchParams.append(a,`in.(${o})`),this}contains(a,s){return typeof s=="string"?this.url.searchParams.append(a,`cs.${s}`):Array.isArray(s)?this.url.searchParams.append(a,`cs.{${s.join(",")}}`):this.url.searchParams.append(a,`cs.${JSON.stringify(s)}`),this}containedBy(a,s){return typeof s=="string"?this.url.searchParams.append(a,`cd.${s}`):Array.isArray(s)?this.url.searchParams.append(a,`cd.{${s.join(",")}}`):this.url.searchParams.append(a,`cd.${JSON.stringify(s)}`),this}rangeGt(a,s){return this.url.searchParams.append(a,`sr.${s}`),this}rangeGte(a,s){return this.url.searchParams.append(a,`nxl.${s}`),this}rangeLt(a,s){return this.url.searchParams.append(a,`sl.${s}`),this}rangeLte(a,s){return this.url.searchParams.append(a,`nxr.${s}`),this}rangeAdjacent(a,s){return this.url.searchParams.append(a,`adj.${s}`),this}overlaps(a,s){return typeof s=="string"?this.url.searchParams.append(a,`ov.${s}`):this.url.searchParams.append(a,`ov.{${s.join(",")}}`),this}textSearch(a,s,{config:o,type:l}={}){let c="";l==="plain"?c="pl":l==="phrase"?c="ph":l==="websearch"&&(c="w");const d=o===void 0?"":`(${o})`;return this.url.searchParams.append(a,`${c}fts${d}.${s}`),this}match(a){return Object.entries(a).forEach(([s,o])=>{this.url.searchParams.append(s,`eq.${o}`)}),this}not(a,s,o){return this.url.searchParams.append(a,`not.${s}.${o}`),this}or(a,{foreignTable:s,referencedTable:o=s}={}){const l=o?`${o}.or`:"or";return this.url.searchParams.append(l,`(${a})`),this}filter(a,s,o){return this.url.searchParams.append(a,`${s}.${o}`),this}}return Qs.default=n,Qs}var $p;function Py(){if($p)return Zs;$p=1,Object.defineProperty(Zs,"__esModule",{value:!0});const e=na.__importDefault(rh());class r{constructor(i,{headers:a={},schema:s,fetch:o}){this.url=i,this.headers=new Headers(a),this.schema=s,this.fetch=o}select(i,a){const{head:s=!1,count:o}=a??{},l=s?"HEAD":"GET";let c=!1;const d=(i??"*").split("").map(h=>/\s/.test(h)&&!c?"":(h==='"'&&(c=!c),h)).join("");return this.url.searchParams.set("select",d),o&&this.headers.append("Prefer",`count=${o}`),new e.default({method:l,url:this.url,headers:this.headers,schema:this.schema,fetch:this.fetch})}insert(i,{count:a,defaultToNull:s=!0}={}){var o;const l="POST";if(a&&this.headers.append("Prefer",`count=${a}`),s||this.headers.append("Prefer","missing=default"),Array.isArray(i)){const c=i.reduce((d,h)=>d.concat(Object.keys(h)),[]);if(c.length>0){const d=[...new Set(c)].map(h=>`"${h}"`);this.url.searchParams.set("columns",d.join(","))}}return new e.default({method:l,url:this.url,headers:this.headers,schema:this.schema,body:i,fetch:(o=this.fetch)!==null&&o!==void 0?o:fetch})}upsert(i,{onConflict:a,ignoreDuplicates:s=!1,count:o,defaultToNull:l=!0}={}){var c;const d="POST";if(this.headers.append("Prefer",`resolution=${s?"ignore":"merge"}-duplicates`),a!==void 0&&this.url.searchParams.set("on_conflict",a),o&&this.headers.append("Prefer",`count=${o}`),l||this.headers.append("Prefer","missing=default"),Array.isArray(i)){const h=i.reduce((f,p)=>f.concat(Object.keys(p)),[]);if(h.length>0){const f=[...new Set(h)].map(p=>`"${p}"`);this.url.searchParams.set("columns",f.join(","))}}return new e.default({method:d,url:this.url,headers:this.headers,schema:this.schema,body:i,fetch:(c=this.fetch)!==null&&c!==void 0?c:fetch})}update(i,{count:a}={}){var s;const o="PATCH";return a&&this.headers.append("Prefer",`count=${a}`),new e.default({method:o,url:this.url,headers:this.headers,schema:this.schema,body:i,fetch:(s=this.fetch)!==null&&s!==void 0?s:fetch})}delete({count:i}={}){var a;const s="DELETE";return i&&this.headers.append("Prefer",`count=${i}`),new e.default({method:s,url:this.url,headers:this.headers,schema:this.schema,fetch:(a=this.fetch)!==null&&a!==void 0?a:fetch})}}return Zs.default=r,Zs}var Rp;function j_(){if(Rp)return Xs;Rp=1,Object.defineProperty(Xs,"__esModule",{value:!0});const t=na,e=t.__importDefault(Py()),r=t.__importDefault(rh());class n{constructor(a,{headers:s={},schema:o,fetch:l}={}){this.url=a,this.headers=new Headers(s),this.schemaName=o,this.fetch=l}from(a){const s=new URL(`${this.url}/${a}`);return new e.default(s,{headers:new Headers(this.headers),schema:this.schemaName,fetch:this.fetch})}schema(a){return new n(this.url,{headers:this.headers,schema:a,fetch:this.fetch})}rpc(a,s={},{head:o=!1,get:l=!1,count:c}={}){var d;let h;const f=new URL(`${this.url}/rpc/${a}`);let p;o||l?(h=o?"HEAD":"GET",Object.entries(s).filter(([m,b])=>b!==void 0).map(([m,b])=>[m,Array.isArray(b)?`{${b.join(",")}}`:`${b}`]).forEach(([m,b])=>{f.searchParams.append(m,b)})):(h="POST",p=s);const y=new Headers(this.headers);return c&&y.set("Prefer",`count=${c}`),new r.default({method:h,url:f,headers:y,schema:this.schemaName,body:p,fetch:(d=this.fetch)!==null&&d!==void 0?d:fetch})}}return Xs.default=n,Xs}Object.defineProperty(Ct,"__esModule",{value:!0});var Ny=Ct.PostgrestError=By=Ct.PostgrestBuilder=Ly=Ct.PostgrestTransformBuilder=My=Ct.PostgrestFilterBuilder=Iy=Ct.PostgrestQueryBuilder=Ry=Ct.PostgrestClient=void 0;const ia=na,$y=ia.__importDefault(j_());var Ry=Ct.PostgrestClient=$y.default;const Ay=ia.__importDefault(Py());var Iy=Ct.PostgrestQueryBuilder=Ay.default;const Dy=ia.__importDefault(rh());var My=Ct.PostgrestFilterBuilder=Dy.default;const zy=ia.__importDefault(Oy());var Ly=Ct.PostgrestTransformBuilder=zy.default;const Fy=ia.__importDefault(Ty());var By=Ct.PostgrestBuilder=Fy.default;const Uy=ia.__importDefault(Cy());Ny=Ct.PostgrestError=Uy.default;var Hy=Ct.default={PostgrestClient:$y.default,PostgrestQueryBuilder:Ay.default,PostgrestFilterBuilder:Dy.default,PostgrestTransformBuilder:zy.default,PostgrestBuilder:Fy.default,PostgrestError:Uy.default};const C_=Ww({__proto__:null,get PostgrestBuilder(){return By},get PostgrestClient(){return Ry},get PostgrestError(){return Ny},get PostgrestFilterBuilder(){return My},get PostgrestQueryBuilder(){return Iy},get PostgrestTransformBuilder(){return Ly},default:Hy},[Ct]),{PostgrestClient:T_,PostgrestQueryBuilder:lL,PostgrestFilterBuilder:cL,PostgrestTransformBuilder:uL,PostgrestBuilder:dL,PostgrestError:hL}=Hy||C_;class O_{static detectEnvironment(){var e;if(typeof WebSocket<"u")return{type:"native",constructor:WebSocket};if(typeof globalThis<"u"&&typeof globalThis.WebSocket<"u")return{type:"native",constructor:globalThis.WebSocket};if(typeof global<"u"&&typeof global.WebSocket<"u")return{type:"native",constructor:global.WebSocket};if(typeof globalThis<"u"&&typeof globalThis.WebSocketPair<"u"&&typeof globalThis.WebSocket>"u")return{type:"cloudflare",error:"Cloudflare Workers detected. WebSocket clients are not supported in Cloudflare Workers.",workaround:"Use Cloudflare Workers WebSocket API for server-side WebSocket handling, or deploy to a different runtime."};if(typeof globalThis<"u"&&globalThis.EdgeRuntime||typeof navigator<"u"&&(!((e=navigator.userAgent)===null||e===void 0)&&e.includes("Vercel-Edge")))return{type:"unsupported",error:"Edge runtime detected (Vercel Edge/Netlify Edge). WebSockets are not supported in edge functions.",workaround:"Use serverless functions or a different deployment target for WebSocket functionality."};if(typeof process<"u"){const r=process.versions;if(r&&r.node){const n=r.node,i=parseInt(n.replace(/^v/,"").split(".")[0]);return i>=22?typeof globalThis.WebSocket<"u"?{type:"native",constructor:globalThis.WebSocket}:{type:"unsupported",error:`Node.js ${i} detected but native WebSocket not found.`,workaround:"Provide a WebSocket implementation via the transport option."}:{type:"unsupported",error:`Node.js ${i} detected without native WebSocket support.`,workaround:`For Node.js < 22, install "ws" package and provide it via the transport option:
import ws from "ws"
new RealtimeClient(url, { transport: ws })`}}}return{type:"unsupported",error:"Unknown JavaScript runtime without WebSocket support.",workaround:"Ensure you're running in a supported environment (browser, Node.js, Deno) or provide a custom WebSocket implementation."}}static getWebSocketConstructor(){const e=this.detectEnvironment();if(e.constructor)return e.constructor;let r=e.error||"WebSocket not supported in this environment.";throw e.workaround&&(r+=`

Suggested solution: ${e.workaround}`),new Error(r)}static createWebSocket(e,r){const n=this.getWebSocketConstructor();return new n(e,r)}static isWebSocketSupported(){try{const e=this.detectEnvironment();return e.type==="native"||e.type==="ws"}catch{return!1}}}const P_="2.79.0",N_=`realtime-js/${P_}`,$_="1.0.0",Mu=1e4,R_=1e3,A_=100;var Wa;(function(t){t[t.connecting=0]="connecting",t[t.open=1]="open",t[t.closing=2]="closing",t[t.closed=3]="closed"})(Wa||(Wa={}));var ft;(function(t){t.closed="closed",t.errored="errored",t.joined="joined",t.joining="joining",t.leaving="leaving"})(ft||(ft={}));var fr;(function(t){t.close="phx_close",t.error="phx_error",t.join="phx_join",t.reply="phx_reply",t.leave="phx_leave",t.access_token="access_token"})(fr||(fr={}));var zu;(function(t){t.websocket="websocket"})(zu||(zu={}));var On;(function(t){t.Connecting="connecting",t.Open="open",t.Closing="closing",t.Closed="closed"})(On||(On={}));class I_{constructor(){this.HEADER_LENGTH=1}decode(e,r){return e.constructor===ArrayBuffer?r(this._binaryDecode(e)):r(typeof e=="string"?JSON.parse(e):{})}_binaryDecode(e){const r=new DataView(e),n=new TextDecoder;return this._decodeBroadcast(e,r,n)}_decodeBroadcast(e,r,n){const i=r.getUint8(1),a=r.getUint8(2);let s=this.HEADER_LENGTH+2;const o=n.decode(e.slice(s,s+i));s=s+i;const l=n.decode(e.slice(s,s+a));s=s+a;const c=JSON.parse(n.decode(e.slice(s,e.byteLength)));return{ref:null,topic:o,event:l,payload:c}}}class Gy{constructor(e,r){this.callback=e,this.timerCalc=r,this.timer=void 0,this.tries=0,this.callback=e,this.timerCalc=r}reset(){this.tries=0,clearTimeout(this.timer),this.timer=void 0}scheduleTimeout(){clearTimeout(this.timer),this.timer=setTimeout(()=>{this.tries=this.tries+1,this.callback()},this.timerCalc(this.tries+1))}}var Ke;(function(t){t.abstime="abstime",t.bool="bool",t.date="date",t.daterange="daterange",t.float4="float4",t.float8="float8",t.int2="int2",t.int4="int4",t.int4range="int4range",t.int8="int8",t.int8range="int8range",t.json="json",t.jsonb="jsonb",t.money="money",t.numeric="numeric",t.oid="oid",t.reltime="reltime",t.text="text",t.time="time",t.timestamp="timestamp",t.timestamptz="timestamptz",t.timetz="timetz",t.tsrange="tsrange",t.tstzrange="tstzrange"})(Ke||(Ke={}));const Ap=(t,e,r={})=>{var n;const i=(n=r.skipTypes)!==null&&n!==void 0?n:[];return e?Object.keys(e).reduce((a,s)=>(a[s]=D_(s,t,e,i),a),{}):{}},D_=(t,e,r,n)=>{const i=e.find(o=>o.name===t),a=i==null?void 0:i.type,s=r[t];return a&&!n.includes(a)?Vy(a,s):Lu(s)},Vy=(t,e)=>{if(t.charAt(0)==="_"){const r=t.slice(1,t.length);return F_(e,r)}switch(t){case Ke.bool:return M_(e);case Ke.float4:case Ke.float8:case Ke.int2:case Ke.int4:case Ke.int8:case Ke.numeric:case Ke.oid:return z_(e);case Ke.json:case Ke.jsonb:return L_(e);case Ke.timestamp:return B_(e);case Ke.abstime:case Ke.date:case Ke.daterange:case Ke.int4range:case Ke.int8range:case Ke.money:case Ke.reltime:case Ke.text:case Ke.time:case Ke.timestamptz:case Ke.timetz:case Ke.tsrange:case Ke.tstzrange:return Lu(e);default:return Lu(e)}},Lu=t=>t,M_=t=>{switch(t){case"t":return!0;case"f":return!1;default:return t}},z_=t=>{if(typeof t=="string"){const e=parseFloat(t);if(!Number.isNaN(e))return e}return t},L_=t=>{if(typeof t=="string")try{return JSON.parse(t)}catch(e){return console.log(`JSON parse error: ${e}`),t}return t},F_=(t,e)=>{if(typeof t!="string")return t;const r=t.length-1,n=t[r];if(t[0]==="{"&&n==="}"){let a;const s=t.slice(1,r);try{a=JSON.parse("["+s+"]")}catch{a=s?s.split(","):[]}return a.map(o=>Vy(e,o))}return t},B_=t=>typeof t=="string"?t.replace(" ","T"):t,Wy=t=>{const e=new URL(t);return e.protocol=e.protocol.replace(/^ws/i,"http"),e.pathname=e.pathname.replace(/\/+$/,"").replace(/\/socket\/websocket$/i,"").replace(/\/socket$/i,"").replace(/\/websocket$/i,""),e.pathname===""||e.pathname==="/"?e.pathname="/api/broadcast":e.pathname=e.pathname+"/api/broadcast",e.href};class wc{constructor(e,r,n={},i=Mu){this.channel=e,this.event=r,this.payload=n,this.timeout=i,this.sent=!1,this.timeoutTimer=void 0,this.ref="",this.receivedResp=null,this.recHooks=[],this.refEvent=null}resend(e){this.timeout=e,this._cancelRefEvent(),this.ref="",this.refEvent=null,this.receivedResp=null,this.sent=!1,this.send()}send(){this._hasReceived("timeout")||(this.startTimeout(),this.sent=!0,this.channel.socket.push({topic:this.channel.topic,event:this.event,payload:this.payload,ref:this.ref,join_ref:this.channel._joinRef()}))}updatePayload(e){this.payload=Object.assign(Object.assign({},this.payload),e)}receive(e,r){var n;return this._hasReceived(e)&&r((n=this.receivedResp)===null||n===void 0?void 0:n.response),this.recHooks.push({status:e,callback:r}),this}startTimeout(){if(this.timeoutTimer)return;this.ref=this.channel.socket._makeRef(),this.refEvent=this.channel._replyEventName(this.ref);const e=r=>{this._cancelRefEvent(),this._cancelTimeout(),this.receivedResp=r,this._matchReceive(r)};this.channel._on(this.refEvent,{},e),this.timeoutTimer=setTimeout(()=>{this.trigger("timeout",{})},this.timeout)}trigger(e,r){this.refEvent&&this.channel._trigger(this.refEvent,{status:e,response:r})}destroy(){this._cancelRefEvent(),this._cancelTimeout()}_cancelRefEvent(){this.refEvent&&this.channel._off(this.refEvent,{})}_cancelTimeout(){clearTimeout(this.timeoutTimer),this.timeoutTimer=void 0}_matchReceive({status:e,response:r}){this.recHooks.filter(n=>n.status===e).forEach(n=>n.callback(r))}_hasReceived(e){return this.receivedResp&&this.receivedResp.status===e}}var Ip;(function(t){t.SYNC="sync",t.JOIN="join",t.LEAVE="leave"})(Ip||(Ip={}));class Ka{constructor(e,r){this.channel=e,this.state={},this.pendingDiffs=[],this.joinRef=null,this.enabled=!1,this.caller={onJoin:()=>{},onLeave:()=>{},onSync:()=>{}};const n=(r==null?void 0:r.events)||{state:"presence_state",diff:"presence_diff"};this.channel._on(n.state,{},i=>{const{onJoin:a,onLeave:s,onSync:o}=this.caller;this.joinRef=this.channel._joinRef(),this.state=Ka.syncState(this.state,i,a,s),this.pendingDiffs.forEach(l=>{this.state=Ka.syncDiff(this.state,l,a,s)}),this.pendingDiffs=[],o()}),this.channel._on(n.diff,{},i=>{const{onJoin:a,onLeave:s,onSync:o}=this.caller;this.inPendingSyncState()?this.pendingDiffs.push(i):(this.state=Ka.syncDiff(this.state,i,a,s),o())}),this.onJoin((i,a,s)=>{this.channel._trigger("presence",{event:"join",key:i,currentPresences:a,newPresences:s})}),this.onLeave((i,a,s)=>{this.channel._trigger("presence",{event:"leave",key:i,currentPresences:a,leftPresences:s})}),this.onSync(()=>{this.channel._trigger("presence",{event:"sync"})})}static syncState(e,r,n,i){const a=this.cloneDeep(e),s=this.transformState(r),o={},l={};return this.map(a,(c,d)=>{s[c]||(l[c]=d)}),this.map(s,(c,d)=>{const h=a[c];if(h){const f=d.map(b=>b.presence_ref),p=h.map(b=>b.presence_ref),y=d.filter(b=>p.indexOf(b.presence_ref)<0),m=h.filter(b=>f.indexOf(b.presence_ref)<0);y.length>0&&(o[c]=y),m.length>0&&(l[c]=m)}else o[c]=d}),this.syncDiff(a,{joins:o,leaves:l},n,i)}static syncDiff(e,r,n,i){const{joins:a,leaves:s}={joins:this.transformState(r.joins),leaves:this.transformState(r.leaves)};return n||(n=()=>{}),i||(i=()=>{}),this.map(a,(o,l)=>{var c;const d=(c=e[o])!==null&&c!==void 0?c:[];if(e[o]=this.cloneDeep(l),d.length>0){const h=e[o].map(p=>p.presence_ref),f=d.filter(p=>h.indexOf(p.presence_ref)<0);e[o].unshift(...f)}n(o,d,l)}),this.map(s,(o,l)=>{let c=e[o];if(!c)return;const d=l.map(h=>h.presence_ref);c=c.filter(h=>d.indexOf(h.presence_ref)<0),e[o]=c,i(o,c,l),c.length===0&&delete e[o]}),e}static map(e,r){return Object.getOwnPropertyNames(e).map(n=>r(n,e[n]))}static transformState(e){return e=this.cloneDeep(e),Object.getOwnPropertyNames(e).reduce((r,n)=>{const i=e[n];return"metas"in i?r[n]=i.metas.map(a=>(a.presence_ref=a.phx_ref,delete a.phx_ref,delete a.phx_ref_prev,a)):r[n]=i,r},{})}static cloneDeep(e){return JSON.parse(JSON.stringify(e))}onJoin(e){this.caller.onJoin=e}onLeave(e){this.caller.onLeave=e}onSync(e){this.caller.onSync=e}inPendingSyncState(){return!this.joinRef||this.joinRef!==this.channel._joinRef()}}var Dp;(function(t){t.ALL="*",t.INSERT="INSERT",t.UPDATE="UPDATE",t.DELETE="DELETE"})(Dp||(Dp={}));var qa;(function(t){t.BROADCAST="broadcast",t.PRESENCE="presence",t.POSTGRES_CHANGES="postgres_changes",t.SYSTEM="system"})(qa||(qa={}));var $r;(function(t){t.SUBSCRIBED="SUBSCRIBED",t.TIMED_OUT="TIMED_OUT",t.CLOSED="CLOSED",t.CHANNEL_ERROR="CHANNEL_ERROR"})($r||($r={}));class nh{constructor(e,r={config:{}},n){var i,a;if(this.topic=e,this.params=r,this.socket=n,this.bindings={},this.state=ft.closed,this.joinedOnce=!1,this.pushBuffer=[],this.subTopic=e.replace(/^realtime:/i,""),this.params.config=Object.assign({broadcast:{ack:!1,self:!1},presence:{key:"",enabled:!1},private:!1},r.config),this.timeout=this.socket.timeout,this.joinPush=new wc(this,fr.join,this.params,this.timeout),this.rejoinTimer=new Gy(()=>this._rejoinUntilConnected(),this.socket.reconnectAfterMs),this.joinPush.receive("ok",()=>{this.state=ft.joined,this.rejoinTimer.reset(),this.pushBuffer.forEach(s=>s.send()),this.pushBuffer=[]}),this._onClose(()=>{this.rejoinTimer.reset(),this.socket.log("channel",`close ${this.topic} ${this._joinRef()}`),this.state=ft.closed,this.socket._remove(this)}),this._onError(s=>{this._isLeaving()||this._isClosed()||(this.socket.log("channel",`error ${this.topic}`,s),this.state=ft.errored,this.rejoinTimer.scheduleTimeout())}),this.joinPush.receive("timeout",()=>{this._isJoining()&&(this.socket.log("channel",`timeout ${this.topic}`,this.joinPush.timeout),this.state=ft.errored,this.rejoinTimer.scheduleTimeout())}),this.joinPush.receive("error",s=>{this._isLeaving()||this._isClosed()||(this.socket.log("channel",`error ${this.topic}`,s),this.state=ft.errored,this.rejoinTimer.scheduleTimeout())}),this._on(fr.reply,{},(s,o)=>{this._trigger(this._replyEventName(o),s)}),this.presence=new Ka(this),this.broadcastEndpointURL=Wy(this.socket.endPoint),this.private=this.params.config.private||!1,!this.private&&(!((a=(i=this.params.config)===null||i===void 0?void 0:i.broadcast)===null||a===void 0)&&a.replay))throw`tried to use replay on public channel '${this.topic}'. It must be a private channel.`}subscribe(e,r=this.timeout){var n,i,a;if(this.socket.isConnected()||this.socket.connect(),this.state==ft.closed){const{config:{broadcast:s,presence:o,private:l}}=this.params,c=(i=(n=this.bindings.postgres_changes)===null||n===void 0?void 0:n.map(p=>p.filter))!==null&&i!==void 0?i:[],d=!!this.bindings[qa.PRESENCE]&&this.bindings[qa.PRESENCE].length>0||((a=this.params.config.presence)===null||a===void 0?void 0:a.enabled)===!0,h={},f={broadcast:s,presence:Object.assign(Object.assign({},o),{enabled:d}),postgres_changes:c,private:l};this.socket.accessTokenValue&&(h.access_token=this.socket.accessTokenValue),this._onError(p=>e==null?void 0:e($r.CHANNEL_ERROR,p)),this._onClose(()=>e==null?void 0:e($r.CLOSED)),this.updateJoinPayload(Object.assign({config:f},h)),this.joinedOnce=!0,this._rejoin(r),this.joinPush.receive("ok",async({postgres_changes:p})=>{var y;if(this.socket.setAuth(),p===void 0){e==null||e($r.SUBSCRIBED);return}else{const m=this.bindings.postgres_changes,b=(y=m==null?void 0:m.length)!==null&&y!==void 0?y:0,v=[];for(let g=0;g<b;g++){const w=m[g],{filter:{event:S,schema:E,table:k,filter:C}}=w,N=p&&p[g];if(N&&N.event===S&&N.schema===E&&N.table===k&&N.filter===C)v.push(Object.assign(Object.assign({},w),{id:N.id}));else{this.unsubscribe(),this.state=ft.errored,e==null||e($r.CHANNEL_ERROR,new Error("mismatch between server and client bindings for postgres changes"));return}}this.bindings.postgres_changes=v,e&&e($r.SUBSCRIBED);return}}).receive("error",p=>{this.state=ft.errored,e==null||e($r.CHANNEL_ERROR,new Error(JSON.stringify(Object.values(p).join(", ")||"error")))}).receive("timeout",()=>{e==null||e($r.TIMED_OUT)})}return this}presenceState(){return this.presence.state}async track(e,r={}){return await this.send({type:"presence",event:"track",payload:e},r.timeout||this.timeout)}async untrack(e={}){return await this.send({type:"presence",event:"untrack"},e)}on(e,r,n){return this.state===ft.joined&&e===qa.PRESENCE&&(this.socket.log("channel",`resubscribe to ${this.topic} due to change in presence callbacks on joined channel`),this.unsubscribe().then(()=>this.subscribe())),this._on(e,r,n)}async httpSend(e,r,n={}){var i;const a=this.socket.accessTokenValue?`Bearer ${this.socket.accessTokenValue}`:"";if(r==null)return Promise.reject("Payload is required for httpSend()");const s={method:"POST",headers:{Authorization:a,apikey:this.socket.apiKey?this.socket.apiKey:"","Content-Type":"application/json"},body:JSON.stringify({messages:[{topic:this.subTopic,event:e,payload:r,private:this.private}]})},o=await this._fetchWithTimeout(this.broadcastEndpointURL,s,(i=n.timeout)!==null&&i!==void 0?i:this.timeout);if(o.status===202)return{success:!0};let l=o.statusText;try{const c=await o.json();l=c.error||c.message||l}catch{}return Promise.reject(new Error(l))}async send(e,r={}){var n,i;if(!this._canPush()&&e.type==="broadcast"){console.warn("Realtime send() is automatically falling back to REST API. This behavior will be deprecated in the future. Please use httpSend() explicitly for REST delivery.");const{event:a,payload:s}=e,l={method:"POST",headers:{Authorization:this.socket.accessTokenValue?`Bearer ${this.socket.accessTokenValue}`:"",apikey:this.socket.apiKey?this.socket.apiKey:"","Content-Type":"application/json"},body:JSON.stringify({messages:[{topic:this.subTopic,event:a,payload:s,private:this.private}]})};try{const c=await this._fetchWithTimeout(this.broadcastEndpointURL,l,(n=r.timeout)!==null&&n!==void 0?n:this.timeout);return await((i=c.body)===null||i===void 0?void 0:i.cancel()),c.ok?"ok":"error"}catch(c){return c.name==="AbortError"?"timed out":"error"}}else return new Promise(a=>{var s,o,l;const c=this._push(e.type,e,r.timeout||this.timeout);e.type==="broadcast"&&!(!((l=(o=(s=this.params)===null||s===void 0?void 0:s.config)===null||o===void 0?void 0:o.broadcast)===null||l===void 0)&&l.ack)&&a("ok"),c.receive("ok",()=>a("ok")),c.receive("error",()=>a("error")),c.receive("timeout",()=>a("timed out"))})}updateJoinPayload(e){this.joinPush.updatePayload(e)}unsubscribe(e=this.timeout){this.state=ft.leaving;const r=()=>{this.socket.log("channel",`leave ${this.topic}`),this._trigger(fr.close,"leave",this._joinRef())};this.joinPush.destroy();let n=null;return new Promise(i=>{n=new wc(this,fr.leave,{},e),n.receive("ok",()=>{r(),i("ok")}).receive("timeout",()=>{r(),i("timed out")}).receive("error",()=>{i("error")}),n.send(),this._canPush()||n.trigger("ok",{})}).finally(()=>{n==null||n.destroy()})}teardown(){this.pushBuffer.forEach(e=>e.destroy()),this.pushBuffer=[],this.rejoinTimer.reset(),this.joinPush.destroy(),this.state=ft.closed,this.bindings={}}async _fetchWithTimeout(e,r,n){const i=new AbortController,a=setTimeout(()=>i.abort(),n),s=await this.socket.fetch(e,Object.assign(Object.assign({},r),{signal:i.signal}));return clearTimeout(a),s}_push(e,r,n=this.timeout){if(!this.joinedOnce)throw`tried to push '${e}' to '${this.topic}' before joining. Use channel.subscribe() before pushing events`;let i=new wc(this,e,r,n);return this._canPush()?i.send():this._addToPushBuffer(i),i}_addToPushBuffer(e){if(e.startTimeout(),this.pushBuffer.push(e),this.pushBuffer.length>A_){const r=this.pushBuffer.shift();r&&(r.destroy(),this.socket.log("channel",`discarded push due to buffer overflow: ${r.event}`,r.payload))}}_onMessage(e,r,n){return r}_isMember(e){return this.topic===e}_joinRef(){return this.joinPush.ref}_trigger(e,r,n){var i,a;const s=e.toLocaleLowerCase(),{close:o,error:l,leave:c,join:d}=fr;if(n&&[o,l,c,d].indexOf(s)>=0&&n!==this._joinRef())return;let f=this._onMessage(s,r,n);if(r&&!f)throw"channel onMessage callbacks must return the payload, modified or unmodified";["insert","update","delete"].includes(s)?(i=this.bindings.postgres_changes)===null||i===void 0||i.filter(p=>{var y,m,b;return((y=p.filter)===null||y===void 0?void 0:y.event)==="*"||((b=(m=p.filter)===null||m===void 0?void 0:m.event)===null||b===void 0?void 0:b.toLocaleLowerCase())===s}).map(p=>p.callback(f,n)):(a=this.bindings[s])===null||a===void 0||a.filter(p=>{var y,m,b,v,g,w;if(["broadcast","presence","postgres_changes"].includes(s))if("id"in p){const S=p.id,E=(y=p.filter)===null||y===void 0?void 0:y.event;return S&&((m=r.ids)===null||m===void 0?void 0:m.includes(S))&&(E==="*"||(E==null?void 0:E.toLocaleLowerCase())===((b=r.data)===null||b===void 0?void 0:b.type.toLocaleLowerCase()))}else{const S=(g=(v=p==null?void 0:p.filter)===null||v===void 0?void 0:v.event)===null||g===void 0?void 0:g.toLocaleLowerCase();return S==="*"||S===((w=r==null?void 0:r.event)===null||w===void 0?void 0:w.toLocaleLowerCase())}else return p.type.toLocaleLowerCase()===s}).map(p=>{if(typeof f=="object"&&"ids"in f){const y=f.data,{schema:m,table:b,commit_timestamp:v,type:g,errors:w}=y;f=Object.assign(Object.assign({},{schema:m,table:b,commit_timestamp:v,eventType:g,new:{},old:{},errors:w}),this._getPayloadRecords(y))}p.callback(f,n)})}_isClosed(){return this.state===ft.closed}_isJoined(){return this.state===ft.joined}_isJoining(){return this.state===ft.joining}_isLeaving(){return this.state===ft.leaving}_replyEventName(e){return`chan_reply_${e}`}_on(e,r,n){const i=e.toLocaleLowerCase(),a={type:i,filter:r,callback:n};return this.bindings[i]?this.bindings[i].push(a):this.bindings[i]=[a],this}_off(e,r){const n=e.toLocaleLowerCase();return this.bindings[n]&&(this.bindings[n]=this.bindings[n].filter(i=>{var a;return!(((a=i.type)===null||a===void 0?void 0:a.toLocaleLowerCase())===n&&nh.isEqual(i.filter,r))})),this}static isEqual(e,r){if(Object.keys(e).length!==Object.keys(r).length)return!1;for(const n in e)if(e[n]!==r[n])return!1;return!0}_rejoinUntilConnected(){this.rejoinTimer.scheduleTimeout(),this.socket.isConnected()&&this._rejoin()}_onClose(e){this._on(fr.close,{},e)}_onError(e){this._on(fr.error,{},r=>e(r))}_canPush(){return this.socket.isConnected()&&this._isJoined()}_rejoin(e=this.timeout){this._isLeaving()||(this.socket._leaveOpenTopic(this.topic),this.state=ft.joining,this.joinPush.resend(e))}_getPayloadRecords(e){const r={new:{},old:{}};return(e.type==="INSERT"||e.type==="UPDATE")&&(r.new=Ap(e.columns,e.record)),(e.type==="UPDATE"||e.type==="DELETE")&&(r.old=Ap(e.columns,e.old_record)),r}}const xc=()=>{},no={HEARTBEAT_INTERVAL:25e3,RECONNECT_DELAY:10,HEARTBEAT_TIMEOUT_FALLBACK:100},U_=[1e3,2e3,5e3,1e4],H_=1e4,G_=`
  addEventListener("message", (e) => {
    if (e.data.event === "start") {
      setInterval(() => postMessage({ event: "keepAlive" }), e.data.interval);
    }
  });`;class V_{constructor(e,r){var n;if(this.accessTokenValue=null,this.apiKey=null,this.channels=new Array,this.endPoint="",this.httpEndpoint="",this.headers={},this.params={},this.timeout=Mu,this.transport=null,this.heartbeatIntervalMs=no.HEARTBEAT_INTERVAL,this.heartbeatTimer=void 0,this.pendingHeartbeatRef=null,this.heartbeatCallback=xc,this.ref=0,this.reconnectTimer=null,this.logger=xc,this.conn=null,this.sendBuffer=[],this.serializer=new I_,this.stateChangeCallbacks={open:[],close:[],error:[],message:[]},this.accessToken=null,this._connectionState="disconnected",this._wasManualDisconnect=!1,this._authPromise=null,this._resolveFetch=i=>i?(...a)=>i(...a):(...a)=>fetch(...a),!(!((n=r==null?void 0:r.params)===null||n===void 0)&&n.apikey))throw new Error("API key is required to connect to Realtime");this.apiKey=r.params.apikey,this.endPoint=`${e}/${zu.websocket}`,this.httpEndpoint=Wy(e),this._initializeOptions(r),this._setupReconnectionTimer(),this.fetch=this._resolveFetch(r==null?void 0:r.fetch)}connect(){if(!(this.isConnecting()||this.isDisconnecting()||this.conn!==null&&this.isConnected())){if(this._setConnectionState("connecting"),this._setAuthSafely("connect"),this.transport)this.conn=new this.transport(this.endpointURL());else try{this.conn=O_.createWebSocket(this.endpointURL())}catch(e){this._setConnectionState("disconnected");const r=e.message;throw r.includes("Node.js")?new Error(`${r}

To use Realtime in Node.js, you need to provide a WebSocket implementation:

Option 1: Use Node.js 22+ which has native WebSocket support
Option 2: Install and provide the "ws" package:

  npm install ws

  import ws from "ws"
  const client = new RealtimeClient(url, {
    ...options,
    transport: ws
  })`):new Error(`WebSocket not available: ${r}`)}this._setupConnectionHandlers()}}endpointURL(){return this._appendParams(this.endPoint,Object.assign({},this.params,{vsn:$_}))}disconnect(e,r){if(!this.isDisconnecting())if(this._setConnectionState("disconnecting",!0),this.conn){const n=setTimeout(()=>{this._setConnectionState("disconnected")},100);this.conn.onclose=()=>{clearTimeout(n),this._setConnectionState("disconnected")},e?this.conn.close(e,r??""):this.conn.close(),this._teardownConnection()}else this._setConnectionState("disconnected")}getChannels(){return this.channels}async removeChannel(e){const r=await e.unsubscribe();return this.channels.length===0&&this.disconnect(),r}async removeAllChannels(){const e=await Promise.all(this.channels.map(r=>r.unsubscribe()));return this.channels=[],this.disconnect(),e}log(e,r,n){this.logger(e,r,n)}connectionState(){switch(this.conn&&this.conn.readyState){case Wa.connecting:return On.Connecting;case Wa.open:return On.Open;case Wa.closing:return On.Closing;default:return On.Closed}}isConnected(){return this.connectionState()===On.Open}isConnecting(){return this._connectionState==="connecting"}isDisconnecting(){return this._connectionState==="disconnecting"}channel(e,r={config:{}}){const n=`realtime:${e}`,i=this.getChannels().find(a=>a.topic===n);if(i)return i;{const a=new nh(`realtime:${e}`,r,this);return this.channels.push(a),a}}push(e){const{topic:r,event:n,payload:i,ref:a}=e,s=()=>{this.encode(e,o=>{var l;(l=this.conn)===null||l===void 0||l.send(o)})};this.log("push",`${r} ${n} (${a})`,i),this.isConnected()?s():this.sendBuffer.push(s)}async setAuth(e=null){this._authPromise=this._performAuth(e);try{await this._authPromise}finally{this._authPromise=null}}async sendHeartbeat(){var e;if(!this.isConnected()){try{this.heartbeatCallback("disconnected")}catch(r){this.log("error","error in heartbeat callback",r)}return}if(this.pendingHeartbeatRef){this.pendingHeartbeatRef=null,this.log("transport","heartbeat timeout. Attempting to re-establish connection");try{this.heartbeatCallback("timeout")}catch(r){this.log("error","error in heartbeat callback",r)}this._wasManualDisconnect=!1,(e=this.conn)===null||e===void 0||e.close(R_,"heartbeat timeout"),setTimeout(()=>{var r;this.isConnected()||(r=this.reconnectTimer)===null||r===void 0||r.scheduleTimeout()},no.HEARTBEAT_TIMEOUT_FALLBACK);return}this.pendingHeartbeatRef=this._makeRef(),this.push({topic:"phoenix",event:"heartbeat",payload:{},ref:this.pendingHeartbeatRef});try{this.heartbeatCallback("sent")}catch(r){this.log("error","error in heartbeat callback",r)}this._setAuthSafely("heartbeat")}onHeartbeat(e){this.heartbeatCallback=e}flushSendBuffer(){this.isConnected()&&this.sendBuffer.length>0&&(this.sendBuffer.forEach(e=>e()),this.sendBuffer=[])}_makeRef(){let e=this.ref+1;return e===this.ref?this.ref=0:this.ref=e,this.ref.toString()}_leaveOpenTopic(e){let r=this.channels.find(n=>n.topic===e&&(n._isJoined()||n._isJoining()));r&&(this.log("transport",`leaving duplicate topic "${e}"`),r.unsubscribe())}_remove(e){this.channels=this.channels.filter(r=>r.topic!==e.topic)}_onConnMessage(e){this.decode(e.data,r=>{if(r.topic==="phoenix"&&r.event==="phx_reply")try{this.heartbeatCallback(r.payload.status==="ok"?"ok":"error")}catch(c){this.log("error","error in heartbeat callback",c)}r.ref&&r.ref===this.pendingHeartbeatRef&&(this.pendingHeartbeatRef=null);const{topic:n,event:i,payload:a,ref:s}=r,o=s?`(${s})`:"",l=a.status||"";this.log("receive",`${l} ${n} ${i} ${o}`.trim(),a),this.channels.filter(c=>c._isMember(n)).forEach(c=>c._trigger(i,a,s)),this._triggerStateCallbacks("message",r)})}_clearTimer(e){var r;e==="heartbeat"&&this.heartbeatTimer?(clearInterval(this.heartbeatTimer),this.heartbeatTimer=void 0):e==="reconnect"&&((r=this.reconnectTimer)===null||r===void 0||r.reset())}_clearAllTimers(){this._clearTimer("heartbeat"),this._clearTimer("reconnect")}_setupConnectionHandlers(){this.conn&&("binaryType"in this.conn&&(this.conn.binaryType="arraybuffer"),this.conn.onopen=()=>this._onConnOpen(),this.conn.onerror=e=>this._onConnError(e),this.conn.onmessage=e=>this._onConnMessage(e),this.conn.onclose=e=>this._onConnClose(e))}_teardownConnection(){this.conn&&(this.conn.onopen=null,this.conn.onerror=null,this.conn.onmessage=null,this.conn.onclose=null,this.conn=null),this._clearAllTimers(),this.channels.forEach(e=>e.teardown())}_onConnOpen(){this._setConnectionState("connected"),this.log("transport",`connected to ${this.endpointURL()}`),this.flushSendBuffer(),this._clearTimer("reconnect"),this.worker?this.workerRef||this._startWorkerHeartbeat():this._startHeartbeat(),this._triggerStateCallbacks("open")}_startHeartbeat(){this.heartbeatTimer&&clearInterval(this.heartbeatTimer),this.heartbeatTimer=setInterval(()=>this.sendHeartbeat(),this.heartbeatIntervalMs)}_startWorkerHeartbeat(){this.workerUrl?this.log("worker",`starting worker for from ${this.workerUrl}`):this.log("worker","starting default worker");const e=this._workerObjectUrl(this.workerUrl);this.workerRef=new Worker(e),this.workerRef.onerror=r=>{this.log("worker","worker error",r.message),this.workerRef.terminate()},this.workerRef.onmessage=r=>{r.data.event==="keepAlive"&&this.sendHeartbeat()},this.workerRef.postMessage({event:"start",interval:this.heartbeatIntervalMs})}_onConnClose(e){var r;this._setConnectionState("disconnected"),this.log("transport","close",e),this._triggerChanError(),this._clearTimer("heartbeat"),this._wasManualDisconnect||(r=this.reconnectTimer)===null||r===void 0||r.scheduleTimeout(),this._triggerStateCallbacks("close",e)}_onConnError(e){this._setConnectionState("disconnected"),this.log("transport",`${e}`),this._triggerChanError(),this._triggerStateCallbacks("error",e)}_triggerChanError(){this.channels.forEach(e=>e._trigger(fr.error))}_appendParams(e,r){if(Object.keys(r).length===0)return e;const n=e.match(/\?/)?"&":"?",i=new URLSearchParams(r);return`${e}${n}${i}`}_workerObjectUrl(e){let r;if(e)r=e;else{const n=new Blob([G_],{type:"application/javascript"});r=URL.createObjectURL(n)}return r}_setConnectionState(e,r=!1){this._connectionState=e,e==="connecting"?this._wasManualDisconnect=!1:e==="disconnecting"&&(this._wasManualDisconnect=r)}async _performAuth(e=null){let r;e?r=e:this.accessToken?r=await this.accessToken():r=this.accessTokenValue,this.accessTokenValue!=r&&(this.accessTokenValue=r,this.channels.forEach(n=>{const i={access_token:r,version:N_};r&&n.updateJoinPayload(i),n.joinedOnce&&n._isJoined()&&n._push(fr.access_token,{access_token:r})}))}async _waitForAuthIfNeeded(){this._authPromise&&await this._authPromise}_setAuthSafely(e="general"){this.setAuth().catch(r=>{this.log("error",`error setting auth in ${e}`,r)})}_triggerStateCallbacks(e,r){try{this.stateChangeCallbacks[e].forEach(n=>{try{n(r)}catch(i){this.log("error",`error in ${e} callback`,i)}})}catch(n){this.log("error",`error triggering ${e} callbacks`,n)}}_setupReconnectionTimer(){this.reconnectTimer=new Gy(async()=>{setTimeout(async()=>{await this._waitForAuthIfNeeded(),this.isConnected()||this.connect()},no.RECONNECT_DELAY)},this.reconnectAfterMs)}_initializeOptions(e){var r,n,i,a,s,o,l,c,d;if(this.transport=(r=e==null?void 0:e.transport)!==null&&r!==void 0?r:null,this.timeout=(n=e==null?void 0:e.timeout)!==null&&n!==void 0?n:Mu,this.heartbeatIntervalMs=(i=e==null?void 0:e.heartbeatIntervalMs)!==null&&i!==void 0?i:no.HEARTBEAT_INTERVAL,this.worker=(a=e==null?void 0:e.worker)!==null&&a!==void 0?a:!1,this.accessToken=(s=e==null?void 0:e.accessToken)!==null&&s!==void 0?s:null,this.heartbeatCallback=(o=e==null?void 0:e.heartbeatCallback)!==null&&o!==void 0?o:xc,e!=null&&e.params&&(this.params=e.params),e!=null&&e.logger&&(this.logger=e.logger),(e!=null&&e.logLevel||e!=null&&e.log_level)&&(this.logLevel=e.logLevel||e.log_level,this.params=Object.assign(Object.assign({},this.params),{log_level:this.logLevel})),this.reconnectAfterMs=(l=e==null?void 0:e.reconnectAfterMs)!==null&&l!==void 0?l:h=>U_[h-1]||H_,this.encode=(c=e==null?void 0:e.encode)!==null&&c!==void 0?c:(h,f)=>f(JSON.stringify(h)),this.decode=(d=e==null?void 0:e.decode)!==null&&d!==void 0?d:this.serializer.decode.bind(this.serializer),this.worker){if(typeof window<"u"&&!window.Worker)throw new Error("Web Worker is not supported");this.workerUrl=e==null?void 0:e.workerUrl}}}class ih extends Error{constructor(e){super(e),this.__isStorageError=!0,this.name="StorageError"}}function nt(t){return typeof t=="object"&&t!==null&&"__isStorageError"in t}class W_ extends ih{constructor(e,r,n){super(e),this.name="StorageApiError",this.status=r,this.statusCode=n}toJSON(){return{name:this.name,message:this.message,status:this.status,statusCode:this.statusCode}}}class Fu extends ih{constructor(e,r){super(e),this.name="StorageUnknownError",this.originalError=r}}const ah=t=>t?(...e)=>t(...e):(...e)=>fetch(...e),K_=()=>Response,Bu=t=>{if(Array.isArray(t))return t.map(r=>Bu(r));if(typeof t=="function"||t!==Object(t))return t;const e={};return Object.entries(t).forEach(([r,n])=>{const i=r.replace(/([-_][a-z])/gi,a=>a.toUpperCase().replace(/[-_]/g,""));e[i]=Bu(n)}),e},q_=t=>{if(typeof t!="object"||t===null)return!1;const e=Object.getPrototypeOf(t);return(e===null||e===Object.prototype||Object.getPrototypeOf(e)===null)&&!(Symbol.toStringTag in t)&&!(Symbol.iterator in t)},_c=t=>{var e;return t.msg||t.message||t.error_description||(typeof t.error=="string"?t.error:(e=t.error)===null||e===void 0?void 0:e.message)||JSON.stringify(t)},Y_=(t,e,r)=>me(void 0,void 0,void 0,function*(){const n=yield K_();t instanceof n&&!(r!=null&&r.noResolveJson)?t.json().then(i=>{const a=t.status||500,s=(i==null?void 0:i.statusCode)||a+"";e(new W_(_c(i),a,s))}).catch(i=>{e(new Fu(_c(i),i))}):e(new Fu(_c(t),t))}),J_=(t,e,r,n)=>{const i={method:t,headers:(e==null?void 0:e.headers)||{}};return t==="GET"||!n?i:(q_(n)?(i.headers=Object.assign({"Content-Type":"application/json"},e==null?void 0:e.headers),i.body=JSON.stringify(n)):i.body=n,e!=null&&e.duplex&&(i.duplex=e.duplex),Object.assign(Object.assign({},i),r))};function ks(t,e,r,n,i,a){return me(this,void 0,void 0,function*(){return new Promise((s,o)=>{t(r,J_(e,n,i,a)).then(l=>{if(!l.ok)throw l;return n!=null&&n.noResolveJson?l:l.json()}).then(l=>s(l)).catch(l=>Y_(l,o,n))})})}function ps(t,e,r,n){return me(this,void 0,void 0,function*(){return ks(t,"GET",e,r,n)})}function dr(t,e,r,n,i){return me(this,void 0,void 0,function*(){return ks(t,"POST",e,n,i,r)})}function Uu(t,e,r,n,i){return me(this,void 0,void 0,function*(){return ks(t,"PUT",e,n,i,r)})}function X_(t,e,r,n){return me(this,void 0,void 0,function*(){return ks(t,"HEAD",e,Object.assign(Object.assign({},r),{noResolveJson:!0}),n)})}function sh(t,e,r,n,i){return me(this,void 0,void 0,function*(){return ks(t,"DELETE",e,n,i,r)})}class Z_{constructor(e,r){this.downloadFn=e,this.shouldThrowOnError=r}then(e,r){return this.execute().then(e,r)}execute(){return me(this,void 0,void 0,function*(){try{return{data:(yield this.downloadFn()).body,error:null}}catch(e){if(this.shouldThrowOnError)throw e;if(nt(e))return{data:null,error:e};throw e}})}}var Ky;class Q_{constructor(e,r){this.downloadFn=e,this.shouldThrowOnError=r,this[Ky]="BlobDownloadBuilder",this.promise=null}asStream(){return new Z_(this.downloadFn,this.shouldThrowOnError)}then(e,r){return this.getPromise().then(e,r)}catch(e){return this.getPromise().catch(e)}finally(e){return this.getPromise().finally(e)}getPromise(){return this.promise||(this.promise=this.execute()),this.promise}execute(){return me(this,void 0,void 0,function*(){try{return{data:yield(yield this.downloadFn()).blob(),error:null}}catch(e){if(this.shouldThrowOnError)throw e;if(nt(e))return{data:null,error:e};throw e}})}}Ky=Symbol.toStringTag;const e2={limit:100,offset:0,sortBy:{column:"name",order:"asc"}},Mp={cacheControl:"3600",contentType:"text/plain;charset=UTF-8",upsert:!1};class t2{constructor(e,r={},n,i){this.shouldThrowOnError=!1,this.url=e,this.headers=r,this.bucketId=n,this.fetch=ah(i)}throwOnError(){return this.shouldThrowOnError=!0,this}uploadOrUpdate(e,r,n,i){return me(this,void 0,void 0,function*(){try{let a;const s=Object.assign(Object.assign({},Mp),i);let o=Object.assign(Object.assign({},this.headers),e==="POST"&&{"x-upsert":String(s.upsert)});const l=s.metadata;typeof Blob<"u"&&n instanceof Blob?(a=new FormData,a.append("cacheControl",s.cacheControl),l&&a.append("metadata",this.encodeMetadata(l)),a.append("",n)):typeof FormData<"u"&&n instanceof FormData?(a=n,a.has("cacheControl")||a.append("cacheControl",s.cacheControl),l&&!a.has("metadata")&&a.append("metadata",this.encodeMetadata(l))):(a=n,o["cache-control"]=`max-age=${s.cacheControl}`,o["content-type"]=s.contentType,l&&(o["x-metadata"]=this.toBase64(this.encodeMetadata(l))),(typeof ReadableStream<"u"&&a instanceof ReadableStream||a&&typeof a=="object"&&"pipe"in a&&typeof a.pipe=="function")&&!s.duplex&&(s.duplex="half")),i!=null&&i.headers&&(o=Object.assign(Object.assign({},o),i.headers));const c=this._removeEmptyFolders(r),d=this._getFinalPath(c),h=yield(e=="PUT"?Uu:dr)(this.fetch,`${this.url}/object/${d}`,a,Object.assign({headers:o},s!=null&&s.duplex?{duplex:s.duplex}:{}));return{data:{path:c,id:h.Id,fullPath:h.Key},error:null}}catch(a){if(this.shouldThrowOnError)throw a;if(nt(a))return{data:null,error:a};throw a}})}upload(e,r,n){return me(this,void 0,void 0,function*(){return this.uploadOrUpdate("POST",e,r,n)})}uploadToSignedUrl(e,r,n,i){return me(this,void 0,void 0,function*(){const a=this._removeEmptyFolders(e),s=this._getFinalPath(a),o=new URL(this.url+`/object/upload/sign/${s}`);o.searchParams.set("token",r);try{let l;const c=Object.assign({upsert:Mp.upsert},i),d=Object.assign(Object.assign({},this.headers),{"x-upsert":String(c.upsert)});typeof Blob<"u"&&n instanceof Blob?(l=new FormData,l.append("cacheControl",c.cacheControl),l.append("",n)):typeof FormData<"u"&&n instanceof FormData?(l=n,l.append("cacheControl",c.cacheControl)):(l=n,d["cache-control"]=`max-age=${c.cacheControl}`,d["content-type"]=c.contentType);const h=yield Uu(this.fetch,o.toString(),l,{headers:d});return{data:{path:a,fullPath:h.Key},error:null}}catch(l){if(this.shouldThrowOnError)throw l;if(nt(l))return{data:null,error:l};throw l}})}createSignedUploadUrl(e,r){return me(this,void 0,void 0,function*(){try{let n=this._getFinalPath(e);const i=Object.assign({},this.headers);r!=null&&r.upsert&&(i["x-upsert"]="true");const a=yield dr(this.fetch,`${this.url}/object/upload/sign/${n}`,{},{headers:i}),s=new URL(this.url+a.url),o=s.searchParams.get("token");if(!o)throw new ih("No token returned by API");return{data:{signedUrl:s.toString(),path:e,token:o},error:null}}catch(n){if(this.shouldThrowOnError)throw n;if(nt(n))return{data:null,error:n};throw n}})}update(e,r,n){return me(this,void 0,void 0,function*(){return this.uploadOrUpdate("PUT",e,r,n)})}move(e,r,n){return me(this,void 0,void 0,function*(){try{return{data:yield dr(this.fetch,`${this.url}/object/move`,{bucketId:this.bucketId,sourceKey:e,destinationKey:r,destinationBucket:n==null?void 0:n.destinationBucket},{headers:this.headers}),error:null}}catch(i){if(this.shouldThrowOnError)throw i;if(nt(i))return{data:null,error:i};throw i}})}copy(e,r,n){return me(this,void 0,void 0,function*(){try{return{data:{path:(yield dr(this.fetch,`${this.url}/object/copy`,{bucketId:this.bucketId,sourceKey:e,destinationKey:r,destinationBucket:n==null?void 0:n.destinationBucket},{headers:this.headers})).Key},error:null}}catch(i){if(this.shouldThrowOnError)throw i;if(nt(i))return{data:null,error:i};throw i}})}createSignedUrl(e,r,n){return me(this,void 0,void 0,function*(){try{let i=this._getFinalPath(e),a=yield dr(this.fetch,`${this.url}/object/sign/${i}`,Object.assign({expiresIn:r},n!=null&&n.transform?{transform:n.transform}:{}),{headers:this.headers});const s=n!=null&&n.download?`&download=${n.download===!0?"":n.download}`:"";return a={signedUrl:encodeURI(`${this.url}${a.signedURL}${s}`)},{data:a,error:null}}catch(i){if(this.shouldThrowOnError)throw i;if(nt(i))return{data:null,error:i};throw i}})}createSignedUrls(e,r,n){return me(this,void 0,void 0,function*(){try{const i=yield dr(this.fetch,`${this.url}/object/sign/${this.bucketId}`,{expiresIn:r,paths:e},{headers:this.headers}),a=n!=null&&n.download?`&download=${n.download===!0?"":n.download}`:"";return{data:i.map(s=>Object.assign(Object.assign({},s),{signedUrl:s.signedURL?encodeURI(`${this.url}${s.signedURL}${a}`):null})),error:null}}catch(i){if(this.shouldThrowOnError)throw i;if(nt(i))return{data:null,error:i};throw i}})}download(e,r){const i=typeof(r==null?void 0:r.transform)<"u"?"render/image/authenticated":"object",a=this.transformOptsToQueryString((r==null?void 0:r.transform)||{}),s=a?`?${a}`:"",o=this._getFinalPath(e),l=()=>ps(this.fetch,`${this.url}/${i}/${o}${s}`,{headers:this.headers,noResolveJson:!0});return new Q_(l,this.shouldThrowOnError)}info(e){return me(this,void 0,void 0,function*(){const r=this._getFinalPath(e);try{const n=yield ps(this.fetch,`${this.url}/object/info/${r}`,{headers:this.headers});return{data:Bu(n),error:null}}catch(n){if(this.shouldThrowOnError)throw n;if(nt(n))return{data:null,error:n};throw n}})}exists(e){return me(this,void 0,void 0,function*(){const r=this._getFinalPath(e);try{return yield X_(this.fetch,`${this.url}/object/${r}`,{headers:this.headers}),{data:!0,error:null}}catch(n){if(this.shouldThrowOnError)throw n;if(nt(n)&&n instanceof Fu){const i=n.originalError;if([400,404].includes(i==null?void 0:i.status))return{data:!1,error:n}}throw n}})}getPublicUrl(e,r){const n=this._getFinalPath(e),i=[],a=r!=null&&r.download?`download=${r.download===!0?"":r.download}`:"";a!==""&&i.push(a);const o=typeof(r==null?void 0:r.transform)<"u"?"render/image":"object",l=this.transformOptsToQueryString((r==null?void 0:r.transform)||{});l!==""&&i.push(l);let c=i.join("&");return c!==""&&(c=`?${c}`),{data:{publicUrl:encodeURI(`${this.url}/${o}/public/${n}${c}`)}}}remove(e){return me(this,void 0,void 0,function*(){try{return{data:yield sh(this.fetch,`${this.url}/object/${this.bucketId}`,{prefixes:e},{headers:this.headers}),error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(nt(r))return{data:null,error:r};throw r}})}list(e,r,n){return me(this,void 0,void 0,function*(){try{const i=Object.assign(Object.assign(Object.assign({},e2),r),{prefix:e||""});return{data:yield dr(this.fetch,`${this.url}/object/list/${this.bucketId}`,i,{headers:this.headers},n),error:null}}catch(i){if(this.shouldThrowOnError)throw i;if(nt(i))return{data:null,error:i};throw i}})}listV2(e,r){return me(this,void 0,void 0,function*(){try{const n=Object.assign({},e);return{data:yield dr(this.fetch,`${this.url}/object/list-v2/${this.bucketId}`,n,{headers:this.headers},r),error:null}}catch(n){if(this.shouldThrowOnError)throw n;if(nt(n))return{data:null,error:n};throw n}})}encodeMetadata(e){return JSON.stringify(e)}toBase64(e){return typeof Buffer<"u"?Buffer.from(e).toString("base64"):btoa(e)}_getFinalPath(e){return`${this.bucketId}/${e.replace(/^\/+/,"")}`}_removeEmptyFolders(e){return e.replace(/^\/|\/$/g,"").replace(/\/+/g,"/")}transformOptsToQueryString(e){const r=[];return e.width&&r.push(`width=${e.width}`),e.height&&r.push(`height=${e.height}`),e.resize&&r.push(`resize=${e.resize}`),e.format&&r.push(`format=${e.format}`),e.quality&&r.push(`quality=${e.quality}`),r.join("&")}}const qy="2.79.0",Yy={"X-Client-Info":`storage-js/${qy}`};class r2{constructor(e,r={},n,i){this.shouldThrowOnError=!1;const a=new URL(e);i!=null&&i.useNewHostname&&/supabase\.(co|in|red)$/.test(a.hostname)&&!a.hostname.includes("storage.supabase.")&&(a.hostname=a.hostname.replace("supabase.","storage.supabase.")),this.url=a.href.replace(/\/$/,""),this.headers=Object.assign(Object.assign({},Yy),r),this.fetch=ah(n)}throwOnError(){return this.shouldThrowOnError=!0,this}listBuckets(e){return me(this,void 0,void 0,function*(){try{const r=this.listBucketOptionsToQueryString(e);return{data:yield ps(this.fetch,`${this.url}/bucket${r}`,{headers:this.headers}),error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(nt(r))return{data:null,error:r};throw r}})}getBucket(e){return me(this,void 0,void 0,function*(){try{return{data:yield ps(this.fetch,`${this.url}/bucket/${e}`,{headers:this.headers}),error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(nt(r))return{data:null,error:r};throw r}})}createBucket(e){return me(this,arguments,void 0,function*(r,n={public:!1}){try{return{data:yield dr(this.fetch,`${this.url}/bucket`,{id:r,name:r,type:n.type,public:n.public,file_size_limit:n.fileSizeLimit,allowed_mime_types:n.allowedMimeTypes},{headers:this.headers}),error:null}}catch(i){if(this.shouldThrowOnError)throw i;if(nt(i))return{data:null,error:i};throw i}})}updateBucket(e,r){return me(this,void 0,void 0,function*(){try{return{data:yield Uu(this.fetch,`${this.url}/bucket/${e}`,{id:e,name:e,public:r.public,file_size_limit:r.fileSizeLimit,allowed_mime_types:r.allowedMimeTypes},{headers:this.headers}),error:null}}catch(n){if(this.shouldThrowOnError)throw n;if(nt(n))return{data:null,error:n};throw n}})}emptyBucket(e){return me(this,void 0,void 0,function*(){try{return{data:yield dr(this.fetch,`${this.url}/bucket/${e}/empty`,{},{headers:this.headers}),error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(nt(r))return{data:null,error:r};throw r}})}deleteBucket(e){return me(this,void 0,void 0,function*(){try{return{data:yield sh(this.fetch,`${this.url}/bucket/${e}`,{},{headers:this.headers}),error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(nt(r))return{data:null,error:r};throw r}})}listBucketOptionsToQueryString(e){const r={};return e&&("limit"in e&&(r.limit=String(e.limit)),"offset"in e&&(r.offset=String(e.offset)),e.search&&(r.search=e.search),e.sortColumn&&(r.sortColumn=e.sortColumn),e.sortOrder&&(r.sortOrder=e.sortOrder)),Object.keys(r).length>0?"?"+new URLSearchParams(r).toString():""}}class n2{constructor(e,r={},n){this.shouldThrowOnError=!1,this.url=e.replace(/\/$/,""),this.headers=Object.assign(Object.assign({},Yy),r),this.fetch=ah(n)}throwOnError(){return this.shouldThrowOnError=!0,this}createBucket(e){return me(this,void 0,void 0,function*(){try{return{data:yield dr(this.fetch,`${this.url}/bucket`,{name:e},{headers:this.headers}),error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(nt(r))return{data:null,error:r};throw r}})}listBuckets(e){return me(this,void 0,void 0,function*(){try{const r=new URLSearchParams;(e==null?void 0:e.limit)!==void 0&&r.set("limit",e.limit.toString()),(e==null?void 0:e.offset)!==void 0&&r.set("offset",e.offset.toString()),e!=null&&e.sortColumn&&r.set("sortColumn",e.sortColumn),e!=null&&e.sortOrder&&r.set("sortOrder",e.sortOrder),e!=null&&e.search&&r.set("search",e.search);const n=r.toString(),i=n?`${this.url}/bucket?${n}`:`${this.url}/bucket`;return{data:yield ps(this.fetch,i,{headers:this.headers}),error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(nt(r))return{data:null,error:r};throw r}})}deleteBucket(e){return me(this,void 0,void 0,function*(){try{return{data:yield sh(this.fetch,`${this.url}/bucket/${e}`,{},{headers:this.headers}),error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(nt(r))return{data:null,error:r};throw r}})}}const oh={"X-Client-Info":`storage-js/${qy}`,"Content-Type":"application/json"};class Jy extends Error{constructor(e){super(e),this.__isStorageVectorsError=!0,this.name="StorageVectorsError"}}function Ut(t){return typeof t=="object"&&t!==null&&"__isStorageVectorsError"in t}class Sc extends Jy{constructor(e,r,n){super(e),this.name="StorageVectorsApiError",this.status=r,this.statusCode=n}toJSON(){return{name:this.name,message:this.message,status:this.status,statusCode:this.statusCode}}}class i2 extends Jy{constructor(e,r){super(e),this.name="StorageVectorsUnknownError",this.originalError=r}}var zp;(function(t){t.InternalError="InternalError",t.S3VectorConflictException="S3VectorConflictException",t.S3VectorNotFoundException="S3VectorNotFoundException",t.S3VectorBucketNotEmpty="S3VectorBucketNotEmpty",t.S3VectorMaxBucketsExceeded="S3VectorMaxBucketsExceeded",t.S3VectorMaxIndexesExceeded="S3VectorMaxIndexesExceeded"})(zp||(zp={}));const lh=t=>t?(...e)=>t(...e):(...e)=>fetch(...e),a2=t=>{if(typeof t!="object"||t===null)return!1;const e=Object.getPrototypeOf(t);return(e===null||e===Object.prototype||Object.getPrototypeOf(e)===null)&&!(Symbol.toStringTag in t)&&!(Symbol.iterator in t)},Lp=t=>t.msg||t.message||t.error_description||t.error||JSON.stringify(t),s2=(t,e,r)=>me(void 0,void 0,void 0,function*(){if(t&&typeof t=="object"&&"status"in t&&"ok"in t&&typeof t.status=="number"&&!(r!=null&&r.noResolveJson)){const i=t.status||500,a=t;if(typeof a.json=="function")a.json().then(s=>{const o=(s==null?void 0:s.statusCode)||(s==null?void 0:s.code)||i+"";e(new Sc(Lp(s),i,o))}).catch(()=>{const s=i+"",o=a.statusText||`HTTP ${i} error`;e(new Sc(o,i,s))});else{const s=i+"",o=a.statusText||`HTTP ${i} error`;e(new Sc(o,i,s))}}else e(new i2(Lp(t),t))}),o2=(t,e,r,n)=>{const i={method:t,headers:(e==null?void 0:e.headers)||{}};return n?(a2(n)?(i.headers=Object.assign({"Content-Type":"application/json"},e==null?void 0:e.headers),i.body=JSON.stringify(n)):i.body=n,Object.assign(Object.assign({},i),r)):i};function l2(t,e,r,n,i,a){return me(this,void 0,void 0,function*(){return new Promise((s,o)=>{t(r,o2(e,n,i,a)).then(l=>{if(!l.ok)throw l;if(n!=null&&n.noResolveJson)return l;const c=l.headers.get("content-type");return!c||!c.includes("application/json")?{}:l.json()}).then(l=>s(l)).catch(l=>s2(l,o,n))})})}function Ht(t,e,r,n,i){return me(this,void 0,void 0,function*(){return l2(t,"POST",e,n,i,r)})}class c2{constructor(e,r={},n){this.shouldThrowOnError=!1,this.url=e.replace(/\/$/,""),this.headers=Object.assign(Object.assign({},oh),r),this.fetch=lh(n)}throwOnError(){return this.shouldThrowOnError=!0,this}createIndex(e){return me(this,void 0,void 0,function*(){try{return{data:(yield Ht(this.fetch,`${this.url}/CreateIndex`,e,{headers:this.headers}))||{},error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(Ut(r))return{data:null,error:r};throw r}})}getIndex(e,r){return me(this,void 0,void 0,function*(){try{return{data:yield Ht(this.fetch,`${this.url}/GetIndex`,{vectorBucketName:e,indexName:r},{headers:this.headers}),error:null}}catch(n){if(this.shouldThrowOnError)throw n;if(Ut(n))return{data:null,error:n};throw n}})}listIndexes(e){return me(this,void 0,void 0,function*(){try{return{data:yield Ht(this.fetch,`${this.url}/ListIndexes`,e,{headers:this.headers}),error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(Ut(r))return{data:null,error:r};throw r}})}deleteIndex(e,r){return me(this,void 0,void 0,function*(){try{return{data:(yield Ht(this.fetch,`${this.url}/DeleteIndex`,{vectorBucketName:e,indexName:r},{headers:this.headers}))||{},error:null}}catch(n){if(this.shouldThrowOnError)throw n;if(Ut(n))return{data:null,error:n};throw n}})}}class u2{constructor(e,r={},n){this.shouldThrowOnError=!1,this.url=e.replace(/\/$/,""),this.headers=Object.assign(Object.assign({},oh),r),this.fetch=lh(n)}throwOnError(){return this.shouldThrowOnError=!0,this}putVectors(e){return me(this,void 0,void 0,function*(){try{if(e.vectors.length<1||e.vectors.length>500)throw new Error("Vector batch size must be between 1 and 500 items");return{data:(yield Ht(this.fetch,`${this.url}/PutVectors`,e,{headers:this.headers}))||{},error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(Ut(r))return{data:null,error:r};throw r}})}getVectors(e){return me(this,void 0,void 0,function*(){try{return{data:yield Ht(this.fetch,`${this.url}/GetVectors`,e,{headers:this.headers}),error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(Ut(r))return{data:null,error:r};throw r}})}listVectors(e){return me(this,void 0,void 0,function*(){try{if(e.segmentCount!==void 0){if(e.segmentCount<1||e.segmentCount>16)throw new Error("segmentCount must be between 1 and 16");if(e.segmentIndex!==void 0&&(e.segmentIndex<0||e.segmentIndex>=e.segmentCount))throw new Error(`segmentIndex must be between 0 and ${e.segmentCount-1}`)}return{data:yield Ht(this.fetch,`${this.url}/ListVectors`,e,{headers:this.headers}),error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(Ut(r))return{data:null,error:r};throw r}})}queryVectors(e){return me(this,void 0,void 0,function*(){try{return{data:yield Ht(this.fetch,`${this.url}/QueryVectors`,e,{headers:this.headers}),error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(Ut(r))return{data:null,error:r};throw r}})}deleteVectors(e){return me(this,void 0,void 0,function*(){try{if(e.keys.length<1||e.keys.length>500)throw new Error("Keys batch size must be between 1 and 500 items");return{data:(yield Ht(this.fetch,`${this.url}/DeleteVectors`,e,{headers:this.headers}))||{},error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(Ut(r))return{data:null,error:r};throw r}})}}class d2{constructor(e,r={},n){this.shouldThrowOnError=!1,this.url=e.replace(/\/$/,""),this.headers=Object.assign(Object.assign({},oh),r),this.fetch=lh(n)}throwOnError(){return this.shouldThrowOnError=!0,this}createBucket(e){return me(this,void 0,void 0,function*(){try{return{data:(yield Ht(this.fetch,`${this.url}/CreateVectorBucket`,{vectorBucketName:e},{headers:this.headers}))||{},error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(Ut(r))return{data:null,error:r};throw r}})}getBucket(e){return me(this,void 0,void 0,function*(){try{return{data:yield Ht(this.fetch,`${this.url}/GetVectorBucket`,{vectorBucketName:e},{headers:this.headers}),error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(Ut(r))return{data:null,error:r};throw r}})}listBuckets(){return me(this,arguments,void 0,function*(e={}){try{return{data:yield Ht(this.fetch,`${this.url}/ListVectorBuckets`,e,{headers:this.headers}),error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(Ut(r))return{data:null,error:r};throw r}})}deleteBucket(e){return me(this,void 0,void 0,function*(){try{return{data:(yield Ht(this.fetch,`${this.url}/DeleteVectorBucket`,{vectorBucketName:e},{headers:this.headers}))||{},error:null}}catch(r){if(this.shouldThrowOnError)throw r;if(Ut(r))return{data:null,error:r};throw r}})}}class h2 extends d2{constructor(e,r={}){super(e,r.headers||{},r.fetch)}from(e){return new f2(this.url,this.headers,e,this.fetch)}}class f2 extends c2{constructor(e,r,n,i){super(e,r,i),this.vectorBucketName=n}createIndex(e){const r=Object.create(null,{createIndex:{get:()=>super.createIndex}});return me(this,void 0,void 0,function*(){return r.createIndex.call(this,Object.assign(Object.assign({},e),{vectorBucketName:this.vectorBucketName}))})}listIndexes(){const e=Object.create(null,{listIndexes:{get:()=>super.listIndexes}});return me(this,arguments,void 0,function*(r={}){return e.listIndexes.call(this,Object.assign(Object.assign({},r),{vectorBucketName:this.vectorBucketName}))})}getIndex(e){const r=Object.create(null,{getIndex:{get:()=>super.getIndex}});return me(this,void 0,void 0,function*(){return r.getIndex.call(this,this.vectorBucketName,e)})}deleteIndex(e){const r=Object.create(null,{deleteIndex:{get:()=>super.deleteIndex}});return me(this,void 0,void 0,function*(){return r.deleteIndex.call(this,this.vectorBucketName,e)})}index(e){return new p2(this.url,this.headers,this.vectorBucketName,e,this.fetch)}}class p2 extends u2{constructor(e,r,n,i,a){super(e,r,a),this.vectorBucketName=n,this.indexName=i}putVectors(e){const r=Object.create(null,{putVectors:{get:()=>super.putVectors}});return me(this,void 0,void 0,function*(){return r.putVectors.call(this,Object.assign(Object.assign({},e),{vectorBucketName:this.vectorBucketName,indexName:this.indexName}))})}getVectors(e){const r=Object.create(null,{getVectors:{get:()=>super.getVectors}});return me(this,void 0,void 0,function*(){return r.getVectors.call(this,Object.assign(Object.assign({},e),{vectorBucketName:this.vectorBucketName,indexName:this.indexName}))})}listVectors(){const e=Object.create(null,{listVectors:{get:()=>super.listVectors}});return me(this,arguments,void 0,function*(r={}){return e.listVectors.call(this,Object.assign(Object.assign({},r),{vectorBucketName:this.vectorBucketName,indexName:this.indexName}))})}queryVectors(e){const r=Object.create(null,{queryVectors:{get:()=>super.queryVectors}});return me(this,void 0,void 0,function*(){return r.queryVectors.call(this,Object.assign(Object.assign({},e),{vectorBucketName:this.vectorBucketName,indexName:this.indexName}))})}deleteVectors(e){const r=Object.create(null,{deleteVectors:{get:()=>super.deleteVectors}});return me(this,void 0,void 0,function*(){return r.deleteVectors.call(this,Object.assign(Object.assign({},e),{vectorBucketName:this.vectorBucketName,indexName:this.indexName}))})}}class g2 extends r2{constructor(e,r={},n,i){super(e,r,n,i)}from(e){return new t2(this.url,this.headers,e,this.fetch)}get vectors(){return new h2(this.url+"/vector",{headers:this.headers,fetch:this.fetch})}get analytics(){return new n2(this.url+"/iceberg",this.headers,this.fetch)}}const m2="2.79.0";let Ra="";typeof Deno<"u"?Ra="deno":typeof document<"u"?Ra="web":typeof navigator<"u"&&navigator.product==="ReactNative"?Ra="react-native":Ra="node";const v2={"X-Client-Info":`supabase-js-${Ra}/${m2}`},y2={headers:v2},b2={schema:"public"},w2={autoRefreshToken:!0,persistSession:!0,detectSessionInUrl:!0,flowType:"implicit"},x2={},_2=t=>t?(...e)=>t(...e):(...e)=>fetch(...e),S2=()=>Headers,k2=(t,e,r)=>{const n=_2(r),i=S2();return async(a,s)=>{var o;const l=(o=await e())!==null&&o!==void 0?o:t;let c=new i(s==null?void 0:s.headers);return c.has("apikey")||c.set("apikey",t),c.has("Authorization")||c.set("Authorization",`Bearer ${l}`),n(a,Object.assign(Object.assign({},s),{headers:c}))}};function E2(t){return t.endsWith("/")?t:t+"/"}function j2(t,e){var r,n;const{db:i,auth:a,realtime:s,global:o}=t,{db:l,auth:c,realtime:d,global:h}=e,f={db:Object.assign(Object.assign({},l),i),auth:Object.assign(Object.assign({},c),a),realtime:Object.assign(Object.assign({},d),s),storage:{},global:Object.assign(Object.assign(Object.assign({},h),o),{headers:Object.assign(Object.assign({},(r=h==null?void 0:h.headers)!==null&&r!==void 0?r:{}),(n=o==null?void 0:o.headers)!==null&&n!==void 0?n:{})}),accessToken:async()=>""};return t.accessToken?f.accessToken=t.accessToken:delete f.accessToken,f}function C2(t){const e=t==null?void 0:t.trim();if(!e)throw new Error("supabaseUrl is required.");if(!e.match(/^https?:\/\//i))throw new Error("Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL.");try{return new URL(E2(e))}catch{throw Error("Invalid supabaseUrl: Provided URL is malformed.")}}const Xy="2.79.0",si=30*1e3,Hu=3,kc=Hu*si,T2="http://localhost:9999",O2="supabase.auth.token",P2={"X-Client-Info":`gotrue-js/${Xy}`},Gu="X-Supabase-Api-Version",Zy={"2024-01-01":{timestamp:Date.parse("2024-01-01T00:00:00.0Z"),name:"2024-01-01"}},N2=/^([a-z0-9_-]{4})*($|[a-z0-9_-]{3}$|[a-z0-9_-]{2}$)$/i,$2=10*60*1e3;class gs extends Error{constructor(e,r,n){super(e),this.__isAuthError=!0,this.name="AuthError",this.status=r,this.code=n}}function be(t){return typeof t=="object"&&t!==null&&"__isAuthError"in t}class R2 extends gs{constructor(e,r,n){super(e,r,n),this.name="AuthApiError",this.status=r,this.code=n}}function A2(t){return be(t)&&t.name==="AuthApiError"}class Pn extends gs{constructor(e,r){super(e),this.name="AuthUnknownError",this.originalError=r}}class wn extends gs{constructor(e,r,n,i){super(e,n,i),this.name=r,this.status=n}}class or extends wn{constructor(){super("Auth session missing!","AuthSessionMissingError",400,void 0)}}function I2(t){return be(t)&&t.name==="AuthSessionMissingError"}class ei extends wn{constructor(){super("Auth session or user missing","AuthInvalidTokenResponseError",500,void 0)}}class io extends wn{constructor(e){super(e,"AuthInvalidCredentialsError",400,void 0)}}class ao extends wn{constructor(e,r=null){super(e,"AuthImplicitGrantRedirectError",500,void 0),this.details=null,this.details=r}toJSON(){return{name:this.name,message:this.message,status:this.status,details:this.details}}}function D2(t){return be(t)&&t.name==="AuthImplicitGrantRedirectError"}class Fp extends wn{constructor(e,r=null){super(e,"AuthPKCEGrantCodeExchangeError",500,void 0),this.details=null,this.details=r}toJSON(){return{name:this.name,message:this.message,status:this.status,details:this.details}}}class Vu extends wn{constructor(e,r){super(e,"AuthRetryableFetchError",r,void 0)}}function Ec(t){return be(t)&&t.name==="AuthRetryableFetchError"}class Bp extends wn{constructor(e,r,n){super(e,"AuthWeakPasswordError",r,"weak_password"),this.reasons=n}}class Wu extends wn{constructor(e){super(e,"AuthInvalidJwtError",400,"invalid_jwt")}}const Xo="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".split(""),Up=` 	
\r=`.split(""),M2=(()=>{const t=new Array(128);for(let e=0;e<t.length;e+=1)t[e]=-1;for(let e=0;e<Up.length;e+=1)t[Up[e].charCodeAt(0)]=-2;for(let e=0;e<Xo.length;e+=1)t[Xo[e].charCodeAt(0)]=e;return t})();function Hp(t,e,r){if(t!==null)for(e.queue=e.queue<<8|t,e.queuedBits+=8;e.queuedBits>=6;){const n=e.queue>>e.queuedBits-6&63;r(Xo[n]),e.queuedBits-=6}else if(e.queuedBits>0)for(e.queue=e.queue<<6-e.queuedBits,e.queuedBits=6;e.queuedBits>=6;){const n=e.queue>>e.queuedBits-6&63;r(Xo[n]),e.queuedBits-=6}}function Qy(t,e,r){const n=M2[t];if(n>-1)for(e.queue=e.queue<<6|n,e.queuedBits+=6;e.queuedBits>=8;)r(e.queue>>e.queuedBits-8&255),e.queuedBits-=8;else{if(n===-2)return;throw new Error(`Invalid Base64-URL character "${String.fromCharCode(t)}"`)}}function Gp(t){const e=[],r=s=>{e.push(String.fromCodePoint(s))},n={utf8seq:0,codepoint:0},i={queue:0,queuedBits:0},a=s=>{F2(s,n,r)};for(let s=0;s<t.length;s+=1)Qy(t.charCodeAt(s),i,a);return e.join("")}function z2(t,e){if(t<=127){e(t);return}else if(t<=2047){e(192|t>>6),e(128|t&63);return}else if(t<=65535){e(224|t>>12),e(128|t>>6&63),e(128|t&63);return}else if(t<=1114111){e(240|t>>18),e(128|t>>12&63),e(128|t>>6&63),e(128|t&63);return}throw new Error(`Unrecognized Unicode codepoint: ${t.toString(16)}`)}function L2(t,e){for(let r=0;r<t.length;r+=1){let n=t.charCodeAt(r);if(n>55295&&n<=56319){const i=(n-55296)*1024&65535;n=(t.charCodeAt(r+1)-56320&65535|i)+65536,r+=1}z2(n,e)}}function F2(t,e,r){if(e.utf8seq===0){if(t<=127){r(t);return}for(let n=1;n<6;n+=1)if(!(t>>7-n&1)){e.utf8seq=n;break}if(e.utf8seq===2)e.codepoint=t&31;else if(e.utf8seq===3)e.codepoint=t&15;else if(e.utf8seq===4)e.codepoint=t&7;else throw new Error("Invalid UTF-8 sequence");e.utf8seq-=1}else if(e.utf8seq>0){if(t<=127)throw new Error("Invalid UTF-8 sequence");e.codepoint=e.codepoint<<6|t&63,e.utf8seq-=1,e.utf8seq===0&&r(e.codepoint)}}function Hi(t){const e=[],r={queue:0,queuedBits:0},n=i=>{e.push(i)};for(let i=0;i<t.length;i+=1)Qy(t.charCodeAt(i),r,n);return new Uint8Array(e)}function B2(t){const e=[];return L2(t,r=>e.push(r)),new Uint8Array(e)}function An(t){const e=[],r={queue:0,queuedBits:0},n=i=>{e.push(i)};return t.forEach(i=>Hp(i,r,n)),Hp(null,r,n),e.join("")}function U2(t){return Math.round(Date.now()/1e3)+t}function H2(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(t){const e=Math.random()*16|0;return(t=="x"?e:e&3|8).toString(16)})}const St=()=>typeof window<"u"&&typeof document<"u",_n={tested:!1,writable:!1},eb=()=>{if(!St())return!1;try{if(typeof globalThis.localStorage!="object")return!1}catch{return!1}if(_n.tested)return _n.writable;const t=`lswt-${Math.random()}${Math.random()}`;try{globalThis.localStorage.setItem(t,t),globalThis.localStorage.removeItem(t),_n.tested=!0,_n.writable=!0}catch{_n.tested=!0,_n.writable=!1}return _n.writable};function G2(t){const e={},r=new URL(t);if(r.hash&&r.hash[0]==="#")try{new URLSearchParams(r.hash.substring(1)).forEach((i,a)=>{e[a]=i})}catch{}return r.searchParams.forEach((n,i)=>{e[i]=n}),e}const tb=t=>t?(...e)=>t(...e):(...e)=>fetch(...e),V2=t=>typeof t=="object"&&t!==null&&"status"in t&&"ok"in t&&"json"in t&&typeof t.json=="function",oi=async(t,e,r)=>{await t.setItem(e,JSON.stringify(r))},Sn=async(t,e)=>{const r=await t.getItem(e);if(!r)return null;try{return JSON.parse(r)}catch{return r}},Kr=async(t,e)=>{await t.removeItem(e)};class Cl{constructor(){this.promise=new Cl.promiseConstructor((e,r)=>{this.resolve=e,this.reject=r})}}Cl.promiseConstructor=Promise;function jc(t){const e=t.split(".");if(e.length!==3)throw new Wu("Invalid JWT structure");for(let n=0;n<e.length;n++)if(!N2.test(e[n]))throw new Wu("JWT not in base64url format");return{header:JSON.parse(Gp(e[0])),payload:JSON.parse(Gp(e[1])),signature:Hi(e[2]),raw:{header:e[0],payload:e[1]}}}async function W2(t){return await new Promise(e=>{setTimeout(()=>e(null),t)})}function K2(t,e){return new Promise((n,i)=>{(async()=>{for(let a=0;a<1/0;a++)try{const s=await t(a);if(!e(a,null,s)){n(s);return}}catch(s){if(!e(a,s)){i(s);return}}})()})}function q2(t){return("0"+t.toString(16)).substr(-2)}function Y2(){const e=new Uint32Array(56);if(typeof crypto>"u"){const r="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~",n=r.length;let i="";for(let a=0;a<56;a++)i+=r.charAt(Math.floor(Math.random()*n));return i}return crypto.getRandomValues(e),Array.from(e,q2).join("")}async function J2(t){const r=new TextEncoder().encode(t),n=await crypto.subtle.digest("SHA-256",r),i=new Uint8Array(n);return Array.from(i).map(a=>String.fromCharCode(a)).join("")}async function X2(t){if(!(typeof crypto<"u"&&typeof crypto.subtle<"u"&&typeof TextEncoder<"u"))return console.warn("WebCrypto API is not supported. Code challenge method will default to use plain instead of sha256."),t;const r=await J2(t);return btoa(r).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}async function ti(t,e,r=!1){const n=Y2();let i=n;r&&(i+="/PASSWORD_RECOVERY"),await oi(t,`${e}-code-verifier`,i);const a=await X2(n);return[a,n===a?"plain":"s256"]}const Z2=/^2[0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/i;function Q2(t){const e=t.headers.get(Gu);if(!e||!e.match(Z2))return null;try{return new Date(`${e}T00:00:00.0Z`)}catch{return null}}function eS(t){if(!t)throw new Error("Missing exp claim");const e=Math.floor(Date.now()/1e3);if(t<=e)throw new Error("JWT has expired")}function tS(t){switch(t){case"RS256":return{name:"RSASSA-PKCS1-v1_5",hash:{name:"SHA-256"}};case"ES256":return{name:"ECDSA",namedCurve:"P-256",hash:{name:"SHA-256"}};default:throw new Error("Invalid alg claim")}}const rS=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;function ri(t){if(!rS.test(t))throw new Error("@supabase/auth-js: Expected parameter to be UUID but is not")}function Cc(){const t={};return new Proxy(t,{get:(e,r)=>{if(r==="__isUserNotAvailableProxy")return!0;if(typeof r=="symbol"){const n=r.toString();if(n==="Symbol(Symbol.toPrimitive)"||n==="Symbol(Symbol.toStringTag)"||n==="Symbol(util.inspect.custom)")return}throw new Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Accessing the "${r}" property of the session object is not supported. Please use getUser() instead.`)},set:(e,r)=>{throw new Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Setting the "${r}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`)},deleteProperty:(e,r)=>{throw new Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Deleting the "${r}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`)}})}function nS(t,e){return new Proxy(t,{get:(r,n,i)=>{if(n==="__isInsecureUserWarningProxy")return!0;if(typeof n=="symbol"){const a=n.toString();if(a==="Symbol(Symbol.toPrimitive)"||a==="Symbol(Symbol.toStringTag)"||a==="Symbol(util.inspect.custom)"||a==="Symbol(nodejs.util.inspect.custom)")return Reflect.get(r,n,i)}return!e.value&&typeof n=="string"&&(console.warn("Using the user object as returned from supabase.auth.getSession() or from some supabase.auth.onAuthStateChange() events could be insecure! This value comes directly from the storage medium (usually cookies on the server) and may not be authentic. Use supabase.auth.getUser() instead which authenticates the data by contacting the Supabase Auth server."),e.value=!0),Reflect.get(r,n,i)}})}function Vp(t){return JSON.parse(JSON.stringify(t))}const Cn=t=>t.msg||t.message||t.error_description||t.error||JSON.stringify(t),iS=[502,503,504];async function Wp(t){var e;if(!V2(t))throw new Vu(Cn(t),0);if(iS.includes(t.status))throw new Vu(Cn(t),t.status);let r;try{r=await t.json()}catch(a){throw new Pn(Cn(a),a)}let n;const i=Q2(t);if(i&&i.getTime()>=Zy["2024-01-01"].timestamp&&typeof r=="object"&&r&&typeof r.code=="string"?n=r.code:typeof r=="object"&&r&&typeof r.error_code=="string"&&(n=r.error_code),n){if(n==="weak_password")throw new Bp(Cn(r),t.status,((e=r.weak_password)===null||e===void 0?void 0:e.reasons)||[]);if(n==="session_not_found")throw new or}else if(typeof r=="object"&&r&&typeof r.weak_password=="object"&&r.weak_password&&Array.isArray(r.weak_password.reasons)&&r.weak_password.reasons.length&&r.weak_password.reasons.reduce((a,s)=>a&&typeof s=="string",!0))throw new Bp(Cn(r),t.status,r.weak_password.reasons);throw new R2(Cn(r),t.status||500,n)}const aS=(t,e,r,n)=>{const i={method:t,headers:(e==null?void 0:e.headers)||{}};return t==="GET"?i:(i.headers=Object.assign({"Content-Type":"application/json;charset=UTF-8"},e==null?void 0:e.headers),i.body=JSON.stringify(n),Object.assign(Object.assign({},i),r))};async function ke(t,e,r,n){var i;const a=Object.assign({},n==null?void 0:n.headers);a[Gu]||(a[Gu]=Zy["2024-01-01"].name),n!=null&&n.jwt&&(a.Authorization=`Bearer ${n.jwt}`);const s=(i=n==null?void 0:n.query)!==null&&i!==void 0?i:{};n!=null&&n.redirectTo&&(s.redirect_to=n.redirectTo);const o=Object.keys(s).length?"?"+new URLSearchParams(s).toString():"",l=await sS(t,e,r+o,{headers:a,noResolveJson:n==null?void 0:n.noResolveJson},{},n==null?void 0:n.body);return n!=null&&n.xform?n==null?void 0:n.xform(l):{data:Object.assign({},l),error:null}}async function sS(t,e,r,n,i,a){const s=aS(e,n,i,a);let o;try{o=await t(r,Object.assign({},s))}catch(l){throw console.error(l),new Vu(Cn(l),0)}if(o.ok||await Wp(o),n!=null&&n.noResolveJson)return o;try{return await o.json()}catch(l){await Wp(l)}}function lr(t){var e;let r=null;cS(t)&&(r=Object.assign({},t),t.expires_at||(r.expires_at=U2(t.expires_in)));const n=(e=t.user)!==null&&e!==void 0?e:t;return{data:{session:r,user:n},error:null}}function Kp(t){const e=lr(t);return!e.error&&t.weak_password&&typeof t.weak_password=="object"&&Array.isArray(t.weak_password.reasons)&&t.weak_password.reasons.length&&t.weak_password.message&&typeof t.weak_password.message=="string"&&t.weak_password.reasons.reduce((r,n)=>r&&typeof n=="string",!0)&&(e.data.weak_password=t.weak_password),e}function Qr(t){var e;return{data:{user:(e=t.user)!==null&&e!==void 0?e:t},error:null}}function oS(t){return{data:t,error:null}}function lS(t){const{action_link:e,email_otp:r,hashed_token:n,redirect_to:i,verification_type:a}=t,s=ra(t,["action_link","email_otp","hashed_token","redirect_to","verification_type"]),o={action_link:e,email_otp:r,hashed_token:n,redirect_to:i,verification_type:a},l=Object.assign({},s);return{data:{properties:o,user:l},error:null}}function qp(t){return t}function cS(t){return t.access_token&&t.refresh_token&&t.expires_in}const Tc=["global","local","others"];class uS{constructor({url:e="",headers:r={},fetch:n}){this.url=e,this.headers=r,this.fetch=tb(n),this.mfa={listFactors:this._listFactors.bind(this),deleteFactor:this._deleteFactor.bind(this)},this.oauth={listClients:this._listOAuthClients.bind(this),createClient:this._createOAuthClient.bind(this),getClient:this._getOAuthClient.bind(this),updateClient:this._updateOAuthClient.bind(this),deleteClient:this._deleteOAuthClient.bind(this),regenerateClientSecret:this._regenerateOAuthClientSecret.bind(this)}}async signOut(e,r=Tc[0]){if(Tc.indexOf(r)<0)throw new Error(`@supabase/auth-js: Parameter scope must be one of ${Tc.join(", ")}`);try{return await ke(this.fetch,"POST",`${this.url}/logout?scope=${r}`,{headers:this.headers,jwt:e,noResolveJson:!0}),{data:null,error:null}}catch(n){if(be(n))return{data:null,error:n};throw n}}async inviteUserByEmail(e,r={}){try{return await ke(this.fetch,"POST",`${this.url}/invite`,{body:{email:e,data:r.data},headers:this.headers,redirectTo:r.redirectTo,xform:Qr})}catch(n){if(be(n))return{data:{user:null},error:n};throw n}}async generateLink(e){try{const{options:r}=e,n=ra(e,["options"]),i=Object.assign(Object.assign({},n),r);return"newEmail"in n&&(i.new_email=n==null?void 0:n.newEmail,delete i.newEmail),await ke(this.fetch,"POST",`${this.url}/admin/generate_link`,{body:i,headers:this.headers,xform:lS,redirectTo:r==null?void 0:r.redirectTo})}catch(r){if(be(r))return{data:{properties:null,user:null},error:r};throw r}}async createUser(e){try{return await ke(this.fetch,"POST",`${this.url}/admin/users`,{body:e,headers:this.headers,xform:Qr})}catch(r){if(be(r))return{data:{user:null},error:r};throw r}}async listUsers(e){var r,n,i,a,s,o,l;try{const c={nextPage:null,lastPage:0,total:0},d=await ke(this.fetch,"GET",`${this.url}/admin/users`,{headers:this.headers,noResolveJson:!0,query:{page:(n=(r=e==null?void 0:e.page)===null||r===void 0?void 0:r.toString())!==null&&n!==void 0?n:"",per_page:(a=(i=e==null?void 0:e.perPage)===null||i===void 0?void 0:i.toString())!==null&&a!==void 0?a:""},xform:qp});if(d.error)throw d.error;const h=await d.json(),f=(s=d.headers.get("x-total-count"))!==null&&s!==void 0?s:0,p=(l=(o=d.headers.get("link"))===null||o===void 0?void 0:o.split(","))!==null&&l!==void 0?l:[];return p.length>0&&(p.forEach(y=>{const m=parseInt(y.split(";")[0].split("=")[1].substring(0,1)),b=JSON.parse(y.split(";")[1].split("=")[1]);c[`${b}Page`]=m}),c.total=parseInt(f)),{data:Object.assign(Object.assign({},h),c),error:null}}catch(c){if(be(c))return{data:{users:[]},error:c};throw c}}async getUserById(e){ri(e);try{return await ke(this.fetch,"GET",`${this.url}/admin/users/${e}`,{headers:this.headers,xform:Qr})}catch(r){if(be(r))return{data:{user:null},error:r};throw r}}async updateUserById(e,r){ri(e);try{return await ke(this.fetch,"PUT",`${this.url}/admin/users/${e}`,{body:r,headers:this.headers,xform:Qr})}catch(n){if(be(n))return{data:{user:null},error:n};throw n}}async deleteUser(e,r=!1){ri(e);try{return await ke(this.fetch,"DELETE",`${this.url}/admin/users/${e}`,{headers:this.headers,body:{should_soft_delete:r},xform:Qr})}catch(n){if(be(n))return{data:{user:null},error:n};throw n}}async _listFactors(e){ri(e.userId);try{const{data:r,error:n}=await ke(this.fetch,"GET",`${this.url}/admin/users/${e.userId}/factors`,{headers:this.headers,xform:i=>({data:{factors:i},error:null})});return{data:r,error:n}}catch(r){if(be(r))return{data:null,error:r};throw r}}async _deleteFactor(e){ri(e.userId),ri(e.id);try{return{data:await ke(this.fetch,"DELETE",`${this.url}/admin/users/${e.userId}/factors/${e.id}`,{headers:this.headers}),error:null}}catch(r){if(be(r))return{data:null,error:r};throw r}}async _listOAuthClients(e){var r,n,i,a,s,o,l;try{const c={nextPage:null,lastPage:0,total:0},d=await ke(this.fetch,"GET",`${this.url}/admin/oauth/clients`,{headers:this.headers,noResolveJson:!0,query:{page:(n=(r=e==null?void 0:e.page)===null||r===void 0?void 0:r.toString())!==null&&n!==void 0?n:"",per_page:(a=(i=e==null?void 0:e.perPage)===null||i===void 0?void 0:i.toString())!==null&&a!==void 0?a:""},xform:qp});if(d.error)throw d.error;const h=await d.json(),f=(s=d.headers.get("x-total-count"))!==null&&s!==void 0?s:0,p=(l=(o=d.headers.get("link"))===null||o===void 0?void 0:o.split(","))!==null&&l!==void 0?l:[];return p.length>0&&(p.forEach(y=>{const m=parseInt(y.split(";")[0].split("=")[1].substring(0,1)),b=JSON.parse(y.split(";")[1].split("=")[1]);c[`${b}Page`]=m}),c.total=parseInt(f)),{data:Object.assign(Object.assign({},h),c),error:null}}catch(c){if(be(c))return{data:{clients:[]},error:c};throw c}}async _createOAuthClient(e){try{return await ke(this.fetch,"POST",`${this.url}/admin/oauth/clients`,{body:e,headers:this.headers,xform:r=>({data:r,error:null})})}catch(r){if(be(r))return{data:null,error:r};throw r}}async _getOAuthClient(e){try{return await ke(this.fetch,"GET",`${this.url}/admin/oauth/clients/${e}`,{headers:this.headers,xform:r=>({data:r,error:null})})}catch(r){if(be(r))return{data:null,error:r};throw r}}async _updateOAuthClient(e,r){try{return await ke(this.fetch,"PUT",`${this.url}/admin/oauth/clients/${e}`,{body:r,headers:this.headers,xform:n=>({data:n,error:null})})}catch(n){if(be(n))return{data:null,error:n};throw n}}async _deleteOAuthClient(e){try{return await ke(this.fetch,"DELETE",`${this.url}/admin/oauth/clients/${e}`,{headers:this.headers,noResolveJson:!0}),{data:null,error:null}}catch(r){if(be(r))return{data:null,error:r};throw r}}async _regenerateOAuthClientSecret(e){try{return await ke(this.fetch,"POST",`${this.url}/admin/oauth/clients/${e}/regenerate_secret`,{headers:this.headers,xform:r=>({data:r,error:null})})}catch(r){if(be(r))return{data:null,error:r};throw r}}}function Yp(t={}){return{getItem:e=>t[e]||null,setItem:(e,r)=>{t[e]=r},removeItem:e=>{delete t[e]}}}const ni={debug:!!(globalThis&&eb()&&globalThis.localStorage&&globalThis.localStorage.getItem("supabase.gotrue-js.locks.debug")==="true")};class rb extends Error{constructor(e){super(e),this.isAcquireTimeout=!0}}class dS extends rb{}async function hS(t,e,r){ni.debug&&console.log("@supabase/gotrue-js: navigatorLock: acquire lock",t,e);const n=new globalThis.AbortController;return e>0&&setTimeout(()=>{n.abort(),ni.debug&&console.log("@supabase/gotrue-js: navigatorLock acquire timed out",t)},e),await Promise.resolve().then(()=>globalThis.navigator.locks.request(t,e===0?{mode:"exclusive",ifAvailable:!0}:{mode:"exclusive",signal:n.signal},async i=>{if(i){ni.debug&&console.log("@supabase/gotrue-js: navigatorLock: acquired",t,i.name);try{return await r()}finally{ni.debug&&console.log("@supabase/gotrue-js: navigatorLock: released",t,i.name)}}else{if(e===0)throw ni.debug&&console.log("@supabase/gotrue-js: navigatorLock: not immediately available",t),new dS(`Acquiring an exclusive Navigator LockManager lock "${t}" immediately failed`);if(ni.debug)try{const a=await globalThis.navigator.locks.query();console.log("@supabase/gotrue-js: Navigator LockManager state",JSON.stringify(a,null,"  "))}catch(a){console.warn("@supabase/gotrue-js: Error when querying Navigator LockManager state",a)}return console.warn("@supabase/gotrue-js: Navigator LockManager returned a null lock when using #request without ifAvailable set to true, it appears this browser is not following the LockManager spec https://developer.mozilla.org/en-US/docs/Web/API/LockManager/request"),await r()}}))}function fS(){if(typeof globalThis!="object")try{Object.defineProperty(Object.prototype,"__magic__",{get:function(){return this},configurable:!0}),__magic__.globalThis=__magic__,delete Object.prototype.__magic__}catch{typeof self<"u"&&(self.globalThis=self)}}function nb(t){if(!/^0x[a-fA-F0-9]{40}$/.test(t))throw new Error(`@supabase/auth-js: Address "${t}" is invalid.`);return t.toLowerCase()}function pS(t){return parseInt(t,16)}function gS(t){const e=new TextEncoder().encode(t);return"0x"+Array.from(e,n=>n.toString(16).padStart(2,"0")).join("")}function mS(t){var e;const{chainId:r,domain:n,expirationTime:i,issuedAt:a=new Date,nonce:s,notBefore:o,requestId:l,resources:c,scheme:d,uri:h,version:f}=t;{if(!Number.isInteger(r))throw new Error(`@supabase/auth-js: Invalid SIWE message field "chainId". Chain ID must be a EIP-155 chain ID. Provided value: ${r}`);if(!n)throw new Error('@supabase/auth-js: Invalid SIWE message field "domain". Domain must be provided.');if(s&&s.length<8)throw new Error(`@supabase/auth-js: Invalid SIWE message field "nonce". Nonce must be at least 8 characters. Provided value: ${s}`);if(!h)throw new Error('@supabase/auth-js: Invalid SIWE message field "uri". URI must be provided.');if(f!=="1")throw new Error(`@supabase/auth-js: Invalid SIWE message field "version". Version must be '1'. Provided value: ${f}`);if(!((e=t.statement)===null||e===void 0)&&e.includes(`
`))throw new Error(`@supabase/auth-js: Invalid SIWE message field "statement". Statement must not include '\\n'. Provided value: ${t.statement}`)}const p=nb(t.address),y=d?`${d}://${n}`:n,m=t.statement?`${t.statement}
`:"",b=`${y} wants you to sign in with your Ethereum account:
${p}

${m}`;let v=`URI: ${h}
Version: ${f}
Chain ID: ${r}${s?`
Nonce: ${s}`:""}
Issued At: ${a.toISOString()}`;if(i&&(v+=`
Expiration Time: ${i.toISOString()}`),o&&(v+=`
Not Before: ${o.toISOString()}`),l&&(v+=`
Request ID: ${l}`),c){let g=`
Resources:`;for(const w of c){if(!w||typeof w!="string")throw new Error(`@supabase/auth-js: Invalid SIWE message field "resources". Every resource must be a valid string. Provided value: ${w}`);g+=`
- ${w}`}v+=g}return`${b}
${v}`}class dt extends Error{constructor({message:e,code:r,cause:n,name:i}){var a;super(e,{cause:n}),this.__isWebAuthnError=!0,this.name=(a=i??(n instanceof Error?n.name:void 0))!==null&&a!==void 0?a:"Unknown Error",this.code=r}}class Zo extends dt{constructor(e,r){super({code:"ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",cause:r,message:e}),this.name="WebAuthnUnknownError",this.originalError=r}}function vS({error:t,options:e}){var r,n,i;const{publicKey:a}=e;if(!a)throw Error("options was missing required publicKey property");if(t.name==="AbortError"){if(e.signal instanceof AbortSignal)return new dt({message:"Registration ceremony was sent an abort signal",code:"ERROR_CEREMONY_ABORTED",cause:t})}else if(t.name==="ConstraintError"){if(((r=a.authenticatorSelection)===null||r===void 0?void 0:r.requireResidentKey)===!0)return new dt({message:"Discoverable credentials were required but no available authenticator supported it",code:"ERROR_AUTHENTICATOR_MISSING_DISCOVERABLE_CREDENTIAL_SUPPORT",cause:t});if(e.mediation==="conditional"&&((n=a.authenticatorSelection)===null||n===void 0?void 0:n.userVerification)==="required")return new dt({message:"User verification was required during automatic registration but it could not be performed",code:"ERROR_AUTO_REGISTER_USER_VERIFICATION_FAILURE",cause:t});if(((i=a.authenticatorSelection)===null||i===void 0?void 0:i.userVerification)==="required")return new dt({message:"User verification was required but no available authenticator supported it",code:"ERROR_AUTHENTICATOR_MISSING_USER_VERIFICATION_SUPPORT",cause:t})}else{if(t.name==="InvalidStateError")return new dt({message:"The authenticator was previously registered",code:"ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED",cause:t});if(t.name==="NotAllowedError")return new dt({message:t.message,code:"ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",cause:t});if(t.name==="NotSupportedError")return a.pubKeyCredParams.filter(o=>o.type==="public-key").length===0?new dt({message:'No entry in pubKeyCredParams was of type "public-key"',code:"ERROR_MALFORMED_PUBKEYCREDPARAMS",cause:t}):new dt({message:"No available authenticator supported any of the specified pubKeyCredParams algorithms",code:"ERROR_AUTHENTICATOR_NO_SUPPORTED_PUBKEYCREDPARAMS_ALG",cause:t});if(t.name==="SecurityError"){const s=window.location.hostname;if(ib(s)){if(a.rp.id!==s)return new dt({message:`The RP ID "${a.rp.id}" is invalid for this domain`,code:"ERROR_INVALID_RP_ID",cause:t})}else return new dt({message:`${window.location.hostname} is an invalid domain`,code:"ERROR_INVALID_DOMAIN",cause:t})}else if(t.name==="TypeError"){if(a.user.id.byteLength<1||a.user.id.byteLength>64)return new dt({message:"User ID was not between 1 and 64 characters",code:"ERROR_INVALID_USER_ID_LENGTH",cause:t})}else if(t.name==="UnknownError")return new dt({message:"The authenticator was unable to process the specified options, or could not create a new credential",code:"ERROR_AUTHENTICATOR_GENERAL_ERROR",cause:t})}return new dt({message:"a Non-Webauthn related error has occurred",code:"ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",cause:t})}function yS({error:t,options:e}){const{publicKey:r}=e;if(!r)throw Error("options was missing required publicKey property");if(t.name==="AbortError"){if(e.signal instanceof AbortSignal)return new dt({message:"Authentication ceremony was sent an abort signal",code:"ERROR_CEREMONY_ABORTED",cause:t})}else{if(t.name==="NotAllowedError")return new dt({message:t.message,code:"ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",cause:t});if(t.name==="SecurityError"){const n=window.location.hostname;if(ib(n)){if(r.rpId!==n)return new dt({message:`The RP ID "${r.rpId}" is invalid for this domain`,code:"ERROR_INVALID_RP_ID",cause:t})}else return new dt({message:`${window.location.hostname} is an invalid domain`,code:"ERROR_INVALID_DOMAIN",cause:t})}else if(t.name==="UnknownError")return new dt({message:"The authenticator was unable to process the specified options, or could not create a new assertion signature",code:"ERROR_AUTHENTICATOR_GENERAL_ERROR",cause:t})}return new dt({message:"a Non-Webauthn related error has occurred",code:"ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",cause:t})}class bS{createNewAbortSignal(){if(this.controller){const r=new Error("Cancelling existing WebAuthn API call for new one");r.name="AbortError",this.controller.abort(r)}const e=new AbortController;return this.controller=e,e.signal}cancelCeremony(){if(this.controller){const e=new Error("Manually cancelling existing WebAuthn API call");e.name="AbortError",this.controller.abort(e),this.controller=void 0}}}const wS=new bS;function xS(t){if(!t)throw new Error("Credential creation options are required");if(typeof PublicKeyCredential<"u"&&"parseCreationOptionsFromJSON"in PublicKeyCredential&&typeof PublicKeyCredential.parseCreationOptionsFromJSON=="function")return PublicKeyCredential.parseCreationOptionsFromJSON(t);const{challenge:e,user:r,excludeCredentials:n}=t,i=ra(t,["challenge","user","excludeCredentials"]),a=Hi(e).buffer,s=Object.assign(Object.assign({},r),{id:Hi(r.id).buffer}),o=Object.assign(Object.assign({},i),{challenge:a,user:s});if(n&&n.length>0){o.excludeCredentials=new Array(n.length);for(let l=0;l<n.length;l++){const c=n[l];o.excludeCredentials[l]=Object.assign(Object.assign({},c),{id:Hi(c.id).buffer,type:c.type||"public-key",transports:c.transports})}}return o}function _S(t){if(!t)throw new Error("Credential request options are required");if(typeof PublicKeyCredential<"u"&&"parseRequestOptionsFromJSON"in PublicKeyCredential&&typeof PublicKeyCredential.parseRequestOptionsFromJSON=="function")return PublicKeyCredential.parseRequestOptionsFromJSON(t);const{challenge:e,allowCredentials:r}=t,n=ra(t,["challenge","allowCredentials"]),i=Hi(e).buffer,a=Object.assign(Object.assign({},n),{challenge:i});if(r&&r.length>0){a.allowCredentials=new Array(r.length);for(let s=0;s<r.length;s++){const o=r[s];a.allowCredentials[s]=Object.assign(Object.assign({},o),{id:Hi(o.id).buffer,type:o.type||"public-key",transports:o.transports})}}return a}function SS(t){var e;if("toJSON"in t&&typeof t.toJSON=="function")return t.toJSON();const r=t;return{id:t.id,rawId:t.id,response:{attestationObject:An(new Uint8Array(t.response.attestationObject)),clientDataJSON:An(new Uint8Array(t.response.clientDataJSON))},type:"public-key",clientExtensionResults:t.getClientExtensionResults(),authenticatorAttachment:(e=r.authenticatorAttachment)!==null&&e!==void 0?e:void 0}}function kS(t){var e;if("toJSON"in t&&typeof t.toJSON=="function")return t.toJSON();const r=t,n=t.getClientExtensionResults(),i=t.response;return{id:t.id,rawId:t.id,response:{authenticatorData:An(new Uint8Array(i.authenticatorData)),clientDataJSON:An(new Uint8Array(i.clientDataJSON)),signature:An(new Uint8Array(i.signature)),userHandle:i.userHandle?An(new Uint8Array(i.userHandle)):void 0},type:"public-key",clientExtensionResults:n,authenticatorAttachment:(e=r.authenticatorAttachment)!==null&&e!==void 0?e:void 0}}function ib(t){return t==="localhost"||/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i.test(t)}function Jp(){var t,e;return!!(St()&&"PublicKeyCredential"in window&&window.PublicKeyCredential&&"credentials"in navigator&&typeof((t=navigator==null?void 0:navigator.credentials)===null||t===void 0?void 0:t.create)=="function"&&typeof((e=navigator==null?void 0:navigator.credentials)===null||e===void 0?void 0:e.get)=="function")}async function ES(t){try{const e=await navigator.credentials.create(t);return e?e instanceof PublicKeyCredential?{data:e,error:null}:{data:null,error:new Zo("Browser returned unexpected credential type",e)}:{data:null,error:new Zo("Empty credential response",e)}}catch(e){return{data:null,error:vS({error:e,options:t})}}}async function jS(t){try{const e=await navigator.credentials.get(t);return e?e instanceof PublicKeyCredential?{data:e,error:null}:{data:null,error:new Zo("Browser returned unexpected credential type",e)}:{data:null,error:new Zo("Empty credential response",e)}}catch(e){return{data:null,error:yS({error:e,options:t})}}}const CS={hints:["security-key"],authenticatorSelection:{authenticatorAttachment:"cross-platform",requireResidentKey:!1,userVerification:"preferred",residentKey:"discouraged"},attestation:"none"},TS={userVerification:"preferred",hints:["security-key"]};function Qo(...t){const e=i=>i!==null&&typeof i=="object"&&!Array.isArray(i),r=i=>i instanceof ArrayBuffer||ArrayBuffer.isView(i),n={};for(const i of t)if(i)for(const a in i){const s=i[a];if(s!==void 0)if(Array.isArray(s))n[a]=s;else if(r(s))n[a]=s;else if(e(s)){const o=n[a];e(o)?n[a]=Qo(o,s):n[a]=Qo(s)}else n[a]=s}return n}function OS(t,e){return Qo(CS,t,e||{})}function PS(t,e){return Qo(TS,t,e||{})}class NS{constructor(e){this.client=e,this.enroll=this._enroll.bind(this),this.challenge=this._challenge.bind(this),this.verify=this._verify.bind(this),this.authenticate=this._authenticate.bind(this),this.register=this._register.bind(this)}async _enroll(e){return this.client.mfa.enroll(Object.assign(Object.assign({},e),{factorType:"webauthn"}))}async _challenge({factorId:e,webauthn:r,friendlyName:n,signal:i},a){try{const{data:s,error:o}=await this.client.mfa.challenge({factorId:e,webauthn:r});if(!s)return{data:null,error:o};const l=i??wS.createNewAbortSignal();if(s.webauthn.type==="create"){const{user:c}=s.webauthn.credential_options.publicKey;c.name||(c.name=`${c.id}:${n}`),c.displayName||(c.displayName=c.name)}switch(s.webauthn.type){case"create":{const c=OS(s.webauthn.credential_options.publicKey,a==null?void 0:a.create),{data:d,error:h}=await ES({publicKey:c,signal:l});return d?{data:{factorId:e,challengeId:s.id,webauthn:{type:s.webauthn.type,credential_response:d}},error:null}:{data:null,error:h}}case"request":{const c=PS(s.webauthn.credential_options.publicKey,a==null?void 0:a.request),{data:d,error:h}=await jS(Object.assign(Object.assign({},s.webauthn.credential_options),{publicKey:c,signal:l}));return d?{data:{factorId:e,challengeId:s.id,webauthn:{type:s.webauthn.type,credential_response:d}},error:null}:{data:null,error:h}}}}catch(s){return be(s)?{data:null,error:s}:{data:null,error:new Pn("Unexpected error in challenge",s)}}}async _verify({challengeId:e,factorId:r,webauthn:n}){return this.client.mfa.verify({factorId:r,challengeId:e,webauthn:n})}async _authenticate({factorId:e,webauthn:{rpId:r=typeof window<"u"?window.location.hostname:void 0,rpOrigins:n=typeof window<"u"?[window.location.origin]:void 0,signal:i}},a){if(!r)return{data:null,error:new gs("rpId is required for WebAuthn authentication")};try{if(!Jp())return{data:null,error:new Pn("Browser does not support WebAuthn",null)};const{data:s,error:o}=await this.challenge({factorId:e,webauthn:{rpId:r,rpOrigins:n},signal:i},{request:a});if(!s)return{data:null,error:o};const{webauthn:l}=s;return this._verify({factorId:e,challengeId:s.challengeId,webauthn:{type:l.type,rpId:r,rpOrigins:n,credential_response:l.credential_response}})}catch(s){return be(s)?{data:null,error:s}:{data:null,error:new Pn("Unexpected error in authenticate",s)}}}async _register({friendlyName:e,rpId:r=typeof window<"u"?window.location.hostname:void 0,rpOrigins:n=typeof window<"u"?[window.location.origin]:void 0,signal:i},a){if(!r)return{data:null,error:new gs("rpId is required for WebAuthn registration")};try{if(!Jp())return{data:null,error:new Pn("Browser does not support WebAuthn",null)};const{data:s,error:o}=await this._enroll({friendlyName:e});if(!s)return await this.client.mfa.listFactors().then(d=>{var h;return(h=d.data)===null||h===void 0?void 0:h.all.find(f=>f.factor_type==="webauthn"&&f.friendly_name===e&&f.status!=="unverified")}).then(d=>d?this.client.mfa.unenroll({factorId:d==null?void 0:d.id}):void 0),{data:null,error:o};const{data:l,error:c}=await this._challenge({factorId:s.id,friendlyName:s.friendly_name,webauthn:{rpId:r,rpOrigins:n},signal:i},{create:a});return l?this._verify({factorId:s.id,challengeId:l.challengeId,webauthn:{rpId:r,rpOrigins:n,type:l.webauthn.type,credential_response:l.webauthn.credential_response}}):{data:null,error:c}}catch(s){return be(s)?{data:null,error:s}:{data:null,error:new Pn("Unexpected error in register",s)}}}}fS();const $S={url:T2,storageKey:O2,autoRefreshToken:!0,persistSession:!0,detectSessionInUrl:!0,headers:P2,flowType:"implicit",debug:!1,hasCustomAuthorizationHeader:!1,throwOnError:!1};async function Xp(t,e,r){return await r()}const ii={};class ms{get jwks(){var e,r;return(r=(e=ii[this.storageKey])===null||e===void 0?void 0:e.jwks)!==null&&r!==void 0?r:{keys:[]}}set jwks(e){ii[this.storageKey]=Object.assign(Object.assign({},ii[this.storageKey]),{jwks:e})}get jwks_cached_at(){var e,r;return(r=(e=ii[this.storageKey])===null||e===void 0?void 0:e.cachedAt)!==null&&r!==void 0?r:Number.MIN_SAFE_INTEGER}set jwks_cached_at(e){ii[this.storageKey]=Object.assign(Object.assign({},ii[this.storageKey]),{cachedAt:e})}constructor(e){var r,n;this.userStorage=null,this.memoryStorage=null,this.stateChangeEmitters=new Map,this.autoRefreshTicker=null,this.visibilityChangedCallback=null,this.refreshingDeferred=null,this.initializePromise=null,this.detectSessionInUrl=!0,this.hasCustomAuthorizationHeader=!1,this.suppressGetSessionWarning=!1,this.lockAcquired=!1,this.pendingInLock=[],this.broadcastChannel=null,this.logger=console.log,this.instanceID=ms.nextInstanceID,ms.nextInstanceID+=1,this.instanceID>0&&St()&&console.warn("Multiple GoTrueClient instances detected in the same browser context. It is not an error, but this should be avoided as it may produce undefined behavior when used concurrently under the same storage key.");const i=Object.assign(Object.assign({},$S),e);if(this.logDebugMessages=!!i.debug,typeof i.debug=="function"&&(this.logger=i.debug),this.persistSession=i.persistSession,this.storageKey=i.storageKey,this.autoRefreshToken=i.autoRefreshToken,this.admin=new uS({url:i.url,headers:i.headers,fetch:i.fetch}),this.url=i.url,this.headers=i.headers,this.fetch=tb(i.fetch),this.lock=i.lock||Xp,this.detectSessionInUrl=i.detectSessionInUrl,this.flowType=i.flowType,this.hasCustomAuthorizationHeader=i.hasCustomAuthorizationHeader,this.throwOnError=i.throwOnError,i.lock?this.lock=i.lock:St()&&(!((r=globalThis==null?void 0:globalThis.navigator)===null||r===void 0)&&r.locks)?this.lock=hS:this.lock=Xp,this.jwks||(this.jwks={keys:[]},this.jwks_cached_at=Number.MIN_SAFE_INTEGER),this.mfa={verify:this._verify.bind(this),enroll:this._enroll.bind(this),unenroll:this._unenroll.bind(this),challenge:this._challenge.bind(this),listFactors:this._listFactors.bind(this),challengeAndVerify:this._challengeAndVerify.bind(this),getAuthenticatorAssuranceLevel:this._getAuthenticatorAssuranceLevel.bind(this),webauthn:new NS(this)},this.oauth={getAuthorizationDetails:this._getAuthorizationDetails.bind(this),approveAuthorization:this._approveAuthorization.bind(this),denyAuthorization:this._denyAuthorization.bind(this)},this.persistSession?(i.storage?this.storage=i.storage:eb()?this.storage=globalThis.localStorage:(this.memoryStorage={},this.storage=Yp(this.memoryStorage)),i.userStorage&&(this.userStorage=i.userStorage)):(this.memoryStorage={},this.storage=Yp(this.memoryStorage)),St()&&globalThis.BroadcastChannel&&this.persistSession&&this.storageKey){try{this.broadcastChannel=new globalThis.BroadcastChannel(this.storageKey)}catch(a){console.error("Failed to create a new BroadcastChannel, multi-tab state changes will not be available",a)}(n=this.broadcastChannel)===null||n===void 0||n.addEventListener("message",async a=>{this._debug("received broadcast notification from other tab or client",a),await this._notifyAllSubscribers(a.data.event,a.data.session,!1)})}this.initialize()}isThrowOnErrorEnabled(){return this.throwOnError}_returnResult(e){if(this.throwOnError&&e&&e.error)throw e.error;return e}_debug(...e){return this.logDebugMessages&&this.logger(`GoTrueClient@${this.instanceID} (${Xy}) ${new Date().toISOString()}`,...e),this}async initialize(){return this.initializePromise?await this.initializePromise:(this.initializePromise=(async()=>await this._acquireLock(-1,async()=>await this._initialize()))(),await this.initializePromise)}async _initialize(){var e;try{let r={},n="none";if(St()&&(r=G2(window.location.href),this._isImplicitGrantCallback(r)?n="implicit":await this._isPKCECallback(r)&&(n="pkce")),St()&&this.detectSessionInUrl&&n!=="none"){const{data:i,error:a}=await this._getSessionFromURL(r,n);if(a){if(this._debug("#_initialize()","error detecting session from URL",a),D2(a)){const l=(e=a.details)===null||e===void 0?void 0:e.code;if(l==="identity_already_exists"||l==="identity_not_found"||l==="single_identity_not_deletable")return{error:a}}return await this._removeSession(),{error:a}}const{session:s,redirectType:o}=i;return this._debug("#_initialize()","detected session in URL",s,"redirect type",o),await this._saveSession(s),setTimeout(async()=>{o==="recovery"?await this._notifyAllSubscribers("PASSWORD_RECOVERY",s):await this._notifyAllSubscribers("SIGNED_IN",s)},0),{error:null}}return await this._recoverAndRefresh(),{error:null}}catch(r){return be(r)?this._returnResult({error:r}):this._returnResult({error:new Pn("Unexpected error during initialization",r)})}finally{await this._handleVisibilityChange(),this._debug("#_initialize()","end")}}async signInAnonymously(e){var r,n,i;try{const a=await ke(this.fetch,"POST",`${this.url}/signup`,{headers:this.headers,body:{data:(n=(r=e==null?void 0:e.options)===null||r===void 0?void 0:r.data)!==null&&n!==void 0?n:{},gotrue_meta_security:{captcha_token:(i=e==null?void 0:e.options)===null||i===void 0?void 0:i.captchaToken}},xform:lr}),{data:s,error:o}=a;if(o||!s)return this._returnResult({data:{user:null,session:null},error:o});const l=s.session,c=s.user;return s.session&&(await this._saveSession(s.session),await this._notifyAllSubscribers("SIGNED_IN",l)),this._returnResult({data:{user:c,session:l},error:null})}catch(a){if(be(a))return this._returnResult({data:{user:null,session:null},error:a});throw a}}async signUp(e){var r,n,i;try{let a;if("email"in e){const{email:d,password:h,options:f}=e;let p=null,y=null;this.flowType==="pkce"&&([p,y]=await ti(this.storage,this.storageKey)),a=await ke(this.fetch,"POST",`${this.url}/signup`,{headers:this.headers,redirectTo:f==null?void 0:f.emailRedirectTo,body:{email:d,password:h,data:(r=f==null?void 0:f.data)!==null&&r!==void 0?r:{},gotrue_meta_security:{captcha_token:f==null?void 0:f.captchaToken},code_challenge:p,code_challenge_method:y},xform:lr})}else if("phone"in e){const{phone:d,password:h,options:f}=e;a=await ke(this.fetch,"POST",`${this.url}/signup`,{headers:this.headers,body:{phone:d,password:h,data:(n=f==null?void 0:f.data)!==null&&n!==void 0?n:{},channel:(i=f==null?void 0:f.channel)!==null&&i!==void 0?i:"sms",gotrue_meta_security:{captcha_token:f==null?void 0:f.captchaToken}},xform:lr})}else throw new io("You must provide either an email or phone number and a password");const{data:s,error:o}=a;if(o||!s)return this._returnResult({data:{user:null,session:null},error:o});const l=s.session,c=s.user;return s.session&&(await this._saveSession(s.session),await this._notifyAllSubscribers("SIGNED_IN",l)),this._returnResult({data:{user:c,session:l},error:null})}catch(a){if(be(a))return this._returnResult({data:{user:null,session:null},error:a});throw a}}async signInWithPassword(e){try{let r;if("email"in e){const{email:a,password:s,options:o}=e;r=await ke(this.fetch,"POST",`${this.url}/token?grant_type=password`,{headers:this.headers,body:{email:a,password:s,gotrue_meta_security:{captcha_token:o==null?void 0:o.captchaToken}},xform:Kp})}else if("phone"in e){const{phone:a,password:s,options:o}=e;r=await ke(this.fetch,"POST",`${this.url}/token?grant_type=password`,{headers:this.headers,body:{phone:a,password:s,gotrue_meta_security:{captcha_token:o==null?void 0:o.captchaToken}},xform:Kp})}else throw new io("You must provide either an email or phone number and a password");const{data:n,error:i}=r;if(i)return this._returnResult({data:{user:null,session:null},error:i});if(!n||!n.session||!n.user){const a=new ei;return this._returnResult({data:{user:null,session:null},error:a})}return n.session&&(await this._saveSession(n.session),await this._notifyAllSubscribers("SIGNED_IN",n.session)),this._returnResult({data:Object.assign({user:n.user,session:n.session},n.weak_password?{weakPassword:n.weak_password}:null),error:i})}catch(r){if(be(r))return this._returnResult({data:{user:null,session:null},error:r});throw r}}async signInWithOAuth(e){var r,n,i,a;return await this._handleProviderSignIn(e.provider,{redirectTo:(r=e.options)===null||r===void 0?void 0:r.redirectTo,scopes:(n=e.options)===null||n===void 0?void 0:n.scopes,queryParams:(i=e.options)===null||i===void 0?void 0:i.queryParams,skipBrowserRedirect:(a=e.options)===null||a===void 0?void 0:a.skipBrowserRedirect})}async exchangeCodeForSession(e){return await this.initializePromise,this._acquireLock(-1,async()=>this._exchangeCodeForSession(e))}async signInWithWeb3(e){const{chain:r}=e;switch(r){case"ethereum":return await this.signInWithEthereum(e);case"solana":return await this.signInWithSolana(e);default:throw new Error(`@supabase/auth-js: Unsupported chain "${r}"`)}}async signInWithEthereum(e){var r,n,i,a,s,o,l,c,d,h,f;let p,y;if("message"in e)p=e.message,y=e.signature;else{const{chain:m,wallet:b,statement:v,options:g}=e;let w;if(St())if(typeof b=="object")w=b;else{const $=window;if("ethereum"in $&&typeof $.ethereum=="object"&&"request"in $.ethereum&&typeof $.ethereum.request=="function")w=$.ethereum;else throw new Error("@supabase/auth-js: No compatible Ethereum wallet interface on the window object (window.ethereum) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'ethereum', wallet: resolvedUserWallet }) instead.")}else{if(typeof b!="object"||!(g!=null&&g.url))throw new Error("@supabase/auth-js: Both wallet and url must be specified in non-browser environments.");w=b}const S=new URL((r=g==null?void 0:g.url)!==null&&r!==void 0?r:window.location.href),E=await w.request({method:"eth_requestAccounts"}).then($=>$).catch(()=>{throw new Error("@supabase/auth-js: Wallet method eth_requestAccounts is missing or invalid")});if(!E||E.length===0)throw new Error("@supabase/auth-js: No accounts available. Please ensure the wallet is connected.");const k=nb(E[0]);let C=(n=g==null?void 0:g.signInWithEthereum)===null||n===void 0?void 0:n.chainId;if(!C){const $=await w.request({method:"eth_chainId"});C=pS($)}const N={domain:S.host,address:k,statement:v,uri:S.href,version:"1",chainId:C,nonce:(i=g==null?void 0:g.signInWithEthereum)===null||i===void 0?void 0:i.nonce,issuedAt:(s=(a=g==null?void 0:g.signInWithEthereum)===null||a===void 0?void 0:a.issuedAt)!==null&&s!==void 0?s:new Date,expirationTime:(o=g==null?void 0:g.signInWithEthereum)===null||o===void 0?void 0:o.expirationTime,notBefore:(l=g==null?void 0:g.signInWithEthereum)===null||l===void 0?void 0:l.notBefore,requestId:(c=g==null?void 0:g.signInWithEthereum)===null||c===void 0?void 0:c.requestId,resources:(d=g==null?void 0:g.signInWithEthereum)===null||d===void 0?void 0:d.resources};p=mS(N),y=await w.request({method:"personal_sign",params:[gS(p),k]})}try{const{data:m,error:b}=await ke(this.fetch,"POST",`${this.url}/token?grant_type=web3`,{headers:this.headers,body:Object.assign({chain:"ethereum",message:p,signature:y},!((h=e.options)===null||h===void 0)&&h.captchaToken?{gotrue_meta_security:{captcha_token:(f=e.options)===null||f===void 0?void 0:f.captchaToken}}:null),xform:lr});if(b)throw b;if(!m||!m.session||!m.user){const v=new ei;return this._returnResult({data:{user:null,session:null},error:v})}return m.session&&(await this._saveSession(m.session),await this._notifyAllSubscribers("SIGNED_IN",m.session)),this._returnResult({data:Object.assign({},m),error:b})}catch(m){if(be(m))return this._returnResult({data:{user:null,session:null},error:m});throw m}}async signInWithSolana(e){var r,n,i,a,s,o,l,c,d,h,f,p;let y,m;if("message"in e)y=e.message,m=e.signature;else{const{chain:b,wallet:v,statement:g,options:w}=e;let S;if(St())if(typeof v=="object")S=v;else{const k=window;if("solana"in k&&typeof k.solana=="object"&&("signIn"in k.solana&&typeof k.solana.signIn=="function"||"signMessage"in k.solana&&typeof k.solana.signMessage=="function"))S=k.solana;else throw new Error("@supabase/auth-js: No compatible Solana wallet interface on the window object (window.solana) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'solana', wallet: resolvedUserWallet }) instead.")}else{if(typeof v!="object"||!(w!=null&&w.url))throw new Error("@supabase/auth-js: Both wallet and url must be specified in non-browser environments.");S=v}const E=new URL((r=w==null?void 0:w.url)!==null&&r!==void 0?r:window.location.href);if("signIn"in S&&S.signIn){const k=await S.signIn(Object.assign(Object.assign(Object.assign({issuedAt:new Date().toISOString()},w==null?void 0:w.signInWithSolana),{version:"1",domain:E.host,uri:E.href}),g?{statement:g}:null));let C;if(Array.isArray(k)&&k[0]&&typeof k[0]=="object")C=k[0];else if(k&&typeof k=="object"&&"signedMessage"in k&&"signature"in k)C=k;else throw new Error("@supabase/auth-js: Wallet method signIn() returned unrecognized value");if("signedMessage"in C&&"signature"in C&&(typeof C.signedMessage=="string"||C.signedMessage instanceof Uint8Array)&&C.signature instanceof Uint8Array)y=typeof C.signedMessage=="string"?C.signedMessage:new TextDecoder().decode(C.signedMessage),m=C.signature;else throw new Error("@supabase/auth-js: Wallet method signIn() API returned object without signedMessage and signature fields")}else{if(!("signMessage"in S)||typeof S.signMessage!="function"||!("publicKey"in S)||typeof S!="object"||!S.publicKey||!("toBase58"in S.publicKey)||typeof S.publicKey.toBase58!="function")throw new Error("@supabase/auth-js: Wallet does not have a compatible signMessage() and publicKey.toBase58() API");y=[`${E.host} wants you to sign in with your Solana account:`,S.publicKey.toBase58(),...g?["",g,""]:[""],"Version: 1",`URI: ${E.href}`,`Issued At: ${(i=(n=w==null?void 0:w.signInWithSolana)===null||n===void 0?void 0:n.issuedAt)!==null&&i!==void 0?i:new Date().toISOString()}`,...!((a=w==null?void 0:w.signInWithSolana)===null||a===void 0)&&a.notBefore?[`Not Before: ${w.signInWithSolana.notBefore}`]:[],...!((s=w==null?void 0:w.signInWithSolana)===null||s===void 0)&&s.expirationTime?[`Expiration Time: ${w.signInWithSolana.expirationTime}`]:[],...!((o=w==null?void 0:w.signInWithSolana)===null||o===void 0)&&o.chainId?[`Chain ID: ${w.signInWithSolana.chainId}`]:[],...!((l=w==null?void 0:w.signInWithSolana)===null||l===void 0)&&l.nonce?[`Nonce: ${w.signInWithSolana.nonce}`]:[],...!((c=w==null?void 0:w.signInWithSolana)===null||c===void 0)&&c.requestId?[`Request ID: ${w.signInWithSolana.requestId}`]:[],...!((h=(d=w==null?void 0:w.signInWithSolana)===null||d===void 0?void 0:d.resources)===null||h===void 0)&&h.length?["Resources",...w.signInWithSolana.resources.map(C=>`- ${C}`)]:[]].join(`
`);const k=await S.signMessage(new TextEncoder().encode(y),"utf8");if(!k||!(k instanceof Uint8Array))throw new Error("@supabase/auth-js: Wallet signMessage() API returned an recognized value");m=k}}try{const{data:b,error:v}=await ke(this.fetch,"POST",`${this.url}/token?grant_type=web3`,{headers:this.headers,body:Object.assign({chain:"solana",message:y,signature:An(m)},!((f=e.options)===null||f===void 0)&&f.captchaToken?{gotrue_meta_security:{captcha_token:(p=e.options)===null||p===void 0?void 0:p.captchaToken}}:null),xform:lr});if(v)throw v;if(!b||!b.session||!b.user){const g=new ei;return this._returnResult({data:{user:null,session:null},error:g})}return b.session&&(await this._saveSession(b.session),await this._notifyAllSubscribers("SIGNED_IN",b.session)),this._returnResult({data:Object.assign({},b),error:v})}catch(b){if(be(b))return this._returnResult({data:{user:null,session:null},error:b});throw b}}async _exchangeCodeForSession(e){const r=await Sn(this.storage,`${this.storageKey}-code-verifier`),[n,i]=(r??"").split("/");try{const{data:a,error:s}=await ke(this.fetch,"POST",`${this.url}/token?grant_type=pkce`,{headers:this.headers,body:{auth_code:e,code_verifier:n},xform:lr});if(await Kr(this.storage,`${this.storageKey}-code-verifier`),s)throw s;if(!a||!a.session||!a.user){const o=new ei;return this._returnResult({data:{user:null,session:null,redirectType:null},error:o})}return a.session&&(await this._saveSession(a.session),await this._notifyAllSubscribers("SIGNED_IN",a.session)),this._returnResult({data:Object.assign(Object.assign({},a),{redirectType:i??null}),error:s})}catch(a){if(be(a))return this._returnResult({data:{user:null,session:null,redirectType:null},error:a});throw a}}async signInWithIdToken(e){try{const{options:r,provider:n,token:i,access_token:a,nonce:s}=e,o=await ke(this.fetch,"POST",`${this.url}/token?grant_type=id_token`,{headers:this.headers,body:{provider:n,id_token:i,access_token:a,nonce:s,gotrue_meta_security:{captcha_token:r==null?void 0:r.captchaToken}},xform:lr}),{data:l,error:c}=o;if(c)return this._returnResult({data:{user:null,session:null},error:c});if(!l||!l.session||!l.user){const d=new ei;return this._returnResult({data:{user:null,session:null},error:d})}return l.session&&(await this._saveSession(l.session),await this._notifyAllSubscribers("SIGNED_IN",l.session)),this._returnResult({data:l,error:c})}catch(r){if(be(r))return this._returnResult({data:{user:null,session:null},error:r});throw r}}async signInWithOtp(e){var r,n,i,a,s;try{if("email"in e){const{email:o,options:l}=e;let c=null,d=null;this.flowType==="pkce"&&([c,d]=await ti(this.storage,this.storageKey));const{error:h}=await ke(this.fetch,"POST",`${this.url}/otp`,{headers:this.headers,body:{email:o,data:(r=l==null?void 0:l.data)!==null&&r!==void 0?r:{},create_user:(n=l==null?void 0:l.shouldCreateUser)!==null&&n!==void 0?n:!0,gotrue_meta_security:{captcha_token:l==null?void 0:l.captchaToken},code_challenge:c,code_challenge_method:d},redirectTo:l==null?void 0:l.emailRedirectTo});return this._returnResult({data:{user:null,session:null},error:h})}if("phone"in e){const{phone:o,options:l}=e,{data:c,error:d}=await ke(this.fetch,"POST",`${this.url}/otp`,{headers:this.headers,body:{phone:o,data:(i=l==null?void 0:l.data)!==null&&i!==void 0?i:{},create_user:(a=l==null?void 0:l.shouldCreateUser)!==null&&a!==void 0?a:!0,gotrue_meta_security:{captcha_token:l==null?void 0:l.captchaToken},channel:(s=l==null?void 0:l.channel)!==null&&s!==void 0?s:"sms"}});return this._returnResult({data:{user:null,session:null,messageId:c==null?void 0:c.message_id},error:d})}throw new io("You must provide either an email or phone number.")}catch(o){if(be(o))return this._returnResult({data:{user:null,session:null},error:o});throw o}}async verifyOtp(e){var r,n;try{let i,a;"options"in e&&(i=(r=e.options)===null||r===void 0?void 0:r.redirectTo,a=(n=e.options)===null||n===void 0?void 0:n.captchaToken);const{data:s,error:o}=await ke(this.fetch,"POST",`${this.url}/verify`,{headers:this.headers,body:Object.assign(Object.assign({},e),{gotrue_meta_security:{captcha_token:a}}),redirectTo:i,xform:lr});if(o)throw o;if(!s)throw new Error("An error occurred on token verification.");const l=s.session,c=s.user;return l!=null&&l.access_token&&(await this._saveSession(l),await this._notifyAllSubscribers(e.type=="recovery"?"PASSWORD_RECOVERY":"SIGNED_IN",l)),this._returnResult({data:{user:c,session:l},error:null})}catch(i){if(be(i))return this._returnResult({data:{user:null,session:null},error:i});throw i}}async signInWithSSO(e){var r,n,i;try{let a=null,s=null;this.flowType==="pkce"&&([a,s]=await ti(this.storage,this.storageKey));const o=await ke(this.fetch,"POST",`${this.url}/sso`,{body:Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({},"providerId"in e?{provider_id:e.providerId}:null),"domain"in e?{domain:e.domain}:null),{redirect_to:(n=(r=e.options)===null||r===void 0?void 0:r.redirectTo)!==null&&n!==void 0?n:void 0}),!((i=e==null?void 0:e.options)===null||i===void 0)&&i.captchaToken?{gotrue_meta_security:{captcha_token:e.options.captchaToken}}:null),{skip_http_redirect:!0,code_challenge:a,code_challenge_method:s}),headers:this.headers,xform:oS});return this._returnResult(o)}catch(a){if(be(a))return this._returnResult({data:null,error:a});throw a}}async reauthenticate(){return await this.initializePromise,await this._acquireLock(-1,async()=>await this._reauthenticate())}async _reauthenticate(){try{return await this._useSession(async e=>{const{data:{session:r},error:n}=e;if(n)throw n;if(!r)throw new or;const{error:i}=await ke(this.fetch,"GET",`${this.url}/reauthenticate`,{headers:this.headers,jwt:r.access_token});return this._returnResult({data:{user:null,session:null},error:i})})}catch(e){if(be(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async resend(e){try{const r=`${this.url}/resend`;if("email"in e){const{email:n,type:i,options:a}=e,{error:s}=await ke(this.fetch,"POST",r,{headers:this.headers,body:{email:n,type:i,gotrue_meta_security:{captcha_token:a==null?void 0:a.captchaToken}},redirectTo:a==null?void 0:a.emailRedirectTo});return this._returnResult({data:{user:null,session:null},error:s})}else if("phone"in e){const{phone:n,type:i,options:a}=e,{data:s,error:o}=await ke(this.fetch,"POST",r,{headers:this.headers,body:{phone:n,type:i,gotrue_meta_security:{captcha_token:a==null?void 0:a.captchaToken}}});return this._returnResult({data:{user:null,session:null,messageId:s==null?void 0:s.message_id},error:o})}throw new io("You must provide either an email or phone number and a type")}catch(r){if(be(r))return this._returnResult({data:{user:null,session:null},error:r});throw r}}async getSession(){return await this.initializePromise,await this._acquireLock(-1,async()=>this._useSession(async r=>r))}async _acquireLock(e,r){this._debug("#_acquireLock","begin",e);try{if(this.lockAcquired){const n=this.pendingInLock.length?this.pendingInLock[this.pendingInLock.length-1]:Promise.resolve(),i=(async()=>(await n,await r()))();return this.pendingInLock.push((async()=>{try{await i}catch{}})()),i}return await this.lock(`lock:${this.storageKey}`,e,async()=>{this._debug("#_acquireLock","lock acquired for storage key",this.storageKey);try{this.lockAcquired=!0;const n=r();for(this.pendingInLock.push((async()=>{try{await n}catch{}})()),await n;this.pendingInLock.length;){const i=[...this.pendingInLock];await Promise.all(i),this.pendingInLock.splice(0,i.length)}return await n}finally{this._debug("#_acquireLock","lock released for storage key",this.storageKey),this.lockAcquired=!1}})}finally{this._debug("#_acquireLock","end")}}async _useSession(e){this._debug("#_useSession","begin");try{const r=await this.__loadSession();return await e(r)}finally{this._debug("#_useSession","end")}}async __loadSession(){this._debug("#__loadSession()","begin"),this.lockAcquired||this._debug("#__loadSession()","used outside of an acquired lock!",new Error().stack);try{let e=null;const r=await Sn(this.storage,this.storageKey);if(this._debug("#getSession()","session from storage",r),r!==null&&(this._isValidSession(r)?e=r:(this._debug("#getSession()","session from storage is not valid"),await this._removeSession())),!e)return{data:{session:null},error:null};const n=e.expires_at?e.expires_at*1e3-Date.now()<kc:!1;if(this._debug("#__loadSession()",`session has${n?"":" not"} expired`,"expires_at",e.expires_at),!n){if(this.userStorage){const s=await Sn(this.userStorage,this.storageKey+"-user");s!=null&&s.user?e.user=s.user:e.user=Cc()}if(this.storage.isServer&&e.user&&!e.user.__isUserNotAvailableProxy){const s={value:this.suppressGetSessionWarning};e.user=nS(e.user,s),s.value&&(this.suppressGetSessionWarning=!0)}return{data:{session:e},error:null}}const{data:i,error:a}=await this._callRefreshToken(e.refresh_token);return a?this._returnResult({data:{session:null},error:a}):this._returnResult({data:{session:i},error:null})}finally{this._debug("#__loadSession()","end")}}async getUser(e){return e?await this._getUser(e):(await this.initializePromise,await this._acquireLock(-1,async()=>await this._getUser()))}async _getUser(e){try{return e?await ke(this.fetch,"GET",`${this.url}/user`,{headers:this.headers,jwt:e,xform:Qr}):await this._useSession(async r=>{var n,i,a;const{data:s,error:o}=r;if(o)throw o;return!(!((n=s.session)===null||n===void 0)&&n.access_token)&&!this.hasCustomAuthorizationHeader?{data:{user:null},error:new or}:await ke(this.fetch,"GET",`${this.url}/user`,{headers:this.headers,jwt:(a=(i=s.session)===null||i===void 0?void 0:i.access_token)!==null&&a!==void 0?a:void 0,xform:Qr})})}catch(r){if(be(r))return I2(r)&&(await this._removeSession(),await Kr(this.storage,`${this.storageKey}-code-verifier`)),this._returnResult({data:{user:null},error:r});throw r}}async updateUser(e,r={}){return await this.initializePromise,await this._acquireLock(-1,async()=>await this._updateUser(e,r))}async _updateUser(e,r={}){try{return await this._useSession(async n=>{const{data:i,error:a}=n;if(a)throw a;if(!i.session)throw new or;const s=i.session;let o=null,l=null;this.flowType==="pkce"&&e.email!=null&&([o,l]=await ti(this.storage,this.storageKey));const{data:c,error:d}=await ke(this.fetch,"PUT",`${this.url}/user`,{headers:this.headers,redirectTo:r==null?void 0:r.emailRedirectTo,body:Object.assign(Object.assign({},e),{code_challenge:o,code_challenge_method:l}),jwt:s.access_token,xform:Qr});if(d)throw d;return s.user=c.user,await this._saveSession(s),await this._notifyAllSubscribers("USER_UPDATED",s),this._returnResult({data:{user:s.user},error:null})})}catch(n){if(be(n))return this._returnResult({data:{user:null},error:n});throw n}}async setSession(e){return await this.initializePromise,await this._acquireLock(-1,async()=>await this._setSession(e))}async _setSession(e){try{if(!e.access_token||!e.refresh_token)throw new or;const r=Date.now()/1e3;let n=r,i=!0,a=null;const{payload:s}=jc(e.access_token);if(s.exp&&(n=s.exp,i=n<=r),i){const{data:o,error:l}=await this._callRefreshToken(e.refresh_token);if(l)return this._returnResult({data:{user:null,session:null},error:l});if(!o)return{data:{user:null,session:null},error:null};a=o}else{const{data:o,error:l}=await this._getUser(e.access_token);if(l)throw l;a={access_token:e.access_token,refresh_token:e.refresh_token,user:o.user,token_type:"bearer",expires_in:n-r,expires_at:n},await this._saveSession(a),await this._notifyAllSubscribers("SIGNED_IN",a)}return this._returnResult({data:{user:a.user,session:a},error:null})}catch(r){if(be(r))return this._returnResult({data:{session:null,user:null},error:r});throw r}}async refreshSession(e){return await this.initializePromise,await this._acquireLock(-1,async()=>await this._refreshSession(e))}async _refreshSession(e){try{return await this._useSession(async r=>{var n;if(!e){const{data:s,error:o}=r;if(o)throw o;e=(n=s.session)!==null&&n!==void 0?n:void 0}if(!(e!=null&&e.refresh_token))throw new or;const{data:i,error:a}=await this._callRefreshToken(e.refresh_token);return a?this._returnResult({data:{user:null,session:null},error:a}):i?this._returnResult({data:{user:i.user,session:i},error:null}):this._returnResult({data:{user:null,session:null},error:null})})}catch(r){if(be(r))return this._returnResult({data:{user:null,session:null},error:r});throw r}}async _getSessionFromURL(e,r){try{if(!St())throw new ao("No browser detected.");if(e.error||e.error_description||e.error_code)throw new ao(e.error_description||"Error in URL with unspecified error_description",{error:e.error||"unspecified_error",code:e.error_code||"unspecified_code"});switch(r){case"implicit":if(this.flowType==="pkce")throw new Fp("Not a valid PKCE flow url.");break;case"pkce":if(this.flowType==="implicit")throw new ao("Not a valid implicit grant flow url.");break;default:}if(r==="pkce"){if(this._debug("#_initialize()","begin","is PKCE flow",!0),!e.code)throw new Fp("No code detected.");const{data:g,error:w}=await this._exchangeCodeForSession(e.code);if(w)throw w;const S=new URL(window.location.href);return S.searchParams.delete("code"),window.history.replaceState(window.history.state,"",S.toString()),{data:{session:g.session,redirectType:null},error:null}}const{provider_token:n,provider_refresh_token:i,access_token:a,refresh_token:s,expires_in:o,expires_at:l,token_type:c}=e;if(!a||!o||!s||!c)throw new ao("No session defined in URL");const d=Math.round(Date.now()/1e3),h=parseInt(o);let f=d+h;l&&(f=parseInt(l));const p=f-d;p*1e3<=si&&console.warn(`@supabase/gotrue-js: Session as retrieved from URL expires in ${p}s, should have been closer to ${h}s`);const y=f-h;d-y>=120?console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued over 120s ago, URL could be stale",y,f,d):d-y<0&&console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued in the future? Check the device clock for skew",y,f,d);const{data:m,error:b}=await this._getUser(a);if(b)throw b;const v={provider_token:n,provider_refresh_token:i,access_token:a,expires_in:h,expires_at:f,refresh_token:s,token_type:c,user:m.user};return window.location.hash="",this._debug("#_getSessionFromURL()","clearing window.location.hash"),this._returnResult({data:{session:v,redirectType:e.type},error:null})}catch(n){if(be(n))return this._returnResult({data:{session:null,redirectType:null},error:n});throw n}}_isImplicitGrantCallback(e){return!!(e.access_token||e.error_description)}async _isPKCECallback(e){const r=await Sn(this.storage,`${this.storageKey}-code-verifier`);return!!(e.code&&r)}async signOut(e={scope:"global"}){return await this.initializePromise,await this._acquireLock(-1,async()=>await this._signOut(e))}async _signOut({scope:e}={scope:"global"}){return await this._useSession(async r=>{var n;const{data:i,error:a}=r;if(a)return this._returnResult({error:a});const s=(n=i.session)===null||n===void 0?void 0:n.access_token;if(s){const{error:o}=await this.admin.signOut(s,e);if(o&&!(A2(o)&&(o.status===404||o.status===401||o.status===403)))return this._returnResult({error:o})}return e!=="others"&&(await this._removeSession(),await Kr(this.storage,`${this.storageKey}-code-verifier`)),this._returnResult({error:null})})}onAuthStateChange(e){const r=H2(),n={id:r,callback:e,unsubscribe:()=>{this._debug("#unsubscribe()","state change callback with id removed",r),this.stateChangeEmitters.delete(r)}};return this._debug("#onAuthStateChange()","registered callback with id",r),this.stateChangeEmitters.set(r,n),(async()=>(await this.initializePromise,await this._acquireLock(-1,async()=>{this._emitInitialSession(r)})))(),{data:{subscription:n}}}async _emitInitialSession(e){return await this._useSession(async r=>{var n,i;try{const{data:{session:a},error:s}=r;if(s)throw s;await((n=this.stateChangeEmitters.get(e))===null||n===void 0?void 0:n.callback("INITIAL_SESSION",a)),this._debug("INITIAL_SESSION","callback id",e,"session",a)}catch(a){await((i=this.stateChangeEmitters.get(e))===null||i===void 0?void 0:i.callback("INITIAL_SESSION",null)),this._debug("INITIAL_SESSION","callback id",e,"error",a),console.error(a)}})}async resetPasswordForEmail(e,r={}){let n=null,i=null;this.flowType==="pkce"&&([n,i]=await ti(this.storage,this.storageKey,!0));try{return await ke(this.fetch,"POST",`${this.url}/recover`,{body:{email:e,code_challenge:n,code_challenge_method:i,gotrue_meta_security:{captcha_token:r.captchaToken}},headers:this.headers,redirectTo:r.redirectTo})}catch(a){if(be(a))return this._returnResult({data:null,error:a});throw a}}async getUserIdentities(){var e;try{const{data:r,error:n}=await this.getUser();if(n)throw n;return this._returnResult({data:{identities:(e=r.user.identities)!==null&&e!==void 0?e:[]},error:null})}catch(r){if(be(r))return this._returnResult({data:null,error:r});throw r}}async linkIdentity(e){return"token"in e?this.linkIdentityIdToken(e):this.linkIdentityOAuth(e)}async linkIdentityOAuth(e){var r;try{const{data:n,error:i}=await this._useSession(async a=>{var s,o,l,c,d;const{data:h,error:f}=a;if(f)throw f;const p=await this._getUrlForProvider(`${this.url}/user/identities/authorize`,e.provider,{redirectTo:(s=e.options)===null||s===void 0?void 0:s.redirectTo,scopes:(o=e.options)===null||o===void 0?void 0:o.scopes,queryParams:(l=e.options)===null||l===void 0?void 0:l.queryParams,skipBrowserRedirect:!0});return await ke(this.fetch,"GET",p,{headers:this.headers,jwt:(d=(c=h.session)===null||c===void 0?void 0:c.access_token)!==null&&d!==void 0?d:void 0})});if(i)throw i;return St()&&!(!((r=e.options)===null||r===void 0)&&r.skipBrowserRedirect)&&window.location.assign(n==null?void 0:n.url),this._returnResult({data:{provider:e.provider,url:n==null?void 0:n.url},error:null})}catch(n){if(be(n))return this._returnResult({data:{provider:e.provider,url:null},error:n});throw n}}async linkIdentityIdToken(e){return await this._useSession(async r=>{var n;try{const{error:i,data:{session:a}}=r;if(i)throw i;const{options:s,provider:o,token:l,access_token:c,nonce:d}=e,h=await ke(this.fetch,"POST",`${this.url}/token?grant_type=id_token`,{headers:this.headers,jwt:(n=a==null?void 0:a.access_token)!==null&&n!==void 0?n:void 0,body:{provider:o,id_token:l,access_token:c,nonce:d,link_identity:!0,gotrue_meta_security:{captcha_token:s==null?void 0:s.captchaToken}},xform:lr}),{data:f,error:p}=h;return p?this._returnResult({data:{user:null,session:null},error:p}):!f||!f.session||!f.user?this._returnResult({data:{user:null,session:null},error:new ei}):(f.session&&(await this._saveSession(f.session),await this._notifyAllSubscribers("USER_UPDATED",f.session)),this._returnResult({data:f,error:p}))}catch(i){if(be(i))return this._returnResult({data:{user:null,session:null},error:i});throw i}})}async unlinkIdentity(e){try{return await this._useSession(async r=>{var n,i;const{data:a,error:s}=r;if(s)throw s;return await ke(this.fetch,"DELETE",`${this.url}/user/identities/${e.identity_id}`,{headers:this.headers,jwt:(i=(n=a.session)===null||n===void 0?void 0:n.access_token)!==null&&i!==void 0?i:void 0})})}catch(r){if(be(r))return this._returnResult({data:null,error:r});throw r}}async _refreshAccessToken(e){const r=`#_refreshAccessToken(${e.substring(0,5)}...)`;this._debug(r,"begin");try{const n=Date.now();return await K2(async i=>(i>0&&await W2(200*Math.pow(2,i-1)),this._debug(r,"refreshing attempt",i),await ke(this.fetch,"POST",`${this.url}/token?grant_type=refresh_token`,{body:{refresh_token:e},headers:this.headers,xform:lr})),(i,a)=>{const s=200*Math.pow(2,i);return a&&Ec(a)&&Date.now()+s-n<si})}catch(n){if(this._debug(r,"error",n),be(n))return this._returnResult({data:{session:null,user:null},error:n});throw n}finally{this._debug(r,"end")}}_isValidSession(e){return typeof e=="object"&&e!==null&&"access_token"in e&&"refresh_token"in e&&"expires_at"in e}async _handleProviderSignIn(e,r){const n=await this._getUrlForProvider(`${this.url}/authorize`,e,{redirectTo:r.redirectTo,scopes:r.scopes,queryParams:r.queryParams});return this._debug("#_handleProviderSignIn()","provider",e,"options",r,"url",n),St()&&!r.skipBrowserRedirect&&window.location.assign(n),{data:{provider:e,url:n},error:null}}async _recoverAndRefresh(){var e,r;const n="#_recoverAndRefresh()";this._debug(n,"begin");try{const i=await Sn(this.storage,this.storageKey);if(i&&this.userStorage){let s=await Sn(this.userStorage,this.storageKey+"-user");!this.storage.isServer&&Object.is(this.storage,this.userStorage)&&!s&&(s={user:i.user},await oi(this.userStorage,this.storageKey+"-user",s)),i.user=(e=s==null?void 0:s.user)!==null&&e!==void 0?e:Cc()}else if(i&&!i.user&&!i.user){const s=await Sn(this.storage,this.storageKey+"-user");s&&(s!=null&&s.user)?(i.user=s.user,await Kr(this.storage,this.storageKey+"-user"),await oi(this.storage,this.storageKey,i)):i.user=Cc()}if(this._debug(n,"session from storage",i),!this._isValidSession(i)){this._debug(n,"session is not valid"),i!==null&&await this._removeSession();return}const a=((r=i.expires_at)!==null&&r!==void 0?r:1/0)*1e3-Date.now()<kc;if(this._debug(n,`session has${a?"":" not"} expired with margin of ${kc}s`),a){if(this.autoRefreshToken&&i.refresh_token){const{error:s}=await this._callRefreshToken(i.refresh_token);s&&(console.error(s),Ec(s)||(this._debug(n,"refresh failed with a non-retryable error, removing the session",s),await this._removeSession()))}}else if(i.user&&i.user.__isUserNotAvailableProxy===!0)try{const{data:s,error:o}=await this._getUser(i.access_token);!o&&(s!=null&&s.user)?(i.user=s.user,await this._saveSession(i),await this._notifyAllSubscribers("SIGNED_IN",i)):this._debug(n,"could not get user data, skipping SIGNED_IN notification")}catch(s){console.error("Error getting user data:",s),this._debug(n,"error getting user data, skipping SIGNED_IN notification",s)}else await this._notifyAllSubscribers("SIGNED_IN",i)}catch(i){this._debug(n,"error",i),console.error(i);return}finally{this._debug(n,"end")}}async _callRefreshToken(e){var r,n;if(!e)throw new or;if(this.refreshingDeferred)return this.refreshingDeferred.promise;const i=`#_callRefreshToken(${e.substring(0,5)}...)`;this._debug(i,"begin");try{this.refreshingDeferred=new Cl;const{data:a,error:s}=await this._refreshAccessToken(e);if(s)throw s;if(!a.session)throw new or;await this._saveSession(a.session),await this._notifyAllSubscribers("TOKEN_REFRESHED",a.session);const o={data:a.session,error:null};return this.refreshingDeferred.resolve(o),o}catch(a){if(this._debug(i,"error",a),be(a)){const s={data:null,error:a};return Ec(a)||await this._removeSession(),(r=this.refreshingDeferred)===null||r===void 0||r.resolve(s),s}throw(n=this.refreshingDeferred)===null||n===void 0||n.reject(a),a}finally{this.refreshingDeferred=null,this._debug(i,"end")}}async _notifyAllSubscribers(e,r,n=!0){const i=`#_notifyAllSubscribers(${e})`;this._debug(i,"begin",r,`broadcast = ${n}`);try{this.broadcastChannel&&n&&this.broadcastChannel.postMessage({event:e,session:r});const a=[],s=Array.from(this.stateChangeEmitters.values()).map(async o=>{try{await o.callback(e,r)}catch(l){a.push(l)}});if(await Promise.all(s),a.length>0){for(let o=0;o<a.length;o+=1)console.error(a[o]);throw a[0]}}finally{this._debug(i,"end")}}async _saveSession(e){this._debug("#_saveSession()",e),this.suppressGetSessionWarning=!0;const r=Object.assign({},e),n=r.user&&r.user.__isUserNotAvailableProxy===!0;if(this.userStorage){!n&&r.user&&await oi(this.userStorage,this.storageKey+"-user",{user:r.user});const i=Object.assign({},r);delete i.user;const a=Vp(i);await oi(this.storage,this.storageKey,a)}else{const i=Vp(r);await oi(this.storage,this.storageKey,i)}}async _removeSession(){this._debug("#_removeSession()"),await Kr(this.storage,this.storageKey),await Kr(this.storage,this.storageKey+"-code-verifier"),await Kr(this.storage,this.storageKey+"-user"),this.userStorage&&await Kr(this.userStorage,this.storageKey+"-user"),await this._notifyAllSubscribers("SIGNED_OUT",null)}_removeVisibilityChangedCallback(){this._debug("#_removeVisibilityChangedCallback()");const e=this.visibilityChangedCallback;this.visibilityChangedCallback=null;try{e&&St()&&(window!=null&&window.removeEventListener)&&window.removeEventListener("visibilitychange",e)}catch(r){console.error("removing visibilitychange callback failed",r)}}async _startAutoRefresh(){await this._stopAutoRefresh(),this._debug("#_startAutoRefresh()");const e=setInterval(()=>this._autoRefreshTokenTick(),si);this.autoRefreshTicker=e,e&&typeof e=="object"&&typeof e.unref=="function"?e.unref():typeof Deno<"u"&&typeof Deno.unrefTimer=="function"&&Deno.unrefTimer(e),setTimeout(async()=>{await this.initializePromise,await this._autoRefreshTokenTick()},0)}async _stopAutoRefresh(){this._debug("#_stopAutoRefresh()");const e=this.autoRefreshTicker;this.autoRefreshTicker=null,e&&clearInterval(e)}async startAutoRefresh(){this._removeVisibilityChangedCallback(),await this._startAutoRefresh()}async stopAutoRefresh(){this._removeVisibilityChangedCallback(),await this._stopAutoRefresh()}async _autoRefreshTokenTick(){this._debug("#_autoRefreshTokenTick()","begin");try{await this._acquireLock(0,async()=>{try{const e=Date.now();try{return await this._useSession(async r=>{const{data:{session:n}}=r;if(!n||!n.refresh_token||!n.expires_at){this._debug("#_autoRefreshTokenTick()","no session");return}const i=Math.floor((n.expires_at*1e3-e)/si);this._debug("#_autoRefreshTokenTick()",`access token expires in ${i} ticks, a tick lasts ${si}ms, refresh threshold is ${Hu} ticks`),i<=Hu&&await this._callRefreshToken(n.refresh_token)})}catch(r){console.error("Auto refresh tick failed with error. This is likely a transient error.",r)}}finally{this._debug("#_autoRefreshTokenTick()","end")}})}catch(e){if(e.isAcquireTimeout||e instanceof rb)this._debug("auto refresh token tick lock not available");else throw e}}async _handleVisibilityChange(){if(this._debug("#_handleVisibilityChange()"),!St()||!(window!=null&&window.addEventListener))return this.autoRefreshToken&&this.startAutoRefresh(),!1;try{this.visibilityChangedCallback=async()=>await this._onVisibilityChanged(!1),window==null||window.addEventListener("visibilitychange",this.visibilityChangedCallback),await this._onVisibilityChanged(!0)}catch(e){console.error("_handleVisibilityChange",e)}}async _onVisibilityChanged(e){const r=`#_onVisibilityChanged(${e})`;this._debug(r,"visibilityState",document.visibilityState),document.visibilityState==="visible"?(this.autoRefreshToken&&this._startAutoRefresh(),e||(await this.initializePromise,await this._acquireLock(-1,async()=>{if(document.visibilityState!=="visible"){this._debug(r,"acquired the lock to recover the session, but the browser visibilityState is no longer visible, aborting");return}await this._recoverAndRefresh()}))):document.visibilityState==="hidden"&&this.autoRefreshToken&&this._stopAutoRefresh()}async _getUrlForProvider(e,r,n){const i=[`provider=${encodeURIComponent(r)}`];if(n!=null&&n.redirectTo&&i.push(`redirect_to=${encodeURIComponent(n.redirectTo)}`),n!=null&&n.scopes&&i.push(`scopes=${encodeURIComponent(n.scopes)}`),this.flowType==="pkce"){const[a,s]=await ti(this.storage,this.storageKey),o=new URLSearchParams({code_challenge:`${encodeURIComponent(a)}`,code_challenge_method:`${encodeURIComponent(s)}`});i.push(o.toString())}if(n!=null&&n.queryParams){const a=new URLSearchParams(n.queryParams);i.push(a.toString())}return n!=null&&n.skipBrowserRedirect&&i.push(`skip_http_redirect=${n.skipBrowserRedirect}`),`${e}?${i.join("&")}`}async _unenroll(e){try{return await this._useSession(async r=>{var n;const{data:i,error:a}=r;return a?this._returnResult({data:null,error:a}):await ke(this.fetch,"DELETE",`${this.url}/factors/${e.factorId}`,{headers:this.headers,jwt:(n=i==null?void 0:i.session)===null||n===void 0?void 0:n.access_token})})}catch(r){if(be(r))return this._returnResult({data:null,error:r});throw r}}async _enroll(e){try{return await this._useSession(async r=>{var n,i;const{data:a,error:s}=r;if(s)return this._returnResult({data:null,error:s});const o=Object.assign({friendly_name:e.friendlyName,factor_type:e.factorType},e.factorType==="phone"?{phone:e.phone}:e.factorType==="totp"?{issuer:e.issuer}:{}),{data:l,error:c}=await ke(this.fetch,"POST",`${this.url}/factors`,{body:o,headers:this.headers,jwt:(n=a==null?void 0:a.session)===null||n===void 0?void 0:n.access_token});return c?this._returnResult({data:null,error:c}):(e.factorType==="totp"&&l.type==="totp"&&(!((i=l==null?void 0:l.totp)===null||i===void 0)&&i.qr_code)&&(l.totp.qr_code=`data:image/svg+xml;utf-8,${l.totp.qr_code}`),this._returnResult({data:l,error:null}))})}catch(r){if(be(r))return this._returnResult({data:null,error:r});throw r}}async _verify(e){return this._acquireLock(-1,async()=>{try{return await this._useSession(async r=>{var n;const{data:i,error:a}=r;if(a)return this._returnResult({data:null,error:a});const s=Object.assign({challenge_id:e.challengeId},"webauthn"in e?{webauthn:Object.assign(Object.assign({},e.webauthn),{credential_response:e.webauthn.type==="create"?SS(e.webauthn.credential_response):kS(e.webauthn.credential_response)})}:{code:e.code}),{data:o,error:l}=await ke(this.fetch,"POST",`${this.url}/factors/${e.factorId}/verify`,{body:s,headers:this.headers,jwt:(n=i==null?void 0:i.session)===null||n===void 0?void 0:n.access_token});return l?this._returnResult({data:null,error:l}):(await this._saveSession(Object.assign({expires_at:Math.round(Date.now()/1e3)+o.expires_in},o)),await this._notifyAllSubscribers("MFA_CHALLENGE_VERIFIED",o),this._returnResult({data:o,error:l}))})}catch(r){if(be(r))return this._returnResult({data:null,error:r});throw r}})}async _challenge(e){return this._acquireLock(-1,async()=>{try{return await this._useSession(async r=>{var n;const{data:i,error:a}=r;if(a)return this._returnResult({data:null,error:a});const s=await ke(this.fetch,"POST",`${this.url}/factors/${e.factorId}/challenge`,{body:e,headers:this.headers,jwt:(n=i==null?void 0:i.session)===null||n===void 0?void 0:n.access_token});if(s.error)return s;const{data:o}=s;if(o.type!=="webauthn")return{data:o,error:null};switch(o.webauthn.type){case"create":return{data:Object.assign(Object.assign({},o),{webauthn:Object.assign(Object.assign({},o.webauthn),{credential_options:Object.assign(Object.assign({},o.webauthn.credential_options),{publicKey:xS(o.webauthn.credential_options.publicKey)})})}),error:null};case"request":return{data:Object.assign(Object.assign({},o),{webauthn:Object.assign(Object.assign({},o.webauthn),{credential_options:Object.assign(Object.assign({},o.webauthn.credential_options),{publicKey:_S(o.webauthn.credential_options.publicKey)})})}),error:null}}})}catch(r){if(be(r))return this._returnResult({data:null,error:r});throw r}})}async _challengeAndVerify(e){const{data:r,error:n}=await this._challenge({factorId:e.factorId});return n?this._returnResult({data:null,error:n}):await this._verify({factorId:e.factorId,challengeId:r.id,code:e.code})}async _listFactors(){var e;const{data:{user:r},error:n}=await this.getUser();if(n)return{data:null,error:n};const i={all:[],phone:[],totp:[],webauthn:[]};for(const a of(e=r==null?void 0:r.factors)!==null&&e!==void 0?e:[])i.all.push(a),a.status==="verified"&&i[a.factor_type].push(a);return{data:i,error:null}}async _getAuthenticatorAssuranceLevel(){var e,r;const{data:{session:n},error:i}=await this.getSession();if(i)return this._returnResult({data:null,error:i});if(!n)return{data:{currentLevel:null,nextLevel:null,currentAuthenticationMethods:[]},error:null};const{payload:a}=jc(n.access_token);let s=null;a.aal&&(s=a.aal);let o=s;((r=(e=n.user.factors)===null||e===void 0?void 0:e.filter(d=>d.status==="verified"))!==null&&r!==void 0?r:[]).length>0&&(o="aal2");const c=a.amr||[];return{data:{currentLevel:s,nextLevel:o,currentAuthenticationMethods:c},error:null}}async _getAuthorizationDetails(e){try{return await this._useSession(async r=>{const{data:{session:n},error:i}=r;return i?this._returnResult({data:null,error:i}):n?await ke(this.fetch,"GET",`${this.url}/oauth/authorizations/${e}`,{headers:this.headers,jwt:n.access_token,xform:a=>({data:a,error:null})}):this._returnResult({data:null,error:new or})})}catch(r){if(be(r))return this._returnResult({data:null,error:r});throw r}}async _approveAuthorization(e,r){try{return await this._useSession(async n=>{const{data:{session:i},error:a}=n;if(a)return this._returnResult({data:null,error:a});if(!i)return this._returnResult({data:null,error:new or});const s=await ke(this.fetch,"POST",`${this.url}/oauth/authorizations/${e}/consent`,{headers:this.headers,jwt:i.access_token,body:{action:"approve"},xform:o=>({data:o,error:null})});return s.data&&s.data.redirect_url&&St()&&!(r!=null&&r.skipBrowserRedirect)&&window.location.assign(s.data.redirect_url),s})}catch(n){if(be(n))return this._returnResult({data:null,error:n});throw n}}async _denyAuthorization(e,r){try{return await this._useSession(async n=>{const{data:{session:i},error:a}=n;if(a)return this._returnResult({data:null,error:a});if(!i)return this._returnResult({data:null,error:new or});const s=await ke(this.fetch,"POST",`${this.url}/oauth/authorizations/${e}/consent`,{headers:this.headers,jwt:i.access_token,body:{action:"deny"},xform:o=>({data:o,error:null})});return s.data&&s.data.redirect_url&&St()&&!(r!=null&&r.skipBrowserRedirect)&&window.location.assign(s.data.redirect_url),s})}catch(n){if(be(n))return this._returnResult({data:null,error:n});throw n}}async fetchJwk(e,r={keys:[]}){let n=r.keys.find(o=>o.kid===e);if(n)return n;const i=Date.now();if(n=this.jwks.keys.find(o=>o.kid===e),n&&this.jwks_cached_at+$2>i)return n;const{data:a,error:s}=await ke(this.fetch,"GET",`${this.url}/.well-known/jwks.json`,{headers:this.headers});if(s)throw s;return!a.keys||a.keys.length===0||(this.jwks=a,this.jwks_cached_at=i,n=a.keys.find(o=>o.kid===e),!n)?null:n}async getClaims(e,r={}){try{let n=e;if(!n){const{data:p,error:y}=await this.getSession();if(y||!p.session)return this._returnResult({data:null,error:y});n=p.session.access_token}const{header:i,payload:a,signature:s,raw:{header:o,payload:l}}=jc(n);r!=null&&r.allowExpired||eS(a.exp);const c=!i.alg||i.alg.startsWith("HS")||!i.kid||!("crypto"in globalThis&&"subtle"in globalThis.crypto)?null:await this.fetchJwk(i.kid,r!=null&&r.keys?{keys:r.keys}:r==null?void 0:r.jwks);if(!c){const{error:p}=await this.getUser(n);if(p)throw p;return{data:{claims:a,header:i,signature:s},error:null}}const d=tS(i.alg),h=await crypto.subtle.importKey("jwk",c,d,!0,["verify"]);if(!await crypto.subtle.verify(d,h,s,B2(`${o}.${l}`)))throw new Wu("Invalid JWT signature");return{data:{claims:a,header:i,signature:s},error:null}}catch(n){if(be(n))return this._returnResult({data:null,error:n});throw n}}}ms.nextInstanceID=0;const RS=ms;class AS extends RS{constructor(e){super(e)}}class IS{constructor(e,r,n){var i,a,s;this.supabaseUrl=e,this.supabaseKey=r;const o=C2(e);if(!r)throw new Error("supabaseKey is required.");this.realtimeUrl=new URL("realtime/v1",o),this.realtimeUrl.protocol=this.realtimeUrl.protocol.replace("http","ws"),this.authUrl=new URL("auth/v1",o),this.storageUrl=new URL("storage/v1",o),this.functionsUrl=new URL("functions/v1",o);const l=`sb-${o.hostname.split(".")[0]}-auth-token`,c={db:b2,realtime:x2,auth:Object.assign(Object.assign({},w2),{storageKey:l}),global:y2},d=j2(n??{},c);this.storageKey=(i=d.auth.storageKey)!==null&&i!==void 0?i:"",this.headers=(a=d.global.headers)!==null&&a!==void 0?a:{},d.accessToken?(this.accessToken=d.accessToken,this.auth=new Proxy({},{get:(h,f)=>{throw new Error(`@supabase/supabase-js: Supabase Client is configured with the accessToken option, accessing supabase.auth.${String(f)} is not possible`)}})):this.auth=this._initSupabaseAuthClient((s=d.auth)!==null&&s!==void 0?s:{},this.headers,d.global.fetch),this.fetch=k2(r,this._getAccessToken.bind(this),d.global.fetch),this.realtime=this._initRealtimeClient(Object.assign({headers:this.headers,accessToken:this._getAccessToken.bind(this)},d.realtime)),this.rest=new T_(new URL("rest/v1",o).href,{headers:this.headers,schema:d.db.schema,fetch:this.fetch}),this.storage=new g2(this.storageUrl.href,this.headers,this.fetch,n==null?void 0:n.storage),d.accessToken||this._listenForAuthEvents()}get functions(){return new E_(this.functionsUrl.href,{headers:this.headers,customFetch:this.fetch})}from(e){return this.rest.from(e)}schema(e){return this.rest.schema(e)}rpc(e,r={},n={head:!1,get:!1,count:void 0}){return this.rest.rpc(e,r,n)}channel(e,r={config:{}}){return this.realtime.channel(e,r)}getChannels(){return this.realtime.getChannels()}removeChannel(e){return this.realtime.removeChannel(e)}removeAllChannels(){return this.realtime.removeAllChannels()}async _getAccessToken(){var e,r;if(this.accessToken)return await this.accessToken();const{data:n}=await this.auth.getSession();return(r=(e=n.session)===null||e===void 0?void 0:e.access_token)!==null&&r!==void 0?r:this.supabaseKey}_initSupabaseAuthClient({autoRefreshToken:e,persistSession:r,detectSessionInUrl:n,storage:i,userStorage:a,storageKey:s,flowType:o,lock:l,debug:c,throwOnError:d},h,f){const p={Authorization:`Bearer ${this.supabaseKey}`,apikey:`${this.supabaseKey}`};return new AS({url:this.authUrl.href,headers:Object.assign(Object.assign({},p),h),storageKey:s,autoRefreshToken:e,persistSession:r,detectSessionInUrl:n,storage:i,userStorage:a,flowType:o,lock:l,debug:c,throwOnError:d,fetch:f,hasCustomAuthorizationHeader:Object.keys(this.headers).some(y=>y.toLowerCase()==="authorization")})}_initRealtimeClient(e){return new V_(this.realtimeUrl.href,Object.assign(Object.assign({},e),{params:Object.assign({apikey:this.supabaseKey},e==null?void 0:e.params)}))}_listenForAuthEvents(){return this.auth.onAuthStateChange((r,n)=>{this._handleTokenChanged(r,"CLIENT",n==null?void 0:n.access_token)})}_handleTokenChanged(e,r,n){(e==="TOKEN_REFRESHED"||e==="SIGNED_IN")&&this.changedAccessToken!==n?(this.changedAccessToken=n,this.realtime.setAuth(n)):e==="SIGNED_OUT"&&(this.realtime.setAuth(),r=="STORAGE"&&this.auth.signOut(),this.changedAccessToken=void 0)}}const ab=(t,e,r)=>new IS(t,e,r);function DS(){if(typeof window<"u"||typeof process>"u")return!1;const t=process.version;if(t==null)return!1;const e=t.match(/^v(\d+)\./);return e?parseInt(e[1],10)<=18:!1}DS()&&console.warn("⚠️  Node.js 18 and below are deprecated and will no longer be supported in future versions of @supabase/supabase-js. Please upgrade to Node.js 20 or later. For more information, visit: https://github.com/orgs/supabase/discussions/37217");const Zp={DRAFTIFY:"/api/studio-draftify",GEOMETRIC_GENERATE:"/api/studio-generate-geometric"},Qp={URL:"https://okakomwfikxmwllvliva.supabase.co",ANON_KEY:""},eg={AUTH_SESSION:"studio_auth_session"},en=ab(Qp.URL,Qp.ANON_KEY),Ya={async signIn(t,e){const{data:r,error:n}=await en.auth.signInWithPassword({email:t,password:e});if(n)throw n;if(!t.endsWith("@rosehill.group"))throw await en.auth.signOut(),new Error("Access restricted to @rosehill.group emails");return localStorage.setItem(eg.AUTH_SESSION,JSON.stringify(r.session)),r},async signOut(){await en.auth.signOut(),localStorage.removeItem(eg.AUTH_SESSION)},async getSession(){const{data:t}=await en.auth.getSession();return t.session},onAuthStateChange(t){return en.auth.onAuthStateChange(t)}};class MS extends T.Component{constructor(r){super(r);gf(this,"handleReset",()=>{this.setState({hasError:!1,error:null,errorInfo:null})});this.state={hasError:!1,error:null,errorInfo:null}}static getDerivedStateFromError(r){return{hasError:!0}}componentDidCatch(r,n){console.error("[ErrorBoundary] Caught error:",r,n),this.setState({error:r,errorInfo:n})}render(){return this.state.hasError?u.jsxs("div",{className:"error-boundary",children:[u.jsxs("div",{className:"error-content",children:[u.jsx("h1",{children:"Something went wrong"}),u.jsx("p",{children:"We're sorry, but something unexpected happened. Please try refreshing the page."}),u.jsxs("div",{className:"error-actions",children:[u.jsx("button",{onClick:this.handleReset,className:"btn-primary",children:"Try Again"}),u.jsx("button",{onClick:()=>window.location.reload(),className:"btn-secondary",children:"Refresh Page"})]}),!1]}),u.jsx("style",{jsx:!0,children:`
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
          `})]}):this.props.children}}class zS{async generateRecraft(e){const r={prompt:e.prompt,width_mm:e.widthMM||5e3,length_mm:e.lengthMM||5e3,max_colours:e.maxColours||6,seed:e.seed||null},n=await fetch("/api/recraft-generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)});if(!n.ok){const i=await n.json();throw new Error(i.error||"Recraft generation failed")}return n.json()}async vectorizeImage(e){const r={image_url:e.image_url,width_mm:e.width_mm||5e3,length_mm:e.length_mm||5e3,seed:e.seed||null},n=await fetch("/api/recraft-vectorize",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)});if(!n.ok){const i=await n.json();throw new Error(i.error||"Vectorization failed")}return n.json()}async processUploadedSVG(e){const r={svg_url:e.svg_url,width_mm:e.width_mm||5e3,length_mm:e.length_mm||5e3},n=await fetch("/api/process-uploaded-svg",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)});if(!n.ok){const i=await n.json();throw new Error(i.error||"SVG processing failed")}return n.json()}async getRecraftStatus(e){const r=await fetch(`/api/studio-job-status?jobId=${e}`);if(!r.ok){const n=await r.json();throw new Error(n.error||"Status fetch failed")}return r.json()}async waitForRecraftCompletion(e,r=null,n=2e3){return new Promise((i,a)=>{const s=async()=>{var o,l,c,d;try{const h=await this.getRecraftStatus(e);r&&r(h),h.status==="completed"?((o=h.result)==null?void 0:o.svg_url)?(console.log("[API] Recraft job complete with SVG output"),i(h)):(console.error("[API] Recraft job completed but no SVG output"),a(new Error("Job completed but no output received"))):h.status==="failed"?(l=h.result)!=null&&l.svg_url?(console.warn("[API] Job failed compliance but has output (non-compliant)"),i(h)):a(new Error(h.error||"Job failed")):(h.status==="retrying"&&console.log(`[API] Retrying: ${(c=h.recraft)==null?void 0:c.attempt_current}/${(d=h.recraft)==null?void 0:d.attempt_max}`),setTimeout(s,n))}catch(h){a(h)}};s()})}async matchColor(e,r=2){const n=await fetch("/api/match-color",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({hex:e,max_components:r})});if(!n.ok){const i=await n.json();throw new Error(i.error||"Color matching failed")}return n.json()}async generateDesignName(e){const r={prompt:e.prompt,colors:e.colors||[],dimensions:e.dimensions||{}},n=await fetch("/api/generate-design-name",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)});if(!n.ok){const i=await n.json();throw new Error(i.error||"Name generation failed")}return n.json()}async inspireSimpleCreateJob(e){const r={prompt:e.prompt,surface:{width_mm:e.lengthMM||5e3,height_mm:e.widthMM||5e3},max_colours:e.maxColours||6,try_simpler:e.trySimpler||!1};e.seed&&(r.seed=e.seed);const n=await fetch("/api/studio-inspire-simple",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)});if(!n.ok){const i=await n.json();throw new Error(i.message||"Job creation failed")}return n.json()}async inspireSimpleGetStatus(e){const r=await fetch(`/api/studio-job-status?jobId=${e}`);if(!r.ok){const n=await r.json();throw new Error(n.message||"Status fetch failed")}return r.json()}async inspireSimpleWaitForCompletion(e,r=null,n=2e3){return new Promise((i,a)=>{const s=async()=>{var o;try{const l=await this.inspireSimpleGetStatus(e);r&&r(l),l.status==="completed"?((o=l.result)==null?void 0:o.final_url)?(console.log("[API] Job complete with JPG output, resolving"),i(l)):(console.log("[API] Job completed but no output received"),a(new Error("Job completed but no output received"))):l.status==="failed"?a(new Error(l.error||"Job failed")):setTimeout(s,n)}catch(l){a(l)}};s()})}async draftify(e){const r=await fetch(Zp.DRAFTIFY,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!r.ok){const n=await r.json();throw new Error(n.message||"Vectorization failed")}return r.json()}async generateGeometric(e){const r={brief:e.prompt||e.brief,canvas:{width_mm:e.lengthMM||5e3,height_mm:e.widthMM||5e3},options:{mood:e.mood||"playful",composition:e.composition||"mixed",colorCount:e.maxColours||e.colorCount||5,seed:e.seed},validate:!0},n=await fetch(Zp.GEOMETRIC_GENERATE,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)});if(!n.ok){const i=await n.json();throw new Error(i.message||"Geometric generation failed")}return n.json()}}const kn=new zS;function LS({recipes:t,onClose:e}){const[r,n]=z.useState(new Set);if(!t||t.length===0)return u.jsxs("div",{className:"blend-recipes-empty",children:[u.jsx("p",{children:"No colours extracted from design."}),u.jsx("button",{onClick:e,className:"close-button",children:"Close"})]});const i=a=>{const s=new Set(r);s.has(a)?s.delete(a):s.add(a),n(s)};return u.jsxs("div",{className:"blend-recipes-display",children:[u.jsxs("div",{className:"recipes-header",children:[u.jsx("h3",{children:"TPV Blend Recipes"}),u.jsx("button",{onClick:e,className:"close-button-icon",children:"×"})]}),u.jsxs("div",{className:"quality-legend",children:[u.jsxs("span",{className:"legend-item",children:[u.jsx("span",{className:"quality-badge excellent",children:"Excellent"}),u.jsx("span",{className:"legend-text",children:"ΔE < 1.0"})]}),u.jsxs("span",{className:"legend-item",children:[u.jsx("span",{className:"quality-badge good",children:"Good"}),u.jsx("span",{className:"legend-text",children:"ΔE 1.0 - 2.0"})]}),u.jsxs("span",{className:"legend-item",children:[u.jsx("span",{className:"quality-badge fair",children:"Fair"}),u.jsx("span",{className:"legend-text",children:"ΔE > 2.0"})]})]}),u.jsx("div",{className:"recipes-grid",children:t.map((a,s)=>{const o=a.chosenRecipe,l=r.has(s),c=a.alternativeRecipes&&a.alternativeRecipes.length>0;return u.jsxs("div",{className:"recipe-card",children:[u.jsxs("div",{className:"card-top",children:[u.jsxs("div",{className:"swatch-pair-large",children:[u.jsxs("div",{className:"swatch-group",children:[u.jsx("div",{className:"color-swatch-large original",style:{backgroundColor:a.targetColor.hex},title:`Image colour: ${a.targetColor.hex}`}),u.jsx("span",{className:"swatch-label",children:"Image"})]}),u.jsx("span",{className:"swatch-arrow-large",children:"→"}),u.jsxs("div",{className:"swatch-group",children:[u.jsx("div",{className:"color-swatch-large blend",style:{backgroundColor:a.blendColor.hex},title:`TPV blend: ${a.blendColor.hex}`}),u.jsx("span",{className:"swatch-label",children:"TPV"})]})]}),u.jsxs("div",{className:"card-meta",children:[u.jsxs("div",{className:"meta-row",children:[u.jsx("span",{className:"meta-label",children:"Hex:"}),u.jsx("span",{className:"hex-value",children:a.targetColor.hex})]}),u.jsxs("div",{className:"meta-row",children:[u.jsx("span",{className:"meta-label",children:"Coverage:"}),u.jsxs("span",{className:"coverage-value",children:[a.targetColor.areaPct.toFixed(1),"%"]})]}),u.jsxs("div",{className:"meta-row quality-row",children:[u.jsx("span",{className:`quality-badge ${o.quality.toLowerCase()}`,children:o.quality}),u.jsxs("span",{className:"delta-e",children:["ΔE ",o.deltaE.toFixed(2)]})]})]})]}),u.jsxs("div",{className:"card-formula",children:[u.jsx("div",{className:"formula-label",children:o.components.length===1?"Pure TPV Colour":"TPV Blend Formula"}),u.jsx("div",{className:"formula-content",children:o.components.length===1?u.jsxs("span",{className:"formula-component solid",children:[u.jsx("strong",{className:"parts",children:"100%"}),u.jsx("span",{className:"comp-code",children:o.components[0].code}),u.jsxs("span",{className:"comp-name",children:["(",o.components[0].name,")"]})]}):o.components.map((d,h)=>u.jsxs("span",{className:"formula-component",children:[u.jsx("strong",{className:"parts",children:d.parts||(d.weight*100).toFixed(0)+"%"}),u.jsx("span",{className:"comp-code",children:d.code}),u.jsxs("span",{className:"comp-name",children:["(",d.name,")"]}),h<o.components.length-1&&u.jsx("span",{className:"separator",children:"+"})]},h))})]}),c&&u.jsx("div",{className:"card-footer",children:u.jsx("button",{className:"alternatives-toggle",onClick:()=>i(s),children:l?"− Hide Alternatives":"+ Show Alternatives"})}),l&&c&&u.jsxs("div",{className:"alternatives-section",children:[u.jsx("div",{className:"alternatives-header",children:"Alternative Formulas"}),a.alternativeRecipes.map((d,h)=>{var p,y;if(!d||!d.components)return console.warn("[BlendRecipesDisplay] Skipping malformed alternative:",d),null;const f=d.blendColor||(d.resultRgb?{hex:`#${d.resultRgb.map(m=>Math.round(m).toString(16).padStart(2,"0")).join("")}`,rgb:d.resultRgb}:null);return f?u.jsxs("div",{className:"alternative-card",children:[u.jsxs("div",{className:"alt-header",children:[u.jsxs("span",{className:"alt-label",children:["Option ",h+2]}),u.jsxs("div",{className:"alt-quality-inline",children:[u.jsx("span",{className:`quality-badge small ${((p=d.quality)==null?void 0:p.toLowerCase())||"fair"}`,children:d.quality||"Fair"}),u.jsxs("span",{className:"delta-e-small",children:["ΔE ",((y=d.deltaE)==null?void 0:y.toFixed(2))||"N/A"]})]})]}),u.jsx("div",{className:"alt-swatches",children:u.jsxs("div",{className:"swatch-pair-small",children:[u.jsx("div",{className:"color-swatch-small original",style:{backgroundColor:a.targetColor.hex},title:`Image colour: ${a.targetColor.hex}`}),u.jsx("span",{className:"swatch-arrow-small",children:"→"}),u.jsx("div",{className:"color-swatch-small blend",style:{backgroundColor:f.hex},title:`TPV blend: ${f.hex}`})]})}),u.jsx("div",{className:"alt-formula",children:d.components.map((m,b)=>u.jsxs("span",{className:"formula-component",children:[u.jsx("strong",{className:"parts",children:m.parts||(m.weight*100).toFixed(0)+"%"}),u.jsx("span",{className:"comp-code",children:m.code}),u.jsxs("span",{className:"comp-name",children:["(",m.name,")"]}),b<d.components.length-1&&u.jsx("span",{className:"separator",children:"+"})]},b))})]},h):(console.warn("[BlendRecipesDisplay] Cannot compute blendColor for alternative:",d),null)})]})]},s)})}),u.jsx("style",{jsx:!0,children:`
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
          margin-bottom: 1rem;
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

        .quality-legend {
          display: flex;
          gap: 2rem;
          padding: 1rem;
          background: #f0f7ff;
          border-radius: 6px;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .legend-text {
          font-size: 0.85rem;
          color: #666;
        }

        .quality-badge {
          padding: 0.35rem 0.85rem;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 700;
        }

        .quality-badge.small {
          padding: 0.2rem 0.5rem;
          font-size: 0.75rem;
        }

        .quality-badge.excellent {
          background: #e8f5e9;
          color: #2e7d32;
        }

        .quality-badge.good {
          background: #fff3e0;
          color: #ef6c00;
        }

        .quality-badge.fair {
          background: #ffebee;
          color: #c62828;
        }

        /* Card Grid Layout */
        .recipes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
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
        }

        .swatch-pair-large {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .swatch-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .color-swatch-large {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          border: 3px solid #ddd;
          flex-shrink: 0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .color-swatch-large.original {
          border-color: #999;
        }

        .color-swatch-large.blend {
          border-color: #ff6b35;
        }

        .swatch-label {
          font-size: 0.75rem;
          color: #666;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .swatch-arrow-large {
          font-size: 2rem;
          color: #ff6b35;
          font-weight: bold;
          margin: 0 4px;
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

        .quality-row {
          gap: 1rem;
        }

        .delta-e {
          font-size: 0.9rem;
          color: #666;
          font-weight: 500;
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

        /* Card Footer (Alternatives Button) */
        .card-footer {
          padding: 0 1.5rem 1.5rem 1.5rem;
        }

        .alternatives-toggle {
          width: 100%;
          padding: 0.75rem;
          background: white;
          border: 2px solid #ff6b35;
          border-radius: 6px;
          color: #ff6b35;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .alternatives-toggle:hover {
          background: #ff6b35;
          color: white;
        }

        /* Alternative Recipes Section */
        .alternatives-section {
          padding: 1.5rem;
          background: #f0f7ff;
          border-top: 2px solid #e0e0e0;
        }

        .alternatives-header {
          font-weight: 700;
          color: #1a365d;
          margin-bottom: 1rem;
          font-size: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .alternative-card {
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 0.75rem;
        }

        .alternative-card:last-child {
          margin-bottom: 0;
        }

        .alt-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #e8e8e8;
        }

        .alt-label {
          font-size: 0.9rem;
          color: #1a365d;
          font-weight: 700;
        }

        .alt-quality-inline {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .delta-e-small {
          font-size: 0.85rem;
          color: #666;
          font-weight: 500;
        }

        .alt-swatches {
          margin-bottom: 0.75rem;
        }

        .swatch-pair-small {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .color-swatch-small {
          width: 32px;
          height: 32px;
          border-radius: 4px;
          border: 2px solid #ddd;
          flex-shrink: 0;
        }

        .color-swatch-small.original {
          border-color: #999;
        }

        .color-swatch-small.blend {
          border-color: #ff6b35;
        }

        .swatch-arrow-small {
          font-size: 1.2rem;
          color: #ff6b35;
          font-weight: bold;
          margin: 0 4px;
        }

        .alt-formula {
          font-size: 0.9rem;
          line-height: 1.6;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          align-items: center;
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

          .swatch-pair-large {
            justify-content: center;
          }

          .color-swatch-large {
            width: 50px;
            height: 50px;
          }

          .swatch-arrow-large {
            font-size: 1.5rem;
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

          .card-footer {
            padding: 0 1rem 1rem 1rem;
          }

          .quality-legend {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `})]})}function FS({recipes:t,onClose:e}){if(!t||t.length===0)return u.jsxs("div",{className:"solid-summary-empty",children:[u.jsx("p",{children:"No colours in design."}),u.jsx("button",{onClick:e,className:"close-button",children:"Close"})]});const r=t.reduce((n,i)=>n+i.targetColor.areaPct,0);return u.jsxs("div",{className:"solid-color-summary",children:[u.jsxs("div",{className:"summary-header",children:[u.jsx("h3",{children:"TPV Colours Used"}),u.jsx("button",{onClick:e,className:"close-button-icon",children:"×"})]}),u.jsx("div",{className:"summary-info",children:u.jsxs("p",{className:"summary-description",children:["This design uses ",u.jsx("strong",{children:t.length})," pure TPV colour",t.length!==1?"s":""," (no blending required)"]})}),u.jsx("div",{className:"colors-list",children:t.map((n,i)=>{const a=n.chosenRecipe.components[0],s=n.targetColor.areaPct;return u.jsxs("div",{className:"color-item",children:[u.jsx("div",{className:"color-swatch",style:{backgroundColor:n.blendColor.hex},title:`${a.code} - ${a.name}`}),u.jsxs("div",{className:"color-details",children:[u.jsxs("div",{className:"color-primary",children:[u.jsx("span",{className:"color-code",children:a.code}),u.jsx("span",{className:"color-name",children:a.name})]}),u.jsxs("div",{className:"color-secondary",children:[u.jsx("span",{className:"hex-value",children:n.blendColor.hex}),u.jsxs("span",{className:"coverage-badge",children:[s.toFixed(1),"%"]})]})]})]},i)})}),u.jsxs("div",{className:"summary-footer",children:[u.jsxs("div",{className:"footer-stat",children:[u.jsx("span",{className:"stat-label",children:"Total Coverage:"}),u.jsxs("span",{className:"stat-value",children:[r.toFixed(1),"%"]})]}),u.jsxs("div",{className:"footer-stat",children:[u.jsx("span",{className:"stat-label",children:"TPV Colours:"}),u.jsx("span",{className:"stat-value",children:t.length})]})]}),u.jsx("style",{jsx:!0,children:`
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
      `})]})}const ch=[{code:"RH01",name:"Standard Red",hex:"#B71E2D",R:183,G:30,B:45,L:39.4,a:58.5,b:29},{code:"RH02",name:"Bright Red",hex:"#E31D25",R:227,G:29,B:37,L:47.4,a:70.1,b:44},{code:"RH10",name:"Standard Green",hex:"#006B3F",R:0,G:107,B:63,L:40.5,a:-42.2,b:17.9},{code:"RH11",name:"Bright Green",hex:"#4BAA34",R:75,G:170,B:52,L:62.1,a:-47.7,b:47.2},{code:"RH12",name:"Dark Green",hex:"#006747",R:0,G:103,B:71,L:39.6,a:-38.3,b:13.1},{code:"RH20",name:"Standard Blue",hex:"#1B4F9C",R:27,G:79,B:156,L:36.4,a:14.2,b:-46.7},{code:"RH21",name:"Purple",hex:"#662D91",R:102,G:45,B:145,L:31.5,a:41.9,b:-40.9},{code:"RH22",name:"Light Blue",hex:"#0091D7",R:0,G:145,B:215,L:55.3,a:-19.1,b:-37.3},{code:"RH23",name:"Azure",hex:"#0076B6",R:0,G:118,B:182,L:47.7,a:-4.8,b:-34.8},{code:"RH26",name:"Turquoise",hex:"#00A499",R:0,G:164,B:153,L:58.8,a:-38.4,b:-3},{code:"RH30",name:"Standard Beige",hex:"#D4B585",R:212,G:181,B:133,L:75.2,a:3.8,b:24.8},{code:"RH31",name:"Cream",hex:"#F2E6C8",R:242,G:230,B:200,L:91.8,a:-.5,b:12.5},{code:"RH32",name:"Brown",hex:"#754C29",R:117,G:76,B:41,L:40,a:15.9,b:27.1},{code:"RH90",name:"Funky Pink",hex:"#e8457e",R:232,G:69,B:126,L:55,a:66.1,b:4.9},{code:"RH40",name:"Mustard Yellow",hex:"#C6972D",R:198,G:151,B:45,L:66,a:8.4,b:56.3},{code:"RH41",name:"Bright Yellow",hex:"#FFD100",R:255,G:209,B:0,L:86.9,a:-1,b:90.6},{code:"RH50",name:"Orange",hex:"#F47920",R:244,G:121,B:32,L:63.2,a:49.8,b:60.2},{code:"RH60",name:"Dark Grey",hex:"#4D4F53",R:77,G:79,B:83,L:34.1,a:-.4,b:-2.4},{code:"RH61",name:"Light Grey",hex:"#A7A8AA",R:167,G:168,B:170,L:69,a:-.5,b:-1},{code:"RH65",name:"Pale Grey",hex:"#DCDDDE",R:220,G:221,B:222,L:87.6,a:-.2,b:-.7},{code:"RH70",name:"Black",hex:"#101820",R:16,G:24,B:32,L:9.1,a:-.3,b:-6.3}];function BS({recipes:t,mode:e="blend",onColorClick:r,selectedColor:n,editedColors:i,onResetAll:a}){if(!t||t.length===0)return null;const s=h=>!i||i.size===0?!1:i.has(h.originalColor.hex.toLowerCase()),o=i&&i.size>0,l=h=>{const f=h.toLowerCase();return ch.find(p=>p.hex.toLowerCase()===f)},c=h=>{if(e==="solid"){const f=l(h.blendColor.hex);if(f)return`${f.code} - ${f.name}`}return h.blendColor.hex},d=h=>{if(!n)return!1;const f=n.blendHex||n.hex;return h.blendColor.hex===f||h.targetColor.hex===f};return u.jsxs("div",{className:"color-legend",children:[u.jsxs("div",{className:"legend-header",children:[u.jsxs("div",{className:"legend-header-left",children:[u.jsx("span",{className:"legend-title",children:"Colours"}),r&&u.jsx("span",{className:"edit-hint",children:"(click to edit)"})]}),o&&a&&u.jsx("button",{onClick:a,className:"reset-all-btn",title:"Reset all colours to original",children:"Reset All"})]}),u.jsx("div",{className:"legend-colors",children:t.map((h,f)=>u.jsxs("div",{className:`color-item ${r?"clickable":""} ${d(h)?"selected":""}`,onClick:()=>{r&&r({hex:h.targetColor.hex,originalHex:h.originalColor.hex,blendHex:h.blendColor.hex,areaPct:h.targetColor.areaPct,recipe:h.chosenRecipe,targetColor:h.targetColor})},title:r?"Click to edit this colour":"",children:[u.jsxs("div",{className:"color-swatch-wrapper",children:[u.jsx("div",{className:"color-swatch",style:{backgroundColor:h.blendColor.hex}}),s(h)&&u.jsx("span",{className:"edit-indicator",title:"Colour has been modified",children:u.jsx("svg",{viewBox:"0 0 24 24",fill:"currentColor",width:"12",height:"12",children:u.jsx("path",{d:"M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"})})})]}),u.jsxs("div",{className:"color-info",children:[u.jsx("span",{className:e==="solid"?"tpv-label":"hex-value",children:c(h)}),u.jsxs("span",{className:"coverage",children:[h.targetColor.areaPct.toFixed(1),"%"]})]})]},f))}),u.jsx("style",{jsx:!0,children:`
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
      `})]})}function tg({blendSvgUrl:t,recipes:e,mode:r="blend",onColorClick:n,selectedColor:i,editedColors:a,onResetAll:s,designName:o="",onNameChange:l,isNameLoading:c=!1,onInSituClick:d}){const[h,f]=z.useState(null),p=z.useRef(null);z.useRef(null);const[y,m]=z.useState(1),[b,v]=z.useState({x:0,y:0}),[g,w]=z.useState(!1),[S,E]=z.useState({x:0,y:0}),k=z.useRef(null);z.useEffect(()=>{if(!i||!t){f(null);return}(async()=>{try{console.log("[SVGPreview] Creating highlight for color:",i);const R=new Image;R.crossOrigin="anonymous";const G=new Promise((Ee,Me)=>{R.onload=()=>{console.log("[SVGPreview] Image loaded:",R.width,"x",R.height),Ee()},R.onerror=Be=>{console.error("[SVGPreview] Image load error:",Be),Me(Be)}});R.src=t,await G;const A=document.createElement("canvas");A.width=R.naturalWidth||R.width||1e3,A.height=R.naturalHeight||R.height||1e3;const I=A.getContext("2d");I.drawImage(R,0,0);const te=I.getImageData(0,0,A.width,A.height).data,ee=i.hex,he=C(ee);console.log("[SVGPreview] Target color:",ee,he);const $e=new Set;let ye=0;for(let Ee=0;Ee<A.height;Ee++)for(let Me=0;Me<A.width;Me++){const Be=(Ee*A.width+Me)*4,x=te[Be],K=te[Be+1],H=te[Be+2];te[Be+3]>0&&N(x,K,H,he)&&($e.add(`${Me},${Ee}`),ye++)}if(console.log("[SVGPreview] Matched pixels:",ye),ye===0){console.warn("[SVGPreview] No pixels matched the target color"),f(null);return}const we=I.createImageData(A.width,A.height);for(let Ee=0;Ee<A.height;Ee++)for(let Me=0;Me<A.width;Me++){const Be=(Ee*A.width+Me)*4;$e.has(`${Me},${Ee}`)&&(!$e.has(`${Me-1},${Ee}`)||!$e.has(`${Me+1},${Ee}`)||!$e.has(`${Me},${Ee-1}`)||!$e.has(`${Me},${Ee+1}`))&&(we.data[Be]=255,we.data[Be+1]=0,we.data[Be+2]=255,we.data[Be+3]=255)}I.clearRect(0,0,A.width,A.height),I.putImageData(we,0,0);const xe=A.toDataURL();console.log("[SVGPreview] Highlight mask created"),f(xe)}catch(R){console.error("[SVGPreview] Failed to create highlight mask:",R),f(null)}})()},[i,t]);const C=U=>{const R=U.replace("#","");return{r:parseInt(R.substring(0,2),16),g:parseInt(R.substring(2,4),16),b:parseInt(R.substring(4,6),16)}},N=(U,R,G,A)=>Math.abs(U-A.r)<=50&&Math.abs(R-A.g)<=50&&Math.abs(G-A.b)<=50,$=async(U,R)=>{try{if(!p.current||!t)return null;const G=new Image;G.crossOrigin="anonymous";const A=new Promise((Ee,Me)=>{G.onload=Ee,G.onerror=Me});G.src=t,await A;const I=document.createElement("canvas");I.width=G.naturalWidth||G.width||1e3,I.height=G.naturalHeight||G.height||1e3;const ae=I.getContext("2d");ae.drawImage(G,0,0);const te=p.current.getBoundingClientRect(),ee=I.width/te.width,he=I.height/te.height,$e=Math.floor(U*ee),ye=Math.floor(R*he),xe=ae.getImageData($e,ye,1,1).data;return{r:xe[0],g:xe[1],b:xe[2],a:xe[3]}}catch(G){return console.error("[SVGPreview] Failed to get color at position:",G),null}},B=()=>{m(U=>Math.min(U*1.5,5))},q=()=>{m(U=>Math.max(U/1.5,.5))},P=()=>{m(1),v({x:0,y:0})},L=U=>{U.preventDefault();const R=U.deltaY*-.001;m(G=>Math.min(Math.max(G+R,.5),5))},_=U=>{U.button===0&&(w(!0),E({x:U.clientX-b.x,y:U.clientY-b.y}))},W=U=>{g&&v({x:U.clientX-S.x,y:U.clientY-S.y})},ue=()=>{w(!1)};z.useEffect(()=>{if(g)return document.addEventListener("mousemove",W),document.addEventListener("mouseup",ue),()=>{document.removeEventListener("mousemove",W),document.removeEventListener("mouseup",ue)}},[g,S,b]);const X=async U=>{if(g||!n||!e||e.length===0)return;const R=U.currentTarget.getBoundingClientRect(),G=U.clientX-R.left,A=U.clientY-R.top;console.log("[SVGPreview] Clicked at:",G,A);const I=await $(G,A);if(!I||I.a===0){console.log("[SVGPreview] Clicked on transparent area");return}console.log("[SVGPreview] Clicked color:",I);let ae=null,te=1/0;for(const ee of e){const he=ee.targetColor.hex,$e=C(he);if(N(I.r,I.g,I.b,$e)){const ye=Math.sqrt(Math.pow(I.r-$e.r,2)+Math.pow(I.g-$e.g,2)+Math.pow(I.b-$e.b,2));ye<te&&(te=ye,ae=ee)}}ae?(console.log("[SVGPreview] Matched recipe:",ae.targetColor.hex),n({hex:ae.targetColor.hex,originalHex:ae.originalColor.hex,blendHex:ae.blendColor.hex,areaPct:ae.targetColor.areaPct,recipe:ae.chosenRecipe,targetColor:ae.targetColor})):console.log("[SVGPreview] No matching recipe found for clicked color")};return t?u.jsxs("div",{className:"svg-preview",children:[u.jsxs("div",{className:"preview-header",children:[u.jsxs("div",{className:"design-name-container",children:[l?u.jsx("input",{type:"text",className:"design-name-input",value:o,onChange:U=>l(U.target.value),placeholder:c?"Generating name...":"Enter project name"}):u.jsx("h3",{children:o||"TPV Blend Design"}),c&&u.jsx("span",{className:"name-loading",children:"Generating..."})]}),i&&u.jsxs("span",{className:"editing-hint",children:["Editing: ",i.hex||i.blendHex]})]}),u.jsxs("div",{className:"svg-display-container",children:[u.jsxs("div",{className:"svg-panel",children:[u.jsxs("div",{className:"zoom-controls",children:[u.jsx("button",{onClick:B,className:"zoom-btn",title:"Zoom In",children:u.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[u.jsx("circle",{cx:"11",cy:"11",r:"8"}),u.jsx("line",{x1:"11",y1:"8",x2:"11",y2:"14"}),u.jsx("line",{x1:"8",y1:"11",x2:"14",y2:"11"}),u.jsx("path",{d:"m21 21-4.35-4.35"})]})}),u.jsx("button",{onClick:q,className:"zoom-btn",title:"Zoom Out",children:u.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[u.jsx("circle",{cx:"11",cy:"11",r:"8"}),u.jsx("line",{x1:"8",y1:"11",x2:"14",y2:"11"}),u.jsx("path",{d:"m21 21-4.35-4.35"})]})}),u.jsx("button",{onClick:P,className:"zoom-btn",title:"Reset View",children:u.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[u.jsx("path",{d:"M1 4v6h6"}),u.jsx("path",{d:"M23 20v-6h-6"}),u.jsx("path",{d:"M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"})]})}),u.jsxs("span",{className:"zoom-level",children:[Math.round(y*100),"%"]})]}),d&&u.jsxs("button",{onClick:d,className:"in-situ-btn",title:"Preview In-Situ",children:[u.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[u.jsx("rect",{x:"3",y:"3",width:"18",height:"18",rx:"2",ry:"2"}),u.jsx("circle",{cx:"8.5",cy:"8.5",r:"1.5"}),u.jsx("path",{d:"m21 15-5-5L5 21"})]}),u.jsx("span",{children:"Preview In-Situ"})]}),u.jsx("div",{ref:k,className:"svg-wrapper",onWheel:L,children:u.jsxs("div",{className:"svg-image-container",onClick:X,onMouseDown:_,style:{transform:`translate(${b.x}px, ${b.y}px) scale(${y})`,cursor:g?"grabbing":y>1?"grab":n?"pointer":"default"},children:[u.jsx("img",{ref:p,src:t,alt:"TPV blend design",className:"svg-image"}),h&&u.jsx("img",{src:h,alt:"Colour highlight",className:"svg-highlight-mask"})]})})]}),e&&e.length>0&&u.jsx("div",{className:"legend-sidebar",children:u.jsx(BS,{recipes:e,mode:r,onColorClick:n,selectedColor:i,editedColors:a,onResetAll:s})})]}),u.jsx("style",{jsx:!0,children:`
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

          /* Hide zoom controls on mobile - use native pinch-to-zoom */
          .zoom-controls {
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
            /* Disable custom pan/zoom on mobile - use native touch */
            transform: none !important;
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
      `})]}):null}var er={},Es={},US=typeof tn=="object"&&tn&&tn.Object===Object&&tn,sb=US,HS=sb,GS=typeof self=="object"&&self&&self.Object===Object&&self,VS=HS||GS||Function("return this")(),Or=VS,WS=Or,KS=WS.Symbol,js=KS,rg=js,ob=Object.prototype,qS=ob.hasOwnProperty,YS=ob.toString,ka=rg?rg.toStringTag:void 0;function JS(t){var e=qS.call(t,ka),r=t[ka];try{t[ka]=void 0;var n=!0}catch{}var i=YS.call(t);return n&&(e?t[ka]=r:delete t[ka]),i}var XS=JS,ZS=Object.prototype,QS=ZS.toString;function ek(t){return QS.call(t)}var tk=ek,ng=js,rk=XS,nk=tk,ik="[object Null]",ak="[object Undefined]",ig=ng?ng.toStringTag:void 0;function sk(t){return t==null?t===void 0?ak:ik:ig&&ig in Object(t)?rk(t):nk(t)}var Vn=sk,ok=Array.isArray,br=ok;function lk(t){return t!=null&&typeof t=="object"}var Ur=lk,ck=Vn,uk=br,dk=Ur,hk="[object String]";function fk(t){return typeof t=="string"||!uk(t)&&dk(t)&&ck(t)==hk}var pk=fk;function gk(t){return function(e,r,n){for(var i=-1,a=Object(e),s=n(e),o=s.length;o--;){var l=s[t?o:++i];if(r(a[l],l,a)===!1)break}return e}}var mk=gk,vk=mk,yk=vk(),bk=yk;function wk(t,e){for(var r=-1,n=Array(t);++r<t;)n[r]=e(r);return n}var xk=wk,_k=Vn,Sk=Ur,kk="[object Arguments]";function Ek(t){return Sk(t)&&_k(t)==kk}var jk=Ek,ag=jk,Ck=Ur,lb=Object.prototype,Tk=lb.hasOwnProperty,Ok=lb.propertyIsEnumerable,Pk=ag(function(){return arguments}())?ag:function(t){return Ck(t)&&Tk.call(t,"callee")&&!Ok.call(t,"callee")},cb=Pk,el={exports:{}};function Nk(){return!1}var $k=Nk;el.exports;(function(t,e){var r=Or,n=$k,i=e&&!e.nodeType&&e,a=i&&!0&&t&&!t.nodeType&&t,s=a&&a.exports===i,o=s?r.Buffer:void 0,l=o?o.isBuffer:void 0,c=l||n;t.exports=c})(el,el.exports);var uh=el.exports,Rk=9007199254740991,Ak=/^(?:0|[1-9]\d*)$/;function Ik(t,e){var r=typeof t;return e=e??Rk,!!e&&(r=="number"||r!="symbol"&&Ak.test(t))&&t>-1&&t%1==0&&t<e}var ub=Ik,Dk=9007199254740991;function Mk(t){return typeof t=="number"&&t>-1&&t%1==0&&t<=Dk}var dh=Mk,zk=Vn,Lk=dh,Fk=Ur,Bk="[object Arguments]",Uk="[object Array]",Hk="[object Boolean]",Gk="[object Date]",Vk="[object Error]",Wk="[object Function]",Kk="[object Map]",qk="[object Number]",Yk="[object Object]",Jk="[object RegExp]",Xk="[object Set]",Zk="[object String]",Qk="[object WeakMap]",eE="[object ArrayBuffer]",tE="[object DataView]",rE="[object Float32Array]",nE="[object Float64Array]",iE="[object Int8Array]",aE="[object Int16Array]",sE="[object Int32Array]",oE="[object Uint8Array]",lE="[object Uint8ClampedArray]",cE="[object Uint16Array]",uE="[object Uint32Array]",Xe={};Xe[rE]=Xe[nE]=Xe[iE]=Xe[aE]=Xe[sE]=Xe[oE]=Xe[lE]=Xe[cE]=Xe[uE]=!0;Xe[Bk]=Xe[Uk]=Xe[eE]=Xe[Hk]=Xe[tE]=Xe[Gk]=Xe[Vk]=Xe[Wk]=Xe[Kk]=Xe[qk]=Xe[Yk]=Xe[Jk]=Xe[Xk]=Xe[Zk]=Xe[Qk]=!1;function dE(t){return Fk(t)&&Lk(t.length)&&!!Xe[zk(t)]}var hE=dE;function fE(t){return function(e){return t(e)}}var hh=fE,tl={exports:{}};tl.exports;(function(t,e){var r=sb,n=e&&!e.nodeType&&e,i=n&&!0&&t&&!t.nodeType&&t,a=i&&i.exports===n,s=a&&r.process,o=function(){try{var l=i&&i.require&&i.require("util").types;return l||s&&s.binding&&s.binding("util")}catch{}}();t.exports=o})(tl,tl.exports);var fh=tl.exports,pE=hE,gE=hh,sg=fh,og=sg&&sg.isTypedArray,mE=og?gE(og):pE,db=mE,vE=xk,yE=cb,bE=br,wE=uh,xE=ub,_E=db,SE=Object.prototype,kE=SE.hasOwnProperty;function EE(t,e){var r=bE(t),n=!r&&yE(t),i=!r&&!n&&wE(t),a=!r&&!n&&!i&&_E(t),s=r||n||i||a,o=s?vE(t.length,String):[],l=o.length;for(var c in t)(e||kE.call(t,c))&&!(s&&(c=="length"||i&&(c=="offset"||c=="parent")||a&&(c=="buffer"||c=="byteLength"||c=="byteOffset")||xE(c,l)))&&o.push(c);return o}var hb=EE,jE=Object.prototype;function CE(t){var e=t&&t.constructor,r=typeof e=="function"&&e.prototype||jE;return t===r}var ph=CE;function TE(t,e){return function(r){return t(e(r))}}var fb=TE,OE=fb,PE=OE(Object.keys,Object),NE=PE,$E=ph,RE=NE,AE=Object.prototype,IE=AE.hasOwnProperty;function DE(t){if(!$E(t))return RE(t);var e=[];for(var r in Object(t))IE.call(t,r)&&r!="constructor"&&e.push(r);return e}var ME=DE;function zE(t){var e=typeof t;return t!=null&&(e=="object"||e=="function")}var aa=zE,LE=Vn,FE=aa,BE="[object AsyncFunction]",UE="[object Function]",HE="[object GeneratorFunction]",GE="[object Proxy]";function VE(t){if(!FE(t))return!1;var e=LE(t);return e==UE||e==HE||e==BE||e==GE}var pb=VE,WE=pb,KE=dh;function qE(t){return t!=null&&KE(t.length)&&!WE(t)}var Tl=qE,YE=hb,JE=ME,XE=Tl;function ZE(t){return XE(t)?YE(t):JE(t)}var Cs=ZE,QE=bk,ej=Cs;function tj(t,e){return t&&QE(t,e,ej)}var gb=tj;function rj(t){return t}var mb=rj,nj=mb;function ij(t){return typeof t=="function"?t:nj}var aj=ij,sj=gb,oj=aj;function lj(t,e){return t&&sj(t,oj(e))}var gh=lj,cj=fb,uj=cj(Object.getPrototypeOf,Object),mh=uj,dj=Vn,hj=mh,fj=Ur,pj="[object Object]",gj=Function.prototype,mj=Object.prototype,vb=gj.toString,vj=mj.hasOwnProperty,yj=vb.call(Object);function bj(t){if(!fj(t)||dj(t)!=pj)return!1;var e=hj(t);if(e===null)return!0;var r=vj.call(e,"constructor")&&e.constructor;return typeof r=="function"&&r instanceof r&&vb.call(r)==yj}var wj=bj;function xj(t,e){for(var r=-1,n=t==null?0:t.length,i=Array(n);++r<n;)i[r]=e(t[r],r,t);return i}var yb=xj;function _j(){this.__data__=[],this.size=0}var Sj=_j;function kj(t,e){return t===e||t!==t&&e!==e}var vh=kj,Ej=vh;function jj(t,e){for(var r=t.length;r--;)if(Ej(t[r][0],e))return r;return-1}var Ol=jj,Cj=Ol,Tj=Array.prototype,Oj=Tj.splice;function Pj(t){var e=this.__data__,r=Cj(e,t);if(r<0)return!1;var n=e.length-1;return r==n?e.pop():Oj.call(e,r,1),--this.size,!0}var Nj=Pj,$j=Ol;function Rj(t){var e=this.__data__,r=$j(e,t);return r<0?void 0:e[r][1]}var Aj=Rj,Ij=Ol;function Dj(t){return Ij(this.__data__,t)>-1}var Mj=Dj,zj=Ol;function Lj(t,e){var r=this.__data__,n=zj(r,t);return n<0?(++this.size,r.push([t,e])):r[n][1]=e,this}var Fj=Lj,Bj=Sj,Uj=Nj,Hj=Aj,Gj=Mj,Vj=Fj;function sa(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}sa.prototype.clear=Bj;sa.prototype.delete=Uj;sa.prototype.get=Hj;sa.prototype.has=Gj;sa.prototype.set=Vj;var Pl=sa,Wj=Pl;function Kj(){this.__data__=new Wj,this.size=0}var qj=Kj;function Yj(t){var e=this.__data__,r=e.delete(t);return this.size=e.size,r}var Jj=Yj;function Xj(t){return this.__data__.get(t)}var Zj=Xj;function Qj(t){return this.__data__.has(t)}var e5=Qj,t5=Or,r5=t5["__core-js_shared__"],n5=r5,Oc=n5,lg=function(){var t=/[^.]+$/.exec(Oc&&Oc.keys&&Oc.keys.IE_PROTO||"");return t?"Symbol(src)_1."+t:""}();function i5(t){return!!lg&&lg in t}var a5=i5,s5=Function.prototype,o5=s5.toString;function l5(t){if(t!=null){try{return o5.call(t)}catch{}try{return t+""}catch{}}return""}var bb=l5,c5=pb,u5=a5,d5=aa,h5=bb,f5=/[\\^$.*+?()[\]{}|]/g,p5=/^\[object .+?Constructor\]$/,g5=Function.prototype,m5=Object.prototype,v5=g5.toString,y5=m5.hasOwnProperty,b5=RegExp("^"+v5.call(y5).replace(f5,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");function w5(t){if(!d5(t)||u5(t))return!1;var e=c5(t)?b5:p5;return e.test(h5(t))}var x5=w5;function _5(t,e){return t==null?void 0:t[e]}var S5=_5,k5=x5,E5=S5;function j5(t,e){var r=E5(t,e);return k5(r)?r:void 0}var Wn=j5,C5=Wn,T5=Or,O5=C5(T5,"Map"),yh=O5,P5=Wn,N5=P5(Object,"create"),Nl=N5,cg=Nl;function $5(){this.__data__=cg?cg(null):{},this.size=0}var R5=$5;function A5(t){var e=this.has(t)&&delete this.__data__[t];return this.size-=e?1:0,e}var I5=A5,D5=Nl,M5="__lodash_hash_undefined__",z5=Object.prototype,L5=z5.hasOwnProperty;function F5(t){var e=this.__data__;if(D5){var r=e[t];return r===M5?void 0:r}return L5.call(e,t)?e[t]:void 0}var B5=F5,U5=Nl,H5=Object.prototype,G5=H5.hasOwnProperty;function V5(t){var e=this.__data__;return U5?e[t]!==void 0:G5.call(e,t)}var W5=V5,K5=Nl,q5="__lodash_hash_undefined__";function Y5(t,e){var r=this.__data__;return this.size+=this.has(t)?0:1,r[t]=K5&&e===void 0?q5:e,this}var J5=Y5,X5=R5,Z5=I5,Q5=B5,eC=W5,tC=J5;function oa(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}oa.prototype.clear=X5;oa.prototype.delete=Z5;oa.prototype.get=Q5;oa.prototype.has=eC;oa.prototype.set=tC;var rC=oa,ug=rC,nC=Pl,iC=yh;function aC(){this.size=0,this.__data__={hash:new ug,map:new(iC||nC),string:new ug}}var sC=aC;function oC(t){var e=typeof t;return e=="string"||e=="number"||e=="symbol"||e=="boolean"?t!=="__proto__":t===null}var lC=oC,cC=lC;function uC(t,e){var r=t.__data__;return cC(e)?r[typeof e=="string"?"string":"hash"]:r.map}var $l=uC,dC=$l;function hC(t){var e=dC(this,t).delete(t);return this.size-=e?1:0,e}var fC=hC,pC=$l;function gC(t){return pC(this,t).get(t)}var mC=gC,vC=$l;function yC(t){return vC(this,t).has(t)}var bC=yC,wC=$l;function xC(t,e){var r=wC(this,t),n=r.size;return r.set(t,e),this.size+=r.size==n?0:1,this}var _C=xC,SC=sC,kC=fC,EC=mC,jC=bC,CC=_C;function la(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}la.prototype.clear=SC;la.prototype.delete=kC;la.prototype.get=EC;la.prototype.has=jC;la.prototype.set=CC;var bh=la,TC=Pl,OC=yh,PC=bh,NC=200;function $C(t,e){var r=this.__data__;if(r instanceof TC){var n=r.__data__;if(!OC||n.length<NC-1)return n.push([t,e]),this.size=++r.size,this;r=this.__data__=new PC(n)}return r.set(t,e),this.size=r.size,this}var RC=$C,AC=Pl,IC=qj,DC=Jj,MC=Zj,zC=e5,LC=RC;function ca(t){var e=this.__data__=new AC(t);this.size=e.size}ca.prototype.clear=IC;ca.prototype.delete=DC;ca.prototype.get=MC;ca.prototype.has=zC;ca.prototype.set=LC;var wh=ca,FC="__lodash_hash_undefined__";function BC(t){return this.__data__.set(t,FC),this}var UC=BC;function HC(t){return this.__data__.has(t)}var GC=HC,VC=bh,WC=UC,KC=GC;function rl(t){var e=-1,r=t==null?0:t.length;for(this.__data__=new VC;++e<r;)this.add(t[e])}rl.prototype.add=rl.prototype.push=WC;rl.prototype.has=KC;var qC=rl;function YC(t,e){for(var r=-1,n=t==null?0:t.length;++r<n;)if(e(t[r],r,t))return!0;return!1}var JC=YC;function XC(t,e){return t.has(e)}var ZC=XC,QC=qC,e3=JC,t3=ZC,r3=1,n3=2;function i3(t,e,r,n,i,a){var s=r&r3,o=t.length,l=e.length;if(o!=l&&!(s&&l>o))return!1;var c=a.get(t),d=a.get(e);if(c&&d)return c==e&&d==t;var h=-1,f=!0,p=r&n3?new QC:void 0;for(a.set(t,e),a.set(e,t);++h<o;){var y=t[h],m=e[h];if(n)var b=s?n(m,y,h,e,t,a):n(y,m,h,t,e,a);if(b!==void 0){if(b)continue;f=!1;break}if(p){if(!e3(e,function(v,g){if(!t3(p,g)&&(y===v||i(y,v,r,n,a)))return p.push(g)})){f=!1;break}}else if(!(y===m||i(y,m,r,n,a))){f=!1;break}}return a.delete(t),a.delete(e),f}var wb=i3,a3=Or,s3=a3.Uint8Array,xb=s3;function o3(t){var e=-1,r=Array(t.size);return t.forEach(function(n,i){r[++e]=[i,n]}),r}var l3=o3;function c3(t){var e=-1,r=Array(t.size);return t.forEach(function(n){r[++e]=n}),r}var u3=c3,dg=js,hg=xb,d3=vh,h3=wb,f3=l3,p3=u3,g3=1,m3=2,v3="[object Boolean]",y3="[object Date]",b3="[object Error]",w3="[object Map]",x3="[object Number]",_3="[object RegExp]",S3="[object Set]",k3="[object String]",E3="[object Symbol]",j3="[object ArrayBuffer]",C3="[object DataView]",fg=dg?dg.prototype:void 0,Pc=fg?fg.valueOf:void 0;function T3(t,e,r,n,i,a,s){switch(r){case C3:if(t.byteLength!=e.byteLength||t.byteOffset!=e.byteOffset)return!1;t=t.buffer,e=e.buffer;case j3:return!(t.byteLength!=e.byteLength||!a(new hg(t),new hg(e)));case v3:case y3:case x3:return d3(+t,+e);case b3:return t.name==e.name&&t.message==e.message;case _3:case k3:return t==e+"";case w3:var o=f3;case S3:var l=n&g3;if(o||(o=p3),t.size!=e.size&&!l)return!1;var c=s.get(t);if(c)return c==e;n|=m3,s.set(t,e);var d=h3(o(t),o(e),n,i,a,s);return s.delete(t),d;case E3:if(Pc)return Pc.call(t)==Pc.call(e)}return!1}var O3=T3;function P3(t,e){for(var r=-1,n=e.length,i=t.length;++r<n;)t[i+r]=e[r];return t}var _b=P3,N3=_b,$3=br;function R3(t,e,r){var n=e(t);return $3(t)?n:N3(n,r(t))}var Sb=R3;function A3(t,e){for(var r=-1,n=t==null?0:t.length,i=0,a=[];++r<n;){var s=t[r];e(s,r,t)&&(a[i++]=s)}return a}var I3=A3;function D3(){return[]}var kb=D3,M3=I3,z3=kb,L3=Object.prototype,F3=L3.propertyIsEnumerable,pg=Object.getOwnPropertySymbols,B3=pg?function(t){return t==null?[]:(t=Object(t),M3(pg(t),function(e){return F3.call(t,e)}))}:z3,xh=B3,U3=Sb,H3=xh,G3=Cs;function V3(t){return U3(t,G3,H3)}var Eb=V3,gg=Eb,W3=1,K3=Object.prototype,q3=K3.hasOwnProperty;function Y3(t,e,r,n,i,a){var s=r&W3,o=gg(t),l=o.length,c=gg(e),d=c.length;if(l!=d&&!s)return!1;for(var h=l;h--;){var f=o[h];if(!(s?f in e:q3.call(e,f)))return!1}var p=a.get(t),y=a.get(e);if(p&&y)return p==e&&y==t;var m=!0;a.set(t,e),a.set(e,t);for(var b=s;++h<l;){f=o[h];var v=t[f],g=e[f];if(n)var w=s?n(g,v,f,e,t,a):n(v,g,f,t,e,a);if(!(w===void 0?v===g||i(v,g,r,n,a):w)){m=!1;break}b||(b=f=="constructor")}if(m&&!b){var S=t.constructor,E=e.constructor;S!=E&&"constructor"in t&&"constructor"in e&&!(typeof S=="function"&&S instanceof S&&typeof E=="function"&&E instanceof E)&&(m=!1)}return a.delete(t),a.delete(e),m}var J3=Y3,X3=Wn,Z3=Or,Q3=X3(Z3,"DataView"),eT=Q3,tT=Wn,rT=Or,nT=tT(rT,"Promise"),iT=nT,aT=Wn,sT=Or,oT=aT(sT,"Set"),lT=oT,cT=Wn,uT=Or,dT=cT(uT,"WeakMap"),hT=dT,Ku=eT,qu=yh,Yu=iT,Ju=lT,Xu=hT,jb=Vn,ua=bb,mg="[object Map]",fT="[object Object]",vg="[object Promise]",yg="[object Set]",bg="[object WeakMap]",wg="[object DataView]",pT=ua(Ku),gT=ua(qu),mT=ua(Yu),vT=ua(Ju),yT=ua(Xu),Tn=jb;(Ku&&Tn(new Ku(new ArrayBuffer(1)))!=wg||qu&&Tn(new qu)!=mg||Yu&&Tn(Yu.resolve())!=vg||Ju&&Tn(new Ju)!=yg||Xu&&Tn(new Xu)!=bg)&&(Tn=function(t){var e=jb(t),r=e==fT?t.constructor:void 0,n=r?ua(r):"";if(n)switch(n){case pT:return wg;case gT:return mg;case mT:return vg;case vT:return yg;case yT:return bg}return e});var Rl=Tn,Nc=wh,bT=wb,wT=O3,xT=J3,xg=Rl,_g=br,Sg=uh,_T=db,ST=1,kg="[object Arguments]",Eg="[object Array]",so="[object Object]",kT=Object.prototype,jg=kT.hasOwnProperty;function ET(t,e,r,n,i,a){var s=_g(t),o=_g(e),l=s?Eg:xg(t),c=o?Eg:xg(e);l=l==kg?so:l,c=c==kg?so:c;var d=l==so,h=c==so,f=l==c;if(f&&Sg(t)){if(!Sg(e))return!1;s=!0,d=!1}if(f&&!d)return a||(a=new Nc),s||_T(t)?bT(t,e,r,n,i,a):wT(t,e,l,r,n,i,a);if(!(r&ST)){var p=d&&jg.call(t,"__wrapped__"),y=h&&jg.call(e,"__wrapped__");if(p||y){var m=p?t.value():t,b=y?e.value():e;return a||(a=new Nc),i(m,b,r,n,a)}}return f?(a||(a=new Nc),xT(t,e,r,n,i,a)):!1}var jT=ET,CT=jT,Cg=Ur;function Cb(t,e,r,n,i){return t===e?!0:t==null||e==null||!Cg(t)&&!Cg(e)?t!==t&&e!==e:CT(t,e,r,n,Cb,i)}var Tb=Cb,TT=wh,OT=Tb,PT=1,NT=2;function $T(t,e,r,n){var i=r.length,a=i,s=!n;if(t==null)return!a;for(t=Object(t);i--;){var o=r[i];if(s&&o[2]?o[1]!==t[o[0]]:!(o[0]in t))return!1}for(;++i<a;){o=r[i];var l=o[0],c=t[l],d=o[1];if(s&&o[2]){if(c===void 0&&!(l in t))return!1}else{var h=new TT;if(n)var f=n(c,d,l,t,e,h);if(!(f===void 0?OT(d,c,PT|NT,n,h):f))return!1}}return!0}var RT=$T,AT=aa;function IT(t){return t===t&&!AT(t)}var Ob=IT,DT=Ob,MT=Cs;function zT(t){for(var e=MT(t),r=e.length;r--;){var n=e[r],i=t[n];e[r]=[n,i,DT(i)]}return e}var LT=zT;function FT(t,e){return function(r){return r==null?!1:r[t]===e&&(e!==void 0||t in Object(r))}}var Pb=FT,BT=RT,UT=LT,HT=Pb;function GT(t){var e=UT(t);return e.length==1&&e[0][2]?HT(e[0][0],e[0][1]):function(r){return r===t||BT(r,t,e)}}var VT=GT,WT=Vn,KT=Ur,qT="[object Symbol]";function YT(t){return typeof t=="symbol"||KT(t)&&WT(t)==qT}var _h=YT,JT=br,XT=_h,ZT=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,QT=/^\w*$/;function eO(t,e){if(JT(t))return!1;var r=typeof t;return r=="number"||r=="symbol"||r=="boolean"||t==null||XT(t)?!0:QT.test(t)||!ZT.test(t)||e!=null&&t in Object(e)}var Sh=eO,Nb=bh,tO="Expected a function";function kh(t,e){if(typeof t!="function"||e!=null&&typeof e!="function")throw new TypeError(tO);var r=function(){var n=arguments,i=e?e.apply(this,n):n[0],a=r.cache;if(a.has(i))return a.get(i);var s=t.apply(this,n);return r.cache=a.set(i,s)||a,s};return r.cache=new(kh.Cache||Nb),r}kh.Cache=Nb;var rO=kh,nO=rO,iO=500;function aO(t){var e=nO(t,function(n){return r.size===iO&&r.clear(),n}),r=e.cache;return e}var sO=aO,oO=sO,lO=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,cO=/\\(\\)?/g,uO=oO(function(t){var e=[];return t.charCodeAt(0)===46&&e.push(""),t.replace(lO,function(r,n,i,a){e.push(i?a.replace(cO,"$1"):n||r)}),e}),dO=uO,Tg=js,hO=yb,fO=br,pO=_h,Og=Tg?Tg.prototype:void 0,Pg=Og?Og.toString:void 0;function $b(t){if(typeof t=="string")return t;if(fO(t))return hO(t,$b)+"";if(pO(t))return Pg?Pg.call(t):"";var e=t+"";return e=="0"&&1/t==-1/0?"-0":e}var gO=$b,mO=gO;function vO(t){return t==null?"":mO(t)}var yO=vO,bO=br,wO=Sh,xO=dO,_O=yO;function SO(t,e){return bO(t)?t:wO(t,e)?[t]:xO(_O(t))}var Rb=SO,kO=_h;function EO(t){if(typeof t=="string"||kO(t))return t;var e=t+"";return e=="0"&&1/t==-1/0?"-0":e}var Al=EO,jO=Rb,CO=Al;function TO(t,e){e=jO(e,t);for(var r=0,n=e.length;t!=null&&r<n;)t=t[CO(e[r++])];return r&&r==n?t:void 0}var Ab=TO,OO=Ab;function PO(t,e,r){var n=t==null?void 0:OO(t,e);return n===void 0?r:n}var NO=PO;function $O(t,e){return t!=null&&e in Object(t)}var RO=$O,AO=Rb,IO=cb,DO=br,MO=ub,zO=dh,LO=Al;function FO(t,e,r){e=AO(e,t);for(var n=-1,i=e.length,a=!1;++n<i;){var s=LO(e[n]);if(!(a=t!=null&&r(t,s)))break;t=t[s]}return a||++n!=i?a:(i=t==null?0:t.length,!!i&&zO(i)&&MO(s,i)&&(DO(t)||IO(t)))}var BO=FO,UO=RO,HO=BO;function GO(t,e){return t!=null&&HO(t,e,UO)}var VO=GO,WO=Tb,KO=NO,qO=VO,YO=Sh,JO=Ob,XO=Pb,ZO=Al,QO=1,eP=2;function tP(t,e){return YO(t)&&JO(e)?XO(ZO(t),e):function(r){var n=KO(r,t);return n===void 0&&n===e?qO(r,t):WO(e,n,QO|eP)}}var rP=tP;function nP(t){return function(e){return e==null?void 0:e[t]}}var iP=nP,aP=Ab;function sP(t){return function(e){return aP(e,t)}}var oP=sP,lP=iP,cP=oP,uP=Sh,dP=Al;function hP(t){return uP(t)?lP(dP(t)):cP(t)}var fP=hP,pP=VT,gP=rP,mP=mb,vP=br,yP=fP;function bP(t){return typeof t=="function"?t:t==null?mP:typeof t=="object"?vP(t)?gP(t[0],t[1]):pP(t):yP(t)}var wP=bP,xP=Tl;function _P(t,e){return function(r,n){if(r==null)return r;if(!xP(r))return t(r,n);for(var i=r.length,a=e?i:-1,s=Object(r);(e?a--:++a<i)&&n(s[a],a,s)!==!1;);return r}}var SP=_P,kP=gb,EP=SP,jP=EP(kP),CP=jP,TP=CP,OP=Tl;function PP(t,e){var r=-1,n=OP(t)?Array(t.length):[];return TP(t,function(i,a,s){n[++r]=e(i,a,s)}),n}var NP=PP,$P=yb,RP=wP,AP=NP,IP=br;function DP(t,e){var r=IP(t)?$P:AP;return r(t,RP(e))}var MP=DP;Object.defineProperty(Es,"__esModule",{value:!0});Es.flattenNames=void 0;var zP=pk,LP=Il(zP),FP=gh,BP=Il(FP),UP=wj,HP=Il(UP),GP=MP,VP=Il(GP);function Il(t){return t&&t.__esModule?t:{default:t}}var WP=Es.flattenNames=function t(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:[],r=[];return(0,VP.default)(e,function(n){Array.isArray(n)?t(n).map(function(i){return r.push(i)}):(0,HP.default)(n)?(0,BP.default)(n,function(i,a){i===!0&&r.push(a),r.push(a+"-"+i)}):(0,LP.default)(n)&&r.push(n)}),r};Es.default=WP;var Ts={};function KP(t,e){for(var r=-1,n=t==null?0:t.length;++r<n&&e(t[r],r,t)!==!1;);return t}var qP=KP,YP=Wn,JP=function(){try{var t=YP(Object,"defineProperty");return t({},"",{}),t}catch{}}(),XP=JP,Ng=XP;function ZP(t,e,r){e=="__proto__"&&Ng?Ng(t,e,{configurable:!0,enumerable:!0,value:r,writable:!0}):t[e]=r}var Ib=ZP,QP=Ib,e4=vh,t4=Object.prototype,r4=t4.hasOwnProperty;function n4(t,e,r){var n=t[e];(!(r4.call(t,e)&&e4(n,r))||r===void 0&&!(e in t))&&QP(t,e,r)}var Db=n4,i4=Db,a4=Ib;function s4(t,e,r,n){var i=!r;r||(r={});for(var a=-1,s=e.length;++a<s;){var o=e[a],l=n?n(r[o],t[o],o,r,t):void 0;l===void 0&&(l=t[o]),i?a4(r,o,l):i4(r,o,l)}return r}var Dl=s4,o4=Dl,l4=Cs;function c4(t,e){return t&&o4(e,l4(e),t)}var u4=c4;function d4(t){var e=[];if(t!=null)for(var r in Object(t))e.push(r);return e}var h4=d4,f4=aa,p4=ph,g4=h4,m4=Object.prototype,v4=m4.hasOwnProperty;function y4(t){if(!f4(t))return g4(t);var e=p4(t),r=[];for(var n in t)n=="constructor"&&(e||!v4.call(t,n))||r.push(n);return r}var b4=y4,w4=hb,x4=b4,_4=Tl;function S4(t){return _4(t)?w4(t,!0):x4(t)}var Eh=S4,k4=Dl,E4=Eh;function j4(t,e){return t&&k4(e,E4(e),t)}var C4=j4,nl={exports:{}};nl.exports;(function(t,e){var r=Or,n=e&&!e.nodeType&&e,i=n&&!0&&t&&!t.nodeType&&t,a=i&&i.exports===n,s=a?r.Buffer:void 0,o=s?s.allocUnsafe:void 0;function l(c,d){if(d)return c.slice();var h=c.length,f=o?o(h):new c.constructor(h);return c.copy(f),f}t.exports=l})(nl,nl.exports);var T4=nl.exports;function O4(t,e){var r=-1,n=t.length;for(e||(e=Array(n));++r<n;)e[r]=t[r];return e}var P4=O4,N4=Dl,$4=xh;function R4(t,e){return N4(t,$4(t),e)}var A4=R4,I4=_b,D4=mh,M4=xh,z4=kb,L4=Object.getOwnPropertySymbols,F4=L4?function(t){for(var e=[];t;)I4(e,M4(t)),t=D4(t);return e}:z4,Mb=F4,B4=Dl,U4=Mb;function H4(t,e){return B4(t,U4(t),e)}var G4=H4,V4=Sb,W4=Mb,K4=Eh;function q4(t){return V4(t,K4,W4)}var Y4=q4,J4=Object.prototype,X4=J4.hasOwnProperty;function Z4(t){var e=t.length,r=new t.constructor(e);return e&&typeof t[0]=="string"&&X4.call(t,"index")&&(r.index=t.index,r.input=t.input),r}var Q4=Z4,$g=xb;function eN(t){var e=new t.constructor(t.byteLength);return new $g(e).set(new $g(t)),e}var jh=eN,tN=jh;function rN(t,e){var r=e?tN(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.byteLength)}var nN=rN,iN=/\w*$/;function aN(t){var e=new t.constructor(t.source,iN.exec(t));return e.lastIndex=t.lastIndex,e}var sN=aN,Rg=js,Ag=Rg?Rg.prototype:void 0,Ig=Ag?Ag.valueOf:void 0;function oN(t){return Ig?Object(Ig.call(t)):{}}var lN=oN,cN=jh;function uN(t,e){var r=e?cN(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.length)}var dN=uN,hN=jh,fN=nN,pN=sN,gN=lN,mN=dN,vN="[object Boolean]",yN="[object Date]",bN="[object Map]",wN="[object Number]",xN="[object RegExp]",_N="[object Set]",SN="[object String]",kN="[object Symbol]",EN="[object ArrayBuffer]",jN="[object DataView]",CN="[object Float32Array]",TN="[object Float64Array]",ON="[object Int8Array]",PN="[object Int16Array]",NN="[object Int32Array]",$N="[object Uint8Array]",RN="[object Uint8ClampedArray]",AN="[object Uint16Array]",IN="[object Uint32Array]";function DN(t,e,r){var n=t.constructor;switch(e){case EN:return hN(t);case vN:case yN:return new n(+t);case jN:return fN(t,r);case CN:case TN:case ON:case PN:case NN:case $N:case RN:case AN:case IN:return mN(t,r);case bN:return new n;case wN:case SN:return new n(t);case xN:return pN(t);case _N:return new n;case kN:return gN(t)}}var MN=DN,zN=aa,Dg=Object.create,LN=function(){function t(){}return function(e){if(!zN(e))return{};if(Dg)return Dg(e);t.prototype=e;var r=new t;return t.prototype=void 0,r}}(),FN=LN,BN=FN,UN=mh,HN=ph;function GN(t){return typeof t.constructor=="function"&&!HN(t)?BN(UN(t)):{}}var VN=GN,WN=Rl,KN=Ur,qN="[object Map]";function YN(t){return KN(t)&&WN(t)==qN}var JN=YN,XN=JN,ZN=hh,Mg=fh,zg=Mg&&Mg.isMap,QN=zg?ZN(zg):XN,e$=QN,t$=Rl,r$=Ur,n$="[object Set]";function i$(t){return r$(t)&&t$(t)==n$}var a$=i$,s$=a$,o$=hh,Lg=fh,Fg=Lg&&Lg.isSet,l$=Fg?o$(Fg):s$,c$=l$,u$=wh,d$=qP,h$=Db,f$=u4,p$=C4,g$=T4,m$=P4,v$=A4,y$=G4,b$=Eb,w$=Y4,x$=Rl,_$=Q4,S$=MN,k$=VN,E$=br,j$=uh,C$=e$,T$=aa,O$=c$,P$=Cs,N$=Eh,$$=1,R$=2,A$=4,zb="[object Arguments]",I$="[object Array]",D$="[object Boolean]",M$="[object Date]",z$="[object Error]",Lb="[object Function]",L$="[object GeneratorFunction]",F$="[object Map]",B$="[object Number]",Fb="[object Object]",U$="[object RegExp]",H$="[object Set]",G$="[object String]",V$="[object Symbol]",W$="[object WeakMap]",K$="[object ArrayBuffer]",q$="[object DataView]",Y$="[object Float32Array]",J$="[object Float64Array]",X$="[object Int8Array]",Z$="[object Int16Array]",Q$="[object Int32Array]",eR="[object Uint8Array]",tR="[object Uint8ClampedArray]",rR="[object Uint16Array]",nR="[object Uint32Array]",qe={};qe[zb]=qe[I$]=qe[K$]=qe[q$]=qe[D$]=qe[M$]=qe[Y$]=qe[J$]=qe[X$]=qe[Z$]=qe[Q$]=qe[F$]=qe[B$]=qe[Fb]=qe[U$]=qe[H$]=qe[G$]=qe[V$]=qe[eR]=qe[tR]=qe[rR]=qe[nR]=!0;qe[z$]=qe[Lb]=qe[W$]=!1;function ko(t,e,r,n,i,a){var s,o=e&$$,l=e&R$,c=e&A$;if(r&&(s=i?r(t,n,i,a):r(t)),s!==void 0)return s;if(!T$(t))return t;var d=E$(t);if(d){if(s=_$(t),!o)return m$(t,s)}else{var h=x$(t),f=h==Lb||h==L$;if(j$(t))return g$(t,o);if(h==Fb||h==zb||f&&!i){if(s=l||f?{}:k$(t),!o)return l?y$(t,p$(s,t)):v$(t,f$(s,t))}else{if(!qe[h])return i?t:{};s=S$(t,h,o)}}a||(a=new u$);var p=a.get(t);if(p)return p;a.set(t,s),O$(t)?t.forEach(function(b){s.add(ko(b,e,r,b,t,a))}):C$(t)&&t.forEach(function(b,v){s.set(v,ko(b,e,r,v,t,a))});var y=c?l?w$:b$:l?N$:P$,m=d?void 0:y(t);return d$(m||t,function(b,v){m&&(v=b,b=t[v]),h$(s,v,ko(b,e,r,v,t,a))}),s}var iR=ko,aR=iR,sR=1,oR=4;function lR(t){return aR(t,sR|oR)}var cR=lR;Object.defineProperty(Ts,"__esModule",{value:!0});Ts.mergeClasses=void 0;var uR=gh,dR=Bb(uR),hR=cR,fR=Bb(hR),pR=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t};function Bb(t){return t&&t.__esModule?t:{default:t}}var gR=Ts.mergeClasses=function(e){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:[],n=e.default&&(0,fR.default)(e.default)||{};return r.map(function(i){var a=e[i];return a&&(0,dR.default)(a,function(s,o){n[o]||(n[o]={}),n[o]=pR({},n[o],a[o])}),i}),n};Ts.default=gR;var Os={};Object.defineProperty(Os,"__esModule",{value:!0});Os.autoprefix=void 0;var mR=gh,Bg=yR(mR),vR=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t};function yR(t){return t&&t.__esModule?t:{default:t}}var bR={borderRadius:function(e){return{msBorderRadius:e,MozBorderRadius:e,OBorderRadius:e,WebkitBorderRadius:e,borderRadius:e}},boxShadow:function(e){return{msBoxShadow:e,MozBoxShadow:e,OBoxShadow:e,WebkitBoxShadow:e,boxShadow:e}},userSelect:function(e){return{WebkitTouchCallout:e,KhtmlUserSelect:e,MozUserSelect:e,msUserSelect:e,WebkitUserSelect:e,userSelect:e}},flex:function(e){return{WebkitBoxFlex:e,MozBoxFlex:e,WebkitFlex:e,msFlex:e,flex:e}},flexBasis:function(e){return{WebkitFlexBasis:e,flexBasis:e}},justifyContent:function(e){return{WebkitJustifyContent:e,justifyContent:e}},transition:function(e){return{msTransition:e,MozTransition:e,OTransition:e,WebkitTransition:e,transition:e}},transform:function(e){return{msTransform:e,MozTransform:e,OTransform:e,WebkitTransform:e,transform:e}},absolute:function(e){var r=e&&e.split(" ");return{position:"absolute",top:r&&r[0],right:r&&r[1],bottom:r&&r[2],left:r&&r[3]}},extend:function(e,r){var n=r[e];return n||{extend:e}}},wR=Os.autoprefix=function(e){var r={};return(0,Bg.default)(e,function(n,i){var a={};(0,Bg.default)(n,function(s,o){var l=bR[o];l?a=vR({},a,l(s)):a[o]=s}),r[i]=a}),r};Os.default=wR;var Ps={};Object.defineProperty(Ps,"__esModule",{value:!0});Ps.hover=void 0;var xR=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},_R=z,$c=SR(_R);function SR(t){return t&&t.__esModule?t:{default:t}}function kR(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function Ug(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e&&(typeof e=="object"||typeof e=="function")?e:t}function ER(t,e){if(typeof e!="function"&&e!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}var jR=Ps.hover=function(e){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"span";return function(n){ER(i,n);function i(){var a,s,o,l;kR(this,i);for(var c=arguments.length,d=Array(c),h=0;h<c;h++)d[h]=arguments[h];return l=(s=(o=Ug(this,(a=i.__proto__||Object.getPrototypeOf(i)).call.apply(a,[this].concat(d))),o),o.state={hover:!1},o.handleMouseOver=function(){return o.setState({hover:!0})},o.handleMouseOut=function(){return o.setState({hover:!1})},o.render=function(){return $c.default.createElement(r,{onMouseOver:o.handleMouseOver,onMouseOut:o.handleMouseOut},$c.default.createElement(e,xR({},o.props,o.state)))},s),Ug(o,l)}return i}($c.default.Component)};Ps.default=jR;var Ns={};Object.defineProperty(Ns,"__esModule",{value:!0});Ns.active=void 0;var CR=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},TR=z,Rc=OR(TR);function OR(t){return t&&t.__esModule?t:{default:t}}function PR(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function Hg(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e&&(typeof e=="object"||typeof e=="function")?e:t}function NR(t,e){if(typeof e!="function"&&e!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}var $R=Ns.active=function(e){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"span";return function(n){NR(i,n);function i(){var a,s,o,l;PR(this,i);for(var c=arguments.length,d=Array(c),h=0;h<c;h++)d[h]=arguments[h];return l=(s=(o=Hg(this,(a=i.__proto__||Object.getPrototypeOf(i)).call.apply(a,[this].concat(d))),o),o.state={active:!1},o.handleMouseDown=function(){return o.setState({active:!0})},o.handleMouseUp=function(){return o.setState({active:!1})},o.render=function(){return Rc.default.createElement(r,{onMouseDown:o.handleMouseDown,onMouseUp:o.handleMouseUp},Rc.default.createElement(e,CR({},o.props,o.state)))},s),Hg(o,l)}return i}(Rc.default.Component)};Ns.default=$R;var Ch={};Object.defineProperty(Ch,"__esModule",{value:!0});var RR=function(e,r){var n={},i=function(s){var o=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;n[s]=o};return e===0&&i("first-child"),e===r-1&&i("last-child"),(e===0||e%2===0)&&i("even"),Math.abs(e%2)===1&&i("odd"),i("nth-child",e),n};Ch.default=RR;Object.defineProperty(er,"__esModule",{value:!0});er.ReactCSS=er.loop=er.handleActive=Th=er.handleHover=er.hover=void 0;var AR=Es,IR=da(AR),DR=Ts,MR=da(DR),zR=Os,LR=da(zR),FR=Ps,Ub=da(FR),BR=Ns,UR=da(BR),HR=Ch,GR=da(HR);function da(t){return t&&t.__esModule?t:{default:t}}er.hover=Ub.default;var Th=er.handleHover=Ub.default;er.handleActive=UR.default;er.loop=GR.default;var VR=er.ReactCSS=function(e){for(var r=arguments.length,n=Array(r>1?r-1:0),i=1;i<r;i++)n[i-1]=arguments[i];var a=(0,IR.default)(n),s=(0,MR.default)(e,a);return(0,LR.default)(s)},Ce=er.default=VR,WR=function(e,r,n,i,a){var s=a.clientWidth,o=a.clientHeight,l=typeof e.pageX=="number"?e.pageX:e.touches[0].pageX,c=typeof e.pageY=="number"?e.pageY:e.touches[0].pageY,d=l-(a.getBoundingClientRect().left+window.pageXOffset),h=c-(a.getBoundingClientRect().top+window.pageYOffset);if(n==="vertical"){var f=void 0;if(h<0?f=0:h>o?f=1:f=Math.round(h*100/o)/100,r.a!==f)return{h:r.h,s:r.s,l:r.l,a:f,source:"rgb"}}else{var p=void 0;if(d<0?p=0:d>s?p=1:p=Math.round(d*100/s)/100,i!==p)return{h:r.h,s:r.s,l:r.l,a:p,source:"rgb"}}return null},Ac={},KR=function(e,r,n,i){if(typeof document>"u"&&!i)return null;var a=i?new i:document.createElement("canvas");a.width=n*2,a.height=n*2;var s=a.getContext("2d");return s?(s.fillStyle=e,s.fillRect(0,0,a.width,a.height),s.fillStyle=r,s.fillRect(0,0,n,n),s.translate(n,n),s.fillRect(0,0,n,n),a.toDataURL()):null},qR=function(e,r,n,i){var a=e+"-"+r+"-"+n+(i?"-server":"");if(Ac[a])return Ac[a];var s=KR(e,r,n,i);return Ac[a]=s,s},Gg=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},ha=function(e){var r=e.white,n=e.grey,i=e.size,a=e.renderers,s=e.borderRadius,o=e.boxShadow,l=e.children,c=Ce({default:{grid:{borderRadius:s,boxShadow:o,absolute:"0px 0px 0px 0px",background:"url("+qR(r,n,i,a.canvas)+") center left"}}});return z.isValidElement(l)?T.cloneElement(l,Gg({},l.props,{style:Gg({},l.props.style,c.grid)})):T.createElement("div",{style:c.grid})};ha.defaultProps={size:8,white:"transparent",grey:"rgba(0,0,0,.08)",renderers:{}};var YR=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},JR=function(){function t(e,r){for(var n=0;n<r.length;n++){var i=r[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}();function XR(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function Vg(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e&&(typeof e=="object"||typeof e=="function")?e:t}function ZR(t,e){if(typeof e!="function"&&e!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}var Oh=function(t){ZR(e,t);function e(){var r,n,i,a;XR(this,e);for(var s=arguments.length,o=Array(s),l=0;l<s;l++)o[l]=arguments[l];return a=(n=(i=Vg(this,(r=e.__proto__||Object.getPrototypeOf(e)).call.apply(r,[this].concat(o))),i),i.handleChange=function(c){var d=WR(c,i.props.hsl,i.props.direction,i.props.a,i.container);d&&typeof i.props.onChange=="function"&&i.props.onChange(d,c)},i.handleMouseDown=function(c){i.handleChange(c),window.addEventListener("mousemove",i.handleChange),window.addEventListener("mouseup",i.handleMouseUp)},i.handleMouseUp=function(){i.unbindEventListeners()},i.unbindEventListeners=function(){window.removeEventListener("mousemove",i.handleChange),window.removeEventListener("mouseup",i.handleMouseUp)},n),Vg(i,a)}return JR(e,[{key:"componentWillUnmount",value:function(){this.unbindEventListeners()}},{key:"render",value:function(){var n=this,i=this.props.rgb,a=Ce({default:{alpha:{absolute:"0px 0px 0px 0px",borderRadius:this.props.radius},checkboard:{absolute:"0px 0px 0px 0px",overflow:"hidden",borderRadius:this.props.radius},gradient:{absolute:"0px 0px 0px 0px",background:"linear-gradient(to right, rgba("+i.r+","+i.g+","+i.b+`, 0) 0%,
           rgba(`+i.r+","+i.g+","+i.b+", 1) 100%)",boxShadow:this.props.shadow,borderRadius:this.props.radius},container:{position:"relative",height:"100%",margin:"0 3px"},pointer:{position:"absolute",left:i.a*100+"%"},slider:{width:"4px",borderRadius:"1px",height:"8px",boxShadow:"0 0 2px rgba(0, 0, 0, .6)",background:"#fff",marginTop:"1px",transform:"translateX(-2px)"}},vertical:{gradient:{background:"linear-gradient(to bottom, rgba("+i.r+","+i.g+","+i.b+`, 0) 0%,
           rgba(`+i.r+","+i.g+","+i.b+", 1) 100%)"},pointer:{left:0,top:i.a*100+"%"}},overwrite:YR({},this.props.style)},{vertical:this.props.direction==="vertical",overwrite:!0});return T.createElement("div",{style:a.alpha},T.createElement("div",{style:a.checkboard},T.createElement(ha,{renderers:this.props.renderers})),T.createElement("div",{style:a.gradient}),T.createElement("div",{style:a.container,ref:function(o){return n.container=o},onMouseDown:this.handleMouseDown,onTouchMove:this.handleChange,onTouchStart:this.handleChange},T.createElement("div",{style:a.pointer},this.props.pointer?T.createElement(this.props.pointer,this.props):T.createElement("div",{style:a.slider}))))}}]),e}(z.PureComponent||z.Component),QR=function(){function t(e,r){for(var n=0;n<r.length;n++){var i=r[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}();function eA(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function tA(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function rA(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e&&(typeof e=="object"||typeof e=="function")?e:t}function nA(t,e){if(typeof e!="function"&&e!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}var iA=1,Hb=38,aA=40,sA=[Hb,aA],oA=function(e){return sA.indexOf(e)>-1},lA=function(e){return Number(String(e).replace(/%/g,""))},cA=1,ze=function(t){nA(e,t);function e(r){tA(this,e);var n=rA(this,(e.__proto__||Object.getPrototypeOf(e)).call(this));return n.handleBlur=function(){n.state.blurValue&&n.setState({value:n.state.blurValue,blurValue:null})},n.handleChange=function(i){n.setUpdatedValue(i.target.value,i)},n.handleKeyDown=function(i){var a=lA(i.target.value);if(!isNaN(a)&&oA(i.keyCode)){var s=n.getArrowOffset(),o=i.keyCode===Hb?a+s:a-s;n.setUpdatedValue(o,i)}},n.handleDrag=function(i){if(n.props.dragLabel){var a=Math.round(n.props.value+i.movementX);a>=0&&a<=n.props.dragMax&&n.props.onChange&&n.props.onChange(n.getValueObjectWithLabel(a),i)}},n.handleMouseDown=function(i){n.props.dragLabel&&(i.preventDefault(),n.handleDrag(i),window.addEventListener("mousemove",n.handleDrag),window.addEventListener("mouseup",n.handleMouseUp))},n.handleMouseUp=function(){n.unbindEventListeners()},n.unbindEventListeners=function(){window.removeEventListener("mousemove",n.handleDrag),window.removeEventListener("mouseup",n.handleMouseUp)},n.state={value:String(r.value).toUpperCase(),blurValue:String(r.value).toUpperCase()},n.inputId="rc-editable-input-"+cA++,n}return QR(e,[{key:"componentDidUpdate",value:function(n,i){this.props.value!==this.state.value&&(n.value!==this.props.value||i.value!==this.state.value)&&(this.input===document.activeElement?this.setState({blurValue:String(this.props.value).toUpperCase()}):this.setState({value:String(this.props.value).toUpperCase(),blurValue:!this.state.blurValue&&String(this.props.value).toUpperCase()}))}},{key:"componentWillUnmount",value:function(){this.unbindEventListeners()}},{key:"getValueObjectWithLabel",value:function(n){return eA({},this.props.label,n)}},{key:"getArrowOffset",value:function(){return this.props.arrowOffset||iA}},{key:"setUpdatedValue",value:function(n,i){var a=this.props.label?this.getValueObjectWithLabel(n):n;this.props.onChange&&this.props.onChange(a,i),this.setState({value:n})}},{key:"render",value:function(){var n=this,i=Ce({default:{wrap:{position:"relative"}},"user-override":{wrap:this.props.style&&this.props.style.wrap?this.props.style.wrap:{},input:this.props.style&&this.props.style.input?this.props.style.input:{},label:this.props.style&&this.props.style.label?this.props.style.label:{}},"dragLabel-true":{label:{cursor:"ew-resize"}}},{"user-override":!0},this.props);return T.createElement("div",{style:i.wrap},T.createElement("input",{id:this.inputId,style:i.input,ref:function(s){return n.input=s},value:this.state.value,onKeyDown:this.handleKeyDown,onChange:this.handleChange,onBlur:this.handleBlur,placeholder:this.props.placeholder,spellCheck:"false"}),this.props.label&&!this.props.hideLabel?T.createElement("label",{htmlFor:this.inputId,style:i.label,onMouseDown:this.handleMouseDown},this.props.label):null)}}]),e}(z.PureComponent||z.Component),uA=function(e,r,n,i){var a=i.clientWidth,s=i.clientHeight,o=typeof e.pageX=="number"?e.pageX:e.touches[0].pageX,l=typeof e.pageY=="number"?e.pageY:e.touches[0].pageY,c=o-(i.getBoundingClientRect().left+window.pageXOffset),d=l-(i.getBoundingClientRect().top+window.pageYOffset);if(r==="vertical"){var h=void 0;if(d<0)h=359;else if(d>s)h=0;else{var f=-(d*100/s)+100;h=360*f/100}if(n.h!==h)return{h,s:n.s,l:n.l,a:n.a,source:"hsl"}}else{var p=void 0;if(c<0)p=0;else if(c>a)p=359;else{var y=c*100/a;p=360*y/100}if(n.h!==p)return{h:p,s:n.s,l:n.l,a:n.a,source:"hsl"}}return null},dA=function(){function t(e,r){for(var n=0;n<r.length;n++){var i=r[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}();function hA(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function Wg(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e&&(typeof e=="object"||typeof e=="function")?e:t}function fA(t,e){if(typeof e!="function"&&e!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}var fa=function(t){fA(e,t);function e(){var r,n,i,a;hA(this,e);for(var s=arguments.length,o=Array(s),l=0;l<s;l++)o[l]=arguments[l];return a=(n=(i=Wg(this,(r=e.__proto__||Object.getPrototypeOf(e)).call.apply(r,[this].concat(o))),i),i.handleChange=function(c){var d=uA(c,i.props.direction,i.props.hsl,i.container);d&&typeof i.props.onChange=="function"&&i.props.onChange(d,c)},i.handleMouseDown=function(c){i.handleChange(c),window.addEventListener("mousemove",i.handleChange),window.addEventListener("mouseup",i.handleMouseUp)},i.handleMouseUp=function(){i.unbindEventListeners()},n),Wg(i,a)}return dA(e,[{key:"componentWillUnmount",value:function(){this.unbindEventListeners()}},{key:"unbindEventListeners",value:function(){window.removeEventListener("mousemove",this.handleChange),window.removeEventListener("mouseup",this.handleMouseUp)}},{key:"render",value:function(){var n=this,i=this.props.direction,a=i===void 0?"horizontal":i,s=Ce({default:{hue:{absolute:"0px 0px 0px 0px",borderRadius:this.props.radius,boxShadow:this.props.shadow},container:{padding:"0 2px",position:"relative",height:"100%",borderRadius:this.props.radius},pointer:{position:"absolute",left:this.props.hsl.h*100/360+"%"},slider:{marginTop:"1px",width:"4px",borderRadius:"1px",height:"8px",boxShadow:"0 0 2px rgba(0, 0, 0, .6)",background:"#fff",transform:"translateX(-2px)"}},vertical:{pointer:{left:"0px",top:-(this.props.hsl.h*100/360)+100+"%"}}},{vertical:a==="vertical"});return T.createElement("div",{style:s.hue},T.createElement("div",{className:"hue-"+a,style:s.container,ref:function(l){return n.container=l},onMouseDown:this.handleMouseDown,onTouchMove:this.handleChange,onTouchStart:this.handleChange},T.createElement("style",null,`
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
          `),T.createElement("div",{style:s.pointer},this.props.pointer?T.createElement(this.props.pointer,this.props):T.createElement("div",{style:s.slider}))))}}]),e}(z.PureComponent||z.Component),Gb={exports:{}},pA="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED",gA=pA,mA=gA;function Vb(){}function Wb(){}Wb.resetWarningCache=Vb;var vA=function(){function t(n,i,a,s,o,l){if(l!==mA){var c=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw c.name="Invariant Violation",c}}t.isRequired=t;function e(){return t}var r={array:t,bigint:t,bool:t,func:t,number:t,object:t,string:t,symbol:t,any:t,arrayOf:e,element:t,elementType:t,instanceOf:e,node:t,objectOf:e,oneOf:e,oneOfType:e,shape:e,exact:e,checkPropTypes:Wb,resetWarningCache:Vb};return r.PropTypes=r,r};Gb.exports=vA();var yA=Gb.exports;const se=ad(yA);function bA(){this.__data__=[],this.size=0}function $s(t,e){return t===e||t!==t&&e!==e}function Ml(t,e){for(var r=t.length;r--;)if($s(t[r][0],e))return r;return-1}var wA=Array.prototype,xA=wA.splice;function _A(t){var e=this.__data__,r=Ml(e,t);if(r<0)return!1;var n=e.length-1;return r==n?e.pop():xA.call(e,r,1),--this.size,!0}function SA(t){var e=this.__data__,r=Ml(e,t);return r<0?void 0:e[r][1]}function kA(t){return Ml(this.__data__,t)>-1}function EA(t,e){var r=this.__data__,n=Ml(r,t);return n<0?(++this.size,r.push([t,e])):r[n][1]=e,this}function Hr(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}Hr.prototype.clear=bA;Hr.prototype.delete=_A;Hr.prototype.get=SA;Hr.prototype.has=kA;Hr.prototype.set=EA;function jA(){this.__data__=new Hr,this.size=0}function CA(t){var e=this.__data__,r=e.delete(t);return this.size=e.size,r}function TA(t){return this.__data__.get(t)}function OA(t){return this.__data__.has(t)}var Kb=typeof global=="object"&&global&&global.Object===Object&&global,PA=typeof self=="object"&&self&&self.Object===Object&&self,wr=Kb||PA||Function("return this")(),gn=wr.Symbol,qb=Object.prototype,NA=qb.hasOwnProperty,$A=qb.toString,Ea=gn?gn.toStringTag:void 0;function RA(t){var e=NA.call(t,Ea),r=t[Ea];try{t[Ea]=void 0;var n=!0}catch{}var i=$A.call(t);return n&&(e?t[Ea]=r:delete t[Ea]),i}var AA=Object.prototype,IA=AA.toString;function DA(t){return IA.call(t)}var MA="[object Null]",zA="[object Undefined]",Kg=gn?gn.toStringTag:void 0;function Kn(t){return t==null?t===void 0?zA:MA:Kg&&Kg in Object(t)?RA(t):DA(t)}function ar(t){var e=typeof t;return t!=null&&(e=="object"||e=="function")}var LA="[object AsyncFunction]",FA="[object Function]",BA="[object GeneratorFunction]",UA="[object Proxy]";function Ph(t){if(!ar(t))return!1;var e=Kn(t);return e==FA||e==BA||e==LA||e==UA}var Ic=wr["__core-js_shared__"],qg=function(){var t=/[^.]+$/.exec(Ic&&Ic.keys&&Ic.keys.IE_PROTO||"");return t?"Symbol(src)_1."+t:""}();function HA(t){return!!qg&&qg in t}var GA=Function.prototype,VA=GA.toString;function qn(t){if(t!=null){try{return VA.call(t)}catch{}try{return t+""}catch{}}return""}var WA=/[\\^$.*+?()[\]{}|]/g,KA=/^\[object .+?Constructor\]$/,qA=Function.prototype,YA=Object.prototype,JA=qA.toString,XA=YA.hasOwnProperty,ZA=RegExp("^"+JA.call(XA).replace(WA,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");function QA(t){if(!ar(t)||HA(t))return!1;var e=Ph(t)?ZA:KA;return e.test(qn(t))}function e6(t,e){return t==null?void 0:t[e]}function Yn(t,e){var r=e6(t,e);return QA(r)?r:void 0}var vs=Yn(wr,"Map"),ys=Yn(Object,"create");function t6(){this.__data__=ys?ys(null):{},this.size=0}function r6(t){var e=this.has(t)&&delete this.__data__[t];return this.size-=e?1:0,e}var n6="__lodash_hash_undefined__",i6=Object.prototype,a6=i6.hasOwnProperty;function s6(t){var e=this.__data__;if(ys){var r=e[t];return r===n6?void 0:r}return a6.call(e,t)?e[t]:void 0}var o6=Object.prototype,l6=o6.hasOwnProperty;function c6(t){var e=this.__data__;return ys?e[t]!==void 0:l6.call(e,t)}var u6="__lodash_hash_undefined__";function d6(t,e){var r=this.__data__;return this.size+=this.has(t)?0:1,r[t]=ys&&e===void 0?u6:e,this}function Un(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}Un.prototype.clear=t6;Un.prototype.delete=r6;Un.prototype.get=s6;Un.prototype.has=c6;Un.prototype.set=d6;function h6(){this.size=0,this.__data__={hash:new Un,map:new(vs||Hr),string:new Un}}function f6(t){var e=typeof t;return e=="string"||e=="number"||e=="symbol"||e=="boolean"?t!=="__proto__":t===null}function zl(t,e){var r=t.__data__;return f6(e)?r[typeof e=="string"?"string":"hash"]:r.map}function p6(t){var e=zl(this,t).delete(t);return this.size-=e?1:0,e}function g6(t){return zl(this,t).get(t)}function m6(t){return zl(this,t).has(t)}function v6(t,e){var r=zl(this,t),n=r.size;return r.set(t,e),this.size+=r.size==n?0:1,this}function Gr(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}Gr.prototype.clear=h6;Gr.prototype.delete=p6;Gr.prototype.get=g6;Gr.prototype.has=m6;Gr.prototype.set=v6;var y6=200;function b6(t,e){var r=this.__data__;if(r instanceof Hr){var n=r.__data__;if(!vs||n.length<y6-1)return n.push([t,e]),this.size=++r.size,this;r=this.__data__=new Gr(n)}return r.set(t,e),this.size=r.size,this}function Tr(t){var e=this.__data__=new Hr(t);this.size=e.size}Tr.prototype.clear=jA;Tr.prototype.delete=CA;Tr.prototype.get=TA;Tr.prototype.has=OA;Tr.prototype.set=b6;var il=function(){try{var t=Yn(Object,"defineProperty");return t({},"",{}),t}catch{}}();function Nh(t,e,r){e=="__proto__"&&il?il(t,e,{configurable:!0,enumerable:!0,value:r,writable:!0}):t[e]=r}function Zu(t,e,r){(r!==void 0&&!$s(t[e],r)||r===void 0&&!(e in t))&&Nh(t,e,r)}function w6(t){return function(e,r,n){for(var i=-1,a=Object(e),s=n(e),o=s.length;o--;){var l=s[++i];if(r(a[l],l,a)===!1)break}return e}}var Yb=w6(),Jb=typeof Vt=="object"&&Vt&&!Vt.nodeType&&Vt,Yg=Jb&&typeof Wt=="object"&&Wt&&!Wt.nodeType&&Wt,x6=Yg&&Yg.exports===Jb,Jg=x6?wr.Buffer:void 0;Jg&&Jg.allocUnsafe;function _6(t,e){return t.slice()}var al=wr.Uint8Array;function S6(t){var e=new t.constructor(t.byteLength);return new al(e).set(new al(t)),e}function k6(t,e){var r=S6(t.buffer);return new t.constructor(r,t.byteOffset,t.length)}function E6(t,e){var r=-1,n=t.length;for(e||(e=Array(n));++r<n;)e[r]=t[r];return e}var Xg=Object.create,j6=function(){function t(){}return function(e){if(!ar(e))return{};if(Xg)return Xg(e);t.prototype=e;var r=new t;return t.prototype=void 0,r}}();function Xb(t,e){return function(r){return t(e(r))}}var Zb=Xb(Object.getPrototypeOf,Object),C6=Object.prototype;function $h(t){var e=t&&t.constructor,r=typeof e=="function"&&e.prototype||C6;return t===r}function T6(t){return typeof t.constructor=="function"&&!$h(t)?j6(Zb(t)):{}}function mn(t){return t!=null&&typeof t=="object"}var O6="[object Arguments]";function Zg(t){return mn(t)&&Kn(t)==O6}var Qb=Object.prototype,P6=Qb.hasOwnProperty,N6=Qb.propertyIsEnumerable,sl=Zg(function(){return arguments}())?Zg:function(t){return mn(t)&&P6.call(t,"callee")&&!N6.call(t,"callee")},Yt=Array.isArray,$6=9007199254740991;function Rh(t){return typeof t=="number"&&t>-1&&t%1==0&&t<=$6}function pa(t){return t!=null&&Rh(t.length)&&!Ph(t)}function R6(t){return mn(t)&&pa(t)}function A6(){return!1}var ew=typeof Vt=="object"&&Vt&&!Vt.nodeType&&Vt,Qg=ew&&typeof Wt=="object"&&Wt&&!Wt.nodeType&&Wt,I6=Qg&&Qg.exports===ew,em=I6?wr.Buffer:void 0,D6=em?em.isBuffer:void 0,ol=D6||A6,M6="[object Object]",z6=Function.prototype,L6=Object.prototype,tw=z6.toString,F6=L6.hasOwnProperty,B6=tw.call(Object);function U6(t){if(!mn(t)||Kn(t)!=M6)return!1;var e=Zb(t);if(e===null)return!0;var r=F6.call(e,"constructor")&&e.constructor;return typeof r=="function"&&r instanceof r&&tw.call(r)==B6}var H6="[object Arguments]",G6="[object Array]",V6="[object Boolean]",W6="[object Date]",K6="[object Error]",q6="[object Function]",Y6="[object Map]",J6="[object Number]",X6="[object Object]",Z6="[object RegExp]",Q6="[object Set]",e8="[object String]",t8="[object WeakMap]",r8="[object ArrayBuffer]",n8="[object DataView]",i8="[object Float32Array]",a8="[object Float64Array]",s8="[object Int8Array]",o8="[object Int16Array]",l8="[object Int32Array]",c8="[object Uint8Array]",u8="[object Uint8ClampedArray]",d8="[object Uint16Array]",h8="[object Uint32Array]",Ze={};Ze[i8]=Ze[a8]=Ze[s8]=Ze[o8]=Ze[l8]=Ze[c8]=Ze[u8]=Ze[d8]=Ze[h8]=!0;Ze[H6]=Ze[G6]=Ze[r8]=Ze[V6]=Ze[n8]=Ze[W6]=Ze[K6]=Ze[q6]=Ze[Y6]=Ze[J6]=Ze[X6]=Ze[Z6]=Ze[Q6]=Ze[e8]=Ze[t8]=!1;function f8(t){return mn(t)&&Rh(t.length)&&!!Ze[Kn(t)]}function p8(t){return function(e){return t(e)}}var rw=typeof Vt=="object"&&Vt&&!Vt.nodeType&&Vt,Ja=rw&&typeof Wt=="object"&&Wt&&!Wt.nodeType&&Wt,g8=Ja&&Ja.exports===rw,Dc=g8&&Kb.process,tm=function(){try{var t=Ja&&Ja.require&&Ja.require("util").types;return t||Dc&&Dc.binding&&Dc.binding("util")}catch{}}(),rm=tm&&tm.isTypedArray,Ah=rm?p8(rm):f8;function Qu(t,e){if(!(e==="constructor"&&typeof t[e]=="function")&&e!="__proto__")return t[e]}var m8=Object.prototype,v8=m8.hasOwnProperty;function y8(t,e,r){var n=t[e];(!(v8.call(t,e)&&$s(n,r))||r===void 0&&!(e in t))&&Nh(t,e,r)}function b8(t,e,r,n){var i=!r;r||(r={});for(var a=-1,s=e.length;++a<s;){var o=e[a],l=void 0;l===void 0&&(l=t[o]),i?Nh(r,o,l):y8(r,o,l)}return r}function w8(t,e){for(var r=-1,n=Array(t);++r<t;)n[r]=e(r);return n}var x8=9007199254740991,_8=/^(?:0|[1-9]\d*)$/;function Ih(t,e){var r=typeof t;return e=e??x8,!!e&&(r=="number"||r!="symbol"&&_8.test(t))&&t>-1&&t%1==0&&t<e}var S8=Object.prototype,k8=S8.hasOwnProperty;function nw(t,e){var r=Yt(t),n=!r&&sl(t),i=!r&&!n&&ol(t),a=!r&&!n&&!i&&Ah(t),s=r||n||i||a,o=s?w8(t.length,String):[],l=o.length;for(var c in t)(e||k8.call(t,c))&&!(s&&(c=="length"||i&&(c=="offset"||c=="parent")||a&&(c=="buffer"||c=="byteLength"||c=="byteOffset")||Ih(c,l)))&&o.push(c);return o}function E8(t){var e=[];if(t!=null)for(var r in Object(t))e.push(r);return e}var j8=Object.prototype,C8=j8.hasOwnProperty;function T8(t){if(!ar(t))return E8(t);var e=$h(t),r=[];for(var n in t)n=="constructor"&&(e||!C8.call(t,n))||r.push(n);return r}function iw(t){return pa(t)?nw(t,!0):T8(t)}function O8(t){return b8(t,iw(t))}function P8(t,e,r,n,i,a,s){var o=Qu(t,r),l=Qu(e,r),c=s.get(l);if(c){Zu(t,r,c);return}var d=a?a(o,l,r+"",t,e,s):void 0,h=d===void 0;if(h){var f=Yt(l),p=!f&&ol(l),y=!f&&!p&&Ah(l);d=l,f||p||y?Yt(o)?d=o:R6(o)?d=E6(o):p?(h=!1,d=_6(l)):y?(h=!1,d=k6(l)):d=[]:U6(l)||sl(l)?(d=o,sl(o)?d=O8(o):(!ar(o)||Ph(o))&&(d=T6(l))):h=!1}h&&(s.set(l,d),i(d,l,n,a,s),s.delete(l)),Zu(t,r,d)}function aw(t,e,r,n,i){t!==e&&Yb(e,function(a,s){if(i||(i=new Tr),ar(a))P8(t,e,s,r,aw,n,i);else{var o=n?n(Qu(t,s),a,s+"",t,e,i):void 0;o===void 0&&(o=a),Zu(t,s,o)}},iw)}function Ll(t){return t}function N8(t,e,r){switch(r.length){case 0:return t.call(e);case 1:return t.call(e,r[0]);case 2:return t.call(e,r[0],r[1]);case 3:return t.call(e,r[0],r[1],r[2])}return t.apply(e,r)}var nm=Math.max;function $8(t,e,r){return e=nm(e===void 0?t.length-1:e,0),function(){for(var n=arguments,i=-1,a=nm(n.length-e,0),s=Array(a);++i<a;)s[i]=n[e+i];i=-1;for(var o=Array(e+1);++i<e;)o[i]=n[i];return o[e]=r(s),N8(t,this,o)}}function R8(t){return function(){return t}}var A8=il?function(t,e){return il(t,"toString",{configurable:!0,enumerable:!1,value:R8(e),writable:!0})}:Ll,I8=800,D8=16,M8=Date.now;function z8(t){var e=0,r=0;return function(){var n=M8(),i=D8-(n-r);if(r=n,i>0){if(++e>=I8)return arguments[0]}else e=0;return t.apply(void 0,arguments)}}var L8=z8(A8);function F8(t,e){return L8($8(t,e,Ll),t+"")}function B8(t,e,r){if(!ar(r))return!1;var n=typeof e;return(n=="number"?pa(r)&&Ih(e,r.length):n=="string"&&e in r)?$s(r[e],t):!1}function U8(t){return F8(function(e,r){var n=-1,i=r.length,a=i>1?r[i-1]:void 0,s=i>2?r[2]:void 0;for(a=t.length>3&&typeof a=="function"?(i--,a):void 0,s&&B8(r[0],r[1],s)&&(a=i<3?void 0:a,i=1),e=Object(e);++n<i;){var o=r[n];o&&t(e,o,n,a)}return e})}var zt=U8(function(t,e,r){aw(t,e,r)}),Rs=function(e){var r=e.zDepth,n=e.radius,i=e.background,a=e.children,s=e.styles,o=s===void 0?{}:s,l=Ce(zt({default:{wrap:{position:"relative",display:"inline-block"},content:{position:"relative"},bg:{absolute:"0px 0px 0px 0px",boxShadow:"0 "+r+"px "+r*4+"px rgba(0,0,0,.24)",borderRadius:n,background:i}},"zDepth-0":{bg:{boxShadow:"none"}},"zDepth-1":{bg:{boxShadow:"0 2px 10px rgba(0,0,0,.12), 0 2px 5px rgba(0,0,0,.16)"}},"zDepth-2":{bg:{boxShadow:"0 6px 20px rgba(0,0,0,.19), 0 8px 17px rgba(0,0,0,.2)"}},"zDepth-3":{bg:{boxShadow:"0 17px 50px rgba(0,0,0,.19), 0 12px 15px rgba(0,0,0,.24)"}},"zDepth-4":{bg:{boxShadow:"0 25px 55px rgba(0,0,0,.21), 0 16px 28px rgba(0,0,0,.22)"}},"zDepth-5":{bg:{boxShadow:"0 40px 77px rgba(0,0,0,.22), 0 27px 24px rgba(0,0,0,.2)"}},square:{bg:{borderRadius:"0"}},circle:{bg:{borderRadius:"50%"}}},o),{"zDepth-1":r===1});return T.createElement("div",{style:l.wrap},T.createElement("div",{style:l.bg}),T.createElement("div",{style:l.content},a))};Rs.propTypes={background:se.string,zDepth:se.oneOf([0,1,2,3,4,5]),radius:se.number,styles:se.object};Rs.defaultProps={background:"#fff",zDepth:1,radius:2,styles:{}};var Mc=function(){return wr.Date.now()},H8=/\s/;function G8(t){for(var e=t.length;e--&&H8.test(t.charAt(e)););return e}var V8=/^\s+/;function W8(t){return t&&t.slice(0,G8(t)+1).replace(V8,"")}var K8="[object Symbol]";function Fl(t){return typeof t=="symbol"||mn(t)&&Kn(t)==K8}var im=NaN,q8=/^[-+]0x[0-9a-f]+$/i,Y8=/^0b[01]+$/i,J8=/^0o[0-7]+$/i,X8=parseInt;function am(t){if(typeof t=="number")return t;if(Fl(t))return im;if(ar(t)){var e=typeof t.valueOf=="function"?t.valueOf():t;t=ar(e)?e+"":e}if(typeof t!="string")return t===0?t:+t;t=W8(t);var r=Y8.test(t);return r||J8.test(t)?X8(t.slice(2),r?2:8):q8.test(t)?im:+t}var Z8="Expected a function",Q8=Math.max,eI=Math.min;function sw(t,e,r){var n,i,a,s,o,l,c=0,d=!1,h=!1,f=!0;if(typeof t!="function")throw new TypeError(Z8);e=am(e)||0,ar(r)&&(d=!!r.leading,h="maxWait"in r,a=h?Q8(am(r.maxWait)||0,e):a,f="trailing"in r?!!r.trailing:f);function p(k){var C=n,N=i;return n=i=void 0,c=k,s=t.apply(N,C),s}function y(k){return c=k,o=setTimeout(v,e),d?p(k):s}function m(k){var C=k-l,N=k-c,$=e-C;return h?eI($,a-N):$}function b(k){var C=k-l,N=k-c;return l===void 0||C>=e||C<0||h&&N>=a}function v(){var k=Mc();if(b(k))return g(k);o=setTimeout(v,m(k))}function g(k){return o=void 0,f&&n?p(k):(n=i=void 0,s)}function w(){o!==void 0&&clearTimeout(o),c=0,n=l=i=o=void 0}function S(){return o===void 0?s:g(Mc())}function E(){var k=Mc(),C=b(k);if(n=arguments,i=this,l=k,C){if(o===void 0)return y(l);if(h)return clearTimeout(o),o=setTimeout(v,e),p(l)}return o===void 0&&(o=setTimeout(v,e)),s}return E.cancel=w,E.flush=S,E}var tI="Expected a function";function rI(t,e,r){var n=!0,i=!0;if(typeof t!="function")throw new TypeError(tI);return ar(r)&&(n="leading"in r?!!r.leading:n,i="trailing"in r?!!r.trailing:i),sw(t,e,{leading:n,maxWait:e,trailing:i})}var nI=function(e,r,n){var i=n.getBoundingClientRect(),a=i.width,s=i.height,o=typeof e.pageX=="number"?e.pageX:e.touches[0].pageX,l=typeof e.pageY=="number"?e.pageY:e.touches[0].pageY,c=o-(n.getBoundingClientRect().left+window.pageXOffset),d=l-(n.getBoundingClientRect().top+window.pageYOffset);c<0?c=0:c>a&&(c=a),d<0?d=0:d>s&&(d=s);var h=c/a,f=1-d/s;return{h:r.h,s:h,v:f,a:r.a,source:"hsv"}},iI=function(){function t(e,r){for(var n=0;n<r.length;n++){var i=r[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}();function aI(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function sI(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e&&(typeof e=="object"||typeof e=="function")?e:t}function oI(t,e){if(typeof e!="function"&&e!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}var Bl=function(t){oI(e,t);function e(r){aI(this,e);var n=sI(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,r));return n.handleChange=function(i){typeof n.props.onChange=="function"&&n.throttle(n.props.onChange,nI(i,n.props.hsl,n.container),i)},n.handleMouseDown=function(i){n.handleChange(i);var a=n.getContainerRenderWindow();a.addEventListener("mousemove",n.handleChange),a.addEventListener("mouseup",n.handleMouseUp)},n.handleMouseUp=function(){n.unbindEventListeners()},n.throttle=rI(function(i,a,s){i(a,s)},50),n}return iI(e,[{key:"componentWillUnmount",value:function(){this.throttle.cancel(),this.unbindEventListeners()}},{key:"getContainerRenderWindow",value:function(){for(var n=this.container,i=window;!i.document.contains(n)&&i.parent!==i;)i=i.parent;return i}},{key:"unbindEventListeners",value:function(){var n=this.getContainerRenderWindow();n.removeEventListener("mousemove",this.handleChange),n.removeEventListener("mouseup",this.handleMouseUp)}},{key:"render",value:function(){var n=this,i=this.props.style||{},a=i.color,s=i.white,o=i.black,l=i.pointer,c=i.circle,d=Ce({default:{color:{absolute:"0px 0px 0px 0px",background:"hsl("+this.props.hsl.h+",100%, 50%)",borderRadius:this.props.radius},white:{absolute:"0px 0px 0px 0px",borderRadius:this.props.radius},black:{absolute:"0px 0px 0px 0px",boxShadow:this.props.shadow,borderRadius:this.props.radius},pointer:{position:"absolute",top:-(this.props.hsv.v*100)+100+"%",left:this.props.hsv.s*100+"%",cursor:"default"},circle:{width:"4px",height:"4px",boxShadow:`0 0 0 1.5px #fff, inset 0 0 1px 1px rgba(0,0,0,.3),
            0 0 1px 2px rgba(0,0,0,.4)`,borderRadius:"50%",cursor:"hand",transform:"translate(-2px, -2px)"}},custom:{color:a,white:s,black:o,pointer:l,circle:c}},{custom:!!this.props.style});return T.createElement("div",{style:d.color,ref:function(f){return n.container=f},onMouseDown:this.handleMouseDown,onTouchMove:this.handleChange,onTouchStart:this.handleChange},T.createElement("style",null,`
          .saturation-white {
            background: -webkit-linear-gradient(to right, #fff, rgba(255,255,255,0));
            background: linear-gradient(to right, #fff, rgba(255,255,255,0));
          }
          .saturation-black {
            background: -webkit-linear-gradient(to top, #000, rgba(0,0,0,0));
            background: linear-gradient(to top, #000, rgba(0,0,0,0));
          }
        `),T.createElement("div",{style:d.white,className:"saturation-white"},T.createElement("div",{style:d.black,className:"saturation-black"}),T.createElement("div",{style:d.pointer},this.props.pointer?T.createElement(this.props.pointer,this.props):T.createElement("div",{style:d.circle}))))}}]),e}(z.PureComponent||z.Component);function lI(t,e){for(var r=-1,n=t==null?0:t.length;++r<n&&e(t[r],r,t)!==!1;);return t}var cI=Xb(Object.keys,Object),uI=Object.prototype,dI=uI.hasOwnProperty;function hI(t){if(!$h(t))return cI(t);var e=[];for(var r in Object(t))dI.call(t,r)&&r!="constructor"&&e.push(r);return e}function Dh(t){return pa(t)?nw(t):hI(t)}function fI(t,e){return t&&Yb(t,e,Dh)}function pI(t,e){return function(r,n){if(r==null)return r;if(!pa(r))return t(r,n);for(var i=r.length,a=-1,s=Object(r);++a<i&&n(s[a],a,s)!==!1;);return r}}var ow=pI(fI);function gI(t){return typeof t=="function"?t:Ll}function mI(t,e){var r=Yt(t)?lI:ow;return r(t,gI(e))}function ll(t){"@babel/helpers - typeof";return ll=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},ll(t)}var vI=/^\s+/,yI=/\s+$/;function ve(t,e){if(t=t||"",e=e||{},t instanceof ve)return t;if(!(this instanceof ve))return new ve(t,e);var r=bI(t);this._originalInput=t,this._r=r.r,this._g=r.g,this._b=r.b,this._a=r.a,this._roundA=Math.round(100*this._a)/100,this._format=e.format||r.format,this._gradientType=e.gradientType,this._r<1&&(this._r=Math.round(this._r)),this._g<1&&(this._g=Math.round(this._g)),this._b<1&&(this._b=Math.round(this._b)),this._ok=r.ok}ve.prototype={isDark:function(){return this.getBrightness()<128},isLight:function(){return!this.isDark()},isValid:function(){return this._ok},getOriginalInput:function(){return this._originalInput},getFormat:function(){return this._format},getAlpha:function(){return this._a},getBrightness:function(){var e=this.toRgb();return(e.r*299+e.g*587+e.b*114)/1e3},getLuminance:function(){var e=this.toRgb(),r,n,i,a,s,o;return r=e.r/255,n=e.g/255,i=e.b/255,r<=.03928?a=r/12.92:a=Math.pow((r+.055)/1.055,2.4),n<=.03928?s=n/12.92:s=Math.pow((n+.055)/1.055,2.4),i<=.03928?o=i/12.92:o=Math.pow((i+.055)/1.055,2.4),.2126*a+.7152*s+.0722*o},setAlpha:function(e){return this._a=lw(e),this._roundA=Math.round(100*this._a)/100,this},toHsv:function(){var e=om(this._r,this._g,this._b);return{h:e.h*360,s:e.s,v:e.v,a:this._a}},toHsvString:function(){var e=om(this._r,this._g,this._b),r=Math.round(e.h*360),n=Math.round(e.s*100),i=Math.round(e.v*100);return this._a==1?"hsv("+r+", "+n+"%, "+i+"%)":"hsva("+r+", "+n+"%, "+i+"%, "+this._roundA+")"},toHsl:function(){var e=sm(this._r,this._g,this._b);return{h:e.h*360,s:e.s,l:e.l,a:this._a}},toHslString:function(){var e=sm(this._r,this._g,this._b),r=Math.round(e.h*360),n=Math.round(e.s*100),i=Math.round(e.l*100);return this._a==1?"hsl("+r+", "+n+"%, "+i+"%)":"hsla("+r+", "+n+"%, "+i+"%, "+this._roundA+")"},toHex:function(e){return lm(this._r,this._g,this._b,e)},toHexString:function(e){return"#"+this.toHex(e)},toHex8:function(e){return SI(this._r,this._g,this._b,this._a,e)},toHex8String:function(e){return"#"+this.toHex8(e)},toRgb:function(){return{r:Math.round(this._r),g:Math.round(this._g),b:Math.round(this._b),a:this._a}},toRgbString:function(){return this._a==1?"rgb("+Math.round(this._r)+", "+Math.round(this._g)+", "+Math.round(this._b)+")":"rgba("+Math.round(this._r)+", "+Math.round(this._g)+", "+Math.round(this._b)+", "+this._roundA+")"},toPercentageRgb:function(){return{r:Math.round(et(this._r,255)*100)+"%",g:Math.round(et(this._g,255)*100)+"%",b:Math.round(et(this._b,255)*100)+"%",a:this._a}},toPercentageRgbString:function(){return this._a==1?"rgb("+Math.round(et(this._r,255)*100)+"%, "+Math.round(et(this._g,255)*100)+"%, "+Math.round(et(this._b,255)*100)+"%)":"rgba("+Math.round(et(this._r,255)*100)+"%, "+Math.round(et(this._g,255)*100)+"%, "+Math.round(et(this._b,255)*100)+"%, "+this._roundA+")"},toName:function(){return this._a===0?"transparent":this._a<1?!1:II[lm(this._r,this._g,this._b,!0)]||!1},toFilter:function(e){var r="#"+cm(this._r,this._g,this._b,this._a),n=r,i=this._gradientType?"GradientType = 1, ":"";if(e){var a=ve(e);n="#"+cm(a._r,a._g,a._b,a._a)}return"progid:DXImageTransform.Microsoft.gradient("+i+"startColorstr="+r+",endColorstr="+n+")"},toString:function(e){var r=!!e;e=e||this._format;var n=!1,i=this._a<1&&this._a>=0,a=!r&&i&&(e==="hex"||e==="hex6"||e==="hex3"||e==="hex4"||e==="hex8"||e==="name");return a?e==="name"&&this._a===0?this.toName():this.toRgbString():(e==="rgb"&&(n=this.toRgbString()),e==="prgb"&&(n=this.toPercentageRgbString()),(e==="hex"||e==="hex6")&&(n=this.toHexString()),e==="hex3"&&(n=this.toHexString(!0)),e==="hex4"&&(n=this.toHex8String(!0)),e==="hex8"&&(n=this.toHex8String()),e==="name"&&(n=this.toName()),e==="hsl"&&(n=this.toHslString()),e==="hsv"&&(n=this.toHsvString()),n||this.toHexString())},clone:function(){return ve(this.toString())},_applyModification:function(e,r){var n=e.apply(null,[this].concat([].slice.call(r)));return this._r=n._r,this._g=n._g,this._b=n._b,this.setAlpha(n._a),this},lighten:function(){return this._applyModification(CI,arguments)},brighten:function(){return this._applyModification(TI,arguments)},darken:function(){return this._applyModification(OI,arguments)},desaturate:function(){return this._applyModification(kI,arguments)},saturate:function(){return this._applyModification(EI,arguments)},greyscale:function(){return this._applyModification(jI,arguments)},spin:function(){return this._applyModification(PI,arguments)},_applyCombination:function(e,r){return e.apply(null,[this].concat([].slice.call(r)))},analogous:function(){return this._applyCombination(RI,arguments)},complement:function(){return this._applyCombination(NI,arguments)},monochromatic:function(){return this._applyCombination(AI,arguments)},splitcomplement:function(){return this._applyCombination($I,arguments)},triad:function(){return this._applyCombination(um,[3])},tetrad:function(){return this._applyCombination(um,[4])}};ve.fromRatio=function(t,e){if(ll(t)=="object"){var r={};for(var n in t)t.hasOwnProperty(n)&&(n==="a"?r[n]=t[n]:r[n]=Aa(t[n]));t=r}return ve(t,e)};function bI(t){var e={r:0,g:0,b:0},r=1,n=null,i=null,a=null,s=!1,o=!1;return typeof t=="string"&&(t=LI(t)),ll(t)=="object"&&(Pr(t.r)&&Pr(t.g)&&Pr(t.b)?(e=wI(t.r,t.g,t.b),s=!0,o=String(t.r).substr(-1)==="%"?"prgb":"rgb"):Pr(t.h)&&Pr(t.s)&&Pr(t.v)?(n=Aa(t.s),i=Aa(t.v),e=_I(t.h,n,i),s=!0,o="hsv"):Pr(t.h)&&Pr(t.s)&&Pr(t.l)&&(n=Aa(t.s),a=Aa(t.l),e=xI(t.h,n,a),s=!0,o="hsl"),t.hasOwnProperty("a")&&(r=t.a)),r=lw(r),{ok:s,format:t.format||o,r:Math.min(255,Math.max(e.r,0)),g:Math.min(255,Math.max(e.g,0)),b:Math.min(255,Math.max(e.b,0)),a:r}}function wI(t,e,r){return{r:et(t,255)*255,g:et(e,255)*255,b:et(r,255)*255}}function sm(t,e,r){t=et(t,255),e=et(e,255),r=et(r,255);var n=Math.max(t,e,r),i=Math.min(t,e,r),a,s,o=(n+i)/2;if(n==i)a=s=0;else{var l=n-i;switch(s=o>.5?l/(2-n-i):l/(n+i),n){case t:a=(e-r)/l+(e<r?6:0);break;case e:a=(r-t)/l+2;break;case r:a=(t-e)/l+4;break}a/=6}return{h:a,s,l:o}}function xI(t,e,r){var n,i,a;t=et(t,360),e=et(e,100),r=et(r,100);function s(c,d,h){return h<0&&(h+=1),h>1&&(h-=1),h<1/6?c+(d-c)*6*h:h<1/2?d:h<2/3?c+(d-c)*(2/3-h)*6:c}if(e===0)n=i=a=r;else{var o=r<.5?r*(1+e):r+e-r*e,l=2*r-o;n=s(l,o,t+1/3),i=s(l,o,t),a=s(l,o,t-1/3)}return{r:n*255,g:i*255,b:a*255}}function om(t,e,r){t=et(t,255),e=et(e,255),r=et(r,255);var n=Math.max(t,e,r),i=Math.min(t,e,r),a,s,o=n,l=n-i;if(s=n===0?0:l/n,n==i)a=0;else{switch(n){case t:a=(e-r)/l+(e<r?6:0);break;case e:a=(r-t)/l+2;break;case r:a=(t-e)/l+4;break}a/=6}return{h:a,s,v:o}}function _I(t,e,r){t=et(t,360)*6,e=et(e,100),r=et(r,100);var n=Math.floor(t),i=t-n,a=r*(1-e),s=r*(1-i*e),o=r*(1-(1-i)*e),l=n%6,c=[r,s,a,a,o,r][l],d=[o,r,r,s,a,a][l],h=[a,a,o,r,r,s][l];return{r:c*255,g:d*255,b:h*255}}function lm(t,e,r,n){var i=[gr(Math.round(t).toString(16)),gr(Math.round(e).toString(16)),gr(Math.round(r).toString(16))];return n&&i[0].charAt(0)==i[0].charAt(1)&&i[1].charAt(0)==i[1].charAt(1)&&i[2].charAt(0)==i[2].charAt(1)?i[0].charAt(0)+i[1].charAt(0)+i[2].charAt(0):i.join("")}function SI(t,e,r,n,i){var a=[gr(Math.round(t).toString(16)),gr(Math.round(e).toString(16)),gr(Math.round(r).toString(16)),gr(cw(n))];return i&&a[0].charAt(0)==a[0].charAt(1)&&a[1].charAt(0)==a[1].charAt(1)&&a[2].charAt(0)==a[2].charAt(1)&&a[3].charAt(0)==a[3].charAt(1)?a[0].charAt(0)+a[1].charAt(0)+a[2].charAt(0)+a[3].charAt(0):a.join("")}function cm(t,e,r,n){var i=[gr(cw(n)),gr(Math.round(t).toString(16)),gr(Math.round(e).toString(16)),gr(Math.round(r).toString(16))];return i.join("")}ve.equals=function(t,e){return!t||!e?!1:ve(t).toRgbString()==ve(e).toRgbString()};ve.random=function(){return ve.fromRatio({r:Math.random(),g:Math.random(),b:Math.random()})};function kI(t,e){e=e===0?0:e||10;var r=ve(t).toHsl();return r.s-=e/100,r.s=Ul(r.s),ve(r)}function EI(t,e){e=e===0?0:e||10;var r=ve(t).toHsl();return r.s+=e/100,r.s=Ul(r.s),ve(r)}function jI(t){return ve(t).desaturate(100)}function CI(t,e){e=e===0?0:e||10;var r=ve(t).toHsl();return r.l+=e/100,r.l=Ul(r.l),ve(r)}function TI(t,e){e=e===0?0:e||10;var r=ve(t).toRgb();return r.r=Math.max(0,Math.min(255,r.r-Math.round(255*-(e/100)))),r.g=Math.max(0,Math.min(255,r.g-Math.round(255*-(e/100)))),r.b=Math.max(0,Math.min(255,r.b-Math.round(255*-(e/100)))),ve(r)}function OI(t,e){e=e===0?0:e||10;var r=ve(t).toHsl();return r.l-=e/100,r.l=Ul(r.l),ve(r)}function PI(t,e){var r=ve(t).toHsl(),n=(r.h+e)%360;return r.h=n<0?360+n:n,ve(r)}function NI(t){var e=ve(t).toHsl();return e.h=(e.h+180)%360,ve(e)}function um(t,e){if(isNaN(e)||e<=0)throw new Error("Argument to polyad must be a positive number");for(var r=ve(t).toHsl(),n=[ve(t)],i=360/e,a=1;a<e;a++)n.push(ve({h:(r.h+a*i)%360,s:r.s,l:r.l}));return n}function $I(t){var e=ve(t).toHsl(),r=e.h;return[ve(t),ve({h:(r+72)%360,s:e.s,l:e.l}),ve({h:(r+216)%360,s:e.s,l:e.l})]}function RI(t,e,r){e=e||6,r=r||30;var n=ve(t).toHsl(),i=360/r,a=[ve(t)];for(n.h=(n.h-(i*e>>1)+720)%360;--e;)n.h=(n.h+i)%360,a.push(ve(n));return a}function AI(t,e){e=e||6;for(var r=ve(t).toHsv(),n=r.h,i=r.s,a=r.v,s=[],o=1/e;e--;)s.push(ve({h:n,s:i,v:a})),a=(a+o)%1;return s}ve.mix=function(t,e,r){r=r===0?0:r||50;var n=ve(t).toRgb(),i=ve(e).toRgb(),a=r/100,s={r:(i.r-n.r)*a+n.r,g:(i.g-n.g)*a+n.g,b:(i.b-n.b)*a+n.b,a:(i.a-n.a)*a+n.a};return ve(s)};ve.readability=function(t,e){var r=ve(t),n=ve(e);return(Math.max(r.getLuminance(),n.getLuminance())+.05)/(Math.min(r.getLuminance(),n.getLuminance())+.05)};ve.isReadable=function(t,e,r){var n=ve.readability(t,e),i,a;switch(a=!1,i=FI(r),i.level+i.size){case"AAsmall":case"AAAlarge":a=n>=4.5;break;case"AAlarge":a=n>=3;break;case"AAAsmall":a=n>=7;break}return a};ve.mostReadable=function(t,e,r){var n=null,i=0,a,s,o,l;r=r||{},s=r.includeFallbackColors,o=r.level,l=r.size;for(var c=0;c<e.length;c++)a=ve.readability(t,e[c]),a>i&&(i=a,n=ve(e[c]));return ve.isReadable(t,n,{level:o,size:l})||!s?n:(r.includeFallbackColors=!1,ve.mostReadable(t,["#fff","#000"],r))};var ed=ve.names={aliceblue:"f0f8ff",antiquewhite:"faebd7",aqua:"0ff",aquamarine:"7fffd4",azure:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"000",blanchedalmond:"ffebcd",blue:"00f",blueviolet:"8a2be2",brown:"a52a2a",burlywood:"deb887",burntsienna:"ea7e5d",cadetblue:"5f9ea0",chartreuse:"7fff00",chocolate:"d2691e",coral:"ff7f50",cornflowerblue:"6495ed",cornsilk:"fff8dc",crimson:"dc143c",cyan:"0ff",darkblue:"00008b",darkcyan:"008b8b",darkgoldenrod:"b8860b",darkgray:"a9a9a9",darkgreen:"006400",darkgrey:"a9a9a9",darkkhaki:"bdb76b",darkmagenta:"8b008b",darkolivegreen:"556b2f",darkorange:"ff8c00",darkorchid:"9932cc",darkred:"8b0000",darksalmon:"e9967a",darkseagreen:"8fbc8f",darkslateblue:"483d8b",darkslategray:"2f4f4f",darkslategrey:"2f4f4f",darkturquoise:"00ced1",darkviolet:"9400d3",deeppink:"ff1493",deepskyblue:"00bfff",dimgray:"696969",dimgrey:"696969",dodgerblue:"1e90ff",firebrick:"b22222",floralwhite:"fffaf0",forestgreen:"228b22",fuchsia:"f0f",gainsboro:"dcdcdc",ghostwhite:"f8f8ff",gold:"ffd700",goldenrod:"daa520",gray:"808080",green:"008000",greenyellow:"adff2f",grey:"808080",honeydew:"f0fff0",hotpink:"ff69b4",indianred:"cd5c5c",indigo:"4b0082",ivory:"fffff0",khaki:"f0e68c",lavender:"e6e6fa",lavenderblush:"fff0f5",lawngreen:"7cfc00",lemonchiffon:"fffacd",lightblue:"add8e6",lightcoral:"f08080",lightcyan:"e0ffff",lightgoldenrodyellow:"fafad2",lightgray:"d3d3d3",lightgreen:"90ee90",lightgrey:"d3d3d3",lightpink:"ffb6c1",lightsalmon:"ffa07a",lightseagreen:"20b2aa",lightskyblue:"87cefa",lightslategray:"789",lightslategrey:"789",lightsteelblue:"b0c4de",lightyellow:"ffffe0",lime:"0f0",limegreen:"32cd32",linen:"faf0e6",magenta:"f0f",maroon:"800000",mediumaquamarine:"66cdaa",mediumblue:"0000cd",mediumorchid:"ba55d3",mediumpurple:"9370db",mediumseagreen:"3cb371",mediumslateblue:"7b68ee",mediumspringgreen:"00fa9a",mediumturquoise:"48d1cc",mediumvioletred:"c71585",midnightblue:"191970",mintcream:"f5fffa",mistyrose:"ffe4e1",moccasin:"ffe4b5",navajowhite:"ffdead",navy:"000080",oldlace:"fdf5e6",olive:"808000",olivedrab:"6b8e23",orange:"ffa500",orangered:"ff4500",orchid:"da70d6",palegoldenrod:"eee8aa",palegreen:"98fb98",paleturquoise:"afeeee",palevioletred:"db7093",papayawhip:"ffefd5",peachpuff:"ffdab9",peru:"cd853f",pink:"ffc0cb",plum:"dda0dd",powderblue:"b0e0e6",purple:"800080",rebeccapurple:"663399",red:"f00",rosybrown:"bc8f8f",royalblue:"4169e1",saddlebrown:"8b4513",salmon:"fa8072",sandybrown:"f4a460",seagreen:"2e8b57",seashell:"fff5ee",sienna:"a0522d",silver:"c0c0c0",skyblue:"87ceeb",slateblue:"6a5acd",slategray:"708090",slategrey:"708090",snow:"fffafa",springgreen:"00ff7f",steelblue:"4682b4",tan:"d2b48c",teal:"008080",thistle:"d8bfd8",tomato:"ff6347",turquoise:"40e0d0",violet:"ee82ee",wheat:"f5deb3",white:"fff",whitesmoke:"f5f5f5",yellow:"ff0",yellowgreen:"9acd32"},II=ve.hexNames=DI(ed);function DI(t){var e={};for(var r in t)t.hasOwnProperty(r)&&(e[t[r]]=r);return e}function lw(t){return t=parseFloat(t),(isNaN(t)||t<0||t>1)&&(t=1),t}function et(t,e){MI(t)&&(t="100%");var r=zI(t);return t=Math.min(e,Math.max(0,parseFloat(t))),r&&(t=parseInt(t*e,10)/100),Math.abs(t-e)<1e-6?1:t%e/parseFloat(e)}function Ul(t){return Math.min(1,Math.max(0,t))}function Ft(t){return parseInt(t,16)}function MI(t){return typeof t=="string"&&t.indexOf(".")!=-1&&parseFloat(t)===1}function zI(t){return typeof t=="string"&&t.indexOf("%")!=-1}function gr(t){return t.length==1?"0"+t:""+t}function Aa(t){return t<=1&&(t=t*100+"%"),t}function cw(t){return Math.round(parseFloat(t)*255).toString(16)}function dm(t){return Ft(t)/255}var cr=function(){var t="[-\\+]?\\d+%?",e="[-\\+]?\\d*\\.\\d+%?",r="(?:"+e+")|(?:"+t+")",n="[\\s|\\(]+("+r+")[,|\\s]+("+r+")[,|\\s]+("+r+")\\s*\\)?",i="[\\s|\\(]+("+r+")[,|\\s]+("+r+")[,|\\s]+("+r+")[,|\\s]+("+r+")\\s*\\)?";return{CSS_UNIT:new RegExp(r),rgb:new RegExp("rgb"+n),rgba:new RegExp("rgba"+i),hsl:new RegExp("hsl"+n),hsla:new RegExp("hsla"+i),hsv:new RegExp("hsv"+n),hsva:new RegExp("hsva"+i),hex3:/^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,hex6:/^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,hex4:/^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,hex8:/^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/}}();function Pr(t){return!!cr.CSS_UNIT.exec(t)}function LI(t){t=t.replace(vI,"").replace(yI,"").toLowerCase();var e=!1;if(ed[t])t=ed[t],e=!0;else if(t=="transparent")return{r:0,g:0,b:0,a:0,format:"name"};var r;return(r=cr.rgb.exec(t))?{r:r[1],g:r[2],b:r[3]}:(r=cr.rgba.exec(t))?{r:r[1],g:r[2],b:r[3],a:r[4]}:(r=cr.hsl.exec(t))?{h:r[1],s:r[2],l:r[3]}:(r=cr.hsla.exec(t))?{h:r[1],s:r[2],l:r[3],a:r[4]}:(r=cr.hsv.exec(t))?{h:r[1],s:r[2],v:r[3]}:(r=cr.hsva.exec(t))?{h:r[1],s:r[2],v:r[3],a:r[4]}:(r=cr.hex8.exec(t))?{r:Ft(r[1]),g:Ft(r[2]),b:Ft(r[3]),a:dm(r[4]),format:e?"name":"hex8"}:(r=cr.hex6.exec(t))?{r:Ft(r[1]),g:Ft(r[2]),b:Ft(r[3]),format:e?"name":"hex"}:(r=cr.hex4.exec(t))?{r:Ft(r[1]+""+r[1]),g:Ft(r[2]+""+r[2]),b:Ft(r[3]+""+r[3]),a:dm(r[4]+""+r[4]),format:e?"name":"hex8"}:(r=cr.hex3.exec(t))?{r:Ft(r[1]+""+r[1]),g:Ft(r[2]+""+r[2]),b:Ft(r[3]+""+r[3]),format:e?"name":"hex"}:!1}function FI(t){var e,r;return t=t||{level:"AA",size:"small"},e=(t.level||"AA").toUpperCase(),r=(t.size||"small").toLowerCase(),e!=="AA"&&e!=="AAA"&&(e="AA"),r!=="small"&&r!=="large"&&(r="small"),{level:e,size:r}}var hm=function(e){var r=["r","g","b","a","h","s","l","v"],n=0,i=0;return mI(r,function(a){if(e[a]&&(n+=1,isNaN(e[a])||(i+=1),a==="s"||a==="l")){var s=/^\d+%$/;s.test(e[a])&&(i+=1)}}),n===i?e:!1},Ia=function(e,r){var n=e.hex?ve(e.hex):ve(e),i=n.toHsl(),a=n.toHsv(),s=n.toRgb(),o=n.toHex();i.s===0&&(i.h=r||0,a.h=r||0);var l=o==="000000"&&s.a===0;return{hsl:i,hex:l?"transparent":"#"+o,rgb:s,hsv:a,oldHue:e.h||r||i.h,source:e.source}},xn=function(e){if(e==="transparent")return!0;var r=String(e).charAt(0)==="#"?1:0;return e.length!==4+r&&e.length<7+r&&ve(e).isValid()},Mh=function(e){if(!e)return"#fff";var r=Ia(e);if(r.hex==="transparent")return"rgba(0,0,0,0.4)";var n=(r.rgb.r*299+r.rgb.g*587+r.rgb.b*114)/1e3;return n>=128?"#000":"#fff"},zc=function(e,r){var n=e.replace("°","");return ve(r+" ("+n+")")._ok},ja=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},BI=function(){function t(e,r){for(var n=0;n<r.length;n++){var i=r[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}();function UI(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function HI(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e&&(typeof e=="object"||typeof e=="function")?e:t}function GI(t,e){if(typeof e!="function"&&e!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}var Lt=function(e){var r=function(n){GI(i,n);function i(a){UI(this,i);var s=HI(this,(i.__proto__||Object.getPrototypeOf(i)).call(this));return s.handleChange=function(o,l){var c=hm(o);if(c){var d=Ia(o,o.h||s.state.oldHue);s.setState(d),s.props.onChangeComplete&&s.debounce(s.props.onChangeComplete,d,l),s.props.onChange&&s.props.onChange(d,l)}},s.handleSwatchHover=function(o,l){var c=hm(o);if(c){var d=Ia(o,o.h||s.state.oldHue);s.props.onSwatchHover&&s.props.onSwatchHover(d,l)}},s.state=ja({},Ia(a.color,0)),s.debounce=sw(function(o,l,c){o(l,c)},100),s}return BI(i,[{key:"render",value:function(){var s={};return this.props.onSwatchHover&&(s.onSwatchHover=this.handleSwatchHover),T.createElement(e,ja({},this.props,this.state,{onChange:this.handleChange},s))}}],[{key:"getDerivedStateFromProps",value:function(s,o){return ja({},Ia(s.color,o.oldHue))}}]),i}(z.PureComponent||z.Component);return r.propTypes=ja({},e.propTypes),r.defaultProps=ja({},e.defaultProps,{color:{h:250,s:.5,l:.2,a:1}}),r},VI=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},WI=function(){function t(e,r){for(var n=0;n<r.length;n++){var i=r[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}();function KI(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function fm(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e&&(typeof e=="object"||typeof e=="function")?e:t}function qI(t,e){if(typeof e!="function"&&e!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}var YI=function(e){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"span";return function(n){qI(i,n);function i(){var a,s,o,l;KI(this,i);for(var c=arguments.length,d=Array(c),h=0;h<c;h++)d[h]=arguments[h];return l=(s=(o=fm(this,(a=i.__proto__||Object.getPrototypeOf(i)).call.apply(a,[this].concat(d))),o),o.state={focus:!1},o.handleFocus=function(){return o.setState({focus:!0})},o.handleBlur=function(){return o.setState({focus:!1})},s),fm(o,l)}return WI(i,[{key:"render",value:function(){return T.createElement(r,{onFocus:this.handleFocus,onBlur:this.handleBlur},T.createElement(e,VI({},this.props,this.state)))}}]),i}(T.Component)},pm=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},JI=13,XI=function(e){var r=e.color,n=e.style,i=e.onClick,a=i===void 0?function(){}:i,s=e.onHover,o=e.title,l=o===void 0?r:o,c=e.children,d=e.focus,h=e.focusStyle,f=h===void 0?{}:h,p=r==="transparent",y=Ce({default:{swatch:pm({background:r,height:"100%",width:"100%",cursor:"pointer",position:"relative",outline:"none"},n,d?f:{})}}),m=function(S){return a(r,S)},b=function(S){return S.keyCode===JI&&a(r,S)},v=function(S){return s(r,S)},g={};return s&&(g.onMouseOver=v),T.createElement("div",pm({style:y.swatch,onClick:m,title:l,tabIndex:0,onKeyDown:b},g),c,p&&T.createElement(ha,{borderRadius:y.swatch.borderRadius,boxShadow:"inset 0 0 0 1px rgba(0,0,0,0.1)"}))};const Jn=YI(XI);var ZI=function(e){var r=e.direction,n=Ce({default:{picker:{width:"18px",height:"18px",borderRadius:"50%",transform:"translate(-9px, -1px)",backgroundColor:"rgb(248, 248, 248)",boxShadow:"0 1px 4px 0 rgba(0, 0, 0, 0.37)"}},vertical:{picker:{transform:"translate(-3px, -9px)"}}},{vertical:r==="vertical"});return T.createElement("div",{style:n.picker})},QI=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},uw=function(e){var r=e.rgb,n=e.hsl,i=e.width,a=e.height,s=e.onChange,o=e.direction,l=e.style,c=e.renderers,d=e.pointer,h=e.className,f=h===void 0?"":h,p=Ce({default:{picker:{position:"relative",width:i,height:a},alpha:{radius:"2px",style:l}}});return T.createElement("div",{style:p.picker,className:"alpha-picker "+f},T.createElement(Oh,QI({},p.alpha,{rgb:r,hsl:n,pointer:d,renderers:c,onChange:s,direction:o})))};uw.defaultProps={width:"316px",height:"16px",direction:"horizontal",pointer:ZI};Lt(uw);function dw(t,e){for(var r=-1,n=t==null?0:t.length,i=Array(n);++r<n;)i[r]=e(t[r],r,t);return i}var eD="__lodash_hash_undefined__";function tD(t){return this.__data__.set(t,eD),this}function rD(t){return this.__data__.has(t)}function cl(t){var e=-1,r=t==null?0:t.length;for(this.__data__=new Gr;++e<r;)this.add(t[e])}cl.prototype.add=cl.prototype.push=tD;cl.prototype.has=rD;function nD(t,e){for(var r=-1,n=t==null?0:t.length;++r<n;)if(e(t[r],r,t))return!0;return!1}function iD(t,e){return t.has(e)}var aD=1,sD=2;function hw(t,e,r,n,i,a){var s=r&aD,o=t.length,l=e.length;if(o!=l&&!(s&&l>o))return!1;var c=a.get(t),d=a.get(e);if(c&&d)return c==e&&d==t;var h=-1,f=!0,p=r&sD?new cl:void 0;for(a.set(t,e),a.set(e,t);++h<o;){var y=t[h],m=e[h];if(n)var b=s?n(m,y,h,e,t,a):n(y,m,h,t,e,a);if(b!==void 0){if(b)continue;f=!1;break}if(p){if(!nD(e,function(v,g){if(!iD(p,g)&&(y===v||i(y,v,r,n,a)))return p.push(g)})){f=!1;break}}else if(!(y===m||i(y,m,r,n,a))){f=!1;break}}return a.delete(t),a.delete(e),f}function oD(t){var e=-1,r=Array(t.size);return t.forEach(function(n,i){r[++e]=[i,n]}),r}function lD(t){var e=-1,r=Array(t.size);return t.forEach(function(n){r[++e]=n}),r}var cD=1,uD=2,dD="[object Boolean]",hD="[object Date]",fD="[object Error]",pD="[object Map]",gD="[object Number]",mD="[object RegExp]",vD="[object Set]",yD="[object String]",bD="[object Symbol]",wD="[object ArrayBuffer]",xD="[object DataView]",gm=gn?gn.prototype:void 0,Lc=gm?gm.valueOf:void 0;function _D(t,e,r,n,i,a,s){switch(r){case xD:if(t.byteLength!=e.byteLength||t.byteOffset!=e.byteOffset)return!1;t=t.buffer,e=e.buffer;case wD:return!(t.byteLength!=e.byteLength||!a(new al(t),new al(e)));case dD:case hD:case gD:return $s(+t,+e);case fD:return t.name==e.name&&t.message==e.message;case mD:case yD:return t==e+"";case pD:var o=oD;case vD:var l=n&cD;if(o||(o=lD),t.size!=e.size&&!l)return!1;var c=s.get(t);if(c)return c==e;n|=uD,s.set(t,e);var d=hw(o(t),o(e),n,i,a,s);return s.delete(t),d;case bD:if(Lc)return Lc.call(t)==Lc.call(e)}return!1}function SD(t,e){for(var r=-1,n=e.length,i=t.length;++r<n;)t[i+r]=e[r];return t}function kD(t,e,r){var n=e(t);return Yt(t)?n:SD(n,r(t))}function ED(t,e){for(var r=-1,n=t==null?0:t.length,i=0,a=[];++r<n;){var s=t[r];e(s,r,t)&&(a[i++]=s)}return a}function jD(){return[]}var CD=Object.prototype,TD=CD.propertyIsEnumerable,mm=Object.getOwnPropertySymbols,OD=mm?function(t){return t==null?[]:(t=Object(t),ED(mm(t),function(e){return TD.call(t,e)}))}:jD;function vm(t){return kD(t,Dh,OD)}var PD=1,ND=Object.prototype,$D=ND.hasOwnProperty;function RD(t,e,r,n,i,a){var s=r&PD,o=vm(t),l=o.length,c=vm(e),d=c.length;if(l!=d&&!s)return!1;for(var h=l;h--;){var f=o[h];if(!(s?f in e:$D.call(e,f)))return!1}var p=a.get(t),y=a.get(e);if(p&&y)return p==e&&y==t;var m=!0;a.set(t,e),a.set(e,t);for(var b=s;++h<l;){f=o[h];var v=t[f],g=e[f];if(n)var w=s?n(g,v,f,e,t,a):n(v,g,f,t,e,a);if(!(w===void 0?v===g||i(v,g,r,n,a):w)){m=!1;break}b||(b=f=="constructor")}if(m&&!b){var S=t.constructor,E=e.constructor;S!=E&&"constructor"in t&&"constructor"in e&&!(typeof S=="function"&&S instanceof S&&typeof E=="function"&&E instanceof E)&&(m=!1)}return a.delete(t),a.delete(e),m}var td=Yn(wr,"DataView"),rd=Yn(wr,"Promise"),nd=Yn(wr,"Set"),id=Yn(wr,"WeakMap"),ym="[object Map]",AD="[object Object]",bm="[object Promise]",wm="[object Set]",xm="[object WeakMap]",_m="[object DataView]",ID=qn(td),DD=qn(vs),MD=qn(rd),zD=qn(nd),LD=qn(id),Jr=Kn;(td&&Jr(new td(new ArrayBuffer(1)))!=_m||vs&&Jr(new vs)!=ym||rd&&Jr(rd.resolve())!=bm||nd&&Jr(new nd)!=wm||id&&Jr(new id)!=xm)&&(Jr=function(t){var e=Kn(t),r=e==AD?t.constructor:void 0,n=r?qn(r):"";if(n)switch(n){case ID:return _m;case DD:return ym;case MD:return bm;case zD:return wm;case LD:return xm}return e});var FD=1,Sm="[object Arguments]",km="[object Array]",oo="[object Object]",BD=Object.prototype,Em=BD.hasOwnProperty;function UD(t,e,r,n,i,a){var s=Yt(t),o=Yt(e),l=s?km:Jr(t),c=o?km:Jr(e);l=l==Sm?oo:l,c=c==Sm?oo:c;var d=l==oo,h=c==oo,f=l==c;if(f&&ol(t)){if(!ol(e))return!1;s=!0,d=!1}if(f&&!d)return a||(a=new Tr),s||Ah(t)?hw(t,e,r,n,i,a):_D(t,e,l,r,n,i,a);if(!(r&FD)){var p=d&&Em.call(t,"__wrapped__"),y=h&&Em.call(e,"__wrapped__");if(p||y){var m=p?t.value():t,b=y?e.value():e;return a||(a=new Tr),i(m,b,r,n,a)}}return f?(a||(a=new Tr),RD(t,e,r,n,i,a)):!1}function zh(t,e,r,n,i){return t===e?!0:t==null||e==null||!mn(t)&&!mn(e)?t!==t&&e!==e:UD(t,e,r,n,zh,i)}var HD=1,GD=2;function VD(t,e,r,n){var i=r.length,a=i;if(t==null)return!a;for(t=Object(t);i--;){var s=r[i];if(s[2]?s[1]!==t[s[0]]:!(s[0]in t))return!1}for(;++i<a;){s=r[i];var o=s[0],l=t[o],c=s[1];if(s[2]){if(l===void 0&&!(o in t))return!1}else{var d=new Tr,h;if(!(h===void 0?zh(c,l,HD|GD,n,d):h))return!1}}return!0}function fw(t){return t===t&&!ar(t)}function WD(t){for(var e=Dh(t),r=e.length;r--;){var n=e[r],i=t[n];e[r]=[n,i,fw(i)]}return e}function pw(t,e){return function(r){return r==null?!1:r[t]===e&&(e!==void 0||t in Object(r))}}function KD(t){var e=WD(t);return e.length==1&&e[0][2]?pw(e[0][0],e[0][1]):function(r){return r===t||VD(r,t,e)}}var qD=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,YD=/^\w*$/;function Lh(t,e){if(Yt(t))return!1;var r=typeof t;return r=="number"||r=="symbol"||r=="boolean"||t==null||Fl(t)?!0:YD.test(t)||!qD.test(t)||e!=null&&t in Object(e)}var JD="Expected a function";function Fh(t,e){if(typeof t!="function"||e!=null&&typeof e!="function")throw new TypeError(JD);var r=function(){var n=arguments,i=e?e.apply(this,n):n[0],a=r.cache;if(a.has(i))return a.get(i);var s=t.apply(this,n);return r.cache=a.set(i,s)||a,s};return r.cache=new(Fh.Cache||Gr),r}Fh.Cache=Gr;var XD=500;function ZD(t){var e=Fh(t,function(n){return r.size===XD&&r.clear(),n}),r=e.cache;return e}var QD=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,eM=/\\(\\)?/g,tM=ZD(function(t){var e=[];return t.charCodeAt(0)===46&&e.push(""),t.replace(QD,function(r,n,i,a){e.push(i?a.replace(eM,"$1"):n||r)}),e}),jm=gn?gn.prototype:void 0,Cm=jm?jm.toString:void 0;function gw(t){if(typeof t=="string")return t;if(Yt(t))return dw(t,gw)+"";if(Fl(t))return Cm?Cm.call(t):"";var e=t+"";return e=="0"&&1/t==-1/0?"-0":e}function rM(t){return t==null?"":gw(t)}function mw(t,e){return Yt(t)?t:Lh(t,e)?[t]:tM(rM(t))}function Hl(t){if(typeof t=="string"||Fl(t))return t;var e=t+"";return e=="0"&&1/t==-1/0?"-0":e}function vw(t,e){e=mw(e,t);for(var r=0,n=e.length;t!=null&&r<n;)t=t[Hl(e[r++])];return r&&r==n?t:void 0}function nM(t,e,r){var n=t==null?void 0:vw(t,e);return n===void 0?r:n}function iM(t,e){return t!=null&&e in Object(t)}function aM(t,e,r){e=mw(e,t);for(var n=-1,i=e.length,a=!1;++n<i;){var s=Hl(e[n]);if(!(a=t!=null&&r(t,s)))break;t=t[s]}return a||++n!=i?a:(i=t==null?0:t.length,!!i&&Rh(i)&&Ih(s,i)&&(Yt(t)||sl(t)))}function sM(t,e){return t!=null&&aM(t,e,iM)}var oM=1,lM=2;function cM(t,e){return Lh(t)&&fw(e)?pw(Hl(t),e):function(r){var n=nM(r,t);return n===void 0&&n===e?sM(r,t):zh(e,n,oM|lM)}}function uM(t){return function(e){return e==null?void 0:e[t]}}function dM(t){return function(e){return vw(e,t)}}function hM(t){return Lh(t)?uM(Hl(t)):dM(t)}function fM(t){return typeof t=="function"?t:t==null?Ll:typeof t=="object"?Yt(t)?cM(t[0],t[1]):KD(t):hM(t)}function pM(t,e){var r=-1,n=pa(t)?Array(t.length):[];return ow(t,function(i,a,s){n[++r]=e(i,a,s)}),n}function Xn(t,e){var r=Yt(t)?dw:pM;return r(t,fM(e))}var gM=function(e){var r=e.colors,n=e.onClick,i=e.onSwatchHover,a=Ce({default:{swatches:{marginRight:"-10px"},swatch:{width:"22px",height:"22px",float:"left",marginRight:"10px",marginBottom:"10px",borderRadius:"4px"},clear:{clear:"both"}}});return T.createElement("div",{style:a.swatches},Xn(r,function(s){return T.createElement(Jn,{key:s,color:s,style:a.swatch,onClick:n,onHover:i,focusStyle:{boxShadow:"0 0 4px "+s}})}),T.createElement("div",{style:a.clear}))},Bh=function(e){var r=e.onChange,n=e.onSwatchHover,i=e.hex,a=e.colors,s=e.width,o=e.triangle,l=e.styles,c=l===void 0?{}:l,d=e.className,h=d===void 0?"":d,f=i==="transparent",p=function(b,v){xn(b)&&r({hex:b,source:"hex"},v)},y=Ce(zt({default:{card:{width:s,background:"#fff",boxShadow:"0 1px rgba(0,0,0,.1)",borderRadius:"6px",position:"relative"},head:{height:"110px",background:i,borderRadius:"6px 6px 0 0",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"},body:{padding:"10px"},label:{fontSize:"18px",color:Mh(i),position:"relative"},triangle:{width:"0px",height:"0px",borderStyle:"solid",borderWidth:"0 10px 10px 10px",borderColor:"transparent transparent "+i+" transparent",position:"absolute",top:"-10px",left:"50%",marginLeft:"-10px"},input:{width:"100%",fontSize:"12px",color:"#666",border:"0px",outline:"none",height:"22px",boxShadow:"inset 0 0 0 1px #ddd",borderRadius:"4px",padding:"0 7px",boxSizing:"border-box"}},"hide-triangle":{triangle:{display:"none"}}},c),{"hide-triangle":o==="hide"});return T.createElement("div",{style:y.card,className:"block-picker "+h},T.createElement("div",{style:y.triangle}),T.createElement("div",{style:y.head},f&&T.createElement(ha,{borderRadius:"6px 6px 0 0"}),T.createElement("div",{style:y.label},i)),T.createElement("div",{style:y.body},T.createElement(gM,{colors:a,onClick:p,onSwatchHover:n}),T.createElement(ze,{style:{input:y.input},value:i,onChange:p})))};Bh.propTypes={width:se.oneOfType([se.string,se.number]),colors:se.arrayOf(se.string),triangle:se.oneOf(["top","hide"]),styles:se.object};Bh.defaultProps={width:170,colors:["#D9E3F0","#F47373","#697689","#37D67A","#2CCCE4","#555555","#dce775","#ff8a65","#ba68c8"],triangle:"top",styles:{}};Lt(Bh);var li={100:"#ffcdd2",300:"#e57373",500:"#f44336",700:"#d32f2f",900:"#b71c1c"},ci={100:"#f8bbd0",300:"#f06292",500:"#e91e63",700:"#c2185b",900:"#880e4f"},ui={100:"#e1bee7",300:"#ba68c8",500:"#9c27b0",700:"#7b1fa2",900:"#4a148c"},di={100:"#d1c4e9",300:"#9575cd",500:"#673ab7",700:"#512da8",900:"#311b92"},hi={100:"#c5cae9",300:"#7986cb",500:"#3f51b5",700:"#303f9f",900:"#1a237e"},fi={100:"#bbdefb",300:"#64b5f6",500:"#2196f3",700:"#1976d2",900:"#0d47a1"},pi={100:"#b3e5fc",300:"#4fc3f7",500:"#03a9f4",700:"#0288d1",900:"#01579b"},gi={100:"#b2ebf2",300:"#4dd0e1",500:"#00bcd4",700:"#0097a7",900:"#006064"},mi={100:"#b2dfdb",300:"#4db6ac",500:"#009688",700:"#00796b",900:"#004d40"},Da={100:"#c8e6c9",300:"#81c784",500:"#4caf50",700:"#388e3c"},vi={100:"#dcedc8",300:"#aed581",500:"#8bc34a",700:"#689f38",900:"#33691e"},yi={100:"#f0f4c3",300:"#dce775",500:"#cddc39",700:"#afb42b",900:"#827717"},bi={100:"#fff9c4",300:"#fff176",500:"#ffeb3b",700:"#fbc02d",900:"#f57f17"},wi={100:"#ffecb3",300:"#ffd54f",500:"#ffc107",700:"#ffa000",900:"#ff6f00"},xi={100:"#ffe0b2",300:"#ffb74d",500:"#ff9800",700:"#f57c00",900:"#e65100"},_i={100:"#ffccbc",300:"#ff8a65",500:"#ff5722",700:"#e64a19",900:"#bf360c"},Si={100:"#d7ccc8",300:"#a1887f",500:"#795548",700:"#5d4037",900:"#3e2723"},ki={100:"#cfd8dc",300:"#90a4ae",500:"#607d8b",700:"#455a64",900:"#263238"},yw=function(e){var r=e.color,n=e.onClick,i=e.onSwatchHover,a=e.hover,s=e.active,o=e.circleSize,l=e.circleSpacing,c=Ce({default:{swatch:{width:o,height:o,marginRight:l,marginBottom:l,transform:"scale(1)",transition:"100ms transform ease"},Swatch:{borderRadius:"50%",background:"transparent",boxShadow:"inset 0 0 0 "+(o/2+1)+"px "+r,transition:"100ms box-shadow ease"}},hover:{swatch:{transform:"scale(1.2)"}},active:{Swatch:{boxShadow:"inset 0 0 0 3px "+r}}},{hover:a,active:s});return T.createElement("div",{style:c.swatch},T.createElement(Jn,{style:c.Swatch,color:r,onClick:n,onHover:i,focusStyle:{boxShadow:c.Swatch.boxShadow+", 0 0 5px "+r}}))};yw.defaultProps={circleSize:28,circleSpacing:14};const mM=Th(yw);var Uh=function(e){var r=e.width,n=e.onChange,i=e.onSwatchHover,a=e.colors,s=e.hex,o=e.circleSize,l=e.styles,c=l===void 0?{}:l,d=e.circleSpacing,h=e.className,f=h===void 0?"":h,p=Ce(zt({default:{card:{width:r,display:"flex",flexWrap:"wrap",marginRight:-d,marginBottom:-d}}},c)),y=function(b,v){return n({hex:b,source:"hex"},v)};return T.createElement("div",{style:p.card,className:"circle-picker "+f},Xn(a,function(m){return T.createElement(mM,{key:m,color:m,onClick:y,onSwatchHover:i,active:s===m.toLowerCase(),circleSize:o,circleSpacing:d})}))};Uh.propTypes={width:se.oneOfType([se.string,se.number]),circleSize:se.number,circleSpacing:se.number,styles:se.object};Uh.defaultProps={width:252,circleSize:28,circleSpacing:14,colors:[li[500],ci[500],ui[500],di[500],hi[500],fi[500],pi[500],gi[500],mi[500],Da[500],vi[500],yi[500],bi[500],wi[500],xi[500],_i[500],Si[500],ki[500]],styles:{}};Lt(Uh);function Tm(t){return t===void 0}var bw={};Object.defineProperty(bw,"__esModule",{value:!0});var Om=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},vM=z,Pm=yM(vM);function yM(t){return t&&t.__esModule?t:{default:t}}function bM(t,e){var r={};for(var n in t)e.indexOf(n)>=0||Object.prototype.hasOwnProperty.call(t,n)&&(r[n]=t[n]);return r}var lo=24,wM=bw.default=function(t){var e=t.fill,r=e===void 0?"currentColor":e,n=t.width,i=n===void 0?lo:n,a=t.height,s=a===void 0?lo:a,o=t.style,l=o===void 0?{}:o,c=bM(t,["fill","width","height","style"]);return Pm.default.createElement("svg",Om({viewBox:"0 0 "+lo+" "+lo,style:Om({fill:r,width:i,height:s},l)},c),Pm.default.createElement("path",{d:"M12,18.17L8.83,15L7.42,16.41L12,21L16.59,16.41L15.17,15M12,5.83L15.17,9L16.58,7.59L12,3L7.41,7.59L8.83,9L12,5.83Z"}))},xM=function(){function t(e,r){for(var n=0;n<r.length;n++){var i=r[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}();function _M(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function SM(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e&&(typeof e=="object"||typeof e=="function")?e:t}function kM(t,e){if(typeof e!="function"&&e!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}var ww=function(t){kM(e,t);function e(r){_M(this,e);var n=SM(this,(e.__proto__||Object.getPrototypeOf(e)).call(this));return n.toggleViews=function(){n.state.view==="hex"?n.setState({view:"rgb"}):n.state.view==="rgb"?n.setState({view:"hsl"}):n.state.view==="hsl"&&(n.props.hsl.a===1?n.setState({view:"hex"}):n.setState({view:"rgb"}))},n.handleChange=function(i,a){i.hex?xn(i.hex)&&n.props.onChange({hex:i.hex,source:"hex"},a):i.r||i.g||i.b?n.props.onChange({r:i.r||n.props.rgb.r,g:i.g||n.props.rgb.g,b:i.b||n.props.rgb.b,source:"rgb"},a):i.a?(i.a<0?i.a=0:i.a>1&&(i.a=1),n.props.onChange({h:n.props.hsl.h,s:n.props.hsl.s,l:n.props.hsl.l,a:Math.round(i.a*100)/100,source:"rgb"},a)):(i.h||i.s||i.l)&&(typeof i.s=="string"&&i.s.includes("%")&&(i.s=i.s.replace("%","")),typeof i.l=="string"&&i.l.includes("%")&&(i.l=i.l.replace("%","")),i.s==1?i.s=.01:i.l==1&&(i.l=.01),n.props.onChange({h:i.h||n.props.hsl.h,s:Number(Tm(i.s)?n.props.hsl.s:i.s),l:Number(Tm(i.l)?n.props.hsl.l:i.l),source:"hsl"},a))},n.showHighlight=function(i){i.currentTarget.style.background="#eee"},n.hideHighlight=function(i){i.currentTarget.style.background="transparent"},r.hsl.a!==1&&r.view==="hex"?n.state={view:"rgb"}:n.state={view:r.view},n}return xM(e,[{key:"render",value:function(){var n=this,i=Ce({default:{wrap:{paddingTop:"16px",display:"flex"},fields:{flex:"1",display:"flex",marginLeft:"-6px"},field:{paddingLeft:"6px",width:"100%"},alpha:{paddingLeft:"6px",width:"100%"},toggle:{width:"32px",textAlign:"right",position:"relative"},icon:{marginRight:"-4px",marginTop:"12px",cursor:"pointer",position:"relative"},iconHighlight:{position:"absolute",width:"24px",height:"28px",background:"#eee",borderRadius:"4px",top:"10px",left:"12px",display:"none"},input:{fontSize:"11px",color:"#333",width:"100%",borderRadius:"2px",border:"none",boxShadow:"inset 0 0 0 1px #dadada",height:"21px",textAlign:"center"},label:{textTransform:"uppercase",fontSize:"11px",lineHeight:"11px",color:"#969696",textAlign:"center",display:"block",marginTop:"12px"},svg:{fill:"#333",width:"24px",height:"24px",border:"1px transparent solid",borderRadius:"5px"}},disableAlpha:{alpha:{display:"none"}}},this.props,this.state),a=void 0;return this.state.view==="hex"?a=T.createElement("div",{style:i.fields,className:"flexbox-fix"},T.createElement("div",{style:i.field},T.createElement(ze,{style:{input:i.input,label:i.label},label:"hex",value:this.props.hex,onChange:this.handleChange}))):this.state.view==="rgb"?a=T.createElement("div",{style:i.fields,className:"flexbox-fix"},T.createElement("div",{style:i.field},T.createElement(ze,{style:{input:i.input,label:i.label},label:"r",value:this.props.rgb.r,onChange:this.handleChange})),T.createElement("div",{style:i.field},T.createElement(ze,{style:{input:i.input,label:i.label},label:"g",value:this.props.rgb.g,onChange:this.handleChange})),T.createElement("div",{style:i.field},T.createElement(ze,{style:{input:i.input,label:i.label},label:"b",value:this.props.rgb.b,onChange:this.handleChange})),T.createElement("div",{style:i.alpha},T.createElement(ze,{style:{input:i.input,label:i.label},label:"a",value:this.props.rgb.a,arrowOffset:.01,onChange:this.handleChange}))):this.state.view==="hsl"&&(a=T.createElement("div",{style:i.fields,className:"flexbox-fix"},T.createElement("div",{style:i.field},T.createElement(ze,{style:{input:i.input,label:i.label},label:"h",value:Math.round(this.props.hsl.h),onChange:this.handleChange})),T.createElement("div",{style:i.field},T.createElement(ze,{style:{input:i.input,label:i.label},label:"s",value:Math.round(this.props.hsl.s*100)+"%",onChange:this.handleChange})),T.createElement("div",{style:i.field},T.createElement(ze,{style:{input:i.input,label:i.label},label:"l",value:Math.round(this.props.hsl.l*100)+"%",onChange:this.handleChange})),T.createElement("div",{style:i.alpha},T.createElement(ze,{style:{input:i.input,label:i.label},label:"a",value:this.props.hsl.a,arrowOffset:.01,onChange:this.handleChange})))),T.createElement("div",{style:i.wrap,className:"flexbox-fix"},a,T.createElement("div",{style:i.toggle},T.createElement("div",{style:i.icon,onClick:this.toggleViews,ref:function(o){return n.icon=o}},T.createElement(wM,{style:i.svg,onMouseOver:this.showHighlight,onMouseEnter:this.showHighlight,onMouseOut:this.hideHighlight}))))}}],[{key:"getDerivedStateFromProps",value:function(n,i){return n.hsl.a!==1&&i.view==="hex"?{view:"rgb"}:null}}]),e}(T.Component);ww.defaultProps={view:"hex"};var Nm=function(){var e=Ce({default:{picker:{width:"12px",height:"12px",borderRadius:"6px",transform:"translate(-6px, -1px)",backgroundColor:"rgb(248, 248, 248)",boxShadow:"0 1px 4px 0 rgba(0, 0, 0, 0.37)"}}});return T.createElement("div",{style:e.picker})},EM=function(){var e=Ce({default:{picker:{width:"12px",height:"12px",borderRadius:"6px",boxShadow:"inset 0 0 0 1px #fff",transform:"translate(-6px, -6px)"}}});return T.createElement("div",{style:e.picker})},Hh=function(e){var r=e.width,n=e.onChange,i=e.disableAlpha,a=e.rgb,s=e.hsl,o=e.hsv,l=e.hex,c=e.renderers,d=e.styles,h=d===void 0?{}:d,f=e.className,p=f===void 0?"":f,y=e.defaultView,m=Ce(zt({default:{picker:{width:r,background:"#fff",borderRadius:"2px",boxShadow:"0 0 2px rgba(0,0,0,.3), 0 4px 8px rgba(0,0,0,.3)",boxSizing:"initial",fontFamily:"Menlo"},saturation:{width:"100%",paddingBottom:"55%",position:"relative",borderRadius:"2px 2px 0 0",overflow:"hidden"},Saturation:{radius:"2px 2px 0 0"},body:{padding:"16px 16px 12px"},controls:{display:"flex"},color:{width:"32px"},swatch:{marginTop:"6px",width:"16px",height:"16px",borderRadius:"8px",position:"relative",overflow:"hidden"},active:{absolute:"0px 0px 0px 0px",borderRadius:"8px",boxShadow:"inset 0 0 0 1px rgba(0,0,0,.1)",background:"rgba("+a.r+", "+a.g+", "+a.b+", "+a.a+")",zIndex:"2"},toggles:{flex:"1"},hue:{height:"10px",position:"relative",marginBottom:"8px"},Hue:{radius:"2px"},alpha:{height:"10px",position:"relative"},Alpha:{radius:"2px"}},disableAlpha:{color:{width:"22px"},alpha:{display:"none"},hue:{marginBottom:"0px"},swatch:{width:"10px",height:"10px",marginTop:"0px"}}},h),{disableAlpha:i});return T.createElement("div",{style:m.picker,className:"chrome-picker "+p},T.createElement("div",{style:m.saturation},T.createElement(Bl,{style:m.Saturation,hsl:s,hsv:o,pointer:EM,onChange:n})),T.createElement("div",{style:m.body},T.createElement("div",{style:m.controls,className:"flexbox-fix"},T.createElement("div",{style:m.color},T.createElement("div",{style:m.swatch},T.createElement("div",{style:m.active}),T.createElement(ha,{renderers:c}))),T.createElement("div",{style:m.toggles},T.createElement("div",{style:m.hue},T.createElement(fa,{style:m.Hue,hsl:s,pointer:Nm,onChange:n})),T.createElement("div",{style:m.alpha},T.createElement(Oh,{style:m.Alpha,rgb:a,hsl:s,pointer:Nm,renderers:c,onChange:n})))),T.createElement(ww,{rgb:a,hsl:s,hex:l,view:y,onChange:n,disableAlpha:i})))};Hh.propTypes={width:se.oneOfType([se.string,se.number]),disableAlpha:se.bool,styles:se.object,defaultView:se.oneOf(["hex","rgb","hsl"])};Hh.defaultProps={width:225,disableAlpha:!1,styles:{}};const jM=Lt(Hh);var CM=function(e){var r=e.color,n=e.onClick,i=n===void 0?function(){}:n,a=e.onSwatchHover,s=e.active,o=Ce({default:{color:{background:r,width:"15px",height:"15px",float:"left",marginRight:"5px",marginBottom:"5px",position:"relative",cursor:"pointer"},dot:{absolute:"5px 5px 5px 5px",background:Mh(r),borderRadius:"50%",opacity:"0"}},active:{dot:{opacity:"1"}},"color-#FFFFFF":{color:{boxShadow:"inset 0 0 0 1px #ddd"},dot:{background:"#000"}},transparent:{dot:{background:"#000"}}},{active:s,"color-#FFFFFF":r==="#FFFFFF",transparent:r==="transparent"});return T.createElement(Jn,{style:o.color,color:r,onClick:i,onHover:a,focusStyle:{boxShadow:"0 0 4px "+r}},T.createElement("div",{style:o.dot}))},TM=function(e){var r=e.hex,n=e.rgb,i=e.onChange,a=Ce({default:{fields:{display:"flex",paddingBottom:"6px",paddingRight:"5px",position:"relative"},active:{position:"absolute",top:"6px",left:"5px",height:"9px",width:"9px",background:r},HEXwrap:{flex:"6",position:"relative"},HEXinput:{width:"80%",padding:"0px",paddingLeft:"20%",border:"none",outline:"none",background:"none",fontSize:"12px",color:"#333",height:"16px"},HEXlabel:{display:"none"},RGBwrap:{flex:"3",position:"relative"},RGBinput:{width:"70%",padding:"0px",paddingLeft:"30%",border:"none",outline:"none",background:"none",fontSize:"12px",color:"#333",height:"16px"},RGBlabel:{position:"absolute",top:"3px",left:"0px",lineHeight:"16px",textTransform:"uppercase",fontSize:"12px",color:"#999"}}}),s=function(l,c){l.r||l.g||l.b?i({r:l.r||n.r,g:l.g||n.g,b:l.b||n.b,source:"rgb"},c):i({hex:l.hex,source:"hex"},c)};return T.createElement("div",{style:a.fields,className:"flexbox-fix"},T.createElement("div",{style:a.active}),T.createElement(ze,{style:{wrap:a.HEXwrap,input:a.HEXinput,label:a.HEXlabel},label:"hex",value:r,onChange:s}),T.createElement(ze,{style:{wrap:a.RGBwrap,input:a.RGBinput,label:a.RGBlabel},label:"r",value:n.r,onChange:s}),T.createElement(ze,{style:{wrap:a.RGBwrap,input:a.RGBinput,label:a.RGBlabel},label:"g",value:n.g,onChange:s}),T.createElement(ze,{style:{wrap:a.RGBwrap,input:a.RGBinput,label:a.RGBlabel},label:"b",value:n.b,onChange:s}))},Gh=function(e){var r=e.onChange,n=e.onSwatchHover,i=e.colors,a=e.hex,s=e.rgb,o=e.styles,l=o===void 0?{}:o,c=e.className,d=c===void 0?"":c,h=Ce(zt({default:{Compact:{background:"#f6f6f6",radius:"4px"},compact:{paddingTop:"5px",paddingLeft:"5px",boxSizing:"initial",width:"240px"},clear:{clear:"both"}}},l)),f=function(y,m){y.hex?xn(y.hex)&&r({hex:y.hex,source:"hex"},m):r(y,m)};return T.createElement(Rs,{style:h.Compact,styles:l},T.createElement("div",{style:h.compact,className:"compact-picker "+d},T.createElement("div",null,Xn(i,function(p){return T.createElement(CM,{key:p,color:p,active:p.toLowerCase()===a,onClick:f,onSwatchHover:n})}),T.createElement("div",{style:h.clear})),T.createElement(TM,{hex:a,rgb:s,onChange:f})))};Gh.propTypes={colors:se.arrayOf(se.string),styles:se.object};Gh.defaultProps={colors:["#4D4D4D","#999999","#FFFFFF","#F44E3B","#FE9200","#FCDC00","#DBDF00","#A4DD00","#68CCCA","#73D8FF","#AEA1FF","#FDA1FF","#333333","#808080","#cccccc","#D33115","#E27300","#FCC400","#B0BC00","#68BC00","#16A5A5","#009CE0","#7B64FF","#FA28FF","#000000","#666666","#B3B3B3","#9F0500","#C45100","#FB9E00","#808900","#194D33","#0C797D","#0062B1","#653294","#AB149E"],styles:{}};Lt(Gh);var OM=function(e){var r=e.hover,n=e.color,i=e.onClick,a=e.onSwatchHover,s={position:"relative",zIndex:"2",outline:"2px solid #fff",boxShadow:"0 0 5px 2px rgba(0,0,0,0.25)"},o=Ce({default:{swatch:{width:"25px",height:"25px",fontSize:"0"}},hover:{swatch:s}},{hover:r});return T.createElement("div",{style:o.swatch},T.createElement(Jn,{color:n,onClick:i,onHover:a,focusStyle:s}))};const PM=Th(OM);var Vh=function(e){var r=e.width,n=e.colors,i=e.onChange,a=e.onSwatchHover,s=e.triangle,o=e.styles,l=o===void 0?{}:o,c=e.className,d=c===void 0?"":c,h=Ce(zt({default:{card:{width:r,background:"#fff",border:"1px solid rgba(0,0,0,0.2)",boxShadow:"0 3px 12px rgba(0,0,0,0.15)",borderRadius:"4px",position:"relative",padding:"5px",display:"flex",flexWrap:"wrap"},triangle:{position:"absolute",border:"7px solid transparent",borderBottomColor:"#fff"},triangleShadow:{position:"absolute",border:"8px solid transparent",borderBottomColor:"rgba(0,0,0,0.15)"}},"hide-triangle":{triangle:{display:"none"},triangleShadow:{display:"none"}},"top-left-triangle":{triangle:{top:"-14px",left:"10px"},triangleShadow:{top:"-16px",left:"9px"}},"top-right-triangle":{triangle:{top:"-14px",right:"10px"},triangleShadow:{top:"-16px",right:"9px"}},"bottom-left-triangle":{triangle:{top:"35px",left:"10px",transform:"rotate(180deg)"},triangleShadow:{top:"37px",left:"9px",transform:"rotate(180deg)"}},"bottom-right-triangle":{triangle:{top:"35px",right:"10px",transform:"rotate(180deg)"},triangleShadow:{top:"37px",right:"9px",transform:"rotate(180deg)"}}},l),{"hide-triangle":s==="hide","top-left-triangle":s==="top-left","top-right-triangle":s==="top-right","bottom-left-triangle":s==="bottom-left","bottom-right-triangle":s==="bottom-right"}),f=function(y,m){return i({hex:y,source:"hex"},m)};return T.createElement("div",{style:h.card,className:"github-picker "+d},T.createElement("div",{style:h.triangleShadow}),T.createElement("div",{style:h.triangle}),Xn(n,function(p){return T.createElement(PM,{color:p,key:p,onClick:f,onSwatchHover:a})}))};Vh.propTypes={width:se.oneOfType([se.string,se.number]),colors:se.arrayOf(se.string),triangle:se.oneOf(["hide","top-left","top-right","bottom-left","bottom-right"]),styles:se.object};Vh.defaultProps={width:200,colors:["#B80000","#DB3E00","#FCCB00","#008B02","#006B76","#1273DE","#004DCF","#5300EB","#EB9694","#FAD0C3","#FEF3BD","#C1E1C5","#BEDADC","#C4DEF6","#BED3F3","#D4C4FB"],triangle:"top-left",styles:{}};Lt(Vh);var NM=function(e){var r=e.direction,n=Ce({default:{picker:{width:"18px",height:"18px",borderRadius:"50%",transform:"translate(-9px, -1px)",backgroundColor:"rgb(248, 248, 248)",boxShadow:"0 1px 4px 0 rgba(0, 0, 0, 0.37)"}},vertical:{picker:{transform:"translate(-3px, -9px)"}}},{vertical:r==="vertical"});return T.createElement("div",{style:n.picker})},$M=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},Wh=function(e){var r=e.width,n=e.height,i=e.onChange,a=e.hsl,s=e.direction,o=e.pointer,l=e.styles,c=l===void 0?{}:l,d=e.className,h=d===void 0?"":d,f=Ce(zt({default:{picker:{position:"relative",width:r,height:n},hue:{radius:"2px"}}},c)),p=function(m){return i({a:1,h:m.h,l:.5,s:1})};return T.createElement("div",{style:f.picker,className:"hue-picker "+h},T.createElement(fa,$M({},f.hue,{hsl:a,pointer:o,onChange:p,direction:s})))};Wh.propTypes={styles:se.object};Wh.defaultProps={width:"316px",height:"16px",direction:"horizontal",pointer:NM,styles:{}};Lt(Wh);var RM=function(e){var r=e.onChange,n=e.hex,i=e.rgb,a=e.styles,s=a===void 0?{}:a,o=e.className,l=o===void 0?"":o,c=Ce(zt({default:{material:{width:"98px",height:"98px",padding:"16px",fontFamily:"Roboto"},HEXwrap:{position:"relative"},HEXinput:{width:"100%",marginTop:"12px",fontSize:"15px",color:"#333",padding:"0px",border:"0px",borderBottom:"2px solid "+n,outline:"none",height:"30px"},HEXlabel:{position:"absolute",top:"0px",left:"0px",fontSize:"11px",color:"#999999",textTransform:"capitalize"},Hex:{style:{}},RGBwrap:{position:"relative"},RGBinput:{width:"100%",marginTop:"12px",fontSize:"15px",color:"#333",padding:"0px",border:"0px",borderBottom:"1px solid #eee",outline:"none",height:"30px"},RGBlabel:{position:"absolute",top:"0px",left:"0px",fontSize:"11px",color:"#999999",textTransform:"capitalize"},split:{display:"flex",marginRight:"-10px",paddingTop:"11px"},third:{flex:"1",paddingRight:"10px"}}},s)),d=function(f,p){f.hex?xn(f.hex)&&r({hex:f.hex,source:"hex"},p):(f.r||f.g||f.b)&&r({r:f.r||i.r,g:f.g||i.g,b:f.b||i.b,source:"rgb"},p)};return T.createElement(Rs,{styles:s},T.createElement("div",{style:c.material,className:"material-picker "+l},T.createElement(ze,{style:{wrap:c.HEXwrap,input:c.HEXinput,label:c.HEXlabel},label:"hex",value:n,onChange:d}),T.createElement("div",{style:c.split,className:"flexbox-fix"},T.createElement("div",{style:c.third},T.createElement(ze,{style:{wrap:c.RGBwrap,input:c.RGBinput,label:c.RGBlabel},label:"r",value:i.r,onChange:d})),T.createElement("div",{style:c.third},T.createElement(ze,{style:{wrap:c.RGBwrap,input:c.RGBinput,label:c.RGBlabel},label:"g",value:i.g,onChange:d})),T.createElement("div",{style:c.third},T.createElement(ze,{style:{wrap:c.RGBwrap,input:c.RGBinput,label:c.RGBlabel},label:"b",value:i.b,onChange:d})))))};Lt(RM);var AM=function(e){var r=e.onChange,n=e.rgb,i=e.hsv,a=e.hex,s=Ce({default:{fields:{paddingTop:"5px",paddingBottom:"9px",width:"80px",position:"relative"},divider:{height:"5px"},RGBwrap:{position:"relative"},RGBinput:{marginLeft:"40%",width:"40%",height:"18px",border:"1px solid #888888",boxShadow:"inset 0 1px 1px rgba(0,0,0,.1), 0 1px 0 0 #ECECEC",marginBottom:"5px",fontSize:"13px",paddingLeft:"3px",marginRight:"10px"},RGBlabel:{left:"0px",top:"0px",width:"34px",textTransform:"uppercase",fontSize:"13px",height:"18px",lineHeight:"22px",position:"absolute"},HEXwrap:{position:"relative"},HEXinput:{marginLeft:"20%",width:"80%",height:"18px",border:"1px solid #888888",boxShadow:"inset 0 1px 1px rgba(0,0,0,.1), 0 1px 0 0 #ECECEC",marginBottom:"6px",fontSize:"13px",paddingLeft:"3px"},HEXlabel:{position:"absolute",top:"0px",left:"0px",width:"14px",textTransform:"uppercase",fontSize:"13px",height:"18px",lineHeight:"22px"},fieldSymbols:{position:"absolute",top:"5px",right:"-7px",fontSize:"13px"},symbol:{height:"20px",lineHeight:"22px",paddingBottom:"7px"}}}),o=function(c,d){c["#"]?xn(c["#"])&&r({hex:c["#"],source:"hex"},d):c.r||c.g||c.b?r({r:c.r||n.r,g:c.g||n.g,b:c.b||n.b,source:"rgb"},d):(c.h||c.s||c.v)&&r({h:c.h||i.h,s:c.s||i.s,v:c.v||i.v,source:"hsv"},d)};return T.createElement("div",{style:s.fields},T.createElement(ze,{style:{wrap:s.RGBwrap,input:s.RGBinput,label:s.RGBlabel},label:"h",value:Math.round(i.h),onChange:o}),T.createElement(ze,{style:{wrap:s.RGBwrap,input:s.RGBinput,label:s.RGBlabel},label:"s",value:Math.round(i.s*100),onChange:o}),T.createElement(ze,{style:{wrap:s.RGBwrap,input:s.RGBinput,label:s.RGBlabel},label:"v",value:Math.round(i.v*100),onChange:o}),T.createElement("div",{style:s.divider}),T.createElement(ze,{style:{wrap:s.RGBwrap,input:s.RGBinput,label:s.RGBlabel},label:"r",value:n.r,onChange:o}),T.createElement(ze,{style:{wrap:s.RGBwrap,input:s.RGBinput,label:s.RGBlabel},label:"g",value:n.g,onChange:o}),T.createElement(ze,{style:{wrap:s.RGBwrap,input:s.RGBinput,label:s.RGBlabel},label:"b",value:n.b,onChange:o}),T.createElement("div",{style:s.divider}),T.createElement(ze,{style:{wrap:s.HEXwrap,input:s.HEXinput,label:s.HEXlabel},label:"#",value:a.replace("#",""),onChange:o}),T.createElement("div",{style:s.fieldSymbols},T.createElement("div",{style:s.symbol},"°"),T.createElement("div",{style:s.symbol},"%"),T.createElement("div",{style:s.symbol},"%")))},IM=function(e){var r=e.hsl,n=Ce({default:{picker:{width:"12px",height:"12px",borderRadius:"6px",boxShadow:"inset 0 0 0 1px #fff",transform:"translate(-6px, -6px)"}},"black-outline":{picker:{boxShadow:"inset 0 0 0 1px #000"}}},{"black-outline":r.l>.5});return T.createElement("div",{style:n.picker})},DM=function(){var e=Ce({default:{triangle:{width:0,height:0,borderStyle:"solid",borderWidth:"4px 0 4px 6px",borderColor:"transparent transparent transparent #fff",position:"absolute",top:"1px",left:"1px"},triangleBorder:{width:0,height:0,borderStyle:"solid",borderWidth:"5px 0 5px 8px",borderColor:"transparent transparent transparent #555"},left:{Extend:"triangleBorder",transform:"translate(-13px, -4px)"},leftInside:{Extend:"triangle",transform:"translate(-8px, -5px)"},right:{Extend:"triangleBorder",transform:"translate(20px, -14px) rotate(180deg)"},rightInside:{Extend:"triangle",transform:"translate(-8px, -5px)"}}});return T.createElement("div",{style:e.pointer},T.createElement("div",{style:e.left},T.createElement("div",{style:e.leftInside})),T.createElement("div",{style:e.right},T.createElement("div",{style:e.rightInside})))},$m=function(e){var r=e.onClick,n=e.label,i=e.children,a=e.active,s=Ce({default:{button:{backgroundImage:"linear-gradient(-180deg, #FFFFFF 0%, #E6E6E6 100%)",border:"1px solid #878787",borderRadius:"2px",height:"20px",boxShadow:"0 1px 0 0 #EAEAEA",fontSize:"14px",color:"#000",lineHeight:"20px",textAlign:"center",marginBottom:"10px",cursor:"pointer"}},active:{button:{boxShadow:"0 0 0 1px #878787"}}},{active:a});return T.createElement("div",{style:s.button,onClick:r},n||i)},MM=function(e){var r=e.rgb,n=e.currentColor,i=Ce({default:{swatches:{border:"1px solid #B3B3B3",borderBottom:"1px solid #F0F0F0",marginBottom:"2px",marginTop:"1px"},new:{height:"34px",background:"rgb("+r.r+","+r.g+", "+r.b+")",boxShadow:"inset 1px 0 0 #000, inset -1px 0 0 #000, inset 0 1px 0 #000"},current:{height:"34px",background:n,boxShadow:"inset 1px 0 0 #000, inset -1px 0 0 #000, inset 0 -1px 0 #000"},label:{fontSize:"14px",color:"#000",textAlign:"center"}}});return T.createElement("div",null,T.createElement("div",{style:i.label},"new"),T.createElement("div",{style:i.swatches},T.createElement("div",{style:i.new}),T.createElement("div",{style:i.current})),T.createElement("div",{style:i.label},"current"))},zM=function(){function t(e,r){for(var n=0;n<r.length;n++){var i=r[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}();function LM(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function FM(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e&&(typeof e=="object"||typeof e=="function")?e:t}function BM(t,e){if(typeof e!="function"&&e!==null)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}var Kh=function(t){BM(e,t);function e(r){LM(this,e);var n=FM(this,(e.__proto__||Object.getPrototypeOf(e)).call(this));return n.state={currentColor:r.hex},n}return zM(e,[{key:"render",value:function(){var n=this.props,i=n.styles,a=i===void 0?{}:i,s=n.className,o=s===void 0?"":s,l=Ce(zt({default:{picker:{background:"#DCDCDC",borderRadius:"4px",boxShadow:"0 0 0 1px rgba(0,0,0,.25), 0 8px 16px rgba(0,0,0,.15)",boxSizing:"initial",width:"513px"},head:{backgroundImage:"linear-gradient(-180deg, #F0F0F0 0%, #D4D4D4 100%)",borderBottom:"1px solid #B1B1B1",boxShadow:"inset 0 1px 0 0 rgba(255,255,255,.2), inset 0 -1px 0 0 rgba(0,0,0,.02)",height:"23px",lineHeight:"24px",borderRadius:"4px 4px 0 0",fontSize:"13px",color:"#4D4D4D",textAlign:"center"},body:{padding:"15px 15px 0",display:"flex"},saturation:{width:"256px",height:"256px",position:"relative",border:"2px solid #B3B3B3",borderBottom:"2px solid #F0F0F0",overflow:"hidden"},hue:{position:"relative",height:"256px",width:"19px",marginLeft:"10px",border:"2px solid #B3B3B3",borderBottom:"2px solid #F0F0F0"},controls:{width:"180px",marginLeft:"10px"},top:{display:"flex"},previews:{width:"60px"},actions:{flex:"1",marginLeft:"20px"}}},a));return T.createElement("div",{style:l.picker,className:"photoshop-picker "+o},T.createElement("div",{style:l.head},this.props.header),T.createElement("div",{style:l.body,className:"flexbox-fix"},T.createElement("div",{style:l.saturation},T.createElement(Bl,{hsl:this.props.hsl,hsv:this.props.hsv,pointer:IM,onChange:this.props.onChange})),T.createElement("div",{style:l.hue},T.createElement(fa,{direction:"vertical",hsl:this.props.hsl,pointer:DM,onChange:this.props.onChange})),T.createElement("div",{style:l.controls},T.createElement("div",{style:l.top,className:"flexbox-fix"},T.createElement("div",{style:l.previews},T.createElement(MM,{rgb:this.props.rgb,currentColor:this.state.currentColor})),T.createElement("div",{style:l.actions},T.createElement($m,{label:"OK",onClick:this.props.onAccept,active:!0}),T.createElement($m,{label:"Cancel",onClick:this.props.onCancel}),T.createElement(AM,{onChange:this.props.onChange,rgb:this.props.rgb,hsv:this.props.hsv,hex:this.props.hex}))))))}}]),e}(T.Component);Kh.propTypes={header:se.string,styles:se.object};Kh.defaultProps={header:"Color Picker",styles:{}};Lt(Kh);var UM=function(e){var r=e.onChange,n=e.rgb,i=e.hsl,a=e.hex,s=e.disableAlpha,o=Ce({default:{fields:{display:"flex",paddingTop:"4px"},single:{flex:"1",paddingLeft:"6px"},alpha:{flex:"1",paddingLeft:"6px"},double:{flex:"2"},input:{width:"80%",padding:"4px 10% 3px",border:"none",boxShadow:"inset 0 0 0 1px #ccc",fontSize:"11px"},label:{display:"block",textAlign:"center",fontSize:"11px",color:"#222",paddingTop:"3px",paddingBottom:"4px",textTransform:"capitalize"}},disableAlpha:{alpha:{display:"none"}}},{disableAlpha:s}),l=function(d,h){d.hex?xn(d.hex)&&r({hex:d.hex,source:"hex"},h):d.r||d.g||d.b?r({r:d.r||n.r,g:d.g||n.g,b:d.b||n.b,a:n.a,source:"rgb"},h):d.a&&(d.a<0?d.a=0:d.a>100&&(d.a=100),d.a/=100,r({h:i.h,s:i.s,l:i.l,a:d.a,source:"rgb"},h))};return T.createElement("div",{style:o.fields,className:"flexbox-fix"},T.createElement("div",{style:o.double},T.createElement(ze,{style:{input:o.input,label:o.label},label:"hex",value:a.replace("#",""),onChange:l})),T.createElement("div",{style:o.single},T.createElement(ze,{style:{input:o.input,label:o.label},label:"r",value:n.r,onChange:l,dragLabel:"true",dragMax:"255"})),T.createElement("div",{style:o.single},T.createElement(ze,{style:{input:o.input,label:o.label},label:"g",value:n.g,onChange:l,dragLabel:"true",dragMax:"255"})),T.createElement("div",{style:o.single},T.createElement(ze,{style:{input:o.input,label:o.label},label:"b",value:n.b,onChange:l,dragLabel:"true",dragMax:"255"})),T.createElement("div",{style:o.alpha},T.createElement(ze,{style:{input:o.input,label:o.label},label:"a",value:Math.round(n.a*100),onChange:l,dragLabel:"true",dragMax:"100"})))},HM=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},xw=function(e){var r=e.colors,n=e.onClick,i=n===void 0?function(){}:n,a=e.onSwatchHover,s=Ce({default:{colors:{margin:"0 -10px",padding:"10px 0 0 10px",borderTop:"1px solid #eee",display:"flex",flexWrap:"wrap",position:"relative"},swatchWrap:{width:"16px",height:"16px",margin:"0 10px 10px 0"},swatch:{borderRadius:"3px",boxShadow:"inset 0 0 0 1px rgba(0,0,0,.15)"}},"no-presets":{colors:{display:"none"}}},{"no-presets":!r||!r.length}),o=function(c,d){i({hex:c,source:"hex"},d)};return T.createElement("div",{style:s.colors,className:"flexbox-fix"},r.map(function(l){var c=typeof l=="string"?{color:l}:l,d=""+c.color+(c.title||"");return T.createElement("div",{key:d,style:s.swatchWrap},T.createElement(Jn,HM({},c,{style:s.swatch,onClick:o,onHover:a,focusStyle:{boxShadow:"inset 0 0 0 1px rgba(0,0,0,.15), 0 0 4px "+c.color}})))}))};xw.propTypes={colors:se.arrayOf(se.oneOfType([se.string,se.shape({color:se.string,title:se.string})])).isRequired};var GM=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},qh=function(e){var r=e.width,n=e.rgb,i=e.hex,a=e.hsv,s=e.hsl,o=e.onChange,l=e.onSwatchHover,c=e.disableAlpha,d=e.presetColors,h=e.renderers,f=e.styles,p=f===void 0?{}:f,y=e.className,m=y===void 0?"":y,b=Ce(zt({default:GM({picker:{width:r,padding:"10px 10px 0",boxSizing:"initial",background:"#fff",borderRadius:"4px",boxShadow:"0 0 0 1px rgba(0,0,0,.15), 0 8px 16px rgba(0,0,0,.15)"},saturation:{width:"100%",paddingBottom:"75%",position:"relative",overflow:"hidden"},Saturation:{radius:"3px",shadow:"inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)"},controls:{display:"flex"},sliders:{padding:"4px 0",flex:"1"},color:{width:"24px",height:"24px",position:"relative",marginTop:"4px",marginLeft:"4px",borderRadius:"3px"},activeColor:{absolute:"0px 0px 0px 0px",borderRadius:"2px",background:"rgba("+n.r+","+n.g+","+n.b+","+n.a+")",boxShadow:"inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)"},hue:{position:"relative",height:"10px",overflow:"hidden"},Hue:{radius:"2px",shadow:"inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)"},alpha:{position:"relative",height:"10px",marginTop:"4px",overflow:"hidden"},Alpha:{radius:"2px",shadow:"inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)"}},p),disableAlpha:{color:{height:"10px"},hue:{height:"10px"},alpha:{display:"none"}}},p),{disableAlpha:c});return T.createElement("div",{style:b.picker,className:"sketch-picker "+m},T.createElement("div",{style:b.saturation},T.createElement(Bl,{style:b.Saturation,hsl:s,hsv:a,onChange:o})),T.createElement("div",{style:b.controls,className:"flexbox-fix"},T.createElement("div",{style:b.sliders},T.createElement("div",{style:b.hue},T.createElement(fa,{style:b.Hue,hsl:s,onChange:o})),T.createElement("div",{style:b.alpha},T.createElement(Oh,{style:b.Alpha,rgb:n,hsl:s,renderers:h,onChange:o}))),T.createElement("div",{style:b.color},T.createElement(ha,null),T.createElement("div",{style:b.activeColor}))),T.createElement(UM,{rgb:n,hsl:s,hex:i,onChange:o,disableAlpha:c}),T.createElement(xw,{colors:d,onClick:o,onSwatchHover:l}))};qh.propTypes={disableAlpha:se.bool,width:se.oneOfType([se.string,se.number]),styles:se.object};qh.defaultProps={disableAlpha:!1,width:200,styles:{},presetColors:["#D0021B","#F5A623","#F8E71C","#8B572A","#7ED321","#417505","#BD10E0","#9013FE","#4A90E2","#50E3C2","#B8E986","#000000","#4A4A4A","#9B9B9B","#FFFFFF"]};Lt(qh);var Ca=function(e){var r=e.hsl,n=e.offset,i=e.onClick,a=i===void 0?function(){}:i,s=e.active,o=e.first,l=e.last,c=Ce({default:{swatch:{height:"12px",background:"hsl("+r.h+", 50%, "+n*100+"%)",cursor:"pointer"}},first:{swatch:{borderRadius:"2px 0 0 2px"}},last:{swatch:{borderRadius:"0 2px 2px 0"}},active:{swatch:{transform:"scaleY(1.8)",borderRadius:"3.6px/2px"}}},{active:s,first:o,last:l}),d=function(f){return a({h:r.h,s:.5,l:n,source:"hsl"},f)};return T.createElement("div",{style:c.swatch,onClick:d})},VM=function(e){var r=e.onClick,n=e.hsl,i=Ce({default:{swatches:{marginTop:"20px"},swatch:{boxSizing:"border-box",width:"20%",paddingRight:"1px",float:"left"},clear:{clear:"both"}}}),a=.1;return T.createElement("div",{style:i.swatches},T.createElement("div",{style:i.swatch},T.createElement(Ca,{hsl:n,offset:".80",active:Math.abs(n.l-.8)<a&&Math.abs(n.s-.5)<a,onClick:r,first:!0})),T.createElement("div",{style:i.swatch},T.createElement(Ca,{hsl:n,offset:".65",active:Math.abs(n.l-.65)<a&&Math.abs(n.s-.5)<a,onClick:r})),T.createElement("div",{style:i.swatch},T.createElement(Ca,{hsl:n,offset:".50",active:Math.abs(n.l-.5)<a&&Math.abs(n.s-.5)<a,onClick:r})),T.createElement("div",{style:i.swatch},T.createElement(Ca,{hsl:n,offset:".35",active:Math.abs(n.l-.35)<a&&Math.abs(n.s-.5)<a,onClick:r})),T.createElement("div",{style:i.swatch},T.createElement(Ca,{hsl:n,offset:".20",active:Math.abs(n.l-.2)<a&&Math.abs(n.s-.5)<a,onClick:r,last:!0})),T.createElement("div",{style:i.clear}))},WM=function(){var e=Ce({default:{picker:{width:"14px",height:"14px",borderRadius:"6px",transform:"translate(-7px, -1px)",backgroundColor:"rgb(248, 248, 248)",boxShadow:"0 1px 4px 0 rgba(0, 0, 0, 0.37)"}}});return T.createElement("div",{style:e.picker})},Yh=function(e){var r=e.hsl,n=e.onChange,i=e.pointer,a=e.styles,s=a===void 0?{}:a,o=e.className,l=o===void 0?"":o,c=Ce(zt({default:{hue:{height:"12px",position:"relative"},Hue:{radius:"2px"}}},s));return T.createElement("div",{style:c.wrap||{},className:"slider-picker "+l},T.createElement("div",{style:c.hue},T.createElement(fa,{style:c.Hue,hsl:r,pointer:i,onChange:n})),T.createElement("div",{style:c.swatches},T.createElement(VM,{hsl:r,onClick:n})))};Yh.propTypes={styles:se.object};Yh.defaultProps={pointer:WM,styles:{}};Lt(Yh);var _w={};Object.defineProperty(_w,"__esModule",{value:!0});var Rm=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},KM=z,Am=qM(KM);function qM(t){return t&&t.__esModule?t:{default:t}}function YM(t,e){var r={};for(var n in t)e.indexOf(n)>=0||Object.prototype.hasOwnProperty.call(t,n)&&(r[n]=t[n]);return r}var co=24,JM=_w.default=function(t){var e=t.fill,r=e===void 0?"currentColor":e,n=t.width,i=n===void 0?co:n,a=t.height,s=a===void 0?co:a,o=t.style,l=o===void 0?{}:o,c=YM(t,["fill","width","height","style"]);return Am.default.createElement("svg",Rm({viewBox:"0 0 "+co+" "+co,style:Rm({fill:r,width:i,height:s},l)},c),Am.default.createElement("path",{d:"M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"}))},XM=function(e){var r=e.color,n=e.onClick,i=n===void 0?function(){}:n,a=e.onSwatchHover,s=e.first,o=e.last,l=e.active,c=Ce({default:{color:{width:"40px",height:"24px",cursor:"pointer",background:r,marginBottom:"1px"},check:{color:Mh(r),marginLeft:"8px",display:"none"}},first:{color:{overflow:"hidden",borderRadius:"2px 2px 0 0"}},last:{color:{overflow:"hidden",borderRadius:"0 0 2px 2px"}},active:{check:{display:"block"}},"color-#FFFFFF":{color:{boxShadow:"inset 0 0 0 1px #ddd"},check:{color:"#333"}},transparent:{check:{color:"#333"}}},{first:s,last:o,active:l,"color-#FFFFFF":r==="#FFFFFF",transparent:r==="transparent"});return T.createElement(Jn,{color:r,style:c.color,onClick:i,onHover:a,focusStyle:{boxShadow:"0 0 4px "+r}},T.createElement("div",{style:c.check},T.createElement(JM,null)))},ZM=function(e){var r=e.onClick,n=e.onSwatchHover,i=e.group,a=e.active,s=Ce({default:{group:{paddingBottom:"10px",width:"40px",float:"left",marginRight:"10px"}}});return T.createElement("div",{style:s.group},Xn(i,function(o,l){return T.createElement(XM,{key:o,color:o,active:o.toLowerCase()===a,first:l===0,last:l===i.length-1,onClick:r,onSwatchHover:n})}))},Jh=function(e){var r=e.width,n=e.height,i=e.onChange,a=e.onSwatchHover,s=e.colors,o=e.hex,l=e.styles,c=l===void 0?{}:l,d=e.className,h=d===void 0?"":d,f=Ce(zt({default:{picker:{width:r,height:n},overflow:{height:n,overflowY:"scroll"},body:{padding:"16px 0 6px 16px"},clear:{clear:"both"}}},c)),p=function(m,b){return i({hex:m,source:"hex"},b)};return T.createElement("div",{style:f.picker,className:"swatches-picker "+h},T.createElement(Rs,null,T.createElement("div",{style:f.overflow},T.createElement("div",{style:f.body},Xn(s,function(y){return T.createElement(ZM,{key:y.toString(),group:y,active:o,onClick:p,onSwatchHover:a})}),T.createElement("div",{style:f.clear})))))};Jh.propTypes={width:se.oneOfType([se.string,se.number]),height:se.oneOfType([se.string,se.number]),colors:se.arrayOf(se.arrayOf(se.string)),styles:se.object};Jh.defaultProps={width:320,height:240,colors:[[li[900],li[700],li[500],li[300],li[100]],[ci[900],ci[700],ci[500],ci[300],ci[100]],[ui[900],ui[700],ui[500],ui[300],ui[100]],[di[900],di[700],di[500],di[300],di[100]],[hi[900],hi[700],hi[500],hi[300],hi[100]],[fi[900],fi[700],fi[500],fi[300],fi[100]],[pi[900],pi[700],pi[500],pi[300],pi[100]],[gi[900],gi[700],gi[500],gi[300],gi[100]],[mi[900],mi[700],mi[500],mi[300],mi[100]],["#194D33",Da[700],Da[500],Da[300],Da[100]],[vi[900],vi[700],vi[500],vi[300],vi[100]],[yi[900],yi[700],yi[500],yi[300],yi[100]],[bi[900],bi[700],bi[500],bi[300],bi[100]],[wi[900],wi[700],wi[500],wi[300],wi[100]],[xi[900],xi[700],xi[500],xi[300],xi[100]],[_i[900],_i[700],_i[500],_i[300],_i[100]],[Si[900],Si[700],Si[500],Si[300],Si[100]],[ki[900],ki[700],ki[500],ki[300],ki[100]],["#000000","#525252","#969696","#D9D9D9","#FFFFFF"]],styles:{}};Lt(Jh);var Xh=function(e){var r=e.onChange,n=e.onSwatchHover,i=e.hex,a=e.colors,s=e.width,o=e.triangle,l=e.styles,c=l===void 0?{}:l,d=e.className,h=d===void 0?"":d,f=Ce(zt({default:{card:{width:s,background:"#fff",border:"0 solid rgba(0,0,0,0.25)",boxShadow:"0 1px 4px rgba(0,0,0,0.25)",borderRadius:"4px",position:"relative"},body:{padding:"15px 9px 9px 15px"},label:{fontSize:"18px",color:"#fff"},triangle:{width:"0px",height:"0px",borderStyle:"solid",borderWidth:"0 9px 10px 9px",borderColor:"transparent transparent #fff transparent",position:"absolute"},triangleShadow:{width:"0px",height:"0px",borderStyle:"solid",borderWidth:"0 9px 10px 9px",borderColor:"transparent transparent rgba(0,0,0,.1) transparent",position:"absolute"},hash:{background:"#F0F0F0",height:"30px",width:"30px",borderRadius:"4px 0 0 4px",float:"left",color:"#98A1A4",display:"flex",alignItems:"center",justifyContent:"center"},input:{width:"100px",fontSize:"14px",color:"#666",border:"0px",outline:"none",height:"28px",boxShadow:"inset 0 0 0 1px #F0F0F0",boxSizing:"content-box",borderRadius:"0 4px 4px 0",float:"left",paddingLeft:"8px"},swatch:{width:"30px",height:"30px",float:"left",borderRadius:"4px",margin:"0 6px 6px 0"},clear:{clear:"both"}},"hide-triangle":{triangle:{display:"none"},triangleShadow:{display:"none"}},"top-left-triangle":{triangle:{top:"-10px",left:"12px"},triangleShadow:{top:"-11px",left:"12px"}},"top-right-triangle":{triangle:{top:"-10px",right:"12px"},triangleShadow:{top:"-11px",right:"12px"}}},c),{"hide-triangle":o==="hide","top-left-triangle":o==="top-left","top-right-triangle":o==="top-right"}),p=function(m,b){xn(m)&&r({hex:m,source:"hex"},b)};return T.createElement("div",{style:f.card,className:"twitter-picker "+h},T.createElement("div",{style:f.triangleShadow}),T.createElement("div",{style:f.triangle}),T.createElement("div",{style:f.body},Xn(a,function(y,m){return T.createElement(Jn,{key:m,color:y,hex:y,style:f.swatch,onClick:p,onHover:n,focusStyle:{boxShadow:"0 0 4px "+y}})}),T.createElement("div",{style:f.hash},"#"),T.createElement(ze,{label:null,style:{input:f.input},value:i.replace("#",""),onChange:p}),T.createElement("div",{style:f.clear})))};Xh.propTypes={width:se.oneOfType([se.string,se.number]),triangle:se.oneOf(["hide","top-left","top-right"]),colors:se.arrayOf(se.string),styles:se.object};Xh.defaultProps={width:276,colors:["#FF6900","#FCB900","#7BDCB5","#00D084","#8ED1FC","#0693E3","#ABB8C3","#EB144C","#F78DA7","#9900EF"],triangle:"top-left",styles:{}};Lt(Xh);var Zh=function(e){var r=Ce({default:{picker:{width:"20px",height:"20px",borderRadius:"22px",border:"2px #fff solid",transform:"translate(-12px, -13px)",background:"hsl("+Math.round(e.hsl.h)+", "+Math.round(e.hsl.s*100)+"%, "+Math.round(e.hsl.l*100)+"%)"}}});return T.createElement("div",{style:r.picker})};Zh.propTypes={hsl:se.shape({h:se.number,s:se.number,l:se.number,a:se.number})};Zh.defaultProps={hsl:{a:1,h:249.94,l:.2,s:.5}};var Qh=function(e){var r=Ce({default:{picker:{width:"20px",height:"20px",borderRadius:"22px",transform:"translate(-10px, -7px)",background:"hsl("+Math.round(e.hsl.h)+", 100%, 50%)",border:"2px white solid"}}});return T.createElement("div",{style:r.picker})};Qh.propTypes={hsl:se.shape({h:se.number,s:se.number,l:se.number,a:se.number})};Qh.defaultProps={hsl:{a:1,h:249.94,l:.2,s:.5}};var QM=function(e){var r=e.onChange,n=e.rgb,i=e.hsl,a=e.hex,s=e.hsv,o=function(p,y){if(p.hex)xn(p.hex)&&r({hex:p.hex,source:"hex"},y);else if(p.rgb){var m=p.rgb.split(",");zc(p.rgb,"rgb")&&r({r:m[0],g:m[1],b:m[2],a:1,source:"rgb"},y)}else if(p.hsv){var b=p.hsv.split(",");zc(p.hsv,"hsv")&&(b[2]=b[2].replace("%",""),b[1]=b[1].replace("%",""),b[0]=b[0].replace("°",""),b[1]==1?b[1]=.01:b[2]==1&&(b[2]=.01),r({h:Number(b[0]),s:Number(b[1]),v:Number(b[2]),source:"hsv"},y))}else if(p.hsl){var v=p.hsl.split(",");zc(p.hsl,"hsl")&&(v[2]=v[2].replace("%",""),v[1]=v[1].replace("%",""),v[0]=v[0].replace("°",""),h[1]==1?h[1]=.01:h[2]==1&&(h[2]=.01),r({h:Number(v[0]),s:Number(v[1]),v:Number(v[2]),source:"hsl"},y))}},l=Ce({default:{wrap:{display:"flex",height:"100px",marginTop:"4px"},fields:{width:"100%"},column:{paddingTop:"10px",display:"flex",justifyContent:"space-between"},double:{padding:"0px 4.4px",boxSizing:"border-box"},input:{width:"100%",height:"38px",boxSizing:"border-box",padding:"4px 10% 3px",textAlign:"center",border:"1px solid #dadce0",fontSize:"11px",textTransform:"lowercase",borderRadius:"5px",outline:"none",fontFamily:"Roboto,Arial,sans-serif"},input2:{height:"38px",width:"100%",border:"1px solid #dadce0",boxSizing:"border-box",fontSize:"11px",textTransform:"lowercase",borderRadius:"5px",outline:"none",paddingLeft:"10px",fontFamily:"Roboto,Arial,sans-serif"},label:{textAlign:"center",fontSize:"12px",background:"#fff",position:"absolute",textTransform:"uppercase",color:"#3c4043",width:"35px",top:"-6px",left:"0",right:"0",marginLeft:"auto",marginRight:"auto",fontFamily:"Roboto,Arial,sans-serif"},label2:{left:"10px",textAlign:"center",fontSize:"12px",background:"#fff",position:"absolute",textTransform:"uppercase",color:"#3c4043",width:"32px",top:"-6px",fontFamily:"Roboto,Arial,sans-serif"},single:{flexGrow:"1",margin:"0px 4.4px"}}}),c=n.r+", "+n.g+", "+n.b,d=Math.round(i.h)+"°, "+Math.round(i.s*100)+"%, "+Math.round(i.l*100)+"%",h=Math.round(s.h)+"°, "+Math.round(s.s*100)+"%, "+Math.round(s.v*100)+"%";return T.createElement("div",{style:l.wrap,className:"flexbox-fix"},T.createElement("div",{style:l.fields},T.createElement("div",{style:l.double},T.createElement(ze,{style:{input:l.input,label:l.label},label:"hex",value:a,onChange:o})),T.createElement("div",{style:l.column},T.createElement("div",{style:l.single},T.createElement(ze,{style:{input:l.input2,label:l.label2},label:"rgb",value:c,onChange:o})),T.createElement("div",{style:l.single},T.createElement(ze,{style:{input:l.input2,label:l.label2},label:"hsv",value:h,onChange:o})),T.createElement("div",{style:l.single},T.createElement(ze,{style:{input:l.input2,label:l.label2},label:"hsl",value:d,onChange:o})))))},ef=function(e){var r=e.width,n=e.onChange,i=e.rgb,a=e.hsl,s=e.hsv,o=e.hex,l=e.header,c=e.styles,d=c===void 0?{}:c,h=e.className,f=h===void 0?"":h,p=Ce(zt({default:{picker:{width:r,background:"#fff",border:"1px solid #dfe1e5",boxSizing:"initial",display:"flex",flexWrap:"wrap",borderRadius:"8px 8px 0px 0px"},head:{height:"57px",width:"100%",paddingTop:"16px",paddingBottom:"16px",paddingLeft:"16px",fontSize:"20px",boxSizing:"border-box",fontFamily:"Roboto-Regular,HelveticaNeue,Arial,sans-serif"},saturation:{width:"70%",padding:"0px",position:"relative",overflow:"hidden"},swatch:{width:"30%",height:"228px",padding:"0px",background:"rgba("+i.r+", "+i.g+", "+i.b+", 1)",position:"relative",overflow:"hidden"},body:{margin:"auto",width:"95%"},controls:{display:"flex",boxSizing:"border-box",height:"52px",paddingTop:"22px"},color:{width:"32px"},hue:{height:"8px",position:"relative",margin:"0px 16px 0px 16px",width:"100%"},Hue:{radius:"2px"}}},d));return T.createElement("div",{style:p.picker,className:"google-picker "+f},T.createElement("div",{style:p.head},l),T.createElement("div",{style:p.swatch}),T.createElement("div",{style:p.saturation},T.createElement(Bl,{hsl:a,hsv:s,pointer:Zh,onChange:n})),T.createElement("div",{style:p.body},T.createElement("div",{style:p.controls,className:"flexbox-fix"},T.createElement("div",{style:p.hue},T.createElement(fa,{style:p.Hue,hsl:a,radius:"4px",pointer:Qh,onChange:n}))),T.createElement(QM,{rgb:i,hsl:a,hex:o,hsv:s,onChange:n})))};ef.propTypes={width:se.oneOfType([se.string,se.number]),styles:se.object,header:se.string};ef.defaultProps={width:652,styles:{},header:"Color picker"};Lt(ef);function ez({color:t,mode:e="blend",onColorChange:r,onClose:n}){var c;const[i,a]=z.useState((t==null?void 0:t.hex)||"#000000");z.useEffect(()=>{t!=null&&t.hex&&a(t.hex)},[t==null?void 0:t.hex]);const s=d=>{const h=d.hex;a(h),r&&r(h)},o=()=>{t!=null&&t.originalHex&&(a(t.originalHex),r&&r(t.originalHex))},l=d=>{const h=d.hex;a(h),r&&r(h)};return t?u.jsxs("div",{className:"color-editor-panel",children:[u.jsxs("div",{className:"editor-header",children:[u.jsx("h3",{children:"Edit Colour"}),u.jsx("button",{onClick:n,className:"close-button",children:"×"})]}),u.jsxs("div",{className:"editor-content",children:[u.jsxs("div",{className:"color-info-section",children:[u.jsx("div",{className:"color-display",children:u.jsxs("div",{className:"swatch-pair",children:[u.jsxs("div",{className:"swatch-group",children:[u.jsx("div",{className:"swatch original",style:{backgroundColor:t.originalHex||t.hex},title:"Original colour"}),u.jsx("span",{className:"swatch-label",children:"Original"})]}),u.jsx("span",{className:"arrow",children:"→"}),u.jsxs("div",{className:"swatch-group",children:[u.jsx("div",{className:"swatch current",style:{backgroundColor:i},title:"Current colour"}),u.jsx("span",{className:"swatch-label",children:"Current"})]})]})}),u.jsxs("div",{className:"color-details",children:[u.jsxs("div",{className:"detail-row",children:[u.jsx("span",{className:"label",children:"Hex:"}),u.jsx("span",{className:"value",children:i})]}),u.jsxs("div",{className:"detail-row",children:[u.jsx("span",{className:"label",children:"Coverage:"}),u.jsxs("span",{className:"value",children:[((c=t.areaPct)==null?void 0:c.toFixed(1))||0,"%"]})]})]})]}),u.jsxs("div",{className:"tpv-palette-section",children:[u.jsx("h4",{children:"Standard TPV Colours"}),u.jsx("p",{className:"palette-description",children:"Select a pure TPV colour (no blending required)"}),u.jsx("div",{className:"tpv-color-grid",children:ch.map(d=>u.jsxs("div",{className:`tpv-color-item ${i.toLowerCase()===d.hex.toLowerCase()?"selected":""}`,onClick:()=>l(d),title:`${d.code} - ${d.name}`,children:[u.jsx("div",{className:"tpv-color-swatch",style:{backgroundColor:d.hex}}),u.jsx("span",{className:"tpv-color-code",children:d.code})]},d.code))})]}),e==="blend"&&u.jsxs("div",{className:"picker-section",children:[u.jsx("h4",{children:"Custom Colour"}),u.jsx("p",{className:"picker-description",children:"Choose any colour (may require blending)"}),u.jsx(jM,{color:i,onChange:s,disableAlpha:!0}),u.jsx("button",{onClick:o,className:"reset-button",children:"Reset to Original Colour"})]}),e==="solid"&&u.jsxs("div",{className:"solid-mode-info",children:[u.jsx("h4",{children:"Solid Mode Editing"}),u.jsx("p",{className:"info-description",children:"In solid mode, you can only select from the standard TPV colours above. Custom colours require blending - switch to Blend Mode for full colour customisation."}),u.jsx("button",{onClick:o,className:"reset-button",children:"Reset to Original Colour"})]})]}),u.jsx("style",{jsx:!0,children:`
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
      `})]}):null}async function Gl(){var r,n;const t=await en.auth.getSession(),e=(n=(r=t==null?void 0:t.data)==null?void 0:r.session)==null?void 0:n.access_token;if(!e)throw new Error("Not authenticated");return{"Content-Type":"application/json",Authorization:`Bearer ${e}`}}async function tz(t){const e=await Gl(),r=await fetch("/api/designs/save",{method:"POST",headers:e,body:JSON.stringify(t)});if(!r.ok){const n=await r.json();throw new Error(n.error||"Failed to save design")}return r.json()}async function Im({project_id:t,limit:e=50,offset:r=0,search:n}={}){const i=await Gl(),a=new URLSearchParams;t&&a.append("project_id",t),a.append("limit",e),a.append("offset",r),n&&a.append("search",n);const s=await fetch(`/api/designs/list?${a}`,{method:"GET",headers:i});if(!s.ok){const o=await s.json();throw new Error(o.error||"Failed to list designs")}return s.json()}async function rz(t){const e=await Gl(),r=await fetch(`/api/designs/by-id?id=${t}`,{method:"GET",headers:e});if(!r.ok){const n=await r.json();throw new Error(n.error||"Failed to load design")}return r.json()}async function nz(t){const e=await Gl(),r=await fetch(`/api/designs/by-id?id=${t}`,{method:"DELETE",headers:e});if(!r.ok){const n=await r.json();throw new Error(n.error||"Failed to delete design")}return r.json()}async function Sw(){var r,n;const t=await en.auth.getSession(),e=(n=(r=t==null?void 0:t.data)==null?void 0:r.session)==null?void 0:n.access_token;if(!e)throw new Error("Not authenticated");return{"Content-Type":"application/json",Authorization:`Bearer ${e}`}}async function iz(t){const e=await Sw(),r=await fetch("/api/projects/create",{method:"POST",headers:e,body:JSON.stringify(t)});if(!r.ok){const n=await r.json();throw new Error(n.error||"Failed to create project")}return r.json()}async function kw(){const t=await Sw(),e=await fetch("/api/projects/list",{method:"GET",headers:t});if(!e.ok){const r=await e.json();throw new Error(r.error||"Failed to list projects")}return e.json()}function az(t){const{inputMode:e,prompt:r,selectedFile:n,lengthMM:i,widthMM:a,result:s,viewMode:o,blendRecipes:l,solidRecipes:c,colorMapping:d,solidColorMapping:h,solidEditedColors:f,blendEditedColors:p,blendSvgUrl:y,solidSvgUrl:m,arMapping:b,jobId:v,inSituData:g}=t;console.log("[SERIALIZE] Serializing design with result:",s),console.log("[SERIALIZE] result.svg_url:",s==null?void 0:s.svg_url),console.log("[SERIALIZE] result.png_url:",s==null?void 0:s.png_url),console.log("[SERIALIZE] result.thumbnail_url:",s==null?void 0:s.thumbnail_url);const w=S=>S?S instanceof Map?Object.fromEntries(S):S:null;return{input_mode:e,prompt:r||null,uploaded_file_url:(n==null?void 0:n.url)||null,dimensions:{widthMM:a,lengthMM:i},original_svg_url:(s==null?void 0:s.svg_url)||null,original_png_url:(s==null?void 0:s.png_url)||null,thumbnail_url:(s==null?void 0:s.thumb_url)||null,blend_recipes:l||null,solid_recipes:c||null,color_mapping:w(d),solid_color_mapping:w(h),solid_color_edits:w(f),blend_color_edits:w(p),final_blend_svg_url:y||null,final_solid_svg_url:m||null,preferred_view_mode:o||"solid",aspect_ratio_mapping:b||null,job_id:v||null,in_situ:g?{room_photo_url:g.room_photo_url||null,mask_url:g.mask_url||null,floor_dimensions_m:g.floor_dimensions_m||null,preview_url:g.preview_url||null,blend_opacity:g.blend_opacity||20,perspective_corners:g.perspective_corners||null}:null}}function sz(t){var r,n;const e=i=>i?i instanceof Map?i:new Map(Object.entries(i)):new Map;return{inputMode:t.input_mode,prompt:t.prompt||"",selectedFile:t.uploaded_file_url?{url:t.uploaded_file_url,name:t.uploaded_file_url.split("/").pop()}:null,lengthMM:((r=t.dimensions)==null?void 0:r.lengthMM)||0,widthMM:((n=t.dimensions)==null?void 0:n.widthMM)||0,result:{svg_url:t.original_svg_url,png_url:t.original_png_url,thumbnail_url:t.thumbnail_url},blendRecipes:t.blend_recipes||null,solidRecipes:t.solid_recipes||null,colorMapping:e(t.color_mapping),solidColorMapping:e(t.solid_color_mapping),solidEditedColors:e(t.solid_color_edits),blendEditedColors:e(t.blend_color_edits),blendSvgUrl:null,solidSvgUrl:null,viewMode:t.preferred_view_mode||"solid",arMapping:t.aspect_ratio_mapping,jobId:t.job_id,inSituData:t.in_situ||null,generating:!1,generatingBlends:!1,showFinalRecipes:!!t.blend_recipes,showSolidSummary:!!t.solid_recipes,colorEditorOpen:!1,selectedColor:null}}function oz(t){var r;const e=[];return t.inputMode||e.push("Input mode is required"),(!t.widthMM||!t.lengthMM)&&e.push("Surface dimensions are required"),(r=t.result)!=null&&r.svg_url||e.push("No design to save - generate a design first"),{valid:e.length===0,errors:e}}function lz({currentState:t,existingDesignId:e=null,initialName:r="",onClose:n,onSaved:i}){const[a,s]=z.useState(r),[o,l]=z.useState(""),[c,d]=z.useState(""),[h,f]=z.useState(""),[p,y]=z.useState(!1),[m,b]=z.useState([]),[v,g]=z.useState(!1),[w,S]=z.useState(""),[E,k]=z.useState("#1a365d"),[C,N]=z.useState(!1),[$,B]=z.useState(!1),[q,P]=z.useState(!1),[L,_]=z.useState(null);z.useEffect(()=>{W()},[]);const W=async()=>{try{const{projects:R}=await kw();b(R)}catch(R){console.error("Failed to load projects:",R),_("Failed to load projects")}},ue=async()=>{if(!w.trim()){_("Project name is required");return}P(!0),_(null);try{const{project:R}=await iz({name:w.trim(),color:E});b([R,...m]),d(R.id),g(!1),S(""),k("#1a365d")}catch(R){console.error("Failed to create project:",R),_(R.message)}finally{P(!1)}},X=async(R=!1)=>{if(!a.trim()){_("Design name is required");return}const G=oz(t);if(!G.valid){_(G.errors.join(", "));return}R?B(!0):N(!0),_(null);try{const A=az(t);console.log("[SAVE-MODAL] Serialized design data:",A),console.log("[SAVE-MODAL] SVG URL from serialized data:",A.original_svg_url);const I={name:a.trim(),description:o.trim()||null,project_id:c||null,tags:h.split(",").map(te=>te.trim()).filter(te=>te),is_public:p,design_data:A};console.log("[SAVE-MODAL] Full save payload:",I),e&&!R&&(I.id=e);const ae=await tz(I);i&&i(ae,a.trim()),n()}catch(A){console.error("Failed to save design:",A),_(A.message)}finally{N(!1),B(!1)}},U=["#1a365d","#ff6b35","#4a90e2","#50c878","#9b59b6","#e74c3c"];return u.jsx("div",{className:"modal-overlay",onClick:n,children:u.jsxs("div",{className:"modal-content save-design-modal",onClick:R=>R.stopPropagation(),children:[u.jsxs("div",{className:"modal-header",children:[u.jsx("h2",{children:e?"Update Design":"Save Design"}),u.jsx("button",{onClick:n,className:"close-button",children:"×"})]}),u.jsxs("div",{className:"modal-body",children:[L&&u.jsx("div",{className:"error-message",children:L}),u.jsxs("div",{className:"form-group",children:[u.jsx("label",{htmlFor:"design-name",children:"Design Name *"}),u.jsx("input",{id:"design-name",type:"text",value:a,onChange:R=>s(R.target.value),placeholder:"e.g., Playground Design A",autoFocus:!0,disabled:C||$})]}),u.jsxs("div",{className:"form-group",children:[u.jsx("label",{htmlFor:"design-description",children:"Description"}),u.jsx("textarea",{id:"design-description",value:o,onChange:R=>l(R.target.value),placeholder:"Optional notes about this design...",rows:3,disabled:C||$})]}),u.jsxs("div",{className:"form-group",children:[u.jsx("label",{htmlFor:"design-project",children:"Project"}),v?u.jsxs("div",{className:"new-project-form",children:[u.jsxs("div",{className:"input-row",children:[u.jsx("input",{type:"text",value:w,onChange:R=>S(R.target.value),placeholder:"Project name...",disabled:q}),u.jsx("div",{className:"color-picker-inline",children:U.map(R=>u.jsx("button",{type:"button",className:`color-swatch ${E===R?"active":""}`,style:{backgroundColor:R},onClick:()=>k(R),disabled:q},R))})]}),u.jsxs("div",{className:"button-row",children:[u.jsx("button",{type:"button",onClick:ue,className:"btn-primary btn-small",disabled:q,children:q?"Creating...":"Create"}),u.jsx("button",{type:"button",onClick:()=>g(!1),className:"btn-secondary btn-small",disabled:q,children:"Cancel"})]})]}):u.jsxs("div",{className:"project-selector",children:[u.jsxs("select",{id:"design-project",value:c,onChange:R=>d(R.target.value),disabled:C||$,children:[u.jsx("option",{value:"",children:"No Project"}),m.map(R=>u.jsxs("option",{value:R.id,children:[R.name," (",R.design_count," designs)"]},R.id))]}),u.jsx("button",{type:"button",onClick:()=>g(!0),className:"btn-secondary btn-small",disabled:C||$,children:"+ New Project"})]})]}),u.jsxs("div",{className:"form-group",children:[u.jsx("label",{htmlFor:"design-tags",children:"Tags"}),u.jsx("input",{id:"design-tags",type:"text",value:h,onChange:R=>f(R.target.value),placeholder:"e.g., playground, vibrant, geometric (comma-separated)",disabled:C||$}),u.jsx("small",{className:"help-text",children:"Separate tags with commas"})]}),u.jsx("div",{className:"form-group checkbox-group",children:u.jsxs("label",{children:[u.jsx("input",{type:"checkbox",checked:p,onChange:R=>y(R.target.checked),disabled:C||$}),u.jsx("span",{children:"Make this design public (shareable link)"})]})})]}),u.jsxs("div",{className:"modal-footer",children:[u.jsx("button",{onClick:n,className:"btn-secondary",disabled:C||$,children:"Cancel"}),e&&u.jsx("button",{onClick:()=>X(!0),className:"btn-secondary",disabled:C||$,children:$?"Saving...":"Save as New"}),u.jsx("button",{onClick:()=>X(!1),className:"btn-primary",disabled:C||$,children:C?"Saving...":e?"Update":"Save Design"})]})]})})}const cz="https://your-project.supabase.co",uz="";console.warn("[Supabase] Missing environment variables. Upload functionality may not work.");const Zi=ab(cz,uz,{auth:{persistSession:!1,autoRefreshToken:!1}}),dz=10*1024*1024,hz=["image/jpeg","image/png","image/jpg"];function fz({onPhotoUploaded:t,disabled:e=!1}){const[r,n]=z.useState(!1),[i,a]=z.useState(!1),[s,o]=z.useState(null),[l,c]=z.useState(null),d=z.useRef(null),h=g=>{g.preventDefault(),e||n(!0)},f=g=>{g.preventDefault(),n(!1)},p=async g=>{if(g.preventDefault(),n(!1),e)return;const w=g.dataTransfer.files;w.length>0&&await b(w[0])},y=()=>{!e&&d.current&&d.current.click()},m=async g=>{g.target.files.length>0&&await b(g.target.files[0])},b=async g=>{if(o(null),!hz.includes(g.type)){o("Please upload a JPG or PNG image");return}if(g.size>dz){o("Image must be under 10MB");return}const w=URL.createObjectURL(g);c(w),a(!0);try{const E=`in-situ-photos/${`${Date.now()}-${Math.random().toString(36).substr(2,9)}.${g.type.split("/")[1]}`}`,{data:k,error:C}=await Zi.storage.from("tpv-studio-uploads").upload(E,g,{cacheControl:"3600",upsert:!1});if(C)throw C;const{data:{publicUrl:N}}=Zi.storage.from("tpv-studio-uploads").getPublicUrl(E);console.log("[IN-SITU-UPLOADER] Photo uploaded:",N);const $=new Image;$.onload=()=>{t({url:N,width:$.naturalWidth,height:$.naturalHeight,filename:g.name})},$.src=N}catch(S){console.error("[IN-SITU-UPLOADER] Upload failed:",S),o(S.message||"Upload failed"),URL.revokeObjectURL(w),c(null)}finally{a(!1)}},v=()=>{l&&URL.revokeObjectURL(l),c(null),o(null)};return u.jsxs("div",{className:"in-situ-uploader",children:[l?u.jsxs("div",{className:"preview-container",children:[u.jsx("img",{src:l,alt:"Site preview",className:"preview-image"}),i&&u.jsxs("div",{className:"upload-overlay",children:[u.jsx("div",{className:"upload-spinner"}),u.jsx("p",{children:"Uploading..."})]}),!i&&u.jsx("button",{className:"clear-button",onClick:v,title:"Remove photo",children:u.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[u.jsx("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),u.jsx("line",{x1:"6",y1:"6",x2:"18",y2:"18"})]})})]}):u.jsxs("div",{className:`upload-zone ${r?"dragging":""} ${e?"disabled":""}`,onDragOver:h,onDragLeave:f,onDrop:p,onClick:y,children:[u.jsx("input",{ref:d,type:"file",accept:"image/jpeg,image/png",onChange:m,style:{display:"none"},disabled:e}),u.jsx("div",{className:"upload-icon",children:u.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[u.jsx("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}),u.jsx("polyline",{points:"17 8 12 3 7 8"}),u.jsx("line",{x1:"12",y1:"3",x2:"12",y2:"15"})]})}),u.jsxs("div",{className:"upload-text",children:[u.jsx("p",{className:"primary",children:r?"Drop photo here":"Upload site photo"}),u.jsx("p",{className:"secondary",children:"Drag & drop or click to browse"}),u.jsx("p",{className:"hint",children:"JPG or PNG, max 10MB"})]})]}),s&&u.jsx("div",{className:"error-message",children:s}),u.jsx("style",{children:`
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
      `})]})}function pz(t,e){const[r,n,i,a,s,o,l,c]=t,[d,h,f,p,y,m,b,v]=e,g=[[r,n,1,0,0,0,-d*r,-d*n],[0,0,0,r,n,1,-h*r,-h*n],[i,a,1,0,0,0,-f*i,-f*a],[0,0,0,i,a,1,-p*i,-p*a],[s,o,1,0,0,0,-y*s,-y*o],[0,0,0,s,o,1,-m*s,-m*o],[l,c,1,0,0,0,-b*l,-b*c],[0,0,0,l,c,1,-v*l,-v*c]],S=gz(g,[d,h,f,p,y,m,b,v]);return function(k,C){const N=S[6]*k+S[7]*C+1,$=(S[0]*k+S[1]*C+S[2])/N,B=(S[3]*k+S[4]*C+S[5])/N;return[$,B]}}function gz(t,e){const r=t.length,n=t.map((a,s)=>[...a,e[s]]);for(let a=0;a<r;a++){let s=a;for(let o=a+1;o<r;o++)Math.abs(n[o][a])>Math.abs(n[s][a])&&(s=o);[n[a],n[s]]=[n[s],n[a]];for(let o=a+1;o<r;o++){const l=n[o][a]/n[a][a];for(let c=a;c<=r;c++)n[o][c]-=l*n[a][c]}}const i=new Array(r);for(let a=r-1;a>=0;a--){i[a]=n[a][r];for(let s=a+1;s<r;s++)i[a]-=n[a][s]*i[s];i[a]/=n[a][a]}return i}function tf(t){return new Promise((e,r)=>{const n=new Image;n.crossOrigin="anonymous",n.onload=()=>e(n),n.onerror=()=>r(new Error(`Failed to load image: ${t}`)),n.src=t})}async function Ew(t,e=1536){const r=await tf(t),{naturalWidth:n,naturalHeight:i}=r,a=Math.min(1,e/Math.max(n,i)),s=Math.round(n*a),o=Math.round(i*a),l=document.createElement("canvas");return l.width=s,l.height=o,l.getContext("2d").drawImage(r,0,0,s,o),new Promise((d,h)=>{const f=new Image;f.onload=()=>d(f),f.onerror=h,f.src=l.toDataURL("image/png")})}function jw({photoCtx:t,photoImg:e,designImg:r,quad:n,opacity:i,shape:a,lighting:s}){const o=t.canvas;t.clearRect(0,0,o.width,o.height),t.drawImage(e,0,0,o.width,o.height);const l=r.width,c=r.height,d=[0,0,l,0,l,c,0,c],h=[n[0].x,n[0].y,n[1].x,n[1].y,n[2].x,n[2].y,n[3].x,n[3].y],f=pz(d,h),p=10,y=l/p,m=c/p,b=document.createElement("canvas");if(b.width=l,b.height=c,b.getContext("2d").drawImage(r,0,0),t.save(),t.globalAlpha=i,s&&s.enabled){const w=s.strength||.6,S=1+(s.baseBrightness-1)*w,E=1+(s.baseContrast-1)*w;t.filter=`brightness(${S}) contrast(${E})`}const g=a&&a.length>=3?a:n;t.beginPath(),t.moveTo(g[0].x,g[0].y);for(let w=1;w<g.length;w++)t.lineTo(g[w].x,g[w].y);t.closePath(),t.clip();for(let w=0;w<p;w++)for(let S=0;S<p;S++){const E=w*y,k=S*m,C=(w+1)*y,N=(S+1)*m,$=f(E,k),B=f(C,k),q=f(C,N),P=f(E,N);Dm(t,b,E,k,C,k,E,N,$[0],$[1],B[0],B[1],P[0],P[1]),Dm(t,b,C,k,C,N,E,N,B[0],B[1],q[0],q[1],P[0],P[1])}t.restore()}function Dm(t,e,r,n,i,a,s,o,l,c,d,h,f,p){t.save(),t.beginPath(),t.moveTo(l,c),t.lineTo(d,h),t.lineTo(f,p),t.closePath(),t.clip();const y=(r-s)*(a-o)-(i-s)*(n-o);if(Math.abs(y)<.001){t.restore();return}const m=((l-f)*(a-o)-(d-f)*(n-o))/y,b=((c-p)*(a-o)-(h-p)*(n-o))/y,v=((r-s)*(d-f)-(i-s)*(l-f))/y,g=((r-s)*(h-p)-(i-s)*(c-p))/y,w=l-m*r-v*n,S=c-b*r-g*n;t.setTransform(m,b,v,g,w,S),t.drawImage(e,0,0),t.restore()}function mz(t,e="tpv-in-situ-preview.png"){t.toBlob(r=>{const n=URL.createObjectURL(r),i=document.createElement("a");i.href=n,i.download=e,document.body.appendChild(i),i.click(),document.body.removeChild(i),URL.revokeObjectURL(n)},"image/png")}function vz(t,e,r,n){const i=r/n,a=t*.6,s=e*.6;let o,l;i>a/s?(o=a,l=a/i):(l=s,o=s*i);const c=(t-o)/2,d=(e-l)/2;return[{x:c,y:d},{x:c+o,y:d},{x:c+o,y:d+l},{x:c,y:d+l}]}function yz(t,e,r){let n=!1;for(let i=0,a=r.length-1;i<r.length;a=i++){const s=r[i].x,o=r[i].y,l=r[a].x,c=r[a].y;o>e!=c>e&&t<(l-s)*(e-o)/(c-o)+s&&(n=!n)}return n}function bz(t,e,r){t/=255,e/=255,r/=255;const n=Math.max(t,e,r),i=Math.min(t,e,r),a=(n+i)/2;if(n===i)return{h:0,s:0,l:a};const s=n-i,o=a>.5?s/(2-n-i):s/(n+i);let l;switch(n){case t:l=((e-r)/s+(e<r?6:0))/6;break;case e:l=((r-t)/s+2)/6;break;case r:l=((t-e)/s+4)/6;break}return{h:l,s:o,l:a}}function wz(t,e,r=2e3){if(!t||!e||e.length<3)return{avgLightness:.5,avgContrastProxy:.5};const n=Math.floor(Math.min(...e.map(g=>g.x))),i=Math.ceil(Math.max(...e.map(g=>g.x))),a=Math.floor(Math.min(...e.map(g=>g.y))),s=Math.ceil(Math.max(...e.map(g=>g.y))),o=i-n,l=s-a;if(o<=0||l<=0)return{avgLightness:.5,avgContrastProxy:.5};let c;try{c=t.getImageData(n,a,o,l)}catch(g){return console.warn("[LIGHTING] Failed to get image data:",g),{avgLightness:.5,avgContrastProxy:.5}}const d=c.data,h=[];let f=0;const p=r*5;for(;h.length<r&&f<p;){f++;const g=n+Math.random()*o,w=a+Math.random()*l;if(!yz(g,w,e))continue;const S=Math.floor(g-n),k=(Math.floor(w-a)*o+S)*4;if(k<0||k>=d.length-3)continue;const C=d[k],N=d[k+1],$=d[k+2],{l:B}=bz(C,N,$);h.push(B)}if(h.length===0)return{avgLightness:.5,avgContrastProxy:.5};const y=h.reduce((g,w)=>g+w,0)/h.length,m=h.reduce((g,w)=>g+Math.pow(w-y,2),0)/h.length,b=Math.sqrt(m),v=Math.min(1,b/.25);return{avgLightness:y,avgContrastProxy:v}}function xz(t){let e=1,r=1;const i=t.avgLightness-.5;return e+=i*.6,r+=(t.avgContrastProxy-.5)*.4,e=Math.max(.7,Math.min(1.3,e)),r=Math.max(.8,Math.min(1.25,r)),{brightness:e,contrast:r}}const _z=100;function Sz({photoUrl:t,svgUrl:e,designSizeMm:r,initialQuad:n,initialShape:i,initialOpacity:a=.8,initialLighting:s,onChange:o}){const[l,c]=z.useState(null),[d,h]=z.useState(null),[f,p]=z.useState(n||null),[y,m]=z.useState(i||null),[b,v]=z.useState(Math.max(.3,Math.min(1,a))),[g,w]=z.useState(s||{enabled:!1,strength:.6,baseBrightness:1,baseContrast:1}),[S,E]=z.useState(!0),[k,C]=z.useState(null),[N,$]=z.useState(1),[B,q]=z.useState("corners"),[P,L]=z.useState(null),[_,W]=z.useState(!1),[ue,X]=z.useState(null),[U,R]=z.useState(null),G=z.useRef(null),A=z.useRef(null),I=z.useRef(null),[ae,te]=z.useState([]),ee=20;z.useEffect(()=>{he()},[t,e]),z.useEffect(()=>{l&&d&&f&&$e()},[l,d,f,y,b,g,B,P,_,U]),z.useEffect(()=>{if(!l||!f||f.length!==4)return;const M=document.createElement("canvas");M.width=l.naturalWidth,M.height=l.naturalHeight;const J=M.getContext("2d");J.drawImage(l,0,0);const Q=wz(J,f),{brightness:ge,contrast:Te}=xz(Q);w(Oe=>({...Oe,baseBrightness:ge,baseContrast:Te}))},[l,JSON.stringify(f)]),z.useEffect(()=>{const M=J=>{if(B==="shape"&&(J.key==="Delete"||J.key==="Backspace")&&U!==null&&y&&y.length>3){J.preventDefault();const Q=y.filter((ge,Te)=>Te!==U);m(Q),R(null),we(f,b,Q)}};return window.addEventListener("keydown",M),()=>window.removeEventListener("keydown",M)},[B,U,y,f,b]);const he=async()=>{var M;E(!0),C(null);try{const[J,Q]=await Promise.all([tf(t),Ew(e,1536)]);c(J),h(Q);const ge=((M=A.current)==null?void 0:M.clientWidth)||800,Te=500,Oe=ge/J.naturalWidth,Re=Te/J.naturalHeight,fe=Math.min(1,Oe,Re);if($(fe),!n){const Ie=vz(J.naturalWidth,J.naturalHeight,r.width_mm,r.length_mm);p(Ie)}}catch(J){console.error("[FOUR-POINT] Failed to load images:",J),C(J.message)}finally{E(!1)}},$e=()=>{const M=G.current;if(!M||!l||!d||!f)return;M.width=l.naturalWidth,M.height=l.naturalHeight;const J=M.getContext("2d");jw({photoCtx:J,photoImg:l,designImg:d,quad:f,opacity:b,shape:y,lighting:g}),ye(J)},ye=M=>{if(!f)return;M.setTransform(1,0,0,1,0,0);const J=Math.max(8,Math.min(15,l.naturalWidth/80));if(B==="corners"){M.strokeStyle="rgba(255, 255, 255, 0.8)",M.lineWidth=2,M.setLineDash([5,5]),M.beginPath(),M.moveTo(f[0].x,f[0].y),M.lineTo(f[1].x,f[1].y),M.lineTo(f[2].x,f[2].y),M.lineTo(f[3].x,f[3].y),M.closePath(),M.stroke(),M.setLineDash([]);const Q=["TL","TR","BR","BL"];f.forEach((ge,Te)=>{M.beginPath(),M.arc(ge.x,ge.y,J,0,Math.PI*2),M.fillStyle=P===Te?"#ff6b35":"rgba(255, 107, 53, 0.9)",M.fill(),M.strokeStyle="white",M.lineWidth=2,M.stroke(),M.fillStyle="white",M.font="10px sans-serif",M.textAlign="center",M.textBaseline="middle",M.fillText(Q[Te],ge.x,ge.y)})}else{const Q=y||f;M.strokeStyle="rgba(34, 197, 94, 0.8)",M.lineWidth=2,M.setLineDash([]),M.beginPath(),M.moveTo(Q[0].x,Q[0].y);for(let ge=1;ge<Q.length;ge++)M.lineTo(Q[ge].x,Q[ge].y);M.closePath(),M.stroke(),Q.forEach((ge,Te)=>{M.beginPath(),M.arc(ge.x,ge.y,J*.8,0,Math.PI*2),U===Te?M.fillStyle="#22c55e":P===Te?M.fillStyle="#16a34a":M.fillStyle="rgba(34, 197, 94, 0.9)",M.fill(),M.strokeStyle="white",M.lineWidth=2,M.stroke()}),M.strokeStyle="rgba(255, 107, 53, 0.3)",M.lineWidth=1,M.setLineDash([3,3]),M.beginPath(),M.moveTo(f[0].x,f[0].y),M.lineTo(f[1].x,f[1].y),M.lineTo(f[2].x,f[2].y),M.lineTo(f[3].x,f[3].y),M.closePath(),M.stroke(),M.setLineDash([])}},we=z.useCallback((M,J,Q,ge)=>{I.current&&clearTimeout(I.current),I.current=setTimeout(()=>{o&&o({quad:M,opacity:J,shape:Q,lighting:ge||g})},_z)},[o,g]),xe=z.useCallback(()=>{te(M=>{const J=[...M,{quad:[...f],shape:y?[...y]:null,opacity:b,lighting:{...g}}];return J.length>ee?J.slice(-ee):J})},[f,y,b,g]),Ee=()=>{if(ae.length===0)return;const M=ae[ae.length-1];te(J=>J.slice(0,-1)),p(M.quad),m(M.shape),v(M.opacity),w(M.lighting),we(M.quad,M.opacity,M.shape,M.lighting)},Me=(M,J)=>({x:M/N,y:J/N}),Be=(M,J,Q)=>{if(!Q)return-1;const ge=25/N;for(let Te=0;Te<Q.length;Te++){const Oe=Q[Te].x-M,Re=Q[Te].y-J;if(Math.sqrt(Oe*Oe+Re*Re)<ge)return Te}return-1},x=(M,J,Q)=>{if(!Q||Q.length<3)return!1;let ge=!1;for(let Te=0,Oe=Q.length-1;Te<Q.length;Oe=Te++){const Re=Q[Te].x,fe=Q[Te].y,Ie=Q[Oe].x,Le=Q[Oe].y;fe>J!=Le>J&&M<(Ie-Re)*(J-fe)/(Le-fe)+Re&&(ge=!ge)}return ge},K=M=>{if(B!=="shape"||!y||y.length<=3)return;const J=G.current;if(!J)return;const Q=J.getBoundingClientRect(),ge=M.clientX-Q.left,Te=M.clientY-Q.top,{x:Oe,y:Re}=Me(ge,Te),fe=Be(Oe,Re,y);if(fe>=0){xe();const Ie=y.filter((Ge,We)=>We!==fe);m(Ie),R(null);const Le=D(f,Ie);Le!==f?(p(Le),we(Le,b,Ie)):we(f,b,Ie)}},H=M=>{const J=G.current;if(!J)return;const Q=J.getBoundingClientRect(),ge=M.clientX-Q.left,Te=M.clientY-Q.top,{x:Oe,y:Re}=Me(ge,Te);if(B==="corners"){const fe=Be(Oe,Re,f);fe>=0?(xe(),L(fe),J.setPointerCapture(M.pointerId)):x(Oe,Re,f)&&(xe(),W(!0),X({x:Oe,y:Re}),J.setPointerCapture(M.pointerId))}else{const fe=y||f,Ie=Be(Oe,Re,fe);if(Ie>=0)xe(),L(Ie),R(Ie),J.setPointerCapture(M.pointerId);else{xe();let Le=0,Ge=1/0;for(let Ue=0;Ue<fe.length;Ue++){const rt=(Ue+1)%fe.length,ut=Z(Oe,Re,fe[Ue].x,fe[Ue].y,fe[rt].x,fe[rt].y);ut<Ge&&(Ge=ut,Le=rt)}const We={x:Oe,y:Re},ot=[...fe];ot.splice(Le,0,We),m(ot),R(Le);const je=D(f,ot);je!==f?(p(je),we(je,b,ot)):we(f,b,ot)}}},O=M=>{if(P===null&&!_)return;const J=G.current;if(!J)return;const Q=J.getBoundingClientRect(),ge=M.clientX-Q.left,Te=M.clientY-Q.top,{x:Oe,y:Re}=Me(ge,Te),fe=Math.max(0,Math.min(l.naturalWidth,Oe)),Ie=Math.max(0,Math.min(l.naturalHeight,Re));if(B==="corners"){if(_&&ue){const Le=fe-ue.x,Ge=Ie-ue.y,We=f.map(je=>({x:Math.max(0,Math.min(l.naturalWidth,je.x+Le)),y:Math.max(0,Math.min(l.naturalHeight,je.y+Ge))}));let ot=y;y&&(ot=y.map(je=>({x:Math.max(0,Math.min(l.naturalWidth,je.x+Le)),y:Math.max(0,Math.min(l.naturalHeight,je.y+Ge))})),m(ot)),p(We),X({x:fe,y:Ie}),we(We,b,ot)}else if(P!==null){const Le=[...f];Le[P]={x:fe,y:Ie},p(Le),we(Le,b,y)}}else{const Ge=[...y||f];Ge[P]={x:fe,y:Ie},m(Ge),we(f,b,Ge)}},j=M=>{if(P!==null||_){const J=G.current;if(J&&J.releasePointerCapture(M.pointerId),B==="shape"&&y&&P!==null){const Q=D(f,y);Q!==f&&(p(Q),we(Q,b,y))}L(null),W(!1),X(null)}},D=(M,J)=>{if(!J||J.length<3||!M)return M;const Q=M.reduce((je,Ue)=>je+Ue.x,0)/4,ge=M.reduce((je,Ue)=>je+Ue.y,0)/4,Te=J.reduce((je,Ue)=>je+Ue.x,0)/J.length,Oe=J.reduce((je,Ue)=>je+Ue.y,0)/J.length;let Re=1;for(const je of J){const Ue=je.x-Q,rt=je.y-ge,ut=Math.sqrt(Ue*Ue+rt*rt);if(ut<1)continue;const Nt=Y(Q,ge,Ue,rt,M);if(Nt>0&&ut>Nt){const Zn=ut/Nt;Re=Math.max(Re,Zn)}}let fe=1/0;for(const je of J){const Ue=je.x-Q,rt=je.y-ge,ut=Math.sqrt(Ue*Ue+rt*rt);if(ut<1)continue;const Nt=Y(Q,ge,Ue,rt,M);if(Nt>0){const Zn=ut/Nt;fe=Math.min(fe,Zn)}}let Ie=Re;if(Re<=1&&fe<1/0&&(Ie=fe),Math.abs(Ie-1)<.01)return M;const Le=M.map(je=>({x:Q+(je.x-Q)*Ie,y:ge+(je.y-ge)*Ie})),Ge=Te-Q,We=Oe-ge;return Le.map(je=>({x:je.x+Ge,y:je.y+We}))},Y=(M,J,Q,ge,Te)=>{let Oe=1/0;for(let Re=0;Re<4;Re++){const fe=Te[Re],Ie=Te[(Re+1)%4],Le=Ie.x-fe.x,Ge=Ie.y-fe.y,We=Q*Ge-ge*Le;if(Math.abs(We)<1e-4)continue;const ot=((fe.x-M)*Ge-(fe.y-J)*Le)/We,je=((fe.x-M)*ge-(fe.y-J)*Q)/We;ot>0&&je>=0&&je<=1&&(Oe=Math.min(Oe,ot*Math.sqrt(Q*Q+ge*ge)))}return Oe===1/0?0:Oe},Z=(M,J,Q,ge,Te,Oe)=>{const Re=M-Q,fe=J-ge,Ie=Te-Q,Le=Oe-ge,Ge=Re*Ie+fe*Le,We=Ie*Ie+Le*Le;let ot=We!==0?Ge/We:-1,je,Ue;return ot<0?(je=Q,Ue=ge):ot>1?(je=Te,Ue=Oe):(je=Q+ot*Ie,Ue=ge+ot*Le),Math.sqrt((M-je)**2+(J-Ue)**2)},F=()=>{B==="corners"?(y||m([...f]),q("shape"),R(null)):(q("corners"),R(null))},ne=M=>{const J=Math.max(.3,Math.min(1,parseFloat(M.target.value)/100));v(J),we(f,J,y)},ce=M=>{const J={...g,enabled:M.target.checked};w(J),we(f,b,y,J)},ie=M=>{const J={...g,strength:parseFloat(M.target.value)/100};w(J),we(f,b,y,J)};return S?u.jsxs("div",{className:"four-point-editor loading",children:[u.jsx("div",{className:"spinner"}),u.jsx("p",{children:"Loading preview..."})]}):k?u.jsx("div",{className:"four-point-editor error",children:u.jsxs("p",{children:["Failed to load: ",k]})}):u.jsxs("div",{className:"four-point-editor",ref:A,children:[u.jsxs("div",{className:"editor-header",children:[u.jsx("h3",{children:"Position Your Design"}),u.jsx("p",{className:"instructions",children:B==="corners"?"Drag the corner handles to position the TPV design on your photo.":"Click to add vertices, drag to move them. Double-click to delete a vertex."})]}),u.jsx("div",{className:"canvas-container",children:u.jsx("canvas",{ref:G,onPointerDown:H,onPointerMove:O,onPointerUp:j,onPointerLeave:j,onDoubleClick:K,style:{width:`${((l==null?void 0:l.naturalWidth)||800)*N}px`,height:`${((l==null?void 0:l.naturalHeight)||600)*N}px`,cursor:P!==null||_?"grabbing":B==="shape"?"crosshair":"move",touchAction:"none"}})}),u.jsxs("div",{className:"controls",children:[u.jsxs("div",{className:"mode-toggle",children:[u.jsx("button",{className:`toggle-btn ${B==="corners"?"active":""}`,onClick:()=>q("corners"),children:"Corners"}),u.jsx("button",{className:`toggle-btn ${B==="shape"?"active":""}`,onClick:F,children:"Refine Shape"}),u.jsx("button",{className:"toggle-btn undo-btn",onClick:Ee,disabled:ae.length===0,title:"Undo last change",children:"Undo"})]}),u.jsxs("div",{className:"opacity-control",children:[u.jsxs("label",{children:["Overlay Opacity",u.jsxs("span",{className:"value",children:[Math.round(b*100),"%"]})]}),u.jsx("input",{type:"range",min:"30",max:"100",value:Math.round(b*100),onChange:ne})]}),u.jsxs("div",{className:"lighting-control",children:[u.jsxs("label",{className:"checkbox-label",children:[u.jsx("input",{type:"checkbox",checked:g.enabled,onChange:ce}),"Match floor lighting"]}),g.enabled&&u.jsxs("div",{className:"lighting-slider",children:[u.jsxs("label",{children:["Strength",u.jsxs("span",{className:"value",children:[Math.round(g.strength*100),"%"]})]}),u.jsx("input",{type:"range",min:"0",max:"100",value:Math.round(g.strength*100),onChange:ie})]})]})]}),u.jsx("style",{children:`
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

        .editor-header h3 {
          margin: 0 0 0.5rem;
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
      `})]})}const _r={UPLOAD:"upload",POSITION:"position"};function kz({designUrl:t,designDimensions:e,onClose:r,onSaved:n}){const[i,a]=z.useState(_r.UPLOAD),[s,o]=z.useState(null),[l,c]=z.useState(null),[d,h]=z.useState(null),[f,p]=z.useState(.8),[y,m]=z.useState({enabled:!1,strength:.6,baseBrightness:1,baseContrast:1}),[b,v]=z.useState(!1),g=z.useRef(null);z.useEffect(()=>{if(t){const $=new Image;$.crossOrigin="anonymous",$.src=t}},[t]);const w=$=>{console.log("[IN-SITU] Photo uploaded:",$),o($),a(_r.POSITION)},S=({quad:$,opacity:B,shape:q,lighting:P})=>{c($),p(B),h(q),P&&m(P)},E=async()=>{if(!s||!l)return null;const[$,B]=await Promise.all([tf(s.url),Ew(t,1536)]),q=document.createElement("canvas");q.width=$.naturalWidth,q.height=$.naturalHeight;const P=q.getContext("2d");return jw({photoCtx:P,photoImg:$,designImg:B,quad:l,opacity:f,shape:d,lighting:y}),q},k=async()=>{const $=await E();$&&mz($,"tpv-in-situ-preview.png")},C=async()=>{if(!(!l||!s)){v(!0);try{const $=await E();if(!$)throw new Error("Failed to generate preview");const B=await new Promise(W=>$.toBlob(W,"image/png")),P=`in-situ-previews/${`${Date.now()}-${Math.random().toString(36).substr(2,9)}.png`}`,{error:L}=await Zi.storage.from("tpv-studio-uploads").upload(P,B,{contentType:"image/png",cacheControl:"3600"});if(L)throw L;const{data:{publicUrl:_}}=Zi.storage.from("tpv-studio-uploads").getPublicUrl(P);n&&n({photo_url:s.url,quad:l,shape:d,opacity:f,lighting:y,preview_url:_}),r()}catch($){console.error("[IN-SITU] Save failed:",$),alert("Failed to save preview: "+$.message)}finally{v(!1)}}},N=()=>{switch(i){case _r.UPLOAD:return"Upload Site Photo";case _r.POSITION:return"Position Your Design";default:return"In-Situ Preview"}};return u.jsxs("div",{className:"modal-overlay in-situ-modal-overlay",onClick:r,children:[u.jsxs("div",{className:"modal-content in-situ-modal",onClick:$=>$.stopPropagation(),children:[u.jsxs("div",{className:"modal-header",children:[u.jsxs("div",{className:"header-left",children:[u.jsx("h2",{children:N()}),u.jsxs("div",{className:"step-indicator",children:[u.jsx("span",{className:i===_r.UPLOAD?"active":"completed",children:"1. Upload"}),u.jsx("span",{className:i===_r.POSITION?"active":"",children:"2. Position"})]})]}),u.jsx("button",{onClick:r,className:"close-button",children:"×"})]}),u.jsxs("div",{className:"modal-body",children:[i===_r.UPLOAD&&u.jsxs("div",{className:"upload-step",children:[u.jsx("p",{className:"step-description",children:"Upload a photo of your site to see how your TPV design will look when installed. For best results, use a photo taken from above or at a slight angle showing the floor area clearly."}),u.jsx(fz,{onPhotoUploaded:w})]}),i===_r.POSITION&&s&&u.jsx(Sz,{ref:g,photoUrl:s.url,svgUrl:t,designSizeMm:{width_mm:e.width,length_mm:e.length},initialOpacity:.8,onChange:S})]}),i===_r.POSITION&&u.jsxs("div",{className:"modal-footer",children:[u.jsx("button",{onClick:()=>a(_r.UPLOAD),className:"btn-secondary",children:"Back"}),u.jsxs("div",{className:"footer-actions",children:[u.jsx("button",{onClick:k,disabled:!l,className:"btn-secondary",children:"Download PNG"}),u.jsx("button",{onClick:C,disabled:!l||b,className:"btn-primary",children:b?"Saving...":"Save to Project"})]})]})]}),u.jsx("style",{children:`
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
      `})]})}function Ez({isOpen:t,onClose:e,onConfirm:r,aspectRatio:n,defaultLongestSide:i=5e3}){const[a,s]=z.useState(i),[o,l]=z.useState(i/1e3),d=(m=>{if(!n||n<=0)return{width:m,length:m};if(n>=1){const b=m,v=Math.round(m/n);return{width:b,length:v}}else{const b=m;return{width:Math.round(m*n),length:b}}})(a),h=n>=1?"landscape":"portrait",f=n>=1?`${n.toFixed(1)}:1`:`1:${(1/n).toFixed(1)}`,p=m=>{const b=parseFloat(m.target.value)||0;l(b),s(Math.round(b*1e3))},y=()=>{r(d.width,d.length),e()};return t?u.jsxs(u.Fragment,{children:[u.jsx("div",{className:"dimension-modal-overlay",onClick:e,children:u.jsxs("div",{className:"dimension-modal",onClick:m=>m.stopPropagation(),children:[u.jsxs("div",{className:"dimension-modal-header",children:[u.jsx("h2",{children:"Set Installation Size"}),u.jsx("button",{className:"dimension-modal-close",onClick:e,"aria-label":"Close",children:"×"})]}),u.jsxs("div",{className:"dimension-modal-body",children:[u.jsx("div",{className:"dimension-info",children:u.jsxs("p",{className:"dimension-aspect",children:["Your design has a ",u.jsxs("strong",{children:[f," ",h]})," aspect ratio"]})}),u.jsxs("div",{className:"dimension-input-group",children:[u.jsx("label",{htmlFor:"longest-dimension",children:"Installation Size (Longest Side)"}),u.jsxs("div",{className:"dimension-input-wrapper",children:[u.jsx("input",{id:"longest-dimension",type:"number",min:"0.1",max:"50",step:"0.1",value:o,onChange:p,className:"dimension-input"}),u.jsx("span",{className:"dimension-unit",children:"meters"})]}),u.jsx("p",{className:"dimension-help",children:"Specify how large you want to install this design"})]}),u.jsxs("div",{className:"dimension-preview",children:[u.jsx("div",{className:"dimension-preview-title",children:"Calculated Dimensions:"}),u.jsxs("div",{className:"dimension-preview-values",children:[u.jsxs("div",{className:"dimension-preview-item",children:[u.jsx("span",{className:"dimension-preview-label",children:"Width:"}),u.jsxs("span",{className:"dimension-preview-value",children:[(d.width/1e3).toFixed(2),"m"]})]}),u.jsxs("div",{className:"dimension-preview-item",children:[u.jsx("span",{className:"dimension-preview-label",children:"Length:"}),u.jsxs("span",{className:"dimension-preview-value",children:[(d.length/1e3).toFixed(2),"m"]})]}),u.jsxs("div",{className:"dimension-preview-item",children:[u.jsx("span",{className:"dimension-preview-label",children:"Total Area:"}),u.jsxs("span",{className:"dimension-preview-value",children:[(d.width*d.length/1e6).toFixed(2),"m²"]})]})]})]}),u.jsxs("div",{className:"dimension-note",children:[u.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[u.jsx("circle",{cx:"8",cy:"8",r:"7"}),u.jsx("line",{x1:"8",y1:"11",x2:"8",y2:"8"}),u.jsx("circle",{cx:"8",cy:"5",r:"0.5",fill:"currentColor"})]}),u.jsx("p",{children:"These dimensions will be used to calculate material quantities for your PDF specification and to slice your design into 1m×1m installation tiles."})]})]}),u.jsxs("div",{className:"dimension-modal-footer",children:[u.jsx("button",{className:"dimension-btn dimension-btn-secondary",onClick:e,children:"Cancel"}),u.jsx("button",{className:"dimension-btn dimension-btn-primary",onClick:y,disabled:o<=0,children:"Confirm Size"})]})]})}),u.jsx("style",{children:`
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
      `})]}):null}function Mm(t){const e=new Map;for(const r of t){const n=r.originalColor.hex.toLowerCase(),i=r.targetColor.hex.toLowerCase(),a=r.chosenRecipe.id,s=r.chosenRecipe.deltaE,o=r.targetColor.areaPct;e.set(n,{blendHex:i,recipeId:a,deltaE:s,coverage:o,quality:r.chosenRecipe.quality,components:r.chosenRecipe.components})}return e}function jz(t){return t.replace("#","").toLowerCase()}async function ai(t,e){try{console.log("[SVG-RECOLOR] Fetching SVG from:",t);const r=await fetch(t);if(!r.ok)throw new Error(`Failed to fetch SVG: ${r.status} ${r.statusText}`);const n=await r.text();console.log(`[SVG-RECOLOR] Fetched SVG (${n.length} chars)`);const a=new DOMParser().parseFromString(n,"image/svg+xml"),s=a.querySelector("parsererror");if(s)throw new Error(`SVG parse error: ${s.textContent}`);const o=a.documentElement;if(o.tagName!=="svg")throw new Error("Invalid SVG: root element is not <svg>");const l=Cz(o,e);console.log("[SVG-RECOLOR] Recoloring complete:",l);const d=new XMLSerializer().serializeToString(a),h=new Blob([d],{type:"image/svg+xml"});return{dataUrl:URL.createObjectURL(h),svgText:d,stats:l}}catch(r){throw console.error("[SVG-RECOLOR] Error:",r),r}}function Cz(t,e){const r={totalElements:0,fillsReplaced:0,strokesReplaced:0,stopColorsReplaced:0,stylesProcessed:0,colorsNotMapped:new Set},n=t.querySelectorAll("*");r.totalElements=n.length;for(const s of n){const o=s.getAttribute("fill");if(o&&o!=="none"){const h=Er(o,e,r.colorsNotMapped);h!==o&&(s.setAttribute("fill",h),r.fillsReplaced++)}const l=s.getAttribute("stroke");if(l&&l!=="none"){const h=Er(l,e,r.colorsNotMapped);h!==l&&(s.setAttribute("stroke",h),r.strokesReplaced++)}const c=s.getAttribute("stop-color");if(c&&c!=="none"){const h=Er(c,e,r.colorsNotMapped);h!==c&&(s.setAttribute("stop-color",h),r.stopColorsReplaced++)}const d=s.getAttribute("style");if(d){const h=Lm(d,e,r);h!==d&&(s.setAttribute("style",h),r.stylesProcessed++)}}const i=t.querySelectorAll("style");for(const s of i){const o=s.textContent,l=Oz(o,e,r);l!==o&&(s.textContent=l,r.stylesProcessed++)}const a=t.querySelectorAll("stop");for(const s of a){const o=s.getAttribute("stop-color");if(o&&o!=="none"){const c=Er(o,e,r.colorsNotMapped);c!==o&&(s.setAttribute("stop-color",c),r.stopColorsReplaced++)}const l=s.getAttribute("style");if(l&&l.includes("stop-color")){const c=Lm(l,e,r);c!==l&&(s.setAttribute("style",c),r.stylesProcessed++)}}return r}function Er(t,e,r){const n=Pz(t);if(!n)return t;const i=`#${n}`,a=e.get(i);if(a)return a.blendHex;const s=zm(n);if(s)for(const[o,l]of e.entries()){const c=zm(o.replace("#",""));if(c&&Tz(s,c))return l.blendHex}return r&&r.add(t),t}function zm(t){if(t.length!==6)return null;const e=parseInt(t.substring(0,2),16),r=parseInt(t.substring(2,4),16),n=parseInt(t.substring(4,6),16);return isNaN(e)||isNaN(r)||isNaN(n)?null:{r:e,g:r,b:n}}function Tz(t,e){return Math.abs(t.r-e.r)<=50&&Math.abs(t.g-e.g)<=50&&Math.abs(t.b-e.b)<=50}function Lm(t,e,r){let n=t;return n=n.replace(/fill:\s*([^;]+)/gi,(i,a)=>`fill: ${Er(a.trim(),e,r.colorsNotMapped)}`),n=n.replace(/stroke:\s*([^;]+)/gi,(i,a)=>`stroke: ${Er(a.trim(),e,r.colorsNotMapped)}`),n=n.replace(/stop-color:\s*([^;]+)/gi,(i,a)=>`stop-color: ${Er(a.trim(),e,r.colorsNotMapped)}`),n}function Oz(t,e,r){let n=t;return n=n.replace(/fill:\s*([^;}\s]+)/gi,(i,a)=>`fill: ${Er(a.trim(),e,r.colorsNotMapped)}`),n=n.replace(/stroke:\s*([^;}\s]+)/gi,(i,a)=>`stroke: ${Er(a.trim(),e,r.colorsNotMapped)}`),n=n.replace(/stop-color:\s*([^;}\s]+)/gi,(i,a)=>`stop-color: ${Er(a.trim(),e,r.colorsNotMapped)}`),n}function Pz(t){const e=t.trim().toLowerCase();if(e.match(/^#?[0-9a-f]{6}$/))return jz(e);const r=e.match(/^#?([0-9a-f]{3})$/);if(r)return r[1].split("").map(s=>s+s).join("");const n=e.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);if(n){const a=parseInt(n[1],10),s=parseInt(n[2],10),o=parseInt(n[3],10);return Nz(a,s,o)}const i={white:"ffffff",black:"000000",red:"ff0000",green:"008000",blue:"0000ff",yellow:"ffff00",cyan:"00ffff",magenta:"ff00ff",gray:"808080",grey:"808080",orange:"ffa500",purple:"800080"};return i[e]?i[e]:null}function Nz(t,e,r){const n=i=>Math.max(0,Math.min(255,i)).toString(16).padStart(2,"0");return`${n(t)}${n(e)}${n(r)}`}const Fm={landscape:[{name:"1:1",ratio:1,width:1024,height:1024},{name:"4:3",ratio:4/3,width:1024,height:768},{name:"3:2",ratio:3/2,width:1024,height:683},{name:"16:9",ratio:16/9,width:1024,height:576},{name:"2:1",ratio:2,width:1024,height:512},{name:"3:1",ratio:3,width:1024,height:341}],portrait:[{name:"1:1",ratio:1,width:1024,height:1024},{name:"3:4",ratio:3/4,width:768,height:1024},{name:"2:3",ratio:2/3,width:683,height:1024},{name:"9:16",ratio:9/16,width:576,height:1024},{name:"1:2",ratio:1/2,width:512,height:1024},{name:"1:3",ratio:1/3,width:341,height:1024}]},Ta={safeDifference:.3,tilingThreshold:3.5,framingThreshold:2.5};function $z(t,e){return t/e}function Rz(t){return t>=.95&&t<=1.05?"square":t>1?"landscape":"portrait"}function Az(t,e){const r=e==="portrait"?Fm.portrait:Fm.landscape;let n=r[0],i=Math.abs(t-n.ratio);for(const a of r){const s=Math.abs(t-a.ratio);s<i&&(i=s,n=a)}return{...n,difference:i}}function Iz(t,e,r){return t>=Ta.tilingThreshold||t<=1/Ta.tilingThreshold?{mode:"tiling",reason:"Extreme aspect ratio - design will repeat along length",warning:!0}:r>=Ta.safeDifference||t>=Ta.framingThreshold||t<=1/Ta.framingThreshold?{mode:"framing",reason:"Design panel centered with base color surround",warning:!1}:{mode:"full",reason:"Design fills entire surface",warning:!1}}function Dz(t,e){const r=$z(t,e),n=Rz(r),i=Az(r,n),a=Iz(r,i.ratio,i.difference);return{user:{widthMM:t,heightMM:e,aspectRatio:r,orientation:n,formatted:`${(t/1e3).toFixed(1)}m × ${(e/1e3).toFixed(1)}m`},canonical:{name:i.name,ratio:i.ratio,width:i.width,height:i.height,difference:i.difference},layout:a,recraft:{width:i.width,height:i.height,metadata:{targetWidthMM:t,targetHeightMM:e,layoutMode:a.mode}}}}function Mz(t){const{user:e,canonical:r,layout:n}=t;let i=`Generating ${r.name} design panel`;return n.mode==="full"?i+=` (fills ${e.formatted} surface)`:n.mode==="framing"?i+=` (centered in ${e.formatted} surface with base color surround)`:n.mode==="tiling"&&(i+=` (will repeat along ${e.formatted} surface)`),i}function zz(t){return t.layout.warning||t.layout.mode!=="full"}async function Bm(t,e="tpv-studio-uploads"){try{const r=Date.now(),n=Math.random().toString(36).substring(7),i=t.name.split(".").pop(),s=`uploads/${`${r}-${n}.${i}`}`;console.log("[Upload] Uploading file:",t.name,"→",s);const{data:o,error:l}=await Zi.storage.from(e).upload(s,t,{cacheControl:"3600",upsert:!1});if(l)return console.error("[Upload] Error:",l),{success:!1,error:l.message||"Failed to upload file"};const{data:{publicUrl:c}}=Zi.storage.from(e).getPublicUrl(s);return console.log("[Upload] Success:",c),{success:!0,url:c,path:s}}catch(r){return console.error("[Upload] Unexpected error:",r),{success:!1,error:r.message||"Unexpected error during upload"}}}function Um(t,e={}){const{maxSizeMB:r=10,allowedTypes:n=["image/png","image/jpeg","image/svg+xml"]}=e;if(!t)return{valid:!1,error:"No file selected"};if(!n.includes(t.type))return{valid:!1,error:`Invalid file type. Allowed: ${n.map(s=>s.split("/")[1].toUpperCase()).join(", ")}`};const i=r*1024*1024;return t.size>i?{valid:!1,error:`File too large. Maximum size: ${r}MB`}:{valid:!0}}function uo(t){throw new Error('Could not dynamically require "'+t+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Cw={exports:{}};/*!

JSZip v3.10.1 - A JavaScript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/main/LICENSE.markdown.

JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/main/LICENSE
*/(function(t,e){(function(r){t.exports=r()})(function(){return function r(n,i,a){function s(c,d){if(!i[c]){if(!n[c]){var h=typeof uo=="function"&&uo;if(!d&&h)return h(c,!0);if(o)return o(c,!0);var f=new Error("Cannot find module '"+c+"'");throw f.code="MODULE_NOT_FOUND",f}var p=i[c]={exports:{}};n[c][0].call(p.exports,function(y){var m=n[c][1][y];return s(m||y)},p,p.exports,r,n,i,a)}return i[c].exports}for(var o=typeof uo=="function"&&uo,l=0;l<a.length;l++)s(a[l]);return s}({1:[function(r,n,i){var a=r("./utils"),s=r("./support"),o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";i.encode=function(l){for(var c,d,h,f,p,y,m,b=[],v=0,g=l.length,w=g,S=a.getTypeOf(l)!=="string";v<l.length;)w=g-v,h=S?(c=l[v++],d=v<g?l[v++]:0,v<g?l[v++]:0):(c=l.charCodeAt(v++),d=v<g?l.charCodeAt(v++):0,v<g?l.charCodeAt(v++):0),f=c>>2,p=(3&c)<<4|d>>4,y=1<w?(15&d)<<2|h>>6:64,m=2<w?63&h:64,b.push(o.charAt(f)+o.charAt(p)+o.charAt(y)+o.charAt(m));return b.join("")},i.decode=function(l){var c,d,h,f,p,y,m=0,b=0,v="data:";if(l.substr(0,v.length)===v)throw new Error("Invalid base64 input, it looks like a data url.");var g,w=3*(l=l.replace(/[^A-Za-z0-9+/=]/g,"")).length/4;if(l.charAt(l.length-1)===o.charAt(64)&&w--,l.charAt(l.length-2)===o.charAt(64)&&w--,w%1!=0)throw new Error("Invalid base64 input, bad content length.");for(g=s.uint8array?new Uint8Array(0|w):new Array(0|w);m<l.length;)c=o.indexOf(l.charAt(m++))<<2|(f=o.indexOf(l.charAt(m++)))>>4,d=(15&f)<<4|(p=o.indexOf(l.charAt(m++)))>>2,h=(3&p)<<6|(y=o.indexOf(l.charAt(m++))),g[b++]=c,p!==64&&(g[b++]=d),y!==64&&(g[b++]=h);return g}},{"./support":30,"./utils":32}],2:[function(r,n,i){var a=r("./external"),s=r("./stream/DataWorker"),o=r("./stream/Crc32Probe"),l=r("./stream/DataLengthProbe");function c(d,h,f,p,y){this.compressedSize=d,this.uncompressedSize=h,this.crc32=f,this.compression=p,this.compressedContent=y}c.prototype={getContentWorker:function(){var d=new s(a.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new l("data_length")),h=this;return d.on("end",function(){if(this.streamInfo.data_length!==h.uncompressedSize)throw new Error("Bug : uncompressed data size mismatch")}),d},getCompressedWorker:function(){return new s(a.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize",this.compressedSize).withStreamInfo("uncompressedSize",this.uncompressedSize).withStreamInfo("crc32",this.crc32).withStreamInfo("compression",this.compression)}},c.createWorkerFrom=function(d,h,f){return d.pipe(new o).pipe(new l("uncompressedSize")).pipe(h.compressWorker(f)).pipe(new l("compressedSize")).withStreamInfo("compression",h)},n.exports=c},{"./external":6,"./stream/Crc32Probe":25,"./stream/DataLengthProbe":26,"./stream/DataWorker":27}],3:[function(r,n,i){var a=r("./stream/GenericWorker");i.STORE={magic:"\0\0",compressWorker:function(){return new a("STORE compression")},uncompressWorker:function(){return new a("STORE decompression")}},i.DEFLATE=r("./flate")},{"./flate":7,"./stream/GenericWorker":28}],4:[function(r,n,i){var a=r("./utils"),s=function(){for(var o,l=[],c=0;c<256;c++){o=c;for(var d=0;d<8;d++)o=1&o?3988292384^o>>>1:o>>>1;l[c]=o}return l}();n.exports=function(o,l){return o!==void 0&&o.length?a.getTypeOf(o)!=="string"?function(c,d,h,f){var p=s,y=f+h;c^=-1;for(var m=f;m<y;m++)c=c>>>8^p[255&(c^d[m])];return-1^c}(0|l,o,o.length,0):function(c,d,h,f){var p=s,y=f+h;c^=-1;for(var m=f;m<y;m++)c=c>>>8^p[255&(c^d.charCodeAt(m))];return-1^c}(0|l,o,o.length,0):0}},{"./utils":32}],5:[function(r,n,i){i.base64=!1,i.binary=!1,i.dir=!1,i.createFolders=!0,i.date=null,i.compression=null,i.compressionOptions=null,i.comment=null,i.unixPermissions=null,i.dosPermissions=null},{}],6:[function(r,n,i){var a=null;a=typeof Promise<"u"?Promise:r("lie"),n.exports={Promise:a}},{lie:37}],7:[function(r,n,i){var a=typeof Uint8Array<"u"&&typeof Uint16Array<"u"&&typeof Uint32Array<"u",s=r("pako"),o=r("./utils"),l=r("./stream/GenericWorker"),c=a?"uint8array":"array";function d(h,f){l.call(this,"FlateWorker/"+h),this._pako=null,this._pakoAction=h,this._pakoOptions=f,this.meta={}}i.magic="\b\0",o.inherits(d,l),d.prototype.processChunk=function(h){this.meta=h.meta,this._pako===null&&this._createPako(),this._pako.push(o.transformTo(c,h.data),!1)},d.prototype.flush=function(){l.prototype.flush.call(this),this._pako===null&&this._createPako(),this._pako.push([],!0)},d.prototype.cleanUp=function(){l.prototype.cleanUp.call(this),this._pako=null},d.prototype._createPako=function(){this._pako=new s[this._pakoAction]({raw:!0,level:this._pakoOptions.level||-1});var h=this;this._pako.onData=function(f){h.push({data:f,meta:h.meta})}},i.compressWorker=function(h){return new d("Deflate",h)},i.uncompressWorker=function(){return new d("Inflate",{})}},{"./stream/GenericWorker":28,"./utils":32,pako:38}],8:[function(r,n,i){function a(p,y){var m,b="";for(m=0;m<y;m++)b+=String.fromCharCode(255&p),p>>>=8;return b}function s(p,y,m,b,v,g){var w,S,E=p.file,k=p.compression,C=g!==c.utf8encode,N=o.transformTo("string",g(E.name)),$=o.transformTo("string",c.utf8encode(E.name)),B=E.comment,q=o.transformTo("string",g(B)),P=o.transformTo("string",c.utf8encode(B)),L=$.length!==E.name.length,_=P.length!==B.length,W="",ue="",X="",U=E.dir,R=E.date,G={crc32:0,compressedSize:0,uncompressedSize:0};y&&!m||(G.crc32=p.crc32,G.compressedSize=p.compressedSize,G.uncompressedSize=p.uncompressedSize);var A=0;y&&(A|=8),C||!L&&!_||(A|=2048);var I=0,ae=0;U&&(I|=16),v==="UNIX"?(ae=798,I|=function(ee,he){var $e=ee;return ee||($e=he?16893:33204),(65535&$e)<<16}(E.unixPermissions,U)):(ae=20,I|=function(ee){return 63&(ee||0)}(E.dosPermissions)),w=R.getUTCHours(),w<<=6,w|=R.getUTCMinutes(),w<<=5,w|=R.getUTCSeconds()/2,S=R.getUTCFullYear()-1980,S<<=4,S|=R.getUTCMonth()+1,S<<=5,S|=R.getUTCDate(),L&&(ue=a(1,1)+a(d(N),4)+$,W+="up"+a(ue.length,2)+ue),_&&(X=a(1,1)+a(d(q),4)+P,W+="uc"+a(X.length,2)+X);var te="";return te+=`
\0`,te+=a(A,2),te+=k.magic,te+=a(w,2),te+=a(S,2),te+=a(G.crc32,4),te+=a(G.compressedSize,4),te+=a(G.uncompressedSize,4),te+=a(N.length,2),te+=a(W.length,2),{fileRecord:h.LOCAL_FILE_HEADER+te+N+W,dirRecord:h.CENTRAL_FILE_HEADER+a(ae,2)+te+a(q.length,2)+"\0\0\0\0"+a(I,4)+a(b,4)+N+W+q}}var o=r("../utils"),l=r("../stream/GenericWorker"),c=r("../utf8"),d=r("../crc32"),h=r("../signature");function f(p,y,m,b){l.call(this,"ZipFileWorker"),this.bytesWritten=0,this.zipComment=y,this.zipPlatform=m,this.encodeFileName=b,this.streamFiles=p,this.accumulate=!1,this.contentBuffer=[],this.dirRecords=[],this.currentSourceOffset=0,this.entriesCount=0,this.currentFile=null,this._sources=[]}o.inherits(f,l),f.prototype.push=function(p){var y=p.meta.percent||0,m=this.entriesCount,b=this._sources.length;this.accumulate?this.contentBuffer.push(p):(this.bytesWritten+=p.data.length,l.prototype.push.call(this,{data:p.data,meta:{currentFile:this.currentFile,percent:m?(y+100*(m-b-1))/m:100}}))},f.prototype.openedSource=function(p){this.currentSourceOffset=this.bytesWritten,this.currentFile=p.file.name;var y=this.streamFiles&&!p.file.dir;if(y){var m=s(p,y,!1,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);this.push({data:m.fileRecord,meta:{percent:0}})}else this.accumulate=!0},f.prototype.closedSource=function(p){this.accumulate=!1;var y=this.streamFiles&&!p.file.dir,m=s(p,y,!0,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);if(this.dirRecords.push(m.dirRecord),y)this.push({data:function(b){return h.DATA_DESCRIPTOR+a(b.crc32,4)+a(b.compressedSize,4)+a(b.uncompressedSize,4)}(p),meta:{percent:100}});else for(this.push({data:m.fileRecord,meta:{percent:0}});this.contentBuffer.length;)this.push(this.contentBuffer.shift());this.currentFile=null},f.prototype.flush=function(){for(var p=this.bytesWritten,y=0;y<this.dirRecords.length;y++)this.push({data:this.dirRecords[y],meta:{percent:100}});var m=this.bytesWritten-p,b=function(v,g,w,S,E){var k=o.transformTo("string",E(S));return h.CENTRAL_DIRECTORY_END+"\0\0\0\0"+a(v,2)+a(v,2)+a(g,4)+a(w,4)+a(k.length,2)+k}(this.dirRecords.length,m,p,this.zipComment,this.encodeFileName);this.push({data:b,meta:{percent:100}})},f.prototype.prepareNextSource=function(){this.previous=this._sources.shift(),this.openedSource(this.previous.streamInfo),this.isPaused?this.previous.pause():this.previous.resume()},f.prototype.registerPrevious=function(p){this._sources.push(p);var y=this;return p.on("data",function(m){y.processChunk(m)}),p.on("end",function(){y.closedSource(y.previous.streamInfo),y._sources.length?y.prepareNextSource():y.end()}),p.on("error",function(m){y.error(m)}),this},f.prototype.resume=function(){return!!l.prototype.resume.call(this)&&(!this.previous&&this._sources.length?(this.prepareNextSource(),!0):this.previous||this._sources.length||this.generatedError?void 0:(this.end(),!0))},f.prototype.error=function(p){var y=this._sources;if(!l.prototype.error.call(this,p))return!1;for(var m=0;m<y.length;m++)try{y[m].error(p)}catch{}return!0},f.prototype.lock=function(){l.prototype.lock.call(this);for(var p=this._sources,y=0;y<p.length;y++)p[y].lock()},n.exports=f},{"../crc32":4,"../signature":23,"../stream/GenericWorker":28,"../utf8":31,"../utils":32}],9:[function(r,n,i){var a=r("../compressions"),s=r("./ZipFileWorker");i.generateWorker=function(o,l,c){var d=new s(l.streamFiles,c,l.platform,l.encodeFileName),h=0;try{o.forEach(function(f,p){h++;var y=function(g,w){var S=g||w,E=a[S];if(!E)throw new Error(S+" is not a valid compression method !");return E}(p.options.compression,l.compression),m=p.options.compressionOptions||l.compressionOptions||{},b=p.dir,v=p.date;p._compressWorker(y,m).withStreamInfo("file",{name:f,dir:b,date:v,comment:p.comment||"",unixPermissions:p.unixPermissions,dosPermissions:p.dosPermissions}).pipe(d)}),d.entriesCount=h}catch(f){d.error(f)}return d}},{"../compressions":3,"./ZipFileWorker":8}],10:[function(r,n,i){function a(){if(!(this instanceof a))return new a;if(arguments.length)throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");this.files=Object.create(null),this.comment=null,this.root="",this.clone=function(){var s=new a;for(var o in this)typeof this[o]!="function"&&(s[o]=this[o]);return s}}(a.prototype=r("./object")).loadAsync=r("./load"),a.support=r("./support"),a.defaults=r("./defaults"),a.version="3.10.1",a.loadAsync=function(s,o){return new a().loadAsync(s,o)},a.external=r("./external"),n.exports=a},{"./defaults":5,"./external":6,"./load":11,"./object":15,"./support":30}],11:[function(r,n,i){var a=r("./utils"),s=r("./external"),o=r("./utf8"),l=r("./zipEntries"),c=r("./stream/Crc32Probe"),d=r("./nodejsUtils");function h(f){return new s.Promise(function(p,y){var m=f.decompressed.getContentWorker().pipe(new c);m.on("error",function(b){y(b)}).on("end",function(){m.streamInfo.crc32!==f.decompressed.crc32?y(new Error("Corrupted zip : CRC32 mismatch")):p()}).resume()})}n.exports=function(f,p){var y=this;return p=a.extend(p||{},{base64:!1,checkCRC32:!1,optimizedBinaryString:!1,createFolders:!1,decodeFileName:o.utf8decode}),d.isNode&&d.isStream(f)?s.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")):a.prepareContent("the loaded zip file",f,!0,p.optimizedBinaryString,p.base64).then(function(m){var b=new l(p);return b.load(m),b}).then(function(m){var b=[s.Promise.resolve(m)],v=m.files;if(p.checkCRC32)for(var g=0;g<v.length;g++)b.push(h(v[g]));return s.Promise.all(b)}).then(function(m){for(var b=m.shift(),v=b.files,g=0;g<v.length;g++){var w=v[g],S=w.fileNameStr,E=a.resolve(w.fileNameStr);y.file(E,w.decompressed,{binary:!0,optimizedBinaryString:!0,date:w.date,dir:w.dir,comment:w.fileCommentStr.length?w.fileCommentStr:null,unixPermissions:w.unixPermissions,dosPermissions:w.dosPermissions,createFolders:p.createFolders}),w.dir||(y.file(E).unsafeOriginalName=S)}return b.zipComment.length&&(y.comment=b.zipComment),y})}},{"./external":6,"./nodejsUtils":14,"./stream/Crc32Probe":25,"./utf8":31,"./utils":32,"./zipEntries":33}],12:[function(r,n,i){var a=r("../utils"),s=r("../stream/GenericWorker");function o(l,c){s.call(this,"Nodejs stream input adapter for "+l),this._upstreamEnded=!1,this._bindStream(c)}a.inherits(o,s),o.prototype._bindStream=function(l){var c=this;(this._stream=l).pause(),l.on("data",function(d){c.push({data:d,meta:{percent:0}})}).on("error",function(d){c.isPaused?this.generatedError=d:c.error(d)}).on("end",function(){c.isPaused?c._upstreamEnded=!0:c.end()})},o.prototype.pause=function(){return!!s.prototype.pause.call(this)&&(this._stream.pause(),!0)},o.prototype.resume=function(){return!!s.prototype.resume.call(this)&&(this._upstreamEnded?this.end():this._stream.resume(),!0)},n.exports=o},{"../stream/GenericWorker":28,"../utils":32}],13:[function(r,n,i){var a=r("readable-stream").Readable;function s(o,l,c){a.call(this,l),this._helper=o;var d=this;o.on("data",function(h,f){d.push(h)||d._helper.pause(),c&&c(f)}).on("error",function(h){d.emit("error",h)}).on("end",function(){d.push(null)})}r("../utils").inherits(s,a),s.prototype._read=function(){this._helper.resume()},n.exports=s},{"../utils":32,"readable-stream":16}],14:[function(r,n,i){n.exports={isNode:typeof Buffer<"u",newBufferFrom:function(a,s){if(Buffer.from&&Buffer.from!==Uint8Array.from)return Buffer.from(a,s);if(typeof a=="number")throw new Error('The "data" argument must not be a number');return new Buffer(a,s)},allocBuffer:function(a){if(Buffer.alloc)return Buffer.alloc(a);var s=new Buffer(a);return s.fill(0),s},isBuffer:function(a){return Buffer.isBuffer(a)},isStream:function(a){return a&&typeof a.on=="function"&&typeof a.pause=="function"&&typeof a.resume=="function"}}},{}],15:[function(r,n,i){function a(E,k,C){var N,$=o.getTypeOf(k),B=o.extend(C||{},d);B.date=B.date||new Date,B.compression!==null&&(B.compression=B.compression.toUpperCase()),typeof B.unixPermissions=="string"&&(B.unixPermissions=parseInt(B.unixPermissions,8)),B.unixPermissions&&16384&B.unixPermissions&&(B.dir=!0),B.dosPermissions&&16&B.dosPermissions&&(B.dir=!0),B.dir&&(E=v(E)),B.createFolders&&(N=b(E))&&g.call(this,N,!0);var q=$==="string"&&B.binary===!1&&B.base64===!1;C&&C.binary!==void 0||(B.binary=!q),(k instanceof h&&k.uncompressedSize===0||B.dir||!k||k.length===0)&&(B.base64=!1,B.binary=!0,k="",B.compression="STORE",$="string");var P=null;P=k instanceof h||k instanceof l?k:y.isNode&&y.isStream(k)?new m(E,k):o.prepareContent(E,k,B.binary,B.optimizedBinaryString,B.base64);var L=new f(E,P,B);this.files[E]=L}var s=r("./utf8"),o=r("./utils"),l=r("./stream/GenericWorker"),c=r("./stream/StreamHelper"),d=r("./defaults"),h=r("./compressedObject"),f=r("./zipObject"),p=r("./generate"),y=r("./nodejsUtils"),m=r("./nodejs/NodejsStreamInputAdapter"),b=function(E){E.slice(-1)==="/"&&(E=E.substring(0,E.length-1));var k=E.lastIndexOf("/");return 0<k?E.substring(0,k):""},v=function(E){return E.slice(-1)!=="/"&&(E+="/"),E},g=function(E,k){return k=k!==void 0?k:d.createFolders,E=v(E),this.files[E]||a.call(this,E,null,{dir:!0,createFolders:k}),this.files[E]};function w(E){return Object.prototype.toString.call(E)==="[object RegExp]"}var S={load:function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},forEach:function(E){var k,C,N;for(k in this.files)N=this.files[k],(C=k.slice(this.root.length,k.length))&&k.slice(0,this.root.length)===this.root&&E(C,N)},filter:function(E){var k=[];return this.forEach(function(C,N){E(C,N)&&k.push(N)}),k},file:function(E,k,C){if(arguments.length!==1)return E=this.root+E,a.call(this,E,k,C),this;if(w(E)){var N=E;return this.filter(function(B,q){return!q.dir&&N.test(B)})}var $=this.files[this.root+E];return $&&!$.dir?$:null},folder:function(E){if(!E)return this;if(w(E))return this.filter(function($,B){return B.dir&&E.test($)});var k=this.root+E,C=g.call(this,k),N=this.clone();return N.root=C.name,N},remove:function(E){E=this.root+E;var k=this.files[E];if(k||(E.slice(-1)!=="/"&&(E+="/"),k=this.files[E]),k&&!k.dir)delete this.files[E];else for(var C=this.filter(function($,B){return B.name.slice(0,E.length)===E}),N=0;N<C.length;N++)delete this.files[C[N].name];return this},generate:function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},generateInternalStream:function(E){var k,C={};try{if((C=o.extend(E||{},{streamFiles:!1,compression:"STORE",compressionOptions:null,type:"",platform:"DOS",comment:null,mimeType:"application/zip",encodeFileName:s.utf8encode})).type=C.type.toLowerCase(),C.compression=C.compression.toUpperCase(),C.type==="binarystring"&&(C.type="string"),!C.type)throw new Error("No output type specified.");o.checkSupport(C.type),C.platform!=="darwin"&&C.platform!=="freebsd"&&C.platform!=="linux"&&C.platform!=="sunos"||(C.platform="UNIX"),C.platform==="win32"&&(C.platform="DOS");var N=C.comment||this.comment||"";k=p.generateWorker(this,C,N)}catch($){(k=new l("error")).error($)}return new c(k,C.type||"string",C.mimeType)},generateAsync:function(E,k){return this.generateInternalStream(E).accumulate(k)},generateNodeStream:function(E,k){return(E=E||{}).type||(E.type="nodebuffer"),this.generateInternalStream(E).toNodejsStream(k)}};n.exports=S},{"./compressedObject":2,"./defaults":5,"./generate":9,"./nodejs/NodejsStreamInputAdapter":12,"./nodejsUtils":14,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31,"./utils":32,"./zipObject":35}],16:[function(r,n,i){n.exports=r("stream")},{stream:void 0}],17:[function(r,n,i){var a=r("./DataReader");function s(o){a.call(this,o);for(var l=0;l<this.data.length;l++)o[l]=255&o[l]}r("../utils").inherits(s,a),s.prototype.byteAt=function(o){return this.data[this.zero+o]},s.prototype.lastIndexOfSignature=function(o){for(var l=o.charCodeAt(0),c=o.charCodeAt(1),d=o.charCodeAt(2),h=o.charCodeAt(3),f=this.length-4;0<=f;--f)if(this.data[f]===l&&this.data[f+1]===c&&this.data[f+2]===d&&this.data[f+3]===h)return f-this.zero;return-1},s.prototype.readAndCheckSignature=function(o){var l=o.charCodeAt(0),c=o.charCodeAt(1),d=o.charCodeAt(2),h=o.charCodeAt(3),f=this.readData(4);return l===f[0]&&c===f[1]&&d===f[2]&&h===f[3]},s.prototype.readData=function(o){if(this.checkOffset(o),o===0)return[];var l=this.data.slice(this.zero+this.index,this.zero+this.index+o);return this.index+=o,l},n.exports=s},{"../utils":32,"./DataReader":18}],18:[function(r,n,i){var a=r("../utils");function s(o){this.data=o,this.length=o.length,this.index=0,this.zero=0}s.prototype={checkOffset:function(o){this.checkIndex(this.index+o)},checkIndex:function(o){if(this.length<this.zero+o||o<0)throw new Error("End of data reached (data length = "+this.length+", asked index = "+o+"). Corrupted zip ?")},setIndex:function(o){this.checkIndex(o),this.index=o},skip:function(o){this.setIndex(this.index+o)},byteAt:function(){},readInt:function(o){var l,c=0;for(this.checkOffset(o),l=this.index+o-1;l>=this.index;l--)c=(c<<8)+this.byteAt(l);return this.index+=o,c},readString:function(o){return a.transformTo("string",this.readData(o))},readData:function(){},lastIndexOfSignature:function(){},readAndCheckSignature:function(){},readDate:function(){var o=this.readInt(4);return new Date(Date.UTC(1980+(o>>25&127),(o>>21&15)-1,o>>16&31,o>>11&31,o>>5&63,(31&o)<<1))}},n.exports=s},{"../utils":32}],19:[function(r,n,i){var a=r("./Uint8ArrayReader");function s(o){a.call(this,o)}r("../utils").inherits(s,a),s.prototype.readData=function(o){this.checkOffset(o);var l=this.data.slice(this.zero+this.index,this.zero+this.index+o);return this.index+=o,l},n.exports=s},{"../utils":32,"./Uint8ArrayReader":21}],20:[function(r,n,i){var a=r("./DataReader");function s(o){a.call(this,o)}r("../utils").inherits(s,a),s.prototype.byteAt=function(o){return this.data.charCodeAt(this.zero+o)},s.prototype.lastIndexOfSignature=function(o){return this.data.lastIndexOf(o)-this.zero},s.prototype.readAndCheckSignature=function(o){return o===this.readData(4)},s.prototype.readData=function(o){this.checkOffset(o);var l=this.data.slice(this.zero+this.index,this.zero+this.index+o);return this.index+=o,l},n.exports=s},{"../utils":32,"./DataReader":18}],21:[function(r,n,i){var a=r("./ArrayReader");function s(o){a.call(this,o)}r("../utils").inherits(s,a),s.prototype.readData=function(o){if(this.checkOffset(o),o===0)return new Uint8Array(0);var l=this.data.subarray(this.zero+this.index,this.zero+this.index+o);return this.index+=o,l},n.exports=s},{"../utils":32,"./ArrayReader":17}],22:[function(r,n,i){var a=r("../utils"),s=r("../support"),o=r("./ArrayReader"),l=r("./StringReader"),c=r("./NodeBufferReader"),d=r("./Uint8ArrayReader");n.exports=function(h){var f=a.getTypeOf(h);return a.checkSupport(f),f!=="string"||s.uint8array?f==="nodebuffer"?new c(h):s.uint8array?new d(a.transformTo("uint8array",h)):new o(a.transformTo("array",h)):new l(h)}},{"../support":30,"../utils":32,"./ArrayReader":17,"./NodeBufferReader":19,"./StringReader":20,"./Uint8ArrayReader":21}],23:[function(r,n,i){i.LOCAL_FILE_HEADER="PK",i.CENTRAL_FILE_HEADER="PK",i.CENTRAL_DIRECTORY_END="PK",i.ZIP64_CENTRAL_DIRECTORY_LOCATOR="PK\x07",i.ZIP64_CENTRAL_DIRECTORY_END="PK",i.DATA_DESCRIPTOR="PK\x07\b"},{}],24:[function(r,n,i){var a=r("./GenericWorker"),s=r("../utils");function o(l){a.call(this,"ConvertWorker to "+l),this.destType=l}s.inherits(o,a),o.prototype.processChunk=function(l){this.push({data:s.transformTo(this.destType,l.data),meta:l.meta})},n.exports=o},{"../utils":32,"./GenericWorker":28}],25:[function(r,n,i){var a=r("./GenericWorker"),s=r("../crc32");function o(){a.call(this,"Crc32Probe"),this.withStreamInfo("crc32",0)}r("../utils").inherits(o,a),o.prototype.processChunk=function(l){this.streamInfo.crc32=s(l.data,this.streamInfo.crc32||0),this.push(l)},n.exports=o},{"../crc32":4,"../utils":32,"./GenericWorker":28}],26:[function(r,n,i){var a=r("../utils"),s=r("./GenericWorker");function o(l){s.call(this,"DataLengthProbe for "+l),this.propName=l,this.withStreamInfo(l,0)}a.inherits(o,s),o.prototype.processChunk=function(l){if(l){var c=this.streamInfo[this.propName]||0;this.streamInfo[this.propName]=c+l.data.length}s.prototype.processChunk.call(this,l)},n.exports=o},{"../utils":32,"./GenericWorker":28}],27:[function(r,n,i){var a=r("../utils"),s=r("./GenericWorker");function o(l){s.call(this,"DataWorker");var c=this;this.dataIsReady=!1,this.index=0,this.max=0,this.data=null,this.type="",this._tickScheduled=!1,l.then(function(d){c.dataIsReady=!0,c.data=d,c.max=d&&d.length||0,c.type=a.getTypeOf(d),c.isPaused||c._tickAndRepeat()},function(d){c.error(d)})}a.inherits(o,s),o.prototype.cleanUp=function(){s.prototype.cleanUp.call(this),this.data=null},o.prototype.resume=function(){return!!s.prototype.resume.call(this)&&(!this._tickScheduled&&this.dataIsReady&&(this._tickScheduled=!0,a.delay(this._tickAndRepeat,[],this)),!0)},o.prototype._tickAndRepeat=function(){this._tickScheduled=!1,this.isPaused||this.isFinished||(this._tick(),this.isFinished||(a.delay(this._tickAndRepeat,[],this),this._tickScheduled=!0))},o.prototype._tick=function(){if(this.isPaused||this.isFinished)return!1;var l=null,c=Math.min(this.max,this.index+16384);if(this.index>=this.max)return this.end();switch(this.type){case"string":l=this.data.substring(this.index,c);break;case"uint8array":l=this.data.subarray(this.index,c);break;case"array":case"nodebuffer":l=this.data.slice(this.index,c)}return this.index=c,this.push({data:l,meta:{percent:this.max?this.index/this.max*100:0}})},n.exports=o},{"../utils":32,"./GenericWorker":28}],28:[function(r,n,i){function a(s){this.name=s||"default",this.streamInfo={},this.generatedError=null,this.extraStreamInfo={},this.isPaused=!0,this.isFinished=!1,this.isLocked=!1,this._listeners={data:[],end:[],error:[]},this.previous=null}a.prototype={push:function(s){this.emit("data",s)},end:function(){if(this.isFinished)return!1;this.flush();try{this.emit("end"),this.cleanUp(),this.isFinished=!0}catch(s){this.emit("error",s)}return!0},error:function(s){return!this.isFinished&&(this.isPaused?this.generatedError=s:(this.isFinished=!0,this.emit("error",s),this.previous&&this.previous.error(s),this.cleanUp()),!0)},on:function(s,o){return this._listeners[s].push(o),this},cleanUp:function(){this.streamInfo=this.generatedError=this.extraStreamInfo=null,this._listeners=[]},emit:function(s,o){if(this._listeners[s])for(var l=0;l<this._listeners[s].length;l++)this._listeners[s][l].call(this,o)},pipe:function(s){return s.registerPrevious(this)},registerPrevious:function(s){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.streamInfo=s.streamInfo,this.mergeStreamInfo(),this.previous=s;var o=this;return s.on("data",function(l){o.processChunk(l)}),s.on("end",function(){o.end()}),s.on("error",function(l){o.error(l)}),this},pause:function(){return!this.isPaused&&!this.isFinished&&(this.isPaused=!0,this.previous&&this.previous.pause(),!0)},resume:function(){if(!this.isPaused||this.isFinished)return!1;var s=this.isPaused=!1;return this.generatedError&&(this.error(this.generatedError),s=!0),this.previous&&this.previous.resume(),!s},flush:function(){},processChunk:function(s){this.push(s)},withStreamInfo:function(s,o){return this.extraStreamInfo[s]=o,this.mergeStreamInfo(),this},mergeStreamInfo:function(){for(var s in this.extraStreamInfo)Object.prototype.hasOwnProperty.call(this.extraStreamInfo,s)&&(this.streamInfo[s]=this.extraStreamInfo[s])},lock:function(){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.isLocked=!0,this.previous&&this.previous.lock()},toString:function(){var s="Worker "+this.name;return this.previous?this.previous+" -> "+s:s}},n.exports=a},{}],29:[function(r,n,i){var a=r("../utils"),s=r("./ConvertWorker"),o=r("./GenericWorker"),l=r("../base64"),c=r("../support"),d=r("../external"),h=null;if(c.nodestream)try{h=r("../nodejs/NodejsStreamOutputAdapter")}catch{}function f(y,m){return new d.Promise(function(b,v){var g=[],w=y._internalType,S=y._outputType,E=y._mimeType;y.on("data",function(k,C){g.push(k),m&&m(C)}).on("error",function(k){g=[],v(k)}).on("end",function(){try{var k=function(C,N,$){switch(C){case"blob":return a.newBlob(a.transformTo("arraybuffer",N),$);case"base64":return l.encode(N);default:return a.transformTo(C,N)}}(S,function(C,N){var $,B=0,q=null,P=0;for($=0;$<N.length;$++)P+=N[$].length;switch(C){case"string":return N.join("");case"array":return Array.prototype.concat.apply([],N);case"uint8array":for(q=new Uint8Array(P),$=0;$<N.length;$++)q.set(N[$],B),B+=N[$].length;return q;case"nodebuffer":return Buffer.concat(N);default:throw new Error("concat : unsupported type '"+C+"'")}}(w,g),E);b(k)}catch(C){v(C)}g=[]}).resume()})}function p(y,m,b){var v=m;switch(m){case"blob":case"arraybuffer":v="uint8array";break;case"base64":v="string"}try{this._internalType=v,this._outputType=m,this._mimeType=b,a.checkSupport(v),this._worker=y.pipe(new s(v)),y.lock()}catch(g){this._worker=new o("error"),this._worker.error(g)}}p.prototype={accumulate:function(y){return f(this,y)},on:function(y,m){var b=this;return y==="data"?this._worker.on(y,function(v){m.call(b,v.data,v.meta)}):this._worker.on(y,function(){a.delay(m,arguments,b)}),this},resume:function(){return a.delay(this._worker.resume,[],this._worker),this},pause:function(){return this._worker.pause(),this},toNodejsStream:function(y){if(a.checkSupport("nodestream"),this._outputType!=="nodebuffer")throw new Error(this._outputType+" is not supported by this method");return new h(this,{objectMode:this._outputType!=="nodebuffer"},y)}},n.exports=p},{"../base64":1,"../external":6,"../nodejs/NodejsStreamOutputAdapter":13,"../support":30,"../utils":32,"./ConvertWorker":24,"./GenericWorker":28}],30:[function(r,n,i){if(i.base64=!0,i.array=!0,i.string=!0,i.arraybuffer=typeof ArrayBuffer<"u"&&typeof Uint8Array<"u",i.nodebuffer=typeof Buffer<"u",i.uint8array=typeof Uint8Array<"u",typeof ArrayBuffer>"u")i.blob=!1;else{var a=new ArrayBuffer(0);try{i.blob=new Blob([a],{type:"application/zip"}).size===0}catch{try{var s=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);s.append(a),i.blob=s.getBlob("application/zip").size===0}catch{i.blob=!1}}}try{i.nodestream=!!r("readable-stream").Readable}catch{i.nodestream=!1}},{"readable-stream":16}],31:[function(r,n,i){for(var a=r("./utils"),s=r("./support"),o=r("./nodejsUtils"),l=r("./stream/GenericWorker"),c=new Array(256),d=0;d<256;d++)c[d]=252<=d?6:248<=d?5:240<=d?4:224<=d?3:192<=d?2:1;c[254]=c[254]=1;function h(){l.call(this,"utf-8 decode"),this.leftOver=null}function f(){l.call(this,"utf-8 encode")}i.utf8encode=function(p){return s.nodebuffer?o.newBufferFrom(p,"utf-8"):function(y){var m,b,v,g,w,S=y.length,E=0;for(g=0;g<S;g++)(64512&(b=y.charCodeAt(g)))==55296&&g+1<S&&(64512&(v=y.charCodeAt(g+1)))==56320&&(b=65536+(b-55296<<10)+(v-56320),g++),E+=b<128?1:b<2048?2:b<65536?3:4;for(m=s.uint8array?new Uint8Array(E):new Array(E),g=w=0;w<E;g++)(64512&(b=y.charCodeAt(g)))==55296&&g+1<S&&(64512&(v=y.charCodeAt(g+1)))==56320&&(b=65536+(b-55296<<10)+(v-56320),g++),b<128?m[w++]=b:(b<2048?m[w++]=192|b>>>6:(b<65536?m[w++]=224|b>>>12:(m[w++]=240|b>>>18,m[w++]=128|b>>>12&63),m[w++]=128|b>>>6&63),m[w++]=128|63&b);return m}(p)},i.utf8decode=function(p){return s.nodebuffer?a.transformTo("nodebuffer",p).toString("utf-8"):function(y){var m,b,v,g,w=y.length,S=new Array(2*w);for(m=b=0;m<w;)if((v=y[m++])<128)S[b++]=v;else if(4<(g=c[v]))S[b++]=65533,m+=g-1;else{for(v&=g===2?31:g===3?15:7;1<g&&m<w;)v=v<<6|63&y[m++],g--;1<g?S[b++]=65533:v<65536?S[b++]=v:(v-=65536,S[b++]=55296|v>>10&1023,S[b++]=56320|1023&v)}return S.length!==b&&(S.subarray?S=S.subarray(0,b):S.length=b),a.applyFromCharCode(S)}(p=a.transformTo(s.uint8array?"uint8array":"array",p))},a.inherits(h,l),h.prototype.processChunk=function(p){var y=a.transformTo(s.uint8array?"uint8array":"array",p.data);if(this.leftOver&&this.leftOver.length){if(s.uint8array){var m=y;(y=new Uint8Array(m.length+this.leftOver.length)).set(this.leftOver,0),y.set(m,this.leftOver.length)}else y=this.leftOver.concat(y);this.leftOver=null}var b=function(g,w){var S;for((w=w||g.length)>g.length&&(w=g.length),S=w-1;0<=S&&(192&g[S])==128;)S--;return S<0||S===0?w:S+c[g[S]]>w?S:w}(y),v=y;b!==y.length&&(s.uint8array?(v=y.subarray(0,b),this.leftOver=y.subarray(b,y.length)):(v=y.slice(0,b),this.leftOver=y.slice(b,y.length))),this.push({data:i.utf8decode(v),meta:p.meta})},h.prototype.flush=function(){this.leftOver&&this.leftOver.length&&(this.push({data:i.utf8decode(this.leftOver),meta:{}}),this.leftOver=null)},i.Utf8DecodeWorker=h,a.inherits(f,l),f.prototype.processChunk=function(p){this.push({data:i.utf8encode(p.data),meta:p.meta})},i.Utf8EncodeWorker=f},{"./nodejsUtils":14,"./stream/GenericWorker":28,"./support":30,"./utils":32}],32:[function(r,n,i){var a=r("./support"),s=r("./base64"),o=r("./nodejsUtils"),l=r("./external");function c(m){return m}function d(m,b){for(var v=0;v<m.length;++v)b[v]=255&m.charCodeAt(v);return b}r("setimmediate"),i.newBlob=function(m,b){i.checkSupport("blob");try{return new Blob([m],{type:b})}catch{try{var v=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);return v.append(m),v.getBlob(b)}catch{throw new Error("Bug : can't construct the Blob.")}}};var h={stringifyByChunk:function(m,b,v){var g=[],w=0,S=m.length;if(S<=v)return String.fromCharCode.apply(null,m);for(;w<S;)b==="array"||b==="nodebuffer"?g.push(String.fromCharCode.apply(null,m.slice(w,Math.min(w+v,S)))):g.push(String.fromCharCode.apply(null,m.subarray(w,Math.min(w+v,S)))),w+=v;return g.join("")},stringifyByChar:function(m){for(var b="",v=0;v<m.length;v++)b+=String.fromCharCode(m[v]);return b},applyCanBeUsed:{uint8array:function(){try{return a.uint8array&&String.fromCharCode.apply(null,new Uint8Array(1)).length===1}catch{return!1}}(),nodebuffer:function(){try{return a.nodebuffer&&String.fromCharCode.apply(null,o.allocBuffer(1)).length===1}catch{return!1}}()}};function f(m){var b=65536,v=i.getTypeOf(m),g=!0;if(v==="uint8array"?g=h.applyCanBeUsed.uint8array:v==="nodebuffer"&&(g=h.applyCanBeUsed.nodebuffer),g)for(;1<b;)try{return h.stringifyByChunk(m,v,b)}catch{b=Math.floor(b/2)}return h.stringifyByChar(m)}function p(m,b){for(var v=0;v<m.length;v++)b[v]=m[v];return b}i.applyFromCharCode=f;var y={};y.string={string:c,array:function(m){return d(m,new Array(m.length))},arraybuffer:function(m){return y.string.uint8array(m).buffer},uint8array:function(m){return d(m,new Uint8Array(m.length))},nodebuffer:function(m){return d(m,o.allocBuffer(m.length))}},y.array={string:f,array:c,arraybuffer:function(m){return new Uint8Array(m).buffer},uint8array:function(m){return new Uint8Array(m)},nodebuffer:function(m){return o.newBufferFrom(m)}},y.arraybuffer={string:function(m){return f(new Uint8Array(m))},array:function(m){return p(new Uint8Array(m),new Array(m.byteLength))},arraybuffer:c,uint8array:function(m){return new Uint8Array(m)},nodebuffer:function(m){return o.newBufferFrom(new Uint8Array(m))}},y.uint8array={string:f,array:function(m){return p(m,new Array(m.length))},arraybuffer:function(m){return m.buffer},uint8array:c,nodebuffer:function(m){return o.newBufferFrom(m)}},y.nodebuffer={string:f,array:function(m){return p(m,new Array(m.length))},arraybuffer:function(m){return y.nodebuffer.uint8array(m).buffer},uint8array:function(m){return p(m,new Uint8Array(m.length))},nodebuffer:c},i.transformTo=function(m,b){if(b=b||"",!m)return b;i.checkSupport(m);var v=i.getTypeOf(b);return y[v][m](b)},i.resolve=function(m){for(var b=m.split("/"),v=[],g=0;g<b.length;g++){var w=b[g];w==="."||w===""&&g!==0&&g!==b.length-1||(w===".."?v.pop():v.push(w))}return v.join("/")},i.getTypeOf=function(m){return typeof m=="string"?"string":Object.prototype.toString.call(m)==="[object Array]"?"array":a.nodebuffer&&o.isBuffer(m)?"nodebuffer":a.uint8array&&m instanceof Uint8Array?"uint8array":a.arraybuffer&&m instanceof ArrayBuffer?"arraybuffer":void 0},i.checkSupport=function(m){if(!a[m.toLowerCase()])throw new Error(m+" is not supported by this platform")},i.MAX_VALUE_16BITS=65535,i.MAX_VALUE_32BITS=-1,i.pretty=function(m){var b,v,g="";for(v=0;v<(m||"").length;v++)g+="\\x"+((b=m.charCodeAt(v))<16?"0":"")+b.toString(16).toUpperCase();return g},i.delay=function(m,b,v){setImmediate(function(){m.apply(v||null,b||[])})},i.inherits=function(m,b){function v(){}v.prototype=b.prototype,m.prototype=new v},i.extend=function(){var m,b,v={};for(m=0;m<arguments.length;m++)for(b in arguments[m])Object.prototype.hasOwnProperty.call(arguments[m],b)&&v[b]===void 0&&(v[b]=arguments[m][b]);return v},i.prepareContent=function(m,b,v,g,w){return l.Promise.resolve(b).then(function(S){return a.blob&&(S instanceof Blob||["[object File]","[object Blob]"].indexOf(Object.prototype.toString.call(S))!==-1)&&typeof FileReader<"u"?new l.Promise(function(E,k){var C=new FileReader;C.onload=function(N){E(N.target.result)},C.onerror=function(N){k(N.target.error)},C.readAsArrayBuffer(S)}):S}).then(function(S){var E=i.getTypeOf(S);return E?(E==="arraybuffer"?S=i.transformTo("uint8array",S):E==="string"&&(w?S=s.decode(S):v&&g!==!0&&(S=function(k){return d(k,a.uint8array?new Uint8Array(k.length):new Array(k.length))}(S))),S):l.Promise.reject(new Error("Can't read the data of '"+m+"'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"))})}},{"./base64":1,"./external":6,"./nodejsUtils":14,"./support":30,setimmediate:54}],33:[function(r,n,i){var a=r("./reader/readerFor"),s=r("./utils"),o=r("./signature"),l=r("./zipEntry"),c=r("./support");function d(h){this.files=[],this.loadOptions=h}d.prototype={checkSignature:function(h){if(!this.reader.readAndCheckSignature(h)){this.reader.index-=4;var f=this.reader.readString(4);throw new Error("Corrupted zip or bug: unexpected signature ("+s.pretty(f)+", expected "+s.pretty(h)+")")}},isSignature:function(h,f){var p=this.reader.index;this.reader.setIndex(h);var y=this.reader.readString(4)===f;return this.reader.setIndex(p),y},readBlockEndOfCentral:function(){this.diskNumber=this.reader.readInt(2),this.diskWithCentralDirStart=this.reader.readInt(2),this.centralDirRecordsOnThisDisk=this.reader.readInt(2),this.centralDirRecords=this.reader.readInt(2),this.centralDirSize=this.reader.readInt(4),this.centralDirOffset=this.reader.readInt(4),this.zipCommentLength=this.reader.readInt(2);var h=this.reader.readData(this.zipCommentLength),f=c.uint8array?"uint8array":"array",p=s.transformTo(f,h);this.zipComment=this.loadOptions.decodeFileName(p)},readBlockZip64EndOfCentral:function(){this.zip64EndOfCentralSize=this.reader.readInt(8),this.reader.skip(4),this.diskNumber=this.reader.readInt(4),this.diskWithCentralDirStart=this.reader.readInt(4),this.centralDirRecordsOnThisDisk=this.reader.readInt(8),this.centralDirRecords=this.reader.readInt(8),this.centralDirSize=this.reader.readInt(8),this.centralDirOffset=this.reader.readInt(8),this.zip64ExtensibleData={};for(var h,f,p,y=this.zip64EndOfCentralSize-44;0<y;)h=this.reader.readInt(2),f=this.reader.readInt(4),p=this.reader.readData(f),this.zip64ExtensibleData[h]={id:h,length:f,value:p}},readBlockZip64EndOfCentralLocator:function(){if(this.diskWithZip64CentralDirStart=this.reader.readInt(4),this.relativeOffsetEndOfZip64CentralDir=this.reader.readInt(8),this.disksCount=this.reader.readInt(4),1<this.disksCount)throw new Error("Multi-volumes zip are not supported")},readLocalFiles:function(){var h,f;for(h=0;h<this.files.length;h++)f=this.files[h],this.reader.setIndex(f.localHeaderOffset),this.checkSignature(o.LOCAL_FILE_HEADER),f.readLocalPart(this.reader),f.handleUTF8(),f.processAttributes()},readCentralDir:function(){var h;for(this.reader.setIndex(this.centralDirOffset);this.reader.readAndCheckSignature(o.CENTRAL_FILE_HEADER);)(h=new l({zip64:this.zip64},this.loadOptions)).readCentralPart(this.reader),this.files.push(h);if(this.centralDirRecords!==this.files.length&&this.centralDirRecords!==0&&this.files.length===0)throw new Error("Corrupted zip or bug: expected "+this.centralDirRecords+" records in central dir, got "+this.files.length)},readEndOfCentral:function(){var h=this.reader.lastIndexOfSignature(o.CENTRAL_DIRECTORY_END);if(h<0)throw this.isSignature(0,o.LOCAL_FILE_HEADER)?new Error("Corrupted zip: can't find end of central directory"):new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");this.reader.setIndex(h);var f=h;if(this.checkSignature(o.CENTRAL_DIRECTORY_END),this.readBlockEndOfCentral(),this.diskNumber===s.MAX_VALUE_16BITS||this.diskWithCentralDirStart===s.MAX_VALUE_16BITS||this.centralDirRecordsOnThisDisk===s.MAX_VALUE_16BITS||this.centralDirRecords===s.MAX_VALUE_16BITS||this.centralDirSize===s.MAX_VALUE_32BITS||this.centralDirOffset===s.MAX_VALUE_32BITS){if(this.zip64=!0,(h=this.reader.lastIndexOfSignature(o.ZIP64_CENTRAL_DIRECTORY_LOCATOR))<0)throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");if(this.reader.setIndex(h),this.checkSignature(o.ZIP64_CENTRAL_DIRECTORY_LOCATOR),this.readBlockZip64EndOfCentralLocator(),!this.isSignature(this.relativeOffsetEndOfZip64CentralDir,o.ZIP64_CENTRAL_DIRECTORY_END)&&(this.relativeOffsetEndOfZip64CentralDir=this.reader.lastIndexOfSignature(o.ZIP64_CENTRAL_DIRECTORY_END),this.relativeOffsetEndOfZip64CentralDir<0))throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir),this.checkSignature(o.ZIP64_CENTRAL_DIRECTORY_END),this.readBlockZip64EndOfCentral()}var p=this.centralDirOffset+this.centralDirSize;this.zip64&&(p+=20,p+=12+this.zip64EndOfCentralSize);var y=f-p;if(0<y)this.isSignature(f,o.CENTRAL_FILE_HEADER)||(this.reader.zero=y);else if(y<0)throw new Error("Corrupted zip: missing "+Math.abs(y)+" bytes.")},prepareReader:function(h){this.reader=a(h)},load:function(h){this.prepareReader(h),this.readEndOfCentral(),this.readCentralDir(),this.readLocalFiles()}},n.exports=d},{"./reader/readerFor":22,"./signature":23,"./support":30,"./utils":32,"./zipEntry":34}],34:[function(r,n,i){var a=r("./reader/readerFor"),s=r("./utils"),o=r("./compressedObject"),l=r("./crc32"),c=r("./utf8"),d=r("./compressions"),h=r("./support");function f(p,y){this.options=p,this.loadOptions=y}f.prototype={isEncrypted:function(){return(1&this.bitFlag)==1},useUTF8:function(){return(2048&this.bitFlag)==2048},readLocalPart:function(p){var y,m;if(p.skip(22),this.fileNameLength=p.readInt(2),m=p.readInt(2),this.fileName=p.readData(this.fileNameLength),p.skip(m),this.compressedSize===-1||this.uncompressedSize===-1)throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");if((y=function(b){for(var v in d)if(Object.prototype.hasOwnProperty.call(d,v)&&d[v].magic===b)return d[v];return null}(this.compressionMethod))===null)throw new Error("Corrupted zip : compression "+s.pretty(this.compressionMethod)+" unknown (inner file : "+s.transformTo("string",this.fileName)+")");this.decompressed=new o(this.compressedSize,this.uncompressedSize,this.crc32,y,p.readData(this.compressedSize))},readCentralPart:function(p){this.versionMadeBy=p.readInt(2),p.skip(2),this.bitFlag=p.readInt(2),this.compressionMethod=p.readString(2),this.date=p.readDate(),this.crc32=p.readInt(4),this.compressedSize=p.readInt(4),this.uncompressedSize=p.readInt(4);var y=p.readInt(2);if(this.extraFieldsLength=p.readInt(2),this.fileCommentLength=p.readInt(2),this.diskNumberStart=p.readInt(2),this.internalFileAttributes=p.readInt(2),this.externalFileAttributes=p.readInt(4),this.localHeaderOffset=p.readInt(4),this.isEncrypted())throw new Error("Encrypted zip are not supported");p.skip(y),this.readExtraFields(p),this.parseZIP64ExtraField(p),this.fileComment=p.readData(this.fileCommentLength)},processAttributes:function(){this.unixPermissions=null,this.dosPermissions=null;var p=this.versionMadeBy>>8;this.dir=!!(16&this.externalFileAttributes),p==0&&(this.dosPermissions=63&this.externalFileAttributes),p==3&&(this.unixPermissions=this.externalFileAttributes>>16&65535),this.dir||this.fileNameStr.slice(-1)!=="/"||(this.dir=!0)},parseZIP64ExtraField:function(){if(this.extraFields[1]){var p=a(this.extraFields[1].value);this.uncompressedSize===s.MAX_VALUE_32BITS&&(this.uncompressedSize=p.readInt(8)),this.compressedSize===s.MAX_VALUE_32BITS&&(this.compressedSize=p.readInt(8)),this.localHeaderOffset===s.MAX_VALUE_32BITS&&(this.localHeaderOffset=p.readInt(8)),this.diskNumberStart===s.MAX_VALUE_32BITS&&(this.diskNumberStart=p.readInt(4))}},readExtraFields:function(p){var y,m,b,v=p.index+this.extraFieldsLength;for(this.extraFields||(this.extraFields={});p.index+4<v;)y=p.readInt(2),m=p.readInt(2),b=p.readData(m),this.extraFields[y]={id:y,length:m,value:b};p.setIndex(v)},handleUTF8:function(){var p=h.uint8array?"uint8array":"array";if(this.useUTF8())this.fileNameStr=c.utf8decode(this.fileName),this.fileCommentStr=c.utf8decode(this.fileComment);else{var y=this.findExtraFieldUnicodePath();if(y!==null)this.fileNameStr=y;else{var m=s.transformTo(p,this.fileName);this.fileNameStr=this.loadOptions.decodeFileName(m)}var b=this.findExtraFieldUnicodeComment();if(b!==null)this.fileCommentStr=b;else{var v=s.transformTo(p,this.fileComment);this.fileCommentStr=this.loadOptions.decodeFileName(v)}}},findExtraFieldUnicodePath:function(){var p=this.extraFields[28789];if(p){var y=a(p.value);return y.readInt(1)!==1||l(this.fileName)!==y.readInt(4)?null:c.utf8decode(y.readData(p.length-5))}return null},findExtraFieldUnicodeComment:function(){var p=this.extraFields[25461];if(p){var y=a(p.value);return y.readInt(1)!==1||l(this.fileComment)!==y.readInt(4)?null:c.utf8decode(y.readData(p.length-5))}return null}},n.exports=f},{"./compressedObject":2,"./compressions":3,"./crc32":4,"./reader/readerFor":22,"./support":30,"./utf8":31,"./utils":32}],35:[function(r,n,i){function a(y,m,b){this.name=y,this.dir=b.dir,this.date=b.date,this.comment=b.comment,this.unixPermissions=b.unixPermissions,this.dosPermissions=b.dosPermissions,this._data=m,this._dataBinary=b.binary,this.options={compression:b.compression,compressionOptions:b.compressionOptions}}var s=r("./stream/StreamHelper"),o=r("./stream/DataWorker"),l=r("./utf8"),c=r("./compressedObject"),d=r("./stream/GenericWorker");a.prototype={internalStream:function(y){var m=null,b="string";try{if(!y)throw new Error("No output type specified.");var v=(b=y.toLowerCase())==="string"||b==="text";b!=="binarystring"&&b!=="text"||(b="string"),m=this._decompressWorker();var g=!this._dataBinary;g&&!v&&(m=m.pipe(new l.Utf8EncodeWorker)),!g&&v&&(m=m.pipe(new l.Utf8DecodeWorker))}catch(w){(m=new d("error")).error(w)}return new s(m,b,"")},async:function(y,m){return this.internalStream(y).accumulate(m)},nodeStream:function(y,m){return this.internalStream(y||"nodebuffer").toNodejsStream(m)},_compressWorker:function(y,m){if(this._data instanceof c&&this._data.compression.magic===y.magic)return this._data.getCompressedWorker();var b=this._decompressWorker();return this._dataBinary||(b=b.pipe(new l.Utf8EncodeWorker)),c.createWorkerFrom(b,y,m)},_decompressWorker:function(){return this._data instanceof c?this._data.getContentWorker():this._data instanceof d?this._data:new o(this._data)}};for(var h=["asText","asBinary","asNodeBuffer","asUint8Array","asArrayBuffer"],f=function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},p=0;p<h.length;p++)a.prototype[h[p]]=f;n.exports=a},{"./compressedObject":2,"./stream/DataWorker":27,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31}],36:[function(r,n,i){(function(a){var s,o,l=a.MutationObserver||a.WebKitMutationObserver;if(l){var c=0,d=new l(y),h=a.document.createTextNode("");d.observe(h,{characterData:!0}),s=function(){h.data=c=++c%2}}else if(a.setImmediate||a.MessageChannel===void 0)s="document"in a&&"onreadystatechange"in a.document.createElement("script")?function(){var m=a.document.createElement("script");m.onreadystatechange=function(){y(),m.onreadystatechange=null,m.parentNode.removeChild(m),m=null},a.document.documentElement.appendChild(m)}:function(){setTimeout(y,0)};else{var f=new a.MessageChannel;f.port1.onmessage=y,s=function(){f.port2.postMessage(0)}}var p=[];function y(){var m,b;o=!0;for(var v=p.length;v;){for(b=p,p=[],m=-1;++m<v;)b[m]();v=p.length}o=!1}n.exports=function(m){p.push(m)!==1||o||s()}}).call(this,typeof tn<"u"?tn:typeof self<"u"?self:typeof window<"u"?window:{})},{}],37:[function(r,n,i){var a=r("immediate");function s(){}var o={},l=["REJECTED"],c=["FULFILLED"],d=["PENDING"];function h(v){if(typeof v!="function")throw new TypeError("resolver must be a function");this.state=d,this.queue=[],this.outcome=void 0,v!==s&&m(this,v)}function f(v,g,w){this.promise=v,typeof g=="function"&&(this.onFulfilled=g,this.callFulfilled=this.otherCallFulfilled),typeof w=="function"&&(this.onRejected=w,this.callRejected=this.otherCallRejected)}function p(v,g,w){a(function(){var S;try{S=g(w)}catch(E){return o.reject(v,E)}S===v?o.reject(v,new TypeError("Cannot resolve promise with itself")):o.resolve(v,S)})}function y(v){var g=v&&v.then;if(v&&(typeof v=="object"||typeof v=="function")&&typeof g=="function")return function(){g.apply(v,arguments)}}function m(v,g){var w=!1;function S(C){w||(w=!0,o.reject(v,C))}function E(C){w||(w=!0,o.resolve(v,C))}var k=b(function(){g(E,S)});k.status==="error"&&S(k.value)}function b(v,g){var w={};try{w.value=v(g),w.status="success"}catch(S){w.status="error",w.value=S}return w}(n.exports=h).prototype.finally=function(v){if(typeof v!="function")return this;var g=this.constructor;return this.then(function(w){return g.resolve(v()).then(function(){return w})},function(w){return g.resolve(v()).then(function(){throw w})})},h.prototype.catch=function(v){return this.then(null,v)},h.prototype.then=function(v,g){if(typeof v!="function"&&this.state===c||typeof g!="function"&&this.state===l)return this;var w=new this.constructor(s);return this.state!==d?p(w,this.state===c?v:g,this.outcome):this.queue.push(new f(w,v,g)),w},f.prototype.callFulfilled=function(v){o.resolve(this.promise,v)},f.prototype.otherCallFulfilled=function(v){p(this.promise,this.onFulfilled,v)},f.prototype.callRejected=function(v){o.reject(this.promise,v)},f.prototype.otherCallRejected=function(v){p(this.promise,this.onRejected,v)},o.resolve=function(v,g){var w=b(y,g);if(w.status==="error")return o.reject(v,w.value);var S=w.value;if(S)m(v,S);else{v.state=c,v.outcome=g;for(var E=-1,k=v.queue.length;++E<k;)v.queue[E].callFulfilled(g)}return v},o.reject=function(v,g){v.state=l,v.outcome=g;for(var w=-1,S=v.queue.length;++w<S;)v.queue[w].callRejected(g);return v},h.resolve=function(v){return v instanceof this?v:o.resolve(new this(s),v)},h.reject=function(v){var g=new this(s);return o.reject(g,v)},h.all=function(v){var g=this;if(Object.prototype.toString.call(v)!=="[object Array]")return this.reject(new TypeError("must be an array"));var w=v.length,S=!1;if(!w)return this.resolve([]);for(var E=new Array(w),k=0,C=-1,N=new this(s);++C<w;)$(v[C],C);return N;function $(B,q){g.resolve(B).then(function(P){E[q]=P,++k!==w||S||(S=!0,o.resolve(N,E))},function(P){S||(S=!0,o.reject(N,P))})}},h.race=function(v){var g=this;if(Object.prototype.toString.call(v)!=="[object Array]")return this.reject(new TypeError("must be an array"));var w=v.length,S=!1;if(!w)return this.resolve([]);for(var E=-1,k=new this(s);++E<w;)C=v[E],g.resolve(C).then(function(N){S||(S=!0,o.resolve(k,N))},function(N){S||(S=!0,o.reject(k,N))});var C;return k}},{immediate:36}],38:[function(r,n,i){var a={};(0,r("./lib/utils/common").assign)(a,r("./lib/deflate"),r("./lib/inflate"),r("./lib/zlib/constants")),n.exports=a},{"./lib/deflate":39,"./lib/inflate":40,"./lib/utils/common":41,"./lib/zlib/constants":44}],39:[function(r,n,i){var a=r("./zlib/deflate"),s=r("./utils/common"),o=r("./utils/strings"),l=r("./zlib/messages"),c=r("./zlib/zstream"),d=Object.prototype.toString,h=0,f=-1,p=0,y=8;function m(v){if(!(this instanceof m))return new m(v);this.options=s.assign({level:f,method:y,chunkSize:16384,windowBits:15,memLevel:8,strategy:p,to:""},v||{});var g=this.options;g.raw&&0<g.windowBits?g.windowBits=-g.windowBits:g.gzip&&0<g.windowBits&&g.windowBits<16&&(g.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new c,this.strm.avail_out=0;var w=a.deflateInit2(this.strm,g.level,g.method,g.windowBits,g.memLevel,g.strategy);if(w!==h)throw new Error(l[w]);if(g.header&&a.deflateSetHeader(this.strm,g.header),g.dictionary){var S;if(S=typeof g.dictionary=="string"?o.string2buf(g.dictionary):d.call(g.dictionary)==="[object ArrayBuffer]"?new Uint8Array(g.dictionary):g.dictionary,(w=a.deflateSetDictionary(this.strm,S))!==h)throw new Error(l[w]);this._dict_set=!0}}function b(v,g){var w=new m(g);if(w.push(v,!0),w.err)throw w.msg||l[w.err];return w.result}m.prototype.push=function(v,g){var w,S,E=this.strm,k=this.options.chunkSize;if(this.ended)return!1;S=g===~~g?g:g===!0?4:0,typeof v=="string"?E.input=o.string2buf(v):d.call(v)==="[object ArrayBuffer]"?E.input=new Uint8Array(v):E.input=v,E.next_in=0,E.avail_in=E.input.length;do{if(E.avail_out===0&&(E.output=new s.Buf8(k),E.next_out=0,E.avail_out=k),(w=a.deflate(E,S))!==1&&w!==h)return this.onEnd(w),!(this.ended=!0);E.avail_out!==0&&(E.avail_in!==0||S!==4&&S!==2)||(this.options.to==="string"?this.onData(o.buf2binstring(s.shrinkBuf(E.output,E.next_out))):this.onData(s.shrinkBuf(E.output,E.next_out)))}while((0<E.avail_in||E.avail_out===0)&&w!==1);return S===4?(w=a.deflateEnd(this.strm),this.onEnd(w),this.ended=!0,w===h):S!==2||(this.onEnd(h),!(E.avail_out=0))},m.prototype.onData=function(v){this.chunks.push(v)},m.prototype.onEnd=function(v){v===h&&(this.options.to==="string"?this.result=this.chunks.join(""):this.result=s.flattenChunks(this.chunks)),this.chunks=[],this.err=v,this.msg=this.strm.msg},i.Deflate=m,i.deflate=b,i.deflateRaw=function(v,g){return(g=g||{}).raw=!0,b(v,g)},i.gzip=function(v,g){return(g=g||{}).gzip=!0,b(v,g)}},{"./utils/common":41,"./utils/strings":42,"./zlib/deflate":46,"./zlib/messages":51,"./zlib/zstream":53}],40:[function(r,n,i){var a=r("./zlib/inflate"),s=r("./utils/common"),o=r("./utils/strings"),l=r("./zlib/constants"),c=r("./zlib/messages"),d=r("./zlib/zstream"),h=r("./zlib/gzheader"),f=Object.prototype.toString;function p(m){if(!(this instanceof p))return new p(m);this.options=s.assign({chunkSize:16384,windowBits:0,to:""},m||{});var b=this.options;b.raw&&0<=b.windowBits&&b.windowBits<16&&(b.windowBits=-b.windowBits,b.windowBits===0&&(b.windowBits=-15)),!(0<=b.windowBits&&b.windowBits<16)||m&&m.windowBits||(b.windowBits+=32),15<b.windowBits&&b.windowBits<48&&!(15&b.windowBits)&&(b.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new d,this.strm.avail_out=0;var v=a.inflateInit2(this.strm,b.windowBits);if(v!==l.Z_OK)throw new Error(c[v]);this.header=new h,a.inflateGetHeader(this.strm,this.header)}function y(m,b){var v=new p(b);if(v.push(m,!0),v.err)throw v.msg||c[v.err];return v.result}p.prototype.push=function(m,b){var v,g,w,S,E,k,C=this.strm,N=this.options.chunkSize,$=this.options.dictionary,B=!1;if(this.ended)return!1;g=b===~~b?b:b===!0?l.Z_FINISH:l.Z_NO_FLUSH,typeof m=="string"?C.input=o.binstring2buf(m):f.call(m)==="[object ArrayBuffer]"?C.input=new Uint8Array(m):C.input=m,C.next_in=0,C.avail_in=C.input.length;do{if(C.avail_out===0&&(C.output=new s.Buf8(N),C.next_out=0,C.avail_out=N),(v=a.inflate(C,l.Z_NO_FLUSH))===l.Z_NEED_DICT&&$&&(k=typeof $=="string"?o.string2buf($):f.call($)==="[object ArrayBuffer]"?new Uint8Array($):$,v=a.inflateSetDictionary(this.strm,k)),v===l.Z_BUF_ERROR&&B===!0&&(v=l.Z_OK,B=!1),v!==l.Z_STREAM_END&&v!==l.Z_OK)return this.onEnd(v),!(this.ended=!0);C.next_out&&(C.avail_out!==0&&v!==l.Z_STREAM_END&&(C.avail_in!==0||g!==l.Z_FINISH&&g!==l.Z_SYNC_FLUSH)||(this.options.to==="string"?(w=o.utf8border(C.output,C.next_out),S=C.next_out-w,E=o.buf2string(C.output,w),C.next_out=S,C.avail_out=N-S,S&&s.arraySet(C.output,C.output,w,S,0),this.onData(E)):this.onData(s.shrinkBuf(C.output,C.next_out)))),C.avail_in===0&&C.avail_out===0&&(B=!0)}while((0<C.avail_in||C.avail_out===0)&&v!==l.Z_STREAM_END);return v===l.Z_STREAM_END&&(g=l.Z_FINISH),g===l.Z_FINISH?(v=a.inflateEnd(this.strm),this.onEnd(v),this.ended=!0,v===l.Z_OK):g!==l.Z_SYNC_FLUSH||(this.onEnd(l.Z_OK),!(C.avail_out=0))},p.prototype.onData=function(m){this.chunks.push(m)},p.prototype.onEnd=function(m){m===l.Z_OK&&(this.options.to==="string"?this.result=this.chunks.join(""):this.result=s.flattenChunks(this.chunks)),this.chunks=[],this.err=m,this.msg=this.strm.msg},i.Inflate=p,i.inflate=y,i.inflateRaw=function(m,b){return(b=b||{}).raw=!0,y(m,b)},i.ungzip=y},{"./utils/common":41,"./utils/strings":42,"./zlib/constants":44,"./zlib/gzheader":47,"./zlib/inflate":49,"./zlib/messages":51,"./zlib/zstream":53}],41:[function(r,n,i){var a=typeof Uint8Array<"u"&&typeof Uint16Array<"u"&&typeof Int32Array<"u";i.assign=function(l){for(var c=Array.prototype.slice.call(arguments,1);c.length;){var d=c.shift();if(d){if(typeof d!="object")throw new TypeError(d+"must be non-object");for(var h in d)d.hasOwnProperty(h)&&(l[h]=d[h])}}return l},i.shrinkBuf=function(l,c){return l.length===c?l:l.subarray?l.subarray(0,c):(l.length=c,l)};var s={arraySet:function(l,c,d,h,f){if(c.subarray&&l.subarray)l.set(c.subarray(d,d+h),f);else for(var p=0;p<h;p++)l[f+p]=c[d+p]},flattenChunks:function(l){var c,d,h,f,p,y;for(c=h=0,d=l.length;c<d;c++)h+=l[c].length;for(y=new Uint8Array(h),c=f=0,d=l.length;c<d;c++)p=l[c],y.set(p,f),f+=p.length;return y}},o={arraySet:function(l,c,d,h,f){for(var p=0;p<h;p++)l[f+p]=c[d+p]},flattenChunks:function(l){return[].concat.apply([],l)}};i.setTyped=function(l){l?(i.Buf8=Uint8Array,i.Buf16=Uint16Array,i.Buf32=Int32Array,i.assign(i,s)):(i.Buf8=Array,i.Buf16=Array,i.Buf32=Array,i.assign(i,o))},i.setTyped(a)},{}],42:[function(r,n,i){var a=r("./common"),s=!0,o=!0;try{String.fromCharCode.apply(null,[0])}catch{s=!1}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch{o=!1}for(var l=new a.Buf8(256),c=0;c<256;c++)l[c]=252<=c?6:248<=c?5:240<=c?4:224<=c?3:192<=c?2:1;function d(h,f){if(f<65537&&(h.subarray&&o||!h.subarray&&s))return String.fromCharCode.apply(null,a.shrinkBuf(h,f));for(var p="",y=0;y<f;y++)p+=String.fromCharCode(h[y]);return p}l[254]=l[254]=1,i.string2buf=function(h){var f,p,y,m,b,v=h.length,g=0;for(m=0;m<v;m++)(64512&(p=h.charCodeAt(m)))==55296&&m+1<v&&(64512&(y=h.charCodeAt(m+1)))==56320&&(p=65536+(p-55296<<10)+(y-56320),m++),g+=p<128?1:p<2048?2:p<65536?3:4;for(f=new a.Buf8(g),m=b=0;b<g;m++)(64512&(p=h.charCodeAt(m)))==55296&&m+1<v&&(64512&(y=h.charCodeAt(m+1)))==56320&&(p=65536+(p-55296<<10)+(y-56320),m++),p<128?f[b++]=p:(p<2048?f[b++]=192|p>>>6:(p<65536?f[b++]=224|p>>>12:(f[b++]=240|p>>>18,f[b++]=128|p>>>12&63),f[b++]=128|p>>>6&63),f[b++]=128|63&p);return f},i.buf2binstring=function(h){return d(h,h.length)},i.binstring2buf=function(h){for(var f=new a.Buf8(h.length),p=0,y=f.length;p<y;p++)f[p]=h.charCodeAt(p);return f},i.buf2string=function(h,f){var p,y,m,b,v=f||h.length,g=new Array(2*v);for(p=y=0;p<v;)if((m=h[p++])<128)g[y++]=m;else if(4<(b=l[m]))g[y++]=65533,p+=b-1;else{for(m&=b===2?31:b===3?15:7;1<b&&p<v;)m=m<<6|63&h[p++],b--;1<b?g[y++]=65533:m<65536?g[y++]=m:(m-=65536,g[y++]=55296|m>>10&1023,g[y++]=56320|1023&m)}return d(g,y)},i.utf8border=function(h,f){var p;for((f=f||h.length)>h.length&&(f=h.length),p=f-1;0<=p&&(192&h[p])==128;)p--;return p<0||p===0?f:p+l[h[p]]>f?p:f}},{"./common":41}],43:[function(r,n,i){n.exports=function(a,s,o,l){for(var c=65535&a|0,d=a>>>16&65535|0,h=0;o!==0;){for(o-=h=2e3<o?2e3:o;d=d+(c=c+s[l++]|0)|0,--h;);c%=65521,d%=65521}return c|d<<16|0}},{}],44:[function(r,n,i){n.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}},{}],45:[function(r,n,i){var a=function(){for(var s,o=[],l=0;l<256;l++){s=l;for(var c=0;c<8;c++)s=1&s?3988292384^s>>>1:s>>>1;o[l]=s}return o}();n.exports=function(s,o,l,c){var d=a,h=c+l;s^=-1;for(var f=c;f<h;f++)s=s>>>8^d[255&(s^o[f])];return-1^s}},{}],46:[function(r,n,i){var a,s=r("../utils/common"),o=r("./trees"),l=r("./adler32"),c=r("./crc32"),d=r("./messages"),h=0,f=4,p=0,y=-2,m=-1,b=4,v=2,g=8,w=9,S=286,E=30,k=19,C=2*S+1,N=15,$=3,B=258,q=B+$+1,P=42,L=113,_=1,W=2,ue=3,X=4;function U(x,K){return x.msg=d[K],K}function R(x){return(x<<1)-(4<x?9:0)}function G(x){for(var K=x.length;0<=--K;)x[K]=0}function A(x){var K=x.state,H=K.pending;H>x.avail_out&&(H=x.avail_out),H!==0&&(s.arraySet(x.output,K.pending_buf,K.pending_out,H,x.next_out),x.next_out+=H,K.pending_out+=H,x.total_out+=H,x.avail_out-=H,K.pending-=H,K.pending===0&&(K.pending_out=0))}function I(x,K){o._tr_flush_block(x,0<=x.block_start?x.block_start:-1,x.strstart-x.block_start,K),x.block_start=x.strstart,A(x.strm)}function ae(x,K){x.pending_buf[x.pending++]=K}function te(x,K){x.pending_buf[x.pending++]=K>>>8&255,x.pending_buf[x.pending++]=255&K}function ee(x,K){var H,O,j=x.max_chain_length,D=x.strstart,Y=x.prev_length,Z=x.nice_match,F=x.strstart>x.w_size-q?x.strstart-(x.w_size-q):0,ne=x.window,ce=x.w_mask,ie=x.prev,M=x.strstart+B,J=ne[D+Y-1],Q=ne[D+Y];x.prev_length>=x.good_match&&(j>>=2),Z>x.lookahead&&(Z=x.lookahead);do if(ne[(H=K)+Y]===Q&&ne[H+Y-1]===J&&ne[H]===ne[D]&&ne[++H]===ne[D+1]){D+=2,H++;do;while(ne[++D]===ne[++H]&&ne[++D]===ne[++H]&&ne[++D]===ne[++H]&&ne[++D]===ne[++H]&&ne[++D]===ne[++H]&&ne[++D]===ne[++H]&&ne[++D]===ne[++H]&&ne[++D]===ne[++H]&&D<M);if(O=B-(M-D),D=M-B,Y<O){if(x.match_start=K,Z<=(Y=O))break;J=ne[D+Y-1],Q=ne[D+Y]}}while((K=ie[K&ce])>F&&--j!=0);return Y<=x.lookahead?Y:x.lookahead}function he(x){var K,H,O,j,D,Y,Z,F,ne,ce,ie=x.w_size;do{if(j=x.window_size-x.lookahead-x.strstart,x.strstart>=ie+(ie-q)){for(s.arraySet(x.window,x.window,ie,ie,0),x.match_start-=ie,x.strstart-=ie,x.block_start-=ie,K=H=x.hash_size;O=x.head[--K],x.head[K]=ie<=O?O-ie:0,--H;);for(K=H=ie;O=x.prev[--K],x.prev[K]=ie<=O?O-ie:0,--H;);j+=ie}if(x.strm.avail_in===0)break;if(Y=x.strm,Z=x.window,F=x.strstart+x.lookahead,ne=j,ce=void 0,ce=Y.avail_in,ne<ce&&(ce=ne),H=ce===0?0:(Y.avail_in-=ce,s.arraySet(Z,Y.input,Y.next_in,ce,F),Y.state.wrap===1?Y.adler=l(Y.adler,Z,ce,F):Y.state.wrap===2&&(Y.adler=c(Y.adler,Z,ce,F)),Y.next_in+=ce,Y.total_in+=ce,ce),x.lookahead+=H,x.lookahead+x.insert>=$)for(D=x.strstart-x.insert,x.ins_h=x.window[D],x.ins_h=(x.ins_h<<x.hash_shift^x.window[D+1])&x.hash_mask;x.insert&&(x.ins_h=(x.ins_h<<x.hash_shift^x.window[D+$-1])&x.hash_mask,x.prev[D&x.w_mask]=x.head[x.ins_h],x.head[x.ins_h]=D,D++,x.insert--,!(x.lookahead+x.insert<$)););}while(x.lookahead<q&&x.strm.avail_in!==0)}function $e(x,K){for(var H,O;;){if(x.lookahead<q){if(he(x),x.lookahead<q&&K===h)return _;if(x.lookahead===0)break}if(H=0,x.lookahead>=$&&(x.ins_h=(x.ins_h<<x.hash_shift^x.window[x.strstart+$-1])&x.hash_mask,H=x.prev[x.strstart&x.w_mask]=x.head[x.ins_h],x.head[x.ins_h]=x.strstart),H!==0&&x.strstart-H<=x.w_size-q&&(x.match_length=ee(x,H)),x.match_length>=$)if(O=o._tr_tally(x,x.strstart-x.match_start,x.match_length-$),x.lookahead-=x.match_length,x.match_length<=x.max_lazy_match&&x.lookahead>=$){for(x.match_length--;x.strstart++,x.ins_h=(x.ins_h<<x.hash_shift^x.window[x.strstart+$-1])&x.hash_mask,H=x.prev[x.strstart&x.w_mask]=x.head[x.ins_h],x.head[x.ins_h]=x.strstart,--x.match_length!=0;);x.strstart++}else x.strstart+=x.match_length,x.match_length=0,x.ins_h=x.window[x.strstart],x.ins_h=(x.ins_h<<x.hash_shift^x.window[x.strstart+1])&x.hash_mask;else O=o._tr_tally(x,0,x.window[x.strstart]),x.lookahead--,x.strstart++;if(O&&(I(x,!1),x.strm.avail_out===0))return _}return x.insert=x.strstart<$-1?x.strstart:$-1,K===f?(I(x,!0),x.strm.avail_out===0?ue:X):x.last_lit&&(I(x,!1),x.strm.avail_out===0)?_:W}function ye(x,K){for(var H,O,j;;){if(x.lookahead<q){if(he(x),x.lookahead<q&&K===h)return _;if(x.lookahead===0)break}if(H=0,x.lookahead>=$&&(x.ins_h=(x.ins_h<<x.hash_shift^x.window[x.strstart+$-1])&x.hash_mask,H=x.prev[x.strstart&x.w_mask]=x.head[x.ins_h],x.head[x.ins_h]=x.strstart),x.prev_length=x.match_length,x.prev_match=x.match_start,x.match_length=$-1,H!==0&&x.prev_length<x.max_lazy_match&&x.strstart-H<=x.w_size-q&&(x.match_length=ee(x,H),x.match_length<=5&&(x.strategy===1||x.match_length===$&&4096<x.strstart-x.match_start)&&(x.match_length=$-1)),x.prev_length>=$&&x.match_length<=x.prev_length){for(j=x.strstart+x.lookahead-$,O=o._tr_tally(x,x.strstart-1-x.prev_match,x.prev_length-$),x.lookahead-=x.prev_length-1,x.prev_length-=2;++x.strstart<=j&&(x.ins_h=(x.ins_h<<x.hash_shift^x.window[x.strstart+$-1])&x.hash_mask,H=x.prev[x.strstart&x.w_mask]=x.head[x.ins_h],x.head[x.ins_h]=x.strstart),--x.prev_length!=0;);if(x.match_available=0,x.match_length=$-1,x.strstart++,O&&(I(x,!1),x.strm.avail_out===0))return _}else if(x.match_available){if((O=o._tr_tally(x,0,x.window[x.strstart-1]))&&I(x,!1),x.strstart++,x.lookahead--,x.strm.avail_out===0)return _}else x.match_available=1,x.strstart++,x.lookahead--}return x.match_available&&(O=o._tr_tally(x,0,x.window[x.strstart-1]),x.match_available=0),x.insert=x.strstart<$-1?x.strstart:$-1,K===f?(I(x,!0),x.strm.avail_out===0?ue:X):x.last_lit&&(I(x,!1),x.strm.avail_out===0)?_:W}function we(x,K,H,O,j){this.good_length=x,this.max_lazy=K,this.nice_length=H,this.max_chain=O,this.func=j}function xe(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=g,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new s.Buf16(2*C),this.dyn_dtree=new s.Buf16(2*(2*E+1)),this.bl_tree=new s.Buf16(2*(2*k+1)),G(this.dyn_ltree),G(this.dyn_dtree),G(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new s.Buf16(N+1),this.heap=new s.Buf16(2*S+1),G(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new s.Buf16(2*S+1),G(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}function Ee(x){var K;return x&&x.state?(x.total_in=x.total_out=0,x.data_type=v,(K=x.state).pending=0,K.pending_out=0,K.wrap<0&&(K.wrap=-K.wrap),K.status=K.wrap?P:L,x.adler=K.wrap===2?0:1,K.last_flush=h,o._tr_init(K),p):U(x,y)}function Me(x){var K=Ee(x);return K===p&&function(H){H.window_size=2*H.w_size,G(H.head),H.max_lazy_match=a[H.level].max_lazy,H.good_match=a[H.level].good_length,H.nice_match=a[H.level].nice_length,H.max_chain_length=a[H.level].max_chain,H.strstart=0,H.block_start=0,H.lookahead=0,H.insert=0,H.match_length=H.prev_length=$-1,H.match_available=0,H.ins_h=0}(x.state),K}function Be(x,K,H,O,j,D){if(!x)return y;var Y=1;if(K===m&&(K=6),O<0?(Y=0,O=-O):15<O&&(Y=2,O-=16),j<1||w<j||H!==g||O<8||15<O||K<0||9<K||D<0||b<D)return U(x,y);O===8&&(O=9);var Z=new xe;return(x.state=Z).strm=x,Z.wrap=Y,Z.gzhead=null,Z.w_bits=O,Z.w_size=1<<Z.w_bits,Z.w_mask=Z.w_size-1,Z.hash_bits=j+7,Z.hash_size=1<<Z.hash_bits,Z.hash_mask=Z.hash_size-1,Z.hash_shift=~~((Z.hash_bits+$-1)/$),Z.window=new s.Buf8(2*Z.w_size),Z.head=new s.Buf16(Z.hash_size),Z.prev=new s.Buf16(Z.w_size),Z.lit_bufsize=1<<j+6,Z.pending_buf_size=4*Z.lit_bufsize,Z.pending_buf=new s.Buf8(Z.pending_buf_size),Z.d_buf=1*Z.lit_bufsize,Z.l_buf=3*Z.lit_bufsize,Z.level=K,Z.strategy=D,Z.method=H,Me(x)}a=[new we(0,0,0,0,function(x,K){var H=65535;for(H>x.pending_buf_size-5&&(H=x.pending_buf_size-5);;){if(x.lookahead<=1){if(he(x),x.lookahead===0&&K===h)return _;if(x.lookahead===0)break}x.strstart+=x.lookahead,x.lookahead=0;var O=x.block_start+H;if((x.strstart===0||x.strstart>=O)&&(x.lookahead=x.strstart-O,x.strstart=O,I(x,!1),x.strm.avail_out===0)||x.strstart-x.block_start>=x.w_size-q&&(I(x,!1),x.strm.avail_out===0))return _}return x.insert=0,K===f?(I(x,!0),x.strm.avail_out===0?ue:X):(x.strstart>x.block_start&&(I(x,!1),x.strm.avail_out),_)}),new we(4,4,8,4,$e),new we(4,5,16,8,$e),new we(4,6,32,32,$e),new we(4,4,16,16,ye),new we(8,16,32,32,ye),new we(8,16,128,128,ye),new we(8,32,128,256,ye),new we(32,128,258,1024,ye),new we(32,258,258,4096,ye)],i.deflateInit=function(x,K){return Be(x,K,g,15,8,0)},i.deflateInit2=Be,i.deflateReset=Me,i.deflateResetKeep=Ee,i.deflateSetHeader=function(x,K){return x&&x.state?x.state.wrap!==2?y:(x.state.gzhead=K,p):y},i.deflate=function(x,K){var H,O,j,D;if(!x||!x.state||5<K||K<0)return x?U(x,y):y;if(O=x.state,!x.output||!x.input&&x.avail_in!==0||O.status===666&&K!==f)return U(x,x.avail_out===0?-5:y);if(O.strm=x,H=O.last_flush,O.last_flush=K,O.status===P)if(O.wrap===2)x.adler=0,ae(O,31),ae(O,139),ae(O,8),O.gzhead?(ae(O,(O.gzhead.text?1:0)+(O.gzhead.hcrc?2:0)+(O.gzhead.extra?4:0)+(O.gzhead.name?8:0)+(O.gzhead.comment?16:0)),ae(O,255&O.gzhead.time),ae(O,O.gzhead.time>>8&255),ae(O,O.gzhead.time>>16&255),ae(O,O.gzhead.time>>24&255),ae(O,O.level===9?2:2<=O.strategy||O.level<2?4:0),ae(O,255&O.gzhead.os),O.gzhead.extra&&O.gzhead.extra.length&&(ae(O,255&O.gzhead.extra.length),ae(O,O.gzhead.extra.length>>8&255)),O.gzhead.hcrc&&(x.adler=c(x.adler,O.pending_buf,O.pending,0)),O.gzindex=0,O.status=69):(ae(O,0),ae(O,0),ae(O,0),ae(O,0),ae(O,0),ae(O,O.level===9?2:2<=O.strategy||O.level<2?4:0),ae(O,3),O.status=L);else{var Y=g+(O.w_bits-8<<4)<<8;Y|=(2<=O.strategy||O.level<2?0:O.level<6?1:O.level===6?2:3)<<6,O.strstart!==0&&(Y|=32),Y+=31-Y%31,O.status=L,te(O,Y),O.strstart!==0&&(te(O,x.adler>>>16),te(O,65535&x.adler)),x.adler=1}if(O.status===69)if(O.gzhead.extra){for(j=O.pending;O.gzindex<(65535&O.gzhead.extra.length)&&(O.pending!==O.pending_buf_size||(O.gzhead.hcrc&&O.pending>j&&(x.adler=c(x.adler,O.pending_buf,O.pending-j,j)),A(x),j=O.pending,O.pending!==O.pending_buf_size));)ae(O,255&O.gzhead.extra[O.gzindex]),O.gzindex++;O.gzhead.hcrc&&O.pending>j&&(x.adler=c(x.adler,O.pending_buf,O.pending-j,j)),O.gzindex===O.gzhead.extra.length&&(O.gzindex=0,O.status=73)}else O.status=73;if(O.status===73)if(O.gzhead.name){j=O.pending;do{if(O.pending===O.pending_buf_size&&(O.gzhead.hcrc&&O.pending>j&&(x.adler=c(x.adler,O.pending_buf,O.pending-j,j)),A(x),j=O.pending,O.pending===O.pending_buf_size)){D=1;break}D=O.gzindex<O.gzhead.name.length?255&O.gzhead.name.charCodeAt(O.gzindex++):0,ae(O,D)}while(D!==0);O.gzhead.hcrc&&O.pending>j&&(x.adler=c(x.adler,O.pending_buf,O.pending-j,j)),D===0&&(O.gzindex=0,O.status=91)}else O.status=91;if(O.status===91)if(O.gzhead.comment){j=O.pending;do{if(O.pending===O.pending_buf_size&&(O.gzhead.hcrc&&O.pending>j&&(x.adler=c(x.adler,O.pending_buf,O.pending-j,j)),A(x),j=O.pending,O.pending===O.pending_buf_size)){D=1;break}D=O.gzindex<O.gzhead.comment.length?255&O.gzhead.comment.charCodeAt(O.gzindex++):0,ae(O,D)}while(D!==0);O.gzhead.hcrc&&O.pending>j&&(x.adler=c(x.adler,O.pending_buf,O.pending-j,j)),D===0&&(O.status=103)}else O.status=103;if(O.status===103&&(O.gzhead.hcrc?(O.pending+2>O.pending_buf_size&&A(x),O.pending+2<=O.pending_buf_size&&(ae(O,255&x.adler),ae(O,x.adler>>8&255),x.adler=0,O.status=L)):O.status=L),O.pending!==0){if(A(x),x.avail_out===0)return O.last_flush=-1,p}else if(x.avail_in===0&&R(K)<=R(H)&&K!==f)return U(x,-5);if(O.status===666&&x.avail_in!==0)return U(x,-5);if(x.avail_in!==0||O.lookahead!==0||K!==h&&O.status!==666){var Z=O.strategy===2?function(F,ne){for(var ce;;){if(F.lookahead===0&&(he(F),F.lookahead===0)){if(ne===h)return _;break}if(F.match_length=0,ce=o._tr_tally(F,0,F.window[F.strstart]),F.lookahead--,F.strstart++,ce&&(I(F,!1),F.strm.avail_out===0))return _}return F.insert=0,ne===f?(I(F,!0),F.strm.avail_out===0?ue:X):F.last_lit&&(I(F,!1),F.strm.avail_out===0)?_:W}(O,K):O.strategy===3?function(F,ne){for(var ce,ie,M,J,Q=F.window;;){if(F.lookahead<=B){if(he(F),F.lookahead<=B&&ne===h)return _;if(F.lookahead===0)break}if(F.match_length=0,F.lookahead>=$&&0<F.strstart&&(ie=Q[M=F.strstart-1])===Q[++M]&&ie===Q[++M]&&ie===Q[++M]){J=F.strstart+B;do;while(ie===Q[++M]&&ie===Q[++M]&&ie===Q[++M]&&ie===Q[++M]&&ie===Q[++M]&&ie===Q[++M]&&ie===Q[++M]&&ie===Q[++M]&&M<J);F.match_length=B-(J-M),F.match_length>F.lookahead&&(F.match_length=F.lookahead)}if(F.match_length>=$?(ce=o._tr_tally(F,1,F.match_length-$),F.lookahead-=F.match_length,F.strstart+=F.match_length,F.match_length=0):(ce=o._tr_tally(F,0,F.window[F.strstart]),F.lookahead--,F.strstart++),ce&&(I(F,!1),F.strm.avail_out===0))return _}return F.insert=0,ne===f?(I(F,!0),F.strm.avail_out===0?ue:X):F.last_lit&&(I(F,!1),F.strm.avail_out===0)?_:W}(O,K):a[O.level].func(O,K);if(Z!==ue&&Z!==X||(O.status=666),Z===_||Z===ue)return x.avail_out===0&&(O.last_flush=-1),p;if(Z===W&&(K===1?o._tr_align(O):K!==5&&(o._tr_stored_block(O,0,0,!1),K===3&&(G(O.head),O.lookahead===0&&(O.strstart=0,O.block_start=0,O.insert=0))),A(x),x.avail_out===0))return O.last_flush=-1,p}return K!==f?p:O.wrap<=0?1:(O.wrap===2?(ae(O,255&x.adler),ae(O,x.adler>>8&255),ae(O,x.adler>>16&255),ae(O,x.adler>>24&255),ae(O,255&x.total_in),ae(O,x.total_in>>8&255),ae(O,x.total_in>>16&255),ae(O,x.total_in>>24&255)):(te(O,x.adler>>>16),te(O,65535&x.adler)),A(x),0<O.wrap&&(O.wrap=-O.wrap),O.pending!==0?p:1)},i.deflateEnd=function(x){var K;return x&&x.state?(K=x.state.status)!==P&&K!==69&&K!==73&&K!==91&&K!==103&&K!==L&&K!==666?U(x,y):(x.state=null,K===L?U(x,-3):p):y},i.deflateSetDictionary=function(x,K){var H,O,j,D,Y,Z,F,ne,ce=K.length;if(!x||!x.state||(D=(H=x.state).wrap)===2||D===1&&H.status!==P||H.lookahead)return y;for(D===1&&(x.adler=l(x.adler,K,ce,0)),H.wrap=0,ce>=H.w_size&&(D===0&&(G(H.head),H.strstart=0,H.block_start=0,H.insert=0),ne=new s.Buf8(H.w_size),s.arraySet(ne,K,ce-H.w_size,H.w_size,0),K=ne,ce=H.w_size),Y=x.avail_in,Z=x.next_in,F=x.input,x.avail_in=ce,x.next_in=0,x.input=K,he(H);H.lookahead>=$;){for(O=H.strstart,j=H.lookahead-($-1);H.ins_h=(H.ins_h<<H.hash_shift^H.window[O+$-1])&H.hash_mask,H.prev[O&H.w_mask]=H.head[H.ins_h],H.head[H.ins_h]=O,O++,--j;);H.strstart=O,H.lookahead=$-1,he(H)}return H.strstart+=H.lookahead,H.block_start=H.strstart,H.insert=H.lookahead,H.lookahead=0,H.match_length=H.prev_length=$-1,H.match_available=0,x.next_in=Z,x.input=F,x.avail_in=Y,H.wrap=D,p},i.deflateInfo="pako deflate (from Nodeca project)"},{"../utils/common":41,"./adler32":43,"./crc32":45,"./messages":51,"./trees":52}],47:[function(r,n,i){n.exports=function(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1}},{}],48:[function(r,n,i){n.exports=function(a,s){var o,l,c,d,h,f,p,y,m,b,v,g,w,S,E,k,C,N,$,B,q,P,L,_,W;o=a.state,l=a.next_in,_=a.input,c=l+(a.avail_in-5),d=a.next_out,W=a.output,h=d-(s-a.avail_out),f=d+(a.avail_out-257),p=o.dmax,y=o.wsize,m=o.whave,b=o.wnext,v=o.window,g=o.hold,w=o.bits,S=o.lencode,E=o.distcode,k=(1<<o.lenbits)-1,C=(1<<o.distbits)-1;e:do{w<15&&(g+=_[l++]<<w,w+=8,g+=_[l++]<<w,w+=8),N=S[g&k];t:for(;;){if(g>>>=$=N>>>24,w-=$,($=N>>>16&255)===0)W[d++]=65535&N;else{if(!(16&$)){if(!(64&$)){N=S[(65535&N)+(g&(1<<$)-1)];continue t}if(32&$){o.mode=12;break e}a.msg="invalid literal/length code",o.mode=30;break e}B=65535&N,($&=15)&&(w<$&&(g+=_[l++]<<w,w+=8),B+=g&(1<<$)-1,g>>>=$,w-=$),w<15&&(g+=_[l++]<<w,w+=8,g+=_[l++]<<w,w+=8),N=E[g&C];r:for(;;){if(g>>>=$=N>>>24,w-=$,!(16&($=N>>>16&255))){if(!(64&$)){N=E[(65535&N)+(g&(1<<$)-1)];continue r}a.msg="invalid distance code",o.mode=30;break e}if(q=65535&N,w<($&=15)&&(g+=_[l++]<<w,(w+=8)<$&&(g+=_[l++]<<w,w+=8)),p<(q+=g&(1<<$)-1)){a.msg="invalid distance too far back",o.mode=30;break e}if(g>>>=$,w-=$,($=d-h)<q){if(m<($=q-$)&&o.sane){a.msg="invalid distance too far back",o.mode=30;break e}if(L=v,(P=0)===b){if(P+=y-$,$<B){for(B-=$;W[d++]=v[P++],--$;);P=d-q,L=W}}else if(b<$){if(P+=y+b-$,($-=b)<B){for(B-=$;W[d++]=v[P++],--$;);if(P=0,b<B){for(B-=$=b;W[d++]=v[P++],--$;);P=d-q,L=W}}}else if(P+=b-$,$<B){for(B-=$;W[d++]=v[P++],--$;);P=d-q,L=W}for(;2<B;)W[d++]=L[P++],W[d++]=L[P++],W[d++]=L[P++],B-=3;B&&(W[d++]=L[P++],1<B&&(W[d++]=L[P++]))}else{for(P=d-q;W[d++]=W[P++],W[d++]=W[P++],W[d++]=W[P++],2<(B-=3););B&&(W[d++]=W[P++],1<B&&(W[d++]=W[P++]))}break}}break}}while(l<c&&d<f);l-=B=w>>3,g&=(1<<(w-=B<<3))-1,a.next_in=l,a.next_out=d,a.avail_in=l<c?c-l+5:5-(l-c),a.avail_out=d<f?f-d+257:257-(d-f),o.hold=g,o.bits=w}},{}],49:[function(r,n,i){var a=r("../utils/common"),s=r("./adler32"),o=r("./crc32"),l=r("./inffast"),c=r("./inftrees"),d=1,h=2,f=0,p=-2,y=1,m=852,b=592;function v(P){return(P>>>24&255)+(P>>>8&65280)+((65280&P)<<8)+((255&P)<<24)}function g(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new a.Buf16(320),this.work=new a.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function w(P){var L;return P&&P.state?(L=P.state,P.total_in=P.total_out=L.total=0,P.msg="",L.wrap&&(P.adler=1&L.wrap),L.mode=y,L.last=0,L.havedict=0,L.dmax=32768,L.head=null,L.hold=0,L.bits=0,L.lencode=L.lendyn=new a.Buf32(m),L.distcode=L.distdyn=new a.Buf32(b),L.sane=1,L.back=-1,f):p}function S(P){var L;return P&&P.state?((L=P.state).wsize=0,L.whave=0,L.wnext=0,w(P)):p}function E(P,L){var _,W;return P&&P.state?(W=P.state,L<0?(_=0,L=-L):(_=1+(L>>4),L<48&&(L&=15)),L&&(L<8||15<L)?p:(W.window!==null&&W.wbits!==L&&(W.window=null),W.wrap=_,W.wbits=L,S(P))):p}function k(P,L){var _,W;return P?(W=new g,(P.state=W).window=null,(_=E(P,L))!==f&&(P.state=null),_):p}var C,N,$=!0;function B(P){if($){var L;for(C=new a.Buf32(512),N=new a.Buf32(32),L=0;L<144;)P.lens[L++]=8;for(;L<256;)P.lens[L++]=9;for(;L<280;)P.lens[L++]=7;for(;L<288;)P.lens[L++]=8;for(c(d,P.lens,0,288,C,0,P.work,{bits:9}),L=0;L<32;)P.lens[L++]=5;c(h,P.lens,0,32,N,0,P.work,{bits:5}),$=!1}P.lencode=C,P.lenbits=9,P.distcode=N,P.distbits=5}function q(P,L,_,W){var ue,X=P.state;return X.window===null&&(X.wsize=1<<X.wbits,X.wnext=0,X.whave=0,X.window=new a.Buf8(X.wsize)),W>=X.wsize?(a.arraySet(X.window,L,_-X.wsize,X.wsize,0),X.wnext=0,X.whave=X.wsize):(W<(ue=X.wsize-X.wnext)&&(ue=W),a.arraySet(X.window,L,_-W,ue,X.wnext),(W-=ue)?(a.arraySet(X.window,L,_-W,W,0),X.wnext=W,X.whave=X.wsize):(X.wnext+=ue,X.wnext===X.wsize&&(X.wnext=0),X.whave<X.wsize&&(X.whave+=ue))),0}i.inflateReset=S,i.inflateReset2=E,i.inflateResetKeep=w,i.inflateInit=function(P){return k(P,15)},i.inflateInit2=k,i.inflate=function(P,L){var _,W,ue,X,U,R,G,A,I,ae,te,ee,he,$e,ye,we,xe,Ee,Me,Be,x,K,H,O,j=0,D=new a.Buf8(4),Y=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!P||!P.state||!P.output||!P.input&&P.avail_in!==0)return p;(_=P.state).mode===12&&(_.mode=13),U=P.next_out,ue=P.output,G=P.avail_out,X=P.next_in,W=P.input,R=P.avail_in,A=_.hold,I=_.bits,ae=R,te=G,K=f;e:for(;;)switch(_.mode){case y:if(_.wrap===0){_.mode=13;break}for(;I<16;){if(R===0)break e;R--,A+=W[X++]<<I,I+=8}if(2&_.wrap&&A===35615){D[_.check=0]=255&A,D[1]=A>>>8&255,_.check=o(_.check,D,2,0),I=A=0,_.mode=2;break}if(_.flags=0,_.head&&(_.head.done=!1),!(1&_.wrap)||(((255&A)<<8)+(A>>8))%31){P.msg="incorrect header check",_.mode=30;break}if((15&A)!=8){P.msg="unknown compression method",_.mode=30;break}if(I-=4,x=8+(15&(A>>>=4)),_.wbits===0)_.wbits=x;else if(x>_.wbits){P.msg="invalid window size",_.mode=30;break}_.dmax=1<<x,P.adler=_.check=1,_.mode=512&A?10:12,I=A=0;break;case 2:for(;I<16;){if(R===0)break e;R--,A+=W[X++]<<I,I+=8}if(_.flags=A,(255&_.flags)!=8){P.msg="unknown compression method",_.mode=30;break}if(57344&_.flags){P.msg="unknown header flags set",_.mode=30;break}_.head&&(_.head.text=A>>8&1),512&_.flags&&(D[0]=255&A,D[1]=A>>>8&255,_.check=o(_.check,D,2,0)),I=A=0,_.mode=3;case 3:for(;I<32;){if(R===0)break e;R--,A+=W[X++]<<I,I+=8}_.head&&(_.head.time=A),512&_.flags&&(D[0]=255&A,D[1]=A>>>8&255,D[2]=A>>>16&255,D[3]=A>>>24&255,_.check=o(_.check,D,4,0)),I=A=0,_.mode=4;case 4:for(;I<16;){if(R===0)break e;R--,A+=W[X++]<<I,I+=8}_.head&&(_.head.xflags=255&A,_.head.os=A>>8),512&_.flags&&(D[0]=255&A,D[1]=A>>>8&255,_.check=o(_.check,D,2,0)),I=A=0,_.mode=5;case 5:if(1024&_.flags){for(;I<16;){if(R===0)break e;R--,A+=W[X++]<<I,I+=8}_.length=A,_.head&&(_.head.extra_len=A),512&_.flags&&(D[0]=255&A,D[1]=A>>>8&255,_.check=o(_.check,D,2,0)),I=A=0}else _.head&&(_.head.extra=null);_.mode=6;case 6:if(1024&_.flags&&(R<(ee=_.length)&&(ee=R),ee&&(_.head&&(x=_.head.extra_len-_.length,_.head.extra||(_.head.extra=new Array(_.head.extra_len)),a.arraySet(_.head.extra,W,X,ee,x)),512&_.flags&&(_.check=o(_.check,W,ee,X)),R-=ee,X+=ee,_.length-=ee),_.length))break e;_.length=0,_.mode=7;case 7:if(2048&_.flags){if(R===0)break e;for(ee=0;x=W[X+ee++],_.head&&x&&_.length<65536&&(_.head.name+=String.fromCharCode(x)),x&&ee<R;);if(512&_.flags&&(_.check=o(_.check,W,ee,X)),R-=ee,X+=ee,x)break e}else _.head&&(_.head.name=null);_.length=0,_.mode=8;case 8:if(4096&_.flags){if(R===0)break e;for(ee=0;x=W[X+ee++],_.head&&x&&_.length<65536&&(_.head.comment+=String.fromCharCode(x)),x&&ee<R;);if(512&_.flags&&(_.check=o(_.check,W,ee,X)),R-=ee,X+=ee,x)break e}else _.head&&(_.head.comment=null);_.mode=9;case 9:if(512&_.flags){for(;I<16;){if(R===0)break e;R--,A+=W[X++]<<I,I+=8}if(A!==(65535&_.check)){P.msg="header crc mismatch",_.mode=30;break}I=A=0}_.head&&(_.head.hcrc=_.flags>>9&1,_.head.done=!0),P.adler=_.check=0,_.mode=12;break;case 10:for(;I<32;){if(R===0)break e;R--,A+=W[X++]<<I,I+=8}P.adler=_.check=v(A),I=A=0,_.mode=11;case 11:if(_.havedict===0)return P.next_out=U,P.avail_out=G,P.next_in=X,P.avail_in=R,_.hold=A,_.bits=I,2;P.adler=_.check=1,_.mode=12;case 12:if(L===5||L===6)break e;case 13:if(_.last){A>>>=7&I,I-=7&I,_.mode=27;break}for(;I<3;){if(R===0)break e;R--,A+=W[X++]<<I,I+=8}switch(_.last=1&A,I-=1,3&(A>>>=1)){case 0:_.mode=14;break;case 1:if(B(_),_.mode=20,L!==6)break;A>>>=2,I-=2;break e;case 2:_.mode=17;break;case 3:P.msg="invalid block type",_.mode=30}A>>>=2,I-=2;break;case 14:for(A>>>=7&I,I-=7&I;I<32;){if(R===0)break e;R--,A+=W[X++]<<I,I+=8}if((65535&A)!=(A>>>16^65535)){P.msg="invalid stored block lengths",_.mode=30;break}if(_.length=65535&A,I=A=0,_.mode=15,L===6)break e;case 15:_.mode=16;case 16:if(ee=_.length){if(R<ee&&(ee=R),G<ee&&(ee=G),ee===0)break e;a.arraySet(ue,W,X,ee,U),R-=ee,X+=ee,G-=ee,U+=ee,_.length-=ee;break}_.mode=12;break;case 17:for(;I<14;){if(R===0)break e;R--,A+=W[X++]<<I,I+=8}if(_.nlen=257+(31&A),A>>>=5,I-=5,_.ndist=1+(31&A),A>>>=5,I-=5,_.ncode=4+(15&A),A>>>=4,I-=4,286<_.nlen||30<_.ndist){P.msg="too many length or distance symbols",_.mode=30;break}_.have=0,_.mode=18;case 18:for(;_.have<_.ncode;){for(;I<3;){if(R===0)break e;R--,A+=W[X++]<<I,I+=8}_.lens[Y[_.have++]]=7&A,A>>>=3,I-=3}for(;_.have<19;)_.lens[Y[_.have++]]=0;if(_.lencode=_.lendyn,_.lenbits=7,H={bits:_.lenbits},K=c(0,_.lens,0,19,_.lencode,0,_.work,H),_.lenbits=H.bits,K){P.msg="invalid code lengths set",_.mode=30;break}_.have=0,_.mode=19;case 19:for(;_.have<_.nlen+_.ndist;){for(;we=(j=_.lencode[A&(1<<_.lenbits)-1])>>>16&255,xe=65535&j,!((ye=j>>>24)<=I);){if(R===0)break e;R--,A+=W[X++]<<I,I+=8}if(xe<16)A>>>=ye,I-=ye,_.lens[_.have++]=xe;else{if(xe===16){for(O=ye+2;I<O;){if(R===0)break e;R--,A+=W[X++]<<I,I+=8}if(A>>>=ye,I-=ye,_.have===0){P.msg="invalid bit length repeat",_.mode=30;break}x=_.lens[_.have-1],ee=3+(3&A),A>>>=2,I-=2}else if(xe===17){for(O=ye+3;I<O;){if(R===0)break e;R--,A+=W[X++]<<I,I+=8}I-=ye,x=0,ee=3+(7&(A>>>=ye)),A>>>=3,I-=3}else{for(O=ye+7;I<O;){if(R===0)break e;R--,A+=W[X++]<<I,I+=8}I-=ye,x=0,ee=11+(127&(A>>>=ye)),A>>>=7,I-=7}if(_.have+ee>_.nlen+_.ndist){P.msg="invalid bit length repeat",_.mode=30;break}for(;ee--;)_.lens[_.have++]=x}}if(_.mode===30)break;if(_.lens[256]===0){P.msg="invalid code -- missing end-of-block",_.mode=30;break}if(_.lenbits=9,H={bits:_.lenbits},K=c(d,_.lens,0,_.nlen,_.lencode,0,_.work,H),_.lenbits=H.bits,K){P.msg="invalid literal/lengths set",_.mode=30;break}if(_.distbits=6,_.distcode=_.distdyn,H={bits:_.distbits},K=c(h,_.lens,_.nlen,_.ndist,_.distcode,0,_.work,H),_.distbits=H.bits,K){P.msg="invalid distances set",_.mode=30;break}if(_.mode=20,L===6)break e;case 20:_.mode=21;case 21:if(6<=R&&258<=G){P.next_out=U,P.avail_out=G,P.next_in=X,P.avail_in=R,_.hold=A,_.bits=I,l(P,te),U=P.next_out,ue=P.output,G=P.avail_out,X=P.next_in,W=P.input,R=P.avail_in,A=_.hold,I=_.bits,_.mode===12&&(_.back=-1);break}for(_.back=0;we=(j=_.lencode[A&(1<<_.lenbits)-1])>>>16&255,xe=65535&j,!((ye=j>>>24)<=I);){if(R===0)break e;R--,A+=W[X++]<<I,I+=8}if(we&&!(240&we)){for(Ee=ye,Me=we,Be=xe;we=(j=_.lencode[Be+((A&(1<<Ee+Me)-1)>>Ee)])>>>16&255,xe=65535&j,!(Ee+(ye=j>>>24)<=I);){if(R===0)break e;R--,A+=W[X++]<<I,I+=8}A>>>=Ee,I-=Ee,_.back+=Ee}if(A>>>=ye,I-=ye,_.back+=ye,_.length=xe,we===0){_.mode=26;break}if(32&we){_.back=-1,_.mode=12;break}if(64&we){P.msg="invalid literal/length code",_.mode=30;break}_.extra=15&we,_.mode=22;case 22:if(_.extra){for(O=_.extra;I<O;){if(R===0)break e;R--,A+=W[X++]<<I,I+=8}_.length+=A&(1<<_.extra)-1,A>>>=_.extra,I-=_.extra,_.back+=_.extra}_.was=_.length,_.mode=23;case 23:for(;we=(j=_.distcode[A&(1<<_.distbits)-1])>>>16&255,xe=65535&j,!((ye=j>>>24)<=I);){if(R===0)break e;R--,A+=W[X++]<<I,I+=8}if(!(240&we)){for(Ee=ye,Me=we,Be=xe;we=(j=_.distcode[Be+((A&(1<<Ee+Me)-1)>>Ee)])>>>16&255,xe=65535&j,!(Ee+(ye=j>>>24)<=I);){if(R===0)break e;R--,A+=W[X++]<<I,I+=8}A>>>=Ee,I-=Ee,_.back+=Ee}if(A>>>=ye,I-=ye,_.back+=ye,64&we){P.msg="invalid distance code",_.mode=30;break}_.offset=xe,_.extra=15&we,_.mode=24;case 24:if(_.extra){for(O=_.extra;I<O;){if(R===0)break e;R--,A+=W[X++]<<I,I+=8}_.offset+=A&(1<<_.extra)-1,A>>>=_.extra,I-=_.extra,_.back+=_.extra}if(_.offset>_.dmax){P.msg="invalid distance too far back",_.mode=30;break}_.mode=25;case 25:if(G===0)break e;if(ee=te-G,_.offset>ee){if((ee=_.offset-ee)>_.whave&&_.sane){P.msg="invalid distance too far back",_.mode=30;break}he=ee>_.wnext?(ee-=_.wnext,_.wsize-ee):_.wnext-ee,ee>_.length&&(ee=_.length),$e=_.window}else $e=ue,he=U-_.offset,ee=_.length;for(G<ee&&(ee=G),G-=ee,_.length-=ee;ue[U++]=$e[he++],--ee;);_.length===0&&(_.mode=21);break;case 26:if(G===0)break e;ue[U++]=_.length,G--,_.mode=21;break;case 27:if(_.wrap){for(;I<32;){if(R===0)break e;R--,A|=W[X++]<<I,I+=8}if(te-=G,P.total_out+=te,_.total+=te,te&&(P.adler=_.check=_.flags?o(_.check,ue,te,U-te):s(_.check,ue,te,U-te)),te=G,(_.flags?A:v(A))!==_.check){P.msg="incorrect data check",_.mode=30;break}I=A=0}_.mode=28;case 28:if(_.wrap&&_.flags){for(;I<32;){if(R===0)break e;R--,A+=W[X++]<<I,I+=8}if(A!==(4294967295&_.total)){P.msg="incorrect length check",_.mode=30;break}I=A=0}_.mode=29;case 29:K=1;break e;case 30:K=-3;break e;case 31:return-4;case 32:default:return p}return P.next_out=U,P.avail_out=G,P.next_in=X,P.avail_in=R,_.hold=A,_.bits=I,(_.wsize||te!==P.avail_out&&_.mode<30&&(_.mode<27||L!==4))&&q(P,P.output,P.next_out,te-P.avail_out)?(_.mode=31,-4):(ae-=P.avail_in,te-=P.avail_out,P.total_in+=ae,P.total_out+=te,_.total+=te,_.wrap&&te&&(P.adler=_.check=_.flags?o(_.check,ue,te,P.next_out-te):s(_.check,ue,te,P.next_out-te)),P.data_type=_.bits+(_.last?64:0)+(_.mode===12?128:0)+(_.mode===20||_.mode===15?256:0),(ae==0&&te===0||L===4)&&K===f&&(K=-5),K)},i.inflateEnd=function(P){if(!P||!P.state)return p;var L=P.state;return L.window&&(L.window=null),P.state=null,f},i.inflateGetHeader=function(P,L){var _;return P&&P.state&&2&(_=P.state).wrap?((_.head=L).done=!1,f):p},i.inflateSetDictionary=function(P,L){var _,W=L.length;return P&&P.state?(_=P.state).wrap!==0&&_.mode!==11?p:_.mode===11&&s(1,L,W,0)!==_.check?-3:q(P,L,W,W)?(_.mode=31,-4):(_.havedict=1,f):p},i.inflateInfo="pako inflate (from Nodeca project)"},{"../utils/common":41,"./adler32":43,"./crc32":45,"./inffast":48,"./inftrees":50}],50:[function(r,n,i){var a=r("../utils/common"),s=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],o=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],l=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],c=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];n.exports=function(d,h,f,p,y,m,b,v){var g,w,S,E,k,C,N,$,B,q=v.bits,P=0,L=0,_=0,W=0,ue=0,X=0,U=0,R=0,G=0,A=0,I=null,ae=0,te=new a.Buf16(16),ee=new a.Buf16(16),he=null,$e=0;for(P=0;P<=15;P++)te[P]=0;for(L=0;L<p;L++)te[h[f+L]]++;for(ue=q,W=15;1<=W&&te[W]===0;W--);if(W<ue&&(ue=W),W===0)return y[m++]=20971520,y[m++]=20971520,v.bits=1,0;for(_=1;_<W&&te[_]===0;_++);for(ue<_&&(ue=_),P=R=1;P<=15;P++)if(R<<=1,(R-=te[P])<0)return-1;if(0<R&&(d===0||W!==1))return-1;for(ee[1]=0,P=1;P<15;P++)ee[P+1]=ee[P]+te[P];for(L=0;L<p;L++)h[f+L]!==0&&(b[ee[h[f+L]]++]=L);if(C=d===0?(I=he=b,19):d===1?(I=s,ae-=257,he=o,$e-=257,256):(I=l,he=c,-1),P=_,k=m,U=L=A=0,S=-1,E=(G=1<<(X=ue))-1,d===1&&852<G||d===2&&592<G)return 1;for(;;){for(N=P-U,B=b[L]<C?($=0,b[L]):b[L]>C?($=he[$e+b[L]],I[ae+b[L]]):($=96,0),g=1<<P-U,_=w=1<<X;y[k+(A>>U)+(w-=g)]=N<<24|$<<16|B|0,w!==0;);for(g=1<<P-1;A&g;)g>>=1;if(g!==0?(A&=g-1,A+=g):A=0,L++,--te[P]==0){if(P===W)break;P=h[f+b[L]]}if(ue<P&&(A&E)!==S){for(U===0&&(U=ue),k+=_,R=1<<(X=P-U);X+U<W&&!((R-=te[X+U])<=0);)X++,R<<=1;if(G+=1<<X,d===1&&852<G||d===2&&592<G)return 1;y[S=A&E]=ue<<24|X<<16|k-m|0}}return A!==0&&(y[k+A]=P-U<<24|64<<16|0),v.bits=ue,0}},{"../utils/common":41}],51:[function(r,n,i){n.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"}},{}],52:[function(r,n,i){var a=r("../utils/common"),s=0,o=1;function l(j){for(var D=j.length;0<=--D;)j[D]=0}var c=0,d=29,h=256,f=h+1+d,p=30,y=19,m=2*f+1,b=15,v=16,g=7,w=256,S=16,E=17,k=18,C=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],N=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],$=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],B=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],q=new Array(2*(f+2));l(q);var P=new Array(2*p);l(P);var L=new Array(512);l(L);var _=new Array(256);l(_);var W=new Array(d);l(W);var ue,X,U,R=new Array(p);function G(j,D,Y,Z,F){this.static_tree=j,this.extra_bits=D,this.extra_base=Y,this.elems=Z,this.max_length=F,this.has_stree=j&&j.length}function A(j,D){this.dyn_tree=j,this.max_code=0,this.stat_desc=D}function I(j){return j<256?L[j]:L[256+(j>>>7)]}function ae(j,D){j.pending_buf[j.pending++]=255&D,j.pending_buf[j.pending++]=D>>>8&255}function te(j,D,Y){j.bi_valid>v-Y?(j.bi_buf|=D<<j.bi_valid&65535,ae(j,j.bi_buf),j.bi_buf=D>>v-j.bi_valid,j.bi_valid+=Y-v):(j.bi_buf|=D<<j.bi_valid&65535,j.bi_valid+=Y)}function ee(j,D,Y){te(j,Y[2*D],Y[2*D+1])}function he(j,D){for(var Y=0;Y|=1&j,j>>>=1,Y<<=1,0<--D;);return Y>>>1}function $e(j,D,Y){var Z,F,ne=new Array(b+1),ce=0;for(Z=1;Z<=b;Z++)ne[Z]=ce=ce+Y[Z-1]<<1;for(F=0;F<=D;F++){var ie=j[2*F+1];ie!==0&&(j[2*F]=he(ne[ie]++,ie))}}function ye(j){var D;for(D=0;D<f;D++)j.dyn_ltree[2*D]=0;for(D=0;D<p;D++)j.dyn_dtree[2*D]=0;for(D=0;D<y;D++)j.bl_tree[2*D]=0;j.dyn_ltree[2*w]=1,j.opt_len=j.static_len=0,j.last_lit=j.matches=0}function we(j){8<j.bi_valid?ae(j,j.bi_buf):0<j.bi_valid&&(j.pending_buf[j.pending++]=j.bi_buf),j.bi_buf=0,j.bi_valid=0}function xe(j,D,Y,Z){var F=2*D,ne=2*Y;return j[F]<j[ne]||j[F]===j[ne]&&Z[D]<=Z[Y]}function Ee(j,D,Y){for(var Z=j.heap[Y],F=Y<<1;F<=j.heap_len&&(F<j.heap_len&&xe(D,j.heap[F+1],j.heap[F],j.depth)&&F++,!xe(D,Z,j.heap[F],j.depth));)j.heap[Y]=j.heap[F],Y=F,F<<=1;j.heap[Y]=Z}function Me(j,D,Y){var Z,F,ne,ce,ie=0;if(j.last_lit!==0)for(;Z=j.pending_buf[j.d_buf+2*ie]<<8|j.pending_buf[j.d_buf+2*ie+1],F=j.pending_buf[j.l_buf+ie],ie++,Z===0?ee(j,F,D):(ee(j,(ne=_[F])+h+1,D),(ce=C[ne])!==0&&te(j,F-=W[ne],ce),ee(j,ne=I(--Z),Y),(ce=N[ne])!==0&&te(j,Z-=R[ne],ce)),ie<j.last_lit;);ee(j,w,D)}function Be(j,D){var Y,Z,F,ne=D.dyn_tree,ce=D.stat_desc.static_tree,ie=D.stat_desc.has_stree,M=D.stat_desc.elems,J=-1;for(j.heap_len=0,j.heap_max=m,Y=0;Y<M;Y++)ne[2*Y]!==0?(j.heap[++j.heap_len]=J=Y,j.depth[Y]=0):ne[2*Y+1]=0;for(;j.heap_len<2;)ne[2*(F=j.heap[++j.heap_len]=J<2?++J:0)]=1,j.depth[F]=0,j.opt_len--,ie&&(j.static_len-=ce[2*F+1]);for(D.max_code=J,Y=j.heap_len>>1;1<=Y;Y--)Ee(j,ne,Y);for(F=M;Y=j.heap[1],j.heap[1]=j.heap[j.heap_len--],Ee(j,ne,1),Z=j.heap[1],j.heap[--j.heap_max]=Y,j.heap[--j.heap_max]=Z,ne[2*F]=ne[2*Y]+ne[2*Z],j.depth[F]=(j.depth[Y]>=j.depth[Z]?j.depth[Y]:j.depth[Z])+1,ne[2*Y+1]=ne[2*Z+1]=F,j.heap[1]=F++,Ee(j,ne,1),2<=j.heap_len;);j.heap[--j.heap_max]=j.heap[1],function(Q,ge){var Te,Oe,Re,fe,Ie,Le,Ge=ge.dyn_tree,We=ge.max_code,ot=ge.stat_desc.static_tree,je=ge.stat_desc.has_stree,Ue=ge.stat_desc.extra_bits,rt=ge.stat_desc.extra_base,ut=ge.stat_desc.max_length,Nt=0;for(fe=0;fe<=b;fe++)Q.bl_count[fe]=0;for(Ge[2*Q.heap[Q.heap_max]+1]=0,Te=Q.heap_max+1;Te<m;Te++)ut<(fe=Ge[2*Ge[2*(Oe=Q.heap[Te])+1]+1]+1)&&(fe=ut,Nt++),Ge[2*Oe+1]=fe,We<Oe||(Q.bl_count[fe]++,Ie=0,rt<=Oe&&(Ie=Ue[Oe-rt]),Le=Ge[2*Oe],Q.opt_len+=Le*(fe+Ie),je&&(Q.static_len+=Le*(ot[2*Oe+1]+Ie)));if(Nt!==0){do{for(fe=ut-1;Q.bl_count[fe]===0;)fe--;Q.bl_count[fe]--,Q.bl_count[fe+1]+=2,Q.bl_count[ut]--,Nt-=2}while(0<Nt);for(fe=ut;fe!==0;fe--)for(Oe=Q.bl_count[fe];Oe!==0;)We<(Re=Q.heap[--Te])||(Ge[2*Re+1]!==fe&&(Q.opt_len+=(fe-Ge[2*Re+1])*Ge[2*Re],Ge[2*Re+1]=fe),Oe--)}}(j,D),$e(ne,J,j.bl_count)}function x(j,D,Y){var Z,F,ne=-1,ce=D[1],ie=0,M=7,J=4;for(ce===0&&(M=138,J=3),D[2*(Y+1)+1]=65535,Z=0;Z<=Y;Z++)F=ce,ce=D[2*(Z+1)+1],++ie<M&&F===ce||(ie<J?j.bl_tree[2*F]+=ie:F!==0?(F!==ne&&j.bl_tree[2*F]++,j.bl_tree[2*S]++):ie<=10?j.bl_tree[2*E]++:j.bl_tree[2*k]++,ne=F,J=(ie=0)===ce?(M=138,3):F===ce?(M=6,3):(M=7,4))}function K(j,D,Y){var Z,F,ne=-1,ce=D[1],ie=0,M=7,J=4;for(ce===0&&(M=138,J=3),Z=0;Z<=Y;Z++)if(F=ce,ce=D[2*(Z+1)+1],!(++ie<M&&F===ce)){if(ie<J)for(;ee(j,F,j.bl_tree),--ie!=0;);else F!==0?(F!==ne&&(ee(j,F,j.bl_tree),ie--),ee(j,S,j.bl_tree),te(j,ie-3,2)):ie<=10?(ee(j,E,j.bl_tree),te(j,ie-3,3)):(ee(j,k,j.bl_tree),te(j,ie-11,7));ne=F,J=(ie=0)===ce?(M=138,3):F===ce?(M=6,3):(M=7,4)}}l(R);var H=!1;function O(j,D,Y,Z){te(j,(c<<1)+(Z?1:0),3),function(F,ne,ce,ie){we(F),ae(F,ce),ae(F,~ce),a.arraySet(F.pending_buf,F.window,ne,ce,F.pending),F.pending+=ce}(j,D,Y)}i._tr_init=function(j){H||(function(){var D,Y,Z,F,ne,ce=new Array(b+1);for(F=Z=0;F<d-1;F++)for(W[F]=Z,D=0;D<1<<C[F];D++)_[Z++]=F;for(_[Z-1]=F,F=ne=0;F<16;F++)for(R[F]=ne,D=0;D<1<<N[F];D++)L[ne++]=F;for(ne>>=7;F<p;F++)for(R[F]=ne<<7,D=0;D<1<<N[F]-7;D++)L[256+ne++]=F;for(Y=0;Y<=b;Y++)ce[Y]=0;for(D=0;D<=143;)q[2*D+1]=8,D++,ce[8]++;for(;D<=255;)q[2*D+1]=9,D++,ce[9]++;for(;D<=279;)q[2*D+1]=7,D++,ce[7]++;for(;D<=287;)q[2*D+1]=8,D++,ce[8]++;for($e(q,f+1,ce),D=0;D<p;D++)P[2*D+1]=5,P[2*D]=he(D,5);ue=new G(q,C,h+1,f,b),X=new G(P,N,0,p,b),U=new G(new Array(0),$,0,y,g)}(),H=!0),j.l_desc=new A(j.dyn_ltree,ue),j.d_desc=new A(j.dyn_dtree,X),j.bl_desc=new A(j.bl_tree,U),j.bi_buf=0,j.bi_valid=0,ye(j)},i._tr_stored_block=O,i._tr_flush_block=function(j,D,Y,Z){var F,ne,ce=0;0<j.level?(j.strm.data_type===2&&(j.strm.data_type=function(ie){var M,J=4093624447;for(M=0;M<=31;M++,J>>>=1)if(1&J&&ie.dyn_ltree[2*M]!==0)return s;if(ie.dyn_ltree[18]!==0||ie.dyn_ltree[20]!==0||ie.dyn_ltree[26]!==0)return o;for(M=32;M<h;M++)if(ie.dyn_ltree[2*M]!==0)return o;return s}(j)),Be(j,j.l_desc),Be(j,j.d_desc),ce=function(ie){var M;for(x(ie,ie.dyn_ltree,ie.l_desc.max_code),x(ie,ie.dyn_dtree,ie.d_desc.max_code),Be(ie,ie.bl_desc),M=y-1;3<=M&&ie.bl_tree[2*B[M]+1]===0;M--);return ie.opt_len+=3*(M+1)+5+5+4,M}(j),F=j.opt_len+3+7>>>3,(ne=j.static_len+3+7>>>3)<=F&&(F=ne)):F=ne=Y+5,Y+4<=F&&D!==-1?O(j,D,Y,Z):j.strategy===4||ne===F?(te(j,2+(Z?1:0),3),Me(j,q,P)):(te(j,4+(Z?1:0),3),function(ie,M,J,Q){var ge;for(te(ie,M-257,5),te(ie,J-1,5),te(ie,Q-4,4),ge=0;ge<Q;ge++)te(ie,ie.bl_tree[2*B[ge]+1],3);K(ie,ie.dyn_ltree,M-1),K(ie,ie.dyn_dtree,J-1)}(j,j.l_desc.max_code+1,j.d_desc.max_code+1,ce+1),Me(j,j.dyn_ltree,j.dyn_dtree)),ye(j),Z&&we(j)},i._tr_tally=function(j,D,Y){return j.pending_buf[j.d_buf+2*j.last_lit]=D>>>8&255,j.pending_buf[j.d_buf+2*j.last_lit+1]=255&D,j.pending_buf[j.l_buf+j.last_lit]=255&Y,j.last_lit++,D===0?j.dyn_ltree[2*Y]++:(j.matches++,D--,j.dyn_ltree[2*(_[Y]+h+1)]++,j.dyn_dtree[2*I(D)]++),j.last_lit===j.lit_bufsize-1},i._tr_align=function(j){te(j,2,3),ee(j,w,q),function(D){D.bi_valid===16?(ae(D,D.bi_buf),D.bi_buf=0,D.bi_valid=0):8<=D.bi_valid&&(D.pending_buf[D.pending++]=255&D.bi_buf,D.bi_buf>>=8,D.bi_valid-=8)}(j)}},{"../utils/common":41}],53:[function(r,n,i){n.exports=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}},{}],54:[function(r,n,i){(function(a){(function(s,o){if(!s.setImmediate){var l,c,d,h,f=1,p={},y=!1,m=s.document,b=Object.getPrototypeOf&&Object.getPrototypeOf(s);b=b&&b.setTimeout?b:s,l={}.toString.call(s.process)==="[object process]"?function(S){process.nextTick(function(){g(S)})}:function(){if(s.postMessage&&!s.importScripts){var S=!0,E=s.onmessage;return s.onmessage=function(){S=!1},s.postMessage("","*"),s.onmessage=E,S}}()?(h="setImmediate$"+Math.random()+"$",s.addEventListener?s.addEventListener("message",w,!1):s.attachEvent("onmessage",w),function(S){s.postMessage(h+S,"*")}):s.MessageChannel?((d=new MessageChannel).port1.onmessage=function(S){g(S.data)},function(S){d.port2.postMessage(S)}):m&&"onreadystatechange"in m.createElement("script")?(c=m.documentElement,function(S){var E=m.createElement("script");E.onreadystatechange=function(){g(S),E.onreadystatechange=null,c.removeChild(E),E=null},c.appendChild(E)}):function(S){setTimeout(g,0,S)},b.setImmediate=function(S){typeof S!="function"&&(S=new Function(""+S));for(var E=new Array(arguments.length-1),k=0;k<E.length;k++)E[k]=arguments[k+1];var C={callback:S,args:E};return p[f]=C,l(f),f++},b.clearImmediate=v}function v(S){delete p[S]}function g(S){if(y)setTimeout(g,0,S);else{var E=p[S];if(E){y=!0;try{(function(k){var C=k.callback,N=k.args;switch(N.length){case 0:C();break;case 1:C(N[0]);break;case 2:C(N[0],N[1]);break;case 3:C(N[0],N[1],N[2]);break;default:C.apply(o,N)}})(E)}finally{v(S),y=!1}}}}function w(S){S.source===s&&typeof S.data=="string"&&S.data.indexOf(h)===0&&g(+S.data.slice(h.length))}})(typeof self>"u"?a===void 0?this:a:self)}).call(this,typeof tn<"u"?tn:typeof self<"u"?self:typeof window<"u"?window:{})},{}]},{},[10])(10)})})(Cw);var Lz=Cw.exports;const Fz=ad(Lz);function Bz(t){let e="",r=t;for(;r>=0;)e=String.fromCharCode(r%26+65)+e,r=Math.floor(r/26)-1;return e}function Uz(t,e){return`${Bz(t)}${e+1}`}async function Hz(t,e,r="design"){const i=Math.ceil(e.width/1e3),a=Math.ceil(e.length/1e3);console.log(`[SLICER] Creating ${i}×${a} grid (${i*a} tiles) for ${e.width}mm × ${e.length}mm design`);const l=new DOMParser().parseFromString(t,"image/svg+xml").querySelector("svg");if(!l)throw new Error("Invalid SVG content");const c=l.getAttribute("viewBox");let d,h;if(c){const C=c.split(/\s+/).map(Number);d=C[2],h=C[3]}else d=parseFloat(l.getAttribute("width"))||1024,h=parseFloat(l.getAttribute("height"))||1024;console.log(`[SLICER] SVG internal dimensions: ${d} × ${h}`);const f=d/e.width,p=h/e.length,y=1e3*f,m=1e3*p;console.log(`[SLICER] Tile size in SVG units: ${y} × ${m}`);const b=l.innerHTML,v=l.getAttribute("xmlns")||"http://www.w3.org/2000/svg",g=new Fz,w=g.folder("tiles"),S=[];for(let C=0;C<a;C++){const N=[];for(let $=0;$<i;$++){const B=Uz($,C);N.push(B);const q=$*y,P=C*m,L=`${q} ${P} ${y} ${m}`,_=`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="${v}" viewBox="${L}" width="1000mm" height="1000mm">
  <defs>
    <clipPath id="tile-clip">
      <rect x="${q}" y="${P}" width="${y}" height="${m}"/>
    </clipPath>
  </defs>
  <g clip-path="url(#tile-clip)">
${b}
  </g>
</svg>`,W=`${Tw(r)}_${B}.svg`;w.file(W,_)}S.push(N)}const E=Gz(S,e,r);g.file("layout-guide.txt",E);const k=await g.generateAsync({type:"blob"});return console.log(`[SLICER] Created ZIP with ${i*a} tiles`),k}function Gz(t,e,r){const n=t.length,i=t[0].length;let a=`TPV Studio - Tile Layout Guide
================================

Design: ${r}
Total Size: ${e.width}mm × ${e.length}mm (${e.width/1e3}m × ${e.length/1e3}m)
Tile Size: 1000mm × 1000mm (1m × 1m)
Grid: ${i} columns × ${n} rows (${i*n} tiles)

Layout (view from above):
-------------------------

`;const s=6;a+="┌"+("─".repeat(s)+"┬").repeat(i-1)+"─".repeat(s)+`┐
`;for(let o=0;o<n;o++){a+="│";for(let l=0;l<i;l++){const c=t[o][l],d=s-c.length,h=Math.floor(d/2),f=d-h;a+=" ".repeat(h)+c+" ".repeat(f)+"│"}a+=`
`,o<n-1?a+="├"+("─".repeat(s)+"┼").repeat(i-1)+"─".repeat(s)+`┤
`:a+="└"+("─".repeat(s)+"┴").repeat(i-1)+"─".repeat(s)+`┘
`}return a+=`
Installation Notes:
-------------------
- Each tile is exactly 1m × 1m
- Tiles are named by column (A-Z) and row (1-${n})
- Start from top-left corner (A1) when laying out
- Tiles align perfectly when placed edge-to-edge
- Edge tiles may contain partial content if design isn't exactly divisible by 1m

Generated by TPV Studio
`,a}function Tw(t){return t.replace(/[<>:"/\\|?*]/g,"_").replace(/\s+/g,"-").substring(0,50)}function Vz(t,e){const r=URL.createObjectURL(t),n=document.createElement("a");n.href=r,n.download=e,document.body.appendChild(n),n.click(),document.body.removeChild(n),URL.revokeObjectURL(r)}async function Wz(t,e,r="design"){try{const n=await fetch(t);if(!n.ok)throw new Error(`Failed to fetch SVG: ${n.statusText}`);const i=await n.text(),a=await Hz(i,e,r),s=`${Tw(r)}-tiles-1mx1m.zip`;return Vz(a,s),console.log(`[SLICER] Downloaded ${s}`),!0}catch(n){throw console.error("[SLICER] Failed to download tiles:",n),n}}function Kz({loadedDesign:t,onDesignSaved:e}){const[r,n]=z.useState("prompt"),[i,a]=z.useState(""),[s,o]=z.useState(5e3),[l,c]=z.useState(5e3),[d,h]=z.useState(null),[f,p]=z.useState(null),[y,m]=z.useState(!1),[b,v]=z.useState(null),[g,w]=z.useState(!1),[S,E]=z.useState(null),[k,C]=z.useState(null),[N,$]=z.useState(null),[B,q]=z.useState(null),[P,L]=z.useState(""),[_,W]=z.useState(null),[ue,X]=z.useState(null),[U,R]=z.useState(!1),[G,A]=z.useState(null),[I,ae]=z.useState(null),[te,ee]=z.useState(!1),[he,$e]=z.useState("solid"),[ye,we]=z.useState(null),[xe,Ee]=z.useState(null),[Me,Be]=z.useState(null),[x,K]=z.useState(!1),[H,O]=z.useState(!1),[j,D]=z.useState(null),[Y,Z]=z.useState(new Map),[F,ne]=z.useState(new Map),[ce,ie]=z.useState(!1),[M,J]=z.useState(""),[Q,ge]=z.useState(!1),[Te,Oe]=z.useState(null),[Re,fe]=z.useState(!1),[Ie,Le]=z.useState(null),[Ge,We]=z.useState(!1),[ot,je]=z.useState(null),[Ue,rt]=z.useState(null),ut=z.useRef(null);z.useEffect(()=>{(xe||G)&&ut.current&&setTimeout(()=>{var V;(V=ut.current)==null||V.scrollIntoView({behavior:"smooth",block:"start"})},300)},[xe,G]),z.useEffect(()=>{r==="image"||r==="svg"?(c(null),o(null),console.log("[DIMENSION] Reset dimensions for upload mode:",r)):r==="prompt"&&(l===null||s===null)&&(c(5e3),o(5e3),console.log("[DIMENSION] Restored default dimensions for prompt mode"))},[r]),z.useEffect(()=>()=>{G&&G.startsWith("blob:")&&URL.revokeObjectURL(G),xe&&xe.startsWith("blob:")&&URL.revokeObjectURL(xe)},[]),z.useEffect(()=>{if(t){console.log("[INSPIRE] Loading design data:",t);const V=sz(t);console.log("[INSPIRE] Restored state:",V),n(V.inputMode),a(V.prompt),h(V.selectedFile),o(V.lengthMM),c(V.widthMM),$(V.result),X(V.blendRecipes),we(V.solidRecipes),ae(V.colorMapping),Be(V.solidColorMapping),Z(V.solidEditedColors),ne(V.blendEditedColors),A(V.blendSvgUrl),Ee(V.solidSvgUrl),$e(V.viewMode),v(V.arMapping),E(V.jobId),ee(V.showFinalRecipes),K(V.showSolidSummary),console.log("[INSPIRE] Loaded design:",t.name),t.name&&J(t.name),t.id&&Oe(t.id),setTimeout(async()=>{var de;if((de=V.result)!=null&&de.svg_url){console.log("[INSPIRE] Regenerating SVGs from loaded design");try{V.blendRecipes&&V.colorMapping&&await Fw(V.result.svg_url,V.colorMapping,V.blendRecipes,V.blendEditedColors),V.solidRecipes&&V.solidColorMapping&&await Bw(V.result.svg_url,V.solidColorMapping,V.solidRecipes,V.solidEditedColors)}catch(oe){console.error("[INSPIRE] Failed to regenerate SVGs:",oe),q("Failed to restore design preview. Please try reloading.")}}},100)}},[t]);const Nt=V=>{var _e;const de=(_e=V.target.files)==null?void 0:_e[0];if(!de){h(null);return}const Ne=Um(de,{maxSizeMB:10,allowedTypes:r==="image"?["image/png","image/jpeg"]:["image/svg+xml"]});if(!Ne.valid){q(Ne.error),h(null);return}h(de),q(null)},Zn=V=>{V.preventDefault(),V.stopPropagation(),m(!0)},rf=V=>{V.preventDefault(),V.stopPropagation(),V.currentTarget===V.target&&m(!1)},nf=V=>{V.preventDefault(),V.stopPropagation()},af=V=>{V.preventDefault(),V.stopPropagation(),m(!1);const de=V.dataTransfer.files;if(de&&de.length>0){const oe=de[0],_e=Um(oe,{maxSizeMB:10,allowedTypes:r==="image"?["image/png","image/jpeg"]:["image/svg+xml"]});if(!_e.valid){q(_e.error),h(null);return}h(oe),q(null)}},Ow=async()=>{var V,de;if(r==="prompt"&&!i.trim()){q("Please enter a design description");return}if((r==="image"||r==="svg")&&!d){q("Please select a file to upload");return}q(null),w(!0),C(null),$(null),E(null),L("Initialising..."),W(null);try{let oe;if(r==="svg"){L("Uploading SVG file..."),p("Uploading...");const Se=await Bm(d);if(!Se.success)throw new Error(Se.error||"Failed to upload file");if(L("Processing SVG..."),p(null),oe=await kn.processUploadedSVG({svg_url:Se.url}),!oe.success)throw new Error(oe.error||"Failed to process SVG");E(oe.jobId),L("✓ SVG uploaded successfully!"),w(!1);const le=await kn.getRecraftStatus(oe.jobId);C(le),$(le.result),(V=le.result)!=null&&V.svg_url&&await Wl(le.result.svg_url,oe.jobId);return}if(r==="image"){L("Uploading image..."),p("Uploading...");const Se=await Bm(d);if(!Se.success)throw new Error(Se.error||"Failed to upload file");if(L("Starting vectorisation..."),p(null),oe=await kn.vectorizeImage({image_url:Se.url}),!oe.success)throw new Error(oe.error||"Failed to start vectorisation");L("🎨 AI is vectorising your image...")}else{const Se=Dz(s,l);if(v(Se),console.log("[TPV-STUDIO] AR Mapping:",Se),console.log("[TPV-STUDIO] Layout:",Mz(Se)),zz(Se)?L(`Generating ${Se.canonical.name} design panel...`):L("Initialising..."),oe=await kn.generateRecraft({prompt:i.trim(),lengthMM:Se.recraft.height,widthMM:Se.recraft.width}),!oe.success)throw new Error(oe.error||"Failed to start generation");L("🎨 AI is creating your design...")}E(oe.jobId),L("Request submitted, waiting for processing...");let Ne=null,_e=Date.now();await kn.waitForRecraftCompletion(oe.jobId,Se=>{var Ae,He;C(Se);const le=Math.floor((Date.now()-_e)/1e3);if(Se.status==="queued"){const $t=[`🎨 Preparing your canvas... (${le}s)`,`✨ Warming up the AI brushes... (${le}s)`,`🎯 Queueing your masterpiece... (${le}s)`,`🖌️ Mixing digital paints... (${le}s)`,`💭 AI is contemplating your vision... (${le}s)`,`🌈 Selecting the perfect colours... (${le}s)`,`📐 Calculating vector paths... (${le}s)`,`⚡ Almost ready to create... (${le}s)`],Vr=Math.floor(le/4)%$t.length;L($t[Vr])}else if(Se.status==="running")if(Ne!=="running")L("🎨 AI is creating your design..."),Ne="running";else{const $t=[`🎨 Creating vector shapes... (${le}s)`,`🖌️ Applying colours and patterns... (${le}s)`,`✨ Refining design details... (${le}s)`,`🎯 Finalising artwork... (${le}s)`],Vr=Math.floor(le/5)%$t.length;L($t[Vr])}else if(Se.status==="retrying"){const $t=((Ae=Se.recraft)==null?void 0:Ae.attempt_current)||0,Vr=((He=Se.recraft)==null?void 0:He.attempt_max)||3;L(`⚡ Retrying generation (attempt ${$t}/${Vr})...`)}});const Pe=await kn.getRecraftStatus(oe.jobId);C(Pe),$(Pe.result),Pe.status==="completed"&&(L("✓ Design ready!"),w(!1),(de=Pe.result)!=null&&de.svg_url&&await Wl(Pe.result.svg_url,oe.jobId))}catch(oe){console.error("Generation failed:",oe),q(oe.message),L(""),w(!1)}},Pw=()=>{const V=he==="solid"?xe:G,de=he==="solid"?"tpv-solid":"tpv-blend";if(V){const oe=document.createElement("a");oe.href=V,oe.download=`${de}-${Date.now()}.svg`,document.body.appendChild(oe),oe.click(),document.body.removeChild(oe)}},Vl=async V=>{try{const oe=await(await fetch(V)).text(),Pe=new DOMParser().parseFromString(oe,"image/svg+xml").querySelector("svg");if(!Pe)return null;let Se,le;const Ae=Pe.getAttribute("viewBox");if(Ae){const $t=Ae.split(/\s+/).map(Number);Se=$t[2],le=$t[3]}else Se=parseFloat(Pe.getAttribute("width"))||1024,le=parseFloat(Pe.getAttribute("height"))||1024;const He=Se/le;return console.log(`[DIMENSION] Detected aspect ratio: ${He.toFixed(2)} (${Se}×${le})`),He}catch(de){return console.error("[DIMENSION] Failed to detect aspect ratio:",de),null}},Nw=(V,de)=>{console.log(`[DIMENSION] User confirmed dimensions: ${V}mm × ${de}mm`),c(V),o(de),Ue==="pdf"?setTimeout(()=>cf(V,de),100):Ue==="tiles"?setTimeout(()=>uf(V,de),100):Ue==="insitu"&&setTimeout(()=>fe(!0),100),rt(null)},sf=async()=>{const V=he==="solid"?xe:G;if((r==="image"||r==="svg")&&(!l||!s)){console.log("[DIMENSION] No dimensions set for image/SVG upload, showing modal...");const de=await Vl(V);if(de){je(de),rt("insitu"),We(!0);return}else{je(1),rt("insitu"),We(!0);return}}fe(!0)},$w=()=>{const V=he==="solid"?xe:G,de=he==="solid"?"tpv-solid":"tpv-blend";if(V){const oe=new Image;oe.onload=()=>{const Ne=document.createElement("canvas");Ne.width=oe.naturalWidth||1e3,Ne.height=oe.naturalHeight||1e3,Ne.getContext("2d").drawImage(oe,0,0),Ne.toBlob(Pe=>{const Se=URL.createObjectURL(Pe),le=document.createElement("a");le.href=Se,le.download=`${de}-${Date.now()}.png`,document.body.appendChild(le),le.click(),document.body.removeChild(le),URL.revokeObjectURL(Se)})},oe.src=V}},[of,lf]=z.useState(!1),Rw=async()=>{const V=he==="solid"?xe:G;if((r==="image"||r==="svg")&&(!l||!s)){console.log("[DIMENSION] No dimensions set for image/SVG upload, showing modal...");const de=await Vl(V);if(de){je(de),rt("pdf"),We(!0);return}else{je(1),rt("pdf"),We(!0);return}}await cf(l,s)},cf=async(V,de)=>{const oe=he==="solid"?xe:G,Ne=he==="solid"?ye:ue,_e=he==="solid"?"tpv-solid":"tpv-blend";if(!oe||!Ne){q("Cannot generate PDF: missing SVG or recipes");return}lf(!0),q(null);try{const Se=await(await fetch(oe)).text(),le=new AbortController,Ae=setTimeout(()=>le.abort(),3e4),He=await fetch("/api/export-pdf",{method:"POST",headers:{"Content-Type":"application/json"},signal:le.signal,body:JSON.stringify({svgString:Se,designName:M||i||"TPV Design",projectName:"TPV Studio",dimensions:{widthMM:V,lengthMM:de},recipes:Ne,mode:he,designId:S||""})});if(clearTimeout(Ae),!He.ok){const pf=He.headers.get("content-type");if(pf&&pf.includes("application/json")){const Kl=await He.json();throw new Error(Kl.message||"PDF generation failed")}else{const Kl=await He.text();throw console.error("PDF API error response:",Kl),new Error(`Server error: ${He.status}`)}}const $t=await He.blob(),Vr=URL.createObjectURL($t),ga=document.createElement("a");ga.href=Vr,ga.download=`${_e}-${Date.now()}.pdf`,document.body.appendChild(ga),ga.click(),document.body.removeChild(ga),URL.revokeObjectURL(Vr)}catch(Pe){console.error("PDF download error:",Pe),Pe.name==="AbortError"?q("PDF generation timed out. Please try again."):q(`PDF generation failed: ${Pe.message}`)}finally{lf(!1)}},Aw=async()=>{const V=he==="solid"?xe:G;if(!V){q("No SVG available to slice");return}if((r==="image"||r==="svg")&&(!l||!s)){console.log("[DIMENSION] No dimensions set for image/SVG upload, showing modal...");const de=await Vl(V);if(de){je(de),rt("tiles"),We(!0);return}else{je(1),rt("tiles"),We(!0);return}}await uf(l,s)},uf=async(V,de)=>{const oe=he==="solid"?xe:G;try{await Wz(oe,{width:V,length:de},M||"tpv-design")}catch(Ne){console.error("Tile download error:",Ne),q(`Failed to download tiles: ${Ne.message}`)}},Wl=async(V=null,de=null)=>{const oe=V||(N==null?void 0:N.svg_url),Ne=de||S;if(!oe){q("No SVG available to analyse");return}R(!0),q(null),L("🎨 Extracting colours from design..."),await new Promise(_e=>setTimeout(_e,100));try{const _e=await fetch("/api/blend-recipes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({svg_url:oe,job_id:Ne,max_colors:15,max_components:2})}),Pe=await _e.json();if(!_e.ok)throw new Error(Pe.error||"Failed to generate blend recipes");if(Pe.success){L("🔍 Matching TPV granule colours..."),await new Promise(le=>setTimeout(le,300)),X(Pe.recipes);const Se=Mm(Pe.recipes);ae(Se);try{L("✨ Generating TPV blend preview..."),await new Promise(He=>setTimeout(He,200)),console.log("[TPV-STUDIO] Generating recoloured SVG...");const{dataUrl:le,stats:Ae}=await ai(oe,Se);A(le),L("✓ TPV blend ready!"),console.log("[TPV-STUDIO] Recoloured SVG generated:",Ae),Dw(oe,Ne)}catch(le){console.error("[TPV-STUDIO] Failed to generate recoloured SVG:",le),q(`Recipes generated successfully, but SVG recolouring failed: ${le.message}`)}}else throw new Error(Pe.error||"Unknown error generating recipes")}catch(_e){console.error("Blend generation failed:",_e),q(_e.message),L("")}finally{R(!1)}},df=async()=>{O(!1),D(null),he==="solid"?Z(new Map):ne(new Map),N!=null&&N.svg_url&&await Wl(N.svg_url,S)},Iw=async V=>{var de;if(!M){if(!i||r!=="prompt"){d&&J(`TPV Design – ${d.name.replace(/\.[^/.]+$/,"")}`);return}ge(!0);try{const oe=(V==null?void 0:V.slice(0,6).map(_e=>{var Se,le;const Pe=(le=(Se=_e.chosenRecipe)==null?void 0:Se.components)==null?void 0:le[0];return(Pe==null?void 0:Pe.name)||null}).filter(Boolean))||[],Ne=await kn.generateDesignName({prompt:i,colors:oe,dimensions:{widthMM:l,lengthMM:s}});Ne.success&&((de=Ne.names)==null?void 0:de.length)>0?J(Ne.names[0]):J(hf(i))}catch(oe){console.error("[TPV-STUDIO] Name generation failed:",oe),J(hf(i))}finally{ge(!1)}}},hf=V=>V?`TPV Design – ${V.split(/[,.]/)[0].trim().slice(0,40)}`:"TPV Playground Design",Dw=async(V=null,de=null)=>{const oe=V||(N==null?void 0:N.svg_url),Ne=de||S;if(oe)try{console.log("[TPV-STUDIO] Generating solid color version...");const _e=await fetch("/api/solid-recipes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({svg_url:oe,job_id:Ne,max_colors:15})}),Pe=await _e.json();if(!_e.ok)throw new Error(Pe.error||"Failed to generate solid recipes");if(Pe.success){we(Pe.recipes);const Se=Mm(Pe.recipes);Be(Se);try{const{dataUrl:le,stats:Ae}=await ai(oe,Se);Ee(le),console.log("[TPV-STUDIO] Solid color SVG generated:",Ae),Iw(Pe.recipes)}catch(le){console.error("[TPV-STUDIO] Failed to generate solid SVG:",le)}}}catch(_e){console.error("[TPV-STUDIO] Solid generation failed:",_e)}},ff=V=>{console.log("[TPV-STUDIO] Color clicked:",V),D(V),O(!0),ee(!1),K(!1)},Mw=async V=>{if(j)if(console.log("[TPV-STUDIO] Color changed:",j.hex,"->",V,"in mode:",he),he==="solid"){const de=new Map(Y);de.set(j.originalHex.toLowerCase(),{newHex:V.toLowerCase()}),Z(de),D({...j,hex:V,blendHex:V}),await Lw(de,V)}else{const de=new Map(F);de.set(j.originalHex.toLowerCase(),{newHex:V.toLowerCase()}),ne(de),D({...j,hex:V,blendHex:V}),await zw(de,V)}},zw=async(V=null,de=null)=>{if(!(!(N!=null&&N.svg_url)||!I||!ue))try{const oe=new Map(I),Ne=V||F;Ne.forEach((le,Ae)=>{if(le.newHex){const He=Ae.toLowerCase();oe.set(He,{...oe.get(He),blendHex:le.newHex})}});const _e=ue.map(le=>{const Ae=Ne.get(le.originalColor.hex.toLowerCase());return Ae!=null&&Ae.newHex?{...le,targetColor:{...le.targetColor,hex:Ae.newHex},blendColor:{...le.blendColor,hex:Ae.newHex}}:le}),{dataUrl:Pe,stats:Se}=await ai(N.svg_url,oe);A(Pe),ae(oe),X(_e),console.log("[TPV-STUDIO] Blend SVG regenerated with edits:",Se)}catch(oe){console.error("[TPV-STUDIO] Failed to regenerate blend SVG:",oe)}},Lw=async(V=null,de=null)=>{if(!(!(N!=null&&N.svg_url)||!Me||!ye))try{const oe=new Map(Me),Ne=V||Y;Ne.forEach((le,Ae)=>{if(le.newHex){const He=Ae.toLowerCase();oe.set(He,{...oe.get(He),blendHex:le.newHex})}});const _e=ye.map(le=>{const Ae=Ne.get(le.originalColor.hex.toLowerCase());if(Ae!=null&&Ae.newHex){const He=ch.find($t=>$t.hex.toLowerCase()===Ae.newHex.toLowerCase());return He?{...le,targetColor:{...le.targetColor,hex:Ae.newHex},blendColor:{hex:Ae.newHex,rgb:He.rgb,lab:He.lab},chosenRecipe:{components:[{code:He.code,name:He.name,hex:He.hex,rgb:He.rgb,lab:He.lab,ratio:1}],blendColor:{hex:He.hex,rgb:He.rgb,lab:He.lab},deltaE:0,quality:"Perfect"}}:{...le,targetColor:{...le.targetColor,hex:Ae.newHex},blendColor:{...le.blendColor,hex:Ae.newHex}}}return le}),{dataUrl:Pe,stats:Se}=await ai(N.svg_url,oe);Ee(Pe),Be(oe),we(_e),console.log("[TPV-STUDIO] Solid SVG regenerated with edits:",Se)}catch(oe){console.error("[TPV-STUDIO] Failed to regenerate solid SVG:",oe)}},Fw=async(V,de,oe,Ne)=>{try{console.log("[INSPIRE] Regenerating blend SVG from state");const _e=new Map(de);Ne&&Ne.size>0&&Ne.forEach((Se,le)=>{const Ae=le.toLowerCase();_e.has(Ae)&&_e.set(Ae,{..._e.get(Ae),blendHex:Se.newHex})});const{dataUrl:Pe}=await ai(V,_e);A(Pe),console.log("[INSPIRE] Blend SVG regenerated")}catch(_e){console.error("[INSPIRE] Failed to regenerate blend SVG:",_e)}},Bw=async(V,de,oe,Ne)=>{try{console.log("[INSPIRE] Regenerating solid SVG from state");const _e=new Map(de);Ne&&Ne.size>0&&Ne.forEach((Se,le)=>{const Ae=le.toLowerCase();_e.has(Ae)&&_e.set(Ae,{..._e.get(Ae),blendHex:Se.newHex})});const{dataUrl:Pe}=await ai(V,_e);Ee(Pe),console.log("[INSPIRE] Solid SVG regenerated")}catch(_e){console.error("[INSPIRE] Failed to regenerate solid SVG:",_e)}},Uw=async()=>{if(!F||F.size===0){ee(!0);return}R(!0),L("Generating final TPV blend recipes..."),q(null);try{const V=await Promise.all(ue.map(async de=>{const oe=F.get(de.originalColor.hex.toLowerCase());if(oe!=null&&oe.newHex){const _e=await(await fetch("/api/match-color",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({hex:oe.newHex,max_components:2})})).json();if(_e.success&&_e.recipes&&_e.recipes.length>0){const Pe=_e.recipes[0];return{originalColor:de.originalColor,targetColor:{...de.targetColor,hex:oe.newHex},chosenRecipe:Pe,blendColor:Pe.blendColor,alternativeRecipes:_e.recipes.slice(1,3)||[]}}}return de}));X(V),ee(!0),L("✓ Recipes ready!")}catch(V){console.error("[TPV-STUDIO] Failed to finalize recipes:",V),q(V.message)}finally{R(!1)}};return u.jsxs("div",{className:"inspire-panel-recraft",children:[u.jsxs("div",{className:"panel-header",children:[u.jsx("h2",{children:"TPV Studio - Vector AI"}),u.jsx("p",{className:"subtitle",children:"AI-powered vector designs for playground surfacing"})]}),u.jsxs("div",{className:"input-mode-tabs",children:[u.jsxs("button",{className:`input-mode-tab ${r==="prompt"?"active":""}`,onClick:()=>{n("prompt"),h(null),q(null)},disabled:g,children:[u.jsxs("svg",{className:"mode-icon",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[u.jsx("path",{d:"M12 3l1.545 4.635L18.18 9.18l-4.635 1.545L12 15.36l-1.545-4.635L5.82 9.18l4.635-1.545L12 3z"}),u.jsx("path",{d:"M5 21l1.5-4.5L2 15l4.5-1.5L8 9l1.5 4.5L14 15l-4.5 1.5L8 21z",opacity:"0.5"})]}),u.jsx("span",{className:"mode-title",children:"Text Prompt"}),u.jsx("span",{className:"mode-description",children:"Describe your design"})]}),u.jsxs("button",{className:`input-mode-tab ${r==="image"?"active":""}`,onClick:()=>{n("image"),a(""),q(null)},disabled:g,children:[u.jsxs("svg",{className:"mode-icon",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[u.jsx("rect",{x:"3",y:"3",width:"18",height:"18",rx:"2",ry:"2"}),u.jsx("circle",{cx:"8.5",cy:"8.5",r:"1.5"}),u.jsx("path",{d:"M21 15l-5-5L5 21"})]}),u.jsx("span",{className:"mode-title",children:"Upload Image"}),u.jsx("span",{className:"mode-description",children:"Vectorise PNG/JPG"})]}),u.jsxs("button",{className:`input-mode-tab ${r==="svg"?"active":""}`,onClick:()=>{n("svg"),a(""),q(null)},disabled:g,children:[u.jsx("svg",{className:"mode-icon",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:u.jsx("path",{d:"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"})}),u.jsx("span",{className:"mode-title",children:"Upload SVG"}),u.jsx("span",{className:"mode-description",children:"Process existing vector"})]})]}),u.jsxs("div",{className:"form-section",children:[r==="prompt"&&u.jsxs("div",{className:"form-group",children:[u.jsx("label",{htmlFor:"prompt",children:"Design Description"}),u.jsx("textarea",{id:"prompt",value:i,onChange:V=>a(V.target.value),placeholder:"e.g., calm ocean theme with big fish silhouettes and waves",rows:4,disabled:g,className:"prompt-input"}),u.jsx("p",{className:"helper-text",children:"Describe the design you want to generate. The AI will create a vector illustration based on your description."})]}),r==="image"&&u.jsxs("div",{className:"form-group",children:[u.jsx("label",{htmlFor:"image-upload",children:"Upload Image (PNG/JPG)"}),u.jsxs("div",{className:`drop-zone ${y?"dragging":""} ${d?"has-file":""}`,onDragEnter:Zn,onDragLeave:rf,onDragOver:nf,onDrop:af,children:[u.jsx("input",{id:"image-upload",type:"file",accept:"image/png,image/jpeg",onChange:Nt,disabled:g,className:"file-input-hidden"}),u.jsx("label",{htmlFor:"image-upload",className:"drop-zone-content",children:d?u.jsxs(u.Fragment,{children:[u.jsxs("svg",{className:"upload-icon success",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[u.jsx("path",{d:"M22 11.08V12a10 10 0 1 1-5.93-9.14"}),u.jsx("polyline",{points:"22 4 12 14.01 9 11.01"})]}),u.jsx("span",{className:"file-name",children:d.name}),u.jsx("span",{className:"drop-hint",children:"Click to change file"})]}):u.jsxs(u.Fragment,{children:[u.jsxs("svg",{className:"upload-icon",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[u.jsx("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}),u.jsx("polyline",{points:"17 8 12 3 7 8"}),u.jsx("line",{x1:"12",y1:"3",x2:"12",y2:"15"})]}),u.jsx("span",{className:"drop-text",children:"Drag & drop your image here"}),u.jsx("span",{className:"drop-hint",children:"or click to browse"})]})})]}),u.jsx("p",{className:"helper-text",children:"Upload a raster image (PNG or JPG). The AI will convert it to vector format (SVG) suitable for TPV surfacing."})]}),r==="svg"&&u.jsxs("div",{className:"form-group",children:[u.jsx("label",{htmlFor:"svg-upload",children:"Upload SVG File"}),u.jsxs("div",{className:`drop-zone ${y?"dragging":""} ${d?"has-file":""}`,onDragEnter:Zn,onDragLeave:rf,onDragOver:nf,onDrop:af,children:[u.jsx("input",{id:"svg-upload",type:"file",accept:"image/svg+xml",onChange:Nt,disabled:g,className:"file-input-hidden"}),u.jsx("label",{htmlFor:"svg-upload",className:"drop-zone-content",children:d?u.jsxs(u.Fragment,{children:[u.jsxs("svg",{className:"upload-icon success",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[u.jsx("path",{d:"M22 11.08V12a10 10 0 1 1-5.93-9.14"}),u.jsx("polyline",{points:"22 4 12 14.01 9 11.01"})]}),u.jsx("span",{className:"file-name",children:d.name}),u.jsx("span",{className:"drop-hint",children:"Click to change file"})]}):u.jsxs(u.Fragment,{children:[u.jsxs("svg",{className:"upload-icon",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[u.jsx("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}),u.jsx("polyline",{points:"17 8 12 3 7 8"}),u.jsx("line",{x1:"12",y1:"3",x2:"12",y2:"15"})]}),u.jsx("span",{className:"drop-text",children:"Drag & drop your SVG here"}),u.jsx("span",{className:"drop-hint",children:"or click to browse"})]})})]}),u.jsx("p",{className:"helper-text",children:"Upload an existing SVG vector file. It will be processed immediately for TPV colour matching - no AI generation needed."})]}),r==="prompt"&&u.jsxs("div",{className:"form-row",children:[u.jsxs("div",{className:"form-group",children:[u.jsx("label",{htmlFor:"length",children:"Length (mm)"}),u.jsx("input",{id:"length",type:"number",value:s,onChange:V=>o(parseInt(V.target.value,10)),min:1e3,max:2e4,step:100,disabled:g})]}),u.jsxs("div",{className:"form-group",children:[u.jsx("label",{htmlFor:"width",children:"Width (mm)"}),u.jsx("input",{id:"width",type:"number",value:l,onChange:V=>c(parseInt(V.target.value,10)),min:1e3,max:2e4,step:100,disabled:g})]})]}),B&&u.jsxs("div",{className:"error-message",children:[u.jsx("strong",{children:"Error:"})," ",B]}),f&&u.jsx("div",{className:"upload-progress",children:u.jsx("p",{children:f})}),u.jsx("button",{onClick:Ow,disabled:g||r==="prompt"&&!i.trim()||(r==="image"||r==="svg")&&!d,className:"generate-button",children:g?r==="svg"?"Processing...":"Generating...":r==="prompt"?"Generate Vector Design":r==="image"?"Vectorise & Process":"Process SVG"})]}),g&&u.jsxs("div",{className:"progress-section",children:[u.jsx("div",{className:"progress-bar",children:u.jsx("div",{className:"progress-bar-fill"})}),u.jsx("p",{className:"progress-message",children:P})]}),N&&!g&&u.jsxs("div",{className:"results-section",children:[b&&u.jsxs("div",{className:`ar-info ${b.layout.mode}`,children:[u.jsxs("div",{className:"ar-info-header",children:[u.jsx("strong",{children:"Layout:"})," ",b.layout.reason]}),u.jsxs("div",{className:"ar-info-details",children:[u.jsxs("span",{children:["Requested: ",b.user.formatted]}),u.jsx("span",{children:"•"}),u.jsxs("span",{children:["Generated: ",b.canonical.name," panel"]}),b.layout.mode==="framing"&&u.jsxs(u.Fragment,{children:[u.jsx("span",{children:"•"}),u.jsx("span",{className:"layout-note",children:"Panel centred with base colour surround"})]}),b.layout.mode==="tiling"&&u.jsxs(u.Fragment,{children:[u.jsx("span",{children:"•"}),u.jsx("span",{className:"layout-note",children:"Pattern will repeat along length"})]})]})]}),U&&u.jsxs("div",{className:"progress-section",children:[u.jsx("div",{className:"progress-bar",children:u.jsx("div",{className:"progress-bar-fill"})}),u.jsx("p",{className:"progress-message",children:P})]}),G&&ue&&u.jsxs("div",{className:"mode-tabs",children:[u.jsxs("button",{className:`mode-tab ${he==="solid"?"active":""}`,onClick:()=>$e("solid"),disabled:!xe,children:[u.jsx("span",{className:"mode-title",children:"Solid Mode"}),u.jsx("span",{className:"mode-description",children:xe?"Single TPV colours only":"Generating..."})]}),u.jsxs("button",{className:`mode-tab ${he==="blend"?"active":""}`,onClick:()=>$e("blend"),children:[u.jsx("span",{className:"mode-title",children:"Blend Mode"}),u.jsx("span",{className:"mode-description",children:"Advanced: Mixed granules"})]})]}),he==="blend"&&G&&ue&&u.jsx("div",{ref:ut,children:u.jsx(tg,{blendSvgUrl:G,recipes:ue,mode:"blend",onColorClick:ff,selectedColor:j,editedColors:F,onResetAll:df,designName:M,onNameChange:J,isNameLoading:Q,onInSituClick:sf})}),he==="solid"&&xe&&ye&&u.jsx("div",{ref:ut,children:u.jsx(tg,{blendSvgUrl:xe,recipes:ye,mode:"solid",onColorClick:ff,selectedColor:j,editedColors:Y,onResetAll:df,designName:M,onNameChange:J,isNameLoading:Q,onInSituClick:sf})}),G&&u.jsxs("div",{className:"action-buttons",children:[u.jsx("button",{onClick:()=>ie(!0),className:"save-button",children:"💾 Save Design"}),u.jsx("button",{onClick:Pw,className:"download-button svg",children:he==="solid"?"Download Solid TPV SVG":"Download TPV Blend SVG"}),u.jsx("button",{onClick:$w,className:"download-button png",children:he==="solid"?"Download Solid TPV PNG":"Download TPV Blend PNG"}),u.jsx("button",{onClick:Rw,className:"download-button pdf",disabled:of||!(he==="solid"?ye:ue),children:of?"Generating PDF...":he==="solid"?"Export Solid PDF":"Export Blend PDF"}),u.jsx("button",{onClick:Aw,className:"download-button tiles",title:l&&s?`Download ${Math.ceil(l/1e3)*Math.ceil(s/1e3)} tiles (1m×1m each)`:"Download design sliced into 1m×1m tiles",children:"Download Tiles ZIP"})]})]}),he==="blend"&&G&&ue&&!te&&!U&&u.jsxs("div",{className:"finalize-section",children:[u.jsx("button",{onClick:Uw,className:"finalize-button",children:"Generate TPV Blend Recipes"}),u.jsx("p",{className:"finalize-hint",children:"Adjust colours above if needed, then generate the final blend recipes"})]}),he==="solid"&&xe&&ye&&!x&&u.jsxs("div",{className:"finalize-section",children:[u.jsx("button",{onClick:()=>K(!0),className:"finalize-button",children:"View TPV Colours Used"}),u.jsx("p",{className:"finalize-hint",children:"See which pure TPV colours are used in this design"})]}),te&&ue&&u.jsx(LS,{recipes:ue,onClose:()=>{ee(!1)}}),x&&ye&&u.jsx(FS,{recipes:ye,onClose:()=>{K(!1)}}),H&&j&&u.jsx(ez,{color:j,mode:he,onColorChange:Mw,onClose:()=>{O(!1),D(null)}}),ce&&u.jsx(lz,{currentState:{inputMode:r,prompt:i,selectedFile:d,lengthMM:s,widthMM:l,result:N,viewMode:he,blendRecipes:ue,solidRecipes:ye,colorMapping:I,solidColorMapping:Me,solidEditedColors:Y,blendEditedColors:F,blendSvgUrl:G,solidSvgUrl:xe,arMapping:b,jobId:S,inSituData:Ie},existingDesignId:Te,initialName:M,onClose:()=>ie(!1),onSaved:(V,de)=>{ie(!1),de&&J(de),e&&e(de),console.log("[INSPIRE] Design saved:",V)}}),Re&&u.jsx(kz,{designUrl:he==="solid"?xe:G,designDimensions:{width:l,length:s},onClose:()=>fe(!1),onSaved:V=>{console.log("[INSPIRE] In-situ preview saved:",V),Le(V),fe(!1)}}),u.jsx(Ez,{isOpen:Ge,onClose:()=>{We(!1),rt(null)},onConfirm:Nw,aspectRatio:ot,defaultLongestSide:5e3}),u.jsx("style",{jsx:!0,children:`
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
          background: var(--color-accent-light);
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
          color: var(--color-accent);
          font-weight: var(--font-bold);
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
      `})]})}function qz({onShowDesigns:t,onShowAdmin:e,isAdmin:r,currentDesignName:n}){const[i,a]=z.useState(!1),s=async()=>{confirm("Sign out?")&&(await Ya.signOut(),window.location.reload())};return u.jsx("header",{className:"studio-header",children:u.jsxs("div",{className:"header-content",children:[u.jsxs("div",{className:"header-left",children:[u.jsx("h1",{className:"studio-title",children:"TPV Studio"}),n&&u.jsxs("span",{className:"current-design-indicator",children:[u.jsx("svg",{width:"4",height:"4",viewBox:"0 0 4 4",children:u.jsx("circle",{cx:"2",cy:"2",r:"2",fill:"currentColor"})}),n]})]}),u.jsxs("div",{className:"header-right",children:[u.jsxs("button",{onClick:t,className:"btn-my-designs",children:[u.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[u.jsx("path",{d:"M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"}),u.jsx("path",{d:"M9 22V12h6v10"})]}),"My Designs"]}),r&&u.jsxs("button",{onClick:e,className:"btn-admin",children:[u.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[u.jsx("path",{d:"M12 15a3 3 0 100-6 3 3 0 000 6z"}),u.jsx("path",{d:"M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"})]}),"Admin"]}),u.jsxs("div",{className:"user-menu",children:[u.jsx("button",{onClick:()=>a(!i),className:"user-menu-button",children:u.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[u.jsx("path",{d:"M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"}),u.jsx("circle",{cx:"12",cy:"7",r:"4"})]})}),i&&u.jsxs(u.Fragment,{children:[u.jsx("div",{className:"user-menu-backdrop",onClick:()=>a(!1)}),u.jsx("div",{className:"user-menu-dropdown",children:u.jsxs("button",{onClick:s,className:"menu-item sign-out",children:[u.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:u.jsx("path",{d:"M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"})}),"Sign Out"]})})]})]})]})]})})}function Yz({design:t,onLoad:e,onDelete:r,onUpdateMetadata:n}){const[i,a]=z.useState(!1),[s,o]=z.useState(!1),l=async()=>{if(confirm(`Delete "${t.name}"? This cannot be undone.`)){o(!0);try{await r(t.id)}catch(h){console.error("Failed to delete design:",h),alert(`Failed to delete: ${h.message}`),o(!1)}}},c=h=>{const f=new Date(h),p=new Date,y=p-f,m=Math.floor(y/(1e3*60*60*24));return m===0?"Today":m===1?"Yesterday":m<7?`${m} days ago`:m<30?`${Math.floor(m/7)} weeks ago`:f.toLocaleDateString("en-GB",{day:"numeric",month:"short",year:f.getFullYear()!==p.getFullYear()?"numeric":void 0})},d=t.thumbnail_url||t.original_png_url||t.original_svg_url;return u.jsxs("div",{className:`design-card ${s?"deleting":""}`,onMouseEnter:()=>a(!0),onMouseLeave:()=>a(!1),children:[u.jsxs("div",{className:"card-thumbnail",onClick:()=>e(t.id),children:[d?u.jsx("img",{src:d,alt:t.name}):u.jsx("div",{className:"no-thumbnail",children:u.jsxs("svg",{width:"48",height:"48",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[u.jsx("rect",{x:"3",y:"3",width:"18",height:"18",rx:"2",ry:"2"}),u.jsx("circle",{cx:"8.5",cy:"8.5",r:"1.5"}),u.jsx("polyline",{points:"21 15 16 10 5 21"})]})}),i&&u.jsx("div",{className:"thumbnail-overlay",children:u.jsx("button",{className:"btn-load",children:"Open Design"})})]}),u.jsxs("div",{className:"card-info",children:[u.jsx("h3",{className:"design-name",title:t.name,children:t.name}),t.description&&u.jsx("p",{className:"design-description",title:t.description,children:t.description}),u.jsxs("div",{className:"card-meta",children:[t.projects&&u.jsx("span",{className:"project-badge",style:{backgroundColor:t.projects.color||"#1a365d"},title:t.projects.name,children:t.projects.name}),u.jsx("span",{className:"design-date",title:new Date(t.updated_at).toLocaleString(),children:c(t.updated_at)})]}),t.tags&&t.tags.length>0&&u.jsxs("div",{className:"design-tags",children:[t.tags.slice(0,3).map((h,f)=>u.jsx("span",{className:"tag",children:h},f)),t.tags.length>3&&u.jsxs("span",{className:"tag more",children:["+",t.tags.length-3]})]})]}),i&&!s&&u.jsxs("div",{className:"card-actions",children:[u.jsx("button",{onClick:()=>e(t.id),className:"action-btn load-btn",title:"Load design",children:u.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[u.jsx("path",{d:"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"}),u.jsx("circle",{cx:"12",cy:"12",r:"3"})]})}),u.jsx("button",{onClick:l,className:"action-btn delete-btn",title:"Delete design",children:u.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:u.jsx("path",{d:"M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"})})})]}),s&&u.jsx("div",{className:"deleting-overlay",children:u.jsx("div",{className:"spinner"})})]})}function Jz({onClose:t,onLoadDesign:e}){const[r,n]=z.useState([]),[i,a]=z.useState([]),[s,o]=z.useState(!0),[l,c]=z.useState(null),[d,h]=z.useState(""),[f,p]=z.useState(""),[y,m]=z.useState(!1),[b,v]=z.useState(!1);z.useEffect(()=>{g()},[d,f]);const g=async()=>{o(!0),c(null);try{const[k,C]=await Promise.all([kw(),Im({project_id:d||void 0,search:f||void 0,limit:12,offset:0})]);a(k.projects),n(C.designs),m(C.pagination.has_more)}catch(k){console.error("Failed to load designs:",k),c(k.message)}finally{o(!1)}},w=async()=>{if(!(b||!y)){v(!0);try{const k=await Im({project_id:d||void 0,search:f||void 0,limit:12,offset:r.length});n([...r,...k.designs]),m(k.pagination.has_more)}catch(k){console.error("Failed to load more designs:",k),c(k.message)}finally{v(!1)}}},S=async k=>{try{const{design:C}=await rz(k);e(C),t()}catch(C){console.error("Failed to load design:",C),alert(`Failed to load design: ${C.message}`)}},E=async k=>{try{await nz(k),n(r.filter(C=>C.id!==k))}catch(C){throw console.error("Failed to delete design:",C),C}};return u.jsx("div",{className:"modal-overlay",onClick:t,children:u.jsxs("div",{className:"modal-content design-gallery-modal",onClick:k=>k.stopPropagation(),children:[u.jsxs("div",{className:"modal-header",children:[u.jsx("h2",{children:"My Designs"}),u.jsx("button",{onClick:t,className:"close-button",children:"×"})]}),u.jsxs("div",{className:"gallery-filters",children:[u.jsx("div",{className:"filter-group",children:u.jsx("input",{type:"text",placeholder:"Search designs...",value:f,onChange:k=>p(k.target.value),className:"search-input"})}),u.jsx("div",{className:"filter-group",children:u.jsxs("select",{value:d,onChange:k=>h(k.target.value),className:"project-filter",children:[u.jsx("option",{value:"",children:"All Projects"}),i.map(k=>u.jsxs("option",{value:k.id,children:[k.name," (",k.design_count,")"]},k.id))]})})]}),u.jsxs("div",{className:"modal-body",children:[l&&u.jsxs("div",{className:"error-message",children:[l,u.jsx("button",{onClick:g,className:"btn-retry",children:"Retry"})]}),s?u.jsxs("div",{className:"loading-state",children:[u.jsx("div",{className:"spinner-large"}),u.jsx("p",{children:"Loading your designs..."})]}):r.length===0?u.jsxs("div",{className:"empty-state",children:[u.jsxs("svg",{width:"64",height:"64",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[u.jsx("path",{d:"M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"}),u.jsx("path",{d:"M17 21v-8H7v8M7 3v5h8"})]}),u.jsx("h3",{children:"No designs yet"}),u.jsx("p",{children:f||d?"No designs match your filters. Try adjusting your search.":"Create your first design to see it here!"})]}):u.jsxs(u.Fragment,{children:[u.jsx("div",{className:"designs-grid",children:r.map(k=>u.jsx(Yz,{design:k,onLoad:S,onDelete:E},k.id))}),y&&u.jsx("div",{className:"load-more-section",children:u.jsx("button",{onClick:w,className:"btn-load-more",disabled:b,children:b?"Loading...":"Load More"})})]})]})]})})}function Xz({onClose:t}){const[e,r]=z.useState("overview"),[n,i]=z.useState(!0),[a,s]=z.useState(null),[o,l]=z.useState(null),[c,d]=z.useState([]),[h,f]=z.useState([]),[p,y]=z.useState(0),[m,b]=z.useState(null),v=async()=>{var N,$;const k=await en.auth.getSession();return{"Content-Type":"application/json",Authorization:`Bearer ${($=(N=k==null?void 0:k.data)==null?void 0:N.session)==null?void 0:$.access_token}`}},g=async()=>{try{const k=await v(),C=await fetch("/api/admin/analytics/overview",{headers:k}),N=await C.json();if(!C.ok)throw new Error(N.error||"Failed to fetch overview");l(N.stats)}catch(k){console.error("Failed to fetch overview:",k),s(k.message)}},w=async()=>{try{const k=await v(),C=await fetch("/api/admin/users",{headers:k}),N=await C.json();if(!C.ok)throw new Error(N.error||"Failed to fetch users");d(N.users)}catch(k){console.error("Failed to fetch users:",k),s(k.message)}},S=async()=>{try{const k=await v(),C=await fetch("/api/admin/designs?limit=50",{headers:k}),N=await C.json();if(!C.ok)throw new Error(N.error||"Failed to fetch designs");f(N.designs),y(N.total)}catch(k){console.error("Failed to fetch designs:",k),s(k.message)}},E=async()=>{try{const k=await v(),C=await fetch("/api/admin/analytics/colours",{headers:k}),N=await C.json();if(!C.ok)throw new Error(N.error||"Failed to fetch colour analytics");b(N.analytics)}catch(k){console.error("Failed to fetch colours:",k),s(k.message)}};return z.useEffect(()=>{(async()=>{i(!0),await g(),i(!1)})()},[]),z.useEffect(()=>{e==="users"&&c.length===0?w():e==="designs"&&h.length===0?S():e==="colours"&&!m&&E()},[e]),n?u.jsxs("div",{className:"admin-loading",children:[u.jsx("div",{className:"spinner"}),u.jsx("p",{children:"Loading admin dashboard..."})]}):a?u.jsxs("div",{className:"admin-error",children:[u.jsx("h2",{children:"Access Denied"}),u.jsx("p",{children:a}),u.jsx("p",{children:"You need admin privileges to view this page."})]}):u.jsxs("div",{className:"admin-dashboard",children:[u.jsxs("header",{className:"admin-header",children:[u.jsxs("div",{className:"admin-header-left",children:[u.jsxs("button",{onClick:t,className:"btn-back",children:[u.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:u.jsx("path",{d:"M19 12H5M12 19l-7-7 7-7"})}),"Back to Studio"]}),u.jsx("h1",{children:"TPV Studio Admin"})]}),u.jsxs("nav",{className:"admin-nav",children:[u.jsx("button",{className:e==="overview"?"active":"",onClick:()=>r("overview"),children:"Overview"}),u.jsx("button",{className:e==="users"?"active":"",onClick:()=>r("users"),children:"Users"}),u.jsx("button",{className:e==="designs"?"active":"",onClick:()=>r("designs"),children:"Designs"}),u.jsx("button",{className:e==="colours"?"active":"",onClick:()=>r("colours"),children:"Colour Analytics"})]})]}),u.jsxs("main",{className:"admin-content",children:[e==="overview"&&o&&u.jsx(Zz,{stats:o}),e==="users"&&u.jsx(Qz,{users:c}),e==="designs"&&u.jsx(eL,{designs:h,total:p}),e==="colours"&&m&&u.jsx(tL,{analytics:m})]}),u.jsx("style",{jsx:!0,children:`
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
      `})]})}function Zz({stats:t}){return u.jsxs("div",{className:"overview-panel",children:[u.jsx("h2",{children:"Dashboard Overview"}),u.jsxs("div",{className:"stats-grid",children:[u.jsxs("div",{className:"stat-card",children:[u.jsx("div",{className:"stat-value",children:t.totals.users}),u.jsx("div",{className:"stat-label",children:"Total Users"})]}),u.jsxs("div",{className:"stat-card",children:[u.jsx("div",{className:"stat-value",children:t.totals.designs}),u.jsx("div",{className:"stat-label",children:"Total Designs"})]}),u.jsxs("div",{className:"stat-card",children:[u.jsx("div",{className:"stat-value",children:t.totals.projects}),u.jsx("div",{className:"stat-label",children:"Total Projects"})]}),u.jsxs("div",{className:"stat-card",children:[u.jsx("div",{className:"stat-value",children:t.totals.jobs}),u.jsx("div",{className:"stat-label",children:"AI Jobs Run"})]})]}),u.jsxs("div",{className:"stats-grid",children:[u.jsxs("div",{className:"stat-card highlight",children:[u.jsx("div",{className:"stat-value",children:t.activity.active_users_30d}),u.jsx("div",{className:"stat-label",children:"Active Users (30d)"})]}),u.jsxs("div",{className:"stat-card highlight",children:[u.jsx("div",{className:"stat-value",children:t.activity.designs_7d}),u.jsx("div",{className:"stat-label",children:"Designs This Week"})]}),u.jsxs("div",{className:"stat-card highlight",children:[u.jsx("div",{className:"stat-value",children:t.activity.designs_30d}),u.jsx("div",{className:"stat-label",children:"Designs This Month"})]}),u.jsxs("div",{className:"stat-card highlight",children:[u.jsxs("div",{className:"stat-value",children:[t.activity.job_success_rate,"%"]}),u.jsx("div",{className:"stat-label",children:"Job Success Rate"})]})]}),u.jsx("h3",{children:"Activity Timeline (14 Days)"}),u.jsx("div",{className:"activity-chart",children:t.timeline.map((e,r)=>u.jsxs("div",{className:"bar-container",children:[u.jsx("div",{className:"bar",style:{height:`${Math.max(4,e.count*20)}px`},title:`${e.date}: ${e.count} designs`}),u.jsx("div",{className:"bar-label",children:e.date.split("-")[2]})]},r))}),u.jsxs("div",{className:"breakdowns",children:[u.jsxs("div",{className:"breakdown-card",children:[u.jsx("h4",{children:"Input Mode"}),u.jsxs("div",{className:"breakdown-items",children:[u.jsxs("div",{className:"breakdown-item",children:[u.jsx("span",{children:"Prompt"}),u.jsx("strong",{children:t.breakdowns.input_mode.prompt})]}),u.jsxs("div",{className:"breakdown-item",children:[u.jsx("span",{children:"Image Upload"}),u.jsx("strong",{children:t.breakdowns.input_mode.image})]}),u.jsxs("div",{className:"breakdown-item",children:[u.jsx("span",{children:"SVG Upload"}),u.jsx("strong",{children:t.breakdowns.input_mode.svg})]})]})]}),u.jsxs("div",{className:"breakdown-card",children:[u.jsx("h4",{children:"View Mode Preference"}),u.jsxs("div",{className:"breakdown-items",children:[u.jsxs("div",{className:"breakdown-item",children:[u.jsx("span",{children:"Solid TPV"}),u.jsx("strong",{children:t.breakdowns.view_mode.solid})]}),u.jsxs("div",{className:"breakdown-item",children:[u.jsx("span",{children:"Blend TPV"}),u.jsx("strong",{children:t.breakdowns.view_mode.blend})]})]})]})]}),u.jsx("style",{jsx:!0,children:`
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
      `})]})}function Qz({users:t}){return u.jsxs("div",{className:"users-panel",children:[u.jsxs("h2",{children:["User Management (",t.length," users)"]}),u.jsxs("table",{className:"users-table",children:[u.jsx("thead",{children:u.jsxs("tr",{children:[u.jsx("th",{children:"Email"}),u.jsx("th",{children:"Role"}),u.jsx("th",{children:"Designs"}),u.jsx("th",{children:"Projects"}),u.jsx("th",{children:"Jobs"}),u.jsx("th",{children:"Last Design"}),u.jsx("th",{children:"Joined"})]})}),u.jsx("tbody",{children:t.map(e=>u.jsxs("tr",{children:[u.jsx("td",{children:e.email}),u.jsx("td",{children:u.jsx("span",{className:`role-badge ${e.role}`,children:e.role})}),u.jsx("td",{children:e.design_count}),u.jsx("td",{children:e.project_count}),u.jsx("td",{children:e.job_count}),u.jsx("td",{children:e.last_design_at?new Date(e.last_design_at).toLocaleDateString():"-"}),u.jsx("td",{children:new Date(e.created_at).toLocaleDateString()})]},e.id))})]}),u.jsx("style",{jsx:!0,children:`
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
      `})]})}function eL({designs:t,total:e}){return u.jsxs("div",{className:"designs-panel",children:[u.jsxs("h2",{children:["All Designs (",e," total)"]}),u.jsx("div",{className:"designs-grid",children:t.map(r=>u.jsxs("div",{className:"design-card",children:[u.jsx("div",{className:"design-thumbnail",children:r.thumbnail_url||r.original_png_url?u.jsx("img",{src:r.thumbnail_url||r.original_png_url,alt:r.name}):u.jsx("div",{className:"no-image",children:"No preview"})}),u.jsxs("div",{className:"design-info",children:[u.jsx("h4",{children:r.name}),u.jsx("p",{className:"design-user",children:r.user_email}),u.jsx("p",{className:"design-date",children:new Date(r.created_at).toLocaleDateString()}),r.project&&u.jsx("span",{className:"project-badge",style:{backgroundColor:r.project.color||"#64748b"},children:r.project.name})]})]},r.id))}),u.jsx("style",{jsx:!0,children:`
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
      `})]})}function tL({analytics:t}){return u.jsxs("div",{className:"colours-panel",children:[u.jsx("h2",{children:"Colour Usage Analytics"}),u.jsxs("div",{className:"colour-stats",children:[u.jsxs("div",{className:"stat-card",children:[u.jsx("div",{className:"stat-value",children:t.totals.designs_analysed}),u.jsx("div",{className:"stat-label",children:"Designs Analysed"})]}),u.jsxs("div",{className:"stat-card",children:[u.jsx("div",{className:"stat-value",children:t.totals.colour_usages}),u.jsx("div",{className:"stat-label",children:"Total Colour Uses"})]})]}),u.jsx("h3",{children:"Top 10 TPV Colours"}),u.jsx("div",{className:"colour-list",children:t.top_colours.map((e,r)=>u.jsxs("div",{className:"colour-item",children:[u.jsxs("span",{className:"colour-rank",children:["#",r+1]}),u.jsx("div",{className:"colour-swatch",style:{backgroundColor:e.hex}}),u.jsxs("div",{className:"colour-info",children:[u.jsx("strong",{children:e.code}),u.jsx("span",{children:e.name})]}),u.jsxs("div",{className:"colour-count",children:[e.count," uses"]})]},e.code))}),u.jsx("h3",{children:"Colour Family Breakdown"}),u.jsx("div",{className:"family-bars",children:Object.entries(t.families).map(([e,r])=>u.jsxs("div",{className:"family-bar",children:[u.jsx("span",{className:"family-name",children:e}),u.jsx("div",{className:"bar-bg",children:u.jsx("div",{className:"bar-fill",style:{width:`${r/t.totals.colour_usages*100}%`,backgroundColor:rL(e)}})}),u.jsx("span",{className:"family-count",children:r})]},e))}),t.top_blends.length>0&&u.jsxs(u.Fragment,{children:[u.jsx("h3",{children:"Top Blend Combinations"}),u.jsx("div",{className:"blend-list",children:t.top_blends.map((e,r)=>u.jsxs("div",{className:"blend-item",children:[u.jsx("div",{className:"blend-swatches",children:e.components.map((n,i)=>u.jsx("div",{className:"blend-swatch",style:{backgroundColor:n.hex},title:`${n.code} - ${n.name}`},i))}),u.jsx("div",{className:"blend-codes",children:e.components.map(n=>n.code).join(" + ")}),u.jsxs("div",{className:"blend-count",children:[e.count," uses"]})]},r))})]}),u.jsx("style",{jsx:!0,children:`
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
      `})]})}function rL(t){return{reds:"#dc2626",greens:"#16a34a",blues:"#2563eb",yellows:"#ca8a04",neutrals:"#6b7280"}[t]||"#6b7280"}const Fc=[{code:"RH60",name:"Beige",hex:"#C8B88A"},{code:"RH61",name:"Cream",hex:"#F5F0D5"},{code:"RH40",name:"Bright Yellow",hex:"#FFD700"},{code:"RH41",name:"Mustard",hex:"#D4A017"},{code:"RH50",name:"Orange",hex:"#FF8C00"},{code:"RH01",name:"Standard Red",hex:"#C41E3A"},{code:"RH02",name:"Bright Red",hex:"#FF2400"},{code:"RH90",name:"Funky Pink",hex:"#FF69B4"},{code:"RH23",name:"Purple",hex:"#6A0DAD"},{code:"RH20",name:"Standard Blue",hex:"#1E3A8A"},{code:"RH21",name:"Light Blue",hex:"#6CB4EE"},{code:"RH26",name:"Azure",hex:"#007FFF"},{code:"RH22",name:"Turquoise",hex:"#30D5C8"},{code:"RH10",name:"Dark Green",hex:"#013220"},{code:"RH11",name:"Standard Green",hex:"#228B22"},{code:"RH12",name:"Bright Green",hex:"#32CD32"},{code:"RH65",name:"Brown",hex:"#5C4033"},{code:"RH30",name:"Pale Grey",hex:"#D3D3D3"},{code:"RH31",name:"Light Grey",hex:"#A9A9A9"},{code:"RH32",name:"Dark Grey",hex:"#505050"},{code:"RH70",name:"Black",hex:"#1A1A1A"}],Hm=["ocean theme with dolphins and waves","jungle adventure with parrots","solar system with planets","garden with butterflies and flowers","racing track with cars","underwater coral reef scene","dinosaur footprints trail","rainbow with clouds"],nL=[...Array(60)].map(t=>({delay:`${Math.random()*3}s`,x:`${Math.random()*100}%`,y:`${Math.random()*100}%`,size:`${8+Math.random()*12}px`}));function iL(){const[t,e]=z.useState(""),[r,n]=z.useState(""),[i,a]=z.useState(""),[s,o]=z.useState(!1),[l,c]=z.useState(!1),[d,h]=z.useState(0);z.useEffect(()=>{const y=setInterval(()=>{h(m=>(m+1)%Hm.length)},5e3);return()=>clearInterval(y)},[]);const f=async y=>{y.preventDefault(),a(""),o(!0);try{await Ya.signIn(t,r)}catch(m){a(m.message||"Sign in failed")}finally{o(!1)}},p=y=>{var m;(m=document.getElementById(y))==null||m.scrollIntoView({behavior:"smooth"})};return u.jsxs("div",{className:"landing-page",children:[u.jsxs("nav",{className:"landing-nav",children:[u.jsxs("div",{className:"nav-logo",children:[u.jsx("span",{className:"logo-text",children:"TPV"}),u.jsx("span",{className:"logo-accent",children:"Studio"})]}),u.jsxs("div",{className:"nav-links",children:[u.jsx("button",{onClick:()=>p("features"),children:"Features"}),u.jsx("button",{onClick:()=>p("palette"),children:"Colours"}),u.jsx("button",{onClick:()=>c(!0),className:"nav-cta",children:"Sign In"})]})]}),u.jsxs("section",{className:"hero",children:[u.jsx("div",{className:"hero-background",children:u.jsx("div",{className:"granule-field",children:nL.map((y,m)=>u.jsx("div",{className:"granule",style:{"--delay":y.delay,"--x":y.x,"--y":y.y,"--color":Fc[m%Fc.length].hex,"--size":y.size}},m))})}),u.jsxs("div",{className:"hero-content",children:[u.jsx("div",{className:"hero-badge",children:"AI-Powered Design Tool"}),u.jsxs("h1",{children:[u.jsx("span",{className:"hero-line-1",children:"Transform Ideas Into"}),u.jsx("span",{className:"hero-line-2",children:"Playground Surfaces"})]}),u.jsx("p",{className:"hero-subtitle",children:"Describe your vision or upload an image. Get production-ready TPV colour specifications in minutes, not hours."}),u.jsxs("div",{className:"hero-ctas",children:[u.jsxs("button",{onClick:()=>c(!0),className:"cta-primary",children:["Start Designing",u.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:u.jsx("path",{d:"M5 12h14M12 5l7 7-7 7"})})]}),u.jsx("button",{onClick:()=>p("how-it-works"),className:"cta-secondary",children:"See How It Works"})]})]}),u.jsx("div",{className:"hero-visual",children:u.jsx("div",{className:"mockup-container",children:u.jsxs("div",{className:"mockup-screen",children:[u.jsx("div",{className:"mockup-header",children:u.jsxs("div",{className:"mockup-dots",children:[u.jsx("span",{}),u.jsx("span",{}),u.jsx("span",{})]})}),u.jsxs("div",{className:"mockup-content",children:[u.jsx("div",{className:"mockup-input",children:u.jsx("span",{className:"typing-text",children:Hm[d]},d)}),u.jsxs("div",{className:"mockup-preview",children:[u.jsx("div",{className:"preview-shape shape-1"}),u.jsx("div",{className:"preview-shape shape-2"}),u.jsx("div",{className:"preview-shape shape-3"})]})]})]})})})]}),u.jsxs("section",{id:"how-it-works",className:"how-it-works",children:[u.jsxs("div",{className:"section-header",children:[u.jsx("span",{className:"section-tag",children:"Process"}),u.jsx("h2",{children:"Three Steps to Production-Ready Designs"})]}),u.jsxs("div",{className:"steps-container",children:[u.jsxs("div",{className:"step",children:[u.jsx("div",{className:"step-number",children:"01"}),u.jsx("div",{className:"step-icon",children:u.jsx("svg",{width:"32",height:"32",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:u.jsx("path",{d:"M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"})})}),u.jsx("h3",{children:"Describe or Upload"}),u.jsx("p",{children:'Type a description like "tropical jungle with parrots" or upload an existing image or SVG file.'})]}),u.jsx("div",{className:"step-connector",children:u.jsx("svg",{viewBox:"0 0 100 20",preserveAspectRatio:"none",children:u.jsx("path",{d:"M0 10 Q50 10 100 10",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeDasharray:"4 4"})})}),u.jsxs("div",{className:"step",children:[u.jsx("div",{className:"step-number",children:"02"}),u.jsx("div",{className:"step-icon",children:u.jsx("svg",{width:"32",height:"32",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:u.jsx("path",{d:"M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"})})}),u.jsx("h3",{children:"AI Generates Vector"}),u.jsx("p",{children:"Our AI creates a clean vector design optimized for TPV surface production with colour regions."})]}),u.jsx("div",{className:"step-connector",children:u.jsx("svg",{viewBox:"0 0 100 20",preserveAspectRatio:"none",children:u.jsx("path",{d:"M0 10 Q50 10 100 10",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeDasharray:"4 4"})})}),u.jsxs("div",{className:"step",children:[u.jsx("div",{className:"step-number",children:"03"}),u.jsx("div",{className:"step-icon",children:u.jsxs("svg",{width:"32",height:"32",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[u.jsx("path",{d:"M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"}),u.jsx("path",{d:"M14 2v6h6M16 13H8M16 17H8M10 9H8"})]})}),u.jsx("h3",{children:"Get TPV Recipes"}),u.jsx("p",{children:"Receive precise granule blend specifications with component ratios, ready for production."})]})]})]}),u.jsxs("section",{id:"features",className:"features",children:[u.jsxs("div",{className:"section-header",children:[u.jsx("span",{className:"section-tag",children:"Capabilities"}),u.jsx("h2",{children:"Everything You Need to Design TPV Surfaces"})]}),u.jsxs("div",{className:"features-grid",children:[u.jsxs("div",{className:"feature-card feature-highlight",children:[u.jsx("div",{className:"feature-icon",children:u.jsxs("svg",{width:"28",height:"28",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[u.jsx("path",{d:"M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"}),u.jsx("path",{d:"M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"})]})}),u.jsx("h3",{children:"AI Text-to-Vector"}),u.jsx("p",{children:"Describe any concept in natural language. Our AI transforms your words into production-ready vector designs."}),u.jsx("div",{className:"feature-example",children:'"vibrant underwater scene with coral reef"'})]}),u.jsxs("div",{className:"feature-card",children:[u.jsx("div",{className:"feature-icon",children:u.jsxs("svg",{width:"28",height:"28",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[u.jsx("rect",{x:"3",y:"3",width:"18",height:"18",rx:"2",ry:"2"}),u.jsx("circle",{cx:"8.5",cy:"8.5",r:"1.5"}),u.jsx("path",{d:"M21 15l-5-5L5 21"})]})}),u.jsx("h3",{children:"Image Vectorisation"}),u.jsx("p",{children:"Upload any PNG or JPG image and convert it to clean SVG vectors optimised for TPV production."})]}),u.jsxs("div",{className:"feature-card",children:[u.jsx("div",{className:"feature-icon",children:u.jsxs("svg",{width:"28",height:"28",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[u.jsx("circle",{cx:"13.5",cy:"6.5",r:"2.5"}),u.jsx("circle",{cx:"17.5",cy:"10.5",r:"2.5"}),u.jsx("circle",{cx:"8.5",cy:"7.5",r:"2.5"}),u.jsx("circle",{cx:"6.5",cy:"12.5",r:"2.5"}),u.jsx("path",{d:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"})]})}),u.jsx("h3",{children:"Auto Colour Matching"}),u.jsx("p",{children:"Automatic extraction and matching to the 21-colour TPV palette with optimal blend recipes."})]}),u.jsxs("div",{className:"feature-card",children:[u.jsx("div",{className:"feature-icon",children:u.jsxs("svg",{width:"28",height:"28",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[u.jsx("path",{d:"M12 3v18M3 12h18"}),u.jsx("circle",{cx:"12",cy:"12",r:"9"})]})}),u.jsx("h3",{children:"Solid & Blend Modes"}),u.jsx("p",{children:"Choose between single-colour purity or multi-granule blends for precise colour accuracy."})]}),u.jsxs("div",{className:"feature-card",children:[u.jsx("div",{className:"feature-icon",children:u.jsxs("svg",{width:"28",height:"28",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[u.jsx("path",{d:"M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"}),u.jsx("path",{d:"M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"})]})}),u.jsx("h3",{children:"Interactive Editor"}),u.jsx("p",{children:"Click any colour region to customise. Real-time preview updates as you design."})]}),u.jsxs("div",{className:"feature-card",children:[u.jsx("div",{className:"feature-icon",children:u.jsxs("svg",{width:"28",height:"28",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[u.jsx("path",{d:"M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"}),u.jsx("path",{d:"M14 2v6h6M12 18v-6M9 15l3 3 3-3"})]})}),u.jsx("h3",{children:"PDF Specifications"}),u.jsx("p",{children:"Export professional specification sheets with design preview, dimensions, and all recipes."})]}),u.jsxs("div",{className:"feature-card",children:[u.jsx("div",{className:"feature-icon",children:u.jsxs("svg",{width:"28",height:"28",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[u.jsx("rect",{x:"3",y:"3",width:"18",height:"18",rx:"2",ry:"2"}),u.jsx("circle",{cx:"8.5",cy:"8.5",r:"1.5"}),u.jsx("path",{d:"M21 15l-5-5L5 21"})]})}),u.jsx("h3",{children:"In-Situ Preview"}),u.jsx("p",{children:"Upload a site photo and see your design in context. Adjust perspective and lighting to visualise the finished installation."})]}),u.jsxs("div",{className:"feature-card",children:[u.jsx("div",{className:"feature-icon",children:u.jsxs("svg",{width:"28",height:"28",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[u.jsx("rect",{x:"3",y:"3",width:"7",height:"7"}),u.jsx("rect",{x:"14",y:"3",width:"7",height:"7"}),u.jsx("rect",{x:"3",y:"14",width:"7",height:"7"}),u.jsx("rect",{x:"14",y:"14",width:"7",height:"7"})]})}),u.jsx("h3",{children:"Installation Tiles"}),u.jsx("p",{children:"Download your design as 1m×1m tiles in a ZIP file. Named like a chessboard (A1, B2...) for easy on-site layout."})]})]})]}),u.jsxs("section",{id:"palette",className:"palette-section",children:[u.jsxs("div",{className:"section-header light",children:[u.jsx("span",{className:"section-tag",children:"Palette"}),u.jsx("h2",{children:"21 Standard TPV Colours"}),u.jsx("p",{className:"section-subtitle",children:"The complete Rosehill TPV granule palette at your fingertips"})]}),u.jsx("div",{className:"palette-grid",children:Fc.map((y,m)=>u.jsxs("div",{className:"palette-swatch",style:{"--swatch-color":y.hex,"--delay":`${m*.03}s`},children:[u.jsx("div",{className:"swatch-color"}),u.jsxs("div",{className:"swatch-info",children:[u.jsx("span",{className:"swatch-name",children:y.name}),u.jsx("span",{className:"swatch-code",children:y.code})]})]},y.code))})]}),u.jsx("section",{className:"benefits",children:u.jsxs("div",{className:"benefits-grid",children:[u.jsxs("div",{className:"benefit",children:[u.jsx("div",{className:"benefit-metric",children:"10x"}),u.jsx("div",{className:"benefit-label",children:"Faster Design Process"}),u.jsx("p",{children:"What took hours of manual colour matching now takes minutes with AI automation."})]}),u.jsxs("div",{className:"benefit",children:[u.jsx("div",{className:"benefit-metric",children:"100%"}),u.jsx("div",{className:"benefit-label",children:"Production Accurate"}),u.jsx("p",{children:"Recipes use exact TPV granule components with precise ratio specifications."})]}),u.jsxs("div",{className:"benefit",children:[u.jsx("div",{className:"benefit-metric",children:"21"}),u.jsx("div",{className:"benefit-label",children:"Standard Colours"}),u.jsx("p",{children:"Full access to the complete Rosehill TPV palette with blend combinations."})]})]})}),u.jsx("section",{className:"cta-footer",children:u.jsxs("div",{className:"cta-content",children:[u.jsx("h2",{children:"Ready to Transform Your Workflow?"}),u.jsx("p",{children:"Start designing playground surfaces with AI-powered precision."}),u.jsxs("button",{onClick:()=>c(!0),className:"cta-primary large",children:["Sign In to TPV Studio",u.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:u.jsx("path",{d:"M5 12h14M12 5l7 7-7 7"})})]}),u.jsxs("p",{className:"cta-note",children:["Need an account? Contact ",u.jsx("a",{href:"mailto:info@rosehill.group",children:"info@rosehill.group"})]})]})}),l&&u.jsx("div",{className:"modal-overlay",onClick:()=>c(!1),children:u.jsxs("div",{className:"sign-in-modal",onClick:y=>y.stopPropagation(),children:[u.jsx("button",{className:"modal-close",onClick:()=>c(!1),children:u.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:u.jsx("path",{d:"M18 6L6 18M6 6l12 12"})})}),u.jsxs("div",{className:"modal-header",children:[u.jsx("h2",{children:"Sign In"}),u.jsx("p",{children:"Access your TPV Studio account"})]}),i&&u.jsx("div",{className:"form-error",children:i}),u.jsxs("form",{onSubmit:f,children:[u.jsxs("div",{className:"form-group",children:[u.jsx("label",{children:"Email"}),u.jsx("input",{type:"email",value:t,onChange:y=>e(y.target.value),placeholder:"you@rosehill.group",required:!0})]}),u.jsxs("div",{className:"form-group",children:[u.jsx("label",{children:"Password"}),u.jsx("input",{type:"password",value:r,onChange:y=>n(y.target.value),required:!0})]}),u.jsx("button",{type:"submit",disabled:s,className:"submit-btn",children:s?"Signing in...":"Sign In"})]}),u.jsx("p",{className:"modal-footer-text",children:"Don't have an account? Contact your administrator."})]})}),u.jsx("style",{jsx:!0,children:`
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
      `})]})}function aL(){const[t,e]=z.useState(null),[r,n]=z.useState(!0),[i,a]=z.useState(!1),[s,o]=z.useState(!1),[l,c]=z.useState(!1),[d,h]=z.useState(null),[f,p]=z.useState(null),y=async()=>{var v;try{const g=await fetch("/api/admin/users",{headers:{Authorization:`Bearer ${(v=await Ya.getSession())==null?void 0:v.access_token}`}});c(g.ok)}catch{c(!1)}};z.useEffect(()=>{Ya.getSession().then(g=>{e((g==null?void 0:g.user)||null),n(!1),g!=null&&g.user&&y()});const{data:v}=Ya.onAuthStateChange((g,w)=>{e((w==null?void 0:w.user)||null),w!=null&&w.user?y():c(!1)});return()=>v==null?void 0:v.unsubscribe()},[]);const m=v=>{console.log("[APP] Loading design:",v),console.log("[APP] Design original_svg_url:",v.original_svg_url),console.log("[APP] Design ID:",v.id),h(v),p(v.name),console.log("[INSPIRE] Loaded design:",v.name)},b=v=>{p(v)};return r?u.jsx("div",{className:"tpv-studio",children:u.jsx("div",{className:"tpv-studio__container",children:u.jsxs("div",{className:"tpv-studio__empty",children:[u.jsx("div",{className:"tpv-studio__spinner"}),u.jsx("p",{children:"Loading..."})]})})}):t?s?u.jsx(Xz,{onClose:()=>o(!1)}):u.jsx(MS,{children:u.jsxs("div",{className:"tpv-studio",children:[u.jsx(qz,{onShowDesigns:()=>a(!0),onShowAdmin:()=>o(!0),isAdmin:l,currentDesignName:f}),u.jsx("main",{className:"tpv-studio__container",children:u.jsx(Kz,{loadedDesign:d,onDesignSaved:b})}),i&&u.jsx(Jz,{onClose:()=>a(!1),onLoadDesign:m})]})}):u.jsx(iL,{})}Bc.createRoot(document.getElementById("root")).render(u.jsx(T.StrictMode,{children:u.jsx(aL,{})}))});export default sL();
//# sourceMappingURL=index-ZLgr1re3.js.map
