"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { useGlobalStore } from "@/store/globalStore";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const p = usePathname();
  const menuBaseClass = "text-2xl hover:underline";
  const menuActiveClass = "text-blue-500";
  const { gs } = useGlobalStore();
  return (
    <html lang="en">
      <body className="flex h-screen flex-col overflow-hidden">
        <Toaster position="bottom-right" toastOptions={{ duration: 5000 }} />
        <header className="flex space-x-6 border-b-2 p-3">
          <h1 className="text-2xl font-bold">Kilátók Magyarországon</h1>
          <Link className={clsx(menuBaseClass, p === "/" && menuActiveClass)} href="/">
            Nyitólap
          </Link>
          <Link className={clsx(menuBaseClass, p === "/rating" && menuActiveClass)} href="/rating">
            Értékelés
          </Link>
          <Link
            className={`text-2xl hover:underline ${p === "/pagination" && "text-blue-500"}`}
            href="/pagination"
          >
            Paginálás
          </Link>
        </header>
        <main className="flex-1 overflow-y-auto bg-gray-200">{children}</main>
        <footer className="flex h-12 shrink-0 items-center justify-around border-t-2 text-2xl">
          <p>Rekordok száma: {gs.numberOfRecords}</p>
          <p>
            Oldal: {gs.actualPage}. / {gs.numberOfPages}
          </p>
        </footer>
      </body>
    </html>
  );
}
