import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  MessageSquare,
  ClipboardList,
  LogOut,
} from "lucide-react";
import Link from 'next/link'
import { useAuth } from '../../hooks/useAuth';

export default function Sidebar() {
  const { logout } = useAuth();
  return (
    <div className="drawer-side z-50">
      <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
      <ul className="menu p-4 w-72 min-h-full bg-base-100 text-base-content border-r border-base-300">
        <div className="flex items-center gap-4 px-4 py-6 mb-4">
          <div className="bg-primary text-primary-content p-2 rounded-xl">
            <BookOpen size={24} />
          </div>
          <span className="text-xl font-black tracking-tight text-primary">
            ROWOT SASAK
          </span>
        </div>

        <li className="menu-title">Menu Utama</li>
        <li>
          <Link href="/admin/budaya"><BookOpen size={18} />Budaya</Link>
        </li>
        <li>
          <Link href="/admin/event"><Calendar size={18} /> Event</Link>
        </li>
        <li>
          <Link href="/admin/survey"><ClipboardList size={18} /> Surveys</Link>
        </li>
        <div className="mt-auto pt-10 px-4 pb-4">
          <button onClick={logout} className="btn btn-error btn-block gap-2 text-white hover:text-white">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </ul>
    </div>
  );
}
