!function(e,t){for(var n in t)e[n]=t[n]}(window,function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=461)}({10:function(e,t){!function(){e.exports=this.wp.data}()},361:function(e,t,n){},461:function(e,t,n){n(53),e.exports=n(462)},462:function(e,t,n){"use strict";n.r(t);var o=n(55),r=n.n(o),i=n(10),u=(n(361),"jetpack/media-source");r()((function(){var e,t,n=null===(e=Object(i.select)(u))||void 0===e?void 0:e.getDefaultMediaSource();n||(null===(t=document)||void 0===t||t.body.classList.add("no-media-source"));document.body.addEventListener("click",(function(e){var t,o,r,c,l;if(null==e||null===(t=e.target)||void 0===t||null===(o=t.classList)||void 0===o?void 0:o.contains("wp-block-jetpack-dialogue__timestamp_link")){var a=null===(r=e.target)||void 0===r||null===(c=r.href)||void 0===c||null===(l=c.split("#"))||void 0===l?void 0:l[1];a&&n&&(e.preventDefault(),Object(i.dispatch)(u).setMediaSourceCurrentTime(n.id,a),Object(i.dispatch)(u).playMediaSource(n.id,a))}}))}))},47:function(e,t,n){"object"==typeof window&&window.Jetpack_Block_Assets_Base_Url&&window.Jetpack_Block_Assets_Base_Url.url&&(n.p=window.Jetpack_Block_Assets_Base_Url.url)},53:function(e,t,n){"use strict";n.r(t);n(47)},55:function(e,t){!function(){e.exports=this.wp.domReady}()}}));