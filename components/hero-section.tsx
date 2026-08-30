"use client";

import React from "react";
import { RevealText } from "@/components/reveal-text";
import { AnimatedSphere } from "@/components/animated-sphere";

interface HeroSectionProps {
  portfolio: any;
  heroReady: boolean;
  videoReady?: boolean;
}

export function HeroSection({ portfolio, heroReady }: HeroSectionProps) {
  const isLoaded = !!portfolio?.hero;

  return (
    <section className="relative h-screen min-h-[640px] overflow-hidden bg-paper flex flex-col justify-between">
      {/* Subtle grid lines matching the exact author ratio */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40 z-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute h-px bg-black/[0.08]"
            style={{
              top: `${12.5 * (i + 1)}%`,
              left: 0,
              right: 0,
            }}
          />
        ))}
        {[...Array(12)].map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute w-px bg-black/[0.08]"
            style={{
              left: `${8.33 * (i + 1)}%`,
              top: 0,
              bottom: 0,
            }}
          />
        ))}
      </div>

      {/* Animated sphere background — responsively centered on mobile and right-aligned on desktop */}
      <div
        className="absolute left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-[-10%] md:right-[-5%] lg:right-0 top-1/2 -translate-y-1/2 w-[520px] h-[520px] sm:w-[600px] sm:h-[600px] lg:w-[800px] lg:h-[800px] aspect-square pointer-events-none z-10 flex items-center justify-center transition-opacity duration-1000 select-none opacity-50 sm:opacity-60 md:opacity-80"
        style={{
          opacity: heroReady ? undefined : 0,
        }}
      >
        <AnimatedSphere />
      </div>

      {/* Spacer for fixed top navbar */}
      <div className="h-20 sm:h-24" />

      {/* Main hero content — anchored to bottom left */}
      <div className="relative z-20 flex flex-col px-6 md:px-12 lg:px-20 pb-16 md:pb-20 max-w-4xl">
        {/* Title & Tagline area */}
        <div className="mb-10">
          {isLoaded ? (
            <>
              <RevealText
                key="hero-name"
                as="h1"
                className="text-[45px] sm:text-[54px] md:text-7xl lg:text-8xl font-light text-ink leading-[0.95] tracking-tight"
                style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}
                stagger={60}
                duration={800}
                threshold={0}
              >
                {portfolio.hero.fullName}
              </RevealText>
              <RevealText
                key="hero-tagline"
                as="p"
                className="text-lg sm:text-[22.5px] md:text-[27px] text-ink/60 mt-4 font-light max-w-2xl leading-snug"
                style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}
                stagger={60}
                duration={800}
                delay={200}
                threshold={0}
              >
                {portfolio.hero.tagline}
              </RevealText>
            </>
          ) : (
            <RevealText
              key="hero-loading"
              as="h1"
              className="text-[45px] sm:text-[54px] md:text-7xl lg:text-8xl font-light text-ink/30 leading-[0.95] tracking-tight"
              style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}
              stagger={60}
              duration={800}
              threshold={0}
            >
              {"Loading..."}
            </RevealText>
          )}
        </div>

        {/* CTA Buttons */}
        <div
          className="flex flex-wrap gap-4 items-center"
          style={{
            opacity: heroReady ? 1 : 0,
            filter: heroReady ? "blur(0px)" : "blur(16px)",
            transform: heroReady ? "translateY(0px)" : "translateY(20px)",
            transition:
              "opacity 0.8s cubic-bezier(0.16,1,0.3,1) 120ms, filter 0.8s cubic-bezier(0.16,1,0.3,1) 120ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) 120ms",
          }}
        >
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              const target = document.querySelector("#contact");
              if (target) target.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-8 py-3.5 bg-ink text-paper text-xs rounded-xl hover:bg-ink/85 transition-colors tracking-widest font-semibold font-sans flex items-center justify-center min-w-[140px] shadow-sm"
          >
            HIRE ME!
          </a>
          {portfolio?.hero?.resumeFile ? (
            <a
              href={portfolio.hero.resumeFile}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="px-8 py-3.5 bg-paper/70 border border-ink/10 text-ink text-xs rounded-xl hover:bg-ink/5 hover:border-ink/20 transition-all tracking-widest font-semibold font-sans flex items-center justify-center min-w-[140px] backdrop-blur-md shadow-sm"
            >
              DOWNLOAD CV
            </a>
          ) : (
            <button
              onClick={() =>
                alert(
                  "CV file is not configured in the database yet. Convert your Google Drive link to direct download and set it in hero.resumeFile!",
                )
              }
              className="px-8 py-3.5 bg-paper/70 border border-ink/10 text-ink text-xs rounded-xl hover:bg-ink/5 hover:border-ink/20 transition-all tracking-widest font-semibold font-sans flex items-center justify-center min-w-[140px] backdrop-blur-md shadow-sm"
            >
              DOWNLOAD CV
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
