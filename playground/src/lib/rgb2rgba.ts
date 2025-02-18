export function rgb2rgba(rgb: Uint8Array): Uint8Array {
	const rgba = new Uint8Array((rgb.length / 3) * 4);
	for (let i = 0; i < rgba.length; i += 4) {
		const index = (i / 4) * 3;
		rgba[i] = rgb[index];
		rgba[i + 1] = rgb[index + 1];
		rgba[i + 2] = rgb[index + 2];
		rgba[i + 3] = 255;
	}
	return rgba;
}
