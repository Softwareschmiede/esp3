const EventEmitter = require('events');
const SerialPort = require('serialport');
const ESP3Parser = require('esp3-parser');

class ESP3 extends EventEmitter {
    constructor(options) {
        if (options === undefined) {
            options = {};
        }

        const config = {};
        config.port = options.port ? options.port : '/dev/ttyAMA0';
        config.baudrate = options.baudrate ? options.baudrate : 57600;
        config.baseId = options.baseId ? options.baseId : '00000000';
        config.sensorFile = options.sensorFile ? options.sensorFile : __dirname + '/eep/knownDevices.json';

        console.log(config);

        const eventEmitter = new EventEmitter();
        eventEmitter.addListener('data', function(data) { return data; });

        const parser = new ESP3Parser();
        const serialport = new SerialPort(config.port, { baudRate: config.baudrate });
        serialport.pipe(parser);

        parser.on('data', function(data) {
            eventEmitter.emit('data', data);
        });

    }
}

module.exports = ESP3;
