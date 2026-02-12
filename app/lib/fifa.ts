// ── Types ──────────────────────────────────────────────────

export interface Point {
  x: number;
  y: number;
}
export interface Team {
  name: string;
  code: string;
}

export enum MatchStatus {
  Live = "live",
  Upcoming = "upcoming",
  Completed = "completed",
}

export interface Match {
  id: string;
  index: number;
  team1: Team;
  team2: Team;
  date: string; // ISO date string
  venue: string;
  round: Round;
  prominenceTag?: string;
  status: MatchStatus;
}

export type Round =
  | "finals"
  | "semi-finals"
  | "quarter-finals"
  | "round-of-16"
  | "round-of-32";

export interface RoundInfo {
  id: Round;
  name: string;
  shortName: string;
  startIndex: number;
  endIndex: number; // inclusive
}

export interface Bracket {
  id: string;
  tabId: string;
  name: string;
  shortName: string;
  round: Round;
  matches: Match[];
  extraMatches?: Match[];
}

// ── Binary Tree Layout ─────────────────────────────────────
//
// The matches array is a 0-based complete binary tree:
//
//   Index 0           → Final                 (1 match)
//   Indices 1–2       → Semi Finals           (2 matches)
//   Indices 3–6       → Quarter Finals        (4 matches)
//   Indices 7–14      → Round of 16           (8 matches)
//   Indices 15–30     → Round of 32           (16 matches)
//
// Navigation:
//   parent(i)     = Math.floor((i - 1) / 2)
//   leftChild(i)  = 2 * i + 1
//   rightChild(i) = 2 * i + 2
//
// The winner of leftChild(i) becomes team1 of match i.
// The winner of rightChild(i) becomes team2 of match i.
//

// ── Round Metadata ─────────────────────────────────────────

export const rounds: RoundInfo[] = [
  { id: "finals", name: "Final", shortName: "F", startIndex: 0, endIndex: 0 },
  {
    id: "semi-finals",
    name: "Semi Finals",
    shortName: "SF",
    startIndex: 1,
    endIndex: 2,
  },
  {
    id: "quarter-finals",
    name: "Quarter Finals",
    shortName: "QF",
    startIndex: 3,
    endIndex: 6,
  },
  {
    id: "round-of-16",
    name: "Round of 16",
    shortName: "R16",
    startIndex: 7,
    endIndex: 14,
  },
  {
    id: "round-of-32",
    name: "Round of 32",
    shortName: "R32",
    startIndex: 15,
    endIndex: 30,
  },
];

// ── Teams ──────────────────────────────────────────────────

const teams = {
  argentina: { name: "Argentina", code: "ARG" },
  brazil: { name: "Brazil", code: "BRA" },
  france: { name: "France", code: "FRA" },
  germany: { name: "Germany", code: "GER" },
  spain: { name: "Spain", code: "ESP" },
  england: { name: "England", code: "ENG" },
  portugal: { name: "Portugal", code: "POR" },
  netherlands: { name: "Netherlands", code: "NED" },
  italy: { name: "Italy", code: "ITA" },
  belgium: { name: "Belgium", code: "BEL" },
  croatia: { name: "Croatia", code: "CRO" },
  uruguay: { name: "Uruguay", code: "URU" },
  colombia: { name: "Colombia", code: "COL" },
  mexico: { name: "Mexico", code: "MEX" },
  usa: { name: "United States", code: "USA" },
  canada: { name: "Canada", code: "CAN" },
  japan: { name: "Japan", code: "JPN" },
  southKorea: { name: "South Korea", code: "KOR" },
  australia: { name: "Australia", code: "AUS" },
  senegal: { name: "Senegal", code: "SEN" },
  morocco: { name: "Morocco", code: "MAR" },
  nigeria: { name: "Nigeria", code: "NGA" },
  cameroon: { name: "Cameroon", code: "CMR" },
  ghana: { name: "Ghana", code: "GHA" },
  switzerland: { name: "Switzerland", code: "SUI" },
  denmark: { name: "Denmark", code: "DEN" },
  sweden: { name: "Sweden", code: "SWE" },
  poland: { name: "Poland", code: "POL" },
  serbia: { name: "Serbia", code: "SRB" },
  ecuador: { name: "Ecuador", code: "ECU" },
  chile: { name: "Chile", code: "CHI" },
  iran: { name: "Iran", code: "IRN" },
  saudiArabia: { name: "Saudi Arabia", code: "KSA" },
  qatar: { name: "Qatar", code: "QAT" },
  costaRica: { name: "Costa Rica", code: "CRC" },
  peru: { name: "Peru", code: "PER" },
  wales: { name: "Wales", code: "WAL" },
  tunisia: { name: "Tunisia", code: "TUN" },
  algeria: { name: "Algeria", code: "ALG" },
  egypt: { name: "Egypt", code: "EGY" },
  ukraine: { name: "Ukraine", code: "UKR" },
  austria: { name: "Austria", code: "AUT" },
  czechia: { name: "Czechia", code: "CZE" },
  turkey: { name: "Turkey", code: "TUR" },
  scotland: { name: "Scotland", code: "SCO" },
  panama: { name: "Panama", code: "PAN" },
  jamaica: { name: "Jamaica", code: "JAM" },
  newZealand: { name: "New Zealand", code: "NZL" },
} as const;

