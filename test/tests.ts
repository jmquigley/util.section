'use strict';

import test from 'ava';
import * as path from 'path';
import {Fixture} from 'util.fixture';
import {line, nl, section, Section, word} from '../index';
import {cleanup} from './helpers';

// const debug = require('debug')('section.test');

test.after.always.cb(t => {
	cleanup(path.basename(__filename), t);
});

test('Test section function on data below threshold', t => {
	const fixture = new Fixture('loremIpsum', {
		loremIpsum: {
			count: 5,
			sentenceLowerBound: 10,
			sentenceUpperBound: 20
		}
	});

	t.truthy(fixture);
	t.truthy(fixture.loremIpsum);
	t.true(fixture.loremIpsum.length > 0);

	const text: string = fixture.loremIpsum.slice(0, 100);
	const data: Section = section(text, 0);

	t.is(data.text, text);
	t.is(data.start, 0);
	t.is(data.end, text.length);
});

test('Test section call with bad position parameter', t => {
	const fixture = new Fixture('loremIpsum');

	t.truthy(fixture);
	t.truthy(fixture.loremIpsum);

	t.throws(() => {
		const data: Section = section(fixture.loremIpsum, 999);
		t.fail(JSON.stringify(data));
	});
});

test('Test section call with bad threshold value', t => {
	const fixture = new Fixture('pattern');

	t.truthy(fixture);
	t.truthy(fixture.loremIpsum);

	const data: Section = section(fixture.pattern, 0, -1, -1);

	// 80 width + 1 newline
	t.is(data.text.length, 81);
	t.is(data.start, 0);
	t.is(data.end, 80);
	t.regex(data.text, /a{80}\n/);
});

test('Test section call with empty text', t => {
	const data: Section = section('', 0, 0, 0);
	t.truthy(data);

	t.is(data.text.length, 0);
	t.is(data.text, '');
	t.is(data.start, 0);
	t.is(data.end, 0);
});

test('Test retrieving section from a small dataset', t => {
	const fixture = new Fixture('pattern');

	t.truthy(fixture);
	t.truthy(fixture.pattern);
	t.is(typeof fixture.pattern, 'string');

	const data: Section = section(fixture.pattern, 250, 1);
	t.truthy(data);

	// (3 lines * 80 width) + 3 newlines
	t.is(data.text.length, (3 * 80) + 3);
	t.is(data.start, 162);
	t.is(data.end, 404);
	t.regex(data.text, /c{80}\nd{80}\ne{80}\n/);
});

test('Test retrieving a single line from the current position using section', t => {
	const fixture = new Fixture('pattern');

	t.truthy(fixture);
	t.truthy(fixture.pattern);
	t.is(typeof fixture.pattern, 'string');

	const data: Section = section(fixture.pattern, 250, 0);
	t.truthy(data);

	// 80 width + 1 newline
	t.is(data.text.length, 81);
	t.is(data.start, 243);
	t.is(data.end, 323);
	t.regex(data.text, /d{80}\n/);
});

test('Test retrieving from the first position', t => {
	const fixture = new Fixture('pattern');

	t.truthy(fixture);
	t.truthy(fixture.pattern);
	t.is(typeof fixture.pattern, 'string');

	const data: Section = section(fixture.pattern, 0, 5);
	t.truthy(data);

	// (6 lines * 80 width) + 6 newlines
	t.is(data.text.length, (6 * 80) + 6);
	t.is(data.start, 0);
	t.is(data.end, 485);
	t.regex(data.text, /a{80}\nb{80}\nc{80}\nd{80}\ne{80}\nf{80}\n/);
});

test('Test retrieving from the final position', t => {
	const fixture = new Fixture('pattern');

	t.truthy(fixture);
	t.truthy(fixture.pattern);
	t.is(typeof fixture.pattern, 'string');

	const data: Section = section(fixture.pattern, fixture.pattern.length - 1, 5);
	t.truthy(data);

	// (6 lines * 80 width) + 6 newlines
	t.is(data.text.length, (6 * 80) + 6);
	t.is(data.start, 1620);
	t.is(data.end, 2105);

	t.regex(data.text, /u{80}\nv{80}\nw{80}\nx{80}\ny{80}\nz{80}\n/);
});

test('Test retrieving block when falling on a boundary newline', t => {
	const fixture = new Fixture('pattern');

	t.truthy(fixture);
	t.truthy(fixture.pattern);
	t.is(typeof fixture.pattern, 'string');

	const data: Section = section(fixture.pattern, 80, 0, 0);
	t.truthy(data);

	t.is(data.text.length, 81);
	t.regex(data.text, /a{80}\n/);
	t.is(data.start, 0);
	t.is(data.end, 80);
});

test('Retrieve an arbitrary section from a string that is all newline characters', t => {
	const s: string = '\n\n\n\n\n\n\n\n\n\n';

	// 3rd position, 1 line above below, no threshold
	const data: Section = section(s, 2, 1, 0);
	t.truthy(data);

	t.is(data.text.length, 4);
	t.regex(data.text, /\n{4}/);
	t.is(data.start, 0);
	t.is(data.end, 3);
});

