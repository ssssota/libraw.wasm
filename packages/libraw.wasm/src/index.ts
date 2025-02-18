import * as typ from "typed-cstruct";

import {
	libraw_imgother_t,
	libraw_iparams_t,
	libraw_lensinfo_t,
	libraw_makernotes_lens_t,
	libraw_makernotes_t,
	libraw_processed_image_t,
	libraw_shootinginfo_t,
	libraw_thumbnail_t,
} from "./libraw-types.js";
// @ts-expect-error
import initializeLibRawWasm from "./libraw.mjs";
import type {
	CharPtr,
	ErrorCode,
	Float,
	Int,
	LibRawDataT,
	LibRawProcessedImageT,
	LibRawWasmModule,
} from "./types/index.js";

type MutablePtr = { ptr: number };

export type MakernotesLens = {
	lensID: bigint;
	lens: string;
	lensFormat: number;
	lensMount: number;
	camID: bigint;
	cameraFormat: number;
	cameraMount: number;
	body: string;
	focalType: "unknown" | "fixed focal" | "zoom";
	lensFeaturesPre: string;
	lensFeaturesSuf: string;
	minFocal: number;
	maxFocal: number;
	maxAp4MinFocal: number;
	maxAp4MaxFocal: number;
	minAp4MinFocal: number;
	minAp4MaxFocal: number;
	maxAp: number;
	minAp: number;
	curFocal: number;
	curAp: number;
	maxAp4CurFocal: number;
	minAp4CurFocal: number;
	minFocusDistance: number;
	focusRangeIndex: number;
	lensFStops: number;
	teleconverterID: bigint;
	teleconverter: string;
	adapterID: bigint;
	adapter: string;
	attachmentID: bigint;
	attachment: string;
	focalUnits: number;
	focalLengthIn35mmFormat: number;
};
export type ImgOther = {
	isoSpeed: number;
	shutter: number;
	aperture: number;
	focalLen: number;
	timestamp: number;
	shotOrder: number;
	gpsdata: number[];
	parsedGps: ParsedGps;
	desc: string;
	artist: string;
	analogbalance: number[];
};
export type ParsedGps = {
	latitude: [Deg: number, min: number, sec: number];
	longitude: [Deg: number, min: number, sec: number];
	gpstimestamp: [Deg: number, min: number, sec: number];
	altitude: number;
	altref: number;
	latref: number;
	longref: number;
	gpsstatus: number;
	gpsparsed: number;
};
export type Thumbnail = {
	tformat: ThumbnailFormat;
	twidth: number;
	theight: number;
	tlength: number;
	tcolors: number;
	thumb: Uint8Array;
};
export type ThumbnailFormat =
	| "jpeg"
	| "bitmap"
	| "bitmap16"
	| "layer"
	| "rollei"
	| "h265"
	| "unknown";
export type ProcessedImage = {
	type: "jpeg" | "bitmap";
	height: number;
	width: number;
	colors: number;
	bits: number;
	dataSize: number;
	data: Uint8Array;
};

