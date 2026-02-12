import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Easing function: ease-in-out cubic
 */
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Smoothly scroll a container's scrollLeft to a target value
 * using requestAnimationFrame over the given duration.
 * Returns a promise that resolves when the animation completes.
 */
export function smoothScrollTo(
  container: HTMLElement,
  targetScrollLeft: number,
  duration: number = 500
): Promise<void> {
  return new Promise((resolve) => {
    const startScrollLeft = container.scrollLeft;
    const distance = targetScrollLeft - startScrollLeft;
    if (Math.abs(distance) < 1) {
      resolve();
      return;
    }

    const startTime = performance.now();

    function animate() {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(progress);

      container.scrollLeft = startScrollLeft + distance * eased;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        resolve();
      }
    }

    requestAnimationFrame(animate);
  });
}

/**
 * Incrementally scroll through a list of waypoint scrollLeft values,
 * spending `durationPerStep` ms on each step.
 */
export async function smoothScrollThroughSteps(
  container: HTMLElement,
  steps: number[],
  durationPerStep: number = 500
): Promise<void> {
  for (const targetScrollLeft of steps) {
    await smoothScrollTo(container, targetScrollLeft, durationPerStep);
  }
}
