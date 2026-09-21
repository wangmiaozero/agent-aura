precision highp float;

uniform float uTime;
uniform float uOpacity;
varying float vProgress;
varying float vSide;

float loopDistance(float a, float b) {
  float d = abs(a - b);
  return min(d, 1.0 - d);
}

float band(float p, float center, float width) {
  float d = loopDistance(p, center);
  return 1.0 - smoothstep(0.0, width, d);
}

void main() {
  float t = uTime;
  float d = abs(vSide);

  float haze = exp(-pow(d * 1.9, 1.4));
  float edge = exp(-pow(d * 4.0, 2.0));

  float r1 = band(vProgress, fract(0.18 + t * 0.032), 0.22);
  float r2 = band(vProgress, fract(0.67 - t * 0.028), 0.18);
  float r3 = band(vProgress, fract(0.86 + t * 0.045), 0.07);

  vec3 blackPurple = vec3(0.04, 0.02, 0.08);
  vec3 deepVoid = vec3(0.08, 0.03, 0.14);
  vec3 violet = vec3(0.26, 0.07, 0.42);

  vec3 color = blackPurple * 0.85;
  color += deepVoid * haze * 0.55;
  color += violet * edge * (r1 * 0.38 + r2 * 0.25 + r3 * 0.45);

  float pulse = 0.85 + sin(t * 1.1) * 0.08;
  color *= pulse;

  float alpha = haze * 0.34 + edge * 0.12 * (r1 + r2 + r3);
  gl_FragColor = vec4(color, alpha * uOpacity);
}
