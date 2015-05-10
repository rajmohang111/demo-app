/**
 * Module dependencies.
 */

var utils = require('../lib/utils.js');


module.exports = {

    'test .isValidDate()': function (test) {
        test.expect(8);
        test.ok(utils.isValidDate(new Date()));
        test.ok(utils.isValidDate(new Date(0)));
        test.ok(utils.isValidDate(new Date(345385993)));
        test.equal(utils.isValidDate(new Date('not a date')), false);
        test.equal(utils.isValidDate('not a date'), false);
        test.equal(utils.isValidDate(true), false);
        test.equal(utils.isValidDate(false), false);
        test.equal(utils.isValidDate(345385993), false);
        test.done();
    },

    'test .isNumber()': function (test) {
        test.expect(4);
        test.ok(utils.isNumber(5));
        test.ok(utils.isNumber(5.5));
        test.equal(utils.isNumber('test'), false);
        test.equal(utils.isNumber([1, 2, 3]), false);
        test.done();
    }
};