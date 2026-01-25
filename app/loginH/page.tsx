"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [debug, setDebug] = useState(""); // Pour afficher info debug

 async function handleLogin() {
  setLoading(true);
  setError("");
  setDebug("");

  try {
    const res = await fetch("../api/login-users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const json = await res.json();

    if (res.ok && json.success && json.data && json.data.user) {
      const user = json.data.user;

      // Vérifier que l'utilisateur appartient à un hôpital (system A)
      if (user.system === "A" && !user.id_hospital) {
        setError("Cet utilisateur n'appartient à aucun hôpital");
        return;
      }

      // 🔥 AJOUT OBLIGATOIRE 🔥
      localStorage.setItem("user", JSON.stringify(user));

      // Redirection selon le system
      if (user.system === "B") {
        router.push("/dashboard_admin");
      } else if (user.system === "A") {
        router.push("/dashboard2");
      } else {
        setError("System inconnu pour cet utilisateur");
      }
    } else {
      setError(json.message || `Erreur login (status ${res.status})`);
    }
  } catch (err: any) {
    setError("Erreur de connexion à l'API");
  } finally {
    setLoading(false);
  }
}



  return (
    <div className="min-h-screen flex">
      {/* Formulaire gauche */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 md:px-16 lg:px-24">
        <h1 className="text-3xl font-bold mb-6">Se connecter</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="w-full"
        >
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        {/* Zone debug */}
        {debug && (
          <pre className="mt-4 p-2 bg-gray-100 border rounded w-full text-xs overflow-auto">
            {debug}
          </pre>
        )}
      </div>

      {/* Image droite */}
      <div
        className="hidden md:flex flex-1 bg-cover bg-center"
        style={{ backgroundImage: "url('https://palmmedicalcenters.com/wp-content/uploads/2022/12/iStock-493216309.jpg')" }}
      ></div>
    </div>
  );
}
