import * as child_process from "node:child_process";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as url from "node:url";

const cwd = url.fileURLToPath(new URL("../", import.meta.url));
const dist = path.join(cwd, "dist");

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
		"_libraw_get_raw_image",
		"_libraw_set_use_camera_wb",
		"_libraw_close",
		"_libraw_strerror",
		"_malloc",
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
		`
extern "C" DllDef ushort *libraw_get_raw_image(libraw_data_t *lr){if(!lr)return NULL;return lr->rawdata.raw_image;}
extern "C" DllDef void libraw_set_use_camera_wb(libraw_data_t *lr, int value){if(!lr)return;lr->params.use_camera_wb = value;}
`,
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
