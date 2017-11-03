const fs = require('fs');
const Telegram = require('../telegram');

describe('local', function() {
    const buffer = Buffer.from('55000a0701eba500007a080181383f0003ffffffff3d00e5', 'hex');
    const rawPacket = parse(buffer);

    const telegram = new Telegram(rawPacket.data);

    if (telegram.learnMode) {
        try {
            const knownDevices = JSON.parse(fs.readFileSync(__dirname + '/known-devices.json', 'utf8'));

            if (!knownDevices.hasOwnProperty(rawPacket.data.senderId)) {
                knownDevices[rawPacket.data.senderId] = telegram.eep;
                fs.writeFileSync(__dirname + '/known-devices.json', JSON.stringify(knownDevices));
            }
        } catch(err) {
            console.log('esp-error', err);
        }
    } else if (telegram.eep !== null) {
        console.log('Correct');
    }

    console.log(telegram);
});


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
