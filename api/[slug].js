const fetch = require("node-fetch");

const NOTION_API_KEY = process.env.NOTION_API_KEY; // Environment variable in Vercel
const DATABASE_ID = process.env.DATABASE_ID; // Environment variable in Vercel

export default async function handler(req, res) {
    const slug = req.query.slug; // Extract the slug from the URL

    if (!slug) {
        console.log("Missing slug: Redirecting to homepage");
        res.redirect(301, "https://www.chadandmia.com"); // Redirect to homepage if no slug is provided
        return;
    }

    try {
        // Query Notion database for the slug
        const notionResponse = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${NOTION_API_KEY}`,
                "Notion-Version": "2022-06-28",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                filter: {
                    property: "Slug",
                    text: { equals: slug },
                },
            }),
        });

        const notionData = await notionResponse.json();

        // Check if a matching slug exists in the database
        if (notionData.results.length > 0) {
            const record = notionData.results[0];
            const longUrl = record.properties["Long URL"].url; // Adjust field names if necessary

            console.log(`Slug found: Redirecting to ${longUrl}`);
            res.redirect(301, longUrl); // Redirect to the long URL
        } else {
            console.log(`Slug "${slug}" not found: Redirecting to homepage`);
            res.redirect(301, "https://www.chadandmia.com"); // Redirect to homepage if slug not found
        }
    } catch (error) {
        console.error("Error querying Notion or handling slug:", error);
        res.status(500).json({ error: "Internal Server Error" }); // Return a 500 error for server issues
    }
}