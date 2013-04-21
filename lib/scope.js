var Scope = exports.Scope = function (switcher, prefix) {
  this.switcher = switcher;
  this.prefix = prefix + '/';
};

Scope.prototype.scope = function (prefix) {
  return new Scope(this, prefix);
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
    scopedValues[this.prefix + path] = values[path];
  }
  
  return this.switcher.set(scopedValues, callback);
};

Scope.prototype.action = function (path, callback) {
  return this.switcher.action(this.prefix + path, callback);
};

Scope.prototype.source = function (path, source, callback) {
  return this.switcher.source(this.prefix + path, source, callback);
};
