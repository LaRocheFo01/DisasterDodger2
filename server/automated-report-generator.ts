/*
=====================================================================
  Disaster Dodger – Automated Audit Report Generator (TypeScript)
  ------------------------------------------------------------------
  VERSION: 2025‑06‑01b  (Retrofit Library — ultra‑granular)
  ------------------------------------------------------------------
  This file now contains an exhaustive, machine‑readable catalogue of
  retrofit actions for every major U.S. hazard.  Even the seemingly
  "boring" nails‑and‑washers details are enumerated so that:

  • The risk‑score engine can rank life‑safety vs. property‑loss items.
  • The cost/savings calculator can assign cap‑ex bands + insurance
    premium deltas with sub‑feature precision.
  • The PDF generator can cite exact FEMA page/figure numbers and
    insurance‑filing forms.
=====================================================================
*/

/**********************************************************
 * SECTION 0 – Shared Types & Utility Functions
 **********************************************************/

export type Hazard = 'earthquake' | 'wind' | 'flood' | 'wildfire';

// Hazard alias mapping to handle different input formats
const HAZARD_ALIAS: Record<string, Hazard> = {
  'hurricane': 'wind',
  'cyclone': 'wind',
  'typhoon': 'wind',
  'tornado': 'wind',
  'windstorm': 'wind',
  'storm': 'wind',
  'wind storm': 'wind',
  'seismic': 'earthquake',
  'quake': 'earthquake',
  'flooding': 'flood',
  'water': 'flood',
  'storm surge': 'flood',
  'fire': 'wildfire',
  'bushfire': 'wildfire',
  'forest fire': 'wildfire',
  'wild fire': 'wildfire'
};

// Normalize hazard input to standard types
function normalizeHazardInput(input: string | null | undefined): Hazard {
  if (!input) return 'earthquake'; // default fallback
  
  const key = input.toLowerCase().trim();
  
  // Check if it's already a valid hazard type
  if (['earthquake', 'wind', 'flood', 'wildfire'].includes(key)) {
    return key as Hazard;
  }
  
  // Check aliases
  return HAZARD_ALIAS[key] || 'earthquake'; // default fallback
}

export interface Recommendation {
  id: string;                // unique key (e.g. EQ_HIGH_CRIPPLE_WALL)
  hazard: Hazard;
  tier: 'high' | 'medium' | 'low' | 'basic' | 'intermediate' | 'advanced' | 'safe_room';
  title: string;             // short label shown in report
  description: string;       // full homeowner‑friendly language
  femaPdf: string;           // publication ID (e.g. FEMA P‑530)
  femaPage: string;          // page or figure reference
  costTier: '$' | '$$' | '$$$';
  costRangeUsd: [number, number];     // typical cost for a detached SFD home
  insuranceProgram?: string; // e.g. "CEA Brace‑and‑Bolt"
  insuranceForm?: string;    // e.g. "EBB Completion Cert"
  premiumSavingsPct?: [number, number]; // low–high expected premium delta
  grantProgram?: string;     // e.g. "BRIC", "ICC", "Strengthen AL Homes"
  grantSharePct?: number;    // typical % of cost the grant will pay
  notes?: string;            // extra tips / qualifiers
}

/**********************************************************
 * SECTION 1 – Deep‑detail Recommendation Library
 **********************************************************/

