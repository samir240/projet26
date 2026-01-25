'use client';

import React, { useState, useEffect } from 'react';

interface User {
  id_user?: number;
  email: string;
  nom_role?: string;
  system?: string;
  nom?: string;
  prenom?: string;
  username?: string;
  id_hospital?: number;
  hospital_nom?: string;
}

export default function DashboardHomePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
      } catch (e) {
        console.error("Error parsing user:", e);
      }
    }
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Bienvenue sur votre tableau de bord</p>
      </div>

      {/* Informations utilisateur */}
      {user && (
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Informations de connexion</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Email</p>
              <p className="font-semibold text-gray-900">{user.email}</p>
            </div>
            {user.nom_role && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Rôle</p>
                <p className="font-semibold text-gray-900">{user.nom_role}</p>
              </div>
            )}
            {user.hospital_nom && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Hôpital</p>
                <p className="font-semibold text-green-600">
                  {user.hospital_nom}
                  {user.id_hospital && (
                    <span className="ml-2 text-sm text-gray-500 font-normal">
                      (ID: {user.id_hospital})
                    </span>
                  )}
                </p>
              </div>
            )}
            {user.id_hospital && !user.hospital_nom && (
              <div>
                <p className="text-sm text-gray-500 mb-1">ID Hôpital</p>
                <p className="font-semibold text-gray-900">{user.id_hospital}</p>
              </div>
            )}
            {(user.nom || user.prenom) && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Nom complet</p>
                <p className="font-semibold text-gray-900">
                  {[user.nom, user.prenom].filter(Boolean).join(' ') || user.username}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Inquiries</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📁</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Messages</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💬</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Reviews</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⭐</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}