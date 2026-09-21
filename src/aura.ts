/**
 * Agent Aura - one-call API
 *
 * @author wangmiao<tuziling84@gmail.com>
 * @license MIT
 * @repository https://github.com/wangmiaozero/agent-aura
 */
import { BurningFire, type BurningFireOptions } from './BurningFire'
import { CultivationAura, type CultivationAuraOptions } from './CultivationAura'
import { DemonicAura, type DemonicAuraOptions } from './DemonicAura'
import { FireBorder, type FireBorderOptions } from './FireBorder'
import { GlitchAura, type GlitchAuraOptions } from './GlitchAura'
import { Glow, type GlowOptions } from './Glow'
import { MotionBorder, type MotionBorderOptions } from './MotionBorder'
import { ShapeAura, type ShapeAuraOptions } from './ShapeAura'
import { ThunderAura, type ThunderAuraOptions } from './ThunderAura'
import { VoidAura, type VoidAuraOptions } from './VoidAura'
import { WaterAura, type WaterAuraOptions } from './WaterAura'
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
	glow(target: TargetRef, options?: GlowOptions) {
		return Glow.attach(target, options)
	},
	shape(target: TargetRef, options?: AttachOptions<ShapeAuraOptions>) {
		return ShapeAura.attach(target, options)
	},
	water(target: TargetRef, options?: AttachOptions<WaterAuraOptions>) {
		return WaterAura.attach(target, options)
	},
	cultivation(target: TargetRef, options?: AttachOptions<CultivationAuraOptions>) {
		return CultivationAura.attach(target, options)
	},
	demonic(target: TargetRef, options?: AttachOptions<DemonicAuraOptions>) {
		return DemonicAura.attach(target, options)
	},
	thunder(target: TargetRef, options?: AttachOptions<ThunderAuraOptions>) {
		return ThunderAura.attach(target, options)
	},
	void(target: TargetRef, options?: AttachOptions<VoidAuraOptions>) {
		return VoidAura.attach(target, options)
	},
	glitch(target: TargetRef, options?: AttachOptions<GlitchAuraOptions>) {
		return GlitchAura.attach(target, options)
	},
}

export default aura
