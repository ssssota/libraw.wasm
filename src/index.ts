// @ts-expect-error
import initializeLibRawWasm from "./libraw.js";

type UnsignedInt = number;
type Int = number;
type Float = number;
type SizeT = number;
type CharPtr = number & { "char*": never };
type CharPtrPtr = number & { "char**": never };
type Ptr = number;
type LibRawDataT = number & { "libraw_data_t*": never };
type LibRawIparamsT = number;
type LibRawLensinfoT = number;
type LibRawImgotherT = number;
type ErrorCode = number & { error_code: never };

type MutablePtr = { ptr: number };

interface LibRawWasmModule {
	_malloc(size: SizeT): Ptr;
	/**
	 * @see https://www.libraw.org/docs/API-C.html#init
	 */
	_libraw_init(flags: UnsignedInt): LibRawDataT;
	/**
	 * @see https://www.libraw.org/docs/API-C.html#init
	 */
	_libraw_close(lr: LibRawDataT): void;
	/**
	 * @see https://www.libraw.org/docs/API-CXX.html#open_buffer
	 */
	_libraw_open_buffer(lr: LibRawDataT, buffer: Ptr, size: SizeT): ErrorCode;
	_libraw_get_raw_height(lr: LibRawDataT): Int;
	_libraw_get_raw_width(lr: LibRawDataT): Int;
	_libraw_get_iheight(lr: LibRawDataT): Int;
	_libraw_get_iwidth(lr: LibRawDataT): Int;
	_libraw_get_cam_mul(lr: LibRawDataT, index: Int): Float;
	_libraw_get_pre_mul(lr: LibRawDataT, index: Int): Float;
	_libraw_get_rgb_cam(lr: LibRawDataT, index1: Int, index2: Int): Float;
	_libraw_get_iparams(lr: LibRawDataT): LibRawIparamsT;
	_libraw_get_lensinfo(lr: LibRawDataT): LibRawLensinfoT;
	_libraw_get_imgother(lr: LibRawDataT): LibRawImgotherT;
	_libraw_get_color_maximum(lr: LibRawDataT): Int;
	_libraw_set_user_mul(lr: LibRawDataT, index: Int, val: Float): void;
	_libraw_set_demosaic(lr: LibRawDataT, value: Int): void;
	_libraw_set_adjust_maximum_thr(lr: LibRawDataT, value: Float): void;
	_libraw_set_output_color(lr: LibRawDataT, value: Int): void;
	_libraw_set_output_bps(lr: LibRawDataT, value: Int): void;
	_libraw_set_gamma(lr: LibRawDataT, index: Int, value: Float): void;
	_libraw_set_no_auto_bright(lr: LibRawDataT, value: Int): void;
	_libraw_set_bright(lr: LibRawDataT, value: Float): void;
	_libraw_set_highlight(lr: LibRawDataT): void;
	_libraw_set_fbdd_noiserd(lr: LibRawDataT): void;
	/**
	 * @see https://www.libraw.org/docs/API-CXX.html#unpack
	 */
	_libraw_unpack(lr: LibRawDataT): ErrorCode;
	/**
	 * @see https://www.libraw.org/docs/API-CXX.html#raw2image
	 */
	_libraw_raw2image(lr: LibRawDataT): ErrorCode;
	_libraw_dcraw_process(lr: LibRawDataT): ErrorCode;
	_libraw_dcraw_make_mem_image(lr: LibRawDataT): void;
	_libraw_get_raw_image(lr: LibRawDataT): void;
	_libraw_set_use_camera_wb(lr: LibRawDataT): void;
	/**
	 * @param error error code
	 * @returns {number} error message string pointer `char*`
	 */
	_libraw_strerror(error: ErrorCode): CharPtr;
	/**
	 * @returns {number} version string pointer `char*`
	 * @see https://www.libraw.org/docs/API-CXX.html#version
	 */
	_libraw_version(lr: LibRawDataT): CharPtr;
	/**
	 * @returns {number} version number
	 * @see https://www.libraw.org/docs/API-CXX.html#versionNumber
	 */
	_libraw_versionNumber(lr: LibRawDataT): number;
	_libraw_capabilities(lr: LibRawDataT): void;
	/**
	 * @returns {number} count of cameras supported
	 * @see https://www.libraw.org/docs/API-CXX.html#cameraCount
	 */
	_libraw_cameraCount(lr: LibRawDataT): number;
	/**
	 * @returns {number} camera names string array pointer `char**`
	 * @see https://www.libraw.org/docs/API-CXX.html#cameraList
	 */
	_libraw_cameraList(lr: LibRawDataT): CharPtrPtr;
	/**
	 * The function fills libraw_decoder_info_t structure by passed pointer with current raw decoder data.
	 * The function returns an integer number in accordance with the return code convention: positive if any system call has returned an error, negative (from the LibRaw error list) if there has been an error situation within LibRaw.
	 * @param info `libraw_decoder_info_t*`
	 * @see https://www.libraw.org/docs/API-CXX.html#get_decoder_info
	 */
	_libraw_get_decoder_info(info: Ptr): void;
	/**
	 * @returns {number} unpack function name string pointer `char*`
	 * @see https://www.libraw.org/docs/API-CXX.html#unpack_function_name
	 */
	_libraw_unpack_function_name(lr: LibRawDataT): CharPtr;
	/**
	 * Returns pixel color (color component number) in bayer pattern at row,col.
	 * @returns {number} value is in 0..3 range for 4-component Bayer (RGBG2, CMYG and so on) and in 0..2 range for 3-color data
	 * @see https://www.libraw.org/docs/API-CXX.html#COLOR
	 */
	_libraw_COLOR(lr: LibRawDataT, row: Int, col: Int): Int;
	/**
	 * This call will subtract black level values from RAW data (for suitable RAW data).
	 * `colordata.data_maximum` and `colordata.maximum` and black level data (colordata.black and colordata.cblack) will be adjusted too.
	 *
	 * This call should be used if you postprocess RAW data by your own code.
	 * LibRaw postprocessing functions will call subtract_black() by oneself.
	 *
	 * The function returns an integer number in accordance with the return code convention:
	 * positive if any system call has returned an error,
	 * negative (from the LibRaw error list) if there has been an error situation within LibRaw.
	 *
	 * @see https://www.libraw.org/docs/API-CXX.html#subtract_black
	 */
	_libraw_subtract_black(lr: LibRawDataT): void;
	/**
	 * This call closes input datastream with associated data buffer and unblocks opened file.
	 * @see https://www.libraw.org/docs/API-CXX.html#recycle_datastream
	 */
	_libraw_recycle_datastream(lr: LibRawDataT): void;
	/**
	 * Frees the allocated data of LibRaw instance, enabling one to process the next file using the same processor.
	 * Repeated calls of recycle() are quite possible and do not conflict with anything.
	 * @see https://www.libraw.org/docs/API-CXX.html#recycle
	 */
	_libraw_recycle(lr: LibRawDataT): void;
	/**
	 * Converts progress stage code to description string (in English).
	 * @param progress {number} progress stage code `enum LibRaw_progress`
	 * @returns {number} description string pointer `char*`
	 * @see https://www.libraw.org/docs/API-CXX.html#strprogress
	 */
	_libraw_strprogress(progress: number): CharPtr;
	HEAP8: Int8Array;
	HEAP16: Int16Array;
	HEAP32: Int32Array;
	HEAPF32: Float32Array;
	HEAPF64: Float64Array;
	HEAPU8: Uint8Array;
	HEAPU16: Uint16Array;
	HEAPU32: Uint32Array;
}

