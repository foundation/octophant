var commentVariable = require('./commentVariable');
var format          = require('util').format;
var repeatChar      = require('./repeatChar');

module.exports = function(name, component) {
  var output = '';

  output += format('// %s\n// %s\n\n', name, repeatChar('-', name.length));

  // Iterate through each variable within the component
  for (var i in component) {
    output += commentVariable(component[i]);
  }

  output += '\n';

  return output;
}
