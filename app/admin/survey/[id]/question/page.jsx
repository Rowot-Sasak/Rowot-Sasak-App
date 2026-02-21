"use client";
import { use } from 'react';
import { useSearchParams } from 'next/navigation';
import QuestionContainer from '@/components/admin/question/QuestionContainer';

export default function SurveyDetailPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const id = params.id;

  const searchParams = useSearchParams();
  const idInt = searchParams.get('id_int');

  return (
    <main className="min-h-screen bg-base-200/50">
      <QuestionContainer 
        surveyId={id} 
      />
    </main>
  );
}