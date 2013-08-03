module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      scripts: {
        files: ['**/*.js', '**/*.styl', '**/*.css', '**/*.html'],
        tasks: ['default'],
        options: {
          spawn: false,
        },
      },
    },
    clean: ['js/main.js', 'css/main.css'],
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy hh:mm:ss") %> */\n',
        beautify: true
      },
      dist: {
        files: {
          'js/main.js': ['vendor/**/*.js', 'lib/utility.js',
                         'lib/player.js', 'lib/player/amuzPlayer.js',
                         'lib/playable.js', 'lib/playable/youtubeVideo.js', 
                         'lib/init.js',
                         'modules/**/*.js', 'controllers/**/*.js']
        }
      }
    },
    stylus: {
      compile: {
        options: {
          paths: ['css'],
          use: [ require('nib') ]
        },
        files: {
          'css/main-stylus.css': ['css/main.styl']
        }
      }
    },
    csso: {
      dist: {
        files: {
          'css/main.css': ['css/**/*.css']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-csso');


  grunt.registerTask('test', []);

  grunt.registerTask('default', ['clean', 'uglify', 'stylus', 'csso']);

};