/**
 * LogoMark — the brand icon (ruti flatbread form).
 * Inline SVG so it inherits currentColor and scales losslessly.
 */
export default function LogoMark({
    size = 40,
    className = "",
}: {
    size?: number;
    className?: string;
}) {
    const h = Math.round(size * 0.72);
    return (
        <svg
            width={size}
            height={h}
            viewBox="0 0 50 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className={className}
        >
            {/* Ruti body */}
            <ellipse cx="25" cy="18" rx="24" ry="17" fill="#b84520" />
            {/* Grain texture — cream stripes */}
            <line x1="9"  y1="12.5" x2="41" y2="12.5" stroke="#fdf8f2" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="5"  y1="18"   x2="45" y2="18"   stroke="#fdf8f2" strokeWidth="2"   strokeLinecap="round" />
            <line x1="9"  y1="23.5" x2="41" y2="23.5" stroke="#fdf8f2" strokeWidth="1.4" strokeLinecap="round" />
            {/* Outer rim */}
            <ellipse cx="25" cy="18" rx="24" ry="17" stroke="#8f3219" strokeWidth="1.5" />
        </svg>
    );
}
