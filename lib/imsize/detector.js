'use strict';

var typeMap = {};

typeMap["jpg"]=import('./types/jpg.js');
typeMap["png"]=import('./types/png.js');
typeMap["gif"]=import('./types/gif.js');
typeMap["svg"]=import('./types/svg.js');

export default function(buffer, filepath) {
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
