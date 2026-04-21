const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function generateInvoiceId(): string {
  const l1 = LETTERS[Math.floor(Math.random() * LETTERS.length)];
  const l2 = LETTERS[Math.floor(Math.random() * LETTERS.length)];
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${l1}${l2}${num}`;
}

export function generateUid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
