// api/listings.js
const FIREBASE_DB_URL = "https://supercell-583cf-default-rtdb.firebaseio.com";

const ALLOWED_SECTIONS = new Set(["group", "channel", "page", "market"]);

export default async function handler(req, res) {
  // تنظیم هدرهای CORS و کش کوتاه‌مدت
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const rawSection = typeof req.query.section === "string" ? req.query.section.trim() : "";

    if (rawSection && !ALLOWED_SECTIONS.has(rawSection)) {
      return res.status(400).json({
        ok: false,
        error: "Invalid section. Allowed values: group, channel, page, market"
      });
    }

    const endpoint = rawSection
      ? `${FIREBASE_DB_URL}/${rawSection}.json`
      : `${FIREBASE_DB_URL}/.json`;

    const fbRes = await fetch(endpoint, {
      headers: {
        "Accept": "application/json"
      }
    });

    if (!fbRes.ok) {
      return res.status(fbRes.status).json({
        ok: false,
        error: `Firebase error: ${fbRes.statusText}`
      });
    }

    const data = await fbRes.json();

    // کش مختصر برای افزایش سرعت و کاهش بار روی فایربیس
    res.setHeader("Cache-Control", "s-maxage=10, stale-while-revalidate=30");

    if (rawSection) {
      return res.status(200).json({
        ok: true,
        section: rawSection,
        items: data || {}
      });
    }

    return res.status(200).json({
      ok: true,
      data: {
        group: data?.group || {},
        channel: data?.channel || {},
        page: data?.page || {},
        market: data?.market || {}
      }
    });
  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(500).json({
      ok: false,
      error: "Failed to fetch data from Firebase Realtime Database"
    });
  }
}
