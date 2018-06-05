'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _utils = require('./utils');

var _route = require('./route');

var _route2 = _interopRequireDefault(_route);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var reference = 'routie';
var routes = [];
var map = {};
var oldReference = window[reference];

var routie = function routie(path, fn) {
  if (typeof fn === 'function') {
    addHandler(path, fn);
    routie.reload();
  } else if ((typeof path === 'undefined' ? 'undefined' : _typeof(path)) === 'object') {
    for (var p in path) {
      addHandler(p, path[p]);
    }

    routie.reload();
  } else if (typeof fn === 'undefined') {
    routie.navigate(path);
  }
};

routie.lookup = function (name, obj) {
  for (var i = 0, c = routes.length; i < c; i++) {
    var route = routes[i];
    if (route.name === name) {
      return route.toURL(obj);
    }
  }
};

routie.remove = function (path, fn) {
  var route = map[path];

  if (!route) {
    return;
  }

  route.removeHandler(fn);
};

routie.removeAll = function () {
  map = {};
  routes = [];
};

routie.navigate = function (path, options) {
  options = options || {};
  var silent = options.silent || false;

  if (silent) {
    removeHashChangeListener();
  }

  setTimeout(function () {
    if (window.history.pushState && HashChangeEvent) {
      var oldURL = window.location.toString();
      window.history.pushState({}, '', '#' + path);
      window.dispatchEvent(new HashChangeEvent('hashchange', { oldURL: oldURL, newURL: window.location.toString() }));
    } else {
      var currentScrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      window.location.hash = path;
      document.documentElement.scrollTop = currentScrollTop;
    }

    if (silent) {
      setTimeout(function () {
        addHashChangeListener();
      }, 1);
    }
  }, 1);
};

routie.noConflict = function () {
  window[reference] = oldReference;

  return routie;
};

var onHashChange = function onHashChange() {
  var hash = (0, _utils.getHash)();

  for (var i = 0, c = routes.length; i < c; i++) {
    var route = routes[i];

    if ((0, _utils.checkRoute)(hash, route)) {
      return;
    }
  }
};

routie.reload = onHashChange;

var addHandler = function addHandler(path, fn) {
  var s = path.split(' ');
  var name = s.length === 2 ? s[0] : null;

  path = s.length === 2 ? s[1] : s[0];

  if (!map[path]) {
    map[path] = new _route2.default(path, name);
    routes.push(map[path]);
  }

  map[path].addHandler(fn);
};

var addHashChangeListener = function addHashChangeListener() {
  return window.addEventListener('hashchange', onHashChange, false);
};

var removeHashChangeListener = function removeHashChangeListener() {
  return window.removeEventListener('hashchange', onHashChange);
};

addHashChangeListener();

exports.default = routie;