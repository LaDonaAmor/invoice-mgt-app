import { ChevronLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useInvoiceCtx } from "@/context/InvoiceContext";
import { Button } from "../ui/AppButton";
import { StatusBadge } from "../ui/StatusBadge";
import { Modal } from "../ui/AppModal";
import { InvoiceForm } from "./InvoiceForm";
import { formatDate } from "@/utils/formatDate";
import { formatCurrency } from "@/utils/formatCurrency";

export function InvoiceDetail() {
  const { id = "" } = useParams();
  const nav = useNavigate();
  const { getById, deleteInvoice, markAsPaid, updateInvoice } = useInvoiceCtx();
  const inv = getById(id);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!inv) {
    return (
      <div className="space-y-6">
        <Link
          to="/"
          className="inline-flex items-center gap-4 text-sm font-bold hover:text-muted-foreground focus-ring rounded"
        >
          <ChevronLeft className="h-3 w-3 text-primary" /> Go back
        </Link>
        <p className="text-muted-foreground">Invoice not found.</p>
      </div>
    );
  }

  return (
    <article className="space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-4 text-sm font-bold hover:text-muted-foreground focus-ring rounded"
      >
        <ChevronLeft className="h-3 w-3 text-primary" /> Go back
      </Link>

      <div className="bg-card rounded-lg p-6 md:p-8 flex items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-5">
          <span className="text-xs text-muted-foreground">Status</span>
          <StatusBadge status={inv.status} />
        </div>
        <div className="hidden md:flex items-center gap-2">
          <Button variant="secondary" onClick={() => setEditOpen(true)}>
            Edit
          </Button>
          <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
            Delete
          </Button>
          <Button
            onClick={() => markAsPaid(inv.id)}
            disabled={inv.status !== "pending"}
          >
            Mark as Paid
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 md:p-12 space-y-10 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div>
            <h1 className="text-base font-bold tracking-tight">
              <span className="text-muted-foreground">#</span>
              {inv.id}
            </h1>
            <p className="text-xs text-muted-foreground mt-2">
              {inv.description || "—"}
            </p>
          </div>
          <address className="not-italic text-xs text-muted-foreground md:text-right leading-relaxed">
            {inv.senderAddress.street}
            <br />
            {inv.senderAddress.city}
            <br />
            {inv.senderAddress.postCode}
            <br />
            {inv.senderAddress.country}
          </address>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          <div className="space-y-8">
            <div>
              <p className="text-xs text-muted-foreground mb-3">Invoice Date</p>
              <p className="text-base font-bold tracking-tight">
                {formatDate(inv.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-3">Payment Due</p>
              <p className="text-base font-bold tracking-tight">
                {formatDate(inv.paymentDue)}
              </p>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-3">Bill To</p>
            <p className="text-base font-bold tracking-tight">
              {inv.clientName || "—"}
            </p>
            <address className="not-italic text-xs text-muted-foreground mt-2 leading-relaxed">
              {inv.clientAddress.street}
              <br />
              {inv.clientAddress.city}
              <br />
              {inv.clientAddress.postCode}
              <br />
              {inv.clientAddress.country}
            </address>
          </div>
          <div className="col-span-2 md:col-span-1">
            <p className="text-xs text-muted-foreground mb-3">Sent to</p>
            <p className="text-base font-bold tracking-tight break-all">
              {inv.clientEmail || "—"}
            </p>
          </div>
        </div>

        <div className="rounded-lg overflow-hidden bg-muted">
          <div className="p-6 md:p-8">
            <div className="hidden md:grid grid-cols-[1fr_80px_120px_120px] gap-4 text-xs text-muted-foreground mb-6">
              <span>Item Name</span>
              <span className="text-center">QTY.</span>
              <span className="text-right">Price</span>
              <span className="text-right">Total</span>
            </div>
            <ul className="space-y-6">
              {inv.items.map((it) => (
                <li
                  key={it.id}
                  className="grid grid-cols-2 md:grid-cols-[1fr_80px_120px_120px] gap-4 items-center"
                >
                  <div>
                    <p className="text-sm font-bold tracking-tight">
                      {it.name}
                    </p>
                    <p className="text-sm font-bold text-muted-foreground md:hidden mt-2">
                      {it.quantity} x {formatCurrency(it.price)}
                    </p>
                  </div>
                  <p className="hidden md:block text-sm font-bold text-muted-foreground text-center">
                    {it.quantity}
                  </p>
                  <p className="hidden md:block text-sm font-bold text-muted-foreground text-right">
                    {formatCurrency(it.price)}
                  </p>
                  <p className="text-sm font-bold tracking-tight text-right">
                    {formatCurrency(it.quantity * it.price)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-total-bg text-total-fg p-6 md:p-8 flex items-center justify-between">
            <span className="text-xs">Amount Due</span>
            <span className="text-xl md:text-2xl font-bold tracking-tight">
              {formatCurrency(inv.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile actions */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card p-5 flex items-center justify-center gap-2 z-20">
        <Button variant="secondary" onClick={() => setEditOpen(true)}>
          Edit
        </Button>
        <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
          Delete
        </Button>
        <Button
          onClick={() => markAsPaid(inv.id)}
          disabled={inv.status !== "pending"}
        >
          Mark as Paid
        </Button>
      </div>

      <InvoiceForm
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initial={inv}
        onSaveChanges={(data) => updateInvoice(inv.id, data)}
      />

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        labelledBy="confirm-title"
      >
        <h2
          id="confirm-title"
          className="text-2xl font-bold tracking-tight mb-3"
        >
          Confirm Deletion
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          Are you sure you want to delete invoice #{inv.id}? This action cannot
          be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              deleteInvoice(inv.id);
              nav("/");
            }}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </article>
  );
}
