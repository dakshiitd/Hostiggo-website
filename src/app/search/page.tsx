import { Suspense } from 'react';
import SearchPageSkeleton from '@/components/features/SearchPageSkeleton';
import SearchPageContent from '@/components/features/SearchPageContent';

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<SearchPageSkeleton />}>
      <SearchPageContent />
    </Suspense>
  );
}
