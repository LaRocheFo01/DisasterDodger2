import { useState, useEffect, useMemo } from "react";
import { useRoute, useLocation } from "wouter";
import { Shield, ArrowLeft, ArrowRight, FileText, Download, ExternalLink, CreditCard, Lock, Lightbulb, Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import PhotoUpload from "@/components/photo-upload";
import { getQuestionsForHazard, Question } from "@/data/questionnaire";

interface AuditData {
  // General Home Information (Section A)
  zipCode?: string;
  homeType?: string;
  yearBuilt?: string;
  ownershipStatus?: string;
  insuredValue?: string;
  insurancePolicies?: string[];
  previousGrants?: string;
  previousGrantsProgram?: string;

  // Earthquake Questions (Section B)
  waterHeaterSecurity?: string;
  anchoredItems?: string[];
  cabinetLatches?: string;
  electronicsStability?: string;
  gasShutoffPlan?: string;
  chimneyInspection?: string;
  garageRetrofit?: string;
  applianceConnectors?: string;
  woodStoveAnchor?: string;
  earthquakeDrill?: string;
  emergencyKit?: string[];
  hangingDecor?: string;
  foundationWork?: string;
  ceilingFixtures?: string;
  roomByRoomChecklist?: string;

  // Hurricane/Wind Questions (Section C)
  roofInspection?: string;
  atticVents?: string;
  roofCovering?: string;
  windowDoorProtection?: string;
  garageDoorUpgrade?: string;
  gableEndBracing?: string;
  soffitOverhangs?: string;
  chimneyTies?: string;
  attachedStructures?: string;
  continuousLoadPath?: string;
  sidingMaterial?: string;
  retrofitEvaluation?: string;
  gutterAnchors?: string;
  retrofitLevel?: string;
  completedMeasures?: string[];

  // Wildfire Questions (Section D)
  defensibleSpaceWidth?: string;
  roofMaterial?: string;
  emberBarriers?: string;
  underlaymentType?: string;
  ventProtection?: string;
  crawlspaceVents?: string[];
  wallCladding?: string;
  vegetationSpacing?: string;
  outbuildingDistance?: string;
  patioFurniturePlan?: string;
  gutterGuards?: string;
  windowGlazing?: string;
  entryDoorRating?: string;
  siteOrientation?: string;
  underElevationFinish?: string;

  // Flood Questions (Section E)
  equipmentElevation?: string;
  floodBarriers?: string;
  backflowPrevention?: string;
  appliancePlatforms?: string;
  houseWrapSeal?: string;
  automaticFloodVents?: string;
  ventPlacement?: string;
  sumpPump?: string;
  fuelTankAnchoring?: string;
  floodResistantMaterials?: string;
  underSlabDrainage?: string;
  electricalLocation?: string;
  landscapeSwales?: string;
  floodShields?: string;
  perimeterDrainage?: string;

  // Additional
  photosUploaded?: number;
}

export default function AuditWizard() {
  const [, params] = useRoute("/questionnaire/:auditId") || useRoute("/audit/:auditId");
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [auditData, setAuditData] = useState<AuditData>({
    insurancePolicies: [],
    anchoredItems: [],
    emergencyKit: [],
    completedMeasures: [],
    crawlspaceVents: []
  });
  const [primaryHazard, setPrimaryHazard] = useState<string>("");
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  // Get audit ID from params
  const auditId = params?.auditId ? parseInt(params.auditId) : 0;

  const { data: audit, isLoading } = useQuery({
    queryKey: [`/api/audits/${auditId}`],
    enabled: !!auditId,
  });

  // Initialize wizard from audit data
  useEffect(() => {
    if (audit) {
      console.log('Loading audit:', audit);
      setPrimaryHazard(audit.primaryHazard || "");
      setAuditData(audit.data || {});
      
      if (audit.primaryHazard) {
        const hazardQuestions = getQuestionsForHazard(audit.primaryHazard);
        console.log('Loaded questions for', audit.primaryHazard, ':', hazardQuestions.length);
        setQuestions(hazardQuestions);
      }
    }
  }, [audit]);

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

  const [showPaymentGate, setShowPaymentGate] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium'>('basic');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [photoUploadError, setPhotoUploadError] = useState<string>('');

  const updateField = (field: keyof AuditData, value: any) => {
    setAuditData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user provides answer
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const updateMultipleChoice = (field: keyof AuditData, option: string, checked: boolean) => {
    setAuditData(prev => {
      const currentArray = (prev[field] as string[]) || [];
      const newArray = checked 
        ? [...currentArray, option]
        : currentArray.filter(item => item !== option);
      
      // Clear error when user selects at least one option
      if (newArray.length > 0 && errors[field]) {
        setErrors(prevErrors => ({ ...prevErrors, [field]: '' }));
      }
      
      return {
        ...prev,
        [field]: newArray
      };
    });
  };

  // Photo upload handling
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const maxSize = 10 * 1024 * 1024; // 10MB per file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    const validFiles: File[] = [];
    let errorMessage = '';
    
    files.forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        errorMessage = 'Only JPEG, PNG, and WebP images are allowed.';
        return;
      }
      if (file.size > maxSize) {
        errorMessage = 'Files must be smaller than 10MB.';
        return;
      }
      validFiles.push(file);
    });
    
    if (uploadedPhotos.length + validFiles.length > 5) {
      errorMessage = 'Maximum 5 photos allowed.';
      setPhotoUploadError(errorMessage);
      return;
    }
    
    if (errorMessage) {
      setPhotoUploadError(errorMessage);
      return;
    }
    
    setPhotoUploadError('');
    setUploadedPhotos(prev => [...prev, ...validFiles]);
  };

  const removePhoto = (index: number) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const isCurrentStepValid = useMemo(() => {
    if (questions.length === 0) return false;
    
    const currentQuestion = questions[currentStep - 1];
    if (!currentQuestion) return true;
    
    const fieldValue = auditData[currentQuestion.id as keyof AuditData];
    
    if (currentQuestion.type === 'checkbox') {
      return Array.isArray(fieldValue) && fieldValue.length > 0;
    }
    
    if (currentQuestion.type === 'text') {
      return fieldValue !== undefined && fieldValue !== '' && String(fieldValue).trim() !== '';
    }
    
    return fieldValue !== undefined && fieldValue !== '';
  }, [questions, currentStep, auditData]);

  const totalSteps = questions.length + 1; // +1 for final review/submit step
  const progress = questions.length > 0 ? (currentStep / totalSteps) * 100 : 0;

  const nextStep = () => {
    if (isCurrentStepValid) {
      if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1);
        // Save data after each question
        updateAuditMutation.mutate(auditData);
      } else {
        // Final step - generate PDF
        generatePdfMutation.mutate();
      }
    } else {
      // Show validation errors
      if (questions.length > 0) {
        const currentQuestion = questions[currentStep - 1];
        if (currentQuestion) {
          const fieldValue = auditData[currentQuestion.id as keyof AuditData];
          
          if (currentQuestion.type === 'checkbox') {
            if (!(Array.isArray(fieldValue) && fieldValue.length > 0)) {
              setErrors(prev => ({ ...prev, [currentQuestion.id]: 'Please select at least one option' }));
            }
          } else if (currentQuestion.type === 'text') {
            if (!(fieldValue !== undefined && fieldValue !== '' && String(fieldValue).trim() !== '')) {
              setErrors(prev => ({ ...prev, [currentQuestion.id]: 'Please provide an answer' }));
            }
          } else {
            if (!(fieldValue !== undefined && fieldValue !== '')) {
              setErrors(prev => ({ ...prev, [currentQuestion.id]: 'Please select an option' }));
            }
          }
        }
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

  const renderQuestion = (question: Question) => {
    const fieldValue = auditData[question.id as keyof AuditData];
    const currentError = errors[question.id];
    const isLastQuestion = currentStep === questions.length;

    return (
      <Card className="bg-white rounded-2xl shadow-lg max-w-2xl mx-auto">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="text-white h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{question.section}</h2>
            <p className="text-gray-600">Question {currentStep} of {questions.length}</p>
          </div>

          <div className="space-y-6">
            <div>
              <Label 
                className="text-lg font-semibold text-gray-900 mb-4 block"
                htmlFor={`question-${question.id}`}
                aria-describedby={currentError ? `error-${question.id}` : undefined}
              >
                {question.question}
                <span className="text-red-500 ml-1" aria-label="required">*</span>
              </Label>

              {question.type === 'radio' && question.options && (
                <RadioGroup
                  value={fieldValue as string || ''}
                  onValueChange={(value) => updateField(question.id as keyof AuditData, value)}
                  className="space-y-3"
                  aria-label={question.question}
                  aria-required="true"
                >
                  {question.options.map((option, index) => (
                    <div key={index} className={`flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors ${
                      currentError ? 'border-red-300' : 'border-gray-200'
                    }`}>
                      <RadioGroupItem 
                        value={option} 
                        id={`${question.id}-${index}`}
                        aria-describedby={currentError ? `error-${question.id}` : undefined}
                      />
                      <Label 
                        htmlFor={`${question.id}-${index}`} 
                        className="text-gray-700 cursor-pointer flex-1"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {question.type === 'checkbox' && question.options && (
                <div 
                  className="space-y-3"
                  role="group"
                  aria-label={question.question}
                  aria-required="true"
                  aria-describedby={currentError ? `error-${question.id}` : undefined}
                >
                  {question.options.map((option, index) => (
                    <div key={index} className={`flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors ${
                      currentError ? 'border-red-300' : 'border-gray-200'
                    }`}>
                      <Checkbox
                        id={`${question.id}-${index}`}
                        checked={Array.isArray(fieldValue) && fieldValue.includes(option)}
                        onCheckedChange={(checked) => 
                          updateMultipleChoice(question.id as keyof AuditData, option, checked as boolean)
                        }
                        aria-describedby={currentError ? `error-${question.id}` : undefined}
                      />
                      <Label 
                        htmlFor={`${question.id}-${index}`} 
                        className="text-gray-700 cursor-pointer flex-1"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              )}

              {question.type === 'text' && (
                <input
                  type="text"
                  id={`question-${question.id}`}
                  value={fieldValue as string || ''}
                  onChange={(e) => updateField(question.id as keyof AuditData, e.target.value)}
                  className={`w-full text-lg p-3 rounded-lg border focus:ring-2 focus:ring-teal-600 transition-colors ${
                    currentError ? 'border-red-300' : 'border-slate-300'
                  }`}
                  placeholder={question.id === 'zipCode' ? 'Enter 5-digit ZIP code' : 'Enter your answer...'}
                  aria-required="true"
                  aria-describedby={currentError ? `error-${question.id}` : undefined}
                  maxLength={question.id === 'zipCode' ? 5 : undefined}
                />
              )}

              {/* Error message */}
              {currentError && (
                <div 
                  id={`error-${question.id}`}
                  className="mt-2 text-sm text-red-600 flex items-center"
                  role="alert"
                  aria-live="polite"
                >
                  <span className="font-medium">{currentError}</span>
                </div>
              )}
            </div>

            {/* Photo Upload Section - Show after question 15 */}
            {isLastQuestion && (
              <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Upload className="mr-2 h-5 w-5 text-blue-600" />
                  Upload Photos (Optional)
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Add up to 5 photos of your home's disaster preparedness features to enhance your report.
                </p>

                {/* Photo Upload Input */}
                <div className="mb-4">
                  <label 
                    htmlFor="photo-upload"
                    className="flex items-center justify-center w-full p-6 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors"
                  >
                    <div className="text-center">
                      <Upload className="mx-auto h-8 w-8 text-blue-400 mb-2" />
                      <span className="text-sm font-medium text-blue-600">Choose photos</span>
                      <span className="block text-xs text-gray-500 mt-1">PNG, JPG, WebP up to 10MB each</span>
                    </div>
                  </label>
                  <input
                    id="photo-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    aria-label="Upload photos of your home's disaster preparedness features"
                  />
                </div>

                {/* Photo Upload Error */}
                {photoUploadError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{photoUploadError}</p>
                  </div>
                )}

                {/* Photo Previews */}
                {uploadedPhotos.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {uploadedPhotos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`Uploaded photo ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          onClick={() => removePhoto(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label={`Remove photo ${index + 1}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                        <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                          {(photo.size / (1024 * 1024)).toFixed(1)}MB
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {uploadedPhotos.length > 0 && (
                  <p className="text-xs text-gray-500 mt-2">
                    {uploadedPhotos.length} of 5 photos uploaded
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-between mt-8">
            <Button
              onClick={previousStep}
              variant="outline"
              disabled={currentStep === 1}
              className="px-6 py-3"
              aria-label="Go to previous question"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <Button
              onClick={nextStep}
              disabled={!isCurrentStepValid}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={isLastQuestion ? 'Complete audit and generate report' : 'Go to next question'}
            >
              {isLastQuestion ? 'Complete Audit' : 'Next'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
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

      {/* Dynamic Question Rendering */}
      {questions.length > 0 && currentStep <= questions.length && (
        <div className="max-w-4xl mx-auto">
          {renderQuestion(questions[currentStep - 1])}
        </div>
      )}

      {/* Final Report Generation Step */}
      {currentStep > questions.length && (
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white rounded-2xl shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Audit Complete!</h2>
              <p className="text-gray-600 mb-6">
                Thank you for completing your {primaryHazard.toLowerCase()} preparedness audit. 
                Your personalized report is being generated with tailored mitigation recommendations.
              </p>

              {/* Show uploaded photos summary */}
              {uploadedPhotos.length > 0 && (
                <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800 flex items-center justify-center">
                    <FileText className="mr-2 h-4 w-4" />
                    {uploadedPhotos.length} photo{uploadedPhotos.length !== 1 ? 's' : ''} uploaded and will be included in your report
                  </p>
                </div>
              )}

              {/* Error display */}
              {generatePdfMutation.isError && (
                <div 
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
                  role="alert"
                  aria-live="polite"
                >
                  <p className="text-sm text-red-800 font-medium mb-2">
                    Report Generation Failed
                  </p>
                  <p className="text-xs text-red-600">
                    {generatePdfMutation.error?.message || 'Unable to generate your report. Please try again or contact support if the issue persists.'}
                  </p>
                </div>
              )}
              
              <Button
                onClick={() => {
                  setIsGeneratingPdf(true);
                  generatePdfMutation.mutate();
                }}
                disabled={generatePdfMutation.isPending || isGeneratingPdf}
                className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 text-lg mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Generate your personalized disaster preparedness report"
              >
                {generatePdfMutation.isPending || isGeneratingPdf ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                    Generating Report...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-5 w-5" />
                    Generate My Report
                  </>
                )}
              </Button>

              {/* Loading progress indicator */}
              {(generatePdfMutation.isPending || isGeneratingPdf) && (
                <div className="mb-6">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-teal-600 h-2 rounded-full animate-pulse w-3/4"></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Analyzing your responses and generating personalized recommendations...
                  </p>
                </div>
              )}

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 mb-2">
                  Your report will include:
                </p>
                <ul className="text-xs text-blue-700 space-y-1 text-left">
                  <li>• Personalized mitigation recommendations based on your answers</li>
                  <li>• FEMA-aligned citations and guidance</li>
                  <li>• Available grants and rebates for your area</li>
                  <li>• Quick-win action items to start immediately</li>
                  {uploadedPhotos.length > 0 && (
                    <li>• Your uploaded photos with analysis notes</li>
                  )}
                </ul>
              </div>

              <div className="mt-4">
                <a
                  href="/Mitigation-Funding-Matrix.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-teal-600 hover:text-teal-700 text-sm font-medium transition-colors"
                  aria-label="View the complete mitigation and funding matrix in a new window"
                >
                  <ExternalLink className="mr-1 h-4 w-4" />
                  View Full Mitigation & Funding Matrix
                </a>
                <p className="text-xs text-gray-500 mt-1">
                  This matrix shows all potential grants and rebates—tailored recommendations appear in your report.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Loading state for questionnaire */}
      {questions.length === 0 && !isLoading && (
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white rounded-2xl shadow-lg">
            <CardContent className="p-8 text-center">
              <Shield className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Questions...</h2>
              <p className="text-gray-600">
                Preparing your personalized {primaryHazard.toLowerCase()} assessment questionnaire
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{display: 'none'}}>
        
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
                          <span className="font-medium">{auditData.zipCode || audit?.zipCode}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Primary Hazard:</span>
                          <span className="font-medium text-emergency-red">{primaryHazard}</span>
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
                    onClick={() => {
                      // Create audit and redirect to success page
                      const auditDataWithPhotos = {
                        ...auditData,
                        primaryHazard,
                        photosUploaded: uploadedPhotos.length,
                        zipCode: auditData.zipCode || audit?.zipCode
                      };
                      
                      // Create audit record
                      apiRequest("POST", "/api/audits", {
                        zipCode: audit?.zipCode,
                        primaryHazard: primaryHazard,
                        data: auditDataWithPhotos,
                      }).then((response) => response.json())
                        .then((updatedAudit) => {
                          // Redirect to complete page
                          setLocation(`/complete/${auditId}`);
                        })
                        .catch((error) => {
                          toast({
                            title: "Error",
                            description: "Failed to complete audit. Please try again.",
                            variant: "destructive",
                          });
                        });
                    }}
                    className="bg-emergency-red hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold"
                  >
                    <FileText className="mr-2 h-5 w-5" />
                    Complete Audit
                  </Button>
                  <p className="text-sm text-gray-600 mt-3">
                    Complete your audit to receive your personalized report
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
              disabled={!isCurrentStepValid}
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
