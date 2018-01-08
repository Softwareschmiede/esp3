/*
 *  Imports
 */
const EventEmitter = require('events');

const SerialPort = require('serialport');
const ESP3Parser = require('esp3-parser');
const EEPParser = require('eep-parser');
// const ESPPacket = require('esp3-packet');
// const EEPPacket = require('eep-packet');

/*
 *  Private declarations
 */
const _config = {};
var _knownDevices = null;
var _learnMode = false;
var _serialport = null;
var _parser = null;

/*
 *  Class
 */
class ESP3 extends EventEmitter {
    constructor(options) {
        super();

        if (options === undefined || options === null) {
            options = {};
        }

        _config.port = options.port ? options.port : '/dev/ttyS3';
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

    addKnownDevice(senderId, eep) {
        if (senderId && eep && _knownDevices.find((device) => { return device.senderId === senderId; }) === undefined) {
            _knownDevices.push({senderId: senderId, eep: eep}); // Add error handling (senderId exists)
        }
    }

    setKnownDevices(knownDevices) {
        _knownDevices = knownDevices;
    }

    open() {
        _serialport.open((err) => {
            if (err) {
                this.emit('esp-error', err);
            }
        });

        _parser.on('data', (buf) => {

            const eepParser = new EEPParser();
            eepParser.addDevices(_knownDevices);
    
            const packet = eepParser.parse(buf);

            if (_learnMode && packet && packet.learnMode) {
                this.emit('new-device', packet);
            } else if (packet && !packet.learnMode) {
                this.emit('known-device', packet);
            } else {
                console.log(packet);
            }
        });
    }

    write() {
        //_serialport.write();
    }

    // test(buffer) {
    //     const eepPacket = new EEPPacket();
    //     eepPacket.setParser(new ESPPacket());
    //     eepPacket.setKnownDevices(_knownDevices);
    //
    //     const packet = eepPacket.parse(buffer);
    //
    //     if (_learnMode && packet && packet.learnMode) {
    //         this.emit('new-device', packet);
    //     } else if (packet && !packet.learnMode) {
    //         this.emit('known-device', packet);
    //     }
    // }
}

module.exports = ESP3;