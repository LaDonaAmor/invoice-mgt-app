export type InvoiceStatus = "draft" | "pending" | "paid";

export interface Address {
  street: string;
  city: string;
  postCode: string;
  country: string;
}

export interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Invoice {
  id: string;
  createdAt: string;
  paymentDue: string;
  paymentTerms: number;
  description: string;
  status: InvoiceStatus;
  clientName: string;
  clientEmail: string;
  senderAddress: Address;
  clientAddress: Address;
  items: InvoiceItem[];
  total: number;
}

export type StatusFilter = InvoiceStatus[];
