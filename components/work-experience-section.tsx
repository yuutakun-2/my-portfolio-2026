"use client";

import React, { useState, useEffect } from "react";
import { RevealText } from "@/components/reveal-text";
import { Tag } from "@/components/tag";

export interface WorkExperienceItem {
  id?: string | number;
  _id?: string;
  company: string;
  role: string;
  location?: string | null;
  startDate?: string | Date | { $date?: string };
  endDate?: string | Date | { $date?: string } | null;
  description?: string;
  responsibilities?: string[];
  tags?: string[];
  current?: boolean;
  icon?: string;
  background?: string;
  image?: string;
  imageUrl?: string;
}

interface WorkExperienceSectionProps {
  portfolio: any;
}

const DEFAULT_COLORS = [
  "#ED5565",
  "#FC6E51",
  "#FFCE54",
  "#2ECC71",
  "#5D9CEC",
  "#A855F7",
];

const DEFAULT_GRADIENTS = [
  "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)",
  "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
  "linear-gradient(135deg, #18181b 0%, #27272a 50%, #3f3f46 100%)",
  "linear-gradient(135deg, #022c22 0%, #064e3b 50%, #047857 100%)",
  "linear-gradient(135deg, #1e1e24 0%, #2d1b4e 50%, #4c1d95 100%)",
  "linear-gradient(135deg, #172554 0%, #1e3a8a 50%, #2563eb 100%)",
];

// Seeded fallback items matching exact MongoDB documents
const SEEDED_EXPERIENCES: WorkExperienceItem[] = [
  {
    company: "Lomtech",
    role: "Frontend Developer",
    location: null,
    startDate: "2024-05-01T00:00:00Z",
    endDate: "2024-11-01T00:00:00Z",
    description:
      "Built responsive web apps with localization and multi-language API support.",
    responsibilities: [
      "Developed responsive web apps with Localization, Metadata, and Multi-Language support for API responses",
      "Collaborated with designers and backend teams to deliver seamless UI/UX following Agile Scrum SDLC",
      "Optimized performance and created reusable, maintainable components for fast load times and cross-browser support",
      "Performed regular code reviews and cleanup with seniors and peers",
      "Conducted testing, debugging, and code reviews to ensure high-quality releases",
    ],
    tags: ["Frontend", "Localization", "Performance", "React"],
    current: false,
    icon: "fas fa-code",
  },
  {
    company: "BioCare Co., Ltd.",
    role: "Product Executive",
    location: null,
    startDate: "2023-07-01T00:00:00Z",
    endDate: "2024-04-01T00:00:00Z",
    description:
      "Drove online sales and improved digital marketing and e-commerce operations.",
    responsibilities: [
      "Drove online sales and growth in the medical device/pharmaceutical industry",
      "Improved digital marketing, sales channel development, and customer experience",
      "Managed e-commerce platform, analytics, and project coordination",
    ],
    tags: ["Product", "E-commerce", "Analytics", "Marketing"],
    current: false,
    icon: "fas fa-chart-line",
  },
  {
    company: "Biota Myanmar",
    role: "Creative Executive",
    location: null,
    startDate: "2023-02-01T00:00:00Z",
    endDate: "2023-07-01T00:00:00Z",
    description: "Led creative digital and offline marketing initiatives.",
    responsibilities: [
      "Created digital and offline marketing strategies for Su Lub Pharmacy branches",
      "Oversaw content management and recruited freelance writers to ensure quality health content",
      "Managed ePDF weekly health digest with news, interviews, and promotional items",
    ],
    tags: ["Marketing", "Content", "Creative"],
    current: false,
    icon: "fas fa-palette",
  },
  {
    company: "BLUEBIRD.techstore",
    role: "Ecomm CEO",
    location: null,
    startDate: "2023-06-01T00:00:00Z",
    endDate: "2024-01-01T00:00:00Z",
    description:
      "Operated an e-commerce store focused on budget-friendly tech products and UX.",
    responsibilities: [
      "Managed e-commerce store strategy and operations",
      "Aligned shop UI/UX with diverse user needs and budgets",
      "Handled product listings, promotions, and customer experience improvements",
    ],
    tags: ["E-commerce", "UX", "Operations"],
    current: false,
    icon: "fas fa-shopping-bag",
  },
  {
    company: "IIP",
    role: "Study guide, Teaching assist",
    location: null,
    startDate: "2023-05-01T00:00:00Z",
    endDate: "2024-05-01T00:00:00Z",
    description:
      "Tutored Cambridge IGCSE students and coordinated with parents and teachers.",
    responsibilities: [
      "Tutored Cambridge IGCSE students focusing on concept clarity and creativity",
      "Monitored attendance and performance and facilitated communication between students, parents, and teachers",
    ],
    tags: ["Teaching", "Tutoring", "Education"],
    current: false,
    icon: "fas fa-graduation-cap",
  },
  {
    company: "Tech Thoughts",
    role: "Tech Blogger",
    location: null,
    startDate: "2021-09-01T00:00:00Z",
    endDate: "2024-09-01T00:00:00Z",
    description:
      "Published technical guides and product reviews focused on user-centered design.",
    responsibilities: [
      "Wrote tech blogs educating users and aligning content with user-centered UI/UX principles",
      "Reviewed and analyzed tech products emphasizing usability and user needs",
    ],
    tags: ["Blog", "Writing", "Tech"],
    current: false,
    icon: "fas fa-newspaper",
  },
];

