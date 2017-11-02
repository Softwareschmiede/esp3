# ESP3
This module sends and receives EnOcean Serial Protocols in version 3 (ESP3).

## Requirements
Serialport >= 5.0.0

## Usage
```javascript
const ESP3 = require('esp3');
...
const esp = new ESP3(options);
```

## Options
The default config looks like this:

```javascript
{
    port: '/dev/ttyAMA0',
    baudrate : 57600,
    baseId : '00000000',
    sensorFile : './eep/knownDevices.json'
}
```

## Work in progess
At this moment there is no fuctionality.
The first functionality will be comming soon.
