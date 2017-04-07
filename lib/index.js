'use strict'

const sortFiles = require('./sortFiles')
const cacheDates = require('./cacheDates')
const filterFiles = require('./filterFiles')
const archiveFiles = require('./archiveFiles')
const addArchiveToMetadata = require('./addArchiveToMetadata')
const addArchiveFilesToBuild = require('./addArchiveFilesToBuild')
const debug = require('debug')('metalsmith-collections-archive')

module.exports = (opts = {}) => ((files, metalsmith, done) => {
  const metadata = metalsmith.metadata()

  // Parse user-defined options
  opts.metadata = opts.metadata || opts.metadata !== false
  opts.rootLevel = opts.rootLevel || opts.rootLevel !== false
  opts.collections = opts.collections || opts.collections !== false

  if (!opts.layout && (opts.rootLevel && opts.collections)) {
    done(new Error('Layout must be defined for generated archives'))
  }

  // Check options and fire off debug events
  opts.rootLevel && debug('creating root-level archive files')
  opts.collections && debug('creating configured collections archive files')
  opts.metadata && debug('adding archive metadata')

  sortFiles(files, opts)
    .then(sorted => cacheDates(sorted))
    .then(({ cache, sorted }) => filterFiles(cache, sorted))
    .then(({ cache, sorted }) => archiveFiles(cache, sorted, metadata, opts))
    .then(archive => addArchiveToMetadata(archive, metadata, opts))
    .then(archive => addArchiveFilesToBuild(archive, files, opts))
    .then(() => done())
    .catch(done)
})
