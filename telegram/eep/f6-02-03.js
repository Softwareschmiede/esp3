module.exports = function(rawUserData) {
    const btn = rawUserData.toString('hex');

    if (btn === '00') {
        return {
            type: 'switch',
            value: 'released'
        }
    }

    if (btn === '10') {
        return {
            type: 'switch',
            value: 'AI'
        }
    }

    if (btn === '30') {
        return {
            type: 'switch',
            value: 'A0'
        }
    }

    if (btn === '50') {
        return {
            type: 'switch',
            value: 'BI'
        }
    }

    if (btn === '70') {
        return {
            type: 'switch',
            value: 'B0'
        }
    }
};
