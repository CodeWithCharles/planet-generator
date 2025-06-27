<template>
	<div class="relative w-screen h-screen overflow-hidden bg-black text-white">
		<PlanetCanvas />

		<div class="absolute top-4 left-4 z-10">
			<h1 class="text-2xl font-bold mb-4">Procedural Planet Generator</h1>
                <InfoPanel />
		</div>
	</div>
</template>

<script setup lang="ts">
import PlanetCanvas from '@/components/PlanetCanvas.vue'
import InfoPanel from '@/components/InfoPanel.vue'
</script>
