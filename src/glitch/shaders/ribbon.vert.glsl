precision highp float;

uniform vec2 uResolution;
uniform vec2 uOffset;
attribute vec2 aPosition;
attribute float aProgress;
attribute float aSide;
varying float vProgress;
varying float vSide;

void main() {
  vProgress = aProgress;
  vSide = aSide;
  vec2 pos = aPosition + uOffset;
  vec2 clip = vec2(
    (pos.x / uResolution.x) * 2.0 - 1.0,
    1.0 - (pos.y / uResolution.y) * 2.0
  );
  gl_Position = vec4(clip, 0.0, 1.0);
}
