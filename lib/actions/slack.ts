"use server";

export async function sendSlackNotification(data: { name: string; email: string; message: string }) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error("Slack Webhook URL is missing!");
    return { success: false };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // Slack "Block Kit" format makes it look professional
        blocks: [
          {
            type: "header",
            text: { type: "plain_text", text: "🏹 New Expedition Inquiry" }
          },
          {
            type: "section",
            fields: [
              { type: "mrkdwn", text: `*From:*\n${data.name}` },
              { type: "mrkdwn", text: `*Email:*\n${data.email}` }
            ]
          },
          {
            type: "section",
            text: { type: "mrkdwn", text: `*Message:*\n${data.message}` }
          },
          { type: "divider" }
        ]
      }),
    });

    if (!response.ok) throw new Error("Slack API responded with error");

    return { success: true };
  } catch (error) {
    console.error("Error sending to Slack:", error);
    return { success: false };
  }
}