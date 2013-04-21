var should = require('should');

var Node = require('../lib/Node').Node;

describe('fsn.Node', function () {
  describe('Properties', function () {
    var node = new Node('A:1');
    
    it('id', function () {
      node.id.should.eql('A:1');
      node.toString().should.match(/A Num="1"/);
    });
    
    it('name', function () {
      node.name.should.eql('A');
    });
    
    it('num', function () {
      node.num.should.be.a('number');
      node.num.should.eql(1);
    });
  });
  
  describe('Node#child', function () {
    var node = new Node('A');
    
    it('create a child node', function () {
      node.child('B:0');
      node.toString().replace(/\n/g, '').should.eql('<A><B Num="0"></B></A>');
    });
    
    it('recursively create child nodes', function () {
      node.child('C/D:1');
      node.toString().replace(/\n/g, '').should.match(/\/B><C/);
      node.toString().replace(/\n/g, '').should.match(/<C><D Num="1">/);
    });
    
    it('return existing node', function () {
      var before = node.toString();
      node.child('B:0');
      var c = node.child('C');
      c.child('D:1');
      node.toString().should.eql(before);
    });
  });
  
  describe('Node#remove', function () {
    var node = new Node('A');
    node.child('B/C/D');
    
    it('remove leaf node', function () {
      node.child('B/C/D').remove();
      node.toString().replace(/\n/g, '').should.match(/<C><\/C>/);
    });
    
    it('remove subtree', function () {
      node.child('B').remove();
      node.toString().replace(/\n/g, '').should.eql('<A></A>');
    });
  });
});
