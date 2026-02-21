"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";

export default function QuestionForm({ initialData, onSubmit, surveyId }) {
  const [question, setQuestion] = useState("");
  const [choices, setChoices] = useState([""]);

  useEffect(() => {
    if (initialData) {
      setQuestion(initialData.question || "");
      setChoices(initialData.choices || [""]);
    }
  }, [initialData]);

  const addChoice = () => setChoices([...choices, ""]);
  const removeChoice = (index) => setChoices(choices.filter((_, i) => i !== index));
  const updateChoice = (index, val) => {
    const newChoices = [...choices];
    newChoices[index] = val;
    setChoices(newChoices);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ question, choices: choices.filter(c => c !== "") }, initialData?.question_id);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-control">
        <label className="label-text font-bold mb-2">Pertanyaan</label>
        <textarea
          className="textarea textarea-bordered w-full"
          placeholder="Tulis pertanyaan..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
      </div>

      <div className="form-control">
        <label className="label-text font-bold mb-2">Pilihan Ganda</label>
        <div className="space-y-2">
          {choices.map((choice, index) => (
            <div key={index} className="flex gap-2">
              <span className="btn btn-sm btn-circle btn-ghost no-animation">
                {String.fromCharCode(97 + index)}.
              </span>
              <input
                type="text"
                className="input input-sm input-bordered flex-1"
                placeholder={`Pilihan ${index + 1}`}
                value={choice}
                onChange={(e) => updateChoice(index, e.target.value)}
                required
              />
              {choices.length > 1 && (
                <button type="button" onClick={() => removeChoice(index)} className="btn btn-sm btn-error btn-ghost">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
        <button type="button" onClick={addChoice} className="btn btn-sm btn-outline btn-primary mt-3 gap-2">
          <Plus size={14} /> Tambah Pilihan
        </button>
      </div>

      <div className="modal-action">
        <button type="submit" className="btn btn-primary btn-sm">Simpan Pertanyaan</button>
      </div>
    </form>
  );
}