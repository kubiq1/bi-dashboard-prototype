"use client";

import {
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  User,
  ChevronDown,
  ChevronUp,
  Server,
  Cpu,
  HardDrive,
  Activity,
  Bell,
  ExternalLink,
  GitBranch,
  CheckCircle,
  MemoryStick,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";

const mockProjects = [
  {
    name: "pro-bi-com-us-jentadueto",
    department: "Human",
    cluster: ["BI4"],
    cost: "USD 2'890",
    percentage: "23.4%",
    cms: "Drupal",
    stage: "Active",
    stageColor: "bg-green-100 text-green-800",
  },
  {
    name: "hz-qa-bi-hubnext-com",
    department: "Animal",
    cluster: ["BI5", "BI6"],
    cost: "USD 1'950",
    percentage: "15.7%",
    cms: "Custom",
    stage: "In Review",
    stageColor: "bg-yellow-100 text-yellow-800",
  },
  {
    name: "hz-storybook-bi-hubnext-com",
    department: "Human",
    cluster: ["BI3"],
    cost: "USD 1'750",
    percentage: "14.1%",
    cms: "WordPress",
    stage: "Active",
    stageColor: "bg-green-100 text-green-800",
  },
  {
    name: "centaura-se",
    department: "Animal",
    cluster: ["BICN2"],
    cost: "USD 1'420",
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
];

function SparklineChart() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [containerWidth, setContainerWidth] = useState(280);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use the provided example data
  const usdValues = [
    13800, 14600, 15800, 15200, 16400, 17500, 17300, 18200, 18800, 18200, 19200,
    20000,
  ];

  const height = 64;

  // Update container width on resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(updateWidth);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  const max = Math.max(...usdValues);
  const min = Math.min(...usdValues);
  const range = max - min;

  // Create points spanning full container width (edge to edge)
  const points = usdValues.map((value, index) => {
    const x = (index * containerWidth) / (usdValues.length - 1);
    const y = ((max - value) / range) * height;
    return { x, y, usd: value };
  });

  // Create horizontal grid lines (4 middle + top + bottom = 6 total)
  const horizontalGridLines = [
    0, // Top line
    ...Array.from({ length: 4 }, (_, i) => ((i + 1) * height) / 5), // Middle lines
    height, // Bottom line
  ];

  // Create 12 vertical grid lines for each month
  const verticalGridLines = Array.from({ length: 12 }, (_, i) => {
    const x = (i * containerWidth) / (usdValues.length - 1);
    return x;
  });

  // Create smooth curve using cubic bezier
  const pathData = points.reduce((path, point, index) => {
    if (index === 0) {
      return `M ${point.x} ${point.y}`;
    } else {
      const prevPoint = points[index - 1];
      const cpx1 = prevPoint.x + (point.x - prevPoint.x) * 0.5;
      const cpy1 = prevPoint.y;
      const cpx2 = prevPoint.x + (point.x - prevPoint.x) * 0.5;
      const cpy2 = point.y;
      return (
        path + ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${point.x} ${point.y}`
      );
    }
  }, "");

  const handleMouseMove = (event: React.MouseEvent<SVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Scale to SVG coordinates
    const svgX = (mouseX / rect.width) * containerWidth;
    const svgY = (mouseY / rect.height) * height;

    // Find nearest point with distance checking in both X and Y
    let nearestIndex = -1;
    let minDistance = Infinity;

    points.forEach((point, index) => {
      const distance = Math.sqrt(
        Math.pow(point.x - svgX, 2) + Math.pow(point.y - svgY, 2),
      );
      if (distance < minDistance && distance <= 12) {
        // 12px threshold
        minDistance = distance;
        nearestIndex = index;
      }
    });

    setHoveredIndex(nearestIndex >= 0 ? nearestIndex : null);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <div ref={containerRef} className="h-16 relative">
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${containerWidth} ${height}`}
        className="overflow-visible"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Horizontal grid lines */}
        {horizontalGridLines.map((y, index) => (
          <line
            key={`horizontal-grid-${index}`}
            x1="0"
            y1={y}
            x2={containerWidth}
            y2={y}
            stroke="#e5e7eb"
            strokeWidth="0.5"
            opacity="1"
          />
        ))}

        {/* Vertical grid lines for each month */}
        {verticalGridLines.map((x, index) => (
          <line
            key={`vertical-grid-${index}`}
            x1={x}
            y1="0"
            x2={x}
            y2={height}
            stroke="#e5e7eb"
            strokeWidth="0.5"
            opacity="0.5"
          />
        ))}

        {/* Sparkline path */}
        <path
          d={pathData}
          fill="none"
          stroke="#00b871"
          strokeWidth="2"
          className="transition-all duration-200"
        />

        {/* Single hover dot for nearest point */}
        {hoveredIndex !== null && (
          <circle
            cx={points[hoveredIndex].x}
            cy={points[hoveredIndex].y}
            r="4"
            fill="#00b871"
            stroke="white"
            strokeWidth="2"
            className="transition-all duration-150"
          />
        )}

        {/* Invisible hover areas for better interaction */}
        {points.map((point, index) => (
          <circle
            key={`hover-${index}`}
            cx={point.x}
            cy={point.y}
            r="12"
            fill="transparent"
            className="cursor-crosshair"
          />
        ))}
      </svg>

      {/* Tooltip positioned exactly at the dot */}
      {hoveredIndex !== null && (
        <div
          className="absolute pointer-events-none z-10 transition-all duration-150"
          style={{
            left: `${(points[hoveredIndex].x / containerWidth) * 100}%`,
            top: `${(points[hoveredIndex].y / height) * 100}%`,
            transform: "translate(-50%, -100%) translateY(-8px)",
          }}
        >
          <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
            USD {points[hoveredIndex].usd.toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}

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
            <div className="absolute z-10 transition-all duration-150 pointer-events-none bottom-full left-1/2 transform -translate-x-1/2 mb-2">
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
            <div className="absolute z-10 transition-all duration-150 pointer-events-none bottom-full left-1/2 transform -translate-x-1/2 mb-2">
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
  const [today, setToday] = useState("");
  const [hasNotifications, setHasNotifications] = useState(true);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

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

  const getSortedProjects = () => {
    if (!sortField) return mockProjects;

    return [...mockProjects].sort((a, b) => {
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

  const sortedProjects = getSortedProjects();

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
              <div className="flex items-center space-x-3">
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
              </div>
              <nav className="hidden md:flex items-center space-x-8 ml-8">
                <a
                  href="#"
                  className="text-sm font-medium text-white hover:text-[#00e47c] active:text-[#00e47c] transition-colors"
                >
                  Cluster Info
                </a>
                <a
                  href="#"
                  className="text-sm font-medium text-white hover:text-[#00e47c] active:text-[#00e47c] transition-colors"
                >
                  Projects
                </a>
                <a
                  href="#"
                  className="text-sm font-medium text-[#00e47c] hover:text-[#00e47c] transition-colors border-b-2 border-[#00e47c] pb-1"
                >
                  Billing
                </a>
              </nav>
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
                  USD 12'390
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
              <Card className="min-w-[280px] lg:min-w-0 border-gray-200 hover:shadow-lg transition-all duration-200 hover:border-gray-300">
                <CardHeader className="pb-3 mb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-medium text-[#08312a]">
                      BI4
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-green-600">
                        Healthy
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
                <CardContent className="space-y-4">
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
                      24.5 GB
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Cpu className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">CPU Usage</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      65%
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* BI5 Cluster */}
              <Card className="min-w-[280px] lg:min-w-0 border-gray-200 hover:shadow-lg transition-all duration-200 hover:border-gray-300">
                <CardHeader className="pb-3 mb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-medium text-[#08312a]">
                      BI5
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-yellow-600">
                        Warning
                      </span>
                      <div className="flex h-3 w-3 rounded-full bg-yellow-500 shadow-sm">
                        <div className="h-3 w-3 rounded-full bg-yellow-500 animate-ping"></div>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-sm text-gray-600">
                    Production Cluster
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                      18.2 GB
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Cpu className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">CPU Usage</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      82%
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* BI6 Cluster */}
              <Card className="min-w-[280px] lg:min-w-0 border-gray-200 hover:shadow-lg transition-all duration-200 hover:border-gray-300">
                <CardHeader className="pb-3 mb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-medium text-[#08312a]">
                      BI6
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-red-600">
                        Critical
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
                <CardContent className="space-y-4">
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
                      7.8 GB
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Cpu className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">CPU Usage</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      94%
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Projects Cost Breakdown */}
        <section>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <h2
              className="font-medium text-[#08312a] mb-4 lg:mb-0"
              style={{
                fontFamily: "var(--font-headline)",
                fontSize: "26px",
                lineHeight: "32px",
              }}
            >
              Projects
            </h2>
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search projects..."
                  className="pl-10 w-full sm:w-64 rounded-none shadow-none overflow-hidden"
                />
              </div>

              {/* Department Filter */}
              <Select>
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
              <Select>
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
              <Select>
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
                      <SortableHeader field="name" className="w-[35%]">
                        Project Name
                      </SortableHeader>
                      <SortableHeader field="cluster" className="w-[20%]">
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
                        className="text-right w-[15%]"
                      >
                        % of Total
                      </SortableHeader>
                      <SortableHeader field="cms" className="w-[15%]">
                        Application
                      </SortableHeader>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedProjects.map((project, index) => (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell className="font-medium text-gray-900 w-[35%]">
                          <div className="truncate">
                            <ProjectRow project={project} />
                          </div>
                        </TableCell>
                        <TableCell className="w-[20%]">
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
                        <TableCell className="text-right text-gray-600 w-[15%]">
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

          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-600">Showing 10 of 1100 projects</p>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled
                className="bg-gray-100 text-gray-400 border-gray-200 rounded-none shadow-none"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-[#00e47c] text-[#08312a] border-[#00e47c] hover:bg-[#6CEEB2] hover:text-[#08312a] rounded-none shadow-none"
              >
                Next
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
