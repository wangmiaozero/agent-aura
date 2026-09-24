/**
 * Agent Aura - fire / spark spawn & color
 *
 * @author wangmiao<tuziling84@gmail.com>
 * @license MIT
 * @repository https://github.com/wangmiaozero/agent-aura
 */
import { type BorderBounds, type FireOutline, type FireSide, mix, rand, randomBorderPoint } from './math'

export type FirePreset = 'border' | 'burning'

export type FireParticle = {
	x: number
	y: number
	z: number
	vx: number
	vy: number
	life: number
	maxLife: number
	baseSize: number
	seed: number
	spark: boolean
	side: FireSide
}

export type SmokeParticle = {
	x: number
	y: number
	z: number
	vx: number
	vy: number
	life: number
	maxLife: number
	baseSize: number
	seed: number
}

export function resetFireParticle(
	preset: FirePreset,
	bounds: BorderBounds,
	initial: boolean,
	outline?: FireOutline | null
): FireParticle {
	return preset === 'burning'
		? resetBurningFire(bounds, initial, outline)
		: resetBorderFire(bounds, initial, outline)
}

export function resetSmokeParticle(
	bounds: BorderBounds,
	initial: boolean,
	outline?: FireOutline | null
): SmokeParticle {
	const p = randomBorderPoint(bounds, 'burning', outline)
	const maxLife = rand(1.0, 2.6)
	return {
		x: p.x + rand(-14, 14),
		y: p.y + rand(-4, 14),
		z: -2,
		vx: p.normalX * rand(4, 18) + rand(-16, 16),
		vy: rand(18, 54),
		maxLife,
		life: initial ? Math.random() * maxLife : maxLife,
		baseSize: rand(20, 60),
		seed: Math.random() * Math.PI * 2,
	}
}

export function writeFireColor(
	colors: Float32Array,
	index: number,
	age: number,
	spark: boolean,
	preset: FirePreset
): void {
	let r: number
	let g: number
	let b: number

	if (preset === 'burning') {
		if (spark) {
			r = 1.0
			g = mix(0.82, 0.14, age)
			b = mix(0.16, 0.02, age)
		} else if (age < 0.18) {
			const t = age / 0.18
			r = 1.0
			g = mix(0.98, 0.68, t)
			b = mix(0.56, 0.08, t)
		} else if (age < 0.58) {
			const t = (age - 0.18) / 0.4
			r = 1.0
			g = mix(0.68, 0.16, t)
			b = mix(0.08, 0.01, t)
		} else {
			const t = (age - 0.58) / 0.42
			r = mix(1.0, 0.38, t)
			g = mix(0.16, 0.02, t)
			b = 0.0
		}
	} else if (spark) {
		r = 1.0
		g = mix(0.65, 0.1, age)
		b = 0.015
	} else if (age < 0.22) {
		const t = age / 0.22
		r = 1.0
		g = mix(0.95, 0.58, t)
		b = mix(0.45, 0.03, t)
	} else if (age < 0.62) {
		const t = (age - 0.22) / 0.4
		r = 1
		g = mix(0.58, 0.13, t)
		b = mix(0.03, 0.005, t)
	} else {
		const t = (age - 0.62) / 0.38
		r = mix(1, 0.32, t)
		g = mix(0.13, 0.01, t)
		b = 0
	}

	colors[index * 3] = r
	colors[index * 3 + 1] = g
	colors[index * 3 + 2] = b
}

function resetBorderFire(
	bounds: BorderBounds,
	initial: boolean,
	outline?: FireOutline | null
): FireParticle {
	const point = randomBorderPoint(bounds, 'border', outline)
	const spark = Math.random() < 0.12
	const particle: FireParticle = {
		x: point.x + rand(-2, 2),
		y: point.y + rand(-2, 2),
		z: rand(-1, 1),
		vx: 0,
		vy: 0,
		life: 0,
		maxLife: 0,
		baseSize: 0,
		seed: Math.random() * Math.PI * 2,
		spark,
		side: point.side,
	}

	if (spark) {
		particle.vx = point.normalX * rand(20, 80) + rand(-35, 35)
		particle.vy = rand(55, 160)
		particle.maxLife = rand(0.7, 1.5)
		particle.baseSize = rand(2, 6)
	} else {
		particle.vx = point.normalX * rand(8, 38) + rand(-16, 16)
		particle.vy = rand(25, 105)
		if (point.side === 'top') particle.vy += rand(25, 90)
		particle.maxLife = rand(0.35, 1.05)
		particle.baseSize = rand(13, 32)
	}

	if (point.side === 'left' || point.side === 'right') {
		particle.vy *= rand(0.7, 1.15)
	}

	particle.life = initial ? Math.random() * particle.maxLife : particle.maxLife
	return particle
}

function resetBurningFire(
	bounds: BorderBounds,
	initial: boolean,
	outline?: FireOutline | null
): FireParticle {
	const p = randomBorderPoint(bounds, 'burning', outline)
	const spark = Math.random() < 0.17
	const particle: FireParticle = {
		x: p.x + rand(-3, 3),
		y: p.y + rand(-3, 3),
		z: rand(-1, 1),
		vx: 0,
		vy: 0,
		life: 0,
		maxLife: 0,
		baseSize: 0,
		seed: Math.random() * Math.PI * 2,
		spark,
		side: p.side,
	}

	if (spark) {
		particle.vx = p.normalX * rand(40, 120) + rand(-55, 55)
		particle.vy = rand(90, 220)
		particle.baseSize = rand(3, 7)
		particle.maxLife = rand(0.45, 1.2)
	} else {
		particle.vx = p.normalX * rand(14, 46) + rand(-26, 26)
		particle.vy = rand(70, 180)
		particle.baseSize = rand(14, 38)
		particle.maxLife = rand(0.35, 1.15)

		if (p.side === 'top') {
			particle.vy += rand(40, 110)
			particle.baseSize += rand(4, 14)
		}
		if (p.side === 'left' || p.side === 'right') {
			particle.vx += p.normalX * rand(8, 28)
		}
		if (Math.random() < 0.12) {
			particle.baseSize *= 1.45
			particle.vy *= 1.18
		}
	}

	particle.life = initial ? Math.random() * particle.maxLife : particle.maxLife
	return particle
}
