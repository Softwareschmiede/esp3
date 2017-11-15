const ESP3 = require('../');

describe('test', function() {
    const buf = Buffer.from('55000a0701eba500007a080181383f0003ffffffff3d00e5', 'hex');
    
    const esp = new ESP3();
    esp.test(buf);

    esp.on('new-device', console.log);
    esp.on('known-device', console.log);
});