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

module.exports = function(title, keys) {
  var output = '';
  var n = 0;

  output += format(titleText, title, repeatChar('-', title.length));

  for (var i in keys) {
    var n = parseInt(i) + 1;
    // Add extra space for short numbers
    var num = n < 10 ? ' '+n : n;

    output += format('\n//  %s. %s', num, keys[i]);
  }

  output += '\n\n';

  return output;
}
