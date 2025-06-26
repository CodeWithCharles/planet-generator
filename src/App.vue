<template>
  <div class="relative w-screen h-screen overflow-hidden bg-black text-white">
    <PlanetCanvas />

    <div class="absolute top-4 left-4 z-10">
      <h1 class="text-2xl font-bold">Procedural Planet Generator</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import PlanetCanvas from '@/components/PlanetCanvas.vue'
</script>
