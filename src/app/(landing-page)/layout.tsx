"use client";
import ClientNavbar from "./components/ClientNavbar";

export default function LandingPageLayout({
  children,
}: {
    children: React.ReactNode;
}) {
  return (
    <>
      <ClientNavbar />
      {children}
    </>
  );
}
