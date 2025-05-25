import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { MapPin, ArrowLeft, AlertCircle, Mountain, Wind, Zap, Snowflake, Flame, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import HazardMap from "@/components/hazard-map";

export default function StartAudit() {
  const [, setLocation] = useLocation();
  const [zipCode, setZipCode] = useState("");
  const [zipError, setZipError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysisComplete, setShowAnalysisComplete] = useState(false);
  const [currentDisasterIcon, setCurrentDisasterIcon] = useState(0);

  const { data: hazardData, refetch: detectHazard } = useQuery({
    queryKey: [`/api/hazards/${zipCode}`],
    enabled: false,
  });

  const validateZip = (zip: string) => {
    const zipRegex = /^\d{5}$/;
    return zipRegex.test(zip);
  };

  const handleZipChange = (value: string) => {
    // Only allow digits and limit to 5 characters
    const cleaned = value.replace(/\D/g, '').slice(0, 5);
    setZipCode(cleaned);
    setZipError("");
  };

  // Disaster icons for loading animation
  const disasterIcons = [
    { icon: Mountain, name: "Earthquake", color: "text-red-500" },
    { icon: Wind, name: "Hurricane", color: "text-blue-500" },
    { icon: Zap, name: "Tornado", color: "text-yellow-500" },
    { icon: Flame, name: "Wildfire", color: "text-orange-500" },
    { icon: Droplets, name: "Flood", color: "text-blue-600" },
    { icon: Snowflake, name: "Winter Storm", color: "text-indigo-500" }
  ];

  // Animate through disaster icons during analysis
  useEffect(() => {
    if (isAnalyzing) {
      const interval = setInterval(() => {
        setCurrentDisasterIcon((prev) => (prev + 1) % disasterIcons.length);
      }, 300);
      return () => clearInterval(interval);
    }
  }, [isAnalyzing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateZip(zipCode)) {
      setZipError("Please enter a valid 5-digit ZIP code");
      return;
    }

    setIsAnalyzing(true);
    setShowAnalysisComplete(false);

    try {
      // Show loading animation for 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result = await detectHazard();
      if (result.data) {
        setIsAnalyzing(false);
        setShowAnalysisComplete(true);
        
        // Just show analysis complete, let user click to continue
      }
    } catch (error) {
      setIsAnalyzing(false);
      setZipError("Unable to detect hazard for this ZIP code. Please try again.");
    }
  };

  const goBack = () => {
    setLocation("/");
  };

  const continueToPayment = () => {
    if (hazardData) {
      setLocation(`/payment?zip=${zipCode}&hazard=${encodeURIComponent((hazardData as any).primaryHazard)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-fema-blue to-blue-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <Card className="bg-white rounded-2xl shadow-lg max-w-md mx-auto">
          <CardContent className="p-8">
            {/* Initial Form - Show when not analyzing and not complete */}
            {!isAnalyzing && !showAnalysisComplete && (
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-fema-blue rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="text-white h-8 w-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Start Your Audit</h2>
                  <p className="text-gray-600">Enter your ZIP code to identify your disaster risks</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="zipcode" className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code
                    </Label>
                    <Input
                      id="zipcode"
                      type="text"
                      value={zipCode}
                      onChange={(e) => handleZipChange(e.target.value)}
                      placeholder="12345"
                      className={`w-full text-lg p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-600 text-center font-semibold ${
                        zipError ? 'border-red-500' : ''
                      }`}
                      maxLength={5}
                      required
                    />
                    {zipError && (
                      <div className="text-red-700 text-sm mt-2 flex items-center">
                        <AlertCircle className="mr-1 h-4 w-4" />
                        {zipError}
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white py-4 px-8 rounded-lg font-semibold text-lg"
                    disabled={!validateZip(zipCode)}
                    aria-label="Analyze your location for disaster risks"
                  >
                    Analyze My Location
                  </Button>
                </form>
                
                <div className="mt-6 text-center">
                  <Button
                    variant="ghost"
                    onClick={goBack}
                    className="text-fema-blue hover:text-blue-700 text-sm font-medium"
                  >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Back to Home
                  </Button>
                </div>
              </>
            )}

            {/* Disaster Loading Animation - Show during analysis */}
            {isAnalyzing && (
              <div className="text-center">
                <div className="relative mb-6">
                  {disasterIcons.map((disaster, index) => {
                    const IconComponent = disaster.icon;
                    return (
                      <div
                        key={index}
                        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                          index === currentDisasterIcon ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        <IconComponent className={`w-20 h-20 ${disaster.color} animate-pulse`} />
                      </div>
                    );
                  })}
                  <div className="w-20 h-20 mx-auto"></div>
                </div>
                <h2 className="text-2xl font-bold mb-3 text-gray-900">
                  Analyzing ZIP Code {zipCode}
                </h2>
                <p className="text-gray-600 mb-6">
                  Scanning for {disasterIcons[currentDisasterIcon].name} and other regional hazards...
                </p>
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-blue-500 h-3 rounded-full animate-pulse" style={{width: '75%'}}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Analysis Complete - Show results and continue button */}
            {showAnalysisComplete && hazardData && (
              <div className="text-center">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-12 h-12 text-white" />
                </div>
                <div className="bg-green-100 rounded-lg p-4 mb-6">
                  <p className="text-green-800 font-semibold text-xl">
                    ✅ ZIP Code Analysis Complete
                  </p>
                  <p className="text-green-700 text-sm mt-2">
                    We analyzed your location {zipCode} and identified the primary disaster risk for your specific zone
                  </p>
                </div>
                <div className="mb-4">
                  <h2 className="text-lg font-bold mb-3 text-gray-900">
                    Your area is most likely to be affected by:
                  </h2>
                  <div className="flex items-center justify-center gap-3 mb-4">
                    {(() => {
                      const hazardName = (hazardData as any).primaryHazard;
                      const disasterIcon = disasterIcons.find(d => 
                        hazardName?.toLowerCase().includes(d.name.toLowerCase()) ||
                        (d.name === 'Earthquake' && hazardName?.toLowerCase().includes('earthquake')) ||
                        (d.name === 'Hurricane' && hazardName?.toLowerCase().includes('hurricane')) ||
                        (d.name === 'Tornado' && hazardName?.toLowerCase().includes('tornado')) ||
                        (d.name === 'Wildfire' && hazardName?.toLowerCase().includes('fire')) ||
                        (d.name === 'Flood' && hazardName?.toLowerCase().includes('flood')) ||
                        (d.name === 'Winter Storm' && hazardName?.toLowerCase().includes('winter'))
                      );
                      const IconComponent = disasterIcon?.icon || AlertCircle;
                      const iconColor = disasterIcon?.color || "text-emergency-red";
                      return <IconComponent className={`w-10 h-10 ${iconColor}`} />;
                    })()}
                    <div className="text-2xl font-bold text-gray-900">{(hazardData as any).primaryHazard}</div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-emergency-red to-red-600 text-white rounded-lg p-6 mb-6">
                  <div className="text-lg font-semibold">Risk Level: {(hazardData as any).primaryRisk}/5 - High Priority</div>
                  <div className="text-sm mt-2 opacity-90">Location: {(hazardData as any).state}</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <p className="text-gray-700 font-medium">
                    🏠 Get your personalized preparedness plan
                  </p>
                  <p className="text-gray-600 text-sm mt-2">
                    Our audit will provide targeted recommendations to protect against {(hazardData as any).primaryHazard?.toLowerCase()} 
                    and other regional hazards.
                  </p>
                </div>
                <Button 
                  onClick={continueToPayment}
                  className="w-full bg-emergency-red hover:bg-red-700 text-white py-4 text-lg font-semibold mb-4"
                >
                  Continue to Payment
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowAnalysisComplete(false);
                    setZipCode("");
                  }}
                  className="text-fema-blue hover:text-blue-700 text-sm font-medium"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Try Different ZIP Code
                </Button>
              </div>
            )}
          </CardContent>
        </Card>


      </div>
    </div>
  );
}
