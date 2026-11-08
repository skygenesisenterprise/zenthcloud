import clsx from "clsx";
import type { Metadata } from "next";
import { Inter, Lexend } from "next/font/google";
import type { ReactNode } from "react";
import "@/styles/tailwind.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { guilderiaTraffic } from "@/components/guilderiaTraffic";

type Props = {
	children: ReactNode;
};

export const metadata: Metadata = {
	metadataBase: new URL("https://guilderia.com"),
	title: {
		default:
			"guilderia - The open-source infrastructure platform for deploying and operating applications",
		template: "%s | guilderia",
	},
	description:
		"guilderia is an open-source infrastructure platform. Deploy applications, databases and Compose projects, manage servers and clusters, and handle routing, certificates and backups — self-hosted with guilderia Self or managed with guilderia Cloud.",
	icons: {
		icon: "/icon.svg",
		apple: "/apple-touch-icon.png",
	},
	openGraph: {
		title: "guilderia - The open-source infrastructure platform",
		description:
			"Deploy applications, databases and Compose projects, manage servers and clusters, and handle routing, certificates and backups — self-hosted with guilderia Self or managed with guilderia Cloud.",
		images: "/og.png",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "guilderia - The open-source infrastructure platform",
		description:
			"Deploy applications, databases and Compose projects, manage servers and clusters, and handle routing, certificates and backups — self-hosted with guilderia Self or managed with guilderia Cloud.",
		images: ["/og.png"],
	},
};
const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-inter",
});

const lexend = Lexend({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-lexend",
});
// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html
			lang="en"
			className={clsx(
				"h-full scroll-smooth antialiased",
				inter.variable,
				lexend.variable,
			)}
		>
			<body>
				{/* Traffic Manager instrumentation (no-op without the env vars). */}
				<guilderiaTraffic />
				<a
					href="#main-content"
					className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
				>
					Skip to content
				</a>
				<div className="flex h-full flex-col">
					<Header />
					<div id="main-content" tabIndex={-1}>
						{children}
					</div>
					<Footer />
				</div>
			</body>
		</html>
	);
}
