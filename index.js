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

        const config = {};
        config.port = options.port ? options.port : '/dev/ttyAMA0';
        config.baudrate = options.baudrate ? options.baudrate : 57600;
        config.baseId = options.baseId ? options.baseId : '00000000';
        config.sensorFile = options.sensorFile ? options.sensorFile : __dirname + '/eep/known-devices.json';


        this.parser = new ESP3Parser();
        this.serialport = new SerialPort(config.port, { baudRate: config.baudrate, autoOpen: false });
        this.serialport.pipe(this.parser);

    }

    open() {
        this.serialport.open(function (err) {
            if (err) {
                this.emit('esp-error', err);
            }
        });

        this.parser.on('data', function(data) {
            const rawPacket = parse(data);
            const telegram = new Telegram(rawPacket.data);

            this.emit('esp-data', telegram);
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

    // const eep = EEP(data);
    // if (eep.learnMode) {
    //     const eepMapper = JSON.parse(fs.readFileSync(path.join(__dirname, '/eep/eep.json'), 'utf8'));
    //
    //     if (!eepMapper.hasOwnProperty(data.senderId)) {
    //         eepMapper[data.senderId] = eep.eep;
    //
    //         fs.writeFileSync(path.join(__dirname, '/eep/eep.json'), JSON.stringify(eepMapper));
    //     }
    // } else {
    //     data.userData = eep;
    // }

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
