var gulp = require('gulp');
var settingsParser = require('../index');

gulp.task('default', function() {
  var files   = ['_file2.scss', '_file1.scss'];
  var options = {
    title: "Test Settings".toUpperCase(),
    settingsPath: './_settings.scss'
  };

  return settingsParser(files, options);
});