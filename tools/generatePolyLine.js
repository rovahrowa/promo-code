
const google = require('@google/maps');

module.exports = (origin, destination) => {
    const toEventPath = [
        { lat: origin[0], lng: origin[1] },
        { lat: destination[0], lng: destination[1] },
    ];

    return google.util.encodePath(toEventPath)
};