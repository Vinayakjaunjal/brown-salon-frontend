import React from "react";

export default function SlotButton({
  time,
  subtitle,
  selected,
  disabled = false,
  onClick,
}) {
  const stateClass = selected
    ? "border-amber-400 bg-amber-400 text-gray-900 shadow-[0_16px_30px_-22px_rgba(217,162,39,0.9)]"
    : disabled
      ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
      : "border-gray-200 bg-white text-gray-800 hover:border-amber-300 hover:bg-amber-50/60";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      disabled={disabled}
      className={`w-full rounded-2xl border px-3 py-3 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-200 ${stateClass}`}
    >
      <div className="text-sm font-semibold">{time}</div>
      {subtitle && (
        <div
          className={`text-[11px] mt-0.5 ${selected ? "text-amber-900/70" : "text-gray-500"}`}
        >
          {subtitle}
        </div>
      )}
    </button>
  );
}
