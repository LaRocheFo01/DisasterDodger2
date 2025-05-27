import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { ArrowLeft, ArrowRight, CheckCircle, Upload, X, Shield, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/audit-wizard/:auditId");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [auditData, setAuditData] = useState<AuditData>({});
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
  const [photoUploadError, setPhotoUploadError] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();

  // Get audit ID from URL params
  const auditId = params?.auditId ? parseInt(params.auditId, 10) : 0;

  // Fetch audit data
  const { data: audit, isLoading: auditLoading } = useQuery({
    queryKey: [`/api/audits/${auditId}`],
    enabled: !!auditId
  });

  // Get questions for the audit's hazard type
  const questions = audit?.primaryHazard ? getQuestionsForHazard(audit.primaryHazard) : [];
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // Update audit mutation
  const updateAuditMutation = useMutation({
    mutationFn: async (updates: Partial<AuditData>) => {
      const response = await fetch(`/api/audits/${auditId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error('Failed to update audit');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/audits', auditId] });
    }
  });

  const nextStep = () => {
    if (!validateCurrentQuestion()) return;

    // Save current answer
    const updates = { [currentQuestion.id]: auditData[currentQuestion.id as keyof AuditData] };
    updateAuditMutation.mutate(updates);

    if (isLastQuestion) {
      // Complete the audit
      completeAudit();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const previousStep = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const validateCurrentQuestion = (): boolean => {
    if (!currentQuestion) return false;

    const value = auditData[currentQuestion.id as keyof AuditData];
    const errors: Record<string, string> = {};

    if (!value || (Array.isArray(value) && value.length === 0)) {
      errors[currentQuestion.id] = 'This field is required';
    }

    if (currentQuestion.id === 'zipCode' && value) {
      const zipCodeRegex = /^\d{5}$/;
      if (!zipCodeRegex.test(value as string)) {
        errors[currentQuestion.id] = 'Please enter a valid 5-digit ZIP code';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const completeAudit = async () => {
    try {
      // Update audit with final data and mark as completed
      await updateAuditMutation.mutateAsync({
        ...auditData,
        photosUploaded: uploadedPhotos.length,
        status: 'completed'
      });

      // Navigate to success page
      setLocation(`/success/${auditId}`);
    } catch (error) {
      console.error('Error completing audit:', error);
      alert('Failed to complete audit. Please try again.');
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const maxFiles = 5;
    const maxFileSize = 10 * 1024 * 1024; // 10MB

    setPhotoUploadError("");

    if (uploadedPhotos.length + files.length > maxFiles) {
      setPhotoUploadError(`You can only upload up to ${maxFiles} photos total.`);
      return;
    }

    const invalidFiles = files.filter(file => file.size > maxFileSize);
    if (invalidFiles.length > 0) {
      setPhotoUploadError(`Some files are too large. Maximum size is 10MB per file.`);
      return;
    }

    setUploadedPhotos(prev => [...prev, ...files]);
    event.target.value = '';
  };

  const removePhoto = (index: number) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const renderQuestion = (question: Question) => {
    const value = auditData[question.id as keyof AuditData];
    const currentError = validationErrors[question.id];

    if (question.type === 'radio') {
      return (
        <RadioGroup
          value={value as string || ""}
          onValueChange={(newValue) => {
            setAuditData(prev => ({ ...prev, [question.id]: newValue }));
            setValidationErrors(prev => ({ ...prev, [question.id]: "" }));
          }}
          className="space-y-3"
        >
          {question.options?.map((option) => (
            <div key={option} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <RadioGroupItem 
                value={option} 
                id={`${question.id}-${option}`}
                className="text-disaster-green-600"
              />
              <Label 
                htmlFor={`${question.id}-${option}`}
                className="flex-1 cursor-pointer text-gray-700"
              >
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      );
    }

    if (question.type === 'checkbox') {
      const selectedOptions = (value as string[]) || [];
      return (
        <div className="space-y-3">
          {question.options?.map((option) => (
            <div key={option} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <Checkbox
                id={`${question.id}-${option}`}
                checked={selectedOptions.includes(option)}
                onCheckedChange={(checked) => {
                  const newValue = checked
                    ? [...selectedOptions, option]
                    : selectedOptions.filter(item => item !== option);
                  setAuditData(prev => ({ ...prev, [question.id]: newValue }));
                  setValidationErrors(prev => ({ ...prev, [question.id]: "" }));
                }}
                className="text-disaster-green-600"
              />
              <Label 
                htmlFor={`${question.id}-${option}`}
                className="flex-1 cursor-pointer text-gray-700"
              >
                {option}
              </Label>
            </div>
          ))}
        </div>
      );
    }

    if (question.type === 'text') {
      return (
        <Textarea
          value={value as string || ""}
          onChange={(e) => {
            setAuditData(prev => ({ ...prev, [question.id]: e.target.value }));
            setValidationErrors(prev => ({ ...prev, [question.id]: "" }));
          }}
          className={`min-h-[100px] focus:ring-disaster-green-500 focus:border-disaster-green-500 ${
            currentError ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder={question.id === 'zipCode' ? 'Enter 5-digit ZIP code' : 'Enter your answer...'}
          maxLength={question.id === 'zipCode' ? 5 : undefined}
        />
      );
    }

    return null;
  };

  if (auditLoading) {
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

  if (!audit || questions.length === 0) {
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
            <div className="text-sm text-gray-600">
              {currentQuestionIndex + 1} of {questions.length}
            </div>
          </div>
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div 
            className="bg-disaster-green-600 h-2 rounded-full transition-all duration-300" 
            style={{width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`}}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mb-8">
          Step 2 of 3: {audit?.primaryHazard} Assessment
        </p>
      </div>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Question Card */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-disaster-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                {currentQuestionIndex + 1}
              </div>
              <span className="text-sm font-medium text-disaster-green-600 uppercase tracking-wide">
                {currentQuestion.section}
              </span>
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-4">
              {currentQuestion.question}
            </h2>
          </div>

          <div className="space-y-4">
            {renderQuestion(currentQuestion)}

            {/* Error message */}
            {validationErrors[currentQuestion.id] && (
              <div className="mt-2 text-sm text-red-600 flex items-center">
                <span className="font-medium">{validationErrors[currentQuestion.id]}</span>
              </div>
            )}
          </div>

          {/* Photo Upload Section - Show on last question */}
          {isLastQuestion && (
            <div className="mt-8 p-6 bg-disaster-green-50 rounded-lg border border-disaster-green-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Upload className="mr-2 h-5 w-5 text-disaster-green-600" />
                Upload Photos (Optional)
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Add up to 5 photos of your home's disaster preparedness features to enhance your report.
              </p>

              {/* Photo Upload Input */}
              <div className="mb-4">
                <label 
                  htmlFor="photo-upload"
                  className="flex items-center justify-center w-full p-6 border-2 border-dashed border-disaster-green-300 rounded-lg cursor-pointer hover:border-disaster-green-400 transition-colors"
                >
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-disaster-green-500 mb-2" />
                    <span className="text-sm font-medium text-disaster-green-700">Choose photos</span>
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
      </main>

      {/* Fixed Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-3xl mx-auto flex justify-between">
          <Button
            onClick={previousStep}
            variant="outline"
            disabled={currentQuestionIndex === 0}
            className="border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            Previous
          </Button>
          <Button
            onClick={nextStep}
            disabled={updateAuditMutation.isPending}
            className="bg-disaster-green-600 hover:bg-disaster-green-700 px-8 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-disaster-green-500"
          >
            {updateAuditMutation.isPending ? (
              "Saving..."
            ) : isLastQuestion ? (
              <>
                Complete Assessment
                <CheckCircle className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}