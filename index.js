'use strict';

const fs = require('fs');
const path = require('path');
const extend = require('util')._extend;
const sassdoc = require('sassdoc');
const buildContents = require('./lib/build-contents');
const buildImports = require('./lib/build-imports');
const buildSection = require('./lib/build-section');
const processSassDoc = require('./lib/process-sassdoc');

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
module.exports = (files, options, cb) => {
  options = extend({
    title: 'Settings',
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
    const outputPath = path.join(process.cwd(), options.output);
    data = processSassDoc(data, options.groups, options.sort);

    // Erase the existing file if necessary
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }

    // Create a stream to write the settings file to
    const outputStream = fs.createWriteStream(outputPath, {flags: 'w'});

    // Generate the table of contents
    const titleText = buildContents(options.title, Object.keys(data));
    outputStream.write(titleText);

    // Generate the import list
    const importText = buildImports(options.imports);
    outputStream.write(importText);

    // Generate each component section
    for (let i = 0; i < data.length; i++) {
      outputStream.write(buildSection(i, i + 1, data[i], options._foundationShim));
    }

    cb();
  }
};
