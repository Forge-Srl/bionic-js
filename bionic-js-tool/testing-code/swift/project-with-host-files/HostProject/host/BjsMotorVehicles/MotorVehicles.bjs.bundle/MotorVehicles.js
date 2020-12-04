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

eval("class BjsNativeObject {\n\n    constructor(...params) {\n        this.constructor.bjsNative.bjsBind(this, ...params)\n    }\n}\n\nmodule.exports = {BjsNativeObject}\n\n//# sourceURL=webpack://guest-code/./BjsNativeObject.js?");

/***/ }),

/***/ "./FerrariCalifornia.js":
/*!******************************!*\
  !*** ./FerrariCalifornia.js ***!
  \******************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: module, __webpack_require__ */
/*! CommonJS bailout: module.exports is used directly at 15:0-14 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const {MotorVehicle} = __webpack_require__(/*! ./libs/MotorVehicle */ \"./libs/MotorVehicle.js\")\n\n// @bionic\nclass FerrariCalifornia extends MotorVehicle {\n\n    constructor() {\n        super(1660, 2, 312, 'petrol', 500, 250)\n    }\n\n    get name() {\n        return 'Ferrari California'\n    }\n}\n\nmodule.exports = {FerrariCalifornia}\n\n\n//# sourceURL=webpack://guest-code/./FerrariCalifornia.js?");

/***/ }),

/***/ "./TeslaRoadster.js":
/*!**************************!*\
  !*** ./TeslaRoadster.js ***!
  \**************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: module, __webpack_require__ */
/*! CommonJS bailout: module.exports is used directly at 29:0-14 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const {MotorVehicle} = __webpack_require__(/*! ./libs/MotorVehicle */ \"./libs/MotorVehicle.js\")\n\nclass TeslaRoadster extends MotorVehicle {\n\n    // @bionic TeslaRoadster\n    static get default() {\n        return new TeslaRoadster()\n    }\n\n    constructor() {\n        super(1140, 2, 201, 'electricity', 392, 300)\n    }\n\n    // @bionic JsRef\n    get serialized() {\n        return {json: JSON.stringify(this)}\n    }\n\n    get name() {\n        return 'Tesla Roadster'\n    }\n\n    // @bionic Bool\n    get canTravelInTheSpace() {\n        return true\n    }\n}\n\nmodule.exports = {TeslaRoadster}\n\n\n//# sourceURL=webpack://guest-code/./TeslaRoadster.js?");

/***/ }),

/***/ "./libs/FuelType.js":
/*!**************************!*\
  !*** ./libs/FuelType.js ***!
  \**************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: module */
/*! CommonJS bailout: module.exports is used directly at 37:0-14 */
/***/ ((module) => {

eval("class FuelType {\n\n    // @bionic FuelType\n    static get Electricity() {\n        return new FuelType('electricity', 0.2)\n    }\n\n    // @bionic FuelType\n    static get NaturalGas() {\n        return new FuelType('natural gas', 0.4)\n    }\n\n    // @bionic FuelType\n    static get Diesel() {\n        return new FuelType('diesel', 0.6)\n    }\n\n    // @bionic FuelType\n    static get Petrol() {\n        return new FuelType('petrol', 0.8)\n    }\n\n    // @bionic FuelType\n    static get Kerosene() {\n        return new FuelType('kerosene', 1.0)\n    }\n    \n    constructor(name, cost) {\n        this.name = name\n        this.cost = cost\n    }\n\n    // @bionic get name String\n    // @bionic get cost Float\n}\n\nmodule.exports = {FuelType}\n\n\n//# sourceURL=webpack://guest-code/./libs/FuelType.js?");

/***/ }),

/***/ "./libs/MotorVehicle.js":
/*!******************************!*\
  !*** ./libs/MotorVehicle.js ***!
  \******************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: module, __webpack_require__ */
