/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["markdown-it-imsize.js"] = factory();
	else
		root["markdown-it-imsize.js"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./lib/helpers/parse_image_size.js":
/*!*****************************************!*\
  !*** ./lib/helpers/parse_image_size.js ***!
  \*****************************************/
/***/ ((module) => {

"use strict";
eval("// Parse image size\n//\n\n\nfunction parseNextNumber(str, pos, max) {\n  var code,\n  start = pos,\n  result = {\n    ok: false,\n    pos: pos,\n    value: ''\n  };\n\n  code = str.charCodeAt(pos);\n\n  while (pos < max && (code >= 0x30 /* 0 */ && code <= 0x39 /* 9 */) || code === 0x25 /* % */) {\n    code = str.charCodeAt(++pos);\n  }\n\n  result.ok = true;\n  result.pos = pos;\n  result.value = str.slice(start, pos);\n\n  return result;\n}\n\nmodule.exports = function parseImageSize(str, pos, max) {\n  var code,\n  result = {\n    ok: false,\n    pos: 0,\n    width: '',\n    height: ''\n  };\n\n  if (pos >= max) { return result; }\n\n  code = str.charCodeAt(pos);\n\n  if (code !== 0x3d /* = */) { return result; }\n\n  pos++;\n\n  // size must follow = without any white spaces as follows\n  // (1) =300x200\n  // (2) =300x\n  // (3) =x200\n  code = str.charCodeAt(pos);\n  if (code !== 0x78 /* x */ && (code < 0x30 || code  > 0x39) /* [0-9] */) {\n    return result;\n  }\n\n  // parse width\n  var resultW = parseNextNumber(str, pos, max);\n  pos = resultW.pos;\n\n  // next charactor must be 'x'\n  code = str.charCodeAt(pos);\n  if (code !== 0x78 /* x */) { return result; }\n\n  pos++;\n\n  // parse height\n  var resultH = parseNextNumber(str, pos, max);\n  pos = resultH.pos;\n\n  result.width = resultW.value;\n  result.height = resultH.value;\n  result.pos = pos;\n  result.ok = true;\n  return result;\n};\n\n\n//# sourceURL=webpack://markdown-it-imsize.js/./lib/helpers/parse_image_size.js?");

/***/ }),

/***/ "./lib/imsize/detector.js":
/*!********************************!*\
  !*** ./lib/imsize/detector.js ***!
  \********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nvar typeMap = {};\nvar types = __webpack_require__(/*! ./types */ \"./lib/imsize/types.js\");\n\ntypeMap[\"jpg\"]=__webpack_require__(/*! ./types/jpg.js */ \"./lib/imsize/types/jpg.js\");\ntypeMap[\"png\"]=__webpack_require__(/*! ./types/png.js */ \"./lib/imsize/types/png.js\");\ntypeMap[\"gif\"]=__webpack_require__(/*! ./types/gif.js */ \"./lib/imsize/types/gif.js\");\ntypeMap[\"svg\"]=__webpack_require__(/*! ./types/svg.js */ \"./lib/imsize/types/svg.js\");\n\nmodule.exports = function(buffer, filepath) {\n\tvar type, result;\n  for (type in typeMap) {\n    if (type in typeMap) {\n      result = typeMap[type](buffer, filepath);\n      if (result) {\n        return type;\n      }\n    }\n  }\n  throw new TypeError('Unsupported type');\n};\n\n\n//# sourceURL=webpack://markdown-it-imsize.js/./lib/imsize/detector.js?");

/***/ }),

