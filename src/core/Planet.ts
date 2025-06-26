import * as THREE from 'three'

export class Planet {
	private scene: THREE.Scene
	private camera: THREE.PerspectiveCamera
	private renderer: THREE.WebGLRenderer
	private mesh: THREE.Mesh
	private animationId = 0

	constructor(canvas: HTMLCanvasElement) {
		this.scene = new THREE.Scene()
		this.camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000)
		this.camera.position.z = 3

		this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
		this.renderer.setSize(canvas.clientWidth, canvas.clientHeight)

		const geometry = new THREE.SphereGeometry(1, 64, 64)
		const material = new THREE.MeshStandardMaterial({ color: 'lightblue', flatShading: false })
		this.mesh = new THREE.Mesh(geometry, material)

		this.scene.add(this.mesh)
		this.scene.add(new THREE.AmbientLight(0xffffff, 1))
	}

	animate() {
		this.mesh.rotation.y += 0.002
		this.renderer.render(this.scene, this.camera)
		this.animationId = requestAnimationFrame(() => this.animate())
	}

	dispose() {
		cancelAnimationFrame(this.animationId)
		this.renderer.dispose()
	}
}
