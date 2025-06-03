import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FileText, Brain } from 'lucide-react';

export function DeepseekAuditTest() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    zipCode: '',
    homeType: '',
    yearBuilt: '',
    primaryHazard: '',
    waterHeaterSecurity: '',
    defensibleSpace: '',
    roofCondition: '',
    foundationWork: '',
    emergencyKit: '',
    additionalConcerns: ''
  });
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.zipCode) {
      toast({
        title: "Validation Error",
        description: "ZIP code is required",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      console.log('Submitting to Deepseek API:', formData);
      
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: formData
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate AI audit report');
      }

      // Create blob from response
      const blob = await response.blob();
      
      // Create download URL
      const url = URL.createObjectURL(blob);
      
      // Create temporary download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `Deepseek_AI_Audit_${formData.zipCode}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "AI Report Generated",
        description: "Your Deepseek AI audit report has been generated and downloaded successfully.",
      });
      
    } catch (error: any) {
      console.error('Deepseek audit error:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "There was an error generating your AI audit report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-blue-600" />
          Deepseek AI Audit Test
        </CardTitle>
        <CardDescription>
          Test the new AI-powered audit workflow that sends answers to Deepseek and generates a PDF report.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="zipCode">ZIP Code *</Label>
            <Input
              id="zipCode"
              value={formData.zipCode}
              onChange={(e) => handleInputChange('zipCode', e.target.value)}
              placeholder="90210"
            />
          </div>
          <div>
            <Label htmlFor="homeType">Home Type</Label>
            <Select onValueChange={(value) => handleInputChange('homeType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select home type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single-family">Single Family</SelectItem>
                <SelectItem value="townhouse">Townhouse</SelectItem>
                <SelectItem value="condo">Condominium</SelectItem>
                <SelectItem value="mobile">Mobile Home</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="yearBuilt">Year Built</Label>
            <Input
              id="yearBuilt"
              value={formData.yearBuilt}
              onChange={(e) => handleInputChange('yearBuilt', e.target.value)}
              placeholder="1990"
            />
          </div>
          <div>
            <Label htmlFor="primaryHazard">Primary Hazard Concern</Label>
            <Select onValueChange={(value) => handleInputChange('primaryHazard', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select primary hazard" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="earthquake">Earthquake</SelectItem>
                <SelectItem value="wildfire">Wildfire</SelectItem>
                <SelectItem value="flood">Flood</SelectItem>
                <SelectItem value="hurricane">Hurricane</SelectItem>
                <SelectItem value="tornado">Tornado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="waterHeaterSecurity">Water Heater Secured?</Label>
            <Select onValueChange={(value) => handleInputChange('waterHeaterSecurity', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes, properly strapped</SelectItem>
                <SelectItem value="no">No, not secured</SelectItem>
                <SelectItem value="unsure">Not sure</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="roofCondition">Roof Condition</Label>
            <Select onValueChange={(value) => handleInputChange('roofCondition', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="defensibleSpace">Defensible Space (Wildfire)</Label>
            <Select onValueChange={(value) => handleInputChange('defensibleSpace', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select distance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="100+">100+ feet cleared</SelectItem>
                <SelectItem value="30-100">30-100 feet cleared</SelectItem>
                <SelectItem value="under-30">Less than 30 feet</SelectItem>
                <SelectItem value="none">No defensible space</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="foundationWork">Foundation Retrofitted?</Label>
            <Select onValueChange={(value) => handleInputChange('foundationWork', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes, bolted and braced</SelectItem>
                <SelectItem value="partial">Partially completed</SelectItem>
                <SelectItem value="no">No retrofitting</SelectItem>
                <SelectItem value="unsure">Not sure</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="emergencyKit">Emergency Kit Status</Label>
          <Select onValueChange={(value) => handleInputChange('emergencyKit', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select emergency preparedness level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="complete">Complete 72-hour kit</SelectItem>
              <SelectItem value="basic">Basic supplies only</SelectItem>
              <SelectItem value="minimal">Minimal preparation</SelectItem>
              <SelectItem value="none">No emergency kit</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="additionalConcerns">Additional Concerns</Label>
          <Textarea
            id="additionalConcerns"
            value={formData.additionalConcerns}
            onChange={(e) => handleInputChange('additionalConcerns', e.target.value)}
            placeholder="Describe any additional safety concerns or specific questions you have about your property..."
            rows={3}
          />
        </div>

        <Button 
          onClick={handleSubmit} 
          disabled={isGenerating || !formData.zipCode}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating AI Report...
            </>
          ) : (
            <>
              <FileText className="h-4 w-4 mr-2" />
              Generate Deepseek AI Report
            </>
          )}
        </Button>

        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          <strong>Workflow:</strong> Questionnaire → Deepseek AI Analysis → PDF Generation → Download
        </div>
      </CardContent>
    </Card>
  );
}