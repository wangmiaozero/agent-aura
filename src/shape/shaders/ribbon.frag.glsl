precision highp float;

uniform float uTime;
uniform float uOpacity;
uniform float uCoreStrength;
uniform float uHaloStrength;
varying float vProgress;
varying float vSide;

float loopDistance(float a, float b) {
  float d = abs(a - b);
  return min(d, 1.0 - d);
}

float energyBand(float progress, float center, float width) {
  float d = loopDistance(progress, center);
  return 1.0 - smoothstep(0.0, width, d);
}

void main() {
  float t = uTime;

  float b1 = energyBand(vProgress, fract(0.02 + t * 0.052), 0.24);
  float b2 = energyBand(vProgress, fract(0.32 - t * 0.041), 0.18);
  float b3 = energyBand(vProgress, fract(0.63 + t * 0.029), 0.12);
  float b4 = energyBand(vProgress, fract(0.82 - t * 0.067), 0.075);
  float scan = energyBand(vProgress, fract(t * 0.115), 0.018);

  vec3 cyan = vec3(0.16, 0.73, 1.0);
  vec3 blue = vec3(0.20, 0.38, 1.0);
  vec3 purple = vec3(0.68, 0.24, 1.0);
  vec3 pink = vec3(1.0, 0.24, 0.67);
  vec3 white = vec3(0.92, 0.99, 1.0);

  vec3 color = cyan * 0.13;
  color += cyan * b1 * 0.85;
  color += blue * b2 * 0.70;
  color += purple * b3 * 0.85;
  color += pink * b4 * 0.60;
  color += white * scan * 1.5;

  float d = abs(vSide);
  float core = exp(-pow(d * 8.5, 2.0));
  float halo = exp(-pow(d * 2.15, 1.45));
  float breath = 0.88 + sin(t * 1.45) * 0.10;
  float wave = 0.92 + sin(vProgress * 46.0 - t * 2.2) * 0.08;
  color *= breath * wave;

  float alpha = halo * 0.36 * uHaloStrength + core * 0.90 * uCoreStrength;
  alpha += scan * halo * 0.40;
  color += white * scan * core * 0.8;
  alpha *= uOpacity;

  gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
}
