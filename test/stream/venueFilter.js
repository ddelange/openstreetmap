'use strict';

const through = require('through2');
const proxyquire = require('proxyquire');

module.exports.tests = {};

function makeFakeConfig(importVenues) {
  return {
    generate: () => ({
      imports: {
        openstreetmap: {
          import: [{ filename: 'test.pbf', importVenues }]
        }
      }
    })
  };
}

function makeDoc(layer) {
  return { getLayer: () => layer };
}

module.exports.tests.interface = function(test, common) {
  test('interface: factory', function(t) {
    const venueFilter = proxyquire('../../stream/venueFilter', {
      'pelias-config': makeFakeConfig(true)
    });
    t.equal(typeof venueFilter, 'function', 'stream factory');
    t.end();
  });
};

module.exports.tests.importVenues_true = function(test, common) {
  test('importVenues: true passes all records through', function(t) {
    const venueFilter = proxyquire('../../stream/venueFilter', {
      'pelias-config': makeFakeConfig(true)
    });
    const stream = venueFilter();
    const results = [];
    stream.pipe(through.obj((doc, enc, next) => { results.push(doc); next(); }));
    stream.write(makeDoc('venue'));
    stream.write(makeDoc('address'));
    stream.end(() => {
      t.equal(results.length, 2, 'both records passed through');
      t.end();
    });
  });
};

module.exports.tests.importVenues_false = function(test, common) {
  test('importVenues: false drops venue records', function(t) {
    const venueFilter = proxyquire('../../stream/venueFilter', {
      'pelias-config': makeFakeConfig(false)
    });
    const stream = venueFilter();
    const results = [];
    stream.pipe(through.obj((doc, enc, next) => { results.push(doc); next(); }));
    stream.write(makeDoc('venue'));
    stream.write(makeDoc('address'));
    stream.write(makeDoc('venue'));
    stream.end(() => {
      t.equal(results.length, 1, 'only address record passed through');
      t.equal(results[0].getLayer(), 'address', 'correct record kept');
      t.end();
    });
  });

  test('importVenues: false passes custom layer records through', function(t) {
    const venueFilter = proxyquire('../../stream/venueFilter', {
      'pelias-config': makeFakeConfig(false)
    });
    const stream = venueFilter();
    const results = [];
    stream.pipe(through.obj((doc, enc, next) => { results.push(doc); next(); }));
    stream.write(makeDoc('address'));
    stream.write(makeDoc('protected_area'));
    stream.end(() => {
      t.equal(results.length, 1, 'only address passed; custom layers also dropped when venues off');
      t.end();
    });
  });
};

module.exports.all = function(tape, common) {
  function test(name, testFunction) {
    return tape('venueFilter: ' + name, testFunction);
  }
  for (var testCase in module.exports.tests) {
    module.exports.tests[testCase](test, common);
  }
};
