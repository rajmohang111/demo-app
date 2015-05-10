{
    "name": "io",
    "version": "1.0.__BUILD__",
    "private": true,
    "description": "GE I/O",
    "keywords": [
        "I/O",
        "Reports"
    ],
    "repository": {
        "type": "svn",
        "url": "https://openge.ge.com/svn/adhocreports"
    },
    "dependencies": {
        "express": "3.1.1",
        "consolidate":"0.8.0",
        "i18n": "0.3.5",
        "mustache": "0.7.2",
        "request": "2.16.6"
    },
    "devDependencies": {
        "grunt": "0.4.1",
        "grunt-contrib-jshint": "0.6.4",
        "grunt-contrib-clean": "0.5.0",
        "grunt-contrib-cssmin": "0.6.1",
        "grunt-contrib-requirejs": "0.4.1",
        "grunt-shell": "0.3.1",
        "karma":"0.10.2",
        "karma-coverage":"0.1.0",
        "karma-junit-reporter": "0.1.0"
    },
    "engines": {
        "node": ">= 0.8.18"
    },
    "scripts": {
        "start": "node io.js",
        "test": "make test"
    },
    "config": {
        "ip": "0.0.0.0",
        "port": 8080,
        "env": "REPLACE_ME",
        "debug": true,
        "user": "io",
        "pass": "REPLACE_ME",
        "logPath": "log/out.log",
        "logLevel": "debug"
    },
    "directories": {
        "lib": "io/lib",
        "test": "io/test"
    }
}
