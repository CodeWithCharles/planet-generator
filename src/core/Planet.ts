import * as THREE from 'three'
import { PlanetGenerator } from './PlanetGenerator'
import { PlanetMaterial, PlanetMaterialOptions } from './PlanetMaterial'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { PlanetType, PlanetPreset, PlanetPresets } from './planetPresets'

export class Planet {
        private scene: THREE.Scene
        private camera: THREE.PerspectiveCamera
        private renderer: THREE.WebGLRenderer
        private mesh: THREE.Mesh
        private animationId = 0
        private generator: PlanetGenerator
        private controls: OrbitControls
        private line: THREE.Line
        private autoRotate = true
        private preset: PlanetPreset
        private seed: number

        constructor(canvas: HTMLCanvasElement, type: PlanetType = 'earth') {
                this.scene = new THREE.Scene()
                this.camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000)
                this.camera.position.z = 3

                this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
                this.renderer.setSize(canvas.clientWidth, canvas.clientHeight)

                this.preset = PlanetPresets[type]
                this.seed = Math.random() * 1000
                this.generator = new PlanetGenerator(this.seed, type)
                this.mesh = this.createPlanetMesh({
                        seaLevel: this.preset.seaLevel,
                        equatorTemp: this.preset.equatorTemp,
                        seed: this.seed
                })

                this.controls = new OrbitControls(this.camera, this.renderer.domElement)
                this.controls.enableDamping = true
                this.controls.enablePan = false
                this.controls.mouseButtons = {
                        LEFT: THREE.MOUSE.PAN,
                        MIDDLE: THREE.MOUSE.ROTATE,
                        RIGHT: THREE.MOUSE.DOLLY
                }

                const lineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()])
                const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff })
                this.line = new THREE.Line(lineGeo, lineMat)
                this.scene.add(this.line)

		this.scene.add(this.mesh)
		this.scene.add(new THREE.AmbientLight(0xffffff, 1))
	}

        private createPlanetMesh(options: PlanetMaterialOptions): THREE.Mesh {
                const radius = 1
                const subd = 16
                const geometry = new THREE.IcosahedronGeometry(radius, subd)
                geometry.computeVertexNormals()

                const material = new PlanetMaterial(options)
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
                if (this.autoRotate) this.mesh.rotation.y += 0.002
                this.controls.update()
                this.renderer.render(this.scene, this.camera)
                this.animationId = requestAnimationFrame(() => this.animate())
        }

        dispose() {
                cancelAnimationFrame(this.animationId)
                this.renderer.dispose()
        }

        setAutoRotate(value: boolean) {
                this.autoRotate = value
        }

        updateLine(target: THREE.Vector3) {
                const pos = this.line.geometry.getAttribute('position') as THREE.BufferAttribute
                pos.setXYZ(0, this.camera.position.x, this.camera.position.y, this.camera.position.z)
                pos.setXYZ(1, target.x, target.y, target.z)
                pos.needsUpdate = true
        }

        getCamera() { return this.camera }
        getMesh() { return this.mesh }
        getGenerator() { return this.generator }
        getEquatorTemp() { return this.preset.equatorTemp }
        getSeaLevel() { return this.preset.seaLevel }
        getSeed() { return this.seed }
        getRenderer() { return this.renderer }
}
