/**
 * Agent Aura - motion border subpath
 *
 * @author wangmiao<tuziling84@gmail.com>
 * @license MIT
 * @repository https://github.com/wangmiaozero/agent-aura
 */
import { MotionBorder, type MotionBorderOptions } from '../MotionBorder'
import type { AttachOptions, TargetRef } from '../dom'

export { MotionBorder }
export type { AttachOptions, MotionBorderOptions, TargetRef }

export function border(
	target: TargetRef,
	options?: AttachOptions<MotionBorderOptions>
): MotionBorder {
	return MotionBorder.attach(target, options)
}
