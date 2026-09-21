/**
 * Agent Aura - shape-aware glitch / collapse aura
 *
 * Ported from the Three.js glitch-collapse demo into zero-dependency WebGL2.
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
import glitchFrag from './glitch/shaders/glitch.frag.glsl'
import pointFrag from './glitch/shaders/point.frag.glsl'
import pointVert from './glitch/shaders/point.vert.glsl'
import ribbonVert from './glitch/shaders/ribbon.vert.glsl'

export type GlitchAuraOptions = {
	target?: HTMLElement
	container?: HTMLElement
	offset?: number
	outerWidth?: number
	rgbWidth?: number
	pathSamples?: number
	cornerSegments?: number
	fragmentCount?: number
	burstIntervalMin?: number
	burstIntervalMax?: number
	burstDuration?: number
	speed?: number
	zIndex?: number
	classNames?: string
	styles?: Partial<CSSStyleDeclaration>
	skipGreeting?: boolean
}

type ViewBox = { width: number; height: number; left: number; top: number }

type RibbonLayer = {
	halfWidth: number
	shift: number
	color: [number, number, number]
	intensity: number
	offsetX: number
	offsetY: number
	vao: WebGLVertexArrayObject
	pos: WebGLBuffer
	prog: WebGLBuffer
	side: WebGLBuffer
	idx: WebGLBuffer
	indexCount: number
}

type FragmentParticle = {
	t: number
	speed: number
	offset: number
	size: number
	alpha: number
	phase: number
	phase2: number
	channel: number
}

const CYAN: [number, number, number] = [0, 0.9647, 1]
const MAGENTA: [number, number, number] = [1, 0.0902, 0.3098]
const WHITE: [number, number, number] = [0.9686, 0.9725, 1]
const OUTER: [number, number, number] = [0.3373, 0.1451, 1]
const RGB_CYAN: [number, number, number] = [0, 0.9647, 1]
const RGB_MAGENTA: [number, number, number] = [1, 0.0784, 0.3569]

export class GlitchAura {
	readonly element: HTMLCanvasElement

	private canvas: HTMLCanvasElement
	private gl: WebGL2RenderingContext
	private ribbonProgram: WebGLProgram
	private pointProgram: WebGLProgram
	private layers: RibbonLayer[] = []
	private fragmentVao: WebGLVertexArrayObject
	private fragmentPos: WebGLBuffer
	private fragmentSize: WebGLBuffer
	private fragmentAlpha: WebGLBuffer
	private fragmentColor: WebGLBuffer
	private uRibbonRes: WebGLUniformLocation | null
	private uRibbonOffset: WebGLUniformLocation | null
	private uRibbonTime: WebGLUniformLocation | null
	private uRibbonBurst: WebGLUniformLocation | null
	private uRibbonColor: WebGLUniformLocation | null
	private uRibbonIntensity: WebGLUniformLocation | null
	private uPointRes: WebGLUniformLocation | null
	private uPointDpr: WebGLUniformLocation | null
	private fragmentData: FragmentParticle[] = []
	private pathData: PathData = { path: [], lengths: [], total: 0 }
	private center: Vec2 = { x: 0, y: 0 }
	private burst = 0
	private burstTimer = 0
	private options: {
		offset: number
		outerWidth: number
		rgbWidth: number
		pathSamples: number
		cornerSegments: number
		fragmentCount: number
		burstIntervalMin: number
		burstIntervalMax: number
		burstDuration: number
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

	static attach(target: TargetRef, options: AttachOptions<GlitchAuraOptions> = {}): GlitchAura {
		const el = resolveTarget(target)
		const { container: containerRef, ...rest } = options
		const container = resolveOptional(containerRef)
		if (container) ensurePositioned(container)
		const aura = new GlitchAura({ ...rest, target: el, container })
		;(container ?? document.body).appendChild(aura.element)
		aura.start()
		return aura
	}

	constructor(options: GlitchAuraOptions = {}) {
		this.options = {
			offset: Math.max(0, options.offset ?? 5),
			outerWidth: Math.max(1, options.outerWidth ?? 45),
			rgbWidth: Math.max(1, options.rgbWidth ?? 11),
			pathSamples: Math.max(32, Math.round(options.pathSamples ?? 500)),
			cornerSegments: Math.max(4, Math.round(options.cornerSegments ?? 22)),
			fragmentCount: Math.max(0, Math.round(options.fragmentCount ?? 130)),
			burstIntervalMin: Math.max(80, options.burstIntervalMin ?? 900),
			burstIntervalMax: Math.max(80, options.burstIntervalMax ?? 2600),
			burstDuration: Math.max(40, options.burstDuration ?? 140),
			speed: Math.max(0.1, options.speed ?? 1),
			zIndex: options.zIndex ?? 20,
			skipGreeting: options.skipGreeting,
			classNames: options.classNames,
			styles: options.styles,
		}
		if (this.options.burstIntervalMax < this.options.burstIntervalMin) {
			this.options.burstIntervalMax = this.options.burstIntervalMin
		}
		this.target = options.target
		this.container = options.container
		this.burstTimer = randFloat(this.options.burstIntervalMin, this.options.burstIntervalMax)

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

		this.ribbonProgram = createProgram(gl, ribbonVert, glitchFrag)
		this.pointProgram = createProgram(gl, pointVert, pointFrag)

		this.layers.push(
			this.createRibbonLayer({
				halfWidth: this.options.outerWidth,
				shift: 0,
				color: OUTER,
				intensity: 0.22,
			}),
			this.createRibbonLayer({
				halfWidth: this.options.rgbWidth,
				shift: -4.5,
				color: RGB_CYAN,
				intensity: 0.72,
			}),
			this.createRibbonLayer({
				halfWidth: this.options.rgbWidth,
				shift: 4.5,
				color: RGB_MAGENTA,
				intensity: 0.72,
			}),
			this.createRibbonLayer({
				halfWidth: this.options.rgbWidth,
				shift: 0,
				color: WHITE,
				intensity: 0.86,
			})
		)

		const fragmentVao = gl.createVertexArray()
		const fragmentPos = gl.createBuffer()
		const fragmentSize = gl.createBuffer()
		const fragmentAlpha = gl.createBuffer()
		const fragmentColor = gl.createBuffer()
		if (!fragmentVao || !fragmentPos || !fragmentSize || !fragmentAlpha || !fragmentColor) {
			throw new Error('Failed to create glitch-aura fragment geometry')
		}
		this.fragmentVao = fragmentVao
		this.fragmentPos = fragmentPos
		this.fragmentSize = fragmentSize
		this.fragmentAlpha = fragmentAlpha
		this.fragmentColor = fragmentColor
		gl.bindVertexArray(fragmentVao)
		gl.bindBuffer(gl.ARRAY_BUFFER, fragmentPos)
		const aPos = gl.getAttribLocation(this.pointProgram, 'aPosition')
		gl.enableVertexAttribArray(aPos)
		gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)
		gl.bindBuffer(gl.ARRAY_BUFFER, fragmentSize)
		const aSize = gl.getAttribLocation(this.pointProgram, 'aSize')
		gl.enableVertexAttribArray(aSize)
		gl.vertexAttribPointer(aSize, 1, gl.FLOAT, false, 0, 0)
		gl.bindBuffer(gl.ARRAY_BUFFER, fragmentAlpha)
		const aAlpha = gl.getAttribLocation(this.pointProgram, 'aAlpha')
		gl.enableVertexAttribArray(aAlpha)
		gl.vertexAttribPointer(aAlpha, 1, gl.FLOAT, false, 0, 0)
		gl.bindBuffer(gl.ARRAY_BUFFER, fragmentColor)
		const aColor = gl.getAttribLocation(this.pointProgram, 'aColor')
		gl.enableVertexAttribArray(aColor)
		gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, 0)
		gl.bindVertexArray(null)

		this.uRibbonRes = gl.getUniformLocation(this.ribbonProgram, 'uResolution')
		this.uRibbonOffset = gl.getUniformLocation(this.ribbonProgram, 'uOffset')
		this.uRibbonTime = gl.getUniformLocation(this.ribbonProgram, 'uTime')
		this.uRibbonBurst = gl.getUniformLocation(this.ribbonProgram, 'uBurst')
		this.uRibbonColor = gl.getUniformLocation(this.ribbonProgram, 'uColor')
		this.uRibbonIntensity = gl.getUniformLocation(this.ribbonProgram, 'uIntensity')
		this.uPointRes = gl.getUniformLocation(this.pointProgram, 'uResolution')
		this.uPointDpr = gl.getUniformLocation(this.pointProgram, 'uPixelRatio')

		this.seedFragments()
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
		if (this.disposed) throw new Error('GlitchAura instance has been disposed.')
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
		if (this.disposed) throw new Error('GlitchAura instance has been disposed.')
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
		gl.deleteBuffer(this.fragmentPos)
		gl.deleteBuffer(this.fragmentSize)
		gl.deleteBuffer(this.fragmentAlpha)
		gl.deleteBuffer(this.fragmentColor)
		gl.deleteVertexArray(this.fragmentVao)
		gl.deleteProgram(this.ribbonProgram)
		gl.deleteProgram(this.pointProgram)
		this.canvas.remove()
	}

	private createRibbonLayer(config: {
		halfWidth: number
		shift: number
		color: [number, number, number]
		intensity: number
	}): RibbonLayer {
		const gl = this.gl
		const vao = gl.createVertexArray()
		const pos = gl.createBuffer()
		const prog = gl.createBuffer()
		const side = gl.createBuffer()
		const idx = gl.createBuffer()
		if (!vao || !pos || !prog || !side || !idx) {
			throw new Error('Failed to create glitch-aura ribbon geometry')
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
		return { ...config, offsetX: 0, offsetY: 0, vao, pos, prog, side, idx, indexCount: 0 }
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

	private seedFragments(): void {
		this.fragmentData = []
		for (let i = 0; i < this.options.fragmentCount; i++) {
			this.fragmentData.push({
				t: Math.random(),
				speed: randFloat(0.005, 0.055),
				offset: randFloat(-8, 28),
				size: randFloat(2, 9),
				alpha: randFloat(0.12, 0.8),
				phase: Math.random() * Math.PI * 2,
				phase2: Math.random() * Math.PI * 2,
				channel: Math.floor(Math.random() * 3),
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
				const cx = info.point.x + info.normal.x * layer.shift
				const cy = info.point.y + info.normal.y * layer.shift
				const innerX = cx - info.normal.x * layer.halfWidth
				const innerY = cy - info.normal.y * layer.halfWidth
				const outerX = cx + info.normal.x * layer.halfWidth
				const outerY = cy + info.normal.y * layer.halfWidth
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

	private updateBurst(delta: number): void {
		this.burstTimer -= delta * 1000 * this.options.speed
		if (this.burstTimer <= 0) {
			this.burst = 1
			this.burstTimer = randFloat(this.options.burstIntervalMin, this.options.burstIntervalMax)
		}
		if (this.burst > 0) {
			this.burst = Math.max(0, this.burst - (delta * 1000 * this.options.speed) / this.options.burstDuration)
		}
	}

	private render(time: number, delta: number): void {
		if (this.disposed || !this.target) return
		const gl = this.gl
		const view = this.viewBox()
		const t = time * this.options.speed
		this.updateBurst(delta)

		if (this.layers.length >= 4) {
			const shake = this.burst * 7
			this.layers[1].offsetX = Math.sin(t * 70) * shake
			this.layers[1].offsetY = 0
			this.layers[2].offsetX = Math.cos(t * 63) * shake
			this.layers[2].offsetY = 0
			this.layers[3].offsetX = 0
			this.layers[3].offsetY = Math.sin(t * 91) * this.burst * 3
		}

		gl.clearColor(0, 0, 0, 0)
		gl.clear(gl.COLOR_BUFFER_BIT)
		gl.enable(gl.BLEND)
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE)
		gl.disable(gl.DEPTH_TEST)
		gl.disable(gl.CULL_FACE)

		gl.useProgram(this.ribbonProgram)
		gl.uniform2f(this.uRibbonRes, view.width, view.height)
		gl.uniform1f(this.uRibbonTime, t)
		gl.uniform1f(this.uRibbonBurst, this.burst)
		for (const layer of this.layers) {
			if (layer.indexCount === 0) continue
			gl.uniform2f(this.uRibbonOffset, layer.offsetX, layer.offsetY)
			gl.uniform3f(this.uRibbonColor, layer.color[0], layer.color[1], layer.color[2])
			gl.uniform1f(this.uRibbonIntensity, layer.intensity)
			gl.bindVertexArray(layer.vao)
			gl.drawElements(gl.TRIANGLES, layer.indexCount, gl.UNSIGNED_SHORT, 0)
		}
		gl.bindVertexArray(null)

		this.updateFragments(t, delta, view)
	}

	private updateFragments(time: number, delta: number, view: ViewBox): void {
		if (this.fragmentData.length === 0 || this.pathData.total <= 0) return
		const count = this.fragmentData.length
		const positions = new Float32Array(count * 2)
		const sizes = new Float32Array(count)
		const alphas = new Float32Array(count)
		const colors = new Float32Array(count * 3)

		for (let i = 0; i < count; i++) {
			const p = this.fragmentData[i]
			p.t += delta * p.speed * this.options.speed
			const info = this.sample(p.t)
			const glitch1 = Math.sin(time * 17 + p.phase)
			const glitch2 = Math.cos(time * 7.5 + p.phase2)
			const explosion = this.burst * randFloat(15, 60)
			const normalOffset = p.offset + glitch1 * 8 + explosion
			const tangentOffset = glitch2 * (5 + this.burst * 25)
			const horizontalTear = Math.abs(glitch1) > 0.88 ? glitch2 * 18 : 0
			positions[i * 2] = info.point.x + info.normal.x * normalOffset + info.tangent.x * tangentOffset + horizontalTear
			positions[i * 2 + 1] = info.point.y + info.normal.y * normalOffset + info.tangent.y * tangentOffset
			sizes[i] = p.size * (0.55 + Math.abs(glitch1) * 1.2 + this.burst * 1.4)
			const flicker = Math.random() > 0.16 ? 1 : 0.05
			alphas[i] = p.alpha * flicker * (0.5 + this.burst * 0.8)
			const color = p.channel === 0 ? CYAN : p.channel === 1 ? MAGENTA : WHITE
			colors[i * 3] = color[0]
			colors[i * 3 + 1] = color[1]
			colors[i * 3 + 2] = color[2]
		}

		const gl = this.gl
		gl.useProgram(this.pointProgram)
		gl.uniform2f(this.uPointRes, view.width, view.height)
		gl.uniform1f(this.uPointDpr, this.pixelRatio)
		gl.bindVertexArray(this.fragmentVao)
		gl.bindBuffer(gl.ARRAY_BUFFER, this.fragmentPos)
		gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW)
		gl.bindBuffer(gl.ARRAY_BUFFER, this.fragmentSize)
		gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.DYNAMIC_DRAW)
		gl.bindBuffer(gl.ARRAY_BUFFER, this.fragmentAlpha)
		gl.bufferData(gl.ARRAY_BUFFER, alphas, gl.DYNAMIC_DRAW)
		gl.bindBuffer(gl.ARRAY_BUFFER, this.fragmentColor)
		gl.bufferData(gl.ARRAY_BUFFER, colors, gl.DYNAMIC_DRAW)
		gl.drawArrays(gl.POINTS, 0, count)
		gl.bindVertexArray(null)
	}
}
