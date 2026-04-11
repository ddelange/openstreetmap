'use strict';

/**
 * When importVenues is false, drop any record that is not in the address layer.
 * This prevents named POIs that also have address tags from leaking through as
 * venue records when venue import is disabled.
 *
 * Note: the preferred way to control which layers are imported is now to set
 * `imports.openstreetmap.layers` in pelias.json. Setting `importVenues: false`
 * is equivalent to `layers: {}` and is retained for backward compatibility.
 */

const through = require('through2');
const settings = require('pelias-config').generate(require('../schema'));

module.exports = function() {
  const importVenues = settings.imports.openstreetmap.import[0].importVenues;

  // passthrough when venues are enabled (default)
  if (importVenues !== false) {
    return through.obj();
  }

  return through.obj(function(doc, enc, next) {
    if (doc.getLayer() === 'address') {
      this.push(doc);
    }
    next();
  });
};
