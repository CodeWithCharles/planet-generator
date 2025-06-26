export class ClimateModel {
	private baseTemp: number
	private basePressure: number

	constructor(baseTemp = 30, basePressure = 101.3) {
		this.baseTemp = baseTemp  // equator baseline
		this.basePressure = basePressure // in kPa
	}

	getBaseTemperature(lat: number): number {
		const equatorBias = 1 - Math.abs(lat) // lat ∈ [-1, 1]
		return this.baseTemp * equatorBias
	}

	getBasePressure(lat: number): number {
		// Optional: make it vary slightly by latitude (weather banding)
		return this.basePressure
	}

	getTemperature(lat: number, elevation: number): number {
		const base = this.getBaseTemperature(lat)
		const lapseRate = 6.5 // °C/km
		return base - lapseRate * (elevation * 10) // assuming elevation ∈ [0, 1] ~ km
	}

	getPressure(elevation: number): number {
		// Exponential drop, scale elevation as km
		const h = elevation * 10
		return this.basePressure * Math.exp(-0.12 * h)
	}
}
