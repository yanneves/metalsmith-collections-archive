'use strict'

const { isObject, reverse, sortBy } = require('lodash')

/**
 *  Sort mapped Metalsmith files
 *  @param {object} files Mapped files
 *  @returns {promise}
 */
module.exports = function sortFiles(files) {
  if (!isObject(files)) throw new Error('Files mapped by filename required for sorting')
  return Promise.resolve(reverse(sortBy(files, 'date')))
}
