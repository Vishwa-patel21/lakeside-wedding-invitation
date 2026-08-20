import "./globals.css";

export const metadata = {
  title: "Lakeside Wedding Invitation",
  description: "An elegant animated wedding invitation with RSVP and guest photos."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
