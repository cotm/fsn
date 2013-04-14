var Switcher = exports.Switcher = require('./lib/switcher').Switcher;
exports.Node = require('./lib/node').Node;
exports.Parser = require('./lib/parser').Parser;
exports.source = require('./lib/source');

exports.connect = function (options) {
  return new Switcher(options);
};
