'use strict';

import test from 'ava';
import * as path from 'path';
import {Fixture} from 'util.fixture';
import {section, Section} from '../index';
import {cleanup} from './helpers';

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
	t.regex(data.text, /a{80}\n/);
});

test('Test retrieving section from a small dataset', t => {
	const fixture = new Fixture('pattern');

	t.truthy(fixture);
	t.truthy(fixture.pattern);
	t.is(typeof fixture.pattern, 'string');

	const data: Section = section(fixture.pattern, 250, 1);

	// (3 lines * 80 width) + 3 newlines
	t.is(data.text.length, (3 * 80) + 3);
	t.regex(data.text, /c{80}\nd{80}\ne{80}\n/);
});

test('Test retrieving a single line from the current position', t => {
	const fixture = new Fixture('pattern');

	t.truthy(fixture);
	t.truthy(fixture.pattern);
	t.is(typeof fixture.pattern, 'string');

	const data: Section = section(fixture.pattern, 250, 0);

	// 80 width + 1 newline
	t.is(data.text.length, 81);
	t.regex(data.text, /d{80}\n/);
});

test('Test retrieving from the first position', t => {
	const fixture = new Fixture('pattern');

	t.truthy(fixture);
	t.truthy(fixture.pattern);
	t.is(typeof fixture.pattern, 'string');

	const data: Section = section(fixture.pattern, 0, 5);

	// (6 lines * 80 width) + 6 newlines
	t.is(data.text.length, (6 * 80) + 6);
	t.regex(data.text, /a{80}\nb{80}\nc{80}\nd{80}\ne{80}\nf{80}\n/);
});

test('Test retrieving from the final position', t => {
	const fixture = new Fixture('pattern');

	t.truthy(fixture);
	t.truthy(fixture.pattern);
	t.is(typeof fixture.pattern, 'string');

	const data: Section = section(fixture.pattern, fixture.pattern.length - 1, 5);

	// (6 lines * 80 width) + 6 newlines
	t.is(data.text.length, (6 * 80) + 6);
	t.regex(data.text, /u{80}\nv{80}\nw{80}\nx{80}\ny{80}\nz{80}\n/);
});
