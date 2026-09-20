/**
 * Agent Aura - continuous shader energy border around a DOM node
 *
 * Ported from the Three.js agent-motion-border demo into zero-dependency WebGL2.
 *
 * @author wangmiao<tuziling84@gmail.com>
 * @license MIT
 * @repository https://github.com/wangmiaozero/agent-aura
 */
import { greet } from './brand'
import {
	type AttachOptions,
	type TargetRef,
	ensurePositioned,
	resolveOptional,
	resolveTarget,
} from './dom'
import { createProgram } from './gl/program'
import fragmentSource from './motion-border/shaders/fragment.glsl'
import vertexSource from './motion-border/shaders/vertex.glsl'

const QUAD = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1])

export type MotionBorderOptions = {
	target?: HTMLElement
	container?: HTMLElement
	glowPadding?: number
	borderWidth?: number
	glowWidth?: number
	borderRadius?: number
	speed?: number
	classNames?: string
	styles?: Partial<CSSStyleDeclaration>
	zIndex?: number
	skipGreeting?: boolean
}

export class MotionBorder {
	readonly element: HTMLCanvasElement

	private canvas: HTMLCanvasElement
	private gl: WebGL2RenderingContext
	private program: WebGLProgram
	private vao: WebGLVertexArrayObject
	private buffer: WebGLBuffer
	private uTime: WebGLUniformLocation | null
	private uResolution: WebGLUniformLocation | null
	private uCardSize: WebGLUniformLocation | null
	private uBorderWidth: WebGLUniformLocation | null
	private uGlowWidth: WebGLUniformLocation | null
	private uRadius: WebGLUniformLocation | null
	private options: {
		glowPadding: number
		borderWidth: number
		glowWidth: number
		borderRadius: number
		speed: number
		zIndex: number
		skipGreeting?: boolean
		classNames?: string
		styles?: Partial<CSSStyleDeclaration>
	}
	private target?: HTMLElement
	private container?: HTMLElement
	private running = false
	private disposed = false
	private rafId: number | null = null
	private startTime = 0
	private observer?: ResizeObserver
	private onResize = (): void => {
		this.layout()
	}
	private onScroll = (): void => {
		this.layout()
	}

	static attach(target: TargetRef, options: AttachOptions<MotionBorderOptions> = {}): MotionBorder {
		const el = resolveTarget(target)
		const { container: containerRef, ...rest } = options
		const container =
			resolveOptional(containerRef) ??
			(el.parentElement && el.parentElement !== document.body ? el.parentElement : undefined)
		if (container) ensurePositioned(container)
		const border = new MotionBorder({ ...rest, target: el, container })
		;(container ?? document.body).appendChild(border.element)
		border.start()
		return border
	}

	constructor(options: MotionBorderOptions = {}) {
		this.options = {
			glowPadding: options.glowPadding ?? 110,
			borderWidth: options.borderWidth ?? 2.2,
			glowWidth: options.glowWidth ?? 115,
			borderRadius: options.borderRadius ?? 28,
			speed: options.speed ?? 1,
			zIndex: options.zIndex ?? 10,
			skipGreeting: options.skipGreeting,
			classNames: options.classNames,
			styles: options.styles,
		}
		this.target = options.target
		this.container = options.container

		this.canvas = document.createElement('canvas')
		if (this.options.classNames) this.canvas.className = this.options.classNames
		this.canvas.style.display = 'block'
		this.canvas.style.pointerEvents = 'none'
		this.canvas.style.background = 'transparent'
		this.canvas.style.zIndex = String(this.options.zIndex)
		this.canvas.style.transform = 'translateZ(0)'
		this.applyCanvasLayout()
		if (this.options.styles) Object.assign(this.canvas.style, this.options.styles)
		this.element = this.canvas

		const gl = this.canvas.getContext('webgl2', {
			alpha: true,
			antialias: false,
			premultipliedAlpha: false,
			powerPreference: 'high-performance',
		})
		if (!gl) throw new Error('WebGL2 is required but not available.')
		this.gl = gl

		this.program = createProgram(gl, vertexSource, fragmentSource)
		const vao = gl.createVertexArray()
		const buffer = gl.createBuffer()
		if (!vao || !buffer) throw new Error('Failed to create motion border geometry')
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
		this.uResolution = gl.getUniformLocation(this.program, 'uResolution')
		this.uCardSize = gl.getUniformLocation(this.program, 'uCardSize')
		this.uBorderWidth = gl.getUniformLocation(this.program, 'uBorderWidth')
		this.uGlowWidth = gl.getUniformLocation(this.program, 'uGlowWidth')
		this.uRadius = gl.getUniformLocation(this.program, 'uRadius')

		if (!this.options.skipGreeting) greet('agent-aura')
	}

