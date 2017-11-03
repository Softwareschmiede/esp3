const ESP3 = require('../index');

describe('test', function() {
    const esp = new ESP3();


    esp.on('esp-error', function(err) {
        console.log(err.msg);
    });

    esp.on('esp-data', function(data) {
        console.log(data);
    });

    esp.open();
});
