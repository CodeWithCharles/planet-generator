<template>
  <div class="bg-gray-800 bg-opacity-80 text-white p-4 rounded-xl shadow-xl w-64">
    <h2 class="text-lg font-semibold mb-3">Planet Info</h2>
    <div class="space-y-1 text-sm">
      <p><span class="font-medium">Biome:</span> {{ hover.biome }}</p>
      <p><span class="font-medium">Lat:</span> {{ hover.lat.toFixed(2) }}</p>
      <p><span class="font-medium">Lon:</span> {{ hover.lon.toFixed(2) }}</p>
      <p><span class="font-medium">Elevation:</span> {{ (hover.elevation * 1000).toFixed(1) }} m</p>
      <p><span class="font-medium">Temperature:</span> {{ hover.temperature.toFixed(1) }} °C</p>
      <p><span class="font-medium">Pressure:</span> {{ hover.pressure.toFixed(2) }} kPa</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePlanetStore } from '@/stores/planet'
import { storeToRefs } from 'pinia'

const store = usePlanetStore()
const { hover } = storeToRefs(store)
</script>
