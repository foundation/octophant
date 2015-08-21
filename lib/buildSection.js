var format     = require('util').format;
var repeatChar = require('./repeatChar');

module.exports = function(name, component) {
  var output = '';

  output += format('// %s\n// %s\n\n', name, repeatChar('-', name.length));

  // Iterate through each variable within the component
  for (var i in component) {
    var variable = component[i];
    var value = variable.context.value.split('\n');

    // Single-line variables
    if (value.length === 1) {
      output += format('// $%s: %s;\n', variable.context.name, variable.context.value);
    }
    // Multi-line variables (maps)
    else {
      value = value.map(function(v, i) {
        if (i === 0) return v;
        return '// ' + v;
      });

      output += format('// $%s: %s;\n', variable.context.name, value.join('\n'));
    }
  }

  output += '\n';

  return output;
}