/*! CommonJS bailout: module.exports is used directly at 41:0-14 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const {Vehicle} = __webpack_require__(/*! ./Vehicle */ \"./libs/Vehicle.js\")\nconst {Engine} = __webpack_require__(/*! ../native/Engine */ \"./native/Engine.js\")\nconst {ModuleA} = __webpack_require__(/*! module-a */ \"./node_modules/module-a/ModuleA.js\")\n\nclass MotorVehicle extends Vehicle {\n\n    // @bionic (Int, Int, Int, FuelType, Float, Float)\n    constructor(weight, seats, maxSpeed, fuelType, maxRange, currentRange) {\n        super(weight, seats, maxSpeed)\n        this.engine = new Engine(fuelType)\n        this.maxRange = maxRange\n        this.currentRange = currentRange\n    }\n\n    // @bionic get engine Engine\n    // @bionic get rawEngine NativeRef<Engine>\n    // @bionic get delegate AppDelegate\n\n    get description() {\n        return `${super.description}, it has an engine powered by ${this.engine.fuelType.name} with ${this.maxRange} km of range`\n    }\n\n    // @bionic Bool\n    get isOnReserve() {\n        return this.currentRange < 100\n    }\n\n    // @bionic () => Float\n    refuel() {\n        const missingRange = this.maxRange - this.currentRange\n        this.currentRange = this.maxRange\n        return this.engine.fuelType.cost * missingRange\n    }\n\n    // @bionic (() => String)\n    watchEngine(observer) {\n        this.engine.watch(observer)\n    }\n}\n\nmodule.exports = {MotorVehicle}\n\n\n//# sourceURL=webpack://guest-code/./libs/MotorVehicle.js?");

/***/ }),

/***/ "./libs/Vehicle.js":
/*!*************************!*\
  !*** ./libs/Vehicle.js ***!
  \*************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: module */
/*! CommonJS bailout: module.exports is used directly at 23:0-14 */
/***/ ((module) => {

eval("class Vehicle {\n\n    constructor(weight, seats, maxSpeed) {\n        this.weight = weight\n        this.seats = seats\n        this.maxSpeed = maxSpeed\n    }\n\n    // @bionic get set weight Float\n    // @bionic get seats Int\n    // @bionic get maxSpeed Int\n\n    get name() {\n        return 'vehicle'\n    }\n\n    // @bionic String\n    get description() {\n        return `This ${this.name} has ${this.seats} seats, it weighs ${this.weight} kg, can reach ${this.maxSpeed} km/h`\n    }\n}\n\nmodule.exports = {Vehicle}\n\n\n//# sourceURL=webpack://guest-code/./libs/Vehicle.js?");

/***/ }),

/***/ "./native/BaseEngine.js":
/*!******************************!*\
  !*** ./native/BaseEngine.js ***!
  \******************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: module, __webpack_require__ */
/*! CommonJS bailout: module.exports is used directly at 23:0-14 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const {BjsNativeObject} = __webpack_require__(/*! ../BjsNativeObject */ \"./BjsNativeObject.js\")\nconst {bjsNative} = bjsNativeRequire('BaseEngine')\n\nclass BaseEngine extends BjsNativeObject {\n    \n    static get bjsNative() {\n        return bjsNative\n    }\n    \n    powerOn() {\n        bjsNative.bjs_powerOn(this)\n    }\n    \n    powerOff() {\n        bjsNative.bjs_powerOff(this)\n    }\n    \n    watch(callback) {\n        bjsNative.bjs_watch(this, callback)\n    }\n}\n\nmodule.exports = {BaseEngine}\n\n//# sourceURL=webpack://guest-code/./native/BaseEngine.js?");

/***/ }),

/***/ "./native/Engine.js":
/*!**************************!*\
  !*** ./native/Engine.js ***!
  \**************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: module, __webpack_require__ */
/*! CommonJS bailout: module.exports is used directly at 15:0-14 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const {BaseEngine} = __webpack_require__(/*! ./BaseEngine */ \"./native/BaseEngine.js\")\nconst {bjsNative} = bjsNativeRequire('Engine')\n\nclass Engine extends BaseEngine {\n    \n    static get bjsNative() {\n        return bjsNative\n    }\n    \n    get fuelType() {\n        return bjsNative.bjsGet_fuelType(this)\n    }\n}\n\nmodule.exports = {Engine}\n\n//# sourceURL=webpack://guest-code/./native/Engine.js?");

