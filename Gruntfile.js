module.exports = function(grunt) {
  gzip = require("gzip-js");
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    compare_size: {
      files: [ "tcial.js", "tcial.min.js" ],
      options: {
        compress: {
          gz: function( contents ) {
            return gzip.zip( contents, {} ).length;
          }
        },
        cache: ".sizecache.json"
      }
    },
    uglify: {
      options: {
        banner: '/* * * * * * * * * *\n' +
                ' *    tcial .js    *\n' +
                ' *  Version <%= pkg.version %>  *\n' +
                ' *  License:  MIT  *\n' +
                ' * Simon  Waldherr *\n' +
                ' * * * * * * * * * */\n\n',
        footer: '\n\n /* the cake is a lie, but the cookie isn\'t */\n'
      },
      dist: {
        files: {
          './tcial.min.js': ['./tcial.js']
        }
      }
    },
    compress: {
      main: {
        options: {
          mode: 'gzip'
        },
        files: [
          {expand: true, src: 'tcial.min.js', dest: 'dist/', ext: '.gz.js'}
        ]
      }
    }
  });
  grunt.loadNpmTasks("grunt-compare-size");
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['uglify', 'compare_size']);
};
