/**
 * Agent Aura - overclock / burning-life fire
 *
 * Ported from the Three.js agent-burning-fire demo into zero-dependency WebGL2.
 *
 * @author wangmiao<tuziling84@gmail.com>
 * @license MIT
 * @repository https://github.com/wangmiaozero/agent-aura
 */
import {
	type AttachOptions,
	type TargetRef,
	ensurePositioned,
	resolveOptional,
	resolveTarget,
} from './dom'
import { FireEngine, type FireEngineOptions } from './fire/engine'

export type BurningFireOptions = Omit<FireEngineOptions, 'preset'>

export class BurningFire {
	readonly element: HTMLCanvasElement
	private engine: FireEngine

	static attach(target: TargetRef, options: AttachOptions<BurningFireOptions> = {}): BurningFire {
		const el = resolveTarget(target)
		const { container: containerRef, ...rest } = options
		const container = resolveOptional(containerRef)
		if (container) ensurePositioned(container)
		const fire = new BurningFire({ ...rest, target: el, container })
		;(container ?? document.body).appendChild(fire.element)
		fire.start()
		return fire
	}

	constructor(options: BurningFireOptions = {}) {
		this.engine = new FireEngine({
			...options,
			preset: 'burning',
			particleCount: options.particleCount ?? 2200,
			smokeCount: options.smokeCount ?? 520,
			glow: options.glow ?? true,
			padding: options.padding ?? 2,
		})
		this.element = this.engine.element
	}

	setTarget(target: HTMLElement): void {
		this.engine.setTarget(target)
	}

	setContainer(container: HTMLElement): void {
		this.engine.setContainer(container)
	}

	start(): void {
		this.engine.start()
	}

	pause(): void {
		this.engine.pause()
	}

	dispose(): void {
		this.engine.dispose()
	}
}
