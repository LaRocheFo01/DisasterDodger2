import type { Request, Response } from 'express';
import { storage } from './storage';
import type { Audit } from '@shared/schema';

interface RiskAssessment {
  overallScore: number;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  primaryConcerns: string[];
  strengths: string[];
}

interface Recommendation {
  priority: 'High' | 'Medium' | 'Low';
  category: string;
  title: string;
  description: string;
  estimatedCost: string;
  potentialSavings: string;
  femaGuideline: string;
}

interface GrantOpportunity {
  program: string;
  agency: string;
  maxAmount: string;
  eligibility: string;
  applicationTips: string;
}

// Main report generation endpoint
export async function generateAutomatedReport(req: Request, res: Response) {
  try {
    const auditId = parseInt(req.params.id);
    const audit = await storage.getAudit(auditId);
    
    if (!audit) {
      return res.status(404).json({ message: "Audit not found" });
    }

    // Generate comprehensive report data
    const assessment = calculateRiskAssessment(audit);
    const recommendations = generateRecommendations(audit, assessment);
    const grants = findGrantOpportunities(audit);
    const insuranceInfo = calculateInsuranceSavings(audit, recommendations);
    
    // Generate HTML report with embedded styles
    const html = generateComprehensiveHTMLReport(audit, assessment, recommendations, grants, insuranceInfo);
    
    // Set headers for HTML response that can be saved as PDF
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Content-Disposition", `inline; filename="Disaster_Dodger_Report_${audit.zipCode}_${new Date().toISOString().split('T')[0]}.html"`);
    
    // Mark audit as completed
    await storage.updateAudit(auditId, { completed: true });
    
    res.send(html);

  } catch (error: any) {
    console.error("Report generation error:", error);
    res.status(500).json({ error: "Failed to generate report", details: error.message });
  }
}

// Calculate risk assessment based on audit data
function calculateRiskAssessment(audit: Audit): RiskAssessment {
  let score = 5; // Base score (middle range)
  const concerns: string[] = [];
  const strengths: string[] = [];

  // Hazard-specific scoring
  switch (audit.primaryHazard) {
    case 'Earthquake':
      if (!audit.waterHeaterSecurity || audit.waterHeaterSecurity === 'No') {
        score += 2;
        concerns.push('Unsecured water heater poses significant risk');
      } else {
        score -= 1;
        strengths.push('Water heater properly secured');
      }
      
      if (!audit.gasShutoffPlan || audit.gasShutoffPlan === 'No') {
        score += 1.5;
        concerns.push('No automatic gas shutoff system');
      } else {
        score -= 0.5;
        strengths.push('Gas shutoff plan in place');
      }
      
      if (!audit.foundationWork || audit.foundationWork === 'No') {
        score += 1;
        concerns.push('Foundation may need reinforcement');
      }
      break;

    case 'Wildfire':
      if (!audit.defensibleSpaceWidth || audit.defensibleSpaceWidth === 'Less than 30 feet') {
        score += 2.5;
        concerns.push('Insufficient defensible space around property');
      } else if (audit.defensibleSpaceWidth === '30-100 feet') {
        score -= 0.5;
        strengths.push('Adequate defensible space maintained');
      } else if (audit.defensibleSpaceWidth === 'More than 100 feet') {
        score -= 1;
        strengths.push('Excellent defensible space maintained');
      }
      
      if (!audit.ventProtection || audit.ventProtection === 'No') {
        score += 1.5;
        concerns.push('Vents not protected against embers');
      }
      
      if (audit.roofMaterial === 'Wood shingles' || audit.roofMaterial === 'Wood shake') {
        score += 2;
        concerns.push('Highly flammable roof material');
      } else if (audit.roofMaterial === 'Metal' || audit.roofMaterial === 'Tile') {
        score -= 1;
        strengths.push('Fire-resistant roof material');
      }
      break;

    case 'Flood':
      if (!audit.equipmentElevation || audit.equipmentElevation === 'No') {
        score += 2;
        concerns.push('Critical equipment not elevated above flood level');
      } else {
        score -= 1;
        strengths.push('Equipment properly elevated');
      }
      
      if (!audit.backflowPrevention || audit.backflowPrevention === 'No') {
        score += 1;
        concerns.push('No backflow prevention installed');
      }
      
      if (!audit.sumpPump || audit.sumpPump === 'No') {
        score += 1.5;
        concerns.push('No sump pump system');
      } else {
        score -= 0.5;
        strengths.push('Sump pump installed');
      }
      break;

    case 'Hurricane':
      if (!audit.windowDoorProtection || audit.windowDoorProtection === 'No') {
        score += 2.5;
        concerns.push('Windows and doors not protected against impact');
      } else {
        score -= 1;
        strengths.push('Impact protection installed');
      }
      
      if (!audit.roofInspection || audit.roofInspection === 'No') {
        score += 1.5;
        concerns.push('Roof connections not recently inspected');
      }
      
      if (!audit.garageDoorUpgrade || audit.garageDoorUpgrade === 'No') {
        score += 1;
        concerns.push('Garage door not hurricane-rated');
      }
      break;
  }

  // General preparedness scoring
  if (!audit.waterStorage || audit.waterStorage === 'None') {
    score += 0.5;
    concerns.push('No emergency water storage');
  } else if (audit.waterStorage === '3+ days per person') {
    score -= 0.5;
    strengths.push('Adequate emergency water storage');
  }

  if (!audit.backupPower || audit.backupPower === 'None') {
    score += 0.5;
    concerns.push('No backup power source');
  } else if (audit.backupPower === 'Whole house generator') {
    score -= 1;
    strengths.push('Comprehensive backup power system');
  }

  // Age of home factor
  if (audit.yearBuilt) {
    const year = parseInt(audit.yearBuilt);
    if (year < 1980) {
      score += 1;
      concerns.push('Older home may not meet current building codes');
    } else if (year > 2010) {
      score -= 0.5;
      strengths.push('Home built to modern standards');
    }
  }

  // Normalize score to 1-10 scale
  score = Math.max(1, Math.min(10, score));

  // Determine risk level
  let riskLevel: RiskAssessment['riskLevel'];
  if (score <= 3) riskLevel = 'Low';
  else if (score <= 5) riskLevel = 'Moderate';
  else if (score <= 7) riskLevel = 'High';
  else riskLevel = 'Critical';

  return {
    overallScore: Math.round(score * 10) / 10,
    riskLevel,
    primaryConcerns: concerns,
    strengths: strengths
  };
}

