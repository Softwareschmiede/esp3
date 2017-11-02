const EventEmitter = require('events');
const SerialPort = require('serialport');
const ESP3Parser = require('esp3-parser');

class ESP3 extends EventEmitter {
    constructor(options) {
        super();

        if (options === undefined) {
            options = {};
        }

        const config = {};
        config.port = options.port ? options.port : '/dev/ttyAMA0';
        config.baudrate = options.baudrate ? options.baudrate : 57600;
        config.baseId = options.baseId ? options.baseId : '00000000';
        config.sensorFile = options.sensorFile ? options.sensorFile : __dirname + '/eep/knownDevices.json';


        this.parser = new ESP3Parser();
        this.serialport = new SerialPort(config.port, { baudRate: config.baudrate, autoOpen: false });
        this.serialport.pipe(this.parser);
    }

    open() {
        this.serialport.open(function (err) {
            if (err) {
                return console.log('Error opening port: ', err.message);
            }
        });

        this.parser.on('data', function(data) {
            this.emit('data', data);
        });
    }
}

module.exports = ESP3;
