/**
 * Agent Aura
 *
 * @author wangmiao<tuziling84@gmail.com>
 * @license MIT
 */

#version 300 es
precision mediump float;

in vec3 vColor;
in float vAlpha;
out vec4 outColor;

uniform float uCoreBoost;
uniform float uOuterStart;
uniform float uOuterEnd;

void main() {
	vec2 uv = gl_PointCoord - vec2(0.5);
	uv.x *= 1.35;
	uv.y *= 0.82;

	float dist = length(uv);
	float outer = 1.0 - smoothstep(uOuterStart, uOuterEnd, dist);
	float core = 1.0 - smoothstep(0.0, 0.18, dist);

	vec3 color = vColor + core * vec3(0.35, 0.18, 0.05) * uCoreBoost;
	float alpha = outer * vAlpha;

	if (alpha < 0.01) discard;
	outColor = vec4(color, alpha);
}
