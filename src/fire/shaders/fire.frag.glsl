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

vec3 linearToSrgb(vec3 c) {
	vec3 higher = 1.055 * pow(max(c, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055;
	vec3 lower = c * 12.92;
	bvec3 cutoff = lessThan(c, vec3(0.0031308));
	return vec3(
		cutoff.x ? lower.x : higher.x,
		cutoff.y ? lower.y : higher.y,
		cutoff.z ? lower.z : higher.z
	);
}

void main() {
	vec2 uv = gl_PointCoord - vec2(0.5);
	uv.x *= 1.35;
	uv.y *= 0.82;

	float dist = length(uv);
	float outer = 1.0 - smoothstep(uOuterStart, uOuterEnd, dist);
	float core = 1.0 - smoothstep(0.0, 0.18, dist);

	vec3 color = vColor + core * vec3(0.45, 0.22, 0.05) * uCoreBoost;
	float alpha = outer * vAlpha;

	if (alpha < 0.01) discard;
	vec3 srgb = linearToSrgb(color);
	outColor = vec4(srgb * alpha, alpha);
}
