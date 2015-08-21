#!/usr/bin/env node

var settingsParser = require('../index');

var files   = ['./test/_file1.scss', './test/_file2.scss', './test/_file3.scss'];
var options = {
  title: "Test Settings",
  settingsPath: './test/_settings.scss',
  groups: {
    one: 'Component One',
    two: 'Component Two',
    three: 'Component Three'
  }
};

settingsParser(files, options);