// Helper to format ISO or BSON dates to friendly display string (e.g., "May 2024")
function formatDate(dateVal: any): string {
  if (!dateVal) return "";
  const raw =
    typeof dateVal === "object" && dateVal?.$date ? dateVal.$date : dateVal;
  try {
    const d = new Date(raw);
    if (isNaN(d.getTime())) return String(raw);
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  } catch {
    return String(raw);
  }
}

export function WorkExperienceSection({
  portfolio,
}: WorkExperienceSectionProps) {
  const rawExperience =
    portfolio?.workExperience ||
    portfolio?.experience ||
    portfolio?.experiences ||
    [];

  const [activeOption, setActiveOption] = useState<number>(0);
  const [modalItem, setModalItem] = useState<WorkExperienceItem | null>(null);

  // Lock scroll when modal is opened and close on Escape key
  useEffect(() => {
    if (modalItem) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalItem(null);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [modalItem]);

  // Use dynamic MongoDB data if available, otherwise use exact seeded placeholders
  const experienceList: WorkExperienceItem[] =
    rawExperience && rawExperience.length > 0
      ? rawExperience
      : SEEDED_EXPERIENCES;

  const handleCardClick = (item: WorkExperienceItem, index: number) => {
    // Unified behavior (works for mouse + touch):
    // - tapping/clicking a non-expanded card expands it
    // - tapping/clicking the expanded card opens the full-detail modal
    if (activeOption !== index) {
      setActiveOption(index);
      return;
    }
    setModalItem(item);
  };

  const handleCardHover = (index: number) => {
    if (activeOption !== index) {
      setActiveOption(index);
    }
  };

  // Support custom background image/URL from MongoDB or fallback to curated gradient
  const getBackgroundStyle = (item: WorkExperienceItem, index: number) => {
    const bgUrl = item.background || item.image || item.imageUrl;
    if (bgUrl) {
      return {
        backgroundImage: `url(${bgUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }
    const gradient = DEFAULT_GRADIENTS[index % DEFAULT_GRADIENTS.length];
    return {
      background: gradient,
    };
  };

  const getItemColor = (index: number) => {
    return DEFAULT_COLORS[index % DEFAULT_COLORS.length];
  };

  // Helper to render icon supporting SVG strings, URLs, FontAwesome classes, or fallback
  const renderCardIcon = (item: WorkExperienceItem, index: number) => {
    const icon = item.icon;
    const color = getItemColor(index);

    if (icon) {
      // 1. If it's raw SVG markup
      if (icon.trim().startsWith("<svg")) {
        return (
          <span
            className="w-5 h-5 flex items-center justify-center fill-current"
            style={{ color }}
            dangerouslySetInnerHTML={{ __html: icon }}
          />
        );
      }

      // 2. If it's an image/svg path or URL
      if (
        icon.startsWith("/") ||
        icon.startsWith("http") ||
        icon.endsWith(".svg") ||
        icon.endsWith(".png")
      ) {
        return (
          <img
            src={icon}
            alt={item.company || "Icon"}
            className="w-5 h-5 object-contain"
          />
        );
      }

      // 3. If it's a FontAwesome class (e.g. "fas fa-code")
      const faClass = icon.startsWith("fa") ? icon : `fas fa-${icon}`;
      return <i className={faClass} style={{ color }} />;
    }

    // Default fallback icon based on index
    const fallbackClasses = [
      "fas fa-code",
      "fas fa-chart-line",
      "fas fa-palette",
      "fas fa-shopping-bag",
      "fas fa-graduation-cap",
      "fas fa-newspaper",
    ];
    return (
      <i
        className={fallbackClasses[index % fallbackClasses.length]}
        style={{ color }}
      />
    );
  };

  const styles = `
    .exp-options-container {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      width: 100%;
    }
    
    .exp-options-wrapper {
      display: flex;
      flex-direction: row;
      align-items: stretch;
      width: 100%;
      height: 440px;
      gap: 12px;
    }
    
    /* Smooth proportional flex transition */
    .exp-option-item {
      position: relative;
      overflow: hidden;
      flex: 1 1 72px;
      min-width: 72px;
      max-width: 96px;
      background-size: cover;
      background-position: center;
      transition: flex 0.6s cubic-bezier(0.16, 1, 0.3, 1),
                  max-width 0.6s cubic-bezier(0.16, 1, 0.3, 1),
                  transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                  border-radius 0.6s cubic-bezier(0.16, 1, 0.3, 1),
                  box-shadow 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      border-radius: 24px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.15);
      user-select: none;
      will-change: flex, max-width, transform;
    }
    
    /* Active card */
    .exp-option-item.active {
      flex: 6 1 0px;
      max-width: 750px;
      border-radius: 32px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.3);
    }

    /* Active card hover scale */
    .exp-option-item.active:hover {
      transform: scale(1.025) !important;
      z-index: 20;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
    }
    
    .exp-option-shadow {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        to top,
        rgba(0, 0, 0, 0.92) 0%,
        rgba(0, 0, 0, 0.6) 45%,
        rgba(0, 0, 0, 0.25) 75%,
        transparent 100%
      );
      transition: 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      pointer-events: none;
    }

    .exp-option-item:not(.active) .exp-option-shadow {
      background: linear-gradient(
        to top,
        rgba(0, 0, 0, 0.85) 0%,
        rgba(0, 0, 0, 0.45) 50%,
        transparent 100%
      );
    }
    
    /* Top badge */
    .exp-option-top-badge {
      position: absolute;
      top: 24px;
      left: 24px;
      right: 24px;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: space-between;
      opacity: 0;
      transform: translateY(-8px);
      transition: opacity 0.25s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      pointer-events: none;
    }
    
    .exp-option-item.active .exp-option-top-badge {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
      transition: opacity 0.45s ease 0.15s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s;
    }
    
    /* Collapsed state: centered icon badge */
    .exp-option-item:not(.active) .exp-option-label {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0;
      padding: 0;
      z-index: 10;
      transition: all 0.55s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .exp-option-item:not(.active) .exp-option-info {
      display: none !important;
    }
    
    /* Active state: left-aligned with text info */
    .exp-option-item.active .exp-option-label {
      position: absolute;
      bottom: 24px;
      left: 24px;
      width: calc(100% - 48px);
      height: auto;
      display: flex;
      align-items: flex-end;
      justify-content: flex-start;
      gap: 14px;
      padding: 0;
      margin: 0;
      transform: none;
      z-index: 10;
      transition: all 0.55s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .exp-option-icon {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      min-width: 44px;
      max-width: 44px;
      height: 44px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(8px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      flex-shrink: 0;
      margin: 0;
    }

    /* Dark theme: flip badge + icon colors */
    :global(.dark) .exp-option-icon,
    .dark .exp-option-icon {
      background-color: rgba(30, 30, 34, 0.95);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    }
    
    /* Text info — delayed so it appears after the card finishes expanding */
    .exp-option-item.active .exp-option-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      color: white;
      min-width: 0;
      flex: 1;
      opacity: 1;
      transform: translateX(0);
      pointer-events: auto;
      transition: opacity 0.4s ease 0.35s, transform 0.45s cubic-bezier(0.16, 1, 0.3, 1) 0.3s;
      overflow: hidden;
      white-space: normal;
    }
    
    .exp-inactive-options {
      display: none;
    }

    /* Hover underline for "Click to view full details" */
    .exp-option-item.active .exp-click-hint {
      color: rgba(255, 255, 255, 0.5);
      transition: color 0.2s ease;
    }
    .exp-option-item.active .exp-click-hint .exp-click-hint-text {
      text-decoration: none;
      transition: text-decoration 0.2s ease, color 0.2s ease;
    }
    .exp-option-item.active:hover .exp-click-hint {
      color: rgba(255, 255, 255, 0.9);
    }
    .exp-option-item.active:hover .exp-click-hint .exp-click-hint-text {
      text-decoration: underline;
      text-underline-offset: 2px;
    }
    
    /* Tablet and Mobile Responsive Styles */
    @media screen and (max-width: 1024px) {
      .exp-options-container {
        padding: 0;
        flex-direction: column;
      }
      
      .exp-options-wrapper {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: auto;
        align-items: center;
        gap: 20px;
      }
      
      .exp-option-item.active {
        display: block;
        width: 100%;
        max-width: 100%;
        min-height: 360px;
        border-radius: 24px;
        flex: none;
      }
      
      .exp-option-item.active .exp-option-label {
        bottom: 20px;
        left: 20px;
        width: calc(100% - 40px);
      }
      
      .exp-option-item:not(.active) {
        display: none;
      }
      
      .exp-inactive-options {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 12px;
        width: 100%;
        padding-top: 4px;
      }
      
      .exp-inactive-option {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-size: cover;
        background-position: center;
        position: relative;
        cursor: pointer;
        overflow: hidden;
        border: 2px solid rgba(0, 0, 0, 0.08);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
      }
      
      .exp-inactive-option::before {
        content: '';
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.35);
        border-radius: 50%;
      }
      
      .exp-inactive-option-inner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        z-index: 1;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
      }
    }
  `;

  return (
    <section
      id="work-experience"
      className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06]"
    >
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
      />

      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-3">
            {/* Spinning ring section icon */}
            <div className="relative h-10 w-10 animate-spin [animation-duration:1.5s]">
              <div className="absolute inset-0 rounded-full border-2 border-muted" />
              <div className="absolute -top-1 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-primary" />
            </div>
            <Tag>WORK EXPERIENCE</Tag>
          </div>
          <RevealText className="text-4xl md:text-5xl font-light tracking-tight leading-[1.05]">
            {"What I have worked on."}
          </RevealText>
        </div>

        <div className="exp-options-container">
          <div className="exp-options-wrapper">
            {experienceList.map((item, index) => {
              const isActive = activeOption === index;
              const mainTitle = item.role || "Experience";
              const startStr = formatDate(item.startDate);
              const endStr = item.current
                ? "Present"
                : item.endDate
                  ? formatDate(item.endDate)
                  : "Present";
              const dateRange = startStr ? `${startStr} – ${endStr}` : "";

              return (
                <div
                  key={item.id || item._id || index}
                  className={`exp-option-item ${isActive ? "active" : ""}`}
                  style={getBackgroundStyle(item, index)}
                  data-cursor-scale={isActive ? "1.5" : undefined}
                  onClick={() => handleCardClick(item, index)}
                  onMouseEnter={() => handleCardHover(index)}
                >
                  <div className="exp-option-shadow" />

                  {/* Active Top Badge Details */}
                  <div className="exp-option-top-badge text-white/80">
                    <span className="font-mono text-xs uppercase tracking-widest px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
                      {item.company}
                      {item.location ? ` • ${item.location}` : ""}
                    </span>
                    {dateRange && (
                      <span className="font-mono text-xs text-white/80 bg-black/35 px-3 py-1 rounded-md backdrop-blur-sm border border-white/10">
                        {dateRange}
                      </span>
                    )}
                  </div>

                  <div className="exp-option-label">
                    <div className="exp-option-icon">
                      {renderCardIcon(item, index)}
                    </div>

                    <div className="exp-option-info">
                      <div className="text-xl md:text-2xl font-light text-white leading-tight font-sans">
                        {mainTitle}
                      </div>
                      <div className="text-xs md:text-sm text-white/80 font-mono mt-1">
                        {item.company} {dateRange ? `• ${dateRange}` : ""}
                      </div>

                      {/* Description for Active Item */}
                      {item.description && (
                        <p className="mt-2.5 text-xs md:text-sm text-white/85 leading-relaxed max-w-xl line-clamp-2">
                          {item.description}
                        </p>
                      )}

                      {/* Tags / Technologies for Active Item */}
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {item.tags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[10px] md:text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-white/15 text-white/90 backdrop-blur-sm border border-white/10"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Click to expand prompt */}
                      <div className="exp-click-hint mt-2 text-[10px] font-mono tracking-wider flex items-center gap-1">
                        <span className="exp-click-hint-text">
                          Click to view full details
                        </span>
                        <span>→</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Mobile / Tablet Inactive Options Selector */}
            <div className="exp-inactive-options">
              {experienceList.map(
                (item, index) =>
                  index !== activeOption && (
                    <div
                      key={item.id || item._id || `inactive-${index}`}
                      className="exp-inactive-option"
                      style={getBackgroundStyle(item, index)}
                      onClick={() => handleCardClick(item, index)}
                      title={`${item.company} - ${item.role}`}
                    >
                      <div className="exp-inactive-option-inner">
                        {renderCardIcon(item, index)}
                      </div>
                    </div>
                  ),
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Full Detail Modal with Blurred Background & Body Scroll Lock */}
      {modalItem && (
        <div
          className="fixed inset-0 z-[99990] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 md:p-6 overflow-y-auto"
          onClick={() => setModalItem(null)}
          style={{ animation: "fadeIn 0.25s ease" }}
        >
          <div
            className="relative w-full max-w-2xl bg-[#141416] border border-white/15 rounded-3xl text-white shadow-2xl overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "linear-gradient(145deg, #18181b 0%, #09090b 100%)",
            }}
          >
            {/* Background image hero banner */}
            <div
              className="w-full h-40 md:h-48 relative"
              style={{
                ...getBackgroundStyle(
                  modalItem,
                  experienceList.findIndex(
                    (e) => e.company === modalItem.company,
                  ),
                ),
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/60 to-transparent" />
            </div>

            <div className="px-6 md:px-8 pb-6 md:pb-8 -mt-12 relative z-10">
              {/* Header with Company & Close Button */}
              <div className="flex items-start justify-between gap-4 pb-6 border-b border-white/10">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-xl flex-shrink-0 backdrop-blur-md">
                    {renderCardIcon(
                      modalItem,
                      experienceList.findIndex(
                        (e) => e.company === modalItem.company,
                      ),
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-light tracking-tight text-white">
                      {modalItem.role}
                    </h3>
                    <div className="text-sm text-white/70 font-mono mt-0.5">
                      {modalItem.company}
                      {modalItem.location ? ` • ${modalItem.location}` : ""}
                    </div>
                  </div>
                </div>

                {/* Close button */}
                <button
                  onClick={() => setModalItem(null)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all text-sm flex-shrink-0"
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>

              {/* Date Badge */}
              <div className="py-4 flex items-center gap-2 text-xs font-mono text-white/60">
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  {formatDate(modalItem.startDate)} –{" "}
                  {modalItem.current
                    ? "Present"
                    : modalItem.endDate
                      ? formatDate(modalItem.endDate)
                      : "Present"}
                </span>
                {modalItem.current && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px]">
                    Current Role
                  </span>
                )}
              </div>

              {/* Full Description */}
              {modalItem.description && (
                <div className="py-2">
                  <h4 className="text-xs uppercase tracking-widest text-white/40 font-mono mb-2">
                    Overview
                  </h4>
                  <p className="text-sm md:text-base text-white/85 leading-relaxed">
                    {modalItem.description}
                  </p>
                </div>
              )}

              {/* Full Responsibilities */}
              {modalItem.responsibilities &&
                modalItem.responsibilities.length > 0 && (
                  <div className="py-4">
                    <h4 className="text-xs uppercase tracking-widest text-white/40 font-mono mb-3">
                      Key Responsibilities & Highlights
                    </h4>
                    <ul className="space-y-2.5 text-xs md:text-sm text-white/80 leading-relaxed list-disc list-outside pl-4">
                      {modalItem.responsibilities.map((resp, rIdx) => (
                        <li key={rIdx}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* Tags / Skills */}
              {modalItem.tags && modalItem.tags.length > 0 && (
                <div className="pt-4 border-t border-white/10">
                  <h4 className="text-xs uppercase tracking-widest text-white/40 font-mono mb-3">
                    Technologies & Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {modalItem.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-xs font-mono px-3 py-1 rounded-full bg-white/10 text-white/90 border border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
