// Comprehensive questionnaire data based on the provided PDF

export interface Question {
  id: string;
  type: 'radio' | 'checkbox' | 'text';
  question: string;
  options?: string[];
  section: string;
}

export const questionsByHazard: Record<string, Question[]> = {
  // General Home Information (Asked for all hazards)
  general: [
    {
      id: 'homeType',
      type: 'radio',
      question: 'What type of home do you live in?',
      options: [
        'Single-family detached',
        'Townhouse / rowhouse',
        'Duplex / triplex / four-plex',
        'Condominium / apartment',
        'Mobile home or other'
      ],
      section: 'General Information'
    },
    {
      id: 'yearBuilt',
      type: 'radio',
      question: 'When was your home built?',
      options: [
        'Before 1980',
        '1980 – 1999',
        '2000 – 2010',
        'After 2010',
        'Not sure'
      ],
      section: 'General Information'
    },
    {
      id: 'ownershipStatus',
      type: 'radio',
      question: 'What is your ownership status?',
      options: [
        'Owner-occupied (primary residence)',
        'Secondary home / vacation rental',
        'Investment property / rental'
      ],
      section: 'General Information'
    },
    {
      id: 'insuredValue',
      type: 'radio',
      question: 'What is the approximate insured value of your home?',
      options: [
        'Under $200,000',
        '$200,000–$500,000',
        '$500,000–$1,000,000',
        'Over $1,000,000',
        'Not sure'
      ],
      section: 'General Information'
    },
    {
      id: 'insurancePolicies',
      type: 'checkbox',
      question: 'Do you currently carry any of these policies?',
      options: [
        'Flood insurance (NFIP or private)',
        'Earthquake insurance',
        'Standard homeowners insurance only',
        'None of the above'
      ],
      section: 'General Information'
    }
  ],

  // Earthquake Readiness Questions
  earthquake: [
    {
      id: 'waterHeaterSecurity',
      type: 'radio',
      question: 'How is your water heater secured?',
      options: [
        'Not secured at all',
        'Strapped to wall only',
        'Strapped + flexible connectors',
        'Not sure'
      ],
      section: 'Earthquake Readiness'
    },
    {
      id: 'anchoredItems',
      type: 'checkbox',
      question: 'Which heavy items have you anchored?',
      options: [
        'Bookcases',
        'Cabinets',
        'Refrigerator',
        'Electronics',
        'None anchored'
      ],
      section: 'Earthquake Readiness'
    },
    {
      id: 'cabinetLatches',
      type: 'radio',
      question: 'What type of upper-cabinet latches do you have?',
      options: [
        'No latches',
        'Child-proof latches',
        'Magnetic catches',
        'Not sure'
      ],
      section: 'Earthquake Readiness'
    },
    {
      id: 'electronicsStability',
      type: 'radio',
      question: 'How are your electronics secured?',
      options: [
        'Unsecured',
        'Putty/wax only',
        'Straps or anchors',
        'Not sure'
      ],
      section: 'Earthquake Readiness'
    },
    {
      id: 'gasShutoffPlan',
      type: 'radio',
      question: 'What is your gas shut-off plan?',
      options: [
        'No wrench or plan',
        'Wrench stored, nobody trained',
        'Wrench stored and everyone trained',
        'Not sure'
      ],
      section: 'Earthquake Readiness'
    },
    {
      id: 'chimneyInspection',
      type: 'radio',
      question: 'When was your chimney & masonry last inspected?',
      options: [
        'Never inspected',
        'Inspected over 5 yrs ago',
        'Inspected within 5 yrs',
        'Not sure'
      ],
      section: 'Earthquake Readiness'
    },
    {
      id: 'garageRetrofit',
      type: 'radio',
      question: 'Have you retrofitted your garage below living area?',
      options: [
        'No upgrades',
        'Added shear panels',
        'Installed steel posts',
        'Not applicable / no garage'
      ],
      section: 'Earthquake Readiness'
    },
    {
      id: 'applianceConnectors',
      type: 'radio',
      question: 'What type of appliance connectors do you have?',
      options: [
        'Rigid pipes only',
        'Flexible connectors',
        'Flexible + seismic straps',
        'Not sure'
      ],
      section: 'Earthquake Readiness'
    },
    {
      id: 'woodStoveAnchor',
      type: 'radio',
      question: 'How is your wood stove or fireplace secured?',
      options: [
        'Not secured',
        'Anchored to floor',
        'Anchored + straps',
        'Not sure'
      ],
      section: 'Earthquake Readiness'
    },
    {
      id: 'earthquakeDrill',
      type: 'radio',
      question: 'How often does your family practice earthquake drills?',
      options: [
        'Never practiced',
        'Once a year',
        'Multiple times a year',
        'Not sure'
      ],
      section: 'Earthquake Readiness'
    }
  ],

  // Wildfire Hardening Questions  
  wildfire: [
    {
      id: 'defensibleSpaceWidth',
      type: 'radio',
      question: 'What is your defensible space width?',
      options: [
        '< 10 ft',
        '10 – 30 ft',
        '30 – 50 ft',
        '> 50 ft'
      ],
      section: 'Wildfire Hardening'
    },
    {
      id: 'roofMaterial',
      type: 'radio',
      question: 'What type of roof material do you have?',
      options: [
        'Standard shingles',
        'Class A tile/shingle',
        'Metal panels',
        'Not sure'
      ],
      section: 'Wildfire Hardening'
    },
    {
      id: 'emberBarriers',
      type: 'radio',
      question: 'What ember barriers do you have?',
      options: [
        'None',
        'Birdstops only',
        'Fully mortared',
        'Not sure'
      ],
      section: 'Wildfire Hardening'
    },
    {
      id: 'ventProtection',
      type: 'radio',
      question: 'What vent protection do you have?',
      options: [
        'None',
        'Mesh only',
        'Mesh + shutters',
        'Not sure'
      ],
      section: 'Wildfire Hardening'
    },
    {
      id: 'wallCladding',
      type: 'radio',
      question: 'What type of wall cladding do you have?',
      options: [
        'Vinyl/wood',
        'Fiber-cement/stucco',
        'Masonry',
        'Not sure'
      ],
      section: 'Wildfire Hardening'
    }
  ]
};

export const getQuestionsForHazard = (hazard: string): Question[] => {
  const normalizedHazard = hazard.toLowerCase();
  
  // Map different hazard names to our question sets
  if (normalizedHazard.includes('earthquake') || normalizedHazard.includes('seismic')) {
    return [...questionsByHazard.general, ...questionsByHazard.earthquake];
  }
  if (normalizedHazard.includes('wildfire') || normalizedHazard.includes('fire')) {
    return [...questionsByHazard.general, ...questionsByHazard.wildfire];
  }
  
  // Default to earthquake if no specific hazard matched
  return [...questionsByHazard.general, ...questionsByHazard.earthquake];
};