// ── Matches (single flat array, 0-based binary tree) ───────
//
// [0]        Final
// [1–2]      Semi Finals
// [3–6]      Quarter Finals
// [7–14]     Round of 16
// [15–30]    Round of 32

export const matches: Match[] = [
  // ── Index 0: Final ──────────────────────────────────────
  {
    id: "match-0",
    index: 0,
    team1: teams.argentina,
    team2: teams.usa,
    date: "2026-07-19",
    venue: "MetLife Stadium, New York",
    round: "finals",
    prominenceTag: "Final",
    status: MatchStatus.Live,
  },

  // ── Indices 1–2: Semi Finals ────────────────────────────
  {
    id: "match-1",
    index: 1,
    team1: teams.argentina,
    team2: teams.brazil,
    date: "2026-07-14",
    venue: "MetLife Stadium, New York",
    round: "semi-finals",
    status: MatchStatus.Live,
  },
  {
    id: "match-2",
    index: 2,
    team1: teams.italy,
    team2: teams.usa,
    date: "2026-07-15",
    venue: "AT&T Stadium, Dallas",
    round: "semi-finals",
    status: MatchStatus.Live,
  },

  // ── Indices 3–6: Quarter Finals ─────────────────────────
  {
    id: "match-3",
    index: 3,
    team1: teams.argentina,
    team2: teams.spain,
    date: "2026-07-10",
    venue: "MetLife Stadium, New York",
    round: "quarter-finals",
    status: MatchStatus.Live,
  },
  {
    id: "match-4",
    index: 4,
    team1: teams.brazil,
    team2: teams.portugal,
    date: "2026-07-10",
    venue: "Hard Rock Stadium, Miami",
    round: "quarter-finals",
    status: MatchStatus.Live,
  },
  {
    id: "match-5",
    index: 5,
    team1: teams.italy,
    team2: teams.croatia,
    date: "2026-07-11",
    venue: "AT&T Stadium, Dallas",
    round: "quarter-finals",
    status: MatchStatus.Live,
  },
  {
    id: "match-6",
    index: 6,
    team1: teams.usa,
    team2: teams.colombia,
    date: "2026-07-11",
    venue: "SoFi Stadium, Los Angeles",
    round: "quarter-finals",
    status: MatchStatus.Live,
  },

  // ── Indices 7–14: Round of 16 ──────────────────────────
  {
    id: "match-7",
    index: 7,
    team1: teams.argentina,
    team2: teams.poland,
    date: "2026-07-04",
    venue: "MetLife Stadium, New York",
    round: "round-of-16",
    status: MatchStatus.Live,
  },
  {
    id: "match-8",
    index: 8,
    team1: teams.spain,
    team2: teams.chile,
    date: "2026-07-04",
    venue: "Hard Rock Stadium, Miami",
    round: "round-of-16",
    status: MatchStatus.Live,
  },
  {
    id: "match-9",
    index: 9,
    team1: teams.brazil,
    team2: teams.senegal,
    date: "2026-07-05",
    venue: "AT&T Stadium, Dallas",
    round: "round-of-16",
    status: MatchStatus.Live,
  },
  {
    id: "match-10",
    index: 10,
    team1: teams.portugal,
    team2: teams.netherlands,
    date: "2026-07-05",
    venue: "SoFi Stadium, Los Angeles",
    round: "round-of-16",
    status: MatchStatus.Live,
  },
  {
    id: "match-11",
    index: 11,
    team1: teams.italy,
    team2: teams.belgium,
    date: "2026-07-06",
    venue: "Mercedes-Benz Stadium, Atlanta",
    round: "round-of-16",
    status: MatchStatus.Live,
  },
  {
    id: "match-12",
    index: 12,
    team1: teams.croatia,
    team2: teams.japan,
    date: "2026-07-06",
    venue: "Lumen Field, Seattle",
    round: "round-of-16",
    status: MatchStatus.Live,
  },
  {
    id: "match-13",
    index: 13,
    team1: teams.usa,
    team2: teams.mexico,
    date: "2026-07-07",
    venue: "AT&T Stadium, Dallas",
    round: "round-of-16",
    status: MatchStatus.Live,
  },
  {
    id: "match-14",
    index: 14,
    team1: teams.colombia,
    team2: teams.canada,
    date: "2026-07-07",
    venue: "BMO Field, Toronto",
    round: "round-of-16",
    status: MatchStatus.Live,
  },

  // ── Indices 15–30: Round of 32 ─────────────────────────
  {
    id: "match-15",
    index: 15,
    team1: teams.argentina,
    team2: teams.nigeria,
    date: "2026-06-28",
    venue: "MetLife Stadium, New York",
    round: "round-of-32",
    status: MatchStatus.Live,
  },
  {
    id: "match-16",
    index: 16,
    team1: teams.france,
    team2: teams.poland,
    date: "2026-06-28",
    venue: "AT&T Stadium, Dallas",
    round: "round-of-32",
    status: MatchStatus.Live,
  },
  {
    id: "match-17",
    index: 17,
    team1: teams.spain,
    team2: teams.ecuador,
    date: "2026-06-28",
    venue: "Hard Rock Stadium, Miami",
    round: "round-of-32",
    status: MatchStatus.Live,
  },
  {
    id: "match-18",
    index: 18,
    team1: teams.germany,
    team2: teams.chile,
    date: "2026-06-28",
    venue: "SoFi Stadium, Los Angeles",
    round: "round-of-32",
    status: MatchStatus.Live,
  },
  {
    id: "match-19",
    index: 19,
    team1: teams.brazil,
    team2: teams.tunisia,
    date: "2026-06-29",
    venue: "Lumen Field, Seattle",
    round: "round-of-32",
    status: MatchStatus.Live,
  },
  {
    id: "match-20",
    index: 20,
    team1: teams.england,
    team2: teams.senegal,
    date: "2026-06-29",
    venue: "NRG Stadium, Houston",
    round: "round-of-32",
    status: MatchStatus.Live,
  },
  {
    id: "match-21",
    index: 21,
    team1: teams.portugal,
    team2: teams.cameroon,
    date: "2026-06-29",
    venue: "Lincoln Financial Field, Philadelphia",
    round: "round-of-32",
    status: MatchStatus.Live,
  },
  {
    id: "match-22",
    index: 22,
    team1: teams.netherlands,
    team2: teams.iran,
    date: "2026-06-29",
    venue: "BMO Field, Toronto",
    round: "round-of-32",
    status: MatchStatus.Live,
  },
  {
    id: "match-23",
    index: 23,
    team1: teams.italy,
    team2: teams.saudiArabia,
    date: "2026-06-30",
    venue: "Mercedes-Benz Stadium, Atlanta",
    round: "round-of-32",
    status: MatchStatus.Live,
  },
  {
    id: "match-24",
    index: 24,
    team1: teams.belgium,
    team2: teams.ghana,
    date: "2026-06-30",
    venue: "Levi's Stadium, San Francisco",
    round: "round-of-32",
    status: MatchStatus.Live,
  },
  {
    id: "match-25",
    index: 25,
    team1: teams.croatia,
    team2: teams.morocco,
    date: "2026-06-30",
    venue: "Arrowhead Stadium, Kansas City",
    round: "round-of-32",
    status: MatchStatus.Live,
  },
  {
    id: "match-26",
    index: 26,
    team1: teams.uruguay,
    team2: teams.japan,
    date: "2026-06-30",
    venue: "Estadio Azteca, Mexico City",
    round: "round-of-32",
    status: MatchStatus.Live,
  },
  {
    id: "match-27",
    index: 27,
    team1: teams.usa,
    team2: teams.algeria,
    date: "2026-07-01",
    venue: "MetLife Stadium, New York",
    round: "round-of-32",
    status: MatchStatus.Live,
  },
  {
    id: "match-28",
    index: 28,
    team1: teams.mexico,
    team2: teams.scotland,
    date: "2026-07-01",
    venue: "Estadio Azteca, Mexico City",
    round: "round-of-32",
    status: MatchStatus.Live,
  },
  {
    id: "match-29",
    index: 29,
    team1: teams.colombia,
    team2: teams.australia,
    date: "2026-07-01",
    venue: "Gillette Stadium, Boston",
    round: "round-of-32",
    status: MatchStatus.Live,
  },
  {
    id: "match-30",
    index: 30,
    team1: teams.canada,
    team2: teams.southKorea,
    date: "2026-07-01",
    venue: "BC Place, Vancouver",
    round: "round-of-32",
    status: MatchStatus.Live,
  },
];

