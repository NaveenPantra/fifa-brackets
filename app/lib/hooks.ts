import React from "react";
import {
  getParentIndex,
  getLeftChildIndex,
  getRightChildIndex,
  Match,
  matches,
  isLeaf,
} from "./fifa";
import { updateNodePositionByItsChild } from "./nodes";

interface ConnectedMatchesProps {
  index: number;
}
interface ConnectedMatchesReturn {
  parentMatch: Match | null;
  leftChildMatch: Match | null;
  rightChildMatch: Match | null;
  isLeaf: boolean;
}
export const useGetConnectedMatches = ({
  index,
}: ConnectedMatchesProps): ConnectedMatchesReturn => {
  const parentIndex = getParentIndex(index);
  const leftChildIndex = getLeftChildIndex(index);
  const rightChildIndex = getRightChildIndex(index);

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
  const parentIndex = getParentIndex(index);
  return parentIndex !== null && parentIndex !== undefined
    ? getLeftChildIndex(parentIndex) === index
    : false;
};
