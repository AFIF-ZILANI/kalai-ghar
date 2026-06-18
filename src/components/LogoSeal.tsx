/**
 * LogoSeal — full circular badge logo.
 * Uses inline SVG so the page's Bengali web font (Hind Siliguri) renders on the arcs.
 *
 * variant="dark"  → terracotta on cream  (default, use on light backgrounds)
 * variant="light" → cream / white        (use on dark / image backgrounds)
 */

type Variant = "dark" | "light";

const PALETTE = {
    dark: {
        bg: "#fdf8f2",
        ring: "#b84520",
        ringInner: "#c8593a",
        text: "#b84520",
        iconStroke: "#1a1007",
        dot: "#b84520",
        bgOpacity: 1,
    },
    light: {
        bg: "transparent",
        ring: "#fdf8f2",
        ringInner: "rgba(253,248,242,0.5)",
        text: "#fdf8f2",
        iconStroke: "#fdf8f2",
        dot: "#fdf8f2",
        bgOpacity: 0,
    },
} satisfies Record<Variant, object>;

export default function LogoSeal({
    size = 260,
    variant = "dark",
    className = "",
}: {
    size?: number;
    variant?: Variant;
    className?: string;
}) {
    const p = PALETTE[variant];

    // SVG is drawn on a 300×300 canvas, center = (150,150)
    // Top arc:    radius 122, counterclockwise (sweep=0) → through the TOP
    // Bottom arc: radius 112, clockwise       (sweep=1) → through the BOTTOM
    const topArcId = "kg-top-arc";
    const botArcId = "kg-bot-arc";

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 300 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            role="img"
            aria-label="Kalai Ghor — কালাই ঘর"
        >
            <defs>
                {/* Top arc: left (28,150) → counterclockwise → right (272,150) */}
                <path id={topArcId} d="M 28,150 A 122,122 0 0,0 272,150" />
                {/* Bottom arc: left (38,150) → clockwise → right (262,150) */}
                <path id={botArcId} d="M 38,150 A 112,112 0 0,1 262,150" />
            </defs>

            {/* ── Background ── */}
            {p.bgOpacity > 0 && (
                <circle cx="150" cy="150" r="148" fill={p.bg} />
            )}

            {/* ── Outer ring (thick) ── */}
            <circle cx="150" cy="150" r="145" stroke={p.ring} strokeWidth="4.5" />

            {/* ── Inner ring (thin) ── */}
            <circle cx="150" cy="150" r="133" stroke={p.ring} strokeWidth="1" strokeDasharray="2 4" />

            {/* ── Ornamental diamonds at 9 & 3 o'clock ── */}
            {[18, 282].map((cx) => (
                <g key={cx} transform={`translate(${cx},150)`}>
                    <rect
                        x="-4" y="-4" width="8" height="8"
                        fill={p.dot}
                        transform="rotate(45)"
                    />
                </g>
            ))}

            {/* ── Bengali text on top arc ── */}
            <text
                fontFamily="'Hind Siliguri', 'Noto Sans Bengali', Arial Unicode MS, sans-serif"
                fontSize="21"
                fontWeight="600"
                fill={p.text}
            >
                <textPath href={`#${topArcId}`} startOffset="50%" textAnchor="middle">
                    কালাই ঘর
                </textPath>
            </text>

            {/* ── English text on bottom arc ── */}
            <text
                fontFamily="'Playfair Display', Georgia, serif"
                fontSize="12"
                fontWeight="700"
                fill={p.text}
                letterSpacing="4"
            >
                <textPath href={`#${botArcId}`} startOffset="50%" textAnchor="middle">
                    KALAI GHOR
                </textPath>
            </text>

            {/* ── Short rules flanking bottom text ── */}
            {[
                { x1: 62, y1: 258, x2: 80,  y2: 264 },
                { x1: 220, y1: 264, x2: 238, y2: 258 },
            ].map((l, i) => (
                <line
                    key={i}
                    x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
                    stroke={p.ring}
                    strokeWidth="1"
                    strokeLinecap="round"
                />
            ))}

            {/* ══ CENTRE ICON — tawa (griddle) + ruti (flatbread) ══ */}

            {/* Ruti (flatbread) — circle */}
            <circle cx="150" cy="133" r="30" stroke={p.iconStroke} strokeWidth="2.5" />
            {/* Grain texture — 3 lines */}
            <line x1="129" y1="127" x2="171" y2="127" stroke={p.iconStroke} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="124" y1="133" x2="176" y2="133" stroke={p.iconStroke} strokeWidth="2"   strokeLinecap="round" />
            <line x1="129" y1="139" x2="171" y2="139" stroke={p.iconStroke} strokeWidth="1.5" strokeLinecap="round" />

            {/* Tawa (griddle) — flattened ellipse */}
            <ellipse cx="150" cy="159" rx="46" ry="9" stroke={p.iconStroke} strokeWidth="2.5" />
            {/* Tawa rim highlight (inner ellipse) */}
            <ellipse cx="150" cy="159" rx="40" ry="5.5" stroke={p.iconStroke} strokeWidth="1" opacity="0.35" />

            {/* Handle */}
            <path
                d="M 104,159 Q 90,157 82,153"
                stroke={p.iconStroke}
                strokeWidth="2.5"
                strokeLinecap="round"
            />
            {/* Handle end knob */}
            <circle cx="81" cy="153" r="3" fill={p.iconStroke} />

            {/* Small 'RAJSHAHI' label inside, between icon and bottom text */}
            <text
                x="150"
                y="191"
                textAnchor="middle"
                fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif"
                fontSize="7.5"
                fontWeight="700"
                letterSpacing="3.5"
                fill={p.text}
                opacity="0.6"
            >
                RAJSHAHI
            </text>
        </svg>
    );
}