export const RECOMMENDATION_LIBRARY: Recommendation[] = [
  /* ───────────── EARTHQUAKE (FEMA P‑530) ───────────── */
  {
    id: 'EQ_HIGH_CRIPPLE_WALL',
    hazard: 'earthquake',
    tier: 'high',
    title: 'Brace cripple walls & add anchor bolts',
    description: 'Install ½‑in. diameter anchor bolts at ≤ 6 ft on‑center and sheath cripple‑wall interior with 15/32‑in. structural plywood to prevent soft‑story collapse.',
    femaPdf: 'FEMA P‑530',
    femaPage: 'pp 34‑36',
    costTier: '$$',
    costRangeUsd: [4000, 12000],
    insuranceProgram: 'CEA Brace‑and‑Bolt',
    insuranceForm: 'EBB Completion Certificate',
    premiumSavingsPct: [20, 25],
    grantProgram: 'CEA EBB Grant',
    grantSharePct: 30,
    notes: 'Required to unlock full CEA premium credit and may reduce deductible from 15% to 10%.'
  },
  {
    id: 'EQ_HIGH_SILL_BOLT',
    hazard: 'earthquake',
    tier: 'high',
    title: 'Bolt sill‑plate to concrete foundation',
    description: 'For slab‑on‑grade or stem‑wall foundations, install ½‑in. anchor bolts with 3‑in. square plate washers every ≤ 6 ft; use epoxy anchors for retrofit.',
    femaPdf: 'FEMA P‑530',
    femaPage: 'p 35',
    costTier: '$',
    costRangeUsd: [900, 2500],
    insuranceProgram: 'CEA Brace‑and‑Bolt',
    insuranceForm: 'EBB Completion Certificate',
    premiumSavingsPct: [20, 25],
    grantProgram: 'CEA EBB Grant',
    grantSharePct: 30
  },
  {
    id: 'EQ_HIGH_WATER_HEATER',
    hazard: 'earthquake',
    tier: 'high',
    title: 'Strap water heater & add flexible lines',
    description: 'Install two 22‑gauge metal straps—upper and lower thirds—anchored to studs; replace rigid gas & water connections with flex connectors.',
    femaPdf: 'FEMA P‑530',
    femaPage: 'pp 28‑29',
    costTier: '$',
    costRangeUsd: [150, 400],
    insuranceProgram: undefined,
    premiumSavingsPct: undefined,
    notes: 'Often required by lending & life‑safety code; mitigates fire and water damage risk.'
  },
  {
    id: 'EQ_HIGH_CHIMNEY',
    hazard: 'earthquake',
    tier: 'high',
    title: 'Retrofit unreinforced masonry chimney',
    description: 'Either remove to roof deck and install metal flue, or wrap with steel angle + straps tied to roof framing.',
    femaPdf: 'FEMA P‑530',
    femaPage: 'pp 48‑49',
    costTier: '$$$',
    costRangeUsd: [8000, 20000],
    insuranceProgram: 'Various CA private carriers – masonry surcharge credit',
    premiumSavingsPct: [5, 10]
  },
  {
    id: 'EQ_HIGH_PF_GARAGE',
    hazard: 'earthquake',
    tier: 'high',
    title: 'Strengthen living‑space‑over‑garage wall',
    description: 'Install portal frames or steel pipe columns to create a continuous load path for soft garage openings.',
    femaPdf: 'FEMA P‑530',
    femaPage: 'p 42',
    costTier: '$$$',
    costRangeUsd: [6000, 18000],
    insuranceProgram: undefined,
    notes: 'Improves life‑safety; may qualify for city retrofit tax rebate.'
  },
  {
    id: 'EQ_MED_SHEATHING',
    hazard: 'earthquake',
    tier: 'medium',
    title: 'Re‑nail / add plywood sheathing to existing siding',
    description: 'Add missing edge nails (≤ 6 in.) and blocking; improves shear capacity of exterior walls.',
    femaPdf: 'FEMA P‑530',
    femaPage: 'pp 36‑37',
    costTier: '$',
    costRangeUsd: [1200, 2500]
  },
  {
    id: 'EQ_MED_DECK_BRACE',
    hazard: 'earthquake',
    tier: 'medium',
    title: 'Anchor elevated decks & carports',
    description: 'Install knee‑braces and Simpson ledger clips; add hold‑downs at post bases.',
    femaPdf: 'FEMA P‑530',
    femaPage: 'pp 30‑34',
    costTier: '$$',
    costRangeUsd: [1800, 4500]
  },
  {
    id: 'EQ_LOW_CONTENTS',
    hazard: 'earthquake',
    tier: 'low',
    title: 'Secure tall furniture, TVs, cabinet doors',
    description: 'Use nylon straps, L‑brackets, and safety latches to keep contents from falling.',
    femaPdf: 'FEMA P‑528 poster',
    femaPage: 'poster items',
    costTier: '$',
    costRangeUsd: [50, 200]
  },

  /* ───────────── WIND / HURRICANE / TORNADO (FEMA P‑804) ───────────── */
  {
    id: 'WIND_BASIC_ROOF_SEAL',
    hazard: 'wind',
    tier: 'basic',
    title: 'Seal & re‑nail roof deck (FORTIFIED Roof)',
    description: 'Re‑nail sheathing with 8d ring‑shank @ 4 in. edge / 6 in. field; apply fully‑adhered underlayment over seams.',
    femaPdf: 'FEMA P‑804',
    femaPage: '§4 Basic Package',
    costTier: '$$',
    costRangeUsd: [3500, 8000],
    insuranceProgram: 'IBHS FORTIFIED Roof',
    insuranceForm: 'FORTIFIED Roof Certificate + OIR‑B1‑1802',
    premiumSavingsPct: [20, 40],
    grantProgram: 'Strengthen AL Homes',
    grantSharePct: 100,
    notes: 'Deck sealing reduces water intrusion; critical for Gulf & Atlantic rating.'
  },
  {
    id: 'WIND_INTERMEDIATE_SHUTTERS',
    hazard: 'wind',
    tier: 'intermediate',
    title: 'Install impact shutters / rated windows',
    description: 'All glazed openings must meet ASTM E1996 missile impact rating or be protected by shutters rated to same standard.',
    femaPdf: 'FEMA P‑804',
    femaPage: '§4 Intermediate Package',
    costTier: '$$$',
    costRangeUsd: [8000, 20000],
    insuranceProgram: 'FORTIFIED Silver',
    insuranceForm: 'FORTIFIED Silver Cert',
    premiumSavingsPct: [30, 50],
    grantProgram: 'BRIC Wind Retrofit',
    grantSharePct: 75
  },
  {
    id: 'WIND_ADV_CONT_LOAD_PATH',
    hazard: 'wind',
    tier: 'advanced',
    title: 'Install full continuous load path (roof‑to‑footing straps)',
    description: 'Add hurricane straps or Simpson HGA/HTT ties at every stud‑rafter and stud‑sill connection for uplift resistance.',
    femaPdf: 'FEMA P‑804',
    femaPage: '§4 Advanced Package',
    costTier: '$$$',
    costRangeUsd: [12000, 30000],
    insuranceProgram: 'FORTIFIED Gold',
    premiumSavingsPct: [40, 60],
    grantProgram: 'BRIC Wind Retrofit',
    grantSharePct: 75
  },
  {
    id: 'WIND_SAFE_ROOM',
    hazard: 'wind',
    tier: 'safe_room',
    title: 'Construct ICC‑500 / FEMA P‑361 safe room',
    description: 'Build site‑built CMU or pre‑fab steel panel shelter rated to 250 mph 3‑second gust; anchor to slab foundation.',
    femaPdf: 'FEMA P‑361',
    femaPage: 'Chap 3 Figs 3‑1 to 3‑7',
    costTier: '$$$',
    costRangeUsd: [9000, 18000],
    insuranceProgram: 'Wind‑storm Shelter Endorsement',
    premiumSavingsPct: [5, 15],
    grantProgram: 'HMGP',
    grantSharePct: 75,
    notes: 'Some carriers waive separate windstorm deductible if shelter present.'
  },

  /* ───────────── FLOOD (FEMA P‑312) ───────────── */
  {
    id: 'FLOOD_ELEVATE',
    hazard: 'flood',
    tier: 'high',
    title: 'Elevate lowest floor above BFE +3 ft',
    description: 'Lift house onto open piers or stem‑wall foundation per Chap 5. Includes utility relocation and new access stairs.',
    femaPdf: 'FEMA P‑312',
    femaPage: 'Chap 5 pp 3‑19 → 3‑20',
    costTier: '$$$',
    costRangeUsd: [60000, 160000],
    insuranceProgram: 'NFIP rating – Elevated Building',
    insuranceForm: 'Elevation Certificate',
    premiumSavingsPct: [70, 90],
    grantProgram: 'ICC + FMA',
    grantSharePct: 75
  },
  {
    id: 'FLOOD_WET_FLOODPROOF',
    hazard: 'flood',
    tier: 'medium',
    title: 'Add engineered flood vents & flood‑resistant materials',
    description: 'Install ICC‑ES certified vents (1 sq in per sq ft of enclosure) & replace materials below BFE with concrete board, closed‑cell foam insulation, etc.',
    femaPdf: 'FEMA P‑312',
    femaPage: 'Chap 7 §7.1, Table 7‑1',
    costTier: '$$',
    costRangeUsd: [2000, 6000],
    insuranceProgram: 'NFIP – Enclosure Compliance',
    premiumSavingsPct: [15, 25],
    grantProgram: 'ICC',
    grantSharePct: 100,
    notes: 'Required if enclosed space remains below elevated house.'
  },
  {
    id: 'FLOOD_UTILITY_PLATFORM',
    hazard: 'flood',
    tier: 'low',
    title: 'Elevate HVAC & water heater on flood‑platform',
    description: 'Build concrete or CMU platform to raise equipment above BFE; strap to prevent flotation.',
    femaPdf: 'FEMA P‑312',
    femaPage: 'Chap 9 pp 9‑2 → 9‑4',
    costTier: '$',
    costRangeUsd: [800, 2500]
  },

  /* ───────────── WILDFIRE (FEMA P‑737) ───────────── */
  {
    id: 'WF_ROOF_CLASS_A',
    hazard: 'wildfire',
    tier: 'high',
    title: 'Replace roof with Class‑A assembly & ember‑resistant vents',
    description: 'Install Class‑A asphalt shingle or metal panel roof with metal drip edge; replace all vents with ⅛‑in. mesh, ember‑resistant models.',
    femaPdf: 'FEMA P‑737',
    femaPage: 'Fact Sheet 2',
    costTier: '$$$',
    costRangeUsd: [14000, 32000],
    insuranceProgram: 'Safer‑from‑Wildfires Tier 1',
    premiumSavingsPct: [10, 20]
  },
  {
    id: 'WF_DEFENSIBLE_SPACE',
    hazard: 'wildfire',
    tier: 'medium',
    title: 'Create 0–5 ft non‑combustible zone & 5–30 ft Lean‑Clean‑Green',
    description: 'Replace combustible mulch with gravel or pavers in first 5 ft; prune shrubs & trees to maintain vertical/horizontal separation.',
    femaPdf: 'FEMA P‑737',
    femaPage: 'Fact Sheet 1',
    costTier: '$',
    costRangeUsd: [500, 2500],
    insuranceProgram: 'Safer‑from‑Wildfires Tier 2',
    premiumSavingsPct: [5, 10]
  },
  {
    id: 'WF_DECK_ENCLOSURE',
    hazard: 'wildfire',
    tier: 'medium',
    title: 'Replace wood deck boards or add 1‑hr enclosure',
    description: 'Swap to ignition‑resistant boards (ASTM E84 ≤ 25 flame‑spread) OR enclose underside with 5⁄8‑in. Type‑X gypsum.',
    femaPdf: 'FEMA P‑737',
    femaPage: 'Fact Sheet 8',
    costTier: '$$',
    costRangeUsd: [3500, 9000]
  },
  {
    id: 'WF_ACCESSORY_MESH',
    hazard: 'wildfire',
    tier: 'low',
    title: 'Install spark arrestor & ⅛‑in. mesh on vents',
    description: 'Add spark arrestor at chimney top and retrofit all gable/foundation vents with ⅛‑in. corrosion‑resistant mesh.',
    femaPdf: 'FEMA P‑737',
    femaPage: 'Fact Sheet 5',
    costTier: '$',
    costRangeUsd: [150, 600]
  }
];

