// Settings parser
// This gulp task pulls the variables out of each component's Sass file, and collects them in one settings file.
// Use it like this:
// gulp.task('settings', function() {
//   return require('settings-parser')('scss/**/*.scss');
// });

var concat     = require('gulp-concat')  
var extend     = require('util')._extend;
var format     = require('util').format;
var gulp       = require('gulp');
var gutil      = require('gulp-util');
var ignore     = require('gulp-ignore');
var inject     = require('gulp-inject-string');
var rimraf     = require('rimraf-glob');
var repeatChar = require('./lib/repeatChar');
var rename     = require('gulp-rename');
var map        = require('vinyl-map');
var multiline  = require('multiline');
var path       = require('path');
var order      = require('gulp-order');

var noop = function() {};

var titleText = multiline(function() {/*
//  %s
//  %s
//
//  Table of Contents:
//
*/});

// This function extracts the settings variables from each Sass file it gets.
// In goes an entire Sass file, out goes a file that's just the settings variables.
var parseSettings = function(options) {
  // This counter is used to number each section of the settings file
  var i = 0;

  // The map function is run on each file you pipe to the parser
  return map(function(contents, filename) {
    // Convert the file to a string
    contents = contents.toString().replace(/(?:\r\n)/mg, "\n");

    // Find the variable text
    var re = new RegExp("(?:"+options.start+"\n)((.|\n)*?)(?:\n"+options.end+")", "mg");
    var match = re.exec(contents);
    if (match === null) return '';

    i++;

    // Extract the name of the component and the text (variables) between the comments
    var componentName     = match[1].split('\n')[0].slice(3);
    var componentContents = match[1].split('\n').slice(1).map(function(val) {
      // Keep empty lines how they are
      if (val.length === 0) return val;
      // Keep comment lines how they are
      if (val.indexOf('//') === 0) return val;
      // Add comments to CSS lines and remove the !default expression
      if (options.comment) return ("// "+val).replace(" !default", "");

      return val;
    }).join('\n');

    // Add the name and number of the component to the table of contents
    titleText = titleText + '\n' + format("//  %d.%s%s", i, i > 9 ? ' ' : '  ', componentName);

    var output = multiline.stripIndent(function() {/*
      // %d. %s
      // - - - - - - - - - - - - - - -

      %s
    */});

    output = format(output, i, componentName, componentContents, "\n");

    return output;
  });
};

module.exports = function(paths, options) {
  // The plugin must be called with a string or array of globs
  if (typeof paths === 'undefined') {
    var err = new gutil.PluginError('foundation-settings-parser', {
      message: 'you need to specify paths for the plugin to parse.'
    });
  }

  options = extend({
    title:        "SETTINGS",
    start:        "\/\/\/ @Foundation.settings",
    end:          "\/\/\/",
    comment:      true,
    partialsPath: 'build/partials/scss',
    settingsPath: 'scss'
  }, options);

  // Erase the existing files
  rimraf(path.join(options.settingsPath, '_settings.scss'), noop);

  // Format title text with custom title
  titleText = format(titleText, options.title, repeatChar('-', options.title.length));

  return gulp.src(paths)
    // Parse the settings from each file
    .pipe(parseSettings(options))
    // Ignore files that came up empty
    .pipe(ignore.exclude(function(file) {
      return file.contents.length === 0;
    }))
    // Combine the clusters of variables into one file
    .pipe(concat('_settings.scss'))
    // Insert the title text and table of contents at the beginning of the file
    .pipe(map(function(contents, filename) {
      return titleText + '\n\n@import "helpers/functions";\n\n' + contents.toString();
    }))
    // Output to destination folder
    .pipe(gulp.dest(options.settingsPath));
}
