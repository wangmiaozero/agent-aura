/**
 * Agent Aura - fire / burning subpath
 *
 * @author wangmiao<tuziling84@gmail.com>
 * @license MIT
 * @repository https://github.com/wangmiaozero/agent-aura
 */
import { BurningFire, type BurningFireOptions } from '../BurningFire'
import { FireBorder, type FireBorderOptions } from '../FireBorder'
import type { AttachOptions, TargetRef } from '../dom'

export { BurningFire, FireBorder }
export type { AttachOptions, BurningFireOptions, FireBorderOptions, TargetRef }

export function fire(target: TargetRef, options?: AttachOptions<FireBorderOptions>): FireBorder {
	return FireBorder.attach(target, options)
}

export function burning(
	target: TargetRef,
	options?: AttachOptions<BurningFireOptions>
): BurningFire {
	return BurningFire.attach(target, options)
}
