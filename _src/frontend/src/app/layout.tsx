"use client";

import "./globals.css";
import Modal from "react-modal";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // useEffect(() => {
  //   Modal.setAppElement(document.body);
  // }, []);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
