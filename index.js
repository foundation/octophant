var buildContents  = require('./lib/buildContents');
var buildImports   = require('./lib/buildImports');
var buildSection   = require('./lib/buildSection');
var extend         = require('util')._extend;
var fs             = require('fs');
var path           = require('path');
var processSassDoc = require('./lib/processSassDoc');
var sassdoc        = require('sassdoc');

/**
 * Produces a Sass settings file from a set of Sass files, and writes it to disk.
 * @param {string|string[]} files - Files to parse.
 * @param {object} options - Output configuration.
 * @param {string} options.title - Title of the settings file.
 * @param {string} options.output - File path to write the file to.
 * @param {object} options.groups - Custom names for groups.
 * @param {string[]} options.imports - Sass files to load with `@import`.
 * @param {string[]} options.sort - Custom sort order for component sections.
 * @param {boolean} options._foundationShim - Adds the `@include add-foundation-colors` shim for Foundation for Sites 6.2.
 * @param {function} cb - Function to run when the settings file has been written to disk.
 */
module.exports = function(files, options, cb) {
  options = extend({
    title:  'Settings',
    output: '_settings.scss',
    groups: {},
    imports: [],
    sort: [],
    _foundationShim: false
  }, options);

  if (typeof files === 'string') {
    files = [files];
  }

  sassdoc.parse(files).then(parse);

  function parse(data) {
    var outputPath = path.join(process.cwd(), options.output);
    data = processSassDoc(data, options.groups, options.sort);

    // Erase the existing file if necessary
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }

    // Create a stream to write the settings file to
    var outputStream = fs.createWriteStream(outputPath, {flags: 'w'});

    // Generate the table of contents
    var titleText = buildContents(options.title, Object.keys(data));
    outputStream.write(titleText);

    // Generate the import list
    var importText = buildImports(options.imports);
    outputStream.write(importText);

    // Generate each component section
    var n = 1;
    for (var i in data) {
      outputStream.write(buildSection(i, n, data[i], options._foundationShim));
      n++;
    }

    cb();
  }
}
