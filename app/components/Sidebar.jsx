"use client";

export default function Sidebar({ isOpen, setIsOpen }) {
  return (
    <>
      {/* Overlay (clic pour fermer) */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        ></div>
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 
        transform transition-transform duration-300 
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Menu</h2>
        </div>

        <nav className="p-6 space-y-4">
          <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100">
            Service 1
          </button>

          <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100">
            Service 2
          </button>

          <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100">
            Autre section
          </button>
        </nav>
      </aside>
    </>
  );
}
