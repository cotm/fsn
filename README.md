# fsn

[http://www.barco.com/en/Products-Solutions/Image-processing/Presentation-switchers/Fully-configurable-3G-ready-multi-format-switcher.aspx](http://www.barco.com/en/Products-Solutions/Image-processing/Presentation-switchers/Fully-configurable-3G-ready-multi-format-switcher.aspx)

## Install

    npm install fsn

## Example

```
var fsn = require('fsn');
var switcher = fsn.connect();

var dsk = switcher.scope('Frame:0/MECard:0/HME:0/DSK:0/Key:0');

dsk.set('TransTime', 30);

dsk.action('AutoTrans', function (response) {
  console.log(response.toString());
});
```

## API

### var switcher = fsn.connect(options)

Create a connection to the switcher. The defaults should just work:

* `options.host = '192.168.0.4'` — default host for sockets
* `options.xmlHost = options.host` — XML socket host
* `options.xmlPort = 9876` — XML socket port
* `options.asyncHost = options.host` — async socket host
* `options.asyncPort = 9877` — async socket port

### switcher.send(message, callback)

  Send `message` (an fsn.Node) to the switcher and return the response (also as a Node) as the first argument to the `callback` function.

### switcher.query(callback)

  Query everything and send it to `callback`.

### switcher.set(values, callback)

  Set switcher values with the keys from the Object `values`.

### switcher.set(path, value, callback)

  Same as above only with a single (path, value) pair.

### switcher.action(path, callback)

  Send `path` as an action. Automatically sets the `CmdType` to `1`.

### switcher.source(path, source, callback)

  Set source settings for `path` using `source`. See below:

### fsn.source.xpt(xpt)

```js
fsn.source.xpt(19)            // => NIC 1 connector 1
fsn.source.xpt('slot1', 0)    // => NIC 1 connector 1
fsn.source.xpt('hme', 'pgm')  // => program return
fsn.source.xpt('fme1', 'pvw') // => M/E2 preview return
```
