import * as child_process from "node:child_process";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as url from "node:url";

const cwd = url.fileURLToPath(new URL("../", import.meta.url));
const dist = path.join(cwd, "dist");

const customFunctions = {
	_libraw_get_raw_image: `\
extern "C" DllDef ushort *libraw_get_raw_image(libraw_data_t *lr) {
	if (!lr) return NULL;
	return lr->rawdata.raw_image;
}`,
	_libraw_set_use_camera_wb: `\
extern "C" DllDef void libraw_set_use_camera_wb(libraw_data_t *lr, int value) {
	if (!lr) return;
	lr->params.use_camera_wb = value;
}`,
	_libraw_get_thumbnail: `\
extern "C" DllDef libraw_thumbnail_t *libraw_get_thumbnail(libraw_data_t *lr) {
	if (!lr) return NULL;
	return &(lr->thumbnail);
}`,
	_libraw_get_shootinginfo: `\
extern "C" DllDef libraw_shootinginfo_t *libraw_get_shootinginfo(libraw_data_t *lr) {
	if (!lr) return NULL;
	return &(lr->shootinginfo);
}`,
	_libraw_get_makernotes: `\
extern "C" DllDef libraw_makernotes_t *libraw_get_makernotes(libraw_data_t *lr) {
	if (!lr) return NULL;
	return &(lr->makernotes);
}`,
	_libraw_get_canon_makernotes: `\
extern "C" DllDef libraw_canon_makernotes_t *libraw_get_canon_makernotes(libraw_data_t *lr) {
	if (!lr) return NULL;
	return &(lr->makernotes.canon);
}`,
	_libraw_get_nikon_makernotes: `\
extern "C" DllDef libraw_nikon_makernotes_t *libraw_get_nikon_makernotes(libraw_data_t *lr) {
	if (!lr) return NULL;
	return &(lr->makernotes.nikon);
}`,
	_libraw_get_hasselblad_makernotes: `\
extern "C" DllDef libraw_hasselblad_makernotes_t *libraw_get_hasselblad_makernotes(libraw_data_t *lr) {
	if (!lr) return NULL;
	return &(lr->makernotes.hasselblad);
}`,
	_libraw_get_fuji_info: `\
extern "C" DllDef libraw_fuji_info_t *libraw_get_fuji_info(libraw_data_t *lr) {
	if (!lr) return NULL;
	return &(lr->makernotes.fuji);
}`,
	_libraw_get_olympus_makernotes: `\
extern "C" DllDef libraw_olympus_makernotes_t *libraw_get_olympus_makernotes(libraw_data_t *lr) {
	if (!lr) return NULL;
	return &(lr->makernotes.olympus);
}`,
	_libraw_get_sony_info: `\
extern "C" DllDef libraw_sony_info_t *libraw_get_sony_info(libraw_data_t *lr) {
	if (!lr) return NULL;
	return &(lr->makernotes.sony);
}`,
	_libraw_get_kodak_makernotes: `\
extern "C" DllDef libraw_kodak_makernotes_t *libraw_get_kodak_makernotes(libraw_data_t *lr) {
	if (!lr) return NULL;
	return &(lr->makernotes.kodak);
}`,
	_libraw_get_panasonic_makernotes: `\
extern "C" DllDef libraw_panasonic_makernotes_t *libraw_get_panasonic_makernotes(libraw_data_t *lr) {
	if (!lr) return NULL;
	return &(lr->makernotes.panasonic);
}`,
	_libraw_get_pentax_makernotes: `\
extern "C" DllDef libraw_pentax_makernotes_t *libraw_get_pentax_makernotes(libraw_data_t *lr) {
	if (!lr) return NULL;
	return &(lr->makernotes.pentax);
}`,
	_libraw_get_phaseone_makernotes: `\
extern "C" DllDef libraw_p1_makernotes_t *libraw_get_phaseone_makernotes(libraw_data_t *lr) {
	if (!lr) return NULL;
	return &(lr->makernotes.phaseone);
}`,
	_libraw_get_ricoh_makernotes: `\
extern "C" DllDef libraw_ricoh_makernotes_t *libraw_get_ricoh_makernotes(libraw_data_t *lr) {
	if (!lr) return NULL;
	return &(lr->makernotes.ricoh);
}`,
	_libraw_get_samsung_makernotes: `\
extern "C" DllDef libraw_samsung_makernotes_t *libraw_get_samsung_makernotes(libraw_data_t *lr) {
	if (!lr) return NULL;
	return &(lr->makernotes.samsung);
}`,
	_libraw_get_common_metadata: `\
extern "C" DllDef libraw_metadata_common_t *libraw_get_common_metadata(libraw_data_t *lr) {
	if (!lr) return NULL;
	return &(lr->makernotes.common);
}`,
};

