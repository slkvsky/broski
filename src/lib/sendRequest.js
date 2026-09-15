const ENDPOINT = "/api/send-request";
const MAX_FILES = 5;
const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.82;

// Phone photos routinely come in at 3-8MB — downscaling + re-encoding
// client-side keeps a handful of attachments comfortably under Vercel's
// serverless request-body limit without the user noticing any quality loss
// at email-viewing size.
function compressImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Image compression failed"));
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result.split(",")[1]);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        },
        "image/jpeg",
        JPEG_QUALITY,
      );
    };
    img.onerror = reject;
    img.src = url;
  });
}

// Sends a request to our own /api/send-request endpoint, which relays it by
// email via Resend. `fields` becomes the email body (falsy values are
// skipped); `files` (capped at MAX_FILES) are compressed and attached.
export async function submitContactRequest({ subject, fields, files = [] }) {
  const attachments = await Promise.all(
    files.slice(0, MAX_FILES).map(async (file) => ({
      filename: file.name,
      content: await compressImage(file),
    })),
  );

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subject, fields, attachments }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Request submission failed");
  }
  return data;
}
