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

describe('fsn.Switcher', function () {
  describe('Switcher#scope', function () {
    it('returns an fsn.Scope', function () {
      switcher.scope('MECard:0').should.be.an.instanceOf(Scope);
    });
  });
  
  describe('Switcher#send', function () {
    it('return response', function (done) {
      switcher.send(new Node('Frame:0'), checkMessage(done));
    });
    
    it('emit `message`', function (done) {
      switcher.send(new Node('Frame:0'));
      switcher.once('message', checkMessage(done));
    });
  });
  
  describe('Switcher#query', function () {
    it('return response', function (done) {
      switcher.query(checkMessage(done));
    });
    
    it('emit `message`', function (done) {
      switcher.query();
      switcher.once('message', checkMessage(done));
    });
  });
  
  describe('Switcher#set', function () {
    it('return response (Object)', function (done) {
      switcher.set({'Test': 1, 'Test/Test': 2}, checkMessage(done));
    });
    
    it('emit `message` (Object)', function (done) {
      switcher.set({'Test': 1, 'Test/Test': 2});
      switcher.once('message', checkMessage(done));
    });
    
    it('return response (path, value)', function (done) {
      switcher.set('Test', 1, checkMessage(done));
    });
    
    it('emit `message` (path, value)', function (done) {
      switcher.set('Test', 1);
      switcher.once('message', checkMessage(done));
    });
  });
  
  describe('Switcher#action', function () {
    it('return response', function (done) {
      switcher.action('Test', checkMessage(done));
    });
    
    it('emit `message`', function (done) {
      switcher.action('Test');
      switcher.once('message', checkMessage(done));
    });
  });
  
  describe('Switcher#source', function () {
    it('return response', function (done) {
      switcher.source('Test', source.xpt(1), checkMessage(done));
    });
    
    it('emit `message`', function (done) {
      switcher.source('Test', source.xpt(1));
      switcher.once('message', checkMessage(done));
    });
  });
  
  function checkMessage (callback) {
    return function (message) {
      message.should.be.instanceOf(Node);
      callback();
    }
  }
});
