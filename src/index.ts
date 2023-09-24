// @ts-expect-error
import initializeLibRawWasm from "./libraw.js";

interface LibRawWasmModule {
	_malloc(size: number): number;
	/**
	 * @returns {number} `libraw_data_t*`
	 */
	_libraw_init(flags: number): number;
	/**
	 * @param lr `libraw_data_t*`
	 */
	_libraw_close(lr: number): void;
	/**
	 * @param lr `libraw_data_t*`
	 * @param buffer `uint8_t*`
	 * @param size `size_t`
	 * @returns {number} error code
	 */
	_libraw_open_buffer(lr: number, buffer: number, size: number): number;
	/**
	 * @param lr `libraw_data_t*`
	 */
	_libraw_get_raw_height(lr: number): number;
	/**
	 * @param lr `libraw_data_t*`
	 */
	_libraw_get_raw_width(lr: number): number;
	/**
	 * @param lr `libraw_data_t*`
	 */
	_libraw_get_iheight(lr: number): number;
	/**
	 * @param lr `libraw_data_t*`
	 */
	_libraw_get_iwidth(lr: number): number;
	// wip
	/**
	 * @param lr `libraw_data_t*`
	 */
	_libraw_get_cam_mul(lr: number): void;
	/**
	 * @param lr `libraw_data_t*`
	 */
	_libraw_get_pre_mul(lr: number): void;
	/**
	 * @param lr `libraw_data_t*`
	 */
	_libraw_get_rgb_cam(lr: number): void;
	/**
	 * @param lr `libraw_data_t*`
	 */
	_libraw_get_iparams(lr: number): void;
	/**
	 * @param lr `libraw_data_t*`
	 */
	_libraw_get_lensinfo(lr: number): void;
	/**
	 * @param lr `libraw_data_t*`
	 */
	_libraw_get_imgother(lr: number): void;
	/**
	 * @param lr `libraw_data_t*`
	 */
	_libraw_get_color_maximum(lr: number): void;
	/**
	 * @param lr `libraw_data_t*`
	 */
	_libraw_set_user_mul(lr: number): void;
	/**
	 * @param lr `libraw_data_t*`
	 */
	_libraw_set_demosaic(lr: number): void;
	/**
	 * @param lr `libraw_data_t*`
	 */
	_libraw_set_adjust_maximum_thr(lr: number): void;
	/**
	 * @param lr `libraw_data_t*`
	 */
	_libraw_set_output_color(lr: number): void;
	/**
	 * @param lr `libraw_data_t*`
	 */
	_libraw_set_output_bps(lr: number): void;
	/**
	 * @param lr `libraw_data_t*`
	 */
	_libraw_set_gamma(lr: number): void;
	/**
	 * @param lr `libraw_data_t*`
	 */
	_libraw_set_no_auto_bright(lr: number): void;
	/**
	 * @param lr `libraw_data_t*`
	 */
	_libraw_set_bright(lr: number): void;
	/**
	 * @param lr `libraw_data_t*`
	 */
	_libraw_set_highlight(lr: number): void;
	/**
	 * @param lr `libraw_data_t*`
	 */
	_libraw_set_fbdd_noiserd(lr: number): void;
	/**
	 * @param lr `libraw_data_t*`
	 */
	_libraw_unpack(lr: number): void;
	/**
	 * @param lr `libraw_data_t*`
	 */
	_libraw_raw2image(lr: number): void;
	/**
	 * @param lr `libraw_data_t*`
	 */
	_libraw_dcraw_process(lr: number): void;
	/**
	 * @param lr `libraw_data_t*`
	 */
	_libraw_dcraw_make_mem_image(lr: number): void;
	/**
	 * @param lr `libraw_data_t*`
	 */
	_libraw_get_raw_image(lr: number): void;
	/**
	 * @param lr `libraw_data_t*`
	 */
	_libraw_set_use_camera_wb(lr: number): void;
	/**
	 * @param error error code
	 * @returns {number} error message string pointer
	 */
	_libraw_strerror(error: number): number;
	HEAPU8: Uint8Array;
}

export class LibRaw implements Disposable {
	private disposed = false;
	private constructor(private libraw: LibRawWasmModule, private lr: number) {}
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
	private error(code: number): string {
		const ptr = this.libraw._libraw_strerror(code);
		const len = this.libraw.HEAPU8.indexOf(0, ptr);
		const heap = new Uint8Array(this.libraw.HEAPU8.buffer, ptr, len);
		const str = new TextDecoder().decode(heap);
		return str;
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
