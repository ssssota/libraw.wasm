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
	makernotes?: MakernotesLens;
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
export type MakernotesLens = {
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

export class LibRaw implements Disposable {
	private disposed = false;
	private get view(): DataView {
		return new DataView(this.libraw.HEAPU8.buffer);
	}
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
	async raw2image() {
		const code = this.libraw._libraw_raw2image(this.lr);
		if (code) throw this.error(code);
	}
	async dcrawProcess() {
		const code = this.libraw._libraw_dcraw_process(this.lr);
		if (code) throw this.error(code);
	}
	dcrawMakeMemImage() {
		const errcPtr = this.libraw._malloc(4);
		const ptr = {
			ptr: this.libraw._libraw_dcraw_make_mem_image(this.lr, errcPtr),
		};
		const code = this.readI32({ ptr: errcPtr });
		if (code) throw this.error(code as ErrorCode);
		if (!ptr.ptr) throw new Error("Unexpected error");
		/**
		 * @see https://github.com/LibRaw/LibRaw/blob/cccb97647fcee56801fa68231fa8a38aa8b52ef7/libraw/libraw_types.h#L170-L176
		 * @see https://github.com/LibRaw/LibRaw/blob/cccb97647fcee56801fa68231fa8a38aa8b52ef7/libraw/libraw_const.h#L804-L808
		 * ```c
		 * enum LibRaw_image_formats {
		 *   LIBRAW_IMAGE_JPEG = 1,
		 *   LIBRAW_IMAGE_BITMAP = 2
		 * };
		 * typedef struct {
		 *   enum LibRaw_image_formats type;
		 *   ushort height, width, colors, bits;
		 *   unsigned int data_size;
		 *   unsigned char data[1]; // uchar *data;
		 * } libraw_processed_image_t;
		 * ```
		 */
		const type = this.readI32(ptr);
		const height = this.readU16(ptr);
		const width = this.readU16(ptr);
		const colors = this.readU16(ptr);
		const bits = this.readU16(ptr);
		const dataSize = this.readU32(ptr);
		const data = new Uint8Array(
			this.libraw.HEAPU8.buffer,
			this.readU32(ptr),
			dataSize,
		);
		return {
			type: type === 1 ? "jpeg" : "bitmap",
			height,
			width,
			colors,
			bits,
			data,
		};
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
		const ptr = { ptr: this.libraw._libraw_cameraList(this.lr) };
		return Array.from({ length }, () => {
			const charPtr = this.readU32(ptr);
			return this.readString(charPtr as CharPtr);
		});
	}
	unpackFunctionName(): string {
		return this.readString(this.libraw._libraw_unpack_function_name(this.lr));
	}
	color(row: Int, col: Int): number {
		return this.libraw._libraw_COLOR(this.lr, row, col);
	}
	recycle() {
		this.libraw._libraw_recycle(this.lr);
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
		const makernotes: MakernotesLens = {
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
	getThumbnail() {
		const ptr = { ptr: this.libraw._libraw_get_thumbnail(this.lr) };
		/**
		 * @see https://github.com/LibRaw/LibRaw/blob/cccb97647fcee56801fa68231fa8a38aa8b52ef7/libraw/libraw_types.h#L804-L811
		 * ```c
		 * typedef struct {
		 *   enum LibRaw_thumbnail_formats tformat;
		 *   ushort twidth, theight;
		 *   unsigned tlength;
		 *   int tcolors;
		 *   char *thumb;
		 * } libraw_thumbnail_t;
		 * ```
		 */
		const tformat = this.getThumbnailFormat(this.readU32(ptr));
		const twidth = this.readU16(ptr);
		const theight = this.readU16(ptr);
		const tlength = this.readU32(ptr);
		const tcolors = this.readI32(ptr);
		const thumb = new Uint8Array(
			this.libraw.HEAPU8.buffer,
			this.readU32(ptr),
			tlength,
		).slice();
		return {
			tformat,
			twidth,
			theight,
			tlength,
			tcolors,
			thumb,
		};
	}
	private getThumbnailFormat(tformat: number): ThumbnailFormat {
		/**
		 * @see https://github.com/LibRaw/LibRaw/blob/cccb97647fcee56801fa68231fa8a38aa8b52ef7/libraw/libraw_const.h#L793-L802
		 * ```c
		 * enum LibRaw_thumbnail_formats {
		 *   LIBRAW_THUMBNAIL_UNKNOWN = 0,
		 *   LIBRAW_THUMBNAIL_JPEG = 1,
		 *   LIBRAW_THUMBNAIL_BITMAP = 2,
		 *   LIBRAW_THUMBNAIL_BITMAP16 = 3,
		 *   LIBRAW_THUMBNAIL_LAYER = 4,
		 *   LIBRAW_THUMBNAIL_ROLLEI = 5,
		 *   LIBRAW_THUMBNAIL_H265 = 6
		 * };
		 * ```
		 */
		switch (tformat) {
			case 1:
				return "jpeg";
			case 2:
				return "bitmap";
			case 3:
				return "bitmap16";
			case 4:
				return "layer";
			case 5:
				return "rollei";
			case 6:
				return "h265";
			default:
				return "unknown";
		}
	}
	getShootingInfo() {
		const ptr = { ptr: this.libraw._libraw_get_shootinginfo(this.lr) };
		/**
		 * @see https://github.com/LibRaw/LibRaw/blob/cccb97647fcee56801fa68231fa8a38aa8b52ef7/libraw/libraw_types.h#L1045-L1057
		 * ```c
		 * typedef struct
		 * {
		 *   short DriveMode;
		 *   short FocusMode;
		 *   short MeteringMode;
		 *   short AFPoint;
		 *   short ExposureMode;
		 *   short ExposureProgram;
		 *   short ImageStabilization;
		 *   char BodySerial[64];
		 *   char InternalBodySerial[64]; // this may be PCB or sensor serial, depends on make/model
		 * } libraw_shootinginfo_t;
		 * ```
		 */
		const driveMode = this.readI16(ptr);
		const focusMode = this.readI16(ptr);
		const meteringMode = this.readI16(ptr);
		const afPoint = this.readI16(ptr);
		const exposureMode = this.readI16(ptr);
		const exposureProgram = this.readI16(ptr);
		const imageStabilization = this.readI16(ptr);
		const bodySerial = this.readString(ptr, { length: 64 });
		const internalBodySerial = this.readString(ptr, { length: 64 });
		return {
			driveMode,
			focusMode,
			meteringMode,
			afPoint,
			exposureMode,
			exposureProgram,
			imageStabilization,
			bodySerial,
			internalBodySerial,
		};
	}
	getMakernotes() {
		const ptr = { ptr: this.libraw._libraw_get_makernotes(this.lr) };
		/**
		 * @see https://github.com/LibRaw/LibRaw/blob/cccb97647fcee56801fa68231fa8a38aa8b52ef7/libraw/libraw_types.h#L1028-L1043
		 * ```c
		 * typedef struct {
		 *   libraw_canon_makernotes_t canon;
		 *   libraw_nikon_makernotes_t nikon;
		 *   libraw_hasselblad_makernotes_t hasselblad;
		 *   libraw_fuji_info_t fuji;
		 *   libraw_olympus_makernotes_t olympus;
		 *   libraw_sony_info_t sony;
		 *   libraw_kodak_makernotes_t kodak;
		 *   libraw_panasonic_makernotes_t panasonic;
		 *   libraw_pentax_makernotes_t pentax;
		 *   libraw_p1_makernotes_t phaseone;
		 *   libraw_ricoh_makernotes_t ricoh;
		 *   libraw_samsung_makernotes_t samsung;
		 *   libraw_metadata_common_t common;
		 * } libraw_makernotes_t;
		 * ```
		 */
		return {
			canon: this.getCanonMakernotes(),
			nikon: this.getNikonMakernotes(),
			hasselblad: this.getHasselbladMakernotes(),
			fuji: this.getFujiInfo(),
			olympus: this.getOlympusMakernotes(),
			sony: this.getSonyInfo(),
			kodak: this.getKodakMakernotes(),
			panasonic: this.getPanasonicMakernotes(),
			pentax: this.getPentaxMakernotes(),
			phaseone: this.getPhaseOneMakernotes(),
			ricoh: this.getRicohMakernotes(),
			samsung: this.getSamsungMakernotes(),
			common: this.getCommonMetadata(),
		};
	}
	getCanonMakernotes() {
		const ptr = { ptr: this.libraw._libraw_get_canon_makernotes(this.lr) };
		/**
		 * @see https://github.com/LibRaw/LibRaw/blob/cccb97647fcee56801fa68231fa8a38aa8b52ef7/libraw/libraw_types.h#L260-L319
		 * @see https://github.com/LibRaw/LibRaw/blob/cccb97647fcee56801fa68231fa8a38aa8b52ef7/libraw/libraw_types.h#L217-L220
		 * ```c
		 * typedef struct {
		 *   short t,l,b,r; // top, left, bottom, right pixel coordinates, (0,0) is top left pixel;
		 * } libraw_area_t;
		 * typedef struct {
		 *   int ColorDataVer;
		 *   int ColorDataSubVer;
		 *   int SpecularWhiteLevel;
		 *   int NormalWhiteLevel;
		 *   int ChannelBlackLevel[4];
		 *   int AverageBlackLevel;
		 *   // multishot
		 *   unsigned int multishot[4];
		 *   // metering
		 *   short MeteringMode;
		 *   short SpotMeteringMode;
		 *   uchar FlashMeteringMode;
		 *   short FlashExposureLock;
		 *   short ExposureMode;
		 *   short AESetting;
		 *   // stabilization
		 *   short ImageStabilization;
		 *   // flash
		 *   short FlashMode;
		 *   short FlashActivity;
		 *   short FlashBits;
		 *   short ManualFlashOutput;
		 *   short FlashOutput;
		 *   short FlashGuideNumber;
		 *   // drive
		 *   short ContinuousDrive;
		 *   // sensor
		 *   short SensorWidth;
		 *   short SensorHeight;
		 *
		 *   int   AFMicroAdjMode;
		 *   float AFMicroAdjValue;
		 *   short MakernotesFlip;
		 *   short RecordMode;
		 *   short SRAWQuality;
		 *   unsigned wbi;
		 *   short RF_lensID;
		 *   int AutoLightingOptimizer;
		 *   int HighlightTonePriority;
		 *
		 *   // -1 = n/a            1 = Economy
		 *   // 2 = Normal         3 = Fine
		 *   // 4 = RAW            5 = Superfine
		 *   // 7 = CRAW         130 = Normal Movie, CRM LightRaw
		 *   // 131 = CRM  StandardRaw
		 *   short Quality;
		 *   // data compression curve
		 *   // 0 = OFF  1 = CLogV1 2 = CLogV2? 3 = CLogV3
		 *   int CanonLog;
		 *
		 *   libraw_area_t DefaultCropAbsolute;
		 *   libraw_area_t RecommendedImageArea;   // contains the image in proper aspect ratio?
		 *   libraw_area_t LeftOpticalBlack;       // use this, when present, to estimate black levels?
		 *   libraw_area_t UpperOpticalBlack;
		 *   libraw_area_t ActiveArea;
		 *
		 *   short ISOgain[2]; // AutoISO & BaseISO per ExifTool
		 * } libraw_canon_makernotes_t;
		 * ```
		 */
		const colorDataVer = this.readI32(ptr);
		const colorDataSubVer = this.readI32(ptr);
		const specularWhiteLevel = this.readI32(ptr);
		const normalWhiteLevel = this.readI32(ptr);
		const channelBlackLevel = [
			this.readI32(ptr),
			this.readI32(ptr),
			this.readI32(ptr),
			this.readI32(ptr),
		] as const;
		const averageBlackLevel = this.readI32(ptr);
		const multishot = [
			this.readU32(ptr),
			this.readU32(ptr),
			this.readU32(ptr),
			this.readU32(ptr),
		] as const;
		const meteringMode = this.readI16(ptr);
		const spotMeteringMode = this.readI16(ptr);
		const flashMeteringMode = this.readU8(ptr);
		const flashExposureLock = this.readI16(ptr);
		const exposureMode = this.readI16(ptr);
		const aeSetting = this.readI16(ptr);
		const imageStabilization = this.readI16(ptr);
		const flashMode = this.readI16(ptr);
		const flashActivity = this.readI16(ptr);
		const flashBits = this.readI16(ptr);
		const manualFlashOutput = this.readI16(ptr);
		const flashOutput = this.readI16(ptr);
		const flashGuideNumber = this.readI16(ptr);
		const continuousDrive = this.readI16(ptr);
		const sensorWidth = this.readI16(ptr);
		const sensorHeight = this.readI16(ptr);
		const afMicroAdjMode = this.readI32(ptr);
		const afMicroAdjValue = this.readF32(ptr);
		const makernotesFlip = this.readI16(ptr);
		const recordMode = this.readI16(ptr);
		const srawQuality = this.readI16(ptr);
		const wbi = this.readU32(ptr);
		const rfLensID = this.readI16(ptr);
		const autoLightingOptimizer = this.readI32(ptr);
		const highlightTonePriority = this.readI32(ptr);
		const quality = this.readI16(ptr);
		const canonLog = this.readI32(ptr);
		const defaultCropAbsolute = {
			t: this.readI16(ptr),
			l: this.readI16(ptr),
			b: this.readI16(ptr),
			r: this.readI16(ptr),
		};
		const recommendedImageArea = {
			t: this.readI16(ptr),
			l: this.readI16(ptr),
			b: this.readI16(ptr),
			r: this.readI16(ptr),
		};
		const leftOpticalBlack = {
			t: this.readI16(ptr),
			l: this.readI16(ptr),
			b: this.readI16(ptr),
			r: this.readI16(ptr),
		};
		const upperOpticalBlack = {
			t: this.readI16(ptr),
			l: this.readI16(ptr),
			b: this.readI16(ptr),
			r: this.readI16(ptr),
		};
		const activeArea = {
			t: this.readI16(ptr),
			l: this.readI16(ptr),
			b: this.readI16(ptr),
			r: this.readI16(ptr),
		};
		const isoGain = [this.readI16(ptr), this.readI16(ptr)] as const;
		return {
			colorDataVer,
			colorDataSubVer,
			specularWhiteLevel,
			normalWhiteLevel,
			channelBlackLevel,
			averageBlackLevel,
			multishot,
			meteringMode,
			spotMeteringMode,
			flashMeteringMode,
			flashExposureLock,
			exposureMode,
			aeSetting,
			imageStabilization,
			flashMode,
			flashActivity,
			flashBits,
			manualFlashOutput,
			flashOutput,
			flashGuideNumber,
			continuousDrive,
			sensorWidth,
			sensorHeight,
			afMicroAdjMode,
			afMicroAdjValue,
			makernotesFlip,
			recordMode,
			srawQuality,
			wbi,
			rfLensID,
			autoLightingOptimizer,
			highlightTonePriority,
			quality,
			canonLog,
			defaultCropAbsolute,
			recommendedImageArea,
			leftOpticalBlack,
			upperOpticalBlack,
			activeArea,
			isoGain,
		};
	}
	getNikonMakernotes() {
		const ptr = { ptr: this.libraw._libraw_get_nikon_makernotes(this.lr) };
		/**
		 * @see https://github.com/LibRaw/LibRaw/blob/cccb97647fcee56801fa68231fa8a38aa8b52ef7/libraw/libraw_types.h#L446-L517
		 * @see https://github.com/LibRaw/LibRaw/blob/cccb97647fcee56801fa68231fa8a38aa8b52ef7/libraw/libraw_types.h#L441-L444
		 * typedef struct {
		 *   ushort cleft, ctop, cwidth, cheight;
		 * } libraw_sensor_highspeed_crop_t;
		 * typedef struct {
		 *   double ExposureBracketValue;
		 *   ushort ActiveDLighting;
		 *   ushort ShootingMode;
		 *   // stabilization
		 *   uchar ImageStabilization[7];
		 *   uchar VibrationReduction;
		 *   uchar VRMode;
		 *   // flash
		 *   char  FlashSetting[13];
		 *   char  FlashType[20];
		 *   uchar FlashExposureCompensation[4];
		 *   uchar ExternalFlashExposureComp[4];
		 *   uchar FlashExposureBracketValue[4];
		 *   uchar FlashMode;
		 *   signed char FlashExposureCompensation2;
		 *   signed char FlashExposureCompensation3;
		 *   signed char FlashExposureCompensation4;
		 *   uchar  FlashSource;
		 *   uchar  FlashFirmware[2];
		 *   uchar  ExternalFlashFlags;
		 *   uchar  FlashControlCommanderMode;
		 *   uchar  FlashOutputAndCompensation;
		 *   uchar  FlashFocalLength;
		 *   uchar  FlashGNDistance;
		 *   uchar  FlashGroupControlMode[4];
		 *   uchar  FlashGroupOutputAndCompensation[4];
		 *   uchar  FlashColorFilter;
		 *
		 *   // NEF compression, comments follow those for ExifTool tag 0x0093:
		 *   // 1: Lossy (type 1)
		 *   // 2: Uncompressed
		 *   // 3: Lossless
		 *   // 4: Lossy (type 2)
		 *   // 5: Striped packed 12-bit
		 *   // 6: Uncompressed (14-bit reduced to 12-bit)
		 *   // 7: Unpacked 12-bit
		 *   // 8: Small raw
		 *   // 9: Packed 12-bit
		 *   // 10: Packed 14-bit
		 *   // 13: High Efficiency  (HE)
		 *   // 14: High Efficiency* (HE*)
		 *   ushort NEFCompression;
		 *
		 *   int    ExposureMode;
		 *   int    ExposureProgram;
		 *   int    nMEshots;
		 *   int    MEgainOn;
		 *   double ME_WB[4];
		 *   uchar  AFFineTune;
		 *   uchar  AFFineTuneIndex;
		 *   int8_t AFFineTuneAdj;
		 *   unsigned LensDataVersion;
		 *   unsigned FlashInfoVersion;
		 *   unsigned ColorBalanceVersion;
		 *   uchar key;
		 *   ushort NEFBitDepth[4];
		 *   ushort HighSpeedCropFormat; // 1 -> 1.3x; 2 -> DX; 3 -> 5:4; 4 -> 3:2; 6 ->
		 *   														//  16:9; 11 -> FX uncropped; 12 -> DX uncropped;
		 *   														//  17 -> 1:1
		 *   libraw_sensor_highspeed_crop_t SensorHighSpeedCrop;
		 *   ushort SensorWidth;
		 *   ushort SensorHeight;
		 *   ushort Active_D_Lighting;
		 *   unsigned ShotInfoVersion;
		 *   short MakernotesFlip;
		 *   double RollAngle;  // positive is clockwise, CW
		 *   double PitchAngle; // positive is upwords
		 *   double YawAngle;   // positive is to the right
		 * } libraw_nikon_makernotes_t;
		 */
		const exposureBracketValue = this.readF64(ptr);
		const activeDLighting = this.readU16(ptr);
		const shootingMode = this.readU16(ptr);
		const imageStabilization = [
			this.readU8(ptr),
			this.readU8(ptr),
			this.readU8(ptr),
			this.readU8(ptr),
			this.readU8(ptr),
			this.readU8(ptr),
			this.readU8(ptr),
		] as const;
		const vibrationReduction = this.readU8(ptr);
		const vrMode = this.readU8(ptr);
		const flashSetting = this.readString(ptr, { length: 13 });
		const flashType = this.readString(ptr, { length: 20 });
		const flashExposureCompensation = [
			this.readU8(ptr),
			this.readU8(ptr),
			this.readU8(ptr),
			this.readU8(ptr),
		] as const;
		const externalFlashExposureComp = [
			this.readU8(ptr),
			this.readU8(ptr),
			this.readU8(ptr),
			this.readU8(ptr),
		] as const;
		const flashExposureBracketValue = [
			this.readU8(ptr),
			this.readU8(ptr),
			this.readU8(ptr),
			this.readU8(ptr),
		] as const;
		const flashMode = this.readU8(ptr);
		const flashExposureCompensation2 = this.readI8(ptr);
		const flashExposureCompensation3 = this.readI8(ptr);
		const flashExposureCompensation4 = this.readI8(ptr);
		const flashSource = this.readU8(ptr);
		const flashFirmware = [this.readU8(ptr), this.readU8(ptr)] as const;
		const externalFlashFlags = this.readU8(ptr);
		const flashControlCommanderMode = this.readU8(ptr);
		const flashOutputAndCompensation = this.readU8(ptr);
		const flashFocalLength = this.readU8(ptr);
		const flashGNDistance = this.readU8(ptr);
		const flashGroupControlMode = [
			this.readU8(ptr),
			this.readU8(ptr),
			this.readU8(ptr),
			this.readU8(ptr),
		] as const;
		const flashGroupOutputAndCompensation = [
			this.readU8(ptr),
			this.readU8(ptr),
			this.readU8(ptr),
			this.readU8(ptr),
		] as const;
		const flashColorFilter = this.readU8(ptr);
		const nefCompression = this.readU16(ptr);
		const exposureMode = this.readI32(ptr);
		const exposureProgram = this.readI32(ptr);
		const nMEshots = this.readI32(ptr);
		const meGainOn = this.readI32(ptr);
		const meWb = [
			this.readF64(ptr),
			this.readF64(ptr),
			this.readF64(ptr),
			this.readF64(ptr),
		] as const;
		const afFineTune = this.readU8(ptr);
		const afFineTuneIndex = this.readU8(ptr);
		const afFineTuneAdj = this.readI8(ptr);
		const lensDataVersion = this.readU32(ptr);
		const flashInfoVersion = this.readU32(ptr);
		const colorBalanceVersion = this.readU32(ptr);
		const key = this.readU8(ptr);
		const nefBitDepth = [
			this.readU16(ptr),
			this.readU16(ptr),
			this.readU16(ptr),
			this.readU16(ptr),
		] as const;
		const highSpeedCropFormat = this.readU16(ptr);
		const sensorHighSpeedCrop = {
			cleft: this.readU16(ptr),
			ctop: this.readU16(ptr),
			cwidth: this.readU16(ptr),
			cheight: this.readU16(ptr),
		};
		const sensorWidth = this.readU16(ptr);
		const sensorHeight = this.readU16(ptr);
		const activeDLighting2 = this.readU16(ptr);
		const shotInfoVersion = this.readU32(ptr);
		const makernotesFlip = this.readI16(ptr);
		const rollAngle = this.readF64(ptr);
		const pitchAngle = this.readF64(ptr);
		const yawAngle = this.readF64(ptr);
		return {
			exposureBracketValue,
			activeDLighting,
			shootingMode,
			imageStabilization,
			vibrationReduction,
			vrMode,
			flashSetting,
			flashType,
			flashExposureCompensation,
			externalFlashExposureComp,
			flashExposureBracketValue,
			flashMode,
			flashExposureCompensation2,
			flashExposureCompensation3,
			flashExposureCompensation4,
			flashSource,
			flashFirmware,
			externalFlashFlags,
			flashControlCommanderMode,
			flashOutputAndCompensation,
			flashFocalLength,
			flashGNDistance,
			flashGroupControlMode,
			flashGroupOutputAndCompensation,
			flashColorFilter,
			nefCompression,
			exposureMode,
			exposureProgram,
			nMEshots,
			meGainOn,
			meWb,
			afFineTune,
			afFineTuneIndex,
			afFineTuneAdj,
			lensDataVersion,
			flashInfoVersion,
			colorBalanceVersion,
			key,
			nefBitDepth,
			highSpeedCropFormat,
			sensorHighSpeedCrop,
			sensorWidth,
			sensorHeight,
			activeDLighting2,
			shotInfoVersion,
			makernotesFlip,
			rollAngle,
			pitchAngle,
			yawAngle,
		};
	}
	getHasselbladMakernotes() {
		const ptr = { ptr: this.libraw._libraw_get_hasselblad_makernotes(this.lr) };
		/**
		 * @see https://github.com/LibRaw/LibRaw/blob/cccb97647fcee56801fa68231fa8a38aa8b52ef7/libraw/libraw_types.h#L321-L360
		 * ```c
		 * typedef struct
		 * {
		 *   int    BaseISO;
		 *   double Gain;
		 *   char   Sensor[8];
		 *   char   SensorUnit[64]; // SU
		 *   char   HostBody[64];   // HB
		 *   int    SensorCode;
		 *   int    SensorSubCode;
		 *   int    CoatingCode;
		 *   int    uncropped;
		 *
		 *   // CaptureSequenceInitiator is based on the content of the 'model' tag
		 *   // - values like 'Pinhole', 'Flash Sync', '500 Mech.' etc in .3FR 'model' tag
		 *   //   come from MAIN MENU > SETTINGS > Camera;
		 *   // - otherwise 'model' contains:
		 *   //   1. if CF/CFV/CFH, SU enclosure, can be with SU type if '-' is present
		 *   //   2. else if '-' is present, HB + SU type;
		 *   //   3. HB;
		 *   char CaptureSequenceInitiator[32];
		 *
		 *   // SensorUnitConnector, makernotes 0x0015 tag:
		 *   // - in .3FR - SU side
		 *   // - in .FFF - HB side
		 *   char SensorUnitConnector[64];
		 *
		 *   int format; // 3FR, FFF, Imacon (H3D-39 and maybe others), Hasselblad/Phocus DNG, Adobe DNG
		 *   int nIFD_CM[2]; // number of IFD containing CM
		 *   int RecommendedCrop[2];
		 *
		 *   // mnColorMatrix is in makernotes tag 0x002a;
		 *   // not present in .3FR files and Imacon/H3D-39 .FFF files;
		 *   // when present in .FFF and Phocus .DNG files, it is a copy of CM1 from .3FR;
		 *   // available samples contain all '1's in the first 3 elements
		 *   double mnColorMatrix[4][3];
		 *
		 * } libraw_hasselblad_makernotes_t;
		 * ```
		 */
		const baseIso = this.readI32(ptr);
		const gain = this.readF64(ptr);
		const sensor = this.readString(ptr, { length: 8 });
		const sensorUnit = this.readString(ptr, { length: 64 });
		const hostBody = this.readString(ptr, { length: 64 });
		const sensorCode = this.readI32(ptr);
		const sensorSubCode = this.readI32(ptr);
		const coatingCode = this.readI32(ptr);
		const uncropped = this.readI32(ptr);
		const captureSequenceInitiator = this.readString(ptr, { length: 32 });
		const sensorUnitConnector = this.readString(ptr, { length: 64 });
		const format = this.readI32(ptr);
		const nIfdCm = [this.readI32(ptr), this.readI32(ptr)] as const;
		const recommendedCrop = [this.readI32(ptr), this.readI32(ptr)] as const;
		const mnColorMatrix = [
			[this.readF64(ptr), this.readF64(ptr), this.readF64(ptr)],
			[this.readF64(ptr), this.readF64(ptr), this.readF64(ptr)],
			[this.readF64(ptr), this.readF64(ptr), this.readF64(ptr)],
			[this.readF64(ptr), this.readF64(ptr), this.readF64(ptr)],
		] as const;
		return {
			baseIso,
			gain,
			sensor,
			sensorUnit,
			hostBody,
			sensorCode,
			sensorSubCode,
			coatingCode,
			uncropped,
			captureSequenceInitiator,
			sensorUnitConnector,
			format,
			nIfdCm,
			recommendedCrop,
			mnColorMatrix,
		};
	}
	getFujiInfo() {
		const ptr = { ptr: this.libraw._libraw_get_fuji_info(this.lr) };
		/**
		 * @see https://github.com/LibRaw/LibRaw/blob/cccb97647fcee56801fa68231fa8a38aa8b52ef7/libraw/libraw_types.h#L362-L439
		 * ```c
		 * typedef struct {
		 *   float  ExpoMidPointShift;
		 *   ushort DynamicRange;
		 *   ushort FilmMode;
		 *   ushort DynamicRangeSetting;
		 *   ushort DevelopmentDynamicRange;
		 *   ushort AutoDynamicRange;
		 *   ushort DRangePriority;
		 *   ushort DRangePriorityAuto;
		 *   ushort DRangePriorityFixed;
		 *
		 *   // tag 0x9200, converted to BrightnessCompensation
		 *   // F700, S3Pro, S5Pro, S20Pro, S200EXR
		 *   // E550, E900, F810, S5600, S6500fd, S9000, S9500, S100FS
		 *   float BrightnessCompensation; // in EV, if =4, raw data * 2^4
		 *
		 *   ushort FocusMode;
		 *   ushort AFMode;
		 *   ushort FocusPixel[2];
		 *   ushort PrioritySettings;
		 *   unsigned FocusSettings;
		 *   unsigned AF_C_Settings;
		 *   ushort FocusWarning;
		 *   ushort ImageStabilization[3];
		 *   ushort FlashMode;
		 *   ushort WB_Preset;
		 *
		 *   // ShutterType:
		 *   // 		0 - mechanical
		 *   // 		1 = electronic
		 *   // 		2 = electronic, long shutter speed
		 *   // 		3 = electronic, front curtain
		 *   ushort ShutterType;
		 *   ushort ExrMode;
		 *   ushort Macro;
		 *   unsigned Rating;
		 *
		 *   // CropMode:
		 *   // 		1 - FF on GFX,
		 *   // 		2 - sports finder (mechanical shutter),
		 *   // 		4 - 1.25x crop (electronic shutter, continuous high)
		 *   ushort CropMode;
		 *   char   SerialSignature[0x0c + 1];
		 *   char   SensorID[4 + 1];
		 *   char   RAFVersion[4 + 1];
		 *   int    RAFDataGeneration; // 0 (none), 1..4, 4096
		 *   ushort RAFDataVersion;
		 *   int    isTSNERDTS;
		 *
		 *   // DriveMode:
		 *   // 		0 - single frame
		 *   // 		1 - continuous low
		 *   // 		2 - continuous high
		 *   short DriveMode;
		 *
		 *   // tag 0x4000 BlackLevel:
		 *   // S9100, S9000, S7000, S6000fd, S5200, S5100, S5000,
		 *   // S5Pro, S3Pro, S2Pro, S20Pro,
		 *   // S200EXR, S100FS,
		 *   // F810, F700,
		 *   // E900, E550,
		 *   // DBP, and aliases for all of the above
		 *   ushort BlackLevel[9];
		 *   unsigned RAFData_ImageSizeTable[32];
		 *   int AutoBracketing;
		 *   int SequenceNumber;
		 *   int SeriesLength;
		 *   float PixelShiftOffset[2];
		 *   int ImageCount;
		 * } libraw_fuji_info_t;
		 * ```
		 */
		const expoMidPointShift = this.readF32(ptr);
		const dynamicRange = this.readU16(ptr);
		const filmMode = this.readU16(ptr);
		const dynamicRangeSetting = this.readU16(ptr);
		const developmentDynamicRange = this.readU16(ptr);
		const autoDynamicRange = this.readU16(ptr);
		const dRangePriority = this.readU16(ptr);
		const dRangePriorityAuto = this.readU16(ptr);
		const dRangePriorityFixed = this.readU16(ptr);
		const brightnessCompensation = this.readF32(ptr);
		const focusMode = this.readU16(ptr);
		const afMode = this.readU16(ptr);
		const focusPixel = [this.readU16(ptr), this.readU16(ptr)] as const;
		const prioritySettings = this.readU16(ptr);
		const focusSettings = this.readU32(ptr);
		const afCSettings = this.readU32(ptr);
		const focusWarning = this.readU16(ptr);
		const imageStabilization = [
			this.readU16(ptr),
			this.readU16(ptr),
			this.readU16(ptr),
		] as const;
		const flashMode = this.readU16(ptr);
		const wbPreset = this.readU16(ptr);
		const shutterType = this.readU16(ptr);
		const exrMode = this.readU16(ptr);
		const macro = this.readU16(ptr);
		const rating = this.readU32(ptr);
		const cropMode = this.readU16(ptr);
		const serialSignature = this.readString(ptr, { length: 13 });
		const sensorID = this.readString(ptr, { length: 5 });
		const rafVersion = this.readString(ptr, { length: 5 });
		const rafDataGeneration = this.readI32(ptr);
		const rafDataVersion = this.readU16(ptr);
		const isTSNERDTS = this.readI32(ptr);
		const driveMode = this.readI16(ptr);
		const blackLevel = [
			this.readU16(ptr),
			this.readU16(ptr),
			this.readU16(ptr),
			this.readU16(ptr),
			this.readU16(ptr),
			this.readU16(ptr),
			this.readU16(ptr),
			this.readU16(ptr),
			this.readU16(ptr),
		] as const;
		const rafDataImageSizeTable = Array.from({ length: 32 }, () =>
			this.readU32(ptr),
		);
		const autoBracketing = this.readI32(ptr);
		const sequenceNumber = this.readI32(ptr);
		const seriesLength = this.readI32(ptr);
		const pixelShiftOffset = [this.readF32(ptr), this.readF32(ptr)] as const;
		const imageCount = this.readI32(ptr);
		return {
			expoMidPointShift,
			dynamicRange,
			filmMode,
			dynamicRangeSetting,
			developmentDynamicRange,
			autoDynamicRange,
			dRangePriority,
			dRangePriorityAuto,
			dRangePriorityFixed,
			brightnessCompensation,
			focusMode,
			afMode,
			focusPixel,
			prioritySettings,
			focusSettings,
			afCSettings,
			focusWarning,
			imageStabilization,
			flashMode,
			wbPreset,
			shutterType,
			exrMode,
			macro,
			rating,
			cropMode,
			serialSignature,
			sensorID,
			rafVersion,
			rafDataGeneration,
			rafDataVersion,
			isTSNERDTS,
			driveMode,
			blackLevel,
			rafDataImageSizeTable,
			autoBracketing,
			sequenceNumber,
			seriesLength,
			pixelShiftOffset,
			imageCount,
		};
	}
	getOlympusMakernotes() {
		const ptr = { ptr: this.libraw._libraw_get_olympus_makernotes(this.lr) };
		/**
		 * @see https://github.com/LibRaw/LibRaw/blob/cccb97647fcee56801fa68231fa8a38aa8b52ef7/libraw/libraw_types.h#L519-L546
		 * ```c
		 * typedef struct {
		 *   char     CameraType2[6];
		 *   ushort   ValidBits;
		 *   int      SensorCalibration[2];
		 *   ushort   DriveMode[5];
		 *   ushort   ColorSpace;
		 *   ushort   FocusMode[2];
		 *   ushort   AutoFocus;
		 *   ushort   AFPoint;
		 *   unsigned AFAreas[64];
		 *   double   AFPointSelected[5];
		 *   ushort   AFResult;
		 *   uchar    AFFineTune;
		 *   short    AFFineTuneAdj[3];
		 *   unsigned SpecialMode[3];
		 *   ushort   ZoomStepCount;
		 *   ushort   FocusStepCount;
		 *   ushort   FocusStepInfinity;
		 *   ushort   FocusStepNear;
		 *   double   FocusDistance;
		 *   ushort   AspectFrame[4]; // left, top, width, height
		 *   unsigned StackedImage[2];
		 *   uchar    isLiveND;
		 *   unsigned LiveNDfactor;
		 *   ushort   Panorama_mode;
		 *   ushort   Panorama_frameNum;
		 * } libraw_olympus_makernotes_t;
		 * ```
		 */
		const cameraType2 = this.readString(ptr, { length: 6 });
		const validBits = this.readU16(ptr);
		const sensorCalibration = [this.readI32(ptr), this.readI32(ptr)] as const;
		const driveMode = [
			this.readU16(ptr),
			this.readU16(ptr),
			this.readU16(ptr),
			this.readU16(ptr),
			this.readU16(ptr),
		] as const;
		const colorSpace = this.readU16(ptr);
		const focusMode = [this.readU16(ptr), this.readU16(ptr)] as const;
		const autoFocus = this.readU16(ptr);
		const afPoint = this.readU16(ptr);
		const afAreas = Array.from({ length: 64 }, () => this.readU32(ptr));
		const afPointSelected = [
			this.readF64(ptr),
			this.readF64(ptr),
			this.readF64(ptr),
			this.readF64(ptr),
			this.readF64(ptr),
		] as const;
		const afResult = this.readU16(ptr);
		const afFineTune = this.readU8(ptr);
		const afFineTuneAdj = [
			this.readI16(ptr),
			this.readI16(ptr),
			this.readI16(ptr),
		] as const;
		const specialMode = [
			this.readU32(ptr),
			this.readU32(ptr),
			this.readU32(ptr),
		] as const;
		const zoomStepCount = this.readU16(ptr);
		const focusStepCount = this.readU16(ptr);
		const focusStepInfinity = this.readU16(ptr);
		const focusStepNear = this.readU16(ptr);
		const focusDistance = this.readF64(ptr);
		const aspectFrame = [
			this.readU16(ptr),
			this.readU16(ptr),
			this.readU16(ptr),
			this.readU16(ptr),
		] as const;
		const stackedImage = [this.readU32(ptr), this.readU32(ptr)] as const;
		const isLiveNd = this.readU8(ptr);
		const liveNdFactor = this.readU32(ptr);
		const panoramaMode = this.readU16(ptr);
		const panoramaFrameNum = this.readU16(ptr);
		return {
			cameraType2,
			validBits,
			sensorCalibration,
			driveMode,
			colorSpace,
			focusMode,
			autoFocus,
			afPoint,
			afAreas,
			afPointSelected,
			afResult,
			afFineTune,
			afFineTuneAdj,
			specialMode,
			zoomStepCount,
			focusStepCount,
			focusStepInfinity,
			focusStepNear,
			focusDistance,
			aspectFrame,
			stackedImage,
			isLiveNd,
			liveNdFactor,
			panoramaMode,
			panoramaFrameNum,
		};
	}
	getSonyInfo() {
		const ptr = { ptr: this.libraw._libraw_get_sony_info(this.lr) };
		/**
		 * @see https://github.com/LibRaw/LibRaw/blob/cccb97647fcee56801fa68231fa8a38aa8b52ef7/libraw/libraw_types.h#L641-L736
		 * ```c
		 * typedef struct {
		 *   // afdata:
		 *   // 0x0010 CameraInfo
		 *   // 0x2020 AFPointsUsed
		 *   // 0x2022 FocalPlaneAFPointsUsed
		 *   // 0x202a Tag202a
		 *   // 0x940e AFInfo
		 *   ushort   CameraType;                      // init in 0xffff
		 *   uchar    Sony0x9400_version; // 0 if not found/deciphered, 0xa, 0xb, 0xc following exiftool convention
		 *   uchar    Sony0x9400_ReleaseMode2;
		 *   unsigned Sony0x9400_SequenceImageNumber;
		 *   uchar    Sony0x9400_SequenceLength1;
		 *   unsigned Sony0x9400_SequenceFileNumber;
		 *   uchar    Sony0x9400_SequenceLength2;
		 *   uint8_t  AFAreaModeSetting;               // init in 0xff; +
		 *   uint16_t AFAreaMode;                      // init in 0xffff; +
		 *   ushort   FlexibleSpotPosition[2];         // init in (0xffff, 0xffff)
		 *   uint8_t  AFPointSelected;                 // init in 0xff
		 *   uint8_t  AFPointSelected_0x201e;          // init in 0xff
		 *   short    nAFPointsUsed;
		 *   uint8_t  AFPointsUsed[10];
		 *   uint8_t  AFTracking;                      // init in 0xff
		 *   uint8_t  AFType;
		 *   ushort   FocusLocation[4];
		 *   ushort   FocusPosition;                    // init in 0xffff
		 *   int8_t   AFMicroAdjValue;                  // init in 0x7f
		 *   int8_t   AFMicroAdjOn;                     // init in -1
		 *   uchar    AFMicroAdjRegisteredLenses;       // init in 0xff
		 *   ushort   VariableLowPassFilter;
		 *   unsigned LongExposureNoiseReduction;      // init in 0xffffffff
		 *   ushort   HighISONoiseReduction;           // init in 0xffff
		 *   ushort   HDR[2];
		 *   ushort   group2010;
		 *   ushort   group9050;
		 *   ushort   real_iso_offset;                 // init in 0xffff
		 *   ushort   MeteringMode_offset;
		 *   ushort   ExposureProgram_offset;
		 *   ushort   ReleaseMode2_offset;
		 *   unsigned MinoltaCamID;                    // init in 0xffffffff
		 *   float    firmware;
		 *   ushort   ImageCount3_offset;              // init in 0xffff
		 *   unsigned ImageCount3;
		 *   unsigned ElectronicFrontCurtainShutter;   // init in 0xffffffff
		 *   ushort   MeteringMode2;
		 *   char     SonyDateTime[20];
		 *   unsigned ShotNumberSincePowerUp;
		 *   ushort   PixelShiftGroupPrefix;
		 *   unsigned PixelShiftGroupID;
		 *   char     nShotsInPixelShiftGroup;
		 *   char     numInPixelShiftGroup; // '0' if ARQ, first shot in the group has '1' here
		 *   ushort   prd_ImageHeight, prd_ImageWidth;
		 *   ushort   prd_Total_bps;
		 *   ushort   prd_Active_bps;
		 *   ushort   prd_StorageMethod; // 82 -> Padded; 89 -> Linear
		 *   ushort   prd_BayerPattern;  // 0 -> not valid; 1 -> RGGB; 4 -> GBRG
		 *
		 *   ushort   SonyRawFileType; // init in 0xffff
		 *   													// valid for ARW 2.0 and up (FileFormat >= 3000)
		 *   													// takes precedence over RAWFileType and Quality:
		 *   													// 0  for uncompressed 14-bit raw
		 *   													// 1  for uncompressed 12-bit raw
		 *   													// 2  for compressed raw (lossy)
		 *   													// 3  for lossless compressed raw
		 *   													// 4  for lossless compressed raw v.2 (ILCE-1)
		 *   ushort RAWFileType;       // init in 0xffff
		 *   													// takes precedence over Quality
		 *   													// 0 for compressed raw,
		 *   													// 1 for uncompressed;
		 *   													// 2 lossless compressed raw v.2
		 *   ushort RawSizeType;				// init in 0xffff
		 *   													// 1 - large,
		 *   													// 2 - small,
		 *   													// 3 - medium
		 *   unsigned Quality;					// init in 0xffffffff
		 *   													// 0 or 6 for raw, 7 or 8 for compressed raw
		 *   ushort FileFormat;				// 1000 SR2
		 *   													// 2000 ARW 1.0
		 *   													// 3000 ARW 2.0
		 *   													// 3100 ARW 2.1
		 *   													// 3200 ARW 2.2
		 *   													// 3300 ARW 2.3
		 *   													// 3310 ARW 2.3.1
		 *   													// 3320 ARW 2.3.2
		 *   													// 3330 ARW 2.3.3
		 *   													// 3350 ARW 2.3.5
		 *   													// 4000 ARW 4.0
		 *   char MetaVersion [16];
		 * } libraw_sony_info_t;
		 * ```
		 */
		const cameraType = this.readU16(ptr);
		const sony0x9400Version = this.readU8(ptr);
		const sony0x9400ReleaseMode2 = this.readU8(ptr);
		const sony0x9400SequenceImageNumber = this.readU32(ptr);
		const sony0x9400SequenceLength1 = this.readU8(ptr);
		const sony0x9400SequenceFileNumber = this.readU32(ptr);
		const sony0x9400SequenceLength2 = this.readU8(ptr);
		const afAreaModeSetting = this.readU8(ptr);
		const afAreaMode = this.readU16(ptr);
		const flexibleSpotPosition = [
			this.readU16(ptr),
			this.readU16(ptr),
		] as const;
		const afPointSelected = this.readU8(ptr);
		const afPointSelected0x201e = this.readU8(ptr);
		const nAfPointsUsed = this.readI16(ptr);
		const afPointsUsed = Array.from({ length: 10 }, () => this.readU8(ptr));
		const afTracking = this.readU8(ptr);
		const afType = this.readU8(ptr);
		const focusLocation = [
			this.readU16(ptr),
			this.readU16(ptr),
			this.readU16(ptr),
			this.readU16(ptr),
		] as const;
		const focusPosition = this.readU16(ptr);
		const afMicroAdjValue = this.readI8(ptr);
		const afMicroAdjOn = this.readI8(ptr);
		const afMicroAdjRegisteredLenses = this.readU8(ptr);
		const variableLowPassFilter = this.readU16(ptr);
		const longExposureNoiseReduction = this.readU32(ptr);
		const highIsoNoiseReduction = this.readU16(ptr);
		const hdr = [this.readU16(ptr), this.readU16(ptr)] as const;
		const group2010 = this.readU16(ptr);
		const group9050 = this.readU16(ptr);
		const realIsoOffset = this.readU16(ptr);
		const meteringModeOffset = this.readU16(ptr);
		const exposureProgramOffset = this.readU16(ptr);
		const releaseMode2Offset = this.readU16(ptr);
		const minoltaCamId = this.readU32(ptr);
		const firmware = this.readF32(ptr);
		const imageCount3Offset = this.readU16(ptr);
		const imageCount3 = this.readU32(ptr);
		const electronicFrontCurtainShutter = this.readU32(ptr);
		const meteringMode2 = this.readU16(ptr);
		const sonyDateTime = this.readString(ptr, { length: 20 });
		const shotNumberSincePowerUp = this.readU32(ptr);
		const pixelShiftGroupPrefix = this.readU16(ptr);
		const pixelShiftGroupId = this.readU32(ptr);
		const nShotsInPixelShiftGroup = this.readU8(ptr);
		const numInPixelShiftGroup = this.readU8(ptr);
		const prdImageHeight = this.readU16(ptr);
		const prdImageWidth = this.readU16(ptr);
		const prdTotalBps = this.readU16(ptr);
		const prdActiveBps = this.readU16(ptr);
		const prdStorageMethod = this.readU16(ptr);
		const prdBayerPattern = this.readU16(ptr);
		const sonyRawFileType = this.readU16(ptr);
		const rawFileType = this.readU16(ptr);
		const rawSizeType = this.readU16(ptr);
		const quality = this.readU32(ptr);
		const fileFormat = this.readU16(ptr);
		const metaVersion = this.readString(ptr, { length: 16 });
		return {
			cameraType,
			sony0x9400Version,
			sony0x9400ReleaseMode2,
			sony0x9400SequenceImageNumber,
			sony0x9400SequenceLength1,
			sony0x9400SequenceFileNumber,
			sony0x9400SequenceLength2,
			afAreaModeSetting,
			afAreaMode,
			flexibleSpotPosition,
			afPointSelected,
			afPointSelected0x201e,
			nAfPointsUsed,
			afPointsUsed,
			afTracking,
			afType,
			focusLocation,
			focusPosition,
			afMicroAdjValue,
			afMicroAdjOn,
			afMicroAdjRegisteredLenses,
			variableLowPassFilter,
			longExposureNoiseReduction,
			highIsoNoiseReduction,
			hdr,
			group2010,
			group9050,
			realIsoOffset,
			meteringModeOffset,
			exposureProgramOffset,
			releaseMode2Offset,
			minoltaCamId,
			firmware,
			imageCount3Offset,
			imageCount3,
			electronicFrontCurtainShutter,
			meteringMode2,
			sonyDateTime,
			shotNumberSincePowerUp,
			pixelShiftGroupPrefix,
			pixelShiftGroupId,
			nShotsInPixelShiftGroup,
			numInPixelShiftGroup,
			prdImageHeight,
			prdImageWidth,
			prdTotalBps,
			prdActiveBps,
			prdStorageMethod,
			prdBayerPattern,
			sonyRawFileType,
			rawFileType,
			rawSizeType,
			quality,
			fileFormat,
			metaVersion,
		};
	}
	getKodakMakernotes() {
		const ptr = { ptr: this.libraw._libraw_get_kodak_makernotes(this.lr) };
		/**
		 * @see https://github.com/LibRaw/LibRaw/blob/cccb97647fcee56801fa68231fa8a38aa8b52ef7/libraw/libraw_types.h#L616-L632
		 * ```c
		 * typedef struct {
		 *   ushort BlackLevelTop;
		 *   ushort BlackLevelBottom;
		 *   short offset_left, offset_top; // KDC files, negative values or zeros
		 *   ushort clipBlack, clipWhite;   // valid for P712, P850, P880
		 *   float romm_camDaylight[3][3];
		 *   float romm_camTungsten[3][3];
		 *   float romm_camFluorescent[3][3];
		 *   float romm_camFlash[3][3];
		 *   float romm_camCustom[3][3];
		 *   float romm_camAuto[3][3];
		 *   ushort val018percent, val100percent, val170percent;
		 *   short MakerNoteKodak8a;
		 *   float ISOCalibrationGain;
		 *   float AnalogISO;
		 * } libraw_kodak_makernotes_t;
		 * ```
		 */
		const blackLevelTop = this.readU16(ptr);
		const blackLevelBottom = this.readU16(ptr);
		const offsetLeft = this.readI16(ptr);
		const offsetTop = this.readI16(ptr);
		const clipBlack = this.readU16(ptr);
		const clipWhite = this.readU16(ptr);
		const rommCamDaylight = [
			[this.readF32(ptr), this.readF32(ptr), this.readF32(ptr)],
			[this.readF32(ptr), this.readF32(ptr), this.readF32(ptr)],
			[this.readF32(ptr), this.readF32(ptr), this.readF32(ptr)],
		] as const;
		const rommCamTungsten = [
			[this.readF32(ptr), this.readF32(ptr), this.readF32(ptr)],
			[this.readF32(ptr), this.readF32(ptr), this.readF32(ptr)],
			[this.readF32(ptr), this.readF32(ptr), this.readF32(ptr)],
		] as const;
		const rommCamFluorescent = [
			[this.readF32(ptr), this.readF32(ptr), this.readF32(ptr)],
			[this.readF32(ptr), this.readF32(ptr), this.readF32(ptr)],
			[this.readF32(ptr), this.readF32(ptr), this.readF32(ptr)],
		] as const;
		const rommCamFlash = [
			[this.readF32(ptr), this.readF32(ptr), this.readF32(ptr)],
			[this.readF32(ptr), this.readF32(ptr), this.readF32(ptr)],
			[this.readF32(ptr), this.readF32(ptr), this.readF32(ptr)],
		] as const;
		const rommCamCustom = [
			[this.readF32(ptr), this.readF32(ptr), this.readF32(ptr)],
			[this.readF32(ptr), this.readF32(ptr), this.readF32(ptr)],
			[this.readF32(ptr), this.readF32(ptr), this.readF32(ptr)],
		] as const;
		const rommCamAuto = [
			[this.readF32(ptr), this.readF32(ptr), this.readF32(ptr)],
			[this.readF32(ptr), this.readF32(ptr), this.readF32(ptr)],
			[this.readF32(ptr), this.readF32(ptr), this.readF32(ptr)],
		] as const;
		const val018percent = this.readU16(ptr);
		const val100percent = this.readU16(ptr);
		const val170percent = this.readU16(ptr);
		const makerNoteKodak8a = this.readI16(ptr);
		const isoCalibrationGain = this.readF32(ptr);
		const analogIso = this.readF32(ptr);
		return {
			blackLevelTop,
			blackLevelBottom,
			offsetLeft,
			offsetTop,
			clipBlack,
			clipWhite,
			rommCamDaylight,
			rommCamTungsten,
			rommCamFluorescent,
			rommCamFlash,
			rommCamCustom,
			rommCamAuto,
			val018percent,
			val100percent,
			val170percent,
			makerNoteKodak8a,
			isoCalibrationGain,
			analogIso,
		};
	}
	getPanasonicMakernotes() {
		const ptr = { ptr: this.libraw._libraw_get_panasonic_makernotes(this.lr) };
		/**
		 * @see https://github.com/LibRaw/LibRaw/blob/cccb97647fcee56801fa68231fa8a38aa8b52ef7/libraw/libraw_types.h#L548-L567
		 * ```c
		 * typedef struct {
		 *   // Compression:
		 *   //  34826 (Panasonic RAW 2): LEICA DIGILUX 2;
		 *   //  34828 (Panasonic RAW 3): LEICA D-LUX 3; LEICA V-LUX 1; Panasonic DMC-LX1;
		 *   //  Panasonic DMC-LX2; Panasonic DMC-FZ30; Panasonic DMC-FZ50; 34830 (not in
		 *   //  exiftool): LEICA DIGILUX 3; Panasonic DMC-L1; 34316 (Panasonic RAW 1):
		 *   //  others (LEICA, Panasonic, YUNEEC);
		 *   ushort   Compression;
		 *   ushort   BlackLevelDim;
		 *   float    BlackLevel[8];
		 *   unsigned Multishot; // 0 is Off, 65536 is Pixel Shift
		 *   float    gamma;
		 *   int      HighISOMultiplier[3]; // 0->R, 1->G, 2->B
		 *   short    FocusStepNear;
		 *   short    FocusStepCount;
		 *   unsigned ZoomPosition;
		 *   unsigned LensManufacturer;
		 * } libraw_panasonic_makernotes_t;
		 * ```
		 */
		const compression = this.readU16(ptr);
		const blackLevelDim = this.readU16(ptr);
		const blackLevel = [
			this.readF32(ptr),
			this.readF32(ptr),
			this.readF32(ptr),
			this.readF32(ptr),
			this.readF32(ptr),
			this.readF32(ptr),
			this.readF32(ptr),
			this.readF32(ptr),
		] as const;
		const multishot = this.readU32(ptr);
		const gamma = this.readF32(ptr);
		const highIsoMultiplier = [
			this.readI32(ptr),
			this.readI32(ptr),
			this.readI32(ptr),
		] as const;
		const focusStepNear = this.readI16(ptr);
		const focusStepCount = this.readI16(ptr);
		const zoomPosition = this.readU32(ptr);
		const lensManufacturer = this.readU32(ptr);
		return {
			compression,
			blackLevelDim,
			blackLevel,
			multishot,
			gamma,
			highIsoMultiplier,
			focusStepNear,
			focusStepCount,
			zoomPosition,
			lensManufacturer,
		};
	}
	getPentaxMakernotes() {
		const ptr = { ptr: this.libraw._libraw_get_pentax_makernotes(this.lr) };
		/**
		 * @see https://github.com/LibRaw/LibRaw/blob/cccb97647fcee56801fa68231fa8a38aa8b52ef7/libraw/libraw_types.h#L569-L583
		 * ```c
		 * typedef struct {
		 *   uchar    DriveMode[4];
		 *   ushort   FocusMode[2];
		 *   ushort   AFPointSelected[2];
		 *   ushort   AFPointSelected_Area;
		 *   int      AFPointsInFocus_version;
		 *   unsigned AFPointsInFocus;
		 *   ushort   FocusPosition;
		 *   short    AFAdjustment;
		 *   uchar    AFPointMode;
		 *   uchar    MultiExposure; // last bit is not "1" if ME is not used
		 *   ushort   Quality; // 4 is raw, 7 is raw w/ pixel shift, 8 is raw w/ dynamic pixel shift
		 * } libraw_pentax_makernotes_t;
		 * ```
		 */
		const driveMode = [
			this.readU8(ptr),
			this.readU8(ptr),
			this.readU8(ptr),
			this.readU8(ptr),
		] as const;
		const focusMode = [this.readU16(ptr), this.readU16(ptr)] as const;
		const afPointSelected = [this.readU16(ptr), this.readU16(ptr)] as const;
		const afPointSelectedArea = this.readU16(ptr);
		const afPointsInFocusVersion = this.readI32(ptr);
		const afPointsInFocus = this.readU32(ptr);
		const focusPosition = this.readU16(ptr);
		const afAdjustment = this.readI16(ptr);
		const afPointMode = this.readU8(ptr);
		const multiExposure = this.readU8(ptr);
		const quality = this.readU16(ptr);
		return {
			driveMode,
			focusMode,
			afPointSelected,
			afPointSelectedArea,
			afPointsInFocusVersion,
			afPointsInFocus,
			focusPosition,
			afAdjustment,
			afPointMode,
			multiExposure,
			quality,
		};
	}
	getPhaseOneMakernotes() {
		const ptr = { ptr: this.libraw._libraw_get_phaseone_makernotes(this.lr) };
		/**
		 * @see https://github.com/LibRaw/LibRaw/blob/cccb97647fcee56801fa68231fa8a38aa8b52ef7/libraw/libraw_types.h#L634-L639
		 * ```c
		 * typedef struct {
		 *   char Software[64];        // tag 0x0203
		 *   char SystemType[64];      // tag 0x0204
		 *   char FirmwareString[256]; // tag 0x0301
		 *   char SystemModel[64];
		 * } libraw_p1_makernotes_t;
		 * ```
		 */
		const software = this.readString(ptr, { length: 64 });
		const systemType = this.readString(ptr, { length: 64 });
		const firmwareString = this.readString(ptr, { length: 256 });
		const systemModel = this.readString(ptr, { length: 64 });
		return { software, systemType, firmwareString, systemModel };
	}
	getRicohMakernotes() {
		const ptr = { ptr: this.libraw._libraw_get_ricoh_makernotes(this.lr) };
		/**
		 * @see https://github.com/LibRaw/LibRaw/blob/cccb97647fcee56801fa68231fa8a38aa8b52ef7/libraw/libraw_types.h#L585-L603
		 * ```c
		 * typedef struct {
		 *   ushort   AFStatus;
		 *   unsigned AFAreaXPosition[2];
		 *   unsigned AFAreaYPosition[2];
		 *   ushort   AFAreaMode;
		 *   unsigned SensorWidth;
		 *   unsigned SensorHeight;
		 *   unsigned CroppedImageWidth;
		 *   unsigned CroppedImageHeight;
		 *   ushort   WideAdapter;
		 *   ushort   CropMode;
		 *   ushort   NDFilter;
		 *   ushort   AutoBracketing;
		 *   ushort   MacroMode;
		 *   ushort   FlashMode;
		 *   double   FlashExposureComp;
		 *   double   ManualFlashOutput;
		 * } libraw_ricoh_makernotes_t;
		 * ```
		 */
		const afStatus = this.readU16(ptr);
		const afAreaXPosition = [this.readU32(ptr), this.readU32(ptr)] as const;
		const afAreaYPosition = [this.readU32(ptr), this.readU32(ptr)] as const;
		const afAreaMode = this.readU16(ptr);
		const sensorWidth = this.readU32(ptr);
		const sensorHeight = this.readU32(ptr);
		const croppedImageWidth = this.readU32(ptr);
		const croppedImageHeight = this.readU32(ptr);
		const wideAdapter = this.readU16(ptr);
		const cropMode = this.readU16(ptr);
		const ndFilter = this.readU16(ptr);
		const autoBracketing = this.readU16(ptr);
		const macroMode = this.readU16(ptr);
		const flashMode = this.readU16(ptr);
		const flashExposureComp = this.readF64(ptr);
		const manualFlashOutput = this.readF64(ptr);
		return {
			afStatus,
			afAreaXPosition,
			afAreaYPosition,
			afAreaMode,
			sensorWidth,
			sensorHeight,
			croppedImageWidth,
			croppedImageHeight,
			wideAdapter,
			cropMode,
			ndFilter,
			autoBracketing,
			macroMode,
			flashMode,
			flashExposureComp,
			manualFlashOutput,
		};
	}
	getSamsungMakernotes() {
		const ptr = { ptr: this.libraw._libraw_get_samsung_makernotes(this.lr) };
		/**
		 * @see https://github.com/LibRaw/LibRaw/blob/cccb97647fcee56801fa68231fa8a38aa8b52ef7/libraw/libraw_types.h#L605-L614
		 * ```c
		 * typedef struct {
		 *   unsigned ImageSizeFull[4];
		 *   unsigned ImageSizeCrop[4];
		 *   int      ColorSpace[2];
		 *   unsigned key[11];
		 *   double   DigitalGain; // PostAEGain, digital stretch
		 *   int      DeviceType;
		 *   char     LensFirmware[32];
		 * } libraw_samsung_makernotes_t;
		 * ```
		 */
		const imageSizeFull = [
			this.readU32(ptr),
			this.readU32(ptr),
			this.readU32(ptr),
			this.readU32(ptr),
		] as const;
		const imageSizeCrop = [
			this.readU32(ptr),
			this.readU32(ptr),
			this.readU32(ptr),
			this.readU32(ptr),
		] as const;
		const colorSpace = [this.readI32(ptr), this.readI32(ptr)] as const;
		const key = Array.from({ length: 11 }, () => this.readU32(ptr));
		const digitalGain = this.readF64(ptr);
		const deviceType = this.readI32(ptr);
		const lensFirmware = this.readString(ptr, { length: 32 });
		return {
			imageSizeFull,
			imageSizeCrop,
			colorSpace,
			key,
			digitalGain,
			deviceType,
			lensFirmware,
		};
	}
	getCommonMetadata() {
		const ptr = { ptr: this.libraw._libraw_get_common_metadata(this.lr) };
		/**
		 * @see https://github.com/LibRaw/LibRaw/blob/cccb97647fcee56801fa68231fa8a38aa8b52ef7/libraw/libraw_types.h#L861-L883
		 * @see https://github.com/LibRaw/LibRaw/blob/cccb97647fcee56801fa68231fa8a38aa8b52ef7/libraw/libraw_types.h#L852-L859
		 * ```c
		 * typedef struct {
		 *   unsigned AFInfoData_tag;
		 *   short    AFInfoData_order;
		 *   unsigned AFInfoData_version;
		 *   unsigned AFInfoData_length;
		 *   uchar   *AFInfoData;
		 * } libraw_afinfo_item_t;
		 * typedef struct {
		 *   float FlashEC;
		 *   float FlashGN;
		 *   float CameraTemperature;
		 *   float SensorTemperature;
		 *   float SensorTemperature2;
		 *   float LensTemperature;
		 *   float AmbientTemperature;
		 *   float BatteryTemperature;
		 *   float exifAmbientTemperature;
		 *   float exifHumidity;
		 *   float exifPressure;
		 *   float exifWaterDepth;
		 *   float exifAcceleration;
		 *   float exifCameraElevationAngle;
		 *   float real_ISO;
		 *   float exifExposureIndex;
		 *   ushort ColorSpace;
		 *   char firmware[128];
		 *   float ExposureCalibrationShift;
		 *   libraw_afinfo_item_t afdata[LIBRAW_AFDATA_MAXCOUNT]; // [4]
		 *   int afcount;
		 * } libraw_metadata_common_t;
		 * ```
		 */
		const flashEc = this.readF32(ptr);
		const flashGn = this.readF32(ptr);
		const cameraTemperature = this.readF32(ptr);
		const sensorTemperature = this.readF32(ptr);
		const sensorTemperature2 = this.readF32(ptr);
		const lensTemperature = this.readF32(ptr);
		const ambientTemperature = this.readF32(ptr);
		const batteryTemperature = this.readF32(ptr);
		const exifAmbientTemperature = this.readF32(ptr);
		const exifHumidity = this.readF32(ptr);
		const exifPressure = this.readF32(ptr);
		const exifWaterDepth = this.readF32(ptr);
		const exifAcceleration = this.readF32(ptr);
		const exifCameraElevationAngle = this.readF32(ptr);
		const realIso = this.readF32(ptr);
		const exifExposureIndex = this.readF32(ptr);
		const colorSpace = this.readU16(ptr);
		const firmware = this.readString(ptr, { length: 128 });
		const exposureCalibrationShift = this.readF32(ptr);
		const afdata = Array.from({ length: 4 }, () => ({
			tag: this.readU32(ptr),
			order: this.readI16(ptr),
			version: this.readU32(ptr),
			length: this.readU32(ptr),
			data: this.readU8({ ptr: this.readU32(ptr) }),
		}));
		const afcount = this.readI32(ptr);
		return {
			flashEc,
			flashGn,
			cameraTemperature,
			sensorTemperature,
			sensorTemperature2,
			lensTemperature,
			ambientTemperature,
			batteryTemperature,
			exifAmbientTemperature,
			exifHumidity,
			exifPressure,
			exifWaterDepth,
			exifAcceleration,
			exifCameraElevationAngle,
			realIso,
			exifExposureIndex,
			colorSpace,
			firmware,
			exposureCalibrationShift,
			afdata,
			afcount,
		};
	}
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
	private readI8(ptr: MutablePtr): number {
		const value = this.view.getInt8(ptr.ptr);
		ptr.ptr += 1;
		return value || 0;
	}
	private readI16(ptr: MutablePtr): number {
		const value = this.view.getInt16(ptr.ptr, true);
		ptr.ptr += 2;
		return value || 0;
	}
	private readI32(ptr: MutablePtr): number {
		const value = this.view.getInt32(ptr.ptr, true);
		ptr.ptr += 4;
		return value || 0;
	}
	private readU8(ptr: MutablePtr): number {
		const value = this.view.getUint8(ptr.ptr);
		ptr.ptr += 1;
		return value || 0;
	}
	private readU16(ptr: MutablePtr): number {
		const value = this.view.getUint16(ptr.ptr, true);
		ptr.ptr += 2;
		return value || 0;
	}
	private readU32(ptr: MutablePtr): number {
		const value = this.view.getUint32(ptr.ptr, true);
		ptr.ptr += 4;
		return value || 0;
	}
	private readU64(ptr: MutablePtr): bigint {
		const value = this.view.getBigUint64(ptr.ptr, true);
		ptr.ptr += 8;
		return value || 0n;
	}
	private readF32(ptr: MutablePtr): number {
		const value = this.libraw.HEAPF32[ptr.ptr / 4];
		ptr.ptr += 4;
		return value || 0;
	}
	private readF64(ptr: MutablePtr): number {
		const value = this.libraw.HEAPF64[ptr.ptr / 8];
		ptr.ptr += 8;
		return value || 0;
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
