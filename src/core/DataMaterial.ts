import * as THREE from 'three'

export class DataMaterial extends THREE.ShaderMaterial {
        constructor(equatorTemp: number, seaLevel: number) {
                super({
                        uniforms: {
                                elevationScale: { value: 0.2 },
                                obliquity: { value: 0.41 },
                                seed: { value: Math.random() * 1000 },
                                equatorTemp: { value: equatorTemp },
                                seaLevel: { value: seaLevel }
                        },
                        vertexShader,
                        fragmentShader,
                })
        }
}

const vertexShader = /* glsl */`
uniform float elevationScale;
uniform float obliquity;
uniform float seed;
uniform float equatorTemp;
uniform float seaLevel;

varying float vElevation;
varying float vLatitude;

float hash(vec3 p) {
  return fract(sin(dot(p + seed, vec3(127.1, 311.7, 74.7))) * 43758.5453);
}

float valueNoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);

  float a = hash(i);
  float b = hash(i + vec3(1, 0, 0));
  float c = hash(i + vec3(0, 1, 0));
  float d = hash(i + vec3(1, 1, 0));
  float e = hash(i + vec3(0, 0, 1));
  float f1 = hash(i + vec3(1, 0, 1));
  float g = hash(i + vec3(0, 1, 1));
  float h = hash(i + vec3(1, 1, 1));

  vec3 u = f * f * (3.0 - 2.0 * f);

  return mix(
    mix(mix(a, b, u.x), mix(c, d, u.x), u.y),
    mix(mix(e, f1, u.x), mix(g, h, u.x), u.y),
    u.z
  );
}

float fbm(vec3 p) {
  float total = 0.0;
  float freq = 1.0;
  float amp = 1.0;
  for (int i = 0; i < 5; i++) {
    total += valueNoise(p * freq) * amp;
    freq *= 2.0;
    amp *= 0.5;
  }
  return total;
}

mat3 rotationY(float angle) {
  float s = sin(angle), c = cos(angle);
  return mat3(
    c, 0.0, s,
    0.0, 1.0, 0.0,
    -s, 0.0, c
  );
}

void main() {
  vec3 displaced = normalize(position);
  displaced = rotationY(obliquity) * displaced;

  float elevation = max(fbm(displaced * 2.5) * 0.8 - 0.2, 0.0);
  float land = max(elevation - seaLevel, 0.0);
  displaced *= 1.0 + land * elevationScale;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  vElevation = elevation;
  vLatitude = displaced.y;
}
`;

const fragmentShader = /* glsl */`
varying float vElevation;
varying float vLatitude;

void main() {
  float lat = clamp(vLatitude, -1.0, 1.0);
  float baseTemp = equatorTemp * (1.0 - abs(lat));
  float temp = baseTemp - vElevation * 65.0;
  float pressure = exp(-vElevation * 6.0);

  // Encode elevation, temp, pressure to RGB (normalize ranges)
  gl_FragColor = vec4(
    clamp(vElevation, 0.0, 1.0),             // Red: elevation
    clamp((temp + 50.0) / 100.0, 0.0, 1.0),  // Green: temp from -50 to +50
    clamp(pressure, 0.0, 1.0),               // Blue: pressure (0–1)
    1.0
  );
}
`;
