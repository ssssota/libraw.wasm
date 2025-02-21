export type UnsignedInt = number;
export type Int = number;
export type Float = number;
export type SizeT = number;
export type CharPtr = number & { "char*": never };
export type CharPtrPtr = number & { "char**": never };
export type Ptr = number;
export type LibRawDataT = number & { "libraw_data_t*": never };
export type LibRawIparamsT = number;
export type LibRawLensInfoT = number;
export type LibRawImgotherT = number;
export type LibRawThumbnailT = number & { "libraw_thumbnail_t*": never };
export type LibRawShootingInfoT = number & { "libraw_shootinginfo_t*": never };
export type LibRawMakernotesT = number & { "libraw_makernotes_t*": never };
export type LibRawDecoderInfo = number & { "libraw_decoder_info_t*": never };
export type LibRawProcessedImageT = number & {
	"libraw_processed_image_t*": never;
};
export type ErrorCode = number & { error_code: never };

export interface LibRawWasmModule {
	_malloc(size: SizeT): Ptr;
	_free(ptr: Ptr): void;
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
	_libraw_get_lensinfo(lr: LibRawDataT): LibRawLensInfoT;
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
	_libraw_set_highlight(lr: LibRawDataT, value: Int): void;
	_libraw_set_fbdd_noiserd(lr: LibRawDataT, value: Int): void;
	_libraw_unpack(lr: LibRawDataT): ErrorCode;
	_libraw_unpack_thumb(lr: LibRawDataT): ErrorCode;
	_libraw_unpack_thumb_ex(lr: LibRawDataT, i: Int): ErrorCode;
	_libraw_raw2image(lr: LibRawDataT): ErrorCode;
	_libraw_dcraw_process(lr: LibRawDataT): ErrorCode;
	_libraw_dcraw_make_mem_image(
		lr: LibRawDataT,
		errc: Ptr,
	): LibRawProcessedImageT;
	_libraw_dcraw_make_mem_thumb(
		lr: LibRawDataT,
		errc: Ptr,
	): LibRawProcessedImageT;
	_libraw_dcraw_clear_mem(lr: LibRawProcessedImageT): void;
	_libraw_strerror(error: ErrorCode): CharPtr;
	_libraw_version(): CharPtr;
	_libraw_versionNumber(): number;
	_libraw_capabilities(): void;
	_libraw_cameraCount(): number;
	_libraw_cameraList(): CharPtrPtr;
	_libraw_get_decoder_info(info: LibRawDecoderInfo): ErrorCode;
	_libraw_unpack_function_name(lr: LibRawDataT): CharPtr;
	_libraw_COLOR(lr: LibRawDataT, row: Int, col: Int): Int;
	_libraw_subtract_black(lr: LibRawDataT): void;
	_libraw_recycle(lr: LibRawDataT): void;
	_libraw_strprogress(progress: number): CharPtr;
	// custom functions
	_libraw_get_raw_image(lr: LibRawDataT): Ptr;
	_libraw_set_use_camera_wb(lr: LibRawDataT): void;
	_libraw_get_thumbnail(lr: LibRawDataT): LibRawThumbnailT;
	_libraw_get_shootinginfo(lr: LibRawDataT): LibRawShootingInfoT;
	_libraw_get_makernotes(lr: LibRawDataT): LibRawMakernotesT;
	_libraw_get_canon_makernotes(lr: LibRawDataT): number;
	_libraw_get_nikon_makernotes(lr: LibRawDataT): number;
	_libraw_get_hasselblad_makernotes(lr: LibRawDataT): number;
	_libraw_get_fuji_info(lr: LibRawDataT): number;
	_libraw_get_olympus_makernotes(lr: LibRawDataT): number;
	_libraw_get_sony_info(lr: LibRawDataT): number;
	_libraw_get_kodak_makernotes(lr: LibRawDataT): number;
	_libraw_get_panasonic_makernotes(lr: LibRawDataT): number;
	_libraw_get_pentax_makernotes(lr: LibRawDataT): number;
	_libraw_get_phaseone_makernotes(lr: LibRawDataT): number;
	_libraw_get_ricoh_makernotes(lr: LibRawDataT): number;
	_libraw_get_samsung_makernotes(lr: LibRawDataT): number;
	_libraw_get_common_metadata(lr: LibRawDataT): number;
	HEAP8: Int8Array;
	HEAP16: Int16Array;
	HEAP32: Int32Array;
	HEAPF32: Float32Array;
	HEAPF64: Float64Array;
	HEAPU8: Uint8Array;
	HEAPU16: Uint16Array;
	HEAPU32: Uint32Array;
}
