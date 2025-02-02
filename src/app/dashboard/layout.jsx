"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { TaskProvider } from "@/context/TasksContext";
import { ProjectsProvider } from "@/context/ProjectsContext";
import Cookies from "js-cookie";

function DashboardLayout({ children }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {logout} = useAuth();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = Cookies.get('token');
    setUser(JSON.parse(localStorage.getItem('user')));
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const onLogout = () => {
    logout();
    router.push("/login");
  };

  return (

        <div className="flex h-screen bg-gray-100">
          <div className={`w-64 bg-white shadow-md p-5 space-y-6 ${sidebarOpen ? "block" : "hidden"} md:block`}>
            <h1 className="text-2xl font-bold text-gray-700">Dashboard</h1>
            <nav>
              <ul className="space-y-3">
                <li>
                  <Link href="/dashboard/projects" className="block p-3 text-gray-700 rounded hover:bg-gray-200">
                    📂 Proyectos
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/teams" className="block p-3 text-gray-700 rounded hover:bg-gray-200">
                    👥 Equipos
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div className="flex-1 flex flex-col">
            <header className="bg-white shadow p-4 flex justify-between items-center">
              <button className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-semibold">Bienvenido {user?.name}</h2>
              <button onClick={onLogout} className="text-red-500 hover:text-red-700 flex items-center">
                <LogOut className="w-5 h-5 mr-1" />
                Cerrar Sesión
              </button>
            </header>

            <main className="flex-1 p-6">{children}</main>
          </div>
        </div>


  );
}

export default DashboardLayout;