import { defineStore } from 'pinia'

export const usePlanetStore = defineStore('planet', {
	state: () => ({
		hover: {
			lat: 0,
			lon: 0,
			elevation: 0,
			temperature: 0,
			pressure: 0,
			biome: 'Unknown'
		}
	}),
	actions: {
		setHover(info: Partial<typeof this.hover>) {
			Object.assign(this.hover, info)
		}
	}
})
