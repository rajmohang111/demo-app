var stream = require('stream');
var util = require('util');

function ArrayFormatter() {
    stream.Stream.call(this);
    this.writable = true;
    this._done = false;
    this._hasWritten = false;
}

util.inherits(ArrayFormatter, stream.Stream);

ArrayFormatter.prototype.write = function (doc) {
    if (!this._hasWritten) {
        this._hasWritten = true;
        this.emit('data', '[' + JSON.stringify(doc));
    }
    else {
        this.emit('data', ',' + JSON.stringify(doc));
    }
    return true;
};

ArrayFormatter.prototype.end =
ArrayFormatter.prototype.destroy = function () {
    if (this._done) {
        return;
    }
    this._done = true;
    if (!this._hasWritten) {
        this.emit('data', '[');
    }
    this.emit('data', ']');
    this.emit('end');
};

exports.ArrayFormatter = ArrayFormatter;

/**
 * Tests whether a given obj is empty.
 *
 * @param {Object} obj
 * @return {Boolean}
 */
exports.isEmpty = function isEmpty(obj) {
    for (var key in obj) {
        return false;
    }
    return true;
};

/**
 * Returns whether the given object is a valid date or not.
 *
 * @param {Object} date
 * @return {Boolean}
 */
exports.isValidDate = function isValidDate(date) {
    if (!util.isDate(date)) {
        return false;
    }
    return (!isNaN(date.getTime()));
};

/**
 * Returns whether the given value is a number
 *
 * @param {Object} num
 * @return {Boolean}
 */
exports.isNumber = function isNumber(num) {
    return (!isNaN(parseFloat(num)) && isFinite(num));
};

/**
 * Get the version number for the static files
 *
 * @return {String}
 */
exports.getStaticVersion = function getStaticVersion() {
    var ENV = process.env;
    if (ENV.NODE_ENV === 'local') {
        return Date.now();
    }
    return ENV.npm_package_version;
};
