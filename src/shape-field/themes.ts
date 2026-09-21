/**
 * Agent Aura - shape-field themes (water / immortal / demonic)
 *
 * Ported from threejs-shape-aura.html
 *
 * @author wangmiao<tuziling84@gmail.com>
 * @license MIT
 * @repository https://github.com/wangmiaozero/agent-aura
 */

export type ShapeFieldMode = 'water' | 'immortal' | 'demonic'

export type Rgb = readonly [number, number, number]

export type ShapeFieldTheme = {
	lineColors: readonly [Rgb, Rgb, Rgb, Rgb]
	fieldA: Rgb
	fieldB: Rgb
	detailA: Rgb
	detailB: Rgb
	fieldSize: readonly [number, number]
	detailSize: readonly [number, number]
	fieldAlpha: readonly [number, number]
	detailAlpha: readonly [number, number]
	fieldOffset: readonly [number, number]
	fieldDrift: number
	pathSpeed: readonly [number, number]
	detailSpeed: readonly [number, number]
	rise: number
	waveSpeed: number
	turbulence: number
	modeId: number
}

function rgb(hex: number): Rgb {
	return [((hex >> 16) & 255) / 255, ((hex >> 8) & 255) / 255, (hex & 255) / 255]
}

export const SHAPE_FIELD_THEMES: Record<ShapeFieldMode, ShapeFieldTheme> = {
	water: {
		lineColors: [rgb(0x46d9ff), rgb(0x1688ff), rgb(0x9ff8ff), rgb(0xffffff)],
		fieldA: rgb(0x0e7dcc),
		fieldB: rgb(0x78eaff),
		detailA: rgb(0x57e8ff),
		detailB: rgb(0xe5ffff),
		fieldSize: [22, 58],
		detailSize: [2, 6],
		fieldAlpha: [0.025, 0.1],
		detailAlpha: [0.28, 0.85],
		fieldOffset: [5, 34],
		fieldDrift: 18,
		pathSpeed: [0.008, 0.03],
		detailSpeed: [0.02, 0.07],
		rise: 12,
		waveSpeed: 2.2,
		turbulence: 7,
		modeId: 0,
	},
	immortal: {
		lineColors: [rgb(0xd78a18), rgb(0xffcc55), rgb(0xffefb0), rgb(0xffffff)],
		fieldA: rgb(0xa9580c),
		fieldB: rgb(0xffd66d),
		detailA: rgb(0xffb52e),
		detailB: rgb(0xfff5ce),
		fieldSize: [30, 82],
		detailSize: [2, 7],
		fieldAlpha: [0.018, 0.095],
		detailAlpha: [0.3, 0.95],
		fieldOffset: [10, 52],
		fieldDrift: 26,
		pathSpeed: [0.004, 0.019],
		detailSpeed: [0.014, 0.055],
		rise: 30,
		waveSpeed: 1.25,
		turbulence: 12,
		modeId: 1,
	},
	demonic: {
		lineColors: [rgb(0x5b0ba8), rgb(0xa02cff), rgb(0xec74ff), rgb(0xfbe9ff)],
		fieldA: rgb(0x26002f),
		fieldB: rgb(0xa018ce),
		detailA: rgb(0x7b12d8),
		detailB: rgb(0xff70dc),
		fieldSize: [34, 94],
		detailSize: [2, 8],
		fieldAlpha: [0.022, 0.13],
		detailAlpha: [0.28, 0.95],
		fieldOffset: [8, 58],
		fieldDrift: 34,
		pathSpeed: [0.004, 0.024],
		detailSpeed: [0.016, 0.07],
		rise: 38,
		waveSpeed: 1.8,
		turbulence: 18,
		modeId: 2,
	},
}

export function lerpRgb(a: Rgb, b: Rgb, t: number): Rgb {
	const k = Math.max(0, Math.min(1, t))
	return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]
}
