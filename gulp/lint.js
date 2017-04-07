'use strict'

const gulp = require('gulp')
const eslint = require('gulp-eslint')
const jscs = require('gulp-jscs')

module.exports = function lint() {
  const files = [
    'lib/**/*.js',
    'gulp/**/*.js'
  ]

  return gulp.src(files, {
    base: './',
    since: gulp.lastRun(lint)
  })
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(jscs({ fix: true }))
    .pipe(jscs.reporter())
    .pipe(jscs.reporter('fail'))
    .pipe(gulp.dest('.'))
}
