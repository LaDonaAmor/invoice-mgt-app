import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
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
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const toggleVal = (v: InvoiceStatus) =>
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-3 text-sm font-bold tracking-tight focus-ring rounded-md px-2 py-2 hover:text-primary"
      >
        <span>
          <span className="hidden sm:inline">Filter by status</span>
          <span className="sm:hidden">Filter</span>
        </span>
        <ChevronDown
          className={cn(
            "h-3 w-3 text-primary transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 mt-4 w-48 rounded-lg bg-popover shadow-2xl p-6 space-y-4 z-20"
        >
          {OPTIONS.map((o) => {
            const checked = value.includes(o.value);
            return (
              <li key={o.value}>
                <label className="flex items-center gap-3 cursor-pointer text-sm font-bold group">
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
