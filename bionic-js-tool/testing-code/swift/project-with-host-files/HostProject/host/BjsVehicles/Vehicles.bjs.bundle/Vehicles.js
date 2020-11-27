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
/******/ 	return __webpack_require__(__webpack_require__.s = "./VehiclesBjsIndex.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./Bicycle.js":
/*!********************!*\
  !*** ./Bicycle.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const {Vehicle} = __webpack_require__(/*! ./libs/Vehicle */ \"./libs/Vehicle.js\")\n\nclass Bicycle extends Vehicle {\n\n    constructor(weight, maxSpeed) {\n        super(weight, 1, maxSpeed)\n    }\n\n    // @bionic\n    ride() {\n    }\n}\n\nmodule.exports = {Bicycle}\n\n\n//# sourceURL=webpack:///./Bicycle.js?");

/***/ }),

/***/ "./VehiclesBjsIndex.js":
/*!*****************************!*\
  !*** ./VehiclesBjsIndex.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("bjsSetModuleLoader(moduleName => {\n    switch (moduleName) {\n        case 'Bicycle': return __webpack_require__(/*! ./Bicycle.js */ \"./Bicycle.js\")\n        case 'Vehicle': return __webpack_require__(/*! ./libs/Vehicle.js */ \"./libs/Vehicle.js\")\n    }\n})\n\n//# sourceURL=webpack:///./VehiclesBjsIndex.js?");

/***/ }),

/***/ "./libs/Vehicle.js":
/*!*************************!*\
  !*** ./libs/Vehicle.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("class Vehicle {\n\n    constructor(weight, seats, maxSpeed) {\n        this.weight = weight\n        this.seats = seats\n        this.maxSpeed = maxSpeed\n    }\n\n    // @bionic get set weight Float\n    // @bionic get seats Int\n    // @bionic get maxSpeed Int\n\n    get name() {\n        return 'vehicle'\n    }\n\n    // @bionic String\n    get description() {\n        return `This ${this.name} has ${this.seats} seats, it weighs ${this.weight} kg, can reach ${this.maxSpeed} km/h`\n    }\n}\n\nmodule.exports = {Vehicle}\n\n\n//# sourceURL=webpack:///./libs/Vehicle.js?");

/***/ })

/******/ });