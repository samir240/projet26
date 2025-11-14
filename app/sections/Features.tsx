export default function Features() {
  return (
    <section id="features" className="py-32 bg-neutral-50 text-black">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-6 bg-white rounded-2xl shadow hover:shadow-xl transition"
          >
            <h3 className="text-xl font-semibold mb-3">Feature {i}</h3>
            <p className="opacity-70">
              Short description of why this feature is amazing.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
