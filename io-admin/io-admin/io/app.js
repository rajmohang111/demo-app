var ENV = process.env;

var util = require('util');

// 3rd-party libraries
var express = require('express');
var consolidate = require('consolidate');
var mustache = require('mustache');

// Custom route libraries
var routes = require('./lib/routes.js');
var utils = require('./lib/utils.js');
var DEBUG = (ENV.npm_package_config_debug === 'true');

if (!ENV.npm_package_config_env
    || (ENV.npm_package_config_env === 'REPLACE_ME')) {

    console.log('Run: npm config -g set io:env "YOUR ENVIRONMENT"');
    process.exit(1);
} else {
    process.env.NODE_ENV = ENV.npm_package_config_env;
}

var app = express();

app.engine('mustache', consolidate.mustache);

app.configure(function () {
    app.set('application', 'I/O');
    app.set('application_icon', 'io');

    app.set('views', __dirname + '/views');
    app.set('view engine', 'mustache');

    //app.use(express.logger());
    app.use(routes.healthCheck);

    app.use(express.static(__dirname + '/public', {'maxAge': 604800000}));
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.methodOverride());
    // Error handling middleware that returns JSON
    app.use(function (err, req, res, next) {
        if (DEBUG) {
            var msg;
            if (err.hasOwnProperty('message')) {
                msg = err.message;
            }
            else {
                msg = util.inspect(err);
            }
            console.log('[ERROR] %s', msg);
        }

        var headers = {};
        if (err.hasOwnProperty('headers')) {
            headers = err.headers;
        }

        var status = 500;
        if (err.hasOwnProperty('status')) {
            status = parseInt(err.status, 10);
        }
        return res.json({'error': err.message}, headers, status);
    });
});

app.configure('local', function () {
    if (DEBUG) {
        console.log('Using "local" configuration');
    }
    app.set('static_css_url', '/css');
    app.set('static_js_url', '/js');
    app.set('static_img_url', '/img');
    app.set('site_url', 'local.io.ge.com');
    //app.set('api_url', 'local.api.io.ge.com');
    app.set('api_url', 'server/');
    app.set('logoff_url', '/');
    app.set('colab_url', 'http://colab.ge.com/dashboard/profile/');

});

app.configure('sandbox', function () {
    if (DEBUG) {
        console.log('Using "sandbox" configuration');
    }

    app.set('static_css_url', '//sandbox.io.ge.com/css');
    app.set('static_js_url', '//sandbox.io.ge.com/js');
    app.set('static_img_url', '//sandbox.io.ge.com/img');
    app.set('site_url', 'sandbox.io.ge.com');
    app.set('api_url', 'sandbox.api.io.ge.com');

    var logoff_url = 'http://ssologin.dev.corporate.ge.com:8887/logoff/logoff.jsp';
    logoff_url += '?referrer=http://sandbox.io.ge.com/';
    app.set('logoff_url', logoff_url);

    app.set('colab_url', 'http://colab.ge.com/dashboard/profile/');
});

app.configure('dev', function () {
    if (DEBUG) {
        console.log('Using "dev" configuration');
    }

    app.set('static_css_url', '//dev.io.ge.com/css');
    app.set('static_js_url', '//dev.io.ge.com/js');
    app.set('static_img_url', '//dev.io.ge.com/img');
    app.set('site_url', 'dev.io.ge.com');
    app.set('api_url', 'dev.api.io.ge.com');

    var logoff_url = 'http://ssologin.dev.corporate.ge.com:8887/logoff/logoff.jsp';
    logoff_url += '?referrer=http://dev.io.ge.com/';
    app.set('logoff_url', logoff_url);

    app.set('colab_url', 'http://colab.ge.com/dashboard/profile/');

    app.set('google_analytics', 'UA-34787909-1');

});

app.configure('stage', function () {
    if (DEBUG) {
        console.log('Using "stage" configuration');
    }

    app.set('static_css_url', '//stage-io.gecdn.com/css');
    app.set('static_js_url', '//stage-io.gecdn.com/build/js');
    app.set('static_img_url', '//stage-io.gecdn.com/img');
    app.set('site_url', 'stage.io.ge.com');
    app.set('api_url', 'stage.api.io.ge.com');

    var logoff_url = 'https://ssologin.stage.corporate.ge.com/logoff/logoff.jsp';
    logoff_url += '?referrer=http://stage.io.ge.com/';
    app.set('logoff_url', logoff_url);

    app.set('colab_url', 'http://colab.ge.com/dashboard/profile/');

    app.set('google_analytics', 'UA-34782707-1');
});

app.configure('production', function () {
    if (DEBUG) {
        console.log('Using "production" configuration');
    }

    app.set('static_css_url', '//io.gecdn.com/css');
    app.set('static_js_url', '//io.gecdn.com/build/js');
    app.set('static_img_url', '//io.gecdn.com/img');
    app.set('site_url', 'io.ge.com');
    app.set('api_url', 'api.io.ge.com');

    var logoff_url = 'https://ssologin.corporate.ge.com/logoff/logoff.jsp';
    logoff_url += '?referrer=http://io.ge.com/';
    app.set('logoff_url', logoff_url);

    app.set('colab_url', 'http://colab.ge.com/dashboard/profile/');

    app.set('google_analytics', 'UA-34791202-1');
});

// Set the user to be the SSO ID in the request
app.use(function (req, res, next) {
    var user;
    if (ENV.NODE_ENV === 'local') {
        user = {    //222003106
            'id': '999928420',
            'first_name': 'Test',
            'last_name': 'User'
        };

        req.user = user;
        return next();
    }

    var ssoid = req.header('SM_USER', null);
    if (!ssoid) {
        var err = new Error('SM_USER header not found in request');
        err.status = 401;
        return next(err);
    }

    //Escape single quotes and double quotes of out names
    var givenname = req.header('givenname', null);
    if (givenname) {
        givenname = givenname.replace(/'/g, '&#039;').replace(/"/g, ' &quot;');
    }
    var sn = req.header('sn', null);
    if (sn) {
        sn = sn.replace(/'/g, '&#039;').replace(/"/g, ' &quot;');
    }

    user = {
        'id': ssoid,
        'first_name': req.header('givenname', null),
        'last_name': req.header('sn', null)
    };
    req.user = user;
    return next();
});

// Default router
app.use(app.router);

// Routes
app.get('/', routes.home);
// Proxy route for local testing
app.all('/proxy/*', routes.proxy);

app.all('*', function (req, res, next) {
    return routes.error(req, res, next, 'This page can not be found. Please check the URL and try again.');
});

module.exports = app;
