"use client";
import { Edit3, Trash2, HelpCircle, ChevronLeft } from "lucide-react";

export default function QuestionList({ survey, onBack, onEdit, onDelete }) {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid gap-4">
                {survey.questions && survey.questions.length > 0 ? (
                    survey.questions.map((q, index) => (
                        <div
                            key={q.question_id}
                            className="collapse collapse-arrow bg-base-100 border border-base-200 shadow-sm hover:border-primary/30 transition-colors"
                        >
                            <input type="checkbox" className="peer" />
                            <div className="collapse-title flex items-center gap-4 pr-12">
                                <div className="bg-primary/10 text-primary text-xs font-bold w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
                                    {index + 1}
                                </div>
                                <span className="font-medium text-sm truncate">{q.question}</span>
                            </div>

                            <div className="collapse-content">
                                <div className="pl-12 space-y-3">
                                    <p className="text-xs font-bold text-base-content/40 uppercase tracking-widest">Pilihan Jawaban:</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {q.choices.map((choice, i) => (
                                            <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-base-200/50 border border-base-300/50 text-sm">
                                                <span className="badge badge-primary badge-xs">{String.fromCharCode(65 + i)}</span>
                                                {choice}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="divider opacity-50"></div>
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => onEdit(q)}
                                            className="btn btn-ghost btn-xs text-info gap-1"
                                        >
                                            <Edit3 size={14} /> Edit Soal
                                        </button>
                                        <button
                                            onClick={() => onDelete(q)}
                                            className="btn btn-ghost btn-xs text-error gap-1"
                                        >
                                            <Trash2 size={14} /> Hapus
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-base-200/20 border-2 border-dashed border-base-300 rounded-3xl">
                        <HelpCircle size={48} className="opacity-20 mb-2" />
                        <p className="text-sm opacity-50">Belum ada pertanyaan. Silahkan tambah pertanyaan baru.</p>
                    </div>
                )}
            </div>
        </div>
    );
}