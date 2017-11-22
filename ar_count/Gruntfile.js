module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            sass: {
                files: ['src/sass/**/*.{scss,sass,css}'],
                tasks: ['sass:dist']
            }
        },
        copy: {
            libraries: {
                files: [{
                    expand: true,
                    cwd: 'node_modules/jsartoolkit5/build/',
                    src: ['**/*'],
                    dest: 'public/lib/'
                }]
            }
        },
        sass: {
            options: {
                includePaths: ['node_modules/bootstrap-sass/assets/stylesheets/'],
                sourceMap: true,
                outputStyle: 'compressed'
            },
            dist: {
                files: {
                    'public/css/main.css': 'src/sass/main.sass'
                }
            }
        }
    });
    grunt.registerTask('default', ['copy:libraries', 'sass:dist', 'watch']);
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
};
