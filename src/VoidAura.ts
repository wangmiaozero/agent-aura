/**
 * Agent Aura - shape-aware void / blackhole aura
 *
 * Ported from the Three.js void-blackhole demo into zero-dependency WebGL2.
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
	type PathSample,
	type Vec2,
	buildPathData,
	createTargetPath,
	getPointOnPath,
	randFloat,
} from './thunder/path'
import glowFrag from './void/shaders/glow.frag.glsl'
import pointFrag from './void/shaders/point.frag.glsl'
import pointVert from './void/shaders/point.vert.glsl'
import ribbonVert from './void/shaders/ribbon.vert.glsl'
import shadowFrag from './void/shaders/shadow.frag.glsl'

export type VoidAuraOptions = {
	target?: HTMLElement
	container?: HTMLElement
	offset?: number
	shadowWidth?: number
	horizonWidth?: number
	highlightWidth?: number
	pathSamples?: number
	cornerSegments?: number
	mistCount?: number
	sparkCount?: number
	speed?: number
	zIndex?: number
	classNames?: string
	styles?: Partial<CSSStyleDeclaration>
	skipGreeting?: boolean
}

type ViewBox = { width: number; height: number; left: number; top: number }

type RibbonKind = 'shadow' | 'glow'

type RibbonLayer = {
	kind: RibbonKind
	halfWidth: number
	opacity: number
	coreBoost: number
	haloBoost: number
	vao: WebGLVertexArrayObject
	pos: WebGLBuffer
	prog: WebGLBuffer
	side: WebGLBuffer
	idx: WebGLBuffer
	indexCount: number
}

type MistParticle = {
	t: number
	speed: number
	offset: number
	swirl: number
	size: number
	alpha: number
	phase: number
	phase2: number
	phase3: number
}

type SparkParticle = {
	t: number
	speed: number
	offset: number
	size: number
	alpha: number
	phase: number
	phase2: number
}

type ParticleGpu = {
	vao: WebGLVertexArrayObject
	pos: WebGLBuffer
	size: WebGLBuffer
	alpha: WebGLBuffer
	color: WebGLBuffer
}

const MIST_C1: [number, number, number] = [0.0706, 0.0314, 0.0902]
const MIST_C2: [number, number, number] = [0.3647, 0.0745, 0.5647]
const SPARK_C1: [number, number, number] = [0.4, 0.1255, 1]
const SPARK_C2: [number, number, number] = [0.9529, 0.6902, 1]

function lerpColor(
	a: [number, number, number],
	b: [number, number, number],
	t: number
): [number, number, number] {
	return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
}

export class VoidAura {
	readonly element: HTMLCanvasElement

	private canvas: HTMLCanvasElement
	private gl: WebGL2RenderingContext
	private shadowProgram: WebGLProgram
	private glowProgram: WebGLProgram
	private pointProgram: WebGLProgram
	private layers: RibbonLayer[] = []
	private mistGpu: ParticleGpu
	private sparkGpu: ParticleGpu
	private uShadowRes: WebGLUniformLocation | null
	private uShadowTime: WebGLUniformLocation | null
	private uShadowOpacity: WebGLUniformLocation | null
	private uGlowRes: WebGLUniformLocation | null
	private uGlowTime: WebGLUniformLocation | null
	private uGlowOpacity: WebGLUniformLocation | null
	private uGlowCore: WebGLUniformLocation | null
	private uGlowHalo: WebGLUniformLocation | null
	private uPointRes: WebGLUniformLocation | null
	private uPointDpr: WebGLUniformLocation | null
	private mistData: MistParticle[] = []
	private sparkData: SparkParticle[] = []
	private pathData: PathData = { path: [], lengths: [], total: 0 }
	private center: Vec2 = { x: 0, y: 0 }
	private options: {
		offset: number
		shadowWidth: number
		horizonWidth: number
		highlightWidth: number
		pathSamples: number
		cornerSegments: number
		mistCount: number
		sparkCount: number
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
	private lastTime = 0
	private startTime = 0
	private pixelRatio = 1
	private observer?: ResizeObserver
	private onResize = (): void => {
		this.resizeToView()
	}
	private onScroll = (): void => {
		this.rebuild()
	}

	static attach(target: TargetRef, options: AttachOptions<VoidAuraOptions> = {}): VoidAura {
		const el = resolveTarget(target)
		const { container: containerRef, ...rest } = options
		const container = resolveOptional(containerRef)
		if (container) ensurePositioned(container)
		const aura = new VoidAura({ ...rest, target: el, container })
		;(container ?? document.body).appendChild(aura.element)
		aura.start()
		return aura
	}

	constructor(options: VoidAuraOptions = {}) {
		this.options = {
			offset: Math.max(0, options.offset ?? 6),
			shadowWidth: Math.max(1, options.shadowWidth ?? 78),
			horizonWidth: Math.max(1, options.horizonWidth ?? 30),
			highlightWidth: Math.max(1, options.highlightWidth ?? 12),
			pathSamples: Math.max(32, Math.round(options.pathSamples ?? 520)),
			cornerSegments: Math.max(4, Math.round(options.cornerSegments ?? 24)),
			mistCount: Math.max(0, Math.round(options.mistCount ?? 190)),
			sparkCount: Math.max(0, Math.round(options.sparkCount ?? 95)),
			speed: Math.max(0.1, options.speed ?? 1),
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

		this.shadowProgram = createProgram(gl, ribbonVert, shadowFrag)
		this.glowProgram = createProgram(gl, ribbonVert, glowFrag)
		this.pointProgram = createProgram(gl, pointVert, pointFrag)

		this.layers.push(
			this.createRibbonLayer({
				kind: 'shadow',
				halfWidth: this.options.shadowWidth,
				opacity: 0.88,
				coreBoost: 0,
				haloBoost: 1,
			}),
			this.createRibbonLayer({
				kind: 'glow',
				halfWidth: this.options.horizonWidth,
				opacity: 1,
				coreBoost: 0.85,
				haloBoost: 0.95,
			}),
			this.createRibbonLayer({
				kind: 'glow',
				halfWidth: this.options.highlightWidth,
				opacity: 0.85,
				coreBoost: 1.1,
				haloBoost: 0.2,
			})
		)

		this.mistGpu = this.createParticleGpu()
		this.sparkGpu = this.createParticleGpu()

		this.uShadowRes = gl.getUniformLocation(this.shadowProgram, 'uResolution')
		this.uShadowTime = gl.getUniformLocation(this.shadowProgram, 'uTime')
		this.uShadowOpacity = gl.getUniformLocation(this.shadowProgram, 'uOpacity')
		this.uGlowRes = gl.getUniformLocation(this.glowProgram, 'uResolution')
		this.uGlowTime = gl.getUniformLocation(this.glowProgram, 'uTime')
		this.uGlowOpacity = gl.getUniformLocation(this.glowProgram, 'uOpacity')
		this.uGlowCore = gl.getUniformLocation(this.glowProgram, 'uCoreBoost')
		this.uGlowHalo = gl.getUniformLocation(this.glowProgram, 'uHaloBoost')
		this.uPointRes = gl.getUniformLocation(this.pointProgram, 'uResolution')
		this.uPointDpr = gl.getUniformLocation(this.pointProgram, 'uPixelRatio')

		this.seedParticles()
		if (!this.options.skipGreeting) greet('agent-aura')
	}

	setTarget(target: HTMLElement): void {
		this.target = target
		this.observe()
		this.rebuild()
	}

	setContainer(container: HTMLElement): void {
		this.container = container
		this.applyCanvasLayout()
		this.observe()
		this.resizeToView()
	}

	start(): void {
		if (this.disposed) throw new Error('VoidAura instance has been disposed.')
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
		if (this.disposed) throw new Error('VoidAura instance has been disposed.')
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
		for (const layer of this.layers) {
			gl.deleteBuffer(layer.pos)
			gl.deleteBuffer(layer.prog)
			gl.deleteBuffer(layer.side)
			gl.deleteBuffer(layer.idx)
			gl.deleteVertexArray(layer.vao)
		}
		this.deleteParticleGpu(this.mistGpu)
		this.deleteParticleGpu(this.sparkGpu)
		gl.deleteProgram(this.shadowProgram)
		gl.deleteProgram(this.glowProgram)
		gl.deleteProgram(this.pointProgram)
		this.canvas.remove()
	}

	private createRibbonLayer(config: {
		kind: RibbonKind
		halfWidth: number
		opacity: number
		coreBoost: number
		haloBoost: number
	}): RibbonLayer {
		const gl = this.gl
		const program = config.kind === 'shadow' ? this.shadowProgram : this.glowProgram
		const vao = gl.createVertexArray()
		const pos = gl.createBuffer()
		const prog = gl.createBuffer()
		const side = gl.createBuffer()
		const idx = gl.createBuffer()
		if (!vao || !pos || !prog || !side || !idx) {
			throw new Error('Failed to create void-aura ribbon geometry')
		}
		gl.bindVertexArray(vao)
		gl.bindBuffer(gl.ARRAY_BUFFER, pos)
		const aPos = gl.getAttribLocation(program, 'aPosition')
		gl.enableVertexAttribArray(aPos)
		gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)
		gl.bindBuffer(gl.ARRAY_BUFFER, prog)
		const aProgress = gl.getAttribLocation(program, 'aProgress')
		gl.enableVertexAttribArray(aProgress)
		gl.vertexAttribPointer(aProgress, 1, gl.FLOAT, false, 0, 0)
		gl.bindBuffer(gl.ARRAY_BUFFER, side)
		const aSide = gl.getAttribLocation(program, 'aSide')
		gl.enableVertexAttribArray(aSide)
		gl.vertexAttribPointer(aSide, 1, gl.FLOAT, false, 0, 0)
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idx)
		gl.bindVertexArray(null)
		return { ...config, vao, pos, prog, side, idx, indexCount: 0 }
	}

	private createParticleGpu(): ParticleGpu {
		const gl = this.gl
		const vao = gl.createVertexArray()
		const pos = gl.createBuffer()
		const size = gl.createBuffer()
		const alpha = gl.createBuffer()
		const color = gl.createBuffer()
		if (!vao || !pos || !size || !alpha || !color) {
			throw new Error('Failed to create void-aura particle geometry')
		}
		gl.bindVertexArray(vao)
		gl.bindBuffer(gl.ARRAY_BUFFER, pos)
		const aPos = gl.getAttribLocation(this.pointProgram, 'aPosition')
		gl.enableVertexAttribArray(aPos)
		gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)
		gl.bindBuffer(gl.ARRAY_BUFFER, size)
		const aSize = gl.getAttribLocation(this.pointProgram, 'aSize')
		gl.enableVertexAttribArray(aSize)
		gl.vertexAttribPointer(aSize, 1, gl.FLOAT, false, 0, 0)
		gl.bindBuffer(gl.ARRAY_BUFFER, alpha)
		const aAlpha = gl.getAttribLocation(this.pointProgram, 'aAlpha')
		gl.enableVertexAttribArray(aAlpha)
		gl.vertexAttribPointer(aAlpha, 1, gl.FLOAT, false, 0, 0)
		gl.bindBuffer(gl.ARRAY_BUFFER, color)
		const aColor = gl.getAttribLocation(this.pointProgram, 'aColor')
		gl.enableVertexAttribArray(aColor)
		gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, 0)
		gl.bindVertexArray(null)
		return { vao, pos, size, alpha, color }
	}

	private deleteParticleGpu(gpu: ParticleGpu): void {
		const gl = this.gl
		gl.deleteBuffer(gpu.pos)
		gl.deleteBuffer(gpu.size)
		gl.deleteBuffer(gpu.alpha)
		gl.deleteBuffer(gpu.color)
		gl.deleteVertexArray(gpu.vao)
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
		this.rebuild()
	}

	private seedParticles(): void {
		this.mistData = []
		for (let i = 0; i < this.options.mistCount; i++) {
			this.mistData.push({
				t: Math.random(),
				speed: randFloat(0.003, 0.02),
				offset: randFloat(-18, 56),
				swirl: randFloat(8, 26),
				size: randFloat(24, 92),
				alpha: randFloat(0.018, 0.11),
				phase: Math.random() * Math.PI * 2,
				phase2: Math.random() * Math.PI * 2,
				phase3: Math.random() * Math.PI * 2,
			})
		}
		this.sparkData = []
		for (let i = 0; i < this.options.sparkCount; i++) {
			this.sparkData.push({
				t: Math.random(),
				speed: randFloat(0.018, 0.085),
				offset: randFloat(2, 18),
				size: randFloat(2, 6),
				alpha: randFloat(0.26, 0.95),
				phase: Math.random() * Math.PI * 2,
				phase2: Math.random() * Math.PI * 2,
			})
		}
	}

	private rebuild(): void {
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
		this.center = this.pathCenter(path)
		this.uploadRibbons()
	}

	private pathCenter(path: Vec2[]): Vec2 {
		if (path.length === 0) return { x: 0, y: 0 }
		let x = 0
		let y = 0
		for (const p of path) {
			x += p.x
			y += p.y
		}
		return { x: x / path.length, y: y / path.length }
	}

	private sample(t: number): PathSample {
		const info = getPointOnPath(this.pathData, t)
		const awayX = info.point.x - this.center.x
		const awayY = info.point.y - this.center.y
		if (info.normal.x * awayX + info.normal.y * awayY < 0) {
			return {
				point: info.point,
				tangent: info.tangent,
				normal: { x: -info.normal.x, y: -info.normal.y },
			}
		}
		return info
	}

	private uploadRibbons(): void {
		if (this.pathData.total <= 0) return
		const gl = this.gl
		const samples = this.options.pathSamples
		const vertexCount = (samples + 1) * 2
		const indices = new Uint16Array(samples * 6)
		for (let i = 0; i < samples; i++) {
			const a = i * 2
			const b = a + 1
			const c = a + 2
			const d = a + 3
			const offset = i * 6
			indices[offset] = a
			indices[offset + 1] = b
			indices[offset + 2] = c
			indices[offset + 3] = b
			indices[offset + 4] = d
			indices[offset + 5] = c
		}

		for (const layer of this.layers) {
			const positions = new Float32Array(vertexCount * 2)
			const progresses = new Float32Array(vertexCount)
			const sides = new Float32Array(vertexCount)
			for (let i = 0; i <= samples; i++) {
				const t = i / samples
				const info = this.sample(t)
				const innerX = info.point.x - info.normal.x * layer.halfWidth
				const innerY = info.point.y - info.normal.y * layer.halfWidth
				const outerX = info.point.x + info.normal.x * layer.halfWidth
				const outerY = info.point.y + info.normal.y * layer.halfWidth
				const vi = i * 2
				positions[vi * 2] = innerX
				positions[vi * 2 + 1] = innerY
				positions[(vi + 1) * 2] = outerX
				positions[(vi + 1) * 2 + 1] = outerY
				progresses[vi] = t
				progresses[vi + 1] = t
				sides[vi] = -1
				sides[vi + 1] = 1
			}
			gl.bindBuffer(gl.ARRAY_BUFFER, layer.pos)
			gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW)
			gl.bindBuffer(gl.ARRAY_BUFFER, layer.prog)
			gl.bufferData(gl.ARRAY_BUFFER, progresses, gl.DYNAMIC_DRAW)
			gl.bindBuffer(gl.ARRAY_BUFFER, layer.side)
			gl.bufferData(gl.ARRAY_BUFFER, sides, gl.DYNAMIC_DRAW)
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, layer.idx)
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)
			layer.indexCount = indices.length
		}
		gl.bindBuffer(gl.ARRAY_BUFFER, null)
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
	}

	private render(time: number, delta: number): void {
		if (this.disposed || !this.target) return
		const gl = this.gl
		const view = this.viewBox()
		const t = time * this.options.speed

		gl.clearColor(0, 0, 0, 0)
		gl.clear(gl.COLOR_BUFFER_BIT)
		gl.enable(gl.BLEND)
		gl.disable(gl.DEPTH_TEST)
		gl.disable(gl.CULL_FACE)

		const shadow = this.layers[0]
		const horizon = this.layers[1]
		const highlight = this.layers[2]

		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
		this.drawRibbon(shadow, view, t, this.shadowProgram)

		gl.blendFunc(gl.SRC_ALPHA, gl.ONE)
		this.updateMist(t, delta, view)
		this.drawRibbon(horizon, view, t, this.glowProgram)
		this.drawRibbon(highlight, view, t, this.glowProgram)
		this.updateSparks(t, delta, view)
	}

	private drawRibbon(layer: RibbonLayer, view: ViewBox, t: number, program: WebGLProgram): void {
		if (layer.indexCount === 0) return
		const gl = this.gl
		gl.useProgram(program)
		if (layer.kind === 'shadow') {
			gl.uniform2f(this.uShadowRes, view.width, view.height)
			gl.uniform1f(this.uShadowTime, t)
			gl.uniform1f(this.uShadowOpacity, layer.opacity)
		} else {
			gl.uniform2f(this.uGlowRes, view.width, view.height)
			gl.uniform1f(this.uGlowTime, t)
			gl.uniform1f(this.uGlowOpacity, layer.opacity)
			gl.uniform1f(this.uGlowCore, layer.coreBoost)
			gl.uniform1f(this.uGlowHalo, layer.haloBoost)
		}
		gl.bindVertexArray(layer.vao)
		gl.drawElements(gl.TRIANGLES, layer.indexCount, gl.UNSIGNED_SHORT, 0)
		gl.bindVertexArray(null)
	}

	private updateMist(time: number, delta: number, view: ViewBox): void {
		if (this.mistData.length === 0 || this.pathData.total <= 0) return
		const count = this.mistData.length
		const positions = new Float32Array(count * 2)
		const sizes = new Float32Array(count)
		const alphas = new Float32Array(count)
		const colors = new Float32Array(count * 3)

		for (let i = 0; i < count; i++) {
			const p = this.mistData[i]
			p.t += delta * p.speed * this.options.speed
			const info = this.sample(p.t)
			const wave1 = Math.sin(time * 1.3 + p.phase)
			const wave2 = Math.cos(time * 0.8 + p.phase2)
			const wave3 = Math.sin(time * 2.1 + p.phase3)
			const normalOffset = p.offset + wave1 * p.swirl
			const tangentOffset = wave2 * 15
			const inwardPull = -Math.abs(wave3) * 14
			positions[i * 2] =
				info.point.x + info.normal.x * (normalOffset + inwardPull) + info.tangent.x * tangentOffset
			positions[i * 2 + 1] =
				info.point.y + info.normal.y * (normalOffset + inwardPull) + info.tangent.y * tangentOffset
			sizes[i] = p.size * (0.7 + (wave2 * 0.5 + 0.5) * 0.5)
			alphas[i] = p.alpha * (0.48 + (wave1 * 0.5 + 0.5) * 0.52)
			const c = lerpColor(MIST_C1, MIST_C2, wave3 * 0.5 + 0.5)
			colors[i * 3] = c[0]
			colors[i * 3 + 1] = c[1]
			colors[i * 3 + 2] = c[2]
		}

		this.drawParticles(this.mistGpu, view, count, positions, sizes, alphas, colors)
	}

	private updateSparks(time: number, delta: number, view: ViewBox): void {
		if (this.sparkData.length === 0 || this.pathData.total <= 0) return
		const count = this.sparkData.length
		const positions = new Float32Array(count * 2)
		const sizes = new Float32Array(count)
		const alphas = new Float32Array(count)
		const colors = new Float32Array(count * 3)

		for (let i = 0; i < count; i++) {
			const p = this.sparkData[i]
			p.t += delta * p.speed * this.options.speed
			const info = this.sample(p.t)
			const pulse = Math.sin(time * 4.2 + p.phase)
			const flutter = Math.cos(time * 2.6 + p.phase2)
			const radial = p.offset + pulse * 4
			const tangentShift = flutter * 8
			positions[i * 2] = info.point.x + info.normal.x * radial + info.tangent.x * tangentShift
			positions[i * 2 + 1] = info.point.y + info.normal.y * radial + info.tangent.y * tangentShift
			sizes[i] = p.size * (0.65 + Math.abs(pulse) * 1)
			alphas[i] = p.alpha * (0.4 + Math.abs(pulse) * 0.6)
			const c = lerpColor(SPARK_C1, SPARK_C2, Math.abs(pulse))
			colors[i * 3] = c[0]
			colors[i * 3 + 1] = c[1]
			colors[i * 3 + 2] = c[2]
		}

		this.drawParticles(this.sparkGpu, view, count, positions, sizes, alphas, colors)
	}

	private drawParticles(
		gpu: ParticleGpu,
		view: ViewBox,
		count: number,
		positions: Float32Array,
		sizes: Float32Array,
		alphas: Float32Array,
		colors: Float32Array
	): void {
		const gl = this.gl
		gl.useProgram(this.pointProgram)
		gl.uniform2f(this.uPointRes, view.width, view.height)
		gl.uniform1f(this.uPointDpr, this.pixelRatio)
		gl.bindVertexArray(gpu.vao)
		gl.bindBuffer(gl.ARRAY_BUFFER, gpu.pos)
		gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW)
		gl.bindBuffer(gl.ARRAY_BUFFER, gpu.size)
		gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.DYNAMIC_DRAW)
		gl.bindBuffer(gl.ARRAY_BUFFER, gpu.alpha)
		gl.bufferData(gl.ARRAY_BUFFER, alphas, gl.DYNAMIC_DRAW)
		gl.bindBuffer(gl.ARRAY_BUFFER, gpu.color)
		gl.bufferData(gl.ARRAY_BUFFER, colors, gl.DYNAMIC_DRAW)
		gl.drawArrays(gl.POINTS, 0, count)
		gl.bindVertexArray(null)
	}
}
