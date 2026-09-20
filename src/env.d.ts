declare module '*.glsl' {
	const content: string
	export default content
}

declare module '*.module.css' {
	const classes: Record<string, string>
	export default classes
}

declare const __AGENT_AURA_VERSION__: string
