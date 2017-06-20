'use strict';

const capitalize = require('capitalize');
const move = require('array-move');

/**
 * Processes the raw output from SassDoc, collecting variables into groups, formatting group names, and applying sorting if necessary.
 * Group names (defined by SassDoc's `@group` annotation) are formatted to be more human-readable. The first letter is capitalzied, and hyphens are converted to spaces. Custom names for groups can also be passed in with the `groups` property.
 * The sections of the settings file are ordered alphabetically by default. This can be overridden with the `sort` parameter, which is an array of group names. You don't have to sort *every* group, however. The ones you skip will be sorted alphabetically below the sorted ones.
 * @param {object[]} tree - Output from SassDoc's `parse()` method.
 * @param {object[]} groups - Special names for groups. Each key is the group's original name, and the value is the name to change it to.
 * @param {string[]} sort - Custom sort order for the settings file.
 */
module.exports = (tree, groups, sort) => {
  // Initial object to use when building component list
  const sass = {};

  // Final object returned which uses user sort order
  const sassSorted = {};

  // List of all groups, used as the basis for sorting
  let groupList = [];

  // List of groups to float to the top
  sort = sort.reverse();

  // Organize variables by group
  for (let i = 0; i < tree.length; i++) {
    const obj = tree[i];
    const group = obj.group[0];

    if (!sass[group]) {
      sass[group] = [];
    }

    if (obj.context.type === 'variable') {
      sass[group].push(obj);
    }
  }

  // Filter out empty groups
  for (const i in sass) {
    if (sass[i].length === 0) {
      delete sass[i];
    }
  }

  // Get a list of all groups
  groupList = Object.keys(sass);

  // Sort groups by user-defined categories
  for (let i = 0; i < sort.length; i++) {
    const index = groupList.indexOf(sort[i]);
    groupList = move(groupList, index, 0);
  }

  // Finally, build a new object with the sorted groups
  for (let i = 0; i < groupList.length; i++) {
    const group = groups[groupList[i]] || capitalize.words(groupList[i].replace('-', ' '));
    sassSorted[group] = sass[groupList[i]];
  }

  return sassSorted;
};
