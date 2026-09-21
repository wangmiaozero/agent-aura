/**
 * Agent Aura - shape-aware purple-black demonic aura
 *
 * Thin theme wrapper over ShapeFieldAura (mode: demonic).
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

export type DemonicAuraOptions = Omit<ShapeFieldAuraOptions, 'mode'>

export class DemonicAura extends ShapeFieldAura {
	static override attach(
		target: TargetRef,
		options: AttachOptions<DemonicAuraOptions> = {}
	): DemonicAura {
		return ShapeFieldAura.attach(target, { ...options, mode: 'demonic' }) as DemonicAura
	}

	constructor(options: DemonicAuraOptions = {}) {
		super({ ...options, mode: 'demonic' })
	}
}
