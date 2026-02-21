import { Plus } from 'lucide-react';
import { EventTableContainer } from "../../../components/admin/event/EventTableContainer";

export default function EventaPage() {
  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center bg-base-100 p-4 rounded-lg shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-primary">Manajemen Event</h1>
          <p className="text-sm text-gray-500">Kelola konten event lokal kamu di sini.</p>
        </div>
      </div>

      <EventTableContainer />
    </div>
  );
}