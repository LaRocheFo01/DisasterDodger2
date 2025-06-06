import { Request, Response } from 'express';
import { RECOMMENDATION_LIBRARY, INSURANCE_PDF_LIBRARY, estimateAnnualPremiumSavings, calculatePaybackPeriod } from './automated-report-generator';

interface InsuranceCalculationRequest {
  homeValue: number;
  zipCode: string;
  primaryHazard: 'flood' | 'wind' | 'earthquake' | 'wildfire';
  riskLevel: 'low' | 'medium' | 'high';
  selectedMeasures: string[];
  currentPremium?: number;
}

interface InsuranceCalculationResult {
  estimatedCurrentPremium: number;
  totalSavings: number;
  newPremium: number;
  savingsPercentage: number;
  totalCost: number;
  paybackPeriod: number;
  recommendations: Array<{
    id: string;
    title: string;
    cost: number;
    annualSavings: number;
    savingsPercent: number;
    description: string;
    femaPdf: string;
    femaPage: string;
    grantProgram?: string;
    insuranceProgram?: string;
  }>;
  grantOpportunities: Array<{
    program: string;
    maxAmount: number;
    sharePercent: number;
    eligibleMeasures: string[];
  }>;
  insurancePrograms: Array<{
    name: string;
    description: string;
    eligibleMeasures: string[];
    savingsRange: string;
  }>;
}

// Premium estimation based on NFIP data, wind pool rates, and earthquake authority data
const PREMIUM_ESTIMATORS = {
  flood: {
    low: (homeValue: number) => Math.max(400, homeValue * 0.0015),
    medium: (homeValue: number) => Math.max(800, homeValue * 0.003),
    high: (homeValue: number) => Math.max(1500, homeValue * 0.006)
  },
  wind: {
    low: (homeValue: number) => Math.max(600, homeValue * 0.002),
    medium: (homeValue: number) => Math.max(1200, homeValue * 0.004),
    high: (homeValue: number) => Math.max(2500, homeValue * 0.008)
  },
  earthquake: {
    low: (homeValue: number) => Math.max(300, homeValue * 0.001),
    medium: (homeValue: number) => Math.max(600, homeValue * 0.002),
    high: (homeValue: number) => Math.max(1200, homeValue * 0.004)
  },
  wildfire: {
    low: (homeValue: number) => Math.max(500, homeValue * 0.0018),
    medium: (homeValue: number) => Math.max(1000, homeValue * 0.0035),
    high: (homeValue: number) => Math.max(2000, homeValue * 0.007)
  }
};

// Grant programs from FEMA data
const GRANT_PROGRAMS = {
  BRIC: {
    name: 'Building Resilient Infrastructure and Communities',
    maxAmount: 50000,
    sharePercent: 75,
    eligibleHazards: ['flood', 'wind', 'earthquake', 'wildfire']
  },
  ICC: {
    name: 'Increased Cost of Compliance',
    maxAmount: 30000,
    sharePercent: 100,
    eligibleHazards: ['flood']
  },
  EBB: {
    name: 'Earthquake Brace + Bolt',
    maxAmount: 3000,
    sharePercent: 100,
    eligibleHazards: ['earthquake']
  },
  CEA: {
    name: 'California Earthquake Authority Retrofit',
    maxAmount: 7500,
    sharePercent: 70,
    eligibleHazards: ['earthquake']
  }
};

