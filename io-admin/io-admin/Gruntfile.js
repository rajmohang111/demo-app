/*global module:true */

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: '<json:package.json>',
        meta: {
            banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
                '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
                ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
        },
        jshint: {
            files: [
                'Gruntfile.js',
                'server/**/*.js',
                'io/**/*.js',
                '!**/lib/**',
                '!**/domReady.js',
                '!**/text.js',
                '!**/require.js',
                '!node_modules'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        cssmin: {
            compress: {
                files: {

                }
            }
        },
        clean: {
            options: {
                force: true
            },
            before: ['io/public/build'],
            before_css: ['io/public/build/css'],
            before_image: ['io/public/build/img'],
            before_js: ['io/public/build/js']
        },
        requirejs: {
            compile: {
                options: {
                    'baseUrl': './forms/public/js',
                    'dir': './forms/public/build/js',
                    'paths': {

                    },
                    'shim': {
                    },
                    'locale': 'en-us',
                    'optimize': 'uglify2',
                    'uglify2': {
                        'mangle': true
                    },
                    'generateSourceMaps': true,
                    'preserveLicenseComments': false,
                    'inlineText': true,
                    'modules': [

                    ],
                    'stubModules': ['text'],
                    'waitSeconds': 30
                }
            }
        },
        shell: {
            list_grunt: {
                command: 'grunt --version',
                options: {
                    stdout: true
                }
            },
            karma_once: {
                command: './node_modules/karma/bin/karma start test-runner/karma.conf.js --browsers PhantomJS --single-run --reporters progress,junit,coverage',
                options: {stdout: true}
            },
            karma: {
                command: './node_modules/karma/bin/karma start test-runner/karma.conf.js --browsers Chrome',
                options: {stdout: true}
            }
        }
    });

    //Load tasks frameworks
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-shell');

    // Default task.
    grunt.registerTask('default', ['jshint']);
    grunt.registerTask('min-css', ['clean:before_css', 'cssmin']);
    grunt.registerTask('min-js', ['clean:before_js', 'requirejs', 'clean:after']);
    grunt.registerTask('min-all', ['shell:list_grunt', 'clean:before', 'cssmin', 'requirejs', 'clean:after']);
};
