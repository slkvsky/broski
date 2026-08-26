/**
 * Shared SVG filter (blur + a sharpened alpha color-matrix) that fuses
 * overlapping shapes into one gooey/metaball blob. Referenced by CSS via
 * filter: url(#goo) — must actually be rendered in the document (not
 * display:none) for Safari/Firefox to resolve the reference, so this stays
 * mounted once at the app root, sized to 0 so it takes up no layout space.
 */
export default function GooFilter() {
  return (
    <svg
      aria-hidden="true"
      style={{ position: "absolute", width: 0, height: 0 }}
    >
      <defs>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
            result="goo"
          />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </defs>
    </svg>
  );
}
