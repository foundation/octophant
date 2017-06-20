'use strict';

const repeat = require('repeat-string');

const num = n => {
  const int = parseInt(n + 1, 10);
  return int < 10 ? ` ${int}` : int;
};

/**
 * Builds the table of contents at the top of the settings file.
 * @param {string} title - Title of the settings file.
 * @param {string[]} keys - A list of section names to populate the table of contents.
 * @returns {string} A table of contents.
 */
module.exports = (title, keys) => `//  ${title}
//  ${repeat('-', title.length)}
//
//  Table of Contents:
//
${keys.map((k, i) => `//  ${num(i)}. ${k}`).join('\n')}

`;
