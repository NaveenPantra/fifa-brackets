import { getLeftChildIndex, getParentIndex, getRightChildIndex } from "./fifa";
import { updateEdge } from "./edges";

interface UpdateNodePositionByItsChildProps {
  matchCard: HTMLDivElement;
  index: number;
}
export const updateNodePositionByItsChild = ({
  matchCard,
  index,
}: UpdateNodePositionByItsChildProps) => {
  if (!matchCard) return;
  const leftChild = document.getElementById(
    `match-${getLeftChildIndex(index)}`
  );
  const rightChild = document.getElementById(
    `match-${getRightChildIndex(index)}`
  );
  const parentNode = document.getElementById(
    `match-${getParentIndex(index)}`
  ) as HTMLDivElement;
  if (!leftChild || !rightChild) return;

  // Get the current translateY from the resolved transform so we can
  // compute the card's natural (in-flow) center without resetting styles.
  const computedTransform = getComputedStyle(matchCard).transform;
  const currentTranslateY =
    computedTransform && computedTransform !== "none"
      ? new DOMMatrix(computedTransform).m42
      : 0;

  const matchCardRect = matchCard.getBoundingClientRect();
  const leftChildRect = leftChild.getBoundingClientRect();
  const rightChildRect = rightChild.getBoundingClientRect();

  // Natural center of the card (without translateY) in viewport coords
  const naturalCenterY =
    matchCardRect.top - currentTranslateY + matchCardRect.height / 2;

  // Desired center: midpoint between left child bottom and right child top
  const desiredCenterY = (leftChildRect.bottom + rightChildRect.top) / 2;

  // Offset needed to move card from natural center to desired center
  const newTranslateY = desiredCenterY - naturalCenterY;
  matchCard.style.setProperty("--translate-y", `${newTranslateY}px`);
  matchCard.setAttribute("data-rendering-complete", "true");

  // @ts-expect-error - edge is always an SVGSVGElement
  const leftChildEdge = document.getElementById(
    `edge-${getLeftChildIndex(index)}-${index}`
  ) as SVGSVGElement;
  // @ts-expect-error - edge is always an SVGSVGElement
  const rightChildEdge = document.getElementById(
    `edge-${getRightChildIndex(index)}-${index}`
  ) as SVGSVGElement;

  const parentEdge = document.getElementById(
    `edge-${index}-${getParentIndex(index)}`
  ) as unknown as SVGSVGElement;

  updateEdge(
    leftChild as HTMLDivElement,
    matchCard,
    leftChildEdge as SVGSVGElement
  );
  updateEdge(
    rightChild as HTMLDivElement,
    matchCard,
    rightChildEdge as SVGSVGElement
  );
  updateEdge(matchCard, parentNode, parentEdge as SVGSVGElement);
  const currentHeightOfMatchCard = matchCardRect.height;
  matchCard.style.setProperty("height", `${currentHeightOfMatchCard - 2}px`);
  requestAnimationFrame(async () => {
    // await new Promise((resolve) => setTimeout(resolve, 0));
    matchCard.style.removeProperty("height");
  });
};
