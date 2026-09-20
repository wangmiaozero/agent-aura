/**
 * Agent Aura - WebGL2 particle layer
 *
 * @author wangmiao<tuziling84@gmail.com>
 * @license MIT
 * @repository https://github.com/wangmiaozero/agent-aura
 */
import { createProgram } from '../gl/program'

export class ParticleLayer {
	readonly positions: Float32Array
	readonly colors: Float32Array
	readonly sizes: Float32Array
	readonly alphas: Float32Array

	private gl: WebGL2RenderingContext
	private program: WebGLProgram
	private vao: WebGLVertexArrayObject
	private positionBuffer: WebGLBuffer
	private colorBuffer: WebGLBuffer
	private sizeBuffer: WebGLBuffer
	private alphaBuffer: WebGLBuffer
	private uResolution: WebGLUniformLocation | null
	private uPixelRatio: WebGLUniformLocation | null
	private uCoreBoost: WebGLUniformLocation | null
	private uOuterStart: WebGLUniformLocation | null
	private uOuterEnd: WebGLUniformLocation | null
	private count: number

	constructor(
		gl: WebGL2RenderingContext,
		count: number,
		vertexSource: string,
		fragmentSource: string
	) {
		this.gl = gl
		this.count = count
		this.positions = new Float32Array(count * 3)
		this.colors = new Float32Array(count * 3)
		this.sizes = new Float32Array(count)
		this.alphas = new Float32Array(count)

		this.program = createProgram(gl, vertexSource, fragmentSource)
		const vao = gl.createVertexArray()
		if (!vao) throw new Error('Failed to create VAO')
		this.vao = vao
		gl.bindVertexArray(vao)

		this.positionBuffer = this.createAttribute('aPosition', this.positions, 3)
		this.colorBuffer = this.createAttribute('aColor', this.colors, 3)
		this.sizeBuffer = this.createAttribute('aSize', this.sizes, 1)
		this.alphaBuffer = this.createAttribute('aAlpha', this.alphas, 1)

		this.uResolution = gl.getUniformLocation(this.program, 'uResolution')
		this.uPixelRatio = gl.getUniformLocation(this.program, 'uPixelRatio')
		this.uCoreBoost = gl.getUniformLocation(this.program, 'uCoreBoost')
		this.uOuterStart = gl.getUniformLocation(this.program, 'uOuterStart')
		this.uOuterEnd = gl.getUniformLocation(this.program, 'uOuterEnd')

		gl.bindVertexArray(null)
		gl.bindBuffer(gl.ARRAY_BUFFER, null)
	}

	setStyle(coreBoost: number, outerStart: number, outerEnd: number): void {
		this.gl.useProgram(this.program)
		if (this.uCoreBoost) this.gl.uniform1f(this.uCoreBoost, coreBoost)
		if (this.uOuterStart) this.gl.uniform1f(this.uOuterStart, outerStart)
		if (this.uOuterEnd) this.gl.uniform1f(this.uOuterEnd, outerEnd)
	}

	setView(width: number, height: number, pixelRatio: number): void {
		this.gl.useProgram(this.program)
		this.gl.uniform2f(this.uResolution, width, height)
		this.gl.uniform1f(this.uPixelRatio, pixelRatio)
	}

	upload(): void {
		const gl = this.gl
		gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer)
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.positions)
		gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer)
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.colors)
		gl.bindBuffer(gl.ARRAY_BUFFER, this.sizeBuffer)
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.sizes)
		gl.bindBuffer(gl.ARRAY_BUFFER, this.alphaBuffer)
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.alphas)
	}

	draw(): void {
		const gl = this.gl
		gl.useProgram(this.program)
		gl.bindVertexArray(this.vao)
		gl.drawArrays(gl.POINTS, 0, this.count)
		gl.bindVertexArray(null)
	}

	dispose(): void {
		const gl = this.gl
		gl.deleteBuffer(this.positionBuffer)
		gl.deleteBuffer(this.colorBuffer)
		gl.deleteBuffer(this.sizeBuffer)
		gl.deleteBuffer(this.alphaBuffer)
		gl.deleteVertexArray(this.vao)
		gl.deleteProgram(this.program)
	}

	private createAttribute(name: string, data: Float32Array, size: number): WebGLBuffer {
		const gl = this.gl
		const buffer = gl.createBuffer()
		if (!buffer) throw new Error('Failed to create buffer')
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
		gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW)
		const location = gl.getAttribLocation(this.program, name)
		gl.enableVertexAttribArray(location)
		gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0)
		return buffer
	}
}
