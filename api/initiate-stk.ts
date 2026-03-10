const FLOWCASH_URL = "https://flowcash.co.ke/v1/initiatestk";
const DEFAULT_CALLBACK_URL = "https://limits-kenya.vercel.app/api/flowcash-callback";

const normalizePhone = (value: string) => {
  const cleaned = value.replace(/\s/g, "");
  if (cleaned.startsWith("07")) return `254${cleaned.slice(1)}`;
  return cleaned;
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.FLOWCASH_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Missing FLOWCASH_API_KEY" });
  }

  const { amount, msisdn, reference } = req.body ?? {};

  if (!amount || !msisdn || !reference) {
    return res.status(400).json({
      error: "amount, msisdn, and reference are required",
    });
  }

  const payload = {
    api_key: apiKey,
    email: "waltersimmons5670@gmail.com",
    amount: String(amount),
    msisdn: normalizePhone(String(msisdn)),
    reference: String(reference),
    callback_url: process.env.FLOWCASH_CALLBACK_URL ?? DEFAULT_CALLBACK_URL,
  };

  try {
    const response = await fetch(FLOWCASH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    if (!response.ok) {
      return res.status(response.status).send(text || "FlowCash request failed");
    }

    return res.status(200).send(text);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return res.status(502).json({ error: message });
  }
}
