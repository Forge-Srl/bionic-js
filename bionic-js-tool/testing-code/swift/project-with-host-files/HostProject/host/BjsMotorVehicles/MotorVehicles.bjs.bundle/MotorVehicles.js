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
/******/ 	return __webpack_require__(__webpack_require__.s = "./MotorVehiclesBjsIndex.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./BjsNativeObject.js":
/*!****************************!*\
  !*** ./BjsNativeObject.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("class BjsNativeObject {\n\n    constructor(...params) {\n        this.constructor.bjsNative.bjsBind(this, ...params)\n    }\n}\n\nmodule.exports = {BjsNativeObject}\n\n//# sourceURL=webpack:///./BjsNativeObject.js?");

/***/ }),

/***/ "./FerrariCalifornia.js":
/*!******************************!*\
  !*** ./FerrariCalifornia.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const {MotorVehicle} = __webpack_require__(/*! ./libs/MotorVehicle */ \"./libs/MotorVehicle.js\")\n\n// @bionic\nclass FerrariCalifornia extends MotorVehicle {\n\n    constructor() {\n        super(1660, 2, 312, 'petrol', 500, 250)\n    }\n\n    get name() {\n        return 'Ferrari California'\n    }\n}\n\nmodule.exports = {FerrariCalifornia}\n\n\n//# sourceURL=webpack:///./FerrariCalifornia.js?");

/***/ }),

/***/ "./MotorVehiclesBjsIndex.js":
/*!**********************************!*\
  !*** ./MotorVehiclesBjsIndex.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("bjsSetModuleLoader(moduleName => {\n    switch (moduleName) {\n        case 'FerrariCalifornia': return __webpack_require__(/*! ./FerrariCalifornia.js */ \"./FerrariCalifornia.js\")\n        case 'TeslaRoadster': return __webpack_require__(/*! ./TeslaRoadster.js */ \"./TeslaRoadster.js\")\n        case 'FuelType': return __webpack_require__(/*! ./libs/FuelType.js */ \"./libs/FuelType.js\")\n        case 'MotorVehicle': return __webpack_require__(/*! ./libs/MotorVehicle.js */ \"./libs/MotorVehicle.js\")\n        case 'Vehicle': return __webpack_require__(/*! ./libs/Vehicle.js */ \"./libs/Vehicle.js\")\n        case 'BaseEngine': return __webpack_require__(/*! ./native/BaseEngine.js */ \"./native/BaseEngine.js\")\n        case 'Engine': return __webpack_require__(/*! ./native/Engine.js */ \"./native/Engine.js\")\n    }\n})\n\n//# sourceURL=webpack:///./MotorVehiclesBjsIndex.js?");

/***/ }),

/***/ "./TeslaRoadster.js":
/*!**************************!*\
  !*** ./TeslaRoadster.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const {MotorVehicle} = __webpack_require__(/*! ./libs/MotorVehicle */ \"./libs/MotorVehicle.js\")\n\nclass TeslaRoadster extends MotorVehicle {\n\n    // @bionic TeslaRoadster\n    static get default() {\n        return new TeslaRoadster()\n    }\n\n    constructor() {\n        super(1140, 2, 201, 'electricity', 392, 300)\n    }\n\n    // @bionic JsRef\n    get serialized() {\n        return {json: JSON.stringify(this)}\n    }\n\n    get name() {\n        return 'Tesla Roadster'\n    }\n\n    // @bionic Bool\n    get canTravelInTheSpace() {\n        return true\n    }\n}\n\nmodule.exports = {TeslaRoadster}\n\n\n//# sourceURL=webpack:///./TeslaRoadster.js?");

/***/ }),

/***/ "./libs/FuelType.js":
/*!**************************!*\
  !*** ./libs/FuelType.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("class FuelType {\n\n    // @bionic FuelType\n    static get Electricity() {\n        return new FuelType('electricity', 0.2)\n    }\n\n    // @bionic FuelType\n    static get NaturalGas() {\n        return new FuelType('natural gas', 0.4)\n    }\n\n    // @bionic FuelType\n    static get Diesel() {\n        return new FuelType('diesel', 0.6)\n    }\n\n    // @bionic FuelType\n    static get Petrol() {\n        return new FuelType('petrol', 0.8)\n    }\n\n    // @bionic FuelType\n    static get Kerosene() {\n        return new FuelType('kerosene', 1.0)\n    }\n    \n    constructor(name, cost) {\n        this.name = name\n        this.cost = cost\n    }\n\n    // @bionic get name String\n    // @bionic get cost Float\n}\n\nmodule.exports = {FuelType}\n\n\n//# sourceURL=webpack:///./libs/FuelType.js?");

/***/ }),

