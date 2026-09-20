/**
 * Agent Aura - WebGL2 visual effects for Agent UIs
 *
 * @author wangmiao<tuziling84@gmail.com>
 * @license MIT
 * @repository https://github.com/wangmiaozero/agent-aura
 */

let greeted = false

export function greet(label = 'agent-aura'): void {
	if (greeted) return
	greeted = true
	console.log(
		`%c✨ ${label} ${__AGENT_AURA_VERSION__} ✨`,
		'background: linear-gradient(90deg, #39b6ff, #bd45fb, #ff5733, #ff7b22); color: white; text-shadow: 0 0 2px rgba(0, 0, 0, 0.2); font-weight: bold; font-size: 1em; padding: 2px 12px; border-radius: 6px;'
	)
}
