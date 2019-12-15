# util.section

> Retrieves a substring block delimited by a newline from a larger string

[![build](https://github.com/jmquigley/util.section/workflows/build/badge.svg)](https://github.com/jmquigley/util.section/actions)
[![analysis](https://img.shields.io/badge/analysis-tslint-9cf.svg)](https://palantir.github.io/tslint/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![testing](https://img.shields.io/badge/testing-jest-blue.svg)](https://facebook.github.io/jest/)
[![NPM](https://img.shields.io/npm/v/util.section.svg)](https://www.npmjs.com/package/util.section)


## Installation

This module uses [yarn](https://yarnpkg.com/en/) to manage dependencies and run scripts for development.

To install as an application dependency:
```
$ yarn add --dev util.section
```

To build the app and run all tests:
```
$ yarn run all
```


## Overview

Retrieves a section/line/word of text from the given input text string using newlines as a delimiter.  It starts at the given position and works forward/backward through the string looking for newline (block/line) or whitespace (word) characters.  The search limit for the number of lines in each direction is set by the `lines` parameter.  When the number of newlines in a direction are found then the start/end position offsets from the text buffer are computed.  e.g.

```
aaaaa
bbbbb
ccccc
ddddd
eeeee
fffff
ggggg
hhhhh
```

Starting at position 18 (first letter 'd'), find one line above and one line below would yield a buffer:

```
ccccc\nddddd\neeeee\n
```

the start offset is `12` and the end offset is `29`


## Usage

The api contains three functions:

- [section](docs/index.md#section)
- [line](docs/index.md#line)
- [word](docs/index.md#word)

#### Retrieve a section

```javascript
import {section, Section} from 'util.section';

let text: string = '...'; // some big string
let data: Section = section(text, 0, 30, 250);

// data {
//     start: ##,
//     end: ##,
//     data: substring
// }
```

This call will take the text string (parameter 1) from position/cursor 0 (second parameter), and attempts to retrieve 30 lines above and below this cursor position (third parameter).  The fourth parameter is a threshold of 250 characters.  If the given text string is less than this threshold, then the whole string is returned (and no section is parsed).

#### Retrieve a line

```javascript
import {section, Section} from 'util.section';

let text: string = '...'; // some big string
let data: Section = section(text, 0, 0);
```

This call will retrieve the current, first line (from the front/first character in the line to the last newline).  The module also contains a routine that wraps this call named `line`.

```javascript
import {line, Section} from 'util.section';

let text: string = '...'; // some big string
let data: Section = line(text, 0);
```

The first parameter is the text string (like section) and the second is the position wtihin this string to start the search.

#### Retrieve a word

```javascript
import {word, Section} from 'util.section';

let text: string = '...'; // some big string
let data: Section = word(test, 0);
```

This call will retrieve the current word at the given cursor location.  A word is considered any character value surrounded by white space.  Whitespace is defined by the [Javascript RegExp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) `\s` option (for a single whitespace character).  e.g.

`The quick brown fox jumps over the lazy dog`

Retrieving the word at position `6` (zero indexed, the "i" in quick) would search left and right through the string from the start position to find the first whitespace character.  This search would result in finding the word "quick".

```javascript
import {word, Section} from 'util.section';

let text: string = 'The quick brown fox jumps over the lazy dog';
let data: Section = word(test, 6);

// data.text = 'quick'
// data.start = 4
// data.end = 8
```