// Generate specific recommendations based on audit data
function generateRecommendations(audit: Audit, assessment: RiskAssessment): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // High priority recommendations based on primary hazard
  switch (audit.primaryHazard) {
    case 'Earthquake':
      if (!audit.waterHeaterSecurity || audit.waterHeaterSecurity === 'No') {
        recommendations.push({
          priority: 'High',
          category: 'Earthquake Safety',
          title: 'Secure Water Heater',
          description: 'Install seismic straps to prevent water heater from tipping during an earthquake. This prevents gas leaks, water damage, and potential fires.',
          estimatedCost: '$75 - $200',
          potentialSavings: 'Up to 5% on earthquake insurance premiums',
          femaGuideline: 'FEMA P-530: Water heaters should be anchored to wall studs with two metal straps'
        });
      }

      if (!audit.gasShutoffPlan || audit.gasShutoffPlan === 'No') {
        recommendations.push({
          priority: 'High',
          category: 'Earthquake Safety',
          title: 'Install Automatic Gas Shutoff Valve',
          description: 'Install a seismic gas shutoff valve that automatically stops gas flow during earthquakes, preventing fires and explosions.',
          estimatedCost: '$300 - $800',
          potentialSavings: 'Potential 10% reduction in fire insurance premiums',
          femaGuideline: 'FEMA recommends automatic gas shutoff valves in high seismic risk areas'
        });
      }

      if (!audit.foundationWork || audit.foundationWork === 'No') {
        recommendations.push({
          priority: 'Medium',
          category: 'Earthquake Safety',
          title: 'Foundation Bolt Retrofit',
          description: 'Add anchor bolts to secure home to foundation, preventing sliding during earthquakes.',
          estimatedCost: '$3,000 - $8,000',
          potentialSavings: 'Up to 25% reduction in earthquake insurance premiums',
          femaGuideline: 'FEMA P-50: Foundation anchorage is critical for preventing structural failure'
        });
      }
      break;

    case 'Wildfire':
      if (!audit.defensibleSpaceWidth || audit.defensibleSpaceWidth === 'Less than 30 feet') {
        recommendations.push({
          priority: 'High',
          category: 'Wildfire Protection',
          title: 'Create Defensible Space',
          description: 'Clear vegetation and combustible materials at least 30 feet from structures. Create fuel breaks with hardscaping or fire-resistant plants.',
          estimatedCost: '$500 - $3,000',
          potentialSavings: 'Up to 15% reduction in fire insurance premiums',
          femaGuideline: 'NFPA 1144: Minimum 30-foot defensible space required in wildfire-prone areas'
        });
      }

      if (audit.roofMaterial === 'Wood shingles' || audit.roofMaterial === 'Wood shake') {
        recommendations.push({
          priority: 'High',
          category: 'Wildfire Protection',
          title: 'Replace Roof with Fire-Resistant Material',
          description: 'Replace combustible roofing with Class A fire-rated materials such as metal, tile, or composite shingles.',
          estimatedCost: '$10,000 - $25,000',
          potentialSavings: 'Up to 20% reduction in fire insurance; may be required for coverage',
          femaGuideline: 'FEMA recommends Class A fire-rated roofing in WUI areas'
        });
      }

      if (!audit.ventProtection || audit.ventProtection === 'No') {
        recommendations.push({
          priority: 'Medium',
          category: 'Wildfire Protection',
          title: 'Install Ember-Resistant Vents',
          description: 'Replace standard vents with 1/8-inch metal mesh screens to prevent ember intrusion.',
          estimatedCost: '$15 - $40 per vent',
          potentialSavings: 'Reduces risk of interior ignition by up to 90%',
          femaGuideline: 'California Building Code Chapter 7A requires ember-resistant vents'
        });
      }
      break;

    case 'Flood':
      if (!audit.equipmentElevation || audit.equipmentElevation === 'No') {
        recommendations.push({
          priority: 'High',
          category: 'Flood Mitigation',
          title: 'Elevate Critical Equipment',
          description: 'Raise HVAC systems, water heaters, and electrical panels at least 12 inches above base flood elevation.',
          estimatedCost: '$500 - $3,000 per unit',
          potentialSavings: 'Up to 30% reduction in flood insurance premiums',
          femaGuideline: 'FEMA Technical Bulletin 7: Utilities must be elevated above BFE'
        });
      }

      if (!audit.sumpPump || audit.sumpPump === 'No') {
        recommendations.push({
          priority: 'High',
          category: 'Flood Mitigation',
          title: 'Install Sump Pump System',
          description: 'Install a sump pump with battery backup to remove water from basement or crawl space.',
          estimatedCost: '$1,000 - $3,000',
          potentialSavings: 'Prevents thousands in water damage; reduces insurance claims',
          femaGuideline: 'FEMA P-312: Sump pumps are essential for properties in flood zones'
        });
      }

      if (!audit.backflowPrevention || audit.backflowPrevention === 'No') {
        recommendations.push({
          priority: 'Medium',
          category: 'Flood Mitigation',
          title: 'Install Backflow Prevention Valves',
          description: 'Install check valves on sewer lines to prevent sewage backup during floods.',
          estimatedCost: '$500 - $1,500',
          potentialSavings: 'Prevents costly sewage cleanup and health hazards',
          femaGuideline: 'FEMA recommends backflow preventers for all flood-prone properties'
        });
      }
      break;

    case 'Hurricane':
      if (!audit.windowDoorProtection || audit.windowDoorProtection === 'No') {
        recommendations.push({
          priority: 'High',
          category: 'Hurricane Protection',
          title: 'Install Impact-Resistant Windows or Shutters',
          description: 'Install hurricane-rated impact windows or approved storm shutters to protect against wind-borne debris.',
          estimatedCost: '$50-$100/sq ft (windows) or $15-$25/sq ft (shutters)',
          potentialSavings: 'Up to 35% reduction in windstorm insurance premiums',
          femaGuideline: 'FEMA P-361: Opening protection is critical for maintaining building envelope'
        });
      }

      if (!audit.roofInspection || audit.roofInspection === 'No') {
        recommendations.push({
          priority: 'High',
          category: 'Hurricane Protection',
          title: 'Roof-to-Wall Connection Reinforcement',
          description: 'Install hurricane straps or clips to strengthen the connection between roof and walls.',
          estimatedCost: '$500 - $2,000',
          potentialSavings: 'Up to 20% reduction in wind insurance premiums',
          femaGuideline: 'FEMA P-499: Proper roof attachment prevents catastrophic failure'
        });
      }

      if (!audit.garageDoorUpgrade || audit.garageDoorUpgrade === 'No') {
        recommendations.push({
          priority: 'Medium',
          category: 'Hurricane Protection',
          title: 'Upgrade to Wind-Rated Garage Door',
          description: 'Replace standard garage door with one rated for your wind zone to prevent failure.',
          estimatedCost: '$1,000 - $3,000',
          potentialSavings: 'Prevents major structural damage; required for insurance in some areas',
          femaGuideline: 'FEMA: Garage doors are often the weakest point in hurricane winds'
        });
      }
      break;
  }

  // General preparedness recommendations
  if (!audit.waterStorage || audit.waterStorage === 'None') {
    recommendations.push({
      priority: 'Medium',
      category: 'Emergency Preparedness',
      title: 'Establish Emergency Water Storage',
      description: 'Store at least 1 gallon per person per day for minimum 3 days. Consider water storage barrels or containers.',
      estimatedCost: '$50 - $200',
      potentialSavings: 'Essential for survival during infrastructure failures',
      femaGuideline: 'FEMA: Store 1 gallon per person per day for at least 3 days'
    });
  }

  if (!audit.backupPower || audit.backupPower === 'None') {
    recommendations.push({
      priority: assessment.riskLevel === 'High' || assessment.riskLevel === 'Critical' ? 'High' : 'Medium',
      category: 'Emergency Preparedness',
      title: 'Install Backup Power System',
      description: 'Install a portable or standby generator to maintain power for critical systems during outages.',
      estimatedCost: '$500 - $5,000+',
      potentialSavings: 'Prevents food loss, maintains heating/cooling, powers medical equipment',
      femaGuideline: 'FEMA recommends backup power for extended outages'
    });
  }

  // Sort by priority
  const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
  recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return recommendations;
}

