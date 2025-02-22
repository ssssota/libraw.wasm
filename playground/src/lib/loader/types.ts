import type { LibRaw } from "libraw.wasm";

type LibRawReturn<T extends keyof LibRaw> = LibRaw[T] extends (
	...args: unknown[]
) => infer R
	? R
	: never;

type Meta = {
	version: string;
	supportedCameras: string[];
};

export interface Loader {
	meta(): Promise<Meta>;
	load(buffer: ArrayBuffer): Promise<{
		iparams: LibRawReturn<"getIParams">;
		imgother: LibRawReturn<"getImgOther">;
		lensinfo: LibRawReturn<"getLensInfo">;
		makernotes: LibRawReturn<"getMakernotes">;
		shootinginfo: LibRawReturn<"getShootingInfo">;
	}>;
	thumbnail(): Promise<LibRawReturn<"dcrawMakeMemThumb">>;
	raw(): Promise<LibRawReturn<"dcrawMakeMemImage">>;
}
