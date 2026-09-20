/**
 * Agent Aura - fire along a UI border
 *
 * Ported from the Three.js fire-border demo into zero-dependency WebGL2.
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

export type FireBorderOptions = Omit<FireEngineOptions, 'preset' | 'smokeCount' | 'glow'>

export class FireBorder {
	readonly element: HTMLCanvasElement
	private engine: FireEngine

	static attach(target: TargetRef, options: AttachOptions<FireBorderOptions> = {}): FireBorder {
		const el = resolveTarget(target)
		const { container: containerRef, ...rest } = options
		const container = resolveOptional(containerRef)
		if (container) ensurePositioned(container)
		const fire = new FireBorder({ ...rest, target: el, container })
		;(container ?? document.body).appendChild(fire.element)
		fire.start()
		return fire
	}

	constructor(options: FireBorderOptions = {}) {
		this.engine = new FireEngine({
			...options,
			preset: 'border',
			smokeCount: 0,
			glow: false,
			particleCount: options.particleCount ?? 1300,
			padding: options.padding ?? 1,
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
