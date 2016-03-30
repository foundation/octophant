var buildVariable = require('./buildVariable');
var format        = require('util').format;
var repeatChar    = require('./repeatChar');

module.exports = function(name, num, component, shim) {
  var output = '';
  var title = format('%d. %s', num, name);

  output += format('// %s\n// %s\n\n', title, repeatChar('-', title.length));

  // Iterate through each variable within the component
  for (var i in component) {
    output += buildVariable(component[i]);
  }

  if (shim && name == 'Global Styles') {
    output += '\n@include add-foundation-colors;';
  }

  output += '\n';

  return output;
}
