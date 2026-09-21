/**
 * Agent Aura - shape-aware golden immortal / cultivation aura
 *
 * Thin theme wrapper over ShapeFieldAura (mode: immortal).
 *
 * @author wangmiao<tuziling84@gmail.com>
 * @license MIT
 * @repository https://github.com/wangmiaozero/agent-aura
 */
import type { AttachOptions, TargetRef } from './dom'
import { ShapeFieldAura, type ShapeFieldAuraOptions } from './shape-field/ShapeFieldAura'

export type CultivationAuraOptions = Omit<ShapeFieldAuraOptions, 'mode'> & {
	/** @deprecated use fieldCount */
	mistCount?: number
	/** @deprecated use detailCount */
	spiritCount?: number
	/** @deprecated use pathSamples */
	auraSamples?: number
}

function normalizeCultivationOptions(
	options: CultivationAuraOptions
): Omit<ShapeFieldAuraOptions, 'mode'> {
	const { mistCount, spiritCount, auraSamples, fieldCount, detailCount, pathSamples, ...rest } =
		options
	return {
		...rest,
		fieldCount: fieldCount ?? mistCount,
		detailCount: detailCount ?? spiritCount,
		pathSamples: pathSamples ?? auraSamples,
	}
}

export class CultivationAura extends ShapeFieldAura {
	static override attach(
		target: TargetRef,
		options: AttachOptions<CultivationAuraOptions> = {}
	): CultivationAura {
		const { container, ...rest } = options
		return ShapeFieldAura.attach(target, {
			...normalizeCultivationOptions(rest),
			container,
			mode: 'immortal',
		}) as CultivationAura
	}

	constructor(options: CultivationAuraOptions = {}) {
		super({ ...normalizeCultivationOptions(options), mode: 'immortal' })
	}
}
