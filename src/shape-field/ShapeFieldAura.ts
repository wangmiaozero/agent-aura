/**
 * Agent Aura - unified shape-aware field aura (water / immortal / demonic)
 *
 * Ported from threejs-shape-aura.html into zero-dependency WebGL2.
 *
 * @author wangmiao<tuziling84@gmail.com>
 * @license MIT
 * @repository https://github.com/wangmiaozero/agent-aura
 */
import { greet } from '../brand'
import {
	type AttachOptions,
	type TargetRef,
	ensurePositioned,
	resolveOptional,
	resolveTarget,
} from '../dom'
import { createProgram } from '../gl/program'
import {
	type PathData,
	buildPathData,
	createTargetPath,
	getPointOnPath,
	randFloat,
} from '../thunder/path'
import lineFrag from './shaders/line.frag.glsl'
import lineVert from './shaders/line.vert.glsl'
import pointFrag from './shaders/point.frag.glsl'
import pointVert from './shaders/point.vert.glsl'
import {
	type ShapeFieldMode,
	SHAPE_FIELD_THEMES,
	lerpRgb,
} from './themes'

export type { ShapeFieldMode }

export type ShapeFieldAuraOptions = {
	target?: HTMLElement
	container?: HTMLElement
	mode?: ShapeFieldMode
	offset?: number
	cornerSegments?: number
	pathSamples?: number
	fieldCount?: number
	detailCount?: number
	speed?: number
	zIndex?: number
	classNames?: string
	styles?: Partial<CSSStyleDeclaration>
	skipGreeting?: boolean
}

type ViewBox = { width: number; height: number; left: number; top: number }

type FieldParticle = {
	t: number
	speed: number
	offset: number
	size: number
	alpha: number
	phase: number
	phase2: number
	phase3: number
}

type DetailParticle = {
	t: number
	speed: number
	offset: number
	size: number
	alpha: number
	phase: number
	phase2: number
}

type LineLayer = {
	offset: number
	baseOpacity: number
	vao: WebGLVertexArrayObject
	pos: WebGLBuffer
	prog: WebGLBuffer
	count: number
}

const LINE_LAYERS = [
	{ offset: 0, opacity: 1 },
	{ offset: 7, opacity: 0.22 },
	{ offset: -4, opacity: 0.13 },
]

export class ShapeFieldAura {
	readonly element: HTMLCanvasElement
	readonly mode: ShapeFieldMode

