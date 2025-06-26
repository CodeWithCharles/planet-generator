export class HeightMap {
	private seed: number

	constructor(seed: number) {
		this.seed = seed
	}

	private rand(x: number, y: number): number {
		const s = Math.sin(x * 12.9898 + y * 78.233 + this.seed * 43758.5453)
		return s - Math.floor(s)
	}

	private interpolate(a: number, b: number, t: number): number {
		const f = (1 - Math.cos(t * Math.PI)) * 0.5
		return a * (1 - f) + b * f
	}

	get(lat: number, lon: number): number {
		const x = lat * 4
		const y = lon * 4

		const xi = Math.floor(x)
		const yi = Math.floor(y)

		const xf = x - xi
		const yf = y - yi

		const v1 = this.rand(xi, yi)
		const v2 = this.rand(xi + 1, yi)
		const v3 = this.rand(xi, yi + 1)
		const v4 = this.rand(xi + 1, yi + 1)

		const i1 = this.interpolate(v1, v2, xf)
		const i2 = this.interpolate(v3, v4, xf)

		return this.interpolate(i1, i2, yf)
	}
}
