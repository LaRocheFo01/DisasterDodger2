import React from "react";
import { FileText, User, BarChart3, CheckCircle } from "lucide-react";

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateChange: (template: string) => void;
}

export default function TemplateSelector({ selectedTemplate, onTemplateChange }: TemplateSelectorProps) {
  const templates = [
    { 
      id: 'professional', 
      name: 'Professional Report', 
      description: 'Clean, corporate layout with FEMA citations',
      icon: FileText,
      features: ['FEMA Citations', 'Technical Details', 'Formal Layout']
    },
    { 
      id: 'homeowner', 
      name: 'Homeowner Friendly', 
      description: 'Easy-to-read format with visual highlights',
      icon: User,
      features: ['Visual Highlights', 'Plain Language', 'Action Focus']
    },
    { 
      id: 'comprehensive', 
      name: 'Comprehensive Analysis', 
      description: 'Detailed technical report with full data',
      icon: BarChart3,
      features: ['Full Data Sets', 'Risk Analysis', 'Cost Breakdowns']
    }
  ];

  return (
    <div className="mb-6">
      <label className="block text-lg font-semibold text-gray-900 mb-4">
        Choose Your Report Style
      </label>
      <div className="grid gap-4 md:grid-cols-3">
        {templates.map((template) => {
          const IconComponent = template.icon;
          const isSelected = selectedTemplate === template.id;

          return (
            <label
              key={template.id}
              className={`relative flex flex-col cursor-pointer rounded-xl border-2 p-6 transition-all hover:shadow-lg ${
                isSelected
                  ? 'border-disaster-green-600 bg-disaster-green-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="template"
                value={template.id}
                checked={isSelected}
                onChange={(e) => onTemplateChange(e.target.value)}
                className="sr-only"
              />

              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-disaster-green-600' : 'bg-gray-100'}`}>
                  <IconComponent className={`h-5 w-5 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                </div>
                {isSelected && (
                  <CheckCircle className="h-5 w-5 text-disaster-green-600" />
                )}
              </div>

              <div className="flex-1">
                <h3 className={`text-lg font-semibold mb-2 ${isSelected ? 'text-disaster-green-900' : 'text-gray-900'}`}>
                  {template.name}
                </h3>
                <p className={`text-sm mb-4 ${isSelected ? 'text-disaster-green-700' : 'text-gray-600'}`}>
                  {template.description}
                </p>

                <div className="space-y-1">
                  {template.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-xs">
                      <div className={`w-1.5 h-1.5 rounded-full mr-2 ${isSelected ? 'bg-disaster-green-600' : 'bg-gray-400'}`} />
                      <span className={isSelected ? 'text-disaster-green-800' : 'text-gray-600'}>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}