"use client";

interface Props {
  quantity: number;
  max: number;
  onChange: (qty: number) => void;
  disabled?: boolean;
}

export default function QuantitySelector({
  quantity,
  max,
  onChange,
  disabled = false,
}: Props) {
  const decrement = () => onChange(Math.max(1, quantity - 1));
  const increment = () => onChange(Math.min(max, quantity + 1));

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={decrement}
        disabled={disabled || quantity <= 1}
        className="retro-btn"
        style={{ padding: "6px 14px", fontSize: "22px", minWidth: "40px" }}
        aria-label="Decrease quantity"
      >
        −
      </button>

      <span
        style={{
          fontFamily: "var(--font-ibm-plex-mono), monospace",
          fontSize: "22px",
          fontWeight: 700,
          color: "#111111",
          minWidth: "36px",
          textAlign: "center",
          display: "block",
        }}
      >
        {quantity}
      </span>

      <button
        onClick={increment}
        disabled={disabled || quantity >= max}
        className="retro-btn"
        style={{ padding: "6px 14px", fontSize: "22px", minWidth: "40px" }}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
