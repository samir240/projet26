import Image from "next/image";
import show1 from "@/app/assets/images/1600680044172.jpg";
import show2 from "@/app/assets/images/1693461422600.png";
import show3 from "@/app/assets/images/1617255241662.jpg";

export default function Showcase() {
  return (
    <section id="showcase" className="py-32">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-semibold mb-10">Showcase</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[show1, show2, show3].map((img, i) => (
            <div
              key={i}
              className="rounded-3xl overflow-hidden shadow-lg hover:scale-105 transition"
            >
              <Image
                src={img}
                alt={`Showcase image ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
