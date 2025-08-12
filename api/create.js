export default async function handler(req, res) {
  const headerSecret = req.headers['secret'];
  const bodySecret = req.body?.secret;
  
  const providedSecret = headerSecret || bodySecret;
  
  if (providedSecret !== process.env.WEBHOOK_SECRET) {
    return res.status(403).json({ error: 'Invalid secret' });
  }

  const { question, answer } = req.body;

  try {
    // 🚀 Call your existing coco_faq_api_vercel_app endpoint
    const apiRes = await fetch("https://coco-faq-api.vercel.app/api/faq-create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
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