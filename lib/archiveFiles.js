'use strict'

const {
  isObject,
  isArray,
  pick,
  pickBy,
  mapValues,
  has,
  filter,
  includes,
  groupBy,
  assign,
  keys,
  some
} = require('lodash')
const privateData = require('incognito')

/**
 *  Archive the years, months, and days defined in files
 *  @param {object} archive Existing archive
 *  @param {array} sorted Sorted files
 *  @param {object} metadata Metalsmith metadata
 *  @param {object} opts User-defined options
 *  @returns {promise}
 */
module.exports = function archiveFiles(archive, sorted, metadata, opts) {
  if (!isObject(archive)) throw new Error('Archive must be defined with at least cached dates')
  if (!isArray(sorted)) throw new Error('Files required to archive years')

  let collections
  if (opts.collections) {

    // Determine which collections to define in archive from options,
    // defaults to all collections
    collections = mapValues(pickCollections(
      metadata.collections, opts.collections
    ), (value, key) => (groupPeriods(archive, filter(sorted, ({ collection }) => {
      return includes(collection, key)
    }))))
  }

  // Resolve with existing archive object with mutation
  return Promise.resolve(assign(archive, collections, groupPeriods(archive, sorted)))
}

/**
 *  Pick collections out of collections object that should be included
 *  @param {object} collections
 *  @param {object} selected
 *  @returns {object}
 */
function pickCollections(collections, selected) {
  if (isObject(selected) && some(selected, Boolean)) {

    // Collections already configured
    collections = assign({}, pick(collections, keys(selected)))
  }

  // Collections not configured, or implied
  return pickBy(mapValues(collections, (collection, key) => {
    return !has(selected, key) || selected[key] !== false
  }))
}

/**
 *  Group files into a flat hierarchy of time periods
 *  @param {object} archive Existing archive
 *  @param {array) files
 *  @returns {object}
 */
function groupPeriods(archive, files) {
  const groupByDateFormat = format => {
    return groupBy(files, ({ date }) => privateData(archive).moments[date].format(format))
  }

  return {
    years: groupByDateFormat('YYYY'),
    months: groupByDateFormat('MMMM YYYY'),
    days: groupByDateFormat('dddd, Do MMMM YYYY')
  }
}
