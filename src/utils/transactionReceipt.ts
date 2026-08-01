type ReceiptDetail = {
  label: string;
  value: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function buildTransactionReceiptHtml(details: ReceiptDetail[]): string {
  const rows = details
    .map(
      (item) => `
        <tr>
          <td class="label">${escapeHtml(item.label)}</td>
          <td class="value">${escapeHtml(item.value)}</td>
        </tr>`,
    )
    .join("");

  return `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      * { box-sizing: border-box; }
      body {
        font-family: -apple-system, Helvetica, Arial, sans-serif;
        margin: 0;
        padding: 32px;
        color: #1A1C1E;
      }
      .card {
        max-width: 480px;
        margin: 0 auto;
        border: 1px solid #E2E8F0;
        border-radius: 16px;
        padding: 32px;
      }
      .brand {
        font-size: 20px;
        font-weight: 700;
        color: #31973D;
        text-align: center;
        letter-spacing: 1px;
      }
      .title {
        font-size: 14px;
        color: #64748A;
        text-align: center;
        margin-top: 4px;
        margin-bottom: 24px;
      }
      .divider {
        border-top: 1px dashed #E2E8F0;
        margin: 0 0 24px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      td {
        padding: 10px 0;
        font-size: 13px;
        vertical-align: top;
      }
      td.label {
        color: #64748A;
      }
      td.value {
        color: #1A1C1E;
        font-weight: 600;
        text-align: right;
      }
      tr + tr td {
        border-top: 1px solid #F1F5F9;
      }
      .footer {
        margin-top: 24px;
        font-size: 11px;
        color: #94A3B7;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="brand">ZUBBA</div>
      <div class="title">Transaction Receipt</div>
      <div class="divider"></div>
      <table>${rows}</table>
      <div class="footer">Generated ${escapeHtml(new Date().toLocaleString())}</div>
    </div>
  </body>
</html>`;
}
