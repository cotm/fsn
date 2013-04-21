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
    it('return response', function (done) {
      switcher.send(new Node('Frame:0'), done);
    });
    
    it('emit `message`', function (done) {
      switcher.send(new Node('Frame:0'));
      switcher.once('message', done);
    });
  });
  
  describe('Switcher#query', function () {
    it('return response', function (done) {
      switcher.query(done);
    });
    
    it('emit `message`', function (done) {
      switcher.query();
      switcher.once('message', done);
    });
  });
  
  describe('Switcher#set', function () {
    it('return response (hashmap)', function (done) {
      switcher.set({'Test': 1, 'Test/Test': 2}, done);
    });
    
    it('emit `message` (hashmap)', function (done) {
      switcher.set({'Test': 1, 'Test/Test': 2});
      switcher.once('message', done);
    });
    
    it('return response (key, value)', function (done) {
      switcher.set('Test', 1, done);
    });
    
    it('emit `message` (key, value)', function (done) {
      switcher.set('Test', 1);
      switcher.once('message', done);
    });
  });
  
  describe('Switcher#action', function () {
    it('return response', function (done) {
      switcher.action('Test', done);
    });
    
    it('emit `message`', function (done) {
      switcher.action('Test');
      switcher.once('message', done);
    });
  });
  
  describe('Switcher#source', function () {
    it('return response', function (done) {
      switcher.source('Test', source.xpt(1), done);
    });
    
    it('emit `message`', function (done) {
      switcher.source('Test', source.xpt(1));
      switcher.once('message', done);
    });
  });
});
