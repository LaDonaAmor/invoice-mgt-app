export function EmptyState({
  title = "There is nothing here",
  description,
}: {
  title?: string;
  description?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <svg
        viewBox="0 0 242 200"
        className="w-48 md:w-60 h-auto mb-12"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
            <stop
              offset="0"
              stopColor="hsl(var(--primary))"
              stopOpacity="0.4"
            />
            <stop
              offset="1"
              stopColor="hsl(var(--primary))"
              stopOpacity="0.1"
            />
          </linearGradient>
        </defs>
        <ellipse
          cx="121"
          cy="180"
          rx="90"
          ry="10"
          fill="hsl(var(--muted-foreground))"
          opacity="0.15"
        />
        <rect
          x="60"
          y="80"
          width="120"
          height="80"
          rx="6"
          fill="hsl(var(--card))"
          stroke="hsl(var(--muted-foreground))"
          strokeWidth="1.5"
        />
        <path
          d="M60 86 L120 130 L180 86"
          fill="none"
          stroke="hsl(var(--muted-foreground))"
          strokeWidth="1.5"
        />
        <circle cx="155" cy="60" r="22" fill="hsl(var(--primary))" />
        <path
          d="M148 58 v-10 a4 4 0 0 1 4 -4 h6 a4 4 0 0 1 4 4 v10 z"
          fill="hsl(var(--card))"
        />
        <rect
          x="146"
          y="58"
          width="18"
          height="14"
          rx="2"
          fill="hsl(var(--card))"
        />
      </svg>
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">
        {title}
      </h2>
      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
        {description ?? (
          <>
            Create an invoice by clicking the{" "}
            <strong className="text-foreground">New Invoice</strong> button and
            get started.
          </>
        )}
      </p>
    </div>
  );
}
