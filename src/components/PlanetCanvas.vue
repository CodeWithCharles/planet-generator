<template>
  <div class="relative w-screen h-screen">
    <canvas ref="canvasRef" class="w-full h-full block"></canvas>
    <div ref="crosshairRef" class="pointer-events-none absolute crosshair">
      <div class="vertical"></div>
      <div class="horizontal"></div>
    </div>
  </div>
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
const crosshairRef = ref<HTMLDivElement | null>(null)

onMounted(() => {
  if (!canvasRef.value) return

  const canvas = canvasRef.value
  const types: PlanetType[] = ['earth', 'ice', 'burnt', 'moon', 'gas']
  const type = types[Math.floor(Math.random() * types.length)]
  const planet = new Planet(canvas, type)
  const renderer = planet.getRenderer()
  const dataTarget = new DataTargetRenderer(
    canvas.width,
    canvas.height,
    renderer,
    planet.getMesh(),
    planet.getCamera(),
    planet.getEquatorTemp(),
    planet.getSeaLevel(),
    planet.getSeed()
  )
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
    const pxRatio = renderer.getPixelRatio()
    const pixelX = Math.floor(x * pxRatio)
    const pixelY = Math.floor(y * pxRatio)

    if (crosshairRef.value) {
      crosshairRef.value.style.left = `${x}px`
      crosshairRef.value.style.top = `${y}px`
    }

    // Determine latitude/longitude via raycasting
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
    raycaster.setFromCamera(mouse, planet.getCamera())
    const hits = raycaster.intersectObject(planet.getMesh())
    if (hits.length === 0) return

    const hitPoint = hits[0].point.clone()
    planet.updateLine(hitPoint)

    // Convert hit point to the planet's local space so that rotation
    // doesn't affect latitude/longitude calculations
    const local = planet.getMesh().worldToLocal(hitPoint.clone()).normalize()
    const lat = Math.asin(local.y) / Math.PI
    const lon = Math.atan2(local.z, local.x) / (2 * Math.PI)

    // Read encoded climate data from the GPU
    dataTarget.render()
    const pixel = dataTarget.readPixel(pixelX, pixelY)
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
.crosshair {
  width: 12px;
  height: 12px;
  transform: translate(-50%, -50%);
}
.crosshair .vertical {
  position: absolute;
  left: 50%;
  top: 0;
  width: 2px;
  height: 100%;
  background: red;
  transform: translateX(-50%);
}
.crosshair .horizontal {
  position: absolute;
  top: 50%;
  left: 0;
  height: 2px;
  width: 100%;
  background: red;
  transform: translateY(-50%);
}
</style>
