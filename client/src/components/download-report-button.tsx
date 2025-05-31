import { Button } from "./ui/button";
import { Download, FileText, Sparkles } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface DownloadReportButtonProps {
  auditId: number;
  disabled?: boolean;
}

export default function DownloadReportButton({ auditId, disabled }: DownloadReportButtonProps) {
const downloadBasicMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/audit/${auditId}/report`);

      if (!response.ok) {
        throw new Error('Failed to generate basic report');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `disaster_dodger_basic_report_${auditId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    onError: (error) => {
      console.error('Basic download failed:', error);
    }
  });

  const downloadAIMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/audit/${auditId}/ai-report`);

      if (!response.ok) {
        throw new Error('Failed to generate AI report');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `disaster_dodger_ai_report_${auditId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    onError: (error) => {
      console.error('AI download failed:', error);
    }
  });

  const downloadAdvancedMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/audit/${auditId}/advanced-report`);

      if (!response.ok) {
        throw new Error('Failed to generate advanced report');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `disaster_dodger_advanced_report_${auditId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    onError: (error) => {
      console.error('Advanced download failed:', error);
    }
  });

  const isLoading = downloadBasicMutation.isPending || downloadAIMutation.isPending || downloadAdvancedMutation.isPending;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          disabled={disabled || isLoading}
          className="w-full"
        >
          <Download className="w-4 h-4 mr-2" />
          {isLoading ? 'Generating Report...' : 'Download Report'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem 
          onClick={() => downloadBasicMutation.mutate()}
          disabled={downloadBasicMutation.isPending}
        >
          <FileText className="w-4 h-4 mr-2" />
          Basic PDF Report
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => downloadAIMutation.mutate()}
          disabled={downloadAIMutation.isPending}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          AI Slides Report
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => downloadAdvancedMutation.mutate()}
          disabled={downloadAdvancedMutation.isPending}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Advanced AI Report
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}