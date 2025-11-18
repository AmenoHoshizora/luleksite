export default async function handler(req, res) {
  // Set allowed origins
  const allowedOrigins = [
    "https://luliyykitty.site", // replace with your live site
    "http://127.0.0.1:5500",             // allow local dev
    "http://localhost:3000"              // optional if using localhost dev server
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const query = req.query.q;
  if (!query) return res.status(400).json({ error: "Missing search query." });

  const apiKey = process.env.YOUTUBE_API_KEY;
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(
    query
  )}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return res.status(404).json({ error: "No results found." });
    }

    const video = data.items[0];
    const videoId = video.id.videoId;
    const title = video.snippet.title;
    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

    return res.status(200).json({
      title,
      url: youtubeUrl,
      id: videoId
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error." });
  }
}
