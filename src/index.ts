// @ts-expect-error
import initializeLibRawWasm from "./libraw.js";
import {
	CharPtr,
	ErrorCode,
	Float,
	Int,
	LibRawDataT,
	LibRawWasmModule,
} from "./types/index.js";

type MutablePtr = { ptr: number };

export type IParams = {
	make: string;
	model: string;
	software: string;
	normalizedMake: string;
	normalizedModel: string;
	makerIndex: number;
	rawCount: number;
	dngVersion: number;
	isFoveon: number;
	colors: number;
	filters: number;
	xtrans: number[][];
	xtransAbs: number[][];
	cdesc: string;
	xmplen: number;
	xmpdata: string;
};

export type LensInfo = {
	minFocal: number;
	maxFocal: number;
	maxAp4MinFocal: number;
	maxAp4MaxFocal: number;
	exifMaxAp: number;
	lensMake: string;
	lens: string;
	lensSerial: string;
	internalLensSerial: string;
	focalLengthIn35mmFormat: number;
	nikon?: NikonLens;
	dng?: DngLens;
	makernotes?: Makernotes;
};
export type NikonLens = {
	effectiveMaxAp: number;
	lensIDNumber: number;
	lensFStops: number;
	mcuVersion: number;
	lensType: number;
};
export type DngLens = {
	minFocal: number;
	maxFocal: number;
	maxAp4MinFocal: number;
	maxAp4MaxFocal: number;
};
export type Makernotes = {
	lensID: bigint;
	lens: string;
	lensFormat: number;
	lensMount: number;
	camID: bigint;
	cameraFormat: number;
	cameraMount: number;
	body: string;
	focalType: number;
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
	getCamMul(index: Int) {
		return this.libraw._libraw_get_cam_mul(this.lr, index);
	}
	getPreMul(index: Int) {
		return this.libraw._libraw_get_pre_mul(this.lr, index);
	}
	getRgbCam(index1: Int, index2: Int) {
		return this.libraw._libraw_get_rgb_cam(this.lr, index1, index2);
	}
	getColorMaximum() {
		return this.libraw._libraw_get_color_maximum(this.lr);
	}
	setUserMul(index: Int, val: Float) {
		this.libraw._libraw_set_user_mul(this.lr, index, val);
	}
	setDemosaic(value: Int) {
		this.libraw._libraw_set_demosaic(this.lr, value);
	}
	setAdjustMaximumThr(value: Float) {
		this.libraw._libraw_set_adjust_maximum_thr(this.lr, value);
	}
	setOutputColor(value: Int) {
		this.libraw._libraw_set_output_color(this.lr, value);
	}
	setOutputBps(value: Int) {
		this.libraw._libraw_set_output_bps(this.lr, value);
	}
	setGamma(index: Int, value: Float) {
		this.libraw._libraw_set_gamma(this.lr, index, value);
	}
	setNoAutoBright(value: Int) {
		this.libraw._libraw_set_no_auto_bright(this.lr, value);
	}
	setBright(value: Float) {
		this.libraw._libraw_set_bright(this.lr, value);
	}
	setHighlight(value: Int) {
		this.libraw._libraw_set_highlight(this.lr, value);
	}
	setFbddNoiserd(value: Int) {
		this.libraw._libraw_set_fbdd_noiserd(this.lr, value);
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
	getIParams(): IParams {
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
	getLensInfo(): LensInfo {
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
		const nikon: NikonLens = {
			effectiveMaxAp: this.readF32(ptr),
			lensIDNumber: this.readU8(ptr),
			lensFStops: this.readU8(ptr),
			mcuVersion: this.readU8(ptr),
			lensType: this.readU8(ptr),
		};
		/**
		 * @see https://github.com/LibRaw/LibRaw/blob/cccb97647fcee56801fa68231fa8a38aa8b52ef7/libraw/libraw_types.h#L1013-L1016
		 * ```c
		 * typedef struct {
		 *   float MinFocal, MaxFocal, MaxAp4MinFocal, MaxAp4MaxFocal;
		 * } libraw_dnglens_t;
		 * ```
		 */
		const dng: DngLens = {
			minFocal: this.readF32(ptr),
			maxFocal: this.readF32(ptr),
			maxAp4MinFocal: this.readF32(ptr),
			maxAp4MaxFocal: this.readF32(ptr),
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
		const makernotes: Makernotes = {
			lensID: this.readU64(ptr),
			lens: this.readString(ptr, { length: 128 }),
			lensFormat: this.readU16(ptr),
			lensMount: this.readU16(ptr),
			camID: this.readU64(ptr),
			cameraFormat: this.readU16(ptr),
			cameraMount: this.readU16(ptr),
			body: this.readString(ptr, { length: 64 }),
			focalType: this.readI16(ptr),
			lensFeaturesPre: this.readString(ptr, { length: 16 }),
			lensFeaturesSuf: this.readString(ptr, { length: 16 }),
			minFocal: this.readF32(ptr),
			maxFocal: this.readF32(ptr),
			maxAp4MinFocal: this.readF32(ptr),
			maxAp4MaxFocal: this.readF32(ptr),
			minAp4MinFocal: this.readF32(ptr),
			minAp4MaxFocal: this.readF32(ptr),
			maxAp: this.readF32(ptr),
			minAp: this.readF32(ptr),
			curFocal: this.readF32(ptr),
			curAp: this.readF32(ptr),
			maxAp4CurFocal: this.readF32(ptr),
			minAp4CurFocal: this.readF32(ptr),
			minFocusDistance: this.readF32(ptr),
			focusRangeIndex: this.readF32(ptr),
			lensFStops: this.readF32(ptr),
			teleconverterID: this.readU64(ptr),
			teleconverter: this.readString(ptr, { length: 128 }),
			adapterID: this.readU64(ptr),
			adapter: this.readString(ptr, { length: 128 }),
			attachmentID: this.readU64(ptr),
			attachment: this.readString(ptr, { length: 128 }),
			focalUnits: this.readU16(ptr),
			focalLengthIn35mmFormat: this.readF32(ptr),
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
	getImgOther(): ImgOther {
		const ptr = { ptr: this.libraw._libraw_get_imgother(this.lr) };
		/**
		 * @see https://github.com/LibRaw/LibRaw/blob/cccb97647fcee56801fa68231fa8a38aa8b52ef7/libraw/libraw_types.h#L838-L850
		 * ```c
		 * typedef struct {
		 *   float iso_speed;
		 *   float shutter;
		 *   float aperture;
		 *   float focal_len;
		 *   time_t timestamp;
		 *   unsigned shot_order;
		 *   unsigned gpsdata[32];
		 *   libraw_gps_info_t parsed_gps;
		 *   char desc[512], artist[64];
		 *   float analogbalance[4];
		 * } libraw_imgother_t;
		 * ```
		 */
		const isoSpeed = this.readF32(ptr);
		const shutter = this.readF32(ptr);
		const aperture = this.readF32(ptr);
		const focalLen = this.readF32(ptr);
		const timestamp = this.readU32(ptr);
		const shotOrder = this.readU32(ptr);
		const gpsdata = Array.from({ length: 32 }, () => this.readU32(ptr));
		/**
		 * @see https://github.com/LibRaw/LibRaw/blob/cccb97647fcee56801fa68231fa8a38aa8b52ef7/libraw/libraw_types.h#L828-L836
		 * ```c
		 * typedef struct {
		 *   float latitude[3];     // Deg,min,sec
		 *   float longitude[3];    // Deg,min,sec
		 *   float gpstimestamp[3]; // Deg,min,sec
		 *   float altitude;
		 *   char  altref, latref, longref, gpsstatus;
		 *   char  gpsparsed;
		 * } libraw_gps_info_t;
		 */
		const parsedGps: ParsedGps = {
			latitude: [
				this.readF32(ptr), // Deg
				this.readF32(ptr), // min
				this.readF32(ptr), // sec
			],
			longitude: [
				this.readF32(ptr), // Deg
				this.readF32(ptr), // min
				this.readF32(ptr), // sec
			],
			gpstimestamp: [
				this.readF32(ptr), // Deg
				this.readF32(ptr), // min
				this.readF32(ptr), // sec
			],
			altitude: this.readF32(ptr),
			altref: this.readU8(ptr),
			latref: this.readU8(ptr),
			longref: this.readU8(ptr),
			gpsstatus: this.readU8(ptr),
			gpsparsed: this.readU8(ptr),
		};
		const desc = this.readString(ptr, { length: 512 });
		const artist = this.readString(ptr, { length: 64 });
		const analogbalance = Array.from({ length: 4 }, () => this.readF32(ptr));
		return {
			isoSpeed,
			shutter,
			aperture,
			focalLen,
			timestamp,
			shotOrder,
			gpsdata,
			parsedGps,
			desc,
			artist,
			analogbalance,
		};
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
	// 	const decoderInfoPtr = this.libraw._malloc(8) as LibRawDecoderInfo;
	// 	const code = this.libraw._libraw_get_decoder_info(decoderInfoPtr);
	// 	console.log({ code });
	// 	if (code) throw this.error(code);
	// 	const ptr = { ptr: decoderInfoPtr };
	// 	return {
	// 		decoderName: this.readString(this.readU32(ptr) as CharPtr),
	// 		decoderFlags: this.readU32(ptr),
	// 	};
	// }
	private error(code: ErrorCode): string {
		return this.readString(this.libraw._libraw_strerror(code));
	}
	private readString(ptr: MutablePtr | CharPtr, options?: { length?: number }) {
		const { length: dataLength } = options ?? {};
		const offset = typeof ptr === "number" ? ptr : ptr.ptr;
		const zeroIndex = this.libraw.HEAPU8.indexOf(0, offset);
		const length = Math.max(
			0,
			Math.min(dataLength ?? Infinity, zeroIndex - offset),
		);
		const heap = new Uint8Array(this.libraw.HEAPU8.buffer, offset, length);
		if (typeof ptr !== "number") ptr.ptr += dataLength ?? length;
		const str = new TextDecoder().decode(heap);
		return str;
	}
	// private readI8(ptr: MutablePtr): number {
	// 	const value = this.libraw.HEAP8[ptr.ptr];
	// 	ptr.ptr += 1;
	// 	return value || 0;
	// }
	private readI16(ptr: MutablePtr): number {
		const value = this.libraw.HEAP16[ptr.ptr / 2];
		ptr.ptr += 2;
		return value || 0;
	}
	// private readI32(ptr: MutablePtr): number {
	// 	const value = this.libraw.HEAP32[ptr.ptr / 4];
	// 	ptr.ptr += 4;
	// 	return value || 0;
	// }
	private readU8(ptr: MutablePtr): number {
		const value = this.libraw.HEAPU8[ptr.ptr];
		ptr.ptr += 1;
		return value || 0;
	}
	private readU16(ptr: MutablePtr): number {
		const value = this.libraw.HEAPU16[ptr.ptr / 2];
		ptr.ptr += 2;
		return value || 0;
	}
	private readU32(ptr: MutablePtr): number {
		const value = this.libraw.HEAPU32[ptr.ptr / 4];
		ptr.ptr += 4;
		return value || 0;
	}
	private readU64(ptr: MutablePtr): bigint {
		ptr.ptr += 8;
		return 0n;
	}
	private readF32(ptr: MutablePtr): number {
		const value = this.libraw.HEAPF32[ptr.ptr / 4];
		ptr.ptr += 4;
		return value || 0;
	}
	// private readF64(ptr: MutablePtr): number {
	// 	const value = this.libraw.HEAPF64[ptr.ptr / 8];
	// 	ptr.ptr += 8;
	// 	return value || 0;
	// }
	dispose() {
		if (this.disposed) return;
		this.libraw._libraw_close(this.lr);
		this.disposed = true;
	}
	[Symbol.dispose]() {
		this.dispose();
	}
}
