/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is not neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./BjsNativeObject.js":
/*!****************************!*\
  !*** ./BjsNativeObject.js ***!
  \****************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: module */
/*! CommonJS bailout: module.exports is used directly at 8:0-14 */
/***/ ((module) => {

eval("class BjsNativeObject {\n\n    constructor(...params) {\n        this.constructor.bjsNative.bjsBind(this, ...params)\n    }\n}\n\nmodule.exports = {BjsNativeObject}\n\n//# sourceURL=webpack://hello-world/./BjsNativeObject.js?");

/***/ }),

/***/ "./HelloJsWorld.js":
/*!*************************!*\
  !*** ./HelloJsWorld.js ***!
  \*************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: module */
/*! CommonJS bailout: module.exports is used directly at 9:0-14 */
/***/ ((module) => {

eval("class HelloJsWorld {\n    \n    // @bionic String\n    static get hello() {\n        return \"Hello from JavaScript\"\n    }\n}\n\nmodule.exports = {HelloJsWorld}\n\n//# sourceURL=webpack://hello-world/./HelloJsWorld.js?");

/***/ }),

/***/ "./HelloNativeWorld.js":
/*!*****************************!*\
  !*** ./HelloNativeWorld.js ***!
  \*****************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: module, __webpack_require__ */
/*! CommonJS bailout: module.exports is used directly at 15:0-14 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const {BjsNativeObject} = __webpack_require__(/*! ./BjsNativeObject */ \"./BjsNativeObject.js\")\nconst {bjsNative} = bjsNativeRequire('HelloNativeWorld')\n\nclass HelloNativeWorld extends BjsNativeObject {\n    \n    static get bjsNative() {\n        return bjsNative\n    }\n    \n    static get hello() {\n        return bjsNative.bjsStaticGet_hello()\n    }\n}\n\nmodule.exports = {HelloNativeWorld}\n\n//# sourceURL=webpack://hello-world/./HelloNativeWorld.js?");

/***/ }),

/***/ "./HelloWorld.js":
/*!***********************!*\
  !*** ./HelloWorld.js ***!
  \***********************/
/*! namespace exports */
/*! export HelloWorld [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"HelloWorld\": () => /* binding */ HelloWorld\n/* harmony export */ });\n/* harmony import */ var _HelloJsWorld__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./HelloJsWorld */ \"./HelloJsWorld.js\");\n/* harmony import */ var _HelloJsWorld__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_HelloJsWorld__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _HelloNativeWorld__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./HelloNativeWorld */ \"./HelloNativeWorld.js\");\n/* harmony import */ var _HelloNativeWorld__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_HelloNativeWorld__WEBPACK_IMPORTED_MODULE_1__);\n\n\n\nclass HelloWorld {\n    \n    // @bionic String\n    static get hello() {\n        return `${_HelloJsWorld__WEBPACK_IMPORTED_MODULE_0__.HelloJsWorld.hello} and ${_HelloNativeWorld__WEBPACK_IMPORTED_MODULE_1__.HelloNativeWorld.hello}`\n    }\n}\n\n\n\n//# sourceURL=webpack://hello-world/./HelloWorld.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => module['default'] :
/******/ 				() => module;
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
(() => {
/*!*******************************!*\
  !*** ./MainBundleBjsIndex.js ***!
  \*******************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: __webpack_require__ */
eval("bjsSetModuleLoader(moduleName => {\n    switch (moduleName) {\n        case 'HelloJsWorld': return __webpack_require__(/*! ./HelloJsWorld.js */ \"./HelloJsWorld.js\")\n        case 'HelloNativeWorld': return __webpack_require__(/*! ./HelloNativeWorld.js */ \"./HelloNativeWorld.js\")\n        case 'HelloWorld': return __webpack_require__(/*! ./HelloWorld.js */ \"./HelloWorld.js\")\n    }\n})\n\n//# sourceURL=webpack://hello-world/./MainBundleBjsIndex.js?");
})();

/******/ })()
;