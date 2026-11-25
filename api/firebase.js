// api/firebase.js
const DB_URL = "https://supercell-583cf-default-rtdb.firebaseio.com";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { path = "" } = req.query;
    const cleanPath = String(path).replace(/^\/+|\/+$/g, "");
    const targetUrl = `${DB_URL}/${cleanPath}.json`;

    const fetchOptions = {
      method: req.method,
      headers: { "Content-Type": "application/json" }
    };

    if (["POST", "PUT", "PATCH"].includes(req.method) && req.body) {
      fetchOptions.body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    }

    const fbRes = await fetch(targetUrl, fetchOptions);
    const data = await fbRes.json();

    return res.status(fbRes.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: "خطا در ارتباط با دیتابیس", details: error.message });
  }
}
