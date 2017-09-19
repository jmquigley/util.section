'use strict';

export interface Section {
	start: number;
	end: number;
	text: string;
}

// whitespace regex
const ws: RegExp = /\s/;

// newline
const nl: string = '\n';

/**
 * Retrieves a section of text from the given input text string.  It starts at
 * the given position and works forward/backward through the string looking for
 * newline characters.  The search threshold for the number of lines in each
 * direction is set by the lines parameter.  When the number of newlines, in a
 * direction is found, then the start/end position offsets from the text buffer
 * are found.
 *
 * Setting the `lines` to 0 will just retrieve the current line.
 *
 * @param text {string} the base text string to extract the substring
 * @param pos {number} the starting position within the text string to start
 * looking for newlines.
 * @param lines {number} the number of lines above and below the start position
 * line to include (this number is *2).  e.g. 5, would have five lines above,
 * five lines below, and the line the cursor is on (11 total).
 * @param threshold {number} if the size of the buffer is below this number
 * then just return the whole buffer (don't search when under threshold)
 * @return {Section} an object that represents the section found.  This contains
 * the absolute start/end of the section, and a reference to this section.
 */
export function section(text: string, pos: number, lines: number = 30, threshold: number = 300): Section {

	if (pos > text.length || pos < 0) {
		throw new Error(`Requested section position outside valid text range (pos=${pos} len=${text.length})`);
	}

	// Special case when falling on a newline character in the buffer.   Move the
	// position one place to the left
	if (text[pos] === nl && pos > 0) {
		pos--;
	}

	if (threshold < 1) {
		threshold = 1;
	}

	if (lines < 0) {
		lines = 0;
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

	while ((offLeft && ret.start >= 0) || (offRight && ret.end < text.length - 1)) {

		if (ret.start >= 0 && offLeft) {
			ret.start--;
		}

		if (ret.end < text.length - 1 && offRight) {
			ret.end++;
		}

		if (text[ret.start] === nl && offLeft) offLeft--;
		if (text[ret.end] === nl && offRight) offRight--;
	}

	ret.start++;
	ret.text = text.slice(ret.start, ret.end + 1);

	return ret;
}

/**
 * Retrieves the current full line from the given input text.  This uses the
 * newline character from the operating system to determine the beginning and
 * end of the line.  The function is syntactic sugar for the section function.
 * @param text {string} the block of text to perform the search.
 * @param pos {number} the current absolute position within the text block
 * @return {Section} an object that represents the section found.  This contains
 * the absolute start/end of the line, and a reference to this line.
 */
export function line(text: string, pos: number): Section {
	return section(text, pos, 0, 0);
}

/**
 * This call will retrieve the current word at the given cursor location.  A
 * word is considered an alphanumeric value surrounded by white space.
 * @param text {string} the block of text to perform the search.
 * @param pos {number} the current absolute position within the text block
 * @return {Section} an object that represents the section found.  This contains
 * the absolute start/end of the word, and a reference to this word.
 */
export function word(text: string, pos: number): Section {

	const ret = {
		start: pos,
		end: pos,
		text: ''
	};

	if (pos < 0 || text.length === 0) {
		ret.start = ret.end = 0;
		return ret;
	}

	if (pos > text.length - 1) {
		ret.start = ret.end = text.length;
		return ret;
	}

	if (ws.test(text[pos])) {
		return ret;
	}

	let leftDone: boolean = false;
	let rightDone: boolean = false;

	while (!leftDone || !rightDone) {

		if (ret.start > 0 && !ws.test(text[ret.start - 1])) {
			ret.start--;
		} else {
			leftDone = true;
		}

		if (ret.end < text.length - 1 && !ws.test(text[ret.end + 1])) {
			ret.end++;
		} else {
			rightDone = true;
		}
	}

	ret.text = text.slice(ret.start, ret.end + 1);

	return ret;
}
