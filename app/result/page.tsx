'use client';

import { Suspense } from 'react';
import ResultContent from './ResultContent';

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center text-white">Chargement...</div>}>
      <ResultContent />
    </Suspense>
  );
}
