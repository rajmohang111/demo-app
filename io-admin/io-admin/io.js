var ENV = process.env;

var http = require('http');
var util = require('util');

var cluster;
try {
    cluster = require('cluster');
}
catch (err) {
    console.error('cluster module not available, running single process');
}
var numCPUs = require('os').cpus().length;

var DEBUG = (ENV.npm_package_config_debug === 'true');

var app = require('./io/app.js');

if (cluster && cluster.isMaster) {
    var respawn = true;

    // Fork workers.
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('fork', function (worker) {
        if (DEBUG) {
            console.log(util.format('Spawned new worker (%d)',
                                    worker.process.pid));
        }
    });

    cluster.on('listening', function (worker, address) {
        if (DEBUG) {
            console.log(util.format('Worker (%d) is connected to %s:%d',
                                    worker.process.pid, address.address,
                                    address.port));
        }
    });

    cluster.on('exit', function (worker, code, signal) {
        if (DEBUG) {
            var exitCode = worker.process.exitCode;
            console.log(util.format('Worker (%d) died (%d, %s)',
                                    worker.process.pid, exitCode, signal));
        }

        if (respawn) {
            cluster.fork();
        }
    });

    /**
     * Shutdown signal handler
     *
     * @return {null}
     */
    function terminate() {
        if (DEBUG) {
            console.log('Terminating %d workers',
                        Object.keys(cluster.workers).length);
        }

        respawn = false;

        // destroy all workers
        for (var id in cluster.workers) {
            if (cluster.workers.hasOwnProperty(id)) {
                cluster.workers[id].destroy();
            }
        }

        process.exit(0);
    }

    if (process.platform !== 'win32') {
        process.once('SIGTERM', terminate);
        process.once('SIGINT', terminate);
        process.once('SIGQUIT', terminate);
    }
}
else {
    var server = http.createServer(app);
    server.listen(ENV.npm_package_config_port, ENV.npm_package_config_ip, function () {
        if (DEBUG) {
            var addr = server.address();
            console.log('GE IO listening at %s:%s', addr.address, addr.port);
        }
    });
}
