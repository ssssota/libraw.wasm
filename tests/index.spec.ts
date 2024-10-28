import * as fs from "node:fs/promises";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { LibRaw } from "libraw.wasm";
import { expect, it } from "vitest";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.join(__dirname, "..");
const samplesDir = path.join(repoRoot, "raw-samples");

it("ARW", async () => {
	using libraw = await LibRaw.create();
	const file = await fs.readFile(
		path.join(samplesDir, "ARW", "RAW_SONY_A700.ARW"),
	);
	await libraw.open(file.buffer);

	const iparams = libraw.getIParams();
	expect(iparams.make).toBe("Sony");
	expect(iparams.model).toBe("DSLR-A700");
	expect(iparams.normalizedMake).toBe("Sony");
	expect(iparams.normalizedModel).toBe("DSLR-A700");
	expect(iparams.software).toBe("DSLR-A700 v03");

	const imgother = libraw.getImgOther();
	expect(imgother.focalLen).toBe(250);
	expect(imgother.isoSpeed).toBe(250);
	expect(imgother.shutter).toBeCloseTo(1 / 1000);
	expect(imgother.aperture).toBe(8);
});

it("CR2", async () => {
	using libraw = await LibRaw.create();
	const file = await fs.readFile(
		path.join(samplesDir, "CR2", "sample_canon_400d1.cr2"),
	);
	await libraw.open(file.buffer);

	const iparams = libraw.getIParams();
	expect(iparams.make).toBe("Canon");
	expect(iparams.model).toBe("EOS 400D");
	expect(iparams.normalizedMake).toBe("Canon");
	expect(iparams.normalizedModel).toBe("EOS 400D");

	const imgother = libraw.getImgOther();
	expect(imgother.focalLen).toBe(25);
	expect(imgother.isoSpeed).toBe(100);
	expect(imgother.shutter).toBeCloseTo(1 / 100);
	expect(imgother.aperture).toBeCloseTo(6.3);
});

it("DNG", async () => {
	using libraw = await LibRaw.create();
	const file = await fs.readFile(
		path.join(samplesDir, "DNG", "RAW_LEICA_M8.DNG"),
	);
	await libraw.open(file.buffer);

	const iparams = libraw.getIParams();
	expect(iparams.make).toBe("Leica");
	expect(iparams.model).toBe("M8");
	expect(iparams.normalizedMake).toBe("Leica");
	expect(iparams.normalizedModel).toBe("M8");

	const imgother = libraw.getImgOther();
	expect(imgother.focalLen).toBe(50);
	expect(imgother.isoSpeed).toBe(160);
	expect(imgother.shutter).toBeCloseTo(12);
	expect(imgother.aperture).toBe(4);
});

it("NEF", async () => {
	using libraw = await LibRaw.create();
	const file = await fs.readFile(
		path.join(samplesDir, "NEF", "RAW_NIKON_D90.NEF"),
	);
	await libraw.open(file.buffer);

	const iparams = libraw.getIParams();
	expect(iparams.make).toBe("Nikon");
	expect(iparams.model).toBe("D90");
	expect(iparams.normalizedMake).toBe("Nikon");
	expect(iparams.normalizedModel).toBe("D90");

	const imgother = libraw.getImgOther();
	expect(imgother.focalLen).toBe(50);
	expect(imgother.isoSpeed).toBe(100);
	expect(imgother.shutter).toBeCloseTo(1 / 60);
	expect(imgother.aperture).toBe(3.5);
});

it("PEF", async () => {
	using libraw = await LibRaw.create();
	const file = await fs.readFile(
		path.join(samplesDir, "PEF", "RAW_PENTAX_KD10.PEF"),
	);
	await libraw.open(file.buffer);

	const iparams = libraw.getIParams();
	expect(iparams.make).toBe("Pentax");
	expect(iparams.model).toBe("K10D");
	expect(iparams.normalizedMake).toBe("Pentax");
	expect(iparams.normalizedModel).toBe("K10D");

	const imgother = libraw.getImgOther();
	expect(imgother.focalLen).toBe(190);
	expect(imgother.isoSpeed).toBe(640);
	expect(imgother.shutter).toBeCloseTo(1 / 160);
	expect(imgother.aperture).toBe(4.5);
});

it("RW2", async () => {
	using libraw = await LibRaw.create();
	const file = await fs.readFile(
		path.join(samplesDir, "RW2", "RAW_PANASONIC_G1.RW2"),
	);
	await libraw.open(file.buffer);

	const iparams = libraw.getIParams();
	expect(iparams.make).toBe("Panasonic");
	expect(iparams.model).toBe("DMC-G1");
	expect(iparams.normalizedMake).toBe("Panasonic");
	expect(iparams.normalizedModel).toBe("DMC-G1");

	const imgother = libraw.getImgOther();
	expect(imgother.focalLen).toBe(14);
	expect(imgother.isoSpeed).toBe(100);
	expect(imgother.shutter).toBeCloseTo(1 / 400);
	expect(imgother.aperture).toBeCloseTo(6.3);
});

it("RAW", async () => {
	using libraw = await LibRaw.create();
	const file = await fs.readFile(
		path.join(samplesDir, "RAW", "RAW_LEICA_DIGILUX2_SRGB.RAW"),
	);
	await libraw.open(file.buffer);

	const iparams = libraw.getIParams();
	expect(iparams.make).toBe("Leica");
	expect(iparams.model).toBe("DIGILUX 2");
	expect(iparams.normalizedMake).toBe("Panasonic");
	expect(iparams.normalizedModel).toBe("DMC-LC1");

	const imgother = libraw.getImgOther();
	expect(imgother.focalLen).toBe(7);
	expect(imgother.isoSpeed).toBe(100);
	expect(imgother.shutter).toBeCloseTo(1 / 250);
	expect(imgother.aperture).toBe(11);
});
