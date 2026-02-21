'use client';
import { useState, useEffect } from 'react';

export default function EventForm({ initialData, onSubmit, loading }) {
  const [uploadMode, setUploadMode] = useState('upload');
  const [formData, setFormData] = useState({ judul: '', lokasi: '', isi: '', time: '', imagelink: '' });
  const [preview, setPreview] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    if (initialData) {
      const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toISOString().split('T')[0];
      };

      setFormData({
        judul: initialData.judul || '',
        lokasi: initialData.lokasi || '',
        isi: initialData.isi || '',
        time: formatDate(initialData.time || initialData.createdAt),
        imagelink: initialData.imagelink || ''
      });
      setPreview(initialData.imagelink || initialData.imageLink || '');
      if (initialData.imagelink) setUploadMode('link');
    }
  }, [initialData]);

  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    const payload = {
      judul: formData.judul,
      lokasi: formData.lokasi,
      isi: formData.isi,
      time: formData.time,
      imagelink: formData.imagelink
    };

    try {
      await onSubmit(payload, initialData?._id);

      setStatus({ type: 'success', message: '✨ Berhasil disimpan!' });
      setTimeout(() => {
        document.getElementById('modal_event').close();
        setStatus({ type: '', message: '' });
      }, 1500);
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="w-full text-base-content">
      <div className="bg-primary/10 p-3 rounded-lg mb-5 border-l-4 border-primary">
        <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Form Input Event</h4>
        <p className="text-[11px] opacity-70">Pastikan field bertanda bintang (*) diisi dengan benar.</p>
      </div>

      <form onSubmit={handleFormSubmit} className="relative">
        {loading && (
          <div className="absolute inset-0 bg-base-100/70 z-30 flex items-center justify-center backdrop-blur-sm rounded-xl">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        )}

        {status.message && (
          <div className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-error'} mb-4 py-2 text-sm shadow-sm`}>
            <span>{status.message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4">
            <div className="form-control">
              <label className="label-text font-bold text-xs mb-2 block">Metode Gambar</label>
              <div className="join w-full border border-base-300 shadow-sm">
                <button type="button" onClick={() => setUploadMode('upload')} className={`join-item btn btn-xs flex-1 ${uploadMode === 'upload' ? 'btn-primary text-white' : 'btn-ghost'}`}>Upload</button>
                <button type="button" onClick={() => setUploadMode('link')} className={`join-item btn btn-xs flex-1 ${uploadMode === 'link' ? 'btn-primary text-white' : 'btn-ghost'}`}>Link URL</button>
              </div>
            </div>

            <div className="border-2 border-dashed border-base-300 rounded-2xl p-4 bg-base-200/20 flex flex-col items-center justify-center min-h-[200px]">
              {preview ? (
                <div className="relative group w-full">
                  <img src={preview} alt="Preview" className="w-full aspect-video object-cover rounded-xl shadow-md border-2 border-white" />
                  <button type="button" onClick={() => { setPreview(''); setFormData({ ...formData, imagelink: '' }) }} className="absolute -top-2 -right-2 btn btn-circle btn-error btn-xs text-white shadow-lg">✕</button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="bg-base-300 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 opacity-50">🖼️</div>
                  <p className="text-[10px] uppercase font-bold opacity-40">Preview Gambar</p>
                </div>
              )}

              <div className="w-full mt-4">
                {uploadMode === 'upload' ? (
                  <input key="f-in" type="file" accept="image/*" className="file-input file-input-bordered file-input-primary file-input-xs w-full"
                    onChange={async (e) => {
                      const f = e.target.files[0];
                      if (f) { const b64 = await toBase64(f); setPreview(b64); setFormData({ ...formData, imagelink: b64 }); }
                    }}
                  />
                ) : (
                  <input key="u-in" type="url" placeholder="Paste link gambar di sini..." className="input input-bordered input-sm w-full text-xs"
                    value={formData.imagelink ?? ""} onChange={(e) => { setPreview(e.target.value); setFormData({ ...formData, imagelink: e.target.value }) }}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="form-control w-full">
              <label className="label-text font-bold text-xs mb-1">Judul Event <span className="text-error">*</span></label>
              <input className="input input-bordered input-sm w-full focus:input-primary transition-all" placeholder="Nama Event..."
                value={formData.judul ?? ""} onChange={(e) => setFormData({ ...formData, judul: e.target.value })} required
              />
            </div>

            <div className="form-control w-full">
              <label className="label-text font-bold text-xs mb-1">Isi</label>
              <textarea className="textarea textarea-bordered text-xs h-32 w-full focus:textarea-primary" placeholder="Tuliskan detail sejarah dan informasi lengkap..."
                value={formData.isi ?? ""} onChange={(e) => setFormData({ ...formData, isi: e.target.value })} required
              />
            </div>

            <div className="form-control w-full">
              <label className="label-text font-bold text-xs mb-1">Lokasi</label>
              <textarea className="textarea textarea-bordered text-xs h-20 w-full focus:textarea-primary" placeholder="Ringkasan untuk kartu depan..."
                value={formData.lokasi ?? ""} onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })} required
              />
            </div>

            <div className="form-control w-full">
              <label className="label-text font-bold text-xs mb-1">Tanggal</label>
              <input type="date" className="input" value={formData.time ?? ""} onChange={(e) => setFormData({ ...formData, time: e.target.value })} required />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-base-200">
          <button type="button" onClick={() => document.getElementById('modal_event').close()} className="btn btn-ghost btn-sm px-6">Batal</button>
          <button type="submit" disabled={loading} className="btn btn-primary btn-sm px-10 text-white shadow-lg shadow-primary/20">
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </div>
  );
}