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
    if (this.parent.children === this)
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