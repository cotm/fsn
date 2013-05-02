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
    describe('Arguments', function () {
      it('()', function () {
        switcher.query();
        switcher.query(function () {});
      });
      
      it('(path)', function () {
        switcher.query('SystemCard:0');
        switcher.query('SystemCard:0', function () {});
      });
      
      it('(path, recursive)', function () {
        switcher.query('SystemCard:0', true);
        switcher.query('SystemCard:0', true, function () {});
      });
      
      it('(recursive)', function () {
        switcher.query(true);
        switcher.query(true, function () {});
      });
    });
  });
  
  describe('Switcher#set', function () {
    describe('Arguments', function () {
      it('(Object)', function () {
        switcher.set({'A/B': 1, 'A/C': 2});
        switcher.set({'A/B': 1, 'A/C': 2}, function () {});
      });
      
      it('(path, value)', function () {
        switcher.set('A/B', 1);
        switcher.set('A/B', 1, function () {});
      });
    });
  });
  
  describe('Switcher#action', function () {
    describe('Arguments', function () {
      it('(path)', function () {
        switcher.action('Test');
        switcher.action('Test', function () {});
      });
    });
  });
  
  describe('Switcher#source', function () {
    describe('Arguments', function () {
      it('(path, source)', function () {
        switcher.source('Test', source.xpt(1));
        switcher.source('Test', source.xpt(1), function () {});
      });
    });
  });
});
