const features = require('../../config/features');

module.exports.tests = {};

// test exports
module.exports.tests.interface = function(test, common) {
  test('interface: features', function(t) {
    t.true(typeof features === 'object' && features !== null, 'features is an object');
    t.true('address' in features, 'has address layer');
    t.true('venue' in features, 'has venue layer');
    t.true(Array.isArray(features.address.tags), 'address has tags array');
    t.true(Array.isArray(features.venue.tags), 'venue has tags array');
    t.end();
  });
};

// ensure some tags are excluded from the venue layer
module.exports.tests.blacklist = function(test, common) {
  test('blacklist default venue tags', function(t) {
    // see: https://github.com/pelias/openstreetmap/pull/280
    t.false( features.venue.tags.includes('aeroway+name') );
    t.false( features.venue.tags.includes('aeroway~gate+name') );
    t.false( features.venue.tags.includes('railway+name') );
    t.false( features.venue.tags.includes('railway~rail+name') );
    t.end();
  });
};

// ensure address tags are correct
module.exports.tests.whitelist_address = function(test, common) {
  test('whitelist address tags', function(t) {
    t.true( features.address.tags.includes('addr:housenumber+addr:street') );
    t.false( features.address.tags.includes('amenity+name') );
    t.end();
  });
};

// ensure venue tags are included
module.exports.tests.whitelist_venue_tags = function(test, common) {
  test('whitelist venue tags', function(t) {
    t.true( features.venue.tags.includes('amenity+name') );
    t.true( features.venue.tags.includes('building+name') );
    t.true( features.venue.tags.includes('shop+name') );
    t.true( features.venue.tags.includes('office+name') );
    t.true( features.venue.tags.includes('public_transport+name') );
    t.true( features.venue.tags.includes('cuisine+name') );
    t.true( features.venue.tags.includes('railway~tram_stop+name') );
    t.true( features.venue.tags.includes('railway~station+name') );
    t.true( features.venue.tags.includes('railway~halt+name') );
    t.true( features.venue.tags.includes('railway~subway_entrance+name') );
    t.true( features.venue.tags.includes('railway~train_station_entrance+name') );
    t.true( features.venue.tags.includes('sport+name') );
    t.true( features.venue.tags.includes('natural+name') );
    t.true( features.venue.tags.includes('tourism+name') );
    t.true( features.venue.tags.includes('leisure+name') );
    t.true( features.venue.tags.includes('historic+name') );
    t.true( features.venue.tags.includes('man_made+name') );
    t.true( features.venue.tags.includes('landuse+name') );
    t.true( features.venue.tags.includes('waterway+name') );
    t.true( features.venue.tags.includes('aerialway+name') );
    t.true( features.venue.tags.includes('craft+name') );
    t.true( features.venue.tags.includes('military+name') );
    t.true( features.venue.tags.includes('aeroway~terminal+name') );
    t.true( features.venue.tags.includes('aeroway~aerodrome+name') );
    t.true( features.venue.tags.includes('aeroway~helipad+name') );
    t.true( features.venue.tags.includes('aeroway~airstrip+name') );
    t.true( features.venue.tags.includes('aeroway~heliport+name') );
    t.true( features.venue.tags.includes('aeroway~areodrome+name') );
    t.true( features.venue.tags.includes('aeroway~spaceport+name') );
    t.true( features.venue.tags.includes('aeroway~landing_strip+name') );
    t.true( features.venue.tags.includes('aeroway~airfield+name') );
    t.true( features.venue.tags.includes('aeroway~airport+name') );
    t.true( features.venue.tags.includes('brand+name') );
    t.true( features.venue.tags.includes('healthcare+name') );
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
