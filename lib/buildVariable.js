var format = require('util').format;

/**
 * Writes out a variable in the settings file. Most values are written as-is, but maps have special formatting requirements.
 * @param {object} variable - SassDoc variable definition.
 * @returns {string} A formatted variable.
 */
module.exports = function(variable) {
  var output = '';
  var value = variable.context.value.split('\n');

  // Single-line variables
  if (value.length === 1) {
    output += format('$%s: %s;\n', variable.context.name, variable.context.value);
  }
  // Multi-line variables (maps)
  else {
    output += format('$%s: %s;\n', variable.context.name, value.join('\n'));
  }

  return output;
}
