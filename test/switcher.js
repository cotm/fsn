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
    it('returns an instance of Scope', function () {
      switcher.scope('MECard:0').should.be.an.instanceOf(Scope);
    });
  });
  
  describe('Switcher#send', function () {
    it('returns response as a Node', function (done) {
      switcher.send(new Node('Frame:0'), function (response) {
        response.should.be.an.instanceOf(Node);
        response.id.should.eql('Frame:0');
        done();
      });
    });
    
    it('emits `message`', function (done) {
      switcher.once('message', function (message) {
        message.should.be.an.instanceOf(Node);
        message.id.should.eql('Frame:0');
        done();
      });
      
      switcher.send(new Node('Frame:0'));
    });
  });
  
  describe('Switcher#query', function () {
    it('no args queries everything', function (done) {
      switcher.query(function (response) {
        response.toString().should.match(/<SWVrsn>/);
        response.toString().should.match(/<MACAddress>/);
        done();
      });
    });
    
    it('`{recursive: false}` only returns leaf nodes', function (done) {
      switcher.query({recursive: false}, function (response) {
        response.toString().should.match(/<SWVrsn>/);
        response.toString().should.not.match(/<MACAddress>/);
        done();
      });
    });
    
    it('`{path: <path>}` limits search to path', function (done) {
      switcher.query({path: 'SystemCard:0'}, function (response) {
        response.toString().should.match(/<MACAddress>/);
        done();
      });
    });
    
    it('`{path: <path>, recursive: false}`', function (done) {
      switcher.query({path: 'SystemCard:0', recursive: false}, function (response) {
        response.toString().should.match(/<PowerState>/);
        response.toString().should.not.match(/<MACAddress>/);
        done();
      });
    });
    
    it('string acts like `{path: <string>}`', function (done) {
      switcher.query('SystemCard:0/Enet:0', function (response) {
        response.toString().should.match(/<MACAddress>/);
        done();
      });
    });
  });
  
  describe('Switcher#set', function () {
    it('responds for Object', function (done) {
      switcher.set({'A/B': 1, 'A/C': 2}, function (response) {
        response.should.be.ok;
        done();
      });
    });
    
    it('responds for path and value', function (done) {
      switcher.set('A/B', 1, function (response) {
        response.should.be.ok;
        done();
      });
    });
  });
  
  describe('Switcher#action', function () {
    it('responds', function (done) {
      switcher.action('Test', function (response) {
        response.should.be.ok;
        done();
      });
    });
  });
  
  describe('Switcher#source', function () {
    it('responds', function (done) {
      switcher.source('Test', source.xpt(1), function (response) {
        response.should.be.ok;
        done();
      });
    });
  });
});
