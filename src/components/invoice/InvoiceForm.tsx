import { useEffect, useId, useState } from "react";
import { Trash2, Plus } from "lucide-react";
import type { Invoice, InvoiceItem } from "@/types/invoice";
import { Input, Select, DatePicker } from "../ui/FormFields";
import { Button } from "../ui/AppButton";
import { Modal } from "../ui/AppModal";
import { generateUid } from "@/utils/generateId";
import { formatCurrency } from "@/utils/formatCurrency";

type FormState = Omit<Invoice, "id" | "paymentDue" | "total" | "status">;

const empty: FormState = {
  createdAt: new Date().toISOString(),
  paymentTerms: 30,
  description: "",
  clientName: "",
  clientEmail: "",
  senderAddress: { street: "", city: "", postCode: "", country: "" },
  clientAddress: { street: "", city: "", postCode: "", country: "" },
  items: [],
};

const TERMS = [
  { value: "1", label: "Net 1 Day" },
  { value: "7", label: "Net 7 Days" },
  { value: "14", label: "Net 14 Days" },
  { value: "30", label: "Net 30 Days" },
];

interface Props {
  open: boolean;
  onClose: () => void;
  initial?: Invoice | null;
  onSaveChanges?: (data: FormState) => void;
  onSaveDraft?: (data: FormState) => void;
  onSaveSend?: (data: FormState) => void;
}

