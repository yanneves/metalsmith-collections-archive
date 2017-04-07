'use strict'

const { map, flatMap, filter, first, omit, assign, keyBy } = require('lodash')
const privateData = require('incognito')

/**
 *  Add archive object to Metalsmith metadata
 *  @param {object} archive Existing archive
 *  @param {object} files Metalsmith files
 *  @param {object} opts User-defined options
 */
module.exports = function addArchiveFilesToBuild(archive, files, opts) {
  const mapFileObjectsWithLayout = mapFileObjects.bind(null, archive, opts.layout)

  return new Promise(resolve => {
    let rootLevelFiles
    if (opts.rootLevel) {

      // Define root-level archive files
      rootLevelFiles = mapFiles(mapFileObjectsWithLayout(archive))
    }

    let collectionsFiles
    if (opts.collections) {

      // Define collections-specific archive files
      let collections = omit(archive, ['years', 'months', 'days'])
      collectionsFiles = mapFiles(flatMap(collections, mapFileObjectsWithLayout))
    }

    // Mutate master files object to add new files
    assign(files, collectionsFiles, rootLevelFiles)

    // Resolve with original archive for chaining
    resolve(archive)
  })
}

/**
 *  Map file objects from values in archive object
 *  @param {object} archive Top-level archive object
 *  @param {string} layout Configured layout template
 *  @param {object}
 *  @param {string} [namespace]
 *  @returns {array}
 */
function mapFileObjects(archive, layout, { years, months, days }, namespace) {
  const fileObjects = flatMap([
    { path: 'YYYY', data: years },
    { path: 'YYYY/MM', data: months },
    { path: 'YYYY/MM/DD', data: days }
  ], ({ path, data }) => map(data, (posts, key) => {
    const filepath = createFilePath(archive, namespace, path, first(posts))
    return createFileObject(filepath, layout, posts, key)
  }))

  // Map file objects to contain circular references
  return map(fileObjects, file => {
    const children = filter(fileObjects, ({ path }) => {
      return RegExp(`^${file.path}/[0-9]+$`).test(path)
    })

    return assign(file, { children })
  })

  /**
   *  Create an individual file object
   *  @param {string} path Path for file
   *  @param {string} layout Configured layout template
   *  @param {array} posts Posts contained in this period
   *  @param {string} title Title for this period
   *  @returns {object}
   */
  function createFileObject(path, layout, posts, title) {
    return {
      path, layout, posts, title,
      contents: ''
    }
  }

  /**
   *  Determine file path using parameters
   *  @param {object} archive Top-level archive object
   *  @param {string} [namespace]
   *  @param {string} path Path template
   *  @param {object} reference Reference file object
   *  @returns {string}
   */
  function createFilePath(archive, namespace, path, reference) {
    return [
      namespace ? `${namespace}/` : '',
      privateData(archive).moments[reference.date].format(path)
    ].join('')
  }
}

/**
 *  Key files as specific filename in mapped object using filepath
 *  @param {array} files
 *  @returns {object}
 */
function mapFiles(files) {
  return keyBy(files, ({ path }) => `${path}/index.html`)
}
