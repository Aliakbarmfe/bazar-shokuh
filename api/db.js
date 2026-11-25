const FIREBASE_DB_URL = 'https://supercell-583cf-default-rtdb.firebaseio.com';

const firebaseConfig = {
  apiKey: "AIzaSyBw2srsQ1v5_RjzrPHNseEtzRBjZAJnPMI",
  authDomain: "supercell-583cf.firebaseapp.com",
  databaseURL: FIREBASE_DB_URL,
  projectId: "supercell-583cf",
  storageBucket: "supercell-583cf.firebasestorage.app",
  messagingSenderId: "957141044144",
  appId: "1:957141044144:web:606bc9c5f97b9853aa2475"
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { category, id } = req.query;

  if (!category) {
    return res.status(400).json({ error: 'پارامتر category الزامی است.' });
  }

  const safeCat = String(category).replace(/[^a-zA-Z0-9_-]/g, '');
  const safeId = id ? String(id).replace(/[^a-zA-Z0-9_-]/g, '') : '';
  const targetUrl = safeId
    ? `${FIREBASE_DB_URL}/${safeCat}/${safeId}.json`
    : `${FIREBASE_DB_URL}/${safeCat}.json`;

  try {
    const fetchOptions = { method: req.method };

    if (req.method === 'POST' || req.method === 'PUT') {
      fetchOptions.headers = { 'Content-Type': 'application/json' };
      fetchOptions.body = JSON.stringify({
        ...req.body,
        _projectId: firebaseConfig.projectId
      });
    }

    const fbRes = await fetch(targetUrl, fetchOptions);
    const text = await fbRes.text();
    const data = text ? JSON.parse(text) : null;

    if (!fbRes.ok) {
      return res.status(fbRes.status).json({ error: 'خطا از سمت فایربیس', details: data });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'خطا در ارتباط با فایربیس از طریق ورسل', details: err.message });
  }
}
