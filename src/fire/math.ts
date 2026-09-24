/**
 * Agent Aura - WebGL2 visual effects for Agent UIs
 *
 * @author wangmiao<tuziling84@gmail.com>
 * @license MIT
 * @repository https://github.com/wangmiaozero/agent-aura
 */

import { buildPathData, createTargetPath, getPointOnPath, type PathData } from '../thunder/path'

export type FireSide = 'top' | 'right' | 'bottom' | 'left'

export type BorderBounds = {
	left: number
	right: number
	top: number
	bottom: number
	width: number
	height: number
}

export type BorderPoint = {
	x: number
	y: number
	normalX: number
	normalY: number
	side: FireSide
}

export type FireOutline = {
	viewHeight: number
	path: PathData
	clockwise: boolean
}

export function rand(min: number, max: number): number {
	return min + Math.random() * (max - min)
}

export function mix(a: number, b: number, t: number): number {
	return a + (b - a) * t
}

export function emptyBounds(): BorderBounds {
	return { left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0 }
}

export function readBorderBounds(
	target: HTMLElement,
	view: { width: number; height: number; left: number; top: number },
	padding: number
): BorderBounds {
	const rect = target.getBoundingClientRect()
	const localLeft = rect.left - view.left
	const localTop = rect.top - view.top
	const localRight = rect.right - view.left
	const localBottom = rect.bottom - view.top

	return {
		left: localLeft - padding,
		right: localRight + padding,
		top: view.height - localTop + padding,
		bottom: view.height - localBottom - padding,
		width: rect.width + padding * 2,
		height: rect.height + padding * 2,
	}
}

export function readFireOutline(
	target: HTMLElement,
	view: { height: number; left: number; top: number },
	padding: number
): FireOutline {
	const path = createTargetPath(target, view.left, view.top, padding, 8)
	let area = 0
	for (let i = 0; i < path.length; i++) {
		const a = path[i]
		const b = path[(i + 1) % path.length]
		area += a.x * b.y - b.x * a.y
	}
	return { viewHeight: view.height, path: buildPathData(path), clockwise: area >= 0 }
}

export function randomBorderPoint(
	bounds: BorderBounds,
	preset: 'border' | 'burning',
	outline?: FireOutline | null
): BorderPoint {
	if (outline && outline.path.total > 0) return shapeBorderPoint(outline, preset)
	if (preset === 'burning') return burningBorderPoint(bounds)
	return evenBorderPoint(bounds)
}

function shapeBorderPoint(outline: FireOutline, preset: 'border' | 'burning'): BorderPoint {
	let point = pointOnOutline(outline, Math.random())
	if (preset === 'burning') {
		for (let i = 0; i < 6; i++) {
			const next = pointOnOutline(outline, Math.random())
			const weight = next.side === 'top' ? 2.2 : next.side === 'bottom' ? 0.6 : 0.8
			if (Math.random() < weight / 2.2) {
				point = next
				break
			}
		}
	}
	return point
}

function pointOnOutline(outline: FireOutline, t: number): BorderPoint {
	const sample = getPointOnPath(outline.path, t)
	let nx = sample.tangent.y
	let ny = -sample.tangent.x
	if (!outline.clockwise) {
		nx = -nx
		ny = -ny
	}
	const normalX = nx
	const normalY = -ny
	const side: FireSide =
		Math.abs(normalY) >= Math.abs(normalX) ? (normalY >= 0 ? 'top' : 'bottom') : normalX >= 0 ? 'right' : 'left'
	return {
		x: sample.point.x,
		y: outline.viewHeight - sample.point.y,
		normalX,
		normalY,
		side,
	}
}

function evenBorderPoint(b: BorderBounds): BorderPoint {
	const horizontalWeight = Math.max(b.width, 1)
	const verticalWeight = Math.max(b.height, 1)
	const perimeter = horizontalWeight * 2 + verticalWeight * 2
	let distance = Math.random() * perimeter

	if (distance < horizontalWeight) {
		return {
			x: b.left + Math.random() * b.width,
			y: b.top,
			normalX: 0,
			normalY: 1,
			side: 'top',
		}
	}

	distance -= horizontalWeight
	if (distance < verticalWeight) {
		return {
			x: b.right,
			y: b.bottom + Math.random() * b.height,
			normalX: 1,
			normalY: 0,
			side: 'right',
		}
	}

	distance -= verticalWeight
	if (distance < horizontalWeight) {
		return {
			x: b.left + Math.random() * b.width,
			y: b.bottom,
			normalX: 0,
			normalY: -1,
			side: 'bottom',
		}
	}

	return {
		x: b.left,
		y: b.bottom + Math.random() * b.height,
		normalX: -1,
		normalY: 0,
		side: 'left',
	}
}

function burningBorderPoint(b: BorderBounds): BorderPoint {
	const w = Math.max(b.width, 1)
	const h = Math.max(b.height, 1)
	const areaTop = w * 2.2
	const areaRight = h * 0.8
	const areaBottom = w * 0.6
	const areaLeft = h * 0.8
	const total = areaTop + areaRight + areaBottom + areaLeft
	let d = Math.random() * total

	if (d < areaTop) {
		const t = Math.random()
		let x = b.left + t * w
		if (Math.random() < 0.24) {
			x = Math.random() < 0.5 ? b.left + rand(0, 90) : b.right - rand(0, 90)
		}
		return { x, y: b.top, normalX: 0, normalY: 1, side: 'top' }
	}

	d -= areaTop
	if (d < areaRight) {
		return {
			x: b.right,
			y: b.bottom + Math.random() * h,
			normalX: 1,
			normalY: 0,
			side: 'right',
		}
	}

	d -= areaRight
	if (d < areaBottom) {
		return {
			x: b.left + Math.random() * w,
			y: b.bottom,
			normalX: 0,
			normalY: -1,
			side: 'bottom',
		}
	}

	return {
		x: b.left,
		y: b.bottom + Math.random() * h,
		normalX: -1,
		normalY: 0,
		side: 'left',
	}
}
