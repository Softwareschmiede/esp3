const ESP3 = require('../');

console.log('Test');

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

const esp = new ESP3();

process.on('unhandledRejection', (reason, p) => { console.log(reason) });

esp.on('new-device', console.log);
esp.on('known-device', console.log);

esp.open();
