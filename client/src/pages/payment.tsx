import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { Shield, ArrowLeft, CheckCircle, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

export default function Payment() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/payment/:auditId");
  const [isProcessing, setIsProcessing] = useState(false);

  const auditId = params?.auditId ? parseInt(params.auditId, 10) : 0;

  // Fetch audit data
  const { data: audit, isLoading } = useQuery({
    queryKey: ['/api/audits', auditId],
    enabled: !!auditId
  });

  const handleProceedToAudit = async () => {
    setIsProcessing(true);
    
    // For now, proceed directly to questionnaire (free assessment)
    setTimeout(() => {
      setLocation(`/audit-wizard/${auditId}`);
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-disaster-green-50 to-disaster-green-100 flex items-center justify-center">
        <div className="animate-pulse space-y-4 max-w-md mx-auto">
          <div className="h-6 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-disaster-green-50 to-disaster-green-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Audit Not Found</h1>
          <Button onClick={() => setLocation("/start-audit")} className="bg-disaster-green-600 hover:bg-disaster-green-700">
            Start New Audit
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-disaster-green-50 to-disaster-green-100">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={() => setLocation("/start-audit")}
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
          <div className="bg-disaster-green-600 h-2 rounded-full" style={{width: '66%'}}></div>
        </div>
        <p className="text-sm text-gray-600 mb-8">Step 2 of 3: Confirm Assessment</p>
      </div>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-disaster-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-white h-8 w-8" />
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-4">
            Ready to Start Your Assessment
          </h1>
          <p className="text-lg text-gray-600">
            You're about to begin your {audit.primaryHazard} preparedness assessment for ZIP {audit.zipCode}
          </p>
        </div>

        {/* Assessment Details Card */}
        <div className="bg-white shadow-md rounded-lg p-8 mb-8">
          <h2 className="text-xl font-medium text-gray-900 mb-6 text-center">Assessment Details</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-disaster-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="text-disaster-green-600 h-8 w-8" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Hazard Focus</h3>
              <p className="text-sm text-gray-600">{audit.primaryHazard} Preparedness</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-disaster-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CreditCard className="text-disaster-green-600 h-8 w-8" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Cost</h3>
              <p className="text-sm text-gray-600">Free Assessment</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">What You'll Get</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-center justify-center">
                  <CheckCircle className="text-disaster-mint-600 h-4 w-4 mr-2" />
                  Personalized recommendations
                </div>
                <div className="flex items-center justify-center">
                  <CheckCircle className="text-disaster-mint-600 h-4 w-4 mr-2" />
                  FEMA-aligned guidance
                </div>
                <div className="flex items-center justify-center">
                  <CheckCircle className="text-disaster-mint-600 h-4 w-4 mr-2" />
                  Downloadable report
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleProceedToAudit}
              disabled={isProcessing}
              className="w-full bg-disaster-green-600 hover:bg-disaster-green-700 py-4 text-lg font-medium active:scale-95 transition-all"
            >
              {isProcessing ? (
                "Preparing Assessment..."
              ) : (
                "Start Assessment"
              )}
            </Button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="text-center text-sm text-gray-500">
          <p>Your data is secure and will only be used for generating your personalized assessment.</p>
        </div>
      </main>
    </div>
  );
}