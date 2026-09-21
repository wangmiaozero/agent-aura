/**
 * Agent Aura - shape ribbon subpath
 *
 * @author wangmiao<tuziling84@gmail.com>
 * @license MIT
 * @repository https://github.com/wangmiaozero/agent-aura
 */
import { ShapeAura, type ShapeAuraOptions } from '../ShapeAura'
import type { AttachOptions, TargetRef } from '../dom'

export { ShapeAura }
export type { AttachOptions, ShapeAuraOptions, TargetRef }

export function shape(target: TargetRef, options?: AttachOptions<ShapeAuraOptions>): ShapeAura {
	return ShapeAura.attach(target, options)
}
