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

void main() {
	vec2 uv = gl_PointCoord - vec2(0.5);
	float dist = length(uv);
	float alpha = (1.0 - smoothstep(0.0, 0.5, dist)) * vAlpha;
	if (alpha < 0.01) discard;
	outColor = vec4(vColor, alpha);
}
