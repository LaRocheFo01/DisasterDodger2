// types.ts
export type SectionType =
  | 'cover'
  | 'summary'
  | 'hazardOverview'
  | 'methodology'
  | 'analysis'
  | 'recommendations'
  | 'costs'
  | 'grants'
  | 'appendix'
  | 'custom';

export interface ReportSection {
  id: string;
  title: string;
  type: SectionType;
  enabled: boolean;
  order: number;
  // Optional for truly custom pages:
  customContent?: string;
}

export interface ReportStyling {
  fonts: {
    primary: string;
    secondary: string;
    sizes: {
      title: number;   // e.g. 32 for H1
      header: number;  // e.g. 18 for section heads
      body: number;    // e.g. 12 for paragraphs
      caption: number; // e.g. 10 for footnotes
    };
  };
  colors: {
    primary: string;     // brand green
    secondary: string;   // accent (e.g. darker blue)
    text: string;        // main body text
    background: string;  // page background
    mute: string;        // secondary text / light gray
    success: string;
    warning: string;
    danger: string;
  };
  layout: {
    pageSize: 'A4' | 'Letter';
    margins: number;   // in points or mm
    gutter: number;    // spacing between elements
  };
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  sections: ReportSection[];
  styling: ReportStyling;
}

// defaults.ts
const baseStyling: ReportStyling = {
  fonts: {
    primary:   'Inter',
    secondary: 'Inter-Bold',
    sizes: {
      title:   32,
      header:  18,
      body:    12,
      caption: 10,
    },
  },
  colors: {
    primary:    '#16A34A',
    secondary:  '#0F4C81',
    text:       '#1F2937',
    background: '#F9FAFB',
    mute:       '#6B7280',
    success:    '#10B981',
    warning:    '#F59E0B',
    danger:     '#DC2626',
  },
  layout: {
    pageSize: 'A4',
    margins:  40,
    gutter:   20,
  },
};

export const COMPREHENSIVE_TEMPLATE: ReportTemplate = {
  id: 'comprehensive',
  name: 'Comprehensive Safety Report',
  description: 'Full audit with hazard overview, methodology, detailed analysis, and financial guidance.',
  sections: [
    { id: 'cover',           title: 'Cover Page',                       type: 'cover',           enabled: true, order: 1 },
    { id: 'summary',         title: 'Executive Summary',                type: 'summary',         enabled: true, order: 2 },
    { id: 'hazardOverview',  title: 'Hazard Overview',                  type: 'hazardOverview',  enabled: true, order: 3 },
    { id: 'methodology',     title: 'Methodology & Data Sources',       type: 'methodology',     enabled: true, order: 4 },
    { id: 'analysis',        title: 'Detailed Answer Analysis',         type: 'analysis',        enabled: true, order: 5 },
    { id: 'recommendations', title: 'Priority Upgrades & Recommendations', type: 'recommendations', enabled: true, order: 6 },
    { id: 'costs',           title: 'Cost Estimates & Rebates',         type: 'costs',           enabled: true, order: 7 },
    { id: 'grants',          title: 'Available Grants & Assistance',    type: 'grants',          enabled: true, order: 8 },
    { id: 'appendix',        title: 'Appendix & References',            type: 'appendix',        enabled: true, order: 9 },
  ],
  styling: baseStyling,
};

export const EXECUTIVE_TEMPLATE: ReportTemplate = {
  id: 'executive',
  name: 'Executive Summary Report',
  description: 'Highlights key findings, top risks, and recommended next steps.',
  sections: [
    { id: 'cover',           title: 'Cover Page',            type: 'cover',           enabled: true, order: 1 },
    { id: 'summary',         title: 'Executive Summary',     type: 'summary',         enabled: true, order: 2 },
    { id: 'recommendations', title: 'Top Recommendations',   type: 'recommendations', enabled: true, order: 3 },
    { id: 'costs',           title: 'Estimated Costs',       type: 'costs',           enabled: true, order: 4 },
  ],
  styling: {
    ...baseStyling,
    fonts: {
      primary:   'Inter',
      secondary: 'Inter-Bold',
      sizes: {
        title:   28,
        header:  16,
        body:    11,
        caption: 9,
      },
    },
    colors: {
      ...baseStyling.colors,
      primary:   '#0F4C81',   // swap accent for a more formal look
      background:'#FFFFFF',
    },
  },
};

export const TECHNICAL_TEMPLATE: ReportTemplate = {
  id: 'technical',
  name: 'Technical Analysis Report',
  description: 'For engineers and planners: includes data, FEMA citations, and technical notes.',
  sections: [
    { id: 'cover',           title: 'Cover Page',               type: 'cover',           enabled: true, order: 1 },
    { id: 'summary',         title: 'Executive Summary',        type: 'summary',         enabled: true, order: 2 },
    { id: 'hazardOverview',  title: 'Hazard Overview',          type: 'hazardOverview',  enabled: true, order: 3 },
    { id: 'methodology',     title: 'Methodology & Citations',  type: 'methodology',     enabled: true, order: 4 },
    { id: 'analysis',        title: 'Detailed Analysis',        type: 'analysis',        enabled: true, order: 5 },
    { id: 'grants',          title: 'Grant Opportunities',      type: 'grants',          enabled: true, order: 6 },
    { id: 'appendix',        title: 'Appendix & FEMA References', type: 'appendix',     enabled: true, order: 7 },
  ],
  styling: {
    ...baseStyling,
    fonts: {
      primary:   'Times-Roman',
      secondary: 'Times-Bold',
      sizes: {
        title:   30,
        header:  16,
        body:    11,
        caption: 9,
      },
    },
    colors: {
      ...baseStyling.colors,
      primary:    '#1F2937',   // a neutral dark
      secondary:  '#374151',
      background: '#FFFFFF',
    },
    layout: {
      ...baseStyling.layout,
      margins:  35,
      gutter:   15,
    },
  },
};

export const AVAILABLE_TEMPLATES = [
  COMPREHENSIVE_TEMPLATE,
  EXECUTIVE_TEMPLATE,
  TECHNICAL_TEMPLATE,
];

export function getTemplate(id: string): ReportTemplate {
  return AVAILABLE_TEMPLATES.find(t => t.id === id) ?? COMPREHENSIVE_TEMPLATE;
}