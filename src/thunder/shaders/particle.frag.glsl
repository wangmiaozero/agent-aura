precision highp float;

void main() {
  vec2 p = gl_PointCoord - 0.5;
  float d = length(p);
  float alpha = 1.0 - smoothstep(0.05, 0.5, d);
  vec3 color = mix(vec3(0.40, 0.22, 1.0), vec3(0.86, 0.80, 1.0), 1.0 - d);
  gl_FragColor = vec4(color, alpha);
}
