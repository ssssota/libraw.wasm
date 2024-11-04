<script lang="ts">
	import type { HTMLImgAttributes } from 'svelte/elements';
	type Props = Omit<HTMLImgAttributes, 'src'> & { data: Uint8Array };
	let { data, ...props }: Props = $props();
</script>

<img src={URL.createObjectURL(new Blob([data], { type: 'image/jpeg' }))} {...props} />
