'use strict'

const { isObject, isArray, filter } = require('lodash')
const privateData = require('incognito')

/**
 *  Filter sorted files to remove invalid dates
 *  @param {object} cache Dates cache
 *  @param {array} sorted Sorted files
 *  @returns {promise}
 */
module.exports = function filterFiles(cache, sorted) {
  if (!isObject(cache)) throw new Error('Cached dates must be defined to filter')
  if (!isArray(sorted)) throw new Error('Files required to filter')

  // Filter sorted files array to only include files with valid dates
  sorted = filter(sorted, ({ date }) => privateData(cache).moments[date].isValid())
  return Promise.resolve({ cache, sorted })
}
