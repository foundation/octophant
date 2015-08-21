var assert = require('assert');
var settingsParser = require('../index');

describe('Octophant', function() {
  it('Generates a settings file out of a set of Sass files', function(cb) {
    settingsParser('./test/*.scss', {
      title: "Test Settings",
      output: './test/_settings.scss',
      groups: {
        one: 'Component One',
        two: 'Component Two',
        three: 'Component Three'
      }
    }, cb);
  });
});
