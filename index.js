const EventEmitter = require('events');

const SerialPort = require('serialport');
const ESP3Parser = require('esp3-parser');
const EEPPacket = require('eep-packet');

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

        this.knownDevices = options.knownDevices ? options.knownDevices : {};

        this.learnMode = false;
        

        this.parser = new ESP3Parser();
        this.serialport = new SerialPort(this.config.port, { baudRate: this.config.baudrate, autoOpen: false });
        this.serialport.pipe(this.parser);

        // Binding
        this.startLearnMode = this.startLearnMode.bind(this);
        this.stopLearnMode = this.stopLearnMode.bind(this);
        this.addKnownDevice = this.addKnownDevice.bind(this);
        this.setKnownDevices = this.setKnownDevices.bind(this);
        this.open = this.open.bind(this);
    }

    startLearnMode() {
        this.learnMode = true;
    }

    stopLearnMode() {
        this.learnMode = false;
    }

    addKnownDevice(device) {
        this.knownDevices[device.senderId] = device.eep; // Add error handling (senderId exists)
    }

    setKnownDevices(knownDevices) {
        // Convert array to object with multiple properties
        for (let i = 0; i < knownDevices.length; i++) {
            this.knownDevices[knownDevices[i].senderId] = knownDevices[i].eep;
        }
    }

    open() {
        this.serialport.open(function (err) {
            if (err) {
                this.emit('esp-error', err);
            }
        }.bind(this));

        this.parser.on('data', function(buffer) {
            const eepPacket = new EEPPacket(buffer, this.knownDevices);

            if (this.learnMode && eepPacket.learnMode) {
                this.emit('new-device', eepPacket);
            } else if (this.knownDevices.hasOwnProperty(eepPacket.data.senderId)) {
                this.emit('known-device', eepPacket);
            }
            
        }.bind(this));
    }
}

module.exports = ESP3;
