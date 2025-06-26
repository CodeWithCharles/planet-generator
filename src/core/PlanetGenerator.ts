import { HeightMap } from './HeightMap'
import { BiomeMap } from './BiomeMap'
import { ClimateModel } from './ClimateModel'
import { PlanetType, PlanetPresets } from './planetPresets'

export class PlanetGenerator {
        heightMap: HeightMap
        biomeMap: BiomeMap
        climateModel: ClimateModel

        constructor(seed = Math.random(), type: PlanetType = 'earth') {
                const preset = PlanetPresets[type]
                this.heightMap = new HeightMap(seed)
                this.climateModel = new ClimateModel(preset.equatorTemp)
                this.biomeMap = new BiomeMap(preset.seaLevel)
        }

	sample(lat: number, lon: number): {
		elevation: number
		temperature: number
		pressure: number
		biome: string
	} {
                const elevation = this.heightMap.get(lat, lon)
                const temperature = this.climateModel.getTemperature(lat, elevation)
                const pressure = this.climateModel.getPressure(elevation)
                const biome = this.biomeMap.get(temperature, pressure, elevation)
                return { elevation, temperature, pressure, biome }
	}
}
