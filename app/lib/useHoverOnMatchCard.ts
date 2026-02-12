/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { matches, parent } from "./fifa";
import { updateEdge } from "./edges";

interface UseHoverOnMatchCardProps {
  matchCardRef: React.RefObject<HTMLDivElement | any>;
  index: number;
}
export const useHoverOnMatchCard = ({
  matchCardRef,
  index,
}: UseHoverOnMatchCardProps) => {
  const matchData = matches[index];

  const animationTime = 400;

  const handleActiveMatchCard = React.useCallback(() => {
    const matchCardRect = matchCardRef.current.getBoundingClientRect();
    if (matchCardRect.x <= 0) return;
    const affectedMatchCards = getMatchCardWithParentAndEdgeNodeForRepositon(
      matchCardRef.current,
      index
    );
    const matchCardContainer = matchCardRef.current.querySelector(
      ".match-extra-info-container"
    ) as HTMLDivElement;
    const matchCardContainerHeight =
      matchCardContainer.getBoundingClientRect().height;
    let currentHeight = matchCardContainerHeight;
    const startTime = performance.now();
    const targetHeight = 186;
    function animate() {
      const currentTime = performance.now();
      const elapsedTime = currentTime - startTime;
      const progress = elapsedTime / animationTime;
      // linear-interpolate between currentHeight and targetHeight
      currentHeight = currentHeight + (targetHeight - currentHeight) * progress;
      if (currentHeight >= targetHeight) currentHeight = targetHeight;
      matchCardContainer.style.height = `${currentHeight}px`;
      affectedMatchCards.forEach(([matchCard, parentMatchCard, edge]) => {
        updateEdge(
          matchCard as HTMLDivElement,
          parentMatchCard as HTMLDivElement,
          edge as SVGSVGElement
        );
      });
      if (progress >= 1 || currentHeight >= targetHeight) return;
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }, [animationTime, matchCardRef, index]);

  const handleBlurMatchCard = React.useCallback(() => {
    const affectedMatchCards = getMatchCardWithParentAndEdgeNodeForRepositon(
      matchCardRef.current,
      index
    );
    const matchCardContainer = matchCardRef.current.querySelector(
      ".match-extra-info-container"
    ) as HTMLDivElement;
    const matchCardContainerHeight =
      matchCardContainer.getBoundingClientRect().height;
    let currentHeight = matchCardContainerHeight;
    const startTime = performance.now();
    const targetHeight = 0;
    function animate() {
      const currentTime = performance.now();
      const elapsedTime = currentTime - startTime;
      const progress = elapsedTime / animationTime;
      // linear-interpolate between currentHeight and targetHeight
      currentHeight = currentHeight + (targetHeight - currentHeight) * progress;
      if (currentHeight <= 0) currentHeight = 0;
      matchCardContainer.style.height = `${currentHeight}px`;
      affectedMatchCards.forEach(([matchCard, parentMatchCard, edge]) => {
        updateEdge(
          matchCard as HTMLDivElement,
          parentMatchCard as HTMLDivElement,
          edge as SVGSVGElement
        );
      });
      if (progress >= 1 || currentHeight <= 0) return;
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }, [animationTime, matchCardRef, index]);

  React.useEffect(() => {
    if (!matchCardRef.current) return;
    matchCardRef.current.addEventListener("mouseenter", handleActiveMatchCard);
    matchCardRef.current.addEventListener("mouseleave", handleBlurMatchCard);
    matchCardRef.current.addEventListener("focusin", handleActiveMatchCard);
    matchCardRef.current.addEventListener("focusout", handleBlurMatchCard);

    return () => {
      if (!matchCardRef.current) return;
      matchCardRef.current.removeEventListener(
        "mouseenter",
        handleActiveMatchCard
      );
      matchCardRef.current.removeEventListener(
        "mouseleave",
        handleActiveMatchCard
      );
      matchCardRef.current.removeEventListener(
        "focusin",
        handleActiveMatchCard
      );
      matchCardRef.current.removeEventListener("focusout", handleBlurMatchCard);
    };
  }, [handleActiveMatchCard, handleBlurMatchCard, matchCardRef]);
};

const getMatchCardWithParentAndEdgeNodeForRepositon = (
  initialMatchCard: HTMLDivElement,
  index: number
): [HTMLDivElement, HTMLDivElement, SVGSVGElement][] => {
  const level = Math.floor(Math.log2(index + 1));
  const levelRange = [Math.pow(2, level) - 1, Math.pow(2, level + 1) - 2];
  const currentMatchCardIndex = index - levelRange[0];

  const affectedMatchCards = [
    ...(initialMatchCard.parentElement as HTMLDivElement).children,
  ].slice(currentMatchCardIndex) as HTMLDivElement[];

  // @ts-expect-error - affectedMatchCards is always an HTMLDivElement[]
  return affectedMatchCards
    .map(
      (
        matchCard: HTMLDivElement
      ): [HTMLDivElement, HTMLDivElement, SVGSVGElement | null] => {
        const matchCardIndex = Number(
          matchCard.getAttribute("data-match-index") as string
        );
        const parentIndex = parent(matchCardIndex);
        const parentMatchCard = document.getElementById(`match-${parentIndex}`);
        // @ts-expect-error - edge is always an SVGSVGElement
        const edge = document.getElementById(
          `edge-${matchCardIndex}-${parentIndex}`
        ) as SVGSVGElement;
        return [
          matchCard as HTMLDivElement,
          parentMatchCard as HTMLDivElement,
          edge,
        ];
      }
    )
    .filter(Boolean);
};

// window.getSmoothStepEndPoints = getSmoothStepEndPoints;
