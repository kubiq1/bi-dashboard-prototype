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
  X,
  Database,
  Globe,
  Link as LinkIcon,
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
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Project } from "@/lib/types";
import { getClusterColor } from "@/lib/shared-utils";
import { mockProjects } from "@/lib/data";

// Mock cluster data - matching cluster info page
const mockClusters = [
  {
    id: "BI3",
    name: "BI3",
    type: "Production",
    status: "Operational",
    podDensity: 68.5,
    nodeCount: 15,
    ramUsage: 298.7,
    cpuUsage: 45.8,
    databaseSize: 2847.3,
    storageSize: 15789.2,
    hitsRequests: "2.8M",
    description: "Primary Production Cluster"
  },
  {
    id: "BI4",
    name: "BI4",
    type: "Production",
    status: "Operational",
    podDensity: 78.2,
    nodeCount: 12,
    ramUsage: 256.4,
    cpuUsage: 15.4,
    databaseSize: 3241.7,
    storageSize: 18923.6,
    hitsRequests: "3.2M",
    description: "Production Cluster"
  },
  {
    id: "BI5",
    name: "BI5",
    type: "Production",
    status: "Under Maintenance",
    podDensity: 65.1,
    nodeCount: 8,
    ramUsage: 189.3,
    cpuUsage: 82.4,
    databaseSize: 1892.8,
    storageSize: 12456.1,
    hitsRequests: "1.9M",
    description: "Production Cluster"
  },
  {
    id: "BI6",
    name: "BI6",
    type: "Production",
    status: "Error",
    podDensity: 92.3,
    nodeCount: 4,
    ramUsage: 234.9,
    cpuUsage: 94.0,
    databaseSize: 4123.5,
    storageSize: 8734.2,
    hitsRequests: "4.1M",
    description: "Production Cluster"
  },
  {
    id: "BICN2",
    name: "BICN2",
    type: "Development",
    status: "Operational",
    podDensity: 42.7,
    nodeCount: 6,
    ramUsage: 124.8,
    cpuUsage: 28.6,
    databaseSize: 892.4,
    storageSize: 5678.9,
    hitsRequests: "0.8M",
    description: "Development Cluster"
  }
];

// Dynamic import for better performance
const SparklineChart = dynamic(() => import("@/components/charts/SparklineChart"), {
  loading: () => <div className="h-16 bg-gray-100 animate-pulse rounded"></div>,
  ssr: true,
});

