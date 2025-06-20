import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "TBR Tools"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div>
          <h1>TBR Tools</h1>
        </div>
        {children}
      </body>
    </html>
  );
}
