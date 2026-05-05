import { describe, it, expect } from 'vitest';
import { parseInline, parseLines, parseParagraphs } from './marked-text';

describe('parseInline', () => {
	it('returns a single non-emphasis segment for plain text', () => {
		expect(parseInline('hello world')).toEqual([{ text: 'hello world', emphasis: false }]);
	});

	it('marks an asterisk-wrapped span as emphasis', () => {
		expect(parseInline('hello *world*')).toEqual([
			{ text: 'hello ', emphasis: false },
			{ text: 'world', emphasis: true },
			{ text: '', emphasis: false }
		]);
	});

	it('handles emphasis at the start of a line', () => {
		expect(parseInline('*hello* world')).toEqual([
			{ text: '', emphasis: false },
			{ text: 'hello', emphasis: true },
			{ text: ' world', emphasis: false }
		]);
	});

	it('handles multiple emphasis spans on one line', () => {
		expect(parseInline('a *b* c *d* e')).toEqual([
			{ text: 'a ', emphasis: false },
			{ text: 'b', emphasis: true },
			{ text: ' c ', emphasis: false },
			{ text: 'd', emphasis: true },
			{ text: ' e', emphasis: false }
		]);
	});

	it('returns an empty plain segment for an empty input', () => {
		expect(parseInline('')).toEqual([{ text: '', emphasis: false }]);
	});
});

describe('parseLines', () => {
	it(String.raw`splits on \n into separate lines`, () => {
		const result = parseLines('hello\nworld');
		expect(result).toHaveLength(2);
		expect(result[0]?.segments).toEqual([{ text: 'hello', emphasis: false }]);
		expect(result[1]?.segments).toEqual([{ text: 'world', emphasis: false }]);
	});

	it('preserves emphasis within each line', () => {
		const result = parseLines("Hello, it's lovely\nto *meet you*.");
		expect(result[0]?.segments).toEqual([{ text: "Hello, it's lovely", emphasis: false }]);
		expect(result[1]?.segments).toEqual([
			{ text: 'to ', emphasis: false },
			{ text: 'meet you', emphasis: true },
			{ text: '.', emphasis: false }
		]);
	});
});

describe('parseParagraphs', () => {
	it(String.raw`splits on \n\n into paragraphs`, () => {
		const result = parseParagraphs('first paragraph\n\nsecond paragraph');
		expect(result).toHaveLength(2);
	});

	it(String.raw`keeps a single \n as a soft line break inside one paragraph`, () => {
		const result = parseParagraphs('first line\nstill first\n\nsecond paragraph');
		expect(result).toHaveLength(2);
		expect(result[0]?.lines).toHaveLength(2);
		expect(result[1]?.lines).toHaveLength(1);
	});

	it('treats three or more newlines as a single paragraph break', () => {
		const result = parseParagraphs('a\n\n\nb');
		expect(result).toHaveLength(2);
	});
});
