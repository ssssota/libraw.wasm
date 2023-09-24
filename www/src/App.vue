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
      parameters: <code>{{ JSON.stringify(log(libraw?.getIParams())) }}</code>
    </li>
    <li>
      lens info: <code>{{ JSON.stringify(log(libraw?.getLensInfo())) }}</code>
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
      camera list: <code>{{ log(libraw?.cameraList()) }}</code>
    </li>
  </ul>
</template>

<style scoped>
</style>
