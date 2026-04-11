'use strict';

const defaults = require('../config/features');

/**
 * Resolve the effective features config by merging pelias.json overrides
 * with the defaults from config/features.js.
 *
 * If `imports.openstreetmap.layers` is set in pelias.json it fully replaces
 * the default layer set. Same for `addressTags`. This lets operators add
 * custom layers (e.g. protected_area) or restrict which tags are extracted
 * without touching the source code.
 *
 * @param {Object} settings - result of pelias-config generate()
 * @returns {{ addressTags: string[], layers: Object }}
 */
function resolveFeatures(settings) {
  const osmConfig = (settings && settings.imports && settings.imports.openstreetmap) || {};
  return {
    addressTags: osmConfig.addressTags || defaults.addressTags,
    layers:      osmConfig.layers      || defaults.layers
  };
}

module.exports = resolveFeatures;
