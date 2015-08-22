var buildContents  = require('./lib/buildContents');
var buildSection   = require('./lib/buildSection');
var extend         = require('util')._extend;
var fs             = require('fs');
var path           = require('path');
var processSassDoc = require('./lib/processSassDoc');
var sassdoc        = require('sassdoc');

module.exports = function(paths, options, cb) {
  options = extend({
    title:  'Settings',
    output: '_settings.scss',
    groups: {}
  }, options);

  sassdoc.parse(paths).then(parse);

  function parse(data) {
    var outputPath = path.join(process.cwd(), options.output);
    data = processSassDoc(data, options.groups);

    // Erase the existing file if necessary
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }

    var outputStream = fs.createWriteStream(outputPath, {flags: 'w'});

    // Generate the table of contents
    var titleText = buildContents(options.title, Object.keys(data));
    outputStream.write(titleText);

    // Iterate through each component
    for (var i in data) {
      outputStream.write(buildSection(i, data[i]));
    }

    cb();
  }
}
