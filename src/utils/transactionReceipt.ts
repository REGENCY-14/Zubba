type ReceiptDetail = {
  label: string;
  value: string;
};

export function buildTransactionReceipt(details: ReceiptDetail[]): string {
  const lines = [
    "ZUBBA TRANSACTION RECEIPT",
    "=========================",
    "",
    ...details.map((item) => `${item.label}: ${item.value}`),
    "",
    `Generated: ${new Date().toLocaleString()}`,
  ];

  return lines.join("\n");
}
