var capitalize = require('capitalize');
var move = require('array-move');

module.exports = function(tree, groups, sort) {
  // Initial object to use when building component list
  var sass = {};

  // Final object returned which uses user sort order
  var sassSorted = {};

  // List of all groups, used as the basis for sorting
  var groupList = [];

  // List of groups to float to the top
  sort = sort.reverse();

  // Organize variables by group
  for (var i in tree) {
    var obj = tree[i];
    var group = obj.group[0];

    if (!sass[group]) sass[group] = [];
    if (obj.context.type === 'variable') sass[group].push(obj);
  }

  // Filter out empty groups
  for (var i in sass) {
    if (sass[i].length === 0) delete sass[i];
  }

  // Get a list of all groups
  groupList = Object.keys(sass);

  // Sort groups by user-defined categories
  for (var i in sort) {
    var index = groupList.indexOf(sort[i]);
    groupList = move(groupList, index, 0);
  }

  // Finally, build a new object with the sorted groups
  for (var i in groupList) {
    var group = groups[groupList[i]] || capitalize.words(groupList[i].replace('-', ' '));
    sassSorted[group] = sass[groupList[i]];
  }

  return sassSorted;
}
