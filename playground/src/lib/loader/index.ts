import * as Comlink from "comlink";
import type { Loader } from "./types";
import LoaderWorker from "./worker?worker";

type ComlinkLoader = Comlink.Remote<Loader>;
type Disposable = { dispose(): void; [Symbol.dispose](): void };

export function createLoader(): ComlinkLoader & Disposable {
	const worker = new LoaderWorker();
	const comlink = Comlink.wrap<Loader>(worker);
	const dispose = () => worker.terminate();

	Object.defineProperty(comlink, "dispose", { value: dispose });
	Object.defineProperty(comlink, Symbol.dispose, { value: dispose });
	return comlink as ComlinkLoader & Disposable;
}
