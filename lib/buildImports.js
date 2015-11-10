module.exports = function(imports) {
  var output = '';

  imports.map(function(i) {
    output += '@import \''+i+'\';\n';
  });

  output += '\n';

  return output;
}
