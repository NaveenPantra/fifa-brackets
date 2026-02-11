import React from "react";

import { Bracket } from "../lib/fifa";
import BracketMatch from "./bracket-match";
import MatchCardsObserver from "./match-cards-observer";

interface BracketProps {
  bracket: Bracket;
  prevBracket?: Bracket;
  nextBracket?: Bracket;
}
export default function MatchesBracket({
  bracket,
  prevBracket,
  nextBracket,
}: BracketProps) {
  return (
    <section className="px-8 min-w-[calc(calc(var(--spacing)*16)+300px)] overflow-y-visible relative h-screen">
      {bracket.matches.map((match) => (
        <BracketMatch key={match.id} match={match} />
      ))}

      {bracket.extraMatches?.map((match) => (
        <BracketMatch key={match.id} match={match} />
      ))}
      <MatchCardsObserver />
    </section>
  );
}
