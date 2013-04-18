var should = require('should');

var Switcher = require('../lib/switcher').Switcher,
    Scope = require('../lib/scope').Scope,
    Node = require('../lib/node').Node,
    source = require('../lib/source');

var switcher = new Switcher({
  host: 'localhost',
  xmlPort: 3000,
  asyncPort: 3001
});

xdescribe('fsn.Switcher', function () {
  describe('Switcher#scope', function () {
    it('returns an fsn.Scope', function () {
      switcher.scope('MECard:0').should.be.an.instanceOf(Scope);
    });
  });
  
  describe('Switcher#send', function () {
    testNormalResponses(function (callback) {
      switcher.send(new Node('Frame:0'), callback);
    });
  });
  
  describe('Switcher#query', function () {
    testNormalResponses(function (callback) {
      switcher.query(callback);
    });
  });
  
  describe('Switcher#set', function () {
    testNormalResponses(function (callback) {
      switcher.set({'Test': 1, 'Test/Test': 2}, callback);
    });
  });
  
  describe('Switcher#action', function () {
    testNormalResponses(function (callback) {
      switcher.action('Test', callback);
    });
  });
  
  describe('Switcher#source', function () {
    testNormalResponses(function (callback) {
      switcher.source('Test', source.xpt(1), callback)
    });
  });
  
  function testNormalResponses (test) {
    it('returns a response', function (done) {
      test(function (response) {
        response.should.be.an.instanceOf(Node);
        done();
      });
    });
    
    it('emits a `message` event', function (done) {
      switcher.once('message', function (response) {
        response.should.be.an.instanceOf(Node);
        done();
      });
      
      test(function () {});
    });
  }
});
