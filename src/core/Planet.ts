import * as THREE from 'three'
import { PlanetGenerator } from './PlanetGenerator'
import { PlanetMaterial } from './PlanetMaterial'

export class Planet {
	private scene: THREE.Scene
	private camera: THREE.PerspectiveCamera
	private renderer: THREE.WebGLRenderer
	private mesh: THREE.Mesh
	private animationId = 0
	private generator: PlanetGenerator

	constructor(canvas: HTMLCanvasElement) {
		this.scene = new THREE.Scene()
		this.camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000)
		this.camera.position.z = 3

		this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
		this.renderer.setSize(canvas.clientWidth, canvas.clientHeight)

		this.generator = new PlanetGenerator()
		this.mesh = this.createPlanetMesh()

		this.scene.add(this.mesh)
		this.scene.add(new THREE.AmbientLight(0xffffff, 1))
	}

	private createPlanetMesh(): THREE.Mesh {
		const radius = 1
		const subd = 16
		const geometry = new THREE.IcosahedronGeometry(radius, subd)
		geometry.computeVertexNormals()

		const material = new PlanetMaterial()
		return new THREE.Mesh(geometry, material)
	}

	private getBiomeColor(biome: string): THREE.Color {
		switch (biome) {
			case 'Ocean': return new THREE.Color('#1e3a8a')
			case 'Tundra': return new THREE.Color('#94a3b8')
			case 'Taiga': return new THREE.Color('#4b5563')
			case 'Forest': return new THREE.Color('#15803d')
			case 'Savanna': return new THREE.Color('#facc15')
			case 'Desert': return new THREE.Color('#fbbf24')
			default: return new THREE.Color('#ffffff')
		}
	}

	animate() {
		(this.mesh.material as PlanetMaterial).update(performance.now() / 1000)
		this.mesh.rotation.y += 0.002
		this.renderer.render(this.scene, this.camera)
		this.animationId = requestAnimationFrame(() => this.animate())
	}

	dispose() {
		cancelAnimationFrame(this.animationId)
		this.renderer.dispose()
	}

	getCamera() { return this.camera }
	getMesh() { return this.mesh }
	getGenerator() { return this.generator }
	getRenderer() { return this.renderer }
}
