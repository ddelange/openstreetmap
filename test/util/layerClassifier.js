'use strict';

const { patternMatchesTags, classify } = require('../../util/layerClassifier');

module.exports.tests = {};

module.exports.tests.patternMatchesTags = function(test, common) {
  test('key existence: matches when key present', function(t) {
    t.true(patternMatchesTags('name', { name: 'foo' }));
    t.end();
  });

  test('key existence: no match when key absent', function(t) {
    t.false(patternMatchesTags('name', {}));
    t.end();
  });

  test('key=value: matches when key equals value', function(t) {
    t.true(patternMatchesTags('railway~station', { railway: 'station' }));
    t.end();
  });

  test('key=value: no match when value differs', function(t) {
    t.false(patternMatchesTags('railway~station', { railway: 'bus_stop' }));
    t.end();
  });

  test('key=value: no match when key absent', function(t) {
    t.false(patternMatchesTags('railway~station', {}));
    t.end();
  });

  test('multi-condition AND: all conditions must match', function(t) {
    t.true(patternMatchesTags('amenity+name', { amenity: 'cafe', name: 'Bean There' }));
    t.end();
  });

  test('multi-condition AND: fails if any condition missing', function(t) {
    t.false(patternMatchesTags('amenity+name', { amenity: 'cafe' }));
    t.end();
  });

  test('three-part pattern with value conditions', function(t) {
    t.true(patternMatchesTags('highway~pedestrian+area~yes+name', {
      highway: 'pedestrian', area: 'yes', name: 'Market Square'
    }));
    t.false(patternMatchesTags('highway~pedestrian+area~yes+name', {
      highway: 'pedestrian', area: 'yes'
    }));
    t.false(patternMatchesTags('highway~pedestrian+area~yes+name', {
      highway: 'pedestrian', name: 'Market Square'
    }));
    t.end();
  });
};

module.exports.tests.classify = function(test, common) {
  // address is not a layer in real features.js; these fakeFeatures test the generic classifier
  const fakeFeatures = {
    venue:   { tags: ['amenity+name', 'leisure+name'] },
    river:   { tags: ['waterway~river+name'] }
  };

  test('classify: matches venue layer', function(t) {
    t.equal(classify({ amenity: 'cafe', name: 'Bean There' }, fakeFeatures), 'venue');
    t.end();
  });

  test('classify: matches custom layer', function(t) {
    t.equal(classify({ waterway: 'river', name: 'Sacramento River' }, fakeFeatures), 'river');
    t.end();
  });

  test('classify: falls back to venue when no match', function(t) {
    t.equal(classify({ foo: 'bar' }, fakeFeatures), 'venue');
    t.end();
  });

  test('classify: falls back to venue for empty tags', function(t) {
    t.equal(classify({}, fakeFeatures), 'venue');
    t.end();
  });

  test('classify: first declared layer wins when multiple match', function(t) {
    // if a record matches both venue and river, venue wins because it is declared first
    const tags = { amenity: 'cafe', name: 'Riverside Cafe', waterway: 'river' };
    t.equal(classify(tags, fakeFeatures), 'venue');
    t.end();
  });

  test('classify: named address-only record falls back to venue (no address layer in real config)', function(t) {
    // in real usage features.layers has no address key; these fall back to venue
    const tags = { 'addr:housenumber': '123', 'addr:street': 'Main St', name: 'Dry Creek Landfill' };
    t.equal(classify(tags, fakeFeatures), 'venue');
    t.end();
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('layerClassifier: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
