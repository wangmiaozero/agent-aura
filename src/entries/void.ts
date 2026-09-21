/**
 * Agent Aura - void / blackhole subpath
 *
 * `void` is a reserved word, so the function is `voidAura`.
 * `aura.void()` on the full API is unchanged.
 *
 * @author wangmiao<tuziling84@gmail.com>
 * @license MIT
 * @repository https://github.com/wangmiaozero/agent-aura
 */
import { VoidAura, type VoidAuraOptions } from '../VoidAura'
import type { AttachOptions, TargetRef } from '../dom'

export { VoidAura }
export type { AttachOptions, TargetRef, VoidAuraOptions }

export function voidAura(target: TargetRef, options?: AttachOptions<VoidAuraOptions>): VoidAura {
	return VoidAura.attach(target, options)
}
