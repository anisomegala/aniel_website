export default async function handler(req, res) {
   
    const API_KEY = process.env.GOOGLE_CALENDAR_API_KEY;
    const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;
  
    if (!API_KEY || !CALENDAR_ID) {
    return res.status(500).json({ error: "Missing API credentials in environment" });
  }
  // Fetch events from now onwards
  const now = new Date().toISOString();
  const url = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${API_KEY}&timeMin=${now}&singleEvents=true&orderBy=startTime`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    
    // Map the Google data to a clean format for your UI
    const shows = data.items?.map(event => ({
      id: event.id,
      title: event.summary,
      date: event.start.dateTime || event.start.date,
      location: event.location || "TBA",
      link: event.description || "#", // You can put ticket links in the description
    })) || [];

    res.status(200).json(shows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch calendar data" });
  }
}