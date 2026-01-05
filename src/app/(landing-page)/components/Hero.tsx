"use client";
import { CATEGORIES } from "@/src/types";
import { useEffect, useState } from "react";
import Link from "next/link";

function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = CATEGORIES.map((category) => ({
    desktopImage: category.imagenDesktop,
    mobileImage: category.imagenMobile,
    title: category.name,
    description: `Descubre nuestra colección de ${category.name.toLowerCase()}`,
    ctaPrimary: { text: "Explorar", href: `/` + category.navigationName },
  }));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentData = slides[currentSlide];

  return (
    <section className="relative h-screen overflow-hidden">
      <div className="absolute inset-0 bg-black/40 z-10" />

      <picture className="absolute inset-0 w-full h-full">
        <source media="(max-width: 767px)" srcSet={currentData.mobileImage} />
        <source media="(min-width: 768px)" srcSet={currentData.desktopImage} />
        <img
          src={currentData.desktopImage}
          alt="Hero Background"
          className="w-full h-full object-cover"
        />
      </picture>

      <div className="relative z-20 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-white space-y-6 max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold">{currentData.title}</h1>
            <p className="text-xl text-gray-200">{currentData.description}</p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href={currentData.ctaPrimary.href}
                className="bg-white text-black px-8 py-3 rounded font-medium hover:bg-gray-100 transition inline-block"
              >
                {currentData.ctaPrimary.text}
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${idx === currentSlide ? 'bg-white w-12' : 'bg-white/50 w-2'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default HeroSection;