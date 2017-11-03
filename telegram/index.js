const Helper = require('./helper');
const EEP = require('./eep');
const KnownDevices = require('./known-devices.json');

class Telegram {
    constructor(data) {
        if (data.rorg === 'f6') {
            return EEP['f60203'](data.rawUserData);
        }

        if (data.rorg === 'd5') { // At this moment there is only one eep
            const learnMode = data.rawUserData.readUInt8() << 28 >>> 31; // Offset = 4, size = 1

            if (learnMode === 0) { // it's a learn packet
                return {
                    learnMode: true,
                    eep: { rorg: data.rorg, func: '00', type: '01' }
                }
            } else {
                const eep = KnownDevices[data.senderId];
                return EEP[eep.rorg + eep.func + eep.type](data.rawUserData);
            }
        }

        if (data.rorg === 'a5') {
            const learnMode = data.rawUserData.readUInt8(3) << 28 >>> 31;

            if (learnMode === 0) { // it's a learn packet
                const func = Helper.pad(data.rawUserData.readUInt8() >>> 2);
                const type = Helper.pad(data.rawUserData.readUInt16BE() << 22 >>> 25);

                return {
                    learnMode: true,
                    eep: { rorg: data.rorg, func: func, type: type }
                }
            } else {
                const eep = KnownDevices[data.senderId];

                if (eep) {
                    return EEP[eep.rorg + eep.func](data.rawUserData, eep);
                } else {
                    return {eep: null}
                }
            }
        }

        return null;
    }
}

module.exports = Telegram;
