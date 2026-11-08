import { RootProvider } from "fumadocs-ui/provider/next";
import "./global.css";
import SearchDialog from "@/components/SearchDialog";
import { zenthcloudTraffic } from "@/components/zenthcloudTraffic";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
	subsets: ["latin"],
});

export const metadata: Metadata = {
	metadataBase: new URL(
		process.env.NEXT_PUBLIC_APP_URL || "https://docs.zenthcloud.com",
	),
	title: {
		default: "zenthcloud Documentation",
		template: "%s | zenthcloud Documentation",
	},
	description:
		"Open Source Alternative to Vercel, Netlify and Heroku. Deploy your applications with ease.",
	keywords: [
		"zenthcloud",
		"deployment",
		"docker",
		"hosting",
		"devops",
		"open source",
	],
	authors: [{ name: "zenthcloud Team" }],
	openGraph: {
		title: "zenthcloud Documentation",
		description: "Open Source Alternative to Vercel, Netlify and Heroku",
		type: "website",
	},
};

export default function Layout({ children }: LayoutProps<"/">) {
	return (
		<html lang="en" className={inter.className} suppressHydrationWarning>
			<body className="flex flex-col min-h-screen">
				{/* Traffic Manager instrumentation (no-op without the env vars). */}
				<zenthcloudTraffic />
				<RootProvider
					search={{
						SearchDialog,
					}}
				>
					{children}
				</RootProvider>
			</body>
		</html>
	);
}
