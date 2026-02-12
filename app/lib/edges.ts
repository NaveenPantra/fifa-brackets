import { Point, getParentIndex } from "./fifa";

export const buildEdgePath = (
  from: Point,
  to: Point,
  radius: number = 12
): string => {
  const { x: x1, y: y1 } = from;
  const { x: x2, y: y2 } = to;

  if (Math.abs(x1 - x2) < 0.5) {
    return `M ${x1} ${y1} L ${x2} ${y2}`;
  }

  if (Math.abs(y1 - y2) < 0.5) {
    return `M ${x1} ${y1} L ${x2} ${y2}`;
  }

  const midX = (x1 + x2) / 2;

  const maxRadiusX = Math.abs(midX - x1);
  const maxRadiusY = Math.abs(y2 - y1) / 2;
  const r = Math.min(radius, maxRadiusX, maxRadiusY);

  const goingDown = y2 > y1;
  const goingRight = x2 > x1;

  if (goingRight && goingDown) {
    // → ↓ →
    return [
      `M ${x1} ${y1}`,
      `L ${midX - r} ${y1}`,
      `Q ${midX} ${y1} ${midX} ${y1 + r}`,
      `L ${midX} ${y2 - r}`,
      `Q ${midX} ${y2} ${midX + r} ${y2}`,
      `L ${x2} ${y2}`,
    ].join(" ");
  }

  if (goingRight && !goingDown) {
    // → ↑ →
    return [
      `M ${x1} ${y1}`,
      `L ${midX - r} ${y1}`,
      `Q ${midX} ${y1} ${midX} ${y1 - r}`,
      `L ${midX} ${y2 + r}`,
      `Q ${midX} ${y2} ${midX + r} ${y2}`,
      `L ${x2} ${y2}`,
    ].join(" ");
  }

  if (!goingRight && goingDown) {
    // ← ↓ ←
    return [
      `M ${x1} ${y1}`,
      `L ${midX + r} ${y1}`,
      `Q ${midX} ${y1} ${midX} ${y1 + r}`,
      `L ${midX} ${y2 - r}`,
      `Q ${midX} ${y2} ${midX - r} ${y2}`,
      `L ${x2} ${y2}`,
    ].join(" ");
  }

  // ← ↑ ←
  return [
    `M ${x1} ${y1}`,
    `L ${midX + r} ${y1}`,
    `Q ${midX} ${y1} ${midX} ${y1 - r}`,
    `L ${midX} ${y2 + r}`,
    `Q ${midX} ${y2} ${midX - r} ${y2}`,
    `L ${x2} ${y2}`,
  ].join(" ");
};

export const getEdgeSvgLayout = (
  from: Point,
  to: Point,
  strokeWidth: number = 3
) => {
  const padding = strokeWidth;
  const left = Math.min(from.x, to.x) - padding;
  const top = Math.min(from.y, to.y) - padding;
  const width = Math.abs(to.x - from.x) + padding * 2;
  const height = Math.abs(to.y - from.y) + padding * 2;
  const viewBox = `${left} ${top} ${width} ${height}`;
  return { left, top, width, height, viewBox };
};

export const updateEdge = (
  sourceNode: HTMLDivElement,
  targetNode: HTMLDivElement,
  svg: SVGSVGElement,
  radius: number = 12,
  strokeWidth: number = 3
): void => {
  if (!svg) return;
  const pathEl = svg.querySelector("path") as SVGPathElement | null;
  if (!pathEl) return;

  const offsetParent = svg.parentElement as HTMLElement | null;
  const parentRect = offsetParent
    ? offsetParent.getBoundingClientRect()
    : { left: 0, top: 0 };

  const sourceRect = sourceNode.getBoundingClientRect();
  const targetRect = targetNode.getBoundingClientRect();

  const source: Point = {
    x: sourceRect.right - parentRect.left,
    y: sourceRect.top + sourceRect.height / 2 - parentRect.top,
  };

  const target: Point = {
    x: targetRect.left - parentRect.left,
    y: targetRect.top + targetRect.height / 2 - parentRect.top,
  };

  const d = buildEdgePath(source, target, radius);
  const layout = getEdgeSvgLayout(source, target, strokeWidth);

  svg.style.left = `${layout.left}px`;
  svg.style.top = `${layout.top}px`;
  svg.style.width = `${layout.width}px`;
  svg.style.height = `${layout.height}px`;
  svg.setAttribute("viewBox", layout.viewBox);

  pathEl.setAttribute("d", d);
};

export const updatedEdgesNodeInLevel = () => {};

export const updateEdgeForNodeLevel = (
  initialMatchCard: HTMLDivElement
  // index: number
) => {
  if (!initialMatchCard) return;
  // const level = Math.floor(Math.log2(index + 1));
  // const levelRange = [Math.pow(2, level) - 1, Math.pow(2, level + 1) - 2];
  // const currentMatchCardIndex = index - levelRange[0];

  const affectedMatchCards = [
    ...(initialMatchCard.parentElement as HTMLDivElement).children,
  ] as HTMLDivElement[];

  const nodesAndEdge = affectedMatchCards
    .map(
      (
        matchCard: HTMLDivElement
      ): [HTMLDivElement, HTMLDivElement, SVGSVGElement | null] => {
        const matchCardIndex = Number(
          matchCard.getAttribute("data-match-index") as string
        );
        const parentIndex = getParentIndex(matchCardIndex);
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

  nodesAndEdge.forEach(([matchCard, parentMatchCard, edge]) => {
    updateEdge(
      matchCard as HTMLDivElement,
      parentMatchCard as HTMLDivElement,
      edge as SVGSVGElement
    );
  });
};