/**********************************************************
 * SECTION 2 – Insurance PDF Library (deep‑file vault)
 **********************************************************/

export interface InsurancePdf {
  id: string;
  hazard: Hazard;
  scope: 'national' | 'state';
  title: string;
  url: string;
  summary: string;
  creditRange?: string;
  requiredForm?: string;
}

export const INSURANCE_PDF_LIBRARY: InsurancePdf[] = [
  {
    id: 'FLOOD_NFIP_MANUAL_2024',
    hazard: 'flood',
    scope: 'national',
    title: 'NFIP Flood Insurance Manual (Apr 2024)',
    url: 'https://www.fema.gov/sites/default/files/documents/fema_nfip_flood-insurance-manual_042024.pdf',
    summary: 'Master rating tables that convert Elevation Certificates, flood vents & CRS class into premiums.',
    creditRange: 'Varies – see Manual Ch. 6',
    requiredForm: 'Elevation Certificate'
  },
  {
    id: 'FLOOD_CRS_DISCOUNT_FAQ_2024',
    hazard: 'flood',
    scope: 'national',
    title: 'NFIP Community Rating System Discount FAQ (Sep 2024)',
    url: 'https://www.fema.gov/sites/default/files/documents/fema-nfip-community-rating-system-discount-faq-09-2024.pdf',
    summary: 'Explains automatic 5–45 % premium reductions when a community improves CRS class.'
  },
  {
    id: 'WIND_FL_OIR_1802',
    hazard: 'wind',
    scope: 'state',
    title: 'Uniform Mitigation Verification Form OIR‑B1‑1802',
    url: 'https://www.citizensfla.com/documents/20702/31330/Uniform%2BMitigation%2BVerification%2BInspection%2BForm%2BOIR-B1-1802/3ff6a375-1088-482b-8496-5b325ed6453b',
    summary: 'Florida/Gulf carriers compute wind discounts from this checklist.',
    creditRange: '10–60 %',
    requiredForm: '1802 + photos'
  },
  {
    id: 'WIND_IBHS_INCENTIVES',
    hazard: 'wind',
    scope: 'national',
    title: 'IBHS FORTIFIED – Regulatory Incentive Compendium',
    url: 'https://disastersafety.org/wp-content/uploads/FORTIFIED-Home-Incentives_IBHS.pdf',
    summary: 'Lists every statute & insurer that must honor a Roof/Silver/Gold certificate.',
    creditRange: '5–60 %'
  },
  {
    id: 'EQ_CA_DOI_GUIDE_2024',
    hazard: 'earthquake',
    scope: 'state',
    title: 'California DOI Earthquake Insurance Guide (2024)',
    url: 'https://www.insurance.ca.gov/01-consumers/105-type/95-guides/03-res/upload/IG-Earthquake-Insurance-Updated-102924.pdf',
    summary: 'Details 20–25 % discounts after cripple-wall brace-and-bolt.'
  },
  {
    id: 'WF_SFW_FAQ',
    hazard: 'wildfire',
    scope: 'state',
    title: 'Safer From Wildfires FAQ & Rules',
    url: 'https://www.insurance.ca.gov/01-consumers/105-type/95-guides/03-res/upload/FAQ-Safer-from-Wildfire-Regulation.pdf',
    summary: 'CA regulation mandating insurer discounts for wildfire-hardening tiers.',
    creditRange: '5–20 %',
    requiredForm: 'Passing inspection photos'
  }
];

