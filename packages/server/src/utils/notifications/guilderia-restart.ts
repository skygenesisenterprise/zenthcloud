import { db } from "@guilderia/server/db";
import { notifications } from "@guilderia/server/db/schema";
import GuilderiaRestartEmail from "@guilderia/server/emails/emails/guilderia-restart";
import { render } from "@react-email/components";
import { format } from "date-fns";
import { eq } from "drizzle-orm";
import {
	sendCustomNotification,
	sendDiscordNotification,
	sendEmailNotification,
	sendGotifyNotification,
	sendLarkNotification,
	sendMattermostNotification,
	sendNtfyNotification,
	sendPushoverNotification,
	sendResendNotification,
	sendSlackNotification,
	sendTeamsNotification,
	sendTelegramNotification,
} from "./utils";

export const sendGuilderiaRestartNotifications = async () => {
	try {
		const date = new Date();
		const unixDate = ~~(Number(date) / 1000);
		const notificationList = await db.query.notifications.findMany({
			where: eq(notifications.guilderiaRestart, true),
			with: {
				email: true,
				guilderia: true,
				telegram: true,
				slack: true,
				resend: true,
				gotify: true,
				ntfy: true,
				mattermost: true,
				custom: true,
				lark: true,
				pushover: true,
				teams: true,
			},
		});

		for (const notification of notificationList) {
			const {
				email,
				resend,
				guilderia,
				telegram,
				slack,
				gotify,
				ntfy,
				mattermost,
				custom,
				lark,
				pushover,
				teams,
			} = notification;

			try {
				if (email || resend) {
					const template = await render(
						GuilderiaRestartEmail({ date: date.toLocaleString() }),
					).catch();

					if (email) {
						await sendEmailNotification(
							email,
							"Guilderia Server Restarted",
							template,
						);
					}

					if (resend) {
						await sendResendNotification(
							resend,
							"Guilderia Server Restarted",
							template,
						);
					}
				}

				if (guilderia) {
					const decorate = (decoration: string, text: string) =>
						`${guilderia.decoration ? decoration : ""} ${text}`.trim();

					await sendDiscordNotification(guilderia, {
						title: decorate(">", "`✅` Guilderia Server Restarted"),
						color: 0x57f287,
						fields: [
							{
								name: decorate("`📅`", "Date"),
								value: `<t:${unixDate}:D>`,
								inline: true,
							},
							{
								name: decorate("`⌚`", "Time"),
								value: `<t:${unixDate}:t>`,
								inline: true,
							},
							{
								name: decorate("`❓`", "Type"),
								value: "Successful",
								inline: true,
							},
						],
						timestamp: date.toISOString(),
						footer: {
							text: "Guilderia Restart Notification",
						},
					});
				}

				if (gotify) {
					const decorate = (decoration: string, text: string) =>
						`${gotify.decoration ? decoration : ""} ${text}\n`;
					await sendGotifyNotification(
						gotify,
						decorate("✅", "Guilderia Server Restarted"),
						`${decorate("🕒", `Date: ${date.toLocaleString()}`)}`,
					);
				}

				if (ntfy) {
					await sendNtfyNotification(
						ntfy,
						"Guilderia Server Restarted",
						"white_check_mark",
						"",
						`🕒Date: ${date.toLocaleString()}`,
					);
				}

				if (telegram) {
					await sendTelegramNotification(
						telegram,
						`<b>✅ Guilderia Server Restarted</b>\n\n<b>Date:</b> ${format(
							date,
							"PP",
						)}\n<b>Time:</b> ${format(date, "pp")}`,
					);
				}

				if (slack) {
					const { channel } = slack;
					await sendSlackNotification(slack, {
						channel: channel,
						attachments: [
							{
								color: "#00FF00",
								pretext: ":white_check_mark: *Guilderia Server Restarted*",
								fields: [
									{
										title: "Time",
										value: date.toLocaleString(),
										short: true,
									},
								],
							},
						],
					});
				}

				if (mattermost) {
					await sendMattermostNotification(mattermost, {
						text: `**✅ Guilderia Server Restarted**\n\n**Date:** ${format(date, "PP")}\n**Time:** ${format(date, "pp")}`,
						channel: mattermost.channel,
						username: mattermost.username || "Guilderia",
					});
				}

				if (custom) {
					try {
						await sendCustomNotification(custom, {
							title: "Guilderia Server Restarted",
							message: "Guilderia server has been restarted successfully",
							timestamp: date.toISOString(),
							date: date.toLocaleString(),
							status: "success",
							type: "guilderia-restart",
						});
					} catch (error) {
						console.log(error);
					}
				}

				if (lark) {
					await sendLarkNotification(lark, {
						msg_type: "interactive",
						card: {
							schema: "2.0",
							config: {
								update_multi: true,
								style: {
									text_size: {
										normal_v2: {
											default: "normal",
											pc: "normal",
											mobile: "heading",
										},
									},
								},
							},
							header: {
								title: {
									tag: "plain_text",
									content: "✅ Guilderia Server Restarted",
								},
								subtitle: {
									tag: "plain_text",
									content: "",
								},
								template: "green",
								padding: "12px 12px 12px 12px",
							},
							body: {
								direction: "vertical",
								padding: "12px 12px 12px 12px",
								elements: [
									{
										tag: "column_set",
										columns: [
											{
												tag: "column",
												width: "weighted",
												elements: [
													{
														tag: "markdown",
														content: "**Status:**\nSuccessful",
														text_align: "left",
														text_size: "normal_v2",
													},
												],
												vertical_align: "top",
												weight: 1,
											},
											{
												tag: "column",
												width: "weighted",
												elements: [
													{
														tag: "markdown",
														content: `**Restart Time:**\n${format(
															date,
															"PP pp",
														)}`,
														text_align: "left",
														text_size: "normal_v2",
													},
												],
												vertical_align: "top",
												weight: 1,
											},
										],
									},
								],
							},
						},
					});
				}

				if (pushover) {
					await sendPushoverNotification(
						pushover,
						"Guilderia Server Restarted",
						`Date: ${date.toLocaleString()}`,
					);
				}

				if (teams) {
					await sendTeamsNotification(teams, {
						title: "✅ Guilderia Server Restarted",
						facts: [
							{ name: "Status", value: "Successful" },
							{ name: "Restart Time", value: format(date, "PP pp") },
						],
					});
				}
			} catch (error) {
				console.log(error);
			}
		}
	} catch (error) {
		console.error("[Guilderia] Restart notifications failed:", error);
	}
};
