import { StatusColors, ClusterName } from './types';

export const CLUSTER_COLORS: Record<ClusterName, string> = {
  BI3: "bg-slate-50 text-slate-600 border-slate-200",
  BI4: "bg-blue-50 text-blue-600 border-blue-200",
  BI5: "bg-emerald-50 text-emerald-600 border-emerald-200",
  BI6: "bg-purple-50 text-purple-600 border-purple-200",
  BICN2: "bg-amber-50 text-amber-600 border-amber-200",
} as const;

export const CLUSTER_STRIPE_COLORS: Record<ClusterName, string> = {
  BI3: "bg-slate-50",
  BI4: "bg-blue-50",
  BI5: "bg-emerald-50",
  BI6: "bg-purple-50",
  BICN2: "bg-amber-50",
} as const;

export const STATUS_COLORS: Record<string, StatusColors> = {
  operational: {
    textColor: "text-green-600",
    bgColor: "bg-green-500",
    badgeColor: "bg-green-100 text-green-800"
  },
  "under maintenance": {
    textColor: "text-blue-600", 
    bgColor: "bg-blue-500",
    badgeColor: "bg-blue-100 text-blue-800"
  },
  error: {
    textColor: "text-red-600",
    bgColor: "bg-red-500", 
    badgeColor: "bg-red-100 text-red-800"
  },
} as const;

export const ITEMS_PER_PAGE = 25;

export const PAGE_SIZE_OPTIONS = [
  { value: 10, label: "10 per page" },
  { value: 25, label: "25 per page" },
  { value: 50, label: "50 per page" },
  { value: 100, label: "100 per page" }
] as const;

export const DEFAULT_STATIC_DATE = "August 13, 2025";

export const FILTER_OPTIONS = {
  departments: [
    { value: "all", label: "All Departments" },
    { value: "human", label: "Human" },
    { value: "animal", label: "Animal" }
  ],
  applications: [
    { value: "all", label: "All Types" },
    { value: "drupal", label: "Drupal" },
    { value: "wordpress", label: "WordPress" },
    { value: "custom", label: "Custom" },
    { value: "gitbook", label: "GitBook" },
    { value: "salesforce", label: "Salesforce" },
    { value: "na", label: "N/A" }
  ],
  clusters: [
    { value: "all", label: "All Clusters" },
    { value: "bi3", label: "BI3" },
    { value: "bi4", label: "BI4" },
    { value: "bi5", label: "BI5" },
    { value: "bi6", label: "BI6" },
    { value: "bicn2", label: "BICN2" }
  ],
  statuses: [
    { value: "all", label: "All Status" },
    { value: "operational", label: "Operational" },
    { value: "under maintenance", label: "Under Maintenance" },
    { value: "error", label: "Error" }
  ],
  types: [
    { value: "all", label: "All Types" },
    { value: "production", label: "Production" },
    { value: "development", label: "Development" },
    { value: "staging", label: "Staging" }
  ]
} as const;
