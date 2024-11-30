const fetch = require("node-fetch");

const NOTION_API_KEY = "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"; // Replace with your Notion API key
const DATABASE_ID = "14e374aeac28804e99e9d12a0fff4203"; // Replace with your Notion Database ID

export default async function handler(req, res) {
    const slug = req.query.slug; // Extract the slug from the URL
    if (!slug) {
        res.redirect(301, "https://www.chadandmia.com"); // Redirect to homepage if no slug
        return;
    }

    // Query Notion database
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
    const record = notionData.results[0];

    if (record) {
        const longUrl = record.properties["Long URL"].url;
        res.redirect(301, longUrl); // Redirect to the long URL
    } else {
        res.redirect(301, "https://www.chadandmia.com"); // Redirect to homepage if slug not found
    }
};