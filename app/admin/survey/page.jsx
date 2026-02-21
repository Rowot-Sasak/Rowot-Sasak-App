import React from 'react';
import { SurveyContainer } from '@/components/admin/survey/SurveyContainer';

export const metadata = {
  title: 'Manajemen Survey | Rowot Sasak',
  description: 'Halaman pengelolaan survey dan kuesioner admin.',
};

export default function SurveyDetailPage({ params }) {
  const { id } = params;

  return (
    <main className="min-h-screen bg-base-50">
      <SurveyContainer initialSurveyId={id} />
    </main>
  );
}