/***/ "./lib/imsize/index.js":
/*!*****************************!*\
  !*** ./lib/imsize/index.js ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nvar fs   = __webpack_require__(/*! fs */ \"?8049\");\nvar path = __webpack_require__(/*! path */ \"?3826\");\n\nvar detector = __webpack_require__(/*! ./detector */ \"./lib/imsize/detector.js\");\nvar handlers = {};\nvar types = __webpack_require__(/*! ./types */ \"./lib/imsize/types.js\");\n\n//types.forEach(function(type) {\n//  handlers[type] = require('./types/' + type);\n//});\nhandlers[\"jpg\"]=__webpack_require__(/*! ./types/jpg.js */ \"./lib/imsize/types/jpg.js\");\nhandlers[\"png\"]=__webpack_require__(/*! ./types/png.js */ \"./lib/imsize/types/png.js\");\nhandlers[\"gif\"]=__webpack_require__(/*! ./types/gif.js */ \"./lib/imsize/types/gif.js\");\nhandlers[\"svg\"]=__webpack_require__(/*! ./types/svg.js */ \"./lib/imsize/types/svg.js\");\n\nvar MaxBufferSize = 128 * 1024;\n\nfunction lookup(buffer, filepath) {\n  var type = detector(buffer, filepath);\n\n  if (type in handlers) {\n    var size = handlers[type].calculate(buffer, filepath);\n    if (size !== false) {\n      size.type = type;\n      return size;\n    }\n  }\n\n  throw new TypeError('Unsupported file type');\n}\n\nfunction asyncFileToBuffer(filepath, callback) {\n  fs.open(filepath, 'r', function(err0, descriptor) {\n    if (err0) {\n      return callback(err0);\n    }\n\n    var size = fs.fstatSync(descriptor).size;\n    var bufferSize = Math.min(size, MaxBufferSize);\n    var buffer = new Buffer(bufferSize);\n    fs.read(descriptor, buffer, 0, bufferSize, 0, function(err1) {\n      if (err1) {\n        return callback(err1);\n      }\n\n      fs.close(descriptor, function(err2) {\n        callback(err2, buffer);\n      });\n    });\n  });\n}\n\nfunction syncFileToBuffer(filepath) {\n  var descriptor = fs.openSync(filepath, 'r');\n  var size = fs.fstatSync(descriptor).size;\n  var bufferSize = Math.min(size, MaxBufferSize);\n  var buffer = new Buffer(bufferSize);\n  fs.readSync(descriptor, buffer, 0, bufferSize, 0);\n  fs.closeSync(descriptor);\n  return buffer;\n}\n\n/**\n * Returns the dimensions of the image file\n * @param[in] input: input image path\n * @param[in] callback(option): if specified, gets size async.\n */\nmodule.exports = function(input, callback) {\n  if (typeof input !== 'string') {\n    throw new TypeError('Input must be file name');\n  }\n\n  var filepath = path.resolve(input);\n\n  if (typeof callback === 'function') {\n    asyncFileToBuffer(filepath, function(err, buffer) {\n      if (err) {\n        return callback(err);\n      }\n\n      var dimensions;\n      try {\n        dimensions = lookup(buffer, filepath);\n      } catch (e) {\n        err = e;\n      }\n      callback(err, dimensions);\n    });\n  } else {\n    var buffer = syncFileToBuffer(filepath);\n    return lookup(buffer, filepath);\n  }\n};\n\n\n//# sourceURL=webpack://markdown-it-imsize.js/./lib/imsize/index.js?");

/***/ }),

/***/ "./lib/imsize/types.js":
/*!*****************************!*\
  !*** ./lib/imsize/types.js ***!
  \*****************************/
/***/ ((module) => {

"use strict";
eval("\n\nmodule.exports = [\n  'bmp',\n  'gif',\n  'jpg',\n  'png',\n  'tiff',\n];\n\n\n//# sourceURL=webpack://markdown-it-imsize.js/./lib/imsize/types.js?");

/***/ }),

/***/ "./lib/imsize/types/gif.js":
/*!*********************************!*\
  !*** ./lib/imsize/types/gif.js ***!
  \*********************************/
/***/ ((module) => {

"use strict";
eval("\n\nvar gifRegexp = /^GIF8[7,9]a/;\nfunction isGIF (buffer) {\n  var signature = buffer.toString('ascii', 0, 6);\n  return (gifRegexp.test(signature));\n}\n\nfunction calculate(buffer) {\n  return {\n    'width': buffer.readUInt16LE(6),\n    'height': buffer.readUInt16LE(8)\n  };\n}\n\nmodule.exports = {\n  'detect': isGIF,\n  'calculate': calculate\n};\n\n//# sourceURL=webpack://markdown-it-imsize.js/./lib/imsize/types/gif.js?");

/***/ }),

/***/ "./lib/imsize/types/jpg.js":
/*!*********************************!*\
  !*** ./lib/imsize/types/jpg.js ***!
  \*********************************/
