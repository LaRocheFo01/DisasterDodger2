import { useState } from "react";
import { useLocation } from "wouter";
import { MapPin, ArrowLeft, AlertCircle } from "lucide-react";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateZip(zipCode)) {
      setZipError("Please enter a valid 5-digit ZIP code");
      return;
    }

    try {
      const result = await detectHazard();
      if (result.data) {
        // Navigate to payment with ZIP and hazard data
        setLocation(`/payment?zip=${zipCode}&hazard=${encodeURIComponent(result.data.primaryHazard)}`);
      }
    } catch (error) {
      setZipError("Unable to detect hazard for this ZIP code. Please try again.");
    }
  };

  const goBack = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-fema-blue to-blue-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <Card className="shadow-2xl">
          <CardContent className="p-8">
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
                  className={`text-center text-xl font-semibold focus:ring-2 focus:ring-fema-blue focus:border-transparent ${
                    zipError ? 'border-emergency-red' : ''
                  }`}
                  maxLength={5}
                  required
                />
                {zipError && (
                  <div className="mt-2 text-emergency-red text-sm flex items-center">
                    <AlertCircle className="mr-1 h-4 w-4" />
                    {zipError}
                  </div>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-emergency-red hover:bg-red-700 text-white py-4 text-lg font-semibold"
                disabled={!validateZip(zipCode)}
              >
                Continue to Payment
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
          </CardContent>
        </Card>

        {/* Enhanced Hazard Detection Display */}
        {validateZip(zipCode) && hazardData && (
          <div className="mt-8">
            <Card className="shadow-lg border-l-4 border-emergency-red">
              <CardContent className="p-6">
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 text-emergency-red mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-4 text-gray-900">
                    According to your ZIP code {zipCode}, your area is likely to be affected by:
                  </h3>
                  <div className="bg-gradient-to-r from-emergency-red to-red-600 text-white rounded-lg p-6 mb-4">
                    <div className="text-3xl font-bold mb-2">{hazardData.primaryHazard}</div>
                    <div className="text-lg">Risk Level: {hazardData.primaryRisk}/5 - High Priority</div>
                    <div className="text-sm mt-2 opacity-90">Location: {hazardData.state}</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <p className="text-gray-700 font-medium">
                      🏠 Get a personalized preparedness plan for your specific home and location
                    </p>
                    <p className="text-gray-600 text-sm mt-2">
                      Our audit will provide targeted recommendations to protect against {hazardData.primaryHazard.toLowerCase()} 
                      and other regional hazards.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
