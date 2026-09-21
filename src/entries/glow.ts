/**
 * Agent Aura - glow subpath
 *
 * @author wangmiao<tuziling84@gmail.com>
 * @license MIT
 * @repository https://github.com/wangmiaozero/agent-aura
 */
import { type CSSRgbString, Glow, type GlowOptions } from '../Glow'
import type { TargetRef } from '../dom'

export { Glow }
export type { CSSRgbString, GlowOptions, TargetRef }

export function glow(target: TargetRef, options?: GlowOptions): Glow {
	return Glow.attach(target, options)
}
