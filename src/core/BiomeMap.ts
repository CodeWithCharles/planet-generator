import { ClimateModel } from "./ClimateModel"

export class BiomeMap {
	constructor(private climate: ClimateModel) {}

	get(lat: number, elevation: number, temperature: number): string {
		if (temperature < -20) return 'Frozen Wastes'
		if (temperature < -5) return 'Tundra'
		if (temperature < 10) return 'Taiga'
		if (temperature < 25) return 'Forest'
		if (temperature < 35) return 'Savanna'
		if (temperature < 60) return 'Desert'
		return 'Burnt'
	}
}
