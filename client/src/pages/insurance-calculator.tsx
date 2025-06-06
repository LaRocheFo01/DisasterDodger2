import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, DollarSign, TrendingDown, Home, ArrowLeft, Shield } from "lucide-react";
import { useLocation } from "wouter";

export default function InsuranceCalculator() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    homeValue: "",
    zipCode: "",
    primaryHazard: "",
    riskLevel: "",
    currentPremium: ""
  });
  const [results, setResults] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateSavings = async () => {
    if (!formData.homeValue || !formData.zipCode || !formData.primaryHazard || !formData.riskLevel) {
      return;
    }

    setIsCalculating(true);
    
    try {
      const response = await fetch('/api/calculate-insurance-savings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          homeValue: parseInt(formData.homeValue),
          zipCode: formData.zipCode,
          primaryHazard: formData.primaryHazard,
          riskLevel: formData.riskLevel,
          currentPremium: formData.currentPremium ? parseInt(formData.currentPremium) : undefined,
          selectedMeasures: ['basic_protection'] // Default measures
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      }
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setLocation('/')}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Button>
              <div className="flex items-center space-x-2">
                <Calculator className="h-6 w-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Insurance Savings Calculator</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Calculate Your Potential
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600"> Insurance Savings</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover how disaster preparedness improvements can reduce your insurance premiums
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Home className="h-5 w-5 text-blue-600" />
                <span>Home Information</span>
              </CardTitle>
              <CardDescription>
                Enter your home details to calculate potential savings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="homeValue">Home Value ($)</Label>
                <Input
                  id="homeValue"
                  type="number"
                  placeholder="e.g., 450000"
                  value={formData.homeValue}
                  onChange={(e) => handleInputChange('homeValue', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  placeholder="e.g., 90210"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="primaryHazard">Primary Natural Hazard</Label>
                <Select value={formData.primaryHazard} onValueChange={(value) => handleInputChange('primaryHazard', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select primary hazard" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="earthquake">Earthquake</SelectItem>
                    <SelectItem value="flood">Flood</SelectItem>
                    <SelectItem value="wildfire">Wildfire</SelectItem>
                    <SelectItem value="wind">Wind/Hurricane</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="riskLevel">Risk Level</Label>
                <Select value={formData.riskLevel} onValueChange={(value) => handleInputChange('riskLevel', value)}>
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

              <div className="space-y-2">
                <Label htmlFor="currentPremium">Current Annual Premium (Optional)</Label>
                <Input
                  id="currentPremium"
                  type="number"
                  placeholder="e.g., 2400"
                  value={formData.currentPremium}
                  onChange={(e) => handleInputChange('currentPremium', e.target.value)}
                />
              </div>

              <Button
                onClick={calculateSavings}
                disabled={isCalculating || !formData.homeValue || !formData.zipCode || !formData.primaryHazard || !formData.riskLevel}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3 text-lg font-semibold"
              >
                {isCalculating ? (
                  <>Calculating...</>
                ) : (
                  <>
                    <Calculator className="mr-2 h-5 w-5" />
                    Calculate Savings
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {results && (
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingDown className="h-5 w-5 text-green-600" />
                  <span>Your Savings Potential</span>
                </CardTitle>
                <CardDescription>
                  Based on your home's risk profile and recommended improvements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">${results.totalSavings?.toLocaleString() || '0'}</div>
                    <div className="text-sm text-green-700">Annual Savings</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{results.savingsPercentage?.toFixed(1) || '0'}%</div>
                    <div className="text-sm text-blue-700">Premium Reduction</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Estimated Premium:</span>
                    <span className="font-semibold">${results.estimatedCurrentPremium?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">New Premium:</span>
                    <span className="font-semibold text-green-600">${results.newPremium?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Investment:</span>
                    <span className="font-semibold">${results.totalCost?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payback Period:</span>
                    <span className="font-semibold">{results.paybackPeriod?.toFixed(1) || '0'} years</span>
                  </div>
                </div>

                {results.recommendations && results.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Recommended Improvements:</h4>
                    <div className="space-y-2">
                      {results.recommendations.slice(0, 3).map((rec: any, index: number) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3">
                          <div className="font-medium">{rec.title}</div>
                          <div className="text-sm text-gray-600">
                            Cost: ${rec.cost?.toLocaleString()} • Annual Savings: ${rec.annualSavings?.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  onClick={() => setLocation('/start-audit')}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 text-lg font-semibold"
                >
                  <Shield className="mr-2 h-5 w-5" />
                  Get Full Safety Assessment
                </Button>
              </CardContent>
            </Card>
          )}

          {!results && (
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle>Why Use Our Calculator?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <DollarSign className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-semibold">Accurate Estimates</h4>
                    <p className="text-sm text-gray-600">Based on real insurance industry data and FEMA guidelines</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-semibold">Personalized Recommendations</h4>
                    <p className="text-sm text-gray-600">Tailored to your specific location and risk profile</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <TrendingDown className="h-5 w-5 text-purple-600 mt-1" />
                  <div>
                    <h4 className="font-semibold">Maximize Savings</h4>
                    <p className="text-sm text-gray-600">Identify the most cost-effective improvements for your home</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}