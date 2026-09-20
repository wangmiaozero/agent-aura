/**
 * Agent Aura - continuous energy-field border
 *
 * @author wangmiao<tuziling84@gmail.com>
 * @license MIT
 */

#version 300 es
precision highp float;

in vec2 vUv;
out vec4 outColor;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uCardSize;
uniform float uBorderWidth;
uniform float uGlowWidth;
uniform float uRadius;

#define PI 3.14159265359
#define TAU 6.28318530718

float sdRoundBox(vec2 p, vec2 halfSize, float radius) {
	vec2 q = abs(p) - halfSize + radius;
	return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - radius;
}

float angularDistance(float a, float b) {
	float d = abs(a - b);
	return min(d, TAU - d);
}

float movingLight(float angle, float center, float width) {
	float d = angularDistance(angle, center);
	return 1.0 - smoothstep(0.0, width, d);
}

float hash(vec2 p) {
	return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

void main() {
	vec2 pixel = vUv * uResolution;
	vec2 p = pixel - uResolution * 0.5;
	vec2 halfCard = uCardSize * 0.5;

	float d = sdRoundBox(p, halfCard, uRadius);
	float dist = abs(d);

	float aa = max(fwidth(d), 0.8);
	float border = 1.0 - smoothstep(uBorderWidth, uBorderWidth + aa, dist);

	float glow = exp(-pow(dist / uGlowWidth, 1.45) * 3.1);
	if (d > 0.0) {
		glow *= 0.78;
	}
	if (d < -uGlowWidth * 1.55) {
		glow *= 1.0 - smoothstep(uGlowWidth * 1.55, uGlowWidth * 2.3, -d);
	}

	float angle = mod(atan(p.y, p.x) + TAU, TAU);
	float time = uTime;

	float l1 = movingLight(angle, mod(0.20 - time * 0.52, TAU), 2.4);
	float l2 = movingLight(angle, mod(2.70 - time * 0.43, TAU), 1.8);
	float l3 = movingLight(angle, mod(4.30 + time * 0.38, TAU), 1.25);
	float l4 = movingLight(angle, mod(5.40 + time * 0.61, TAU), 0.72);

	vec3 cyan = vec3(0.20, 0.72, 1.0);
	vec3 purple = vec3(0.72, 0.25, 1.0);
	vec3 orange = vec3(1.0, 0.24, 0.10);
	vec3 yellow = vec3(1.0, 0.78, 0.10);

	vec3 glowColor = cyan * l1 + purple * l2 * 0.92 + orange * l3 * 0.78 + yellow * l4 * 0.72;
	glowColor *= 0.82 + sin(time * 1.35) * 0.10;

	vec3 borderColor = cyan * 0.42 + glowColor * 0.78;

	float whiteLight = movingLight(angle, mod(time * 1.05, TAU), 0.18);
	vec3 whiteEnergy = vec3(0.82, 0.96, 1.0) * whiteLight;
	borderColor += whiteEnergy * 1.6;
	glowColor += whiteEnergy * 0.55;

	float noise = hash(floor(pixel * 0.45) + floor(time * 14.0));
	glowColor *= 0.94 + noise * 0.06;

	vec3 finalColor = glowColor * glow * 0.72;
	finalColor = mix(finalColor, borderColor + glowColor * 0.32, border);

	float alpha = glow * 0.48 + border * 0.92;
	alpha += whiteLight * glow * 0.24;

	float farFade = 1.0 - smoothstep(uGlowWidth * 1.05, uGlowWidth * 1.75, dist);
	alpha *= farFade;
	alpha = clamp(alpha, 0.0, 1.0);
	finalColor = clamp(finalColor, 0.0, 1.25);

	outColor = vec4(finalColor, alpha);
}
