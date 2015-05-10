
function MockRequest(method, query, headers, body, cookies) {
    this.method = method;
    this.headers = headers || {};
    this.body = body || {};
    this.query = query || {};
    this.cookies = cookies || {};
    this.url = '';
}

MockRequest.prototype = {
    'param': function (key, other) {
        if (this.query.hasOwnProperty(key)) {
            return this.query[key];
        }
        else if (this.body.hasOwnProperty(key)) {
            return this.body[key];
        }
        return other;
    },

    'header': function (key, other) {
        key = key.toLowerCase();
        if (this.headers.hasOwnProperty(key)) {
            return this.headers[key];
        }
        return other;
    }
};

function MockResponse(code) {
    this.statusCode = code;
}

MockResponse.prototype = {
    'json': function (body, status) {
        this.statusCode = status;
        return JSON.stringify(body);
    }
};

exports.MockRequest = MockRequest;
exports.MockResponse = MockResponse;