// Find applicable grant opportunities
function findGrantOpportunities(audit: Audit): GrantOpportunity[] {
  const grants: GrantOpportunity[] = [];

  // FEMA grants
  grants.push({
    program: 'FEMA Hazard Mitigation Grant Program (HMGP)',
    agency: 'Federal Emergency Management Agency',
    maxAmount: 'Up to 75% of project costs',
    eligibility: 'Available after presidential disaster declaration in your area',
    applicationTips: 'Work with local emergency management office; projects must have cost-benefit ratio > 1.0'
  });

  grants.push({
    program: 'FEMA Building Resilient Infrastructure and Communities (BRIC)',
    agency: 'Federal Emergency Management Agency',
    maxAmount: 'Up to $50 million for infrastructure projects',
    eligibility: 'Annual competitive grant; priorities vary by year',
    applicationTips: 'Apply through state emergency management agency; focus on innovation and community benefits'
  });

  // Hazard-specific grants
  switch (audit.primaryHazard) {
    case 'Earthquake':
      grants.push({
        program: 'Earthquake Brace + Bolt Program',
        agency: 'California Earthquake Authority (if applicable)',
        maxAmount: 'Up to $3,000',
        eligibility: 'Homes built before 1980 on raised foundations in high-risk ZIP codes',
        applicationTips: 'Apply during registration period; work must be done by licensed contractor'
      });
      break;

    case 'Wildfire':
      grants.push({
        program: 'CAL FIRE Fire Prevention Grants',
        agency: 'California Department of Forestry (if applicable)',
        maxAmount: 'Varies by project',
        eligibility: 'Properties in State Responsibility Areas or Very High Fire Hazard Severity Zones',
        applicationTips: 'Focus on community-wide benefits; partner with local fire safe council'
      });
      
      grants.push({
        program: 'USDA Community Wildfire Defense Grant',
        agency: 'US Department of Agriculture',
        maxAmount: 'Up to $250,000',
        eligibility: 'Communities at risk from wildfire',
        applicationTips: 'Requires community wildfire protection plan; emphasize at-risk populations'
      });
      break;

    case 'Flood':
      grants.push({
        program: 'FEMA Flood Mitigation Assistance (FMA)',
        agency: 'Federal Emergency Management Agency',
        maxAmount: 'Up to 100% for repetitive loss properties',
        eligibility: 'NFIP-insured properties in participating communities',
        applicationTips: 'Properties with repetitive losses get priority; must maintain flood insurance'
      });
      
      grants.push({
        program: 'HUD Community Development Block Grant-DR',
        agency: 'Housing and Urban Development',
        maxAmount: 'Varies by allocation',
        eligibility: 'Low to moderate income homeowners in declared disaster areas',
        applicationTips: 'Income verification required; administered by state/local government'
      });
      break;

    case 'Hurricane':
      grants.push({
        program: 'My Safe Florida Home Program',
        agency: 'Florida Department of Financial Services (if applicable)',
        maxAmount: 'Up to $10,000 matching funds',
        eligibility: 'Florida homeowners with homes built before 2008',
        applicationTips: 'Free inspections available; grants require matching homeowner funds'
      });
      break;
  }

  // General energy efficiency grants that improve resilience
  grants.push({
    program: 'Weatherization Assistance Program',
    agency: 'Department of Energy',
    maxAmount: 'Average $6,500 per home',
    eligibility: 'Income-qualified homeowners (typically 200% of poverty level)',
    applicationTips: 'Apply through local weatherization agency; can include some disaster resilience measures'
  });

  return grants;
}

