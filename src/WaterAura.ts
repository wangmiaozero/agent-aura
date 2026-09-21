/**
 * Agent Aura - shape-aware liquid water aura
 *
 * Thin theme wrapper over ShapeFieldAura (mode: water).
 *
 * @author wangmiao<tuziling84@gmail.com>
 * @license MIT
 * @repository https://github.com/wangmiaozero/agent-aura
 */
import type { AttachOptions, TargetRef } from './dom'
import {
	ShapeFieldAura,
	type ShapeFieldAuraOptions,
} from './shape-field/ShapeFieldAura'

export type WaterAuraOptions = Omit<ShapeFieldAuraOptions, 'mode'>

export class WaterAura extends ShapeFieldAura {
	static override attach(
		target: TargetRef,
		options: AttachOptions<WaterAuraOptions> = {}
	): WaterAura {
		return ShapeFieldAura.attach(target, { ...options, mode: 'water' }) as WaterAura
	}

	constructor(options: WaterAuraOptions = {}) {
		super({ ...options, mode: 'water' })
	}
}
