# Foundation Settings Parser

This is a Gulp task that collects settings variables from Sass files for processing. Right now it does two things:

 - Combines the variables into a single `_settings.scss` file, organized by component, with each variable commented out.
 - Outputs each component's variables as an HTML partial, which can be consumed by Angular or Assemble. This allows us to automatically inject each component's Sass variables into the documentation automatically.

Currently the library is only being used—and is deliberately designed for—[Foundation for Apps](https://github.com/zurb/foundation-apps).

## Usage

### Install

For now the package is not distributed on npm, but it can be installed from GitHub:

```json
{
  "devDependencies": [
    "foundation-settings-parser": "zurb/foundation-settings-parser"
  ]
}
```

### Setup

The parser will check every `.scss` file you hand it for text between two specific delimiters.

```scss
/// @Foundation.settings
// Grid
$total-columns: 12 !default;
$container-width: rem-calc(900) !default;
///
```

The first line is the starting delimiter, and the last line is the ending delimiter. The second line contains the name of the component, which the parser uses to title the section, and build the table of contents.

### Running the Task

The settings parser module exports the entire process as a single function, so you just have to drop it into a Gulp task, along with an array of file paths.

```js
gulp.task('settings', function() {
  // Get extra weird by calling the module without assigning it to a variable!
  return require('foundation-settings-parser')([
    'scss/components/*.scss'
  ]);
});
```