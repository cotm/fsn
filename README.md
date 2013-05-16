# fsn

[http://www.barco.com/en/Products-Solutions/Image-processing/Presentation-switchers/Fully-configurable-3G-ready-multi-format-switcher.aspx](http://www.barco.com/en/Products-Solutions/Image-processing/Presentation-switchers/Fully-configurable-3G-ready-multi-format-switcher.aspx)

## Example

```js
var fsn = require('fsn'),
    switcher = fsn.connect();

var dsk = switcher.scope('MECard:0/HME:0/DSK:0/Key:0');

dsk.set('TransTime', 30);

dsk.action('AutoTrans', function (response) {
  console.log(response.toString());
});

dsk.watch('PGMMode', function (mode) {
  console.log('DSK visible: ' + mode);
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
