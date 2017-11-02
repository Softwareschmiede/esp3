const ESP3 = require('../index');

describe('test', function() {
    const esp = new ESP3();

    esp.on('esp-test', function(data) {
        console.log('Bla');
        console.log(data);
    });

    esp.open();
});
