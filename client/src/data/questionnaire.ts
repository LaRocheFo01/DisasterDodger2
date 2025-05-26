// Comprehensive questionnaire data based on the provided PDF

export interface Question {
  id: string;
  type: 'radio' | 'checkbox' | 'text';
  question: string;
  options?: string[];
  section: string;
}

// Complete questionnaire based on your attached document
export const questionsByHazard: Record<string, Question[]> = {
  Earthquake: [
    // General Questions (7 questions)
    {
      id: 'zipCode',
      type: 'text',
      question: 'ZIP code',
      section: 'General Information'
    },
    {
      id: 'homeType',
      type: 'radio',
      question: 'Home type',
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
      question: 'Year your home was built',
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
      question: 'Ownership status',
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
      question: 'Approximate insured value',
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
      question: 'Do you currently carry any of these policies? (check all)',
      options: [
        'Flood insurance (NFIP or private)',
        'Earthquake insurance',
        'Standard homeowners insurance only',
        'None of the above'
      ],
      section: 'General Information'
    },
    {
      id: 'previousGrants',
      type: 'radio',
      question: 'Have you ever received a home-improvement grant or rebate?',
      options: [
        'Yes',
        'No',
        'Not sure'
      ],
      section: 'General Information'
    },
    
    // Earthquake-Specific Questions (15 questions)
    {
      id: 'waterHeaterSecurity',
      type: 'radio',
      question: 'Water heater security',
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
      question: 'Anchored heavy items (check all)',
      options: [
        'Bookcases',
        'Cabinets',
        'Refrigerator',
        'Electronics',
        'None anchored',
        'Other'
      ],
      section: 'Earthquake Readiness'
    },
    {
      id: 'cabinetLatches',
      type: 'radio',
      question: 'Upper-cabinet latches',
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
      question: 'Electronics stability',
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
      question: 'Gas-shutoff plan',
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
      question: 'Chimney & masonry',
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
      question: 'Garage-below living area',
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
      question: 'Appliance connectors',
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
      question: 'Wood stove or fireplace',
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
      question: 'Family earthquake drill',
      options: [
        'Never practiced',
        'Once a year',
        'Multiple times a year',
        'Not sure'
      ],
      section: 'Earthquake Readiness'
    },
    {
      id: 'emergencyKit',
      type: 'checkbox',
      question: 'Emergency 72-hour kit (check all)',
      options: [
        'Water',
        'Food',
        'First-aid',
        'Flashlight/batteries',
        'None'
      ],
      section: 'Earthquake Readiness'
    },
    {
      id: 'hangingDecor',
      type: 'radio',
      question: 'Hanging décor',
      options: [
        'Hung on nails only',
        'Two-point anchors',
        'Museum-wax putty',
        'Not secured'
      ],
      section: 'Earthquake Readiness'
    },
    {
      id: 'foundationWork',
      type: 'radio',
      question: 'Crawlspace & foundation',
      options: [
        'No work done',
        'Added anchor bolts',
        'Installed shear panels',
        'Not sure'
      ],
      section: 'Earthquake Readiness'
    },
    {
      id: 'ceilingFixtures',
      type: 'radio',
      question: 'Ceiling-hung fixtures',
      options: [
        'Standard screws',
        'Earthquake-rated connectors',
        'Not sure'
      ],
      section: 'Earthquake Readiness'
    },
    {
      id: 'roomByRoomChecklist',
      type: 'radio',
      question: 'Room-by-room checklist',
      options: [
        'Never used FEMA\'s audit',
        'Partially completed',
        'Fully completed',
        'Not sure'
      ],
      section: 'Earthquake Readiness'
    }
  ],

  Hurricane: [
    // Same 7 general questions + 15 hurricane-specific
    {
      id: 'zipCode',
      type: 'text',
      question: 'ZIP code',
      section: 'General Information'
    },
    {
      id: 'homeType',
      type: 'radio',
      question: 'Home type',
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
      question: 'Year your home was built',
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
      question: 'Ownership status',
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
      question: 'Approximate insured value',
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
      question: 'Do you currently carry any of these policies? (check all)',
      options: [
        'Flood insurance (NFIP or private)',
        'Earthquake insurance',
        'Standard homeowners insurance only',
        'None of the above'
      ],
      section: 'General Information'
    },
    {
      id: 'previousGrants',
      type: 'radio',
      question: 'Have you ever received a home-improvement grant or rebate?',
      options: [
        'Yes',
        'No',
        'Not sure'
      ],
      section: 'General Information'
    },

    // Hurricane-Specific Questions (15 questions)
    {
      id: 'roofInspection',
      type: 'radio',
      question: 'Roof-deck inspection',
      options: [
        'Never checked',
        'DIY yearly',
        'Pro inspection',
        'Not sure'
      ],
      section: 'Hurricane & High-Wind Protection'
    },
    {
      id: 'atticVents',
      type: 'radio',
      question: 'Attic vents',
      options: [
        'Standard vents',
        'Wind-resistant covers',
        'Fully sealed',
        'Not sure'
      ],
      section: 'Hurricane & High-Wind Protection'
    },
    {
      id: 'roofCovering',
      type: 'radio',
      question: 'Roof covering',
      options: [
        'Standard shingles',
        'Wind-rated shingles',
        'Metal panels',
        'Not sure'
      ],
      section: 'Hurricane & High-Wind Protection'
    },
    {
      id: 'windowDoorProtection',
      type: 'radio',
      question: 'Window & door protection',
      options: [
        'None',
        'Storm shutters',
        'Impact glazing',
        'Protective film'
      ],
      section: 'Hurricane & High-Wind Protection'
    },
    {
      id: 'garageDoorUpgrade',
      type: 'radio',
      question: 'Garage-door upgrades',
      options: [
        'None',
        'Reinforced panels',
        'Stronger tracks',
        'Not sure'
      ],
      section: 'Hurricane & High-Wind Protection'
    },
    {
      id: 'gableEndBracing',
      type: 'radio',
      question: 'Gable-end bracing',
      options: [
        'None',
        'Added braces',
        'Engineered panels',
        'Not sure'
      ],
      section: 'Hurricane & High-Wind Protection'
    },
    {
      id: 'soffitOverhangs',
      type: 'radio',
      question: 'Soffit/overhangs',
      options: [
        'Unchanged',
        'Reinforced',
        'Fully replaced',
        'Not sure'
      ],
      section: 'Hurricane & High-Wind Protection'
    },
    {
      id: 'chimneyTies',
      type: 'radio',
      question: 'Chimney ties',
      options: [
        'None',
        'Straps only',
        'Straps + anchors',
        'Not sure'
      ],
      section: 'Hurricane & High-Wind Protection'
    },
    {
      id: 'attachedStructures',
      type: 'radio',
      question: 'Attached structures',
      options: [
        'Not tied in',
        'Strapped in',
        'Engineered connectors',
        'Not applicable'
      ],
      section: 'Hurricane & High-Wind Protection'
    },
    {
      id: 'continuousLoadPath',
      type: 'radio',
      question: 'Continuous load path',
      options: [
        'Partial',
        'Complete',
        'Not sure'
      ],
      section: 'Hurricane & High-Wind Protection'
    },
    {
      id: 'sidingMaterial',
      type: 'radio',
      question: 'Siding material',
      options: [
        'Vinyl/wood',
        'Fiber-cement',
        'Masonry/brick',
        'Not sure'
      ],
      section: 'Hurricane & High-Wind Protection'
    },
    {
      id: 'retrofitEvaluation',
      type: 'radio',
      question: 'Post-retrofit evaluation',
      options: [
        'None',
        'Contractor only',
        'Registered professional',
        'Not sure'
      ],
      section: 'Hurricane & High-Wind Protection'
    },
    {
      id: 'gutterAnchors',
      type: 'radio',
      question: 'Gutter & downspout anchors',
      options: [
        'Standard hangers',
        'Reinforced hangers',
        'Wind-rated fasteners',
        'Not sure'
      ],
      section: 'Hurricane & High-Wind Protection'
    },
    {
      id: 'retrofitLevel',
      type: 'radio',
      question: 'Retrofit level chosen',
      options: [
        'Basic',
        'Intermediate',
        'Advanced',
        'Not decided'
      ],
      section: 'Hurricane & High-Wind Protection'
    },
    {
      id: 'completedMeasures',
      type: 'checkbox',
      question: 'Completed measures (check all)',
      options: [
        'Roof-deck reinf.',
        'Storm shutters/film',
        'Garage-door upgrade',
        'Load-path tie-ins',
        'Siding upgrade',
        'None'
      ],
      section: 'Hurricane & High-Wind Protection'
    }
  ],

  Wildfire: [
    // Same 7 general questions + 15 wildfire-specific
    {
      id: 'zipCode',
      type: 'text',
      question: 'ZIP code',
      section: 'General Information'
    },
    {
      id: 'homeType',
      type: 'radio',
      question: 'Home type',
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
      question: 'Year your home was built',
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
      question: 'Ownership status',
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
      question: 'Approximate insured value',
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
      question: 'Do you currently carry any of these policies? (check all)',
      options: [
        'Flood insurance (NFIP or private)',
        'Earthquake insurance',
        'Standard homeowners insurance only',
        'None of the above'
      ],
      section: 'General Information'
    },
    {
      id: 'previousGrants',
      type: 'radio',
      question: 'Have you ever received a home-improvement grant or rebate?',
      options: [
        'Yes',
        'No',
        'Not sure'
      ],
      section: 'General Information'
    },

    // Wildfire-Specific Questions (15 questions)
    {
      id: 'defensibleSpaceWidth',
      type: 'radio',
      question: 'Defensible space width',
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
      question: 'Roof material',
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
      question: 'Ember barriers',
      options: [
        'None',
        'Birdstops only',
        'Fully mortared',
        'Not sure'
      ],
      section: 'Wildfire Hardening'
    },
    {
      id: 'underlaymentType',
      type: 'radio',
      question: 'Underlayment type',
      options: [
        'Standard felt',
        'Mineral cap sheet',
        'Gypsum board',
        'Not sure'
      ],
      section: 'Wildfire Hardening'
    },
    {
      id: 'ventProtection',
      type: 'radio',
      question: 'Vent protection',
      options: [
        'None',
        'Mesh only',
        'Mesh + shutters',
        'Not sure'
      ],
      section: 'Wildfire Hardening'
    },
    {
      id: 'crawlspaceVents',
      type: 'checkbox',
      question: 'Crawlspace & HVAC vents (check all)',
      options: [
        'No mesh',
        '¼″ mesh only',
        'Mesh + shutters',
        'Not sure'
      ],
      section: 'Wildfire Hardening'
    },
    {
      id: 'wallCladding',
      type: 'radio',
      question: 'Wall cladding',
      options: [
        'Vinyl/wood',
        'Fiber-cement/stucco',
        'Masonry',
        'Not sure'
      ],
      section: 'Wildfire Hardening'
    },
    {
      id: 'vegetationSpacing',
      type: 'radio',
      question: 'Vegetation spacing',
      options: [
        'Crowded',
        'Some thinning',
        'Proper spacing',
        'Not sure'
      ],
      section: 'Wildfire Hardening'
    },
    {
      id: 'outbuildingDistance',
      type: 'radio',
      question: 'Outbuilding distance',
      options: [
        '< 10 ft',
        '10 – 50 ft',
        '> 50 ft',
        'No outbuildings'
      ],
      section: 'Wildfire Hardening'
    },
    {
      id: 'patioFurniturePlan',
      type: 'radio',
      question: 'Patio-furniture plan',
      options: [
        'Unprotected',
        'Metal only',
        'Stored indoors',
        'Not sure'
      ],
      section: 'Wildfire Hardening'
    },
    {
      id: 'gutterGuards',
      type: 'radio',
      question: 'Gutter guards',
      options: [
        'None',
        'Plastic guards',
        'Metal guards',
        'Not sure'
      ],
      section: 'Wildfire Hardening'
    },
    {
      id: 'windowGlazing',
      type: 'radio',
      question: 'Window glazing',
      options: [
        'Standard glass',
        'Tempered only',
        'Fire-rated',
        'Not sure'
      ],
      section: 'Wildfire Hardening'
    },
    {
      id: 'entryDoorRating',
      type: 'radio',
      question: 'Entry-door rating',
      options: [
        'Standard',
        'Fire-rated door',
        'Door + fire trim',
        'Not sure'
      ],
      section: 'Wildfire Hardening'
    },
    {
      id: 'siteOrientation',
      type: 'radio',
      question: 'Site orientation',
      options: [
        'No plan',
        'Basic plan',
        'Detailed plan',
        'Not sure'
      ],
      section: 'Wildfire Hardening'
    },
    {
      id: 'underElevationFinish',
      type: 'radio',
      question: 'Under-elevation finish',
      options: [
        'Exposed wood',
        'Noncombustible sheathing',
        'Fire-resistant panels',
        'N/A'
      ],
      section: 'Wildfire Hardening'
    }
  ],

  Flood: [
    // Same 7 general questions + 15 flood-specific
    {
      id: 'zipCode',
      type: 'text',
      question: 'ZIP code',
      section: 'General Information'
    },
    {
      id: 'homeType',
      type: 'radio',
      question: 'Home type',
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
      question: 'Year your home was built',
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
      question: 'Ownership status',
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
      question: 'Approximate insured value',
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
      question: 'Do you currently carry any of these policies? (check all)',
      options: [
        'Flood insurance (NFIP or private)',
        'Earthquake insurance',
        'Standard homeowners insurance only',
        'None of the above'
      ],
      section: 'General Information'
    },
    {
      id: 'previousGrants',
      type: 'radio',
      question: 'Have you ever received a home-improvement grant or rebate?',
      options: [
        'Yes',
        'No',
        'Not sure'
      ],
      section: 'General Information'
    },

    // Flood-Specific Questions (15 questions)
    {
      id: 'equipmentElevation',
      type: 'radio',
      question: 'Equipment elevation',
      options: [
        'Below flood level',
        'At flood level',
        'Above flood level',
        'Not sure'
      ],
      section: 'Flood Mitigation'
    },
    {
      id: 'floodBarriers',
      type: 'radio',
      question: 'Flood barriers',
      options: [
        'None',
        'Removable shields',
        'Low concrete wall',
        'Not sure'
      ],
      section: 'Flood Mitigation'
    },
    {
      id: 'backflowPrevention',
      type: 'radio',
      question: 'Backflow prevention',
      options: [
        'None',
        'Single check valve',
        'Dual backflow valves',
        'Not sure'
      ],
      section: 'Flood Mitigation'
    },
    {
      id: 'appliancePlatforms',
      type: 'radio',
      question: 'Appliance platforms',
      options: [
        'Ground level',
        'Raised platform',
        'Upstairs',
        'Not sure'
      ],
      section: 'Flood Mitigation'
    },
    {
      id: 'houseWrapSeal',
      type: 'radio',
      question: 'House-wrap seal',
      options: [
        'Loose at top',
        'Buried at bottom',
        'Fully sealed',
        'Not sure'
      ],
      section: 'Flood Mitigation'
    },
    {
      id: 'automaticFloodVents',
      type: 'radio',
      question: 'Automatic flood vents',
      options: [
        'None',
        'One opening',
        '≥ 2 on one wall',
        '≥ 2 on two walls'
      ],
      section: 'Flood Mitigation'
    },
    {
      id: 'ventPlacement',
      type: 'radio',
      question: 'Vent placement',
      options: [
        'All on one wall',
        'Spread on two walls',
        'Not sure'
      ],
      section: 'Flood Mitigation'
    },
    {
      id: 'sumpPump',
      type: 'radio',
      question: 'Sump pump',
      options: [
        'None',
        'Pump only',
        'Pump + backup power',
        'Not sure'
      ],
      section: 'Flood Mitigation'
    },
    {
      id: 'fuelTankAnchoring',
      type: 'radio',
      question: 'Fuel-tank anchoring',
      options: [
        'Untethered',
        'Strapped only',
        'Strapped + anchors',
        'Not sure'
      ],
      section: 'Flood Mitigation'
    },
    {
      id: 'floodResistantMaterials',
      type: 'radio',
      question: 'Flood-resistant materials',
      options: [
        'Standard materials',
        'Pressure-treated wood',
        'Concrete/masonry',
        'Not sure'
      ],
      section: 'Flood Mitigation'
    },
    {
      id: 'underSlabDrainage',
      type: 'radio',
      question: 'Under-slab drainage',
      options: [
        'None',
        'Perforated pipe',
        'Stone trench + pipe',
        'Not sure'
      ],
      section: 'Flood Mitigation'
    },
    {
      id: 'electricalLocation',
      type: 'radio',
      question: 'Electrical location',
      options: [
        'Below water line',
        'At water line',
        'Above water line',
        'Not sure'
      ],
      section: 'Flood Mitigation'
    },
    {
      id: 'landscapeSwales',
      type: 'radio',
      question: 'Landscape swales',
      options: [
        'None',
        'Basic grading',
        'Engineered swales',
        'Not sure'
      ],
      section: 'Flood Mitigation'
    },
    {
      id: 'floodShields',
      type: 'radio',
      question: 'Flood shields',
      options: [
        'None',
        'Doors only',
        'Doors & windows',
        'Not sure'
      ],
      section: 'Flood Mitigation'
    },
    {
      id: 'perimeterDrainage',
      type: 'radio',
      question: 'Perimeter drainage',
      options: [
        'None',
        'Gravel trench',
        'Gravel + pipe',
        'Not sure'
      ],
      section: 'Flood Mitigation'
    }
  ]
};

export const getQuestionsForHazard = (hazard: string): Question[] => {
  return questionsByHazard[hazard] || [];
};