precision highp float;

uniform vec2 uResolution;
uniform float uPixelRatio;
attribute vec2 aPosition;
attribute float aSize;
attribute float aAlpha;
attribute vec3 aColor;
varying float vAlpha;
varying vec3 vColor;

void main() {
  vAlpha = aAlpha;
  vColor = aColor;
  vec2 clip = vec2(
    (aPosition.x / uResolution.x) * 2.0 - 1.0,
    1.0 - (aPosition.y / uResolution.y) * 2.0
  );
  gl_Position = vec4(clip, 0.0, 1.0);
  gl_PointSize = aSize * uPixelRatio;
}
