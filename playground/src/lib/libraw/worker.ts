import { LibRaw } from 'libraw.wasm';
import * as Comlink from 'comlink';

LibRaw.initialize().then(() => {
  console.log('LibRaw version:', LibRaw.version());
  console.log('Supported cameras:', LibRaw.cameraList());
});

Comlink.expose(new LibRaw());
