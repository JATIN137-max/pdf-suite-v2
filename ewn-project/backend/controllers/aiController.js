// controllers/aiController.js
// Handles Solvent AI chat requests: verifies the user hasn't exceeded
// their daily message cap, then calls the Gemini API server-side so the
// API key never reaches the browser.

const User = require('../models/User');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-3.5-flash'; // good free-tier quota; swap to
// 'gemini-3.1-flash-lite' for an even cheaper/higher-quota option.
// Google renames/retires models occasionally - if this ever 404s, check
// the current model list at https://ai.google.dev/gemini-api/docs/models
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

// How many messages ONE logged-in user can send per day.
// This must stay comfortably under Google's project-wide free-tier daily
// cap (currently in the ballpark of ~1,500 requests/day for Flash models,
// but Google changes this without notice - verify at
// https://aistudio.google.com/rate-limit before relying on a number).
// 20/user/day means ~75 active users/day stays safely within a
// 1,500/day project budget, with headroom to spare.
const DAILY_LIMIT_PER_USER = 20;

function todayString() {
  return new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD' in UTC
}

exports.chat = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ message: 'Message is required.' });
    }
    if (message.length > 4000) {
      return res.status(400).json({ message: 'That message is too long.' });
    }
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set in the environment.');
      return res.status(500).json({ message: 'Solvent AI is not configured yet. Please try again later.' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Reset the counter if it's a new day
    const today = todayString();
    if (user.aiUsageDate !== today) {
      user.aiUsageDate = today;
      user.aiUsageCount = 0;
    }

    if (user.aiUsageCount >= DAILY_LIMIT_PER_USER) {
      return res.status(429).json({
        message: `You've reached today's limit of ${DAILY_LIMIT_PER_USER} Solvent AI messages. It resets at midnight (UTC).`,
        limitReached: true,
      });
    }

    // Build a short rolling history so Gemini has context. Capped to the
    // last 10 turns so requests stay small and cheap.
    const contents = [];
    if (Array.isArray(history)) {
      history.slice(-10).forEach((turn) => {
        if (turn && turn.role && turn.text) {
          contents.push({
            role: turn.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: String(turn.text).slice(0, 4000) }],
          });
        }
      });
    }
    contents.push({ role: 'user', parts: [{ text: message.trim() }] });

    const geminiRes = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: { maxOutputTokens: 1024, temperature: 0.7 },
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('Gemini API error:', geminiRes.status, errText);
      if (geminiRes.status === 429) {
        return res.status(503).json({ message: 'Solvent AI is busy right now (site-wide limit reached). Please try again in a few minutes.' });
      }
      return res.status(502).json({ message: 'Solvent AI could not process that. Please try again.' });
    }

    const data = await geminiRes.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') ||
      "Sorry, I couldn't generate a response for that. Try rephrasing?";

    user.aiUsageCount += 1;
    await user.save();

    res.json({
      reply,
      remaining: Math.max(0, DAILY_LIMIT_PER_USER - user.aiUsageCount),
      limit: DAILY_LIMIT_PER_USER,
    });
  } catch (error) {
    console.error('Solvent AI chat error:', error);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};