export function InvoiceForm({
  open,
  onClose,
  initial,
  onSaveChanges,
  onSaveDraft,
  onSaveSend,
}: Props) {
  const titleId = useId();
  const isEdit = !!initial;
  const [state, setState] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitAttempt, setSubmitAttempt] = useState<
    "draft" | "send" | "save" | null
  >(null);

  useEffect(() => {
    if (open) {
      setErrors({});
      setSubmitAttempt(null);
      if (initial) {
        const {
          id: _id,
          paymentDue: _pd,
          total: _t,
          status: _s,
          ...rest
        } = initial;
        setState({ ...rest });
      } else {
        setState({ ...empty, createdAt: new Date().toISOString() });
      }
    }
  }, [open, initial]);

  function patch<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }

  function patchAddress(
    group: "senderAddress" | "clientAddress",
    key: keyof FormState["senderAddress"],
    value: string,
  ) {
    setState((s) => ({ ...s, [group]: { ...s[group], [key]: value } }));
  }

  function addItem() {
    setState((s) => ({
      ...s,
      items: [
        ...s.items,
        { id: generateUid(), name: "", quantity: 1, price: 0 },
      ],
    }));
  }

  function patchItem(
    id: string,
    key: keyof InvoiceItem,
    value: string | number,
  ) {
    setState((s) => ({
      ...s,
      items: s.items.map((it) => (it.id === id ? { ...it, [key]: value } : it)),
    }));
  }

  function removeItem(id: string) {
    setState((s) => ({ ...s, items: s.items.filter((it) => it.id !== id) }));
  }

  function validate(strict: boolean): Record<string, string> {
    const e: Record<string, string> = {};
    if (strict) {
      if (!state.senderAddress.street.trim())
        e["senderAddress.street"] = "can't be empty";
      if (!state.senderAddress.city.trim())
        e["senderAddress.city"] = "can't be empty";
      if (!state.senderAddress.postCode.trim())
        e["senderAddress.postCode"] = "can't be empty";
      if (!state.senderAddress.country.trim())
        e["senderAddress.country"] = "can't be empty";
      if (!state.clientName.trim()) e["clientName"] = "can't be empty";
      if (!state.clientEmail.trim()) e["clientEmail"] = "can't be empty";
      else if (!/^\S+@\S+\.\S+$/.test(state.clientEmail))
        e["clientEmail"] = "invalid email";
      if (!state.clientAddress.street.trim())
        e["clientAddress.street"] = "can't be empty";
      if (!state.clientAddress.city.trim())
        e["clientAddress.city"] = "can't be empty";
      if (!state.clientAddress.postCode.trim())
        e["clientAddress.postCode"] = "can't be empty";
      if (!state.clientAddress.country.trim())
        e["clientAddress.country"] = "can't be empty";
      if (!state.description.trim()) e["description"] = "can't be empty";
      if (state.items.length === 0) e["items"] = "Add at least one item";
      state.items.forEach((it) => {
        if (!it.name.trim()) e[`item.${it.id}.name`] = "required";
        if (it.quantity <= 0) e[`item.${it.id}.quantity`] = "> 0";
        if (it.price <= 0) e[`item.${it.id}.price`] = "> 0";
      });
    } else {
      // draft: only require sender street as a baseline
      if (state.items.some((it) => it.quantity < 0))
        e["items"] = "Quantity must be positive";
      if (state.items.some((it) => it.price < 0))
        e["items"] = "Price must be positive";
    }
    return e;
  }

  function submit(action: "draft" | "send" | "save") {
    setSubmitAttempt(action);
    const strict = action !== "draft";
    const e = validate(strict);
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    if (action === "draft") onSaveDraft?.(state);
    else if (action === "send") onSaveSend?.(state);
    else onSaveChanges?.(state);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} variant="drawer" labelledBy={titleId}>
      <div className="flex flex-col h-full">
        <div className="px-6 sm:px-12 lg:px-14 pt-12 pb-6 flex-1 overflow-y-auto">
          <h2 id={titleId} className="text-2xl font-bold tracking-tight mb-10">
            {isEdit ? (
              <>
                Edit <span className="text-muted-foreground">#</span>
                {initial!.id}
              </>
            ) : (
              "New Invoice"
            )}
          </h2>

          {/* Bill From */}
          <h3 className="text-base font-bold text-primary mb-6">Bill From</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <Input
              label="Street Address"
              wrapperClassName="col-span-2 md:col-span-3"
              value={state.senderAddress.street}
              onChange={(e) =>
                patchAddress("senderAddress", "street", e.target.value)
              }
              error={errors["senderAddress.street"]}
            />
            <Input
              label="City"
              value={state.senderAddress.city}
              onChange={(e) =>
                patchAddress("senderAddress", "city", e.target.value)
              }
              error={errors["senderAddress.city"]}
            />
            <Input
              label="Post Code"
              value={state.senderAddress.postCode}
              onChange={(e) =>
                patchAddress("senderAddress", "postCode", e.target.value)
              }
              error={errors["senderAddress.postCode"]}
            />
            <Input
              label="Country"
              wrapperClassName="col-span-2 md:col-span-1"
              value={state.senderAddress.country}
              onChange={(e) =>
                patchAddress("senderAddress", "country", e.target.value)
              }
              error={errors["senderAddress.country"]}
            />
          </div>

          {/* Bill To */}
          <h3 className="text-base font-bold text-primary mt-12 mb-6">
            Bill To
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <Input
              label="Client's Name"
              wrapperClassName="col-span-2 md:col-span-3"
              value={state.clientName}
              onChange={(e) => patch("clientName", e.target.value)}
              error={errors["clientName"]}
            />
            <Input
              label="Client's Email"
              type="email"
              placeholder="e.g. email@example.com"
              wrapperClassName="col-span-2 md:col-span-3"
              value={state.clientEmail}
              onChange={(e) => patch("clientEmail", e.target.value)}
              error={errors["clientEmail"]}
            />
            <Input
              label="Street Address"
              wrapperClassName="col-span-2 md:col-span-3"
              value={state.clientAddress.street}
              onChange={(e) =>
                patchAddress("clientAddress", "street", e.target.value)
              }
              error={errors["clientAddress.street"]}
            />
            <Input
              label="City"
              value={state.clientAddress.city}
              onChange={(e) =>
                patchAddress("clientAddress", "city", e.target.value)
              }
              error={errors["clientAddress.city"]}
            />
            <Input
              label="Post Code"
              value={state.clientAddress.postCode}
              onChange={(e) =>
                patchAddress("clientAddress", "postCode", e.target.value)
              }
              error={errors["clientAddress.postCode"]}
            />
            <Input
              label="Country"
              wrapperClassName="col-span-2 md:col-span-1"
              value={state.clientAddress.country}
              onChange={(e) =>
                patchAddress("clientAddress", "country", e.target.value)
              }
              error={errors["clientAddress.country"]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            <DatePicker
              label="Invoice Date"
              value={state.createdAt}
              onChange={(iso) => patch("createdAt", iso)}
              disabled={isEdit}
            />
            <Select
              label="Payment Terms"
              options={TERMS}
              value={String(state.paymentTerms)}
              onChange={(e) => patch("paymentTerms", Number(e.target.value))}
            />
          </div>
          <div className="mt-6">
            <Input
              label="Project Description"
              placeholder="e.g. Graphic Design Service"
              value={state.description}
              onChange={(e) => patch("description", e.target.value)}
              error={errors["description"]}
            />
          </div>

          {/* Items */}
          <h3 className="text-lg md:text-xl font-bold text-muted-foreground mt-16 mb-6">
            Item List
          </h3>
          {state.items.length > 0 && (
            <div className="hidden md:grid grid-cols-[1fr_80px_120px_80px_24px] gap-4 mb-3 text-xs text-secondary-foreground">
              <span>Item Name</span>
              <span>Qty.</span>
              <span>Price</span>
              <span>Total</span>
              <span />
            </div>
          )}
          <ul className="space-y-4">
            {state.items.map((it) => {
              const total = it.quantity * it.price;
              return (
                <li
                  key={it.id}
                  className="grid grid-cols-2 md:grid-cols-[1fr_80px_120px_80px_24px] gap-4 items-end"
                >
                  <Input
                    label="Item Name"
                    hideLabel
                    wrapperClassName="col-span-2 md:col-span-1"
                    value={it.name}
                    onChange={(e) => patchItem(it.id, "name", e.target.value)}
                    error={errors[`item.${it.id}.name`]}
                  />
                  <Input
                    label="Qty."
                    hideLabel
                    type="number"
                    min={0}
                    value={it.quantity}
                    onChange={(e) =>
                      patchItem(it.id, "quantity", Number(e.target.value))
                    }
                    error={errors[`item.${it.id}.quantity`]}
                  />
                  <Input
                    label="Price"
                    hideLabel
                    type="number"
                    min={0}
                    step="0.01"
                    value={it.price}
                    onChange={(e) =>
                      patchItem(it.id, "price", Number(e.target.value))
                    }
                    error={errors[`item.${it.id}.price`]}
                  />
                  <div className="text-sm font-bold text-muted-foreground self-center">
                    {formatCurrency(total)}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(it.id)}
                    aria-label="Remove item"
                    className="self-center text-muted-foreground hover:text-destructive transition-colors p-2 focus-ring rounded cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            onClick={addItem}
            className="mt-6 w-full h-12 rounded-full bg-secondary text-secondary-foreground font-bold text-sm hover:bg-secondary/70 dark:hover:bg-secondary/80 transition-colors focus-ring inline-flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" strokeWidth={3} /> Add New Item
          </button>

          {submitAttempt && Object.keys(errors).length > 0 && (
            <p role="alert" className="mt-6 text-xs font-bold text-destructive">
              - All fields must be added
              {errors["items"] && (
                <>
                  <br />- {errors["items"]}
                </>
              )}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 sm:px-12 lg:px-14 py-6 bg-card shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
          {isEdit ? (
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={() => submit("save")}>Save Changes</Button>
            </div>
          ) : (
            <div className="flex justify-between gap-2">
              <Button variant="secondary" onClick={onClose}>
                Discard
              </Button>
              <div className="flex gap-2">
                <Button variant="dark" onClick={() => submit("draft")}>
                  Save as Draft
                </Button>
                <Button onClick={() => submit("send")}>Save &amp; Send</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
