/**
 * Agent Aura - DOM helpers for one-call attach
 *
 * @author wangmiao<tuziling84@gmail.com>
 * @license MIT
 * @repository https://github.com/wangmiaozero/agent-aura
 */

export type TargetRef = string | HTMLElement

export type AttachOptions<T extends { target?: unknown; container?: unknown }> = Omit<
	T,
	'target' | 'container'
> & {
	container?: TargetRef
}

export function resolveTarget(target: TargetRef, label = 'target'): HTMLElement {
	if (target instanceof HTMLElement) return target
	const el = document.querySelector(target)
	if (!(el instanceof HTMLElement)) {
		throw new Error(`agent-aura: ${label} not found: ${String(target)}`)
	}
	return el
}

export function resolveOptional(target?: TargetRef, label = 'container'): HTMLElement | undefined {
	if (!target) return undefined
	return resolveTarget(target, label)
}

export function ensurePositioned(el: HTMLElement): void {
	const position = getComputedStyle(el).position
	if (position === 'static') el.style.position = 'relative'
}
