import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    projectId: 'rudraksha-design-studio',
  });
}

const ADMIN_EMAIL = 'admin@gmail.com';

export default async function handler(req, res) {
  // 1. Verify Authorization Header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split('Bearer ')[1];
  let decodedToken;

  try {
    decodedToken = await admin.auth().verifyIdToken(token);
    if (decodedToken.email !== ADMIN_EMAIL) {
      return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }
  } catch (error) {
    console.error('Auth Error:', error);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }

  // 2. Handle Methods
  const GITHUB_TOKEN = process.env.VITE_GITHUB_TOKEN;
  const GITHUB_USER = process.env.VITE_GITHUB_USER;
  const GITHUB_REPO = process.env.VITE_GITHUB_REPO;

  if (!GITHUB_TOKEN || !GITHUB_USER || !GITHUB_REPO) {
    return res.status(500).json({ message: 'GitHub configuration missing' });
  }

  if (req.method === 'POST') {
    const { fileName, content, path } = req.body;
    try {
      const url = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${path}/${fileName}`;
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Upload ${fileName} via Admin Dashboard`,
          content: content, 
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload to GitHub');
      }

      const downloadUrl = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/main/${path}/${fileName}`;
      return res.status(200).json({ url: downloadUrl });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } 
  
  if (req.method === 'DELETE') {
    const { path } = req.query; // e.g. ?path=public/uploads/...
    if (!path) return res.status(400).json({ message: 'Path is required' });

    try {
      const url = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${path}`;
      
      // Get SHA first
      const getRes = await fetch(url, {
        headers: { Authorization: `Bearer ${GITHUB_TOKEN}` }
      });
      
      if (!getRes.ok) {
        return res.status(getRes.status).json({ message: 'File not found on GitHub' });
      }
      
      const fileData = await getRes.json();
      
      const delRes = await fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Delete ${path} via Admin Dashboard`,
          sha: fileData.sha
        })
      });

      if (!delRes.ok) {
        const error = await delRes.json();
        throw new Error(error.message || 'Failed to delete from GitHub');
      }

      return res.status(200).json({ message: 'Deleted successfully' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}

