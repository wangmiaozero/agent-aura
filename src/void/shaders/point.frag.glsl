precision highp float;

varying float vAlpha;
varying vec3 vColor;

void main() {
  vec2 p = gl_PointCoord - 0.5;
  float d = length(p);
  float alpha = 1.0 - smoothstep(0.04, 0.5, d);
  float core = 1.0 - smoothstep(0.0, 0.14, d);
  vec3 color = vColor + vec3(core * 0.18);
  gl_FragColor = vec4(color, alpha * vAlpha);
}