export class LibRaw implements Disposable {
	private static modulePromise: Promise<LibRawWasmModule> | undefined;
	private static module: LibRawWasmModule;
	private lr = 0 as LibRawDataT;
	private _status: "disposed" | "loading" | "ready" = "loading";
	get status() {
		return this._status;
	}
	private get view(): DataView {
		return new DataView(LibRaw.module.HEAPU8.buffer);
	}
	constructor() {
		this.setup();
	}
	static async initialize() {
		if (LibRaw.modulePromise === undefined) {
			const mod: Promise<LibRawWasmModule> = initializeLibRawWasm();
			LibRaw.modulePromise = mod;
			LibRaw.module = await mod;
		}
	}
	async waitUntilReady() {
		await LibRaw.modulePromise;
	}
	private async setup() {
		await LibRaw.initialize();
		this._status = "ready";
		this.lr ||= LibRaw.module._libraw_init(0);
	}
	open(buffer: ArrayBufferLike) {
		// alloc memory
		const dataPtr = LibRaw.module._malloc(buffer.byteLength);
		const dataHeap = new Uint8Array(
			LibRaw.module.HEAPU8.buffer,
			dataPtr,
			buffer.byteLength,
		);
		dataHeap.set(new Uint8Array(buffer));
		// open buffer
		this.handleError(
			LibRaw.module._libraw_open_buffer(
				this.lr,
				dataHeap.byteOffset,
				buffer.byteLength,
			),
		);
	}
	unpack() {
		this.handleError(LibRaw.module._libraw_unpack(this.lr));
	}
	unpackThumb() {
		this.handleError(LibRaw.module._libraw_unpack_thumb(this.lr));
	}
	unpackThumbEx(i: Int) {
		this.handleError(LibRaw.module._libraw_unpack_thumb_ex(this.lr, i));
	}
	raw2image() {
		this.handleError(LibRaw.module._libraw_raw2image(this.lr));
	}
	dcrawProcess() {
		this.handleError(LibRaw.module._libraw_dcraw_process(this.lr));
	}
	dcrawMakeMemImage() {
		const errcPtr = LibRaw.module._malloc(4);
		const ptr = LibRaw.module._libraw_dcraw_make_mem_image(this.lr, errcPtr);
		const code = this.readI32({ ptr: errcPtr });
		LibRaw.module._free(errcPtr);
		// this.handleError(code as ErrorCode);
		if (!ptr) throw new Error("Unexpected error");
		const ret = this.readProcessedImage(ptr);
		LibRaw.module._libraw_dcraw_clear_mem(ptr);
		return ret;
	}
	dcrawMakeMemThumb() {
		const errcPtr = LibRaw.module._malloc(4);
		const ptr = LibRaw.module._libraw_dcraw_make_mem_thumb(this.lr, errcPtr);
		const code = this.readI32({ ptr: errcPtr });
		LibRaw.module._free(errcPtr);
		this.handleError(code as ErrorCode);
		if (!ptr) throw new Error("Unexpected error");
		const ret = this.readProcessedImage(ptr);
		LibRaw.module._libraw_dcraw_clear_mem(ptr);
		return ret;
	}
	private readProcessedImage(processed: LibRawProcessedImageT) {
		return libraw_processed_image_t()
			.override("data", {
				size: 1,
				read(opts, ctx) {
					const offset = opts.offset ?? 0;
					const size = ctx.data_size;
					return opts.buf.slice(offset, offset + size);
				},
			})
			.read({ buf: LibRaw.module.HEAPU8, offset: processed });
	}
	getRawHeight() {
		return LibRaw.module._libraw_get_raw_height(this.lr);
	}
	getRawWidth() {
		return LibRaw.module._libraw_get_raw_width(this.lr);
	}
	getIHeight() {
		return LibRaw.module._libraw_get_iheight(this.lr);
	}
	getIWidth() {
		return LibRaw.module._libraw_get_iwidth(this.lr);
	}
	getCamMul(index: Int) {
		return LibRaw.module._libraw_get_cam_mul(this.lr, index);
	}
	getPreMul(index: Int) {
		return LibRaw.module._libraw_get_pre_mul(this.lr, index);
	}
	getRgbCam(index1: Int, index2: Int) {
		return LibRaw.module._libraw_get_rgb_cam(this.lr, index1, index2);
	}
	getColorMaximum() {
		return LibRaw.module._libraw_get_color_maximum(this.lr);
	}
	setUserMul(index: Int, val: Float) {
		LibRaw.module._libraw_set_user_mul(this.lr, index, val);
	}
	setDemosaic(value: Int) {
		LibRaw.module._libraw_set_demosaic(this.lr, value);
	}
	setAdjustMaximumThr(value: Float) {
		LibRaw.module._libraw_set_adjust_maximum_thr(this.lr, value);
	}
	setOutputColor(value: Int) {
		LibRaw.module._libraw_set_output_color(this.lr, value);
	}
	setOutputBps(value: Int) {
		LibRaw.module._libraw_set_output_bps(this.lr, value);
	}
	setGamma(index: Int, value: Float) {
		LibRaw.module._libraw_set_gamma(this.lr, index, value);
	}
	setNoAutoBright(value: Int) {
		LibRaw.module._libraw_set_no_auto_bright(this.lr, value);
	}
	setBright(value: Float) {
		LibRaw.module._libraw_set_bright(this.lr, value);
	}
	setHighlight(value: Int) {
		LibRaw.module._libraw_set_highlight(this.lr, value);
	}
	setFbddNoiserd(value: Int) {
		LibRaw.module._libraw_set_fbdd_noiserd(this.lr, value);
	}
	version(): string {
		return this.readString(LibRaw.module._libraw_version(this.lr));
	}
	versionNumber(): number {
		return LibRaw.module._libraw_versionNumber(this.lr);
	}
	cameraCount(): number {
		return LibRaw.module._libraw_cameraCount(this.lr);
	}
	cameraList(): string[] {
		const ptr = LibRaw.module._libraw_cameraList(this.lr);
		const length = this.cameraCount();
		return typ
			.sizedArray(typ.charPointerAsString(), length)
			.read({ buf: LibRaw.module.HEAPU8, offset: ptr }, {});
	}
	unpackFunctionName(): string {
		return this.readString(LibRaw.module._libraw_unpack_function_name(this.lr));
	}
	color(row: Int, col: Int): number {
		return LibRaw.module._libraw_COLOR(this.lr, row, col);
	}
	recycle() {
		LibRaw.module._libraw_recycle(this.lr);
	}
	getRawImage() {
		const ptr = LibRaw.module._libraw_get_raw_image(this.lr);
		return new Uint16Array(LibRaw.module.HEAPU8.buffer, ptr);
	}
	getIParams() {
		return libraw_iparams_t()
			.override("make", typ.sizedCharArrayAsString(64))
			.override("model", typ.sizedCharArrayAsString(64))
			.override("software", typ.sizedCharArrayAsString(64))
			.override("normalized_make", typ.sizedCharArrayAsString(64))
			.override("normalized_model", typ.sizedCharArrayAsString(64))
			.override("cdesc", typ.sizedCharArrayAsString(5))
			.override("xmpdata", typ.charPointerAsString())
			.read({
				buf: LibRaw.module.HEAPU8,
				offset: LibRaw.module._libraw_get_iparams(this.lr),
			});
	}
	getLensInfo() {
		const makernotes = libraw_makernotes_lens_t()
			.override("Lens", typ.sizedCharArrayAsString(128))
			.override("body", typ.sizedCharArrayAsString(64))
			.override(
				"FocalType",
				typ.enumLike(typ.i16, {
					unknown: 0,
					"fixed focal": 1,
					zoom: 2,
				} as const),
			)
			.override("LensFeatures_pre", typ.sizedCharArrayAsString(16))
			.override("LensFeatures_suf", typ.sizedCharArrayAsString(16))
			.override("Teleconverter", typ.sizedCharArrayAsString(128))
			.override("Adapter", typ.sizedCharArrayAsString(128))
			.override("Attachment", typ.sizedCharArrayAsString(128));
		/**
		 * @see https://github.com/LibRaw/LibRaw/blob/cccb97647fcee56801fa68231fa8a38aa8b52ef7/libraw/libraw_types.h#L1018-L1026
		 * ```c
		 * typedef struct {
		 *   float MinFocal, MaxFocal, MaxAp4MinFocal, MaxAp4MaxFocal, EXIF_MaxAp;
		 *   char LensMake[128], Lens[128], LensSerial[128], InternalLensSerial[128];
		 *   ushort FocalLengthIn35mmFormat;
		 *   libraw_nikonlens_t nikon;
		 *   libraw_dnglens_t dng;
		 *   libraw_makernotes_lens_t makernotes;
		 * } libraw_lensinfo_t;
		 * ```
		 */
		return libraw_lensinfo_t()
			.override("LensMake", typ.sizedCharArrayAsString(128))
			.override("Lens", typ.sizedCharArrayAsString(128))
			.override("LensSerial", typ.sizedCharArrayAsString(128))
			.override("InternalLensSerial", typ.sizedCharArrayAsString(128))
			.override("makernotes", makernotes)
			.read({
				buf: LibRaw.module.HEAPU8,
				offset: LibRaw.module._libraw_get_lensinfo(this.lr),
			});
	}
	getImgOther() {
		return libraw_imgother_t()
			.override("desc", typ.sizedCharArrayAsString(512))
			.override("artist", typ.sizedCharArrayAsString(64))
			.read({
				buf: LibRaw.module.HEAPU8,
				offset: LibRaw.module._libraw_get_imgother(this.lr),
			});
	}
	// getDecoderInfo() {
	// 	/**
	// 	 * @see https://github.com/LibRaw/LibRaw/blob/cccb97647fcee56801fa68231fa8a38aa8b52ef7/libraw/libraw_types.h#L120-L124
	// 	 * ```c
	// 	 * typedef struct {
	// 	 *   const char *decoder_name;
	// 	 *   unsigned decoder_flags;
	// 	 * } libraw_decoder_info_t;
	// 	 * ```
	// 	 */
	// 	const decoderInfoPtr = LibRaw.libraw._malloc(8) as LibRawDecoderInfo;
	// 	const code = LibRaw.libraw._libraw_get_decoder_info(decoderInfoPtr);
	// 	console.log({ code });
	// 	if (code) throw this.error(code);
	// 	const ptr = { ptr: decoderInfoPtr };
	// 	return {
	// 		decoderName: this.readString(this.readU32(ptr) as CharPtr),
	// 		decoderFlags: this.readU32(ptr),
	// 	};
	// }
	getThumbnail() {
		return libraw_thumbnail_t()
			.override("thumb", typ.pointerArrayFromLengthField(typ.u8, "tlength"))
			.read({
				buf: LibRaw.module.HEAPU8,
				offset: LibRaw.module._libraw_get_thumbnail(this.lr),
			});
	}
	getShootingInfo() {
		return libraw_shootinginfo_t()
			.override("BodySerial", typ.sizedCharArrayAsString(64))
			.override("InternalBodySerial", typ.sizedCharArrayAsString(64))
			.read({
				buf: LibRaw.module.HEAPU8,
				offset: LibRaw.module._libraw_get_shootinginfo(this.lr),
			});
	}
	getMakernotes() {
		return libraw_makernotes_t().read({
			buf: LibRaw.module.HEAPU8,
			offset: LibRaw.module._libraw_get_makernotes(this.lr),
		});
	}
	private handleError(code: ErrorCode) {
		if (code)
			throw Error(this.readString(LibRaw.module._libraw_strerror(code)));
	}
	private readString(ptr: CharPtr) {
		return typ
			.charPointerAsString()
			.read({ buf: LibRaw.module.HEAPU8, offset: ptr }, {});
	}
	private readI32(ptr: MutablePtr): number {
		const value = this.view.getInt32(ptr.ptr, true);
		ptr.ptr += 4;
		return value | 0;
	}
	dispose() {
		if (this._status === "disposed") return;
		LibRaw.module._libraw_close(this.lr);
		this._status = "disposed";
	}
	[Symbol.dispose]() {
		this.dispose();
	}
}
