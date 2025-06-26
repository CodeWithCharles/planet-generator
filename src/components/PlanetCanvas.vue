<template>
  <canvas ref="canvasRef" class="w-screen h-screen block"></canvas>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Planet } from '@/core/Planet'
import { usePlanetStore } from '@/stores/planet'
import { DataTargetRenderer } from '@/core/DataTargetRenderer'

const canvasRef = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  if (!canvasRef.value) return

  const canvas = canvasRef.value
  const planet = new Planet(canvas)
  const renderer = planet.getRenderer()
  const dataTarget = new DataTargetRenderer(canvas.width, canvas.height, renderer, planet.getMesh(), planet.getCamera())

  planet.animate()

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect()
    const x = Math.floor(e.clientX - rect.left)
    const y = Math.floor(e.clientY - rect.top)

    dataTarget.render()
    const pixel = dataTarget.readPixel(x, y)
    const decoded = dataTarget.decodePixel(pixel)

    usePlanetStore().setHover({
      lat: 0, // placeholder, will replace with raycast logic later
      lon: 0,
      biome: 'Unknown',
      ...decoded
    })
  })
})
</script>

<style scoped>
canvas {
  display: block;
}
</style>
