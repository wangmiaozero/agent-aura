/**
 * Agent Aura - background glow quad
 *
 * @author wangmiao<tuziling84@gmail.com>
 * @license MIT
 * @repository https://github.com/wangmiaozero/agent-aura
 */
import { createProgram } from '../gl/program'

const QUAD = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1])

export class GlowQuad {
	private gl: WebGL2RenderingContext
	private program: WebGLProgram
	private vao: WebGLVertexArrayObject
	private buffer: WebGLBuffer
	private uTime: WebGLUniformLocation | null

	constructor(gl: WebGL2RenderingContext, vertexSource: string, fragmentSource: string) {
		this.gl = gl
		this.program = createProgram(gl, vertexSource, fragmentSource)
		const vao = gl.createVertexArray()
		const buffer = gl.createBuffer()
		if (!vao || !buffer) throw new Error('Failed to create glow geometry')
		this.vao = vao
		this.buffer = buffer

		gl.bindVertexArray(vao)
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
		gl.bufferData(gl.ARRAY_BUFFER, QUAD, gl.STATIC_DRAW)
		const aPosition = gl.getAttribLocation(this.program, 'aPosition')
		gl.enableVertexAttribArray(aPosition)
		gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)
		gl.bindVertexArray(null)

		this.uTime = gl.getUniformLocation(this.program, 'uTime')
	}

	draw(time: number): void {
		const gl = this.gl
		gl.useProgram(this.program)
		gl.uniform1f(this.uTime, time)
		gl.bindVertexArray(this.vao)
		gl.drawArrays(gl.TRIANGLES, 0, 6)
		gl.bindVertexArray(null)
	}

	dispose(): void {
		this.gl.deleteBuffer(this.buffer)
		this.gl.deleteVertexArray(this.vao)
		this.gl.deleteProgram(this.program)
	}
}
