export const PROJECT_OPTIONS = [
  {
    name: 'update project information',
    route: 'projects/update-project-info'
  },
  {
    name: 'add project BOQs',
    route: 'projects/boq-list'
  },
  {
    name: 'Cash Flow',
    route: 'projects/cash-flow'
  },
  {
    name: 'Milestone List',
    route: 'projects/milestone_list'
  },
  {
    name: 'Critical Path',
    route: 'projects/critical_path'
  },
  {
    name: 'Daily Report',
    route: 'projects/daily-report'
  },
  {
    name: 'S Curve',
    route: 'projects/s-curve'
  },
  {
    name: 'Resource Plan List',
    route: 'projects/resource-plan-list'
  },
  {
    name: 'Project Letters',
    route: 'projects/project-letter'
  },
  {
    name: 'Sub Contractors',
    route: 'projects/sub-contractors'
  },
  {
    name: 'Time Schedule Management',
    route: 'projects/flood-management'
  },
  // {
    //   name: 'Open Site Listing',
    //   route: 'projects/project-site-location'
    // },
    {
      name: 'OBS List',
      route: 'projects/obs-list'
    },
    {
      name: 'Consultant Evaluation',
      route: 'projects/consultant-evaluation'
    },
    {
      name: 'Contractor Evaluation',
      route: 'projects/contractor-evaluation'
    },
    {
      name: 'Project Risks',
      route: 'projects/risk-management'
    },
    {
      name: 'Initial Delivery List',
      route: 'projects/initial-delivery-list'
    },
    {
      name: 'Project Status Report',
      route: 'projects/project-status-report'
    },
    {
      name: 'Projects Files',
      route: 'projects/project-files'
    },
    {
      name: 'HSE',
      route: 'projects/hse'
    },
    {
      name: 'Initial Delivery Status',
      route: 'projects/initial-delivery-status'
    },
    {
      name: 'Final Delivery Status',
      route: 'projects/final-delivery-status'
    },
    {
      name: 'factory',
      route: 'projects/factory-list'
    },
    {
      name: 'Library File Listing',
      route: 'projects/library-file-listing'
    },
    {
      name: 'MIR List',
      route: 'projects/mir-list'
    },
    {
      name: 'Project Sites',
      route: 'projects/project-sites'
    },
    {
      name: 'Monthly Report',
      route: 'projects/monthly_reports'
    },
    {
      name: 'RFI',
      route: 'projects/rfi-list'
    },
    {
      name: 'Visit Form',
      route: 'projects/visit-list'
    },
]
export interface ProjectOptionItem {
  name: string;
  route: string;
  description: string;
  icon: string;
  iconClass: string;
  count?: number;
}

export interface ProjectOptionSection {
  title: string;
  options: ProjectOptionItem[];
}

