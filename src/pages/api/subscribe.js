export default async function handler(req, res) {
    const { email } = req.body;

    if (!email || !email.length) {
        return res.status(400).json({ error: 'Email is required' });
    }

    const API_KEY = process.env.MAILCHIMP_API_KEY;
    const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
    const DATACENTER = process.env.MAILCHIMP_DATACENTER;

    // Mailchimp Marketing API URL
    const url = `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`;

    const data = {
        email_address: email,
        status: 'subscribed', // 'subscribed' or 'pending' for double opt-in
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `auth ${API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.status >= 400) {
            // Check if user is already subscribed
            if (result.title === "Member Exists") {
                return res.status(200).json({ message: "Already in the circle!" });
            }
            return res.status(400).json({ error: result.detail || "Error joining." });
        }

        return res.status(201).json({ message: 'Success' });
    } catch (error) {
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}