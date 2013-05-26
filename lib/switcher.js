var net = require('net'),
    EventEmitter = require('events').EventEmitter,
    inherits = require('util').inherits;

var Scope = require('./scope').Scope,
    Node = require('./node').Node,
    Parser = require('./parser').Parser;

var Switcher = exports.Switcher = function (options) {
  EventEmitter.call(this);
  
  this.state = new Node('Frame:0');
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
        self.state.updateValues(message);
        self.callbacks.pop()(message);
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
      self.state.updateValues(message);
      self.emit('message', message);
    });
  });
  
  this.query(true);
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

Switcher.prototype.query = function () {
  var args = Array.prototype.slice.call(arguments, 0);
  
  if (typeof args[args.length - 1] == 'function')
    var callback = args.splice(-1)[0];
  
  var path = args[0], recursive = args[1];
  
  if (typeof path == 'boolean') {
    recursive = path;
    path = undefined;
  }
  
  var message = new Node('Frame:0');
  message.child('CmdType').value = '3';
  
  var node = path ? message.child(path) : message;
  node.child('Query').value = '3';
  node.child('Recursive').value = recursive ? '1' : '0';
  
  this.send(message, callback);
};

Switcher.prototype.watch = function (path, callback) {
  if (typeof path == 'function') {
    callback = path;
    path = undefined;
  }
  
  var listener = function (message) {
    if (!path) return callback(message);
    
    var child = message.child(path, false);
    if (child) {
      if (typeof child.value != 'undefined')
        callback(child.value);
      else
        callback(child);
    }
  };
  
  this.on('message', listener);
  
  return listener;
};

Switcher.prototype.unwatch = function (listener) {
  this.removeListener('message', listener);
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
