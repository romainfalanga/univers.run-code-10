import React, { useState, useEffect } from 'react';
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
  EARTH_MASS,
  EARTH_RADIUS,
  SOLAR_MASS,
  calculateAutoRadius,
  findMatchingCelestialBody,
  getCategoryColor,
  getCategoryDescription,
  calculateTimeDilationFactor,
  findMassRadiusForDilationFactor,
} from '../utils/physics';
import { TimeDilationChart } from './TimeDilationChart';

type MassUnit = 'earth' | 'solar';
type ControlMode = 'factor' | 'manual';

export const GravitationalTimeDilationExperiment: React.FC = () => {
  const [massUnit, setMassUnit] = useState<MassUnit>('earth');
  const [controlMode, setControlMode] = useState<ControlMode>('factor');
  const [massValue, setMassValue] = useState<number>(1);
  const [radius, setRadius] = useState<number>(EARTH_RADIUS);
  const [dilationFactor, setDilationFactor] = useState<number>(1);
  const [referenceTime, setReferenceTime] = useState<number>(86400);
  const [lastChanged, setLastChanged] = useState<'factor' | 'params'>('factor');

  const mass = massUnit === 'earth' ? massValue * EARTH_MASS : massValue * SOLAR_MASS;

  useEffect(() => {
    if (controlMode === 'factor' && lastChanged === 'factor') {
      const result = findMassRadiusForDilationFactor(dilationFactor);
      setMassValue(massUnit === 'earth' ? result.mass / EARTH_MASS : result.mass / SOLAR_MASS);
      setRadius(result.radius);
    }
  }, [dilationFactor, controlMode, lastChanged, massUnit]);

  useEffect(() => {
    if (controlMode === 'manual' || lastChanged === 'params') {
      const currentFactor = calculateTimeDilationFactor(mass, radius);
      if (isFinite(currentFactor) && Math.abs(currentFactor - dilationFactor) > 0.01) {
        setDilationFactor(currentFactor);
      }
    }
  }, [mass, radius, controlMode, lastChanged, dilationFactor]);

  const schwarzschildRadius = calculateSchwarzschildRadius(mass);
  const density = calculateDensity(mass, radius);
  const isBlackHole = radius <= schwarzschildRadius;
  const isNearBlackHole = radius < schwarzschildRadius * 2;
  const matchingBody = findMatchingCelestialBody(mass, radius);

  const dilationAtSurface = calculateTimeDilationAtSurface(mass, radius);
  const dilationAtCenter = calculateTimeDilationAtCenter(mass, radius);

  const timeAtInfinity = referenceTime;
  const timeAtSurface = referenceTime * dilationAtSurface;
  const timeAtCenter = referenceTime * dilationAtCenter;

  const ageDifferenceInfinitySurface = timeAtInfinity - timeAtSurface;
  const ageDifferenceInfinityCenter = timeAtInfinity - timeAtCenter;
  const ageDifferenceSurfaceCenter = timeAtSurface - timeAtCenter;

  const getMassSliderConfig = () => {
    if (massUnit === 'earth') {
      return { min: 0.1, max: 1000, step: 0.1 };
    } else {
      return { min: 0.01, max: 100, step: 0.01 };
    }
  };

  const getRadiusSliderConfig = () => {
    if (massUnit === 'earth') {
      return { min: 1, max: EARTH_RADIUS * 200, step: 10 };
    } else {
      return { min: 1, max: EARTH_RADIUS * 200000, step: 1000 };
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-2xl border border-white/20">
        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
          Configuration de l'Astre
        </h2>

        <div className="mb-6">
          <label className="block text-xs font-semibold text-gray-600 mb-2">Mode de Contrôle</label>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setControlMode('factor');
                setLastChanged('factor');
              }}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                controlMode === 'factor'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Multiplicateur Temporel
            </button>
            <button
              onClick={() => {
                setControlMode('manual');
                setLastChanged('params');
              }}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                controlMode === 'manual'
                  ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Manuel (Masse & Rayon)
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {controlMode === 'factor'
              ? 'Contrôlez le facteur de dilatation temporelle, la masse et le rayon s\'ajustent automatiquement'
              : 'Contrôlez la masse et le rayon manuellement, le facteur de dilatation se met à jour automatiquement'
            }
          </p>
        </div>

        {controlMode === 'manual' && (
          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-600 mb-2">Unité de Masse</label>
            <div className="flex gap-2">
              <button
                onClick={() => setMassUnit('earth')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  massUnit === 'earth'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Masses Terrestres
              </button>
              <button
                onClick={() => setMassUnit('solar')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  massUnit === 'solar'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Masses Solaires
              </button>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {controlMode === 'factor' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Multiplicateur du temps (Observateur lointain / Observateur au centre)
              </label>
              <p className="text-xs text-gray-500 italic mb-2">
                Modifier le multiplicateur ajustera automatiquement la masse et le rayon de l'astre
              </p>
              <Slider
                value={dilationFactor}
                min={1}
                max={100}
                step={0.1}
                onChange={(value) => {
                  setDilationFactor(value);
                  setLastChanged('factor');
                }}
                className="w-full h-3"
              />
              <div className="text-sm text-gray-600 mt-2 font-medium bg-white/60 p-2 rounded-md border border-gray-200/50">
                Facteur: {dilationFactor.toFixed(2)}×
                <br />
                <span className="text-gray-500 text-xs">
                  Le temps s'écoule {dilationFactor.toFixed(2)} fois plus vite à l'infini qu'au centre de l'astre
                </span>
              </div>
            </div>
          )}

          {controlMode === 'factor' && (
            <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
              <div className="text-xs font-semibold text-green-700 mb-2">Paramètres Calculés Automatiquement</div>
              <div className="space-y-1">
                <div className="text-sm font-bold text-green-800">Masse: {formatMass(mass)}</div>
                <div className="text-sm font-bold text-green-800">Rayon: {formatRadius(radius)}</div>
              </div>
              <p className="text-xs text-green-600 mt-2">
                Ces valeurs sont calculées pour obtenir le facteur de dilatation temporelle souhaité
              </p>
            </div>
          )}

          {controlMode === 'manual' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Masse de l'astre ({massUnit === 'earth' ? 'masses terrestres' : 'masses solaires'})
                </label>
                <Slider
                  value={massValue}
                  min={getMassSliderConfig().min}
                  max={getMassSliderConfig().max}
                  step={getMassSliderConfig().step}
                  onChange={(value) => {
                    setMassValue(value);
                    setLastChanged('params');
                  }}
                  className="w-full h-3"
                />
                <div className="text-sm text-gray-600 mt-2 font-medium bg-white/60 p-2 rounded-md border border-gray-200/50">
                  {massValue.toFixed(2)} {massUnit === 'earth' ? 'M⊕' : 'M☉'} = {formatMass(mass)}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rayon de l'astre
                </label>
                <Slider
                  value={radius}
                  min={getRadiusSliderConfig().min}
                  max={getRadiusSliderConfig().max}
                  step={getRadiusSliderConfig().step}
                  onChange={(value) => {
                    setRadius(value);
                    setLastChanged('params');
                  }}
                  className="w-full h-3"
                />
                <div className="text-sm text-gray-600 mt-2 font-medium bg-white/60 p-2 rounded-md border border-gray-200/50">
                  {formatRadius(radius)}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                <div className="text-xs font-semibold text-blue-700 mb-1">Multiplicateur Temporel Résultant</div>
                <div className="text-sm font-bold text-blue-800">{dilationFactor.toFixed(2)}×</div>
                <p className="text-xs text-blue-600 mt-1">
                  Le temps s'écoule {dilationFactor.toFixed(2)} fois plus vite à l'infini qu'au centre pour cette configuration
                </p>
              </div>
            </>
          )}

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
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200/50">
            <div className="text-xs font-semibold text-gray-600 mb-1">Densité</div>
            <div className="text-sm font-bold text-gray-800">{formatDensity(density)}</div>
          </div>
          <div className="bg-gradient-to-br from-cyan-50 to-teal-50 p-4 rounded-lg border border-cyan-200/50">
            <div className="text-xs font-semibold text-gray-600 mb-1">Rayon de Schwarzschild</div>
            <div className="text-sm font-bold text-gray-800">
              {schwarzschildRadius < 1000
                ? `${schwarzschildRadius.toFixed(3)} km`
                : `${(schwarzschildRadius / 1000).toFixed(2)} × 10³ km`}
            </div>
          </div>
          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 p-4 rounded-lg border border-teal-200/50">
            <div className="text-xs font-semibold text-gray-600 mb-1">Ratio R/Rs</div>
            <div className="text-sm font-bold text-gray-800">
              {(radius / schwarzschildRadius).toFixed(2)}
            </div>
          </div>
        </div>

        {matchingBody && (
          <div className={`mt-4 bg-gradient-to-r ${getCategoryColor(matchingBody.category)} border-l-4 p-4 rounded-lg`}>
            <div className="flex items-start">
              <Info className="w-5 h-5 text-gray-700 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-gray-800 mb-1">
                  Cet astre correspond à peu près à : {matchingBody.name}
                </h3>
                <p className="text-xs text-gray-700 leading-relaxed mb-2">
                  <strong>Catégorie :</strong> {matchingBody.category.charAt(0).toUpperCase() + matchingBody.category.slice(1)}
                </p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {getCategoryDescription(matchingBody.category)}
                </p>
              </div>
            </div>
          </div>
        )}

        {isBlackHole && (
          <div className="mt-4 bg-red-100 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-red-800 mb-1">Trou Noir Formé</h3>
                <p className="text-xs text-red-700 leading-relaxed mb-2">
                  <strong>ATTENTION:</strong> Le rayon de l'astre (R = {formatRadius(radius)}) est inférieur ou égal
                  au rayon de Schwarzschild (Rs = {schwarzschildRadius < 1000 ? `${schwarzschildRadius.toFixed(3)} km` : `${(schwarzschildRadius / 1000).toFixed(2)} × 10³ km`}).
                </p>
                <p className="text-xs text-red-700 leading-relaxed">
                  Un horizon des événements s'est formé. Les formules de dilatation temporelle utilisées ici
                  ne sont valides qu'à l'<strong>extérieur</strong> de l'horizon. À l'intérieur d'un trou noir,
                  les rôles du temps et de l'espace sont échangés, et les concepts habituels ne s\'appliquent plus.
                </p>
              </div>
            </div>
          </div>
        )}

        {!isBlackHole && isNearBlackHole && (
          <div className="mt-4 bg-orange-100 border-l-4 border-orange-500 p-4 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-orange-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-orange-800 mb-1">Configuration Extrême</h3>
                <p className="text-xs text-orange-700 leading-relaxed">
                  Le rayon de l'astre (R = {(radius / schwarzschildRadius).toFixed(2)}×Rs) est proche du rayon de Schwarzschild.
                  Les effets gravitationnels sont extrêmes. Cette configuration pourrait être instable et s'effondrer en trou noir.
                </p>
              </div>
            </div>
          </div>
        )}

        {!matchingBody && !isBlackHole && !isNearBlackHole && (
          <div className="mt-4 bg-gray-100 border-l-4 border-gray-400 p-4 rounded-lg">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-gray-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-gray-800 mb-1">Configuration Théorique</h3>
                <p className="text-xs text-gray-700 leading-relaxed">
                  Cette combinaison de masse et de rayon ne correspond pas exactement à un astre connu.
                  Elle pourrait représenter une configuration théorique ou un objet hypothétique.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {!isBlackHole && (
        <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-2xl border border-white/20">
          <div className="flex items-center mb-4">
            <Clock className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
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

            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg border-l-4 border-orange-500">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-gray-800">Observateur au Centre</h3>
                <div className="text-xs text-gray-600 bg-white/60 px-2 py-1 rounded">
                  Facteur: {dilationAtCenter.toFixed(6)}
                </div>
              </div>
              <div className="text-lg font-bold text-orange-700">{formatTime(timeAtCenter)}</div>
              <p className="text-xs text-gray-600 mt-1">
                Temps propre écoulé au centre de l'astre
              </p>
              {dilationAtCenter < 0.999 && (
                <div className="mt-2 text-xs text-orange-600 bg-orange-100/50 p-2 rounded space-y-1">
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

      <TimeDilationChart mass={mass} radius={radius} />

      <div className="bg-gradient-to-br from-slate-50 to-gray-50 p-4 sm:p-6 rounded-xl border border-slate-200/50 shadow-lg">
        <h3 className="text-lg font-bold text-slate-800 mb-3">
          Comprendre les Résultats
        </h3>
        <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
          <p>
            <strong className="text-slate-700">Métrique de Schwarzschild extérieure:</strong> Pour
            l'observateur à la surface, le facteur de dilatation est donné par dτ/dt = √(1 - Rs/R),
            où Rs = 2GM/c² est le rayon de Schwarzschild, R le rayon de l'astre, G la constante gravitationnelle
            et c la vitesse de la lumière.
          </p>
          <p>
            <strong className="text-slate-700">Solution intérieure de Schwarzschild:</strong> Pour
            l'observateur au centre d\'une sphère de densité uniforme, le facteur est dτ/dt = (3/2)√(1 - Rs/R) - 1/2,
            où R est le rayon de l'astre.
          </p>
          <p>
            <strong className="text-slate-700">Multiplicateur temporel:</strong> Le multiplicateur affiché
            est l'inverse du facteur au centre: 1/(dτ/dt). Il représente combien de fois plus vite le temps
            s'écoule pour un observateur lointain par rapport au centre de l\'astre.
          </p>
          <p>
            <strong className="text-slate-700">Interprétation physique:</strong> Plus un
            observateur est proche d'une grande concentration de masse-énergie, plus le temps
            s'écoule lentement pour lui par rapport à un observateur éloigné. C\'est la courbure de la
            composante temporelle de l'espace-temps qui provoque ce ralentissement.
          </p>
          <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded mt-3">
            <p className="text-xs text-amber-800">
              <strong>Limites de validité:</strong> Ces formules ne sont valides que lorsque R &gt; Rs.
              Si R ≤ Rs, un trou noir se forme et ces équations ne s'appliquent plus à l\'intérieur de l'horizon
              des événements. Dans ce cas extrême, les rôles du temps et de l'espace sont inversés et les
              prédictions de la relativité générale deviennent contre-intuitives.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
