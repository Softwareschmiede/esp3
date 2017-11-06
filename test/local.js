const fs = require('fs');
const EEPPacket = require('eep-packet');

const Telegram = require('../telegram');

describe('local', function() {
    const buffer = Buffer.from('55000707017ad509018302810003ffffffff33009c', 'hex');
    const eepPacket = new EEPPacket(buffer);

    console.log(eepPacket);
});
