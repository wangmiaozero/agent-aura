/**
 * Agent Aura - shared fire engine
 *
 * @author wangmiao<tuziling84@gmail.com>
 * @license MIT
 * @repository https://github.com/wangmiaozero/agent-aura
 */
import { greet } from '../brand'
import { GlowQuad } from './glow'
import { type BorderBounds, emptyBounds, mix, readBorderBounds } from './math'
import { ParticleLayer } from './particles'
import fireFrag from './shaders/fire.frag.glsl'
import glowFrag from './shaders/glow.frag.glsl'
import glowVert from './shaders/glow.vert.glsl'
import particleVert from './shaders/particle.vert.glsl'
import smokeFrag from './shaders/smoke.frag.glsl'
import {
	type FireParticle,
	type FirePreset,
	type SmokeParticle,
	resetFireParticle,
	resetSmokeParticle,
	writeFireColor,
} from './spawn'

export type FireEngineOptions = {
	preset?: FirePreset
	target?: HTMLElement
	container?: HTMLElement
	particleCount?: number
	smokeCount?: number
	glow?: boolean
	padding?: number
	classNames?: string
	styles?: Partial<CSSStyleDeclaration>
	zIndex?: number
	skipGreeting?: boolean
	onFrame?: (time: number) => void
}

type ViewBox = {
	width: number
	height: number
	left: number
	top: number
}

export class FireEngine {
	readonly element: HTMLCanvasElement

