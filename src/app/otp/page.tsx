import { Suspense } from 'react';
import OTPPageContent from '@/components/features/OTPPageContent';

function OTPLoadingFallback() {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="relative z-10 w-full max-w-[360px] mx-4 bg-white rounded-3xl shadow-2xl p-8">
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded-lg w-1/2 animate-shimmer" />
          <div className="h-4 bg-gray-150 rounded w-3/4 animate-shimmer" />
          <div className="flex gap-2 justify-between mt-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="w-12 h-12 bg-gray-200 rounded-full animate-shimmer"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OTPPage() {
  return (
    <Suspense fallback={<OTPLoadingFallback />}>
      <OTPPageContent />
    </Suspense>
  );
}