/**********************************************************
 * SECTION 3 – Cost & Savings Calculation Helpers
 **********************************************************/

export function estimateAnnualPremiumSavings(recoId: string, currentPremium: number): number | undefined {
  const rec = RECOMMENDATION_LIBRARY.find(r => r.id === recoId && r.premiumSavingsPct);
  if (!rec || !rec.premiumSavingsPct) return undefined;
  const [lowPct, highPct] = rec.premiumSavingsPct;
  // Use midpoint for report estimates
  const midpoint = (lowPct + highPct) / 2;
  return +(currentPremium * (midpoint / 100)).toFixed(0);
}

export function calculatePaybackPeriod(recoId: string, currentPremium: number): number | undefined {
  const rec = RECOMMENDATION_LIBRARY.find(r => r.id === recoId);
  if (!rec) return undefined;
  
  const annualSavings = estimateAnnualPremiumSavings(recoId, currentPremium);
  if (!annualSavings) return undefined;
  
  const avgCost = (rec.costRangeUsd[0] + rec.costRangeUsd[1]) / 2;
  return Math.round(avgCost / annualSavings);
}

/**********************************************************
 * SECTION 4 – Risk Scoring & Recommendation Engine
 **********************************************************/

export interface AuditData {
  zipCode?: string | null;
  homeType?: string | null;
  yearBuilt?: string | null;
  ownershipStatus?: string | null;
  insuredValue?: string | null;
  insurancePolicies?: string[] | null;
  previousGrants?: string | null;
  
