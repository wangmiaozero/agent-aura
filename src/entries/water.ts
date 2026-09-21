/**
 * Agent Aura - water field subpath
 *
 * @author wangmiao<tuziling84@gmail.com>
 * @license MIT
 * @repository https://github.com/wangmiaozero/agent-aura
 */
import { WaterAura, type WaterAuraOptions } from '../WaterAura'
import type { AttachOptions, TargetRef } from '../dom'

export { WaterAura }
export type { AttachOptions, TargetRef, WaterAuraOptions }

export function water(target: TargetRef, options?: AttachOptions<WaterAuraOptions>): WaterAura {
	return WaterAura.attach(target, options)
}
