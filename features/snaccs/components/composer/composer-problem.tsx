export function ComposerProblem({ problem }: { problem: string | null }) {
  if (!problem) return null

  return <p className="px-4 pb-2 text-sm text-destructive">{problem}</p>
}
