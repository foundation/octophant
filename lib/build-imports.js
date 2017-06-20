'use strict';

/**
 * Creates a series of Sass `@import` statements from a series of strings. The output looks like this:
 * ```scss
 * @import 'module1';
 * @import 'module2';
 * @param {string[]} imports - Sass file paths to use.
 * @returns {string} A formatted list of Sass imports.
 */
module.exports = imports => imports.map(i => `@import '${i}';`).join('\n') + '\n\n\n';
