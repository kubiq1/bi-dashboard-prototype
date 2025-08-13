import { StatusColors, ClusterName, Project, SortDirection } from './types';
import { STATUS_COLORS, CLUSTER_COLORS, CLUSTER_STRIPE_COLORS } from './constants';

export const getStatusColor = (status: string): StatusColors => {
  return STATUS_COLORS[status.toLowerCase()] || {
    textColor: "text-gray-600",
    bgColor: "bg-gray-500",
    badgeColor: "bg-gray-100 text-gray-800"
  };
};

export const getClusterColor = (clusterName: string): string => {
  return CLUSTER_COLORS[clusterName as ClusterName] || "bg-gray-50 text-gray-600 border-gray-200";
};

export const getClusterStripeColor = (clusterName: string): string => {
  return CLUSTER_STRIPE_COLORS[clusterName as ClusterName] || "bg-gray-50";
};

export const formatCurrentDate = (): string => {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const parseNumericValue = (value: string): number => {
  return parseInt(value.replace(/[^\d]/g, ""));
};

export const parsePercentageValue = (value: string): number => {
  return parseFloat(value.replace("%", ""));
};

export const sortProjects = (
  projects: Project[],
  field: string,
  direction: SortDirection
): Project[] => {
  return [...projects].sort((a, b) => {
    let aValue: any = a[field as keyof Project];
    let bValue: any = b[field as keyof Project];

    // Handle special cases
    if (field === "cost") {
      aValue = parseNumericValue(aValue);
      bValue = parseNumericValue(bValue);
    } else if (field === "percentage") {
      aValue = parsePercentageValue(aValue);
      bValue = parsePercentageValue(bValue);
    } else if (field === "cluster") {
      aValue = Array.isArray(aValue) ? aValue.join(", ") : aValue;
      bValue = Array.isArray(bValue) ? bValue.join(", ") : bValue;
    }

    if (direction === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
};

export const filterProjects = (
  projects: Project[],
  filters: {
    department: string;
    application: string;
    cluster: string;
  }
): Project[] => {
  return projects.filter((project) => {
    // Department filter
    if (
      filters.department !== "all" &&
      project.department.toLowerCase() !== filters.department
    ) {
      return false;
    }

    // Application filter
    if (filters.application !== "all") {
      const projectCms = project.cms.toLowerCase();
      if (filters.application === "na" && projectCms !== "n/a") {
        return false;
      } else if (
        filters.application !== "na" &&
        projectCms !== filters.application
      ) {
        return false;
      }
    }

    // Cluster filter
    if (filters.cluster !== "all") {
      const hasCluster = project.cluster.some(
        (cluster) => cluster.toLowerCase() === filters.cluster.toLowerCase(),
      );
      if (!hasCluster) {
        return false;
      }
    }

    return true;
  });
};

export const generatePageNumbers = (
  currentPage: number,
  totalPages: number,
  delta: number = 2
): (number | string)[] => {
  const range = [];
  const rangeWithDots = [];

  // Handle cases with small total pages
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      rangeWithDots.push(i);
    }
    return rangeWithDots;
  }

  // Add first page
  rangeWithDots.push(1);

  // Add ellipsis if needed
  if (currentPage - delta > 2) {
    rangeWithDots.push("...");
  }

  // Add pages around current page
  for (
    let i = Math.max(2, currentPage - delta);
    i <= Math.min(totalPages - 1, currentPage + delta);
    i++
  ) {
    range.push(i);
  }
  rangeWithDots.push(...range);

  // Add ellipsis if needed
  if (currentPage + delta < totalPages - 1) {
    rangeWithDots.push("...");
  }

  // Add last page if not already included
  if (totalPages > 1 && !rangeWithDots.includes(totalPages)) {
    rangeWithDots.push(totalPages);
  }

  return rangeWithDots;
};