// Using shared normalized dataset from lib/data.ts

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
  const router = useRouter();
  const [today, setToday] = useState("August 13, 2025");
  const [hasNotifications, setHasNotifications] = useState(true);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [applicationFilter, setApplicationFilter] = useState<string>("all");
  const [clusterFilter, setClusterFilter] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [focusedRowRef, setFocusedRowRef] = useState<HTMLTableRowElement | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<any>(null);
  const [isClusterModalOpen, setIsClusterModalOpen] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    setToday(
      new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      }),
    );

    // Aggressively preload all routes for instant navigation
    const routes = ['/cluster-info', '/projects', '/billing'];
    routes.forEach(route => {
      router.prefetch(route);
    });
  }, [router]);

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

  const handleProjectClick = (project: Project, rowElement: HTMLTableRowElement) => {
    setFocusedRowRef(rowElement);
    setSelectedProject(project);
    setIsProjectModalOpen(true);
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

  const navigateToProject = (direction: 'prev' | 'next') => {
    if (!selectedProject) return;

    const currentIndex = filteredAndSortedProjects.findIndex(p => p.name === selectedProject.name);
    let newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex >= 0 && newIndex < filteredAndSortedProjects.length) {
      setSelectedProject(filteredAndSortedProjects[newIndex]);
    }
  };

  const getCurrentProjectIndex = () => {
    if (!selectedProject) return 0;
    return filteredAndSortedProjects.findIndex(p => p.name === selectedProject.name) + 1;
  };

  const handleClusterClick = (clusterName: string) => {
    const cluster = mockClusters.find(c => c.name === clusterName);
    if (cluster) {
      setSelectedCluster(cluster);
      setIsClusterModalOpen(true);
    }
  };

  const handleCloseClusterModal = () => {
    setIsClusterModalOpen(false);
    setSelectedCluster(null);
  };

  const navigateToCluster = (direction: 'prev' | 'next') => {
    if (!selectedCluster) return;

    const currentIndex = mockClusters.findIndex(c => c.name === selectedCluster.name);
    let newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex >= 0 && newIndex < mockClusters.length) {
      setSelectedCluster(mockClusters[newIndex]);
    }
  };

  const getCurrentClusterIndex = () => {
    if (!selectedCluster) return 0;
    return mockClusters.findIndex(c => c.name === selectedCluster.name) + 1;
  };

  const canNavigateClusterPrev = () => {
    if (!selectedCluster) return false;
    const currentIndex = mockClusters.findIndex(c => c.name === selectedCluster.name);
    return currentIndex > 0;
  };

  const canNavigateClusterNext = () => {
    if (!selectedCluster) return false;
    const currentIndex = mockClusters.findIndex(c => c.name === selectedCluster.name);
    return currentIndex < mockClusters.length - 1;
  };

  const canNavigatePrev = () => {
    if (!selectedProject) return false;
    const currentIndex = filteredAndSortedProjects.findIndex(p => p.name === selectedProject.name);
    return currentIndex > 0;
  };

  const canNavigateNext = () => {
    if (!selectedProject) return false;
    const currentIndex = filteredAndSortedProjects.findIndex(p => p.name === selectedProject.name);
    return currentIndex < filteredAndSortedProjects.length - 1;
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
                  prefetch={true}
                >
                  Cluster Info
                </Link>
                <Link
                  href="/projects"
                  className="text-sm font-medium text-white hover:text-[#00e47c] active:text-[#00e47c] transition-colors"
                  prefetch={true}
                >
                  Projects
                </Link>
                <Link
                  href="/billing"
                  className="text-sm font-medium text-white hover:text-[#00e47c] active:text-[#00e47c] transition-colors"
                  prefetch={true}
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
            <Link href="/cluster-info">
              <Button
                variant="outline"
                size="sm"
                className="bg-[#00e47c] text-[#08312a] border-[#00e47c] hover:bg-[#6CEEB2] hover:text-[#08312a] rounded-none shadow-none [&_svg]:text-[#08312a]"
              >
                Show all Clusters
              </Button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <div className="flex space-x-4 pb-4 min-w-max lg:grid lg:grid-cols-3 lg:gap-6 lg:space-x-0">
              {/* BI4 Cluster */}
              <Card
                className="group min-w-[280px] lg:min-w-0 border-gray-200 hover:shadow-lg transition-all duration-200 hover:border-gray-300 overflow-hidden cursor-pointer"
                onClick={() => handleClusterClick('BI4')}
              >
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
              <Card
                className="group min-w-[280px] lg:min-w-0 border-gray-200 hover:shadow-lg transition-all duration-200 hover:border-gray-300 overflow-hidden cursor-pointer"
                onClick={() => handleClusterClick('BI5')}
              >
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
              <Card
                className="group min-w-[280px] lg:min-w-0 border-gray-200 hover:shadow-lg transition-all duration-200 hover:border-gray-300 overflow-hidden cursor-pointer"
                onClick={() => handleClusterClick('BI6')}
              >
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
              <Link href="/projects">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-[#00e47c] text-[#08312a] border-[#00e47c] hover:bg-[#6CEEB2] hover:text-[#08312a] rounded-none shadow-none"
                >
                  Show all projects
                </Button>
              </Link>
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

        {/* Cluster Modal */}
        <ClusterModal
          cluster={selectedCluster}
          isOpen={isClusterModalOpen}
          onClose={handleCloseClusterModal}
          currentIndex={getCurrentClusterIndex()}
          totalResults={mockClusters.length}
          onNavigate={navigateToCluster}
          canNavigatePrev={canNavigateClusterPrev()}
          canNavigateNext={canNavigateClusterNext()}
        />

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

function ClusterModal({
  cluster,
  isOpen,
  onClose,
  currentIndex,
  totalResults,
  onNavigate,
  canNavigatePrev,
  canNavigateNext
}: {
  cluster: any;
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

  if (!isOpen || !cluster) return null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "operational":
        return {
          textColor: "text-green-600",
          bgColor: "bg-green-500",
          badgeColor: "bg-green-100 text-green-800"
        };
      case "under maintenance":
        return {
          textColor: "text-blue-600",
          bgColor: "bg-blue-500",
          badgeColor: "bg-blue-100 text-blue-800"
        };
      case "error":
        return {
          textColor: "text-red-600",
          bgColor: "bg-red-500",
          badgeColor: "bg-red-100 text-red-800"
        };
      default:
        return {
          textColor: "text-gray-600",
          bgColor: "bg-gray-500",
          badgeColor: "bg-gray-100 text-gray-800"
        };
    }
  };

  const statusColors = getStatusColor(cluster.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-out"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 ease-out scale-100 opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <h2 className="text-3xl font-medium text-[#08312a]" style={{ fontFamily: "var(--font-headline)" }}>
                  {cluster.name}
                </h2>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium ${statusColors.textColor}`}>
                    {cluster.status}
                  </span>
                  <div className={`flex h-3 w-3 rounded-full ${statusColors.bgColor} shadow-sm`}>
                    <div className={`h-3 w-3 rounded-full ${statusColors.bgColor} animate-ping`}></div>
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
          <p className="text-sm text-gray-600 mt-1">{cluster.description}</p>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-8rem)]">
          {/* Current Metrics Grid */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-[#08312a] mb-4" style={{ fontFamily: "var(--font-headline)" }}>
              Current Metrics
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Activity className="h-5 w-5 text-[#08312a]" />
                  <span className="text-sm font-medium text-gray-700">Pod Density</span>
                </div>
                <span className="text-2xl font-bold text-[#08312a]">
                  {cluster.podDensity}%
                </span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Server className="h-5 w-5 text-[#08312a]" />
                  <span className="text-sm font-medium text-gray-700">Node Count</span>
                </div>
                <span className="text-2xl font-bold text-[#08312a]">
                  {cluster.nodeCount}
                </span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <MemoryStick className="h-5 w-5 text-[#08312a]" />
                  <span className="text-sm font-medium text-gray-700">RAM Usage</span>
                </div>
                <span className="text-2xl font-bold text-[#08312a]">
                  {cluster.ramUsage} GB
                </span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Cpu className="h-5 w-5 text-[#08312a]" />
                  <span className="text-sm font-medium text-gray-700">CPU Usage</span>
                </div>
                <span className="text-2xl font-bold text-[#08312a]">
                  {cluster.cpuUsage}%
                </span>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                updated 2 hours ago
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
                    aria-label="Previous cluster"
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
                    aria-label="Next cluster"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <Link
                  href={`/projects?cluster=${cluster.name}`}
                  className="text-sm font-medium text-[#08312a] hover:text-[#00e47c] transition-colors flex items-center space-x-1"
                >
                  <span>View Projects</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
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
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  currentIndex: number;
  totalResults: number;
  onNavigate: (direction: 'prev' | 'next') => void;
  canNavigatePrev: boolean;
  canNavigateNext: boolean;
}) {
  const [showCopyToast, setShowCopyToast] = useState(false);

  const handleCopyLink = async () => {
    if (!project) return;

    const currentDate = new Date();
    const monthISO = currentDate.toISOString().slice(0, 7); // YYYY-MM format
    const projectId = encodeURIComponent(project.name);
    const deepLink = `${window.location.origin}/projects?project=${projectId}&month=${monthISO}`;

    try {
      // Try modern Clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(deepLink);
      } else {
        // Fallback to legacy method
        const textArea = document.createElement('textarea');
        textArea.value = deepLink;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      setShowCopyToast(true);
      setTimeout(() => setShowCopyToast(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
      // Show error toast
      setShowCopyToast(true);
      setTimeout(() => setShowCopyToast(false), 2000);
    }
  };

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
                        <img
                          src="/assets/lagoon-icon-black.svg"
                          alt="Lagoon"
                          className="h-4"
                          style={{
                            width: 'auto',
                            height: '16px',
                            opacity: '0.7'
                          }}
                        />
                        <span>Lagoon</span>
                      </a>
                    )}
                    {project.projectUrl && (
                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-sm text-gray-600 hover:text-[#08312a] transition-colors min-w-[24px] min-h-[24px] focus:outline-none focus:ring-2 focus:ring-[#00e47c] focus:ring-offset-1 rounded"
                        aria-label="Open live site (opens in new tab)"
                      >
                        <Globe className="h-4 w-4" />
                        <span>Live site</span>
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
                      {project.usage.hits ? project.usage.hits.toLocaleString() : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Hits % of total</span>
                    <span>{project.usage.hitsPct ? project.usage.hitsPct.toFixed(1) + '%' : '—'}</span>
                  </div>
                  {(!project.usage.hits || !project.usage.hitsPct) && (
                    <div className="mt-2 text-xs text-gray-500">
                      No data for selected month.
                    </div>
                  )}
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
                      {project.storage.dbGb ? project.storage.dbGb.toFixed(2) : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <HardDrive className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium text-gray-700">Files</span>
                    </div>
                    <span className="text-sm font-bold text-purple-600">
                      {project.storage.filesGb ? project.storage.filesGb.toFixed(2) : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Search className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">Solr</span>
                    </div>
                    <span className="text-sm font-bold text-green-600">
                      {project.storage.solrGb ? project.storage.solrGb.toFixed(2) : '—'}
                    </span>
                  </div>
                  <div className="bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg border-2 border-gray-200 p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-gray-700">Total</span>
                      <span className="text-lg font-bold text-[#08312a]">
                        {project.storage.totalGb ? project.storage.totalGb.toFixed(2) : '—'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>Storage % of total</span>
                      <span>{project.storage.storagePct ? project.storage.storagePct.toFixed(1) + '%' : '—'}</span>
                    </div>
                    {(!project.storage.totalGb || !project.storage.storagePct) && (
                      <div className="mt-2 text-xs text-gray-500">
                        No data for selected month.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Usage Note */}
              {(project.usage.hitsPct || project.storage.storagePct) && (
                <div className="mt-4">
                  <p className="text-xs text-gray-500">
                    Usage % = (Hits% + Storage% [± Pods%]) / N; Estimated Cost = Usage % × Month total cost.
                  </p>
                </div>
              )}
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
