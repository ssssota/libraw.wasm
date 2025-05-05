import * as fs from "node:fs/promises";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { LibRaw } from "libraw.wasm";
import { expect, it } from "vitest";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.join(__dirname, "..");
const samplesDir = path.join(repoRoot, "raw-samples");

it("meta", async () => {
	await LibRaw.initialize();
	expect(LibRaw.version()).toMatchInlineSnapshot(`"0.22.0-Devel202502"`);
	expect(LibRaw.versionNumber()).toMatchInlineSnapshot("5632");
	expect(LibRaw.cameraList()).toMatchSnapshot();
});

it("ARW", async () => {
	using libraw = new LibRaw();
	await libraw.waitUntilReady();
	const file = await fs.readFile(
		path.join(samplesDir, "ARW", "RAW_SONY_A700.ARW"),
	);
	libraw.open(file.buffer);

	const iparams = libraw.getIParams();
	expect(iparams.make).toBe("Sony");
	expect(iparams.model).toBe("DSLR-A700");
	expect(iparams.normalized_make).toBe("Sony");
	expect(iparams.normalized_model).toBe("DSLR-A700");
	expect(iparams.software).toBe("DSLR-A700 v03");

	const imgother = libraw.getImgOther();
	expect(imgother.focal_len).toBe(250);
	expect(imgother.iso_speed).toBe(250);
	expect(imgother.shutter).toBeCloseTo(1 / 1000);
	expect(imgother.aperture).toBe(8);

	const lensinfo = libraw.getLensInfo();
	expect(lensinfo.EXIF_MaxAp).toBeCloseTo(6.3);
	expect(lensinfo.FocalLengthIn35mmFormat).toBe(375);
});

it("CR2", async () => {
	using libraw = new LibRaw();
	await libraw.waitUntilReady();
	const file = await fs.readFile(
		path.join(samplesDir, "CR2", "sample_canon_400d1.cr2"),
	);
	libraw.open(file.buffer);

	const iparams = libraw.getIParams();
	expect(iparams.make).toBe("Canon");
	expect(iparams.model).toBe("EOS 400D");
	expect(iparams.normalized_make).toBe("Canon");
	expect(iparams.normalized_model).toBe("EOS 400D");

	const imgother = libraw.getImgOther();
	expect(imgother.focal_len).toBe(25);
	expect(imgother.iso_speed).toBe(100);
	expect(imgother.shutter).toBeCloseTo(1 / 100);
	expect(imgother.aperture).toBeCloseTo(6.3);
});

it("DNG", async () => {
	using libraw = new LibRaw();
	await libraw.waitUntilReady();
	const file = await fs.readFile(
		path.join(samplesDir, "DNG", "RAW_LEICA_M8.DNG"),
	);
	libraw.open(file.buffer);

	const iparams = libraw.getIParams();
	expect(iparams.make).toBe("Leica");
	expect(iparams.model).toBe("M8");
	expect(iparams.normalized_make).toBe("Leica");
	expect(iparams.normalized_model).toBe("M8");

	const imgother = libraw.getImgOther();
	expect(imgother.focal_len).toBe(50);
	expect(imgother.iso_speed).toBe(160);
	expect(imgother.shutter).toBeCloseTo(12);
	expect(imgother.aperture).toBe(4);
});

it("NEF", async () => {
	using libraw = new LibRaw();
	await libraw.waitUntilReady();
	const file = await fs.readFile(
		path.join(samplesDir, "NEF", "RAW_NIKON_D90.NEF"),
	);
	libraw.open(file.buffer);

	const iparams = libraw.getIParams();
	expect(iparams.make).toBe("Nikon");
	expect(iparams.model).toBe("D90");
	expect(iparams.normalized_make).toBe("Nikon");
	expect(iparams.normalized_model).toBe("D90");
	expect(iparams.is_foveon).toBeFalsy();

	const imgother = libraw.getImgOther();
	expect(imgother.focal_len).toBe(50);
	expect(imgother.iso_speed).toBe(100);
	expect(imgother.shutter).toBeCloseTo(1 / 60);
	expect(imgother.aperture).toBe(3.5);

	const lensinfo = libraw.getLensInfo();
	expect(lensinfo.EXIF_MaxAp).toBeCloseTo(Math.SQRT2);
});

it("PEF", async () => {
	using libraw = new LibRaw();
	await libraw.waitUntilReady();
	const file = await fs.readFile(
		path.join(samplesDir, "PEF", "RAW_PENTAX_KD10.PEF"),
	);
	libraw.open(file.buffer);

	const iparams = libraw.getIParams();
	expect(iparams.make).toBe("Pentax");
	expect(iparams.model).toBe("K10D");
	expect(iparams.normalized_make).toBe("Pentax");
	expect(iparams.normalized_model).toBe("K10D");
	expect(iparams.is_foveon).toBeFalsy();

	const imgother = libraw.getImgOther();
	expect(imgother.focal_len).toBe(190);
	expect(imgother.iso_speed).toBe(640);
	expect(imgother.shutter).toBeCloseTo(1 / 160);
	expect(imgother.aperture).toBe(4.5);

	const lensinfo = libraw.getLensInfo();
	expect(lensinfo.FocalLengthIn35mmFormat).toBe(285);
});

it("RW2", async () => {
	using libraw = new LibRaw();
	await libraw.waitUntilReady();
	const file = await fs.readFile(
		path.join(samplesDir, "RW2", "RAW_PANASONIC_G1.RW2"),
	);
	libraw.open(file.buffer);

	const iparams = libraw.getIParams();
	expect(iparams.make).toBe("Panasonic");
	expect(iparams.model).toBe("DMC-G1");
	expect(iparams.normalized_make).toBe("Panasonic");
	expect(iparams.normalized_model).toBe("DMC-G1");
	expect(iparams.is_foveon).toBeFalsy();

	const imgother = libraw.getImgOther();
	expect(imgother.focal_len).toBe(14);
	expect(imgother.iso_speed).toBe(100);
	expect(imgother.shutter).toBeCloseTo(1 / 400);
	expect(imgother.aperture).toBeCloseTo(6.3);

	const lensinfo = libraw.getLensInfo();
	expect(lensinfo.EXIF_MaxAp).toBeCloseTo(3.5);
});

it("RAW", async () => {
	using libraw = new LibRaw();
	await libraw.waitUntilReady();
	const file = await fs.readFile(
		path.join(samplesDir, "RAW", "RAW_LEICA_DIGILUX2_SRGB.RAW"),
	);
	libraw.open(file.buffer);

	const iparams = libraw.getIParams();
	expect(iparams.make).toBe("Leica");
	expect(iparams.model).toBe("DIGILUX 2");
	expect(iparams.normalized_make).toBe("Panasonic");
	expect(iparams.normalized_model).toBe("DMC-LC1");
	expect(iparams.is_foveon).toBeFalsy();

	const imgother = libraw.getImgOther();
	expect(imgother.focal_len).toBe(7);
	expect(imgother.iso_speed).toBe(100);
	expect(imgother.shutter).toBeCloseTo(1 / 250);
	expect(imgother.aperture).toBe(11);

	const lensinfo = libraw.getLensInfo();
	expect(lensinfo.EXIF_MaxAp).toBe(2);
});
