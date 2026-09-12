/** Which rooms to join and which to leave, going from the ones held to the ones wanted now. */
export function roomChanges(
  joined: ReadonlySet<string>,
  wanted: ReadonlySet<string>
): { join: string[]; leave: string[] } {
  return {
    join: [...wanted].filter((room) => !joined.has(room)),
    leave: [...joined].filter((room) => !wanted.has(room)),
  }
}
