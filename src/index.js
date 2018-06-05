import { getHash, checkRoute } from './utils';
import Route from './route';

const reference = 'routie';
let routes = [];
let map = {};
let oldReference = window[reference];

const routie = (path, fn) => {
  if (typeof fn === 'function') {
    addHandler(path, fn);
    routie.reload();
  } else if (typeof path === 'object') {
    for (let p in path) {
      addHandler(p, path[p]);
    }

    routie.reload();
  } else if (typeof fn === 'undefined') {
    routie.navigate(path);
  }
};

routie.lookup = (name, obj) => {
  for (let i = 0, c = routes.length; i < c; i++) {
    let route = routes[i];
    if (route.name === name) {
      return route.toURL(obj);
    }
  }
};

routie.remove = (path, fn) => {
  let route = map[path];

  if (!route) {
    return;
  }

  route.removeHandler(fn);
};

routie.removeAll = () => {
  map = {};
  routes = [];
};

routie.navigate = (path, options) => {
  options = options || {};
  var silent = options.silent || false;

  if (silent) {
    removeHashChangeListener();
  }

  setTimeout(() => {
    if (window.history.pushState && window.HashChangeEvent) {
      let oldURL = window.location.toString();
      window.history.pushState({}, '', `#${path}`);
      window.dispatchEvent(new HashChangeEvent('hashchange', { oldURL, newURL: window.location.toString() }));
    } else {
      let currentScrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      window.location.hash = path;
      document.documentElement.scrollTop = currentScrollTop;
    }

    if (silent) {
      setTimeout(() => {
        addHashChangeListener();
      }, 1);
    }
  }, 1);
};

routie.noConflict = () => {
  window[reference] = oldReference;

  return routie;
};

const onHashChange = () => {
  let hash = getHash();

  for (let i = 0, c = routes.length; i < c; i++) {
    let route = routes[i];

    if (checkRoute(hash, route)) {
      return;
    }
  }
};

routie.reload = onHashChange;

const addHandler = (path, fn) => {
  var s = path.split(' ');
  var name = s.length === 2 ? s[0] : null;

  path = s.length === 2 ? s[1] : s[0];

  if (!map[path]) {
    map[path] = new Route(path, name);
    routes.push(map[path]);
  }

  map[path].addHandler(fn);
};

const addHashChangeListener = () => window.addEventListener('hashchange', onHashChange, false);

const removeHashChangeListener = () => window.removeEventListener('hashchange', onHashChange);

addHashChangeListener();

export default routie;
