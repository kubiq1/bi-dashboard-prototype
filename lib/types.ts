export interface Project {
  name: string;
  department: 'Human' | 'Animal';
  cluster: string[];
  cost: string;
  percentage: string;
  cms: string;
  stage: string;
  stageColor: string;
}

export interface Cluster {
  id: string;
  name: string;
  type: 'Production' | 'Development' | 'Staging';
  status: 'Operational' | 'Under Maintenance' | 'Error';
  podDensity: number;
  nodeCount: number;
  ramUsage: number;
  cpuUsage: number;
  databaseSize: number;
  storageSize: number;
  hitsRequests: string;
  description: string;
}

export type ClusterName = 'BI3' | 'BI4' | 'BI5' | 'BI6' | 'BICN2';
export type StatusType = 'Operational' | 'Under Maintenance' | 'Error';
export type DepartmentType = 'Human' | 'Animal';
export type SortDirection = 'asc' | 'desc';

export interface StatusColors {
  textColor: string;
  bgColor: string;
  badgeColor: string;
}

export interface FilterState {
  department: string;
  application: string;
  cluster: string;
}

export interface PaginationState {
  currentPage: number;
  pageInput: string;
  itemsPerPage: number;
}