  // Hazard-specific responses
  [key: string]: any;
}

export interface RiskScore {
  hazard: Hazard;
  overallScore: number; // 0-100 (higher = more vulnerable)
  riskFactors: string[];
  priorityRecommendations: string[]; // recommendation IDs
}

export function calculateRiskScore(hazard: Hazard, auditData: AuditData): RiskScore {
  let score = 0;
  const riskFactors: string[] = [];
  const priorityRecommendations: string[] = [];

  switch (hazard) {
    case 'earthquake':
      // Foundation vulnerabilities - HIGH RISK if No/Unsure
      if (auditData.foundationWork === 'No' || auditData.foundationWork === 'Unsure') {
        score += 30;
        riskFactors.push('Unbraced cripple walls or unbolted foundation');
        priorityRecommendations.push('EQ_HIGH_CRIPPLE_WALL', 'EQ_HIGH_SILL_BOLT');
      }
      
      // Water heater - HIGH RISK if not secured
      if (auditData.waterHeaterSecurity === 'No' || auditData.waterHeaterSecurity === 'Unsure') {
        score += 20;
        riskFactors.push('Unstrapped water heater - fire and water damage risk');
        priorityRecommendations.push('EQ_HIGH_WATER_HEATER');
      }
      
      // Chimney - HIGH RISK if unreinforced masonry
      if (auditData.chimneyInspection === 'No' || auditData.chimneyInspection === 'Unsure') {
        score += 25;
        riskFactors.push('Unreinforced masonry chimney collapse risk');
        priorityRecommendations.push('EQ_HIGH_CHIMNEY');
      }
      
      // Garage soft story - HIGH RISK
      if (auditData.garageRetrofit === 'No' || auditData.garageRetrofit === 'Unsure') {
        score += 20;
        riskFactors.push('Soft-story garage vulnerability');
        priorityRecommendations.push('EQ_HIGH_PF_GARAGE');
      }

      // Additional earthquake vulnerabilities
      if (auditData.anchoredItems?.length === 0 || !auditData.anchoredItems) {
        score += 10;
        riskFactors.push('Unanchored furniture and appliances');
        priorityRecommendations.push('EQ_LOW_CONTENTS');
      }
      break;

    case 'wind':
      // Roof vulnerabilities - CRITICAL for wind resistance
      if (auditData.roofInspection === 'Never checked' || auditData.roofInspection === 'No' || auditData.roofInspection === 'Unsure') {
        score += 35;
        riskFactors.push('Roof deck not properly sealed or fastened');
        priorityRecommendations.push('WIND_BASIC_ROOF_SEAL');
      }
      
      // Window/door protection - HIGH RISK without shutters
      if (auditData.windowDoorProtection === 'None' || auditData.windowDoorProtection === 'No' || auditData.windowDoorProtection === 'Unsure') {
        score += 30;
        riskFactors.push('No impact-rated windows or shutters');
        priorityRecommendations.push('WIND_INTERMEDIATE_SHUTTERS');
      }
      
      // Continuous load path - STRUCTURAL INTEGRITY
      if (auditData.continuousLoadPath === 'None' || auditData.continuousLoadPath === 'Partial' || auditData.continuousLoadPath === 'No' || auditData.continuousLoadPath === 'Unsure') {
        score += 25;
        riskFactors.push('Missing hurricane straps or continuous load path');
        priorityRecommendations.push('WIND_ADV_CONT_LOAD_PATH');
      }

      // Garage door - common failure point
      if (auditData.garageDoorUpgrade === 'None' || auditData.garageDoorUpgrade === 'No' || auditData.garageDoorUpgrade === 'Unsure') {
        score += 15;
        riskFactors.push('Non-reinforced garage door');
      }

      // Gable end bracing - structural weakness
      if (auditData.gableEndBracing === 'None' || auditData.gableEndBracing === 'No') {
        score += 10;
        riskFactors.push('Unbraced gable ends vulnerable to wind pressure');
      }

      // Attached structures - failure points
      if (auditData.attachedStructures === 'Not tied in' || auditData.attachedStructures === 'No') {
        score += 10;
        riskFactors.push('Attached structures not properly connected');
      }
      break;

    case 'flood':
      // Equipment elevation - CRITICAL for flood zones
      if (auditData.equipmentElevation === 'At flood level' || auditData.equipmentElevation === 'Below flood level') {
        score += 40;
        riskFactors.push('HVAC and utilities at or below flood level');
        priorityRecommendations.push('FLOOD_UTILITY_PLATFORM');
      }
      
      // Building elevation - HIGHEST RISK FACTOR
      if (auditData.equipmentElevation === 'Below flood level') {
        score += 45;
        riskFactors.push('Structure below Base Flood Elevation');
        priorityRecommendations.push('FLOOD_ELEVATE');
      }
      
      // Flood vents - REQUIRED for compliance
      if (auditData.automaticFloodVents === 'No' || auditData.automaticFloodVents === 'One opening') {
        score += 25;
        riskFactors.push('Insufficient or missing engineered flood vents');
        priorityRecommendations.push('FLOOD_WET_FLOODPROOF');
      }
      
      // Appliance platforms - MEDIUM RISK
      if (auditData.appliancePlatforms === 'Ground level') {
        score += 20;
        riskFactors.push('Appliances not elevated above flood level');
        priorityRecommendations.push('FLOOD_UTILITY_PLATFORM');
      }

      // Flood barriers
      if (auditData.floodBarriers === 'None') {
        score += 15;
        riskFactors.push('No temporary flood barriers available');
      }

      // Sump pump
      if (auditData.sumpPump === 'None') {
        score += 10;
        riskFactors.push('No backup drainage system');
      }
      break;

    case 'wildfire':
      // Roof material - CRITICAL ignition point
      if (auditData.roofMaterial !== 'Class A fire-rated' && auditData.roofMaterial !== 'Metal') {
        score += 35;
        riskFactors.push('Non-Class A roof assembly - high ignition risk');
        priorityRecommendations.push('WF_ROOF_CLASS_A');
      }
      
      // Defensible space - ESSENTIAL for survival
      if (auditData.defensibleSpaceWidth === 'Less than 30 feet' || auditData.defensibleSpaceWidth === 'None') {
        score += 40;
        riskFactors.push('Insufficient defensible space - extreme fire risk');
        priorityRecommendations.push('WF_DEFENSIBLE_SPACE');
      } else if (auditData.defensibleSpaceWidth === '30-100 feet') {
        score += 20;
        riskFactors.push('Adequate but not optimal defensible space');
        priorityRecommendations.push('WF_DEFENSIBLE_SPACE');
      }
      
      // Deck and attachments - EMBER ENTRY POINTS
      if (auditData.underElevationFinish === 'Wood decking' || auditData.underElevationFinish === 'Other combustible') {
        score += 25;
        riskFactors.push('Combustible deck materials - ember ignition risk');
        priorityRecommendations.push('WF_DECK_ENCLOSURE');
      }

      // Vent protection - EMBER INTRUSION
      if (auditData.ventProtection === 'No' || auditData.ventProtection === 'Unsure') {
        score += 15;
        riskFactors.push('Unprotected vents allow ember entry');
        priorityRecommendations.push('WF_ACCESSORY_MESH');
      }

      // Vegetation spacing
      if (auditData.vegetationSpacing === 'Touching house' || auditData.vegetationSpacing === 'Within 5 feet') {
        score += 20;
        riskFactors.push('Vegetation too close to structure');
      }
      break;
  }

  return {
    hazard,
    overallScore: Math.min(score, 100),
    riskFactors,
    priorityRecommendations: priorityRecommendations.slice(0, 5) // Top 5 priorities
  };
}

