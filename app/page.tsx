"use client";

import {
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  User,
  ChevronDown,
  Server,
  Cpu,
  HardDrive,
  Activity,
  Bell,
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
import { useEffect, useState } from "react";

const mockProjects = [
  {
    name: "Customer Portal Redesign",
    cluster: "Production",
    cost: "CHF 2'890",
    percentage: "23.4%",
    cms: "Drupal",
    stage: "Active",
    stageColor: "bg-green-100 text-green-800",
  },
  {
    name: "Clinical Trial Platform",
    cluster: "Staging",
    cost: "CHF 1'950",
    percentage: "15.7%",
    cms: "Custom",
    stage: "In Review",
    stageColor: "bg-yellow-100 text-yellow-800",
  },
  {
    name: "Research Data Hub",
    cluster: "Production",
    cost: "CHF 1'750",
    percentage: "14.1%",
    cms: "WordPress",
    stage: "Active",
    stageColor: "bg-green-100 text-green-800",
  },
  {
    name: "Internal Training Portal",
    cluster: "Development",
    cost: "CHF 1'420",
    percentage: "11.5%",
    cms: "Drupal",
    stage: "Legacy",
    stageColor: "bg-gray-100 text-gray-800",
  },
  {
    name: "Product Documentation",
    cluster: "Production",
    cost: "CHF 980",
    percentage: "7.9%",
    cms: "GitBook",
    stage: "Active",
    stageColor: "bg-green-100 text-green-800",
  },
  {
    name: "Regulatory Dashboard",
    cluster: "Staging",
    cost: "CHF 850",
    percentage: "6.9%",
    cms: "Custom",
    stage: "In Review",
    stageColor: "bg-yellow-100 text-yellow-800",
  },
  {
    name: "Partner API Gateway",
    cluster: "Production",
    cost: "CHF 740",
    percentage: "6.0%",
    cms: "N/A",
    stage: "Active",
    stageColor: "bg-green-100 text-green-800",
  },
  {
    name: "Legacy CRM Migration",
    cluster: "Development",
    cost: "CHF 620",
    percentage: "5.0%",
    cms: "Salesforce",
    stage: "Legacy",
    stageColor: "bg-gray-100 text-gray-800",
  },
];

function SparklineChart() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Use the provided example data
  const chfValues = [
    13800, 14600, 15800, 15200, 16400, 17500, 17300, 18200, 18800, 18200, 19200,
    20000,
  ];

  // Use full container width for the sparkline
  const containerWidth = 280;
  const height = 64;

  const max = Math.max(...chfValues);
  const min = Math.min(...chfValues);
  const range = max - min;

  // Create points spanning full container width (edge to edge)
  const points = chfValues.map((value, index) => {
    const x = (index * containerWidth) / (chfValues.length - 1);
    const y = ((max - value) / range) * height;
    return { x, y, chf: value };
  });

  // Create 4 horizontal grid lines spanning full width
  const gridLines = Array.from({ length: 4 }, (_, i) => {
    const y = ((i + 1) * height) / 5;
    return y;
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
    <div className="h-16 relative">
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${containerWidth} ${height}`}
        className="overflow-visible"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Grid lines - make sure they're visible */}
        {gridLines.map((y, index) => (
          <line
            key={`grid-${index}`}
            x1="0"
            y1={y}
            x2={containerWidth}
            y2={y}
            stroke="#e5e7eb"
            strokeWidth="0.5"
            opacity="1"
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
            CHF {points[hoveredIndex].chf.toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [today, setToday] = useState("");
  const [hasNotifications, setHasNotifications] = useState(true);

  useEffect(() => {
    setToday(new Date().toLocaleDateString("en-CH"));
  }, []);

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
                  className="text-sm font-extralight text-[#00E47C]"
                  style={{ fontFamily: "var(--font-headline)" }}
                >
                  Dashboard
                </h1>
              </div>
              <nav className="hidden md:flex items-center space-x-6">
                <a
                  href="#"
                  className="text-sm font-medium text-white hover:text-[#00e47c] active:text-[#00e47c] transition-colors"
                >
                  Billing
                </a>
                <a
                  href="#"
                  className="text-sm font-medium text-white hover:text-[#00e47c] active:text-[#00e47c] transition-colors"
                >
                  Projects
                </a>
                <a
                  href="#"
                  className="text-sm font-medium text-white hover:text-[#00e47c] active:text-[#00e47c] transition-colors"
                >
                  Cluster Info
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
                    <span style={{ color: "rgb(8, 49, 42)" }}>CH</span>
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
            className="text-2xl font-medium text-gray-900 mb-6"
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
                  CHF 12'390
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
                <p className="text-xs text-gray-500 mt-1">CHF 740 increase</p>
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

        {/* Cluster Overview */}
        <section className="mb-12">
          <h2
            className="text-2xl font-medium text-gray-900 mb-6"
            style={{ fontFamily: "var(--font-headline)" }}
          >
            Cluster Overview
          </h2>
          <div className="overflow-x-auto">
            <div className="flex space-x-4 pb-4 min-w-max lg:grid lg:grid-cols-3 lg:gap-6 lg:space-x-0">
              {/* BI-1 Cluster */}
              <Card className="min-w-[280px] lg:min-w-0 border-gray-200 hover:shadow-lg transition-all duration-200 hover:border-gray-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-medium text-gray-900">
                      BI-1
                    </CardTitle>
                    <div className="flex h-3 w-3 rounded-full bg-green-500 shadow-sm">
                      <div className="h-3 w-3 rounded-full bg-green-500 animate-ping"></div>
                    </div>
                  </div>
                  <CardDescription className="text-sm text-gray-600">
                    Production Cluster
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Server className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Active Nodes
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      12
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Cpu className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">RAM Usage</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      78%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Pod Count</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      143
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* BI-2 Cluster */}
              <Card className="min-w-[280px] lg:min-w-0 border-gray-200 hover:shadow-lg transition-all duration-200 hover:border-gray-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-medium text-gray-900">
                      BI-2
                    </CardTitle>
                    <div className="flex h-3 w-3 rounded-full bg-yellow-500 shadow-sm">
                      <div className="h-3 w-3 rounded-full bg-yellow-500 animate-ping"></div>
                    </div>
                  </div>
                  <CardDescription className="text-sm text-gray-600">
                    Staging Cluster
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Server className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Active Nodes
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Cpu className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">RAM Usage</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      65%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Pod Count</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      89
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* BI-CN2 Cluster */}
              <Card className="min-w-[280px] lg:min-w-0 border-gray-200 hover:shadow-lg transition-all duration-200 hover:border-gray-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-medium text-gray-900">
                      BI-CN2
                    </CardTitle>
                    <div className="flex h-3 w-3 rounded-full bg-red-500 shadow-sm">
                      <div className="h-3 w-3 rounded-full bg-red-500 animate-ping"></div>
                    </div>
                  </div>
                  <CardDescription className="text-sm text-gray-600">
                    Development Cluster
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Server className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Active Nodes
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">4</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Cpu className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">RAM Usage</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      92%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Pod Count</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      56
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
              className="font-medium text-gray-900 mb-4 lg:mb-0"
              style={{
                fontFamily: "var(--font-headline)",
                fontSize: "26px",
                lineHeight: "32px",
              }}
            >
              Projects – Cost Breakdown
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search projects..."
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <Select>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by cluster" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clusters</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                  <SelectItem value="staging">Staging</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card className="border-gray-200">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="font-semibold text-gray-900">
                        Project Name
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900">
                        Cluster
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 text-right">
                        Cost (CHF)
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900 text-right">
                        % of Total
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900">
                        CMS
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900">
                        Lifecycle Stage
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockProjects.map((project, index) => (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell className="font-medium text-gray-900">
                          {project.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-normal">
                            {project.cluster}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {project.cost}
                        </TableCell>
                        <TableCell className="text-right text-gray-600">
                          {project.percentage}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {project.cms}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${project.stageColor} border-0 font-normal`}
                            variant="secondary"
                          >
                            {project.stage}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-600">Showing 8 of 24 projects</p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
