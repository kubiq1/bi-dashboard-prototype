"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Search,
  Filter,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
  GitBranch,
  Database,
  HardDrive,
  Server,
} from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { Project } from "@/lib/types";
import { getClusterColor } from "@/lib/shared-utils";
import { mockProjects } from "@/lib/data";

// Dynamic import for better performance
const SparklineChart = dynamic(() => import("@/components/charts/SparklineChart"), {
  loading: () => <div className="h-16 bg-gray-100 animate-pulse rounded"></div>,
  ssr: true,
});

// Month options for the selector
const monthOptions = [
  { value: "2025-08", label: "August 2025" },
  { value: "2025-07", label: "July 2025" },
  { value: "2025-06", label: "June 2025" },
  { value: "2025-05", label: "May 2025" },
  { value: "2025-04", label: "April 2025" },
  { value: "2025-03", label: "March 2025" },
  { value: "2025-02", label: "February 2025" },
  { value: "2025-01", label: "January 2025" },
  { value: "2024-12", label: "December 2024" },
  { value: "2024-11", label: "November 2024" },
  { value: "2024-10", label: "October 2024" },
  { value: "2024-09", label: "September 2024" },
];

// Mock billing data - this would come from API in real implementation
// Using deterministic data to avoid hydration mismatches
const generateDeterministicData = (projectIndex: number, monthMultiplier: number) => {
  // Create predictable values based on project index and month
  const baseHits = 50000 + (projectIndex * 23456);
  const baseDb = 2.5 + (projectIndex * 0.73);
  const baseFiles = 5.2 + (projectIndex * 1.21);
  const baseSolr = 1.1 + (projectIndex * 0.32);
  const basePods = 2 + (projectIndex % 6);
  const baseUsage = 3.2 + (projectIndex * 1.87);

  return {
    hits: Math.floor(baseHits * monthMultiplier),
    storage: {
      db: baseDb * monthMultiplier,
      files: baseFiles * monthMultiplier,
      solr: baseSolr * monthMultiplier,
    },
    pods: basePods,
    usagePercent: baseUsage * monthMultiplier,
  };
};

const mockBillingData = {
  "2025-08": {
    totalCost: "USD 12,390",
    changeVsLastMonth: "+6.4%",
    changeAmount: "USD 740 increase",
    projects: mockProjects.map((project, index) => {
      const data = generateDeterministicData(index, 1.1);
      const totalStorage = data.storage.db + data.storage.files + data.storage.solr;
      const estimatedCost = Math.floor(data.usagePercent * 12390 / 100);

      return {
        ...project,
        hits: data.hits,
        storage: {
          db: data.storage.db,
          files: data.storage.files,
          solr: data.storage.solr,
          total: totalStorage
        },
        pods: data.pods,
        usagePercent: data.usagePercent,
        estimatedCost: `USD ${estimatedCost.toLocaleString()}`
      };
    })
  },
  "2025-07": {
    totalCost: "USD 11,650",
    changeVsLastMonth: "+2.1%",
    changeAmount: "USD 240 increase",
    projects: mockProjects.map((project, index) => {
      const data = generateDeterministicData(index, 0.95);
      const totalStorage = data.storage.db + data.storage.files + data.storage.solr;
      const estimatedCost = Math.floor(data.usagePercent * 11650 / 100);

      return {
        ...project,
        hits: data.hits,
        storage: {
          db: data.storage.db,
          files: data.storage.files,
          solr: data.storage.solr,
          total: totalStorage
        },
        pods: data.pods,
        usagePercent: data.usagePercent,
        estimatedCost: `USD ${estimatedCost.toLocaleString()}`
      };
    })
  }
};

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

