const express = require("express");
const router = express.Router();
const axios = require("axios");
const medicalAssistantPrompt = require("../prompts/medicalAssistantPrompt");

router.post("/chat", async (req, res) => {

    try {

        const { prompt, history = [] } = req.body;

        if (!prompt || !prompt.trim()) {

            return res.status(400).json({
                error: "Prompt is required"
            });
        }

        const response = await axios.post(

            "http://localhost:11434/api/chat",

            {
                // model: "mistral:7b",
                // model: "meditron",
                model: "medllama2",

                messages: [
                    {
                        role: "system",
                        content: medicalAssistantPrompt
                    },

                    ...history
                    .slice(-6)
                    .filter(
                        (msg) =>
                            msg &&
                            typeof msg === "object" &&
                            typeof msg.text === "string"
                    ).map((msg) => ({
                        role:
                            msg.sender === "user"
                                ? "user"
                                : "assistant",

                        content: String(msg.text)
                    })),

                    {
                        role: "user",
                        content: prompt
                    }
                ],

                stream: false,

                options: {
                    temperature: 0.3,
                    top_p: 0.9,
                    num_predict: 220
                }
            },

            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        return res.status(200).json({
            response: response?.data?.message?.content?.trim() || "No AI response generated."
        });

    }
    catch (error) {

        console.error(
            "AI CHAT ERROR:", error?.response?.data || error.message
        );

        return res.status(500).json({
            error: error?.response?.data?.error || "Failed to generate AI response"
        });
    }
});

module.exports = router;