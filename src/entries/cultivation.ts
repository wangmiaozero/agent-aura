/**
 * Agent Aura - cultivation field subpath
 *
 * @author wangmiao<tuziling84@gmail.com>
 * @license MIT
 * @repository https://github.com/wangmiaozero/agent-aura
 */
import { CultivationAura, type CultivationAuraOptions } from '../CultivationAura'
import type { AttachOptions, TargetRef } from '../dom'

export { CultivationAura }
export type { AttachOptions, CultivationAuraOptions, TargetRef }

export function cultivation(
	target: TargetRef,
	options?: AttachOptions<CultivationAuraOptions>
): CultivationAura {
	return CultivationAura.attach(target, options)
}