	private canvas: HTMLCanvasElement
	private gl: WebGL2RenderingContext
	private options: {
		preset: FirePreset
		particleCount: number
		smokeCount: number
		glow: boolean
		padding: number
		zIndex: number
		skipGreeting?: boolean
		classNames?: string
		styles?: Partial<CSSStyleDeclaration>
		onFrame?: (time: number) => void
	}
	private target?: HTMLElement
	private container?: HTMLElement
	private fire: ParticleLayer
	private smoke: ParticleLayer | null
	private glow: GlowQuad | null
	private fireData: FireParticle[] = []
	private smokeData: SmokeParticle[] = []
	private bounds: BorderBounds = emptyBounds()
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
		this.updateBounds()
	}

	constructor(options: FireEngineOptions = {}) {
		const preset = options.preset ?? 'border'
		this.options = {
			preset,
			particleCount: options.particleCount ?? (preset === 'burning' ? 2200 : 1300),
			smokeCount: options.smokeCount ?? (preset === 'burning' ? 520 : 0),
			glow: options.glow ?? preset === 'burning',
			padding: options.padding ?? (preset === 'burning' ? 2 : 1),
			zIndex: options.zIndex ?? 10,
			skipGreeting: options.skipGreeting,
			classNames: options.classNames,
			styles: options.styles,
			onFrame: options.onFrame,
		}
		this.target = options.target
		this.container = options.container

		this.canvas = document.createElement('canvas')
		if (this.options.classNames) this.canvas.className = this.options.classNames
		this.canvas.style.display = 'block'
		this.canvas.style.pointerEvents = 'none'
		this.canvas.style.zIndex = String(this.options.zIndex)
		this.canvas.style.background = 'transparent'
		this.applyCanvasLayout()
		if (this.options.styles) Object.assign(this.canvas.style, this.options.styles)
		this.element = this.canvas

		const gl = this.canvas.getContext('webgl2', {
			alpha: true,
			antialias: true,
			premultipliedAlpha: true,
			powerPreference: 'high-performance',
		})
		if (!gl) throw new Error('WebGL2 is required but not available.')
		this.gl = gl

		this.fire = new ParticleLayer(gl, this.options.particleCount, particleVert, fireFrag)
		if (preset === 'burning') {
			this.fire.setStyle(1.15, 0.18, 0.56)
		} else {
			this.fire.setStyle(1.05, 0.12, 0.52)
		}

		this.smoke =
			this.options.smokeCount > 0
				? new ParticleLayer(gl, this.options.smokeCount, particleVert, smokeFrag)
				: null
		this.glow = this.options.glow ? new GlowQuad(gl, glowVert, glowFrag) : null

		if (!this.options.skipGreeting) greet('agent-aura')
	}

	setTarget(target: HTMLElement): void {
		this.target = target
		this.observe()
		this.updateBounds()
		if (this.running) this.seedParticles(true)
	}

	setContainer(container: HTMLElement): void {
		this.container = container
		this.applyCanvasLayout()
		this.observe()
		this.resizeToView()
	}

	start(): void {
		if (this.disposed) throw new Error('Fire instance has been disposed.')
		if (this.running) return
		this.running = true
		this.startTime = performance.now()
		this.lastTime = this.startTime
		this.observe()
		this.resizeToView()
		this.seedParticles(true)
		this.render(0, 0)

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
		if (this.disposed) throw new Error('Fire instance has been disposed.')
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
		this.fire.dispose()
		this.smoke?.dispose()
		this.glow?.dispose()
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
		this.gl.clearColor(0, 0, 0, 0)
		this.gl.clear(this.gl.COLOR_BUFFER_BIT)
		this.fire.setView(view.width, view.height, this.pixelRatio)
		this.smoke?.setView(view.width, view.height, this.pixelRatio)
		this.updateBounds()
	}

	private updateBounds(): void {
		const view = this.viewBox()
		const source = this.target ?? this.container
		if (!source) {
			this.bounds = {
				left: view.width * 0.1,
				right: view.width * 0.9,
				top: view.height * 0.82,
				bottom: view.height * 0.18,
				width: view.width * 0.8,
				height: view.height * 0.64,
			}
			return
		}
		this.bounds = readBorderBounds(source, view, this.options.padding)
	}

	private seedParticles(initial: boolean): void {
		this.fireData = []
		for (let i = 0; i < this.options.particleCount; i++) {
			this.writeFire(i, resetFireParticle(this.options.preset, this.bounds, initial))
		}
		this.smokeData = []
		if (this.smoke) {
			for (let i = 0; i < this.options.smokeCount; i++) {
				this.writeSmoke(i, resetSmokeParticle(this.bounds, initial))
			}
		}
	}

	private writeFire(index: number, particle: FireParticle): void {
		this.fireData[index] = particle
		this.fire.positions[index * 3] = particle.x
		this.fire.positions[index * 3 + 1] = particle.y
		this.fire.positions[index * 3 + 2] = particle.z
	}

	private writeSmoke(index: number, particle: SmokeParticle): void {
		this.smokeData[index] = particle
		if (!this.smoke) return
		this.smoke.positions[index * 3] = particle.x
		this.smoke.positions[index * 3 + 1] = particle.y
		this.smoke.positions[index * 3 + 2] = particle.z
	}

	private render(time: number, delta: number): void {
		const gl = this.gl
		const preset = this.options.preset

		for (let i = 0; i < this.options.particleCount; i++) {
			const p = this.fireData[i]
			p.life -= delta
			if (p.life <= 0) {
				this.writeFire(i, resetFireParticle(preset, this.bounds, false))
				continue
			}

			const age = 1 - p.life / p.maxLife
			if (preset === 'burning') {
				const turbulence = Math.sin(time * 9.5 + p.seed + age * 12.0)
				const chaos = Math.cos(time * 5.0 + p.seed * 1.7 + age * 9.0)
				if (p.spark) {
					p.x += (p.vx + turbulence * 18) * delta
					p.y += p.vy * delta
					p.vy -= 48 * delta
				} else {
					p.x += (p.vx + turbulence * 34 + chaos * 12) * delta
					p.y += p.vy * delta
					p.vx += turbulence * 16 * delta
				}
			} else {
				const turbulence = Math.sin(time * 7.5 + p.seed + age * 8)
				if (p.spark) {
					p.x += p.vx * delta
					p.y += p.vy * delta
					p.vy -= 35 * delta
				} else {
					p.x += (p.vx + turbulence * 24) * delta
					p.y += p.vy * delta
					p.vx += turbulence * delta * 18
				}
			}

			this.fire.positions[i * 3] = p.x
			this.fire.positions[i * 3 + 1] = p.y

			let alpha = age < 0.12 ? age / 0.12 : 1 - (age - 0.12) / 0.88
			if (preset === 'burning') {
				alpha = age < 0.1 ? age / 0.1 : 1 - (age - 0.1) / 0.9
				alpha = Math.pow(Math.max(alpha, 0), 1.2)
				if (p.spark) {
					this.fire.alphas[i] = alpha * 1.32
					this.fire.sizes[i] = p.baseSize * (1 - age * 0.55)
				} else {
					this.fire.alphas[i] = alpha * 1.0
					this.fire.sizes[i] = p.baseSize * (0.65 + age * 1.55)
				}
			} else {
				alpha = Math.pow(Math.max(alpha, 0), 1.25)
				if (p.spark) {
					this.fire.alphas[i] = alpha * 1.22
					this.fire.sizes[i] = p.baseSize * (1 - age * 0.55)
				} else {
					this.fire.alphas[i] = alpha * 0.86
					this.fire.sizes[i] = p.baseSize * (0.58 + age * 1.4)
				}
			}

			writeFireColor(this.fire.colors, i, age, p.spark, preset)
		}

		if (this.smoke) {
			for (let i = 0; i < this.options.smokeCount; i++) {
				const s = this.smokeData[i]
				s.life -= delta
				if (s.life <= 0) {
					this.writeSmoke(i, resetSmokeParticle(this.bounds, false))
					continue
				}
				const age = 1 - s.life / s.maxLife
				const drift = Math.sin(time * 1.8 + s.seed + age * 4.0)
				s.x += (s.vx + drift * 12) * delta
				s.y += s.vy * delta
				this.smoke.positions[i * 3] = s.x
				this.smoke.positions[i * 3 + 1] = s.y
				this.smoke.sizes[i] = s.baseSize * (0.65 + age * 1.85)
				this.smoke.alphas[i] = Math.pow(1 - age, 1.4) * 0.16
				const gray = mix(0.16, 0.34, age)
				this.smoke.colors[i * 3] = gray
				this.smoke.colors[i * 3 + 1] = gray * 0.92
				this.smoke.colors[i * 3 + 2] = gray * 0.9
			}
			this.smoke.upload()
		}

		this.fire.upload()

		gl.disable(gl.DEPTH_TEST)
		gl.disable(gl.CULL_FACE)
		gl.enable(gl.BLEND)
		gl.clearColor(0, 0, 0, 0)
		gl.clear(gl.COLOR_BUFFER_BIT)

		gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
		this.glow?.draw(time)
		this.smoke?.draw()
		gl.blendFuncSeparate(gl.ONE, gl.ONE, gl.ONE, gl.ONE)
		this.fire.draw()
		this.options.onFrame?.(time)
	}
}
