import { promiseWithResolvers } from './promise_with_resolvers';

export async function readFile(file: File): Promise<ArrayBuffer> {
	const { promise, resolve, reject } = promiseWithResolvers<ArrayBuffer>();
	const reader = new FileReader();
	reader.addEventListener(
		'load',
		() => {
			if (!(reader.result instanceof ArrayBuffer)) {
				reject(new Error('Expected ArrayBuffer'));
				return;
			}
			resolve(reader.result);
		},
		{ once: true }
	);
	reader.addEventListener('error', reject, { once: true });
	reader.readAsArrayBuffer(file);
	return promise;
}
