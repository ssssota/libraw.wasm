export type ResolvablePromise<T> = Promise<T> & {
  resolve(value: T): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reject(reason: any): void;
};

export function resolvable<T>(): ResolvablePromise<T> {
  let resolve: (value: T) => void;
  let reject: (reason: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  }) as ResolvablePromise<T>;
  promise.resolve = resolve!;
  promise.reject = reject!;
  return promise;
}
