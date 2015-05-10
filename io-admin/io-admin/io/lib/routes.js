var ENV = process.env;

var os = require('os');
var url = require('url');

var request = require('request');

var utils = require('./utils.js');

//Header Files
var headerUtil = require('./header.js');


/**
 * Health Check
 *
 * @param {ServerRequest} req
 * @param {ServerResponse} res
 * @param {Function} next
 * @return {null}
 */
exports.healthCheck = function (req, res, next) {
    var headers = {
        'Content-Type': 'text/plain'
    };

    switch (req.url) {
        case '/health/health.html':
            return res.send('1123uptest2004', headers, 200);
        case '/~/version':
            return res.send(ENV.npm_package_version, headers, 200);
        case '/~/config':
            var data = {
                'hostname': os.hostname(),
                'version': ENV.npm_package_version,
                'ip': ENV.npm_package_config_ip,
                'port': ENV.npm_package_config_port,
                'env': ENV.npm_package_config_env,
                'debug': ENV.npm_package_config_debug || 'false',
                'user': ENV.npm_package_config_user
            };
            return res.json(data, 200);
        default:
            return next();
    }
};

/**
 * Home Page
 *
 * @param {ServerRequest} req
 * @param {ServerResponse} res
 * @param next
 * @return {null}
 */
exports.home = function (req, res, next) {
    var app = req.app;

    var header = {links: []};
    header.links.push({url: '/', icon: 'home', text: 'Home', active: true});
    header.apps = headerUtil.getAppLinks(app.set('application'));
    header.subnav = {links: [], enabled: false};

    var locals = {
        'user': req.user,
        'version': utils.getStaticVersion(),
        'static_img_url': app.set('static_img_url'),
        'static_css_url': app.set('static_css_url'),
        'static_js_url': app.set('static_js_url'),
        'api_url': app.set('api_url'),
        'logoff_url': app.set('logoff_url'),
        'colab_url': app.set('colab_url'),
        'google_analytics': app.set('google_analytics'),
        'partials': {
            'header': './partials/header',
            'footer': './partials/footer',
            'analytics': './partials/analytics'
        },
        'header': header,
        'application': app.set('application'),
        'application_icon': app.set('application_icon')

    };

    console.log(locals);

    res.header('Cache-Control', 'no-cache,no-store');
    res.header('Pragma', 'no-cache');
    return res.render('home', locals);

};

/**
 * Handle the error and render the error page
 * @param req
 * @param res
 * @param next
 * @return {*}
 */
exports.error = function (req, res, next, message) {
    var app = req.app;

    var header = {links: []};
    header.links.push({url: '/', icon: 'home', text: 'Home', active: false});
    header.apps = headerUtil.getAppLinks(app.set('application'));

    var locals = {
        'version': utils.getStaticVersion(),
        'ERROR': message,
        'static_img_url': app.set('static_img_url'),
        'static_css_url': app.set('static_css_url'),
        'static_js_url': app.set('static_js_url'),
        'api_url': app.set('api_url'),
        'partials': {
            'header': './partials/header',
            'footer': './partials/footer',
            'analytics': './partials/analytics'
        },
        'header': header,
        'application': app.set('application'),
        'application_icon': app.set('application_icon')
    }
    res.header('Cache-Control', 'no-cache,no-store');
    res.header('Pragma', 'no-cache');
    res.status(404);
    /*
     * The reason I opted to use the request to redirect the url
     * is that the browser URL will not update and its advantage
     * is that URL that appears to the user still the same mashups URL
     * but the actual rendered page will be error page.
     */
    return res.render('error', locals);
}

/**
 * Proxy to the services from the server to avoid cross-domain issues
 *
 * @param {ServerRequest} req
 * @param {ServerResponse} res
 * @param {Function} next
 * @return {null}
 */
exports.proxy = function (req, res, next) {
    var base_url = req.url.replace('/proxy/', 'http://');
    var parts = url.parse(base_url, true);

    var token = 'REPLACE_ME';  // 999928420
    parts.query.access_token = token;
    delete parts.search;

    var options = {
        'uri': url.format(parts),
        'method': req.method,
        'headers': req.headers,
        'jar': false,
        'pool': false
    };

    if (!utils.isEmpty(req.body)) {
        options.json = req.body;
    }

    return request(options).pipe(res);
};