import { Entrant } from "../types";

export function buildOwnerMap(allEntrants: Entrant[]) {
  const ownerMap = new Map<string, string[]>();

  for (const e of allEntrants) {
    for (const code of e.teamCodes) {
      const key = String(code).trim().toUpperCase();
      const existing = ownerMap.get(key) ?? [];
      existing.push(e.name);
      ownerMap.set(key, existing);
    }
  }

  return ownerMap;
}
