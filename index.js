/*
 *  Imports
 */
const EventEmitter = require('events');

const SerialPort = require('serialport');
const ESP3Parser = require('esp3-parser');
const ESPPacket = require('esp3-packet');
const EEPPacket = require('eep-packet');

/*
 *  Private declarations
 */
const _config = {};
let _knownDevices;
let _learnMode = false;
let _serialport;
let _parser;

/*
 *  Class
 */
class ESP3 extends EventEmitter {
    constructor(options) {
        super();

        if (options === undefined || options === null) {
            options = {};
        }

        _config.port = options.port ? options.port : '/dev/ttyAMA0';
        _config.baudrate = options.baudrate ? options.baudrate : 57600;
        _config.baseId = options.baseId ? options.baseId : '00000000';

        _knownDevices = options.knownDevices ? options.knownDevices : [];

        _parser = new ESP3Parser();
        _serialport = new SerialPort(_config.port, { baudRate: _config.baudrate, autoOpen: false });
        _serialport.pipe(_parser);
    }

    startLearnMode() {
        _learnMode = true;
    }

    stopLearnMode() {
        _learnMode = false;
    }

    addKnownDevice(device) {
        if (device && device.senderId && device.eep) {
            _knownDevices.push({senderId: device.senderId, eep: device.eep}); // Add error handling (senderId exists)
        } else {
            throw new TypeError('Device is missing or has an invaild format.');
        }
    }

    setKnownDevices(knownDevices) {
        _knownDevices = knownDevices;
    }

    open() {
        _serialport.open(function(err) {
            if (err) {
                this.emit('esp-error', err);
            }
        }.bind(this));

        _parser.on('data', function(buffer) {
            const eepPacket = new EEPPacket();
            eepPacket.setParser(new ESPPacket());
            eepPacket.setKnownDevices(_knownDevices);
    
            const packet = eepPacket.parse(buffer);

            if (_learnMode && packet && packet.learnMode) {
                this.emit('new-device', packet);
            } else if (packet && !packet.learnMode) {
                this.emit('known-device', packet);
            }

        }.bind(this));
    }

    write() {
        //_serialport.write();
    }

    test(buffer) {
        const eepPacket = new EEPPacket();
        eepPacket.setParser(new ESPPacket());
        eepPacket.setKnownDevices(_knownDevices);

        const packet = eepPacket.parse(buffer);

        if (_learnMode && packet && packet.learnMode) {
            this.emit('new-device', packet);
        } else if (packet && !packet.learnMode) {
            this.emit('known-device', packet);
        }
    }
}

module.exports = ESP3;