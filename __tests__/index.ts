'use strict';

import * as path from 'path';
import {Fixture} from 'util.fixture';
import {line, nl, section, Section, word} from '../index';
import {cleanup} from './helpers';

// const debug = require('debug')('section.test');

afterAll((done) => {
	cleanup(path.basename(__filename), done);
});

test('Test section function on data below threshold', () => {
	const fixture = new Fixture('loremIpsum', {
		loremIpsum: {
			count: 5,
			sentenceLowerBound: 10,
			sentenceUpperBound: 20
		}
	});

	expect(fixture).toBeDefined();
	expect(fixture.loremIpsum).toBeDefined();
	expect(fixture.loremIpsum.length > 0).toBe(true);

	const text: string = fixture.loremIpsum.slice(0, 100);
	const data: Section = section(text, 0);

	expect(data.text).toBe(text);
	expect(data.start).toBe(0);
	expect(data.end).toBe(text.length);
});

test('Test section call with bad position parameter', () => {
	const fixture = new Fixture('loremIpsum');

	expect(fixture).toBeDefined();
	expect(fixture.loremIpsum).toBeDefined();

	expect(() => {
		const data: Section = section(fixture.loremIpsum, 999);
		JSON.stringify(data);
	}).toThrow();
});

test('Test section call with bad threshold value', () => {
	const fixture = new Fixture('pattern');

	expect(fixture).toBeDefined();
	expect(fixture.loremIpsum).toBeDefined();

	const data: Section = section(fixture.pattern, 0, -1, -1);

	// 80 width + 1 newline
	expect(data.text.length).toBe(81);
	expect(data.start).toBe(0);
	expect(data.end).toBe(80);
	expect(data.text).toMatch(/a{80}\n/);
});

test('Test section call with empty text', () => {
	const data: Section = section('', 0, 0, 0);
	expect(data).toBeDefined();

	expect(data.text.length).toBe(0);
	expect(data.text).toBe('');
	expect(data.start).toBe(0);
	expect(data.end).toBe(0);
	expect(data.multiLine).toBe(false);
});

test('Test retrieving section from a small dataset', () => {
	const fixture = new Fixture('pattern');

	expect(fixture).toBeDefined();
	expect(fixture.pattern).toBeDefined();
	expect(typeof fixture.pattern).toBe('string');

	const data: Section = section(fixture.pattern, 250, 1);
	expect(data).toBeDefined();

	// (3 lines * 80 width) + 3 newlines
	expect(data.text.length).toBe((3 * 80) + 3);
	expect(data.start).toBe(162);
	expect(data.end).toBe(404);
	expect(data.multiLine).toBe(true);
	expect(data.text).toMatch(/c{80}\nd{80}\ne{80}\n/);
});

test('Test retrieving a single line from the current position using section', () => {
	const fixture = new Fixture('pattern');

	expect(fixture).toBeDefined();
	expect(fixture.pattern).toBeDefined();
	expect(typeof fixture.pattern).toBe('string');

	const data: Section = section(fixture.pattern, 250, 0);
	expect(data).toBeDefined();

	// 80 width + 1 newline
	expect(data.text.length).toBe(81);
	expect(data.start).toBe(243);
	expect(data.end).toBe(323);
	expect(data.multiLine).toBe(false);
	expect(data.text).toMatch(/d{80}\n/);
});

test('Test retrieving from the first position', () => {
	const fixture = new Fixture('pattern');

	expect(fixture).toBeDefined();
	expect(fixture.pattern).toBeDefined();
	expect(typeof fixture.pattern).toBe('string');

	const data: Section = section(fixture.pattern, 0, 5);
	expect(data).toBeDefined();

	// (6 lines * 80 width) + 6 newlines
	expect(data.text.length).toBe((6 * 80) + 6);
	expect(data.start).toBe(0);
	expect(data.end).toBe(485);
	expect(data.multiLine).toBe(true);
	expect(data.text).toMatch(/a{80}\nb{80}\nc{80}\nd{80}\ne{80}\nf{80}\n/);
});

