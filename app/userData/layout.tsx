import { UserProvider } from "@/src/context/useerContext";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <UserProvider>
                    {children}
                </UserProvider>
            </body>
        </html>
    );
}