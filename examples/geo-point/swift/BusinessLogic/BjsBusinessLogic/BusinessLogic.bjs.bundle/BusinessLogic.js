/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./BusinessLogicBjsIndex.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./BusinessLogicBjsIndex.js":
/*!**********************************!*\
  !*** ./BusinessLogicBjsIndex.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("bjsSetModuleLoader(moduleName => {\n    switch (moduleName) {\n        case 'GeoPoint': return __webpack_require__(/*! ./GeoPoint.js */ \"./GeoPoint.js\")\n    }\n})\n\n//# sourceURL=webpack:///./BusinessLogicBjsIndex.js?");

/***/ }),

/***/ "./GeoPoint.js":
/*!*********************!*\
  !*** ./GeoPoint.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function toDegMinSec(coordinate) {\n    const absolute = Math.abs(coordinate)\n    const deg = Math.floor(absolute)\n    const minNotTruncated = (absolute - deg) * 60\n    const min = Math.floor(minNotTruncated)\n    const sec = Math.floor((minNotTruncated - min) * 60)\n    return `${deg} ${min} ${sec}`\n}\n\nclass GeoPoint {\n\n    // @bionic (GeoPoint, GeoPoint) => Float\n    static getKmDistance(point1, point2) {\n        const φ1 = point1.latitude * Math.PI/180\n        const φ2 = point2.latitude * Math.PI/180\n        const Δλ = (point2.longitude - point1.longitude) * Math.PI/180\n        return Math.acos(Math.sin(φ1) * Math.sin(φ2) + Math.cos(φ1) * Math.cos(φ2) * Math.cos(Δλ)) * 6371e3\n    }\n\n    // @bionic (Float, Float)\n    constructor(latitude, longitude) {\n        this.latitude = latitude\n        this.longitude = longitude\n    }\n\n    // @bionic String\n    get degMinSec() {\n        const latDegMinSec = toDegMinSec(this.latitude)\n        const lonDegMinSec = toDegMinSec(this.longitude)\n        return `${latDegMinSec} ${this.latitude >= 0 ? \"N\" : \"S\"}, ${lonDegMinSec} ${this.longitude >= 0 ? \"E\" : \"W\"}`\n    }\n\n    // @bionic String\n    get coordinates() {\n        return `${this.latitude}, ${this.longitude}`\n    }\n}\n\nmodule.exports = {GeoPoint}\n\n//# sourceURL=webpack:///./GeoPoint.js?");

/***/ })

/******/ });