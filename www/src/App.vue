<script setup lang="ts">
  import { LibRaw } from 'libraw.wasm';
  import { onMounted, ref } from 'vue';
  const libraw = ref<LibRaw>();
  onMounted(() => {
    LibRaw.create().then((lr) => (libraw.value = lr));
  });
  function log<T>(val: T): T {
    console.log(val);
    return val;
  }
  const onFileChange = async (ev: Event) => {
    if (!(ev.currentTarget instanceof HTMLInputElement)) 
      return;
    const file = ev.currentTarget.files?.[0];
    if (!file) return;
    if (libraw.value) libraw.value.dispose();
    const lr = await LibRaw.create();
    console.log({lr});
    const buffer = await file.arrayBuffer();
    await lr.open(buffer);
    libraw.value = lr;
  }
</script>

<template>
  <input type="file" @change="onFileChange" />
  <ul>
    <li>
      parameters: <pre><code>{{ JSON.stringify(log(libraw?.getIParams()), undefined, 2) }}</code></pre>
    </li>
    <li>
      lens info: <pre><code>{{ JSON.stringify(log(libraw?.getLensInfo()), (_, v) => { return typeof v === 'bigint' ? Number(v) : v; }, 2) }}</code></pre>
    </li>
    <li>
      img other: <pre><code>{{ JSON.stringify(log(libraw?.getImgOther()), undefined, 2) }}</code></pre>
    </li>
    <li>
      raw height: {{ log(libraw?.getRawHeight()) }}
    </li>
    <li>
      raw width: {{ log(libraw?.getRawWidth()) }}
    </li>
    <li>
      iheighht: {{ log(libraw?.getIHeight()) }}
    </li>
    <li>
      iwidth: {{ log(libraw?.getIWidth()) }}
    </li>
    <li>
      color(0, 0): {{ log(libraw?.color(0, 0)) }}
    </li>
    <li>
      unpack function name: {{ log(libraw?.unpackFunctionName()) }}
    </li>
    <li>
      version: {{ log(libraw?.version()) }}
    </li>
    <li>
      version number: {{ log(libraw?.versionNumber()) }}
    </li>
    <li>
      camera count: {{ log(libraw?.cameraCount()) }}
    </li>
    <li>
      camera list: <pre><code>{{ log(libraw?.cameraList()) }}</code></pre>
    </li>
  </ul>
</template>

<style scoped>
</style>
