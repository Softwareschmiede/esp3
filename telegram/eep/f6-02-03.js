module.exports = function(rawUserData) {
    const btn = rawUserData.toString('hex');

    if (btn === '00') {
        return {
            type: 'state',
            value: 'released'
        }
    }

    if (btn === '10') {
        return {
            type: 'state',
            value: 'AI'
        }
    }

    if (btn === '30') {
        return {
            type: 'state',
            value: 'A0'
        }
    }

    if (btn === '50') {
        return {
            type: 'state',
            value: 'BI'
        }
    }

    if (btn === '70') {
        return {
            type: 'state',
            value: 'B0'
        }
    }
};
