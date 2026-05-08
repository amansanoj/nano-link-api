export const sendDiscordNotification = async (
  code: string,
  originalUrl: string,
  os: string,
  browser: string,
  device: string,
) => {
  const webhookUrl = process.env.DISCORD_WEBHOOK;

  if (!webhookUrl) return;

  const payload = {
    embeds: [
      {
        title: "New Link Click",
        color: 3066993,
        fields: [
          {
            name: "Short Link",
            value: `\`/${code}\``,
            inline: true,
          },
          {
            name: "Target URL",
            value: `[View Original](${originalUrl})`,
            inline: true,
          },
          {
            name: "Demographics",
            value: `**OS:** ${os}\n**Device:** ${device}\n**Browser:** ${browser}`,
            inline: false,
          },
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: "NanoLink Analytics Engine",
        },
      },
    ],
  };

  fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }).catch((err) => console.error("Discord Webhook failed to send:", err));
};
