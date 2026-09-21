precision highp float;

varying float vAlpha;
varying vec3 vColor;

void main() {
  vec2 p = gl_PointCoord - 0.5;
  float edge = max(abs(p.x), abs(p.y));
  float alpha = 1.0 - smoothstep(0.35, 0.5, edge);
  gl_FragColor = vec4(vColor, alpha * vAlpha);
}
