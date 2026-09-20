/**
 * Agent Aura - one-call API
 *
 * @author wangmiao<tuziling84@gmail.com>
 * @license MIT
 * @repository https://github.com/wangmiaozero/agent-aura
 */
import { BurningFire, type BurningFireOptions } from './BurningFire'
import { FireBorder, type FireBorderOptions } from './FireBorder'
import { Motion, type MotionOptions } from './Motion'
import { MotionBorder, type MotionBorderOptions } from './MotionBorder'
import type { AttachOptions, TargetRef } from './dom'

export const aura = {
	fire(target: TargetRef, options?: AttachOptions<FireBorderOptions>) {
		return FireBorder.attach(target, options)
	},
	burning(target: TargetRef, options?: AttachOptions<BurningFireOptions>) {
		return BurningFire.attach(target, options)
	},
	border(target: TargetRef, options?: AttachOptions<MotionBorderOptions>) {
		return MotionBorder.attach(target, options)
	},
	motion(target: TargetRef, options?: MotionOptions) {
		return Motion.attach(target, options)
	},
}

export default aura
