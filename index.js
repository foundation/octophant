var buildContents  = require('./lib/buildContents');
var buildImports   = require('./lib/buildImports');
var buildSection   = require('./lib/buildSection');
var extend         = require('util')._extend;
var fs             = require('fs');
var path           = require('path');
var processSassDoc = require('./lib/processSassDoc');
var sassdoc        = require('sassdoc');

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

    var outputStream = fs.createWriteStream(outputPath, {flags: 'w'});

    // Generate the table of contents
    var titleText = buildContents(options.title, Object.keys(data));
    outputStream.write(titleText);

    // Generate the import list
    var importText = buildImports(options.imports);
    outputStream.write(importText);

    // Iterate through each component
    var n = 1;
    for (var i in data) {
      outputStream.write(buildSection(i, n, data[i], options._foundationShim));
      n++;
    }

    cb();
  }
}
