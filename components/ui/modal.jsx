'use client';

export default function Modal({ id, title, children }) {
  return (
    <dialog id={id} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box bg-base-100 p-0 overflow-hidden border border-base-200 shadow-2xl w-full max-w-lg">
        <div className="bg-base-200/50 px-6 py-4 border-b border-base-200 flex justify-between items-center">
          <h3 className="font-bold text-lg text-primary">{title}</h3>
          <form method="dialog">
             <button className="btn btn-sm btn-circle btn-ghost">✕</button>
          </form>
        </div>
        
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {children}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop bg-black/40 backdrop-blur-sm">
        <button>close</button>
      </form>
    </dialog>
  );
}