export const PROJECT_OPTION_SECTIONS: ProjectOptionSection[] = [
  {
    title: 'Planning & Control',
    options: [
      {
        name: 'Schedule',
        route: 'projects/flood-management',
        description: 'Time schedule management',
        icon: 'calendar',
        iconClass: 'bg-light-primary text-primary'
      },
      {
        name: 'Critical Path',
        route: 'projects/critical_path',
        description: 'Manage key dependencies',
        icon: 'chart-simple',
        iconClass: 'bg-light-info text-info'
      },
      {
        name: 'S-Curve',
        route: 'projects/s-curve',
        description: 'Track earned progress',
        icon: 'chart-line',
        iconClass: 'bg-light-danger text-danger'
      },
      {
        name: 'Resource Plan',
        route: 'projects/resource-plan-list',
        description: 'Allocate project resources',
        icon: 'abstract-26',
        iconClass: 'bg-light-success text-success'
      }
    ]
  },
  {
    title: 'Execution',
    options: [
      {
        name: 'Daily Report',
        route: 'projects/daily-report',
        description: 'Capture daily activity',
        icon: 'note',
        iconClass: 'bg-light-primary text-primary'
      },
      {
        name: 'Milestones',
        route: 'projects/milestone_list',
        description: 'Monitor key deliverables',
        icon: 'flag',
        iconClass: 'bg-light-warning text-warning'
      },
      {
        name: 'Project Sites',
        route: 'projects/project-sites',
        description: 'Manage active sites',
        icon: 'geolocation-home',
        iconClass: 'bg-light-warning text-warning'
      },
      {
        name: 'HSE',
        route: 'projects/hse',
        description: 'Health and safety controls',
        icon: 'shield-tick',
        iconClass: 'bg-light-success text-success'
      }
    ]
  },
  {
    title: 'Commercial & Contracts',
    options: [
      {
        name: 'BOQs',
        route: 'projects/boq-list',
        description: 'Bill of quantities',
        icon: 'book-square',
        iconClass: 'bg-light-primary text-primary'
      },
      {
        name: 'Subcontractors',
        route: 'projects/sub-contractors',
        description: 'Subcontractor records',
        icon: 'people',
        iconClass: 'bg-light-info text-info'
      },
      {
        name: 'Consultant Evaluation',
        route: 'projects/consultant-evaluation',
        description: 'Consultant performance',
        icon: 'like-shapes',
        iconClass: 'bg-light-warning text-warning'
      },
      {
        name: 'Contractor Evaluation',
        route: 'projects/contractor-evaluation',
        description: 'Contractor performance',
        icon: 'star',
        iconClass: 'bg-light-danger text-danger'
      }
    ]
  },
  {
    title: 'Documents & Communication',
    options: [
      {
        name: 'Project Letters',
        route: 'projects/project-letter',
        description: 'Official correspondences',
        icon: 'message-text-2',
        iconClass: 'bg-light-primary text-primary'
      },
      {
        name: 'RFI',
        route: 'projects/rfi-list',
        description: 'Requests for information',
        icon: 'information-5',
        iconClass: 'bg-light-danger text-danger',
        count: 12
      },
      {
        name: 'Files',
        route: 'projects/project-files',
        description: 'Project file repository',
        icon: 'folder',
        iconClass: 'bg-light-success text-success'
      },
      {
        name: 'Library',
        route: 'projects/library-file-listing',
        description: 'Shared project resources',
        icon: 'book-open',
        iconClass: 'bg-light-info text-info'
      }
    ]
  },
  {
    title: 'Project Setup',
    options: [
      {
        name: 'Project Information',
        route: 'projects/update-project-info',
        description: 'Update core project details',
        icon: 'setting-2',
        iconClass: 'bg-light-primary text-primary'
      },
      {
        name: 'Factory',
        route: 'projects/factory-list',
        description: 'Factory related data',
        icon: 'office-bag',
        iconClass: 'bg-light-warning text-warning'
      },
      {
        name: 'Visit Form',
        route: 'projects/visit-list',
        description: 'Site visits and logs',
        icon: 'map',
        iconClass: 'bg-light-success text-success'
      },
      {
        name: 'Monthly Report',
        route: 'projects/monthly_reports',
        description: 'Monthly progress summary',
        icon: 'calendar-8',
        iconClass: 'bg-light-info text-info'
      }
    ]
  },
  {
    title: 'Risk & Governance',
    options: [
      {
        name: 'Project Risks',
        route: 'projects/risk-management',
        description: 'Risk register and actions',
        icon: 'shield-search',
        iconClass: 'bg-light-danger text-danger'
      },
      {
        name: 'OBS',
        route: 'projects/obs-list',
        description: 'Organizational breakdown',
        icon: 'abstract-39',
        iconClass: 'bg-light-info text-info'
      },
      {
        name: 'Status Report',
        route: 'projects/project-status-report',
        description: 'Current project status',
        icon: 'status',
        iconClass: 'bg-light-primary text-primary'
      },
      {
        name: 'Delivery Status',
        route: 'projects/initial-delivery-status',
        description: 'Initial and final delivery tracking',
        icon: 'truck',
        iconClass: 'bg-light-success text-success'
      },
      {
        name: 'Final Delivery Status',
        route: 'projects/final-delivery-status',
        description: 'Final delivery checkpoints',
        icon: 'delivery-3',
        iconClass: 'bg-light-success text-success'
      },
      {
        name: 'Initial Delivery List',
        route: 'projects/initial-delivery-list',
        description: 'Manage delivery list',
        icon: 'clipboard',
        iconClass: 'bg-light-warning text-warning'
      },
      {
        name: 'MIR',
        route: 'projects/mir-list',
        description: 'Material inspection requests',
        icon: 'document',
        iconClass: 'bg-light-primary text-primary'
      },
      {
        name: 'Cash Flow',
        route: 'projects/cash-flow',
        description: 'Cash flow analysis',
        icon: 'dollar',
        iconClass: 'bg-light-success text-success'
      }
    ]
  }
];
