import * as Comlink from "comlink";
import { LibRaw } from "libraw.wasm";
import type { Loader } from "./types";

const librawPromise = LibRaw.initialize();
const libraw = new LibRaw();
Comlink.expose({
	async load(buffer) {
		await librawPromise;
		libraw.open(buffer);
		return {
			iparams: libraw.getIParams(),
			imgother: libraw.getImgOther(),
			lensinfo: libraw.getLensInfo(),
			makernotes: libraw.getMakernotes(),
			shootinginfo: libraw.getShootingInfo(),
		};
	},
	async meta() {
		await librawPromise;
		return {
			version: LibRaw.version(),
			supportedCameras: LibRaw.cameraList(),
		};
	},
	async thumbnail() {
		await librawPromise;
		libraw.unpackThumb();
		return libraw.dcrawMakeMemThumb();
	},
	async raw() {
		await librawPromise;
		libraw.unpack();
		libraw.dcrawProcess();
		return libraw.dcrawMakeMemImage();
	},
} satisfies Loader);
