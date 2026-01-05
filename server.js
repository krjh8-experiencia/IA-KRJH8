import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const GROK_API_KEY = "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"; // sí, quemada

app.post("/chat", async (req, res) => {
  try {
    const r = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROK_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "grok-2",
        messages: req.body.messages
      })
    });

    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "Grok error" });
  }
});

app.listen(3000, () => console.log("ON http://localhost:3000"));
