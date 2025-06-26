import * as THREE from 'three'
import { PlanetGenerator } from './PlanetGenerator'

export class HoverManager {
	private raycaster = new THREE.Raycaster()
	private mouse = new THREE.Vector2()
	private generator: PlanetGenerator

	constructor(private camera: THREE.Camera, private mesh: THREE.Mesh, generator: PlanetGenerator) {
		this.generator = generator
	}

	handleMouseMove(event: MouseEvent, canvas: HTMLCanvasElement, onHover: (info: any) => void) {
		const rect = canvas.getBoundingClientRect()
		this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
		this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

		this.raycaster.setFromCamera(this.mouse, this.camera)

		const intersects = this.raycaster.intersectObject(this.mesh)
		if (intersects.length > 0) {
			const point = intersects[0].point.clone().normalize()
			const lat = Math.asin(point.y) / Math.PI
			const lon = Math.atan2(point.z, point.x) / (2 * Math.PI)

			const { elevation, temperature, pressure, biome } = this.generator.sample(lat, lon)

			onHover({ lat, lon, elevation, temperature, pressure, biome })
		}
	}
}
