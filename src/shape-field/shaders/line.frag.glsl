precision highp float;

uniform float uTime;
uniform float uOpacity;
uniform float uMode;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;
varying float vProgress;

float distanceLoop(float a, float b) {
  float d = abs(a - b);
  return min(d, 1.0 - d);
}

float lightBand(float p, float center, float width) {
  float d = distanceLoop(p, center);
  return 1.0 - smoothstep(0.0, width, d);
}

void main() {
  float time = uTime;

  float e1 = lightBand(vProgress, fract(time * 0.052), 0.24);
  float e2 = lightBand(vProgress, fract(0.30 - time * 0.039), 0.16);
  float e3 = lightBand(vProgress, fract(0.67 + time * 0.028), 0.09);
  float e4 = lightBand(vProgress, fract(0.88 - time * 0.075), 0.035);

  float wave = sin(vProgress * 40.0 - time * 2.5);
  float shimmer = 0.88 + wave * 0.12;

  vec3 color = uColor1 * 0.22;
  color += uColor2 * e1 * 0.72;
  color += uColor3 * e2 * 0.68;
  color += uColor2 * e3 * 0.44;
  color += uColor4 * e4 * 1.35;

  // water — softer pulse
  if (uMode < 0.5) {
    color *= 0.90 + sin(vProgress * 22.0 + time * 3.0) * 0.08;
  }

  // demonic — flicker
  if (uMode > 1.5) {
    color *= 0.82 + abs(sin(vProgress * 17.0 - time * 4.5)) * 0.23;
  }

  color *= shimmer;

  float alpha = 0.23 + e1 * 0.28 + e2 * 0.24 + e3 * 0.18 + e4 * 0.72;
  gl_FragColor = vec4(color, alpha * uOpacity);
}
