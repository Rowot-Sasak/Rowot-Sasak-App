"use client";
import { Plus, Edit, Trash, HelpCircle, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function SurveyList({ surveys, onEdit, onDelete }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {surveys.map((survey) => (
                <div key={survey._id} className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-shadow">
                    <div className="card-body p-4 md:p-5">
                        <div className="flex justify-between items-start gap-2">
                            <h2 className="card-title text-primary text-sm md:text-base leading-tight">
                                {survey.nama}
                            </h2>
                            <div className="badge badge-outline text-[10px] whitespace-nowrap shrink-0">
                                {survey.waktu ? new Date(survey.waktu).toLocaleDateString("id-ID") : "-"}
                            </div>
                        </div>
                        
                        <p className="text-xs opacity-70 line-clamp-2 mt-2 h-8">
                            {survey.deskripsi || "Tidak ada deskripsi."}
                        </p>

                        <div className="divider my-2"></div>

                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                                <div className="flex gap-1">
                                    <button 
                                        onClick={() => onEdit(survey)} 
                                        className="btn btn-ghost btn-xs text-info px-1"
                                        title="Edit Survey"
                                    >
                                        <Edit size={14} />
                                    </button>
                                    <button 
                                        onClick={() => onDelete(survey)} 
                                        className="btn btn-ghost btn-xs text-error px-1"
                                        title="Hapus Survey"
                                    >
                                        <Trash size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <Link
                                    href={`/admin/survey/${survey._id}/question?id_int=${survey.id_int}`}
                                    className="btn btn-outline btn-primary btn-xs gap-1 py-3 h-auto text-[10px]"
                                >
                                    <HelpCircle size={12} /> Soal
                                </Link>
                                <Link
                                    href={`/admin/survey/${survey._id}/responses`}
                                    className="btn btn-primary btn-xs gap-1 py-3 h-auto text-[10px]"
                                >
                                    <MessageSquare size={12} /> Response
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <button
                onClick={() => onEdit(null)}
                className="card bg-base-200/50 border-2 border-dashed border-base-300 flex items-center justify-center min-h-[160px] hover:bg-base-200 transition-all group p-4"
            >
                <div className="flex flex-col items-center opacity-40 group-hover:opacity-100">
                    <Plus size={32} className="mb-2" />
                    <span className="text-xs font-bold uppercase tracking-wider">Buat Survey Baru</span>
                </div>
            </button>
        </div>
    );
}