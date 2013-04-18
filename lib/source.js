var Source = exports.Source = function (values) {
  this.values = values;
};

Source.prototype.applyTo = function (node) {
  for (var path in this.values) {
    node.child(path).value = this.values[path];
  }
};

exports.xpt = function (xpt) {
  return new Source({SrcType: 0, XPTInput: xpt});
};