// ── Brackets ───────────────────────────────────────────────

export const roundOf32: Bracket = {
  id: "bracket-4",
  tabId: "round-of-32-tab",
  name: "Round of 32",
  shortName: "R32",
  round: "round-of-32",
  matches: matches.slice(15, 31),
};

export const roundOf16: Bracket = {
  id: "bracket-3",
  tabId: "round-of-16-tab",
  name: "Round of 16",
  shortName: "R16",
  round: "round-of-16",
  matches: matches.slice(7, 15),
};

export const quarterFinals: Bracket = {
  id: "bracket-2",
  tabId: "quarter-finals-tab",
  name: "Quarter Finals",
  shortName: "QF",
  round: "quarter-finals",
  matches: matches.slice(3, 7),
};

export const semiFinals: Bracket = {
  id: "bracket-1",
  tabId: "semi-finals-tab",
  name: "Semi Finals",
  shortName: "SF",
  round: "semi-finals",
  matches: matches.slice(1, 3),
};

export const finals: Bracket = {
  id: "bracket-0",
  tabId: "finals-tab",
  name: "Final",
  shortName: "F",
  round: "finals",
  matches: matches.slice(0, 1),
  extraMatches: [
    {
      id: "match-31",
      index: Infinity,
      prominenceTag: "Third Place",
      team1: teams.brazil,
      team2: teams.italy,
      date: "2026-07-18",
      venue: "Hard Rock Stadium, Miami",
      round: "finals",
      status: MatchStatus.Live,
    },
  ],
};

