var format = require('util').format;

module.exports = function(variable) {
  var output = '';
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

  return output;
}
