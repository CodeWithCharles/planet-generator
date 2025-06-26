<template>
  <canvas ref="canvasRef" class="w-screen h-screen block"></canvas>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as THREE from 'three'
import { Planet } from '@/core/Planet'
import { usePlanetStore } from '@/stores/planet'
import { DataTargetRenderer } from '@/core/DataTargetRenderer'
import type { PlanetType } from '@/core/planetPresets'
import { BiomeMap } from '@/core/BiomeMap'

const canvasRef = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  if (!canvasRef.value) return

  const canvas = canvasRef.value
  const types: PlanetType[] = ['earth', 'ice', 'burnt', 'moon', 'gas']
  const type = types[Math.floor(Math.random() * types.length)]
  const planet = new Planet(canvas, type)
  const renderer = planet.getRenderer()
  const dataTarget = new DataTargetRenderer(canvas.width, canvas.height, renderer, planet.getMesh(), planet.getCamera(), planet.getEquatorTemp())
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()
  const biomeMap = planet.getGenerator().biomeMap

  planet.animate()

  let rotating = true
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      rotating = !rotating
      planet.setAutoRotate(rotating)
    }
  })

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
    const hitPoint = hits[0].point.clone()
    planet.updateLine(hitPoint)
    const norm = hitPoint.clone().normalize()
    const lat = Math.asin(norm.y) / Math.PI
    const lon = Math.atan2(norm.z, norm.x) / (2 * Math.PI)

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