async function main() {
	await fs.rm(dist, { recursive: true, force: true });

	const baseMakefile = await fs.readFile(
		path.join(cwd, "LibRaw/Makefile.dist"),
		"utf-8",
	);
	const patchedMakefile = baseMakefile
		.replace(/^all: library all_samples/gim, "")
		.replace(/^CC=gcc/gim, "CC=emcc")
		.replace(/^CXX=g\+\+/gim, "CXX=em++")
		.replace(/^CFLAGS\+=-DUSE_ZLIB/gim, "")
		.replace(/^LDADD\+=-lz/gim, "");
	const exportFunctions = [
		"_libraw_get_raw_height",
		"_libraw_get_raw_width",
		"_libraw_get_iheight",
		"_libraw_get_iwidth",
		"_libraw_get_cam_mul",
		"_libraw_get_pre_mul",
		"_libraw_get_rgb_cam",
		"_libraw_get_iparams",
		"_libraw_get_lensinfo",
		"_libraw_get_imgother",
		"_libraw_get_color_maximum",
		"_libraw_set_user_mul",
		"_libraw_set_demosaic",
		"_libraw_set_adjust_maximum_thr",
		"_libraw_set_output_color",
		"_libraw_set_output_bps",
		"_libraw_set_gamma",
		"_libraw_set_no_auto_bright",
		"_libraw_set_bright",
		"_libraw_set_highlight",
		"_libraw_set_fbdd_noiserd",
		"_libraw_open_buffer",
		"_libraw_init",
		"_libraw_unpack",
		"_libraw_raw2image",
		"_libraw_dcraw_process",
		"_libraw_dcraw_make_mem_image",
		"_libraw_close",
		"_libraw_version",
		"_libraw_versionNumber",
		// "_libraw_capabilities", // wasm has no any capabilities https://github.com/LibRaw/LibRaw/blob/17294b5fd82bff80463c21386d3847142a37549d/src/utils/utils_libraw.cpp#L193
		"_libraw_cameraCount",
		"_libraw_cameraList",
		"_libraw_get_decoder_info",
		"_libraw_unpack_function_name",
		"_libraw_COLOR",
		"_libraw_subtract_black",
		"_libraw_recycle_datastream",
		"_libraw_recycle",
		"_libraw_strerror",
		"_libraw_strprogress",
		// special functions from emscripten
		"_malloc",
		// custom functions
		...Object.keys(customFunctions),
	];
	const makefile = `\
all: lib/libraw.wasm
${patchedMakefile}
lib/libraw.wasm: \${LIB_OBJECTS}
	emcc -Os -o lib/libraw.mjs -s MODULARIZE=1 -s 'EXPORTED_FUNCTIONS=${JSON.stringify(
		exportFunctions,
	)}' -s ALLOW_MEMORY_GROWTH=1 \${LIB_OBJECTS}
`;

	await fs.writeFile(path.join(cwd, "LibRaw/Makefile"), makefile);

	const librawCApiPath = path.join(cwd, "LibRaw/src/libraw_c_api.cpp");
	const librawCApi = await fs.readFile(librawCApiPath, "utf-8");
	await fs.appendFile(
		librawCApiPath,
		Object.values(customFunctions).join("\n"),
	);

	child_process.execFileSync("make", {
		cwd: path.join(cwd, "LibRaw"),
		stdio: "inherit",
	});

	await fs.rm(path.join(cwd, "LibRaw/Makefile"));
	await fs.writeFile(librawCApiPath, librawCApi);

	await fs.mkdir(dist).catch(() => {});
	await fs.rename(
		path.join(cwd, "LibRaw/lib/libraw.mjs"),
		path.join(dist, "libraw.js"),
	);
	await fs.rename(
		path.join(cwd, "LibRaw/lib/libraw.wasm"),
		path.join(dist, "libraw.wasm"),
	);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
