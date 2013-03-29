# fsn

[http://www.barco.com/en/Products-Solutions/Image-processing/Presentation-switchers/Fully-configurable-3G-ready-multi-format-switcher.aspx](http://www.barco.com/en/Products-Solutions/Image-processing/Presentation-switchers/Fully-configurable-3G-ready-multi-format-switcher.aspx)

## Install

    npm install fsn

## Example

```
var fsn = require('fsn');
var switcher = fsn.connect();

var command = new fsn.Node('Frame:0');
command.child('CmdType').value = '1';
command.child('MECard:0/HME:0/DSK:0/Key:0/Cut').isAction = true;

switcher.send(command, function (response) {
  console.log(response.toString());
});
```

## API

### var switcher = fsn.connect(host, port, asyncPort)

  Connect to the switcher. The standard FSN host (192.168.0.4) and ports (9876 and 9877) will be used if `host`, `port`, and `asyncPort` are not specified.

### switcher.send(message, callback)

  Send `message` (an fsn.Node) to the switcher and return the response (also as a Node) as the first argument to the `callback` function.
