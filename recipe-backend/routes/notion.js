const express = require("express");
const router = express.Router();
const { Client } = require("@notionhq/client");

const notion = new Client({ auth: process.env.NOTION_TOKEN });

router.post("/export", async (req, res) => {
  const { recipeTitle, ingredients } = req.body;

  if (!recipeTitle || !ingredients) {
    return res.status(400).json({ error: "Missing recipeTitle or ingredients" });
  }
console.log(process.env.NOTION_TOKEN);
console.log(process.env.NOTION_DATABASE_ID);


  try {
    const response = await notion.pages.create({
      parent: { database_id: process.env.NOTION_DATABASE_ID },
      properties: {
        Name: {
          title: [
            { text: { content: recipeTitle } }
          ],
        },
        Ingredients: {
          rich_text: [
            { text: { content: ingredients.map(i => `${i.name}: ${i.quantity} ${i.unit}`).join(", ") } }
          ],
        },
      },
    });

    res.json({ success: true, notionPageId: response.id });
  } catch (err) {
    console.error("Notion export error:", err);
    res.status(500).json({ error: "Failed to export to Notion" });
  }
});

module.exports = router;