/***/ }),

/***/ "./node_modules/module-a/ModuleA.js":
/*!******************************************!*\
  !*** ./node_modules/module-a/ModuleA.js ***!
  \******************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: module, __webpack_require__ */
/*! CommonJS bailout: module.exports is used directly at 3:0-14 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const {ModuleB} = __webpack_require__(/*! module-b */ \"./node_modules/module-b/ModuleB.js\")\n\nmodule.exports = {ModuleA: {name:'module-a', version:'1.0', dependencies: {ModuleB}}}\n\n\n//# sourceURL=webpack://guest-code/./node_modules/module-a/ModuleA.js?");

/***/ }),

/***/ "./node_modules/module-b/ModuleB.js":
/*!******************************************!*\
  !*** ./node_modules/module-b/ModuleB.js ***!
  \******************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: module, __webpack_require__ */
/*! CommonJS bailout: module.exports is used directly at 3:0-14 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const {ModuleC} = __webpack_require__(/*! module-c */ \"./node_modules/module-c/ModuleC.js\")\n\nmodule.exports = {ModuleB: {name:'module-b', version:'1.0', dependencies: {ModuleC}}}\n\n\n//# sourceURL=webpack://guest-code/./node_modules/module-b/ModuleB.js?");

/***/ }),

/***/ "./node_modules/module-c/ModuleC.js":
/*!******************************************!*\
  !*** ./node_modules/module-c/ModuleC.js ***!
  \******************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: module, __webpack_require__ */
/*! CommonJS bailout: module.exports is used directly at 4:0-14 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const {ModuleA} = __webpack_require__(/*! module-a */ \"./node_modules/module-a/ModuleA.js\")\nconst {ModuleB} = __webpack_require__(/*! module-b */ \"./node_modules/module-c/node_modules/module-b/ModuleB.js\")\n\nmodule.exports = {ModuleC: {name:'module-c', version:'1.0', dependencies: {ModuleA, ModuleB}}}\n\n\n//# sourceURL=webpack://guest-code/./node_modules/module-c/ModuleC.js?");

/***/ }),

/***/ "./node_modules/module-c/node_modules/module-b/ModuleB.js":
/*!****************************************************************!*\
  !*** ./node_modules/module-c/node_modules/module-b/ModuleB.js ***!
  \****************************************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: module */
/*! CommonJS bailout: module.exports is used directly at 1:0-14 */
/***/ ((module) => {

eval("module.exports = {ModuleB: {name:'module-b', version:'2.0'}}\n\n\n//# sourceURL=webpack://guest-code/./node_modules/module-c/node_modules/module-b/ModuleB.js?");

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
(() => {
/*!**********************************!*\
  !*** ./MotorVehiclesBjsIndex.js ***!
  \**********************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: __webpack_require__ */
eval("bjsSetModuleLoader(moduleName => {\n    switch (moduleName) {\n        case 'FerrariCalifornia': return __webpack_require__(/*! ./FerrariCalifornia.js */ \"./FerrariCalifornia.js\")\n        case 'TeslaRoadster': return __webpack_require__(/*! ./TeslaRoadster.js */ \"./TeslaRoadster.js\")\n        case 'FuelType': return __webpack_require__(/*! ./libs/FuelType.js */ \"./libs/FuelType.js\")\n        case 'MotorVehicle': return __webpack_require__(/*! ./libs/MotorVehicle.js */ \"./libs/MotorVehicle.js\")\n        case 'Vehicle': return __webpack_require__(/*! ./libs/Vehicle.js */ \"./libs/Vehicle.js\")\n        case 'BaseEngine': return __webpack_require__(/*! ./native/BaseEngine.js */ \"./native/BaseEngine.js\")\n        case 'Engine': return __webpack_require__(/*! ./native/Engine.js */ \"./native/Engine.js\")\n    }\n})\n\n//# sourceURL=webpack://guest-code/./MotorVehiclesBjsIndex.js?");
})();

/******/ })()
;