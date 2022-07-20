const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const gulp = require('gulp');
const mergeMediaQueries = require('gulp-merge-media-queries');
const minify = require('gulp-minify');
const notify = require('gulp-notify');
const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));

// Define the source paths for each file type.
const src = {
	js: ['assets/js/src/*.js'],
	sass: ['assets/css/src/**/*','!assets/css/src/components'],
	sassWatch: ['assets/css/src/**/*']
};

// Define the destination paths for each file type.
const dest = {
	js: 'assets/js',
	sass: 'assets/css'
};

// Take care of SASS.
gulp.task('sass', function(done) {
	return gulp.src(src.sass)
		.pipe(sass({
			outputStyle: 'expanded'
		}).on('error', sass.logError))
		.pipe(mergeMediaQueries())
		.pipe(autoprefixer({
			cascade: false
		}))
		.pipe(cleanCSS({
			compatibility: 'ie8'
		}))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest(dest.sass))
		.pipe(notify('WPC 2022 SASS compiled'))
		.on('end',done);
});

// Take care of JS.
gulp.task('js', function(done) {
	return gulp.src(src.js)
		.pipe(minify({
			mangle: false,
			noSource: true,
			ext:{
				min:'.min.js'
			}
		}))
		.pipe(gulp.dest(dest.js))
		.pipe(notify('WPC 2022 JS compiled'))
		.on('end',done);
});

// Compile all the things.
gulp.task('compile',gulp.series('sass','js'));

// Let's get this party started.
gulp.task('default', gulp.series('compile'));

// I've got my eyes on you(r file changes).
gulp.task('watch', gulp.series('default',function(done) {
	gulp.watch(src.js, gulp.series('js'));
	gulp.watch(src.sassWatch,gulp.series('sass'));
	return done();
}));
