'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('./utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Route = function () {
  function Route(path, name) {
    _classCallCheck(this, Route);

    this.name = name;
    this.path = path;
    this.keys = [];
    this.fns = [];
    this.params = {};
    this.regex = (0, _utils.pathToRegexp)(this.path, this.keys, false, false);
  }

  Route.prototype.addHandler = function addHandler(fn) {
    this.fns.push(fn);
  };

  Route.prototype.removeHandler = function removeHandler(fn) {
    for (var i = 0, c = this.fns.length; i < c; i++) {
      var f = this.fns[i];

      if (fn === f) {
        this.fns.splice(i, 1);
        return;
      }
    }
  };

  Route.prototype.run = function run(params) {
    for (var i = 0, c = this.fns.length; i < c; i++) {
      this.fns[i].apply(this, params);
    }
  };

  Route.prototype.match = function match(path, params) {
    var m = this.regex.exec(path);

    if (!m) {
      return false;
    }

    for (var i = 1, len = m.length; i < len; ++i) {
      var key = this.keys[i - 1];
      var val = typeof m[i] === 'string' ? decodeURIComponent(m[i]) : m[i];

      if (key) {
        this.params[key.name] = val;
      }

      params.push(val);
    }

    return true;
  };

  Route.prototype.toURL = function toURL(params) {
    var path = this.path;
    for (var param in params) {
      path = path.replace('/:' + param, '/' + params[param]);
    }

    path = path.replace(/\/:.*\?/g, '/').replace(/\?/g, '');

    if (path.indexOf(':') !== -1) {
      throw new Error('missing parameters for url: ', path);
    }

    return path;
  };

  return Route;
}();

exports.default = Route;