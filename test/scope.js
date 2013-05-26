var should = require('should'),
    sinon = require('sinon');

var Scope = require('../lib/scope').Scope;

describe('Scope', function () {
  describe('#scope()', function () {
    it('should return another Scope', function () {
      var a = new Scope(null, 'A');
      var b = a.scope('B');
      b.should.be.instanceOf(Scope);
      b.parent.should.equal(a);
    });
  });
  
  it('should prefix #query()', function () {
    var switcher = {query: sinon.spy()};
    var scope = new Scope(switcher, 'A');
    scope.query();
    scope.query(function () {});
    scope.query(true);
    scope.query(true, function () {});
    should(switcher.query.alwaysCalledWith('A', true));
  });
  
  it('should prefix #query(path)', function () {
    var switcher = {query: sinon.spy()};
    var scope = new Scope(switcher, 'A');
    scope.query('B');
    scope.query('B', function () {});
    scope.query('B', true);
    scope.query('B', true, function () {});
    should(switcher.query.alwaysCalledWith('A/B', true));
  });
  
  it('should prefix #watch()', function () {
    var switcher = {watch: sinon.spy()};
    var scope = new Scope(switcher, 'A');
    scope.watch(function () {});
    should(switcher.watch.calledWith('A'));
  });
  
  it('should prefix #watch(path)', function () {
    var switcher = {watch: sinon.spy()};
    var scope = new Scope(switcher, 'A');
    scope.watch('B', function () {});
    should(switcher.watch.calledWith('A/B'));
  });
  
  it('should prefix #set(Object)', function () {
    var switcher = {set: sinon.spy()};
    var scope = new Scope(switcher, 'A');
    scope.set({B: 1, C: 2});
    scope.set({B: 1, C: 2}, function () {});
    should(switcher.set.alwaysCalledWith({'A/B': 1, 'A/C': 2}));
  });
  
  it('should prefix #set(path, value)', function () {
    var switcher = {set: sinon.spy()};
    var scope = new Scope(switcher, 'A');
    scope.set('B', 1);
    scope.set('B', 1, function () {});
    should(switcher.set.alwaysCalledWith({'A/B': 1}));
  });
  
  it('should prefix #action()', function () {
    var switcher = {action: sinon.spy()};
    var scope = new Scope(switcher, 'A');
    scope.action('B');
    scope.action('B', function () {});
    should(switcher.action.alwaysCalledWith('A/B'));
  });
});
