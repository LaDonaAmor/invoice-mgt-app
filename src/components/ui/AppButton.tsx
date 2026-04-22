import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "destructive" | "dark" | "ghost";
type Size = "default" | "sm";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary/70 dark:hover:bg-secondary/80",
  destructive:
    "bg-destructive text-destructive-foreground hover:bg-destructive-hover",
  dark: "bg-[hsl(var(--total-bg))] text-[hsl(var(--total-fg))] hover:bg-[hsl(var(--sidebar-background))]",
  ghost: "bg-transparent text-foreground hover:bg-accent",
};

const sizes: Record<Size, string> = {
  default: "h-12 px-6 text-sm",
  sm: "h-10 px-4 text-xs",
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = "primary", size = "default", ...rest }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-bold tracking-tight transition-colors focus-ring disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className,
      )}
      {...rest}
    />
  ),
);
Button.displayName = "Button";
