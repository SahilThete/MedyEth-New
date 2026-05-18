import React, { useState } from "react";
import axios from "axios";
import "./AIChatbot.css";

function AIChatbot() {

    const [isOpen, setIsOpen] = useState(false);

    const [messages, setMessages] = useState([
        {
            sender: "ai",
            text: "Hello 👋 I am MedyEth AI Assistant. How can I help you today?"
        }
    ]);

    const [input, setInput] = useState("");

    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;
        const userMessage = {
            sender: "user",
            text: input
        };
        setMessages(prev => [...prev, userMessage]);

        const prompt = input;
        setInput("");
        setLoading(true);

        try {
            const response = await axios.post(
                "/api/ai/chat",
                {
                    prompt,
                    history: messages.filter((msg) => msg && typeof msg.text === "string")
                }
            );
            const aiMessage = {
                sender: "ai",
                text: response.data.response
            };

            setMessages(prev => [...prev, aiMessage]);
        }
        catch (error) {

            console.error(error);
            setMessages(prev => [
                ...prev,
                {
                    sender: "ai",
                    text: "Failed to connect to MedyEth AI Assistant."
                }
            ]);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <> 
            <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)} > 💬 </button> {
                isOpen && (
                    <div className="chatbot-container">
                        <div className="chatbot-header">
                            MedyEth AI Assistant
                        </div>

                        <div className="chatbot-messages">
                            {
                                messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`message ${message.sender}`}
                                    >
                                        {message.text}
                                    </div>
                                ))
                            }
                            {
                                loading && (
                                    <div className="message ai">
                                        Typing...
                                    </div>
                                )
                            }
                        </div>

                        <div className="chatbot-input-container">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask MedyEth AI..."
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        sendMessage();
                                    }
                                }}
                            />
                            <button onClick={sendMessage}> Send </button>
                        </div>
                    </div>
                )
            }
        </>
    );
}

export default AIChatbot;