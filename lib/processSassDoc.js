var capitalize = require('capitalize');

module.exports = function(tree, groups) {
  var sass = {};

  // Organize variables by group
  for (var i in tree) {
    var obj = tree[i];
    var group = obj.group[0];

    group = groups[group] || capitalize.words(group.replace('-', ' '));

    if (!sass[group]) sass[group] = [];
    if (obj.context.type === 'variable') sass[group].push(obj);
  }

  // Filter out empty groups
  for (var i in sass) {
    if (sass[i].length === 0) delete sass[i];
  }

  return sass;
}
