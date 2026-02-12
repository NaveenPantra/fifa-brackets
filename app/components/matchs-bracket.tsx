import React from "react";

import { Bracket } from "../lib/fifa";
import BracketMatch from "./bracket-match";
import { useIntersectionObserver } from "../lib/useIntersectionObserver";
import { cn } from "../lib/utils";

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

  const isFinalBracket = bracket.id === "bracket-0";

  return (
    <section
      ref={bracketRef}
      id={bracket.id}
      className={`px-8 overflow-y-visible relative mb-10vh ${cn(
        isFinalBracket && "w-screen"
      )}`}
    >
      {bracket.matches.map((match) => (
        <BracketMatch key={match.id} match={match} />
      ))}

      {/* {bracket.extraMatches?.map((match) => (
        <BracketMatch key={match.id} match={match} />
      ))} */}
    </section>
  );
}
