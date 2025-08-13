"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Server,
  Cpu,
  HardDrive,
  Activity,
  Bell,
  MemoryStick,
  Database,
  BarChart3,
  X,
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// Mock cluster data
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

function ClusterCard({ cluster, onClick }: { cluster: any; onClick: () => void }) {
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

  const getClusterColor = (clusterName: string) => {
    const clusterColors: Record<string, string> = {
      BI3: "border-t-slate-500",
      BI4: "border-t-blue-500",
      BI5: "border-t-emerald-500",
      BI6: "border-t-purple-500",
      BICN2: "border-t-amber-500",
    };
    return clusterColors[clusterName] || "border-t-gray-500";
  };

  const statusColors = getStatusColor(cluster.status);
  const clusterStripeColor = getClusterColor(cluster.name);

  return (
    <Card
      className={`border-gray-200 hover:shadow-lg transition-all duration-200 hover:border-gray-300 cursor-pointer border-t-4 ${clusterStripeColor}`}
      onClick={onClick}
    >
      <CardHeader className="pb-3 mb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-medium text-[#08312a]">
            {cluster.name}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-medium ${statusColors.textColor}`}>
              {cluster.status}
            </span>
            <div className={`flex h-3 w-3 rounded-full ${statusColors.bgColor} shadow-sm`}>
              <div className={`h-3 w-3 rounded-full ${statusColors.bgColor} animate-ping`}></div>
            </div>
          </div>
        </div>
        <CardDescription className="text-sm text-gray-600">
          {cluster.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Pod Density</span>
          </div>
          <span className="text-sm font-medium text-gray-900">
            {cluster.podDensity}%
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Server className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Node Count</span>
          </div>
          <span className="text-sm font-medium text-gray-900">
            {cluster.nodeCount}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MemoryStick className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">RAM Usage</span>
          </div>
          <span className="text-sm font-medium text-gray-900">
            {cluster.ramUsage} GB
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Cpu className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">CPU Usage</span>
          </div>
          <span className="text-sm font-medium text-gray-900">
            {cluster.cpuUsage}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function ClusterModal({ cluster, isOpen, onClose }: { cluster: any; isOpen: boolean; onClose: () => void }) {
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
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 ease-out scale-100 opacity-100">
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

          {/* Additional Metrics */}
          <div>
            <h3 className="text-lg font-medium text-[#08312a] mb-4" style={{ fontFamily: "var(--font-headline)" }}>
              Storage & Performance
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-4 px-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <div className="flex items-center space-x-3">
                  <Database className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-900">Database Size</span>
                </div>
                <span className="text-xl font-bold text-blue-600">
                  {cluster.databaseSize} GB
                </span>
              </div>
              <div className="flex items-center justify-between py-4 px-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                <div className="flex items-center space-x-3">
                  <HardDrive className="h-5 w-5 text-purple-600" />
                  <span className="font-medium text-gray-900">Storage Size</span>
                </div>
                <span className="text-xl font-bold text-purple-600">
                  {cluster.storageSize} GB
                </span>
              </div>
              <div className="flex items-center justify-between py-4 px-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-gray-900">Hits/Requests</span>
                </div>
                <span className="text-xl font-bold text-green-600">
                  {cluster.hitsRequests}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ClusterInfoPage() {
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedCluster, setSelectedCluster] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long", 
    day: "numeric",
  });

  const getFilteredClusters = () => {
    return mockClusters.filter((cluster) => {
      if (typeFilter !== "all" && cluster.type.toLowerCase() !== typeFilter) {
        return false;
      }
      if (statusFilter !== "all" && cluster.status.toLowerCase() !== statusFilter) {
        return false;
      }
      return true;
    });
  };

  const handleClusterClick = (cluster: any) => {
    setSelectedCluster(cluster);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedCluster(null);
  };

  const filteredClusters = getFilteredClusters();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 border-b bg-[#08312a] backdrop-blur h-20 flex flex-col justify-center items-center">
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
                  className="text-sm font-medium text-[#00e47c] hover:text-[#00e47c] active:text-[#00e47c] transition-colors"
                >
                  Cluster Info
                </Link>
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
        {/* Page Header */}
        <section className="mb-8">
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
                Cluster Info
              </h1>
            </div>
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search clusters..."
                  className="pl-10 w-full sm:w-64 rounded-none shadow-none overflow-hidden"
                />
              </div>

              {/* Type Filter */}
              <Select
                value={typeFilter}
                onValueChange={setTypeFilter}
              >
                <SelectTrigger className="w-full sm:w-40 bg-[#00e47c] text-[#08312a] border-[#00e47c] hover:bg-[#6CEEB2] focus:bg-[#00e47c] rounded-none shadow-none [&_svg]:text-[#08312a]">
                  <Filter className="h-4 w-4 mr-2 text-[#08312a]" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="staging">Staging</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-full sm:w-40 bg-[#00e47c] text-[#08312a] border-[#00e47c] hover:bg-[#6CEEB2] focus:bg-[#00e47c] rounded-none shadow-none [&_svg]:text-[#08312a]">
                  <Filter className="h-4 w-4 mr-2 text-[#08312a]" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="under maintenance">Under Maintenance</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Cluster Cards */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredClusters.map((cluster) => (
              <ClusterCard
                key={cluster.id}
                cluster={cluster}
                onClick={() => handleClusterClick(cluster)}
              />
            ))}
          </div>
        </section>

        {/* Caption */}
        <section>
          <p className="text-sm text-gray-500 text-center">
            Data as of {today} — refreshed twice per day.
          </p>
        </section>

        {/* Modal */}
        <ClusterModal
          cluster={selectedCluster}
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
        />
      </main>
    </div>
  );
}
