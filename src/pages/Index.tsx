import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { InvoiceList } from "@/components/invoice/InvoiceList";
import { InvoiceForm } from "@/components/invoice/InvoiceForm";
import { useInvoiceCtx } from "@/context/InvoiceContext";

export default function Index() {
  const [open, setOpen] = useState(false);
  const { createInvoice } = useInvoiceCtx();

  return (
    <Layout>
      <InvoiceList onNew={() => setOpen(true)} />
      <InvoiceForm
        open={open}
        onClose={() => setOpen(false)}
        onSaveDraft={(data) => createInvoice(data, "draft")}
        onSaveSend={(data) => createInvoice(data, "pending")}
      />
    </Layout>
  );
}
