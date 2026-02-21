"use client";
import { use } from "react";
import { useSearchParams } from "next/navigation";
import AnswerContainer from "@/components/admin/answer/AnswerContainer";

export default function ResponsesPage({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const surveyId = params.id;
    const searchParams = useSearchParams();
    const idInt = searchParams.get('id_int');

    return (
        <main className="min-h-screen bg-base-200/50">
            <AnswerContainer 
                surveyId={surveyId} 
                idInt={idInt} 
            />
        </main>
    );
}