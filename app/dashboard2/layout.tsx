// app/dashboard/layout.tsx
'use client'; 

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // Importation de useRouter

// -------------------------------------------------------------------
// 1. Types & Icônes
// -------------------------------------------------------------------

interface User {
  id_user?: number;
  id?: number;
  email: string;
  nom_role: string;
  system: string;
  name?: string;
  id_hospital?: number;
  hospital_nom?: string;
}

const MenuIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>);
const CloseIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);

const navItems = [
  { href: "/dashboard2", label: " Dashboard", icon: "📊" },
  { href: "/dashboard2/Inquiries", label: " Inquiries", icon: "📁" },
  { href: "/dashboard2/Messages", label: " Messages", icon: "💬" },
  { href: "/dashboard2/Reviews", label: " Reviews", icon: "⭐" },
  { href: "/dashboard2/Unpaid", label: " Unpaid Commission", icon: "💰" },
  { href: "/dashboard2/Statistics", label: " Statistics", icon: "📈" },
  { href: "/dashboard2/Users", label: " Users", icon: "👥" },
  { href: "/dashboard2/Clinics", label: " Clinics", icon: "🏥" },
  { href: "/dashboard2/Hotels", label: " Hotels", icon: "🏨" },
  { href: "/dashboard2/CaseManagers", label: " Case Managers", icon: "👤" },
  { href: "/dashboard2/Doctors", label: " Doctors", icon: "👨‍⚕️" },
];

// -------------------------------------------------------------------
// 2. Composant Principal
// -------------------------------------------------------------------

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // HOOKS MANQUANTS AJOUTÉS
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Menu déroulant utilisateur
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname(); 

  // -------------------------------------------------------------
  // AUTH CHECK (Logique fournie par l'utilisateur)
  // -------------------------------------------------------------
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      setLoading(false);
      router.replace("/login");
      return;
    }

    try {
      const parsed: User = JSON.parse(storedUser);
      if (!parsed?.email) {
        router.replace("/login");
        return;
      }
      
      setUser(parsed);
      setLoading(false);
    } catch {
      router.replace("/login");
    }
  }, [router]);

  // -------------------------------------------------------------
  // LOGOUT (Logique fournie par l'utilisateur)
  // -------------------------------------------------------------
  function handleLogout() {
    localStorage.removeItem("user");
    router.push("/login");
  }

  const handleLinkClick = () => {
    setIsSidebarOpen(false); // Ferme la sidebar sur mobile
    setIsMenuOpen(false); // Ferme le menu utilisateur
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gray-100 text-xl font-semibold text-gray-700">
      Chargement du Dashboard...
    </div>
  );

  // Si l'utilisateur n'est pas chargé (et non en loading), cela signifie qu'il est redirigé vers /login
  if (!user && !loading) return null;


  // -------------------------------------------------------------
  // RENDER
  // -------------------------------------------------------------

  const userName = user?.nom || user?.prenom || user?.username || user?.email.split('@')[0] || "Utilisateur";
  const userRole = user?.nom_role || "Général";
  const initials = userName.charAt(0).toUpperCase();

  return (
    <div className="flex min-h-screen bg-gray-50">
      
      {/* 1. SIDEBAR */}
      <aside 
        className={`
          fixed top-0 left-0 h-screen z-50 bg-green-800 text-white transition-all duration-300 shadow-xl w-64
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:flex md:flex-col
        `}
      >
        <div className="p-4 text-lg font-extrabold border-b border-green-700 h-16 flex items-center">
          <div className="text-xs text-green-200">nom de platforme et logo</div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              onClick={handleLinkClick}
              className={`
                flex items-center gap-2 p-3 rounded-lg font-medium transition-colors duration-200 
                ${pathname === item.href 
                  ? 'bg-green-700 text-white shadow-md' 
                  : 'text-green-100 hover:bg-green-700/50 hover:text-white'}
              `}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* 2. CONTENU PRINCIPAL & HEADER */}
      <div 
        className={`
          flex flex-col flex-1 transition-all duration-300 
          md:ml-64 
          relative
        `}
      >
        
        {/* HEADER */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 bg-green-700 text-white px-6 shadow-md">
          
          {/* Bouton Toggle Mobile */}
          <button 
            className="md:hidden p-2 rounded-md text-white hover:bg-green-600 transition-colors"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle Sidebar"
          >
            {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
          
          {/* Titre Welcome + Nom Hôpital */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">Welcome</span>
            {user?.hospital_nom ? (
              <span className="text-lg font-medium text-green-100">
                {user.hospital_nom}
              </span>
            ) : user?.nom || user?.prenom ? (
              <span className="text-lg font-medium text-green-100">
                {[user.nom, user.prenom].filter(Boolean).join(' ')}
              </span>
            ) : (
              <span className="text-lg font-medium text-green-100">
                {user?.username || user?.email.split('@')[0] || 'Utilisateur'}
              </span>
            )}
          </div>
          
          {/* Menu Utilisateur (Déconnexion) */}
          {user && (
            <div className="flex items-center gap-4">
              {/* Icônes */}
              <button className="p-2 text-white hover:bg-green-600 rounded-lg transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
              <button className="p-2 text-white hover:bg-green-600 rounded-lg transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              <button className="p-2 text-white hover:bg-green-600 rounded-lg transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <div className="relative z-50">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-green-600 transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </button>

                {/* Menu Déroulant */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-xl py-1">
                    <div className="px-4 py-2 text-sm text-gray-500 border-b">
                      Rôle: <span className="font-semibold">{userRole}</span>
                    </div>
                    {user.hospital_nom && (
                      <div className="px-4 py-2 text-sm text-gray-500 border-b">
                        Hôpital: <span className="font-semibold">{user.hospital_nom}</span>
                      </div>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </header>
        
        {/* MAIN CONTENT AREA */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {children} 
        </main>
      </div>
      
      {/* 3. Overlay Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}