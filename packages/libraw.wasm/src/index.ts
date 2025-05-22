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

export class LibRaw implements Disposable {
	private static modulePromise: Promise<LibRawWasmModule> | undefined;
	private static module: LibRawWasmModule;
	private lr = 0 as LibRawDataT;
	private _status: "disposed" | "loading" | "ready" = "loading";
	get status() {
		return this._status;
	}
	constructor() {
		this.setup();
	}
	static async initialize(wasm?: Response | ArrayBuffer) {
		if (LibRaw.modulePromise === undefined) {
			const mod: Promise<LibRawWasmModule> = initializeLibRawWasm({
				instantiateWasm: LibRaw.createInstantiateWasm(wasm),
			});
			LibRaw.modulePromise = mod;
			LibRaw.module = await mod;
		}
		return await LibRaw.modulePromise;
	}
	private static createInstantiateWasm(wasm?: Response | ArrayBuffer) {
		if (wasm === undefined) return undefined;
		return async (
			importObject: WebAssembly.Imports,
			cb: (instance: WebAssembly.Instance, module: WebAssembly.Module) => void,
		) => {
			const instantiated = await (wasm instanceof Response
				? WebAssembly.instantiateStreaming(wasm, importObject)
				: WebAssembly.instantiate(wasm, importObject));
			cb(instantiated.instance, instantiated.module);
		};
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
		const _code = this.readI32(errcPtr);
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
		const code = this.readI32(errcPtr);
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
	static version(): string {
		if (LibRaw.module === undefined) throw new Error("Not initialized");
		const ptr = LibRaw.module._libraw_version();
		return typ
			.sizedCharArrayAsString(Number.POSITIVE_INFINITY)
			.read({ buf: LibRaw.module.HEAPU8, offset: ptr }, {});
	}
	static versionNumber(): number {
		if (LibRaw.module === undefined) throw new Error("Not initialized");
		return LibRaw.module._libraw_versionNumber();
	}
	static cameraCount(): number {
		if (LibRaw.module === undefined) throw new Error("Not initialized");
		return LibRaw.module._libraw_cameraCount();
	}
	static cameraList(): string[] {
		if (LibRaw.module === undefined) throw new Error("Not initialized");
		const ptr = LibRaw.module._libraw_cameraList();
		const length = LibRaw.cameraCount();
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
	private readI32(ptr: number): number {
		return typ.readI32({ buf: LibRaw.module.HEAPU8, offset: ptr });
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
