const Helper = require('../helper');

const sensors = {
    "01":{min:-40,max:0}, //1
    "02":{min:-30,max:10}, //2
    "03":{min:-20,max:20}, //3
    "04":{min:-10,max:30}, //4
    "05":{min:0,max:40}, //5
    "06":{min:10,max:50}, //6
    "07":{min:20,max:60}, //7
    "08":{min:30,max:70}, //8
    "09":{min:40,max:80}, //9
    "0a":{min:50,max:90}, //a
    "0b":{min:60,max:100}, //b
    "10":{min:-60,max:20}, //10
    "11":{min:-50,max:30}, //11
    "12":{min:-40,max:40}, //12
    "13":{min:-30,max:50}, //13
    "14":{min:-20,max:60}, //14
    "15":{min:-10,max:70}, //15
    "16":{min:0,max:80}, //16
    "17":{min:10,max:90}, //17
    "18":{min:20,max:100}, //18
    "19":{min:30,max:110}, //19
    "1a":{min:40,max:120}, //1a
    "1b":{min:50,max:130} //1b
};

module.exports = function(rawUserData, eep) {
    const temperature = rawUserData.readUInt8(2);
    const sensor = sensors[eep.type];

    return {
        type: 'temperature',
        unit: '°C',
        min: sensor.min,
        max: sensor.max,
        value: Helper.conversion(temperature, sensor.min, sensor.max, 0, 255)
    }
};
