<script lang="ts">
	import type { HTMLCanvasAttributes } from 'svelte/elements';
	import { rgb2rgba } from './rgb2rgba';
	type Props = Omit<HTMLCanvasAttributes, 'width' | 'height'> & {
		data: Uint8Array;
		width: number;
		height: number;
	};
	let { data, width, height, ...props }: Props = $props();
	let canvas: HTMLCanvasElement | undefined = $state();
	$effect(() => {
		const ctx = canvas?.getContext('2d');
		if (!ctx) return;
		const imageData = ctx.createImageData(width, height);
		imageData.data.set(rgb2rgba(data));
		ctx.putImageData(imageData, 0, 0);
	});
</script>

<canvas bind:this={canvas} {width} {height} {...props}></canvas>
