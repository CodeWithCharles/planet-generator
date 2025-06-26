import { HeightMap } from './HeightMap'
import { BiomeMap } from './BiomeMap'
import { ClimateModel } from './ClimateModel'

export class PlanetGenerator {
	heightMap: HeightMap
	biomeMap: BiomeMap
	climateModel: ClimateModel

        constructor(seed = Math.random()) {
                this.heightMap = new HeightMap(seed)
                this.climateModel = new ClimateModel()
                this.biomeMap = new BiomeMap()
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