// Calculate potential insurance savings
function calculateInsuranceSavings(audit: Audit, recommendations: Recommendation[]): {
  estimatedAnnualSavings: string;
  savingsBreakdown: Array<{improvement: string, savings: string}>;
  paybackPeriod: string;
} {
  let totalSavingsMin = 0;
  let totalSavingsMax = 0;
  const breakdown: Array<{improvement: string, savings: string}> = [];

  // Calculate savings based on implemented improvements
  recommendations.forEach(rec => {
    if (rec.potentialSavings.includes('%')) {
      const match = rec.potentialSavings.match(/(\d+)%/);
      if (match) {
        const percentage = parseInt(match[1]);
        // Assume average premium of $1,200/year for calculation
        const avgPremium = 1200;
        const savings = (avgPremium * percentage) / 100;
        totalSavingsMin += savings * 0.8; // Conservative estimate
        totalSavingsMax += savings * 1.2; // Optimistic estimate
        breakdown.push({
          improvement: rec.title,
          savings: `$${Math.round(savings)}/year`
        });
      }
    }
  });

  // Calculate total improvement costs
  let totalCostMin = 0;
  let totalCostMax = 0;
  recommendations.forEach(rec => {
    const costMatch = rec.estimatedCost.match(/\$?([\d,]+)\s*-\s*\$?([\d,]+)/);
    if (costMatch) {
      totalCostMin += parseInt(costMatch[1].replace(/,/g, ''));
      totalCostMax += parseInt(costMatch[2].replace(/,/g, ''));
    }
  });

  const avgCost = (totalCostMin + totalCostMax) / 2;
  const avgSavings = (totalSavingsMin + totalSavingsMax) / 2;
  const paybackYears = avgSavings > 0 ? Math.round(avgCost / avgSavings) : 0;

  return {
    estimatedAnnualSavings: avgSavings > 0 ? `$${Math.round(totalSavingsMin)} - $${Math.round(totalSavingsMax)}` : 'Varies by insurer',
    savingsBreakdown: breakdown,
    paybackPeriod: paybackYears > 0 ? `${paybackYears} years` : 'Varies by improvement'
  };
}

