import "./globals.css";

import AutoLogout from "@/components/AutoLogout";

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body className="min-h-screen bg-gray-100">
        <AutoLogout />
        {children}
      </body>
    </html>
  );
}
