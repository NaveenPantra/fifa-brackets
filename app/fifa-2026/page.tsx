"use client";

import "./styles.css";
import Image from "next/image";
import Navigation from "@/app/components/Navigation";
import BracketTabs from "../components/bracket-tabs";
import { allBrackets } from "../lib/fifa";
import MatchesBracket from "../components/matchs-bracket";

export default function Fifa2026() {
  return (
    <>
      <div className="relative min-h-screen w-full">
        <Navigation />
        <Image
          src="/background.jpg"
          alt="FIFA 2026 Background"
          fill
          className="object-cover max-h-[1200px]"
          priority
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/95 to-black/80 z-[1]" />

        <main className="relative z-10 min-h-screen w-full py-12 overflow-x-auto">
          <div className="px-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Fifa World Cup 26™ Bracket
            </h1>
            <aside className="text-lg">
              The easiest way to follow along in the tournament. Select a match
              for more information!
            </aside>
          </div>
          <div className="px-8">
            <BracketTabs />
          </div>
          <div className="flex overflow-x-auto overflow-y-visible pt-10">
            {allBrackets.map((bracket) => (
              <MatchesBracket key={bracket.id} bracket={bracket} />
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
