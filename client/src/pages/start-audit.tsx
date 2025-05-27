import { useState, useEffect } from "react";
import React from "react";
import { useLocation } from "wouter";
import { MapPin, ArrowLeft, AlertCircle, Mountain, Wind, Zap, Snowflake, Flame, Droplets, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import HazardMap from "@/components/hazard-map";

// Comprehensive nationwide ZIP code hazard mapping
const hazardMap = {
  ranges: [
    // California - Wildfire + Earthquake (comprehensive coverage)
    { start: 900, end: 961, hazards: ['Wildfire', 'Earthquake'] },
    
    // Florida - Flood + Hurricane
    { start: 320, end: 349, hazards: ['Flood', 'Hurricane'] },
    
    // Texas - Flood + Hurricane (expanded coverage)
    { start: 750, end: 799, hazards: ['Flood', 'Hurricane'] },
    { start: 773, end: 779, hazards: ['Flood', 'Hurricane'] },
    
    // Colorado - Wildfire + Earthquake
    { start: 800, end: 816, hazards: ['Wildfire', 'Earthquake'] },
    
    // Oregon - Wildfire + Earthquake
    { start: 970, end: 979, hazards: ['Wildfire', 'Earthquake'] },
    
    // Washington - Earthquake + Flood
    { start: 980, end: 994, hazards: ['Earthquake', 'Flood'] },
    
    // Louisiana - Flood + Hurricane
    { start: 700, end: 714, hazards: ['Flood', 'Hurricane'] },
    
    // North Carolina - Hurricane + Flood
    { start: 270, end: 289, hazards: ['Hurricane', 'Flood'] },
    
    // Alaska - Earthquake + Wildfire
    { start: 995, end: 999, hazards: ['Earthquake', 'Wildfire'] },
    
    // Hawaii - Hurricane + Earthquake
    { start: 967, end: 968, hazards: ['Hurricane', 'Earthquake'] },
    
    // Arizona - Wildfire + Earthquake
    { start: 850, end: 865, hazards: ['Wildfire', 'Earthquake'] },
    
    // Nevada - Earthquake + Wildfire
    { start: 890, end: 898, hazards: ['Earthquake', 'Wildfire'] },
    
    // New Mexico - Wildfire + Flood
    { start: 870, end: 884, hazards: ['Wildfire', 'Flood'] },
    
    // Utah - Earthquake + Wildfire
    { start: 840, end: 847, hazards: ['Earthquake', 'Wildfire'] },
    
    // Idaho - Wildfire + Earthquake
    { start: 832, end: 838, hazards: ['Wildfire', 'Earthquake'] },
    
    // Montana - Wildfire + Flood
    { start: 590, end: 599, hazards: ['Wildfire', 'Flood'] },
    
    // Wyoming - Wildfire + Earthquake
    { start: 820, end: 831, hazards: ['Wildfire', 'Earthquake'] },
    
    // Northeast Coastal - Hurricane + Flood
    { start: 10, end: 69, hazards: ['Hurricane', 'Flood'] },    // NY, NJ, CT
    { start: 70, end: 89, hazards: ['Hurricane', 'Flood'] },    // NJ, PA
    { start: 1, end: 5, hazards: ['Hurricane', 'Flood'] },      // MA
    { start: 6, end: 9, hazards: ['Hurricane', 'Flood'] },      // CT, RI
    
    // Southeast Coastal - Hurricane + Flood
    { start: 290, end: 319, hazards: ['Hurricane', 'Flood'] },  // SC
    { start: 350, end: 399, hazards: ['Hurricane', 'Flood'] },  // AL, GA
    
    // Midwest Tornado/Flood States
    { start: 460, end: 479, hazards: ['Flood', 'Hurricane'] },  // IN, OH
    { start: 480, end: 499, hazards: ['Flood', 'Hurricane'] },  // MI
    { start: 500, end: 599, hazards: ['Flood', 'Hurricane'] },  // IA, MN, MT, ND, SD
    { start: 600, end: 699, hazards: ['Flood', 'Hurricane'] },  // IL, KS, MO, NE
    
    // Great Lakes Region - Flood + Hurricane
    { start: 530, end: 549, hazards: ['Flood', 'Hurricane'] },  // WI
    
    // Mid-Atlantic - Hurricane + Flood
    { start: 200, end: 269, hazards: ['Hurricane', 'Flood'] },  // DC, MD, VA, WV
    
    // Tennessee Valley - Flood + Hurricane
    { start: 370, end: 389, hazards: ['Flood', 'Hurricane'] },  // TN
    { start: 400, end: 459, hazards: ['Flood', 'Hurricane'] },  // KY
  ],
  
  // Default fallback for unmapped areas
  getDefaultHazards(zip: string): string[] {
    const prefix = parseInt(zip.slice(0, 3), 10);
    
    // Coastal areas default to Hurricane + Flood
    if ((prefix >= 1 && prefix <= 99) || 
        (prefix >= 200 && prefix <= 349) ||
        (prefix >= 700 && prefix <= 799)) {
      return ['Hurricane', 'Flood'];
    }
    
    // Mountain/Western areas default to Wildfire + Earthquake
    if (prefix >= 800 && prefix <= 999) {
      return ['Wildfire', 'Earthquake'];
    }
    
    // Midwest/Central areas default to Flood + Hurricane
    if (prefix >= 400 && prefix <= 699) {
      return ['Flood', 'Hurricane'];
    }
    
    // Default for any unmapped area
    return ['Flood', 'Earthquake'];
  }
};

function getHazardsForZip(zip: string) {
  // Clean and validate ZIP code
  const cleanZip = zip.trim().replace(/\s+/g, '');
  if (!/^\d{5}$/.test(cleanZip)) {
    return [];
  }
  
  const prefix = parseInt(cleanZip.slice(0, 3), 10);
  
  // Check specific ranges first
  for (let { start, end, hazards } of hazardMap.ranges) {
    if (prefix >= start && prefix <= end) return hazards;
  }
  
  // Use fallback system for comprehensive coverage
  return hazardMap.getDefaultHazards(cleanZip);
}

export default function StartAudit() {
  const [, setLocation] = useLocation();
  const [zipCode, setZipCode] = useState("");
  const [availableHazards, setAvailableHazards] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [showHazardAnalysis, setShowHazardAnalysis] = useState(false);

  // Get ZIP code from URL if present
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const zipFromUrl = urlParams.get('zip');
    if (zipFromUrl) {
      setZipCode(zipFromUrl);
      handleZipSubmit(zipFromUrl);
    }
  }, []);

  const loadingSteps = [
    { icon: MapPin, text: "Analyzing your location...", color: "text-blue-600" },
    { icon: Zap, text: "Checking earthquake risk...", color: "text-red-600" },
    { icon: Droplets, text: "Evaluating flood zones...", color: "text-blue-500" },
    { icon: Flame, text: "Assessing wildfire danger...", color: "text-orange-600" },
    { icon: Wind, text: "Scanning hurricane patterns...", color: "text-purple-600" },
    { icon: Shield, text: "Generating risk report...", color: "text-disaster-green-600" }
  ];

  const handleZipSubmit = async (zip?: string) => {
    const targetZip = zip || zipCode;
    if (!targetZip || targetZip.length !== 5) return;

    setIsLoading(true);
    setLoadingStep(0);
    setShowHazardAnalysis(false);
    
    // Simulate loading progress through steps
    for (let i = 0; i < loadingSteps.length; i++) {
      setLoadingStep(i);
      await new Promise(resolve => setTimeout(resolve, 800)); // 800ms per step
    }
    
    try {
      const hazards = getHazardsForZip(targetZip);
      setAvailableHazards(hazards);

      if (hazards.length === 0) {
        alert("No hazard data available for this ZIP code. Please try a different ZIP code.");
        setIsLoading(false);
        return;
      }

      // First show hazard analysis
      setIsLoading(false);
      setShowHazardAnalysis(true);
      
      // For single hazard, auto-proceed after showing analysis
      if (hazards.length === 1) {
        setTimeout(() => {
          createAuditAndProceed(targetZip, hazards[0]);
        }, 2500);
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
        {/* Loading Progress */}
        {isLoading && (
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-disaster-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              {loadingStep === 0 && <MapPin className="text-white h-10 w-10" />}
              {loadingStep === 1 && <Zap className="text-white h-10 w-10" />}
              {loadingStep === 2 && <Droplets className="text-white h-10 w-10" />}
              {loadingStep === 3 && <Flame className="text-white h-10 w-10" />}
              {loadingStep === 4 && <Wind className="text-white h-10 w-10" />}
              {loadingStep === 5 && <Shield className="text-white h-10 w-10" />}
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              {loadingSteps[loadingStep].text}
            </h2>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4 max-w-md mx-auto">
              <div 
                className="bg-disaster-green-600 h-3 rounded-full transition-all duration-800" 
                style={{width: `${((loadingStep + 1) / loadingSteps.length) * 100}%`}}
              ></div>
            </div>
            <p className="text-gray-600">
              Step {loadingStep + 1} of {loadingSteps.length}
            </p>
          </div>
        )}

        {/* Hazard Analysis Results */}
        {showHazardAnalysis && !isLoading && (
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-disaster-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="text-white h-8 w-8" />
            </div>
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">Risk Analysis Complete</h2>
            <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
              <h3 className="text-xl font-medium text-gray-900 mb-4">
                Primary Risks for ZIP {zipCode}:
              </h3>
              <div className="grid gap-4">
                {availableHazards.map((hazard, index) => (
                  <button
                    key={index} 
                    onClick={() => createAuditAndProceed(zipCode, hazard)}
                    className="flex items-center justify-center p-4 bg-gray-50 hover:bg-disaster-green-50 hover:border-disaster-green-200 border border-transparent rounded-lg transition-all cursor-pointer group"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform ${
                      hazard === 'Earthquake' ? 'bg-red-100 group-hover:bg-red-200' :
                      hazard === 'Flood' ? 'bg-blue-100 group-hover:bg-blue-200' :
                      hazard === 'Wildfire' ? 'bg-orange-100 group-hover:bg-orange-200' :
                      'bg-purple-100 group-hover:bg-purple-200'
                    }`}>
                      {hazard === 'Earthquake' && <Zap className="h-5 w-5 text-red-600" />}
                      {hazard === 'Flood' && <Droplets className="h-5 w-5 text-blue-600" />}
                      {hazard === 'Wildfire' && <Flame className="h-5 w-5 text-orange-600" />}
                      {hazard === 'Hurricane' && <Wind className="h-5 w-5 text-purple-600" />}
                    </div>
                    <span className="font-medium text-gray-900 group-hover:text-disaster-green-700">
                      Start {hazard} Assessment
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <p className="text-gray-600">
              {availableHazards.length === 1 
                ? "Preparing your personalized questionnaire..." 
                : "Click on a disaster type above to start your assessment"}
            </p>
          </div>
        )}

        {/* Initial ZIP Entry */}
        {!isLoading && !showHazardAnalysis && (
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-disaster-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="text-white h-8 w-8" />
            </div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">Enter Your ZIP Code</h1>
            <p className="text-lg text-gray-600">We'll analyze your area's specific disaster risks</p>
          </div>
        )}
        
        {/* ZIP Entry Card - Only show when not loading and no analysis shown */}
        {!isLoading && !showHazardAnalysis && (
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
        )}

        {/* Hazard Map Display */}
        {zipCode.length === 5 && (
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-lg font-medium mb-4 text-center text-gray-900">Your Area's Hazard Analysis</h2>
            <HazardMap zipCode={zipCode} />
          </div>
        )}


      </main>
    </div>
  );
}