export class LibRaw implements Disposable {
	private disposed = false;
	private constructor(
		private libraw: LibRawWasmModule,
		private lr: LibRawDataT,
	) {}
	static async create() {
		const libraw: LibRawWasmModule = await initializeLibRawWasm();
		const lr = libraw._libraw_init(0);
		return new LibRaw(libraw, lr);
	}
	async open(buffer: ArrayBuffer) {
		// alloc memory
		const dataPtr = this.libraw._malloc(buffer.byteLength);
		const dataHeap = new Uint8Array(
			this.libraw.HEAPU8.buffer,
			dataPtr,
			buffer.byteLength,
		);
		dataHeap.set(new Uint8Array(buffer));
		// open buffer
		const code = this.libraw._libraw_open_buffer(
			this.lr,
			dataHeap.byteOffset,
			buffer.byteLength,
		);
		if (code) throw this.error(code);
	}
	async unpack() {
		const code = this.libraw._libraw_unpack(this.lr);
		if (code) throw this.error(code);
	}
	getRawHeight() {
		return this.libraw._libraw_get_raw_height(this.lr);
	}
	getRawWidth() {
		return this.libraw._libraw_get_raw_width(this.lr);
	}
	getIHeight() {
		return this.libraw._libraw_get_iheight(this.lr);
	}
	getIWidth() {
		return this.libraw._libraw_get_iwidth(this.lr);
	}
	version(): string {
		return this.readString(this.libraw._libraw_version(this.lr));
	}
	versionNumber(): number {
		return this.libraw._libraw_versionNumber(this.lr);
	}
	cameraCount(): number {
		return this.libraw._libraw_cameraCount(this.lr);
	}
	cameraList(): string[] {
		const length = this.cameraCount();
		const charPtrPtr = this.libraw._libraw_cameraList(this.lr);
		return Array.from({ length }, (_, i) => {
			const charPtr = this.libraw.HEAPU32[charPtrPtr / 4 + i] as CharPtr;
			return this.readString(charPtr);
		});
	}
	unpackFunctionName(): string {
		return this.readString(this.libraw._libraw_unpack_function_name(this.lr));
	}
	color(row: Int, col: Int): number {
		return this.libraw._libraw_COLOR(this.lr, row, col);
	}
	getIParams() {
		const ptr = { ptr: this.libraw._libraw_get_iparams(this.lr) };
		/**
		 * @see https://github.com/LibRaw/LibRaw/blob/cccb97647fcee56801fa68231fa8a38aa8b52ef7/libraw/libraw_types.h#L178-L198
		 * ```c
		 * typedef struct {
		 *   char guard[4];
		 *   char make[64];
		 *   char model[64];
		 *   char software[64];
		 *   char normalized_make[64];
		 *   char normalized_model[64];
		 *   unsigned maker_index;
		 *   unsigned raw_count;
		 *   unsigned dng_version;
		 *   unsigned is_foveon;
		 *   int colors;
		 *   unsigned filters;
		 *   char xtrans[6][6];
		 *   char xtrans_abs[6][6];
		 *   char cdesc[5];
		 *   unsigned xmplen;
		 *   char *xmpdata;
		 * } libraw_iparams_t;
		 * ```
		 */
		this.readU32(ptr); // guard
		const make = this.readString(ptr, { length: 64 });
		const model = this.readString(ptr, { length: 64 });
		const software = this.readString(ptr, { length: 64 });
		const normalizedMake = this.readString(ptr, { length: 64 });
		const normalizedModel = this.readString(ptr, { length: 64 });
		const makerIndex = this.readU32(ptr);
		const rawCount = this.readU32(ptr);
		const dngVersion = this.readU32(ptr);
		const isFoveon = this.readU32(ptr);
		const colors = this.readU32(ptr);
		const filters = this.readU32(ptr);
		const xtrans = Array.from({ length: 6 }, () =>
			Array.from({ length: 6 }, () => this.readU8(ptr)),
		);
		const xtransAbs = Array.from({ length: 6 }, () =>
			Array.from({ length: 6 }, () => this.readU8(ptr)),
		);
		const cdesc = this.readString(ptr, { length: 5 });
		const xmplen = this.readU32(ptr);
		const xmpdata = this.readString(ptr, { length: xmplen });

		return {
			make,
			model,
			software,
			normalizedMake,
			normalizedModel,
			makerIndex,
			rawCount,
			dngVersion,
			isFoveon,
			colors,
			filters,
			xtrans,
			xtransAbs,
			cdesc,
			xmplen,
			xmpdata,
		};
	}
	getLensInfo() {
		const ptr = { ptr: this.libraw._libraw_get_lensinfo(this.lr) };
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
		const minFocal = this.readF32(ptr);
		const maxFocal = this.readF32(ptr);
		const maxAp4MinFocal = this.readF32(ptr);
		const maxAp4MaxFocal = this.readF32(ptr);
		const exifMaxAp = this.readF32(ptr);
		const lensMake = this.readString(ptr, { length: 128 });
		const lens = this.readString(ptr, { length: 128 });
		const lensSerial = this.readString(ptr, { length: 128 });
		const internalLensSerial = this.readString(ptr, { length: 128 });
		const focalLengthIn35mmFormat = this.readU16(ptr);
		/**
		 * @see https://github.com/LibRaw/LibRaw/blob/cccb97647fcee56801fa68231fa8a38aa8b52ef7/libraw/libraw_types.h#L1007-L1011
		 * ```c
		 * typedef struct {
		 *   float EffectiveMaxAp;
		 *   uchar LensIDNumber, LensFStops, MCUVersion, LensType;
		 * } libraw_nikonlens_t;
		 * ```
		 */
		const nikonPtr = { ptr: this.readU8(ptr) };
		const nikon =
			nikonPtr.ptr === 0
				? undefined
				: {
						effectiveMaxAp: this.readF32(nikonPtr),
						lensIDNumber: this.readU8(nikonPtr),
						lensFStops: this.readU8(nikonPtr),
						mcuVersion: this.readU8(nikonPtr),
						lensType: this.readU8(nikonPtr),
				  };
		/**
		 * @see https://github.com/LibRaw/LibRaw/blob/cccb97647fcee56801fa68231fa8a38aa8b52ef7/libraw/libraw_types.h#L1013-L1016
		 * ```c
		 * typedef struct {
		 *   float MinFocal, MaxFocal, MaxAp4MinFocal, MaxAp4MaxFocal;
		 * } libraw_dnglens_t;
		 * ```
		 */
		const dngPtr = { ptr: this.readU8(ptr) };
		const dng =
			dngPtr.ptr === 0
				? undefined
				: {
						minFocal: this.readF32(dngPtr),
						maxFocal: this.readF32(dngPtr),
						maxAp4MinFocal: this.readF32(dngPtr),
						maxAp4MaxFocal: this.readF32(dngPtr),
				  };
		/**
		 * @see https://github.com/LibRaw/LibRaw/blob/cccb97647fcee56801fa68231fa8a38aa8b52ef7/libraw/libraw_types.h#L977-L1005
		 * ```c
		 * typedef struct {
		 *   unsigned long long LensID;
		 *   char Lens[128];
		 *   ushort LensFormat; // to characterize the image circle the lens covers
		 *   ushort LensMount;  // 'male', lens itself
		 *   unsigned long long CamID;
		 *   ushort CameraFormat; // some of the sensor formats
		 *   ushort CameraMount;  // 'female', body throat
		 *   char   body[64];
		 *   short  FocalType; // -1/0 is unknown; 1 is fixed focal; 2 is zoom
		 *   char   LensFeatures_pre[16], LensFeatures_suf[16];
		 *   float  MinFocal, MaxFocal;
		 *   float  MaxAp4MinFocal, MaxAp4MaxFocal, MinAp4MinFocal, MinAp4MaxFocal;
		 *   float  MaxAp, MinAp;
		 *   float  CurFocal, CurAp;
		 *   float  MaxAp4CurFocal, MinAp4CurFocal;
		 *   float  MinFocusDistance;
		 *   float  FocusRangeIndex;
		 *   float  LensFStops;
		 *   unsigned long long TeleconverterID;
		 *   char Teleconverter[128];
		 *   unsigned long long AdapterID;
		 *   char Adapter[128];
		 *   unsigned long long AttachmentID;
		 *   char   Attachment[128];
		 *   ushort FocalUnits;
		 *   float  FocalLengthIn35mmFormat;
		 * } libraw_makernotes_lens_t;
		 * ```
		 */
		const makernotesPtr = { ptr: this.readU8(ptr) };
		const makernotes =
			makernotesPtr.ptr === 0
				? undefined
				: {
						lensID: this.readU32(makernotesPtr),
						lens: this.readString(makernotesPtr, { length: 128 }),
						lensFormat: this.readU16(makernotesPtr),
						lensMount: this.readU16(makernotesPtr),
						camID: this.readU32(makernotesPtr),
						cameraFormat: this.readU16(makernotesPtr),
						cameraMount: this.readU16(makernotesPtr),
						body: this.readString(makernotesPtr, { length: 64 }),
						focalType: this.readI16(makernotesPtr),
						lensFeaturesPre: this.readString(makernotesPtr, { length: 16 }),
						lensFeaturesSuf: this.readString(makernotesPtr, { length: 16 }),
						minFocal: this.readF32(makernotesPtr),
						maxFocal: this.readF32(makernotesPtr),
						maxAp4MinFocal: this.readF32(makernotesPtr),
						maxAp4MaxFocal: this.readF32(makernotesPtr),
						minAp4MinFocal: this.readF32(makernotesPtr),
						minAp4MaxFocal: this.readF32(makernotesPtr),
						maxAp: this.readF32(makernotesPtr),
						minAp: this.readF32(makernotesPtr),
						curFocal: this.readF32(makernotesPtr),
						curAp: this.readF32(makernotesPtr),
						maxAp4CurFocal: this.readF32(makernotesPtr),
						minAp4CurFocal: this.readF32(makernotesPtr),
						minFocusDistance: this.readF32(makernotesPtr),
						focusRangeIndex: this.readF32(makernotesPtr),
						lensFStops: this.readF32(makernotesPtr),
						teleconverterID: this.readU32(makernotesPtr),
						teleconverter: this.readString(makernotesPtr, { length: 128 }),
						adapterID: this.readU32(makernotesPtr),
						adapter: this.readString(makernotesPtr, { length: 128 }),
						attachmentID: this.readU32(makernotesPtr),
						attachment: this.readString(makernotesPtr, { length: 128 }),
						focalUnits: this.readU16(makernotesPtr),
						focalLengthIn35mmFormat: this.readF32(makernotesPtr),
				  };

		return {
			minFocal,
			maxFocal,
			maxAp4MinFocal,
			maxAp4MaxFocal,
			exifMaxAp,
			lensMake,
			lens,
			lensSerial,
			internalLensSerial,
			focalLengthIn35mmFormat,
			nikon,
			dng,
			makernotes,
		};
	}
	private error(code: ErrorCode): string {
		return this.readString({ ptr: this.libraw._libraw_strerror(code) });
	}
	private readString(
		ptr: MutablePtr | CharPtr,
		options:
			| { stripZero?: boolean; length?: number; zeroTerminated: true }
			| { stripZero?: boolean; length: number; zeroTerminated?: boolean } = {
			zeroTerminated: true,
			stripZero: true,
		},
	) {
		const offset = typeof ptr === "number" ? ptr : ptr.ptr;
		const dataLength = options.length;
		const zeroIndex = this.libraw.HEAPU8.indexOf(0, offset);
		const length = Math.max(
			0,
			Math.min(dataLength ?? Infinity, zeroIndex - offset),
		);
		const heap = new Uint8Array(this.libraw.HEAPU8.buffer, offset, length);
		if (typeof ptr !== "number") ptr.ptr += dataLength ?? length;
		const str = new TextDecoder().decode(heap);
		return options.stripZero ? str.replace(/\0/g, "") : str;
	}
	private readI8(ptr: MutablePtr): number {
		const value = this.libraw.HEAP8[ptr.ptr];
		ptr.ptr += 1;
		return value;
	}
	private readI16(ptr: MutablePtr): number {
		const value = this.libraw.HEAP16[ptr.ptr / 2];
		ptr.ptr += 2;
		return value;
	}
	private readI32(ptr: MutablePtr): number {
		const value = this.libraw.HEAP32[ptr.ptr / 4];
		ptr.ptr += 4;
		return value;
	}
	private readU8(ptr: MutablePtr): number {
		const value = this.libraw.HEAPU8[ptr.ptr];
		ptr.ptr += 1;
		return value;
	}
	private readU16(ptr: MutablePtr): number {
		const value = this.libraw.HEAPU16[ptr.ptr / 2];
		ptr.ptr += 2;
		return value;
	}
	private readU32(ptr: MutablePtr): number {
		const value = this.libraw.HEAPU32[ptr.ptr / 4];
		ptr.ptr += 4;
		return value;
	}
	private readF32(ptr: MutablePtr): number {
		const value = this.libraw.HEAPF32[ptr.ptr / 4];
		ptr.ptr += 4;
		return value;
	}
	private readF64(ptr: MutablePtr): number {
		const value = this.libraw.HEAPF64[ptr.ptr / 8];
		ptr.ptr += 8;
		return value;
	}
	dispose() {
		if (this.disposed) return;
		this.libraw._libraw_close(this.lr);
		this.disposed = true;
	}
	[Symbol.dispose]() {
		this.dispose();
	}
}
