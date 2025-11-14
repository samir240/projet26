"use client";
import { useState } from "react";

export default function Request() {
  const [service, setService] = useState("");

  return (
    <section id="request" className="py-32 bg-neutral-100 text-black">
      <div className="max-w-lg mx-auto px-6 p-8 bg-white rounded-3xl shadow-xl">
        <h2 className="text-3xl font-semibold mb-6 text-center">Request a Service</h2>

        <form className="space-y-5">
          <div>
            <label className="block mb-2 opacity-70">Select Service</label>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full p-3 rounded-xl border border-neutral-300 focus:outline-none focus:border-black"
            >
              <option value="">Choose...</option>
              <option value="consultation">Service 1</option>
              <option value="care">Service 2</option>
              <option value="equipment">Service 3</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 opacity-70">Phone</label>
            <input
              type="text"
              className="w-full p-3 rounded-xl border border-neutral-300 focus:outline-none focus:border-black"
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="block mb-2 opacity-70">Email</label>
            <input
              type="email"
              className="w-full p-3 rounded-xl border border-neutral-300 focus:outline-none focus:border-black"
              placeholder="Enter email"
            />
          </div>

          <div>
  <label className="block mb-2 opacity-70">Description / Commentaire</label>
  <textarea
    className="w-full p-3 rounded-xl border border-neutral-300 focus:outline-none focus:border-black h-32 resize-none"
    placeholder="Entrez une description ou un commentaire..."
  ></textarea>
</div>


          <button
            type="submit"
            className="w-full py-3 bg-black text-white rounded-full hover:bg-neutral-800 transition"
          >
            Send Request
          </button>
        </form>
      </div>
    </section>
  );
}
