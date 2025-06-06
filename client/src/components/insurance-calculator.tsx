import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { DollarSign, TrendingDown, Shield, AlertTriangle, CheckCircle, Home, MapPin } from "lucide-react";

interface InsuranceSavings {
  currentPremium: number;
  estimatedSavings: number;
  newPremium: number;
  savingsPercentage: number;
  paybackPeriod: number;
  improvementCost: number;
  recommendations: Array<{
    id: string;
    title: string;
    cost: number;
    savings: number;
    savingsPercent: number;
    description: string;
  }>;
}

// Insurance premium data based on FEMA guidelines and industry standards
const INSURANCE_BASE_RATES = {
  flood: {
    low: { min: 400, max: 800 },
    medium: { min: 800, max: 1500 },
    high: { min: 1500, max: 3500 }
  },
  wind: {
    low: { min: 600, max: 1200 },
    medium: { min: 1200, max: 2500 },
    high: { min: 2500, max: 5000 }
  },
  earthquake: {
    low: { min: 300, max: 600 },
    medium: { min: 600, max: 1200 },
    high: { min: 1200, max: 2800 }
  },
  wildfire: {
    low: { min: 500, max: 1000 },
    medium: { min: 1000, max: 2000 },
    high: { min: 2000, max: 4500 }
  }
};

// Mitigation measures based on FEMA P-series documents
const MITIGATION_MEASURES = {
  flood: [
    {
      id: 'elevation',
      title: 'Elevate Utilities Above Base Flood Elevation',
      costRange: [800, 2500],
      savingsPercent: [10, 25],
      description: 'Elevate HVAC, water heater, and electrical systems above flood level (FEMA P-312)'
    },
    {
      id: 'flood_vents',
      title: 'Install Flood Vents',
      costRange: [300, 1200],
      savingsPercent: [5, 15],
      description: 'Automatic flood vents in foundation walls to reduce hydrostatic pressure'
    },
    {
      id: 'sealant',
      title: 'Apply Flood-Resistant Sealants',
      costRange: [150, 800],
      savingsPercent: [3, 8],
      description: 'Seal foundation cracks and apply waterproof coatings'
    }
  ],
  wind: [
    {
      id: 'roof_strapping',
      title: 'Hurricane Straps and Roof Reinforcement',
      costRange: [2500, 8000],
      savingsPercent: [15, 30],
      description: 'Install hurricane clips and strengthen roof-to-wall connections (FEMA P-804)'
    },
    {
      id: 'impact_windows',
      title: 'Impact-Resistant Windows and Doors',
      costRange: [8000, 25000],
      savingsPercent: [10, 20],
      description: 'Install storm shutters or impact-resistant glazing'
    },
    {
      id: 'garage_door',
      title: 'Reinforce Garage Door',
      costRange: [500, 2000],
      savingsPercent: [5, 12],
      description: 'Upgrade to wind-rated garage door or add bracing'
    }
  ],
  earthquake: [
    {
      id: 'foundation_bolting',
      title: 'Foundation Bolting and Cripple Wall Bracing',
      costRange: [3000, 8000],
      savingsPercent: [15, 25],
      description: 'Bolt house to foundation and brace cripple walls (FEMA P-530)'
    },
    {
      id: 'water_heater_strap',
      title: 'Water Heater Strapping',
      costRange: [50, 200],
      savingsPercent: [2, 5],
      description: 'Secure water heater with flexible straps and connectors'
    },
    {
      id: 'chimney_retrofit',
      title: 'Chimney Reinforcement',
      costRange: [2000, 8000],
      savingsPercent: [8, 15],
      description: 'Reinforce unreinforced masonry chimney'
    }
  ],
  wildfire: [
    {
      id: 'defensible_space',
      title: 'Create Defensible Space',
      costRange: [500, 2500],
      savingsPercent: [5, 15],
      description: 'Clear vegetation 30-100 feet around home (FEMA P-737)'
    },
    {
      id: 'roof_upgrade',
      title: 'Class A Roof Assembly',
      costRange: [14000, 32000],
      savingsPercent: [10, 20],
      description: 'Install fire-resistant roofing materials and ember-resistant vents'
    },
    {
      id: 'siding_upgrade',
      title: 'Ignition-Resistant Siding',
      costRange: [8000, 20000],
      savingsPercent: [8, 18],
      description: 'Replace combustible siding with fire-resistant materials'
    }
  ]
};

