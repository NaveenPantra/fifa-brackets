"use client";

import React from "react";
import { allBrackets } from "@/app/lib/fifa";
import { smoothScrollThroughSteps } from "@/app/lib/utils";

function useScrollToTab() {
  const isScrollingRef = React.useRef(false);

  const handleTabClick = React.useCallback(async (targetBracketId: string) => {
    // Prevent overlapping scroll animations
    if (isScrollingRef.current) return;

    const targetSection = document.getElementById(targetBracketId);
    if (!targetSection) return;
    const scrollContainer = targetSection.parentElement;
    if (!scrollContainer) return;

    // Find which bracket index is currently closest to the left edge
    const containerLeft = scrollContainer.getBoundingClientRect().left;
    let currentIdx = 0;
    let minDist = Infinity;
    for (let i = 0; i < allBrackets.length; i++) {
      const section = document.getElementById(allBrackets[i].id);
      if (!section) continue;
      const dist = Math.abs(
        section.getBoundingClientRect().left - containerLeft
      );
      if (dist < minDist) {
        minDist = dist;
        currentIdx = i;
      }
    }

    const targetIdx = allBrackets.findIndex((b) => b.id === targetBracketId);
    if (targetIdx === -1 || targetIdx === currentIdx) return;

    // Build waypoints for each bracket between current and target
    const step = targetIdx > currentIdx ? 1 : -1;
    const steps: number[] = [];
    for (let i = currentIdx + step; ; i += step) {
      const section = document.getElementById(allBrackets[i].id);
      if (section) {
        steps.push(section.offsetLeft - scrollContainer.offsetLeft);
      }
      if (i === targetIdx) break;
    }

    isScrollingRef.current = true;
    await smoothScrollThroughSteps(scrollContainer, steps, 500);
    isScrollingRef.current = false;
  }, []);

  return handleTabClick;
}

export default function BracketTabs() {
  const handleTabClick = useScrollToTab();

  return (
    <section
      className="overflow-auto  whitespace-nowrap py-2 bg-black/40 backdrop-blur-md rounded-lg mt-4 sticky top-16 left-0 z-10"
      style={{
        gridTemplateColumns: "",
      }}
    >
      {allBrackets.map((bracket) => (
        <button
          key={bracket.id}
          id={bracket.tabId}
          onClick={() => handleTabClick(bracket.id)}
          className={`text-md flex-shrink-0 py-2 px-8 text-inherit cursor-pointer font-semibold text-left${
            bracket === allBrackets[0] ? " ml-0" : ""
          }`}
        >
          <h2>{bracket.name}</h2>
        </button>
      ))}
    </section>
  );
}
