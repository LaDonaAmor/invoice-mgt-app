import {
  forwardRef,
  useId,
  useRef,
  useState,
  useEffect,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO } from "date-fns";
import {
  Select as RadixSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type React from "react";

// ─── Field Wrapper ───────────────────────────────────────────────────────────

interface FieldWrapperProps {
  label?: string;
  error?: string;
  id: string;
  className?: string;
  hideLabel?: boolean;
  children: ReactNode;
}

export function Field({
  label,
  error,
  id,
  className,
  hideLabel,
  children,
}: FieldWrapperProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <div className="flex items-center justify-between">
          <label
            htmlFor={id}
            className={cn(
              "text-xs font-medium text-secondary-foreground",
              hideLabel && "sr-only",
              error && "text-destructive",
            )}
          >
            {label}
          </label>
          {error && (
            <span className="text-[11px] font-medium text-destructive">
              {error}
            </span>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

// ─── Input ───────────────────────────────────────────────────────────────────

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hideLabel?: boolean;
  wrapperClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, label, error, id, hideLabel, wrapperClassName, ...rest },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id ?? rest.name ?? generatedId;

    return (
      <Field
        id={inputId}
        label={label}
        error={error}
        hideLabel={hideLabel}
        className={wrapperClassName}
      >
        <input
          id={inputId}
          ref={ref}
          aria-invalid={!!error}
          className={cn(
            "h-12 w-full rounded-md border bg-card px-5 text-sm font-bold text-foreground placeholder:text-muted-foreground transition-colors focus-ring cursor-pointer",
            error ? "border-destructive" : "border-border hover:border-primary",
            className,
          )}
          {...rest}
        />
      </Field>
    );
  },
);
Input.displayName = "Input";

// ─── Select ──────────────────────────────────────────────────────────────────

interface SelectProps {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  wrapperClassName?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function Select({
  label,
  error,
  options,
  wrapperClassName,
  value,
  onChange,
}: SelectProps) {
  const generatedId = useId();

  return (
    <Field
      id={generatedId}
      label={label}
      error={error}
      className={wrapperClassName}
    >
      <RadixSelect
        value={value as string}
        onValueChange={(val) => {
          onChange?.({
            target: { value: val },
          } as React.ChangeEvent<HTMLSelectElement>);
        }}
      >
        <SelectTrigger
          className={cn(
            "h-12 w-full border bg-card px-5 text-sm font-bold text-foreground transition-colors focus-ring cursor-pointer",
            error ? "border-destructive" : "border-border hover:border-primary",
          )}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem
              key={o.value}
              value={o.value}
              className="cursor-pointer"
            >
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </RadixSelect>
    </Field>
  );
}

// ─── DatePicker ──────────────────────────────────────────────────────────────

interface DatePickerProps {
  label?: string;
  value: string;
  onChange: (iso: string) => void;
  disabled?: boolean;
  error?: string;
  wrapperClassName?: string;
}

export function DatePicker({
  label,
  value,
  onChange,
  disabled,
  error,
  wrapperClassName,
}: DatePickerProps) {
  const generatedId = useId();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = value ? parseISO(value) : undefined;
  const display = selected ? format(selected, "dd MMM yyyy") : "Select date";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Field
      id={generatedId}
      label={label}
      error={error}
      className={wrapperClassName}
    >
      <div ref={ref} className="relative">
        <button
          type="button"
          id={generatedId}
          disabled={disabled}
          onClick={() => !disabled && setOpen((o) => !o)}
          className={cn(
            "h-12 w-full rounded-md border bg-card px-5 text-sm font-bold text-foreground transition-colors focus-ring flex items-center justify-between cursor-pointer",
            error ? "border-destructive" : "border-border hover:border-primary",
            disabled && "opacity-50 cursor-not-allowed",
          )}
        >
          {display}
          <CalendarIcon className="h-4 w-4 text-primary" />
        </button>

        {open && (
          <div className="absolute z-50 mt-2 rounded-xl border border-border bg-card shadow-lg">
            <Calendar
              mode="single"
              selected={selected}
              onSelect={(date) => {
                if (date) {
                  onChange(date.toISOString());
                  setOpen(false);
                }
              }}
              initialFocus
            />
          </div>
        )}
      </div>
    </Field>
  );
}
