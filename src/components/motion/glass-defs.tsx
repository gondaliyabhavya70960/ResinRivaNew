/**
 * Single, app-wide SVG displacement filter for the "liquid glass" refraction
 * effect. Rendered ONCE near the root so every `LiquidGlass` instance can
 * reference `url(#rr-glass)` without duplicating the filter id in the DOM.
 * (Refraction itself is Chromium-only and feature-detected in LiquidGlass; this
 * def is inert/harmless on browsers that ignore `backdrop-filter: url()`.)
 */
export function GlassDefs() {
  return (
    <svg aria-hidden focusable="false" className="pointer-events-none absolute h-0 w-0" width={0} height={0}>
      <defs>
        <filter id="rr-glass" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012 0.012"
            numOctaves="2"
            seed="7"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="18"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
