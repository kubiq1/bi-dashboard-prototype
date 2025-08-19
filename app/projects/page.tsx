"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Filter,
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
  Globe,
  Link,
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
import { ITEMS_PER_PAGE, DEFAULT_STATIC_DATE, FILTER_OPTIONS, PAGE_SIZE_OPTIONS } from "@/lib/constants";


export default function ProjectsPage() {
  const searchParams = useSearchParams();
  const [today, setToday] = useState(DEFAULT_STATIC_DATE);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [filters, setFilters] = useState<FilterState>({
    department: "all",
    application: "all",
    cluster: "all"
  });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [focusedRowRef, setFocusedRowRef] = useState<HTMLTableRowElement | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    pageInput: "1",
    itemsPerPage: ITEMS_PER_PAGE
  });

  useEffect(() => {
    setToday(formatCurrentDate());

    // Check for cluster parameter in URL
    const clusterParam = searchParams.get('cluster');
    if (clusterParam) {
      // Convert cluster name to lowercase to match filter options
      const clusterValue = clusterParam.toLowerCase();
      setFilters(prev => ({ ...prev, cluster: clusterValue }));
    }
  }, [searchParams]);

  const handleSort = useCallback((field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }, [sortField, sortDirection]);

  const filteredAndSortedProjects = useMemo(() => {
    const filtered = filterProjects(mockProjects, filters);
    return sortField ? sortProjects(filtered, sortField, sortDirection) : filtered;
  }, [mockProjects, filters, sortField, sortDirection]);

  const totalItems = filteredAndSortedProjects.length;
  const totalPages = Math.ceil(totalItems / pagination.itemsPerPage);

  // Get projects for current page
  const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
  const endIndex = startIndex + pagination.itemsPerPage;
  const currentPageProjects = filteredAndSortedProjects.slice(
    startIndex,
    endIndex,
  );

  // Reset to first page when filters change
  const resetPagination = () => {
    setPagination(prev => ({
      ...prev,
      currentPage: 1,
      pageInput: "1"
    }));
  };

  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = parseInt(value);
    setPagination(prev => ({
      ...prev,
      itemsPerPage: newItemsPerPage,
      currentPage: 1,
      pageInput: "1"
    }));
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setPagination(prev => ({
        ...prev,
        currentPage: page,
        pageInput: page.toString()
      }));
    }
  };

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const page = parseInt(pagination.pageInput);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setPagination(prev => ({
        ...prev,
        currentPage: page
      }));
    } else {
      setPagination(prev => ({
        ...prev,
        pageInput: pagination.currentPage.toString()
      }));
    }
  };

  const pageNumbers = useMemo(() =>
    generatePageNumbers(pagination.currentPage, totalPages),
    [pagination.currentPage, totalPages]
  );

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

  const handleProjectClick = (project: Project, rowElement: HTMLTableRowElement) => {
    setFocusedRowRef(rowElement);
    setSelectedProject(project);
    setIsProjectModalOpen(true);
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

  const handleCloseProjectModal = () => {
    setIsProjectModalOpen(false);
    setSelectedProject(null);
    // Return focus to the originating row
    if (focusedRowRef) {
      focusedRowRef.focus();
      setFocusedRowRef(null);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation currentPage="projects" />

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
                value={filters.department}
                onValueChange={(value) => {
                  setFilters(prev => ({ ...prev, department: value }));
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
                value={filters.application}
                onValueChange={(value) => {
                  setFilters(prev => ({ ...prev, application: value }));
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
                value={filters.cluster}
                onValueChange={(value) => {
                  setFilters(prev => ({ ...prev, cluster: value }));
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

          {/* Pagination */}
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-2 lg:space-y-0 mt-4">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{" "}
                {totalItems} results
              </div>
              <Select value={pagination.itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                <SelectTrigger className="w-32 h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Pagination>
                <PaginationContent className="gap-0">
                  <PaginationItem>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className="border-r-0 rounded-r-none"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </PaginationItem>

                  {pageNumbers.map((pageNumber, index) => (
                    <PaginationItem key={index}>
                      {pageNumber === "..." ? (
                        <PaginationEllipsis />
                      ) : (
                        <Button
                          variant={
                            pageNumber === pagination.currentPage ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => handlePageChange(pageNumber as number)}
                          className={cn(
                            "border-r-0 rounded-none",
                            pageNumber === pagination.currentPage &&
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
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === totalPages}
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
                  value={pagination.pageInput}
                  onChange={(e) => setPagination(prev => ({ ...prev, pageInput: e.target.value }))}
                  className="w-16 h-8 text-center text-sm rounded-none"
                />
                <span className="text-sm text-gray-700">of {totalPages}</span>
              </form>
            </div>
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
      await navigator.clipboard.writeText(deepLink);
      setShowCopyToast(true);
      setTimeout(() => setShowCopyToast(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
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
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyLink}
                className="h-10 w-10 p-0 hover:bg-gray-100 rounded-full"
                title="Copy link to this project overlay"
                aria-label="Copy link to this project overlay"
              >
                <Link className="h-5 w-5 text-gray-500" />
              </Button>
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

      {/* Copy Link Toast */}
      {showCopyToast && (
        <div className="fixed bottom-4 right-4 z-60 bg-[#08312a] text-white px-4 py-2 rounded-lg shadow-lg transform transition-all duration-300 ease-out">
          Link copied
        </div>
      )}
    </div>
  );
}
