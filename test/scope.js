var should = require('should'),
    sinon = require('sinon');

var Scope = require('../lib/scope').Scope;

var switcher = {
  scope: function (prefix) {
    return new Scope(switcher, prefix);
  },
  
  set: function () {},
  action: function () {},
  source: function () {}
};

describe('fsn.Scope', function () {
  var scope = switcher.scope('Test');
  
  describe('Scope#set', function () {
    it('add prefix to each path', function () {
      var mock = sinon.mock(switcher);
      mock.expects('set').withArgs({'Test/A': 1, 'Test/B': 2});
      scope.set({A: 1, B: 2});
      mock.verify();
    });
  });
  
  describe('Scope#action', function () {
    it('add prefix to path', function () {
      var mock = sinon.mock(switcher);
      mock.expects('action').withArgs('Test/Cut');
      scope.action('Cut');
      mock.verify();
    });
  });
  
  describe('Scope#source', function () {
    it('add prefix to path', function () {
      var mock = sinon.mock(switcher);
      mock.expects('source').withArgs('Test/Src:0');
      scope.source('Src:0', null);
      mock.verify();
    });
  });
  
  describe('Scope#scope', function () {
    var scopeB = scope.scope('B'),
        scopeC = scopeB.scope('C');
    
    it('nest one level deep', function () {
      scopeB.switcher.should.equal(scope);
      
      var mock = sinon.mock(switcher);
      mock.expects('set').withArgs({'Test/B/X': 1});
      scopeB.set({X: 1});
      mock.verify();
    });
    
    it('nest two levels deep', function () {
      scopeC.switcher.should.equal(scopeB);
      
      var mock = sinon.mock(switcher);
      mock.expects('set').withArgs({'Test/B/C/X': 1});
      scopeC.set({X: 1});
      mock.verify();
    });
  });
});
