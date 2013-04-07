var net          = require('net'),
    EventEmitter = require('events').EventEmitter,
    inherits     = require('util').inherits;

exports.connect = function (options) {
  return new Switcher(options);
};

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
      }
    });
  });
  
  var asyncSocket = this.asyncSocket = net.connect({
    host: options.asyncHost || options.host || '192.168.0.4',
    port: options.asyncPort || 9877
  },
  function () {
  });
}

inherits(Switcher, EventEmitter);

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

var Node = exports.Node = function (id, parent) {
  this.id = id;
  
  if (typeof id == 'string' && id.match(/:/)) {
    this.name = id.split(':')[0];
    this.num  = parseInt(id.split(':')[1]);
  } else {
    this.name = id;
  }
  
  this.parent = parent;
  this.children = [];
}

Node.prototype.child = function (path) {
  var match;
  if (match = path.match(/\//)) {
    var child = this.child(path.slice(0, match.index));
    path = path.slice(match.index + 1);
    return child.child(path);
  }
  
  else {
    for (var i in this.children) {
      if (this.children[i].id == path)
        return this.children[i];
    }
    
    var child = new Node(path, this);
    this.children.push(child);
    return child;
  }
};

Node.prototype.remove = function () {
  for (var i in this.parent.children) {
    if (this.parent.children[i].id == this.id)
      delete this.parent.children[i];
  }
};

Node.prototype.toString = function () {
  var open = this.name;
  if (typeof this.num != 'undefined')
    open += ' Num="' + this.num + '"';
  
  if (this.isAction === true) {
    return '<'+open+'/>\n';
  }
  
  var body;
  if (typeof this.value != 'undefined') {
    body = this.value.toString();
  } else {
    body = '\n';
    for (var i in this.children)
      body += this.children[i].toString();
  }
  
  return '<'+open+'>'+body+'</'+this.name+'>\n';
};

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
  this.buffer = this.textBuffer + data.toString();
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
