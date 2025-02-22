/**
 * @template T
 * @returns {{ promise: Promise<T>; resolve: (arg: T) => void; reject: (reason: any) => void }} - An object with a promise and its resolverss
 */
export function promiseWithResolvers() {
	let resolve;
	let reject;
	const promise = new Promise((res, rej) => {
		resolve = res;
		reject = rej;
	});
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	return { promise, resolve, reject };
}
