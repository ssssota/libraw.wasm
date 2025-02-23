import * as Comlink from "comlink";
import type { Loader } from "./types";
import LoaderWorker from "./worker?worker";

type ComlinkLoader = Comlink.Remote<Loader>;
type Disposable = { dispose(): void; [Symbol.dispose](): void };

export function createLoader(): ComlinkLoader & Disposable {
	const worker = new LoaderWorker();
	const comlink = Comlink.wrap<Loader>(worker);
	const dispose = () => worker.terminate();
	return new Proxy(comlink, {
		get(target, p, receiver) {
			if (p === "dispose" || p === Symbol.dispose) return dispose;
			return Reflect.get(target, p, receiver);
		},
	}) as ComlinkLoader & Disposable;
}
