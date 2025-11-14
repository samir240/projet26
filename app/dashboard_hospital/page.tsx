// app/dashboard_admin/page.tsx
export default function AdminDashboard() {
  return (
    <main className="min-h-screen bg-white text-black">
      <header className="fixed top-0 w-full z-50 backdrop-blur-xl bg-white/60 border-b border-black/10 shadow-sm">
        <nav className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="font-semibold text-lg">Admin Panel Hospital</h1>
          <div className="space-x-6 hidden md:flex">
            <a href="/" className="hover:opacity-70">Home</a>
            <a href="/dashboard_hospital" className="hover:opacity-70">Dashboard</a>
          </div>
        </nav>
      </header>

      <div className="pt-28 max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-semibold mb-6">Requests</h2>

        <div className="p-6 bg-neutral-50 rounded-2xl shadow">
          <p className="opacity-70">Ici tu vas afficher les demandes envoyées via le formulaire.</p>
        </div>
      </div>
    </main>
  );
}
