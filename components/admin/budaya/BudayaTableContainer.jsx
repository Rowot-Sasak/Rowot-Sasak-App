'use client';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import Table from '../../ui/table';
import Modal from '../../ui/modal';
import Toast from '../../ui/toast';
import DeleteModal from '../../ui/deleteModal';
import BudayaForm from './BudayaForm';
import { useBudaya } from '../../../hooks/useBudaya';

const COLUMNS = [
  { label: "Informasi Budaya", accessor: "judul" },
  { label: "Deskripsi Detail", accessor: "isi" },
  { label: "Deskripsi Preview", accessor: "deskripsi" },
];

export const BudayaTableContainer = () => {
  const { data, loading, notification, setNotification, removeBudaya, currentPage, totalPages, setCurrentPage, addBudaya } = useBudaya(1, 5);
  const [selectedData, setSelectedData] = useState(null);

  const openModal = (item = null) => {
    setSelectedData(item);
    document.getElementById('modal_budaya').showModal();
  };

  const openDeleteModal = (item = null) => {
    setSelectedData(item);
    document.getElementById('delete_budaya_modal').showModal();
  };

  return (
    <div className="relative">
      {notification && (
        <Toast
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="card bg-base-100 shadow-md border border-base-200 overflow-hidden">
        <div className="p-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 border-b border-base-200 bg-base-50/50">
          <label className="input input-bordered input-sm flex items-center gap-2 bg-base-100 w-full sm:max-w-xs">
            <input type="search" className="grow" placeholder="Cari data..." />
          </label>

          <button className="btn btn-primary btn-sm gap-2 text-white" onClick={() => openModal()}>
            <Plus size={18} /> Tambah Budaya
          </button>
        </div>

        <div className="overflow-x-auto">
          <Table
            columns={COLUMNS}
            data={data}
            onDelete={(item) => openDeleteModal(item)}
            onEdit={(item) => openModal(item)}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        <Modal id="modal_budaya" title={selectedData ? "Edit Budaya" : "Tambah Budaya"}>
          <BudayaForm
            initialData={selectedData}
            onSubmit={addBudaya}
            loading={false}
          />
        </Modal>

        <DeleteModal
          id="delete_budaya_modal"
          title="Hapus Budaya"
          itemName={selectedData?.judul}
          onConfirm={() => removeBudaya(selectedData?._id)}
        />
      </div>
    </div>
  );
};