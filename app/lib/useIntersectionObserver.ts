import React from "react";
import { updateEdge } from "./edges";

interface UseIntersectionObserverProps {
  bracketRef: React.RefObject<HTMLDivElement>;
}
export const useIntersectionObserver = ({
  bracketRef,
}: UseIntersectionObserverProps) => {
  const handleBracketIntersection = React.useCallback(
    (entry: IntersectionObserverEntry) => {
      const bracket = entry.target as HTMLDivElement;
      const bracketRect = entry.boundingClientRect;
      const bracketMatches = [
        ...bracket.querySelectorAll(".match-card-container"),
      ] as HTMLDivElement[];
      const maxMatchArticleHeight = 160;
      const minMatchArticleHeight = 65;
      bracketMatches.forEach((matchCard: HTMLDivElement) => {
        function animate() {
          const matchCardRect = matchCard.getBoundingClientRect();
          if (matchCardRect.x > 10) return;
          const matchArticle = matchCard.querySelector(
            "article"
          ) as HTMLDivElement;
          // hidden on left side of screen - on horizontal scroll
          const matchCardX = matchCardRect.x;
          // width of the match card
          const matchCardWidth = matchCardRect.width;
          // raw percentage of card hidden off-screen
          const rawPercentageHidden = Math.abs(matchCardX) / matchCardWidth;
          // start shrinking at 70% hidden, reach minimum at 95% hidden
          const shrinkProgress = Math.min(
            Math.max((rawPercentageHidden - 0.7) / (0.95 - 0.7), 0),
            1
          );
          // pick a value in range [minMatchArticleHeight, maxMatchArticleHeight] based on progress
          const matchArticleHeight =
            maxMatchArticleHeight -
            (maxMatchArticleHeight - minMatchArticleHeight) * shrinkProgress;
          // set the height of the match article
          matchArticle.style.setProperty(
            "max-height",
            `${matchArticleHeight}px`
          );
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
        }
        requestAnimationFrame(animate);
      });
    },
    []
  );

  React.useEffect(() => {
    if (!bracketRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          handleBracketIntersection(entry);
        });
      },
      {
        threshold: Array.from({ length: 1001 }, (_, i) => i / 1000),
      }
    );
    observer.observe(bracketRef.current);

    return () => observer.disconnect();
  }, [bracketRef, handleBracketIntersection]);
};
