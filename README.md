# Foundation Settings Parser

A Node library that collects Sass variables out of many files, and then combines them into one file, grouped by component, with a table of contents at the top. We use it at ZURB with the Foundation family of frameworks, to automatically generate settings files.

## Installation

For now the package is not distributed on npm, but it can be installed from GitHub:

```json
{
  "devDependencies": {
    "foundation-settings-parser": "zurb/foundation-settings-parser"
  }
}
```

## Setup

Variables are parsed using SassDoc, which means any variable you want to be found must be documented with a comment that has three slashes.

```scss
/// This variable will be found by the parser.
$primary-color: blue;

// This one won't.
$private-value: 10px;
```

Variables are grouped by component. The component is defined by the `@group` a variable belongs to. The group can be set on individual variables, or on every variable in a file using a poster comment.

```scss
////
/// @group button
////

/// Button background
$button-background: blue;

/// Button color
$button-color: white;
``` 

## Usage

### parser(files [, options])

Parses a set of files and creates a new SCSS file with all of the collected variables in one place.

#### files

**Type:** `Array`

An array of files to parse.

#### options

**Type:** `Object`

- `title`: Title to print at the top of the file.
- `output`: Relative path to output the settings file to.
