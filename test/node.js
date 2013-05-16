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
  
  describe('#each()', function () {
    it('should iterate over every child node', function () {
      var node = new Node('A');
      node.child('B:0/C:0/D:0');
      node.child('E:0/F:0/G:0');
      
      var seen = [];
      node.each(function (path, child) {
        seen.push(child.name);
      });
      seen.length.should.eql(6);
      seen.join('').should.eql('BCDEFG');
    });
  });
  
  describe('#updateValues()', function () {
    it('should change each node value', function () {
      var dest = new Node('A');
      dest.child('B').value = '1';
      dest.child('C/D').value = '2';
      
      var source = new Node('X');
      source.child('B').value = '2';
      source.child('C/D').value = '3';
      source.child('E').value = '4';
      
      dest.updateValues(source);
      
      dest.child('B').value.should.eql('2');
      dest.child('C/D').value.should.eql('3');
      should.exist(dest.child('E', false));
      dest.child('E').value.should.eql('4');
    });
  });
});
