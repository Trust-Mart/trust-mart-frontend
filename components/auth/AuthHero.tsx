"use client";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";

const AuthHero = () => {
  const renderTitle = (title: string) => {
    const needle = " powered ";
    const index = title.toLowerCase().indexOf(needle);
    if (index === -1) return title;
    const before = title.slice(0, index).trimEnd();
    const after = title.slice(index + needle.length);
    return (
      <>
        {before} <span className="block">Powered {after}</span>
      </>
    );
  };

  const slides = useMemo(
    () => [
      {
        title: "Blockchain & AI Powered Social Commerce",
        subtitle: "Harness blockchain technology and AI for secure trades",
        image: "/images/Img1.jpg",
      },
      {
        title: "AI Vetting & Reputation System",
        subtitle: "Detects fake accounts and builds seller trust scores.",
        image: "/images/Img2.png",
      },
      {
        title: "Secure Payments",
        subtitle:
          "Blockchain escrow keeps funds safe until delivery is confirmed.",
        image: "/images/Img1.jpg",
      },

      {
        title: "Disputes, Discovery, and Help",
        subtitle:
          "AI-assisted resolution, personalized feeds, and a friendly chatbot to guide you.",
        image: "/images/Img1.jpg",
      },
    ],
    []
  );

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(intervalId);
  }, [slides.length]);

  return (
    <div className="w-1/2 h-full rounded-4xl overflow-hidden  relative">
      {/* Images stack */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <Image
            key={index}
            src={slide.image}
            alt={slide.title}
            fill
            className={`object-cover absolute inset-0 transition-opacity duration-700 ease-out ${
              index === activeIndex ? "opacity-100" : "opacity-0"
            }`}
            priority={index === 0}
          />
        ))}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-grey-900/70 to-[#000000] z-10"></div>

      {/* Text and indicators */}
      <div className="z-20 h-full w-full flex flex-col justify-end absolute text-white p-10">
        <div className="flex flex-col gap-1 mb-12">
          <h1 className="text-[34px] font-extrabold tracking-tight text-white">
            {renderTitle(slides[activeIndex].title)}
          </h1>
          <p className="text text-grey-500 w-[80%]">
            {slides[activeIndex].subtitle}
          </p>
        </div>
        <div className="flex gap-1 items-center">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`${
                index === activeIndex
                  ? "w-[70px] bg-white"
                  : "w-[40px] bg-grey-500"
              } h-[5px] rounded-full transition-all duration-300`}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthHero;
