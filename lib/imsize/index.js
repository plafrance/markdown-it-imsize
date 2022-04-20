'use strict';

import fs   from 'fs';
import path from 'path';

import detector from './detector';
var handlers = {};

handlers["jpg"]=import('./types/jpg.js');
handlers["png"]=import('./types/png.js');
handlers["gif"]=import('./types/gif.js');
handlers["svg"]=import('./types/svg.js');

var MaxBufferSize = 128 * 1024;

function lookup(buffer, filepath) {
  var type = detector(buffer, filepath);

  if (type in handlers) {
    var size = handlers[type].calculate(buffer, filepath);
    if (size !== false) {
      size.type = type;
      return size;
    }
  }

  throw new TypeError('Unsupported file type');
}

function asyncFileToBuffer(filepath, callback) {
  fs.open(filepath, 'r', function(err0, descriptor) {
    if (err0) {
      return callback(err0);
    }

    var size = fs.fstatSync(descriptor).size;
    var bufferSize = Math.min(size, MaxBufferSize);
    var buffer = new Buffer(bufferSize);
    fs.read(descriptor, buffer, 0, bufferSize, 0, function(err1) {
      if (err1) {
        return callback(err1);
      }

      fs.close(descriptor, function(err2) {
        callback(err2, buffer);
      });
    });
  });
}

function syncFileToBuffer(filepath) {
  var descriptor = fs.openSync(filepath, 'r');
  var size = fs.fstatSync(descriptor).size;
  var bufferSize = Math.min(size, MaxBufferSize);
  var buffer = new Buffer(bufferSize);
  fs.readSync(descriptor, buffer, 0, bufferSize, 0);
  fs.closeSync(descriptor);
  return buffer;
}

/**
 * Returns the dimensions of the image file
 * @param[in] input: input image path
 * @param[in] callback(option): if specified, gets size async.
 */
export default function(input, callback) {
  if (typeof input !== 'string') {
    throw new TypeError('Input must be file name');
  }

  var filepath = path.resolve(input);

  if (typeof callback === 'function') {
    asyncFileToBuffer(filepath, function(err, buffer) {
      if (err) {
        return callback(err);
      }

      var dimensions;
      try {
        dimensions = lookup(buffer, filepath);
      } catch (e) {
        err = e;
      }
      callback(err, dimensions);
    });
  } else {
    var buffer = syncFileToBuffer(filepath);
    return lookup(buffer, filepath);
  }
};
