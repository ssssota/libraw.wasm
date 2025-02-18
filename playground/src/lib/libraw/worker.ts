import { LibRaw } from 'libraw.wasm';
import * as Comlink from 'comlink';

Comlink.expose(new LibRaw());
