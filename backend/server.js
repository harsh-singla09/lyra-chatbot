let memory = [];
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
    const userMessage = req.body.message;

    // 🧠 store user message
    memory.push({ role: "user", content: userMessage });

    // 🧠 keep only last 10 messages (important)
    if (memory.length > 10) memory.shift();

    // 🧠 build context for AI
    const context = memory.map(m => `${m.role}: ${m.content}`).join("\n");

    try {
        const response = await axios.post(
            "http://localhost:11434/api/generate",
            {
                model: "llama3.2:3b",
                prompt: `
You are Lyra, an AI assistant.
You remember previous conversation.

User is Harsh.

Conversation:
${context}

Now respond to latest user message.
`,
                stream: false
            }
        );

        const reply = response.data.response;

        // 🧠 store AI reply
        memory.push({ role: "lyra", content: reply });

        res.json({ reply });

    } catch (err) {
        res.status(500).json({ error: "Memory error" });
    }
});

app.listen(3000, () => {
    console.log("🚀 Lyra backend running on http://localhost:3000");
});