<script lang="ts">
	import { parseLines, parseParagraphs, type Line } from '$lib/marked-text';

	let {
		value,
		mode = 'inline'
	}: {
		value?: string;
		// `inline` renders the text without any block wrapper, with `\n` becoming
		// a `<br>` break. `blocks` first splits on blank lines into `<p>`s, each
		// then rendered the same way as inline.
		mode?: 'inline' | 'blocks';
	} = $props();
</script>

{#if value}
	{#if mode === 'inline'}
		{@render renderLines(parseLines(value))}
	{:else}
		{#each parseParagraphs(value) as paragraph, pi (pi)}
			<p>{@render renderLines(paragraph.lines)}</p>
		{/each}
	{/if}
{/if}

{#snippet renderLines(lines: readonly Line[])}
	{#each lines as line, li (li)}
		{#if li > 0}<br />{/if}
		{#each line.segments as seg, si (si)}
			{#if seg.emphasis && seg.text.length > 0}
				<em>{seg.text}</em>
			{:else if !seg.emphasis && seg.text.length > 0}
				{seg.text}
			{/if}
		{/each}
	{/each}
{/snippet}
