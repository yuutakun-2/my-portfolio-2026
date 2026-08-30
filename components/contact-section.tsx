"use client";

import React from "react";

interface ContactSectionProps {
  portfolio: any;
}

export function ContactSection({ portfolio }: ContactSectionProps) {
  return (
    <section
      id="contact"
      className="relative py-32 px-6 md:px-12 lg:px-20 border-t border-ink/[0.06] overflow-hidden"
    >
      {/* Glass panels image — anchored to bottom center */}
      <img
        src="/images/footer.png"
        alt=""
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-full object-cover object-bottom pointer-events-none select-none"
        style={{ opacity: 0.85 }}
      />
      {/* Progressive blur from bottom — blends into site bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          maskImage: "linear-gradient(to top, transparent 0%, black 55%)",
          WebkitMaskImage: "linear-gradient(to top, transparent 0%, black 55%)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
        }}
      />
      {/* Colour fade from bottom to site bg (theme-aware) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, var(--background) 0%, color-mix(in srgb, var(--background) 92%, transparent) 18%, color-mix(in srgb, var(--background) 55%, transparent) 35%, transparent 55%)",
        }}
      />
      <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="flex-1 text-center md:text-left max-w-2xl">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.05] mb-6">
            Let's work together.
          </h2>
          <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
            {portfolio?.contact?.email && (
              <a
                href={`mailto:${portfolio.contact.email}`}
                className="px-8 py-3 bg-ink text-paper text-sm rounded-xl hover:bg-ink/85 transition-colors tracking-widest font-medium"
              >
                EMAIL ME
              </a>
            )}
            {portfolio?.contact?.phone && (
              <a
                href={`tel:${portfolio.contact.phone}`}
                className="px-8 py-3 bg-paper border border-ink/10 text-ink text-sm rounded-xl hover:bg-ink/5 transition-colors tracking-widest font-medium"
              >
                CALL ME
              </a>
            )}
          </div>
          {portfolio?.contact?.location && (
            <p className="mt-8 text-sm text-ink/70 tracking-widest uppercase dark:text-white/80">
              Based in {portfolio.contact.location}
            </p>
          )}
        </div>
        <div className="flex-shrink-0 order-first md:order-last">
          <img
            src="/images/my-photo.jpg"
            alt="My photo"
            className="w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 object-cover rounded-2xl shadow-lg border border-ink/10 dark:border-white/10"
          />
        </div>
      </div>
    </section>
  );
}
