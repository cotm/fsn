var Source = exports.Source = function (values) {
  this.values = values;
};

Source.prototype.applyTo = function (node) {
  for (var path in this.values) {
    node.child(path).value = this.values[path];
  }
};

exports.xpt = function (xpt) {
  var xpts = {
    'slot1': [19, 47, 27, 49, 43, 63, 59, 67],
    'slot2': [21, 23, 25, 31, 3, 33, 11, 39],
    'slot3': [56, 66, 60, 68, 9, 1, 13, 15],
    'slot4': [34, 48, 40, 42, 54, 44, 62, 52],
    'slot5': [36, 18, 26, 46],
    'slot6': [10, 32, 38, 28],
    'slot7': [16, 8, 22, 12],
    'slot9': [4, 0, 14, 6],
    'slot10': [20, 2, 30, 24],
    'slot11': [50, 58, 64, 70],
    'slot14': [35, 55, 51, 65],
    'fme0': {'bgmix': 61, 'key1': 69, 'pgm': 53, 'pst': 57},
    'fme1': {'bgmix': 41, 'key1': 45, 'pgm': 29, 'pst': 37},
    'hme': {'mix': 17, 'pgm': 5, 'pst': 7}
  };
  
  if (typeof xpt != 'number') {
    xpt = xpts[xpt];
    for (var i = 1; i < arguments.length; i++) {
      xpt = xpt[arguments[i]];
    }
  }
  
  return new Source({SrcType: 0, XPTInput: xpt});
};
