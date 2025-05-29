import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DownloadReportButtonProps {
  auditId: number;
  zipCode?: string;
  className?: string;
  useAI?: boolean;
}

export function DownloadReportButton({ auditId, zipCode, className, useAI = false }: DownloadReportButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    setIsGenerating(true);
    
    try {
      const endpoint = useAI ? `/api/audits/${auditId}/generate-ai-report` : `/api/audits/${auditId}/generate-pdf`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF report');
      }

      // Create blob from response
      const blob = await response.blob();
      
      // Create download URL
      const url = URL.createObjectURL(blob);
      
      // Create temporary download link
      const link = document.createElement('a');
      link.href = url;
      const reportType = useAI ? 'AI_Report' : 'Audit';
      link.download = `Disaster_Dodger_${reportType}_${zipCode || auditId}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Report Downloaded",
        description: useAI ? "Your AI-powered disaster preparedness report has been downloaded successfully." : "Your comprehensive home safety audit report has been downloaded successfully.",
      });
      
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "Download Failed",
        description: "There was an error generating your report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isGenerating}
      className={`bg-disaster-green-600 hover:bg-disaster-green-700 text-white ${className}`}
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          {useAI ? "Generating AI Report..." : "Generating PDF..."}
        </>
      ) : (
        <>
          <FileText className="h-4 w-4 mr-2" />
          {useAI ? "Download AI Report" : "Download Report PDF"}
        </>
      )}
    </Button>
  );
}