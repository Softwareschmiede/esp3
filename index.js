const fs = require('fs');
const EventEmitter = require('events');

const SerialPort = require('serialport');
const ESP3Parser = require('esp3-parser');

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

        this.parser.on('data', function(data) {
            const rawPacket = parse(data);
            const telegram = new Telegram(rawPacket.data);

            const packet = { // Set basic informations
                senderId: rawPaket.data.senderId,
                subTelNum: rawPaket.optionalData.subTelNum,
                destinationId: rawPaket.optionalData.destinationId,
                dBm: rawPaket.optionalData.dBm,
                securityLevel: rawPaket.optionalData.securityLevel
            };

            if (telegram.learnMode) {
                try {
                    const knownDevices = JSON.parse(fs.readFileSync(this.config.knownDevicesFile, 'utf8'));

                    if (!knownDevices.hasOwnProperty(rawPacket.data.senderId)) {
                        knownDevices[rawPacket.data.senderId] = telegram.eep;
                        fs.writeFileSync(this.config.knownDevicesFile, JSON.stringify(knownDevices));
                    }
                } catch(err) {
                    this.emit('esp-error', err);
                }
            } else if (telegram.eep !== null) {
                paket.data = telegram; // Telegram has data
            }

            this.emit('esp-data', paket);
        }.bind(this));
    }
}

function parse(buffer) {
    if (buffer === undefined || buffer === null) {
        throw new TypeError('Buffer is missing.');
    }

    const dataOffset = 6;

    const raw = buffer;

    // Sync Byte - Every ESP3 packet starts with 55
    const syncByte = raw.toString('hex', 0, 1); // Size = 1 Byte

    const rawHeader = raw.slice(1, 5); // Header size = 4

    const header = {
        dataLength: rawHeader.readUInt16BE(0), // Size = 2 bytes
        optionalLength: rawHeader.readUInt8(2), // Size = 1 byte
        packetType: rawHeader.toString('hex', 3, 4) // Size = 1 byte
    };

    const crc8h = raw.toString('hex', 5, 6); // Size = 1 byte

    const rawData = raw.slice(dataOffset, dataOffset + header.dataLength); // Keep buffer reference

    const data = {
        rorg: rawData.toString('hex', 0, 1), // Size = 1 byte
        rawUserData: rawData.slice(1, header.dataLength - 5), // Variable length, but sender id and status have fixed sizes
        senderId: rawData.toString('hex', header.dataLength - 5, header.dataLength - 1), // Size = 4 bytes
        status: rawData.toString('hex', header.dataLength - 1, header.dataLength) // Size = 1 byte
    };

    const rawOptionalData = raw.slice(dataOffset + header.dataLength, dataOffset + header.dataLength + header.optionalLength); // Keep buffer reference

    const optionalData = {
        subTelNum: rawOptionalData.readUInt8(0), // Size = 1 byte
        destinationId: rawOptionalData.toString('hex', 1, 5), // Size = 4 bytes
        dBm: rawOptionalData.readUInt8(5), // Size = 1 byte
        securityLevel: rawOptionalData.readUInt8(6) // Size = 1 byte
    };

    const crc8d = raw.toString('hex', dataOffset + header.dataLength + header.optionalLength, dataOffset + header.dataLength + header.optionalLength + 1); // Size = 1 byte

    return {
        // raw: raw,
        // syncByte: syncByte,
        // rawHeader: rawHeader,
        header: header,
        // crc8h: crc8h,
        // rawData: rawData,
        data: data,
        // rawOptionalData: rawOptionalData,
        optionalData: optionalData,
        // crc8d: crc8d
    }
}

module.exports = ESP3;
