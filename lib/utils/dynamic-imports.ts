import dynamic from 'next/dynamic';
import PageLoader from '@/components/shared/PageLoader';

// Dynamic imports with loading states
export const DynamicSparklineChart = dynamic(
  () => import('@/components/charts/SparklineChart'),
  {
    loading: () => {
      return (
        <div className="h-16 bg-gray-100 animate-pulse rounded"></div>
      );
    },
    ssr: true, // Enable SSR for better SEO
  }
);

export const DynamicProjectRow = dynamic(
  () => import('@/components/shared/ProjectRow'),
  {
    loading: () => {
      return (
        <div className="h-6 bg-gray-100 animate-pulse rounded w-3/4"></div>
      );
    },
    ssr: true,
  }
);