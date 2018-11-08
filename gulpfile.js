const gulp = require('gulp')
const uglify = require('gulp-uglify')
const livereload = require('gulp-livereload')
const concat = require('gulp-concat')
const minifyCss = require('gulp-minify-css')
const autoprefixer = require('gulp-autoprefixer')
const plumber = require('gulp-plumber')
const sourcemaps = require('gulp-sourcemaps')
const sass = require('gulp-sass')
const babel = require('gulp-babel')
const del = require('del')
const zip = require('gulp-zip')

// File paths
const DIST_PATH = 'public/dist'
const SCRIPTS_PATH = 'public/scripts/**/*.js'
const CSS_PATH = 'public/css/**/*.css'
const SCSS_PATH = 'public/scss/styles.scss'
const TEMPLATES_PATH = 'templates/**/*.hbs'
const IMAGES_PATH = 'public/images/**/*.{png,jpeg,jpg,svg,gif}'

// Handlebars plugins
const handlebars = require('gulp-handlebars')
const handlebarsLib = require('handlebars')
const declare = require('gulp-declare')
const wrap = require('gulp-wrap')

// Image compression
const imagemin = require('gulp-imagemin')
const imageminPngquant = require('imagemin-pngquant')
const imageminJpegRecompress = require('imagemin-jpeg-recompress')

// // Styles
// gulp.task('styles', () => {
//   console.log('starting styles task')

//   // return gulp.src(CSS_PATH)
//   return gulp.src(['public/css/reset.css', CSS_PATH])
//   // .pipe(plumber(function (err) { // do not use arrow function here
//   //   console.log('Styles Task Error')
//   //   console.log(err)
//   //   this.emit('end')
//   // }))
//   // alternative gulp-plumber, no need to install
//   .on('error', function (errorInfo) {
//     console.log(errorInfo.toString());
//     this.emit('end');
//   })
//   .pipe(sourcemaps.init())
//   .pipe(autoprefixer())
//   // .pipe(autoprefixer({
//   //   browsers: ['last 2 versions', 'ie 8']
//   // }))
//   .pipe(concat('styles.css'))
//   .pipe(minifyCss())
//   .pipe(sourcemaps.write())
//   .pipe(gulp.dest(DIST_PATH))
//   .pipe(livereload())
// })

// Styles for SCSS
gulp.task('styles', () => {
  console.log('starting styles task')

  // return gulp.src(CSS_PATH)
  return gulp.src(SCSS_PATH)
    .on('error', function (errorInfo) {
      console.log(errorInfo.toString())
      this.emit('end')
    })
    .pipe(sourcemaps.init())
    .pipe(autoprefixer())
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(DIST_PATH))
    .pipe(livereload())
})

// Scripts
gulp.task('scripts', () => {
  console.log('starting scripts task')

  return gulp.src(SCRIPTS_PATH)
    .on('error', function (errorInfo) {
      console.log(errorInfo.toString())
      this.emit('end')
    })
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(concat('scripts.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(DIST_PATH))
    .pipe(livereload())
})

// Images
gulp.task('images', () => {
  console.log('starting images task')

  return gulp.src(IMAGES_PATH)
    // .pipe(imagemin()) // gulp-imagemin: Minified 5 images (saved 289 kB - 7.9%)
    .pipe(imagemin(
      [
        imagemin.gifsicle(),
        imagemin.jpegtran(),
        imagemin.optipng(),
        imagemin.svgo(),
        imageminPngquant(),
        imageminJpegRecompress()
      ]
    )) // gulp-imagemin: Minified 5 images (saved 2.58 MB - 70.2%)
    .pipe(gulp.dest(DIST_PATH + '/images'))
})

// Templates
gulp.task('templates', function () {
  return gulp.src(TEMPLATES_PATH)
    .pipe(handlebars({
      handlebars: handlebarsLib
    }))
    .pipe(wrap('Handlebars.template(<%= contents %>)'))
    .pipe(declare({
      namespace: 'templates',
      noRedeclare: true
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest(DIST_PATH))
    .pipe(livereload());
})

// Clean file and folders
gulp.task('clean', function () {
  return del.sync([
    DIST_PATH
  ])
})

// Default
gulp.task('default', ['clean', 'images', 'templates', 'styles', 'scripts'], function () {
  console.log('starting default task')
})

// Export
gulp.task('export', function () {
  return gulp.src('public/**/*')
    .pipe(zip('website.zip'))
    .pipe(gulp.dest('./'))
})

// Watch
gulp.task('watch', ['default'], function () {
  console.log('Starting watch task')

  require('./server')

  livereload.listen()

  gulp.watch(SCRIPTS_PATH, ['scripts'])
  // gulp.watch(CSS_PATH, ['styles']) // for css
  gulp.watch(SCSS_PATH, ['styles']) // for scss
  gulp.watch(TEMPLATES_PATH, ['templates'])
})

// ##  Commands  ##

// gulp styles -> starts styles task

// gulp  -> starts default task

// gulp watch -> starts gulp watch task

// npm i -D gulp-babel @babel/core @babel/preset-env
