const express = require("express");
const router = express.Router();
const axios = require("axios");

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

                        content:
                            ` 
			                You are MedyEth AI Assistant.
                            You are a healthcare educational assistant integrated into a blockchain healthcare platform.

                            IMPORTANT RULES:
                            - Never claim to be a doctor.
                            - Never provide medical diagnosis.
                            - Never prescribe medications.
                            - Never invent medical facts.
                            - For severe emergencies such as heart attack, stroke, severe bleeding, unconsciousness, or breathing difficulty: advise immediate emergency medical assistance.

                            ALLOWED BEHAVIOR:
                            - You MAY provide general healthcare education.
                            - You MAY explain common symptoms in simple language.
                            - You MAY provide basic home care guidance for minor everyday conditions.
                            - You MAY explain basic first aid measures.
                            - You MAY suggest hydration, rest, hygiene, and consulting healthcare professionals.

                            RESPONSE STYLE:
                            - Keep responses concise and practical.
                            - Use supportive and empathetic language.
                            - Avoid repeating the same disclaimer in every response.
                            - Only recommend consulting a doctor when truly necessary.
                            - Focus on educational and safety-oriented guidance.
                            `
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