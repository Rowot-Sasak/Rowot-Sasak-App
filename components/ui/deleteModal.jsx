"use client";

export default function DeleteModal({ id, title, onConfirm, itemName }) {
  return (
    <dialog id={id} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box border-error">
        <div className="flex items-center gap-3 text-error">
          <div className="bg-error/10 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 className="font-bold text-lg">{title || "Konfirmasi Hapus"}</h3>
        </div>
        
        <p className="py-4 text-sm opacity-80">
          Apakah Anda yakin ingin menghapus <strong>{itemName || "data ini"}</strong>? 
          Data yang sudah dihapus tidak dapat dikembalikan.
        </p>

        <div className="modal-action">
          <form method="dialog">
            <button className="btn btn-ghost btn-sm">Batal</button>
          </form>
          <button 
            className="btn btn-error btn-sm text-white px-6" 
            onClick={() => {
              onConfirm();
              document.getElementById(id).close();
            }}
          >
            Ya, Hapus
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}