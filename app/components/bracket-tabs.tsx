"use client";

import React from "react";
import { allBrackets } from "@/app/lib/fifa";
import { smoothScrollTo, smoothScrollThroughSteps } from "@/app/lib/utils";

function useScrollToTab() {
  const isScrollingRef = React.useRef(false);
  const [activeTabId, setActiveTabId] = React.useState(allBrackets[0].id);
  const tabsSectionRef = React.useRef<HTMLElement>(null);

  const handleTabClick = React.useCallback(async (targetBracketId: string) => {
    // Prevent overlapping scroll animations
    if (isScrollingRef.current) return;

    // Use View Transition for the active tab indicator morph
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        setActiveTabId(targetBracketId);
      });
    } else {
      setActiveTabId(targetBracketId);
    }

    // Scroll the clicked tab button to center of the tabs section
    const bracket = allBrackets.find((b) => b.id === targetBracketId);
    if (bracket && tabsSectionRef.current) {
      const tabButton = document.getElementById(bracket.tabId);
      if (tabButton) {
        const section = tabsSectionRef.current;
        const targetScrollLeft =
          tabButton.offsetLeft -
          section.offsetLeft -
          section.clientWidth / 2 +
          tabButton.offsetWidth / 2;
        smoothScrollTo(section, targetScrollLeft, 300);
      }
    }

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

  return { handleTabClick, activeTabId, tabsSectionRef };
}

export default function BracketTabs() {
  const { handleTabClick, activeTabId, tabsSectionRef } = useScrollToTab();

  return (
    <section
      ref={tabsSectionRef}
      className="overflow-auto whitespace-nowrap py-2 bg-black/40 backdrop-blur-md rounded-lg mt-4 sticky top-16 left-0 z-10 scrollbar-none"
      style={{
        gridTemplateColumns: "",
      }}
    >
      {allBrackets.map((bracket) => (
        <button
          key={bracket.id}
          id={bracket.tabId}
          onClick={() => handleTabClick(bracket.id)}
          className={`text-md shrink-0 py-2 px-8 text-inherit cursor-pointer font-semibold text-left relative${
            bracket === allBrackets[0] ? " ml-0" : ""
          }`}
        >
          <h2>{bracket.name}</h2>
          {activeTabId === bracket.id && (
            <span className="tab-active-indicator" />
          )}
        </button>
      ))}
    </section>
  );
}
