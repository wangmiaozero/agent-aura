/**
 * Agent Aura - shape-aware thunder / tribulation aura
 *
 * Ported from the Three.js shape-aware thunder demo into zero-dependency WebGL2.
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
import {
	type PathData,
	type Vec2,
	buildPathData,
	createTargetPath,
	getPointOnPath,
	randFloat,
	rotateVec,
} from './thunder/path'
import borderFrag from './thunder/shaders/border.frag.glsl'
import borderVert from './thunder/shaders/border.vert.glsl'
import lineFrag from './thunder/shaders/line.frag.glsl'
import lineVert from './thunder/shaders/line.vert.glsl'
import particleFrag from './thunder/shaders/particle.frag.glsl'
import particleVert from './thunder/shaders/particle.vert.glsl'

export type ThunderAuraOptions = {
	target?: HTMLElement
	container?: HTMLElement
	offset?: number
	cornerSegments?: number
	branchInterval?: number
	maxBranches?: number
	particleCount?: number
	zIndex?: number
	classNames?: string
	styles?: Partial<CSSStyleDeclaration>
	skipGreeting?: boolean
}

type ViewBox = { width: number; height: number; left: number; top: number }

type Particle = {
	t: number
	speed: number
	offset: number
	size: number
	phase: number
}

type Lightning = {
	positions: Float32Array
	life: number
	maxLife: number
	glowX: number
	glowY: number
}

export class ThunderAura {
	readonly element: HTMLCanvasElement

	private canvas: HTMLCanvasElement
	private gl: WebGL2RenderingContext
	private borderProgram: WebGLProgram
	private lineProgram: WebGLProgram
	private particleProgram: WebGLProgram
	private borderVao: WebGLVertexArrayObject
	private borderPos: WebGLBuffer
	private borderProg: WebGLBuffer
	private lineVao: WebGLVertexArrayObject
	private linePos: WebGLBuffer
	private particleVao: WebGLVertexArrayObject
	private particlePos: WebGLBuffer
	private particleSize: WebGLBuffer
	private uBorderRes: WebGLUniformLocation | null
	private uBorderTime: WebGLUniformLocation | null
	private uLineRes: WebGLUniformLocation | null
	private uLineColor: WebGLUniformLocation | null
	private uLineOpacity: WebGLUniformLocation | null
	private uParticleRes: WebGLUniformLocation | null
	private uParticleDpr: WebGLUniformLocation | null
	private options: {
		offset: number
		cornerSegments: number
		branchInterval: number
		maxBranches: number
		particleCount: number
		zIndex: number
		skipGreeting?: boolean
		classNames?: string
		styles?: Partial<CSSStyleDeclaration>
	}
	private target?: HTMLElement
	private container?: HTMLElement
	private pathData: PathData = { path: [], lengths: [], total: 0 }
	private particles: Particle[] = []
	private lightnings: Lightning[] = []
	private nextBranch = Math.random() * 200
	private borderCount = 0
	private running = false
	private disposed = false
	private rafId: number | null = null
	private lastTime = 0
	private startTime = 0
	private pixelRatio = 1
	private observer?: ResizeObserver
	private onResize = (): void => {
		this.resizeToView()
	}
	private onScroll = (): void => {
		this.rebuildPath()
	}

	static attach(target: TargetRef, options: AttachOptions<ThunderAuraOptions> = {}): ThunderAura {
		const el = resolveTarget(target)
		const { container: containerRef, ...rest } = options
		const container = resolveOptional(containerRef)
		if (container) ensurePositioned(container)
		const thunder = new ThunderAura({ ...rest, target: el, container })
		;(container ?? document.body).appendChild(thunder.element)
		thunder.start()
		return thunder
	}

	constructor(options: ThunderAuraOptions = {}) {
		this.options = {
			offset: Math.max(0, options.offset ?? 8),
			cornerSegments: Math.max(4, Math.round(options.cornerSegments ?? 12)),
			branchInterval: Math.max(20, options.branchInterval ?? 85),
			maxBranches: Math.max(1, Math.round(options.maxBranches ?? 16)),
			particleCount: Math.max(0, Math.round(options.particleCount ?? 90)),
			zIndex: options.zIndex ?? 20,
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
		this.applyCanvasLayout()
		if (this.options.styles) Object.assign(this.canvas.style, this.options.styles)
		this.element = this.canvas

		const gl = this.canvas.getContext('webgl2', {
			alpha: true,
			antialias: true,
			premultipliedAlpha: false,
			powerPreference: 'high-performance',
		})
		if (!gl) throw new Error('WebGL2 is required but not available.')
		this.gl = gl

		this.borderProgram = createProgram(gl, borderVert, borderFrag)
		this.lineProgram = createProgram(gl, lineVert, lineFrag)
		this.particleProgram = createProgram(gl, particleVert, particleFrag)

		const borderVao = gl.createVertexArray()
		const borderPos = gl.createBuffer()
		const borderProg = gl.createBuffer()
		const lineVao = gl.createVertexArray()
		const linePos = gl.createBuffer()
		const particleVao = gl.createVertexArray()
		const particlePos = gl.createBuffer()
		const particleSize = gl.createBuffer()
		if (
			!borderVao ||
			!borderPos ||
			!borderProg ||
			!lineVao ||
			!linePos ||
			!particleVao ||
			!particlePos ||
			!particleSize
		) {
			throw new Error('Failed to create thunder geometry')
		}
		this.borderVao = borderVao
		this.borderPos = borderPos
		this.borderProg = borderProg
		this.lineVao = lineVao
		this.linePos = linePos
		this.particleVao = particleVao
		this.particlePos = particlePos
		this.particleSize = particleSize

		gl.bindVertexArray(borderVao)
		gl.bindBuffer(gl.ARRAY_BUFFER, borderPos)
		const aBorderPos = gl.getAttribLocation(this.borderProgram, 'aPosition')
		gl.enableVertexAttribArray(aBorderPos)
		gl.vertexAttribPointer(aBorderPos, 2, gl.FLOAT, false, 0, 0)
		gl.bindBuffer(gl.ARRAY_BUFFER, borderProg)
		const aProgress = gl.getAttribLocation(this.borderProgram, 'aProgress')
		gl.enableVertexAttribArray(aProgress)
		gl.vertexAttribPointer(aProgress, 1, gl.FLOAT, false, 0, 0)
		gl.bindVertexArray(null)

		gl.bindVertexArray(lineVao)
		gl.bindBuffer(gl.ARRAY_BUFFER, linePos)
		const aLinePos = gl.getAttribLocation(this.lineProgram, 'aPosition')
		gl.enableVertexAttribArray(aLinePos)
		gl.vertexAttribPointer(aLinePos, 2, gl.FLOAT, false, 0, 0)
		gl.bindVertexArray(null)

		gl.bindVertexArray(particleVao)
		gl.bindBuffer(gl.ARRAY_BUFFER, particlePos)
		const aParticlePos = gl.getAttribLocation(this.particleProgram, 'aPosition')
		gl.enableVertexAttribArray(aParticlePos)
		gl.vertexAttribPointer(aParticlePos, 2, gl.FLOAT, false, 0, 0)
		gl.bindBuffer(gl.ARRAY_BUFFER, particleSize)
		const aSize = gl.getAttribLocation(this.particleProgram, 'aSize')
		gl.enableVertexAttribArray(aSize)
		gl.vertexAttribPointer(aSize, 1, gl.FLOAT, false, 0, 0)
		gl.bindVertexArray(null)

		this.uBorderRes = gl.getUniformLocation(this.borderProgram, 'uResolution')
		this.uBorderTime = gl.getUniformLocation(this.borderProgram, 'uTime')
		this.uLineRes = gl.getUniformLocation(this.lineProgram, 'uResolution')
		this.uLineColor = gl.getUniformLocation(this.lineProgram, 'uColor')
		this.uLineOpacity = gl.getUniformLocation(this.lineProgram, 'uOpacity')
		this.uParticleRes = gl.getUniformLocation(this.particleProgram, 'uResolution')
		this.uParticleDpr = gl.getUniformLocation(this.particleProgram, 'uPixelRatio')

		this.seedParticles()
		if (!this.options.skipGreeting) greet('agent-aura')
	}

	setTarget(target: HTMLElement): void {
		this.target = target
		this.observe()
		this.rebuildPath()
	}

	setContainer(container: HTMLElement): void {
		this.container = container
		this.applyCanvasLayout()
		this.observe()
		this.resizeToView()
	}

	start(): void {
		if (this.disposed) throw new Error('ThunderAura instance has been disposed.')
		if (this.running) return
		this.running = true
		this.startTime = performance.now()
		this.lastTime = this.startTime
		this.observe()
		this.resizeToView()

		const loop = (now: number) => {
			if (!this.running) return
			this.rafId = requestAnimationFrame(loop)
			const delta = Math.min((now - this.lastTime) / 1000, 0.033)
			this.lastTime = now
			this.render((now - this.startTime) * 0.001, delta)
		}
		this.rafId = requestAnimationFrame(loop)
	}

	pause(): void {
		if (this.disposed) throw new Error('ThunderAura instance has been disposed.')
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
		const gl = this.gl
		gl.deleteBuffer(this.borderPos)
		gl.deleteBuffer(this.borderProg)
		gl.deleteBuffer(this.linePos)
		gl.deleteBuffer(this.particlePos)
		gl.deleteBuffer(this.particleSize)
		gl.deleteVertexArray(this.borderVao)
		gl.deleteVertexArray(this.lineVao)
		gl.deleteVertexArray(this.particleVao)
		gl.deleteProgram(this.borderProgram)
		gl.deleteProgram(this.lineProgram)
		gl.deleteProgram(this.particleProgram)
		this.canvas.remove()
	}

	private applyCanvasLayout(): void {
		const contained = Boolean(this.container)
		this.canvas.style.position = contained ? 'absolute' : 'fixed'
		this.canvas.style.inset = '0'
		this.canvas.style.width = '100%'
		this.canvas.style.height = '100%'
	}

	private viewBox(): ViewBox {
		if (this.container) {
			const rect = this.container.getBoundingClientRect()
			return { width: rect.width, height: rect.height, left: rect.left, top: rect.top }
		}
		return { width: window.innerWidth, height: window.innerHeight, left: 0, top: 0 }
	}

	private observe(): void {
		this.disconnect()
		window.addEventListener('resize', this.onResize)
		window.addEventListener('scroll', this.onScroll, true)
		this.observer = new ResizeObserver(() => this.resizeToView())
		if (this.target) this.observer.observe(this.target)
		if (this.container) this.observer.observe(this.container)
	}

	private disconnect(): void {
		window.removeEventListener('resize', this.onResize)
		window.removeEventListener('scroll', this.onScroll, true)
		this.observer?.disconnect()
		this.observer = undefined
	}

	private resizeToView(): void {
		if (this.disposed) return
		const view = this.viewBox()
		this.pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
		const width = Math.max(1, Math.floor(view.width * this.pixelRatio))
		const height = Math.max(1, Math.floor(view.height * this.pixelRatio))
		if (this.canvas.width !== width || this.canvas.height !== height) {
			this.canvas.width = width
			this.canvas.height = height
		}
		this.gl.viewport(0, 0, width, height)
		this.rebuildPath()
	}

	private seedParticles(): void {
		this.particles = []
		for (let i = 0; i < this.options.particleCount; i++) {
			this.particles.push({
				t: Math.random(),
				speed: randFloat(0.025, 0.095),
				offset: randFloat(-7, 15),
				size: randFloat(2, 6),
				phase: Math.random() * Math.PI * 2,
			})
		}
	}

	private rebuildPath(): void {
		if (!this.target || this.disposed) return
		const view = this.viewBox()
		const path = createTargetPath(
			this.target,
			view.left,
			view.top,
			this.options.offset,
			this.options.cornerSegments
		)
		this.pathData = buildPathData(path)
		this.borderCount = path.length

		const positions = new Float32Array(path.length * 2)
		const progress = new Float32Array(path.length)
		for (let i = 0; i < path.length; i++) {
			positions[i * 2] = path[i].x
			positions[i * 2 + 1] = path[i].y
			progress[i] = i / path.length
		}
		const gl = this.gl
		gl.bindBuffer(gl.ARRAY_BUFFER, this.borderPos)
		gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW)
		gl.bindBuffer(gl.ARRAY_BUFFER, this.borderProg)
		gl.bufferData(gl.ARRAY_BUFFER, progress, gl.DYNAMIC_DRAW)
	}

	private spawnLightning(): void {
		if (this.lightnings.length >= this.options.maxBranches || this.pathData.total <= 0) return
		const info = getPointOnPath(this.pathData, Math.random())
		const view = this.viewBox()
		const rect = this.target!.getBoundingClientRect()
		const center: Vec2 = {
			x: rect.left - view.left + rect.width / 2,
			y: rect.top - view.top + rect.height / 2,
		}
		const awayX = info.point.x - center.x
		const awayY = info.point.y - center.y
		const awayLen = Math.hypot(awayX, awayY) || 1
		const away = { x: awayX / awayLen, y: awayY / awayLen }
		let normal = info.normal
		if (normal.x * away.x + normal.y * away.y < 0) {
			normal = { x: -normal.x, y: -normal.y }
		}
		normal = rotateVec(normal, randFloat(-0.35, 0.35))

		const length = randFloat(32, 100)
		const segments = Math.floor(randFloat(7, 14))
		const positions = new Float32Array((segments + 1) * 2)
		let current = { ...info.point }
		positions[0] = current.x
		positions[1] = current.y
		const tangent = { x: -normal.y, y: normal.x }
		for (let i = 1; i <= segments; i++) {
			current = {
				x: current.x + (normal.x * length) / segments + tangent.x * randFloat(-12, 12),
				y: current.y + (normal.y * length) / segments + tangent.y * randFloat(-12, 12),
			}
			positions[i * 2] = current.x
			positions[i * 2 + 1] = current.y
		}
		this.lightnings.push({
			positions,
			life: 0,
			maxLife: randFloat(0.08, 0.22),
			glowX: info.point.x,
			glowY: info.point.y,
		})
	}

	private drawLine(
		positions: Float32Array,
		color: [number, number, number],
		opacity: number
	): void {
		const gl = this.gl
		const view = this.viewBox()
		gl.useProgram(this.lineProgram)
		gl.uniform2f(this.uLineRes, view.width, view.height)
		gl.uniform3f(this.uLineColor, color[0], color[1], color[2])
		gl.uniform1f(this.uLineOpacity, opacity)
		gl.bindVertexArray(this.lineVao)
		gl.bindBuffer(gl.ARRAY_BUFFER, this.linePos)
		gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW)
		gl.drawArrays(gl.LINE_STRIP, 0, positions.length / 2)
		gl.bindVertexArray(null)
	}

	private drawGlow(x: number, y: number, scale: number, opacity: number): void {
		const r = 8 * scale
		const segments = 16
		const positions = new Float32Array((segments + 2) * 2)
		positions[0] = x
		positions[1] = y
		for (let i = 0; i <= segments; i++) {
			const a = (i / segments) * Math.PI * 2
			positions[(i + 1) * 2] = x + Math.cos(a) * r
			positions[(i + 1) * 2 + 1] = y + Math.sin(a) * r
		}
		this.drawLine(positions, [0.66, 0.55, 1], opacity * 0.4)
	}

	private render(time: number, delta: number): void {
		if (this.disposed || !this.target) return
		const gl = this.gl
		const view = this.viewBox()
		gl.clearColor(0, 0, 0, 0)
		gl.clear(gl.COLOR_BUFFER_BIT)
		gl.enable(gl.BLEND)
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE)
		gl.disable(gl.DEPTH_TEST)

		if (this.borderCount > 1) {
			gl.useProgram(this.borderProgram)
			gl.uniform2f(this.uBorderRes, view.width, view.height)
			gl.uniform1f(this.uBorderTime, time)
			gl.bindVertexArray(this.borderVao)
			gl.drawArrays(gl.LINE_LOOP, 0, this.borderCount)
			gl.bindVertexArray(null)
		}

		if (this.particles.length > 0 && this.pathData.total > 0) {
			const positions = new Float32Array(this.particles.length * 2)
			const sizes = new Float32Array(this.particles.length)
			for (let i = 0; i < this.particles.length; i++) {
				const p = this.particles[i]
				p.t += delta * p.speed
				const info = getPointOnPath(this.pathData, p.t)
				const wave = Math.sin(time * 6 + p.phase)
				const offset = p.offset + wave * 3
				positions[i * 2] = info.point.x + info.normal.x * offset
				positions[i * 2 + 1] = info.point.y + info.normal.y * offset
				sizes[i] = p.size * (0.6 + Math.abs(wave) * 0.8)
			}
			gl.useProgram(this.particleProgram)
			gl.uniform2f(this.uParticleRes, view.width, view.height)
			gl.uniform1f(this.uParticleDpr, this.pixelRatio)
			gl.bindVertexArray(this.particleVao)
			gl.bindBuffer(gl.ARRAY_BUFFER, this.particlePos)
			gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW)
			gl.bindBuffer(gl.ARRAY_BUFFER, this.particleSize)
			gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.DYNAMIC_DRAW)
			gl.drawArrays(gl.POINTS, 0, this.particles.length)
			gl.bindVertexArray(null)
		}

		this.nextBranch -= delta * 1000
		if (this.nextBranch <= 0) {
			this.spawnLightning()
			if (Math.random() < 0.18) {
				this.spawnLightning()
				this.spawnLightning()
			}
			this.nextBranch = this.options.branchInterval + Math.random() * 260
		}

		for (let i = this.lightnings.length - 1; i >= 0; i--) {
			const bolt = this.lightnings[i]
			bolt.life += delta
			const p = bolt.life / bolt.maxLife
			const flicker = Math.random() > 0.28 ? 1 : 0.15
			this.drawLine(bolt.positions, [0.59, 0.41, 1], (1 - p) * 0.35)
			this.drawLine(bolt.positions, [0.94, 0.92, 1], (1 - p) * flicker)
			this.drawGlow(bolt.glowX, bolt.glowY, 1 + p * 2.5, (1 - p) * 0.4)
			if (bolt.life >= bolt.maxLife) this.lightnings.splice(i, 1)
		}
	}
}
