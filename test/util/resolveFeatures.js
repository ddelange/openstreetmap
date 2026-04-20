'use strict';

const resolveFeatures = require('../../util/resolveFeatures');
const defaults = require('../../config/features');

module.exports.tests = {};

module.exports.tests.defaults = function(test, common) {
  test('returns defaults when no osm config present', function(t) {
    const result = resolveFeatures({});
    t.deepEqual(result.addressTags, defaults.addressTags, 'default addressTags');
    t.deepEqual(result.layers, defaults.layers, 'default layers');
    t.end();
  });

  test('returns defaults when settings is null', function(t) {
    const result = resolveFeatures(null);
    t.deepEqual(result.addressTags, defaults.addressTags, 'default addressTags');
    t.deepEqual(result.layers, defaults.layers, 'default layers');
    t.end();
  });
};

module.exports.tests.override_addressTags = function(test, common) {
  test('addressTags from pelias.json overrides defaults', function(t) {
    const customTags = ['addr:housenumber+addr:street'];
    const settings = { imports: { openstreetmap: { addressTags: customTags } } };
    const result = resolveFeatures(settings);
    t.deepEqual(result.addressTags, customTags, 'custom addressTags used');
    t.deepEqual(result.layers, defaults.layers, 'layers still default');
    t.end();
  });
};

module.exports.tests.override_layers = function(test, common) {
  test('layers from pelias.json overrides defaults', function(t) {
    const customLayers = {
      venue: { tags: ['amenity+name'] },
      protected_area: { tags: ['boundary~protected_area+name'] }
    };
    const settings = { imports: { openstreetmap: { layers: customLayers } } };
    const result = resolveFeatures(settings);
    t.deepEqual(result.layers, customLayers, 'custom layers used');
    t.deepEqual(result.addressTags, defaults.addressTags, 'addressTags still default');
    t.end();
  });

  test('both addressTags and layers can be overridden together', function(t) {
    const customTags = ['addr:housenumber+addr:street'];
    const customLayers = { venue: { tags: ['amenity+name'] } };
    const settings = { imports: { openstreetmap: { addressTags: customTags, layers: customLayers } } };
    const result = resolveFeatures(settings);
    t.deepEqual(result.addressTags, customTags, 'custom addressTags used');
    t.deepEqual(result.layers, customLayers, 'custom layers used');
    t.end();
  });
};

module.exports.all = function(tape, common) {
  function test(name, testFunction) {
    return tape('resolveFeatures: ' + name, testFunction);
  }

  for (var testCase in module.exports.tests) {
    module.exports.tests[testCase](test, common);
  }
};
