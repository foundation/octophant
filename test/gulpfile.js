var gulp = require('gulp');
var settingsParser = require('../index');

gulp.task('default', function() {
  return settingsParser([
    '_file2.scss',
    '_file1.scss'
  ]);
});