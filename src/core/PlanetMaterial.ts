import * as THREE from 'three'

export interface PlanetMaterialOptions {
        seaLevel: number
        equatorTemp: number
}

export class PlanetMaterial extends THREE.ShaderMaterial {
        constructor(options: PlanetMaterialOptions) {
                super({
                        uniforms: {
                                time: { value: 0 },
                                elevationScale: { value: 0.2 },
                                obliquity: { value: 0.41 }, // ~23.5 degrees
                                seed: { value: Math.random() * 1000 },
                                seaLevel: { value: options.seaLevel },
                                equatorTemp: { value: options.equatorTemp }
                        },
                        vertexShader,
                        fragmentShader,
                })
        }

	update(time: number) {
		this.uniforms.time.value = time
	}
}

const vertexShader = /* glsl */ `
uniform float elevationScale;
uniform float obliquity;
uniform float seed;
uniform float seaLevel;
uniform float equatorTemp;

varying vec3 vNormal;
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

  float elevation = fbm(displaced * 2.5);
  elevation = elevation * 0.8 - 0.2; // shift average downward
  elevation = max(elevation, 0.0);  // remove any below-sea "holes"
  float land = max(elevation - seaLevel, 0.0);
  displaced *= 1.0 + land * elevationScale;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);

  vNormal = normalMatrix * normal;
  vElevation = elevation;
  vLatitude = displaced.y; // sin(lat) in range [-1, 1]
}
`;

const fragmentShader = /* glsl */ `
varying vec3 vNormal;
varying float vElevation;
varying float vLatitude;
uniform float seaLevel;
uniform float equatorTemp;

vec3 biomeColor(float temp, float pressure, float elevation) {
  if (elevation < seaLevel) return vec3(0.1, 0.2, 0.5); // Ocean
  if (temp < -15.0) return vec3(0.85, 0.9, 1.0);   // Ice cap
  if (temp < 0.0) return vec3(0.7, 0.85, 0.95);    // Tundra
  if (pressure < 0.4) return vec3(0.6, 0.5, 0.4);  // Highlands
  if (temp < 20.0) return vec3(0.2, 0.7, 0.3);     // Forest
  if (temp < 35.0) return vec3(0.95, 0.8, 0.4);    // Savanna
  return vec3(0.9, 0.3, 0.1);                      // Burnt desert
}

void main() {
  float lat = clamp(vLatitude, -1.0, 1.0);
  float baseTemp = equatorTemp * (1.0 - abs(lat));
  float temp = baseTemp - vElevation * 65.0;
  float pressure = exp(-vElevation * 6.0);

  vec3 color = biomeColor(temp, pressure, vElevation);

  float light = dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)) * 0.5 + 0.5;
  gl_FragColor = vec4(color * light, 1.0);
}
`;
