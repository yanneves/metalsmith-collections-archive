'use strict'

const { isArray, forEach } = require('lodash')
const moment = require('moment')
const privateData = require('incognito')

/**
 *  Cache dates from sorted files as moment() types
 *  @param {array} sorted Sorted files
 *  @returns {promise}
 */
module.exports = function cacheDates(sorted) {
  if (!isArray(sorted)) throw new Error('Files required to cache dates')
  const format = 'YYYY-MM-DDTHH:mm:ss.SSSZ'
  let cache = {}

  // Create cache for moment() parsers,
  // reduces number of expensive `moment(date)` calls
  privateData(cache).moments = {}

  return new Promise(resolve => {
    forEach(sorted, ({ date }) => {
      privateData(cache).moments[date] = moment(date, format, /* Strict: */ true)
    })

    resolve({ cache, sorted })
  })
}
