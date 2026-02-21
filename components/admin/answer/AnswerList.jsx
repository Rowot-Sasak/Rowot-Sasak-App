"use client";
import { User, Calendar } from "lucide-react";

export default function AnswerList({ responses, questions }) {
    const getQuestionText = (qId) => {
        return questions.find(q => q.question_id === qId)?.question || `Soal #${qId}`;
    };

    if (responses.length === 0) return (
        <div className="text-center py-20 opacity-40">Belum ada jawaban masuk.</div>
    );

    return (
        <div className="grid gap-4">
            {responses.map((resp, idx) => (
                <div key={resp._id} className="collapse collapse-arrow bg-base-100 border border-base-200 shadow-sm">
                    <input type="checkbox" />
                    <div className="collapse-title flex items-center gap-4">
                        <div className="avatar placeholder">
                            <div className="bg-primary text-primary-content rounded-full w-10">
                                <span className="text-xs">{idx + 1}</span>
                            </div>
                        </div>
                        <div>
                            <div className="text-sm font-bold flex items-center gap-2">
                                <User size={14} className="opacity-50" />
                                {resp.display_name || "User Tidak Dikenal"}
                            </div>
                            <div className="text-[10px] opacity-50 flex items-center gap-1">
                                <Calendar size={12} />
                                {new Date(resp.submittedAt).toLocaleString('id-ID')}
                            </div>
                        </div>
                    </div>
                    <div className="collapse-content bg-base-200/10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 border-t border-base-200">
                            {resp.answers.map((ans) => (
                                <div key={ans.question_id} className="p-3 bg-base-100 rounded-lg border border-base-200">
                                    <p className="text-[10px] uppercase font-bold opacity-40 mb-1">Pertanyaan {ans.question_id}</p>
                                    <p className="text-xs font-medium mb-2 leading-relaxed">{getQuestionText(ans.question_id)}</p>
                                    <div className="badge badge-primary font-bold badge-sm">{ans.choice}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}