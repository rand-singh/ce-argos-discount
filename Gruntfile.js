module.exports = function(grunt) {

	var datetime = grunt.template.today('dd-mm-yyyy_HHMM');
  	// grunt.log.writeln(["grunt started", datetime]);

	grunt.initConfig({

		// Create zip file ready for upload to Chrome Store
		compress: {
			main: {
				options: {
					archive: 'argos-discount-viewer_' + datetime + '.zip',
					mode: 'zip'
				},
				files: [
					{
						expand: true,
						src: ['css/*','icons/*','images/*','js/*','manifest.json','popup.html']
					}
				]
			}
		},

		// Copy the zip file to dist folder for storage
		copy: {
			main:{
				files: [
					{expand: true, src: ['*.zip'], dest: 'dist/'}
				]
			}
		},

		// Remove copied zip files to keep root clean
		clean: ['*.zip'],

		// Lint scss files using Node Sass
		scsslint: {
			options: {
				colorizeOutput: true,
				configFile: '.scss-lint.yml'
			},
			allFiles: ['sass/**/*.scss']
		},

		// Compile scss to css
		sass: {
			dist: {
				options: {
					style: 'compressed',
					sourcemap: 'none',
					noCache: true
				},
				files: {
					'css/popup-styles.css' : 'sass/popup-styles.scss',
					'css/content_scripts-styles.css' : 'sass/content_scripts.scss'
				}
			}
		},

		// Watch for changes to scss files and run task sass
		watch: {
			css: {
				files: ['sass/*.scss', 'sass/**/*.scss'],
				tasks: ['scsslint', 'sass']
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.loadNpmTasks('grunt-scss-lint');

	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('dist', ['compress', 'copy', 'clean']);
};