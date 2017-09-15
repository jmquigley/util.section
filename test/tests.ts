'use strict';

import test from 'ava';
import * as path from 'path';
import {Fixture} from 'util.fixture';
import {section, Section} from '../index';
import {cleanup} from './helpers';

const debug = require('debug')('section');

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

	debug(`data below: %o`, data);

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

test('Test retrieving section from a small file', t => {
	const fixture = new Fixture('pattern');

	t.truthy(fixture);
	t.truthy(fixture.pattern);
	t.is(typeof fixture.pattern, 'string');

	debug(`before:\n${fixture.pattern}`);

	const data: Section = section(fixture.pattern, 250, 1);

	debug(`data: %o`, data);
	debug(`after:\n${data.text}`);
});
