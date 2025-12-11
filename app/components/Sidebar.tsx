// components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';

// Icônes simples (vous pouvez remplacer par des icônes comme Heroicons)
const MenuIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>);
const CloseIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);

export function Sidebar({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Bouton Toggle pour Mobile/Tablet */}
      <button 
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white md:hidden transition-opacity duration-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      {/* Sidebar - Desktop (visible) & Mobile (avec transition) */}
      <aside 
        className={`
          fixed top-0 left-0 h-screen z-40 bg-gray-800 text-white transition-all duration-300
          ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-0'}
          md:translate-x-0 md:w-64 md:flex md:flex-col
        `}
      >
        <div className="p-4 text-2xl font-bold border-b border-gray-700 h-16 flex items-center">
          Next Dashboard Pro
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link 
            href="/dashboard" 
            className="block p-2 rounded hover:bg-gray-700"
            onClick={() => setIsOpen(false)} // Fermer après navigation
          >
            🏠 Accueil
          </Link>
          <Link 
            href="/dashboard/analytics" 
            className="block p-2 rounded hover:bg-gray-700"
            onClick={() => setIsOpen(false)}
          >
            📊 Statistiques
          </Link>
          <Link 
            href="/dashboard/settings" 
            className="block p-2 rounded hover:bg-gray-700"
            onClick={() => setIsOpen(false)}
          >
            ⚙️ Paramètres
          </Link>
        </nav>
      </aside>

      {/* Contenu principal */}
      <div 
        className={`
          flex flex-col flex-1 min-h-screen bg-gray-50 transition-all duration-300
          ${isOpen ? 'md:ml-64 ml-64' : 'md:ml-64 ml-0'}
        `}
      >
        <header className="flex items-center justify-end h-16 bg-white border-b px-6 shadow-sm">
          <div className="text-gray-600">
            Utilisateur Actif
          </div>
        </header>
        
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </>
  );
}