"use client";

export default function PerformanceCircle({
  value,
  label,
  size = 84,
}: {
  value: number;
  label?: string;
  size?: number;
}) {
  const v = Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (v / 100) * c;

  return (
    <div className="flex items-center gap-3">
      <div style={{ width: size, height: size }} className="relative">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            strokeWidth={stroke}
            stroke="#d8dfd8"
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            strokeWidth={stroke}
            stroke="#0f766e"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${c - dash}`}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-lg font-bold text-[#18312f]">{v}%</div>
        </div>
      </div>
      {label ? (
        <div className="text-sm font-semibold text-[#18312f]">
          {label}
          <div className="text-xs font-normal text-[#58706b]">Average score</div>
        </div>
      ) : null}
    </div>
  );
}

