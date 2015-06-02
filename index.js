// Settings parser
// This gulp task pulls the variables out of each component's Sass file, and collects them in one settings file.
// Use it like this:
// gulp.task('settings', function() {
//   return require('settings-parser')('scss/**/*.scss');
// });

var extend     = require('util')._extend;
var format     = require('util').format;
var fs         = require('fs');
var repeatChar = require('./lib/repeatChar');
var multiline  = require('multiline');
var path       = require('path');
var sassdoc    = require('sassdoc');

var titleText = multiline(function() {/*
//  %s
//  %s
//
//  Table of Contents:
//
*/});

module.exports = function(paths, options) {
  // The plugin must be called with a string or array of globs
  if (typeof paths === 'undefined') {
    var err = new gutil.PluginError('foundation-settings-parser', {
      message: 'you need to specify paths for the plugin to parse.'
    });
  }

  options = extend({
    title:  'Settings',
    output: '_settings.scss'
  }, options);

  var groups = {
    'one': 'Component One',
    'two': 'Component Two'
  }

  sassdoc.parse(paths, { verbose: true }).then(parse);

  function parse(data) {
    var outputPath = path.join(process.cwd(), options.settingsPath);
    data = processSassDoc(data);

    // Erase the existing files
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }

    var outputStream = fs.createWriteStream(outputPath, {flags: 'w'});
    var title = groups[options.title] || options.title;

    // Format title text with custom title
    titleText = format(titleText, title, repeatChar('-', title.length));

    // Generate the table of contents
    var n = 1;
    for (var i in data) {
      var c = n < 10 ? ' '+n : n;
      titleText += format('\n//  %s. %s', c, i);
      n++;
    }

    outputStream.write(titleText);
    outputStream.write('\n\n');

    // Iterate through each component
    for (var i in data) {
      var group = data[i];
      var title = groups[i] || i;
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

function processSassDoc(tree) {
  var sass = {};

  for (var i in tree) {
    var obj = tree[i];
    var group = obj.group[0];

    if (!sass[group]) sass[group] = [];
    if (obj.context.type === 'variable') sass[group].push(obj);
  }

  return sass;
}
