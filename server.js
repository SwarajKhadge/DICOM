const  GEMINI_API_KEY = 'AIzaSyB1mkbT91URaB8TyMe5HWetp155b8Ju2f0';

const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(express.json());
app.use(cors());

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

app.post("/chat", async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: "Prompt is required!" });

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        res.json({ response: responseText });
    } catch (error) {
        console.error("Gemini API Error:", error.message);
        res.status(500).json({ error: "Failed to fetch response from Gemini API" });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
