export default async function handler(req, res) {
    const CX = process.env.GOOGLE_SEARCH_CX;
    const API_KEY = process.env.GOOGLE_SEARCH_API_KEY;

    const query = "Aniel Someillan bassist musician";
    const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Map results to a clean format
        const articles = data.items?.map(item => ({
            title: item.title,
            link: item.link,
            snippet: item.snippet,
            displayLink: item.displayLink, // e.g., "jazztimes.com"
        })) || [];

        res.status(200).json(articles);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch articles" });
    }
}