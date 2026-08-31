"use client";

import { cn } from "@/lib/utils";

type SymptomToggleGroupProps = {
  title: string;
  selectedValues: string[];
  options: readonly string[];
  onToggle: (value: string) => void;
};

export function SymptomToggleGroup({
  title,
  selectedValues,
  options,
  onToggle,
}: SymptomToggleGroupProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-zinc-900">{title}</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {options.map((option) => {
          const isSelected = selectedValues.includes(option);

          return (
            <button
              key={option}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onToggle(option)}
              className={cn(
                "group flex min-h-12 items-center justify-center rounded-lg border px-4 py-3 text-sm font-medium tracking-[-0.01em] transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-[0.98]",
                isSelected
                  ? "border-zinc-400 bg-zinc-200 text-zinc-900 shadow-[0_10px_24px_-18px_rgba(0,0,0,0.18)]"
                  : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300 hover:bg-white hover:text-zinc-900",
              )}
            >
              <span className="flex items-center gap-2">
                <span
                  className={cn(
                    "h-2.5 w-2.5 rounded-full transition-colors duration-200",
                    isSelected
                      ? "bg-zinc-600"
                      : "bg-zinc-300 group-hover:bg-zinc-500",
                  )}
                />
                <span>{option}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