export function InsuranceCalculator() {
  const [homeValue, setHomeValue] = useState(300000);
  const [zipCode, setZipCode] = useState("");
  const [primaryHazard, setPrimaryHazard] = useState<string>("");
  const [riskLevel, setRiskLevel] = useState<string>("");
  const [currentPremium, setCurrentPremium] = useState(0);
  const [selectedMeasures, setSelectedMeasures] = useState<string[]>([]);
  const [calculations, setCalculations] = useState<InsuranceSavings | null>(null);

  useEffect(() => {
    if (primaryHazard && riskLevel) {
      estimateCurrentPremium();
    }
  }, [homeValue, primaryHazard, riskLevel]);

  useEffect(() => {
    if (currentPremium > 0 && selectedMeasures.length > 0) {
      calculateSavings();
    }
  }, [currentPremium, selectedMeasures]);

  const estimateCurrentPremium = () => {
    if (!primaryHazard || !riskLevel) return;

    const hazardKey = primaryHazard as keyof typeof INSURANCE_BASE_RATES;
    const levelKey = riskLevel as keyof typeof INSURANCE_BASE_RATES.flood;
    
    if (INSURANCE_BASE_RATES[hazardKey] && INSURANCE_BASE_RATES[hazardKey][levelKey]) {
      const range = INSURANCE_BASE_RATES[hazardKey][levelKey];
      const baseRate = (range.min + range.max) / 2;
      const adjustedPremium = baseRate * (homeValue / 250000); // Adjust for home value
      setCurrentPremium(Math.round(adjustedPremium));
    }
  };

  const calculateSavings = () => {
    if (!primaryHazard || selectedMeasures.length === 0) return;

    const hazardKey = primaryHazard as keyof typeof MITIGATION_MEASURES;
    const measures = MITIGATION_MEASURES[hazardKey];
    
    let totalCost = 0;
    let totalSavingsPercent = 0;
    const recommendations = [];

    for (const measureId of selectedMeasures) {
      const measure = measures.find(m => m.id === measureId);
      if (measure) {
        const avgCost = (measure.costRange[0] + measure.costRange[1]) / 2;
        const avgSavings = (measure.savingsPercent[0] + measure.savingsPercent[1]) / 2;
        
        totalCost += avgCost;
        totalSavingsPercent += avgSavings;
        
        recommendations.push({
          id: measure.id,
          title: measure.title,
          cost: avgCost,
          savings: currentPremium * (avgSavings / 100),
          savingsPercent: avgSavings,
          description: measure.description
        });
      }
    }

    // Cap total savings at 40% (industry standard maximum)
    totalSavingsPercent = Math.min(totalSavingsPercent, 40);
    
    const annualSavings = currentPremium * (totalSavingsPercent / 100);
    const newPremium = currentPremium - annualSavings;
    const paybackPeriod = totalCost / annualSavings;

    setCalculations({
      currentPremium,
      estimatedSavings: annualSavings,
      newPremium,
      savingsPercentage: totalSavingsPercent,
      paybackPeriod,
      improvementCost: totalCost,
      recommendations
    });
  };

  const toggleMeasure = (measureId: string) => {
    setSelectedMeasures(prev => 
      prev.includes(measureId) 
        ? prev.filter(id => id !== measureId)
        : [...prev, measureId]
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="w-6 h-6 text-green-600" />
            <span>Insurance Savings Calculator</span>
          </CardTitle>
          <CardDescription>
            Calculate potential insurance savings from disaster-resistant improvements based on FEMA guidelines
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Home Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zipcode">ZIP Code</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="zipcode"
                  placeholder="Enter ZIP code"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                  maxLength={5}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hazard">Primary Hazard</Label>
              <Select value={primaryHazard} onValueChange={setPrimaryHazard}>
                <SelectTrigger>
                  <SelectValue placeholder="Select primary hazard" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flood">Flood</SelectItem>
                  <SelectItem value="wind">Wind/Hurricane</SelectItem>
                  <SelectItem value="earthquake">Earthquake</SelectItem>
                  <SelectItem value="wildfire">Wildfire</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="risk">Risk Level</Label>
              <Select value={riskLevel} onValueChange={setRiskLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select risk level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Home Value Slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Home Value</Label>
              <span className="text-lg font-semibold text-green-600">
                {formatCurrency(homeValue)}
              </span>
            </div>
            <Slider
              value={[homeValue]}
              onValueChange={(value) => setHomeValue(value[0])}
              max={1000000}
              min={100000}
              step={25000}
              className="w-full"
            />
          </div>

          {/* Current Premium Display */}
          {currentPremium > 0 && (
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Home className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Estimated Current Premium</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">
                  {formatCurrency(currentPremium)}/year
                </span>
              </div>
            </div>
          )}

          {/* Mitigation Measures */}
          {primaryHazard && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span>Select Improvements</span>
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {MITIGATION_MEASURES[primaryHazard as keyof typeof MITIGATION_MEASURES]?.map((measure) => (
                  <div
                    key={measure.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                      selectedMeasures.includes(measure.id)
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                    onClick={() => toggleMeasure(measure.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          {selectedMeasures.includes(measure.id) ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <div className="w-5 h-5 border-2 border-gray-300 rounded" />
                          )}
                          <h4 className="font-medium">{measure.title}</h4>
                        </div>
                        <p className="text-sm text-gray-600 mt-2 ml-7">{measure.description}</p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-sm font-medium">
                          {formatCurrency(measure.costRange[0])} - {formatCurrency(measure.costRange[1])}
                        </div>
                        <div className="text-xs text-green-600">
                          {measure.savingsPercent[0]}% - {measure.savingsPercent[1]}% savings
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {calculations && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <TrendingDown className="w-5 h-5 text-green-600" />
                <span>Savings Calculation</span>
              </h3>
              
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(calculations.estimatedSavings)}
                    </div>
                    <div className="text-sm text-green-700">Annual Savings</div>
                    <div className="text-xs text-green-600">
                      {calculations.savingsPercentage.toFixed(1)}% reduction
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(calculations.newPremium)}
                    </div>
                    <div className="text-sm text-blue-700">New Premium</div>
                    <div className="text-xs text-blue-600">
                      Down from {formatCurrency(calculations.currentPremium)}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-amber-50 border-amber-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-amber-600">
                      {calculations.paybackPeriod.toFixed(1)} years
                    </div>
                    <div className="text-sm text-amber-700">Payback Period</div>
                    <div className="text-xs text-amber-600">
                      Investment: {formatCurrency(calculations.improvementCost)}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Improvement Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {calculations.recommendations.map((rec) => (
                      <div key={rec.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium">{rec.title}</h4>
                          <p className="text-sm text-gray-600">{rec.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-green-600">
                            {formatCurrency(rec.savings)}/year
                          </div>
                          <div className="text-sm text-gray-500">
                            Cost: {formatCurrency(rec.cost)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Disclaimer */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <strong>Disclaimer:</strong> These calculations are estimates based on FEMA guidelines and industry averages. 
                    Actual insurance savings may vary depending on your specific insurer, policy, and local conditions. 
                    Contact your insurance agent for precise quotes and available discounts.
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}