/***/ ((module) => {

"use strict";
eval("\n\n// NOTE: we only support baseline and progressive JPGs here\n// due to the structure of the loader class, we only get a buffer\n// with a maximum size of 4096 bytes. so if the SOF marker is outside\n// if this range we can't detect the file size correctly.\n\n// TO-DO: handle all JFIFs\nvar validJFIFMarkers = {\n  'ffdb': '0001010101', // Samsung D807 JPEG\n  'ffe0': '4a46494600', // Standard JPEG\n  'ffe1': '4578696600', // Camera JPEG, with EXIF data\n  'ffe2': '4943435f50', // Canon EOS-1D JPEG\n  'ffe3': '',           // Samsung D500 JPEG\n  'ffe8': '5350494646', // SPIFF JPEG\n  'ffec': '4475636b79', // Photoshop JPEG\n  'ffed': '50686f746f', // Adobe JPEG, Photoshop CMYK buffer\n  'ffee': '41646f6265'  // Adobe JPEG, Unrecognised (Lightroom??)\n};\n\nvar red = ['\\x1B[31m', '\\x1B[39m'];\nfunction isJPG (buffer) { //, filepath\n  var SOIMarker = buffer.toString('hex', 0, 2);\n  var JFIFMarker = buffer.toString('hex', 2, 4);\n\n  // not a valid jpeg\n  if ('ffd8' !== SOIMarker) {\n    return false;\n  }\n\n  // TO-DO: validate the end-bytes of a jpeg file\n  // use filepath, get the last bytes, check for ffd9\n  var got = buffer.toString('hex', 6, 11);\n  var expected = JFIFMarker && validJFIFMarkers[JFIFMarker];\n  if (expected === '') {\n    console.warn(\n      red[0] +\n      'this looks like a unrecognised jpeg\\n' +\n      'please report the issue here\\n' +\n      red[1],\n      '\\thttps://github.com/netroy/image-size/issues/new\\n'\n    );\n    return false;\n  }\n  return (got === expected) || (JFIFMarker === 'ffdb');\n}\n\nfunction extractSize (buffer, i) {\n  return {\n    'height' : buffer.readUInt16BE(i),\n    'width' : buffer.readUInt16BE(i + 2)\n  };\n}\n\nfunction validateBuffer (buffer, i) {\n  // index should be within buffer limits\n  if (i > buffer.length) {\n    throw new TypeError('Corrupt JPG, exceeded buffer limits');\n  }\n  // Every JPEG block must begin with a 0xFF\n  if (buffer[i] !== 0xFF) {\n    throw new TypeError('Invalid JPG, marker table corrupted');\n  }\n}\n\nfunction calculate (buffer) {\n\n  // Skip 5 chars, they are for signature\n  buffer = buffer.slice(4);\n\n  var i, next;\n  while (buffer.length) {\n    // read length of the next block\n    i = buffer.readUInt16BE(0);\n\n    // ensure correct format\n    validateBuffer(buffer, i);\n\n    // 0xFFC0 is baseline(SOF)\n    // 0xFFC2 is progressive(SOF2)\n    next = buffer[i + 1];\n    if (next === 0xC0 || next === 0xC2) {\n      return extractSize(buffer, i + 5);\n    }\n\n    // move to the next block\n    buffer = buffer.slice(i + 2);\n  }\n\n  throw new TypeError('Invalid JPG, no size found');\n}\n\nmodule.exports = {\n  'detect': isJPG,\n  'calculate': calculate\n};\n\n\n//# sourceURL=webpack://markdown-it-imsize.js/./lib/imsize/types/jpg.js?");

/***/ }),

/***/ "./lib/imsize/types/png.js":
/*!*********************************!*\
  !*** ./lib/imsize/types/png.js ***!
  \*********************************/
/***/ ((module) => {

"use strict";
eval("\n\nvar pngSignature = 'PNG\\r\\n\\x1a\\n';\nfunction isPNG (buffer) {\n  if (pngSignature === buffer.toString('ascii', 1, 8)) {\n    if ('IHDR' !== buffer.toString('ascii', 12, 16)) {\n      throw new TypeError('invalid png');\n    }\n    return true;\n  }\n}\n\nfunction calculate (buffer) {\n  return {\n    'width': buffer.readUInt32BE(16),\n    'height': buffer.readUInt32BE(20)\n  };\n}\n\nmodule.exports = {\n  'detect': isPNG,\n  'calculate': calculate\n};\n\n\n//# sourceURL=webpack://markdown-it-imsize.js/./lib/imsize/types/png.js?");

/***/ }),

/***/ "./lib/imsize/types/svg.js":
/*!*********************************!*\
  !*** ./lib/imsize/types/svg.js ***!
  \*********************************/
