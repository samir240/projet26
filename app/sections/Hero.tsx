export default function Hero() {
  return (
    <section className="h-screen flex flex-col justify-center items-center text-center px-6">
      <h1 className="text-5xl md:text-7xl font-semibold mb-6 leading-tight">
        Inspired by <span className="opacity-70">Apple.</span>
      </h1>

      <p className="text-lg md:text-xl max-w-xl opacity-80">
        Minimalist. Clean. Powerful. Landing page fully built with Next.js & Tailwind.
      </p>

      <button className="mt-8 px-8 py-3 rounded-full bg-black text-white hover:bg-neutral-800 transition">
        Get Started
      </button>
    </section>
  );
}
