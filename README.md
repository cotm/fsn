# fsn

[http://www.barco.com/en/Products-Solutions/Image-processing/Presentation-switchers/Fully-configurable-3G-ready-multi-format-switcher.aspx](http://www.barco.com/en/Products-Solutions/Image-processing/Presentation-switchers/Fully-configurable-3G-ready-multi-format-switcher.aspx)

## Install

    npm install fsn

## API

### var switcher = fsn.connect(host, port, asyncPort)

  Connect to the switcher. The standard FSN host (192.168.0.4) and ports (9876 and 9877) will be used if `host`, `port`, and `asyncPort` are not specified.
