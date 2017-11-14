# ESP3
This module sends and receives EnOcean Serial Protocols in version 3 (ESP3).

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
    baudrate: 57600,
    baseId: '00000000',
    sensorFile: './eep/knownDevices.json',
    knownDevices: {}
}
```

## Work in progess
At this moment there is no fuctionality.
The first functionality will be comming soon.

## Changes
### 0.0.5
Known devices module updated.
Dependencies updated.

### 0.0.4
New eep added (d5-00-01).
Some little bugfixes.

### 0.0.3
Bugfix in config

### 0.0.2
First eep added (F6-02-03)
