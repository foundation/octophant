var buildVariable = require('./buildVariable');
var format        = require('util').format;
var repeat        = require('repeat-string');

/**
 * Builds a complete section of the settings file, which includes a title area, and a list of variables.
 * @param {string} name - The title of the section.
 * @param {integer} num - The number of the section, which is added before the title text.
 * @param {object[]} component - A set of SassDoc variable definitions, which contain info about each variable's name and value.
 * @param {boolean} shim - If `true`, a reference to the mixin `add-foundation-colors()` is added in the "Global Stlyes" section. This is needed for the Foundation for Sites settings file to work correctly.
 * @returns {string} A formatted section.
 */
module.exports = function(name, num, component, shim) {
  var output = '';
  var title = format('%d. %s', num, name);

  output += format('// %s\n// %s\n\n', title, repeat('-', title.length));

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
