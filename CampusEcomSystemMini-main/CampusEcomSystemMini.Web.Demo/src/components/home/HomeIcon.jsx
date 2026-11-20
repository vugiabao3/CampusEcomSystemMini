// Bộ icon SVG nội tuyến dùng chung cho Home Page.
//
// Icon được vẽ bằng path nên không cần thêm thư viện,
// giữ đúng quy ước component chỉ export component.

// Đường viền dùng chung cho toàn bộ icon trong bộ.
const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const ICONS = {
  user: (
    <>
      <circle cx="12" cy="8" r="3.4" {...STROKE} />
      <path d="M4.8 20a7.2 7.2 0 0 1 14.4 0" {...STROKE} />
    </>
  ),

  posts: (
    <>
      <rect x="3.6" y="4.4" width="16.8" height="15.2" rx="3" {...STROKE} />
      <path d="M7.6 9.2h8.8M7.6 13h8.8M7.6 16.4h5.4" {...STROKE} />
    </>
  ),

  vector: (
    <>
      <circle cx="6" cy="18" r="2.4" {...STROKE} />
      <circle cx="18" cy="6" r="2.4" {...STROKE} />
      <path d="M10.2 6H14a3 3 0 0 1 3 3v1.6" {...STROKE} />
      <path d="M7.8 15.6V13a3 3 0 0 1 3-3h1.4" {...STROKE} />
    </>
  ),

  chat: (
    <>
      <path
        d="M20.4 12.6c0 3.7-3.3 6.7-7.4 6.7a8 8 0 0 1-2.6-.4l-4.6 1.6 1.5-3.8a6.5 6.5 0 0 1-2.3-4.9c0-3.7 3.3-6.6 7.4-6.6s8 3 8 7.4Z"
        {...STROKE}
      />
      <path d="M9.4 11.6h6M9.4 14.6h3.6" {...STROKE} />
    </>
  ),

  sparkles: (
    <>
      <path
        d="M11 3.6 12.7 8l4.4 1.7-4.4 1.7L11 15.8 9.3 11.4 4.9 9.7 9.3 8 11 3.6Z"
        {...STROKE}
      />
      <path d="M18 14.4l.9 2.2 2.2.9-2.2.9-.9 2.2-.9-2.2-2.2-.9 2.2-.9.9-2.2Z" {...STROKE} />
    </>
  ),

  lostFound: (
    <>
      <path d="M12 21s6.6-5.6 6.6-10.4A6.6 6.6 0 0 0 5.4 10.6C5.4 15.4 12 21 12 21Z" {...STROKE} />
      <circle cx="12" cy="10.4" r="2.4" {...STROKE} />
    </>
  ),

  book: (
    <>
      <path d="M4.4 5.2A2 2 0 0 1 6.4 3.2H19v14.4H6.4a2 2 0 0 0-2 2V5.2Z" {...STROKE} />
      <path d="M4.4 19.6a2 2 0 0 1 2-2H19v3.2H6.4a2 2 0 0 1-2-2Z" {...STROKE} />
      <path d="M8.8 7.6h6.4" {...STROKE} />
    </>
  ),

  trophy: (
    <>
      <path d="M7.4 4.4h9.2v4.4a4.6 4.6 0 0 1-9.2 0V4.4Z" {...STROKE} />
      <path d="M7.4 6.2H5a2 2 0 0 0 2.4 3.2M16.6 6.2H19a2 2 0 0 1-2.4 3.2" {...STROKE} />
      <path d="M12 13.4v3.2M9 19.6h6" {...STROKE} />
    </>
  ),

  shield: (
    <>
      <path d="M12 3.4 19 6v5.6c0 4.2-2.9 7.4-7 9-4.1-1.6-7-4.8-7-9V6l7-2.6Z" {...STROKE} />
      <path d="M9.2 12.2 11.2 14l3.6-3.8" {...STROKE} />
    </>
  ),

  bell: (
    <>
      <path d="M6.4 10.4a5.6 5.6 0 1 1 11.2 0c0 4 1.4 5.4 1.4 5.4H5s1.4-1.4 1.4-5.4Z" {...STROKE} />
      <path d="M10.2 18.6a2 2 0 0 0 3.6 0" {...STROKE} />
    </>
  ),

  cog: (
    <>
      <circle cx="12" cy="12" r="3" {...STROKE} />
      <path
        d="M12 3.4v2M12 18.6v2M20.6 12h-2M5.4 12h-2M18.1 5.9l-1.4 1.4M7.3 16.7l-1.4 1.4M18.1 18.1l-1.4-1.4M7.3 7.3 5.9 5.9"
        {...STROKE}
      />
    </>
  ),

  arrowRight: (
    <path d="M4.8 12h14M13.4 6.6 18.8 12l-5.4 5.4" {...STROKE} />
  ),

  arrowUp: (
    <>
      <path d="M12 4v16M18 10l-6-6-6 6" {...STROKE} />
    </>
  ),

  logout: (
    <>
      <path d="M9.6 4.6H6.4a2 2 0 0 0-2 2v10.8a2 2 0 0 0 2 2h3.2" {...STROKE} />
      <path d="M14.4 8.2 18.2 12l-3.8 3.8M18.2 12H9" {...STROKE} />
    </>
  ),

  compass: (
    <>
      <circle cx="12" cy="12" r="8.6" {...STROKE} />
      <path d="m15.2 8.8-1.9 4.5-4.5 1.9 1.9-4.5 4.5-1.9Z" {...STROKE} />
    </>
  ),

  heart: (
    <path
      d="M12 20.2 4.9 13.4a4.4 4.4 0 0 1 6.2-6.2l.9.9.9-.9a4.4 4.4 0 1 1 6.2 6.2Z"
      {...STROKE}
    />
  ),

  heartFilled: (
    <path
      d="M12 20.2 4.9 13.4a4.4 4.4 0 0 1 6.2-6.2l.9.9.9-.9a4.4 4.4 0 1 1 6.2 6.2Z"
      fill="currentColor"
    />
  ),

  pencil: (
    <>
      <path d="M4.6 19.4h3.2L18.2 9a2.1 2.1 0 0 0-3-3L4.6 16.4Z" {...STROKE} />
      <path d="M13.8 6.6 17.4 10.2" {...STROKE} />
    </>
  ),

  trash: (
    <>
      <path d="M4.8 6.6h14.4" {...STROKE} />
      <path d="M9.2 6.6V4.8a1.4 1.4 0 0 1 1.4-1.4h2.8a1.4 1.4 0 0 1 1.4 1.4v1.8" {...STROKE} />
      <path d="M6.6 6.6 7.4 19a1.6 1.6 0 0 0 1.6 1.5h6a1.6 1.6 0 0 0 1.6-1.5l.8-12.4" {...STROKE} />
      <path d="M10.4 10.2v6M13.6 10.2v6" {...STROKE} />
    </>
  ),
};

export default function HomeIcon({ name, size = 20, className = "" }) {
  const glyph = ICONS[name];

  if (!glyph) {
    return null;
  }

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      {glyph}
    </svg>
  );
}