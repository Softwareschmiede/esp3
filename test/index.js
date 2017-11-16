const ESP3 = require('../');

describe('test', function() {
    const buf = Buffer.from('55000a0701eba500007a080181383f0003ffffffff3d00e5', 'hex');

    const knownDevicesArray = [
        {
            senderId: '01830281',
            eep: {
                rorg: 'd5',
                func: '00',
                type: '01'
            }
        },
        {
            senderId: '0181383f',
            eep: {
                rorg: 'a5',
                func: '02',
                type: '05'
            }
        }
    ];
    
    const esp = new ESP3({knownDevices: knownDevicesArray});

    esp.on('new-device', console.log);
    esp.on('known-device', console.log);

    esp.test(buf);
});