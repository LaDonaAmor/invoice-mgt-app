import { useInvoiceCtx } from "@/context/InvoiceContext";
import { Button } from "../ui/AppButton";
import { StatusFilter } from "../filter/StatusFilter";
import { InvoiceItem } from "@/components/invoice/InvoiceItem.tsx";
import { EmptyState } from "../ui/EmptyState";

export function InvoiceList({ onNew }: { onNew: () => void }) {
  const { invoices, filtered, filters, setFilters } = useInvoiceCtx();

  return (
    <section>
      <header className="flex items-center justify-between mb-8 md:mb-14">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight">
            Invoices
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-2">
            {invoices.length === 0
              ? "No invoices"
              : filters.length === 0
                ? `There are ${invoices.length} total invoices`
                : `${filtered.length} ${filters.join(", ")} invoices${filtered.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <div className="flex items-center gap-4 md:gap-10">
          <StatusFilter value={filters} onChange={setFilters} />
          <Button onClick={onNew} className="pl-2 pr-5 gap-3 cursor-pointer">
            <span className="flex items-center justify-center h-8 w-8 rounded-full bg-card text-primary shrink-0">
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.29017 10V6.29017H10V3.70983H6.29017V0H3.70983V3.70983H0V6.29017H3.70983V10H6.29017Z"
                  fill="#7C5DFA"
                />
              </svg>
            </span>
            <span>
              New <span className="hidden sm:inline">Invoice</span>
            </span>
          </Button>
        </div>
      </header>

      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="space-y-4">
          {filtered.map((inv) => (
            <li key={inv.id}>
              <InvoiceItem invoice={inv} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