/***/ ((module) => {

"use strict";
eval("\n\nvar svgReg = /<svg[^>]+[^>]*>/;\nfunction isSVG (buffer) {\n  return svgReg.test(buffer);\n}\n\nvar extractorRegExps = {\n  'root': /<svg [^>]+>/,\n  'width': /(^|\\s)width\\s*=\\s*\"(.+?)\"/i,\n  'height': /(^|\\s)height\\s*=\\s*\"(.+?)\"/i,\n  'viewbox': /(^|\\s)viewbox\\s*=\\s*\"(.+?)\"/i\n};\n\nfunction getRatio (viewbox) {\n  var ratio = 1;\n  if (viewbox && viewbox[2]) {\n    var dim = viewbox[2].split(/\\s/g);\n    if (dim.length === 4) {\n      dim = dim.map(function (i) {\n        return parseInt(i, 10);\n      });\n      ratio = (dim[2] - dim[0]) / (dim[3] - dim[1]);\n    }\n  }\n  return ratio;\n}\n\nfunction parse (buffer) {\n  var body = buffer.toString().replace(/[\\r\\n\\s]+/g, ' ');\n  var section = body.match(extractorRegExps.root);\n  var root = section && section[0];\n  if (root) {\n    var width = root.match(extractorRegExps.width);\n    var height = root.match(extractorRegExps.height);\n    var viewbox = root.match(extractorRegExps.viewbox);\n    var ratio = getRatio(viewbox);\n    return {\n      'width': parseInt(width && width[2], 10) || 0,\n      'height': parseInt(height && height[2], 10) || 0,\n      'ratio': ratio\n    };\n  }\n}\n\nfunction calculate (buffer) {\n\n  var parsed = parse(buffer);\n  var width = parsed.width;\n  var height = parsed.height;\n  var ratio = parsed.ratio;\n\n  if (width && height) {\n    return { 'width': width, 'height': height };\n  } else {\n    if (width) {\n      return { 'width': width, 'height': Math.floor(width / ratio) };\n    } else if (height) {\n      return { 'width': Math.floor(height * ratio), 'height': height };\n    } else {\n      throw new TypeError('invalid svg');\n    }\n  }\n}\n\nmodule.exports = {\n  'detect': isSVG,\n  'calculate': calculate\n};\n\n\n//# sourceURL=webpack://markdown-it-imsize.js/./lib/imsize/types/svg.js?");

/***/ }),

