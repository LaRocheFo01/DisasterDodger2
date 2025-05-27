import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, MapPin, Zap, Wind, Flame, Droplets, Mountain } from "lucide-react";

interface HazardData {
  zipCode: string;
  city?: string;
  state?: string;
  coordinates?: { latitude: number; longitude: number };
  primaryHazard: string;
  primaryRisk: number;
  allHazards: Array<{
    type: string;
    risk: number;
    severity: string;
  }>;
  confidence: string;
  dataSource: string;
  lastUpdated: string;
}

interface HazardMapProps {
  zipCode: string;
}

const getHazardIcon = (hazardType: string) => {
  switch (hazardType.toLowerCase()) {
    case 'earthquake':
      return <Mountain className="w-5 h-5" />;
    case 'hurricane':
      return <Wind className="w-5 h-5" />;
    case 'tornado':
      return <Wind className="w-5 h-5" />;
    case 'wildfire':
      return <Flame className="w-5 h-5" />;
    case 'flood':
      return <Droplets className="w-5 h-5" />;
    case 'winter storm':
      return <Zap className="w-5 h-5" />;
    default:
      return <AlertTriangle className="w-5 h-5" />;
  }
};

const getRiskColor = (risk: number) => {
  if (risk >= 4) return "bg-red-500 text-white";
  if (risk >= 3) return "bg-orange-500 text-white";
  if (risk >= 2) return "bg-yellow-500 text-black";
  return "bg-green-500 text-white";
};

const getSeverityColor = (severity: string) => {
  switch (severity.toLowerCase()) {
    case 'very high':
    case 'high':
      return "destructive";
    case 'moderate':
      return "secondary";
    case 'low':
      return "outline";
    default:
      return "secondary";
  }
};

export default function HazardMap({ zipCode }: HazardMapProps) {
  const [hazardData, setHazardData] = useState<HazardData | null>(null);
  const [locationAnalysis, setLocationAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHazardData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch basic hazard data
        const hazardResponse = await fetch(`/api/hazards/${zipCode}`);
        if (!hazardResponse.ok) throw new Error('Failed to fetch hazard data');
        const hazardResult = await hazardResponse.json();
        setHazardData(hazardResult);

        // Fetch detailed location analysis
        try {
          const analysisResponse = await fetch(`/api/location-analysis/${zipCode}`);
          if (analysisResponse.ok) {
            const analysisResult = await analysisResponse.json();
            setLocationAnalysis(analysisResult);
          }
        } catch (err) {
          console.log('Detailed analysis not available');
        }
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching hazard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (zipCode) {
      fetchHazardData();
    }
  }, [zipCode]);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            <span className="ml-3 text-gray-600">Analyzing location hazards...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !hazardData) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
            <p>Unable to load hazard data for this location</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Location Overview */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-600" />
            Location Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">
                  {hazardData.city && hazardData.state 
                    ? `${hazardData.city}, ${hazardData.state}` 
                    : `ZIP Code ${hazardData.zipCode}`}
                </h3>
                {hazardData.coordinates && (
                  <p className="text-sm text-gray-600">
                    {hazardData.coordinates.latitude.toFixed(4)}°N, {hazardData.coordinates.longitude.toFixed(4)}°W
                  </p>
                )}
              </div>
              <Badge variant={getSeverityColor(hazardData.allHazards?.[0]?.severity || 'Low')}>
                {hazardData.confidence?.toUpperCase() || 'MEDIUM'} CONFIDENCE
              </Badge>
            </div>

            {/* Primary Hazard */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  {getHazardIcon(hazardData.primaryHazard)}
                  <span className="ml-2 font-semibold">Primary Hazard: {hazardData.primaryHazard}</span>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(hazardData.primaryRisk)}`}>
                  Risk Level: {hazardData.primaryRisk}/5
                </div>
              </div>
            </div>

            {/* Data Source */}
            <div className="text-xs text-gray-500">
              Data sources: {hazardData.dataSource} • Last updated: {new Date(hazardData.lastUpdated).toLocaleDateString()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* All Hazards Breakdown */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Regional Hazard Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {hazardData.allHazards?.map((hazard, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center">
                  {getHazardIcon(hazard.type)}
                  <div className="ml-3">
                    <div className="font-medium">{hazard.type}</div>
                    <div className="text-sm text-gray-600">Severity: {hazard.severity}</div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(hazard.risk)}`}>
                  {hazard.risk}/5
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Location Analysis */}
      {locationAnalysis && (
        <>
          {/* Recommendations */}
          {locationAnalysis.recommendations && locationAnalysis.recommendations.length > 0 && (
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Location-Specific Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {locationAnalysis.recommendations.map((rec: string, index: number) => (
                    <div key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Emergency Services */}
          {locationAnalysis.emergencyServices && (
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Emergency Services Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-1">Medical Facilities</h4>
                    <p className="text-sm">{locationAnalysis.emergencyServices.hospitals}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-1">Fire Protection</h4>
                    <p className="text-sm">{locationAnalysis.emergencyServices.fireStations}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-1">Law Enforcement</h4>
                    <p className="text-sm">{locationAnalysis.emergencyServices.policeStations}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-1">Emergency Management</h4>
                    <p className="text-sm">{locationAnalysis.emergencyServices.emergencyManagement}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}