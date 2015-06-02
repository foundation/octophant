#!/usr/bin/env node

var settingsParser = require('../index');

var files   = ['./test_file1.scss', './test/_file2.scss'];
var options = {
  title: "Test Settings",
  settingsPath: './test/_settings.scss',
  groups: {
    one: 'Component One',
    two: 'Component Two'
  }
};

settingsParser(files, options);
