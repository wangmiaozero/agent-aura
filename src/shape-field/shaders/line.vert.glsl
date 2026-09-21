precision highp float;

uniform vec2 uResolution;
attribute vec2 aPosition;
attribute float aProgress;
varying float vProgress;

void main() {
  vProgress = aProgress;
  vec2 clip = vec2(
    (aPosition.x / uResolution.x) * 2.0 - 1.0,
    1.0 - (aPosition.y / uResolution.y) * 2.0
  );
  gl_Position = vec4(clip, 0.0, 1.0);
}
