const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

// Access key is public by design (Web3Forms scopes submissions to it, not a
// secret) — still kept in an env var so it isn't hardcoded into the source.
const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

// Submits a form to Web3Forms, which relays it by email. `fields` becomes
// the email body (falsy values are skipped); `files` are attached directly.
export async function submitToWeb3Forms({ subject, fields, files = [] }) {
  if (!ACCESS_KEY) {
    throw new Error("VITE_WEB3FORMS_ACCESS_KEY is not configured");
  }

  const formData = new FormData();
  formData.append("access_key", ACCESS_KEY);
  formData.append("subject", subject);
  for (const [key, value] of Object.entries(fields)) {
    if (value) formData.append(key, value);
  }
  files.forEach((file) => formData.append("attachment", file));

  const response = await fetch(WEB3FORMS_ENDPOINT, {
    method: "POST",
    headers: { Accept: "application/json" },
    body: formData,
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Web3Forms submission failed");
  }
  return data;
}
