
/**
  Tags stored verbatim in the OSM addendum of every imported record.

  @see stream/addendum_mapper.js
  @see https://github.com/pelias/api/pull/1255
**/

module.exports = [
  'wheelchair',           // Wheelchair accessibility
  'iata',                 // IATA airport codes
  'icao',                 // ICAO airport codes
  'wikidata',             // Wikidata concordance
  'wikipedia',            // Wikipedia concordance
  'operator',             // Operator name
  'brand',                // Brand name
  'website',              // Website URL
  'phone',                // Telephone number
  'opening_hours',        // Opening hours

  // COVID-19
  'opening_hours:covid19',
  'delivery:covid19',
  'safety:mask:covid19',
];
