export function Hatches() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      style={{ position: "absolute" }}
    >
      <defs>
        {/* Sandstone: dots, the mobile formation */}
        <pattern
          id="hatch-dots"
          width="14"
          height="14"
          patternUnits="userSpaceOnUse"
        >
          <rect width="14" height="14" fill="var(--paper-2)" />
          <circle cx="4" cy="4" r="1.7" fill="var(--ink)" />
          <circle cx="11" cy="10" r="1.7" fill="var(--ink)" />
        </pattern>
        {/* Shale: horizontal dashes, the web and backend formation */}
        <pattern
          id="hatch-dashes"
          width="16"
          height="12"
          patternUnits="userSpaceOnUse"
        >
          <rect width="16" height="12" fill="var(--paper-2)" />
          <rect x="1" y="2" width="7" height="1.6" fill="var(--ink)" />
          <rect x="9" y="8" width="6" height="1.6" fill="var(--ink)" />
        </pattern>
        {/* Limestone: brick lattice, the frameworks and tools formation */}
        <pattern
          id="hatch-brick"
          width="18"
          height="12"
          patternUnits="userSpaceOnUse"
        >
          <rect width="18" height="12" fill="var(--paper-2)" />
          <path
            d="M0 0.8 H18 M0 6.4 H18 M0 12 H18 M4.5 0.8 V6.4 M13.5 6.4 V12"
            stroke="var(--ink)"
            strokeWidth="1.2"
            fill="none"
          />
        </pattern>
        {/* Basics: scattered crosses */}
        <pattern
          id="hatch-cross"
          width="18"
          height="14"
          patternUnits="userSpaceOnUse"
        >
          <rect width="18" height="14" fill="var(--paper-2)" />
          <path
            d="M3 3 l4 4 M7 3 l-4 4 M12 9 l4 4 M16 9 l-4 4"
            stroke="var(--ink)"
            strokeWidth="1.2"
            fill="none"
          />
        </pattern>
      </defs>
    </svg>
  );
}