	private canvas: HTMLCanvasElement
	private gl: WebGL2RenderingContext
	private lineProgram: WebGLProgram
	private pointProgram: WebGLProgram
	private fieldVao: WebGLVertexArrayObject
	private fieldPos: WebGLBuffer
	private fieldSize: WebGLBuffer
	private fieldAlpha: WebGLBuffer
	private fieldColor: WebGLBuffer
	private detailVao: WebGLVertexArrayObject
	private detailPos: WebGLBuffer
	private detailSize: WebGLBuffer
	private detailAlpha: WebGLBuffer
	private detailColor: WebGLBuffer
	private uLineRes: WebGLUniformLocation | null
	private uLineTime: WebGLUniformLocation | null
	private uLineOpacity: WebGLUniformLocation | null
	private uLineMode: WebGLUniformLocation | null
	private uLineColor1: WebGLUniformLocation | null
	private uLineColor2: WebGLUniformLocation | null
	private uLineColor3: WebGLUniformLocation | null
	private uLineColor4: WebGLUniformLocation | null
	private uPointRes: WebGLUniformLocation | null
	private uPointDpr: WebGLUniformLocation | null
	private layers: LineLayer[] = []
	private fieldData: FieldParticle[] = []
	private detailData: DetailParticle[] = []
	private pathData: PathData = { path: [], lengths: [], total: 0 }
	private options: {
		offset: number
		cornerSegments: number
		pathSamples: number
		fieldCount: number
		detailCount: number
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

	static attach(
		target: TargetRef,
		options: AttachOptions<ShapeFieldAuraOptions> = {}
	): ShapeFieldAura {
		const el = resolveTarget(target)
		const { container: containerRef, ...rest } = options
		const container = resolveOptional(containerRef)
		if (container) ensurePositioned(container)
		const aura = new ShapeFieldAura({ ...rest, target: el, container })
		;(container ?? document.body).appendChild(aura.element)
		aura.start()
		return aura
	}

	constructor(options: ShapeFieldAuraOptions = {}) {
		this.mode = options.mode ?? 'water'
		this.options = {
			offset: Math.max(0, options.offset ?? 7),
			cornerSegments: Math.max(4, Math.round(options.cornerSegments ?? 20)),
			pathSamples: Math.max(32, Math.round(options.pathSamples ?? 420)),
			fieldCount: Math.max(0, Math.round(options.fieldCount ?? 180)),
			detailCount: Math.max(0, Math.round(options.detailCount ?? 110)),
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

		this.lineProgram = createProgram(gl, lineVert, lineFrag)
		this.pointProgram = createProgram(gl, pointVert, pointFrag)

		for (const config of LINE_LAYERS) {
			const vao = gl.createVertexArray()
			const pos = gl.createBuffer()
			const prog = gl.createBuffer()
			if (!vao || !pos || !prog) throw new Error('Failed to create shape-field line geometry')
			gl.bindVertexArray(vao)
			gl.bindBuffer(gl.ARRAY_BUFFER, pos)
			const aPos = gl.getAttribLocation(this.lineProgram, 'aPosition')
			gl.enableVertexAttribArray(aPos)
			gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)
			gl.bindBuffer(gl.ARRAY_BUFFER, prog)
			const aProgress = gl.getAttribLocation(this.lineProgram, 'aProgress')
			gl.enableVertexAttribArray(aProgress)
			gl.vertexAttribPointer(aProgress, 1, gl.FLOAT, false, 0, 0)
			gl.bindVertexArray(null)
			this.layers.push({
				offset: config.offset,
				baseOpacity: config.opacity,
				vao,
				pos,
				prog,
				count: 0,
			})
		}

		const fieldVao = gl.createVertexArray()
		const fieldPos = gl.createBuffer()
		const fieldSize = gl.createBuffer()
		const fieldAlpha = gl.createBuffer()
		const fieldColor = gl.createBuffer()
		const detailVao = gl.createVertexArray()
		const detailPos = gl.createBuffer()
		const detailSize = gl.createBuffer()
		const detailAlpha = gl.createBuffer()
		const detailColor = gl.createBuffer()
		if (
			!fieldVao ||
			!fieldPos ||
			!fieldSize ||
			!fieldAlpha ||
			!fieldColor ||
			!detailVao ||
			!detailPos ||
			!detailSize ||
			!detailAlpha ||
			!detailColor
		) {
			throw new Error('Failed to create shape-field particle geometry')
		}
		this.fieldVao = fieldVao
		this.fieldPos = fieldPos
		this.fieldSize = fieldSize
		this.fieldAlpha = fieldAlpha
		this.fieldColor = fieldColor
		this.detailVao = detailVao
		this.detailPos = detailPos
		this.detailSize = detailSize
		this.detailAlpha = detailAlpha
		this.detailColor = detailColor

		this.bindPointVao(this.fieldVao, this.fieldPos, this.fieldSize, this.fieldAlpha, this.fieldColor)
		this.bindPointVao(
			this.detailVao,
			this.detailPos,
			this.detailSize,
			this.detailAlpha,
			this.detailColor
		)

		this.uLineRes = gl.getUniformLocation(this.lineProgram, 'uResolution')
		this.uLineTime = gl.getUniformLocation(this.lineProgram, 'uTime')
		this.uLineOpacity = gl.getUniformLocation(this.lineProgram, 'uOpacity')
		this.uLineMode = gl.getUniformLocation(this.lineProgram, 'uMode')
		this.uLineColor1 = gl.getUniformLocation(this.lineProgram, 'uColor1')
		this.uLineColor2 = gl.getUniformLocation(this.lineProgram, 'uColor2')
		this.uLineColor3 = gl.getUniformLocation(this.lineProgram, 'uColor3')
		this.uLineColor4 = gl.getUniformLocation(this.lineProgram, 'uColor4')
		this.uPointRes = gl.getUniformLocation(this.pointProgram, 'uResolution')
		this.uPointDpr = gl.getUniformLocation(this.pointProgram, 'uPixelRatio')

		this.seedField()
		this.seedDetail()
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
		if (this.disposed) throw new Error('ShapeFieldAura instance has been disposed.')
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
		if (this.disposed) throw new Error('ShapeFieldAura instance has been disposed.')
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
			gl.deleteVertexArray(layer.vao)
		}
		gl.deleteBuffer(this.fieldPos)
		gl.deleteBuffer(this.fieldSize)
		gl.deleteBuffer(this.fieldAlpha)
		gl.deleteBuffer(this.fieldColor)
		gl.deleteBuffer(this.detailPos)
		gl.deleteBuffer(this.detailSize)
		gl.deleteBuffer(this.detailAlpha)
		gl.deleteBuffer(this.detailColor)
		gl.deleteVertexArray(this.fieldVao)
		gl.deleteVertexArray(this.detailVao)
		gl.deleteProgram(this.lineProgram)
		gl.deleteProgram(this.pointProgram)
		this.canvas.remove()
	}

	private theme() {
		return SHAPE_FIELD_THEMES[this.mode]
	}

