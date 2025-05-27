import { useRoute, useLocation } from "wouter";
import { CheckCircle, FileText, Wrench, DollarSign, Share, Shield, RotateCcw, Download, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import DownloadReportButton from "@/components/download-report-button";

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
        title: 'My Disaster Preparedness Assessment',
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

  const downloadReport = () => {
    toast({
      title: "Report Ready",
      description: "Your personalized disaster preparedness report is being generated...",
    });
    // In a real implementation, this would generate and download a PDF
  };

  const startNewAudit = () => {
    setLocation("/start-audit");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-disaster-green-50 to-disaster-green-100 flex items-center justify-center">
        <div className="animate-pulse space-y-4 max-w-md mx-auto">
          <div className="h-6 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-disaster-green-50 to-disaster-green-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Audit Not Found</h1>
          <p className="text-gray-600 mb-6">The audit you're looking for could not be found.</p>
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
              <Shield className="h-6 w-6 text-disaster-green-600 mr-2" />
              <span className="text-lg font-semibold text-gray-900">Disaster Dodger™</span>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => setLocation("/")}
              className="text-gray-600 hover:text-disaster-green-600"
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          </div>
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div className="bg-disaster-green-600 h-2 rounded-full" style={{width: '100%'}}></div>
        </div>
        <p className="text-sm text-gray-600 mb-8">Step 3 of 3: Assessment Complete</p>
      </div>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Success Hero */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-disaster-mint-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-white h-10 w-10" />
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-4">
            Assessment Complete!
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Congratulations! You've completed your {audit.primaryHazard} preparedness assessment. 
            Your personalized recommendations are ready.
          </p>
        </div>

        {/* Results Summary */}
        <div className="bg-white shadow-md rounded-lg p-8 mb-8">
          <h2 className="text-xl font-medium text-gray-900 mb-6 text-center">Your Assessment Summary</h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-disaster-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="text-disaster-green-600 h-8 w-8" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Hazard Focus</h3>
              <p className="text-sm text-gray-600">{audit.primaryHazard}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-disaster-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="text-disaster-green-600 h-8 w-8" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Questions Answered</h3>
              <p className="text-sm text-gray-600">22 of 22</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-disaster-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Wrench className="text-disaster-green-600 h-8 w-8" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Recommendations</h3>
              <p className="text-sm text-gray-600">Available in Report</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your Assessment Details</h3>
              <div className="bg-disaster-green-50 rounded-lg p-4 inline-block">
                <p className="text-sm text-gray-700">
                  <strong>Location:</strong> ZIP {audit.zipCode} • 
                  <strong> Hazard Type:</strong> {audit.primaryHazard} • 
                  <strong> Status:</strong> <span className="text-disaster-mint-600 font-medium">Complete</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-disaster-green-600 rounded-full flex items-center justify-center mr-4">
                <Download className="text-white h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Download Report</h3>
                <p className="text-sm text-gray-600">Get your personalized PDF recommendations</p>
              </div>
            </div>
            <DownloadReportButton 
              auditId={auditId}
              className="w-full active:scale-95 transition-all"
            />
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-disaster-mint-500 rounded-full flex items-center justify-center mr-4">
                <Share className="text-white h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Share Results</h3>
                <p className="text-sm text-gray-600">Share your preparedness journey</p>
              </div>
            </div>
            <Button 
              onClick={shareResults}
              variant="outline"
              className="w-full border-disaster-green-600 text-disaster-green-600 hover:bg-disaster-green-50"
            >
              Share Assessment
            </Button>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">What's Next?</h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-6 h-6 bg-disaster-green-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Review Your Report</h4>
                <p className="text-sm text-gray-600">Download and carefully review all personalized recommendations for your home.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-disaster-green-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Implement Priority Actions</h4>
                <p className="text-sm text-gray-600">Start with the quick wins and high-impact recommendations in your report.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-disaster-green-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-white text-xs font-bold">3</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Assess Other Hazards</h4>
                <p className="text-sm text-gray-600">Consider completing assessments for other disaster types in your area.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Ready for Another Assessment?</h3>
          <p className="text-gray-600 mb-6">
            Protect your home from all potential disasters by completing assessments for other hazard types.
          </p>
          <Button 
            onClick={startNewAudit}
            variant="outline"
            className="border-disaster-green-600 text-disaster-green-600 hover:bg-disaster-green-50 px-8"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Start New Assessment
          </Button>
        </div>
      </main>
    </div>
  );
}