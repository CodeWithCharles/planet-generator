<template>
	<canvas ref="canvasRef" class="planet-canvas"></canvas>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Planet } from '@/core/Planet'

const canvasRef = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
	if (canvasRef.value) {
		const planet = new Planet(canvasRef.value)
		planet.animate()
	}
})
</script>

<style scoped>
.planet-canvas {
	width: 100vw;
	height: 100vh;
	display: block;
}
</style>
