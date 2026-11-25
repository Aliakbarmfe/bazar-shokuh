import { firebaseConfig } from "./firebaseConfig.js";

const ALLOWED_CATEGORIES = {
  group: "group",
  channel: "channel",
  page: "page",
  market: "market"
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const rawCat = String(req.query.category || "").toLowerCase().trim();
  const category = ALLOWED_CATEGORIES[rawCat];

  if (!category) {
    return res.status(400).json({ error: "Invalid category" });
  }

  try {
    const baseUrl = firebaseConfig.databaseURL.replace(/\/+$/, "");
    const fbUrl = `${baseUrl}/${category}.json`;

    const response = await fetch(fbUrl);
    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch from Firebase" });
    }

    const data = await response.json();
    const list = [];

    if (data && typeof data === "object") {
      for (const [id, item] of Object.entries(data)) {
        if (item && typeof item === "object") {
          list.push({ id, ...item });
        }
      }
    }

    // جدیدترین محصولات ابتدا نمایش داده شوند
    list.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

    return res.status(200).json({ category, items: list });
  } catch (err) {
    return res.status(500).json({ error: "Proxy error", details: err.message });
  }
}
