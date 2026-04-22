import type { InvoiceStatus } from "@/types/invoice";
import { cn } from "@/lib/utils";

const styles: Record<InvoiceStatus, string> = {
  paid: "bg-status-paid/10 text-status-paid",
  pending: "bg-status-pending/10 text-status-pending",
  drafts:
    "bg-status-draft/10 text-status-draft dark:bg-white/5 dark:text-secondary-foreground",
};

const labels: Record<InvoiceStatus, string> = {
  paid: "Paid",
  pending: "Pending",
  drafts: "Draft",
};

export function StatusBadge({
  status,
  className,
}: {
  status: InvoiceStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-md px-4 py-2 text-xs font-bold capitalize min-w-26 justify-center",
        styles[status],
        className,
      )}
    >
      <span
        className={cn("h-2 w-2 rounded-full", `bg-status-${status}`)}
        aria-hidden
      />
      {labels[status]}
    </span>
  );
}
