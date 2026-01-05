"use client";
import { useEffect, useState } from "react";
import { Brand } from "@/src/types";
import Image from "next/image";

function BrandsCarousel() {
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    const fetchBrands = async () => {
      const res = await fetch("/api/brands");
      const data = await res.json();
      setBrands(data.brands);
    };
    fetchBrands();
  }, []);

  if (!brands.length) return null;

  return (
    <section className="py-12 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <h2 className="text-3xl font-bold text-center pb-4">Marcas Destacadas</h2>

        <div className="relative">
          <div className="flex animate-scroll">
            {[...brands, ...brands].map((brand, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-48 h-24 mx-8 flex items-center justify-center grayscale hover:grayscale-0 transition duration-300"
              >
                <Image
                  src={"/brandsImages/" + brand.logoUrl}
                  alt={brand.name}
                  width={150}
                  height={60}
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>


        <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
      </div>
    </section>
  );
}

export default BrandsCarousel;
