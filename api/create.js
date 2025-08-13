export default async function handler(req, res) {
  // Try multiple header variations (Vercel may lowercase headers)
  const headerSecret = req.headers['secret'] || req.headers['Secret'] || req.headers['x-secret'] || req.headers['authorization'];
  const bodySecret = req.body?.secret;
  
  // Debug logging
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body:', JSON.stringify(req.body, null, 2));
  console.log('Header secret:', headerSecret);
  console.log('Body secret:', bodySecret);
  console.log('Expected secret:', process.env.WEBHOOK_SECRET);
  
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