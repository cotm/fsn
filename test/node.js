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
  
  describe('#each()', function () {
    it('should return each child node', function () {
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
    
    it('should return each child path sans parent id', function () {
      var node = new Node('A');
      node.child('B/C/D');
      
      var i = 0, paths = ['B', 'B/C', 'B/C/D'];
      node.each(function (path, child) {
        path.should.eql(paths[i++]);
      });
    });
  });
  
  describe('#updateValues()', function () {
    it('should replace each node value', function () {
      var dest = new Node('A');
      dest.child('B').value = 'old';
      dest.child('C/D').value = 'old';
      
      var source = new Node('X');
      source.child('B').value = 'new';
      source.child('C/D').value = 'new';
      source.child('E').value = 'new';
      
      dest.updateValues(source);
      
      dest.child('B').value.should.eql('new');
      dest.child('C/D').value.should.eql('new');
      should.exist(dest.child('E', false));
      dest.child('E').value.should.eql('new');
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
