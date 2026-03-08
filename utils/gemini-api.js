const GEMINI_API_KEY = "AIzaSyDrG-7ulRkAHOTxub9cDuU9_hU8bRohxt4";
const GEMINI_MODEL = "gemini-1.5-flash";

/**
 * Sends a message to Google Gemini API
 * @param {string} prompt - The user's input
 * @param {Array} history - Previous conversation messages
 * @returns {Promise<string>} - The AI's response
 */
async function callGemini(prompt, history = []) {
    if (GEMINI_API_KEY === "YOUR_GEMINI_API_KEY") {
        throw new Error("Gemini API Key not configured. Please add your key in utils/gemini-api.js.");
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    const systemPrompt = "You are Nexus Assistant, a helpful transit expert for Nexus Mobility in Chennai. " +
        "You assist passengers with bus routes, ETAs, and city navigation. " +
        "Keep responses professional, concise, and related to Chennai transit. " +
        "If asked about things outside of transit, politely bring the conversation back to Nexus services.";

    const contents = [
        {
            role: "user",
            parts: [{ text: systemPrompt }]
        },
        ...history.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
        })),
        {
            role: "user",
            parts: [{ text: prompt }]
        }
    ];

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ contents })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Gemini API request failed.");
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
}

window.callGemini = callGemini;
