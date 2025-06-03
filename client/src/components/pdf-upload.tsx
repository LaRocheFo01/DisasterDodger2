
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, FileText } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

interface PDFUploadProps {
  onPDFsChange: (pdfs: { name: string; content: string }[]) => void;
}

export function PDFUpload({ onPDFsChange }: PDFUploadProps) {
  const [uploadedPDFs, setUploadedPDFs] = useState<{ name: string; content: string; size: number }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }
    
    return fullText;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsProcessing(true);
    const newPDFs: { name: string; content: string; size: number }[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (file.type !== 'application/pdf') {
        console.warn(`Skipping non-PDF file: ${file.name}`);
        continue;
      }

      try {
        const content = await extractTextFromPDF(file);
        newPDFs.push({
          name: file.name,
          content: content,
          size: file.size
        });
      } catch (error) {
        console.error(`Failed to process ${file.name}:`, error);
      }
    }

    const allPDFs = [...uploadedPDFs, ...newPDFs];
    setUploadedPDFs(allPDFs);
    onPDFsChange(allPDFs);
    setIsProcessing(false);
  };

  const removePDF = (index: number) => {
    const newPDFs = uploadedPDFs.filter((_, i) => i !== index);
    setUploadedPDFs(newPDFs);
    onPDFsChange(newPDFs);
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
        <input
          type="file"
          multiple
          accept=".pdf"
          onChange={handleFileUpload}
          className="hidden"
          id="pdf-upload"
          disabled={isProcessing}
        />
        <label htmlFor="pdf-upload" className="cursor-pointer">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            {isProcessing ? 'Processing PDFs...' : 'Click to upload PDF files or drag and drop'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Upload FEMA guides, inspection reports, or other relevant documents
          </p>
        </label>
      </div>

      {uploadedPDFs.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Uploaded Documents:</h4>
          {uploadedPDFs.map((pdf, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">{pdf.name}</p>
                  <p className="text-xs text-gray-500">
                    {(pdf.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removePDF(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
