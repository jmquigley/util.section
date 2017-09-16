# util.section

> Retrieves a substring block delimited by a newline from a larger string

[![Build Status](https://travis-ci.org/jmquigley/util.section.svg?branch=master)](https://travis-ci.org/jmquigley/util.section)
[![tslint code style](https://img.shields.io/badge/code_style-TSlint-5ed9c7.svg)](https://palantir.github.io/tslint/)
[![Test Runner](https://img.shields.io/badge/testing-ava-blue.svg)](https://github.com/avajs/ava)
[![NPM](https://img.shields.io/npm/v/util.section.svg)](https://www.npmjs.com/package/util.section)
[![Coverage Status](https://coveralls.io/repos/github/jmquigley/util.section/badge.svg?branch=master)](https://coveralls.io/github/jmquigley/util.section?branch=master)


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

Retrieves a section/block of text from the given input text string using newlines as a delimiter.  It starts at the given position and works forward/backward through the string looking for newline characters.  The search threshold for the number of lines in each direction is set by the lines parameter.  When the number of newlines, in a direction are found, then the start/end position offsets from the text buffer are found.  e.g.

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

#### Retrieve a block

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

This call will retrieve the current, first line (from the front/first character in the line to the last newline).