	setTarget(target: HTMLElement): void {
		this.target = target
		this.observe()
		this.layout()
	}

	setContainer(container: HTMLElement): void {
		this.container = container
		this.applyCanvasLayout()
		this.observe()
		this.layout()
	}

	start(): void {
		if (this.disposed) throw new Error('MotionBorder instance has been disposed.')
		if (this.running) return
		this.running = true
		this.startTime = performance.now()
		this.observe()
		this.layout()
		this.render(0)

		const loop = (now: number) => {
			if (!this.running) return
			this.rafId = requestAnimationFrame(loop)
			this.render((now - this.startTime) * 0.001 * this.options.speed)
		}
		this.rafId = requestAnimationFrame(loop)
	}

	pause(): void {
		if (this.disposed) throw new Error('MotionBorder instance has been disposed.')
		this.running = false
		if (this.rafId !== null) cancelAnimationFrame(this.rafId)
		this.rafId = null
	}

	dispose(): void {
		if (this.disposed) return
		this.disposed = true
		this.running = false
		if (this.rafId !== null) cancelAnimationFrame(this.rafId)
		this.disconnect()
		this.gl.deleteBuffer(this.buffer)
		this.gl.deleteVertexArray(this.vao)
		this.gl.deleteProgram(this.program)
		this.canvas.remove()
	}

	private applyCanvasLayout(): void {
		this.canvas.style.position = this.container ? 'absolute' : 'fixed'
	}

	private observe(): void {
		this.disconnect()
		window.addEventListener('resize', this.onResize)
		window.addEventListener('scroll', this.onScroll, true)
		this.observer = new ResizeObserver(() => this.layout())
		if (this.target) this.observer.observe(this.target)
		if (this.container) this.observer.observe(this.container)
	}

	private disconnect(): void {
		window.removeEventListener('resize', this.onResize)
		window.removeEventListener('scroll', this.onScroll, true)
		this.observer?.disconnect()
		this.observer = undefined
	}

	private layout(): void {
		if (this.disposed) return
		const pad = this.options.glowPadding
		const target = this.target ?? this.container
		if (!target) return

		const rect = target.getBoundingClientRect()
		const width = Math.max(1, Math.round(rect.width + pad * 2))
		const height = Math.max(1, Math.round(rect.height + pad * 2))

		if (this.container) {
			const box = this.container.getBoundingClientRect()
			this.canvas.style.left = `${rect.left - box.left - pad}px`
			this.canvas.style.top = `${rect.top - box.top - pad}px`
		} else {
			this.canvas.style.left = `${rect.left - pad}px`
			this.canvas.style.top = `${rect.top - pad}px`
		}

		this.canvas.style.width = `${width}px`
		this.canvas.style.height = `${height}px`

		const dpr = Math.min(window.devicePixelRatio || 1, 2)
		const bw = Math.max(1, Math.floor(width * dpr))
		const bh = Math.max(1, Math.floor(height * dpr))
		if (this.canvas.width !== bw || this.canvas.height !== bh) {
			this.canvas.width = bw
			this.canvas.height = bh
		}

		const gl = this.gl
		gl.viewport(0, 0, bw, bh)
		gl.useProgram(this.program)
		gl.uniform2f(this.uResolution, bw, bh)
		gl.uniform2f(this.uCardSize, rect.width * dpr, rect.height * dpr)
		gl.uniform1f(this.uBorderWidth, this.options.borderWidth * dpr)
		gl.uniform1f(this.uGlowWidth, this.options.glowWidth * dpr)
		gl.uniform1f(this.uRadius, this.options.borderRadius * dpr)
		gl.clearColor(0, 0, 0, 0)
		gl.clear(gl.COLOR_BUFFER_BIT)
	}

	private render(time: number): void {
		const gl = this.gl
		gl.useProgram(this.program)
		gl.uniform1f(this.uTime, time)
		gl.disable(gl.DEPTH_TEST)
		gl.disable(gl.CULL_FACE)
		gl.enable(gl.BLEND)
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
		gl.clearColor(0, 0, 0, 0)
		gl.clear(gl.COLOR_BUFFER_BIT)
		gl.bindVertexArray(this.vao)
		gl.drawArrays(gl.TRIANGLES, 0, 6)
		gl.bindVertexArray(null)
	}
}
