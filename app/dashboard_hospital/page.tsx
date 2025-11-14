"use client";

import { useState } from "react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"requests" | "quotes" | "comments">("requests");

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

      {/* PAGE CONTENT */}
      <div className="pt-28 max-w-6xl mx-auto px-6">

        {/* TABS */}
        <div className="flex space-x-4 mb-10">
          <button
            onClick={() => setActiveTab("requests")}
            className={`px-5 py-2 rounded-lg border ${
              activeTab === "requests" ? "bg-black text-white" : "bg-white"
            }`}
          >
            Requests
          </button>

          <button
            onClick={() => setActiveTab("quotes")}
            className={`px-5 py-2 rounded-lg border ${
              activeTab === "quotes" ? "bg-black text-white" : "bg-white"
            }`}
          >
            Devis
          </button>

          <button
            onClick={() => setActiveTab("comments")}
            className={`px-5 py-2 rounded-lg border ${
              activeTab === "comments" ? "bg-black text-white" : "bg-white"
            }`}
          >
            Comments
          </button>
        </div>

        {/* --------------------------
              TAB : REQUESTS
        --------------------------- */}
        {activeTab === "requests" && (
          <div className="p-6 bg-neutral-50 rounded-2xl shadow">
            <h2 className="text-2xl font-semibold mb-4">Requests</h2>
            <p className="opacity-70">Ici tu vas afficher les demandes envoyées via le formulaire.</p>
          </div>
        )}

        {/* --------------------------
              TAB : QUOTES (DEVIS)
        --------------------------- */}
        {activeTab === "quotes" && (
          <div className="p-6 bg-neutral-50 rounded-2xl shadow">
            <h2 className="text-2xl font-semibold mb-6">Créer un devis</h2>

            <form id="quoteForm" className="grid md:grid-cols-2 gap-6">
              <input name="name" type="text" placeholder="Nom du patient" className="p-3 rounded-lg border border-black/20" />
              <input name="phone" type="text" placeholder="Téléphone" className="p-3 rounded-lg border border-black/20" />
              <input name="email" type="email" placeholder="Email" className="p-3 rounded-lg border border-black/20" />
              <input name="service" type="text" placeholder="Service demandé" className="p-3 rounded-lg border border-black/20" />

              <textarea
                name="details"
                placeholder="Détails du devis"
                rows={4}
                className="p-3 rounded-lg border border-black/20 md:col-span-2"
              ></textarea>
            </form>

            <button
              onClick={generateQuotePDF}
              className="mt-6 bg-black text-white hover:bg-neutral-800 px-6 py-3 rounded-lg"
            >
              Générer PDF
            </button>
          </div>
        )}

        {/* --------------------------
              TAB : COMMENTS
        --------------------------- */}
        {activeTab === "comments" && (
          <div className="p-6 bg-neutral-50 rounded-2xl shadow">
            <h2 className="text-2xl font-semibold mb-4">Commentaires</h2>
            <p className="opacity-70">Espace pour gérer les commentaires ou notes internes.</p>
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
  const form = document.getElementById("quoteForm") as HTMLFormElement;

  if (!form) return alert("Erreur : formulaire introuvable");

  const name = (form.querySelector("input[name='name']") as HTMLInputElement).value;
  const phone = (form.querySelector("input[name='phone']") as HTMLInputElement).value;
  const email = (form.querySelector("input[name='email']") as HTMLInputElement).value;
  const service = (form.querySelector("input[name='service']") as HTMLInputElement).value;
  const details = (form.querySelector("textarea[name='details']") as HTMLTextAreaElement).value;

  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("📄 Devis Hospitalier", 20, 20);

  doc.setFontSize(12);
  doc.text(`Nom du patient: ${name}`, 20, 40);
  doc.text(`Téléphone: ${phone}`, 20, 50);
  doc.text(`Email: ${email}`, 20, 60);
  doc.text(`Service demandé: ${service}`, 20, 70);

  doc.text("Détails :", 20, 85);
  doc.text(details || "Aucun détail fourni.", 20, 95, { maxWidth: 170 });

  doc.save(`Devis-${name || "patient"}.pdf`);
}
