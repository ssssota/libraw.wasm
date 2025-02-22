<script lang="ts">
	import Bitmap from '$lib/Bitmap.svelte';
	import Jpeg from '$lib/Jpeg.svelte';
	import { createLoader } from '$lib/loader';
	import { readFile } from '$lib/read_file';
	import { resolvable, type ResolvablePromise } from '$lib/resolvable';
	import type { LibRaw } from 'libraw.wasm';

	type LibRawReturn<T extends keyof LibRaw> = LibRaw[T] extends (...args: unknown[]) => infer R
		? R
		: never;
	let iparams = $state<ResolvablePromise<LibRawReturn<'getIParams'>> | undefined>();
	let thumb = $state<ResolvablePromise<Uint8Array> | undefined>();
	let raw = $state<ResolvablePromise<LibRawReturn<'dcrawMakeMemImage'>> | undefined>();

	const onFileChange = async (e: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
		const file = e.currentTarget.files?.[0];
		if (!file) return;
		iparams = resolvable();
		thumb = resolvable();
		raw = resolvable();
		const libraw = createLoader();
		libraw.meta().then(console.log);
		try {
			const arrayBuffer = await readFile(file);
			const info = await libraw.load(arrayBuffer);
			iparams.resolve(info.iparams);

			const thumbnail = await libraw.thumbnail();
			if (thumbnail?.type_ === 'LIBRAW_IMAGE_JPEG') {
				const buf = new Uint8Array(thumbnail.data);
				thumb.resolve(buf);
			}
			await libraw.raw().then(raw.resolve, raw.reject);
		} catch (error) {
			console.error(error);
			iparams.reject(error);
			thumb.reject(error);
			raw.reject(error);
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
			{#if raw}
				<dt>RAW</dt>
				<dd>
					{#await raw}
						Loading...
					{:then raw}
						<Bitmap {...raw} />
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
