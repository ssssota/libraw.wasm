import { component$, noSerialize, useSignal } from "@builder.io/qwik";
import { LibRaw } from "libraw.wasm";

import classes from "./app.module.css";

function formatFNumber(fnumber: number) {
	return Math.round(fnumber * 10) / 10;
}
function formatShutterSpeed(shutterSpeed: number) {
	if (shutterSpeed < 1) {
		return `1/${Math.round(1 / shutterSpeed)}`;
	}
	return `${shutterSpeed}`;
}
export const App = component$(() => {
	const canvas = useSignal<HTMLCanvasElement>();
	const libraw = useSignal<LibRaw>();
	const iparams = libraw.value?.getIParams();
	const imgother = libraw.value?.getImgOther();
	const lensinfo = libraw.value?.getLensInfo();
	const cameras = libraw.value?.cameraList();

	console.log({
		iparams,
		imgother,
		lensinfo,
		supportedCameras: cameras,
	});
	return (
		<>
			<input
				type="file"
				onChange$={async (e) => {
					if (!(e.target instanceof HTMLInputElement)) return;
					const file = e.target.files?.[0];
					if (!file) return;
					const [lr, buffer] = await Promise.all([
						LibRaw.create(),
						file.arrayBuffer(),
					]);
					await lr.open(buffer);
					await lr.unpackThumb();
					libraw.value = noSerialize(lr);
					if (!canvas.value) return;
					const ctx = canvas.value.getContext("2d");
					if (!ctx) return;
					const {
						twidth: width,
						theight: height,
						thumb: data,
						tformat: format,
					} = lr.getThumbnail();
					canvas.value.width = width;
					canvas.value.height = height;
					if (format === "jpeg") {
						const blob = new Blob([data], { type: "image/jpeg" });
						const url = URL.createObjectURL(blob);
						const img = new Image();
						img.onload = () => {
							ctx.drawImage(img, 0, 0);
							URL.revokeObjectURL(url);
						};
						img.src = url;
					}
				}}
			/>
			<canvas class={classes.canvas} ref={canvas} />
			<section class={classes.inspect}>
				<dl>
					{iparams && (
						<>
							<dt>Make</dt>
							<dd>{iparams.make}</dd>
							<dt>Model</dt>
							<dd>{iparams.model}</dd>
						</>
					)}
					{imgother && (
						<>
							<dt>ISO</dt>
							<dd>{imgother.isoSpeed}</dd>
							<dt>Aperture</dt>
							<dd>F/{formatFNumber(imgother.aperture)}</dd>
							<dt>Shutter speed</dt>
							<dd>{formatShutterSpeed(imgother.shutter)}s</dd>
							<dt>Focal length</dt>
							<dd>{imgother.focalLen}mm</dd>
							<dt>Shot at</dt>
							<dd>{new Date(imgother.timestamp * 1000).toLocaleString()}</dd>
						</>
					)}
				</dl>
				<dl>
					{lensinfo && (
						<>
							{lensinfo.lens && (
								<>
									<dt>Lens (Maker)</dt>
									<dd>
										{lensinfo.lens} ({lensinfo.lensMake})
									</dd>
								</>
							)}
							{lensinfo.minFocal && (
								<>
									<dt>Min focal length (max aperture)</dt>
									<dd>
										{lensinfo.minFocal}mm (F/
										{formatFNumber(lensinfo.maxAp4MinFocal)})
									</dd>
								</>
							)}
							{lensinfo.maxFocal && (
								<>
									<dt>Max focal length (max aperture)</dt>
									<dd>
										{lensinfo.maxFocal}mm (F/
										{formatFNumber(lensinfo.maxAp4MaxFocal)})
									</dd>
								</>
							)}
						</>
					)}
				</dl>
				<div>
					{cameras && (
						<details>
							<summary>Supported cameras</summary>
							<ul>
								{cameras.map((camera) => (
									<li key={camera}>{camera}</li>
								))}
							</ul>
						</details>
					)}
				</div>
			</section>
		</>
	);
});
