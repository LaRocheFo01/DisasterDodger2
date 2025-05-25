import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { Shield, ArrowLeft, ArrowRight, FileText, Lightbulb, CreditCard, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import PhotoUpload from "@/components/photo-upload";

interface AuditData {
  homeType?: string;
  yearBuilt?: string;
  foundationType?: string;
  stories?: string;
  roofMaterial?: string;
  safetySystems?: string[];
  waterStorage?: string;
  foodStorage?: string;
  backupPower?: string;
  photosUploaded?: number;
}

export default function AuditWizard() {
  const [, params] = useRoute("/audit/:auditId");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [auditData, setAuditData] = useState<AuditData>({
    safetySystems: []
  });
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);

  const auditId = params?.auditId ? parseInt(params.auditId) : 0;

  const { data: audit, isLoading } = useQuery({
    queryKey: [`/api/audits/${auditId}`],
    enabled: !!auditId,
  });

  const updateAuditMutation = useMutation({
    mutationFn: (data: Partial<AuditData>) => 
      apiRequest("PATCH", `/api/audits/${auditId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/audits/${auditId}`] });
    },
  });

  const generatePdfMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/audits/${auditId}/generate-pdf`),
    onSuccess: () => {
      setLocation(`/success/${auditId}`);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to generate PDF",
        variant: "destructive",
      });
    },
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;
  const [showPaymentGate, setShowPaymentGate] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium'>('basic');

  const updateField = (field: keyof AuditData, value: any) => {
    setAuditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateSafetySystems = (system: string, checked: boolean) => {
    setAuditData(prev => ({
      ...prev,
      safetySystems: checked 
        ? [...(prev.safetySystems || []), system]
        : (prev.safetySystems || []).filter(s => s !== system)
    }));
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return auditData.homeType && auditData.yearBuilt && auditData.foundationType && 
               auditData.stories && auditData.roofMaterial;
      case 2:
        return auditData.waterStorage && auditData.foodStorage && auditData.backupPower;
      case 3:
        return true; // Photo upload is optional
      case 4:
        return true; // Review step
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      // After 5 questions (completing steps 1 and 2), show payment gate
      if (currentStep === 2 && !showPaymentGate) {
        setShowPaymentGate(true);
        return;
      }
      
      if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1);
        // Save data for each step
        updateAuditMutation.mutate(auditData);
      }
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const continueWithPayment = () => {
    const amount = selectedPlan === 'basic' ? 29 : 49;
    setLocation(`/payment?auditId=${auditId}&amount=${amount}&plan=${selectedPlan}`);
  };

  const generateReport = async () => {
    // Final save before generating PDF
    await updateAuditMutation.mutateAsync({
      ...auditData,
      photosUploaded: uploadedPhotos.length
    });
    
    generatePdfMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-xl font-bold text-fema-blue">
                <Shield className="inline mr-2 h-6 w-6" />
                Disaster Dodger™
              </span>
              <span className="ml-4 text-gray-600">Audit Wizard</span>
            </div>
            <div className="text-sm text-gray-600">
              Step {currentStep} of {totalSteps}
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <Progress value={progress} className="flex-1" />
              <span className="ml-3 text-sm font-medium text-gray-600">
                {Math.round(progress)}% Complete
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Gate Modal */}
      {showPaymentGate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full shadow-2xl">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-emergency-red rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Complete Your Personalized Report
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  You've answered 5 questions! To continue and receive your complete 
                  disaster preparedness audit with FEMA citations and personalized 
                  recommendations, please complete your payment.
                </p>
              </div>

              <div className="space-y-3 mb-6">
                {/* Basic Plan */}
                <div 
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedPlan === 'basic' 
                      ? 'border-emergency-red bg-red-50' 
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedPlan('basic')}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                        selectedPlan === 'basic' ? 'border-emergency-red bg-emergency-red' : 'border-gray-300'
                      }`}>
                        {selectedPlan === 'basic' && <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>}
                      </div>
                      <span className="font-medium text-gray-900">Basic Audit</span>
                    </div>
                    <span className="font-bold text-xl">$29</span>
                  </div>
                  <div className="text-sm text-gray-600 ml-7">
                    • Instant PDF report with FEMA citations
                    • Personalized recommendations for primary hazard
                    • Regional hazard analysis
                  </div>
                </div>

                {/* Premium Plan */}
                <div 
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedPlan === 'premium' 
                      ? 'border-emergency-red bg-red-50' 
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedPlan('premium')}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                        selectedPlan === 'premium' ? 'border-emergency-red bg-emergency-red' : 'border-gray-300'
                      }`}>
                        {selectedPlan === 'premium' && <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>}
                      </div>
                      <span className="font-medium text-gray-900">Premium Audit</span>
                    </div>
                    <span className="font-bold text-xl">$49</span>
                  </div>
                  <div className="text-sm text-gray-600 ml-7">
                    • Everything in Basic Plan
                    • <strong>ALL disaster types coverage</strong> (Earthquake, Hurricane, Tornado, Flood, Wildfire, Winter Storm)
                    • Insurance savings guidance
                    • Rebate opportunities database
                    • Priority email support
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowPaymentGate(false)}
                  className="flex-1"
                >
                  Back to Questions
                </Button>
                <Button 
                  onClick={continueWithPayment}
                  className="flex-1 bg-emergency-red hover:bg-red-700 text-white"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Continue to Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Home Information</h2>
              <p className="text-gray-600 mb-8">Tell us about your home to personalize your audit</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">Home Type</Label>
                  <Select value={auditData.homeType} onValueChange={(value) => updateField('homeType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select home type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single-family">Single Family House</SelectItem>
                      <SelectItem value="townhouse">Townhouse</SelectItem>
                      <SelectItem value="condo">Condominium</SelectItem>
                      <SelectItem value="mobile">Mobile Home</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">Year Built</Label>
                  <Select value={auditData.yearBuilt} onValueChange={(value) => updateField('yearBuilt', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2010+">2010 or newer</SelectItem>
                      <SelectItem value="2000-2009">2000-2009</SelectItem>
                      <SelectItem value="1990-1999">1990-1999</SelectItem>
                      <SelectItem value="1980-1989">1980-1989</SelectItem>
                      <SelectItem value="1970-1979">1970-1979</SelectItem>
                      <SelectItem value="pre-1970">Before 1970</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">Foundation Type</Label>
                  <Select value={auditData.foundationType} onValueChange={(value) => updateField('foundationType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select foundation type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="concrete-slab">Concrete Slab</SelectItem>
                      <SelectItem value="crawl-space">Crawl Space</SelectItem>
                      <SelectItem value="basement">Basement</SelectItem>
                      <SelectItem value="pier-beam">Pier and Beam</SelectItem>
                      <SelectItem value="unsure">Not Sure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">Number of Stories</Label>
                  <Select value={auditData.stories} onValueChange={(value) => updateField('stories', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select stories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Story</SelectItem>
                      <SelectItem value="2">2 Stories</SelectItem>
                      <SelectItem value="3">3 Stories</SelectItem>
                      <SelectItem value="3+">3+ Stories</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="md:col-span-2">
                  <Label className="block text-sm font-medium text-gray-700 mb-2">Roof Material</Label>
                  <RadioGroup 
                    value={auditData.roofMaterial} 
                    onValueChange={(value) => updateField('roofMaterial', value)}
                    className="grid grid-cols-2 md:grid-cols-3 gap-3"
                  >
                    {[
                      { value: "asphalt-shingle", label: "Asphalt Shingle" },
                      { value: "tile", label: "Tile" },
                      { value: "metal", label: "Metal" },
                      { value: "wood", label: "Wood Shake" },
                      { value: "flat", label: "Flat Roof" },
                      { value: "other", label: "Other" }
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="text-sm cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Safety Systems */}
        {currentStep === 2 && (
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Safety Systems & Equipment</h2>
              <p className="text-gray-600 mb-8">Let us know about your existing safety equipment</p>
              
              <div className="space-y-6">
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-4">
                    Which safety systems do you currently have? (Select all that apply)
                  </Label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      { value: "smoke-detectors", label: "Smoke Detectors", desc: "Working smoke alarms" },
                      { value: "fire-extinguisher", label: "Fire Extinguisher", desc: "ABC-rated extinguisher" },
                      { value: "first-aid-kit", label: "First Aid Kit", desc: "Stocked and current" },
                      { value: "emergency-radio", label: "Emergency Radio", desc: "Battery or hand-crank" },
                      { value: "flashlights", label: "Flashlights", desc: "With extra batteries" },
                      { value: "carbon-monoxide", label: "CO Detector", desc: "Carbon monoxide alarm" }
                    ].map((system) => (
                      <div key={system.value} className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Checkbox
                          id={system.value}
                          checked={(auditData.safetySystems || []).includes(system.value)}
                          onCheckedChange={(checked) => updateSafetySystems(system.value, checked as boolean)}
                          className="mr-3"
                        />
                        <div>
                          <Label htmlFor={system.value} className="font-medium cursor-pointer">
                            {system.label}
                          </Label>
                          <div className="text-sm text-gray-600">{system.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">Emergency Water Storage</Label>
                  <Select value={auditData.waterStorage} onValueChange={(value) => updateField('waterStorage', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select water storage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No emergency water storage</SelectItem>
                      <SelectItem value="1-3-days">1-3 days worth</SelectItem>
                      <SelectItem value="4-7-days">4-7 days worth</SelectItem>
                      <SelectItem value="1-2-weeks">1-2 weeks worth</SelectItem>
                      <SelectItem value="more">More than 2 weeks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">Emergency Food Storage</Label>
                  <Select value={auditData.foodStorage} onValueChange={(value) => updateField('foodStorage', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select food storage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No emergency food storage</SelectItem>
                      <SelectItem value="1-3-days">1-3 days worth</SelectItem>
                      <SelectItem value="4-7-days">4-7 days worth</SelectItem>
                      <SelectItem value="1-2-weeks">1-2 weeks worth</SelectItem>
                      <SelectItem value="more">More than 2 weeks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">Backup Power Source</Label>
                  <Select value={auditData.backupPower} onValueChange={(value) => updateField('backupPower', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select backup power" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No backup power</SelectItem>
                      <SelectItem value="portable-generator">Portable Generator</SelectItem>
                      <SelectItem value="standby-generator">Standby Generator</SelectItem>
                      <SelectItem value="battery-backup">Battery Backup System</SelectItem>
                      <SelectItem value="solar-battery">Solar + Battery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Photo Upload */}
        {currentStep === 3 && (
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Photo Documentation (Optional)</h2>
              <p className="text-gray-600 mb-8">
                Upload photos of your home's exterior, hazard-prone areas, or safety equipment for more personalized recommendations
              </p>
              
              <div className="space-y-6">
                <PhotoUpload
                  onPhotosChange={(photos) => setUploadedPhotos(photos)}
                  maxFiles={5}
                />
                
                <Card className="bg-blue-50">
                  <CardContent className="p-6">
                    <h4 className="font-medium text-fema-blue mb-3 flex items-center">
                      <Lightbulb className="mr-2 h-5 w-5" />
                      Suggested Photos
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Home exterior showing roof and foundation</li>
                      <li>• Areas prone to water damage (basement, low-lying areas)</li>
                      <li>• Current safety equipment locations</li>
                      <li>• Structural vulnerabilities or recent damage</li>
                      <li>• Utility shut-off locations (gas, water, electrical)</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Review & Submit */}
        {currentStep === 4 && (
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Information</h2>
              <p className="text-gray-600 mb-8">
                Please review your answers before generating your personalized audit report
              </p>
              
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-gray-50">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Home Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">ZIP Code:</span>
                          <span className="font-medium">{audit.zipCode}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Primary Hazard:</span>
                          <span className="font-medium text-emergency-red">{audit.primaryHazard}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Home Type:</span>
                          <span className="font-medium">{auditData.homeType || 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Year Built:</span>
                          <span className="font-medium">{auditData.yearBuilt || 'Not specified'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gray-50">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Safety Systems</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Safety Equipment:</span>
                          <span className="font-medium">
                            {(auditData.safetySystems || []).length} items
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Water Storage:</span>
                          <span className="font-medium">{auditData.waterStorage || 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Food Storage:</span>
                          <span className="font-medium">{auditData.foodStorage || 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Photos Uploaded:</span>
                          <span className="font-medium">{uploadedPhotos.length} photos</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="bg-gradient-to-r from-fema-blue to-blue-700 text-white">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4 flex items-center">
                      <FileText className="mr-2 h-5 w-5" />
                      Your Personalized Report Will Include:
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-safety-green rounded-full mr-2" />
                        <span>Executive Summary & Risk Score</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-safety-green rounded-full mr-2" />
                        <span>Quick Win Action Items</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-safety-green rounded-full mr-2" />
                        <span>FEMA-Aligned Recommendations</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-safety-green rounded-full mr-2" />
                        <span>Rebate & Savings Opportunities</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-safety-green rounded-full mr-2" />
                        <span>Insurance Savings Guidance</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-safety-green rounded-full mr-2" />
                        <span>Official FEMA Citations</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="text-center">
                  <Button 
                    onClick={generateReport}
                    disabled={generatePdfMutation.isPending}
                    className="bg-emergency-red hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold"
                  >
                    <FileText className="mr-2 h-5 w-5" />
                    {generatePdfMutation.isPending ? "Generating..." : "Generate My Report"}
                  </Button>
                  <p className="text-sm text-gray-600 mt-3">
                    Report will be generated and downloaded automatically
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button 
            onClick={previousStep}
            disabled={currentStep === 1}
            variant="outline"
            className="px-6 py-3 font-medium"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          
          {currentStep < totalSteps && (
            <Button 
              onClick={nextStep}
              disabled={!validateCurrentStep()}
              className="bg-fema-blue hover:bg-blue-700 text-white px-6 py-3 font-medium"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
