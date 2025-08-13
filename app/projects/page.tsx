"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import Navigation from "@/components/shared/Navigation";
import ProjectRow from "@/components/shared/ProjectRow";
import { mockProjects } from "@/lib/data";
import { Project, SortDirection, FilterState, PaginationState } from "@/lib/types";
import { formatCurrentDate, sortProjects, filterProjects, generatePageNumbers, getClusterColor } from "@/lib/shared-utils";
import { ITEMS_PER_PAGE, DEFAULT_STATIC_DATE, FILTER_OPTIONS } from "@/lib/constants";

const mockProjects = [
  {
    name: "pro-bi-com-us-jentadueto",
    department: "Human",
    cluster: ["BI4"],
    cost: "USD 2,890",
    percentage: "23.4%",
    cms: "Drupal",
    stage: "Active",
    stageColor: "bg-green-100 text-green-800",
  },
  {
    name: "hz-qa-bi-hubnext-com",
    department: "Animal",
    cluster: ["BI5", "BI6"],
    cost: "USD 1,950",
    percentage: "15.7%",
    cms: "Custom",
    stage: "In Review",
    stageColor: "bg-yellow-100 text-yellow-800",
  },
  {
    name: "hz-storybook-bi-hubnext-com",
    department: "Human",
    cluster: ["BI3"],
    cost: "USD 1,750",
    percentage: "14.1%",
    cms: "WordPress",
    stage: "Active",
    stageColor: "bg-green-100 text-green-800",
  },
  {
    name: "centaura-se",
    department: "Animal",
    cluster: ["BICN2"],
    cost: "USD 1,420",
    percentage: "11.5%",
    cms: "Drupal",
    stage: "Legacy",
    stageColor: "bg-gray-100 text-gray-800",
  },
  {
    name: "insights-in-ild",
    department: "Human",
    cluster: ["BI4", "BI5"],
    cost: "USD 980",
    percentage: "7.9%",
    cms: "GitBook",
    stage: "Active",
    stageColor: "bg-green-100 text-green-800",
  },
  {
    name: "agentereversor-com-ar",
    department: "Animal",
    cluster: ["BI6"],
    cost: "USD 850",
    percentage: "6.9%",
    cms: "Custom",
    stage: "In Review",
    stageColor: "bg-yellow-100 text-yellow-800",
  },
  {
    name: "frontline-si",
    department: "Human",
    cluster: ["BI3", "BI4", "BI5"],
    cost: "USD 740",
    percentage: "6.0%",
    cms: "N/A",
    stage: "Active",
    stageColor: "bg-green-100 text-green-800",
  },
  {
    name: "making-more-health",
    department: "Animal",
    cluster: ["BICN2"],
    cost: "USD 620",
    percentage: "5.0%",
    cms: "Salesforce",
    stage: "Legacy",
    stageColor: "bg-gray-100 text-gray-800",
  },
  {
    name: "guides-boehringer-ingelheim-com",
    department: "Human",
    cluster: ["BI5"],
    cost: "USD 580",
    percentage: "4.7%",
    cms: "Drupal",
    stage: "Active",
    stageColor: "bg-green-100 text-green-800",
  },
  {
    name: "bvdzero-es",
    department: "Animal",
    cluster: ["BI6", "BICN2"],
    cost: "USD 520",
    percentage: "4.2%",
    cms: "Custom",
    stage: "In Review",
    stageColor: "bg-yellow-100 text-yellow-800",
  },
  {
    name: "vetmedica-research-platform",
    department: "Animal",
    cluster: ["BI4"],
    cost: "USD 890",
    percentage: "7.2%",
    cms: "Drupal",
    stage: "Active",
    stageColor: "bg-green-100 text-green-800",
  },
  {
    name: "respiratory-solutions-hub",
    department: "Human",
    cluster: ["BI5"],
    cost: "USD 1,200",
    percentage: "9.7%",
    cms: "WordPress",
    stage: "Active",
    stageColor: "bg-green-100 text-green-800",
  },
  {
    name: "diabetes-care-portal",
    department: "Human",
    cluster: ["BI3", "BI4"],
    cost: "USD 1,560",
    percentage: "12.6%",
    cms: "Custom",
    stage: "In Review",
    stageColor: "bg-yellow-100 text-yellow-800",
  },
  {
    name: "oncology-research-net",
    department: "Human",
    cluster: ["BI6"],
    cost: "USD 2,100",
    percentage: "17.0%",
    cms: "Drupal",
    stage: "Active",
    stageColor: "bg-green-100 text-green-800",
  },
  {
    name: "animal-nutrition-guide",
    department: "Animal",
    cluster: ["BICN2"],
    cost: "USD 450",
    percentage: "3.6%",
    cms: "GitBook",
    stage: "Legacy",
    stageColor: "bg-gray-100 text-gray-800",
  },
  {
    name: "immunology-insights",
    department: "Human",
    cluster: ["BI5", "BI6"],
    cost: "USD 1,340",
    percentage: "10.8%",
    cms: "Custom",
    stage: "Active",
    stageColor: "bg-green-100 text-green-800",
  },
  {
    name: "companion-animal-wellness",
    department: "Animal",
    cluster: ["BI3"],
    cost: "USD 760",
    percentage: "6.1%",
    cms: "WordPress",
    stage: "In Review",
    stageColor: "bg-yellow-100 text-yellow-800",
  },
  {
    name: "clinical-trials-dashboard",
    department: "Human",
    cluster: ["BI4", "BI5"],
    cost: "USD 1,890",
    percentage: "15.3%",
    cms: "Custom",
    stage: "Active",
    stageColor: "bg-green-100 text-green-800",
  },
  {
    name: "veterinary-diagnostic-tools",
    department: "Animal",
    cluster: ["BI6"],
    cost: "USD 680",
    percentage: "5.5%",
    cms: "Drupal",
    stage: "Legacy",
    stageColor: "bg-gray-100 text-gray-800",
  },
  {
    name: "patient-support-program",
    department: "Human",
    cluster: ["BI3"],
    cost: "USD 920",
    percentage: "7.4%",
    cms: "Salesforce",
    stage: "Active",
    stageColor: "bg-green-100 text-green-800",
  },
  {
    name: "livestock-health-monitor",
    department: "Animal",
    cluster: ["BICN2", "BI4"],
    cost: "USD 1,120",
    percentage: "9.0%",
    cms: "Custom",
    stage: "In Review",
    stageColor: "bg-yellow-100 text-yellow-800",
  },
  {
    name: "biosimilars-knowledge-base",
    department: "Human",
    cluster: ["BI5"],
    cost: "USD 640",
    percentage: "5.2%",
    cms: "GitBook",
    stage: "Active",
    stageColor: "bg-green-100 text-green-800",
  },
  {
    name: "equine-care-solutions",
    department: "Animal",
    cluster: ["BI6"],
    cost: "USD 530",
    percentage: "4.3%",
    cms: "WordPress",
    stage: "Legacy",
    stageColor: "bg-gray-100 text-gray-800",
  },
  {
    name: "rare-disease-registry",
    department: "Human",
    cluster: ["BI3", "BI6"],
    cost: "USD 1,650",
    percentage: "13.3%",
    cms: "Drupal",
    stage: "Active",
    stageColor: "bg-green-100 text-green-800",
  },
  {
    name: "poultry-health-tracker",
    department: "Animal",
    cluster: ["BICN2"],
    cost: "USD 380",
    percentage: "3.1%",
    cms: "Custom",
    stage: "In Review",
    stageColor: "bg-yellow-100 text-yellow-800",
  },
  {
    name: "pharmaceutical-pipeline",
    department: "Human",
    cluster: ["BI4"],
    cost: "USD 2,450",
    percentage: "19.8%",
    cms: "Custom",
    stage: "Active",
    stageColor: "bg-green-100 text-green-800",
  },
  {
    name: "veterinary-education-hub",
    department: "Animal",
    cluster: ["BI5"],
    cost: "USD 710",
    percentage: "5.7%",
    cms: "WordPress",
    stage: "Legacy",
    stageColor: "bg-gray-100 text-gray-800",
  },
  {
    name: "medical-affairs-portal",
    department: "Human",
    cluster: ["BI3", "BI5"],
    cost: "USD 1,280",
    percentage: "10.3%",
    cms: "Salesforce",
    stage: "Active",
    stageColor: "bg-green-100 text-green-800",
  },
  {
    name: "swine-production-optimizer",
    department: "Animal",
    cluster: ["BI6", "BICN2"],
    cost: "USD 590",
    percentage: "4.8%",
    cms: "Drupal",
    stage: "In Review",
    stageColor: "bg-yellow-100 text-yellow-800",
  },
  {
    name: "therapeutic-area-insights",
    department: "Human",
    cluster: ["BI4"],
    cost: "USD 1,470",
    percentage: "11.9%",
    cms: "GitBook",
    stage: "Active",
    stageColor: "bg-green-100 text-green-800",
  },
  {
    name: "companion-diagnostics",
    department: "Animal",
    cluster: ["BI3"],
    cost: "USD 820",
    percentage: "6.6%",
    cms: "Custom",
    stage: "Legacy",
    stageColor: "bg-gray-100 text-gray-800",
  },
  {
    name: "regulatory-submission-tracker",
    department: "Human",
    cluster: ["BI5", "BI6"],
    cost: "USD 1,760",
    percentage: "14.2%",
    cms: "Custom",
    stage: "Active",
    stageColor: "bg-green-100 text-green-800",
  },
  {
    name: "farm-animal-welfare",
    department: "Animal",
    cluster: ["BICN2"],
    cost: "USD 440",
    percentage: "3.6%",
    cms: "WordPress",
    stage: "In Review",
    stageColor: "bg-yellow-100 text-yellow-800",
  },
  {
    name: "drug-safety-surveillance",
    department: "Human",
    cluster: ["BI3"],
    cost: "USD 1,390",
    percentage: "11.2%",
    cms: "Drupal",
    stage: "Active",
    stageColor: "bg-green-100 text-green-800",
  },
  {
    name: "aquaculture-health-solutions",
    department: "Animal",
    cluster: ["BI4"],
    cost: "USD 660",
    percentage: "5.3%",
    cms: "Custom",
    stage: "Legacy",
    stageColor: "bg-gray-100 text-gray-800",
  },
  {
    name: "personalized-medicine-platform",
    department: "Human",
    cluster: ["BI6"],
    cost: "USD 2,200",
    percentage: "17.8%",
    cms: "Custom",
    stage: "Active",
    stageColor: "bg-green-100 text-green-800",
  },
  {
    name: "veterinary-practice-management",
    department: "Animal",
    cluster: ["BI5"],
    cost: "USD 790",
    percentage: "6.4%",
    cms: "Salesforce",
    stage: "In Review",
    stageColor: "bg-yellow-100 text-yellow-800",
  },
  {
    name: "clinical-data-exchange",
    department: "Human",
    cluster: ["BI4", "BI5"],
    cost: "USD 1,630",
    percentage: "13.2%",
    cms: "Custom",
    stage: "Active",
    stageColor: "bg-green-100 text-green-800",
  },
  {
    name: "pet-health-monitoring",
    department: "Animal",
    cluster: ["BI3", "BI6"],
    cost: "USD 870",
    percentage: "7.0%",
    cms: "WordPress",
    stage: "Legacy",
    stageColor: "bg-gray-100 text-gray-800",
  },
  {
    name: "biopharmaceutical-research",
    department: "Human",
    cluster: ["BICN2"],
    cost: "USD 1,540",
    percentage: "12.4%",
    cms: "GitBook",
    stage: "Active",
    stageColor: "bg-green-100 text-green-800",
  },
  {
    name: "livestock-breeding-optimizer",
    department: "Animal",
    cluster: ["BI4"],
    cost: "USD 720",
    percentage: "5.8%",
    cms: "Drupal",
    stage: "In Review",
    stageColor: "bg-yellow-100 text-yellow-800",
  },
  {
    name: "therapeutic-protein-tracker",
    department: "Human",
    cluster: ["BI5"],
    cost: "USD 1,180",
    percentage: "9.5%",
    cms: "Custom",
    stage: "Active",
    stageColor: "bg-green-100 text-green-800",
  },
  {
    name: "animal-vaccine-registry",
    department: "Animal",
    cluster: ["BI6"],
    cost: "USD 610",
    percentage: "4.9%",
    cms: "WordPress",
    stage: "Legacy",
    stageColor: "bg-gray-100 text-gray-800",
  },
  {
    name: "precision-dosing-calculator",
    department: "Human",
    cluster: ["BI3"],
    cost: "USD 960",
    percentage: "7.8%",
    cms: "Custom",
    stage: "Active",
    stageColor: "bg-green-100 text-green-800",
  },
  {
    name: "zoo-animal-care-system",
    department: "Animal",
    cluster: ["BICN2"],
    cost: "USD 420",
    percentage: "3.4%",
    cms: "Salesforce",
    stage: "In Review",
    stageColor: "bg-yellow-100 text-yellow-800",
  },
  {
    name: "molecular-diagnostics-hub",
    department: "Human",
    cluster: ["BI4", "BI6"],
    cost: "USD 1,820",
    percentage: "14.7%",
    cms: "Drupal",
    stage: "Active",
    stageColor: "bg-green-100 text-green-800",
  },
  {
    name: "wildlife-health-tracker",
    department: "Animal",
    cluster: ["BI5"],
    cost: "USD 480",
    percentage: "3.9%",
    cms: "GitBook",
    stage: "Legacy",
    stageColor: "bg-gray-100 text-gray-800",
  },
  {
    name: "drug-interaction-checker",
    department: "Human",
    cluster: ["BI3", "BI4"],
    cost: "USD 1,100",
    percentage: "8.9%",
    cms: "Custom",
    stage: "Active",
    stageColor: "bg-green-100 text-green-800",
  },
  {
    name: "veterinary-telemedicine",
    department: "Animal",
    cluster: ["BI6"],
    cost: "USD 750",
    percentage: "6.1%",
    cms: "WordPress",
    stage: "In Review",
    stageColor: "bg-yellow-100 text-yellow-800",
  },
  {
    name: "biosecurity-monitoring",
    department: "Animal",
    cluster: ["BICN2"],
    cost: "USD 350",
    percentage: "2.8%",
    cms: "Custom",
    stage: "Legacy",
    stageColor: "bg-gray-100 text-gray-800",
  },
];

