import React from "react";
import { parent, leftChild, rightChild, Match, matches, isLeaf } from "./fifa";

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
      // console.log({
      //   index,
      //   leftChildIndex: leftChildMatch.index,
      //   rightChildIndex: rightChildMatch.index,
      // });
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
      const rightChildBottom = rightChildRect.bottom - childParentRect.top;
      const leftAndRightChildMiddle = (leftChildBottom + rightChildTop) / 2;
      matchCardRef.current.style.setProperty(
        "--translate-y",
        `calc(${leftAndRightChildMiddle}px - 50%)`
      );

      // if (index === 8) debugger;

      // child-connector
      const leftChildConnector = matchCardRef.current.querySelector(
        ".match-child-connector-left"
      ) as HTMLDivElement;
      const rightChildConnector = matchCardRef.current.querySelector(
        ".match-child-connector-right"
      ) as HTMLDivElement;
      if (!leftChildConnector || !rightChildConnector) return;
      const leftChildMiddle = leftChildBottom - leftChildRect.height / 2;
      const leftChildConnectorHeight =
        leftAndRightChildMiddle - leftChildMiddle - 15;
      // console.log({
      //   leftChildMiddle,
      //   leftAndRightChildMiddle,
      //   leftChildConnectorHeight,
      //   index,
      // });
      leftChildConnector.style.setProperty(
        "--height",
        `${leftChildConnectorHeight}px`
      );
      const rightChildMiddle = rightChildBottom - rightChildRect.height / 2;
      const rightChildConnectorHeight =
        rightChildMiddle - leftAndRightChildMiddle - 20;
      rightChildConnector.style.setProperty(
        "--height",
        `${rightChildConnectorHeight}px`
      );
      matchCardRef.current.setAttribute("data-rendering-complete", "true");
    });
  }, [leftChildMatch, rightChildMatch, matchCardRef]);

  React.useEffect(() => {
    if (isLeaf) return;
    async function setPosition() {
      // await new Promise((resolve) => setTimeout(resolve, 100));
      await updateStyles();
    }
    setPosition();
  }, [updateStyles, isLeaf]);

  const resizeObserver = React.useRef<ResizeObserver | null>(null);

  const observerLeftAndRightChildSizes = React.useCallback(() => {
    if (isLeaf) return;
    if (!matchCardRef.current) return;
    if (!leftChildMatch || !rightChildMatch) return;
    const leftChild = document.getElementById(`match-${leftChildMatch.index}`);
    const rightChild = document.getElementById(
      `match-${rightChildMatch.index}`
    );
    if (!leftChild || !rightChild) return;
    resizeObserver.current = new ResizeObserver(() => {
      updateStyles();
    });
    resizeObserver.current.observe(leftChild);
    resizeObserver.current.observe(rightChild);
  }, [isLeaf, matchCardRef, leftChildMatch, rightChildMatch, updateStyles]);

  React.useEffect(() => {
    if (!matchCardRef.current) return;
    // observer for left and child sizes and update styles
    // observerLeftAndRightChildSizes();

    return () => {
      if (resizeObserver.current) {
        resizeObserver.current.disconnect();
      }
    };
  }, [matchCardRef, observerLeftAndRightChildSizes]);
};

// interface UseObserverMatchCardsProps {}
export const useObserverMatchCards = () => {
  const resizeObserver = React.useRef<ResizeObserver | null>(null);

  const updateChildConnectors = React.useCallback(
    (matchCard: HTMLDivElement) => {
      requestAnimationFrame(() => {
        if (!matchCard) return;
        const leftChildConnector = matchCard.querySelector(
          ".match-child-connector-left"
        ) as HTMLDivElement;
        const rightChildConnector = matchCard.querySelector(
          ".match-child-connector-right"
        ) as HTMLDivElement;
        if (!leftChildConnector || !rightChildConnector) return;
        const leftChildConnectorRect =
          leftChildConnector.getBoundingClientRect();
        const rightChildConnectorRect =
          rightChildConnector.getBoundingClientRect();
      });
    },
    []
  );

  const observerMatchCards = React.useCallback(
    (matchCards: HTMLDivElement[]) => {
      return (entries: ResizeObserverEntry[]) => {
        requestAnimationFrame(() => {
          matchCards.forEach((matchCard) => {
            updateChildConnectors(matchCard);
          });
        });
      };
    },
    [updateChildConnectors]
  );

  React.useEffect(() => {
    async function initObserver() {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const matchCards = document.querySelectorAll(
        ".match-card-container"
      ) as NodeListOf<HTMLDivElement>;
      resizeObserver.current = new ResizeObserver(
        observerMatchCards(Array.from(matchCards))
      );
      matchCards.forEach((matchCard) => {
        resizeObserver.current?.observe(matchCard as Element);
      });
    }

    initObserver();
    return () => {
      if (!resizeObserver.current) return;
      resizeObserver.current.disconnect();
    };
  }, [observerMatchCards]);
};
