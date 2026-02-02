"use client";

import { useEffect, useState } from "react";

type Procedure = {
  id_procedure: number;
  nom_procedure: string;
};

export default function Request() {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProcedure, setSelectedProcedure] = useState("");

  const [fullname, setFullname] = useState("John Doe");
  const [phone, setPhone] = useState("+213 555 555 555");
  const [email, setEmail] = useState("example@gmail.com");

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("https://pro.medotra.com/api/get_procedures.php");
        const data = await res.text();
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

  // ⚡ Correction du type pour e
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedProcedure) {
      alert("Please select a medical procedure.");
      return;
    }

    try {
      const res = await fetch("/api/send_request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_procedure: selectedProcedure,
          fullname,
          phone,
          email,
        }),
      });

      const text = await res.text();
      console.log("RAW RESPONSE:", text);

      const json = JSON.parse(text);
      const apiResponse = json.data;

      if (apiResponse?.success) {
        alert("Request sent successfully!");
        setSelectedProcedure("");
      } else if (apiResponse?.message) {
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
          <div>
            <label className="block mb-2 opacity-70">Select a procedure</label>
            {loading ? (
              <p>Loading procedures...</p>
            ) : (
              <select
                value={selectedProcedure}
                onChange={(e) => setSelectedProcedure(e.target.value)}
                className="w-full p-3 rounded-xl border border-neutral-300 focus:outline-none"
              >
                <option value="">Choose a procedure...</option>
                {procedures.map((p) => (
                  <option key={p.id_procedure} value={p.id_procedure}>
                    {p.nom_procedure}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block mb-2 opacity-70">Nom et prénom</label>
            <input
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className="w-full p-3 rounded-xl border border-neutral-300"
            />
          </div>

          <div>
            <label className="block mb-2 opacity-70">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 rounded-xl border border-neutral-300"
            />
          </div>

          <div>
            <label className="block mb-2 opacity-70">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl border border-neutral-300"
            />
          </div>

          <button type="submit" className="w-full py-3 bg-black text-white rounded-full">
            Send Request
          </button>
        </form>
      </div>
    </section>
  );
}
