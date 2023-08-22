var fetch = require("node-fetch");

function sendDiscordAlert({ message, data }) {
	if (message && process.env.DISCORD_ERRORS_WEBHOOK) {
		return fetch(process.env.DISCORD_ERRORS_WEBHOOK, {
			method: "POST",
			body: JSON.stringify({
				content: "🛑️ " + message,
				...(data
					? {
							embeds: [
								{
									description:
										"```json\n" +
										JSON.stringify(data, null, 4) +
										"\n```",
								},
							],
					  }
					: {}),
			}),
			headers: {
				"Content-Type": "application/json",
			},
		});
	}
}

module.exports = {
	sendDiscordAlert,
};
