/**
 * Agent Aura - thunder subpath
 *
 * @author wangmiao<tuziling84@gmail.com>
 * @license MIT
 * @repository https://github.com/wangmiaozero/agent-aura
 */
import { ThunderAura, type ThunderAuraOptions } from '../ThunderAura'
import type { AttachOptions, TargetRef } from '../dom'

export { ThunderAura }
export type { AttachOptions, TargetRef, ThunderAuraOptions }

export function thunder(
	target: TargetRef,
	options?: AttachOptions<ThunderAuraOptions>
): ThunderAura {
	return ThunderAura.attach(target, options)
}
