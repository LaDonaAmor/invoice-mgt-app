import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import type { InvoiceStatus } from "@/types/invoice";
import { cn } from "@/lib/utils";

const OPTIONS: { value: InvoiceStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
];

interface Props {
  value: InvoiceStatus[];
  onChange: (next: InvoiceStatus[]) => void;
}

export function StatusFilter({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const toggleVal = (v: InvoiceStatus) => {
    if (value.includes(v)) {
      onChange(value.filter((x) => x !== v));
    } else {
      onChange([...value, v]);
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="status-filter-menu"
        className="inline-flex items-center gap-3 text-sm font-bold tracking-tight focus-ring rounded-md px-2 py-2 hover:text-primary cursor-pointer"
      >
        <span>
          <span className="hidden sm:inline">Filter by status</span>
          <span className="sm:hidden">Filter</span>
        </span>

        <svg
          width="10"
          height="7"
          viewBox="0 0 10 7"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn(
            "h-3 w-3 text-primary transition-transform",
            open && "rotate-180",
          )}
        >
          <path
            d="M0.707031 0.707153L4.93493 4.93505L9.16283 0.707153"
            stroke="#7C5DFA"
            stroke-width="2"
          />
        </svg>
      </button>

      {open && (
        <ul
          id="status-filter-menu"
          className="absolute right-0 mt-4 w-48 rounded-lg bg-popover shadow-2xl p-6 space-y-4 z-20"
        >
          {OPTIONS.map((o) => {
            const checked = value.includes(o.value);

            return (
              <li key={o.value}>
                <label className="flex items-center gap-3 cursor-pointer text-sm font-bold group">
                  {/* Custom checkbox UI */}
                  <span
                    className={cn(
                      "h-4 w-4 rounded-sm border flex items-center justify-center transition-colors",
                      checked
                        ? "bg-primary border-primary"
                        : "bg-secondary border-transparent group-hover:border-primary",
                    )}
                  >
                    {checked && (
                      <Check
                        className="h-3 w-3 text-primary-foreground"
                        strokeWidth={4}
                      />
                    )}
                  </span>

                  {/* Actual checkbox (accessible) */}
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={() => toggleVal(o.value)}
                  />

                  {o.label}
                </label>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
