const fs = require('fs');
const EventEmitter = require('events');

const SerialPort = require('serialport');
const ESP3Parser = require('esp3-parser');
const EEPPacket = require('eep-packet');

const Telegram = require('./telegram');

class ESP3 extends EventEmitter {
    constructor(options) {
        super();

        if (options === undefined) {
            options = {};
        }

        this.config = {};
        this.config.port = options.port ? options.port : '/dev/ttyAMA0';
        this.config.baudrate = options.baudrate ? options.baudrate : 57600;
        this.config.baseId = options.baseId ? options.baseId : '00000000';
        this.config.knownDevicesFile = options.knownDevicesFile ? __dirname + '/' + options.knownDevicesFile : __dirname + '/eep/known-devices.json';

        this.parser = new ESP3Parser();
        this.serialport = new SerialPort(this.config.port, { baudRate: this.config.baudrate, autoOpen: false });
        this.serialport.pipe(this.parser);

    }

    startLearnMode() {

    }

    stopLearnMode() {

    }

    open() {
        this.serialport.open(function (err) {
            if (err) {
                this.emit('esp-error', err);
            }
        }.bind(this));

        this.parser.on('data', function(buffer) {
            const eepPacket = new EEPPacket(buffer);

            this.emit('esp-data', eepPacket);
        }.bind(this));
    }
}

module.exports = ESP3;