/**********************************************************
 * SECTION 5 – Automated Report Generation
 **********************************************************/

export interface GeneratedReport {
  auditId: number;
  zipCode: string;
  primaryHazard: Hazard;
  riskScores: RiskScore[];
  recommendations: Recommendation[];
  totalEstimatedCost: number;
  totalAnnualSavings: number;
  paybackPeriod: number;
  grantOpportunities: Recommendation[];
  insurancePrograms: InsurancePdf[];
}

export function generateAutomatedReport(auditData: AuditData, primaryHazard: Hazard): GeneratedReport {
  const hazards: Hazard[] = ['earthquake', 'wind', 'flood', 'wildfire'];
  
  // Normalize the primary hazard to ensure it matches our standard types
  const normalizedPrimaryHazard = normalizeHazardInput(primaryHazard);
  
  // Calculate risk scores for all hazards
  const riskScores = hazards.map(hazard => calculateRiskScore(hazard, auditData));
  
  // Get the PRIMARY hazard risk score for focused recommendations
  const primaryRiskScore = riskScores.find(score => score.hazard === normalizedPrimaryHazard);
  
  // FIXED: Filter recommendations to ONLY show primary hazard recommendations
  const primaryRecommendationIds = primaryRiskScore?.priorityRecommendations || [];
  const recommendations = RECOMMENDATION_LIBRARY.filter(rec => 
    rec.hazard === normalizedPrimaryHazard && primaryRecommendationIds.includes(rec.id)
  );
  
  // Sort by tier priority (high > medium > low > basic)
  const tierOrder = { 
    high: 5, 
    medium: 4, 
    low: 3, 
    basic: 2, 
    intermediate: 4, 
    advanced: 3, 
    safe_room: 1 
  };
  recommendations.sort((a, b) => (tierOrder[b.tier] || 0) - (tierOrder[a.tier] || 0));
  
  // Calculate costs and savings based on ONLY primary hazard recommendations
  const totalEstimatedCost = recommendations.reduce((sum, rec) => {
    const avgCost = (rec.costRangeUsd[0] + rec.costRangeUsd[1]) / 2;
    return sum + avgCost;
  }, 0);
  
  // Estimate current premium based on insured value
  const insuredValueMapping = {
    'Under $200,000': 150000,
    '$200,000–$500,000': 350000,
    '$500,000–$1,000,000': 750000,
    'Over $1,000,000': 1200000,
    'Not sure': 350000
  };
  const homeValue = insuredValueMapping[auditData.insuredValue as keyof typeof insuredValueMapping] || 350000;
  const currentPremium = homeValue * 0.008; // Estimate 0.8% of home value for annual premium
  
  const totalAnnualSavings = recommendations.reduce((sum, rec) => {
    const savings = estimateAnnualPremiumSavings(rec.id, currentPremium);
    return sum + (savings || 0);
  }, 0);
  
  const paybackPeriod = totalAnnualSavings > 0 ? Math.round(totalEstimatedCost / totalAnnualSavings) : 0;
  
  // Filter grant opportunities for PRIMARY hazard only
  const grantOpportunities = recommendations.filter(rec => rec.grantProgram);
  
  // Get insurance programs for PRIMARY hazard and high-risk secondary hazards
  const highRiskHazards = riskScores
    .filter(score => score.overallScore > 30)
    .map(score => score.hazard);
  
  // Always include primary hazard in insurance programs
  const relevantHazards = [normalizedPrimaryHazard, ...highRiskHazards.filter(h => h !== normalizedPrimaryHazard)];
  const insurancePrograms = INSURANCE_PDF_LIBRARY.filter(pdf => 
    relevantHazards.includes(pdf.hazard)
  );
  
  return {
    auditId: 0, // Will be set by caller
    zipCode: auditData.zipCode || '',
    primaryHazard: normalizedPrimaryHazard,
    riskScores,
    recommendations,
    totalEstimatedCost,
    totalAnnualSavings,
    paybackPeriod,
    grantOpportunities,
    insurancePrograms
  };
}