'use strict'

const { every, flatMap, values, isArray } = require('lodash')
const metalsmith = require('metalsmith')
const collections = require('metalsmith-collections')

const { expect } = require('chai')
const equal = require('assert-dir-equal')

const { name } = require('../package.json')
const plugin = require('../lib/')

describe(name, () => {
  const fixtures = 'test/fixtures/basic/'

  it('should create archive metadata', done => {
    metalsmith(fixtures)
      .use(collections())
      .use(plugin({ layout: 'archive.html' }))
      .use((files, metalsmith, done) => {
        const { archive } = metalsmith.metadata()

        expect(archive).to.exist

        expect(archive.years).to.be.an('object')
          .and.to.have.keys(['2017', '2016', '2015'])

        expect(archive.months).to.be.an('object')
          .and.to.have.keys(['January 2017', 'January 2016', 'January 2015'])

        expect(archive.days).to.be.an('object')
          .and.to.have.keys([
            'Sunday, 1st January 2017',
            'Friday, 1st January 2016',
            'Thursday, 1st January 2015'
          ])

        // Check all archive periods are defined as arrays
        expect(every(flatMap([
          'years', 'months', 'days'
        ], period => values(archive[period])), isArray)).to.be.true

        done()
      })
      .build(done)
  })

  it('should create root-level archive files', done => {
    metalsmith(fixtures)
      .use(collections())
      .use(plugin({ layout: 'archive.html' }))
      .use((files, metalsmith, done) => {
        expect(files).to.include.keys([
          '2015/index.html',
          '2015/01/index.html',
          '2016/01/01/index.html',
          '2016/index.html',
          '2016/01/index.html',
          '2015/01/01/index.html',
          '2017/index.html',
          '2017/01/index.html',
          '2017/01/01/index.html'
        ])
        done()
      })
      .build(err => {
        if (err) return done(err)
        done()
      })
  })
  it('should assign layout to file', done => {
    const fileToCheck = '2015/index.html'

    metalsmith(fixtures)
      .use(collections())
      .use(plugin({ layout: 'archive.html' }))
      .use((files, metalsmith, done) => {
        expect(files[fileToCheck]).to.have.property('layout', 'archive.html')
        done()
      })
      .build(err => {
        if (err) return done(err)
        done()
      })
  })

  it('should define archive posts in file metadata', done => {
    const fileToCheck = '2015/index.html'

    metalsmith(fixtures)
      .use(collections())
      .use(plugin({ layout: 'archive.html' }))
      .use((files, metalsmith, done) => {
        expect(files[fileToCheck]).to.have.property('posts')
        expect(files[fileToCheck].posts).to.be.an('array')
          .and.to.have.lengthOf(1)

        done()
      })
      .build(err => {
        if (err) return done(err)
        done()
      })
  })

  it.skip('should define archive parent in file metadata', done => {
    const fileToCheck = '2015/01/index.html'

    metalsmith(fixtures)
      .use(collections())
      .use(plugin({ layout: 'archive.html' }))
      .use((files, metalsmith, done) => {
        expect(files[fileToCheck]).to.have.property('parent')
        expect(files[fileToCheck].parent).to.be.an('object')

        done()
      })
      .build(err => {
        if (err) return done(err)
        done()
      })
  })

  it('should define archive children in file metadata', done => {
    const fileToCheck = '2015/index.html'

    metalsmith(fixtures)
      .use(collections())
      .use(plugin({ layout: 'archive.html' }))
      .use((files, metalsmith, done) => {
        expect(files[fileToCheck]).to.have.property('children')
        expect(files[fileToCheck].children).to.be.an('array')
          .and.to.have.lengthOf(1)

        done()
      })
      .build(err => {
        if (err) return done(err)
        done()
      })
  })

  it.skip('should define previous archive sibling in file metadata', done => {
    const fileToCheck = '2016/index.html'

    metalsmith(fixtures)
      .use(collections())
      .use(plugin({ layout: 'archive.html' }))
      .use((files, metalsmith, done) => {
        expect(files[fileToCheck]).to.have.property('previous')
        expect(files[fileToCheck].previous).to.be.an('object')

        done()
      })
      .build(err => {
        if (err) return done(err)
        done()
      })
  })

  it.skip('should define next archive sibling in file metadata', done => {
    const fileToCheck = '2016/index.html'

    metalsmith(fixtures)
      .use(collections())
      .use(plugin({ layout: 'archive.html' }))
      .use((files, metalsmith, done) => {
        expect(files[fileToCheck]).to.have.property('next')
        expect(files[fileToCheck].next).to.be.an('object')

        done()
      })
      .build(err => {
        if (err) return done(err)
        done()
      })
  })

  it('should not define archive parent in top-level file metadata', done => {
    const fileToCheck = '2015/index.html'

    metalsmith(fixtures)
      .use(collections())
      .use(plugin({ layout: 'archive.html' }))
      .use((files, metalsmith, done) => {
        expect(files[fileToCheck]).not.to.have.property('parent')
        done()
      })
      .build(err => {
        if (err) return done(err)
        done()
      })
  })

  it('should not define previous archive sibling in first file metadata', done => {
    const fileToCheck = '2015/index.html'

    metalsmith(fixtures)
      .use(collections())
      .use(plugin({ layout: 'archive.html' }))
      .use((files, metalsmith, done) => {
        expect(files[fileToCheck]).not.to.have.property('previous')
        done()
      })
      .build(err => {
        if (err) return done(err)
        done()
      })
  })

  it('should not define next archive sibling in last file metadata', done => {
    const fileToCheck = '2017/index.html'

    metalsmith(fixtures)
      .use(collections())
      .use(plugin({ layout: 'archive.html' }))
      .use((files, metalsmith, done) => {
        expect(files[fileToCheck]).not.to.have.property('next')
        done()
      })
      .build(err => {
        if (err) return done(err)
        done()
      })
  })

  it('should create collections archive files', done => {
    metalsmith(fixtures)
      .use(collections())
      .use(plugin({ layout: 'archive.html' }))
      .use((files, metalsmith, done) => {
        expect(files).to.include.keys([
          'articles/2015/index.html',
          'articles/2015/01/index.html',
          'articles/2016/01/01/index.html',
          'articles/2016/index.html',
          'articles/2016/01/index.html',
          'articles/2015/01/01/index.html',
          'articles/2017/index.html',
          'articles/2017/01/index.html',
          'articles/2017/01/01/index.html'
        ])
        done()
      })
      .build(err => {
        if (err) return done(err)
        done()
      })
  })

  it('should create expected basic archive', done => {
    metalsmith(fixtures)
      .use(collections())
      .use(plugin({ layout: 'archive.html' }))
      .build(err => {
        if (err) return done(err)
        equal(`${fixtures}build`, `${fixtures}expected`)
        done()
      })
  })

  it('should skip archive metadata when configured to', done => {
    metalsmith(fixtures)
      .use(collections())
      .use(plugin({
        layout: 'archive.html',
        metadata: false
      }))
      .use((files, metalsmith, done) => {
        expect(metalsmith.metadata()).not.to.have.property('archive')
        done()
      })
      .build(done)
  })

  it('should error if no layouts defined', done => {
    metalsmith(fixtures)
      .use(collections())
      .use(plugin())
      .build(err => {
        expect(err).to.exist
        done()
      })
  })

  it('should not error if no layouts defined but archive pages are skipped', done => {
    metalsmith(fixtures)
      .use(collections())
      .use(plugin({
        rootLevel: false,
        collections: false
      }))
      .build(err => {
        expect(err).not.to.exist
        done()
      })
  })

  describe('Multiple collections', () => {
    const fixtures = 'test/fixtures/multiple-collections/'

    it('should create archive metadata for collections', done => {
      metalsmith(fixtures)
        .use(collections())
        .use(plugin({ layout: 'archive.html' }))
        .use((files, metalsmith, done) => {
          const { archive } = metalsmith.metadata()

          expect(archive.news.years).to.be.an('object')
            .and.to.have.keys(['2016'])

          expect(archive.news.months).to.be.an('object')
            .and.to.have.keys(['August 2016', 'June 2016'])

          expect(archive.news.days).to.be.an('object')
            .and.to.have.keys([
              'Monday, 8th August 2016',
              'Saturday, 4th June 2016'
            ])

          expect(archive.events.years).to.be.an('object')
            .and.to.have.keys(['2016'])

          expect(archive.events.months).to.be.an('object')
            .and.to.have.keys(['December 2016', 'August 2016'])

          expect(archive.events.days).to.be.an('object')
            .and.to.have.keys([
              'Monday, 26th December 2016',
              'Sunday, 25th December 2016',
              'Monday, 8th August 2016'
            ])

          expect(archive.studies.years).to.be.an('object')
            .and.to.have.keys(['2017', '2016'])

          expect(archive.studies.months).to.be.an('object')
            .and.to.have.keys(['January 2017', 'December 2016', 'August 2016'])

          expect(archive.studies.days).to.be.an('object')
            .and.to.have.keys([
              'Sunday, 1st January 2017',
              'Saturday, 31st December 2016',
              'Monday, 8th August 2016'
            ])

          // Check all collections archive periods are defined as arrays
          expect(every(flatMap([
            'news', 'events', 'studies'
          ], collection => (flatMap([
            'years', 'months', 'days'
          ], period => values(archive[period])))), isArray)).to.be.true

          done()
        })
        .build(done)
    })

    it('should only create archive metadata for configured collections if any are specified', done => {
      metalsmith(fixtures)
        .use(collections())
        .use(plugin({
          layout: 'archive.html',
          collections: {
            events: true
          }
        }))
        .use((files, metalsmith, done) => {
          const { archive } = metalsmith.metadata()
          expect(archive).to.have.property('events')
            .and.not.to.include.keys(['news', 'studies'])

          done()
        })
        .build(done)
    })

    it('should exclude collections from archive metadata if all configured collections are defined as excluded', done => {
      metalsmith(fixtures)
        .use(collections())
        .use(plugin({
          layout: 'archive.html',
          collections: {
            events: false
          }
        }))
        .use((files, metalsmith, done) => {
          const { archive } = metalsmith.metadata()
          expect(archive).to.include.keys(['news', 'studies'])
            .and.not.to.have.property('events')

          done()
        })
        .build(done)
    })

    it('should create collections archive files for multiple collections', done => {
      metalsmith(fixtures)
        .use(collections())
        .use(plugin({ layout: 'archive.html' }))
        .build(err => {
          if (err) return done(err)
          equal(`${fixtures}build`, `${fixtures}expected`)
          done()
        })
    })

    it('should only use configured collections if any are specified', done => {
      const fixtures = 'test/fixtures/multiple-collections-some-configured/'

      metalsmith(fixtures)
        .use(collections())
        .use(plugin({
          layout: 'archive.html',
          collections: {
            events: true
          }
        }))
        .build(err => {
          if (err) return done(err)
          equal(`${fixtures}build`, `${fixtures}expected`)
          done()
        })
    })

    it('should exclude collections if all configured collections are defined as excluded', done => {
      const fixtures = 'test/fixtures/multiple-collections-some-excluded/'

      metalsmith(fixtures)
        .use(collections())
        .use(plugin({
          layout: 'archive.html',
          collections: {
            events: false
          }
        }))
        .build(err => {
          if (err) return done(err)
          equal(`${fixtures}build`, `${fixtures}expected`)
          done()
        })
    })
  })

  describe('Invalid dates', () => {
    const fixtures = 'test/fixtures/invalid-dates/'

    it('should not include items with invalid dates', done => {
      metalsmith(fixtures)
        .use(collections())
        .use(plugin({ layout: 'archive.html' }))
        .use((files, metalsmith, done) => {
          const { archive } = metalsmith.metadata()
          expect(values(archive.years)).to.have.lengthOf(1)
          done()
        })
        .build(done)
    })

    it('should create expected archive containing invalid dates', done => {
      metalsmith(fixtures)
        .use(collections())
        .use(plugin({ layout: 'archive.html' }))
        .build(err => {
          if (err) return done(err)
          equal(`${fixtures}build`, `${fixtures}expected`)
          done()
        })
    })
  })

  describe('No root level archive', () => {
    const fixtures = 'test/fixtures/no-root-level-dirs/'

    it('should skip archive root-level directories when configured to', done => {
      metalsmith(fixtures)
        .use(collections())
        .use(plugin({
          layout: 'archive.html',
          rootLevel: false
        }))
        .build(err => {
          if (err) return done(err)
          equal(`${fixtures}build`, `${fixtures}expected`)
          done()
        })
    })
  })

  describe('No collection archives', () => {
    const fixtures = 'test/fixtures/no-collections-dirs/'

    it('should skip archive collection directories when configured to', done => {
      metalsmith(fixtures)
        .use(collections())
        .use(plugin({
          layout: 'archive.html',
          collections: false
        }))
        .build(err => {
          if (err) return done(err)
          equal(`${fixtures}build`, `${fixtures}expected`)
          done()
        })
    })
  })

})
