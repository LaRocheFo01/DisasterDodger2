import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DownloadReportButtonProps {
  auditId: number;
  disabled?: boolean;
  className?: string;
}

export default function DownloadReportButton({ 
  auditId, 
  disabled = false,
  className = "" 
}: DownloadReportButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      
      // Generate and download the AI-powered PDF report
      const response = await fetch(`/api/audits/${auditId}/generate-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      // Get the PDF blob
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Disaster-Dodger-Report-${auditId}.pdf`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Report Generated Successfully!",
        description: "Your personalized disaster preparedness report with FEMA guidelines has been downloaded.",
      });

    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "Unable to generate your report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={disabled || isGenerating}
      className={`bg-disaster-green-600 hover:bg-disaster-green-700 text-white ${className}`}
      size="lg"
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          Generating AI Report...
        </>
      ) : (
        <>
          <FileText className="h-5 w-5 mr-2" />
          Download FEMA Report
        </>
      )}
    </Button>
  );
}