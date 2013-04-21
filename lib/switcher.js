var net = require('net'),
    EventEmitter = require('events').EventEmitter,
    inherits = require('util').inherits;

var Scope = require('./scope').Scope,
    Node = require('./node').Node,
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
      if (message.name == 'Frame') {
        var callback = self.callbacks.pop();
        callback(message);
        self.emit('message', message);
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
};

inherits(Switcher, EventEmitter);

Switcher.prototype.end = function () {
  this.xmlSocket.end();
  this.asyncSocket.end();
};

Switcher.prototype.scope = function (prefix) {
  return new Scope(this, prefix);
};

Switcher.prototype.send = function (message, callback) {
  if (typeof callback != 'function') callback = function () {};
  this.callbacks.push(callback);
  this.xmlSocket.write(message.toString());
};

Switcher.prototype.query = function (options, callback) {
  if (typeof options == 'function') {
    callback = options;
    options = {};
  } else if (typeof options == 'string') {
    options = {path: options};
  } else if (options == null) {
    options = {};
  }
  
  if (!('recursive' in options)) options.recursive = true;
  
  var message = new Node('Frame:0');
  message.child('CmdType').value = '3';
  
  var node = options.path ? message.child(options.path) : message;
  node.child('Query').value = '1';
  node.child('Recursive').value = options.recursive ? '1' : '0';
  
  this.send(message, callback);
};

Switcher.prototype.set = function (values, callback) {
  if (typeof values == 'string' && typeof callback != 'function') {
    var newValues = {};
    newValues[arguments[0]] = arguments[1];
    values = newValues;
    callback = arguments[2];
  }
  
  var message = new Node('Frame:0');
  for (var path in values)
    message.child(path).value = values[path];
  this.send(message, callback);
};

Switcher.prototype.action = function (path, callback) {
  var message = new Node('Frame:0');
  message.child('CmdType').value = '1';
  message.child(path).isAction = true;
  this.send(message, callback);
};

Switcher.prototype.source = function (path, source, callback) {
  var message = new Node('Frame:0');
  source.applyTo(message.child(path));
  this.send(message, callback);
};
