// AI App Builder – Next.js 15 + React 19 + Tailwind + shadcn/ui
// Single-file starter blueprint with logical file sections
// Ready to split into a real repo

/* =============================
   app/layout.tsx
============================= */

import "./globals.css";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