/***/ "./lib/index.js":
/*!**********************!*\
  !*** ./lib/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ imsize_plugin)\n/* harmony export */ });\n// Process ![test]( x =100x200)\n//                    ^^^^^^^^ this size specification\n\n\n\nvar sizeOf = __webpack_require__(/*! ./imsize */ \"./lib/imsize/index.js\");\n\nvar parseImageSize = __webpack_require__(/*! ./helpers/parse_image_size */ \"./lib/helpers/parse_image_size.js\");\n\nfunction image_with_size(md, options) {\n  return function(state, silent) {\n    var attrs,\n        code,\n        label,\n        labelEnd,\n        labelStart,\n        pos,\n        ref,\n        res,\n        title,\n        width = '',\n        height = '',\n        token,\n        tokens,\n        start,\n        href = '',\n        oldPos = state.pos,\n        max = state.posMax;\n\n    if (state.src.charCodeAt(state.pos) !== 0x21/* ! */) { return false; }\n    if (state.src.charCodeAt(state.pos + 1) !== 0x5B/* [ */) { return false; }\n\n    labelStart = state.pos + 2;\n    labelEnd = md.helpers.parseLinkLabel(state, state.pos + 1, false);\n\n    // parser failed to find ']', so it's not a valid link\n    if (labelEnd < 0) { return false; }\n\n    pos = labelEnd + 1;\n    if (pos < max && state.src.charCodeAt(pos) === 0x28/* ( */) {\n\n      //\n      // Inline link\n      //\n\n      // [link](  <href>  \"title\"  )\n      //        ^^ skipping these spaces\n      pos++;\n      for (; pos < max; pos++) {\n        code = state.src.charCodeAt(pos);\n        if (code !== 0x20 && code !== 0x0A) { break; }\n      }\n      if (pos >= max) { return false; }\n\n      // [link](  <href>  \"title\"  )\n      //          ^^^^^^ parsing link destination\n      start = pos;\n      res = md.helpers.parseLinkDestination(state.src, pos, state.posMax);\n      if (res.ok) {\n        href = state.md.normalizeLink(res.str);\n        if (state.md.validateLink(href)) {\n          pos = res.pos;\n        } else {\n          href = '';\n        }\n      }\n\n      // [link](  <href>  \"title\"  )\n      //                ^^ skipping these spaces\n      start = pos;\n      for (; pos < max; pos++) {\n        code = state.src.charCodeAt(pos);\n        if (code !== 0x20 && code !== 0x0A) { break; }\n      }\n\n      // [link](  <href>  \"title\"  )\n      //                  ^^^^^^^ parsing link title\n      res = md.helpers.parseLinkTitle(state.src, pos, state.posMax);\n      if (pos < max && start !== pos && res.ok) {\n        title = res.str;\n        pos = res.pos;\n\n        // [link](  <href>  \"title\"  )\n        //                         ^^ skipping these spaces\n        for (; pos < max; pos++) {\n          code = state.src.charCodeAt(pos);\n          if (code !== 0x20 && code !== 0x0A) { break; }\n        }\n      } else {\n        title = '';\n      }\n\n      // [link](  <href>  \"title\" =WxH  )\n      //                          ^^^^ parsing image size\n      if (pos - 1 >= 0) {\n        code = state.src.charCodeAt(pos - 1);\n\n        // there must be at least one white spaces\n        // between previous field and the size\n        if (code === 0x20) {\n          res = parseImageSize(state.src, pos, state.posMax);\n          if (res.ok) {\n            width = res.width;\n            height = res.height;\n            pos = res.pos;\n\n            // [link](  <href>  \"title\" =WxH  )\n            //                              ^^ skipping these spaces\n            for (; pos < max; pos++) {\n              code = state.src.charCodeAt(pos);\n              if (code !== 0x20 && code !== 0x0A) { break; }\n            }\n          }\n        }\n      }\n\n      if (pos >= max || state.src.charCodeAt(pos) !== 0x29/* ) */) {\n        state.pos = oldPos;\n        return false;\n      }\n      pos++;\n\n    } else {\n      //\n      // Link reference\n      //\n      if (typeof state.env.references === 'undefined') { return false; }\n\n      // [foo]  [bar]\n      //      ^^ optional whitespace (can include newlines)\n      for (; pos < max; pos++) {\n        code = state.src.charCodeAt(pos);\n        if (code !== 0x20 && code !== 0x0A) { break; }\n      }\n\n      if (pos < max && state.src.charCodeAt(pos) === 0x5B/* [ */) {\n        start = pos + 1;\n        pos = md.helpers.parseLinkLabel(state, pos);\n        if (pos >= 0) {\n          label = state.src.slice(start, pos++);\n        } else {\n          pos = labelEnd + 1;\n        }\n      } else {\n        pos = labelEnd + 1;\n      }\n\n      // covers label === '' and label === undefined\n      // (collapsed reference link and shortcut reference link respectively)\n      if (!label) { label = state.src.slice(labelStart, labelEnd); }\n\n      ref = state.env.references[md.utils.normalizeReference(label)];\n      if (!ref) {\n        state.pos = oldPos;\n        return false;\n      }\n      href = ref.href;\n      title = ref.title;\n    }\n\n    //\n    // We found the end of the link, and know for a fact it's a valid link;\n    // so all that's left to do is to call tokenizer.\n    //\n    if (!silent) {\n      state.pos = labelStart;\n      state.posMax = labelEnd;\n\n      var newState = new state.md.inline.State(\n        state.src.slice(labelStart, labelEnd),\n        state.md,\n        state.env,\n        tokens = []\n      );\n      newState.md.inline.tokenize(newState);\n\n      // if 'autofill' option is specified\n      // and width/height are both blank,\n      // they are filled automatically\n      if (options) {\n        if (options.autofill && width === '' && height === '') {\n          try {\n            var dimensions = sizeOf(href);\n            width = dimensions.width;\n            height = dimensions.height;\n          } catch (e) { }\n        }\n      }\n\n      token          = state.push('image', 'img', 0);\n      token.attrs    = attrs = [ [ 'src', href ],\n                                 [ 'alt', '' ] ];\n      token.children = tokens;\n      if (title) {\n        attrs.push([ 'title', title ]);\n      }\n\n      if (width !== '') {\n        attrs.push([ 'width', width ]);\n      }\n\n      if (height !== '') {\n        attrs.push([ 'height', height ]);\n      }\n    }\n\n    state.pos = pos;\n    state.posMax = max;\n    return true;\n  };\n}\n\nfunction imsize_plugin(md, options) {\n  md.inline.ruler.before('emphasis', 'image', image_with_size(md, options));\n};\n\n\n\n//# sourceURL=webpack://markdown-it-imsize.js/./lib/index.js?");

/***/ }),

/***/ "?8049":
/*!********************!*\
  !*** fs (ignored) ***!
  \********************/
/***/ (() => {

eval("/* (ignored) */\n\n//# sourceURL=webpack://markdown-it-imsize.js/fs_(ignored)?");

/***/ }),

/***/ "?3826":
/*!**********************!*\
  !*** path (ignored) ***!
  \**********************/
/***/ (() => {

eval("/* (ignored) */\n\n//# sourceURL=webpack://markdown-it-imsize.js/path_(ignored)?");

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
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./lib/index.js");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});