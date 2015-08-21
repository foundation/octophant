#!/usr/bin/env node

var settingsParser = require('../index');

settingsParser('./test/*.scss', {
  title: "Test Settings",
  output: './test/_settings.scss',
  groups: {
    one: 'Component One',
    two: 'Component Two',
    three: 'Component Three'
  }
});
