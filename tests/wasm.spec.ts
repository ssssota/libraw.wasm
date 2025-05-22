import * as fs from "node:fs/promises";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { LibRaw } from "libraw.wasm";
import { expect, it } from "vitest";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const wasmPath = path.join(
	__dirname,
	"node_modules",
	"libraw.wasm",
	"dist",
	"libraw.wasm",
);

it("specify wasm binary", async () => {
	const wasm = fs.readFile(wasmPath).then((buf) => new Uint8Array(buf).buffer);
	await LibRaw.initialize(wasm);
	expect(LibRaw.version()).toMatchInlineSnapshot(`"0.22.0-Devel202502"`);
	expect(LibRaw.versionNumber()).toMatchInlineSnapshot("5632");
});