test('Test retrieving from the final position', () => {
	const fixture = new Fixture('pattern');

	expect(fixture).toBeDefined();
	expect(fixture.pattern).toBeDefined();
	expect(typeof fixture.pattern).toBe('string');

	const data: Section = section(fixture.pattern, fixture.pattern.length - 1, 5);
	expect(data).toBeDefined();

	// (6 lines * 80 width) + 6 newlines
	expect(data.text.length).toBe((6 * 80) + 6);
	expect(data.start).toBe(1620);
	expect(data.end).toBe(2105);
	expect(data.multiLine).toBe(true);

	expect(data.text).toMatch(/u{80}\nv{80}\nw{80}\nx{80}\ny{80}\nz{80}\n/);
});

test('Test retrieving block when falling on a boundary newline', () => {
	const fixture = new Fixture('pattern');

	expect(fixture).toBeDefined();
	expect(fixture.pattern).toBeDefined();
	expect(typeof fixture.pattern).toBe('string');

	const data: Section = section(fixture.pattern, 80, 0, 0);
	expect(data).toBeDefined();

	expect(data.text.length).toBe(81);
	expect(data.text).toMatch(/a{80}\n/);
	expect(data.start).toBe(0);
	expect(data.end).toBe(80);
	expect(data.multiLine).toBe(false);
});

test('Retrieve an arbitrary section from a string thaexpect all newline characters', () => {
	const s: string = '\n\n\n\n\n\n\n\n\n\n';

	// 3rd position, 1 line above below, no threshold
	const data: Section = section(s, 2, 1, 0);
	expect(data).toBeDefined();

	expect(data.text.length).toBe(4);
	expect(data.text).toMatch(/\n{4}/);
	expect(data.start).toBe(0);
	expect(data.end).toBe(3);
	expect(data.multiLine).toBe(true);
});

test('Retrieve the end section from a string thaexpect all newline characters', () => {
	const s: string = '\n\n\n\n\n\n\n\n\n\n';

	// last position, 1 line above below, no threshold
	const data: Section = section(s, 9, 1, 0);
	expect(data).toBeDefined();

	expect(data.text.length).toBe(3);
	expect(data.text).toMatch(/\n{3}/);
	expect(data.start).toBe(7);
	expect(data.end).toBe(9);
	expect(data.multiLine).toBe(true);
});

test('Retrieve the front section from a string thaexpect all newline characters', () => {
	const s: string = '\n\n\n\n\n\n\n\n\n\n';

	// last position, 1 line above below, no threshold
	const data: Section = section(s, 0, 1, 0);
	expect(data).toBeDefined();

	expect(data.text.length).toBe(3);
	expect(data.text).toMatch(/\n{3}/);
	expect(data.start).toBe(0);
	expect(data.end).toBe(2);
	expect(data.multiLine).toBe(false);
});

test('Tests the retrieval of a single line from a text block', () => {
	const fixture = new Fixture('pattern');

	expect(fixture).toBeDefined();
	expect(fixture.pattern).toBeDefined();
	expect(typeof fixture.pattern).toBe('string');

	const data: Section = line(fixture.pattern, 180);
	expect(data).toBeDefined();

	expect(data.text.length).toBe(81);
	expect(data.text).toMatch(/c{80}\n/);
	expect(data.start).toBe(162);
	expect(data.end).toBe(242);
	expect(data.multiLine).toBe(false);
});

test('Test the retrieval of a single line from the front of a text block', () => {
	const fixture = new Fixture('pattern');

	expect(fixture).toBeDefined();
	expect(fixture.pattern).toBeDefined();
	expect(typeof fixture.pattern).toBe('string');

	const data: Section = line(fixture.pattern, 0);
	expect(data).toBeDefined();

	expect(data.text.length).toBe(81);
	expect(data.text).toMatch(/a{80}\n/);
	expect(data.start).toBe(0);
	expect(data.end).toBe(80);
	expect(data.multiLine).toBe(false);
});

test('Test the retrieval of a single line from the end of a text block', () => {
	const fixture = new Fixture('pattern');

	expect(fixture).toBeDefined();
	expect(fixture.pattern).toBeDefined();
	expect(typeof fixture.pattern).toBe('string');

	const data: Section = line(fixture.pattern, fixture.pattern.length - 1);
	expect(data).toBeDefined();

	expect(data.text.length).toBe(81);
	expect(data.text).toMatch(/z{80}\n/);
	expect(data.start).toBe(2025);
	expect(data.end).toBe(2105);
	expect(data.multiLine).toBe(false);
});

