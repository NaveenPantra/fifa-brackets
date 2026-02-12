import React from "react";
import Image from "next/image";

import { Match, matches, allBrackets, MatchStatus } from "../lib/fifa";
import { useGetConnectedMatches } from "../lib/hooks";
import { useSetPositionOfMatchCardBasedOnChild } from "../lib/useNodePositioning";
import { cn } from "../lib/utils";
import { useHoverOnMatchCard } from "../lib/useHoverOnMatchCard";
import StepLine from "./step-line";

interface MatchProps {
  match: Match;
}
export default function BracketMatch({ match }: MatchProps) {
  const { parentMatch, leftChildMatch, rightChildMatch, isLeaf } =
    useGetConnectedMatches({
      index: match.index,
    });

  const matchCardRef = React.useRef<HTMLDivElement>(null);

  useSetPositionOfMatchCardBasedOnChild({
    matchCardRef,
    index: match.index,
  });

  useHoverOnMatchCard({
    matchCardRef,
    index: match.index,
  });

  return (
    <div
      id={`match-${match.index}`}
      data-match-index={match.index}
      data-parent-match-index={parentMatch?.index ?? null}
      data-left-child-match-index={leftChildMatch?.index ?? null}
      data-right-child-match-index={rightChildMatch?.index ?? null}
      data-rendering-complete={isLeaf ? "true" : "false"}
      ref={matchCardRef}
      className={`${cn(
        !isLeaf && "relative "
      )} mb-6 min-w-[300px] max-w-[300px] border-2 bg-black backdrop-blur-md rounded-lg shadow-md match-card-container`}
    >
      {!!parentMatch && (
        <StepLine edgeId={`edge-${match.index}-${parentMatch.index}`} />
      )}

      <div className="match-extra-info-container relative w-full h-[170px] bg-gradient-to-b from-zinc-900 to-black rounded-lg overflow-hidden">
        <Image
          src="/player.png"
          alt="FIFA 2026 Background"
          fill
          className="object-cover w-full h-full max-h-none"
          priority
          style={{ objectPosition: "center", objectFit: "cover" }}
        />
        <button className="absolute right-2 top-2 rounded-full bg-white text-black w-[30px] h-[30px] flex items-center justify-center filter grayscale cursor-pointer">
          <span className="text-xl">&#128266;</span>
        </button>
      </div>
      {match.prominenceTag && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs bg-white text-black px-3 py-1 font-bold">
          {match.prominenceTag}
        </div>
      )}
      <article className="relative flex flex-col p-4 gap-2 overflow-hidden">
        <div className="match-header flex justify-between items-center gap-2">
          <div className="text-xs bg-white text-black px-2 py-1 font-bold">
            {match.status}
          </div>
          <div className="text-xs border border-white/20 px-2 py-1 font-bold">
            FOX
          </div>
          <p className="text-xs text-gray-300 ml-auto">{match.date}</p>
        </div>

        <div className="match-body">
          <div className="flex gap-2 items-center">
            <div className="w-7 h-5 bg-neutral-900 border border-white/20" />
            <div className="text-2xl font-bold">{match.team1.name}</div>
            <p className="text-2xl font-bold ml-auto">-</p>
          </div>
          <div className="flex gap-2 items-center">
            <div className="w-7 h-5 bg-neutral-900 border border-white/20" />
            <div className="text-2xl font-bold">{match.team2.name}</div>
            <p className="text-2xl font-bold ml-auto">-</p>
          </div>
        </div>
        <div className="match-footer">
          <p className="text-sm text-gray-400">{match.venue}</p>
        </div>
      </article>
    </div>
  );
}
