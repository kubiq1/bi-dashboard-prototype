"use client";

import {
  Search,
  Filter,
  TrendingUp,
  Server,
  Cpu,
  HardDrive,
  Activity,
  Bell,
  ExternalLink,
  GitBranch,
  MemoryStick,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";

// Dynamic import for better performance
const SparklineChart = dynamic(() => import("@/components/charts/SparklineChart"), {
  loading: () => <div className="h-16 bg-gray-100 animate-pulse rounded"></div>,
  ssr: true,
});

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

export default function Dashboard() {
  const [today, setToday] = useState("August 13, 2025");
  const [hasNotifications, setHasNotifications] = useState(true);
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
                  className="text-sm font-medium text-white hover:text-[#00e47c] active:text-[#00e47c] transition-colors"
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
                  {hasNotifications && (
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></div>
                  )}
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
        {/* Monthly Billing Overview */}
        <section className="mb-12">
          <h2
            className="text-2xl font-medium text-[#08312a] mb-6"
            style={{ fontFamily: "var(--font-headline)" }}
          >
            Monthly Billing Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Cost This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="font-bold text-gray-900"
                  style={{ fontSize: "30px" }}
                >
                  USD 12,390
                </div>
                <p className="text-xs text-gray-500 mt-1">As of {today}</p>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Change vs Last Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span
                    className="text-3xl font-bold"
                    style={{ color: "rgba(0, 228, 124, 1)" }}
                  >
                    +6.4%
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">USD 740 increase</p>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Monthly Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SparklineChart />
                <p className="text-xs text-gray-500 mt-2">12-month overview</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Production Cluster */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-2xl font-medium text-[#08312a]"
              style={{ fontFamily: "var(--font-headline)" }}
            >
              Cluster
            </h2>
            <Button
              variant="outline"
              size="sm"
              className="bg-[#00e47c] text-[#08312a] border-[#00e47c] hover:bg-[#6CEEB2] hover:text-[#08312a] rounded-none shadow-none [&_svg]:text-[#08312a]"
            >
              Show all Clusters
            </Button>
          </div>
          <div className="overflow-x-auto">
            <div className="flex space-x-4 pb-4 min-w-max lg:grid lg:grid-cols-3 lg:gap-6 lg:space-x-0">
              {/* BI4 Cluster */}
              <Card className="group min-w-[280px] lg:min-w-0 border-gray-200 hover:shadow-lg transition-all duration-200 hover:border-gray-300 overflow-hidden">
                <CardHeader className="pb-3 mb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-medium text-[#08312a]">
                      BI4
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-green-600">
                        Operational
                      </span>
                      <div className="flex h-3 w-3 rounded-full bg-green-500 shadow-sm">
                        <div className="h-3 w-3 rounded-full bg-green-500 animate-ping"></div>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-sm text-gray-600">
                    Production Cluster
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Pod Density</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      78%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Server className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Node Count</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      12
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MemoryStick className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">RAM Usage</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      256 GB
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Cpu className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">CPU Usage</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      15.39%
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-50 transition-all duration-200 group-hover:h-2"></div>
                </CardContent>
              </Card>

              {/* BI5 Cluster */}
              <Card className="group min-w-[280px] lg:min-w-0 border-gray-200 hover:shadow-lg transition-all duration-200 hover:border-gray-300 overflow-hidden">
                <CardHeader className="pb-3 mb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-medium text-[#08312a]">
                      BI5
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-blue-600">
                        Under Maintenance
                      </span>
                      <div className="flex h-3 w-3 rounded-full bg-blue-500 shadow-sm">
                        <div className="h-3 w-3 rounded-full bg-blue-500 animate-ping"></div>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-sm text-gray-600">
                    Production Cluster
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Pod Density</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      65%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Server className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Node Count</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">8</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MemoryStick className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">RAM Usage</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      189 GB
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Cpu className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">CPU Usage</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      82.4%
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-50 transition-all duration-200 group-hover:h-2"></div>
                </CardContent>
              </Card>

              {/* BI6 Cluster */}
              <Card className="group min-w-[280px] lg:min-w-0 border-gray-200 hover:shadow-lg transition-all duration-200 hover:border-gray-300 overflow-hidden">
                <CardHeader className="pb-3 mb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-medium text-[#08312a]">
                      BI6
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-red-600">
                        Error
                      </span>
                      <div className="flex h-3 w-3 rounded-full bg-red-500 shadow-sm">
                        <div className="h-3 w-3 rounded-full bg-red-500 animate-ping"></div>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-sm text-gray-600">
                    Production Cluster
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Pod Density</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      92%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Server className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Node Count</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">4</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MemoryStick className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">RAM Usage</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      234 GB
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Cpu className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">CPU Usage</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      94.0%
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-50 transition-all duration-200 group-hover:h-2"></div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Projects Cost Breakdown */}
        <section>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="flex flex-col lg:flex-row lg:items-baseline lg:gap-3 mb-4 lg:mb-0">
              <h2
                className="font-medium text-[#08312a]"
                style={{
                  fontFamily: "var(--font-headline)",
                  fontSize: "26px",
                  lineHeight: "32px",
                }}
              >
                Projects
              </h2>
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

          <div className="flex flex-col lg:flex-row items-center justify-between mt-6 gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                className="bg-[#00e47c] text-[#08312a] border-[#00e47c] hover:bg-[#6CEEB2] hover:text-[#08312a] rounded-none shadow-none"
              >
                Show all projects
              </Button>
              <p className="text-sm text-gray-600">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                {totalItems} projects
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Page input field */}
              <form
                onSubmit={handlePageInputSubmit}
                className="flex items-center gap-2"
              >
                <span className="text-sm text-gray-600">Go to page:</span>
                <Input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                  className="w-20 h-8 text-center rounded-none shadow-none"
                />
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  className="bg-[#00e47c] text-[#08312a] border-[#00e47c] hover:bg-[#6CEEB2] hover:text-[#08312a] rounded-none shadow-none"
                >
                  Go
                </Button>
              </form>

              {/* Shadcn Pagination */}
              <Pagination className="w-auto">
                <PaginationContent>
                  <PaginationItem>
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={cn(
                        "flex items-center gap-1 pl-2.5 h-9 px-3 rounded-none shadow-none border text-sm font-medium transition-colors",
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 cursor-pointer",
                      )}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span>Previous</span>
                    </button>
                  </PaginationItem>

                  {generatePageNumbers().map((pageNumber, index) => (
                    <PaginationItem key={index}>
                      {pageNumber === "..." ? (
                        <PaginationEllipsis />
                      ) : (
                        <button
                          onClick={() => handlePageChange(pageNumber as number)}
                          className={cn(
                            "h-9 w-9 rounded-none shadow-none border text-sm font-medium transition-colors cursor-pointer",
                            pageNumber === currentPage
                              ? "bg-[#00e47c] text-[#08312a] border-[#00e47c]"
                              : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50",
                          )}
                        >
                          {pageNumber}
                        </button>
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={cn(
                        "flex items-center gap-1 pr-2.5 h-9 px-3 rounded-none shadow-none border text-sm font-medium transition-colors",
                        currentPage === totalPages
                          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 cursor-pointer",
                      )}
                    >
                      <span>Next</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
