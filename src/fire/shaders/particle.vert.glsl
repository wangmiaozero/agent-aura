/**
 * Agent Aura
 *
 * @author wangmiao<tuziling84@gmail.com>
 * @license MIT
 */

#version 300 es

in vec3 aPosition;
in vec3 aColor;
in float aSize;
in float aAlpha;

uniform vec2 uResolution;
uniform float uPixelRatio;

out vec3 vColor;
out float vAlpha;

void main() {
	vColor = aColor;
	vAlpha = aAlpha;
	vec2 clip = (aPosition.xy / uResolution) * 2.0 - 1.0;
	gl_Position = vec4(clip, 0.0, 1.0);
	gl_PointSize = max(aSize * uPixelRatio, 1.0);
}
