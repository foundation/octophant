'use strict';

/**
 * Writes out a variable in the settings file. Most values are written as-is, but maps have special formatting requirements.
 * @param {object} variable - SassDoc variable definition.
 * @returns {string} A formatted variable.
 */
module.exports = variable => {
  let output = '';
  const value = variable.context.value.split('\n');

  if (value.length === 1) {
    // Single-line variables
    output += `$${variable.context.name}: ${variable.context.value};\n`;
  } else {
    // Multi-line variables (maps)
    output += `$${variable.context.name}: ${value.join('\n')};\n`;
  }

  return output;
};
