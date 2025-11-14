"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

// Import jsPDF en mode dynamic pour éviter l'erreur "unknown"
const jsPDF = dynamic(() => import("jspdf").then((mod) => mod.jsPDF), {
  ssr: false,
});

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("requests");

  return (
    <main className="min-h-screen bg-white text-black">
      {/* NAVBAR */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-xl bg-white/60 border-b border-black/10 shadow-sm">
        <nav className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="font-semibold text-lg">Admin Panel Hospital</h1>
          <div className="space-x-6 hidden md:flex">
            <a href="/" className="hover:opacity-70">Home</a>
            <a href="/dashboard_hospital" className="hover:opacity-70">Dashboard</a>
          </div>
        </nav>
      </header>

      {/* CONTENT */}
      <div className="pt-28 max-w-6xl mx-auto px-6">

        {/* ---- TABS ---- */}
        <div className="flex gap-4 mb-10">
          <button
            onClick={() => setActiveTab("requests")}
            className={`px-6 py-3 rounded-lg border ${activeTab === "requests" ? "bg-black text-white" : "bg-neutral-100"}`}
          >
            Requests
          </button>

          <button
            onClick={() => setActiveTab("quotes")}
            className={`px-6 py-3 rounded-lg border ${activeTab === "quotes" ? "bg-black text-white" : "bg-neutral-100"}`}
          >
            Devis
          </button>

          <button
            onClick={() => setActiveTab("comm")}
            className={`px-6 py-3 rounded-lg border ${activeTab === "comm" ? "bg-black text-white" : "bg-neutral-100"}`}
          >
            Commercial
          </button>
        </div>

        {/* ------------------ ONGLET REQUESTS ------------------ */}
        {activeTab === "requests" && (
          <div className="p-6 bg-neutral-50 rounded-2xl shadow">
            <h2 className="text-2xl font-semibold mb-4">Requests</h2>
            <p className="opacity-70"> les demandes envoyées via le formulaire.</p>
          </div>
        )}

        {/* ------------------ ONGLET DEVIS ------------------ */}
        {activeTab === "quotes" && (
          <div className="p-6 bg-neutral-50 rounded-2xl shadow">
            <h2 className="text-2xl font-semibold mb-4">Créer un devis</h2>

            <form id="quoteForm" className="grid md:grid-cols-2 gap-6">
              <input name="name" type="text" placeholder="Nom du patient" className="p-3 rounded-lg border border-black/20" />
              <input name="phone" type="text" placeholder="Téléphone" className="p-3 rounded-lg border border-black/20" />
              <input name="email" type="email" placeholder="Email" className="p-3 rounded-lg border border-black/20" />
              <input name="service" type="text" placeholder="Service demandé" className="p-3 rounded-lg border border-black/20" />
              <textarea name="details" placeholder="Détails du devis" rows={4} className="p-3 rounded-lg border border-black/20 md:col-span-2"></textarea>
            </form>

            <button
              onClick={generateQuotePDF}
              className="mt-6 bg-black text-white hover:bg-neutral-800 px-6 py-3 rounded-lg"
            >
              Générer PDF
            </button>
          </div>
        )}

        {/* ------------------ ONGLET COMMERCIALE ------------------ */}
        {activeTab === "comm" && (
          <div className="p-6 bg-neutral-50 rounded-2xl shadow">
            <h2 className="text-2xl font-semibold mb-4">Espace Commercial</h2>
            <p className="opacity-70">
               devis envoyés, relances, factures, notes commerciales, etc.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

/* --------------------------
   FUNCTION : GENERATE PDF
----------------------------*/
async function generateQuotePDF() {
  const form = document.getElementById("quoteForm");

  if (!form) return alert("Erreur : formulaire introuvable");

  const jsPDFModule = await import("jspdf");
  const doc = new jsPDFModule.jsPDF();

  const name = form.querySelector("input[name='name']").value;
  const phone = form.querySelector("input[name='phone']").value;
  const email = form.querySelector("input[name='email']").value;
  const service = form.querySelector("input[name='service']").value;
  const details = form.querySelector("textarea[name='details']").value;

  doc.setFontSize(18);
  doc.text("Devis Hospital", 20, 20);

  doc.setFontSize(12);
  doc.text(`Nom du patient: ${name}`, 20, 40);
  doc.text(`Téléphone: ${phone}`, 20, 50);
  doc.text(`Email: ${email}`, 20, 60);
  doc.text(`Service demandé: ${service}`, 20, 70);

  doc.text("Détails :", 20, 85);
  doc.text(details || "Aucun détail fourni.", 20, 95, { maxWidth: 170 });

  doc.save(`Devis-${name || "patient"}.pdf`);
}
