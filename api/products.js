const { firebaseConfig, validSections } = require("./config");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "s-maxage=15, stale-while-revalidate=60");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const baseUrl = firebaseConfig.databaseURL.replace(/\/+$/, "");
    const section = typeof req.query.section === "string" ? req.query.section.trim() : "";

    if (section) {
      if (!validSections.includes(section)) {
        return res.status(400).json({ error: "Invalid section" });
      }

      const url = `${baseUrl}/${section}.json`;
      const fbRes = await fetch(url);

      if (!fbRes.ok) {
        return res.status(fbRes.status).json({ error: "Failed to fetch section from Firebase" });
      }

      const data = await fbRes.json();
      return res.status(200).json({ section, items: data || {} });
    }

    // دریافت همه بخش‌ها به صورت موازی در صورت عدم ارسال section
    const entries = await Promise.all(
      validSections.map(async (sec) => {
        const fbRes = await fetch(`${baseUrl}/${sec}.json`);
        if (!fbRes.ok) {
          throw new Error(`Firebase error on ${sec}: ${fbRes.status}`);
        }
        const data = await fbRes.json();
        return [sec, data || {}];
      })
    );

    return res.status(200).json(Object.fromEntries(entries));
  } catch (err) {
    console.error("API Proxy Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
