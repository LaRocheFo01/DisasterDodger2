import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Sparkles, FileText, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreativeReportButtonProps {
  auditId: number;
  disabled?: boolean;
  variant?: "default" | "creative";
}

export function CreativeReportButton({ auditId, disabled, variant = "creative" }: CreativeReportButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch(`/api/audits/${auditId}/creative-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate creative report');
      }

      // Download the PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `creative-safety-report-${auditId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Creative Report Generated",
        description: "Your visually enhanced safety report has been downloaded successfully.",
      });

    } catch (error) {
      console.error('Creative report generation failed:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate creative report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (variant === "creative") {
    return (
      <Button
        onClick={handleGenerateReport}
        disabled={disabled || isGenerating}
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Creating Magic...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Creative Report
          </>
        )}
      </Button>
    );
  }

  return (
    <Button
      onClick={handleGenerateReport}
      disabled={disabled || isGenerating}
      variant="outline"
      className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50"
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <FileText className="w-4 h-4 mr-2" />
          Creative Report
        </>
      )}
    </Button>
  );
}