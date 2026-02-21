import { Plus } from 'lucide-react';
import { BudayaTableContainer } from "../../../components/admin/budaya/BudayaTableContainer";

export default function BudayaPage() {
  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center bg-base-100 p-4 rounded-lg shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-primary">Manajemen Budaya</h1>
          <p className="text-sm text-gray-500">Kelola konten budaya lokal kamu di sini.</p>
        </div>
      </div>

      <BudayaTableContainer />
    </div>
  );
}