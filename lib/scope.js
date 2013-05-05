var Scope = exports.Scope = function (parent, prefix) {
  this.parent = parent;
  
  prefix = '' + prefix;
  this.prefix = function (path) {
    return path ? prefix+'/'+path : prefix;
  };
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
  
  return this.parent.query(this.prefix(path), recursive || true, callback);
};

Scope.prototype.watch = function (path, callback) {
  if (typeof path == 'function') {
    callback = path;
    path = undefined;
  }
  
  return this.parent.watch(this.prefix(path), callback);
};

Scope.prototype.unwatch = function (listener) {
  return this.parent.unwatch(listener);
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
    scopedValues[this.prefix(path)] = values[path];
  }
  
  return this.parent.set(scopedValues, callback);
};

Scope.prototype.action = function (path, callback) {
  return this.parent.action(this.prefix(path), callback);
};

Scope.prototype.source = function (path, source, callback) {
  return this.parent.source(this.prefix(path), source, callback);
};
