/**
 * Agent Aura - shape-aware AI ribbon aura
 *
 * Ported from the Three.js shape-aware-ai-aura demo into zero-dependency WebGL2.
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
import dustFrag from './shape/shaders/dust.frag.glsl'
import dustVert from './shape/shaders/dust.vert.glsl'
import ribbonFrag from './shape/shaders/ribbon.frag.glsl'
import ribbonVert from './shape/shaders/ribbon.vert.glsl'
import {
	type PathData,
	type PathSample,
	type Vec2,
	buildPathData,
	createTargetPath,
	getPointOnPath,
	randFloat,
} from './thunder/path'

export type ShapeAuraOptions = {
	target?: HTMLElement
	container?: HTMLElement
	offset?: number
	auraWidth?: number
	outerGlowWidth?: number
	pathSamples?: number
	cornerSegments?: number
	dustCount?: number
	speed?: number
	zIndex?: number
	classNames?: string
	styles?: Partial<CSSStyleDeclaration>
	skipGreeting?: boolean
}

type ViewBox = { width: number; height: number; left: number; top: number }

type DustParticle = {
	t: number
	speed: number
	offset: number
	size: number
	alpha: number
	phase: number
	phase2: number
}

type RibbonLayer = {
	halfWidth: number
	opacity: number
	coreStrength: number
	haloStrength: number
	vao: WebGLVertexArrayObject
	pos: WebGLBuffer
	prog: WebGLBuffer
	side: WebGLBuffer
	idx: WebGLBuffer
	indexCount: number
}

export class ShapeAura {
	readonly element: HTMLCanvasElement

	private canvas: HTMLCanvasElement
	private gl: WebGL2RenderingContext
	private ribbonProgram: WebGLProgram
	private dustProgram: WebGLProgram
	private layers: RibbonLayer[] = []
	private dustVao: WebGLVertexArrayObject
	private dustPos: WebGLBuffer
	private dustSize: WebGLBuffer
	private dustAlpha: WebGLBuffer
	private uRibbonRes: WebGLUniformLocation | null
	private uRibbonTime: WebGLUniformLocation | null
	private uRibbonOpacity: WebGLUniformLocation | null
	private uRibbonCore: WebGLUniformLocation | null
	private uRibbonHalo: WebGLUniformLocation | null
	private uDustRes: WebGLUniformLocation | null
	private uDustDpr: WebGLUniformLocation | null
	private dustData: DustParticle[] = []
	private pathData: PathData = { path: [], lengths: [], total: 0 }
	private center: Vec2 = { x: 0, y: 0 }
	private options: {
		offset: number
		auraWidth: number
		outerGlowWidth: number
		pathSamples: number
		cornerSegments: number
		dustCount: number
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

	static attach(target: TargetRef, options: AttachOptions<ShapeAuraOptions> = {}): ShapeAura {
		const el = resolveTarget(target)
		const { container: containerRef, ...rest } = options
		const container = resolveOptional(containerRef)
		if (container) ensurePositioned(container)
		const aura = new ShapeAura({ ...rest, target: el, container })
		;(container ?? document.body).appendChild(aura.element)
		aura.start()
		return aura
	}

	constructor(options: ShapeAuraOptions = {}) {
		this.options = {
			offset: Math.max(0, options.offset ?? 5),
			auraWidth: Math.max(1, options.auraWidth ?? 33),
			outerGlowWidth: Math.max(1, options.outerGlowWidth ?? 86),
			pathSamples: Math.max(32, Math.round(options.pathSamples ?? 500)),
			cornerSegments: Math.max(4, Math.round(options.cornerSegments ?? 24)),
			dustCount: Math.max(0, Math.round(options.dustCount ?? 75)),
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

		this.ribbonProgram = createProgram(gl, ribbonVert, ribbonFrag)
		this.dustProgram = createProgram(gl, dustVert, dustFrag)

		const layerConfigs = [
			{
				halfWidth: this.options.outerGlowWidth,
				opacity: 0.22,
				coreStrength: 0,
				haloStrength: 1,
			},
			{
				halfWidth: this.options.auraWidth,
				opacity: 1,
				coreStrength: 1,
				haloStrength: 0.85,
			},
		]
		for (const config of layerConfigs) {
			this.layers.push(this.createRibbonLayer(config))
		}

		const dustVao = gl.createVertexArray()
		const dustPos = gl.createBuffer()
		const dustSize = gl.createBuffer()
		const dustAlpha = gl.createBuffer()
		if (!dustVao || !dustPos || !dustSize || !dustAlpha) {
			throw new Error('Failed to create shape-aura dust geometry')
		}
		this.dustVao = dustVao
		this.dustPos = dustPos
		this.dustSize = dustSize
		this.dustAlpha = dustAlpha
		gl.bindVertexArray(dustVao)
		gl.bindBuffer(gl.ARRAY_BUFFER, dustPos)
		const aPos = gl.getAttribLocation(this.dustProgram, 'aPosition')
		gl.enableVertexAttribArray(aPos)
		gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)
		gl.bindBuffer(gl.ARRAY_BUFFER, dustSize)
		const aSize = gl.getAttribLocation(this.dustProgram, 'aSize')
		gl.enableVertexAttribArray(aSize)
		gl.vertexAttribPointer(aSize, 1, gl.FLOAT, false, 0, 0)
		gl.bindBuffer(gl.ARRAY_BUFFER, dustAlpha)
		const aAlpha = gl.getAttribLocation(this.dustProgram, 'aAlpha')
		gl.enableVertexAttribArray(aAlpha)
		gl.vertexAttribPointer(aAlpha, 1, gl.FLOAT, false, 0, 0)
		gl.bindVertexArray(null)

		this.uRibbonRes = gl.getUniformLocation(this.ribbonProgram, 'uResolution')
		this.uRibbonTime = gl.getUniformLocation(this.ribbonProgram, 'uTime')
		this.uRibbonOpacity = gl.getUniformLocation(this.ribbonProgram, 'uOpacity')
		this.uRibbonCore = gl.getUniformLocation(this.ribbonProgram, 'uCoreStrength')
		this.uRibbonHalo = gl.getUniformLocation(this.ribbonProgram, 'uHaloStrength')
		this.uDustRes = gl.getUniformLocation(this.dustProgram, 'uResolution')
		this.uDustDpr = gl.getUniformLocation(this.dustProgram, 'uPixelRatio')

		this.seedDust()
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
		if (this.disposed) throw new Error('ShapeAura instance has been disposed.')
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
		if (this.disposed) throw new Error('ShapeAura instance has been disposed.')
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
		gl.deleteBuffer(this.dustPos)
		gl.deleteBuffer(this.dustSize)
		gl.deleteBuffer(this.dustAlpha)
		gl.deleteVertexArray(this.dustVao)
		gl.deleteProgram(this.ribbonProgram)
		gl.deleteProgram(this.dustProgram)
		this.canvas.remove()
	}

	private createRibbonLayer(config: {
		halfWidth: number
		opacity: number
		coreStrength: number
		haloStrength: number
	}): RibbonLayer {
		const gl = this.gl
		const vao = gl.createVertexArray()
		const pos = gl.createBuffer()
		const prog = gl.createBuffer()
		const side = gl.createBuffer()
		const idx = gl.createBuffer()
		if (!vao || !pos || !prog || !side || !idx) {
			throw new Error('Failed to create shape-aura ribbon geometry')
		}
		gl.bindVertexArray(vao)
		gl.bindBuffer(gl.ARRAY_BUFFER, pos)
		const aPos = gl.getAttribLocation(this.ribbonProgram, 'aPosition')
		gl.enableVertexAttribArray(aPos)
		gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)
		gl.bindBuffer(gl.ARRAY_BUFFER, prog)
		const aProgress = gl.getAttribLocation(this.ribbonProgram, 'aProgress')
		gl.enableVertexAttribArray(aProgress)
		gl.vertexAttribPointer(aProgress, 1, gl.FLOAT, false, 0, 0)
		gl.bindBuffer(gl.ARRAY_BUFFER, side)
		const aSide = gl.getAttribLocation(this.ribbonProgram, 'aSide')
		gl.enableVertexAttribArray(aSide)
		gl.vertexAttribPointer(aSide, 1, gl.FLOAT, false, 0, 0)
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idx)
		gl.bindVertexArray(null)
		return { ...config, vao, pos, prog, side, idx, indexCount: 0 }
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

	private seedDust(): void {
		this.dustData = []
		for (let i = 0; i < this.options.dustCount; i++) {
			this.dustData.push({
				t: Math.random(),
				speed: randFloat(0.005, 0.023),
				offset: randFloat(10, 58),
				size: randFloat(5, 17),
				alpha: randFloat(0.025, 0.14),
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
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE)
		gl.disable(gl.DEPTH_TEST)
		gl.disable(gl.CULL_FACE)

		if (this.pathData.total > 0) {
			gl.useProgram(this.ribbonProgram)
			gl.uniform2f(this.uRibbonRes, view.width, view.height)
			gl.uniform1f(this.uRibbonTime, t)
			for (const layer of this.layers) {
				if (layer.indexCount === 0) continue
				gl.uniform1f(this.uRibbonOpacity, layer.opacity)
				gl.uniform1f(this.uRibbonCore, layer.coreStrength)
				gl.uniform1f(this.uRibbonHalo, layer.haloStrength)
				gl.bindVertexArray(layer.vao)
				gl.drawElements(gl.TRIANGLES, layer.indexCount, gl.UNSIGNED_SHORT, 0)
			}
			gl.bindVertexArray(null)
		}

		this.updateDust(t, delta)
	}

	private updateDust(time: number, delta: number): void {
		if (this.dustData.length === 0 || this.pathData.total <= 0) return
		const count = this.dustData.length
		const positions = new Float32Array(count * 2)
		const sizes = new Float32Array(count)
		const alphas = new Float32Array(count)

		for (let i = 0; i < count; i++) {
			const p = this.dustData[i]
			p.t += delta * p.speed * this.options.speed
			const info = this.sample(p.t)
			const wave = Math.sin(time * 1.5 + p.phase)
			const wave2 = Math.cos(time * 0.8 + p.phase2)
			const radial = p.offset + wave * 12
			const tangentShift = wave2 * 10
			positions[i * 2] = info.point.x + info.normal.x * radial + info.tangent.x * tangentShift
			positions[i * 2 + 1] = info.point.y + info.normal.y * radial + info.tangent.y * tangentShift
			sizes[i] = p.size * (0.75 + (wave2 * 0.5 + 0.5) * 0.45)
			alphas[i] = p.alpha * (0.5 + (wave * 0.5 + 0.5) * 0.5)
		}

		const gl = this.gl
		const view = this.viewBox()
		gl.useProgram(this.dustProgram)
		gl.uniform2f(this.uDustRes, view.width, view.height)
		gl.uniform1f(this.uDustDpr, this.pixelRatio)
		gl.bindVertexArray(this.dustVao)
		gl.bindBuffer(gl.ARRAY_BUFFER, this.dustPos)
		gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW)
		gl.bindBuffer(gl.ARRAY_BUFFER, this.dustSize)
		gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.DYNAMIC_DRAW)
		gl.bindBuffer(gl.ARRAY_BUFFER, this.dustAlpha)
		gl.bufferData(gl.ARRAY_BUFFER, alphas, gl.DYNAMIC_DRAW)
		gl.drawArrays(gl.POINTS, 0, count)
		gl.bindVertexArray(null)
	}
}
