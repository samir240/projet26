"use client";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all backdrop-blur-xl border-b border-white/10 ${
        scrolled ? "bg-white/40 shadow-lg" : "bg-white/10"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="font-semibold text-lg">Brand</h1>

        <div className="space-x-6 hidden md:flex">
          <a href="/login" className="hover:opacity-70">Login</a>
          <a href="/dashboard_hospital" className="hover:opacity-70">Hospital</a>
          <a href="#" className="hover:opacity-70"></a>
        </div>
      </nav>
    </header>
  );
}
