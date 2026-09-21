precision highp float;

uniform vec2 uResolution;
attribute vec2 aPosition;
attribute float aProgress;
attribute float aSide;
varying float vProgress;
varying float vSide;

void main() {
  vProgress = aProgress;
  vSide = aSide;
  vec2 clip = vec2(
    (aPosition.x / uResolution.x) * 2.0 - 1.0,
    1.0 - (aPosition.y / uResolution.y) * 2.0
  );
  gl_Position = vec4(clip, 0.0, 1.0);
}
