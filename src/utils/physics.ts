import { DataPoint } from '../types';

export const SPEED_OF_LIGHT = 299792.458;
export const GRAVITATIONAL_CONSTANT = 6.67430e-11;
export const SOLAR_MASS = 1.989e30;
export const EARTH_MASS = 5.972e24;
export const EARTH_RADIUS = 6371;
export const SOLAR_RADIUS = 695700;

export const calculateGamma = (velocity: number): number => {
  const vFraction = velocity / SPEED_OF_LIGHT;
  if (vFraction >= 1) return 320;
  if (vFraction <= 0) return 1;

  const gamma = 1 / Math.sqrt(1 - vFraction * vFraction);
  return Math.min(gamma, 320);
};

export const calculateVelocity = (gamma: number): number => {
  if (gamma <= 1) return 0;
  if (gamma >= 320) return SPEED_OF_LIGHT * 0.99999;

  const vFraction = Math.sqrt(1 - 1 / (gamma * gamma));
  return vFraction * SPEED_OF_LIGHT;
};

export const generateVelocityToGammaData = (): DataPoint[] => {
  const data: DataPoint[] = [];
  const numPoints = 1000;

  for (let i = 0; i <= numPoints; i++) {
    const velocityFraction = i / numPoints;
    const velocity = velocityFraction * SPEED_OF_LIGHT;
    const gamma = calculateGamma(velocity);
    data.push({ x: velocity, y: gamma });
  }

  return data;
};

export const generateGammaToVelocityData = (): DataPoint[] => {
  const data: DataPoint[] = [];
  const maxGamma = 320;
  const numPoints = 1000;

  for (let i = 0; i <= numPoints; i++) {
    const gamma = 1 + (i / numPoints) * (maxGamma - 1);
    const velocity = calculateVelocity(gamma);
    data.push({ x: gamma, y: velocity });
  }

  return data;
};

export const formatNumber = (value: number, decimals: number = 2): string => {
  return value.toFixed(decimals);
};

export const formatVelocityFraction = (velocity: number): string => {
  const fraction = (velocity / SPEED_OF_LIGHT) * 100;
  return `${fraction.toFixed(4)}%`;
};

export const formatVelocityKmPerSec = (velocity: number, gamma: number): string => {
  if (gamma >= 320) {
    return '299,792';
  }
  return velocity.toLocaleString('fr-FR', { maximumFractionDigits: 0 });
};

export const formatTime = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds.toFixed(2)} secondes`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes} minute${minutes > 1 ? 's' : ''} ${secs.toFixed(0)} seconde${secs !== 1 ? 's' : ''}`;
  } else if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} heure${hours > 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  } else if (seconds < 2592000) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    return `${days} jour${days > 1 ? 's' : ''} ${hours} heure${hours !== 1 ? 's' : ''}`;
  } else if (seconds < 31536000) {
    const months = Math.floor(seconds / 2592000);
    const days = Math.floor((seconds % 2592000) / 86400);
    return `${months} mois ${days} jour${days !== 1 ? 's' : ''}`;
  } else {
    const years = Math.floor(seconds / 31536000);
    const months = Math.floor((seconds % 31536000) / 2592000);
    return `${years} an${years > 1 ? 's' : ''} ${months} mois`;
  }
};

export const calculateSchwarzschildRadius = (massKg: number): number => {
  const c = SPEED_OF_LIGHT * 1000;
  return (2 * GRAVITATIONAL_CONSTANT * massKg) / (c * c) / 1000;
};

export const calculateTimeDilationAtSurface = (massKg: number, radiusKm: number): number => {
  const c = SPEED_OF_LIGHT * 1000;
  const r = radiusKm * 1000;
  const rs = calculateSchwarzschildRadius(massKg) * 1000;

  const factor = 1 - (rs / r);
  if (factor <= 0) return 0;

  return Math.sqrt(factor);
};

export const calculateTimeDilationAtCenter = (massKg: number, radiusKm: number): number => {
  const c = SPEED_OF_LIGHT * 1000;
  const R = radiusKm * 1000;
  const rs = calculateSchwarzschildRadius(massKg) * 1000;

  const factor = 1 - (rs / R);
  if (factor <= 0) return 0;

  const term1 = (3 / 2) * Math.sqrt(factor);
  const term2 = 1 / 2;

  return term1 - term2;
};

export const calculateTimeDilationAtDistance = (massKg: number, radiusKm: number, distanceKm: number): number => {
  if (distanceKm <= radiusKm) {
    const c = SPEED_OF_LIGHT * 1000;
    const R = radiusKm * 1000;
    const r = distanceKm * 1000;
    const rs = calculateSchwarzschildRadius(massKg) * 1000;

    const factorSurface = 1 - (rs / R);
    if (factorSurface <= 0) return 0;

    const rRatio = r / R;
    const term1 = (3 / 2) * Math.sqrt(factorSurface);
    const term2 = (1 / 2) * Math.sqrt(1 - (rs * rRatio * rRatio) / R);

    return term1 - term2;
  } else {
    return calculateTimeDilationAtSurface(massKg, distanceKm);
  }
};

export const calculateDensity = (massKg: number, radiusKm: number): number => {
  const radiusM = radiusKm * 1000;
  const volume = (4 / 3) * Math.PI * Math.pow(radiusM, 3);
  return massKg / volume;
};

export const formatMass = (massKg: number): string => {
  if (massKg >= SOLAR_MASS) {
    return `${(massKg / SOLAR_MASS).toFixed(2)} masses solaires`;
  } else if (massKg >= EARTH_MASS) {
    return `${(massKg / EARTH_MASS).toFixed(2)} masses terrestres`;
  } else {
    return `${massKg.toExponential(2)} kg`;
  }
};

export const formatRadius = (radiusKm: number): string => {
  if (radiusKm >= SOLAR_RADIUS) {
    return `${(radiusKm / SOLAR_RADIUS).toFixed(2)} rayons solaires`;
  } else if (radiusKm >= EARTH_RADIUS) {
    return `${(radiusKm / EARTH_RADIUS).toFixed(2)} rayons terrestres`;
  } else {
    return `${radiusKm.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} km`;
  }
};

export const formatDensity = (densityKgPerM3: number): string => {
  if (densityKgPerM3 >= 1e15) {
    return `${(densityKgPerM3 / 1e18).toExponential(2)} × 10¹⁸ kg/m³`;
  } else if (densityKgPerM3 >= 1e9) {
    return `${(densityKgPerM3 / 1e9).toExponential(2)} × 10⁹ kg/m³`;
  } else if (densityKgPerM3 >= 1e6) {
    return `${(densityKgPerM3 / 1e6).toExponential(2)} × 10⁶ kg/m³`;
  } else if (densityKgPerM3 >= 1000) {
    return `${(densityKgPerM3 / 1000).toFixed(2)} × 10³ kg/m³`;
  } else {
    return `${densityKgPerM3.toFixed(2)} kg/m³`;
  }
};

export interface CelestialPreset {
  name: string;
  mass: number;
  radius: number;
}

export const CELESTIAL_PRESETS: CelestialPreset[] = [
  { name: 'Terre', mass: EARTH_MASS, radius: EARTH_RADIUS },
  { name: 'Jupiter', mass: 1.898e27, radius: 69911 },
  { name: 'Soleil', mass: SOLAR_MASS, radius: SOLAR_RADIUS },
  { name: 'Naine Blanche', mass: SOLAR_MASS * 0.6, radius: 5000 },
  { name: 'Étoile à Neutrons', mass: SOLAR_MASS * 1.4, radius: 10 },
];
