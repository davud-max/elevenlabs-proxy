export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { apiKey, voiceId, text } = req.body;
  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg'
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: { stability: 0.5, similarity_boost: 0.75 }
        })
      }
    );
    if (!response.ok) {
      const err = await response.text();
      return res.status(500).json({ success: false, error: err });
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    res.json({ success: true, audio: buffer.toString('base64') });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
}
