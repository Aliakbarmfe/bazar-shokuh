// api/imgbb.js
const IMGBB_API_KEY = "32b44cf4a92e03d876d7d02104feabfb";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "فقط متد POST مجاز است" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { image } = body;

    if (!image) {
      return res.status(400).json({ error: "تصویری ارسال نشده است" });
    }

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    const formData = new URLSearchParams();
    formData.append("key", IMGBB_API_KEY);
    formData.append("image", base64Data);

    const imgRes = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: formData
    });

    const data = await imgRes.json();

    if (!data.success) {
      return res.status(400).json({ error: "خطا در آپلود تصویر در imgbb", details: data });
    }

    return res.status(200).json({ url: data.data.url });
  } catch (error) {
    return res.status(500).json({ error: "خطای سرور در آپلود عکس", details: error.message });
  }
}
