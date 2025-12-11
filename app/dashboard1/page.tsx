// app/dashboard/page.tsx
export default function DashboardHomePage() {
  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Page d'Accueil du Dashboard</h2>
      <p className="text-gray-600">
        Bienvenue sur votre Dashboard Pro. Cette zone est le contenu principal et est enveloppée par le Header et le Sidebar définis dans layout.tsx.
      </p>
      <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-800">
        💡 **Test de Responsivité :** Réduisez la largeur de votre navigateur. La Sidebar devrait disparaître et être accessible via le bouton Menu dans le Header.
      </div>
    </div>
  );
}