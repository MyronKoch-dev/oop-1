import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Andromeda Protocol | Onboarding Hub",
    description: "Your gateway to the Andromeda ecosystem. Find your path, start building, and join our community of decentralized application developers.",
    icons: {
        icon: '/favicon.ico',
        apple: '/apple-icon.png',
        shortcut: '/favicon-16x16.png'
    },
    openGraph: {
        title: "Andromeda Protocol | Onboarding Hub",
        description: "Your gateway to the Andromeda ecosystem. Find your path, start building, and join our community.",
        url: "https://www.andromedaprotocol.io/",
        siteName: "Andromeda Protocol",
        images: [
            {
                url: "https://avatars.githubusercontent.com/u/86694044?s=200&v=4",
                width: 200,
                height: 200,
                alt: "Andromeda Protocol Logo",
            },
        ],
        locale: "en_US",
        type: "website",
    },
}; 