export async function calculateInsuranceSavings(req: Request, res: Response) {
  try {
    const {
      homeValue,
      zipCode,
      primaryHazard,
      riskLevel,
      selectedMeasures,
      currentPremium
    }: InsuranceCalculationRequest = req.body;

    // Validate input
    if (!homeValue || !primaryHazard || !riskLevel || !selectedMeasures?.length) {
      return res.status(400).json({
        error: 'Missing required fields: homeValue, primaryHazard, riskLevel, selectedMeasures'
      });
    }

    // Estimate current premium if not provided
    const estimatedPremium = currentPremium || 
      Math.round(PREMIUM_ESTIMATORS[primaryHazard][riskLevel](homeValue));

    // Get relevant recommendations
    const relevantRecommendations = RECOMMENDATION_LIBRARY.filter(rec => 
      rec.hazard === primaryHazard && selectedMeasures.includes(rec.id)
    );

    if (relevantRecommendations.length === 0) {
      return res.status(400).json({
        error: 'No valid recommendations found for selected measures'
      });
    }

    // Calculate total costs and savings
    let totalCost = 0;
    let totalSavingsPercent = 0;
    const recommendations = [];

    for (const rec of relevantRecommendations) {
      const avgCost = (rec.costRangeUsd[0] + rec.costRangeUsd[1]) / 2;
      const avgSavingsPercent = rec.premiumSavingsPct 
        ? (rec.premiumSavingsPct[0] + rec.premiumSavingsPct[1]) / 2 
        : 0;
      
      totalCost += avgCost;
      totalSavingsPercent += avgSavingsPercent;
      
      const annualSavings = estimatedPremium * (avgSavingsPercent / 100);
      
      recommendations.push({
        id: rec.id,
        title: rec.title,
        cost: avgCost,
        annualSavings,
        savingsPercent: avgSavingsPercent,
        description: rec.description,
        femaPdf: rec.femaPdf,
        femaPage: rec.femaPage,
        grantProgram: rec.grantProgram,
        insuranceProgram: rec.insuranceProgram
      });
    }

    // Cap total savings at 40% (industry standard)
    totalSavingsPercent = Math.min(totalSavingsPercent, 40);
    const totalSavings = estimatedPremium * (totalSavingsPercent / 100);
    const newPremium = estimatedPremium - totalSavings;
    const paybackPeriod = totalSavings > 0 ? totalCost / totalSavings : Infinity;

    // Find applicable grant programs
    const grantOpportunities = Object.entries(GRANT_PROGRAMS)
      .filter(([_, grant]) => grant.eligibleHazards.includes(primaryHazard))
      .map(([key, grant]) => ({
        program: grant.name,
        maxAmount: grant.maxAmount,
        sharePercent: grant.sharePercent,
        eligibleMeasures: selectedMeasures
      }));

    // Find applicable insurance programs
    const insurancePrograms = INSURANCE_PDF_LIBRARY
      .filter(prog => prog.hazard === primaryHazard)
      .map(prog => ({
        name: prog.title,
        description: prog.summary,
        eligibleMeasures: selectedMeasures,
        savingsRange: prog.creditRange || 'Varies by insurer'
      }));

    const result: InsuranceCalculationResult = {
      estimatedCurrentPremium: estimatedPremium,
      totalSavings,
      newPremium,
      savingsPercentage: totalSavingsPercent,
      totalCost,
      paybackPeriod,
      recommendations,
      grantOpportunities,
      insurancePrograms
    };

    res.json(result);

  } catch (error) {
    console.error('Insurance calculation error:', error);
    res.status(500).json({ error: 'Failed to calculate insurance savings' });
  }
}

export async function getRecommendationsByHazard(req: Request, res: Response) {
  try {
    const { hazard } = req.params;
    
    if (!['flood', 'wind', 'earthquake', 'wildfire'].includes(hazard)) {
      return res.status(400).json({ error: 'Invalid hazard type' });
    }

    const recommendations = RECOMMENDATION_LIBRARY
      .filter(rec => rec.hazard === hazard)
      .map(rec => ({
        id: rec.id,
        title: rec.title,
        description: rec.description,
        costTier: rec.costTier,
        costRange: rec.costRangeUsd,
        premiumSavings: rec.premiumSavingsPct,
        tier: rec.tier,
        femaPdf: rec.femaPdf,
        femaPage: rec.femaPage
      }));

    res.json({ hazard, recommendations });

  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
}