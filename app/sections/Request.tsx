"use client";

import { useEffect, useState } from "react";

export default function Request() {
  const [procedures, setProcedures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProcedure, setSelectedProcedure] = useState(""); // Initialisé à ""

  // --- Champs du formulaire ---
  const [fullname, setFullname] = useState("John Doe");
  const [phone, setPhone] = useState("+213 555 555 555");
  const [email, setEmail] = useState("example@gmail.com");

  useEffect(() => {
    async function loadData() {
      try {
        // Utilisez fetch pour charger les procédures
        const res = await fetch("https://lepetitchaletoran.com/api/get_procedures.php");
        const data = await res.text();

        // Nettoyage et parsing du JSON (comme vous le faites déjà)
        const cleanJSON = data.substring(data.indexOf("{"));
        const parsed = JSON.parse(cleanJSON);

        setProcedures(parsed.data || []);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // --- SUBMIT FORM / create_request ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🛑 CORRECTION 1 : VALIDATION CÔTÉ CLIENT POUR selectedProcedure
    if (!selectedProcedure || selectedProcedure === "") {
      alert("Please select a medical procedure before sending the request.");
      return; // Arrête la soumission
    }

    try {
      const res = await fetch("/api/send_request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Le nom de la clé ici doit correspondre à ce que votre API backend attend,
          // vous avez dit que votre API attendait 'id_procedure', mais votre front-end
          // envoie 'procedure'. Assurons-nous d'envoyer la bonne clé. 
          // SI L'API ATTEND 'id_procedure', IL FAUT CHANGER LA LIGNE CI-DESSOUS :
          id_procedure: selectedProcedure, // Si votre API attend id_procedure
          // Vous aviez : procedure: selectedProcedure,
          fullname,
          phone,
          email,
        }),
      });

      const text = await res.text();
      console.log("RAW RESPONSE:", text);

      const json = JSON.parse(text);

      // 🛑 CORRECTION 2 : VÉRIFIER LE SUCCÈS À L'INTÉRIEUR DE 'data'
      const apiResponse = json.data;

      if (apiResponse && apiResponse.success) {
        alert("Request sent successfully!");
        // Optionnel : Réinitialiser le formulaire
        setSelectedProcedure("");
        // setFullname(""); ...
      } else if (apiResponse && apiResponse.message) {
        alert("Error: " + apiResponse.message);
      } else {
        alert("Server error or unknown response structure.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Server error");
    }
  };


return (
<section id="request" className="py-32 bg-neutral-100 text-black">
<div className="max-w-lg mx-auto px-6 p-8 bg-white rounded-3xl shadow-xl">

<h2 className="text-3xl font-semibold mb-6 text-center">
Request a Medical Procedure
</h2>

 <form className="space-y-5" onSubmit={handleSubmit}>

{/* --- SELECT PROCEDURE --- */}
<div>
<label className="block mb-2 opacity-70">
Select a procedure
</label>

{loading ? (
<p>Loading procedures...</p>
 ) : (
<select
// La valeur est bien liée à selectedProcedure
value={selectedProcedure}
onChange={(e) => setSelectedProcedure(e.target.value)}
className="w-full p-3 rounded-xl border border-neutral-300 focus:outline-none"
>
{/* L'option par défaut a une valeur vide, ce qui nécessite une validation */}
<option value="">Choose a procedure...</option> 

{procedures.map((p) => (
<option key={p.id_procedure} value={p.id_procedure}>
{p.nom_procedure}
</option>
))}
</select>
)}
 </div>

{/* name */}
<div>
<label className="block mb-2 opacity-70">Nom et prénom</label>
<input
type="text"
value={fullname}
onChange={(e) => setFullname(e.target.value)}
className="w-full p-3 rounded-xl border border-neutral-300"
/>
</div>

{/* phone */}
<div>
<label className="block mb-2 opacity-70">Phone</label>
<input
type="text"
value={phone}
onChange={(e) => setPhone(e.target.value)}
className="w-full p-3 rounded-xl border border-neutral-300"
 />
</div>

{/* email */}
<div>
<label className="block mb-2 opacity-70">Email</label>
 <input
 type="email"
value={email}
 onChange={(e) => setEmail(e.target.value)}
 className="w-full p-3 rounded-xl border border-neutral-300"
 />
</div>

<button
type="submit"
className="w-full py-3 bg-black text-white rounded-full"
>
Send Request
</button>
</form>
</div>
</section>
);
}