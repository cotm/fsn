var should = require('should');

var source = require('../lib/source'),
    Node = require('../lib/node').Node;

describe('fsn.source', function () {
  describe('Source', function () {
    it('adds values to node', function () {
      var node = new Node('Frame:0');
      (new source.Source({Test: '1'})).applyTo(node);
      node.children.length.should.eql(1);
      should.exist(node.children[0].value);
      node.children[0].id.should.eql('Test');
      node.child('Test').value.should.eql('1');
    });
  });
  
  describe('source.xpt()', function () {
    it('pass through xpt number', function () {
      source.xpt(1000).values.XPTInput.should.eql(1000);
    });
    
    it('map xpt by name', function () {
      source.xpt('hme', 'pgm').values.XPTInput.should.eql(5);
      source.xpt('slot1', 0).values.XPTInput.should.eql(19);
    });
  });
});
