
import type { HazardId } from './automated-report-generator';

// Hazard alias mapping for normalizing user input
const HAZARD_ALIAS: Record<string, HazardId> = {
  hurricane: 'wind',
  cyclone: 'wind',
  typhoon: 'wind',
  tornado: 'wind',
  // Add more aliases as needed
};

// Valid hazard IDs
const HAZARD_IDS: HazardId[] = ['earthquake', 'wind', 'flood', 'wildfire'];

/**
 * Normalizes hazard input to a valid HazardId
 */
export function normalizeHazard(input: string): HazardId {
  const key = input.toLowerCase().trim();
  
  // Check if it's already a valid hazard ID
  if (HAZARD_IDS.includes(key as HazardId)) {
    return key as HazardId;
  }
  
  // Check if it's an alias
  const aliased = HAZARD_ALIAS[key];
  if (aliased) {
    return aliased;
  }
  
  // Default fallback
  return 'earthquake';
}

// Get display name for hazard
export function getHazardDisplayName(hazard: HazardId): string {
  const displayNames: { [key in HazardId]: string } = {
    'earthquake': 'Earthquake',
    'wind': 'Wind/Hurricane/Tornado',
    'flood': 'Flood',
    'wildfire': 'Wildfire'
  };

  return displayNames[hazard];
}

// Get hazard-specific icon or color
export function getHazardTheme(hazard: HazardId): { color: string; icon: string } {
  const themes: { [key in HazardId]: { color: string; icon: string } } = {
    'earthquake': { color: '#8B4513', icon: '🏚️' },
    'wind': { color: '#4682B4', icon: '🌪️' },
    'flood': { color: '#1E90FF', icon: '🌊' },
    'wildfire': { color: '#FF4500', icon: '🔥' }
  };

  return themes[hazard];
}

// Check if audit has sufficient data for risk calculation
export function hasMinimumAuditData(audit: any, hazard: HazardId): boolean {
  const requiredFields: { [key in HazardId]: string[] } = {
    'earthquake': ['foundationWork', 'waterHeaterSecurity'],
    'wind': ['roofInspection', 'windowDoorProtection'],
    'flood': ['equipmentElevation', 'automaticFloodVents'],
    'wildfire': ['roofMaterial', 'defensibleSpaceWidth']
  };

  const fields = requiredFields[hazard];
  return fields.some(field => audit[field] !== undefined && audit[field] !== null);
}

// Get missing data fields for a hazard
export function getMissingDataFields(audit: any, hazard: HazardId): string[] {
  const allFields: { [key in HazardId]: { field: string; label: string }[] } = {
    'earthquake': [
      { field: 'foundationWork', label: 'Foundation/Cripple Wall Work' },
      { field: 'waterHeaterSecurity', label: 'Water Heater Strapping' },
      { field: 'chimneyInspection', label: 'Chimney Inspection' },
      { field: 'garageRetrofit', label: 'Garage Retrofit' }
    ],
    'wind': [
      { field: 'roofInspection', label: 'Roof Inspection' },
      { field: 'windowDoorProtection', label: 'Window/Door Protection' },
      { field: 'continuousLoadPath', label: 'Continuous Load Path' }
    ],
    'flood': [
      { field: 'equipmentElevation', label: 'Equipment Elevation' },
      { field: 'automaticFloodVents', label: 'Flood Vents' },
      { field: 'appliancePlatforms', label: 'Appliance Platforms' }
    ],
    'wildfire': [
      { field: 'roofMaterial', label: 'Roof Material' },
      { field: 'defensibleSpaceWidth', label: 'Defensible Space' },
      { field: 'underElevationFinish', label: 'Under-Elevation Finish' }
    ]
  };

  const fields = allFields[hazard];
  return fields
    .filter(({ field }) => !audit[field] || audit[field] === 'Unsure')
    .map(({ label }) => label);
}
