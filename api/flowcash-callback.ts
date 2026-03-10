export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const payload = req.body ?? {};
  const responseCode = Number(payload.ResponseCode);

  // Minimal acknowledgment for FlowCash callbacks
  if (Number.isNaN(responseCode)) {
    return res.status(400).json({ error: "Invalid callback payload" });
  }

  if (responseCode !== 0) {
    return res.status(200).json({ received: true, status: "failed" });
  }

  return res.status(200).json({ received: true, status: "success" });
}
