import type { LibRaw } from 'libraw.wasm';
import * as Comlink from 'comlink';
import LibRawWorker from './worker?worker';

export function createLibRaw(): Comlink.Remote<LibRaw> {
	const worker = new LibRawWorker();
	const comlink = Comlink.wrap<LibRaw>(worker);
	return new Proxy(comlink, {
		get(target, p, receiver) {
			const val = Reflect.get(target, p, receiver);
			if (p === 'dispose') {
				return async () => {
					await val();
					worker.terminate();
				};
			}
			return val;
		}
	});
}
