var net = require('net'),
    EventEmitter = require('events').EventEmitter,
    inherits = require('util').inherits;

var Node = require('./node').Node,
    Parser = require('./parser').Parser;

var Switcher = exports.Switcher = function (options) {
  EventEmitter.call(this);
  
  this.callbacks = [];
  
  var self = this;
  
  var xmlSocket = this.xmlSocket = net.connect({
    host: options.xmlHost || options.host || '192.168.0.4',
    port: options.xmlPort || 9876
  },
  function () {
    var parser = new Parser();
    
    xmlSocket.on('data', function (data) {
      parser.write(data);
    });
    
    parser.on('message', function (message) {
      self.emit('message', message);
      
      if (message.name == 'Frame') {
        var callback = self.callbacks.pop();
        callback(message);
      }
    });
  });
  
  var asyncSocket = this.asyncSocket = net.connect({
    host: options.asyncHost || options.host || '192.168.0.4',
    port: options.asyncPort || 9877
  },
  function () {
    var parser = new Parser();
    
    asyncSocket.on('data', function (data) {
      parser.write(data);
    });
    
    parser.on('message', function (message) {
      self.emit('message', message);
    });
  });
}

inherits(Switcher, EventEmitter);

Switcher.prototype.end = function () {
  this.xmlSocket.end();
  this.asyncSocket.end();
};

Switcher.prototype.send = function (message, callback) {
  if (typeof callback != 'function')
    callback = function () {};
  this.callbacks.push(callback);
  this.xmlSocket.write(message.toString());
};

Switcher.prototype.query = function (callback) {
  var message = new Node('Frame:0');
  message.child('CmdType').value = '3';
  message.child('Query').value = '3';
  message.child('Recursive').value = '1';
  this.send(message, callback);
};

Switcher.prototype.set = function (values, callback) {
  var message = new Node();
  for (var key in values)
    message.child(key).value = values[key];
  this.send(message, callback);
};

Switcher.prototype.action = function (key, callback) {
  var message = new Node();
  message.child('Frame:0/CmdType').value = '1';
  message.child(key).isAction = true;
  this.send(message, callback);
};

Switcher.prototype.source = function (path, source, callback) {
  var message = new Node('Frame:0');
  source.applyTo(message.child(path));
  this.send(message, callback);
};
