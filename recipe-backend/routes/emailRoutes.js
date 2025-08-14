const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.post("/send", async (req, res) => {
  const { recipientEmail, recipe } = req.body;

  if (!recipientEmail || !recipe) {
    return res.status(400).json({ error: "Recipient email and recipe required" });
  }

  const { title, image, cuisine, ratings, servings, ingredients, steps } = recipe;

  // Calculate average rating
  const avgRating =
    ratings?.length > 0
      ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
      : 0;

  const ingredientsHTML = ingredients
    .map((i) => `<li>${i.name}: ${i.quantity} ${i.unit}</li>`)
    .join("");

  const stepsHTML = steps
    .map((s, idx) => `<li>${s}</li>`)
    .join("");

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border:2px solid #111; border-radius:8px; overflow:hidden;">
      <img src="${image}" alt="${title}" style="width:100%; height:auto; object-fit:cover;" />
      <div style="padding: 16px;">
        <h2 style="margin:0 0 8px 0;">${title}</h2>
        <span style="display:inline-block; background:#f472b6; color:#111; padding:4px 8px; border-radius:4px; font-size:12px; font-weight:bold; text-transform:uppercase;">${cuisine}</span>
        <span style="display:inline-block; margin-left:8px; background:#111; color:#fff; padding:4px 8px; border-radius:4px; font-size:12px; font-weight:bold;">
          ⭐ ${avgRating}
        </span>

        <p style="margin:8px 0;"><strong>Servings:</strong> ${servings}</p>

        <h3 style="margin:16px 0 8px 0;">Ingredients</h3>
        <ul style="margin:0; padding-left:20px;">
          ${ingredientsHTML}
        </ul>

        <h3 style="margin:16px 0 8px 0;">Steps</h3>
        <ol style="margin:0; padding-left:20px;">
          ${stepsHTML}
        </ol>
      </div>
    </div>
  `;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: `Recipe: ${title}`,
      html: htmlContent,
    });

    res.json({ success: true, message: "Recipe sent via email!" });
  } catch (err) {
    console.error("Email send error:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

module.exports = router;
