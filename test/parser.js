var should = require('should');

var Parser = require('../lib/parser').Parser,
    Node = require('../lib/node').Node;

describe('Parser', function () {
  var parser = new Parser();
  
  it('should emit event: open', function (done) {
    parser.once('open', function (name, num) {
      name.should.eql('A');
      num.should.eql(1);
      done();
    });
    parser.write('<A Num="1"></A>');
  });
  
  it('should emit event: close', function (done) {
    parser.once('close', function (name) {
      name.should.eql('B');
      done();
    });
    parser.write('<B></B>');
  });
  
  it('should emit event: action', function (done) {
    parser.once('action', function (name) {
      name.should.eql('C');
      done();
    });
    parser.write('<C/>');
  });
  
  it('should emit event: text', function (done) {
    parser.once('text', function (text) {
      text.should.eql('test');
      done();
    });
    parser.write('<D>test</D>');
  });
  
  it('should emit event: message', function (done) {
    parser.once('message', function (message) {
      message.should.be.instanceOf(Node);
      should.exist(message.child('B:0', false));
      should.exist(message.child('B:0/C:0', false));
      done();
    });
    parser.write('<A Num="0"><B Num="0"><C Num="0"></C></B></A>');
  });
});
