export function BirthdayFab({ onPress }: { onPress: () => void }) {
  return (
    <button
      type="button"
      onClick={onPress}
      aria-label="It's your birthday"
      className="fixed bottom-(--fab-bottom) left-4 z-30 flex size-12 items-center justify-center rounded-full bg-primary text-xl shadow-lg transition-transform active:scale-95 md:hidden"
    >
      🎂
    </button>
  )
}
