var format    = require('util').format;
var repeat    = require('repeat-string');
var multiline = require('multiline');

// Template for table of contents. The first `%s` is the title, and the second `%s` is the border of hyphens that goes underneath it.
// The actual ToC contents are appended to this string.
var titleText = multiline(function() {/*
//  %s
//  %s
//
//  Table of Contents:
//
*/});

/**
 * Builds the table of contents at the top of the settings file.
 * @param {string} title - Title of the settings file.
 * @param {string[]} keys - A list of section names to populate the table of contents.
 * @returns {string} A table of contents.
 */
module.exports = function(title, keys) {
  var output = '';
  var n = 0;

  // Render the title and border under the title
  output += format(titleText, title, repeat('-', title.length));

  // Create a numbered item for each section title
  for (var i in keys) {
    var n = parseInt(i) + 1;
    // Add extra space for short numbers
    var num = n < 10 ? ' '+n : n;

    output += format('\n//  %s. %s', num, keys[i]);
  }

  output += '\n\n';

  return output;
}