// Generate comprehensive HTML report
function generateComprehensiveHTMLReport(
  audit: Audit,
  assessment: RiskAssessment,
  recommendations: Recommendation[],
  grants: GrantOpportunity[],
  insuranceInfo: ReturnType<typeof calculateInsuranceSavings>
): string {
  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const riskColors = {
    'Low': '#10B981',
    'Moderate': '#F59E0B',
    'High': '#EF4444',
    'Critical': '#7C3AED'
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Disaster Dodger™ Comprehensive Safety Report - ${audit.zipCode}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        @page {
            size: letter;
            margin: 0.75in;
        }
        
        @media print {
            .no-print {
                display: none !important;
            }
            
            .page-break {
                page-break-after: always;
            }
            
            .avoid-break {
                page-break-inside: avoid;
            }
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1F2937;
            background: #F9FAFB;
        }
        
        .container {
            max-width: 850px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        
        /* Header Styles */
        .header {
            background: linear-gradient(135deg, #16A34A 0%, #10B981 100%);
            color: white;
            padding: 3rem 2rem;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
            font-weight: 700;
        }
        
        .header .subtitle {
            font-size: 1.25rem;
            opacity: 0.9;
        }
        
        /* Content Styles */
        .content {
            padding: 2rem;
        }
        
        /* Risk Score Display */
        .risk-score-section {
            background: #F3F4F6;
            border-radius: 12px;
            padding: 2rem;
            margin-bottom: 2rem;
            text-align: center;
        }
        
        .risk-score-container {
            display: inline-block;
            position: relative;
            width: 200px;
            height: 200px;
        }
        
        .risk-score-circle {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: conic-gradient(
                ${riskColors[assessment.riskLevel]} 0deg,
                ${riskColors[assessment.riskLevel]} ${(assessment.overallScore / 10) * 360}deg,
                #E5E7EB ${(assessment.overallScore / 10) * 360}deg
            );
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }
        
        .risk-score-inner {
            width: 160px;
            height: 160px;
            background: white;
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        
        .risk-score-number {
            font-size: 3rem;
            font-weight: 700;
            color: ${riskColors[assessment.riskLevel]};
        }
        
        .risk-score-label {
            font-size: 1.25rem;
            color: #6B7280;
            font-weight: 600;
        }
        
        .risk-level {
            font-size: 1.5rem;
            font-weight: 700;
            color: ${riskColors[assessment.riskLevel]};
            margin-top: 1rem;
        }
        
        /* Section Styles */
        .section {
            margin-bottom: 2rem;
        }
        
        .section-title {
            font-size: 1.75rem;
            color: #0F4C81;
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 3px solid #16A34A;
        }
        
        /* Info Grid */
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
        }
        
        .info-card {
            background: #F9FAFB;
            border: 1px solid #E5E7EB;
            border-radius: 8px;
            padding: 1rem;
        }
        
        .info-label {
            font-size: 0.875rem;
            color: #6B7280;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        
        .info-value {
            font-size: 1.125rem;
            color: #1F2937;
            margin-top: 0.25rem;
            font-weight: 500;
        }
        
        /* Concerns and Strengths */
        .assessment-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        
        @media (max-width: 768px) {
            .assessment-grid {
                grid-template-columns: 1fr;
            }
        }
        
        .assessment-box {
            border-radius: 8px;
            padding: 1.5rem;
        }
        
        .concerns-box {
            background: #FEF2F2;
            border: 1px solid #FEE2E2;
        }
        
        .strengths-box {
            background: #F0FDF4;
            border: 1px solid #D1FAE5;
        }
        
        .assessment-box h3 {
            margin-bottom: 1rem;
            font-size: 1.25rem;
        }
        
        .concerns-box h3 {
            color: #DC2626;
        }
        
        .strengths-box h3 {
            color: #059669;
        }
        
        .assessment-list {
            list-style: none;
        }
        
        .assessment-list li {
            margin-bottom: 0.5rem;
            padding-left: 1.5rem;
            position: relative;
        }
        
        .assessment-list li:before {
            content: "•";
            position: absolute;
            left: 0.5rem;
            font-weight: bold;
        }
        
        .concerns-box li:before {
            color: #DC2626;
        }
        
        .strengths-box li:before {
            color: #059669;
        }
        
        /* Recommendations */
        .recommendation-card {
            background: white;
            border: 1px solid #E5E7EB;
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 1rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            transition: transform 0.2s;
        }
        
        .recommendation-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .recommendation-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1rem;
        }
        
        .recommendation-title {
            font-size: 1.25rem;
            color: #1F2937;
            font-weight: 600;
            flex: 1;
        }
        
        .priority-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.875rem;
            font-weight: 600;
            white-space: nowrap;
        }
        
        .priority-high {
            background: #FEE2E2;
            color: #DC2626;
        }
        
        .priority-medium {
            background: #FEF3C7;
            color: #D97706;
        }
        
        .priority-low {
            background: #E0E7FF;
            color: #4F46E5;
        }
        
        .recommendation-details {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 1rem;
        }
        
        .detail-item {
            background: #F9FAFB;
            padding: 0.75rem;
            border-radius: 6px;
        }
        
        .detail-label {
            font-size: 0.75rem;
            color: #6B7280;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        
        .detail-value {
            font-size: 1rem;
            color: #1F2937;
            font-weight: 600;
            margin-top: 0.25rem;
        }
        
        .recommendation-description {
            color: #4B5563;
            margin-bottom: 1rem;
            line-height: 1.7;
        }
        
        .fema-quote {
            background: #EEF2FF;
            border-left: 4px solid #4F46E5;
            padding: 1rem;
            margin-top: 1rem;
            font-style: italic;
            color: #4B5563;
        }
        
        /* Grant Opportunities */
        .grant-card {
            background: #F0FDF4;
            border: 1px solid #BBF7D0;
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 1rem;
        }
        
        .grant-header {
            font-size: 1.125rem;
            color: #059669;
            font-weight: 600;
            margin-bottom: 0.5rem;
        }
        
        .grant-agency {
            color: #6B7280;
            font-size: 0.875rem;
            margin-bottom: 1rem;
        }
        
        .grant-details {
            display: grid;
            gap: 0.75rem;
        }
        
        .grant-detail {
            display: flex;
            align-items: flex-start;
        }
        
        .grant-detail-label {
            font-weight: 600;
            color: #374151;
            min-width: 100px;
        }
        
        .grant-detail-value {
            color: #4B5563;
            flex: 1;
        }
        
        /* Insurance Savings */
        .savings-summary {
            background: linear-gradient(135deg, #F0FDF4 0%, #D1FAE5 100%);
            border-radius: 12px;
            padding: 2rem;
            text-align: center;
            margin-bottom: 2rem;
        }
        
        .savings-amount {
            font-size: 2.5rem;
            font-weight: 700;
            color: #059669;
            margin-bottom: 0.5rem;
        }
        
        .savings-label {
            color: #047857;
            font-size: 1.125rem;
        }
        
        .savings-breakdown {
            margin-top: 1.5rem;
            background: white;
            border-radius: 8px;
            padding: 1rem;
        }
        
        .savings-item {
            display: flex;
            justify-content: space-between;
            padding: 0.5rem 0;
            border-bottom: 1px solid #E5E7EB;
        }
        
        .savings-item:last-child {
            border-bottom: none;
        }
        
        /* Action Buttons */
        .action-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin: 2rem 0;
            flex-wrap: wrap;
        }
        
        .btn {
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.2s;
            border: none;
            cursor: pointer;
        }
        
        .btn-primary {
            background: #16A34A;
            color: white;
        }
        
        .btn-primary:hover {
            background: #15803D;
        }
        
        .btn-secondary {
            background: #6B7280;
            color: white;
        }
        
        .btn-secondary:hover {
            background: #4B5563;
        }
        
        /* Footer */
        .footer {
            background: #1F2937;
            color: white;
            padding: 2rem;
            text-align: center;
            margin-top: 3rem;
        }
        
        .footer p {
            margin-bottom: 0.5rem;
            opacity: 0.9;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .header h1 {
                font-size: 2rem;
            }
            
            .content {
                padding: 1rem;
            }
            
            .recommendation-header {
                flex-direction: column;
                gap: 0.5rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>Disaster Dodger™</h1>
            <p class="subtitle">Comprehensive Home Safety Assessment Report</p>
        </div>
        
        <!-- Content -->
        <div class="content">
            <!-- Property Information -->
            <section class="section">
                <div class="info-grid">
                    <div class="info-card">
                        <div class="info-label">Property Location</div>
                        <div class="info-value">${audit.zipCode}</div>
                    </div>
                    <div class="info-card">
                        <div class="info-label">Primary Hazard</div>
                        <div class="info-value">${audit.primaryHazard}</div>
                    </div>
                    <div class="info-card">
                        <div class="info-label">Assessment Date</div>
                        <div class="info-value">${reportDate}</div>
                    </div>
                    ${audit.homeType ? `
                    <div class="info-card">
                        <div class="info-label">Home Type</div>
                        <div class="info-value">${audit.homeType}</div>
                    </div>
                    ` : ''}
                    ${audit.yearBuilt ? `
                    <div class="info-card">
                        <div class="info-label">Year Built</div>
                        <div class="info-value">${audit.yearBuilt}</div>
                    </div>
                    ` : ''}
                    ${audit.foundationType ? `
                    <div class="info-card">
                        <div class="info-label">Foundation Type</div>
                        <div class="info-value">${audit.foundationType}</div>
                    </div>
                    ` : ''}
                </div>
            </section>
            
            <!-- Risk Assessment -->
            <section class="section">
                <h2 class="section-title">Risk Assessment Summary</h2>
                
                <div class="risk-score-section">
                    <div class="risk-score-container">
                        <div class="risk-score-circle">
                            <div class="risk-score-inner">
                                <div class="risk-score-number">${assessment.overallScore}</div>
                                <div class="risk-score-label">Risk Score</div>
                            </div>
                        </div>
                    </div>
                    <div class="risk-level">Risk Level: ${assessment.riskLevel}</div>
                </div>
                
                <div class="assessment-grid">
                    ${assessment.primaryConcerns.length > 0 ? `
                    <div class="assessment-box concerns-box">
                        <h3>Primary Concerns</h3>
                        <ul class="assessment-list">
                            ${assessment.primaryConcerns.map(concern => `<li>${concern}</li>`).join('')}
                        </ul>
                    </div>
                    ` : ''}
                    
                    ${assessment.strengths.length > 0 ? `
                    <div class="assessment-box strengths-box">
                        <h3>Existing Strengths</h3>
                        <ul class="assessment-list">
                            ${assessment.strengths.map(strength => `<li>${strength}</li>`).join('')}
                        </ul>
                    </div>
                    ` : ''}
                </div>
            </section>
            
            <div class="page-break"></div>
            
            <!-- Priority Recommendations -->
            <section class="section">
                <h2 class="section-title">Priority Recommendations</h2>
                
                ${recommendations.map(rec => `
                <div class="recommendation-card avoid-break">
                    <div class="recommendation-header">
                        <h3 class="recommendation-title">${rec.title}</h3>
                        <span class="priority-badge priority-${rec.priority.toLowerCase()}">${rec.priority} Priority</span>
                    </div>
                    
                    <p class="recommendation-description">${rec.description}</p>
                    
                    <div class="recommendation-details">
                        <div class="detail-item">
                            <div class="detail-label">Estimated Cost</div>
                            <div class="detail-value">${rec.estimatedCost}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Insurance Savings</div>
                            <div class="detail-value">${rec.potentialSavings}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Category</div>
                            <div class="detail-value">${rec.category}</div>
                        </div>
                    </div>
                    
                    <div class="fema-quote">
                        <strong>FEMA Guidance:</strong> ${rec.femaGuideline}
                    </div>
                </div>
                `).join('')}
            </section>
            
            <div class="page-break"></div>
            
            <!-- Insurance Savings Summary -->
            ${insuranceInfo.estimatedAnnualSavings !== 'Varies by insurer' ? `
            <section class="section">
                <h2 class="section-title">Potential Insurance Savings</h2>
                
                <div class="savings-summary">
                    <div class="savings-amount">${insuranceInfo.estimatedAnnualSavings}</div>
                    <div class="savings-label">Estimated Annual Savings</div>
                    
                    ${insuranceInfo.savingsBreakdown.length > 0 ? `
                    <div class="savings-breakdown">
                        <h4 style="margin-bottom: 1rem; color: #374151;">Savings Breakdown</h4>
                        ${insuranceInfo.savingsBreakdown.map(item => `
                        <div class="savings-item">
                            <span>${item.improvement}</span>
                            <span style="font-weight: 600; color: #059669;">${item.savings}</span>
                        </div>
                        `).join('')}
                    </div>
                    ` : ''}
                    
                    <p style="margin-top: 1rem; color: #047857;">
                        Estimated payback period: <strong>${insuranceInfo.paybackPeriod}</strong>
                    </p>
                </div>
                
                <p style="text-align: center; color: #6B7280; margin-top: 1rem; font-size: 0.875rem;">
                    * Savings vary by insurance carrier and policy. Contact your insurer for specific discounts.
                </p>
            </section>
            ` : ''}
            
            <!-- Grant Opportunities -->
            <section class="section">
                <h2 class="section-title">Available Grant Opportunities</h2>
                
                ${grants.map(grant => `
                <div class="grant-card avoid-break">
                    <h3 class="grant-header">${grant.program}</h3>
                    <p class="grant-agency">${grant.agency}</p>
                    
                    <div class="grant-details">
                        <div class="grant-detail">
                            <span class="grant-detail-label">Max Amount:</span>
                            <span class="grant-detail-value">${grant.maxAmount}</span>
                        </div>
                        <div class="grant-detail">
                            <span class="grant-detail-label">Eligibility:</span>
                            <span class="grant-detail-value">${grant.eligibility}</span>
                        </div>
                        <div class="grant-detail">
                            <span class="grant-detail-label">Tips:</span>
                            <span class="grant-detail-value">${grant.applicationTips}</span>
                        </div>
                    </div>
                </div>
                `).join('')}
            </section>
            
            <!-- Action Buttons -->
            <div class="action-buttons no-print">
                <button class="btn btn-primary" onclick="window.print()">Save as PDF</button>
                <button class="btn btn-secondary" onclick="window.location.href='mailto:?subject=Disaster Dodger Report&body=View my home safety assessment report'">Share Report</button>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <p>© ${new Date().getFullYear()} Disaster Dodger™. All rights reserved.</p>
            <p>This report is for informational purposes only. Consult with qualified professionals for implementation.</p>
            <p style="font-size: 0.875rem; opacity: 0.7; margin-top: 1rem;">
                Report generated on ${reportDate} based on property assessment data.
            </p>
        </div>
    </div>
    
    <script>
        // Auto-save reminder
        if (!window.location.href.includes('pdf')) {
            setTimeout(() => {
                if (confirm('Would you like to save this report as a PDF?')) {
                    window.print();
                }
            }, 3000);
        }
    </script>
</body>
</html>
  `;
}