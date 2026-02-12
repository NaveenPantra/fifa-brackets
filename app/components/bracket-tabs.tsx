import { allBrackets } from "@/app/lib/fifa";

export default function BracketTabs() {
  return (
    <section
      className="grid grid-cols-5 overflow-x-auto whitespace-nowrap py-2 bg-black/40 backdrop-blur-md rounded-lg mt-4 sticky top-16 left-0 z-10"
      style={{
        gridTemplateColumns:
          "repeat(5, minmax(calc(calc(var(--spacing)*16) + 300px), 1fr))",
      }}
    >
      {allBrackets.map((bracket) => (
        <button
          key={bracket.id}
          id={bracket.tabId}
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
