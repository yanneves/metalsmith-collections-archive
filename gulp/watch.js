'use strict'

const gulp = require('gulp')
const lint = require('./lint')
const unit = require('./unit')

module.exports = function watch() {
  const scripts = [
    'lib/**/*.js',
    'test/**/*.js',
    'gulp/**/*.js'
  ]

  gulp.watch(scripts, {
    ignoreInitial: false
  }, gulp.series([ lint, unit ]))

}
