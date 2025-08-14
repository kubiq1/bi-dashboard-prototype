import { useState, useEffect, useRef, useMemo, useCallback } from "react";

interface SparklineChartProps {
  data?: number[];
  width?: number;
  height?: number;
}

export default function SparklineChart({ 
  data = [13800, 14600, 15800, 15200, 16400, 17500, 17300, 18200, 18800, 18200, 19200, 20000],
  width = 280,
  height = 64 
}: SparklineChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [containerWidth, setContainerWidth] = useState(width);
  const containerRef = useRef<HTMLDivElement>(null);

  // Memoize expensive calculations
  const chartData = useMemo(() => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;

    // Create points spanning full container width (edge to edge)
    const points = data.map((value, index) => {
      const x = (index * containerWidth) / (data.length - 1);
      const y = ((max - value) / range) * height;
      return { x, y, usd: value };
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

    return { points, pathData, max, min, range };
  }, [data, containerWidth, height]);

  // Optimize resize handling
  const updateWidth = useCallback(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    updateWidth();
    
    const resizeObserver = new ResizeObserver(updateWidth);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [updateWidth]);

  // Optimize mouse handling
  const handleMouseMove = useCallback((event: React.MouseEvent<SVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Scale to SVG coordinates
    const svgX = (mouseX / rect.width) * containerWidth;
    const svgY = (mouseY / rect.height) * height;

    // Find nearest point
    let nearestIndex = -1;
    let minDistance = Infinity;

    chartData.points.forEach((point, index) => {
      const distance = Math.sqrt(
        Math.pow(point.x - svgX, 2) + Math.pow(point.y - svgY, 2),
      );
      if (distance < minDistance && distance <= 12) {
        minDistance = distance;
        nearestIndex = index;
      }
    });

    setHoveredIndex(nearestIndex >= 0 ? nearestIndex : null);
  }, [chartData.points, containerWidth, height]);

  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(null);
  }, []);

  // Grid lines memoized
  const gridLines = useMemo(() => {
    const horizontalGridLines = [
      0,
      ...Array.from({ length: 4 }, (_, i) => ((i + 1) * height) / 5),
      height,
    ];

    const verticalGridLines = Array.from({ length: data.length }, (_, i) => {
      return (i * containerWidth) / (data.length - 1);
    });

    return { horizontalGridLines, verticalGridLines };
  }, [height, containerWidth, data.length]);

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
        {gridLines.horizontalGridLines.map((y, index) => (
          <line
            key={`h-${index}`}
            x1="0"
            y1={y}
            x2={containerWidth}
            y2={y}
            stroke="#e5e7eb"
            strokeWidth="0.5"
            opacity="1"
          />
        ))}

        {/* Vertical grid lines */}
        {gridLines.verticalGridLines.map((x, index) => (
          <line
            key={`v-${index}`}
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
          d={chartData.pathData}
          fill="none"
          stroke="#00b871"
          strokeWidth="2"
          className="transition-all duration-200"
        />

        {/* Hover dot */}
        {hoveredIndex !== null && (
          <circle
            cx={chartData.points[hoveredIndex].x}
            cy={chartData.points[hoveredIndex].y}
            r="4"
            fill="#00b871"
            stroke="white"
            strokeWidth="2"
            className="transition-all duration-150"
          />
        )}

        {/* Invisible hover areas */}
        {chartData.points.map((point, index) => (
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

      {/* Tooltip */}
      {hoveredIndex !== null && (
        <div
          className="absolute pointer-events-none z-10 transition-all duration-150"
          style={{
            left: `${(chartData.points[hoveredIndex].x / containerWidth) * 100}%`,
            top: `${(chartData.points[hoveredIndex].y / height) * 100}%`,
            transform: "translate(-50%, -100%) translateY(-8px)",
          }}
        >
          <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
            USD {chartData.points[hoveredIndex].usd.toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}
