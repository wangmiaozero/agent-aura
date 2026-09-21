precision highp float;

uniform float uTime;
uniform float uBurst;
uniform vec3 uColor;
uniform float uIntensity;
varying float vProgress;
varying float vSide;

float hash(float n) {
  return fract(sin(n) * 43758.5453123);
}

float segmentNoise(float progress, float time) {
  float index = floor(progress * 44.0);
  float frame = floor(time * 13.0);
  return hash(index * 17.17 + frame * 31.91);
}

void main() {
  float t = uTime;
  float d = abs(vSide);
  float core = exp(-pow(d * 8.0, 2.0));
  float halo = exp(-pow(d * 2.1, 1.4));
  float noise = segmentNoise(vProgress, t);
  float broken = step(0.18, noise);
  float flash = step(0.88, hash(floor(t * 24.0) + floor(vProgress * 21.0)));
  float scan = step(0.86, sin(vProgress * 150.0 - t * 18.0));

  float corruption = broken * (0.75 + noise * 0.35);
  corruption += uBurst * (flash * 1.2 + scan * 0.65);

  vec3 color = uColor + vec3(1.0) * flash * (0.6 + uBurst);
  float alpha = (core * 0.82 + halo * 0.20) * corruption * uIntensity;
  if (noise < 0.13) alpha = 0.0;

  gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
}
