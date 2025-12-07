"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


interface User {
  id: number;
  email: string;
  role: string;
  system: string;
}

export default function DashboardHospital() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"requests" | "quotes" | "comments">("requests");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      setLoading(false);
      router.replace("/login");
      return;
    }

    try {
      const parsed = JSON.parse(storedUser);
      if (!parsed?.email) {
        router.replace("/login");
        return;
      }

      setUser(parsed);
      setLoading(false);
    } catch {
      router.replace("/login");
    }
  }, []);

  if (loading) return <div>Loading...</div>;

  function handleLogout() {
    localStorage.removeItem("user");
    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-gray-50 flex">
     

      {/* CONTENT WRAPPER */}
      <div className="flex-1 ml-0 lg:ml-64">
        
        {/* HEADER */}
        <header className="fixed top-0 right-0 left-0 lg:left-64 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm z-40">
          <nav className="flex justify-between items-center px-6 py-4">
            <h1 className="font-bold text-xl">Dashboard Hospital</h1>

            {user && (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-100 transition"
                >
                  <span>{user.email}</span>
                  <span className="text-gray-500 text-sm">({user.role})</span>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg py-2 z-50">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            )}
          </nav>
        </header>

        {/* MAIN CONTENT */}
        <div className="pt-28 p-6 max-w-6xl mx-auto">

          {/* TABS */}
          <div className="flex gap-3 mb-10">
            {["requests", "quotes", "comments"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-2 rounded-xl border font-medium transition ${
                  activeTab === tab
                    ? "bg-black text-white shadow"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                {tab === "requests" && "Requests"}
                {tab === "quotes" && "Devis"}
                {tab === "comments" && "Comments"}
              </button>
            ))}
          </div>

          {/* CONTENT */}
          {activeTab === "requests" && (
            <section className="p-6 bg-white rounded-2xl shadow">
              <h2 className="text-2xl font-semibold mb-4">Requests</h2>
              <p className="text-gray-600">Afficher les demandes envoyées via le formulaire.</p>
            </section>
          )}

          {activeTab === "quotes" && (
            <section className="p-6 bg-white rounded-2xl shadow">
              <h2 className="text-2xl font-semibold mb-6">Créer un devis</h2>

              <form id="quoteForm" className="grid md:grid-cols-2 gap-6">
                <input name="name" type="text" placeholder="Nom du patient"
                  className="p-3 rounded-lg border border-gray-300 bg-gray-50" />

                <input name="phone" type="text" placeholder="Téléphone"
                  className="p-3 rounded-lg border border-gray-300 bg-gray-50" />

                <input name="email" type="email" placeholder="Email"
                  className="p-3 rounded-lg border border-gray-300 bg-gray-50" />

                <input name="service" type="text" placeholder="Service demandé"
                  className="p-3 rounded-lg border border-gray-300 bg-gray-50" />

                <textarea name="details" rows={4} placeholder="Détails du devis"
                  className="p-3 rounded-lg border border-gray-300 bg-gray-50 md:col-span-2"></textarea>
              </form>

              <button
                onClick={generateQuotePDF}
                className="mt-6 bg-black text-white px-6 py-3 rounded-lg hover:bg-neutral-800 transition"
              >
                Générer PDF
              </button>
            </section>
          )}

          {activeTab === "comments" && (
            <section className="p-6 bg-white rounded-2xl shadow">
              <h2 className="text-2xl font-semibold mb-4">Commentaires</h2>
              <p className="text-gray-600">Espace pour gérer les commentaires internes.</p>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------
   GENERATE PDF
-------------------------------------------------------------------- */
async function generateQuotePDF() {
  const form = document.getElementById("quoteForm") as HTMLFormElement;

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
