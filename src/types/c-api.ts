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
export type ErrorCode = number & { error_code: never };

export interface LibRawWasmModule {
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
	_libraw_get_decoder_info(info: LibRawDecoderInfo): ErrorCode;
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
	// custom functions
	_libraw_get_raw_image(lr: LibRawDataT): void;
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
