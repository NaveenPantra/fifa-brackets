import React from "react";
import { useGetConnectedMatches } from "./hooks";
import { updateNodePositionByItsChild } from "./nodes";
import { getLeftChildIndex, getRightChildIndex } from "./fifa";

interface SetPositionOfMatchCardProps {
  matchCardRef: React.RefObject<HTMLDivElement | null>;
  index: number;
}
export const useSetPositionOfMatchCardBasedOnChild = ({
  matchCardRef,
  index,
}: SetPositionOfMatchCardProps) => {
  const { leftChildMatch, rightChildMatch, isLeaf } = useGetConnectedMatches({
    index,
  });

  const updateStyles = React.useCallback(async () => {
    requestAnimationFrame(async () => {
      if (!matchCardRef.current) return;
      updateNodePositionByItsChild({
        matchCard: matchCardRef.current as HTMLDivElement,
        index,
      });
    });
  }, [matchCardRef, index]);

  React.useEffect(() => {
    if (isLeaf) return;
    async function setPosition() {
      //   await new Promise((resolve) => setTimeout(resolve, 10));
      await updateStyles();
    }
    setPosition();
  }, [updateStyles, isLeaf]);

  React.useEffect(() => {
    if (!matchCardRef.current) return;

    const leftChild = document.getElementById(
      `match-${getLeftChildIndex(index)}`
    ) as HTMLDivElement;
    const rightChild = document.getElementById(
      `match-${getRightChildIndex(index)}`
    ) as HTMLDivElement;
    if (!leftChild || !rightChild) return;

    const resizeObserver = new ResizeObserver(() => {
      if (leftChild.getAttribute("data-expanded") === "true") return;
      //   if (leftChildRect.x >= 0) return;
      updateStyles();
    });

    resizeObserver.observe(leftChild as HTMLDivElement);
    // since it's a perfect binary tree.
    // resizeObserver.observe(rightChild as HTMLDivElement);
    return () => {
      resizeObserver.disconnect();
    };
  }, [updateStyles, matchCardRef, index]);
};
