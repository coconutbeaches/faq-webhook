export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { secret, question, answer } = req.body;

  // 🔒 Simple security check
  if (secret !== process.env.WEBHOOK_SECRET) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  try {
    // 🚀 Call your existing coco_faq_api_vercel_app endpoint
    const apiRes = await fetch("https://coco-faq-api.vercel.app/createFaq", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": \`Bearer \${process.env.COCO_FAQ_API_KEY}\`
      },
      body: JSON.stringify({
        question,
        answer
      })
    });

    const data = await apiRes.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
