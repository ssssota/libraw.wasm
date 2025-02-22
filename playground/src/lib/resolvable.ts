export type ResolvablePromise<T> = Promise<T> & {
	resolve(value: T): void;
	reject(reason: unknown): void;
};

export function resolvable<T>(): ResolvablePromise<T> {
	let resolve: (value: T) => void;
	let reject: (reason: unknown) => void;
	const promise = new Promise<T>((res, rej) => {
		resolve = res;
		reject = rej;
	}) as ResolvablePromise<T>;
	// biome-ignore lint/style/noNonNullAssertion:
	promise.resolve = resolve!;
	// biome-ignore lint/style/noNonNullAssertion:
	promise.reject = reject!;
	return promise;
}
