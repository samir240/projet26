// app/dashboard/layout.tsx
'use client'; 

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // Importation de useRouter

// -------------------------------------------------------------------
// 1. Types & Icônes
// -------------------------------------------------------------------

interface User {
  id: number;
  email: string;
  nom_role: string;
  system: string;
  name?: string; // Ajouté pour le vrai nom, mais rendu optionnel
}

const MenuIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>);
const CloseIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);

const navItems = [
  { href: "/dashboard1", label: " Dashboard" },
  { href: "/dashboard1/requests", label: " Requests" },
 
  { href: "/dashboard1/Hopitaux", label: " Hopitaux" },
  { href: "/dashboard1/sales-agents", label: " Sales Agents" },
  { href: "/dashboard1/emails", label: " emails" },
  { href: "/dashboard1/procedures", label: " Procedures" },
  { href: "/dashboard1/relances", label: " Relances" },
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

  const userName = user?.name || user?.email.split('@')[0] || "Utilisateur";
  const userRole = user?.nom_role || "Général";
  const initials = userName.charAt(0).toUpperCase();

  return (
    <div className="flex min-h-screen bg-gray-50">
      
      {/* 1. SIDEBAR */}
      <aside 
        className={`
          fixed top-0 left-0 h-screen z-50 bg-gray-800 text-white transition-all duration-300 shadow-xl w-64
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:flex md:flex-col
        `}
      >
        <div className="p-4 text-2xl font-extrabold border-b border-gray-700 h-12 flex items-center justify-center">
          DASHBOARD
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              onClick={handleLinkClick}
              className={`
                block p-3 rounded-lg font-medium transition-colors duration-200 
                ${pathname === item.href 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
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
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 bg-white border-b px-6 shadow-md">
          
          {/* Bouton Toggle Mobile */}
          <button 
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle Sidebar"
          >
            {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
          
          {/* Titre de la page actuelle */}
          <h1 className="hidden md:block text-xl font-semibold text-gray-900">
            {navItems.find(item => item.href === pathname)?.label.split(' ')[1] || "Aperçu"}
          </h1>
          
          {/* Menu Utilisateur (Déconnexion) */}
          {user && (
            <div className="relative z-50">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition"
              >
                {/* Avatar/Initiales de l'utilisateur */}
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                  {initials}
                </div>
                {/* Affichage du Vrai Nom */}
                <span className="text-sm font-medium hidden sm:block text-gray-700">
                  Bonjour, {userName.split(' ')[0]}
                </span>
                <svg className={`w-4 h-4 text-gray-500 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>

              {/* Menu Déroulant */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-xl py-1">
                  <div className="px-4 py-2 text-sm text-gray-500 border-b">
                    Rôle: <span className="font-semibold">{userRole}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    Déconnexion
                  </button>
                </div>
              )}
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