'use strict';

const repeat = require('repeat-string');
const buildVariable = require('./build-variable');

/**
 * Builds a complete section of the settings file, which includes a title area, and a list of variables.
 * @param {string} name - The title of the section.
 * @param {integer} num - The number of the section, which is added before the title text.
 * @param {object[]} component - A set of SassDoc variable definitions, which contain info about each variable's name and value.
 * @param {boolean} shim - If `true`, a reference to the mixin `add-foundation-colors()` is added in the "Global Stlyes" section. This is needed for the Foundation for Sites settings file to work correctly.
 * @returns {string} A formatted section.
 */
module.exports = (name, num, component, shim) => {
  let output = '';
  const title = `${num}. ${name}`;

  output += `// ${title}\n// ${repeat('-', title.length)}\n\n`;

  // Iterate through each variable within the component
  for (const i in component) {
    if (Object.prototype.hasOwnProperty.call(component, i)) {
      output += buildVariable(component[i]);
    }
  }

  if (shim && name === 'Global') {
    output += '\n@include add-foundation-colors;';
  }

  output += '\n';

  return output;
};
