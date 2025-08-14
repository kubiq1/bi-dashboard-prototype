import Link from "next/link";
import { Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface NavigationProps {
  currentPage: 'dashboard' | 'cluster-info' | 'projects';
}

export default function Navigation({ currentPage }: NavigationProps) {
  const getLinkClass = (page: string) => {
    const baseClass = "text-sm font-medium transition-colors";
    if (currentPage === page) {
      return `${baseClass} text-[#00e47c] hover:text-[#00e47c] active:text-[#00e47c]`;
    }
    return `${baseClass} text-white hover:text-[#00e47c] active:text-[#00e47c]`;
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-[#08312a] backdrop-blur h-20 flex flex-col justify-center items-center">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-3" prefetch={true}>
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
                className={getLinkClass('cluster-info')}
                prefetch={true}
              >
                Cluster Info
              </Link>
              <Link
                href="/projects"
                className={getLinkClass('projects')}
                prefetch={true}
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
              <button 
                className="relative p-2 text-white hover:text-[#00e47c] transition-colors"
                aria-label="Notifications"
              >
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
  );
}
