<template>
  <canvas ref="canvasRef" class="w-screen h-screen block"></canvas>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as THREE from 'three'
import { Planet } from '@/core/Planet'
import { usePlanetStore } from '@/stores/planet'
import { DataTargetRenderer } from '@/core/DataTargetRenderer'
import { BiomeMap } from '@/core/BiomeMap'

const canvasRef = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  if (!canvasRef.value) return

  const canvas = canvasRef.value
  const planet = new Planet(canvas)
  const renderer = planet.getRenderer()
  const dataTarget = new DataTargetRenderer(canvas.width, canvas.height, renderer, planet.getMesh(), planet.getCamera())
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()
  const biomeMap = new BiomeMap()

  planet.animate()

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect()
    const x = Math.floor(e.clientX - rect.left)
    const y = Math.floor(e.clientY - rect.top)

    // Determine latitude/longitude via raycasting
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
    raycaster.setFromCamera(mouse, planet.getCamera())
    const hits = raycaster.intersectObject(planet.getMesh())
    if (hits.length === 0) return
    const point = hits[0].point.clone().normalize()
    const lat = Math.asin(point.y) / Math.PI
    const lon = Math.atan2(point.z, point.x) / (2 * Math.PI)

    // Read encoded climate data from the GPU
    dataTarget.render()
    const pixel = dataTarget.readPixel(x, y)
    const decoded = dataTarget.decodePixel(pixel)
    const biome = biomeMap.get(decoded.temperature, decoded.pressure, decoded.elevation)

    usePlanetStore().setHover({
      lat,
      lon,
      biome,
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
