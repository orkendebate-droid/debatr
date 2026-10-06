const ALLOWED_ROLES = new Set(['system', 'developer', 'user', 'assistant']);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.AI_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(503).json({ error: 'AI_API_KEY is not configured on Vercel' });

  const { messages, isJson = false, maxTokens = 1200 } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 30 ||
      messages.some(message => !message || !ALLOWED_ROLES.has(message.role) || typeof message.content !== 'string')) {
    return res.status(400).json({ error: 'Invalid messages payload' });
  }

  const configuredModel = process.env.AI_MODEL || 'gpt-4o-mini';
  const models = [...new Set([configuredModel, 'gpt-4o-mini'])];

  try {
    let lastError = 'OpenAI API failed';
    for (const model of models) {
      const payload = {
        model,
        messages,
        max_tokens: Math.min(Math.max(Number(maxTokens) || 1200, 128), 4000),
        temperature: isJson ? 0.3 : 0.75
      };
      if (isJson) payload.response_format = { type: 'json_object' };
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        lastError = data.error?.message || `OpenAI API failed: ${response.status}`;
        console.error(`OpenAI API error for ${model}:`, lastError);
        continue;
      }

      const content = data.choices?.[0]?.message?.content;
      if (typeof content === 'string' && content.trim()) return res.status(200).json({ content });
      lastError = `OpenAI returned an empty response for ${model}`;
    }
    return res.status(502).json({ error: lastError });
  } catch (error) {
    console.error('OpenAI request failed:', error);
    return res.status(502).json({ error: 'Could not reach OpenAI API' });
  }
};