/***/ "./libs/MotorVehicle.js":
/*!******************************!*\
  !*** ./libs/MotorVehicle.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const {Vehicle} = __webpack_require__(/*! ./Vehicle */ \"./libs/Vehicle.js\")\nconst {Engine} = __webpack_require__(/*! ../native/Engine */ \"./native/Engine.js\")\nconst {ModuleA} = __webpack_require__(/*! module-a */ \"./node_modules/module-a/ModuleA.js\")\n\nclass MotorVehicle extends Vehicle {\n\n    // @bionic (Int, Int, Int, FuelType, Float, Float)\n    constructor(weight, seats, maxSpeed, fuelType, maxRange, currentRange) {\n        super(weight, seats, maxSpeed)\n        this.engine = new Engine(fuelType)\n        this.maxRange = maxRange\n        this.currentRange = currentRange\n    }\n\n    // @bionic get engine Engine\n    // @bionic get rawEngine NativeRef<Engine>\n    // @bionic get delegate AppDelegate\n\n    get description() {\n        return `${super.description}, it has an engine powered by ${this.engine.fuelType.name} with ${this.maxRange} km of range`\n    }\n\n    // @bionic Bool\n    get isOnReserve() {\n        return this.currentRange < 100\n    }\n\n    // @bionic () => Float\n    refuel() {\n        const missingRange = this.maxRange - this.currentRange\n        this.currentRange = this.maxRange\n        return this.engine.fuelType.cost * missingRange\n    }\n\n    // @bionic (() => String)\n    watchEngine(observer) {\n        this.engine.watch(observer)\n    }\n}\n\nmodule.exports = {MotorVehicle}\n\n\n//# sourceURL=webpack:///./libs/MotorVehicle.js?");

/***/ }),

/***/ "./libs/Vehicle.js":
/*!*************************!*\
  !*** ./libs/Vehicle.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("class Vehicle {\n\n    constructor(weight, seats, maxSpeed) {\n        this.weight = weight\n        this.seats = seats\n        this.maxSpeed = maxSpeed\n    }\n\n    // @bionic get set weight Float\n    // @bionic get seats Int\n    // @bionic get maxSpeed Int\n\n    get name() {\n        return 'vehicle'\n    }\n\n    // @bionic String\n    get description() {\n        return `This ${this.name} has ${this.seats} seats, it weighs ${this.weight} kg, can reach ${this.maxSpeed} km/h`\n    }\n}\n\nmodule.exports = {Vehicle}\n\n\n//# sourceURL=webpack:///./libs/Vehicle.js?");

/***/ }),

/***/ "./native/BaseEngine.js":
/*!******************************!*\
  !*** ./native/BaseEngine.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const {BjsNativeObject} = __webpack_require__(/*! ../BjsNativeObject */ \"./BjsNativeObject.js\")\nconst {bjsNative} = bjsNativeRequire('BaseEngine')\n\nclass BaseEngine extends BjsNativeObject {\n    \n    static get bjsNative() {\n        return bjsNative\n    }\n    \n    powerOn() {\n        bjsNative.bjs_powerOn(this)\n    }\n    \n    powerOff() {\n        bjsNative.bjs_powerOff(this)\n    }\n    \n    watch(callback) {\n        bjsNative.bjs_watch(this, callback)\n    }\n}\n\nmodule.exports = {BaseEngine}\n\n//# sourceURL=webpack:///./native/BaseEngine.js?");

/***/ }),

/***/ "./native/Engine.js":
/*!**************************!*\
  !*** ./native/Engine.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const {BaseEngine} = __webpack_require__(/*! ./BaseEngine */ \"./native/BaseEngine.js\")\nconst {bjsNative} = bjsNativeRequire('Engine')\n\nclass Engine extends BaseEngine {\n    \n    static get bjsNative() {\n        return bjsNative\n    }\n    \n    get fuelType() {\n        return bjsNative.bjsGet_fuelType(this)\n    }\n}\n\nmodule.exports = {Engine}\n\n//# sourceURL=webpack:///./native/Engine.js?");

/***/ }),

/***/ "./node_modules/module-a/ModuleA.js":
/*!******************************************!*\
  !*** ./node_modules/module-a/ModuleA.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const {ModuleB} = __webpack_require__(/*! module-b */ \"./node_modules/module-b/ModuleB.js\")\n\nmodule.exports = {ModuleA: {name:'module-a', version:'1.0', dependencies: {ModuleB}}}\n\n\n//# sourceURL=webpack:///./node_modules/module-a/ModuleA.js?");

/***/ }),

/***/ "./node_modules/module-b/ModuleB.js":
/*!******************************************!*\
  !*** ./node_modules/module-b/ModuleB.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const {ModuleC} = __webpack_require__(/*! module-c */ \"./node_modules/module-c/ModuleC.js\")\n\nmodule.exports = {ModuleB: {name:'module-b', version:'1.0', dependencies: {ModuleC}}}\n\n\n//# sourceURL=webpack:///./node_modules/module-b/ModuleB.js?");

/***/ }),

/***/ "./node_modules/module-c/ModuleC.js":
/*!******************************************!*\
  !*** ./node_modules/module-c/ModuleC.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const {ModuleA} = __webpack_require__(/*! module-a */ \"./node_modules/module-a/ModuleA.js\")\nconst {ModuleB} = __webpack_require__(/*! module-b */ \"./node_modules/module-c/node_modules/module-b/ModuleB.js\")\n\nmodule.exports = {ModuleC: {name:'module-c', version:'1.0', dependencies: {ModuleA, ModuleB}}}\n\n\n//# sourceURL=webpack:///./node_modules/module-c/ModuleC.js?");

/***/ }),

/***/ "./node_modules/module-c/node_modules/module-b/ModuleB.js":
/*!****************************************************************!*\
  !*** ./node_modules/module-c/node_modules/module-b/ModuleB.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = {ModuleB: {name:'module-b', version:'2.0'}}\n\n\n//# sourceURL=webpack:///./node_modules/module-c/node_modules/module-b/ModuleB.js?");

/***/ })

/******/ });