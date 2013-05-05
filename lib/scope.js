var Scope = exports.Scope = function (switcher, prefix) {
  this.switcher = switcher;
  this.prefix = '' + prefix;
};

Scope.prototype.scope = function (prefix) {
  return new Scope(this, prefix);
};

Scope.prototype.query = function () {
  var args = Array.prototype.slice.call(arguments, 0);
  
  if (typeof args[args.length - 1] == 'function')
    var callback = args.splice(-1)[0];
  
  var path = args[0], recursive = args[1];
  
  if (typeof path == 'boolean') {
    recursive = path;
    path = undefined;
  }
  
  return this.switcher.query(
    path ? this.prefix+'/'+path : this.prefix,
    recursive || true,
    callback
  );
};

Scope.prototype.watch = function (path, callback) {
  if (typeof path == 'function') {
    callback = path;
    path = undefined;
  }
  
  path = path ? this.prefix+'/'+path : this.prefix;
  
  return this.switcher.watch(path, callback);
};

Scope.prototype.unwatch = function (listener) {
  this.switcher.unwatch(listener);
};

Scope.prototype.set = function (values, callback) {
  if (typeof values == 'string' && typeof callback != 'function') {
    var newValues = {};
    newValues[arguments[0]] = arguments[1];
    values = newValues;
    callback = arguments[2];
  }
  
  var scopedValues = {};
  for (var path in values) {
    scopedValues[this.prefix+'/'+path] = values[path];
  }
  
  return this.switcher.set(scopedValues, callback);
};

Scope.prototype.action = function (path, callback) {
  return this.switcher.action(this.prefix+'/'+path, callback);
};

Scope.prototype.source = function (path, source, callback) {
  return this.switcher.source(this.prefix+'/'+path, source, callback);
};
