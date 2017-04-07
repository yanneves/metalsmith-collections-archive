'use strict'

const gulp = require('gulp')
const mocha = require('gulp-mocha')

module.exports = function test() {
  const files = 'test/**/*.js'

  return gulp.src(files)
    .pipe(mocha())
}
