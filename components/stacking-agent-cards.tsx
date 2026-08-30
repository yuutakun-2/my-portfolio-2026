"use client";

import { useEffect, useRef, useState } from "react";

const STICKY_TOP = 80; // matches top: 80px on first card
const STICKY_STEP = 16; // each card stacks 16px lower
const SCALE_STEP = 0.04; // scale reduction per card stacked on top
const OFFSET_STEP = 8; // px pushed down per card stacked on top

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] tracking-widest font-sans text-ink/40 bg-ink/[0.04]">
      {children}
    </span>
  );
}

export function StackingAgentCards({ projects = [] }: { projects?: any[] }) {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  // depth[i] = 0..N how many cards are currently stacked on top of card i
  const [depth, setDepth] = useState<number[]>(projects.map(() => 0));

  useEffect(() => {
    function onScroll() {
      const nextDepth = projects.map((_, i) => {
        // Count how many cards j > i are currently in sticky position (i.e. have scrolled past card i)
        let count = 0;
        for (let j = i + 1; j < projects.length; j++) {
          const el = cardRefs.current[j];
          if (!el) continue;
          const rect = el.getBoundingClientRect();
          const stickyTopJ = STICKY_TOP + j * STICKY_STEP;
          // Card j is "on top of" card i when it has reached its sticky position
          if (rect.top <= stickyTopJ + 2) count++;
        }
        return count;
      });
      setDepth(nextDepth);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [projects]);

  return (
    <div
      className="flex flex-col"
      style={{ perspective: "1400px", perspectiveOrigin: "50% 0%" }}
    >
      {projects.map((project, i) => {
        const d = depth[i] || 0;
        const scale = 1 - d * SCALE_STEP;
        const translateY = d * OFFSET_STEP;

        return (
          <div
            key={project.id || i}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="sticky mb-4"
            style={{ top: `${STICKY_TOP + i * STICKY_STEP}px`, zIndex: 10 + i }}
          >
            <div
              style={{
                transform: `scale(${scale}) translateY(${translateY}px)`,
                transformOrigin: "top center",
                transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1)",
                willChange: "transform",
              }}
            >
              <div className="group relative bg-paper rounded-2xl border border-ink/[0.07] overflow-hidden cursor-pointer">
                {/* ── MOBILE: image top, fades out at bottom ── */}
                {project.image && (
                  <div className="relative w-full h-52 pointer-events-none md:hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="absolute inset-0 w-full h-full object-cover object-center"
                      style={{
                        maskImage:
                          "linear-gradient(to bottom, black 0%, black 35%, transparent 85%)",
                        WebkitMaskImage:
                          "linear-gradient(to bottom, black 0%, black 35%, transparent 85%)",
                      }}
                    />
                  </div>
                )}

                {/* ── DESKTOP: image right, fades out at left (absolute) ── */}
                {project.image && (
                  <div className="hidden md:block absolute inset-y-0 right-0 w-1/2 pointer-events-none">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover object-center"
                    />
                    <div
                      className="absolute inset-0 bg-paper"
                      style={{
                        background:
                          "linear-gradient(to right, var(--paper) 0%, transparent 55%)",
                      }}
                    />
                  </div>
                )}

                {/* Text content */}
                <div
                  className="relative z-10 p-8"
                  style={{ maxWidth: project.image ? undefined : "100%" }}
                  // On desktop limit to left 60% so text doesn't overlap image
                >
                  <div className="md:max-w-[calc(50%-2rem)] md:pr-8">
                    <div className="flex items-start justify-start mb-6 gap-2 flex-wrap">
                      {(project.categories || []).map((cat: string) => (
                        <Tag key={cat}>{cat}</Tag>
                      ))}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{project.title}</h3>
                    {(project.startDate || project.endDate) && (
                      <p className="text-xs text-ink/40 tracking-widest uppercase mb-3">
                        {project.startDate}
                        {project.startDate && project.endDate ? " — " : ""}
                        {project.endDate ?? "Present"}
                      </p>
                    )}
                    <p className="text-base text-ink/45 leading-relaxed mb-8">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex gap-8 pt-6">
                    {project.liveUrl && (
                      <div>
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-light hover:underline"
                        >
                          Live Project ↗
                        </a>
                      </div>
                    )}
                    {project.repositoryUrl && (
                      <div>
                        <a
                          href={project.repositoryUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-light hover:underline"
                        >
                          Source Code ↗
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
