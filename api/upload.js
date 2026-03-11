export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { fileName, content, path } = req.body;
  const GITHUB_TOKEN = process.env.VITE_GITHUB_TOKEN;
  const GITHUB_USER = process.env.VITE_GITHUB_USER;
  const GITHUB_REPO = process.env.VITE_GITHUB_REPO;

  if (!GITHUB_TOKEN || !GITHUB_USER || !GITHUB_REPO) {
    return res.status(500).json({ message: 'GitHub configuration missing' });
  }

  try {
    const url = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${path}/${fileName}`;
    
    // Check if file already exists to get SHA (for updates, though we use unique names)
    let sha;
    try {
      const getRes = await fetch(url, {
        headers: { Authorization: `Bearer ${GITHUB_TOKEN}` }
      });
      if (getRes.status === 200) {
        const data = await getRes.json();
        sha = data.sha;
      }
    } catch (e) {}

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Upload ${fileName} via Admin Dashboard`,
        content: content, // base64 string
        sha: sha
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload to GitHub');
    }

    const data = await response.json();
    const downloadUrl = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/main/${path}/${fileName}`;

    return res.status(200).json({ url: downloadUrl });
  } catch (error) {
    console.error('GitHub Upload Error:', error);
    return res.status(500).json({ message: error.message });
  }
}
