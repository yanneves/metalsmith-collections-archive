'use strict'

const { assign } = require('lodash')

/**
 *  Add archive object to Metalsmith metadata
 *  @param {object} archive Existing archive
 *  @param {object} metadata Metalsmith metadata
 *  @param {object} opts User-defined options
 *  @returns {promise}
 */
module.exports = function addArchiveToMetadata(archive, metadata, opts) {
  if (!opts.metadata) return Promise.resolve(archive)

  // Mutate existing metadata object
  assign(metadata, { archive })

  // Resolve with original archive for chaining
  return Promise.resolve(archive)
}
