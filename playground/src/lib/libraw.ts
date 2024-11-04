import type { LibRaw } from "libraw.wasm";

export async function createLibRaw(): Promise<LibRaw> {
	const { LibRaw } = await import("libraw.wasm");
	return LibRaw.create();
}
