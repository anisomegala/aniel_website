import crypto from 'crypto';

export default async function handler(req, res) {
    const { email } = req.body;

    if (!email || !email.length) {
        return res.status(400).json({ error: 'Email is required' });
    }

    const API_KEY = process.env.MAILCHIMP_API_KEY;
    const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
    const DATACENTER = process.env.MAILCHIMP_DATACENTER;

    // 1. Generate an MD5 hash of the lowercase email (Required for Mailchimp member updates)
    const subscriberHash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');

    const baseUrl = `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`;
    const tagUrl = `${baseUrl}/${subscriberHash}/tags`;

    try {
        // Step A: Attempt to create/update the member
        // Using PUT instead of POST allows "Upsert" logic (Update or Insert)
        const response = await fetch(`${baseUrl}/${subscriberHash}`, {
            method: 'PUT',
            headers: {
                Authorization: `auth ${API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email_address: email,
                status_if_new: 'subscribed',
            }),
        });

        const result = await response.json();

        if (response.status >= 400 && result.title !== "Member Exists") {
            throw new Error(result.detail || "Error connecting to Mailchimp.");
        }

        // Step B: Explicitly add the tag to the member (Works for new and old members)
        const tagResponse = await fetch(tagUrl, {
            method: 'POST',
            headers: {
                Authorization: `auth ${API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tags: [{ name: 'newsletter_mail', status: 'active' }]
            }),
        });

        if (!tagResponse.ok) {
            console.error("Failed to apply tag to existing user");
        }

        return res.status(200).json({ message: 'Successfully joined the circle!' });

    } catch (error) {
        console.error("Mailchimp Error:", error);
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}