export default function BillingPage() {
  const searchParams = useSearchParams();
  const [selectedMonth, setSelectedMonth] = useState("2025-08");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [focusedRowRef, setFocusedRowRef] = useState<HTMLTableRowElement | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const currentData = mockBillingData[selectedMonth as keyof typeof mockBillingData] || mockBillingData["2025-08"];
  const currentMonthLabel = monthOptions.find(option => option.value === selectedMonth)?.label || "August 2025";

  useEffect(() => {
    // Check for project and month parameters in URL
    const projectParam = searchParams.get('project');
    const monthParam = searchParams.get('month');
    
    if (monthParam) {
      // Try to find matching month option
      const matchingMonth = monthOptions.find(option => 
        option.label.toLowerCase().includes(monthParam.toLowerCase())
      );
      if (matchingMonth) {
        setSelectedMonth(matchingMonth.value);
      }
    }

    if (projectParam) {
      const project = currentData.projects.find(p => p.name === projectParam);
      if (project) {
        setSelectedProject(project);
        setIsProjectModalOpen(true);
      }
    }
  }, [searchParams, currentData.projects]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortedProjects = () => {
    if (!sortField) return currentData.projects;

    return [...currentData.projects].sort((a, b) => {
      let aValue: any = a[sortField as keyof typeof a];
      let bValue: any = b[sortField as keyof typeof b];

      // Handle special cases
      if (sortField === "hits") {
        aValue = a.hits;
        bValue = b.hits;
      } else if (sortField === "storage") {
        aValue = a.storage.total;
        bValue = b.storage.total;
      } else if (sortField === "usagePercent") {
        aValue = a.usagePercent;
        bValue = b.usagePercent;
      } else if (sortField === "estimatedCost") {
        aValue = parseInt(a.estimatedCost.replace(/[^\d]/g, ""));
        bValue = parseInt(b.estimatedCost.replace(/[^\d]/g, ""));
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

  const sortedProjects = getSortedProjects();
  const totalItems = sortedProjects.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Get projects for current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageProjects = sortedProjects.slice(startIndex, endIndex);

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

  const handleProjectClick = (project: any, rowElement: HTMLTableRowElement) => {
    setFocusedRowRef(rowElement);
    setSelectedProject(project);
    setIsProjectModalOpen(true);
  };

  const navigateToProject = (direction: 'prev' | 'next') => {
    if (!selectedProject) return;

    const currentIndex = sortedProjects.findIndex(p => p.name === selectedProject.name);
    let newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex >= 0 && newIndex < sortedProjects.length) {
      setSelectedProject(sortedProjects[newIndex]);
    }
  };

  const getCurrentProjectIndex = () => {
    if (!selectedProject) return 0;
    return sortedProjects.findIndex(p => p.name === selectedProject.name) + 1;
  };

  const canNavigatePrev = () => {
    if (!selectedProject) return false;
    const currentIndex = sortedProjects.findIndex(p => p.name === selectedProject.name);
    return currentIndex > 0;
  };

  const canNavigateNext = () => {
    if (!selectedProject) return false;
    const currentIndex = sortedProjects.findIndex(p => p.name === selectedProject.name);
    return currentIndex < sortedProjects.length - 1;
  };

  const handleCloseProjectModal = () => {
    setIsProjectModalOpen(false);
    setSelectedProject(null);
    // Return focus to the originating row
    if (focusedRowRef) {
      focusedRowRef.focus();
      setFocusedRowRef(null);
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
                <Link
                  href="/billing"
                  className="text-sm font-medium text-[#00e47c] hover:text-[#00e47c] active:text-[#00e47c] transition-colors"
                >
                  Billing
                </Link>
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
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zm-5-15C7.04 2 5 4.04 5 6.5S7.04 11 9.5 11 14 8.96 14 6.5 11.96 2 9.5 2z" />
                  </svg>
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
        {/* Header with Month Selector */}
        <section className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
            <h1
              className="font-medium text-[#08312a]"
              style={{
                fontFamily: "var(--font-headline)",
                fontSize: "32px",
                lineHeight: "40px",
              }}
            >
              Billing
            </h1>
            <div className="flex flex-col lg:flex-row lg:items-center gap-3">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-full sm:w-40 bg-[#00e47c] text-[#08312a] border-[#00e47c] hover:bg-[#6CEEB2] focus:bg-[#00e47c] rounded-none shadow-none [&_svg]:text-[#08312a]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {monthOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="text-xs text-gray-500 lg:text-right">
                Data as of {currentMonthLabel} — metrics updated on the 10th & 25th; total cost entered on the 10th.
              </div>
            </div>
          </div>
        </section>

        {/* KPI Row (3 cards) */}
        <section className="mb-12">
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
                  {currentData.totalCost}
                </div>
                <p className="text-xs text-gray-500 mt-1">As of {currentMonthLabel}</p>
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
                    {currentData.changeVsLastMonth}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{currentData.changeAmount}</p>
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

        {/* Billing Table */}
        <section>
          <Card className="border-gray-200">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table className="table-fixed w-full">
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <SortableHeader field="name" className="w-[25%]">
                        Project
                      </SortableHeader>
                      <SortableHeader field="hits" className="text-right w-[12%]">
                        Hits
                      </SortableHeader>
                      <SortableHeader field="storage" className="w-[12%] text-right">
                        Storage (GB)
                      </SortableHeader>
                      <SortableHeader field="usagePercent" className="text-right w-[12%]">
                        Usage %
                      </SortableHeader>
                      <SortableHeader field="estimatedCost" className="text-right w-[16%]">
                        Estimated Cost
                      </SortableHeader>
                      <SortableHeader field="cluster" className="w-[15%]">
                        Cluster
                      </SortableHeader>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentPageProjects.map((project, index) => (
                      <TableRow
                        key={index}
                        className="hover:bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#00e47c] focus:ring-inset"
                        tabIndex={0}
                        onClick={(e) => handleProjectClick(project, e.currentTarget)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleProjectClick(project, e.currentTarget);
                          }
                        }}
                      >
                        <TableCell className="font-medium text-gray-900 w-[25%] relative">
                          <div className="overflow-visible">
                            <ProjectRow project={project} />
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium w-[12%]">
                          <div className="whitespace-nowrap">
                            {project.hits.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell className="w-[12%] relative">
                          <div
                            className="text-right font-medium whitespace-nowrap cursor-help"
                            title={`DB: ${project.storage.db.toFixed(2)} GB · Files: ${project.storage.files.toFixed(2)} GB · Solr: ${project.storage.solr.toFixed(2)} GB`}
                          >
                            {project.storage.total.toFixed(2)}
                          </div>
                        </TableCell>
                        <TableCell className="text-center w-[8%]">
                          <div className="whitespace-nowrap">
                            {project.pods}
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-gray-600 w-[12%]">
                          <div className="whitespace-nowrap">
                            {project.usagePercent.toFixed(1)}%
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium w-[16%]">
                          <div className="whitespace-nowrap">
                            {project.estimatedCost}
                          </div>
                        </TableCell>
                        <TableCell className="w-[15%]">
                          <div className="flex flex-wrap gap-1">
                            {project.cluster.map(
                              (clusterName, clusterIndex) => (
                                <Badge
                                  key={clusterIndex}
                                  variant="outline"
                                  className={`font-normal whitespace-nowrap border-0 ${getClusterColor(clusterName)}`}
                                >
                                  {clusterName}
                                </Badge>
                              )
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Audit Help */}
          <div className="mt-3 mb-6">
            <p className="text-xs text-gray-500">
              Usage % = (Hits% + Storage% [± Pods%]) / N; Estimated Cost = Usage % × Month total cost.
            </p>
          </div>

          {/* Footer with Pagination */}
          <div className="flex flex-col lg:flex-row items-center justify-between mt-6 gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <p className="text-sm text-gray-600">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                {totalItems} projects
              </p>
              <Select 
                value={itemsPerPage.toString()} 
                onValueChange={(value) => {
                  setItemsPerPage(parseInt(value));
                  setCurrentPage(1);
                  setPageInput("1");
                }}
              >
                <SelectTrigger className="w-32 h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                  <SelectItem value="100">100 per page</SelectItem>
                </SelectContent>
              </Select>
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

          {/* Footer Caption */}
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              Data as of {currentMonthLabel}
            </p>
          </div>
        </section>

        {/* Project Modal */}
        <ProjectModal
          project={selectedProject}
          isOpen={isProjectModalOpen}
          onClose={handleCloseProjectModal}
          currentIndex={getCurrentProjectIndex()}
          totalResults={totalItems}
          onNavigate={navigateToProject}
          canNavigatePrev={canNavigatePrev()}
          canNavigateNext={canNavigateNext()}
        />
      </main>
    </div>
  );
}

function ProjectModal({
  project,
  isOpen,
  onClose,
  currentIndex,
  totalResults,
  onNavigate,
  canNavigatePrev,
  canNavigateNext
}: {
  project: any | null;
  isOpen: boolean;
  onClose: () => void;
  currentIndex: number;
  totalResults: number;
  onNavigate: (direction: 'prev' | 'next') => void;
  canNavigatePrev: boolean;
  canNavigateNext: boolean;
}) {
  // ESC key handling
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Arrow key navigation
  useEffect(() => {
    const handleArrowKeys = (event: KeyboardEvent) => {
      if (!isOpen) return;

      // Ignore if event target is an input element
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.contentEditable === 'true'
      ) {
        return;
      }

      if (event.key === 'ArrowLeft' && canNavigatePrev) {
        event.preventDefault(); // Prevent background page scroll
        onNavigate('prev');
      } else if (event.key === 'ArrowRight' && canNavigateNext) {
        event.preventDefault(); // Prevent background page scroll
        onNavigate('next');
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleArrowKeys);
    }

    return () => {
      document.removeEventListener('keydown', handleArrowKeys);
    };
  }, [isOpen, canNavigatePrev, canNavigateNext, onNavigate]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !project) return null;

  const monthLabel = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" });

  const getStageColor = (stage: string, stageColor: string) => {
    return stageColor;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-out"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 ease-out scale-100 opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex flex-col">
                <h2 className="text-3xl font-medium text-[#08312a]" style={{ fontFamily: "var(--font-headline)" }}>
                  {project.name}
                </h2>
                <div className="flex items-center space-x-3 mt-2">
                  {/* Quick Links */}
                  <div className="flex items-center space-x-2">
                    {project.repositoryUrl && (
                      <a
                        href={project.repositoryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-sm text-gray-600 hover:text-[#08312a] transition-colors"
                      >
                        <GitBranch className="h-4 w-4" />
                        <span>Repo</span>
                      </a>
                    )}
                    {project.lagoonUrl && (
                      <a
                        href={project.lagoonUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-sm text-gray-600 hover:text-[#08312a] transition-colors"
                      >
                        <Server className="h-4 w-4" />
                        <span>Lagoon</span>
                      </a>
                    )}
                    {project.projectUrl && (
                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-sm text-gray-600 hover:text-[#08312a] transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Prod</span>
                      </a>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="flex items-center space-x-2">
                    <Badge className={getStageColor(project.stage, project.stageColor)}>
                      {project.stage}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-10 w-10 p-0 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-8rem)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Overview */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-[#08312a] mb-4" style={{ fontFamily: "var(--font-headline)" }}>
                  Overview
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-700">Department</span>
                    <span className="text-sm text-gray-900">{project.department}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-700">Application Type</span>
                    <span className="text-sm text-gray-900">{project.cms}</span>
                  </div>
                  {project.owningAgency && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-700">Owning Agency</span>
                      <span className="text-sm text-gray-900">{project.owningAgency}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-700">Clusters</span>
                    <div className="flex flex-wrap gap-1">
                      {project.cluster.map((clusterName, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className={`font-normal whitespace-nowrap border-0 ${getClusterColor(clusterName)}`}
                        >
                          {clusterName}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Monthly Cost */}
              <div>
                <h3 className="text-lg font-medium text-[#08312a] mb-4" style={{ fontFamily: "var(--font-headline)" }}>
                  Monthly Cost — {monthLabel}
                </h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-700">Estimated Cost (month)</span>
                      <span className="text-xs text-gray-500">Estimated proportioned cost.</span>
                    </div>
                    <span className="text-2xl font-bold text-[#08312a]">{project.estimatedCost || project.cost}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Month Total Cost</span>
                    <span>{project.monthTotalCost || "USD 12,390"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Usage & Storage */}
            <div className="space-y-6">
              {/* Usage */}
              <div>
                <h3 className="text-lg font-medium text-[#08312a] mb-4" style={{ fontFamily: "var(--font-headline)" }}>
                  Usage
                </h3>
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Hits</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {project.hits ? project.hits.toLocaleString() : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Usage %</span>
                    <span>{project.usagePercent ? project.usagePercent.toFixed(1) + '%' : '—'}</span>
                  </div>
                </div>
              </div>

              {/* Storage */}
              <div>
                <h3 className="text-lg font-medium text-[#08312a] mb-4" style={{ fontFamily: "var(--font-headline)" }}>
                  Storage (GB)
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 px-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Database className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">Database</span>
                    </div>
                    <span className="text-sm font-bold text-blue-600">
                      {project.storage?.db ? project.storage.db.toFixed(2) : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <HardDrive className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium text-gray-700">Files</span>
                    </div>
                    <span className="text-sm font-bold text-purple-600">
                      {project.storage?.files ? project.storage.files.toFixed(2) : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Search className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">Solr</span>
                    </div>
                    <span className="text-sm font-bold text-green-600">
                      {project.storage?.solr ? project.storage.solr.toFixed(2) : '—'}
                    </span>
                  </div>
                  <div className="bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg border-2 border-gray-200 p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-gray-700">Total</span>
                      <span className="text-lg font-bold text-[#08312a]">
                        {project.storage?.total ? project.storage.total.toFixed(2) : '—'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Data as of {monthLabel}
              </p>
              <div className="flex items-center space-x-4">
                {/* Navigation Controls */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onNavigate('prev')}
                    disabled={!canNavigatePrev}
                    className="h-8 w-8 p-0 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Previous (←)"
                    aria-label="Previous project"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-gray-500 px-2">
                    {currentIndex} of {totalResults}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onNavigate('next')}
                    disabled={!canNavigateNext}
                    className="h-8 w-8 p-0 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Next (→)"
                    aria-label="Next project"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <Link
                  href={`/billing?project=${encodeURIComponent(project.name)}&month=${encodeURIComponent(monthLabel)}`}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium bg-[#00e47c] text-[#08312a] border border-[#00e47c] hover:bg-[#6CEEB2] hover:text-[#08312a] rounded-none shadow-none transition-colors"
                >
                  View full billing details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
