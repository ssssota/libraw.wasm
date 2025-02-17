<script lang="ts">
	import Bitmap from '$lib/Bitmap.svelte';
	import Jpeg from '$lib/Jpeg.svelte';
	import { createLibRaw } from '$lib/libraw';
	import { readFile } from '$lib/read_file';
	import { resolvable, type ResolvablePromise } from '$lib/resolvable';
	import type { IParams, LibRaw } from 'libraw.wasm';

	let version = $state<string | undefined>();
	let iparams = $state<ResolvablePromise<IParams> | undefined>();
	let thumb = $state<ResolvablePromise<Uint8Array> | undefined>();
	let raw = $state<ResolvablePromise<ReturnType<LibRaw['dcrawMakeMemImage']>> | undefined>();

	const onFileChange = async (e: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
		const file = e.currentTarget.files?.[0];
		if (!file) return;
		iparams = resolvable();
		thumb = resolvable();
		raw = resolvable();
		const libraw = createLibRaw();
		await libraw.waitUntilReady();
		version = await libraw.version();
		try {
			const arrayBuffer = await readFile(file);
			await libraw.open(arrayBuffer);
			libraw.getIParams().then(iparams.resolve, iparams.reject);

			await libraw.unpackThumb().catch(thumb.reject);
			const thumbnail = await libraw.dcrawMakeMemThumb().catch(thumb.reject);
			if (thumbnail?.type_ === 'LIBRAW_IMAGE_JPEG') {
				const buf = new Uint8Array(thumbnail.data);
				thumb.resolve(buf);
			}
			await libraw.unpack().catch(raw.reject);
			await libraw.dcrawProcess().catch(raw.reject);
			await libraw.dcrawMakeMemImage().then(raw.resolve, raw.reject);
		} catch (error) {
			console.error(error);
			iparams.reject(error);
			thumb.reject(error);
			raw.reject(error);
		} finally {
			await libraw.dispose();
		}
	};
</script>

{#if version}
	<p>libraw version: {version}</p>
{/if}
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
