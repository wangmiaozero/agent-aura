/**
 * Agent Aura - shape path helpers for thunder
 *
 * @author wangmiao<tuziling84@gmail.com>
 * @license MIT
 * @repository https://github.com/wangmiaozero/agent-aura
 */

export type Vec2 = { x: number; y: number }

export type PathSample = {
	point: Vec2
	tangent: Vec2
	normal: Vec2
}

export type PathData = {
	path: Vec2[]
	lengths: number[]
	total: number
}

function clamp(v: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, v))
}

function parseRadius(target: HTMLElement, width: number, height: number): number {
	const style = getComputedStyle(target)
	const radius = parseFloat(style.borderTopLeftRadius)
	if (style.borderRadius.includes('%')) return Math.min(width, height) / 2
	return clamp(radius || 0, 0, Math.min(width, height) / 2)
}

function parsePolygon(
	clipPath: string,
	left: number,
	top: number,
	width: number,
	height: number
): Vec2[] | null {
	if (!clipPath || !clipPath.startsWith('polygon(')) return null
	const content = clipPath.replace('polygon(', '').replace(')', '')
	const pairs = content.split(',')
	const points: Vec2[] = []
	for (const pair of pairs) {
		const values = pair.trim().split(/\s+/)
		if (values.length < 2) continue
		const x = values[0].includes('%')
			? left + (parseFloat(values[0]) / 100) * width
			: left + parseFloat(values[0])
		const y = values[1].includes('%')
			? top + (parseFloat(values[1]) / 100) * height
			: top + parseFloat(values[1])
		points.push({ x, y })
	}
	return points.length > 2 ? points : null
}

function expandPolygon(points: Vec2[], offset: number): Vec2[] {
	let cx = 0
	let cy = 0
	for (const p of points) {
		cx += p.x
		cy += p.y
	}
	cx /= points.length
	cy /= points.length
	return points.map((p) => {
		const dx = p.x - cx
		const dy = p.y - cy
		const len = Math.hypot(dx, dy) || 1
		return { x: p.x + (dx / len) * offset, y: p.y + (dy / len) * offset }
	})
}

function createRoundedRectPath(
	left: number,
	top: number,
	width: number,
	height: number,
	radius: number,
	offset: number,
	cornerSegments: number
): Vec2[] {
	const l = left - offset
	const r = left + width + offset
	const t = top - offset
	const b = top + height + offset
	const rad = clamp(radius + offset, 0, Math.min(width, height) / 2 + offset)
	const points: Vec2[] = []

	const arc = (cx: number, cy: number, start: number, end: number) => {
		for (let i = 0; i <= cornerSegments; i++) {
			const a = start + (end - start) * (i / cornerSegments)
			points.push({ x: cx + Math.cos(a) * rad, y: cy + Math.sin(a) * rad })
		}
	}

	// screen y-down: top-left → top-right → bottom-right → bottom-left
	arc(l + rad, t + rad, Math.PI, Math.PI * 1.5)
	arc(r - rad, t + rad, Math.PI * 1.5, Math.PI * 2)
	arc(r - rad, b - rad, 0, Math.PI * 0.5)
	arc(l + rad, b - rad, Math.PI * 0.5, Math.PI)

	return points
}

export function createTargetPath(
	target: HTMLElement,
	viewLeft: number,
	viewTop: number,
	offset: number,
	cornerSegments: number
): Vec2[] {
	const rect = target.getBoundingClientRect()
	const left = rect.left - viewLeft
	const top = rect.top - viewTop
	const style = getComputedStyle(target)
	const polygon = parsePolygon(style.clipPath, left, top, rect.width, rect.height)
	if (polygon) return expandPolygon(polygon, offset)
	const radius = parseRadius(target, rect.width, rect.height)
	return createRoundedRectPath(left, top, rect.width, rect.height, radius, offset, cornerSegments)
}

export function buildPathData(path: Vec2[]): PathData {
	const lengths: number[] = []
	let total = 0
	for (let i = 0; i < path.length; i++) {
		const a = path[i]
		const b = path[(i + 1) % path.length]
		const length = Math.hypot(b.x - a.x, b.y - a.y)
		lengths.push(length)
		total += length
	}
	return { path, lengths, total }
}

export function getPointOnPath(data: PathData, t: number): PathSample {
	const { path, lengths, total } = data
	if (path.length === 0 || total <= 0) {
		return {
			point: { x: 0, y: 0 },
			tangent: { x: 1, y: 0 },
			normal: { x: 0, y: 1 },
		}
	}
	let distance = ((((t % 1) + 1) % 1) * total)
	for (let i = 0; i < lengths.length; i++) {
		if (distance <= lengths[i]) {
			const a = path[i]
			const b = path[(i + 1) % path.length]
			const ratio = lengths[i] > 0 ? distance / lengths[i] : 0
			const point = { x: a.x + (b.x - a.x) * ratio, y: a.y + (b.y - a.y) * ratio }
			const tx = b.x - a.x
			const ty = b.y - a.y
			const len = Math.hypot(tx, ty) || 1
			const tangent = { x: tx / len, y: ty / len }
			const normal = { x: -tangent.y, y: tangent.x }
			return { point, tangent, normal }
		}
		distance -= lengths[i]
	}
	return {
		point: { ...path[0] },
		tangent: { x: 1, y: 0 },
		normal: { x: 0, y: 1 },
	}
}

export function rotateVec(v: Vec2, angle: number): Vec2 {
	const c = Math.cos(angle)
	const s = Math.sin(angle)
	return { x: v.x * c - v.y * s, y: v.x * s + v.y * c }
}

export function randFloat(min: number, max: number): number {
	return min + Math.random() * (max - min)
}
