
export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  sections: ReportSection[];
  styling: ReportStyling;
}

export interface ReportSection {
  id: string;
  title: string;
  type: 'cover' | 'summary' | 'analysis' | 'recommendations' | 'costs' | 'grants' | 'slides' | 'custom';
  enabled: boolean;
  order: number;
  customContent?: string;
}

export interface ReportStyling {
  fonts: {
    primary: string;
    secondary: string;
    size: {
      title: number;
      header: number;
      body: number;
      small: number;
    };
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    lightGray: string;
    background: string;
    white: string;
    danger: string;
    warning: string;
    success: string;
  };
  layout: {
    margins: number;
    pageSize: string;
    spacing: number;
  };
}

export const DEFAULT_TEMPLATE: ReportTemplate = {
  id: 'comprehensive',
  name: 'Comprehensive Safety Report',
  description: 'Complete disaster preparedness assessment with all sections',
  sections: [
    {
      id: 'cover',
      title: 'Cover Page',
      type: 'cover',
      enabled: true,
      order: 1
    },
    {
      id: 'summary',
      title: 'Executive Summary',
      type: 'summary',
      enabled: true,
      order: 2
    },
    {
      id: 'analysis',
      title: 'Detailed Answer Analysis',
      type: 'analysis',
      enabled: true,
      order: 3
    },
    {
      id: 'recommendations',
      title: 'Priority Upgrades & Recommendations',
      type: 'recommendations',
      enabled: true,
      order: 4
    },
    {
      id: 'costs',
      title: 'Cost Estimates & Financial Assistance',
      type: 'costs',
      enabled: true,
      order: 5
    }
  ],
  styling: {
    fonts: {
      primary: 'Helvetica',
      secondary: 'Helvetica-Bold',
      size: {
        title: 36,
        header: 18,
        body: 12,
        small: 10
      }
    },
    colors: {
      primary: "#16A34A",
      secondary: "#10B981",
      accent: "#0F4C81",
      text: "#1F2937",
      lightGray: "#6B7280",
      background: "#F9FAFB",
      white: "#FFFFFF",
      danger: "#DC2626",
      warning: "#F59E0B",
      success: "#10B981"
    },
    layout: {
      margins: 40,
      pageSize: 'A4',
      spacing: 20
    }
  }
};

export const EXECUTIVE_TEMPLATE: ReportTemplate = {
  id: 'executive',
  name: 'Executive Summary Report',
  description: 'Condensed report focusing on key findings and recommendations',
  sections: [
    {
      id: 'cover',
      title: 'Cover Page',
      type: 'cover',
      enabled: true,
      order: 1
    },
    {
      id: 'summary',
      title: 'Executive Summary',
      type: 'summary',
      enabled: true,
      order: 2
    },
    {
      id: 'recommendations',
      title: 'Priority Recommendations',
      type: 'recommendations',
      enabled: true,
      order: 3
    }
  ],
  styling: {
    fonts: {
      primary: 'Helvetica',
      secondary: 'Helvetica-Bold',
      size: {
        title: 32,
        header: 16,
        body: 11,
        small: 9
      }
    },
    colors: {
      primary: "#0F4C81",
      secondary: "#16A34A",
      accent: "#10B981",
      text: "#1F2937",
      lightGray: "#6B7280",
      background: "#F8FAFC",
      white: "#FFFFFF",
      danger: "#DC2626",
      warning: "#F59E0B",
      success: "#10B981"
    },
    layout: {
      margins: 50,
      pageSize: 'A4',
      spacing: 25
    }
  }
};

export const DETAILED_TEMPLATE: ReportTemplate = {
  id: 'detailed',
  name: 'Detailed Technical Report',
  description: 'In-depth analysis with all technical details and FEMA references',
  sections: [
    {
      id: 'cover',
      title: 'Cover Page',
      type: 'cover',
      enabled: true,
      order: 1
    },
    {
      id: 'summary',
      title: 'Executive Summary',
      type: 'summary',
      enabled: true,
      order: 2
    },
    {
      id: 'analysis',
      title: 'Detailed Answer Analysis',
      type: 'analysis',
      enabled: true,
      order: 3
    },
    {
      id: 'recommendations',
      title: 'Priority Upgrades & Recommendations',
      type: 'recommendations',
      enabled: true,
      order: 4
    },
    {
      id: 'costs',
      title: 'Cost Estimates & Financial Assistance',
      type: 'costs',
      enabled: true,
      order: 5
    },
    {
      id: 'grants',
      title: 'Grant Opportunities',
      type: 'grants',
      enabled: true,
      order: 6
    }
  ],
  styling: {
    fonts: {
      primary: 'Times-Roman',
      secondary: 'Times-Bold',
      size: {
        title: 28,
        header: 16,
        body: 11,
        small: 9
      }
    },
    colors: {
      primary: "#1F2937",
      secondary: "#374151",
      accent: "#16A34A",
      text: "#111827",
      lightGray: "#9CA3AF",
      background: "#FFFFFF",
      white: "#FFFFFF",
      danger: "#DC2626",
      warning: "#F59E0B",
      success: "#059669"
    },
    layout: {
      margins: 35,
      pageSize: 'A4',
      spacing: 15
    }
  }
};

export const SLIDES_TEMPLATE: ReportTemplate = {
  id: 'slides',
  name: 'Presentation Slides Report',
  description: 'Report formatted as presentation slides with visual focus',
  sections: [
    {
      id: 'cover',
      title: 'Title Slide',
      type: 'cover',
      enabled: true,
      order: 1
    },
    {
      id: 'slides',
      title: 'Key Findings Slides',
      type: 'slides',
      enabled: true,
      order: 2
    },
    {
      id: 'recommendations',
      title: 'Action Items Slides',
      type: 'recommendations',
      enabled: true,
      order: 3
    }
  ],
  styling: {
    fonts: {
      primary: 'Helvetica',
      secondary: 'Helvetica-Bold',
      size: {
        title: 48,
        header: 32,
        body: 18,
        small: 14
      }
    },
    colors: {
      primary: "#16A34A",
      secondary: "#10B981",
      accent: "#0F4C81",
      text: "#1F2937",
      lightGray: "#6B7280",
      background: "#F9FAFB",
      white: "#FFFFFF",
      danger: "#DC2626",
      warning: "#F59E0B",
      success: "#10B981"
    },
    layout: {
      margins: 60,
      pageSize: 'A4',
      spacing: 40
    }
  }
};

export const AVAILABLE_TEMPLATES = [
  DEFAULT_TEMPLATE,
  EXECUTIVE_TEMPLATE,
  DETAILED_TEMPLATE,
  SLIDES_TEMPLATE
];

export function getTemplate(templateId: string): ReportTemplate {
  return AVAILABLE_TEMPLATES.find(t => t.id === templateId) || DEFAULT_TEMPLATE;
}
