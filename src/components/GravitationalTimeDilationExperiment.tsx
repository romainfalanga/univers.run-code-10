import React, { useState } from 'react';
import { Clock, AlertTriangle, Info } from 'lucide-react';
import { Slider } from './Slider';
import {
  calculateSchwarzschildRadius,
  calculateTimeDilationAtSurface,
  calculateTimeDilationAtCenter,
  calculateDensity,
  formatMass,
  formatRadius,
  formatDensity,
  formatTime,
  CELESTIAL_PRESETS,
  EARTH_MASS,
  EARTH_RADIUS,
} from '../utils/physics';
import { TimeDilationChart } from './TimeDilationChart';
import { CelestialBodyVisualization } from './CelestialBodyVisualization';

export const GravitationalTimeDilationExperiment: React.FC = () => {
  const [mass, setMass] = useState<number>(EARTH_MASS);
  const [radius, setRadius] = useState<number>(EARTH_RADIUS);
  const [referenceTime, setReferenceTime] = useState<number>(86400);

  const schwarzschildRadius = calculateSchwarzschildRadius(mass);
  const density = calculateDensity(mass, radius);
  const isBlackHole = radius <= schwarzschildRadius;
  const isNearBlackHole = radius < schwarzschildRadius * 1.5 && radius > schwarzschildRadius;

  const dilationAtSurface = calculateTimeDilationAtSurface(mass, radius);
  const dilationAtCenter = calculateTimeDilationAtCenter(mass, radius);

  const timeAtInfinity = referenceTime;
  const timeAtSurface = referenceTime * dilationAtSurface;
  const timeAtCenter = referenceTime * dilationAtCenter;

  const ageDifferenceInfinitySurface = timeAtInfinity - timeAtSurface;
  const ageDifferenceInfinityCenter = timeAtInfinity - timeAtCenter;
  const ageDifferenceSurfaceCenter = timeAtSurface - timeAtCenter;

  const handlePresetClick = (preset: typeof CELESTIAL_PRESETS[0]) => {
    setMass(preset.mass);
    setRadius(preset.radius);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-2xl border border-white/20">
        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          Configuration de l'Astre
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-6">
          {CELESTIAL_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handlePresetClick(preset)}
              className="px-3 py-2 bg-gradient-to-r from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 text-gray-800 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 border border-blue-200/50 shadow-sm"
            >
              {preset.name}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Masse de l'astre
            </label>
            <Slider
              value={mass}
              min={EARTH_MASS * 0.1}
              max={EARTH_MASS * 1000000}
              step={EARTH_MASS * 0.1}
              onChange={setMass}
              className="w-full h-3"
            />
            <div className="text-sm text-gray-600 mt-2 font-medium bg-white/60 p-2 rounded-md border border-gray-200/50">
              {formatMass(mass)}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Rayon de l'astre
            </label>
            <Slider
              value={radius}
              min={1}
              max={EARTH_RADIUS * 200}
              step={10}
              onChange={setRadius}
              className="w-full h-3"
            />
            <div className="text-sm text-gray-600 mt-2 font-medium bg-white/60 p-2 rounded-md border border-gray-200/50">
              {formatRadius(radius)}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Durée de référence (observateur lointain)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              <button
                onClick={() => setReferenceTime(3600)}
                className="px-3 py-2 bg-gradient-to-r from-green-100 to-green-50 hover:from-green-200 hover:to-green-100 text-green-800 rounded-lg text-xs font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 border border-green-200/50 shadow-sm"
              >
                1 heure
              </button>
              <button
                onClick={() => setReferenceTime(86400)}
                className="px-3 py-2 bg-gradient-to-r from-blue-100 to-blue-50 hover:from-blue-200 hover:to-blue-100 text-blue-800 rounded-lg text-xs font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 border border-blue-200/50 shadow-sm"
              >
                1 jour
              </button>
              <button
                onClick={() => setReferenceTime(2592000)}
                className="px-3 py-2 bg-gradient-to-r from-purple-100 to-purple-50 hover:from-purple-200 hover:to-purple-100 text-purple-800 rounded-lg text-xs font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 border border-purple-200/50 shadow-sm"
              >
                1 mois
              </button>
              <button
                onClick={() => setReferenceTime(31536000)}
                className="px-3 py-2 bg-gradient-to-r from-orange-100 to-orange-50 hover:from-orange-200 hover:to-orange-100 text-orange-800 rounded-lg text-xs font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 border border-orange-200/50 shadow-sm"
              >
                1 an
              </button>
            </div>
            <input
              type="number"
              value={referenceTime}
              onChange={(e) => setReferenceTime(Number(e.target.value) || 86400)}
              min="1"
              step="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm transition-all duration-200 bg-white/90 hover:bg-white focus:bg-white shadow-sm"
              placeholder="Durée en secondes..."
            />
            <div className="text-xs text-gray-500 mt-1">
              {formatTime(referenceTime)}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200/50">
            <div className="text-xs font-semibold text-gray-600 mb-1">Densité</div>
            <div className="text-sm font-bold text-gray-800">{formatDensity(density)}</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200/50">
            <div className="text-xs font-semibold text-gray-600 mb-1">Rayon de Schwarzschild</div>
            <div className="text-sm font-bold text-gray-800">
              {schwarzschildRadius < 1000
                ? `${schwarzschildRadius.toFixed(3)} km`
                : `${(schwarzschildRadius / 1000).toFixed(2)} × 10³ km`}
            </div>
          </div>
          <div className="bg-gradient-to-br from-pink-50 to-red-50 p-4 rounded-lg border border-pink-200/50">
            <div className="text-xs font-semibold text-gray-600 mb-1">Ratio R/Rs</div>
            <div className="text-sm font-bold text-gray-800">
              {(radius / schwarzschildRadius).toFixed(2)}
            </div>
          </div>
        </div>

        {isBlackHole && (
          <div className="mt-4 bg-red-100 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-red-800 mb-1">Trou Noir Formé</h3>
                <p className="text-xs text-red-700 leading-relaxed">
                  Le rayon de l'astre est inférieur ou égal au rayon de Schwarzschild. Un horizon
                  des événements s'est formé. Les calculs de dilatation temporelle à l'intérieur ne
                  sont plus valides avec la métrique de Schwarzschild standard.
                </p>
              </div>
            </div>
          </div>
        )}

        {isNearBlackHole && !isBlackHole && (
          <div className="mt-4 bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-yellow-800 mb-1">
                  Configuration Extrême
                </h3>
                <p className="text-xs text-yellow-700 leading-relaxed">
                  L'astre est très proche de son rayon de Schwarzschild. Les effets gravitationnels
                  sont extrêmes. Cette configuration correspond à des objets ultra-compacts comme
                  les étoiles à neutrons proches de leur limite de stabilité.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CelestialBodyVisualization
          radius={radius}
          schwarzschildRadius={schwarzschildRadius}
          isBlackHole={isBlackHole}
        />

        <TimeDilationChart mass={mass} radius={radius} />
      </div>

      {!isBlackHole && (
        <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-2xl border border-white/20">
          <div className="flex items-center mb-4">
            <Clock className="w-6 h-6 text-purple-600 mr-3" />
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Comparaison des Observateurs
            </h2>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-gray-800">Observateur Lointain (∞)</h3>
                <div className="text-xs text-gray-600 bg-white/60 px-2 py-1 rounded">
                  Facteur: 1.00
                </div>
              </div>
              <div className="text-lg font-bold text-green-700">{formatTime(timeAtInfinity)}</div>
              <p className="text-xs text-gray-600 mt-1">
                Temps de référence, loin de tout champ gravitationnel
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-gray-800">Observateur à la Surface</h3>
                <div className="text-xs text-gray-600 bg-white/60 px-2 py-1 rounded">
                  Facteur: {dilationAtSurface.toFixed(6)}
                </div>
              </div>
              <div className="text-lg font-bold text-blue-700">{formatTime(timeAtSurface)}</div>
              <p className="text-xs text-gray-600 mt-1">
                Temps propre écoulé sur la surface de l'astre
              </p>
              {dilationAtSurface < 0.999 && (
                <div className="mt-2 text-xs text-blue-600 bg-blue-100/50 p-2 rounded">
                  <strong>Différence:</strong> Vieillit de {formatTime(ageDifferenceInfinitySurface)}{' '}
                  de moins que l'observateur lointain
                </div>
              )}
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border-l-4 border-purple-500">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-gray-800">Observateur au Centre</h3>
                <div className="text-xs text-gray-600 bg-white/60 px-2 py-1 rounded">
                  Facteur: {dilationAtCenter.toFixed(6)}
                </div>
              </div>
              <div className="text-lg font-bold text-purple-700">{formatTime(timeAtCenter)}</div>
              <p className="text-xs text-gray-600 mt-1">
                Temps propre écoulé au centre de l'astre
              </p>
              {dilationAtCenter < 0.999 && (
                <div className="mt-2 text-xs text-purple-600 bg-purple-100/50 p-2 rounded space-y-1">
                  <div>
                    <strong>Différence (vs ∞):</strong> Vieillit de{' '}
                    {formatTime(ageDifferenceInfinityCenter)} de moins que l'observateur lointain
                  </div>
                  <div>
                    <strong>Différence (vs surface):</strong> Vieillit de{' '}
                    {formatTime(ageDifferenceSurfaceCenter)} de moins que l'observateur en surface
                  </div>
                </div>
              )}
            </div>
          </div>

          {dilationAtSurface > 0.999 && dilationAtCenter > 0.999 && (
            <div className="mt-4 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    Les effets de dilatation temporelle sont négligeables pour cette configuration.
                    Augmentez la masse ou réduisez le rayon pour observer des effets plus
                    significatifs.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 sm:p-6 rounded-xl border border-indigo-200/50 shadow-lg">
        <h3 className="text-lg font-bold text-indigo-800 mb-3">
          Comprendre les Résultats
        </h3>
        <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
          <p>
            <strong className="text-indigo-700">Métrique de Schwarzschild extérieure:</strong> Pour
            l'observateur à la surface, le facteur de dilatation est donné par dτ/dt = √(1 - 2GM/rc²),
            où M est la masse, r le rayon, G la constante gravitationnelle et c la vitesse de la
            lumière.
          </p>
          <p>
            <strong className="text-indigo-700">Solution intérieure de Schwarzschild:</strong> Pour
            l'observateur au centre d\'une sphère de densité uniforme, le facteur est dτ/dt = (3/2)√(1 -
            2GM/R) - 1/2, où R est le rayon de l'astre.
          </p>
          <p>
            <strong className="text-indigo-700">Interprétation physique:</strong> Plus un
            observateur est proche d'une grande concentration de masse-énergie, plus le temps
            s'écoule lentement pour lui par rapport à un observateur éloigné. C\'est la courbure de la
            composante temporelle de l'espace-temps qui provoque ce ralentissement.
          </p>
        </div>
      </div>
    </div>
  );
};
