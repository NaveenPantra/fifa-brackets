"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/app/lib/utils";

interface NavItem {
  label: string;
  href: string;
  hasIcon?: boolean;
  active?: boolean;
}

export default function Navigation() {
  const navItems: NavItem[] = [
    { label: "Home", href: "/", hasIcon: false },
    { label: "Shows & Movies", href: "/teams", hasIcon: false },
    { label: "News", href: "/schedule", hasIcon: false },
    { label: "Sports", href: "/results", hasIcon: false },
    { label: "FIFA", href: "/fifa-2026", hasIcon: false, active: true },
  ];

  return (
    <nav className="w-full bg-white/5 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <span className="text-white text-xl font-bold">FIFA 2026</span>
          </div>

          <div className="flex items-center gap-1 hidden lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 ${cn(
                  item.active && "bg-white/10 text-white font-bold"
                )}`}
              >
                <span className="text-sm font-bold">{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
           <Link href="https://github.com/NaveenPantra/fifa-brackets" target="__blank" className="cursor-pointer">
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-all cursor-pointer flex items-center gap-2">
                <Image
                  src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/github-white-icon.png"
                  alt="GitHub"
                  width={20}
                  height={20}
                  className="inline-block"
                />
                Source
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
