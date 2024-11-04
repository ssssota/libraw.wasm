<script lang="ts">
	import Jpeg from '$lib/Jpeg.svelte';
	import { createLibRaw } from '$lib/libraw';
	import { pending } from '$lib/pending';
	import { promiseWithResolvers } from '$lib/promise_with_resolvers';
	import { readFile } from '$lib/read_file';
	import type { IParams } from 'libraw.wasm';

	let iparams = $state<Promise<IParams> | undefined>();
	let thumb = $state<Promise<Uint8Array> | undefined>();

	const onFileChange = async (e: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
		const file = e.currentTarget.files?.[0];
		if (!file) return;
		const {
			promise: iparamsPromise,
			resolve: resolveIparams,
			reject: rejectIparams
		} = promiseWithResolvers<IParams>();
		const {
			promise: thumbPromise,
			resolve: resolveThumb,
			reject: rejectThumb
		} = promiseWithResolvers<Uint8Array>();
		iparams = iparamsPromise;
		thumb = thumbPromise;
		const libraw = await createLibRaw();
		try {
			const arrayBuffer = await readFile(file);
			await libraw.open(arrayBuffer);
			resolveIparams(libraw.getIParams());

			await libraw.unpackThumb();
			const thumbnail = libraw.getThumbnail();
			if (thumbnail.tformat === 'jpeg') {
				resolveThumb(new Uint8Array(thumbnail.thumb));
			}
		} catch (error) {
			rejectIparams(error);
			rejectThumb(error);
		} finally {
			libraw.dispose();
		}
	};
</script>

<input type="file" onchange={onFileChange} />
{#if iparams}
	{#await iparams}
		<p>Loading...</p>
	{:then params}
		<dl>
			<dt>make</dt>
			<dd>{params.make}</dd>
			<dt>model</dt>
			<dd>{params.model}</dd>
			{#if thumb}
				<dt>thumbnail</dt>
				<dd>
					{#await thumb}
						Loading...
					{:then thumb}
						<Jpeg data={thumb} />
					{:catch error}
						<span class:error>{error.message}</span>
					{/await}
				</dd>
			{/if}
		</dl>
	{:catch error}
		<p class:error>{error.message}</p>
	{/await}
{/if}

<style>
	.error {
		color: red;
	}
</style>
