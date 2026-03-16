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
    <div className="flex items-center gap-4">
      <button
        onClick={decrement}
        disabled={disabled || quantity <= 1}
        className="w-10 h-10 rounded-full bg-red-500 hover:bg-red-400 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-xl font-bold transition-colors shadow-sm shadow-red-200"
        aria-label="Decrease quantity"
      >
        −
      </button>

      <span className="w-10 text-center text-2xl font-bold text-gray-900 tabular-nums font-mono">
        {quantity}
      </span>

      <button
        onClick={increment}
        disabled={disabled || quantity >= max}
        className="w-10 h-10 rounded-full bg-green-600 hover:bg-green-500 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-xl font-bold transition-colors shadow-sm shadow-green-200"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
