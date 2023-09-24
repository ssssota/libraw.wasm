<script setup lang="ts">
import { LibRaw } from 'libraw.wasm';
import { ref } from 'vue';
const rawHeight = ref<number>();
const rawWidth = ref<number>();
const iHeight = ref<number>();
const iWidth = ref<number>();
const onFileChange = async (ev: Event) => {
  if (!(ev.currentTarget instanceof HTMLInputElement)) 
    return;
  const file = ev.currentTarget.files?.[0];
  if (!file) return;
  const libraw = await LibRaw.create();
  const buffer = await file.arrayBuffer();
  await libraw.open(buffer);
  rawHeight.value = libraw.getRawHeight();
  rawWidth.value = libraw.getRawWidth();
  iHeight.value = libraw.getIHeight();
  iWidth.value = libraw.getIWidth();
}
</script>

<template>
  <input type="file" @change="onFileChange" />
  <pre>raw height: {{ rawHeight }}
raw width: {{ rawWidth }}
i height: {{ iHeight }}
i width: {{ iWidth }}</pre>
</template>

<style scoped>
</style>
