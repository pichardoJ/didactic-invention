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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

const functionRegex = /(?:(?:function)|(?:constructor))\s*[^\(]*\(\s*([^\)]*)\)/m;

function getDeps(fn) {
  return fn.length > 0
    ? fn
        .toString()
        .match(functionRegex)[1]
        .replace(/ /g, '')
        .split(',')
    : [];
}

function scope(registration, fn) {
  let registry = [];
  let instances = {};

  const registryFn = entry => (registry = [...registry, entry]);

  registration(registryFn);

  const resolve = type => {
    const key = (typeof type === 'string'
      ? type
      : type.name.toString()
    ).toUpperCase();

    let instance =
      instances[key] ||
      (function() {
        const entry = registry.find(
          entry =>
            (entry.name && entry.name.toUpperCase() === key) ||
            entry.type.name.toString().toUpperCase() === key
        );
        const res =
          entry &&
          (entry.value ||
            (entry.factory
              ? entry.factory(resolve)
              : Reflect.construct(
                  entry.type,
                  getDeps(entry.type).map(dep => resolve(dep))
                )));

        return res;
      })();

    if (!instance) throw Error(`Can't Resolve for key ${key}`);

    return instance;
  };

  return (...args) => fn(resolve, ...args);
}

module.exports = scope;


/***/ })
/******/ ]);
//# sourceMappingURL=index.js.map