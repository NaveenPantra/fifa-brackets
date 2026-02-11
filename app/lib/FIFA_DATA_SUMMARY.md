# FIFA Data (`app/lib/fifa.ts`) — Prompt Summary

## 1. Create brackets and matches with team names and dates

- Populate `fifa.ts` with tournament bracket data.
- Five brackets: Round of 32, Round of 16, Quarter Finals, Semi Finals, Finals.
- Each bracket should be individually addressable (exported separately).
- Each match includes team names, dates, and venues.
- Only fill the data — no UI components.

## 2. Restructure as a single flat list with binary tree indexing

- All matches should live in a single 0-based indexed array.
- The array follows a complete binary tree layout so you can query parent, left child, and right child by index.
- Tree navigation: `parent(i) = floor((i-1)/2)`, `leftChild(i) = 2i+1`, `rightChild(i) = 2i+2`.
- The third-place match was treated as an orphan (index 31) outside the tree, since it doesn't fit the binary tree structure.

## 3. Remove the third-place match entirely

- Remove `"third-place"` from the `Round` type.
- Remove the `THIRD_PLACE_INDEX` constant.
- Remove the third-place match entry (index 31) from the matches array.
- Remove the `isThirdPlace()` helper.
- Clean up all third-place guards from tree navigation functions.
- Result: a clean 31-element array (indices 0–30).

## 4. Add an `id` field to each match

- Each match needs a unique `id` string.
- The id will be used to observe DOM element positions and adjust parent/child positioning accordingly.
- Pattern used: `match-{index}` (e.g. `match-0`, `match-15`).
