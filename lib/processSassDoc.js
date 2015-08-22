module.exports = function(tree, groups) {
  var sass = {};

  for (var i in tree) {
    var obj = tree[i];
    var group = obj.group[0];
    group = groups[group] || group;

    if (!sass[group]) sass[group] = [];
    if (obj.context.type === 'variable') sass[group].push(obj);
  }

  return sass;
}
