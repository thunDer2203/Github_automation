export async function sendSlackMessage({
    webhookUrl,
    message,
}) {
    const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            text: message,
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to send Slack notification");
    }
}