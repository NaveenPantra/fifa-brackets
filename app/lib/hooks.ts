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
      const childParent = leftChild.parentElement;
      if (!childParent) return;
      // console.log({ index, childParent, leftChild, rightChild });
      // while (true) {
      //   await new Promise((resolve) => setTimeout(resolve, 10));
      //   if (
      //     leftChild.getAttribute("data-rendering-complete") === "true" &&
      //     rightChild.getAttribute("data-rendering-complete") === "true"
      //   )
      //     break;
      // }
      const childParentRect = childParent.getBoundingClientRect();
      const leftChildRect = leftChild.getBoundingClientRect();
      const rightChildRect = rightChild.getBoundingClientRect();
      const leftChildBottom = leftChildRect.bottom - childParentRect.top;
      const rightChildTop = rightChildRect.top - childParentRect.top;
      const leftAndRightChildMiddle = (leftChildBottom + rightChildTop) / 2;
      matchCardRef.current.style.setProperty(
        "--translate-y",
        `calc(${leftAndRightChildMiddle}px - 50%)`
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
