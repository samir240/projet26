import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import Features from "./sections/Features";
import Showcase from "./sections/Showcase";
import Footer from "./sections/Footer";
import Request from "./sections/Request";


export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">
      <Navbar />
      <Hero />
      <Features />
      <Showcase />
      <Request />
      <Footer />
    </main>
  );
}
