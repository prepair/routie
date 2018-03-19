'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var pathToRegexp = exports.pathToRegexp = function pathToRegexp(path, keys, sensitive, strict) {
  if (path instanceof RegExp) {
    return path;
  }

  if (path instanceof Array) {
    path = '(' + path.join('|') + ')';
  }

  path = path.concat(strict ? '' : '/?').replace(/\/\(/g, '(?:/').replace(/\+/g, '__plus__').replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function (_, slash, format, key, capture, optional) {
    keys.push({ name: key, optional: !!optional });
    slash = slash || '';
    return '' + (optional ? '' : slash) + '(?:' + (optional ? slash : '') + (format || '') + (capture || format && '([^/.]+?)' || '([^/]+?)') + ')' + (optional || '');
  }).replace(/([/.])/g, '\\$1').replace(/__plus__/g, '(.+)').replace(/\*/g, '(.*)');

  return new RegExp('^' + path + '$', sensitive ? '' : 'i');
};

var getHash = exports.getHash = function getHash() {
  return window.location.hash.substring(1);
};

var checkRoute = exports.checkRoute = function checkRoute(hash, route) {
  var params = [];

  if (route.match(hash, params)) {
    route.run(params);
    return true;
  }

  return false;
};