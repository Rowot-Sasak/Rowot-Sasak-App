"use client";
import { useEffect, useState } from 'react';
import { ChevronLeft } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useQuestion } from '../../../hooks/useQuestion';
import AnswerList from './AnswerList';

export default function AnswerContainer({ surveyId }) {
    const router = useRouter();
    const { getSurveyQuestions, getSurveyAnswers, getUserDisplayName, loading, notification } = useQuestion();
    const [responses, setResponses] = useState([]);
    const [questions, setQuestions] = useState([]);

    const loadData = async () => {
        if (!surveyId) return;
        const [dataPertanyaan, dataJawaban] = await Promise.all([
            getSurveyQuestions(surveyId),
            getSurveyAnswers(surveyId)
        ]);

        if (dataPertanyaan) {
            setQuestions(dataPertanyaan.questions || []);
        }

        if (dataJawaban && dataJawaban.length > 0) {
            const enrichedResponses = await Promise.all(
                dataJawaban.map(async (res) => {
                    const userRes = await getUserDisplayName(res.user_id);
                    const namaReal = userRes || "Anonim";
                    return { ...res, display_name: namaReal };
                })
            );
            setResponses(enrichedResponses);
        } else {
            setResponses([]);
        }
    };

    useEffect(() => { loadData(); }, [surveyId]);

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <header className="flex items-center gap-4 bg-base-100 p-4 rounded-2xl border border-base-200">
                <button onClick={() => router.back()} className="btn btn-circle btn-ghost">
                    <ChevronLeft />
                </button>
                <div>
                    <h1 className="text-xl font-bold">Hasil Reponden</h1>
                    <p className="text-xs opacity-50">Melihat hasil jawaban responden</p>
                </div>
            </header>

            {loading ? (
                <div className="flex justify-center py-10"><span className="loading loading-spinner loading-lg"></span></div>
            ) : (
                <AnswerList responses={responses} questions={questions} />
            )}

            {notification && (
                <div className="toast toast-end">
                    <div className={`alert ${notification.type === 'error' ? 'alert-error' : 'alert-success'} text-white`}>
                        <span>{notification.message}</span>
                    </div>
                </div>
            )}
        </div>
    );
}