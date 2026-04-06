const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const API_URL = "https://filme-gold-hollow-converted.trycloudflare.com/generate";

/**
 * Reads models.txt and returns the first model name.
 */
function getModelFromFile() {
    try {
        const modelsPath = path.join(__dirname, "..", "models.txt");
        if (fs.existsSync(modelsPath)) {
            const content = fs.readFileSync(modelsPath, 'utf-8');
            const lines = content.split('\n').filter(line => line.trim());
            if (lines.length > 0) return lines[0].trim();
        }
    } catch (err) {
        console.error(`Error reading models.txt: ${err.message}`);
    }
    return "models/gemini-1.5-flash"; // Fallback
}

/**
 * Sends code content to custom AI API to detect vulnerabilities.
 */
async function analyzeCodeWithAI(fileName, codeContent) {
    const modelName = getModelFromFile();

    const proactiveQuestions = [
        "Is there a buffer overflow in this code?",
        "Are there any insecure inputs from the user?",
        "Does the code use dangerous functions like gets() or strcpy()?",
        "What line exactly is the most critical?",
        "How can we surgically patch this specific issue?"
    ];
    const questionsText = proactiveQuestions.map(q => `- ${q}`).join('\n');

    const prompt = `
    Analyze the following source code for security vulnerabilities.
    Focus on these key questions during your analysis:
    ${questionsText}

    File name: ${fileName}

    Source code:
    \`\`\`
    ${codeContent}
    \`\`\`

    Return the result strictly as a valid JSON array of objects.
    Each object MUST have:
    - "type": string
    - "file": string
    - "line": integer
    - "severity": string (Critical, High, Medium, or Low)
    - "description": string
    - "fix": string
  `;

    const payload = { model: modelName, prompt, stream: false };
    

    const headers = {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY || geminiKey}`,
        "x-api-key": geminiKey,
        "x-goog-api-key": geminiKey,
        "Content-Type": "application/json"
    };

    try {
        let response = await axios.post(API_URL, payload, { headers, timeout: 90000 });

        // Fallback strategy if /generate fails
        if (response.status !== 200) {
            // const chatUrl = API_URL.replace("/generate", "/v1/chat/completions");
            const chatUrl = "https://filme-gold-hollow-converted.trycloudflare.com/generate";
            const chatPayload = {
                model: modelName,
                messages: [{ role: "user", content: prompt }],
                stream: false
            };
            response = await axios.post(chatUrl, chatPayload, { headers, timeout: 90000 });
        }

        const result = response.data;
        let text = "";
        if (result.response) text = result.response;
        else if (result.choices && result.choices.length > 0) {
            const msg = result.choices[0].message || {};
            text = msg.content || result.choices[0].text || "";
        } else if (result.text) text = result.text;

        if (!text) return [];

        // Cleanup and parse JSON
        text = text.trim();
        if (text.includes("```json")) text = text.split("```json")[1].split("```")[0].trim();
        else if (text.includes("```")) text = text.split("```")[1].trim();
        if (text.toLowerCase().startsWith("json")) text = text.substring(4).trim();

        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed)) {
            if (parsed.issues) return parsed.issues;
            if (parsed.type) return [parsed];
            return [];
        }
        return parsed;
    } catch (err) {
        console.error(`Error analyzing ${fileName}:`, err.message);
        return [];
    }
}

/**
 * Counts total vulnerabilities from scan results
 */
function getAICount(scanResults) {
    return scanResults.length;
}

/**
 * High-level insights for dashboard boxes.
 */
async function getScanInsights(totalIssues, severityCounts) {
    const modelName = getModelFromFile();
    const prompt = `You are a cybersecurity AI analyst. Based on this scan summary, provide insights.

Scan Summary:
- Total Issues: ${totalIssues}
- Critical: ${severityCounts.Critical}
- High: ${severityCounts.High}
- Medium: ${severityCounts.Medium}
- Low: ${severityCounts.Low}

Provide exactly 3 short insights (max 10 words each) about:
1. Most critical risk area
2. Immediate action needed
3. Overall security assessment

Also provide:
- A security health score (0-100, where 100 is perfect)
- A brief recommendation (max 15 words)
- Health status: "Secure", "Warning", or "Critical"

Return ONLY valid JSON in this exact format:
{
  "answers": ["insight1", "insight2", "insight3"],
  "score": number,
  "recommendation": "text",
  "health_status": "Secure|Warning|Critical"
}`;

    const payload = { model: modelName, prompt, stream: false };
    const geminiKey = process.env.GEMINI_API_KEY || 'AIzaSyCdO0P2bTIZ_Hu1s9GCdHVLSW5DOSGsopY';

    try {
        const res = await axios.post(API_URL, payload, {
            headers: { "x-api-key": geminiKey, "Content-Type": "application/json" },
            timeout: 30000
        });
        let text = (res.data.response || res.data.text || "").trim();
        if (text.includes("```json")) text = text.split("```json")[1].split("```")[0].trim();
        else if (text.includes("```")) text = text.split("```")[1].split("```")[0].trim();
        if (text.toLowerCase().startsWith("json")) text = text.substring(4).trim();
        return JSON.parse(text);
    } catch (err) {
        console.error("Error in getScanInsights:", err.message);
        const score = Math.max(0, 100 - (totalIssues * 5));
        return {
            answers: [
                `${severityCounts.Critical} critical vulnerabilities detected`,
                "Immediate code review required",
                totalIssues > 10 ? "High risk exposure" : "Moderate security posture"
            ],
            score: score,
            recommendation: "Address critical issues first, then review high severity items.",
            health_status: severityCounts.Critical > 0 ? "Critical" : totalIssues > 5 ? "Warning" : "Secure"
        };
    }
}

/**
 * Counts critical vulnerabilities from scan results
 */
function getCriticalOpsCount(scanResults) {
    return scanResults.filter(v => v.severity === 'Critical').length;
}

module.exports = { analyzeCodeWithAI, getAICount, getScanInsights, getCriticalOpsCount };
