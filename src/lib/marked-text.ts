/**
 * Tiny "marked text" parser. The CMS stores plain strings; an asterisk-wrapped
 * span (`*foo*`) is the authoring signal for the design's italic accent.
 * Soft line breaks come from `\n` and paragraph breaks from `\n\n+`.
 *
 * The parser is intentionally minimal: no escapes, no nesting, no other marks.
 * Unbalanced asterisks (odd count) leave the trailing run marked as emphasis;
 * balanced pairs are the documented authoring contract.
 */

interface Segment {
	readonly text: string;
	readonly emphasis: boolean;
}

export interface Line {
	readonly segments: readonly Segment[];
}

interface Paragraph {
	readonly lines: readonly Line[];
}

/**
 * Splits a single line on `*` boundaries. Even-indexed segments are plain
 * text; odd-indexed segments carry the emphasis flag.
 *
 * @param input - One line of text (no `\n` characters)
 */
export function parseInline(input: string): readonly Segment[] {
	return input.split('*').map((text, i) => ({ text, emphasis: i % 2 === 1 }));
}

/**
 * Splits a string on `\n` into lines, parsing each line for asterisk emphasis.
 * Used for headings, where the design supports a soft line break in the middle.
 *
 * @param input - Text with optional `\n` soft breaks and `*foo*` emphasis
 */
export function parseLines(input: string): readonly Line[] {
	return input.split('\n').map((line) => ({ segments: parseInline(line) }));
}

/**
 * Splits a string on blank lines (`\n\n+`) into paragraphs, each itself parsed
 * into lines and segments. Used for the about body.
 *
 * @param input - Text with `\n\n` paragraph breaks, `\n` soft breaks, and
 *   `*foo*` emphasis
 */
export function parseParagraphs(input: string): readonly Paragraph[] {
	return input.split(/\n{2,}/).map((para) => ({ lines: parseLines(para) }));
}
