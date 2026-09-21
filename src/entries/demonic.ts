/**
 * Agent Aura - demonic field subpath
 *
 * @author wangmiao<tuziling84@gmail.com>
 * @license MIT
 * @repository https://github.com/wangmiaozero/agent-aura
 */
import { DemonicAura, type DemonicAuraOptions } from '../DemonicAura'
import type { AttachOptions, TargetRef } from '../dom'

export { DemonicAura }
export type { AttachOptions, DemonicAuraOptions, TargetRef }

export function demonic(
	target: TargetRef,
	options?: AttachOptions<DemonicAuraOptions>
): DemonicAura {
	return DemonicAura.attach(target, options)
}
