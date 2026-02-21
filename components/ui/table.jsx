"use client";
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Table({ 
  columns, 
  data, 
  onDelete, 
  onEdit,
  currentPage = 1,
  totalPages = 1,
  onPageChange 
}) {
  return (
    <div className="card bg-base-100 shadow-sm border border-base-200">
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th key={index} className={col.className || ""}>
                  {col.label}
                </th>
              ))}
              <th className="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((item, idx) => (
                <tr key={item._id || idx} className="hover">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx}>
                      {renderCell(item, col)}
                    </td>
                  ))}
                  
                  <th className="text-center">
                    <div className="flex justify-center gap-2">
                      <button className="btn btn-ghost btn-xs text-info" onClick={() => onEdit(item)}>Edit</button>
                      <button className="btn btn-ghost btn-xs text-error" onClick={() => onDelete(item)}>Hapus</button>
                    </div>
                  </th>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="text-center py-10 opacity-50">
                  Tidak ada data tersedia.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-base-200 flex justify-between items-center bg-base-50/50">
        <span className="text-sm opacity-70">
          Halaman <span className="font-semibold">{currentPage}</span> dari <span className="font-semibold">{totalPages}</span>
        </span>
        <div className="join border border-base-300">
          <button 
            className="join-item btn btn-sm btn-ghost"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <ChevronLeft size={16} />
          </button>
          <button className="join-item btn btn-sm btn-active">{currentPage}</button>
          <button 
            className="join-item btn btn-sm btn-ghost"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}


function renderCell(item, col) {
  const value = item[col.accessor];

  if (col.accessor === "judul") {
    return (
      <div className="flex items-center gap-4">
        <div className="avatar">
          <div className="mask mask-squircle h-12 w-12">
            <img
              src={item.imagelink || "https://via.placeholder.com/150"}
              alt={value}
            />
          </div>
        </div>
        <div className="font-bold">{value}</div>
      </div>
    );
  }

  if (col.accessor === "createdAt") {
    return value ? new Date(value).toLocaleDateString("id-ID") : "-";
  }

  return (
    <div className="max-w-xs truncate">
      {value || "-"}
    </div>
  );
}