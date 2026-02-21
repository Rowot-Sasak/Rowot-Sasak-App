"use client";
import { useState } from 'react';
import { useSurvey } from '../../../hooks/useSurvey';
import SurveyList from './SurveyList';
import SurveyForm from './SurveyForm';
import QuestionForm from '../question/QuestionForm';
import Toast from '../../ui/toast';
import DeleteModal from '../../ui/deleteModal';
import Modal from '../../ui/modal';
import { ChevronLeft, Plus, HelpCircle, Edit3, Trash2 } from 'lucide-react';

export const SurveyContainer = () => {
    const {
        data, loading, setLoading, notification, setNotification,
        addSurvey, removeSurvey, manageQuestion, removeQuestion, fetchQuestions
    } = useSurvey();

    const [view, setView] = useState('list');
    const [activeSurvey, setActiveSurvey] = useState(null);
    const [selectedData, setSelectedData] = useState(null);
    const [targetDelete, setTargetDelete] = useState(null);

    const confirmDelete = async () => {
        if (targetDelete.type === 'survey') {
            await removeSurvey(targetDelete.data._id);
            document.getElementById('modal_delete_survey').close();
        } else {
            await removeQuestion(activeSurvey._id, targetDelete.data.question_id);
            await refreshActiveQuestions();
            document.getElementById('modal_delete_question').close();
        }
    };

    return (
        <div className="p-6 min-h-screen bg-base-50">
            {loading && (
                <div className="fixed inset-0 bg-base-100/50 z-[200] flex items-center justify-center backdrop-blur-sm">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            )}

            {notification && <Toast message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}

            <div className="flex justify-between items-center mb-8">
                <div>
                    {view === 'questions' && (
                        <button onClick={() => setView('list')} className="btn btn-ghost btn-xs mb-2 gap-2">
                            <ChevronLeft size={16} /> Kembali
                        </button>
                    )}
                    <h1 className="text-2xl font-bold">{view === 'list' ? '📊 Survey' : `❓ ${activeSurvey?.nama}`}</h1>
                </div>
                <button
                    onClick={() => {
                        setSelectedData(null);
                        const id = view === 'list' ? 'modal_survey_form' : 'modal_question_form';
                        document.getElementById(id).showModal();
                    }}
                    className="btn btn-primary btn-sm gap-2"
                >
                    <Plus size={18} /> Tambah {view === 'list' ? 'Survey' : 'Pertanyaan'}
                </button>
            </div>

            {view === 'list' ? (
                <SurveyList surveys={data}
                    onEdit={(s) => { setSelectedData(s); document.getElementById('modal_survey_form').showModal(); }}
                    onDelete={(s) => { setTargetDelete({ type: 'survey', data: s }); document.getElementById('modal_delete_survey').showModal(); }}
                />
            ) : (
                <div className="space-y-4">
                    {activeSurvey?.questions?.length > 0 ? (
                        activeSurvey.questions.map((q, idx) => (
                            <div key={idx} className="card bg-base-100 shadow-sm border border-base-200 p-5 flex-row justify-between items-center">
                                <div className="flex gap-4">
                                    <span className="bg-primary/10 text-primary font-bold w-8 h-8 rounded-lg flex items-center justify-center">{idx + 1}</span>
                                    <div>
                                        <h3 className="font-semibold">{q.question}</h3>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {q.choices?.map((c, i) => <div key={i} className="badge badge-outline text-[10px]">{c}</div>)}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={() => { setSelectedData(q); document.getElementById('modal_question_form').showModal(); }} className="btn btn-ghost btn-xs text-info"><Edit3 size={16} /></button>
                                    <button onClick={() => { setTargetDelete({ type: 'question', data: q }); document.getElementById('modal_delete_question').showModal(); }} className="btn btn-ghost btn-xs text-error"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 opacity-40 italic">Belum ada pertanyaan.</div>
                    )}
                </div>
            )}

            <Modal id="modal_survey_form" title={selectedData ? "Edit Survey" : "Survey Baru"}>
                <SurveyForm initialData={selectedData} onSubmit={async (val) => { await addSurvey(val, selectedData?._id); document.getElementById('modal_survey_form').close(); }} />
            </Modal>
            <Modal id="modal_question_form" title={selectedData ? "Edit Pertanyaan" : "Pertanyaan Baru"}>
                <QuestionForm surveyId={activeSurvey?._id} initialData={selectedData}
                    onSubmit={async (val, qId) => {
                        await manageQuestion(activeSurvey?._id, val, qId);
                        await refreshActiveQuestions();
                        document.getElementById('modal_question_form').close();
                    }}
                />
            </Modal>
            <DeleteModal id={targetDelete?.type === 'survey' ? "modal_delete_survey" : "modal_delete_question"} title="Konfirmasi Hapus" itemName={targetDelete?.data?.nama || targetDelete?.data?.question} onConfirm={confirmDelete} />
        </div>
    );
};