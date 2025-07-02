import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col bg-[#fbfbfd]">
      <Header />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
    </main>
  );
} 