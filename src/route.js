import { pathToRegexp } from './utils';

export default class Route {
  constructor (path, name) {
    this.name = name;
    this.path = path;
    this.keys = [];
    this.fns = [];
    this.params = {};
    this.regex = pathToRegexp(this.path, this.keys, false, false);
  }

  addHandler (fn) {
    this.fns.push(fn);
  }

  removeHandler (fn) {
    for (let i = 0, c = this.fns.length; i < c; i++) {
      let f = this.fns[i];

      if (fn === f) {
        this.fns.splice(i, 1);
        return;
      }
    }
  }

  run (params) {
    for (let i = 0, c = this.fns.length; i < c; i++) {
      this.fns[i].apply(this, params);
    }
  }

  match (path, params) {
    let m = this.regex.exec(path);

    if (!m) {
      return false;
    }

    for (let i = 1, len = m.length; i < len; ++i) {
      let key = this.keys[i - 1];
      let val = typeof m[i] === 'string' ? decodeURIComponent(m[i]) : m[i];

      if (key) {
        this.params[key.name] = val;
      }

      params.push(val);
    }

    return true;
  }

  toURL (params) {
    let path = this.path;
    for (let param in params) {
      path = path.replace(`/:${param}`, `/${params[param]}`);
    }

    path = path.replace(/\/:.*\?/g, '/').replace(/\?/g, '');

    if (path.indexOf(':') !== -1) {
      throw new Error('missing parameters for url: ', path);
    }

    return path;
  }
}