export const allBrackets: Bracket[] = [
  roundOf32,
  roundOf16,
  quarterFinals,
  semiFinals,
  finals,
];

// ── Tree Navigation Helpers ────────────────────────────────

/** Parent match index (the match this one feeds into). */
export function getParentIndex(i: number): number {
  return Math.floor((i - 1) / 2);
}

/** Left child match index (feeds team1 of match i). */
export function getLeftChildIndex(i: number): number {
  return 2 * i + 1;
}

/** Right child match index (feeds team2 of match i). */
export function getRightChildIndex(i: number): number {
  return 2 * i + 2;
}

/** Is this a leaf match (Round of 32)? */
export function isLeaf(i: number): boolean {
  const leftChildIndex = getLeftChildIndex(i);
  return leftChildIndex >= matches.length;
}

// ── Query Helpers ──────────────────────────────────────────

/** Get a match by its array index. */
export function getMatch(index: number): Match | undefined {
  return matches[index];
}

/** Get all matches for a given round. */
export function getMatchesByRound(round: Round): Match[] {
  return matches.filter((m) => m.round === round);
}

/** Get round metadata by round id. */
export function getRound(id: Round): RoundInfo | undefined {
  return rounds.find((r) => r.id === id);
}

/** Get all matches on a given date. */
export function getMatchesByDate(date: string): Match[] {
  return matches.filter((m) => m.date === date);
}

/** Format a date string for display. */
export function formatMatchDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Get the two feeder matches for a given match. */
export function getFeederMatches(
  i: number
): [Match | undefined, Match | undefined] {
  const l = getLeftChildIndex(i);
  const r = getRightChildIndex(i);
  return [
    l !== null ? matches[l] : undefined,
    r !== null ? matches[r] : undefined,
  ];
}

/** Get the match that this match feeds into. */
export function getNextMatch(i: number): Match | undefined {
  const p = getParentIndex(i);
  return p !== null ? matches[p] : undefined;
}

export const isFirstChildForParent = (i: number): boolean => {
  const p = getParentIndex(i);
  return p !== null ? i === getLeftChildIndex(p) : false;
};

export const isSecondChildForParent = (i: number): boolean => {
  const p = getParentIndex(i);
  return p !== null ? i === getRightChildIndex(p) : false;
};
