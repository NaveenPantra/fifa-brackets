import React from "react";
import { updateEdge } from "./edges";

interface CachedCard {
  matchCard: HTMLDivElement;
  article: HTMLDivElement;
  matchIndex: string | null;
  parentMatchIndex: string | null;
  parentMatchCard: HTMLDivElement | null;
  edge: SVGSVGElement | null;
}

interface UseIntersectionObserverProps {
  bracketRef: React.RefObject<HTMLDivElement>;
}
export const useIntersectionObserver = ({
  bracketRef,
}: UseIntersectionObserverProps) => {
  const cachedCardsRef = React.useRef<CachedCard[] | null>(null);

  const buildCache = React.useCallback(() => {
    const bracket = bracketRef.current;
    if (!bracket) return;

    const matchCards = [
      ...bracket.querySelectorAll(".match-card-container"),
    ] as HTMLDivElement[];

    cachedCardsRef.current = matchCards.map((matchCard) => {
      const matchIndex = matchCard.getAttribute("data-match-index");
      const parentMatchIndex = matchCard.getAttribute(
        "data-parent-match-index"
      );
      const parentMatchCard = parentMatchIndex
        ? (document.getElementById(
            `match-${parentMatchIndex}`
          ) as HTMLDivElement | null)
        : null;
      const edge =
        matchIndex && parentMatchIndex
          ? (document.getElementById(
              `edge-${matchIndex}-${parentMatchIndex}`
            ) as SVGSVGElement | null)
          : null;

      return {
        matchCard,
        article: matchCard.querySelector("article") as HTMLDivElement,
        matchIndex,
        parentMatchIndex,
        parentMatchCard,
        edge,
      };
    });
  }, [bracketRef]);

  const updateMatchCards = React.useCallback(() => {
    if (!cachedCardsRef.current) buildCache();
    const cards = cachedCardsRef.current;
    if (!cards || cards.length === 0) return;

    const maxHeight = 160;
    const minHeight = 65;
    const shrinkStart = 0.1;
    const shrinkEnd = 0.9;

    // ── Batch READ: collect all rects at once ──
    const measurements = cards.map(({ matchCard }) =>
      matchCard.getBoundingClientRect()
    );

    // ── Compute new values (pure math, no DOM) ──
    const updates: {
      idx: number;
      articleHeight: number;
    }[] = [];

    for (let i = 0; i < cards.length; i++) {
      const rect = measurements[i];
      if (rect.x > 10) continue;

      const rawPercentageHidden = Math.abs(rect.x) / rect.width;
      const shrinkProgress = Math.min(
        Math.max(
          (rawPercentageHidden - shrinkStart) / (shrinkEnd - shrinkStart),
          0
        ),
        1
      );
      const articleHeight =
        maxHeight - (maxHeight - minHeight) * shrinkProgress;

      updates.push({ idx: i, articleHeight });
    }

    // ── Batch WRITE: apply all styles, then update edges ──
    for (const { idx, articleHeight } of updates) {
      cards[idx].article.style.setProperty("max-height", `${articleHeight}px`);
    }

    // Edge updates after all layout writes are flushed
    for (const { idx } of updates) {
      const card = cards[idx];
      if (card.parentMatchCard && card.edge) {
        updateEdge(card.matchCard, card.parentMatchCard, card.edge);
      }
    }
  }, [buildCache]);

  React.useEffect(() => {
    if (!bracketRef.current) return;
    const scrollParent = bracketRef.current.parentElement;
    if (!scrollParent) return;

    // Build cache once DOM is ready
    buildCache();

    const handleScroll = () => {
      updateMatchCards();
    };

    scrollParent.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      scrollParent.removeEventListener("scroll", handleScroll);
    };
  }, [bracketRef, updateMatchCards, buildCache]);
};
