/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { getLeftChildIndex, matches } from "./fifa";
import { updateEdge, updateEdgeForNodeLevel } from "./edges";

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
      currentHeight = currentHeight + (targetHeight - currentHeight) * progress;
      if (currentHeight >= targetHeight) currentHeight = targetHeight;
      matchCardContainer.style.height = `${currentHeight}px`;
      updateEdgeForNodeLevel(matchCardRef.current);
      const childMatchCard = document.getElementById(
        `match-${getLeftChildIndex(index)}`
      );
      updateEdgeForNodeLevel(childMatchCard as HTMLDivElement);
      if (progress >= 1 || currentHeight >= targetHeight) return;
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }, [animationTime, matchCardRef, index]);

  const handleBlurMatchCard = React.useCallback(() => {
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
      currentHeight = currentHeight + (targetHeight - currentHeight) * progress;
      if (currentHeight <= 0) currentHeight = 0;
      matchCardContainer.style.height = `${currentHeight}px`;
      updateEdgeForNodeLevel(matchCardRef.current);
      const childMatchCard = document.getElementById(
        `match-${getLeftChildIndex(index)}`
      );
      updateEdgeForNodeLevel(childMatchCard as HTMLDivElement);
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

// window.getSmoothStepEndPoints = getSmoothStepEndPoints;
