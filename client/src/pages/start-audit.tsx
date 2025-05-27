import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { MapPin, ArrowLeft, AlertCircle, Mountain, Wind, Zap, Snowflake, Flame, Droplets, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import HazardMap from "@/components/hazard-map";

// Multi-hazard ZIP code mapping based on Hazard Combo Matrix
const hazardMap = {
  ranges: [
    // California - Wildfire + Earthquake
    { start: 900, end: 961, hazards: ['Wildfire', 'Earthquake'] },
    
    // Florida - Flood + Hurricane
    { start: 320, end: 349, hazards: ['Flood', 'Hurricane'] },
    
    // Texas - Flood + Hurricane
    { start: 750, end: 799, hazards: ['Flood', 'Hurricane'] },
    
    // Colorado - Wildfire only
    { start: 800, end: 816, hazards: ['Wildfire'] },
    
    // Oregon - Wildfire only
    { start: 970, end: 979, hazards: ['Wildfire'] },
    
    // Louisiana - Flood only
    { start: 700, end: 714, hazards: ['Flood'] },
    
    // North Carolina - Hurricane only
    { start: 270, end: 289, hazards: ['Hurricane'] },
    
    // Washington - Earthquake only
    { start: 980, end: 994, hazards: ['Earthquake'] },
  ],
};

function getHazardsForZip(zip: string) {
  const prefix = parseInt(zip.slice(0, 3), 10);
  for (let { start, end, hazards } of hazardMap.ranges) {
    if (prefix >= start && prefix <= end) return hazards;
  }
  return [];
}

export default function StartAudit() {
  const [, setLocation] = useLocation();
  const [zipCode, setZipCode] = useState("");
  const [selectedHazard, setSelectedHazard] = useState<string | null>(null);
  const [showHazardSelection, setShowHazardSelection] = useState(false);
  const [availableHazards, setAvailableHazards] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Get ZIP code from URL if present
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const zipFromUrl = urlParams.get('zip');
    if (zipFromUrl) {
      setZipCode(zipFromUrl);
      handleZipSubmit(zipFromUrl);
    }
  }, []);

  const handleZipSubmit = async (zip?: string) => {
    const targetZip = zip || zipCode;
    if (!targetZip || targetZip.length !== 5) return;

    setIsLoading(true);
    
    try {
      const hazards = getHazardsForZip(targetZip);
      setAvailableHazards(hazards);

      if (hazards.length === 0) {
        alert("No hazard data available for this ZIP code. Please try a different ZIP code.");
        setIsLoading(false);
        return;
      }

      if (hazards.length === 1) {
        // Single hazard - create audit and go directly to questionnaire
        await createAuditAndProceed(targetZip, hazards[0]);
      } else {
        // Multiple hazards - show selection modal
        setShowHazardSelection(true);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error processing ZIP code:', error);
      alert("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const createAuditAndProceed = async (zip: string, hazard: string) => {
    try {
      const response = await fetch('/api/audits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zipCode: zip,
          primaryHazard: hazard,
          status: 'in_progress'
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to create audit: ${response.statusText}`);
      }

      const audit = await response.json();
      setLocation(`/audit-wizard/${audit.id}`);
    } catch (error) {
      console.error('Error creating audit:', error);
      alert("Failed to create audit. Please try again.");
      setIsLoading(false);
    }
  };

  const handleHazardSelection = async (hazard: string) => {
    setSelectedHazard(hazard);
    setShowHazardSelection(false);
    await createAuditAndProceed(zipCode, hazard);
  };

  const hazardIcons = {
    'Earthquake': Mountain,
    'Wildfire': Flame,
    'Hurricane': Wind,
    'Flood': Droplets,
    'Tornado': Wind,
    'Winter Storm': Snowflake
  };

  const hazardColors = {
    'Earthquake': 'bg-red-500',
    'Wildfire': 'bg-orange-500',
    'Hurricane': 'bg-blue-500',
    'Flood': 'bg-blue-600',
    'Tornado': 'bg-purple-500',
    'Winter Storm': 'bg-cyan-500'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-disaster-green-50 to-disaster-green-100">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={() => setLocation("/")}
                className="mr-4 text-gray-600 hover:text-disaster-green-600"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center">
                <Shield className="h-6 w-6 text-disaster-green-600 mr-2" />
                <span className="text-lg font-semibold text-gray-900">Disaster Dodger™</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div className="bg-disaster-green-600 h-2 rounded-full" style={{width: '33%'}}></div>
        </div>
        <p className="text-sm text-gray-600 mb-8">Step 1 of 3: Enter Location</p>
      </div>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-disaster-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="text-white h-8 w-8" />
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Enter Your ZIP Code</h1>
          <p className="text-lg text-gray-600">We'll analyze your area's specific disaster risks</p>
        </div>
        
        {/* ZIP Entry Card */}
        <div className="bg-white shadow-md rounded-lg p-8 mb-8">
          <form onSubmit={(e) => { e.preventDefault(); handleZipSubmit(); }} className="max-w-sm mx-auto">
            <Label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
              ZIP Code
            </Label>
            <div className="flex gap-3">
              <Input
                id="zipCode"
                type="text"
                placeholder="e.g. 90210"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                maxLength={5}
                className="text-center text-lg focus:ring-disaster-green-500 focus:border-disaster-green-500"
                required
              />
              <Button 
                type="submit"
                disabled={zipCode.length !== 5 || isLoading}
                className="bg-disaster-green-600 hover:bg-disaster-green-700 px-6 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-disaster-green-500"
              >
                {isLoading ? (
                  <div className="animate-pulse">Loading...</div>
                ) : (
                  "Analyze"
                )}
              </Button>
            </div>
            <p className="mt-3 text-sm text-gray-500 text-center">
              We'll identify the disaster risks specific to your area
            </p>
          </form>
        </div>

        {/* Hazard Map Display */}
        {zipCode.length === 5 && (
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-lg font-medium mb-4 text-center text-gray-900">Your Area's Hazard Analysis</h2>
            <HazardMap zipCode={zipCode} />
          </div>
        )}

        {/* Hazard Selection Modal */}
        {showHazardSelection && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Choose Your Focus Area</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowHazardSelection(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-gray-600 mb-6">
                Your area has multiple disaster risks. Choose which one you'd like to focus on for this assessment:
              </p>
              <div className="grid grid-cols-1 gap-4">
                {availableHazards.map((hazard) => {
                  const Icon = hazardIcons[hazard as keyof typeof hazardIcons] || AlertCircle;
                  const colorClass = hazardColors[hazard as keyof typeof hazardColors] || 'bg-gray-500';
                  
                  return (
                    <button
                      key={hazard}
                      onClick={() => handleHazardSelection(hazard)}
                      className="bg-white shadow-lg rounded-xl p-4 cursor-pointer hover:shadow-xl transition-shadow border-2 border-transparent hover:border-disaster-green-200 focus:outline-none focus:ring-2 focus:ring-disaster-green-500"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 ${colorClass} rounded-full flex items-center justify-center`}>
                          <Icon className="text-white h-6 w-6" />
                        </div>
                        <div className="text-left">
                          <h4 className="text-lg font-medium text-gray-800">{hazard}</h4>
                          <p className="text-sm text-gray-600">
                            Get tailored recommendations for {hazard.toLowerCase()} preparedness
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}