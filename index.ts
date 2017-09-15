'use strict';

import {nl} from 'util.toolbox';

export interface Section {
	start: number;
	end: number;
	text: string;
}

/**
 * Retrieves a section of text from the given input text string.  It starts at
 * the given position and works forward/backward through the string looking for
 * newline characters.  The search threshold for the number of lines in each
 * direction is set by the lines parameter.  When the number of newlines, in a
 * direction is found, then the start/end position offsets from the text buffer
 * are found.
 * @param text {string} the base text string to extract the substring
 * @param pos {number} the starting position within the text string to start
 * looking for newlines.
 * @param lines {number} the number of lines above and below the start position
 * line to include (this number is *2)
 * @param threshold {number} if the size of the buffer is below this number
 * then just return the whole buffer (don't search when under threshold)
 * @return {Section} an object that represents the section found.  This contains
 * the absolute start/end of the section, and a reference to this section.
 */
export function section(text: string, pos: number, lines: number = 30, threshold: number = 300): Section {

	if (pos > text.length || pos < 0) {
		throw new Error(`Requested section position outside valid text range (pos=${pos} len=${text.length})`);
	}

	if (threshold < 1) {
		threshold = 1;
	}

	if (lines < 1) {
		lines = 1;
	}

	const ret = {
		start: 0,
		end: text.length,
		text: text
	};

	if (ret.end < threshold || text.length === 0) {
		return ret;
	} else {
		ret.start = ret.end = pos;
	}

	let offLeft: number = lines + 1;
	let offRight: number = lines + 1;

	while ((offLeft && ret.start > 0) || (offRight && ret.end < text.length)) {

		if (ret.start >= 0 && offLeft) {
			ret.start--;
		}

		if (ret.end < text.length && offRight) {
			ret.end++;
		}

		if (text[ret.start] === nl && offLeft) offLeft--;
		if (text[ret.end] === nl && offRight) offRight--;
	}

	ret.start++;
	ret.text = text.slice(ret.start, ret.end + 1);

	return ret;
}
