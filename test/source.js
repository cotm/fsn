var should = require('should');

var source = require('../lib/source');

describe('fsn.source', function () {
  describe('source.xpt()', function () {
    it('pass through xpt number', function () {
      source.xpt(1000).values.XPTInput.should.eql(1000);
    });
    
    it('map xpt by name', function () {
      source.xpt('hme', 'pgm').values.XPTInput.should.eql(5);
      source.xpt('slot1', 0).values.XPTInput.should.eql(19);
    });
  });
});