function ProjectRow({ project }: { project: any }) {
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

  return (
    <div className="flex items-center space-x-3">
      <span>{project.name}</span>
      <div className="flex space-x-2 relative">
        <div className="relative">
          <a
            href="https://animal.boehringer-ingelheim.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-600 transition-colors"
            onMouseEnter={() => setHoveredIcon("project")}
            onMouseLeave={() => setHoveredIcon(null)}
          >
            <ExternalLink className="h-4 w-4" />
          </a>
          {hoveredIcon === "project" && (
            <div className="absolute z-50 transition-all duration-150 pointer-events-none bottom-full left-1/2 transform -translate-x-1/2 mb-2">
              <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                View Project
              </div>
            </div>
          )}
        </div>
        <div className="relative">
          <a
            href="https://bitbucket.biscrum.com/wpsites/ah-vetportal"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-600 transition-colors"
            onMouseEnter={() => setHoveredIcon("repository")}
            onMouseLeave={() => setHoveredIcon(null)}
          >
            <GitBranch className="h-4 w-4" />
          </a>
          {hoveredIcon === "repository" && (
            <div className="absolute z-50 transition-all duration-150 pointer-events-none bottom-full left-1/2 transform -translate-x-1/2 mb-2">
              <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                View Repository
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [today, setToday] = useState("August 13, 2025");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [applicationFilter, setApplicationFilter] = useState<string>("all");
  const [clusterFilter, setClusterFilter] = useState<string>("all");

  const itemsPerPage = 10;

  useEffect(() => {
    setToday(
      new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    );
  }, []);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getFilteredAndSortedProjects = () => {
    // First apply filters
    let filteredProjects = mockProjects.filter((project) => {
      // Department filter
      if (
        departmentFilter !== "all" &&
        project.department.toLowerCase() !== departmentFilter
      ) {
        return false;
      }

      // Application filter
      if (applicationFilter !== "all") {
        const projectCms = project.cms.toLowerCase();
        if (applicationFilter === "na" && projectCms !== "n/a") {
          return false;
        } else if (
          applicationFilter !== "na" &&
          projectCms !== applicationFilter
        ) {
          return false;
        }
      }

      // Cluster filter
      if (clusterFilter !== "all") {
        const hasCluster = project.cluster.some(
          (cluster) => cluster.toLowerCase() === clusterFilter.toLowerCase(),
        );
        if (!hasCluster) {
          return false;
        }
      }

      return true;
    });

    // Then apply sorting
    if (!sortField) return filteredProjects;

    return [...filteredProjects].sort((a, b) => {
      let aValue: any = a[sortField as keyof typeof a];
      let bValue: any = b[sortField as keyof typeof b];

      // Handle special cases
      if (sortField === "cost") {
        aValue = parseInt(aValue.replace(/[^\d]/g, ""));
        bValue = parseInt(bValue.replace(/[^\d]/g, ""));
      } else if (sortField === "percentage") {
        aValue = parseFloat(aValue.replace("%", ""));
        bValue = parseFloat(bValue.replace("%", ""));
      } else if (sortField === "cluster") {
        aValue = Array.isArray(aValue) ? aValue.join(", ") : aValue;
        bValue = Array.isArray(bValue) ? bValue.join(", ") : bValue;
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  const filteredAndSortedProjects = getFilteredAndSortedProjects();
  const totalItems = filteredAndSortedProjects.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Get projects for current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageProjects = filteredAndSortedProjects.slice(
    startIndex,
    endIndex,
  );

  // Reset to first page when filters change
  const resetPagination = () => {
    setCurrentPage(1);
    setPageInput("1");
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setPageInput(page.toString());
    }
  };

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const page = parseInt(pageInput);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    } else {
      setPageInput(currentPage.toString());
    }
  };

  const generatePageNumbers = () => {
    const delta = 2;
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

  const SortableHeader = ({
    field,
    children,
    className = "",
  }: {
    field: string;
    children: React.ReactNode;
    className?: string;
  }) => {
    const isRightAligned = className.includes("text-right");

    return (
      <TableHead
        className={`font-semibold text-gray-900 cursor-pointer hover:bg-gray-50 ${className}`}
        onClick={() => handleSort(field)}
      >
        <div
          className={`flex items-center space-x-2 ${isRightAligned ? "justify-end" : ""}`}
        >
          <span>{children}</span>
          <div className="flex flex-col">
            <ChevronUp
              className={`h-3 w-3 ${sortField === field && sortDirection === "asc" ? "text-gray-900" : "text-gray-400"}`}
            />
            <ChevronDown
              className={`h-3 w-3 -mt-1 ${sortField === field && sortDirection === "desc" ? "text-gray-900" : "text-gray-400"}`}
            />
          </div>
        </div>
      </TableHead>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b bg-[#08312a] backdrop-blur h-20 flex flex-col justify-center items-center">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-3">
                <img
                  src="/assets/primary-logo-accent.svg"
                  alt="BI Dashboard Logo"
                  className="h-auto w-[140px]"
                />
                <h1
                  className="text-sm font-extralight text-[#08312a]"
                  style={{ fontFamily: "var(--font-headline)" }}
                >
                  Dashboard
                </h1>
              </Link>
              <nav className="hidden md:flex items-center space-x-8 ml-8">
                <Link
                  href="/cluster-info"
                  className="text-sm font-medium text-white hover:text-[#00e47c] active:text-[#00e47c] transition-colors"
                >
                  Cluster Info
                </Link>
                <Link
                  href="/projects"
                  className="text-sm font-medium text-[#00e47c] hover:text-[#00e47c] active:text-[#00e47c] transition-colors"
                >
                  Projects
                </Link>
                <a
                  href="#"
                  className="text-sm font-medium text-white hover:text-[#00e47c] active:text-[#00e47c] transition-colors"
                >
                  Billing
                </a>
              </nav>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-green-100 border border-green-200 px-3 py-1.5 rounded-md">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-[#08312a]">
                  All Systems Operational
                </span>
              </div>
              <a
                href="https://boehringeringelheim.statuspage.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-white hover:text-[#00e47c] transition-colors"
              >
                System status
              </a>
            </div>

            <div className="flex items-center space-x-6">
              {/* Notification Bell */}
              <div className="relative">
                <button className="relative p-2 text-white hover:text-[#00e47c] transition-colors">
                  <Bell className="h-5 w-5" />
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></div>
                </button>
              </div>

              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-[#00E47C] text-white text-sm font-medium">
                    <span style={{ color: "rgb(8, 49, 42)" }}>AH</span>
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white">
                    Alexandra
                  </span>
                  <span className="text-xs text-gray-300">admin</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 lg:px-8 py-8">
        {/* Projects Cost Breakdown */}
        <section>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="flex flex-col lg:flex-row lg:items-baseline lg:gap-3 mb-4 lg:mb-0">
              <h1
                className="font-medium text-[#08312a]"
                style={{
                  fontFamily: "var(--font-headline)",
                  fontSize: "32px",
                  lineHeight: "40px",
                }}
              >
                Projects
              </h1>
              <span className="text-sm text-gray-500 mt-1 lg:mt-0">
                Data as of : July 2025 upload
              </span>
            </div>
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search projects..."
                  className="pl-10 w-full sm:w-64 rounded-none shadow-none overflow-hidden"
                />
              </div>

              {/* Department Filter */}
              <Select
                value={departmentFilter}
                onValueChange={(value) => {
                  setDepartmentFilter(value);
                  resetPagination();
                }}
              >
                <SelectTrigger className="w-full sm:w-40 bg-[#00e47c] text-[#08312a] border-[#00e47c] hover:bg-[#6CEEB2] focus:bg-[#00e47c] rounded-none shadow-none [&_svg]:text-[#08312a]">
                  <Filter className="h-4 w-4 mr-2 text-[#08312a]" />
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="human">Human</SelectItem>
                  <SelectItem value="animal">Animal</SelectItem>
                </SelectContent>
              </Select>

              {/* Application Type Filter */}
              <Select
                value={applicationFilter}
                onValueChange={(value) => {
                  setApplicationFilter(value);
                  resetPagination();
                }}
              >
                <SelectTrigger className="w-full sm:w-44 bg-[#00e47c] text-[#08312a] border-[#00e47c] hover:bg-[#6CEEB2] focus:bg-[#00e47c] rounded-none shadow-none [&_svg]:text-[#08312a]">
                  <Filter className="h-4 w-4 mr-2 text-[#08312a]" />
                  <SelectValue placeholder="Application Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="drupal">Drupal</SelectItem>
                  <SelectItem value="wordpress">WordPress</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                  <SelectItem value="gitbook">GitBook</SelectItem>
                  <SelectItem value="salesforce">Salesforce</SelectItem>
                  <SelectItem value="na">N/A</SelectItem>
                </SelectContent>
              </Select>

              {/* Cluster Filter */}
              <Select
                value={clusterFilter}
                onValueChange={(value) => {
                  setClusterFilter(value);
                  resetPagination();
                }}
              >
                <SelectTrigger className="w-full sm:w-36 bg-[#00e47c] text-[#08312a] border-[#00e47c] hover:bg-[#6CEEB2] focus:bg-[#00e47c] rounded-none shadow-none [&_svg]:text-[#08312a]">
                  <Filter className="h-4 w-4 mr-2 text-[#08312a]" />
                  <SelectValue placeholder="Cluster" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clusters</SelectItem>
                  <SelectItem value="bi3">BI3</SelectItem>
                  <SelectItem value="bi4">BI4</SelectItem>
                  <SelectItem value="bi5">BI5</SelectItem>
                  <SelectItem value="bi6">BI6</SelectItem>
                  <SelectItem value="bicn2">BICN2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card className="border-gray-200">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table className="table-fixed w-full">
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <SortableHeader field="name" className="w-[30%]">
                        Project Name
                      </SortableHeader>
                      <SortableHeader field="department" className="w-[15%]">
                        Department
                      </SortableHeader>
                      <SortableHeader field="cluster" className="w-[15%]">
                        Cluster
                      </SortableHeader>
                      <SortableHeader
                        field="cost"
                        className="text-right w-[15%]"
                      >
                        Cost (USD)
                      </SortableHeader>
                      <SortableHeader
                        field="percentage"
                        className="text-right w-[10%]"
                      >
                        % of Total
                      </SortableHeader>
                      <SortableHeader field="cms" className="w-[15%]">
                        Application
                      </SortableHeader>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentPageProjects.map((project, index) => (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell className="font-medium text-gray-900 w-[30%] relative">
                          <div className="overflow-visible">
                            <ProjectRow project={project} />
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600 w-[15%]">
                          <div className="whitespace-nowrap">
                            {project.department}
                          </div>
                        </TableCell>
                        <TableCell className="w-[15%]">
                          <div className="flex flex-wrap gap-1">
                            {project.cluster.map(
                              (clusterName, clusterIndex) => {
                                // Define subtle colors for different clusters
                                const clusterColors: Record<string, string> = {
                                  BI3: "bg-slate-50 text-slate-600 border-slate-200",
                                  BI4: "bg-blue-50 text-blue-600 border-blue-200",
                                  BI5: "bg-emerald-50 text-emerald-600 border-emerald-200",
                                  BI6: "bg-purple-50 text-purple-600 border-purple-200",
                                  BICN2:
                                    "bg-amber-50 text-amber-600 border-amber-200",
                                };
                                const colorClass =
                                  clusterColors[clusterName] ||
                                  "bg-gray-50 text-gray-600 border-gray-200";

                                return (
                                  <Badge
                                    key={clusterIndex}
                                    variant="outline"
                                    className={`font-normal whitespace-nowrap border-0 ${colorClass}`}
                                  >
                                    {clusterName}
                                  </Badge>
                                );
                              },
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium w-[15%]">
                          <div className="whitespace-nowrap">
                            {project.cost}
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-gray-600 w-[10%]">
                          <div className="whitespace-nowrap">
                            {project.percentage}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600 w-[15%]">
                          <div className="whitespace-nowrap">{project.cms}</div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Pagination */}
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-2 lg:space-y-0 mt-4">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{" "}
              {totalItems} results
            </div>
            <div className="flex items-center space-x-2">
              <Pagination>
                <PaginationContent className="gap-0">
                  <PaginationItem>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="border-r-0 rounded-r-none"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </PaginationItem>

                  {generatePageNumbers().map((pageNumber, index) => (
                    <PaginationItem key={index}>
                      {pageNumber === "..." ? (
                        <PaginationEllipsis />
                      ) : (
                        <Button
                          variant={
                            pageNumber === currentPage ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => handlePageChange(pageNumber as number)}
                          className={cn(
                            "border-r-0 rounded-none",
                            pageNumber === currentPage &&
                              "bg-[#08312a] text-white border-[#08312a]",
                          )}
                        >
                          {pageNumber}
                        </Button>
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="border-l-0 rounded-l-none"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>

              <form
                onSubmit={handlePageInputSubmit}
                className="flex items-center space-x-1 ml-4"
              >
                <span className="text-sm text-gray-700">Page</span>
                <Input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                  className="w-16 h-8 text-center text-sm rounded-none"
                />
                <span className="text-sm text-gray-700">of {totalPages}</span>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
