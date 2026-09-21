/**
 * Agent Aura - one-call API
 *
 * @author wangmiao<tuziling84@gmail.com>
 * @license MIT
 * @repository https://github.com/wangmiaozero/agent-aura
 */
import { border } from './entries/border'
import { cultivation } from './entries/cultivation'
import { demonic } from './entries/demonic'
import { burning, fire } from './entries/fire'
import { glitch } from './entries/glitch'
import { glow } from './entries/glow'
import { shape } from './entries/shape'
import { thunder } from './entries/thunder'
import { voidAura } from './entries/void'
import { water } from './entries/water'

export const aura = {
	fire,
	burning,
	border,
	glow,
	shape,
	water,
	cultivation,
	demonic,
	thunder,
	void: voidAura,
	glitch,
}

export default aura
