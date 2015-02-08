module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jsbeautifier: {
            "default": {
                files: {
                    src: ["public/**/*.js", "./*.js"]
                },
                options: {
                    spaceInParen: true,
                    braceStyle: "expand"
                }
            },
            "verify": {
                files: {
                    src: ["public/**/*.js", "./*.js"]
                },
                options: {
                    mode: "VERIFY_ONLY",
                    spaceInParen: true,
                    braceStyle: "expand"
                }
            }
        },
        githooks: {
            all: {
                'pre-commit': 'git-pre-commit'
            }
        },
        jshint: {
            all: ["public/**/*.js", "./*.js"]
        },
        watch: {
            options: {
                livereload: true
            },
            scripts: {
                files: ['public/**/*.jade', 'public/**/*.html', 'public/**/*.css']
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-githooks');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['jsbeautifier']);
    grunt.registerTask('git-pre-commit', ['jsbeautifier:verify', 'jshint']);

};
