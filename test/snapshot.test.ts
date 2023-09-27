import * as fs from "node:fs";
import { LibRaw } from "libraw.wasm";
import { expect, it } from "vitest";

const cases: [name: string, buffer: Buffer][] = [];
for (const entry of fs.readdirSync("assets", { withFileTypes: true })) {
	if (entry.isDirectory()) continue;
	const buffer = fs.readFileSync(`assets/${entry.name}`);
	cases.push([entry.name, buffer]);
}

it.each(cases)("%s", async (_name, buffer) => {
	const libraw = await LibRaw.create();
	await libraw.open(buffer.buffer);
	expect(libraw.getIParams()).toMatchSnapshot();
	expect(libraw.getImgOther()).toMatchSnapshot();
	expect(libraw.getLensInfo()).toMatchSnapshot();
	expect(libraw.getMakernotes()).toMatchSnapshot();
});
