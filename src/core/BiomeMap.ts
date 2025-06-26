export class BiomeMap {
        /**
         * Classify a biome based on temperature, pressure and elevation.
         * This mirrors the logic used in the fragment shader so that
         * the textual biome matches the colours rendered on the planet.
         */
        get(temperature: number, pressure: number, elevation: number): string {
                if (elevation < 0.1) return 'Ocean'
                if (temperature < -15) return 'Ice cap'
                if (temperature < 0) return 'Tundra'
                if (pressure < 0.4) return 'Highlands'
                if (temperature < 20) return 'Forest'
                if (temperature < 35) return 'Savanna'
                return 'Burnt desert'
        }
}
