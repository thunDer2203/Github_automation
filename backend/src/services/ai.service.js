import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export async function generateSlackMessage(payload) {
    const isIssue = !!payload.issue;

    const title = isIssue
        ? payload.issue.title
        : payload.pull_request.title;

    const body = isIssue
        ? payload.issue.body || ""
        : payload.pull_request.body || "";

    const author = isIssue
        ? payload.issue.user.login
        : payload.pull_request.user.login;

    const type = isIssue ? "GitHub Issue" : "Pull Request";

    const prompt = `
You are an AI assistant.

Write a short, professional Slack notification for this ${type}.

Include:
- A one-line summary
- Why it matters
- Mention the author
- End with a friendly sentence

Title:
${title}

Description:
${body}

Author:
${author}

Return ONLY the Slack message.
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    return response.text;
}