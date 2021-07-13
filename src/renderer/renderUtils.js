function deg2rad(x) {
    return x*Math.PI/180;
}

function rad2deg(x) {
    return x*180/Math.PI;
}

module.exports = {
    deg2rad,
    rad2deg
};