	private bindPointVao(
		vao: WebGLVertexArrayObject,
		pos: WebGLBuffer,
		size: WebGLBuffer,
		alpha: WebGLBuffer,
		color: WebGLBuffer
	): void {
		const gl = this.gl
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

	private seedField(): void {
		const theme = this.theme()
		this.fieldData = []
		for (let i = 0; i < this.options.fieldCount; i++) {
			this.fieldData.push({
				t: Math.random(),
				speed: randFloat(theme.pathSpeed[0], theme.pathSpeed[1]),
				offset: randFloat(theme.fieldOffset[0], theme.fieldOffset[1]),
				size: randFloat(theme.fieldSize[0], theme.fieldSize[1]),
				alpha: randFloat(theme.fieldAlpha[0], theme.fieldAlpha[1]),
				phase: Math.random() * Math.PI * 2,
				phase2: Math.random() * Math.PI * 2,
				phase3: Math.random() * Math.PI * 2,
			})
		}
	}

	private seedDetail(): void {
		const theme = this.theme()
		this.detailData = []
		for (let i = 0; i < this.options.detailCount; i++) {
			this.detailData.push({
				t: Math.random(),
				speed: randFloat(theme.detailSpeed[0], theme.detailSpeed[1]),
				offset: randFloat(1, 17),
				size: randFloat(theme.detailSize[0], theme.detailSize[1]),
				alpha: randFloat(theme.detailAlpha[0], theme.detailAlpha[1]),
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
		this.uploadLines()
	}

	private uploadLines(): void {
		if (this.pathData.total <= 0) return
		const gl = this.gl
		const samples = this.options.pathSamples
		for (const layer of this.layers) {
			const positions = new Float32Array(samples * 2)
			const progresses = new Float32Array(samples)
			for (let i = 0; i < samples; i++) {
				const t = i / samples
				const info = getPointOnPath(this.pathData, t)
				positions[i * 2] = info.point.x + info.normal.x * layer.offset
				positions[i * 2 + 1] = info.point.y + info.normal.y * layer.offset
				progresses[i] = t
			}
			gl.bindBuffer(gl.ARRAY_BUFFER, layer.pos)
			gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW)
			gl.bindBuffer(gl.ARRAY_BUFFER, layer.prog)
			gl.bufferData(gl.ARRAY_BUFFER, progresses, gl.DYNAMIC_DRAW)
			layer.count = samples
		}
	}

	private render(time: number, delta: number): void {
		if (this.disposed || !this.target) return
		const gl = this.gl
		const view = this.viewBox()
		const theme = this.theme()
		const t = time * this.options.speed

		gl.clearColor(0, 0, 0, 0)
		gl.clear(gl.COLOR_BUFFER_BIT)
		gl.enable(gl.BLEND)
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE)
		gl.disable(gl.DEPTH_TEST)

		if (this.pathData.total > 0) {
			gl.useProgram(this.lineProgram)
			gl.uniform2f(this.uLineRes, view.width, view.height)
			gl.uniform1f(this.uLineTime, t)
			gl.uniform1f(this.uLineMode, theme.modeId)
			gl.uniform3f(this.uLineColor1, theme.lineColors[0][0], theme.lineColors[0][1], theme.lineColors[0][2])
			gl.uniform3f(this.uLineColor2, theme.lineColors[1][0], theme.lineColors[1][1], theme.lineColors[1][2])
			gl.uniform3f(this.uLineColor3, theme.lineColors[2][0], theme.lineColors[2][1], theme.lineColors[2][2])
			gl.uniform3f(this.uLineColor4, theme.lineColors[3][0], theme.lineColors[3][1], theme.lineColors[3][2])
			const breath = 0.85 + Math.sin(t * 1.3) * 0.1
			for (const layer of this.layers) {
				if (layer.count < 2) continue
				gl.uniform1f(this.uLineOpacity, layer.baseOpacity * breath)
				gl.bindVertexArray(layer.vao)
				gl.drawArrays(gl.LINE_LOOP, 0, layer.count)
			}
			gl.bindVertexArray(null)
		}

		this.updateField(t, delta)
		this.updateDetail(t, delta)
	}

	private updateField(time: number, delta: number): void {
		if (this.fieldData.length === 0 || this.pathData.total <= 0) return
		const theme = this.theme()
		const count = this.fieldData.length
		const positions = new Float32Array(count * 2)
		const sizes = new Float32Array(count)
		const alphas = new Float32Array(count)
		const colors = new Float32Array(count * 3)

		for (let i = 0; i < count; i++) {
			const p = this.fieldData[i]
			p.t += delta * p.speed * this.options.speed
			const info = getPointOnPath(this.pathData, p.t)

			const wave1 = Math.sin(time * theme.waveSpeed + p.phase)
			const wave2 = Math.sin(time * (theme.waveSpeed * 0.57) + p.phase2)
			const wave3 = Math.cos(time * (theme.waveSpeed * 1.37) + p.phase3)

			const normalOffset = p.offset + wave1 * theme.fieldDrift + wave3 * theme.turbulence
			const tangentOffset = wave2 * theme.turbulence

			let x = info.point.x + info.normal.x * normalOffset + info.tangent.x * tangentOffset
			let y = info.point.y + info.normal.y * normalOffset + info.tangent.y * tangentOffset

			// CSS y grows downward; Three demo y grows upward — flip vertical deltas
			if (this.mode === 'water') {
				y -= Math.sin(p.t * 40 - time * 3) * 4
			} else if (this.mode === 'immortal') {
				y -= (wave2 * 0.5 + 0.5) * theme.rise
			} else {
				x += Math.sin(time * 2.8 + p.phase) * 8
				y -= Math.cos(time * 2.2 + p.phase3) * 12
			}

			positions[i * 2] = x
			positions[i * 2 + 1] = y
			sizes[i] = p.size * (0.72 + (wave2 * 0.5 + 0.5) * 0.46)
			alphas[i] = p.alpha * (0.55 + (wave1 * 0.5 + 0.5) * 0.45)

			const mix = wave3 * 0.5 + 0.5
			const color = lerpRgb(theme.fieldA, theme.fieldB, mix)
			colors[i * 3] = color[0]
			colors[i * 3 + 1] = color[1]
			colors[i * 3 + 2] = color[2]
		}

		this.drawPoints(
			this.fieldVao,
			this.fieldPos,
			this.fieldSize,
			this.fieldAlpha,
			this.fieldColor,
			positions,
			sizes,
			alphas,
			colors,
			count
		)
	}

	private updateDetail(time: number, delta: number): void {
		if (this.detailData.length === 0 || this.pathData.total <= 0) return
		const theme = this.theme()
		const count = this.detailData.length
		const positions = new Float32Array(count * 2)
		const sizes = new Float32Array(count)
		const alphas = new Float32Array(count)
		const colors = new Float32Array(count * 3)

		for (let i = 0; i < count; i++) {
			const p = this.detailData[i]
			p.t += delta * p.speed * this.options.speed
			const info = getPointOnPath(this.pathData, p.t)
			const pulse = Math.sin(time * 4 + p.phase)
			const floatWave = Math.sin(time * 1.8 + p.phase2)
			const offset = p.offset + pulse * 4

			let x = info.point.x + info.normal.x * offset
			let y = info.point.y + info.normal.y * offset

			if (this.mode === 'water') {
				y -= floatWave * 7
				x += Math.sin(time * 3 + p.phase2) * 3
			} else if (this.mode === 'immortal') {
				y -= (floatWave * 0.5 + 0.5) * theme.rise
			} else {
				y -= (floatWave * 0.5 + 0.5) * theme.rise
				x += Math.sin(time * 5 + p.phase) * 8
			}

			positions[i * 2] = x
			positions[i * 2 + 1] = y
			sizes[i] = p.size * (0.65 + Math.abs(pulse) * 0.9)
			alphas[i] = p.alpha * (0.4 + Math.abs(pulse) * 0.6)

			const color = lerpRgb(theme.detailA, theme.detailB, Math.abs(pulse))
			colors[i * 3] = color[0]
			colors[i * 3 + 1] = color[1]
			colors[i * 3 + 2] = color[2]
		}

		this.drawPoints(
			this.detailVao,
			this.detailPos,
			this.detailSize,
			this.detailAlpha,
			this.detailColor,
			positions,
			sizes,
			alphas,
			colors,
			count
		)
	}

	private drawPoints(
		vao: WebGLVertexArrayObject,
		pos: WebGLBuffer,
		size: WebGLBuffer,
		alpha: WebGLBuffer,
		color: WebGLBuffer,
		positions: Float32Array,
		sizes: Float32Array,
		alphas: Float32Array,
		colors: Float32Array,
		count: number
	): void {
		const gl = this.gl
		const view = this.viewBox()
		gl.useProgram(this.pointProgram)
		gl.uniform2f(this.uPointRes, view.width, view.height)
		gl.uniform1f(this.uPointDpr, this.pixelRatio)
		gl.bindVertexArray(vao)
		gl.bindBuffer(gl.ARRAY_BUFFER, pos)
		gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW)
		gl.bindBuffer(gl.ARRAY_BUFFER, size)
		gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.DYNAMIC_DRAW)
		gl.bindBuffer(gl.ARRAY_BUFFER, alpha)
		gl.bufferData(gl.ARRAY_BUFFER, alphas, gl.DYNAMIC_DRAW)
		gl.bindBuffer(gl.ARRAY_BUFFER, color)
		gl.bufferData(gl.ARRAY_BUFFER, colors, gl.DYNAMIC_DRAW)
		gl.drawArrays(gl.POINTS, 0, count)
		gl.bindVertexArray(null)
	}
}
