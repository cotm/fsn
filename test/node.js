var should = require('should');

var Node = require('../lib/Node').Node;

describe('Node', function () {
  describe('#child(path)', function () {
    it('should create new nodes', function () {
      var node = new Node('A');
      node.child('B:0/C:1');
      node.toString().replace(/\n/g, '').should.match(/A><B Num="0"><C Num="1">/);
    });
    
    it('should return existing nodes', function () {
      var node = new Node('A');
      var b = node.child('B');
      node.child('B').should.equal(b);
    });
  });
  
  describe('#child(path, false)', function () {
    it('should return existing nodes', function () {
      var node = new Node('A');
      var b = node.child('B');
      node.child('B', false).should.equal(b);
    });
    
    it('should otherwise return undefined', function () {
      var node = new Node('A');
      should.not.exist(node.child('B', false));
    });
  });
  
  describe('#remove()', function () {
    it('should remove from parent node', function () {
      var parent = new Node('A');
      var before = parent.toString();
      var child = parent.child('B');
      child.remove();
      parent.toString().should.eql(before);
    });
  });
});
