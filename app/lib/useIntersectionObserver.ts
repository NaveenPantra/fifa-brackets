import React from "react";
import { updateEdge } from "./edges";

interface UseIntersectionObserverProps {
  bracketRef: React.RefObject<HTMLDivElement>;
}
export const useIntersectionObserver = ({
  bracketRef,
}: UseIntersectionObserverProps) => {
  const updateMatchCards = React.useCallback(() => {
    const bracket = bracketRef.current;
    if (!bracket) return;

    const bracketMatches = [
      ...bracket.querySelectorAll(".match-card-container"),
    ] as HTMLDivElement[];
    const maxMatchArticleHeight = 160;
    const minMatchArticleHeight = 65;

    bracketMatches.forEach((matchCard: HTMLDivElement) => {
      const matchCardRect = matchCard.getBoundingClientRect();
      if (matchCardRect.x > 10) return;
      const matchArticle = matchCard.querySelector("article") as HTMLDivElement;
      // hidden on left side of screen - on horizontal scroll
      const matchCardX = matchCardRect.x;
      // width of the match card
      const matchCardWidth = matchCardRect.width;
      // raw percentage of card hidden off-screen
      const rawPercentageHidden = Math.abs(matchCardX) / matchCardWidth;
      // start shrinking at 70% hidden, reach minimum at 95% hidden
      const shrinkStart = 0.6;
      const shrinkEnd = 0.95;
      const shrinkProgress = Math.min(
        Math.max(
          (rawPercentageHidden - shrinkStart) / (shrinkEnd - shrinkStart),
          0
        ),
        1
      );
      // pick a value in range [minMatchArticleHeight, maxMatchArticleHeight] based on progress
      const matchArticleHeight =
        maxMatchArticleHeight -
        (maxMatchArticleHeight - minMatchArticleHeight) * shrinkProgress;
      // set the height of the match article
      matchArticle.style.setProperty("max-height", `${matchArticleHeight}px`);
      const parentMatchIndex = matchCard.getAttribute(
        "data-parent-match-index"
      );
      const matchIndex = matchCard.getAttribute("data-match-index");
      if (!parentMatchIndex || !matchIndex) return;
      const parentMatchCard = document.getElementById(
        `match-${parentMatchIndex}`
      ) as HTMLDivElement;
      // @ts-expect-error - edge is always an SVGSVGElement
      const edge = document.getElementById(
        `edge-${matchIndex}-${parentMatchIndex}`
      ) as SVGSVGElement;
      updateEdge(matchCard, parentMatchCard, edge);
    });
  }, [bracketRef]);

  React.useEffect(() => {
    if (!bracketRef.current) return;
    const scrollParent = bracketRef.current.parentElement;
    if (!scrollParent) return;

    const handleScroll = () => {
      updateMatchCards();
    };

    scrollParent.addEventListener("scroll", handleScroll, {});

    return () => {
      scrollParent.removeEventListener("scroll", handleScroll);
    };
  }, [bracketRef, updateMatchCards]);
};
