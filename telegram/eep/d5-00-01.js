module.exports = function(rawUserData) {
    const state = ['open', 'closed'];
    const stateBit = rawUserData.readUInt8() << 31 >>> 31; // Offset = 7, size = 1

    return {
        type: 'contact',
        state: state[stateBit] // 0 = open, 1 = closed
    }
};
