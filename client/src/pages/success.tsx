import { useRoute, useLocation } from "wouter";
import { CheckCircle, FileText, Wrench, DollarSign, Share, Shield, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function Success() {
  const [, params] = useRoute("/success/:auditId");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const auditId = params?.auditId ? parseInt(params.auditId) : 0;

  const { data: audit, isLoading } = useQuery({
    queryKey: [`/api/audits/${auditId}`],
    enabled: !!auditId,
  });

  const shareResults = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Disaster Preparedness Score',
        text: 'I just completed my disaster preparedness audit with Disaster Dodger™',
        url: window.location.href
      });
    } else {
      const text = 'I just completed my disaster preparedness audit with Disaster Dodger™';
      navigator.clipboard.writeText(`${text} ${window.location.href}`)
        .then(() => {
          toast({
            title: "Success",
            description: "Link copied to clipboard!",
          });
        })
        .catch(() => {
          toast({
            title: "Error",
            description: "Failed to copy link",
            variant: "destructive",
          });
        });
    }
  };

  const getInsuranceQuote = () => {
    toast({
      title: "Insurance Quote",
      description: "Redirecting to insurance partner for personalized quote...",
    });
    // In real implementation, redirect to insurance partner
  };

  const startOver = () => {
    setLocation("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-safety-green to-green-700 flex items-center justify-center px-4">
        <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-safety-green to-green-700 flex items-center justify-center px-4">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold mb-4">Audit Not Found</h2>
            <Button onClick={() => setLocation("/")}>Return Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-safety-green to-green-700 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <Card className="shadow-2xl">
          <CardContent className="p-8">
            <div className="w-20 h-20 bg-safety-green rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-white h-12 w-12" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Audit Complete!</h2>
            <p className="text-gray-600 mb-8">
              Your personalized disaster preparedness report has been generated and downloaded.
            </p>
            
            <Card className="bg-gray-50 mb-8">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">What's Next?</h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <FileText className="text-fema-blue h-8 w-8 mx-auto mb-2" />
                    <div className="font-medium">Review Your Report</div>
                    <div className="text-gray-600">Check your downloads folder</div>
                  </div>
                  <div className="text-center">
                    <Wrench className="text-warning-orange h-8 w-8 mx-auto mb-2" />
                    <div className="font-medium">Start with Quick Wins</div>
                    <div className="text-gray-600">Easy improvements first</div>
                  </div>
                  <div className="text-center">
                    <DollarSign className="text-safety-green h-8 w-8 mx-auto mb-2" />
                    <div className="font-medium">Claim Rebates</div>
                    <div className="text-gray-600">Save money on upgrades</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Disaster Protection Offer */}
            <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white mb-8">
              <CardContent className="p-8 text-center">
                <Shield className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
                <h3 className="text-2xl font-bold mb-4">Want Complete Protection?</h3>
                <p className="text-lg mb-6 text-blue-100">
                  You've protected against your primary hazard. Get comprehensive coverage 
                  for ALL disaster types in your region with our Premium Multi-Disaster Audit.
                </p>
                <div className="bg-white/20 rounded-lg p-4 mb-6">
                  <div className="text-yellow-300 font-bold text-lg mb-2">Premium Audit Covers:</div>
                  <div className="grid md:grid-cols-2 gap-2 text-sm">
                    <div>🏔️ Earthquakes & Wildfires</div>
                    <div>🌊 Hurricanes & Floods</div>
                    <div>🌪️ Tornadoes & Severe Weather</div>
                    <div>❄️ Winter Storms & Ice</div>
                  </div>
                </div>
                <Button 
                  onClick={() => setLocation("/start-audit")}
                  className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-8 py-3 text-lg font-bold rounded-lg"
                >
                  Get Premium Multi-Disaster Audit - $49
                </Button>
              </CardContent>
            </Card>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={shareResults}
                className="bg-fema-blue hover:bg-blue-700 text-white px-6 py-3 font-medium"
              >
                <Share className="mr-2 h-4 w-4" />
                Share Your Score
              </Button>
              
              <Button 
                onClick={getInsuranceQuote}
                className="bg-warning-orange hover:bg-yellow-600 text-white px-6 py-3 font-medium"
              >
                <Shield className="mr-2 h-4 w-4" />
                Get Insurance Quote
              </Button>
              
              <Button 
                onClick={startOver}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 font-medium"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Start New Audit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
