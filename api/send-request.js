const RESEND_ENDPOINT = "https://api.resend.com/emails";
const TO_EMAIL = "broski.detailingg@gmail.com";
// Resend's shared sandbox sender works without a verified domain as long as
// the recipient is the Resend account's own address, which is the case here.
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Broski Website <onboarding@resend.dev>";

const MAX_ATTACHMENTS = 5;
const MAX_TOTAL_BYTES = 4 * 1024 * 1024; // stay under Vercel's request-body limit

const FIELD_LABELS = {
  name: "Name",
  contact: "Kontakt",
  phone: "Telefon",
  email: "E-Mail",
  address: "Adresse",
  message: "Nachricht",
  marke: "Marke",
  modell: "Modell",
  baujahr: "Baujahr",
  fahrzeuggroesse: "Fahrzeuggröße",
  leistung: "Leistung",
  extras: "Extras",
  richtpreis: "Richtpreis",
  company: "Firma",
  contactPerson: "Ansprechpartner",
  scope: "Anzahl/Umfang",
  leistungen: "Gewünschte Leistungen",
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildHtml(fields) {
  const rows = Object.entries(fields)
    .filter(([, value]) => value)
    .map(
      ([key, value]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#666;white-space:nowrap;vertical-align:top;">${escapeHtml(
          FIELD_LABELS[key] || key,
        )}</td><td style="padding:4px 0;">${escapeHtml(value).replace(/\n/g, "<br>")}</td></tr>`,
    )
    .join("");
  return `<table cellspacing="0" cellpadding="0">${rows}</table>`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ success: false, message: "Method not allowed" });
    return;
  }

  if (!process.env.RESEND_API_KEY) {
    res.status(500).json({ success: false, message: "RESEND_API_KEY is not configured" });
    return;
  }

  const { subject, fields, attachments = [] } = req.body || {};
  if (!subject || typeof fields !== "object") {
    res.status(400).json({ success: false, message: "Missing subject or fields" });
    return;
  }

  const safeAttachments = attachments.slice(0, MAX_ATTACHMENTS);
  const totalBytes = safeAttachments.reduce((sum, a) => sum + (a.content?.length || 0) * 0.75, 0);
  if (totalBytes > MAX_TOTAL_BYTES) {
    res.status(400).json({ success: false, message: "Attachments too large" });
    return;
  }

  try {
    const resendRes = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        reply_to: fields.email || undefined,
        subject,
        html: buildHtml(fields),
        attachments: safeAttachments.map((a) => ({ filename: a.filename, content: a.content })),
      }),
    });
    const data = await resendRes.json().catch(() => ({}));
    if (!resendRes.ok) {
      res.status(502).json({ success: false, message: data.message || "Resend request failed" });
      return;
    }
    res.status(200).json({ success: true });
  } catch {
    res.status(502).json({ success: false, message: "Failed to reach Resend" });
  }
}
