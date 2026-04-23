import { Link } from "react-router-dom";
import type { Invoice } from "@/types/invoice";
import { formatDate } from "@/utils/formatDate";
import { formatCurrency } from "@/utils/formatCurrency";
import { StatusBadge } from "../ui/StatusBadge";

export function InvoiceItem({ invoice }: { invoice: Invoice }) {
  return (
    <Link
      to={`/invoice/${invoice.id}`}
      className="block bg-card rounded-lg border border-transparent hover:border-primary transition-colors focus-ring shadow-sm cursor-pointer"
    >
      <div className="hidden md:grid grid-cols-[1fr_1.2fr_1fr_1fr_auto_auto] items-center gap-8 px-6 py-5">
        <span className="text-[15px]] font-bold tracking-tight">
          <span className="text-muted-foreground">#</span>
          {invoice.id}
        </span>
        <span className="text-[13px] text-muted-foreground">
          Due {formatDate(invoice.paymentDue)}
        </span>
        <span className="text-[13px] text-muted-foreground text-left">
          {invoice.clientName || "—"}
        </span>
        <span className="text-base font-bold tracking-tight text-right">
          {formatCurrency(invoice.total)}
        </span>
        <StatusBadge status={invoice.status} />
        <svg
          width="7"
          height="10"
          viewBox="0 0 7 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.707031 0.707153L4.70703 4.70715L0.707031 8.70715"
            stroke="#7C5DFA"
            stroke-width="2"
          />
        </svg>
      </div>

      <div className="md:hidden p-6 space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold tracking-tight">
            <span className="text-muted-foreground">#</span>
            {invoice.id}
          </span>
          <span className="text-xs text-muted-foreground">
            {invoice.clientName || "—"}
          </span>
        </div>
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">
              Due {formatDate(invoice.paymentDue)}
            </div>
            <div className="text-base font-bold tracking-tight">
              {formatCurrency(invoice.total)}
            </div>
          </div>
          <StatusBadge status={invoice.status} />
        </div>
      </div>
    </Link>
  );
}
