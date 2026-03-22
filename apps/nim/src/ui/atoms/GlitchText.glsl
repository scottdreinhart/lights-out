precision highp float;

uniform sampler2D texture;
uniform vec2 resolution;
uniform float intensity;
uniform float time;

varying vec2 vUv;

float rand(vec2 co) {
  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 uv = vUv;
  float jitter = (rand(vec2(time)) - 0.5) * intensity;
  
  float r = texture2D(texture, uv + vec2(jitter, 0.0)).r;
  float g = texture2D(texture, uv).g;
  float b = texture2D(texture, uv - vec2(jitter, 0.0)).b;
  
  gl_FragColor = vec4(r, g, b, 1.0);
}
