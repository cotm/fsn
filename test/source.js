var should = require('should');

var source = require('../lib/source'),
    Source = source.Source,
    Node = require('../lib/node').Node;

describe('Source', function () {
  describe('#applyTo()', function () {
    it('should add values to node', function () {
      var source = new Source({Test: '1'});
      var node = new Node('A');
      source.applyTo(node);
      node.toString().replace(/\n/g, '').should.eql('<A><Test>1</Test></A>');
    });
  });
});

describe('fsn.source', function () {
  describe('.xpt()', function () {
    it('should pass through xpt number', function () {
      source.xpt(1000).values.XPTInput.should.eql(1000);
    });
    
    it('should map xpt by name', function () {
      source.xpt('hme', 'pgm').values.XPTInput.should.eql(5);
      source.xpt('slot1', 0).values.XPTInput.should.eql(19);
    });
  });
});
