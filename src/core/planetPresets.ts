export type PlanetType = 'earth' | 'ice' | 'burnt' | 'moon' | 'gas'

export interface PlanetPreset {
  seaLevel: number
  equatorTemp: number
}

export const PlanetPresets: Record<PlanetType, PlanetPreset> = {
  earth: { seaLevel: 0.12, equatorTemp: 30 },
  ice: { seaLevel: 0.15, equatorTemp: 0 },
  burnt: { seaLevel: 0.03, equatorTemp: 60 },
  moon: { seaLevel: 0.0, equatorTemp: 5 },
  gas: { seaLevel: 0.8, equatorTemp: 120 }
}
