var Switcher = require('./lib/switcher').Switcher,
    Node = require('./lib/node').Node,
    Parser = require('./lib/parser').Parser;

exports.Switcher = Switcher;
exports.Node = Node;
exports.Parser = Parser;

exports.connect = function (options) {
  return new Switcher(options);
};
