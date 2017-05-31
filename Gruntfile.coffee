module.exports = (grunt) ->
    grunt.initConfig
        coffee:
            compile:
                options:
                    bare: true
                    header: false
                files: [
                    expand: true
                    cwd: 'src/'
                    src: ['**/*.coffee']
                    dest: 'bin/'
                    ext: '.js'
                ]

    grunt.loadNpmTasks 'grunt-contrib-coffee'

    grunt.registerTask 'default', ['coffee']