/**
 * Agent Aura
 *
 * @author wangmiao<tuziling84@gmail.com>
 * @license MIT
 */

#version 300 es
precision mediump float;

in vec2 vUv;
uniform float uTime;
out vec4 outColor;

void main() {
	vec2 center = vec2(0.5, 0.48);
	float dist = distance(vUv, center);
	float pulse = 0.5 + 0.5 * sin(uTime * 2.2);

	float redAura = smoothstep(0.7, 0.12, dist) * 0.12;
	float coreAura = smoothstep(0.36, 0.0, dist) * (0.06 + pulse * 0.05);

	vec3 color = vec3(
		redAura + coreAura,
		redAura * 0.22 + coreAura * 0.18,
		redAura * 0.06
	);

	float alpha = max(color.r, max(color.g, color.b));
	if (alpha < 0.004) discard;
	outColor = vec4(color, alpha);
}
