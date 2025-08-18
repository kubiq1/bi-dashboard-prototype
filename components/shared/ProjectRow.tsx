import { useState } from "react";
import { ExternalLink, GitBranch, Globe, Server } from "lucide-react";
import { Project } from "@/lib/types";

interface ProjectRowProps {
  project: Project;
}

export default function ProjectRow({ project }: ProjectRowProps) {
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

  return (
    <div className="flex items-center space-x-3">
      <span>{project.name}</span>
      <div className="flex space-x-2 relative">
        {/* Repository Link */}
        {project.repositoryUrl && (
          <div className="relative">
            <a
              href={project.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600 transition-colors min-w-[24px] min-h-[24px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#00e47c] focus:ring-offset-1 rounded"
              onMouseEnter={() => setHoveredIcon("repository")}
              onMouseLeave={() => setHoveredIcon(null)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  window.open(project.repositoryUrl, '_blank', 'noopener,noreferrer');
                }
              }}
              aria-label={`View ${project.name} repository`}
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
        )}

        {/* Lagoon Link */}
        {project.lagoonUrl && (
          <div className="relative">
            <a
              href={project.lagoonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600 transition-colors min-w-[24px] min-h-[24px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#00e47c] focus:ring-offset-1 rounded"
              onMouseEnter={() => setHoveredIcon("lagoon")}
              onMouseLeave={() => setHoveredIcon(null)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  window.open(project.lagoonUrl, '_blank', 'noopener,noreferrer');
                }
              }}
              aria-label={`View ${project.name} lagoon`}
            >
              <img
                src="/assets/lagoon-icon-black.svg"
                alt="Lagoon"
                className="h-4 w-4"
              />
            </a>
            {hoveredIcon === "lagoon" && (
              <div className="absolute z-50 transition-all duration-150 pointer-events-none bottom-full left-1/2 transform -translate-x-1/2 mb-2">
                <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                  View Lagoon
                </div>
              </div>
            )}
          </div>
        )}

        {/* Live Site Link */}
        {project.projectUrl && (
          <div className="relative">
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600 transition-colors min-w-[24px] min-h-[24px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#00e47c] focus:ring-offset-1 rounded"
              onMouseEnter={() => setHoveredIcon("livesite")}
              onMouseLeave={() => setHoveredIcon(null)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  window.open(project.projectUrl, '_blank', 'noopener,noreferrer');
                }
              }}
              aria-label="Open live site (opens in new tab)"
            >
              <Globe className="h-4 w-4" />
            </a>
            {hoveredIcon === "livesite" && (
              <div className="absolute z-50 transition-all duration-150 pointer-events-none bottom-full left-1/2 transform -translate-x-1/2 mb-2">
                <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                  Open live site (opens in new tab)
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
