import * as THREE from 'three'
import { DataMaterial } from './DataMaterial'

export class DataTargetRenderer {
	public renderTarget: THREE.WebGLRenderTarget
	public material: DataMaterial

        constructor(
                private width: number,
                private height: number,
                private renderer: THREE.WebGLRenderer,
                private mesh: THREE.Mesh,
                private camera: THREE.PerspectiveCamera,
                equatorTemp: number
        ) {
                this.renderTarget = new THREE.WebGLRenderTarget(width, height)
                this.material = new DataMaterial(equatorTemp)
        }

	render() {
		const originalMaterial = this.mesh.material
		this.mesh.material = this.material
		this.renderer.setRenderTarget(this.renderTarget)
		this.renderer.render(this.mesh, this.camera)
		this.renderer.setRenderTarget(null)
		this.mesh.material = originalMaterial
	}

	readPixel(x: number, y: number): Uint8Array {
		const pixel = new Uint8Array(4)
		this.renderer.readRenderTargetPixels(this.renderTarget, x, this.height - y, 1, 1, pixel)
		return pixel
	}

	decodePixel(pixel: Uint8Array): {
		elevation: number
		temperature: number
		pressure: number
	} {
		const r = pixel[0] / 255
		const g = pixel[1] / 255
		const b = pixel[2] / 255

		return {
			elevation: r,
			temperature: g * 100 - 50,
			pressure: b
		}
	}
}
