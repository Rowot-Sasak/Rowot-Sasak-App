"use client";
import { useState, useEffect } from 'react';

export default function SurveyForm({ initialData, onSubmit }) {
  const [formData, setFormData] = useState({
    nama: '',
    waktu: '',
    deskripsi: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        nama: initialData.nama || '',
        waktu: initialData.waktu ? new Date(initialData.waktu).toISOString().split('T')[0] : '',
        deskripsi: initialData.deskripsi || ''
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-base-content">
      <div className="bg-primary/5 p-3 rounded-lg border-l-4 border-primary mb-4">
        <p className="text-[11px] font-bold uppercase tracking-wider text-primary">Informasi Survey</p>
        <p className="text-[10px] opacity-60">Isi detail survey yang akan disebarkan kepada responden.</p>
      </div>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-bold text-xs">Nama Survey <span className="text-error">*</span></span>
        </label>
        <input
          type="text"
          placeholder="Contoh: Kepuasan Layanan Rowot Sasak"
          className="input input-bordered input-sm w-full focus:input-primary transition-all"
          value={formData.nama}
          onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
          required
        />
      </div>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-bold text-xs">Batas Waktu / Tanggal Pelaksanaan <span className="text-error">*</span></span>
        </label>
        <input
          type="date"
          className="input input-bordered input-sm w-full focus:input-primary transition-all"
          value={formData.waktu}
          onChange={(e) => setFormData({ ...formData, waktu: e.target.value })}
          required
        />
      </div>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-bold text-xs">Deskripsi Singkat</span>
        </label>
        <textarea
          className="textarea textarea-bordered h-24 text-xs focus:textarea-primary transition-all"
          placeholder="Jelaskan tujuan dari survey ini..."
          value={formData.deskripsi}
          onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
        ></textarea>
      </div>

      <div className="modal-action border-t pt-4 mt-6">
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => document.getElementById('modal_survey_form').close()}
        >
          Batal
        </button>
        <button
          type="submit"
          className="btn btn-primary btn-sm px-8 text-white shadow-lg shadow-primary/20"
        >
          {initialData ? 'Perbarui Survey' : 'Simpan Survey'}
        </button>
      </div>
    </form>
  );
}