'use strict'

const gulp = require('gulp')
const { lint, unit, watch } = require('./gulp/index')

gulp.task('default', gulp.series([ lint, unit ]))

gulp.task('watch', watch)
