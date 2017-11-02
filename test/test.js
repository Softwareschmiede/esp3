const ESP3 = require('../index');

describe('test', function() {
    const esp = new ESP3();

    esp.on('data', function(data) {
        console.log(data);
    });
});
