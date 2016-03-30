var assert     = require('assert');
var fs         = require('fs');
var multiline  = require('multiline');
var octophant  = require('../index');

var PATHS = './test/fixtures/*.scss';
var SETTINGS_PATH = './test/_settings.scss';

var GROUPS = {
  one: 'Component One',
  two: 'Component Two',
  three: 'Component Three'
}

var GROUP_NAMES = [
  'Component One',
  'Component Two',
  'Component Three'
]

describe('Octophant', function(done) {
  // Delete the _settings.scss file if one already exists
  before(function(done) {
    fs.exists(SETTINGS_PATH, function(exists) {
      if (exists) fs.unlink(SETTINGS_PATH, done);
      else done();
    });
  });

  // Delete the _settings.scss file created when tests are done
  after(function(done) {
    fs.unlink(SETTINGS_PATH, done);
  });

  it('Generates a settings file out of a set of Sass files', function(done) {
    octophant(PATHS, {
      title: "Test Settings",
      output: SETTINGS_PATH,
      groups: GROUPS
    }, function() {
      assert(fs.existsSync(SETTINGS_PATH));
      done();
    });
  });

  describe('buildContents', function() {
    it('builds a table of contents for a settings file', function() {
      var actual = require('../lib/buildContents.js')('Title', ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten']);

      var expected = multiline.stripIndent(function() {/*
        //  Title
        //  -----
        //
        //  Table of Contents:
        //
        //   1. One
        //   2. Two
        //   3. Three
        //   4. Four
        //   5. Five
        //   6. Six
        //   7. Seven
        //   8. Eight
        //   9. Nine
        //  10. Ten


      */});

      assert.equal(expected, actual)
    });
  });

  describe('buildImports', function() {
    it('builds a set of Sass import statements', function() {
      var actual = require('../lib/buildImports')(['one', 'two']);

      var expected = multiline.stripIndent(function() {/*
        @import 'one';
        @import 'two';


      */});

      assert.equal(expected, actual);
    });
  })

  describe('buildSection', function() {
    it('builds a section for a component\'s variables', function() {
      var actual = require('../lib/buildSection')('Component One', 1, [{
        context: { name: 'variable-one', value: 'value' }
      }, {
        context: { name: 'variable-two', value: 'value' }
      }]);

      var expected = multiline.stripIndent(function() {/*
        // 1. Component One
        // ----------------

        $variable-one: value;
        $variable-two: value;


      */});

      assert.equal(expected, actual);
    });

    it('builds a section with a Foundation-specific shim', function() {
      var actual = require('../lib/buildSection')('Global Styles', 1, [{
        context: { name: 'variable-one', value: 'value' }
      }], true);

      var expected = multiline.stripIndent(function() {/*
        // 1. Global Styles
        // ----------------

        $variable-one: value;

        @include add-foundation-colors;

      */});

      assert.equal(expected, actual);
    });
  });

  describe('buildVariable', function() {
    it('formats a single-line a Sass variable', function() {
      var actual = require('../lib/buildVariable')({
        context: { name: 'name', value: 'value' }
      });

      var expected = '$name: value;\n';

      assert.equal(expected, actual);
    });

    it('formats a multi-line Sass variable', function() {
      var actual = require('../lib/buildVariable')({
        context: { name: 'name', value: '(\n  one: one,\n  two: two,\n)' }
      });

      var expected = multiline.stripIndent(function() {/*
        $name: (
          one: one,
          two: two,
        );

      */});

      assert.equal(expected, actual);
    });
  });

  describe('processSassDoc', function() {
    it('filters and sorts a series of SassDoc items', function(done) {
      this.timeout(10000);

      require('sassdoc').parse(PATHS).then(function(data) {
        data = require('../lib/processSassDoc')(data, GROUPS, []);

        assert.deepEqual(GROUP_NAMES.slice(0, -1), Object.keys(data));
        done();
      });
    });
  });
});
