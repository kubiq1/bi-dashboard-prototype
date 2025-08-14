export default function PageLoader() {
  return (
    <div className="min-h-screen bg-white">
      <div className="animate-pulse">
        {/* Header skeleton */}
        <div className="h-20 bg-[#08312a]"></div>
        
        {/* Content skeleton */}
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          
          {/* Cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
          
          {/* Table skeleton */}
          <div className="space-y-4">
            <div className="h-12 bg-gray-200 rounded"></div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
