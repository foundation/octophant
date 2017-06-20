/* eslint-env mocha */
/* eslint-disable no-multiple-empty-lines */

'use strict';

const fs = require('fs');
const expect = require('chai').expect;
const stripIndent = require('strip-indent');
const tempy = require('tempy');
const values = require('lodash.values');
const octophant = require('..');
const buildContents = require('../lib/build-contents');
const buildImports = require('../lib/build-imports');
const buildSection = require('../lib/build-section');
const processSassDoc = require('../lib/process-sassdoc');

const PATHS = './test/fixtures/*.scss';
const GROUPS = {
  one: 'Component One',
  two: 'Component Two',
  three: 'Component Three'
};

const strip = str => stripIndent(str).replace(/^\n/, '');

describe('Octophant', () => {
  it('Generates a settings file out of a set of Sass files', done => {
    const outputFile = tempy.file();

    octophant(PATHS, {
      title: 'Test Settings',
      output: outputFile,
      groups: GROUPS
    }, () => {
      expect(fs.existsSync(outputFile)).to.equal(true);
      done();
    });
  });

  describe('buildContents()', () => {
    it('builds a table of contents for a settings file', () => {
      const actual = buildContents('Title', ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten']);

      const expected = strip(`
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

`);

      expect(actual).to.equal(expected);
    });
  });

  describe('buildImports()', () => {
    it('builds a set of Sass import statements', () => {
      const actual = buildImports(['one', 'two']);

      const expected = strip(`
        @import 'one';
        @import 'two';


`);

      expect(actual).to.equal(expected);
    });
  });

  describe('buildSection()', () => {
    it('builds a section for a component\'s variables', () => {
      const actual = buildSection('Component One', 1, [{
        context: {
          name: 'variable-one',
          value: 'value'
        }
      }, {
        context: {
          name: 'variable-two',
          value: 'value'
        }
      }]);

      const expected = strip(`
        // 1. Component One
        // ----------------

        $variable-one: value;
        $variable-two: value;

`);

      expect(actual).to.equal(expected);
    });

    it('builds a section with a Foundation-specific shim', () => {
      const actual = buildSection('Global', 1, [{
        context: {
          name: 'variable-one',
          value: 'value'
        }
      }], true);

      const expected = strip(`
        // 1. Global
        // ---------

        $variable-one: value;

        @include add-foundation-colors;
`);

      expect(actual).to.equal(expected);
    });
  });

  describe('buildVariable()', () => {
    it('formats a single-line a Sass variable', () => {
      const actual = require('../lib/build-variable')({
        context: {
          name: 'name',
          value: 'value'
        }
      });

      const expected = '$name: value;\n';

      expect(actual).to.equal(expected);
    });

    it('formats a multi-line Sass variable', () => {
      const actual = require('../lib/build-variable')({
        context: {
          name: 'name',
          value: '(\n  one: one,\n  two: two,\n)'
        }
      });

      const expected = strip(`
        $name: (
          one: one,
          two: two,
        );
`);

      expect(actual).to.equal(expected);
    });
  });

  describe('processSassDoc()', () => {
    it('filters and sorts a series of SassDoc items', function (done) {
      this.timeout(10000);

      require('sassdoc').parse(PATHS).then(data => {
        const groupNames = values(GROUPS);
        data = processSassDoc(data, GROUPS, []);

        expect(Object.keys(data)).to.eql(groupNames.slice(0, -1));
        done();
      });
    });
  });
});
