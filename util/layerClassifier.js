'use strict';

/**
 * Test a single pbf2json tag condition against an OSM tags object.
 * Supports 'key' (key must exist) or 'key~value' (key must equal value).
 */
function conditionMatchesTags(condition, tags) {
  const tildeIdx = condition.indexOf('~');
  if (tildeIdx === -1) {
    return Object.prototype.hasOwnProperty.call(tags, condition);
  }
  const key = condition.slice(0, tildeIdx);
  const value = condition.slice(tildeIdx + 1);
  return tags[key] === value;
}

/**
 * Test whether a full pbf2json pattern string matches a tags object.
 * Pattern conditions are separated by '+' and all must match (AND logic).
 */
function patternMatchesTags(pattern, tags) {
  return pattern.split('+').every(cond => conditionMatchesTags(cond, tags));
}

/**
 * Classify an OSM tags object against the features config.
 * Iterates layers in declaration order and returns the first matching layer.
 * Falls back to 'venue' if no patterns match.
 *
 * @param {Object} tags     - OSM tags from a pbf2json record
 * @param {Object} features - the features.js keyed-by-layer export
 * @returns {string} layer name
 */
function classify(tags, features) {
  const matchesTags = p => patternMatchesTags(p, tags);
  for (const [layer, config] of Object.entries(features)) {
    if (Array.isArray(config.tags) && config.tags.some(matchesTags)) {
      return layer;
    }
  }
  return 'venue';
}

module.exports = { patternMatchesTags, classify };
