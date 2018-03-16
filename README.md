# metalsmith-collections-archive [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
Generate archive metadata and directories for Metalsmith collections.

## Features

- adds archive data to metadata
- creates archive directory combining all collections
- creates individual archive directories for each collection
- the above can be toggled off based on your needs
- produces time-specific paths on your site to improve search indexing
- plugin uses caching internally to optimise performance and not slow down your build
- ignores files with invalid dates

## Installation

```bash
$ npm install --save-dev metalsmith-collections-archive
```

## Usage

### Configure your build

```javascript
import collections from 'metalsmith-collections'
import archiveCollections from 'metalsmith-collections-archive'
import layouts from 'metalsmith-layouts'

metalsmith
  .use(collections())
  .use(archiveCollections({
    layout: 'path/to/layouts/layout.html'
  }))
  .use(layouts({
    engine: 'handlebars',
    directory: 'path/to/layouts/'
  }))
```

Exclude archive object in metadata

```javascript
metalsmith.use(archiveCollections({
  layout: 'path/to/layouts/layout.html',
  metadata: false
}))
```

Exclude root-level archive directories

```javascript
metalsmith.use(archiveCollections({
  layout: 'path/to/layouts/layout.html',
  rootLevel: false
}))
```

Exclude collections archive directories

```javascript
metalsmith.use(archiveCollections({
  layout: 'path/to/layouts/layout.html',
  collections: false
}))
```

Only include specific collections

```javascript
metalsmith.use(archiveCollections({
  layout: 'path/to/layouts/layout.html',
  collections: {
    news: true
  }
}))
```

Exclude specific collections

```javascript
metalsmith.use(archiveCollections({
  layout: 'path/to/layouts/layout.html',
  collections: {
    events: false,
    social: false
  }
}))
```

### Example layout

```html
<!-- archive.hbs -->

<article>
  {{#if children}}
    <section>
      <ul>
        {{#each children}}
          <li><a href="/{{ path }}" title="{{ title }}">{{ title }}</li>
        {{/each}}
      </ul>
    </section>
  {{/if}}
  <section>
    {{#unless children}}
      <h2>{{ title }}</h2>
    {{/unless}}
    <ul>
      {{#each posts}}
        <li><a href="/{{ path }}" title="{{ title }}">{{ title }}</li>
      {{/each}}
    </ul>
  </section>
</article>
```

## Combine with a sitemap plugin (recommended!)

```javascript
import collections from 'metalsmith-collections'
import archiveCollections from 'metalsmith-collections-archive'
import layouts from 'metalsmith-layouts'
import sitemap from 'metalsmith-mapsite'

metalsmith
  .use(collections())
  .use(archiveCollections({
    layout: 'path/to/layouts/layout.html'
  }))
  .use(layouts({
    engine: 'handlebars',
    directory: 'path/to/layouts/'
  }))
  .use(sitemap('https://example.com'))
```

## CLI Usage

```json
{
  "plugins": {
    "metalsmith-collections-archive": {
      "layout": "path/to/layouts/layout.html"
    }
  }
}
```

## License

MIT License

Copyright (c) 2017 Yann Eves &lt;hello@yanneves.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


[npm-image]: https://badge.fury.io/js/metalsmith-collections-archive.svg
[npm-url]: https://npmjs.org/package/metalsmith-collections-archive
[travis-image]: https://travis-ci.org/yanneves/metalsmith-collections-archive.svg?branch=master
[travis-url]: https://travis-ci.org/yanneves/metalsmith-collections-archive
[daviddm-image]: https://david-dm.org/yanneves/metalsmith-collections-archive.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/yanneves/metalsmith-collections-archive
