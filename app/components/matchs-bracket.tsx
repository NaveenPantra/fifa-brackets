import React from "react";

import { Bracket } from "../lib/fifa";
import BracketMatch from "./bracket-match";
import { useIntersectionObserver } from "../lib/useIntersectionObserver";

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
  const bracketRef = React.useRef<HTMLDivElement>(null);

  useIntersectionObserver({
    bracketRef: bracketRef as React.RefObject<HTMLDivElement>,
  });

  return (
    <section
      ref={bracketRef}
      className="px-8 min-w-[calc(calc(var(--spacing)*16)+300px)] overflow-y-visible relative mb-10vh"
    >
      {bracket.matches.map((match) => (
        <BracketMatch key={match.id} match={match} />
      ))}

      {bracket.extraMatches?.map((match) => (
        <BracketMatch key={match.id} match={match} />
      ))}
    </section>
  );
}
