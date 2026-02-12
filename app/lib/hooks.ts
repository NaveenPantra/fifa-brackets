import React from "react";
import { parent, leftChild, rightChild, Match, matches, isLeaf } from "./fifa";
import { updateEdge } from "./edges";

interface ConnectedMatchesProps {
  index: number;
}
interface ConnectedMatchesReturn {
  parentMatch: Match | null;
  leftChildMatch: Match | null;
  rightChildMatch: Match | null;
  isLeaf: boolean;
}
export const useConnectedMatches = ({
  index,
}: ConnectedMatchesProps): ConnectedMatchesReturn => {
  const parentIndex = parent(index);
  const leftChildIndex = leftChild(index);
  const rightChildIndex = rightChild(index);

  const parentMatch =
    parentIndex !== null && parentIndex !== undefined
      ? matches[parentIndex]
      : null;
  const leftChildMatch =
    leftChildIndex !== null && leftChildIndex !== undefined
      ? matches[leftChildIndex]
      : null;
  const rightChildMatch =
    rightChildIndex !== null && rightChildIndex !== undefined
      ? matches[rightChildIndex]
      : null;

  return {
    parentMatch: parentMatch,
    leftChildMatch: leftChildMatch,
    rightChildMatch: rightChildMatch,
    isLeaf: isLeaf(index),
  };
};

export const useFirstChildForParent = ({
  index,
}: ConnectedMatchesProps): boolean => {
  const parentIndex = parent(index);
  return parentIndex !== null && parentIndex !== undefined
    ? leftChild(parentIndex) === index
    : false;
};

interface SetPositionOfMatchCardProps {
  matchCardRef: React.RefObject<HTMLDivElement | null>;
  index: number;
}
export const useSetPositionOfMatchCardBasedOnChild = ({
  matchCardRef,
  index,
}: SetPositionOfMatchCardProps) => {
  const { leftChildMatch, rightChildMatch, isLeaf } = useConnectedMatches({
    index,
  });

  const updateStyles = React.useCallback(async () => {
    requestAnimationFrame(async () => {
      if (!matchCardRef.current) return;
      if (!leftChildMatch || !rightChildMatch) return;
      const leftChild = document.getElementById(
        `match-${leftChildMatch.index}`
      );
      const rightChild = document.getElementById(
        `match-${rightChildMatch.index}`
      );
      if (!leftChild || !rightChild) return;

      // Get the current translateY from the resolved transform so we can
      // compute the card's natural (in-flow) center without resetting styles.
      const computedTransform = getComputedStyle(
        matchCardRef.current
      ).transform;
      const currentTranslateY =
        computedTransform && computedTransform !== "none"
          ? new DOMMatrix(computedTransform).m42
          : 0;

      const matchCardRect = matchCardRef.current.getBoundingClientRect();
      const leftChildRect = leftChild.getBoundingClientRect();
      const rightChildRect = rightChild.getBoundingClientRect();

      // Natural center of the card (without translateY) in viewport coords
      const naturalCenterY =
        matchCardRect.top - currentTranslateY + matchCardRect.height / 2;

      // Desired center: midpoint between left child bottom and right child top
      const desiredCenterY =
        (leftChildRect.bottom + rightChildRect.top) / 2;

      // Offset needed to move card from natural center to desired center
      const newTranslateY = desiredCenterY - naturalCenterY;
      matchCardRef.current.style.setProperty(
        "--translate-y",
        `${newTranslateY}px`
      );
      matchCardRef.current.setAttribute("data-rendering-complete", "true");

      // @ts-expect-error - edge is always an SVGSVGElement
      const leftChildEdge = document.getElementById(
        `edge-${leftChildMatch.index}-${index}`
      ) as SVGSVGElement;
      // @ts-expect-error - edge is always an SVGSVGElement
      const rightChildEdge = document.getElementById(
        `edge-${rightChildMatch.index}-${index}`
      ) as SVGSVGElement;
      updateEdge(
        leftChild as HTMLDivElement,
        matchCardRef.current,
        leftChildEdge as SVGSVGElement
      );
      updateEdge(
        rightChild as HTMLDivElement,
        matchCardRef.current,
        rightChildEdge as SVGSVGElement
      );
    });
  }, [leftChildMatch, rightChildMatch, matchCardRef, index]);

  React.useEffect(() => {
    if (isLeaf) return;
    async function setPosition() {
      // await new Promise((resolve) => setTimeout(resolve, 100));
      await updateStyles();
    }
    setPosition();
  }, [updateStyles, isLeaf]);
};
