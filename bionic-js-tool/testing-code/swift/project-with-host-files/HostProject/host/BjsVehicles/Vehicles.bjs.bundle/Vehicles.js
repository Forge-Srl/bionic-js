/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./Bicycle.js":
/*!********************!*\
  !*** ./Bicycle.js ***!
  \********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const {Vehicle} = __webpack_require__(/*! ./libs/Vehicle */ \"./libs/Vehicle.js\")\n\nclass Bicycle extends Vehicle {\n\n    constructor(weight, maxSpeed) {\n        super(weight, 1, maxSpeed)\n    }\n\n    // @bionic\n    ride() {\n    }\n}\n\nmodule.exports = {Bicycle}\n\n\n//# sourceURL=webpack://guest-code/./Bicycle.js?");

/***/ }),

/***/ "./VehiclesBjsIndex.js":
/*!*****************************!*\
  !*** ./VehiclesBjsIndex.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("bjsSetModuleLoader(moduleName => {\n    switch (moduleName) {\n        case 'Bicycle': return __webpack_require__(/*! ./Bicycle.js */ \"./Bicycle.js\")\n        case 'Vehicle': return __webpack_require__(/*! ./libs/Vehicle.js */ \"./libs/Vehicle.js\")\n    }\n})\n\n//# sourceURL=webpack://guest-code/./VehiclesBjsIndex.js?");

/***/ }),

/***/ "./libs/Vehicle.js":
/*!*************************!*\
  !*** ./libs/Vehicle.js ***!
  \*************************/
/***/ ((module) => {

eval("class Vehicle {\n\n    constructor(weight, seats, maxSpeed) {\n        this.weight = weight\n        this.seats = seats\n        this.maxSpeed = maxSpeed\n    }\n\n    // @bionic get set weight Float\n    // @bionic get seats Int\n    // @bionic get maxSpeed Int\n\n    get name() {\n        return 'vehicle'\n    }\n\n    // @bionic String\n    get description() {\n        return `This ${this.name} has ${this.seats} seats, it weighs ${this.weight} kg, can reach ${this.maxSpeed} km/h`\n    }\n}\n\nmodule.exports = {Vehicle}\n\n\n//# sourceURL=webpack://guest-code/./libs/Vehicle.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./VehiclesBjsIndex.js");
/******/ 	
/******/ })()
;