test('Retrieve the end section from a string that is all newline characters', t => {
	const s: string = '\n\n\n\n\n\n\n\n\n\n';

	// last position, 1 line above below, no threshold
	const data: Section = section(s, 9, 1, 0);
	t.truthy(data);

	t.is(data.text.length, 3);
	t.regex(data.text, /\n{3}/);
	t.is(data.start, 7);
	t.is(data.end, 9);
});

test('Retrieve the front section from a string that is all newline characters', t => {
	const s: string = '\n\n\n\n\n\n\n\n\n\n';

	// last position, 1 line above below, no threshold
	const data: Section = section(s, 0, 1, 0);
	t.truthy(data);

	t.is(data.text.length, 3);
	t.regex(data.text, /\n{3}/);
	t.is(data.start, 0);
	t.is(data.end, 2);
});

test('Tests the retrieval of a single line from a text block', t => {
	const fixture = new Fixture('pattern');

	t.truthy(fixture);
	t.truthy(fixture.pattern);
	t.is(typeof fixture.pattern, 'string');

	const data: Section = line(fixture.pattern, 180);
	t.truthy(data);

	t.is(data.text.length, 81);
	t.regex(data.text, /c{80}\n/);
	t.is(data.start, 162);
	t.is(data.end, 242);
});

test('Test the retrieval of a single line from the front of a text block', t => {
	const fixture = new Fixture('pattern');

	t.truthy(fixture);
	t.truthy(fixture.pattern);
	t.is(typeof fixture.pattern, 'string');

	const data: Section = line(fixture.pattern, 0);
	t.truthy(data);

	t.is(data.text.length, 81);
	t.regex(data.text, /a{80}\n/);
	t.is(data.start, 0);
	t.is(data.end, 80);
});

test('Test the retrieval of a single line from the end of a text block', t => {
	const fixture = new Fixture('pattern');

	t.truthy(fixture);
	t.truthy(fixture.pattern);
	t.is(typeof fixture.pattern, 'string');

	const data: Section = line(fixture.pattern, fixture.pattern.length - 1);
	t.truthy(data);

	t.is(data.text.length, 81);
	t.regex(data.text, /z{80}\n/);
	t.is(data.start, 2025);
	t.is(data.end, 2105);
});

test('Test line retrieval when the lines are a series of newline characters', t => {
	const s: string = '\n\n\n\n\n\n\n\n\n\n';
	const data: Section = line(s, 2);

	t.truthy(data);

	t.is(data.text.length, 1);
	t.is(data.text, nl);
	t.is(data.start, 2);
	t.is(data.end, 2);
});

test('Test the retrieval of a word from a text block', t => {
	const s: string = 'The quick brown fox jumps over the lazy dog';

	const data: Section = word(s, 6);
	t.truthy(data);

	t.is(data.text.length, 5);
	t.is(data.text, 'quick');
	t.is(data.start, 4);
	t.is(data.end, 8);
});

test('Test the retrieval of a word from an empty text block', t => {
	const data: Section = word('', 0);
	t.truthy(data);

	t.is(data.text.length, 0);
	t.is(data.text, '');
	t.is(data.start, 0);
	t.is(data.end, 0);
});

test('Test retrieval of a word with a bad position index', t => {
	const s: string = 'The quick brown fox jumps over the lazy dog';
	const data: Section = word(s, -1);
	t.truthy(data);

	t.is(data.text.length, 0);
	t.is(data.text, '');
	t.is(data.start, 0);
	t.is(data.end, 0);
});

test('Test retrieval of a word on a boundary (whitespace)', t => {
	const s: string = 'The quick brown fox jumps over the lazy dog';
	const data: Section = word(s, 3);
	t.truthy(data);

	t.is(data.text.length, 0);
	t.is(data.text, '');
	t.is(data.start, 3);
	t.is(data.end, 3);
});

test('Test retrieval of a word on a tab boundary (whitespace)', t => {
	const s: string = 'The	quick brown fox jumps over the lazy dog';
	const data: Section = word(s, 3);
	t.truthy(data);

	t.is(data.text.length, 0);
	t.is(data.text, '');
	t.is(data.start, 3);
	t.is(data.end, 3);
});

test('Test retrieval of a word from the first position', t => {
	const s: string = 'The quick brown fox jumps over the lazy dog';
	const data: Section = word(s, 0);
	t.truthy(data);

	t.is(data.text.length, 3);
	t.is(data.text, 'The');
	t.is(data.start, 0);
	t.is(data.end, 2);
});

test('Test retrieval of a word from the last position', t => {
	const s: string = 'The quick brown fox jumps over the lazy dog';
	const data: Section = word(s, s.length - 1);
	t.truthy(data);

	t.is(data.text.length, 3);
	t.is(data.text, 'dog');
	t.is(data.start, 40);
	t.is(data.end, 42);
});

test('Test word retrieval past the end of the line', t => {
	const s: string = 'abcdef';
	const data: Section = word(s, 7);
	t.truthy(data);

	t.is(data.text.length, 0);
	t.is(data.text, '');
	t.is(data.start, 6);
	t.is(data.end, 6);
});
