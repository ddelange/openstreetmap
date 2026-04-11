const features = require('../../config/features');

module.exports.tests = {};

module.exports.tests.interface = function(test, common) {
  test('interface: features', function(t) {
    t.true(Array.isArray(features.addressTags), 'has addressTags array');
    t.true(typeof features.layers === 'object' && features.layers !== null, 'has layers object');
    t.true('venue' in features.layers, 'has venue layer');
    t.true(Array.isArray(features.layers.venue.tags), 'venue has tags array');
    t.end();
  });
};

module.exports.tests.addressTags = function(test, common) {
  test('addressTags: includes expected tags', function(t) {
    t.true( features.addressTags.includes('addr:housenumber+addr:street') );
    t.true( features.addressTags.includes('addr:housenumber+addr:place') );
    t.end();
  });
};

// ensure some tags are excluded from the venue layer
module.exports.tests.blacklist = function(test, common) {
  test('blacklist default venue tags', function(t) {
    // see: https://github.com/pelias/openstreetmap/pull/280
    t.false( features.layers.venue.tags.includes('aeroway+name') );
    t.false( features.layers.venue.tags.includes('aeroway~gate+name') );
    t.false( features.layers.venue.tags.includes('railway+name') );
    t.false( features.layers.venue.tags.includes('railway~rail+name') );
    t.end();
  });
};

module.exports.tests.whitelist_venue_tags = function(test, common) {
  test('whitelist venue tags', function(t) {
    t.true( features.layers.venue.tags.includes('amenity+name') );
    t.true( features.layers.venue.tags.includes('building+name') );
    t.true( features.layers.venue.tags.includes('shop+name') );
    t.true( features.layers.venue.tags.includes('office+name') );
    t.true( features.layers.venue.tags.includes('public_transport+name') );
    t.true( features.layers.venue.tags.includes('cuisine+name') );
    t.true( features.layers.venue.tags.includes('railway~tram_stop+name') );
    t.true( features.layers.venue.tags.includes('railway~station+name') );
    t.true( features.layers.venue.tags.includes('railway~halt+name') );
    t.true( features.layers.venue.tags.includes('railway~subway_entrance+name') );
    t.true( features.layers.venue.tags.includes('railway~train_station_entrance+name') );
    t.true( features.layers.venue.tags.includes('sport+name') );
    t.true( features.layers.venue.tags.includes('natural+name') );
    t.true( features.layers.venue.tags.includes('tourism+name') );
    t.true( features.layers.venue.tags.includes('leisure+name') );
    t.true( features.layers.venue.tags.includes('historic+name') );
    t.true( features.layers.venue.tags.includes('man_made+name') );
    t.true( features.layers.venue.tags.includes('landuse+name') );
    t.true( features.layers.venue.tags.includes('waterway+name') );
    t.true( features.layers.venue.tags.includes('aerialway+name') );
    t.true( features.layers.venue.tags.includes('craft+name') );
    t.true( features.layers.venue.tags.includes('military+name') );
    t.true( features.layers.venue.tags.includes('aeroway~terminal+name') );
    t.true( features.layers.venue.tags.includes('aeroway~aerodrome+name') );
    t.true( features.layers.venue.tags.includes('aeroway~helipad+name') );
    t.true( features.layers.venue.tags.includes('aeroway~airstrip+name') );
    t.true( features.layers.venue.tags.includes('aeroway~heliport+name') );
    t.true( features.layers.venue.tags.includes('aeroway~areodrome+name') );
    t.true( features.layers.venue.tags.includes('aeroway~spaceport+name') );
    t.true( features.layers.venue.tags.includes('aeroway~landing_strip+name') );
    t.true( features.layers.venue.tags.includes('aeroway~airfield+name') );
    t.true( features.layers.venue.tags.includes('aeroway~airport+name') );
    t.true( features.layers.venue.tags.includes('brand+name') );
    t.true( features.layers.venue.tags.includes('healthcare+name') );
    t.end();
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('features: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
