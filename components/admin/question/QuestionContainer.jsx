"use client";
import { useEffect, useState } from 'react';
import { Plus, ChevronLeft } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useQuestion } from '../../../hooks/useQuestion';

import QuestionList from './QuestionList';
import QuestionForm from './QuestionForm';
import Modal from '@/components/ui/modal';
import DeleteModal from '@/components/ui/deleteModal';
import Toast from '@/components/ui/toast'; // Jika kamu punya komponen toast

export default function QuestionContainer({ surveyId }) {
  const router = useRouter();
  const {
    getSurveyQuestions,
    manageQuestion,
    removeQuestion,
    loading,
    notification
  } = useQuestion();

  const [questions, setQuestions] = useState([]);
  const [surveyTitle, setSurveyTitle] = useState("Detail Pertanyaan");
  const [selectedData, setSelectedData] = useState(null);
  const [targetDelete, setTargetDelete] = useState(null);

  const loadData = async () => {
    if (surveyId) {
      const data = await getSurveyQuestions(surveyId);
      console.log("data", data);

      setQuestions(data.questions || []);
      if (data.nama) setSurveyTitle(data.nama);
    }
  };

  useEffect(() => {
    loadData();
  }, [surveyId]);

  const handleOpenAdd = () => {
    setSelectedData(null);
    document.getElementById('modal_q').showModal();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-base-100 p-4 rounded-2xl border border-base-200 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/admin/survey')} className="btn btn-circle btn-ghost">
            <ChevronLeft />
          </button>
          <div>
            <h1 className="text-xl font-bold">{surveyTitle}</h1>
            <p className="text-xs opacity-50">Kelola daftar pertanyaan survey</p>
          </div>
        </div>
        <button onClick={handleOpenAdd} className="btn btn-primary btn-sm md:btn-md gap-2">
          <Plus size={20} /> <span className="hidden md:inline">Tambah Soal</span>
        </button>
      </div>

      {loading && questions.length === 0 ? (
        <div className="flex justify-center py-10"><span className="loading loading-dots loading-lg"></span></div>
      ) : (
        <QuestionList
          survey={{ nama: surveyTitle, questions }}
          onBack={() => router.push('/admin/survey')}
          onEdit={(q) => {
            setSelectedData(q);
            document.getElementById('modal_q').showModal();
          }}
          onDelete={(q) => {
            setTargetDelete(q);
            document.getElementById('modal_del_q').showModal();
          }}
        />
      )}

      <Modal id="modal_q" title={selectedData ? "Edit Pertanyaan" : "Tambah Pertanyaan"}>
        <QuestionForm
          surveyId={surveyId}
          initialData={selectedData}
          onSubmit={async (v, qId) => {
            const success = await manageQuestion(surveyId, v, qId);
            if (success) {
              await loadData();
              document.getElementById('modal_q').close();
            }
          }}
        />
      </Modal>

      <DeleteModal
        id="modal_del_q"
        title="Hapus Pertanyaan"
        itemName={targetDelete?.question}
        onConfirm={async () => {
          const success = await removeQuestion(surveyId, targetDelete.question_id);
          if (success) await loadData();
        }}
      />

      {notification && (
        <div className="toast toast-end">
          <div className={`alert ${notification.type === 'error' ? 'alert-error' : 'alert-success'} text-white shadow-lg`}>
            <span>{notification.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}