var format     = require('util').format;
var repeatChar = require('./repeatChar');
var multiline  = require('multiline');

var titleText = multiline(function() {/*
//  %s
//  %s
//
//  Table of Contents:
//
*/});

module.exports = function(title, keys, groups) {
  var output = '';
  var n = 0;

  output += format(titleText, title, repeatChar('-', title.length));

  for (var i in keys) {
    var n = parseInt(i) + 1;
    // Add extra space for short numbers
    var num = n < 10 ? ' '+n : n;
    // Component name
    var title = groups[keys[i]] || keys[i];

    output += format('\n//  %s. %s', num, title);
  }

  output += '\n\n';

  return output;
}
