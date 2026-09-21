precision highp float;

uniform float uTime;
varying float vProgress;

float pulse(float x) {
  return pow(max(0.0, sin(x)), 8.0);
}

void main() {
  float p1 = pulse(vProgress * 32.0 - uTime * 8.0);
  float p2 = pulse(vProgress * 19.0 + uTime * 5.0 + 2.0);
  float energy = 0.32 + p1 * 0.8 + p2 * 0.45;
  vec3 purple = vec3(0.34, 0.18, 1.0);
  vec3 blue = vec3(0.28, 0.56, 1.0);
  vec3 white = vec3(0.94, 0.92, 1.0);
  vec3 color = mix(purple, blue, p2);
  color = mix(color, white, p1);
  gl_FragColor = vec4(color, energy);
}
