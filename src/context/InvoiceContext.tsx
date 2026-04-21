import {
  createContext,
  useContext,
  useMemo,
  ReactNode,
  useCallback,
} from "react";
import type { Invoice, InvoiceStatus } from "@/types/invoice";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { generateInvoiceId } from "@/utils/generateId";
import { addDays } from "@/utils/formatDate";

interface InvoiceCtx {
  invoices: Invoice[];
  filters: InvoiceStatus[];
  setFilters: (f: InvoiceStatus[]) => void;
  filtered: Invoice[];
  getById: (id: string) => Invoice | undefined;
  createInvoice: (
    data: Omit<Invoice, "id" | "paymentDue" | "total" | "status">,
    status: InvoiceStatus,
  ) => Invoice;
  updateInvoice: (
    id: string,
    data: Omit<Invoice, "id" | "paymentDue" | "total" | "status">,
  ) => void;
  deleteInvoice: (id: string) => void;
  markAsPaid: (id: string) => void;
}

const Ctx = createContext<InvoiceCtx | null>(null);

const seed: Invoice[] = [
  {
    id: "RT3080",
    createdAt: "2021-08-18T00:00:00.000Z",
    paymentDue: "2021-08-19T00:00:00.000Z",
    paymentTerms: 1,
    description: "Re-branding",
    status: "paid",
    clientName: "Jensen Huang",
    clientEmail: "jensenh@mail.com",
    senderAddress: {
      street: "19 Union Terrace",
      city: "London",
      postCode: "E1 3EZ",
      country: "United Kingdom",
    },
    clientAddress: {
      street: "106 Kendell Street",
      city: "Sharrington",
      postCode: "NR24 5WQ",
      country: "United Kingdom",
    },
    items: [{ id: "i1", name: "Brand Guidelines", quantity: 1, price: 1800.9 }],
    total: 1800.9,
  },
  {
    id: "XM9141",
    createdAt: "2021-08-21T00:00:00.000Z",
    paymentDue: "2021-09-20T00:00:00.000Z",
    paymentTerms: 30,
    description: "Graphic Design",
    status: "pending",
    clientName: "Alex Grim",
    clientEmail: "alexgrim@mail.com",
    senderAddress: {
      street: "19 Union Terrace",
      city: "London",
      postCode: "E1 3EZ",
      country: "United Kingdom",
    },
    clientAddress: {
      street: "84 Church Way",
      city: "Bradford",
      postCode: "BD1 9PB",
      country: "United Kingdom",
    },
    items: [
      { id: "i1", name: "Banner Design", quantity: 1, price: 156 },
      { id: "i2", name: "Email Design", quantity: 2, price: 200 },
    ],
    total: 556,
  },
  {
    id: "FV2353",
    createdAt: "2021-11-05T00:00:00.000Z",
    paymentDue: "2021-11-12T00:00:00.000Z",
    paymentTerms: 7,
    description: "Logo Re-design",
    status: "draft",
    clientName: "Anita Wainwright",
    clientEmail: "",
    senderAddress: {
      street: "19 Union Terrace",
      city: "London",
      postCode: "E1 3EZ",
      country: "United Kingdom",
    },
    clientAddress: {
      street: "",
      city: "",
      postCode: "",
      country: "United Kingdom",
    },
    items: [{ id: "i1", name: "Logo Re-design", quantity: 1, price: 3102.04 }],
    total: 3102.04,
  },
];

function calcTotal(items: Invoice["items"]): number {
  return items.reduce((sum, it) => sum + it.quantity * it.price, 0);
}

export function InvoiceProvider({ children }: { children: ReactNode }) {
  const [invoices, setInvoices] = useLocalStorage<Invoice[]>(
    "invoicely-invoices",
    seed,
  );
  const [filters, setFilters] = useLocalStorage<InvoiceStatus[]>(
    "invoicely-filters",
    [],
  );

  const filtered = useMemo(
    () =>
      filters.length === 0
        ? invoices
        : invoices.filter((i) => filters.includes(i.status)),
    [invoices, filters],
  );

  const getById = useCallback(
    (id: string) => invoices.find((i) => i.id === id),
    [invoices],
  );

  const createInvoice: InvoiceCtx["createInvoice"] = (data, status) => {
    const inv: Invoice = {
      ...data,
      id: generateInvoiceId(),
      status,
      paymentDue: addDays(data.createdAt, data.paymentTerms),
      total: calcTotal(data.items),
    };
    setInvoices([inv, ...invoices]);
    return inv;
  };

  const updateInvoice: InvoiceCtx["updateInvoice"] = (id, data) => {
    setInvoices(
      invoices.map((i) =>
        i.id === id
          ? {
              ...i,
              ...data,
              status: i.status === "draft" ? "pending" : i.status,
              paymentDue: addDays(data.createdAt, data.paymentTerms),
              total: calcTotal(data.items),
            }
          : i,
      ),
    );
  };

  const deleteInvoice = (id: string) =>
    setInvoices(invoices.filter((i) => i.id !== id));

  const markAsPaid = (id: string) =>
    setInvoices(
      invoices.map((i) =>
        i.id === id && i.status === "pending" ? { ...i, status: "paid" } : i,
      ),
    );

  return (
    <Ctx.Provider
      value={{
        invoices,
        filters,
        setFilters,
        filtered,
        getById,
        createInvoice,
        updateInvoice,
        deleteInvoice,
        markAsPaid,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useInvoiceCtx() {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error("useInvoiceCtx must be used inside InvoiceProvider");
  return ctx;
}
