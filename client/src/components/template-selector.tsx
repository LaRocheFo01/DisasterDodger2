
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  sections: Array<{
    id: string;
    title: string;
    enabled: boolean;
  }>;
}

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateChange: (templateId: string) => void;
  className?: string;
}

export function TemplateSelector({ selectedTemplate, onTemplateChange, className }: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/report-templates');
      if (response.ok) {
        const templatesData = await response.json();
        setTemplates(templatesData);
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentTemplate = templates.find(t => t.id === selectedTemplate);

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-24 rounded-lg"></div>;
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Report Template</CardTitle>
        <CardDescription>
          Choose the style and sections for your safety report
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Select value={selectedTemplate} onValueChange={onTemplateChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a template" />
          </SelectTrigger>
          <SelectContent>
            {templates.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                <div className="flex flex-col">
                  <span className="font-medium">{template.name}</span>
                  <span className="text-sm text-gray-500">
                    {template.sections.filter(s => s.enabled).length} sections
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {currentTemplate && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">{currentTemplate.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
