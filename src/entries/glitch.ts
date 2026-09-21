/**
 * Agent Aura - glitch / collapse subpath
 *
 * @author wangmiao<tuziling84@gmail.com>
 * @license MIT
 * @repository https://github.com/wangmiaozero/agent-aura
 */
import { GlitchAura, type GlitchAuraOptions } from '../GlitchAura'
import type { AttachOptions, TargetRef } from '../dom'

export { GlitchAura }
export type { AttachOptions, GlitchAuraOptions, TargetRef }

export function glitch(target: TargetRef, options?: AttachOptions<GlitchAuraOptions>): GlitchAura {
	return GlitchAura.attach(target, options)
}
