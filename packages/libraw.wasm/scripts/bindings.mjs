import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { generate } from "@typed-cstruct/generator";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const bindings = generate(
	[path.join(__dirname, "../LibRaw/libraw/libraw.h")],
	false,
	[`--sysroot=${process.env.SYSROOT}`],
	["libraw_data_t", "libraw_processed_image_t"],
);
fs.writeFileSync(path.join(__dirname, "../src/libraw-types.ts"), bindings);