test('Test line retrieval when the lines are a series of newline characters', () => {
	const s: string = '\n\n\n\n\n\n\n\n\n\n';
	const data: Section = line(s, 2);

	expect(data).toBeDefined();

	expect(data.text.length).toBe(1);
	expect(data.text).toBe(nl);
	expect(data.start).toBe(2);
	expect(data.end).toBe(2);
	expect(data.multiLine).toBe(false);
});

test('Test line retrieval with special case newline after text', () => {
	const s: string = '\n\nabc\n\n\n\n\n\n\n\n';
	const data: Section = line(s, 6);

	expect(data).toBeDefined();

	expect(data.text.length).toBe(1);
	expect(data.text).toBe(nl);
	expect(data.start).toBe(6);
	expect(data.end).toBe(6);
	expect(data.multiLine).toBe(false);
});

test('Test the retrieval of a word from a text block', () => {
	const s: string = 'The quick brown fox jumps over the lazy dog';

	const data: Section = word(s, 6);
	expect(data).toBeDefined();

	expect(data.text.length).toBe(5);
	expect(data.text).toBe('quick');
	expect(data.start).toBe(4);
	expect(data.end).toBe(8);
	expect(data.multiLine).toBe(false);
});

test('Test the retrieval of a word from an empty text block', () => {
	const data: Section = word('', 0);
	expect(data).toBeDefined();

	expect(data.text.length).toBe(0);
	expect(data.text).toBe('');
	expect(data.start).toBe(0);
	expect(data.end).toBe(0);
	expect(data.multiLine).toBe(false);
});

test('Test retrieval of a word with a bad position index', () => {
	const s: string = 'The quick brown fox jumps over the lazy dog';
	const data: Section = word(s, -1);
	expect(data).toBeDefined();

	expect(data.text.length).toBe(0);
	expect(data.text).toBe('');
	expect(data.start).toBe(0);
	expect(data.end).toBe(0);
	expect(data.multiLine).toBe(false);
});

test('Test retrieval of a word on a boundary (whitespace)', () => {
	const s: string = 'The quick brown fox jumps over the lazy dog';
	const data: Section = word(s, 3);
	expect(data).toBeDefined();

	expect(data.text.length).toBe(0);
	expect(data.text).toBe('');
	expect(data.start).toBe(3);
	expect(data.end).toBe(3);
	expect(data.multiLine).toBe(false);
});

test('Test retrieval of a word on a tab boundary (whitespace)', () => {
	const s: string = 'The	quick brown fox jumps over the lazy dog';
	const data: Section = word(s, 3);
	expect(data).toBeDefined();

	expect(data.text.length).toBe(0);
	expect(data.text).toBe('');
	expect(data.start).toBe(3);
	expect(data.end).toBe(3);
	expect(data.multiLine).toBe(false);
});

test('Test retrieval of a word from the first position', () => {
	const s: string = 'The quick brown fox jumps over the lazy dog';
	const data: Section = word(s, 0);
	expect(data).toBeDefined();

	expect(data.text.length).toBe(3);
	expect(data.text).toBe('The');
	expect(data.start).toBe(0);
	expect(data.end).toBe(2);
	expect(data.multiLine).toBe(false);
});

test('Test retrieval of a word from the last position', () => {
	const s: string = 'The quick brown fox jumps over the lazy dog';
	const data: Section = word(s, s.length - 1);
	expect(data).toBeDefined();

	expect(data.text.length).toBe(3);
	expect(data.text).toBe('dog');
	expect(data.start).toBe(40);
	expect(data.end).toBe(42);
	expect(data.multiLine).toBe(false);
});

test('Test word retrieval past the end of the line', () => {
	const s: string = 'abcdef';
	const data: Section = word(s, 7);
	expect(data).toBeDefined();

	expect(data.text.length).toBe(0);
	expect(data.text).toBe('');
	expect(data.start).toBe(6);
	expect(data.end).toBe(6);
	expect(data.multiLine).toBe(false);
});
