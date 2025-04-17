'use client';
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full border-b border-gray-200 dark:border-gray-800 px-4 sm:px-12 py-4">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          {/* <Image
            src="/logo.png"
            alt="Logo"
            width={40}
            height={40}
            className="rounded-full"
          /> */}
          <span className="font-bold text-lg text-black dark:text-white">Ebook Business</span>
        </div>

        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-700 dark:text-gray-300">
          <a href="../app/page.tsx" className="hover:text-black dark:hover:text-white">Accueil</a>
          <a href="#contenu" className="hover:text-black dark:hover:text-white">Accès privé</a>
          <a
            href="/login"
            className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-full hover:opacity-80 transition"
          >
            Se connecter
          </a>
        </nav>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="sm:hidden text-gray-800 dark:text-white"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="sm:hidden mt-4 flex flex-col gap-4 text-sm font-medium text-gray-700 dark:text-gray-300 px-2">
          <a href="../app/page.tsx" onClick={() => setIsOpen(false)} className="hover:text-black dark:hover:text-white">Accueil</a>
          <a href="#contenu" onClick={() => setIsOpen(false)} className="hover:text-black dark:hover:text-white">Accès privé</a>
          <a
            href="/login"
            onClick={() => setIsOpen(false)}
            className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-full w-fit hover:opacity-80 transition"
          >
            Se connecter
          </a>
        </div>
      )}
    </header>
  );
}
