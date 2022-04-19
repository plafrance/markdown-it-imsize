'use strict';

var typeMap = {};
var types = require('./types');

typeMap["jpg"]=require('./types/jpg.js');
typeMap["png"]=require('./types/png.js');
typeMap["gif"]=require('./types/gif.js');
typeMap["svg"]=require('./types/svg.js');

module.exports = function(buffer, filepath) {
	var type, result;
  for (type in typeMap) {
    if (type in typeMap) {
      result = typeMap[type](buffer, filepath);
      if (result) {
        return type;
      }
    }
  }
  throw new TypeError('Unsupported type');
};
