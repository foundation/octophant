# Octophant

Once banished to ZURB's *Creatures of Nightmare* as a freakish outcast, the Octophant has found its calling as a file generator. Nimble and flexible, the Octophant uses its many trunks to gather a framework's many Sass variables, aggregating them into one file.

We make use of the Octophant's talents at ZURB with the [Foundation](http://foundation.zurb.com) family of front-end frameworks, to automatically generate settings files.

To summon the Octophant in your own project, run `npm install octophant`.

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

- `title` (`String`): Title to print at the top of the file.
- `output` (`String`): Path relative to the CWD to output the settings file to.
- `groups` (`Object`): A set of key/value pairs for the sections of the settings file. Each key is a SassDoc group, and the value is an expanded name.

#### cb

**Type:** `Function`

Callback to run when the file has been written to disk.
