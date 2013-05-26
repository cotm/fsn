var Switcher = exports.Switcher = require('./lib/switcher').Switcher;
exports.Node = require('./lib/node').Node;
exports.Parser = require('./lib/parser').Parser;

exports.connect = function (options) {
  return new Switcher(options);
};
