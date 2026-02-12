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
      <main className="relative min-h-screen w-full">
        <Navigation />
        <Image
          src="/background.jpg"
          alt="FIFA 2026 Background"
          fill
          className="object-cover max-h-[1200px]"
          priority
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/95 to-black/80 z-[0]" />

        <div className="mx-8 relative mt-10">
          <h1 className="text-4xl font-bold text-white mb-2">
            Fifa World Cup 26™ Bracket
          </h1>
          <aside className="text-lg">
            The easiest way to follow along in the tournament. Select a match
            for more information!
          </aside>
        </div>
        <BracketTabs />
        <div className="relative flex overflow-x-auto overflow-y-visible pt-10 w-full pb-[30vh] overflow-auto">
          {allBrackets.map((bracket) => (
            <MatchesBracket key={bracket.id} bracket={bracket} />
          ))}
        </div>
      </main>
    </>
  );
}
