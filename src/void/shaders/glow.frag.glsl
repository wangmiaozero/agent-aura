precision highp float;

uniform float uTime;
uniform float uOpacity;
uniform float uCoreBoost;
uniform float uHaloBoost;
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

  float b1 = band(vProgress, fract(0.03 + t * 0.050), 0.21);
  float b2 = band(vProgress, fract(0.32 - t * 0.040), 0.16);
  float b3 = band(vProgress, fract(0.61 + t * 0.030), 0.10);
  float b4 = band(vProgress, fract(0.86 - t * 0.073), 0.055);
  float scan = band(vProgress, fract(t * 0.110), 0.016);

  vec3 indigo = vec3(0.18, 0.10, 0.60);
  vec3 violet = vec3(0.58, 0.18, 1.00);
  vec3 magenta = vec3(1.00, 0.32, 0.92);
  vec3 blue = vec3(0.30, 0.48, 1.00);
  vec3 white = vec3(0.94, 0.92, 1.00);

  vec3 color = indigo * 0.15;
  color += violet * b1 * 0.78;
  color += blue * b2 * 0.45;
  color += magenta * b3 * 0.75;
  color += white * b4 * 1.20;
  color += white * scan * 1.50;

  float d = abs(vSide);
  float core = exp(-pow(d * 8.0, 2.0));
  float halo = exp(-pow(d * 2.2, 1.45));
  float noiseWave = 0.90 + sin(vProgress * 54.0 - t * 2.6) * 0.08;
  float breath = 0.88 + sin(t * 1.3) * 0.10;
  color *= noiseWave * breath;

  float alpha = halo * 0.38 * uHaloBoost + core * 0.88 * uCoreBoost;
  alpha += scan * halo * 0.42;
  color += white * scan * core * 0.7;

  gl_FragColor = vec4(color, clamp(alpha * uOpacity, 0.0, 1.0));
}
