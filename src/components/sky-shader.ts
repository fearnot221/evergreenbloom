/**
 * Spring-sky fragment shader: vertical gradient, two drifting fbm cloud bands and three
 * parallax layers of falling petals. Raw WebGL2, no Three.js, about 2 KB.
 */
export const vertexShader = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

export const fragmentShader = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uPointer;
uniform vec3 uHigh;
uniform vec3 uMid;
uniform vec3 uLow;
uniform vec3 uCloud;
uniform vec3 uPetal;
uniform vec3 uPetalDeep;
out vec4 outColor;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
vec2 hash2(vec2 p) {
  return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + 11.7; a *= 0.5; }
  return v;
}
mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  vec3 col = mix(uLow, uMid, smoothstep(0.0, 0.55, uv.y));
  col = mix(col, uHigh, smoothstep(0.42, 1.0, uv.y));

  // Two cloud bands, low and high, drifting slowly; the pointer nudges them a little.
  vec2 drift = vec2(uTime * 0.012, 0.0) + uPointer * 0.025;
  float lowBand = 1.0 - smoothstep(0.0, 0.32, abs(uv.y - 0.2));
  float highBand = 1.0 - smoothstep(0.0, 0.18, abs(uv.y - 0.82));
  float n = fbm(p * 2.1 + drift) * 0.7 + fbm(p * 4.3 - drift * 1.6 + 3.1) * 0.35;
  float clouds = smoothstep(0.52, 0.86, n + lowBand * 0.32 + highBand * 0.2 - 0.12);
  float shade = smoothstep(0.55, 0.95, fbm(p * 2.1 + drift + vec2(0.0, 0.06)));
  vec3 cloudCol = mix(uCloud, mix(uCloud, uMid, 0.45), shade * 0.5);
  col = mix(col, cloudCol, clouds * 0.9);

  // Petals: three layers, nearer ones larger, faster and moved more by the pointer.
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float scale = 9.0 - fi * 2.6;
    vec2 q = p * scale;
    q.y += uTime * (0.22 + fi * 0.1);
    q.x += sin(q.y * 0.45 + uTime * 0.4 + fi * 2.0) * 0.4 + uPointer.x * (0.25 + fi * 0.35);
    vec2 cell = floor(q);
    vec2 f = fract(q) - 0.5;
    float h = hash(cell + fi * 17.0);
    if (h < 0.78) continue;
    f -= (hash2(cell + fi) - 0.5) * 0.45;
    f = rot(uTime * (0.5 + h) + h * 6.283) * f;
    float r = 0.13 + fi * 0.025;
    float body = 1.0 - smoothstep(r - 0.03, r, length(f * vec2(1.0, 1.65)));
    float notch = 1.0 - smoothstep(0.02, 0.045, length(f - vec2(0.0, r * 0.62)));
    float petal = body * (1.0 - notch);
    vec3 petalCol = mix(uPetalDeep, uPetal, smoothstep(0.0, r, length(f)));
    col = mix(col, petalCol, petal * (0.55 + fi * 0.2));
  }

  // Paper grain.
  col += (hash(gl_FragCoord.xy + fract(uTime) * 91.0) - 0.5) * 0.018;
  outColor = vec4(col, 1.0);
}`;
