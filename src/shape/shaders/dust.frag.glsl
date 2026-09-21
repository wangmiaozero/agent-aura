precision highp float;

varying float vAlpha;

void main() {
  vec2 p = gl_PointCoord - 0.5;
  float d = length(p);
  float alpha = 1.0 - smoothstep(0.02, 0.5, d);
  vec3 color = mix(
    vec3(0.15, 0.46, 1.0),
    vec3(0.70, 0.94, 1.0),
    1.0 - d
  );
  gl_FragColor = vec4(color, alpha * vAlpha);
}
