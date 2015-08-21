var buildContents  = require('./lib/buildContents');
var extend         = require('util')._extend;
var format         = require('util').format;
var fs             = require('fs');
var path           = require('path');
var processSassDoc = require('./lib/processSassDoc');
var repeatChar     = require('./lib/repeatChar');
var sassdoc        = require('sassdoc');

module.exports = function(paths, options) {
  // The plugin must be called with a string or array of globs
  if (typeof paths !== 'object') {
    throw new Error('You need to specify paths for the plugin to parse.');
  }

  options = extend({
    title:  'Settings',
    output: '_settings.scss',
    groups: {}
  }, options);

  sassdoc.parse(paths, { verbose: false }).then(parse);

  function parse(data) {
    var outputPath = path.join(process.cwd(), options.output);
    data = processSassDoc(data);

    // Erase the existing file if necessary
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }

    var outputStream = fs.createWriteStream(outputPath, {flags: 'w'});

    // Generate the table of contents
    var titleText = buildContents(options.title, Object.keys(data), options.groups);
    outputStream.write(titleText);

    // Iterate through each component
    for (var i in data) {
      var group = data[i];
      var title = options.groups[i] || i;
      outputStream.write(format('// %s\n// %s\n\n', title, repeatChar('-', title.length)));

      // Iterate through each variable within the component
      for (var j in group) {
        var variable = data[i][j];
        var value = variable.context.value.split('\n');

        if (value.length === 1) {
          outputStream.write(format('// $%s: %s;\n', variable.context.name, variable.context.value));
        }
        else {
          value = value.map(function(v, i) {
            if (i === 0) return v;
            return '// ' + v;
          });
          outputStream.write(format('// $%s: %s;\n', variable.context.name, value.join('\n')));
        }
      }

      outputStream.write('\n');
    }
  }
}
