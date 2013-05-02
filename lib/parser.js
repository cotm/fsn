var EventEmitter = require('events').EventEmitter,
    inherits = require('util').inherits;

var Node = require('./node').Node;

var Parser = exports.Parser = function () {
  EventEmitter.call(this);
  
  this.buffer = '';
  this.textBuffer = '';
  
  var self = this;
  
  var root = new Node();
  var current = root;
  
  this.on('open', function (name, num) {
    var id = name;
    if (typeof num != 'undefined')
      id += ':' + num;
    current = current.child(id);
  });
  
  this.on('close', function (name) {
    if (current.parent == root) {
      self.emit('message', current);
      root = new Node();
      current = root;
    } else {
      current = current.parent;
    }
  });
  
  this.on('action', function (name) {
    current.child(name).isAction = true;
  });
  
  this.on('text', function (text) {
    text = text.trim();
    if (text.length > 0)
      current.value = text;
  });
};

inherits(Parser, EventEmitter);

Parser.prototype.write = function (data) {
  this.buffer = this.textBuffer + data;
  this.textBuffer = '';
  
  while (this.buffer.length > 0) {
    var events = [];
    
    var match = null;
    
    if (match = this.buffer.match(/^<(\w+)(?:>| Num="(\d+)">)/)) {
      if (typeof match[2] == 'undefined') {
        events.push(['open', match[1]]);
      } else {
        events.push(['open', match[1], parseInt(match[2])]);
      }
    }
    
    else if (match = this.buffer.match(/^<\/(\w+)>/)) {
      events.push(['close', match[1]]);
    }
    
    else if (match = this.buffer.match(/^<(\w+)\/>/)) {
      events.push(['action', match[1]]);
    }
    
    if (match !== null) {
      if (this.textBuffer.length > 0) {
        this.emit('text', this.textBuffer);
        this.textBuffer = '';
      }
      
      for (var i in events) {
        this.emit.apply(this, events[i]);
      }
      
      this.buffer = this.buffer.slice(match[0].length);
    } else {
      this.textBuffer += this.buffer.slice(0, 1);
      this.buffer = this.buffer.slice(1);
    }
  }
};
